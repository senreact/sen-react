import type { Metadata } from "next";

import { EmptyState } from "@/components/content/EmptyState";
import { VideoCard } from "@/components/content/VideoCard";
import { getEmptyStates, listVideos } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Vidéos — Sen React",
  description:
    "Capsules, entretiens, vlogs et témoignages produits par REACT et ses partenaires. Sous-titres FR et Wolof, téléchargement offline disponible.",
};

/**
 * /videos — Video index. Per D016 the videos are hosted on YouTube
 * (free, suited to SN bandwidth). Cards link out to YouTube; per-video
 * embedded reader with subtitles + offline download ships in PR-3c.
 */
export default async function VideosPage() {
  const [videos, emptyStates] = await Promise.all([listVideos(), getEmptyStates()]);

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Vidéos
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Capsules, entretiens et témoignages.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            REACT produit et partage des vidéos pour rendre accessibles les enjeux et les
            opportunités de l&apos;entrepreneuriat sénégalais et africain. Sous-titres en français
            et en wolof.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          {videos.length === 0 ? (
            <EmptyState
              title={emptyStates.videos.title}
              description={emptyStates.videos.description}
            />
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
