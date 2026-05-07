# Phase 0 — Validation Artefact

**Phase:** 0 — Pre-flight scaffolding
**Slice:** PR-0a (monorepo + apps/web + packages/shared + base config)
**Status:** Build-complete, checks 1–4 passing. Awaiting PR-0b (tests + CI) and PR-0c (skills + Chrome MCP) before Phase 0 locks.

## Validation contract checks

| # | Check | Tool | Result |
|---|---|---|---|
| 1 | Compiles | `pnpm build` | ✅ Next.js 16.2.5 — 3 static pages, 0 errors |
| 2 | Type-clean | `pnpm typecheck` | ✅ shared + web both clean (strict TS) |
| 3 | Lint-clean | `pnpm lint` | ✅ ESLint 9 flat config, max-warnings 0 |
| 4 | Format-clean | `pnpm format:check` | ✅ Prettier clean across `**/*.{ts,tsx,js,mjs,cjs,json,md,css}` |
| 5 | Tests | Vitest + Playwright | ⏳ Lands in PR-0b |
| 6 | CI/CD | GitHub Actions → Vercel | ⏳ Lands in PR-0b |
| 7 | Chrome MCP visual | `mcp__claude-in-chrome__*` | ⏳ Lands in PR-0c |

## Smoke

`pnpm --filter @sen-react/web dev` boots Next.js 16.2.5 with Turbopack on port 3000 in 197ms.

## What was built

**Root:**
- `package.json` — pnpm workspace, scripts (`build`, `dev`, `lint`, `typecheck`, `format:check`, `test`)
- `pnpm-workspace.yaml` — `apps/*` + `packages/*`
- `tsconfig.base.json` — strict TS baseline (`noUncheckedIndexedAccess`, `noImplicitOverride`, etc.)
- `eslint.config.mjs` — ESLint 9 flat config, typed linting on source, disabled on configs
- `.prettierrc`, `.prettierignore` — Prettier 3, content dirs (`discovery/`, `docs/`) excluded as author-controlled
- `.gitignore`, `.nvmrc` (Node 22+)
- `README.md`

**apps/web (Next.js 16, FR-primary):**
- `package.json`, `tsconfig.json`, `next.config.ts` (with `typedRoutes`)
- `postcss.config.mjs` + Tailwind v4 (`@import "tailwindcss"`)
- `src/app/layout.tsx` — `<html lang="fr">` from `DEFAULT_LOCALE`
- `src/app/page.tsx` — Phase 0 placeholder rendering 10 sectors from `@sen-react/shared`
- `src/app/globals.css` — base theme tokens (neutral until D018 brand pull)

**packages/shared:**
- `LocaleSchema` + `DEFAULT_LOCALE` + `SUPPORTED_LOCALES` (FR primary per D010 Q2)
- `SECTORS` — the 10 sectors from D012 with stable slugs + FR/EN labels + scope strings

## Decisions referenced

- D008 — REACT CMS autonomy (no hardcoded copy; sectors live as data)
- D010 Q2 — FR primary, EN deferred
- D012 — 10 sectors locked with verbatim FR scope from Amadou §3
- D013 — smartphone-first, light bundles
- D015 — auth via Supabase email+password (lands in PR-0a-ii / Phase 1)

## Next slices

- **PR-0a-ii** — `apps/cms` Payload scaffold pointed at a fresh Supabase project (eu-west-1)
- **PR-0b** — Vitest + Playwright + GitHub Actions → Vercel preview pipeline
- **PR-0c** — `verify-phase` + `visual-check` skills + first Chrome MCP screenshot baseline

Phase 0 locks once 1–7 are green for the full PR-0a + PR-0b + PR-0c slice.
