# CONCERNS.md — NDLedger Technical Concerns

*Mapped: 2026-05-05*

---

## HIGH — Address Before Production

### 1. No test coverage
**Files:** All of `src/`
**Risk:** Any refactor or deployment can silently break extraction, auth, or data integrity.
**Phase:** Before or during deployment hardening.

### 2. Dead/wrong-path route
**File:** `src/app/Transcribe/route.ts`
**Risk:** This file mirrors `src/app/api/transcribe/route.ts` but lives at `/Transcribe` (capital T, no `api/`). It's likely unreachable in the app but adds confusion and a potential security surface.
**Fix:** Delete `src/app/Transcribe/route.ts`.

### 3. No rate limiting on API routes
**Files:** `src/app/api/extract/route.ts`, `src/app/api/transcribe/route.ts`
**Risk:** Any authenticated user can spam Claude/Whisper calls, burning API credits. No per-user quota or cooldown.
**Fix:** Implement token-bucket or time-window rate limit (Supabase edge function, Upstash, or middleware).

### 4. Service role key in API route
**File:** `src/app/api/account/delete/route.ts`
**Risk:** `SUPABASE_SERVICE_ROLE_KEY` must never be exposed client-side. Currently server-only — safe as-is — but any accidental `NEXT_PUBLIC_` prefix would be catastrophic.
**Fix:** Keep as-is, but add a comment and code review gate. Consider moving to a Supabase Edge Function.

---

## MEDIUM — Address Soon

### 5. Inconsistent size limits (client vs server)
**File:** `src/app/dashboard/dashboard-content.tsx:49-53`, `src/app/api/extract/route.ts:14`
- Client: `MAX_WORDS = 100,000` words
- Server: `MAX_TRANSCRIPT_CHARS = 200,000` characters
These don't align — a transcript could pass client validation but fail server validation (or vice versa at edge cases).
**Fix:** Align limits or use a single source of truth.

### 6. `confirm()` dialog for transcript deletion
**File:** `src/app/dashboard/dashboard-content.tsx:297`
```typescript
if (!confirm("Delete this transcript and all its topics/insights?")) return;
```
Browser-native `confirm()` is blocked in some browser contexts and looks unprofessional. Settings page already has a proper custom dialog pattern.
**Fix:** Replace with custom confirmation dialog (same pattern as account deletion in settings).

### 7. No startup env var validation
**Risk:** If any required env var is missing (`ANTHROPIC_API_KEY`, etc.), the app starts silently and fails at runtime with cryptic errors.
**Fix:** Add env validation at startup (e.g., a `src/lib/env.ts` that throws clearly if required vars are absent).

### 8. Token usage not persisted
**File:** `src/app/api/extract/route.ts:213-216`
Token counts are saved to the `transcripts` table — good. But there's no dashboard or aggregate view for cost tracking. As usage grows, this becomes a blind spot.

---

## LOW — Technical Debt

### 9. Console logs in production paths
**Files:** `src/app/api/extract/route.ts`, `src/app/api/transcribe/route.ts`
`console.error` calls in server routes will appear in Vercel function logs — acceptable, but no structured logging or alerting is wired up.

### 10. Dev-only diagnostic in login
**File:** `src/app/login/page.tsx:15-25`
`logSupabaseCookies()` is guarded by `NODE_ENV !== 'development'` — safe, but dead weight in production bundle.

### 11. Mind map URL length
URL params encode full expansion state (`e`, `c`, `t`, `s`, `f`). With many categories, URLs stay short — but no max-length guard exists.

### 12. Untracked files in repo
**Paths:**
- `src/app/(marketing)/linkedin/` — LinkedIn content drafts
- `Handover/` — Handoff docs
- `.agents/ndledger-brand.md` — brand context

These should either be committed or added to `.gitignore` to avoid accidental future commits.

---

### 13. No file size check before Whisper upload
**File:** `src/app/dashboard/dashboard-content.tsx` (MediaRecorder flow)
OpenAI Whisper has a 25MB file size limit. Long recordings could exceed this and fail silently.

### 14. `ilike` search — no full-text index
**File:** `src/app/dashboard/search/page.tsx`
Text search uses `ilike` — fine at current scale but will degrade without a Postgres `tsvector` index as data grows.

### 15. No pagination on dashboard queries
The main dashboard fetches all transcripts and insights for the user. Will degrade for power users.

---

## RESOLVED / BY DESIGN

- **Raw content privacy:** `raw_content` nulled after extraction — Privacy Policy commitment kept in code.
- **RLS for data isolation:** All user tables have RLS; users cannot access other users' data.
- **PKCE magic link issue:** Documented in code comment — known Supabase limitation when link opened in different browser.
- **Viewport persistence:** sessionStorage used intentionally so back navigation restores mind map position.
