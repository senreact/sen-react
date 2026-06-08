import type { GlobalConfig, UploadField } from "payload";

/**
 * Per-page hero images — one editable banner image per main page, all
 * managed from a single admin screen ("Images d'en-tête des pages").
 *
 * Each field is an optional Media upload; the public site renders the
 * banner only when an image is set (graceful — no image = no banner, no
 * layout shift). The Media item carries its own alt text, so we don't
 * duplicate an alt field here.
 *
 * Keep PAGE_HERO_SLOTS in sync with the `pageKey` values used by the web
 * app's <PageHeroImage> component.
 */
export const PAGE_HERO_SLOTS = [
  { name: "accueil", label: "Accueil" },
  { name: "secteurs", label: "Secteurs" },
  { name: "opportunites", label: "Opportunités" },
  { name: "annuaire", label: "Annuaire" },
  { name: "actualites", label: "Actualités" },
  { name: "publications", label: "Publications" },
  { name: "evenements", label: "Événements" },
  { name: "ressources", label: "Ressources" },
  { name: "formations", label: "Formations" },
  { name: "partenaires", label: "Partenaires" },
  { name: "videos", label: "Vidéos" },
] as const;

export const PageHeroes: GlobalConfig = {
  slug: "page-heroes",
  label: "Images d'en-tête des pages",
  access: { read: () => true },
  admin: {
    description:
      "Image d'en-tête (bannière) affichée en haut de chaque page principale. Laisser vide pour ne pas afficher de bannière.",
  },
  fields: PAGE_HERO_SLOTS.map(
    (slot): UploadField => ({
      name: slot.name,
      type: "upload",
      relationTo: "media",
      label: slot.label,
      admin: { description: `Bannière affichée en haut de la page « ${slot.label} ».` },
    }),
  ),
};
