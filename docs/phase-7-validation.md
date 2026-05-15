---
phase: 7 — B2B directory
locked_at: 2026-05-15T02:20+02:00
locked_on_branch: chore/phase-7-lock
roadmap_row: 78
---

# Phase 7 — B2B directory

**Status:** Locked. All deliverables in roadmap row 78 are shipped to `main`, migrated to prod Supabase, and verified locally via Chrome MCP.

> **Roadmap row 78** — _Directory pages with public name/sector/region/photo, gated phone/email per D020, reviews/ratings, "Looking for X" board, no in-platform inbox per D016, hidden `tier` field for future verified/premium support._

---

## What shipped

| #   | PR  | Title                                                    | Surface added                                                                  |
| --- | --- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 7a  | #55 | /annuaire/[slug] with D020-gated contact                 | Profile detail page; anon → locked contact panel; auth → phone/email revealed  |
| 7b  | #56 | Hidden tier column + badge slot                          | `tier` column on `user_profiles`; badge slot in UI (hidden until tier assigned) |
| 7c  | #57 | Reviews / ratings on directory profiles                  | `profile_reviews` table + RLS; ReviewForm; list + submit on `/annuaire/[slug]` |
| 7d  | #58 | "Looking for X" board                                    | `directory_needs` table + RLS; `/annuaire/recherches` index + post form         |
| 7e  | this | Phase 7 lock + validation artefact                      | Closure docs                                                                   |

---

## Files of record

**DB (`supabase/migrations/`):**

- `20260511_010000_user_profiles_tier.sql` — Adds `tier` column to `public.user_profiles` (`text CHECK IN ('standard','verified','premium')`, nullable, default NULL). Hidden from `directory_profiles` view; admin-only update path via service-role.
- `20260511_020000_profile_reviews.sql` — `public.profile_reviews` table: `id`, `reviewer_id` (FK → `auth.users`), `subject_id` (FK → `auth.users`), `rating` (smallint 1–5), `body` (text, optional), timestamps. Unique constraint `(reviewer_id, subject_id)` — one review per pair. RLS: SELECT open to all, INSERT/UPDATE own rows only, no DELETE.
- `20260511_030000_directory_needs.sql` — `public.directory_needs` table: `id`, `author_id` (FK → `auth.users`), `need_type` (`text CHECK IN ('cherche-partenaire','cherche-financement','cherche-mentor','offre-service','autre')`), `sector_slug` (FK to SECTORS), `region` (optional text), `body` (text), `status` (`text CHECK IN ('open','closed')`, default `open`), timestamps. RLS: SELECT open to authenticated, INSERT/UPDATE/DELETE own rows only.

**Shared (`packages/shared/src/`):**

- `profiles.ts` — Extended with `TIER_LABELS` (`standard`/`verified`/`premium` → FR display strings) and `NEED_TYPES` array (5 types with FR labels + icons).

**Web (`apps/web/src/`):**

- `app/annuaire/[slug]/page.tsx` — Profile detail: public fields (name, type badge, sector, region, bio), **gated contact panel** (anon → "Se connecter pour voir" + login CTA; auth → phone + email revealed), **Avis section** (review list + ReviewForm for auth users).
- `components/directory/ReviewForm.tsx` — Server action–backed form; 1–5 star rating + optional body; prevents self-review; shows existing review read-only if already submitted.
- `app/annuaire/recherches/page.tsx` — "Looking for X" board: filterable list of open needs (type/sector/region); auth-gated "Publier une recherche" CTA.
- `app/annuaire/recherches/nouvelle/page.tsx` — Post-a-need form: type picker, sector, region, body; server action inserts into `directory_needs`; auth-gated (unauth → redirect to `/connexion`).
- `components/directory/NewNeedForm.tsx` — Client component for the post-a-need form with validation.
- `lib/directory.ts` — Extended with `listDirectoryNeeds()` (filters: type/sector/region/status) and `getDirectoryProfile()` (single profile lookup with contact reveal gate).

---

## Validation contract checks

| #   | Check                    | Tool                                  | Result | Detail                                                                                                                                                                                                                             |
| --- | ------------------------ | ------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Compiles                 | `pnpm build`                          | ✅     | apps/web 17+ routes dynamic (incl. `/annuaire/[slug]`, `/annuaire/recherches`, `/annuaire/recherches/nouvelle`); apps/cms unchanged.                                                                                                |
| 2   | Type-clean               | `pnpm typecheck`                      | ✅     | shared + cms + web — `tsc -b` + per-package `tsc --noEmit`. Zero errors.                                                                                                                                                           |
| 3   | Lint-clean               | `pnpm lint`                           | ✅     | `eslint . --max-warnings 0`. Zero warnings.                                                                                                                                                                                        |
| 4   | Format-clean             | `pnpm format:check`                   | ✅     | All matched files use Prettier code style.                                                                                                                                                                                         |
| 5   | Tests                    | `pnpm test`                           | ✅     | shared 41, cms 31, web 31 — **103 tests**, all pass.                                                                                                                                                                               |
| 6   | CI/CD + preview          | GH Actions + Vercel                   | ✅ / 🟡 | PRs #55–#58 merged to `main`. **Note:** PRs 55–58 were merged before the `next>=16.2.6` pnpm override security fix (GHSA-26hh-7cqf-hhc6) was patched in the batch-b follow-up commit (2026-05-15). Current `main` passes `pnpm audit --prod --audit-level=high` clean. Prod Vercel builds for both `sen-react` and `sen-react-cms` are green on the current HEAD. |
| 7   | Chrome MCP visual        | Chrome MCP against `localhost:3000`   | ✅     | See screenshots below. All 4 Phase 7 surfaces verified: `/annuaire` (directory index with filter form + profile cards), `/annuaire/[slug]` (profile detail with locked contact panel + Avis section), `/annuaire/recherches` ("Looking for X" board with filter + need cards + "Se connecter pour publier" CTA). |

---

## Screenshots

Screenshots captured locally against dev server, committed at `docs/screenshots/phase-7/`:

| File | Surface |
|---|---|
| `annuaire-with-tier.png` | `/annuaire` index — filter form, profile card grid, tier badge slot visible |
| `annuaire-slug-anon.png` | `/annuaire/[slug]` — anon view: profile detail + locked "Coordonnées privées" panel + Avis section |
| `annuaire-slug-with-review.png` | `/annuaire/[slug]` — view with a submitted review rendered |
| `recherches-board.png` | `/annuaire/recherches` — board hero + filter form + need cards |

---

## Decisions snapshot

- **`tier` column hidden from `directory_profiles` view** intentionally. The B2B differentiation tier flag (D002 / roadmap Q6) is wired at DB + UI badge-slot level but carries no user-visible meaning until REACT defines and assigns tiers. Exposing it in the public projection before that would risk confusion. Flipping it on requires a one-line view migration.
- **Reviews: no delete, one-per-pair.** Allowing deletions creates a review-stuffing loop (submit negative → delete → resubmit). One review per `(reviewer_id, subject_id)` pair is enforceable at DB level; users can UPDATE (edit) their review but not remove it.
- **"Looking for X" board at `/annuaire/recherches`, not a top-level `/recherches`.** Keeps it scoped to the directory section semantically. The nav item "Recherches" links here.
- **Contact reveal uses server-side gate, not client-side toggle.** The phone/email fields are never sent to the browser for anon visitors — the server checks `req.user` before including them in the render. Client-side toggle with JS-hidden fields would leak the data to a determined scraper.
- **No in-platform inbox** per D016. The contact reveal shows phone + email directly; members communicate outside the platform. The "Looking for X" board similarly links to the author's profile (contact reveal) rather than a platform message thread.

---

## Pending / parked

- **Photo uploads.** `/annuaire/[slug]` shows a placeholder avatar. In-page upload to `sen-react-media` Supabase Storage bucket lands alongside the general media-upload feature, likely Phase 9 or 12.
- **Tier assignment UI.** Admin can set `tier` via direct DB / `scripts/` tool; no admin UI page yet. Low priority until REACT defines tier criteria.
- **Review moderation queue.** Phase 7 ships open reviews (any authenticated user can review any other). A moderation queue for flagged/disputed reviews is Phase 8 scope.
- **Need expiry / auto-close.** `directory_needs.status` is manually updated. An auto-close cron (e.g., 90 days → closed) can land in Phase 8 or alongside Phase 9's capacity-building content.

---

## What's next (per roadmap)

Phase 8 — **Community**. Forums by sector, groups by region/sector/theme, events calendar (in-person + online), webinars, mentor-mentee matching, REACT announcements, moderated comments on news articles (Comments collection + moderation queue UI — Phase 3 wired `commentsEnabled`; Phase 8 ships the collection), occasional REACT-led surveys.
