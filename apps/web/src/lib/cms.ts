import {
  DEFAULT_SITE_FOOTER,
  DEFAULT_SITE_HEADER,
  type SectorSlug,
  type SiteFooterGlobal,
  type SiteHeaderGlobal,
} from "@sen-react/shared";

/**
 * CMS fetcher.
 *
 * apps/web reads `NEXT_PUBLIC_CMS_URL` to know where Payload is deployed.
 * If unset (Phase 1 reality — apps/cms isn't yet deployed), or if the
 * fetch fails, return placeholder defaults (for globals) or an empty list
 * (for collections) so the page still renders. Once apps/cms is deployed
 * and the env var is set, real CMS content takes over with no code change.
 *
 * Fetch is cached at the Next.js data-cache layer with a 5-minute revalidate
 * window — long enough that editor changes propagate quickly, short enough
 * that we don't hammer the CMS on every request.
 */

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, "");
const REVALIDATE_SECONDS = 300;

async function fetchGlobal<T>(slug: string): Promise<T | null> {
  if (!CMS_URL) return null;
  try {
    const response = await fetch(`${CMS_URL}/api/globals/${slug}?depth=1`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [`cms:${slug}`] },
    });
    if (!response.ok) {
      console.warn(`[cms] ${slug} returned HTTP ${response.status}; falling back to defaults`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[cms] ${slug} fetch threw; falling back to defaults`, error);
    return null;
  }
}

export async function getSiteHeader(): Promise<SiteHeaderGlobal> {
  const live = await fetchGlobal<SiteHeaderGlobal>("site-header");
  return live ?? DEFAULT_SITE_HEADER;
}

export async function getSiteFooter(): Promise<SiteFooterGlobal> {
  const live = await fetchGlobal<SiteFooterGlobal>("site-footer");
  return live ?? DEFAULT_SITE_FOOTER;
}

/**
 * Collection list fetcher. Returns empty array on miss/fail so callers
 * can render the empty state without try/catch noise. Sort/limit are
 * passed straight through to Payload's REST query API.
 */
async function fetchCollection<T>(
  slug: string,
  params: { sort?: string; limit?: number; depth?: number } = {},
): Promise<T[]> {
  if (!CMS_URL) return [];
  const url = new URL(`${CMS_URL}/api/${slug}`);
  if (params.sort) url.searchParams.set("sort", params.sort);
  url.searchParams.set("limit", String(params.limit ?? 50));
  url.searchParams.set("depth", String(params.depth ?? 1));
  url.searchParams.set("where[_status][equals]", "published");
  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SECONDS, tags: [`cms:${slug}`] },
    });
    if (!response.ok) {
      console.warn(`[cms] ${slug} returned HTTP ${response.status}; rendering empty list`);
      return [];
    }
    const json = (await response.json()) as { docs?: T[] };
    return json.docs ?? [];
  } catch (error) {
    console.warn(`[cms] ${slug} fetch threw; rendering empty list`, error);
    return [];
  }
}

/**
 * Single-item fetcher. Hits the collection's `where[slug][equals]=...`
 * REST query and returns the first match, or null if the CMS is unset /
 * unreachable / the slug doesn't exist. Callers map null → notFound().
 */
async function fetchBySlug<T>(slug: string, itemSlug: string, depth = 2): Promise<T | null> {
  if (!CMS_URL) return null;
  const url = new URL(`${CMS_URL}/api/${slug}`);
  url.searchParams.set("where[slug][equals]", itemSlug);
  url.searchParams.set("where[_status][equals]", "published");
  url.searchParams.set("depth", String(depth));
  url.searchParams.set("limit", "1");
  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SECONDS, tags: [`cms:${slug}`, `cms:${slug}:${itemSlug}`] },
    });
    if (!response.ok) {
      console.warn(`[cms] ${slug}/${itemSlug} returned HTTP ${response.status}`);
      return null;
    }
    const json = (await response.json()) as { docs?: T[] };
    return json.docs?.[0] ?? null;
  } catch (error) {
    console.warn(`[cms] ${slug}/${itemSlug} fetch threw`, error);
    return null;
  }
}

/**
 * Lexical rich-text shape — Payload's lexical editor stores body content
 * as a serialised tree of nodes. We don't depend on @payloadcms/richtext-lexical
 * at runtime (it's heavy); the per-item reader walks this shape with a
 * minimal renderer in `LexicalRichText`.
 */
export interface LexicalNode {
  type: string;
  tag?: string;
  version?: number;
  format?: number | string;
  text?: string;
  url?: string;
  fields?: { url?: string; newTab?: boolean; linkType?: string };
  listType?: "number" | "bullet" | "check";
  children?: LexicalNode[];
}

export interface LexicalRoot {
  root: LexicalNode;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  sector: SectorSlug;
  writePath: "react-original" | "aggregated";
  sourceUrl?: string | null;
  publishedAt: string;
  body?: LexicalRoot | null;
  coverImage?: { url?: string; alt?: string } | string | null;
}

export async function listNews(limit = 50): Promise<NewsArticle[]> {
  return fetchCollection<NewsArticle>("news", { sort: "-publishedAt", limit });
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  return fetchBySlug<NewsArticle>("news", slug);
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  summary: string;
  sector?: SectorSlug | null;
  authors?: { name: string; role?: string }[];
  publishedAt: string;
  language: "fr" | "en" | "wo";
  file?: { url?: string; filename?: string; filesize?: number } | string | null;
  coverImage?: { url?: string; alt?: string } | string | null;
}

export async function listPublications(limit = 50): Promise<Publication[]> {
  return fetchCollection<Publication>("publications", { sort: "-publishedAt", limit });
}

export async function getPublicationBySlug(slug: string): Promise<Publication | null> {
  return fetchBySlug<Publication>("publications", slug);
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  summary: string;
  youtubeId: string;
  videoType: "capsule" | "explanation" | "interview" | "vlog" | "testimonial";
  origin: "react-original" | "curated";
  sector?: SectorSlug | null;
  duration?: number | null;
  publishedAt: string;
  downloadUrl?: string | null;
  subtitlesFr?: { url?: string; filename?: string } | string | null;
  subtitlesWo?: { url?: string; filename?: string } | string | null;
}

export async function listVideos(limit = 50): Promise<Video[]> {
  return fetchCollection<Video>("videos", { sort: "-publishedAt", limit });
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  return fetchBySlug<Video>("videos", slug);
}

export interface Partner {
  id: string;
  slug: string;
  name: string;
  kind: "institution" | "ngo";
  description: string;
  order: number;
  logo?: { url?: string; alt?: string } | string | null;
}

export async function listPartners(): Promise<Partner[]> {
  return fetchCollection<Partner>("partners", { sort: "order", limit: 50 });
}

export interface Programme {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  variant: "headline" | "active";
  order: number;
}

export async function listProgrammes(): Promise<Programme[]> {
  return fetchCollection<Programme>("programmes", { sort: "order", limit: 20 });
}

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  order: number;
  photo?: { url?: string; alt?: string } | string | null;
}

export async function listTeamMembers(): Promise<TeamMember[]> {
  return fetchCollection<TeamMember>("team-members", { sort: "order", limit: 20 });
}

export interface ContactInfo {
  email: string;
  phoneE164: string;
  phoneDisplay: string;
  addressLines: { line: string }[];
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  email: "senreactsen@gmail.com",
  phoneE164: "+221773213955",
  phoneDisplay: "+221 77 321 39 55",
  addressLines: [{ line: "Sacrée Coeur 3, Lot N° 128/B" }, { line: "Dakar, Sénégal" }],
};

export async function getContactInfo(): Promise<ContactInfo> {
  const live = await fetchGlobal<ContactInfo>("contact-info");
  return live ?? DEFAULT_CONTACT_INFO;
}

export interface HomepageHero {
  eyebrow: string;
  headline: string;
  leadParagraph: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const DEFAULT_HOMEPAGE_HERO: HomepageHero = {
  eyebrow: "Réseau des Entrepreneurs Actifs",
  headline:
    "Favoriser la transition digitale et écologique au profit du développement économique durable.",
  leadParagraph:
    "Sen React renforce les capacités d'autonomisation et d'innovation des entrepreneurs africains — femmes, jeunes et communautés vulnérables — afin de promouvoir un entrepreneuriat durable et compétitif, tout en luttant contre les effets du changement climatique.",
  primaryCta: { label: "Rejoindre la communauté", href: "/inscription" },
  secondaryCta: { label: "En savoir plus", href: "/a-propos" },
};

export async function getHomepageHero(): Promise<HomepageHero> {
  const live = await fetchGlobal<HomepageHero>("homepage-hero");
  return live ?? DEFAULT_HOMEPAGE_HERO;
}

export interface HomepageDomaines {
  eyebrow: string;
  headline: string;
  pillars: { title: string; description: string }[];
}

const DEFAULT_HOMEPAGE_DOMAINES: HomepageDomaines = {
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

export async function getHomepageDomaines(): Promise<HomepageDomaines> {
  const live = await fetchGlobal<HomepageDomaines>("homepage-domaines");
  return live ?? DEFAULT_HOMEPAGE_DOMAINES;
}

export interface EmptyStateContent {
  title: string;
  description: string;
}

export interface LatestNewsPlaceholderCard {
  eyebrow: string;
  title: string;
  excerpt: string;
}

export interface EmptyStates {
  news: EmptyStateContent;
  publications: EmptyStateContent;
  videos: EmptyStateContent;
  homepageLatestNewsFallback: LatestNewsPlaceholderCard[];
}

const DEFAULT_EMPTY_STATES: EmptyStates = {
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

export async function getEmptyStates(): Promise<EmptyStates> {
  const live = await fetchGlobal<EmptyStates>("empty-states");
  return live ?? DEFAULT_EMPTY_STATES;
}

export interface ContactPage {
  eyebrow: string;
  headline: string;
  leadParagraph: string;
  channelHints: { whatsapp: string; email: string; phone: string };
  channelGuideHeading: string;
  channelGuide: { channel: string; guidance: string }[];
}

const DEFAULT_CONTACT_PAGE: ContactPage = {
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

export async function getContactPage(): Promise<ContactPage> {
  const live = await fetchGlobal<ContactPage>("contact-page");
  return live ?? DEFAULT_CONTACT_PAGE;
}

export interface AboutPage {
  hero: { eyebrow: string; headline: string; leadParagraph: string };
  mission: { eyebrow: string; sectionTitle: string; body: string };
  vision: { eyebrow: string; sectionTitle: string; body: string };
  values: {
    eyebrow: string;
    headline: string;
    items: { title: string; description: string }[];
  };
  founding: { eyebrow: string; headline: string; body: LexicalRoot };
  legal: { label: string; body: LexicalRoot };
}

const DEFAULT_ABOUT_PAGE: AboutPage = {
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
    body: { root: { type: "root", children: [] } },
  },
  legal: {
    label: "Statut juridique",
    body: { root: { type: "root", children: [] } },
  },
};

export async function getAboutPage(): Promise<AboutPage> {
  const live = await fetchGlobal<AboutPage>("about-page");
  return live ?? DEFAULT_ABOUT_PAGE;
}

export interface SectorsPage {
  index: { eyebrow: string; headline: string; leadParagraph: string };
  detail: {
    backLinkLabel: string;
    eyebrow: string;
    placeholderHeader: { eyebrow: string; headline: string; description: string };
    placeholderBlocks: { title: string; description: string }[];
  };
}

const DEFAULT_SECTORS_PAGE: SectorsPage = {
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

export async function getSectorsPage(): Promise<SectorsPage> {
  const live = await fetchGlobal<SectorsPage>("sectors-page");
  return live ?? DEFAULT_SECTORS_PAGE;
}

export interface AuthStrings {
  signin: {
    pageTitle: string;
    leadParagraph: string;
    submitLabel: string;
    signupPrompt: string;
    signupLink: string;
  };
  signup: {
    pageTitle: string;
    leadParagraph: string;
    submitLabel: string;
    passwordHint: string;
    signinPrompt: string;
    signinLink: string;
  };
  form: { emailLabel: string; passwordLabel: string; pendingLabel: string };
  errors: {
    signinFailed: string;
    signupFailed: string;
    signupSuccess: string;
    validationFailed: string;
  };
}

const DEFAULT_AUTH_STRINGS: AuthStrings = {
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

export async function getAuthStrings(): Promise<AuthStrings> {
  const live = await fetchGlobal<AuthStrings>("auth-strings");
  return live ?? DEFAULT_AUTH_STRINGS;
}
