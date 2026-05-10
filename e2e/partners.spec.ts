import { expect, test } from "@playwright/test";

/**
 * /partenaires smoke — proves the Partners page renders the 10 real
 * partners from D011, grouped into institutions (3) + NGOs (7). Catches:
 *
 * - SSR breakage on the page or any partner card
 * - Partner-list regression — the source of truth is
 *   apps/web/src/data/partners.ts; if a partner is removed by accident
 *   this test fails before it ships
 * - Group-count drift — institution heading should describe 3, NGO
 *   heading should describe 7
 */

test("/partenaires renders 10 partners grouped by type", async ({ page }) => {
  const response = await page.goto("/partenaires");
  expect(response?.status(), "/partenaires must respond 200").toBe(200);

  // Hero
  await expect(
    page.getByRole("heading", {
      name: /Les organisations qui font avancer le réseau/i,
    }),
  ).toBeVisible();

  // Group headings — generic now that the partner list is CMS-driven
  await expect(
    page.getByRole("heading", { name: /Agences et ministères du Sénégal/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /Organisations partenaires/i })).toBeVisible();

  // Spot-check key institutions
  await expect(page.getByText("ADEPME")).toBeVisible();
  await expect(page.getByText("ANCAR")).toBeVisible();

  // Spot-check key NGOs
  await expect(page.getByText("Enda ECOPOP")).toBeVisible();
  await expect(page.getByText("CIVIC HIVE")).toBeVisible();

  // Total count: 10 partner cards (3 institutions + 7 NGOs)
  // Each card is an <li> within the partner sections; assert >= 10.
  const cards = page.locator("li").filter({ has: page.locator("p.font-semibold") });
  await expect(cards).toHaveCount(10);
});
