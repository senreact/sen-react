import type { ExportRow } from "@/lib/directory-export";
import { createServiceRoleSupabase } from "@/lib/supabase/service";

interface ProfileRow {
  user_id: string;
  profile_type: string;
  display_name: string | null;
  project_name: string | null;
  organisation_name: string | null;
  ministry_name: string | null;
  partner_org_name: string | null;
  sector_slug: string | null;
  region: string | null;
  address: string | null;
  phone: string | null;
  age: number | null;
  is_formal: boolean | null;
  email_public: boolean | null;
  verification_status: string | null;
  created_at: string | null;
}

const PAGE = 1000;

/**
 * Every directory member (verified + auto_verified, admins excluded) joined
 * with their auth email. Admin-only: callers MUST run requireAdminProfile().
 */
export async function listAllDirectoryMembers(): Promise<ExportRow[]> {
  const sb = createServiceRoleSupabase();

  const profiles: ProfileRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb
      .from("user_profiles")
      .select(
        "user_id, profile_type, display_name, project_name, organisation_name, ministry_name, partner_org_name, sector_slug, region, address, phone, age, is_formal, email_public, verification_status, created_at",
      )
      .in("verification_status", ["verified", "auto_verified"])
      .neq("profile_type", "admin")
      .order("created_at", { ascending: false })
      .order("user_id", { ascending: true })
      .range(from, from + PAGE - 1)
      .returns<ProfileRow[]>();
    if (error) throw new Error(`user_profiles: ${error.message}`);
    profiles.push(...data);
    if (data.length < PAGE) break;
  }

  const emails = new Map<string, string>();
  for (let page = 1; ; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: PAGE });
    if (error) throw new Error(`auth users: ${error.message}`);
    for (const u of data.users) if (u.email) emails.set(u.id, u.email);
    if (data.users.length < PAGE) break;
  }

  return profiles.map((p) => ({
    user_id: p.user_id,
    email: emails.get(p.user_id) ?? null,
    display_name: p.display_name,
    profile_type: p.profile_type,
    project_name: p.project_name,
    organisation_label: p.organisation_name ?? p.ministry_name ?? p.partner_org_name ?? null,
    sector_slug: p.sector_slug,
    region: p.region,
    address: p.address,
    phone: p.phone,
    age: p.age,
    is_formal: p.is_formal,
    email_public: p.email_public,
    verification_status: p.verification_status,
    created_at: p.created_at,
  }));
}
