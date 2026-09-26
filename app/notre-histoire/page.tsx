import Link from "next/link";
import { NOM_MAISON } from "@/lib/config";
import { getProduitBySlug } from "@/lib/produits";
import Sceau from "@/components/Sceau";
import PhotoZoom from "@/components/PhotoZoom";

// Titre enrichi le 02/09/2026 pour le référencement (recherches "Passage
// Gay", "Tour Métallique de Lyon", "Fourvière") — la description contenait
// déjà "Fourvière" mais pas "Passage Gay" ni "Tour Métallique", pourtant
// très présents dans le texte réel de la page ci-dessous.
export const metadata = {
  title: `Du Passage Gay à la Tour Métallique de Lyon — Notre Histoire | ${NOM_MAISON}`,
  description:
    "1861, la colline de Fourvière et le Passage Gay, tout près de la Tour Métallique de Lyon : l'histoire vraie derrière Maison Antoinette Gay, quatre générations plus tard.",
  alternates: {
    canonical: "/notre-histoire",
  },
};

// Page restructurée en 4 parties le 23/08/2026, sur remarques éditoriales de
// Laurent (sous-titres punchy, "mot du fondateur" fusionnant les anciens
// paragraphes Pauline + "Pourquoi cette distillerie", présentation des
// cuvées et du calendrier plus concises). Laurent avait rédigé ce texte avec
// des emoji comme repères visuels (🍏🪵🎄 pour les cuvées, 📋🛠️🚀 pour le
// calendrier) ; sur sa confirmation, on garde l'esprit "repère fort" mais en
// reprenant le style déjà en place sur le site (petits labels or, sans
// emoji), pour rester cohérent avec le reste de la Maison.
//
// Texte transcrit du dos des étiquettes (fournies par Laurent le 23/08/2026)
// pour la partie 1 (Pierre Gay, 1861-1894).
//
// Mise à jour du 21/09/2026 : Laurent a fourni un second texte d'histoire
// ("Du Panorama de Fourvière à l'Art du Gin"), à fusionner avec celui déjà
// en place. Repris ici : Pierre Gay présenté comme pionnier de la "plus
// belle vue de Lyon" avant même la création du Passage Gay, les "cures de
// raisin" qu'il organisait, la précision des dates de construction de la
// Tour Métallique (1892-1894), le détail technique de l'alambic (cuivre,
// 30L, colonne à plateaux + panier à gin) intégré à la citation de Laurent
// (passé de "nous"/"notre" à "je"/"mon" pour rester cohérent avec le reste
// de la citation, qui est à la première personne), l'image de la rhubarbe
// en écho à la "droiture" de la tour familiale, et la phrase de clôture
// "panorama en bouteille". Généalogie vérifiée cohérente entre les deux
// textes : Pierre et Antoinette sont les parents de Pauline (arrière-
// grand-mère de Laurent), donc bien les arrière-arrière-grands-parents de
// Laurent — le texte fourni confirme ce lien sans le contredire.

const ETAPES = [
  {
    periode: "Aujourd'hui",
    texte: "Finalisation des autorisations légales et douanières (statut d'entrepositaire agréé).",
  },
  {
    periode: "Fin 2026",
    texte: "Installation de notre alambic et aménagement de l'atelier de production.",
  },
  {
    periode: "Début 2027",
    texte: "Première distillation, mise en bouteille et expédition de votre série numérotée.",
  },
];

// Photos d'archive du vrai Passage Gay, fournies par Laurent le 23/08/2026.
// 3 documents supplémentaires fournis par Laurent le 21/09/2026 (photos de
// documents de famille) : légèrement retouchés avant intégration (recadrage
// du bois de la table et correction de l'éclairage pour la carte Buchin-Gay,
// nettoyage/renforcement du contraste pour la gravure et la photo de la
// tour, aucune n'a été recadrée sur son contenu). La carte "Buchin-Gay,
// Propriétaire" porte le même nom que Pauline Gay Bûchin (voir la partie
// "Le mot du fondateur" plus bas) — mentionné tel quel dans la légende,
// sans reformuler le récit familial au-delà de ce que confirme ce document.
// Le 26/09/2026, Laurent a renvoyé 5 photos supplémentaires en pensant les
// ajouter : 4 d'entre elles étaient en fait déjà sur le site (3 déjà dans
// cette galerie depuis le 23/08/2026 — `histoire-batiment.jpg`,
// `histoire-carte-postale.jpg`, `histoire-entree.jpg` — et le portrait de
// Pauline Gay Bûchin, déjà utilisé plus bas sur cette page). Seule la photo
// de la terrasse du restaurant Gay était réellement nouvelle, ajoutée ici.
const GALERIE = [
  { src: "/images/histoire-photo-tour-metallique.jpg", legende: "La Tour Métallique de Fourvière, telle que la connaissaient Pierre et Antoinette." },
  { src: "/images/histoire-gravure-observatoire.jpg", legende: "« Observatoire & Passage Gay » — l'annonce d'époque promettant « le plus riche et le plus varié » des panoramas." },
  { src: "/images/histoire-carte-buchin-gay.jpg", legende: "Carte de la Tour Métallique, au nom de Buchin-Gay — le même nom que Pauline Gay Bûchin." },
  { src: "/images/histoire-batiment.jpg", legende: "Entrée principale de la Tour Métallique." },
  { src: "/images/histoire-carte-postale.jpg", legende: "« Antiquités du Passage Gay » — carte postale d'époque." },
  { src: "/images/histoire-entree.jpg", legende: "L'entrée du Passage Gay — restaurant, observatoire, vue merveilleuse." },
  { src: "/images/histoire-terrasse-restaurant-gay.jpg", legende: "« La Terrasse du Restaurant Gay » — le plus beau panorama de Lyon, à table." },
];

// Résumés punchy par cuvée pour cette page (distincts de `signature` dans
// lib/produits.ts, qui reste la phrase de clôture imprimée au dos de la
// bouteille). Texte fourni par Laurent le 23/08/2026, mis à jour le
// 02/09/2026 suite au renommage Cuvée II "Le Secret d'Antoinette" (et
// correction Ouest → nord de Lyon) et Cuvée III "Le Vœu de Fourvière", puis
// "Le Vœu d'Antoinette" le 26/09/2026 (voir lib/produits.ts) — le texte
// ci-dessous ne cite pas le nom du produit donc n'a pas eu besoin de changer.
const CUVEES_RESUME = [
  {
    slug: "fragola",
    texte: "Un hommage aux cures de raisin d'autrefois. Nous redistillons le fruit de ce terroir historique.",
  },
  {
    slug: "rhubarbe",
    texte: "Tension vive et fraîcheur brute d'un jardin secret au nord de Lyon — hommage à la droiture de notre tour familiale.",
  },
  {
    slug: "decembre",
    texte: "Un hommage au vœu fait à Notre-Dame de Fourvière, tout près du Passage Gay, que Lyon célèbre chaque 8 décembre.",
  },
];

export default function PageHistoire() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 80px" }}>
      <header style={{ textAlign: "center", padding: "32px 0 8px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <Sceau taille={64} couleur="#1F3D2E" />
        </div>
        <p style={eyebrow}>Notre Histoire</p>
        <h1 style={{ fontFamily: "var(--font-display), Georgia, serif", fontStyle: "italic", fontSize: 38, margin: "16px 0" }}>
          Pourquoi Maison Antoinette Gay
        </h1>
      </header>

      {/* Partie 1 — L'histoire de la Maison, 1861-1894 */}
      <section style={{ marginTop: 24 }}>
        <p style={eyebrow}>1861 — 1894</p>
        <h2 style={{ ...titre, margin: "8px 0 12px" }}>
          De Fourvière à la Tour Métallique : l&apos;héritage d&apos;Antoinette
        </h2>
        <p style={paragraphe}>
          Tout commence en 1861. Notre arrière-arrière-grand-père, Pierre Gay, fut l&apos;un des
          tout premiers à faire découvrir la colline de Fourvière aux voyageurs, gravissant les
          pentes avec eux pour leur montrer ce qu&apos;il appelait fièrement « la plus belle vue de
          Lyon ». Cette passion pour les hauteurs donne bientôt naissance au « Passage Gay », un
          lieu unique mêlant curiosités, restaurant et un jardin suspendu nommé l&apos;Angélique —
          où Pierre organisait même des « cures de raisin », célébrant la générosité des fruits de
          ce terroir.
        </p>
        <p style={{ ...paragraphe, marginTop: 16 }}>
          En 1878, à la mort de Pierre, sa veuve Antoinette Gay reprend seule les rênes. Femme de
          caractère et visionnaire, c&apos;est elle qui négocie en 1891 la cession du terrain, avant
          que notre famille ne participe activement à l&apos;aventure de la construction de la Tour
          Métallique de Fourvière (1892-1894), cette tour de fer forgé qui domine encore aujourd&apos;hui
          le ciel lyonnais. Antoinette y installe le restaurant familial au pied de ce monument
          qu&apos;elle a rendu possible, et prend soin, dans les jardins suspendus de la colline, de
          la terre et de l&apos;art de recevoir.
        </p>
        <p style={{ ...paragraphe, marginTop: 16 }}>
          Si nos ancêtres ne distillaient pas encore, ils nous ont légué le plus précieux des
          héritages : l&apos;amour fou de notre région, le respect des fruits et le sens de
          l&apos;accueil. C&apos;est cet esprit, et ce nom, celui d&apos;Antoinette Gay, que notre
          distillerie fait revivre aujourd&apos;hui.
        </p>
      </section>

      {/* Zoom plein écran ajouté le 21/09/2026 sur demande de Laurent, même
          composant (PhotoZoom) que sur les photos produit (GalerieProduit,
          CarteProduit) — clic pour agrandir, Échap ou clic dehors pour
          fermer. */}
      <section style={{ marginTop: 40 }}>
        <div style={galerieGrille}>
          {GALERIE.map((photo) => (
            <figure key={photo.src} style={{ margin: 0 }}>
              <PhotoZoom src={photo.src} alt={photo.legende} style={galerieImg} />
              <figcaption style={galerieLegende}>{photo.legende}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Partie 2 — Le mot du fondateur (fusionne les anciens paragraphes
          Pauline et "Pourquoi cette distillerie") */}
      <section style={{ marginTop: 48 }}>
        <p style={eyebrow}>Le mot du fondateur</p>
        <h2 style={{ ...titre, margin: "8px 0 20px" }}>
          Le jardin d&apos;Antoinette dans chaque bouteille
        </h2>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "0 0 140px" }}>
            <figure style={{ margin: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/pauline-portrait.jpg" alt="Pauline Gay Bûchin" style={portraitImg} />
              <figcaption style={galerieLegende}>Pauline Gay Bûchin, arrière-grand-mère de Laurent.</figcaption>
            </figure>
            <figure style={{ margin: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/laurent-portrait.jpg" alt="Laurent" style={portraitImg} />
              <figcaption style={galerieLegende}>Laurent, aujourd&apos;hui.</figcaption>
            </figure>
          </div>
          <div style={{ flex: "1 1 280px" }}>
            <div style={citationBloc}>
              <p style={citationTexte}>
                Pauline, la fille d&apos;Antoinette, est devenue mon arrière-grand-mère. C&apos;est
                sa fille, Lauraine, qui m&apos;a élevé. En retrouvant les vieilles photos de famille
                oubliées dans un tiroir, une évidence m&apos;a frappé : cette histoire lyonnaise
                méritait de revivre.
              </p>
              <p style={{ ...citationTexte, marginTop: 16 }}>
                Amateur de spiritueux, j&apos;ai voulu faire infuser cet héritage familial dans des
                gins artisanaux. Sans formation initiale, j&apos;apprends l&apos;art de la
                distillation essai après essai, cuvée après cuvée, à l&apos;aide de mon alambic à
                colonne à plateaux et de mon panier à gin.
              </p>
              <p style={{ ...citationTexte, marginTop: 16 }}>
                Mon but ? Vous proposer un gin d&apos;exception, distillé au nord de Lyon avec le
                genièvre et les fruits frais de notre jardin.
              </p>
            </div>
            <p style={{ ...signatureNom, margin: "16px 0 0 0" }}>— Laurent, Fondateur</p>
          </div>
        </div>
      </section>

      {/* Partie 3 — Les trois cuvées */}
      <section style={{ marginTop: 48 }}>
        <h2 style={titre}>Trois cuvées, trois clins d&apos;œil à l&apos;histoire</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
          {CUVEES_RESUME.map((item) => {
            const p = getProduitBySlug(item.slug);
            if (!p) return null;
            return (
              <Link key={p.slug} href={`/produits/${p.slug}`} style={carteCuvee}>
                <p style={{ fontSize: 11.5, letterSpacing: 1, textTransform: "uppercase", color: "#93670f", margin: 0 }}>
                  {p.cuvee} — {p.nom}
                </p>
                <p style={{ fontStyle: "italic", fontSize: 14.5, lineHeight: 1.6, margin: "8px 0 0", color: p.accent }}>
                  {item.texte}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Partie 4 — Le calendrier */}
      <section style={{ marginTop: 48 }}>
        <h2 style={titre}>Le chemin jusqu&apos;à votre table</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
          {ETAPES.map((etape) => (
            <div key={etape.periode} style={ligneEtape}>
              <p style={periodeEtape}>{etape.periode}</p>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>{etape.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Phrase de clôture — reprise du second texte d'histoire fourni par
          Laurent le 21/09/2026, en écho au thème du panorama filé dès la
          partie 1 (Pierre, pionnier de "la plus belle vue de Lyon"). */}
      <section style={{ marginTop: 56, textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontStyle: "italic",
            fontSize: 20,
            lineHeight: 1.6,
            color: "#1F3D2E",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          Hier, nous vous partagions le plus beau panorama de Lyon.
          <br />
          Aujourd&apos;hui, nous mettons ce panorama en bouteille.
        </p>
      </section>
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
  fontSize: 24,
  marginBottom: 12,
};

const paragraphe: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, margin: 0 };

const citationBloc: React.CSSProperties = {
  borderLeft: "2px solid #C9971F",
  paddingLeft: 20,
};

const citationTexte: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.75,
  margin: 0,
  fontStyle: "italic",
  color: "#1F3D2E",
};

const signatureNom: React.CSSProperties = {
  fontFamily: "var(--font-display), Georgia, serif",
  fontStyle: "italic",
  fontSize: 14,
  color: "#5b6f63",
  margin: "10px 0 0 22px",
};

const galerieGrille: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 18,
};

const galerieImg: React.CSSProperties = {
  width: "100%",
  height: 200,
  objectFit: "cover",
  display: "block",
  border: "1px solid #e3d3a4",
};

const portraitImg: React.CSSProperties = {
  width: "100%",
  height: 190,
  objectFit: "cover",
  objectPosition: "top center",
  display: "block",
  border: "1px solid #e3d3a4",
};

const galerieLegende: React.CSSProperties = {
  fontSize: 12,
  color: "#5b6f63",
  marginTop: 8,
  lineHeight: 1.5,
};

const carteCuvee: React.CSSProperties = {
  display: "block",
  border: "1px solid #e3d3a4",
  background: "#fff",
  padding: "16px 20px",
  textDecoration: "none",
  color: "inherit",
};

const ligneEtape: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "180px 1fr",
  gap: 16,
  borderTop: "1px solid #e3d3a4",
  paddingTop: 14,
};

const periodeEtape: React.CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  letterSpacing: 0.5,
  textTransform: "uppercase",
  color: "#93670f",
};
