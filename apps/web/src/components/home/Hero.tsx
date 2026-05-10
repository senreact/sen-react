import Link from "next/link";
import type { Route } from "next";

import { NavLink } from "../NavLink";
import { SiteLogo } from "../SiteLogo";
import { getHomepageHero } from "@/lib/cms";

/**
 * Homepage hero. Editorial copy comes from the Payload `homepage-hero`
 * global so REACT can refine the wording without a code change.
 *
 * No background photo at this stage (per pending-react-input.md, real
 * photography is a Phase 12+ asset request). The visual weight comes
 * from the typographic scale + the brand-green eyebrow + the secondary
 * orange accent bar under the logo lockup.
 */
export async function Hero() {
  const hero = await getHomepageHero();
  // Cast both CTAs through `Route` because the CMS returns arbitrary
  // strings; typedRoutes can't narrow runtime values. Same pattern as
  // SectorCard / NewsCard.
  const primaryHref = hero.primaryCta.href as unknown as Route;
  const secondaryHref = hero.secondaryCta.href as unknown as Route;

  return (
    <section className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-start gap-6 md:max-w-3xl">
          <SiteLogo height={64} />

          <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            {hero.eyebrow}
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{hero.headline}</h1>

          <p className="text-lg text-[color:var(--color-muted)] md:text-xl">{hero.leadParagraph}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={primaryHref}
              className="rounded-md bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              {hero.primaryCta.label}
            </Link>
            <NavLink
              href={secondaryHref}
              className="rounded-md border border-[color:var(--color-border)] px-5 py-3 text-sm font-semibold hover:border-[color:var(--color-accent)]"
            >
              {hero.secondaryCta.label}
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
