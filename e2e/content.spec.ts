import { expect, test } from "@playwright/test";

/**
 * Phase 3 content surfaces — News / Publications / Videos.
 *
 * These tests run against a Vercel preview where the CMS is populated
 * with the fixture seeds (PR-SEED-A). They assert the page heading +
 * that at least one content card renders. Empty-state assertions used
 * to live here; they were swapped when the seed populated all four
 * collections.
 *
 * Per-item readers (`/actualites/[slug]` etc.) ship 404 against an
 * unknown slug — same contract as `/secteurs/[slug]`. We assert that
 * here so a regression that silently rendered an empty article shell
 * would fail loudly.
 */

test("/actualites renders news index with cards", async ({ page }) => {
  const response = await page.goto("/actualites");
  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", { name: /Le quotidien de l'entrepreneuriat/i }),
  ).toBeVisible();
  // At least one news card has rendered.
  await expect(page.locator("main li").first()).toBeVisible();
});

test("/publications renders publications index with cards", async ({ page }) => {
  const response = await page.goto("/publications");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("heading", { name: /Études, notes et rapports/i })).toBeVisible();
  await expect(page.locator("main li").first()).toBeVisible();
});

test("/videos renders videos index with cards", async ({ page }) => {
  const response = await page.goto("/videos");
  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", { name: /Capsules, entretiens et témoignages/i }),
  ).toBeVisible();
  await expect(page.locator("main li").first()).toBeVisible();
});

test("/actualites/<unknown-slug> returns 404", async ({ page }) => {
  const response = await page.goto("/actualites/this-article-does-not-exist");
  expect(response?.status()).toBe(404);
});

test("/publications/<unknown-slug> returns 404", async ({ page }) => {
  const response = await page.goto("/publications/this-publication-does-not-exist");
  expect(response?.status()).toBe(404);
});

test("/videos/<unknown-slug> returns 404", async ({ page }) => {
  const response = await page.goto("/videos/this-video-does-not-exist");
  expect(response?.status()).toBe(404);
});
