import type { Metadata } from "next";

import { PartnerCard } from "@/components/partners/PartnerCard";
import { listPartners } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Partenaires — Sen React",
  description:
    "Les institutions publiques et les organisations de la société civile qui accompagnent REACT au Sénégal et en Afrique de l'Ouest.",
};

/**
 * /partenaires — Phase 2 step 4 per the roadmap §4.
 *
 * Two grouped lists: institutions publiques + société civile / ONG. Pulled
 * from the Payload Partners collection (D008 — no hardcoded copy). Logos
 * pending REACT-side per docs/pending-react-input.md — placeholder marks
 * (initials in brand-green circle) hold the layout until real assets land.
 */
export default async function PartnersPage() {
  const partners = await listPartners();
  const institutions = partners.filter((p) => p.kind === "institution");
  const ngos = partners.filter((p) => p.kind === "ngo");

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Partenaires
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Les organisations qui font avancer le réseau.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Sen React s&apos;appuie sur des institutions publiques sénégalaises et des organisations
            de la société civile pour mener à bien sa mission. Les logos officiels seront ajoutés à
            mesure que les accords visuels sont finalisés.
          </p>
        </div>
      </section>

      {institutions.length > 0 ? (
        <section className="border-b border-[color:var(--color-border)]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <header className="mb-10 max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                Institutions publiques
              </p>
              <h2 className="text-3xl font-bold leading-tight">Agences et ministères du Sénégal</h2>
            </header>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {institutions.map((partner) => (
                <PartnerCard key={partner.slug} partner={partner} />
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {ngos.length > 0 ? (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <header className="mb-10 max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                Société civile
              </p>
              <h2 className="text-3xl font-bold leading-tight">Organisations partenaires</h2>
            </header>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ngos.map((partner) => (
                <PartnerCard key={partner.slug} partner={partner} />
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  );
}
