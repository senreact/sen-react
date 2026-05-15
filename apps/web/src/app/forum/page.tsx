export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SECTORS } from "@sen-react/shared";

import { countThreadsBySector } from "@/lib/forum";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Forum — Sen React",
  description:
    "Échangez avec la communauté REACT par secteur d'activité — questions, conseils, expériences.",
};

export default async function ForumPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/forum");

  const counts = await countThreadsBySector();

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Forum communautaire
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Discussions par secteur.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Posez vos questions, partagez vos expériences et échangez avec les membres de la
            communauté REACT dans votre secteur d&apos;activité.
          </p>
          <div className="mt-6">
            <Link
              href="/forum/creer"
              className="inline-block rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Nouvelle discussion →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <ul className="grid gap-4 sm:grid-cols-2">
          {SECTORS.map((s) => {
            const count = counts[s.slug] ?? 0;
            return (
              <li key={s.slug}>
                <Link
                  href={`/forum/${s.slug}`}
                  className="flex items-center justify-between rounded-lg border border-[color:var(--color-border)] bg-white p-5 transition-colors hover:border-[color:var(--color-accent)]"
                >
                  <div>
                    <p className="font-semibold">{s.fr}</p>
                    <p className="mt-0.5 text-sm text-[color:var(--color-muted)]">
                      {count} discussion{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="text-[color:var(--color-accent)]">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
