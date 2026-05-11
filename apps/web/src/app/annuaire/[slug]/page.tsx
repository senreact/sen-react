import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProfileType, getSector } from "@sen-react/shared";

import { ReviewForm } from "@/components/directory/ReviewForm";
import {
  getDirectoryProfileBySlug,
  getProfileContactBySlug,
  type ProfileContact,
} from "@/lib/directory";
import {
  getReviewsForSubject,
  resolveSlugToUserId,
  summariseReviews,
  type ProfileReview,
} from "@/lib/reviews";
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

  // Auth check + contact + reviews + subject-user-id in parallel.
  const supabase = await createServerSupabase();
  const [{ data: userData }, contact, reviews, subjectUserId] = await Promise.all([
    supabase.auth.getUser().catch(() => ({ data: { user: null } })),
    supabase.auth
      .getUser()
      .then(({ data }) => (data.user ? getProfileContactBySlug(slug) : null))
      .catch(() => null),
    getReviewsForSubject(slug),
    resolveSlugToUserId(slug),
  ]);
  const authenticated = Boolean(userData?.user);
  const summary = summariseReviews(reviews);
  const visitorUserId = userData?.user?.id ?? null;
  const visitorIsSubject = Boolean(
    visitorUserId && subjectUserId && visitorUserId === subjectUserId,
  );
  const visitorReview = visitorUserId
    ? (reviews.find((r) => r.reviewer_user_id === visitorUserId) ?? null)
    : null;

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

        <section className="mt-10">
          <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold">Avis</h2>
            {summary.count > 0 && summary.averageStars !== null ? (
              <p className="text-sm text-[color:var(--color-muted)]">
                {summary.averageStars.toFixed(1)} / 5 — {summary.count} avis
              </p>
            ) : null}
          </header>

          {reviews.length === 0 ? (
            <p className="rounded-md border border-slate-200 bg-slate-50/50 p-4 text-sm text-[color:var(--color-muted)]">
              Aucun avis publié pour l&apos;instant.
            </p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </ul>
          )}

          {authenticated && !visitorIsSubject ? (
            <div className="mt-6">
              <ReviewForm
                slug={slug}
                existing={
                  visitorReview
                    ? { stars: visitorReview.stars, comment: visitorReview.comment }
                    : null
                }
              />
            </div>
          ) : null}
          {authenticated && visitorIsSubject ? (
            <p className="mt-6 rounded-md border border-slate-200 bg-slate-50/50 p-3 text-xs text-[color:var(--color-muted)]">
              Vous ne pouvez pas publier d&apos;avis sur votre propre profil.
            </p>
          ) : null}
          {!authenticated ? (
            <p className="mt-6 rounded-md border border-slate-200 bg-slate-50/50 p-3 text-xs text-[color:var(--color-muted)]">
              <Link
                href={`/connexion?returnTo=${encodeURIComponent(`/annuaire/${slug}`)}`}
                className="text-[color:var(--color-accent)] hover:underline"
              >
                Connectez-vous
              </Link>{" "}
              pour publier un avis.
            </p>
          ) : null}
        </section>
      </article>
    </main>
  );
}

function ReviewItem({ review }: { review: ProfileReview }) {
  const date = new Date(review.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <li className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
      <div className="mb-1 flex items-center gap-2 text-sm">
        <span className="text-amber-600">{"★".repeat(review.stars)}</span>
        <span className="text-[color:var(--color-muted)]">{"☆".repeat(5 - review.stars)}</span>
        <span className="font-semibold">{review.reviewer_display_name}</span>
        <span className="text-xs text-[color:var(--color-muted)]">· {date}</span>
      </div>
      {review.comment ? (
        <p className="whitespace-pre-line text-sm text-[color:var(--color-foreground)]">
          {review.comment}
        </p>
      ) : null}
    </li>
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
