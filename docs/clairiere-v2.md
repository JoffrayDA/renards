# La Clairière, version 2 — fiche de conception

*Rédigée le 24/10/2026 avec Joffray. Codé le 24/10/2026 : la planche, la scène, la vie par petits sauts, les arrivées, la gamelle et la simulation (étapes 1 à 4). Histoire de Petit Pois codée le 24/10/2026 (`js/clairiere/story.js`). Compagnon codé le 25/10/2026. Histoires de Mitaine et Gribouille le 25/10/2026. Histoires refaites le 26/10/2026 (une à la fois, en une visite, repères « ! » et journal, Gribouille en dernier ; voir CLAUDE.md, section Clairière). Reste : les histoires des autres renards, la page « c'est toi » du carnet ; ensuite, le test avec la copine de Joffray.*

## L'intention

La Clairière était l'idée de départ de l'app (un Tamagotchi de renards). Le Café est venu ensuite pour gamifier. Les deux ont deux rôles différents :

- **le Café**, c'est la tension : objectifs, échec possible, étoiles ;
- **la Clairière**, c'est le moment pour souffler : kawaii, cosy, calme, il pleut. Elle ne doit pas être addictive mais **désirable**.

On ne juge donc pas la Clairière avec les critères du Café. C'est ce qui a abîmé la version 1 : visites accélérées, glands trop faciles, paliers à acheter, mini-jeux.

**Le récit.** Roussette tient le Café le jour. Le soir, elle rentre dans sa petite maison en forêt, et certains de ses clients la suivent. La Clairière est **son refuge, et le joueur, c'est Roussette.**

## Ce qu'on garde, ce qu'on supprime

| On garde | On supprime |
|---|---|
| Les 30 renards, leurs bios et leurs couleurs | Les deux mini-jeux (Cache-cache, Repas express) |
| Les niveaux d'amitié (1 à 5) | Les glands qui tombent du ciel (mini-jeux, visites accélérées) |
| Les souvenirs, mais gagnés au bout d'une histoire | Les 4 zones achetables |
| La météo, la pluie, l'ambiance, la musique (Forêt enchantée) | Les glands dorés |
| La simulation page fermée (les renards vivent pendant ton absence) | Les 9 emplacements fixes |
| La vue en hauteur, refaite (voir plus bas) | Les poses actuelles : elles sont redessinées |
| Les glands, mais beaucoup plus rares (voir « Économie ») | |
| Les gamelles à plusieurs niveaux de prix | |

## Le lieu

**Une seule scène**, vue **en plongée** comme le jardin de Neko Atsume : caméra en hauteur, sol vu en biais, renards vus de face ou de trois quarts. Une vraie vue de dessus montrerait le dos des renards et leur ferait perdre leur visage.

- Au fond, en bordure de forêt, **la petite maison en bois de Roussette** : fenêtres éclairées d'une lumière chaude, cheminée qui fume, **porche abrité**.
- Devant, une clairière de mousse avec des **endroits** où les renards vont : le porche, une souche, un tapis de feuilles, une flaque ou un petit étang, un banc, la gamelle près de la porte, des lanternes dans les branches.
- **Cycle du jour en temps réel** : aube, jour, crépuscule, nuit.
- **La météo change la scène.** Quand il pleut, les renards se serrent sous le porche. Quand il fait beau, ils s'éparpillent dans l'herbe.
- **On n'entre pas dans la maison en v1**, mais elle est habitée : le soir, on devine des silhouettes de renards derrière les fenêtres, la porte est entrouverte. L'intérieur viendra plus tard, comme récompense (voir « Plus tard »).

## La vie des renards : par petits sauts

Les renards ne déambulent pas librement : il faudrait gérer les obstacles, l'ordre devant/derrière et les collisions, pour 30 personnages. À la place :

- chaque renard présent a **une activité à un endroit** : dormir en boule, faire sa toilette, manger, jouer avec un autre, regarder la pluie, s'asseoir sur le banc ;
- de temps en temps, il **change d'activité et trottine** jusqu'à l'endroit suivant. Le corps chibi rebondit avec un petit tassement à chaque pas, comme le trottinement du Café ;
- sur place, de petites animations en boucle : respiration, queue, oreilles, clignement des yeux.

C'est la vie de fond, qu'on regarde sans rien faire, comme un aquarium. Elle tourne tout le temps.

**Les vrais événements restent rares : 2 par jour au maximum.** Une arrivée, une étape d'histoire, ou une lettre.

## Les arrivées

Deux portes d'entrée :

1. **Les clients du Café.** Un renard servi content au Café peut suivre Roussette. **Au plus un nouveau renard par jour réel**, tiré parmi les clients bien servis depuis la dernière arrivée (plus on l'a bien servi, plus il a de chances). Le joueur qui enchaîne 10 journées n'en reçoit pas plus que celui qui en joue une, il a seulement plus de candidats.
2. **La gamelle**, indépendante du Café. On la remplit, elle attire de temps en temps un **renard sauvage**. Ça tombe bien : six renards rares ne viennent jamais au Café (Marée, Perle, Somnus, Réglisse, Aurore, Yéti). La gamelle est leur seule porte d'entrée. Elle fait aussi vivre le refuge pour quelqu'un qui ne joue pas au Café.

**Trois gammes de gamelle**, selon ce qu'on est prêt à dépenser :

| Gamelle | Prix | Effet |
|---|---|---|
| Croquettes | gratuites | Les renards déjà installés restent plus longtemps. Aucun sauvage. |
| Baies des bois | glands | Petite chance de visite d'un sauvage du sous-bois : Somnus, Réglisse, Aurore. |
| Poisson | glands | Petite chance de visite d'un sauvage de la rivière : Marée, Perle. |
| Rayon de miel | beaucoup de glands | Le seul mets qui tente le Yéti. |

**La photo de la gamelle.** Un sauvage passe souvent pendant qu'on n'est pas là, puis repart. Il laisse une **photo** de lui en train de manger devant la gamelle, rangée dans un album. C'est la seule trace de son passage, comme dans Neko Atsume, et c'est ce qui donne sa valeur au moment « qui est venu ? ». Il faut que la photo montre ce qu'on ne voit pas ailleurs : la pose « mange », devant la gamelle choisie.

C'est le principal moyen de dépenser des glands, et le seul choix de risque du refuge : on mise des glands sur une visite qui n'est pas garantie.

Le moment fort : **en ouvrant la Clairière, on découvre qui est venu.** C'est la simulation page fermée qui le rend possible.

## Les histoires

Chaque renard a **un arc unique, écrit, en 3 étapes**, réparti sur ses niveaux d'amitié. Exemple : Mitaine a perdu une moufle. Étape 1, elle te le confie. Étape 2, tu trouves un indice. Étape 3, vous la retrouvez ensemble.

- **À la fin de l'histoire**, le renard donne son **souvenir** (ici, la moufle) et peut devenir **compagnon** au Café. Le souvenir est la preuve de sa confiance.
- **Après l'histoire**, il exprime de **petites envies qui reviennent**, sans récit : « Roussette, j'aimerais des feuilles fraîches ». Un même renard peut en redemander une quelques jours plus tard.
- Une étape d'histoire peut demander, par exemple : un objet posé, un moment (la nuit, sous la pluie), la présence d'un autre renard, ou simplement du temps.
- Il faut éviter les demandes génériques (« veut un objet confortable ») : l'attachement vient de ce qui est précis et propre au renard. Joffray prend en charge ce travail d'écriture.

**Format des histoires : une boîte de dialogue.** En bas de l'écran, le portrait du renard dans un carré à gauche, son texte à droite (« Mince, j'ai perdu mes clés… tu m'aides ? »). Le portrait change d'expression selon la réplique : il faut donc des expressions en plus des poses (neutre, joyeux, triste, surpris, gêné).

**Règle : on récompense le retour, on ne punit jamais l'absence.** Un renard ne dépérit pas parce que l'app est restée fermée. Le public peut être mineur, et Google y fait attention pour les jeux familiaux.

### Petit Pois : « Peur du noir »

Ressort : Petit Pois suit Roussette partout parce qu'il a peur de rester seul la nuit. Son histoire demande un **moment** (la nuit), un **autre renard** (Luciole) et du **temps**. Elle explique aussi pourquoi il aide au Café.

Petit Pois ouvre le jeu : ses étapes demandent l'amitié 1, 2 et 3 (au lieu de 2, 3, 4), pour que l'histoire tienne dans la semaine de test. « Le soir » veut dire crépuscule ou nuit (18 h à 6 h). Une seule étape d'histoire par jour réel ; l'accueil compte pour le premier jour. Pour tester : `clairiere.html?heure=22`.

**Étape 1, amitié 1, le soir** :
- `shy` « Roussette… il commence à faire noir. Tu restes un peu dehors avec moi ? »
- `sad` « Quand les lanternes s'éteignent, la forêt fait des bruits. Crac. Hou-hou. »
- `shy` « Je fais semblant de dormir sous le porche, mais je garde un œil ouvert. Les deux, en fait. »
- `open` « Tu crois qu'il existe quelqu'un qui n'a jamais peur du noir ? »

**Étape 2, amitié 2, Luciole installée au refuge**. Luciole n'a pas besoin du Café : dès l'étape 1 finie, elle est l'arrivée du lendemain (« J'ai vu de la lumière chez toi… ») :
- `surprise` « Roussette ! Tu as vu Luciole ? Sa queue fait de la lumière. Toute seule ! »
- `luciole` `joy` « Ce n'est rien, je suis née comme ça. C'est même moi qui allume les lanternes, le soir. »
- `shy` « Dis… tu pourrais rester près de moi, cette nuit ? Juste un peu ? »
- `luciole` `open` « D'accord, petit. Mais il faudra que tu m'aides à les allumer. »

**Étape 3, amitié 3, le soir, Luciole présente** :
- `joy` « Roussette, regarde ! C'est moi qui ai allumé la grande lanterne ! »
- `luciole` `joy` « Du premier coup. Je n'avais jamais vu ça. »
- `open` « En fait, le noir, c'est juste le moment où les lanternes sont jolies. »
- `shy` « Tiens. C'est mon gland porte-bonheur. Je n'en ai plus besoin… enfin, garde-le quand même bien. »
- `joy` « Et maintenant que je n'ai plus peur de rentrer tard, je peux t'aider au Café ! »

**Fin** : souvenir **le gland porte-bonheur**. Petit Pois est le compagnon par défaut ; cette fin débloque le choix du compagnon (on peut ensuite le remplacer par un autre renard dont l'histoire est terminée). Ensuite, Luciole et Petit Pois sont souvent ensemble près des lanternes le soir.

**Petites envies, après l'histoire** : « Une histoire avant de dormir ? » (la nuit), « On fait la course jusqu'à la mare ? », « J'ai trouvé un gland plus gros que ma tête ! »

### Mitaine : « La moufle perdue » et Gribouille : « Le modèle »

Codées le 25/10/2026, texte complet dans `js/clairiere/story.js`. Les deux utilisent une nouvelle condition, **la pluie** (`rain`).

- **Mitaine** (amitié 1, 2 sous la pluie, 3 le soir) : elle a perdu la moufle rouge au flocon tricotée par sa grand-mère ; la pluie fait apparaître un fil de laine sur la mare qui mène au porche ; c'est Petit Pois qui dormait dedans. Elle la lui laisse et te donne l'autre : souvenir **la moufle au flocon**.
- **Gribouille** (amitié 1, 2 sous la pluie, 3 le soir) : il veut peindre tout le monde mais personne ne tient en place ; il dessine sur les vitres embuées, mais les choses ne suffisent pas ; la nuit, les renards endormis tiennent en place. Souvenir **le portrait de Petit Pois endormi**, et l'annonce de la fresque. Gribouille entre dans `FOXES` et remplace Roussette parmi les clients du Café (`REG`) ; le carnet du Café ne compte plus Roussette.

## Économie : les glands, en beaucoup plus rare

Les glands restent la monnaie de la Clairière, séparée des pièces du Café. Le problème de la v1 n'était pas les glands, mais leur rythme : visites accélérées et mini-jeux en donnaient beaucoup trop.

- **Ce qui en donne** : les renards installés laissent quelques glands chaque jour (un peu plus selon l'amitié), et chaque petite envie satisfaite en donne. Les mini-jeux disparaissent, et avec eux la principale source d'abus.
- **Ce qui en coûte** : les objets du refuge et les gamelles de baies ou de miel.
- **Les étapes d'histoire donnent des objets**, pas des glands : un objet nécessaire à une histoire ne doit jamais bloquer faute de glands.
- **Cible de rythme, à vérifier par simulation** (comme `tools/balance-bot.py --economie` pour le Café) : un objet ordinaire tous les 2 à 3 jours de jeu normal, une gamelle de miel une fois par semaine au plus.

## Le compagnon au Café

- **Une seule place**, à côté de Roussette. **Petit Pois** l'occupe par défaut. La place s'ouvre avec l'achat de l'Apprenti serveur, qui coûte 320 pièces et peut déjà s'acheter dès le jour 1 (`UPG` dans `js/cafe/data.js`). Rien à changer : c'est le kit prévu (`KIT`) qui le place au jour 19, pas une limite du jeu. Un joueur qui l'achète plus tôt voit son objectif relevé par `equipBonus`, comme pour toute amélioration achetée en avance.
- À la Clairière, on peut le remplacer par **n'importe quel renard dont l'histoire est terminée**. Ce n'est pas obligatoire.
- **Même rôle, autre visage** : le compagnon fait exactement ce que fait Petit Pois (Apprenti serveur). L'équilibrage, le bot, les graines, les objectifs et `equipBonus` ne changent pas. Le choix reste un choix d'affection, pas d'efficacité.
- Ce qu'il apporte : il **réagit** pendant le service (bulle, saut de joie sur un combo, bâillement en fin de journée), il **apparaît dans l'écran de fin**, et **chaque journée passée ensemble au Café fait monter son amitié** à la Clairière.

## Roussette, l'héroïne

- **Elle n'est plus cliente du Café.** On la retire de `REG` (`js/cafe/data.js:109`). Le client est tiré avec `Math.random` et pas avec la graine (`js/cafe/game.js:36`) : l'équilibrage ne bouge pas. Au jour 1, Galette la remplace.
- **Elle a sa propre page en tête du carnet** (« Roussette, c'est toi »), avec ses tenues. Elle ne compte plus dans les renards à rencontrer.
- **Un 30e renard est à inventer** pour la remplacer, pensé pour le refuge dès le départ. Un renard commun, qui vient aussi au Café. Pistes de noms :
  - **Lumignon (abandonné)** : son rôle passe à **Luciole**, qui a déjà la queue qui brille. C'est elle qui allume chaque soir les lanternes du refuge ;
  - **Gribouille (retenu)** : dessine du bout de la patte sur les vitres embuées les jours de pluie. Pelage vieux rose, béret, taches de peinture, bout de la queue trempé dans le bleu comme un pinceau. Ses dessins sur la vitre peuvent être ses cadeaux ;
  - **Clochette (gardée pour plus tard)** : un grelot au cou, on l'entend avant de la voir. Elle arrive avec les bruitages : son grelot est le premier son du refuge.

**Principe pour les mises à jour** : chaque nouveauté arrive avec un renard dont l'histoire l'introduit. Sésame ouvre la maison, Clochette apporte les sons. Une mise à jour sur le store, c'est un nouveau visage, pas seulement une fonction.
  - **Sésame (gardé pour plus tard)** : garde la clé de la maison et la perd tout le temps. Il arrive avec l'intérieur de la maison : son histoire, c'est retrouver la clé, et la fin de son histoire ouvre la porte ;
- **Petit Pois est le premier arrivant** à la Clairière, et sa première histoire ouvre le jeu. C'est un renardeau, ce qui explique qu'il suive Roussette partout.
- Plus tard : changer la couleur du pelage de Roussette (`foxSVG` dessine à partir des couleurs, donc les tenues restent compatibles). Un cosmétique tout trouvé pour la boutique.

## Le dessin : planche de modèle d'abord

Prototype en cours : `js/foxart.js` (dessin) et `tools/planche.html` (planche à ouvrir dans le navigateur, avant / après). Pas encore branché sur les jeux.

Constat de départ : les trois poses actuelles sont trois modèles différents (brioche assise, tête posée sur un corps mince pour « content », petite tête au bout d'un long pain pour « dort »). Autre constat : une dizaine de renards sont orange ou beige, souvent sans accessoire (Roussette, Galette, Pantoufle étaient indiscernables). On les distingue par des **motifs** (liste blanche, taches de rousseur, chaussettes, bonnet), pas seulement par la couleur.

Avant la scène, on dessine **une planche de modèle** : un seul corps de référence, des proportions fixes, et toutes les poses.

- **Poses** : assis (l'actuelle, réussie), endormi en boule (à refaire), couché éveillé, marche en rebond, toilette, mange, joue, regarde en l'air.
- Chaque renard varie seulement par ses couleurs, son accessoire et, rarement, une **taille assumée** (Petit Pois renardeau, Zaza aux grandes oreilles, Yéti). Les écarts involontaires disparaissent.
- **Un seul fichier de dessin partagé par les deux jeux** (par exemple `js/foxes-art.js`). Aujourd'hui `foxSVG` est copié dans chaque jeu, et les renards finissent par ne plus être pareils d'un jeu à l'autre.

## Technique

- Découper la Clairière comme le Café : `css/clairiere.css`, `js/clairiere/*.js`, sans build. Ajouter les fichiers à `FILES` dans `sw.js` et incrémenter `CACHE`.
- Les animations restent hors du filtre `#wobble`, sinon il est recalculé à chaque image (leçon du Café).
- La simulation page fermée est gardée, mais elle simule des activités, des arrivées et les glands laissés par les renards.

## Ordre de travail

1. Planche de modèle des renards (fichier partagé).
2. La scène : maison, porche, endroits, jour/nuit, pluie.
3. La vie par petits sauts.
4. Les arrivées (Café et gamelle) et la simulation page fermée.
5. **Les histoires de 3 à 5 renards seulement**, dont Petit Pois.
6. Le compagnon au Café.
7. Roussette héroïne (retrait de `REG`, page de carnet).

Puis **une semaine de test avec la copine de Joffray**. Le critère n'est pas « c'est mignon ». C'est : **est-ce qu'elle ouvre la Clairière sans qu'on le lui demande ?** Si oui, on écrit les autres histoires et on ajoute la suite. Sinon, on revoit le ressort avant d'ajouter du contenu.

## Plus tard

- **L'intérieur de la maison**, ouvert par l'histoire de Sésame : cheminée, coussins, renards endormis près du feu. C'est le lieu naturel de la décoration et des cosmétiques payants.
- **L'appareil photo** et les **scènes rares** entre deux renards.
- La couleur du pelage de Roussette.
- Feu Follet et les invités d'Halloween au refuge.

## Les parties existantes

Nouvelle sauvegarde `clairiere-renards-v2`. L'ancienne (`clairiere-renards-v1`) reste intacte dans le téléphone. On n'en reprend qu'une chose : **les renards déjà rencontrés**, notés « déjà croisés » dans le carnet. L'amitié, les souvenirs et les glands repartent de zéro, puisque les souvenirs viennent maintenant des histoires.

## Décidé pendant le brainstorming du 24/10/2026

- Les six sauvages restent hors du Café tant qu'on ne les a pas rencontrés à la gamelle. Le carnet du Café les montre en silhouette avec l'indice de la gamelle ; une fois rencontrés, ils viennent au Café en VIP.
- **Gribouille** peint avec sa queue (d'où le bout bleu). Il voudrait peindre tout le monde, mais personne ne tient en place. Étape 1 : il cherche un modèle. Étape 2 : seul un renard endormi tient en place, il faut un coussin. Ensuite, une **fresque** sur le mur de la maison grandit à chaque renard installé.
- **Le grand portrait**, la fin du jeu : quand tout le monde est réuni (les 29 renards, sauvages et invités d'honneur compris), Gribouille peint la photo de famille. Les invités d'Halloween y figurent en bonus s'ils ont été croisés.
- Idée pour le Café : un calendrier de connexion sur 7 jours, avec une grosse récompense le 7e (le bonus actuel ne donne que des pièces).

## Décidé le 26/10/2026 (revue de la Clairière avec Joffray)

Constat : depuis la refonte du matin (histoires en une visite, plus d'attente), les 10 histoires se finissaient en une soirée, ce qui reproduisait le « j'ai fini, on s'ennuie » de la v1. Le problème de départ (« je ne sais pas où j'en suis ») était réel et les « ! » le règlent ; celui de la durée a été réglé en supprimant ce qui fait revenir.

1. **Un renard par jour** (fait, puis passé à **un toutes les 6 h** le 27/10/2026 à la demande de Joffray : « on va jamais s'en sortir ») : Petit Pois puis Mitaine s'enchaînent pour accrocher, ensuite le renard suivant arrive le matin (6 h), au moins 6 h après la fin de l'histoire (`nextMorning` dans `story.js`). La ligne d'objectif l'annonce : « Quelqu'un approche par la forêt… Il arrivera demain matin. » `?vite=1` pour tester. Une histoire se finit toujours en une visite. Raison : le joueur occasionnel ouvre l'app une ou deux fois par jour, un renard par jour est pour lui une surprise et pas une attente ; seul celui qui enchaîne tout (le développeur) la subit. 3 h était le pire choix : trop long pour une séance, trop court pour faire un rythme.
2. **Pluie une tranche de 3 h sur deux** (fait, `rainNow`, au lieu d'une sur trois).
3. **Petites envies** (faites le 26/10/2026, `js/clairiere/envies.js`) : déclenchées au retour du joueur, deux par jour au plus, 2 h d'écart, jamais cumulées (on ne punit pas l'absence). Seulement les renards dont l'histoire est finie. Bulle « … » au-dessus du renard ; on le touche, il demande, on le fait (pommes, tas de feuilles, luciole dorée la nuit, pêche, flaques sous la pluie, coussins, aller chercher un ami pour le banc, sieste dans le panier, histoire avant de dormir), +5 glands et un cœur. Chaque renard a une ou deux envies à lui (`MINE`), écrites le 26/10/2026 ; feuilleton d'amour sur trois histoires ajouté le même jour (`painepice`, `libellule`, `brioche` dans `ORDER`, avant Gribouille) : Pain d'épice cherche quelqu'un et échoue, une histoire entre les deux pour oublier, puis Brioche arrive, qui cherche aussi, et le joueur les réunit (idée de Joffray).
4. **Les mini-jeux restent**, mêlés à des moments plus variés (la nuit, la pluie, un autre renard).
5. **Objets du refuge = poses = photos** (panier, pot de fleurs et grand tas de feuilles faits le 26/10/2026, `js/clairiere/objets.js`). On achète un objet avec des glands, on le pose, il attire un renard dans une pose propre à l'objet, la photo garde ce moment (comme Neko Atsume). Les glands servent enfin, les photos ont une cause que le joueur provoque, la mignonnerie se voit dans la scène. Essai : `tools/poses-objets.html`. Joffray : panier « top », ventre en l'air et feuilles bien pour une photo, pot de fleurs à retoucher, queue sur le museau abandonnée (« bizarre »).
6. **Une vingtaine de sauvages** (à faire), au dessin inhabituel pour se reconnaître à la silhouette : cicatrice, œil fermé blessé dans la forêt (Balafre, sur la planche d'essai), queue absente ou très longue, pelage multicolore. Jamais de cicatrice en éclair (Harry Potter). Ils ont un nom et une ligne de caractère, mais on ne connaît pas le nom au départ : **5 photos du même renard**, chacune donne un indice (où il dort, ce qu'il mange, un détail), puis on trouve son prénom parmi trois ou un renard du refuge le reconnaît (inspiration : *Return of the Obra Dinn*). Certaines photos n'arrivent qu'à un moment (pluie, nuit, une gamelle) (inspiration : *Pokémon Snap*). Plus économe que de nouveaux renards : plusieurs photos par renard.
7. **Sésame ouvre la maison** (fait le 26/10/2026, `js/clairiere/maison.js`) : juste avant lui, **Copeau** le bricoleur répare la porte coincée ; Sésame perd toutes ses clés (idée de Joffray) : celle de la maison est dans le nid de la pie du grand arbre. La nuit, les renards dorment à l'intérieur au bord du feu ; Copeau agrandit la maison contre des glands (coussins, étagère à souvenirs, mezzanine). Copeau et Sésame ne vont jamais au Café. Ils arrivent après Brioche (19e et 20e histoires), plus tard que le jour 15 prévu.

Encore ouverts : ce que ressent le joueur au jour 15 (5 à 7 sont une piste), ce qu'on montre dans les 5 premières minutes et ce qu'on cache (Joffray, en essayant Neko Atsume : « beaucoup trop de parlotte au début » et « beaucoup trop de features, je suis un peu perdu »), le test avec la copine de Joffray, toujours à faire. Joffray joue à Neko Atsume quelques jours pour juger l'attente par lui-même.

## Questions encore ouvertes

1. ~~Gribouille : son histoire~~ (écrite le 25/10/2026).
2. **Les chiffres des glands** : gains par jour, prix des objets et des gamelles, à fixer par simulation.
3. **Les objets du refuge** : la liste complète, en partant de ceux que les histoires demandent.
