export default function Succes() {
  return (
    <main style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: 20 }}>
      <h1>Merci pour votre commande !</h1>
      <p>
        Votre paiement a bien été reçu. Un e-mail de confirmation vous a été envoyé par Stripe.
        Nous préparons votre envoi.
      </p>
      <a href="/" style={{ color: "#1F3D2E" }}>
        Retour à la boutique
      </a>
    </main>
  );
}
