import { z } from "zod";

import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceRoleSupabase } from "@/lib/supabase/service";

export interface ArticleComment {
  id: string;
  author_id: string;
  article_slug: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  author_display_name: string | null;
}

export interface PendingComment extends ArticleComment {
  moderated_by: string | null;
  moderated_at: string | null;
}

export const CommentBodySchema = z
  .string()
  .min(1, "Le commentaire ne peut pas être vide.")
  .max(2000, "Le commentaire ne peut pas dépasser 2 000 caractères.");

interface CommentRow {
  id: string;
  author_id: string;
  article_slug: string;
  body: string;
  status: string;
  created_at: string;
  user_profiles: { display_name: string } | { display_name: string }[] | null;
}

interface PendingCommentRow extends CommentRow {
  moderated_by: string | null;
  moderated_at: string | null;
}

function extractDisplayName(profiles: CommentRow["user_profiles"]): string | null {
  if (!profiles) return null;
  if (Array.isArray(profiles)) return profiles[0]?.display_name ?? null;
  return profiles.display_name ?? null;
}

export async function listApprovedComments(articleSlug: string): Promise<ArticleComment[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("article_comments")
    .select(
      "id, author_id, article_slug, body, status, created_at, user_profiles!author_id(display_name)",
    )
    .eq("article_slug", articleSlug)
    .eq("status", "approved")
    .order("created_at", { ascending: true })
    .returns<CommentRow[]>();

  if (error) {
    console.error("[listApprovedComments] query failed:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    author_id: row.author_id,
    article_slug: row.article_slug,
    body: row.body,
    status: row.status as ArticleComment["status"],
    created_at: row.created_at,
    author_display_name: extractDisplayName(row.user_profiles),
  }));
}

export async function listPendingComments(): Promise<PendingComment[]> {
  const sb = createServiceRoleSupabase();
  const { data, error } = await sb
    .from("article_comments")
    .select(
      "id, author_id, article_slug, body, status, created_at, moderated_by, moderated_at, user_profiles!author_id(display_name)",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .returns<PendingCommentRow[]>();

  if (error) {
    console.error("[listPendingComments] query failed:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    author_id: row.author_id,
    article_slug: row.article_slug,
    body: row.body,
    status: row.status as ArticleComment["status"],
    created_at: row.created_at,
    moderated_by: row.moderated_by,
    moderated_at: row.moderated_at,
    author_display_name: extractDisplayName(row.user_profiles),
  }));
}

export async function approveComment(
  commentId: string,
  adminId: string,
): Promise<{ error: string | null }> {
  const sb = createServiceRoleSupabase();
  const { error } = await sb
    .from("article_comments")
    .update({ status: "approved", moderated_by: adminId, moderated_at: new Date().toISOString() })
    .eq("id", commentId)
    .eq("status", "pending");
  if (error) {
    console.error("[approveComment] failed:", error);
    return { error: "Échec de l'approbation." };
  }
  return { error: null };
}

export async function rejectComment(
  commentId: string,
  adminId: string,
): Promise<{ error: string | null }> {
  const sb = createServiceRoleSupabase();
  const { error } = await sb
    .from("article_comments")
    .update({ status: "rejected", moderated_by: adminId, moderated_at: new Date().toISOString() })
    .eq("id", commentId)
    .eq("status", "pending");
  if (error) {
    console.error("[rejectComment] failed:", error);
    return { error: "Échec du refus." };
  }
  return { error: null };
}
