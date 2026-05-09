/**
 * FR date formatting helpers.
 *
 * Locale fixed to fr-FR — bilingual EN content lives in copy fields
 * directly, dates stay in the canonical FR display format on every
 * surface so editors aren't surprised by mixed locales.
 */

const FR_DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDateFr(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return FR_DATE_FORMATTER.format(d);
}

export function formatDurationMmSs(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || seconds < 0) return "";
  const mm = Math.floor(seconds / 60);
  const ss = Math.floor(seconds % 60);
  return `${mm}:${ss.toString().padStart(2, "0")}`;
}
