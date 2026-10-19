-- A executer dans Supabase > SQL Editor (peut etre relance sans risque).
-- Ajoute a la table precommandes :
--   source : reponse a "Comment as-tu connu la Maison ?" (proche, facebook, ...)
--   ref    : identifiant de parrainage du lien recu (?ref=prenom)
alter table precommandes add column if not exists source text;
alter table precommandes add column if not exists ref text;
