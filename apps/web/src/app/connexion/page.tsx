import type { Metadata } from "next";
import Link from "next/link";

import { signInAction } from "./actions";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Connexion — Sen React",
  description:
    "Connectez-vous à votre espace membre Sen React pour accéder aux opportunités et au réseau.",
};

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Accédez à votre espace membre Sen React.
        </p>
      </header>

      <AuthForm action={signInAction} submitLabel="Se connecter" />

      <p className="mt-6 text-sm text-[color:var(--color-muted)]">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-[color:var(--color-accent)] hover:underline">
          Créer un compte
        </Link>
      </p>
    </main>
  );
}
