// Cache hors ligne : tout vient du réseau quand il y en a (mises à jour visibles tout de suite), le cache sert hors ligne.
// GitHub Pages autorise 10 min de cache HTTP : on le contourne (cache "reload" / "no-cache"), sinon un téléphone
// peut recevoir l'ancienne page juste après une mise à jour.
const CACHE = "renards-v103";
const FILES = ["./", "index.html", "cafe.html", "clairiere.html", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "img/cafe.jpg", "img/clairiere.jpg", "css/cafe.css", "css/clairiere.css", "js/music.js", "js/foxart.js", "js/push.js",
  ...["foxes", "data", "state", "draw", "game", "render", "end", "menus", "map", "hwintro", "main"].map(n => `js/cafe/${n}.js`),
  ...["data", "state", "scene", "life", "ui", "games", "objets", "sauvages", "story", "envies", "maison", "main"].map(n => `js/clairiere/${n}.js`)];
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
// Notifications (js/push.js, tools/push-send.mjs) : le serveur envoie { t: titre, b: texte, k: genre, u: page à ouvrir }
self.addEventListener("push", e => {
  let d = {}; try { d = e.data.json(); } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.t || "Kitsune Café", { body: d.b || "", icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: d.k || "renards", data: { u: d.u || "./" } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const u = new URL(e.notification.data && e.notification.data.u || "./", self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(ws => {
    const w = ws.find(x => "focus" in x);
    return w ? w.navigate(u).then(x => (x || w).focus()).catch(() => w.focus()) : clients.openWindow(u);
  }));
});
