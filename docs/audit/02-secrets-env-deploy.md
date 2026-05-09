# Chunk 02 — Secrets, Env & Deploy Pipeline

## Snapshot

- **Audit run:** 2026-05-09T00:25:52+02:00 (SAST)
- **Git HEAD:** `7d4961a` — *Merge pull request #1 from tomasi001/feat/ci-and-first-deploy*
- **Branch:** `main`
- **Working tree dirty:** no (0 modified files)
- **Vercel project:** `prj_DYG5jkvz4rqzIL0ZofQ5UviaAIF5` (`sen-react`), team `team_5d9lOjfriI9XhGyqYDJ5ZFGe` (`tomasi001s-projects`)
- **GitHub repo:** `tomasi001/sen-react`
- **Auth context:** `gh` as `tomasi001`, Vercel PAT (`vcp_…`) loaded from `.env.local`

## Files inspected

| File | Last commit | Last touched | Subject |
|---|---|---|---|
| `.gitignore` | `fee731b` | 2026-05-07 | Add .env.example for Supabase + Payload, ignore supabase/.temp |
| `.env.example` | `dfa6891` | 2026-05-08 | PR-0a-ii: scaffold Payload CMS at apps/cms with hardened defaults |
| `package.json` | `dfa6891` | 2026-05-08 | PR-0a-ii: scaffold Payload CMS at apps/cms with hardened defaults |
| `pnpm-lock.yaml` | `dfa6891` | 2026-05-08 | PR-0a-ii: scaffold Payload CMS at apps/cms with hardened defaults |
| `apps/cms/src/payload.config.ts` | `dfa6891` | 2026-05-08 | PR-0a-ii: scaffold Payload CMS at apps/cms with hardened defaults |
| `apps/cms/package.json` | `dfa6891` | 2026-05-08 | PR-0a-ii: scaffold Payload CMS at apps/cms with hardened defaults |
| `.github/workflows/ci.yml` | `61b368c` | 2026-05-08 | PR-0b: add GitHub Actions CI workflow |

Plus codebase-wide grep for secret-prefix patterns across full git history (`sbp_`, `vcp_`, `service_role`, `eyJhbGc`, `ghp_`, `sb_secret_`, `sk_live_`, `sk_test_`, `AKIA`), Vercel API queries (project settings, env-var inventory with rotation timestamps, deployment history, build-log events for the latest READY deployment), GitHub API queries (branch protection, collaborators, Actions secrets, deploy keys), live HTTPS probes against `https://sen-react.vercel.app` (source map and CORS preflight), local file-mode check, secret-entropy analysis of `.env.local`, and Payload version comparison vs npm latest.

## Method

1. Pre-flight: validate required credentials in `.env.audit` / `.env.local`. All present.
2. Git history scan for ever-committed env files and known secret-prefix patterns.
3. `.gitignore` audit.
4. `pnpm audit --prod` for dependency CVEs.
5. Vercel API: project settings, `vercel.json` presence, env-var inventory with rotation timestamps, deployment history, build-log scan.
6. GitHub API: branch protection state, collaborators, Actions secrets, deploy keys, commit-signature rate.
7. Live HTTPS probes: source map availability, CORS preflight from foreign origin.
8. Local: `.env.local` file mode, secret-entropy check via Shannon analysis.
9. Codebase grep: `process.env.*`, `NEXT_PUBLIC_*`, hardcoded `/Users/` paths, destructive SQL, Payload `cors`/`csrf` config.
10. `supabase/config.toml` literal-value scan.
11. Lockfile + package-manager hygiene (`pnpm-lock.yaml`, `packageManager` field).
12. Pre-commit infrastructure detection (`.husky/`, `lint-staged`).
13. Build artefact secret scan (`.next/`).
14. Payload version comparison vs npm latest.
15. PAT scope verification.

---

## Findings

### F1 — No branch protection on `main` [HIGH]

**Where:** `gh api repos/tomasi001/sen-react/branches/main/protection` → **HTTP 404 "Branch not protected"**.

**What we found:** `main` has no protection rules. Anyone with write access (currently only `tomasi001`) can:
- Push directly to `main` without a PR.
- Force-push and rewrite history.
- Delete the branch.
- Merge a PR without the CI status check passing.

**Why it matters:** We just ceremonially used the PR-and-preview workflow for PR #1, but nothing structurally prevents the next commit from being pushed straight to `main`. The CI workflow (`.github/workflows/ci.yml`) runs on every push but isn't *required* — a failing CI doesn't block a merge. The threat model today is small (single committer), but the guardrail is the only thing that stops a one-keystroke disaster (force-push that rewrites the last week of history; or a merge without green CI that breaks the prod deploy).

**Remediation reference:** Enable branch protection on `main` via GitHub API:

```bash
gh api -X PUT "repos/tomasi001/sen-react/branches/main/protection" \
  -f required_status_checks='{"strict":true,"contexts":["Lint, format, typecheck, build"]}' \
  -f enforce_admins=false \
  -f required_pull_request_reviews='{"required_approving_review_count":0,"dismiss_stale_reviews":true}' \
  -f restrictions=null \
  -f required_linear_history=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false
```

(`required_approving_review_count: 0` — single-committer reality; tighten to 1 when team grows. `enforce_admins: false` — keep an emergency override available since admin = sole committer.)

**Owner:** Tom — apply now (closeout step C of this session).

---

### F2 — Commits are unsigned [MED]

**Where:** `git log --pretty=format:'%G?' -20` → 1 `E` (good signature, but expired key) + 6 `N` (no signature) on the 7 commits in repo history.

**What we found:** None of the project's commits carry a verified signature. One commit (the GitHub merge commit `7d4961a`) shows `E` — signed by GitHub, but the key has expired. The rest are unsigned.

**Why it matters:** Defense-in-depth posture. Today the access surface is one human (`tomasi001` admin). The risk crystallises if the GitHub account is compromised: an attacker could push commits attributed to "tomasi001" with no cryptographic difference visible to a future auditor. Enabling signed commits means a stolen GitHub token alone isn't enough — the attacker would also need the signing key.

**Remediation reference:**
- Configure SSH-signing on Tom's local git: `git config --global commit.gpgsign true && git config --global gpg.format ssh`
- Add an SSH key as a signing key in GitHub: Settings → SSH and GPG keys → New SSH key → choose "Signing Key"
- Once signed commits become the norm (≥10 verified commits), add `required_signatures: true` to the F1 branch protection rule.

**Owner:** Tom — opportunistic. Not blocking, but should be enabled before the team grows.

---

### F3 — Payload installed at `^3.84.0`, latest is `3.84.1` [LOW]

**Where:** `apps/cms/package.json:18-23` — every `@payloadcms/*` and `payload` line at `^3.84.0`. npm latest: `3.84.1`.

**What we found:** Caret range allows the resolver to pick `3.84.1` on next install, and the lockfile probably already has it (the resolution happened during the most recent `pnpm install`). The literal version strings in `package.json` are one patch behind. Caret is doing its job; the cosmetic discrepancy is the visible smell.

**Why it matters:** Low. Payload releases all packages in lockstep and recommends matching versions. Our `package.json` shows `^3.84.0` for all 5 Payload packages, which is internally consistent. No action needed unless we want to bump the literal pin.

**Remediation reference:** Optional:
```bash
cd apps/cms && pnpm update payload @payloadcms/db-postgres @payloadcms/next @payloadcms/richtext-lexical @payloadcms/ui --latest
```
Will update both `package.json` and lockfile to the latest matched version.

**Owner:** Tom — opportunistic, batch with future Payload upgrades.

---

### F4 — No `vercel.json` in repo [LOW]

**Where:** Repo root — `vercel.json` absent. Deploy config lives entirely in Vercel UI state.

**What we found:** The Vercel project's region, function `maxDuration`, build command, etc. are all configured via the dashboard. No code-level pinning exists.

**Why it matters:** Reproducibility. If the project's Vercel settings drift (UI clicks, autodetect changes), there's no source-of-truth diff to review. For a single-app project today this is mostly cosmetic. Becomes meaningful when:
- Multiple environments (staging, prod) need to share the same config.
- A future contributor needs to recreate the project from scratch.
- We want to pin function regions explicitly to match Supabase region (eu-west-3) for latency.

**Remediation reference:** Add a minimal `vercel.json` at repo root:
```json
{
  "regions": ["cdg1"],
  "functions": {
    "apps/web/src/app/**/*.ts": { "maxDuration": 30 }
  }
}
```
(`cdg1` is Paris — co-located with the Supabase project's `eu-west-3` Paris region for sub-10ms inter-service latency. Verify Vercel project's current region setting matches before committing.)

**Owner:** Tom — opportunistic, do alongside the chunk-04 (performance) audit when latency becomes a concern.

---

### F5 — No husky / lint-staged / pre-commit infrastructure [LOW]

**Where:** No `.husky/`, no `.githooks/`, no `lint-staged` field or `prepare` script in root `package.json`.

**What we found:** Nothing runs before a commit lands locally. The `.github/workflows/ci.yml` catches issues at PR time, but a developer can produce a `git commit` that fails lint/typecheck and only learns about it after pushing.

**Why it matters:** Defense-in-depth + iteration speed. Husky + lint-staged would catch:
- ESLint violations on staged files.
- Prettier drift on staged files.
- Future custom rules (e.g., destructive-SQL guard analogous to chunk 01's `pg_default_acl` concern).

For a fast-moving solo developer, it's the highest-ROI single hygiene tool — converts every commit into a self-checked artefact.

**Remediation reference:** Add to root `package.json`:
```json
"scripts": { "prepare": "husky" },
"lint-staged": {
  "**/*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix"],
  "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,css}": ["prettier --write"]
}
```
And run `pnpm add -D husky lint-staged && pnpm exec husky init`. Then create `.husky/pre-commit`:
```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm exec lint-staged
```

**Owner:** Tom — opportunistic. Tackle alongside the chunk-10 (DevEx) audit, or earlier if the no-pre-commit-net starts biting.

---

### F6 — `.env*` is properly gitignored, no real env file ever committed [INFO — positive]

**Where:**
- `.gitignore` lines 14-18: `.env`, `.env.local`, `.env.*.local`, `.env.preview`, `.env.production`.
- `git log --all --diff-filter=A --name-only -- '.env*'` → only `.env.example` (which is intended-to-be-committed).

**What we found:** Across the entire git history (every commit, every branch), no `.env`, `.env.local`, `.env.production`, etc. has ever been added. The only env file in version control is `.env.example`, which is a template with no real values.

**Why it matters:** Lowest-tier mistake — committing a real env file with a live `DATABASE_URL` — has been avoided cleanly. Audit-positive.

**Remediation:** None.

---

### F7 — `pnpm audit --prod` returns zero vulnerabilities [INFO — positive]

**Where:** `pnpm audit --prod --json` → `{ critical: 0, high: 0, moderate: 0, low: 0, info: 0 }`.

**What we found:** The `pnpm.overrides` block in root `package.json` (added during the IDU-derived quick-wins) cleared all 11 transitive moderate advisories that ship with Payload's dependency tree:
- `dompurify` ≥ 3.3.2
- `uuid` ≥ 11.1.1
- `postcss` ≥ 8.5.10
- `esbuild` ≥ 0.25.0

CI workflow runs `pnpm audit --prod --audit-level=high` on every PR/push, so any future regression to a high or critical advisory will fail the build.

**Why it matters:** Audit-positive. The project is born CVE-clean and the CI gate prevents re-introduction.

**Remediation:** None today. Maintain by keeping `pnpm.overrides` in sync as Payload's transitive deps update.

---

### F8 — Vercel `gitForkProtection: true` [INFO — positive]

**Where:** Vercel project setting.

**What we found:** Fork PRs against this repo will not run with the project's secrets attached. A forked-repo PR's preview deploy either skips or runs without env access.

**Why it matters:** Standard hardening. Prevents an attacker from forking the repo, opening a PR with a build script that exfiltrates `DATABASE_URL`, and watching Vercel's build log. Audit-positive.

**Remediation:** None.

---

### F9 — All 4 application env vars present on production + preview + development targets [INFO — positive]

**Where:** Vercel API → `GET /v10/projects/.../env`:

```
DATABASE_URL                  development,preview,production    encrypted   2026-05-07
NEXT_PUBLIC_SUPABASE_ANON_KEY development,preview,production    encrypted   2026-05-07
NEXT_PUBLIC_SUPABASE_URL      development,preview,production    encrypted   2026-05-07
SUPABASE_SERVICE_ROLE_KEY     development,preview,production    encrypted   2026-05-07
```

**What we found:** Every Supabase-related env var is set on all three deployment targets. No "production-only" gap that would cause preview deploys to fail with a confusing missing-env error.

**Why it matters:** Audit-positive. Confirms the REST-API workaround used to set env vars across all targets worked end-to-end.

**Remediation:** None today. Add `PAYLOAD_SECRET` and `NEXT_PUBLIC_SITE_URL` (across all three targets) when `apps/cms` ships its first preview deploy.

---

### F10 — Vercel build log is clean of secrets [INFO — positive]

**Where:** Latest READY deployment (`dpl_3NKccBVjgiSzc3NJwuqf3e5B8nXJ`) — full event stream scanned for `postgres://`, `sb_secret_`, `sbp_`, `vcp_`, `eyJhbGc` patterns.

**What we found:** Zero matches. No `echo $DATABASE_URL` or similar accidental log statement is present in the build output.

**Why it matters:** Confirms no build-time secret leakage. Audit-positive.

**Remediation:** None.

---

### F11 — Production build does not ship source maps [INFO — positive]

**Where:** Live probe — `GET https://sen-react.vercel.app/_next/static/chunks/main.js.map` → **HTTP 404**.

**What we found:** Next.js default `productionBrowserSourceMaps: false` is in effect (no override in `apps/web/next.config.ts`). Server-only logic isn't reverse-engineerable from public assets.

**Why it matters:** Audit-positive.

**Remediation:** None.

---

### F12 — CORS preflight does not include `Access-Control-Allow-Origin` [INFO — positive]

**Where:** Live probe — `OPTIONS https://sen-react.vercel.app/api/users` from `Origin: https://evil.example.com` → HTTP 204, no `Access-Control-Allow-Origin` header in response.

**What we found:** Foreign-origin browser fetches against the deployed site are blocked at the CORS layer. Note: there's no `/api/users` endpoint on `apps/web` today (the request hit Vercel's 404 handler), so this is mostly a default-behaviour confirmation. Once `apps/cms` deploys with its own routes, re-run this probe.

**Why it matters:** Confirms the deployment isn't accidentally wide-open to cross-origin XHR. Audit-positive (provisional).

**Remediation:** Re-probe when `apps/cms` is deployed.

---

### F13 — `.env.local` file mode is `0600` [INFO — positive]

**Where:** `stat -f "%Mp%Lp" .env.local` → `0600`.

**What we found:** Owner-only read/write. Was `0644` earlier today; tightened during the IDU-derived quick-wins.

**Why it matters:** Audit-positive. Eliminates the trivial leak vector of another local user/process reading the file.

**Remediation:** None. Document in `CLAUDE.md` for new machines: `chmod 600 .env.local` after creating.

---

### F14 — `PAYLOAD_SECRET` is 64-character hex (256-bit), entropy 3.86 [INFO — positive]

**Where:** `.env.local` inspection.

**What we found:** Length 64, hex-only, Shannon entropy 3.86 — consistent with `openssl rand -hex 32` output. Not human-typed, not derived from a guessable seed.

**Why it matters:** Brute-force is computationally infeasible. Audit-positive.

**Remediation:** None today. Calendar a 12-month rotation cadence at prod-setup.

---

### F15 — Payload `cors`/`csrf` set explicitly with allow-list [INFO — positive]

**Where:** `apps/cms/src/payload.config.ts:20-22`:
```ts
const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://sen-react.vercel.app",
  "https://sen-react-cms.vercel.app",
].filter((origin): origin is string => Boolean(origin));

// In buildConfig({ ... }):
cors: allowedOrigins,
csrf: allowedOrigins,
```

**What we found:** Both `cors` and `csrf` are explicitly populated with the production site URL plus the (anticipated) CMS deployment URL. Not relying on Payload's undocumented default.

**Why it matters:** Future-proofs against Payload default-policy shifts. Audit-positive.

**Remediation:** None. Add the actual CMS deployment URL once `apps/cms` is provisioned.

---

### F16 — No hardcoded `/Users/` paths, no destructive SQL in committed scripts [INFO — positive]

**Where:** Codebase grep across `*.ts`, `*.tsx`, `*.mjs`, `*.js`, `*.py` (excluding `node_modules`, `.next`).

**What we found:** Zero hardcoded user-specific paths. No `scripts/` directory exists yet, so by definition no `DROP TABLE`, `TRUNCATE`, or `DELETE FROM` lurks there.

**Why it matters:** Audit-positive. The hygiene posture is set correctly from project birth.

**Remediation:** None. Establish a `scripts/` directory standard if/when needed: only seed/idempotent scripts live in committed tree; one-shot destructive scripts go to `scripts/local-only/` (gitignored).

---

### F17 — Single lockfile (`pnpm-lock.yaml`), `packageManager` pinned, `.env.example` present [INFO — positive]

**Where:** Repo root listing + `package.json:5`.

**What we found:**
- `pnpm-lock.yaml` only — no `package-lock.json`, no `yarn.lock`.
- `"packageManager": "pnpm@9.15.4"` pins the manager.
- `.env.example` exists at repo root.

**Why it matters:** No mixed-package-manager smell. New contributors get a clear signal. Audit-positive.

**Remediation:** None.

---

### F18 — Single GitHub admin collaborator, no Actions secrets, no deploy keys [INFO — positive]

**Where:**
- `gh api repos/tomasi001/sen-react/collaborators` → 1 collaborator (`tomasi001`, admin).
- `gh api repos/tomasi001/sen-react/actions/secrets` → `total_count: 0`.
- `gh api repos/tomasi001/sen-react/keys` → empty.

**What we found:** Tight surface. The Vercel GitHub App is installed but doesn't appear in the `keys` endpoint (it operates via the App installation, not deploy keys). No human or service account has push access except Tom.

**Why it matters:** Smaller secrets surface. Worth re-running `gh api repos/.../collaborators` whenever the team grows. Audit-positive.

**Remediation:** None today. When Connor or another contributor needs access, document the addition.

---

### F19 — Build artefact directory does not exist locally [INFO — positive]

**Where:** No `.next/` directory in working tree.

**What we found:** No production build artefacts on disk to scan. Build artefacts live ephemerally in the CI runner / Vercel build environment, not in the working copy.

**Why it matters:** Eliminates the local-leakage vector of stale `.next/` directories with embedded credentials. Audit-positive.

**Remediation:** None. The `.gitignore` already covers `.next` so a stray local build won't leak via commits.

---

### F20 — `nodeVersion: 24.x` on Vercel [INFO — positive]

**Where:** Vercel project setting.

**What we found:** Project is pinned to Node 24.x (current LTS at audit time). Matches `engines.node: >=22` in root `package.json`.

**Why it matters:** Production runs on a supported Node line. Audit-positive.

**Remediation:** None. Re-check when Node 26 LTS lands.

---

### F21 — `deploymentExpiration: 30 days` for all deployment kinds [INFO]

**Where:** Vercel project setting.

**What we found:** Preview/production/cancelled/errored deployments all kept for 30 days, max 10 retained per project. Tight window vs Vercel's older 180-day default.

**Why it matters:** Limits the "stale preview URL leaks weeks later" attack surface to 30 days. Defaults are sensible.

**Remediation:** None.

---

### F22 — Vercel PAT scope is account-wide (cannot enumerate narrower) [INFO]

**Where:** `GET https://api.vercel.com/v3/user/tokens` with the project's PAT → HTTP 200 (response body lists all tokens issued under the account).

**What we found:** The PAT used for this audit has account-level scope. It can list other PATs Tom has issued. Vercel doesn't currently offer per-project or per-resource PAT scopes.

**Why it matters:** Vercel-design constraint, not a project misconfig. The PAT is currently `vcp_…` issued to Tom — a leak would expose the entire `tomasi001s-projects` Vercel account. Mitigated by storing it only in `.env.local` (mode 0600, gitignored).

**Remediation:** Rotate periodically (12-month cadence). Use Vercel's deploy-from-git integration (now active) for ongoing automation rather than a PAT in CI.

---

## Open questions / follow-ups

1. **Skill false-positive on docs:** the secret-prefix git-history scan flagged 2 hits per pattern (sbp_, vcp_, etc.), but all hits were inside `docs/compliance-skill-spec.md` itself (meta-references documenting the prefix patterns to look for). The skill should ignore `docs/**/*.md` matches by default. Filed as a v2 improvement to the audit-02 skill.
2. **`.env.example` flagged as ever-committed:** the "env files ever committed" probe doesn't whitelist `.env.example` / `.env.sample` / `.env.template` — semantically intended templates are flagged the same as a leaked `.env.local`. Filed as a v2 improvement.
3. **CORS probe hit a 404:** the live probe targeted `/api/users` which doesn't exist on `apps/web` (only on `apps/cms` which isn't deployed yet). The "no ACAO header" result confirms safe behaviour at the 404 layer, but we should re-run this probe once `apps/cms` is deployed and serving real Payload routes.

---

## Summary of severities

| Severity | Count | Findings |
|---|---:|---|
| Critical | 0 | — |
| High | 1 | F1 |
| Med | 1 | F2 |
| Low | 3 | F3, F4, F5 |
| Info | 17 | F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22 |

**Narrative summary:** The chunk-2 posture is clean. The single High (F1 — no branch protection on `main`) is the only structural risk and is the natural follow-up to PR-0b — it locks in the PR-and-preview workflow we just demonstrated. The Med (F2 — unsigned commits) is defense-in-depth, not blocking. The Lows are hygiene polish: a slightly-out-of-date Payload pin (F3, fixes itself on next install), absent `vercel.json` (F4, becomes meaningful with multi-region), and no pre-commit hooks (F5, opportunistic).

The seventeen Infos document positives: no env file ever leaked to git, zero CVEs, fork-PR protection, properly-scoped secrets, clean build logs, no source maps, locked-down CORS, 256-bit secret, single lockfile, single admin collaborator. The IDU-derived quick-wins materially improved the posture before this audit ran — without them, F7 alone would have been a HIGH (11 moderate CVEs).

**Recommended remediation order:** F1 (now, this session) → F2 (next session, when Tom configures git signing) → F4/F5/F3 (opportunistic, batch with chunk-04 / chunk-10).
