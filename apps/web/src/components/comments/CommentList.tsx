import type { ArticleComment } from "@/lib/comments";
import { formatDateFr } from "@/lib/format";

interface CommentListProps {
  comments: ArticleComment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-[color:var(--color-muted)]">
        Aucun commentaire pour l&apos;instant. Soyez le premier à réagir.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <li
          key={c.id}
          className="rounded-lg border border-[color:var(--color-border)] bg-white p-4"
        >
          <div className="mb-2 flex items-center justify-between gap-2 text-xs text-[color:var(--color-muted)]">
            <span className="font-semibold text-[color:var(--color-fg)]">
              {c.author_display_name ?? "Membre"}
            </span>
            <time dateTime={c.created_at}>{formatDateFr(c.created_at)}</time>
          </div>
          <p className="text-sm leading-relaxed text-[color:var(--color-fg)]">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
