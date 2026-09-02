# Maison Antoinette Gay — Précommande

Site de précommande pour les 3 premières cuvées + le coffret découverte,
construit sur la même stack que Valorimmo : **Next.js + Supabase + GitHub +
Vercel**.

## Où en est le projet

Le site est actuellement en **phase précommande** : les visiteurs réservent
une bouteille numérotée en laissant leur email, **sans paiement**. C'est
volontaire — voir "Le cadre légal" ci-dessous — et ça permet de mesurer le
volume d'intérêt par cuvée avant le vrai lancement (production prévue à
partir de début 2027, une fois l'agrément entrepositaire obtenu et l'atelier
prêt).

Le code du paiement Stripe (`app/api/checkout`, `app/api/webhook`) est déjà
en place mais **dormant** : il resservira tel quel pour la vraie boutique en
2027, il n'y a rien à faire dessus aujourd'hui.

## Contenu à confirmer avant mise en ligne

Le catalogue (`lib/produits.ts`), les prix (42€/70cl, 49€/coffret), les
éditions limitées (100 par cuvée et par coffret), et le texte de
`app/notre-histoire/page.tsx` reprennent le contenu réel des étiquettes
(recto/verso) que tu as fournies le 23/08/2026 (la cuvée "Décembre" évoquée
dans une session précédente n'apparaissait sur aucune étiquette et a été
retirée). La page "Notre Histoire" a été restructurée en 4 parties le
23/08/2026 sur tes remarques éditoriales : 1) L'histoire de la Maison
(1861-1894, Pierre puis Antoinette Gay et la Tour Métallique), 2) Le mot du
fondateur (portraits de Pauline et de toi, citation signée "— Laurent,
Fondateur", fusionnant les anciens paragraphes séparés), 3) Les trois
cuvées avec un résumé punchy propre à chacune (distinct de la phrase
imprimée au dos de la bouteille), 4) Le calendrier jusqu'à la livraison. La
page est maintenant entièrement définitive, plus aucun paragraphe en
attente.

**Dénomination définitive des cuvées**, confirmée par toi le 23/08/2026 —
remplace les noms d'étiquette (Fragola — Vendange Tardive / Rhubarbe /
Vestiges) :
- Cuvée I — **Le Jardin de l'Angélique**, permanente, au raisin fragola
- Cuvée II — **Cuvée Rhubarbe**, saisonnière (printemps / été)
- Cuvée III — **Le Gin de Noël**, éphémère (hiver)

Les slugs techniques (`fragola`/`rhubarbe`/`vestiges`, dans les URLs et les
noms de fichiers image) n'ont pas changé, pour ne rien casser — seuls le nom
affiché et la mention de statut (permanent/saisonnier/éphémère) évoluent.

Les mentions légales (`app/reglementation/page.tsx`) reprennent tes vraies
coordonnées, fournies le 23/08/2026 (adresse, téléphone, SIRET, hébergeur,
nom de domaine — voir `lib/config.ts`). **Deux points à vérifier avant
l'ouverture publique** :
- le SIRET donné ("40180120") ne fait que 8 chiffres — un SIRET français en
  compte normalement 14 (SIREN sur 9 chiffres + NIC sur 5) ; à vérifier et
  compléter auprès de toi ;
- la forme juridique et le numéro RCS n'ont pas été fournis — champ encore
  marqué `[À COMPLÉTER]` sur la page, à remplir une fois la structure
  juridique de la Maison immatriculée.

**Reste à faire/ajuster** :
- la formulation de la date de livraison (`DATE_LIVRAISON_PREVUE` dans
  `lib/config.ts`, actuellement "1er trimestre 2027")

Aucune vraie photo produit n'est présente dans `public/images/` : les fiches
affichent désormais le sceau de la Maison (le monogramme "AG" avec la Tour
Métallique, reconstitué en SVG dans `components/Sceau.tsx` à partir de ton
logo) en attendant. Une fois tes photos de bouteille prêtes, dépose-les dans
`public/images/` et remplace le bloc "visuel" de `components/CarteProduit.tsx`
(et de `app/produits/[slug]/page.tsx`) par une balise `<Image>` — tu peux
garder le sceau à côté, en petit, comme un cachet.

## Pages du site

- `/` — page de précommande (histoire courte, timeline, cuvées, formulaire)
- `/produits/[slug]` — fiche détaillée de chaque cuvée : description
  complète, dosage gin tonic et recette de cocktail
- `/notre-histoire` — l'histoire de la Maison (page définitive)
- `/reglementation` — cadre légal de la vente d'alcool en ligne + mentions
  légales (voir ci-dessus pour les deux points encore à vérifier)

La navigation (`components/EnTete.tsx`) et le pied de page
(`components/Pied.tsx`) relient ces pages entre elles et sont communs à tout
le site via `app/layout.tsx`.

## Le cadre légal (à ne pas sauter)

1. **Permis d'exploitation** pour la vente à distance (licence à emporter) —
   un site marchand d'alcool est juridiquement assimilé à un débit de
   boissons à emporter.
2. **Statut d'entrepositaire agréé** — en cours de démarche, nécessaire pour
   vendre légalement, en ligne comme en boutique. C'est pour cette raison
   que la précommande actuelle ne prend aucun paiement : la vraie vente
   n'aura lieu qu'une fois ce statut obtenu.
3. Le site inclut déjà : bandeau d'avertissement sur chaque page,
   vérification d'âge avant tout accès, confirmation d'âge redemandée avant
   chaque précommande.
4. **Transporteur** : vérifie que ton transporteur (Colissimo Pro,
   Chronopost) accepte bien l'expédition d'alcool — toutes les offres
   standard ne l'acceptent pas.
5. **Zone de livraison** : la vraie boutique (`app/api/checkout/route.ts`)
   est volontairement limitée à la France. Vendre vers d'autres pays UE
   demande de traiter la TVA (régime OSS) et les accises différemment — à
   faire évoluer plus tard.
6. Ce README n'est pas un avis juridique — fais valider ce dispositif de
   précommande (et le passage au paiement réel en 2027) par un professionnel
   avant mise en ligne publique.

## Étapes pour mettre en ligne la phase précommande actuelle

### 1. Créer les comptes nécessaires (gratuits pour démarrer)
- [supabase.com](https://supabase.com) — base de données (précommandes)
- [vercel.com](https://vercel.com) — hébergement (se connecte directement à GitHub)
- Un compte GitHub (tu en as déjà un pour Valorimmo)

### 2. Créer ta base Supabase
Nouveau projet sur Supabase, puis dans l'onglet **SQL Editor**, colle le
contenu de `supabase/schema.sql` et exécute — ça crée les tables de
précommandes, le compteur par cuvée, et (pour plus tard) les tables de la
vraie boutique.

### 3. Pousser le code sur GitHub
```
git init
git add .
git commit -m "Site Maison Antoinette Gay - phase precommande"
git remote add origin <url-de-ton-repo-github>
git push -u origin main
```

### 4. Déployer sur Vercel
- Connecte ton repo GitHub à Vercel (import direct, comme pour Valorimmo)
- Dans Vercel > Settings > Environment Variables, ajoute les 3 variables
  Supabase du fichier `.env.example` avec tes vraies clés (les 2 variables
  Stripe ne sont pas nécessaires pour l'instant)
- Vercel déploie automatiquement à chaque `git push`

### 5. Relier le nom de domaine
Le domaine est `www.maisonantoinettegay.fr` (voir `NOM_DOMAINE` dans
`lib/config.ts`) — une fois réservé chez ton registrar, relie-le à Vercel
dans Settings > Domains.

## Passage à la vraie boutique (2027)

Quand le permis et l'agrément entrepositaire seront obtenus :
1. Crée tes produits dans le dashboard Stripe (un par cuvée + coffret),
   copie les `Price ID` (`price_xxx`) dans `lib/produits.ts` à la place des
   `price_REMPLACER_...`.
2. Ajoute les 2 variables Stripe dans Vercel (voir `.env.example`).
3. Configure le webhook Stripe : Stripe > Développeurs > Webhooks, URL
   `https://tondomaine.fr/api/webhook`, événement
   `checkout.session.completed`.
4. Remets en avant le vrai tunnel d'achat (`app/api/checkout`) à la place du
   formulaire de précommande — ou fais les deux cohabiter le temps d'honorer
   les précommandes en priorité.
5. Ajoute la proposition d'éthylotest au moment du paiement (texte sur la
   page succès, ou case à cocher au checkout).

Stripe fournit un **mode test** (clés `sk_test_...`) avec des numéros de
carte bidon pour vérifier tout le tunnel d'achat sans dépenser un centime.
Ne bascule en clés `sk_live_...` qu'une fois le permis d'exploitation en
règle.

## Lancer en local pour développer

```
npm install
cp .env.example .env.local   # puis remplis tes cles Supabase
npm run dev
```
Le site est alors visible sur http://localhost:3000
