import type { Metadata } from "next";

import { EmptyState } from "@/components/content/EmptyState";
import { OpportunityCard } from "@/components/content/OpportunityCard";
import { OpportunityFilters } from "@/components/content/OpportunityFilters";
import {
  getEmptyStates,
  listOpportunities,
  type OpportunityArea,
  type OpportunityFilters as ListFilters,
  type OpportunityType,
} from "@/lib/cms";
import type { SectorSlug } from "@sen-react/shared";
import { SECTORS } from "@sen-react/shared";

export const metadata: Metadata = {
  title: "Opportunités — Sen React",
  description:
    "Financements, formations, appels à projets et partenariats curés par REACT pour les entrepreneurs sénégalais et africains.",
};

interface PageProps {
  searchParams: Promise<{
    sector?: string;
    type?: string;
    area?: string;
    deadline?: string;
    amountMin?: string;
    q?: string;
  }>;
}

const VALID_TYPES: OpportunityType[] = [
  "financement",
  "formation",
  "appel-a-projets",
  "partenariat",
  "concours",
  "autre",
];

const VALID_AREAS: OpportunityArea[] = [
  "senegal",
  "senegal-dakar",
  "senegal-regions",
  "afrique-ouest",
  "afrique",
  "international",
];

function isSectorSlug(value: string): value is SectorSlug {
  return SECTORS.some((s) => s.slug === value);
}

/**
 * /opportunites — Phase 4 index. Pulls published opportunities from
 * the Payload Opportunities collection, filtered by URL search params.
 *
 * URL params validated against the closed enum sets so a malformed
 * `?type=xss` doesn't propagate to the CMS query. Invalid values are
 * silently dropped (filter ignored) rather than throwing.
 *
 * Past-deadline opportunities are excluded at the fetcher layer — they
 * don't surface on the index even if the editor forgot to unpublish.
 */
export default async function OpportunitiesIndex({ searchParams }: PageProps) {
  const sp = await searchParams;

  const filters: ListFilters = {};
  if (sp.sector && isSectorSlug(sp.sector)) filters.sector = sp.sector;
  if (sp.type && (VALID_TYPES as string[]).includes(sp.type)) {
    filters.opportunityType = sp.type as OpportunityType;
  }
  if (sp.area && (VALID_AREAS as string[]).includes(sp.area)) {
    filters.area = sp.area as OpportunityArea;
  }
  if (sp.deadline) {
    const days = Number.parseInt(sp.deadline, 10);
    if (Number.isFinite(days) && days > 0 && days <= 3650) filters.deadlineWithinDays = days;
  }
  if (sp.amountMin) {
    const min = Number.parseInt(sp.amountMin, 10);
    if (Number.isFinite(min) && min > 0) filters.amountMin = min;
  }
  if (sp.q) filters.q = sp.q.trim();

  const [opportunities, emptyStates] = await Promise.all([
    listOpportunities(filters),
    getEmptyStates(),
  ]);

  const hasActiveFilters = Boolean(
    filters.sector ||
    filters.opportunityType ||
    filters.area ||
    filters.deadlineWithinDays ||
    filters.amountMin ||
    filters.q,
  );
  const empty = hasActiveFilters ? emptyStates.opportunitiesNoMatch : emptyStates.opportunities;

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Opportunités
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Financements, formations, appels à projets.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Une sélection curée par REACT — par secteur, par type, par zone géographique. Filtrez
            par échéance pour ne voir que ce qui est encore ouvert.
          </p>
        </div>
      </section>

      <section className="border-b border-[color:var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <OpportunityFilters
            current={{
              sector: filters.sector,
              type: filters.opportunityType,
              area: filters.area,
              deadline: filters.deadlineWithinDays?.toString(),
              amountMin: filters.amountMin?.toString(),
              q: filters.q,
            }}
          />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          {opportunities.length === 0 ? (
            <EmptyState title={empty.title} description={empty.description} />
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
