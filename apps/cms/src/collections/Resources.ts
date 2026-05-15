import type { CollectionConfig } from "payload";

import { SECTORS } from "@sen-react/shared";

export const Resources: CollectionConfig = {
  slug: "resources",
  labels: {
    singular: "Ressource",
    plural: "Ressources",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "resourceType", "sector", "publishedAt", "_status"],
    description:
      "Fiches techniques, guides, modèles et checklists pour les entrepreneurs — accès libre.",
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 2000 },
    },
  },
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
      admin: {
        description: "Identifiant URL — lettres minuscules, chiffres et tirets uniquement.",
      },
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
      name: "body",
      type: "richText",
      label: "Contenu détaillé",
    },
    {
      name: "resourceType",
      type: "select",
      required: true,
      label: "Type",
      defaultValue: "guide",
      options: [
        { label: "Guide pratique", value: "guide" },
        { label: "Fiche technique", value: "fiche-technique" },
        { label: "Modèle / Template", value: "modele" },
        { label: "Checklist", value: "checklist" },
        { label: "Rapport", value: "rapport" },
      ],
    },
    {
      name: "sector",
      type: "select",
      label: "Secteur (optionnel)",
      options: SECTORS.map((s) => ({ label: s.fr, value: s.slug })),
      admin: {
        description: "Optionnel — laisser vide pour les ressources transversales.",
      },
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      label: "Fichier téléchargeable (PDF)",
      admin: {
        description: "Optionnel. Préférer < 5 MB pour les connexions mobiles ouest-africaines.",
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
  ],
};
