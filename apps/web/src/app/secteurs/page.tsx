import type { Metadata } from "next";
import { SECTORS } from "@sen-react/shared";

import { SectorCard } from "@/components/sectors/SectorCard";

export const metadata: Metadata = {
  title: "Secteurs d'intervention — Sen React",
  description:
    "Les dix secteurs d'intervention de REACT au Sénégal et en Afrique de l'Ouest, du numérique à l'agroécologie.",
};

/**
 * /secteurs — index. Lists all 10 sectors per D012 in source order.
 *
 * Each card links to /secteurs/[slug] for the per-sector page. Per the
 * Phase 2 yellow row in the roadmap §3, the 10-route shell ships with
 * placeholder copy now; per-sector content (key actors, opportunities,
 * resources) backfills when Amadou's Q5 voicenotes arrive.
 */
export default function SectorsIndexPage() {
  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Secteurs d&apos;intervention
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Dix secteurs, une économie en transition.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            REACT structure ses programmes autour de dix secteurs prioritaires pour
            l&apos;entrepreneuriat sénégalais et africain — du numérique à l&apos;agroécologie en
            passant par la transformation et la saponification.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((sector) => (
              <li key={sector.slug}>
                <SectorCard slug={sector.slug} title={sector.fr} scope={sector.scopeFr} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
