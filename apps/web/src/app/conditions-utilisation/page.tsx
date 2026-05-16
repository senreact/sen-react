import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description:
    "Conditions générales d'utilisation de la plateforme Sen React — droits, obligations et règles de la communauté.",
};

export default function ConditionsUtilisationPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        <strong>⚠ Document provisoire — révision juridique requise.</strong> Ce texte est un projet
        rédigé à l&apos;aide d&apos;outils d&apos;intelligence artificielle à titre de point de
        départ uniquement. Il ne constitue pas un avis juridique. REACT doit le soumettre à un
        conseiller juridique compétent en droit sénégalais avant toute publication définitive.
      </div>

      <h1 className="mb-2 text-3xl font-bold">Conditions générales d&apos;utilisation (CGU)</h1>
      <p className="mb-8 text-sm text-[color:var(--color-muted)]">Version 1.0 — mai 2026</p>

      <div className="space-y-10 text-[color:var(--color-fg)]">
        <section>
          <h2 className="mb-3 text-xl font-semibold">1. Présentation et acceptation</h2>
          <p>
            La plateforme <strong>Sen React</strong> est éditée par l&apos;association REACT (Réseau
            des Entrepreneurs Actifs pour la Compétitivité et la Transition), association à but non
            lucratif dont le siège est à Dakar, Sénégal.
          </p>
          <p className="mt-3">
            L&apos;accès et l&apos;utilisation de la plateforme, qu&apos;il s&apos;agisse de la
            navigation en tant que visiteur ou de l&apos;inscription en tant que membre, impliquent
            l&apos;acceptation pleine et entière des présentes conditions générales
            d&apos;utilisation (CGU). Toute personne qui n&apos;accepte pas ces conditions doit
            s&apos;abstenir d&apos;utiliser la plateforme.
          </p>
          <p className="mt-3">
            REACT se réserve le droit de modifier les présentes CGU à tout moment. Les modifications
            entrent en vigueur dès leur publication. Les utilisateurs sont invités à les consulter
            régulièrement.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">2. Accès à la plateforme</h2>
          <h3 className="mb-2 text-base font-semibold">2.1 Visiteurs</h3>
          <p>
            La consultation de la plupart des contenus (actualités, événements, publications,
            ressources, annuaire public) est libre et gratuite, sans inscription préalable.
          </p>
          <h3 className="mb-2 mt-4 text-base font-semibold">2.2 Membres</h3>
          <p>
            Certaines fonctionnalités (dépôt de profil dans l&apos;annuaire, forum, groupes,
            mentorat, sondages, commentaires) nécessitent la création d&apos;un compte membre.
            L&apos;inscription est gratuite et ouverte à toute personne physique ou morale
            intéressée par la mission de REACT.
          </p>
          <h3 className="mb-2 mt-4 text-base font-semibold">2.3 Conditions d&apos;âge</h3>
          <p>
            La plateforme est ouverte à toute personne âgée d&apos;au moins <strong>13 ans</strong>.
            Les personnes âgées de 13 à 17 ans révolus doivent disposer du consentement préalable
            d&apos;un parent ou tuteur légal pour s&apos;inscrire et utiliser les fonctionnalités
            communautaires. En créant un compte, l&apos;utilisateur déclare avoir l&apos;âge requis
            ou avoir obtenu le consentement parental.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">3. Création et gestion du compte</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>
              L&apos;utilisateur s&apos;engage à fournir des informations exactes, complètes et à
              jour lors de son inscription et à les maintenir à jour.
            </li>
            <li>Chaque utilisateur ne peut détenir qu&apos;un seul compte actif.</li>
            <li>
              L&apos;utilisateur est responsable de la confidentialité de ses identifiants de
              connexion (adresse courriel et mot de passe). Il s&apos;engage à ne pas les
              communiquer à des tiers.
            </li>
            <li>
              Toute utilisation du compte détectée comme frauduleuse doit être signalée
              immédiatement à REACT à l&apos;adresse{" "}
              <a href="mailto:senreactsen@gmail.com" className="text-[color:var(--color-accent)]">
                senreactsen@gmail.com
              </a>
              .
            </li>
            <li>
              REACT se réserve le droit de suspendre ou supprimer tout compte ne respectant pas les
              présentes CGU, sans préavis ni indemnisation.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">4. Règles d&apos;utilisation et contenu</h2>
          <h3 className="mb-2 text-base font-semibold">4.1 Comportements autorisés</h3>
          <p>
            L&apos;utilisateur s&apos;engage à utiliser la plateforme conformément à sa finalité
            (mise en relation professionnelle, partage de connaissances, renforcement de capacités,
            accès aux opportunités).
          </p>
          <h3 className="mb-2 mt-4 text-base font-semibold">4.2 Comportements interdits</h3>
          <p className="mb-2">Il est formellement interdit de :</p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              Publier des contenus illicites, diffamatoires, injurieux, racistes, discriminatoires,
              obscènes ou portant atteinte à la dignité humaine ;
            </li>
            <li>Harceler, menacer ou intimider d&apos;autres membres ;</li>
            <li>Usurper l&apos;identité d&apos;une personne physique ou morale ;</li>
            <li>
              Diffuser des informations fausses ou trompeuses susceptibles de porter préjudice à des
              personnes ou à des organisations ;
            </li>
            <li>
              Publier du contenu à caractère commercial ou publicitaire sans l&apos;accord préalable
              de REACT ;
            </li>
            <li>
              Reproduire, distribuer ou exploiter des contenus protégés par le droit d&apos;auteur
              sans autorisation ;
            </li>
            <li>
              Tenter de pirater la plateforme, de compromettre sa sécurité ou d&apos;accéder sans
              autorisation aux données d&apos;autres utilisateurs ;
            </li>
            <li>
              Utiliser des robots, scripts ou tout autre moyen automatisé pour accéder à la
              plateforme sans accord de REACT ;
            </li>
            <li>
              Collecter les données personnelles d&apos;autres membres à des fins commerciales ou
              non consenties.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">5. Contenu généré par les utilisateurs</h2>
          <p>
            Les utilisateurs qui publient des contenus (profils, commentaires, publications dans le
            forum, etc.) conservent leurs droits de propriété intellectuelle sur ces contenus. En
            les publiant, ils accordent à REACT une licence non exclusive, mondiale, gratuite, pour
            utiliser, reproduire, afficher et distribuer ces contenus dans le cadre du
            fonctionnement de la plateforme et de la mission de REACT.
          </p>
          <p className="mt-3">
            L&apos;utilisateur garantit que les contenus qu&apos;il publie ne portent pas atteinte
            aux droits de tiers et sont conformes aux présentes CGU et aux lois applicables.
          </p>
          <p className="mt-3">
            REACT se réserve le droit de modérer, modifier ou supprimer tout contenu ne respectant
            pas les présentes CGU, sans obligation de justification préalable.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">6. Vérification des profils</h2>
          <p>
            Certains profils dans l&apos;annuaire bénéficient d&apos;un statut &laquo; Vérifié
            &raquo; attribué par l&apos;équipe REACT après contrôle des informations déclarées. Ce
            statut ne constitue pas une certification de solvabilité, de compétences
            professionnelles ou de tout autre attribut personnel ou professionnel. REACT décline
            toute responsabilité quant aux transactions ou relations établies entre membres sur la
            base de ce statut.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">7. Disponibilité de la plateforme</h2>
          <p>
            REACT s&apos;efforce d&apos;assurer la disponibilité de la plateforme 24h/24 et 7j/7,
            mais ne peut garantir une disponibilité continue. Des interruptions pour maintenance,
            mise à jour ou cause de force majeure peuvent survenir. REACT s&apos;efforcera d&apos;en
            informer les utilisateurs dans les meilleurs délais.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">8. Limitation de responsabilité</h2>
          <p>
            Dans les limites permises par le droit applicable, REACT ne saurait être tenu
            responsable :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-2">
            <li>
              Des dommages directs ou indirects résultant de l&apos;utilisation ou de
              l&apos;impossibilité d&apos;utiliser la plateforme ;
            </li>
            <li>
              Des contenus publiés par les membres, qui relèvent de leur seule responsabilité ;
            </li>
            <li>Des relations, transactions ou litiges entre membres ;</li>
            <li>
              De l&apos;exactitude des informations fournies par les partenaires, les institutions
              publiques référencées ou les tiers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">9. Résiliation du compte</h2>
          <p>
            L&apos;utilisateur peut supprimer son compte à tout moment en adressant une demande à{" "}
            <a href="mailto:senreactsen@gmail.com" className="text-[color:var(--color-accent)]">
              senreactsen@gmail.com
            </a>
            . La suppression entraîne l&apos;effacement des données personnelles associées dans les
            délais prévus par la politique de confidentialité, à l&apos;exception des données dont
            la conservation est imposée par la loi.
          </p>
          <p className="mt-3">
            REACT peut résilier un compte sans préavis en cas de violation des présentes CGU,
            d&apos;atteinte aux droits de tiers ou de comportement préjudiciable à la communauté.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">10. Données personnelles</h2>
          <p>
            Le traitement des données personnelles des utilisateurs est régi par la{" "}
            <a href="/confidentialite" className="text-[color:var(--color-accent)] hover:underline">
              Politique de confidentialité
            </a>{" "}
            de Sen React, conforme à la loi sénégalaise n° 2008-12 du 25 janvier 2008 sur la
            protection des données à caractère personnel (LPDP).
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">11. Droit applicable et litiges</h2>
          <p>
            Les présentes CGU sont régies par le droit sénégalais, notamment le Code des Obligations
            Civiles et Commerciales (COCC) et la législation applicable aux associations et aux
            services en ligne.
          </p>
          <p className="mt-3">
            En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes
            CGU, les parties s&apos;engagent à rechercher une solution amiable dans un délai de
            trente (30) jours. À défaut d&apos;accord, les tribunaux compétents du ressort de Dakar
            (Sénégal) seront seuls compétents, sauf disposition légale contraire impérative.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">12. Contact</h2>
          <p>
            Pour toute question relative aux présentes CGU, contactez REACT à l&apos;adresse :{" "}
            <a href="mailto:senreactsen@gmail.com" className="text-[color:var(--color-accent)]">
              senreactsen@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
