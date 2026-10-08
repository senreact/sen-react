-- Entrepreneur compulsory fields — project name and age (backwards-compatible).
--
-- Both columns are nullable so existing rows are unaffected and pre-existing
-- accounts don't fail. Validation (required at signup) is enforced at the
-- app layer (Zod) rather than as NOT NULL DB constraints, consistent with
-- the rest of the user_profiles design.
--
-- project_name: the name of the entrepreneur's business project (free text,
--   max 200 chars enforced at app layer). Deliberately separate from
--   display_name (the person's own name) and summary (free bio text).
--
-- age: the entrepreneur's age in years at time of signup (smallint — fine
--   for the 15–120 plausible range). Static at insert time; not a computed
--   field. The existing is_minor boolean (for the parental-consent flow) is
--   kept for backwards compat; the signup action auto-sets it from age < 18.

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS project_name text,
  ADD COLUMN IF NOT EXISTS age         smallint;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_age_range CHECK (age IS NULL OR (age >= 15 AND age <= 120));

COMMENT ON COLUMN public.user_profiles.project_name IS
  'Name of the entrepreneur''s business project. Collected at signup, free text.';

COMMENT ON COLUMN public.user_profiles.age IS
  'Age in years at time of signup. Nullable — required at signup for entrepreneurs via app validation only.';
