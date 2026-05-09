import type { GlobalConfig } from "payload";

export const SiteFooter: GlobalConfig = {
  slug: "site-footer",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "copyrightText",
      type: "text",
      required: true,
      defaultValue: "© 2026 Sen React",
      label: "Copyright text",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description (FR)",
      admin: {
        description: "Short FR blurb shown alongside the copyright in the footer.",
      },
    },
    {
      name: "legalNavItems",
      type: "array",
      label: "Legal nav (Privacy / Terms / Cookies)",
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
        },
      ],
    },
    {
      name: "contactEmail",
      type: "email",
      label: "Contact email",
    },
    {
      name: "contactAddress",
      type: "textarea",
      label: "Contact address",
      admin: {
        description: "Free-form address (e.g. Sacrée Coeur 3 Lot N° 128/B, Dakar).",
      },
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Social links",
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "YouTube", value: "youtube" },
            { label: "WhatsApp", value: "whatsapp" },
            { label: "Facebook", value: "facebook" },
            { label: "X / Twitter", value: "x" },
            { label: "TikTok", value: "tiktok" },
          ],
        },
        {
          name: "href",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
