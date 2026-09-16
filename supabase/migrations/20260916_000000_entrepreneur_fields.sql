-- Phase 6 addendum — Entrepreneur profile fields (backwards-compatible).
--
-- Adds two nullable columns to user_profiles so individual entrepreneurs
-- can record their formalisation status and physical address. Both columns
-- are nullable (no DEFAULT) so existing rows are untouched and the insert
-- at signup can omit them without error.
--
-- is_formal:
--   true  = secteur formel (registered legal entity)
--   false = secteur informel (unregistered / informal activity)
--   null  = not answered (the default for pre-existing and non-answering rows)
--
-- address:
--   Free-text physical address. Max length enforced at the app layer
--   (Zod 255 chars); no DB constraint to keep migrations lightweight.
--   Intentionally not added to the public directory_profiles view — it is
--   private to the authenticated user's own /mon-profil view.

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS is_formal boolean,
  ADD COLUMN IF NOT EXISTS address   text;

COMMENT ON COLUMN public.user_profiles.is_formal IS
  'Whether the entrepreneur operates in the formal sector (true), informal sector (false), or has not answered (null).';

COMMENT ON COLUMN public.user_profiles.address IS
  'Physical address of the entrepreneur or their business. Free-text, private (not in directory view).';
