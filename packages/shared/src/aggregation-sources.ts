/**
 * The 12 external sources REACT aggregates opportunities from.
 *
 * Authoritative list:
 * - 10 sources sent by Amadou on WhatsApp 2026-05-10 20:22 SAST.
 * - 2 sources added by Tom 2026-05-10 (EEAS Senegal + GIZ Senegal) after the
 *   first batch — both were in the original D011 draft.
 *
 * Changes vs the early D011 draft: FONSIS was wrong (Amadou actually wanted
 * FONGIP, a different fund), Civic Hive was added. D011 will be updated to
 * match.
 *
 * The `key` is the stable identifier used as a foreign key in
 * `public.aggregated_candidates.source_key` and as the job id when the
 * Phase 5 pipeline runs. Renaming a key is a breaking change — orphans
 * every row written under the old key. Prefer adding a new key + migration.
 *
 * `url` is the site URL Amadou pointed us at. Scrapers may need to descend
 * to a sub-path (e.g. consortiumjeunessesenegal.org/yaakaar) — that lives
 * in the per-scraper config in PR-5b, not here.
 */

export const AGGREGATION_SOURCES = [
  {
    key: "african-ngo-fundraising-hub",
    label: "African NGO Fundraising Hub",
    url: "https://ngofundraising.africa",
    notes: "International grants directory targeting African NGOs.",
  },
  {
    key: "hexa-africa",
    label: "Hexa Africa",
    url: "https://hexamedia.africa",
    notes: "Africa-focused funding aggregator (brand: Hexa Africa, site: hexamedia.africa).",
  },
  {
    key: "align-africa",
    label: "Align Africa",
    url: "https://alignafrica.org",
    notes: "Africa-focused opportunities listing.",
  },
  {
    key: "der",
    label: "DER / FJ — Délégation à l'Entrepreneuriat Rapide",
    url: "https://www.der.sn",
    notes: "Senegalese state youth-entrepreneurship financing.",
  },
  {
    key: "adepme",
    label: "ADEPME — Agence de Développement des PME",
    url: "https://adepme.sn",
    notes: "Senegalese SME development agency programmes.",
  },
  {
    key: "consortium-jeunesse-yaakaar",
    label: "Consortium Jeunesse Sénégal — Yaakaar",
    url: "https://www.consortiumjeunessesenegal.org/yaakaar",
    notes: "Senegalese youth consortium — Yaakaar civic + entrepreneurship calls.",
  },
  {
    key: "oidp-afrique",
    label: "OIDP Afrique",
    url: "https://oidp-afrique.org",
    notes: "Africa chapter — participatory democracy / civic-tech opportunities.",
  },
  {
    key: "sen-startup",
    label: "Sen Startup",
    url: "https://www.senstartup.com",
    notes: "Senegalese startup ecosystem aggregator (asked for amount filter in discovery).",
  },
  {
    key: "fongip",
    label: "FONGIP — Fonds de Garantie des Investissements Prioritaires",
    url: "http://www.fongip.sn",
    notes:
      "Senegalese sovereign guarantee fund — financing calls. Note: site served over HTTP (no TLS) as of 2026-05-10; scraper must allow plain http.",
  },
  {
    key: "civic-hive",
    label: "Civic Hive",
    url: "https://civichive.org",
    notes: "Civic-tech / public-interest opportunities aggregator.",
  },
  {
    key: "eeas-senegal",
    label: "Délégation de l'Union européenne au Sénégal — EEAS",
    url: "https://www.eeas.europa.eu/delegations/senegal_fr",
    notes:
      "EU delegation in Senegal — calls for proposals + cooperation programmes. EEAS canonical URL.",
  },
  {
    key: "giz-senegal",
    label: "GIZ Sénégal",
    url: "https://www.giz.de/en/regions/africa/senegal",
    notes:
      "German cooperation agency Senegal programmes. EN-language site (FR equivalent 404s as of 2026-05-10).",
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
