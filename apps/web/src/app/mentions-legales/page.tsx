import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales sur l'association REACT et la plateforme Sen React.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        <strong>⚠ Document provisoire — révision juridique requise.</strong> Ce texte est un projet
        rédigé à l&apos;aide d&apos;outils d&apos;intelligence artificielle à titre de point de
        départ uniquement. Il ne constitue pas un avis juridique. REACT doit le soumettre à un
        conseiller juridique compétent en droit sénégalais avant toute publication définitive.
      </div>

      <h1 className="mb-8 text-3xl font-bold">Mentions légales</h1>

      <p className="mb-8 text-sm text-[color:var(--color-muted)]">
        Dernière mise à jour : mai 2026
      </p>

      <section className="prose prose-slate max-w-none space-y-8">
        <div>
          <h2 className="mb-3 text-xl font-semibold">1. Éditeur de la plateforme</h2>
          <p className="text-[color:var(--color-fg)]">
            La plateforme <strong>Sen React</strong> (accessible à l&apos;adresse
            senreact.vercel.app et, à terme, sur le domaine officiel de l&apos;association) est
            éditée par :
          </p>
          <ul className="mt-3 space-y-1 text-sm text-[color:var(--color-fg)]">
            <li>
              <strong>Dénomination :</strong> REACT — Réseau des Entrepreneurs Actifs pour la
              Compétitivité et la Transition
            </li>
            <li>
              <strong>Forme juridique :</strong> Association à but non lucratif, régie par la loi
              sénégalaise n° 1901-68 sur les associations
            </li>
            <li>
              <strong>Siège social :</strong> Sacrée Cœur 3, Lot N° 128/B, Dakar, Sénégal
            </li>
            <li>
              <strong>Directeur de la publication :</strong> Elhadj Amadou Samb
            </li>
            <li>
              <strong>Courriel :</strong>{" "}
              <a href="mailto:senreactsen@gmail.com" className="text-[color:var(--color-accent)]">
                senreactsen@gmail.com
              </a>
            </li>
          </ul>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">
            <em>
              Note à compléter avant publication : numéro NINEA, numéro de récépissé
              d&apos;enregistrement auprès de la Direction des Libertés Publiques et des Affaires
              Politiques (DLPAP), et tout autre identifiant officiel.
            </em>
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold">2. Hébergement</h2>
          <ul className="space-y-1 text-sm text-[color:var(--color-fg)]">
            <li>
              <strong>Hébergeur de l&apos;application web :</strong> Vercel Inc., 340 Pine Street
              Suite 701, San Francisco, CA 94104, États-Unis — vercel.com
            </li>
            <li>
              <strong>Hébergeur de la base de données :</strong> Supabase Inc. — infrastructure
              hébergée en Europe de l&apos;Ouest (région eu-west-1, Ireland/Frankfurt)
            </li>
            <li>
              <strong>Gestionnaire de contenu (CMS) :</strong> Payload CMS, hébergé via Vercel
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold">3. Objet de la plateforme</h2>
          <p className="text-[color:var(--color-fg)]">
            Sen React est une plateforme numérique à but non lucratif dédiée à la transition
            numérique et écologique des entrepreneurs sénégalais et africains, avec un accent
            particulier sur les femmes, les jeunes et les communautés vulnérables. Elle propose des
            services d&apos;annuaire professionnel, de partage d&apos;actualités, de mise en
            relation et de renforcement de capacités.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold">4. Propriété intellectuelle</h2>
          <p className="text-[color:var(--color-fg)]">
            L&apos;ensemble du contenu de la plateforme (textes, images, logotypes, icônes,
            structure, code source) est protégé par le droit d&apos;auteur conformément à la loi
            sénégalaise n° 2008-09 du 25 janvier 2008 sur le droit d&apos;auteur et les droits
            voisins. Toute reproduction, représentation, modification ou exploitation, totale ou
            partielle, du contenu de la plateforme sans autorisation écrite préalable de REACT est
            strictement interdite.
          </p>
          <p className="mt-3 text-[color:var(--color-fg)]">
            Les marques, logos et dénominations sociales figurant sur la plateforme sont la
            propriété de leurs titulaires respectifs.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold">5. Responsabilité</h2>
          <p className="text-[color:var(--color-fg)]">
            REACT s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations
            diffusées sur la plateforme. Toutefois, REACT ne peut garantir l&apos;exhaustivité, la
            précision ou l&apos;actualité de ces informations. La responsabilité de REACT ne saurait
            être engagée en cas d&apos;inexactitude des informations publiées par des tiers ou des
            membres.
          </p>
          <p className="mt-3 text-[color:var(--color-fg)]">
            REACT ne saurait être tenu responsable des dommages directs ou indirects résultant de
            l&apos;utilisation de la plateforme ou des services proposés.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold">6. Droit applicable et juridiction</h2>
          <p className="text-[color:var(--color-fg)]">
            Les présentes mentions légales sont régies par le droit sénégalais. En cas de litige,
            les tribunaux compétents du ressort de Dakar (Sénégal) seront seuls compétents, sauf
            disposition légale contraire impérative.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold">7. Données personnelles et cookies</h2>
          <p className="text-[color:var(--color-fg)]">
            Le traitement des données personnelles est décrit dans notre{" "}
            <a href="/confidentialite" className="text-[color:var(--color-accent)] hover:underline">
              Politique de confidentialité
            </a>
            . L&apos;utilisation des cookies est décrite dans notre{" "}
            <a href="/cookies" className="text-[color:var(--color-accent)] hover:underline">
              Politique de cookies
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold">8. Contact</h2>
          <p className="text-[color:var(--color-fg)]">
            Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter
            à l&apos;adresse :{" "}
            <a href="mailto:senreactsen@gmail.com" className="text-[color:var(--color-accent)]">
              senreactsen@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
