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
