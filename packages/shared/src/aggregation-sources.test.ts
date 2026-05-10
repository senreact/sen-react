import { describe, expect, it } from "vitest";

import {
  AGGREGATION_SOURCES,
  AGGREGATION_SOURCE_KEYS,
  getAggregationSource,
  isAggregationSourceKey,
} from "./aggregation-sources";

describe("AGGREGATION_SOURCES", () => {
  it("contains exactly 10 sources per Amadou's confirmed list (2026-05-10)", () => {
    expect(AGGREGATION_SOURCES).toHaveLength(10);
  });

  it("every source has a unique key", () => {
    const keys = AGGREGATION_SOURCES.map((s) => s.key);
    expect(new Set(keys).size).toBe(AGGREGATION_SOURCES.length);
  });

  it("every key is URL-safe (lowercase letters, digits, hyphens only)", () => {
    for (const source of AGGREGATION_SOURCES) {
      expect(source.key).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("every source has a populated label, url, and notes (no placeholder rows)", () => {
    for (const source of AGGREGATION_SOURCES) {
      expect(source.label.length).toBeGreaterThan(0);
      expect(source.url.length).toBeGreaterThan(0);
      expect(source.notes.length).toBeGreaterThan(0);
    }
  });

  it("every url is a valid http or https URL (fongip.sn is plain http; allow it)", () => {
    for (const source of AGGREGATION_SOURCES) {
      expect(source.url).toMatch(/^https?:\/\/[^\s]+$/);
    }
  });

  it("AGGREGATION_SOURCE_KEYS mirrors AGGREGATION_SOURCES exactly", () => {
    expect(AGGREGATION_SOURCE_KEYS.size).toBe(AGGREGATION_SOURCES.length);
    for (const source of AGGREGATION_SOURCES) {
      expect(AGGREGATION_SOURCE_KEYS.has(source.key)).toBe(true);
    }
  });
});

describe("isAggregationSourceKey", () => {
  it("returns true for a known key", () => {
    expect(isAggregationSourceKey("der")).toBe(true);
  });

  it("returns false for an unknown key", () => {
    expect(isAggregationSourceKey("nope")).toBe(false);
  });
});

describe("getAggregationSource", () => {
  it("returns the source row for a known key", () => {
    const der = getAggregationSource("der");
    expect(der?.label).toContain("DER");
    expect(der?.url).toBe("https://www.der.sn");
  });

  it("returns undefined for an unknown key", () => {
    expect(getAggregationSource("nope")).toBeUndefined();
  });
});
