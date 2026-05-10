-- Phase 4 — Saved opportunities (per roadmap row 75: "saved-opportunities for logged-in members").
--
-- Schema lives in `public` (Supabase's user-data schema). Payload-owned
-- tables stay in the `payload` schema; this is app-owned data.
--
-- The reference key is `opportunity_slug` (text), not the Payload UUID.
-- Slugs are stable across migrations / re-seeds; UUIDs are not. The
-- /mes-opportunites page joins by slug back to /api/opportunities.
--
-- RLS is mandatory per the cross-project posture (see
-- `memory/payload-nextjs-supabase-bootstrap.md` §1.5). Users can only
-- read / insert / delete their own rows.

CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  opportunity_slug text NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, opportunity_slug)
);

CREATE INDEX IF NOT EXISTS saved_opportunities_user_id_idx
  ON public.saved_opportunities (user_id, saved_at DESC);

ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- Users only see their own saves.
CREATE POLICY saved_opportunities_select_own
  ON public.saved_opportunities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users only insert as themselves.
CREATE POLICY saved_opportunities_insert_own
  ON public.saved_opportunities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users only delete their own saves.
CREATE POLICY saved_opportunities_delete_own
  ON public.saved_opportunities
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- No UPDATE policy — saved_at is set on insert and never mutated.
-- Re-saving an unsaved item is INSERT (or upsert), never UPDATE.
