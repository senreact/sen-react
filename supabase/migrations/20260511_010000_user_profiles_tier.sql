-- Phase 7 PR-7b — Hidden `tier` column on user_profiles.
--
-- Per roadmap row 92 (Phase 7 yellow): "B2B differentiation tier flag —
-- build with a hidden `tier` field, zero current cost, future-proof".
-- At launch every profile renders identically. Later REACT may award
-- premium / verified-plus tiers and the UI picks up a badge slot
-- without a schema migration.
--
-- Free-text on purpose — Amadou's monetisation model isn't locked. A
-- CHECK constraint would force re-migrating every time we want a new
-- tier value. Nullable: most profiles have no tier and that's the
-- default-rendered state.

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS tier text;

CREATE INDEX IF NOT EXISTS user_profiles_tier_idx
  ON public.user_profiles (tier)
  WHERE tier IS NOT NULL;

-- Rebuild directory_profiles to surface the tier publicly. (View is
-- DROP/RECREATE because adding a column requires a recreate; this
-- keeps the existing security posture from PR-6e.)
DROP VIEW IF EXISTS public.directory_profiles;

CREATE VIEW public.directory_profiles AS
SELECT
  substr(user_id::text, 1, 8) AS directory_slug,
  profile_type,
  display_name,
  sector_slug,
  region,
  photo_url,
  summary,
  CASE profile_type
    WHEN 'organisation' THEN organisation_name
    WHEN 'government' THEN ministry_name
    WHEN 'partner' THEN partner_org_name
    ELSE NULL
  END AS organisation_label,
  verification_status,
  tier,
  created_at
FROM public.user_profiles
WHERE verification_status IN ('verified', 'auto_verified');

GRANT SELECT ON public.directory_profiles TO anon, authenticated;

COMMENT ON COLUMN public.user_profiles.tier IS
  'Optional differentiation badge (Phase 7 yellow row, roadmap row 92). Free-text — no CHECK constraint so the monetisation model can evolve without schema migration.';
COMMENT ON VIEW public.directory_profiles IS
  'D020 public directory — display_name, sector, region, photo, summary, type-specific org name, tier badge for verified profiles only. View runs as owner so RLS on user_profiles does not block public reads.';
