-- Sevana: persistent category listing order.
-- Run this migration in Supabase SQL Editor before using drag-and-drop ordering.
alter table public.service_listings
  add column if not exists sort_order integer not null default 0;

-- Give existing records a stable initial order within each category.
with ranked as (
  select id, row_number() over (
    partition by category_id
    order by created_at asc, name asc, id asc
  ) as position
  from public.service_listings
)
update public.service_listings as listing
set sort_order = ranked.position
from ranked
where listing.id = ranked.id;

create index if not exists service_listings_category_active_idx
  on public.service_listings(category_id, is_active, sort_order);
