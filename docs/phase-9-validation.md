# Phase 9 — Capacity Building: Validation Artefact

**Locked:** 2026-05-15  
**Branch base:** main @ `97a673c`

## Scope

Phase 9 delivers the capacity building layer on top of the Sen React platform — a dedicated surface for REACT's training catalogue and resource library. Two sub-phases shipped as discrete PRs, each with CI + Chrome MCP verification before merge.

---

## Delivered

### 9a — Trainings Catalogue (`PR-9a` / `8919853`)
- `Trainings.ts` Payload collection: title, slug, summary, body, trainingType (tutorial/webinar/workshop/online-course), level (debutant/intermediaire/avance), format (online/in-person/hybrid), topic, sector, startsAt/endsAt, location, registrationUrl, videoUrl, image
- Payload migration `20260515_110000` (creates `payload.trainings` + version table)
- `listTrainings` / `getTrainingBySlug` CMS fetchers
- `/formations` — public listing with type/level/format/sector badges, date, location
- `/formations/[slug]` — detail page with metadata card, video link, registration CTA
- Nav: "Formations" added to `DEFAULT_SITE_HEADER`

### 9b — Resources + Capacity Building Hub (`PR-9b` / `97a673c`)
- `Resources.ts` Payload collection: title, slug, summary, body, resourceType (guide/fiche-technique/modele/checklist/rapport), sector, file (PDF upload), coverImage, publishedAt
- Payload migration `20260515_120000` (creates `payload.resources` + version table)
- `listResources` / `getResourceBySlug` CMS fetchers
- `/ressources` — public 2-column grid listing with colour-coded type badges + PDF download link
- `/ressources/[slug]` — detail page with download CTA
- `/renforcement` — capacity building hub: recent trainings + recent resources + contact CTA
- Nav: "Ressources" + "Renforcement" added to `DEFAULT_SITE_HEADER`

---

## Navigation

Phase 9 routes added to `DEFAULT_SITE_HEADER.navItems` in `packages/shared/src/cms-globals.ts`:
`Formations`, `Ressources`, `Renforcement` (in addition to all pre-existing items).

---

## Payload Migrations Applied to Production

| Migration | Table(s) | Applied |
|---|---|---|
| `20260515_110000` | `payload.trainings`, `payload._trainings_v` | ✓ |
| `20260515_120000` | `payload.resources`, `payload._resources_v` | ✓ |

No direct Supabase SQL migrations needed — both collections are Payload-managed (postgres schema `payload`).

---

## Validation

Each PR validated with:
1. `pnpm lint` — ESLint 0 errors/warnings
2. `pnpm --filter web typecheck` — TypeScript strict, 0 errors
3. `pnpm test` — 62/62 tests pass
4. `pnpm --filter web build` — Turbopack build succeeds with all new routes in manifest
5. GitHub Actions CI — "Lint, format, typecheck, build" ✓ on each PR
6. Chrome MCP — `/formations`, `/ressources`, `/renforcement` render correctly; homepage no regression

Both PRs (9a–9b) squash-merged to `main`.
