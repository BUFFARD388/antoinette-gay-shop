import "./globals.css";
import BandeauLegal from "@/components/BandeauLegal";
import VerificationAge from "@/components/VerificationAge";
import EnTete from "@/components/EnTete";
import Pied from "@/components/Pied";
import { NOM_MAISON, ACCROCHE, URL_SITE, ADRESSE_MAISON, TELEPHONE_CONTACT } from "@/lib/config";

export const metadata = {
  metadataBase: new URL(URL_SITE),
  title: `${NOM_MAISON} — Gin artisanal, distillerie du Passage Gay à Lyon`,
  description: ACCROCHE,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${NOM_MAISON} — Gin artisanal de Lyon`,
    description: ACCROCHE,
    url: URL_SITE,
    siteName: NOM_MAISON,
    images: [{ url: "/images/hero-vue-tour.jpg", width: 1200, height: 630 }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${NOM_MAISON} — Gin artisanal de Lyon`,
    description: ACCROCHE,
    images: ["/images/hero-vue-tour.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLdMaison = {
  "@context": "https://schema.org",
  "@type": "LiquorStore",
  name: NOM_MAISON,
  description: ACCROCHE,
  url: URL_SITE,
  telephone: TELEPHONE_CONTACT,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADRESSE_MAISON.split(",").slice(0, -1).join(",").trim(),
    addressLocality: "Neuville-sur-Saône",
    postalCode: "69250",
    addressCountry: "FR",
  },
  areaServed: "Lyon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMaison) }}
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-ui), Arial, sans-serif",
          background: "#F3ECDA",
          color: "#1F3D2E",
        }}
      >
        <VerificationAge />
        <BandeauLegal />
        <EnTete />
        {children}
        <Pied />
      </body>
    </html>
  );
}
