/**
 * Member-profile types — mirror the `public.user_profiles` table created
 * in supabase/migrations/20260510_220000_user_profiles.sql. Single source
 * of truth for the closed enums (profile type + verification status) and
 * the per-type field contracts.
 *
 * Used by:
 *   - apps/web signup + /mon-profil pages (Phase 6 PR-6b, 6c)
 *   - apps/cms verification queue (Phase 6 PR-6d)
 *   - public directory pages (Phase 7)
 *
 * Order is the canonical display order on the type picker (entrepreneur
 * first because that's the most common path; admin last because it's
 * REACT-internal).
 */

export const PROFILE_TYPES = [
  {
    slug: "entrepreneur",
    fr: "Entrepreneur·e individuel·le",
    en: "Individual entrepreneur",
    description:
      "Une personne physique — fondateur·trice, porteur·euse de projet, membre de la communauté Sen React.",
    requiresManualVerification: false,
  },
  {
    slug: "organisation",
    fr: "Organisation",
    en: "Organisation",
    description:
      "ONG, association, coopérative, entreprise privée. Vérification REACT requise avant publication.",
    requiresManualVerification: true,
  },
  {
    slug: "government",
    fr: "Institution publique / ministère",
    en: "Government / ministry",
    description: "Ministère, agence publique, entité parapublique. Vérification REACT requise.",
    requiresManualVerification: true,
  },
  {
    slug: "partner",
    fr: "Partenaire REACT",
    en: "REACT partner",
    description:
      "Partenaire institutionnel ou opérationnel du réseau REACT. Vérification REACT requise.",
    requiresManualVerification: true,
  },
  {
    slug: "admin",
    fr: "Administrateur REACT",
    en: "REACT admin",
    description: "Équipe REACT — accès admin à la plateforme. Compte créé manuellement par REACT.",
    requiresManualVerification: false,
  },
] as const;

export type ProfileTypeSlug = (typeof PROFILE_TYPES)[number]["slug"];
export type ProfileType = (typeof PROFILE_TYPES)[number];

const PROFILE_TYPE_SET = new Set<ProfileTypeSlug>(PROFILE_TYPES.map((p) => p.slug));

export function isProfileTypeSlug(value: string): value is ProfileTypeSlug {
  return (PROFILE_TYPE_SET as Set<string>).has(value);
}

export function getProfileType(slug: string): ProfileType | undefined {
  return PROFILE_TYPES.find((p) => p.slug === slug);
}

/**
 * Minimum age for the entrepreneur signup path (D020). 15–17 yo
 * requires the parental-consent affordance (roadmap row 91); ≥18 is the
 * full path. Other profile types don't have an age requirement at the
 * platform level — they're vetted via REACT-admin verification anyway.
 */
export const ENTREPRENEUR_MIN_AGE = 15;
export const PARENTAL_CONSENT_MAX_AGE = 17;

/**
 * Verification status values per the DB CHECK constraint. `auto_verified`
 * is the entrepreneur + admin path (self-attested or REACT-internal);
 * `pending → verified | rejected` is the manual-review path used for
 * organisation / government / partner profiles.
 */
export const VERIFICATION_STATUSES = ["pending", "verified", "rejected", "auto_verified"] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export function isVerificationStatus(value: string): value is VerificationStatus {
  return (VERIFICATION_STATUSES as readonly string[]).includes(value);
}

/**
 * Whether a profile is publicly visible on the directory + community
 * surfaces. `verified` (manual approval) and `auto_verified` (entrepreneur
 * / admin) are both public; `pending` and `rejected` are not. Phase 6 PR-6e
 * uses this to gate the column-level public view.
 */
export function isProfilePubliclyVisible(status: VerificationStatus): boolean {
  return status === "verified" || status === "auto_verified";
}

/**
 * The initial verification status a profile gets at signup, derived from
 * its type. entrepreneur + admin skip the manual queue.
 */
export function initialVerificationStatus(type: ProfileTypeSlug): VerificationStatus {
  const meta = getProfileType(type);
  if (!meta) return "pending";
  return meta.requiresManualVerification ? "pending" : "auto_verified";
}
