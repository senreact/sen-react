import type { JSX } from "react";

import type { LexicalNode, LexicalRoot } from "@/lib/cms";

/**
 * Minimal Lexical-to-JSX renderer.
 *
 * Payload's default lexical editor serialises body content as a tree of
 * nodes. We deliberately do **not** import `@payloadcms/richtext-lexical`
 * at runtime (it bundles a full editor stack we don't need on a read-only
 * surface). Instead this walker handles the editor's stock node set:
 *
 * - `paragraph` → <p>
 * - `heading` (h1-h4) → semantic <h*> with consistent typography classes
 * - `list` (bullet / number) → <ul>/<ol> with appropriate list-style
 * - `listitem` → <li>
 * - `quote` → <blockquote>
 * - `link` (autolink + manual) → <a> with rel/target as configured
 * - `text` with format bitmask → bold/italic/underline/strike/code spans
 * - `linebreak` → <br>
 *
 * Anything unrecognised falls through to its children — we never throw on
 * an unknown node so a future editor extension doesn't crash the page.
 *
 * The format field is Lexical's bitmask: 1=bold, 2=italic, 4=strike,
 * 8=underline, 16=code, 32=subscript, 64=superscript.
 */

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;
const FORMAT_STRIKETHROUGH = 4;
const FORMAT_UNDERLINE = 8;
const FORMAT_CODE = 16;

function renderText(node: LexicalNode, key: string): JSX.Element | string {
  const text = node.text ?? "";
  const format = typeof node.format === "number" ? node.format : 0;

  let content: JSX.Element | string = text;
  if (format & FORMAT_CODE) {
    content = (
      <code
        key={`${key}-code`}
        className="rounded bg-[color:var(--color-border)] px-1 py-0.5 text-sm"
      >
        {content}
      </code>
    );
  }
  if (format & FORMAT_STRIKETHROUGH) {
    content = <s key={`${key}-s`}>{content}</s>;
  }
  if (format & FORMAT_UNDERLINE) {
    content = <u key={`${key}-u`}>{content}</u>;
  }
  if (format & FORMAT_ITALIC) {
    content = <em key={`${key}-em`}>{content}</em>;
  }
  if (format & FORMAT_BOLD) {
    content = <strong key={`${key}-strong`}>{content}</strong>;
  }
  return content;
}

function renderChildren(nodes: LexicalNode[] | undefined, keyPrefix: string): React.ReactNode[] {
  if (!nodes) return [];
  return nodes.map((child, i) => renderNode(child, `${keyPrefix}-${i}`));
}

function renderNode(node: LexicalNode, key: string): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="mb-4 leading-relaxed">
          {renderChildren(node.children, key)}
        </p>
      );

    case "heading": {
      const tag = (node.tag ?? "h2") as "h1" | "h2" | "h3" | "h4";
      const sizeClass: Record<typeof tag, string> = {
        h1: "mt-10 mb-4 text-3xl font-bold leading-tight",
        h2: "mt-8 mb-4 text-2xl font-bold leading-tight",
        h3: "mt-6 mb-3 text-xl font-semibold leading-tight",
        h4: "mt-5 mb-2 text-lg font-semibold leading-tight",
      };
      const Tag = tag;
      return (
        <Tag key={key} className={sizeClass[tag]}>
          {renderChildren(node.children, key)}
        </Tag>
      );
    }

    case "list": {
      const Tag = node.listType === "number" ? "ol" : "ul";
      const listClass =
        node.listType === "number"
          ? "mb-4 ml-6 list-decimal space-y-1"
          : "mb-4 ml-6 list-disc space-y-1";
      return (
        <Tag key={key} className={listClass}>
          {renderChildren(node.children, key)}
        </Tag>
      );
    }

    case "listitem":
      return <li key={key}>{renderChildren(node.children, key)}</li>;

    case "quote":
      return (
        <blockquote
          key={key}
          className="mb-4 border-l-4 border-[color:var(--color-accent)] bg-white px-4 py-2 italic text-[color:var(--color-muted)]"
        >
          {renderChildren(node.children, key)}
        </blockquote>
      );

    case "link":
    case "autolink": {
      const href = node.fields?.url ?? node.url ?? "#";
      const target = node.fields?.newTab ? "_blank" : undefined;
      const rel = target === "_blank" ? "noopener noreferrer" : undefined;
      return (
        <a
          key={key}
          href={href}
          target={target}
          rel={rel}
          className="text-[color:var(--color-accent)] underline hover:opacity-80"
        >
          {renderChildren(node.children, key)}
        </a>
      );
    }

    case "linebreak":
      return <br key={key} />;

    case "text":
      return renderText(node, key);

    default:
      // Unknown node — render children if any so future editor extensions
      // degrade gracefully instead of dropping content.
      return <span key={key}>{renderChildren(node.children, key)}</span>;
  }
}

interface LexicalRichTextProps {
  content: LexicalRoot | null | undefined;
}

export function LexicalRichText({ content }: LexicalRichTextProps) {
  if (!content?.root?.children) return null;
  return (
    <div className="text-base text-[color:var(--color-foreground)]">
      {renderChildren(content.root.children, "ln")}
    </div>
  );
}
