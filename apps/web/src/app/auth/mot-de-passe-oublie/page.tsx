import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Mot de passe oublié — Sen React",
};

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Mot de passe oublié&nbsp;?</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Saisissez votre adresse e-mail et nous vous enverrons un lien de réinitialisation.
        </p>
      </header>

      <ForgotPasswordForm />

      <p className="mt-6 text-sm text-[color:var(--color-muted)]">
        <Link href="/connexion" className="text-[color:var(--color-accent)] hover:underline">
          ← Retour à la connexion
        </Link>
      </p>
    </main>
  );
}
