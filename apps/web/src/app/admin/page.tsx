import type { Metadata, Route } from "next";
import Link from "next/link";

import { requireAdminProfile } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Espace administrateur — Sen React",
  description: "Outils d'administration REACT.",
};

// Admin-gated; never prerender.
export const dynamic = "force-dynamic";

const TOOLS = [
  {
    href: "/admin/profils",
    title: "Vérification des profils",
    description:
      "Approuver ou refuser les inscriptions d'organisations, institutions et partenaires en attente.",
  },
  {
    href: "/admin/commentaires",
    title: "Modération des commentaires",
    description: "Approuver ou masquer les commentaires soumis sur les articles.",
  },
];

/**
 * /admin — landing hub for REACT administrators. Gated by requireAdminProfile()
 * (non-admins redirect to /). Linked from the admin-only nav item in AuthNav so
 * admins can reach the tools without typing URLs.
 */
export default async function AdminHomePage() {
  const { profile } = await requireAdminProfile("/admin");

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          Espace administrateur — {profile.display_name}
        </p>
        <h1 className="mt-1 text-2xl font-bold">Outils d&apos;administration</h1>
      </header>

      <ul className="space-y-4">
        {TOOLS.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href as unknown as Route}
              className="block rounded-lg border border-[color:var(--color-border)] bg-white p-5 transition hover:border-[color:var(--color-accent)]"
            >
              <h2 className="text-lg font-semibold">{tool.title}</h2>
              <p className="mt-1 text-sm text-[color:var(--color-muted)]">{tool.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
