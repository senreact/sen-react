import type { Metadata } from "next";

import { EmptyState } from "@/components/content/EmptyState";
import { PublicationCard } from "@/components/content/PublicationCard";
import { getEmptyStates, listPublications } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Publications — Sen React",
  description:
    "Études, notes de réflexion et rapports publiés par REACT en accès libre. Téléchargement direct, sans inscription.",
};

/**
 * /publications — Publications index. Per D020 fully open-access; no
 * gating. Each card surfaces the download CTA directly so visitors don't
 * need an account to read REACT's research.
 */
export default async function PublicationsPage() {
  const [publications, emptyStates] = await Promise.all([listPublications(), getEmptyStates()]);

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Publications
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Études, notes et rapports en accès libre.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Les publications REACT — études thématiques, analyses sectorielles et notes de réflexion
            — sont disponibles en téléchargement direct, sans inscription.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          {publications.length === 0 ? (
            <EmptyState
              title={emptyStates.publications.title}
              description={emptyStates.publications.description}
            />
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publications.map((publication) => (
                <PublicationCard key={publication.id} publication={publication} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
