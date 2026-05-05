# TESTING.md — NDLedger Testing

*Mapped: 2026-05-05*

---

## Current State: No Tests

There are **zero tests** in this codebase.

- No test framework installed (no Jest, Vitest, Playwright, Cypress in `package.json`)
- No test files found anywhere in `src/`
- No CI/CD pipeline detected
- No `test` script in `package.json`

---

## What Exists Instead

**Manual verification only:**
- Dev server (`npm run dev`)
- Browser testing by hand
- ESLint (`npm run lint`) for static analysis
- TypeScript compiler for type checking (`tsc`)

---

## Risk Areas Without Tests

Given the MVP scope, the highest-risk paths with no coverage:

| Flow | Risk |
|------|------|
| `/api/extract` — Claude parsing | JSON parse failure on malformed Claude response silently fails |
| Topic deduplication logic | Case-insensitive merge could drop or duplicate topics |
| Account deletion cascade | Hard delete order (insights → topics → transcripts → user) — order matters |
| Middleware auth guard | Misconfigured `matcher` could expose protected routes |
| Waitlist duplicate handling | 23505 error code path |
| Magic link PKCE flow | Known edge case documented in code — different browser context breaks it |

---

## Recommended Approach (When Adding Tests)

**Unit tests** (Vitest recommended — works with Next.js):
- Extraction prompt parsing logic
- Topic deduplication (`normalizeName`, `topicMap` merge)
- `buildGraph()` in mindmap-content

**Integration tests** (Playwright or Cypress):
- Upload transcript → verify topics/insights appear
- Auth flow: sign up → verify redirect to dashboard
- Account delete: confirm cascade removes all rows

**API tests** (Vitest + `fetch` mocking):
- `/api/extract` — mock Anthropic SDK, test happy path + parse failure
- `/api/waitlist` — test duplicate email returns 409
- `/api/account/delete` — test auth required, test cascade order

---

## Adding Tests

To add Vitest:
```bash
npm install -D vitest @vitejs/plugin-react
```

To add Playwright:
```bash
npm install -D @playwright/test
npx playwright install
```
