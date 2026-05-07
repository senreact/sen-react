# senreact.com — Scrape Findings & Template Annotations

**Source:** Full site scrape of https://senreact.com/ on 2026-04-23.
**Purpose:** Map what the existing site already answers in the discovery template, so Amadou only fills in what's genuinely unknown. Also captures intelligence the spec he sent Tom didn't mention.

---

## TL;DR — the site in one paragraph

senreact.com is a **WordPress site running the "Tecnologia" / Vamtam template** with real REACT French content pasted over the template's default IT-consultancy demo. The *genuine* REACT surface is: **the homepage, `/about/`, and 6 French blog posts**. Everything under `/solutions/`, `/industries/`, `/team/`, `/partnerships/`, and most of `/contact/` is template stock — fake people ("Mat Zalman, CEO"), fake partners ("Microsoft, Intel"), fake US offices. The blog post URLs are also template leftovers (French REACT titles sitting at English slugs like `healthy-supply-chain-management-positions-uniwell-for-growth`). This is almost certainly *why* Amadou wants a new platform: the current one is a cluttered Frankenstein.

Good news: the genuine content gives us a huge amount of real REACT substance to work with, far more than his discovery spec suggested.

---

## Key new intelligence NOT in Amadou's discovery spec

These are material facts the site reveals that we didn't have before.

### 1. Six named projects (programmes) already running

| Project | Scope |
|---|---|
| **PROJET 3A** | Appui à la Formalisation et Accompagnement technique et Accélération des PME, TPE et Start Up |
| **Si la Bokk** | Formation des femmes et filles en saponification, transformation et gestion financière |
| **Projet SenTAX** | Accompagnement des start-ups en fiscalité numérique |
| **SEN LEADERSHIP VERT** | Promotion de l'entrepreneuriat vert et de la responsabilité environnementale |
| **AI FOR CHANGE ACTORS** | Promotion des outils IA pour le développement et la résilience |
| **GRAPHIC POWER** | Utilisation du graphisme et de la vidéo pour amplifier l'impact des jeunes et femmes entrepreneurs |

**Implication:** The platform needs a **Projects / Programmes** section that the original spec didn't call out. These are concrete initiatives donors fund and beneficiaries apply to. They should have their own collection in Payload, individual landing pages, and probably an "apply / enrol" flow.

### 2. Thirteen concrete training offerings (from membership form)

Appui à la formalisation · Formation en gestion financière · Elaboration Business Plan · Accompagnement en digitalisation · Formation en agroécologie · Formation en IA · Conseil en fiscalité · Conseils sur les métiers verts · Formation en Infographie · Formation en saponification · Formation en transformation de fruits et légumes · Mise en Réseau · Appui financier

**Implication:** These are the menu of Capacity Building (Template §4.5) — heavily answered. They also map neatly to the 6 projects above.

### 3. Amadou's profile is richer than we knew

- **Executive Director** (Directeur Exécutif), not just Director
- Master's in Human Sciences, UCAD Dakar (2015)
- NGO Project Management certifications
- **4 years as national director of BudgIT Senegal** (civic-tech, fiscal transparency) — this is a major credential
- Co-founder of **SMART SCHOOL** training institute
- Consultant since 2018
- Specialises in **democratic governance, digital economy, participatory processes, environmental accountability**
- **Works across all 14 regions of Senegal + West Africa**
- Fluent French + English (professional translator)

**Implication:** The **"citizen participation" theme in his spec is not a vague aspiration — it's core to his professional identity**. BudgIT Senegal is literally a civic-tech fiscal-transparency platform. This reframes Template §7: civic features may be a more serious requirement than we assumed.

### 4. "Vulnerable communities" added as a third audience

Homepage says REACT promotes *"l'autonomisation des femmes, jeunes **et des communautés vulnérables**"* — the third group was missing from the spec. Template §2 should treat vulnerable communities as a named audience.

### 5. Organisation structure: "domaines d'intervention" ≠ "sectors"

The homepage uses **4 domaines d'intervention** — Entrepreneuriat, Environnement, Digitalisation et technologie, Leadership de transformation. These are **cross-cutting themes**, not the 7 sectors in the discovery spec. The 7 sectors (Agriculture, Digitalisation, Renewable Energy, Multimedia, Processing, Service Provision, Livestock) sit *underneath* the 4 domaines.

**Implication:** The information architecture likely needs **both** layers: domaines as top-level editorial framing, sectors as the taxonomy for opportunities / businesses / tutorials. This is a question to put back to Amadou.

### 6. Mobile penetration >110% and mobile money >60% of adults (from his own article)

From Amadou's formalisation article citing ANSD/RGPH-5 2023 data. This confirms our hypothesis that **the platform must be mobile-first and WhatsApp-friendly**. Template §2.8–2.10 partially answered.

### 7. Membership is already a concept — and it's free

The homepage membership form says *"L'adhésion est gratuite"* with three benefits: accompagnement techniques, réseautage et B2B, orientation et subvention. So **"member" is already an existing user type**, distinct from the general public, which materially affects Template §8 (account types).

### 8. Current brand: primary blue `#010ED0`, dark grey `#242627`, white

A logo exists at `/wp-content/uploads/2023/03/react2-03-scaled.jpg` (we should extract and inspect). Template is stock WordPress — no original design system beyond colours.

### 9. Voice & editorial quality

Amadou writes **long-form, reference-grade thought leadership**: cites ANSD data, RGPH-5 statistics, percentages, AU/ZLECAf policy frameworks. Tone is formal, analytical, policy-aware. This matters for:
- Copy style decisions (no casual tone — this is an authoritative voice)
- Publications section (Template §6.1) — he already writes white-paper-style content, just without PDF packaging
- We should **preserve existing articles** in migration (all 6 are worth moving over, with clean URL structure)

---

## Annotated template — what's now answered

Legend: ✅ answered / 🟡 partial / ❌ still needed

### Section 1 — Organisation & identity

| # | Question | Status | From site |
|---|---|---|---|
| 1 | Legal status | 🟡 | Non-profit ("Organisation à but non lucratif") confirmed; **registration number still needed** |
| 2 | One-paragraph mission | ✅ | 3 mission lines + expanded "women + youth + vulnerable communities through digital + ecological transition" |
| 3 | Vision | ✅ | "Contribute considerably to sustainable economic development of Senegalese entrepreneurs and the digital revolution of West Africa" |
| 4 | Core values | 🟡 | "Leadership, inclusion numérique, développement économique durable" on site; spec's "inclusive/pratique/accessible/collaborative" is separate — **reconcile which is canonical** |
| 5 | Founding story | ❌ | When + why REACT was founded still unknown |
| 6 | Team & leadership | 🟡 | **Amadou fully documented.** Other team members — ❌ |
| 7 | Partners | ❌ | Current site shows Microsoft/Intel (fake template); **real partners still needed** |
| 8 | Existing online presence | ✅ | senreact.com (this site), WhatsApp. Social links are template filler — **real handles needed** |
| 9 | Contact info | ✅ | +221 77 498 69 54 · senreactsen@gmail.com · Av. Cheikh Anta Diop, Le Relais, Dakar · WhatsApp QR |
| 10 | Brand assets | 🟡 | Logo file exists; colours `#010ED0` / `#242627`; **need to confirm whether to keep, refine, or redesign** |

### Section 2 — Audiences

| # | Status | From site |
|---|---|---|
| 1 Youth entrepreneurs | ✅ | Confirmed: PME / TPE / Start-ups led by youth |
| 2 Women entrepreneurs | ✅ | Dedicated initiatives (Si la Bokk) — universal platform with women-specific programmes |
| 3 Community leaders | 🟡 | Implied via "vulnerable communities"; **specific definition still needed** |
| 4 Organisations / 5 Institutions / 6 Investors / 7 Public | ❌ | Still needed |
| 8 Device / 9 Connectivity | ✅ | Mobile-first confirmed (>110% mobile penetration per his own article) |
| 10 Language | 🟡 | Current site FR-only despite FR/EN intent; **Wolof question still open** |

### Section 3 — Sectors

| Finding | Status |
|---|---|
| 7 sectors vs 4 "domaines d'intervention" | 🟡 **New question:** do we want both layers? (Recommendation: yes — domaines as editorial framing, sectors as taxonomy) |
| Service Provision | ❌ No evidence on site → leaning toward dropping |
| Livestock Breeding | ❌ Not mentioned on site in any project or offering → **confirm is it aspirational or active?** |
| Processing | ✅ "Transformation de fruits et légumes" is live |
| Digitalisation, Agriculture, Renewable Energy, Multimedia | ✅ All implicitly covered by projects + articles |

### Section 4 — Services

| Service | Status | From site |
|---|---|---|
| 4.1 Information dissemination | ✅ | 6 real blog articles already exist; editorial practice proven |
| 4.2 Formalisation | 🟡 | PROJET 3A + SenTAX are live — still need the **step-by-step flow** (ADEPME/APIX/NINEA/RCCM path) |
| 4.3 B2B | ✅ | Decision D002: directory-style |
| 4.4 Community | ❌ | Still needed |
| 4.5 Capacity building | ✅ | **13 concrete training offerings + 6 projects** = fully scoped menu |

### Section 5 — Dashboard of Opportunities

| # | Status |
|---|---|
| 5.3 Source | ✅ Decision D001: manual + aggregated |
| 5.10 External source list | ❌ Still needed |
| Rest | ❌ Still needed |

### Section 6 — Content

| # | Status | From site |
|---|---|---|
| 6.1 Publications | 🟡 | Already writes white-paper-grade content (no PDFs yet) |
| 6.2 News & announcements | ✅ | Live blog cadence: ~6 posts Nov 2025 → Feb 2026, solo-authored by Amadou |
| 6.3 Videos | 🟡 | GRAPHIC POWER project implies video capability; **hosting decision still needed** |
| 6.4 Policies & regulations | ❌ | Still needed |

### Section 7 — Citizen participation

🔺 **Materially upgraded importance.** Given Amadou's BudgIT Senegal background (4 years as national director of a civic-tech fiscal-transparency platform) and his stated specialisation in "participation citoyenne", this is almost certainly a **real feature requirement**, not a theme. **Ask him directly:** does Sen React need a civic/participatory feature set (consultations, open-data views, fiscal transparency dashboards)?

### Section 8 — Accounts

🟡 Partially answered. **"Member"** is already a live concept (free membership form exists). Likely account types: public visitor · member (free) · organisation/business · REACT admin. Partners/institutions still open.

### Section 13 — Design

🟡 Existing palette (`#010ED0` blue, `#242627` dark grey, white) and logo file. **Decision needed:** keep, refine, or full rebrand for the new platform.

---

## New questions that came out of the scrape (to add to Amadou's list)

1. **"Projects / Programmes"** — add a dedicated section of the template covering the 6 named projects. For each: goal, funder, duration, target beneficiaries, KPIs, how to apply. This is a missing Template section (§17).
2. **4 domaines vs 7 sectors** — confirm the information architecture. Recommendation: domaines as editorial framing (top nav), sectors as taxonomy (filters). Ask for confirmation.
3. **Livestock sector** — real programme or aspirational? Keep or drop?
4. **Service Provision sector** — no trace on the current site. Confirm drop.
5. **Registration number** — REACT's association registration number (needed for legal pages / credibility).
6. **Other team members** — who else is on the REACT team? (Amadou is the only named person on the site.)
7. **Real partners** — any funders / institutional partners we can credit (with permission)?
8. **Real social media handles** — Facebook / LinkedIn / Twitter / YouTube / TikTok / Instagram URLs as they actually exist.
9. **Brand direction** — keep the blue (`#010ED0`) and existing logo, or redesign for the new platform?
10. **Existing 6 blog articles** — we should migrate them with clean URLs. Confirm we have his permission to port + whether any need updating.
11. **Civic features** (upgraded priority) — given his BudgIT background, is there a dedicated participation / transparency / open-data feature set we should plan for?
12. **Values reconciliation** — which set is canonical: site's "Leadership / Inclusion numérique / Développement économique durable" *or* spec's "Inclusive / Pratique / Accessible / Collaborative"? Could be both, layered.

---

## Recommended next action

1. **Add a Section 17 — Projects / Programmes** to both the EN and FR discovery templates, seeded with the 6 projects we found so Amadou only fills in gaps.
2. **Annotate the templates** with the ✅ answers from this doc, so Amadou sees what's pre-filled and only needs to focus on ❌ and 🟡 items.
3. **Send Amadou a focused WhatsApp** with just the ~12 genuinely open questions above, rather than the full 16-section template. His answer rate will be far higher.
