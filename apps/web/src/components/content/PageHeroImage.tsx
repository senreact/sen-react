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
 * (the CMS host isn't in images.remotePatterns) with eager loading since
 * it's above the fold.
 */
export async function PageHeroImage({ pageKey }: PageHeroImageProps) {
  const hero = await getPageHero(pageKey);
  if (!hero) return null;
  return (
    <img
      src={hero.url}
      alt={hero.alt}
      className="h-48 w-full object-cover sm:h-64 lg:h-80"
    />
  );
}
