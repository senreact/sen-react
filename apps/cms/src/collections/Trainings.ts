import type { CollectionConfig } from "payload";

import { SECTORS } from "@sen-react/shared";

export const Trainings: CollectionConfig = {
  slug: "trainings",
  labels: {
    singular: "Formation",
    plural: "Formations",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "trainingType", "level", "startsAt", "_status"],
    description:
      "Catalogue de formations REACT — tutoriels, webinaires, ateliers et cours en ligne. Toujours gratuits.",
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
      type: "text",
      label: "Résumé court",
      admin: {
        description: "Affiché sur la carte dans la liste des formations (max 200 car.).",
      },
    },
    {
      name: "body",
      type: "richText",
      label: "Description complète",
    },
    {
      name: "trainingType",
      type: "select",
      required: true,
      label: "Type",
      defaultValue: "tutorial",
      options: [
        { label: "Tutoriel", value: "tutorial" },
        { label: "Webinaire", value: "webinar" },
        { label: "Atelier en présentiel", value: "workshop" },
        { label: "Cours en ligne", value: "online-course" },
      ],
    },
    {
      name: "level",
      type: "select",
      label: "Niveau",
      options: [
        { label: "Débutant", value: "debutant" },
        { label: "Intermédiaire", value: "intermediaire" },
        { label: "Avancé", value: "avance" },
      ],
    },
    {
      name: "format",
      type: "select",
      label: "Format",
      defaultValue: "online",
      options: [
        { label: "En ligne", value: "online" },
        { label: "En présentiel", value: "in-person" },
        { label: "Hybride", value: "hybrid" },
      ],
    },
    {
      name: "topic",
      type: "text",
      label: "Thème",
      admin: {
        description: "Ex. : « Gestion financière », « Marketing digital », « Leadership ».",
      },
    },
    {
      name: "sector",
      type: "select",
      label: "Secteur (optionnel)",
      options: SECTORS.map((s) => ({ label: s.fr, value: s.slug })),
    },
    {
      name: "startsAt",
      type: "date",
      label: "Date de début (si planifiée)",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        description: "Laisser vide pour les formations disponibles à tout moment.",
      },
    },
    {
      name: "endsAt",
      type: "date",
      label: "Date de fin",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "location",
      type: "text",
      label: "Lieu",
      admin: {
        description: "Pour les formats en présentiel — ex. : « Dakar, Sénégal ».",
      },
    },
    {
      name: "registrationUrl",
      type: "text",
      label: "Lien d'inscription (externe)",
    },
    {
      name: "videoUrl",
      type: "text",
      label: "Lien vidéo YouTube/Vimeo",
      admin: {
        description: "URL YouTube ou Vimeo pour les tutoriels et cours en ligne.",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Image de couverture",
    },
  ],
};
