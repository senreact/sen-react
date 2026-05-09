import Link from "next/link";

import { getSector } from "@sen-react/shared";

import { listNews } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

/**
 * Latest news block — pulls the 3 most recent published articles from
 * the Payload News collection. When the CMS isn't yet deployed (Phase 1
 * reality, env var unset) or returns no rows, the same dashed
 * placeholder cards as Phase 2 keep the layout intact instead of
 * rendering an empty section.
 *
 * Generic dates ("Bientôt") were retained in the placeholder slots
 * because fake real-looking dates that age in production are worse
 * than honestly-empty cards.
 */
const PLACEHOLDER_NEWS = [
  {
    eyebrow: "Bientôt",
    title: "Premier article à publier dès le lancement",
    excerpt:
      "Cette section accueillera les actualités, opportunités et publications éditées par l'équipe REACT.",
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

export async function LatestNews() {
  const articles = await listNews(3);

  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              Actualités
            </p>
            <h2 className="text-3xl font-bold leading-tight">Dernières publications</h2>
          </div>
          <Link
            href="/actualites"
            className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
          >
            Toutes les actualités →
          </Link>
        </header>

        {articles.length === 0 ? (
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
        ) : (
          <ul className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => {
              const sector = getSector(article.sector);
              return (
                <li
                  key={article.id}
                  className="flex flex-col rounded-lg border border-[color:var(--color-border)] bg-white p-6"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                    {sector?.fr ?? "Actualité"}
                  </p>
                  <h3 className="mb-2 text-base font-semibold leading-tight">{article.title}</h3>
                  <p className="mb-3 text-sm text-[color:var(--color-muted)]">{article.summary}</p>
                  <time
                    dateTime={article.publishedAt}
                    className="mt-auto text-xs text-[color:var(--color-muted)]"
                  >
                    {formatDateFr(article.publishedAt)}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
