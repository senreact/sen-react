import { LexicalRichText } from "@/components/content/LexicalRichText";
import type { AboutPage } from "@/lib/cms";

interface LegalNoteProps {
  data: AboutPage["legal"];
}

/**
 * Legal status footnote per D011. Body is Lexical rich-text so the
 * registration number renders in monospace via the Lexical `code`
 * format, and editors can refine wording without a code change.
 */
export function LegalNote({ data }: LegalNoteProps) {
  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          {data.label}
        </p>
        <div className="mt-2 text-sm text-[color:var(--color-muted)]">
          <LexicalRichText content={data.body} />
        </div>
      </div>
    </section>
  );
}
