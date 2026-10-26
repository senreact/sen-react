"use client";

import { useMemo, useState } from "react";

import { PROFILE_TYPES, SECTORS } from "@sen-react/shared";

import {
  EXPORT_COLUMNS,
  filterRows,
  toCsv,
  type ExportColumn,
  type ExportRow,
} from "@/lib/directory-export";

const PUBLIC_TYPES = PROFILE_TYPES.filter((t) => t.slug !== "admin");
const PAGE_SIZE = 50;

function display(row: ExportRow, col: ExportColumn): string {
  const v = row[col.key];
  if (v === null || v === undefined || v === "") return "null";
  if (col.key === "profile_type") return PUBLIC_TYPES.find((t) => t.slug === v)?.fr ?? String(v);
  if (col.key === "sector_slug") return SECTORS.find((s) => s.slug === v)?.fr ?? String(v);
  return String(v);
}

export function DirectoryExportTable({ rows }: { rows: ExportRow[] }) {
  const [search, setSearch] = useState("");
  const [profileType, setProfileType] = useState("");
  const [sector, setSector] = useState("");
  const [region, setRegion] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(EXPORT_COLUMNS.filter((c) => c.defaultSelected).map((c) => c.key)),
  );
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => filterRows(rows, { search, profileType, sector, region }),
    [rows, search, profileType, sector, region],
  );
  const columns = EXPORT_COLUMNS.filter((c) => selected.has(c.key));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function exportCsv() {
    // BOM so Excel reads UTF-8 accents correctly.
    const blob = new Blob(["﻿" + toCsv(filtered, columns)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `annuaire-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const field = "rounded-md border border-slate-300 px-3 py-2 text-sm";
  const label =
    "flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]";

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className={label}>
            Recherche
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Nom, e-mail, projet…"
              className={`${field} font-normal normal-case`}
            />
          </label>
          <label className={label}>
            Type
            <select
              value={profileType}
              onChange={(e) => {
                setProfileType(e.target.value);
                setPage(1);
              }}
              className={`${field} font-normal normal-case`}
            >
              <option value="">Tous</option>
              {PUBLIC_TYPES.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.fr}
                </option>
              ))}
            </select>
          </label>
          <label className={label}>
            Secteur
            <select
              value={sector}
              onChange={(e) => {
                setSector(e.target.value);
                setPage(1);
              }}
              className={`${field} font-normal normal-case`}
            >
              <option value="">Tous</option>
              {SECTORS.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.fr}
                </option>
              ))}
            </select>
          </label>
          <label className={label}>
            Région
            <input
              type="text"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setPage(1);
              }}
              placeholder="Dakar, Thiès…"
              className={`${field} font-normal normal-case`}
            />
          </label>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
            Colonnes à exporter
          </legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {EXPORT_COLUMNS.map((c) => (
              <label key={c.key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.has(c.key)}
                  onChange={() => toggle(c.key)}
                />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={exportCsv}
            disabled={columns.length === 0 || filtered.length === 0}
            className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            Exporter en CSV ({filtered.length})
          </button>
          <span className="text-sm text-[color:var(--color-muted)]">
            {filtered.length} sur {rows.length} membres
          </span>
        </div>
      </section>

      <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[color:var(--color-border)] bg-slate-50 text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]">
            {visible.map((r) => (
              <tr key={r.user_id}>
                {columns.map((c) => (
                  <td key={c.key} className="whitespace-nowrap px-4 py-2">
                    {display(r, c)}
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={Math.max(1, columns.length)}
                  className="px-4 py-8 text-center text-[color:var(--color-muted)]"
                >
                  Aucun membre ne correspond à ces filtres.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            className="font-semibold text-[color:var(--color-accent)] disabled:opacity-40"
          >
            ← Précédent
          </button>
          <span className="text-[color:var(--color-muted)]">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="font-semibold text-[color:var(--color-accent)] disabled:opacity-40"
          >
            Suivant →
          </button>
        </nav>
      ) : null}
    </div>
  );
}
