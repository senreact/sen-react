import type { GlobalConfig } from "payload";

/**
 * Contact info — single source of truth for REACT's address, email,
 * WhatsApp/phone, and any future contact channel.
 *
 * Consumed by /contact, the SiteFooter, and any deep-link helpers in
 * apps/web. Phone is split into E.164 (machine) and a human display
 * string so wa.me / tel: links and the visible label stay in sync.
 */
export const ContactInfo: GlobalConfig = {
  slug: "contact-info",
  label: "Coordonnées",
  access: { read: () => true },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      label: "Adresse e-mail",
    },
    {
      name: "phoneE164",
      type: "text",
      required: true,
      label: "Téléphone (E.164)",
      admin: {
        description:
          "Format E.164 sans séparateurs — ex. +221773213955. Utilisé pour les liens wa.me / tel:.",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return "Téléphone requis.";
        if (!/^\+\d{8,15}$/.test(value)) return "Format E.164 invalide (ex. +221773213955).";
        return true;
      },
    },
    {
      name: "phoneDisplay",
      type: "text",
      required: true,
      label: "Téléphone (affichage)",
      admin: { description: "Format avec séparateurs — ex. '+221 77 321 39 55'." },
    },
    {
      name: "addressLines",
      type: "array",
      required: true,
      label: "Adresse",
      minRows: 1,
      maxRows: 5,
      fields: [{ name: "line", type: "text", required: true, label: "Ligne" }],
      admin: { description: "Une ligne par champ. Affichée multi-ligne dans le pied / Contact." },
    },
  ],
};
