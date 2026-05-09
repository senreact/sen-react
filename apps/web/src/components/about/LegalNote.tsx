/**
 * Legal status footnote per D011. Facts only — registration number,
 * non-profit status, contact address. Sits at the bottom of /a-propos
 * so visitors looking for due-diligence information find it without
 * needing to scroll a separate "imprint" page.
 */
export function LegalNote() {
  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          Statut juridique
        </p>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          REACT est une association à but non lucratif, enregistrée au Sénégal sous le numéro{" "}
          <span className="font-mono text-[color:var(--color-fg)]">
            N° 00020614/MINT/DGAT/DLPL/DAPA
          </span>
          . Siège : Sacrée Cœur 3, Lot N° 128/B, Dakar, Sénégal.
        </p>
      </div>
    </section>
  );
}
