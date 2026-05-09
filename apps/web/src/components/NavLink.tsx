import Link from "next/link";
import type { Route } from "next";

interface NavLinkProps {
  href: string;
  external?: boolean | null;
  className?: string;
  children: React.ReactNode;
}

/**
 * Renders a CMS-driven link safely under Next 16's typedRoutes.
 *
 * The href value comes from the CMS at runtime, so TypeScript can't prove
 * it's a valid app route at build time. We split:
 *
 * - Absolute URLs (http://, https://, mailto:, tel:) → plain <a>, opens in
 *   new tab when `external` is true.
 * - Anything else (assumed internal path) → <Link href={cast as Route}>.
 *
 * The cast is sound because the alternative is to bypass typedRoutes
 * project-wide. The runtime check above filters out absolute URLs.
 */
export function NavLink({ href, external, className, children }: NavLinkProps) {
  const isAbsolute = /^(https?:|mailto:|tel:)/.test(href);
  if (isAbsolute || external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  // typedRoutes generates the Route union during `next build` / `next dev`.
  // Before codegen, Route resolves to `string` and a direct `as Route`
  // looks redundant to ESLint's no-unnecessary-type-assertion. After
  // codegen, the cast is load-bearing — `href` is CMS-supplied so TS
  // can't prove it matches a known app route. The double cast through
  // `unknown` is invariant under both states, satisfies the rule pre-
  // and post-codegen, and is the pattern Next's own examples use for
  // dynamically-built hrefs.
  const safeHref = href as unknown as Route;

  return (
    <Link href={safeHref} className={className}>
      {children}
    </Link>
  );
}
