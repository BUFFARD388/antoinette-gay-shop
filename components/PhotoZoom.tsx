"use client";

import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  // Style appliqué à la vignette (taille normale, dans la carte ou la galerie).
  style?: React.CSSProperties;
};

// Petite visionneuse plein écran : au clic sur une photo (bouteille ou
// coffret), une version agrandie s'ouvre par-dessus la page. Ajoutée le
// 02/09/2026 à la demande de Laurent, pour les photos produit sur les
// fiches (GalerieProduit) et les cartes de la page d'accueil (CarteProduit).
export default function PhotoZoom({ src, alt, style }: Props) {
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    if (!ouvert) return;
    const surEchap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    document.addEventListener("keydown", surEchap);
    // Empêche la page de défiler derrière la visionneuse ouverte.
    const overflowInitial = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", surEchap);
      document.body.style.overflow = overflowInitial;
    };
  }, [ouvert]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ ...style, cursor: "zoom-in" }}
        onClick={() => setOuvert(true)}
        role="button"
        tabIndex={0}
        aria-label={`Agrandir la photo : ${alt}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOuvert(true);
          }
        }}
      />

      {ouvert && (
        <div
          style={fond}
          onClick={() => setOuvert(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo agrandie : ${alt}`}
        >
          <button
            type="button"
            onClick={() => setOuvert(false)}
            style={boutonFermer}
            aria-label="Fermer la photo agrandie"
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            style={imgAgrandie}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

const fond: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 26, 20, 0.92)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  cursor: "zoom-out",
  padding: 24,
};

const imgAgrandie: React.CSSProperties = {
  maxWidth: "90vw",
  maxHeight: "90vh",
  objectFit: "contain",
  cursor: "default",
  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
};

const boutonFermer: React.CSSProperties = {
  position: "fixed",
  top: 20,
  right: 24,
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(243,236,218,0.5)",
  background: "rgba(255,255,255,0.08)",
  color: "#F3ECDA",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};