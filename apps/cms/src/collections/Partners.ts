import type { CollectionConfig } from "payload";

/**
 * Partners — D011 inventory of orgs that REACT works with.
 *
 * Two kinds: `institution` (Sénégal government / state agencies) and
 * `ngo` (société civile). The kind drives the grouping on /partenaires
 * and the badge style.
 *
 * Order field is explicit because Amadou's listing order carries
 * editorial weight (don't alphabetise without sign-off).
 */
export const Partners: CollectionConfig = {
  slug: "partners",
  labels: {
    singular: "Partenaire",
    plural: "Partenaires",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "kind", "order", "_status"],
    description:
      "Partenaires institutionnels et société civile de REACT. Logos téléchargés via Media.",
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: { drafts: { autosave: { interval: 2000 } } },
  defaultSort: "order",
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug",
      admin: {
        description: "Identifiant URL-safe — lettres minuscules, chiffres, tirets seulement.",
      },
    },
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nom",
      admin: {
        description: "Nom affiché tel que l'a écrit Amadou. Pas de tri alphabétique imposé.",
      },
    },
    {
      name: "kind",
      type: "select",
      required: true,
      label: "Type",
      options: [
        { label: "Institution publique", value: "institution" },
        { label: "Société civile / ONG", value: "ngo" },
      ],
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Description",
      admin: {
        description:
          "Une phrase, FR. Décrit la catégorie ou le rôle — éviter les spécificités non confirmées par Amadou.",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      label: "Ordre",
      defaultValue: 0,
      admin: {
        description:
          "Ordre d'affichage dans son groupe (institution / ngo). 0 = en haut. Reflète l'ordre d'Amadou — ne pas trier par alphabet.",
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "Logo",
      admin: {
        description:
          "Optionnel — affiché dans la carte. En attente côté REACT, placeholder initiales sinon.",
      },
    },
  ],
};
