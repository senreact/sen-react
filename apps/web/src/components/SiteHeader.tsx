import type { SiteHeaderGlobal } from "@sen-react/shared";
import Link from "next/link";

import { AuthNav } from "./AuthNav";
import { NavLink } from "./NavLink";

interface SiteHeaderProps {
  data: SiteHeaderGlobal;
}

export function SiteHeader({ data }: SiteHeaderProps) {
  const navItems = data.navItems ?? [];
  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex flex-col">
          <span className="text-base font-semibold leading-tight">{data.siteTitle}</span>
          {data.tagline ? (
            <span className="text-xs text-[color:var(--color-muted)]">{data.tagline}</span>
          ) : null}
        </Link>

        <div className="flex items-center gap-8">
          {navItems.length > 0 ? (
            <nav aria-label="Primary">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <NavLink
                      href={item.href}
                      external={item.external}
                      className="text-sm font-medium hover:text-[color:var(--color-accent)]"
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <AuthNav />
        </div>
      </div>
    </header>
  );
}
