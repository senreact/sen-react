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

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  sector: SectorSlug;
  writePath: "react-original" | "aggregated";
  sourceUrl?: string | null;
  publishedAt: string;
  coverImage?: { url?: string; alt?: string } | string | null;
}

export async function listNews(limit = 50): Promise<NewsArticle[]> {
  return fetchCollection<NewsArticle>("news", { sort: "-publishedAt", limit });
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
}

export async function listVideos(limit = 50): Promise<Video[]> {
  return fetchCollection<Video>("videos", { sort: "-publishedAt", limit });
}
