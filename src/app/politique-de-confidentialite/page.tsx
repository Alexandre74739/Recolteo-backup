export default function PolitiqueDeConfidentialite() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-base leading-8">
      <h1 className="text-3xl font-bold mb-6 text-sapin">Politique de confidentialité</h1>

      <p className="mb-4 text-sapin">
        La présente politique de confidentialité a pour objectif d’informer les utilisateurs de la plateforme Récoltéo sur la manière dont leurs données personnelles sont collectées, utilisées et protégées. Récoltéo est une plateforme mettant en relation des commerces et des associations afin de faciliter le don d’invendus alimentaires ou matériels. Récoltéo s’engage à respecter la réglementation applicable en matière de protection des données personnelles, notamment le Règlement Général sur la Protection des Données (RGPD) applicable aux utilisateurs situés dans l’Union européenne.
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">1. Responsable du traitement</h2>
        <p className="mb-2 text-sapin">Le responsable du traitement des données est :</p>
        <p className="mb-2 text-sapin">Récoltéo</p>
        <p className="mb-2 text-sapin">Responsable : Lucie Curtatone</p>
        <p className="mb-2 text-sapin">Adresse : 6 rue du Bac, 38190 Villard Bonnot</p>
        <p className="mb-2 text-sapin">Email : digitalbylucie@gmail.com</p>
        <p className="mb-2 text-sapin">Plateforme : Récoltéo</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">2. Hébergement</h2>
        <p className="mb-4 text-sapin">La plateforme Récoltéo est hébergée par : Vercel Inc. 440 N Barranca Ave #4133 Covina, CA 91723 États Unis.</p>
        <p className="mb-4 text-sapin">Les données peuvent être hébergées ou transférées en dehors de l’Union européenne. Dans ce cas, Vercel met en place des garanties conformes au RGPD, notamment les clauses contractuelles types approuvées par la Commission européenne.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">3. Délégué à la protection des données</h2>
        <p className="mb-4 text-sapin">Récoltéo n’est pas tenu de désigner un Délégué à la Protection des Données (DPO).</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">4. Données collectées</h2>
        <p className="mb-2 text-sapin">Dans le cadre de l’utilisation de la plateforme, Récoltéo peut collecter les données suivantes :</p>
        <div className="grid gap-4">
          <div>
            <p className="font-semibold text-sapin">Données d’identification</p>
            <ul className="list-disc list-inside ml-4">
              <li className="text-sapin">Nom</li>
              <li className="text-sapin">Prénom</li>
              <li className="text-sapin">Adresse email</li>
              <li className="text-sapin">Adresse postale</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sapin">Données professionnelles</p>
            <ul className="list-disc list-inside ml-4">
              <li className="text-sapin">Nom de l’entreprise</li>
              <li className="text-sapin">Numéro SIRET</li>
              <li className="text-sapin">Informations relatives à l’activité professionnelle</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sapin">Données de compte</p>
            <ul className="list-disc list-inside ml-4">
              <li className="text-sapin">Identifiants de connexion</li>
              <li className="text-sapin">Informations de profil utilisateur</li>
              <li className="text-sapin">Historique des interactions sur la plateforme</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sapin">Données techniques</p>
            <ul className="list-disc list-inside ml-4">
              <li className="text-sapin">Adresse IP</li>
              <li className="text-sapin">Données de connexion</li>
              <li className="text-sapin">Cookies techniques nécessaires au fonctionnement du site</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">5. Finalités du traitement</h2>
        <p className="mb-2 text-sapin">Les données personnelles sont collectées afin de :</p>
        <ul className="list-disc list-inside ml-4">
          <li className="text-sapin">créer et gérer les comptes utilisateurs ;</li>
          <li className="text-sapin">permettre la mise en relation entre commerces et associations ;</li>
          <li className="text-sapin">assurer le bon fonctionnement de la plateforme ;</li>
          <li className="text-sapin">gérer les échanges et demandes entre utilisateurs ;</li>
          <li className="text-sapin">sécuriser les comptes et prévenir les fraudes ;</li>
          <li className="text-sapin">gérer les paiements et abonnements éventuels ;</li>
          <li className="text-sapin">respecter les obligations légales et réglementaires.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">6. Base légale du traitement</h2>
        <ul className="list-disc list-inside ml-4">
          <li className="text-sapin">l’exécution du contrat entre Récoltéo et l’utilisateur ;</li>
          <li className="text-sapin">le respect des obligations légales ;</li>
          <li className="text-sapin">l’intérêt légitime de Récoltéo à assurer la sécurité et le bon fonctionnement de la plateforme ;</li>
          <li className="text-sapin">le consentement de l’utilisateur lorsque celui-ci est requis.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">7. Paiements et prestataires tiers</h2>
        <p className="mb-4 text-sapin">Les paiements réalisés sur la plateforme sont traités via Stripe. Récoltéo ne stocke pas les données bancaires complètes des utilisateurs. Les informations de paiement sont traitées directement par Stripe conformément à leur propre politique de confidentialité.</p>
        <p className="mb-4 text-sapin">Récoltéo peut également faire appel à des prestataires techniques pour : l’hébergement du site, la maintenance, la sécurisation des services et l’envoi d’emails transactionnels. Ces prestataires n’accèdent aux données que dans la mesure nécessaire à leurs missions.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">8. Cookies</h2>
        <p className="mb-4 text-sapin">Le site utilise uniquement des cookies techniques indispensables au fonctionnement de la plateforme. Ces cookies permettent notamment : la connexion sécurisée au compte utilisateur, le maintien de session, le bon affichage du site et la sécurité du service. Aucun cookie publicitaire ou de suivi marketing n’est utilisé.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">9. Durée de conservation des données</h2>
        <p className="mb-4 text-sapin">Les données personnelles sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées. À titre indicatif :</p>
        <ul className="list-disc list-inside ml-4">
          <li className="text-sapin">les données de compte sont conservées pendant la durée d’activité du compte ;</li>
          <li className="text-sapin">certaines données peuvent être conservées plus longtemps afin de respecter des obligations légales ou fiscales ;</li>
          <li className="text-sapin">les données peuvent être supprimées à la demande de l’utilisateur, sous réserve des obligations légales applicables.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">10. Sécurité des données</h2>
        <p className="mb-4 text-sapin">Récoltéo met en œuvre des mesures techniques et organisationnelles appropriées afin de protéger les données personnelles contre l’accès non autorisé, la divulgation, la modification, la perte ou la destruction.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">11. Droits des utilisateurs</h2>
        <p className="mb-2 text-sapin">Conformément au RGPD, les utilisateurs disposent des droits suivants :</p>
        <ul className="list-disc list-inside ml-4">
          <li className="text-sapin">droit d’accès ;</li>
          <li className="text-sapin">droit de rectification ;</li>
          <li className="text-sapin">droit à l’effacement ;</li>
          <li className="text-sapin">droit à la limitation du traitement ;</li>
          <li className="text-sapin">droit d’opposition ;</li>
          <li className="text-sapin">droit à la portabilité des données ;</li>
          <li className="text-sapin">droit de retirer leur consentement à tout moment.</li>
        </ul>
        <p className="mb-4 text-sapin">Les utilisateurs peuvent exercer leurs droits en contactant : Email : digitalbylucie@gmail.com. Les utilisateurs disposent également du droit d’introduire une réclamation auprès d’une autorité de contrôle compétente, notamment auprès de la Commission nationale de l'informatique et des libertés.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-sapin">12. Modification de la politique</h2>
        <p className="mb-4 text-sapin">Récoltéo se réserve le droit de modifier la présente politique de confidentialité à tout moment afin de refléter les évolutions légales, réglementaires ou techniques. Les utilisateurs seront informés des modifications importantes via la plateforme ou par email.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3 text-sapin">13. Contact</h2>
        <p className="text-sapin">Pour toute question relative à la présente politique de confidentialité ou au traitement des données personnelles :</p>
        <p className="mb-2 text-sapin">Récoltéo</p>
        <p className="mb-2 text-sapin">Responsable : Lucie Curtatone</p>
        <p className="mb-2 text-sapin">Email : digitalbylucie@gmail.com</p>
        <p className="mb-2 text-sapin">Adresse : 6 rue du Bac, 38190, Villard Bonnot</p>
      </section>
    </main>
  );
}
