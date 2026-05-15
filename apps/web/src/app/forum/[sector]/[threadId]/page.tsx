export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getSector } from "@sen-react/shared";

import { createReplyAction } from "@/app/forum/actions";
import { getThread, listReplies } from "@/lib/forum";
import { formatDateFr } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";

import { ReplyForm } from "./ReplyForm";

interface Props {
  params: Promise<{ sector: string; threadId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { threadId } = await params;
  const thread = await getThread(threadId);
  return {
    title: thread ? `${thread.title} — Forum Sen React` : "Forum Sen React",
  };
}

export default async function ForumThreadPage({ params }: Props) {
  const { sector, threadId } = await params;
  const sectorData = getSector(sector);
  if (!sectorData) notFound();

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/connexion?returnTo=/forum/${sector}/${threadId}`);

  const [thread, replies] = await Promise.all([getThread(threadId), listReplies(threadId)]);

  if (!thread || thread.sector !== sector) notFound();

  const boundReplyAction = createReplyAction.bind(null, threadId, sector);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm">
        <Link
          href={`/forum/${sector}`}
          className="text-[color:var(--color-accent)] hover:underline"
        >
          ← {sectorData.fr}
        </Link>
      </nav>

      <article className="rounded-lg border border-[color:var(--color-border)] bg-white p-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full bg-[color:var(--color-accent)]/10 px-2 py-0.5 text-xs font-medium text-[color:var(--color-accent)]">
            {sectorData.fr}
          </span>
          {thread.is_locked ? (
            <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-xs text-[color:var(--color-muted)]">
              Verrouillé
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 text-2xl font-bold">{thread.title}</h1>
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">
          {thread.author_name} · {formatDateFr(thread.created_at)}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[color:var(--color-fg)]">
          {thread.body}
        </p>
      </article>

      {replies.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
            {replies.length} réponse{replies.length !== 1 ? "s" : ""}
          </h2>
          <ul className="space-y-4">
            {replies.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
              >
                <p className="mb-1 text-xs text-[color:var(--color-muted)]">
                  {r.author_name} · {formatDateFr(r.created_at)}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{r.body}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!thread.is_locked ? (
        <section className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
            Répondre
          </h2>
          <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
            <ReplyForm threadAction={boundReplyAction} />
          </div>
        </section>
      ) : (
        <p className="mt-8 text-sm text-[color:var(--color-muted)]">
          Cette discussion est verrouillée — les nouvelles réponses sont désactivées.
        </p>
      )}
    </main>
  );
}
