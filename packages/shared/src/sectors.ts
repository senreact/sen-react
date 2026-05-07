/**
 * The 10 sectors of intervention per D012 (Amadou response §3, 2026-05-04).
 *
 * Slugs are stable URL-safe identifiers used for routing and CMS keys.
 * FR labels are the canonical display strings. EN labels are translations.
 */

export const SECTORS = [
  {
    slug: "digitalisation-technologie",
    fr: "Digitalisation et technologie",
    en: "Digitalisation and technology",
    scopeFr:
      "Applications mobiles, civic tech, e-commerce, fintech, services numériques, IA, innovation",
  },
  {
    slug: "developpement-economique",
    fr: "Développement économique",
    en: "Economic development",
    scopeFr: "Activités génératrices de revenus pour femmes et jeunes au Sénégal et en Afrique",
  },
  {
    slug: "entrepreneuriat-local",
    fr: "Entrepreneuriat local",
    en: "Local entrepreneurship",
    scopeFr:
      "Numérique, agricole, élevage, services, énergies renouvelables, IA, transformation, artisanat",
  },
  {
    slug: "agroecologie",
    fr: "Agroécologie",
    en: "Agroecology",
    scopeFr: "Agriculture biologique, transformation de fruits et légumes",
  },
  {
    slug: "energies-renouvelables",
    fr: "Énergies renouvelables",
    en: "Renewable energies",
    scopeFr: "Emplois verts, énergie solaire, éolien",
  },
  {
    slug: "multimedia",
    fr: "Multimédia",
    en: "Multimedia",
    scopeFr: "Graphisme, vidéo, création de contenu, podcast, documentaires",
  },
  {
    slug: "transformation",
    fr: "Transformation",
    en: "Transformation",
    scopeFr: "Transformation alimentaire, fruits et légumes, produits alimentaires",
  },
  {
    slug: "artisanat",
    fr: "Artisanat",
    en: "Crafts",
    scopeFr: "Innovation, fabrication de produits locaux, savonnerie",
  },
  {
    slug: "elevage",
    fr: "Élevage",
    en: "Livestock farming",
    scopeFr: "Élevage bovin, ovin et caprin",
  },
  {
    slug: "saponification",
    fr: "Saponification",
    en: "Soap-making",
    scopeFr: "Fabrication de savons biologiques et lait corporel sain",
  },
] as const;

export type SectorSlug = (typeof SECTORS)[number]["slug"];

export function getSector(slug: string): (typeof SECTORS)[number] | undefined {
  return SECTORS.find((s) => s.slug === slug);
}
