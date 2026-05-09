import { expect, test } from "@playwright/test";

/**
 * Sector pages smoke — covers the index + a representative sample of
 * dynamic [slug] routes. Catches:
 *
 * - SSR breakage on either the index or a [slug] page
 * - generateStaticParams regression — the dynamic route should pre-render
 *   all 10 sector slugs from D012; we sample a few here
 * - 404 path — an unknown slug must hit notFound() rather than crashing
 *   or showing an empty placeholder shell with no real content
 */

test("/secteurs index lists 10 sectors", async ({ page }) => {
  const response = await page.goto("/secteurs");
  expect(response?.status(), "/secteurs must respond 200").toBe(200);

  await expect(
    page.getByRole("heading", { name: /Dix secteurs, une économie en transition/i }),
  ).toBeVisible();

  // 10 sector cards = 10 <h3> headings inside the index list.
  const main = page.getByRole("main");
  const cards = main.locator("ul li h3");
  await expect(cards).toHaveCount(10);

  // Spot-check first + last sector titles
  await expect(main.getByRole("heading", { name: "Digitalisation et technologie" })).toBeVisible();
  await expect(main.getByRole("heading", { name: "Saponification" })).toBeVisible();
});

test("/secteurs/agroecologie renders a known sector", async ({ page }) => {
  const response = await page.goto("/secteurs/agroecologie");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("heading", { name: "Agroécologie" })).toBeVisible();
  await expect(page.getByText(/Agriculture biologique/i)).toBeVisible();

  // Three placeholder content blocks ship by default
  await expect(page.getByRole("heading", { name: "Acteurs clés" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Opportunités" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ressources" })).toBeVisible();
});

test("/secteurs/<unknown-slug> returns 404", async ({ page }) => {
  const response = await page.goto("/secteurs/this-sector-does-not-exist");
  expect(response?.status()).toBe(404);
});
