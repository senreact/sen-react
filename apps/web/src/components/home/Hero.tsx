import Link from "next/link";

import { NavLink } from "../NavLink";
import { SiteLogo } from "../SiteLogo";

/**
 * Homepage hero. Verbatim FR copy is the canonical voice agreed with
 * Amadou (decisions log §A1, 2026-05-04). Do not paraphrase without
 * sign-off — these strings are the brand.
 *
 * No background photo at this stage (per pending-react-input.md, real
 * photography is a Phase 12+ asset request). The visual weight comes
 * from the typographic scale + the brand-green eyebrow + the secondary
 * orange accent bar under the logo lockup.
 */
export function Hero() {
  return (
    <section className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-start gap-6 md:max-w-3xl">
          <SiteLogo height={64} />

          <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Réseau des Entrepreneurs Actifs
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Favoriser la transition digitale et écologique au profit du développement économique
            durable.
          </h1>

          <p className="text-lg text-[color:var(--color-muted)] md:text-xl">
            Sen React renforce les capacités d&apos;autonomisation et d&apos;innovation des
            entrepreneurs africains — femmes, jeunes et communautés vulnérables — afin de promouvoir
            un entrepreneuriat durable et compétitif, tout en luttant contre les effets du
            changement climatique.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/inscription"
              className="rounded-md bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Rejoindre la communauté
            </Link>
            {/* /a-propos doesn't exist as a typed route yet (Phase 2 §3 will
                ship it). Use NavLink so the dynamic-href cast doesn't break
                typedRoutes; the link will 404 gracefully until that slice
                lands. */}
            <NavLink
              href="/a-propos"
              className="rounded-md border border-[color:var(--color-border)] px-5 py-3 text-sm font-semibold hover:border-[color:var(--color-accent)]"
            >
              En savoir plus
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
