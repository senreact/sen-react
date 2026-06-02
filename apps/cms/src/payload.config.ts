import { postgresAdapter } from "@payloadcms/db-postgres";
import { cloudStoragePlugin } from "@payloadcms/plugin-cloud-storage";
import { lexicalEditor, LinkFeature } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import type { CollectionConfig, Field, FieldHook, GlobalConfig } from "payload";

import {
  linkUrlError,
  normalizeLinkUrl,
  normalizeRichTextLinks,
  normalizeRichTextLinksGlobal,
} from "./lib/lexical-links";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { supabaseStorageAdapter } from "./storage/supabase-adapter";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { News } from "./collections/News";
import { Publications } from "./collections/Publications";
import { Videos } from "./collections/Videos";
import { Partners } from "./collections/Partners";
import { Programmes } from "./collections/Programmes";
import { TeamMembers } from "./collections/TeamMembers";
import { Opportunities } from "./collections/Opportunities";
import { Events } from "./collections/Events";
import { Announcements } from "./collections/Announcements";
import { Trainings } from "./collections/Trainings";
import { Resources } from "./collections/Resources";
import { FormalisationSteps } from "./collections/FormalisationSteps";
import { SiteHeader } from "./globals/SiteHeader";
import { SiteFooter } from "./globals/SiteFooter";
import { ContactInfo } from "./globals/ContactInfo";
import { HomepageHero } from "./globals/HomepageHero";
import { HomepageDomaines } from "./globals/HomepageDomaines";
import { EmptyStates } from "./globals/EmptyStates";
import { ContactPage } from "./globals/ContactPage";
import { AboutPage } from "./globals/AboutPage";
import { SectorsPage } from "./globals/SectorsPage";
import { AuthStrings } from "./globals/AuthStrings";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// CORS / CSRF allow-list — derived from NEXT_PUBLIC_SITE_URL plus
// known Vercel deployment hostnames. Browsers blocked from cross-origin
// fetches against /api/* unless the Origin matches one of these.
// (IDU audit chunk 2 F31 — Payload's default omits CORS headers, so the
// behaviour today is same-origin-only; setting this explicitly future-proofs
// against Payload defaults shifting and documents the intent.)
const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_CMS_URL,
  // The admin panel must be allowed to call its OWN API — otherwise CSRF
  // rejects cookie-authed mutations (create/update/delete/publish) with a
  // 403 "You are not allowed to perform this action", while reads still work
  // (GET isn't CSRF-checked). On Vercel, the deployment's own origin is only
  // known at runtime: VERCEL_PROJECT_PRODUCTION_URL is the stable prod domain
  // and VERCEL_URL is the per-deployment (preview) domain — without these,
  // preview-deployment admins can't publish.
  process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  "https://sen-react.vercel.app",
  "https://sen-react-cms.vercel.app",
  // Local dev: the CMS admin runs on :3001, apps/web on :3000.
  "http://localhost:3000",
  "http://localhost:3001",
].filter((origin): origin is string => Boolean(origin));

// Inject the rich-text link normaliser/validator into every collection + global
// so link URLs are trimmed/de-duplicated on save and bad URLs are rejected with
// a clear French message on publish — without repeating the hook per file.
const withCollectionLinkHook = (collection: CollectionConfig): CollectionConfig => ({
  ...collection,
  hooks: {
    ...collection.hooks,
    beforeValidate: [...(collection.hooks?.beforeValidate ?? []), normalizeRichTextLinks],
  },
});
const withGlobalLinkHook = (global: GlobalConfig): GlobalConfig => ({
  ...global,
  hooks: {
    ...global.hooks,
    beforeValidate: [...(global.hooks?.beforeValidate ?? []), normalizeRichTextLinksGlobal],
  },
});

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  collections: [
    Users,
    Media,
    News,
    Publications,
    Videos,
    Partners,
    Programmes,
    TeamMembers,
    Opportunities,
    Events,
    Announcements,
    Trainings,
    Resources,
    FormalisationSteps,
  ].map(withCollectionLinkHook),
  globals: [
    SiteHeader,
    SiteFooter,
    ContactInfo,
    HomepageHero,
    HomepageDomaines,
    EmptyStates,
    ContactPage,
    AboutPage,
    SectorsPage,
    AuthStrings,
  ].map(withGlobalLinkHook),
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Override the default Lexical link feature. The default validates link
      // URLs with `validateUrlMinimal`, which rejects any URL containing a
      // space — including an invisible leading/trailing space picked up when
      // pasting a link. That failure blocks the ENTIRE publish with a cryptic
      // English "The following fields are invalid: url" pinned to the body
      // field (REACT editors hit this as "it refuses to publish"). Here we trim
      // whitespace before saving + validating, and give clear French errors for
      // genuinely malformed URLs.
      LinkFeature({
        fields: ({ defaultFields }) =>
          defaultFields.map((field): Field => {
            if (!("name" in field) || field.name !== "url") return field as Field;
            const existing = field as { hooks?: { beforeChange?: FieldHook[] } };
            const normalizeHook: FieldHook = ({ value }) =>
              typeof value === "string" ? normalizeLinkUrl(value) : value;
            return {
              ...field,
              hooks: {
                ...existing.hooks,
                beforeChange: [normalizeHook, ...(existing.hooks?.beforeChange ?? [])],
              },
              validate: (value: unknown, options?: { siblingData?: { linkType?: string } }) => {
                if (options?.siblingData?.linkType === "internal") return true;
                if (typeof value !== "string") return true;
                return linkUrlError(normalizeLinkUrl(value)) ?? true;
              },
            } as Field;
          }),
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
    // Payload-managed tables live under the `payload` schema so they don't
    // collide with Supabase's `auth`, `storage`, or app-owned schemas.
    schemaName: "payload",
    // Wire the committed migrations so prod deploys can apply them via
    // `pnpm payload migrate` instead of relying on dev-mode `push`.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    // Media uploads route to Supabase Storage (bucket `sen-react-media`) when
    // the env vars are present. Without them — local dev with no service-role
    // key — uploads fall back to the local filesystem (Payload default).
    // Vercel serverless containers can't persist local files across deploys,
    // so prod relies on this plugin being configured.
    ...(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
      ? [
          cloudStoragePlugin({
            collections: {
              media: {
                adapter: supabaseStorageAdapter({
                  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
                  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
                  bucket: process.env.SUPABASE_STORAGE_BUCKET ?? "sen-react-media",
                }),
                disableLocalStorage: true,
              },
            },
          }),
        ]
      : []),
  ],
});
