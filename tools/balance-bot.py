"""Bot d'équilibrage du Café des Renards.

Joue des journées complètes en accéléré (simulation directe, sans attendre en temps réel),
avec des décisions parfaites et un temps de réaction donné, puis affiche la recette obtenue
face à l'objectif du jour. Chaque journée est jouée plusieurs fois et on affiche la moyenne.

Le bot possède les recettes gagnées sur la carte avant ce jour, plus un kit d'améliorations
qu'un joueur régulier a normalement pu s'offrir à ce moment-là (voir KIT).

Prérequis : pip install playwright  puis  python -m playwright install chromium
Usage     : python tools/balance-bot.py [jours...]   (par défaut : une sélection de 1 à 40)
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
PAGE = (Path(__file__).resolve().parent.parent / "cafe.html").as_uri()
RUNS = 4

# Une journée jouée par le bot : renvoie [recette, objectif, servis, clients, fâchés].
BOT = """(args) => {
  const [day, own, react] = args;
  S.own = own; S.coins = 0; S.guest = {}; window.toast = () => {};
  closeSheet(); newDay(day);
  const cfg = G.cfg; let t = 0, next = 0, res = null;
  const origEnd = endDay;
  endDay = () => { res = [G.earned, cfg.goal, G.served, cfg.c, G.lost]; G = null; };
  const act = () => {
    const w = G.cust.filter(c => c.state === "wait").sort((a, b) => a.pat - b.pat);
    for (const c of w) if (c.order.some(o => !o.done && G.tray.includes(o.r))) { deliver(c, null); return; }
    if (G.oven.state === "ready") { unload(); return; }
    const need = []; w.forEach(c => c.order.forEach(o => { if (!o.done) need.push(o.r); }));
    const onTray = {}; G.tray.forEach(r => onTray[r] = (onTray[r] || 0) + 1);
    for (const r of need) {
      if (onTray[r]) { onTray[r]--; continue; }
      if (REC[r].kind === "drink") {
        const sl = G.st[r];
        if (sl.some(s => s.ready) && G.tray.length < trayCap()) { tapStation(r, null); return; }
        if (sl.some(s => !s.busy && !s.ready)) { tapStation(r, null); return; }
      } else {
        if (G.vit[r] > 0 && G.tray.length < trayCap()) { fromVit(r, null); return; }
        if (G.oven.state === "idle") { bake(r); return; }
      }
    }
    if (G.tray.length >= trayCap()) { G.tray.shift(); return; }
    const low = Object.keys(G.vit).sort((a, b) => G.vit[a] - G.vit[b])[0];
    if (G.oven.state === "idle" && G.vit[low] < 2) bake(low);
  };
  while (G && G.run && t < 600) { update(.05); t += .05; if (G && G.run && t >= next) { act(); next = t + react; } }
  endDay = origEnd; G = null;
  return res;
}"""

# Recettes de la carte (gagnées en réussissant ce jour-là) et achats en boutique à partir de quel jour.
RECIPES = {"the": 2, "cookie": 5, "choco": 7, "smoothie": 11, "gateau": 16}
KIT = {"plantes": 4, "comptoir1": 6, "double": 6, "guirlande": 8, "fourpro": 8, "barista": 11, "plateau": 11,
       "comptoir2": 13, "disque": 13, "coussins": 16, "serveur": 19,
       "machines": 23, "plateau5": 24, "fauteuils": 26, "four2": 33, "lanternes": 35}


def own_for(day):
    own = {k: 1 for k, d in RECIPES.items() if d < day}
    own.update({k: 1 for k, d in KIT.items() if d <= day})
    return own


days = [int(a) for a in sys.argv[1:]] or [1, 2, 3, 4, 6, 8, 10, 11, 13, 15, 17, 20, 21, 25, 30, 31, 35, 40]
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(PAGE)
    page.wait_for_timeout(500)
    print(f"{'jour':>4} {'réaction':>8} {'recette':>8} {'objectif':>8} {'ratio':>6} {'étoiles':>7}  servis  fâchés")
    for day in days:
        for react in (0.45, 0.8):
            rs = [page.evaluate(BOT, [day, own_for(day), react]) for _ in range(RUNS)]
            e = sum(r[0] for r in rs) / RUNS
            g, total = rs[0][1], rs[0][3]
            served = sum(r[2] for r in rs) / RUNS
            lost = sum(r[4] for r in rs) / RUNS
            stars = 3 if e >= g * 1.7 else 2 if e >= g * 1.35 else 1 if e >= g else 0
            print(f"{day:>4} {react:>7}s {e:>8.0f} {g:>8} {e/g:>6.2f} {'★'*stars:>7}  {served:>4.1f}/{total:<3} {lost:.1f}")
    page.evaluate("() => localStorage.clear()")
    if errors:
        print("Erreurs JS :", errors)
    browser.close()
