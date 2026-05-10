import type { Metadata } from "next";

import { getProfileType, type ProfileTypeSlug } from "@sen-react/shared";

import { VerificationDecisionForm } from "@/components/admin/VerificationDecisionForm";
import { requireAdminProfile } from "@/lib/admin";
import { createServiceRoleSupabase } from "@/lib/supabase/service";

export const metadata: Metadata = {
  title: "Vérification des profils — Sen React",
  description: "File d'attente d'approbation des profils REACT.",
};

// Auth + admin-gated; never prerender.
export const dynamic = "force-dynamic";

interface PendingRow {
  user_id: string;
  profile_type: string;
  display_name: string;
  organisation_name: string | null;
  ministry_name: string | null;
  government_role: string | null;
  partner_org_name: string | null;
  region: string | null;
  sector_slug: string | null;
  summary: string | null;
  phone: string | null;
  is_minor: boolean;
  created_at: string;
}

/**
 * /admin/profils — REACT-admin verification queue for organisation /
 * government / partner profiles (entrepreneur + admin profiles skip the
 * queue via initialVerificationStatus).
 *
 * Sorted by created_at ASC so oldest pending gets reviewed first.
 *
 * The page is gated by requireAdminProfile() → non-admins redirect
 * silently to /. Service-role is used to read other users' profiles
 * (RLS own-row policy would otherwise block).
 */
export default async function AdminProfilsPage() {
  const { profile: adminProfile } = await requireAdminProfile("/admin/profils");

  const sb = createServiceRoleSupabase();
  const { data: pending, error } = await sb
    .from("user_profiles")
    .select(
      "user_id, profile_type, display_name, organisation_name, ministry_name, government_role, partner_org_name, region, sector_slug, summary, phone, is_minor, created_at",
    )
    .eq("verification_status", "pending")
    .order("created_at", { ascending: true })
    .returns<PendingRow[]>();

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold">Vérification des profils</h1>
        <p className="mt-4 text-sm text-red-700">Erreur de chargement : {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          Espace administrateur — {adminProfile.display_name}
        </p>
        <h1 className="mt-1 text-2xl font-bold">Vérification des profils</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Approuvez ou refusez les inscriptions des organisations, institutions et partenaires. Les
          inscriptions d&apos;entrepreneur·e·s individuel·le·s sont auto-approuvées et
          n&apos;apparaissent pas dans cette file.
        </p>
      </header>

      {pending && pending.length > 0 ? (
        <ul className="space-y-6">
          {pending.map((row) => (
            <PendingProfileCard key={row.user_id} row={row} />
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-slate-200 bg-slate-50/50 p-4 text-sm text-[color:var(--color-muted)]">
          Aucun profil en attente. Tout est à jour.
        </p>
      )}
    </main>
  );
}

function PendingProfileCard({ row }: { row: PendingRow }) {
  const meta = getProfileType(row.profile_type);
  const typeLabel = meta?.fr ?? row.profile_type;
  const submittedAt = new Date(row.created_at).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <li className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
          {typeLabel}
        </span>
        <span className="text-[color:var(--color-muted)]">Soumis le {submittedAt}</span>
      </div>
      <h2 className="text-lg font-semibold">{row.display_name}</h2>
      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        {orgLabel(row.profile_type as ProfileTypeSlug, row) ? (
          <Pair label="Organisation" value={orgLabel(row.profile_type as ProfileTypeSlug, row)} />
        ) : null}
        {row.government_role ? <Pair label="Fonction" value={row.government_role} /> : null}
        {row.region ? <Pair label="Région" value={row.region} /> : null}
        {row.sector_slug ? <Pair label="Secteur" value={row.sector_slug} /> : null}
        {row.phone ? <Pair label="Téléphone" value={row.phone} /> : null}
      </dl>
      {row.summary ? (
        <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm">{row.summary}</p>
      ) : null}
      <div className="mt-4">
        <VerificationDecisionForm userId={row.user_id} />
      </div>
    </li>
  );
}

function Pair({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function orgLabel(type: ProfileTypeSlug, row: PendingRow): string | null {
  if (type === "organisation") return row.organisation_name;
  if (type === "government") return row.ministry_name;
  if (type === "partner") return row.partner_org_name;
  return null;
}
