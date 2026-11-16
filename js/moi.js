/* Roussette, c'est toi (02/11/2026, Joffray : « on pourrait acheter plein d'accessoires pour se personnaliser, des couleurs… tout
   pour se pimper ») : pelage, motif et accessoire, achetés en pièces du Café (ou en clochettes pour les plus beaux), choisis sur la
   page « C'est toi » du carnet de la Clairière. Partout où Roussette est dessinée (carte du Café, dialogues, logo), foxArt applique
   son look (meLook). L'accessoire reste aussi celui de la boutique Style du Café : choisir l'un change l'autre.
   Dans la bourse : b.me = {own:{"c:blond":1, "m:taches":1, "a:viking":1}, c, m, a, y (yeux), q (queue)}. */
const ME_FUR=[
  {id:"roux",name:"Roux classique",p:0,c:{b:"#f39a5c",ch:"#fff3e6",e:"#7a4a3a",s:"#8a5544",t:"#fff3e6"}},
  {id:"blond",name:"Blond paille",p:600,c:{b:"#f0c46a",ch:"#fffaf0",e:"#a9744a",s:"#a9744a",t:"#fffaf0"}},
  {id:"fonce",name:"Roux flamboyant",p:600,c:{b:"#d9643c",ch:"#fff1e4",e:"#5e2c1c",s:"#5e2c1c",t:"#fff1e4"}},
  {id:"neige",name:"Blanc neige",p:900,c:{b:"#f4f6fa",ch:"#ffffff",e:"#b9c6d8",s:"#c9d4e2",t:"#ffffff"}},
  {id:"argent",name:"Gris argent",p:900,c:{b:"#a9b0ba",ch:"#f4f6f8",e:"#5f6876",s:"#5f6876",t:"#f4f6f8"}},
  {id:"choco",name:"Chocolat",p:900,c:{b:"#8a5a42",ch:"#f6e6d6",e:"#4a2a20",s:"#4a2a20",t:"#f6e6d6"}},
  {id:"fraise",name:"Rose fraise",b:15,c:{b:"#f4a8b8",ch:"#fff6f8",e:"#b8607a",s:"#b8607a",t:"#fff6f8"}},
  {id:"lavande",name:"Lavande",b:15,c:{b:"#b9a4e0",ch:"#fbf8ff",e:"#6a58a0",s:"#6a58a0",t:"#fbf8ff"}},
  {id:"menthe",name:"Menthe",b:15,c:{b:"#a8dcc4",ch:"#f6fffa",e:"#4f8a72",s:"#4f8a72",t:"#f6fffa"}},
  {id:"nuit",name:"Bleu nuit",b:25,c:{b:"#4a5a9a",ch:"#e8ecfa",e:"#20284a",s:"#20284a",t:"#ffe680"}},
  // les pelages des coins préférés (deco.js, CP_GOALS) : introuvables ailleurs
  {id:"miel",name:"Miel doré",cp:3,c:{b:"#f2b84a",ch:"#fff8e6",e:"#b8742a",s:"#b8742a",t:"#fff8e6"}},
  {id:"aurore",name:"Aurore",cp:8,c:{b:"#8fd8d0",ch:"#fff4fa",e:"#e07aa8",s:"#e07aa8",t:"#fbd0e4"}},
  {id:"galaxie",name:"Galaxie",cp:14,c:{b:"#4a3a8a",ch:"#e8e0ff",e:"#f2c45a",s:"#2a2050",t:"#ffe680"}}];
const ME_MARK=[{id:"",name:"Sans motif",p:0},{id:"taches",name:"Taches de rousseur",p:300},{id:"liste",name:"Liste blanche",p:400},
  {id:"chaussettes",name:"Chaussettes",p:500},{id:"pepites",name:"Pépites",p:500},{id:"neige",name:"Flocon sur la tête",p:700},
  {id:"coeur",name:"Cœur sur le front",p:1500},{id:"masque",name:"Masque",p:2500},{id:"oeil",name:"Tache sur l'œil",b:60}];
// tout le look (14/11/2026, Joffray : « modifier son renard du tout au tout ») ; refait le 16/11/2026 (« il y a 10 000 trucs, ça va pas ») :
// quatre onglets (Corps, Visage, Tenue, Objets), des curseurs pour la forme, une couleur au choix pour les chapeaux, le cou et les motifs
const ME_ACC=[{id:"",name:"Rien",p:0},{id:"feuille",name:"Feuille",p:300},{id:"fleur",name:"Fleur",p:400},{id:"flocon",name:"Flocon de neige",p:500},
  {id:"gland",name:"Chapeau gland",p:600},{id:"casquette",name:"Casquette",p:800},{id:"coppola",name:"Casquette gavroche",p:900},{id:"bob",name:"Bob d'été",p:900},
  {id:"ruban",name:"Gros ruban",p:900},{id:"bonnet",name:"Bonnet",p:1000},{id:"beret",name:"Béret de peintre",p:1100},{id:"paquerettes",name:"Couronne de pâquerettes",p:1100},
  {id:"fleurs",name:"Couronne de fleurs",p:1200},{id:"lutin",name:"Bonnet de lutin",p:1400},{id:"sorciere",name:"Chapeau de sorcière",p:1500},
  {id:"hautforme",name:"Haut-de-forme",b:20},{id:"vikingc",name:"Guerrier viking",b:30},{id:"couronneor",name:"Couronne d'or",b:40}];
const ME_NECK=[{id:"",name:"Rien",p:0},{id:"noeud",name:"Petit nœud",p:400},{id:"noeudpap",name:"Nœud papillon",p:600},{id:"echarpe",name:"Écharpe",p:700},{id:"clochette",name:"Clochette",p:800}];
const ME_FACE=[{id:"",name:"Rien",p:0},{id:"lunettes",name:"Lunettes rondes",p:1300},{id:"etoile",name:"Étoile filante",p:2000}];
const ME_HELD=[{id:"",name:"Rien",p:0},{id:"sucette",name:"Sucette",p:300},{id:"croissant",name:"Croissant",p:300},{id:"champignon",name:"Champignon",p:400},
  {id:"tournesol",name:"Tournesol",p:500},{id:"glace",name:"Glace",p:500},{id:"tasse",name:"Tasse de café",p:700},{id:"drapeau",name:"Fanion",p:700},
  {id:"bouquet",name:"Bouquet",p:800},{id:"pinceau",name:"Pinceau",p:800},{id:"livre",name:"Livre",p:900},{id:"panier",name:"Panier de fraises",p:900},
  {id:"loupe",name:"Loupe",p:1000},{id:"ballon",name:"Ballon",p:1000},{id:"eventail",name:"Éventail",p:1100},{id:"bulles",name:"Bulles de savon",p:1200},
  {id:"cadeau",name:"Cadeau",p:1200},{id:"peluche",name:"Nounours",p:1300},{id:"epee",name:"Épée de bois",p:1400},{id:"parapluie",name:"Parapluie",p:1500},
  {id:"appareil",name:"Appareil photo",p:1600},{id:"lanterne",name:"Lanterne",b:10},{id:"ukulele",name:"Ukulélé",b:15},{id:"baguette",name:"Baguette magique",b:20}];
// la couleur des yeux, le regard, le nez
const ME_EYE=[{id:"",name:"Noirs",p:0,e:"#2e2028"},{id:"noisette",name:"Noisette",p:300,e:"#7a4a2a"},{id:"vert",name:"Vert forêt",p:500,e:"#3f7a4a"},{id:"bleu",name:"Bleu lac",p:500,e:"#3a6aa8"},
  {id:"violet",name:"Violet",p:700,e:"#6a4a9a"},{id:"ambre",name:"Ambre",p:700,e:"#b8741a"},{id:"rose",name:"Rose bonbon",b:10,e:"#c8487a"},{id:"or",name:"Or",b:20,e:"#c8a020"}];
const ME_EYES=[{id:"",name:"Petits points",p:0},{id:"cils",name:"Avec des cils",p:400,fx:{eyes:"cils"}},{id:"doux",name:"Paupières douces",p:400,fx:{eyes:"doux"}},
  {id:"rieurs",name:"Yeux rieurs",p:500,fx:{eyes:"rieurs"}},{id:"malice",name:"Clin d'œil",p:700,fx:{eyes:"malice"}},{id:"brille",name:"Pétillants",p:900,fx:{eyes:"brille"}},
  {id:"grands",name:"Grands yeux brillants",p:1200,fx:{bigeye:1}},{id:"anime",name:"Yeux de manga",p:1400,fx:{eyes:"anime"}},{id:"chat",name:"Yeux de chat",p:1500,fx:{eyes:"chat"}},
  {id:"coeurs",name:"Yeux en cœur",b:10,fx:{eyes:"coeurs"}},{id:"etoiles",name:"Yeux étoilés",b:15,fx:{eyes:"etoiles"}},{id:"spirale",name:"Hypnotisés",b:15,fx:{eyes:"spirale"}}];
const ME_NOSE=[{id:"",name:"Noir",p:0},{id:"rose",name:"Rose",p:300,fx:{nose:"#e88aa0"}},{id:"choco",name:"Chocolat",p:300,fx:{nose:"#7a4a3a"}},
  {id:"coeur",name:"Cœur rose",p:900,fx:{nose:"#f07a98",noseHeart:1}},{id:"coeurr",name:"Cœur rouge",b:10,fx:{nose:"#d8283a",noseHeart:1}}];
// la forme : un curseur chacun (Joffray : « tu cliques et tu vas de gauche à droite pour que ça se rapetisse ou s'agrandisse »), débloqué une fois
const ME_SHAPE=[{k:"sz",name:"Taille",min:.82,max:1.16,p:600,fx:"scale"},{k:"wd",name:"Rondeur",min:.85,max:1.32,p:600,fx:"wide"},
  {k:"er",name:"Oreilles",min:.7,max:1.8,p:800,fx:"ears"},{k:"tl",name:"Queue",min:.6,max:2.1,p:800,fx:"tailK"}];
const ME_TAIL=[{id:"",name:"Classique",p:0},{id:"pompon",name:"Pompon",p:800,fx:{tail:"pompon"}}];
// les couleurs au choix (gratuites une fois la pièce achetée)
const ME_PAL=["#e2546e","#f4877a","#f2a35c","#f2c45a","#a9d68f","#5ea86c","#7fd0c8","#7ab8e8","#4a5a9a","#a58ad8","#f6a5c8","#8a5a42","#5b4250","#f6f1ea"];
const ME_MCOL=["taches","liste","coeur","neige","pepites","oeil","masque"]; // les motifs dont on choisit la couleur
// les rubriques à choix (le reste : curseurs et couleurs)
const ME_LIST={c:ME_FUR,m:ME_MARK,y:ME_EYE,ys:ME_EYES,n:ME_NOSE,q:ME_TAIL,a:ME_ACC,k:ME_NECK,v:ME_FACE,p:ME_HELD};
const ME_TABS=[["corps","Corps"],["visage","Visage"],["tenue","Tenue"],["objet","Objets"]];
// l'ancien accessoire unique (a) pouvait être une écharpe, un nœud, des lunettes ou l'étoile : ils passent dans leur rubrique ;
// les anciennes formes à choisir (taille, rondeur, oreilles, queue) deviennent la valeur de leur curseur, déjà débloqué
const ME_OLD={t:["sz",{petit:.84,grand:1.12}],g:["wd",{mince:.88,dodu:1.14,tresdodu:1.3}],o:["er",{petites:.75,grandes:1.35,immenses:1.75}],q:["tl",{petite:.7,long:1.6,geante:2.1}]};
function meB(){const m=Object.assign({own:{},c:"roux",m:"",a:null,y:"",q:""},bourse().me||{});
  if(m.a&&!ME_ACC.some(x=>x.id===m.a)){const k=ME_NECK.some(x=>x.id===m.a)?"k":ME_FACE.some(x=>x.id===m.a)?"v":null;if(k&&!m[k]){m[k]=m.a;m.a=""}}
  for(const [o,[k,map]] of Object.entries(ME_OLD)){
    if(Object.keys(map).some(id=>m.own[o+":"+id]))m.own["s:"+k]=1;
    if(m[o]&&map[m[o]]!=null&&m[k]==null){m[k]=map[m[o]];m[o]=o==="q"?"":m[o]}}
  return m}
function mePut(m){const b=bourse();b.me=m;putBourse(b)}
const meOwn=(k,id)=>{const o=meB().own;return !id||(k==="c"&&id==="roux")||!!o[k+":"+id]||(["k","v"].includes(k)&&!!o["a:"+id])};
// le look de Roussette, appliqué par foxArt ; over = un essai (aperçu d'une vignette ou d'un curseur)
// (« chaussettes » n'est pas un dessin : ce sont les pattes blanches)
function meLook(f,over){const m={...meB(),...(over||{})},fur=ME_FUR.find(x=>x.id===m.c),c=fur?fur.c:f.c,fx=k=>(ME_LIST[k].find(x=>x.id===m[k])||{}).fx||{};
  const sh={};for(const s of ME_SHAPE)if(typeof m[s.k]==="number"&&Math.abs(m[s.k]-1)>.01)sh[s.fx]=m[s.k];
  const col={};if(m.a&&m.ac)col[m.a]=m.ac;if(m.k&&m.kc)col[m.k]=m.kc;if(m.p&&m.pc)col[m.p]=m.pc;
  return {c:m.m==="chaussettes"?{...c,s:"#fffaf3"}:c,mark:m.m&&m.m!=="chaussettes"?m.m:f.mark,acc:m.a!=null?(m.a||undefined):f.acc,
    more:[m.k,m.v,m.p].filter(Boolean),...(m.y?{eye:(ME_EYE.find(x=>x.id===m.y)||{}).e}:{}),
    ...fx("ys"),...fx("n"),...fx("q"),...sh,...(Object.keys(col).length?{accCol:col}:{}),...(m.mc&&ME_MCOL.includes(m.m)?{markCol:m.mc}:{})}}
