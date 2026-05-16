import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Sen React collecte, utilise et protège vos données personnelles — conforme à la loi sénégalaise n° 2008-12 (LPDP).",
};

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        <strong>⚠ Document provisoire — révision juridique requise.</strong> Ce texte est un projet
        rédigé à l&apos;aide d&apos;outils d&apos;intelligence artificielle à titre de point de
        départ uniquement. Il ne constitue pas un avis juridique. REACT doit le soumettre à un
        conseiller juridique compétent en droit sénégalais et procéder à la déclaration préalable
        auprès de la Commission de Protection des Données Personnelles (CDP) avant toute publication
        définitive.
      </div>

      <h1 className="mb-2 text-3xl font-bold">Politique de confidentialité</h1>
      <p className="mb-8 text-sm text-[color:var(--color-muted)]">Version 1.0 — mai 2026</p>

      <div className="space-y-10 text-[color:var(--color-fg)]">
        <section>
          <h2 className="mb-3 text-xl font-semibold">1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles collectées via la plateforme{" "}
            <strong>Sen React</strong> est l&apos;association REACT (Réseau des Entrepreneurs Actifs
            pour la Compétitivité et la Transition), dont le siège est à Sacrée Cœur 3, Lot N°
            128/B, Dakar, Sénégal.
          </p>
          <p className="mt-3">
            Contact délégué à la protection des données :{" "}
            <a href="mailto:senreactsen@gmail.com" className="text-[color:var(--color-accent)]">
              senreactsen@gmail.com
            </a>
          </p>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">
            <em>
              Note : REACT devra procéder à la déclaration préalable de ce traitement auprès de la
              Commission de Protection des Données Personnelles (CDP) du Sénégal conformément à
              l&apos;article 17 de la loi n° 2008-12 (LPDP) avant la mise en production.
            </em>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">2. Base légale</h2>
          <p>
            Le traitement des données personnelles est fondé sur la loi sénégalaise n° 2008-12 du 25
            janvier 2008 portant sur la Protection des Données à caractère Personnel (LPDP) et son
            décret d&apos;application n° 2008-721 du 30 juin 2008. Les bases légales du traitement
            sont :
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>
              <strong>Consentement</strong> — pour l&apos;inscription et la création du profil, les
              communications de la newsletter, et les cookies analytiques ;
            </li>
            <li>
              <strong>Exécution du contrat</strong> — pour les fonctionnalités liées au compte
              (authentification, profil, forum, mentorat) ;
            </li>
            <li>
              <strong>Intérêt légitime</strong> — pour la sécurité de la plateforme, la prévention
              des abus et l&apos;amélioration des services.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">3. Données collectées</h2>

          <h3 className="mb-2 text-base font-semibold">3.1 Visiteurs non inscrits</h3>
          <p>
            Pour les visiteurs qui ne créent pas de compte, nous collectons uniquement des données
            techniques anonymisées via Google Analytics 4 (si activé) : pages consultées, durée de
            visite, type d&apos;appareil et navigateur, pays de connexion. Aucune donnée personnelle
            identifiante n&apos;est collectée pour les visiteurs.
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold">3.2 Membres inscrits</h3>
          <p>
            Lors de l&apos;inscription et de l&apos;utilisation de la plateforme, les données
            suivantes peuvent être collectées :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Données d&apos;identification :</strong> nom d&apos;affichage, adresse
              courriel, mot de passe (stocké sous forme hachée — jamais en clair)
            </li>
            <li>
              <strong>Données de profil :</strong> secteur d&apos;activité, région,
              biographie/résumé, type d&apos;entité, nom de l&apos;organisation, photo de profil
              (optionnelle), coordonnées professionnelles (téléphone, site web — optionnels)
            </li>
            <li>
              <strong>Données de consentement parental :</strong> pour les membres de 13 à 17 ans,
              adresse courriel du parent ou tuteur
            </li>
            <li>
              <strong>Données d&apos;activité :</strong> commentaires, publications dans le forum,
              réponses aux sondages, participation aux groupes
            </li>
            <li>
              <strong>Données de connexion :</strong> date et heure de connexion, adresse IP
              (journaux de sécurité), type d&apos;appareil et navigateur
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">4. Finalités du traitement</h2>
          <p>Les données collectées sont utilisées pour :</p>
          <ul className="mt-2 list-inside list-disc space-y-2">
            <li>Permettre l&apos;inscription, l&apos;authentification et la gestion du compte ;</li>
            <li>
              Afficher le profil du membre dans l&apos;annuaire (si le profil est publié et vérifié)
              ;
            </li>
            <li>
              Permettre la participation aux fonctionnalités communautaires (forum, groupes,
              mentorat, sondages, commentaires) ;
            </li>
            <li>
              Envoyer des notifications liées à l&apos;activité de la plateforme (réponses aux
              commentaires, nouvelles opportunités) — avec possibilité de désinscription ;
            </li>
            <li>
              Assurer la sécurité et l&apos;intégrité de la plateforme (prévention des abus,
              modération) ;
            </li>
            <li>
              Améliorer les services de REACT sur la base de statistiques d&apos;usage anonymisées ;
            </li>
            <li>Respecter les obligations légales applicables.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">5. Destinataires des données</h2>
          <p>
            Les données personnelles ne sont pas vendues, louées ni cédées à des tiers à des fins
            commerciales. Elles peuvent être partagées avec :
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>
              <strong>Supabase Inc.</strong> (hébergeur de la base de données) — serveurs en Europe
              de l&apos;Ouest, soumis au RGPD européen en tant que sous-traitant ;
            </li>
            <li>
              <strong>Vercel Inc.</strong> (hébergeur de l&apos;application) — serveurs aux
              États-Unis, avec mécanismes de transfert conformes (Standard Contractual Clauses) ;
            </li>
            <li>
              <strong>Google LLC</strong> (Google Analytics 4, si activé) — données d&apos;audience
              anonymisées, soumises à la politique de confidentialité de Google ;
            </li>
            <li>
              <strong>Autorités publiques</strong> — sur demande légalement fondée des autorités
              sénégalaises ou en réponse à une décision de justice.
            </li>
          </ul>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">
            <em>
              Note REACT : le transfert de données personnelles vers les États-Unis via Vercel et
              Google devra faire l&apos;objet d&apos;une mention explicite dans la déclaration CDP
              et, si requis, d&apos;une autorisation spécifique de la CDP conformément à
              l&apos;article 46 de la loi n° 2008-12.
            </em>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">6. Durée de conservation</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Données de compte actif :</strong> conservées pendant toute la durée
              d&apos;activité du compte, puis supprimées dans les 30 jours suivant la suppression du
              compte ;
            </li>
            <li>
              <strong>Journaux de sécurité (logs de connexion) :</strong> 12 mois maximum ;
            </li>
            <li>
              <strong>Données d&apos;audience Google Analytics :</strong> 14 mois (paramètre
              recommandé GA4) ;
            </li>
            <li>
              <strong>Données de consentement parental :</strong> jusqu&apos;à la majorité du mineur
              (18 ans) ou suppression du compte ;
            </li>
            <li>
              <strong>Données archivées pour obligations légales :</strong> durée imposée par la loi
              applicable.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">7. Vos droits</h2>
          <p>
            Conformément à la loi sénégalaise n° 2008-12 (LPDP), notamment ses articles 24 à 28,
            vous disposez des droits suivants :
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>
              <strong>Droit d&apos;information</strong> (art. 23) — être informé des traitements
              vous concernant ;
            </li>
            <li>
              <strong>Droit d&apos;accès</strong> (art. 24) — obtenir une copie des données
              personnelles vous concernant ;
            </li>
            <li>
              <strong>Droit de rectification</strong> (art. 25) — faire corriger des données
              inexactes ou incomplètes ;
            </li>
            <li>
              <strong>Droit d&apos;opposition</strong> (art. 26) — vous opposer au traitement de vos
              données dans certains cas ;
            </li>
            <li>
              <strong>Droit de suppression</strong> — demander la suppression de votre compte et des
              données associées (dans les conditions prévues à l&apos;art. 26 LPDP) ;
            </li>
            <li>
              <strong>Droit de retrait du consentement</strong> — retirer votre consentement à tout
              moment pour les traitements fondés sur celui-ci.
            </li>
          </ul>
          <p className="mt-4">
            Pour exercer ces droits, adressez votre demande par courriel à{" "}
            <a href="mailto:senreactsen@gmail.com" className="text-[color:var(--color-accent)]">
              senreactsen@gmail.com
            </a>{" "}
            en précisant votre identité. REACT s&apos;engage à répondre dans un délai de 30 jours.
          </p>
          <p className="mt-3">
            Si vous estimez que le traitement de vos données personnelles n&apos;est pas conforme à
            la loi sénégalaise, vous pouvez introduire une réclamation auprès de la{" "}
            <strong>Commission de Protection des Données Personnelles (CDP) du Sénégal</strong> —
            autorité de contrôle compétente.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">8. Sécurité des données</h2>
          <p>
            REACT et ses sous-traitants techniques mettent en œuvre des mesures techniques et
            organisationnelles appropriées pour protéger vos données personnelles contre toute
            perte, destruction accidentelle, altération ou divulgation non autorisée :
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1">
            <li>Chiffrement des mots de passe (bcrypt) ;</li>
            <li>Communications chiffrées via HTTPS/TLS sur l&apos;ensemble de la plateforme ;</li>
            <li>
              Base de données sécurisée avec contrôle d&apos;accès par rôle (Row Level Security) ;
            </li>
            <li>Hébergement en région Europe de l&apos;Ouest (Supabase) ;</li>
            <li>
              Accès restreint aux données par l&apos;équipe REACT selon le principe du moindre
              privilège.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">9. Cookies</h2>
          <p>
            La politique d&apos;utilisation des cookies est décrite séparément dans notre{" "}
            <a href="/cookies" className="text-[color:var(--color-accent)] hover:underline">
              Politique de cookies
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">10. Mineurs</h2>
          <p>
            La plateforme n&apos;est pas destinée aux enfants de moins de 13 ans. Pour les jeunes de
            13 à 17 ans, le consentement d&apos;un parent ou tuteur légal est requis lors de
            l&apos;inscription. REACT traite les données des mineurs avec une vigilance accrue et ne
            les utilise pas à des fins de profilage ou de publicité ciblée.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">11. Modifications de la politique</h2>
          <p>
            REACT se réserve le droit de modifier la présente politique de confidentialité à tout
            moment. Les modifications sont publiées sur cette page avec mise à jour de la date de
            version. Pour les modifications substantielles, les membres seront informés par
            courriel.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">12. Contact</h2>
          <p>
            Pour toute question relative au traitement de vos données personnelles :{" "}
            <a href="mailto:senreactsen@gmail.com" className="text-[color:var(--color-accent)]">
              senreactsen@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
