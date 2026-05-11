"use client";

import { useActionState } from "react";

import {
  submitReviewAction,
  deleteOwnReviewAction,
  type ReviewActionState,
} from "@/app/annuaire/[slug]/actions";

interface ReviewFormProps {
  slug: string;
  /** Existing review from the current visitor (if any) — used as form defaults. */
  existing: { stars: number; comment: string | null } | null;
}

const INITIAL: ReviewActionState = { status: "idle" };

/**
 * Review submission form. Same component renders "create" and "edit"
 * — the existence of an existing review just populates defaults.
 * UNIQUE (subject, reviewer) + onConflict upsert on the server-side
 * means submit always replaces.
 *
 * Delete is a separate form (sibling) that shares the slug input via
 * formData on submit.
 */
export function ReviewForm({ slug, existing }: ReviewFormProps) {
  const [submitState, submit, submitPending] = useActionState(submitReviewAction, INITIAL);
  const [deleteState, doDelete, deletePending] = useActionState(deleteOwnReviewAction, INITIAL);
  const banner = pickBanner(submitState, deleteState);

  return (
    <section className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
        {existing ? "Modifier votre avis" : "Publier un avis"}
      </h3>
      <form action={submit} className="space-y-3">
        <input type="hidden" name="slug" value={slug} />
        <div>
          <label htmlFor="stars" className="mb-1 block text-sm font-medium">
            Note
          </label>
          <select
            id="stars"
            name="stars"
            required
            defaultValue={existing?.stars ?? 5}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="5">★★★★★ — Excellent</option>
            <option value="4">★★★★ — Très bien</option>
            <option value="3">★★★ — Correct</option>
            <option value="2">★★ — Décevant</option>
            <option value="1">★ — Problématique</option>
          </select>
        </div>
        <div>
          <label htmlFor="comment" className="mb-1 block text-sm font-medium">
            Commentaire <span className="text-[color:var(--color-muted)]">(facultatif)</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            maxLength={2000}
            rows={3}
            defaultValue={existing?.comment ?? ""}
            placeholder="Votre expérience de collaboration avec ce profil."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={submitPending}
            className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitPending ? "…" : existing ? "Mettre à jour" : "Publier"}
          </button>
        </div>
      </form>

      {existing ? (
        <form action={doDelete} className="mt-3 border-t border-slate-200 pt-3">
          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            disabled={deletePending}
            className="text-xs text-red-700 hover:underline disabled:opacity-50"
          >
            {deletePending ? "…" : "Supprimer mon avis"}
          </button>
        </form>
      ) : null}

      {banner ? <p className={`mt-3 text-sm ${banner.tone}`}>{banner.message}</p> : null}
    </section>
  );
}

function pickBanner(
  submitState: ReviewActionState,
  deleteState: ReviewActionState,
): { tone: string; message: string } | null {
  if (deleteState.status === "error") {
    return { tone: "text-red-700", message: deleteState.message ?? "Erreur." };
  }
  if (deleteState.status === "success") {
    return { tone: "text-emerald-700", message: deleteState.message ?? "Supprimé." };
  }
  if (submitState.status === "error") {
    return { tone: "text-red-700", message: submitState.message ?? "Erreur." };
  }
  if (submitState.status === "success") {
    return { tone: "text-emerald-700", message: submitState.message ?? "Publié." };
  }
  return null;
}
