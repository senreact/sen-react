/**
 * Mission + Vision section. FR strings are VERBATIM from decisions
 * log §A1 (Amadou's discovery response, 2026-05-04). Do not paraphrase.
 * If a translation pass adds EN, this component branches by locale —
 * the FR canonical strings stay untouched.
 */

const MISSION_FR =
  "Notre mission est de favoriser la transition digitale et écologique au profit du développement économique durable. Notre objectif est de renforcer les capacités d'autonomisation et d'innovation des entrepreneurs africains afin de promouvoir un entrepreneuriat durable et compétitif, tout en luttant contre les effets du changement climatique.";

const VISION_FR =
  "Être un leader incontournable de la révolution digitale en Afrique de l'Ouest et accroître considérablement notre impact sur le développement économique durable des entrepreneurs.";

export function MissionVision() {
  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              Mission
            </p>
            <h2 className="mb-4 text-2xl font-bold leading-tight">
              Renforcer l&apos;autonomisation et l&apos;innovation des entrepreneurs africains.
            </h2>
            <p className="text-base text-[color:var(--color-muted)]">{MISSION_FR}</p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              Vision
            </p>
            <h2 className="mb-4 text-2xl font-bold leading-tight">
              Devenir un leader de la révolution digitale en Afrique de l&apos;Ouest.
            </h2>
            <p className="text-base text-[color:var(--color-muted)]">{VISION_FR}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
