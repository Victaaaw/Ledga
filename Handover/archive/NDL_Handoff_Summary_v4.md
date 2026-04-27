# NDLedger — Handoff Summary v4
**Last Updated:** 14 April 2026 (late session)

---

## Project Overview

**NDLedger** (formerly Ledga) is an AI-agnostic background agent that extracts decisions, insights, commitments, pivots, and tasks from AI conversation transcripts and organises them into a searchable knowledge library.

**Target Market:** Solo founders, neurodivergent thinkers (ADHD, autism), SaaS operators, knowledge workers

**Tech Stack:**
- Frontend: Next.js 14, Tailwind, shadcn/ui — deployed to Vercel
- Backend: Supabase (Sydney region) — Postgres, Auth, RLS
- Extraction: Claude Code CLI via child_process (Max plan, no API cost)
- Local dev: localhost:3001 (or 3002 if ports in use) — app folder: ledga-app

**GitHub Repo:** https://github.com/Victaaaw/Ledga

---

## What's Done This Session

### Completed ✅
1. **Logo fixed** — cropped, transparent background, displaying correctly at all sizes
2. **Privacy Policy page** — `/privacy` with full content, Australian compliance, contact details
3. **Terms of Service page** — `/terms` with full content, Hobbes Group Pty Ltd, Queensland law
4. **Footer links wired** — Privacy and Terms links working
5. **Contact details added** — hobbesinvestments@gmail.com, Ipswich, Queensland, Australia 4305
6. **Australian spelling** — applied throughout landing page
7. **Redundant text removed** — "NDLedger" text next to logos removed (logo has wordmark)
8. **Delete Account tested** — works correctly, fully deletes user and all data
9. **HelpButton component created** — reusable "?" icon with modal, added to all app pages
10. **All changes pushed to GitHub**

### In Progress — Auth Debugging
Magic link login is failing with PKCE error:
```
AuthPKCECodeVerifierMissingError: PKCE code verifier not found in storage
```

**Diagnostic logging added:**
- Login page logs whether code-verifier cookie is set after signInWithOtp
- Auth callback logs which sb-* cookies arrived in the request
- Cookie set/remove failures now logged in server.ts

**To debug next session:**
1. Open http://localhost:3001/login in fresh incognito window
2. Open DevTools → Application → Cookies
3. Enter email, click send magic link
4. Check cookies — look for one ending in `-code-verifier`
5. Click magic link from email
6. Watch terminal for server logs

**Diagnosis table:**
| Browser verifier | Server verifier | Diagnosis |
|------------------|-----------------|-----------|
| present | present, exchange succeeds | Working |
| present | not present | Cookie not sent — check SameSite/Path/Domain |
| present | present, exchange fails | Verifier mismatch or expired |
| not present | not present | Browser-side write failed |

**Supabase settings updated:**
- Site URL: http://localhost:3001
- Redirect URLs: includes http://localhost:3001/auth/callback

---

## Parked Until May

**Vercel deployment** — extraction uses Claude CLI which won't run in serverless. Needs Anthropic API (credits unlock 1 May). Run locally until then.

**Other ventures:** AreaSpec and MDC CRM work planned while waiting.

---

## Running Task List

### Next Up
1. **Fix auth PKCE issue** — run the diagnostic flow above
2. **Test HelpButton** — verify it works on all pages once auth is fixed
3. **Commit auth debugging code** — already added, needs commit after testing

### Parked (Phase 2+)
- Push to Vercel (blocked on API credits)
- Personal subcategories under Personal & Ideas
- Export to NotebookLM format
- Interview Agent (premium feature)
- Marketing Agent
- Venture Scout Agent
- GitHub repo rename (Ledga → NDLedger)

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

**Logo:** public/logo.png (network nodes in rounded square + wordmark, transparent background)

---

## Key Decisions Made

1. **NDLedger is the final name** — domains to register: ndledger.com, ndledger.com.au
2. **Secret App architecture** — separate Next.js app, shared Supabase with NDLedger
3. **Agent cost approach** — Claude Max 5x via CLI (no extra API cost)
4. **Agent priority order** — 1. Marketing Agent → 2. Venture Scout → 3. Interview Agent
5. **Topic merging** — case-insensitive matching, insights link to existing topics
6. **CRM decision** — NDLedger stays separate from AreaSpec/MDC CRM (no merge)
7. **Categories** — 6 generic categories for public users; venture-specific categories for private layer only
8. **Landing page** — same repo as app, simplified colour palette
9. **Help system** — reusable HelpButton component with modal, available on all app pages
10. **Legal contact** — hobbesinvestments@gmail.com, Ipswich QLD 4305

---

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-api-key (for API route, currently using CLI instead)
```

---

## Supabase Auth Configuration

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
- Don't echo prompts at the bottom of responses

---

## How to Continue

1. Open Claude Code in the ledga-app folder: `cd ~/OneDrive/Desktop/AI/Ledga/ledga-app && claude`
2. Start the dev server in another terminal: `npm run dev`
3. Access the app at http://localhost:3001 (or next available port)
4. **To view landing page:** use incognito window (signed-in users redirect to dashboard)
5. Paste this summary into a new Claude chat for context

---

## Next Session — Start Here

**Immediate task:** Debug the PKCE auth issue.

Paste this into Claude Code:
```
Auth is failing with PKCE code verifier error. Diagnostic logging was added last session. I need to test the flow:
1. What's the current state of the auth callback route at src/app/auth/callback/route.ts?
2. What's in src/lib/supabase/server.ts for cookie handling?
```

Then run the diagnostic flow:
1. Fresh incognito window → http://localhost:3001/login
2. DevTools → Application → Cookies open
3. Enter email, send magic link
4. Check for code-verifier cookie
5. Click magic link, watch terminal logs

---

## Files Changed This Session

**New files:**
- src/app/(marketing)/privacy/page.tsx
- src/app/(marketing)/terms/page.tsx
- src/components/HelpButton.tsx

**Modified files:**
- src/app/(marketing)/page.tsx (landing page — logo text removed, footer links, Australian spelling)
- src/app/auth/callback/route.ts (error logging, open redirect fix, diagnostics)
- src/lib/supabase/server.ts (cookie failure logging)
- src/app/login/page.tsx (PKCE diagnostic logging)
- public/logo.png (replaced with cropped transparent version)
- Dashboard and app page headers (HelpButton added)

---

## Before Launch Checklist

- [ ] Fix auth PKCE issue
- [ ] Register domains (ndledger.com, ndledger.com.au)
- [ ] Lawyer review of Privacy Policy and Terms
- [ ] Set up Anthropic API when credits unlock (1 May)
- [ ] Fix Vercel deployment
- [ ] Test full user flow end-to-end

---

*End of handoff summary v4*
