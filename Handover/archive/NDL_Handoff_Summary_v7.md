# NDLedger — Handoff Summary v7
**Last Updated:** 21 April 2026
**Supersedes:** v6 (19 April 2026)

---

## Project Overview

**NDLedger** is an AI-agnostic background agent that extracts decisions, insights, commitments, pivots, and tasks from AI conversation transcripts and organises them into a searchable knowledge library.

**Target Market:** Solo founders, neurodivergent thinkers (ADHD, autism), SaaS operators, knowledge workers.

**Legal Entity:** AREASPEC PTY LTD (ACN 690 941 078) trading as NDLedger. Sole director: Robert Hobbes. Shareholder: MEZ FRANCHISE PTY LTD. Registered address: Ipswich, Queensland, Australia 4305.

**Tech Stack:**
- Frontend: Next.js 14, Tailwind, shadcn/ui — deployed to Vercel ✅
- Backend: Supabase (Sydney region) — Postgres, Auth, RLS
- Extraction: Anthropic API (Claude Haiku 4.5) — migrated from Claude CLI
- DNS + Email: Cloudflare (DNS-only proxy, Email Routing active)
- Local dev: localhost:3001
- Production: https://ndledger.com ✅ (custom domain live, SSL valid)
- Fallback: https://ledga-nine.vercel.app (auto-deploy target)

**GitHub Repo:** https://github.com/Victaaaw/Ledga

**Project path (local):** `C:\Projects\NDL\ledga-app`
*(Previously in OneDrive — moved to resolve `.next` EBUSY conflicts.)*

---

## Completed to Date

### 16 April 2026
- Fixed auth PKCE issue
- End-to-end user flow tested

### 19 April 2026
- Model selection tested on evidence — 4 transcripts, Haiku 4.5 vs Sonnet 4.5 side-by-side
- Haiku 4.5 locked in as production model (3.3× cheaper, better extraction discipline)
- Extraction migrated from Claude Code CLI to Anthropic API
- Cost guardrails added: 200k char input limit, token logging, model defaulted in one place
- Database schema updated: `input_tokens` and `output_tokens` columns on `transcripts` table
- Vercel deployment fixed and verified
- Production bugs fixed: TypeScript iteration on Map, `ANTHROPIC_API_KEY` env scope

### 20 April 2026
- **Domain registered and live** — ndledger.com via Cloudflare, DNS pointed at Vercel (CNAME to Vercel, DNS-only proxy), SSL valid
- **Cloudflare Email Routing active** — privacy@ndledger.com forwards to hobbesinvestments@gmail.com
- **Corporate entity confirmed** — AREASPEC PTY LTD verified via ASIC register, sole director
- **Privacy Policy rewritten and deployed** — Live at https://ndledger.com/privacy. Reflects AREASPEC entity, transcript deletion stance, NDB scheme compliance, 24-month inactive account retention, Cloudflare as disclosed third party
- **Corrections clause verified against code** — removed false "correct your data through the app" claim, replaced with email contact (APP 13 compliance). Verified by code search that no edit handlers exist in the dashboard
- **Handoff v6 → v7 merge** — v7 is now the complete source of truth; v1–v6 superseded

---

## Launch Blockers Remaining

### 1. Transcript deletion code change — URGENT (policy/code gap)
Privacy Policy (live in production) states transcripts are deleted after extraction. Code currently persists them. This is a live compliance gap — the policy promises behaviour the code does not deliver.
**Fix:** Add transcript row deletion (or `raw_content` nulling) to `src/app/api/extract/route.ts` after successful extraction. ~30 min code change.
**Priority:** Close this first.

### 2. Terms of Service
Outline exists at `C:\Projects\NDL\Privacy Policy\NDLedger_Legal_Outline.md`. Needs:
- Entity name swap: "Hobbes Group Pty Ltd" (incorrect guess in outline) → AREASPEC PTY LTD throughout
- Product accuracy verification — every "user can X" claim checked against actual code (same approach as Privacy Policy)
- Conversion to live page at `src/app/(marketing)/terms/page.tsx`
- Footer link + signup checkbox wiring

### 3. PKCE UX fix
Auth breaks when magic link is clicked in a different browser from where login was initiated. Correct code behaviour (cookies don't cross contexts) but confusing for real users.
**Fix:** Dedicated error page for `pkce_code_verifier_not_found` with clear copy and "Request a new link" button. 30–60 min.

---

## Important Product Facts (v6 was wrong on some of these)

- **Audio capture IS a live feature.** "Record Voice" button in `src/app/dashboard/dashboard-content.tsx` uses the browser Web Speech API. Audio is transcribed locally by the browser — never uploaded to NDL servers. Only the resulting text reaches the backend.
  *(v6 described NDL as paste-only with audio as "Phase 2". Incorrect.)*
- **Transcript delete cascades correctly** — deleting a transcript wipes its topics and insights. Verified.
- **No in-app edit functionality exists** for user data. Corrections must be requested via privacy@ndledger.com under APP 13.
- **Account deletion endpoint exists** at `/api/account/delete`, wired up in Settings page.

---

## Privacy & Legal Posture

- **Legal entity:** AREASPEC PTY LTD (ACN 690 941 078)
- **Legal contact:** privacy@ndledger.com
- **Jurisdiction at launch:** Australia only. NOT scoped for GDPR or CCPA.
- **Privacy stance:** We don't monitor content. Insights-only long-term storage. Transcripts deleted after extraction (policy live; code gap pending — see Blocker 1).
- **Audio handling:** Web Speech API in browser only. No audio reaches NDL. Do NOT add clauses that imply server-side audio handling.
- **Corporate structure note:** MEZ FRANCHISE PTY LTD owns AREASPEC PTY LTD. Robert is sole director of AREASPEC. Not a co-ownership situation requiring spouse consent.

---

## Post-Launch Iteration List

Non-blocking. Address after launch, in priority order:

1. Uninstall OpenClaw and review API usage — after 7 days of NDL-only spend
2. Category taxonomy gaps — no category for hiring/team decisions; both Haiku and Sonnet miscategorised a hiring decision as `business_monetisation` during testing
3. Pivot classification accuracy — monitor over first 20–30 real extractions; if slipping, add concrete pivot example to prompt
4. Monitor 200k character guardrail vs real usage — nearly tripped on first real dogfood session
5. `npm audit` — 9 vulnerabilities flagged (2 low, 6 high, 1 critical)
6. Rename Vercel project + GitHub repo from `ledga` to `ndledger`
7. File upload — Phase 2 per master doc (PDF/TXT/DOCX/MD)
8. Test large transcript paste behaviour before Phase 2 file upload ships
9. `git prune` unreachable objects
10. NDL access sheet — single reference doc with URLs, emails, logins
11. Separate production API key from test key
12. In-app edit functionality for user insights — would allow policy to reinstate "correct your data through the app" claim
13. Register `ndledger` as a business name with ASIC (~$42/yr) for formal name protection
14. Decide on `ndledger.com.au` — open question, deferred
15. Cloudflare Proxied mode — revisit only if bot abuse becomes real

---

## Current 6 Categories (Public Layer)

1. **business_monetisation** — Revenue, pricing, sales, monetisation strategy
2. **go_to_market** — Launch, marketing, positioning, competitive landscape
3. **legal_compliance** — Legal, compliance, regulations, IP, privacy
4. **personal_ideas** — Personal reflections, brainstorms, life, family
5. **product_features** — Product development, features, UX, technical specs
6. **technical** — Architecture, code, infrastructure, databases

**Known gap:** no category handles hiring/team/people decisions cleanly.

---

## 5 Insight Types

| Type | Emoji | Description |
|------|-------|-------------|
| decision | 🎯 | Choices made |
| commitment | ✅ | Promises/intentions |
| insight | 💡 | Observations/learnings |
| pivot | 🔄 | Changes in direction |
| task | ☑️ | Actionable to-dos |

---

## Brand Colours

| Colour | Hex | Use |
|--------|-----|-----|
| Deep navy | #1E3A5F | Headers, primary text |
| Teal | #0D9488 | Buttons, links, accents |
| Light grey | #F8FAFC | Background sections |
| White | #FFFFFF | Main background |
| Soft green | #86EFAC | Success states, highlights |

---

## Key Technical Details

### Extraction Flow (Current)
1. User pastes transcript OR speaks via Record Voice (Web Speech API transcribes locally in browser)
2. Text is submitted — POST to `/api/extract` with `transcriptId`
3. Route fetches transcript, validates size (< 200k chars)
4. Calls Anthropic API with `claude-haiku-4-5`
5. Parses JSON response, inserts topics and insights into Supabase
6. Logs `input_tokens` and `output_tokens` to `transcripts` table
7. **TODO (Blocker 1):** Delete transcript after successful extraction

### Auth Flow
`src/app/auth/callback/route.ts`:
1. Creates Supabase client inline with cookie handlers
2. Reads code-verifier from `request.cookies`
3. Writes session tokens to `response.cookies`
4. Returns the response with cookies attached

**Known UX limitation:** auth breaks when magic link is clicked in a different browser context. Pre-launch fix pending.

### Environment Variables Required
The app expects these variables in `.env.local` and Vercel (all three environments, SUPABASE_SERVICE_ROLE_KEY and ANTHROPIC_API_KEY marked Sensitive):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase publishable key (safe to expose, RLS-protected)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase secret key (admin access, NEVER commit or paste)
- `ANTHROPIC_API_KEY` — Anthropic API key (NEVER commit or paste)

Retrieve current values from:
- Supabase Dashboard → Project Settings → API
- Anthropic Console → API Keys
- Vercel Dashboard → Project Settings → Environment Variables

### Supabase Auth Configuration
- **Site URL:** http://localhost:3001
- **Redirect URLs:**
  - https://ndledger.com/auth/callback *(new, verify added)*
  - https://ledga-nine.vercel.app/auth/callback
  - http://localhost:3001/auth/callback

⚠️ **Action item:** Confirm `https://ndledger.com/auth/callback` is in the Supabase allowed redirects list. If not, auth will fail on the new domain.

### DNS Configuration (Cloudflare)
- `ndledger.com` → CNAME → `f2d83818c3dc8669.vercel-dns-017.com` (DNS-only, grey cloud)
- `www.ndledger.com` → CNAME → `f2d83818c3dc8669.vercel-dns-017.com` (DNS-only, grey cloud)
- MX + SPF records: auto-added by Cloudflare Email Routing

### Email Routing (Cloudflare)
- `privacy@ndledger.com` → forwards to `hobbesinvestments@gmail.com` ✅
- Second address: *(confirm purpose — entered during setup)*

---

## Cost Model (Post-Migration)

### Small to medium transcripts (typical use case)
| Metric | Value |
|---|---|
| Avg input tokens per extraction | ~2,000 |
| Avg output tokens per extraction | ~1,500 |
| Cost per extraction (Haiku 4.5) | ~$0.01 |
| Cost per 100 extractions | ~$1.00 |
| Cost per 1,000 extractions | ~$10.00 |

### Heavy session (real dogfood, 19 April 2026)
| Metric | Value |
|---|---|
| Input tokens | 48,643 |
| Output tokens | 2,534 |
| Cost | ~$0.06 |
| Characters (approx) | ~195,000 (near 200k guardrail) |

### Key observation
Long conversations show a ~19:1 input:output ratio vs ~1.5:1 for short transcripts. More context processed for proportionally less extraction. Worth monitoring.

**Current Anthropic monthly cap:** $100. Likely too generous for NDL-only spend after OpenClaw is uninstalled. Revisit after 7 days of real usage data.

---

## Communication Preferences (Robert)

- One clear action at a time
- Wait for confirmation before next step
- Plain language, concrete next steps
- No bundled instructions
- Use NDL as abbreviation for NDLedger
- Push back on scope creep, advocate for shipping over perfecting

---

## How to Continue

### Local Dev
1. Open bash in project root: `cd /c/Projects/NDL/ledga-app`
2. Start server: `npm run dev`
3. Access at http://localhost:3001 (same browser for login flow, not incognito)

### Production
- URL: https://ndledger.com ✅
- Fallback/deployment target: https://ledga-nine.vercel.app
- Auto-deploys from GitHub `main` branch
- Deployment status: https://vercel.com/dashboard → `ledga` project → Deployments

### If Dev Server Won't Start
- Kill ports: `npx kill-port 3001 3002`
- Clear cache: `rm -rf .next`
- Restart: `npm run dev`

---
## Handoff Doc Convention (READ BEFORE WRITING v8)

Future handoff summaries follow this pattern, established 21 April 2026:

1. **Each new version is a complete source of truth, not a delta.** v8 should contain everything relevant from v7 plus updates from the new session. A future Claude reading only v8 should have full context without needing to read v7.

2. **Merge, don't append.** When updating, integrate new facts into existing sections (Tech Stack, Legal, Cost Model, etc.). Do not add a "What Changed This Session" section that assumes the previous version is in context.

3. **Use the "Completed to Date" section** to log dated accomplishments chronologically. New session work is added as a dated entry, not as a separate changelog.

4. **Correct outdated facts in place.** If a previous version got something wrong (e.g., v6 said NDL was paste-only when audio was already live), fix the fact in the relevant section AND flag the correction in "Important Product Facts" for traceability.

5. **Archive prior versions.** Move superseded handoffs to `Handover/archive/`. Only the current version lives in the active folder.

6. **Update Project Knowledge.** After saving the new version, upload it to the Claude Project so the next session reads the current doc, not a stale one.

7. **Never include credentials, API keys, or secrets.** Handoff docs must reference *where* to retrieve secrets (e.g. "Supabase Dashboard → Project Settings → API", "Vercel → Environment Variables"), not the values themselves. If you catch yourself typing a key starting with `sb_`, `sk-`, `eyJ`, or any token-like string into a handoff doc — stop.
## Next Session — Start Here

**Recommended order:**

1. **Close the policy/code gap (Blocker 1)** — add transcript deletion in `src/app/api/extract/route.ts` after extraction completes. This is the highest priority because the Privacy Policy is live and promises this behaviour.

2. **Confirm Supabase redirect URL** includes `https://ndledger.com/auth/callback`. 30-second check, but if missing will break auth on the new domain.

3. **Terms of Service (Blocker 2)** — use `NDLedger_Legal_Outline.md` as the base. Swap "Hobbes Group Pty Ltd" → AREASPEC PTY LTD. Verify every "user can X" claim against actual code the same way we did for Privacy Policy.

4. **PKCE UX fix (Blocker 3)** — if energy remains.

---

*End of handoff summary v7. v1–v6 superseded and archived.*