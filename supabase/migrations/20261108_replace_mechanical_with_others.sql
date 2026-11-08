-- Replace the three narrow mechanical worker categories with one general Others category.
-- Existing worker listings are reassigned before old category rows are removed.
insert into public.service_categories (name, slug, kind)
values ('Others', 'others', 'worker')
on conflict (slug) do update
set name = excluded.name, kind = excluded.kind;

update public.service_listings as listing
set category_id = target.id
from public.service_categories as old_category
cross join public.service_categories as target
where listing.category_id = old_category.id
  and old_category.slug in (
    'automobile-mechanical-works',
    'machinery-repair-maintenance',
    'mechanical-installation'
  )
  and target.slug = 'others'
  and target.kind = 'worker';

delete from public.service_categories
where slug in (
  'automobile-mechanical-works',
  'machinery-repair-maintenance',
  'mechanical-installation'
)
and kind = 'worker';
