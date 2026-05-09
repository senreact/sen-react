import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client.
 *
 * Use in: Server Components, route handlers, server actions, middleware.
 *
 * Reads/writes auth cookies via Next.js `cookies()`. Each call returns a
 * fresh client tied to the current request — do not memoise across
 * requests.
 *
 * Throws (rather than silently producing a broken client) if either
 * env var is missing, because every consumer of this client assumes
 * auth state is reachable.
 */
export async function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase env not set: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll throws when called from a Server Component; the
          // middleware refresh path handles cookie-write side effects
          // there. Safe to ignore in that context.
        }
      },
    },
  });
}
