# INTEGRATIONS.md — NDLedger External Integrations

*Mapped: 2026-05-05*

---

## Supabase (Primary Backend)

**Type:** Managed PostgreSQL + Auth + Row Level Security

**Client files:**
- `src/lib/supabase/client.ts` — browser client (`createBrowserClient`)
- `src/lib/supabase/server.ts` — server component client (`createServerClient` with cookies)
- `src/middleware.ts` — middleware client for auth guard

**Auth methods:**
- Email/password (`signInWithPassword`)
- Magic link OTP (`signInWithOtp` → redirect to `/auth/callback`)
- OAuth callback handler: `src/app/auth/callback/route.ts`

**Database tables (inferred from queries):**

| Table | Key columns | RLS |
|-------|-------------|-----|
| `transcripts` | `id`, `user_id`, `title`, `raw_content`, `processing_status`, `word_count`, `conversation_date`, `input_tokens`, `output_tokens` | Yes — users see only their rows |
| `topics` | `id`, `user_id`, `transcript_id`, `name`, `description`, `category` | Yes |
| `insights` | `id`, `user_id`, `transcript_id`, `topic_id`, `insight_type`, `content`, `context`, `confidence_score`, `context_tag` | Yes |
| `waitlist` | `email` | RLS INSERT policy for anon |

**Admin client:** `src/app/api/account/delete/route.ts` uses `createClient(supabaseUrl, serviceRoleKey)` to bypass RLS for cascading account deletion.

**Env vars:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

## Anthropic Claude API (Extraction)

**Endpoint:** `src/app/api/extract/route.ts`

**Model:** `claude-haiku-4-5` (hardcoded at line 9)

**Purpose:** Extract topics and insights from uploaded conversation transcripts.

**Input:** Raw transcript text (max 200,000 characters enforced server-side)

**Output:** JSON `{ topics: [], insights: [] }` with:
- Topics: `name`, `description`, `category` (one of 6 fixed values)
- Insights: `insight_type` (decision/commitment/insight/pivot/task), `content`, `context`, `confidence_score`, `topic_name`, `context_tag`

**Token tracking:** Input/output token counts saved to `transcripts` table. Logged via `console.log`.

**Privacy:** `raw_content` nulled out after successful extraction (Privacy Policy commitment).

**Env var:**
```
ANTHROPIC_API_KEY
```

---

## OpenAI Whisper API (Voice Transcription)

**Endpoint:** `src/app/api/transcribe/route.ts`

**Model:** `whisper-1`

**Purpose:** Transcribe browser-recorded audio (WebM) to text, appended to transcript textarea.

**Flow:**
1. Client records via MediaRecorder API
2. Sends audio blob to `/api/transcribe`
3. Server forwards to `https://api.openai.com/v1/audio/transcriptions`
4. Returns `{ text: string }`

**Auth check:** Server verifies Supabase session before accepting audio.

**Env var:**
```
OPENAI_API_KEY
```

---

## Dead/Misplaced Route

`src/app/Transcribe/route.ts` — appears to be an old duplicate of the transcription route at the wrong path (`/Transcribe` instead of `/api/transcribe`). Likely unreachable but present in the codebase.
