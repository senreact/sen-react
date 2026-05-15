import type { Metadata } from "next";
import Link from "next/link";

import { getSector } from "@sen-react/shared";

import { listEvents } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Événements — Sen React",
  description:
    "Ateliers, webinaires et événements organisés ou relayés par REACT — entrepreneuriat et transition numérique au Sénégal.",
};

const EVENT_TYPE_LABEL: Record<string, string> = {
  "in-person": "Présentiel",
  online: "En ligne",
  webinar: "Webinaire",
};

export default async function EvenementsPage() {
  const [upcoming, past] = await Promise.all([
    listEvents({ upcoming: true, limit: 50 }),
    listEvents({ upcoming: false, limit: 20 }),
  ]);

  const pastFiltered = past.filter((e) => !upcoming.find((u) => u.id === e.id));

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Événements
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Ateliers, webinaires et rencontres REACT.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Participez aux événements organisés ou relayés par REACT — en présentiel au Sénégal et
            en ligne.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="mb-6 text-xl font-bold">À venir</h2>
        {upcoming.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-muted)]">
            Aucun événement à venir pour le moment. Revenez bientôt.
          </p>
        ) : (
          <ul className="space-y-4">
            {upcoming.map((event) => {
              const sector = event.sector ? getSector(event.sector) : null;
              return (
                <li
                  key={event.id}
                  className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
                    {sector ? (
                      <span className="rounded-full bg-[color:var(--color-accent)]/10 px-2 py-0.5 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                        {sector.fr}
                      </span>
                    ) : null}
                    <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5">
                      {EVENT_TYPE_LABEL[event.eventType] ?? event.eventType}
                    </span>
                    <time dateTime={event.startsAt}>{formatDateFr(event.startsAt)}</time>
                    {event.location ? <span>· {event.location}</span> : null}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">
                    <Link
                      href={`/evenements/${event.slug}`}
                      className="hover:text-[color:var(--color-accent)] hover:underline"
                    >
                      {event.title}
                    </Link>
                  </h3>
                  {event.summary ? (
                    <p className="text-sm text-[color:var(--color-muted)]">{event.summary}</p>
                  ) : null}
                  <div className="mt-3 flex gap-3">
                    <Link
                      href={`/evenements/${event.slug}`}
                      className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
                    >
                      Voir les détails →
                    </Link>
                    {event.registrationUrl ? (
                      <a
                        href={event.registrationUrl}
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

      {pastFiltered.length > 0 ? (
        <section className="mx-auto max-w-4xl border-t border-[color:var(--color-border)] px-6 py-12">
          <h2 className="mb-6 text-xl font-bold text-[color:var(--color-muted)]">
            Événements passés
          </h2>
          <ul className="space-y-3">
            {pastFiltered.map((event) => (
              <li key={event.id} className="flex flex-wrap items-center gap-3 text-sm">
                <time className="text-[color:var(--color-muted)]" dateTime={event.startsAt}>
                  {formatDateFr(event.startsAt)}
                </time>
                <Link
                  href={`/evenements/${event.slug}`}
                  className="font-medium hover:text-[color:var(--color-accent)] hover:underline"
                >
                  {event.title}
                </Link>
                {event.location ? (
                  <span className="text-[color:var(--color-muted)]">· {event.location}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
