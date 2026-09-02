"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NOM_MAISON } from "@/lib/config";
import Sceau from "./Sceau";

const LIENS = [
  { href: "/#cuvees", label: "Nos cuvées" },
  { href: "/notre-histoire", label: "Notre Histoire" },
  { href: "/reglementation", label: "Réglementation" },
];

export default function EnTete() {
  const pathname = usePathname();

  return (
    <header style={enTete}>
      <Link href="/" style={wordmark}>
        <Sceau taille={26} couleur="#1F3D2E" />
        {NOM_MAISON}
      </Link>
      <nav style={nav}>
        {LIENS.map((lien) => {
          const actif = pathname === lien.href.split("#")[0] && !lien.href.includes("#");
          return (
            <Link
              key={lien.href}
              href={lien.href}
              style={{ ...lienStyle, opacity: actif ? 1 : 0.78, borderBottomColor: actif ? "#C9971F" : "transparent" }}
            >
              {lien.label}
            </Link>
          );
        })}
        <Link href="/#formulaire" style={ctaStyle}>
          Précommander
        </Link>
      </nav>
    </header>
  );
}

const enTete: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 16,
  padding: "16px 24px",
  maxWidth: 1040,
  margin: "0 auto",
};

const wordmark: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontFamily: "var(--font-display), Georgia, serif",
  fontStyle: "italic",
  fontSize: 19,
  color: "#1F3D2E",
  textDecoration: "none",
  letterSpacing: 0.2,
};

const nav: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 22,
  flexWrap: "wrap",
};

const lienStyle: React.CSSProperties = {
  color: "#1F3D2E",
  textDecoration: "none",
  fontSize: 13.5,
  paddingBottom: 3,
  borderBottom: "2px solid transparent",
};

const ctaStyle: React.CSSProperties = {
  color: "#1F3D2E",
  textDecoration: "none",
  fontSize: 13.5,
  fontWeight: 600,
  border: "1px solid #1F3D2E",
  padding: "7px 14px",
  borderRadius: 2,
};
