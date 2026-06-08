import type { Metadata } from "next";
import Link from "next/link";

import { getSector } from "@sen-react/shared";

import { listTrainings } from "@/lib/cms";
import { PageHeroImage } from "@/components/content/PageHeroImage";
import { formatDateFr } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Formations — Sen React",
  description:
    "Tutoriels, webinaires, ateliers et cours en ligne proposés par REACT — renforcement des capacités des entrepreneurs sénégalais. Accès gratuit.",
};

const TYPE_LABEL: Record<string, string> = {
  tutorial: "Tutoriel",
  webinar: "Webinaire",
  workshop: "Atelier",
  "online-course": "Cours en ligne",
};

const LEVEL_LABEL: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

const FORMAT_BADGE: Record<string, string> = {
  online: "En ligne",
  "in-person": "Présentiel",
  hybrid: "Hybride",
};

export default async function FormationsPage() {
  const trainings = await listTrainings(50);

  return (
    <main>
      <PageHeroImage pageKey="formations" />
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Renforcement des capacités
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Formations REACT.</h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Tutoriels, webinaires, ateliers et cours en ligne pour renforcer vos compétences
            entrepreneuriales. Toujours gratuit.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {trainings.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-muted)]">
            Les formations arrivent bientôt. Revenez prochainement.
          </p>
        ) : (
          <ul className="space-y-4">
            {trainings.map((training) => {
              const sector = training.sector ? getSector(training.sector) : null;
              return (
                <li
                  key={training.id}
                  className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
                    <span className="rounded-full bg-[color:var(--color-accent)]/10 px-2 py-0.5 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                      {TYPE_LABEL[training.trainingType] ?? training.trainingType}
                    </span>
                    {training.level ? (
                      <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5">
                        {LEVEL_LABEL[training.level]}
                      </span>
                    ) : null}
                    {training.format ? (
                      <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5">
                        {FORMAT_BADGE[training.format]}
                      </span>
                    ) : null}
                    {sector ? (
                      <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5">
                        {sector.fr}
                      </span>
                    ) : null}
                    {training.startsAt ? (
                      <time dateTime={training.startsAt}>{formatDateFr(training.startsAt)}</time>
                    ) : null}
                    {training.location ? <span>· {training.location}</span> : null}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">
                    <Link
                      href={`/formations/${training.slug}`}
                      className="hover:text-[color:var(--color-accent)] hover:underline"
                    >
                      {training.title}
                    </Link>
                  </h3>
                  {training.topic ? (
                    <p className="mb-1 text-xs font-medium text-[color:var(--color-muted)]">
                      Thème : {training.topic}
                    </p>
                  ) : null}
                  {training.summary ? (
                    <p className="text-sm text-[color:var(--color-muted)]">{training.summary}</p>
                  ) : null}
                  <div className="mt-3 flex gap-3">
                    <Link
                      href={`/formations/${training.slug}`}
                      className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
                    >
                      Voir la formation →
                    </Link>
                    {training.registrationUrl ? (
                      <a
                        href={training.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
                      >
                        S&apos;inscrire →
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
