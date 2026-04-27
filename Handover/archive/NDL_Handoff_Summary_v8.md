# NDLedger · Handoff Summary v8
**Last Updated:** 20 April 2026
**Supersedes:** v7 (19 April 2026)

---

## Project Overview

**NDLedger** is an AI-agnostic background agent that extracts decisions, insights, commitments, pivots, and tasks from AI conversation transcripts and organises them into a searchable knowledge library.

**Target Market:** Solo founders, neurodivergent thinkers (ADHD, autism), SaaS operators, knowledge workers.

**Legal Entity:** AREASPEC PTY LTD (ACN 690 941 078), the Australian company behind NDLedger. Sole director: Robert Hobbes. Shareholder: MEZ FRANCHISE PTY LTD. Registered address: Ipswich, Queensland, Australia 4305.

> **Entity language note:** NDLedger is the product name. AREASPEC PTY LTD **operates** NDLedger; it does **not** "trade as" NDLedger. "NDLedger" has not been registered as a business name with ASIC (see post-launch list item 13). Always use "the Australian company behind NDLedger" or "operates NDLedger", never "trading as NDLedger".

**Tech Stack:**
- Frontend: Next.js 14, Tailwind, shadcn/ui, deployed to Vercel ✅
- Backend: Supabase (Sydney region). Postgres, Auth, RLS
- Extraction: Anthropic API (Claude Haiku 4.5), migrated from Claude CLI
- DNS + Email: Cloudflare (DNS-only proxy, Email Routing active)
- Local dev: localhost:3001
- Production: https://ndledger.com ✅ (custom domain live, SSL valid)
- Fallback: https://ledga-nine.vercel.app (auto-deploy target)

**GitHub Repo:** https://github.com/Victaaaw/Ledga

**Project path (local):** `C:\Projects\NDL\ledga-app`
*(Previously in OneDrive. Moved to resolve `.next` EBUSY conflicts.)*

---

## Completed to Date

### 16 April 2026
- Fixed auth PKCE issue
- End-to-end user flow tested

### 19 April 2026
- Model selection tested on evidence. 4 transcripts, Haiku 4.5 vs Sonnet 4.5 side-by-side.
- Haiku 4.5 locked in as production model (3.3× cheaper, better extraction discipline)
- Extraction migrated from Claude Code CLI to Anthropic API
- Cost guardrails added: 200k char input limit, token logging, model defaulted in one place
- Database schema updated: `input_tokens` and `output_tokens` columns on `transcripts` table
- Vercel deployment fixed and verified
- Production bugs fixed: TypeScript iteration on Map, `ANTHROPIC_API_KEY` env scope

### 20 April 2026 (session A)
- Domain registered and live. ndledger.com via Cloudflare, DNS pointed at Vercel (CNAME to Vercel, DNS-only proxy), SSL valid.
- Cloudflare Email Routing active. privacy@ndledger.com forwards to hobbesinvestments@gmail.com.
- Corporate entity confirmed. AREASPEC PTY LTD verified via ASIC register, sole director.
- Privacy Policy rewritten and deployed. Live at https://ndledger.com/privacy. Reflects AREASPEC entity, transcript deletion stance, NDB scheme compliance, 24-month inactive account retention, Cloudflare as disclosed third party.
- Corrections clause verified against code. Removed false "correct your data through the app" claim, replaced with email contact (APP 13 compliance). Verified by code search that no edit handlers exist in the dashboard.

### 20 April 2026 (session B, this session)
- **Blocker 1 closed: transcript deletion.** Added `raw_content: null` to the completion update in `src/app/api/extract/route.ts`. Chose to null `raw_content` rather than delete the row, preserving token counts and processing history for audit and cost tracking while still honouring the Privacy Policy promise to delete transcripts after extraction. Verified with live test: extraction succeeded, `content_deleted = true`, status `completed`.
- **Database migration applied.** `transcripts.raw_content` column made nullable via `ALTER TABLE transcripts ALTER COLUMN raw_content DROP NOT NULL;`. Required because the NOT NULL constraint would have blocked the completion write after the code change.
- **Supabase redirect URL added.** `https://ndledger.com/auth/callback` added to the allowed redirects list. Auth now works correctly on the live domain. Previous list only contained Vercel fallback and localhost.
- **Blocker 2 closed: Terms of Service.** The existing Terms page at `src/app/(marketing)/terms/page.tsx` was refined rather than rewritten. Changes: AREASPEC entity swapped in throughout (replacing "Hobbes Group Pty Ltd"); liability cap set to AUD $50 flat (no "or whichever is greater" language); contact email changed from personal Gmail to `privacy@ndledger.com`; transcript deletion and audio handling promises added to Section 5; "trademarks of" softened to "belong to" (no registered trademark yet); intro block added with entity statement; full em-dash scrub; AU English verified; minor grammar tightened (semicolons in lists, "on termination" not "upon termination", removed contractions for formal register).
- **Blocker 3 closed: PKCE UX fix.** Three-change stack: callback handler now differentiates PKCE errors (redirects to `/login?error=link_expired`) from generic auth errors (`/login?error=auth_failed`). Login page reads the query param via `useSearchParams` and pre-populates a human-readable message. For `link_expired` specifically, the login page also auto-switches to magic-link mode so the user can retry without clicking "Use magic link instead". Verified both error states render correctly. PKCE detection is string-match on the Supabase error message (no typed error code available); degrades safely to the generic error if the message format ever changes.
- **Privacy Policy "trading as" correction.** Section 1 of the Privacy Policy updated. Previously said "AREASPEC PTY LTD trading as NDLedger" which is factually wrong (AREASPEC does not trade as NDLedger; NDLedger is not an ASIC-registered business name). Now reads "AREASPEC PTY LTD, the Australian company behind NDLedger". Same error was caught on the Terms draft before shipping.
- **Redundant wordmarks removed from Terms and Privacy.** Both pages had a `<span>NDLedger</span>` next to the logo image in header and footer. Since the logo already contains the word "NDLedger", the span was duplicated branding. Removed from both pages. Added `aria-label="NDLedger home"` to the link wrapper to preserve screen-reader accessibility.
- **Footer Contact links converted to `mailto:`.** Landing, Terms, and Privacy footers all had `<a href="#">Contact</a>` pointing nowhere. All three changed to `<a href="mailto:privacy@ndledger.com">`. Dev testing revealed that `mailto:` links don't open in Robert's Chrome because no default handler is configured; this is a local machine issue, not a code issue. Links work correctly for users with normal email client setups (phone mail apps, desktop Outlook/Apple Mail).
- **Broken Terms of Service footer link fixed on Privacy page.** Privacy footer had `<a href="#">Terms of Service</a>`; now correctly `<Link href="/terms">`.
- **Landing page hero logo stretching fixed.** Hero `<Image>` had `h-24 w-auto` but was still stretching vertically on narrow screens. Added inline `style={{ height: "auto", maxHeight: "6rem" }}` to force aspect-ratio preservation.
- **Viewport meta added to root layout.** `src/app/layout.tsx` had no `viewport` export, which meant every page on the site was rendering at desktop width on phones and then zooming out. Added `export const viewport: Viewport = { width: "device-width", initialScale: 1 };`. See "Important Product Facts" for more on this; it was a launch-blocking rendering bug that had been live since the site went up.

---

## Launch Blockers Remaining

**All three v7 blockers are now closed.** Pre-launch work remaining is polish and verification, not blockers in the strict sense. Listed in priority order.

### 1. Mobile header/footer layout polish
Header on `/terms`, `/privacy`, and `/` is still reported as "crowded" on phone viewports. Header uses `flex justify-between` with logo on left and two links on right; at ~320px, "← Back to home" and "Sign in" crowd the logo. Footer uses `flex-col sm:flex-row` which should stack vertically below 640px; worth verifying this is actually happening and is what Robert wants. Investigation not completed in session B; deferred with no code changes. Next session should gather a screenshot before attempting any fix.

### 2. Lawyer review of Privacy Policy and Terms of Service
Not strictly a blocker but the right move for a commercial product in Australia. Both documents are in good shape structurally and match the code, but have not been reviewed by a qualified lawyer. Especially worth reviewing: liability cap, ACL carve-out, APP compliance claims.

### 3. Verify Terms and Privacy claims against code
Three claims that should be spot-checked:
- Account deletion endpoint (`/api/account/delete`) actually cascades and deletes everything, not just marks the row inactive
- No audio data leaves the browser. Grep the codebase to confirm no audio blob or buffer is sent to any API route.
- No analytics or advertising SDKs installed (breach of the "we don't share with advertisers" promise would be embarrassing)

---

## Important Product Facts

- **Audio capture IS a live feature.** "Record Voice" button in `src/app/dashboard/dashboard-content.tsx` uses the browser Web Speech API. Audio is transcribed locally by the browser, never uploaded to NDL servers. Only the resulting text reaches the backend. (v6 described NDL as paste-only with audio as "Phase 2". Incorrect.)
- **Transcript `raw_content` is nulled after extraction.** The row is kept (preserving token counts, processed_at, status) but the actual transcript text is wiped. Column is nullable as of 20 April 2026.
- **Transcript delete cascades correctly.** Deleting a transcript wipes its topics and insights. Verified.
- **No in-app edit functionality exists** for user data. Corrections must be requested via privacy@ndledger.com under APP 13.
- **Account deletion endpoint exists** at `/api/account/delete`, wired up in Settings page. Not yet verified to actually cascade.
- **The site had no viewport meta tag until 20 April 2026.** Every page rendered at desktop width on mobile and then zoomed out. Tailwind responsive breakpoints (`sm:`, `md:`) did not trigger at real device widths. Now fixed in `src/app/layout.tsx` via the `viewport` export. If mobile styling regresses in future, check this first.
- **AREASPEC PTY LTD operates NDLedger; it does NOT "trade as" NDLedger.** "NDLedger" is not an ASIC-registered business name (see post-launch list item 13). Use "the Australian company behind NDLedger" or "operates NDLedger" in all user-facing copy. Never "trading as".

---

## Privacy & Legal Posture

- **Legal entity:** AREASPEC PTY LTD (ACN 690 941 078)
- **Legal contact:** privacy@ndledger.com
- **Jurisdiction at launch:** Australia only. NOT scoped for GDPR or CCPA.
- **Privacy stance:** We don't monitor content. Insights-only long-term storage. Transcripts deleted (nulled) after extraction; policy and code now match as of 20 April 2026.
- **Audio handling:** Web Speech API in browser only. No audio reaches NDL. Do NOT add clauses that imply server-side audio handling.
- **Terms of Service liability cap:** AUD $50 flat. Australian Consumer Law carve-out included.
- **Corporate structure note:** MEZ FRANCHISE PTY LTD owns AREASPEC PTY LTD. Robert is sole director of AREASPEC. Not a co-ownership situation requiring spouse consent.

---

## Post-Launch Iteration List

Non-blocking. Address after launch, in priority order:

1. Uninstall OpenClaw and review API usage, after 7 days of NDL-only spend
2. Category taxonomy gaps. No category for hiring/team decisions; both Haiku and Sonnet miscategorised a hiring decision as `business_monetisation` during testing
3. Pivot classification accuracy. Monitor over first 20 to 30 real extractions; if slipping, add concrete pivot example to prompt
4. Monitor 200k character guardrail vs real usage. Nearly tripped on first real dogfood session
5. `npm audit`: 9 vulnerabilities flagged (2 low, 6 high, 1 critical)
6. Rename Vercel project and GitHub repo from `ledga` to `ndledger`
7. File upload. Phase 2 per master doc (PDF, TXT, DOCX, MD)
8. Test large transcript paste behaviour before Phase 2 file upload ships
9. `git prune` unreachable objects
10. NDL access sheet. Single reference doc with URLs, emails, logins
11. Separate production API key from test key
12. In-app edit functionality for user insights. Would allow policy to reinstate "correct your data through the app" claim
13. Register `ndledger` as a business name with ASIC (~$42/yr) for formal name protection
14. Decide on `ndledger.com.au`. Open question, deferred
15. Cloudflare Proxied mode. Revisit only if bot abuse becomes real
16. Build a proper `/contact` page (currently `mailto:` only in footers)

---

## Current 6 Categories (Public Layer)

1. **business_monetisation**: Revenue, pricing, sales, monetisation strategy
2. **go_to_market**: Launch, marketing, positioning, competitive landscape
3. **legal_compliance**: Legal, compliance, regulations, IP, privacy
4. **personal_ideas**: Personal reflections, brainstorms, life, family
5. **product_features**: Product development, features, UX, technical specs
6. **technical**: Architecture, code, infrastructure, databases

**Known gap:** no category handles hiring/team/people decisions cleanly.

---

## 5 Insight Types

| Type | Emoji | Description |
|------|-------|-------------|
| decision | 🎯 | Choices made |
| commitment | ✅ | Promises and intentions |
| insight | 💡 | Observations and learnings |
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
2. Text is submitted: POST to `/api/extract` with `transcriptId`
3. Route fetches transcript, validates size (< 200k chars)
4. Calls Anthropic API with `claude-haiku-4-5`
5. Parses JSON response, inserts topics and insights into Supabase
6. Logs `input_tokens` and `output_tokens` to `transcripts` table
7. Marks transcript `completed` AND nulls `raw_content` in the same update (honours Privacy Policy deletion promise)

### Auth Flow
`src/app/auth/callback/route.ts`:
1. Creates Supabase client inline with cookie handlers
2. Reads code-verifier from `request.cookies`
3. Writes session tokens to `response.cookies`
4. On PKCE error (string-match on error message) redirects to `/login?error=link_expired`
5. On generic auth error redirects to `/login?error=auth_failed`

`src/app/login/page.tsx` reads the `?error=` query param on mount and renders a pre-populated error message. For `link_expired`, also auto-switches to magic-link mode so the user can retry without extra clicks.

### Environment Variables Required
The app expects these variables in `.env.local` and Vercel (all three environments; `SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY` marked Sensitive):

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase publishable key (safe to expose, RLS-protected)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase secret key (admin access, NEVER commit or paste)
- `ANTHROPIC_API_KEY`: Anthropic API key (NEVER commit or paste)

Retrieve current values from:
- Supabase Dashboard → Project Settings → API
- Anthropic Console → API Keys
- Vercel Dashboard → Project Settings → Environment Variables

### Supabase Auth Configuration
- **Site URL:** http://localhost:3001
- **Redirect URLs (all verified present as of 20 April 2026):**
  - https://ndledger.com/auth/callback
  - https://ledga-nine.vercel.app/auth/callback
  - http://localhost:3001/auth/callback

### DNS Configuration (Cloudflare)
- `ndledger.com` → CNAME → `f2d83818c3dc8669.vercel-dns-017.com` (DNS-only, grey cloud)
- `www.ndledger.com` → CNAME → `f2d83818c3dc8669.vercel-dns-017.com` (DNS-only, grey cloud)
- MX + SPF records: auto-added by Cloudflare Email Routing

### Email Routing (Cloudflare)
- `privacy@ndledger.com` → forwards to `hobbesinvestments@gmail.com` ✅

### Public Pages Structure
- `src/app/(marketing)/page.tsx` → `/` (landing page)
- `src/app/(marketing)/privacy/page.tsx` → `/privacy`
- `src/app/(marketing)/terms/page.tsx` → `/terms`
- No `/contact` page. Contact links in footers are `mailto:privacy@ndledger.com` only.

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
Long conversations show a ~19:1 input-to-output ratio vs ~1.5:1 for short transcripts. More context processed for proportionally less extraction. Worth monitoring.

**Current Anthropic monthly cap:** $100. Likely too generous for NDL-only spend after OpenClaw is uninstalled. Revisit after 7 days of real usage data.

---

## Communication Preferences (Robert)

- One clear action at a time
- Wait for confirmation before next step
- Plain language, concrete next steps
- No bundled instructions
- Use NDL as abbreviation for NDLedger
- Push back on scope creep, advocate for shipping over perfecting

### Writing Conventions (enforced in all user-facing copy AND handoff docs)
- **No em dashes** (the long dash). Use commas, semicolons, colons, or separate sentences. Em dashes read as AI-generated, especially on public legal pages.
- **No en dashes** (the medium dash) except in numeric ranges (e.g., "2024 to 2026" or a simple hyphen).
- **Australian English spelling** throughout. Use `organise`, `visualise`, `unauthorised`, `licence` (noun), `behaviour`, `colour`, `centre`. Never `organize`, `license` (as a noun), `behavior`, `color`, `center`.
- **No contractions in formal documents** (Terms, Privacy Policy). "We have written", not "we've written". Conversational pages can use contractions.
- **Semicolons in legal lists.** "provide accurate information;" not "provide accurate information,". Final item joined with "; and" or "; or".
- **"On termination" not "upon termination".** Both acceptable, former is cleaner.
- **Entity language:** "AREASPEC PTY LTD, the Australian company behind NDLedger". Never "trading as NDLedger".

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

## Handoff Doc Convention (READ BEFORE WRITING v9)

Future handoff summaries follow this pattern, established 21 April 2026 and extended 20 April 2026:

1. **Each new version is a complete source of truth, not a delta.** vN should contain everything relevant from v(N-1) plus updates from the new session. A future Claude reading only vN should have full context without needing to read v(N-1).

2. **Merge, don't append.** When updating, integrate new facts into existing sections (Tech Stack, Legal, Cost Model, etc.). Do not add a "What Changed This Session" section that assumes the previous version is in context.

3. **Use the "Completed to Date" section** to log dated accomplishments chronologically. Multiple sessions on the same day are distinguished as "session A", "session B", etc. New session work is added as a dated entry, not as a separate changelog.

4. **Correct outdated facts in place.** If a previous version got something wrong (e.g., v6 said NDL was paste-only when audio was already live), fix the fact in the relevant section AND flag the correction in "Important Product Facts" for traceability.

5. **Archive prior versions.** Move superseded handoffs to `Handover/archive/`. Only the current version lives in the active folder.

6. **Update Project Knowledge.** After saving the new version, upload it to the Claude Project so the next session reads the current doc, not a stale one.

7. **Never include credentials, API keys, or secrets.** Handoff docs must reference *where* to retrieve secrets, not the values themselves.

8. **Robert pastes file contents directly into chat** rather than having Claude read from disk, to preserve context window and avoid early compression. Expect inline file drops. Do not use `view` on `/c/Projects/NDL/...`; wait for the paste. Established 20 April 2026.

9. **All user-facing copy AND these handoff docs adhere to the writing conventions above** (no em dashes, AU English, semicolons in legal lists, etc.). When editing existing copy, scrub these on the way through. When writing a new handoff version, scan for em dashes before saving. Established 20 April 2026.

---

## Next Session, Start Here

**Recommended order:**

1. **Gather a screenshot of the phone header and footer layout** on `/terms` and `/privacy`. Robert flagged these as still "crowded" after the viewport fix but we didn't complete the diagnosis before wrapping. Don't attempt a layout fix without visual confirmation of what's wrong.

2. **Spot-check the three Terms and Privacy claims against code:** account deletion cascade, audio isolation, no analytics or ad SDKs. Any of these diverging from the code is a compliance gap.

3. **Lawyer review** of Privacy Policy and Terms of Service. Not urgent pre-dogfood, but should happen before any public launch or paid tier.

4. **Post-launch list item 16** (proper `/contact` page) is a natural extension if Robert wants one. But `mailto:` is fine for launch.

---

*End of handoff summary v8. v1 to v7 superseded and archived.*
