import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SECTORS, getSector } from "@sen-react/shared";

import { getSectorsPage } from "@/lib/cms";

interface SectorPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * /secteurs/[slug] — one route per D012 sector, statically generated
 * via generateStaticParams over SECTORS. Per the roadmap §3 yellow
 * row, the template ships with three placeholder content blocks now
 * (Acteurs clés / Opportunités / Ressources) — Amadou's Q5 voicenote
 * will fill them per sector.
 *
 * Sector taxonomy (slug, fr, scopeFr) lives in `@sen-react/shared`
 * (D012 fixed enum). Page-level editorial copy comes from the
 * `sectors-page` CMS global. Per-sector custom content lands as a
 * separate `sector-content` collection later.
 */

export function generateStaticParams(): { slug: string }[] {
  return SECTORS.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) {
    return { title: "Secteur introuvable — Sen React" };
  }
  return {
    title: `${sector.fr} — Sen React`,
    description: sector.scopeFr,
  };
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  const { detail } = await getSectorsPage();

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <Link
            href="/secteurs"
            className="mb-4 inline-block text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
          >
            {detail.backLinkLabel}
          </Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            {detail.eyebrow}
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{sector.fr}</h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">{sector.scopeFr}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <header className="mb-10 max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              {detail.placeholderHeader.eyebrow}
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              {detail.placeholderHeader.headline}
            </h2>
            <p className="mt-3 text-sm text-[color:var(--color-muted)]">
              {detail.placeholderHeader.description}
            </p>
          </header>

          <ul className="grid gap-6 md:grid-cols-3">
            {detail.placeholderBlocks.map((block) => (
              <li
                key={block.title}
                className="rounded-lg border border-dashed border-[color:var(--color-border)] p-6"
              >
                <h3 className="mb-2 text-lg font-semibold">{block.title}</h3>
                <p className="text-sm text-[color:var(--color-muted)]">{block.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
