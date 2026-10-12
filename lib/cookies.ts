// Gestion du choix de l'internaute sur les cookies publicitaires (Google Ads).
// Ajouté le 12/10/2026. Le choix est mémorisé dans le navigateur (localStorage)
// pendant 6 mois, durée recommandée par la CNIL avant de redemander.
// Vercel Web Analytics fonctionne sans cookie : il n'est pas concerné.
export const CLE_CHOIX_COOKIES = "cookies_choix"; // "accepte" | "refuse"
export const CLE_EXPIRATION_COOKIES = "cookies_choix_expire";
export const DUREE_CHOIX_COOKIES_MS = 182 * 24 * 60 * 60 * 1000;
export const EVENEMENT_OUVRIR_COOKIES = "ouvrir-cookies";

// Lit le choix mémorisé. Renvoie null s'il n'y en a pas (ou s'il a expiré).
export function lireChoixCookies(): "accepte" | "refuse" | null {
  try {
    const choix = localStorage.getItem(CLE_CHOIX_COOKIES);
    const expiration = Number(localStorage.getItem(CLE_EXPIRATION_COOKIES));
    if ((choix === "accepte" || choix === "refuse") && Date.now() < expiration) {
      return choix;
    }
  } catch {
    // stockage indisponible (navigation privée...) : on redemandera
  }
  return null;
}

export function enregistrerChoixCookies(accepte: boolean): void {
  try {
    localStorage.setItem(CLE_CHOIX_COOKIES, accepte ? "accepte" : "refuse");
    localStorage.setItem(
      CLE_EXPIRATION_COOKIES,
      String(Date.now() + DUREE_CHOIX_COOKIES_MS)
    );
  } catch {
    // ignoré : le choix vaudra pour la page en cours seulement
  }
}

// Informe Google (Consent Mode v2) du choix du visiteur.
export function appliquerConsentement(accepte: boolean): void {
  if (typeof window === "undefined") return;
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  const etat = accepte ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_storage: etat,
    ad_user_data: etat,
    ad_personalization: etat,
    analytics_storage: etat,
  });
}
