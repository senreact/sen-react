"use client";

import { useActionState } from "react";

import { SECTORS } from "@sen-react/shared";

import type { ForumActionState } from "../actions";
import { createThreadAction } from "../actions";

const initial: ForumActionState = { status: "idle" };

export function ForumCreateForm() {
  const [state, formAction, pending] = useActionState(createThreadAction, initial);

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{state.message}</p>
      ) : null}

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="sector">
          Secteur <span className="text-red-500">*</span>
        </label>
        <select
          id="sector"
          name="sector"
          required
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
        >
          <option value="">— Choisir un secteur —</option>
          {SECTORS.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.fr}
            </option>
          ))}
        </select>
      </div>

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
          maxLength={150}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Ex. : Comment trouver des clients dans l'agroécologie ?"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="body">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Décrivez votre question ou sujet de discussion…"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Publication…" : "Publier la discussion"}
      </button>
    </form>
  );
}
