export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { listGroups, GROUP_TYPES } from "@/lib/groups";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Groupes — Sen React",
  description:
    "Rejoignez des groupes communautaires organisés par région, secteur d'activité ou thème.",
};

const TYPE_LABELS: Record<string, string> = {
  region: "Région",
  sector: "Secteur",
  theme: "Thème",
};

export default async function GroupesPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/groupes");

  const groups = await listGroups();

  const byType = GROUP_TYPES.map(({ value, label }) => ({
    type: value,
    label,
    groups: groups.filter((g) => g.group_type === value),
  }));

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Groupes communautaires
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Rejoignez votre communauté.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Des groupes organisés par région, secteur d&apos;activité et thème transversal pour
            connecter les membres qui partagent les mêmes contextes.
          </p>
          <div className="mt-6">
            <Link
              href="/groupes/creer"
              className="inline-block rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Créer un groupe →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 space-y-12">
        {byType.map(({ type, label, groups: typeGroups }) => (
          <div key={type}>
            <h2 className="mb-4 text-lg font-bold">{label}</h2>
            {typeGroups.length === 0 ? (
              <p className="text-sm text-[color:var(--color-muted)]">
                Aucun groupe dans cette catégorie.{" "}
                <Link
                  href="/groupes/creer"
                  className="font-semibold text-[color:var(--color-accent)] hover:underline"
                >
                  Créez le premier.
                </Link>
              </p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {typeGroups.map((g) => (
                  <li key={g.id}>
                    <Link
                      href={`/groupes/${g.id}`}
                      className="flex flex-col gap-1 rounded-lg border border-[color:var(--color-border)] bg-white p-5 transition-colors hover:border-[color:var(--color-accent)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold">{g.name}</p>
                        <span className="shrink-0 rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-xs text-[color:var(--color-muted)]">
                          {TYPE_LABELS[g.group_type]}
                        </span>
                      </div>
                      {g.description ? (
                        <p className="line-clamp-2 text-sm text-[color:var(--color-muted)]">
                          {g.description}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                        {g.tag} · {g.member_count} membre{g.member_count !== 1 ? "s" : ""}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
