/**
 * One-off patch — adds the missing CGU link to the site-footer global.
 *
 * The seed was first run before Phase 11 added the CGU page, so the live
 * Payload global lacks that nav item. This script fetches the current
 * legalNavItems, inserts CGU at position 1 (after "Mentions légales"),
 * and saves. All other footer fields are left untouched.
 *
 * Usage (against production — make sure DATABASE_URL + PAYLOAD_SECRET
 * point at the production Supabase project):
 *
 *   pnpm --filter @sen-react/cms patch:footer-cgu
 *
 * Idempotent: if CGU is already present it exits without writing.
 */

(process.env as Record<string, string>).NODE_ENV = "production";

import { getPayload } from "payload";

import config from "./payload.config";

const CGU_ITEM = {
  label: "CGU",
  labelEn: "Terms",
  href: "/conditions-utilisation",
};

async function patchFooterCgu(): Promise<void> {
  const payload = await getPayload({ config });

  const current = await payload.findGlobal({ slug: "site-footer" });

  const existing: Array<{ label: string; labelEn?: string | null; href: string }> =
    (current as { legalNavItems?: Array<{ label: string; labelEn?: string | null; href: string }> })
      .legalNavItems ?? [];

  if (existing.some((item) => item.href === CGU_ITEM.href)) {
    payload.logger.info("[patch-footer-cgu] CGU already present — nothing to do.");
    process.exit(0);
  }

  // Insert after "Mentions légales" (index 0), before "Confidentialité".
  const mentionsIdx = existing.findIndex((item) => item.href === "/mentions-legales");
  const insertAt = mentionsIdx >= 0 ? mentionsIdx + 1 : existing.length;
  const updated = [...existing.slice(0, insertAt), CGU_ITEM, ...existing.slice(insertAt)];

  await payload.updateGlobal({
    slug: "site-footer",
    data: { legalNavItems: updated },
  });

  payload.logger.info(
    `[patch-footer-cgu] CGU inserted at position ${insertAt}. Footer now has ${updated.length} legal nav items.`,
  );

  process.exit(0);
}

patchFooterCgu().catch((err) => {
  console.error("[patch-footer-cgu] FATAL:", err);
  process.exit(1);
});
