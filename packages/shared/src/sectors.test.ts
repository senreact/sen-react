import { describe, expect, it } from "vitest";

import { getSector, SECTORS } from "./sectors";

describe("SECTORS", () => {
  it("contains exactly 10 sectors per D012", () => {
    expect(SECTORS).toHaveLength(10);
  });

  it("every sector has a unique slug", () => {
    const slugs = SECTORS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(SECTORS.length);
  });

  it("every slug is URL-safe (lowercase letters, digits, hyphens only)", () => {
    for (const sector of SECTORS) {
      expect(sector.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("every sector has populated FR/EN/scopeFr fields (catches editor mistakes when adding a sector)", () => {
    for (const sector of SECTORS) {
      expect(sector.fr.length).toBeGreaterThan(0);
      expect(sector.en.length).toBeGreaterThan(0);
      expect(sector.scopeFr.length).toBeGreaterThan(0);
    }
  });
});

describe("getSector", () => {
  it("returns the matching sector for a known slug", () => {
    const result = getSector("agroecologie");
    expect(result).toBeDefined();
    expect(result?.fr).toBe("Agroécologie");
    expect(result?.en).toBe("Agroecology");
  });

  it("returns undefined for an unknown slug (never throws — consumers rely on the type-narrow)", () => {
    expect(getSector("nonexistent")).toBeUndefined();
    expect(getSector("")).toBeUndefined();
    expect(getSector("DIGITALISATION-TECHNOLOGIE")).toBeUndefined();
  });
});
