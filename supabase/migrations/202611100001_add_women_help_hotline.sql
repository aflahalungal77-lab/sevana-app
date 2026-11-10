-- Add the Women Help & Safety hotline category.
-- Safe to run more than once. Run in Supabase SQL Editor.

insert into public.service_categories (name, slug, kind, icon_path, sort_order)
values ('Women Help & Safety', 'women', 'hotline', '/emojis/women.png', 10)
on conflict (slug) do update
set name = excluded.name,
    kind = excluded.kind,
    icon_path = excluded.icon_path;
