import { z } from "zod";

import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceRoleSupabase } from "@/lib/supabase/service";

export type { GroupType } from "./groups-constants";
export { GROUP_TYPES } from "./groups-constants";

export interface CommunityGroup {
  id: string;
  created_by: string;
  name: string;
  description: string | null;
  group_type: "region" | "sector" | "theme";
  tag: string;
  is_public: boolean;
  member_count: number;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "member" | "admin";
  joined_at: string;
}

export const GroupSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères.")
    .max(100, "Le nom ne peut pas dépasser 100 caractères."),
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères.")
    .optional(),
  group_type: z.enum(["region", "sector", "theme"], {
    errorMap: () => ({ message: "Type de groupe invalide." }),
  }),
  tag: z
    .string()
    .min(1, "Le tag est requis.")
    .max(100, "Le tag ne peut pas dépasser 100 caractères."),
});

export type GroupInput = z.infer<typeof GroupSchema>;

export async function listGroups(): Promise<CommunityGroup[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("community_groups")
    .select("*")
    .eq("is_public", true)
    .order("member_count", { ascending: false })
    .returns<CommunityGroup[]>();

  if (error) {
    console.error("[listGroups] failed:", error);
    return [];
  }
  return data ?? [];
}

export async function getGroup(id: string): Promise<CommunityGroup | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("community_groups")
    .select("*")
    .eq("id", id)
    .returns<CommunityGroup[]>()
    .single();

  if (error || !data) return null;
  return data;
}

export async function listGroupMembers(groupId: string): Promise<GroupMember[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true })
    .returns<GroupMember[]>();

  if (error) {
    console.error("[listGroupMembers] failed:", error);
    return [];
  }
  return data ?? [];
}

export async function isMember(groupId: string, userId: string): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .maybeSingle();

  return Boolean(data);
}

export async function createGroup(
  userId: string,
  input: GroupInput,
): Promise<{ id: string | null; error: string | null }> {
  const sb = createServiceRoleSupabase();

  const { data, error } = await sb
    .from("community_groups")
    .insert({
      created_by: userId,
      name: input.name,
      description: input.description || null,
      group_type: input.group_type,
      tag: input.tag,
    })
    .select("id")
    .returns<{ id: string }[]>()
    .single();

  if (error || !data) {
    console.error("[createGroup] failed:", error);
    return { id: null, error: "Impossible de créer le groupe." };
  }

  // Creator automatically joins as admin
  await sb.from("group_members").insert({
    group_id: data.id,
    user_id: userId,
    role: "admin",
  });

  return { id: data.id, error: null };
}

export async function joinGroup(
  groupId: string,
  userId: string,
): Promise<{ error: string | null }> {
  const sb = createServiceRoleSupabase();
  const { error } = await sb.from("group_members").insert({
    group_id: groupId,
    user_id: userId,
    role: "member",
  });

  if (error) {
    if (error.code === "23505") return { error: null }; // already a member
    console.error("[joinGroup] failed:", error);
    return { error: "Impossible de rejoindre le groupe." };
  }
  return { error: null };
}

export async function leaveGroup(
  groupId: string,
  userId: string,
): Promise<{ error: string | null }> {
  const sb = createServiceRoleSupabase();
  const { error } = await sb
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);

  if (error) {
    console.error("[leaveGroup] failed:", error);
    return { error: "Impossible de quitter le groupe." };
  }
  return { error: null };
}
