import Link from "next/link";
import { NOM_MAISON, EMAIL_CONTACT } from "@/lib/config";
import Sceau from "./Sceau";

export default function Pied() {
  return (
    <footer style={pied}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <Sceau taille={40} couleur="#1F3D2E" />
      </div>
      <nav style={liens}>
        <Link href="/notre-histoire" style={lien}>
          Notre Histoire
        </Link>
        <Link href="/reglementation" style={lien}>
          Réglementation &amp; mentions légales
        </Link>
        <a href={`mailto:${EMAIL_CONTACT}`} style={lien}>
          Contact
        </a>
      </nav>
      <p style={{ margin: "4px 0" }}>
        {NOM_MAISON} — Distillerie artisanale, au nord de Lyon.
      </p>
      <p style={{ margin: "4px 0" }}>
        Recettes, visuels et prix indicatifs, susceptibles d&apos;évoluer avant le lancement définitif.
      </p>
    </footer>
  );
}

const pied: React.CSSProperties = {
  maxWidth: 1040,
  margin: "70px auto 0",
  padding: "24px 24px 60px",
  textAlign: "center",
  fontSize: 12.5,
  color: "#5b6f63",
  borderTop: "1px solid #e3d3a4",
};

const liens: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  flexWrap: "wrap",
  marginBottom: 16,
};

const lien: React.CSSProperties = {
  color: "#1F3D2E",
  textDecoration: "none",
  fontSize: 13,
};
