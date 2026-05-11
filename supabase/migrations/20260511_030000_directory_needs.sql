-- Phase 7 PR-7d — "Looking for X" board.
--
-- public.directory_needs is a free-form posting board where any
-- authenticated member can post what they're looking for (partner,
-- funding, mentor) or what they're offering. Reads are public; writes
-- gated to the author per RLS; admin moderation via service-role
-- (hidden_at).
--
-- Per roadmap row 78. Simple V1 — no responses / comments / chat
-- (D016: no in-platform inbox); members reach out directly via the
-- author's directory profile.
--
-- author_display_name is denormalised at insert time (same pattern as
-- profile_reviews) so anon visitors can read it without joining
-- across user_profiles RLS.

CREATE TABLE IF NOT EXISTS public.directory_needs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  author_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  author_display_name text NOT NULL,
  kind text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  sector_slug text,
  region text,
  status text NOT NULL DEFAULT 'active',
  hidden_at timestamptz,
  hidden_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  hidden_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- 5 buckets covering the common "what are you here for" use-cases.
  -- Free-text alternative ('other') keeps the closed set small but
  -- flexible.
  CONSTRAINT directory_needs_kind_check CHECK (
    kind IN (
      'looking-for-partner',
      'looking-for-funding',
      'looking-for-mentor',
      'offering-service',
      'other'
    )
  ),
  CONSTRAINT directory_needs_status_check CHECK (status IN ('active', 'closed'))
);

CREATE INDEX IF NOT EXISTS directory_needs_status_idx
  ON public.directory_needs (status, hidden_at, created_at DESC);

CREATE INDEX IF NOT EXISTS directory_needs_kind_idx
  ON public.directory_needs (kind);

CREATE INDEX IF NOT EXISTS directory_needs_author_idx
  ON public.directory_needs (author_user_id);

CREATE OR REPLACE FUNCTION public.tg_directory_needs_set_updated_at ()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS directory_needs_set_updated_at ON public.directory_needs;

CREATE TRIGGER directory_needs_set_updated_at
  BEFORE UPDATE ON public.directory_needs
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_directory_needs_set_updated_at ();

-- Lockdown: only service-role can change hidden_*.
CREATE OR REPLACE FUNCTION public.tg_directory_needs_lock_hide ()
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
    OR NEW.author_user_id IS DISTINCT FROM OLD.author_user_id
  THEN
    RAISE EXCEPTION 'Hidden fields and author identity are admin-only — change blocked.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS directory_needs_lock_hide ON public.directory_needs;

CREATE TRIGGER directory_needs_lock_hide
  BEFORE UPDATE ON public.directory_needs
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_directory_needs_lock_hide ();

ALTER TABLE public.directory_needs ENABLE ROW LEVEL SECURITY;

-- Public read: non-hidden rows surface to anon + authenticated.
CREATE POLICY directory_needs_select_public
  ON public.directory_needs
  FOR SELECT
  TO anon, authenticated
  USING (hidden_at IS NULL);

-- Insert: authenticated; author must be self.
CREATE POLICY directory_needs_insert_own
  ON public.directory_needs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_user_id);

-- Update own only; trigger guards hidden_*.
CREATE POLICY directory_needs_update_own
  ON public.directory_needs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_user_id)
  WITH CHECK (auth.uid() = author_user_id);

-- Delete own only.
CREATE POLICY directory_needs_delete_own
  ON public.directory_needs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_user_id);

COMMENT ON TABLE public.directory_needs IS
  '"Looking for X" board (Phase 7). Members post needs/offers; public read; admin hide via service-role.';
