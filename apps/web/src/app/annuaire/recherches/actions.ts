"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { NEED_KINDS } from "@/lib/needs";
import { createServerSupabase } from "@/lib/supabase/server";

export interface NeedActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .or(z.literal(""))
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null));

const NeedKindEnum = z.enum(NEED_KINDS.map((k) => k.slug) as [string, ...string[]]);

const NeedSubmitSchema = z.object({
  kind: NeedKindEnum,
  title: z.string().min(1, { message: "Titre requis" }).max(160),
  summary: z.string().min(1, { message: "Description requise" }).max(2000),
  sector_slug: optionalText(64),
  region: optionalText(120),
});

/**
 * Submit a new "Looking for X" entry. Author identity is taken from
 * the authenticated session — the form can't override. Display-name
 * is snapshotted at insert time from the author's own user_profiles
 * row.
 *
 * On success, redirects to /annuaire/recherches so the user sees
 * their entry on the public list immediately.
 */
export async function submitNeedAction(
  _prev: NeedActionState,
  formData: FormData,
): Promise<NeedActionState> {
  const sb = await createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return { status: "error", message: "Connexion requise." };
  }

  const parsed = NeedSubmitSchema.safeParse({
    kind: formData.get("kind"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    sector_slug: formData.get("sector_slug") ?? undefined,
    region: formData.get("region") ?? undefined,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Validation échouée.",
    };
  }

  const { data: ownProfile } = await sb
    .from("user_profiles")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle<{ display_name: string }>();
  if (!ownProfile) {
    return {
      status: "error",
      message: "Veuillez d'abord compléter votre profil avant de publier.",
    };
  }

  const { error } = await sb.from("directory_needs").insert({
    author_user_id: user.id,
    author_display_name: ownProfile.display_name,
    kind: parsed.data.kind,
    title: parsed.data.title,
    summary: parsed.data.summary,
    sector_slug: parsed.data.sector_slug,
    region: parsed.data.region,
  });

  if (error) {
    console.error("[submitNeedAction] insert failed:", error);
    return { status: "error", message: "Publication impossible. Réessayez." };
  }

  revalidatePath("/annuaire/recherches");
  redirect("/annuaire/recherches?published=1");
}
