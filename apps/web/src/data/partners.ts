/**
 * Partner inventory — D011 (Amadou response, 2026-05-04).
 *
 * 10 partners total: 3 institutions + 7 société civile / ONG.
 *
 * Logos pending REACT-side per docs/pending-react-input.md. Names + types
 * are facts; descriptions are CONSERVATIVE one-liners that describe the
 * category only, never fabricated specifics — when Amadou confirms each
 * partner's role we update `description` per row with sign-off.
 *
 * Order within each group is the order Amadou listed them. Don't sort
 * alphabetically without his sign-off — order can carry editorial
 * weight.
 */

export type PartnerKind = "institution" | "ngo";

export interface Partner {
  /** Stable slug for keys / future detail pages. */
  slug: string;
  /** Display name as Amadou wrote it. */
  name: string;
  /** Institution = government/state agency · NGO = société civile. */
  kind: PartnerKind;
  /** One-line FR description. Conservative — describes category, never invents specifics. */
  description: string;
}

export const PARTNERS: Partner[] = [
  {
    slug: "adepme",
    name: "ADEPME",
    kind: "institution",
    description: "Agence sénégalaise dédiée au développement et à l'encadrement des PME.",
  },
  {
    slug: "ancar",
    name: "ANCAR",
    kind: "institution",
    description: "Agence Nationale de Conseil Agricole et Rural.",
  },
  {
    slug: "ministere-communication-numerique",
    name: "Ministère de la Communication et du Numérique",
    kind: "institution",
    description: "Tutelle institutionnelle de la transformation numérique au Sénégal.",
  },
  {
    slug: "civic-hive",
    name: "CIVIC HIVE",
    kind: "ngo",
    description: "Partenaire de la société civile sur les enjeux de gouvernance et de civic-tech.",
  },
  {
    slug: "african-youth-commission",
    name: "African Youth Commission",
    kind: "ngo",
    description: "Coalition panafricaine pour la jeunesse, alliée du réseau REACT.",
  },
  {
    slug: "ibp",
    name: "IBP",
    kind: "ngo",
    description: "Partenaire de société civile sur les enjeux budgétaires et de transparence.",
  },
  {
    slug: "enda-ecopop",
    name: "Enda ECOPOP",
    kind: "ngo",
    description: "ONG sénégalaise du réseau Enda, partenaire de longue date sur les enjeux locaux.",
  },
  {
    slug: "cjs",
    name: "CJS",
    kind: "ngo",
    description: "Organisation de jeunesse partenaire sur les programmes d'autonomisation.",
  },
  {
    slug: "afikanite",
    name: "AFIKANITE",
    kind: "ngo",
    description: "Partenaire panafricain accompagnant l'écosystème entrepreneurial du continent.",
  },
  {
    slug: "gpf",
    name: "GPF",
    kind: "ngo",
    description: "Organisation partenaire de société civile, alignée sur les valeurs de REACT.",
  },
];

export const INSTITUTIONS = PARTNERS.filter((p) => p.kind === "institution");
export const NGOS = PARTNERS.filter((p) => p.kind === "ngo");

/** First N partners — used by the homepage strip. */
export function partnerStripSelection(count = PARTNERS.length): Partner[] {
  return PARTNERS.slice(0, count);
}
