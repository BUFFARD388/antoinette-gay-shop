import Link from "next/link";
import { notFound } from "next/navigation";
import { produits, getProduitBySlug } from "@/lib/produits";
import Sceau from "@/components/Sceau";
import GalerieProduit from "@/components/GalerieProduit";
import { NOM_MAISON, URL_SITE } from "@/lib/config";

export function generateStaticParams() {
  return produits.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const produit = getProduitBySlug(params.slug);
  if (!produit) return {};
  return {
    title: `${produit.nom} — Gin artisanal ${produit.cuvee} | ${NOM_MAISON}`,
    description: produit.description,
    alternates: {
      canonical: `/produits/${produit.slug}`,
    },
    openGraph: {
      title: `${produit.nom} — ${NOM_MAISON}`,
      description: produit.description,
      url: `${URL_SITE}/produits/${produit.slug}`,
      images: produit.photos && produit.photos.length > 0 ? [{ url: produit.photos[0] }] : undefined,
    },
  };
}

export default function PageProduit({ params }: { params: { slug: string } }) {
  const produit = getProduitBySlug(params.slug);
  if (!produit) notFound();

  const cuveesIncluses = produit.cuveesIncluses
    ?.map((slug) => getProduitBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const jsonLdProduit = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produit.nom,
    description: produit.description,
    image: produit.photos,
    brand: { "@type": "Brand", name: "Maison Antoinette Gay" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (produit.prix / 100).toFixed(2),
      availability: "https://schema.org/PreOrder",
    },
  };

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 24px 80px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduit) }}
      />
      <Link href="/#cuvees" style={retour}>
        ← Retour aux cuvées
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 32, marginTop: 24 }}>
        {produit.photos && produit.photos.length > 0 ? (
          <GalerieProduit photos={produit.photos} nom={produit.nom} />
        ) : (
          <div style={visuel}>
            <Sceau taille={100} couleur="#F3ECDA" />
          </div>
        )}
        <div>
          <p style={labelCuvee}>
            {produit.cuvee} <span style={puceCategorie}>·</span> {produit.categorie}
          </p>
          <h1 style={{ fontFamily: "var(--font-display), Georgia, serif", margin: "6px 0 2px", fontSize: 32 }}>
            {produit.nom}
          </h1>
          {produit.mention && <p style={mentionStyle}>{produit.mention}</p>}
          {produit.type === "cuvee" && (
            <p style={{ fontSize: 12.5, letterSpacing: 0.5, textTransform: "uppercase", color: "#5b6f63", margin: "0 0 10px" }}>
              {produit.ingredients}
            </p>
          )}
          <p style={{ fontSize: 15.5, lineHeight: 1.6 }}>{produit.description}</p>

          {produit.signature && (
            <p
              style={{
                ...ligneSignature,
                borderLeftColor: produit.signature.couleur,
                color: produit.signature.couleur,
              }}
            >
              « {produit.signature.texte} »
            </p>
          )}

          <p style={{ fontSize: 13.5, color: "#5b6f63", margin: "14px 0 4px" }}>
            {produit.format} — {produit.degre}% vol
          </p>
          <p style={{ fontWeight: 600, fontSize: 18, margin: "0 0 18px" }}>
            {(produit.prix / 100).toFixed(2)} € <span style={{ fontWeight: 400, fontSize: 12 }}>indicatif</span>
          </p>
          <Link href="/#formulaire" style={boutonCta}>
            Réserver ma précommande
          </Link>
        </div>
      </div>

      {(produit.ginTonic || produit.cocktail) && (
        <section style={{ marginTop: 56 }}>
          <h2 style={{ fontFamily: "var(--font-display), Georgia, serif" }}>Suggestions de dégustation</h2>
          <p style={{ fontSize: 13, color: "#5b6f63", marginTop: -8 }}>
            À consommer avec modération — deux façons de découvrir cette cuvée.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginTop: 20 }}>
            {produit.ginTonic && (
              <div style={carteRecette}>
                <p style={etiquetteRecette}>Gin Tonic</p>
                <h3 style={{ fontFamily: "var(--font-display), Georgia, serif", margin: "6px 0 10px" }}>
                  {produit.ginTonic.titre}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{produit.ginTonic.recette}</p>
              </div>
            )}
            {produit.cocktail && (
              <div style={carteRecette}>
                <p style={etiquetteRecette}>Cocktail</p>
                <h3 style={{ fontFamily: "var(--font-display), Georgia, serif", margin: "6px 0 10px" }}>
                  {produit.cocktail.titre}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{produit.cocktail.recette}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {cuveesIncluses && cuveesIncluses.length > 0 && (
        <section style={{ marginTop: 56 }}>
          <h2 style={{ fontFamily: "var(--font-display), Georgia, serif" }}>Ce que contient le coffret</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginTop: 20 }}>
            {cuveesIncluses.map((c) => (
              <Link key={c.slug} href={`/produits/${c.slug}`} style={carteMini}>
                <p style={etiquetteRecette}>{c.cuvee}</p>
                <h3 style={{ fontFamily: "var(--font-display), Georgia, serif", margin: "6px 0 8px", fontSize: 17 }}>
                  {c.nom}
                </h3>
                <p style={{ fontSize: 13, color: "#5b6f63", margin: 0 }}>En savoir plus →</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

const retour: React.CSSProperties = { fontSize: 13.5, color: "#5b6f63", textDecoration: "none" };

const visuel: React.CSSProperties = {
  height: 220,
  background: "linear-gradient(155deg, #1F3D2E, #2c5641)",
  color: "#F3ECDA",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const labelCuvee: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: 1,
  color: "#C9971F",
  margin: 0,
  textTransform: "uppercase",
};

const puceCategorie: React.CSSProperties = {
  color: "#c9b98a",
};

const mentionStyle: React.CSSProperties = {
  fontSize: 13.5,
  fontStyle: "italic",
  color: "#5b6f63",
  margin: "0 0 10px",
};

const ligneSignature: React.CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.6,
  fontStyle: "italic",
  margin: "16px 0 0",
  paddingLeft: 16,
  borderLeft: "2px solid",
};

const boutonCta: React.CSSProperties = {
  display: "inline-block",
  background: "#1F3D2E",
  color: "#fff",
  textDecoration: "none",
  padding: "11px 20px",
  fontSize: 14,
  fontWeight: 600,
};

const carteRecette: React.CSSProperties = {
  border: "1px solid #e3d3a4",
  background: "#fff",
  padding: 22,
};

const carteMini: React.CSSProperties = {
  border: "1px solid #e3d3a4",
  background: "#fff",
  padding: 18,
  textDecoration: "none",
  color: "#1F3D2E",
};

const etiquetteRecette: React.CSSProperties = {
  fontSize: 11.5,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "#93670f",
  margin: 0,
};