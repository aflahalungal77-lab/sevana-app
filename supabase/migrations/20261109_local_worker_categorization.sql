-- Dynamic Local Workers categorization.
-- Parent groups live separately; leaf service_categories remain listing targets.
create table if not exists public.worker_category_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon_path text not null default '/emojis/others.png',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.service_categories
  add column if not exists parent_group_id uuid references public.worker_category_groups(id) on delete set null,
  add column if not exists icon_path text,
  add column if not exists sort_order integer not null default 0;

create index if not exists worker_category_groups_sort_idx
  on public.worker_category_groups(sort_order, name);
create index if not exists service_categories_parent_group_idx
  on public.service_categories(parent_group_id, sort_order);

insert into public.worker_category_groups (name, slug, icon_path, sort_order)
values
  ('Construction', 'construction', '/emojis/construction.png', 1),
  ('Home Maintenance', 'home-maintenance', '/emojis/home-maintenance.png', 2),
  ('Agriculture & Farming', 'agriculture-farming', '/emojis/agricultural-works.png', 3),
  ('Others', 'others', '/emojis/others.png', 4)
on conflict (slug) do update
set name = excluded.name, icon_path = excluded.icon_path;

update public.service_categories c
set parent_group_id = g.id
from public.worker_category_groups g
where c.kind = 'worker'
and (
  (c.slug in ('masonry-work','carpenter','tiles-marble','plastering-work','laterite-stone-quarrying') and g.slug='construction')
  or (c.slug in ('plumbing-wiring','painting-wood-polishing','welders','curtain-carpet-works','garden-services') and g.slug='home-maintenance')
  or (c.slug='agricultural-works' and g.slug='agriculture-farming')
  or (c.slug in ('mechanical-engineering','videography-editing') and g.slug='others')
);

update public.service_categories
set icon_path = '/emojis/' || slug || '.png'
where kind = 'worker' and (icon_path is null or icon_path = '');

alter table public.worker_category_groups enable row level security;

drop policy if exists "Public can read worker category groups" on public.worker_category_groups;
create policy "Public can read worker category groups"
on public.worker_category_groups for select
using (true);

drop policy if exists "Admins manage worker category groups" on public.worker_category_groups;
create policy "Admins manage worker category groups"
on public.worker_category_groups for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins update worker categories" on public.service_categories;
create policy "Admins update worker categories"
on public.service_categories for all
to authenticated
using (kind = 'worker' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (kind = 'worker' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Existing service_categories read policies are retained. Add an explicit public
-- read policy for worker categories so the public directory can load dynamic data.
drop policy if exists "Public can read worker service categories" on public.service_categories;
create policy "Public can read worker service categories"
on public.service_categories for select
using (kind = 'worker');


-- Publicly readable icon assets; uploads are restricted to signed-in admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('worker-category-icons', 'worker-category-icons', true, 2097152, array['image/png','image/jpeg','image/webp'])
on conflict (id) do update
set public = true, file_size_limit = 2097152,
    allowed_mime_types = array['image/png','image/jpeg','image/webp'];

drop policy if exists "Admins upload worker category icons" on storage.objects;
create policy "Admins upload worker category icons"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'worker-category-icons'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "Admins update worker category icons" on storage.objects;
create policy "Admins update worker category icons"
on storage.objects for update to authenticated
using (
  bucket_id = 'worker-category-icons'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
)
with check (
  bucket_id = 'worker-category-icons'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "Admins delete worker category icons" on storage.objects;
create policy "Admins delete worker category icons"
on storage.objects for delete to authenticated
using (
  bucket_id = 'worker-category-icons'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
