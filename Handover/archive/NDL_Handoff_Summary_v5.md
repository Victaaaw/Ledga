# NDLedger — Handoff Summary v5
**Last Updated:** 16 April 2026

---

## Project Overview

**NDLedger** is an AI-agnostic background agent that extracts decisions, insights, commitments, pivots, and tasks from AI conversation transcripts and organises them into a searchable knowledge library.

**Target Market:** Solo founders, neurodivergent thinkers (ADHD, autism), SaaS operators, knowledge workers

**Tech Stack:**
- Frontend: Next.js 14, Tailwind, shadcn/ui — deployed to Vercel
- Backend: Supabase (Sydney region) — Postgres, Auth, RLS
- Extraction: Claude Code CLI via child_process (Max plan, no API cost)
- Local dev: localhost:3001 — app folder: ledga-app

**GitHub Repo:** https://github.com/Victaaaw/Ledga

---

## What's Done This Session (16 April 2026)

### Completed ✅
1. **PKCE auth issue fixed** — magic link login now works correctly
2. **Root cause:** auth callback route couldn't read/write cookies properly
3. **Fix:** inline Supabase client in route handler, reading from `request.cookies`, writing to `response.cookies`
4. **HelpButton tested** — working on all app pages
5. **Full user flow tested** — landing → login → upload → extract → topics → mind map all working
6. **All changes committed and pushed to GitHub**

### Files Changed
- `src/app/auth/callback/route.ts` — complete rewrite for proper cookie handling
- `src/lib/supabase/server.ts` — restored to original (createClient for Server Components)

---

## Before Launch Checklist

- [x] Fix auth PKCE issue
- [x] Test full user flow end-to-end
- [ ] Register domains (ndledger.com, ndledger.com.au)
- [ ] Lawyer review of Privacy Policy and Terms
- [ ] Set up Anthropic API when credits unlock (1 May)
- [ ] Fix Vercel deployment (blocked on API — extraction uses CLI)

---

## Parked Until May

**Vercel deployment** — extraction uses Claude CLI which won't run in serverless. Needs Anthropic API (credits unlock 1 May). Run locally until then.

**Other ventures:** AreaSpec and MDC CRM work planned while waiting.

---

## Current 6 Categories (Public Layer)

1. **business_monetisation** — Revenue, pricing, sales, monetisation strategy
2. **go_to_market** — Launch, marketing, positioning, competitive landscape
3. **legal_compliance** — Legal, compliance, regulations, IP, privacy
4. **personal_ideas** — Personal reflections, brainstorms, life, family
5. **product_features** — Product development, features, UX, technical specs
6. **technical** — Architecture, code, infrastructure, databases

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

### Auth Flow (Fixed)
The auth callback route (`src/app/auth/callback/route.ts`) now:
1. Creates Supabase client inline with cookie handlers
2. Reads code-verifier from `request.cookies`
3. Writes session tokens to `response.cookies`
4. Returns the response with cookies attached

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-api-key (for API route, currently using CLI instead)
```

### Supabase Auth Configuration
- **Site URL:** http://localhost:3001
- **Redirect URLs:** 
  - https://ledga-nine.vercel.app/auth/callback
  - http://localhost:3001/auth/callback

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

1. Open terminal: `cd ~/OneDrive/Desktop/AI/Ledga/ledga-app && npm run dev`
2. Access the app at http://localhost:3001
3. Use incognito window for landing page (signed-in users redirect to dashboard)

---

## Next Session — Start Here

**Remaining tasks before launch:**
1. Register domains: ndledger.com, ndledger.com.au
2. Send Privacy Policy and Terms to lawyer for review
3. Wait for Anthropic API credits (1 May) to fix Vercel deployment

**When API credits unlock:**
- Replace Claude CLI extraction with Anthropic API calls
- Deploy to Vercel
- Test production auth flow

---

*End of handoff summary v5*
