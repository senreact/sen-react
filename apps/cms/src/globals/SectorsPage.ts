import type { GlobalConfig } from "payload";

/**
 * Sectors page copy — shared editorial layer across `/secteurs` and the
 * 10 `/secteurs/[slug]` routes.
 *
 * The 10-sector taxonomy stays in `@sen-react/shared` (D012 fixed
 * enum used as type values across News/Publications/Videos). This
 * global only owns the editorial copy that wraps the taxonomy:
 *
 *   - index: hero on /secteurs (above the 10-card grid)
 *   - detail: shared template copy on /secteurs/[slug] (back link
 *     label, eyebrow, placeholder header, the 3 placeholder blocks
 *     for Acteurs/Opportunités/Ressources)
 *
 * Per-sector specific content (Q5 voicenotes from Amadou) lands later
 * as a separate `sector-content` collection keyed by slug — that's
 * the Phase 2 yellow row in the roadmap §3.
 */
export const SectorsPage: GlobalConfig = {
  slug: "sectors-page",
  label: "Page Secteurs",
  access: { read: () => true },
  fields: [
    {
      name: "index",
      type: "group",
      label: "Page d'index (/secteurs)",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "leadParagraph", type: "textarea", required: true },
      ],
    },
    {
      name: "detail",
      type: "group",
      label: "Page secteur (/secteurs/[slug])",
      fields: [
        { name: "backLinkLabel", type: "text", required: true },
        { name: "eyebrow", type: "text", required: true },
        {
          name: "placeholderHeader",
          type: "group",
          label: "En-tête placeholder",
          fields: [
            { name: "eyebrow", type: "text", required: true },
            { name: "headline", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
        {
          name: "placeholderBlocks",
          type: "array",
          required: true,
          minRows: 1,
          maxRows: 6,
          label: "Blocs placeholder (Acteurs / Opportunités / Ressources)",
          fields: [
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
      ],
    },
  ],
};
