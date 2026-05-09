import Link from "next/link";

import { partnerStripSelection } from "@/data/partners";

/**
 * Partner strip. Renders the 10 real partners from D011 (3 institutions +
 * 7 NGOs) as a name grid, with a CTA to /partenaires for the full
 * descriptions. Logos pending REACT-side per docs/pending-react-input.md;
 * the strip ships names-only until they arrive — the layout doesn't
 * shift when logos replace the text.
 */
export function PartnerStrip() {
  const partners = partnerStripSelection();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Partenaires
          </p>
          <h2 className="text-3xl font-bold leading-tight">Ils nous accompagnent</h2>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">
            Trois institutions publiques sénégalaises et sept organisations de la société civile.
            Les logos officiels arriveront avec la confirmation visuelle.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {partners.map((partner) => (
            <li
              key={partner.slug}
              className="flex min-h-[5rem] items-center justify-center rounded-md border border-dashed border-[color:var(--color-border)] px-3 py-3 text-center text-xs font-semibold leading-tight text-[color:var(--color-fg)]"
            >
              {partner.name}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link
            href="/partenaires"
            className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
          >
            Voir tous les partenaires →
          </Link>
        </div>
      </div>
    </section>
  );
}
