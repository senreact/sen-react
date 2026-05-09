"use server";

import { headers } from "next/headers";

import { type AuthFormState, SignUpSchema } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = SignUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Validation échouée",
    };
  }

  // Build the email-confirmation redirect URL from the request's own origin
  // so it works across localhost / preview / prod without a hardcoded URL.
  const requestHeaders = await headers();
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) {
    // Common cases: email already registered, password too weak. Don't
    // leak which one — return a single generic error.
    return {
      status: "error",
      message: "Inscription impossible. Vérifiez vos informations et réessayez.",
    };
  }

  return {
    status: "success",
    message:
      "Compte créé. Un e-mail de confirmation a été envoyé. Cliquez sur le lien pour activer votre compte.",
  };
}
