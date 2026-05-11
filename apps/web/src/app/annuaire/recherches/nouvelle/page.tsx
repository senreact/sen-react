import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SECTORS } from "@sen-react/shared";

import { NewNeedForm } from "@/components/directory/NewNeedForm";
import { NEED_KINDS } from "@/lib/needs";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Publier une recherche — Sen React",
  description: "Publier une recherche ou une offre sur le tableau Sen React.",
};

export const dynamic = "force-dynamic";

/**
 * /annuaire/recherches/nouvelle — auth-gated submission form.
 * Unauthenticated visitors redirect to /connexion with the returnTo
 * pointing back here.
 */
export default async function NewNeedPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/connexion?returnTo=%2Fannuaire%2Frecherches%2Fnouvelle");
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <nav className="mb-6 text-sm">
        <Link
          href="/annuaire/recherches"
          className="text-[color:var(--color-accent)] hover:underline"
        >
          ← Retour au tableau
        </Link>
      </nav>
      <h1 className="text-2xl font-bold">Publier une recherche / offre</h1>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
        Décrivez ce que vous cherchez ou proposez. Votre nom de profil sera affiché publiquement
        avec la publication ; vos coordonnées restent gérées par votre profil (visibles uniquement
        aux membres connectés).
      </p>
      <div className="mt-6">
        <NewNeedForm sectors={SECTORS} kinds={NEED_KINDS} />
      </div>
    </main>
  );
}
