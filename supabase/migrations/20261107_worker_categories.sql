-- Add new local worker categories for laterite stone quarrying and mechanical engineering.
-- Safe to run repeatedly; existing worker listings and categories are preserved.

insert into public.service_categories (name, slug, kind) values
  ('Laterite Stone Quarrying', 'laterite-stone-quarrying', 'worker'),
  ('Automobile Mechanical Works', 'automobile-mechanical-works', 'worker'),
  ('Machinery Repair & Maintenance', 'machinery-repair-maintenance', 'worker'),
  ('Mechanical Installation', 'mechanical-installation', 'worker')
on conflict (slug) do update
set name = excluded.name, kind = excluded.kind;

create index if not exists service_listings_category_active_idx
  on public.service_listings(category_id, is_active, sort_order);
