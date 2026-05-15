export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getGroup, isMember, listGroupMembers } from "@/lib/groups";
import { getOwnMentorProfile } from "@/lib/mentors";
import { createServerSupabase } from "@/lib/supabase/server";

import { MembershipButton } from "./MembershipButton";

interface Props {
  params: Promise<{ groupId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { groupId } = await params;
  const group = await getGroup(groupId);
  return {
    title: group ? `${group.name} — Groupes Sen React` : "Groupes Sen React",
  };
}

const TYPE_LABELS: Record<string, string> = {
  region: "Région",
  sector: "Secteur",
  theme: "Thème",
};

export default async function GroupDetailPage({ params }: Props) {
  const { groupId } = await params;

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/connexion?returnTo=/groupes/${groupId}`);

  const [group, members, memberStatus] = await Promise.all([
    getGroup(groupId),
    listGroupMembers(groupId),
    isMember(groupId, user.id),
  ]);

  if (!group) notFound();

  // Resolve display names for members from mentor profiles
  const memberNames = await Promise.all(
    members.map(async (m) => {
      const profile = await getOwnMentorProfile(m.user_id);
      return { ...m, displayName: profile?.display_name ?? "Membre" };
    }),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm">
        <Link href="/groupes" className="text-[color:var(--color-accent)] hover:underline">
          ← Groupes
        </Link>
      </nav>

      <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-6">
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-xs text-[color:var(--color-muted)]">
              {TYPE_LABELS[group.group_type]} · {group.tag}
            </span>
            <h1 className="mt-2 text-2xl font-bold">{group.name}</h1>
          </div>
          <MembershipButton groupId={group.id} isMember={memberStatus} />
        </div>
        {group.description ? (
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">{group.description}</p>
        ) : null}
        <p className="mt-3 text-xs text-[color:var(--color-muted)]">
          {group.member_count} membre{group.member_count !== 1 ? "s" : ""}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
          Membres
        </h2>
        {memberNames.length === 0 ? (
          <p className="text-sm text-[color:var(--color-muted)]">Aucun membre pour le moment.</p>
        ) : (
          <ul className="divide-y divide-[color:var(--color-border)] rounded-lg border border-[color:var(--color-border)] bg-white">
            {memberNames.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <span className="font-medium">{m.displayName}</span>
                {m.role === "admin" ? (
                  <span className="text-xs text-[color:var(--color-accent)]">Admin</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
