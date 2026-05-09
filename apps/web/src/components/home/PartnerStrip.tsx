/**
 * Partner strip. Phase 2 placeholder until the real partners list lands
 * (per pending-react-input.md — current senreact.com shows Microsoft +
 * Intel which are WordPress template stock, NOT real REACT partners).
 *
 * Renders 10 numbered placeholder slots — D011 says REACT has 10 real
 * partner names that we'll backfill. The slot count is fixed so when
 * real logos come in the layout doesn't shift.
 */

const PARTNER_SLOT_COUNT = 10;

export function PartnerStrip() {
  const slots = Array.from({ length: PARTNER_SLOT_COUNT }, (_, i) => i + 1);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Partenaires
          </p>
          <h2 className="text-3xl font-bold leading-tight">Ils nous accompagnent</h2>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">
            Liste à finaliser avec REACT — les logos seront ajoutés à mesure que les accords
            partenaires sont confirmés.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {slots.map((slot) => (
            <li
              key={slot}
              className="flex aspect-[3/2] items-center justify-center rounded-md border border-dashed border-[color:var(--color-border)] text-xs font-medium text-[color:var(--color-muted)]"
            >
              Partenaire {slot}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
