import type { GlobalConfig } from "payload";

/**
 * Empty-state copy — used when a content surface has no published items
 * yet, OR (for the homepage) when the news collection is empty and we
 * fall back to placeholder cards.
 *
 * One global with named groups so editors edit all empty-state strings
 * in one place. Each group has a title + description used by the
 * dashed-card component on /actualites, /publications, /videos. The
 * homepage's LatestNews fallback uses three "Bientôt"-style preview
 * cards — kept editable too so REACT can refine wording without a
 * code change.
 */
export const EmptyStates: GlobalConfig = {
  slug: "empty-states",
  label: "États vides (placeholders)",
  access: { read: () => true },
  fields: [
    {
      name: "news",
      type: "group",
      label: "/actualites",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "publications",
      type: "group",
      label: "/publications",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "videos",
      type: "group",
      label: "/videos",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "opportunities",
      type: "group",
      label: "/opportunites",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "opportunitiesNoMatch",
      type: "group",
      label: "/opportunites — aucun résultat aux filtres",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "homepageLatestNewsFallback",
      type: "array",
      label: "Page d'accueil — Cartes 'Dernières publications' (lorsque vide)",
      minRows: 1,
      maxRows: 6,
      admin: {
        description:
          "Cartes affichées quand la collection News n'a pas encore d'articles publiés. Disparaissent dès qu'un vrai article est publié.",
      },
      fields: [
        { name: "eyebrow", type: "text", required: true, label: "Étiquette (ex. 'Bientôt')" },
        { name: "title", type: "text", required: true },
        { name: "excerpt", type: "textarea", required: true },
      ],
    },
  ],
};
