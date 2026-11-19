# Classement du Grand rush

Le Grand rush (`js/cafe/infini.js`) envoie le record de chaque joueur dans Firestore, une fiche par téléphone (connexion anonyme de `js/push.js`) :

- collections `rush_italie`, `rush_paris`, `rush_kyoto` ;
- document `{uid}` : `name` (texte, 14 caractères au plus, nettoyé par `rushName`), `score` (entier), `sec` (secondes tenues), `t` (date).

Le jeu lit les 50 meilleurs (`runQuery`, tri sur `score`) et calcule la place du joueur (`runAggregationQuery`, nombre de scores plus hauts). Pas d'index composé nécessaire.

## Règles à coller dans la console Firebase

Firestore Database › Règles : ajouter ce bloc **à l'intérieur** de `match /databases/{database}/documents { … }`, à côté des règles existantes (`push`, `saves`) :

```
match /{coll}/{uid} {
  allow read: if coll in ['rush_italie', 'rush_paris', 'rush_kyoto'];
  allow create, update: if coll in ['rush_italie', 'rush_paris', 'rush_kyoto']
    && request.auth != null && request.auth.uid == uid
    && request.resource.data.keys().hasOnly(['name', 'score', 'sec', 't'])
    && request.resource.data.name is string
    && request.resource.data.name.size() > 0 && request.resource.data.name.size() <= 16
    && request.resource.data.score is int && request.resource.data.sec is int
    && request.resource.data.sec >= 0 && request.resource.data.sec <= 3600
    && request.resource.data.score >= 0
    && request.resource.data.score <= request.resource.data.sec * 30 + 300
    && (resource == null || request.resource.data.score > resource.data.score);
}
```

- Chacun n'écrit que sa propre fiche, jamais celle d'un autre, et ne peut pas l'effacer.
- Un score ne peut que monter.
- Plafond : 30 points par seconde tenue (le bot parfait, plus rapide qu'un humain, fait environ 23 par seconde : `python tools/balance-bot.py --rush`).

## Tricheurs

Le score est calculé sur le téléphone : quelqu'un qui s'y connaît peut envoyer un faux score qui respecte le plafond. Pour l'enlever : console Firebase › Firestore › `rush_<quartier>` › le document › supprimer.
