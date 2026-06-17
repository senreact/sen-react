/**
 * Google Docs HTML export → Payload Lexical converter.
 *
 * Google's `…/export?format=html` produces a flat list of `<p class="cN">`
 * wrappers around `<span class="cM">` runs — there are NO semantic <h1>/<ul>
 * tags. Styling (bold, font-size) lives in a `<style>` block keyed by those
 * class names. Images are inline base64 data-URIs inside `<span><img></span>`.
 *
 * This converter:
 *  - parses the class→style map so we can recover bold/italic + heading level
 *    (headings are just larger-point bold lines: body is 11-12pt, headings
 *    >= 13.5pt),
 *  - walks paragraphs in document order, dropping empty spacer paragraphs,
 *  - extracts every base64 image with its pixel dimensions, drops sub-150px
 *    logos/icons, designates the largest remaining image as the hero
 *    (rendered as the publication `coverImage`, so it is omitted from the
 *    inline body to avoid duplication), and keeps the rest inline.
 *
 * The body is returned in two parts: the extracted `images` (so the caller can
 * upload them to Media first) and a `toLexical(mediaIdByIndex)` builder that
 * stitches the real Media IDs into Lexical `upload` nodes.
 *
 * Verified against the 6 REACT publication docs (2026-06-08); no <a>/<ul>/<ol>
 * in any of them, so link/list handling is intentionally omitted.
 */

import { parse, type HTMLElement, type Node } from "node-html-parser";

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;

const HEADING_H2_PT = 15.5;
const HEADING_H3_PT = 13.5;
const MIN_CONTENT_IMAGE_PX = 150;

interface ClassStyle {
  bold: boolean;
  italic: boolean;
  sizePt: number;
}

export type ImageRole = "hero" | "inline" | "dropped";

export interface ExtractedImage {
  index: number;
  buffer: Buffer;
  mime: string;
  ext: string;
  width: number;
  height: number;
  role: ImageRole;
}

interface TextRun {
  text: string;
  format: number;
}

type Block =
  | { kind: "text"; tag: "paragraph" | "h2" | "h3"; runs: TextRun[] }
  | { kind: "image"; index: number };

export interface ConvertedDoc {
  images: ExtractedImage[];
  /** Build the Lexical root, given a map of image index → uploaded Media id. */
  toLexical: (mediaIdByIndex: Map<number, number>) => Record<string, unknown>;
}

/** Parse the `<style>` block into a class-name → style map. */
function parseClassStyles(html: string): Map<string, ClassStyle> {
  const map = new Map<string, ClassStyle>();
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleMatch) return map;
  const css = styleMatch[1] ?? "";
  const ruleRe = /\.(c\d+)\s*\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = ruleRe.exec(css)) !== null) {
    const cls = m[1];
    const decl = m[2] ?? "";
    if (!cls) continue;
    const weight = /font-weight\s*:\s*(\d+)/.exec(decl)?.[1];
    const sizePt = /font-size\s*:\s*([\d.]+)pt/.exec(decl)?.[1];
    const style = /font-style\s*:\s*([a-z]+)/.exec(decl)?.[1];
    map.set(cls, {
      bold: weight ? Number(weight) >= 600 : false,
      italic: style === "italic",
      sizePt: sizePt ? Number(sizePt) : 0,
    });
  }
  return map;
}

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  laquo: "«",
  raquo: "»",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  eacute: "é",
  egrave: "è",
  ecirc: "ê",
  euml: "ë",
  agrave: "à",
  acirc: "â",
  auml: "ä",
  ccedil: "ç",
  ocirc: "ô",
  ouml: "ö",
  ograve: "ò",
  icirc: "î",
  iuml: "ï",
  igrave: "ì",
  ucirc: "û",
  ugrave: "ù",
  uuml: "ü",
  ntilde: "ñ",
  oelig: "œ",
  aelig: "æ",
  Eacute: "É",
  Egrave: "È",
  Ecirc: "Ê",
  Agrave: "À",
  Ccedil: "Ç",
  ordf: "ª",
  deg: "°",
  euro: "€",
  copy: "©",
  reg: "®",
  trade: "™",
};

function decodeEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-zA-Z]+);/g, (whole, name: string) => NAMED_ENTITIES[name] ?? whole);
}

/** Collapse the repeated &nbsp;/whitespace Google emits while keeping single spaces. */
function normaliseWhitespace(text: string): string {
  return text.replace(/\u00A0/g, " ").replace(/[ \t]+/g, " ");
}

function pxFromStyle(style: string | undefined, prop: "width" | "height"): number {
  if (!style) return 0;
  const m = new RegExp(`${prop}\\s*:\\s*([\\d.]+)px`).exec(style);
  return m?.[1] ? Math.round(Number(m[1])) : 0;
}

function mimeFromDataUri(src: string): { mime: string; ext: string; base64: string } | null {
  const m = /^data:(image\/([a-zA-Z0-9.+-]+));base64,(.+)$/.exec(src);
  if (!m || !m[1] || !m[2] || !m[3]) return null;
  const mime = m[1];
  let ext = m[2].toLowerCase();
  if (ext === "jpeg") ext = "jpg";
  if (ext === "svg+xml") ext = "svg";
  return { mime, ext, base64: m[3] };
}

function isElement(node: Node): node is HTMLElement {
  return (node as HTMLElement).tagName !== undefined && (node as HTMLElement).tagName !== null;
}

export function convertGoogleDocHtml(html: string): ConvertedDoc {
  const classStyles = parseClassStyles(html);
  const root = parse(html, { blockTextElements: { script: false, style: false } });
  const body = root.querySelector("body") ?? root;

  const images: ExtractedImage[] = [];
  const blocks: Block[] = [];

  const styleFor = (el: HTMLElement): ClassStyle => {
    let best: ClassStyle = { bold: false, italic: false, sizePt: 0 };
    for (const cls of el.classNames.split(/\s+/).filter(Boolean)) {
      const s = classStyles.get(cls);
      if (s) {
        best = {
          bold: best.bold || s.bold,
          italic: best.italic || s.italic,
          sizePt: Math.max(best.sizePt, s.sizePt),
        };
      }
    }
    return best;
  };

  // Each top-level paragraph (Google wraps every line, incl. images, in <p>).
  const paragraphs = body.querySelectorAll("p");
  for (const p of paragraphs) {
    const imgEls = p.querySelectorAll("img");
    if (imgEls.length > 0) {
      for (const img of imgEls) {
        const src = img.getAttribute("src") ?? "";
        const decoded = mimeFromDataUri(src);
        if (!decoded) continue;
        const wrapStyle =
          img.parentNode && isElement(img.parentNode)
            ? img.parentNode.getAttribute("style")
            : undefined;
        const width =
          pxFromStyle(img.getAttribute("style"), "width") || pxFromStyle(wrapStyle, "width");
        const height =
          pxFromStyle(img.getAttribute("style"), "height") || pxFromStyle(wrapStyle, "height");
        const index = images.length;
        images.push({
          index,
          buffer: Buffer.from(decoded.base64, "base64"),
          mime: decoded.mime,
          ext: decoded.ext,
          width,
          height,
          role: "inline", // provisional; resolved below
        });
        blocks.push({ kind: "image", index });
      }
      continue;
    }

    // Text paragraph: collect runs from spans, else from the paragraph text.
    const runs: TextRun[] = [];
    let maxPt = 0;
    let anyBold = false;
    let anyText = false;
    const spans = p.querySelectorAll("span");
    const sources: HTMLElement[] = spans.length > 0 ? spans : [p];
    for (const span of sources) {
      const raw = normaliseWhitespace(decodeEntities(span.rawText ?? ""));
      if (!raw.trim()) continue;
      anyText = true;
      const s = styleFor(span);
      maxPt = Math.max(maxPt, s.sizePt);
      if (s.bold) anyBold = true;
      runs.push({ text: raw, format: (s.bold ? FORMAT_BOLD : 0) | (s.italic ? FORMAT_ITALIC : 0) });
    }
    if (!anyText) continue; // empty spacer paragraph

    // Merge adjacent runs sharing a format to keep the tree tidy.
    const merged: TextRun[] = [];
    for (const run of runs) {
      const last = merged[merged.length - 1];
      if (last && last.format === run.format) last.text += run.text;
      else merged.push({ ...run });
    }
    // Trim leading/trailing whitespace across the paragraph.
    const firstRun = merged[0];
    const lastRun = merged[merged.length - 1];
    if (firstRun) firstRun.text = firstRun.text.replace(/^\s+/, "");
    if (lastRun) lastRun.text = lastRun.text.replace(/\s+$/, "");
    const joined = merged.map((r) => r.text).join("");
    if (!joined.trim()) continue;

    let tag: "paragraph" | "h2" | "h3" = "paragraph";
    if (anyBold && maxPt >= HEADING_H2_PT) tag = "h2";
    else if (anyBold && maxPt >= HEADING_H3_PT) tag = "h3";
    blocks.push({ kind: "text", tag, runs: merged });
  }

  // Resolve image roles: drop sub-150px logos, largest remaining = hero.
  let heroIndex = -1;
  let heroArea = 0;
  for (const img of images) {
    if (img.width > 0 && img.width < MIN_CONTENT_IMAGE_PX) {
      img.role = "dropped";
      continue;
    }
    const area = (img.width || 1) * (img.height || 1);
    if (area > heroArea) {
      heroArea = area;
      heroIndex = img.index;
    }
  }
  for (const img of images) {
    if (img.role === "dropped") continue;
    img.role = img.index === heroIndex ? "hero" : "inline";
  }

  const toLexical = (mediaIdByIndex: Map<number, number>): Record<string, unknown> => {
    const children: Record<string, unknown>[] = [];
    let uid = 0;
    for (const block of blocks) {
      if (block.kind === "image") {
        const img = images[block.index];
        if (!img || img.role !== "inline") continue; // hero shown via coverImage; logos dropped
        const mediaId = mediaIdByIndex.get(block.index);
        if (mediaId == null) continue;
        children.push({
          type: "upload",
          version: 3,
          relationTo: "media",
          value: mediaId,
          fields: {},
          format: "",
          id: `pubimg_${block.index}_${uid++}`,
        });
        continue;
      }
      const textChildren = block.runs.map((r) => ({
        type: "text",
        version: 1,
        text: r.text,
        format: r.format,
        style: "",
        mode: "normal" as const,
        detail: 0,
      }));
      if (block.tag === "paragraph") {
        children.push({
          type: "paragraph",
          version: 1,
          children: textChildren,
          direction: "ltr",
          format: "",
          indent: 0,
          textFormat: 0,
          textStyle: "",
        });
      } else {
        children.push({
          type: "heading",
          tag: block.tag,
          version: 1,
          children: textChildren,
          direction: "ltr",
          format: "",
          indent: 0,
        });
      }
    }
    return {
      root: {
        type: "root",
        version: 1,
        children,
        direction: "ltr",
        format: "",
        indent: 0,
      },
    };
  };

  return { images, toLexical };
}
