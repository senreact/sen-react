import type { Metadata } from "next";
import Link from "next/link";

import { getSector } from "@sen-react/shared";

import { absoluteMediaUrl, listResources } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ressources — Sen React",
  description:
    "Fiches techniques, guides pratiques, modèles et checklists pour les entrepreneurs sénégalais — accès libre.",
};

const TYPE_LABEL: Record<string, string> = {
  guide: "Guide pratique",
  "fiche-technique": "Fiche technique",
  modele: "Modèle",
  checklist: "Checklist",
  rapport: "Rapport",
};

const TYPE_COLOUR: Record<string, string> = {
  guide: "bg-blue-50 text-blue-700",
  "fiche-technique": "bg-green-50 text-green-700",
  modele: "bg-purple-50 text-purple-700",
  checklist: "bg-orange-50 text-orange-700",
  rapport: "bg-gray-100 text-gray-700",
};

export default async function RessourcesPage() {
  const resources = await listResources(50);

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Outils & Ressources
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Fiches techniques et guides.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Guides pratiques, fiches techniques, modèles et checklists pour accompagner votre
            parcours entrepreneurial. Accès libre et gratuit.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {resources.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-muted)]">
            Les ressources arrivent bientôt. Revenez prochainement.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {resources.map((resource) => {
              const sector = resource.sector ? getSector(resource.sector) : null;
              const fileUrl =
                typeof resource.file === "object" && resource.file
                  ? absoluteMediaUrl(resource.file.url ?? null)
                  : null;
              return (
                <li
                  key={resource.id}
                  className="flex flex-col rounded-lg border border-[color:var(--color-border)] bg-white p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${TYPE_COLOUR[resource.resourceType] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {TYPE_LABEL[resource.resourceType] ?? resource.resourceType}
                    </span>
                    {sector ? (
                      <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-[color:var(--color-muted)]">
                        {sector.fr}
                      </span>
                    ) : null}
                    <time
                      className="text-[color:var(--color-muted)]"
                      dateTime={resource.publishedAt}
                    >
                      {formatDateFr(resource.publishedAt)}
                    </time>
                  </div>
                  <h3 className="mb-2 text-base font-semibold leading-snug">
                    <Link
                      href={`/ressources/${resource.slug}`}
                      className="hover:text-[color:var(--color-accent)] hover:underline"
                    >
                      {resource.title}
                    </Link>
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-[color:var(--color-muted)]">
                    {resource.summary}
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href={`/ressources/${resource.slug}`}
                      className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
                    >
                      Voir →
                    </Link>
                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
                      >
                        Télécharger PDF →
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
