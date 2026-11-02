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
  {id:"chaussettes",name:"Chaussettes",p:500},{id:"pepites",name:"Pépites",p:500},{id:"neige",name:"Flocon sur la tête",p:700}];
const ME_ACC=[{id:"",name:"Rien",p:0},{id:"noeud",name:"Petit nœud",p:400},{id:"fleur",name:"Fleur",p:400},{id:"feuille",name:"Feuille",p:300},
  {id:"echarpe",name:"Écharpe",p:700},{id:"bonnet",name:"Bonnet",p:1000},{id:"lunettes",name:"Lunettes rondes",p:1300},{id:"bob",name:"Bob d'été",p:900},
  {id:"beret",name:"Béret de peintre",p:1100},{id:"etoile",name:"Étoile filante",p:2000},{id:"flocon",name:"Flocon de neige",p:500},{id:"vikingc",name:"Guerrier viking",b:30},
  {id:"casquette",name:"Casquette",p:800},{id:"fleurs",name:"Couronne de fleurs",p:1200},{id:"ruban",name:"Gros ruban",p:900},{id:"gland",name:"Chapeau gland",p:600},
  {id:"sorciere",name:"Chapeau de sorcière",p:1500},{id:"lutin",name:"Bonnet de lutin",p:1400},{id:"hautforme",name:"Haut-de-forme",b:20},{id:"couronneor",name:"Couronne d'or",b:40}];
// les yeux et la queue (03/11/2026, Joffray : « la couleur, le style »)
const ME_EYE=[{id:"",name:"Noirs",p:0},{id:"noisette",name:"Noisette",p:300,e:"#7a4a2a"},{id:"vert",name:"Vert forêt",p:500,e:"#3f7a4a"},{id:"bleu",name:"Bleu lac",p:500,e:"#3a6aa8"},
  {id:"violet",name:"Violet",p:700,e:"#6a4a9a"},{id:"ambre",name:"Ambre",p:700,e:"#b8741a"},{id:"rose",name:"Rose bonbon",b:10,e:"#c8487a"},{id:"or",name:"Or",b:20,e:"#c8a020"}];
const ME_TAIL=[{id:"",name:"Classique",p:0},{id:"long",name:"Grande queue",p:800},{id:"pompon",name:"Pompon",p:800}];
const meB=()=>Object.assign({own:{},c:"roux",m:"",a:null,y:"",q:""},bourse().me||{});
function mePut(m){const b=bourse();b.me=m;putBourse(b)}
const meOwn=(k,id)=>!id||(k==="c"&&id==="roux")||!!meB().own[k+":"+id];
// le look de Roussette, appliqué par foxArt
// (« chaussettes » n'est pas un dessin : ce sont les pattes blanches)
function meLook(f){const m=meB(),fur=ME_FUR.find(x=>x.id===m.c),c=fur?fur.c:f.c;
  return {c:m.m==="chaussettes"?{...c,s:"#fffaf3"}:c,mark:m.m&&m.m!=="chaussettes"?m.m:f.mark,acc:m.a!=null?(m.a||undefined):f.acc,
    ...(m.y?{eye:(ME_EYE.find(x=>x.id===m.y)||{}).e}:{}),...(m.q?{tail:m.q}:{})}}
