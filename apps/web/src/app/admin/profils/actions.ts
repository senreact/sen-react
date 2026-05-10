"use server";

import { revalidatePath } from "next/cache";

import { requireAdminProfile } from "@/lib/admin";
import { createServiceRoleSupabase } from "@/lib/supabase/service";

export interface VerificationActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

/**
 * Approve a pending profile. RLS allows the admin to read pending rows
 * (own-row policy would normally block this — we use service-role so
 * we can both read other users' profiles and write the verification
 * fields the regular-user UPDATE trigger blocks).
 *
 * Sets verification_status='verified', verified_at=now(), verified_by=
 * admin's auth.users id. Notes optional.
 */
export async function approveProfileAction(
  _prev: VerificationActionState,
  formData: FormData,
): Promise<VerificationActionState> {
  const { user } = await requireAdminProfile("/admin/profils");
  const userIdRaw = formData.get("user_id");
  const notesRaw = formData.get("verification_notes");
  const userId = typeof userIdRaw === "string" ? userIdRaw : "";
  const notes = (typeof notesRaw === "string" ? notesRaw : "").trim();
  if (!userId) return { status: "error", message: "user_id manquant." };

  const sb = createServiceRoleSupabase();
  const { error } = await sb
    .from("user_profiles")
    .update({
      verification_status: "verified",
      verified_at: new Date().toISOString(),
      verified_by: user.id,
      verification_notes: notes.length > 0 ? notes : null,
    })
    .eq("user_id", userId);

  if (error) {
    console.error("[approveProfileAction] update failed:", error);
    return { status: "error", message: "Échec de l'approbation." };
  }

  revalidatePath("/admin/profils");
  return { status: "success", message: "Profil approuvé." };
}

/**
 * Reject a pending profile. Requires a notes field so the admin
 * explains the reason; the user will see this in their /mon-profil
 * verification badge.
 */
export async function rejectProfileAction(
  _prev: VerificationActionState,
  formData: FormData,
): Promise<VerificationActionState> {
  const { user } = await requireAdminProfile("/admin/profils");
  const userIdRaw = formData.get("user_id");
  const notesRaw = formData.get("verification_notes");
  const userId = typeof userIdRaw === "string" ? userIdRaw : "";
  const notes = (typeof notesRaw === "string" ? notesRaw : "").trim();
  if (!userId) return { status: "error", message: "user_id manquant." };
  if (notes.length === 0) {
    return { status: "error", message: "Motif de refus requis." };
  }

  const sb = createServiceRoleSupabase();
  const { error } = await sb
    .from("user_profiles")
    .update({
      verification_status: "rejected",
      verified_at: new Date().toISOString(),
      verified_by: user.id,
      verification_notes: notes,
    })
    .eq("user_id", userId);

  if (error) {
    console.error("[rejectProfileAction] update failed:", error);
    return { status: "error", message: "Échec du refus." };
  }

  revalidatePath("/admin/profils");
  return { status: "success", message: "Profil refusé." };
}
