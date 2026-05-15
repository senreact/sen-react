-- Migration: article_comments
-- Phase 8a — moderated comments on news articles.
--
-- Design notes:
--   - User-generated data lives in Supabase (not Payload), matching the
--     profile_reviews / directory_needs precedent.
--   - status: 'pending' on INSERT; admin approves/rejects via service-role.
--   - Two SELECT policies (OR'd) let anon see approved + let the author
--     see their own comment regardless of status.
--   - No user DELETE. Admins use service-role to hard-delete spam/abuse.
--   - Body length capped at 2 000 chars at DB level (same cap in the
--     Zod schema on the client to give an early error before the round-trip).

CREATE TABLE IF NOT EXISTS public.article_comments (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug  text        NOT NULL,
  body          text        NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  status        text        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'rejected')),
  moderated_by  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  moderated_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS article_comments_slug_status_idx
  ON public.article_comments (article_slug, status);
CREATE INDEX IF NOT EXISTS article_comments_author_idx
  ON public.article_comments (author_id);
CREATE INDEX IF NOT EXISTS article_comments_created_at_idx
  ON public.article_comments (created_at);

-- updated_at auto-maintenance
CREATE OR REPLACE FUNCTION public.tg_article_comments_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS article_comments_set_updated_at ON public.article_comments;
CREATE TRIGGER article_comments_set_updated_at
  BEFORE UPDATE ON public.article_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_article_comments_set_updated_at();

-- RLS
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- Anon + auth can read approved comments
CREATE POLICY "article_comments_select_approved"
  ON public.article_comments FOR SELECT
  USING (status = 'approved');

-- Authors can also see their own (pending / rejected)
CREATE POLICY "article_comments_select_own"
  ON public.article_comments FOR SELECT
  USING (auth.uid() IS NOT NULL AND author_id = auth.uid());

-- Authenticated members can post
CREATE POLICY "article_comments_insert_own"
  ON public.article_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());

-- Authors can edit their own comment while it is still pending
CREATE POLICY "article_comments_update_own_pending"
  ON public.article_comments FOR UPDATE
  USING (auth.uid() IS NOT NULL AND author_id = auth.uid() AND status = 'pending')
  WITH CHECK (author_id = auth.uid() AND status = 'pending');
