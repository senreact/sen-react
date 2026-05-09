/**
 * Four domaines d'intervention as displayed on senreact.com today
 * (per discovery/site-scrape-findings.md §5). These are cross-cutting
 * editorial themes that sit ABOVE the 10 sectors data — sectors are
 * the taxonomy used for opportunities and businesses; domaines are
 * the rhetorical framing.
 *
 * Strings are FR primary per D010 Q2.
 */

interface Domaine {
  title: string;
  description: string;
}

const DOMAINES: Domaine[] = [
  {
    title: "Entrepreneuriat",
    description:
      "Accompagner la création, la formalisation et la croissance des entreprises portées par des femmes et des jeunes au Sénégal et en Afrique de l'Ouest.",
  },
  {
    title: "Environnement",
    description:
      "Promouvoir une économie verte, l'agroécologie et les énergies renouvelables comme leviers de résilience face au changement climatique.",
  },
  {
    title: "Digitalisation et technologie",
    description:
      "Faire de la transition numérique un moteur d'inclusion économique — applications mobiles, civic tech, fintech, IA, services numériques.",
  },
  {
    title: "Leadership de transformation",
    description:
      "Former une génération de leaders engagés capables de porter le changement social, économique et environnemental sur le continent.",
  },
];

export function Domaines() {
  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Domaines d&apos;intervention
          </p>
          <h2 className="text-3xl font-bold leading-tight">
            Quatre piliers, une mission cohérente
          </h2>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2">
          {DOMAINES.map((domaine) => (
            <li
              key={domaine.title}
              className="rounded-lg border border-[color:var(--color-border)] p-6 transition-colors hover:border-[color:var(--color-accent)]"
            >
              <h3 className="mb-2 text-lg font-semibold">{domaine.title}</h3>
              <p className="text-sm text-[color:var(--color-muted)]">{domaine.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
