# Sevana Vacancies setup

The Vacancies feature is available to the public for browsing, while only Sevana admins can create and manage listings.

## 1. Apply the database migration

Open the Supabase project linked to Sevana, go to **SQL Editor**, and run:

`supabase/migrations/202611090001_create_vacancies.sql`

The migration creates the minimal `public.vacancies` table, an index, an updated-at trigger, and row-level security policies.

The policies use the existing Sevana admin convention:
- `public.profiles.id` matches `auth.users.id`
- `public.profiles.role = 'admin'` identifies administrators

## 2. Routes

- Public directory: `/vacancies`
- Public details: `/vacancies/[id]`
- Admin manager: `/admin/vacancies`

## 3. Listing workflow

1. Admin adds a job title, employer, location, job type and short description.
2. Contact number is optional.
3. New listings are saved as drafts.
4. Admin verifies the employer and details, then publishes the listing.
5. Admin can edit, unpublish, mark filled or delete a listing.

## 4. Security

- Public users can only read published vacancies.
- Only admins can read drafts and manage listings.
- RLS independently enforces admin-only insert, update and delete operations.
- The public pages remind applicants to verify employers and never pay advance fees.

## 5. Smoke test

1. Sign in with an existing Sevana admin account and open `/admin/vacancies`.
2. Create a draft and confirm it does not appear at `/vacancies`.
3. Publish it and confirm it appears publicly.
4. Open its details page and check the optional contact action.
5. Mark it filled and confirm it is no longer publicly visible.
6. Sign in as a non-admin and confirm admin management is blocked.
7. Confirm non-admin insert, update and delete attempts are rejected by RLS.

The GitHub migration file must be run in Supabase separately; pushing this branch does not execute SQL.
