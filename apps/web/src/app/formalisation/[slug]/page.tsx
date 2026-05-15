import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LexicalRichText } from "@/components/content/LexicalRichText";
import { getFormalisationStepBySlug } from "@/lib/cms";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const step = await getFormalisationStepBySlug(slug);
  if (!step) return { title: "Étape introuvable — Sen React" };
  return {
    title: `${step.title} — Sen React`,
    description: step.summary,
  };
}

export default async function FormalisationStepPage({ params }: PageProps) {
  const { slug } = await params;
  const step = await getFormalisationStepBySlug(slug);
  if (!step) notFound();

  return (
    <main>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-sm">
          <Link href="/formalisation" className="text-[color:var(--color-accent)] hover:underline">
            ← Parcours de formalisation
          </Link>
        </nav>

        <header className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[color:var(--color-accent)] text-sm font-bold text-white">
              {step.stepNumber}
            </div>
            {step.agencyName ? (
              <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                {step.agencyName}
              </span>
            ) : null}
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{step.title}</h1>

          <p className="mt-4 text-lg text-[color:var(--color-muted)]">{step.summary}</p>

          {(step.estimatedDuration ?? step.estimatedCost) ? (
            <dl className="mt-6 grid gap-3 rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm sm:grid-cols-2">
              {step.estimatedDuration ? (
                <div>
                  <dt className="font-semibold">Délai estimé</dt>
                  <dd className="mt-1 text-[color:var(--color-muted)]">{step.estimatedDuration}</dd>
                </div>
              ) : null}
              {step.estimatedCost ? (
                <div>
                  <dt className="font-semibold">Coût estimé</dt>
                  <dd className="mt-1 text-[color:var(--color-muted)]">{step.estimatedCost}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {step.requiredDocuments && step.requiredDocuments.length > 0 ? (
            <div className="mt-6 rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold">Documents requis</h2>
              <ul className="space-y-1 text-sm text-[color:var(--color-muted)]">
                {step.requiredDocuments.map((d, i) => (
                  <li key={d.id ?? i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[color:var(--color-accent)]">✓</span>
                    {d.document}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {step.externalUrl ? (
            <div className="mt-6">
              <a
                href={step.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                {step.externalLabel ?? "Démarrer la démarche officielle →"}
              </a>
            </div>
          ) : null}
        </header>

        {step.body ? <LexicalRichText content={step.body} /> : null}
      </article>
    </main>
  );
}
