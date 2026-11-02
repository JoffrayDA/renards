# Garde-fou (02/11/2026) : un commentaire « // » ajouté au milieu d'une ligne de code avale tout ce qui suit sur la ligne
# (trois fois en deux jours : Clairière vide au démarrage, oiseaux de la fontaine, petit sapin de Noël de la maison).
# On cherche les commentaires suivis de code collé (« ;const », « ;s+= », « ;if(… »). À lancer avant chaque commit :
#   python tools/check-comments.py
import re, sys, pathlib

# code après un « ; » ou une accolade, ou une déclaration collée au texte (« refugeconst s=… »)
CODE = re.compile(r"(;|\{|\})\s*(const |let |var |if\(|for\(|return[ ;]|s\+=|[A-Za-z_$][\w$]*(\.[\w$]+)*\()|(const|let|var) [A-Za-z_$][\w$]*\s*=[^=]|s\+=`")
bad = 0
for p in sorted(pathlib.Path("js").rglob("*.js")):
    for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
        for m in re.finditer(r"//", line):
            before = line[:m.start()]
            # pas un commentaire : dans une chaîne, une URL ou une expression régulière
            if before.count("`") % 2 or before.count('"') % 2 or before.count("'") % 2 or before.endswith((":", "\\", "/")):
                continue
            if CODE.search(line[m.end():]):
                print(f"{p}:{i}: {line.strip()[:160]}")
                bad += 1
            break
sys.exit(1 if bad else 0)
