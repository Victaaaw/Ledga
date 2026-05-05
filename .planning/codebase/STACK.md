# STACK.md — NDLedger Technology Stack

*Mapped: 2026-05-05*

---

## Runtime & Language

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | ^14.2.35 |
| Language | TypeScript | ^5 |
| Runtime | Node.js | (Next.js default) |
| Package manager | npm | (inferred from package-lock) |

---

## Frontend

| Library | Version | Purpose |
|---------|---------|---------|
| React | ^18 | UI framework |
| Tailwind CSS | ^3.4.3 | Utility-first styling |
| shadcn/ui | (pinned components) | Component primitives — button, card, input, textarea |
| Lucide React | ^0.378.0 | Icon set |
| `@xyflow/react` | ^12.10.2 | React Flow — interactive mind map canvas |
| Dagre | ^0.8.5 | Auto-layout algorithm for mind map graph |
| class-variance-authority | ^0.7.0 | Variant-based class building (shadcn) |
| clsx / tailwind-merge | ^2.1.1 / ^2.3.0 | Conditional class merging |
| tailwindcss-animate | ^1.0.7 | Animation utilities |

---

## Backend / API

| Library | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | ^2.43.0 | Supabase client |
| `@supabase/ssr` | ^0.10.2 | Server-side Supabase (cookies-based session) |
| `@anthropic-ai/sdk` | ^0.87.0 | Anthropic Claude API (topic/insight extraction) |
| OpenAI Whisper | REST API | Voice-to-text transcription |

---

## AI Models in Use

| Model | Provider | Usage |
|-------|----------|-------|
| `claude-haiku-4-5` | Anthropic | Transcript extraction (topics + insights) |
| `whisper-1` | OpenAI | Audio transcription |

Model ID is set at the top of `src/app/api/extract/route.ts:9`.

---

## Configuration Files

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Tailwind theme + content paths |
| `tsconfig.json` | TypeScript strict config, `@/` path alias |
| `postcss.config.js` | PostCSS for Tailwind |
| `.env.local` (not tracked) | Secrets: Supabase URL/keys, Anthropic key, OpenAI key |
| `next.config.js` | (not detected — Next.js uses defaults) |

---

## Required Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      # Used by account deletion only
ANTHROPIC_API_KEY
OPENAI_API_KEY
```

---

## Dev Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | ^8 | Linting (`eslint-config-next`) |
| autoprefixer | ^10.4.19 | CSS vendor prefixes |
| @types/* | various | TypeScript typings |

---

## Deployment Target

- Vercel (per CLAUDE.md — "Next: Deploy to Vercel")
- No Dockerfile or CI/CD config detected
