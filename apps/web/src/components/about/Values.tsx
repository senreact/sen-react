/**
 * Three values per decisions log §A1: Leadership · Inclusion numérique ·
 * Développement économique durable. Replaces the earlier "inclusive,
 * practical, accessible, collaborative" placeholder Amadou used in his
 * draft — the three above are canonical.
 */

interface Value {
  title: string;
  description: string;
}

const VALUES: Value[] = [
  {
    title: "Leadership",
    description:
      "Former une génération d'entrepreneurs et d'entrepreneures capables de porter une transformation économique et sociale durable au Sénégal et en Afrique de l'Ouest.",
  },
  {
    title: "Inclusion numérique",
    description:
      "Faire du numérique un levier d'autonomisation pour celles et ceux qui en sont aujourd'hui les plus éloignés — femmes, jeunes, communautés vulnérables.",
  },
  {
    title: "Développement économique durable",
    description:
      "Soutenir une croissance qui crée des emplois verts et résilients, en cohérence avec les enjeux climatiques et écologiques du continent.",
  },
];

export function Values() {
  return (
    <section className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Nos valeurs
          </p>
          <h2 className="text-3xl font-bold leading-tight">Trois principes qui nous guident</h2>
        </header>

        <ul className="grid gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
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
