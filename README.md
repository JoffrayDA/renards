# Kitsune Café

Deux petits jeux kawaii avec des renards, jouables dans le navigateur et installables sur téléphone :

- **Kitsune Café** (`cafe.html`) : jeu de gestion dans une véranda qui change avec les saisons. Avance sur une carte de 40 journées en 4 saisons, sers les commandes avant que les clients s'impatientent, et vise les 3 étoiles pour ouvrir les portes, gagner des recettes et inviter des renards d'honneur.
- **La Clairière** (`clairiere.html`) : jeu détente façon Neko Atsume. Pose des objets, les renards passent même quand l'app est fermée, débloque des zones et collectionne leurs souvenirs.

Tout est en HTML, CSS et JavaScript, sans dépendance ni étape de build. Les parties sont enregistrées dans le navigateur de l'appareil (`localStorage`).

## Mettre en ligne avec GitHub Pages

```powershell
cd C:\Users\PC\Desktop\Dossier_Perso\Github\renards
git init
git add .
git commit -m "Premiere version des jeux Renards"
git branch -M main
git remote add origin https://github.com/JoffrayDA/renards.git
git push -u origin main
```

Puis sur GitHub : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`. Le site sera disponible à `https://joffrayda.github.io/renards/` au bout d'une minute ou deux.

## Installer sur le téléphone

- **iPhone (Safari)** : ouvre l'adresse, bouton Partager → **Sur l'écran d'accueil**.
- **Android (Chrome)** : ouvre l'adresse, menu ⋮ → **Ajouter à l'écran d'accueil** (ou **Installer l'application**).

L'app s'ouvre alors en plein écran, avec son icône, et fonctionne hors ligne après la première visite.

## Mettre à jour

Après une modification, incrémente d'abord `CACHE` dans `sw.js` (par exemple `renards-v18`), puis fais le commit et le push : sans ça, les téléphones gardent l'ancienne version.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Écran d'accueil pour choisir un jeu |
| `cafe.html` | Kitsune Café |
| `clairiere.html` | La Clairière |
| `manifest.webmanifest` | Nom, icônes et couleurs de l'app installée |
| `sw.js` | Cache hors ligne |
| `icons/`, `img/` | Icônes de l'app et aperçus de l'accueil |
| `tools/balance-bot.py` | Bot qui vérifie l'équilibrage du Café |
| `CLAUDE.md` | Contexte du projet pour Claude Code |
