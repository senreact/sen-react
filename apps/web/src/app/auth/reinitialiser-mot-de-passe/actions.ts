"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { ResetPasswordSchema, type AuthFormState } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Completes the password-reset flow.
 *
 * The user lands here after clicking the email link — the `/auth/callback`
 * route has already exchanged the one-time code for a recovery session, so
 * the Supabase client here is authenticated. `updateUser` replaces the
 * password for that session's user.
 */
export async function resetPasswordAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = ResetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Validation échouée",
    };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    console.error("[resetPasswordAction]", error);
    return {
      status: "error",
      message:
        "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré — demandez un nouveau lien depuis la page de connexion.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/connexion?message=password-updated");
}
