import type { CollectionConfig, FieldHook } from "payload";

import { SECTORS } from "@sen-react/shared";

import { extractYouTubeId } from "../lib/youtube";

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
 * client-side. Editors can paste a full YouTube link OR the bare ID; a
 * beforeChange hook extracts the 11-char ID on save (non-technical editors
 * paste the share URL, which previously failed the 11-char validation).
 */

// Extract the YouTube ID on save so a pasted full URL is stored as the ID.
const normalizeYouTubeId: FieldHook = ({ value }) => {
  const raw = value as string | null | undefined;
  return typeof raw === "string" ? (extractYouTubeId(raw) ?? raw) : raw;
};
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
      label: "Adresse de la page (slug)",
      admin: {
        description:
          "Adresse courte de la page, en minuscules avec des tirets — ex. « capsule-presentation ». " +
          "Ce n'est PAS le lien YouTube : celui-ci se met dans le champ « Lien ou ID YouTube » ci-dessous.",
      },
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
      label: "Lien ou ID YouTube",
      admin: {
        description:
          "Collez le lien YouTube complet (ex. https://www.youtube.com/watch?v=M5unlc9fGe0) " +
          "ou seulement l'identifiant à 11 caractères. Le lien est automatiquement converti en identifiant.",
      },
      hooks: {
        beforeChange: [normalizeYouTubeId],
      },
      validate: (value: string | null | undefined) => {
        if (!value) return "Lien ou ID YouTube requis.";
        if (!extractYouTubeId(value)) {
          return "Lien ou ID YouTube invalide — collez le lien complet (https://www.youtube.com/watch?v=…) ou l'identifiant à 11 caractères.";
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
