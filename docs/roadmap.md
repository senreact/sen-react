# Sen React — Build Roadmap

**Author:** Tom Shields
**Date:** 2026-05-07
**Status:** Active — Phase 0 starts now
**Sources:** Decisions log D001–D020, discovery responses, Tom's verbal direction 2026-05-07

This document is the canonical build plan. Phases follow D014. The validation contract below is non-negotiable and runs at every phase gate.

---

## 1. The validation contract

A phase is **build-complete** when code lands. A phase is **locked** only when *all 7* checks pass. No phase opens until the previous one is locked (D014 gate rule).

| # | Check | Tool | Why |
|---|---|---|---|
| 1 | Compiles | `pnpm build` (per-package + monorepo root) | Catches build-time errors |
| 2 | Type-clean | `pnpm typecheck` (strict TS, no `any`) | Eliminates type drift |
| 3 | Lint-clean | `pnpm lint` (ESLint 9 flat config) | Code-quality floor |
| 4 | Format-clean | `pnpm format:check` (Prettier) | Style consistency |
| 5 | Business-logic tests pass | Vitest (unit) + Playwright (e2e), real DB per `feedback_db_testing.md` | Real assertions, no test-for-test's-sake |
| 6 | CI/CD green + preview deploys | GitHub Actions → Vercel preview, FR locale | Confirms deployable |
| 7 | **Chrome MCP visual verification** | `mcp__claude-in-chrome__*` against the preview URL, screenshots of key flows | Catches "tests pass but app is broken at runtime" |

If any of 1–6 fails, the phase is paused — fix before opening the next phase. #7 is the gate that catches runtime regressions tests don't see.

**Per-phase artefact:** `phase-N-validation.md` — checklist of 7 checks, screenshots, Tom sign-off.

---

## 2. Phase 0 — Pre-flight scaffolding (ungated, one-time)

Before Phase 1 opens, the workshop must be set up. Phase 0 lands as three sequential PRs:

**PR-0a — Monorepo + apps + base config (passes checks 1–4):**
- pnpm workspace
- `apps/web` — Next.js 16 (latest), TypeScript strict, App Router, FR-primary locale
- `apps/cms` — Payload (latest), pointed at Supabase
- `packages/shared` — types, Zod schemas, common utilities
- Root ESLint 9 flat config + Prettier + lint-staged + Husky pre-commit
- Root tsconfig with project references

**PR-0b — Tests + CI (passes checks 5–6):**
- Vitest in each package + a hello-world business-logic test
- Playwright in `e2e/` + a single smoke test (homepage loads, FR locale active)
- GitHub Actions: lint → typecheck → test → build → Vercel preview on PR
- GH repo on `lappiecto` org, Vercel project linked

**PR-0c — Skills + Chrome MCP loop (passes check 7):**
- `verify-phase` skill — runs checks 1–6 in sequence
- `visual-check` skill — drives Chrome MCP against the latest Vercel preview, screenshots target pages
- A first smoke screenshot of the hello-world page committed as `phase-0-validation.md`

**Lock criterion for Phase 0:** trivial PR opens, CI runs all 7 checks green, preview deploys, Chrome MCP screenshot captured.

**Supporting infrastructure activated in Phase 0:**
- Supabase project provisioned (eu-west-1, matching existing `xvvdxmmtscwvlhmhlski` posture)
- Sentry wired (extend `lappie.sentry.io` with a `sen-react` project)
- Axiom dataset for app + worker logs
- `.env.local`, `.env.preview`, `.env.production` patterns established (no secrets in git per CLAUDE.md)

---

## 3. Phase order + green/yellow/red blocker map

Phases are sequential. "Green" = start now. "Yellow" = start now with a placeholder for the gap. "Red" = blocked entirely until Amadou answers.

### 🟢 Green — start now, no blocker

| Phase | Scope | Decisions referenced |
|---|---|---|
| **1 — Foundation** | Auth (email+password via Supabase per D015), root layout, header/footer/nav from CMS globals, FR locale only, deploy stub | D003, D015 |
| **3 — Content engine** | News/blog collection (weekly, by sector; `commentsEnabled` wired but the **comments collection + moderation queue UI ship in Phase 8** with the rest of the community surface — depends on member accounts from Phase 6), Publications collection (downloadable PDFs, fully open per D020), Videos (YouTube embed, FR + Wolof subtitle slot, downloadable per D016) | D016, D019/A4, D020 |
| **4 — Opportunities dashboard (read-only)** | Manual entries via Payload, filters (sector / type / area / deadline / amount), keyword search, saved-opportunities for logged-in members, REACT-curated content | D001 |
| **5 — Aggregation pipeline** | Supabase `pg_cron` → Payload Jobs → scrape + normalise from the 11 sources (D011) → REACT approval queue → publish | D001, D004, D011 |
| **6 — Member accounts** | 5 profile types per D020 (Individual entrepreneur · Organisation · Government/ministry · Partner · Admin), email+password, default field set per type, **manual REACT-admin verification** for org/institution/partner per D020, **default privacy rules** per D020 | D015, D020 |
| **7 — B2B directory** | Directory pages with public name/sector/region/photo, gated phone/email per D020, reviews/ratings, "Looking for X" board, **no in-platform inbox** per D016, hidden `tier` field for future verified/premium support | D002, D016, D020 |
| **8 — Community** | Forums by sector, groups by region/sector/theme, events calendar (in-person + online), webinars, mentor-mentee matching, REACT announcements, **moderated comments on news articles** (Comments collection + moderation queue UI; Phase 3 only wires the `commentsEnabled` flag), **occasional REACT-led surveys** (D020 minimal civic scope, no broader civic platform) | D016, D020 |
| **9 — Capacity building** | Resources / tutorial videos / technical sheets / webinar listings / physical workshop calendar. Always free per D011. No certifications at launch. | D011 |
| **10 — Formalisation toolkit** | Guided journey: BCE/APIX, RCCM/NINEA, FRA, import-export card, business plan, financial management. Verbatim procedures from Amadou §4.2 → tutorials/checklists. External redirects for financing/fundraising/support. | D019/A2 |
| **12 — Launch readiness** | Google Analytics (D019/A15), accessibility pass (WCAG AA default per D020), pre-launch content seeding, sitemap, structured data, OG tags | D020, D019/A15 |

### 🟡 Yellow — start, placeholder until Amadou answers

| Item | Phase | Blocker | Now-action |
|---|---|---|---|
| Programmes section | 2 | Open Q1 (3 active projects) | Build with Sen React + 3 placeholder cards |
| Sector page **content** (per-sector A–F) | 2 | Open Q5 (largest gap) | Build the 10-route template, populate with placeholder copy, backfill per-sector when voice-notes arrive |
| "Innovative digital solutions" showcase | 2 or 3 | Open Q2 (model unconfirmed) | Defer the surface; collect submissions via simple form once model confirmed |
| Parental-consent affordance | 6 | Open Q4 (design intent confirmation) | Build the proposed checkbox + optional parent-email UX; confirm at handoff |
| B2B differentiation tier flag | 7 | Open Q6 (one tier at launch confirmation) | Build with a hidden `tier` field — zero current cost, future-proof |
| About-page text | 2 | Verbatim copy locked in D019/A1 | Land it; confirm visual presentation in PDF mockup |

### 🔴 Red — hard-blocked until input lands

| Phase | Blocker |
|---|---|
| **11 — Compliance + admin handoff** | Open Q3 (legal advisor identified). Tom delivers AI-drafted ToS/Privacy/Cookies + technical data-flow doc *as starting points only* per D017. REACT must engage Senegalese legal review before launch. |
| **13 — Launch** | All upstream phases locked + Q3 resolved. |

---

## 4. Phase 2 — Brand site (mixed green/yellow)

Phase 2 is split because parts are green and parts are yellow. The build order inside Phase 2:

1. **Layout + theme** — pull logo, colours, typography from senreact.com per D018; bake into Tailwind config
2. **Homepage shell** — hero, value-prop, programmes-section placeholder, latest news block, partner strip
3. **About + Team** — verbatim mission/vision/values/founding from D019/A1; 5 team members from D011 with photos as available
4. **Partners** — 10 partner names + logos from D011
5. **Contact** — Sacrée Coeur 3 Lot N° 128/B, senreactsen@gmail.com, +221 77 321 39 55 (WhatsApp), socials
6. **Sector pages × 10** — template route + 10 stubbed pages (D012); placeholder content until Q5 lands
7. **Programmes section** — Sen React headline card + 3 placeholders awaiting Q1

Phase 2 lock criterion: 7 checks pass for the full route set with placeholder content. Real content backfills do **not** require re-locking the phase.

---

## 5. Cross-phase non-negotiables

These constraints apply to every phase from D013 + D019/A23:

- Smartphone-first; light bundles (≤200KB initial JS target)
- Image lazy-loading + low-res placeholders; no autoplay; no heavy hero videos
- Audio/video alternatives required for any text-heavy page
- Wolof subtitles on all REACT-original videos (Phase 3)
- Tone: chaleureux, pratique, stimulant (D019/A21)
- All content CMS-driven; no hard-coded copy (D008)
- FR primary, EN deferred per D010 Q2 (admin publishes FR → Claude translates → Amadou verifies before EN publish)

---

## 6. Cadence + WhatsApp updates

End of each phase, Tom sends Amadou a 30-second update plus a screenshot:

> "Phase N done — [one-line summary]. Voici une capture d'écran. Nous continuons sur Phase N+1."

That gives Amadou momentum visibility without committing to a launch date (D014). No published timeline, ever, until Phase 13 is on deck.

---

## 7. What runs immediately after this doc lands

PR-0a starts now. Outputs after PR-0a:
- `pnpm install && pnpm build` green at repo root
- `apps/web` serves a "Sen React — Phase 0" placeholder page in FR
- `apps/cms` boots locally pointed at a fresh Supabase project
- ESLint + Prettier checks clean

PR-0b and PR-0c follow in sequence. Phase 1 opens once Phase 0 is locked.
