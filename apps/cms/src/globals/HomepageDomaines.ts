import type { GlobalConfig } from "payload";

/**
 * Homepage Domaines section — 4 cross-cutting editorial pillars sitting
 * ABOVE the 10 sectors taxonomy (sectors drive opportunities + businesses;
 * domaines are the rhetorical framing).
 *
 * Modelled as a single global rather than a collection because:
 *  - the 4 pillars are a fixed structural choice, not a CRUD list
 *  - editors can reorder via the array within one record
 *  - keeps the section header (eyebrow + headline) and the cards in one
 *    place where REACT edits them as a unit
 */
export const HomepageDomaines: GlobalConfig = {
  slug: "homepage-domaines",
  label: "Page d'accueil — Domaines",
  access: { read: () => true },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      required: true,
      label: "Étiquette (eyebrow)",
      admin: { description: "Petit titre vert au-dessus du H2." },
    },
    {
      name: "headline",
      type: "text",
      required: true,
      label: "Titre de section (H2)",
    },
    {
      name: "pillars",
      type: "array",
      required: true,
      minRows: 1,
      label: "Piliers",
      admin: {
        description:
          "Cartes affichées sous le titre. L'ordre dans le tableau = l'ordre d'affichage.",
      },
      fields: [
        { name: "title", type: "text", required: true, label: "Titre" },
        {
          name: "description",
          type: "textarea",
          required: true,
          label: "Description",
        },
      ],
    },
  ],
};
