import type { Metadata } from "next";
import { SECTORS } from "@sen-react/shared";

import { SectorCard } from "@/components/sectors/SectorCard";
import { getSectorsPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Secteurs d'intervention — Sen React",
  description:
    "Les dix secteurs d'intervention de REACT au Sénégal et en Afrique de l'Ouest, du numérique à l'agroécologie.",
};

/**
 * /secteurs — index. Lists all 10 sectors per D012 in source order.
 *
 * The 10-sector taxonomy lives in `@sen-react/shared` (D012 fixed enum).
 * Editorial copy (eyebrow / headline / lead) comes from the
 * `sectors-page` CMS global so REACT can refine wording without a code
 * change.
 */
export default async function SectorsIndexPage() {
  const { index } = await getSectorsPage();
  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            {index.eyebrow}
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{index.headline}</h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            {index.leadParagraph}
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
