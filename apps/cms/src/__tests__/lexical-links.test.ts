import { describe, expect, it } from "vitest";

import { linkUrlError, normalizeLinkUrl } from "../lib/lexical-links";

/**
 * Link-URL hygiene for rich-text. Catches a real production failure: REACT
 * editors reported "it refuses to publish" because Payload's default link
 * validation rejects any URL with a space (incl. a pasted trailing space), and
 * the URL field's "https://" prefill produces "https://https://…" when a full
 * URL is pasted. These assertions lock in the normalisation + the clear French
 * messaging that replaced Payload's cryptic English error.
 */
describe("normalizeLinkUrl", () => {
  it("trims a trailing space (the common copy-paste cause of failed publishes)", () => {
    expect(normalizeLinkUrl("https://example.com/page ")).toBe("https://example.com/page");
  });

  it("trims leading whitespace", () => {
    expect(normalizeLinkUrl("  https://example.com")).toBe("https://example.com");
  });

  it("collapses a duplicated protocol from the https:// prefill", () => {
    expect(normalizeLinkUrl("https://https://example.com/page")).toBe("https://example.com/page");
  });

  it("collapses three stacked protocols down to one", () => {
    expect(normalizeLinkUrl("https://https://https://x.com")).toBe("https://x.com");
  });

  it("leaves a clean URL untouched", () => {
    expect(normalizeLinkUrl("https://react-sn.org")).toBe("https://react-sn.org");
  });

  it("does not strip a single protocol that is the real scheme", () => {
    expect(normalizeLinkUrl("https://example.com")).toBe("https://example.com");
  });
});

describe("linkUrlError", () => {
  it("returns null for a usable URL (publish proceeds)", () => {
    expect(linkUrlError("https://example.com/page")).toBeNull();
  });

  it("rejects an empty URL with a French message", () => {
    const msg = linkUrlError("");
    expect(msg).toMatch(/URL valide/i);
  });

  it('rejects a bare protocol ("https://") — a link with no real address', () => {
    expect(linkUrlError("https://")).toMatch(/URL valide/i);
  });

  it("rejects an inner space with a French message", () => {
    expect(linkUrlError("https://exa mple.com")).toMatch(/espace/i);
  });
});
