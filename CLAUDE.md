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

- Kawaii et « dessiné à la main » : contours épais `#5b4250` (variable `INK`), aplats pastel, filtre SVG `#wobble` qui fait trembler légèrement le trait.
- Renards façon chibi / Neko Atsume : corps rond en brioche, petits yeux en points brillants, museau crème, bouche « ω », joues roses. Trois poses : `sit`, `sleep`, `happy`. Tout est dessiné par `foxSVG(fox, {pose, sil})`, une copie identique dans chaque jeu.
- Les 30 renards (`FOXES`) sont communs aux deux jeux : couleurs `c`, accessoire `acc`, rareté `rar` (commun, discret, rare, legend).
- Vue de dessus pour la Clairière, inspirée de Neko Atsume. Joffray a explicitement demandé ce point de vue.
- Pas d'emoji dans l'interface, pas de personnages ni d'éléments repris de jeux existants : toutes les créatures sont originales.

## Kitsune Café (`cafe.html`)

Progression : une **carte** (écran d'accueil du jeu) de 40 journées en 4 saisons de 10 (`CHAP` : Printemps, Été, Automne, Hiver). On peut rejouer n'importe quelle journée ouverte. 1★ ouvre la journée suivante. Entre deux saisons, une porte demande un total d'étoiles (20, 45, 72). Chaque journée a un coffre qui paie les étoiles nouvellement gagnées (gros bonus à la première ★★★, rien quand on rejoue sans progresser). Les recettes se gagnent sur la carte (`REC[k].day` : thé jour 2, cookie 5, chocolat 7, smoothie 11, gâteau 16). Une saison entière en ★★★ invite son renard d'honneur (Zaza, Flocon, Professeur Noisette, Comète), qui vient ensuite en VIP. La saison change le décor et la carte du café :
- La salle est une **véranda** vitrée qui montre le dehors (`outsideSVG`, `roomSVG`, table `OUT`) : pluie de pétales et arc-en-ciel au Printemps, grand soleil et papillons en Été, feuilles qui tombent en Automne, nuit étoilée et neige en Hiver. Le paysage réutilise les dessins de la carte (`DECO`). Les animations sont hors du filtre `#wobble`, sinon le filtre est recalculé à chaque image.
- Les recettes changent de nom et de dessin selon la saison (`VAR`, `SEA`, `vName`, icônes `ICON["clé@saison"]`) : tartelette myrtille, tartelette fraise, tarte aux pommes, pumpkin pie à la place du croissant, etc. La clé, le prix et la cuisson ne changent pas, donc l'équilibrage et les sauvegardes non plus. Le café reste le même toute l'année.
- Joffray a aimé et veut garder : la guirlande lumineuse en haut, les petites étagères à livres. Il a trouvé inutile l'ardoise du menu (supprimée).

Boucle d'une journée : N clients. L'écran de jeu doit tenir sans défiler sur un téléphone : en-tête compact (le bouton retour met en pause), la salle, le plateau, puis deux rangées de tuiles : les boissons, puis le four et une tuile par pâtisserie. Les boissons se préparent et se prennent quand elles sont prêtes. Une tuile de pâtisserie sert aussi de vitrine : on la touche pour en poser une sur le plateau, ou pour lancer une fournée si la vitrine est vide (le petit bouton four en coin en relance une d'avance). On touche le four pour sortir la fournée avant qu'elle brûle. Tout passe par le plateau (3 ou 4 places), puis on touche le client pour le servir. Le client paie prix + pourboire selon la patience restante, avec un bonus de combo si on enchaîne les services rapides.

Depuis la carte, il y a une boutique d'équipement et de déco (16 achats, dont 5 de fin de partie qui n'arrivent qu'avec l'Automne ou l'Hiver). Les achats de déco sont visibles dans la salle. Autres mécaniques : objectif de recette notée de 1 à 3 étoiles (objectif, ×1,35, ×1,7), réessai si l'objectif est raté, coffre surprise, 3 quêtes actives, bonus de connexion quotidien avec série, carnet des clients avec des VIP (prix ×2) à partir du jour 3 : renards « discret », plus les invités d'honneur débloqués.

Fonctions clés : `cfgOf(day)` (difficulté, table `GOALK`), `newDay(d)`, `spawn`, `update(dt)`, `complete` (calcul des gains), `tapStation`, `bake`, `unload`, `endDay`, `openMap`/`renderMap`/`mapLayout` (carte), `daySheet`, `shop`. `S.day` est la plus haute journée atteinte, `G.day` la journée en cours. La sauvegarde est en version 2 (`S.ver`), avec migration depuis la v1.

### Équilibrage

Il a été réglé avec `tools/balance-bot.py` : un bot qui prend des décisions parfaites, avec un temps de réaction de 0,45 s (expert) ou 0,8 s (bon joueur). Il possède les recettes de la carte et un kit d'achats réaliste pour chaque jour (`KIT`), et joue chaque journée plusieurs fois pour faire la moyenne. Cibles actuelles :

- Jours 1 à 4 : le bon joueur fait environ 1,4 à 1,6 fois l'objectif (2 étoiles). Les 3 étoiles demandent une partie quasi parfaite.
- Jour 8 : le bon joueur passe tout juste.
- Jours 10 à 40 : le bon joueur fait 1,0 à 1,3 fois l'objectif, l'expert 1,45 à 1,9.
- Rejouer avec tout l'équipement : ★★★ facile jusqu'au jour 17 environ ; au-delà, il faut jouer comme l'expert. C'est voulu : les portes se passent en rejouant les premières saisons, et les invités des dernières saisons sont le défi ultime.

Après tout changement de prix, de patience, de pourboire ou d'objectif, relance le bot et vérifie que ces cibles tiennent.

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
