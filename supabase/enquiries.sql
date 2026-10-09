-- Haven Lane: the table that stores viewing requests and contact messages.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 120),
  email       text not null check (char_length(email) between 5 and 254 and email like '%_@_%._%'),
  phone       text check (phone is null or char_length(phone) <= 40),
  message     text check (message is null or char_length(message) <= 2000),
  when_suits  text not null default 'any' check (when_suits in ('weekdays', 'weekends', 'any')),
  home_slug   text check (home_slug is null or home_slug ~ '^[a-z0-9-]{1,120}$'),
  agent_slug  text check (agent_slug is null or agent_slug ~ '^[a-z0-9-]{1,120}$'),
  -- For the office team to track replies in the Table Editor
  handled     boolean not null default false
);

comment on table public.enquiries is 'Viewing requests and contact messages from the website.';

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- Row-level security: on. Without a policy, nobody can do anything with the
-- website's key; the one policy below allows adding a new row, nothing else.
alter table public.enquiries enable row level security;

drop policy if exists "Website visitors can send an enquiry" on public.enquiries;
create policy "Website visitors can send an enquiry"
  on public.enquiries
  for insert
  to anon
  with check (handled = false);

-- Belt and braces: the website's role may only insert.
revoke all on public.enquiries from anon, authenticated;
grant insert (name, email, phone, message, when_suits, home_slug, agent_slug) on public.enquiries to anon;

-- Staff read and update enquiries in the Supabase dashboard, which uses the
-- owner role and is not affected by these rules.
