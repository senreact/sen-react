import type { Metadata } from "next";

import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe — Sen React",
};

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Choisir un nouveau mot de passe</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Saisissez votre nouveau mot de passe ci-dessous.
        </p>
      </header>

      <ResetPasswordForm />
    </main>
  );
}
