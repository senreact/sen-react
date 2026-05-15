import Link from "next/link";
import type { Route } from "next";

import { getSector } from "@sen-react/shared";

import type { NewsArticle } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface NewsCardProps {
  article: NewsArticle;
}

/**
 * News article card on the /actualites index. Title links to
 * /actualites/[slug] for the full reader. Dynamic-segment route is
 * runtime-cast through `Route` because typedRoutes doesn't enumerate
 * dynamic segments at build time — same pattern as SectorCard.
 */
export function NewsCard({ article }: NewsCardProps) {
  const sector = getSector(article.sector);
  const href = `/actualites/${article.slug}` as unknown as Route;
  return (
    <li className="flex flex-col rounded-lg border border-[color:var(--color-border)] bg-white p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
        {sector ? (
          <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            {sector.fr}
          </span>
        ) : null}
        <time dateTime={article.publishedAt}>{formatDateFr(article.publishedAt)}</time>
        {article.writePath === "aggregated" ? (
          <span className="text-[color:var(--color-muted)]">· Agrégé</span>
        ) : null}
      </div>
      <h3 className="mb-2 text-lg font-semibold leading-tight">
        <Link
          href={href}
          className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent)]"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mb-4 text-sm text-[color:var(--color-muted)]">{article.summary}</p>
      <Link
        href={href}
        className="mt-auto inline-flex w-fit items-center gap-1 rounded-md border border-[color:var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)] hover:text-white"
        aria-label={`Lire l'article : ${article.title}`}
      >
        Lire l&apos;article
        <span aria-hidden="true">→</span>
      </Link>
    </li>
  );
}
