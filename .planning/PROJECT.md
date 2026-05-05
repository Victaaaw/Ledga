# NDLedger

## What This Is

NDLedger is an AI-agnostic knowledge library that extracts decisions, insights, commitments, pivots, and tasks from AI conversation transcripts and organises them into a searchable, visual knowledge base. Built for solo founders, neurodivergent thinkers, and knowledge workers who generate valuable ideas in AI conversations and lose them. Live at https://www.ndledger.com. Operated by AREASPEC PTY LTD (ACN 690 941 078), Australia.

## Core Value

The external memory that makes sure your best AI thinking survives your own brain — paste or record a conversation, get your decisions and insights back, searchable forever.

## Requirements

### Validated

- ✓ User can paste or voice-record a conversation and have topics + insights extracted (Claude Haiku 4.5) — shipped
- ✓ User can browse topics and view insight details — shipped
- ✓ User can search insights by keyword — shipped
- ✓ User can view topics and insights as an interactive mind map (React Flow) — shipped
- ✓ User can delete transcripts (cascades to topics + insights) — shipped
- ✓ User can delete account with full data cascade — shipped
- ✓ User can sign up and sign in via email/password or magic link — shipped
- ✓ Public landing page with locked messaging framework — shipped
- ✓ Pricing page with 3-tier structure (Free/Pro/Enterprise) and waitlist CTAs — shipped
- ✓ Contact page — shipped
- ✓ Privacy Policy and Terms of Service — shipped
- ✓ Waitlist email capture wired to Supabase — shipped

### Active

- [ ] First 50 activated users (GTM activation)
- [ ] Demo video — 60 seconds, captions, no voiceover
- [ ] Social content published (LinkedIn founder story, X/Threads)
- [ ] Community marketing (ND subreddits, Indie Hackers)
- [ ] Product Hunt launch
- [ ] Paid tier live (Pro $12/mo, Enterprise $99/mo) with Stripe
- [ ] Free tier limit enforced (5 transcripts)

### Out of Scope

- File upload (PDF, DOCX, TXT) — deferred to Phase 2
- GDPR/CCPA compliance — Australia only at launch
- Multi-user/team features — Enterprise future
- In-app data editing — post-launch item 12
- Hiring/team insight category — post-launch item 2

## Context

- **Stack:** Next.js 14.2.35, Supabase (Sydney), Tailwind + shadcn/ui, React Flow, Vercel
- **AI:** Claude Haiku 4.5 for extraction, OpenAI Whisper for voice transcription
- **Production:** https://www.ndledger.com (canonical www, auto-deploys from GitHub main)
- **Entity:** AREASPEC PTY LTD. Robert Hobbes, sole director. AU English throughout.
- **Pricing model:** Free (5 transcripts) / Pro ($12/mo) / Enterprise ($99/mo). Paid tiers planned, not yet in codebase.
- **Launch phase:** App live since late April 2026. Now in go-to-market activation.
- **Agent files:** `.agents/ndledger-brand.md`, `.agents/product-marketing-context.md`, `.agents/copy-decisions.md`, `.agents/directory-submissions.md`, `.agents/directory-tracker.md`

## Constraints

- **Budget:** Token/API usage — keep agent spawning minimal
- **Copy rules:** AU English, no em dashes, no "free to use/forever", no upload references, "Get Started" CTA, seven categories
- **Legal:** No GDPR/CCPA scope; Privacy Policy and ToS need lawyer review before external user push
- **Solo:** Robert works one task at a time; sequential execution only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Claude Haiku 4.5 for extraction | 3.3x cheaper than Sonnet, better extraction discipline | ✓ Good |
| OpenAI Whisper for voice | Web Speech API mobile silence bug, Whisper more reliable | ✓ Good |
| PKCE magic link flow | Supabase standard; edge case when opened in different browser | — Pending (known, documented) |
| Free tier = 5 transcripts | Drive activation before paywall | — Pending (not yet enforced in code) |
| ND founder story as primary GTM channel | Robert's personal story is highest-leverage asset | — Pending |

---
*Last updated: 2026-05-05 after GSD initialisation*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements validated? Move to Validated with phase reference
2. Requirements invalidated? Move to Out of Scope with reason
3. New requirements emerged? Add to Active
4. Decisions to log? Add to Key Decisions
5. "What This Is" still accurate? Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
