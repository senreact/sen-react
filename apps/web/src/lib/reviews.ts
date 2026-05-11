import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceRoleSupabase } from "@/lib/supabase/service";

export interface ProfileReview {
  id: string;
  reviewer_display_name: string;
  reviewer_user_id: string;
  stars: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewSummary {
  count: number;
  averageStars: number | null;
}

/**
 * Slug → full user_id resolution. Shared with /annuaire/[slug] contact
 * fetcher; lifted out so multiple call sites use the same pattern.
 *
 * Returns null when the slug doesn't match a verified profile. The
 * service-role read is bounded by the verified-profile pool, which is
 * small at sen-react's scale.
 */
export async function resolveSlugToUserId(slug: string): Promise<string | null> {
  if (!/^[0-9a-f]{8}$/i.test(slug)) return null;
  const sb = createServiceRoleSupabase();
  const { data, error } = await sb
    .from("user_profiles")
    .select("user_id, verification_status")
    .in("verification_status", ["verified", "auto_verified"])
    .returns<Array<{ user_id: string; verification_status: string }>>();
  if (error || !data) return null;
  return data.find((r) => r.user_id.startsWith(slug.toLowerCase()))?.user_id ?? null;
}

/**
 * Public-read of non-hidden reviews for a subject profile (by slug).
 * Returns at most 50 ordered newest-first.
 */
export async function getReviewsForSubject(slug: string): Promise<ProfileReview[]> {
  const userId = await resolveSlugToUserId(slug);
  if (!userId) return [];
  const sb = await createServerSupabase();
  const { data, error } = await sb
    .from("profile_reviews")
    .select("id, reviewer_display_name, reviewer_user_id, stars, comment, created_at, updated_at")
    .eq("subject_user_id", userId)
    .is("hidden_at", null)
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<ProfileReview[]>();
  if (error) {
    console.warn("[reviews] getReviewsForSubject failed:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Star-summary stats: count + average. `averageStars` is null when
 * count is 0 so the UI can render a "no reviews yet" state.
 */
export function summariseReviews(reviews: ProfileReview[]): ReviewSummary {
  if (reviews.length === 0) return { count: 0, averageStars: null };
  const total = reviews.reduce((acc, r) => acc + r.stars, 0);
  return { count: reviews.length, averageStars: total / reviews.length };
}
