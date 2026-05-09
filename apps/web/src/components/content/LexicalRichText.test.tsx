import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { LexicalRoot } from "@/lib/cms";

import { LexicalRichText } from "./LexicalRichText";

/**
 * LexicalRichText is the only thing that stands between an article body
 * and a blank page. The walker has to render the editor's stock node
 * set without crashing on unknown nodes — these tests pin that contract.
 *
 * Uses createElement directly rather than JSX to avoid pulling a JSX
 * transform into the unit-test config — the production component itself
 * uses JSX and is exercised through the renderer here.
 */

function htmlOf(content: LexicalRoot | null): string {
  return renderToStaticMarkup(createElement(LexicalRichText, { content }));
}

describe("LexicalRichText", () => {
  it("renders nothing for null content", () => {
    expect(htmlOf(null)).toBe("");
  });

  it("renders paragraphs", () => {
    const html = htmlOf({
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Bonjour Sénégal." }],
          },
        ],
      },
    });
    expect(html).toContain("<p");
    expect(html).toContain("Bonjour Sénégal.");
  });

  it("renders headings with the right tag", () => {
    const html = htmlOf({
      root: {
        type: "root",
        children: [
          { type: "heading", tag: "h2", children: [{ type: "text", text: "Section" }] },
          { type: "heading", tag: "h3", children: [{ type: "text", text: "Sous-section" }] },
        ],
      },
    });
    expect(html).toContain("<h2");
    expect(html).toContain("Section</h2>");
    expect(html).toContain("<h3");
    expect(html).toContain("Sous-section</h3>");
  });

  it("renders ordered + unordered lists", () => {
    const html = htmlOf({
      root: {
        type: "root",
        children: [
          {
            type: "list",
            listType: "bullet",
            children: [{ type: "listitem", children: [{ type: "text", text: "Un" }] }],
          },
          {
            type: "list",
            listType: "number",
            children: [{ type: "listitem", children: [{ type: "text", text: "Deux" }] }],
          },
        ],
      },
    });
    expect(html).toContain("<ul");
    expect(html).toContain("<ol");
    expect(html).toContain("Un</li>");
    expect(html).toContain("Deux</li>");
  });

  it("applies bold + italic format bitmask to text nodes", () => {
    const html = htmlOf({
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", text: "gras", format: 1 },
              { type: "text", text: " italique", format: 2 },
              { type: "text", text: " gras italique", format: 3 },
            ],
          },
        ],
      },
    });
    expect(html).toContain("<strong>gras</strong>");
    expect(html).toContain("<em> italique</em>");
    expect(html).toContain("<strong><em> gras italique</em></strong>");
  });

  it("renders a link with target=_blank when newTab is set", () => {
    const html = htmlOf({
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                fields: { url: "https://example.org", newTab: true },
                children: [{ type: "text", text: "lire la suite" }],
              },
            ],
          },
        ],
      },
    });
    expect(html).toContain('href="https://example.org"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("does not crash on an unknown node type — children fall through", () => {
    const html = htmlOf({
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "future-extension",
                children: [{ type: "text", text: "fallback" }],
              },
            ],
          },
        ],
      },
    });
    expect(html).toContain("fallback");
  });
});
