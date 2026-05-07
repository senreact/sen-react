# Sen React — Repo & Claude Code Setup Plan

Status: **draft, awaiting Tom's approval**. Nothing has been scaffolded yet.

Date: 2026-04-23

## Purpose

This document is the synthesis of four research reports (Claude Code deep research, MCP efficiency, Next.js 16 / Supabase / Payload 3.81 stack patterns, Skills inventory across 5 GitHub awesome-lists + Karpathy-derived skills) into a single decision plan.

It answers: **what does "absolutely beast mode" look like for a greenfield Next.js 16 + next-intl + Supabase + Payload + bilingual non-profit platform, built to be maintained by a non-technical Senegalese team?**

Once approved, the `implementation/` folder will mirror this structure 1-to-1.

---

## 1. Architectural Decisions (locked)

| # | Decision | Source | Rationale |
|---|----------|--------|-----------|
| A1 | **Next.js 16.2.x, App Router, `proxy.ts`** (not middleware.ts) | Stack research | 16.2 is current stable; `proxy.ts` rename is official |
| A2 | **next-intl with `localePrefix: 'always'`, `defaultLocale: 'fr'`** | Discovery (Amadou is francophone) | French-first; `/fr/...` and `/en/...` both explicit — easier caching, clearer admin UX |
| A3 | **Payload CMS 3.81.0 with Postgres (Drizzle) adapter** | Stack research | Latest stable; Drizzle adapter is production-grade; localisation fields built in |
| A4 | **Supabase as sole DB (Postgres + Storage + Auth for members)** | User rules + stack research | Matches your standard; avoids Firebase |
| A5 | **Supavisor transaction-mode pooler** (port 6543) for Next.js RSC + API | Stack research | Mandatory for serverless — direct connection will exhaust pool on Vercel |
| A6 | **Vercel, `cdg1` region, Fluid Compute, PPR (cacheComponents)** | User rules + stack research | cdg1 = Paris, closest to Senegal users; PPR for marketing pages, dynamic for dashboard |
| A7 | **Auth split: Supabase Auth (email OR phone + password) for members; Payload Auth (email + password) for REACT staff** | Tom 2026-04-23 | Split is less work than unifying (Payload admin UI is wired to its own auth). No Twilio OTP — password-based only |
| A8 | **Payload Jobs Queue + Supabase `pg_cron`** for aggregation pipeline (no Inngest) | Tom 2026-04-23 | Stay inside Supabase/Payload — pg_cron triggers webhook → Payload job handler; Payload's built-in scheduled tasks for approvals. Removes 3rd-party dependency + cost |
| A9 | **Claude for FR↔EN translation**, Amadou verifies output | Tom 2026-04-23 | No 3rd-party translation service; translations go through review step by native French-speaking director |
| A10 | **Serwist for PWA / offline-first**, AVIF/WebP pipeline | Stack research | Senegal mobile-first, intermittent connectivity |
| A11 | **pnpm workspace monorepo**: `packages/web`, `packages/cms`, `packages/shared` | Stack research | Separates Next.js and Payload build graphs; shared types |
| A12 | **Opus 4.7 only, default effort `xhigh`** for the setup phase | Tom 2026-04-23 | Max capability, no model-switching cognitive load during setup. Revisit for execution later |
| A13 | **CMS-driven dynamic template engine** — Payload `Pages` collection with block-based layout field + reusable blocks library + single `[...slug]` Next.js catch-all that renders blocks dynamically | Tom 2026-04-23 | After hand-off, Amadou's team controls layouts/pages/components via Payload admin without touching code. Long-term: Claude subscription + natural-language site evolution |
| A14 | **REACT CMS autonomy is a first-class goal** — not a nice-to-have | Tom 2026-04-23 | Every build decision must preserve the ability for non-technical REACT staff to change the site themselves. No hard-coded content, no developer-only flows for routine edits |
| A15 | **Pandoc + eisvogel for MD→PDF hand-off docs**, local, free | Tom 2026-04-23 | Markdown is best for iteration internally; PDFs cleaner for non-technical stakeholders. Scripted via `scripts/ops/build-pdfs.sh` |

---

## 2. Repository Structure

```
sen-react/
├── CLAUDE.md                        # ~180 lines: stack, commands, conventions
├── .claude/
│   ├── settings.json                # Committed: permissions, model defaults
│   ├── settings.local.json          # Gitignored: personal overrides
│   ├── rules/                       # Path-scoped rules (load on-demand)
│   │   ├── frontend.md              # paths: ["packages/web/app/**", "packages/web/components/**"]
│   │   ├── api.md                   # paths: ["packages/web/app/api/**"]
│   │   ├── payload.md               # paths: ["packages/cms/**"]
│   │   ├── database.md              # paths: ["packages/cms/migrations/**", "supabase/**"]
│   │   ├── i18n.md                  # paths: ["**/messages/**", "**/[locale]/**"]
│   │   └── accessibility.md         # paths: ["packages/web/components/**"]
│   ├── skills/                      # see §3
│   │   ├── scaffold-payload-collection/SKILL.md
│   │   ├── scaffold-next-page/SKILL.md
│   │   ├── scaffold-api-route/SKILL.md
│   │   ├── i18n-add-key/SKILL.md
│   │   ├── i18n-audit/SKILL.md
│   │   ├── supabase-migrate/SKILL.md
│   │   ├── supabase-rls/SKILL.md
│   │   ├── supabase-regen-types/SKILL.md
│   │   ├── supabase-seed/SKILL.md
│   │   ├── translate-fr-en/SKILL.md
│   │   ├── scraper-new/SKILL.md
│   │   ├── scraper-dry-run/SKILL.md
│   │   ├── deploy-vercel/SKILL.md
│   │   ├── supabase-branch/SKILL.md
│   │   ├── health-check-prod/SKILL.md
│   │   ├── a11y-audit/SKILL.md
│   │   ├── perf-budget-check/SKILL.md
│   │   ├── discovery-to-spec/SKILL.md
│   │   └── seed-react-content/SKILL.md
│   ├── agents/                      # see §4
│   │   ├── schema-auditor.md
│   │   ├── api-reviewer.md
│   │   ├── payload-validator.md
│   │   ├── i18n-enforcer.md
│   │   └── perf-guardian.md
│   ├── hooks/                       # see §5
│   │   ├── hooks.json
│   │   └── scripts/
│   │       ├── block-hardcoded-strings.sh
│   │       ├── verify-rls-on-new-tables.sh
│   │       ├── regen-types-on-schema-change.sh
│   │       └── block-prod-db-writes.sh
│   └── output-styles/
│       └── concise-british.md       # default: British spelling, terse
├── .mcp.json                        # see §6
├── pnpm-workspace.yaml
├── package.json
├── packages/
│   ├── web/                         # Next.js 16 app
│   │   ├── CLAUDE.md                # ~60 lines: Next.js 16 specifics, proxy.ts, i18n helpers
│   │   ├── app/
│   │   │   ├── [locale]/
│   │   │   │   ├── (marketing)/     # PPR-enabled
│   │   │   │   ├── (dashboard)/     # dynamic, auth-gated
│   │   │   │   └── layout.tsx
│   │   │   └── api/
│   │   ├── components/
│   │   ├── messages/
│   │   │   ├── fr.json              # French (default)
│   │   │   └── en.json
│   │   ├── proxy.ts                 # next-intl middleware
│   │   └── package.json
│   ├── cms/                         # Payload admin
│   │   ├── CLAUDE.md                # ~50 lines: Payload patterns, localised fields
│   │   ├── src/
│   │   │   ├── collections/
│   │   │   │   ├── Opportunities.ts
│   │   │   │   ├── Businesses.ts
│   │   │   │   ├── Projects.ts      # REACT's 6 named projects
│   │   │   │   ├── Articles.ts
│   │   │   │   ├── Trainings.ts
│   │   │   │   └── Users.ts
│   │   │   ├── globals/
│   │   │   ├── jobs/                # Payload Jobs Queue handlers
│   │   │   └── access/              # RBAC helpers
│   │   ├── migrations/              # Drizzle-generated
│   │   └── package.json
│   └── shared/
│       ├── src/
│       │   ├── types/
│       │   │   ├── supabase.generated.ts
│       │   │   └── payload.generated.ts
│       │   ├── schemas/             # Zod schemas shared web↔cms
│       │   └── constants/
│       └── package.json
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
├── scripts/
│   └── ops/                         # Local ops scripts (scrapers live inside packages/cms/src/jobs/)
├── docs/                            # this folder
│   ├── setup-plan.md                # (this file)
│   ├── architecture.md              # to be written after approval
│   └── runbooks/
├── discovery/                       # existing discovery work
└── .gitignore
```

---

## 3. Skills Inventory — Full SDLC Pipeline

Organised by SDLC phase. Every skill listed below has a real, repeated workflow in a Sen-React-sized project. No vanity skills.

Legend: **[A]** adopt as-is from community · **[C]** custom build · **[M]** meta (skill-on-skill)

### 3.0 Meta (build these first — they accelerate everything else)

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 0.1 | `skill-new` | [M] | Bootstrap new skill from template |
| 0.2 | `agent-new` | [M] | Bootstrap new subagent |
| 0.3 | `hook-new` | [M] | Bootstrap new hook |
| 0.4 | `rule-new` | [M] | Bootstrap new `.claude/rules/*.md` |
| 0.5 | `simplify` | [A] | Built-in — already loaded |
| 0.6 | `loop` | [A] | Built-in — already loaded |

### 3.1 Discovery

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 1.1 | `discovery-to-spec` | [C] | Parse filled discovery template → update `decisions-log.md`, flag contradictions |
| 1.2 | `whatsapp-to-amadou` | [C] | Draft French WhatsApp with open questions, formal FR, British spelling off |
| 1.3 | `voice-note-to-spec` | [C] | Transcribe + structure voice notes from Amadou into actionable items |
| 1.4 | `competitor-scan` | [C] | Scrape a competitor site, produce feature delta report |
| 1.5 | `persona-build` | [C] | Synthesise user personas from discovery answers |
| 1.6 | `journey-map` | [C] | Build user journey map (member, staff, visitor) |
| 1.7 | `assumption-log` | [C] | Track assumptions needing validation, flag when blocked |
| 1.8 | `requirements-from-notes` | [A] | Karpathy-derived — raw notes → structured requirements |

### 3.2 Planning

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 2.1 | `spec-to-epic` | [C] | Convert a spec section into epics + stories |
| 2.2 | `estimate-effort` | [C] | T-shirt sizing with risk flags |
| 2.3 | `risk-register` | [C] | Append risk to `docs/risks.md` with mitigation |
| 2.4 | `adr-new` | [C] | Architecture Decision Record (number, status, context, decision, consequences) |
| 2.5 | `dependency-graph` | [C] | Map feature dependencies before sprint planning |
| 2.6 | `roadmap-build` | [C] | Generate roadmap from epics + dependencies |
| 2.7 | `sprint-plan` | [C] | Break epic into sprint-sized tasks, check capacity |
| 2.8 | `clickup-sync` | [C] | Push stories into ClickUp via user-scope MCP |

### 3.3 Design

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 3.1 | `figma-pull` | [C] | Pull frame from Figma via MCP, save to `docs/design/` |
| 3.2 | `design-token-extract` | [C] | Extract colours/spacing/typography from Figma → Tailwind config |
| 3.3 | `wireframe-to-rsc` | [C] | Wireframe → RSC component scaffold |
| 3.4 | `component-spec` | [C] | Generate component spec (props, states, a11y, i18n keys) |
| 3.5 | `schema-design` | [C] | Propose DB schema from entity list + relationships |
| 3.6 | `style-guide-update` | [C] | Update `docs/style-guide.md` with new tokens/components |
| 3.7 | `brand-guidelines` | [A] | Loads REACT brand (#010ED0, #242627) into context |

### 3.4 Build — Scaffolding

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 4.1 | `scaffold-payload-collection` | [C] | Payload collection with bilingual fields + access control + hooks |
| 4.2 | `scaffold-payload-field` | [C] | Add field to existing collection, generate migration |
| 4.3 | `scaffold-payload-hook` | [C] | Scaffold collection lifecycle hook (beforeChange, afterRead, etc.) |
| 4.4 | `scaffold-payload-access` | [C] | Scaffold access control function for a collection |
| 4.5 | `scaffold-payload-global` | [C] | Scaffold a Payload global |
| 4.6 | `scaffold-payload-job` | [C] | Scaffold a Payload Jobs Queue task |
| 4.7 | `scaffold-payload-block` | [C] | Scaffold a reusable CMS block (Hero, FeatureGrid, OpportunityList, RichText, etc.) — block definition + React renderer + i18n keys |
| 4.8 | `scaffold-payload-page-type` | [C] | Scaffold a new Pages variant (e.g. ProgrammePage, ArticlePage) with allowed blocks + defaults |
| 4.9 | `scaffold-next-page` | [C] | `app/[locale]/route/page.tsx` with RSC + metadata + loading + error + i18n |
| 4.10 | `scaffold-next-layout` | [C] | Layout with route segments, i18n provider |
| 4.11 | `scaffold-next-catchall` | [C] | `[...slug]` route that fetches Pages from Payload and renders blocks dynamically (CMS-driven rendering engine) |
| 4.12 | `scaffold-api-route` | [C] | Next.js route handler + Zod + Supabase auth guard |
| 4.13 | `scaffold-server-action` | [C] | Server action with revalidation + auth |
| 4.14 | `scaffold-form` | [C] | react-hook-form + Zod + bilingual error messages |
| 4.15 | `rsc-to-client` | [C] | Safely convert RSC to client component (flag serialisation risks) |

### 3.5 Build — i18n & Bilingual

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 5.1 | `i18n-add-key` | [C] | Add key to both `fr.json` and `en.json` atomically |
| 5.2 | `i18n-audit` | [C] | Find untranslated strings, missing keys, divergent structure |
| 5.3 | `translate-fr-en` | [C] | Claude-backed translator, formal register, flags for Amadou review |
| 5.4 | `i18n-extract-page` | [C] | Extract all hard-coded strings from a page into messages files |

### 3.6 Build — Database & Supabase

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 6.1 | `supabase-migrate` | [C] | Generate migration from schema diff, apply locally + to preview branch |
| 6.2 | `supabase-rls` | [C] | Write RLS policy with test cases |
| 6.3 | `supabase-rls-audit` | [C] | Report RLS coverage across all tables |
| 6.4 | `supabase-regen-types` | [C] | Regenerate `supabase.generated.ts`, commit into `packages/shared` |
| 6.5 | `supabase-seed` | [C] | Insert bilingual realistic test data |
| 6.6 | `supabase-branch` | [C] | Create preview branch for a PR |
| 6.7 | `supabase-pgcron-new` | [C] | Scaffold pg_cron job → Payload webhook wiring |
| 6.8 | `supabase-function-new` | [C] | Scaffold Edge Function for cases where RSC isn't enough |
| 6.9 | `supabase-storage-bucket` | [C] | Configure storage bucket with RLS + public/private policies |

### 3.7 Build — Aggregation Pipeline (D001)

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 7.1 | `scraper-new` | [C] | Scaffold new external source adapter (normalises → Opportunities schema) |
| 7.2 | `scraper-dry-run` | [C] | Run scraper against a URL, show output without DB write |
| 7.3 | `opportunity-review-queue` | [C] | List pending aggregated entries awaiting REACT approval |
| 7.4 | `opportunity-normalise` | [C] | Normalise a single aggregated payload to schema |

### 3.8 Testing

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 8.1 | `unit-test-gen` | [C] | Generate Vitest unit tests for a file |
| 8.2 | `integration-test-gen` | [C] | Generate integration test for an API route + DB |
| 8.3 | `e2e-playwright` | [C] | Scaffold Playwright spec for a user journey |
| 8.4 | `payload-admin-smoke` | [C] | Playwright: login → create opportunity → publish → verify public page |
| 8.5 | `webapp-testing` | [A] | Anthropic built-in — Playwright patterns |
| 8.6 | `test-coverage-gap` | [C] | Report untested code paths, suggest priority |
| 8.7 | `api-contract-test` | [C] | Contract tests for API routes from Zod schemas |
| 8.8 | `visual-regression` | [C] | Playwright visual diff for top 20 pages FR + EN |

### 3.9 Quality Gates

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 9.1 | `a11y-audit` | [C] | axe-core scan of top pages, FR + EN |
| 9.2 | `perf-budget-check` | [C] | LCP/INP/CLS + JS/CSS transfer size vs 3G budget |
| 9.3 | `bundle-size-report` | [C] | Next.js bundle analyser, flag regressions |
| 9.4 | `security-review` | [C] | OWASP Top 10 check on auth + API routes |
| 9.5 | `dep-audit` | [C] | `pnpm audit` + outdated report |
| 9.6 | `secret-scan` | [C] | gitleaks-style scan before push |
| 9.7 | `db-slow-query-analyse` | [C] | Supabase slow query log, suggest indexes |

### 3.10 CI/CD

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 10.1 | `github-actions-workflow` | [C] | Scaffold GitHub Actions workflow (lint, test, build, deploy) |
| 10.2 | `pr-template-apply` | [C] | Ensure PR follows template |
| 10.3 | `pr-review` | [C] | Claude-driven PR review against `.claude/rules/` |
| 10.4 | `changeset-add` | [C] | Add changeset for version bump |
| 10.5 | `release-notes` | [C] | Generate release notes from commits |
| 10.6 | `deploy-vercel` | [C] | Controlled deploy via `[deploy]` commit flag |
| 10.7 | `deploy-preview` | [C] | Deploy preview for a branch |
| 10.8 | `rollback` | [C] | Roll back to previous Vercel deployment |
| 10.9 | `commit` | [A] | Enforces incremental commits, British spelling, no co-author |

### 3.11 Infrastructure

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 11.1 | `vercel-config` | [C] | Manage `vercel.json` — regions, env, redirects |
| 11.2 | `env-var-sync` | [C] | Sync env vars between local / preview / production (via Vercel CLI) |
| 11.3 | `secret-rotate` | [C] | Rotate a secret across all environments safely |
| 11.4 | `domain-setup` | [C] | DNS + SSL setup for custom domain |
| 11.5 | `cdn-cache-purge` | [C] | Purge Vercel CDN for specified paths |
| 11.6 | `infra-diff` | [C] | Report drift between config in repo vs actual Vercel/Supabase |

### 3.12 Observability

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 12.1 | `sentry-setup` | [C] | Wire Sentry SDK, source maps, release tags |
| 12.2 | `sentry-triage` | [C] | Triage production errors, create runbook entry |
| 12.3 | `axiom-query` | [C] | Query Axiom logs with saved patterns |
| 12.4 | `alert-config` | [C] | Configure alert thresholds (Sentry / Axiom / uptime) |
| 12.5 | `uptime-check-setup` | [C] | Configure uptime checks for key paths |
| 12.6 | `metric-dashboard` | [C] | Scaffold metrics dashboard (Vercel Analytics / Axiom) |

### 3.13 Data & Content

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 13.1 | `seed-react-content` | [C] | Load 6 REACT projects + 13 training offerings from site scrape into Payload |
| 13.2 | `data-migrate` | [C] | Migrate data between schema versions |
| 13.3 | `data-export` | [C] | Export Payload / Supabase data for backup |
| 13.4 | `data-import-csv` | [C] | Import CSV (member list, opportunity spreadsheet) into Payload |
| 13.5 | `backup-restore` | [C] | Restore from Supabase backup snapshot |

### 3.14 Docs

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 14.1 | `adr-new` | [C] | (see 2.4) |
| 14.2 | `runbook-new` | [C] | Generate runbook template from incident type |
| 14.3 | `api-docs-gen` | [C] | Generate API docs from Zod schemas + route handlers |
| 14.4 | `readme-update` | [C] | Keep root README aligned with repo state |
| 14.5 | `changelog-update` | [C] | Keep CHANGELOG.md aligned with releases |
| 14.6 | `user-guide-fr` | [C] | Generate French user-facing docs (for REACT staff maintenance) |
| 14.7 | `docs-to-pdf` | [C] | Pandoc + eisvogel → PDFs from markdown docs (for hand-off to non-technical stakeholders) |
| 14.8 | `pdf` | [A] | Built-in — REACT generates grant submissions & reports |

### 3.15 Operations

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 15.1 | `health-check-prod` | [C] | Curl key endpoints, check auth/DB/admin/i18n, report latency from EU edge |
| 15.2 | `user-impersonate` | [C] | Impersonate member (with consent) for support debugging |
| 15.3 | `user-invite-staff` | [C] | Invite new REACT staff member to Payload admin |

### 3.16 GitHub Workflow

| # | Skill | Class | Purpose |
|---|-------|-------|---------|
| 16.1 | `issue-triage` | [C] | Triage GitHub issues, apply labels, suggest priority |
| 16.2 | `stale-pr-check` | [C] | Find stale PRs, ping or close |
| 16.3 | `release-tag` | [C] | Create git tag + GitHub release |

### Skills Grand Total
- **Meta:** 6 (4 custom + 2 built-in)
- **Discovery:** 8 (7 custom + 1 adopt)
- **Planning:** 8 (all custom)
- **Design:** 7 (6 custom + 1 adopt)
- **Build — Scaffolding:** 15 (all custom)
- **Build — i18n:** 4 (all custom)
- **Build — DB:** 9 (all custom)
- **Build — Aggregation:** 4 (all custom)
- **Testing:** 8 (7 custom + 1 adopt)
- **Quality Gates:** 7 (all custom)
- **CI/CD:** 9 (8 custom + 1 adopt)
- **Infra:** 6 (all custom)
- **Observability:** 6 (all custom)
- **Data:** 5 (all custom)
- **Docs:** 8 (7 custom + 1 adopt)
- **Ops:** 3 (all custom)
- **GitHub:** 3 (all custom)

**Total: 116 skills** (102 custom build + 4 meta + 5 adopt + 2 built-in + 3 already-user-scoped-via-MCP)

This is a lot. §9 "Adoption Sequence" now handles waves of build to avoid trying to ship everything day 1.

---

## 4. Subagents

Each has isolated context, runs on demand or auto-invokes on matching file patterns.

| Agent | Triggers on | Job |
|-------|-------------|-----|
| `schema-auditor` | changes in `supabase/migrations/**`, `packages/cms/src/collections/**` | Review migration for RLS coverage, index sanity, FK integrity, bilingual field completeness |
| `api-reviewer` | changes in `packages/web/app/api/**` | Verify auth guard, Zod validation, error messages, rate limit |
| `payload-validator` | changes in `packages/cms/src/collections/**` | Collection config sanity, access control, hook correctness, localisation |
| `i18n-enforcer` | changes in `**/messages/**`, `**/components/**` | Ensure FR+EN parity, no hardcoded UI strings, key naming convention |
| `perf-guardian` | changes in `packages/web/app/**` | Flag client components that should be RSC, image optimisation, bundle bloat |

---

## 5. Hooks (deterministic enforcement)

| Hook | Event | Action |
|------|-------|--------|
| `block-hardcoded-strings` | `PreToolUse: Edit` on `packages/web/**/*.tsx` | Block writes containing raw user-facing strings not wrapped in `t()` |
| `verify-rls-on-new-tables` | `PreToolUse: Edit` on `supabase/migrations/**` | Require matching RLS policy when a `CREATE TABLE` is added |
| `regen-types-on-schema-change` | `PostToolUse: Edit` on `packages/cms/src/collections/**` | Auto-run type regen after schema changes |
| `block-prod-db-writes` | `PreToolUse: Bash` | Block any command touching `xvvdxmmtscwvlhmhlski` unless explicitly in an approved script |
| `controlled-deploy` | `PreToolUse: Bash(git push*)` | Warn if pushing to main without `[deploy]` flag |

---

## 6. MCP Configuration

**Project-scoped `.mcp.json` (committed):**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=xvvdxmmtscwvlhmhlski",
        "--features=database,storage,functions",
        "--read-only"
      ]
    }
  }
}
```

Token efficiency: `--project-ref` + `--features` + `--read-only` scoping (per MCP research, this keeps token overhead under 2K vs 10K+ for unscoped MCPs).

**User-scoped already configured** (from `local-environment.md`):
- ClickUp MCP (task creation)
- Figma MCP (design handoff)
- Google Ads MCP (not relevant here)

**Deferred (load via ToolSearch when needed):**
- Memory MCP — only if auto-memory starts overflowing
- Sentry MCP — after production launch
- Payload MCP — if/when a stable one ships

**Explicitly not using:**
- Full Supabase MCP without scoping (token bloat)
- Write-enabled Supabase MCP in repo config (dangerous; override locally if needed)

---

## 7. CLAUDE.md Plan

**Root `CLAUDE.md` (~180 lines):**
1. What Sen React is (2 lines)
2. Stack summary (8 lines)
3. Monorepo layout + package purposes (10 lines)
4. Commands (`pnpm dev`, `pnpm migrate`, `pnpm seed`, `pnpm test:e2e`) (12 lines)
5. Conventions (French-first, bilingual parity, British spelling in code/comments) (15 lines)
6. Non-negotiables (link to `.claude/rules/` files instead of inlining)
7. Current priorities (link to `docs/architecture.md`)
8. Pointers to skills for common tasks

**Package `CLAUDE.md`s (~50–60 lines each):**
- `packages/web/CLAUDE.md` — Next.js 16 gotchas (`proxy.ts`, RSC-first, `cacheComponents`)
- `packages/cms/CLAUDE.md` — Payload patterns (localised fields, access control, jobs queue)
- `packages/shared/CLAUDE.md` — type regeneration workflow, Zod schema location

---

## 8. Settings.json Plan

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Bash(pnpm *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(npx supabase *)",
      "Edit(./packages/**)",
      "Edit(./docs/**)",
      "Edit(./discovery/**)",
      "Read(.)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Bash(git push --force*)",
      "Read(.env*)",
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)"
    ],
    "ask": [
      "Bash(git push*)",
      "Bash(vercel *)",
      "Bash(pnpm publish*)"
    ]
  },
  "model": "claude-opus-4-7",
  "effort": "xhigh",
  "controlledDeploy": true
}
```

---

## 9. Adoption Sequence

112 skills cannot ship on day 1. We build in 5 waves, each wave unlocks the next SDLC phase.

**Wave 0 — Meta & Foundation (day 1)**
Everything below bootstraps the rest.
- Monorepo + package.json + pnpm-workspace
- Root `CLAUDE.md` + package `CLAUDE.md`s
- `.claude/settings.json`, `.mcp.json`, all 6 `.claude/rules/*.md`
- Meta skills: `skill-new`, `agent-new`, `hook-new`, `rule-new` (§3.0)
- 2 initial hooks: `block-hardcoded-strings`, `verify-rls-on-new-tables`
- 1 initial subagent: `schema-auditor`
- Community adopts: `simplify` (already loaded), `loop` (already loaded), `commit`, `brand-guidelines`

**Wave 1 — Discovery & Planning (week 1)**
Get the rest of Amadou's answers structured.
- All §3.1 discovery skills (8)
- All §3.2 planning skills (8)
- All §3.3 design skills (7)
- Subagent: `i18n-enforcer`

**Wave 2 — Build Scaffolding (weeks 1–2)**
Enable rapid vertical-slice development.
- All §3.4 scaffolding skills (12)
- All §3.5 i18n skills (4)
- All §3.6 database skills (9)
- Subagents: `api-reviewer`, `payload-validator`
- Hook: `regen-types-on-schema-change`

**Wave 3 — First Vertical Slice + Testing (weeks 2–4)**
Build Dashboard of Opportunities end-to-end.
- All §3.7 aggregation skills (4)
- All §3.8 testing skills (8)
- All §3.13 data skills (5) — to load REACT's real content

**Wave 4 — Quality, CI/CD, Observability (weeks 4–6)**
Prepare for staging + launch.
- All §3.9 quality gate skills (7)
- All §3.10 CI/CD skills (9)
- All §3.11 infra skills (6)
- All §3.12 observability skills (6)
- Subagent: `perf-guardian`
- Hook: `block-prod-db-writes`, `controlled-deploy`
- Sentry MCP added

**Wave 5 — Launch & Ongoing Ops (week 6+)**
- All §3.14 docs skills (7)
- All §3.15 ops skills (3)
- All §3.16 GitHub workflow skills (3)

Each wave ends with a commit tagged `wave-N-complete` so we can pin progress.

---

## 10. Open Decisions for Tom

Before I scaffold any of this, confirm:

1. **Monorepo confirmed** — `pnpm` workspace with `web`/`cms`/`shared`. Matches Lappie pattern. Approve?

2. **Auth confirmed** — Payload Auth for staff, Supabase Auth (email OR phone + password, no OTP) for members. Approve?

3. **Inngest dropped** — Payload Jobs Queue + `pg_cron` for aggregation. Approve?

4. **Opus-only (4.7, xhigh default)** for setup phase. Revisit later for execution. Approve?

5. **Projects/Programmes** — deferred (not a direct Amadou requirement; surfaced from site scrape only). Revisit if he adds it to his discovery answers.

6. **French WhatsApp to Amadou** — deferred (Tom 2026-04-23).

7. **Skill scope** — full 112-skill SDLC pipeline, no deprioritisation (Tom 2026-04-23).

---

## 11. Not Doing (explicit omissions)

- **No Twilio / OTP** (Tom 2026-04-23 — plain email/phone + password via Supabase)
- **No Inngest** (Tom 2026-04-23 — Payload Jobs Queue + pg_cron instead)
- **No agent teams** (experimental, wait for stable release)
- **No remote tasks / Chyros** (beta, unstable)
- **No Firebase** (deprecated per your rules)
- **No Netlify** (Vercel-only per your rules)
- **No DeepL / no 3rd-party translation service** (Tom 2026-04-23 — Claude translates, Amadou verifies)
- **No unscoped MCP servers** (token bloat)
- **No Python services** (all-TypeScript per `tech-stack.md`)
- **No in-platform B2B messaging** (D002 — directory only)
- **No rating/review system** (D002)
- **No premium/boosted listings in v1** (architecture allows adding later)
- **No Sonnet during setup** (Tom 2026-04-23 — Opus only until post-setup review)

---

## Appendix A — Research Source Files

- `docs/research/claude-code-research.md` — 72KB, 20 sections on Claude Code (April 2026) — copied from `/tmp/` into the repo for persistent access
- MCP efficiency research — in-memory, synthesised above
- Stack patterns (Next 16 / Supabase / Payload 3.81) — in-memory, synthesised above
- Skills inventory across 5 GitHub repos + Karpathy — in-memory, synthesised into §3

## Appendix B — Decisions Deferred

These are in `discovery/decisions-log.md`; not repeated here:
- D001: Dashboard of Opportunities = manual + aggregation hybrid
- D002: B2B = directory-only

---

**Next step:** Tom reviews this plan. When green-lit, I execute Wave 1 and commit it as a single atomic "scaffolding" commit so it can be cleanly reverted if anything is off.
