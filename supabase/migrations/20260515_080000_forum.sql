-- Phase 8e: Forum by sector
-- Threaded discussions organised by sector slug.
-- RLS: read authenticated-only; write own rows only.

CREATE TABLE public.forum_threads (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sector      text        NOT NULL,
  title       text        NOT NULL CHECK (char_length(title) BETWEEN 5 AND 150),
  body        text        NOT NULL CHECK (char_length(body) BETWEEN 10 AND 5000),
  author_name text        NOT NULL,
  is_pinned   boolean     NOT NULL DEFAULT false,
  is_locked   boolean     NOT NULL DEFAULT false,
  reply_count integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_replies (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id   uuid        NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body        text        NOT NULL CHECK (char_length(body) BETWEEN 5 AND 2000),
  author_name text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX forum_threads_sector_idx  ON public.forum_threads (sector, created_at DESC);
CREATE INDEX forum_replies_thread_idx  ON public.forum_replies (thread_id, created_at ASC);

-- Maintain reply_count automatically
CREATE OR REPLACE FUNCTION public.forum_reply_count_inc()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.forum_threads
  SET reply_count = reply_count + 1, updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_forum_reply_count
  AFTER INSERT ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.forum_reply_count_inc();

-- RLS
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies  ENABLE ROW LEVEL SECURITY;

CREATE POLICY forum_threads_select ON public.forum_threads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY forum_threads_insert ON public.forum_threads
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY forum_threads_update ON public.forum_threads
  FOR UPDATE TO authenticated USING (user_id = auth.uid() AND NOT is_locked);

CREATE POLICY forum_replies_select ON public.forum_replies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY forum_replies_insert ON public.forum_replies
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY forum_replies_update ON public.forum_replies
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
