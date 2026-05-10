-- Phase 6 PR-6a — Member profile shell.
--
-- `public.user_profiles` is 1:1 with `auth.users` (PK = user_id). It holds
-- the editorial-side data REACT cares about — the profile type, the
-- public-facing fields (name / sector / region / photo / summary), the
-- gated contact (phone / email), the type-specific extras (organisation
-- name, ministry name, partner org, etc.) and the verification audit
-- (manual REACT-admin approval for org / government / partner per D020).
--
-- 5 profile types per roadmap row 77 (D020):
--   1. `entrepreneur`   — individual founder / member of the public
--   2. `organisation`   — NGO, association, cooperative, private company
--   3. `government`     — ministry, public agency, state-controlled entity
--   4. `partner`        — explicit REACT partner (institutional or otherwise)
--   5. `admin`          — REACT staff
--
-- TYPE-SPECIFIC FIELDS are columns on the same row (not separate tables).
-- Cost: nullability instead of NOT NULL constraints; CHECK constraint is
-- intentionally loose so editor errors degrade gracefully (an entrepreneur
-- that accidentally has an organisation_name set just renders the extra
-- field — better than a hard write failure). UI / Zod validation enforces
-- the "right fields per type" contract at the input boundary.
--
-- VERIFICATION (per D020):
--   - entrepreneur + admin → `auto_verified` on insert (entrepreneurs are
--     self-attested public-facing; admin profiles are seeded by REACT).
--   - organisation, government, partner → `pending` on insert; REACT admin
--     reviews and flips to `verified` or `rejected`.
--   - Only service-role (Payload admin) may mutate the verification
--     columns post-insert; user UPDATE policy explicitly blocks them via
--     the `WITH CHECK` clause referencing OLD via a trigger.
--
-- PARENTAL CONSENT (per roadmap row 91, Phase 6 yellow):
--   - 15–17 year olds: `is_minor = true`, `parental_consent = true`,
--     optional `parent_email`. Design intent confirmed with Amadou at
--     handoff; UI flow lives in PR-6b.
--
-- RLS posture for this PR:
--   - SELECT own row only.
--   - INSERT own row only.
--   - UPDATE own row only on non-verification fields (trigger enforces).
--   - DELETE — handled implicitly by ON DELETE CASCADE from auth.users.
--   - Public profile pages (other people's name/sector/region/photo)
--     come in PR-6e via a server-side view that the web app reads with
--     the anon key under separate column-level rules. THIS table stays
--     own-row-only.

CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,

  -- Type discriminator + verification
  profile_type text NOT NULL,
  verification_status text NOT NULL DEFAULT 'pending',
  verified_at timestamptz,
  verified_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  verification_notes text,

  -- Public fields per D020 (visible on the B2B directory + community
  -- surfaces without auth gating)
  display_name text NOT NULL,
  sector_slug text,
  region text,
  photo_url text,
  summary text,

  -- Gated contact per D020 — stored here, surfaced only to authenticated
  -- members via the column-level view that lands in PR-6e
  email_public boolean NOT NULL DEFAULT false,
  phone text,

  -- organisation / partner specific
  organisation_name text,
  organisation_legal_form text,
  organisation_size text,

  -- government specific
  government_role text,
  ministry_name text,

  -- partner specific (separate field so partner orgs can be searched
  -- distinct from regular organisations later)
  partner_org_name text,

  -- Entrepreneur 15-17 yo parental-consent affordance per row 91
  is_minor boolean NOT NULL DEFAULT false,
  parental_consent boolean,
  parent_email text,

  -- Audit
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Constraint: profile_type must be one of the 5 documented values.
  CONSTRAINT user_profiles_profile_type_check CHECK (
    profile_type IN ('entrepreneur', 'organisation', 'government', 'partner', 'admin')
  ),
  -- Constraint: verification_status closed set.
  -- `auto_verified` = entrepreneur / admin path (self-attested, no manual
  -- review). `pending` / `verified` / `rejected` = manual-review path.
  CONSTRAINT user_profiles_verification_check CHECK (
    verification_status IN ('pending', 'verified', 'rejected', 'auto_verified')
  ),
  -- Minor without parental_consent = invalid state. We allow NULL while
  -- the user is mid-signup (insert can defer), but once minor is true,
  -- parental_consent must be set to true before verification flips.
  -- Enforced as a soft check; UI requires it pre-submission.
  CONSTRAINT user_profiles_minor_consent CHECK (
    is_minor = false OR (parental_consent IS NULL OR parental_consent = true)
  )
);

CREATE INDEX IF NOT EXISTS user_profiles_profile_type_idx
  ON public.user_profiles (profile_type);

CREATE INDEX IF NOT EXISTS user_profiles_verification_status_idx
  ON public.user_profiles (verification_status);

CREATE INDEX IF NOT EXISTS user_profiles_sector_slug_idx
  ON public.user_profiles (sector_slug)
  WHERE sector_slug IS NOT NULL;

-- Bump updated_at on every UPDATE.
CREATE OR REPLACE FUNCTION public.tg_user_profiles_set_updated_at ()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_profiles_set_updated_at ON public.user_profiles;

CREATE TRIGGER user_profiles_set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_user_profiles_set_updated_at ();

-- Verification-fields lockdown trigger. Authenticated users can update
-- their own row but the verification audit fields are admin-only. The
-- service-role key bypasses RLS entirely, so this trigger only fires for
-- non-service-role updates. If a user (or compromised anon token) tries
-- to flip verification_status to 'verified', we reject the write.
--
-- The trigger reads pg_has_role to detect service_role. If that role is
-- active, we let any change through. Otherwise, the listed columns must
-- be unchanged.
CREATE OR REPLACE FUNCTION public.tg_user_profiles_lock_verification ()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF current_user = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status
    OR NEW.verified_at IS DISTINCT FROM OLD.verified_at
    OR NEW.verified_by IS DISTINCT FROM OLD.verified_by
    OR NEW.verification_notes IS DISTINCT FROM OLD.verification_notes
    OR NEW.profile_type IS DISTINCT FROM OLD.profile_type
  THEN
    RAISE EXCEPTION 'Verification fields and profile_type are admin-only — change blocked.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_profiles_lock_verification ON public.user_profiles;

CREATE TRIGGER user_profiles_lock_verification
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_user_profiles_lock_verification ();

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users see their own row.
CREATE POLICY user_profiles_select_own
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users insert their own row at signup. Verification status defaults
-- depend on profile_type (the app sets `auto_verified` for entrepreneur
-- / admin paths and `pending` for others); the trigger above prevents
-- subsequent tampering. Anonymous role cannot insert.
CREATE POLICY user_profiles_insert_own
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users update their own row; the trigger guards verification fields.
CREATE POLICY user_profiles_update_own
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- No DELETE policy — deletion happens via auth.users CASCADE.
-- Anon role has zero policies → can't reach the table at all.

COMMENT ON TABLE public.user_profiles IS
  'Member profile shell (Phase 6). 1:1 with auth.users. RLS: own-row only. Verification fields admin-only via trigger.';
