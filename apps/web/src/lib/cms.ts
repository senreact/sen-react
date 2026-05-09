import {
  DEFAULT_SITE_FOOTER,
  DEFAULT_SITE_HEADER,
  type SiteFooterGlobal,
  type SiteHeaderGlobal,
} from "@sen-react/shared";

/**
 * CMS global fetcher.
 *
 * apps/web reads `NEXT_PUBLIC_CMS_URL` to know where Payload is deployed.
 * If unset (Phase 1 reality — apps/cms isn't yet deployed), or if the
 * fetch fails, return the placeholder defaults from @sen-react/shared so
 * the page still renders. Once apps/cms is deployed and the env var is
 * set, real CMS content takes over with no code change.
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
