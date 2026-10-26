// Cache hors ligne : tout vient du réseau quand il y en a (mises à jour visibles tout de suite), le cache sert hors ligne.
// GitHub Pages autorise 10 min de cache HTTP : on le contourne (cache "reload" / "no-cache"), sinon un téléphone
// peut recevoir l'ancienne page juste après une mise à jour.
const CACHE = "renards-v67";
const FILES = ["./", "index.html", "cafe.html", "clairiere.html", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "img/cafe.jpg", "img/clairiere.jpg", "css/cafe.css", "css/clairiere.css", "js/music.js", "js/foxart.js",
  ...["foxes", "data", "state", "draw", "game", "render", "end", "menus", "map", "hwintro", "main"].map(n => `js/cafe/${n}.js`),
  ...["data", "state", "scene", "life", "ui", "games", "objets", "story", "envies", "main"].map(n => `js/clairiere/${n}.js`)];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" }))))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Nos fichiers (pages, scripts, styles, images) viennent toujours du réseau quand il y en a, le cache ne sert que hors ligne :
// sinon une page neuve pouvait tourner avec un vieux script en cache (le bouton d'entrée ne marchait plus, 22/10/2026).
// Les polices Google, elles, viennent du cache d'abord.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url), ours = url.origin === location.origin, nav = e.request.mode === "navigate";
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: nav || ours });
    if (!ours) return hit || fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; });
    try {
      const r = await fetch(nav ? e.request.url : e.request, { cache: "no-cache", credentials: "same-origin" });
      if (r.ok) c.put(nav ? e.request.url : e.request, r.clone());
      return r;
    } catch (err) { return hit || Response.error(); }
  }));
});
