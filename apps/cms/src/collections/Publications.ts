import type { CollectionConfig } from "payload";

import { SECTORS } from "@sen-react/shared";

/**
 * Publications — REACT-produced and curated PDFs (research notes,
 * white-paper-style content per Amadou's editorial voice).
 *
 * Per D020: fully open access. No login required to read or download.
 * The PDF file itself is uploaded as a Media item and referenced.
 *
 * Sector is optional (some publications are cross-cutting). Year/month
 * surfaces in the listing for filtering.
 */
export const Publications: CollectionConfig = {
  slug: "publications",
  labels: {
    singular: "Publication",
    plural: "Publications",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "sector", "publishedAt", "_status"],
    description:
      "Publications téléchargeables — études, notes de réflexion, rapports REACT. Accès libre.",
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: { drafts: { autosave: { interval: 2000 } } },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Titre",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug (URL)",
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      label: "Résumé",
      admin: {
        description: "Description courte affichée dans la liste et en méta-description.",
      },
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Fichier PDF",
      admin: {
        description:
          "PDF téléchargeable. Préférer < 5 MB pour les connexions mobiles ouest-africaines.",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Image de couverture",
      admin: { position: "sidebar" },
    },
    {
      name: "sector",
      type: "select",
      required: false,
      label: "Secteur",
      options: SECTORS.map((s) => ({ label: s.fr, value: s.slug })),
      admin: {
        description: "Optionnel — laisser vide pour les publications transversales.",
      },
    },
    {
      name: "authors",
      type: "array",
      label: "Auteurs",
      fields: [
        { name: "name", type: "text", required: true, label: "Nom" },
        { name: "role", type: "text", label: "Rôle" },
      ],
      admin: {
        description: "Premier auteur en haut de la liste.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      label: "Date de publication",
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly" },
      },
    },
    {
      name: "language",
      type: "select",
      defaultValue: "fr",
      label: "Langue principale",
      options: [
        { label: "Français", value: "fr" },
        { label: "English", value: "en" },
        { label: "Wolof", value: "wo" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
