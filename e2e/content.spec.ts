import { expect, test } from "@playwright/test";

/**
 * Phase 3 content surfaces — News / Publications / Videos.
 *
 * These tests run against a Vercel preview where `NEXT_PUBLIC_CMS_URL` is
 * either unset or the CMS has no published items yet. That reality is
 * what we lock against: the surfaces must render the empty-state
 * placeholder rather than crashing or showing a half-broken layout.
 *
 * Once the CMS goes live + has published rows, these assertions hold
 * because the page heading + nav structure are stable; only the
 * empty-state assertion would need swapping for a card-count check.
 *
 * Per-item readers (`/actualites/[slug]` etc.) ship 404 against an
 * unknown slug — same contract as `/secteurs/[slug]`. We assert that
 * here so a regression that silently rendered an empty article shell
 * would fail loudly.
 */

test("/actualites renders news index with empty-state when CMS is empty", async ({ page }) => {
  const response = await page.goto("/actualites");
  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", { name: /Le quotidien de l'entrepreneuriat/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Les premières actualités arrivent bientôt/i }),
  ).toBeVisible();
});

test("/publications renders publications index with empty-state", async ({ page }) => {
  const response = await page.goto("/publications");
  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", { name: /Études, notes et rapports/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Les premières publications arrivent bientôt/i }),
  ).toBeVisible();
});

test("/videos renders videos index with empty-state", async ({ page }) => {
  const response = await page.goto("/videos");
  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", { name: /Capsules, entretiens et témoignages/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Les premières vidéos arrivent bientôt/i }),
  ).toBeVisible();
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
