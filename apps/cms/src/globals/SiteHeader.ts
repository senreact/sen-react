import type { GlobalConfig } from "payload";

export const SiteHeader: GlobalConfig = {
  slug: "site-header",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "siteTitle",
      type: "text",
      required: true,
      defaultValue: "Sen React",
    },
    {
      name: "tagline",
      type: "text",
      label: "Tagline (FR)",
      admin: {
        description: "Short FR phrase shown alongside the site title in the header.",
      },
    },
    {
      name: "navItems",
      type: "array",
      label: "Primary nav items",
      minRows: 0,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Label (FR)",
        },
        {
          name: "labelEn",
          type: "text",
          label: "Label (EN)",
        },
        {
          name: "href",
          type: "text",
          required: true,
          admin: {
            description: "Path relative to root (e.g. /secteurs) or full URL for external links.",
          },
        },
        {
          name: "external",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Open in a new tab and add rel=noopener.",
          },
        },
      ],
    },
  ],
};
