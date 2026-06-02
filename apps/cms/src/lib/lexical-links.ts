import { ValidationError } from "payload";
import type { CollectionBeforeValidateHook, GlobalBeforeValidateHook } from "payload";

/**
 * Link-URL hygiene for Lexical rich text.
 *
 * Payload's default link feature validates URLs with `validateUrlMinimal`,
 * which rejects ANY url containing a space — including an invisible
 * leading/trailing space pasted with a link. That blocks the whole publish
 * with a cryptic English "The following fields are invalid: url" on the body
 * field (REACT editors experienced this as "it refuses to publish").
 *
 * On top of that, the link drawer's URL field is pre-filled with "https://",
 * so pasting a full URL produces "https://https://example.com".
 *
 * `normalizeLinkUrl` fixes both mechanically; `normalizeRichTextLinks` is a
 * beforeValidate hook that normalises every link URL in a document's rich-text
 * fields and raises a clear FRENCH error for genuinely-unusable URLs.
 */

// Collapse a duplicated leading protocol: "https://https://x" -> "https://x".
const DUPLICATE_PROTOCOL = /^(?:https?:\/\/)+(https?:\/\/)/i;
// A bare protocol with nothing after it ("https://") is not a usable URL.
const BARE_PROTOCOL = /^https?:\/\/$/i;

export function normalizeLinkUrl(url: string): string {
  return url.trim().replace(DUPLICATE_PROTOCOL, "$1");
}

/** Returns a French error message if the (already-normalised) URL is unusable, else null. */
export function linkUrlError(url: string): string | null {
  if (!url || BARE_PROTOCOL.test(url)) {
    return "Un lien n'a pas d'URL valide. Saisissez une adresse complète (par ex. https://exemple.com) ou supprimez le lien.";
  }
  if (/\s/.test(url)) {
    return "L'URL d'un lien contient un espace. Retirez l'espace (souvent collé par erreur avant ou après l'adresse).";
  }
  return null;
}

function isLexicalValue(value: unknown): value is { root?: { children?: unknown[] } } {
  return (
    typeof value === "object" &&
    value !== null &&
    "root" in value &&
    typeof (value as { root?: unknown }).root === "object"
  );
}

type LinkFields = { linkType?: unknown; url?: unknown };

/** Walk every node of a Lexical tree, applying `visit` to each custom-URL link node's fields. */
function visitLinkNodes(node: unknown, visit: (fields: LinkFields) => void): void {
  if (typeof node !== "object" || node === null) return;
  const n = node as { type?: unknown; fields?: unknown; children?: unknown; root?: unknown };
  if (
    (n.type === "link" || n.type === "autolink") &&
    typeof n.fields === "object" &&
    n.fields !== null
  ) {
    const fields = n.fields as LinkFields;
    // Internal (document) links have no url to normalise.
    if (fields.linkType !== "internal") visit(fields);
  }
  if (Array.isArray(n.children)) for (const child of n.children) visitLinkNodes(child, visit);
  if (n.root) visitLinkNodes(n.root, visit);
}

/**
 * Recursively find every Lexical rich-text value anywhere in `data` (top-level,
 * inside groups, arrays, blocks…), normalise its link URLs in place, and collect
 * French validation errors keyed by the field's dotted path.
 */
function processRichText(
  value: unknown,
  path: string,
  errors: { path: string; message: string }[],
): void {
  if (typeof value !== "object" || value === null) return;

  if (isLexicalValue(value)) {
    const seen = new Set<string>();
    visitLinkNodes(value, (fields) => {
      if (typeof fields.url !== "string") return;
      const normalized = normalizeLinkUrl(fields.url);
      fields.url = normalized;
      const error = linkUrlError(normalized);
      if (error && !seen.has(error)) {
        seen.add(error);
        errors.push({ path, message: error });
      }
    });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => processRichText(item, `${path}.${i}`, errors));
    return;
  }

  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    processRichText(child, path ? `${path}.${key}` : key, errors);
  }
}

function normalizeAndValidate(data: unknown): void {
  if (typeof data !== "object" || data === null) return;
  const errors: { path: string; message: string }[] = [];
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    processRichText(value, key, errors);
  }
  // Normalisation (trim + de-duplicate protocol) always runs, in place — so the
  // common case (a pasted leading/trailing space) is silently fixed and never
  // blocks anyone. We only raise for URLs that can't be salvaged (empty, bare
  // protocol, or an inner space): the default link validation blocks those
  // regardless, so surfacing our clear French message is strictly better than
  // Payload's cryptic English — on drafts and on publish alike.
  if (errors.length) throw new ValidationError({ errors });
}

export const normalizeRichTextLinks: CollectionBeforeValidateHook = ({ data }) => {
  normalizeAndValidate(data);
  return data;
};

export const normalizeRichTextLinksGlobal: GlobalBeforeValidateHook = ({ data }) => {
  normalizeAndValidate(data);
  // Payload types a global hook's `data` as `any`; it's already mutated in place.
  return data as Record<string, unknown>;
};
