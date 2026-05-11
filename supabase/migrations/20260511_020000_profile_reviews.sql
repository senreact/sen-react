-- Phase 7 PR-7c — Reviews / ratings on directory profiles.
--
-- Simple V1 (per Tom 2026-05-11): any authenticated member can rate any
-- verified profile. One review per (subject, reviewer) pair — re-rating
-- replaces the previous review rather than stacking.
--
-- Per roadmap row 78: "reviews/ratings". No moderation queue at v1 —
-- admins can hide reviews via service-role (hidden_at column set).
-- Hidden reviews are filtered out of every public read but stay in the
-- table for audit.
--
-- DESIGN
-- - subject_user_id + reviewer_user_id both FK auth.users CASCADE.
-- - UNIQUE (subject, reviewer) — natural key for the upsert flow.
-- - CHECK (subject != reviewer) — no self-review.
-- - stars 1..5 CHECK-constrained.
-- - reviewer_display_name denormalised at insert/update time so the
--   public read path doesn't need to join across RLS-protected tables
--   (anon visitors couldn't otherwise see the reviewer's display_name).
--   Trade-off: stale name if reviewer renames after; acceptable for v1.
-- - hidden_at / hidden_by / hidden_reason — admin-set via service-role.
--   A trigger blocks non-service-role mutation of those columns.
--
-- RLS
-- - SELECT: anyone (anon + authenticated) can read non-hidden reviews
--   of verified profiles. The view directory_profile_reviews enforces
--   the verification filter; this RLS allows the underlying read.
-- - INSERT: authenticated; reviewer_user_id MUST equal auth.uid()
--   (RLS WITH CHECK). subject can be anyone except self (DB CHECK).
-- - UPDATE: own row only (reviewer_user_id = auth.uid()), and the
--   hidden_* columns must stay unchanged (trigger).
-- - DELETE: own row only.

CREATE TABLE IF NOT EXISTS public.profile_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  subject_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  reviewer_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  reviewer_display_name text NOT NULL,
  stars smallint NOT NULL,
  comment text,
  hidden_at timestamptz,
  hidden_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  hidden_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT profile_reviews_stars_check CHECK (stars BETWEEN 1 AND 5),
  CONSTRAINT profile_reviews_not_self CHECK (subject_user_id != reviewer_user_id),
  CONSTRAINT profile_reviews_pair_unique UNIQUE (subject_user_id, reviewer_user_id)
);

CREATE INDEX IF NOT EXISTS profile_reviews_subject_idx
  ON public.profile_reviews (subject_user_id, hidden_at, created_at DESC);

CREATE INDEX IF NOT EXISTS profile_reviews_reviewer_idx
  ON public.profile_reviews (reviewer_user_id);

CREATE OR REPLACE FUNCTION public.tg_profile_reviews_set_updated_at ()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profile_reviews_set_updated_at ON public.profile_reviews;

CREATE TRIGGER profile_reviews_set_updated_at
  BEFORE UPDATE ON public.profile_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_profile_reviews_set_updated_at ();

-- Lockdown: only service-role can change hidden_at / hidden_by /
-- hidden_reason. Mirrors the pattern from user_profiles in PR-6a.
CREATE OR REPLACE FUNCTION public.tg_profile_reviews_lock_hide ()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF current_user = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF NEW.hidden_at IS DISTINCT FROM OLD.hidden_at
    OR NEW.hidden_by IS DISTINCT FROM OLD.hidden_by
    OR NEW.hidden_reason IS DISTINCT FROM OLD.hidden_reason
    OR NEW.subject_user_id IS DISTINCT FROM OLD.subject_user_id
    OR NEW.reviewer_user_id IS DISTINCT FROM OLD.reviewer_user_id
  THEN
    RAISE EXCEPTION 'Hidden fields and identity columns are admin-only — change blocked.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profile_reviews_lock_hide ON public.profile_reviews;

CREATE TRIGGER profile_reviews_lock_hide
  BEFORE UPDATE ON public.profile_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_profile_reviews_lock_hide ();

ALTER TABLE public.profile_reviews ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can read non-hidden reviews. The directory page
-- joins these against directory_profiles (which already filters to
-- verified profiles), so reviews of pending / rejected profiles do
-- exist on the table but aren't surfaced.
CREATE POLICY profile_reviews_select_public
  ON public.profile_reviews
  FOR SELECT
  TO anon, authenticated
  USING (hidden_at IS NULL);

-- Insert: authenticated; the row MUST be authored by the requester.
CREATE POLICY profile_reviews_insert_own
  ON public.profile_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_user_id);

-- Update: own row only; trigger blocks hidden_*.
CREATE POLICY profile_reviews_update_own
  ON public.profile_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_user_id)
  WITH CHECK (auth.uid() = reviewer_user_id);

-- Delete: own row only.
CREATE POLICY profile_reviews_delete_own
  ON public.profile_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = reviewer_user_id);

COMMENT ON TABLE public.profile_reviews IS
  'Reviews / ratings on directory profiles (Phase 7). One review per (subject, reviewer) pair, 1-5 stars, optional comment. Admin can hide via service-role.';
