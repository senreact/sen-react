/**
 * Founding story. Dates and founder names are facts from decisions
 * log §A1 + D011 — not editorial — so they're inlined as plain
 * strings, not coming from a CMS yet.
 */
export function Founding() {
  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
          Notre histoire
        </p>
        <h2 className="mb-6 text-3xl font-bold leading-tight">
          Né d&apos;une initiative post-COVID, relancé pour la transition.
        </h2>
        <div className="space-y-4 text-base text-[color:var(--color-muted)]">
          <p>
            REACT a été créé le <strong>20 mai 2021</strong> par <strong>Elhadj Amadou Samb</strong>
            , Directeur Exécutif, et <strong>Cheikh Oumar Kane</strong>, Secrétaire Général, comme
            une initiative de résilience entrepreneuriale dans le contexte post-COVID-19.
            L&apos;objectif initial : redonner du souffle aux entreprises sénégalaises fragilisées
            par la crise sanitaire et économique.
          </p>
          <p>
            En <strong>2024</strong>, REACT s&apos;est repositionné autour d&apos;un axe plus
            ambitieux : faire de la <strong>transition numérique</strong> et de la{" "}
            <strong>transition écologique</strong> les deux piliers de l&apos;émancipation
            économique des femmes, des jeunes et des communautés vulnérables. C&apos;est cette
            vision qui structure aujourd&apos;hui Sen React.
          </p>
        </div>
      </div>
    </section>
  );
}
