import Link from "next/link";
import { NOM_MAISON, EMAIL_CONTACT, TELEPHONE_CONTACT } from "@/lib/config";
import Sceau from "@/components/Sceau";

export const metadata = {
  title: `Contact — ${NOM_MAISON}`,
  description: "Une question sur une cuvée, ta précommande ou la Maison ? Laurent te répond directement, par téléphone ou par email.",
  alternates: {
    canonical: "/contact",
  },
};

// Page créée le 02/09/2026 sur demande de Laurent, qui souhaitait un numéro
// de téléphone visible pour les demandes de renseignements. Téléphone et
// email repris des constantes lib/config.ts (email mis à jour le même jour
// avec sa vraie adresse, à la place de l'ancien placeholder
// contact@maisonantoinettegay.fr).

export default function PageContact() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 24px 80px" }}>
      <header style={{ textAlign: "center", padding: "32px 0 8px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <Sceau taille={56} couleur="#1F3D2E" />
        </div>
        <p style={eyebrow}>Une question ?</p>
        <h1 style={{ fontFamily: "var(--font-display), Georgia, serif", fontStyle: "italic", fontSize: 34, margin: "16px 0" }}>
          Nous contacter
        </h1>
        <p style={intro}>
          La Maison est encore artisanale et à taille humaine — c&apos;est Laurent qui te répond
          directement, que ce soit pour une question sur une cuvée, ta précommande, la livraison,
          ou simplement pour échanger.
        </p>
      </header>

      <section style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
        <a href={`tel:${TELEPHONE_CONTACT.replace(/\s/g, "")}`} style={carteContact}>
          <p style={labelContact}>Téléphone</p>
          <p style={valeurContact}>{TELEPHONE_CONTACT}</p>
        </a>
        <a href={`mailto:${EMAIL_CONTACT}`} style={carteContact}>
          <p style={labelContact}>Email</p>
          <p style={valeurContact}>{EMAIL_CONTACT}</p>
        </a>
      </section>

      <p style={note}>
        Pour réserver ta bouteille, direction la{" "}
        <Link href="/#formulaire" style={{ color: "#1F3D2E" }}>
          page d&apos;accueil
        </Link>{" "}
        — le formulaire de précommande ne prend aucun paiement.
      </p>
    </main>
  );
}

const eyebrow: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "#93670f",
  margin: 0,
};

const intro: React.CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.7,
  color: "#3f4a4a",
  maxWidth: 480,
  margin: "0 auto",
};

const carteContact: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "#1F3D2E",
  border: "1px solid #e3d3a4",
  borderRadius: 4,
  padding: "20px 24px",
  textAlign: "center",
  background: "#fffdf8",
};

const labelContact: React.CSSProperties = {
  fontSize: 11.5,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "#93670f",
  margin: 0,
};

const valeurContact: React.CSSProperties = {
  fontFamily: "var(--font-display), Georgia, serif",
  fontSize: 22,
  margin: "8px 0 0",
};

const note: React.CSSProperties = {
  marginTop: 40,
  fontSize: 13.5,
  lineHeight: 1.6,
  color: "#5b6f63",
  textAlign: "center",
  borderTop: "1px solid #e3d3a4",
  paddingTop: 20,
};