import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresh the Supabase session on every matched request.
 *
 * Without this, the access token expires while sitting in the cookie and
 * server-side calls start returning 401. The middleware response is what
 * eventually persists the new cookie back to the browser, so we have to
 * mutate `response.cookies` not just the request cookies.
 *
 * Returns the NextResponse so the calling middleware can return it
 * directly or layer on its own redirect logic.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    // Don't throw in middleware — a thrown middleware kills every request.
    // Instead pass through; the auth-touching pages will surface the env
    // error in their own paths.
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Touch getUser so the SDK refreshes the session if it's near expiry.
  // Result intentionally discarded — we only care about the cookie side
  // effect.
  await supabase.auth.getUser();

  return response;
}
