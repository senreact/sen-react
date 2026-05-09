import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabase } from "@/lib/supabase/server";

/**
 * POST-only sign-out endpoint.
 *
 * Form-driven from the header. Exposing as a POST (not a GET) means a
 * malicious image tag or auto-prefetched link can't sign the user out
 * unintentionally — proper CSRF posture.
 */
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
