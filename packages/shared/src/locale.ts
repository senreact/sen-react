import { z } from "zod";

/**
 * Supported locales.
 *
 * FR is primary at launch (D010 Q2). EN is enabled but content lags FR until
 * Amadou verifies translations. WO (Wolof) is deferred to Wave 2+ per D013.
 */
export const LocaleSchema = z.enum(["fr", "en"]);
export type Locale = z.infer<typeof LocaleSchema>;

export const DEFAULT_LOCALE: Locale = "fr";
export const SUPPORTED_LOCALES: readonly Locale[] = ["fr", "en"] as const;

export function isLocale(value: unknown): value is Locale {
  return LocaleSchema.safeParse(value).success;
}
