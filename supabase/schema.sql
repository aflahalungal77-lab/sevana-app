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


-- Dynamic Local Workers category groups.
create table if not exists public.worker_category_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon_path text not null default '/emojis/others.png',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.service_categories
  add column if not exists parent_group_id uuid references public.worker_category_groups(id) on delete set null,
  add column if not exists icon_path text,
  add column if not exists sort_order integer not null default 0;

create index if not exists worker_category_groups_sort_idx
  on public.worker_category_groups(sort_order, name);
create index if not exists service_categories_parent_group_idx
  on public.service_categories(parent_group_id, sort_order);

alter table public.worker_category_groups enable row level security;
drop policy if exists "Public can read worker category groups" on public.worker_category_groups;
create policy "Public can read worker category groups"
  on public.worker_category_groups for select using (true);
drop policy if exists "Admins manage worker category groups" on public.worker_category_groups;
create policy "Admins manage worker category groups"
  on public.worker_category_groups for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins update worker categories" on public.service_categories;
create policy "Admins update worker categories"
  on public.service_categories for all
  to authenticated
  using (kind = 'worker' and public.is_admin())
  with check (kind = 'worker' and public.is_admin());

drop policy if exists "Public can read worker service categories" on public.service_categories;
create policy "Public can read worker service categories"
  on public.service_categories for select using (kind = 'worker');

insert into public.worker_category_groups (name, slug, icon_path, sort_order) values
  ('Construction', 'construction', '/emojis/construction.png', 1),
  ('Home Maintenance', 'home-maintenance', '/emojis/home-maintenance.png', 2),
  ('Agriculture & Farming', 'agriculture-farming', '/emojis/agricultural-works.png', 3),
  ('Others', 'others', '/emojis/others.png', 4)
on conflict (slug) do update
set name = excluded.name, icon_path = excluded.icon_path;

insert into public.service_categories (name, slug, kind, parent_group_id, icon_path, sort_order)
select seed.name, seed.slug, 'worker', groups.id, seed.icon_path, seed.sort_order
from (values
  ('Masonry Work', 'masonry-work', '/emojis/masonry-work.png', 1, 'construction'),
  ('Carpenter', 'carpenter', '/emojis/carpenter.png', 2, 'construction'),
  ('Tiles & Marble Work', 'tiles-marble', '/emojis/tiles-marble.png', 3, 'construction'),
  ('Plastering Work', 'plastering-work', '/emojis/masonry-work.png', 4, 'construction'),
  ('Laterite Stone Quarrying', 'laterite-stone-quarrying', '/emojis/stone.png', 5, 'construction'),
  ('Plumbing & Wiring', 'plumbing-wiring', '/emojis/plumbing-wiring.png', 1, 'home-maintenance'),
  ('Painting & Wood Polishing', 'painting-wood-polishing', '/emojis/painting-wood-polishing.png', 2, 'home-maintenance'),
  ('Welders', 'welders', '/emojis/welders.png', 3, 'home-maintenance'),
  ('Curtain & Carpet Works', 'curtain-carpet-works', '/emojis/curtain-carpet-works.png', 4, 'home-maintenance'),
  ('Garden Services', 'garden-services', '/emojis/garden-services.png', 5, 'home-maintenance'),
  ('Agricultural Workers', 'agricultural-works', '/emojis/agricultural-works.png', 1, 'agriculture-farming'),
  ('Mechanical Engineering', 'mechanical-engineering', '/emojis/mechanical-engineering.png', 1, 'others'),
  ('Videography & Editing', 'videography-editing', '/emojis/videography-editing.png', 2, 'others'),
  ('Others', 'others', '/emojis/others.png', 3, 'others')
) as seed(name, slug, icon_path, sort_order, parent_slug)
join public.worker_category_groups groups on groups.slug = seed.parent_slug
on conflict (slug) do update
set name = excluded.name,
    kind = excluded.kind,
    parent_group_id = excluded.parent_group_id,
    icon_path = excluded.icon_path,
    sort_order = excluded.sort_order;

update public.service_categories categories
set parent_group_id = groups.id
from public.worker_category_groups groups
where categories.kind = 'worker'
  and categories.parent_group_id is null
  and groups.slug = 'others';

update public.service_categories
set icon_path = '/emojis/' || slug || '.png'
where kind = 'worker' and (icon_path is null or icon_path = '');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('worker-category-icons', 'worker-category-icons', true, 2097152, array['image/png','image/jpeg','image/webp'])
on conflict (id) do update
set public = true, file_size_limit = 2097152,
    allowed_mime_types = array['image/png','image/jpeg','image/webp'];

drop policy if exists "Admins upload worker category icons" on storage.objects;
create policy "Admins upload worker category icons"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'worker-category-icons' and public.is_admin());
drop policy if exists "Admins update worker category icons" on storage.objects;
create policy "Admins update worker category icons"
  on storage.objects for update to authenticated
  using (bucket_id = 'worker-category-icons' and public.is_admin())
  with check (bucket_id = 'worker-category-icons' and public.is_admin());
drop policy if exists "Admins delete worker category icons" on storage.objects;
create policy "Admins delete worker category icons"
  on storage.objects for delete to authenticated
  using (bucket_id = 'worker-category-icons' and public.is_admin());
