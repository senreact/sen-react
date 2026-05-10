import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isProfileTypeSlug } from "@sen-react/shared";

import { ProfileEditForm } from "@/components/ProfileEditForm";
import { createServerSupabase } from "@/lib/supabase/server";

import { updateProfileAction } from "./actions";

export const metadata: Metadata = {
  title: "Mon profil — Sen React",
  description: "Modifier votre profil Sen React.",
};

// Reads cookies; never prerender.
export const dynamic = "force-dynamic";

const VERIFICATION_LABEL: Record<string, { label: string; tone: "ok" | "warn" | "bad" }> = {
  auto_verified: { label: "Vérifié (automatique)", tone: "ok" },
  verified: { label: "Vérifié par REACT", tone: "ok" },
  pending: { label: "En attente de vérification REACT", tone: "warn" },
  rejected: { label: "Vérification refusée — contactez REACT", tone: "bad" },
};

/**
 * /mon-profil — auth-gated view + edit of the signed-in user's own
 * profile. Unauthenticated visitors redirect to /connexion. Users who
 * have an auth.users row but no user_profiles row (legacy accounts from
 * before Phase 6) see a friendly message rather than a crash.
 */
export default async function MonProfilPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion?returnTo=%2Fmon-profil");
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select(
      [
        "profile_type",
        "verification_status",
        "display_name",
        "sector_slug",
        "region",
        "photo_url",
        "summary",
        "phone",
        "email_public",
        "organisation_name",
        "organisation_legal_form",
        "organisation_size",
        "ministry_name",
        "government_role",
        "partner_org_name",
        "is_minor",
        "parental_consent",
        "parent_email",
      ].join(", "),
    )
    .eq("user_id", user.id)
    .maybeSingle<{
      profile_type: string;
      verification_status: string;
      display_name: string;
      sector_slug: string | null;
      region: string | null;
      photo_url: string | null;
      summary: string | null;
      phone: string | null;
      email_public: boolean;
      organisation_name: string | null;
      organisation_legal_form: string | null;
      organisation_size: string | null;
      ministry_name: string | null;
      government_role: string | null;
      partner_org_name: string | null;
      is_minor: boolean;
      parental_consent: boolean | null;
      parent_email: string | null;
    }>();

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="mb-2 text-2xl font-bold">Mon profil</h1>
        <p className="text-sm text-[color:var(--color-muted)]">
          Une erreur est survenue lors du chargement de votre profil. Réessayez dans un instant.
        </p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="mb-2 text-2xl font-bold">Mon profil</h1>
        <p className="text-sm text-[color:var(--color-muted)]">
          Votre compte est en cours de configuration. Si ce message persiste après quelques minutes,
          contactez l&apos;équipe REACT par e-mail à{" "}
          <a className="text-[color:var(--color-accent)]" href="mailto:senreactsen@gmail.com">
            senreactsen@gmail.com
          </a>
          .
        </p>
      </main>
    );
  }

  // Type-narrow against the closed enum we ship in shared.
  if (!isProfileTypeSlug(profile.profile_type)) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="mb-2 text-2xl font-bold">Mon profil</h1>
        <p className="text-sm text-[color:var(--color-muted)]">
          Type de profil non reconnu — contactez REACT.
        </p>
      </main>
    );
  }

  const verif = VERIFICATION_LABEL[profile.verification_status] ?? {
    label: profile.verification_status,
    tone: "warn" as const,
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">{user.email}</p>
        <p className="mt-3">
          <span
            className={
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " +
              (verif.tone === "ok"
                ? "bg-emerald-100 text-emerald-800"
                : verif.tone === "warn"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800")
            }
          >
            {verif.label}
          </span>
        </p>
      </header>

      <ProfileEditForm
        action={updateProfileAction}
        profile={{ ...profile, profile_type: profile.profile_type }}
      />
    </main>
  );
}
