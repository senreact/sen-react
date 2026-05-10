import type { CollectionConfig } from "payload";

/**
 * Programmes — D021 active REACT programmes (currently 3).
 *
 * `headline` variant is the platform itself (Sen React) — sits above
 * the `active` programmes in the homepage Programmes section.
 *
 * Order is explicit — Amadou listed them in a deliberate sequence.
 */
export const Programmes: CollectionConfig = {
  slug: "programmes",
  labels: {
    singular: "Programme",
    plural: "Programmes",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "variant", "order", "_status"],
    description: "Programmes actifs portés par REACT. Sen React est le programme phare (headline).",
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: { drafts: { autosave: { interval: 2000 } } },
  defaultSort: "order",
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug",
    },
    {
      name: "title",
      type: "text",
      required: true,
      label: "Titre",
    },
    {
      name: "eyebrow",
      type: "text",
      required: true,
      label: "Étiquette",
      admin: { description: "Ex. 'Programme phare', 'Programme actif'." },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Description",
      admin: {
        description: "Une à deux phrases, FR. Verbatim ou quasi-verbatim de la réponse d'Amadou.",
      },
    },
    {
      name: "variant",
      type: "select",
      required: true,
      defaultValue: "active",
      label: "Variante",
      options: [
        { label: "Phare (Sen React)", value: "headline" },
        { label: "Actif", value: "active" },
      ],
    },
    {
      name: "order",
      type: "number",
      required: true,
      label: "Ordre",
      defaultValue: 0,
    },
  ],
};
