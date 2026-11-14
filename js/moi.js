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
  {id:"nuit",name:"Bleu nuit",b:25,c:{b:"#4a5a9a",ch:"#e8ecfa",e:"#20284a",s:"#20284a",t:"#ffe680"}}];
const ME_MARK=[{id:"",name:"Sans motif",p:0},{id:"taches",name:"Taches de rousseur",p:300},{id:"liste",name:"Liste blanche",p:400},
  {id:"chaussettes",name:"Chaussettes",p:500},{id:"pepites",name:"Pépites",p:500},{id:"neige",name:"Flocon sur la tête",p:700},
  {id:"coeur",name:"Cœur sur le front",p:1500},{id:"masque",name:"Masque",p:2500},{id:"oeil",name:"Tache sur l'œil",b:60}];
// tout le look, rubrique par rubrique (14/11/2026, Joffray : « modifier son renard du tout au tout ») ; fx = ce que foxArt reçoit
const ME_ACC=[{id:"",name:"Rien",p:0},{id:"feuille",name:"Feuille",p:300},{id:"fleur",name:"Fleur",p:400},{id:"flocon",name:"Flocon de neige",p:500},
  {id:"gland",name:"Chapeau gland",p:600},{id:"casquette",name:"Casquette",p:800},{id:"coppola",name:"Casquette gavroche",p:900},{id:"bob",name:"Bob d'été",p:900},
  {id:"ruban",name:"Gros ruban",p:900},{id:"bonnet",name:"Bonnet",p:1000},{id:"beret",name:"Béret de peintre",p:1100},{id:"paquerettes",name:"Couronne de pâquerettes",p:1100},
  {id:"fleurs",name:"Couronne de fleurs",p:1200},{id:"lutin",name:"Bonnet de lutin",p:1400},{id:"sorciere",name:"Chapeau de sorcière",p:1500},
  {id:"hautforme",name:"Haut-de-forme",b:20},{id:"vikingc",name:"Guerrier viking",b:30},{id:"couronneor",name:"Couronne d'or",b:40}];
const ME_NECK=[{id:"",name:"Rien",p:0},{id:"noeud",name:"Petit nœud",p:400},{id:"noeudpap",name:"Nœud papillon",p:600},{id:"echarpe",name:"Écharpe",p:700},{id:"clochette",name:"Clochette",p:800}];
const ME_FACE=[{id:"",name:"Rien",p:0},{id:"lunettes",name:"Lunettes rondes",p:1300},{id:"etoile",name:"Étoile filante",p:2000}];
const ME_HELD=[{id:"",name:"Rien",p:0},{id:"tasse",name:"Tasse de café",p:700},{id:"livre",name:"Livre",p:900},{id:"parapluie",name:"Parapluie",p:1500}];
// les yeux et la queue (03/11/2026, Joffray : « la couleur, le style »)
const ME_EYE=[{id:"",name:"Noirs",p:0},{id:"noisette",name:"Noisette",p:300,e:"#7a4a2a"},{id:"vert",name:"Vert forêt",p:500,e:"#3f7a4a"},{id:"bleu",name:"Bleu lac",p:500,e:"#3a6aa8"},
  {id:"violet",name:"Violet",p:700,e:"#6a4a9a"},{id:"ambre",name:"Ambre",p:700,e:"#b8741a"},{id:"rose",name:"Rose bonbon",b:10,e:"#c8487a"},{id:"or",name:"Or",b:20,e:"#c8a020"}];
const ME_EYES=[{id:"",name:"Petits points",p:0},{id:"grands",name:"Grands yeux brillants",p:1200,fx:{bigeye:1}}];
const ME_NOSE=[{id:"",name:"Noir",p:0},{id:"rose",name:"Rose",p:300,fx:{nose:"#e88aa0"}},{id:"choco",name:"Chocolat",p:300,fx:{nose:"#7a4a3a"}},
  {id:"coeur",name:"Cœur rose",p:900,fx:{nose:"#f07a98",noseHeart:1}},{id:"coeurr",name:"Cœur rouge",b:10,fx:{nose:"#d8283a",noseHeart:1}}];
const ME_EAR=[{id:"",name:"Normales",p:0},{id:"petites",name:"Petites",p:500,fx:{ears:.75}},{id:"grandes",name:"Grandes",p:800,fx:{ears:1.35}},{id:"immenses",name:"Immenses",p:1500,fx:{ears:1.75}}];
const ME_SIZE=[{id:"",name:"Normale",p:0},{id:"petit",name:"Toute petite",p:600,fx:{scale:.84}},{id:"grand",name:"Grande",p:900,fx:{scale:1.12}}];
const ME_GIRTH=[{id:"",name:"Normale",p:0},{id:"mince",name:"Fine",p:500,fx:{wide:.88}},{id:"dodu",name:"Dodue",p:600,fx:{wide:1.14}},{id:"tresdodu",name:"Toute ronde",p:900,fx:{wide:1.3}}];
const ME_TAIL=[{id:"",name:"Classique",p:0},{id:"petite",name:"Petite queue",p:500,fx:{tailK:.7}},{id:"long",name:"Grande queue",p:800,fx:{tail:"long"}},
  {id:"pompon",name:"Pompon",p:800,fx:{tail:"pompon"}},{id:"geante",name:"Queue géante",b:15,fx:{tailK:2.1}}];
// les rubriques de la fiche « C'est toi », dans l'ordre des onglets
const ME_SLOTS=[["c","Pelage",ME_FUR],["y","Couleur des yeux",ME_EYE],["ys","Regard",ME_EYES],["n","Nez",ME_NOSE],["o","Oreilles",ME_EAR],["t","Taille",ME_SIZE],
  ["g","Rondeur",ME_GIRTH],["q","Queue",ME_TAIL],["m","Motif",ME_MARK],["a","Tête",ME_ACC],["k","Cou",ME_NECK],["v","Visage",ME_FACE],["p","Objet",ME_HELD]];
const ME_LIST=Object.fromEntries(ME_SLOTS.map(([k,,L])=>[k,L]));
// l'ancien accessoire unique (a) pouvait être une écharpe, un nœud, des lunettes ou l'étoile : ils passent dans leur rubrique
function meB(){const m=Object.assign({own:{},c:"roux",m:"",a:null,y:"",q:""},bourse().me||{});
  if(m.a&&!ME_ACC.some(x=>x.id===m.a)){const k=ME_NECK.some(x=>x.id===m.a)?"k":ME_FACE.some(x=>x.id===m.a)?"v":null;if(k&&!m[k]){m[k]=m.a;m.a=""}}
  return m}
function mePut(m){const b=bourse();b.me=m;putBourse(b)}
const meOwn=(k,id)=>{const o=meB().own;return !id||(k==="c"&&id==="roux")||!!o[k+":"+id]||(["k","v"].includes(k)&&!!o["a:"+id])};
// le look de Roussette, appliqué par foxArt ; over = un essai (aperçu d'une vignette)
// (« chaussettes » n'est pas un dessin : ce sont les pattes blanches)
function meLook(f,over){const m={...meB(),...(over||{})},fur=ME_FUR.find(x=>x.id===m.c),c=fur?fur.c:f.c,fx=k=>(ME_LIST[k].find(x=>x.id===m[k])||{}).fx||{};
  return {c:m.m==="chaussettes"?{...c,s:"#fffaf3"}:c,mark:m.m&&m.m!=="chaussettes"?m.m:f.mark,acc:m.a!=null?(m.a||undefined):f.acc,
    more:[m.k,m.v,m.p].filter(Boolean),...(m.y?{eye:(ME_EYE.find(x=>x.id===m.y)||{}).e}:{}),
    ...fx("ys"),...fx("n"),...fx("o"),...fx("t"),...fx("g"),...fx("q")}}
