create table public.waitlist (
  id         uuid        primary key default gen_random_uuid(),
  email      text        unique not null,
  created_at timestamptz default now()
);

alter table public.waitlist enable row level security;
