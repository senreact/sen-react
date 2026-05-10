import { redirect } from "next/navigation";

import { isProfileTypeSlug } from "@sen-react/shared";

import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Server-side helper used by every /admin/* route to enforce:
 *   1. The visitor is authenticated.
 *   2. Their user_profiles row exists.
 *   3. profile_type === 'admin'.
 *
 * Unauthenticated → redirect to /connexion?returnTo=…
 * Authenticated but not admin → 404 via Next's notFound() equivalent
 *   (we throw to surface a redirect to home; admin URLs aren't meant to
 *   leak their existence to non-admins).
 *
 * Returns { user, profile } when access is granted so callers can avoid
 * a second supabase round-trip.
 */
export async function requireAdminProfile(returnTo: string): Promise<{
  user: { id: string; email: string | null };
  profile: { display_name: string };
}> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/connexion?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("profile_type, display_name")
    .eq("user_id", user.id)
    .maybeSingle<{ profile_type: string; display_name: string }>();

  if (error || !profile || !isProfileTypeSlug(profile.profile_type)) {
    redirect("/");
  }
  if (profile.profile_type !== "admin") {
    redirect("/");
  }
  return {
    user: { id: user.id, email: user.email ?? null },
    profile: { display_name: profile.display_name },
  };
}
