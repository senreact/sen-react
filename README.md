# Sen React

Bilingual (FR/EN) platform for Senegalese youth and women entrepreneurs.
Built for [REACT](https://senreact.com) — Réseau des Entrepreneurs Actifs.

## Status

**Phase 0 — Pre-flight scaffolding.** See `docs/roadmap.md` for the build plan
and `discovery/decisions-log.md` for locked decisions (D001–D020).

## Stack

- pnpm workspace monorepo
- Next.js 16 (App Router, FR-primary) — `apps/web`
- Payload CMS + Supabase — `apps/cms` (lands in PR-0a-ii)
- Tailwind v4
- TypeScript strict, ESLint 9 flat config, Prettier
- Vitest (unit) + Playwright (e2e) — lands in PR-0b
- Vercel (eu region) deployment

## Setup

```bash
pnpm install
pnpm dev          # apps/web on :3000
pnpm build        # build all packages
pnpm typecheck    # strict TS check across the workspace
pnpm lint         # ESLint
pnpm format:check # Prettier
```

## Repo layout

```
apps/
  web/      Next.js public site + member surfaces
  cms/      Payload CMS (forthcoming)
packages/
  shared/   Cross-app types, schemas, constants
discovery/  Discovery template + Amadou's responses + decisions log
docs/       Roadmap, validation artefacts, PDF deliverables
```

## Validation contract

Every phase passes 7 checks before locking. See `docs/roadmap.md §1`.
