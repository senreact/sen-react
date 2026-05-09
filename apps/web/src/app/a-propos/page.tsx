import type { Metadata } from "next";

import { AboutHero } from "@/components/about/AboutHero";
import { Founding } from "@/components/about/Founding";
import { LegalNote } from "@/components/about/LegalNote";
import { MissionVision } from "@/components/about/MissionVision";
import { Team } from "@/components/about/Team";
import { Values } from "@/components/about/Values";

export const metadata: Metadata = {
  title: "À propos — Sen React",
  description:
    "REACT (Réseau des Entrepreneurs Actifs) — mission, vision, valeurs, fondation, équipe et statut juridique.",
};

/**
 * /a-propos — Phase 2 step 3 per the roadmap §4.
 *
 * Sections, top to bottom:
 *   1. AboutHero — eyebrow + headline + lead-in
 *   2. MissionVision — verbatim FR mission + vision per decisions log §A1
 *   3. Values — Leadership / Inclusion numérique / Développement économique durable
 *   4. Founding — 2021 origin story + 2024 relaunch
 *   5. Team — 5 members per D011 (initials placeholder until photos arrive)
 *   6. LegalNote — registration number + Dakar address
 */
export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <MissionVision />
      <Values />
      <Founding />
      <Team />
      <LegalNote />
    </main>
  );
}
