import Link from "next/link";
import type { Route } from "next";

interface SectorCardProps {
  slug: string;
  title: string;
  scope: string;
}

/**
 * Sector card used on the /secteurs index. Links to /secteurs/[slug]
 * via a runtime-cast Route — same pattern as NavLink, since typedRoutes
 * doesn't enumerate dynamic segments at build-time.
 */
export function SectorCard({ slug, title, scope }: SectorCardProps) {
  const href = `/secteurs/${slug}` as unknown as Route;
  return (
    <Link
      href={href}
      className="block rounded-lg border border-[color:var(--color-border)] p-6 transition-colors hover:border-[color:var(--color-accent)]"
    >
      <h3 className="mb-2 text-lg font-semibold leading-tight">{title}</h3>
      <p className="text-sm text-[color:var(--color-muted)]">{scope}</p>
      <span className="mt-4 inline-block text-sm font-semibold text-[color:var(--color-accent)]">
        Découvrir →
      </span>
    </Link>
  );
}
