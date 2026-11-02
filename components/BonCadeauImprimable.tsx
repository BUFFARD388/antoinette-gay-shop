"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Bon cadeau personnalisé, imprimable ou enregistrable en PDF depuis le navigateur.
// Les données (cuvée, numéro, destinataire, offrant) arrivent dans le fragment d'URL
// (#cuvee=...&n=...&pour=...&de=...) : un fragment n'est jamais envoyé au serveur.
// Elles ne sont pas modifiables dans la page : le bon reprend exactement la réservation.

const VERT = "#1F3D2E";
const OR = "#C9971F";
const OR_CLAIR = "#E3BF63";
const CREME = "#F6EFDD";
const ENCRE = "#2A2A22";
const POLICE = "var(--font-display), 'Cormorant Garamond', Georgia, serif";
const LARGEUR_FEUILLE_PX = 800; // feuille A4 (210 mm) à l’écran

const CSS = `
.bc-carte{position:relative;width:148mm;height:105mm;box-sizing:border-box;overflow:hidden;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:${POLICE}}
.bc-cadre{position:absolute;inset:4mm;border:0.8pt solid ${OR}}
.bc-cadre::after{content:"";position:absolute;inset:1.3mm;border:0.3pt solid ${OR}}
.bc-coin{position:absolute;width:2.2mm;height:2.2mm;background:${OR};transform:rotate(45deg)}
.bc-abs{position:absolute;left:0;right:0;text-align:center}
.bc-filet{position:absolute;left:50%;transform:translateX(-50%);width:58mm;display:flex;align-items:center;gap:2mm}
.bc-filet i{flex:1;height:0;border-top:0.4pt solid ${OR}}
.bc-filet b{width:1.7mm;height:1.7mm;background:${OR};transform:rotate(45deg)}
.bc-ligne{position:absolute;left:4mm;width:124mm;height:6.5mm;display:grid;align-items:end;color:${OR_CLAIR};font-style:italic;font-size:9.5pt}
.bc-lib{text-align:right;padding-right:2mm;padding-bottom:0.3mm}
.bc-val{border-bottom:0.4pt solid ${OR};min-height:5mm;padding:0 1mm 0.3mm;color:${CREME};font-size:11.5pt;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bc-etape{display:grid;grid-template-columns:8mm 1fr;align-items:start;margin-bottom:3.4mm;font-size:9.2pt;line-height:10.8pt;color:${ENCRE}}
.bc-num{width:5mm;height:5mm;border:0.6pt solid ${OR};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8.4pt;font-weight:600;color:${VERT};margin-top:0.4mm}
.bc-feuille{position:relative;width:210mm;height:297mm;margin:0 auto;background:#fff}
@media print{
  @page{size:A4 portrait;margin:0}
  body *{visibility:hidden}
  .bc-impression,.bc-impression *{visibility:visible}
  .bc-impression{position:absolute;left:0;top:0;zoom:1!important;margin:0}
  .bc-feuille{box-shadow:none!important}
  .bc-ecran{display:none!important}
}
`;

type Champs = { cuvee: string; n: string; pour: string; de: string };

function Carte({ children, fond }: { children: React.ReactNode; fond: string }) {
  return (
    <div className="bc-carte" style={{ background: fond }}>
      <div className="bc-cadre" />
      {[
        { left: "2.9mm", top: "2.9mm" },
        { right: "2.9mm", top: "2.9mm" },
        { left: "2.9mm", bottom: "2.9mm" },
        { right: "2.9mm", bottom: "2.9mm" },
      ].map((p, i) => (
        <span key={i} className="bc-coin" style={p} />
      ))}
      {children}
    </div>
  );
}

function Filet({ top }: { top: string }) {
  return (
    <div className="bc-filet" style={{ top }}>
      <i />
      <b />
      <i />
    </div>
  );
}

export default function BonCadeauImprimable() {
  const [c, setC] = useState<Champs | null>(null);
  const [echelle, setEchelle] = useState(1);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      setC({
        cuvee: (p.get("cuvee") || "").slice(0, 60),
        n: (p.get("n") || "").slice(0, 8),
        pour: (p.get("pour") || "").slice(0, 60),
        de: (p.get("de") || "").slice(0, 60),
      });
    } catch {
      setC({ cuvee: "", n: "", pour: "", de: "" });
    }
    const ajuster = () => setEchelle(Math.min(1, (window.innerWidth - 32) / LARGEUR_FEUILLE_PX));
    ajuster();
    window.addEventListener("resize", ajuster);
    return () => window.removeEventListener("resize", ajuster);
  }, []);

  if (!c) return null;
  const complet = c.cuvee.trim() !== "" && c.n.trim() !== "";
  const coffret = /coffret/i.test(c.cuvee);

  return (
    <main style={{ padding: "32px 16px 80px", color: VERT }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bc-ecran" style={{ maxWidth: 560, margin: "0 auto 28px" }}>
        <h1 style={{ fontFamily: POLICE, fontStyle: "italic", fontWeight: 500, fontSize: 34, margin: "0 0 8px" }}>
          Votre bon cadeau
        </h1>
        {complet ? (
          <>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 16px" }}>
              Votre bon est prêt : il reprend la bouteille que vous avez réservée. Cliquez sur « Imprimer ». Pour
              obtenir un fichier PDF, choisissez « Enregistrer au format PDF » dans la fenêtre d&apos;impression
              (format A4, échelle 100&nbsp;%).
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              style={{ background: VERT, color: "#fff", border: "none", padding: "13px 26px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}
            >
              Imprimer le bon cadeau
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 16px" }}>
              Le bon cadeau est préparé à partir d&apos;une bouteille réservée : le numéro et la cuvée y sont inscrits
              automatiquement. Réservez d&apos;abord votre bouteille en cochant « C&apos;est un cadeau », puis cliquez sur
              « Imprimer le bon » depuis la page de confirmation.
            </p>
            <Link
              href="/?cadeau=1#formulaire"
              style={{ display: "inline-block", background: OR, color: "#17301F", padding: "13px 26px", fontWeight: 700, fontSize: 15, textDecoration: "none" }}
            >
              Réserver la bouteille à offrir
            </Link>
          </>
        )}
      </div>

      {complet && (
      <div className="bc-impression" style={{ zoom: echelle, maxWidth: "100%" }}>
        <div className="bc-feuille" style={{ boxShadow: "0 0 0 1px #d9cca3" }}>
          {/* ---- RECTO ---- */}
          <div style={{ position: "absolute", left: "31mm", top: "20mm" }}>
            <Carte fond={VERT}>
              <div style={{ position: "absolute", left: "50%", top: "9mm", width: "10.8mm", height: "10.8mm", transform: "translateX(-50%)", border: `0.7pt solid ${OR}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", fontWeight: 600, fontSize: "13pt", color: OR }}>
                AG
              </div>
              <div className="bc-abs" style={{ top: "20.6mm", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.27em", color: OR_CLAIR }}>
                MAISON ANTOINETTE GAY
              </div>
              <div className="bc-abs" style={{ top: "25.8mm", fontSize: "5.2pt", letterSpacing: "0.27em", color: OR }}>
                DISTILLERIE ARTISANALE · NORD LYONNAIS
              </div>
              <div className="bc-abs" style={{ top: "29mm", fontSize: "30pt", fontStyle: "italic", fontWeight: 500, lineHeight: 1.1, color: OR }}>
                Bon cadeau
              </div>
              <Filet top="47.2mm" />
              <div className="bc-abs" style={{ top: "50.5mm", left: "22mm", right: "22mm", fontSize: "9.6pt", lineHeight: "11.6pt", fontStyle: "italic", color: CREME }}>
                {coffret
                  ? "Un coffret numéroté du tout premier tirage de la Maison Antoinette Gay a été réservé pour vous."
                  : "Une bouteille numérotée du tout premier tirage de la Maison Antoinette Gay a été réservée pour vous."}
              </div>
              <div className="bc-ligne" style={{ top: "66mm", gridTemplateColumns: "48mm 1fr" }}>
                <span className="bc-lib">Pour</span>
                <span className="bc-val">{c.pour}</span>
              </div>
              <div className="bc-ligne" style={{ top: "74mm", gridTemplateColumns: "48mm 44mm 9.5mm 22.5mm" }}>
                <span className="bc-lib">Cuvée</span>
                <span className="bc-val">{c.cuvee}</span>
                <span className="bc-lib" style={{ paddingRight: "1.5mm" }}>n°</span>
                <span className="bc-val">{c.n}</span>
              </div>
              <div className="bc-ligne" style={{ top: "82mm", gridTemplateColumns: "48mm 1fr" }}>
                <span className="bc-lib">De la part de</span>
                <span className="bc-val">{c.de}</span>
              </div>
            </Carte>
          </div>

          {/* ---- VERSO ---- */}
          <div style={{ position: "absolute", left: "31mm", top: "135mm" }}>
            <Carte fond={CREME}>
              <div className="bc-abs" style={{ top: "9.4mm", fontSize: "14.5pt", fontStyle: "italic", fontWeight: 600, color: VERT }}>
                Votre bouteille vous attend
              </div>
              <Filet top="18mm" />
              <div style={{ position: "absolute", top: "23.5mm", left: "15mm", width: "118mm" }}>
                <div className="bc-etape">
                  <span className="bc-num">1</span>
                  <span>La cuvée et le numéro inscrits au recto sont réservés à votre nom : cette bouteille ne sera attribuée à personne d&apos;autre.</span>
                </div>
                <div className="bc-etape">
                  <span className="bc-num">2</span>
                  <span>Début 2027, vous recevez une invitation exclusive à la distillerie (18 avenue Carnot, Neuville-sur-Saône) pour retirer votre bouteille, ou elle vous est livrée selon le choix fait à la réservation.</span>
                </div>
                <div className="bc-etape">
                  <span className="bc-num">3</span>
                  <span>Le règlement est demandé avant la remise ou l&apos;envoi de la bouteille. Détails sur maisonantoinettegay.fr/bon-cadeau</span>
                </div>
              </div>
              <div style={{ position: "absolute", left: "18mm", right: "18mm", top: "83.5mm", borderTop: `0.3pt solid ${OR}` }} />
              <div className="bc-abs" style={{ top: "85mm", left: "17mm", right: "17mm", fontSize: "6.6pt", lineHeight: "7.7pt", fontStyle: "italic", color: "#6B6A58" }}>
                Premier tirage prévu au 1er trimestre 2027, sous réserve du calendrier de la distillerie. Réservé aux personnes majeures.
              </div>
              <div className="bc-abs" style={{ top: "92.2mm", fontSize: "6.4pt", fontWeight: 600, color: VERT }}>
                L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
              </div>
            </Carte>
          </div>
        </div>
      </div>
      )}
    </main>
  );
}
