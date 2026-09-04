// Catalogue des cuvées Maison Antoinette Gay — phase précommande.
//
// Lineup confirmé par Laurent le 23/08/2026 à partir des vraies étiquettes
// (recto/verso) des 3 cuvées. La cuvée "Décembre" évoquée dans une session
// précédente n'apparaît sur aucune étiquette et a été retirée du catalogue.
//
// Dénomination définitive confirmée par Laurent le 23/08/2026 (remplace les
// noms d'étiquette "Fragola — Vendange Tardive" / "Rhubarbe" / "Vestiges") :
//   Cuvée I   — Le Jardin de l'Angélique (permanente, au raisin fragola)
//   Cuvée II  — anciennement "Cuvée Rhubarbe", renommée "Le Secret
//               d'Antoinette" le 02/09/2026 (voir plus bas).
//   Cuvée III — anciennement "Le Gin de Noël" puis "Cuvée Décembre",
//               renommée "Le Vœu de Fourvière" le 02/09/2026 (voir plus bas).
//
// Correction du 23/08/2026 : la description et les ingrédients de la
// Cuvée III mentionnaient à tort un genièvre au whisky tourbé. Laurent a
// précisé la vraie recette : épices douces (très puissantes), genièvre
// poussé au maximum, et pomme pour la gourmandise. Cette recette n'a pas
// changé depuis.
//
// Renommage du 02/09/2026, en deux temps, pendant que Laurent travaille sur
// les étiquettes définitives :
//
// 1) Cuvée III : Laurent souhaite mettre moins en avant "Noël" et
//    davantage le vœu fait par les Lyonnais à Notre-Dame de Fourvière (juste
//    au-dessus du Passage Gay), tenu chaque 8 décembre en allumant des
//    lumignons aux fenêtres — la Fête des Lumières. Après un premier essai
//    "Cuvée Décembre", le nom retenu est "Le Vœu de Fourvière", qui garde aussi
//    la dimension épices/pomme/gourmandise de la recette. Le slug technique
//    passe de "vestiges" à "decembre" (mis à jour aussi dans
//    app/notre-histoire/page.tsx et le coffret ci-dessous) ; recette
//    inchangée.
//
// 2) Cuvée II : rebaptisée "Le Secret d'Antoinette" (à la place de "Cuvée
//    Rhubarbe"), en écho au fait que c'est la cuvée préférée de Laurent en
//    dégustation. Au passage, correction d'une incohérence géographique :
//    la description situait le jardin à l'Ouest lyonnais, alors que
//    l'ACCROCHE du site (lib/config.ts) et l'adresse réelle de la Maison
//    (Neuville-sur-Saône) situent bien la Maison au nord de Lyon — corrigé
//    ici et dans app/notre-histoire/page.tsx. Slug technique inchangé
//    ("rhubarbe").
//
// Le même jour, Laurent a précisé les quantités définitives pour l'année
// 2027 : 100 bouteilles par cuvée (déjà en place ci-dessous) et 50
// coffrets "Coffret Découverte" (le coffret garde son nom, seule sa
// editionLimitee passe de 100 à 50).
//
// Prix : 42€/70cl, coffret passé de 49€ à 59€ le 02/09/2026 (confirmés par Laurent). stripePriceId n'est
// pas utilisé pendant la phase précommande (aucun paiement n'est pris) :
// il resservira au vrai lancement 2027 quand la boutique passera en
// paiement Stripe.
//
// Mentions (phrase courte sous le nom) revues le 02/09/2026 :
//   Cuvée I  — "Permanent au raisin fragola" → "Fragola de notre jardin".
//     Laurent a précisé que le fragola n'est pas un choix générique : ce
//     sont ses propres pieds de fragola (rouge et blanc) dans son jardin,
//     et le rouge (utilisé pour cette cuvée) apporte un vrai goût de fraise
//     des bois — plus marqué que le blanc. Description enrichie en
//     conséquence ("de notre jardin", "goût de fraise des bois"). Le blanc
//     n'est pas utilisé dans cette cuvée (récolte 2026 abondante en blanc,
//     mais pas assez typé ; la cuvée 2027 sera bien au fragola rouge).
//   Cuvée II — "Le saisonnier — printemps / été" → "Le secret du
//     printemps". Laurent a confirmé au passage que le "jardin au nord de
//     Lyon" mentionné dans la description est bien son propre jardin (pas
//     une image).
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
  prix: number; // en centimes — 42€/70cl, coffret 59€ (mis à jour le 02/09/2026)
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
  photosGenereesParIA?: boolean; // true si `photos` contient des visuels générés par IA (pas de vraie photo) — affiche une mention à côté de l'image, obligation de transparence.
  cuveesIncluses?: string[]; // slugs des cuvées incluses, pour un coffret
  ginTonic?: SuggestionDegustation;
  cocktail?: SuggestionDegustation;
};

export const produits: Produit[] = [
  {
    slug: "fragola",
    nom: "Le Jardin de l'Angélique",
    cuvee: "Cuvée I",
    mention: "Fragola de notre jardin",
    categorie: "Gin aromatisé",
    ingredients: "Raisin fragola rouge et genièvre",
    description:
      "Gin distillé à partir de raisin fragola rouge de notre jardin, vendangé tardivement, et de genièvre — une variété rare qui apporte un vrai goût de fraise des bois. Un clin d'œil aux « cures de raisin » qu'inventait déjà Pierre Gay sur la colline de Fourvière, il y a plus d'un siècle.",
    prix: 4200,
    stripePriceId: "price_REMPLACER_FRAGOLA",
    image: "/images/fragola.jpg",
    degre: 42,
    format: "70cl",
    type: "cuvee",
    editionLimitee: 100,
    accent: "#b9821c",
    // Photo générique retirée le 03/09/2026 (voir historique plus bas dans
    // le fichier), puis remplacée le 03/09/2026 par un visuel généré par IA
    // fourni par Laurent (mise en scène avec étiquette provisoire) en
    // attendant la vraie photo de la bouteille étiquetée. `photosGenereesParIA`
    // affiche une mention à côté de l'image sur le site — transparence
    // vis-à-vis des visiteurs. À remplacer par une vraie photo dès qu'elle
    // existe (retirer aussi `photosGenereesParIA` à ce moment-là).
    photos: ["/images/fragola-ia.jpg"],
    photosGenereesParIA: true,
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
    nom: "Le Secret d'Antoinette",
    cuvee: "Cuvée II",
    mention: "Le secret du printemps",
    categorie: "Gin aromatisé",
    ingredients: "Rhubarbe et genièvre",
    description:
      "Gin distillé à la rhubarbe et au genièvre. La fraîcheur acidulée d'un jardin au nord de Lyon — le même nord lyonnais où poussait déjà, un siècle plus tôt, celui d'Antoinette.",
    prix: 4200,
    stripePriceId: "price_REMPLACER_RHUBARBE",
    image: "/images/rhubarbe.jpg",
    degre: 42,
    format: "70cl",
    type: "cuvee",
    editionLimitee: 100,
    accent: "#a23b56",
    // Visuel IA le 03/09/2026 (voir le même commentaire sur la Cuvée I
    // ci-dessus) : à remplacer par une vraie photo dès qu'elle existe.
    photos: ["/images/rhubarbe-ia.jpg"],
    photosGenereesParIA: true,
    signature: {
      texte: "Aujourd'hui, c'est un jardin de ce même nord lyonnais qui prête sa fraîcheur à cette cuvée.",
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
    slug: "decembre",
    nom: "Le Vœu de Fourvière",
    cuvee: "Cuvée III",
    mention: "Le 8 décembre, Fête des Lumières",
    categorie: "Gin aromatisé",
    ingredients: "Épices douces, pomme et genièvre",
    description:
      "Un gin aux épices douces très puissantes, où le genièvre est poussé au maximum. La pomme apporte la gourmandise pour en faire un gin chaleureux, pensé pour les soirées du 8 décembre, quand Lyon s'illumine pour la Fête des Lumières.",
    prix: 4200,
    stripePriceId: "price_REMPLACER_DECEMBRE",
    image: "/images/decembre.jpg",
    degre: 42,
    format: "70cl",
    type: "cuvee",
    editionLimitee: 100,
    accent: "#3f4a4a",
    // Visuel IA le 03/09/2026 (voir le même commentaire sur la Cuvée I
    // ci-dessus) : à remplacer par une vraie photo dès qu'elle existe.
    photos: ["/images/decembre-ia.jpg"],
    photosGenereesParIA: true,
    signature: {
      texte:
        "Chaque 8 décembre, Lyon pose un lumignon à ses fenêtres en mémoire du vœu fait à Notre-Dame de Fourvière, tout près du Passage Gay.",
      couleur: "#3f4a4a",
    },
    ginTonic: {
      titre: "Le Tonic des Lumières",
      recette:
        "4 cl de Vœu de Fourvière, 12 cl de tonic premium neutre, beaucoup de glaçons. En garniture : une étoile de badiane (anis étoilé) ou un bâton de cannelle.",
    },
    cocktail: {
      titre: "Le Royal 8 Décembre",
      recette:
        "3 cl de Vœu de Fourvière, 1 cl de jus de citron jaune, 1 cl de sirop de sucre, à allonger au crémant de Bourgogne ou au champagne.",
    },
  },
  {
    slug: "coffret-decouverte",
    nom: "Coffret Découverte",
    cuvee: "Les trois cuvées",
    categorie: "Coffret de gins aromatisés",
    ingredients: "Le Jardin de l'Angélique, Le Secret d'Antoinette, Le Vœu de Fourvière",
    description:
      "Les trois cuvées de la Maison en format 20cl, pour découvrir l'ensemble de la première série — Le Jardin de l'Angélique, Le Secret d'Antoinette, Le Vœu de Fourvière.",
    prix: 5900,
    stripePriceId: "price_REMPLACER_COFFRET",
    image: "/images/coffret-decouverte.jpg",
    degre: 42,
    format: "3 x 20cl",
    type: "coffret",
    editionLimitee: 50,
    accent: "#1F3D2E",
    cuveesIncluses: ["fragola", "rhubarbe", "decembre"],
    // Visuel généré par IA ajouté le 04/09/2026 (même principe que les 3
    // cuvées le 03/09/2026 : en attendant une vraie photo du coffret
    // complet, avec mention de transparence obligatoire via
    // photosGenereesParIA).
    photos: ["/images/coffret-decouverte-ia.jpg"],
    photosGenereesParIA: true,
  },
];

export function getProduitBySlug(slug: string) {
  return produits.find((p) => p.slug === slug);
}