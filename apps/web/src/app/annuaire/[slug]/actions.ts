"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { resolveSlugToUserId } from "@/lib/reviews";
import { createServerSupabase } from "@/lib/supabase/server";

export interface ReviewActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

const ReviewSubmitSchema = z.object({
  slug: z.string().regex(/^[0-9a-f]{8}$/i),
  stars: z.coerce.number().int().min(1).max(5),
  comment: z
    .string()
    .max(2000)
    .or(z.literal(""))
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
});

/**
 * Submit (or update) a review on a profile. The (subject, reviewer)
 * pair UNIQUE constraint + ON CONFLICT lets the same form handle
 * "create new" and "edit existing" without separate paths.
 *
 * reviewer_display_name is snapshotted from the reviewer's own
 * user_profiles row at insert time. The denormalisation is the
 * simplest way to render the reviewer name on anon reads (joining
 * across user_profiles RLS would otherwise need service-role).
 */
export async function submitReviewAction(
  _prev: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const sb = await createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return {
      status: "error",
      message: "Vous devez être connecté pour publier un avis.",
    };
  }

  const parsed = ReviewSubmitSchema.safeParse({
    slug: formData.get("slug"),
    stars: formData.get("stars"),
    comment: formData.get("comment") ?? undefined,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Validation échouée.",
    };
  }

  const subjectUserId = await resolveSlugToUserId(parsed.data.slug);
  if (!subjectUserId) {
    return { status: "error", message: "Profil introuvable." };
  }
  if (subjectUserId === user.id) {
    return { status: "error", message: "Vous ne pouvez pas vous évaluer vous-même." };
  }

  // Reviewer's display_name from their own profile (RLS allows own-row).
  const { data: ownProfile } = await sb
    .from("user_profiles")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle<{ display_name: string }>();
  if (!ownProfile) {
    return {
      status: "error",
      message: "Veuillez d'abord compléter votre profil avant de publier un avis.",
    };
  }

  const { error } = await sb.from("profile_reviews").upsert(
    {
      subject_user_id: subjectUserId,
      reviewer_user_id: user.id,
      reviewer_display_name: ownProfile.display_name,
      stars: parsed.data.stars,
      comment: parsed.data.comment,
    },
    { onConflict: "subject_user_id,reviewer_user_id" },
  );

  if (error) {
    console.error("[submitReviewAction] upsert failed:", error);
    return { status: "error", message: "Impossible de publier l'avis. Réessayez." };
  }

  revalidatePath(`/annuaire/${parsed.data.slug}`);
  return { status: "success", message: "Avis publié. Merci !" };
}

/**
 * Delete the requester's own review on a subject profile. Returns
 * idle/no-op when there's nothing to delete (rather than an error)
 * so the UX stays simple.
 */
export async function deleteOwnReviewAction(
  _prev: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const sb = await createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return { status: "error", message: "Connexion requise." };
  }
  const slugRaw = formData.get("slug");
  const slug = typeof slugRaw === "string" ? slugRaw : "";
  if (!/^[0-9a-f]{8}$/i.test(slug)) {
    return { status: "error", message: "Slug invalide." };
  }
  const subjectUserId = await resolveSlugToUserId(slug);
  if (!subjectUserId) {
    return { status: "error", message: "Profil introuvable." };
  }

  const { error } = await sb
    .from("profile_reviews")
    .delete()
    .eq("subject_user_id", subjectUserId)
    .eq("reviewer_user_id", user.id);

  if (error) {
    console.error("[deleteOwnReviewAction] delete failed:", error);
    return { status: "error", message: "Suppression impossible." };
  }

  revalidatePath(`/annuaire/${slug}`);
  return { status: "success", message: "Avis supprimé." };
}
