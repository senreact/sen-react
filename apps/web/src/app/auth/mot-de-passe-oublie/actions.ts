"use server";

import { headers } from "next/headers";

import { ForgotPasswordSchema, type AuthFormState } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Triggers a Supabase password-reset email.
 *
 * Per OWASP user-enumeration guidance, we always return a success
 * message regardless of whether the email is registered — so an
 * attacker cannot probe which addresses have accounts.
 */
export async function forgotPasswordAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = ForgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Adresse e-mail invalide",
    };
  }

  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const supabase = await createServerSupabase();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/auth/reinitialiser-mot-de-passe`,
  });

  return {
    status: "success",
    message:
      "Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé. Vérifiez votre boîte de réception (et vos courriers indésirables).",
  };
}
