"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { type AuthFormState, SignInSchema } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

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

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    // Map Supabase's English errors to FR. Anything we don't have a
    // specific translation for becomes the generic "identifiants invalides"
    // (intentional — we don't expose whether the email or the password
    // was wrong, per OWASP user-enumeration guidance).
    return {
      status: "error",
      message: "Identifiants invalides ou compte non confirmé.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
