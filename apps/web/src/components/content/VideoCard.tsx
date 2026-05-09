import Link from "next/link";
import type { Route } from "next";

import { getSector } from "@sen-react/shared";

import type { Video } from "@/lib/cms";
import { formatDateFr, formatDurationMmSs } from "@/lib/format";

interface VideoCardProps {
  video: Video;
}

const VIDEO_TYPE_FR: Record<Video["videoType"], string> = {
  capsule: "Capsule",
  explanation: "Explication",
  interview: "Entretien",
  vlog: "Vlog",
  testimonial: "Témoignage",
};

/**
 * Video card on the /videos index. Uses YouTube's lightweight thumbnail
 * (`hqdefault.jpg`) rather than embedding an iframe per item — the index
 * page would be unusable on a mid-tier mobile if every card hydrated a
 * player. The card links to /videos/[slug] where the embedded player +
 * subtitle tracks live.
 */
export function VideoCard({ video }: VideoCardProps) {
  const sector = video.sector ? getSector(video.sector) : undefined;
  const thumb = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
  const detailHref = `/videos/${video.slug}` as unknown as Route;
  const duration = formatDurationMmSs(video.duration);

  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white">
      <Link href={detailHref} className="group relative block aspect-video bg-black">
        {/* YouTube serves a static thumbnail at this URL — plain <img>
            keeps the index page light (no API call, no embed); next/image
            would buy nothing here since the source is already CDN-served. */}
        <img
          src={thumb}
          alt={video.title}
          className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
          loading="lazy"
        />
        {duration ? (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-semibold text-white">
            {duration}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
          <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            {VIDEO_TYPE_FR[video.videoType]}
          </span>
          {sector ? <span>{sector.fr}</span> : null}
          <time dateTime={video.publishedAt}>· {formatDateFr(video.publishedAt)}</time>
        </div>
        <h3 className="mb-2 text-lg font-semibold leading-tight">
          <Link
            href={detailHref}
            className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent)]"
          >
            {video.title}
          </Link>
        </h3>
        <p className="text-sm text-[color:var(--color-muted)]">{video.summary}</p>
      </div>
    </li>
  );
}
