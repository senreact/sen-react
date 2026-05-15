import type { Metadata } from "next";
import Link from "next/link";

import { listAnnouncements } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Annonces — Sen React",
  description: "Annonces officielles publiées par l'équipe REACT à destination de la communauté.",
};

const CATEGORY_LABEL: Record<string, string> = {
  general: "Général",
  urgent: "Urgent",
  "platform-update": "Plateforme",
  partnership: "Partenariat",
};

const CATEGORY_STYLE: Record<string, string> = {
  general: "bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]",
  urgent: "bg-red-50 text-red-600",
  "platform-update": "bg-blue-50 text-blue-600",
  partnership: "bg-green-50 text-green-700",
};

export default async function AnnoncesPage() {
  const announcements = await listAnnouncements();

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Annonces
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Actualités officielles de REACT.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Communiqués, mises à jour de la plateforme et informations importantes publiées par
            l&apos;équipe REACT.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {announcements.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-muted)]">
            Aucune annonce pour le moment.
          </p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide ${CATEGORY_STYLE[a.category] ?? CATEGORY_STYLE.general}`}
                  >
                    {CATEGORY_LABEL[a.category] ?? a.category}
                  </span>
                  <time className="text-[color:var(--color-muted)]" dateTime={a.publishedAt}>
                    {formatDateFr(a.publishedAt)}
                  </time>
                </div>
                <h2 className="mb-1 text-lg font-semibold">
                  <Link
                    href={`/annonces/${a.slug}`}
                    className="hover:text-[color:var(--color-accent)] hover:underline"
                  >
                    {a.title}
                  </Link>
                </h2>
                <Link
                  href={`/annonces/${a.slug}`}
                  className="mt-2 inline-block text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
                >
                  Lire →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
