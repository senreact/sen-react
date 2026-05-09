import type { ReactNode } from "react";

interface ContactChannelProps {
  /** Eyebrow above the value, e.g. "WhatsApp". */
  label: string;
  /** Primary value to display (phone number, email, etc.). */
  value: string;
  /** Optional hint shown beneath the value (e.g. "Canal principal"). */
  hint?: string;
  /** href + button label if the channel is actionable; render as plain text otherwise. */
  href?: string;
  ctaLabel?: string;
  /** Optional structured-content block (e.g. multi-line address). Replaces `value` if provided. */
  children?: ReactNode;
}

export function ContactChannel({
  label,
  value,
  hint,
  href,
  ctaLabel,
  children,
}: ContactChannelProps) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border)] p-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
        {label}
      </p>
      {children ? (
        <div className="text-base font-semibold leading-snug">{children}</div>
      ) : (
        <p className="text-base font-semibold leading-snug">{value}</p>
      )}
      {hint ? <p className="mt-2 text-xs text-[color:var(--color-muted)]">{hint}</p> : null}
      {href && ctaLabel ? (
        <a
          href={href}
          className="mt-4 inline-block text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : null)}
        >
          {ctaLabel} →
        </a>
      ) : null}
    </div>
  );
}
