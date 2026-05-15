-- Phase 8g: Community polls / surveys

CREATE TABLE public.community_polls (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL CHECK (char_length(title) BETWEEN 5 AND 200),
  question    text        NOT NULL CHECK (char_length(question) BETWEEN 10 AND 500),
  options     text[]      NOT NULL CHECK (array_length(options, 1) BETWEEN 2 AND 8),
  closes_at   timestamptz,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.poll_votes (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id      uuid        NOT NULL REFERENCES public.community_polls(id) ON DELETE CASCADE,
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_index integer     NOT NULL CHECK (option_index >= 0),
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT poll_votes_poll_user_key UNIQUE (poll_id, user_id)
);

CREATE INDEX community_polls_active_idx ON public.community_polls (is_active, created_at DESC);
CREATE INDEX poll_votes_poll_idx        ON public.poll_votes (poll_id);

-- RLS
ALTER TABLE public.community_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes       ENABLE ROW LEVEL SECURITY;

CREATE POLICY community_polls_select ON public.community_polls
  FOR SELECT TO authenticated USING (is_active = true OR created_by = auth.uid());

CREATE POLICY community_polls_insert ON public.community_polls
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY poll_votes_select ON public.poll_votes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY poll_votes_insert ON public.poll_votes
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
