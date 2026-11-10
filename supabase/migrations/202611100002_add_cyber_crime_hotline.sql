-- Add the Cyber Crime Help hotline category.
-- Safe to run more than once. Run in Supabase SQL Editor.

insert into public.service_categories (name, slug, kind, icon_path, sort_order)
values ('Cyber Crime Help', 'cyber-crime', 'hotline', 'shield-check', 11)
on conflict (slug) do update
set name = excluded.name,
    kind = excluded.kind,
    icon_path = excluded.icon_path;
