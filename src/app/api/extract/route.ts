import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { execSync } from "child_process";

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

function callClaude(transcript: string): string {
  const userMessage = `${EXTRACTION_PROMPT}\n\n--- TRANSCRIPT ---\n${transcript}`;

  let rawOutput: string;
  try {
    rawOutput = execSync(
      `C:\\Users\\User\\.local\\bin\\claude.exe -p --output-format json --system-prompt "${SYSTEM_PROMPT.replace(/"/g, '\\"')}"`,
      {
        input: userMessage,
        encoding: "utf-8" as const,
        maxBuffer: 10 * 1024 * 1024,
        timeout: 120_000,
        shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
        windowsHide: true,
      },
    );
  } catch (execErr: unknown) {
    const e = execErr as { status?: number; stderr?: string; stdout?: string };
    console.error("[callClaude] execSync failed");
    console.error("[callClaude] exit code:", e.status);
    console.error("[callClaude] stderr:", e.stderr);
    console.error("[callClaude] stdout:", e.stdout);
    throw execErr;
  }

  console.log("[callClaude] raw CLI output:", rawOutput.slice(0, 500));

  let cliResponse: Record<string, unknown>;
  try {
    cliResponse = JSON.parse(rawOutput);
  } catch {
    console.error("[callClaude] Failed to parse CLI JSON wrapper. Full output:");
    console.error(rawOutput);
    throw new Error("Claude CLI returned non-JSON output");
  }

  if (cliResponse.is_error) {
    console.error("[callClaude] CLI reported error:", cliResponse.result);
    throw new Error(`Claude CLI error: ${cliResponse.result}`);
  }

  const text = cliResponse.result ?? cliResponse.text ?? rawOutput;
  if (typeof text === "object") return JSON.stringify(text);
  return text as string;
}

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

    // Mark as processing
    await supabase
      .from("transcripts")
      .update({ processing_status: "processing" })
      .eq("id", transcriptId);

    // Call Claude Code CLI for extraction
    let responseText: string;
    try {
      responseText = callClaude(transcript.raw_content);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[extract] CLI call failed for transcript", transcriptId, message);
      await supabase
        .from("transcripts")
        .update({
          processing_status: "failed",
          processing_error: `CLI extraction failed: ${message}`,
        })
        .eq("id", transcriptId);

      return NextResponse.json(
        { error: "Claude CLI extraction failed" },
        { status: 500 }
      );
    }

    // Strip markdown code fences if present
    responseText = responseText
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?```\s*$/, "");

    console.log("[extract] Claude response to parse:", responseText.slice(0, 500));

    let extraction: ExtractionResult;
    try {
      extraction = JSON.parse(responseText);
    } catch (parseErr) {
      console.error("[extract] JSON parse failed for transcript", transcriptId);
      console.error("[extract] Parse error:", parseErr);
      console.error("[extract] Full responseText:", responseText);
      await supabase
        .from("transcripts")
        .update({
          processing_status: "failed",
          processing_error: "Failed to parse AI extraction response",
        })
        .eq("id", transcriptId);

      return NextResponse.json(
        { error: "Failed to parse extraction result" },
        { status: 500 }
      );
    }

    // Merge extracted topics with existing ones by name (case-insensitive).
    // topicMap is keyed by NORMALIZED name so insights can resolve reliably even
    // if the LLM uses inconsistent casing between topic and insight references.
    const normalizeName = (n: string) => n.trim().toLowerCase();
    const topicMap = new Map<string, string>();

    if (extraction.topics && extraction.topics.length > 0) {
      // Dedupe extracted topics by normalized name (keep first occurrence's metadata)
      const uniqueExtracted = new Map<string, ExtractedTopic>();
      for (const t of extraction.topics) {
        const key = normalizeName(t.name);
        if (key && !uniqueExtracted.has(key)) uniqueExtracted.set(key, t);
      }

      // Fetch this user's existing topics so we can match by name (case-insensitive).
      // RLS already scopes by user, but we add the explicit filter for clarity.
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

      // Partition: reuse existing ids, collect new topics to insert.
      const topicsToInsert: ExtractedTopic[] = [];
      for (const [key, topic] of uniqueExtracted) {
        const existingId = existingByName.get(key);
        if (existingId) {
          topicMap.set(key, existingId);
        } else {
          topicsToInsert.push(topic);
        }
      }

      // Insert only the new ones. transcript_id on new topics records the
      // first transcript that created them; merged topics keep their original.
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
          })
          .eq("id", transcriptId);

        return NextResponse.json(
          { error: "Failed to save insights" },
          { status: 500 }
        );
      }

      insightsCount = insightRows.length;
    }

    // Mark transcript as completed
    await supabase
      .from("transcripts")
      .update({
        processing_status: "completed",
        processed_at: new Date().toISOString(),
      })
      .eq("id", transcriptId);

    return NextResponse.json({
      success: true,
      transcriptId,
      topicsExtracted: topicMap.size,
      insightsExtracted: insightsCount,
    });
  } catch (error) {
    console.error("Extraction error:", error);

    return NextResponse.json(
      { error: "Internal server error during extraction" },
      { status: 500 }
    );
  }
}
