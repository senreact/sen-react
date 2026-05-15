import type { Metadata } from "next";
import Link from "next/link";

import { listResources, listTrainings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Renforcement des capacités — Sen React",
  description:
    "Formations, fiches techniques, guides et outils pour renforcer les capacités des entrepreneurs sénégalais. Accès gratuit.",
};

const TRAINING_TYPE_LABEL: Record<string, string> = {
  tutorial: "Tutoriel",
  webinar: "Webinaire",
  workshop: "Atelier",
  "online-course": "Cours en ligne",
};

const RESOURCE_TYPE_LABEL: Record<string, string> = {
  guide: "Guide",
  "fiche-technique": "Fiche technique",
  modele: "Modèle",
  checklist: "Checklist",
  rapport: "Rapport",
};

export default async function RenforcementPage() {
  const [trainings, resources] = await Promise.all([listTrainings(3), listResources(4)]);

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Renforcement des capacités
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Apprenez. Progressez. Réussissez.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            REACT met à votre disposition des formations, fiches pratiques et outils pour renforcer
            vos compétences entrepreneuriales. Toujours gratuit.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-16 px-6 py-12">
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Formations</h2>
            <Link
              href="/formations"
              className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
            >
              Toutes les formations →
            </Link>
          </div>
          {trainings.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[color:var(--color-border)] p-8 text-center text-sm text-[color:var(--color-muted)]">
              Les formations arrivent bientôt.
            </p>
          ) : (
            <ul className="space-y-4">
              {trainings.map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
                    <span className="rounded-full bg-[color:var(--color-accent)]/10 px-2 py-0.5 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                      {TRAINING_TYPE_LABEL[t.trainingType] ?? t.trainingType}
                    </span>
                    {t.topic ? <span>{t.topic}</span> : null}
                  </div>
                  <h3 className="font-semibold">
                    <Link
                      href={`/formations/${t.slug}`}
                      className="hover:text-[color:var(--color-accent)] hover:underline"
                    >
                      {t.title}
                    </Link>
                  </h3>
                  {t.summary ? (
                    <p className="mt-1 text-sm text-[color:var(--color-muted)]">{t.summary}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Ressources & Fiches techniques</h2>
            <Link
              href="/ressources"
              className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
            >
              Toutes les ressources →
            </Link>
          </div>
          {resources.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[color:var(--color-border)] p-8 text-center text-sm text-[color:var(--color-muted)]">
              Les ressources arrivent bientôt.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {resources.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col rounded-lg border border-[color:var(--color-border)] bg-white p-5"
                >
                  <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
                    {RESOURCE_TYPE_LABEL[r.resourceType] ?? r.resourceType}
                  </span>
                  <h3 className="mb-2 flex-1 font-semibold leading-snug">
                    <Link
                      href={`/ressources/${r.slug}`}
                      className="hover:text-[color:var(--color-accent)] hover:underline"
                    >
                      {r.title}
                    </Link>
                  </h3>
                  <Link
                    href={`/ressources/${r.slug}`}
                    className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
                  >
                    Voir →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg bg-[color:var(--color-accent)] px-8 py-10 text-white">
          <h2 className="text-xl font-bold">Vous avez une question ?</h2>
          <p className="mt-2 text-sm opacity-90">
            L&apos;équipe REACT est disponible pour vous accompagner dans votre parcours.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-md border border-white px-5 py-2.5 text-sm font-semibold hover:bg-white hover:text-[color:var(--color-accent)]"
          >
            Contacter REACT →
          </Link>
        </section>
      </div>
    </main>
  );
}
