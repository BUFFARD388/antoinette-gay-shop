import CampagnePrecommande from "@/components/CampagnePrecommande";
import { produits } from "@/lib/produits";
import { getCompteursPrecommandes } from "@/lib/supabase";

// Les compteurs de précommandes changent en permanence : on force le rendu
// dynamique (a chaque requete) plutot qu'une page generee une fois pour toutes
// au build, sous peine d'afficher des chiffres figes le jour du build.
export const dynamic = "force-dynamic";

// Composant serveur : va chercher les compteurs de précommandes cote serveur
// (lecture publique Supabase) avant l'affichage, puis delegue toute
// l'interactivite (panier, formulaire) au composant client.
export default async function Page() {
  const compteursInitiaux = await getCompteursPrecommandes();

  return <CampagnePrecommande produits={produits} compteursInitiaux={compteursInitiaux} />;
}
