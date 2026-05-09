import Link from "next/link";
import type { Route } from "next";

import { getSector } from "@sen-react/shared";

import type { Publication } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface PublicationCardProps {
  publication: Publication;
}

/**
 * Publication card with download CTA. Per D020 publications are fully
 * open-access — no auth gating. The CMS stores the file as a Media
 * upload; we render a direct download link when the URL is populated.
 */
export function PublicationCard({ publication }: PublicationCardProps) {
  const sector = publication.sector ? getSector(publication.sector) : undefined;
  const fileUrl =
    typeof publication.file === "object" && publication.file ? publication.file.url : null;
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
      {fileUrl ? (
        <a
          href={fileUrl}
          className="mt-auto inline-flex items-center gap-2 self-start rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          download
        >
          Télécharger le PDF
        </a>
      ) : (
        <span className="mt-auto text-xs italic text-[color:var(--color-muted)]">
          Fichier non disponible.
        </span>
      )}
    </li>
  );
}
