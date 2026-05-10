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

async function upsertBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: "partners" | "programmes" | "team-members",
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
