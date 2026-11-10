-- Add Restaurants to the combined Hotels & Restaurants directory.
-- Both categories share the existing "hotel" kind; their slugs power public filters.

insert into public.service_categories (name, slug, kind)
values
  ('Hotels', 'hotels', 'hotel'),
  ('Restaurants', 'restaurants', 'hotel')
on conflict (slug) do update
set name = excluded.name,
    kind = excluded.kind;
