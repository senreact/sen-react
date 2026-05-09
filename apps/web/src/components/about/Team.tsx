/**
 * Team — 5 members from decisions log D011 (2026-05-04).
 *
 * Photos are not yet available — pending REACT-side per
 * docs/pending-react-input.md. Each card shows initials inside the
 * brand-green circle as a placeholder until headshots arrive. When
 * photos land, swap the <Initials> component for <Image> and the
 * card layout doesn't shift.
 *
 * Names + roles are facts (not editorial), inlined as plain data.
 * If we ever need to translate role labels for an EN locale, add a
 * second column to the Member type rather than parallel arrays.
 */

interface Member {
  name: string;
  role: string;
}

const TEAM: Member[] = [
  { name: "Elhadj Amadou Samb", role: "Directeur Exécutif" },
  { name: "Cheikh Oumar Kane", role: "Secrétaire Général" },
  { name: "Yaye Bineta Mamadou Dramé", role: "Coordinatrice programmes & communication" },
  { name: "Siny Thioune", role: "Suivi & évaluation" },
  { name: "Mamadou Coly", role: "Infographie & web manager" },
];

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Initials({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-lg font-semibold text-white"
    >
      {initialsOf(name)}
    </span>
  );
}

export function Team() {
  return (
    <section className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            L&apos;équipe
          </p>
          <h2 className="text-3xl font-bold leading-tight">Cinq personnes au service du réseau</h2>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">
            Photographies des membres à venir.
          </p>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((member) => (
            <li
              key={member.name}
              className="flex items-center gap-4 rounded-lg border border-[color:var(--color-border)] p-5"
            >
              <Initials name={member.name} />
              <div>
                <p className="text-base font-semibold leading-tight">{member.name}</p>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
