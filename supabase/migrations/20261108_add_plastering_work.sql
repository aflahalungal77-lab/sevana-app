-- Add Plastering Work under Construction (worker directory).
-- Safe to run repeatedly.
insert into public.service_categories (name, slug, kind)
values ('Plastering Work', 'plastering-work', 'worker')
on conflict (slug) do update
set name = excluded.name, kind = excluded.kind;
