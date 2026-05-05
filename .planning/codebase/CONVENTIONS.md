# CONVENTIONS.md — NDLedger Code Conventions

*Mapped: 2026-05-05*

---

## TypeScript

- **Strict mode** — all types explicit, no implicit `any`
- Interfaces preferred over type aliases for object shapes
- Union types for constrained values: `"decision" | "commitment" | "insight" | "pivot" | "task"`
- Non-null assertion (`!`) used for env vars: `process.env.NEXT_PUBLIC_SUPABASE_URL!`
- `instanceof Error` checks before casting error objects

---

## React / Next.js Patterns

**Server vs Client split:**
- `page.tsx` files are Server Components — data fetching, no hooks, no event handlers
- `*-content.tsx` files are Client Components — all interactivity, marked `"use client"` at top
- Never mix data fetching and interactivity in one file

**Props pattern:**
```typescript
// Server page fetches, passes typed props to Client content
interface DashboardContentProps {
  user: User;
  transcripts: Transcript[];
  insights: Insight[];
}
export function DashboardContent({ user, transcripts, insights }: DashboardContentProps) {
```

**useCallback/useMemo:** Used liberally in MindMapContent for expensive graph computations.

**memo:** Used for custom React Flow node components (`TopicNode`).

---

## Component Styling

- **Tailwind utility classes** — no CSS modules, no styled-components
- **shadcn/ui primitives** for all form elements and layout cards
- Inline `style={{}}` objects used in React Flow nodes (required by React Flow API)
- Color palette: slate (neutral), indigo/purple (brand), teal (`#5EEAD4`, `#0D9488`)
- Navy header: `bg-[#1E3A5F]` on marketing pages

---

## API Routes

Standard pattern for all protected API routes:

```typescript
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... business logic ...
  return NextResponse.json({ success: true });
}
```

- Always verify auth first
- Validate input (check required fields, validate email regex)
- Return typed error objects: `{ error: "message" }` with appropriate HTTP status
- Handle DB errors explicitly — propagate Supabase error messages

---

## Error Handling

- `try/catch` blocks for external API calls (Claude, Whisper)
- Supabase errors checked via `{ data, error }` destructuring
- Status codes: 400 (bad input), 401 (unauth), 404 (not found), 409 (conflict/duplicate), 413 (too large), 500 (server error)
- `console.error` for server-side failures — no crash, return JSON error
- Client UI: inline `message` state with `{ type: "success" | "error"; text: string }`

---

## Auth

- Session managed via Supabase cookies (no localStorage)
- `createClient()` in `src/lib/supabase/server.ts` used for Server Components and API routes
- `createClient()` in `src/lib/supabase/client.ts` used for Client Components
- Middleware (`src/middleware.ts`) protects all `/dashboard/*` routes
- PKCE flow for magic links — callback at `/auth/callback`

---

## State Management Conventions

- **URL params** for shareable/backable state (mind map: `e`, `c`, `t`, `s`, `f`)
- **useState** for ephemeral UI state (form inputs, loading, messages)
- **useRef** for DOM references and mutable values that don't trigger re-renders (MediaRecorder, timers, sessionStorage)
- **sessionStorage** for viewport persistence across navigations

---

## Formatting Utilities

Located in `src/lib/utils.ts`:
- `cn(...classes)` — clsx + tailwind-merge for conditional class application
- `formatDate(date)` — short date display
- `formatDateTime(date)` — date + time display
