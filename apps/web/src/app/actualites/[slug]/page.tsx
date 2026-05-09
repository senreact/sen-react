import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSector } from "@sen-react/shared";

import { LexicalRichText } from "@/components/content/LexicalRichText";
import { getNewsBySlug } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) {
    return { title: "Article introuvable — Sen React" };
  }
  return {
    title: `${article.title} — Sen React`,
    description: article.summary,
  };
}

/**
 * /actualites/[slug] — News article reader.
 *
 * Fetches the article by slug from the Payload News collection. Body is
 * rendered through `LexicalRichText`, our minimal walker that doesn't
 * pull the full lexical editor bundle into the read-only surface.
 *
 * Aggregated articles surface a "Source originale" link to the upstream
 * publisher (D004 / decisions log §A3 — every aggregated item must
 * credit and link back to the source). REACT-original articles skip
 * that block.
 *
 * No pre-rendering at build time — articles come and go, and the index
 * already lists everything live, so on-demand SSG (`generateStaticParams`
 * omitted) is the right trade-off until article volume justifies it.
 */
export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const sector = getSector(article.sector);

  return (
    <main>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-sm">
          <Link href="/actualites" className="text-[color:var(--color-accent)] hover:underline">
            ← Toutes les actualités
          </Link>
        </nav>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
            {sector ? (
              <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                {sector.fr}
              </span>
            ) : null}
            <time dateTime={article.publishedAt}>{formatDateFr(article.publishedAt)}</time>
            {article.writePath === "aggregated" ? (
              <span className="text-[color:var(--color-muted)]">· Article agrégé</span>
            ) : null}
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg text-[color:var(--color-muted)]">{article.summary}</p>
        </header>

        <LexicalRichText content={article.body} />

        {article.writePath === "aggregated" && article.sourceUrl ? (
          <aside className="mt-10 rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm">
            <p className="mb-2 font-semibold">Source originale</p>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-accent)] underline hover:opacity-80"
            >
              {article.sourceUrl}
            </a>
          </aside>
        ) : null}
      </article>
    </main>
  );
}
