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

  // Attribution des numeros de serie ET enregistrement de la precommande en
  // UN seul appel a la fonction atomique creer_precommande (voir
  // supabase/schema.sql, ajoutee le 04/09/2026). Avant, ceci se faisait en
  // plusieurs etapes separees (une par ligne, puis un insert final) : une
  // erreur sur l'insert final pouvait laisser les compteurs incrementes
  // sans que la commande (et l'email du client) soit enregistree — c'est ce
  // qui est arrive le 04/09/2026 (1 precommande sur 3 perdue). Avec un seul
  // appel a une fonction transactionnelle, soit tout reussit, soit rien
  // n'est modifie.
  const lignesPourFonction = lignesValidees.map((ligne) => {
    const produit = getProduitBySlug(ligne.slug)!;
    return {
      slug: ligne.slug,
      nom: ligne.nom,
      quantite: ligne.quantite,
      editionLimitee: produit.editionLimitee,
    };
  });

  const { data: lignesNumerotees, error: erreurCreation } = await supabaseAdmin.rpc(
    "creer_precommande",
    {
      p_email: email,
      p_prenom: prenom || null,
      p_telephone: telephone || null,
      p_accepte_contact: accepteContact !== false,
      p_lignes: lignesPourFonction,
    }
  );

  if (erreurCreation) {
    if (erreurCreation.message?.includes("edition_limitee_depassee")) {
      return NextResponse.json(
        { error: "Il ne reste plus assez de bouteilles disponibles en précommande pour une des cuvées choisies." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la précommande. Réessaie dans un instant." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, lignes: lignesNumerotees as LigneNumerotee[] });
}