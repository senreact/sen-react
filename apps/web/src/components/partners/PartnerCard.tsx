import type { Partner } from "@/data/partners";

interface PartnerCardProps {
  partner: Partner;
}

/**
 * Logo placeholder — initials in a green circle, mirroring the Team
 * page treatment. Swap for <Image> once real logos land per
 * docs/pending-react-input.md; the card layout stays identical.
 */
function initialsOf(name: string): string {
  const stripped = name
    .replace(/Ministère.*/i, "MCN") // long ministerial names get a fixed mark
    .replace(/[^A-Za-zÀ-ÿ ]/g, "")
    .trim();
  if (stripped.length <= 4) return stripped.toUpperCase();
  return stripped
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .filter(Boolean)
    .slice(0, 3)
    .join("")
    .toUpperCase();
}

export function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <li className="flex items-start gap-4 rounded-lg border border-[color:var(--color-border)] p-5">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-sm font-semibold text-white"
      >
        {initialsOf(partner.name)}
      </span>
      <div>
        <p className="text-base font-semibold leading-tight">{partner.name}</p>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">{partner.description}</p>
      </div>
    </li>
  );
}
