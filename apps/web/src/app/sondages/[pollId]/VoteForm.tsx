"use client";

import { useActionState } from "react";

import type { PollActionState } from "../actions";

interface Props {
  options: string[];
  voteAction: (prev: PollActionState, formData: FormData) => Promise<PollActionState>;
}

const initial: PollActionState = { status: "idle" };

export function VoteForm({ options, voteAction }: Props) {
  const [state, formAction, pending] = useActionState(voteAction, initial);

  if (state.status === "success") {
    return (
      <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
        Vote enregistré. Rechargez la page pour voir les résultats.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.status === "error" ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{state.message}</p>
      ) : null}

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold">Choisissez une option</legend>
        {options.map((opt, i) => (
          <label key={i} className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="radio"
              name="option_index"
              value={i}
              required
              className="accent-[color:var(--color-accent)]"
            />
            {opt}
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Voter"}
      </button>
    </form>
  );
}
