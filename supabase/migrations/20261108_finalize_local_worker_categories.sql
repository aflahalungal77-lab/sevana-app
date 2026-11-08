-- Finalize the compact Local Workers category structure.
-- Existing "Others" listings are carried into Mechanical Engineering because
-- the previous Others leaf was introduced for the mechanical worker records.
-- Existing painter listings are preserved under the combined painting category.

insert into public.service_categories (name, slug, kind)
values
  ('Painting & Wood Polishing', 'painting-wood-polishing', 'worker'),
  ('Curtain & Carpet Works', 'curtain-carpet-works', 'worker'),
  ('Mechanical Engineering', 'mechanical-engineering', 'worker'),
  ('Videography & Editing', 'videography-editing', 'worker')
on conflict (slug) do update
set name = excluded.name, kind = excluded.kind;

update public.service_categories
set name = 'Agricultural Workers'
where slug = 'agricultural-works' and kind = 'worker';

update public.service_listings as listing
set category_id = target.id
from public.service_categories as old_category
cross join public.service_categories as target
where listing.category_id = old_category.id
  and old_category.slug = 'painters'
  and target.slug = 'painting-wood-polishing'
  and target.kind = 'worker';

update public.service_listings as listing
set category_id = target.id
from public.service_categories as old_category
cross join public.service_categories as target
where listing.category_id = old_category.id
  and old_category.slug = 'others'
  and target.slug = 'mechanical-engineering'
  and target.kind = 'worker';

delete from public.service_categories
where slug in ('painters', 'others')
  and kind = 'worker';

-- Legacy Home Workers records are intentionally retained in the database,
-- but the category is no longer shown in the public or admin category menus.
