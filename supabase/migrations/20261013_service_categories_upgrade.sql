-- Sevana directory expansion: KSEB, goods transport and revised worker categories.
-- Safe to run more than once. Run in Supabase SQL Editor before deploying the new UI.

insert into public.service_categories (name, slug, kind) values
  ('KSEB', 'kseb', 'hotline'),
  ('Goods & Lorry', 'goods-lorry', 'transport'),
  ('Masonry Work', 'masonry-work', 'worker'),
  ('Carpenter', 'carpenter', 'worker'),
  ('Tiles & Marble Work', 'tiles-marble', 'worker'),
  ('Painters', 'painters', 'worker'),
  ('Welders', 'welders', 'worker'),
  ('Home Workers', 'home-workers', 'worker'),
  ('Garden Services', 'garden-services', 'worker'),
  ('Agricultural Works', 'agricultural-works', 'worker')
on conflict (slug) do update set name = excluded.name, kind = excluded.kind;

-- Keep existing listings available when old category names were used.
-- Construction -> masonry, painting -> painters, repair -> general home workers.
update public.service_listings listing
set category_id = target.id
from public.service_categories old_category
join public.service_categories target on target.slug = case old_category.slug
  when 'construction' then 'masonry-work'
  when 'painting' then 'painters'
  when 'repair' then 'home-workers'
end
where listing.category_id = old_category.id
  and old_category.slug in ('construction', 'painting', 'repair');

create index if not exists service_listings_category_active_idx
  on public.service_listings(category_id, is_active, sort_order);
