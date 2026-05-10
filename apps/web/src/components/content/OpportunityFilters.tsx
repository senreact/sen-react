import { SECTORS } from "@sen-react/shared";

interface OpportunityFiltersProps {
  current: {
    sector?: string;
    type?: string;
    area?: string;
    deadline?: string;
    amountMin?: string;
    q?: string;
  };
}

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "financement", label: "Financement" },
  { value: "formation", label: "Formation" },
  { value: "appel-a-projets", label: "Appel à projets" },
  { value: "partenariat", label: "Partenariat" },
  { value: "concours", label: "Concours" },
  { value: "autre", label: "Autre" },
];

const AREA_OPTIONS: { value: string; label: string }[] = [
  { value: "senegal", label: "Sénégal — national" },
  { value: "senegal-dakar", label: "Sénégal — Dakar" },
  { value: "senegal-regions", label: "Sénégal — régions" },
  { value: "afrique-ouest", label: "Afrique de l'Ouest" },
  { value: "afrique", label: "Afrique" },
  { value: "international", label: "International" },
];

const DEADLINE_OPTIONS: { value: string; label: string }[] = [
  { value: "30", label: "30 prochains jours" },
  { value: "90", label: "3 prochains mois" },
  { value: "365", label: "12 prochains mois" },
];

// Curated XOF thresholds — keep the list short so users tap rather than type
// arbitrary numbers. Values match the typical grant-size buckets entrepreneurs
// search by (Sen Startup discovery feedback). Currency is locked to XOF (the
// primary unit on Senegal-targeted opportunities); EUR/USD entries with a
// stored XOF equivalent in `amountValue` will still be matched correctly.
const AMOUNT_MIN_OPTIONS: { value: string; label: string }[] = [
  { value: "500000", label: "≥ 500 K FCFA" },
  { value: "1000000", label: "≥ 1 M FCFA" },
  { value: "5000000", label: "≥ 5 M FCFA" },
  { value: "10000000", label: "≥ 10 M FCFA" },
  { value: "50000000", label: "≥ 50 M FCFA" },
];

/**
 * URL-driven filter form for /opportunites. Uses GET so submit reloads
 * the page with the chosen filters in the query string — server-side
 * rendering picks them up via searchParams. No client state needed.
 *
 * Reset link is a `<a href="/opportunites">` rather than a button —
 * keeps the form snippet a pure server component, no JS needed.
 */
export function OpportunityFilters({ current }: OpportunityFiltersProps) {
  const hasActive = Boolean(
    current.sector ||
    current.type ||
    current.area ||
    current.deadline ||
    current.amountMin ||
    current.q,
  );

  return (
    <form
      action="/opportunites"
      method="get"
      className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
            Secteur
          </span>
          <select
            name="sector"
            defaultValue={current.sector ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            {SECTORS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.fr}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
            Type
          </span>
          <select
            name="type"
            defaultValue={current.type ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
            Zone
          </span>
          <select
            name="area"
            defaultValue={current.area ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Toutes</option>
            {AREA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
            Échéance
          </span>
          <select
            name="deadline"
            defaultValue={current.deadline ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Toutes</option>
            {DEADLINE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
            Montant minimum
          </span>
          <select
            name="amountMin"
            defaultValue={current.amountMin ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            {AMOUNT_MIN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
            Recherche
          </span>
          <input
            type="search"
            name="q"
            defaultValue={current.q ?? ""}
            placeholder="Mots-clés…"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Filtrer
        </button>
        {hasActive ? (
          <a
            href="/opportunites"
            className="text-sm text-[color:var(--color-accent)] hover:underline"
          >
            Réinitialiser
          </a>
        ) : null}
      </div>
    </form>
  );
}
