import type { Metadata } from "next";

import { EmptyState } from "@/components/content/EmptyState";
import { NewsCard } from "@/components/content/NewsCard";
import { listNews } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Actualités — Sen React",
  description:
    "Articles et actualités publiés par REACT — entrepreneuriat, transition numérique et écologique au Sénégal et en Afrique de l'Ouest.",
};

/**
 * /actualites — News index. Reads the published News collection from
 * apps/cms; falls back to the empty state when the CMS isn't deployed
 * (Phase 1/2 reality) or hasn't been populated yet.
 *
 * Per-article reader (`/actualites/[slug]`) and pagination ship later
 * in Phase 3. Today's surface is a vertical scroll of 50 most recent.
 */
export default async function ActualitesPage() {
  const articles = await listNews();

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Actualités
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Le quotidien de l&apos;entrepreneuriat sénégalais et africain.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Articles rédigés par REACT et opportunités agrégées depuis les sources publiques —
            classés par secteur d&apos;intervention.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          {articles.length === 0 ? (
            <EmptyState
              title="Les premières actualités arrivent bientôt."
              description="Cette section accueillera les articles, opportunités et publications éditées par REACT dès que la rédaction démarre."
            />
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
