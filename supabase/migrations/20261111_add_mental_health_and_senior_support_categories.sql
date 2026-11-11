-- Add two Sevana hotline categories. Safe to run more than once.
insert into public.service_categories (name, slug, kind)
values
  ('Mental Health & Counselling', 'mental-health-counselling', 'hotline'),
  ('Senior Citizen Support', 'senior-citizen-support', 'hotline')
on conflict (slug) do update
set name = excluded.name,
    kind = excluded.kind;
