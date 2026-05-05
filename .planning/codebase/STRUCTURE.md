# STRUCTURE.md — NDLedger Directory Structure

*Mapped: 2026-05-05*

---

## Top-Level Layout

```
ledga-app/
├── src/
│   ├── app/                 # Next.js App Router — all routes live here
│   ├── components/          # Shared UI components
│   └── lib/                 # Utilities and service clients
├── public/                  # Static assets (logo.png, favicon)
├── .planning/               # GSD planning docs (this folder)
├── Handover/                # Handoff docs (untracked — not in git)
├── .agents/                 # Agent brand context (untracked)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── CLAUDE.md
```

---

## `src/app/` — Route Structure

```
app/
├── layout.tsx               # Root layout — Inter font, metadata
├── globals.css              # Global CSS (Tailwind base)
│
├── (marketing)/             # Route group — public marketing pages
│   ├── page.tsx             # Landing page (/)
│   ├── contact/page.tsx     # Contact page
│   ├── privacy/page.tsx     # Privacy policy
│   ├── terms/page.tsx       # Terms of service
│   └── linkedin/            # LinkedIn content drafts (untracked)
│
├── pricing/
│   ├── page.tsx             # Pricing page
│   └── WaitlistForm.tsx     # Waitlist form component
│
├── login/
│   └── page.tsx             # Auth page — sign in / sign up / magic link
│
├── auth/
│   └── callback/route.ts    # PKCE OAuth/magic link exchange
│
├── dashboard/               # Protected — requires auth
│   ├── page.tsx             # Dashboard shell (Server)
│   ├── dashboard-content.tsx # Dashboard UI (Client)
│   ├── topics/
│   │   ├── page.tsx
│   │   ├── topics-content.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── topic-detail-content.tsx
│   ├── mindmap/
│   │   ├── page.tsx
│   │   └── mindmap-content.tsx
│   ├── search/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── api/                     # Server-only API routes
│   ├── extract/route.ts     # Claude extraction
│   ├── transcribe/route.ts  # Whisper transcription
│   ├── waitlist/route.ts    # Waitlist signup
│   └── account/delete/route.ts # Account deletion
│
└── Transcribe/route.ts      # Dead code — wrong path, duplicate of /api/transcribe
```

---

## `src/components/` — Shared Components

```
components/
├── ui/                      # shadcn/ui primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── textarea.tsx
└── help-button.tsx          # Help button (used across dashboard pages)
```

---

## `src/lib/` — Utilities

```
lib/
├── supabase/
│   ├── client.ts            # Browser Supabase client
│   └── server.ts            # Server Supabase client (cookies)
└── utils.ts                 # cn() (clsx+tailwind-merge), formatDate, formatDateTime
```

---

## Naming Conventions

| Pattern | Meaning |
|---------|---------|
| `page.tsx` | Next.js route segment — Server Component |
| `*-content.tsx` | Client Component paired with a Server page |
| `route.ts` | API route handler |
| `WaitlistForm.tsx` | Standalone Client Component (capitalized, co-located with page) |
| `ui/` | shadcn primitives — thin wrappers, not modified |
| `lib/supabase/` | Client factories — one per rendering context |

---

## Where to Add New Code

| What | Where |
|------|-------|
| New protected page | `src/app/dashboard/<name>/page.tsx` + `<name>-content.tsx` |
| New public page | `src/app/(marketing)/<name>/page.tsx` |
| New API endpoint | `src/app/api/<name>/route.ts` |
| New UI component | `src/components/ui/<name>.tsx` (follow shadcn pattern) |
| New utility | `src/lib/utils.ts` |
| New Supabase table | Query via existing client factories in `src/lib/supabase/` |
