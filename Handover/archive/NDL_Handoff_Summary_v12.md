# NDLedger · Handoff Summary v12
**Last Updated:** 25 April 2026
**Supersedes:** v11 (24 April 2026)

---

## Project Overview

**NDLedger** is an AI-agnostic background agent that extracts decisions, insights, commitments, pivots, and tasks from AI conversation transcripts and organises them into a searchable knowledge library.

**Target Market:** Solo founders, neurodivergent thinkers (ADHD, autism), SaaS operators, knowledge workers.

**Legal Entity:** AREASPEC PTY LTD (ACN 690 941 078), the Australian company behind NDLedger. Sole director: Robert Hobbes. Shareholder: MEZ FRANCHISE PTY LTD. Registered address: Ipswich, Queensland, Australia 4305.

> **Entity language note:** NDLedger is the product name. AREASPEC PTY LTD **operates** NDLedger; it does **not** "trade as" NDLedger. "NDLedger" has not been registered as a business name with ASIC (see post-launch list). Always use "the Australian company behind NDLedger" or "operates NDLedger", never "trading as NDLedger".

**Tech Stack:**
- Frontend: Next.js 14.2.35, Tailwind, shadcn/ui, deployed to Vercel ✅
- Backend: Supabase (Sydney region). Postgres, Auth, RLS. `@supabase/ssr` 0.10.2
- Extraction: Anthropic API (Claude Haiku 4.5)
- Voice transcription (current): Web Speech API in browser. **On a deprecation path; Whisper migration in progress (see post-launch item 22).**
- DNS + Email: Cloudflare (DNS-only proxy, Email Routing active). 2FA active.
- Local dev: localhost:3001
- Production: https://www.ndledger.com ✅ (custom domain live, SSL valid, www is canonical)
- Fallback: https://ledga-nine.vercel.app (auto-deploy target)

**GitHub Repo:** https://github.com/Victaaaw/Ledga

**Project path (local):** `C:\Projects\NDL\ledga-app`

---

## Working Tree State (Read This First)

The previous session ended with the working tree in a non-clean state. Before doing any new work, the next session must resolve the following:

1. **Currently checked-out branch is `voice-truncation-fix`, not `main`.** The first action of the next session is to assess and switch.
2. **Uncommitted changes are sitting in the working tree:**
   - Six handoff documents (`v1` through `v9` excluding `v6`/`v7`/`v8`/`v10`) are showing as deleted. These were moved into `Handover/archive/` as part of the handoff convention. The move has not been committed.
   - `Handover/NDL_Handoff_Summary_v11.md` is untracked. v11 has never been added to git.
   - `Handover/archive/` folder is untracked.
   - `next-env.d.ts` is modified (auto-generated, ignore).
   - `.claude/VS Code.code-workspace` is untracked (editor config; commit or gitignore).
   - `src/app/(marketing)/privacy/NDLedger_Legal_Outline.md` is untracked. **This file is in the wrong location**; legal outlines should not live in the public marketing folder. Relocate before committing.
   - `src/app/api/2026-04-24 (3).png` is untracked. **This is a stray screenshot**; delete.
3. **`voice-truncation-fix` branch exists on GitHub.** It contains the auto-restart fix and debug log panel from the 25 April session. Preserved as a record of the experiment; not merged to main.
4. **Vercel Authentication on preview deploys is currently disabled.** Re-enable before any further preview testing.

**Recommended first action sequence for the next session:**
- `git status` to confirm the state matches the above
- Relocate `NDLedger_Legal_Outline.md` out of the marketing folder (suggest `Handover/legal/` or a new `legal/` folder at the project root)
- Delete the stray PNG
- Stage and commit the handoff archive reorganisation and v11 file
- Decide whether `.claude/VS Code.code-workspace` is committed or gitignored
- Switch to `main` (`git checkout main`)
- Re-enable Vercel Authentication on preview deploys

Production is unaffected by any of this. Production is on `main` and matches the state described in v11.

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

### 21 April 2026 (session A)
- **Session B commits pushed to production.** Seven files that had been sitting uncommitted in the working tree since 20 April were staged, committed, and pushed. Production was running pre-session-B code until this push. Vercel deploy failed initially on a `useSearchParams()` prerender error on `/login`; fixed in the next commit.
- **Login page Suspense boundary added.** Extracted the existing `LoginPage` body into a `LoginForm` component; new `LoginPage` wraps `LoginForm` in `<Suspense>`. Required because `useSearchParams()` cannot be used in a statically prerendered component. Build passes; login page renders correctly.
- **Mobile header fix on `/privacy` and `/terms`.** Added `hidden sm:inline-block` to the "← Back to home" link in both page headers. Below 640px the link is hidden; desktop behaviour unchanged. Initial fix on Privacy applied the class to the wrong link ("Sign in") and had to be reversed; both pages now correct in production.
- **Footer active-link highlight added.** On `/privacy`, the footer "Privacy Policy" link renders in teal (`#5EEAD4`) with `font-medium`. Same treatment on `/terms` for the "Terms of Service" link. Implemented per-page (hardcoded active state) rather than extracting a shared client component, to avoid turning the marketing pages into client components.
- **FAQ updates on landing page.** Section heading "Frequently asked" renamed to "FAQs". "How does extraction work?" answer corrected; previously implied transcript text was retained, now reads "The original transcript is deleted after extraction; only the extracted insights are kept" to match the actual storage behaviour. "How do I delete my data?" answer expanded to mention per-transcript deletion from the dashboard before the full account deletion option.
- **Magic link auth fixed.** Two separate misconfigurations; both resolved.
  - **Supabase Site URL:** was `http://localhost:3001`. Changed to `https://www.ndledger.com`.
  - **www vs apex domain mismatch:** Vercel had `ndledger.com` configured as a 307 redirect to `www.ndledger.com`, making `www` the canonical domain. The login page code computes `emailRedirectTo` from `window.location.origin`, so it generated `https://www.ndledger.com/auth/callback`. But the Supabase Redirect URLs allowlist only contained `https://ndledger.com/auth/callback` (no www). Fix: added `https://www.ndledger.com/auth/callback` to the Supabase allowlist.
- **Stale session cookie redirect loop diagnosed (not fixed; later closed on 24 April code review).**
- **Mind map category node width fix.** `CATEGORY_WIDTH` in `src/app/dashboard/mindmap/mindmap-content.tsx` raised from 240 to 320. Category labels no longer truncate.
- **Contact link behaviour clarified.** `mailto:privacy@ndledger.com` works correctly when the OS has a default email handler configured. No code change.

### 22 April 2026
- **Pre-launch compliance verification complete.** All three claims in Privacy Policy and Terms of Service spot-checked against code:
  - **Account deletion cascade verified.** `/api/account/delete` hard-deletes insights, topics, transcripts in order, then calls `admin.auth.admin.deleteUser(user.id)`. Profile row cascades via `ON DELETE CASCADE` on `profiles_id_fkey`, confirmed against the live Supabase schema.
  - **Audio isolation verified.** `src/app/dashboard/dashboard-content.tsx` uses `webkitSpeechRecognition` only. No `MediaRecorder`, no `getUserMedia` audio capture to a blob, no audio in any fetch payload. Only `result[0].transcript` (a string) is read from the SpeechRecognition event.
  - **No analytics or ad SDKs verified.** `src/app/layout.tsx` is clean: no `<Script>` tags, no GTM, no Google Analytics, no Meta Pixel, no Vercel Analytics component, no PostHog, no Segment.
- **Web Speech API nuance noted.** Chrome's `webkitSpeechRecognition` does stream audio to Google's servers for transcription. This is Chrome's behaviour, not NDL's.
- **Phase 2 voice capture direction clarified.** Captured as a Phase 2 goal: one-step capture from voice to NDL insight, likely via PWA with MediaRecorder + Whisper. Deferred until post-launch dogfood. **Note: this item is now in progress as of 25 April 2026 (see below).**

### 24 April 2026
- **Middleware redirect loop closed on code review.** `src/middleware.ts` calls `supabase.auth.getUser()` and uses the validated result for redirects.
- **Vercel logout glitch reclassified** as a Vercel dashboard UI glitch, not an NDL auth issue.
- **Security patches applied.** `next@14.2.35` (closed 17 advisories including critical Cache Poisoning), `@supabase/ssr@0.10.2`, `eslint-config-next@14.2.35`. Smoke-tested in production.
- **`npm audit` remaining state: 4 high.** All require major-version migrations (Next 14 → 16, ESLint 14.x → 16).
- **OpenClaw API key revoked.** 7-day NDL-only spend review window opens around 30 April 2026.
- **Anthropic API key inventory captured** (5 keys, one revoked).
- **Google account 2FA enabled.** `hobbesinvestments@gmail.com`. Authenticator app, backup codes printed + on removable drive.
- **Cloudflare account 2FA confirmed active.** Backup codes printed + on removable drive.
- **Access sheet work started (Section 1 only).** Sections 2–7 outstanding.

### 25 April 2026
- **Voice recording bug investigation conducted.** User reported on phone: when stopping voice recording, the conversation was being cut off; the final chunk of speech (often after a pause) did not appear in the textarea after Stop.
- **Hypothesis investigated: mobile silence auto-stop.** The Web Speech API on mobile browsers (especially iOS) is documented to auto-stop on prolonged silence regardless of `continuous = true`. Diagnosed as the most likely cause: `onend` fires on auto-stop, the UI flips back to "Record Voice" without the user's knowledge, and any speech after that point is lost.
- **Defensive fix written.** Added a `userStoppedRef` flag to distinguish user-initiated stops from browser-initiated auto-stops. In the `onend` handler, if the user did not stop the recording, transparently restart `recognition.start()` so the accumulated transcript continues. The `finalTranscriptRef` survives the restart because it lives outside the recognition session.
- **Fix branch created and pushed.** Branch `voice-truncation-fix` exists on GitHub. Contains the auto-restart logic, the diagnostic `console.log` lines added during testing, and an on-screen `DebugLogPanel` component used to capture logs on the phone where remote-debug is impractical (iPhone + Windows desktop combination has no native Safari Web Inspector path).
- **Vercel preview deploy used for phone testing.** Vercel Authentication was disabled on preview deploys to allow access from a phone not signed into Vercel. Supabase Redirect URL allowlist was updated to include the preview URL's `/auth/callback`.
- **Phone testing performed: bug could not be reproduced.** Two test runs on the preview URL using a 10-second silence and then a 30-second silence. In both cases, only one `[onend] fired` event was logged, with `userStopped: true`, meaning the recording session never auto-stopped during the test. Both speech chunks were captured correctly. The `finalTranscriptRef` matched the textarea content at the end.
- **Conclusion on the voice-truncation bug.** The defensive fix on the branch does no harm in cases where the auto-stop does not fire. However, we could not validate that it fixes the original reported bug, because the auto-stop did not fire under controlled testing on the preview URL. The original bug report on production may have been caused by something other than mobile silence auto-stop; iOS Safari's behaviour is known to vary by version, network conditions, and background noise.
- **Decision: pivot to Whisper instead of further patching the Web Speech API.** The voice-recording feature is now on a deprecation path. The auto-restart fix is preserved on the `voice-truncation-fix` branch as a record of the experiment but is not being merged. The next session will scope and begin the Whisper migration.

> **Lesson from this session, captured for future reference.** The session opened with the user suggesting Whisper as the answer to a non-English-speaker accuracy problem. The developer-peer instinct was to push back and try patching the existing stack first. Several hours were spent on a bug that could not be reliably reproduced, on a feature that was already on the deprecation roadmap. The pushback was reasonable in principle but underweighted the cost of investigation versus the cost of the alternative. Whisper at $0.006/minute was always going to be cheaper than user time. Future sessions: when the user proposes a path that is already on the roadmap, "should we just do that" is a valid first question, not a second one. Captured as a new convention point below.

---

## Launch Blockers Remaining

None in the strict sense. Pre-launch polish and verification items only.

### 1. Lawyer review of Privacy Policy and Terms of Service
Not a blocker pre-dogfood, but should happen before any public launch or paid tier. **Worth pulling forward to cover the Whisper migration's Privacy Policy implications**, since that work is now in progress.

---

## Important Product Facts

- **Audio capture IS a live feature.** "Record Voice" button in `src/app/dashboard/dashboard-content.tsx` uses the browser Web Speech API. **This implementation is on a deprecation path; Whisper migration is in progress (post-launch item 22).** Until Whisper ships, audio is transcribed locally by the browser, never uploaded to NDL servers. Only the resulting text reaches the backend. (Note: Chrome's Web Speech API does send audio to Google for transcription; this is a browser behaviour, not NDL's.)
- **A defensive auto-restart fix for the Web Speech API exists on the `voice-truncation-fix` branch but is unmerged.** The fix could not be definitively validated because the original bug could not be reproduced under controlled preview-test conditions. The branch is preserved as a record of the experiment, not as a stepping stone toward production.
- **Transcript `raw_content` is nulled after extraction.** The row is kept (preserving token counts, processed_at, status) but the actual transcript text is wiped. Column is nullable as of 20 April 2026.
- **Transcript delete cascades correctly.** Deleting a transcript wipes its topics and insights. Verified.
- **No in-app edit functionality exists** for user data. Corrections must be requested via privacy@ndledger.com under APP 13.
- **Account deletion endpoint verified end-to-end as of 22 April 2026.**
- **No analytics or advertising SDKs installed as of 22 April 2026.** Vercel's default infrastructure telemetry (request counts, response times) is the only server-side metric layer; already covered by Privacy Policy disclosure of Vercel as hosting provider.
- **The site had no viewport meta tag until 20 April 2026.** Now fixed in `src/app/layout.tsx`. If mobile styling regresses in future, check this first.
- **AREASPEC PTY LTD operates NDLedger; it does NOT "trade as" NDLedger.**
- **`www.ndledger.com` is the canonical domain.** Apex `ndledger.com` redirects via 307 to `www`.
- **Middleware redirect logic validates sessions, not cookies.**
- **Next.js App Router route groups are used for marketing pages.** `src/app/(marketing)/` is a route group.
- **FAQ wording matches storage behaviour** as of 21 April 2026.
- **`@supabase/ssr` cookie handlers are on the deprecated API pattern** (`get`/`set`/`remove`). Still works on 0.10.x. Migration is post-launch item 25.
- **Production Next.js version is 14.2.35.** The latest 14.x patch.

---

## Security & Account Posture

- **Legal entity:** AREASPEC PTY LTD (ACN 690 941 078)
- **Legal contact:** privacy@ndledger.com
- **Jurisdiction at launch:** Australia only. NOT scoped for GDPR or CCPA.
- **Privacy stance:** No content monitoring. Insights-only long-term storage. Transcripts deleted (nulled) after extraction; policy, FAQ, and code all match.
- **Audio handling (current implementation):** Web Speech API in browser only. No audio reaches NDL.
- **Audio handling (post-Whisper migration):** Will change. OpenAI becomes a sub-processor. Privacy Policy and Terms of Service must be updated before Whisper ships. See post-launch item 22.
- **Terms of Service liability cap:** AUD $50 flat. Australian Consumer Law carve-out included.
- **Corporate structure:** MEZ FRANCHISE PTY LTD owns AREASPEC PTY LTD. Robert is sole director.

### Account 2FA status (as of 24 April 2026)
- **Google (`hobbesinvestments@gmail.com`):** ✅ on. Authenticator app. Backup codes printed + on removable drive.
- **Cloudflare (`admin@areaspec.com`):** ✅ on. TOTP. Backup codes printed + on removable drive.
- **GitHub, Vercel, Supabase, Anthropic:** not yet audited. To be captured during access sheet Sections 2–7.

### Anthropic API key inventory
| Key Name | Purpose | Status |
|---|---|---|
| `ndledger-production` | NDL production extraction (used by Vercel) | Active |
| `ndledger-testing` | Testing / staging | Active |
| `Ledga` | Older NDL-adjacent key, purpose unclear | Active, review candidate |
| `mdc-areaspec-platform` | MDC product | Active |
| `Basil Openclaw` | OpenClaw agent | ✅ Revoked 24 April 2026 |

### Vercel state
- **Deployment Protection / Vercel Authentication on preview deploys: currently DISABLED.** Set to "Disabled" or "Only Production Deployments" during the 25 April voice-recording phone test, to allow access from a phone not signed into Vercel. **Re-enable before any further preview testing.** Captured as a security item.

### Supabase Redirect URLs allowlist
Currently includes the `voice-truncation-fix` preview URL added during the 25 April session. The full list as of the end of session:
- `https://www.ndledger.com/auth/callback`
- `https://ndledger.com/auth/callback`
- `https://ledga-nine.vercel.app/auth/callback`
- `http://localhost:3001/auth/callback`
- `https://ledga-git-voice-truncation-fix-victaaaws-projects.vercel.app/auth/callback` (added 25 April; can be removed once the branch is no longer being tested)

---

## Post-Launch Iteration List

Non-blocking. Address after launch, in priority order.

1. ~~Uninstall OpenClaw and review API usage, after 7 days of NDL-only spend~~ **API key revoked 24 April 2026.** 7-day review window: check around 30 April 2026; decide whether Anthropic monthly cap drops below $100.
2. Category taxonomy gaps. No category for hiring/team decisions; both Haiku and Sonnet miscategorised a hiring decision as `business_monetisation` during testing.
3. Pivot classification accuracy. Monitor over first 20–30 real extractions; if slipping, add concrete pivot example to prompt.
4. Monitor 200k character guardrail vs real usage. Nearly tripped on first real dogfood session.
5. ~~`npm audit`: 9 vulnerabilities flagged~~ **Reduced to 4 high on 24 April 2026.** Remaining 4 require major-version migrations (items 23 and 24).
6. Rename Vercel project and GitHub repo from `ledga` to `ndledger`.
7. File upload. Phase 2 per master doc (PDF, TXT, DOCX, MD).
8. Test large transcript paste behaviour before Phase 2 file upload ships.
9. `git prune` unreachable objects (warning surfaces on every push now).
10. NDL access sheet. Section 1 (Cloudflare) captured in chat 24 April; Sections 2–7 outstanding. Stored outside git. No secrets in the doc.
11. Separate production API key from test key (already done in practice). Remaining work: verify dev/local does not use the production key.
12. In-app edit functionality for user insights. Would allow policy to reinstate "correct your data through the app" claim.
13. Register `ndledger` as a business name with ASIC (~$42/yr) for formal name protection.
14. Decide on `ndledger.com.au`. Open question, deferred.
15. Cloudflare Proxied mode. Revisit only if bot abuse becomes real.
16. Build a proper `/contact` page (currently `mailto:` only in footers).
17. ~~Confirm middleware redirect loop does not reproduce.~~ **Closed 24 April 2026 on code review.**
18. Mind map category node overlap. Slight visual overlap from the 320px width fix on 21 April.
19. Extract marketing footer into a shared client component using `usePathname()`. Only worth doing if a fourth marketing page is added.
20. Consider explicit `profiles` delete step in `/api/account/delete` as belt-and-braces. Current cascade verified 22 April but silently schema-dependent.
21. ~~Vercel logout glitch~~ **Closed 24 April 2026.**
22. **Phase 2 voice capture: Whisper migration. IN PROGRESS as of 25 April 2026.** Replace Web Speech API with OpenAI Whisper to gain reliable multilingual support and remove mobile silence-auto-stop edge cases. Scope (see "Whisper Migration: Open Decisions" section below):
    - Obtain OpenAI API key, add to Vercel env vars (all three environments)
    - New Next.js API route to proxy audio uploads to Whisper (key cannot live in client)
    - Replace Web Speech API recording component with MediaRecorder-based version
    - Update Privacy Policy to disclose OpenAI as sub-processor
    - Update Terms of Service Section 5 audio handling promise
    - Pull lawyer review forward to cover the policy changes
    - Test on preview branch before production
23. **Next 14 → 16 migration.** Closes 4+ DoS / request-smuggling advisories. Estimated 2–3 hour session.
24. **ESLint 14.x → 16 migration.** Bundle with item 23.
25. **Migrate `@supabase/ssr` cookie handlers to `getAll`/`setAll` pattern.**
26. **Investigate `.git/objects` file-lock prompts during `git push`.** Likely VS Code indexer, residual OneDrive sync lock, or Windows Defender real-time scan.
27. **Review the `Ledga` Anthropic API key.** If not in use, revoke.
28. **Audit 2FA status on the remaining services.** GitHub, Vercel, Supabase, Anthropic Console.
29. **Decide the fate of the `voice-truncation-fix` branch on GitHub.** Currently preserved as a record of the experiment. If the Whisper migration completes successfully and the Web Speech API code is removed entirely, the branch can be deleted. If kept, document why.
30. **Re-enable Vercel Authentication on preview deploys.** Disabled during 25 April phone testing. Closed exposure: a small one, but real. Top of the list for the next session's housekeeping pass.
31. **Relocate `NDLedger_Legal_Outline.md` out of `src/app/(marketing)/privacy/`.** Currently sitting in the public marketing folder; should not ship there. Suggested target: `Handover/legal/` or a new `legal/` folder at project root.
32. **Delete the stray PNG `src/app/api/2026-04-24 (3).png`.**
33. **Commit the handoff archive reorganisation and v11 file.** Sitting uncommitted in the working tree at the end of the 25 April session.
34. **Decide whether `.claude/VS Code.code-workspace` is committed or gitignored.**

---

## Whisper Migration: Open Decisions

Captured for the next session. The migration cannot start until these four are settled.

1. **OpenAI account.** Does Robert have an existing OpenAI account, or does one need to be created at platform.openai.com? An API key is a hard prerequisite; nothing else can proceed without one. The key will need to live in Vercel environment variables (Production, Preview, Development) under a name like `OPENAI_API_KEY`. Pricing as of last check: Whisper is $0.006/minute; gpt-4o-mini-transcribe is $0.003/minute. For a 5-minute voice note this is 1.5–3 cents.
2. **Privacy Policy and Terms of Service updates.** Adding Whisper means OpenAI becomes a third-party sub-processor that briefly handles user audio. Privacy Policy needs OpenAI listed as a sub-processor under the same heading where Anthropic currently appears. Terms of Service Section 5 makes a specific promise about audio handling that needs to change. Decision: do these copy changes happen alongside the code (recommended), or behind a feature flag with copy updated later?
3. **UX trade-off.** Web Speech API gives live, in-the-moment transcription. Whisper does not work that way; it is a batch process. With Whisper, the user records, taps Stop, then waits 2–5 seconds (longer for longer recordings) while the audio uploads and is transcribed. Confirm Robert is comfortable with the batch-transcribe model before implementation, because the change in feel is meaningful.
4. **Multi-language defaults.** Whisper auto-detects the language by default. Alternatively, a language hint can be specified at request time. Decision: auto-detect (simpler, recommended for launch where the non-English user base is unknown) or per-user language preference (more complex, useful only once a meaningful non-English cohort exists).

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
1. User pastes transcript OR speaks via Record Voice (Web Speech API transcribes locally in browser; Chrome routes via Google for the actual transcription)
2. Text is submitted: POST to `/api/extract` with `transcriptId`
3. Route fetches transcript, validates size (< 200k chars)
4. Calls Anthropic API with `claude-haiku-4-5`
5. Parses JSON response, inserts topics and insights into Supabase
6. Logs `input_tokens` and `output_tokens` to `transcripts` table
7. Marks transcript `completed` AND nulls `raw_content` in the same update (honours Privacy Policy deletion promise)

### Voice Recording (Current — being replaced)
- `src/app/dashboard/dashboard-content.tsx` uses `webkitSpeechRecognition`
- Audio is captured and transcribed entirely in the browser
- Only the resulting text string reaches NDL servers
- Chrome's implementation streams audio to Google for transcription (browser-level, not NDL)
- **This entire flow will be replaced as part of post-launch item 22.**

### Account Deletion Flow (`/api/account/delete`)
1. Auth check: `supabase.auth.getUser()`; returns 401 if not authenticated
2. Admin client created with `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
3. Delete insights `WHERE user_id = auth.uid()`
4. Delete topics `WHERE user_id = auth.uid()`
5. Delete transcripts `WHERE user_id = auth.uid()`
6. `admin.auth.admin.deleteUser(user.id)`, which triggers `ON DELETE CASCADE` on `profiles.id`
7. Each step aborts the flow with a 500 on error; no partial deletions silently continue

### Auth Flow
`src/app/auth/callback/route.ts`:
1. Creates Supabase client inline with cookie handlers (`get`/`set`/`remove` pattern; deprecated on 0.10.x but still functional)
2. Reads code-verifier from `request.cookies`
3. Writes session tokens to `response.cookies`
4. On PKCE error redirects to `/login?error=link_expired`
5. On generic auth error redirects to `/login?error=auth_failed`

`src/app/login/page.tsx`:
- Default export `LoginPage` wraps `LoginForm` in `<Suspense>`
- `LoginForm` reads the `?error=` query param on mount and renders a pre-populated error message
- For `link_expired`, auto-switches to magic-link mode

### Middleware
`src/middleware.ts` guards `/dashboard/*` (requires auth) and redirects signed-in users away from `/` and `/login` to `/dashboard`. Calls `supabase.auth.getUser()` and uses the validated result for redirect decisions. Does NOT trust cookie presence alone.

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase publishable key (safe to expose, RLS-protected)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase secret key (admin access, NEVER commit or paste)
- `ANTHROPIC_API_KEY`: Anthropic API key. In production: `ndledger-production`.
- **Coming with Whisper migration:** `OPENAI_API_KEY`. Will need to be added to all three Vercel environments (Production, Preview, Development) before the Whisper code can ship.

Retrieve current values from:
- Supabase Dashboard → Project Settings → API
- Anthropic Console → API Keys
- OpenAI Platform → API Keys (when key is created for Whisper migration)
- Vercel Dashboard → Project Settings → Environment Variables

### Supabase Auth Configuration
- **Site URL:** `https://www.ndledger.com`
- **Redirect URLs:** see Security & Account Posture section above

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
- No `/contact` page. Contact links in footers are `mailto:privacy@ndledger.com` only.

### Current Package Versions
- `next`: 14.2.35
- `@supabase/ssr`: 0.10.2
- `eslint-config-next`: 14.2.35
- Anthropic model: `claude-haiku-4-5`

---

## Scaling & Performance (Education Section)

How to think about data volume and UI performance, not a fixed set of rules.

**Principle:** Don't delete user data to manage UI load. Manage UI load through rendering techniques. The data layer (Postgres) handles millions of rows; the bottleneck is always the UI rendering too much at once.

**Techniques, in order of sophistication:**
1. **Pagination.** Show 20 items per page, next/previous. Universal, simple.
2. **Infinite scroll.** Load more on scroll. Trickier with back-navigation and accessibility.
3. **Virtualisation.** Only render items in the viewport. For lists of thousands.
4. **Search and filter.** Volume becomes irrelevant for most cases.

**Rough thresholds for NDL:**
- Under ~100 items per list: render all, no pagination
- 100 to 1,000: add pagination or search
- 1,000 to 10,000: pagination mandatory
- 10,000+: virtualisation, server-side filtering, archive old data

**NDL today:** ~5 insights. Do nothing. When it starts feeling visually cluttered (not slow), add a sort or filter.

---

## Cost Model

### Extraction (Anthropic Haiku 4.5)
| Metric | Value |
|---|---|
| Avg input tokens per extraction | ~2,000 |
| Avg output tokens per extraction | ~1,500 |
| Cost per extraction | ~$0.01 |
| Cost per 1,000 extractions | ~$10.00 |

### Heavy session (real dogfood, 19 April 2026)
| Metric | Value |
|---|---|
| Input tokens | 48,643 |
| Output tokens | 2,534 |
| Cost | ~$0.06 |
| Characters | ~195,000 (near 200k guardrail) |

### Voice transcription (post-Whisper migration projection)
| Provider | Cost |
|---|---|
| Whisper (`whisper-1`) | $0.006/minute = $0.36/hour |
| gpt-4o-mini-transcribe | $0.003/minute = $0.18/hour |

For a 5-minute voice note: 1.5–3 cents. Adds to the ~1¢ extraction cost. Total per-voice-note cost ~2.5–4¢.

**Current Anthropic monthly cap:** $100. OpenClaw key revoked 24 April. 7-day review window opens 30 April; cap likely too generous for NDL alone, revisit then.

---

## Communication Preferences (Robert)

- One clear action at a time
- Wait for confirmation before next step
- Plain language, concrete next steps
- No bundled instructions
- Use NDL as abbreviation for NDLedger
- Push back on scope creep, advocate for shipping over perfecting

### Learning vs Building
Robert is learning the field as he builds. Questions that start with "should I..." or "how does this work" are often learning questions, not build decisions. On learning questions, lead with a plain explanation of how the domain works rather than leading with pushback on the premise.

### Writing Conventions (enforced in all user-facing copy AND handoff docs)
- **No em dashes.** Use commas, semicolons, colons, or separate sentences.
- **No en dashes** except in numeric ranges.
- **Australian English spelling** throughout. `organise`, `visualise`, `unauthorised`, `licence` (noun), `behaviour`, `colour`, `centre`. Never `organize`, `license` (as a noun), `behavior`, `color`, `center`.
- **No contractions in formal documents** (Terms, Privacy Policy). Conversational pages can use contractions.
- **Semicolons in legal lists.** Final item joined with "; and" or "; or".
- **"On termination" not "upon termination".**
- **Entity language:** "AREASPEC PTY LTD, the Australian company behind NDLedger". Never "trading as NDLedger".

---

## How to Continue

### Local Dev
1. `cd /c/Projects/NDL/ledga-app`
2. `npm run dev`
3. Access at http://localhost:3001 (same browser for login flow, not incognito)

### Production
- URL: https://www.ndledger.com ✅
- Auto-deploys from GitHub `main` branch
- Deployment status: https://vercel.com/dashboard → `ledga` project → Deployments

### If Dev Server Won't Start
- Kill ports: `npx kill-port 3001 3002`
- Clear cache: `rm -rf .next`
- Restart: `npm run dev`

### If Magic Links Go To The Wrong Domain
1. Check Supabase → Authentication → URL Configuration → Site URL. Should be `https://www.ndledger.com`.
2. Check Vercel → Domains. `www` should be canonical, apex should 307-redirect.
3. Check Supabase Redirect URLs allowlist contains both www and apex `/auth/callback` variants.

### If `git push` Hangs On Pack-File Prompts
1. Git push completes BEFORE the prompts appear. The commit is already on GitHub.
2. Answer `n` or press `Ctrl+C`.
3. Verify with `git log --oneline -1`.
4. See post-launch item 26 for diagnosis.

### Starting the Whisper Migration (next session)

The Whisper migration is post-launch item 22 and is now in progress. Recommended sequence:

1. Resolve the four "Open Decisions" listed in the Whisper Migration section above. None of the implementation work can start without them.
2. Once decided, the implementation breaks into roughly six steps:
   a. Set up OpenAI account, generate API key, add `OPENAI_API_KEY` to all three Vercel environments.
   b. Write a new Next.js API route, e.g. `/api/transcribe`, that accepts an audio blob and forwards it to OpenAI's transcription endpoint. The key must not live in the client.
   c. Rewrite the recording component in `dashboard-content.tsx`. Replace the `webkitSpeechRecognition` flow with a `MediaRecorder` flow: capture audio to a Blob on Stop, POST it to `/api/transcribe`, set the returned text in the textarea.
   d. Update the Privacy Policy to disclose OpenAI as a sub-processor.
   e. Update Terms of Service Section 5 audio handling language.
   f. Pull lawyer review forward to cover the copy changes.
3. Each step gets a confirmation before the next, in the established working pattern.
4. Test on a preview branch before merging to main. Re-enable Vercel Authentication on preview deploys before testing (see post-launch item 30).

---

## Handoff Doc Convention

The convention established in v11 stands. Specifically:

1. **Each new version is a complete source of truth, not a delta.**
2. **Merge, don't append.** Integrate new facts into existing sections.
3. **Use "Completed to Date" to log dated accomplishments chronologically.**
4. **Correct outdated facts in place.** Flag the correction in "Important Product Facts".
5. **Archive prior versions** in `Handover/archive/`.
6. **Update Project Knowledge** after saving the new version.
7. **Never include credentials, API keys, or secrets.** Reference *where* to retrieve them, not the values.
8. **Robert pastes file contents directly into chat** rather than having Claude read from disk. Established 20 April 2026.
9. **All user-facing copy AND handoff docs adhere to the writing conventions** (no em dashes, AU English, semicolons in legal lists).
10. **Distinguish localhost verification from production verification.** Established 21 April 2026.
11. **Treat "learning questions" differently from "build questions".** Lead with explanation on learning questions.
12. **Verify claims, don't assume them.** Confirm bugs reproduce before writing fixes. Established 22 April 2026.
13. **Sequence package upgrades; do not bundle them.** Established 24 April 2026.
14. **Separate security-meaningful advisories from noise.** Established 24 April 2026.
15. **Flag security gaps in root accounts before worrying about downstream.** Established 24 April 2026.
16. **When the user proposes a path that is already on the roadmap, "should we just do that" is a valid first question, not a second one.** Pushing back to investigate the existing stack is a reasonable instinct, but the cost of investigation must be weighed against the cost of the alternative. The 25 April session spent several hours on a non-reproducible bug in a feature already scheduled for replacement. Established 25 April 2026.
17. **Watch for clean-deck pressure at session-end.** Long sessions accumulate friction; "remove it" or "wipe it" instructions deserve a one-question check before action, especially when uncommitted work is in the tree. The cost of asking is low; the cost of acting on a misread is potentially high. Established 25 April 2026.

---

## Next Session, Start Here

**Recommended order:**

1. **Resolve the working tree first.** See "Working Tree State (Read This First)" at the top of this document. Specifically: relocate the legal outline, delete the stray PNG, commit the handoff archive reorganisation and v11 file, switch to `main`, and re-enable Vercel Authentication on preview deploys. This is housekeeping but it should be done before any new work.

2. **Begin the Whisper migration.** Start by resolving the four open decisions in the "Whisper Migration: Open Decisions" section. Then proceed through the implementation steps in "Starting the Whisper Migration" under the How to Continue section.

3. **7-day post-OpenClaw API spend review** (around 30 April 2026). Check Anthropic Console usage. Decide whether the monthly cap drops.

4. **Lawyer review** of Privacy Policy and Terms of Service. Should be pulled forward to cover the Whisper migration's copy changes, rather than waiting until after launch.

5. **Audit 2FA on remaining services** (GitHub, Vercel, Supabase, Anthropic Console) during the access sheet work.

---

## Archive Command

To archive v11 after saving v12:

```bash
cd /c/Projects/NDL/ledga-app
git mv Handover/NDL_Handoff_Summary_v11.md Handover/archive/NDL_Handoff_Summary_v11.md
git add Handover/NDL_Handoff_Summary_v12.md
git commit -m "Handoff v12: session 25 April 2026; pivot voice recording to Whisper; archive v11"
git push
```

Then upload `NDL_Handoff_Summary_v12.md` to the Claude Project so the next session reads the current version.

---

*End of handoff summary v12. v1 to v11 superseded and archived.*
