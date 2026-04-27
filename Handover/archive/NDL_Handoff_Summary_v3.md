# NDLedger — Handoff Summary v3
**Last Updated:** 14 April 2026 (evening session)

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

## Two-Layer Architecture

| Layer | Name | Purpose | Users |
|-------|------|---------|-------|
| **Public** | NDLedger | AI conversation knowledge library | Anyone (future customers) |
| **Private** | Secret App (unnamed) | Agent dashboard for Hobbes Group | Robert only |

Both layers share the same Supabase database. NDLedger extracts insights; Secret App agents read those insights for specialised work.

---

## Current 6 Categories (Public Layer)

1. **business_monetisation** — Revenue, pricing, sales, monetisation strategy
2. **go_to_market** — Launch, marketing, positioning, competitive landscape
3. **legal_compliance** — Legal, compliance, regulations, IP, privacy
4. **personal_ideas** — Personal reflections, brainstorms, life, family
5. **product_features** — Product development, features, UX, technical specs
6. **technical** — Architecture, code, infrastructure, databases

**Mind Map Colours:**
- business_monetisation: red border
- go_to_market: red border
- legal_compliance: red border
- personal_ideas: green border
- product_features: yellow border
- technical: blue border

---

## 4 Categories (Private/Secret Layer — Parked)

For Robert's internal use only (not for public users):
- **ventures** — NDL, AreaSpec, MDC, Gen-Now
- **hobbes** — Hobbes Group related
- **personal** — Personal, family, health, life admin
- **uncategorised** — Default fallback

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

## What's Built & Working

- ✅ Magic link auth
- ✅ Upload form with conversation date picker
- ✅ Voice recording on upload (Web Speech API, Chrome/Edge only)
- ✅ Auto-extraction on upload (via Claude Code CLI)
- ✅ Personal/business context tagging on extraction
- ✅ Topics page grouped by transcript (title + timestamp), collapsed by default
- ✅ Topic merging — same topic name across transcripts links to one topic (case-insensitive)
- ✅ Mind map: progressive expand (My Knowledge → Categories → Topics → Insights)
- ✅ Mind map: back navigation at every level
- ✅ Mind map: zoom press-and-hold with tooltips
- ✅ Mind map: zoom preserved on node expand and View full details → Back
- ✅ Mind map: node labels with proper grammar (no underscores/dashes)
- ✅ Delete transcript (cascades to topics/insights), RLS delete policies fixed
- ✅ Delete account feature (Settings page)
- ✅ Recent Insights as collapsible button on dashboard right side
- ✅ Search page (basic)
- ✅ 6 categories working
- ✅ Branding updated to NDLedger (local only, not pushed to GitHub)
- ✅ Landing page created at src/app/(marketing)/page.tsx
- ✅ Logo file added to public/logo.png
- ✅ Logo integrated into landing page (nav, hero, footer) using Next.js Image component
- ✅ Removed duplicate "NDLedger" h1 heading (logo already has wordmark)
- ✅ Cleaned up stale serverActions warning in next.config.js

---

## Brand Colours

| Colour | Hex | Use |
|--------|-----|-----|
| Deep navy | #1E3A5F | Headers, primary text |
| Teal | #0D9488 | Buttons, links, accents |
| Light grey | #F8FAFC | Background sections |
| White | #FFFFFF | Main background |
| Soft green | #86EFAC | Success states, highlights |

**Logo:** public/logo.png (network nodes in rounded square + wordmark)
**Logo source:** NDLedger_logo_with_network_symbol.png (also exists at repo root on GitHub)

---

## Running Task List

### In Progress
1. **Fix logo sizing on landing page** — logos are still tiny. The Next.js Image component width/height props may be constraining size. Need to check actual Image component code and fix the props, not just className.

### Next Up
1. Create Privacy Policy page (/privacy)
2. Create Terms of Service page (/terms)
3. Add Help icon in app linking to landing page FAQ
4. Test Delete Account feature before launch
5. Add product screenshot/preview to landing page (no visual punch currently)

### Parked (Phase 2+)
- Push code to GitHub + fix Vercel deployment
- Personal subcategories under Personal & Ideas
- Export to NotebookLM format
- Interview Agent (premium feature — spec drafted, tables not created)
- Marketing Agent (spec drafted, tables not created)
- Venture Scout Agent (spec drafted, tables not created)
- GitHub repo rename (Ledga → NDLedger)
- Instructions page (combined with FAQ on landing page)

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

---

## Secret App — Planned Agents

### Marketing Agent (Priority 1)
- Mission: Generate launch-ready marketing content for Hobbes Group ventures
- Ventures: NDLedger, AreaSpec, MDC
- Outputs: LinkedIn posts, landing page copy, email sequences, outreach drafts
- Database tables drafted, not created

### Venture Scout Agent (Priority 2)
- Mission: Evaluate thought threads for venture viability
- Criteria: Market, Timing, Founder Fit, Scalability, Defensibility, Capital, Risk
- Trigger: On-demand only
- Web research: Yes

### Interview Agent (Priority 3)
- Mission: Conduct structured biographical interviews, document responses, shape into publishable material
- Premium feature inside NDLedger
- Database tables drafted: interview_projects, interview_sessions, story_elements, book_structure, narrative_gaps
- Test on Robert first, then spin out if it has legs

---

## Known Issues to Resolve

1. **Vercel deployment broken** — missing env vars (ANTHROPIC_API_KEY, SUPABASE_SERVICE_ROLE_KEY) and Claude CLI won't work in serverless
2. **Landing page logos too small** — Image component props likely constraining size despite className changes
3. **Footer links dead** — Privacy Policy, Terms, Contact pages don't exist yet
4. **Multiple dev servers running** — ports 3000, 3001, 3002 all in use. Kill old ones with task manager or restart machine.

---

## Landing Page Assessment (from this session)

**What's Working:**
- Hero section is clean — clear headline, tagline, and CTA
- How it works — 3-step flow is simple and scannable
- FAQ section — good questions, collapsible format works
- Overall layout — structure is solid, sections flow logically

**Issues to Fix:**
1. Logo sizes (nav, hero, footer) — all too tiny
2. No product screenshot/preview — users can't see what they're signing up for
3. Footer links dead (Privacy Policy, Terms, Contact)
4. No social proof — no testimonials or "built by" story

---

## Reminders

- ⏰ **Test Delete Account feature** — before launch, create a test account and verify full deletion flow
- 🔑 **Landing page auth redirect** — signed-in users get redirected to /dashboard by middleware. Use incognito window to view landing page.

---

## Database Tables (Current)

**NDLedger Core:**
- profiles
- transcripts (includes conversation_date column)
- topics (includes category column)
- insights (includes context_tag column for personal/business/mixed)
- mind_map_nodes
- mind_map_edges

**Secret App (Planned, not created):**
- venture_assessments
- agent_runs
- agent_config
- marketing_campaigns
- marketing_content
- marketing_research
- interview_projects
- interview_sessions
- story_elements
- book_structure
- narrative_gaps

---

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-api-key (for API route, currently using CLI instead)
```

---

## Communication Preferences (Robert)

- One clear action at a time
- Wait for confirmation before next step
- Plain language, concrete next steps
- No bundled instructions
- Use NDL as abbreviation for NDLedger
- Push back on scope creep, advocate for shipping over perfecting
- Don't echo prompts at the bottom of responses — it causes confusion

---

## How to Continue

1. Open Claude Code in the ledga-app folder: `cd ~/OneDrive/Desktop/AI/Ledga/ledga-app && claude`
2. Start the dev server in another terminal: `npm run dev`
3. Access the app at http://localhost:3001 (or next available port)
4. **To view landing page:** use incognito window (signed-in users redirect to dashboard)
5. Paste this summary into a new Claude chat for context

---

## Next Session — Start Here

**Immediate task:** Fix logo sizing on landing page.

Paste this into Claude Code:
```
The logo is still tiny on the landing page. Check the actual Image component props for the logo in src/app/(marketing)/page.tsx. The issue might be the width/height props on the Image component itself, not just the className. Show me the current code for all three logo instances (nav, hero, footer).
```

Once you see the code, the fix is likely changing the `width` and `height` props to larger values (e.g., nav: 160x40, hero: 300x75, footer: 160x40) while keeping the className for responsive sizing.

---

## Files to Download

- **NDL_Handoff_Summary_v3.md** — this document
- **NDLedger_Legal_Outline.md** — Privacy Policy and Terms of Service outline for lawyer review

---

*End of handoff summary v3*
