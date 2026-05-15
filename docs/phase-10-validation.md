# Phase 10 — Formalisation Toolkit: Validation Artefact

**Locked:** 2026-05-15  
**Branch base:** main @ `01a2ad0`

## Scope

Phase 10 delivers the formalisation toolkit — a guided step-by-step journey for Senegalese entrepreneurs through the legal/administrative procedures required to formalise a business. Content is fully CMS-driven to allow REACT to populate the verbatim procedures from Amadou §4.2 without code changes.

---

## Delivered

### 10a — Formalisation Guided Journey (`PR-10a` / `01a2ad0`)
- `FormalisationSteps.ts` Payload collection: stepNumber (ordering), title, slug, summary, body (richtext procedure), agencyName (e.g. APIX, RCCM, DGI/NINEA), externalUrl/Label (external agency links), estimatedDuration, estimatedCost, requiredDocuments (array)
- Payload migration `20260515_130000` (creates `payload.formalisation_steps` + `formalisation_steps_required_documents` array sub-table + versions)
- `listFormalisationSteps` / `getFormalisationStepBySlug` CMS fetchers in `cms.ts`
- `/formalisation` — numbered guided journey listing: step badge, agency, duration/cost, summary, "Voir la procédure" + external link
- `/formalisation/[slug]` — detail page: required documents checklist, duration/cost card, external CTA button, full richtext procedure body
- "Ressources complémentaires" section linking to /ressources + /formations
- Nav: "Formalisation" added to `DEFAULT_SITE_HEADER`
- Fix: `defaultSort` removed from `CollectionAdminOptions` (not a valid field in this Payload version)

---

## Content Note

The formalisation steps themselves (BCE/APIX, RCCM/NINEA, FRA, import-export card, business plan, financial management) are CMS-driven. REACT's team populates them via the Payload admin dashboard by entering the verbatim procedures from Amadou §4.2. External redirects to official Senegalese government agencies (APIX.sn, RCCM, DGI, etc.) are set per step.

---

## Navigation

Phase 10 route added to `DEFAULT_SITE_HEADER.navItems` in `packages/shared/src/cms-globals.ts`:
`Formalisation` (in addition to all pre-existing items).

---

## Payload Migrations Applied to Production

| Migration | Table(s) | Applied |
|---|---|---|
| `20260515_130000` | `payload.formalisation_steps`, `payload.formalisation_steps_required_documents`, `payload._formalisation_steps_v`, `payload._formalisation_steps_v_version_required_documents` | ✓ |

---

## Validation

1. `pnpm lint` — ESLint 0 errors/warnings
2. `pnpm --filter web typecheck` — TypeScript strict, 0 errors
3. `pnpm --filter cms typecheck` — 0 errors (after fixing `defaultSort` invalid prop)
4. `pnpm test` — 62/62 tests pass
5. `pnpm --filter web build` — Turbopack build succeeds with `/formalisation` + `/formalisation/[slug]` in route manifest
6. GitHub Actions CI — "Lint, format, typecheck, build" ✓ (after fix commit)
7. Chrome MCP — `/formalisation` renders heading + empty state + complementary resources section; homepage no regression

PR-10a squash-merged to `main`.
