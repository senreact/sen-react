"use client";

import { useActionState } from "react";

import type { CommentActionState } from "@/app/actualites/[slug]/actions";
import { submitCommentAction } from "@/app/actualites/[slug]/actions";

interface CommentFormProps {
  articleSlug: string;
}

const initial: CommentActionState = { status: "idle" };

export function CommentForm({ articleSlug }: CommentFormProps) {
  const [state, formAction, pending] = useActionState(submitCommentAction, initial);

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-4 text-sm text-[color:var(--color-muted)]">
        Commentaire soumis — il sera visible après modération par l&apos;équipe REACT.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="article_slug" value={articleSlug} />
      <textarea
        name="body"
        rows={4}
        maxLength={2000}
        required
        placeholder="Partagez votre réaction… (max 2 000 caractères)"
        className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
      />
      {state.status === "error" ? <p className="text-xs text-red-600">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Soumettre"}
      </button>
    </form>
  );
}
