-- Ecogo website: shop prices, admin access and product image storage
-- Run this in the Supabase SQL Editor AFTER 0001_initial_schema.sql. Safe to run more than once.
--
-- What it does
--   1. Adds a price (whole Kenya shillings) to products, and an "out of stock" status.
--   2. Defines who counts as an admin: a signed-in user whose app_metadata role is "admin".
--      app_metadata can only be changed from the Supabase dashboard or SQL, never by the user,
--      so it is safe to base permissions on.
--   3. Lets admins add, edit and delete products and projects, read and update contact messages,
--      and read the newsletter list. Visitors keep exactly the limited access they had before.
--   4. Creates a public "product-images" storage bucket. Anyone can view the images,
--      only admins can upload, replace or delete them.

-- 1. Price and status ------------------------------------------------------------------------
alter table public.products
  add column if not exists price_kes integer check (price_kes is null or price_kes >= 0);

alter table public.products drop constraint if exists products_status_check;
alter table public.products
  add constraint products_status_check
  check (status in ('available', 'out_of_stock', 'coming_soon', 'in_development'));

-- 2. Admin check -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(((select auth.jwt()) -> 'app_metadata') ->> 'role', '') = 'admin'
$$;

-- 3. Admin permissions on tables -------------------------------------------------------------
grant select, insert, update, delete on public.products, public.projects to authenticated;
grant select, update, delete on public.contact_submissions to authenticated;
grant select, delete on public.newsletter_subscribers to authenticated;

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read contact submissions" on public.contact_submissions;
create policy "Admins read contact submissions" on public.contact_submissions
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins update contact submissions" on public.contact_submissions;
create policy "Admins update contact submissions" on public.contact_submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete contact submissions" on public.contact_submissions;
create policy "Admins delete contact submissions" on public.contact_submissions
  for delete to authenticated using (public.is_admin());

drop policy if exists "Admins read subscribers" on public.newsletter_subscribers;
create policy "Admins read subscribers" on public.newsletter_subscribers
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins delete subscribers" on public.newsletter_subscribers;
create policy "Admins delete subscribers" on public.newsletter_subscribers
  for delete to authenticated using (public.is_admin());

-- 4. Product image storage -------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins list product images" on storage.objects;
create policy "Admins list product images" on storage.objects
  for select to authenticated using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins replace product images" on storage.objects;
create policy "Admins replace product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- 5. Make yourself the admin (run separately, after creating your user) ----------------------
-- In Supabase: Authentication > Users > Add user > Create new user (tick "Auto Confirm User").
-- Then run this once, with that user's email:
--
--   update auth.users
--      set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
--    where email = 'ecogopowertechnology@gmail.com';
