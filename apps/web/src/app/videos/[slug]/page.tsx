import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSector } from "@sen-react/shared";

import { getVideoBySlug } from "@/lib/cms";
import { formatDateFr, formatDurationMmSs } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const VIDEO_TYPE_FR: Record<string, string> = {
  capsule: "Capsule",
  explanation: "Explication",
  interview: "Entretien",
  vlog: "Vlog",
  testimonial: "Témoignage",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) {
    return { title: "Vidéo introuvable — Sen React" };
  }
  return {
    title: `${video.title} — Sen React`,
    description: video.summary,
  };
}

/**
 * /videos/[slug] — Video reader.
 *
 * Per D016 + decisions log §A4: YouTube embed (free, suited to SN
 * bandwidth), FR + Wolof subtitle slots, optional offline download URL.
 *
 * The iframe uses youtube-nocookie.com per privacy default — the user
 * hasn't consented to YouTube cookies just by visiting the page; the
 * privacy-enhanced domain defers cookie writes until the user clicks
 * play. `cc_load_policy=1` forces captions on by default per Amadou's
 * accessibility-first stance.
 */
export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) notFound();

  const sector = video.sector ? getSector(video.sector) : undefined;
  const duration = formatDurationMmSs(video.duration);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?cc_load_policy=1&modestbranding=1`;

  return (
    <main>
      <article className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-sm">
          <Link href="/videos" className="text-[color:var(--color-accent)] hover:underline">
            ← Toutes les vidéos
          </Link>
        </nav>

        <header className="mb-6">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
            <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              {VIDEO_TYPE_FR[video.videoType] ?? video.videoType}
            </span>
            {sector ? <span>{sector.fr}</span> : null}
            <time dateTime={video.publishedAt}>· {formatDateFr(video.publishedAt)}</time>
            {duration ? <span>· {duration}</span> : null}
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">{video.title}</h1>
          <p className="mt-4 text-lg text-[color:var(--color-muted)]">{video.summary}</p>
        </header>

        <div className="mb-8 aspect-video overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-black">
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
            loading="lazy"
          />
        </div>

        {video.downloadUrl ? (
          <section className="mb-6 rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm">
            <p className="mb-1 font-semibold">Téléchargement hors-ligne</p>
            <p className="mb-3 text-[color:var(--color-muted)]">
              Pour les utilisateurs avec une connexion intermittente — téléchargez la vidéo pour une
              lecture sans Internet.
            </p>
            <a
              href={video.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Télécharger la vidéo
            </a>
          </section>
        ) : null}
      </article>
    </main>
  );
}
