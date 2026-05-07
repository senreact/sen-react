import { SECTORS } from "@sen-react/shared";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-[color:var(--color-accent)]">
          Sen React — Phase 0
        </p>
        <h1 className="text-4xl font-bold leading-tight">Plateforme en cours de construction</h1>
        <p className="mt-4 text-[color:var(--color-muted)]">
          Cette page de démarrage confirme que la base technique fonctionne. Le contenu réel
          arrivera à partir de la phase 2.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold">Secteurs d&apos;intervention ({SECTORS.length})</h2>
        <ul className="mt-4 space-y-2">
          {SECTORS.map((sector) => (
            <li key={sector.slug} className="rounded-md border border-slate-200 px-4 py-3">
              <p className="font-medium">{sector.fr}</p>
              <p className="text-sm text-[color:var(--color-muted)]">{sector.scopeFr}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
