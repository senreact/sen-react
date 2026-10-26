export interface ExportRow {
  user_id: string;
  email: string | null;
  display_name: string | null;
  profile_type: string | null;
  project_name: string | null;
  organisation_label: string | null;
  sector_slug: string | null;
  region: string | null;
  address: string | null;
  phone: string | null;
  age: number | null;
  is_formal: boolean | null;
  email_public: boolean | null;
  verification_status: string | null;
  created_at: string | null;
}

export interface ExportColumn {
  key: keyof Omit<ExportRow, "user_id">;
  label: string;
  defaultSelected: boolean;
}

export const EXPORT_COLUMNS: ExportColumn[] = [
  { key: "display_name", label: "Nom", defaultSelected: true },
  { key: "email", label: "E-mail", defaultSelected: true },
  { key: "phone", label: "Téléphone", defaultSelected: false },
  { key: "profile_type", label: "Type de profil", defaultSelected: true },
  { key: "project_name", label: "Nom du projet", defaultSelected: false },
  { key: "organisation_label", label: "Organisation", defaultSelected: false },
  { key: "sector_slug", label: "Secteur", defaultSelected: false },
  { key: "region", label: "Région", defaultSelected: true },
  { key: "address", label: "Adresse", defaultSelected: false },
  { key: "age", label: "Âge", defaultSelected: false },
  { key: "is_formal", label: "Formel / informel", defaultSelected: false },
  { key: "email_public", label: "E-mail public", defaultSelected: false },
  { key: "verification_status", label: "Statut de vérification", defaultSelected: false },
  { key: "created_at", label: "Date d'inscription", defaultSelected: false },
];

export interface ExportFilters {
  search: string;
  profileType: string;
  sector: string;
  region: string;
}

export function filterRows(rows: ExportRow[], f: ExportFilters): ExportRow[] {
  const search = f.search.trim().toLowerCase();
  const region = f.region.trim().toLowerCase();
  return rows.filter((r) => {
    if (f.profileType && r.profile_type !== f.profileType) return false;
    if (f.sector && r.sector_slug !== f.sector) return false;
    if (region && !(r.region ?? "").toLowerCase().includes(region)) return false;
    if (search) {
      const hay = [r.display_name, r.email, r.project_name, r.organisation_label, r.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });
}

/** Missing values render as the literal text "null". */
export function csvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || value === "") return "null";
  let text = String(value);
  // Neutralise spreadsheet formulas; leave phone-like "+221 77…" values alone.
  if (/^[=@\t\r]/.test(text) || /^[+-](?![\d\s().-]*$)/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows: ExportRow[], columns: ExportColumn[]): string {
  const header = columns.map((c) => csvCell(c.label)).join(",");
  const lines = rows.map((r) => columns.map((c) => csvCell(r[c.key])).join(","));
  return [header, ...lines].join("\r\n");
}
