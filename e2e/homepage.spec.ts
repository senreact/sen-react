import { expect, test } from "@playwright/test";

/**
 * Phase 0 smoke — proves the deployed (or locally-served) homepage renders
 * the FR-primary placeholder. Catches:
 *
 * - SSR breakage (page crashes server-side; user gets 500)
 * - Locale regression (lang attribute drifts from "fr")
 * - Sectors data loss (homepage stops rendering the 10-sector list)
 * - Routing regression (unexpected redirect)
 */

test("homepage renders FR-primary Phase 0 placeholder", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status(), "homepage must respond 200").toBe(200);
  await expect(page.locator("html"), "html lang must be fr per D010 Q2").toHaveAttribute(
    "lang",
    "fr",
  );

  await expect(
    page.getByRole("heading", { name: /Plateforme en cours de construction/i }),
    "Phase 0 hero copy must be present",
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: /Secteurs d'intervention \(10\)/i }),
    "Sector count heading must show 10",
  ).toBeVisible();
});
