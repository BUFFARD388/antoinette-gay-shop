import {
  NOM_MAISON,
  EMAIL_CONTACT,
  TELEPHONE_CONTACT,
  ADRESSE_MAISON,
  DIRECTEUR_PUBLICATION,
  NOM_DOMAINE,
  SIREN,
  HEBERGEUR_NOM,
  HEBERGEUR_ADRESSE,
} from "@/lib/config";

export const metadata = {
  title: `Réglementation & mentions légales — ${NOM_MAISON}`,
  description: "Cadre légal de la vente d'alcool en ligne et mentions légales du site.",
  alternates: {
    canonical: "/reglementation",
  },
};

// Contenu informatif, pas un avis juridique. Sources principales (Direction
// générale des douanes et droits indirects, LCEN/SREN) citées en bas de page.
//
// Coordonnées de l'éditeur (lib/config.ts) fournies par Laurent le
// 23/08/2026. Le SIREN (401 801 204) a été confirmé le 26/08/2026 par le
// compte-rendu d'entretien avec les douanes ; Laurent a précisé que seul le
// SIREN (9 chiffres) est obligatoire dans les mentions légales, pas le
// SIRET complet (14 chiffres) — c'est donc le SIREN qui est affiché.
// Reste à vérifier avec Laurent avant l'ouverture publique :
//   - Forme juridique et numéro RCS n'ont pas été fournis : à ajouter une
//     fois la structure juridique de la Maison immatriculée (le champ reste
//     marqué [À COMPLÉTER] ci-dessous).

export default function PageReglementation() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 80px" }}>
      <header style={{ textAlign: "center", padding: "32px 0 8px" }}>
        <p style={eyebrow}>Transparence</p>
        <h1 style={{ fontFamily: "var(--font-display), Georgia, serif", fontStyle: "italic", fontSize: 34, margin: "16px 0" }}>
          Réglementation &amp; mentions légales
        </h1>
      </header>

      <section style={{ marginTop: 24 }}>
        <h2 style={titre}>Pourquoi une précommande sans paiement</h2>
        <p style={paragraphe}>
          Vendre de l&apos;alcool en France, y compris en ligne, nécessite un permis d&apos;exploitation
          (licence de vente à emporter) ainsi que le statut d&apos;<strong>entrepositaire agréé</strong> auprès
          de la douane, qui autorise à produire, détenir et expédier des boissons soumises à accise. Ce
          statut est en cours d&apos;obtention pour la Maison, et la production ne démarrera qu&apos;une fois
          l&apos;atelier prêt, courant 2027. C&apos;est pourquoi la précommande actuelle ne prend aucun
          paiement : c&apos;est une réservation de priorité, pas une vente. Le vrai paiement n&apos;interviendra
          qu&apos;une fois la Maison en règle.
        </p>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2 style={titre}>Le cadre légal de la vente d&apos;alcool en ligne</h2>
        <ul style={liste}>
          <li>
            <strong>Permis d&apos;exploitation</strong> — un site marchand d&apos;alcool est juridiquement
            assimilé à un débit de boissons à emporter et nécessite cette licence.
          </li>
          <li>
            <strong>Statut d&apos;entrepositaire agréé</strong> — délivré par la douane, il permet de
            produire et expédier de l&apos;alcool en suspension de droits d&apos;accise. Dossier à déposer
            auprès du bureau de douane compétent (identification de l&apos;entreprise, plans des locaux,
            SIRET, garantie financière).
          </li>
          <li>
            <strong>Déclaration de vente à distance (VAD)</strong> — chaque envoi à un particulier
            français doit être accompagné d&apos;un document commercial portant la mention
            &laquo;&nbsp;ventes à distance de produits soumis à accise&nbsp;&raquo;.
          </li>
          <li>
            <strong>Vérification d&apos;âge</strong> — obligatoire avant tout accès au site et avant toute
            commande, déjà en place ici.
          </li>
          <li>
            <strong>Zone de livraison</strong> — limitée à la France pour l&apos;instant. Expédier vers
            d&apos;autres pays de l&apos;UE impose de traiter la TVA (régime OSS) et les droits d&apos;accise du
            pays de destination, les règles n&apos;étant pas harmonisées au sein de l&apos;UE.
          </li>
          <li>
            <strong>Transporteur</strong> — toutes les offres standard n&apos;acceptent pas l&apos;alcool ; à
            vérifier auprès du transporteur retenu (Colissimo Pro, Chronopost...).
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2 style={titre}>Données personnelles</h2>
        <p style={paragraphe}>
          Le formulaire de précommande collecte ton email et, si tu le renseignes, ton prénom et ton
          téléphone. Ces informations servent uniquement à te recontacter au sujet de ta précommande et
          ne sont partagées avec aucun tiers. [À COMPLÉTER] Une politique de confidentialité complète
          (durée de conservation, droit d&apos;accès et de suppression RGPD) sera ajoutée avant l&apos;ouverture
          publique du site.
        </p>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2 style={titre}>Mentions légales</h2>
        <ul style={liste}>
          <li>
            <strong>Éditeur du site</strong> — {NOM_MAISON}, {DIRECTEUR_PUBLICATION}. Forme juridique
            et numéro RCS : [À COMPLÉTER] une fois la structure juridique de la Maison immatriculée.
            SIREN : {SIREN}. Adresse : {ADRESSE_MAISON}.
          </li>
          <li>
            <strong>Directeur de la publication</strong> — {DIRECTEUR_PUBLICATION}.
          </li>
          <li>
            <strong>Contact</strong> — {TELEPHONE_CONTACT} ·{" "}
            <a href={`mailto:${EMAIL_CONTACT}`}>{EMAIL_CONTACT}</a>.
          </li>
          <li>
            <strong>Hébergeur</strong> — {HEBERGEUR_NOM}, {HEBERGEUR_ADRESSE}.
          </li>
          <li>
            <strong>Nom de domaine</strong> — {NOM_DOMAINE}
          </li>
          <li>
            Pour la partie e-commerce (une fois le vrai paiement actif) : conditions générales de
            vente, délais et modalités de livraison, droit de rétractation, médiateur de la
            consommation. [À COMPLÉTER]
          </li>
        </ul>
      </section>

      <p style={avertissement}>
        Cette page a une visée informative et ne constitue pas un avis juridique. Fais valider ce
        dispositif — précommande sans paiement, puis passage à la vente réelle en 2027 — par un
        professionnel (avocat, expert-comptable) avant l&apos;ouverture publique du site. Une question ?
        Écris à <a href={`mailto:${EMAIL_CONTACT}`}>{EMAIL_CONTACT}</a>.
      </p>

      <p style={sources}>
        Sources : Direction générale des douanes et droits indirects (douane.gouv.fr — démarches
        &laquo;&nbsp;Déclarer vos ventes en ligne d&apos;alcool&nbsp;&raquo; et &laquo;&nbsp;Obtenir
        l&apos;agrément d&apos;entrepositaire agréé&nbsp;&raquo;) ; loi LCEN du 21 juin 2004, modifiée par la
        loi SREN du 21 mai 2024, pour les mentions légales.
      </p>
    </main>
  );
}

const eyebrow: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "#93670f",
  margin: 0,
};

const titre: React.CSSProperties = {
  fontFamily: "var(--font-display), Georgia, serif",
  fontSize: 22,
  marginBottom: 12,
};

const paragraphe: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.7, margin: 0 };

const liste: React.CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.7,
  paddingLeft: 20,
  margin: "10px 0 0",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const avertissement: React.CSSProperties = {
  marginTop: 52,
  fontSize: 13,
  lineHeight: 1.6,
  color: "#5b6f63",
  borderTop: "1px solid #e3d3a4",
  paddingTop: 18,
};

const sources: React.CSSProperties = {
  marginTop: 14,
  fontSize: 12,
  lineHeight: 1.6,
  color: "#7c8d80",
};