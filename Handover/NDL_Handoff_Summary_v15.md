# NDLedger · Handoff Summary v15
**Last Updated:** 30 April 2026
**Supersedes:** v14 (29 April 2026)

---

## Project Overview

**NDLedger** is an AI-agnostic background agent that extracts decisions, insights, commitments, pivots, and tasks from AI conversation transcripts and organises them into a searchable knowledge library.

**Target Market:** Solo founders, neurodivergent thinkers (ADHD, autism), SaaS operators, knowledge workers.

**Legal Entity:** AREASPEC PTY LTD (ACN 690 941 078), the Australian company behind NDLedger. Sole director: Robert Hobbes. Shareholder: MEZ FRANCHISE PTY LTD. Registered address: Ipswich, Queensland, Australia 4305.

> **Entity language note:** NDLedger is the product name. AREASPEC PTY LTD **operates** NDLedger; it does **not** "trade as" NDLedger. "NDLedger" has not been registered as a business name with ASIC (see post-launch list). Always use "the Australian company behind NDLedger" or "operates NDLedger", never "trading as NDLedger".

**Tech Stack:**
- Frontend: Next.js 14.2.35, Tailwind, shadcn/ui, deployed to Vercel
- Backend: Supabase (Sydney region). Postgres, Auth, RLS. `@supabase/ssr` 0.10.2
- Extraction: Anthropic API (Claude Haiku 4.5)
- Voice transcription: OpenAI Whisper (`whisper-1`) via `/api/transcribe`. Whisper migration completed 27 April 2026. Web Speech API removed.
- DNS + Email: Cloudflare (DNS-only proxy, Email Routing disabled — see email routing note below). 2FA active.
- Local dev: localhost:3001
- Production: https://www.ndledger.com (custom domain live, SSL valid, www is canonical)
- Fallback: https://ledga-nine.vercel.app (auto-deploy target)

**GitHub Repo:** https://github.com/Victaaaw/Ledga

**Project path (local):** `C:\Projects\NDL\ledga-app`

---

## Working Tree State (Read This First)

The session ended with a clean working tree on `main`. Production is up to date. No uncommitted changes.

Outstanding housekeeping items:
- Remove the `whisper-migration` preview URL from the Supabase redirect allowlist if not already done (post-launch item 36).
- Check Anthropic API spend around 30 April 2026 (7-day post-OpenClaw review window).

---

## Persistent Agent Files (read these every session before touching anything)

| File | Purpose |
|------|---------|
| `.agents/product-marketing-context.md` | Full product context; all marketing skills read this first |
| `.agents/copy-decisions.md` | All copy rules and decisions; do not contradict these |
| `.agents/directory-submissions.md` | Full directory submission copy, variants, and strategy. Updated 30 April 2026 with locked messaging framework |
| `.agents/directory-tracker.md` | Submission tracker; update as directories go live |
| `.agents/ndledger-brand.md` | Locked brand and messaging philosophy. Read before any marketing task |

---

## Mandatory Copy Rules

These apply to all user-facing copy AND all handoff documents. See `.agents/copy-decisions.md` for full decision log.

- **AU English** throughout: organised, recognised, colour, behaviour, centre, licence (noun)
- **No em dashes.** Use commas, semicolons, colons, or separate sentences
- **No en dashes** except in numeric ranges
- **No "free to use" or "free forever".** Use "free to get started" or "start for free"
- **No upload references.** Users paste or record conversations; there is no upload function
- **Deletion applies to transcripts, not topics.** Users can delete transcripts from the dashboard
- **Seven categories:** six business-relevant plus one personal
- **CTA button copy:** "Get Started" (not "Create My Free Library" or any "free" variant)
- **No contractions in formal documents** (Terms, Privacy Policy). Conversational pages may use contractions
- **Entity language:** "AREASPEC PTY LTD, the Australian company behind NDLedger". Never "trading as NDLedger"

---

## Completed to Date

### 16 April 2026
- Fixed auth PKCE issue
- End-to-end user flow tested

### 19 April 2026
- Model selection tested on evidence. 4 transcripts, Haiku 4.5 vs Sonnet 4.5 side-by-side
- Haiku 4.5 locked in as production model (3.3x cheaper, better extraction discipline)
- Extraction migrated from Claude Code CLI to Anthropic API
- Cost guardrails added: 200k char input limit, token logging, model defaulted in one place
- Database schema updated: `input_tokens` and `output_tokens` columns on `transcripts` table
- Vercel deployment fixed and verified
- Production bugs fixed: TypeScript iteration on Map, `ANTHROPIC_API_KEY` env scope

### 20 April 2026 (session A)
- Domain registered and live. ndledger.com via Cloudflare, DNS pointed at Vercel (CNAME to Vercel, DNS-only proxy), SSL valid
- Cloudflare Email Routing active. privacy@ndledger.com forwards to hobbesinvestments@gmail.com
- Corporate entity confirmed. AREASPEC PTY LTD verified via ASIC register, sole director
- Privacy Policy rewritten and deployed. Live at https://ndledger.com/privacy. Reflects AREASPEC entity, transcript deletion stance, NDB scheme compliance, 24-month inactive account retention, Cloudflare as disclosed third party
- Corrections clause verified against code. Removed false "correct your data through the app" claim, replaced with email contact (APP 13 compliance)

### 20 April 2026 (session B)
- **Blocker 1 closed: transcript deletion.** Added `raw_content: null` to the completion update in `src/app/api/extract/route.ts`
- **Database migration applied.** `transcripts.raw_content` column made nullable
- **Supabase redirect URL added.** `https://ndledger.com/auth/callback` added to the allowed redirects list
- **Blocker 2 closed: Terms of Service.** Refined. AREASPEC entity swapped in; liability cap AUD $50 flat; contact email changed to `privacy@ndledger.com`; transcript deletion and audio handling promises added to Section 5
- **Blocker 3 closed: PKCE UX fix.** Callback differentiates PKCE errors from generic auth errors; login page reads `?error=` query param; `link_expired` auto-switches to magic-link mode
- **Privacy Policy "trading as" correction.** Section 1 reads "AREASPEC PTY LTD, the Australian company behind NDLedger"
- **Footer Contact links converted to `mailto:`.** All three footers
- **Landing page hero logo stretching fixed**
- **Viewport meta added to root layout**

### 21 April 2026 (session A)
- Session B commits pushed to production
- Login page Suspense boundary added. `useSearchParams()` fix for static prerender
- Mobile header fix on `/privacy` and `/terms`. `hidden sm:inline-block` on "Back to home" link
- Footer active-link highlight added. Teal highlight on current page link in footer
- FAQ updates on landing page. Wording now matches actual storage behaviour
- Magic link auth fixed. Supabase Site URL corrected; `www` variant added to redirect allowlist
- Mind map category node width fix. `CATEGORY_WIDTH` raised from 240 to 320

### 22 April 2026
- Pre-launch compliance verification complete. Account deletion cascade, audio isolation, and absence of analytics SDKs all verified against code
- Web Speech API nuance noted. Chrome streams audio to Google; this is browser behaviour, not NDL's

### 24 April 2026
- Middleware redirect loop closed on code review
- Security patches applied. `next@14.2.35`, `@supabase/ssr@0.10.2`, `eslint-config-next@14.2.35`. `npm audit` reduced to 4 high (all require major-version migrations)
- OpenClaw API key revoked. 7-day NDL-only spend review window: check around 30 April 2026
- Anthropic API key inventory captured (5 keys, one revoked)
- Google account 2FA enabled. Authenticator app, backup codes secured
- Cloudflare account 2FA confirmed active
- Access sheet work started (Section 1 only). Sections 2-7 outstanding

### 25 April 2026
- Voice recording bug investigated. Mobile silence auto-stop on Web Speech API could not be reproduced under controlled conditions on preview
- Decision: pivot to Whisper. Web Speech API placed on deprecation path. `voice-truncation-fix` branch preserved as a record of the experiment; not merged

### 27 April 2026
- Working tree cleanup completed. Handoff archive reorganised (v1 through v11 moved to `Handover/archive/`); v12 committed to `main`; legal outline relocated from `src/app/(marketing)/privacy/` to `Handover/legal/`; stray PNG deleted; `email addresses/` folder moved out of repo to `C:\Projects\NDL\Docs`; `.claude/` added to `.gitignore`; Vercel Authentication re-enabled on preview deploys
- Whisper migration completed and deployed to production. Full implementation on `whisper-migration` branch, merged to `main` via fast-forward. Tested end-to-end on phone and production
- `OPENAI_API_KEY` added to Vercel (Production and Preview environments) and to local `.env.local`. Variable name must be `OPENAI_API_KEY` exactly
- OpenAI language detection set to auto-detect. No language hint passed to Whisper; Whisper detects language automatically

### 29 April 2026
- **Marketing skills installed.** `coreyhaines31/marketingskills` installed via `npx skills add`. All 38 skills available under `.agents/skills/`
- **Product marketing context created.** `.agents/product-marketing-context.md` generated by CC from codebase. Placeholders marked with `<!-- TODO -->` for pricing, customer verbatim language, testimonials, first-week metrics, competitor check, and neurodivergent positioning decision
- **Landing page copy rewritten.** 11 edits shipped and deployed via Vercel. See "Landing Page Changes" section below
- **Copy decisions log created.** `.agents/copy-decisions.md` with 7 logged decisions and reasoning. All future sessions must read this before touching copy
- **Directory submission strategy created.** `.agents/directory-submissions.md` with full copy, four 150-word variants, rotating taglines, and prioritised directory list
- **Directory tracker created.** `.agents/directory-tracker.md` pre-populated with all 14 Group 1 directories
- **Bash heredoc build error fixed.** A previous session accidentally wrote a bash `cat` command into `src/app/Transcribe/route.ts`. Removed. Build confirmed passing
- **`git config --global gc.auto 0` applied.** Stops repeated `.git/objects` deletion prompts on Windows after push

#### Landing Page Changes (29 April 2026)
All changes live in `src/app/(marketing)/page.tsx`:
- Hero `<br>` always visible (removed `hidden sm:block`) — hero now displays as two lines on all viewports
- All 9 em dashes removed; replaced with commas, colons, semicolons, or parentheses as appropriate
- Auto-organised description: added "(and one personal)"; period-break replacing the dash
- "How it works" subtitle: "Upload once" changed to "Add a conversation"
- Step 1 description: em dash changed to colon before the tool list
- Step 3 description: em dash changed to semicolon
- Privacy section h2 and paragraph body: two em dashes fixed
- TrustPoint "Row-level security": em dash changed to colon
- FAQ "What if extraction misses...": "re-upload" changed to "paste again"
- FAQ "How does extraction work?": "upload a transcript" changed to "paste or record a conversation"; "six categories" corrected to "seven categories"; em dashes replaced with parentheses
- FAQ "How do I delete my data?": "topics" corrected to "transcripts"
- Hero subtext updated from "Free to use. No credit card. Works with any AI tool." to accurate free-to-start framing (product owner confirmed paid tiers are planned)
- CTA button copy changed from "Create My Free Library" to "Get Started"

### 30 April 2026
- **Messaging framework locked.** Core purpose statement, primary headline variants, supporting lines, and four pillars updated. Full framework in `.agents/ndledger-brand.md`. See "Locked Messaging Framework" section below.
- **Neurodivergent user persona developed.** Based on real ND user profile. Grounded insights used to sharpen product messaging. See "ND Persona" section below.
- **`ndledger-brand.md` created.** Added to `.agents/` folder in CC project. CLAUDE.md updated with instruction to read this file before any marketing task.
- **Directory submissions document updated.** All copy variants updated to reflect locked messaging framework. Status column added to Group 1 table. Note added flagging that majority of Group 1 directories have moved to paid models.
- **Group 1 directory submissions attempted.** Results below. Cheat sheet produced for remaining submissions.
- **Email routing fixed.** Cloudflare Email Routing disabled (conflicts with Google Workspace MX records). `privacy@ndledger.com` now configured as an alias on `admin@ndledger.com` in Google Workspace. Verified working.
- **Google Workspace admin account created.** `admin@ndledger.com` is the primary account. `privacy@ndledger.com` is an alias on this account.
- **Pricing strategy agreed.** Three tiers: Free (5 transcripts), Pro ($12/month), Enterprise ($99/month). Waitlist CTA for paid tiers. See "Pricing" section below.
- **Pricing page built.** `pricing.jsx` React component produced. Ready to drop into Next.js project as `app/pricing/page.jsx`. Waitlist form requires wiring to email capture endpoint. Nav icon uses `NDLedger_icon_512.png` from `/public` folder.
- **Soft green brand colour added.** `#86EFAC` added to brand colour palette for success states and highlights.

---

## Locked Messaging Framework (30 April 2026)

### Core purpose statement (locked)
> NDLedger is the external memory that makes sure your best AI thinking survives your own brain.

This is the single sentence everything else hangs off. Not a filing system. Not a productivity tool. A second memory that does not forget, does not lose the thread, and does not require the user to be organised to use it.

### Primary headline variants

| Variant | Line | Context |
|---|---|---|
| Directory default | Stop losing your best thinking to a chat window. | Directory submissions, landing page |
| Test B | You already figured this out. NDLedger makes sure you can find it. | Community channels, ND spaces, social only |
| Test C | Your best AI thinking deserves to be found again. | LinkedIn, founder narrative posts |

### Supporting line variants
- "Paste a conversation. We will pull out the decisions, tasks, and insights and keep them searchable forever."
- "Every insight you have ever had with AI, captured, organised, and waiting when you need it."

### Four pillars
1. Capture instantly
2. Extract what matters
3. See it clearly
4. Find it when it counts

### Neurodivergent messaging rules (mandatory, carry into all content)
1. Never frame the product as fixing disorganisation. The user is not broken. A neurotypical system is failing them. NDLedger is the external system doing its job.
2. Name the retrieval moment specifically. "When you need it" is generic. The real moment is: starting a new AI session and knowing you already worked this out but not being able to find it.
3. Lead with zero effort required. No tagging, no filing, no decisions before value. Any friction before the first extraction is a drop-off risk for this audience.
4. Use "second brain" framing sparingly but precisely. The ND audience knows this concept. Use it in community channels, not on the landing page.
5. Respect the depth, do not condescend to the chaos. This user generates exceptional insight. Tone should honour the quality of their thinking.

---

## ND Persona (30 April 2026)

Developed from a real ND user profile. Used to sharpen product messaging and onboarding copy.

**Archetype:** The Knowledge Hoarder. ND power user, 50s, founder/knowledge worker, heavy AI user.

**Core pain points:**
- Generates enormous AI output and loses almost all of it
- Monotropic attention: goes very deep in one thread, cannot find it again when focus shifts
- Organisation is the single hardest thing, not a preference but a clinical ceiling
- Pattern recognition is exceptional; retrieval is the bottleneck, not comprehension
- Anxiety and sleep issues amplify the cost of lost work

**Product implications:**
- Auto-categorisation is non-negotiable; any prompt to choose a category will cause drop-off
- The "aha" must happen in under 60 seconds; show a skeleton of what is coming if extraction takes longer
- Mind map view is a genuine differentiator for this user; lead with it in demos
- Fuzzy search and semantic matching matter more than keyword precision
- Never frame the product as fixing disorganisation

---

## Pricing (agreed 30 April 2026)

| Tier | Price | Transcript limit | Notes |
|------|-------|-----------------|-------|
| Free | $0 | 5 total | Full feature access to drive activation |
| Pro | $12/month | Unlimited | Target: founders, knowledge workers, ND users |
| Enterprise | $99/month | Unlimited | Multiple users, admin dashboard, usage reporting |

**Transcript limit:** 100,000 words per conversation.

**Waitlist CTA:** "Join the waitlist" on Pro and Enterprise. Email capture only. Paid tiers not yet live in codebase.

**Pro description:** "For people who think best in conversation and cannot afford to lose what comes out of it."

**Pricing page:** `pricing.jsx` built and ready for Next.js integration. Place at `app/pricing/page.jsx`. Wire waitlist form to email capture endpoint. Nav icon requires `NDLedger_icon_512.png` in `/public` folder.

---

## Launch Blockers Remaining

None in the strict sense. Pre-launch polish and verification items only.

### 1. Lawyer review of Privacy Policy and Terms of Service
Not a blocker pre-dogfood, but should happen before any public launch or paid tier. Now more urgent: Whisper migration has changed both documents. Pull lawyer review forward before inviting external users.

---

## Important Product Facts

- **Voice recording uses OpenAI Whisper.** `src/app/dashboard/dashboard-content.tsx` uses `MediaRecorder` to capture audio, POSTs it to `/api/transcribe`, and sets the transcribed text in the textarea. The Web Speech API has been removed entirely. Audio is sent to OpenAI for transcription and is not retained by OpenAI beyond the API call. NDLedger does not store audio.
- **Recording UX is batch, not live.** Text does not appear during recording. It appears after the user taps Stop and Whisper returns the transcription (typically 2-5 seconds). The textarea is editable after text appears.
- **Transcript `raw_content` is nulled after extraction.** The row is kept (preserving token counts, processed_at, status) but the actual transcript text is wiped. Column is nullable as of 20 April 2026.
- **Transcript delete cascades correctly.** Deleting a transcript wipes its topics and insights. Verified.
- **No in-app edit functionality exists** for user data. Corrections must be requested via privacy@ndledger.com under APP 13.
- **Account deletion endpoint verified end-to-end as of 22 April 2026.**
- **No analytics or advertising SDKs installed as of 22 April 2026.**
- **AREASPEC PTY LTD operates NDLedger; it does NOT "trade as" NDLedger.**
- **`www.ndledger.com` is the canonical domain.** Apex `ndledger.com` redirects via 307 to `www`.
- **Middleware redirect logic validates sessions, not cookies.**
- **Next.js App Router route groups are used for marketing pages.** `src/app/(marketing)/` is a route group.
- **FAQ wording matches storage behaviour** as of 21 April 2026.
- **`@supabase/ssr` cookie handlers are on the deprecated API pattern** (`get`/`set`/`remove`). Still works on 0.10.x. Migration is post-launch item 25.
- **Production Next.js version is 14.2.35.**
- **Paid tiers are planned.** No paid tier exists in the codebase yet, but the product owner has confirmed paid plans are coming. Do not revert hero copy to "free to use" or "free forever" framing. See `.agents/copy-decisions.md` entry 7.
- **There is no file upload function.** Users paste transcripts or record audio in the browser. Do not reference uploading in any copy.
- **Transcript word limit is 100,000 words per conversation.**

---

## Security & Account Posture

- **Legal entity:** AREASPEC PTY LTD (ACN 690 941 078)
- **Legal contact:** privacy@ndledger.com
- **Jurisdiction at launch:** Australia only. NOT scoped for GDPR or CCPA.
- **Privacy stance:** No content monitoring. Insights-only long-term storage. Transcripts deleted (nulled) after extraction; policy, FAQ, and code all match.
- **Audio handling:** MediaRecorder captures audio in browser. Audio is sent to OpenAI Whisper for transcription and is not retained by OpenAI beyond the API call. NDLedger does not store audio. Privacy Policy and Terms of Service updated to reflect this as of 27 April 2026.
- **Terms of Service liability cap:** AUD $50 flat. Australian Consumer Law carve-out included.
- **Corporate structure:** MEZ FRANCHISE PTY LTD owns AREASPEC PTY LTD. Robert is sole director.

### Account 2FA status (as of 30 April 2026)
- **Google (`hobbesinvestments@gmail.com`):** on. Authenticator app. Backup codes printed + on removable drive.
- **Google Workspace (`admin@ndledger.com`):** active. Primary admin account.
- **Cloudflare (`admin@areaspec.com`):** on. TOTP. Backup codes printed + on removable drive.
- **GitHub, Vercel, Supabase, Anthropic:** not yet audited. To be captured during access sheet Sections 2-7.

### Anthropic API key inventory
| Key Name | Purpose | Status |
|---|---|---|
| `ndledger-production` | NDL production extraction (used by Vercel) | Active |
| `ndledger-testing` | Testing / staging | Active |
| `Ledga` | Older NDL-adjacent key, purpose unclear | Active, review candidate |
| `mdc-areaspec-platform` | MDC product | Active |
| `Basil Openclaw` | OpenClaw agent | Revoked 24 April 2026 |

### OpenAI API key
One key created for NDL Whisper transcription. Stored in Vercel (Production and Preview) and in local `.env.local` as `OPENAI_API_KEY`. Retrieve from platform.openai.com/api-keys.

### Vercel state
- **Deployment Protection / Vercel Authentication on preview deploys: ENABLED.** Re-enabled 27 April 2026 after Whisper phone testing.

### Email routing (updated 30 April 2026)
- **Cloudflare Email Routing is DISABLED.** It conflicts with Google Workspace MX records and cannot be re-enabled without deleting the Google MX records.
- **`privacy@ndledger.com` is an alias on `admin@ndledger.com` in Google Workspace.** All email to privacy@ delivers to the admin inbox. Verified working 30 April 2026.
- Do not attempt to re-enable Cloudflare Email Routing without first removing the Google Workspace MX records, which would break all email.

### Supabase Redirect URLs allowlist
- `https://www.ndledger.com/auth/callback`
- `https://ndledger.com/auth/callback`
- `https://ledga-nine.vercel.app/auth/callback`
- `http://localhost:3001/auth/callback`
- `https://ledga-git-whisper-migration-victaaaws-projects.vercel.app/auth/callback` (added 27 April for phone testing; remove when no longer needed -- post-launch item 36)
- `https://ledga-git-voice-truncation-fix-victaaaws-projects.vercel.app/auth/callback` (added 25 April; can be removed -- post-launch item 36)

---

## Post-Launch Iteration List

Non-blocking. Address after launch, in priority order.

1. ~~Uninstall OpenClaw and review API usage, after 7 days of NDL-only spend~~ **API key revoked 24 April 2026.** 7-day review window: check around 30 April 2026; decide whether Anthropic monthly cap drops below $100.
2. Category taxonomy gaps. No category for hiring/team decisions; both Haiku and Sonnet miscategorised a hiring decision as `business_monetisation` during testing.
3. Pivot classification accuracy. Monitor over first 20-30 real extractions; if slipping, add concrete pivot example to prompt.
4. Monitor 200k character guardrail vs real usage. Nearly tripped on first real dogfood session.
5. ~~`npm audit`: 9 vulnerabilities flagged~~ **Reduced to 4 high on 24 April 2026.** Remaining 4 require major-version migrations (items 23 and 24).
6. Rename Vercel project and GitHub repo from `ledga` to `ndledger`.
7. File upload. Phase 2 per master doc (PDF, TXT, DOCX, MD).
8. Test large transcript paste behaviour before Phase 2 file upload ships.
9. `git prune` unreachable objects (warning surfaces on every push now).
10. NDL access sheet. Section 1 (Cloudflare) captured in chat 24 April; Sections 2-7 outstanding. Stored outside git. No secrets in the doc.
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
22. ~~Phase 2 voice capture: Whisper migration.~~ **Completed 27 April 2026.**
23. **Next 14 to 16 migration.** Closes 4+ DoS / request-smuggling advisories. Estimated 2-3 hour session.
24. **ESLint 14.x to 16 migration.** Bundle with item 23.
25. **Migrate `@supabase/ssr` cookie handlers to `getAll`/`setAll` pattern.**
26. **Investigate `.git/objects` file-lock prompts during `git push`.** Likely VS Code indexer, residual OneDrive sync lock, or Windows Defender real-time scan. Workaround applied: `git config --global gc.auto 0`.
27. **Review the `Ledga` Anthropic API key.** If not in use, revoke.
28. **Audit 2FA status on the remaining services.** GitHub, Vercel, Supabase, Anthropic Console.
29. ~~Decide the fate of the `voice-truncation-fix` branch.~~ Web Speech API is now removed. The branch can be deleted. No blocker; low priority.
30. ~~Re-enable Vercel Authentication on preview deploys.~~ **Completed 27 April 2026.**
31. ~~Relocate `NDLedger_Legal_Outline.md`.~~ **Completed 27 April 2026.**
32. ~~Delete the stray PNG `src/app/api/2026-04-24 (3).png`.~~ **Completed 27 April 2026.**
33. ~~Commit the handoff archive reorganisation and v11 file.~~ **Completed 27 April 2026.**
34. ~~Decide whether `.claude/VS Code.code-workspace` is committed or gitignored.~~ **Completed 27 April 2026.** Gitignored via `.claude/` entry in `.gitignore`.
35. **Lawyer review of Privacy Policy and Terms of Service.** Both documents changed with the Whisper migration. Pull forward before inviting external users.
36. **Remove stale preview URLs from Supabase redirect allowlist.** Two URLs can be removed: `voice-truncation-fix` preview and `whisper-migration` preview. Low risk, tidy to do.
37. **Review OpenAI monthly spend limit.** No cap is currently set on the OpenAI account. Set a sensible limit at platform.openai.com/account/limits once real usage is known.
38. **Add `OPENAI_API_KEY` to Vercel Development environment.** Currently only in Production and Preview. Add via Vercel Dashboard → Settings → Environment Variables.
39. ~~**Build a pricing placeholder page.**~~ **Pricing page built 30 April 2026.** `pricing.jsx` ready for Next.js integration. Wire waitlist form to email capture endpoint before deploying.
40. **Complete Group 1 directory submissions.** Majority of Group 1 directories found to be paid. See updated tracker. Revised free directory list needed before resuming.
41. **Run `/launch-strategy` in CC.** Structured GTM plan using the ORB framework.
42. **Run `/social-content` in CC.** Founder story is the key asset; neurodivergent angle TBD by Robert.
43. **Run `/community-marketing` in CC.** Target ADHD/neurodivergent founder communities for first 50 users.
44. **Research and build a revised free AI directory list.** Verify free submission availability before adding any directory to the list. Most Group 1 directories are now paid.
45. **Deploy pricing page.** Place `pricing.jsx` at `app/pricing/page.jsx`. Add `NDLedger_icon_512.png` to `/public`. Wire waitlist form to email capture endpoint.
46. **Wire pricing page waitlist form.** Connect to email capture endpoint (Supabase, Mailchimp, or similar). Required before page goes live.
47. **Update landing page headline.** Test "Stop losing your best thinking to a chat window" against current "Your AI conversations are full of good ideas. Stop losing them." See locked messaging framework.

---

## Marketing Launch Plan (Priority Order)

| Priority | Skill | Status |
|----------|-------|--------|
| 1 | `launch-strategy` | Not started |
| 2 | `copywriting` | Done; landing page rewritten 29 April 2026 |
| 3 | `directory-submissions` | In progress; see tracker below |
| 4 | `social-content` | Not started |
| 5 | `community-marketing` | Not started |

### Directory Submissions Status (updated 30 April 2026)

| # | Directory | Status | Notes |
|---|-----------|--------|-------|
| 1 | TAAFT | Skip — paid only | No free submission option found |
| 2 | Futurepedia | Skip — paid only | No free submission option found |
| 3 | AI Tools (Neil Patel) | Skip — not functioning | Site not functioning properly |
| 4 | Toolify.ai | Skip — paid only | |
| 5 | Future Tools | Submitted 2026-04-30 | Manually reviewed by Matt Wolfe; pending approval |
| 6 | Good AI Tools | Submitted 2026-04-30 | Curated review; pending approval |
| 7 | aitools.inc | Submitted 2026-04-30 | Review pending; confirmation received |
| 8 | AIStage | Deferred — paid | $9.90 basic; revisit after free submissions exhausted |
| 9 | AItrendytools | Skip — paid only | |
| 10 | Grabon | Skip — submission process too difficult | |
| 11 | TopAI.tools | Skip — paid only | |
| 12 | Supertools | Skip — advertising focused | |
| 13 | NewTools.site | Deferred — badge required | Badge must be added to site for free plan; revisit |
| 14 | Dofollow.Tools | Deferred — daily quota full | 5 free slots per day across all users; return tomorrow morning early |

**Note:** A revised free AI directory list is needed. Most Group 1 directories have moved to paid models since the original list was compiled.

Group 2 (8 directories) unblocked now that pricing page is built. Group 3 (Product Hunt, HN) needs screenshots, video, 3-week warm-up. Group 4 (G2, Capterra, TrustRadius) needs 10+ reviews.

### Product Marketing Context TODOs
| Item | When |
|------|------|
| Neurodivergent angle: lean in publicly? | Before writing social content; Robert's decision |
| Competitor verification | Quick 30-min scan now |
| Customer verbatim language | After first 10 users |
| Proof points and testimonials | After first 10 users |
| First-week signup metrics | Set up analytics tracking now if not done |

---

## Current 6 Categories (Public Layer)

1. **business_monetisation:** Revenue, pricing, sales, monetisation strategy
2. **go_to_market:** Launch, marketing, positioning, competitive landscape
3. **legal_compliance:** Legal, compliance, regulations, IP, privacy
4. **personal_ideas:** Personal reflections, brainstorms, life, family
5. **product_features:** Product development, features, UX, technical specs
6. **technical:** Architecture, code, infrastructure, databases

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
| Deep navy | #1E3A5F | Headers, primary text, footer background |
| Teal | #0D9488 | Buttons, links, accents |
| Highlight teal | #5EEAD4 | Active footer link (you-are-here) |
| Light grey | #F8FAFC | Background sections |
| White | #FFFFFF | Main background |
| Soft green | #86EFAC | Success states, highlights |

---

## Key Technical Details

### Extraction Flow (Current)
1. User pastes transcript OR speaks via Record Voice (MediaRecorder captures audio; audio is sent to OpenAI Whisper via `/api/transcribe`; transcribed text is set in the textarea)
2. Text is submitted: POST to `/api/extract` with `transcriptId`
3. Route fetches transcript, validates size (< 200k chars)
4. Calls Anthropic API with `claude-haiku-4-5`
5. Parses JSON response, inserts topics and insights into Supabase
6. Logs `input_tokens` and `output_tokens` to `transcripts` table
7. Marks transcript `completed` AND nulls `raw_content` in the same update (honours Privacy Policy deletion promise)

### Voice Recording Flow (Current, Whisper)
- User taps Record Voice; browser requests microphone permission via `navigator.mediaDevices.getUserMedia`
- `MediaRecorder` captures audio chunks (250ms intervals) into `audioChunksRef`
- Timer runs in UI while recording is active
- On Stop: audio chunks are assembled into a Blob and POSTed to `/api/transcribe`
- `/api/transcribe` authenticates the request, forwards the Blob to OpenAI Whisper (`whisper-1`) with auto language detection, returns `{ text: "..." }`
- "Transcribing..." spinner shows while waiting for Whisper response (typically 2-5 seconds)
- Returned text is appended to any existing textarea content
- On Cancel: `audioChunksRef` is cleared before `onstop` fires; no upload occurs; textarea content is restored to its pre-recording state
- `OPENAI_API_KEY` is only accessed server-side in `/api/transcribe`; it never reaches the client

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
- `ANTHROPIC_API_KEY`: Anthropic API key. In production: `ndledger-production`
- `OPENAI_API_KEY`: OpenAI API key for Whisper transcription. In Vercel: Production and Preview. In local dev: `.env.local`. Variable name must be exactly `OPENAI_API_KEY`; a prior misconfiguration named it `Open_AI` and caused 500 errors

Retrieve current values from:
- Supabase Dashboard → Project Settings → API
- Anthropic Console → API Keys
- OpenAI Platform → API Keys
- Vercel Dashboard → Project Settings → Environment Variables

### Supabase Auth Configuration
- **Site URL:** `https://www.ndledger.com`
- **Redirect URLs:** see Security & Account Posture section above

### DNS Configuration (Cloudflare)
- `ndledger.com` → CNAME → `f2d83818c3dc8669.vercel-dns-017.com` (DNS-only, grey cloud)
- `www.ndledger.com` → CNAME → `f2d83818c3dc8669.vercel-dns-017.com` (DNS-only, grey cloud)
- MX records: Google Workspace MX records. Do not delete.
- Cloudflare Email Routing: DISABLED. Do not re-enable without removing Google Workspace MX records first.

### Vercel Domains
- `www.ndledger.com`: canonical (Production)
- `ndledger.com`: 307 redirect to `www.ndledger.com`
- `ledga-nine.vercel.app`: Production (auto-deploy fallback)

### Email Configuration (updated 30 April 2026)
- `admin@ndledger.com`: primary Google Workspace account
- `privacy@ndledger.com`: alias on `admin@ndledger.com` in Google Workspace. All email delivers to admin inbox.
- Cloudflare Email Routing is DISABLED.

### Public Pages Structure
- `src/app/(marketing)/page.tsx` → `/` (landing page)
- `src/app/(marketing)/privacy/page.tsx` → `/privacy`
- `src/app/(marketing)/terms/page.tsx` → `/terms`
- `app/pricing/page.jsx` → `/pricing` (built 30 April 2026; not yet deployed)
- No `/contact` page. Contact links in footers are `mailto:privacy@ndledger.com` only.

### Current Package Versions
- `next`: 14.2.35
- `@supabase/ssr`: 0.10.2
- `eslint-config-next`: 14.2.35
- Anthropic model: `claude-haiku-4-5`
- OpenAI model: `whisper-1`

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

### Voice transcription (Whisper, live as of 27 April 2026)
| Provider | Cost |
|---|---|
| Whisper (`whisper-1`) | $0.006/minute = $0.36/hour |

For a 5-minute voice note: ~3 cents. Adds to the ~1 cent extraction cost. Total per-voice-note cost ~4 cents.

**Current Anthropic monthly cap:** $100. OpenClaw key revoked 24 April. 7-day review window: check around 30 April 2026; cap likely too generous for NDL alone.

**OpenAI monthly spend limit:** not yet set. Set one at platform.openai.com/account/limits once real usage is known (post-launch item 37).

---

## Communication Preferences (Robert)

- One clear action at a time
- Wait for confirmation before next step
- Plain language, concrete next steps
- No bundled instructions
- Use NDL as abbreviation for NDLedger
- Push back on scope creep, advocate for shipping over perfecting
- Push back if Robert asks for content that is already prepared and available in existing files

### Learning vs Building
Robert is learning the field as he builds. Questions that start with "should I..." or "how does this work" are often learning questions, not build decisions. On learning questions, lead with a plain explanation of how the domain works rather than leading with pushback on the premise.

---

## How to Continue

### Local Dev
1. `cd /c/Projects/NDL/ledga-app`
2. `npm run dev`
3. Access at http://localhost:3001 (same browser for login flow, not incognito)

### Production
- URL: https://www.ndledger.com
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

### If Whisper Transcription Returns 500
1. Check Vercel logs for `Whisper API error:` line.
2. If error says `invalid_api_key` or `undefined`: check `OPENAI_API_KEY` in Vercel → Settings → Environment Variables. Variable name must be exactly `OPENAI_API_KEY` (not `Open_AI` or any other variant). If correct, redeploy.
3. If error says `401 Unauthorised` from the route itself: the user's Supabase session has expired. Ask them to sign in again.

### If `git push` Hangs On Pack-File Prompts
1. Git push completes BEFORE the prompts appear. The commit is already on GitHub.
2. Answer `n` or press `Ctrl+C`.
3. Verify with `git log --oneline -1`.
4. Permanent fix: `git config --global gc.auto 0` (applied 29 April 2026).

---

## Handoff Doc Convention

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
16. **When the user proposes a path that is already on the roadmap, "should we just do that" is a valid first question, not a second one.** Established 25 April 2026.
17. **Watch for clean-deck pressure at session-end.** Long sessions accumulate friction; "remove it" or "wipe it" instructions deserve a one-question check before action, especially when uncommitted work is in the tree. Established 25 April 2026.
18. **Prompts for CC must be presented in a clean, isolated block** with no surrounding explanation mixed in, so Robert can copy and paste without editing. Established 29 April 2026.
19. **Paid tiers are planned; do not revert pricing copy.** Even if no paid tier exists in the codebase, the product owner has confirmed paid plans are coming. "Free to use" and "free forever" framing is prohibited. Established 29 April 2026.
20. **Push back if Robert asks for content already available in prepared files.** Point him back to the existing asset rather than regenerating. Established 30 April 2026.

---

## Next Session, Start Here

**Recommended order:**

1. **7-day post-OpenClaw API spend review** (due around 30 April 2026). Check Anthropic Console usage. Decide whether the monthly cap drops below $100.

2. **Deploy pricing page.** Place `pricing.jsx` at `app/pricing/page.jsx`. Add `NDLedger_icon_512.png` to `/public`. Wire waitlist form to email capture endpoint.

3. **Submit to Dofollow.Tools (Submission 14).** Return early — only 5 free slots per day across all users. Go to dofollow.tools first thing.

4. **Research revised free AI directory list.** Most Group 1 directories are now paid. Find replacements with verified free submission options before resuming Group 1.

5. **Submit Group 2 directories.** Pricing page now built; Group 2 is unblocked. Use the cheat sheet and submissions document.

6. **Run `/launch-strategy` in CC** for a structured GTM plan.

7. **Run `/social-content` in CC.** Decide first whether to lean into the neurodivergent founder angle publicly; this is a positioning call only Robert can make.

8. **Lawyer review** of Privacy Policy and Terms of Service. Pull forward before inviting external users.

9. **Set OpenAI monthly spend limit** at platform.openai.com/account/limits (post-launch item 37).

10. **Clean up Supabase redirect allowlist.** Remove the two stale preview URLs (post-launch item 36).

---

## CC Kickoff Prompt

---

> Before we do anything, please read the following files in this order:
>
> 1. `.agents/ndledger-brand.md`
> 2. `.agents/product-marketing-context.md`
> 3. `.agents/copy-decisions.md`
> 4. `.agents/directory-tracker.md`
>
> Confirm you have read all four and summarise:
> - What NDLedger is and who it is for
> - The locked core purpose statement
> - The mandatory copy rules you must follow in this session
> - Current directory submission status
>
> Do not make any changes to any file until you have confirmed you have read these.

---

## Chat (Claude.ai) Kickoff Prompt

---

> I am working on NDLedger, an AI-powered knowledge library that extracts insights from AI conversations and stores them in a searchable library. Live at ndledger.com. Built with Next.js 14, Supabase, Claude Haiku, and Whisper. Hosted on Vercel. Australian product, AU English only.
>
> Key rules for this session:
> - AU English throughout
> - No em dashes
> - No "free to use" or "free forever"; use "free to get started"
> - No upload references; users paste or record conversations
> - Deletion applies to transcripts, not topics
> - Seven categories (six business + one personal)
> - CTA button copy is "Get Started"
> - Paid tiers are planned; do not suggest reverting to free-forever framing
> - Push back if I ask for content that already exists in prepared files
>
> Current status: messaging framework locked; pricing page built (not yet deployed); 3 of 14 Group 1 directory submissions completed (majority of Group 1 found to be paid); ndledger-brand.md created in CC project. Next priorities: deploy pricing page, submit Dofollow.Tools early (daily quota), research revised free directory list, submit Group 2 directories, run launch-strategy skill.

---

## Archive Command

To archive v14 after saving v15:

```bash
cd /c/Projects/NDL/ledga-app
git mv Handover/NDL_Handoff_Summary_v14.md Handover/archive/NDL_Handoff_Summary_v14.md
git add Handover/NDL_Handoff_Summary_v15.md
git commit -m "Handoff v15: session 30 April 2026; messaging framework locked; ND persona; pricing page built; email routing fixed; directory submissions attempted"
git push
```

Then upload `NDL_Handoff_Summary_v15.md` to the Claude Project so the next session reads the current version.

---

*End of handoff summary v15. v1 to v14 superseded and archived.*
