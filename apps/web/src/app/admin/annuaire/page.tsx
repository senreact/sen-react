import type { Metadata } from "next";

import { DirectoryExportTable } from "@/components/admin/DirectoryExportTable";
import { requireAdminProfile } from "@/lib/admin";
import { listAllDirectoryMembers } from "@/lib/admin-directory";

export const metadata: Metadata = {
  title: "Export de l'annuaire — Sen React",
  description: "Filtrer l'annuaire et exporter les informations en CSV.",
};

// Admin-gated and contains private contact data; never prerender or cache.
export const dynamic = "force-dynamic";

export default async function AdminAnnuairePage() {
  const { profile } = await requireAdminProfile("/admin/annuaire");
  const rows = await listAllDirectoryMembers();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          Espace administrateur — {profile.display_name}
        </p>
        <h1 className="mt-1 text-2xl font-bold">Export de l&apos;annuaire</h1>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--color-muted)]">
          Filtrez les membres, choisissez les colonnes, puis téléchargez un fichier CSV. Les valeurs
          manquantes sont exportées sous la forme « null ».
        </p>
      </header>
      <DirectoryExportTable rows={rows} />
    </main>
  );
}
