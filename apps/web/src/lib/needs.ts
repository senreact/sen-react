import type { SectorSlug } from "@sen-react/shared";

import { createServerSupabase } from "@/lib/supabase/server";

export const NEED_KINDS = [
  { slug: "looking-for-partner", fr: "Cherche un partenaire" },
  { slug: "looking-for-funding", fr: "Cherche un financement" },
  { slug: "looking-for-mentor", fr: "Cherche un mentor" },
  { slug: "offering-service", fr: "Propose un service" },
  { slug: "other", fr: "Autre" },
] as const;

export type NeedKind = (typeof NEED_KINDS)[number]["slug"];

export function isNeedKind(value: string): value is NeedKind {
  return NEED_KINDS.some((k) => k.slug === value);
}

export function getNeedKindLabel(slug: string): string {
  return NEED_KINDS.find((k) => k.slug === slug)?.fr ?? slug;
}

export interface DirectoryNeed {
  id: string;
  author_user_id: string;
  author_display_name: string;
  kind: NeedKind;
  title: string;
  summary: string;
  sector_slug: SectorSlug | null;
  region: string | null;
  status: "active" | "closed";
  created_at: string;
  updated_at: string;
}

export interface NeedFilters {
  kind?: NeedKind;
  sector?: SectorSlug;
  region?: string;
  /** Default `'active'`. Set to undefined to include closed too. */
  status?: "active" | "closed";
}

/**
 * Public read of non-hidden directory_needs. Defaults to active only —
 * pass `status: undefined` (not provided) to see all statuses.
 */
export async function listDirectoryNeeds(filters: NeedFilters = {}): Promise<DirectoryNeed[]> {
  const sb = await createServerSupabase();
  let query = sb
    .from("directory_needs")
    .select(
      "id, author_user_id, author_display_name, kind, title, summary, sector_slug, region, status, created_at, updated_at",
    )
    .is("hidden_at", null)
    .order("created_at", { ascending: false })
    .limit(60);

  const statusFilter = filters.status ?? "active";
  if (statusFilter) query = query.eq("status", statusFilter);
  if (filters.kind) query = query.eq("kind", filters.kind);
  if (filters.sector) query = query.eq("sector_slug", filters.sector);
  if (filters.region) query = query.ilike("region", `%${filters.region}%`);

  const { data, error } = await query.returns<DirectoryNeed[]>();
  if (error) {
    console.warn("[needs] listDirectoryNeeds failed:", error.message);
    return [];
  }
  return data ?? [];
}
