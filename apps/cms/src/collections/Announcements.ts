import type { CollectionConfig } from "payload";

export const Announcements: CollectionConfig = {
  slug: "announcements",
  labels: {
    singular: "Annonce",
    plural: "Annonces",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    description: "Annonces officielles publiées par l'équipe REACT à destination de la communauté.",
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
      name: "category",
      type: "select",
      required: true,
      label: "Catégorie",
      defaultValue: "general",
      options: [
        { label: "Général", value: "general" },
        { label: "Urgent", value: "urgent" },
        { label: "Mise à jour plateforme", value: "platform-update" },
        { label: "Partenariat", value: "partnership" },
      ],
    },
    {
      name: "body",
      type: "richText",
      required: true,
      label: "Contenu",
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      label: "Date de publication",
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: "dayOnly" },
      },
    },
  ],
};
