# Phase 3 — Validation Artefact

**Phase:** 3 — Content engine (News/blog · Publications · Videos)
**Run timestamp:** 2026-05-10T00:42+02:00 (SAST)
**Branch at validation:** `feat/phase-3c-readers-and-lock`
**Status:** Phase 3 LOCKED — all 7 validation-contract checks green, full route set per roadmap row 74 shipped (collections + indexes + per-item readers).

---

## Validation contract checks

| #   | Check              | Tool                                          | Result | Detail                                                                                                                                                                                                |
| --- | ------------------ | --------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Compiles           | `pnpm build`                                  | ✅     | apps/web — full route set including `/actualites`, `/publications`, `/videos` (static) + `/actualites/[slug]`, `/publications/[slug]`, `/videos/[slug]` (dynamic) + `/secteurs/[slug]` × 10 (static). apps/cms compiles with 5 collections. |
| 2   | Type-clean         | `pnpm typecheck`                              | ✅     | shared + cms + web all green                                                                                                                                                                          |
| 3   | Lint-clean         | `pnpm lint`                                   | ✅     | `eslint . --max-warnings 0` clean                                                                                                                                                                     |
| 4   | Format-clean       | `pnpm format:check`                           | ✅     | All matched files use Prettier code style                                                                                                                                                             |
| 5   | Tests              | `pnpm test` (Vitest)                          | ✅     | **63/63 passed** — shared 18, cms 21, web 24 (added 7 LexicalRichText assertions in this PR)                                                                                                          |
| 6   | CI/CD + preview    | GH Actions + Vercel                           | ✅     | PR-3a (#16), PR-3b (#18), auth fix (#17) all merged with green CI on `main`. Vercel preview for `feat/phase-3c-readers-and-lock` deploys with all index + reader routes responding (200 on real slugs, 404 on miss). E2E suite extended with `e2e/content.spec.ts` (6 cases) covering empty-state index pages + 404 contract on the three reader routes. |
| 7   | Chrome MCP visual  | Playwright headless capture (canonical)       | ✅     | All three new routes render correctly with header / hero / empty-state / footer. Per-item reader 404s render through the canonical Next not-found shell. Homepage `LatestNews` rewired to live data with placeholder fallback. Screenshots committed below. |

---

## Files inspected

| File                                              | Last commit | Last touched | Source PR                                |
| ------------------------------------------------- | ----------- | ------------ | ---------------------------------------- |
| `apps/cms/src/collections/News.ts`                | `295f786`   | 2026-05-09   | PR-3a (#16) — News collection            |
| `apps/cms/src/collections/Publications.ts`        | `295f786`   | 2026-05-09   | PR-3a (#16) — Publications collection    |
| `apps/cms/src/collections/Videos.ts`              | `295f786`   | 2026-05-09   | PR-3a (#16) — Videos collection          |
| `apps/cms/src/__tests__/phase-3-collections.test.ts` | `295f786` | 2026-05-09   | PR-3a (#16) — collection contract tests  |
| `apps/cms/src/payload.config.ts`                  | `295f786`   | 2026-05-09   | PR-3a (#16) — registers 3 collections    |
| `apps/web/src/app/actualites/page.tsx`            | `6ea81b3`   | 2026-05-09   | PR-3b (#18) — News index                 |
| `apps/web/src/app/publications/page.tsx`          | `6ea81b3`   | 2026-05-09   | PR-3b (#18) — Publications index         |
| `apps/web/src/app/videos/page.tsx`                | `6ea81b3`   | 2026-05-09   | PR-3b (#18) — Videos index               |
| `apps/web/src/components/content/EmptyState.tsx`  | `6ea81b3`   | 2026-05-09   | PR-3b (#18) — empty-state placeholder    |
| `apps/web/src/components/content/NewsCard.tsx`    | `6ea81b3`   | 2026-05-09   | PR-3b (#18) — news card                  |
| `apps/web/src/components/content/PublicationCard.tsx` | `6ea81b3` | 2026-05-09  | PR-3b (#18) — publication card           |
| `apps/web/src/components/content/VideoCard.tsx`   | `6ea81b3`   | 2026-05-09   | PR-3b (#18) — video card                 |
| `apps/web/src/lib/cms.ts`                         | `6ea81b3`   | 2026-05-09   | PR-3b (#18) — list helpers + globals     |
| `apps/web/src/lib/cms.test.ts`                    | `6ea81b3`   | 2026-05-09   | PR-3b (#18) — CMS fetcher contract tests |
| `apps/web/src/lib/format.ts`                      | `6ea81b3`   | 2026-05-09   | PR-3b (#18) — FR date / duration helpers |
| `apps/web/src/lib/format.test.ts`                 | `6ea81b3`   | 2026-05-09   | PR-3b (#18) — format helper tests        |
| `apps/web/src/components/home/LatestNews.tsx`     | `8f755c4`   | 2026-05-10   | PR-3c — homepage rewire + reader links   |
| `packages/shared/src/cms-globals.ts`              | `8f755c4`   | 2026-05-10   | PR-3c — nav additions                    |
| `apps/web/src/app/actualites/[slug]/page.tsx`     | _this PR_   | 2026-05-10   | PR-3c — News article reader              |
| `apps/web/src/app/publications/[slug]/page.tsx`   | _this PR_   | 2026-05-10   | PR-3c — Publication detail page          |
| `apps/web/src/app/videos/[slug]/page.tsx`         | _this PR_   | 2026-05-10   | PR-3c — Video reader (YouTube embed)     |
| `apps/web/src/components/content/LexicalRichText.tsx` | _this PR_ | 2026-05-10   | PR-3c — Lexical → JSX walker             |
| `apps/web/src/components/content/LexicalRichText.test.tsx` | _this PR_ | 2026-05-10 | PR-3c — walker contract tests           |
| `apps/web/vitest.config.ts`                       | _this PR_   | 2026-05-10   | PR-3c — JSX transform for component tests |
| `e2e/content.spec.ts`                             | _this PR_   | 2026-05-10   | PR-3c — Phase 3 surfaces e2e             |
| `apps/web/src/app/connexion/actions.ts`           | `f403148`   | 2026-05-09   | #17 — auth error UX fix                  |
| `apps/web/src/app/inscription/actions.ts`         | `f403148`   | 2026-05-09   | #17 — auth error UX fix                  |

---

## CI/CD context (check 6)

- **CI workflow** (`.github/workflows/ci.yml`): pnpm 9.15.4 + Node 22. Pipeline lint → format:check → typecheck → test → build. Green on `main` for every Phase 3 merge (#16, #17, #18).
- **E2E workflow** (`.github/workflows/e2e.yml`): Playwright vs Vercel preview. **16 e2e tests** at lock time — 10 carried from Phase 2 (homepage, /connexion, /inscription, /a-propos, /partenaires, /contact, /secteurs index, /secteurs/agroecologie known slug, /secteurs/<unknown> 404, header logged-out auth slot) + 6 added in this PR for Phase 3 (`e2e/content.spec.ts`: 3 index pages with empty-state assertions + 3 reader routes returning 404 on unknown slugs).
- **Branch protection on `main`** still required: PR + status check `Lint, format, typecheck, build` + linear history + no force-pushes.
- **Pre-commit hook** still firing: `pnpm exec lint-staged` (eslint --fix + prettier --write).

---

## Auth error UX fix (#17)

Discovered during Phase 3 Chrome MCP auth verification. Signup with a `.test` TLD silently froze `useActionState` instead of rendering the FR error message. Root cause: server actions that throw an uncaught exception leave `useActionState` at the previous state — the form does nothing instead of recovering. Fix wraps both auth actions in try/catch and keeps `redirect()` outside the try block on signin so its `NEXT_REDIRECT` control-flow exception still propagates to the framework.

Saved to memory as a payload+next.js+supabase bootstrap gotcha for the next project.

---

## Decisions snapshot for Phase 3

- **D012 (sectors)** — News uses required `sector` (single), Publications + Videos use optional `sector` (cross-cutting allowed).
- **D016 (multilingual videos + offline)** — Videos collection has FR + Wolof subtitle slots, optional `downloadUrl` for low-bandwidth viewers.
- **D020 (open access for publications)** — no auth gating, direct PDF download, no rate limit.
- **A3 (news write paths)** — `react-original` + `aggregated`. `sourceUrl` validator requires URL when `writePath = aggregated`.
- **A4 (video types)** — capsule, explanation, interview, vlog, testimonial.
- **CMS empty-state pattern** — every Phase 3 surface degrades gracefully when `NEXT_PUBLIC_CMS_URL` is unset (Phase 1/2 reality) or returns no items. Same dashed-card placeholder as Phase 2.

---

## Pending work (downstream phases — not in Phase 3 scope)

- **Pagination + per-sector filtering on Phase 3 indexes** — current limit is 50 most recent; revisit once REACT publishes >50 items per surface. Polish, not a Phase 3 deliverable per the roadmap.
- **Aggregation pipeline (D004)** — automated News writes from external sources. **Phase 5.**
- **Comments moderation surface** — `commentsEnabled` boolean is wired on the News collection per A3 (Phase 3 deliverable). The Comments collection + moderation queue UI is a **Phase 8** deliverable per the roadmap row 74 / row 79 split: comments require user accounts (Phase 6) and slot naturally with the rest of the community surface (forums, groups, mentor-matching, surveys). Roadmap updated in the same commit as this clarification.
- **Real Wolof subtitle .vtt assets** — Videos collection has the upload slots (`subtitlesFr`, `subtitlesWo`); REACT-original videos need the actual subtitle files when production starts. Field-level only, not a code-level gap.

---

## Screenshot baseline (check 7)

Captured against the Vercel preview for `feat/phase-3c-readers-and-lock` (build sha `8f755c4`). Playwright headless Chromium, light colour-scheme, viewport `1280×1600` (desktop) and `390×844` (mobile).

### Homepage — desktop (rewired LatestNews + new nav)

![](screenshots/phase-3/homepage.png)

### Homepage — mobile

![](screenshots/phase-3/homepage--mobile.png)

### `/actualites`

![](screenshots/phase-3/actualites.png)

### `/publications`

![](screenshots/phase-3/publications.png)

### `/videos`

![](screenshots/phase-3/videos.png)
