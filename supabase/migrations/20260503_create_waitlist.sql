-- Idempotent: safe to run even if the table already exists.
create table if not exists public.waitlist (
  id         uuid        primary key default gen_random_uuid(),
  email      text        unique not null,
  created_at timestamptz default now()
);

alter table public.waitlist enable row level security;

-- Allow unauthenticated (anon) users to insert their email.
-- No SELECT/UPDATE/DELETE policy is created — only the API route can read.
drop policy if exists "Allow anon insert" on public.waitlist;
create policy "Allow anon insert" on public.waitlist
  for insert to anon
  with check (true);
