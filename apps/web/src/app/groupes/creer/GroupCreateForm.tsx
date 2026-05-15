"use client";

import { useActionState } from "react";

import { GROUP_TYPES } from "@/lib/groups-constants";

import type { GroupActionState } from "../actions";
import { createGroupAction } from "../actions";

const initial: GroupActionState = { status: "idle" };

export function GroupCreateForm() {
  const [state, formAction, pending] = useActionState(createGroupAction, initial);

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{state.message}</p>
      ) : null}

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="name">
          Nom du groupe <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={3}
          maxLength={100}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Ex. : Entrepreneurs de Dakar"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="description">
          Description (optionnel)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={500}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Décrivez l'objectif et les membres cibles de ce groupe…"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="group_type">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          id="group_type"
          name="group_type"
          required
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
        >
          <option value="">— Choisir un type —</option>
          {GROUP_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="tag">
          Tag <span className="text-red-500">*</span>
        </label>
        <input
          id="tag"
          name="tag"
          type="text"
          required
          maxLength={100}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Ex. : Dakar, agroécologie, financement"
        />
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">
          Mot-clé principal qui identifie ce groupe (région, secteur ou thème).
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Création…" : "Créer le groupe"}
      </button>
    </form>
  );
}
