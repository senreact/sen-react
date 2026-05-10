import type { AboutPage } from "@/lib/cms";

interface AboutHeroProps {
  data: AboutPage["hero"];
}

/**
 * /a-propos hero. Lighter than the homepage hero — this page is
 * editorial, not promotional. Content from the about-page CMS global.
 */
export function AboutHero({ data }: AboutHeroProps) {
  return (
    <section className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
          {data.eyebrow}
        </p>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">{data.headline}</h1>
        <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
          {data.leadParagraph}
        </p>
      </div>
    </section>
  );
}
