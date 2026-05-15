-- Mentor profiles for mentor-mentee matching (Phase 8d)
-- One profile per authenticated user; mentees browse and contact directly (no in-platform inbox per D016).

CREATE TABLE public.mentor_profiles (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name   text NOT NULL,
  bio            text CHECK (char_length(bio) <= 500),
  sectors        text[] NOT NULL DEFAULT '{}',
  expertise      text[] NOT NULL DEFAULT '{}',
  region         text,
  contact_email  text,
  contact_phone  text,
  contact_wa     text,
  linkedin_url   text,
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentor_profiles_user_id_key UNIQUE (user_id)
);

CREATE INDEX mentor_profiles_sectors_idx ON public.mentor_profiles USING gin (sectors);
CREATE INDEX mentor_profiles_is_active_idx ON public.mentor_profiles (is_active);
CREATE INDEX mentor_profiles_created_at_idx ON public.mentor_profiles (created_at);

CREATE OR REPLACE FUNCTION tg_mentor_profiles_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION tg_mentor_profiles_set_updated_at();

ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;

-- Active mentors visible to all authenticated users
CREATE POLICY select_active ON public.mentor_profiles
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Own profile always visible (even if inactive)
CREATE POLICY select_own ON public.mentor_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Insert own profile only
CREATE POLICY insert_own ON public.mentor_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update own profile only
CREATE POLICY update_own ON public.mentor_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
