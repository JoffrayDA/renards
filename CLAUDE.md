# Kitsune Café — contexte du projet

**Kitsune Café** (anciennement « Renards », renommé en octobre 2026) : deux jeux kawaii avec des renards, publiés sur GitHub Pages (`https://joffrayda.github.io/renards/`) et installables sur téléphone. Le propriétaire, Joffray, joue lui-même et donne des retours. Il écrit en français et veut des réponses concises.

## Structure

- `index.html` : accueil, choix entre les deux jeux.
- `cafe.html` : **Kitsune Café**, jeu de gestion actif. C'est le jeu principal.
- `clairiere.html` : **La Clairière**, jeu détente façon Neko Atsume.
- `manifest.webmanifest`, `sw.js`, `icons/`, `img/` : PWA (installation sur l'écran d'accueil, hors ligne).
- `tools/balance-bot.py` : bot qui joue au Café pour vérifier l'équilibrage.

Chaque jeu tient dans un seul fichier HTML autonome (CSS et JS inline, aucune dépendance, aucun build). Seules les polices viennent de Google Fonts (Mochiy Pop One pour les titres, Zen Maru Gothic pour le texte). Les sauvegardes sont en `localStorage` : `cafe-renards-v1` et `clairiere-renards-v1`. Si tu changes leur forme, écris une migration, ne casse pas les parties existantes.

**À chaque modification publiée, incrémente `CACHE` dans `sw.js`** (`renards-v1` → `renards-v2`…), sinon les téléphones gardent l'ancienne version.

Découper les gros fichiers HTML en modules (`js/`, `css/`) est bienvenu si ça aide. Il faut alors ajouter les nouveaux fichiers à la liste `FILES` de `sw.js`.

## Direction artistique

- Les pièces du Café portent une pattoune (`coinSVG`).
- Kawaii et « dessiné à la main » : contours épais `#5b4250` (variable `INK`), aplats pastel, filtre SVG `#wobble` qui fait trembler légèrement le trait.
- Renards façon chibi / Neko Atsume : corps rond en brioche, petits yeux en points brillants, museau crème, bouche « ω », joues roses. Trois poses : `sit`, `sleep`, `happy`. Tout est dessiné par `foxSVG(fox, {pose, sil})`, une copie identique dans chaque jeu.
- Les 30 renards (`FOXES`) sont communs aux deux jeux : couleurs `c`, accessoire `acc`, rareté `rar` (commun, discret, rare, legend).
- Vue de dessus pour la Clairière, inspirée de Neko Atsume. Joffray a explicitement demandé ce point de vue.
- Pas d'emoji dans l'interface, pas de personnages ni d'éléments repris de jeux existants : toutes les créatures sont originales.

## Kitsune Café (`cafe.html`)

Progression : une **carte** (écran d'accueil du jeu) de 40 journées en 4 saisons de 10 (`CHAP` : Printemps, Été, Automne, Hiver). On peut rejouer n'importe quelle journée ouverte. 1★ ouvre la journée suivante. Entre deux saisons, une porte demande un total d'étoiles (20, 45, 72). Chaque journée a un coffre qui paie les étoiles nouvellement gagnées (gros bonus à la première ★★★, rien quand on rejoue sans progresser). Les recettes se gagnent sur la carte (`REC[k].day` : thé jour 2, cookie 5, chocolat 7, smoothie 11, gâteau 16). Une journée ne propose que les recettes gagnées avant elle (`onMenu`), même quand on la rejoue plus tard : rejouer le jour 1 = café et croissants seulement (demande de Joffray). Une saison entière en ★★★ invite son renard d'honneur (Zaza, Flocon, Professeur Noisette, Comète), qui vient ensuite en VIP. La saison change le décor et la carte du café :
- La salle est une **véranda** vitrée qui montre le dehors (`outsideSVG`, `roomSVG`, table `OUT`) : pluie de pétales et arc-en-ciel au Printemps, grand soleil et papillons en Été, feuilles qui tombent en Automne, nuit étoilée et neige en Hiver. Le paysage réutilise les dessins de la carte (`DECO`). Les animations sont hors du filtre `#wobble`, sinon le filtre est recalculé à chaque image.
- Les recettes changent de nom et de dessin selon la saison (`VAR`, `SEA`, `vName`, icônes `ICON["clé@saison"]`) : le Printemps garde le vrai croissant (demande de Joffray) et son cookie devient la tartelette myrtille (jour 5) ; tartelette fraise, tarte aux pommes, pumpkin pie remplacent le croissant aux saisons suivantes, etc. La clé, le prix et la cuisson ne changent pas, donc l'équilibrage et les sauvegardes non plus. Le café reste le même toute l'année.
- Joffray a aimé et veut garder : la guirlande lumineuse en haut, les petites étagères à livres. Il a trouvé inutile l'ardoise du menu (supprimée).

Boucle d'une journée : N clients. L'écran de jeu doit tenir sans défiler sur un téléphone : en-tête compact (le bouton retour met en pause), la salle, le plateau, puis deux rangées de tuiles : les boissons, puis le four et une tuile par pâtisserie. Les boissons se préparent et se prennent quand elles sont prêtes. Une tuile de pâtisserie sert aussi de vitrine : on la touche pour en poser une sur le plateau, ou pour lancer une fournée si la vitrine est vide (le petit bouton four en coin en relance une d'avance). On touche le four pour sortir la fournée avant qu'elle brûle. Tout passe par le plateau (3 ou 4 places), puis on touche le client pour le servir. Pour jeter un article du plateau, il faut le toucher deux fois (le 1er toucher l'arme, avec une poubelle). Le rendu met à jour les clients, le plateau et la cuisine sans tout reconstruire : sinon les animations d'entrée rejouent et les personnages « sautent ». Le client paie prix + pourboire selon la patience restante, avec un bonus de combo si on enchaîne les services rapides.

Économie (refaite le 21/10/2026 parce que Joffray avait 4000 pièces sans rien à acheter) :
- La recette (prix + pourboire + combo, ×3 pour un VIP) sert aux étoiles. En pièces, on ne garde que le **bénéfice** : recette moins les ingrédients (`REC[k].cost`, environ 75 % du prix). Une fournée brûlée coûte ses ingrédients.
- Rejouer une journée déjà réussie ne rapporte que **30 %** du bénéfice (`G.replay`). Le coffre paie toujours les nouvelles étoiles.
- Boutique à **niveaux** (`UPG`, `S.own[id]` = niveau atteint, lu par `lv(id)`) : Équipement, Déco, et un onglet **Style** purement décoratif (`STYLE` : papier peint, comptoir, tenue de Roussette sur la carte ; choix dans `S.style`, achats dans `S.own["st-…"]`).
- `python tools/balance-bot.py --economie` simule les pièces d'un bon joueur face aux achats du kit : le kit doit rester abordable à temps, et il ne doit pas rester beaucoup de pièces sans usage. Autres mécaniques : objectif de recette notée de 1 à 3 étoiles (objectif, ×1,35, ×1,7), réessai si l'objectif est raté, coffre surprise, 3 quêtes actives (faisables en une ou quelques journées ; l'écran de fin montre celles réussies et l'avancée du jour, car Joffray croyait ses quêtes non comptées), bonus de connexion quotidien avec série, carnet des clients avec des VIP (prix ×3 mais moitié moins de patience, idée de Joffray : un pari risqué) à partir du jour 3 : renards « discret », plus les invités d'honneur débloqués.

Halloween, la **Nuit des citrouilles** (branche `halloween`, octobre 2026) : active du 17 octobre au 3 novembre (`HW`, forçable avec `?halloween=1` ou `?halloween=0` pour tester). Ciel de crépuscule avec lune et chauves-souris, toiles d'araignée, citrouilles-lanternes (`jack`) dans la salle et sur la carte, petits fantômes (`ghostie`), guirlande orange et violette. Trois recettes changent de nom et de dessin (`VAR.halloween`, `ICON["clé@halloween"]`, prioritaires sur la saison). La moitié des clients viennent déguisés (`COSTUMES` : sorcière, citrouille, chauve-souris, vampire, tirés avec `Math.random` pour ne pas toucher aux graines) et donnent des **bonbons** (`S.candy`) : 1, ou 2 si servis vite. Cinq invités propres au Café (`HWF`), demandés par Joffray, passent en VIP (70 % des VIP pendant l'événement) : **Feu Follet** (renard fantôme, `ghost:true`, semi-transparent et flottant), **Comte Croquignol** (vampire), **Osselet** (squelette), **Zombidou** (mort-vivant) et **Brin de Paille** (épouvantail) ; ils donnent 5 bonbons. Les bonbons s'achètent dans l'onglet Halloween de la boutique (objets `STYLE` avec un prix `cb` en bonbons) ; ces objets restent ensuite dans l'onglet Style. Les pièces et l'équilibrage ne changent pas.

Fonctions clés : `cfgOf(day)` (difficulté, tables `SEED` et `GOALS`), `newDay(d)`, `spawn`, `update(dt)`, `complete` (calcul des gains), `tapStation`, `bake`, `unload`, `endDay`, `openMap`/`renderMap`/`mapLayout` (carte), `daySheet`, `shop`. `S.day` est la plus haute journée atteinte, `G.day` la journée en cours. La sauvegarde est en version 3 (`S.ver`), avec migrations depuis la v1 et la v2 (v3 : Plateau géant et Grand comptoir deviennent des niveaux 2, ajout de `S.style`).

### Équilibrage

Chaque journée est **la même à chaque essai** : commandes, VIP et arrivées sont tirées avec une graine propre au jour (`SEED`), pour que les étoiles mesurent le jeu et pas la chance. Les objectifs (`GOALS`) et les graines sont calculés par `python tools/balance-bot.py --calibrer` (qui évite les graines où un VIP pressé pénalise le bon joueur), avec un bot aux décisions parfaites et un kit d'achats réaliste pour chaque jour (`KIT`) :

- ★★★ (1,7 × objectif) demande environ 94 % du score du bot « parfait » (réaction 0,25 s), à tous les jours. On garde la graine dont le score parfait est proche d'une courbe lissée, pour que les objectifs montent régulièrement.
- Le bon joueur (0,8 s) doit toujours réussir (au moins 1,08 × objectif) : l'objectif est plafonné en conséquence.
- Résultat au premier passage : bon joueur ★★★ aux jours 1-2 (peu de clients, le score dépend surtout des commandes), ★★ aux jours 3-6, puis ★ (×1,1 à 1,4) ; expert (0,45 s) ×1,55 à 2,1.
- Rejouer avec tout l'équipement : ★★★ facile jusqu'au jour 17 ; au-delà, ★★ à ★★★. Les portes se passent en rejouant, les invités des dernières saisons restent le défi ultime.
- Retour de Joffray à l'origine de ce réglage : « jour 1 bien joué = 2★, jour 2 en galérant = 3★ ». Avant, le jour 1 plafonnait sous les ★★★ et le jour 2 dépendait des commandes tirées.

Après tout changement de prix, de patience, de pourboire, de recettes ou de rythme, relance `--calibrer`, recopie `SEED` et `GOALS` dans `cafe.html`, puis relance le bot pour vérifier ces cibles.

## Clairière aux Renards (`clairiere.html`)

Jeu idle. On pose des objets sur 9 emplacements et on remplit la gamelle. Les renards passent même page fermée (simulation rattrapée au retour, par pas de 30 s, plafonnée à 48 h) et laissent des glands. Le jeu compte 4 zones (Clairière, Berge, Terrier, Neige) avec chacune ses objets, sa météo (pluie, neige ou rien) et 6 renards. S'y ajoutent les niveaux d'amitié de 1 à 5, avec un souvenir au niveau 3 et des cadeaux ×2 au niveau 5, et deux mini-jeux : Cache-cache et Repas express.

Ce jeu est le « moment détente ». Il n'a pas besoin d'être difficile, mais il souffre de problèmes connus, voir ci-dessous.

## Leçons tirées des retours de Joffray

- « On dirait un jeu pour enfant de 2 ans » : la première version était trop simple visuellement. Il veut du très mignon, du soigné, avec de l'ambiance (pluie, lumière, détails).
- « Aucun renard ne vient » : la fréquence des visites de la Clairière était trop basse. Il veut du retour visible rapidement.
- « J'ai fini le jeu » puis « j'ai tout débloqué trop facilement, on s'ennuie » : l'économie de la Clairière est trop généreuse (visites accélérées, mini-jeux qui rapportent trop), et aucun choix n'y a d'importance. C'est ce qui a mené au Café, qu'il a trouvé « sympa ».
- Il veut un jeu « le plus addictif possible » : objectifs clairs, échec possible, choix qui comptent, progression visible, récompenses variées.
- Il veut que le jeu lui rapporte de l'argent (décision d'octobre 2026). Pistes : pubs récompensées, cosmétiques, pass de saison, achat « sans pub », publication sur les stores (TWA pour le Play Store, Capacitor pour l'App Store). Penser RGPD et public mineur.
- Il préfère qu'on corrige et qu'on teste avant de lui montrer, plutôt qu'enchaîner des versions non vérifiées.

## Pistes pour la suite

- Faire tester le Café sur téléphone et ajuster la taille des zones tactiles, la lisibilité des bulles et le rythme.
- Clairière : ralentir l'économie (prix des zones, gains des mini-jeux, limite de parties par jour), ajouter des quêtes du jour et des combinaisons secrètes pour les renards rares.
- Café : événements spéciaux (rush, client mystère), recettes combinées, personnalisation du café, saisons.
- Sons doux et vibrations (à déclencher seulement après une interaction).
- Backend **Firebase** (décidé, pas encore commencé) : sauvegarde cloud, classement, amis, événements live. Connexion : **compte anonyme Firebase dès le lancement, sans écran de connexion**, puis proposition de lier un compte Google au bon moment (changer d'appareil, classement, amis, achat). Ne pas imposer la connexion au démarrage.
- Installation Android : l'identifiant du manifeste est `/renards/app`. Ne plus le changer, sinon les téléphones voient une autre app.

## Vérifier avant de livrer

1. Ouvrir la page dans Chromium (Playwright est pratique) en largeur bureau (760 px) et téléphone (390 px), et vérifier qu'il n'y a aucune erreur dans la console.
2. Pour le Café, relancer `python tools/balance-bot.py` après tout changement d'équilibrage.
3. Incrémenter `CACHE` dans `sw.js`, puis faire le commit et le push.
