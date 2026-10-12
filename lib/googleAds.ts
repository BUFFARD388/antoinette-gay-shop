// Suivi de conversion Google Ads — ajouté le 12/10/2026.
//
// GOOGLE_ADS_LABEL_PRECOMMANDE : à renseigner avec l'étiquette fournie par
// Google Ads (Objectifs > Conversions > action « Précommande » > Balise >
// "send_to": "AW-18506524161/XXXXXXXX" → copier la partie après le « / »).
// Tant qu'elle est vide, aucune conversion n'est envoyée.
export const GOOGLE_ADS_ID = "AW-18506524161";
export const GOOGLE_ADS_LABEL_PRECOMMANDE = "FwQVCMv2sZodEIHMzPhE";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Appelée une fois que la précommande est confirmée par le serveur.
// N'envoie aucune donnée personnelle. Sans consentement publicitaire
// (refusé par défaut), Google ne dépose pas de cookie et la conversion
// n'est pas rattachée à une publicité.
export function suivreConversionPrecommande(): void {
  if (typeof window === "undefined" || !GOOGLE_ADS_LABEL_PRECOMMANDE) return;
  try {
    window.gtag?.("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LABEL_PRECOMMANDE}`,
    });
  } catch {
    // le suivi ne doit jamais bloquer la précommande
  }
}
