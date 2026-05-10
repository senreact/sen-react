-- Phase 6 PR-6e — Public directory view (column-level privacy).
--
-- `public.directory_profiles` is a read-only view over `user_profiles`
-- that exposes ONLY the D020-public columns: display_name, sector, region,
-- photo, summary, profile_type, and the org/ministry/partner name for the
-- relevant type. Phone, email, parental-consent fields, and verification
-- notes are intentionally omitted.
--
-- Only `verified` and `auto_verified` rows surface. `pending` and `rejected`
-- profiles stay invisible to the directory.
--
-- The view is granted SELECT to `anon` + `authenticated`, so the public
-- /annuaire page can read it without the user being signed in.
--
-- The view runs as its owner (postgres) by default — RLS on the
-- underlying `user_profiles` table does NOT fire when reading through
-- this view. That's intentional: `user_profiles` RLS allows only own-row
-- reads, which would defeat the purpose of a public directory. The
-- view's WHERE-clause (verification_status filter) + column projection
-- are the security boundary instead.
--
-- (Earlier revision used `security_invoker = true` which broke the
-- directory by making every reader see only their own row through the
-- view. Fixed 2026-05-11 during Phase 6 E2E validation.)
--
-- We do not expose user_id (Supabase auth UUID) externally — instead, the
-- view exposes a directory_slug derived from the user_id. The slug is
-- deterministic (first 8 hex chars of the UUID) so per-user URLs are
-- stable but the full UUID isn't leaked.

CREATE OR REPLACE VIEW public.directory_profiles AS
SELECT
  -- Derived public identifier (stable per user). Short enough for a URL,
  -- long enough to be non-trivial to guess.
  substr(user_id::text, 1, 8) AS directory_slug,
  profile_type,
  display_name,
  sector_slug,
  region,
  photo_url,
  summary,
  -- Per-type org name lifts into a single public field for the directory
  -- cards. The full per-type rows stay on user_profiles for the
  -- /mon-profil edit view.
  CASE profile_type
    WHEN 'organisation' THEN organisation_name
    WHEN 'government' THEN ministry_name
    WHEN 'partner' THEN partner_org_name
    ELSE NULL
  END AS organisation_label,
  verification_status,
  created_at
FROM public.user_profiles
WHERE verification_status IN ('verified', 'auto_verified');

GRANT SELECT ON public.directory_profiles TO anon, authenticated;

COMMENT ON VIEW public.directory_profiles IS
  'D020 public directory — display_name, sector, region, photo, summary, type-specific org name for verified profiles only. View runs as owner so RLS on the underlying user_profiles table does not block public reads (the WHERE-clause + column projection are the security boundary).';
