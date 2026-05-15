import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSector } from "@sen-react/shared";

import { LexicalRichText } from "@/components/content/LexicalRichText";
import { getTrainingBySlug } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const training = await getTrainingBySlug(slug);
  if (!training) return { title: "Formation introuvable — Sen React" };
  return {
    title: `${training.title} — Sen React`,
    description: training.summary ?? undefined,
  };
}

export default async function TrainingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const training = await getTrainingBySlug(slug);
  if (!training) notFound();

  const sector = training.sector ? getSector(training.sector) : null;

  return (
    <main>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-sm">
          <Link href="/formations" className="text-[color:var(--color-accent)] hover:underline">
            ← Toutes les formations
          </Link>
        </nav>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
            <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              {TYPE_LABEL[training.trainingType] ?? training.trainingType}
            </span>
            {training.level ? (
              <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">
                {LEVEL_LABEL[training.level]}
              </span>
            ) : null}
            {training.format ? (
              <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">
                {FORMAT_BADGE[training.format]}
              </span>
            ) : null}
            {sector ? (
              <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">
                {sector.fr}
              </span>
            ) : null}
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{training.title}</h1>

          {training.topic ? (
            <p className="mt-2 text-sm font-medium text-[color:var(--color-muted)]">
              Thème : {training.topic}
            </p>
          ) : null}

          {training.summary ? (
            <p className="mt-4 text-lg text-[color:var(--color-muted)]">{training.summary}</p>
          ) : null}

          {(training.startsAt ?? training.location) ? (
            <dl className="mt-6 grid gap-3 rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm sm:grid-cols-2">
              {training.startsAt ? (
                <div>
                  <dt className="font-semibold">Date</dt>
                  <dd className="mt-1 text-[color:var(--color-muted)]">
                    <time dateTime={training.startsAt}>{formatDateFr(training.startsAt)}</time>
                    {training.endsAt ? (
                      <>
                        {" "}
                        — <time dateTime={training.endsAt}>{formatDateFr(training.endsAt)}</time>
                      </>
                    ) : null}
                  </dd>
                </div>
              ) : null}
              {training.location ? (
                <div>
                  <dt className="font-semibold">Lieu</dt>
                  <dd className="mt-1 text-[color:var(--color-muted)]">{training.location}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {training.registrationUrl ? (
              <a
                href={training.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                S&apos;inscrire →
              </a>
            ) : null}
            {training.videoUrl ? (
              <a
                href={training.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md border border-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)]/5"
              >
                Voir la vidéo →
              </a>
            ) : null}
          </div>
        </header>

        {training.body ? <LexicalRichText content={training.body} /> : null}
      </article>
    </main>
  );
}
