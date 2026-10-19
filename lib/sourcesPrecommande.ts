// Réponses possibles à "Comment as-tu connu la Maison ?" (formulaire de
// précommande) — ajouté le 18/10/2026 pour savoir d'où viennent les
// précommandes. Les valeurs sont stockées telles quelles dans
// precommandes.source ; la route serveur n'accepte que ces valeurs.
export const SOURCES_PRECOMMANDE = [
  { valeur: "proche", libelle: "Un proche m'en a parlé" },
  { valeur: "facebook", libelle: "Facebook" },
  { valeur: "instagram", libelle: "Instagram" },
  { valeur: "google", libelle: "Une recherche ou une publicité Google" },
  { valeur: "evenement", libelle: "Un marché, un salon ou un événement" },
  { valeur: "presse", libelle: "Un article de presse" },
  { valeur: "autre", libelle: "Autre" },
] as const;

// Identifiant de parrainage (lien ?ref=prenom) : lettres, chiffres, _ et -, 40 max.
export const REGEX_REF_PARRAIN = /^[a-z0-9_-]{1,40}$/;
