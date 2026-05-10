# Phase 2.5 — Editorial Copy Migration to CMS (D008 closure)

**Phase:** 2.5 — Editorial copy migration (interstitial after Phase 0–3 audit)
**Run timestamp:** 2026-05-10T14:00+02:00 (SAST)
**Branch at validation:** `feat/cms-h-d008-closure`
**Status:** D008 closed for editorial body copy. SEO metadata + a single Zod schema message intentionally kept as code — flagged below.

---

## Why this phase exists

Phase 0–3 audit (2026-05-10) flagged that D008 ("All content CMS-driven; no hard-coded copy") was only partially honoured: data-shaped sources (partners, programmes, team, contact, header/footer) had been migrated, but editorial body copy across the homepage, About, Contact, Sectors, and Auth pages was still living in JSX components. That meant Amadou couldn't refine wording without a code change — which contradicts the architecture.

This phase migrated the remaining editorial copy in 7 sequential PRs (A–G), each a small section with its own Chrome MCP / curl parity check before merging.

---

## Migration sequence

| # | PR | Section | Shape | Surfaces |
|---|---|---|---|---|
| A | #27 | Homepage Hero | global | `/` |
| B | #29 | Domaines (4 pillars) | global | `/` |
| C | #30 | Empty-state copy | global (named groups + array) | `/actualites`, `/publications`, `/videos`, `/` (LatestNews fallback) |
| D | #31 | Contact page copy | global | `/contact` |
| E | #32 | About page (5 blocks) | global with mixed text + Lexical bodies | `/a-propos` |
| F | #34 | Sectors page copy | global | `/secteurs`, `/secteurs/[slug]` |
| G | #36 | Auth strings | global with grouped fields | `/connexion`, `/inscription`, `AuthForm`, signin/signup actions |

Each PR also extended the `apps/cms/src/seed.ts` script with the canonical initial values, so re-running the seed against any environment restores the locked editorial state.

---

## What's now editable in the Payload admin

`https://sen-react-cms.vercel.app/admin`

**Globals (single-record editorial):**
- `site-header` — title, tagline, primary nav (7 items)
- `site-footer` — copyright, description, legal nav, social links, contact email + address
- `contact-info` — email, phoneE164, phoneDisplay, address lines
- `homepage-hero` — eyebrow, headline, lead, two CTAs
- `homepage-domaines` — eyebrow, headline, 4 pillars
- `empty-states` — `/actualites`, `/publications`, `/videos` placeholder copy + 3 LatestNews fallback cards
- `contact-page` — eyebrow, headline, lead, 3 channel hints, 4-item channel guide
- `about-page` — hero, mission, vision, values (3 items), founding (Lexical), legal (Lexical)
- `sectors-page` — index hero + detail page template (back link, eyebrow, placeholder header, 3 placeholder blocks)
- `auth-strings` — signin / signup / form labels / error + success messages

**Collections (multi-record editorial):**
- `partners` (10 items) — kind {institution, ngo}, order, optional logo
- `programmes` (3 items) — variant {headline, active}, order
- `team-members` (5 items) — role, order, optional photo
- `news` — full article CMS with sector chip, write-path, source URL, Lexical body
- `publications` — title, summary, sector, language, authors, file (PDF), optional cover
- `videos` — youtubeId, type, sector, FR/Wolof subtitles, optional offline download URL

---

## Intentionally kept as code (not migrated)

| What | Why |
|---|---|
| `metadata.title` + `metadata.description` per route | Next.js `metadata` exports are synchronous module-level constants; making them CMS-driven requires every page to use the async `generateMetadata` function. SEO meta rarely changes editorially compared to body copy; defer until a SEO global is genuinely needed. |
| `metadata.title` for not-found cases (e.g. "Article introuvable — Sen React") | Same as above — only fires for invalid slugs, never user-editable. |
| Zod password message in `apps/web/src/lib/auth.ts` ("Le mot de passe doit contenir au moins 8 caractères") | Zod schemas are synchronous module exports; making them async-CMS-driven requires schema rebuilding per request. The validation rule itself (≥8 chars) is policy, not editorial. |
| Internal error messages in `lib/supabase/browser.ts` and `lib/supabase/server.ts` (e.g. "Supabase env not set…") | Developer-facing errors that surface only when env is misconfigured. Never visible to end users. |
| Sectors taxonomy (`packages/shared/src/sectors.ts`) | D012 fixed enum used as type values across News/Publications/Videos collections. Per-sector page **content** is editorial (Phase 2 yellow row, awaiting Q5 voicenotes — will land as a `sector-content` collection); the slug/label/scope tuple itself is canonical structure, not copy. |

---

## Validation contract checks

| #   | Check              | Tool                                          | Result | Detail                                                                                                                                                                                                                                                              |
| --- | ------------------ | --------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Compiles           | `pnpm build`                                  | ✅     | apps/web 13 routes prerendered + 4 dynamic; apps/cms compiles with 11 globals + 8 collections                                                                                                                                                                          |
| 2   | Type-clean         | `pnpm typecheck`                              | ✅     | shared + cms + web — `tsc -b` (project references) + `tsc --noEmit` per package                                                                                                                                                                                      |
| 3   | Lint-clean         | `pnpm lint`                                   | ✅     | `eslint . --max-warnings 0`                                                                                                                                                                                                                                          |
| 4   | Format-clean       | `pnpm format:check`                           | ✅     | All matched files use Prettier code style                                                                                                                                                                                                                            |
| 5   | Tests              | `pnpm test`                                   | ✅     | shared 18, cms 21, web 24 — 63 unit tests                                                                                                                                                                                                                            |
| 6   | CI/CD + preview    | GH Actions + Vercel                           | ✅     | All 7 CMS migration PRs (#27, #29, #30, #31, #32, #34, #36) merged with green CI on `main`. Prod deploys complete for both projects after main pushes (`sen-react.vercel.app`, `sen-react-cms.vercel.app`).                                                          |
| 7   | Chrome MCP / curl visual | Playwright headless + curl HTML grep      | ✅     | Per-PR parity baselines committed at `docs/screenshots/parity-checks/<surface>-before-CMS-<X>.png`. Each migration verified the rendered HTML contains the same canonical strings as the pre-migration baseline (visual parity holds because we seed CMS with the same values that were previously hardcoded). |

---

## Operational notes from this phase

### Vercel deploy budget

Tom flagged the 100/day deploy quota mid-migration (Vercel hobby plan, two projects per PR). PR-OPS-A attempted full CI-gating; reverted in PR #35 after hitting two Vercel platform limits:

- `gitProviderOptions.createDeployments = "disabled"` persists in the project setting via API but Vercel still fires auto-deploys on push (cause unknown; possibly Pro-tier-only).
- `commandForIgnoringBuildStep` doesn't expose `VERCEL_DEPLOYMENT_META_*` env vars during the ignore step, so a meta-tag gate couldn't differentiate auto vs API deploys.

**Final state:** auto-deploys remain enabled; `commandForIgnoringBuildStep` does path-based filtering per project (skip if no relevant paths changed since previous deploy). This catches most of the wasted-deploy cost. CI-failure pushes still consume one deploy each — accepted small cost.

If we need real CI-gating later, the path forward is Vercel CLI from a deploy job using deploy hooks (per-branch URLs created via API), not the deployments REST endpoint.

### Seed script hygiene

The seed script forces `process.env.NODE_ENV = "production"` at the top so Payload's postgres adapter doesn't run its dev-mode schema push during `getPayload()`. Without that, every local seed run inserts a `batch = -1` row in `payload_migrations` which then hangs the next prod `payload migrate` on a destructive-confirmation prompt. (Fixed in PR #28.)

---

## What's next (phases per the roadmap)

Phase 4 — Opportunities dashboard (read-only). Per row 75: manual entries via Payload, filters (sector / type / area / deadline / amount), keyword search, saved-opportunities for logged-in members, REACT-curated content. D001 referenced.
