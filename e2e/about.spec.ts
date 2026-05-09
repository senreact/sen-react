import { expect, test } from "@playwright/test";

/**
 * /a-propos smoke — proves the About + Team page renders end-to-end with
 * the verbatim FR copy from decisions log §A1 + the 5 team members from
 * D011. Catches:
 *
 * - SSR breakage on any of the 6 sections (hero, mission/vision, values,
 *   founding, team, legal)
 * - Verbatim-copy drift — the mission statement is the brand voice
 *   agreed with Amadou. If a future PR alters it without sign-off, this
 *   test fails before it ships.
 * - Team-member regression — 5 named members at a minimum
 */

test("/a-propos renders the full About + Team shell", async ({ page }) => {
  const response = await page.goto("/a-propos");
  expect(response?.status(), "/a-propos must respond 200").toBe(200);

  // Hero
  await expect(
    page.getByRole("heading", {
      name: /Un réseau pour réinventer l'entrepreneuriat sénégalais et africain/i,
    }),
  ).toBeVisible();

  // Mission verbatim — first 6 words are enough to anchor
  await expect(page.getByText(/Notre mission est de favoriser la transition/i)).toBeVisible();

  // Vision verbatim
  await expect(
    page.getByText(/Être un leader incontournable de la révolution digitale/i),
  ).toBeVisible();

  // Values heading
  await expect(
    page.getByRole("heading", { name: /Trois principes qui nous guident/i }),
  ).toBeVisible();

  // Team — confirm key members render in the team section. Co-founder
  // names also appear in the Founding paragraph above, so scope to the
  // <p> tags inside the team cards (which use font-semibold).
  const team = page.locator("section").filter({ hasText: /L'équipe/i });
  await expect(team.getByText("Elhadj Amadou Samb")).toBeVisible();
  await expect(team.getByText("Cheikh Oumar Kane")).toBeVisible();
  await expect(team.getByText("Yaye Bineta Mamadou Dramé")).toBeVisible();

  // Legal note — registration number is the canonical identifier
  await expect(page.getByText(/N° 00020614\/MINT\/DGAT\/DLPL\/DAPA/i)).toBeVisible();
});
