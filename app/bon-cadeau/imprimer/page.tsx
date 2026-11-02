import type { Metadata } from "next";
import BonCadeauImprimable from "@/components/BonCadeauImprimable";

// Page d'outil : pas d'indexation (les données arrivent dans le fragment d'URL, jamais côté serveur).
export const metadata: Metadata = {
  title: "Imprimer mon bon cadeau | Maison Antoinette Gay",
  robots: { index: false, follow: false },
};

export default function PageImprimerBonCadeau() {
  return <BonCadeauImprimable />;
}
