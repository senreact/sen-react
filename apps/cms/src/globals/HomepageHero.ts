import type { GlobalConfig } from "payload";

/**
 * Homepage hero — eyebrow + headline + lead paragraph + two CTAs.
 *
 * Editorial copy locked with Amadou per decisions log §A1 (2026-05-04).
 * Editors can refine the wording without a code change.
 */
export const HomepageHero: GlobalConfig = {
  slug: "homepage-hero",
  label: "Page d'accueil — Hero",
  access: { read: () => true },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      required: true,
      label: "Étiquette (eyebrow)",
      admin: {
        description:
          "Texte court en majuscules vertes au-dessus du titre — ex. 'Réseau des Entrepreneurs Actifs'.",
      },
    },
    {
      name: "headline",
      type: "textarea",
      required: true,
      label: "Titre principal (H1)",
      admin: { description: "Une à deux phrases — voix de marque verbatim." },
    },
    {
      name: "leadParagraph",
      type: "textarea",
      required: true,
      label: "Paragraphe d'introduction",
      admin: { description: "Sous le titre. 2-4 phrases qui posent la mission." },
    },
    {
      name: "primaryCta",
      type: "group",
      label: "Bouton principal",
      fields: [
        { name: "label", type: "text", required: true, label: "Libellé" },
        {
          name: "href",
          type: "text",
          required: true,
          label: "Lien",
          admin: { description: "Chemin relatif (/inscription) ou URL absolue." },
        },
      ],
    },
    {
      name: "secondaryCta",
      type: "group",
      label: "Bouton secondaire",
      fields: [
        { name: "label", type: "text", required: true, label: "Libellé" },
        { name: "href", type: "text", required: true, label: "Lien" },
      ],
    },
  ],
};
