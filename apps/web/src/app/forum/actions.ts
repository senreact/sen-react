"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ForumReplySchema, ForumThreadSchema, createReply, createThread } from "@/lib/forum";
import { getOwnMentorProfile } from "@/lib/mentors";
import { createServerSupabase } from "@/lib/supabase/server";

export interface ForumActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

async function resolveAuthorName(userId: string, email: string): Promise<string> {
  const profile = await getOwnMentorProfile(userId);
  if (profile?.display_name) return profile.display_name;
  return email.split("@")[0] ?? "Membre";
}

export async function createThreadAction(
  _prev: ForumActionState,
  formData: FormData,
): Promise<ForumActionState> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/forum/creer");

  const raw = {
    sector: formData.get("sector") as string,
    title: formData.get("title") as string,
    body: formData.get("body") as string,
  };

  const parsed = ForumThreadSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Données invalides.";
    return { status: "error", message: msg };
  }

  const authorName = await resolveAuthorName(user.id, user.email ?? "");
  const { id, error } = await createThread(user.id, authorName, parsed.data);
  if (error ?? !id) return { status: "error", message: error ?? "Erreur inattendue." };

  revalidatePath(`/forum/${parsed.data.sector}`);
  redirect(`/forum/${parsed.data.sector}/${id}`);
}

export async function createReplyAction(
  threadId: string,
  sector: string,
  _prev: ForumActionState,
  formData: FormData,
): Promise<ForumActionState> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/connexion?returnTo=/forum/${sector}/${threadId}`);

  const raw = { body: formData.get("body") as string };
  const parsed = ForumReplySchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Données invalides.";
    return { status: "error", message: msg };
  }

  const authorName = await resolveAuthorName(user.id, user.email ?? "");
  const { error } = await createReply(user.id, authorName, threadId, parsed.data);
  if (error) return { status: "error", message: error };

  revalidatePath(`/forum/${sector}/${threadId}`);
  return { status: "success" };
}
