"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  appliquerConsentement,
  enregistrerChoixCookies,
  lireChoixCookies,
  EVENEMENT_OUVRIR_COOKIES,
} from "@/lib/cookies";

// Bandeau de consentement aux cookies publicitaires (Google Ads), ajouté le
// 12/10/2026. « Tout refuser » et « Tout accepter » sont présentés avec la même
// importance, comme l'exige la CNIL. Tant que le visiteur n'a pas choisi, Google
// reste en consentement refusé (voir components/GoogleAds.tsx). Le lien
// « Gérer les cookies » du pied de page rouvre ce bandeau.
export default function BandeauCookies() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lireChoixCookies() === null) setVisible(true);
    const ouvrir = () => setVisible(true);
    window.addEventListener(EVENEMENT_OUVRIR_COOKIES, ouvrir);
    return () => window.removeEventListener(EVENEMENT_OUVRIR_COOKIES, ouvrir);
  }, []);

  function choisir(accepte: boolean) {
    enregistrerChoixCookies(accepte);
    appliquerConsentement(accepte);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div role="dialog" aria-label="Choix sur les cookies" style={bandeau}>
      <p style={texte}>
        Nous utilisons des cookies publicitaires (Google Ads) pour mesurer l&apos;efficacité de nos
        annonces. Ils ne sont déposés que si vous les acceptez. La mesure d&apos;audience du site
        fonctionne sans cookie.{" "}
        <Link href="/reglementation#cookies" style={lien}>
          En savoir plus
        </Link>
      </p>
      <div style={boutons}>
        <button type="button" onClick={() => choisir(false)} style={bouton}>
          Tout refuser
        </button>
        <button type="button" onClick={() => choisir(true)} style={bouton}>
          Tout accepter
        </button>
      </div>
    </div>
  );
}

const bandeau: React.CSSProperties = {
  position: "fixed",
  left: 12,
  right: 12,
  bottom: 12,
  zIndex: 9000, // sous la vérification d'âge (9999)
  maxWidth: 760,
  margin: "0 auto",
  background: "#F3ECDA",
  color: "#1F3D2E",
  border: "2px solid #1F3D2E",
  padding: "14px 18px",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 14,
  boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
};

const texte: React.CSSProperties = {
  flex: "1 1 320px",
  margin: 0,
  fontSize: 13.5,
  lineHeight: 1.5,
};

const lien: React.CSSProperties = { color: "#1F3D2E", textDecoration: "underline" };

const boutons: React.CSSProperties = { display: "flex", gap: 10, flex: "0 0 auto" };

// Même style pour les deux boutons : aucun n'est mis en avant.
const bouton: React.CSSProperties = {
  background: "#1F3D2E",
  color: "#fff",
  border: "1px solid #1F3D2E",
  padding: "10px 16px",
  cursor: "pointer",
  fontSize: 14,
};
