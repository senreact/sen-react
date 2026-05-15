import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSector } from "@sen-react/shared";

import { LexicalRichText } from "@/components/content/LexicalRichText";
import { getEventBySlug } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const EVENT_TYPE_LABEL: Record<string, string> = {
  "in-person": "Présentiel",
  online: "En ligne",
  webinar: "Webinaire",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Événement introuvable — Sen React" };
  return {
    title: `${event.title} — Sen React`,
    description: event.summary ?? undefined,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const sector = event.sector ? getSector(event.sector) : null;

  return (
    <main>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-sm">
          <Link href="/evenements" className="text-[color:var(--color-accent)] hover:underline">
            ← Tous les événements
          </Link>
        </nav>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
            {sector ? (
              <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                {sector.fr}
              </span>
            ) : null}
            <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">
              {EVENT_TYPE_LABEL[event.eventType] ?? event.eventType}
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{event.title}</h1>

          {event.summary ? (
            <p className="mt-4 text-lg text-[color:var(--color-muted)]">{event.summary}</p>
          ) : null}

          <dl className="mt-6 grid gap-3 rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Date</dt>
              <dd className="mt-1 text-[color:var(--color-muted)]">
                <time dateTime={event.startsAt}>{formatDateFr(event.startsAt)}</time>
                {event.endsAt ? (
                  <> — <time dateTime={event.endsAt}>{formatDateFr(event.endsAt)}</time></>
                ) : null}
              </dd>
            </div>
            {event.location ? (
              <div>
                <dt className="font-semibold">Lieu</dt>
                <dd className="mt-1 text-[color:var(--color-muted)]">{event.location}</dd>
              </div>
            ) : null}
          </dl>

          {event.registrationUrl ? (
            <div className="mt-6">
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                S&apos;inscrire à cet événement →
              </a>
            </div>
          ) : null}
        </header>

        {event.body ? <LexicalRichText content={event.body} /> : null}
      </article>
    </main>
  );
}
