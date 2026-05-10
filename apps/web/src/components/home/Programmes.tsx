import { listProgrammes } from "@/lib/cms";

/**
 * Programmes section. Pulls active programmes from the Payload
 * Programmes collection (D008 — no hardcoded copy). The `headline`
 * variant gets the green-bordered, full-width treatment; `active`
 * programmes share the row below as solid-bordered cards.
 */
export async function Programmes() {
  const programmes = await listProgrammes();
  if (programmes.length === 0) return null;

  return (
    <section className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Programmes
          </p>
          <h2 className="text-3xl font-bold leading-tight">Nos initiatives en action</h2>
        </header>

        <ul className="grid gap-6 lg:grid-cols-2">
          {programmes.map((programme) => {
            const isHeadline = programme.variant === "headline";
            return (
              <li
                key={programme.slug}
                className={
                  isHeadline
                    ? "rounded-lg border-2 border-[color:var(--color-accent)] bg-white p-6 lg:col-span-2"
                    : "rounded-lg border border-[color:var(--color-border)] p-6"
                }
              >
                <p
                  className={
                    isHeadline
                      ? "mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-accent)]"
                      : "mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]"
                  }
                >
                  {programme.eyebrow}
                </p>
                <h3
                  className={isHeadline ? "mb-2 text-2xl font-bold" : "mb-2 text-lg font-semibold"}
                >
                  {programme.title}
                </h3>
                <p className="text-sm text-[color:var(--color-muted)]">{programme.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
