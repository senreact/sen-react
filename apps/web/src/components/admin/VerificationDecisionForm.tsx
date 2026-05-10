"use client";

import { useActionState } from "react";

import {
  approveProfileAction,
  rejectProfileAction,
  type VerificationActionState,
} from "@/app/admin/profils/actions";

interface VerificationDecisionFormProps {
  userId: string;
}

const INITIAL: VerificationActionState = { status: "idle" };

/**
 * Approve / reject controls for a single pending profile row. The
 * textarea is shared between the two actions — approve uses notes
 * optionally, reject requires non-empty notes (the user sees the
 * reason in their /mon-profil verification badge).
 *
 * Both buttons override the form's default `action` via React's
 * `formAction` prop so we can keep one shared textarea + one hidden
 * `user_id` field instead of duplicating the row.
 */
export function VerificationDecisionForm({ userId }: VerificationDecisionFormProps) {
  const [approveState, approve, approvePending] = useActionState(approveProfileAction, INITIAL);
  const [rejectState, reject, rejectPending] = useActionState(rejectProfileAction, INITIAL);
  const pending = approvePending || rejectPending;

  const banner = pickBanner(approveState, rejectState);

  return (
    <form className="space-y-3">
      <input type="hidden" name="user_id" value={userId} />
      <textarea
        name="verification_notes"
        maxLength={1000}
        rows={2}
        placeholder="Notes (optionnel pour approuver, obligatoire pour refuser)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          formAction={approve}
          disabled={pending}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {approvePending ? "…" : "Approuver"}
        </button>
        <button
          type="submit"
          formAction={reject}
          disabled={pending}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {rejectPending ? "…" : "Refuser"}
        </button>
      </div>
      {banner ? <p className={`text-xs ${banner.tone}`}>{banner.message}</p> : null}
    </form>
  );
}

function pickBanner(
  approveState: VerificationActionState,
  rejectState: VerificationActionState,
): { tone: string; message: string } | null {
  // Show whichever banner fired most recently (whichever is non-idle).
  // If both are non-idle, reject wins (more recent intent — admin
  // typed notes before clicking).
  if (rejectState.status === "error") {
    return { tone: "text-red-700", message: rejectState.message ?? "Erreur." };
  }
  if (rejectState.status === "success") {
    return { tone: "text-emerald-700", message: rejectState.message ?? "Refusé." };
  }
  if (approveState.status === "error") {
    return { tone: "text-red-700", message: approveState.message ?? "Erreur." };
  }
  if (approveState.status === "success") {
    return { tone: "text-emerald-700", message: approveState.message ?? "Approuvé." };
  }
  return null;
}
