import { type SectorSlug, type SiteFooterGlobal, type SiteHeaderGlobal } from "@sen-react/shared";

/**
 * CMS fetcher.
 *
 * All globals are required — if the CMS is unreachable or a global has not
 * been seeded, the fetch throws so the error surfaces immediately rather
 * than silently serving stale hardcoded data. The CMS is the only source
 * of truth; there are no runtime fallbacks.
 *
 * Fetch is cached at the Next.js data-cache layer with a 5-minute revalidate
 * window — long enough that editor changes propagate quickly, short enough
 * that we don't hammer the CMS on every request.
 */

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, "");
const REVALIDATE_SECONDS = 300;

/**
 * Payload returns media URLs as paths relative to the CMS host
 * (`/api/media/file/foo.pdf`). The web app is served from a different
 * origin, so relative URLs resolve to the web host and 404. Prepend the
 * CMS base URL when the value starts with `/`. Pass-through for already-
 * absolute URLs (Payload may return signed S3 URLs in the future).
 */
export function absoluteMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (!CMS_URL) return url;
  return `${CMS_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function fetchGlobal<T>(slug: string): Promise<T | null> {
  if (!CMS_URL) return null;
  try {
    const response = await fetch(`${CMS_URL}/api/globals/${slug}?depth=1`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [`cms:${slug}`] },
    });
    if (!response.ok) {
      console.error(`[cms] ${slug} returned HTTP ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`[cms] ${slug} fetch threw`, error);
    return null;
  }
}

function requireGlobal<T>(slug: string, data: T | null): T {
  if (data === null) {
    throw new Error(
      `[cms] global "${slug}" is unavailable — verify NEXT_PUBLIC_CMS_URL is set and the "${slug}" global is seeded in Payload.`,
    );
  }
  return data;
}

export async function getSiteHeader(): Promise<SiteHeaderGlobal> {
  return requireGlobal("site-header", await fetchGlobal<SiteHeaderGlobal>("site-header"));
}

export async function getSiteFooter(): Promise<SiteFooterGlobal> {
  return requireGlobal("site-footer", await fetchGlobal<SiteFooterGlobal>("site-footer"));
}

/** Page keys with an editable hero banner — mirror PAGE_HERO_SLOTS in the CMS. */
export type PageHeroKey =
  | "accueil"
  | "secteurs"
  | "opportunites"
  | "annuaire"
  | "actualites"
  | "publications"
  | "evenements"
  | "ressources"
  | "formations"
  | "partenaires"
  | "videos";

type PageHeroesGlobal = Record<
  string,
  { url?: string; alt?: string } | string | number | null | undefined
>;

/**
 * Fetch the optional hero banner for a given page from the `page-heroes`
 * global. Returns null when unset/unreachable so the banner simply doesn't
 * render (no layout shift, no hard failure — heroes are decorative).
 */
export async function getPageHero(key: PageHeroKey): Promise<{ url: string; alt: string } | null> {
  const data = await fetchGlobal<PageHeroesGlobal>("page-heroes");
  if (!data) return null;
  const value = data[key];
  if (!value || typeof value !== "object") return null;
  const url = absoluteMediaUrl(value.url);
  if (!url) return null;
  return { url, alt: value.alt ?? "" };
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
/** Populated media value as returned by Payload at depth >= 1. */
export interface LexicalUploadValue {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
}

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
  // Upload (inline image) nodes: `relationTo` is the collection, `value` is
  // the populated media doc (depth >= 1) or its id (depth 0).
  relationTo?: string;
  value?: LexicalUploadValue | string | number | null;
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
  commentsEnabled?: boolean | null;
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
  body?: LexicalRoot | null;
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

export type OpportunityType =
  | "financement"
  | "formation"
  | "appel-a-projets"
  | "partenariat"
  | "concours"
  | "autre";

export type OpportunityArea =
  | "senegal"
  | "senegal-dakar"
  | "senegal-regions"
  | "afrique-ouest"
  | "afrique"
  | "international";

export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body?: LexicalRoot | null;
  sector: SectorSlug;
  opportunityType: OpportunityType;
  area: OpportunityArea;
  // Null when the opportunity accepts rolling (continuous) applications.
  deadline: string | null;
  rolling: boolean;
  amountValue?: number | null;
  amountCurrency?: "XOF" | "EUR" | "USD" | null;
  amountDisplay?: string | null;
  source: string;
  sourceUrl?: string | null;
  contactEmail?: string | null;
  publishedAt: string;
  reactCurated: boolean;
}

/**
 * Filter contract for listOpportunities. All fields optional. The fetcher
 * adds Payload `where[…]` query params per filter, which Payload's REST
 * API translates to SQL.
 *
 * `deadlineWithinDays` filters to opportunities whose deadline is in the
 * next N days from now (inclusive of today). `amountMin` is XOF.
 * `q` is free-text — Payload's `like` operator across title + summary.
 */
export interface OpportunityFilters {
  sector?: SectorSlug;
  opportunityType?: OpportunityType;
  area?: OpportunityArea;
  deadlineWithinDays?: number;
  amountMin?: number;
  q?: string;
  limit?: number;
}

export async function listOpportunities(filters: OpportunityFilters = {}): Promise<Opportunity[]> {
  if (!CMS_URL) return [];
  const url = new URL(`${CMS_URL}/api/opportunities`);
  // Nulls (rolling opportunities) sort last under ASC, so dated/urgent
  // entries surface first and ongoing ones follow.
  url.searchParams.set("sort", "deadline");
  url.searchParams.set("limit", String(filters.limit ?? 50));
  url.searchParams.set("depth", "0");

  // Build an explicit AND list so the deadline constraints can be OR-ed with
  // `rolling`: a rolling opportunity is always open, so it must never be
  // excluded as "past" and must pass any date-range filter.
  const now = new Date().toISOString();
  let n = 0;
  const clause = () => `where[and][${n++}]`;

  url.searchParams.set(`${clause()}[_status][equals]`, "published");

  // Visibility: rolling OR a non-past deadline.
  {
    const p = clause();
    url.searchParams.set(`${p}[or][0][rolling][equals]`, "true");
    url.searchParams.set(`${p}[or][1][deadline][greater_than_equal]`, now);
  }

  if (filters.sector) {
    url.searchParams.set(`${clause()}[sector][equals]`, filters.sector);
  }
  if (filters.opportunityType) {
    url.searchParams.set(`${clause()}[opportunityType][equals]`, filters.opportunityType);
  }
  if (filters.area) {
    url.searchParams.set(`${clause()}[area][equals]`, filters.area);
  }
  if (filters.deadlineWithinDays !== undefined) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + filters.deadlineWithinDays);
    // Rolling opportunities always pass a date-range filter.
    const p = clause();
    url.searchParams.set(`${p}[or][0][rolling][equals]`, "true");
    url.searchParams.set(`${p}[or][1][deadline][less_than_equal]`, cutoff.toISOString());
  }
  if (filters.amountMin !== undefined) {
    url.searchParams.set(`${clause()}[amountValue][greater_than_equal]`, String(filters.amountMin));
  }
  if (filters.q) {
    // Payload's `like` is case-insensitive ILIKE on Postgres.
    url.searchParams.set(`${clause()}[title][like]`, filters.q);
  }

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["cms:opportunities"] },
    });
    if (!response.ok) {
      console.warn(`[cms] opportunities returned HTTP ${response.status}; rendering empty list`);
      return [];
    }
    const json = (await response.json()) as { docs?: Opportunity[] };
    return json.docs ?? [];
  } catch (error) {
    console.warn("[cms] opportunities fetch threw; rendering empty list", error);
    return [];
  }
}

export async function getOpportunityBySlug(slug: string): Promise<Opportunity | null> {
  return fetchBySlug<Opportunity>("opportunities", slug);
}

/**
 * Bulk fetch opportunities by slug — used by /mes-opportunites to
 * resolve the user's saved-slug set into renderable cards in one
 * round-trip. Past-deadline entries ARE included here (intentionally —
 * a member's saved list shows everything they saved, even if some
 * have closed since).
 *
 * Returns in the same order as the input `slugs` array; missing slugs
 * (deleted, unpublished) are filtered out.
 */
export async function listOpportunitiesBySlugs(slugs: string[]): Promise<Opportunity[]> {
  if (!CMS_URL || slugs.length === 0) return [];
  const url = new URL(`${CMS_URL}/api/opportunities`);
  url.searchParams.set("limit", String(Math.max(slugs.length, 50)));
  url.searchParams.set("depth", "0");
  url.searchParams.set("where[_status][equals]", "published");
  // Payload supports `where[slug][in][N]=...` for IN-list filters.
  slugs.forEach((s, i) => {
    url.searchParams.set(`where[slug][in][${i}]`, s);
  });
  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["cms:opportunities"] },
    });
    if (!response.ok) return [];
    const json = (await response.json()) as { docs?: Opportunity[] };
    const docs = json.docs ?? [];
    const bySlug = new Map(docs.map((d) => [d.slug, d]));
    return slugs.map((s) => bySlug.get(s)).filter((d): d is Opportunity => Boolean(d));
  } catch (error) {
    console.warn("[cms] opportunities-by-slugs fetch threw", error);
    return [];
  }
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

export async function getContactInfo(): Promise<ContactInfo> {
  return requireGlobal("contact-info", await fetchGlobal<ContactInfo>("contact-info"));
}

export interface HomepageHero {
  eyebrow: string;
  headline: string;
  leadParagraph: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export async function getHomepageHero(): Promise<HomepageHero> {
  return requireGlobal("homepage-hero", await fetchGlobal<HomepageHero>("homepage-hero"));
}

export interface HomepageDomaines {
  eyebrow: string;
  headline: string;
  pillars: { title: string; description: string }[];
}

export async function getHomepageDomaines(): Promise<HomepageDomaines> {
  return requireGlobal(
    "homepage-domaines",
    await fetchGlobal<HomepageDomaines>("homepage-domaines"),
  );
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
  opportunities: EmptyStateContent;
  opportunitiesNoMatch: EmptyStateContent;
  homepageLatestNewsFallback: LatestNewsPlaceholderCard[];
}

export async function getEmptyStates(): Promise<EmptyStates> {
  return requireGlobal("empty-states", await fetchGlobal<EmptyStates>("empty-states"));
}

export interface ContactPage {
  eyebrow: string;
  headline: string;
  leadParagraph: string;
  channelHints: { whatsapp: string; email: string; phone: string };
  channelGuideHeading: string;
  channelGuide: { channel: string; guidance: string }[];
}

export async function getContactPage(): Promise<ContactPage> {
  return requireGlobal("contact-page", await fetchGlobal<ContactPage>("contact-page"));
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

export async function getAboutPage(): Promise<AboutPage> {
  return requireGlobal("about-page", await fetchGlobal<AboutPage>("about-page"));
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

export async function getSectorsPage(): Promise<SectorsPage> {
  return requireGlobal("sectors-page", await fetchGlobal<SectorsPage>("sectors-page"));
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

export async function getAuthStrings(): Promise<AuthStrings> {
  return requireGlobal("auth-strings", await fetchGlobal<AuthStrings>("auth-strings"));
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  body?: LexicalRoot | null;
  startsAt: string;
  endsAt?: string | null;
  location?: string | null;
  eventType: "in-person" | "online" | "webinar";
  sector?: SectorSlug | null;
  registrationUrl?: string | null;
  image?: { url?: string; alt?: string } | string | null;
}

export async function listEvents(
  options: { upcoming?: boolean; limit?: number } = {},
): Promise<Event[]> {
  const { upcoming = false, limit = 50 } = options;
  if (!CMS_URL) return [];
  const url = new URL(`${CMS_URL}/api/events`);
  url.searchParams.set("sort", "startsAt");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("depth", "1");
  if (upcoming) {
    url.searchParams.set("where[startsAt][greater_than_equal]", new Date().toISOString());
  }
  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["cms:events"] },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { docs?: Event[] };
    return json.docs ?? [];
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return fetchBySlug<Event>("events", slug);
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  category: "general" | "urgent" | "platform-update" | "partnership";
  body: LexicalRoot;
  publishedAt: string;
}

export async function listAnnouncements(limit = 50): Promise<Announcement[]> {
  return fetchCollection<Announcement>("announcements", { sort: "-publishedAt", limit });
}

export async function getAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  return fetchBySlug<Announcement>("announcements", slug);
}

export interface Training {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  body?: LexicalRoot | null;
  trainingType: "tutorial" | "webinar" | "workshop" | "online-course";
  level?: "debutant" | "intermediaire" | "avance" | null;
  format?: "online" | "in-person" | "hybrid" | null;
  topic?: string | null;
  sector?: SectorSlug | null;
  startsAt?: string | null;
  endsAt?: string | null;
  location?: string | null;
  registrationUrl?: string | null;
  videoUrl?: string | null;
  image?: { url?: string; alt?: string } | string | null;
}

export async function listTrainings(limit = 50): Promise<Training[]> {
  return fetchCollection<Training>("trainings", { sort: "-createdAt", limit });
}

export async function getTrainingBySlug(slug: string): Promise<Training | null> {
  return fetchBySlug<Training>("trainings", slug);
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body?: LexicalRoot | null;
  resourceType: "guide" | "fiche-technique" | "modele" | "checklist" | "rapport";
  sector?: SectorSlug | null;
  file?: { url?: string; filename?: string } | string | null;
  coverImage?: { url?: string; alt?: string } | string | null;
  publishedAt: string;
}

export async function listResources(limit = 50): Promise<Resource[]> {
  return fetchCollection<Resource>("resources", { sort: "-publishedAt", limit });
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  return fetchBySlug<Resource>("resources", slug);
}

export interface FormalisationStep {
  id: string;
  stepNumber: number;
  title: string;
  slug: string;
  summary: string;
  body?: LexicalRoot | null;
  agencyName?: string | null;
  externalUrl?: string | null;
  externalLabel?: string | null;
  estimatedDuration?: string | null;
  estimatedCost?: string | null;
  requiredDocuments?: Array<{ id?: string; document: string }> | null;
}

export async function listFormalisationSteps(): Promise<FormalisationStep[]> {
  return fetchCollection<FormalisationStep>("formalisation-steps", {
    sort: "stepNumber",
    limit: 20,
  });
}

export async function getFormalisationStepBySlug(slug: string): Promise<FormalisationStep | null> {
  return fetchBySlug<FormalisationStep>("formalisation-steps", slug);
}
