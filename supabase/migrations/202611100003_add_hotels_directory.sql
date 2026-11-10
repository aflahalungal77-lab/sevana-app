-- Add Hotels as a managed public directory.
-- Run this migration in Supabase SQL Editor before using Admin > Hotels.
-- Extend the existing category-kind constraint to allow hotel directories.

alter table public.service_categories
  drop constraint if exists service_categories_kind_check;

alter table public.service_categories
  add constraint service_categories_kind_check
  check (kind in ('hotline', 'transport', 'worker', 'hotel'));

insert into public.service_categories (name, slug, kind)
values ('Hotels', 'hotels', 'hotel')
on conflict (slug) do update
set name = excluded.name,
    kind = excluded.kind;
