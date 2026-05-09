import { getSector } from "@sen-react/shared";

import type { NewsArticle } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface NewsCardProps {
  article: NewsArticle;
}

/**
 * News article card. Title isn't a link yet — the per-article reader
 * (`/actualites/[slug]`) ships in PR-3c. For now the index communicates
 * what's coming and shows the sector + date so readers can scan.
 */
export function NewsCard({ article }: NewsCardProps) {
  const sector = getSector(article.sector);
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
      <h3 className="mb-2 text-lg font-semibold leading-tight">{article.title}</h3>
      <p className="text-sm text-[color:var(--color-muted)]">{article.summary}</p>
    </li>
  );
}
