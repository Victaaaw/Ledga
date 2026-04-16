const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { createClient } = require("@supabase/supabase-js");

// ---------------------------------------------------------------------------
// 1. Parse .env.local for Supabase credentials
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = path.resolve(__dirname, "..", ".env.local");
  const contents = fs.readFileSync(envPath, "utf-8");
  const vars = {};
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    vars[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return vars;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---------------------------------------------------------------------------
// 2. Extraction prompt (mirrors src/app/api/extract/route.ts)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// 3. Call Claude Code CLI via child_process
// ---------------------------------------------------------------------------
function callClaude(transcript) {
  const userMessage = `${EXTRACTION_PROMPT}\n\n--- TRANSCRIPT ---\n${transcript}`;
  const result = execSync(
    `C:\\Users\\User\\.local\\bin\\claude.exe -p --output-format json --system-prompt "${SYSTEM_PROMPT.replace(/"/g, '\\"')}"`,
    {
      input: userMessage,
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024, // 10 MB
      timeout: 120_000, // 2 minutes
      shell: true,
    }
  );

  // The CLI JSON output wraps the response: { result: "...", ... }
  const cliResponse = JSON.parse(result);
  const text = cliResponse.result || cliResponse.text || result;
  if (typeof text === "object") return JSON.stringify(text);
  return text;
}

// ---------------------------------------------------------------------------
// 4. Process a single transcript
// ---------------------------------------------------------------------------
async function processTranscript(transcript) {
  const { id, raw_content, user_id } = transcript;
  console.log(`Processing transcript ${id}...`);

  // Mark as processing
  await supabase
    .from("transcripts")
    .update({ processing_status: "processing" })
    .eq("id", id);

  let extraction;
  try {
    let responseText = callClaude(raw_content);
    // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
    responseText = responseText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    extraction = JSON.parse(responseText);
  } catch (err) {
    console.error(`  Failed to get/parse Claude response for ${id}:`, err.message);
    await supabase
      .from("transcripts")
      .update({
        processing_status: "failed",
        processing_error: `CLI extraction failed: ${err.message}`,
      })
      .eq("id", id);
    return;
  }

  // Insert topics and build name -> id map
  const topicMap = new Map();

  if (extraction.topics && extraction.topics.length > 0) {
    const topicRows = extraction.topics.map((t) => ({
      user_id,
      transcript_id: id,
      name: t.name,
      description: t.description,
      category: t.category || null,
    }));

    const { data: insertedTopics, error: topicError } = await supabase
      .from("topics")
      .insert(topicRows)
      .select("id, name");

    if (topicError) {
      console.error(`  Failed to insert topics for ${id}:`, topicError.message);
      await supabase
        .from("transcripts")
        .update({
          processing_status: "failed",
          processing_error: `Failed to insert topics: ${topicError.message}`,
        })
        .eq("id", id);
      return;
    }

    if (insertedTopics) {
      for (const t of insertedTopics) {
        topicMap.set(t.name, t.id);
      }
    }
  }

  // Insert insights linked to topics
  let insightsCount = 0;

  if (extraction.insights && extraction.insights.length > 0) {
    const insightRows = extraction.insights.map((i) => ({
      user_id,
      transcript_id: id,
      topic_id: topicMap.get(i.topic_name) || null,
      insight_type: i.insight_type,
      content: i.content,
      context: i.context,
      confidence_score: i.confidence_score,
      context_tag: i.context_tag ?? null,
    }));

    const { error: insightError } = await supabase
      .from("insights")
      .insert(insightRows);

    if (insightError) {
      console.error(`  Failed to insert insights for ${id}:`, insightError.message);
      await supabase
        .from("transcripts")
        .update({
          processing_status: "failed",
          processing_error: `Failed to insert insights: ${insightError.message}`,
        })
        .eq("id", id);
      return;
    }

    insightsCount = insightRows.length;
  }

  // Mark as completed
  await supabase
    .from("transcripts")
    .update({
      processing_status: "completed",
      processed_at: new Date().toISOString(),
    })
    .eq("id", id);

  console.log(
    `  Done: ${topicMap.size} topics, ${insightsCount} insights extracted.`
  );
}

// ---------------------------------------------------------------------------
// 5. Main — fetch pending transcripts and process each
// ---------------------------------------------------------------------------
async function main() {
  console.log("Fetching pending transcripts...");

  const { data: transcripts, error } = await supabase
    .from("transcripts")
    .select("id, raw_content, user_id")
    .eq("processing_status", "pending");

  if (error) {
    console.error("Failed to fetch transcripts:", error.message);
    process.exit(1);
  }

  if (!transcripts || transcripts.length === 0) {
    console.log("No pending transcripts found.");
    return;
  }

  console.log(`Found ${transcripts.length} pending transcript(s).\n`);

  for (const transcript of transcripts) {
    await processTranscript(transcript);
  }

  console.log("\nAll done.");
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
