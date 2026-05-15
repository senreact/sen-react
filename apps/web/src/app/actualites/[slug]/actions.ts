"use server";

import { revalidatePath } from "next/cache";

import { CommentBodySchema } from "@/lib/comments";
import { createServerSupabase } from "@/lib/supabase/server";

export interface CommentActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitCommentAction(
  _prev: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Vous devez être connecté pour commenter." };
  }

  const articleSlug = formData.get("article_slug");
  const bodyRaw = formData.get("body");

  if (typeof articleSlug !== "string" || !articleSlug) {
    return { status: "error", message: "Article introuvable." };
  }

  const parsed = CommentBodySchema.safeParse(bodyRaw);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0]?.message ?? "Commentaire invalide." };
  }

  const { error } = await supabase.from("article_comments").insert({
    author_id: user.id,
    article_slug: articleSlug,
    body: parsed.data,
  });

  if (error) {
    console.error("[submitCommentAction] insert failed:", error);
    return { status: "error", message: "Échec de l'envoi. Veuillez réessayer." };
  }

  revalidatePath(`/actualites/${articleSlug}`);
  return { status: "success" };
}
