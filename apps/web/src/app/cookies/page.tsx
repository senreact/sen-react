import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description:
    "Informations sur les cookies utilisés par la plateforme Sen React et comment les gérer.",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        <strong>⚠ Document provisoire — révision juridique requise.</strong> Ce texte est un projet
        rédigé à l&apos;aide d&apos;outils d&apos;intelligence artificielle à titre de point de
        départ uniquement. Il ne constitue pas un avis juridique. REACT doit le soumettre à un
        conseiller juridique compétent en droit sénégalais avant toute publication définitive.
      </div>

      <h1 className="mb-2 text-3xl font-bold">Politique de cookies</h1>
      <p className="mb-8 text-sm text-[color:var(--color-muted)]">Version 1.0 — mai 2026</p>

      <div className="space-y-10 text-[color:var(--color-fg)]">
        <section>
          <h2 className="mb-3 text-xl font-semibold">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, téléphone,
            tablette) lors de la visite d&apos;un site web. Il est lu par le navigateur à chaque
            visite ultérieure et permet au site de mémoriser certaines informations (préférences,
            état de connexion, etc.) ou de collecter des statistiques d&apos;utilisation.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">2. Cookies utilisés par Sen React</h2>

          <h3 className="mb-2 text-base font-semibold">2.1 Cookies strictement nécessaires</h3>
          <p>
            Ces cookies sont indispensables au fonctionnement de la plateforme. Ils permettent la
            gestion de votre session (connexion / déconnexion) et la sécurité. Ils ne peuvent pas
            être désactivés sans altérer le bon fonctionnement du service.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-[color:var(--color-border)]">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Nom</th>
                  <th className="px-4 py-2 text-left font-semibold">Finalité</th>
                  <th className="px-4 py-2 text-left font-semibold">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">sb-*-auth-token</td>
                  <td className="px-4 py-2">Session d&apos;authentification Supabase</td>
                  <td className="px-4 py-2">Session / 1 heure</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">sb-*-auth-token-code-verifier</td>
                  <td className="px-4 py-2">Vérification PKCE pour OAuth</td>
                  <td className="px-4 py-2">Session</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mb-2 mt-6 text-base font-semibold">
            2.2 Cookies analytiques (optionnels)
          </h3>
          <p>
            Si vous l&apos;acceptez, la plateforme utilise Google Analytics 4 pour mesurer
            l&apos;audience et améliorer nos services. Ces cookies collectent des données
            anonymisées sur votre navigation (pages visitées, durée de visite, type
            d&apos;appareil). Aucune information permettant de vous identifier personnellement
            n&apos;est transmise à Google.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-[color:var(--color-border)]">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Nom</th>
                  <th className="px-4 py-2 text-left font-semibold">Finalité</th>
                  <th className="px-4 py-2 text-left font-semibold">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">_ga</td>
                  <td className="px-4 py-2">Distinguer les visiteurs uniques (Google Analytics)</td>
                  <td className="px-4 py-2">2 ans</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">_ga_*</td>
                  <td className="px-4 py-2">Maintenir l&apos;état de session GA4</td>
                  <td className="px-4 py-2">2 ans</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">
            <em>
              Note REACT : un bandeau de consentement aux cookies analytiques devra être mis en
              place avant l&apos;activation de Google Analytics 4 en production. Sans consentement
              préalable de l&apos;utilisateur, le tag GA4 ne doit pas être chargé. À confirmer avec
              le conseil juridique.
            </em>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">3. Gestion des cookies</h2>

          <h3 className="mb-2 text-base font-semibold">3.1 Depuis votre navigateur</h3>
          <p>
            Vous pouvez à tout moment configurer votre navigateur pour accepter, refuser ou
            supprimer les cookies. La procédure varie selon le navigateur :
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1">
            <li>
              <strong>Google Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies
            </li>
            <li>
              <strong>Mozilla Firefox :</strong> Paramètres → Vie privée et sécurité → Cookies
            </li>
            <li>
              <strong>Safari :</strong> Préférences → Confidentialité → Cookies
            </li>
            <li>
              <strong>Microsoft Edge :</strong> Paramètres → Confidentialité → Cookies
            </li>
          </ul>
          <p className="mt-3">
            Notez que la désactivation des cookies strictement nécessaires (cookies de session
            Supabase) vous empêchera de vous connecter à votre compte.
          </p>

          <h3 className="mb-2 mt-6 text-base font-semibold">3.2 Opt-out Google Analytics</h3>
          <p>
            Pour désactiver le suivi Google Analytics sur tous les sites :{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-accent)] hover:underline"
            >
              Module complémentaire Google Analytics Opt-out
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">4. Base légale et cadre réglementaire</h2>
          <p>
            La présente politique de cookies est établie conformément à la loi sénégalaise n°
            2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel (LPDP) et
            aux lignes directrices de la Commission de Protection des Données Personnelles (CDP) du
            Sénégal. Pour les cookies analytiques, le consentement de l&apos;utilisateur est requis
            avant leur dépôt.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">5. Modifications</h2>
          <p>
            La présente politique peut être mise à jour pour refléter les évolutions de la
            plateforme ou de la réglementation. La date de version est indiquée en tête de document.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">6. Contact</h2>
          <p>
            Pour toute question relative aux cookies :{" "}
            <a href="mailto:senreactsen@gmail.com" className="text-[color:var(--color-accent)]">
              senreactsen@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
