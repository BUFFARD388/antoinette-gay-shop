import "./globals.css";
import BandeauLegal from "@/components/BandeauLegal";
import VerificationAge from "@/components/VerificationAge";
import EnTete from "@/components/EnTete";
import Pied from "@/components/Pied";
import { NOM_MAISON, ACCROCHE } from "@/lib/config";

export const metadata = {
  title: `${NOM_MAISON} — Précommande, distillerie artisanale de Lyon`,
  description: ACCROCHE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
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
