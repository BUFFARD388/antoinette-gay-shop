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
    if (error || !data) return {};
    return Object.fromEntries(data.map((ligne) => [ligne.slug, ligne.compteur as number]));
  } catch {
    return {};
  }
}
