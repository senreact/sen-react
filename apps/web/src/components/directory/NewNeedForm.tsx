"use client";

import { useActionState } from "react";

import { submitNeedAction, type NeedActionState } from "@/app/annuaire/recherches/actions";

interface NewNeedFormProps {
  sectors: ReadonlyArray<{ slug: string; fr: string }>;
  kinds: ReadonlyArray<{ slug: string; fr: string }>;
}

const INITIAL: NeedActionState = { status: "idle" };

export function NewNeedForm({ sectors, kinds }: NewNeedFormProps) {
  const [state, action, pending] = useActionState(submitNeedAction, INITIAL);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="kind" className="mb-1 block text-sm font-medium">
          Type
        </label>
        <select
          id="kind"
          name="kind"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {kinds.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.fr}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Titre
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={160}
          placeholder="En une phrase — ex. 'Cherche développeur back-end pour startup agro'"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="summary" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          maxLength={2000}
          rows={5}
          placeholder="Précisez le contexte, les attentes, le timing."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sector_slug" className="mb-1 block text-sm font-medium">
            Secteur <span className="text-[color:var(--color-muted)]">(facultatif)</span>
          </label>
          <select
            id="sector_slug"
            name="sector_slug"
            defaultValue=""
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">— Aucun —</option>
            {sectors.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.fr}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="region" className="mb-1 block text-sm font-medium">
            Région <span className="text-[color:var(--color-muted)]">(facultatif)</span>
          </label>
          <input
            id="region"
            name="region"
            type="text"
            maxLength={120}
            placeholder="Dakar, Thiès…"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      {state.status === "error" ? (
        <p
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Publication…" : "Publier"}
      </button>
    </form>
  );
}
