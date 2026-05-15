"use client";

import { useActionState } from "react";

import type { CommentModerationState } from "./actions";
import { approveCommentAction, rejectCommentAction } from "./actions";

interface ModerationFormProps {
  commentId: string;
}

const initial: CommentModerationState = { status: "idle" };

export function ModerationForm({ commentId }: ModerationFormProps) {
  const [approveState, approveAction, approvePending] = useActionState(
    approveCommentAction,
    initial,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(rejectCommentAction, initial);

  const done = approveState.status === "success" || rejectState.status === "success";
  const doneMessage = approveState.message ?? rejectState.message;
  const errorMessage =
    approveState.status === "error"
      ? approveState.message
      : rejectState.status === "error"
        ? rejectState.message
        : null;

  if (done) {
    return <p className="text-xs font-semibold text-[color:var(--color-accent)]">{doneMessage}</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={approveAction}>
        <input type="hidden" name="comment_id" value={commentId} />
        <button
          type="submit"
          disabled={approvePending || rejectPending}
          className="rounded-md bg-[color:var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {approvePending ? "…" : "Approuver"}
        </button>
      </form>
      <form action={rejectAction}>
        <input type="hidden" name="comment_id" value={commentId} />
        <button
          type="submit"
          disabled={approvePending || rejectPending}
          className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {rejectPending ? "…" : "Refuser"}
        </button>
      </form>
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
