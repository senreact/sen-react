/**
 * Seed script — populates Payload globals + collections with their
 * canonical initial values from the design decisions log.
 *
 * Usage:
 *   pnpm --filter @sen-react/cms seed
 *
 * The script is idempotent — every record is upserted, so re-running
 * resets globals/collections back to canonical state. Editors can
 * override fields after seeding via the admin UI; re-running the seed
 * will overwrite those overrides, so only run after coordinating with
 * REACT.
 *
 * Reads `DATABASE_URL`, `PAYLOAD_SECRET` from `.env.local` (or whatever
 * env source the parent shell provides). Connects to whichever Supabase
 * project the env points at, so the same script works against dev,
 * preview, and production databases — call sites are responsible for
 * loading the right env file before invoking.
 *
 * NODE_ENV is forced to "production" before Payload boots so the
 * postgres adapter skips its dev-mode schema push (which inserts a
 * `batch = -1` row in payload_migrations and then makes the next prod
 * `payload migrate` hang on a destructive-confirmation prompt).
 * Migrations are the source of truth — the seed only writes data.
 */

// `process.env.NODE_ENV` is typed read-only by @types/node, but the
// runtime value is freely settable. Cast through Record so TS doesn't
// complain.
(process.env as Record<string, string>).NODE_ENV = "production";

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getPayload } from "payload";
import { fileURLToPath } from "url";

import { DEFAULT_SITE_FOOTER, DEFAULT_SITE_HEADER } from "@sen-react/shared";

import config from "./payload.config";

const PARTNERS_SEED = [
  {
    slug: "adepme",
    name: "ADEPME",
    kind: "institution",
    description: "Agence sénégalaise dédiée au développement et à l'encadrement des PME.",
    order: 0,
  },
  {
    slug: "ancar",
    name: "ANCAR",
    kind: "institution",
    description: "Agence Nationale de Conseil Agricole et Rural.",
    order: 1,
  },
  {
    slug: "ministere-communication-numerique",
    name: "Ministère de la Communication et du Numérique",
    kind: "institution",
    description: "Tutelle institutionnelle de la transformation numérique au Sénégal.",
    order: 2,
  },
  {
    slug: "civic-hive",
    name: "CIVIC HIVE",
    kind: "ngo",
    description: "Partenaire de la société civile sur les enjeux de gouvernance et de civic-tech.",
    order: 0,
  },
  {
    slug: "african-youth-commission",
    name: "African Youth Commission",
    kind: "ngo",
    description: "Coalition panafricaine pour la jeunesse, alliée du réseau REACT.",
    order: 1,
  },
  {
    slug: "ibp",
    name: "IBP",
    kind: "ngo",
    description: "Partenaire de société civile sur les enjeux budgétaires et de transparence.",
    order: 2,
  },
  {
    slug: "enda-ecopop",
    name: "Enda ECOPOP",
    kind: "ngo",
    description: "ONG sénégalaise du réseau Enda, partenaire de longue date sur les enjeux locaux.",
    order: 3,
  },
  {
    slug: "cjs",
    name: "CJS",
    kind: "ngo",
    description: "Organisation de jeunesse partenaire sur les programmes d'autonomisation.",
    order: 4,
  },
  {
    slug: "afikanite",
    name: "AFIKANITE",
    kind: "ngo",
    description: "Partenaire panafricain accompagnant l'écosystème entrepreneurial du continent.",
    order: 5,
  },
  {
    slug: "gpf",
    name: "GPF",
    kind: "ngo",
    description: "Organisation partenaire de société civile, alignée sur les valeurs de REACT.",
    order: 6,
  },
] as const;

const PROGRAMMES_SEED = [
  {
    slug: "sen-react",
    title: "Projet Sen React",
    eyebrow: "Programme phare",
    description:
      "Création d'un écosystème numérique d'information, de renforcement de capacités et de mise en relation pour les entrepreneurs et acteurs de changement au Sénégal et en Afrique.",
    variant: "headline",
    order: 0,
  },
  {
    slug: "projet-3a",
    title: "Projet 3A",
    eyebrow: "Programme actif",
    description:
      "Renforcement de la formalisation, de l'autonomisation et de la compétitivité des entrepreneurs locaux et des leaders communautaires, pour promouvoir le leadership communautaire, le développement durable et l'adaptation au changement climatique au Sénégal.",
    variant: "active",
    order: 1,
  },
  {
    slug: "ia-for-change",
    title: "IA for Change",
    eyebrow: "Programme actif",
    description:
      "Promotion des outils d'intelligence artificielle pour renforcer la productivité et l'innovation des entrepreneurs et des acteurs de changement.",
    variant: "active",
    order: 2,
  },
] as const;

const TEAM_SEED = [
  { slug: "elhadj-amadou-samb", name: "Elhadj Amadou Samb", role: "Directeur Exécutif", order: 0 },
  { slug: "cheikh-oumar-kane", name: "Cheikh Oumar Kane", role: "Secrétaire Général", order: 1 },
  {
    slug: "yaye-bineta-mamadou-drame",
    name: "Yaye Bineta Mamadou Dramé",
    role: "Coordinatrice programmes & communication",
    order: 2,
  },
  { slug: "siny-thioune", name: "Siny Thioune", role: "Suivi & évaluation", order: 3 },
  { slug: "mamadou-coly", name: "Mamadou Coly", role: "Infographie & web manager", order: 4 },
] as const;

const CONTACT_SEED = {
  email: "senreactsen@gmail.com",
  phoneE164: "+221773213955",
  phoneDisplay: "+221 77 321 39 55",
  addressLines: [{ line: "Sacrée Coeur 3, Lot N° 128/B" }, { line: "Dakar, Sénégal" }],
};

const HOMEPAGE_HERO_SEED = {
  eyebrow: "Réseau des Entrepreneurs Actifs",
  headline:
    "Favoriser la transition digitale et écologique au profit du développement économique durable.",
  leadParagraph:
    "Sen React renforce les capacités d'autonomisation et d'innovation des entrepreneurs africains — femmes, jeunes et communautés vulnérables — afin de promouvoir un entrepreneuriat durable et compétitif, tout en luttant contre les effets du changement climatique.",
  primaryCta: { label: "Rejoindre la communauté", href: "/inscription" },
  secondaryCta: { label: "En savoir plus", href: "/a-propos" },
};

const EMPTY_STATES_SEED = {
  news: {
    title: "Les premières actualités arrivent bientôt.",
    description:
      "Cette section accueillera les articles, opportunités et publications éditées par REACT dès que la rédaction démarre.",
  },
  publications: {
    title: "Les premières publications arrivent bientôt.",
    description:
      "Cette section accueillera les études, rapports et notes de réflexion REACT en téléchargement libre dès leur parution.",
  },
  videos: {
    title: "Les premières vidéos arrivent bientôt.",
    description:
      "Cette section accueillera les capsules, entretiens et témoignages REACT dès le démarrage de la production audiovisuelle.",
  },
  opportunities: {
    title: "Les premières opportunités arrivent bientôt.",
    description:
      "Cette section accueillera les financements, formations et appels à projets curés par REACT pour les entrepreneurs sénégalais et africains.",
  },
  opportunitiesNoMatch: {
    title: "Aucune opportunité ne correspond à vos critères.",
    description: "Essayez d'élargir vos filtres ou de réinitialiser la recherche.",
  },
  homepageLatestNewsFallback: [
    {
      eyebrow: "Bientôt",
      title: "Premier article à publier dès le lancement",
      excerpt:
        "Cette section accueillera les actualités, opportunités et publications éditées par l'équipe REACT.",
    },
    {
      eyebrow: "Bientôt",
      title: "Témoignages d'entrepreneurs accompagnés",
      excerpt:
        "Nous publierons régulièrement les parcours de femmes et de jeunes formés et accompagnés à travers nos programmes.",
    },
    {
      eyebrow: "Bientôt",
      title: "Analyses et publications de fond",
      excerpt:
        "Études, rapports et notes de réflexion sur l'entrepreneuriat sénégalais et africain — préparés par REACT.",
    },
  ],
};

/**
 * Helpers to build the Lexical JSON for the About-page Founding + Legal
 * bodies. Inline emphasis is preserved by setting `format: 1` (bold) on
 * the text nodes that the original JSX wrapped in <strong>.
 */
const FORMAT_BOLD = 1;
const FORMAT_CODE = 16;

interface LexicalSpan {
  text: string;
  format?: number;
}

function lexicalParagraph(spans: LexicalSpan[]): Record<string, unknown> {
  return {
    type: "paragraph",
    version: 1,
    children: spans.map((s) => ({
      type: "text",
      version: 1,
      text: s.text,
      format: s.format ?? 0,
    })),
  };
}

function lexicalRoot(paragraphs: Record<string, unknown>[]): Record<string, unknown> {
  return {
    root: {
      type: "root",
      version: 1,
      children: paragraphs,
    },
  };
}

function lexicalHeading(level: 2 | 3, text: string): Record<string, unknown> {
  return {
    type: "heading",
    tag: `h${level}`,
    version: 1,
    children: [{ type: "text", version: 1, text, format: 0 }],
  };
}

function lexicalPara(text: string): Record<string, unknown> {
  return lexicalParagraph([{ text }]);
}

const FOUNDING_BODY = lexicalRoot([
  lexicalParagraph([
    { text: "REACT a été créé le " },
    { text: "20 mai 2021", format: FORMAT_BOLD },
    { text: " par " },
    { text: "Elhadj Amadou Samb", format: FORMAT_BOLD },
    { text: ", Directeur Exécutif, et " },
    { text: "Cheikh Oumar Kane", format: FORMAT_BOLD },
    {
      text: ", Secrétaire Général, comme une initiative de résilience entrepreneuriale dans le contexte post-COVID-19. L'objectif initial : redonner du souffle aux entreprises sénégalaises fragilisées par la crise sanitaire et économique.",
    },
  ]),
  lexicalParagraph([
    { text: "En " },
    { text: "2024", format: FORMAT_BOLD },
    { text: ", REACT s'est repositionné autour d'un axe plus ambitieux : faire de la " },
    { text: "transition numérique", format: FORMAT_BOLD },
    { text: " et de la " },
    { text: "transition écologique", format: FORMAT_BOLD },
    {
      text: " les deux piliers de l'émancipation économique des femmes, des jeunes et des communautés vulnérables. C'est cette vision qui structure aujourd'hui Sen React.",
    },
  ]),
]);

const LEGAL_BODY = lexicalRoot([
  lexicalParagraph([
    {
      text: "REACT est une association à but non lucratif, enregistrée au Sénégal sous le numéro ",
    },
    { text: "N° 00020614/MINT/DGAT/DLPL/DAPA", format: FORMAT_CODE },
    { text: ". Siège : Sacrée Cœur 3, Lot N° 128/B, Dakar, Sénégal." },
  ]),
]);

const AUTH_STRINGS_SEED = {
  signin: {
    pageTitle: "Connexion",
    leadParagraph: "Accédez à votre espace membre Sen React.",
    submitLabel: "Se connecter",
    signupPrompt: "Pas encore de compte ?",
    signupLink: "Créer un compte",
  },
  signup: {
    pageTitle: "Créer un compte",
    leadParagraph: "Rejoignez la plateforme Sen React. Un e-mail de confirmation vous sera envoyé.",
    submitLabel: "Créer un compte",
    passwordHint: "Au moins 8 caractères.",
    signinPrompt: "Déjà inscrit ?",
    signinLink: "Se connecter",
  },
  form: {
    emailLabel: "Adresse e-mail",
    passwordLabel: "Mot de passe",
    pendingLabel: "Veuillez patienter…",
  },
  errors: {
    signinFailed: "Identifiants invalides ou compte non confirmé.",
    signupFailed: "Inscription impossible. Vérifiez vos informations et réessayez.",
    signupSuccess:
      "Compte créé. Un e-mail de confirmation a été envoyé. Cliquez sur le lien pour activer votre compte.",
    validationFailed: "Validation échouée",
  },
};

const SECTORS_PAGE_SEED = {
  index: {
    eyebrow: "Secteurs d'intervention",
    headline: "Dix secteurs, une économie en transition.",
    leadParagraph:
      "REACT structure ses programmes autour de dix secteurs prioritaires pour l'entrepreneuriat sénégalais et africain — du numérique à l'agroécologie en passant par la transformation et la saponification.",
  },
  detail: {
    backLinkLabel: "← Tous les secteurs",
    eyebrow: "Secteur d'intervention",
    placeholderHeader: {
      eyebrow: "À venir",
      headline: "Le détail du secteur arrive avec les voicenotes d'Amadou.",
      description:
        "Les blocs ci-dessous prendront forme au fur et à mesure que REACT consolide sa cartographie sectorielle.",
    },
    placeholderBlocks: [
      {
        title: "Acteurs clés",
        description:
          "Les institutions, ONG et entreprises pivots du secteur seront listées ici à mesure que la cartographie REACT est consolidée.",
      },
      {
        title: "Opportunités",
        description:
          "Les programmes, financements et appels à projets en cours dans le secteur. Cette section se peuplera automatiquement via la chaîne d'agrégation à partir de la phase 5.",
      },
      {
        title: "Ressources",
        description:
          "Tutoriels REACT, fiches techniques, vidéos et publications spécifiques au secteur. Contenu produit à partir de la phase 9 (renforcement de capacités).",
      },
    ],
  },
};

const ABOUT_PAGE_SEED = {
  hero: {
    eyebrow: "À propos de REACT",
    headline: "Un réseau pour réinventer l'entrepreneuriat sénégalais et africain.",
    leadParagraph:
      "REACT (Réseau des Entrepreneurs Actifs) accompagne les femmes, les jeunes et les communautés vulnérables dans la transition numérique et écologique. Sen React est la plateforme qui matérialise ce projet.",
  },
  mission: {
    eyebrow: "Mission",
    sectionTitle: "Renforcer l'autonomisation et l'innovation des entrepreneurs africains.",
    body: "Notre mission est de favoriser la transition digitale et écologique au profit du développement économique durable. Notre objectif est de renforcer les capacités d'autonomisation et d'innovation des entrepreneurs africains afin de promouvoir un entrepreneuriat durable et compétitif, tout en luttant contre les effets du changement climatique.",
  },
  vision: {
    eyebrow: "Vision",
    sectionTitle: "Devenir un leader de la révolution digitale en Afrique de l'Ouest.",
    body: "Être un leader incontournable de la révolution digitale en Afrique de l'Ouest et accroître considérablement notre impact sur le développement économique durable des entrepreneurs.",
  },
  values: {
    eyebrow: "Nos valeurs",
    headline: "Trois principes qui nous guident",
    items: [
      {
        title: "Leadership",
        description:
          "Former une génération d'entrepreneurs et d'entrepreneures capables de porter une transformation économique et sociale durable au Sénégal et en Afrique de l'Ouest.",
      },
      {
        title: "Inclusion numérique",
        description:
          "Faire du numérique un levier d'autonomisation pour celles et ceux qui en sont aujourd'hui les plus éloignés — femmes, jeunes, communautés vulnérables.",
      },
      {
        title: "Développement économique durable",
        description:
          "Soutenir une croissance qui crée des emplois verts et résilients, en cohérence avec les enjeux climatiques et écologiques du continent.",
      },
    ],
  },
  founding: {
    eyebrow: "Notre histoire",
    headline: "Né d'une initiative post-COVID, relancé pour la transition.",
    body: FOUNDING_BODY,
  },
  legal: {
    label: "Statut juridique",
    body: LEGAL_BODY,
  },
};

const CONTACT_PAGE_SEED = {
  eyebrow: "Contact",
  headline: "Échangeons directement.",
  leadParagraph:
    "L'équipe REACT répond plus vite via WhatsApp pour les échanges courants. Pour une demande détaillée, l'e-mail reste la meilleure option. Notre bureau est à Dakar et accueille les visites sur rendez-vous.",
  channelHints: {
    whatsapp: "Canal principal — réponse plus rapide",
    email: "Pour les demandes détaillées",
    phone: "Pour les clarifications par voix",
  },
  channelGuideHeading: "Quel canal pour quoi ?",
  channelGuide: [
    {
      channel: "WhatsApp",
      guidance:
        "questions courantes, partage de documents légers, messages vocaux. C'est le canal qu'Amadou consulte le plus souvent.",
    },
    {
      channel: "E-mail",
      guidance:
        "demandes partenariat, dossiers de candidature, échanges nécessitant une trace écrite.",
    },
    {
      channel: "Téléphone",
      guidance:
        "clarification quand un message écrit risque l'ambiguïté, sur rendez-vous de préférence.",
    },
    {
      channel: "Visite au bureau",
      guidance: "sur rendez-vous uniquement, dans le quartier de Sacrée Coeur 3 à Dakar.",
    },
  ],
};

const HOMEPAGE_DOMAINES_SEED = {
  eyebrow: "Domaines d'intervention",
  headline: "Quatre piliers, une mission cohérente",
  pillars: [
    {
      title: "Entrepreneuriat",
      description:
        "Accompagner la création, la formalisation et la croissance des entreprises portées par des femmes et des jeunes au Sénégal et en Afrique de l'Ouest.",
    },
    {
      title: "Environnement",
      description:
        "Promouvoir une économie verte, l'agroécologie et les énergies renouvelables comme leviers de résilience face au changement climatique.",
    },
    {
      title: "Digitalisation et technologie",
      description:
        "Faire de la transition numérique un moteur d'inclusion économique — applications mobiles, civic tech, fintech, IA, services numériques.",
    },
    {
      title: "Leadership de transformation",
      description:
        "Former une génération de leaders engagés capables de porter le changement social, économique et environnemental sur le continent.",
    },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// Dev-fixture content for the four "live" collections (news / publications /
// videos / opportunities). These exist so the Phase 3 + 4 surfaces can be
// visually QA'd before Amadou's real content lands. Each entry is recognisably
// a placeholder (titles like "Exemple", obvious dates) but realistic enough
// in shape (proper sector / type / area / amount values) to exercise filters
// and layouts.
//
// Idempotent: each fixture has a stable slug, upsertBySlug() handles re-runs.
// Real content from REACT will live next to these fixtures (different slugs)
// — re-running the seed won't clobber real entries unless someone happens to
// reuse one of these `exemple-*` slugs.

// Anchor the deadline / publishedAt dates relative to seed-time so fixtures
// don't go stale. `daysFromNow(n)` returns an ISO date string for filters
// (deadlineWithinDays) to actually hit something on the index.
function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

const NEWS_SEED = [
  {
    slug: "exemple-sen-react-lance-sa-plateforme",
    title: "Exemple — Sen React lance sa plateforme",
    summary:
      "Première annonce officielle : Sen React met en ligne sa plateforme dédiée à la transition numérique et écologique des entrepreneurs sénégalais.",
    body: lexicalRoot([
      lexicalPara(
        "Après plusieurs mois de préparation, REACT lance Sen React, sa plateforme dédiée à l'accompagnement des femmes, des jeunes et des communautés vulnérables dans la transition numérique et écologique.",
      ),
      lexicalHeading(2, "Ce qui change"),
      lexicalPara(
        "La plateforme centralise actualités sectorielles, opportunités curées et publications REACT — accessibles librement, sans inscription pour la lecture.",
      ),
      lexicalPara(
        "Les membres inscrits bénéficient en plus de fonctionnalités personnalisées comme la sauvegarde d'opportunités et, à venir, l'annuaire B2B.",
      ),
    ]),
    sector: "entrepreneuriat-local",
    writePath: "react-original",
    publishedAt: daysFromNow(-2),
  },
  {
    slug: "exemple-agroecologie-3-cooperatives-2026",
    title: "Exemple — Agroécologie : trois coopératives accompagnées en 2026",
    summary:
      "Bilan d'étape sur les trois coopératives agroécologiques du programme REACT — superficies, productions, défis.",
    body: lexicalRoot([
      lexicalPara(
        "Le programme d'accompagnement agroécologique de REACT a démarré début 2026 avec trois coopératives pilotes dans les régions de Thiès, Saint-Louis et Ziguinchor.",
      ),
      lexicalHeading(2, "Trois sites, trois approches"),
      lexicalPara(
        "Chaque coopérative explore une trajectoire différente : maraîchage biologique pour l'une, transformation de fruits et légumes pour la deuxième, élevage intégré pour la troisième.",
      ),
    ]),
    sector: "agroecologie",
    writePath: "react-original",
    publishedAt: daysFromNow(-7),
  },
  {
    slug: "exemple-ia-au-service-des-tpe-senegalaises",
    title: "Exemple — L'IA au service des TPE sénégalaises",
    summary:
      "Retour sur l'atelier REACT du mois d'avril : comment les TPE locales adoptent l'IA générative pour automatiser leur communication et leur gestion.",
    body: lexicalRoot([
      lexicalPara(
        "L'atelier mensuel de REACT a réuni en avril une vingtaine de TPE sénégalaises autour des outils d'IA générative — ChatGPT, Claude, et leurs équivalents locaux.",
      ),
      lexicalPara(
        "L'objectif : démystifier ces technologies et identifier des cas d'usage concrets pour des entreprises avec peu de ressources techniques.",
      ),
    ]),
    sector: "digitalisation-technologie",
    writePath: "react-original",
    publishedAt: daysFromNow(-14),
  },
  {
    slug: "exemple-saponification-filiere-feminine-croissance",
    title: "Exemple — Saponification : la filière féminine en croissance",
    summary:
      "La production artisanale de savons par les coopératives féminines connaît une accélération nette en 2026 — chiffres et témoignages.",
    body: lexicalRoot([
      lexicalPara(
        "Les coopératives féminines actives sur la saponification artisanale au Sénégal voient leur production progresser de manière significative depuis le début de 2026.",
      ),
    ]),
    sector: "saponification",
    writePath: "react-original",
    publishedAt: daysFromNow(-30),
  },
  {
    slug: "exemple-grant-african-ngo-hub-avril-2026",
    title: "Exemple — Subventions African NGO Hub, sélection avril 2026",
    summary:
      "Article agrégé depuis African NGO Fundraising Hub — sélection des subventions ouvertes en avril pour les ONG ouest-africaines.",
    body: lexicalRoot([
      lexicalPara(
        "African NGO Fundraising Hub publie chaque mois une sélection de subventions ouvertes aux ONG du continent. Voici les principales pour avril 2026.",
      ),
    ]),
    sector: "developpement-economique",
    writePath: "aggregated",
    sourceUrl: "https://ngofundraising.africa/grants-and-funding-opportunities-april-2026/",
    publishedAt: daysFromNow(-3),
  },
];

const PUBLICATIONS_SEED = [
  {
    slug: "exemple-rapport-annuel-react-2025",
    title: "Exemple — Rapport annuel REACT 2025",
    summary:
      "Bilan 2025 du réseau REACT — programmes menés, bénéficiaires accompagnés, perspectives 2026.",
    sector: null,
    language: "fr",
    publishedAt: daysFromNow(-60),
    authors: [
      { name: "Elhadj Amadou Samb", role: "Directeur Exécutif" },
      { name: "Cheikh Oumar Kane", role: "Secrétaire Général" },
    ],
  },
  {
    slug: "exemple-femmes-entrepreneures-et-numerique",
    title: "Exemple — Étude : Femmes entrepreneures et numérique au Sénégal",
    summary:
      "Étude qualitative sur l'adoption des outils numériques par les femmes entrepreneures sénégalaises — fractures, leviers, recommandations.",
    sector: "digitalisation-technologie",
    language: "fr",
    publishedAt: daysFromNow(-120),
    authors: [{ name: "Équipe de recherche REACT" }],
  },
  {
    slug: "exemple-note-reflexion-agroecologie-senegal",
    title: "Exemple — Note de réflexion : Agroécologie au Sénégal",
    summary:
      "Note courte sur les conditions de passage à l'échelle de l'agroécologie dans les régions sénégalaises productrices — contraintes, opportunités, acteurs.",
    sector: "agroecologie",
    language: "fr",
    publishedAt: daysFromNow(-90),
  },
  {
    slug: "exemple-white-paper-saponification-artisanale",
    title: "Exemple — White paper : Saponification artisanale",
    summary:
      "Synthèse REACT sur la structuration de la filière saponification artisanale au Sénégal — modèles économiques, certifications, perspectives d'export.",
    sector: "saponification",
    language: "fr",
    publishedAt: daysFromNow(-180),
    authors: [{ name: "Équipe REACT" }],
  },
];

// 11-char YouTube IDs. These are syntactically valid (pass the collection
// validator) but don't point to real Sen React videos — the embeds will show
// "Video unavailable", which is fine for visual QA of the page chrome.
const VIDEOS_SEED = [
  {
    slug: "exemple-sen-react-en-60-secondes",
    title: "Exemple — Sen React en 60 secondes",
    summary: "Capsule de présentation de la plateforme Sen React pour les nouveaux visiteurs.",
    youtubeId: "aaaa-AAAA01",
    videoType: "capsule",
    origin: "react-original",
    sector: "digitalisation-technologie",
    duration: 62,
    publishedAt: daysFromNow(-1),
  },
  {
    slug: "exemple-interview-amadou-samb",
    title: "Exemple — Interview avec Amadou Samb",
    summary:
      "Entretien long-format avec Elhadj Amadou Samb, Directeur Exécutif de REACT — genèse, vision et ambitions pour Sen React.",
    youtubeId: "bbbb-BBBB02",
    videoType: "interview",
    origin: "react-original",
    sector: "entrepreneuriat-local",
    duration: 1380,
    publishedAt: daysFromNow(-10),
  },
  {
    slug: "exemple-temoignage-cooperative-agroecologique",
    title: "Exemple — Témoignage : coopérative agroécologique de Thiès",
    summary:
      "Témoignage des productrices d'une coopérative agroécologique partenaire — parcours, défis, soutien REACT.",
    youtubeId: "cccc-CCCC03",
    videoType: "testimonial",
    origin: "react-original",
    sector: "agroecologie",
    duration: 480,
    publishedAt: daysFromNow(-21),
  },
  {
    slug: "exemple-pourquoi-energies-vertes",
    title: "Exemple — Pourquoi les énergies vertes au Sénégal ?",
    summary:
      "Explication courte sur les opportunités économiques de la transition énergétique pour les TPE sénégalaises.",
    youtubeId: "dddd-DDDD04",
    videoType: "explanation",
    origin: "curated",
    sector: "energies-renouvelables",
    duration: 240,
    publishedAt: daysFromNow(-45),
  },
];

const OPPORTUNITIES_SEED = [
  {
    slug: "exemple-bourse-fongip-femmes-numerique-2026",
    title: "Exemple — Bourse FONGIP Femmes Numérique 2026",
    summary:
      "Programme de garantie destiné aux femmes entrepreneures du secteur numérique au Sénégal — financements jusqu'à 5 M FCFA.",
    body: lexicalRoot([
      lexicalPara(
        "Le FONGIP ouvre en 2026 une bourse dédiée aux femmes entrepreneures du secteur numérique. Le programme accompagne la création et la croissance de TPE portées par des femmes au Sénégal.",
      ),
      lexicalHeading(2, "Critères d'éligibilité"),
      lexicalPara(
        "TPE dirigée par une femme, projet dans le numérique au sens large (e-commerce, services numériques, fintech, ed-tech, etc.), inscription au registre du commerce.",
      ),
    ]),
    sector: "digitalisation-technologie",
    opportunityType: "financement",
    area: "senegal",
    deadline: daysFromNow(15),
    amountValue: 5000000,
    amountCurrency: "XOF",
    amountDisplay: "Jusqu'à 5 000 000 FCFA",
    source: "FONGIP",
    sourceUrl: "http://www.fongip.sn",
    publishedAt: daysFromNow(-5),
    reactCurated: true,
  },
  {
    slug: "exemple-formation-agroecologie-enda-pronat",
    title: "Exemple — Formation Agroécologie ENDA Pronat",
    summary:
      "Cycle de formation de 6 semaines en agroécologie pour les coopératives productrices de la région de Dakar.",
    body: lexicalRoot([
      lexicalPara(
        "ENDA Pronat propose un cycle de formation gratuit en agroécologie destiné aux coopératives féminines et juvéniles de la région de Dakar. Six semaines à raison de deux journées par semaine.",
      ),
    ]),
    sector: "agroecologie",
    opportunityType: "formation",
    area: "senegal-dakar",
    deadline: daysFromNow(30),
    amountDisplay: "Formation gratuite",
    source: "ENDA Pronat",
    contactEmail: "formation@endapronat.sn",
    publishedAt: daysFromNow(-3),
    reactCurated: true,
  },
  {
    slug: "exemple-appel-energies-vertes-afrique-ouest",
    title: "Exemple — Appel à projets Énergies Vertes Afrique de l'Ouest",
    summary:
      "Programme régional de financement pour les projets d'énergies renouvelables portés par des entreprises ouest-africaines — jusqu'à 50 M FCFA.",
    body: lexicalRoot([
      lexicalPara(
        "Un consortium de partenaires régionaux ouvre un appel à projets dédié aux solutions d'énergies renouvelables — solaire, mini-réseaux, efficacité énergétique.",
      ),
      lexicalPara(
        "Les lauréats bénéficient d'un financement non-remboursable et d'un accompagnement technique sur 18 mois.",
      ),
    ]),
    sector: "energies-renouvelables",
    opportunityType: "appel-a-projets",
    area: "afrique-ouest",
    deadline: daysFromNow(60),
    amountValue: 50000000,
    amountCurrency: "XOF",
    amountDisplay: "Jusqu'à 50 000 000 FCFA",
    source: "Consortium Énergies Vertes",
    sourceUrl: "https://example.org/appel-energies-vertes-2026",
    publishedAt: daysFromNow(-10),
    reactCurated: true,
  },
  {
    slug: "exemple-concours-sen-startup-2026",
    title: "Exemple — Concours Sen Startup 2026",
    summary:
      "Compétition annuelle des startups sénégalaises — 1 M FCFA pour le gagnant et 6 mois d'accompagnement.",
    body: lexicalRoot([
      lexicalPara(
        "Sen Startup organise sa compétition annuelle des startups sénégalaises. Le concours est ouvert à tous les secteurs et privilégie l'impact et l'innovation.",
      ),
    ]),
    sector: "entrepreneuriat-local",
    opportunityType: "concours",
    area: "senegal",
    deadline: daysFromNow(5),
    amountValue: 1000000,
    amountCurrency: "XOF",
    amountDisplay: "Prix : 1 000 000 FCFA + accompagnement",
    source: "Sen Startup",
    sourceUrl: "https://www.senstartup.com",
    publishedAt: daysFromNow(-1),
    reactCurated: true,
  },
  {
    slug: "exemple-partenariat-giz-artisanat",
    title: "Exemple — Partenariat GIZ — Artisanat sénégalais",
    summary:
      "La GIZ recherche des coopératives artisanales partenaires pour son programme de structuration des filières — appui financier et technique de 10 M FCFA.",
    body: lexicalRoot([
      lexicalPara(
        "La GIZ ouvre un appel à manifestations d'intérêt pour des coopératives artisanales sénégalaises souhaitant intégrer son programme de structuration de filières. Appui financier et technique.",
      ),
    ]),
    sector: "artisanat",
    opportunityType: "partenariat",
    area: "senegal-regions",
    deadline: daysFromNow(90),
    amountValue: 10000000,
    amountCurrency: "XOF",
    amountDisplay: "Jusqu'à 10 000 000 FCFA + appui technique",
    source: "GIZ Sénégal",
    sourceUrl: "https://www.giz.de/en/regions/africa/senegal",
    publishedAt: daysFromNow(-15),
    reactCurated: true,
  },
  {
    slug: "exemple-grant-african-ngo-hub-2026",
    title: "Exemple — Subvention African NGO Fundraising Hub",
    summary:
      "Subvention destinée aux ONG ouest-africaines actives sur les enjeux de développement économique — 500 K FCFA, candidature simplifiée.",
    body: lexicalRoot([
      lexicalPara(
        "African NGO Fundraising Hub publie une subvention destinée aux ONG du continent actives sur le développement économique. Candidature courte, décision rapide.",
      ),
    ]),
    sector: "developpement-economique",
    opportunityType: "financement",
    area: "afrique",
    deadline: daysFromNow(180),
    amountValue: 500000,
    amountCurrency: "XOF",
    amountDisplay: "≈ 500 000 FCFA (montant variable selon profil)",
    source: "African NGO Fundraising Hub",
    sourceUrl: "https://ngofundraising.africa",
    publishedAt: daysFromNow(-20),
    reactCurated: false,
  },
];

const SEED_FIXTURE_DIR = join(dirname(fileURLToPath(import.meta.url)), "seed-fixtures");
const SAMPLE_PDF_PATH = join(SEED_FIXTURE_DIR, "sample.pdf");
// Stable alt-text used as the lookup key when re-running the seed. Avoids
// uploading the PDF on every run — first run creates the media doc, every
// subsequent run reuses the existing one by id.
const SAMPLE_PDF_ALT = "Sen React — fixture PDF d'exemple";

async function ensureSamplePdf(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<string | number> {
  const existing = await payload.find({
    collection: "media",
    where: { alt: { equals: SAMPLE_PDF_ALT } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) return existing.docs[0].id;
  const buffer = readFileSync(SAMPLE_PDF_PATH);
  const created = await payload.create({
    collection: "media",
    data: { alt: SAMPLE_PDF_ALT },
    file: {
      data: buffer,
      mimetype: "application/pdf",
      name: "sen-react-exemple.pdf",
      size: buffer.length,
    },
  });
  return created.id;
}

async function upsertBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection:
    | "partners"
    | "programmes"
    | "team-members"
    | "news"
    | "publications"
    | "videos"
    | "opportunities",
  data: Record<string, unknown>,
): Promise<void> {
  const slug = data.slug as string;
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  // Payload's `update`/`create` typed signature requires either `draft: true`
  // with DraftData shape or `draft: false` for the published variant. We
  // always seed to published, so cast here rather than carrying that prop
  // through the per-collection seed shapes.
  const payloadData = { ...data, _status: "published" } as never;
  if (existing.docs[0]) {
    await payload.update({ collection, id: existing.docs[0].id, data: payloadData });
  } else {
    await payload.create({ collection, data: payloadData });
  }
}

async function seed(): Promise<void> {
  const payload = await getPayload({ config });

  payload.logger.info("[seed] Upserting site-header global");
  await payload.updateGlobal({
    slug: "site-header",
    data: {
      siteTitle: DEFAULT_SITE_HEADER.siteTitle,
      tagline: DEFAULT_SITE_HEADER.tagline ?? null,
      navItems: (DEFAULT_SITE_HEADER.navItems ?? []).map((item) => ({
        label: item.label,
        labelEn: item.labelEn ?? null,
        href: item.href,
        external: item.external ?? false,
      })),
    },
  });

  payload.logger.info("[seed] Upserting site-footer global");
  await payload.updateGlobal({
    slug: "site-footer",
    data: {
      copyrightText: DEFAULT_SITE_FOOTER.copyrightText,
      description: DEFAULT_SITE_FOOTER.description ?? null,
      contactEmail: DEFAULT_SITE_FOOTER.contactEmail ?? null,
      contactAddress: DEFAULT_SITE_FOOTER.contactAddress ?? null,
      legalNavItems: (DEFAULT_SITE_FOOTER.legalNavItems ?? []).map((item) => ({
        label: item.label,
        labelEn: item.labelEn ?? null,
        href: item.href,
      })),
      socialLinks: (DEFAULT_SITE_FOOTER.socialLinks ?? []).map((link) => ({
        platform: link.platform,
        href: link.href,
      })),
    },
  });

  payload.logger.info("[seed] Upserting contact-info global");
  await payload.updateGlobal({ slug: "contact-info", data: CONTACT_SEED });

  payload.logger.info("[seed] Upserting homepage-hero global");
  await payload.updateGlobal({ slug: "homepage-hero", data: HOMEPAGE_HERO_SEED });

  payload.logger.info("[seed] Upserting homepage-domaines global");
  await payload.updateGlobal({ slug: "homepage-domaines", data: HOMEPAGE_DOMAINES_SEED });

  payload.logger.info("[seed] Upserting empty-states global");
  await payload.updateGlobal({ slug: "empty-states", data: EMPTY_STATES_SEED });

  payload.logger.info("[seed] Upserting contact-page global");
  await payload.updateGlobal({ slug: "contact-page", data: CONTACT_PAGE_SEED });

  payload.logger.info("[seed] Upserting about-page global");
  await payload.updateGlobal({ slug: "about-page", data: ABOUT_PAGE_SEED });

  payload.logger.info("[seed] Upserting sectors-page global");
  await payload.updateGlobal({ slug: "sectors-page", data: SECTORS_PAGE_SEED });

  payload.logger.info("[seed] Upserting auth-strings global");
  await payload.updateGlobal({ slug: "auth-strings", data: AUTH_STRINGS_SEED });

  payload.logger.info("[seed] Upserting partners");
  for (const p of PARTNERS_SEED) {
    await upsertBySlug(payload, "partners", { ...p });
  }

  payload.logger.info("[seed] Upserting programmes");
  for (const p of PROGRAMMES_SEED) {
    await upsertBySlug(payload, "programmes", { ...p });
  }

  payload.logger.info("[seed] Upserting team members");
  for (const m of TEAM_SEED) {
    await upsertBySlug(payload, "team-members", { ...m });
  }

  payload.logger.info("[seed] Upserting news fixtures");
  for (const n of NEWS_SEED) {
    await upsertBySlug(payload, "news", { ...n });
  }

  payload.logger.info("[seed] Ensuring sample PDF media item");
  const samplePdfId = await ensureSamplePdf(payload);

  payload.logger.info("[seed] Upserting publication fixtures");
  for (const p of PUBLICATIONS_SEED) {
    await upsertBySlug(payload, "publications", { ...p, file: samplePdfId });
  }

  payload.logger.info("[seed] Upserting video fixtures");
  for (const v of VIDEOS_SEED) {
    await upsertBySlug(payload, "videos", { ...v });
  }

  payload.logger.info("[seed] Upserting opportunity fixtures");
  for (const o of OPPORTUNITIES_SEED) {
    await upsertBySlug(payload, "opportunities", { ...o });
  }

  payload.logger.info("[seed] Done.");
}

if (import.meta.url === `file://${fileURLToPath(import.meta.url)}`) {
  seed()
    .then(() => process.exit(0))
    .catch((err: unknown) => {
      console.error("[seed] failed:", err);
      process.exit(1);
    });
}
