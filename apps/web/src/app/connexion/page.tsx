import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";

import { signInAction } from "./actions";
import { AuthForm } from "@/components/AuthForm";
import { getAuthStrings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Connexion — Sen React",
  description:
    "Connectez-vous à votre espace membre Sen React pour accéder aux opportunités et au réseau.",
};

export default async function SignInPage() {
  const strings = await getAuthStrings();
  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">{strings.signin.pageTitle}</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          {strings.signin.leadParagraph}
        </p>
      </header>

      <AuthForm
        action={signInAction}
        submitLabel={strings.signin.submitLabel}
        emailLabel={strings.form.emailLabel}
        passwordLabel={strings.form.passwordLabel}
        pendingLabel={strings.form.pendingLabel}
      />

      <p className="mt-4 text-right text-sm">
        <Link
          href={"/auth/mot-de-passe-oublie" as Route}
          className="text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] hover:underline"
        >
          Mot de passe oublié&nbsp;?
        </Link>
      </p>

      <p className="mt-4 text-sm text-[color:var(--color-muted)]">
        {strings.signin.signupPrompt}{" "}
        <Link href="/inscription" className="text-[color:var(--color-accent)] hover:underline">
          {strings.signin.signupLink}
        </Link>
      </p>
    </main>
  );
}
