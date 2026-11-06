-- Extend Sevana Members to include Panchayat President and Vice President.
-- Existing records remain Ward Members.

alter table public.members
  add column if not exists designation text not null default 'Ward Member';

alter table public.members
  alter column ward_number drop not null;

alter table public.members
  drop constraint if exists members_designation_check,
  drop constraint if exists members_ward_designation_check;

alter table public.members
  add constraint members_designation_check
    check (designation in ('President', 'Vice President', 'Ward Member')),
  add constraint members_ward_designation_check
    check (
      (designation = 'Ward Member' and ward_number is not null and ward_number between 1 and 999)
      or (designation in ('President', 'Vice President') and ward_number is null)
    );

create index if not exists members_designation_directory_idx
  on public.members (is_active, designation, ward_number, name);
