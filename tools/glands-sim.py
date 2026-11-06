"""Simulation de l'économie des glands de la Clairière (06/11/2026).

Rejoue un joueur jour après jour, par pas de 30 min comme `simulate` (state.js) :
glands laissés par les renards installés, câlins, petites envies, histoires (attente
`storyGap`), gamelles et visites (`visitPool`, `clueFits`), enquête des inconnus, achats
(objets du refuge, aménagements de Copeau). Les chiffres sont recopiés du jeu : à mettre
à jour si on les change.

    python tools/glands-sim.py                 # trois profils de joueur, 60 jours
    python tools/glands-sim.py --jours 30 --seeds 200
"""
import argparse, random, statistics

STEP_H = 0.5
GLANDS_DAY = [0, 2, 3, 3, 4, 5]
LV_T = [0, 3, 8, 15, 25]
def lv_of(h):
    l = 1
    for i in range(1, 5):
        if h >= LV_T[i]: l = i + 1
    return l

# histoires (moments, données extraites du jeu)
ORDER = [("petitpois",4),("mitaine",3),("luciole",3),("gaston",2),("galette",2),("pantoufle",3),("grignote",3),("brindille",3),("plouf",2),("biscuit",3),("copeau",3),("sesame",4),("cannelle",3),("charbon",2),("brume",3),("moka",2),("painepice",4),("libellule",2),("brioche",5),("marquis",4),("zaza",2),("flocon",3),("noisette",3),("givre",2),("comete",4),("somnus",3),("reglisse",3),("aurore",3),("maree",2),("perle",2),("yeti",3),("gribouille",5)]
def story_gap(n):
    G = [0, 0, .5, 1, 2, 3]; last = len(ORDER) - 1
    h = G[n] if n < len(G) else 15 if n >= last else 12 if n == last - 1 else min(10, 3 + (n - 5) * 7 / (last - 7))
    return round(h * 2) / 2
WILD = {"somnus":"baies","reglisse":"baies","aurore":"baies","maree":"poisson","perle":"poisson","yeti":"miel"}
# inconnus : gamelle, objet qui attire, moments de leur histoire, indices (moment, pluie) ; Balafre (Noël) à part
INCO = [("miette","croquettes",None,3,[("",0),("",0),("aube",0),("",0),("",0)]),
        ("panache","baies",None,3,[("",0),("nuit",0),("",1),("",0),("",0)]),
        ("mure","baies",None,3,[("",0),("jour",0),("",0),("",1),("",0)]),
        ("filou","tout",None,2,[("nuit",0),("",0),("",0),("",1),("",0)]),
        ("radar","poisson",None,3,[("",0),("",0),("nuit",0),("",1),("",0)]),
        ("pataud","miel",None,2,[("",0),("",0),("nuit",0),("",1),("",0)]),
        ("caline","baies",None,3,[("",0),("",0),("aube",0),("",1),("",0)]),
        ("tilleul","croquettes",None,2,[("",0),("",0),("jour",0),("",1),("",0)]),
        ("pinceau","poisson",None,2,[("",0),("",0),("nuit",0),("",1),("",0)]),
        ("patou","tout",None,2,[("",0),("",0),("aube",0),("",1),("nuit",0)]),
        ("frisette","miel",None,3,[("",0),("",0),("",1),("jour",0),("",0)]),
        ("cachou","croquettes","carton",2,[("",0),("",0),("nuit",0),("",0),("",0)]),
        ("boussole","baies","tente",3,[("",0),("",0),("aube",0),("",1),("",0)]),
        ("roupillon","miel","hamac",2,[("",0),("",0),("jour",0),("nuit",0),("",0)])]
BOWLS = {"croquettes":(0,8,.03),"baies":(30,12,.06),"poisson":(0,12,.06),"miel":(120,24,.04)}
OBJS = {"carton":20,"panier":25,"feuilles":30,"pot":40,"tunnel":45,"potager":60,"balancoire":80,"cabane":150}
GLANDS_CAP = 100  # glands laissés par les renards, par jour au plus (data.js)
DECO_G = [45,125,100,65,300,110,75,450,95,55,225,75,90,375,150,105,175,90,400,600,550,80,60]  # un objet par jour en glands (prix en pièces / 4)
HOUSE = {"coussins":30,"guirlandes":40,"couverture":45,"etagere":50,"fauteuil":60,"theiere":70,"disque":90,"mezzanine":120}

def phase(h):
    return "aube" if 6 <= h < 8 else "jour" if 8 <= h < 18 else "crepu" if 18 <= h < 21 else "nuit"
def fits(c, h, rain):
    w, r = c
    return (not w or w == phase(h) or (w == "nuit" and phase(h) == "crepu")) and (not r or rain)

PROFILS = {
    "tranquille (2 passages/jour)": [9, 21],
    "régulier (4 passages/jour)": [8, 12.5, 18.5, 22],
    "assidu (7 passages/jour)": [7, 9, 12, 14.5, 17, 20, 23],
}

def run(sessions, days, seed, deco_coins_day=None, log=None, cap=None, gdeco=False):
    rnd = random.Random(seed)
    res = {"petitpois": 0}          # renard installé -> cœurs
    done = set(); glands = 0; pend = 0.0; nxt = 0.0   # heure où l'histoire suivante peut venir
    met = set(); inco = {f[0]: {"n":0,"found":False,"lock":-1,"story":False} for f in INCO}
    fish = 0; bowl = None; wild_n = 0; wild_day = -1
    owned = set(); env_day = -1; env_n = 0; env_last = -99
    earned = {"renards":0,"câlins":0,"envies":0,"histoires":0,"enquête":0}; spent = {"gamelles":0,"objets":0,"maison":0,"déco":0}
    first = {}; bal = []; rain_blocks = {}; hug = {}; inc = []; capd = [-1, 0]; deco_n = 0; deco_day = -1
    near_on = lambda k: k in owned or (deco_coins_day is not None and k in ("tente","hamac") and t / 24 >= deco_coins_day)
    t = 0.0; si = 0
    sess_times = sorted(d * 24 + h for d in range(days) for h in sessions)
    def order_done(): return sum(1 for k, _ in ORDER if k in done)
    def is_res(k): return k in res
    while t < days * 24:
        t += STEP_H; h = t % 24; day = int(t // 24)
        blk = (day, int(h // 3)); rain = rain_blocks.setdefault(blk, rnd.random() < .5)
        # renards installés : glands laissés dans l'herbe (simulate)
        add = sum(GLANDS_DAY[lv_of(hh)] for hh in res.values()) / 48
        if cap is not None:
            if capd[0] != day: capd[:] = [day, 0]
            add = min(add, cap - capd[1]); capd[1] += add
        pend += add
        if bowl and t > bowl[1]: bowl = None
        if wild_day != day: wild_day = day; wild_n = 0
        if bowl:
            p = BOWLS[bowl[0]][2]
            if wild_n < 2 and rnd.random() < (p if met or any(v["n"] for v in inco.values()) else .3):
                pool = []
                for w, b in WILD.items():
                    if b == bowl[0] and not is_res(w): pool += [w] if w in met else [w, w]
                for f in INCO:
                    if (f[1] != bowl[0] and f[1] != "tout") or is_res(f[0]): continue
                    s = inco[f[0]]; wt = 1 if f[1] == "tout" else 2
                    if s["n"] < 5:
                        if fits(f[4][s["n"]], h, rain): pool += [f[0]] * wt
                    elif wt > 1: pool.append(f[0])
                if not pool: pool = [f[0] for f in INCO if f[1] == "tout" and inco[f[0]]["n"] >= 5]
                if pool:
                    k = rnd.choice(pool); wild_n += 1; bowl = None
                    if k in WILD: met.add(k)
                    else: inco[k]["n"] += 1
        if wild_n < 2:
            pool = [f for f in INCO if f[2] and near_on(f[2]) and not is_res(f[0]) and (fits(f[4][inco[f[0]]["n"]], h, rain) if inco[f[0]]["n"] < 5 else rnd.random() < .3)]
            if pool and rnd.random() < .05:
                f = rnd.choice(pool); inco[f[0]]["n"] += 1; wild_n += 1
        # passage du joueur
        while si < len(sess_times) and sess_times[si] <= t:
            si += 1
            g = int(pend); glands += g; pend -= g; earned["renards"] += g
            for k in res:  # un câlin par renard et par jour (pet)
                if hug.get(k) != day: hug[k] = day; res[k] += 1; glands += 1; earned["câlins"] += 1
            # enquête : deviner dès 3 photos (60 % de bonnes réponses), sinon à la photo suivante, ou Petit Pois à 5
            for k, s in inco.items():
                if s["found"]: continue
                if s["n"] >= 5: s["found"] = True; glands += 5; earned["enquête"] += 5
                elif s["n"] >= 3 and s["lock"] != s["n"]:
                    if rnd.random() < (.6 if s["n"] == 3 else .85): s["found"] = True; glands += 20; earned["enquête"] += 20
                    else: s["lock"] = s["n"]
            # histoires d'inconnus (sans attente), puis celle d'ORDER si l'attente est passée
            for f in INCO:
                s = inco[f[0]]
                if s["found"] and not s["story"]:
                    s["story"] = True; glands += 3 * f[3] + 15; earned["histoires"] += 3 * f[3] + 15; res[f[0]] = 0
            while t >= nxt:
                others = [k for k, _ in ORDER[:-1]]
                cand = [(k, b) for k, b in ORDER if k not in done and (k not in WILD or k in met) and (k != "gribouille" or all(o in done for o in others))]
                if not cand: break
                k, b = cand[0]; done.add(k); res.setdefault(k, 0)
                glands += 3 * b + 15; earned["histoires"] += 3 * b + 15
                first.setdefault("histoire " + k, day + 1)
                if k == "gaston": fish_ok = True
                nxt = t + story_gap(order_done())
                if story_gap(order_done()) > 0: break
            # petites envies : deux par jour, 2 h d'écart, renards dont l'histoire est finie
            if env_day != day: env_day = day; env_n = 0
            if env_n < 2 and t - env_last >= 2 and len(done) >= 1:
                env_n += 1; env_last = t; glands += 5; earned["envies"] += 5
                k = rnd.choice(sorted(done)); res[k] = res.get(k, 0) + 1
            # gamelle vide : celle qui attire quelqu'un qu'on cherche encore
            if not bowl:
                need = {b: 0 for b in BOWLS}
                for w, b in WILD.items():
                    if w not in met: need[b] += 1
                for f in INCO:
                    if not inco[f[0]]["found"]:
                        for b in ([f[1]] if f[1] != "tout" else ["croquettes", "baies", "poisson", "miel"]): need[b] += 1
                choice = "croquettes"
                if "gaston" in done and need["poisson"]: choice = "poisson"   # la pêche est gratuite : 5 poissons
                if need["baies"] and glands >= 30 and (choice != "poisson" or need["baies"] >= need["poisson"]): choice = "baies"
                if need["miel"] and glands >= 120 + 30 and need["miel"] >= need["baies"]: choice = "miel"
                price = BOWLS[choice][0]; glands -= price; spent["gamelles"] += price
                bowl = (choice, t + BOWLS[choice][1])
                first.setdefault("gamelle " + choice, day + 1)
            # achats : le moins cher d'abord, en gardant 30 glands pour les baies
            shop = [(p, k, "objets") for k, p in OBJS.items() if k not in owned]
            if "copeau" in done and "sesame" in done: shop += [(p, k, "maison") for k, p in HOUSE.items() if k not in owned]
            for p, k, cat in sorted(shop):
                if glands - p >= 30:
                    glands -= p; owned.add(k); spent[cat] += p; first[k] = day + 1
            # l'objet du jour en glands (boutique du jour), une fois le refuge équipé
            if gdeco and deco_day != day and not [x for x in shop if x[1] not in owned]:
                gp = DECO_G[day % len(DECO_G)]
                if glands - gp >= 30: glands -= gp; deco_day = day; deco_n += 1; spent["déco"] = spent.get("déco", 0) + gp
        if abs(t % 24) < 1e-9: bal.append(glands); inc.append(sum(earned.values()))
    nres = len(res)
    return dict(deco_n=deco_n, inc=inc, bal=bal, first=first, earned=earned, spent=spent, nres=nres, done=len(done), incos=sum(s["story"] for s in inco.values()), met=len(met))

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--jours", type=int, default=60); ap.add_argument("--seeds", type=int, default=100)
    ap.add_argument("--plafond", type=int, default=GLANDS_CAP)
    ap.add_argument("--avant", action="store_true", help="sans le plafond ni la déco en glands (avant le 06/11/2026)")
    ap.add_argument("--deco", type=float, default=None, help="jour où le joueur pose tente et hamac (pièces du Café)")
    a = ap.parse_args()
    for name, sess in PROFILS.items():
        R = [run(sess, a.jours, s, a.deco, cap=None if a.avant else a.plafond, gdeco=not a.avant) for s in range(a.seeds)]
        med = lambda xs: statistics.median(xs)
        print(f"\n=== {name} ===")
        print("solde en fin de jour (médiane) :", "  ".join(f"J{d}:{med([r['bal'][d-1] for r in R]):.0f}" for d in (1,2,3,5,7,10,14,21,30,45,60) if d <= a.jours))
        keys = ["panier","carton","feuilles","pot","tunnel","potager","balancoire","cabane","coussins","guirlandes","couverture","etagere","fauteuil","theiere","disque","mezzanine","histoire sesame","histoire gribouille","gamelle baies","gamelle miel"]
        def when(k):
            xs = [r["first"].get(k, 999) for r in R]; m = med(xs)
            return "jamais" if m >= 999 else f"J{m:.0f}"
        print("acheté / fini (médiane) :", ", ".join(f"{k} {when(k)}" for k in keys))
        e = {k: med([r["earned"][k] for r in R]) for k in R[0]["earned"]}; sp = {k: med([r["spent"][k] for r in R]) for k in R[0]["spent"]}
        print("gagné en tout :", e, " dépensé :", sp)
        print(f"histoires d'ORDER finies : {med([r['done'] for r in R]):.0f}/32, inconnus installés : {med([r['incos'] for r in R]):.0f}/14, sauvages rencontrés {med([r['met'] for r in R]):.0f}/6, renards au refuge : {med([r['nres'] for r in R]):.0f}")
        g = lambda r, d: r["inc"][d-1] - (r["inc"][d-2] if d > 1 else 0)
        print("gagné ce jour-là (médiane) :", "  ".join(f"J{d}:{med([g(r,d) for r in R]):.0f}" for d in (1,2,3,5,7,10,14,21,30,45,60) if d <= a.jours))
        last = [r["bal"][-1] - r["bal"][-8] for r in R]
        print(f"objets de déco achetés en glands : {med([r['deco_n'] for r in R]):.0f}")
        print(f"gain net la dernière semaine : {med(last):.0f} glands/semaine")

if __name__ == "__main__":
    main()
