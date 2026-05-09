import type { CollectionConfig } from "payload";

import { SECTORS } from "@sen-react/shared";

/**
 * News / blog posts. Per decisions log §A3:
 *
 * - Cadence: weekly (REACT team writes some + aggregation pipeline (D004,
 *   Phase 5) generates the rest).
 * - Categorisation: by sector (D012, 10 sectors).
 * - Comments: moderated (Phase 8 community will surface them; this
 *   collection just stores the moderation state).
 * - Two write paths: REACT-original (hand-written) + aggregated
 *   (auto-generated, sourced).
 *
 * Slug is the URL key. Body uses Lexical rich-text — reuse the editor
 * configured at the Payload root level so quote / heading / link
 * features stay consistent across collections.
 */
export const News: CollectionConfig = {
  slug: "news",
  labels: {
    singular: "Article",
    plural: "Actualités",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "sector", "publishedAt", "writePath", "_status"],
    description: "Articles d'actualité publiés par REACT ou agrégés depuis les sources externes.",
  },
  access: {
    // Public REST: only published items are readable. Drafts are admin-only.
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
        description: "URL-safe identifier — lowercase letters, digits, hyphens only.",
      },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      label: "Résumé",
      admin: {
        description: "1-2 sentences. Shown in the news index card and as the meta description.",
      },
    },
    {
      name: "body",
      type: "richText",
      required: true,
      label: "Contenu",
    },
    {
      name: "sector",
      type: "select",
      required: true,
      label: "Secteur",
      options: SECTORS.map((s) => ({ label: s.fr, value: s.slug })),
      admin: {
        description: "Catégorisation par secteur D012 (un seul par article).",
      },
    },
    {
      name: "writePath",
      type: "select",
      required: true,
      defaultValue: "react-original",
      label: "Source",
      options: [
        { label: "REACT (rédaction interne)", value: "react-original" },
        { label: "Agrégé (chaîne d'agrégation)", value: "aggregated" },
      ],
    },
    {
      name: "sourceUrl",
      type: "text",
      label: "URL source",
      admin: {
        description:
          "Lien d'origine pour les articles agrégés. Obligatoire quand writePath = aggregated.",
        condition: (data) => data.writePath === "aggregated",
      },
      validate: (value: string | null | undefined, args: { siblingData: unknown }) => {
        const sib = args.siblingData as { writePath?: string };
        if (sib.writePath === "aggregated" && !value) {
          return "URL source requise pour les articles agrégés.";
        }
        if (value && !/^https?:\/\//.test(value)) {
          return "URL doit commencer par http:// ou https://.";
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
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Image de couverture",
      admin: {
        position: "sidebar",
        description: "Optionnelle. Affichée en haut de l'article et dans la carte d'index.",
      },
    },
    {
      name: "commentsEnabled",
      type: "checkbox",
      defaultValue: true,
      label: "Commentaires activés",
      admin: {
        position: "sidebar",
        description:
          "Modération obligatoire (Phase 8). Décocher pour fermer les commentaires sur cet article.",
      },
    },
  ],
};
