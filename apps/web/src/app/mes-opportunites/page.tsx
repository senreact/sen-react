import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { OpportunityCard } from "@/components/content/OpportunityCard";
import { listOpportunitiesBySlugs } from "@/lib/cms";
import { createServerSupabase } from "@/lib/supabase/server";

import { listSavedOpportunitySlugs } from "../opportunites/actions";

export const metadata: Metadata = {
  title: "Mes opportunités — Sen React",
  description: "Vos opportunités enregistrées sur Sen React.",
};

// Auth-gated, depends on the user's session cookie — never prerender.
export const dynamic = "force-dynamic";

/**
 * /mes-opportunites — auth-gated list of opportunities the user has
 * saved. Unauthenticated visitors are redirected to /connexion with a
 * `returnTo` so they land back here after sign-in.
 *
 * Saved entries that have been deleted or unpublished from the
 * Opportunities collection silently drop out of the list — we don't
 * surface "this opportunity no longer exists" since the user can
 * always re-save from the index.
 */
export default async function MesOpportunitesPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/connexion?returnTo=%2Fmes-opportunites");
  }

  const savedSlugs = await listSavedOpportunitySlugs();
  const opportunities =
    savedSlugs.size > 0 ? await listOpportunitiesBySlugs(Array.from(savedSlugs)) : [];

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Mon espace
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Mes opportunités</h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Les opportunités que vous avez enregistrées. Cliquez à nouveau sur le bouton
            «&nbsp;Enregistrée&nbsp;» d&apos;une opportunité pour la retirer de cette liste.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          {opportunities.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[color:var(--color-border)] bg-white px-6 py-12 text-center">
              <p className="mb-2 text-base font-semibold">
                Vous n&apos;avez encore enregistré aucune opportunité.
              </p>
              <p className="mb-6 text-sm text-[color:var(--color-muted)]">
                Parcourez les opportunités curées par REACT et utilisez le bouton
                «&nbsp;Enregistrer&nbsp;» pour les retrouver ici.
              </p>
              <Link
                href="/opportunites"
                className="inline-flex rounded-md bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Découvrir les opportunités
              </Link>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
