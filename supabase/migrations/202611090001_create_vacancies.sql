-- Sevana Vacancies
-- Run this migration in the Supabase SQL Editor before enabling the feature.

create table if not exists public.vacancies (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 2 and 120),
  company_name text not null check (char_length(trim(company_name)) between 2 and 120),
  description text not null check (char_length(trim(description)) between 10 and 8000),
  category text not null default 'Other',
  job_type text not null default 'Full-time'
    check (job_type in ('Full-time', 'Part-time', 'Temporary', 'Internship', 'Contract')),
  location text not null check (char_length(trim(location)) between 2 and 160),
  salary_min numeric(12,2) check (salary_min is null or salary_min >= 0),
  salary_max numeric(12,2) check (salary_max is null or salary_max >= 0),
  requirements text,
  experience_required text,
  minimum_age integer check (minimum_age is null or minimum_age between 14 and 100),
  contact_phone text,
  contact_whatsapp text,
  application_url text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'filled')),
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vacancies_salary_range_check
    check (salary_min is null or salary_max is null or salary_max >= salary_min)
);

create index if not exists vacancies_status_created_idx
  on public.vacancies (status, created_at desc);
create index if not exists vacancies_expiry_idx
  on public.vacancies (expires_at);

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

-- Anyone may read published, unexpired vacancies. Drafts and filled jobs stay private.
drop policy if exists "Public can read active vacancies" on public.vacancies;
create policy "Public can read active vacancies"
on public.vacancies for select
to anon, authenticated
using (
  status = 'published'
  and (expires_at is null or expires_at > now())
);

-- Only users whose existing Sevana profile has role=admin can manage vacancies.
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
