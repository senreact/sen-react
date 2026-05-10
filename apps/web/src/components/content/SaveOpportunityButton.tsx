"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { toggleSavedOpportunity } from "@/app/opportunites/actions";

interface SaveOpportunityButtonProps {
  slug: string;
  /** Initial saved state, computed server-side so render is correct on first paint. */
  initialSaved: boolean;
  /** When false (no auth session at render time), the component links to /connexion instead of attempting the action. */
  authenticated: boolean;
}

/**
 * Save / unsave toggle on the opportunity reader.
 *
 * Optimistic flip (button label updates the moment user clicks), with
 * server-action revalidation in the background. Action failure reverts
 * the flip. Unauthenticated visitors get a link to /connexion instead
 * of an action button so we never attempt an unauthorised insert.
 */
export function SaveOpportunityButton({
  slug,
  initialSaved,
  authenticated,
}: SaveOpportunityButtonProps) {
  if (!authenticated) {
    const returnTo = `/opportunites/${slug}`;
    return (
      <Link
        href={`/connexion?returnTo=${encodeURIComponent(returnTo)}`}
        className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold hover:border-[color:var(--color-accent)]"
      >
        Connectez-vous pour enregistrer
      </Link>
    );
  }
  return <SignedInToggle slug={slug} initialSaved={initialSaved} />;
}

function SignedInToggle({ slug, initialSaved }: { slug: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const optimisticNext = !saved;
        setSaved(optimisticNext);
        startTransition(async () => {
          const result = await toggleSavedOpportunity(slug);
          if (result.status !== "ok") {
            setSaved(!optimisticNext);
          } else {
            setSaved(result.saved);
          }
        });
      }}
      className={
        saved
          ? "inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          : "inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold hover:border-[color:var(--color-accent)] disabled:opacity-50"
      }
    >
      {pending ? "…" : saved ? "✓ Enregistrée" : "Enregistrer cette opportunité"}
    </button>
  );
}
