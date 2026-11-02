import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bon cadeau à offrir | Maison Antoinette Gay",
  description:
    "Offrez un morceau d’histoire pour Noël : réservez à 0 € une bouteille numérotée du premier tirage 2027 et offrez-la avec notre bon cadeau à imprimer.",
  alternates: { canonical: "/bon-cadeau" },
};

const vert = "#1F3D2E";
const or = "#C9971F";

const bouton: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 26px",
  borderRadius: 4,
  fontWeight: 600,
  textDecoration: "none",
};

const titre2: React.CSSProperties = {
  fontFamily: "var(--font-display), Georgia, serif",
  fontStyle: "italic",
  fontWeight: 500,
  fontSize: "1.8rem",
  margin: "48px 0 12px",
};

export default function PageBonCadeau() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 20px 80px", color: vert }}>
      <p style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontSize: "0.8rem", color: or, margin: 0 }}>
        Idée cadeau · Noël 2026
      </p>
      <h1 style={{ fontFamily: "var(--font-display), Georgia, serif", fontStyle: "italic", fontSize: "clamp(2.2rem, 6vw, 3.4rem)", fontWeight: 500, margin: "8px 0 16px", lineHeight: 1.1 }}>
        Offrez un morceau d’histoire
      </h1>
      <p style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
        Réservez dès maintenant une bouteille <strong>numérotée</strong> du tout premier tirage de la
        Maison Antoinette Gay, distillé à Neuville-sur-Saône, puis offrez-la avec notre bon cadeau à
        imprimer. Le numéro et la cuvée y sont inscrits : la bouteille est bien celle de la personne
        que vous gâtez.
      </p>

      <h2 style={titre2}>Comment ça marche</h2>
      <ol style={{ paddingLeft: 22, lineHeight: 1.65, fontSize: "1.05rem" }}>
        <li>
          <strong>Réservez la bouteille</strong> avec le formulaire ci-dessous, en cochant «&nbsp;C’est
          un cadeau&nbsp;». Votre numéro de bouteille vous est attribué immédiatement.{" "}
          <strong>0&nbsp;€ à payer aujourd’hui.</strong>
        </li>
        <li>
          <strong>Imprimez le bon cadeau</strong> : une fois la réservation validée, il s’affiche déjà rempli
          (cuvée, numéro de la bouteille, nom du destinataire). Imprimez-le ou enregistrez-le en PDF, puis offrez-le.
        </li>
        <li>
          <strong>Début 2027</strong>, une invitation exclusive à la distillerie permet de retirer la
          bouteille sur place. La livraison à domicile est possible, chez vous ou chez le destinataire
          selon votre choix à la réservation.
        </li>
        <li>
          <strong>Le règlement est demandé avant la remise ou l’envoi</strong> de la bouteille. Nous
          vous contactons au moment de la confirmation.
        </li>
      </ol>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "28px 0 8px" }}>
        <Link href="/?cadeau=1#formulaire" style={{ ...bouton, background: or, color: "#17301F" }}>
          Réserver la bouteille à offrir
        </Link>
        <a href="/bon-cadeau-maison-antoinette-gay-A4.pdf" download style={{ ...bouton, background: "transparent", color: vert, border: `1px solid ${vert}` }}>
          Bon vierge à remplir à la main (A4)
        </a>
      </div>
      <p style={{ fontSize: "0.9rem", opacity: 0.8, margin: 0 }}>
        Imprimez en taille réelle (100&nbsp;%), sur un papier épais si possible. Le bon vierge se remplit au stylo : cuvée, numéro, nom du destinataire et le vôtre.
      </p>

      <div style={{ borderTop: `1px solid ${or}`, marginTop: 48, paddingTop: 20, fontSize: "0.9rem", lineHeight: 1.6, opacity: 0.85 }}>
        <p style={{ margin: "0 0 8px" }}>
          Réservation gratuite et sans paiement en ligne. Premier tirage prévu au 1er trimestre 2027,
          sous réserve du calendrier de la distillerie. Réservé aux personnes majeures&nbsp;: le
          destinataire doit l’être également.
        </p>
        <p style={{ margin: 0, fontWeight: 600 }}>
          L’abus d’alcool est dangereux pour la santé. À consommer avec modération.
        </p>
      </div>
    </main>
  );
}
