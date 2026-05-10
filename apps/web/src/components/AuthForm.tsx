"use client";

import { useActionState } from "react";

import type { AuthFormState } from "@/lib/auth";

interface AuthFormProps {
  action: (prevState: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  /** Submit button label, e.g. "Se connecter" / "Créer un compte". */
  submitLabel: string;
  /** Hint shown under the password field when relevant (e.g. min length). */
  passwordHint?: string;
  /** Field labels — typically passed from the auth-strings CMS global. */
  emailLabel: string;
  passwordLabel: string;
  pendingLabel: string;
}

const INITIAL_STATE: AuthFormState = { status: "idle" };

export function AuthForm({
  action,
  submitLabel,
  passwordHint,
  emailLabel,
  passwordLabel,
  pendingLabel,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          {emailLabel}
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

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          {passwordLabel}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
        />
        {passwordHint ? (
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">{passwordHint}</p>
        ) : null}
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
        className="w-full rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
