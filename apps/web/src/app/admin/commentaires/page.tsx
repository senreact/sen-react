import { requireAdminProfile } from "@/lib/admin";
import { listPendingComments } from "@/lib/comments";
import { formatDateFr } from "@/lib/format";
import { ModerationForm } from "./ModerationForm";

export const dynamic = "force-dynamic";

export default async function AdminCommentairesPage() {
  await requireAdminProfile("/admin/commentaires");
  const pending = await listPendingComments();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
          Administration
        </p>
        <h1 className="text-3xl font-bold">File de modération — Commentaires</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          {pending.length === 0
            ? "Aucun commentaire en attente."
            : `${pending.length} commentaire${pending.length > 1 ? "s" : ""} en attente de modération.`}
        </p>
      </header>

      {pending.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-muted)]">
          La file est vide — aucun commentaire à modérer pour l&apos;instant.
        </div>
      ) : (
        <ul className="space-y-4">
          {pending.map((comment) => (
            <li
              key={comment.id}
              className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div className="text-sm">
                  <span className="font-semibold">{comment.author_display_name ?? "Membre"}</span>
                  <span className="ml-2 text-[color:var(--color-muted)]">
                    sur{" "}
                    <a
                      href={`/actualites/${comment.article_slug}`}
                      className="underline hover:text-[color:var(--color-accent)]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      /actualites/{comment.article_slug}
                    </a>
                  </span>
                </div>
                <time className="text-xs text-[color:var(--color-muted)]">
                  {formatDateFr(comment.created_at)}
                </time>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[color:var(--color-fg)]">
                {comment.body}
              </p>
              <ModerationForm commentId={comment.id} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
