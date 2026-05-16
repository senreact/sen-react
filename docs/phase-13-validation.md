# Phase 13 — Launch Readiness: Validation Artefact

**Locked:** 2026-05-16  
**Branch base:** main @ `6f90bcd`

## Scope

Phase 13 delivers the final technical prerequisite for production launch: a LPDP-compliant cookie consent banner that gates Google Analytics behind explicit user opt-in, as required by the Phase 11 cookie policy.

---

## Delivered

### 13a — Cookie Consent Banner (`PR-79` / `6f90bcd`)

**`CookieConsentBanner` client component** (`apps/web/src/components/CookieConsentBanner.tsx`):

- Reads `localStorage('cookie-consent')` on mount
- **First visit** — banner rendered at page bottom with "Refuser" / "Accepter" buttons and a link to `/cookies`
- **Accepter** — stores `cookie-consent=accepted`; loads GA4 scripts via `next/script afterInteractive` (only if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set)
- **Refuser** — stores `cookie-consent=declined`; GA4 never loads
- **Returning visit** — preference read from storage; banner hidden, GA4 loaded only if accepted
- **No `NEXT_PUBLIC_GA_MEASUREMENT_ID`** — banner still shown (consent recorded) but GA4 never injected

**`layout.tsx` update** (`apps/web/src/app/layout.tsx`):
- Removed hardcoded `<Script>` GA4 tags (which loaded unconditionally)
- Replaced with `<CookieConsentBanner gaId={GA_ID} />`

---

## Pre-Launch Checklist Status

The following items remain for REACT to complete before removing DRAFT banners and launching:

- [ ] Submit all four legal documents to a qualified Senegalese legal advisor
- [ ] Incorporate advisor feedback (remove DRAFT banners only after sign-off)
- [ ] File CDP declaration for personal data processing (LPDP Art. 17)
- [ ] Obtain CDP authorisation for international data transfers to US if required (LPDP Art. 46)
- [ ] Complete Mentions légales with NINEA number and DLPAP registration receipt
- [ ] Add CGU link to SiteFooter global in Payload admin dashboard
- [x] ~~Implement cookie consent banner before activating GA4~~ — **done (PR-79)**
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var in Vercel once consent banner is live

---

## Validation

1. `pnpm lint` — 0 errors/warnings
2. `pnpm --filter web typecheck` — 0 errors
3. `pnpm test` — 103/103 pass
4. `pnpm --filter web build` — clean
5. GitHub Actions CI — "Lint, format, typecheck, build" ✓; Vercel preview deployed
6. Chrome MCP (preview) —
   - Banner renders on first visit with "Refuser" / "Accepter" buttons and `/cookies` link
   - Refuser: banner dismissed, `cookie-consent=declined` stored, `window.gtag` absent
   - Accepter: preference persisted, banner hidden on reload, no regression on header/footer/skip-link/main-content-id
   - Homepage structure intact (header, nav, main-content, skip link, footer all present)

PR-79 squash-merged to `main`.

---

## Technical Build: Complete

All 13 phases are now delivered and locked. The platform is feature-complete and ready for launch once REACT completes the non-technical pre-launch checklist above.

| Phase | Scope | Status |
|---|---|---|
| 0 | Scaffolding, CI, monorepo | Locked |
| 1 | Auth, root layout, header/footer | Locked |
| 2 | Brand site (homepage, about, sectors, partners) | Locked |
| 3 | Content engine (news, publications, videos) | Locked |
| 4 | Opportunities dashboard | Locked |
| 5 | Aggregation pipeline | Parked (manual entry preferred) |
| 6 | Member accounts + profile types | Locked |
| 7 | B2B directory | Locked |
| 8 | Community (forum, groups, events, mentoring) | Locked |
| 9 | Capacity building | Locked |
| 10 | Formalisation toolkit | Locked |
| 11 | Compliance (legal pages — LPDP, COCC, CGU, cookies) | Locked |
| 12 | Launch readiness (sitemap, robots, OG, JSON-LD, WCAG AA) | Locked |
| 13 | Cookie consent banner (GA4 opt-in gate) | **Locked** |
