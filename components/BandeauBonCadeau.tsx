"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Bandeau discret en haut du site. Il disparaît automatiquement après le 31/12/2026.
const FIN_AFFICHAGE = new Date("2027-01-01T00:00:00+01:00");

export default function BandeauBonCadeau() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(new Date() < FIN_AFFICHAGE);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        background: "#C9971F",
        color: "#17301F",
        textAlign: "center",
        padding: "9px 16px",
        fontSize: "0.9rem",
        lineHeight: 1.4,
      }}
    >
      <Link
        href="/bon-cadeau"
        style={{ color: "inherit", textDecoration: "none" }}
      >
        <strong>Nouveau&nbsp;: Offrez un morceau d’histoire pour Noël&nbsp;!</strong>{" "}
        Téléchargez notre bon cadeau exclusif pour réserver une bouteille du
        premier tirage 2027 (Réservation à 0&nbsp;€).{" "}
        <span style={{ textDecoration: "underline", whiteSpace: "nowrap" }}>
          Découvrir&nbsp;→
        </span>
      </Link>
    </div>
  );
}
