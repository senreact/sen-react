import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS entirely — use ONLY in
 * server-side code paths that need to do something the authenticated
 * user can't do for themselves (e.g. inserting their `user_profiles`
 * row at signup time, before the email-confirmation flow grants them
 * an auth session).
 *
 * Never expose this client to client components. Never use the
 * service-role key in NEXT_PUBLIC_* env vars.
 *
 * Throws if SUPABASE_SERVICE_ROLE_KEY isn't set so callers get a clear
 * error rather than a silent permission failure.
 */
export function createServiceRoleSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase service-role env not set: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required",
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
