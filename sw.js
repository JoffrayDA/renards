// Cache hors ligne : les pages viennent du réseau quand il y en a (mises à jour visibles tout de suite),
// le reste est servi depuis le cache puis mis à jour en arrière-plan.
// GitHub Pages autorise 10 min de cache HTTP : on le contourne (cache "reload" / "no-cache"), sinon un téléphone
// peut recevoir l'ancienne page juste après une mise à jour.
const CACHE = "renards-v22";
const FILES = ["./", "index.html", "cafe.html", "clairiere.html", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "img/cafe.jpg", "img/clairiere.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" }))))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: e.request.mode === "navigate" });
    const nav = e.request.mode === "navigate";
    const net = (nav ? fetch(e.request.url, { cache: "no-cache", credentials: "same-origin" }) : fetch(e.request)).then(r => { if (r.ok && new URL(e.request.url).origin === location.origin) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    if (nav) return net.then(r => r || hit);
    return hit || net;
  }));
});
