import type { AboutPage } from "@/lib/cms";

interface MissionVisionProps {
  mission: AboutPage["mission"];
  vision: AboutPage["vision"];
}

/**
 * Mission + Vision section. FR copy is verbatim from decisions log
 * §A1 (Amadou's discovery response, 2026-05-04). Lives in the
 * about-page CMS global so editors can refine without a code change.
 */
export function MissionVision({ mission, vision }: MissionVisionProps) {
  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              {mission.eyebrow}
            </p>
            <h2 className="mb-4 text-2xl font-bold leading-tight">{mission.sectionTitle}</h2>
            <p className="text-base text-[color:var(--color-muted)]">{mission.body}</p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              {vision.eyebrow}
            </p>
            <h2 className="mb-4 text-2xl font-bold leading-tight">{vision.sectionTitle}</h2>
            <p className="text-base text-[color:var(--color-muted)]">{vision.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
