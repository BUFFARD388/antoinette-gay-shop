import Script from "next/script";

// Balise de suivi Google Ads (gtag.js) ajoutée le 12/10/2026 à la demande de
// Laurent. Identifiant de conversion : AW-18506524161.
//
// Consent Mode v2 : par défaut, tout est REFUSÉ (ad_storage, analytics_storage,
// ad_user_data, ad_personalization). Tant qu'un bandeau de consentement n'accorde
// pas explicitement ces droits (gtag("consent", "update", {...})), Google ne
// dépose aucun cookie publicitaire sur l'appareil du visiteur. La balise reste
// détectable par Google Ads (bouton « Tester la connexion »).
const GOOGLE_ADS_ID = "AW-18506524161";

export default function GoogleAds() {
  return (
    <>
      <Script id="google-ads-consent-defaut" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied'
          });
        `}
      </Script>
      <Script
        id="google-ads-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
