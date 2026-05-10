import type { CollectionConfig } from "payload";

/**
 * Team — REACT staff listed on /a-propos. Per D011 there are 5 members.
 *
 * Photos are pending REACT-side per docs/pending-react-input.md — the
 * apps/web component renders an initials placeholder when `photo` is
 * empty so the layout doesn't shift when real headshots arrive.
 */
export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: {
    singular: "Membre de l'équipe",
    plural: "Équipe",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order", "_status"],
    description: "Membres de l'équipe REACT affichés sur /a-propos.",
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
    },
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nom complet",
    },
    {
      name: "role",
      type: "text",
      required: true,
      label: "Rôle",
    },
    {
      name: "order",
      type: "number",
      required: true,
      label: "Ordre",
      defaultValue: 0,
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      label: "Photo",
      admin: {
        description: "Optionnelle. En attente — placeholder initiales en attendant.",
      },
    },
  ],
};
