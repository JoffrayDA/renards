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
const NIGHTS=[{base:4,seed:30,goal:89},{base:9,seed:24,goal:168},{base:14,seed:21,goal:225},{base:19,seed:58,goal:309},{base:24,seed:26,goal:340}];
const NIGHT_NAMES=["Nuit des lanternes","Nuit des chauves-souris","Nuit du brouillard","Nuit de la pleine lune","Grande nuit d'Halloween"];
function foxSVG(f,o={}){
  const sil=o.sil,pose=sil?"sit":(o.pose||"sit");
  const c=sil?{b:"#e3d9df",ch:"#e3d9df",e:"#e3d9df",s:"#e3d9df",t:"#e3d9df"}:f.c;
  const st=sil?"#cbbec6":INK,e=f.ears||1,sc=f.scale||1,dark="#2e2028";
  const pink=sil?"none":"#f9c0cb",gh=f.ghost&&!sil;
  const earPair=(L,R,base)=>[L,R].map((d,i)=>{const [bx,by]=base[i];
    return `<g class="${i?"earR":""}" style="transform-origin:${bx}px ${by}px"><g transform="translate(${bx} ${by}) scale(${e}) translate(${-bx} ${-by})">${d}</g></g>`}).join("");
  const ear=(dy,left)=>{const X=x=>left?x:120-x;
    return `<path d="M${X(33)} ${44+dy} Q${X(30)} ${24+dy} ${X(38)} ${16+dy} Q${X(50)} ${23+dy} ${X(55)} ${36+dy}Z" fill="${c.b}"/>`+(sil?"":`<path d="M${X(37)} ${38+dy} Q${X(36)} ${27+dy} ${X(39.5)} ${22+dy} Q${X(46)} ${27+dy} ${X(49)} ${35+dy}Z" fill="${pink}" stroke="none"/><path d="M${X(38)} ${16.6+dy} Q${X(34.5)} ${19+dy} ${X(33.6)} ${23+dy} Q${X(38)} ${21+dy} ${X(42)} ${19.5+dy}Z" fill="${c.e}" stroke="none"/>`)};
  const face=(Y,happy)=>`<ellipse cx="60" cy="${Y+6.5}" rx="12.5" ry="7.5" fill="${c.ch}" stroke="none"/>`+(sil?"":
    (happy?`<path d="M44 ${Y+1} Q48 ${Y-4} 52 ${Y+1} M68 ${Y+1} Q72 ${Y-4} 76 ${Y+1}" fill="none" stroke-width="2.6"/>`
      :gh?`<g class="eyes" style="transform-origin:60px ${Y}px">${[47,73].map(x=>`<ellipse cx="${x}" cy="${Y-.5}" rx="4.6" ry="6.2" fill="${dark}" stroke="none"/><circle cx="${x+1.4}" cy="${Y-2.8}" r="1.7" fill="#fff" stroke="none"/><circle cx="${x-1.5}" cy="${Y+2.2}" r=".8" fill="#fff" stroke="none"/>`).join("")}</g>`
      :`<g class="eyes" style="transform-origin:60px ${Y}px"><ellipse cx="48" cy="${Y}" rx="2.9" ry="3.5" fill="${dark}" stroke="none"/><ellipse cx="72" cy="${Y}" rx="2.9" ry="3.5" fill="${dark}" stroke="none"/><circle cx="48.9" cy="${Y-1.3}" r=".95" fill="#fff" stroke="none"/><circle cx="72.9" cy="${Y-1.3}" r=".95" fill="#fff" stroke="none"/></g>`)
    +`<ellipse cx="40" cy="${Y+5}" rx="4.6" ry="2.6" fill="#f6a5b4" opacity=".6" stroke="none"/><ellipse cx="80" cy="${Y+5}" rx="4.6" ry="2.6" fill="#f6a5b4" opacity=".6" stroke="none"/><ellipse cx="60" cy="${Y+3.6}" rx="2.1" ry="1.5" fill="${dark}" stroke="none"/>${f.stitch?`<path d="M47 ${Y+7} Q60 ${Y+15} 73 ${Y+7}" fill="none" stroke-width="1.8"/>`+[.12,.28,.44,.6,.76,.92].map(t=>{const x=47+26*t,y=Y+7+16*t*(1-t);return `<path d="M${x.toFixed(1)} ${(y-2.4).toFixed(1)} v4.8" stroke-width="1.3"/>`}).join(""):`<path d="M56 ${Y+5.6} Q58 ${Y+8.6} 60 ${Y+5.6} Q62 ${Y+8.6} 64 ${Y+5.6}" fill="none" stroke-width="1.8"/>`}`);
  const acc=(top,Y,neck,w)=>{if(sil)return "";return({
    feuille:`<path d="M64 ${top+2} Q74 ${top-16} 88 ${top-10} Q82 ${top+5} 64 ${top+2}Z" fill="#a9d68f"/><path d="M67 ${top} Q76 ${top-6} 85 ${top-9}" fill="none" stroke="#6f9a60" stroke-width="1.6"/>`,
    gland:`<path d="M41 ${top+9} Q60 ${top-14} 79 ${top+9} Q60 ${top+3} 41 ${top+9}Z" fill="#c08a5a"/><path d="M60 ${top-5} Q61 ${top-11} 65 ${top-13}" fill="none" stroke-width="2.4"/>`,
    fleur:`<g transform="translate(84 ${top+5})">${[0,72,144,216,288].map(a=>`<circle cx="${(5.5*Math.cos(a*Math.PI/180)).toFixed(1)}" cy="${(5.5*Math.sin(a*Math.PI/180)).toFixed(1)}" r="4.2" fill="#ffc7d8" stroke-width="1.8"/>`).join("")}<circle r="3" fill="#ffe27a" stroke-width="1.6"/></g>`,
    flocon:`<g transform="translate(84 ${top+5})" stroke="#9fc3e8" stroke-width="2.4"><path d="M0 -7 V7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5"/></g>`,
    etoile:`<g transform="translate(60 ${Y-12}) scale(.75)"><path d="M0 -8 l2.6 5.4 5.9.7-4.4 4 1.2 5.9L0 5.1-5.3 8l1.2-5.9-4.4-4 5.9-.7z" fill="#ffe680" stroke-width="2.2"/></g><path d="M100 ${top-2} l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#fff3a8" stroke-width="1.2"/>`,
    noeud:`<path d="M60 ${neck} L48 ${neck-7} L48 ${neck+7}Z M60 ${neck} L72 ${neck-7} L72 ${neck+7}Z" fill="#f6a8c8"/><circle cx="60" cy="${neck}" r="3.6" fill="#ec86b0"/>`,
    echarpe:`<path d="M${60-w} ${neck-4} Q60 ${neck+6} ${60+w} ${neck-4} L${60+w} ${neck+3} Q60 ${neck+13} ${60-w} ${neck+3}Z" fill="#f59a8b"/><path d="M${60+w*.4} ${neck+6} L${62+w*.4} ${neck+18} L${69+w*.4} ${neck+16} L${67+w*.4} ${neck+4}Z" fill="#e88576"/>`,
    lunettes:`<g fill="rgba(255,255,255,.35)" stroke-width="2.2"><circle cx="48" cy="${Y}" r="7.5"/><circle cx="72" cy="${Y}" r="7.5"/></g><path d="M55.5 ${Y-1} Q60 ${Y-4} 64.5 ${Y-1}" fill="none" stroke-width="2"/>`,
    parapluie:`<path d="M94 90 Q96 ${top+20} 98 ${top-4}" fill="none" stroke="#8a6a4a" stroke-width="2.6"/><path d="M74 ${top-2} Q98 ${top-32} 122 ${top-2} Q110 ${top-8} 98 ${top-2} Q86 ${top-8} 74 ${top-2}Z" fill="#a9d68f"/><path d="M98 ${top-2} V${top-22}" fill="none" stroke="#6f9a60" stroke-width="1.6"/>`
,
    bob:`<path d="M38 ${top+9} Q60 ${top-18} 82 ${top+9}Z" fill="#f7d77a"/><path d="M28 ${top+9} Q60 ${top+18} 92 ${top+9} Q60 ${top+3} 28 ${top+9}Z" fill="#f2c45a"/>`,
    bonnet:`<path d="M38 ${top+11} Q60 ${top-20} 82 ${top+11}Z" fill="#9ec3ef"/><rect x="36" y="${top+6}" width="48" height="9" rx="4.5" fill="#f4f8fb"/><circle cx="60" cy="${top-11}" r="5.5" fill="#fff"/>`,
    sorciere:`<ellipse cx="60" cy="${top+8}" rx="31" ry="6.5" fill="#7458a8"/><path d="M45 ${top+7} L56 ${top-22} Q60 ${top-33} 73 ${top-30} Q64 ${top-25} 66 ${top-16} L75 ${top+7}Z" fill="#8a6ac0"/><path d="M46.9 ${top+1} L73.1 ${top+1} L74.4 ${top+5} L45.6 ${top+5}Z" fill="#f2a35c" stroke-width="1.8"/><path d="M71 ${top-30} l1.4 2.6 2.8.4 -2 2 .5 2.8 -2.7 -1.3 -2.6 1.3 .5 -2.8 -2 -2 2.8 -.4z" fill="#f7d77a" stroke-width="1.2"/>`,
    citrouille:`<ellipse cx="60" cy="${top+3}" rx="18" ry="11" fill="#f2a35c"/><path d="M53 ${top-6} Q50 ${top+3} 53 ${top+13} M67 ${top-6} Q70 ${top+3} 67 ${top+13} M60 ${top-8} V${top+14}" fill="none" stroke-width="1.6" opacity=".55"/><path d="M60 ${top-7} q0 -6 5 -8" fill="none" stroke="#6fae5e" stroke-width="3.6"/><path d="M62 ${top-11} q7 -5 10 1 q-6 3 -10 -1Z" fill="#8fca7a" stroke-width="1.6"/>`,
    chauvesouris:`<path d="M60 ${top+3} Q52 ${top-9} 38 ${top-7} Q43 ${top-2} 41 ${top+4} Q47 ${top} 50 ${top+6} Q55 ${top+1} 60 ${top+3} Q65 ${top+1} 70 ${top+6} Q73 ${top} 79 ${top+4} Q77 ${top-2} 82 ${top-7} Q68 ${top-9} 60 ${top+3}Z" fill="#5f4f72"/><circle cx="60" cy="${top+1}" r="5.4" fill="#5f4f72"/><path d="M56 ${top-3} l1 -4 2 3 M64 ${top-3} l-1 -4 -2 3" fill="#5f4f72" stroke-width="1.6"/><circle cx="58" cy="${top+1}" r="1" fill="#ffe27a" stroke="none"/><circle cx="62" cy="${top+1}" r="1" fill="#ffe27a" stroke="none"/>`,
    vampire:`<path d="M${60-w*.92} ${neck-1} L${60-w-7} ${neck-19} L${60-w*.35} ${neck+3}Z M${60+w*.92} ${neck-1} L${60+w+7} ${neck-19} L${60+w*.35} ${neck+3}Z" fill="#c43a5a"/><path d="M60 ${neck+2} L51 ${neck-3} L51 ${neck+7}Z M60 ${neck+2} L69 ${neck-3} L69 ${neck+7}Z" fill="#3d2a35"/><circle cx="60" cy="${neck+2}" r="2.8" fill="#e2546e" stroke-width="1.6"/><path d="M56.2 ${Y+6.4} l1.3 3.4 1.3 -3.2Z M61.2 ${Y+6.2} l1.3 3.2 1.3 -3.4Z" fill="#fff" stroke-width="1"/>`,
    os:`<g fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round">${[0,1,2].map(i=>`<path d="M${(60-w*(.42-i*.08)).toFixed(1)} ${neck+4+i*5} Q60 ${neck+1+i*5} ${(60+w*(.42-i*.08)).toFixed(1)} ${neck+4+i*5}"/>`).join("")}<path d="M60 ${neck+1} V${neck+15}"/></g><g fill="none" stroke="#fff" stroke-width="1.8"><circle cx="48" cy="${Y}" r="5.8"/><circle cx="72" cy="${Y}" r="5.8"/></g><g transform="translate(89 ${top+5}) rotate(-32) scale(1.15)"><rect x="-8" y="-2.4" width="16" height="4.8" fill="#fff" stroke-width="1.8"/>${[[-8,-2.5],[-8,2.5],[8,-2.5],[8,2.5]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.2" fill="#fff" stroke-width="1.8"/>`).join("")}<rect x="-8.6" y="-1.5" width="17.2" height="3" fill="#fff" stroke="none"/></g>`,
    zombie:`<path d="M44 ${top+2} L80 ${top+15} L78 ${top+21} L42 ${top+8}Z" fill="#fff5e8"/><path d="M51 ${top+5} l-1.4 5 M59 ${top+8} l-1.4 5 M67 ${top+11} l-1.4 5 M75 ${top+14} l-1.4 5" stroke="#d8ccd4" stroke-width="1.4"/><path d="M75 ${Y+11} l10 -7" fill="none" stroke-width="1.6"/><path d="M76.5 ${Y+7} l2.4 3 M79.5 ${Y+5} l2.4 3 M82.5 ${Y+3} l2.4 3" fill="none" stroke-width="1.4"/><circle cx="40" cy="${Y-9}" r="2.6" fill="#7aa874" stroke-width="1.2"/>`,
    epouvantail:(()=>{const st="#c99a3a",hap=top===20;
      // brins de paille sur le corps, et qui dépassent du cou et des joues
      let h=[[-.8,-8,-.5],[-.55,6,.4],[.6,-4,-.3],[.82,8,.5],[-.2,12,.2],[.3,14,-.4]].map(([k,dy,a])=>{const x=60+w*k,y=neck+dy;return `<path d="M${x.toFixed(1)} ${y} l${(6*Math.cos(a)).toFixed(1)} ${(6*Math.sin(a)).toFixed(1)}" stroke="${st}" stroke-width="1.6"/>`}).join("");
      h+=`<path d="M${60-w*.7} ${neck} l-7 7 M${60-w*.62} ${neck+2} l-4 9 M${60-w*.5} ${neck+3} l-1 9 M${60+w*.5} ${neck+3} l1 9 M${60+w*.62} ${neck+2} l4 9 M${60+w*.7} ${neck} l7 7" fill="none" stroke="#e8c048" stroke-width="2.4"/><path d="M${60-w*.6} ${neck-1} Q60 ${neck+5} ${60+w*.6} ${neck-1}" fill="none" stroke="#8a6a3e" stroke-width="2.6"/><path d="M60 ${neck+2} l-4 4 M60 ${neck+2} l4 4" stroke="#8a6a3e" stroke-width="2"/>`;
      h+=`<rect x="${60+w*.25}" y="${neck+6}" width="10" height="9" rx="1.4" fill="#9ec3ef" stroke-width="1.6"/><path d="M${60+w*.25+2} ${neck+8.5} h6 M${60+w*.25+2} ${neck+12.5} h6" stroke="${INK}" stroke-width=".9" stroke-dasharray="1.4 1.2"/>`;
      // yeux boutons (pas sur la pose contente, qui a les yeux fermés)
      if(!hap)h+=[48,72].map(x=>`<circle cx="${x}" cy="${Y}" r="4" fill="#3d2a35" stroke-width="1.4"/><circle cx="${x-1.2}" cy="${Y-1}" r=".8" fill="#fbeab4" stroke="none"/><circle cx="${x+1.2}" cy="${Y+1}" r=".8" fill="#fbeab4" stroke="none"/>`).join("");
      // chapeau de paille effiloché, ficelle et petit corbeau
      h+=`<path d="M25 ${top+11} l-5 3 M30 ${top+13} l-3 6 M95 ${top+11} l5 3 M90 ${top+13} l3 6" fill="none" stroke="#e8c048" stroke-width="2.4"/>`;
      h+=`<ellipse cx="60" cy="${top+8}" rx="36" ry="7.5" fill="#e8c060"/>`+Array.from({length:14},(_,i)=>{const a=Math.PI*(.04+.92*i/13),x=60-36*Math.cos(a),y=top+8+7.5*Math.sin(a);return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(-3*Math.cos(a)).toFixed(1)} ${(3.4*Math.sin(a)+.6).toFixed(1)}" stroke="${st}" stroke-width="1.4"/>`}).join("");
      h+=`<path d="M30 ${top+7} Q60 ${top+13} 90 ${top+7}" fill="none" stroke="${st}" stroke-width="1.2" opacity=".7"/><path d="M44 ${top+6} Q44 ${top-13} 60 ${top-16} Q76 ${top-13} 76 ${top+6}Z" fill="#f0cd6c"/><path d="M46 ${top-4} Q60 ${top-1} 74 ${top-4} M48 ${top-10} Q60 ${top-7} 72 ${top-10}" fill="none" stroke="${st}" stroke-width="1.2"/><path d="M57 ${top-15} l-2 -5 M60 ${top-16} v-5 M63 ${top-15} l2 -5" stroke="#e8c048" stroke-width="2"/><path d="M44.2 ${top+1} Q60 ${top+5} 75.8 ${top+1}" fill="none" stroke="#8a6a3e" stroke-width="2.6"/><path d="M68 ${top+3} l3 6 M70 ${top+2.5} l5 5" stroke="#8a6a3e" stroke-width="1.8"/>`;
      h+=`<path d="M86 ${top+2} l6 -3 l-1 5Z" fill="#3d2a35" stroke-width="1.4"/><ellipse cx="80" cy="${top+2}" rx="6.5" ry="4.8" fill="#3d2a35" stroke-width="1.6"/><circle cx="75.5" cy="${top-3}" r="3.8" fill="#3d2a35" stroke-width="1.6"/><path d="M72 ${top-3.4} l-4 1.2 l3.8 1.6Z" fill="#f2a35c" stroke-width="1"/><circle cx="74.8" cy="${top-4}" r="1" fill="#fff" stroke="none"/>`;
      return h})(),
    couronne:`<path d="M42 ${top+9} Q60 ${top+3} 78 ${top+9}" fill="none" stroke="#6fae5e" stroke-width="3"/>${[[45,top+5,5],[60,top,6.5],[75,top+5,5]].map(([x,y,r])=>`<path d="M${x} ${y-r+.5} q.5 -3 3.4 -3.8" fill="none" stroke="#6fae5e" stroke-width="2.2"/><ellipse cx="${x}" cy="${y}" rx="${r*1.25}" ry="${r}" fill="#f2a35c" stroke-width="2"/><path d="M${x-r*.7} ${y} l${r*.3} ${-r*.45} l${r*.3} ${r*.45}Z M${x+r*.1} ${y} l${r*.3} ${-r*.45} l${r*.3} ${r*.45}Z" fill="#ffe27a" stroke-width="1"/>`).join("")}`,
    magicienne:`<path d="M${60-w} ${neck-3} Q60 ${neck+9} ${60+w} ${neck-3} L${60+w+4} ${neck+8} Q60 ${neck+18} ${60-w-4} ${neck+8}Z" fill="#4a3a78"/>${[[-.55,7],[0,11],[.55,7]].map(([k,dy])=>`<path d="M${(60+w*k).toFixed(1)} ${neck+dy-3} l1 2 2 .3 -1.5 1.4 .4 2.1 -1.9 -1 -1.9 1 .4 -2.1 -1.5 -1.4 2 -.3z" fill="#f7d77a" stroke="none"/>`).join("")}<circle cx="60" cy="${neck+2}" r="3" fill="#f7d77a" stroke-width="1.6"/><path d="M${60+w*.7} ${neck+14} L${108} ${top+18}" stroke="#8a5a3a" stroke-width="3.4" stroke-linecap="round"/><path d="M108 ${top+9} l2.6 5.4 5.9.7 -4.4 4 1.2 5.9 -5.3 -2.9 -5.3 2.9 1.2 -5.9 -4.4 -4 5.9 -.7z" fill="#ffe680" stroke-width="2"/><path d="M100 ${top+4} l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1z M117 ${top+28} l.8 2 2 .8 -2 .8 -.8 2 -.8 -2 -2 -.8 2 -.8z" fill="#fff3a8" stroke-width="1"/><ellipse cx="60" cy="${top+8}" rx="33" ry="6.8" fill="#4a3a78"/><path d="M44 ${top+7} L54 ${top-24} Q58 ${top-36} 72 ${top-36} Q80 ${top-34} 84 ${top-28} Q76 ${top-31} 70 ${top-26} L76 ${top+7}Z" fill="#5d4a94"/><path d="M45.4 ${top+1} L74.6 ${top+1} L75.6 ${top+5.5} L44.4 ${top+5.5}Z" fill="#b48ae0" stroke-width="1.6"/><path d="M63 ${top-14} a6 6 0 1 0 2 9 a4.6 4.6 0 1 1 -2 -9z" fill="#f7d77a" stroke-width="1.4"/><circle cx="56" cy="${top-6}" r="1.1" fill="#fff3a8" stroke="none"/><circle cx="68" cy="${top-20}" r=".9" fill="#fff3a8" stroke="none"/>`,
    spectre:[[14,top+16,1],[104,top+8,-1],[100,top+40,1]].map(([x,y,d])=>`<path d="M${x} ${y} q${-5*d} -7 0 -15 q${2*d} 6 ${6*d} 8 q-1 6 ${-6*d} 7Z" fill="#cfe2ff" stroke="#9fb4e0" stroke-width="1.6"/>`).join(""),
    collier:[-3,-2,-1,0,1,2,3].map(k=>`<circle cx="${(60+k*w/3.6).toFixed(1)}" cy="${(neck+3-k*k*.45).toFixed(1)}" r="2.6" fill="#fff" stroke-width="1.4"/>`).join("")
  })[f.acc]||""};
  let body;const tailG=s=>gh?"":s;
  if(pose==="sleep"){
    body=`<ellipse cx="64" cy="76" rx="36" ry="17" fill="${c.b}"/>
    <path d="M98 74 C104 94 70 98 32 92 C24 90 24 85 32 85 C64 88 88 86 92 74Z" fill="${c.b}"/>
    <path d="M32 92 C24 90 24 85 32 85 C37 85.6 41 86 45 86.4 C44 89.8 39 92 32 92Z" fill="${c.t}"/>
    ${earPair(`<path d="M26 68 Q20 52 28 47 Q38 53 41 63Z" fill="${c.b}"/>${sil?"":`<path d="M29 64 Q26 55 29.5 51 Q35 55 37 62Z" fill="${pink}" stroke="none"/>`}`,
      `<path d="M45 61 Q46 46 54 43 Q59 52 58 63Z" fill="${c.b}"/>${sil?"":`<path d="M48 60 Q49 51 53 47.5 Q56 53 55 60Z" fill="${pink}" stroke="none"/>`}`,[[34,64],[52,62]])}
    <ellipse cx="44" cy="73" rx="20" ry="15" fill="${c.b}"/>
    <ellipse cx="44" cy="77.5" rx="9" ry="5.2" fill="${c.ch}" stroke="none"/>
    ${sil?"":`<path d="M34 72 Q37.5 74.5 41 72 M47 72 Q50.5 74.5 54 72" fill="none" stroke-width="2.4"/><ellipse cx="32" cy="77" rx="3.6" ry="2.2" fill="#f6a5b4" opacity=".6" stroke="none"/><ellipse cx="56" cy="77" rx="3.6" ry="2.2" fill="#f6a5b4" opacity=".6" stroke="none"/><ellipse cx="44" cy="76" rx="1.8" ry="1.3" fill="${dark}" stroke="none"/>`}`;
  }else if(pose==="happy"){
    const top=20,Y=42;
    body=tailG(`<g class="tail" style="transform-origin:82px 82px"><path d="M80 86 C104 86 112 60 99 46 C96 60 90 70 78 74Z" fill="${c.b}"/><path d="M99 46 C106 53 108 62 106 68 C102 63 98 58 95 53 C96 51 97 48 99 46Z" fill="${c.t}"/></g>`)+`
    ${gh?`<ellipse cx="33" cy="64" rx="5" ry="8" fill="${c.b}" transform="rotate(40 33 64)"/><ellipse cx="87" cy="64" rx="5" ry="8" fill="${c.b}" transform="rotate(-40 87 64)"/><path d="M37 86 C30 70 38 55 60 55 C82 55 90 70 83 86 L85 97 Q80 91 74 96 Q67 91 60 96 Q53 91 46 96 Q40 91 35 97Z" fill="${c.b}"/>`:`<path d="M37 90 C30 70 38 55 60 55 C82 55 90 70 83 90 Q60 95 37 90Z" fill="${c.b}"/>`}
    <ellipse cx="60" cy="77" rx="11" ry="11" fill="${c.ch}" stroke="none"/>
    ${gh?"":`<ellipse cx="51" cy="90" rx="6.5" ry="4.2" fill="${c.s}"/><ellipse cx="69" cy="90" rx="6.5" ry="4.2" fill="${c.s}"/>`}
    ${earPair(ear(-15,true),ear(-15,false),[[44,23],[76,23]])}
    <ellipse cx="60" cy="42" rx="27" ry="22" fill="${c.b}"/>
    ${face(Y,true)}${acc(top,Y,63,21)}`;
  }else{
    const top=35,Y=55;
    body=tailG(`<g class="tail" style="transform-origin:90px 82px"><path d="M86 87 C108 90 118 72 108 57 C102 66 98 72 89 74Z" fill="${c.b}"/><path d="M108 57 C114 64 114 72 110 77 C106 72 102 67 99 63 C101 61 104 59 108 57Z" fill="${c.t}"/></g>`)+`
    ${earPair(ear(0,true),ear(0,false),[[44,38],[76,38]])}
    ${gh?`<ellipse cx="22" cy="68" rx="6" ry="9" fill="${c.b}" transform="rotate(35 22 68)"/><ellipse cx="98" cy="68" rx="6" ry="9" fill="${c.b}" transform="rotate(-35 98 68)"/><path d="M24 84 C18 60 30 35 60 35 C90 35 102 60 96 84 L98 96 Q92 89 86 95 Q80 89 73 95 Q67 89 60 95 Q53 89 47 95 Q40 89 34 95 Q28 89 22 96Z" fill="${c.b}"/>`:`<path d="M24 88 C18 60 30 35 60 35 C90 35 102 60 96 88 Q60 95 24 88Z" fill="${c.b}"/>`}
    ${face(Y,false)}
    ${gh?"":`<ellipse cx="50" cy="89" rx="7" ry="4.4" fill="${c.s}"/><ellipse cx="70" cy="89" rx="7" ry="4.4" fill="${c.s}"/>`}
    ${acc(top,Y,74,30)}`;
  }
  const zz=pose==="sleep"?`<text class="zz" x="66" y="56" font-family="Mochiy Pop One,sans-serif" font-size="12" fill="${INK}">z</text><text class="zz" style="animation-delay:1.2s" x="74" y="46" font-family="Mochiy Pop One,sans-serif" font-size="9" fill="${INK}">z</text>`:"";
  return `<svg viewBox="0 -16 120 116" class="${o.cls||""}${gh?" ghosty":""}" aria-hidden="true"><g transform="translate(${60-60*sc} ${92-92*sc}) scale(${sc})"${gh?' opacity=".82"':""}>
  <ellipse cx="60" cy="${gh?99:92}" rx="${gh?26:40}" ry="${gh?3.5:5}" fill="#3d2a35" opacity="${gh?.09:.14}"/>
  <g stroke="${st}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#wobble)">${body}</g>${zz}</g></svg>`;
}
