-- Sevana MVP schema
-- Run this in Supabase SQL Editor. Review RLS policies before production use.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  kind text not null check (kind in ('hotline', 'transport', 'worker')),
  created_at timestamptz not null default now()
);

create table if not exists public.service_listings (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.service_categories(id) on delete restrict,
  name text not null,
  phone text not null,
  area text,
  address text,
  description text,
  vehicle_type text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  blood_group text not null check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  phone text not null,
  area text not null,
  available boolean not null default true,
  consented_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.blood_requests (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  blood_group text not null check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units integer not null check (units between 1 and 20),
  hospital text not null,
  area text not null,
  contact_phone text not null,
  needed_by timestamptz,
  notes text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists service_listings_category_active_idx on public.service_listings(category_id, is_active, sort_order);
create index if not exists donors_group_available_idx on public.donors(blood_group, available);
create index if not exists blood_requests_status_created_idx on public.blood_requests(status, created_at desc);

alter table public.profiles enable row level security;
alter table public.service_categories enable row level security;
alter table public.service_listings enable row level security;
alter table public.donors enable row level security;
alter table public.blood_requests enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Public users can read active categories and listings only.
drop policy if exists "Public read categories" on public.service_categories;
create policy "Public read categories" on public.service_categories for select using (true);
drop policy if exists "Public read active listings" on public.service_listings;
create policy "Public read active listings" on public.service_listings for select using (is_active = true or public.is_admin());

-- Only administrators can modify directory data.
drop policy if exists "Admins manage categories" on public.service_categories;
create policy "Admins manage categories" on public.service_categories for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage listings" on public.service_listings;
create policy "Admins manage listings" on public.service_listings for all using (public.is_admin()) with check (public.is_admin());

-- Donor phone numbers are public in this MVP for matching. Publish only with explicit consent.
drop policy if exists "Public read available donors" on public.donors;
create policy "Public read available donors" on public.donors for select using (available = true or public.is_admin());
drop policy if exists "Admins manage donors" on public.donors;
create policy "Admins manage donors" on public.donors for all using (public.is_admin()) with check (public.is_admin());

-- Public may submit a request; only admins can read/update/delete requests.
drop policy if exists "Public submit blood requests" on public.blood_requests;
create policy "Public submit blood requests" on public.blood_requests for insert with check (true);
drop policy if exists "Admins read blood requests" on public.blood_requests;
create policy "Admins read blood requests" on public.blood_requests for select using (public.is_admin());
drop policy if exists "Admins update blood requests" on public.blood_requests;
create policy "Admins update blood requests" on public.blood_requests for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins delete blood requests" on public.blood_requests;
create policy "Admins delete blood requests" on public.blood_requests for delete using (public.is_admin());

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- Seed the categories. Safe to run more than once.
insert into public.service_categories (name, slug, kind) values
  ('Hospital', 'hospital', 'hotline'),
  ('Ambulance', 'ambulance', 'hotline'),
  ('Police Station', 'police-station', 'hotline'),
  ('Fire Station', 'fire-station', 'hotline'),
  ('Blood Banks', 'blood-banks', 'hotline'),
  ('Child Line', 'child-line', 'hotline'),
  ('Medical Shops', 'medical-shop', 'hotline'),
  ('Doctor''s Clinic', 'doctors-clinic', 'hotline'),
  ('Cars', 'cars', 'transport'),
  ('Auto', 'auto', 'transport'),
  ('Tourist Bus', 'tourist-bus', 'transport'),
  ('Rent a Car', 'rent-a-car', 'transport'),
  ('Plumbing & Wiring', 'plumbing-wiring', 'worker'),
  ('Repair', 'repair', 'worker'),
  ('Construction', 'construction', 'worker'),
  ('Painting', 'painting', 'worker')
on conflict (slug) do nothing;

-- After creating your own auth user, assign admin role manually in SQL Editor:
-- insert into public.profiles (id, full_name, role)
-- values ('YOUR-AUTH-USER-UUID', 'Admin Name', 'admin')
-- on conflict (id) do update set role = 'admin';
