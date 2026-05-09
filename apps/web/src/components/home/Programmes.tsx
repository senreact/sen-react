import { PROGRAMMES } from "@/data/programmes";

/**
 * Programmes section. Per decisions log §D021 (Q1 confirmed by Amadou
 * on 2026-05-07), three currently-active REACT programmes:
 *
 *   1. Projet Sen React — this platform itself, headline
 *   2. Projet 3A
 *   3. IA for Change
 *
 * The headline (Sen React) gets the green-bordered, full-width
 * treatment; the two active programmes share the row below as
 * solid-bordered cards. No more placeholders — earlier v1 shipped
 * three "À venir" cards while we waited for Q1; that's now replaced
 * with real content from `apps/web/src/data/programmes.ts`.
 */
export function Programmes() {
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
          {PROGRAMMES.map((programme) => {
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
