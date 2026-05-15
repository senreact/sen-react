import { z } from "zod";

import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceRoleSupabase } from "@/lib/supabase/service";

export interface MentorProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  sectors: string[];
  expertise: string[];
  region: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_wa: string | null;
  linkedin_url: string | null;
  is_active: boolean;
  created_at: string;
}

export const MentorProfileSchema = z.object({
  display_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères.").max(100),
  bio: z.string().max(500, "La biographie ne peut pas dépasser 500 caractères.").optional(),
  sectors: z.array(z.string()).min(1, "Sélectionnez au moins un secteur."),
  expertise: z.array(z.string()).max(10),
  region: z.string().max(100).optional(),
  contact_email: z.string().email("Email invalide.").optional().or(z.literal("")),
  contact_phone: z.string().max(30).optional(),
  contact_wa: z.string().max(30).optional(),
  linkedin_url: z.string().url("URL LinkedIn invalide.").optional().or(z.literal("")),
});

export type MentorProfileInput = z.infer<typeof MentorProfileSchema>;

export async function listActiveMentors(): Promise<MentorProfile[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("mentor_profiles")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .returns<MentorProfile[]>();

  if (error) {
    console.error("[listActiveMentors] query failed:", error);
    return [];
  }
  return data ?? [];
}

export async function getOwnMentorProfile(userId: string): Promise<MentorProfile | null> {
  const sb = createServiceRoleSupabase();
  const { data, error } = await sb
    .from("mentor_profiles")
    .select("*")
    .eq("user_id", userId)
    .returns<MentorProfile[]>()
    .single();

  if (error || !data) return null;
  return data;
}

export async function upsertMentorProfile(
  userId: string,
  input: MentorProfileInput,
): Promise<{ error: string | null }> {
  const sb = createServiceRoleSupabase();
  const { error } = await sb.from("mentor_profiles").upsert(
    {
      user_id: userId,
      display_name: input.display_name,
      bio: input.bio || null,
      sectors: input.sectors,
      expertise: input.expertise,
      region: input.region || null,
      contact_email: input.contact_email || null,
      contact_phone: input.contact_phone || null,
      contact_wa: input.contact_wa || null,
      linkedin_url: input.linkedin_url || null,
      is_active: true,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("[upsertMentorProfile] failed:", error);
    return { error: "Impossible d'enregistrer le profil." };
  }
  return { error: null };
}
