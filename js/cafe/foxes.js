/* Kitsune Café : les renards (FOXES) et leur dessin (foxSVG). */
const $=id=>document.getElementById(id);
const INK="#5b4250";
const RAR={commun:{w:10,label:"Commun",cls:""},discret:{w:5,label:"Discret",cls:"discret"},rare:{w:2,label:"Rare",cls:"rare"},legend:{w:.6,label:"Légendaire",cls:"legend"}};
const FOXES=[
  {id:"roussette",name:"Roussette",rar:"commun",food:1,any:true,likes:["feuilles"],gift:[4,9],goldP:.04,c:{b:"#f39a5c",ch:"#fff3e6",e:"#7a4a3a",s:"#8a5544",t:"#fff3e6"},bio:"La première à venir. Elle renifle tout."},
  {id:"biscuit",name:"Biscuit",rar:"commun",food:1,any:true,likes:["pomme"],gift:[4,8],goldP:.04,acc:"feuille",c:{b:"#f2c48e",ch:"#fffaf0",e:"#a9744a",s:"#a9744a",t:"#fffaf0"},bio:"Couleur sablé, caractère beurre doux."},
  {id:"cannelle",name:"Cannelle",rar:"commun",food:1,any:true,likes:["feuilles","mousse"],gift:[5,10],goldP:.05,acc:"fleur",c:{b:"#e88a6a",ch:"#fff0e6",e:"#7a3e2e",s:"#7a3e2e",t:"#fff0e6"},bio:"Sent bon l'automne. Dort beaucoup."},
  {id:"charbon",name:"Charbon",rar:"commun",food:1,any:true,likes:["souche","cabane"],gift:[6,11],goldP:.05,c:{b:"#8f8790",ch:"#f4efec",e:"#4a4248",s:"#5a5258",t:"#f6f1ee"},bio:"Renard charbonnier. Timide sous la pluie."},
  {id:"petitpois",name:"Petit Pois",rar:"discret",food:1,likes:["pomme","plume"],gift:[3,7],goldP:.06,scale:.82,acc:"gland",c:{b:"#f6ad74",ch:"#fff6ea",e:"#8a5a3a",s:"#8a5a3a",t:"#fff6ea"},bio:"Un renardeau. Joue jusqu'à tomber de sommeil."},
  {id:"moka",name:"Moka",rar:"discret",food:2,likes:["cabane","souche"],gift:[8,14],goldP:.08,acc:"echarpe",c:{b:"#b08670",ch:"#f8e8d8",e:"#5a3e30",s:"#5a3e30",t:"#f8e8d8"},bio:"Pelage chocolat. Toujours en retard."},
  {id:"marquis",name:"Marquis",rar:"discret",food:2,likes:["mousse"],gift:[10,16],goldP:.1,acc:"noeud",c:{b:"#bcbfcc",ch:"#ffffff",e:"#6a6d7a",s:"#6a6d7a",t:"#ffffff"},bio:"Renard argenté. Ne s'assoit que sur du moelleux."},
  {id:"brume",name:"Brume",rar:"discret",food:2,likes:["lanterne","mousse"],gift:[9,15],goldP:.1,acc:"parapluie",c:{b:"#a9c0d2",ch:"#f4f8fb",e:"#5f7484",s:"#5f7484",t:"#f4f8fb"},bio:"Sort seulement avec son parapluie-feuille."},
  {id:"zaza",name:"Zaza",rar:"rare",food:2,likes:["champi","plume"],gift:[12,20],goldP:.2,ears:1.4,c:{b:"#f6dcaa",ch:"#fffaf0",e:"#c99a6a",s:"#d6ab7c",t:"#c99a6a"},bio:"Un fennec très loin de chez lui. Entend chaque goutte."},
  {id:"flocon",name:"Flocon",rar:"rare",food:3,likes:["lanterne"],gift:[14,24],goldP:.35,acc:"flocon",c:{b:"#fbfcff",ch:"#ffffff",e:"#cfd8e6",s:"#dfe6f0",t:"#ffffff"},bio:"Renard polaire. Attiré par la lumière."},
  {id:"noisette",name:"Professeur Noisette",rar:"rare",food:3,likes:["cabane"],gift:[16,26],goldP:.35,acc:"lunettes",c:{b:"#d39466",ch:"#fbeadb",e:"#6a4026",s:"#6a4026",t:"#fbeadb"},bio:"Étudie les glands depuis des années."},
  {id:"comete",name:"Comète",rar:"legend",food:4,likes:["champi"],gift:[30,50],goldP:1,goldN:3,acc:"etoile",c:{b:"#f7c25a",ch:"#fff8dc",e:"#b07a2a",s:"#b07a2a",t:"#fff3a8"},bio:"On ne la voit qu'une nuit par lune, dit-on."}
];
const FOX=Object.fromEntries(FOXES.map(f=>[f.id,f]));
FOXES.push(
  {id:"galette",zone:"berge",name:"Galette",rar:"commun",food:1,any:true,likes:["galet"],gift:[7,12],goldP:.05,c:{b:"#f0a868",ch:"#fff3e2",e:"#8a5a3a",s:"#8a5a3a",t:"#fff3e2"},bio:"Championne de ricochets du ruisseau."},
  {id:"plouf",zone:"berge",name:"Plouf",rar:"commun",food:1,any:true,likes:["nenuphar"],gift:[7,12],goldP:.05,acc:"feuille",c:{b:"#e9785a",ch:"#fff0e6",e:"#6a3326",s:"#6a3326",t:"#fff0e6"},bio:"Saute dans toutes les flaques. Exprès."},
  {id:"gaston",zone:"berge",name:"Gaston le pêcheur",rar:"discret",food:2,likes:["barque","panier"],gift:[11,18],goldP:.1,acc:"bob",c:{b:"#bfa08a",ch:"#fbf2ea",e:"#6a5040",s:"#6a5040",t:"#fbf2ea"},bio:"Pêche depuis toujours. N'a jamais rien attrapé."},
  {id:"libellule",zone:"berge",name:"Libellule",rar:"discret",food:2,likes:["nenuphar","panier"],gift:[10,17],goldP:.1,acc:"fleur",c:{b:"#c7bfe0",ch:"#fbf9ff",e:"#6f6690",s:"#6f6690",t:"#fbf9ff"},bio:"Rêveuse. Passe ses journées à regarder l'eau."},
  {id:"maree",zone:"berge",name:"Marée",rar:"rare",food:3,likes:["barque"],gift:[16,26],goldP:.35,acc:"echarpe",c:{b:"#8fb3cc",ch:"#f2f8fc",e:"#4a6a80",s:"#4a6a80",t:"#f2f8fc"},bio:"Arrive avec le courant, repart avec lui."},
  {id:"perle",zone:"berge",name:"Perle",rar:"rare",food:3,likes:["galet","panier"],gift:[18,28],goldP:.4,acc:"collier",c:{b:"#f3d0d8",ch:"#ffffff",e:"#c98a98",s:"#c98a98",t:"#ffffff"},bio:"Rose comme l'intérieur d'un coquillage."},
  {id:"pantoufle",zone:"terrier",name:"Pantoufle",rar:"commun",food:1,any:true,likes:["coussin"],gift:[9,15],goldP:.06,c:{b:"#f4b483",ch:"#fff6ec",e:"#8a5a3a",s:"#8a5a3a",t:"#fff6ec"},bio:"Ne sort jamais du terrier. Pourquoi faire ?"},
  {id:"grignote",zone:"terrier",name:"Grignote",rar:"commun",food:1,any:true,likes:["livres"],gift:[9,15],goldP:.06,acc:"gland",c:{b:"#c4875c",ch:"#fbeadb",e:"#5a3420",s:"#5a3420",t:"#fbeadb"},bio:"Lit les histoires. Puis les mange."},
  {id:"brindille",zone:"terrier",name:"Mamie Brindille",rar:"discret",food:2,likes:["coussin","hamac"],gift:[13,21],goldP:.12,acc:"lunettes",c:{b:"#d9d2cc",ch:"#ffffff",e:"#8a8078",s:"#8a8078",t:"#ffffff"},bio:"La doyenne du terrier. Tricote sans arrêt."},
  {id:"luciole",zone:"terrier",name:"Luciole",rar:"discret",food:2,likes:["bocal"],gift:[13,21],goldP:.12,c:{b:"#f7d27a",ch:"#fffaea",e:"#b0842a",s:"#b0842a",t:"#fff6c8"},bio:"Elle brille un tout petit peu dans le noir."},
  {id:"somnus",zone:"terrier",name:"Somnus",rar:"rare",food:3,likes:["hamac"],gift:[20,32],goldP:.4,acc:"bonnet",sleepy:true,c:{b:"#a49ad0",ch:"#f4f2fb",e:"#5c5488",s:"#5c5488",t:"#f4f2fb"},bio:"Dort 23 heures par jour. La 24e, il bâille."},
  {id:"reglisse",zone:"terrier",name:"Réglisse",rar:"rare",food:3,likes:["bocal","livres"],gift:[20,32],goldP:.4,acc:"collier",c:{b:"#6a5f68",ch:"#ece4e8",e:"#2e262c",s:"#2e262c",t:"#f2ecee"},bio:"Connaît tous les tunnels. Garde tous les secrets."},
  {id:"givre",zone:"neige",name:"Givre",rar:"commun",food:1,any:true,likes:["tasneige"],gift:[11,18],goldP:.07,c:{b:"#e6eef6",ch:"#ffffff",e:"#a9bcd0",s:"#a9bcd0",t:"#ffffff"},bio:"Se roule dans la neige jusqu'à disparaître."},
  {id:"painepice",zone:"neige",name:"Pain d'épice",rar:"commun",food:1,any:true,likes:["luge"],gift:[11,18],goldP:.07,acc:"bonnet",c:{b:"#cf8a52",ch:"#fff0de",e:"#6a3e20",s:"#6a3e20",t:"#fff0de"},bio:"Sent la cannelle et le four chaud."},
  {id:"mitaine",zone:"neige",name:"Mitaine",rar:"discret",food:2,likes:["luge","igloo"],gift:[15,24],goldP:.14,acc:"echarpe",c:{b:"#f08a6a",ch:"#fff2ea",e:"#7a3a2a",s:"#7a3a2a",t:"#fff2ea"},bio:"A perdu une moufle. La cherche encore."},
  {id:"brioche",zone:"neige",name:"Brioche",rar:"discret",food:2,likes:["igloo","chocolat"],gift:[15,24],goldP:.14,acc:"noeud",c:{b:"#f2c47a",ch:"#fffaee",e:"#a87a32",s:"#a87a32",t:"#fffaee"},bio:"Toute ronde. Adore le goûter."},
  {id:"aurore",zone:"neige",name:"Aurore",rar:"rare",food:3,likes:["igloo"],gift:[24,36],goldP:.45,acc:"flocon",c:{b:"#f2c6e0",ch:"#fff8fc",e:"#b07ab0",s:"#b07ab0",t:"#d8e8ff"},bio:"Son pelage change de couleur la nuit."},
  {id:"yeti",zone:"neige",name:"Yéti",rar:"legend",food:4,likes:["chocolat"],gift:[45,70],goldP:1,goldN:4,acc:"bonnet",ears:.8,c:{b:"#f4f4f6",ch:"#ffffff",e:"#c8c8d0",s:"#b8b8c4",t:"#ffffff"},bio:"Gros, doux et très discret. Personne n'y croit."}
);
// Gribouille, le 30e renard : il remplace Roussette parmi les clients (Roussette, c'est le joueur)
// Il dessine sur les vitres embuées ; béret, taches de peinture, bout de la queue trempé dans le bleu comme un pinceau.
FOXES.push({id:"gribouille",name:"Gribouille",rar:"commun",acc:"beret",mark:"peinture",c:{b:"#d6a6b8",ch:"#fff6f8",e:"#8a5a6e",s:"#8a5a6e",t:"#7cb8e0"},bio:"Dessine du bout de la patte sur les vitres embuées, les jours de pluie."});
// Copeau et Sésame (26/10/2026) : seulement pour la Clairière (refuge:1), jamais clients du Café (le Café les écarte : REG, VIPS et carnet).
// Copeau, le bricoleur, répare la porte de la maison puis l'agrandit ; Sésame, bleu nuit, porte la clé qui l'ouvre.
FOXES.push(
  {id:"copeau",refuge:1,name:"Copeau",rar:"rare",acc:"ceinture",c:{b:"#d9a066",ch:"#fff4e4",e:"#7a4a2a",s:"#7a4a2a",t:"#fff4e4"},bio:"Bricoleur. Répare tout ce qui grince, tout ce qui coince, tout ce qui penche."},
  {id:"sesame",refuge:1,name:"Sésame",rar:"rare",acc:"cle",c:{b:"#5f6a9a",ch:"#eef0fb",e:"#2f3660",s:"#2f3660",t:"#f2e6b8"},bio:"Porte une clé dorée depuis toujours. Cherchait sa porte."}
);
// invités d'Halloween (Café seulement) : ils viennent en VIP pendant la Nuit des citrouilles et donnent 5 bonbons
FOXES.push(
  {id:"feufollet",event:"halloween",name:"Feu Follet",rar:"legend",ghost:true,acc:"spectre",c:{b:"#e9eefc",ch:"#ffffff",e:"#aab6e2",s:"#c9d3f2",t:"#ffffff"},bio:"Un renard fantôme. Il traverse les murs, mais il dit toujours bonjour."},
  {id:"croquignol",event:"halloween",name:"Comte Croquignol",rar:"legend",acc:"vampire",c:{b:"#7a6a8e",ch:"#f4ecf6",e:"#3a2e48",s:"#3a2e48",t:"#f4ecf6"},bio:"Un renard vampire. Il ne boit que du jus de cerise, promis."},
  {id:"osselet",event:"halloween",name:"Osselet",rar:"legend",acc:"os",c:{b:"#4f4858",ch:"#f6f4f8",e:"#2e2a34",s:"#f6f4f8",t:"#f6f4f8"},bio:"Un renard squelette. Il claque des os quand il rit, c'est-à-dire tout le temps."},
  {id:"zombidou",event:"halloween",name:"Zombidou",rar:"legend",acc:"zombie",c:{b:"#a9cf9f",ch:"#eef6e4",e:"#5f8a5e",s:"#7aa874",t:"#eef6e4"},bio:"Un renard mort-vivant. Il marche très lentement, sauf vers les gâteaux."},
  {id:"mirabelle",event:"halloween",name:"Mirabelle",rar:"legend",acc:"magicienne",c:{b:"#c9a8ec",ch:"#fbf6ff",e:"#6a4f9a",s:"#6a4f9a",t:"#fbf6ff"},bio:"Une renarde sorcière. Ses potions sentent la myrtille, et ratent une fois sur deux."},
  {id:"paille",event:"halloween",name:"Brin de Paille",rar:"legend",acc:"epouvantail",stitch:true,c:{b:"#f0cf72",ch:"#fbeab4",e:"#c99a3a",s:"#d9ac48",t:"#f8e6a6"},bio:"Un renard épouvantail. Les corbeaux l'adorent, ce qui l'arrange bien."}
);
FOXES.forEach(f=>{f.zone=f.zone||"clairiere";FOX[f.id]=f});
const HWF=FOXES.filter(f=>f.event==="halloween");
// déguisements des clients pendant Halloween (accessoires de foxSVG)
const COSTUMES=["sorciere","citrouille","chauvesouris","vampire"];
const COSTNAME={sorciere:"en sorcière",citrouille:"en citrouille",chauvesouris:"en chauve-souris",vampire:"en vampire"};
// Les 5 Nuits d'Halloween : le rythme d'un jour de référence (base) avec d'autres commandes (graine seed).
// Graines et objectifs calculés par « python tools/balance-bot.py --nuits ». Réussir la 5e garde Feu Follet au café pour toujours.
const NIGHTS=[{base:4,seed:20,goal:92},{base:9,seed:42,goal:159},{base:14,seed:24,goal:256},{base:19,seed:33,goal:309},{base:24,seed:51,goal:337}];
const NIGHT_NAMES=["Nuit des lanternes","Nuit des chauves-souris","Nuit du brouillard","Nuit de la pleine lune","Grande nuit d'Halloween"];
// Le dessin est partagé avec la Clairière : js/foxart.js (chargé juste après ce fichier).
function foxSVG(f,o={}){return foxArt(f,o)}
