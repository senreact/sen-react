import { describe, expect, it } from "vitest";

import { formatDateFr, formatDurationMmSs } from "./format";

describe("formatDateFr", () => {
  it("formats ISO string in fr-FR with month name", () => {
    expect(formatDateFr("2026-05-09T10:00:00Z")).toMatch(/9 mai 2026/);
  });

  it("returns empty string on invalid date", () => {
    expect(formatDateFr("not-a-date")).toBe("");
  });
});

describe("formatDurationMmSs", () => {
  it("formats seconds as m:ss with zero padding", () => {
    expect(formatDurationMmSs(65)).toBe("1:05");
    expect(formatDurationMmSs(125)).toBe("2:05");
    expect(formatDurationMmSs(7)).toBe("0:07");
  });

  it("returns empty string for null/undefined/negative", () => {
    expect(formatDurationMmSs(null)).toBe("");
    expect(formatDurationMmSs(undefined)).toBe("");
    expect(formatDurationMmSs(-5)).toBe("");
  });
});
