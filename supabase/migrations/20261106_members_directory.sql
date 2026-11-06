-- Sevana Members directory
-- Run this migration in Supabase SQL Editor before deploying the UI.

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  ward_number integer not null check (ward_number between 1 and 999),
  photo_url text,
  contact_number text not null check (char_length(trim(contact_number)) between 7 and 20),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists members_active_ward_idx
  on public.members (is_active, ward_number, name);

alter table public.members enable row level security;

drop policy if exists "Public can view active members" on public.members;
create policy "Public can view active members"
  on public.members for select
  using (is_active = true or exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  ));

drop policy if exists "Admins can insert members" on public.members;
create policy "Admins can insert members"
  on public.members for insert
  with check (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  ));

drop policy if exists "Admins can update members" on public.members;
create policy "Admins can update members"
  on public.members for update
  using (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  ));

drop policy if exists "Admins can delete members" on public.members;
create policy "Admins can delete members"
  on public.members for delete
  using (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  ));

-- Public profile images; uploads and deletes are restricted to Sevana admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('member-photos', 'member-photos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public can view member photos" on storage.objects;
create policy "Public can view member photos"
  on storage.objects for select
  using (bucket_id = 'member-photos');

drop policy if exists "Admins can upload member photos" on storage.objects;
create policy "Admins can upload member photos"
  on storage.objects for insert
  with check (bucket_id = 'member-photos' and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  ));

drop policy if exists "Admins can update member photos" on storage.objects;
create policy "Admins can update member photos"
  on storage.objects for update
  using (bucket_id = 'member-photos' and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  ));

drop policy if exists "Admins can delete member photos" on storage.objects;
create policy "Admins can delete member photos"
  on storage.objects for delete
  using (bucket_id = 'member-photos' and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  ));
