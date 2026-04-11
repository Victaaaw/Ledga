# Ledga App

Your AI conversation knowledge library.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase Auth

In your Supabase dashboard:

1. Go to **Authentication → URL Configuration**
2. Add `http://localhost:3000/auth/callback` to **Redirect URLs**

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── auth/callback/     # Magic link callback
│   ├── dashboard/         # Main dashboard + upload
│   ├── login/             # Login page
│   ├── globals.css        # Tailwind styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home (redirects)
├── components/ui/         # shadcn/ui components
├── lib/
│   ├── supabase/          # Supabase client utilities
│   └── utils.ts           # Helper functions
└── middleware.ts          # Auth middleware
```

## Environment Variables

Already configured in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

## Next Steps (Week 2)

- [ ] Build extraction Edge Function with Anthropic API
- [ ] Process transcripts in background
- [ ] Extract topics, decisions, commitments, insights, pivots
- [ ] Display extracted data in dashboard

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth (Magic Link)
- **Deployment:** Vercel (recommended)
