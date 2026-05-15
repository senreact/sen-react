export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";

import { GroupCreateForm } from "./GroupCreateForm";

export const metadata: Metadata = {
  title: "Créer un groupe — Sen React",
};

export default async function GroupCreatePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/groupes/creer");

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <nav className="mb-8 text-sm">
        <Link href="/groupes" className="text-[color:var(--color-accent)] hover:underline">
          ← Groupes
        </Link>
      </nav>
      <h1 className="mb-2 text-3xl font-bold">Créer un groupe</h1>
      <p className="mb-8 text-[color:var(--color-muted)]">
        Rassemblez des membres autour d&apos;une région, d&apos;un secteur ou d&apos;un thème
        commun.
      </p>
      <GroupCreateForm />
    </main>
  );
}
