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
 * Usage:
 *   node scripts/capture-screenshot.mjs <url> <output-path> [viewport]
 *
 * `viewport` is an optional preset:
 *   mobile   →  390 × 844  (iPhone 14)
 *   tablet   →  768 × 1024 (iPad)
 *   desktop  → 1280 × 1600 (default)
 *   <w>x<h>  → custom, e.g. 1440x900
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 1600 },
};

function resolveViewport(token) {
  if (!token) return VIEWPORTS.desktop;
  if (token in VIEWPORTS) return VIEWPORTS[token];
  const match = /^(\d+)x(\d+)$/.exec(token);
  if (match) return { width: Number(match[1]), height: Number(match[2]) };
  console.error(`unknown viewport "${token}"`);
  process.exit(2);
}

const [, , urlArg, outArg, viewportArg] = process.argv;
if (!urlArg || !outArg) {
  console.error("usage: capture-screenshot.mjs <url> <output-path> [viewport]");
  process.exit(2);
}

const outPath = resolve(outArg);
await mkdir(dirname(outPath), { recursive: true });

const viewport = resolveViewport(viewportArg);

const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport,
    colorScheme: "light",
  });
  const page = await context.newPage();
  // Use "load" rather than "networkidle" — when the page has long-lived
  // background fetches (e.g. Supabase auth cookie refreshes, analytics
  // beacons) networkidle never fires within the timeout. The DOM is
  // server-rendered anyway, so "load" captures the visible state.
  const response = await page.goto(urlArg, { waitUntil: "load", timeout: 30_000 });
  const status = response?.status() ?? -1;
  if (status !== 200) {
    console.error(`navigation returned HTTP ${status}`);
    process.exit(3);
  }
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`saved ${outPath} (${viewport.width}x${viewport.height})`);
} finally {
  await browser.close();
}
