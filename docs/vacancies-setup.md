# Sevana Vacancies setup

The Vacancies feature is added behind the existing Sevana admin authentication.

## 1. Apply the database migration

Open the Supabase project linked to Sevana, go to **SQL Editor**, and run:

`supabase/migrations/202611090001_create_vacancies.sql`

The migration creates `public.vacancies`, indexes, an updated-at trigger, and RLS policies.

The policies assume the existing Sevana admin convention:
- `public.profiles.id` matches `auth.users.id`
- `public.profiles.role = 'admin'` identifies administrators

Check that the existing admin profile is present and has the `admin` role before testing the admin page.

## 2. Routes

- Public directory: `/vacancies`
- Public details: `/vacancies/[id]`
- Admin manager: `/admin/vacancies`

The admin route checks the signed-in user's profile role on the server. RLS independently enforces admin-only create, update, and delete operations.

## 3. Security behavior

- Anonymous and ordinary signed-in users can only read published, unexpired vacancies.
- Draft and filled listings are not public.
- Only users with the existing admin profile role can read all listings or create, update, and delete them.
- Expired published listings are excluded from public queries.
- The public pages display an anti-scam reminder. Admins should verify employers and listing details before publishing.

## 4. Smoke test

1. Sign in with an existing Sevana admin account and open `/admin/vacancies`.
2. Create a draft; confirm it does not appear at `/vacancies`.
3. Publish it; confirm it appears publicly and its details page loads.
4. Set an expiry time in the past; confirm it disappears from the public list.
5. Mark it filled; confirm the public details route no longer displays it.
6. Sign out or use a non-admin account and confirm the admin route redirects or shows access restricted.
7. From an anon/non-admin client, attempt INSERT, UPDATE, and DELETE; each must be rejected by RLS.

Apply the SQL migration before testing the UI. The GitHub change does not automatically execute SQL in Supabase.
