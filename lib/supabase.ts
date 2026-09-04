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

// Correctif du 04/09/2026 : sans ceci, les appels reseau emis par
// @supabase/supabase-js peuvent etre mis en cache par Next.js (vu dans les
// Logs Vercel : "Using cache ...supabase.co/rest/v1/precommande_compteurs")
// meme sur une page en `export const dynamic = "force-dynamic"` — ce
// reglage ne suffit pas a lui seul a empecher le cache de `fetch()` pour les
// appels emis par cette librairie. Consequence concrete : le site affichait
// toujours "0 precommandee" quelle que soit la vraie valeur dans Supabase,
// car Next.js reservait la toute premiere reponse obtenue (au tout debut,
// quand la table etait vide) au lieu de relire a chaque visite. Ce petit
// wrapper force chaque appel a ignorer le cache.
const fetchSansCache: typeof fetch = (url, options) => fetch(url, { ...options, cache: "no-store" });

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: fetchSansCache },
});

// Cle "service role" utilisee UNIQUEMENT cote serveur (route /api/precommande,
// webhook Stripe) pour ecrire en base sans etre bloque par les regles de
// securite (RLS). Ne jamais exposer cette cle au navigateur.
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";
  return createClient(supabaseUrl, serviceKey, {
    global: { fetch: fetchSansCache },
  });
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