"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { MentorProfileSchema, upsertMentorProfile } from "@/lib/mentors";
import { createServerSupabase } from "@/lib/supabase/server";

export interface MentorActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function saveMentorProfileAction(
  _prev: MentorActionState,
  formData: FormData,
): Promise<MentorActionState> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion?returnTo=/mentorat/devenir-mentor");
  }

  const raw = {
    display_name: formData.get("display_name") as string,
    bio: (formData.get("bio") as string) || undefined,
    sectors: formData.getAll("sectors") as string[],
    expertise: ((formData.get("expertise") as string) || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    region: (formData.get("region") as string) || undefined,
    contact_email: (formData.get("contact_email") as string) || undefined,
    contact_phone: (formData.get("contact_phone") as string) || undefined,
    contact_wa: (formData.get("contact_wa") as string) || undefined,
    linkedin_url: (formData.get("linkedin_url") as string) || undefined,
  };

  const parsed = MentorProfileSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Données invalides.";
    return { status: "error", message: msg };
  }

  const { error } = await upsertMentorProfile(user.id, parsed.data);
  if (error) return { status: "error", message: error };

  revalidatePath("/mentorat");
  return { status: "success", message: "Profil enregistré." };
}
