import { LexicalRichText } from "@/components/content/LexicalRichText";
import type { AboutPage } from "@/lib/cms";

interface FoundingProps {
  data: AboutPage["founding"];
}

/**
 * Founding story. Body is Lexical rich-text so editors can refine
 * dates, founder names, and inline emphasis without a code change.
 */
export function Founding({ data }: FoundingProps) {
  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
          {data.eyebrow}
        </p>
        <h2 className="mb-6 text-3xl font-bold leading-tight">{data.headline}</h2>
        <div className="space-y-4 text-base text-[color:var(--color-muted)]">
          <LexicalRichText content={data.body} />
        </div>
      </div>
    </section>
  );
}
