import type { ProfileTypeSlug, SectorSlug } from "@sen-react/shared";

import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Public-directory row — the column-projected view of user_profiles
 * created in supabase/migrations/20260511_000000_directory_profiles_view.sql.
 *
 * Importantly does NOT include phone, email, parental fields, or
 * verification_notes — those stay on the underlying table behind RLS.
 */
export interface DirectoryProfile {
  directory_slug: string;
  profile_type: ProfileTypeSlug;
  display_name: string;
  sector_slug: SectorSlug | null;
  region: string | null;
  photo_url: string | null;
  summary: string | null;
  organisation_label: string | null;
  verification_status: "verified" | "auto_verified";
  created_at: string;
}

export interface DirectoryFilters {
  /** Profile type — entrepreneur, organisation, government, partner (admin excluded by the view). */
  type?: ProfileTypeSlug;
  sector?: SectorSlug;
  /** Free-text region match (`ilike` on the stored value). */
  region?: string;
  limit?: number;
}

/**
 * Read verified + auto_verified profiles from the public directory view.
 * Filters are applied at the Postgres layer for cheap pagination later.
 * Sorted newest-first so freshly verified members surface to the top.
 */
export async function listDirectoryProfiles(
  filters: DirectoryFilters = {},
): Promise<DirectoryProfile[]> {
  const sb = await createServerSupabase();
  let query = sb
    .from("directory_profiles")
    .select(
      "directory_slug, profile_type, display_name, sector_slug, region, photo_url, summary, organisation_label, verification_status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(filters.limit ?? 60);

  if (filters.type) query = query.eq("profile_type", filters.type);
  if (filters.sector) query = query.eq("sector_slug", filters.sector);
  if (filters.region) query = query.ilike("region", `%${filters.region}%`);

  const { data, error } = await query.returns<DirectoryProfile[]>();
  if (error) {
    console.warn("[directory] listDirectoryProfiles failed:", error.message);
    return [];
  }
  return data ?? [];
}
