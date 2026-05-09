import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSector } from "@sen-react/shared";

import { getPublicationBySlug } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const LANGUAGE_FR: Record<"fr" | "en" | "wo", string> = {
  fr: "Français",
  en: "Anglais",
  wo: "Wolof",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);
  if (!publication) {
    return { title: "Publication introuvable — Sen React" };
  }
  return {
    title: `${publication.title} — Sen React`,
    description: publication.summary,
  };
}

function bytesToHumanReadable(bytes: number | undefined): string | null {
  if (!bytes || bytes <= 0) return null;
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${mb.toFixed(1)} MB`;
}

/**
 * /publications/[slug] — Publication detail page.
 *
 * Per D020 publications are fully open-access — no auth gate. Detail
 * surface gives the reader more breathing room than the index card:
 * full summary, author block, language, file size, large download CTA.
 *
 * The PDF download is a direct link to the Media URL from Payload — the
 * browser's native download handles content-disposition; we don't proxy.
 */
export default async function PublicationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);
  if (!publication) notFound();

  const sector = publication.sector ? getSector(publication.sector) : undefined;
  const file = typeof publication.file === "object" && publication.file ? publication.file : null;
  const fileSize = bytesToHumanReadable(file?.filesize);
  const authors = publication.authors ?? [];

  return (
    <main>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-sm">
          <Link href="/publications" className="text-[color:var(--color-accent)] hover:underline">
            ← Toutes les publications
          </Link>
        </nav>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
            {sector ? (
              <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                {sector.fr}
              </span>
            ) : (
              <span className="font-semibold uppercase tracking-wide">Transversal</span>
            )}
            <time dateTime={publication.publishedAt}>{formatDateFr(publication.publishedAt)}</time>
            <span>· {LANGUAGE_FR[publication.language] ?? "Français"}</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{publication.title}</h1>
          <p className="mt-4 text-lg text-[color:var(--color-muted)]">{publication.summary}</p>
        </header>

        {authors.length > 0 ? (
          <section className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              Auteurs
            </p>
            <ul className="space-y-1 text-sm text-[color:var(--color-muted)]">
              {authors.map((a) => (
                <li key={a.name}>
                  <span className="font-semibold text-[color:var(--color-foreground)]">
                    {a.name}
                  </span>
                  {a.role ? <span> — {a.role}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {file?.url ? (
          <section className="rounded-lg border border-[color:var(--color-border)] bg-white p-6">
            <p className="mb-2 font-semibold">Téléchargement libre</p>
            <p className="mb-4 text-sm text-[color:var(--color-muted)]">
              Cette publication est en accès libre — aucune inscription requise.
              {fileSize ? ` Fichier ${fileSize}.` : ""}
            </p>
            <a
              href={file.url}
              download
              className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Télécharger le PDF
            </a>
          </section>
        ) : (
          <p className="text-sm italic text-[color:var(--color-muted)]">
            Le fichier de cette publication n&apos;est pas encore disponible.
          </p>
        )}
      </article>
    </main>
  );
}
