import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * cms.ts contract tests — exercise the real failure modes that would
 * otherwise crash the Phase 3 surfaces:
 *
 * 1. CMS_URL unset (Phase 1/2 reality) → empty list, no fetch attempted
 * 2. CMS returns non-2xx → empty list, no throw
 * 3. CMS unreachable (network throws) → empty list, no throw
 * 4. CMS returns valid `docs` payload → list propagated
 *
 * The list helpers' contract: never throw, never bubble fetch errors —
 * the page must always render even when apps/cms is down.
 *
 * Note: cms.ts captures `NEXT_PUBLIC_CMS_URL` at module import time, so
 * each test resets the module registry and re-imports after configuring
 * the env. That isolation is why the spec uses dynamic `await import`.
 */

const ENV_KEY = "NEXT_PUBLIC_CMS_URL";
const FAKE_CMS = "https://cms.example.test";

describe("cms list fetchers", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env[ENV_KEY];
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    if (originalEnv === undefined) delete process.env[ENV_KEY];
    else process.env[ENV_KEY] = originalEnv;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("returns empty list when CMS_URL is unset (Phase 1/2)", async () => {
    delete process.env[ENV_KEY];
    vi.resetModules();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { listNews } = await import("./cms");
    expect(await listNews()).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns empty list when CMS returns non-2xx", async () => {
    process.env[ENV_KEY] = FAKE_CMS;
    vi.resetModules();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response("not found", { status: 503 }));
    const { listPublications } = await import("./cms");
    expect(await listPublications()).toEqual([]);
  });

  it("returns empty list when fetch throws (network unreachable)", async () => {
    process.env[ENV_KEY] = FAKE_CMS;
    vi.resetModules();
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("ECONNREFUSED"));
    const { listVideos } = await import("./cms");
    expect(await listVideos()).toEqual([]);
  });

  it("merges CMS site-header response with defaults so a freshly-seeded global keeps nav", async () => {
    process.env[ENV_KEY] = FAKE_CMS;
    vi.resetModules();
    // Payload returns navItems: [] for a never-touched array field — the
    // fetcher must treat that as "not set" so the default nav items
    // survive the wiring of NEXT_PUBLIC_CMS_URL.
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ siteTitle: "Sen React", navItems: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const { getSiteHeader } = await import("./cms");
    const header = await getSiteHeader();
    expect(header.siteTitle).toBe("Sen React");
    expect(header.navItems?.length ?? 0).toBeGreaterThanOrEqual(7);
    expect(header.navItems?.map((n) => n.href)).toContain("/actualites");
  });

  it("returns docs payload when CMS responds with valid JSON", async () => {
    process.env[ENV_KEY] = FAKE_CMS;
    vi.resetModules();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          docs: [
            {
              id: "1",
              title: "Premier article",
              slug: "premier",
              summary: "Test",
              sector: "digitalisation-technologie",
              writePath: "react-original",
              publishedAt: "2026-05-09T10:00:00Z",
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    const { listNews } = await import("./cms");
    const result = await listNews();
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Premier article");
  });
});
