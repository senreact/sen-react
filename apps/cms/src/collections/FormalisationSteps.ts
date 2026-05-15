import type { CollectionConfig } from "payload";

export const FormalisationSteps: CollectionConfig = {
  slug: "formalisation-steps",
  labels: {
    singular: "Étape de formalisation",
    plural: "Étapes de formalisation",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["stepNumber", "title", "agencyName", "_status"],
    description:
      "Procédures de formalisation d'entreprise au Sénégal — BCE/APIX, RCCM/NINEA, FRA, plan d'affaires, gestion financière.",
  },
  access: {
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
      name: "stepNumber",
      type: "number",
      required: true,
      label: "Numéro d'étape",
      admin: {
        description: "Ordre d'affichage dans le parcours (1 = première étape).",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      label: "Titre de l'étape",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug (URL)",
      admin: {
        description: "Identifiant URL — lettres minuscules, chiffres et tirets uniquement.",
      },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      label: "Résumé",
      admin: {
        description: "Description courte affichée dans le parcours et en méta-description.",
      },
    },
    {
      name: "body",
      type: "richText",
      label: "Procédure détaillée",
      admin: {
        description:
          "Étapes, documents requis, formulaires, adresses — texte verbatim de la procédure officielle.",
      },
    },
    {
      name: "agencyName",
      type: "text",
      label: "Organisme responsable",
      admin: {
        description: "Ex. : APIX, OHADA/RCCM, DGI/NINEA, Ministère du Commerce.",
      },
    },
    {
      name: "externalUrl",
      type: "text",
      label: "Lien officiel (externe)",
      admin: {
        description: "URL du site officiel de l'organisme ou du formulaire à remplir.",
      },
    },
    {
      name: "externalLabel",
      type: "text",
      label: "Libellé du lien externe",
      admin: {
        description: "Texte du bouton, ex. : « Démarrer sur APIX.sn ».",
      },
    },
    {
      name: "estimatedDuration",
      type: "text",
      label: "Délai estimé",
      admin: {
        description: "Ex. : « 3 à 5 jours ouvrables ».",
      },
    },
    {
      name: "estimatedCost",
      type: "text",
      label: "Coût estimé",
      admin: {
        description: "Ex. : « Gratuit via APIX » ou « 25 000 FCFA ».",
      },
    },
    {
      name: "requiredDocuments",
      type: "array",
      label: "Documents requis",
      fields: [
        {
          name: "document",
          type: "text",
          required: true,
          label: "Document",
        },
      ],
      admin: {
        description: "Liste des pièces à fournir pour cette étape.",
      },
    },
  ],
};
