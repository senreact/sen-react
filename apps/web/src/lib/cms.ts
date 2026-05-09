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

/**
 * Globals fall back to defaults at two levels:
 *
 * 1. Network miss / unreachable CMS → use DEFAULT_* whole-cloth.
 * 2. CMS reachable but field is empty/missing → merge: keep what the
 *    CMS provided, fill the gaps from DEFAULT_*. This catches the
 *    "freshly-seeded global with only the title set" case so nav links
 *    don't disappear the moment the CMS is wired up.
 *
 * Editors who explicitly want a field empty should publish an empty
 * array (`navItems: []`), which is preserved as-is. Only `null`/`undefined`
 * trigger the default merge.
 */
function mergeWithDefault<T extends object>(live: T | null, fallback: T): T {
  if (!live) return fallback;
  const merged = { ...fallback };
  for (const key of Object.keys(live) as (keyof T)[]) {
    const value = live[key];
    if (value !== undefined && value !== null) {
      merged[key] = value;
    }
  }
  return merged;
}

export async function getSiteHeader(): Promise<SiteHeaderGlobal> {
  const live = await fetchGlobal<SiteHeaderGlobal>("site-header");
  return mergeWithDefault(live, DEFAULT_SITE_HEADER);
}

export async function getSiteFooter(): Promise<SiteFooterGlobal> {
  const live = await fetchGlobal<SiteFooterGlobal>("site-footer");
  return mergeWithDefault(live, DEFAULT_SITE_FOOTER);
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
