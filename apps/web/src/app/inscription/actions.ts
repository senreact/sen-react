"use server";

import { headers } from "next/headers";

import { type AuthFormState, SignUpSchema } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Sign-up server action. Wrapped in try/catch end-to-end because Next.js
 * server actions that throw an uncaught exception leave useActionState
 * frozen at the previous state — the form silently does nothing instead
 * of showing the generic error. This breaks the user's recovery path.
 *
 * Specific failure modes covered:
 * - Zod rejects format (returns the field-specific FR message)
 * - Supabase rejects the email (e.g. invalid TLD, already registered, weak
 *   password, rate-limited) — returns the generic FR error per OWASP
 *   user-enumeration guidance
 * - Anything else throws (network, env missing, headers/cookies flake) —
 *   caught and reported as the generic FR error rather than swallowed
 */
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

  try {
    // Build the email-confirmation redirect URL from the request's own
    // origin so it works across localhost / preview / prod without a
    // hardcoded URL.
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
      // Common cases: email already registered, invalid TLD, password too
      // weak, rate-limited. Don't leak which one — single generic message.
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
  } catch (err) {
    // Anything thrown — network failure, missing env, cookies flake.
    // Log for postmortem (visible in Vercel function logs) and return
    // the generic message so the user can retry.
    console.error("[signUpAction] unexpected error:", err);
    return {
      status: "error",
      message: "Inscription impossible. Vérifiez vos informations et réessayez.",
    };
  }
}
