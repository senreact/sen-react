import { expect, test } from "@playwright/test";

/**
 * /contact smoke — proves the contact page renders all four channels
 * (WhatsApp, email, phone, address) with working deeplinks. Catches:
 *
 * - SSR breakage on the contact route
 * - Channel regression — if a contact detail goes missing this fails
 *   before users see a broken contact page
 * - Deeplink format breakage — wa.me, mailto:, tel: each have specific
 *   formats; validating href values catches typos
 */

test("/contact renders four channels with working deeplinks", async ({ page }) => {
  const response = await page.goto("/contact");
  expect(response?.status(), "/contact must respond 200").toBe(200);

  // Hero
  await expect(page.getByRole("heading", { name: /Échangeons directement/i })).toBeVisible();

  // WhatsApp deeplink — wa.me link with the E.164 number (no plus)
  const whatsappLink = page.getByRole("link", { name: /Ouvrir WhatsApp/i });
  await expect(whatsappLink).toBeVisible();
  await expect(whatsappLink).toHaveAttribute("href", "https://wa.me/221774986954");

  // Email deeplink — mailto:
  const emailLink = page.getByRole("link", { name: /Écrire un e-mail/i });
  await expect(emailLink).toBeVisible();
  await expect(emailLink).toHaveAttribute("href", "mailto:senreactsen@gmail.com");

  // Phone deeplink — tel:
  const phoneLink = page.getByRole("link", { name: /Appeler/i });
  await expect(phoneLink).toBeVisible();
  await expect(phoneLink).toHaveAttribute("href", "tel:+221774986954");

  // Address — confirm both lines render in the channel grid (footer
  // also surfaces the address; scope to <main> to avoid strict-mode
  // collision with the footer instance).
  const main = page.getByRole("main");
  await expect(main.getByText(/Sacrée Coeur 3, Lot N° 128\/B/i)).toBeVisible();
  await expect(main.getByText("Dakar, Sénégal", { exact: true })).toBeVisible();
});
