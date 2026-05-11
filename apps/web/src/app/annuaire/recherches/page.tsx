import type { Metadata } from "next";
import Link from "next/link";

import { SECTORS, type SectorSlug } from "@sen-react/shared";

import { createServerSupabase } from "@/lib/supabase/server";
import {
  getNeedKindLabel,
  isNeedKind,
  listDirectoryNeeds,
  NEED_KINDS,
  type NeedKind,
} from "@/lib/needs";

export const metadata: Metadata = {
  title: "Recherches & offres — Sen React",
  description:
    "Tableau « Looking for X » : les membres Sen React publient ce qu'ils cherchent ou proposent.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    kind?: string;
    sector?: string;
    region?: string;
    published?: string;
  }>;
}

function isSectorSlug(value: string): value is SectorSlug {
  return SECTORS.some((s) => s.slug === value);
}

/**
 * /annuaire/recherches — public "Looking for X" board.
 *
 * Anyone can read. Authenticated members can publish via the New CTA;
 * they don't need to be on this page to do that.
 *
 * Filter pattern mirrors /opportunites + /annuaire — URL-driven GET
 * form, no client state. `published=1` query flag shows a one-shot
 * confirmation banner after submit.
 */
export default async function NeedsBoardPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const kind: NeedKind | undefined = sp.kind && isNeedKind(sp.kind) ? sp.kind : undefined;
  const sector: SectorSlug | undefined =
    sp.sector && isSectorSlug(sp.sector) ? sp.sector : undefined;
  const region = sp.region?.trim() || undefined;
  const justPublished = sp.published === "1";

  const [needs, supabase] = await Promise.all([
    listDirectoryNeeds({ kind, sector, region }),
    createServerSupabase(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const authenticated = Boolean(user);

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Recherches & offres
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Ce que la communauté cherche, ce qu&apos;elle propose.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Membres en quête de partenaires, de financements, de mentorat — ou offrant des services.
            Publication ouverte aux membres connectés. Contact direct via le profil de l&apos;auteur
            ; pas de messagerie intégrée (D016).
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {authenticated ? (
              <Link
                href="/annuaire/recherches/nouvelle"
                className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Publier une recherche / offre
              </Link>
            ) : (
              <Link
                href="/connexion?returnTo=%2Fannuaire%2Frecherches%2Fnouvelle"
                className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Se connecter pour publier
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-[color:var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <form
            action="/annuaire/recherches"
            method="get"
            className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
                  Type
                </span>
                <select
                  name="kind"
                  defaultValue={kind ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">Tous</option>
                  {NEED_KINDS.map((k) => (
                    <option key={k.slug} value={k.slug}>
                      {k.fr}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
                  Secteur
                </span>
                <select
                  name="sector"
                  defaultValue={sector ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">Tous</option>
                  {SECTORS.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.fr}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
                  Région
                </span>
                <input
                  type="text"
                  name="region"
                  defaultValue={region ?? ""}
                  placeholder="Dakar, Thiès…"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Filtrer
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-12">
          {justPublished ? (
            <p className="mb-6 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">
              Votre publication est en ligne.
            </p>
          ) : null}
          {needs.length === 0 ? (
            <p className="rounded-md border border-slate-200 bg-slate-50/50 p-6 text-sm text-[color:var(--color-muted)]">
              Rien à afficher pour l&apos;instant. Soyez le premier à publier.
            </p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2">
              {needs.map((n) => (
                <li
                  key={n.id}
                  className="flex flex-col rounded-lg border border-[color:var(--color-border)] bg-white p-5"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
                      {getNeedKindLabel(n.kind)}
                    </span>
                    {n.sector_slug ? (
                      <span className="text-[color:var(--color-muted)]">
                        {SECTORS.find((s) => s.slug === n.sector_slug)?.fr ?? n.sector_slug}
                      </span>
                    ) : null}
                    {n.region ? (
                      <span className="text-[color:var(--color-muted)]">· {n.region}</span>
                    ) : null}
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">{n.title}</h3>
                  <p className="mt-2 text-xs text-[color:var(--color-muted)]">
                    Publié par {n.author_display_name} ·{" "}
                    {new Date(n.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-3 whitespace-pre-line text-sm">{n.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
