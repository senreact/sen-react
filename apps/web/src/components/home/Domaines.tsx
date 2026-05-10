import { getHomepageDomaines } from "@/lib/cms";

/**
 * Homepage Domaines section — 4 cross-cutting editorial pillars.
 *
 * Sources from the Payload `homepage-domaines` global so REACT can
 * refine wording or reorder pillars without a code change. These pillars
 * sit ABOVE the 10 sectors taxonomy: sectors drive opportunities and
 * businesses; domaines are the rhetorical framing.
 */
export async function Domaines() {
  const domaines = await getHomepageDomaines();
  if (domaines.pillars.length === 0) return null;

  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            {domaines.eyebrow}
          </p>
          <h2 className="text-3xl font-bold leading-tight">{domaines.headline}</h2>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2">
          {domaines.pillars.map((pillar) => (
            <li
              key={pillar.title}
              className="rounded-lg border border-[color:var(--color-border)] p-6 transition-colors hover:border-[color:var(--color-accent)]"
            >
              <h3 className="mb-2 text-lg font-semibold">{pillar.title}</h3>
              <p className="text-sm text-[color:var(--color-muted)]">{pillar.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
