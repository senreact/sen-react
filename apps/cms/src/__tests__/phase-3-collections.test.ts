import type { Field } from "payload";
import { describe, expect, it } from "vitest";

import { SECTORS } from "@sen-react/shared";

import { News } from "../collections/News";
import { Publications } from "../collections/Publications";
import { Videos } from "../collections/Videos";

/**
 * Phase 3 collection-contract tests.
 *
 * What real failure does each catch?
 *
 * - Slug regression: Payload uses the slug for REST + GraphQL paths. A
 *   silent refactor that renames it would break apps/web's fetcher
 *   without any TS error.
 * - Required-field drop: removing a required field would let editors
 *   ship empty articles to production.
 * - Sector-list drift: sector options must derive from D012 SECTORS;
 *   if a future PR hardcodes sectors here it'll silently diverge.
 * - YouTube ID validation: the per-video regex (11 chars, alnum + _-)
 *   is the only thing preventing pasted-URL-instead-of-ID mistakes.
 */

function fieldByName(fields: Field[], name: string): Field | undefined {
  return fields.find((f): f is Field & { name: string } => "name" in f && f.name === name);
}

function isRequired(field: Field | undefined): boolean {
  return Boolean(field && "required" in field && field.required === true);
}

describe("News collection", () => {
  it('has slug "news" — drives /api/news REST + sitemap routes', () => {
    expect(News.slug).toBe("news");
  });

  it("has draft autosave enabled (editors lose work without this)", () => {
    expect(News.versions).toMatchObject({ drafts: { autosave: { interval: 2000 } } });
  });

  it("has all required fields (title, slug, summary, body, sector, writePath, publishedAt)", () => {
    const required = ["title", "slug", "summary", "body", "sector", "writePath", "publishedAt"];
    for (const name of required) {
      expect(
        isRequired(fieldByName(News.fields ?? [], name)),
        `News.${name} must be required`,
      ).toBe(true);
    }
  });

  it("sector options match D012 SECTORS (in count and in slugs)", () => {
    const sectorField = fieldByName(News.fields ?? [], "sector");
    expect(sectorField?.type).toBe("select");
    const opts = (sectorField as { options?: { value: string }[] }).options ?? [];
    expect(opts).toHaveLength(SECTORS.length);
    const slugs = opts.map((o) => o.value).sort();
    const expected = SECTORS.map((s) => s.slug).sort();
    expect(slugs).toEqual(expected);
  });

  it("writePath is required and limited to react-original | aggregated", () => {
    const wp = fieldByName(News.fields ?? [], "writePath");
    expect(wp?.type).toBe("select");
    const opts = (wp as { options?: { value: string }[] }).options ?? [];
    expect(opts.map((o) => o.value).sort()).toEqual(["aggregated", "react-original"]);
  });
});

describe("Publications collection", () => {
  it('has slug "publications"', () => {
    expect(Publications.slug).toBe("publications");
  });

  it("public read access ({_status: published}) — D020 says fully open", () => {
    // Read access uses a function, but we can at least confirm it exists.
    expect(typeof Publications.access?.read).toBe("function");
  });

  it("has an OPTIONAL PDF file field (web-native: an entry can be body-only)", () => {
    const file = fieldByName(Publications.fields ?? [], "file");
    expect(file?.type).toBe("upload");
    // Publications are web-native — body OR a downloadable PDF, so file is optional.
    expect(isRequired(file)).toBe(false);
    expect((file as { relationTo?: string }).relationTo).toBe("media");
  });

  it("sector is OPTIONAL on publications (cross-cutting publications exist)", () => {
    const sector = fieldByName(Publications.fields ?? [], "sector");
    expect(sector).toBeDefined();
    expect(isRequired(sector)).toBe(false);
  });

  it("supports authors as an array (multi-author works are common)", () => {
    const authors = fieldByName(Publications.fields ?? [], "authors");
    expect(authors?.type).toBe("array");
  });
});

describe("Videos collection", () => {
  it('has slug "videos"', () => {
    expect(Videos.slug).toBe("videos");
  });

  it("has required YouTube ID field (the embed source of truth)", () => {
    const yt = fieldByName(Videos.fields ?? [], "youtubeId");
    expect(yt?.type).toBe("text");
    expect(isRequired(yt)).toBe(true);
  });

  it("has both FR and Wolof subtitle slots per A4", () => {
    const fr = fieldByName(Videos.fields ?? [], "subtitlesFr");
    const wo = fieldByName(Videos.fields ?? [], "subtitlesWo");
    expect(fr?.type).toBe("upload");
    expect(wo?.type).toBe("upload");
  });

  it("has download URL field (D016 row 10 — offline-friendly mandate)", () => {
    const dl = fieldByName(Videos.fields ?? [], "downloadUrl");
    expect(dl?.type).toBe("text");
  });

  it("video type covers all A4 categories (capsule, explanation, interview, vlog, testimonial)", () => {
    const type = fieldByName(Videos.fields ?? [], "videoType");
    const opts = (type as { options?: { value: string }[] }).options ?? [];
    const values = opts.map((o) => o.value).sort();
    expect(values).toEqual(["capsule", "explanation", "interview", "testimonial", "vlog"]);
  });

  it("YouTube ID validator accepts a full URL or an 11-char ID, rejects junk", () => {
    const yt = fieldByName(Videos.fields ?? [], "youtubeId") as {
      validate?: (value: string | null | undefined) => true | string;
    };
    expect(typeof yt.validate).toBe("function");
    if (!yt.validate) return;
    expect(yt.validate("dQw4w9WgXcQ")).toBe(true);
    // Editors paste the full share URL — accepted (normalised to the ID on save).
    expect(yt.validate("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
    expect(yt.validate("https://youtu.be/dQw4w9WgXcQ")).toBe(true);
    expect(typeof yt.validate("short")).toBe("string");
    expect(typeof yt.validate(null)).toBe("string");
  });
});
