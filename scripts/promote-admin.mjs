#!/usr/bin/env node
/**
 * Promote an existing auth.users entry to a REACT admin profile.
 *
 * Usage:
 *   pnpm dlx tsx scripts/promote-admin.mjs <email>
 *   # or:
 *   node --env-file=.env.local scripts/promote-admin.mjs <email>
 *
 * The signup form (PR-6b) intentionally doesn't expose the admin
 * profile type — REACT staff are promoted server-side via this script.
 * Uses the service-role key so the user_profiles verification-fields
 * lockdown trigger lets the change through.
 *
 * Idempotent: if a profile row already exists for the user, it's
 * updated to admin + auto_verified. If no row exists, one is created.
 */
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2];
if (!email) {
  console.error("Usage: scripts/promote-admin.mjs <email>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (source .env.local first).",
  );
  process.exit(1);
}

const sb = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Resolve email → auth.users.id. Supabase's admin.listUsers paginates;
// we walk pages until we find the email. Stop after 10 pages (5,000
// users) to bound the search.
async function findUserId(targetEmail) {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 500 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (hit) return hit.id;
    if (data.users.length < 500) break;
  }
  return null;
}

try {
  const userId = await findUserId(email);
  if (!userId) {
    console.error(`No auth user found for ${email}. Have they signed up?`);
    process.exit(1);
  }

  const { error: upsertError } = await sb.from("user_profiles").upsert(
    {
      user_id: userId,
      profile_type: "admin",
      display_name: email,
      verification_status: "auto_verified",
      verified_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (upsertError) {
    console.error("Upsert failed:", upsertError);
    process.exit(1);
  }

  console.log(`✓ ${email} (${userId}) is now an admin.`);
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
