"use client";

import { useActionState } from "react";

import type { AuthFormState } from "@/lib/auth";

import { resetPasswordAction } from "./actions";

const INITIAL: AuthFormState = { status: "idle" };

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, INITIAL);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Nouveau mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
        />
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">Au moins 8 caractères.</p>
      </div>

      <div>
        <label htmlFor="confirm" className="mb-1 block text-sm font-medium">
          Confirmer le mot de passe
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          autoComplete="new-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
        />
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
        className="w-full rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Mise à jour…" : "Enregistrer le nouveau mot de passe"}
      </button>
    </form>
  );
}
