-- Sevana Vacancies: minimal, admin-published local job listings.
-- Run this migration in the Supabase SQL Editor before enabling the feature.

create table if not exists public.vacancies (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 2 and 120),
  company_name text not null check (char_length(trim(company_name)) between 2 and 120),
  description text not null check (char_length(trim(description)) between 10 and 3000),
  job_type text not null default 'Full-time'
    check (job_type in ('Full-time', 'Part-time', 'Temporary', 'Internship', 'Contract')),
  location text not null check (char_length(trim(location)) between 2 and 160),
  contact_phone text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'filled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vacancies_status_created_idx
  on public.vacancies (status, created_at desc);

create or replace function public.set_vacancies_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists vacancies_set_updated_at on public.vacancies;
create trigger vacancies_set_updated_at
before update on public.vacancies
for each row execute function public.set_vacancies_updated_at();

alter table public.vacancies enable row level security;

drop policy if exists "Public can read active vacancies" on public.vacancies;
create policy "Public can read active vacancies"
on public.vacancies for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Admins can read all vacancies" on public.vacancies;
create policy "Admins can read all vacancies"
on public.vacancies for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can insert vacancies" on public.vacancies;
create policy "Admins can insert vacancies"
on public.vacancies for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
  and (created_by is null or created_by = (select auth.uid()))
);

drop policy if exists "Admins can update vacancies" on public.vacancies;
create policy "Admins can update vacancies"
on public.vacancies for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can delete vacancies" on public.vacancies;
create policy "Admins can delete vacancies"
on public.vacancies for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);
