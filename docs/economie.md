# Économie : de quoi dépenser (fiche, 30/10/2026)

Constat de Joffray : on gagne des pièces, mais il n'y a presque rien à acheter. Décision : pas de troisième jeu. Le Café rapporte, et on dépense ce qu'on gagne pour embellir la Clairière, la maison et le Café (logique Neko Atsume / Animal Crossing).

## Réponses de Joffray

| # | Question | Réponse |
|---|---|---|
| 1 | Lien entre les jeux | Les pièces du Café servent aussi à la Clairière |
| 2 | Quoi acheter | Déco et tenues |
| 3 | Où décorer | Clairière, maison et Café |
| 4 | Pose des objets | Libre : on fait glisser l'objet où on veut. On peut aussi agrandir et améliorer la maison |
| 5 | Durée | Jamais fini : il y a toujours du nouveau |
| 6 | Boutique du jour | Oui |
| 7 | Objets d'événement | Seulement pendant l'événement (ils reviennent l'année suivante) |
| 8 | Calendrier de l'Avent | Monnaie chaque jour, un objet tous les 3 ou 4 jours, un gros cadeau le 24 |
| 9 | Jour raté | 2 « gels » comme sur Duolingo ; au 3e jour raté, on ne peut plus rattraper |
| 10 | Les étoiles du Café rapportent pour la Clairière | Sans avis : on dit oui, en clochettes (voir plus bas) |
| 11 | Rejouer une journée | 50 % du bénéfice (au lieu de 30 %) |
| 12 | Argent réel plus tard | Déco, tenues, et aussi bonus et monnaie |

## Trois monnaies, chacune son rôle

- **Pièces** (Café) : la monnaie de tous les jours. Équipement du Café, comme avant, et maintenant tout le catalogue de déco et de tenues. Un seul porte-monnaie pour les deux jeux.
- **Glands** (Clairière) : sans changement. Gamelle, objets du refuge, aménagements de Copeau.
- **Clochettes** (nouvelle, rare) : les beaux objets de la boutique du jour. Plus tard, c'est la monnaie qu'on pourra acheter avec de l'argent réel (réponse 12). On en gagne 3 à 6 par jour en jouant normalement :
  - +1 par nouvelle étoile au Café, +2 de plus à la première ★★★ d'une journée ;
  - +2 à la fin d'une histoire de la Clairière ;
  - +1 par quête du Café terminée ;
  - et via le calendrier de l'Avent.
- **Monnaie d'événement** : bonbons à Halloween, **sucres d'orge** à Noël. Ils ne servent qu'à la boutique de l'événement.

Technique : la Clairière lit et écrit les pièces dans la sauvegarde du Café (`cafe-renards-v1`). Elle relit la sauvegarde juste avant chaque achat. Un seul jeu est ouvert à la fois dans l'app, donc il n'y a pas de conflit. La sauvegarde en ligne copie déjà les deux parties.

## Rejouer à 50 %

`G.replay ? .3 : 1` devient `.5`, et l'écran de fin affiche « rejouée : 50 % ». Le kit d'équipement devient plus facile à payer. Ce n'est pas grave : la déco absorbe le surplus. On relance `balance-bot.py --economie` pour vérifier.

Revenu visé d'un joueur régulier : environ 300 pièces par jour au début, 1 000 à 1 500 en fin de carte (3 à 5 journées rejouées par jour).

## Le catalogue

Il fait environ 70 objets au départ. On en ajoute avec chaque saison et chaque événement : c'est ce qui rend le jeu « jamais fini ».

| Lieu | Nombre | Exemples |
|---|---|---|
| Clairière (dehors) | 25 | bancs, bornes-lanternes, massifs de fleurs, nichoir, épouvantail, petit pont, puits, hamac, bonhomme de paille, champignons géants, mangeoire à oiseaux |
| Maison | 20 | canapé pour 3 (envie de Joffray), tableaux, plantes, tapis, horloge, bibliothèque, lampes, rideaux, papier peint, plancher |
| Café | 15 | plantes, cadres, comptoir, chaises, vitrine, lustre (seulement dans les zones qui ne gênent pas le service) |
| Tenues | 10 | bonnet, écharpe, nœud, lunettes, cape, couronne de fleurs… à mettre à n'importe quel renard du refuge, par-dessus son accessoire |

**Prix en pièces :**

| Gamme | Prix |
|---|---|
| Petits objets | 150 à 400 |
| Moyens | 500 à 1 200 |
| Grands (meubles, constructions) | 1 500 à 4 000 |

Les objets à clochettes coûtent 10 à 40 clochettes.

**Les objets attirent les renards** (comme dans Neko Atsume) :
- chaque objet a un endroit où un renard se pose (comme le panier ou le pot de fleurs) ;
- certains objets ont un renard préféré : il vient plus souvent et laisse une photo spéciale ;
- un inconnu de la forêt peut ne venir que si tel objet est posé. Ça donne une raison d'acheter autre chose que « c'est joli ».
- Rien ne se dégrade : pas de corvée (Joffray a refusé « la gamelle est vide »).

## Pose libre (mode déco)

- Un bouton Décorer dans chaque lieu ouvre le mode déco :
  - on fait glisser un objet de l'inventaire vers la scène, on le déplace, on le retourne (miroir), on le range ;
  - les renards se figent pendant ce temps.
- Placement : `{id, x, y, flip}` par lieu (`R.deco.dehors`, `R.deco.maison`, `S.deco`). Profondeur : plus un objet est bas à l'écran, plus il passe devant.
- Zones interdites : la mare, la porte, les chemins de passage des renards. Au Café : le comptoir et les places des clients.
- **Agrandir la maison** (réponse 4) : extensions payées en pièces, chacune ajoute de la place et des emplacements :
  - véranda ;
  - grenier ;
  - deuxième pièce.

## Boutique du jour

- 5 objets par jour, les mêmes pour tout le monde (tirés avec la date comme graine), renouvelés à minuit :
  - 3 en pièces ;
  - 1 en clochettes ;
  - 1 objet d'événement pendant un événement.
- Chaque objet du catalogue revient au moins tous les 10 jours : personne ne rate un objet pour toujours.
- Pas de boîte surprise ni de tirage au hasard payant : on voit toujours ce qu'on achète (public mineur, règles sur les loot boxes).

## Calendrier de l'Avent (1er au 24 décembre)

- Une case par jour. La case du 24 ouvre le dernier chapitre de l'histoire du sapin à la Clairière.
- **2 gels** : une case ratée reste « à rattraper » et se rouvre plus tard en consommant un gel. Au 3e jour raté, les cases ratées sont perdues (les suivantes restent ouvertes).
- Ouvrir les 24 cases (gels compris) donne aussi l'Étoile dorée du sapin.

| Jour | Cadeau | Jour | Cadeau |
|---|---|---|---|
| 1 | 100 pièces | 13 | 2 Pots à pourboires |
| 2 | 20 sucres d'orge | 14 | 250 pièces |
| 3 | 3 clochettes | 15 | 5 clochettes |
| 4 | **Bonhomme de neige** (Clairière) | 16 | **Luge** (Clairière, un renard s'y assoit) |
| 5 | 150 pièces | 17 | 35 sucres d'orge |
| 6 | 25 sucres d'orge | 18 | 300 pièces |
| 7 | 1 Tisane calmante | 19 | 1 Invitations dorées |
| 8 | **Guirlande de pommes de pin** (maison) | 20 | **Couronne de houx** (porte du Café) |
| 9 | 4 clochettes | 21 | 6 clochettes |
| 10 | 200 pièces | 22 | 40 sucres d'orge |
| 11 | 30 sucres d'orge | 23 | 400 pièces |
| 12 | **Bonnet à pompon** (tenue) | 24 | **Traîneau de Barbe-Neige** (Clairière) + **écharpe tricotée** (tenue) |

Du 25 décembre au 6 janvier, l'événement continue sans calendrier : les Nuits de Noël, la boutique de sucres d'orge et le sapin décoré.

## Argent réel (plus tard, rien n'est codé maintenant)

- On pourra vendre :
  - des packs de clochettes ;
  - des tenues et des objets exclusifs ;
  - des bonus (Tisane, Pot à pourboires…) ;
  - un « sans pub » si on met des pubs récompensées.
- Tout doit rester gagnable en jouant, juste plus lentement.
- Public mineur : prix affichés clairement, pas de boîte surprise, contrôle parental des stores.

## Ordre de travail proposé (Noël le 1er décembre)

1. **Jusqu'au 15/11** :
   - porte-monnaie commun ;
   - replay à 50 % ;
   - clochettes ;
   - mode déco libre (Clairière et maison) ;
   - catalogue v1 (environ 30 objets) ;
   - boutique du jour.
2. **Jusqu'au 30/11** : Noël :
   - Clairière enneigée ;
   - histoire du sapin ;
   - les 6 invités ;
   - Nuits de Noël au Café ;
   - sucres d'orge ;
   - calendrier ;
   - les objets de Noël, dont le bonnet et l'écharpe (premières tenues).
3. **Après Noël** :
   - déco du Café ;
   - reste des tenues ;
   - agrandissements de la maison ;
   - suite du catalogue.

Le Monde 2 glisse donc à janvier.
