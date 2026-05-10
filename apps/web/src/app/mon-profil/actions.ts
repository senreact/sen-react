"use server";

import { revalidatePath } from "next/cache";

import { type AuthFormState, ProfileUpdateSchema } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Update the authenticated user's own profile. RLS allows the row
 * UPDATE; a DB trigger blocks any change to verification_status /
 * verified_at / verified_by / verification_notes / profile_type from
 * non-service-role callers — so even if the form sneaks one in, the
 * DB rejects it cleanly.
 *
 * Fields we *intentionally do not* pull from formData:
 *   - profile_type (immutable post-signup)
 *   - verification_* (admin-only)
 *   - email / password (Supabase auth flow handles those separately)
 *   - user_id (PK, derived from session)
 */
export async function updateProfileAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Vous devez être connecté pour modifier votre profil." };
  }

  const parsed = ProfileUpdateSchema.safeParse({
    display_name: formData.get("display_name"),
    sector_slug: formData.get("sector_slug") ?? undefined,
    region: formData.get("region") ?? undefined,
    photo_url: formData.get("photo_url") ?? undefined,
    summary: formData.get("summary") ?? undefined,
    phone: formData.get("phone") ?? undefined,
    email_public: formData.get("email_public") ?? undefined,
    organisation_name: formData.get("organisation_name") ?? undefined,
    organisation_legal_form: formData.get("organisation_legal_form") ?? undefined,
    organisation_size: formData.get("organisation_size") ?? undefined,
    ministry_name: formData.get("ministry_name") ?? undefined,
    government_role: formData.get("government_role") ?? undefined,
    partner_org_name: formData.get("partner_org_name") ?? undefined,
    is_minor: formData.get("is_minor") ?? undefined,
    parental_consent: formData.get("parental_consent") ?? undefined,
    parent_email: formData.get("parent_email") ?? undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Validation échouée.",
    };
  }

  const { error } = await supabase.from("user_profiles").update(parsed.data).eq("user_id", user.id);

  if (error) {
    console.error("[updateProfileAction] update failed:", error);
    return { status: "error", message: "Mise à jour impossible. Réessayez dans un instant." };
  }

  // Re-render the page so the new values show.
  revalidatePath("/mon-profil");
  return { status: "success", message: "Profil mis à jour." };
}
