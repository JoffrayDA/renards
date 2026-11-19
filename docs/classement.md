# Classement du Grand rush

Le Grand rush (`js/cafe/infini.js`) envoie le record de chaque joueur dans Firestore, une fiche par téléphone (connexion anonyme de `js/push.js`) :

- collections `rush_italie`, `rush_paris`, `rush_kyoto` ;
- document `{uid}` : `name` (texte, 14 caractères au plus, nettoyé par `rushName`), `score` (entier), `sec` (secondes tenues), `t` (date).

Le jeu lit les 50 meilleurs (`runQuery`, tri sur `score`) et calcule la place du joueur (`runAggregationQuery`, nombre de scores plus hauts). Pas d'index composé nécessaire.

## Règles à coller dans la console Firebase

Firestore Database › Règles : remplacer tout le texte par celui-ci (les règles `push` et `saves` y sont déjà), puis Publier.
Une première version (`match /{coll}/{uid}` avec `is string`) était refusée par la console (« Line 15: Unexpected 'i' »), 20/11/2026.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /push/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /saves/{code} {
      allow get, create, update: if request.auth != null && code.size() == 14;
    }

    function rushOk(uid) {
      return request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['name', 'score', 'sec', 't'])
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 16
        && request.resource.data.sec >= 0
        && request.resource.data.sec <= 3600
        && request.resource.data.score >= 0
        && request.resource.data.score <= request.resource.data.sec * 30 + 300
        && (resource == null || request.resource.data.score > resource.data.score);
    }
    match /rush_italie/{uid} {
      allow read: if true;
      allow create, update: if rushOk(uid);
    }
    match /rush_paris/{uid} {
      allow read: if true;
      allow create, update: if rushOk(uid);
    }
    match /rush_kyoto/{uid} {
      allow read: if true;
      allow create, update: if rushOk(uid);
    }
  }
}
```

- Chacun n'écrit que sa propre fiche, jamais celle d'un autre, et ne peut pas l'effacer.
- Un score ne peut que monter.
- Plafond : 30 points par seconde tenue (le bot parfait, plus rapide qu'un humain, fait environ 23 par seconde : `python tools/balance-bot.py --rush`).

## Tricheurs

Le score est calculé sur le téléphone : quelqu'un qui s'y connaît peut envoyer un faux score qui respecte le plafond. Pour l'enlever : console Firebase › Firestore › `rush_<quartier>` › le document › supprimer.
