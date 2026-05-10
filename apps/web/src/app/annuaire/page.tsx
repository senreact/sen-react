import type { Metadata } from "next";

import {
  getProfileType,
  isProfileTypeSlug,
  PROFILE_TYPES,
  SECTORS,
  type ProfileTypeSlug,
  type SectorSlug,
} from "@sen-react/shared";

import { listDirectoryProfiles } from "@/lib/directory";

export const metadata: Metadata = {
  title: "Annuaire — Sen React",
  description:
    "L'annuaire public des entrepreneurs, organisations et partenaires vérifiés du réseau Sen React.",
};

interface PageProps {
  searchParams: Promise<{
    type?: string;
    sector?: string;
    region?: string;
  }>;
}

const PUBLIC_TYPES = PROFILE_TYPES.filter((t) => t.slug !== "admin");

function isSectorSlug(value: string): value is SectorSlug {
  return SECTORS.some((s) => s.slug === value);
}

/**
 * /annuaire — public directory of verified members. Reads
 * `directory_profiles` (the column-projected view from PR-6e) via the
 * anon supabase client. Filter UI mirrors the /opportunites pattern:
 * URL-driven, plain GET form, no client state.
 *
 * Only profiles with verification_status `verified` or `auto_verified`
 * surface — that filter lives in the view definition.
 */
export default async function AnnuairePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const type: ProfileTypeSlug | undefined =
    sp.type && isProfileTypeSlug(sp.type) && sp.type !== "admin" ? sp.type : undefined;
  const sector: SectorSlug | undefined =
    sp.sector && isSectorSlug(sp.sector) ? sp.sector : undefined;
  const region = sp.region?.trim() || undefined;

  const profiles = await listDirectoryProfiles({ type, sector, region });
  const hasActiveFilters = Boolean(type || sector || region);

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Annuaire
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Entrepreneurs, organisations et partenaires.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            L&apos;annuaire public Sen React — uniquement les profils vérifiés par REACT et les
            entrepreneur·e·s auto-attesté·e·s. Les coordonnées privées (téléphone, e-mail) restent
            visibles uniquement aux membres connectés.
          </p>
        </div>
      </section>

      <section className="border-b border-[color:var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <form
            action="/annuaire"
            method="get"
            className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
                  Type
                </span>
                <select
                  name="type"
                  defaultValue={type ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">Tous</option>
                  {PUBLIC_TYPES.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.fr}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
                  Secteur
                </span>
                <select
                  name="sector"
                  defaultValue={sector ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">Tous</option>
                  {SECTORS.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.fr}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
                  Région
                </span>
                <input
                  type="text"
                  name="region"
                  defaultValue={region ?? ""}
                  placeholder="Dakar, Thiès…"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Filtrer
                </button>
                {hasActiveFilters ? (
                  <a
                    href="/annuaire"
                    className="text-sm text-[color:var(--color-accent)] hover:underline"
                  >
                    Réinitialiser
                  </a>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          {profiles.length === 0 ? (
            <p className="rounded-md border border-slate-200 bg-slate-50/50 p-6 text-sm text-[color:var(--color-muted)]">
              Aucun profil ne correspond à ces critères pour le moment. L&apos;annuaire se remplira
              à mesure que des membres s&apos;inscrivent et sont vérifiés par REACT.
            </p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {profiles.map((p) => (
                <DirectoryCard key={p.directory_slug} profile={p} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

function DirectoryCard({
  profile,
}: {
  profile: Awaited<ReturnType<typeof listDirectoryProfiles>>[number];
}) {
  const meta = getProfileType(profile.profile_type);
  const sector = profile.sector_slug ? SECTORS.find((s) => s.slug === profile.sector_slug) : null;
  return (
    <li className="flex flex-col rounded-lg border border-[color:var(--color-border)] bg-white p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
          {meta?.fr ?? profile.profile_type}
        </span>
        {sector ? <span className="text-[color:var(--color-muted)]">{sector.fr}</span> : null}
        {profile.region ? (
          <span className="text-[color:var(--color-muted)]">· {profile.region}</span>
        ) : null}
      </div>
      <h3 className="text-lg font-semibold leading-tight">{profile.display_name}</h3>
      {profile.organisation_label ? (
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">{profile.organisation_label}</p>
      ) : null}
      {profile.summary ? (
        <p className="mt-3 line-clamp-4 text-sm text-[color:var(--color-foreground)]">
          {profile.summary}
        </p>
      ) : null}
    </li>
  );
}
