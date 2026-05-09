/**
 * Programmes section. Per the roadmap §3 yellow row + tom-followups-fr.md
 * Q1: Sen React itself is the headline programme; the other three slots
 * are placeholders awaiting Amadou's confirmation of which 3 of the 6
 * legacy senreact.com projects are still active.
 *
 * The placeholder cards are intentionally honest — they say "À venir"
 * (coming soon) rather than dummy text, so a visitor in the interim
 * understands the platform is mid-build and not just shipping fake
 * content. Per Tom's "build now, polish at end" framing, this is the
 * right v1 — when Q1 lands we replace the placeholder structures with
 * real cards, no layout regression.
 */

interface ProgrammeCard {
  /** Visual style — "headline" gets the green-bordered prominent treatment. */
  variant: "headline" | "placeholder";
  eyebrow: string;
  title: string;
  description: string;
}

const PROGRAMMES: ProgrammeCard[] = [
  {
    variant: "headline",
    eyebrow: "Programme phare",
    title: "Sen React",
    description:
      "La plateforme dédiée à la transition numérique et écologique des entrepreneurs sénégalais et africains. Réseau, opportunités, formation, accompagnement — un point d'entrée unique pour les femmes, les jeunes et les communautés vulnérables.",
  },
  {
    variant: "placeholder",
    eyebrow: "Programme actif n° 1",
    title: "À venir",
    description:
      "Détails à confirmer avec REACT. Les programmes actuellement en cours sont en cours de validation pour cette nouvelle plateforme.",
  },
  {
    variant: "placeholder",
    eyebrow: "Programme actif n° 2",
    title: "À venir",
    description:
      "Détails à confirmer avec REACT. Les programmes actuellement en cours sont en cours de validation pour cette nouvelle plateforme.",
  },
  {
    variant: "placeholder",
    eyebrow: "Programme actif n° 3",
    title: "À venir",
    description:
      "Détails à confirmer avec REACT. Les programmes actuellement en cours sont en cours de validation pour cette nouvelle plateforme.",
  },
];

export function Programmes() {
  return (
    <section className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Programmes
          </p>
          <h2 className="text-3xl font-bold leading-tight">Nos initiatives en action</h2>
        </header>

        <ul className="grid gap-6 lg:grid-cols-2">
          {PROGRAMMES.map((programme) => {
            const isHeadline = programme.variant === "headline";
            return (
              <li
                key={programme.eyebrow}
                className={
                  isHeadline
                    ? "rounded-lg border-2 border-[color:var(--color-accent)] bg-white p-6 lg:col-span-2"
                    : "rounded-lg border border-dashed border-[color:var(--color-border)] p-6"
                }
              >
                <p
                  className={
                    isHeadline
                      ? "mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-accent)]"
                      : "mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]"
                  }
                >
                  {programme.eyebrow}
                </p>
                <h3
                  className={isHeadline ? "mb-2 text-2xl font-bold" : "mb-2 text-lg font-semibold"}
                >
                  {programme.title}
                </h3>
                <p className="text-sm text-[color:var(--color-muted)]">{programme.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
