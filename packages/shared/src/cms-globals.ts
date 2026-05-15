/**
 * CMS global types — mirror of `apps/cms/src/payload-types.ts` for consumers
 * that can't / shouldn't depend on the CMS package directly.
 *
 * Keep this file in lockstep with the Payload globals (`SiteHeader`,
 * `SiteFooter`). If the Payload schema gains a field, mirror it here. The
 * shape is intentionally narrower than Payload's generated type — we drop
 * Payload-internal fields (`id`, `createdAt`, `updatedAt`) consumers don't
 * need.
 */

export interface NavItem {
  label: string;
  labelEn?: string | null;
  href: string;
  external?: boolean | null;
}

export interface LegalNavItem {
  label: string;
  labelEn?: string | null;
  href: string;
}

export type SocialPlatform =
  | "instagram"
  | "linkedin"
  | "youtube"
  | "whatsapp"
  | "facebook"
  | "x"
  | "tiktok";

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
}

export interface SiteHeaderGlobal {
  siteTitle: string;
  tagline?: string | null;
  navItems?: NavItem[] | null;
}

export interface SiteFooterGlobal {
  copyrightText: string;
  description?: string | null;
  legalNavItems?: LegalNavItem[] | null;
  contactEmail?: string | null;
  contactAddress?: string | null;
  socialLinks?: SocialLink[] | null;
}

/**
 * Default placeholder content used when the CMS is unreachable. Lets
 * apps/web build and render in dev / pre-CMS-deploy without breaking, and
 * gives reviewers a non-empty header/footer to evaluate the layout.
 *
 * Once the CMS is deployed and seeded, real content takes over via the
 * fetcher in apps/web/src/lib/cms.
 */
export const DEFAULT_SITE_HEADER: SiteHeaderGlobal = {
  siteTitle: "Sen React",
  tagline: "Transition numérique et écologique au Sénégal et en Afrique",
  navItems: [
    { label: "Accueil", labelEn: "Home", href: "/" },
    { label: "Secteurs", labelEn: "Sectors", href: "/secteurs" },
    { label: "Opportunités", labelEn: "Opportunities", href: "/opportunites" },
    { label: "Annuaire", labelEn: "Directory", href: "/annuaire" },
    { label: "Recherches", labelEn: "Needs board", href: "/annuaire/recherches" },
    { label: "Actualités", labelEn: "News", href: "/actualites" },
    { label: "Événements", labelEn: "Events", href: "/evenements" },
    { label: "Annonces", labelEn: "Announcements", href: "/annonces" },
    { label: "Forum", labelEn: "Forum", href: "/forum" },
    { label: "Groupes", labelEn: "Groups", href: "/groupes" },
    { label: "Mentorat", labelEn: "Mentoring", href: "/mentorat" },
    { label: "Sondages", labelEn: "Polls", href: "/sondages" },
    { label: "Formations", labelEn: "Trainings", href: "/formations" },
    { label: "Ressources", labelEn: "Resources", href: "/ressources" },
    { label: "Renforcement", labelEn: "Capacity building", href: "/renforcement" },
    { label: "Formalisation", labelEn: "Business registration", href: "/formalisation" },
    { label: "Publications", labelEn: "Publications", href: "/publications" },
    { label: "Vidéos", labelEn: "Videos", href: "/videos" },
    { label: "À propos", labelEn: "About", href: "/a-propos" },
    { label: "Contact", labelEn: "Contact", href: "/contact" },
  ],
};

export const DEFAULT_SITE_FOOTER: SiteFooterGlobal = {
  copyrightText: "© 2026 Sen React",
  description:
    "Plateforme dédiée à la transition numérique et écologique des entrepreneurs sénégalais et africains.",
  legalNavItems: [
    { label: "Mentions légales", labelEn: "Legal notice", href: "/mentions-legales" },
    { label: "Confidentialité", labelEn: "Privacy", href: "/confidentialite" },
    { label: "Cookies", labelEn: "Cookies", href: "/cookies" },
  ],
  contactEmail: "senreactsen@gmail.com",
  contactAddress: "Sacrée Coeur 3 Lot N° 128/B, Dakar, Sénégal",
  socialLinks: [
    { platform: "whatsapp", href: "https://wa.me/221773213955" },
    { platform: "instagram", href: "https://instagram.com/senreact" },
    { platform: "linkedin", href: "https://linkedin.com/company/senreact" },
    { platform: "youtube", href: "https://youtube.com/@senreact" },
  ],
};
