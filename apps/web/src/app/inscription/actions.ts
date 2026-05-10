"use server";

import { headers } from "next/headers";

import { initialVerificationStatus, type ProfileTypeSlug } from "@sen-react/shared";

import { type AuthFormState, SignUpSchema, type SignUpInput } from "@/lib/auth";
import { getAuthStrings } from "@/lib/cms";
import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceRoleSupabase } from "@/lib/supabase/service";

/**
 * Sign-up server action.
 *
 * Two-step write:
 *   1. supabase.auth.signUp — creates auth.users row + sends confirmation
 *      email. RLS denies anonymous inserts into user_profiles, so we
 *      can't use the same anon-key client for step 2.
 *   2. service-role insert into user_profiles using the new user's id.
 *      Verification status is derived from profile_type (entrepreneur →
 *      auto_verified, others → pending — manual REACT review).
 *
 * If step 2 fails after step 1 succeeded, the auth user is orphaned (no
 * matching profile). We attempt a best-effort rollback via service-role
 * admin.deleteUser. Failure logs but doesn't surface — the user will
 * just hit a "complete your profile" prompt on next login.
 *
 * Error / success messages come from the auth-strings CMS global. Errors
 * stay generic per OWASP user-enumeration guidance.
 */
export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const strings = await getAuthStrings();

  // Pull every field by name; Zod's discriminated-union picks the right
  // branch on `profile_type`.
  const rawInput = {
    email: formData.get("email"),
    password: formData.get("password"),
    profile_type: formData.get("profile_type"),
    display_name: formData.get("display_name"),
    organisation_name: formData.get("organisation_name") ?? undefined,
    ministry_name: formData.get("ministry_name") ?? undefined,
    government_role: formData.get("government_role") ?? undefined,
    partner_org_name: formData.get("partner_org_name") ?? undefined,
    is_minor: formData.get("is_minor") ?? undefined,
    parental_consent: formData.get("parental_consent") ?? undefined,
    parent_email: formData.get("parent_email") ?? undefined,
  };

  const parsed = SignUpSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? strings.errors.validationFailed,
    };
  }
  const input = parsed.data;

  try {
    const requestHeaders = await headers();
    const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
    const host = requestHeaders.get("host") ?? "localhost:3000";
    const origin = `${proto}://${host}`;

    const supabase = await createServerSupabase();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });

    if (signUpError || !signUpData.user) {
      return { status: "error", message: strings.errors.signupFailed };
    }

    const userId = signUpData.user.id;
    const profileRow = buildProfileRow(userId, input);

    const serviceRole = createServiceRoleSupabase();
    const { error: profileError } = await serviceRole.from("user_profiles").insert(profileRow);

    if (profileError) {
      console.error("[signUpAction] profile insert failed:", profileError);
      // Best-effort rollback. Service-role admin API; failure logs only.
      await serviceRole.auth.admin.deleteUser(userId).catch((err) => {
        console.error("[signUpAction] orphan-user rollback failed:", err);
      });
      return { status: "error", message: strings.errors.signupFailed };
    }

    const successMessage =
      input.profile_type === "entrepreneur"
        ? strings.errors.signupSuccess
        : "Compte créé. Un e-mail de confirmation a été envoyé. " +
          "Votre profil sera vérifié par l'équipe REACT — généralement sous 48 heures.";

    return { status: "success", message: successMessage };
  } catch (err) {
    console.error("[signUpAction] unexpected error:", err);
    return { status: "error", message: strings.errors.signupFailed };
  }
}

function buildProfileRow(userId: string, input: SignUpInput): Record<string, unknown> {
  const profileType: ProfileTypeSlug = input.profile_type;
  const base = {
    user_id: userId,
    profile_type: profileType,
    display_name: input.display_name,
    verification_status: initialVerificationStatus(profileType),
  };

  if (input.profile_type === "entrepreneur") {
    return {
      ...base,
      is_minor: input.is_minor,
      parental_consent: input.is_minor ? input.parental_consent : null,
      parent_email: input.is_minor ? input.parent_email : null,
    };
  }
  if (input.profile_type === "organisation") {
    return { ...base, organisation_name: input.organisation_name };
  }
  if (input.profile_type === "government") {
    return {
      ...base,
      ministry_name: input.ministry_name,
      government_role: input.government_role ?? null,
    };
  }
  // partner is the only remaining branch in the discriminated union.
  return { ...base, partner_org_name: input.partner_org_name };
}
