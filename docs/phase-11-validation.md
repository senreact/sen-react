# Phase 11 — Compliance + Admin Handoff: Validation Artefact

**Locked:** 2026-05-16  
**Branch base:** main @ `a468547`

## Scope

Phase 11 delivers AI-drafted legal compliance documents for the Sen React platform, tailored to Senegalese law (Loi n° 2008-12 — LPDP) and global standards. All documents are presented as starting points for mandatory review by a qualified Senegalese legal advisor before publication. REACT assumes responsibility for final content; Tom/Lappie disclaim all liability for the AI-generated output.

---

## Delivered

### Legal Pages (`PR-11` / `a468547`)

All four pages carry a prominent amber DRAFT banner with the following notice (translated):
> "This text is a draft produced with AI tools as a starting point only. It does not constitute legal advice. REACT must submit it to a qualified advisor in Senegalese law before final publication."

#### `/mentions-legales` — Mentions légales
- Legal publisher identity: REACT association, Sacrée Cœur 3 Dakar, director Elhadj Amadou Samb
- Hosting: Vercel (US), Supabase (EU-West), Payload CMS
- IP protection under loi n° 2008-09 (copyright)
- Limitation of liability
- Governing law: droit sénégalais, Dakar courts
- ⚠ Note to complete: NINEA number, DLPAP registration receipt

#### `/conditions-utilisation` — Conditions générales d'utilisation (CGU)
- Age floor: **13 ans** minimum; parental consent required for ages 13–17
- Single account per person
- Prohibited conduct: defamation, impersonation, spam, piracy, scraping, hacking
- UGC licence: users retain IP; grant REACT a non-exclusive display licence
- Verified profile disclaimer
- Account deletion rights
- Governing law: **Code des Obligations Civiles et Commerciales (COCC)**, Dakar jurisdiction
- 30-day amicable dispute resolution attempt before court

#### `/confidentialite` — Politique de confidentialité
- Responsible: REACT as data controller
- **CDP declaration note** (LPDP Art. 17) — must file before production launch
- Legal bases: consentement / exécution du contrat / intérêt légitime
- Data inventory: identification, profile, parental consent, activity, connection logs
- Third parties: Supabase EU-West (GDPR sub-processor), Vercel US (SCCs), Google GA4
- **International transfer caveat** (LPDP Art. 46) — CDP authorisation may be required for US transfers
- Retention schedule: account data (30d post-deletion), logs (12 months), GA4 (14 months)
- LPDP rights: Art. 23–28 (information, access, rectification, opposition, deletion, consent withdrawal)
- CDP contact for complaints
- Minors: no under-13, heightened care for 13–17 (no profiling/targeting)

#### `/cookies` — Politique de cookies
- Session cookies: Supabase auth tokens (strictly necessary, exempt from consent)
- Analytics: GA4 `_ga` / `_ga_*` (optional — requires consent)
- **Consent banner note** — GA4 tag must not load without prior consent; banner implementation required before activating GA4 in production
- Browser opt-out instructions (Chrome, Firefox, Safari, Edge)
- Google Analytics Opt-out link

### Sitemap + Footer

- `sitemap.ts`: 4 legal routes added (`/mentions-legales`, `/conditions-utilisation`, `/confidentialite`, `/cookies`) at priority 0.3, changeFrequency yearly
- `DEFAULT_SITE_FOOTER.legalNavItems`: CGU link added (applies when CMS global is unavailable)
- **Pending admin action**: Amadou must add "CGU → /conditions-utilisation" to the Payload admin SiteFooter global (legalNavItems array) for the link to appear on the live site

---

## Pre-Launch Legal Checklist (for REACT)

Before removing DRAFT banners and launching:

- [ ] Submit all four documents to a qualified Senegalese legal advisor for review
- [ ] Incorporate advisor feedback into final versions (remove DRAFT banners only after sign-off)
- [ ] File CDP declaration for personal data processing (LPDP Art. 17)
- [ ] Obtain CDP authorisation for international data transfers to US (Vercel, Google) if required (LPDP Art. 46)
- [ ] Implement cookie consent banner before activating GA4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID` env var)
- [ ] Complete Mentions légales with NINEA number and DLPAP registration receipt
- [ ] Add CGU link to SiteFooter global in Payload admin dashboard

---

## Validation

1. `pnpm lint` — 0 errors/warnings
2. `pnpm --filter web typecheck` — 0 errors
3. `pnpm test` — 103/103 pass
4. `pnpm --filter web build` — all 4 pages as `○ (Static)` in route manifest
5. GitHub Actions CI — "Lint, format, typecheck, build" ✓; Smoke test ✓
6. Chrome MCP — `/mentions-legales` renders with DRAFT banner + full content; `/confidentialite` renders with CDP declaration note and LPDP rights section; homepage no regression

PR-11 squash-merged to `main`.
