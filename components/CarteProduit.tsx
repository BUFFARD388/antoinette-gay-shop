import Link from "next/link";
import { type Produit } from "@/lib/produits";
import Sceau from "./Sceau";
import PhotoZoom from "./PhotoZoom";

type Props = {
  produit: Produit;
  quantite: number;
  compteur: number;
  onAjouter: () => void;
  onRetirer: () => void;
};

// Pas de vraie photo produit pour l'instant (public/images est vide) : on
// affiche le sceau de la Maison sur fond couleur plutot qu'une image cassee.
// Des que tu as de vraies photos, remplace ce bloc par <Image src={produit.image} ... />.
// Quand une photo existe, elle s'agrandit en plein écran au clic (PhotoZoom,
// ajouté le 02/09/2026, à la demande de Laurent).
export default function CarteProduit({ produit, quantite, compteur, onAjouter, onRetirer }: Props) {
  const pourcentage =
    produit.editionLimitee !== null
      ? Math.min(100, Math.round((compteur / produit.editionLimitee) * 100))
      : null;

  const premierePhoto = produit.photos && produit.photos.length > 0 ? produit.photos[0] : null;

  return (
    <div style={carte}>
      <div style={{ position: "relative", ...(premierePhoto ? visuelPhoto : visuel) }}>
        {premierePhoto ? (
          <PhotoZoom src={premierePhoto} alt={produit.nom} style={imgPhoto} />
        ) : (
          <Sceau taille={64} couleur="#F3ECDA" />
        )}
        {premierePhoto && produit.photosGenereesParIA && (
          <span style={badgeIA}>Visuel généré par IA</span>
        )}
      </div>

      <p style={labelCuvee}>
        {produit.cuvee} <span style={puceCategorie}>·</span> {produit.categorie}
      </p>
      <h3 style={{ fontFamily: "var(--font-display), Georgia, serif", margin: "4px 0 2px" }}>
        {produit.nom}
      </h3>
      {produit.mention && <p style={mentionStyle}>{produit.mention}</p>}
      <p style={{ fontSize: 14, lineHeight: 1.5, minHeight: 66, margin: "8px 0 0" }}>
        {produit.description}
      </p>

      {produit.signature && (
        <p style={{ ...ligneSignature, borderLeftColor: produit.signature.couleur, color: produit.signature.couleur }}>
          « {produit.signature.texte} »
        </p>
      )}

      <Link href={`/produits/${produit.slug}`} style={lienDetail}>
        {produit.type === "coffret" ? "Voir la composition" : "Se déguste en gin tonic ou en cocktail →"}
      </Link>

      <p style={{ fontSize: 13, color: "#5b6f63", margin: "10px 0 4px" }}>
        {produit.format} — {produit.degre}% vol
      </p>
      <p style={{ fontWeight: 600, margin: "0 0 12px" }}>
        {(produit.prix / 100).toFixed(2)} € <span style={{ fontWeight: 400, fontSize: 12 }}>indicatif</span>
      </p>

      {produit.editionLimitee !== null && (
        <div style={{ marginBottom: 14 }}>
          <div style={barreFond}>
            <div style={{ ...barreRemplie, width: `${pourcentage}%` }} />
          </div>
          <p style={{ fontSize: 12, color: "#5b6f63", margin: "6px 0 0" }}>
            {compteur} précommandée{compteur > 1 ? "s" : ""} sur {produit.editionLimitee}
          </p>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onRetirer} style={btnQte} aria-label={`Retirer ${produit.nom}`}>
          −
        </button>
        <span style={{ minWidth: 20, textAlign: "center" }}>{quantite}</span>
        <button onClick={onAjouter} style={btnQte} aria-label={`Ajouter ${produit.nom}`}>
          +
        </button>
      </div>
    </div>
  );
}

const carte: React.CSSProperties = {
  border: "1px solid #C9971F",
  padding: 24,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
};

const visuel: React.CSSProperties = {
  width: "100%",
  height: 200,
  marginBottom: 16,
  background: "linear-gradient(135deg, #1F3D2E, #2c5641)",
  color: "#F3ECDA",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const visuelPhoto: React.CSSProperties = {
  width: "100%",
  height: 200,
  marginBottom: 16,
  overflow: "hidden",
  background: "linear-gradient(135deg, #1F3D2E, #2c5641)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imgPhoto: React.CSSProperties = {
  maxWidth: "88%",
  maxHeight: "88%",
  objectFit: "contain",
  display: "block",
};

// Mention de transparence ajoutée le 03/09/2026 : Laurent utilise des
// visuels générés par IA en attendant les vraies photos des bouteilles
// étiquetées. Affichée directement sur l'image, là où elle est la plus
// utile (pas seulement dans les mentions légales).
const badgeIA: React.CSSProperties = {
  position: "absolute",
  bottom: 8,
  right: 8,
  fontSize: 10.5,
  letterSpacing: 0.3,
  color: "#fff",
  background: "rgba(31, 61, 46, 0.72)",
  padding: "3px 8px",
  borderRadius: 2,
};

const ligneSignature: React.CSSProperties = {
  fontSize: 12.5,
  lineHeight: 1.5,
  fontStyle: "italic",
  margin: "12px 0 0",
  paddingLeft: 12,
  borderLeft: "2px solid",
};

const lienDetail: React.CSSProperties = {
  display: "inline-block",
  fontSize: 12.5,
  color: "#93670f",
  textDecoration: "none",
  margin: "10px 0 0",
};

const labelCuvee: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: 1,
  color: "#C9971F",
  margin: 0,
  textTransform: "uppercase",
};

const puceCategorie: React.CSSProperties = {
  color: "#c9b98a",
};

const mentionStyle: React.CSSProperties = {
  fontSize: 12.5,
  fontStyle: "italic",
  color: "#5b6f63",
  margin: "0 0 8px",
};

const barreFond: React.CSSProperties = {
  width: "100%",
  height: 6,
  background: "#eee4cc",
};

const barreRemplie: React.CSSProperties = {
  height: "100%",
  background: "#C9971F",
};

const btnQte: React.CSSProperties = {
  width: 32,
  height: 32,
  border: "1px solid #1F3D2E",
  background: "#fff",
  cursor: "pointer",
};