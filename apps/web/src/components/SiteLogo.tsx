import Image from "next/image";

import logoReact from "../../public/logo-react.jpg";

interface SiteLogoProps {
  /** Visual size — determines rendered height in pixels (width preserves the 1.82:1 aspect ratio). */
  height?: number;
  /**
   * Decorative-vs-meaningful flag. The header pairs the logo with the
   * "Sen React" wordmark text, so the logo is decorative there
   * (alt="" + role=presentation). On standalone use (e.g. a favicon
   * fallback) leave decorative=false to expose the alt text.
   */
  decorative?: boolean;
}

export function SiteLogo({ height = 40, decorative = false }: SiteLogoProps) {
  // Native aspect ratio of the source: 1600 × 878 ≈ 1.822
  const width = Math.round(height * (1600 / 878));
  return (
    <Image
      src={logoReact}
      alt={decorative ? "" : "REACT — Réseau des Entrepreneurs Actifs"}
      width={width}
      height={height}
      priority
      {...(decorative ? { role: "presentation" } : null)}
    />
  );
}
