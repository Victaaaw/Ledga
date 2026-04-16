const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { createClient } = require("@supabase/supabase-js");

// ---------------------------------------------------------------------------
// 1. Parse .env.local
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
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---------------------------------------------------------------------------
// 2. Categories and prompt
// ---------------------------------------------------------------------------
const CATEGORIES = [
  "business_monetisation",
  "go_to_market",
  "legal_compliance",
  "personal_ideas",
  "product_features",
  "technical",
];

const CATEGORY_DESCRIPTIONS = {
  business_monetisation: "Revenue, pricing, sales, monetisation strategy",
  go_to_market: "Launch, marketing, positioning, competitive landscape",
  legal_compliance: "Legal, compliance, regulations, IP, privacy",
  personal_ideas: "Personal reflections, brainstorms, life, family",
  product_features: "Product development, features, UX, technical specs",
  technical: "Architecture, code, infrastructure, databases",
};

const SYSTEM_PROMPT =
  "You are a categorization API. Respond with ONLY valid JSON. No explanations, no markdown, no code fences.";

function buildPrompt(name, description) {
  return `Categorize this topic into exactly one of these categories:
${CATEGORIES.map((c) => `- "${c}" — ${CATEGORY_DESCRIPTIONS[c]}`).join("\n")}

Topic name: ${name}
Topic description: ${description}

Return ONLY a JSON object: {"category": "one of the categories above"}`;
}

// ---------------------------------------------------------------------------
// 3. Call Claude CLI
// ---------------------------------------------------------------------------
function callClaude(prompt) {
  const result = execSync(
    `C:\\Users\\User\\.local\\bin\\claude.exe -p --output-format json --system-prompt "${SYSTEM_PROMPT.replace(/"/g, '\\"')}"`,
    {
      input: prompt,
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
      timeout: 60_000,
      shell: true,
    }
  );

  const cliResponse = JSON.parse(result);
  let text = cliResponse.result || cliResponse.text || result;
  if (typeof text === "object") text = JSON.stringify(text);

  // Strip markdown fences
  text = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");

  return JSON.parse(text);
}

// ---------------------------------------------------------------------------
// 4. Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("Fetching topics needing (re)categorization...");

  const { data: allTopics, error } = await supabase
    .from("topics")
    .select("id, name, description, category");

  if (error) {
    console.error("Failed to fetch topics:", error.message);
    if (error.message.includes("category")) {
      console.error(
        '\nThe "category" column does not exist yet. Please run this SQL in Supabase:\n' +
          "  ALTER TABLE topics ADD COLUMN category TEXT;\n"
      );
    }
    process.exit(1);
  }

  const validSet = new Set(CATEGORIES);
  const topics = (allTopics || []).filter(
    (t) => !t.category || !validSet.has(t.category)
  );

  if (topics.length === 0) {
    console.log("All topics are already in a valid category.");
    return;
  }

  console.log(`Found ${topics.length} topic(s) needing (re)categorization.\n`);

  let categorized = 0;

  for (const topic of topics) {
    console.log(`Categorizing: "${topic.name}"...`);

    try {
      const prompt = buildPrompt(topic.name, topic.description || "");
      const result = callClaude(prompt);
      const category = result.category;

      if (!CATEGORIES.includes(category)) {
        console.log(`  Warning: "${category}" is not a known category, using anyway.`);
      }

      const { error: updateError } = await supabase
        .from("topics")
        .update({ category })
        .eq("id", topic.id);

      if (updateError) {
        console.error(`  Failed to update topic ${topic.id}:`, updateError.message);
        continue;
      }

      console.log(`  → ${category}`);
      categorized++;
    } catch (err) {
      console.error(`  Failed to categorize "${topic.name}":`, err.message);
    }
  }

  console.log(`\nDone. Categorized ${categorized}/${topics.length} topics.`);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
