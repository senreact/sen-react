import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSector } from "@sen-react/shared";

import { LexicalRichText } from "@/components/content/LexicalRichText";
import { absoluteMediaUrl, getResourceBySlug } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const TYPE_LABEL: Record<string, string> = {
  guide: "Guide pratique",
  "fiche-technique": "Fiche technique",
  modele: "Modèle",
  checklist: "Checklist",
  rapport: "Rapport",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) return { title: "Ressource introuvable — Sen React" };
  return {
    title: `${resource.title} — Sen React`,
    description: resource.summary,
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  const sector = resource.sector ? getSector(resource.sector) : null;
  const fileUrl =
    typeof resource.file === "object" && resource.file
      ? absoluteMediaUrl(resource.file.url ?? null)
      : null;

  return (
    <main>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-sm">
          <Link href="/ressources" className="text-[color:var(--color-accent)] hover:underline">
            ← Toutes les ressources
          </Link>
        </nav>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
            <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              {TYPE_LABEL[resource.resourceType] ?? resource.resourceType}
            </span>
            {sector ? (
              <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">
                {sector.fr}
              </span>
            ) : null}
            <time dateTime={resource.publishedAt}>{formatDateFr(resource.publishedAt)}</time>
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{resource.title}</h1>

          <p className="mt-4 text-lg text-[color:var(--color-muted)]">{resource.summary}</p>

          {fileUrl ? (
            <div className="mt-6">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Télécharger (PDF) →
              </a>
            </div>
          ) : null}
        </header>

        {resource.body ? <LexicalRichText content={resource.body} /> : null}
      </article>
    </main>
  );
}
