import { describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, isLocale, LocaleSchema, SUPPORTED_LOCALES } from "./locale";

describe("LocaleSchema", () => {
  it("accepts every supported locale code", () => {
    for (const code of SUPPORTED_LOCALES) {
      expect(LocaleSchema.parse(code)).toBe(code);
    }
  });

  it("rejects unsupported locale codes", () => {
    expect(() => LocaleSchema.parse("wo")).toThrow();
    expect(() => LocaleSchema.parse("")).toThrow();
    expect(() => LocaleSchema.parse(undefined)).toThrow();
    expect(() => LocaleSchema.parse(null)).toThrow();
  });
});

describe("DEFAULT_LOCALE", () => {
  it("is a member of SUPPORTED_LOCALES (otherwise the app boots into an unsupported locale)", () => {
    expect(SUPPORTED_LOCALES).toContain(DEFAULT_LOCALE);
  });

  it("is fr per D010 Q2 (FR primary at launch)", () => {
    expect(DEFAULT_LOCALE).toBe("fr");
  });
});

describe("isLocale", () => {
  it("returns true for every supported code", () => {
    for (const code of SUPPORTED_LOCALES) {
      expect(isLocale(code)).toBe(true);
    }
  });

  it("returns false for non-string and unsupported inputs", () => {
    expect(isLocale("wo")).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(123)).toBe(false);
    expect(isLocale({})).toBe(false);
  });
});
