import type { Field } from "payload";
import { describe, expect, it } from "vitest";

import { SECTORS } from "@sen-react/shared";

import { Opportunities } from "../collections/Opportunities";

/**
 * Phase 4 Opportunities-collection contract tests.
 *
 * What real failure does each catch?
 *
 * - Slug regression: Payload uses the slug for REST + filter URLs. A
 *   silent rename would break apps/web's listOpportunities() fetcher.
 * - Required-field drop: deadline / sector / type / area are how the
 *   index page filters; if any becomes optional an entry could ship
 *   that's invisible to all filters.
 * - Sector-list drift: must derive from D012 SECTORS; hardcoding here
 *   would silently diverge from the rest of the platform.
 * - Type / area enum drift: filter UI is built off these option lists;
 *   adding a new option in only one place would break filters.
 */

function fieldByName(fields: Field[], name: string): Field | undefined {
  return fields.find((f): f is Field & { name: string } => "name" in f && f.name === name);
}

function isRequired(field: Field | undefined): boolean {
  return Boolean(field && "required" in field && field.required === true);
}

describe("Opportunities collection", () => {
  it('has slug "opportunities" — drives /api/opportunities REST + sitemap routes', () => {
    expect(Opportunities.slug).toBe("opportunities");
  });

  it("has draft autosave enabled (editors lose work without this)", () => {
    expect(Opportunities.versions).toMatchObject({ drafts: { autosave: { interval: 2000 } } });
  });

  it("default-sorts by deadline ASC so soon-to-close items are at the top", () => {
    expect(Opportunities.defaultSort).toBe("deadline");
  });

  it("requires the fields the index page filters on (sector, type, area, deadline)", () => {
    const required = [
      "title",
      "slug",
      "summary",
      "body",
      "sector",
      "opportunityType",
      "area",
      "deadline",
      "source",
    ];
    for (const name of required) {
      expect(
        isRequired(fieldByName(Opportunities.fields ?? [], name)),
        `Opportunities.${name} must be required`,
      ).toBe(true);
    }
  });

  it("sector options match D012 SECTORS (count + slugs)", () => {
    const sectorField = fieldByName(Opportunities.fields ?? [], "sector");
    expect(sectorField?.type).toBe("select");
    const opts = (sectorField as { options?: { value: string }[] }).options ?? [];
    expect(opts).toHaveLength(SECTORS.length);
    const slugs = opts.map((o) => o.value).sort();
    const expected = SECTORS.map((s) => s.slug).sort();
    expect(slugs).toEqual(expected);
  });

  it("opportunityType covers the 6 D001 categories", () => {
    const type = fieldByName(Opportunities.fields ?? [], "opportunityType");
    expect(type?.type).toBe("select");
    const opts = (type as { options?: { value: string }[] }).options ?? [];
    const values = opts.map((o) => o.value).sort();
    expect(values).toEqual([
      "appel-a-projets",
      "autre",
      "concours",
      "financement",
      "formation",
      "partenariat",
    ]);
  });

  it("area covers the 6 geographic scopes (national → international)", () => {
    const area = fieldByName(Opportunities.fields ?? [], "area");
    expect(area?.type).toBe("select");
    const opts = (area as { options?: { value: string }[] }).options ?? [];
    expect(opts).toHaveLength(6);
  });

  it("amountValue is OPTIONAL — many opportunities have variable / non-disclosed amounts", () => {
    const amt = fieldByName(Opportunities.fields ?? [], "amountValue");
    expect(amt?.type).toBe("number");
    expect(isRequired(amt)).toBe(false);
  });

  it("reactCurated defaults to true (manual entries) — aggregation pipeline (Phase 5) flips to false", () => {
    const curated = fieldByName(Opportunities.fields ?? [], "reactCurated");
    expect(curated?.type).toBe("checkbox");
    expect((curated as { defaultValue?: boolean }).defaultValue).toBe(true);
  });

  it("sourceUrl validator rejects non-http(s) URLs", () => {
    const url = fieldByName(Opportunities.fields ?? [], "sourceUrl") as {
      validate?: (value: string | null | undefined) => true | string;
    };
    expect(typeof url.validate).toBe("function");
    if (!url.validate) return;
    expect(url.validate("https://adepme.sn/appel")).toBe(true);
    expect(url.validate(null)).toBe(true); // optional — null/empty allowed
    expect(typeof url.validate("ftp://example.com")).toBe("string");
  });
});
