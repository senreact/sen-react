"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { type AuthFormState, SignInSchema } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Sign-in server action.
 *
 * Two distinct error sources kept separate:
 *
 * 1. **Real failures** (bad credentials, network, env, cookies flake) —
 *    must return a typed `AuthFormState` so useActionState updates and
 *    the form shows the FR error. A server action that throws leaves
 *    useActionState frozen at the previous state and the form silently
 *    does nothing.
 *
 * 2. **`redirect()` control-flow exception** — Next.js's `redirect()`
 *    throws a special NEXT_REDIRECT to signal the framework to
 *    navigate. Wrapping `redirect()` in try/catch swallows that signal
 *    and the user stays on the form.
 *
 * The fix is to keep the supabase call inside try/catch, then place
 * `redirect()` AFTER the try/catch block — only reached on success.
 */
export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Validation échouée",
    };
  }

  let supabaseError: { message: string } | null = null;
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    supabaseError = error;
  } catch (err) {
    // Anything thrown — network failure, missing env, cookies flake.
    // Log for postmortem and return the generic message so the user
    // can retry.
    console.error("[signInAction] unexpected error:", err);
    return {
      status: "error",
      message: "Identifiants invalides ou compte non confirmé.",
    };
  }

  if (supabaseError) {
    // Generic message is intentional — we don't expose whether the
    // email or the password was wrong, per OWASP user-enumeration
    // guidance.
    return {
      status: "error",
      message: "Identifiants invalides ou compte non confirmé.",
    };
  }

  // Success path: outside try/catch so redirect()'s NEXT_REDIRECT
  // exception propagates to Next's framework handler.
  revalidatePath("/", "layout");
  redirect("/");
}
