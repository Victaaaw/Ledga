# NDLedger · Handoff Summary v9
**Last Updated:** 21 April 2026
**Supersedes:** v8 (20 April 2026)

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
- Production: https://www.ndledger.com ✅ (custom domain live, SSL valid, www is canonical)
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

### 20 April 2026 (session B)
- **Blocker 1 closed: transcript deletion.** Added `raw_content: null` to the completion update in `src/app/api/extract/route.ts`. Chose to null `raw_content` rather than delete the row, preserving token counts and processing history for audit and cost tracking while still honouring the Privacy Policy promise to delete transcripts after extraction.
- **Database migration applied.** `transcripts.raw_content` column made nullable via `ALTER TABLE transcripts ALTER COLUMN raw_content DROP NOT NULL;`.
- **Supabase redirect URL added.** `https://ndledger.com/auth/callback` added to the allowed redirects list.
- **Blocker 2 closed: Terms of Service.** Refined (not rewritten). AREASPEC entity swapped in throughout; liability cap set to AUD $50 flat; contact email changed from personal Gmail to `privacy@ndledger.com`; transcript deletion and audio handling promises added to Section 5; "trademarks of" softened to "belong to"; intro block added with entity statement; full em-dash scrub; AU English verified; grammar tightened.
- **Blocker 3 closed: PKCE UX fix.** Three-change stack: callback differentiates PKCE errors from generic auth errors; login page reads `?error=` query param and pre-populates a human-readable message; `link_expired` auto-switches to magic-link mode.
- **Privacy Policy "trading as" correction.** Section 1 now reads "AREASPEC PTY LTD, the Australian company behind NDLedger".
- **Redundant wordmarks removed from Terms and Privacy.** Removed `<span>NDLedger</span>` next to logo on both pages. Added `aria-label="NDLedger home"` to the link wrapper.
- **Footer Contact links converted to `mailto:`.** All three footers changed to `<a href="mailto:privacy@ndledger.com">`.
- **Broken Terms of Service footer link fixed on Privacy page.**
- **Landing page hero logo stretching fixed.** Added inline style to force aspect-ratio preservation.
- **Viewport meta added to root layout.**

> **Critical caveat on session B "verified" claims:** all the above was verified against `localhost:3001` only. Session B work was never committed or pushed. Production was running pre-session-B code until session A of 21 April. Future handoffs must distinguish localhost verification from production verification explicitly.

### 21 April 2026 (session A, this session)
- **Session B commits pushed to production.** Seven files that had been sitting uncommitted in the working tree since 20 April were staged, committed, and pushed. Production was running pre-session-B code until this push. Vercel deploy failed initially on a `useSearchParams()` prerender error on `/login`; fixed in the next commit.
- **Login page Suspense boundary added.** Extracted the existing `LoginPage` body into a `LoginForm` component; new `LoginPage` wraps `LoginForm` in `<Suspense>`. Required because `useSearchParams()` cannot be used in a statically prerendered component. Build passes; login page renders correctly.
- **Mobile header fix on `/privacy` and `/terms`.** Added `hidden sm:inline-block` to the "← Back to home" link in both page headers. Below 640px the link is hidden; desktop behaviour unchanged. Initial fix on Privacy applied the class to the wrong link ("Sign in") and had to be reversed; both pages now correct in production.
- **Footer active-link highlight added.** On `/privacy`, the footer "Privacy Policy" link renders in teal (`#5EEAD4`) with `font-medium`. Same treatment on `/terms` for the "Terms of Service" link. Implemented per-page (hardcoded active state) rather than extracting a shared client component, to avoid turning the marketing pages into client components. Acknowledged trade-off: if a fourth marketing page is added later, the pattern should be refactored into a shared Footer component that uses `usePathname()`.
- **FAQ updates on landing page.** Section heading "Frequently asked" renamed to "FAQs". "How does extraction work?" answer corrected; previously implied transcript text was retained ("linked to the originating transcript"), now reads "The original transcript is deleted after extraction; only the extracted insights are kept" to match the actual storage behaviour. "How do I delete my data?" answer expanded to mention per-transcript deletion from the dashboard before the full account deletion option.
- **Magic link auth fixed.** Two separate misconfigurations; both resolved.
  - **Supabase Site URL:** was `http://localhost:3001`. Changed to `https://www.ndledger.com`. Explains why magic links had been routing to localhost all along.
  - **www vs apex domain mismatch:** Vercel had `ndledger.com` configured as a 307 redirect to `www.ndledger.com`, making `www` the canonical domain. The login page code computes `emailRedirectTo` from `window.location.origin`, so it generated `https://www.ndledger.com/auth/callback`. But the Supabase Redirect URLs allowlist only contained `https://ndledger.com/auth/callback` (no www). Supabase silently rejected the mismatched redirect and fell back to Site URL root, which is why magic links were arriving on `/` with a `?code=` param instead of `/auth/callback`. Fix: added `https://www.ndledger.com/auth/callback` to the Supabase allowlist. Decision to keep www as canonical (not swap to apex-canonical) was explicit.
- **Stale session cookie redirect loop diagnosed (not fixed).** Signed-in users whose session has expired server-side but whose `sb-*` cookies are still present in the browser hit a middleware redirect loop: `/` redirects to `/dashboard` (middleware thinks they're signed in), `/dashboard` redirects to `/login` (middleware's `getUser()` returns null), `/login` redirects back to `/`. Workaround: clear `sb-*` cookies in DevTools → Application → Cookies. Left unfixed as an edge case. The middleware in `src/middleware.ts` trusts the cookie without validating that `getUser()` agrees; a proper fix would clear stale cookies on mismatch. Not a launch blocker.
- **Mind map category node width fix.** `CATEGORY_WIDTH` in `src/app/dashboard/mindmap/mindmap-content.tsx` raised from 240 to 320. Category labels like "▼ Business & Monetisation (1)" no longer truncate. Minor node overlap at the wider width acknowledged and accepted; revisit if it becomes a usability issue.
- **Contact link behaviour clarified.** `mailto:privacy@ndledger.com` in the footer works correctly for users with a default email client configured. Robert's Chrome had no handler registered, which is why clicking the link did nothing locally. Resolved by configuring Gmail as the protocol handler for `mailto:` in Chrome. No code change.

---

## Launch Blockers Remaining

None in the strict sense. Pre-launch polish and verification items only.

### 1. Verify Terms and Privacy claims against code
Three claims that should be spot-checked against the deployed code:
- Account deletion endpoint (`/api/account/delete`) actually cascades and deletes transcripts, topics, insights, profile, and auth user, not just marks the row inactive;
- No audio data leaves the browser. Grep the codebase to confirm no audio blob or buffer is sent to any API route;
- No analytics or advertising SDKs installed. A breach of the "we don't share with advertisers" promise would be an embarrassing compliance gap.

### 2. Lawyer review of Privacy Policy and Terms of Service
Not a blocker pre-dogfood, but should happen before any public launch or paid tier. Especially worth reviewing: liability cap, ACL carve-out, APP compliance claims.

### 3. Mobile header/footer layout (partially resolved)
Mobile header on `/privacy` and `/terms` is fixed (Back to home hidden below 640px). Footer has not been separately audited at narrow widths. If Robert flags it as crowded again, gather a screenshot before attempting a layout change.

### 4. Stray `page.tsx` in terms folder
A `page.tsx` file sits inside `src/app/(marketing)/terms/` that is actually landing-page content, not Terms of Service content. Robert to move/delete. Flagged in session A notes but not acted on.

---

## Important Product Facts

- **Audio capture IS a live feature.** "Record Voice" button in `src/app/dashboard/dashboard-content.tsx` uses the browser Web Speech API. Audio is transcribed locally by the browser, never uploaded to NDL servers. Only the resulting text reaches the backend.
- **Transcript `raw_content` is nulled after extraction.** The row is kept (preserving token counts, processed_at, status) but the actual transcript text is wiped. Column is nullable as of 20 April 2026.
- **Transcript delete cascades correctly.** Deleting a transcript wipes its topics and insights. Verified.
- **No in-app edit functionality exists** for user data. Corrections must be requested via privacy@ndledger.com under APP 13.
- **Account deletion endpoint exists** at `/api/account/delete`, wired up in Settings page. Not yet verified in production to actually cascade; on the pre-launch verification list.
- **The site had no viewport meta tag until 20 April 2026.** Every page rendered at desktop width on mobile and then zoomed out. Tailwind responsive breakpoints did not trigger at real device widths. Now fixed in `src/app/layout.tsx` via the `viewport` export. Live in production as of 21 April 2026. If mobile styling regresses in future, check this first.
- **AREASPEC PTY LTD operates NDLedger; it does NOT "trade as" NDLedger.** Use "the Australian company behind NDLedger" or "operates NDLedger" in all user-facing copy. Never "trading as".
- **`www.ndledger.com` is the canonical domain.** Apex `ndledger.com` redirects via 307 to `www`. Supabase Site URL is `https://www.ndledger.com`. Both the www and apex variants are in the Supabase Redirect URLs allowlist. If this is ever reversed (apex becomes canonical), update Site URL and the allowlist.
- **Middleware has a stale-cookie edge case.** `src/middleware.ts` trusts the presence of Supabase cookies when deciding whether to redirect authenticated users away from `/` and `/login`. If the cookie is stale (session expired server-side), users hit a redirect loop. Workaround: clear `sb-*` cookies. Fix deferred.
- **FAQ wording matches storage behaviour.** As of 21 April 2026, the landing page FAQ correctly states that transcripts are deleted after extraction and that only insights are retained. Keep it aligned if the storage behaviour changes.

---

## Privacy & Legal Posture

- **Legal entity:** AREASPEC PTY LTD (ACN 690 941 078)
- **Legal contact:** privacy@ndledger.com
- **Jurisdiction at launch:** Australia only. NOT scoped for GDPR or CCPA.
- **Privacy stance:** We don't monitor content. Insights-only long-term storage. Transcripts deleted (nulled) after extraction; policy, FAQ, and code all match as of 21 April 2026.
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
9. `git prune` unreachable objects (warning surfaces on every push now)
10. NDL access sheet. Single reference doc with URLs, emails, logins
11. Separate production API key from test key
12. In-app edit functionality for user insights. Would allow policy to reinstate "correct your data through the app" claim
13. Register `ndledger` as a business name with ASIC (~$42/yr) for formal name protection
14. Decide on `ndledger.com.au`. Open question, deferred
15. Cloudflare Proxied mode. Revisit only if bot abuse becomes real
16. Build a proper `/contact` page (currently `mailto:` only in footers)
17. Fix middleware stale-cookie redirect loop. Validate `getUser()` result before trusting cookie-based auth redirects; clear `sb-*` cookies if mismatch detected.
18. Mind map category node overlap. Slight visual overlap introduced by the 320px width fix on 21 April 2026. Revisit if it becomes a usability issue.
19. Extract marketing footer into a shared client component that uses `usePathname()` for active-link highlighting. Only worth doing if a fourth marketing page is added; current per-page hardcoded pattern is fine for three pages.
20. Move/delete the stray `page.tsx` inside `src/app/(marketing)/terms/` (wrong content, wrong location).

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
| Highlight teal | #5EEAD4 | Active footer link (you-are-here) |
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

`src/app/login/page.tsx`:
- Default export `LoginPage` wraps `LoginForm` in `<Suspense>`. Required because `useSearchParams()` breaks static prerendering without it.
- `LoginForm` reads the `?error=` query param on mount and renders a pre-populated error message. For `link_expired`, also auto-switches to magic-link mode so the user can retry without extra clicks.

### Middleware
`src/middleware.ts` guards `/dashboard/*` (requires auth) and redirects signed-in users away from `/` and `/login` to `/dashboard`. Matcher: `['/', '/login', '/dashboard/:path*']`.

Known edge case: trusts cookie presence; does not validate session freshness. Stale cookies can cause redirect loop. See post-launch item 17.

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

### Supabase Auth Configuration (as of 21 April 2026)
- **Site URL:** `https://www.ndledger.com`
- **Redirect URLs:**
  - `https://www.ndledger.com/auth/callback`
  - `https://ndledger.com/auth/callback`
  - `https://ledga-nine.vercel.app/auth/callback`
  - `http://localhost:3001/auth/callback`

### DNS Configuration (Cloudflare)
- `ndledger.com` → CNAME → `f2d83818c3dc8669.vercel-dns-017.com` (DNS-only, grey cloud)
- `www.ndledger.com` → CNAME → `f2d83818c3dc8669.vercel-dns-017.com` (DNS-only, grey cloud)
- MX + SPF records: auto-added by Cloudflare Email Routing

### Vercel Domains
- `www.ndledger.com`: **canonical** (Production)
- `ndledger.com`: 307 redirect to `www.ndledger.com`
- `ledga-nine.vercel.app`: Production (auto-deploy fallback)

### Email Routing (Cloudflare)
- `privacy@ndledger.com` → forwards to `hobbesinvestments@gmail.com` ✅

### Public Pages Structure
- `src/app/(marketing)/page.tsx` → `/` (landing page)
- `src/app/(marketing)/privacy/page.tsx` → `/privacy`
- `src/app/(marketing)/terms/page.tsx` → `/terms`
- `src/app/(marketing)/terms/page.tsx` (duplicate, wrong content): to be deleted, see post-launch item 20
- No `/contact` page. Contact links in footers are `mailto:privacy@ndledger.com` only.

---

## Scaling & Performance (Education Section)

Added per Robert's request to support learning-through-building. How to think about data volume and UI performance, not a fixed set of rules.

**Principle:** You do not delete user data to manage UI load. You manage UI load through rendering techniques. The data layer (Postgres) handles millions of rows comfortably; the bottleneck is always the UI rendering too much at once.

**Techniques, in order of sophistication:**

1. **Pagination.** Show 20 items per page, next/previous controls. Universal, simple, well-understood by users.
2. **Infinite scroll.** Load more as the user scrolls. Feels modern; trickier to get right (especially with back-navigation and accessibility).
3. **Virtualisation.** Only render items currently in the viewport. For lists of thousands. Libraries like `react-window` or `react-virtual`.
4. **Search and filter.** Users only see what they search for. Volume becomes irrelevant for most practical cases.

**Rough thresholds for NDL:**
- Under ~100 items per list: render all, no pagination needed.
- 100 to 1,000: add pagination or a search bar.
- 1,000 to 10,000: pagination is mandatory, consider virtualisation for specific heavy views.
- 10,000+: virtualisation, server-side filtering, potentially archive old data to cheaper storage (not the same as deleting).

**NDL today:** ~5 insights. Do nothing. When it starts feeling visually cluttered (not slow), add a sort or filter. When search results start feeling overwhelming, add pagination. Not before.

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

### Learning vs Building (new for v9)
Robert is learning the field as he builds. Questions that start with "should I..." or "how does this work" are often learning questions, not build decisions. On learning questions, lead with a plain explanation of how the domain works rather than leading with pushback on the premise. Pushback is still appropriate when Robert proposes to build something; on pure knowledge questions it can feel dismissive. Example: "how many insights should I let build up before deleting" is a question about scaling, not a build request.

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
- URL: https://www.ndledger.com ✅
- Fallback/deployment target: https://ledga-nine.vercel.app
- Auto-deploys from GitHub `main` branch
- Deployment status: https://vercel.com/dashboard → `ledga` project → Deployments

### If Dev Server Won't Start
- Kill ports: `npx kill-port 3001 3002`
- Clear cache: `rm -rf .next`
- Restart: `npm run dev`

### If Magic Links Go To The Wrong Domain
1. Check Supabase → Authentication → URL Configuration → Site URL. Should be `https://www.ndledger.com`.
2. Check Vercel → Domains. `www` should be canonical, apex should 307-redirect to www.
3. Check Supabase Redirect URLs allowlist contains both www and apex `/auth/callback` variants.
4. If any of these drift, magic links silently fall back to Site URL root and arrive with `?code=` on `/` instead of `/auth/callback`.

---

## Handoff Doc Convention (READ BEFORE WRITING v10)

Future handoff summaries follow this pattern, established 21 April 2026 and updated through v9:

1. **Each new version is a complete source of truth, not a delta.** vN should contain everything relevant from v(N-1) plus updates from the new session. A future Claude reading only vN should have full context without needing to read v(N-1).

2. **Merge, don't append.** When updating, integrate new facts into existing sections (Tech Stack, Legal, Cost Model, etc.). Do not add a "What Changed This Session" section that assumes the previous version is in context.

3. **Use the "Completed to Date" section** to log dated accomplishments chronologically. Multiple sessions on the same day are distinguished as "session A", "session B", etc. New session work is added as a dated entry, not as a separate changelog.

4. **Correct outdated facts in place.** If a previous version got something wrong, fix the fact in the relevant section AND flag the correction in "Important Product Facts" for traceability.

5. **Archive prior versions.** Move superseded handoffs to `Handover/archive/`. Only the current version lives in the active folder.

6. **Update Project Knowledge.** After saving the new version, upload it to the Claude Project so the next session reads the current doc, not a stale one.

7. **Never include credentials, API keys, or secrets.** Handoff docs must reference *where* to retrieve secrets, not the values themselves.

8. **Robert pastes file contents directly into chat** rather than having Claude read from disk, to preserve context window and avoid early compression. Expect inline file drops. Do not use `view` on `/c/Projects/NDL/...`; wait for the paste. Established 20 April 2026.

9. **All user-facing copy AND these handoff docs adhere to the writing conventions above** (no em dashes, AU English, semicolons in legal lists, etc.). When editing existing copy, scrub these on the way through. When writing a new handoff version, scan for em dashes before saving. Established 20 April 2026.

10. **Distinguish localhost verification from production verification.** A change "verified" on `localhost:3001` is not the same as verified in production, especially if it has not been committed and pushed. The session B incident (entire session of work verified locally but never shipped) is the reason. When writing handoff notes, specify *where* something was verified. Established 21 April 2026.

11. **Treat "learning questions" differently from "build questions".** Robert is learning the field. A question about how something works (scaling, architecture, conventions) is not always a proposal to build something. Lead with an explanation on learning questions; reserve pushback for build proposals that carry real scope risk. Established 21 April 2026.

---

## Next Session, Start Here

**Recommended order:**

1. **Spot-check the three Terms and Privacy claims against code.** Account deletion cascade, audio isolation, no analytics or ad SDKs. Any divergence is a live compliance gap. This is the highest-value remaining pre-launch task.

2. **Move or delete the stray `page.tsx` inside `src/app/(marketing)/terms/`.** Wrong content in wrong location. Robert flagged it; may have handled out-of-band.

3. **Lawyer review** of Privacy Policy and Terms of Service. Not urgent pre-dogfood; needed before paid tier or public launch.

4. **Post-launch item 17** (middleware stale-cookie fix) if Robert wants to tackle edge-case robustness before wider dogfood.

---

## Archive Command

To archive v8 after saving v9:

```bash
cd /c/Projects/NDL/ledga-app
git mv Handover/NDL_Handoff_Summary_v8.md Handover/archive/NDL_Handoff_Summary_v8.md
git add Handover/NDL_Handoff_Summary_v9.md
git commit -m "Handoff v9: session A 21 April 2026; archive v8"
git push
```

Then upload `NDL_Handoff_Summary_v9.md` to the Claude Project so the next session reads the current version.

---

*End of handoff summary v9. v1 to v8 superseded and archived.*
