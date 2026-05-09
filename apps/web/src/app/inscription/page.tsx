import type { Metadata } from "next";
import Link from "next/link";

import { signUpAction } from "./actions";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Inscription — Sen React",
  description:
    "Créez votre compte Sen React pour rejoindre le réseau d'entrepreneurs sénégalais et africains.",
};

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Rejoignez la plateforme Sen React. Un e-mail de confirmation vous sera envoyé.
        </p>
      </header>

      <AuthForm
        action={signUpAction}
        submitLabel="Créer un compte"
        passwordHint="Au moins 8 caractères."
      />

      <p className="mt-6 text-sm text-[color:var(--color-muted)]">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="text-[color:var(--color-accent)] hover:underline">
          Se connecter
        </Link>
      </p>
    </main>
  );
}
