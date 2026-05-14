import { DirectoryTeaser } from "@/components/home/DirectoryTeaser";
import { Domaines } from "@/components/home/Domaines";
import { Hero } from "@/components/home/Hero";
import { LatestNews } from "@/components/home/LatestNews";
import { PartnerStrip } from "@/components/home/PartnerStrip";
import { Programmes } from "@/components/home/Programmes";

/**
 * Force dynamic rendering — the `DirectoryTeaser` reads live verified
 * profiles from Supabase via the cookie-aware server client, which
 * relies on env vars that aren't available at build time. The rest of
 * the homepage already does network fetches per request, so the cost
 * is negligible and removing the static-prerender attempt avoids the
 * "Supabase env not set" build error.
 */
export const dynamic = "force-dynamic";

/**
 * Homepage shell — Phase 2 step 2 per the roadmap §4.
 *
 * Sections, top to bottom: Hero → Domaines (4 pillars) → Programmes
 * (Sen React headline + 3 placeholders awaiting Q1) → LatestNews
 * (Phase 3 placeholder) → PartnerStrip (real list pending). Each
 * section is its own component to keep this composition file
 * trivially scannable and to make per-section A/B-style tweaks
 * easy in later phases.
 *
 * Phase 0's "Plateforme en cours de construction" placeholder + the
 * 10-sectors list are now retired from the homepage — sectors get
 * their own routes in Phase 2 step 6 (Sector pages × 10) and the
 * "construction" wording is no longer needed once real content
 * lives here.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <DirectoryTeaser />
      <Domaines />
      <Programmes />
      <LatestNews />
      <PartnerStrip />
    </main>
  );
}
