import Link from "next/link";

import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Session-aware nav slot rendered in the right-hand side of the header.
 *
 * - Logged-out: "Se connecter" + "Inscription" links
 * - Logged-in: user's email + "Déconnexion" form-button (POST per CSRF
 *   guidance in /auth/sign-out)
 *
 * Reads the current user from the SSR Supabase client. If the env vars
 * aren't set or the call fails, returns the logged-out slot — degrading
 * gracefully rather than crashing the layout.
 */
export async function AuthNav() {
  let userEmail: string | null = null;
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    userEmail = data.user?.email ?? null;
  } catch {
    // Env not configured — render the logged-out slot. The /connexion
    // page itself will surface the proper error if Supabase is down.
  }

  if (!userEmail) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/connexion"
          className="whitespace-nowrap font-medium hover:text-[color:var(--color-accent)]"
        >
          Se connecter
        </Link>
        <Link
          href="/inscription"
          className="whitespace-nowrap rounded-md bg-[color:var(--color-accent)] px-3 py-1.5 font-medium text-white hover:opacity-90"
        >
          Inscription
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden text-[color:var(--color-muted)] md:inline">{userEmail}</span>
      <form action="/auth/sign-out" method="POST">
        <button
          type="submit"
          className="whitespace-nowrap font-medium hover:text-[color:var(--color-accent)]"
        >
          Déconnexion
        </button>
      </form>
    </div>
  );
}
