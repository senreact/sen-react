"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { PollSchema, castVote, createPoll } from "@/lib/polls";
import { createServerSupabase } from "@/lib/supabase/server";

export interface PollActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function createPollAction(
  _prev: PollActionState,
  formData: FormData,
): Promise<PollActionState> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/sondages/creer");

  const rawOptions = (formData.get("options") as string)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const raw = {
    title: formData.get("title") as string,
    question: formData.get("question") as string,
    options: rawOptions,
    closes_at: (formData.get("closes_at") as string) || undefined,
  };

  const parsed = PollSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Données invalides.";
    return { status: "error", message: msg };
  }

  const { id, error } = await createPoll(user.id, parsed.data);
  if (error ?? !id) return { status: "error", message: error ?? "Erreur inattendue." };

  revalidatePath("/sondages");
  redirect(`/sondages/${id}`);
}

export async function voteAction(
  pollId: string,
  _prev: PollActionState,
  formData: FormData,
): Promise<PollActionState> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/connexion?returnTo=/sondages/${pollId}`);

  const optionIndex = parseInt(formData.get("option_index") as string, 10);
  if (Number.isNaN(optionIndex) || optionIndex < 0) {
    return { status: "error", message: "Sélectionnez une option." };
  }

  const { error } = await castVote(pollId, user.id, optionIndex);
  if (error) return { status: "error", message: error };

  revalidatePath(`/sondages/${pollId}`);
  return { status: "success" };
}
