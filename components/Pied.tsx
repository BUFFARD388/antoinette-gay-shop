import Link from "next/link";
import { NOM_MAISON, TELEPHONE_CONTACT } from "@/lib/config";
import Sceau from "./Sceau";

// Le lien "Contact" pointait autrefois directement vers un mailto — il mène
// désormais vers app/contact/page.tsx (créée le 02/09/2026 sur demande de
// Laurent), qui affiche téléphone et email. Le téléphone est aussi repris
// ici en clair, pour rester visible sans clic supplémentaire.
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
        <Link href="/contact" style={lien}>
          Contact
        </Link>
      </nav>
      <p style={{ margin: "4px 0" }}>
        {NOM_MAISON} — Distillerie artisanale, au nord de Lyon.
      </p>
      <p style={{ margin: "4px 0" }}>
        Une question ? <a href={`tel:${TELEPHONE_CONTACT.replace(/\s/g, "")}`} style={lien}>{TELEPHONE_CONTACT}</a>
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