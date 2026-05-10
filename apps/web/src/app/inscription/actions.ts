"use server";

import { headers } from "next/headers";

import { type AuthFormState, SignUpSchema } from "@/lib/auth";
import { getAuthStrings } from "@/lib/cms";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Sign-up server action. Wrapped in try/catch end-to-end because Next.js
 * server actions that throw an uncaught exception leave useActionState
 * frozen at the previous state — the form silently does nothing instead
 * of showing the generic error.
 *
 * Error / success messages come from the auth-strings CMS global so
 * REACT can refine wording without a code change. Errors stay generic
 * per OWASP user-enumeration guidance — don't leak whether the email
 * exists, password was weak, etc.
 */
export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const strings = await getAuthStrings();

  const parsed = SignUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? strings.errors.validationFailed,
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
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    if (error) {
      return { status: "error", message: strings.errors.signupFailed };
    }

    return { status: "success", message: strings.errors.signupSuccess };
  } catch (err) {
    console.error("[signUpAction] unexpected error:", err);
    return { status: "error", message: strings.errors.signupFailed };
  }
}
