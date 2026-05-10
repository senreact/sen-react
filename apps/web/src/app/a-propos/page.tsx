import type { Metadata } from "next";

import { AboutHero } from "@/components/about/AboutHero";
import { Founding } from "@/components/about/Founding";
import { LegalNote } from "@/components/about/LegalNote";
import { MissionVision } from "@/components/about/MissionVision";
import { Team } from "@/components/about/Team";
import { Values } from "@/components/about/Values";
import { getAboutPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "À propos — Sen React",
  description:
    "REACT (Réseau des Entrepreneurs Actifs) — mission, vision, valeurs, fondation, équipe et statut juridique.",
};

/**
 * /a-propos — Phase 2 step 3 per the roadmap §4.
 *
 * Sections, top to bottom (all sourced from the about-page CMS global,
 * except Team which has its own collection):
 *   1. AboutHero — eyebrow + headline + lead-in
 *   2. MissionVision — verbatim FR mission + vision per decisions log §A1
 *   3. Values — 3 principles
 *   4. Founding — 2021 origin story + 2024 relaunch (Lexical body)
 *   5. Team — 5 members from the team-members collection
 *   6. LegalNote — registration number + Dakar address (Lexical body)
 */
export default async function AboutPage() {
  const about = await getAboutPage();
  return (
    <main>
      <AboutHero data={about.hero} />
      <MissionVision mission={about.mission} vision={about.vision} />
      <Values data={about.values} />
      <Founding data={about.founding} />
      <Team />
      <LegalNote data={about.legal} />
    </main>
  );
}
