# Phase 12 — Launch Readiness: Validation Artefact

**Locked:** 2026-05-16  
**Branch base:** main @ `4caf2ae`

## Scope

Phase 12 delivers the final pre-launch readiness layer: discoverability infrastructure (sitemap, robots, structured data, OG metadata, GA4), and a full WCAG AA accessibility pass across the platform.

---

## Delivered

### 12a — Analytics, Sitemap & Structured Data (`PR-12a` / `7c49dce`)

- `sitemap.ts`: dynamic XML sitemap — 20 static routes + all CMS collection slugs (news, events, publications, videos, announcements, trainings, resources, formalisation steps). Served at `/sitemap.xml`.
- `robots.ts`: disallows `/connexion`, `/inscription`, `/admin`, `/api/`, `/mon-profil`; references sitemap URL.
- `layout.tsx`: `metadataBase`, OpenGraph (title/description/image/locale `fr_SN`) + Twitter card metadata; conditional GA4 `<Script>` tags keyed on `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- `page.tsx` (homepage): Organization JSON-LD (`@type: Organization`, address, contactPoint, sameAs: Instagram/LinkedIn/YouTube).
- `actualites/[slug]/page.tsx`: NewsArticle JSON-LD (`@type: NewsArticle`, headline, datePublished, author, publisher with logo, optional image).

### 12b — WCAG AA Accessibility Pass (`PR-12b` / `4caf2ae`)

**Colour contrast (WCAG 1.4.3):**
- `--color-accent` darkened `#5fba7d` → `#267a46` (2.38:1 → 5.31:1 against white). Original retained in comment; logo/wordmark image is non-text and exempt per 1.4.3.
- `--color-accent-warm` darkened `#f2a035` → `#a85c0d` (2.13:1 → 5.00:1 against white).
- `DirectoryTeaser` body paragraph: `text-[color:var(--color-muted)]` → `text-[color:var(--color-fg)]` to pass on the 10% green tint background (4.16:1 → 15:1).

**Navigation / bypass blocks (WCAG 2.4.1):**
- Skip-to-main-content link added at top of `layout.tsx` body — visually hidden via `sr-only`, revealed on keyboard focus with full styling.
- `id="main-content"` added to the `flex-1` content wrapper.

**Form labels (WCAG 1.3.1 / 4.1.2):**
- `CommentForm` textarea: `aria-label="Votre commentaire (max 2 000 caractères)"` added (previously had `placeholder` only — not an accessible label).

**Audited and passing:**
- All `<img>`/`<Image>` usages have explicit `alt` text or `alt=""` + `role="presentation"` for decorative images.
- All form fields in `AuthForm`, `SignUpForm`, `ProfileEditForm` have `<label htmlFor>` associations.
- `<html lang="fr">` confirmed in DOM.
- `<nav aria-label="Primary">` in SiteHeader.

---

## Validation

1. `pnpm lint` — ESLint 0 errors/warnings
2. `pnpm --filter web typecheck` — TypeScript strict, 0 errors
3. `pnpm --filter cms typecheck` — 0 errors
4. `pnpm test` — 103/103 tests pass
5. `pnpm --filter web build` — `/robots.txt` + `/sitemap.xml` in route manifest
6. GitHub Actions CI — "Lint, format, typecheck, build" ✓ on both PRs
7. Chrome MCP (12a preview) — sitemap.xml renders 33 entries, robots.txt correct, NewsArticle JSON-LD present and valid, Organization JSON-LD on homepage present and valid
8. Chrome MCP (12b) — axe-core WCAG 2AA scan: accent colour contrast confirmed `#267a46` (5.31:1); `html-has-lang` confirmed false positive (lang="fr" in DOM); DirectoryTeaser fix verified in code + CI

PR-12a and PR-12b squash-merged to `main`.

---

## Phase 11 Note

Phase 11 (Compliance + admin handoff) was unblocked 2026-05-16 with the decision to deliver AI-drafted legal documents (ToS, Privacy Policy, Cookie Policy) as starting points for Senegalese legal review. See `docs/phase-11-validation.md` once delivered.
