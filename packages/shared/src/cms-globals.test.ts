import { describe, expect, it } from "vitest";

import { DEFAULT_SITE_FOOTER, DEFAULT_SITE_HEADER, type SocialPlatform } from "./cms-globals";

/**
 * Default-content guards — these defaults are what users see when the CMS
 * is unreachable (during dev, before the CMS is deployed, or if the CMS
 * goes down in production). The shape and minimum-viable content matter:
 *
 * - The header must always have a site title and at least one nav item,
 *   otherwise the layout has nothing to render.
 * - The footer must always have copyright + a contact email, otherwise the
 *   site looks legally incomplete and there's no recovery path for users
 *   who need to reach the org.
 */

describe("DEFAULT_SITE_HEADER", () => {
  it("has a non-empty site title", () => {
    expect(DEFAULT_SITE_HEADER.siteTitle).toBeTruthy();
    expect(DEFAULT_SITE_HEADER.siteTitle.length).toBeGreaterThan(0);
  });

  it("has at least one nav item", () => {
    expect(DEFAULT_SITE_HEADER.navItems).toBeDefined();
    expect((DEFAULT_SITE_HEADER.navItems ?? []).length).toBeGreaterThan(0);
  });

  it("every nav item has a FR label and an href", () => {
    for (const item of DEFAULT_SITE_HEADER.navItems ?? []) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href.length).toBeGreaterThan(0);
    }
  });
});

describe("DEFAULT_SITE_FOOTER", () => {
  it("has copyright text", () => {
    expect(DEFAULT_SITE_FOOTER.copyrightText.length).toBeGreaterThan(0);
  });

  it("has a contact email", () => {
    expect(DEFAULT_SITE_FOOTER.contactEmail).toMatch(/@/);
  });

  it("every social link uses a known platform value", () => {
    const allowed: SocialPlatform[] = [
      "instagram",
      "linkedin",
      "youtube",
      "whatsapp",
      "facebook",
      "x",
      "tiktok",
    ];
    for (const link of DEFAULT_SITE_FOOTER.socialLinks ?? []) {
      expect(allowed).toContain(link.platform);
      expect(link.href).toMatch(/^https?:\/\//);
    }
  });
});
