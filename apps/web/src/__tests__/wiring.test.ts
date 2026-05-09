import { describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, isLocale, SECTORS } from "@sen-react/shared";

/**
 * Wiring smoke test — catches a real failure: the workspace dependency
 * (@sen-react/shared → apps/web) breaking because of TS path drift,
 * pnpm-workspace.yaml misconfig, or shared package exports field issue.
 *
 * If this test fails, every page that consumes shared types will fail to
 * compile or render. Cheaper to catch here than at build/runtime.
 */
describe("@sen-react/shared workspace wiring", () => {
  it("imports DEFAULT_LOCALE from the shared package", () => {
    expect(DEFAULT_LOCALE).toBe("fr");
  });

  it("imports the 10 SECTORS from the shared package", () => {
    expect(SECTORS).toHaveLength(10);
  });

  it("imports the isLocale runtime helper from the shared package", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("xx")).toBe(false);
  });
});
