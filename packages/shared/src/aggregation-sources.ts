/**
 * The 11 external sources REACT aggregates opportunities from (D011, confirmed by Tom 2026-05-10).
 *
 * The `key` is the stable identifier used as a foreign key in
 * `public.aggregated_candidates.source_key` and as the cron / job id when the
 * Phase 5 pipeline runs. Renaming a key is a breaking change — orphans every
 * row written under the old key. Prefer adding a new key + migration.
 *
 * URLs are populated incrementally as scrapers land in PR-5b → PR-5d. An
 * empty `url` means "scraper not yet implemented" — the entry exists so the
 * REACT admin UI can list it as "coming soon" and so type-checks across web /
 * cms / migration stay aligned.
 */

export const AGGREGATION_SOURCES = [
  {
    key: "african-ngo-fundraising-hub",
    label: "African NGO Fundraising Hub",
    url: "",
    notes: "International grants directory targeting African NGOs.",
  },
  {
    key: "hexa-africa",
    label: "Hexa Africa",
    url: "",
    notes: "African-focused funding aggregator.",
  },
  {
    key: "align-africa",
    label: "Align Africa",
    url: "",
    notes: "Africa-focused opportunities listing.",
  },
  {
    key: "der",
    label: "DER / FJ — Délégation à l'Entrepreneuriat Rapide",
    url: "https://der.sn",
    notes: "Senegalese state youth-entrepreneurship financing.",
  },
  {
    key: "fonsis",
    label: "FONSIS — Fonds Souverain d'Investissements Stratégiques",
    url: "https://fonsis.sn",
    notes: "Senegalese sovereign wealth fund — strategic investment calls.",
  },
  {
    key: "adepme",
    label: "ADEPME — Agence de Développement des PME",
    url: "https://adepme.sn",
    notes: "Senegalese SME development agency programmes.",
  },
  {
    key: "ue-senegal",
    label: "Union Européenne — Sénégal",
    url: "",
    notes: "EU delegation in Senegal — calls for proposals + cooperation programmes.",
  },
  {
    key: "giz-senegal",
    label: "GIZ Sénégal",
    url: "",
    notes: "German cooperation agency Senegal programmes.",
  },
  {
    key: "cjs-yakaar",
    label: "CJS Yakaar",
    url: "",
    notes: "Senegalese youth council — civic + entrepreneurship calls.",
  },
  {
    key: "oidp-afrique",
    label: "OIDP Afrique",
    url: "",
    notes: "Africa chapter — participatory democracy / civic-tech opportunities.",
  },
  {
    key: "sen-startup",
    label: "Sen Startup",
    url: "",
    notes: "Senegalese startup ecosystem aggregator (asked for amount filter in discovery).",
  },
] as const;

export type AggregationSource = (typeof AGGREGATION_SOURCES)[number];
export type AggregationSourceKey = AggregationSource["key"];

/**
 * Set form for runtime membership checks (e.g. "is this URL param a known
 * source?"). Materialised once at module load.
 */
export const AGGREGATION_SOURCE_KEYS = new Set<AggregationSourceKey>(
  AGGREGATION_SOURCES.map((s) => s.key),
);

export function isAggregationSourceKey(value: string): value is AggregationSourceKey {
  return (AGGREGATION_SOURCE_KEYS as Set<string>).has(value);
}

export function getAggregationSource(key: string): AggregationSource | undefined {
  return AGGREGATION_SOURCES.find((s) => s.key === key);
}
