import type { GlobalConfig } from "payload";

/**
 * /contact page copy — eyebrow, headline, lead paragraph, hint strings
 * for each channel card, and the "Quel canal pour quoi" guide list.
 *
 * The actual contact details (email, phone, address) live in the
 * `contact-info` global so they stay in sync with the SiteFooter and
 * any other surface that needs them. This global only owns editorial
 * copy.
 */
export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Page Contact — copie",
  access: { read: () => true },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      required: true,
      label: "Étiquette (eyebrow)",
    },
    {
      name: "headline",
      type: "text",
      required: true,
      label: "Titre principal (H1)",
    },
    {
      name: "leadParagraph",
      type: "textarea",
      required: true,
      label: "Paragraphe d'introduction",
    },
    {
      name: "channelHints",
      type: "group",
      label: "Indices sous chaque canal",
      fields: [
        { name: "whatsapp", type: "text", required: true, label: "WhatsApp" },
        { name: "email", type: "text", required: true, label: "E-mail" },
        { name: "phone", type: "text", required: true, label: "Téléphone" },
      ],
    },
    {
      name: "channelGuide",
      type: "array",
      label: "Section 'Quel canal pour quoi ?'",
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: "channel", type: "text", required: true, label: "Canal (gras)" },
        { name: "guidance", type: "textarea", required: true, label: "Guidance" },
      ],
    },
    {
      name: "channelGuideHeading",
      type: "text",
      required: true,
      label: "Titre de la section guide",
      defaultValue: "Quel canal pour quoi ?",
    },
  ],
};
