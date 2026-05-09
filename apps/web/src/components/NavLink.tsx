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
  return (
    <Link href={href as Route} className={className}>
      {children}
    </Link>
  );
}
