# ARCHITECTURE.md — NDLedger Architecture

*Mapped: 2026-05-05*

---

## Pattern

**Next.js App Router** with clear server/client component separation:
- Server Components for data fetching and page shells
- Client Components (`"use client"`) for all interactivity
- API Routes (`route.ts`) for server-side logic
- Middleware for auth guard

---

## Route Groups & Layers

```
Public (no auth required)
├── /                        → (marketing)/page.tsx  [Server]
├── /pricing                 → pricing/page.tsx       [Server]
├── /contact                 → (marketing)/contact/   [Server]
├── /privacy                 → (marketing)/privacy/   [Server]
├── /terms                   → (marketing)/terms/     [Server]
└── /login                   → login/page.tsx         [Client]

Auth
└── /auth/callback           → auth/callback/route.ts [Server - PKCE exchange]

Protected (middleware redirects to /login if no session)
├── /dashboard               → dashboard/page.tsx     [Server] → DashboardContent [Client]
├── /dashboard/topics        → topics/page.tsx        [Server] → TopicsContent [Client]
├── /dashboard/topics/[id]   → topics/[id]/page.tsx  [Server] → TopicDetailContent [Client]
├── /dashboard/mindmap       → mindmap/page.tsx       [Server] → MindMapContent [Client]
├── /dashboard/search        → search/page.tsx        [Server]
└── /dashboard/settings      → settings/page.tsx      [Client]

API (server-only, auth-verified)
├── /api/extract             → POST — Claude topic/insight extraction
├── /api/transcribe          → POST — OpenAI Whisper voice transcription
├── /api/waitlist            → POST — Waitlist email signup
└── /api/account/delete      → POST — Hard delete user + all data
```

---

## Data Flow

### Transcript Upload + Extraction
```
User pastes text / records audio
  → (voice) POST /api/transcribe → OpenAI Whisper → text appended to textarea
  → POST /api/extract
      → Supabase: insert transcript row (processing_status: pending)
      → Anthropic Claude: extract topics + insights from raw_content
      → Supabase: upsert topics (merge with existing by name)
      → Supabase: insert insights with topic_id FK
      → Supabase: update transcript (status: completed, raw_content: null)
```

### Mind Map View
```
Server fetches topics + insights + transcripts from Supabase
  → MindMapContent receives as props
  → React Flow renders nodes/edges from buildGraph()
  → All expansion state stored in URL search params (e, c, t, s, f)
  → sessionStorage caches viewport position between navigations
```

### Auth Guard
```
middleware.ts intercepts every request to /, /login, /dashboard/*
  → createServerClient with request cookies
  → supabase.auth.getUser()
  → /dashboard/* without user → redirect /login
  → / or /login with user → redirect /dashboard
```

---

## Key Abstractions

| Abstraction | File | Purpose |
|-------------|------|---------|
| `createClient()` browser | `src/lib/supabase/client.ts` | Client-side Supabase instance |
| `createClient()` server | `src/lib/supabase/server.ts` | Server-side Supabase with cookie handling |
| `buildGraph()` | `src/app/dashboard/mindmap/mindmap-content.tsx:278` | Converts topics/insights to React Flow nodes + edges |
| Extraction prompt | `src/app/api/extract/route.ts:23` | EXTRACTION_PROMPT defines JSON schema for Claude |
| Auth callback | `src/app/auth/callback/route.ts` | Exchanges PKCE code for session |

---

## Server/Client Split Pattern

Every protected route follows this convention:
- `page.tsx` — Server Component: fetch data, pass as props
- `*-content.tsx` — Client Component: all React state + event handlers

Example:
- `src/app/dashboard/page.tsx` → `src/app/dashboard/dashboard-content.tsx`
- `src/app/dashboard/mindmap/page.tsx` → `src/app/dashboard/mindmap/mindmap-content.tsx`

---

## State Management

No global state library. State lives in:
- **URL search params** — mind map expansion/selection state (makes browser back work)
- **React useState** — local UI state (form inputs, loading flags)
- **sessionStorage** — mind map viewport position (persists across navigations)
- **Supabase** — all persistent data (single source of truth)
