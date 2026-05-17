"use client";

import { useActionState } from "react";

import type { AuthFormState } from "@/lib/auth";

import { forgotPasswordAction } from "./actions";

const INITIAL: AuthFormState = { status: "idle" };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, INITIAL);

  if (state.status === "success") {
    return (
      <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
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
        {pending ? "Envoi en cours…" : "Envoyer le lien de réinitialisation"}
      </button>
    </form>
  );
}
