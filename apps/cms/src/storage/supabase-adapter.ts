import type { Adapter } from "@payloadcms/plugin-cloud-storage/types";
import { StorageClient } from "@supabase/storage-js";

/**
 * Payload cloud-storage adapter for Supabase Storage.
 *
 * Why custom (not @payloadcms/storage-s3): Supabase exposes S3-compatible
 * credentials only via the dashboard. Using the REST endpoint with the
 * service-role JWT we already have in env keeps the deploy fully
 * programmatic — no manual S3-credential generation step.
 *
 * Bucket must already exist + be public-read. Public-read makes
 * `staticHandler` a redirect to the CDN URL, avoiding a streaming proxy
 * through the CMS function (latency + bandwidth cost).
 *
 * `prefix` is the per-collection directory inside the bucket; the plugin
 * passes it on every call. Filenames in Payload's database are stored
 * WITHOUT the prefix — the plugin reconstructs the full path.
 */
export interface SupabaseStorageAdapterOptions {
  /** Supabase project URL (e.g. https://lhieyipykopqyeydrwoo.supabase.co). */
  url: string;
  /** Service-role JWT — has full read/write access to the bucket. */
  serviceRoleKey: string;
  /** Bucket name. Must be public-read. */
  bucket: string;
}

function buildKey(prefix: string | undefined, filename: string): string {
  if (!prefix) return filename;
  const trimmed = prefix.replace(/^\/+|\/+$/g, "");
  return trimmed ? `${trimmed}/${filename}` : filename;
}

export function supabaseStorageAdapter(opts: SupabaseStorageAdapterOptions): Adapter {
  const storageUrl = `${opts.url.replace(/\/$/, "")}/storage/v1`;
  const publicBase = `${opts.url.replace(/\/$/, "")}/storage/v1/object/public/${opts.bucket}`;

  // One client per adapter call; @supabase/storage-js handles its own connection pooling.
  const client = new StorageClient(storageUrl, {
    apikey: opts.serviceRoleKey,
    Authorization: `Bearer ${opts.serviceRoleKey}`,
  });
  const bucket = client.from(opts.bucket);

  return ({ prefix }) => ({
    name: "supabase-storage",

    handleUpload: async ({ file }) => {
      const key = buildKey(prefix, file.filename);
      const { error } = await bucket.upload(key, file.buffer, {
        contentType: file.mimeType,
        upsert: true,
        cacheControl: "public, max-age=31536000, immutable",
      });
      if (error) throw new Error(`Supabase storage upload failed for ${key}: ${error.message}`);
    },

    handleDelete: async ({ filename, doc }) => {
      const docPrefix = (doc as { prefix?: string } | undefined)?.prefix;
      const key = buildKey(docPrefix ?? prefix, filename);
      const { error } = await bucket.remove([key]);
      if (error) throw new Error(`Supabase storage delete failed for ${key}: ${error.message}`);
    },

    generateURL: ({ filename, prefix: callPrefix }) => {
      return `${publicBase}/${buildKey(callPrefix ?? prefix, filename)}`;
    },

    // 302 to the public CDN URL. The bucket is public-read, so the browser
    // can fetch directly. Saves us proxying every byte through Vercel.
    staticHandler: (_req, { params }) => {
      const key = buildKey(params.prefix ?? prefix, params.filename);
      return Response.redirect(`${publicBase}/${key}`, 302);
    },
  });
}
