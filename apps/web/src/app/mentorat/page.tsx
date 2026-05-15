export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSector } from "@sen-react/shared";

import { listActiveMentors } from "@/lib/mentors";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mentorat — Sen React",
  description:
    "Trouvez un mentor parmi les entrepreneurs expérimentés de la communauté REACT et accélérez votre développement.",
};

export default async function MentoratPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?returnTo=/mentorat");

  const mentors = await listActiveMentors();

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Mentorat
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Apprenez des meilleurs de la communauté.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            Connectez-vous avec des entrepreneurs expérimentés de la communauté REACT, prêts à
            partager leur parcours et leurs conseils.
          </p>
          <div className="mt-6">
            <Link
              href="/mentorat/devenir-mentor"
              className="inline-block rounded-md border border-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)] hover:text-white"
            >
              Devenir mentor →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {mentors.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-muted)]">
            Aucun mentor disponible pour le moment.{" "}
            <Link
              href="/mentorat/devenir-mentor"
              className="font-semibold text-[color:var(--color-accent)] hover:underline"
            >
              Soyez le premier à rejoindre le programme.
            </Link>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {mentors.map((mentor) => (
              <li
                key={mentor.id}
                className="rounded-lg border border-[color:var(--color-border)] bg-white p-5"
              >
                <h2 className="mb-1 text-base font-semibold">{mentor.display_name}</h2>
                {mentor.region ? (
                  <p className="mb-2 text-xs text-[color:var(--color-muted)]">{mentor.region}</p>
                ) : null}
                {mentor.bio ? (
                  <p className="mb-3 text-sm text-[color:var(--color-fg)] line-clamp-3">
                    {mentor.bio}
                  </p>
                ) : null}
                {mentor.sectors.length > 0 ? (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {mentor.sectors.map((s) => {
                      const sector = getSector(s);
                      return sector ? (
                        <span
                          key={s}
                          className="rounded-full bg-[color:var(--color-accent)]/10 px-2 py-0.5 text-xs font-medium text-[color:var(--color-accent)]"
                        >
                          {sector.fr}
                        </span>
                      ) : null;
                    })}
                  </div>
                ) : null}
                {mentor.expertise.length > 0 ? (
                  <div className="mb-4 flex flex-wrap gap-1">
                    {mentor.expertise.map((e) => (
                      <span
                        key={e}
                        className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-xs text-[color:var(--color-muted)]"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-3 text-sm">
                  {mentor.contact_email ? (
                    <a
                      href={`mailto:${mentor.contact_email}`}
                      className="font-semibold text-[color:var(--color-accent)] hover:underline"
                    >
                      Email
                    </a>
                  ) : null}
                  {mentor.contact_wa ? (
                    <a
                      href={`https://wa.me/${mentor.contact_wa.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[color:var(--color-accent)] hover:underline"
                    >
                      WhatsApp
                    </a>
                  ) : null}
                  {mentor.linkedin_url ? (
                    <a
                      href={mentor.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[color:var(--color-accent)] hover:underline"
                    >
                      LinkedIn
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
