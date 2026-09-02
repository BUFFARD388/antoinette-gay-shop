import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Cette route est appelee directement par Stripe (pas par ton site) a chaque
// evenement de paiement. A declarer dans Stripe > Developpeurs > Webhooks,
// avec l'URL : https://tondomaine.fr/api/webhook
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const panier = JSON.parse(session.metadata?.panier || "[]");

    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin.from("commandes").insert({
      stripe_session_id: session.id,
      email: session.customer_details?.email,
      nom_client: session.customer_details?.name,
      adresse: session.customer_details?.address,
      produits: panier,
      montant_total: session.amount_total,
      date_naissance_confirmee: session.metadata?.age_confirme === "true",
    });
  }

  return NextResponse.json({ received: true });
}
