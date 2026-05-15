export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";

import { ForumCreateForm } from "./ForumCreateForm";

export const metadata: Metadata = {
  title: "Nouvelle discussion — Forum Sen React",
};

export default async function ForumCreatePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/forum/creer");

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <nav className="mb-8 text-sm">
        <Link href="/forum" className="text-[color:var(--color-accent)] hover:underline">
          ← Forum
        </Link>
      </nav>
      <h1 className="mb-2 text-3xl font-bold">Nouvelle discussion</h1>
      <p className="mb-8 text-[color:var(--color-muted)]">
        Posez une question ou lancez un sujet dans votre secteur d&apos;activité.
      </p>
      <ForumCreateForm />
    </main>
  );
}
