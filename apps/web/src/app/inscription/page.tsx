import type { Metadata } from "next";
import Link from "next/link";

import { signUpAction } from "./actions";
import { SignUpForm } from "@/components/SignUpForm";
import { getAuthStrings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Inscription — Sen React",
  description:
    "Créez votre compte Sen React pour rejoindre le réseau d'entrepreneurs sénégalais et africains.",
};

export default async function SignUpPage() {
  const strings = await getAuthStrings();
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">{strings.signup.pageTitle}</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          {strings.signup.leadParagraph}
        </p>
      </header>

      <SignUpForm
        action={signUpAction}
        submitLabel={strings.signup.submitLabel}
        passwordHint={strings.signup.passwordHint}
        emailLabel={strings.form.emailLabel}
        passwordLabel={strings.form.passwordLabel}
        pendingLabel={strings.form.pendingLabel}
      />

      <p className="mt-6 text-sm text-[color:var(--color-muted)]">
        {strings.signup.signinPrompt}{" "}
        <Link href="/connexion" className="text-[color:var(--color-accent)] hover:underline">
          {strings.signup.signinLink}
        </Link>
      </p>
    </main>
  );
}
