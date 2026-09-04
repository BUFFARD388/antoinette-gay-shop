import { createClient } from "@supabase/supabase-js";

// Cree un projet sur supabase.com, puis renseigne ces deux valeurs
// dans ton fichier .env.local (voir .env.example) et dans Vercel.
//
// Valeurs de repli utilisees UNIQUEMENT quand les variables d'environnement
// ne sont pas encore definies (ex: build local sans .env.local), pour que
// `next build` ne plante pas au chargement du module. Avec ce repli, un vrai
// appel a Supabase echouera proprement au moment de l'appel (erreur reseau
// claire), plutot que de faire crasher tout le build.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cle "service role" utilisee UNIQUEMENT cote serveur (route /api/precommande,
// webhook Stripe) pour ecrire en base sans etre bloque par les regles de
// securite (RLS). Ne jamais exposer cette cle au navigateur.
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";
  return createClient(supabaseUrl, serviceKey);
}

// Nombre de precommandes par slug (cuvee ou coffret), lecture publique
// (voir la police "Lecture compteur publique" dans supabase/schema.sql).
// Renvoie un objet { [slug]: nombre }. En cas d'erreur (ex: Supabase pas
// encore configure), renvoie un objet vide plutot que de faire planter la page.
export async function getCompteursPrecommandes(): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabase.from("precommande_compteurs").select("slug, compteur");
    if (error || !data) {
      // Trace de diagnostic temporaire (04/09/2026), pour comprendre pourquoi
      // les compteurs s'affichent a 0 en production — visible dans Vercel >
      // Logs. A retirer une fois le probleme identifie/resolu. N'affiche
      // jamais la cle en entier, seulement de quoi verifier qu'elle est bien
      // chargee (longueur + tout debut).
      console.error("[precommande] Erreur lecture compteurs Supabase :", JSON.stringify(error));
      console.error("[precommande] URL configuree :", supabaseUrl);
      console.error(
        "[precommande] Cle anon chargee :",
        supabaseAnonKey === "placeholder-anon-key"
          ? "NON (valeur de repli utilisee, variable non lue)"
          : `OUI (${supabaseAnonKey.length} caracteres, commence par ${supabaseAnonKey.slice(0, 8)})`
      );
      return {};
    }
    return Object.fromEntries(data.map((ligne) => [ligne.slug, ligne.compteur as number]));
  } catch (e) {
    console.error("[precommande] Exception lors de la lecture des compteurs Supabase :", e);
    return {};
  }
}