# NDLedger — Roadmap

*Generated: 2026-05-05. Post-launch. MVP is live at https://www.ndledger.com.*

---

## Overview

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|--------|
| 1 | GTM Activation | First 50 activated users | GTM-01 to GTM-05, OPS-01 to OPS-06 | In Progress |
| 2 | Product Hunt | Public launch with momentum | GTM-06 | Not Started |
| 3 | Paid Tier | First paying customers | PROD-01 to PROD-04 | Not Started |
| 4 | Tech Hardening | Production-ready at scale | TECH-01 to TECH-04 | Not Started |

---

## Phase 1: GTM Activation

**Goal:** Get first 50 users who paste or record a conversation AND retrieve a useful insight.

**Requirements:** GTM-01, GTM-02, GTM-03, GTM-04, GTM-05, OPS-01, OPS-02, OPS-03, OPS-04, OPS-05, OPS-06

**Success criteria:**
1. 20+ AI directory listings live
2. Demo video published and linked from at least 2 channels
3. LinkedIn founder story posted and generating profile visits
4. Community posts live in at least 3 ND/founder communities
5. OpenAI spend limit set, stale Supabase URLs removed, lawyer review booked

**Immediate next actions (from v17 handoff):**
- Submit to AlternativeTo (Monday)
- Retry BetaList submission
- Record demo video (script ready — 10 steps including Record Voice)
- Continue SaaSHub directory list
- Run `/social-content` in CC
- Run `/community-marketing` in CC

**UI hint**: no

---

## Phase 2: Product Hunt

**Goal:** Execute a planned Product Hunt launch to spike signups and awareness.

**Requirements:** GTM-06

**Success criteria:**
1. 20-30 supporter network confirmed before launch day
2. All assets ready: screenshots (7 done), 90-120s demo video, tagline, maker comment
3. Launch on Tuesday/Wednesday/Thursday at 12:01 AM PT
4. Every comment responded to within 4 hours on launch day
5. Top 5 in category on launch day

**Blockers to clear before starting:**
- Demo video (Phase 1)
- LinkedIn post live and generating traction (Phase 1)
- 20-30 supporters identified and briefed

**UI hint**: no

---

## Phase 3: Paid Tier

**Goal:** First paying customers — Pro tier live with Stripe, free limit enforced.

**Requirements:** PROD-01, PROD-02, PROD-03, PROD-04

**Success criteria:**
1. Free users capped at 5 transcripts with clear upgrade prompt
2. Stripe checkout live for Pro ($12/mo) and Enterprise ($99/mo)
3. Pricing page waitlist CTAs replaced with live Stripe links
4. Rate limiting on `/api/extract` and `/api/transcribe` (per-user quota)
5. First paying customer onboarded

**UI hint**: no

---

## Phase 4: Tech Hardening

**Goal:** Clean up tech debt before scale introduces real risk.

**Requirements:** TECH-01, TECH-02, TECH-03, TECH-04

**Success criteria:**
1. Dead route `src/app/Transcribe/route.ts` deleted, build clean
2. `@supabase/ssr` migrated to `getAll`/`setAll` pattern, no deprecation warnings
3. Next.js 16 running in production, `npm audit` clears the 4 high advisories
4. Vercel project and GitHub repo renamed to `ndledger`

**UI hint**: no

---

## Deferred Phases (v2)

- **File Upload:** PDF, TXT, DOCX, MD ingestion
- **In-App Editing:** Allow users to correct insights without email request
- **Category Expansion:** Hiring/team category, taxonomy review
- **Scale Features:** Pagination, full-text index, semantic search
