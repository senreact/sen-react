/**
 * Seed script — populates Payload globals + collections with their
 * canonical initial values from the design decisions log.
 *
 * Usage:
 *   pnpm --filter @sen-react/cms seed
 *
 * The script is idempotent — every record is upserted, so re-running
 * resets globals back to canonical state. Editors can override fields
 * after seeding via the admin UI; re-running the seed will overwrite
 * those overrides, so only run after coordinating with REACT.
 *
 * Reads `DATABASE_URL`, `PAYLOAD_SECRET` from `.env.local` (or whatever
 * env source the parent shell provides). Connects to whichever Supabase
 * project the env points at, so the same script works against dev,
 * preview, and production databases — call sites are responsible for
 * loading the right env file before invoking.
 */

import { getPayload } from "payload";
import { fileURLToPath } from "url";

import { DEFAULT_SITE_FOOTER, DEFAULT_SITE_HEADER } from "@sen-react/shared";

import config from "./payload.config";

async function seed(): Promise<void> {
  const payload = await getPayload({ config });

  payload.logger.info("[seed] Upserting site-header global");
  await payload.updateGlobal({
    slug: "site-header",
    data: {
      siteTitle: DEFAULT_SITE_HEADER.siteTitle,
      tagline: DEFAULT_SITE_HEADER.tagline ?? null,
      navItems: (DEFAULT_SITE_HEADER.navItems ?? []).map((item) => ({
        label: item.label,
        labelEn: item.labelEn ?? null,
        href: item.href,
        external: item.external ?? false,
      })),
    },
  });

  payload.logger.info("[seed] Upserting site-footer global");
  await payload.updateGlobal({
    slug: "site-footer",
    data: {
      copyrightText: DEFAULT_SITE_FOOTER.copyrightText,
      description: DEFAULT_SITE_FOOTER.description ?? null,
      contactEmail: DEFAULT_SITE_FOOTER.contactEmail ?? null,
      contactAddress: DEFAULT_SITE_FOOTER.contactAddress ?? null,
      legalNavItems: (DEFAULT_SITE_FOOTER.legalNavItems ?? []).map((item) => ({
        label: item.label,
        labelEn: item.labelEn ?? null,
        href: item.href,
      })),
      socialLinks: (DEFAULT_SITE_FOOTER.socialLinks ?? []).map((link) => ({
        platform: link.platform,
        href: link.href,
      })),
    },
  });

  payload.logger.info("[seed] Done.");
}

if (import.meta.url === `file://${fileURLToPath(import.meta.url)}`) {
  seed()
    .then(() => process.exit(0))
    .catch((err: unknown) => {
      console.error("[seed] failed:", err);
      process.exit(1);
    });
}
