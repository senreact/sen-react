import { z } from "zod";

import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceRoleSupabase } from "@/lib/supabase/service";

export interface CommunityPoll {
  id: string;
  created_by: string;
  title: string;
  question: string;
  options: string[];
  closes_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_index: number;
  created_at: string;
}

export interface PollResults {
  poll: CommunityPoll;
  votes: PollVote[];
  userVote: number | null;
  counts: number[];
  total: number;
}

export const PollSchema = z.object({
  title: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères.")
    .max(200, "Le titre ne peut pas dépasser 200 caractères."),
  question: z
    .string()
    .min(10, "La question doit contenir au moins 10 caractères.")
    .max(500, "La question ne peut pas dépasser 500 caractères."),
  options: z
    .array(z.string().min(1).max(200))
    .min(2, "Au moins 2 options sont requises.")
    .max(8, "Maximum 8 options."),
  closes_at: z.string().optional(),
});

export type PollInput = z.infer<typeof PollSchema>;

export async function listActivePolls(): Promise<CommunityPoll[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("community_polls")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .returns<CommunityPoll[]>();

  if (error) {
    console.error("[listActivePolls] failed:", error);
    return [];
  }
  return data ?? [];
}

export async function getPollResults(pollId: string, userId: string): Promise<PollResults | null> {
  const supabase = await createServerSupabase();

  const [{ data: poll, error: pollError }, { data: votes, error: votesError }] = await Promise.all(
    [
      supabase
        .from("community_polls")
        .select("*")
        .eq("id", pollId)
        .returns<CommunityPoll[]>()
        .single(),
      supabase
        .from("poll_votes")
        .select("*")
        .eq("poll_id", pollId)
        .returns<PollVote[]>(),
    ],
  );

  if (pollError || !poll) return null;

  const allVotes = (!votesError ? votes : null) ?? [];
  const userVote = allVotes.find((v) => v.user_id === userId)?.option_index ?? null;
  const counts = poll.options.map((_, i) => allVotes.filter((v) => v.option_index === i).length);
  const total = allVotes.length;

  return { poll, votes: allVotes, userVote, counts, total };
}

export async function createPoll(
  userId: string,
  input: PollInput,
): Promise<{ id: string | null; error: string | null }> {
  const sb = createServiceRoleSupabase();
  const { data, error } = await sb
    .from("community_polls")
    .insert({
      created_by: userId,
      title: input.title,
      question: input.question,
      options: input.options,
      closes_at: input.closes_at ?? null,
    })
    .select("id")
    .returns<{ id: string }[]>()
    .single();

  if (error || !data) {
    console.error("[createPoll] failed:", error);
    return { id: null, error: "Impossible de créer le sondage." };
  }
  return { id: data.id, error: null };
}

export async function castVote(
  pollId: string,
  userId: string,
  optionIndex: number,
): Promise<{ error: string | null }> {
  const sb = createServiceRoleSupabase();
  const { error } = await sb.from("poll_votes").insert({
    poll_id: pollId,
    user_id: userId,
    option_index: optionIndex,
  });

  if (error) {
    if (error.code === "23505") return { error: "Vous avez déjà voté pour ce sondage." };
    console.error("[castVote] failed:", error);
    return { error: "Impossible d'enregistrer votre vote." };
  }
  return { error: null };
}
