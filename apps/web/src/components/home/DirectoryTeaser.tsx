import Link from "next/link";

import { SECTORS } from "@sen-react/shared";

import { listDirectoryProfiles } from "@/lib/directory";

/**
 * Homepage `Réseau des Entrepreneurs` banner — Amadou's feedback
 * (2026-05-15) asked for the entrepreneur network to be surfaced "en
 * plus grand format pour être plus attractif, intégrer une bannière si
 * possible".
 *
 * Pulls the 6 most recent verified / auto-verified entrepreneurs from
 * `directory_profiles` and renders them as small preview tiles beside
 * the pitch + CTA. When the directory is empty (early days, no verified
 * entrepreneurs yet) the right column collapses to an "ouvert à
 * l'inscription" placeholder so the banner still earns its scroll-real-
 * estate without faking activity.
 *
 * Placement: between `Hero` and `Domaines` on the homepage. Background
 * uses the brand-green tint to differentiate visually from the white
 * Hero and the border-only Domaines section below.
 *
 * The visual banner asset (REACT-supplied photograph / illustration)
 * lives in the right column and will replace the preview grid once
 * delivered — slot is sized to accept it without a layout shift.
 */
export async function DirectoryTeaser() {
  const profiles = await listDirectoryProfiles({ type: "entrepreneur", limit: 6 });

  return (
    <section className="border-b border-[color:var(--color-border)] bg-[color:var(--color-accent)]/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Réseau des Entrepreneurs Actifs
          </p>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Rejoignez le réseau d&apos;entrepreneurs Sen React.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-[color:var(--color-muted)]">
            Femmes, jeunes et acteurs de changement engagés dans la transition numérique et
            écologique au Sénégal et en Afrique de l&apos;Ouest. Profils vérifiés par REACT, mises
            en relation directes, accès aux opportunités curées.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/annuaire"
              className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Découvrir l&apos;annuaire
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-accent)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)] hover:text-white"
            >
              Créer mon profil
            </Link>
          </div>
        </div>

        <div className="flex items-center">
          {profiles.length === 0 ? (
            <div className="w-full rounded-xl border border-dashed border-[color:var(--color-accent)] bg-white p-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                Le réseau s&apos;ouvre
              </p>
              <p className="mt-3 text-base text-[color:var(--color-fg)]">
                Soyez parmi les premier·ère·s entrepreneur·e·s à rejoindre l&apos;annuaire Sen
                React. Les profils s&apos;afficheront ici dès leur inscription et vérification.
              </p>
            </div>
          ) : (
            <ul className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {profiles.map((profile) => {
                const sector = profile.sector_slug
                  ? (SECTORS.find((s) => s.slug === profile.sector_slug)?.fr ?? null)
                  : null;
                const subtitle = sector ?? profile.region ?? profile.organisation_label ?? null;
                return (
                  <li key={profile.directory_slug}>
                    <Link
                      href={`/annuaire/${profile.directory_slug}`}
                      className="block h-full rounded-lg border border-[color:var(--color-border)] bg-white p-4 transition-colors hover:border-[color:var(--color-accent)]"
                    >
                      <p className="text-sm font-semibold leading-tight text-[color:var(--color-fg)]">
                        {profile.display_name}
                      </p>
                      {subtitle ? (
                        <p className="mt-1 line-clamp-2 text-xs text-[color:var(--color-muted)]">
                          {subtitle}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
