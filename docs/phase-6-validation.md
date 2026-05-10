---
phase: 6 — Member accounts
locked_at: 2026-05-11T00:30+02:00
locked_on_branch: chore/phase-6-lock
roadmap_row: 77
---

# Phase 6 — Member accounts

**Status:** Locked. All deliverables in roadmap row 77 are shipped to `main`, migrated to prod Supabase, and verified locally + via prod CMS API. Final prod **web** redeploy is queued behind the Vercel daily-deploy budget (resets ~03:00 SAST) — see "Operational notes" below.

> **Roadmap row 77** — _5 profile types per D020 (Individual entrepreneur · Organisation · Government/ministry · Partner · Admin), email+password, default field set per type, **manual REACT-admin verification** for org/institution/partner per D020, **default privacy rules** per D020._

---

## What shipped

| #   | PR  | Title                                          | Surface added                                                |
| --- | --- | ---------------------------------------------- | ------------------------------------------------------------ |
| 6a  | #49 | user_profiles table + profile-type enum + RLS  | DB schema only                                               |
| 6b  | #50 | signup form per profile type + parental consent | `/inscription` extended; service-role profile-insert         |
| 6c  | #51 | /mon-profil view + edit                        | Auth-gated profile-edit page + AuthNav link                  |
| 6d  | #52 | admin verification queue at /admin/profils     | REACT-admin approve/reject queue + `promote-admin.mjs`       |
| 6e  | #53 | public directory column-level view + /annuaire | D020-projected SQL view + public listing page + nav item     |
| 6f  | this | Phase 6 lock + validation artefact            | Closure docs                                                 |

---

## Files of record

**DB (`supabase/migrations/`):**

- `20260510_220000_user_profiles.sql` — 24-column `public.user_profiles` table keyed by `user_id` (= `auth.users.id` CASCADE). 5-type CHECK constraint; 4-status CHECK constraint; minor-without-consent CHECK; 3 indexes (profile_type, verification_status, sector_slug); `updated_at` trigger; **verification-fields lockdown trigger** preventing non-service-role mutation of `verification_status` / `verified_at` / `verified_by` / `verification_notes` / `profile_type`. RLS enabled with 3 policies: SELECT / INSERT / UPDATE own row only.
- `20260511_000000_directory_profiles_view.sql` — `public.directory_profiles` projection over `user_profiles`. Only verified + auto_verified rows, only D020-public columns, `user_id` → 8-char `directory_slug`. `security_invoker = true`. `GRANT SELECT TO anon, authenticated`.

**Shared (`packages/shared/src/`):**

- `profiles.ts` — `PROFILE_TYPES` (5 entries with FR/EN labels + manual-verification flag), `VERIFICATION_STATUSES` (4 closed values), `ENTREPRENEUR_MIN_AGE = 15`, `PARENTAL_CONSENT_MAX_AGE = 17`, helpers (`isProfileTypeSlug`, `initialVerificationStatus`, `isProfilePubliclyVisible`, `getProfileType`).
- `profiles.test.ts` — 13 contract tests covering the enums + helpers.
- `cms-globals.ts` — `DEFAULT_SITE_HEADER` extended with `Annuaire → /annuaire`.

**Web (`apps/web/`):**

- `src/lib/auth.ts` — `SignUpSchema` (discriminated union over 4 type-specific schemas + `superRefine` for minor/consent rule), `ProfileUpdateSchema` (single nullable shape for /mon-profil edits), shared `checkboxFlag` transform.
- `src/lib/admin.ts` — `requireAdminProfile()` gate. Unauth → /connexion; non-admin → silent /.
- `src/lib/directory.ts` — `listDirectoryProfiles()` with type/sector/region filters.
- `src/lib/supabase/service.ts` — `createServiceRoleSupabase()` factory. Throws if env missing.
- `src/app/inscription/page.tsx` + `actions.ts` + `src/components/SignUpForm.tsx` — extended signup with type picker, conditional per-type fields, parental-consent affordance, two-step write (auth signup → service-role profile insert + best-effort rollback).
- `src/app/mon-profil/page.tsx` + `actions.ts` + `src/components/ProfileEditForm.tsx` — own-profile view + edit. 3 edge paths handled (unauth, no row, unknown type). Verification badge read-only.
- `src/app/admin/profils/page.tsx` + `actions.ts` + `src/components/admin/VerificationDecisionForm.tsx` — pending-profile queue with approve/reject server actions. Service-role writes flip verification status + audit fields.
- `src/app/annuaire/page.tsx` — public directory index with URL-driven filter form.
- `src/components/AuthNav.tsx` — "Mon profil" link added alongside "Mes opportunités" for signed-in users.

**Scripts (`scripts/`):**

- `promote-admin.mjs` — idempotent script to promote an existing `auth.users` entry to a REACT admin profile via service-role.

---

## Validation contract checks

| #   | Check                    | Tool                                  | Result | Detail                                                                                                                                                                                       |
| --- | ------------------------ | ------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Compiles                 | `pnpm build`                          | ✅     | apps/web 15 routes prerendered + 8 dynamic (incl. `/inscription`, `/mon-profil`, `/admin/profils`, `/annuaire`); apps/cms unchanged from Phase 5.                                            |
| 2   | Type-clean               | `pnpm typecheck`                      | ✅     | shared + cms + web — `tsc -b` + per-package `tsc --noEmit`.                                                                                                                                |
| 3   | Lint-clean               | `pnpm lint`                           | ✅     | `eslint . --max-warnings 0`.                                                                                                                                                                 |
| 4   | Format-clean             | `pnpm format:check`                   | ✅     | All matched files use Prettier code style.                                                                                                                                                   |
| 5   | Tests                    | `pnpm test`                           | ✅     | shared 41 (13 new for profiles), cms 31, web 31 (12 new SignUp tests) — 103 tests.                                                                                                          |
| 6   | CI/CD + preview          | GH Actions + Vercel                   | ✅ / 🟡 | PRs #49–#53 merged with green required CI. **Prod CMS** redeployed and confirmed via `/api/access` (now lists `user_profiles`-related routes are not yet a collection — that's expected since profiles live in `public`, not `payload`; the directory view + nav update are live). **Prod web** redeploy queued — Vercel hobby 100/day budget exhausted, resets ~03:00 SAST. |
| 7   | Chrome MCP / curl visual | Chrome MCP + curl                     | ✅     | Local dev (env-aware): /inscription renders 4-type picker + conditional org_name field on selection; /mon-profil unauth → 307 to /connexion?returnTo; /admin/profils unauth → 307 to /connexion?returnTo; /annuaire renders filter form (4 types, 10 sectors, region) + empty-state copy; CMS API confirms `Annuaire → /annuaire` in `site-header` nav. Screenshots committed under `docs/screenshots/phase-6/`. |

---

## Decisions snapshot

- **Profile data stays in Supabase `public` schema, NOT Payload.** Payload owns editorial content (news, opportunities, etc.); Supabase owns user data. Trying to make Payload manage `user_profiles` would require either a virtual-collection custom adapter or living with the duplicated source-of-truth — both worse than the current cleanly-separated model.
- **5 profile types stored as a `text` CHECK enum, not a Postgres `ENUM` type.** Easier to evolve (alter the CHECK vs `ALTER TYPE ... ADD VALUE`) and matches the pattern we already use elsewhere (opportunity types, area, status).
- **Verification fields locked via DB trigger, not policy.** A row-level UPDATE policy can't selectively allow some columns and block others. The trigger does column-level discrimination at runtime; service-role bypasses it.
- **`user_id` not exposed publicly — `directory_slug` (first 8 hex chars) used instead.** Avoids leaking the Supabase auth UUID. The slug isn't globally unique across users (collisions possible at scale), but at sen-react's expected scale (hundreds, not millions of members), 8 hex chars is 4 billion-wide — practically unique.
- **`admin` profile_type intentionally absent from public signup form.** REACT staff are seeded server-side via `scripts/promote-admin.mjs`. The signup form's discriminated union rejects `admin` at parse time as a defence-in-depth.
- **Admin queue lives at `/admin/profils` on the web app, NOT in Payload admin.** Smallest surface for v1. Reading `user_profiles` from Payload would require a custom adapter; building a standalone admin page is ~200 LOC. Trade-off: REACT admins have two admin surfaces. Acceptable until friction proves otherwise.
- **`directory_profiles` view uses `security_invoker = true`** so the underlying RLS still applies. The view's column-projection is the primary D020 enforcement; RLS is defence in depth.
- **Email verification stays a soft requirement.** Supabase's confirmation-email flow is enabled but we don't gate features on `email_confirmed_at`. Once Amadou's team is using the platform, we'll add a banner for unverified users; for now the cost of the gate exceeds the benefit.

---

## Pending / parked

- **Photo uploads via Supabase Storage.** PR-6c accepts a `photo_url` free-form URL field; an in-page uploader integrating with the `sen-react-media` bucket lands when REACT actually starts uploading photos (likely Phase 7 alongside the B2B directory build-out).
- **Public profile detail page (`/annuaire/[slug]`).** PR-6e ships the index only. Detail pages are part of Phase 7 (B2B directory) per the roadmap — they need the gated-contact reveal flow for signed-in members.
- **Admin promotion via UI.** Currently SQL-script-only. Adding an admin UI page to manage admin grants is a low-priority follow-up.
- **Parental-consent verification.** The signup form takes the entrepreneur at their word that they have parental consent — we store the flag + optional parent email but don't email the parent for confirmation. Real-world implementation would email the parent with a one-click ack. Defer until launch-readiness (Phase 12).
- **i18n.** All UI strings are FR per D010. EN translations land in a later phase.

---

## Operational notes

### Vercel daily deploy budget exhausted during the Phase 6 sprint

The 100/day Vercel hobby-plan deploy budget was exceeded during today's loop. As of phase-lock time, prod web is at the SHA from PR-6b's merge; PR-6c, 6d, 6e are merged to `main` but the prod redeploy is queued behind the 24h reset (~03:00 SAST 2026-05-11).

Impact: the four new web surfaces (`/mon-profil`, `/admin/profils`, `/annuaire`, the AuthNav "Mon profil" link, and the new nav item Annuaire) will become reachable on prod once the budget resets and either an auto-deploy fires (next push) or a force-deploy is triggered via API.

**Resume after reset:** force-deploy both projects via the Vercel REST API (`POST /v13/deployments?forceNew=1`) using the current HEAD SHA, then Chrome MCP sweep `/inscription`, `/mon-profil`, `/admin/profils`, `/annuaire` on `sen-react.vercel.app`.

### Vercel path-filter script

Mid-loop the ignoreBuildStep script was patched (two iterations) to handle the "bad object" case cleanly. Current form (both projects):

```sh
if ! git cat-file -e "$VERCEL_GIT_PREVIOUS_SHA" 2>/dev/null; then exit 1; fi; git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- <paths>
```

Bad/unreachable SHA → exit 1 (build). Reachable SHA + no diff → exit 0 (skip). Reachable SHA + diff → exit 1 (build). 233 chars, under the 256 cap.

---

## What's next (per roadmap)

Phase 7 — **B2B directory**. Per roadmap row 78: directory pages with public name/sector/region/photo, gated phone/email per D020, reviews/ratings, "Looking for X" board, no in-platform inbox per D016, hidden `tier` field for future verified/premium support. Will build on `directory_profiles` + the existing `/annuaire` index from PR-6e.
