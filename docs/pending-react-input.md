# Pending REACT-side input

A running list of items that need REACT (Amadou + team) input before the platform launches. These are **not blocking** ongoing build work — Tom keeps shipping with placeholders — but each one must be resolved before Phase 13 (Launch).

Convention: when an item lands, mark it ✅ resolved with the date and the source artefact (commit, PR, decision-log entry, etc.).

---

## Brand assets (added 2026-05-09 during PR-2a)

The brand pull from `senreact.com` produced a working but imperfect baseline:

- **Logo asset quality** — current `apps/web/public/logo-react.jpg` is the JPEG that WordPress serves at `/wp-content/uploads/2023/03/react2-03-scaled.jpg`. JPEG can't do transparency; the white background creates an obvious rectangle on any non-white surface (dark-mode browsers, future hero images, future dark-themed sections). senreact.com doesn't host PNG or SVG variants — they'd need to be sourced from the original designer or recreated. Need from Amadou: **transparent PNG and/or SVG logo files**, ideally including:
  - Primary horizontal lockup (`React` + `Réseau des Entrepreneurs Actifs`)
  - Symbol-only mark (the `R` glyph alone, for favicons / social cards)
  - Single-colour reverse-out variants (white-on-dark, single-colour print)
- **Logo colour confirmation** — the Tailwind tokens (`#5FBA7D` green, `#F2A035` orange, `#242627` body grey) are derived by-eye from the current logo JPEG. Need brand-doc-level confirmation of the exact hex values + Pantone references if any exist.
- **Typography** — D018 says "no new design system" and the live site uses WordPress theme defaults. We're rendering with `system-ui`. Confirm whether REACT has a brand font (often missed in WP themes); if so, need WOFF2 files + licence.
- **Other brand assets that may be needed before launch:**
  - Team headshots (5 members per D011; only Amadou's bio is documented today)
  - Partner logos (10 names per D011; Microsoft/Intel on senreact.com today are template stock — fake)
  - OG / social card image (default share preview)
  - Favicon / apple-touch-icon variants

**Why we're not fixing now:** D018 explicitly defers visual coherence confirmation to the PDF mockup gate before Phase 13. Per Tom (2026-05-09): "Right now, it's not an issue because I want to build this whole thing out, and then we can look at, like, polishing look and feel." Build now, polish at end.

**Action when triggered:** roll all brand-asset requests into a single ask sent to Amadou alongside the Phase 12-or-13 mockup review.

---

## Follow-up questions Q1–Q6 — resolved 2026-05-07 (D021)

Amadou responded via WhatsApp on 2026-05-07. All six questions answered; full text recorded in `discovery/decisions-log.md` §D021.

| Q | Topic | Status | Notes |
|---|---|---|---|
| Q1 | 3 active programmes | ✅ resolved | Projet 3A · Projet Sen React (headline) · IA for Change. Shipped to homepage in PR-2g. |
| Q2 | Innovation-showcase model | ✅ resolved | Curated by Sen React via fellowships / calls. Not user-submitted. v1 model locked. |
| Q3 | Legal review | ✅ resolved | Tom drafts → REACT validates with Senegalese lawyer. Drafts now in Tom's queue (Phase 11). |
| Q4 | Parental-consent UX | ✅ resolved | Checkbox at signup, no document upload. Phase 6. |
| Q5 | 10 sectors | ✅ resolved (with typo flag) | Amadou wrote "6 au lieu de 10" but listed all 10 and confirmed below. Tom to do a quick WhatsApp confirmation; meanwhile we ship 10. No change to D012 unless he corrects. |
| Q6 | B2B tier at launch | ✅ resolved | One tier + hidden premium field for later. Phase 7. |

### What's now in Tom's queue (rather than Amadou's)

- **AI-drafted ToS / Privacy / Cookies / CDP markdown** — Amadou's closing line on 2026-05-07 was *"looking forward to the IA draft for legal conformity"*. Phase 11 deliverable; Tom to draft when he picks up that phase.

### Per-sector deep-dive content

Q5 confirmed the 10 sector slugs/labels but did NOT cover the §3 A–F content per sector (priorities, key actors, opportunities, obstacles, existing content, success stories). The sector pages currently ship with the same three placeholder blocks per slug. **Per-sector content is still pending from REACT-side** — voicenotes one sector at a time on WhatsApp would be the easiest path for Amadou.

---

## Other content gaps from the site-scrape audit

From `discovery/site-scrape-findings.md`:

- **Real partners** — Microsoft / Intel on senreact.com today are WordPress template fakes. Need actual REACT partner list with real logos.
- **Founding story** — when + why REACT was founded (D019/A1 has mission/vision/values but not the founding date).
- **Legal status registration number** — confirmed non-profit, but the formal registration number isn't on the site.
- **Real social handles** — current site shows template-filler social links. Need actual handles for Instagram, LinkedIn, YouTube, WhatsApp.

---

**Update cadence:** check this file at the start of each phase. Cross out resolved items with the source. New asks added inline as they surface.
