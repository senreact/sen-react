export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";

import { MentorForm } from "./MentorForm";

export const metadata: Metadata = {
  title: "Devenir mentor — Sen React",
};

export default async function DevenirMentorPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/mentorat/devenir-mentor");

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <nav className="mb-8 text-sm">
        <Link href="/mentorat" className="text-[color:var(--color-accent)] hover:underline">
          ← Mentorat
        </Link>
      </nav>
      <h1 className="mb-2 text-3xl font-bold">Devenir mentor</h1>
      <p className="mb-8 text-[color:var(--color-muted)]">
        Partagez votre expérience avec la communauté REACT. Les mentorés vous contacteront
        directement via les coordonnées que vous renseignez.
      </p>
      <MentorForm />
    </main>
  );
}
