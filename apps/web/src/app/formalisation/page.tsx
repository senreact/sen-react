import type { Metadata } from "next";
import Link from "next/link";

import { listFormalisationSteps } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Formalisation d'entreprise — Sen React",
  description:
    "Guide étape par étape pour formaliser votre entreprise au Sénégal — RCCM, NINEA, APIX, plan d'affaires et gestion financière.",
};

export default async function FormalisationPage() {
  const steps = await listFormalisationSteps();

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Boîte à outils
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Formaliser votre entreprise.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Un parcours guidé, étape par étape, pour créer et formaliser votre entreprise au
            Sénégal — de l&apos;enregistrement au plan d&apos;affaires.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {steps.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-muted)]">
            Le guide de formalisation est en cours de préparation. Revenez bientôt.
          </p>
        ) : (
          <ol className="space-y-6">
            {steps.map((step) => (
              <li
                key={step.id}
                className="flex gap-5 rounded-lg border border-[color:var(--color-border)] bg-white p-5"
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[color:var(--color-accent)] text-sm font-bold text-white">
                  {step.stepNumber}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-3 text-xs text-[color:var(--color-muted)]">
                    {step.agencyName ? <span className="font-semibold">{step.agencyName}</span> : null}
                    {step.estimatedDuration ? <span>· {step.estimatedDuration}</span> : null}
                    {step.estimatedCost ? <span>· {step.estimatedCost}</span> : null}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">
                    <Link
                      href={`/formalisation/${step.slug}`}
                      className="hover:text-[color:var(--color-accent)] hover:underline"
                    >
                      {step.title}
                    </Link>
                  </h3>
                  <p className="mb-3 text-sm text-[color:var(--color-muted)]">{step.summary}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/formalisation/${step.slug}`}
                      className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
                    >
                      Voir la procédure →
                    </Link>
                    {step.externalUrl ? (
                      <a
                        href={step.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
                      >
                        {step.externalLabel ?? "Site officiel →"}
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mx-auto max-w-4xl border-t border-[color:var(--color-border)] px-6 py-12">
        <h2 className="mb-4 text-xl font-bold">Ressources complémentaires</h2>
        <p className="mb-6 text-sm text-[color:var(--color-muted)]">
          Guides, fiches techniques et modèles de documents pour accompagner votre parcours de
          formalisation.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/ressources"
            className="inline-block rounded-md border border-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)]/5"
          >
            Voir toutes les ressources →
          </Link>
          <Link
            href="/formations"
            className="inline-block rounded-md border border-[color:var(--color-border)] px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
          >
            Formations disponibles →
          </Link>
        </div>
      </section>
    </main>
  );
}
