import { getPageHero, type PageHeroKey } from "@/lib/cms";

interface PageHeroImageProps {
  pageKey: PageHeroKey;
}

/**
 * Optional, CMS-managed hero banner shown at the top of a main page.
 *
 * Renders nothing when no image is set for the page (the `page-heroes`
 * global slot is empty), so it's safe to drop in at the top of any page's
 * <main> — pages without a configured banner are unchanged. Plain <img>
 * (the CMS host isn't in images.remotePatterns).
 *
 * `w-full h-auto` shows the COMPLETE banner at its natural aspect ratio —
 * full-bleed width, height follows the image — so nothing is cropped. (The
 * previous fixed-height `object-cover` cut the top/bottom off wide banners.)
 */
export async function PageHeroImage({ pageKey }: PageHeroImageProps) {
  const hero = await getPageHero(pageKey);
  if (!hero) return null;
  return <img src={hero.url} alt={hero.alt} className="block h-auto w-full" />;
}
