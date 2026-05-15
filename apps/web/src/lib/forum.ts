import { z } from "zod";

import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceRoleSupabase } from "@/lib/supabase/service";

export interface ForumThread {
  id: string;
  user_id: string;
  sector: string;
  title: string;
  body: string;
  author_name: string;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  thread_id: string;
  user_id: string;
  body: string;
  author_name: string;
  created_at: string;
}

export const ForumThreadSchema = z.object({
  sector: z.string().min(1, "Sélectionnez un secteur."),
  title: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères.")
    .max(150, "Le titre ne peut pas dépasser 150 caractères."),
  body: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères.")
    .max(5000, "Le message ne peut pas dépasser 5 000 caractères."),
});

export const ForumReplySchema = z.object({
  body: z
    .string()
    .min(5, "La réponse doit contenir au moins 5 caractères.")
    .max(2000, "La réponse ne peut pas dépasser 2 000 caractères."),
});

export type ForumThreadInput = z.infer<typeof ForumThreadSchema>;
export type ForumReplyInput = z.infer<typeof ForumReplySchema>;

export async function listThreadsBySector(sector: string): Promise<ForumThread[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("forum_threads")
    .select("*")
    .eq("sector", sector)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false })
    .returns<ForumThread[]>();

  if (error) {
    console.error("[listThreadsBySector] failed:", error);
    return [];
  }
  return data ?? [];
}

export async function getThread(id: string): Promise<ForumThread | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("forum_threads")
    .select("*")
    .eq("id", id)
    .returns<ForumThread[]>()
    .single();

  if (error || !data) return null;
  return data;
}

export async function listReplies(threadId: string): Promise<ForumReply[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("forum_replies")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .returns<ForumReply[]>();

  if (error) {
    console.error("[listReplies] failed:", error);
    return [];
  }
  return data ?? [];
}

export async function countThreadsBySector(): Promise<Record<string, number>> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("forum_threads").select("sector");

  if (error || !data) return {};
  const counts: Record<string, number> = {};
  for (const row of data as { sector: string }[]) {
    counts[row.sector] = (counts[row.sector] ?? 0) + 1;
  }
  return counts;
}

export async function createThread(
  userId: string,
  authorName: string,
  input: ForumThreadInput,
): Promise<{ id: string | null; error: string | null }> {
  const sb = createServiceRoleSupabase();
  const { data, error } = await sb
    .from("forum_threads")
    .insert({
      user_id: userId,
      author_name: authorName,
      sector: input.sector,
      title: input.title,
      body: input.body,
    })
    .select("id")
    .returns<{ id: string }[]>()
    .single();

  if (error || !data) {
    console.error("[createThread] failed:", error);
    return { id: null, error: "Impossible de créer la discussion." };
  }
  return { id: data.id, error: null };
}

export async function createReply(
  userId: string,
  authorName: string,
  threadId: string,
  input: ForumReplyInput,
): Promise<{ error: string | null }> {
  const sb = createServiceRoleSupabase();
  const { error } = await sb.from("forum_replies").insert({
    thread_id: threadId,
    user_id: userId,
    author_name: authorName,
    body: input.body,
  });

  if (error) {
    console.error("[createReply] failed:", error);
    return { error: "Impossible d'envoyer la réponse." };
  }
  return { error: null };
}
