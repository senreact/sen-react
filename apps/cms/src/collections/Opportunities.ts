import type { CollectionConfig } from "payload";

import { SECTORS } from "@sen-react/shared";

/**
 * Opportunities — funding, training, calls for projects, partnerships
 * that REACT curates for its network.
 *
 * Per roadmap row 75 (Phase 4): manual entries via Payload, filterable
 * by sector / type / area / deadline / amount, keyword-searchable.
 *
 * Per D001: hybrid manual + aggregation source. Phase 4 ships the
 * collection populated by REACT manually; Phase 5 wires the aggregation
 * pipeline that pre-fills entries with `reactCurated: false` for
 * REACT review before publishing.
 */
export const Opportunities: CollectionConfig = {
  slug: "opportunities",
  labels: {
    singular: "Opportunité",
    plural: "Opportunités",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "sector", "opportunityType", "deadline", "reactCurated", "_status"],
    description:
      "Financements, formations, appels à projets et partenariats curés par REACT. Filtrable par secteur, type, géographie, deadline, montant.",
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: { drafts: { autosave: { interval: 2000 } } },
  defaultSort: "deadline",
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
        description: "Identifiant URL-safe — minuscules, chiffres, tirets seulement.",
      },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      label: "Résumé",
      admin: {
        description: "1-2 phrases. Affiché dans la carte d'index et en méta-description.",
      },
    },
    {
      name: "body",
      type: "richText",
      required: true,
      label: "Description complète",
    },
    {
      name: "sector",
      type: "select",
      required: true,
      label: "Secteur",
      options: SECTORS.map((s) => ({ label: s.fr, value: s.slug })),
      admin: {
        description: "Catégorisation par secteur D012 (un seul par opportunité).",
      },
    },
    {
      name: "opportunityType",
      type: "select",
      required: true,
      label: "Type",
      options: [
        { label: "Financement / subvention", value: "financement" },
        { label: "Formation / accompagnement", value: "formation" },
        { label: "Appel à projets", value: "appel-a-projets" },
        { label: "Partenariat", value: "partenariat" },
        { label: "Concours / prix", value: "concours" },
        { label: "Autre", value: "autre" },
      ],
    },
    {
      name: "area",
      type: "select",
      required: true,
      label: "Zone géographique",
      options: [
        { label: "Sénégal — national", value: "senegal" },
        { label: "Sénégal — Dakar", value: "senegal-dakar" },
        { label: "Sénégal — autres régions", value: "senegal-regions" },
        { label: "Afrique de l'Ouest", value: "afrique-ouest" },
        { label: "Afrique (continent)", value: "afrique" },
        { label: "International", value: "international" },
      ],
    },
    {
      name: "rolling",
      type: "checkbox",
      defaultValue: false,
      label: "Candidature en continu",
      admin: {
        description:
          "Cochez si les candidatures sont acceptées en continu, sans date limite fixe. Le champ « Date limite » devient alors facultatif.",
      },
    },
    {
      name: "deadline",
      type: "date",
      // Optional at the schema level so rolling opportunities need no date.
      // Backwards compatible: existing rows keep their deadline, and the
      // validate below still requires a date for non-rolling opportunities.
      required: false,
      label: "Date limite",
      admin: {
        date: { pickerAppearance: "dayOnly" },
        description: "Date limite de candidature. Filtrable par tranche (30j / 90j / 1 an).",
        // Hide the date field when the opportunity is marked rolling.
        condition: (_data, siblingData) => !siblingData?.rolling,
      },
      validate: (value: unknown, options?: { siblingData?: { rolling?: boolean } }) => {
        if (options?.siblingData?.rolling) return true;
        if (!value) return "Renseignez une date limite, ou cochez « Candidature en continu ».";
        return true;
      },
    },
    {
      name: "amountValue",
      type: "number",
      label: "Montant (valeur numérique)",
      admin: {
        description:
          "Optionnel. Valeur en XOF pour permettre le filtrage par tranche. Laisser vide si le montant est variable, conditionnel ou non communiqué.",
      },
    },
    {
      name: "amountCurrency",
      type: "select",
      defaultValue: "XOF",
      label: "Devise",
      options: [
        { label: "XOF (Franc CFA)", value: "XOF" },
        { label: "EUR", value: "EUR" },
        { label: "USD", value: "USD" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "amountDisplay",
      type: "text",
      label: "Montant (affichage)",
      admin: {
        description:
          "Texte affiché — ex. 'Jusqu'à 5 000 000 FCFA', 'Variable selon profil', 'Non communiqué'. Utilisé tel quel sur la carte.",
      },
    },
    {
      name: "source",
      type: "text",
      required: true,
      label: "Organisme",
      admin: {
        description: "Qui propose l'opportunité — ex. ADEPME, USAID, FONSIS, ANCAR.",
      },
    },
    {
      name: "sourceUrl",
      type: "text",
      label: "Lien candidature",
      admin: {
        description:
          "URL vers le formulaire / page officielle de candidature. Au moins l'un des deux (sourceUrl ou contactEmail) doit être renseigné.",
      },
      validate: (value: string | null | undefined) => {
        if (value && !/^https?:\/\//.test(value)) {
          return "URL doit commencer par http:// ou https://.";
        }
        return true;
      },
    },
    {
      name: "contactEmail",
      type: "email",
      label: "E-mail de contact",
      admin: {
        description: "Optionnel — alternative ou complément à sourceUrl.",
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
      name: "reactCurated",
      type: "checkbox",
      defaultValue: true,
      label: "Curé par REACT",
      admin: {
        position: "sidebar",
        description:
          "Coché par défaut pour les saisies manuelles. Les entrées issues de l'agrégation automatique (Phase 5) arriveront en `false` et nécessiteront une revue avant publication.",
      },
    },
  ],
};
