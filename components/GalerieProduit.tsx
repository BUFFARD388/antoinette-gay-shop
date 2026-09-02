"use client";

import { useState } from "react";

type Props = {
  photos: string[];
  nom: string;
};

// Galerie de la page produit : une grande photo + une rangée de vignettes
// cliquables dès qu'il y a plusieurs photos (1 à 3 vues d'une même bouteille).
// Avec une seule photo, les vignettes n'apparaissent pas — comportement
// identique à l'ancien affichage à photo unique.
export default function GalerieProduit({ photos, nom }: Props) {
  const [index, setIndex] = useState(0);
  const photoActive = photos[index] ?? photos[0];

  return (
    <div>
      <div style={visuelPhoto}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoActive} alt={nom} style={imgPhoto} />
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
