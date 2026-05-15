"use client";

import { useActionState } from "react";

import type { PollActionState } from "../actions";
import { createPollAction } from "../actions";

const initial: PollActionState = { status: "idle" };

export function PollCreateForm() {
  const [state, formAction, pending] = useActionState(createPollAction, initial);

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{state.message}</p>
      ) : null}

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="title">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={5}
          maxLength={200}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Ex. : Quel type d'accompagnement vous intéresse le plus ?"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="question">
          Question <span className="text-red-500">*</span>
        </label>
        <textarea
          id="question"
          name="question"
          rows={3}
          required
          minLength={10}
          maxLength={500}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Formulez la question posée aux membres…"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="options">
          Options <span className="text-red-500">*</span>
        </label>
        <textarea
          id="options"
          name="options"
          rows={5}
          required
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder={
            "Mentoring individuel\nAteliers en groupe\nRessources en ligne\nMises en réseau"
          }
        />
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">
          Une option par ligne (2 à 8 options).
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="closes_at">
          Date de clôture (optionnel)
        </label>
        <input
          id="closes_at"
          name="closes_at"
          type="date"
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Publication…" : "Publier le sondage"}
      </button>
    </form>
  );
}
