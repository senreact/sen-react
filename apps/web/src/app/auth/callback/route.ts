import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Email-confirmation callback.
 *
 * Supabase redirects users here after they click the link in the
 * "confirm your email" message. The query param `code` is exchanged for
 * a session, then we redirect them to the post-auth destination.
 *
 * `next` query param controls the post-auth redirect (defaults to `/`).
 * We validate it's a same-origin path so we can't be used as an open
 * redirect (e.g. ?next=https://attacker.example).
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  // Same-origin guard: only allow paths starting with `/`, no protocol.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (!code) {
    return NextResponse.redirect(new URL("/connexion?error=no-code", url.origin));
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/connexion?error=exchange-failed", url.origin));
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
