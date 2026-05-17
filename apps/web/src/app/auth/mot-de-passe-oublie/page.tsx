"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useActionState } from "react";

import type { AuthFormState } from "@/lib/auth";

import { forgotPasswordAction } from "./actions";

export const metadata: Metadata = {
  title: "Mot de passe oublié — Sen React",
};

const INITIAL: AuthFormState = { status: "idle" };

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, INITIAL);

  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Mot de passe oublié&nbsp;?</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Saisissez votre adresse e-mail et nous vous enverrons un lien de réinitialisation.
        </p>
      </header>

      {state.status === "success" ? (
        <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          {state.message}
        </div>
      ) : (
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
      )}

      <p className="mt-6 text-sm text-[color:var(--color-muted)]">
        <Link href="/connexion" className="text-[color:var(--color-accent)] hover:underline">
          ← Retour à la connexion
        </Link>
      </p>
    </main>
  );
}
