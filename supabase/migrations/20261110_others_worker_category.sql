-- Preserve the Others worker category and group any legacy worker categories without a parent.
-- Requires 20261109_local_worker_categorization.sql to have been applied first.

insert into public.worker_category_groups (name, slug, icon_path, sort_order)
values ('Others', 'others', '/emojis/others.png', 4)
on conflict (slug) do update
set name = excluded.name, icon_path = excluded.icon_path;

insert into public.service_categories (name, slug, kind, parent_group_id, icon_path, sort_order)
select 'Others', 'others', 'worker', groups.id, '/emojis/others.png', 90
from public.worker_category_groups groups
where groups.slug = 'others'
on conflict (slug) do update
set name = excluded.name,
    kind = excluded.kind,
    parent_group_id = excluded.parent_group_id,
    icon_path = excluded.icon_path;

update public.service_categories categories
set parent_group_id = groups.id
from public.worker_category_groups groups
where categories.kind = 'worker'
  and categories.parent_group_id is null
  and groups.slug = 'others';
