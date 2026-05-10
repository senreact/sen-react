import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSector } from "@sen-react/shared";

import { LexicalRichText } from "@/components/content/LexicalRichText";
import { SaveOpportunityButton } from "@/components/content/SaveOpportunityButton";
import { getOpportunityBySlug, type OpportunityArea, type OpportunityType } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";
import { listSavedOpportunitySlugs } from "../actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const TYPE_FR: Record<OpportunityType, string> = {
  financement: "Financement",
  formation: "Formation",
  "appel-a-projets": "Appel à projets",
  partenariat: "Partenariat",
  concours: "Concours",
  autre: "Autre",
};

const AREA_FR: Record<OpportunityArea, string> = {
  senegal: "Sénégal",
  "senegal-dakar": "Dakar",
  "senegal-regions": "Sénégal — régions",
  "afrique-ouest": "Afrique de l'Ouest",
  afrique: "Afrique",
  international: "International",
};

function daysUntil(iso: string): number {
  return Math.floor((new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);
  if (!opportunity) {
    return { title: "Opportunité introuvable — Sen React" };
  }
  return {
    title: `${opportunity.title} — Sen React`,
    description: opportunity.summary,
  };
}

/**
 * /opportunites/[slug] — Opportunity reader.
 *
 * Shows the full opportunity body via Lexical, plus a sidebar / footer
 * apply CTA. Past-deadline entries still render at this URL (so links
 * shared elsewhere don't 404 if the deadline passes between share +
 * click) but the deadline label flips to "Échéance dépassée" and the
 * apply CTA still links out for transparency — the editor decides
 * when to actually unpublish.
 */
export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);
  if (!opportunity) notFound();

  // Fetch auth + saved-set in parallel — both are independent of the
  // opportunity fetch but cheap, so don't block the render path on
  // them past this point.
  const supabase = await createServerSupabase();
  const [{ data: userData }, savedSet] = await Promise.all([
    supabase.auth.getUser().catch(() => ({ data: { user: null } })),
    listSavedOpportunitySlugs(),
  ]);
  const authenticated = Boolean(userData?.user);
  const initialSaved = savedSet.has(slug);

  const sector = getSector(opportunity.sector);
  const days = daysUntil(opportunity.deadline);
  const deadlineLabel =
    days < 0
      ? "Échéance dépassée"
      : days === 0
        ? "Échéance aujourd'hui"
        : days === 1
          ? "Clôture demain"
          : days <= 14
            ? `Clôture dans ${days} jours`
            : `Clôture le ${formatDateFr(opportunity.deadline)}`;
  const deadlineUrgent = days >= 0 && days <= 7;

  return (
    <main>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-sm">
          <Link href="/opportunites" className="text-[color:var(--color-accent)] hover:underline">
            ← Toutes les opportunités
          </Link>
        </nav>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
            <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              {TYPE_FR[opportunity.opportunityType]}
            </span>
            {sector ? <span>{sector.fr}</span> : null}
            <span>· {AREA_FR[opportunity.area]}</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{opportunity.title}</h1>
          <p className="mt-4 text-lg text-[color:var(--color-muted)]">{opportunity.summary}</p>
        </header>

        <section className="mb-8 grid gap-4 rounded-lg border border-[color:var(--color-border)] bg-white p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
              Organisme
            </p>
            <p className="mt-1 text-sm font-semibold">{opportunity.source}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
              Échéance
            </p>
            <p
              className={
                deadlineUrgent
                  ? "mt-1 text-sm font-semibold text-[color:var(--color-accent-warm)]"
                  : "mt-1 text-sm font-semibold"
              }
            >
              {deadlineLabel}
              <span className="ml-2 font-normal text-[color:var(--color-muted)]">
                ({formatDateFr(opportunity.deadline)})
              </span>
            </p>
          </div>
          {opportunity.amountDisplay ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
                Montant
              </p>
              <p className="mt-1 text-sm font-semibold">{opportunity.amountDisplay}</p>
            </div>
          ) : null}
          {!opportunity.reactCurated ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
                Source
              </p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--color-muted)]">
                Aggrégé — non curé par REACT
              </p>
            </div>
          ) : null}
        </section>

        <LexicalRichText content={opportunity.body} />

        {opportunity.sourceUrl || opportunity.contactEmail ? (
          <aside className="mt-10 rounded-lg border border-[color:var(--color-accent)] bg-white p-6">
            <p className="mb-3 font-semibold">Comment postuler ?</p>
            <div className="flex flex-wrap gap-3">
              {opportunity.sourceUrl ? (
                <a
                  href={opportunity.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Accéder à la candidature
                </a>
              ) : null}
              {opportunity.contactEmail ? (
                <a
                  href={`mailto:${opportunity.contactEmail}`}
                  className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] px-5 py-3 text-sm font-semibold hover:border-[color:var(--color-accent)]"
                >
                  Écrire à l&apos;organisme
                </a>
              ) : null}
              <SaveOpportunityButton
                slug={slug}
                initialSaved={initialSaved}
                authenticated={authenticated}
              />
            </div>
          </aside>
        ) : (
          <aside className="mt-10">
            <SaveOpportunityButton
              slug={slug}
              initialSaved={initialSaved}
              authenticated={authenticated}
            />
          </aside>
        )}
      </article>
    </main>
  );
}
