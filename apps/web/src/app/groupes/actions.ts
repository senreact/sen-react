"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { GroupSchema, createGroup, joinGroup, leaveGroup } from "@/lib/groups";
import { createServerSupabase } from "@/lib/supabase/server";

export interface GroupActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function createGroupAction(
  _prev: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/groupes/creer");

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    group_type: formData.get("group_type") as string,
    tag: formData.get("tag") as string,
  };

  const parsed = GroupSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Données invalides.";
    return { status: "error", message: msg };
  }

  const { id, error } = await createGroup(user.id, parsed.data);
  if (error ?? !id) return { status: "error", message: error ?? "Erreur inattendue." };

  revalidatePath("/groupes");
  redirect(`/groupes/${id}`);
}

export async function joinGroupAction(groupId: string): Promise<GroupActionState> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/connexion?returnTo=/groupes/${groupId}`);

  const { error } = await joinGroup(groupId, user.id);
  if (error) return { status: "error", message: error };

  revalidatePath(`/groupes/${groupId}`);
  revalidatePath("/groupes");
  return { status: "success" };
}

export async function leaveGroupAction(groupId: string): Promise<GroupActionState> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/connexion?returnTo=/groupes/${groupId}`);

  const { error } = await leaveGroup(groupId, user.id);
  if (error) return { status: "error", message: error };

  revalidatePath(`/groupes/${groupId}`);
  revalidatePath("/groupes");
  return { status: "success" };
}
