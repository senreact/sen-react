import Link from "next/link";
import type { Route } from "next";

import { getSector } from "@sen-react/shared";

import type { Opportunity, OpportunityType, OpportunityArea } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface OpportunityCardProps {
  opportunity: Opportunity;
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
  const target = new Date(iso).getTime();
  const now = Date.now();
  return Math.floor((target - now) / (24 * 60 * 60 * 1000));
}

/**
 * Opportunity card on /opportunites index. Shows a deadline countdown
 * because that's the strongest signal of relevance ("closes in 3 days"
 * vs. "January 14") for visitors scanning the list.
 */
export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const sector = getSector(opportunity.sector);
  const days = daysUntil(opportunity.deadline);
  const detailHref = `/opportunites/${opportunity.slug}` as unknown as Route;
  const deadlineLabel =
    days <= 0
      ? "Échéance aujourd'hui"
      : days === 1
        ? "Clôture demain"
        : days <= 14
          ? `Clôture dans ${days} jours`
          : `Clôture le ${formatDateFr(opportunity.deadline)}`;
  const deadlineUrgent = days <= 7;

  return (
    <li className="flex flex-col rounded-lg border border-[color:var(--color-border)] bg-white p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
        <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
          {TYPE_FR[opportunity.opportunityType]}
        </span>
        {sector ? <span>{sector.fr}</span> : null}
        <span>· {AREA_FR[opportunity.area]}</span>
      </div>

      <h3 className="mb-2 text-lg font-semibold leading-tight">
        <Link
          href={detailHref}
          className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent)]"
        >
          {opportunity.title}
        </Link>
      </h3>

      <p className="mb-4 text-sm text-[color:var(--color-muted)]">{opportunity.summary}</p>

      <div className="mt-auto space-y-1 text-xs">
        <p
          className={
            deadlineUrgent
              ? "font-semibold text-[color:var(--color-accent-warm)]"
              : "text-[color:var(--color-muted)]"
          }
        >
          {deadlineLabel}
        </p>
        <p className="text-[color:var(--color-muted)]">
          <span className="font-semibold">{opportunity.source}</span>
          {opportunity.amountDisplay ? <span> · {opportunity.amountDisplay}</span> : null}
        </p>
      </div>
    </li>
  );
}
