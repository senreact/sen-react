import type { CollectionConfig } from "payload";

import { SECTORS } from "@sen-react/shared";

/**
 * Videos. Per decisions log §A4:
 *
 * - Types: capsule · explanations · interviews · vlogs · testimonials
 * - Hosting: YouTube embed (free, locally suited for SN bandwidth)
 * - Subtitles: FR + Wolof slots — REACT may upload .vtt files
 * - Origin: REACT-original or curated/partner
 * - Downloadable for offline (D016 row 10)
 *
 * The YouTube ID is stored, not a full URL — we build the embed URL
 * client-side. That insulates from URL-format changes in YouTube and
 * makes validation simpler.
 */
export const Videos: CollectionConfig = {
  slug: "videos",
  labels: {
    singular: "Vidéo",
    plural: "Vidéos",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "videoType", "sector", "publishedAt", "_status"],
    description:
      "Vidéos REACT et partenaires — capsules, témoignages, entretiens, vlogs. Sous-titres FR + Wolof.",
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
    },
    {
      name: "youtubeId",
      type: "text",
      required: true,
      label: "ID YouTube",
      admin: {
        description:
          "Identifiant à 11 caractères extrait de l'URL YouTube. Exemple : pour " +
          "https://youtube.com/watch?v=dQw4w9WgXcQ, l'ID est dQw4w9WgXcQ.",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return "ID YouTube requis.";
        if (!/^[A-Za-z0-9_-]{11}$/.test(value)) {
          return "ID YouTube invalide — doit être exactement 11 caractères alphanumériques (lettres, chiffres, _, -).";
        }
        return true;
      },
    },
    {
      name: "videoType",
      type: "select",
      required: true,
      label: "Type de vidéo",
      options: [
        { label: "Capsule", value: "capsule" },
        { label: "Explication courte", value: "explanation" },
        { label: "Entretien", value: "interview" },
        { label: "Vlog", value: "vlog" },
        { label: "Témoignage", value: "testimonial" },
      ],
    },
    {
      name: "origin",
      type: "select",
      required: true,
      defaultValue: "react-original",
      label: "Origine",
      options: [
        { label: "REACT (production interne)", value: "react-original" },
        { label: "Curaté / partenaire", value: "curated" },
      ],
    },
    {
      name: "sector",
      type: "select",
      required: false,
      label: "Secteur",
      options: SECTORS.map((s) => ({ label: s.fr, value: s.slug })),
    },
    {
      name: "subtitlesFr",
      type: "upload",
      relationTo: "media",
      label: "Sous-titres FR (.vtt)",
      admin: {
        description: "Fichier .vtt facultatif. Si fourni, sera proposé par défaut sur le lecteur.",
      },
    },
    {
      name: "subtitlesWo",
      type: "upload",
      relationTo: "media",
      label: "Sous-titres Wolof (.vtt)",
      admin: {
        description: "Toutes les vidéos REACT-originales devraient avoir des sous-titres Wolof.",
      },
    },
    {
      name: "downloadUrl",
      type: "text",
      label: "URL de téléchargement (offline)",
      admin: {
        description:
          "Lien direct vers une copie téléchargeable de la vidéo (Drive, Dropbox, etc.) — pour " +
          "les utilisateurs avec une connexion intermittente. Optionnel.",
      },
      validate: (value: string | null | undefined) => {
        if (value && !/^https?:\/\//.test(value)) {
          return "URL doit commencer par http:// ou https://.";
        }
        return true;
      },
    },
    {
      name: "duration",
      type: "number",
      label: "Durée (secondes)",
      admin: {
        position: "sidebar",
        description: "Optionnel — affiché en mm:ss dans la liste.",
      },
      validate: (value: number | null | undefined) => {
        if (value !== null && value !== undefined && value < 0) {
          return "La durée ne peut pas être négative.";
        }
        return true;
      },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      label: "Date de publication",
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } },
    },
  ],
};
