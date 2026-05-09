import { expect, test } from "@playwright/test";

/**
 * Phase 1 auth smoke — proves the sign-in / sign-up routes render
 * server-side, the form fields exist with the expected names, and the
 * header shows the logged-out auth slot. Catches:
 *
 * - SSR breakage on auth pages (Supabase client throws at module load)
 * - Form name regression (server action expects email/password by name;
 *   if a refactor renames them this fails before users ever see it)
 * - Header AuthNav crash (would propagate to every page in the layout)
 */

test("/connexion renders the sign-in form", async ({ page }) => {
  const response = await page.goto("/connexion");
  expect(response?.status(), "/connexion must respond 200").toBe(200);

  await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible();
});

test("/inscription renders the sign-up form with password hint", async ({ page }) => {
  const response = await page.goto("/inscription");
  expect(response?.status(), "/inscription must respond 200").toBe(200);

  await expect(page.getByRole("heading", { name: "Créer un compte" })).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByText(/au moins 8 caractères/i)).toBeVisible();
});

test("homepage header shows logged-out auth slot", async ({ page }) => {
  await page.goto("/");

  // Both anonymous-only links should be present in the header.
  await expect(page.getByRole("link", { name: "Se connecter" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Inscription" })).toBeVisible();
});
