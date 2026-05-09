import type { SiteFooterGlobal, SocialPlatform } from "@sen-react/shared";

import { NavLink } from "./NavLink";

interface SiteFooterProps {
  data: SiteFooterGlobal;
}

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  x: "X",
  tiktok: "TikTok",
};

export function SiteFooter({ data }: SiteFooterProps) {
  const legalNavItems = data.legalNavItems ?? [];
  const socialLinks = data.socialLinks ?? [];

  return (
    <footer className="mt-16 border-t border-slate-200">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold">{data.copyrightText}</p>
          {data.description ? (
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">{data.description}</p>
          ) : null}
        </div>

        <div>
          {data.contactEmail ? (
            <p className="text-sm">
              <a
                href={`mailto:${data.contactEmail}`}
                className="hover:text-[color:var(--color-accent)]"
              >
                {data.contactEmail}
              </a>
            </p>
          ) : null}
          {data.contactAddress ? (
            <p className="mt-2 whitespace-pre-line text-sm text-[color:var(--color-muted)]">
              {data.contactAddress}
            </p>
          ) : null}
        </div>

        <div className="space-y-4">
          {legalNavItems.length > 0 ? (
            <nav aria-label="Legal">
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {legalNavItems.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <NavLink
                      href={item.href}
                      className="text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)]"
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {socialLinks.length > 0 ? (
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    external
                    className="text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)]"
                  >
                    {PLATFORM_LABELS[link.platform]}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
