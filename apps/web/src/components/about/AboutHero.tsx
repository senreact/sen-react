/**
 * /a-propos hero. Lighter than the homepage hero — this page is
 * editorial, not promotional. Eyebrow + headline + a one-line lead-in.
 * Mission and vision get their own full-width section below.
 */
export function AboutHero() {
  return (
    <section className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
          À propos de REACT
        </p>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          Un réseau pour réinventer l&apos;entrepreneuriat sénégalais et africain.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
          REACT (Réseau des Entrepreneurs Actifs) accompagne les femmes, les jeunes et les
          communautés vulnérables dans la transition numérique et écologique. Sen React est la
          plateforme qui matérialise ce projet.
        </p>
      </div>
    </section>
  );
}
