import Link from "next/link";
import type { Route } from "next";

import { getSector } from "@sen-react/shared";

import { absoluteMediaUrl, type Publication } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface PublicationCardProps {
  publication: Publication;
}

/**
 * Publication card. Per D020 publications are fully open-access — no auth
 * gating. Publications are now web-native: the primary CTA opens the full
 * article ("Lire en ligne"); when a PDF is also attached we surface a
 * secondary download link.
 */
export function PublicationCard({ publication }: PublicationCardProps) {
  const sector = publication.sector ? getSector(publication.sector) : undefined;
  const fileUrl = absoluteMediaUrl(
    typeof publication.file === "object" && publication.file ? publication.file.url : null,
  );
  const authors = publication.authors ?? [];
  const detailHref = `/publications/${publication.slug}` as unknown as Route;

  return (
    <li className="flex flex-col rounded-lg border border-[color:var(--color-border)] bg-white p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
        {sector ? (
          <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            {sector.fr}
          </span>
        ) : (
          <span className="font-semibold uppercase tracking-wide">Transversal</span>
        )}
        <time dateTime={publication.publishedAt}>{formatDateFr(publication.publishedAt)}</time>
      </div>
      <h3 className="mb-2 text-lg font-semibold leading-tight">
        <Link
          href={detailHref}
          className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent)]"
        >
          {publication.title}
        </Link>
      </h3>
      <p className="mb-4 text-sm text-[color:var(--color-muted)]">{publication.summary}</p>
      {authors.length > 0 ? (
        <p className="mb-4 text-xs text-[color:var(--color-muted)]">
          {authors.map((a) => a.name).join(", ")}
        </p>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-3">
        <Link
          href={detailHref}
          className="inline-flex items-center gap-2 self-start rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Lire en ligne
        </Link>
        {fileUrl ? (
          <a
            href={fileUrl}
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
            download
          >
            Télécharger le PDF
          </a>
        ) : null}
      </div>
    </li>
  );
}
