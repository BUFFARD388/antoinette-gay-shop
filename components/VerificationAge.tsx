"use client";

import { useEffect, useState } from "react";
import Sceau from "@/components/Sceau";

// Bloque l'acces au site tant que le visiteur n'a pas confirme etre majeur.
// Obligatoire pour un site de vente d'alcool en France (Loi Evin).
// Le choix est retenu 30 jours (localStorage) pour ne pas redemander a chaque visite.

export default function VerificationAge() {
  const [verifie, setVerifie] = useState<boolean | null>(null);

  useEffect(() => {
    const val = localStorage.getItem("age_verifie");
    const expiration = localStorage.getItem("age_verifie_expire");
    if (val === "oui" && expiration && Date.now() < Number(expiration)) {
      setVerifie(true);
    } else {
      setVerifie(false);
    }
  }, []);

  function confirmer() {
    localStorage.setItem("age_verifie", "oui");
    localStorage.setItem("age_verifie_expire", String(Date.now() + 30 * 24 * 60 * 60 * 1000));
    setVerifie(true);
  }

  function refuser() {
    window.location.href = "https://www.service-public.fr";
  }

  if (verifie !== false) return null;

  return (
    <div style={overlay}>
      <div style={box}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <Sceau taille={56} couleur="#1F3D2E" />
        </div>
        <h2 style={{ fontFamily: "Georgia, serif", color: "#1F3D2E", margin: 0 }}>Antoinette Gay</h2>
        <p style={{ margin: "16px 0" }}>
          Ce site présente des boissons alcoolisées. L&apos;abus d&apos;alcool est dangereux pour
          la santé, à consommer avec modération. La vente d&apos;alcool aux mineurs est interdite.
        </p>
        <p style={{ fontWeight: "bold" }}>Confirmez-vous avoir 18 ans ou plus ?</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
          <button onClick={confirmer} style={btnPrimary}>
            J&apos;ai 18 ans ou plus
          </button>
          <button onClick={refuser} style={btnSecondary}>
            Je suis mineur
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.85)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const box: React.CSSProperties = {
  background: "#F3ECDA",
  padding: 40,
  borderRadius: 4,
  maxWidth: 440,
  textAlign: "center",
  border: "2px solid #1F3D2E",
};

const btnPrimary: React.CSSProperties = {
  background: "#1F3D2E",
  color: "#fff",
  border: "none",
  padding: "12px 20px",
  cursor: "pointer",
  fontSize: 14,
};

const btnSecondary: React.CSSProperties = {
  background: "transparent",
  color: "#1F3D2E",
  border: "1px solid #1F3D2E",
  padding: "12px 20px",
  cursor: "pointer",
  fontSize: 14,
};
