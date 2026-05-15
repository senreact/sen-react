export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { listActivePolls } from "@/lib/polls";
import { formatDateFr } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sondages — Sen React",
  description: "Participez aux sondages de la communauté REACT et faites entendre votre voix.",
};

export default async function SondagesPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/sondages");

  const polls = await listActivePolls();

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Sondages communautaires
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Donnez votre avis.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Des sondages rapides pour recueillir les opinions de la communauté REACT sur des sujets
            importants.
          </p>
          <div className="mt-6">
            <Link
              href="/sondages/creer"
              className="inline-block rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Créer un sondage →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {polls.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-muted)]">
            Aucun sondage actif pour le moment.{" "}
            <Link
              href="/sondages/creer"
              className="font-semibold text-[color:var(--color-accent)] hover:underline"
            >
              Lancez le premier.
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {polls.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/sondages/${p.id}`}
                  className="flex flex-col gap-2 rounded-lg border border-[color:var(--color-border)] bg-white p-5 transition-colors hover:border-[color:var(--color-accent)]"
                >
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-[color:var(--color-muted)]">{p.question}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-[color:var(--color-muted)]">
                    <span>{p.options.length} options</span>
                    {p.closes_at ? (
                      <span>Clôture le {formatDateFr(p.closes_at)}</span>
                    ) : (
                      <span>Ouvert</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
