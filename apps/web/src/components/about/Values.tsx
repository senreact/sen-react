import type { AboutPage } from "@/lib/cms";

interface ValuesProps {
  data: AboutPage["values"];
}

/**
 * Three values per decisions log §A1. Sourced from the about-page CMS
 * global so REACT can refine wording or reorder values without a code
 * change.
 */
export function Values({ data }: ValuesProps) {
  if (data.items.length === 0) return null;
  return (
    <section className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            {data.eyebrow}
          </p>
          <h2 className="text-3xl font-bold leading-tight">{data.headline}</h2>
        </header>

        <ul className="grid gap-6 md:grid-cols-3">
          {data.items.map((value) => (
            <li
              key={value.title}
              className="rounded-lg border border-[color:var(--color-border)] p-6 transition-colors hover:border-[color:var(--color-accent)]"
            >
              <h3 className="mb-3 text-lg font-semibold">{value.title}</h3>
              <p className="text-sm text-[color:var(--color-muted)]">{value.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
