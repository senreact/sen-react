import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SECTORS, getSector } from "@sen-react/shared";

interface SectorPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * /secteurs/[slug] — one route per D012 sector, statically generated
 * via generateStaticParams over SECTORS. Per the roadmap §3 yellow
 * row, the template ships with three placeholder content blocks now
 * (Acteurs clés / Opportunités / Ressources) — Amadou's Q5 voicenote
 * will fill them per sector.
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

  const placeholderBlocks = [
    {
      title: "Acteurs clés",
      description:
        "Les institutions, ONG et entreprises pivots du secteur seront listées ici à mesure que la cartographie REACT est consolidée.",
    },
    {
      title: "Opportunités",
      description:
        "Les programmes, financements et appels à projets en cours dans le secteur. Cette section se peuplera automatiquement via la chaîne d'agrégation à partir de la phase 5.",
    },
    {
      title: "Ressources",
      description:
        "Tutoriels REACT, fiches techniques, vidéos et publications spécifiques au secteur. Contenu produit à partir de la phase 9 (renforcement de capacités).",
    },
  ];

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <Link
            href="/secteurs"
            className="mb-4 inline-block text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
          >
            ← Tous les secteurs
          </Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Secteur d&apos;intervention
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{sector.fr}</h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">{sector.scopeFr}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <header className="mb-10 max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              À venir
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              Le détail du secteur arrive avec les voicenotes d&apos;Amadou.
            </h2>
            <p className="mt-3 text-sm text-[color:var(--color-muted)]">
              Les blocs ci-dessous prendront forme au fur et à mesure que REACT consolide sa
              cartographie sectorielle.
            </p>
          </header>

          <ul className="grid gap-6 md:grid-cols-3">
            {placeholderBlocks.map((block) => (
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
