export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";

import { PollCreateForm } from "./PollCreateForm";

export const metadata: Metadata = {
  title: "Créer un sondage — Sen React",
};

export default async function PollCreatePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/sondages/creer");

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <nav className="mb-8 text-sm">
        <Link href="/sondages" className="text-[color:var(--color-accent)] hover:underline">
          ← Sondages
        </Link>
      </nav>
      <h1 className="mb-2 text-3xl font-bold">Créer un sondage</h1>
      <p className="mb-8 text-[color:var(--color-muted)]">
        Recueillez l&apos;avis de la communauté REACT sur un sujet qui vous tient à cœur.
      </p>
      <PollCreateForm />
    </main>
  );
}
