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

  // Programmes — Sen React headline + 2 active programmes per D021
  // (Amadou Q1 confirmed 2026-05-07). No more placeholders.
  await expect(
    page.getByRole("heading", { name: /Nos initiatives en action/i }),
    "Programmes section heading must be visible",
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Projet Sen React" }),
    "Headline programme must be Projet Sen React",
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Projet 3A" }),
    "Active programme: Projet 3A",
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "IA for Change" }),
    "Active programme: IA for Change",
  ).toBeVisible();

  // News block — Phase 3 placeholder
  await expect(
    page.getByRole("heading", { name: /Dernières publications/i }),
    "Latest news heading must be visible",
  ).toBeVisible();

  // Partner strip — heading updated per Amadou's Batch A feedback
  await expect(
    page.getByRole("heading", { name: /Nos partenaires/i }),
    "Partner strip heading must be visible",
  ).toBeVisible();
});
