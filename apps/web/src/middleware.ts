import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

/**
 * Matcher excludes static assets and the Next.js internals so we don't
 * burn middleware compute on every image/font request. Auth cookie
 * refresh is fast (single getUser call) but it still touches Supabase
 * over the network — keep it scoped to actual page/request paths.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|otf)$).*)",
  ],
};
