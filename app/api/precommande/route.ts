import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getProduitBySlug } from "@/lib/produits";

// Route de la phase precommande : AUCUN paiement n'est pris ici.
// Le visiteur laisse son email, choisit ses cuvees et une quantite ; on
// enregistre la demande et on attribue un numero de serie par bouteille.
// Le vrai paiement Stripe (app/api/checkout) reservira au lancement 2027.

type LigneNumerotee = {
  slug: string;
  nom: string;
  quantite: number;
  numeros: number[];
};

export async function POST(req: NextRequest) {
  let body: {
    email?: string;
    prenom?: string;
    telephone?: string;
    ageConfirme?: boolean;
    accepteContact?: boolean;
    panier?: { slug: string; quantite: number }[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { email, prenom, telephone, ageConfirme, accepteContact, panier } = body;

  if (!ageConfirme) {
    return NextResponse.json(
      { error: "Confirmation d'âge requise avant toute précommande." },
      { status: 400 }
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  if (!Array.isArray(panier) || panier.length === 0) {
    return NextResponse.json({ error: "Panier vide." }, { status: 400 });
  }

  // Verifie chaque ligne et calcule les quantites avant d'ecrire quoi que ce soit.
  const lignesValidees: { slug: string; nom: string; quantite: number }[] = [];
  for (const item of panier) {
    const produit = getProduitBySlug(item?.slug);
    const quantite = Number(item?.quantite);
    if (!produit) {
      return NextResponse.json({ error: `Produit inconnu : ${item?.slug}` }, { status: 400 });
    }
    if (!Number.isInteger(quantite) || quantite < 1 || quantite > 12) {
      return NextResponse.json(
        { error: `Quantité invalide pour ${produit.nom}.` },
        { status: 400 }
      );
    }
    lignesValidees.push({ slug: produit.slug, nom: produit.nom, quantite });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const lignesNumerotees: LigneNumerotee[] = [];

  // Attribution des numeros de serie, cuvee par cuvee, via la fonction
  // atomique incrementer_compteur (voir supabase/schema.sql). Remarque :
  // le controle de l'edition limitee ci-dessous est une verification "au
  // mieux" (lecture avant increment), pas une garantie anti-concurrence
  // stricte — largement suffisant pour le volume attendu en precommande.
  for (const ligne of lignesValidees) {
    const produit = getProduitBySlug(ligne.slug)!;

    if (produit.editionLimitee !== null) {
      const { data: compteurActuel } = await supabaseAdmin
        .from("precommande_compteurs")
        .select("compteur")
        .eq("slug", ligne.slug)
        .maybeSingle();
      const dejaPrecommandees = compteurActuel?.compteur ?? 0;
      if (dejaPrecommandees + ligne.quantite > produit.editionLimitee) {
        return NextResponse.json(
          {
            error: `Il ne reste plus assez de bouteilles disponibles en précommande pour ${produit.nom}.`,
          },
          { status: 409 }
        );
      }
    }

    const { data: nouveauTotal, error: erreurCompteur } = await supabaseAdmin.rpc(
      "incrementer_compteur",
      { p_slug: ligne.slug, p_quantite: ligne.quantite }
    );

    if (erreurCompteur || typeof nouveauTotal !== "number") {
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement de la précommande. Réessaie dans un instant." },
        { status: 500 }
      );
    }

    const numeros = Array.from(
      { length: ligne.quantite },
      (_, i) => nouveauTotal - ligne.quantite + 1 + i
    );

    lignesNumerotees.push({ ...ligne, numeros });
  }

  const { error: erreurInsertion } = await supabaseAdmin.from("precommandes").insert({
    email,
    prenom: prenom || null,
    telephone: telephone || null,
    produits: lignesNumerotees,
    date_naissance_confirmee: true,
    accepte_contact: accepteContact !== false,
  });

  if (erreurInsertion) {
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la précommande." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, lignes: lignesNumerotees });
}
