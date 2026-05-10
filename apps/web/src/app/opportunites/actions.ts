"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabase } from "@/lib/supabase/server";

export interface SaveResult {
  status: "ok" | "unauthenticated" | "error";
  saved: boolean;
  message?: string;
}

/**
 * Toggle save state on an opportunity for the current user.
 *
 * Read first (idempotent UI signal), then INSERT or DELETE accordingly.
 * Both operations are scoped to the authenticated user via RLS — the
 * server-side Supabase client uses the user's session cookie and the
 * `auth.uid() = user_id` policy enforces ownership.
 *
 * Returns `unauthenticated` when no session exists (the button is
 * gated on auth at render time, so this is the after-session-expiry
 * recovery path rather than a normal flow).
 */
export async function toggleSavedOpportunity(slug: string): Promise<SaveResult> {
  if (!slug || typeof slug !== "string") {
    return { status: "error", saved: false, message: "Slug invalide." };
  }

  let supabase;
  try {
    supabase = await createServerSupabase();
  } catch (err) {
    console.error("[toggleSavedOpportunity] supabase client init failed:", err);
    return { status: "error", saved: false, message: "Impossible de contacter Supabase." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { status: "unauthenticated", saved: false };
  }

  const { data: existing, error: selectError } = await supabase
    .from("saved_opportunities")
    .select("opportunity_slug")
    .eq("user_id", user.id)
    .eq("opportunity_slug", slug)
    .maybeSingle();

  if (selectError) {
    console.error("[toggleSavedOpportunity] select failed:", selectError);
    return { status: "error", saved: false, message: "Lecture impossible. Réessayez." };
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from("saved_opportunities")
      .delete()
      .eq("user_id", user.id)
      .eq("opportunity_slug", slug);
    if (deleteError) {
      console.error("[toggleSavedOpportunity] delete failed:", deleteError);
      return { status: "error", saved: true, message: "Suppression impossible." };
    }
    revalidatePath("/mes-opportunites");
    return { status: "ok", saved: false };
  }

  const { error: insertError } = await supabase
    .from("saved_opportunities")
    .insert({ user_id: user.id, opportunity_slug: slug });
  if (insertError) {
    console.error("[toggleSavedOpportunity] insert failed:", insertError);
    return { status: "error", saved: false, message: "Enregistrement impossible." };
  }
  revalidatePath("/mes-opportunites");
  return { status: "ok", saved: true };
}

/**
 * Fetch the set of slugs saved by the current user. Returns an empty
 * Set when unauthenticated or on error so callers can branch on size
 * without try/catching.
 */
export async function listSavedOpportunitySlugs(): Promise<Set<string>> {
  let supabase;
  try {
    supabase = await createServerSupabase();
  } catch {
    return new Set();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await supabase
    .from("saved_opportunities")
    .select("opportunity_slug")
    .order("saved_at", { ascending: false });
  if (error || !data) return new Set();
  return new Set(data.map((row: { opportunity_slug: string }) => row.opportunity_slug));
}
