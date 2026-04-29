# Copy Decisions: NDLedger Landing Page

This file records deliberate copy decisions made for `src/app/(marketing)/page.tsx`.
Read this before editing that page. Do not revert or contradict these choices without a conscious decision to do so.

---

## 0. Never edit route files with heredoc shell commands

**Rule:** Do not use `cat > path/to/file << 'EOF' ... EOF` to write or overwrite TypeScript source files. The heredoc delimiters will be written literally into the file as invalid syntax.

**Incident (2026-04-29):** `src/app/Transcribe/route.ts` was created with a bash heredoc command. Line 1 contained `cat > src/app/api/transcribe/route.ts << 'EOF'` and the closing `EOF` appeared at the end of the file. This broke the Vercel build with a TypeScript parse error.

**Fix:** Remove the heredoc delimiters (line 1 and the trailing `EOF`) so the file starts directly with the TypeScript `import` statement.

**How to avoid:** Use the Write tool (or Edit tool) to create or modify source files. Never pipe file content through shell commands.

---

## 1. Australian English throughout

**Rule:** Use AU/British English spelling and grammar everywhere on the site.

**Examples:**
- `organised` not `organized`
- `recognised` not `recognized`
- `labelled` not `labeled`
- `catalogue` not `catalog`

The file already conforms. Any new copy must follow the same convention.

---

## 2. No em dashes (—)

**Rule:** Em dashes are not used anywhere on the landing page. Replace with contextually appropriate punctuation:

| Context | Replacement | Example |
|---------|-------------|---------|
| Additive or contrasting clause | Comma | `last month, and now you can't find it` |
| Introducing a list | Colon | `any AI tool: ChatGPT, Claude, Gemini…` |
| Parenthetical list inline | Parentheses | `labelled by type (decision, commitment, task…)` |
| Contrasting afterthought | Comma | `think out loud, privately` |
| Full sentence break | Period | `…Perplexity. If you can copy-paste…` |
| Explaining/elaborating | Semicolon or colon | `The work accumulates; you don't have to` |

**Why:** Robert's explicit style preference. Consistent with direct, unadorned AU English tone.

---

## 3. Two-line hero headline

**Rule:** The `<br>` in the h1 hero must not carry `className="hidden sm:block"`. The break is always rendered, on all screen sizes.

```tsx
// Correct
<br /> Stop losing them.

// Wrong — do not restore
<br className="hidden sm:block" /> Stop losing them.
```

**Why:** The two sentences are intentionally separate lines. Hiding the break on mobile causes them to run together and weakens the rhythm.

---

## 4. Category count: six business-relevant + one personal = seven total

**Rule:** When referring to the category structure, say "six business-relevant categories (and one personal)". Do not simplify to "six categories" or "seven categories" without the parenthetical.

**Applied in:**
- Auto-organised topics feature card description
- "How does extraction work?" FAQ answer (refers to "one of seven categories")

**Why:** There are six named business categories plus a Personal & Ideas category. Saying only "six" is inaccurate; saying only "seven" loses the distinction between business-oriented and personal categories.

---

## 5. No upload function — use "paste or record"

**Rule:** NDLedger does not have a file upload feature. Never write "upload a transcript", "re-upload", or any phrasing that implies a file upload flow.

**Correct alternatives:**
- "Paste or record a conversation"
- "Paste the transcript again"
- "Add a conversation"
- "Drop in a transcript" (referring to copy-paste)

**Note:** The `Upload` Lucide icon is used as a visual metaphor for the paste step — that icon import is intentional and should stay. Only copy text is affected by this rule.

**Why:** There is no upload button or file input on the page. Referencing one creates a false expectation and confuses new users.

---

## 6. Deletion subject: transcripts, not topics

**Rule:** Users delete transcripts from the dashboard, not topics. The "How do I delete my data?" FAQ must reflect this.

**Correct:** `Delete individual transcripts from your dashboard at any time.`
**Wrong:** `Delete individual topics from your dashboard at any time.`

The Settings → Danger Zone → Delete My Account path deletes all data and the account. The right-arrow symbol (→) in that path is intentional and should not be changed.

**Why:** The dashboard exposes transcript records, not topic records, as the deletable unit. Saying "topics" was factually incorrect.

---

## 7. Pricing copy: hint, do not claim, paid tiers

**Rule:** Marketing copy must not assert that paid tiers exist until they are actually implemented in code. Use phrasing that leaves room for a future paid plan without inventing one today.

**Pricing structure found in code (2026-04-29 audit):**
- No Stripe or other payment integration in `package.json`
- No `/pricing` route under `src/app/`
- No subscription, plan, or tier tables (no `supabase/` directory or migration files)
- No tier or plan constants anywhere in the codebase
- Only quantitative limit found: `WARN_WORDS = 50000` and `MAX_WORDS = 100000` at `src/app/dashboard/dashboard-content.tsx:49-50`, applied uniformly to all users
- `skills/pricing-strategy/references/tier-structure.md` is generic educational material, not a product spec

**Decision:** Soften the hero and final CTA subtext from
> Free to use. No credit card. Works with any AI tool.

to
> Free plan available. No credit card to start. Works with any AI tool.

**Rationale:**
- "Free plan available" implies a free tier alongside a possible paid tier without claiming paid tiers exist today
- "No credit card to start" preserves the friction-free signup message while leaving room for billing to be introduced later
- "Works with any AI tool" remains true regardless of pricing structure
- Both occurrences (hero at the top and final CTA at the bottom) updated for consistency

**Applied in:** `src/app/(marketing)/page.tsx` (hero subtext and final CTA subtext).

**Do not:** Add specific tier names, prices, "starting at" figures, or trial language until those tiers are actually built.
