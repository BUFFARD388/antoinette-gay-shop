"use client";

import { useState } from "react";
import Link from "next/link";
import type { Produit } from "@/lib/produits";
import CarteProduit from "@/components/CarteProduit";
import { NOM_MAISON, DATE_LIVRAISON_PREVUE, FRAIS_PORT, SEUIL_PORT_GRATUIT } from "@/lib/config";

type LigneConfirmee = { slug: string; nom: string; quantite: number; numeros: number[] };

type Props = {
  produits: Produit[];
  compteursInitiaux: Record<string, number>;
};

const ETAPES = [
  {
    periode: "Les 6 derniers mois",
    titre: "Recherche & création",
    texte: "Mise au point des recettes, conception du packaging et de l'identité de la Maison, avant l'ouverture de la précommande.",
  },
  {
    periode: "Aujourd'hui",
    titre: "Précommande",
    texte: "Tu réserves ta bouteille numérotée, sans paiement — juste ton email et ton choix de cuvée.",
  },
  {
    periode: "2026 — début 2027",
    titre: "Agrément & atelier",
    texte: "Obtention du statut d'entrepositaire agréé, achat de l'alambic, travaux de l'atelier de production.",
  },
  {
    periode: "Début 2027",
    titre: "Distillation",
    texte: "Première distillation et mise en bouteille des cuvées précommandées.",
  },
  {
    periode: `Livraison ${DATE_LIVRAISON_PREVUE}`,
    titre: "Expédition",
    texte: "Tu es contacté·e par email pour finaliser et régler ta commande avant expédition.",
  },
];

const FAQ = [
  {
    q: "Est-ce que je suis débité·e maintenant ?",
    r: "Non. Cette précommande ne prend aucun paiement. Elle sert à réserver ta place et à mesurer l'intérêt pour chaque cuvée avant le vrai lancement.",
  },
  {
    q: "Quand vais-je payer ?",
    r: `Tu seras recontacté·e par email avant l'expédition (${DATE_LIVRAISON_PREVUE}) pour confirmer et régler ta commande. Aucun engagement ferme à ce stade.`,
  },
  {
    q: "Le numéro de série m'engage-t-il à acheter ?",
    r: "Non, c'est une réservation de priorité, pas un achat. Tu restes libre de ne pas donner suite au moment du vrai lancement.",
  },
  {
    q: "Quels sont les frais de port ?",
    r: `Compter environ ${(FRAIS_PORT / 100).toFixed(2)} € en point relais. Livraison offerte à partir de ${SEUIL_PORT_GRATUIT} produits précommandés.`,
  },
];

export default function CampagnePrecommande({ produits, compteursInitiaux }: Props) {
  const [panier, setPanier] = useState<Record<string, number>>({});
  const [compteurs, setCompteurs] = useState<Record<string, number>>(compteursInitiaux);
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [ageConfirme, setAgeConfirme] = useState(false);
  const [accepteContact, setAccepteContact] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<LigneConfirmee[] | null>(null);

  function ajouter(slug: string) {
    setPanier((p) => ({ ...p, [slug]: (p[slug] || 0) + 1 }));
  }

  function retirer(slug: string) {
    setPanier((p) => {
      const copie = { ...p };
      if (copie[slug] > 1) copie[slug] -= 1;
      else delete copie[slug];
      return copie;
    });
  }

  const totalArticles = Object.values(panier).reduce((a, b) => a + b, 0);
  const totalPrix = Object.entries(panier).reduce((sum, [slug, qte]) => {
    const p = produits.find((x) => x.slug === slug);
    return sum + (p ? p.prix * qte : 0);
  }, 0);
  const portOffert = totalArticles >= SEUIL_PORT_GRATUIT;
  const fraisPort = totalArticles > 0 && !portOffert ? FRAIS_PORT : 0;
  const totalAvecPort = totalPrix + fraisPort;

  function texteRecap() {
    const base = `${totalArticles} article${totalArticles > 1 ? "s" : ""} sélectionné${totalArticles > 1 ? "s" : ""} — ${(totalAvecPort / 100).toFixed(2)} € indicatif`;
    return base + (portOffert ? " (port offert)" : ` (dont ${(fraisPort / 100).toFixed(2)} € de port estimé)`);
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);

    if (totalArticles === 0) {
      setErreur("Choisis au moins une cuvée avant de valider ta précommande.");
      return;
    }
    if (!ageConfirme) {
      setErreur("Merci de confirmer que tu as 18 ans ou plus.");
      return;
    }

    setEnvoiEnCours(true);
    try {
      const res = await fetch("/api/precommande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          prenom,
          telephone,
          ageConfirme,
          accepteContact,
          panier: Object.entries(panier).map(([slug, quantite]) => ({ slug, quantite })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error || "Une erreur est survenue, réessaie dans un instant.");
        return;
      }
      setSucces(data.lignes);
      setCompteurs((c) => {
        const copie = { ...c };
        for (const ligne of data.lignes as LigneConfirmee[]) {
          copie[ligne.slug] = (copie[ligne.slug] || 0) + ligne.quantite;
        }
        return copie;
      });
      setPanier({});
    } catch {
      setErreur("Impossible de contacter le serveur. Vérifie ta connexion et réessaie.");
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px 80px" }}>
      {/* Héro — photo d'archive du vrai Passage Gay en fond, sous une teinte vert bouteille. */}
      <header style={heroSection}>
        <span style={badgePrecommande}>Précommande ouverte — livraison {DATE_LIVRAISON_PREVUE}</span>
        <h1
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontStyle: "italic",
            fontSize: 44,
            margin: "20px 0 8px",
            letterSpacing: 1,
            color: "#F3ECDA",
          }}
        >
          {NOM_MAISON}
          {/* Sous-titre SEO ajouté le 21/09/2026, dans le H1 lui-même (même
              principe que sousTitreSEO sur les produits, voir
              CarteProduit.tsx) : le H1 ne portait jusque-là que le nom de la
              marque, sans indiquer l'activité — mot-clé réel et visible. */}
          <span style={heroSousTitreH1}>Distillerie de Gin Artisanal à Lyon</span>
        </h1>

        <div style={{ marginTop: 10 }}>
          {/* Passé de <p> à <h2> le 21/09/2026 : c'est la phrase la plus
              riche en mots-clés réels de la page (Lyon, gins artisanaux) —
              lui donner un vrai poids de sous-titre plutôt qu'un simple
              paragraphe. Style visuel inchangé (heroSousTitreLigne fixe déjà
              taille/graisse/marge en inline, donc aucun changement d'affichage
              en passant de <p> à <h2>). */}
          <h2 style={heroSousTitreLigne}>Gins artisanaux et locaux, distillés au nord de Lyon.</h2>
          <p style={{ ...heroSousTitreLigne, margin: "4px 0 0" }}>
            Parfumés au genièvre et aux fruits frais du jardin.
          </p>
        </div>

        <div style={heroReassurance}>
          <p style={{ color: "#F3ECDA", fontWeight: 600, fontSize: 15.5, margin: "0 0 10px" }}>
            La toute première série est ouverte à la précommande !
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <li style={heroReassuranceItem}>Vos bouteilles sont limitées et numérotées.</li>
            <li style={heroReassuranceItem}>Zéro paiement aujourd&apos;hui : aucune carte bancaire demandée.</li>
            <li style={heroReassuranceItem}>
              Vous réservez votre place, nous vous recontactons avant l&apos;expédition.
            </li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
          <a href="#formulaire" style={btnHeroPrincipal}>
            Réserver ma bouteille (Gratuit)
          </a>
          <a href="#cuvees" style={btnHeroSecondaire}>
            Découvrir nos 3 cuvées
          </a>
        </div>
      </header>

      {/* Timeline */}
      <section style={timelineGrille}>
        {ETAPES.map((etape, i) => (
          <div key={etape.titre} style={etapeCarte}>
            <p style={{ fontSize: 12, letterSpacing: 1, color: "#C9971F", margin: 0, textTransform: "uppercase" }}>
              {String(i + 1).padStart(2, "0")} — {etape.periode}
            </p>
            <h3 style={{ fontFamily: "var(--font-display), Georgia, serif", margin: "6px 0" }}>
              {etape.titre}
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, color: "#3f5346" }}>{etape.texte}</p>
          </div>
        ))}
      </section>

      {/* Bannière d'ambiance au-dessus des cuvées — visuel généré par IA
          fourni par Laurent le 04/09/2026 (mise en situation du Coffret
          Découverte, colline de Fourvière en arrière-plan). Même principe de
          transparence que les photos produit : mention visible sur l'image. */}
      <div style={bandeauAmbiance}>
        <img
          src="/images/ambiance-coffret-ia.jpg"
          alt="Trois amis trinquent avec un gin tonic Maison Antoinette Gay ; le Coffret Découverte est posé devant eux, la colline de Fourvière en arrière-plan"
          style={imgAmbiance}
        />
        <span style={badgeIAAmbiance}>Visuel généré par IA</span>
      </div>

      {/* Produits */}
      <section
        id="cuvees"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 28,
          marginTop: 40,
          scrollMarginTop: 24,
        }}
      >
        {produits.map((p) => (
          <CarteProduit
            key={p.slug}
            produit={p}
            quantite={panier[p.slug] || 0}
            compteur={compteurs[p.slug] || 0}
            onAjouter={() => ajouter(p.slug)}
            onRetirer={() => retirer(p.slug)}
          />
        ))}
      </section>

      {/* Bloc "Notre histoire" ajouté le 23/09/2026 à la demande de Laurent,
          pour le référencement (recherches "Passage Gay", "Tour Métallique
          de Fourvière"). La page /notre-histoire porte déjà tout le récit
          détaillé (1861-1894, généalogie, photos d'archive) — ce bloc ne le
          duplique pas, il renvoie vers elle avec un texte de lien riche en
          mots-clés, pour renforcer le maillage interne plutôt que de créer
          un contenu concurrent sur la même page. Photo réutilisée depuis la
          galerie Notre Histoire (histoire-photo-tour-metallique.jpg, ajoutée
          le 21/09/2026). */}
      <section style={blocHistoire}>
        <div style={blocHistoireImageConteneur}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/histoire-photo-tour-metallique.jpg"
            alt="La Tour Métallique de Fourvière, à l'époque de Pierre et Antoinette Gay"
            style={blocHistoireImage}
          />
        </div>
        <div style={blocHistoireTexte}>
          <p style={blocHistoireEyebrow}>Depuis 1861</p>
          <h2 style={blocHistoireTitre}>Du Passage Gay à la Tour Métallique de Fourvière</h2>
          <p style={blocHistoireParagraphe}>
            Notre nom vient d&apos;une vraie histoire lyonnaise : Pierre puis Antoinette Gay, qui ont
            fait découvrir la colline de Fourvière aux voyageurs et participé à la construction de
            la Tour Métallique dans les années 1890, avant que leur descendance ne se lance
            aujourd&apos;hui dans la distillation.
          </p>
          <Link href="/notre-histoire" style={blocHistoireLien}>
            Découvrir l&apos;histoire complète du Passage Gay et de la Tour Métallique de Fourvière →
          </Link>
        </div>
      </section>

      {/* Bloc "SEO local" ajouté le 14/09/2026 à la demande de Laurent : un
          court paragraphe de vrai texte visible, juste avant le formulaire
          de précommande, pour capter les recherches des Lyonnais sans faire
          de blog. Reprend les mots-clés déjà utilisés ailleurs sur le site
          (Lyon, Fourvière, Fête des Lumières) mais reste rigoureusement
          fidèle à la réalité : la Maison est au nord de Lyon (Neuville-sur-
          Saône), pas au cœur de Lyon, et le Passage Gay est le lieu de
          l'histoire familiale de 1861, pas l'adresse actuelle — la Maison ne
          vend pas sur place, elle expédie dans toute la France. Garder cette
          cohérence avec le JSON-LD (app/layout.tsx) et la fiche Google
          Business est important pour la crédibilité du référencement local. */}
      <section style={{ marginTop: 48 }}>
        <p style={texteSeoLocal}>
          Installée au nord de Lyon, la Maison Antoinette Gay perpétue le savoir-faire familial
          initié par Pierre puis Antoinette Gay au Passage Gay, sur la colline de Fourvière, en
          1861. Notre distillerie artisanale élabore aujourd&apos;hui des gins haut de gamme à
          partir de baies de genièvre et de fruits frais de notre jardin. Que vous cherchiez un
          spiritueux lyonnais original à offrir pour la Fête des Lumières ou un dry gin français
          de caractère, réservez dès maintenant votre bouteille numérotée de notre première
          édition, expédiée dans toute la France.
        </p>
      </section>

      {/* Formulaire / confirmation */}
      <section id="formulaire" style={{ marginTop: 64, scrollMarginTop: 24 }}>
        {succes ? (
          <div style={panneauConfirmation}>
            <h2 style={{ fontFamily: "var(--font-display), Georgia, serif", marginTop: 0 }}>
              Précommande enregistrée{prenom ? `, ${prenom}` : ""} !
            </h2>
            <p>Voici les numéros de série attribués à ta précommande :</p>
            <ul style={{ paddingLeft: 20 }}>
              {succes.map((ligne) => (
                <li key={ligne.slug} style={{ marginBottom: 4 }}>
                  {ligne.nom} — n°{ligne.numeros.join(", n°")}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 14, color: "#3f5346" }}>
              Ce numéro est celui qui sera gravé en « Lot N° » sur l'étiquette de ta bouteille.
            </p>
            <p style={{ fontSize: 14, color: "#3f5346" }}>
              Aucun paiement n'a été pris. Nous te recontacterons par email avant l'expédition
              ({DATE_LIVRAISON_PREVUE}) pour confirmer et régler ta commande.
            </p>
          </div>
        ) : (
          <form onSubmit={soumettre} style={formulaire}>
            <h2 style={{ fontFamily: "var(--font-display), Georgia, serif", marginTop: 0 }}>
              Réserver ma précommande
            </h2>

            {totalArticles > 0 ? (
              <p style={{ fontSize: 14, color: "#3f5346" }}>{texteRecap()}</p>
            ) : (
              <p style={{ fontSize: 14, color: "#3f5346" }}>
                Choisis d'abord une ou plusieurs cuvées ci-dessus avec les boutons + / −.
              </p>
            )}

            <label style={champLabel}>
              Email *
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={champInput}
              />
            </label>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <label style={{ ...champLabel, flex: 1, minWidth: 200 }}>
                Prénom
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  style={champInput}
                />
              </label>
              <label style={{ ...champLabel, flex: 1, minWidth: 200 }}>
                Téléphone (facultatif)
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  style={champInput}
                />
              </label>
            </div>

            <label style={champCase}>
              <input type="checkbox" checked={ageConfirme} onChange={(e) => setAgeConfirme(e.target.checked)} />
              Je confirme avoir 18 ans ou plus.
            </label>

            <label style={champCase}>
              <input
                type="checkbox"
                checked={accepteContact}
                onChange={(e) => setAccepteContact(e.target.checked)}
              />
              J'accepte d'être recontacté·e par email au sujet de ma précommande.
            </label>

            {erreur && <p style={{ color: "#a13d2f", fontSize: 14 }}>{erreur}</p>}

            <button type="submit" disabled={envoiEnCours} style={btnValider}>
              {envoiEnCours ? "Envoi..." : "Valider ma précommande"}
            </button>
          </form>
        )}
      </section>

      {/* FAQ */}
      <section style={{ marginTop: 64 }}>
        <h2 style={{ fontFamily: "var(--font-display), Georgia, serif" }}>Questions fréquentes</h2>
        {FAQ.map((item) => (
          <div key={item.q} style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 600, margin: "0 0 4px" }}>{item.q}</p>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: "#3f5346" }}>{item.r}</p>
          </div>
        ))}
      </section>

      {/* Barre flottante */}
      {totalArticles > 0 && !succes && (
        <div style={panierFlottant}>
          <span>{texteRecap()}</span>
          <a href="#formulaire" style={btnCommander}>
            Réserver ma précommande
          </a>
        </div>
      )}
    </main>
  );
}

const bandeauAmbiance: React.CSSProperties = {
  marginTop: 56,
  position: "relative",
  overflow: "hidden",
  borderRadius: 4,
  background: "#1F3D2E",
};

const imgAmbiance: React.CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
};

const badgeIAAmbiance: React.CSSProperties = {
  position: "absolute",
  bottom: 12,
  right: 12,
  fontSize: 11,
  letterSpacing: 0.3,
  color: "#fff",
  background: "rgba(31, 61, 46, 0.72)",
  padding: "4px 10px",
  borderRadius: 2,
};

const badgePrecommande: React.CSSProperties = {
  display: "inline-block",
  background: "#C9971F",
  color: "#1F3D2E",
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: 0.5,
  padding: "6px 14px",
  borderRadius: 999,
};

const heroSection: React.CSSProperties = {
  textAlign: "center",
  padding: "64px 24px 48px",
  marginTop: 8,
  borderRadius: 4,
  // Vue prise depuis le sommet de la Tour Métallique (archive fournie par Laurent) —
  // en bandeau, sous une teinte vert bouteille pour rester lisible.
  backgroundImage:
    "linear-gradient(160deg, rgba(20,38,29,0.62), rgba(31,61,46,0.52)), url('/images/hero-vue-tour.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center 55%",
};

const heroSousTitreLigne: React.CSSProperties = {
  color: "#F3ECDA",
  fontSize: 17,
  lineHeight: 1.5,
  fontWeight: 500,
  margin: 0,
};

const heroSousTitreH1: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-ui), Arial, sans-serif",
  fontStyle: "normal",
  fontSize: 17,
  fontWeight: 500,
  letterSpacing: 0.2,
  color: "#e7cd93",
  marginTop: 6,
};

const heroReassurance: React.CSSProperties = {
  maxWidth: 440,
  margin: "26px auto 0",
  textAlign: "left",
};

const heroReassuranceItem: React.CSSProperties = {
  color: "#dce6de",
  fontSize: 14,
  lineHeight: 1.5,
};

const btnHeroPrincipal: React.CSSProperties = {
  display: "inline-block",
  background: "#C9971F",
  color: "#1F3D2E",
  textDecoration: "none",
  padding: "13px 26px",
  fontWeight: 700,
  fontSize: 14.5,
};

const btnHeroSecondaire: React.CSSProperties = {
  display: "inline-block",
  background: "transparent",
  color: "#F3ECDA",
  textDecoration: "none",
  padding: "13px 26px",
  fontWeight: 600,
  fontSize: 14.5,
  border: "1px solid rgba(243,236,218,0.55)",
};

const timelineGrille: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
  gap: 16,
  marginTop: 16,
};

const etapeCarte: React.CSSProperties = {
  border: "1px solid #e0d3ac",
  padding: 18,
  background: "#fff",
};

const texteSeoLocal: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: "#3f5346",
  maxWidth: 760,
  margin: "0 auto",
  textAlign: "center",
};

// Styles du bloc "Notre histoire" (page d'accueil, ajouté le 23/09/2026) —
// même esprit visuel que la section "Le mot du fondateur" de la page
// /notre-histoire (photo + texte côte à côte, qui s'empilent sur mobile).
const blocHistoire: React.CSSProperties = {
  marginTop: 56,
  display: "flex",
  gap: 32,
  alignItems: "center",
  flexWrap: "wrap",
  padding: "32px 0",
  borderTop: "1px solid #e0d3ac",
  borderBottom: "1px solid #e0d3ac",
};

const blocHistoireImageConteneur: React.CSSProperties = {
  flex: "1 1 320px",
  minWidth: 280,
};

const blocHistoireImage: React.CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: 2,
};

const blocHistoireTexte: React.CSSProperties = {
  flex: "1 1 360px",
  minWidth: 280,
};

const blocHistoireEyebrow: React.CSSProperties = {
  fontFamily: "var(--font-ui), Arial, sans-serif",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: 0.6,
  color: "#93670f",
  textTransform: "uppercase",
  margin: "0 0 8px",
};

const blocHistoireTitre: React.CSSProperties = {
  fontFamily: "var(--font-display), Georgia, serif",
  fontSize: 26,
  fontWeight: 600,
  color: "#1F3D2E",
  margin: "0 0 14px",
  textWrap: "balance",
};

const blocHistoireParagraphe: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: "#3f5346",
  margin: "0 0 18px",
};

const blocHistoireLien: React.CSSProperties = {
  display: "inline-block",
  color: "#1F3D2E",
  fontWeight: 600,
  fontSize: 14.5,
  textDecoration: "underline",
  textUnderlineOffset: 3,
};

const formulaire: React.CSSProperties = {
  border: "1px solid #C9971F",
  background: "#fff",
  padding: 32,
  maxWidth: 560,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const panneauConfirmation: React.CSSProperties = {
  border: "1px solid #1F3D2E",
  background: "#fff",
  padding: 32,
  maxWidth: 560,
  margin: "0 auto",
};

const champLabel: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontSize: 13,
  color: "#3f5346",
};

const champInput: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #C9971F",
  fontSize: 15,
  fontFamily: "inherit",
};

const champCase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
};

const btnValider: React.CSSProperties = {
  background: "#1F3D2E",
  color: "#fff",
  border: "none",
  padding: "12px 20px",
  fontWeight: 600,
  cursor: "pointer",
  marginTop: 8,
};

const panierFlottant: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  background: "#1F3D2E",
  color: "#fff",
  padding: 16,
  display: "flex",
  justifyContent: "center",
  gap: 24,
  alignItems: "center",
  flexWrap: "wrap",
};

const btnCommander: React.CSSProperties = {
  background: "#C9971F",
  color: "#1F3D2E",
  border: "none",
  padding: "10px 24px",
  fontWeight: 700,
  cursor: "pointer",
  textDecoration: "none",
};
