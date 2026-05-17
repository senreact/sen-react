"use client";

import { useActionState } from "react";

import type { AuthFormState } from "@/lib/auth";

interface Props {
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}

const INITIAL: AuthFormState = { status: "idle" };

export function ChangePasswordForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, INITIAL);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div>
        <label htmlFor="cp-password" className="mb-1 block text-sm font-medium">
          Nouveau mot de passe
        </label>
        <input
          id="cp-password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
        />
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">Au moins 8 caractères.</p>
      </div>

      <div>
        <label htmlFor="cp-confirm" className="mb-1 block text-sm font-medium">
          Confirmer le nouveau mot de passe
        </label>
        <input
          id="cp-confirm"
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

      {state.status === "success" ? (
        <p
          role="status"
          className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700"
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Mise à jour…" : "Mettre à jour le mot de passe"}
      </button>
    </form>
  );
}
