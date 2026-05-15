"use client";

import { useActionState } from "react";

import type { ForumActionState } from "../../actions";

interface Props {
  threadAction: (prev: ForumActionState, formData: FormData) => Promise<ForumActionState>;
}

const initial: ForumActionState = { status: "idle" };

export function ReplyForm({ threadAction }: Props) {
  const [state, formAction, pending] = useActionState(threadAction, initial);

  if (state.status === "success") {
    return (
      <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
        Réponse publiée. Rechargez la page pour la voir.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.status === "error" ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{state.message}</p>
      ) : null}

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="reply-body">
          Votre réponse
        </label>
        <textarea
          id="reply-body"
          name="body"
          rows={4}
          required
          minLength={5}
          maxLength={2000}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Répondez à cette discussion…"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Publication…" : "Répondre"}
      </button>
    </form>
  );
}
