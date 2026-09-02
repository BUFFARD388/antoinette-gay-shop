-- A executer dans Supabase > SQL Editor.
-- Ce fichier peut etre relance sans risque (create if not exists / or replace partout).

-- ============================================================
-- PHASE ACTUELLE : precommande (sans paiement)
-- ============================================================

-- Une ligne par precommande recue via le formulaire du site.
-- Remplie uniquement par la route serveur /api/precommande (cle service_role) :
-- aucune ecriture ni lecture directe depuis le navigateur.
create table if not exists precommandes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  prenom text,
  telephone text,
  produits jsonb not null,        -- [{ slug, nom, quantite, numeros: [12, 13] }, ...]
  date_naissance_confirmee boolean not null default false,
  accepte_contact boolean not null default true,
  created_at timestamptz default now()
);

alter table precommandes enable row level security;
-- Aucune police (policy) definie ci-dessus : personne ne peut lire ni ecrire
-- cette table avec la cle publique (anon). Seule la cle service_role (utilisee
-- uniquement cote serveur, jamais exposee au navigateur) peut y acceder.

-- Compteur de precommandes par cuvee/coffret (slug), incremente de facon
-- atomique par la fonction incrementer_compteur ci-dessous. C'est ce compteur
-- qui alimente a la fois le nombre affiche publiquement sur le site et le
-- numero de serie attribue a chaque bouteille precommandee.
create table if not exists precommande_compteurs (
  slug text primary key,
  compteur integer not null default 0
);

alter table precommande_compteurs enable row level security;

create policy "Lecture compteur publique"
  on precommande_compteurs for select
  using (true);
-- Pas de police d'ecriture publique : seule la fonction ci-dessous
-- (executee avec la cle service_role depuis la route API) peut modifier
-- ce compteur.

-- Incremente le compteur d'un slug donne et renvoie le nouveau total.
-- Appelee depuis app/api/precommande/route.ts, une fois par ligne de panier.
-- Si la precommande porte sur 3 bouteilles d'une cuvee et que le compteur
-- passe de 10 a 13, les numeros attribues sont 11, 12 et 13.
create or replace function incrementer_compteur(p_slug text, p_quantite integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  nouveau_total integer;
begin
  insert into precommande_compteurs (slug, compteur)
  values (p_slug, p_quantite)
  on conflict (slug) do update
    set compteur = precommande_compteurs.compteur + excluded.compteur
  returning compteur into nouveau_total;

  return nouveau_total;
end;
$$;

-- ============================================================
-- PHASE FUTURE : vraie boutique avec paiement Stripe (a partir de 2027)
-- Tables deja prevues pour le jour ou app/api/checkout et app/api/webhook
-- repasseront en paiement reel. Rien a faire avec elles pour l'instant.
-- ============================================================

create table if not exists commandes (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  email text,
  nom_client text,
  adresse jsonb,
  produits jsonb not null,        -- liste des articles commandes (slug, nom, quantite, prix)
  montant_total integer not null, -- en centimes
  statut text default 'payee',    -- payee / expediee / annulee
  date_naissance_confirmee boolean default false,
  created_at timestamptz default now()
);

alter table commandes enable row level security;

create table if not exists stock (
  slug text primary key,
  quantite_disponible integer not null default 0
);

alter table stock enable row level security;

create policy "Lecture stock publique"
  on stock for select
  using (true);
