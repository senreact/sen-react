import type { SiteHeaderGlobal } from "@sen-react/shared";
import Link from "next/link";

import { AuthNav } from "./AuthNav";
import { NavLink } from "./NavLink";
import { SiteLogo } from "./SiteLogo";

interface SiteHeaderProps {
  data: SiteHeaderGlobal;
}

export function SiteHeader({ data }: SiteHeaderProps) {
  const navItems = data.navItems ?? [];
  return (
    <header className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <SiteLogo height={40} decorative />
          <span className="flex flex-col">
            <span className="whitespace-nowrap text-base font-semibold leading-tight">
              {data.siteTitle}
            </span>
            {data.tagline ? (
              <span className="hidden text-xs text-[color:var(--color-muted)] sm:block">
                {data.tagline}
              </span>
            ) : null}
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {navItems.length > 0 ? (
            <nav aria-label="Primary">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {navItems.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <NavLink
                      href={item.href}
                      external={item.external}
                      className="whitespace-nowrap text-sm font-medium hover:text-[color:var(--color-accent)]"
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
