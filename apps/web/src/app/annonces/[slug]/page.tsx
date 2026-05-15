import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LexicalRichText } from "@/components/content/LexicalRichText";
import { getAnnouncementBySlug } from "@/lib/cms";
import { formatDateFr } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_LABEL: Record<string, string> = {
  general: "Général",
  urgent: "Urgent",
  "platform-update": "Mise à jour plateforme",
  partnership: "Partenariat",
};

const CATEGORY_STYLE: Record<string, string> = {
  general: "bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]",
  urgent: "bg-red-50 text-red-600",
  "platform-update": "bg-blue-50 text-blue-600",
  partnership: "bg-green-50 text-green-700",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);
  if (!announcement) return { title: "Annonce introuvable — Sen React" };
  return { title: `${announcement.title} — Sen React` };
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);
  if (!announcement) notFound();

  return (
    <main>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-sm">
          <Link href="/annonces" className="text-[color:var(--color-accent)] hover:underline">
            ← Toutes les annonces
          </Link>
        </nav>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-full px-3 py-1 font-semibold uppercase tracking-wide ${CATEGORY_STYLE[announcement.category] ?? CATEGORY_STYLE.general}`}
            >
              {CATEGORY_LABEL[announcement.category] ?? announcement.category}
            </span>
            <time
              className="text-[color:var(--color-muted)]"
              dateTime={announcement.publishedAt}
            >
              {formatDateFr(announcement.publishedAt)}
            </time>
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{announcement.title}</h1>
        </header>

        <LexicalRichText content={announcement.body} />
      </article>
    </main>
  );
}
