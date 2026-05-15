import type { CollectionConfig } from "payload";

import { SECTORS } from "@sen-react/shared";

export const Events: CollectionConfig = {
  slug: "events",
  labels: {
    singular: "Événement",
    plural: "Événements",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "eventType", "startsAt", "location", "_status"],
    description: "Ateliers, webinaires et événements organisés ou relayés par REACT.",
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
      label: "Résumé",
      admin: {
        description: "Affiché sur la carte dans la liste des événements (max 200 car.).",
      },
    },
    {
      name: "body",
      type: "richText",
      label: "Description complète",
    },
    {
      name: "startsAt",
      type: "date",
      required: true,
      label: "Date et heure de début",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "endsAt",
      type: "date",
      label: "Date et heure de fin",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "location",
      type: "text",
      label: "Lieu",
      admin: {
        description: "Ex. : « Dakar, Sénégal » ou « En ligne ».",
      },
    },
    {
      name: "eventType",
      type: "select",
      required: true,
      label: "Type d'événement",
      defaultValue: "in-person",
      options: [
        { label: "En présentiel", value: "in-person" },
        { label: "En ligne", value: "online" },
        { label: "Webinaire", value: "webinar" },
      ],
    },
    {
      name: "sector",
      type: "select",
      label: "Secteur (optionnel)",
      options: SECTORS.map((s) => ({ label: s.fr, value: s.slug })),
    },
    {
      name: "registrationUrl",
      type: "text",
      label: "Lien d'inscription (externe)",
      admin: {
        description: "URL d'un formulaire d'inscription externe (Google Forms, etc.).",
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
