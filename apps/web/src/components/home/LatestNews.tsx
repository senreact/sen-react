import Link from "next/link";
import type { Route } from "next";

import { getSector } from "@sen-react/shared";

import { getEmptyStates, listNews } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

/**
 * Latest news block — pulls the 3 most recent published articles from
 * the Payload News collection. When the CMS returns no published rows,
 * falls back to the editor-curated placeholder cards stored in the
 * `empty-states` global so REACT can refine the placeholder copy
 * without a code change.
 *
 * Generic dates ("Bientôt") are retained in the placeholder slots
 * because fake real-looking dates that age in production are worse
 * than honestly-empty cards.
 */
export async function LatestNews() {
  const [articles, emptyStates] = await Promise.all([listNews(3), getEmptyStates()]);
  const placeholders = emptyStates.homepageLatestNewsFallback;

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
            {placeholders.map((item) => (
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
              const href = `/actualites/${article.slug}` as unknown as Route;
              return (
                <li
                  key={article.id}
                  className="flex flex-col rounded-lg border border-[color:var(--color-border)] bg-white p-6"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                    {sector?.fr ?? "Actualité"}
                  </p>
                  <h3 className="mb-2 text-base font-semibold leading-tight">
                    <Link
                      href={href}
                      className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent)]"
                    >
                      {article.title}
                    </Link>
                  </h3>
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
