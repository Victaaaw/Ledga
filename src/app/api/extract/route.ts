import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// =============================================================================
// CONFIG
// =============================================================================

const MODEL_ID = "claude-haiku-4-5";

// Guardrail: reject transcripts over this size before spending money on the API.
// ~50k tokens ≈ 200k characters ≈ a very long document. Real user transcripts
// should be well under this. Acts as a sanity check, not a typical limit.
const MAX_TRANSCRIPT_CHARS = 200_000;

// =============================================================================
// PROMPTS
// =============================================================================

const SYSTEM_PROMPT =
  "You are a JSON-only extraction API. You MUST respond with ONLY valid JSON. No explanations, no markdown, no code fences, no conversational text. Your entire response must be parseable by JSON.parse().";

const EXTRACTION_PROMPT = `Extract topics and insights from the following conversation transcript.

Return ONLY a JSON object in this exact format (no other text before or after):
{"topics":[{"name":"short topic name","description":"one sentence summary","category":"one of the categories below"}],"insights":[{"insight_type":"decision|commitment|insight|pivot|task","content":"concise summary","context":"relevant quote from transcript","confidence_score":0.95,"topic_name":"must match a topic name above","context_tag":"personal|business|mixed"}]}

Rules:
- category MUST be one of: "business_monetisation", "go_to_market", "legal_compliance", "personal_ideas", "product_features", "technical"
  - "business_monetisation" = revenue, pricing, sales, monetisation strategy
  - "go_to_market" = launch, marketing, positioning, competitive landscape
  - "legal_compliance" = legal, compliance, regulations, IP, privacy
  - "personal_ideas" = personal reflections, brainstorms, life, family
  - "product_features" = product development, features, UX, technical specs
  - "technical" = architecture, code, infrastructure, databases
- insight_type MUST be one of: "decision", "commitment", "insight", "pivot", "task"
  - "decision" = a choice that has been made
  - "commitment" = a promise or agreement to do something
  - "insight" = a realisation, learning, or observation
  - "pivot" = a change in direction or approach
  - "task" = an actionable item that needs to be done, often time-bound (e.g. "follow up next week", "send the proposal", "book a meeting with X", "register the domain"). Tasks are concrete to-dos, not commitments to a person and not abstract decisions.
- context_tag MUST be one of: "personal", "business", "mixed"
  - "personal" = family, health, life admin, hobbies, self-reflection
  - "business" = ventures, clients, products, revenue, partnerships
  - "mixed" = clearly overlaps both personal and business (e.g. a family-run business decision, a hobby being monetised). Only use "mixed" when both sides are genuinely present — when in doubt, pick the dominant one.
- topic_name MUST match the name of a topic in the topics array
- confidence_score MUST be a number between 0.0 and 1.0
- Output NOTHING except the JSON object — no markdown fences, no explanation`;

// =============================================================================
// TYPES
// =============================================================================

interface ExtractedTopic {
  name: string;
  description: string;
  category: string;
}

interface ExtractedInsight {
  insight_type: "decision" | "commitment" | "insight" | "pivot" | "task";
  content: string;
  context: string;
  confidence_score: number;
  topic_name: string;
  context_tag: "personal" | "business" | "mixed";
}

interface ExtractionResult {
  topics: ExtractedTopic[];
  insights: ExtractedInsight[];
}

interface CallClaudeResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

// =============================================================================
// ANTHROPIC API CALL (replaces the old CLI version)
// =============================================================================

async function callClaude(transcript: string): Promise<CallClaudeResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const client = new Anthropic({ apiKey });

  const userMessage = `${EXTRACTION_PROMPT}\n\n--- TRANSCRIPT ---\n${transcript}`;

  const response = await client.messages.create({
    model: MODEL_ID,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  // Extract text from response content blocks
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude API returned no text content");
  }

  return {
    text: textBlock.text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

// =============================================================================
// ROUTE HANDLER
// =============================================================================

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get transcript ID from request body
    const { transcriptId } = await request.json();

    if (!transcriptId) {
      return NextResponse.json(
        { error: "transcriptId is required" },
        { status: 400 }
      );
    }

    // Fetch the transcript (RLS ensures user can only access their own)
    const { data: transcript, error: fetchError } = await supabase
      .from("transcripts")
      .select("id, raw_content, processing_status, user_id")
      .eq("id", transcriptId)
      .single();

    if (fetchError || !transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    if (transcript.processing_status === "completed") {
      return NextResponse.json(
        { error: "Transcript has already been processed" },
        { status: 409 }
      );
    }

    // Guardrail: reject transcripts that are unreasonably large before spending money
    if (transcript.raw_content.length > MAX_TRANSCRIPT_CHARS) {
      await supabase
        .from("transcripts")
        .update({
          processing_status: "failed",
          processing_error: `Transcript too large: ${transcript.raw_content.length} characters (max ${MAX_TRANSCRIPT_CHARS}). Please split into smaller sections.`,
        })
        .eq("id", transcriptId);

      return NextResponse.json(
        {
          error: "Transcript too large",
          details: `Max size is ${MAX_TRANSCRIPT_CHARS} characters. Yours is ${transcript.raw_content.length}.`,
        },
        { status: 413 }
      );
    }

    // Mark as processing
    await supabase
      .from("transcripts")
      .update({ processing_status: "processing" })
      .eq("id", transcriptId);

    // Call Anthropic API for extraction
    let apiResult: CallClaudeResult;
    try {
      apiResult = await callClaude(transcript.raw_content);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        "[extract] API call failed for transcript",
        transcriptId,
        message
      );
      await supabase
        .from("transcripts")
        .update({
          processing_status: "failed",
          processing_error: `API extraction failed: ${message}`,
        })
        .eq("id", transcriptId);

      return NextResponse.json(
        { error: "Claude API extraction failed" },
        { status: 500 }
      );
    }

    // Log token usage for cost tracking
    console.log(
      `[extract] Tokens used — input: ${apiResult.inputTokens}, output: ${apiResult.outputTokens}`
    );

    // Strip markdown code fences if Claude returned any despite the prompt
    const responseText = apiResult.text
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?```\s*$/, "")
      .trim();

    let extraction: ExtractionResult;
    try {
      extraction = JSON.parse(responseText);
    } catch (parseErr) {
      console.error(
        "[extract] JSON parse failed for transcript",
        transcriptId
      );
      console.error("[extract] Parse error:", parseErr);
      console.error("[extract] Full responseText:", responseText);
      await supabase
        .from("transcripts")
        .update({
          processing_status: "failed",
          processing_error: "Failed to parse AI extraction response",
          input_tokens: apiResult.inputTokens,
          output_tokens: apiResult.outputTokens,
        })
        .eq("id", transcriptId);

      return NextResponse.json(
        { error: "Failed to parse extraction result" },
        { status: 500 }
      );
    }

    // Merge extracted topics with existing ones by name (case-insensitive).
    const normalizeName = (n: string) => n.trim().toLowerCase();
    const topicMap = new Map<string, string>();

    if (extraction.topics && extraction.topics.length > 0) {
      const uniqueExtracted = new Map<string, ExtractedTopic>();
      for (const t of extraction.topics) {
        const key = normalizeName(t.name);
        if (key && !uniqueExtracted.has(key)) uniqueExtracted.set(key, t);
      }

      const { data: existingTopics, error: existingError } = await supabase
        .from("topics")
        .select("id, name")
        .eq("user_id", user.id);

      if (existingError) {
        await supabase
          .from("transcripts")
          .update({
            processing_status: "failed",
            processing_error: `Failed to load existing topics: ${existingError.message}`,
            input_tokens: apiResult.inputTokens,
            output_tokens: apiResult.outputTokens,
          })
          .eq("id", transcriptId);

        return NextResponse.json(
          { error: "Failed to load existing topics" },
          { status: 500 }
        );
      }

      const existingByName = new Map<string, string>();
      for (const t of existingTopics || []) {
        existingByName.set(normalizeName(t.name), t.id);
      }

      const topicsToInsert: ExtractedTopic[] = [];
      for (const [key, topic] of uniqueExtracted) {
        const existingId = existingByName.get(key);
        if (existingId) {
          topicMap.set(key, existingId);
        } else {
          topicsToInsert.push(topic);
        }
      }

      if (topicsToInsert.length > 0) {
        const topicRows = topicsToInsert.map((topic) => ({
          user_id: user.id,
          transcript_id: transcriptId,
          name: topic.name,
          description: topic.description,
          category: topic.category || null,
        }));

        const { data: insertedTopics, error: topicError } = await supabase
          .from("topics")
          .insert(topicRows)
          .select("id, name");

        if (topicError) {
          await supabase
            .from("transcripts")
            .update({
              processing_status: "failed",
              processing_error: `Failed to insert topics: ${topicError.message}`,
              input_tokens: apiResult.inputTokens,
              output_tokens: apiResult.outputTokens,
            })
            .eq("id", transcriptId);

          return NextResponse.json(
            { error: "Failed to save topics" },
            { status: 500 }
          );
        }

        if (insertedTopics) {
          for (const topic of insertedTopics) {
            topicMap.set(normalizeName(topic.name), topic.id);
          }
        }
      }
    }

    // Insert insights with topic references
    let insightsCount = 0;

    if (extraction.insights && extraction.insights.length > 0) {
      const insightRows = extraction.insights.map((insight) => ({
        user_id: user.id,
        transcript_id: transcriptId,
        topic_id: topicMap.get(normalizeName(insight.topic_name)) || null,
        insight_type: insight.insight_type,
        content: insight.content,
        context: insight.context,
        confidence_score: insight.confidence_score,
        context_tag: insight.context_tag ?? null,
      }));

      const { error: insightError } = await supabase
        .from("insights")
        .insert(insightRows);

      if (insightError) {
        await supabase
          .from("transcripts")
          .update({
            processing_status: "failed",
            processing_error: `Failed to insert insights: ${insightError.message}`,
            input_tokens: apiResult.inputTokens,
            output_tokens: apiResult.outputTokens,
          })
          .eq("id", transcriptId);

        return NextResponse.json(
          { error: "Failed to save insights" },
          { status: 500 }
        );
      }

      insightsCount = insightRows.length;
    }

    // Mark transcript as completed and log token counts
    await supabase
      .from("transcripts")
      .update({
        processing_status: "completed",
        processed_at: new Date().toISOString(),
        input_tokens: apiResult.inputTokens,
        output_tokens: apiResult.outputTokens,
      })
      .eq("id", transcriptId);

    return NextResponse.json({
      success: true,
      transcriptId,
      topicsExtracted: topicMap.size,
      insightsExtracted: insightsCount,
      tokensUsed: {
        input: apiResult.inputTokens,
        output: apiResult.outputTokens,
      },
    });
  } catch (error) {
    console.error("Extraction error:", error);

    return NextResponse.json(
      { error: "Internal server error during extraction" },
      { status: 500 }
    );
  }
}
