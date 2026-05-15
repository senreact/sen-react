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
      <Link
        href="/mon-profil"
        className="whitespace-nowrap font-medium hover:text-[color:var(--color-accent)]"
      >
        Mon profil
      </Link>
      <Link
        href="/mes-opportunites"
        className="whitespace-nowrap font-medium hover:text-[color:var(--color-accent)]"
      >
        Mes opportunités
      </Link>
      <span className="hidden text-[color:var(--color-muted)] md:inline">{userEmail}</span>
      <form action="/auth/sign-out" method="POST">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium hover:text-[color:var(--color-accent)]"
          aria-label="Déconnexion"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Déconnexion
        </button>
      </form>
    </div>
  );
}
