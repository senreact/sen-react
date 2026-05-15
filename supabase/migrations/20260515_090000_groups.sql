-- Phase 8f: Community groups by region / sector / theme

CREATE TABLE public.community_groups (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text        NOT NULL CHECK (char_length(name) BETWEEN 3 AND 100),
  description text        CHECK (char_length(description) <= 500),
  group_type  text        NOT NULL CHECK (group_type IN ('region', 'sector', 'theme')),
  tag         text        NOT NULL CHECK (char_length(tag) <= 100),
  is_public   boolean     NOT NULL DEFAULT true,
  member_count integer    NOT NULL DEFAULT 1,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.group_members (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    uuid        NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text        NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  joined_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT group_members_group_user_key UNIQUE (group_id, user_id)
);

CREATE INDEX community_groups_type_idx ON public.community_groups (group_type, created_at DESC);
CREATE INDEX group_members_group_idx   ON public.group_members (group_id);
CREATE INDEX group_members_user_idx    ON public.group_members (user_id);

-- Maintain member_count automatically
CREATE OR REPLACE FUNCTION public.group_member_count_inc()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.community_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.group_member_count_dec()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.community_groups SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.group_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_group_member_count_inc
  AFTER INSERT ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.group_member_count_inc();

CREATE TRIGGER trg_group_member_count_dec
  AFTER DELETE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.group_member_count_dec();

-- RLS
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members    ENABLE ROW LEVEL SECURITY;

CREATE POLICY community_groups_select ON public.community_groups
  FOR SELECT TO authenticated USING (is_public = true OR created_by = auth.uid());

CREATE POLICY community_groups_insert ON public.community_groups
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY community_groups_update ON public.community_groups
  FOR UPDATE TO authenticated USING (created_by = auth.uid());

CREATE POLICY group_members_select ON public.group_members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY group_members_insert ON public.group_members
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY group_members_delete ON public.group_members
  FOR DELETE TO authenticated USING (user_id = auth.uid());
