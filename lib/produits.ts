// Catalogue des cuvées Maison Antoinette Gay — phase précommande.
//
// Lineup confirmé par Laurent le 23/08/2026 à partir des vraies étiquettes
// (recto/verso) des 3 cuvées. La cuvée "Décembre" évoquée dans une session
// précédente n'apparaît sur aucune étiquette et a été retirée du catalogue.
//
// Dénomination définitive confirmée par Laurent le 23/08/2026 (remplace les
// noms d'étiquette "Fragola — Vendange Tardive" / "Rhubarbe" / "Vestiges") :
//   Cuvée I   — Le Jardin de l'Angélique (permanente, au raisin fragola)
//   Cuvée II  — Cuvée Rhubarbe (saisonnière, printemps/été)
//   Cuvée III — Le Gin de Noël (éphémère, hiver)
// Les slugs techniques (fragola/rhubarbe/vestiges) n'ont pas changé, seuls
// le nom affiché et la mention de statut évoluent.
//
// Correction du 23/08/2026 : la description et les ingrédients de la
// Cuvée III (Gin de Noël) mentionnaient à tort un genièvre au whisky
// tourbé. Laurent a précisé la vraie recette : épices douces (très
// puissantes), genièvre poussé au maximum, et pomme pour la gourmandise.
//
// Prix (42€/70cl, 49€/coffret) et éditions limitées (100 par cuvée, 100
// coffrets) confirmés par Laurent. stripePriceId n'est pas utilisé pendant
// la phase précommande (aucun paiement n'est pris) : il resservira au vrai
// lancement 2027 quand la boutique passera en paiement Stripe.
//
// `signature` reprend, mot pour mot, la phrase de clôture propre à chaque
// cuvée telle qu'imprimée au dos de la bouteille (couleur reprise de
// l'étiquette). `accent` est la couleur d'accent de la cuvée, également
// reprise des étiquettes.
//
// Les suggestions ginTonic et cocktail reprennent les vraies recettes
// (dosages, garnitures) fournies par Laurent le 23/08/2026 pour chacune
// des 3 cuvées.

export type SuggestionDegustation = {
  titre: string;
  recette: string;
};

export type Signature = {
  texte: string;
  couleur: string;
};

export type Produit = {
  slug: string;
  nom: string;
  cuvee: string;
  mention?: string; // ex: "Permanent au raisin fragola" — statut de disponibilité, affiché sous le nom
  categorie: string; // ex: "Gin aromatisé" — la famille de spiritueux, affichée à côté de la cuvée
  ingredients: string; // ex: "Raisin fragola rouge et genièvre" — repris du recto de l'étiquette
  description: string;
  prix: number; // en centimes — confirmé (42€/70cl, 49€/coffret)
  stripePriceId: string; // pour le vrai lancement 2027, pas utilisé en précommande
  image: string;
  degre: number;
  format: string; // ex: "70cl" ou "3 x 20cl"
  type: "cuvee" | "coffret";
  editionLimitee: number | null; // nombre total de bouteilles numérotées disponibles, null = pas de limite affichée
  accent: string; // couleur d'accent de la cuvée, reprise de l'étiquette
  signature?: Signature; // phrase de clôture au dos de l'étiquette, propre à cette cuvée
  photos?: string[]; // vraies photos de la bouteille (public/images/...), 1 à 3 vues — sinon on affiche le sceau.
  // La 1ère sert de photo de carte ; sur la page produit, toutes s'affichent en galerie avec vignettes dès qu'il y en a plus d'une.
  cuveesIncluses?: string[]; // slugs des cuvées incluses, pour un coffret
  ginTonic?: SuggestionDegustation;
  cocktail?: SuggestionDegustation;
};

export const produits: Produit[] = [
  {
    slug: "fragola",
    nom: "Le Jardin de l'Angélique",
    cuvee: "Cuvée I",
    mention: "Permanent au raisin fragola",
    categorie: "Gin aromatisé",
    ingredients: "Raisin fragola rouge et genièvre",
    description:
      "Gin distillé à partir de raisin fragola rouge vendangé tardivement et de genièvre. Un clin d'œil aux « cures de raisin » qu'inventait déjà Pierre Gay sur la colline de Fourvière, il y a plus d'un siècle.",
    prix: 4200,
    stripePriceId: "price_REMPLACER_FRAGOLA",
    image: "/images/fragola.jpg",
    degre: 42,
    format: "70cl",
    type: "cuvee",
    editionLimitee: 100,
    accent: "#b9821c",
    // Vraies photos (25/08/2026) : bouteille étiquetée "Cuvée II Rhubarbe"
    // et bouchon en cire rose au sceau AG, fournies par Laurent — réutilisées
    // pour les 3 cuvées en attendant que chacune ait sa propre bouteille
    // photographiée. L'étiquette visible ("RHUBARBE") ne correspond donc pas
    // encore à cette fiche Fragola : à remplacer dès que possible.
    photos: ["/images/bouteille-antoinette-gay.jpg", "/images/bouchon-sceau-ag.jpg"],
    signature: {
      texte:
        "Plus d'un siècle après ses cures de raisin, nous redistillons à notre tour le fruit de la première récolte de ce terroir.",
      couleur: "#b9821c",
    },
    ginTonic: {
      titre: "Le Tonic Fragola",
      recette:
        "4 cl de Fragola, 12 cl de tonic premium neutre, beaucoup de glaçons. En garniture : un grain de raisin coupé en deux ou une fraise des bois.",
    },
    cocktail: {
      titre: "Le Spritz Lyonnais",
      recette:
        "4 cl de Fragola, 2 cl de liqueur de gentiane (ou d'Apérol), à allonger au vin blanc pétillant local.",
    },
  },
  {
    slug: "rhubarbe",
    nom: "Cuvée Rhubarbe",
    cuvee: "Cuvée II",
    mention: "Le saisonnier — printemps / été",
    categorie: "Gin aromatisé",
    ingredients: "Rhubarbe et genièvre",
    description:
      "Gin distillé à la rhubarbe et au genièvre. La fraîcheur acidulée d'un jardin de l'Ouest lyonnais — le même Ouest lyonnais où poussait déjà, un siècle plus tôt, celui d'Antoinette.",
    prix: 4200,
    stripePriceId: "price_REMPLACER_RHUBARBE",
    image: "/images/rhubarbe.jpg",
    degre: 42,
    format: "70cl",
    type: "cuvee",
    editionLimitee: 100,
    accent: "#a23b56",
    // Vraies photos (25/08/2026) : bouteille étiquetée "Cuvée II Rhubarbe"
    // et bouchon en cire rose au sceau AG, fournies par Laurent — réutilisées
    // pour les 3 cuvées en attendant que chacune ait sa propre bouteille
    // photographiée. Celle-ci correspond déjà à la bonne cuvée.
    photos: ["/images/bouteille-antoinette-gay.jpg", "/images/bouchon-sceau-ag.jpg"],
    signature: {
      texte: "Aujourd'hui, c'est un jardin de ce même Ouest lyonnais qui prête sa fraîcheur à cette cuvée.",
      couleur: "#a23b56",
    },
    ginTonic: {
      titre: "Le Tonic Printanier",
      recette:
        "4 cl de Rhubarbe, 12 cl de tonic premium (type Fever-Tree Naturally Light), beaucoup de glaçons. En garniture : un fin ruban de rhubarbe fraîche ou une fraise coupée en deux.",
    },
    cocktail: {
      titre: "Rhubarbe Collins",
      recette:
        "5 cl de Rhubarbe, 2 cl de jus de citron vert, 1,5 cl de sirop de sucre, à allonger à l'eau gazeuse.",
    },
  },
  {
    slug: "vestiges",
    nom: "Le Gin de Noël",
    cuvee: "Cuvée III",
    mention: "L'éphémère d'hiver",
    categorie: "Gin aromatisé",
    ingredients: "Épices douces, pomme et genièvre",
    description:
      "Un gin de Noël aux épices douces très puissantes, où le genièvre est poussé au maximum. La pomme apporte la gourmandise pour en faire un gin chaleureux.",
    prix: 4200,
    stripePriceId: "price_REMPLACER_VESTIGES",
    image: "/images/vestiges.jpg",
    degre: 42,
    format: "70cl",
    type: "cuvee",
    editionLimitee: 100,
    accent: "#3f4a4a",
    // Vraies photos (25/08/2026) : bouteille étiquetée "Cuvée II Rhubarbe"
    // et bouchon en cire rose au sceau AG, fournies par Laurent — réutilisées
    // pour les 3 cuvées en attendant que chacune ait sa propre bouteille
    // photographiée. L'étiquette visible ("RHUBARBE") ne correspond donc pas
    // encore à cette fiche Gin de Noël : à remplacer dès que possible.
    photos: ["/images/bouteille-antoinette-gay.jpg", "/images/bouchon-sceau-ag.jpg"],
    signature: {
      texte:
        "Comme les fragments antiques qu'il exposait sur son promontoire, cette cuvée porte un goût d'ailleurs, façonné ici.",
      couleur: "#3f4a4a",
    },
    ginTonic: {
      titre: "Le Tonic des Lumières",
      recette:
        "4 cl de Gin de Noël, 12 cl de tonic premium neutre, beaucoup de glaçons. En garniture : une étoile de badiane (anis étoilé) ou un bâton de cannelle.",
    },
    cocktail: {
      titre: "Le Royal 8 Décembre",
      recette:
        "3 cl de Gin de Noël, 1 cl de jus de citron jaune, 1 cl de sirop de sucre, à allonger au crémant de Bourgogne ou au champagne.",
    },
  },
  {
    slug: "coffret-decouverte",
    nom: "Coffret Découverte",
    cuvee: "Les trois cuvées",
    categorie: "Coffret de gins aromatisés",
    ingredients: "Jardin de l'Angélique, Rhubarbe, Gin de Noël",
    description:
      "Les trois cuvées de la Maison en format 20cl, pour découvrir l'ensemble de la première série — Le Jardin de l'Angélique, Cuvée Rhubarbe, Le Gin de Noël.",
    prix: 4900,
    stripePriceId: "price_REMPLACER_COFFRET",
    image: "/images/coffret-decouverte.jpg",
    degre: 42,
    format: "3 x 20cl",
    type: "coffret",
    editionLimitee: 100,
    accent: "#1F3D2E",
    cuveesIncluses: ["fragola", "rhubarbe", "vestiges"],
    // Vraie photo (25/08/2026) : le coffret 3 bouteilles vu de dessus,
    // recadrée par Claude pour retirer la table en bois autour du carton
    // (fournie par Laurent, bouteilles encore vides sur cette prise de vue).
    photos: ["/images/coffret-decouverte-detoure.jpg"],
  },
];

export function getProduitBySlug(slug: string) {
  return produits.find((p) => p.slug === slug);
}
