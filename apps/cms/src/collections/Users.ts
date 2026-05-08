import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    // Email + password come from `auth: true`.
    // Profile/role fields land in Phase 1 (D015 + D020 profile-types lock).
  ],
};
