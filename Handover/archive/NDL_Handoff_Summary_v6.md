# NDLedger — Handoff Summary v6
**Last Updated:** 19 April 2026

---

## Project Overview

**NDLedger** is an AI-agnostic background agent that extracts decisions, insights, commitments, pivots, and tasks from AI conversation transcripts and organises them into a searchable knowledge library.

**Target Market:** Solo founders, neurodivergent thinkers (ADHD, autism), SaaS operators, knowledge workers

**Tech Stack:**
- Frontend: Next.js 14, Tailwind, shadcn/ui — deployed to Vercel ✅
- Backend: Supabase (Sydney region) — Postgres, Auth, RLS
- Extraction: **Anthropic API (Claude Haiku 4.5)** — migrated from Claude CLI
- Local dev: localhost:3001 — app folder: ledga-app
- Production: https://ledga-nine.vercel.app (deployed, tested, live)

**GitHub Repo:** https://github.com/Victaaaw/Ledga

---

## What's Done This Session (19 April 2026)

### Completed ✅

1. **Model selection tested on evidence, not vibes** — 4 transcripts, 2 models (Haiku 4.5 vs Sonnet 4.5), side-by-side comparison
2. **Haiku 4.5 locked in as production model** — 3.3× cheaper than Sonnet and actually better for extraction (more disciplined, catches pivots more reliably, cleaner topic groupings)
3. **Extraction migrated from Claude Code CLI to Anthropic API** — `src/app/api/extract/route.ts` rewritten
4. **Three cost guardrails added:**
   - Input size limit: transcripts > 200,000 chars rejected before API call
   - Model defaulted to `claude-haiku-4-5` (easy to change at top of file)
   - Token logging: every extraction writes `input_tokens` and `output_tokens` to `transcripts` table
5. **Database schema updated** — added `input_tokens INTEGER` and `output_tokens INTEGER` columns to `transcripts` table
6. **Vercel deployment fixed and verified** — production build deploying cleanly, end-to-end extraction tested on ledga-nine.vercel.app
7. **Two production bugs caught and fixed:**
   - TypeScript iteration error on Map (required `Array.from()` workaround)
   - `ANTHROPIC_API_KEY` was Preview-only in Vercel — fixed to Production/Preview/Development
8. **Diagnosed non-NDL API spend** — 95% of April Anthropic API spend was from OpenClaw (Basil key), not NDL. NDL itself is using cents, not dollars.

### Files Changed
- `src/app/api/extract/route.ts` — full rewrite: removed CLI `child_process` path, added Anthropic SDK calls, added guardrails, added token logging
- `.env.local` — added `ANTHROPIC_API_KEY`
- Vercel Environment Variables — added `ANTHROPIC_API_KEY` for all environments
- Supabase `transcripts` table — added two columns

### Commits Made
- `Migrate extraction from Claude CLI to Anthropic API with Haiku 4.5`
- `Reorganise handoff docs into Handover folder`
- `Fix TypeScript iteration error for production build`
- `Trigger redeploy after fixing env var scope`

---

## Before Launch Checklist

- [x] Fix auth PKCE issue (April 16)
- [x] Test full user flow end-to-end (April 16)
- [x] Set up Anthropic API and migrate extraction
- [x] Fix Vercel deployment (no longer blocked)
- [x] Verify production extraction quality matches local testing
- [ ] Register domains (ndledger.com, ndledger.com.au)
- [ ] Lawyer review of Privacy Policy and Terms
- [ ] Fix PKCE UX error handling (magic link cross-browser failure)

---

## Real Launch Blockers (Only 3 Remain)

These are the only things blocking public marketing. Everything else is post-launch iteration.

1. **Register domains** — ndledger.com, ndledger.com.au. Point DNS to Vercel. ~30 min work, 24–48 hr propagation.
2. **Legal review** — Privacy Policy + Terms to lawyer. Async, ~1–2 week turnaround. Non-negotiable given user data collection.
3. **PKCE UX error handling** — currently real users will hit confusing `auth_failed` redirect when magic link is clicked from a different browser than login was initiated. 30–60 min fix. Needs dedicated error page for `pkce_code_verifier_not_found`.

---

## Post-Launch Iteration List

Non-blocking. Address after launch, in priority order:

1. **Uninstall OpenClaw and review API usage** — after 7 days of NDL-only spend, revisit the monthly spend cap decision
2. **Category taxonomy gaps** — no category for hiring/team decisions; `context_tag` field (personal/business/mixed) is essentially always "business" and may not earn its place
3. **Pivot classification accuracy** — monitor over first 20–30 real extractions; if slipping, add concrete pivot example to prompt
4. **Monitor guardrail limit vs real usage** — current 200k character input limit was nearly tripped on first real dogfood session. If long conversations are common user input, consider raising limit or chunking input
5. **`npm audit`** — 9 vulnerabilities flagged (2 low, 6 high, 1 critical). Review and remediate
6. **Move project out of OneDrive** — `.next` folder EBUSY conflicts from OneDrive sync. Move to `C:\Projects\Ledga` or similar
7. **Rename Vercel project + GitHub repo** — from `ledga` to `ndledger` once branding is final
8. **File upload** — currently paste-only; PDF/TXT/DOCX/MD upload is Phase 2 per master doc
9. **Test large transcript paste behaviour** — ensure UI doesn't choke on very large pastes before Phase 2 file upload ships
10. **`git prune` unreachable objects** — repo housekeeping
11. **NDL access sheet** — single reference doc with all project URLs, emails, and login details (deferred from this session)
12. **Separate production API key** — currently using test key in production; best practice is separate keys per environment

---

## Current 6 Categories (Public Layer)

1. **business_monetisation** — Revenue, pricing, sales, monetisation strategy
2. **go_to_market** — Launch, marketing, positioning, competitive landscape
3. **legal_compliance** — Legal, compliance, regulations, IP, privacy
4. **personal_ideas** — Personal reflections, brainstorms, life, family
5. **product_features** — Product development, features, UX, technical specs
6. **technical** — Architecture, code, infrastructure, databases

**Known gap:** no category handles hiring/team/people decisions cleanly. Both Haiku and Sonnet miscategorised a hiring decision as `business_monetisation` during testing. Worth reviewing.

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
1. User pastes transcript into NDL UI
2. POST to `/api/extract` with `transcriptId`
3. Route fetches transcript, validates size (< 200k chars)
4. Calls Anthropic API with `claude-haiku-4-5`
5. Parses JSON response, inserts topics and insights into Supabase
6. Logs `input_tokens` and `output_tokens` to `transcripts` table for cost tracking

### Auth Flow (Fixed April 16)
The auth callback route (`src/app/auth/callback/route.ts`):
1. Creates Supabase client inline with cookie handlers
2. Reads code-verifier from `request.cookies`
3. Writes session tokens to `response.cookies`
4. Returns the response with cookies attached

**Known UX limitation:** auth breaks when magic link is clicked in a different browser context from where login was initiated. This is correct code behaviour (cookies don't cross contexts) but confusing for real users. Flagged as pre-launch fix.

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...  (set in .env.local AND Vercel)
```

### Supabase Auth Configuration
- **Site URL:** http://localhost:3001
- **Redirect URLs:**
  - https://ledga-nine.vercel.app/auth/callback
  - http://localhost:3001/auth/callback

---

## Cost Model (Post-Migration)

Based on actual token counts from testing and one real dogfood session:

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
| Characters (approx) | ~195,000 — close to the 200k guardrail |

### Key observation
Long conversations show diminishing output-to-input ratio. A typical short transcript extracts at ~1.5:1 input:output ratio. A very long conversation (like the session above) runs closer to 19:1 — more context being processed for proportionally less extraction. Worth monitoring.

**Guardrail consideration:** the 200k character limit was hit at ~48,600 input tokens in one real session. If users regularly paste long conversations, the guardrail may need to increase (or the prompt could chunk input).

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
1. Open bash in project root: `cd "/c/Users/User/OneDrive/Desktop/AI/Ledga/ledga-app"`
2. Start server: `npm run dev`
3. Access at http://localhost:3001 (same browser for login flow, not incognito)

### Production
- URL: https://ledga-nine.vercel.app
- Auto-deploys from GitHub `main` branch
- Check deployment status: https://vercel.com/dashboard → `ledga` project → Deployments

### If Dev Server Won't Start
- Kill ports: `npx kill-port 3001 3002`
- Clear cache: `rm -rf .next`
- Restart: `npm run dev`
- If `EBUSY` errors, pause OneDrive sync or move project out of OneDrive

---

## Next Session — Start Here

**Pick one of the 3 real launch blockers to tackle:**

1. **Register domains** (quickest) — ndledger.com and ndledger.com.au via registrar of choice (Crazy Domains, Namecheap, etc.), point DNS to Vercel, add custom domain in Vercel project settings
2. **Legal review** (slowest, start first) — Use a template from Termly or TermsFeed, customise, send to lawyer. Long async turnaround means this should kick off ASAP regardless of which you tackle in-session
3. **PKCE UX fix** — add a dedicated error page for `pkce_code_verifier_not_found` with copy like "Please click your magic link in the same browser where you requested it" and a "Request a new link" button

**Recommended order:** Start legal review (async), then register domains (short focused task), then PKCE fix. By the time legal comes back, everything else is done.

---

*End of handoff summary v6*
