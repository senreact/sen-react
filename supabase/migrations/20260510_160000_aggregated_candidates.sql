-- ⚠️ PARKED — Phase 5 (auto-aggregation) is on hold per Amadou 2026-05-10.
-- REACT will add opportunities manually via the Payload admin. This table
-- is provisioned on prod Supabase but no scraper writes to it and no UI
-- reads it. Leave the migration in place so that when we revive the
-- pipeline the schema is already there. RLS denies all client access
-- (zero policies) so the table is fully inert from the app's perspective.
-- See docs/roadmap.md §"Phase 5 status".
--
-- Phase 5 PR-5a — Aggregation pipeline scaffold.
--
-- `public.aggregated_candidates` holds the raw + normalised output of every
-- scraper run (manual-trigger only at launch; cron later — Tom 2026-05-10).
-- The REACT admin reviews each row, approves or rejects, and on approval
-- the row is materialised into an `opportunities` collection record in
-- Payload (different schema, different store).
--
-- DESIGN NOTES:
-- - The table lives in `public` (Supabase user-data schema). Payload-owned
--   tables stay in the `payload` schema.
-- - There is NO RLS policy. RLS is enabled, no roles match → all client
--   reads/writes denied. Only the service role (used by the scraper jobs
--   and the REACT-admin server actions) can reach this table. No
--   end-user has any reason to query candidates directly.
-- - `(source_key, source_record_id)` is the dedup key. A scraper that
--   re-runs over the same source page must produce the same record id
--   for an existing opportunity, otherwise we'll insert duplicates. Each
--   scraper is responsible for picking a stable record id (URL hash,
--   slug from the source, ad code, etc.).
-- - `raw_payload` is the verbatim source data so we can re-normalise
--   later without re-scraping when the normaliser improves.
-- - `normalised_*` fields are nullable except title + summary + source_url
--   because the classifier may not always be confident enough to assign
--   sector / type / area; the REACT admin can fill them in at review time.
-- - `status` is the only thing that mutates after insert (plus decided_*
--   audit fields). updated_at is bumped via trigger.
-- - When status flips to 'published', `published_opportunity_slug` records
--   the slug that was created in the Payload Opportunities collection so
--   the admin UI can link straight to the live page.

CREATE TABLE IF NOT EXISTS public.aggregated_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  source_key text NOT NULL,
  source_record_id text NOT NULL,
  raw_payload jsonb NOT NULL,
  normalised_title text NOT NULL,
  normalised_summary text NOT NULL,
  normalised_body text,
  normalised_sector text,
  normalised_type text,
  normalised_area text,
  normalised_deadline date,
  normalised_amount_value bigint,
  normalised_amount_currency text,
  normalised_amount_display text,
  normalised_source_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  decided_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  decided_at timestamptz,
  decision_notes text,
  published_opportunity_slug text,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT aggregated_candidates_status_check CHECK (
    status IN ('pending', 'approved', 'rejected', 'published')
  ),
  CONSTRAINT aggregated_candidates_source_dedup UNIQUE (source_key, source_record_id)
);

CREATE INDEX IF NOT EXISTS aggregated_candidates_status_idx
  ON public.aggregated_candidates (status, scraped_at DESC);

CREATE INDEX IF NOT EXISTS aggregated_candidates_source_key_idx
  ON public.aggregated_candidates (source_key, scraped_at DESC);

-- Bump updated_at on every UPDATE so the admin can sort the review
-- queue by most-recently-touched.
CREATE OR REPLACE FUNCTION public.tg_aggregated_candidates_set_updated_at ()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS aggregated_candidates_set_updated_at ON public.aggregated_candidates;

CREATE TRIGGER aggregated_candidates_set_updated_at
  BEFORE UPDATE ON public.aggregated_candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_aggregated_candidates_set_updated_at ();

-- RLS enabled, no policies — denies all client (anon + authenticated)
-- access. Service role bypasses RLS by design; that's the only role
-- that should be touching this table.
ALTER TABLE public.aggregated_candidates ENABLE ROW LEVEL SECURITY;

-- Note: source_key is intentionally a free-text column rather than a
-- FK to a source-registry table. The registry lives in
-- packages/shared/src/aggregation-sources.ts (typed at compile time
-- across web + cms). A FK would require a sync table that drifts;
-- compile-time typing across the TS surface is stronger.
