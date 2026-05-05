# NDLedger — Requirements

*Generated: 2026-05-05. Covers post-launch work only. Core MVP is validated and shipped.*

---

## v1 Requirements (Active Work)

### GTM — Go-to-Market Activation

- [ ] **GTM-01**: User (Robert) completes directory submissions across all viable free AI directories (target: 20+ listings live)
- [ ] **GTM-02**: 60-second demo video recorded with captions, no voiceover, covering: paste/record → extract → library → search → mind map
- [ ] **GTM-03**: LinkedIn founder story post published (500-800 words, ND angle, resilience arc)
- [ ] **GTM-04**: X/Threads demo post published with screen recording
- [ ] **GTM-05**: Community marketing posts live in ND subreddits and Indie Hackers (problem-first framing, product mentioned at end)
- [ ] **GTM-06**: Product Hunt launch executed (Tuesday/Wednesday/Thursday, 12:01 AM PT, 20-30 supporter network, maker comment ready)

### OPS — Operations

- [ ] **OPS-01**: Lawyer review of Privacy Policy and Terms of Service completed (Whisper migration changed both documents)
- [ ] **OPS-02**: OpenAI monthly spend limit set at platform.openai.com/account/limits
- [ ] **OPS-03**: Two stale Supabase redirect URLs removed (voice-truncation-fix and whisper-migration preview URLs)
- [ ] **OPS-04**: ToolsAIApp email list unsubscribed
- [ ] **OPS-05**: 2FA audited and documented for GitHub, Vercel, Supabase, Anthropic Console (access sheet Sections 2-7)
- [ ] **OPS-06**: Stale Anthropic `Ledga` API key reviewed and revoked if unused

### PROD — Product

- [ ] **PROD-01**: Free tier transcript limit enforced in app (5 transcripts total per free user)
- [ ] **PROD-02**: Stripe integration live with Pro ($12/mo) and Enterprise ($99/mo) tiers
- [ ] **PROD-03**: Pricing page waitlist form replaced with live Stripe checkout for paid tiers
- [ ] **PROD-04**: Rate limiting added to `/api/extract` and `/api/transcribe` (per-user quota)

### TECH — Tech Debt

- [ ] **TECH-01**: Dead route `src/app/Transcribe/route.ts` deleted
- [ ] **TECH-02**: `@supabase/ssr` cookie handlers migrated to `getAll`/`setAll` pattern
- [ ] **TECH-03**: Next.js 14→16 migration (closes 4 high DoS/request-smuggling advisories)
- [ ] **TECH-04**: Vercel and GitHub repo renamed from `ledga` to `ndledger`

---

## v2 Requirements (Deferred)

- File upload: PDF, TXT, DOCX, MD parsing
- In-app insight editing (currently email-only via APP 13)
- Hiring/team insight category (sixth business category gap)
- Pagination for large transcript/insight lists (relevant at 100+ items)
- Full-text search index (Postgres tsvector) — current ilike degrades at scale
- `ndledger` business name registration with ASIC (~$42/yr)
- `ndledger.com.au` domain decision

---

## Out of Scope

- GDPR/CCPA compliance — Australia only at launch
- Multi-user/team admin dashboard — Enterprise phase
- Real-time extraction progress indicator — post-activation
- Analytics SDK — deliberate exclusion (privacy stance)
- Cloudflare proxied mode — revisit only if bot abuse emerges

---

## Traceability

| REQ-ID | Phase |
|--------|-------|
| GTM-01 to GTM-06 | Phase 1: GTM Activation |
| OPS-01 to OPS-06 | Phase 2: Operations |
| GTM-06 | Phase 2: Product Hunt |
| PROD-01 to PROD-04 | Phase 3: Paid Tier |
| TECH-01 to TECH-04 | Phase 4: Tech Hardening |
