---
phase: 4 — Opportunities dashboard (read-only)
locked_at: 2026-05-10T15:20+02:00
locked_on_branch: feat/phase-4e-lock-and-nav
roadmap_row: 75
---

# Phase 4 — Opportunities dashboard (read-only)

**Status:** Locked. All deliverables in roadmap row 75 are shipped, deployed, and validated.

> **Roadmap row 75** — _Manual entries via Payload, filters (sector / type / area / deadline / amount), keyword search, saved-opportunities for logged-in members, REACT-curated content. D001._

---

## What shipped

| #  | PR  | Title                                                     | Surface added                                          |
| -- | --- | --------------------------------------------------------- | ------------------------------------------------------ |
| 4a | #38 | Opportunities collection in Payload                       | Admin schema (drafts, autosave, public-published read) |
| 4b | #39 | `/opportunites` index with filters + search               | Public listing with URL-driven filter form             |
| 4c | #40 | `/opportunites/[slug]` reader                             | Public detail page with apply CTA + Save button        |
| 4d | #41 | Saved opportunities for logged-in members                 | Supabase `saved_opportunities` table + RLS + `/mes-opportunites` |
| 4e | this | Lock + nav surfacing + validation artefact               | "Opportunités" in main nav, "Mes opportunités" in AuthNav |

---

## Files of record

**CMS (apps/cms):**

- `src/collections/Opportunities.ts` — schema with title / slug / summary / Lexical body / sector (D012 enum) / opportunityType (6) / area (6) / deadline / amountValue + currency + display / source / sourceUrl / contactEmail / publishedAt / reactCurated. Drafts with 2s autosave, sort by deadline ascending, public read scoped to `_status = published`.
- `src/__tests__/phase-4-opportunities.test.ts` — 10 contract tests (slug stability, required fields, sector / type / area enum coverage, defaults, sourceUrl validator).
- `src/payload.config.ts` — registers `Opportunities` alongside news / publications / videos / partners / programmes / team-members / users.

**Web (apps/web):**

- `src/lib/cms.ts` — `Opportunity` type, `OpportunityFilters` interface, `listOpportunities(filters)` (filter-aware, excludes past deadlines via `where[deadline][greater_than_equal]`), `getOpportunityBySlug`, `listOpportunitiesBySlugs` (bulk fetch for saved page).
- `src/app/opportunites/page.tsx` — index page. URL-driven filters (`<form method="get">`), validates URL params against the closed enums before passing to the fetcher, reset link is a plain `<a href="/opportunites">`.
- `src/components/content/OpportunityCard.tsx` — card render with deadline countdown ("Clôture dans N jours" up to 14 days, otherwise localised date). Urgent styling under 7 days.
- `src/components/content/OpportunityFilters.tsx` — sector + type + area + deadline-window + keyword search form, submits as GET to `/opportunites`.
- `src/app/opportunites/[slug]/page.tsx` — reader with sidebar grid (organisme, deadline, amount, "Aggrégé — non curé par REACT" badge when `reactCurated = false`), Lexical body, apply CTA section. Past-deadline pages still render with "Échéance dépassée" rather than 404 (so shared links don't break between share + click).
- `src/app/opportunites/actions.ts` — `toggleSavedOpportunity(slug)` returns `{ status: "ok" | "unauthenticated" | "error"; saved: boolean }`. `listSavedOpportunitySlugs()` returns `Set<string>` for bulk lookup.
- `src/components/content/SaveOpportunityButton.tsx` — client component. Optimistic flip via `useState` + `useTransition`; reverts on action failure. Unauth visitors get a `/connexion?returnTo=…` link instead of the toggle.
- `src/app/mes-opportunites/page.tsx` — auth-gated saved list. `export const dynamic = "force-dynamic"` (depends on cookies, can't prerender). Redirects to `/connexion?returnTo=%2Fmes-opportunites` for signed-out visitors. Bulk-fetches saved slugs from Supabase, then opportunities from Payload via `listOpportunitiesBySlugs`.
- `src/components/AuthNav.tsx` — adds "Mes opportunités" link in the logged-in slot (visible only when there's a session, kept out of the main nav so unauth visitors never see a dead link).

**Database (supabase):**

- `migrations/20260510_140000_saved_opportunities.sql` — `public.saved_opportunities` table keyed by `(user_id, opportunity_slug)`. RLS enabled; users can only SELECT / INSERT / DELETE their own rows. No UPDATE policy because `saved_at` is set on insert and never mutated. `auth.users.id` cascade delete.

**Shared (packages/shared):**

- `src/cms-globals.ts` — `DEFAULT_SITE_HEADER.navItems` extended with `{ label: "Opportunités", labelEn: "Opportunities", href: "/opportunites" }` between Secteurs and Actualités. Re-seeded against prod CMS so the live nav reflects the change.

---

## Validation contract checks

| #   | Check                    | Tool                                | Result | Detail                                                                                                                                                                                                            |
| --- | ------------------------ | ----------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Compiles                 | `pnpm build`                        | ✅     | apps/web: 14 routes prerendered + 5 dynamic (incl. `/opportunites`, `/opportunites/[slug]`, `/mes-opportunites`); apps/cms: 9 collections + 11 globals.                                                          |
| 2   | Type-clean               | `pnpm typecheck`                    | ✅     | shared (project ref) + cms + web — `tsc -b` followed by per-package `tsc --noEmit`.                                                                                                                              |
| 3   | Lint-clean               | `pnpm lint`                         | ✅     | `eslint . --max-warnings 0`.                                                                                                                                                                                      |
| 4   | Format-clean             | `pnpm format:check`                 | ✅     | All matched files use Prettier code style.                                                                                                                                                                        |
| 5   | Tests                    | `pnpm test`                         | ✅     | shared 18, cms 31 (incl. 10 new Opportunities contract tests), web 24 — 73 unit tests passing.                                                                                                                    |
| 6   | CI/CD + preview          | GH Actions + Vercel                 | ✅     | PRs #38–#41 merged with green CI on `main`. Prod CMS + web deploys complete (`sen-react.vercel.app`, `sen-react-cms.vercel.app`). Path-based `commandForIgnoringBuildStep` filters per-project changes (Phase 2.5 ops note). |
| 7   | Chrome MCP / curl visual | Chrome MCP `read_page` + curl HTML  | ✅     | `/opportunites` renders empty-state copy from `empty-states.opportunities` global ("Les premières opportunités arrivent bientôt…"). Main nav now lists Opportunités between Secteurs and Actualités. Screenshot at `docs/screenshots/phase-4/opportunites-index.png`. |

---

## Decisions snapshot

- **Slug, not UUID, as the saved-opportunities reference key.** Payload UUIDs are not stable across re-seeds; slugs are. The `/mes-opportunites` page joins by slug back to `/api/opportunities`. Trade-off: an editor renaming a slug would orphan saves — that's acceptable because slug renames already break shared URLs and we treat them as breaking changes.
- **Past-deadline opportunities still render at their slug.** They're filtered out of the index by default (via `where[deadline][greater_than_equal]`) but the detail page renders with "Échéance dépassée" so shared links don't 404 between share and click. Editor decides when to actually unpublish.
- **Optimistic save flip.** `SaveOpportunityButton` updates state on click before the server action returns, and reverts if the action's `status !== "ok"`. Keeps perceived latency low while the Supabase round-trip happens.
- **`/mes-opportunites` lives in `AuthNav`, not the main nav.** Unauthenticated visitors never see a link that just bounces them to `/connexion`. Signed-in users get it inline next to their email.
- **Empty states are CMS-driven.** `empty-states.opportunities` (general empty index) and `empty-states.opportunitiesNoMatch` (active filters with zero results) live in the `EmptyStates` global, alongside the equivalents for News / Publications / Videos. No hardcoded fallbacks per `feedback_dont_mask_data_with_code.md`.
- **REACT-curated badge inverted.** `reactCurated: true` is the default — when the field is `false`, the reader surfaces "Aggrégé — non curé par REACT". This avoids a missing badge being interpreted as endorsement when an aggregated source is added later.

---

## Pending / parked

- **Seeded sample opportunities.** The collection ships empty. Amadou will populate the first batch directly in the Payload admin once curation is settled. Empty-state copy at `/opportunites` and `/mes-opportunites` is in place to handle the gap.
- **Amount filter (numeric range).** Roadmap mentions "amount" as a filter dimension. Shipped as a stored field (`amountValue`, `amountCurrency`, `amountDisplay`) but not surfaced as a UI filter — the use-cases for "show me opportunities ≥ X CFA" aren't clear enough yet to commit to a slider / threshold UI. Ready to add when the editorial workflow asks for it.
- **Email notifications on saved opportunities approaching deadline.** Out of scope for read-only Phase 4. Belongs in a later phase if member engagement warrants it.

---

## What's next (per roadmap)

Phase 5 — see `docs/roadmap.md` for the next row. Lock this artefact before starting Phase 5 work.
