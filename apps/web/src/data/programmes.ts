/**
 * Active REACT programmes — confirmed by Amadou 2026-05-07 in
 * `discovery/responses/tom-followups-fr.md` Q1 (decisions log §D021).
 *
 * Three currently-active programmes; Sen React is the headline because
 * it's THIS platform — the meta-programme that hosts the others.
 *
 * Order is the order Amadou listed them (3A · Sen React · IA for Change).
 * Don't sort alphabetically without sign-off.
 */

export type ProgrammeVariant = "headline" | "active";

export interface Programme {
  slug: string;
  /** Display name as Amadou wrote it. */
  title: string;
  /** Short eyebrow shown above the title. */
  eyebrow: string;
  /** FR description, verbatim or near-verbatim from Amadou's response. */
  description: string;
  variant: ProgrammeVariant;
}

export const PROGRAMMES: Programme[] = [
  {
    slug: "sen-react",
    title: "Projet Sen React",
    eyebrow: "Programme phare",
    description:
      "Création d'un écosystème numérique d'information, de renforcement de capacités et de mise en relation pour les entrepreneurs et acteurs de changement au Sénégal et en Afrique.",
    variant: "headline",
  },
  {
    slug: "projet-3a",
    title: "Projet 3A",
    eyebrow: "Programme actif",
    description:
      "Renforcement de la formalisation, de l'autonomisation et de la compétitivité des entrepreneurs locaux et des leaders communautaires, pour promouvoir le leadership communautaire, le développement durable et l'adaptation au changement climatique au Sénégal.",
    variant: "active",
  },
  {
    slug: "ia-for-change",
    title: "IA for Change",
    eyebrow: "Programme actif",
    description:
      "Promotion des outils d'intelligence artificielle pour renforcer la productivité et l'innovation des entrepreneurs et des acteurs de changement.",
    variant: "active",
  },
];
