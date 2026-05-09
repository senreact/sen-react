#!/usr/bin/env node
/**
 * One-shot Playwright screenshot capture.
 * Used by the verify-phase / visual-check workflow to persist a deployed-page
 * screenshot to disk (Chrome MCP only returns inline images and may apply
 * user-agent dark-mode overlays that don't reflect the canonical render).
 *
 * Headless Chromium with no extensions and explicit light colorScheme gives
 * the canonical "what a fresh visitor sees" rendering.
 *
 * Usage: node scripts/capture-screenshot.mjs <url> <output-path>
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";

const [, , urlArg, outArg] = process.argv;
if (!urlArg || !outArg) {
  console.error("usage: capture-screenshot.mjs <url> <output-path>");
  process.exit(2);
}

const outPath = resolve(outArg);
await mkdir(dirname(outPath), { recursive: true });

const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1600 },
    colorScheme: "light",
  });
  const page = await context.newPage();
  const response = await page.goto(urlArg, { waitUntil: "networkidle", timeout: 30_000 });
  const status = response?.status() ?? -1;
  if (status !== 200) {
    console.error(`navigation returned HTTP ${status}`);
    process.exit(3);
  }
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`saved ${outPath}`);
} finally {
  await browser.close();
}
