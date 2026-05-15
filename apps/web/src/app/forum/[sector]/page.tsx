export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getSector } from "@sen-react/shared";

import { listThreadsBySector } from "@/lib/forum";
import { formatDateFr } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ sector: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector } = await params;
  const s = getSector(sector);
  return {
    title: s ? `${s.fr} — Forum Sen React` : "Forum Sen React",
  };
}

export default async function ForumSectorPage({ params }: Props) {
  const { sector } = await params;
  const sectorData = getSector(sector);
  if (!sectorData) notFound();

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/connexion?returnTo=/forum/${sector}`);

  const threads = await listThreadsBySector(sector);

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <nav className="mb-4 text-sm">
            <Link href="/forum" className="text-[color:var(--color-accent)] hover:underline">
              ← Forum
            </Link>
          </nav>
          <h1 className="text-3xl font-bold">{sectorData.fr}</h1>
          <p className="mt-2 text-[color:var(--color-muted)]">
            {threads.length} discussion{threads.length !== 1 ? "s" : ""}
          </p>
          <div className="mt-4">
            <Link
              href={`/forum/creer?sector=${sector}`}
              className="inline-block rounded-md border border-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)] hover:text-white"
            >
              Nouvelle discussion →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        {threads.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-muted)]">
            Aucune discussion pour le moment.{" "}
            <Link
              href={`/forum/creer?sector=${sector}`}
              className="font-semibold text-[color:var(--color-accent)] hover:underline"
            >
              Soyez le premier à ouvrir un sujet.
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[color:var(--color-border)]">
            {threads.map((t) => (
              <li key={t.id} className="py-5">
                <Link href={`/forum/${sector}/${t.id}`} className="group block">
                  <div className="flex items-start gap-3">
                    {t.is_pinned ? (
                      <span className="mt-0.5 rounded bg-[color:var(--color-accent)]/10 px-1.5 py-0.5 text-xs font-semibold text-[color:var(--color-accent)]">
                        Épinglé
                      </span>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold group-hover:text-[color:var(--color-accent)]">
                        {t.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-[color:var(--color-muted)]">
                        {t.body}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-[color:var(--color-muted)]">
                    <span>{t.author_name}</span>
                    <span>{formatDateFr(t.created_at)}</span>
                    <span>
                      {t.reply_count} réponse{t.reply_count !== 1 ? "s" : ""}
                    </span>
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
