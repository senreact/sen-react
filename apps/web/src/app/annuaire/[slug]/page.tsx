import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProfileType, getSector } from "@sen-react/shared";

import {
  getDirectoryProfileBySlug,
  getProfileContactBySlug,
  type ProfileContact,
} from "@/lib/directory";
import { createServerSupabase } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getDirectoryProfileBySlug(slug);
  if (!profile) return { title: "Profil introuvable — Sen React" };
  return {
    title: `${profile.display_name} — Annuaire Sen React`,
    description:
      profile.summary?.slice(0, 160) ?? `Profil ${profile.profile_type} sur l'annuaire Sen React.`,
  };
}

/**
 * /annuaire/[slug] — public profile detail page.
 *
 * Public to everyone for display_name / sector / region / photo /
 * summary / organisation_label (via the `directory_profiles` view).
 *
 * Phone + email are gated to authenticated members per D020:
 * - Phone read from `user_profiles.phone` via service-role.
 * - Email read from `auth.users.email` only when the user has set
 *   `email_public = true` on their profile.
 *
 * Per D016, contact happens out-of-band (WhatsApp / phone call / email
 * client) — no in-platform inbox.
 */
export default async function ProfileDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getDirectoryProfileBySlug(slug);
  if (!profile) notFound();

  // Auth check + contact fetch in parallel.
  const supabase = await createServerSupabase();
  const [{ data: userData }, contact] = await Promise.all([
    supabase.auth.getUser().catch(() => ({ data: { user: null } })),
    // Only fetch contact when there will be a viewer for it. Service-
    // role is heavy (admin.getUserById for email); skip when anonymous.
    supabase.auth
      .getUser()
      .then(({ data }) => (data.user ? getProfileContactBySlug(slug) : null))
      .catch(() => null),
  ]);
  const authenticated = Boolean(userData?.user);

  const meta = getProfileType(profile.profile_type);
  const sector = profile.sector_slug ? getSector(profile.sector_slug) : null;

  return (
    <main>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav className="mb-8 text-sm">
          <Link href="/annuaire" className="text-[color:var(--color-accent)] hover:underline">
            ← L&apos;annuaire
          </Link>
        </nav>

        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
              {meta?.fr ?? profile.profile_type}
            </span>
            {profile.tier ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold uppercase tracking-wide text-amber-800">
                {profile.tier}
              </span>
            ) : null}
            {sector ? <span className="text-[color:var(--color-muted)]">{sector.fr}</span> : null}
            {profile.region ? (
              <span className="text-[color:var(--color-muted)]">· {profile.region}</span>
            ) : null}
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">{profile.display_name}</h1>
          {profile.organisation_label ? (
            <p className="mt-2 text-lg text-[color:var(--color-muted)]">
              {profile.organisation_label}
            </p>
          ) : null}
        </header>

        {profile.summary ? (
          <section className="prose prose-slate mb-8 max-w-none">
            <p className="whitespace-pre-line text-base leading-relaxed">{profile.summary}</p>
          </section>
        ) : null}

        <ContactSection authenticated={authenticated} contact={contact} slug={slug} />
      </article>
    </main>
  );
}

function ContactSection({
  authenticated,
  contact,
  slug,
}: {
  authenticated: boolean;
  contact: ProfileContact | null;
  slug: string;
}) {
  if (!authenticated) {
    return (
      <aside className="rounded-lg border border-[color:var(--color-border)] bg-white p-6">
        <p className="mb-2 font-semibold">Coordonnées privées</p>
        <p className="mb-4 text-sm text-[color:var(--color-muted)]">
          Téléphone et e-mail visibles uniquement par les membres connectés (politique de
          confidentialité D020).
        </p>
        <Link
          href={`/connexion?returnTo=${encodeURIComponent(`/annuaire/${slug}`)}`}
          className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Se connecter pour voir
        </Link>
      </aside>
    );
  }

  if (!contact || (!contact.phone && !contact.email)) {
    return (
      <aside className="rounded-lg border border-[color:var(--color-border)] bg-white p-6">
        <p className="mb-2 font-semibold">Coordonnées</p>
        <p className="text-sm text-[color:var(--color-muted)]">
          Aucune coordonnée publiée. Contactez ce membre via REACT si vous avez besoin de le
          joindre.
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-lg border border-[color:var(--color-accent)] bg-white p-6">
      <p className="mb-2 font-semibold">Coordonnées</p>
      <p className="mb-4 text-sm text-[color:var(--color-muted)]">
        Pas de messagerie intégrée — utilisez le canal qui vous convient (D016).
      </p>
      <ul className="space-y-2 text-sm">
        {contact.phone ? (
          <li>
            <span className="text-[color:var(--color-muted)]">Téléphone</span> —{" "}
            <a
              href={`tel:${contact.phone.replace(/\s+/g, "")}`}
              className="font-semibold text-[color:var(--color-accent)] hover:underline"
            >
              {contact.phone}
            </a>{" "}
            <a
              href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)]"
            >
              (WhatsApp)
            </a>
          </li>
        ) : null}
        {contact.email ? (
          <li>
            <span className="text-[color:var(--color-muted)]">E-mail</span> —{" "}
            <a
              href={`mailto:${contact.email}`}
              className="font-semibold text-[color:var(--color-accent)] hover:underline"
            >
              {contact.email}
            </a>
          </li>
        ) : null}
      </ul>
    </aside>
  );
}
