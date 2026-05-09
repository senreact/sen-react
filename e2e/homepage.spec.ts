import { expect, test } from "@playwright/test";

/**
 * Phase 2 homepage smoke — proves the brand-site shell renders correctly
 * end-to-end. Replaces the Phase 0 placeholder smoke. Catches:
 *
 * - SSR breakage on any of the 5 home sections (Hero / Domaines /
 *   Programmes / LatestNews / PartnerStrip)
 * - Locale regression (lang attribute drifts from "fr")
 * - Hero copy drift — these strings are the verbatim FR brand voice
 *   per decisions log §A1; if they ship altered without sign-off, the
 *   test fails before users see the change
 * - Routing regression (unexpected redirect)
 */

test("homepage renders Phase 2 brand-site shell", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status(), "homepage must respond 200").toBe(200);
  await expect(page.locator("html"), "html lang must be fr per D010 Q2").toHaveAttribute(
    "lang",
    "fr",
  );

  // Hero — verbatim FR copy from decisions log §A1
  await expect(
    page.getByRole("heading", {
      name: /Favoriser la transition digitale et écologique/i,
    }),
    "Hero headline must be the verbatim FR mission statement",
  ).toBeVisible();

  // Domaines section — proves 4-pillar block renders
  await expect(
    page.getByRole("heading", { name: /Quatre piliers, une mission cohérente/i }),
    "Domaines section heading must be visible",
  ).toBeVisible();

  // Programmes — Sen React as the headline programme, plus the 3
  // placeholder slots awaiting Amadou's Q1 answer
  await expect(
    page.getByRole("heading", { name: /Nos initiatives en action/i }),
    "Programmes section heading must be visible",
  ).toBeVisible();

  // News block — Phase 3 placeholder
  await expect(
    page.getByRole("heading", { name: /Dernières publications/i }),
    "Latest news heading must be visible",
  ).toBeVisible();

  // Partner strip — placeholder grid
  await expect(
    page.getByRole("heading", { name: /Ils nous accompagnent/i }),
    "Partner strip heading must be visible",
  ).toBeVisible();
});
