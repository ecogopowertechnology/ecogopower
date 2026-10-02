-- Ecogo website: initial schema
-- Run this in the Supabase SQL Editor (or `supabase db push`).
--
-- Tables
--   products               solutions/products shown on the site (public read, published rows only)
--   projects               company projects such as the shared power bank network (public read, published rows only)
--   contact_submissions    enquiries from the contact form (public insert only, nobody can read from the browser)
--   newsletter_subscribers email signups (public insert only, nobody can read from the browser)
--
-- Security model
--   The browser uses the anon (publishable) key only. Row Level Security is on for every table.
--   Visitors can READ published products/projects and can INSERT form submissions. That is all.
--   Reading submissions is done from the Supabase dashboard (Table Editor) until an admin area exists.
--   The service_role key is never used by this website.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Shared helper: keep updated_at current
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name         text not null,
  category     text not null,                       -- free text so new categories need no migration
  summary      text not null,
  features     text[] not null default '{}',
  use_case     text,
  status       text not null default 'coming_soon'
               check (status in ('available', 'coming_soon', 'in_development')),
  visual_key   text,                                -- picks a built-in illustration (see ProductVisual.tsx)
  image_url    text,                                -- optional: a hosted image overrides the illustration
  cta_label    text not null default 'Enquire',
  sort_order   integer not null default 100,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table public.projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name         text not null,
  summary      text not null,
  status       text not null default 'concept'
               check (status in ('concept', 'pilot_preparation', 'pilot', 'rollout', 'live')),
  launch_note  text,                                -- e.g. a launch date, once one is confirmed. Null = "to be announced"
  details      jsonb not null default '{}'::jsonb,  -- room for locations, stations, etc. without a migration
  sort_order   integer not null default 100,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- contact_submissions
-- ---------------------------------------------------------------------------
create table public.contact_submissions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null check (char_length(name) between 1 and 120),
  email        text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone        text check (phone is null or char_length(phone) <= 40),
  organisation text check (organisation is null or char_length(organisation) <= 160),
  reason       text not null default 'general'
               check (reason in ('general', 'products', 'sourcing', 'powerbank_host', 'powerbank_partner', 'other')),
  message      text not null check (char_length(message) between 1 and 4000),
  source_page  text check (source_page is null or char_length(source_page) <= 200),
  status       text not null default 'new' check (status in ('new', 'in_progress', 'closed'))
);

create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------
create table public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source_page text check (source_page is null or char_length(source_page) <= 200)
);

-- One row per address, ignoring letter case.
create unique index newsletter_subscribers_email_key on public.newsletter_subscribers (lower(email));

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.products               enable row level security;
alter table public.projects               enable row level security;
alter table public.contact_submissions    enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Start from a clean slate for the two browser-facing roles, then grant only what is needed.
revoke all on public.products, public.projects, public.contact_submissions, public.newsletter_subscribers
  from anon, authenticated;

grant select on public.products, public.projects to anon, authenticated;
grant insert on public.contact_submissions, public.newsletter_subscribers to anon, authenticated;

-- Visitors can read published catalogue rows only. Drafts stay invisible.
create policy "Public can read published products"
  on public.products for select
  to anon, authenticated
  using (is_published);

create policy "Public can read published projects"
  on public.projects for select
  to anon, authenticated
  using (is_published);

-- Visitors can submit the forms. The WITH CHECK clauses stop them from setting
-- their own workflow status. There is deliberately NO select/update/delete policy,
-- so submissions cannot be read or changed from the browser.
create policy "Public can send a contact message"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (status = 'new');

create policy "Public can subscribe to the newsletter"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);
