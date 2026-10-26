import { describe, expect, it } from "vitest";

import { EXPORT_COLUMNS, csvCell, filterRows, toCsv, type ExportRow } from "./directory-export";

const row = (over: Partial<ExportRow> = {}): ExportRow => ({
  user_id: "1",
  email: "a@b.fr",
  display_name: "Aïssatou",
  profile_type: "entrepreneur",
  project_name: null,
  organisation_label: null,
  sector_slug: null,
  region: "Dakar",
  address: null,
  phone: null,
  age: null,
  is_formal: null,
  email_public: true,
  verification_status: "auto_verified",
  created_at: "2026-10-01T00:00:00Z",
  ...over,
});

describe("csvCell", () => {
  it("prints null for missing values", () => {
    expect(csvCell(null)).toBe("null");
    expect(csvCell(undefined)).toBe("null");
    expect(csvCell("")).toBe("null");
  });
  it("keeps false and 0", () => {
    expect(csvCell(false)).toBe("false");
    expect(csvCell(0)).toBe("0");
  });
  it("quotes commas, quotes and newlines", () => {
    expect(csvCell('a,"b"')).toBe('"a,""b"""');
    expect(csvCell("a\nb")).toBe('"a\nb"');
  });
  it("neutralises formulas but not phone numbers", () => {
    expect(csvCell("=SUM(A1)")).toBe("'=SUM(A1)");
    expect(csvCell("+221 77 123 45 67")).toBe("+221 77 123 45 67");
  });
});

describe("toCsv", () => {
  it("emits only selected columns with null for gaps", () => {
    const cols = EXPORT_COLUMNS.filter((c) => ["display_name", "phone"].includes(c.key));
    expect(toCsv([row()], cols)).toBe("Nom,Téléphone\r\nAïssatou,null");
  });
});

describe("filterRows", () => {
  const rows = [
    row(),
    row({
      user_id: "2",
      display_name: "Org",
      profile_type: "organisation",
      region: "Thiès",
      email: null,
    }),
  ];
  const none = { search: "", profileType: "", sector: "", region: "" };
  it("filters by type, region and search", () => {
    expect(filterRows(rows, { ...none, profileType: "organisation" })).toHaveLength(1);
    expect(filterRows(rows, { ...none, region: "dak" })).toHaveLength(1);
    expect(filterRows(rows, { ...none, search: "a@b" })).toHaveLength(1);
    expect(filterRows(rows, none)).toHaveLength(2);
  });
});
