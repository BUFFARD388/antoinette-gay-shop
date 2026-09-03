"use client";

import { useState } from "react";
import PhotoZoom from "./PhotoZoom";

type Props = {
  photos: string[];
  nom: string;
  genereParIA?: boolean; // affiche une mention "Visuel généré par IA" (transparence, ajouté le 03/09/2026)
};

// Galerie de la page produit : une grande photo + une rangée de vignettes
// cliquables dès qu'il y a plusieurs photos (1 à 3 vues d'une même bouteille).
// Avec une seule photo, les vignettes n'apparaissent pas — comportement
// identique à l'ancien affichage à photo unique.
// La grande photo s'agrandit en plein écran au clic (PhotoZoom, ajouté le
// 02/09/2026) ; les vignettes, elles, changent seulement la photo affichée.
export default function GalerieProduit({ photos, nom, genereParIA }: Props) {
  const [index, setIndex] = useState(0);
  const photoActive = photos[index] ?? photos[0];

  return (
    <div>
      <div style={{ position: "relative", ...visuelPhoto }}>
        <PhotoZoom src={photoActive} alt={nom} style={imgPhoto} />
        {genereParIA && <span style={badgeIA}>Visuel généré par IA</span>}
      </div>

      {photos.length > 1 && (
        <div style={vignettesRangee}>
          {photos.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              style={{ ...vignetteBouton, borderColor: i === index ? "#C9971F" : "transparent" }}
              aria-label={`Voir la photo ${i + 1} de ${nom}`}
              aria-pressed={i === index}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" style={vignetteImg} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const visuelPhoto: React.CSSProperties = {
  height: 220,
  overflow: "hidden",
  background: "linear-gradient(155deg, #1F3D2E, #2c5641)",
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

// Même mention de transparence que sur les cartes de la page d'accueil
// (composants/CarteProduit.tsx) — voir le commentaire là-bas.
const badgeIA: React.CSSProperties = {
  position: "absolute",
  bottom: 10,
  right: 10,
  fontSize: 11,
  letterSpacing: 0.3,
  color: "#fff",
  background: "rgba(31, 61, 46, 0.72)",
  padding: "4px 9px",
  borderRadius: 2,
};

const vignettesRangee: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginTop: 10,
};

const vignetteBouton: React.CSSProperties = {
  width: 48,
  height: 48,
  flexShrink: 0,
  padding: 2,
  border: "2px solid transparent",
  borderRadius: 2,
  cursor: "pointer",
  background: "linear-gradient(155deg, #1F3D2E, #2c5641)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const vignetteImg: React.CSSProperties = {
  maxWidth: "88%",
  maxHeight: "88%",
  objectFit: "contain",
  display: "block",
};