# Compliance Skills — Design Spec

**Status:** Draft v1, 2026-05-08
**Author:** Tom + Claude
**Owner:** Tom Shields

## 1. Purpose

Codify a reusable, project-agnostic audit + remediation pattern as Claude Code **skills**, so any future project on the **Supabase + Vercel + Next.js (+ optional Payload CMS)** stack can:

1. Run an automated **audit** of a specific concern area ("chunk")
2. Get a written report following a consistent per-chunk markdown format
3. Run an accompanying **remediation** skill that applies fixes — interactively, idempotently, and without destroying state

The end state: ten audit skills + ten remediation skills (one pair per chunk), invokable as `/audit-01-db-integrity`, `/remediate-01-db-integrity`, etc.

The skills are user-scope (under `~/.claude/skills/compliance/`) so they're available across all projects.

## 2. Chunk taxonomy

Ten chunks, ordered by blast radius (loosely — Critical-first):

| # | Chunk | Concern |
|---|---|---|
| 01 | `db-integrity` | Database: schema, RLS, ACLs, backups, network, TLS, auth, indexes |
| 02 | `secrets-env-deploy` | Secrets, env vars, deploy pipeline, lockfiles, CVEs, branch protection |
| 03 | `auth-access` | Auth providers, session management, role inventory, rate limits |
| 04 | `performance` | DB query patterns, Vercel function regions, edge config, ISR |
| 05 | `content-pipeline` | CMS content flow, translations, media uploads, PII handling |
| 06 | `seo-canonical` | Canonical URLs, sitemaps, robots.txt, meta-tags, OG cards |
| 07 | `security-hardening` | CORS/CSRF, rate limits, spam protection, input validation, headers |
| 08 | `observability` | Logs, metrics, tracing, alerting, error reporting |
| 09 | `dr-bcp` | Backups, runbooks, rollback procedures, disaster scenarios |
| 10 | `devex-hygiene` | Pre-commit, CI matrix, formatter/linter strictness, package mgr discipline |

Numbering is fixed so cross-references between chunks (e.g. "see F18 of chunk 1") remain stable across projects.

## 3. Skill anatomy

Each skill is a single markdown file with frontmatter, stored at `~/.claude/skills/compliance/`:

```
~/.claude/skills/compliance/
├── audit-01-db-integrity.md
├── audit-02-secrets-env-deploy.md
├── ...
├── remediate-01-db-integrity.md
├── remediate-02-secrets-env-deploy.md
└── ...
```

### 3.1 Frontmatter

```yaml
---
name: audit-02-secrets-env-deploy
description: Audit secrets, env vars, deploy pipeline. Read-only checks against Vercel API, GitHub API, lockfiles, and codebase. Writes report to docs/audit/02-secrets-env-deploy.md.
user-invocable: true
---
```

### 3.2 Audit-skill body structure

1. **Inputs / discovery** — what env vars to read, which APIs to call, how to detect project shape (e.g. presence of `payload.config.ts` → run Payload-specific checks)
2. **Snapshot block writer** — capture git HEAD, ISO timestamp, branch, working-tree dirtiness, project IDs
3. **Files-inspected helper** — for each file the audit reads, capture last-commit SHA + last-touched date
4. **Probe sequence** — the actual checks, ordered cheap-first
5. **Finding writer** — for each issue: Where / What / Why / Remediation reference / Owner / Severity
6. **Severity rubric** — Critical / High / Med / Low / Info (defined in §6)
7. **Re-sweep handler** — if `docs/audit/0X-chunk.md` already exists, append "Nth-sweep addendum" rather than overwriting
8. **Severity summary table** — at end of report

### 3.3 Remediation-skill body structure

1. **Read source report** — `docs/audit/0X-chunk.md` is the input
2. **Per-finding handler** — for each F-numbered finding in the report:
   - **Auto-fixable** → propose diff, ask before applying, apply, verify
   - **External-action-required** → emit checklist with deep-link URLs (Supabase dashboard, Vercel settings, GitHub branch protection, etc.)
   - **Already-resolved** → mark and skip
3. **Idempotency** — re-running after partial fix reconciles state, never re-applies
4. **Confirmation gates** — destructive ops (DROP TABLE, REVOKE, force-push, key rotation) require explicit per-action confirmation
5. **Remediation log** — append to `docs/audit/0X-chunk.md` under "## Remediation log" section: timestamp, finding ID, action taken, verification

### 3.4 Remediation autonomy

**Default: fully interactive.** Per finding, the remediation skill proposes the change, shows the diff or command, and waits for explicit confirmation before applying. No batch mode in v1.

## 4. Input contract (project discovery)

Skills are project-agnostic. They discover what to audit by:

1. **Reading `.env.audit`** (gitignored) for credentials. Required keys (skill validates and bails early with clear error if missing):
   - `SUPABASE_PROJECT_REF` — e.g. `lhieyipykopqyeydrwoo`
   - `SUPABASE_PAT` — Supabase Management API token (`sbp_…`)
   - `SUPABASE_DB_URL` — full `postgres://...` connection string for direct psql probes
   - `VERCEL_TOKEN` — Vercel PAT (`vcp_…`)
   - `VERCEL_TEAM_ID`, `VERCEL_PROJECT_ID`
   - `GH_REPO` — `<owner>/<name>` (only needed for chunks 02, 10)
   - Skills may opportunistically fall back to `.env.local` for keys it already contains, to avoid duplication
2. **Filesystem detection** — what to skip:
   - No `apps/cms` or `payload.config.ts` → skip Payload-specific probes
   - No `supabase/config.toml` → skip Supabase-CLI-specific probes
   - No `.github/workflows/` → flag, but don't error
3. **Working-directory resolution** — skill always operates on `process.cwd()`. Never hardcode paths.

A `.env.audit.example` ships with each skill listing required keys.

## 5. Output contract (report format)

Each audit skill writes to `docs/audit/0X-<chunk>.md` in the project root.

```markdown
# Chunk 0X — <Chunk Name>

## Snapshot
- **Audit run:** <ISO timestamp with TZ>
- **Git HEAD:** <SHA> — <subject>
- **Branch:** <branch>
- **Working tree dirty:** yes/no — <details>
- **Vercel project:** <project_id> (<name>), team <team_id>
- **Supabase project:** <ref> (<name>), region <region>
- **Auth context:** <gh user, PATs loaded>

## Files inspected
| File | Last commit | Last touched | Subject |
|---|---|---|---|
| ... | ... | ... | ... |

Plus: <list of API queries / external checks made>

## Method
1. <step>
2. <step>
...

## Findings

### F1 — <one-line title> [SEVERITY]
**Where:** <file:line OR API endpoint>
**What we found:** <observation>
**Why it matters:** <impact + when it crystallises>
**Remediation reference:** <fix sketch, never executed by audit skill>
**Owner:** <who, when>

---

### F2 — ...

## Open questions / follow-ups
1. ...

## Summary of severities
| Severity | Count |
|---|---:|
| Critical | N |
| High | N |
...

## Re-audit / second sweep — <ISO timestamp>
Same `HEAD: <sha>`. Additional findings the first pass missed.

### F<n+1> — ...

### Updated severities (post second sweep)
...
```

Re-sweep mechanic: subsequent runs **append** new findings, never overwrite. Stable F-numbers across sweeps mean cross-references hold.

## 6. Severity rubric

Codified in a shared snippet that all audit skills include:

- **Critical** — currently exploitable, currently lossy, or production-down. Action required before next deploy.
- **High** — exploitable in realistic scenarios; or compounds another finding into Critical. Fix this sprint.
- **Med** — defense-in-depth gap; latent risk that crystallises under future change. Schedule.
- **Low** — hygiene / polish. Backlog.
- **Info** — verified positives or context.

## 7. Re-audit / re-remediation protocol

- Audit skill: idempotent. Re-running on the same git HEAD produces identical findings. Re-running on a new HEAD writes a new sweep section.
- Remediation skill: idempotent. Re-running detects already-applied fixes and skips them. State derived from filesystem + API state, not from a side-channel marker file.
- Findings stay numbered F1, F2, … across all sweeps. Sweep metadata (`sweep`, `addedAt`) lives in the report markdown, not the F-number.

### 7.1 Multi-sweep practice

A single audit pass typically misses 20-30% of findings. The *practice* — empirically validated — is to run the audit **3-4 times**, each pass targeting a different angle:

1. **Sweep 1** — broad coverage, hit every probe in §8
2. **Sweep 2** — fill the gaps found in sweep 1; add probes the first pass overlooked (e.g., default-ACL trap, role inventory, PII column scan)
3. **Sweep 3** — go one layer deeper on highest-risk findings (e.g., if RLS is off, prove the exposure with a live anon probe; if branch protection is missing, list every guardrail not in place)
4. **Sweep 4** — targeted at file-mode hygiene, rotation history, build-artefact scans — the things that only matter once the obvious stuff is documented

The audit skill should prompt the user after each sweep: "Sweep N complete, M new findings. Run sweep N+1?" Convergence is reached when a sweep produces zero new findings.

## 8. Per-chunk check inventory (skeleton)

The full check list per chunk lives in each skill's body. Skeleton sketches:

### 8.1 Chunk 01 — `db-integrity`
- Supabase Mgmt API:
  - `GET /v1/projects/<ref>` — region
  - `GET /v1/projects/<ref>/config/database/pooler` — pooler host
  - `GET /v1/projects/<ref>/config/database/postgres` — version, settings
  - `GET /v1/projects/<ref>/network-restrictions` — IP allow-list (warn if `0.0.0.0/0`)
  - `GET /v1/projects/<ref>/config/auth` — signup open?
  - `GET /v1/projects/<ref>/api-keys` — legacy + new active simultaneously?
  - PITR / backup config (`/v1/projects/<ref>/database/backups`)
- psql via `SUPABASE_DB_URL`:
  - **Schema + RLS:** `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname IN ('public', '<app_schemas>')`
  - **Default-ACL trap:** `SELECT * FROM pg_default_acl` (see §11)
  - **Current grants:** `SELECT * FROM information_schema.role_table_grants WHERE grantee IN ('anon','authenticated')`
  - **Role inventory:** `SELECT rolname, rolsuper, rolcreaterole, rolcreatedb, rolcanlogin, rolbypassrls FROM pg_roles` — flag any non-superuser role with effective superuser-equiv flags
  - **Settings:** `SHOW max_connections`, `SHOW idle_in_transaction_session_timeout`, `SHOW ssl`, `SHOW log_min_duration_statement` (slow-query log)
  - **Autovacuum settings:** per-table `pg_class.reloptions` and `pg_stat_user_tables` (detect tables with autovacuum disabled or starved by activity)
  - **Index inventory:** existing indexes vs the columns appearing in slow-query WHERE clauses (catches missing indexes flagged by query stats)
  - **Query stats:** `SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 20` — catches schema-introspection storms from ORMs in dev mode, missing indexes, and the most expensive query patterns
  - **PII column heuristic:** scan `information_schema.columns` for column names matching `email`, `phone`, `ssn`, `passport`, `dob`, `password`, `token`, `secret`, `card`, `cvv`, `address` — cross-reference against tables without RLS or with broad anon grants
  - **Plaintext-credential columns:** on auth/user tables, identify `salt`, `hash`, `reset_token`, `password_*` and verify they are not readable by `anon`/`authenticated`
  - **pg_cron / scheduled jobs:** `SELECT * FROM cron.job` (or note if `pg_cron` extension is not installed) — empty-but-installed is a flag
- Anon-key REST probes:
  - `GET /rest/v1/` — schema enumeration
  - `GET /rest/v1/<table>?select=*` for each public table
  - `POST /rest/v1/<table>` with junk payload — INSERT probe
- Vercel project region vs Supabase region — flag if mismatch (latency tax)
- Migration history: does `migrations/` exist? Is it tracked in git? Does Payload's `payload_migrations` table show entries?
- Single-DB-for-dev-and-prod check (one project ref serving both, by inspecting Vercel env-var inventory across targets)

### 8.2 Chunk 02 — `secrets-env-deploy`
- Git history:
  - `git log --all -p -S '<prefix>'` for known secret prefixes (`sbp_`, `vcp_`, `service_role`, `eyJhbGc`, `ghp_`, `sb_secret_`, `sk_live_`, `sk_test_`)
  - `git log --all --diff-filter=A --name-only -- '.env*' '**/.env*'` — was an env file ever committed?
- `.gitignore` covers `.env*`?
- `pnpm audit --prod --json` parsed by severity
- Vercel API:
  - Project settings: `productionBranch`, `gitForkProtection`, `autoExposeSystemEnvs`, `deploymentExpiration`, `nodeVersion`
  - `vercel.json` present? — flag absence (deploy config drifts via UI is harder to reproduce); suggest minimal pinning of region + function maxDuration
  - Env-var inventory: keys × targets (production/preview/development) — flag any keys missing from a target where they're needed
  - Env-var rotation timestamps: `createdAt` and `updatedAt` per env var — flag secrets that have never been rotated since project creation, recommend cadence (12 months for application secrets)
  - Last 50 deployments: error rate, target distribution
  - Build-log scan of latest READY deploy for secret-shaped strings (catches accidental `echo $DATABASE_URL`)
  - Source maps probe: `GET <site>/_next/static/chunks/main.js.map` → expect 404
- GitHub API:
  - `branches/<default>/protection` — protection rules (or 404)
  - `collaborators` — who has push access
  - `actions/secrets` — Actions-level secrets
  - `keys` — deploy keys
  - `installation` — installed Apps
  - Commit signature: `git log --pretty=format:%G?` — % signed
- Local: `stat .env.local` → mode (warn if not `0600`)
- Secret-entropy check: read `PAYLOAD_SECRET`, `PAYLOAD_PREVIEW_SECRET`, any other application secret from `.env.local`; flag if length < 32 bytes / not hex / appears human-typed (e.g., dictionary-word patterns). Recommend `openssl rand -hex 32`.
- Codebase grep: `process.env.*` inventory
- Codebase grep: `NEXT_PUBLIC_*` leakage check (any sensitive value behind a `NEXT_PUBLIC_` prefix?)
- Codebase grep: `cors`/`csrf`/`trustedOrigins` in `payload.config.*`
- Codebase grep: hardcoded `/Users/...` paths
- Codebase grep: `DROP TABLE`, `TRUNCATE`, `DELETE FROM` in committed `scripts/**`
- `supabase/config.toml` (if present): scan for hardcoded secrets — every value should resolve via `env(VAR_NAME)` placeholder, never literal
- Pre-commit infrastructure: `.husky/`, `.githooks/`, `husky` / `lint-staged` / `prepare` script in `package.json` — flag absence; recommend lint-staged + a destructive-SQL guard
- Lockfile: both `pnpm-lock.yaml` and `package-lock.json` present?
- `packageManager` field in `package.json` — pinning prevents accidental npm/yarn invocations
- `.env.example` exists?
- CORS preflight: `OPTIONS <site>/api/<path>` from foreign origin
- Build artefact (`.next/`) grep for secret patterns
- Payload version vs latest npm (if Payload present)
- PAT scope check: probe what each PAT in `.env.audit` can do; flag full-account-access PATs (e.g., Vercel PAT that can list other tokens via `GET /v3/user/tokens`)

### 8.3 Chunks 03-10 — defer detail to per-skill spec

Skeletons follow the same shape: each chunk has a defined set of API queries, psql probes, codebase greps, and external probes. Detail lives in the skill body.

## 9. Skill development order

1. **Spec doc** (this document) — approve before any code
2. **Pilot:** `audit-02-secrets-env-deploy` — lower risk (read-only, no Critical findings expected on a fresh project)
3. **Pilot:** `remediate-02-secrets-env-deploy` — exercises the apply-with-confirmation flow
4. **Run pilot pair on sen-react** — validate the format, the discovery, the report output
5. **Build:** `audit-01-db-integrity` + `remediate-01-db-integrity` — heaviest skill, blueprint now proven
6. **Run on sen-react** — validate again
7. **Backlog:** chunks 03-10 — opportunistic, as need arises
8. **Resume PR-0b** for sen-react with the audit infrastructure already in place

## 10. CI integration (out of scope for v1)

Eventually we'll want the audit skills runnable from a GitHub Action so the report regenerates on every push and we get drift-detection PRs (e.g., "F4 — Payload one minor behind: now resolved"). That's a v2 concern. v1 is CLI-invoked only — humans run the skill, humans read the report. Listed here so it's tracked, not implemented.

## 11. The default-ACL landmine (current sen-react state)

This is a project-specific concern uncovered while writing this spec, kept here for the chunk-01 audit skill's spec but not to lose track of:

**Observation:** Supabase projects ship with `pg_default_acl` rows that grant `anon` and `authenticated` full SELECT/INSERT/UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER (`arwdDxtm`) on **any future table created in the `public` schema**. This is Supabase's documented default — the intended pattern is that you enable RLS on every public table to lock it down.

**Risk:** any code path (a manual `CREATE TABLE`, a migration, a Payload schema-push misconfigured to land in `public`) creates a wide-open table. RLS off + default grants on = anon key can read/write the whole thing via PostgREST.

**Sen-react today:** the `public` schema is empty. Payload tables are isolated under the `payload` schema (which is *not* exposed to PostgREST by default). So we're safe right now — but the trap is loaded.

**Mitigation options:**
- **Proactive:** `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;` — and same for `FUNCTIONS` / `SEQUENCES`. Removes the landmine entirely. Departure from Supabase's documented default; means future `public.*` tables will be locked down by default and RLS becomes the *additive* layer.
- **Reactive:** at the moment we add our first `public.*` table, ensure RLS is enabled and explicit grants are written.
- **Skill-driven:** chunk-01 audit skill flags this every time; chunk-01 remediation skill offers the proactive `ALTER DEFAULT PRIVILEGES` as an interactive option.

**Decision pending — Tom to choose.** Locked into the chunk-01 skill spec either way: the audit always reports the state, the remediation always offers the lock-down, and the project decides per-run.

## 12. Acceptance criteria for skill v1

A skill pair is "v1-complete" when:

- [ ] Audit skill runs end-to-end on a fresh project clone with only `.env.audit` set
- [ ] Audit skill writes a markdown report matching the format in §5 exactly (headings, severity table, F-numbered findings)
- [ ] Audit skill is idempotent — second run on same HEAD produces identical output
- [ ] Audit skill correctly detects project shape (skips Payload checks if no Payload, etc.)
- [ ] Remediation skill reads the audit report and proposes per-finding actions
- [ ] Remediation skill confirms before any destructive op
- [ ] Remediation skill is idempotent — second run after partial apply detects state, skips done items
- [ ] Both skills validated on at least two different projects (sen-react first, second TBD)

---

**Next step:** review + approve. After sign-off, scaffold `audit-02-secrets-env-deploy` first (per §9).
