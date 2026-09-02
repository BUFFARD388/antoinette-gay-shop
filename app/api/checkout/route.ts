import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduitBySlug } from "@/lib/produits";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Le panier envoye par le front : [{ slug: "vestiges", quantite: 2 }, ...]
export async function POST(req: NextRequest) {
  const { panier, ageConfirme } = await req.json();

  if (!ageConfirme) {
    return NextResponse.json(
      { error: "Confirmation d'âge requise avant tout achat." },
      { status: 400 }
    );
  }

  if (!Array.isArray(panier) || panier.length === 0) {
    return NextResponse.json({ error: "Panier vide." }, { status: 400 });
  }

  const line_items = panier.map((item: { slug: string; quantite: number }) => {
    const produit = getProduitBySlug(item.slug);
    if (!produit) throw new Error(`Produit inconnu: ${item.slug}`);
    return {
      price: produit.stripePriceId,
      quantity: item.quantite,
    };
  });

  const origin = req.headers.get("origin") || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    shipping_address_collection: { allowed_countries: ["FR"] },
    // Zone de livraison volontairement limitee a la France au demarrage :
    // la vente vers d'autres pays UE implique des regles de TVA/accise
    // supplementaires (regime OSS) a mettre en place avant d'elargir.
    success_url: `${origin}/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/annule`,
    metadata: {
      age_confirme: "true",
      panier: JSON.stringify(panier),
    },
  });

  return NextResponse.json({ url: session.url });
}
