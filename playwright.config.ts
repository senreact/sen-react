import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for sen-react.
 *
 * Two run modes:
 *
 * 1. Local — `pnpm e2e` against `pnpm dev` on port 3000. The `webServer` block
 *    boots `apps/web` automatically.
 *
 * 2. CI — `pnpm e2e` with `BASE_URL=<vercel-preview-url>` set in env. The
 *    `webServer` block is skipped because `BASE_URL` resolves to a remote host.
 *
 * Failure on a single retry catches flake without masking real bugs.
 */
const isCI = !!process.env.CI;
const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const testingRemote = !baseURL.includes("127.0.0.1") && !baseURL.includes("localhost");

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["github"], ["list"]] : "list",

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Boot apps/web only when targeting localhost. Remote targets (Vercel
  // preview/production) are presumed already running.
  webServer: testingRemote
    ? undefined
    : {
        command: "pnpm --filter @sen-react/web dev",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
});
