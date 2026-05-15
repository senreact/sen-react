export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { voteAction } from "@/app/sondages/actions";
import { formatDateFr } from "@/lib/format";
import { getPollResults } from "@/lib/polls";
import { createServerSupabase } from "@/lib/supabase/server";

import { VoteForm } from "./VoteForm";

interface Props {
  params: Promise<{ pollId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pollId } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { title: "Sondage — Sen React" };
  const results = await getPollResults(pollId, user.id);
  return {
    title: results ? `${results.poll.title} — Sondages Sen React` : "Sondages Sen React",
  };
}

export default async function PollDetailPage({ params }: Props) {
  const { pollId } = await params;

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/connexion?returnTo=/sondages/${pollId}`);

  const results = await getPollResults(pollId, user.id);
  if (!results) notFound();

  const { poll, userVote, counts, total } = results;
  const hasVoted = userVote !== null;
  const isClosed = poll.closes_at ? new Date(poll.closes_at) < new Date() : false;
  const showResults = hasVoted || isClosed;

  const boundVoteAction = voteAction.bind(null, pollId);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <nav className="mb-6 text-sm">
        <Link href="/sondages" className="text-[color:var(--color-accent)] hover:underline">
          ← Sondages
        </Link>
      </nav>

      <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-6">
        <div className="mb-2 flex items-center gap-2">
          {isClosed ? (
            <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-xs text-[color:var(--color-muted)]">
              Clôturé
            </span>
          ) : (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Ouvert
            </span>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-bold">{poll.title}</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">{poll.question}</p>
        {poll.closes_at ? (
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">
            Clôture le {formatDateFr(poll.closes_at)}
          </p>
        ) : null}

        <div className="mt-6">
          {showResults ? (
            <div className="space-y-3">
              <p className="mb-4 text-sm font-semibold">
                Résultats ({total} vote{total !== 1 ? "s" : ""})
              </p>
              {poll.options.map((opt, i) => {
                const count = counts[i] ?? 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const isUserChoice = userVote === i;
                return (
                  <div key={i}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className={isUserChoice ? "font-semibold" : ""}>{opt}</span>
                      <span className="text-xs text-[color:var(--color-muted)]">
                        {pct}% ({count})
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-border)]">
                      <div
                        className={`h-full rounded-full transition-all ${isUserChoice ? "bg-[color:var(--color-accent)]" : "bg-gray-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {hasVoted ? (
                <p className="mt-3 text-xs text-[color:var(--color-muted)]">
                  Votre vote : {poll.options[userVote]}
                </p>
              ) : null}
            </div>
          ) : (
            <VoteForm options={poll.options} voteAction={boundVoteAction} />
          )}
        </div>
      </div>
    </main>
  );
}
