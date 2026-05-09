# Sen React — Decisions Log

Running list of decisions Amadou (and Tom) have locked in, with date and source. When a decision lands, the corresponding section(s) of the discovery template are considered resolved.

---

## 2026-04-23

### D001 — Dashboard of Opportunities: hybrid sourcing (manual + aggregation)
**Source:** Amadou WhatsApp, 2026-04-23
**Answers:** Template §5.3
**Decision:** REACT team enters opportunities manually *and* external feeds are aggregated automatically where technically feasible.

**What this unlocks architecturally:**
- Single `opportunities` collection in Payload
- Two write paths into it:
    1. **Manual entry** — Payload admin UI, standard CRUD for REACT staff
    2. **Aggregation pipeline** — scheduled job (Inngest or Vercel cron) that pulls from external sources, normalises into the collection schema, and flags entries as `source: "aggregated"` with `status: "pending_review"`
- Every aggregated entry goes through a **REACT admin approval step** before publishing — ensures quality, avoids liability for bad scrapes, lets team add local context
- Entries carry a `source` field (`manual` / `aggregated:<source-name>`) and a `source_url` so provenance is always visible

**Still needs clarification from Amadou:**
1. **Which external sources?** We need a list of 3–10 URLs/feeds to aggregate from at launch. Candidates to propose: ADEPME, APIX, Ministère de la Jeunesse, DER/FJ, FONSIS, West Africa grants portals, Francophonie fellowship sites, UN/AU opportunity portals. Amadou must validate which are actually valuable to his users.
2. **Update cadence** — daily / weekly pulls?
3. **Who approves aggregated entries**, and what's the SLA? (Ties to §9 roles.)
4. **Archive vs delete expired opportunities?** (Recommendation: archive and keep searchable — becomes a record of past calls.)

### D002 — B2B Networking: Directory-style listing (cheapest option)
**Source:** Amadou WhatsApp, 2026-04-23
**Answers:** Template §4.3 (partial)
**Decision:** B2B feature is a **directory** — businesses listed with public profiles, users contact each other externally (phone / email / WhatsApp). No in-platform messaging, no introductions brokered by REACT, no verification tiers, no reviews/ratings in v1.

**What this removes from scope:**
- In-platform messaging / inbox (big win — auth complexity, spam handling, moderation)
- Introduction brokering workflow
- Multi-tier profile types (basic vs verified vs premium)
- Rating / review system
- "Post of needs" / RFQ workflow (unless Amadou explicitly wants it — see below)

**What this keeps:**
- A `businesses` collection in Payload
- Public directory page with filter/search (sector, region, keyword)
- Individual business profile pages (contact details displayed)
- Submission flow: business owner fills a form → REACT reviews → published

**Still needs clarification from Amadou:**
1. **Profile fields** — what's on a listing card + full profile page? Proposed minimum: company name, logo, sector(s), region, short description (≤200 chars), long description, contact (phone / email / WhatsApp / website / socials), photos, year founded. Amadou to add/remove.
2. **Self-service submission vs REACT-curated** — can a business owner submit themselves and wait for approval, or does REACT enter businesses on their behalf? (Recommendation: self-submit with approval queue — scales with adoption.)
3. **"Looking for X" feature** — still in scope, or dropped? (A lightweight "requests" board is cheap to add but changes UX.)
4. **Monetisation later** — not a v1 decision, but confirm we can add premium/boosted listings later without breaking anything. (Yes, we can — just flagging.)

---

### D003 — Authentication model: split, password-only
**Source:** Tom, 2026-04-23 (after stack research)
**Answers:** Template §8, §9
**Decision:** Two separate auth systems:
- **Payload Auth (email + password)** for REACT staff (admin UI)
- **Supabase Auth (email OR phone + password)** for members. **No OTP, no Twilio.**

**Why not unify:** Payload's admin UI is wired to its own auth. Bridging to Supabase would require a custom auth strategy — more code, more fragility. Split is less work.

**Why no OTP:** Operational simplicity, no Twilio dependency, no SMS costs, no international-rate surprises.

### D004 — Aggregation pipeline: Payload Jobs + Supabase pg_cron (no Inngest)
**Source:** Tom, 2026-04-23
**Answers:** Template §5.3, §13
**Decision:** Stay inside Supabase/Payload. Supabase `pg_cron` triggers a webhook on schedule; webhook invokes a Payload Jobs Queue handler that runs the scraper + normaliser. Payload's built-in scheduled tasks handle approvals.

**What this removes:** Inngest dependency, Inngest cost, one more account to manage.

**Trade-off:** We lose Inngest's observability UI. Mitigation: use Axiom + Sentry for the job lifecycle events.

### D005 — Translation: Claude + Amadou verification (no DeepL)
**Source:** Tom, 2026-04-23
**Answers:** Template §14
**Decision:** All FR↔EN translation runs through Claude. Amadou (native francophone) verifies output before publication. No third-party translation service.

**Implications:**
- `translate-fr-en` skill is Claude-backed, not DeepL
- Every translated string in CMS gets a `needs_review: true` flag until Amadou approves
- Zero per-translation cost, no API key management

### D006 — Model policy for setup phase: Opus 4.7 only
**Source:** Tom, 2026-04-23
**Decision:** Opus 4.7 with `xhigh` effort is the default for the entire setup phase. No model switching. Re-evaluate after Wave 0 + Wave 1 complete.

### D007 — CMS-driven dynamic template engine
**Source:** Tom, 2026-04-23
**Answers:** Template §6 (Content types), architectural
**Decision:** The platform is rendered dynamically from CMS content. Key architecture:
- `Pages` collection in Payload with a **block-based layout** field
- A **reusable blocks library** (Hero, FeatureGrid, OpportunityList, RichText, Team, CTA, etc.)
- A single **`[...slug]` catch-all** Next.js route that fetches the page and maps blocks → React components
- Navigation, settings, global content all managed through Payload globals

**Why:** After hand-off, REACT staff must be able to change layouts, add pages, rearrange sections, and update content without a developer. This is a first-class platform requirement, not a nice-to-have.

**Long-term path:** Once REACT secures funding and grows digital literacy, they can subscribe to Claude and evolve the platform via natural-language conversation with AI — aligned with REACT's own AI-literacy mission (AI FOR CHANGE ACTORS programme).

### D008 — REACT CMS autonomy as first-class goal
**Source:** Tom, 2026-04-23
**Decision:** Every build decision must preserve the ability for non-technical REACT staff to self-maintain the site after hand-off.

**Consequences:**
- No hard-coded content anywhere (navigation, hero copy, footer links — all in Payload)
- No developer-only flows for routine edits
- Content changes must not require redeployment (ISR or on-demand revalidation)
- Admin UI must be bilingual (Payload supports this)
- A French-language user guide is a shippable deliverable (not optional)

### D009 — Hand-off format: Markdown internally, PDF for stakeholders
**Source:** Tom, 2026-04-23
**Decision:** All working docs stay in Markdown for iteration. For hand-off to Amadou / non-technical readers, docs are converted to PDF via `pandoc` + `eisvogel` template locally.

**Implementation:** `scripts/ops/build-pdfs.sh` + `docs-to-pdf` skill (§3.14). No cloud dependency, no cost.

---

## 2026-05-04

### D010 — Hard gate passed: Amadou approved direction
**Source:** Amadou WhatsApp, 2026-05-04
**Answers:** `docs/amadou-pdf/{en,fr}/03-final-validation.pdf`

**Q1 — Website representative?** YES, with one correction. Of the 6 projects shown on senreact.com, only **3 are still active**. They want **Sen React itself added as a project**. Amadou asked Tom to advise on the best presentation. → **Action:** identify the 3 active projects from Amadou (or current site scrape) and design a 4-card "Programmes" section with Sen React as the headline programme.

**Q2 — Language priority?** **French primary.** English will be added at REACT's own pace, with explanation from Tom. → Reinforces D005 (Claude FR→EN translation, Amadou verifies). **EN can lag FR at launch** — not a Wave-0 blocker.

**Q3 — Communication channel?** **WhatsApp** for routine updates. **Voicenote or call** when there's misunderstanding. → No Slack, no email-only threads. Build PDF/checklist artefacts that survive WhatsApp forwarding.

### D011 — Full discovery response received from Amadou
**Source:** `discovery/responses/amadou-discovery-response-fr.docx` (2026-05-04)
**Answers:** Template §1–§16 (substantially complete)

Summary of resolved items + items that **change or reopen prior decisions**:

**Resolved (no further input needed):**
- **Legal status** — Association registered N° 00020614/MINT/DGAT/DLPL/DAPA
- **Team (5)** — Elhadj Amadou Samb (Directeur Exécutif), Cheikh Oumar Kane (Secrétaire Général), Yaye Bineta Mamadou Dramé (Coordinatrice programmes + com), Siny Thioune (Suivi & Évaluation), Mamadou Coly (Infographiste & web manager)
- **Founding** — 20 May 2021, by Elhadj Amadou Samb + Cheikh Oumar Kane, post-COVID resilience initiative; relaunched 2024 with digital + ecological transition focus
- **Address / contact** — Sacrée Coeur 3 Lot N° 128/B, Dakar · senreactsen@gmail.com · +221 77 321 39 55 (WhatsApp) · senreact.com
- **Partners** — 3 institutions (ADEPME, ANCAR, Min. Comm/Numérique) + 7 NGOs (CIVIC HIVE, African Youth Commission consortium, IBP, Enda ECOPOP, CJS, AFIKANITE, GPF)
- **Aggregation sources** — African NGO Fundraising hub, Hexa Africa, Align Africa, DER, FONSIS, ADEPME, EU Senegal, GIZ Senegal, CJS Yakaar, OIDP Afrique, Sen Startup *(closes D001 open question 1)*
- **Capacity building** — always free, no certificates required at launch
- **Community** — registered (login required to read/post)
- **Workflow** — single admin drafts → Director approves → publish
- **Tone of voice** — Chaleureux, pratique, stimulant
- **Reference sites** — BudgIT, Tracka, CJS Yakaar
- **Existing tools** — Smart Sheet + Google Workspace (light integration only)

**New decisions to lock:**

### D012 — Sectors expanded from 6 → 10
**Source:** Amadou response §3, 2026-05-04
**Decision:** Ten sectors (each with sub-scope):
1. Digitalisation et technologie (apps, civic tech, e-commerce, fintech, IA)
2. Développement économique (AGR femmes/jeunes)
3. Entrepreneuriat local (digital, agricole, élevage, services, EnR, IA, transformation, artisanat)
4. Agroécologie (agri bio, transformation fruits/légumes)
5. Énergies renouvelables (emplois verts, solaire, éolienne)
6. Multimédia (graphisme, vidéo, podcast, documentaire)
7. Transformation (alimentaire)
8. Artisanat (produits locaux, savons)
9. Élevage (bovins, ovins, caprins)
10. Saponification (savons bio, lait corporel)

**Implication:** Taxonomy + content seeding scope grew. Skill `seed-sectors` must scaffold 10, not 6/7.

### D013 — Audience: 15–35 years old, ~70% non-fluent in French
**Source:** Amadou response §2, 2026-05-04
**Decision:**
- Target age range **15–35** — site **must support minors**, with parental-consent affordances at sign-up (compliance impact, see open Q1 below)
- **Only ~30% of target audience reads French fluently** → **audio/video alternatives are required for primary content**, not optional
- Smartphone-first, light-build mandatory (slow/expensive connectivity assumed)

**Implication:** i18n scope grows. We now have a soft requirement for **Wolof** as an additional surface (subtitled videos at minimum, plus audio explainers). Adds a future skill `wolof-content-pipeline`. NOT a Wave-0 blocker — FR launch first, Wolof in Wave 2+.

### D014 — Phased build/verify/lock rollout (no timelines)
**Source:** Tom, 2026-05-07 (overrides earlier soft/hard-launch framing)
**Decision:** Drop launch-date theatre. Build the platform as a **strict sequence of phases**, each with a hard gate: **build → Tom verifies → lock → next**. No phase opens until the previous one is locked. No timelines published — pace is whatever Tom can sustain pushing hard. Tom is the verifier on every gate.

**Why phased over soft/hard launch:**
- Tom is the builder + verifier; small focused increments are easier to validate and lock than a single big-bang launch.
- AI agents (this one) perform better with explicit phase boundaries than with vague timelines — discrete deliverables, discrete gates.
- We sequence everything chronologically and push hard, but verification is per-phase, not per-week.

**Phase order (everything FR-primary, EN deferred per D011):**

1. **Foundation** — pnpm monorepo (`web`, `cms`, `shared`), Payload CMS + Supabase wiring, base auth (D015), root layout + header/footer/nav from CMS globals, FR locale only, deploy stub on Vercel cdg1.
2. **Brand site (static, CMS-driven)** — Homepage, About + Team (5 people), Partners (10), Contact, **10 sector pages** (per D012), **Programmes section** (3 active + Sen React itself, names TBC from Amadou). Pulled from senreact.com brand (D018).
3. **Content engine** — News/blog (weekly, by sector, moderated comments later), Publications (downloadable PDFs), Videos (YouTube embed, FR + Wolof subs, downloadable for offline per D016).
4. **Opportunities dashboard — read-only** — manual entries via Payload, filters (sector / type / area / deadline / amount), keyword search, saved-opportunities for logged-in members.
5. **Aggregation pipeline** — Supabase `pg_cron` → Payload Jobs → scrape + normalise from the 11 sources in D011 → REACT-approval queue → publish.
6. **Member accounts + profiles** — 5 profile types per Amadou §8 (Entrepreneur, Organisation, Institution, Partner, Admin), email+password (D015), profile fields + privacy controls.
7. **B2B directory + reviews/ratings + "Looking for X" board** — directory pages with displayed contact info (phone/email/WhatsApp/website/socials), **no in-platform inbox** (D016 — users contact each other directly), reviews/ratings on profiles, "Looking for X" submission + listing.
8. **Community** — registered access only (D011), forums by sector, groups by region/sector/theme, events calendar (in-person + online), webinars, mentor-mentee matching, REACT announcements.
9. **Capacity building** — resources / tutorial videos / technical sheets, webinar listings, physical workshop calendar. Always free (D011). No certifications at launch.
10. **Formalisation toolkit** — guided journey (BCE/APIX, RCCM/NINEA, FRA, import-export card, business plan, financial management) with downloadable checklists/templates. External redirects for financing/fundraising/support per Amadou §4.2.
11. **Compliance + admin handoff** — CDP filing (REACT-owned, see D017), AI-drafted ToS/Privacy/Cookies handed to REACT for legal review (REACT-owned, see D017), parental-consent affordance for minors at sign-up, French admin user guide, full Payload admin training pack for REACT staff.
12. **Launch readiness** — Google Analytics wired, content QA, pre-launch content seeding (NGOs/media/authorities per Amadou §14), accessibility pass (WCAG AA default).
13. **Launch.**

**Deferred (post-launch, not blocking):**
- **Notifications stack** (email + WhatsApp + in-app + push) — pushed back per Tom 2026-05-07
- **Social auto-post** (FB / LinkedIn / Instagram / X / TikTok) — pushed back per Tom 2026-05-07
- **AI assistant** ("Sen React assistant") — pushed back, scope still TBC from Amadou (see follow-up Q3)
- **Payments** (Wave / Orange Money / card) — pushed back, scope still TBC from Amadou (see follow-up Q4)
- **Wolof content pipeline** — Wave 2+ per D013
- **In-platform B2B inbox** — explicitly out per Tom 2026-05-07; revisit only if direct-contact pattern proves insufficient
- **EN translation pass** — REACT-paced per D010 Q2

**Gate rules per phase:**
- Phase doesn't open without the previous one locked.
- "Locked" = Tom has run it end-to-end (per validation-standards: real execution, not just compile).
- If a phase reopens (defect, scope change), it goes back to build state — downstream phases pause.
- Findings during validation that don't block the phase get logged as `phase-{n}-followups.md` and addressed in a dedicated patch phase before launch.

### D015 — Auth methods: locked
**Source:** Tom, 2026-05-07 (resolves the D003-vs-Amadou-§8 conflict)
**Decision:**
- **Email + password** via Supabase — primary, mandatory.
- **Google + Facebook OAuth** — added **only if it's effectively free + trivial via Supabase native providers**. If integration adds meaningful work (custom callback handling, app review with Meta/Google, extra UI), **leave them out** for now and revisit post-launch.
- **Phone OTP** — **dropped**. Twilio costs, international SMS rates, no clear win over email for this audience.

**How we explain to Amadou:** "We've simplified sign-up to email + password to keep it fast and reliable. We may add Google/Facebook sign-in shortly — if not, we'll add them after launch. SMS-based sign-in adds cost without making things easier for users."

**Implementation note for Phase 1/6:** Tom verifies the Supabase Google/Facebook setup cost before flipping them on. Default = off; flag = on once confirmed trivial.

### D016 — Net-new feature requests: triaged
**Source:** Amadou response §4–§16, 2026-05-04 + Tom triage 2026-05-07
**Decisions per item:**

| # | Feature | Status | Phase |
|---|---|---|---|
| 1 | **B2B in-platform inbox** | **DROPPED for now.** Users contact each other directly via displayed phone/email/WhatsApp on profile. Revisit only if direct-contact friction emerges post-launch. | n/a |
| 2 | **Reviews/ratings** on B2B profiles | **KEEP.** | Phase 7 |
| 3 | **"Looking for X" board** | **KEEP.** Confirmed by Tom. | Phase 7 |
| 4 | **Auto-post** to FB / LinkedIn / Instagram / X / TikTok | **PUSHED BACK.** Post-launch deferred. | Deferred |
| 5 | **Notifications stack** (email / WhatsApp / in-app / push) | **PUSHED BACK.** Post-launch deferred. | Deferred |
| 6 | **Citizen participation** | **NEEDS CLARIFICATION** before locking scope. Theme vs feature, and which forms? See follow-up Q2. | TBC |
| 7 | **AI assistant** ("Sen React assistant") | **PUSHED BACK** + **needs clarification** on what kind of assistant and what it would do. See follow-up Q3. | Deferred |
| 8 | **"Innovative digital solutions" showcase** | **NEEDS CLARIFICATION** on submission/curation/voting model. See follow-up Q5. | TBC |
| 9 | **Payments** (Wave / Orange Money / card) | **PUSHED BACK** + **needs clarification** on what users would pay for. See follow-up Q4. | Deferred |
| 10 | **Downloadable videos** for offline | **KEEP.** | Phase 3 |
| 11 | **Auto-translation FR → EN** at admin time | **KEEP** (already in D005, REACT-paced per D010 Q2). | Phase 12 |

**Net effect on D002:** B2B becomes directory + reviews/ratings + "Looking for X" board. **No inbox, no REACT-brokered intros, no verification tiers in v1.** Aligned with the "external contact for now" call.

### D017 — Compliance: REACT owns legal, Tom helps with drafts only
**Source:** Tom, 2026-05-07 (re-scopes Amadou §12 ask)
**Decision:**
- **Tom is not the legal owner.** Tom is providing technical help only. Drafting / reviewing / filing ToS, Privacy, Cookies, and CDP registration is **REACT's responsibility**.
- **What Tom will provide:** AI-generated **starting drafts** of ToS, Privacy Policy, and Cookies Policy (FR + EN), tailored to Sen React's data flows. Delivered as drafts. **REACT must engage their own legal review** (ideally a Senegalese lawyer familiar with the CDP regime) before publication. Tom takes **no responsibility** for legal sufficiency or accuracy.
- **CDP filing** — REACT-owned. Tom will document what data the platform collects + how it's processed (a technical data-flow doc) so REACT's legal advisor can do the filing.
- **Minors (15+) allowed** — keep. Parental-consent affordance at sign-up: simple checkbox + optional parent-email field. This is a product design choice, not a legal opinion. REACT to validate adequacy with their legal advisor.
- **Content rights** — REACT claims rights on submitted content. Must be in the ToS. Drafted by AI, reviewed by REACT's legal.

**How we explain to Amadou:** "I (Tom) am only helping with the tech build. For ToS / Privacy / Cookies / CDP, I can give you AI-generated drafts to start from, but REACT needs to get them reviewed by a lawyer before launch. I can't take responsibility for legal correctness."

**Phase placement:** Phase 11 (Compliance + admin handoff). Drafts handed over with the admin training pack.

### D018 — Brand reference: senreact.com is the source of truth
**Source:** Amadou response §1, §13, 2026-05-04
**Decision:** Pull logo, colours, typography from current senreact.com via scrape + manual extraction. No new design system. Confirm visual coherence with Amadou via PDF mockup before Wave 1.

### D019 — Full discovery audit: previously-uncaptured definitive answers
**Source:** Tom audit, 2026-05-07, against `discovery/responses/amadou-discovery-response-{en,fr}.md`
**Reason for entry:** D011 captured the high-level summary but several pieces of *definitive content* from Amadou's response were not yet locked into the log. This entry closes those gaps in one place.

**A1 — About-page verbatim copy (FR primary, EN translated by Claude per D005).**
- *Mission:* "Notre mission est de favoriser la transition digitale et écologique au profit du développement économique durable. Notre objectif est de renforcer les capacités d'autonomisation et d'innovation des entrepreneurs africains afin de promouvoir un entrepreneuriat durable et compétitif, tout en luttant contre les effets du changement climatique."
- *Vision:* "Être un leader incontournable de la révolution digitale en Afrique de l'Ouest et accroître considérablement notre impact sur le développement économique durable des entrepreneurs."
- *Values (3, not 5):* Leadership · Inclusion numérique · Développement économique durable. **Note:** Amadou's earlier "inclusive, practical, accessible, collaborative" placeholder is replaced by these three.
- *Founding story:* 20 May 2021, post-COVID resilience initiative led by Elhadj Amadou Samb (President) + Cheikh Oumar Kane (Secretary General); 2024 relaunch focused on Digital + Ecological Transition.
- *Phase placement:* Phase 2 (Brand site).

**A2 — Formalisation toolkit content map (Phase 10).** Direct help paths (REACT-produced tutorials/checklists/forms): Business creation (BCE / APIX / RCCM / NINEA / declaration of existence) · Import-export card (RCCM + NINEA + trader's card via CCIAD + DCI filing) · FRA (Authorisation of Manufacturing and Sale, DCSC at Camp Lat Dior) · Business plan drafting · Financial management. External-redirect paths (no in-platform tooling): Access to financing · Fundraising · Support opportunities. Verbatim step-by-step procedures Amadou supplied for BCE/RCCM/NINEA, FRA, and import-export card are the source content for the tutorials — captured in `amadou-discovery-response-{en,fr}.md` §4.2 Q1.

**A3 — Information-dissemination scope (Phase 3).** Content types Amadou explicitly listed: news · opportunities · events · grants · flagship innovations · laws · threats · best practices · role models. Two write paths: REACT team writes some + aggregation pipeline (D004) generates the rest. Update cadence: scheduled by REACT's platform management team (Phase 5/9).

**A4 — Video content types (Phase 3).** *Capsule · short explanations · interviews · vlogs · testimonials.* FR + Wolof with subtitles. YouTube-embed hosting (free, locally-suited). Both REACT-original and curated/partner content. Downloadable for offline (already in D016 row 10).

**A5 — B2B discovery surface (Phase 7).** All four discovery patterns confirmed: directory browse · search by sector/region · automatic recommendations · virtual events. "Virtual events" likely overlaps with Phase 8 community webinars — same primitive, two surfaces. Auto-recommendations need a recommender input but can ship a simple sector-+-region match in v1.

**A6 — Audience extension: investors/funders/donors are a viewing audience.** They browse to identify solutions/innovations/projects they may support. **Implication:** profile pages and project/business listings need a "for funders" lens — clear sector tag, region, stage, contact. Not a separate role in v1; uses public B2B directory + Programmes section. Phase 2 + Phase 7.

**A7 — Application help is informational only.** Sen React provides templates/CV review/recommendation-letter guidance as content, but does not broker applications or write letters on behalf of users in v1. Phase 4.

**A8 — Policy library posture (Phase 3 / Phase 6.4).** Texts simplified for understanding (plain-language summaries rather than full statutory text). External experts may comment alongside primary text. Search by sector / theme / date. Admin (single) is responsible for keeping library current.

**A9 — Workshops + events are required surfaces (Phase 8 / Phase 9).** REACT runs in-person workshops and events. The platform must list, register, and post-recap them. Calendar surface in Phase 8; capacity-building workshop calendar in Phase 9.

**A10 — Success metrics (used to validate phase locks + post-launch).**
- *Mission KPIs:* businesses formalised via Sen React · B2B connections established · people trained · opportunities successfully applied for.
- *Platform health KPIs:* monthly active users · content published per month · return rate.
- *Qualitative signals:* testimonials · stories · media coverage.
- *No external-funder reporting cadence required.* Review cadence with REACT — open, see follow-up Q15.

**A11 — WhatsApp "subscription" clarification.** Amadou's §4.1 answer ("we want a very simple registration with WhatsApp") refers to a **content/newsletter subscription channel**, not auth. Pairs with D015 (auth = email+password, no OTP). Implementation: opt-in WhatsApp broadcast list (not a Twilio/SMS billing path). Deferred with the rest of the notifications stack per D016.

**A12 — Daily admin operating model (Phase 11 handoff).** *One admin* handles all platform operations under the Director's (Amadou's) approval. Single role in Payload's RBAC at launch — `admin` (full powers, gated by Director approval workflow at the human level, not the system level). Multi-role RBAC deferred until org grows.

**A13 — Content language workflow.** Admin publishes in French → flags `needs_review` + `needs_translation` → Claude translation runs → Amadou verifies EN before publish. Matches D005 + D010 Q2 (EN can lag).

**A14 — Newsletter tool: not yet selected.** Amadou has no existing list. Tom-decision pending — recommend **Brevo** (FR-friendly, popular in Francophone Africa, generous free tier). Locked when Phase 12 opens.

**A15 — Analytics: Google Analytics confirmed.** Phase 12. No Plausible/PostHog.

**A16 — Imagery source.** REACT has an existing photo library of entrepreneurs they've trained. No stock images. Tom to download Drive folder (linked 2026-05-04) and inventory against the gap list in follow-up Q8.

**A17 — Growth channels (post-launch ops, not Tom-built).** Social media · radio · partners · in-person events · webinars · WhatsApp groups · SEO · interviews. SEO is the only one that the platform must explicitly support — Phase 2 (sector pages), Phase 3 (publications/news), Phase 12 (sitemap, structured data, OG tags).

**A18 — Launch partners.** NGOs, media, authorities (no specific names locked yet). Phase 12 — pre-launch outreach is REACT's job, not Tom's.

**A19 — "Innovative digital solutions" showcase.** Confirmed as a section Amadou wants ("a section to collect innovative digital solutions in order to promote them"). Submission/curation/voting model is unresolved → follow-up Q5 stays open. Phase placement TBC, likely Phase 2 or Phase 3 once scoped.

**A20 — Citizen participation: partial answer received.** Amadou listed the forms he wants in §7.2: public consultations/surveys on policies · petitions/open letters · citizen reports · civic debate forums · citizen-led project calls. Two-way engagement with institutions is desired ("for institutions to be close to citizens"). **Still open:** which subset to prioritise for v1, and which deserve their own surfaces vs. living inside forums (Phase 8). → Follow-up Q2 narrowed below.

**A21 — Tone of voice locked.** Chaleureux, pratique, stimulant (warm, practical, stimulating). Drives copy across all CMS-rendered pages.

**A22 — Reference sites for visual mood.** BudgIT, Tracka, CJS Yakaar. Tom may propose additional references in the brand mock pass before Phase 2 sign-off.

**A23 — Connectivity + literacy realities (cross-phase).** Smartphone-only, slow/expensive connections, ~30% French literacy, 70% need audio/video alternatives. Already informs D013, but locking the *non-negotiables* here: light bundles (≤200KB initial JS target) · image lazy-loading + low-res placeholders · audio/video alternatives required for any text-heavy page · Wolof subtitles on all REACT-original videos (Phase 3) · no autoplay, no heavy hero videos.

**A24 — Amadou-stated launch wish (FYI, NOT a commitment).** Amadou wrote "We wish to officially launch the platform in early June" (§14.1). This was written 2026-05-04 — a ~5-week wish from then. **Per D014, we do not commit to dates.** Tom's response framing: "we'll push hard, build phase by phase, and lock when each phase is verified — earliest possible launch is what we'll deliver, but no published date." Logged for context only.

### D021 — Amadou response to follow-ups Q1–Q6 (2026-05-07)
**Source:** Amadou WhatsApp 2026-05-07 23:00, in response to `discovery/responses/tom-followups-fr.md`. Verbatim FR responses captured below.

**Q1 — 3 currently-active programmes** (resolves Phase 2 §7 yellow row → green):
1. **Projet 3A** — *"Renforcer la formalisation, l'autonomisation et la compétitivité des entrepreneurs locaux et leaders communautaires afin de promouvoir le leadership communautaire, le développement durable et l'adaptation au changement climatique au Sénégal."*
2. **Projet Sen React** — *"Création d'un écosystème numérique d'information, de renforcement de capacités et de mise en relation pour les entrepreneurs et acteurs de changement au Sénégal et en Afrique."* (= this platform; headline programme)
3. **IA for Change** — *"Promotion des outils IA pour renforcer la productivité et l'innovation des entrepreneurs et acteurs de changement."*

**Q2 — Innovative-digital-solutions showcase model:** Sen React-curated only, via fellowship programmes or specific calls for solutions. Not user-submitted, not community-voted. Locks the v1 model.

**Q3 — Legal/compliance ownership:** Tom delivers AI-drafted ToS / Privacy / Cookies / CDP markdown; REACT engages a Senegalese lawyer to validate before launch. Reaffirms D017. Drafts now sit in Tom's queue (Phase 11).

**Q4 — Parental consent UX:** Single checkbox at signup confirming parental agreement. No document upload, no separate parent email. Lock for Phase 6.

**Q5 — Sectors:** Amadou's text opens *"6 secteurs au lieu de 10"* but the bullet list contains all **10** D012 sectors and closes *"On peut confirmer les secteurs ci-dessus."* Read as confirmation of all 10 (the "6" appears to be a typo). Tom flagged a 30-sec WhatsApp ping to confirm; meanwhile we ship the 10 we have. **No change to D012 unless Amadou subsequently corrects.**

**Q6 — B2B tiers:** One tier at launch; keep the option to add verified-badge / premium later without rebuilding. Aligns exactly with the D020 Yellow-row "hidden tier flag" plan. Lock for Phase 7.

**Tom action carried forward:** AI-drafted ToS / Privacy / Cookies / CDP markdown promised to Amadou (per his closing line *"looking forward to the IA draft for legal conformity"*). Tracked in Phase 11; not blocking current Phase 2 work.

### D020 — Tom triage of follow-ups (round 2)
**Source:** Tom, 2026-05-07
**Context:** After D019 surfaced 13 new follow-ups (Q10–Q22), Tom triaged them. Items below are now locked decisions; the rest are pruned from the open-question list (see updated follow-ups below).

**Profile types (5) — locks §8.2 / Q16:**
1. Individual entrepreneur
2. Organisation (company / cooperative / NGO)
3. Government or ministry (institutional role)
4. Partner (landowner / NGO)  *— "landowner" taken at face value given REACT's agricultural + livestock + agroecology focus; if voice-transcription artefact, flag on next WhatsApp_*
5. Admin (REACT team)

**Verification — locks §8.4 / Q15:** Manual review by a REACT admin for Organisation, Institution, and Partner profiles. Optional registration-document upload at submission, but admin-discretion approval is what gates publication. Individual entrepreneur accounts are self-service (no verification gate). Phase 6.

**Privacy visibility — locks §8.6 / Q17:** Default rules apply.
- *Public:* profile name, sector(s), region, photo, short description.
- *Logged-in members only:* phone, email, WhatsApp, full contact details.
- *Admin only:* everything (audit, moderation).

**Citizen participation — locks §7 / Q18:** No standalone civic-features platform. Minimal scope only: discussion forums (already part of Phase 8 community) + occasional REACT-led surveys (lightweight Payload form, not a polling product). Petitions, citizen reports, civic debate forums, citizen-led project calls — **out of scope** for v1, no follow-up needed.

**Newsletter tool — locks §11.2 / Q19:** **Brevo** (Tom's recommendation, accepted as default unless something materially better surfaces during Phase 12 build). FR-friendly, free tier sufficient at launch volume, popular in Francophone Africa.

**Accessibility — locks §13.4 / Q20:** Default WCAG AA only. No additional toggles (no high-contrast mode, no large-text mode, no dyslexia-friendly font swap) unless a real audience need surfaces post-launch.

**Pruned from follow-ups (Tom decided not to ask):**
- Q3 (AI assistant scope) — already pushed back; revisit only if Amadou raises it again post-launch.
- Q4 (payments) — already pushed back; same posture.
- Q2 (citizen participation: theme or feature) — superseded by the §7 lock above.
- Q8 (photo library audit) — Tom will inventory directly from the Drive folder; no Amadou input needed yet.
- Q9 (pre-launch content seeding numbers) — REACT will fill what they can; no quota imposed.
- Q12 (capacity tracking + LMS) — go with the recommendation (YouTube embed + light "watched" tracking, no native LMS) without asking.
- Q13 (publications gating) — default to fully open downloads; revisit if REACT later wants email-gated whitepapers.
- Q14 (policy library domains) — REACT seeds what they have; no Tom-blocking content list needed.
- Q21 (review cadence) — set after launch, not before.
- Q22 (showcase scope) — already covered by Q5.

---

## Open follow-ups for Amadou (next WhatsApp)

These are the questions where Amadou's input is genuinely needed before we can lock scope on the corresponding phase. Triaged by Tom 2026-05-07 (D020) — pruned items recorded there.

1. **Q1 — Which 3 projects are currently active?** Of the 6 projects on senreact.com, only 3 are still active (per D010 Q1). Names + 1-sentence description each so we can build the **Programmes section** alongside Sen React itself. Needed before Phase 2 opens.
2. **Q2 — "Innovative digital solutions" showcase — how should it work?**
   - Open submission form (anyone can submit, REACT curates)?
   - Curated only by REACT?
   - Community-voted ranking?
   - What fields per submission?
   *Needed to scope Phase 2/3 placement.*
3. **Q3 — Compliance / legal ownership.** Confirm: **REACT owns ToS / Privacy / Cookies / CDP filing.** Tom delivers AI-generated *drafts only* but REACT must engage a Senegalese lawyer for review before launch (see D017). **Does REACT have a legal advisor identified?** Needed before Phase 11.
4. **Q4 — Parental consent for minors (15–17).** Proposal: at-signup checkbox + optional parent email, no document upload. **Confirm this is the design intent** (REACT's legal advisor will validate adequacy separately). Needed before Phase 6.
5. **Q5 — Sector deep-dives (§3 A–F per sector — the largest content gap).** The discovery doc asked, for each of the 10 sectors (D012): A) priority, B) key actors, C) 3–5 concrete opportunities, D) main obstacles, E) existing content, F) emblematic success stories. **None of the 10 sectors have these answered.** Without it, the sector pages in Phase 2 will be skeletons. **Why was this section left out?** Was the question unclear, too long, or not yet doable? Proposal: voice-note one sector at a time on WhatsApp — Tom transcribes + drafts the page — Amadou edits in PDF.
6. **Q6 — B2B differentiation tiers (§4.3.6).** Amadou said "I do not understand the question." Re-explanation: at launch, all B2B profiles are equal — same look, same fields, same visibility. Later, REACT may want a **"verified by REACT" badge** (after vetting an organisation) or **"premium / boosted" listings** (paid placement, monetisation later). Two confirmations needed:
   - At launch, **one tier only** — yes?
   - Keep the **option** to add badges / premium later without rebuilding — agreed?

**Tom — additional follow-ups to add:**
- _(none yet — Tom to fill in if he had others in mind)_
