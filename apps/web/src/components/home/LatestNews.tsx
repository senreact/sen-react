/**
 * Latest news block. Phase 2 placeholder until the news/blog collection
 * lands in Phase 3 (Content engine). Three placeholder slots labelled
 * honestly — when Phase 3 ships, this component reads from the Payload
 * news collection instead of the hardcoded array, but the layout stays
 * the same.
 *
 * Date strings are intentionally generic ("Bientôt") rather than fake
 * dates — fake dates that age in production are worse than empty slots.
 */

interface NewsCard {
  eyebrow: string;
  title: string;
  excerpt: string;
}

const PLACEHOLDER_NEWS: NewsCard[] = [
  {
    eyebrow: "Bientôt",
    title: "Premier article à publier dès le lancement",
    excerpt:
      "Cette section accueillera les actualités, opportunités et publications éditées par l'équipe REACT. Le contenu réel arrive avec la phase 3.",
  },
  {
    eyebrow: "Bientôt",
    title: "Témoignages d'entrepreneurs accompagnés",
    excerpt:
      "Nous publierons régulièrement les parcours de femmes et de jeunes formés et accompagnés à travers nos programmes.",
  },
  {
    eyebrow: "Bientôt",
    title: "Analyses et publications de fond",
    excerpt:
      "Études, rapports et notes de réflexion sur l'entrepreneuriat sénégalais et africain — préparés par REACT.",
  },
];

export function LatestNews() {
  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Actualités
          </p>
          <h2 className="text-3xl font-bold leading-tight">Dernières publications</h2>
        </header>

        <ul className="grid gap-6 md:grid-cols-3">
          {PLACEHOLDER_NEWS.map((item) => (
            <li
              key={item.title}
              className="flex flex-col rounded-lg border border-dashed border-[color:var(--color-border)] p-6"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
                {item.eyebrow}
              </p>
              <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
              <p className="text-sm text-[color:var(--color-muted)]">{item.excerpt}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
