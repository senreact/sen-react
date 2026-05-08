import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";

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
  "https://sen-react.vercel.app",
  "https://sen-react-cms.vercel.app",
].filter((origin): origin is string => Boolean(origin));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  collections: [Users, Media],
  editor: lexicalEditor(),
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
  }),
  sharp,
  plugins: [],
});
