"""Bot d'équilibrage du Café des Renards.

Joue des journées complètes en accéléré (simulation directe, sans attendre en temps réel),
avec des décisions parfaites et un temps de réaction donné, puis affiche la recette obtenue
face à l'objectif du jour.

Prérequis : pip install playwright  puis  python -m playwright install chromium
Usage     : python tools/balance-bot.py
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

PAGE = (Path(__file__).resolve().parent.parent / "cafe.html").as_uri()

# Une journée jouée par le bot : renvoie [recette, objectif, servis, clients, fâchés].
BOT = """(args) => {
  const [day, own, react] = args;
  S.day = day; S.own = own; S.coins = 0; window.toast = () => {};
  closeSheet(); newDay();
  const cfg = G.cfg; let t = 0, next = 0, res = null;
  const origEnd = endDay;
  endDay = () => { res = [G.earned, cfg.goal, G.served, cfg.c, G.lost]; origEnd(); };
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
  while (G && G.run && t < 400) { update(.05); t += .05; if (G && G.run && t >= next) { act(); next = t + react; } }
  endDay = origEnd;
  return res;
}"""

SCENARIOS = [
    (1, {}), (2, {}), (3, {"the": 1}), (4, {"the": 1, "plantes": 1}),
    (6, {"the": 1, "cookie": 1, "plantes": 1, "comptoir1": 1, "double": 1}),
    (8, {"the": 1, "cookie": 1, "choco": 1, "plantes": 1, "comptoir1": 1, "double": 1, "guirlande": 1, "fourpro": 1}),
    (12, {"the": 1, "cookie": 1, "choco": 1, "smoothie": 1, "plantes": 1, "comptoir1": 1, "comptoir2": 1,
          "double": 1, "guirlande": 1, "fourpro": 1, "barista": 1, "plateau": 1, "disque": 1}),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(PAGE)
    page.wait_for_timeout(500)
    print(f"{'jour':>4} {'réaction':>8} {'recette':>8} {'objectif':>8} {'ratio':>6} {'étoiles':>7}  servis  fâchés")
    for day, own in SCENARIOS:
        for react in (0.45, 0.8):
            e, g, served, total, lost = page.evaluate(BOT, [day, own, react])
            stars = 3 if e >= g * 1.7 else 2 if e >= g * 1.35 else 1 if e >= g else 0
            print(f"{day:>4} {react:>7}s {e:>8} {g:>8} {e/g:>6.2f} {'★'*stars:>7}  {served:>2}/{total:<3}  {lost}")
    page.evaluate("() => localStorage.clear()")
    if errors:
        print("Erreurs JS :", errors)
    browser.close()
