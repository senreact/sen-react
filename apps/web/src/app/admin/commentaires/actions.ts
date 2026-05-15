"use server";

import { revalidatePath } from "next/cache";

import { requireAdminProfile } from "@/lib/admin";
import { approveComment, rejectComment } from "@/lib/comments";

export interface CommentModerationState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function approveCommentAction(
  _prev: CommentModerationState,
  formData: FormData,
): Promise<CommentModerationState> {
  const { user } = await requireAdminProfile("/admin/commentaires");
  const commentId = formData.get("comment_id");
  if (typeof commentId !== "string" || !commentId) {
    return { status: "error", message: "ID manquant." };
  }
  const { error } = await approveComment(commentId, user.id);
  if (error) return { status: "error", message: error };
  revalidatePath("/admin/commentaires");
  return { status: "success", message: "Commentaire approuvé." };
}

export async function rejectCommentAction(
  _prev: CommentModerationState,
  formData: FormData,
): Promise<CommentModerationState> {
  const { user } = await requireAdminProfile("/admin/commentaires");
  const commentId = formData.get("comment_id");
  if (typeof commentId !== "string" || !commentId) {
    return { status: "error", message: "ID manquant." };
  }
  const { error } = await rejectComment(commentId, user.id);
  if (error) return { status: "error", message: error };
  revalidatePath("/admin/commentaires");
  return { status: "success", message: "Commentaire refusé." };
}
