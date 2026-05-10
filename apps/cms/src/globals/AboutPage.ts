import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { GlobalConfig } from "payload";

/**
 * /a-propos page copy — five editorial blocks that compose the About
 * page (Team is its own collection):
 *
 *   1. Hero      — eyebrow, headline, leadParagraph
 *   2. Mission   — eyebrow, sectionTitle, body (verbatim D019/A1)
 *   3. Vision    — eyebrow, sectionTitle, body (verbatim D019/A1)
 *   4. Values    — eyebrow, headline, 3 valueItems
 *   5. Founding  — eyebrow, headline, body (Lexical rich-text — needs
 *                  inline bold for dates / founder names)
 *   6. Legal     — label, body (Lexical — inline mono font for the
 *                  registration number)
 *
 * Lexical for Founding + Legal so editors can refine wording AND inline
 * formatting. Other blocks are plain text since they don't carry inline
 * emphasis.
 */
export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "Page À propos",
  access: { read: () => true },
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Hero",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "leadParagraph", type: "textarea", required: true },
      ],
    },
    {
      name: "mission",
      type: "group",
      label: "Mission (verbatim D019/A1)",
      fields: [
        { name: "eyebrow", type: "text", required: true, defaultValue: "Mission" },
        { name: "sectionTitle", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    {
      name: "vision",
      type: "group",
      label: "Vision (verbatim D019/A1)",
      fields: [
        { name: "eyebrow", type: "text", required: true, defaultValue: "Vision" },
        { name: "sectionTitle", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    {
      name: "values",
      type: "group",
      label: "Valeurs",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        {
          name: "items",
          type: "array",
          required: true,
          minRows: 1,
          fields: [
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
      ],
    },
    {
      name: "founding",
      type: "group",
      label: "Notre histoire",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        {
          name: "body",
          type: "richText",
          required: true,
          editor: lexicalEditor(),
          admin: {
            description:
              "Utiliser gras pour les dates clés et les noms des fondateurs (rendu en strong sur le site).",
          },
        },
      ],
    },
    {
      name: "legal",
      type: "group",
      label: "Statut juridique",
      fields: [
        { name: "label", type: "text", required: true, defaultValue: "Statut juridique" },
        {
          name: "body",
          type: "richText",
          required: true,
          editor: lexicalEditor(),
          admin: {
            description:
              "Utiliser code pour le numéro d'enregistrement (rendu en police mono sur le site).",
          },
        },
      ],
    },
  ],
};
