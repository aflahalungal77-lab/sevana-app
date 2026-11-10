-- Add Hotels as a managed public directory.
-- Run this migration in Supabase SQL Editor before using Admin > Hotels.

insert into public.service_categories (name, slug, kind)
values ('Hotels', 'hotels', 'hotel')
on conflict (slug) do update
set name = excluded.name,
    kind = excluded.kind;
