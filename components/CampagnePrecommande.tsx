"use client";

import { useState } from "react";
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
        </h1>

        <div style={{ marginTop: 10 }}>
          <p style={heroSousTitreLigne}>Gins artisanaux et locaux, distillés au nord de Lyon.</p>
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
  height: 340,
  overflow: "hidden",
  borderRadius: 4,
};

const imgAmbiance: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center 35%",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 20,
  marginTop: 16,
};

const etapeCarte: React.CSSProperties = {
  border: "1px solid #e0d3ac",
  padding: 18,
  background: "#fff",
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
