/* Kitsune Café : la Petite Italie, Monde 2 (03/11/2026, maquette validée par Joffray : tools/italie.html).
   20 journées (Joffray : « avec autant de produits, on peut faire 20 niveaux »), un nouveau café, le Caffè Kitsune, avec son propre
   équipement (S.it.own, prix ×IT_PRICE) ; les pièces, les quêtes, les bonus et le style restent communs. Les gestes ne changent pas :
   mêmes clés de recettes, mêmes prix et cuissons, seuls le nom et le dessin changent (VAR.italie, ICON["clé@italie"]).
   Chaque journée reprend le rythme d'un jour de référence du premier monde (base), avec sa graine et son objectif calculés par
   `python tools/balance-bot.py --italie`. Lorenzo, le petit renard du quartier, accueille Roussette et présente les spécialités.
   On y entre par le panneau en haut de la carte du premier café, une fois le jour 40 réussi (?italie=1 pour tester).
   Sauvegarde : S.it = {day, stars, best, own, intro, guest} ; S.world = le monde affiché à la dernière visite. */

/* ---------- les renards du quartier (dans FOX, pas dans FOXES : ni la Clairière, ni le grand portrait) ---------- */
const ITF=[
  {id:"lorenzo",name:"Lorenzo",rar:"commun",acc:"coppola",scale:.84,c:{b:"#e8955a",ch:"#fff4e6",e:"#8a4a2a",s:"#7a4028",t:"#fff4e6"},bio:"Le petit renard du quartier. Il connaît chaque pavé de la rue, et il accueille tous les nouveaux."},
  {id:"pistache",name:"Pistache",rar:"commun",acc:"casque",c:{b:"#e9d49a",ch:"#fffaf0",e:"#9a7a4a",s:"#8a6a44",t:"#fffaf0"},bio:"Livre les cannoli en scooter. Toujours pressée, jamais en retard."},
  {id:"ricotta",name:"Ricotta",rar:"commun",acc:"tablier",c:{b:"#fbf4ea",ch:"#ffffff",e:"#d8b8a8",s:"#c9a896",t:"#ffffff"},bio:"Toute ronde, toute blanche. Pétrit la pâte à cornetti avant l'aube."},
  {id:"tito",name:"Tito",rar:"commun",acc:"paille",scale:.8,c:{b:"#c98552",ch:"#fff3e2",e:"#7a4a2c",s:"#6a3c26",t:"#fff3e2"},bio:"Le plus petit du quartier. Pêche des pièces au fond de la fontaine."},
  {id:"donnalimone",name:"Donna Limone",rar:"legend",acc:"citrons",c:{b:"#f7d46a",ch:"#fffbe8",e:"#c99a3a",s:"#b88a2a",t:"#fffbe8"},bio:"L'invitée d'honneur du quartier. Ses citronniers donnent la meilleure granita du monde."},
  // le grand-père de Lorenzo (histoire du carnet, choix de Joffray) : ne vient au Caffè qu'après le jour 20 (S.it.nonno)
  {id:"nonno",name:"Nonno",rar:"rare",acc:"garcon",mark:"vieux",c:{b:"#d4a684",ch:"#fbf5ec",e:"#8a6a54",s:"#7d5e4a",t:"#fbf5ec"},bio:"Le grand-père de Lorenzo. Il tenait le Caffè Kitsune autrefois, et son carnet de recettes s'était envolé dans tout le quartier."}
];
ITF.forEach(f=>{f.world="italie";FOX[f.id]=f});
const ITF_REG=ITF.filter(f=>f.rar==="commun");

/* ---------- les journées ---------- */
// rythme d'un jour de référence du premier monde (le jour 1 du quartier se joue déjà comme le jour 15), graine et objectif par --italie
const IT_DAYS=[{base:15,seed:6,goal:143},{base:16,seed:13,goal:151},{base:17,seed:12,goal:168},{base:18,seed:8,goal:185},{base:19,seed:3,goal:209},{base:20,seed:3,goal:218},{base:21,seed:0,goal:219},{base:22,seed:11,goal:267},{base:23,seed:13,goal:277},{base:24,seed:7,goal:304},{base:25,seed:0,goal:319},{base:26,seed:10,goal:337},{base:27,seed:3,goal:357},{base:28,seed:13,goal:383},{base:30,seed:15,goal:414},{base:32,seed:7,goal:433},{base:34,seed:9,goal:450},{base:36,seed:1,goal:459},{base:38,seed:5,goal:442},{base:40,seed:14,goal:456}];
// ★★★ de chaque journée, en multiple de l'objectif (cuts dans data.js). Baissé le 04/11/2026 puis remis à 1,7 partout le même jour :
// Joffray croyait avoir tout l'équipement, il lui manquait la déco. Le mécanisme reste pour régler une journée à part si besoin.
const IT_S3=Array(20).fill(1.7);
const IT_LAST=IT_DAYS.length;
// équipement prévu pour chaque journée du quartier (calibrage, et objectif relevé au-delà, comme KIT)
const IT_KIT=[["plantes",1,1],["comptoir1",1,2],["double",1,2],["guirlande",1,3],["fourpro",1,3],["barista",1,4],["plateau",1,4],["comptoir1",2,6],["disque",1,6],["coussins",1,7],["serveur",1,8],["machines",1,9],["plateau",2,10],["fauteuils",1,11],["four2",1,13],["lanternes",1,15]];
S.it=S.it||{day:1,stars:{},best:{},own:{},intro:0,guest:0};
// l'équipement du quartier coûtait ×1,3 avant le 04/11/2026 (inabordable) : on rembourse une fois la différence avec IT_PRICE
if(!S.it.px){let back=0;for(const id in S.it.own){const u=ALLUP.find(x=>x.id===id);if(u)for(let i=0;i<S.it.own[id]&&i<u.lv.length;i++)back+=Math.round(u.lv[i].c*1.3/10)*10-Math.round(u.lv[i].c*IT_PRICE/10)*10}
  S.it.px=1;if(back>0){S.coins+=back;setTimeout(()=>toast(`Petite Italie : l'équipement est moins cher, +${back} pièces remboursées`),1200)}save()}
if(new URLSearchParams(location.search).get("italie")==="1"){S.itOpen=1;save()} // pour tester sans avoir fini le jour 40
const itOpen=()=>S.day>LASTDAY||!!S.itOpen;
// fonctions communes à tous les quartiers (Petite Italie, Paris) : elles lisent le quartier affiché, WD()
const itStarSum=()=>Object.values(WD().sv().stars).reduce((a,b)=>a+b,0);
const itLast=()=>WD().days.length;
const itCur=()=>Math.min(WD().sv().day,itLast());
function itCfg(d){const N=WD().days[d-1];return{...cfgOf(N.base),goal:Math.round(N.goal*(1+equipBonus(d)))}}
const seaNow=()=>WORLD||chapOf(curDay()).sea;

WORLDS.italie={id:"italie",name:"Petite Italie",cafe:"Caffè Kitsune",short:"Caffè",sv:()=>S.it,days:IT_DAYS,s3:IT_S3,kit:IT_KIT,
  opt:{lait:"Mousse",chantilly:"Panna"},optItem:(r,o)=>o==="lait"&&r==="cafe"?"Cappuccino":`${REC[r].name} panna`,optWord:"la panna",
  gel:GEL,cone:"le cornet",coneHint:"Touche les bacs de gelato <b>dans l'ordre de la commande</b>, de bas en haut.",gelHint:g=>`Gelato : touche les bacs <b>dans l'ordre, de bas en haut</b> (${gelName(g)}). Raté ? Touche le cornet.`,
  gelNew:"Dès la prochaine journée, un comptoir à glaces : chaque client veut ses trois parfums dans son ordre à lui. Touche les bacs de bas en haut.",
  optNew:"Touche « Panna », au bout du plateau, pour en mettre sur une cioccolata ou un tiramisù.",
  guest:"donnalimone",guestBio:"Elle vient dans tous les cafés : elle paie le triple, mais elle est pressée.",reg:()=>[...ITF_REG,...ITF_REG,...ITF_REG,...(S.it.nonno?[FOX.nonno]:[])],
  music:d=>d%2?"tarantella":"polka",mapMusic:"piazza",isOpen:()=>itOpen(),lockMsg:"Réussis le jour 40 pour ouvrir la Petite Italie.",
  layout:()=>itLayout(),mapSVG:L=>itMapSVG(L),outside:()=>outsideIt(),
  mapExtra:(L,pc)=>`<button class="mguest ok" style="${pc(L.lor.x,L.lor.u)}" data-act="lorenzo" type="button" aria-label="Lorenzo">${foxSVG(FOX.lorenzo,{pose:"happy"})}<em>Lorenzo</em></button>`
    +(S.it.nonno?`<button class="mguest ok" style="${pc(L.cafe.x>200?L.cafe.x-110:L.cafe.x+110,L.cafe.u-30)}" data-act="nonno" type="button" aria-label="Nonno">${foxSVG(FOX.nonno,{pose:"sit"})}<em>Nonno</em></button>`:"")
    +`<button class="mnext" style="${pc(200,52)}" data-act="monde1" type="button" aria-label="Retour au premier café"></button>`
    +(typeof paOpen==="function"&&paOpen()?`<button class="mnext" style="${pc(L.cafe.x+128,L.cafe.u+34)}" data-act="paris" type="button" aria-label="Paris"></button>`:""),
  arrive:()=>{if(!S.it.intro)lorenzoIntro();else itStory()},
  scenes:done=>itScenes(done),
  news:(d,st,prev,news)=>{
    if(st&&!prev&&IT_PAGES[d])news.push(itRow(pageSVG,"Une page du carnet de Nonno !","Tu peux la relire dans le carnet : touche Lorenzo sur la carte.","background:#fbf3dc"))}};

/* ---------- la carte du quartier : noms et dessins (mêmes clés, prix et cuissons) ---------- */
VAR.italie={cafe:["Espresso","espressos"],croissant:["Cornetto","cornetti"],the:["Granita citron","granite citron"],cookie:["Cannoli","cannoli"],
  choco:["Cioccolata","cioccolate"],smoothie:["Gelato","gelati"],gateau:["Tiramisù","parts de tiramisù"]};
Object.assign(ICON,{
  "cafe@italie":`<ellipse cx="20" cy="33" rx="15" ry="3.6" fill="#fff" ${K}/><path d="M30 20 Q36 20 35 24 Q34 28 29 27" fill="none" ${K}/><path d="M8 17 H31 Q31 32 19.5 32 Q8 32 8 17Z" fill="#fff" ${K}/><ellipse cx="19.5" cy="17" rx="11.5" ry="2.8" fill="#6b3f2a" ${K}/><path d="M16 11 q-2 -3 0 -6 M22 11 q-2 -3 0 -6" fill="none" stroke="#c9b3a8" stroke-width="1.8" stroke-linecap="round"/>`,
  "croissant@italie":`<path d="M4 28 Q8 14 20 12 Q32 14 36 28 Q30 33 20 32 Q10 33 4 28Z" fill="#f2b765" ${K}/><path d="M13 15 Q15 24 14 31 M20 12.5 V32 M27 15 Q25 24 26 31" fill="none" stroke="#c98a45" stroke-width="2" stroke-linecap="round"/><g fill="#fff">${[[10,18],[17,16],[24,17],[30,20],[14,23],[28,24],[21,22]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.2"/>`).join("")}</g>`,
  "the@italie":`<path d="M9 14 H31 L27 35 H13Z" fill="#fff6c8" ${K}/><path d="M10 14 Q14 6 20 8 Q26 5 30 14Z" fill="#fde98a" ${K}/><circle cx="16" cy="11" r="1" fill="#fff"/><circle cx="24" cy="10" r="1" fill="#fff"/><circle cx="31" cy="13" r="5" fill="#ffe36a" ${K}/><path d="M31 8.5 V17.5 M27 11 L35 15 M27 15 L35 11" stroke="#f2c94a" stroke-width="1.2"/><path d="M24 3 L22 16" ${K} stroke="#f47f9a"/>`,
  "cookie@italie":`<g transform="rotate(-18 20 21)"><rect x="8" y="13" width="24" height="15" rx="7.5" fill="#e9a65c" ${K}/><path d="M12 14 l4 13 M18 13.5 l4 14 M24 13.5 l4 14" stroke="#c98a45" stroke-width="1.6"/><ellipse cx="7" cy="20.5" rx="4.4" ry="7.5" fill="#fff8ea" ${K}/><ellipse cx="33" cy="20.5" rx="4.4" ry="7.5" fill="#fff8ea" ${K}/><circle cx="5.6" cy="18" r="1.4" fill="#8fbf5a"/><circle cx="7.6" cy="23" r="1.3" fill="#8fbf5a"/><circle cx="34" cy="18" r="1.4" fill="#8fbf5a"/><circle cx="32.4" cy="23" r="1.3" fill="#e0505a"/></g>`,
  "choco@italie":`<ellipse cx="20" cy="34" rx="16" ry="3.6" fill="#fff" ${K}/><path d="M31 19 Q38 19 37 24 Q36 29 30 28" fill="none" ${K}/><path d="M5 16 H32 Q32 33 18.5 33 Q5 33 5 16Z" fill="#f4a6b4" ${K}/><ellipse cx="18.5" cy="16" rx="13.5" ry="3.2" fill="#5a3324" ${K}/><path d="M14 15 q4 -2 9 0" stroke="#8a5a44" stroke-width="1.6" fill="none"/><path d="M22 4 L19 15" stroke="#d9c8b4" stroke-width="2.6" stroke-linecap="round"/>`,
  "smoothie@italie":`<path d="M12 21 L20 38 L28 21Z" fill="#f2c27a" ${K}/><path d="M14 24 L26 24 M15.5 28 L24.5 28" stroke="#c98a45" stroke-width="1.4"/><circle cx="15" cy="18" r="7" fill="#b6dc8a" ${K}/><circle cx="25" cy="18" r="7" fill="#f9b8c6" ${K}/><circle cx="20" cy="10" r="6.5" fill="#fff4dc" ${K}/><circle cx="18" cy="8" r="1.2" fill="#fff"/>`,
  "gateau@italie":`<path d="M5 17 L20 10 L35 17 V31 L20 38 L5 31Z" fill="#fbe9cf" ${K}/><path d="M5 17 L20 24 L35 17" fill="none" ${K}/><path d="M20 24 V38" ${K}/><path d="M5 22 L20 29 L35 22 M5 26.5 L20 33.5 L35 26.5" fill="none" stroke="#8a5a3a" stroke-width="2.6"/><path d="M5 17 L20 10 L35 17 L20 24Z" fill="#8a5a3a" ${K}/><g fill="#5b3a2a"><circle cx="15" cy="16" r=".9"/><circle cx="22" cy="14" r=".9"/><circle cx="26" cy="18" r=".9"/><circle cx="19" cy="19" r=".9"/></g>`,
  "lait@italie":`<path d="M8 24 Q6 14 16 14 Q18 8 24 11 Q32 10 32 18 Q36 24 30 28 H10 Q6 28 8 24Z" fill="#fffaf0" ${K}/><path d="M14 20 q3 -2 6 0" stroke="#e6d3c4" stroke-width="1.6" fill="none"/><path d="M12 28 L14 35 H26 L28 28" fill="#d9c8b4" ${K}/>`,
  "chantilly@italie":`<path d="M11 34 L14 19 H26 L29 34Z" fill="#f2d48a" ${K}/><path d="M13 20 Q10 13 16 12 Q16 5 20 5 Q24 5 24 12 Q30 13 27 20Z" fill="#fffaf2" ${K}/><path d="M17 13 q3 -2 6 0" fill="none" stroke="#e8dcd6" stroke-width="1.6" stroke-linecap="round"/>`
});
OPTPOS.choco="translate(0 2)";

/* ---------- dehors, derrière la vitre : la rue, les collines et la tour qui penche ---------- */
OUT.italie={sky:["#8fcdef","#fde7cf"],hill:["#c9d89a","#b5c983"],cloud:"#fff"};
function outsideIt(){
  const f=n=>n.toFixed(1),l=(w=2.4)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`,H=OUT.italie.hill;
  const defs=`<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ec"/><stop offset=".65" stop-color="#cfe9f4"/><stop offset="1" stop-color="#fde7cf"/></linearGradient>
    <radialGradient id="pSun"><stop offset="0" stop-color="#fffbe8" stop-opacity=".95"/><stop offset=".45" stop-color="#fff3cf" stop-opacity=".35"/><stop offset="1" stop-color="#fff3cf" stop-opacity="0"/></radialGradient>`;
  let st=`<rect x="0" y="0" width="600" height="200" fill="url(#sky)"/><circle cx="470" cy="54" r="80" fill="url(#pSun)"/><circle cx="470" cy="54" r="17" fill="#fff6c8" ${l(2)}/>`,an="";
  // collines de Toscane et leurs cyprès
  st+=`<path d="M0 118 Q90 92 190 110 Q300 88 400 106 Q500 90 600 104 V200 H0Z" fill="${H[0]}"/>`;
  st+=[[120,108],[134,110],[300,100],[312,103],[520,98],[534,101],[548,104]].map(([x,y])=>`<path d="M${x} ${y-26} Q${x+6} ${y-12} ${x+4} ${y} H${x-4} Q${x-6} ${y-12} ${x} ${y-26}Z" fill="#6aa676" ${l(1.6)}/>`).join("");
  st+=`<path d="M0 132 Q120 116 260 128 Q400 114 600 126 V200 H0Z" fill="${H[1]}" ${l(2)}/>`;
  st+=[0,1,2,3,4,5].map(i=>`<path d="M${400+i*14} 124 q4 8 2 18" fill="none" stroke="#8aa85a" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 4"/>`).join("");
  // la tour qui penche, au loin
  st+=`<g transform="rotate(5 236 132)">${[0,1,2,3,4,5].map(i=>`<rect x="226" y="${f(124-i*9)}" width="20" height="9" fill="#fbf4e6" ${l(1.6)}/>${[0,1,2].map(j=>`<path d="M${229+j*6} ${f(133-i*9)} v-5 a1.6 1.6 0 0 1 3.2 0 v5" fill="none" stroke="#c9b8a0" stroke-width="1"/>`).join("")}`).join("")}<rect x="229" y="62" width="14" height="8" fill="#fbf4e6" ${l(1.6)}/></g>`;
  // les façades d'en face : ocre, rose, jaune, volets verts, tuiles, linge
  const fac=(x,w,top,col)=>{let g=`<rect x="${x}" y="${top}" width="${w}" height="${200-top}" fill="${col}" ${l(2)}/><path d="M${x-3} ${top} H${x+w+3}" stroke="#d9774e" stroke-width="7" stroke-linecap="round"/><path d="M${x-3} ${top} H${x+w+3}" stroke="${INK}" stroke-width="1.4" opacity=".4"/>`;
    for(let i=0;i<Math.floor((w-6)/34);i++)for(let j=0;j<2;j++){const wx=x+14+i*34,wy=top+14+j*36;g+=`<rect x="${wx}" y="${wy}" width="13" height="19" rx="5" fill="#8fbcd4" ${l(1.6)}/><rect x="${wx-7}" y="${wy}" width="7" height="19" rx="1" fill="#7fb48a" ${l(1.4)}/><rect x="${wx+13}" y="${wy}" width="7" height="19" rx="1" fill="#7fb48a" ${l(1.4)}/><rect x="${wx-4}" y="${wy+19}" width="21" height="5" rx="2" fill="#c98a5a" ${l(1.2)}/><circle cx="${wx+1}" cy="${wy+19}" r="2.4" fill="#f47f9a"/><circle cx="${wx+7}" cy="${wy+18}" r="2.4" fill="#ffd36a"/><circle cx="${wx+13}" cy="${wy+19}" r="2.4" fill="#f47f9a"/>`}return g};
  st+=fac(60,130,118,"#f7c99a")+fac(190,96,132,"#f6b7a8")+fac(286,140,112,"#fbe0a0")+fac(426,120,126,"#f7c99a");
  st+=`<path d="M190 136 Q238 152 286 132" fill="none" stroke="${INK}" stroke-width="1.4"/>`+[["#f9b8c6",206],["#fff",224],["#bfe1f0",244],["#ffe08a",264]].map(([c,x])=>`<rect x="${x-6}" y="${f(140+Math.sin((x-190)/96*Math.PI)*8)}" width="12" height="13" rx="2" fill="${c}" ${l(1.4)}/>`).join("");
  // le trottoir, un citronnier en pot et un scooter garé
  st+=`<rect x="0" y="184" width="600" height="16" fill="#e8d6bc" ${l(2)}/>`;
  st+=`<path d="M152 186 L155 172 H169 L172 186Z" fill="#d9774e" ${l(1.8)}/><circle cx="162" cy="160" r="13" fill="#8cc47a" ${l(1.8)}/>${[[-6,-4],[5,-6],[1,4],[-7,5]].map(([a,b])=>`<ellipse cx="${162+a}" cy="${160+b}" rx="2.8" ry="2.2" fill="#ffe36a" stroke="${INK}" stroke-width="1"/>`).join("")}`;
  st+=`<g transform="translate(372 186)"><circle cx="-14" cy="-2" r="6" fill="#6a5560" ${l(1.8)}/><circle cx="14" cy="-2" r="6" fill="#6a5560" ${l(1.8)}/><path d="M-20 -5 Q-20 -18 -4 -18 H6 L12 -30 M6 -18 Q20 -16 20 -5Z" fill="#9fd8c4" ${l(1.8)}/><path d="M8 -30 H18" ${l(1.8)}/><rect x="-14" y="-24" width="14" height="5" rx="2.5" fill="#a8664a" ${l(1.4)}/></g>`;
  // des hirondelles qui passent, des nuages
  an+=`<g><animateTransform attributeName="transform" type="translate" values="-80 0;520 -16" dur="20s" repeatCount="indefinite"/>${[[150,70],[166,62],[180,72]].map(([x,y])=>`<path d="M${x-6} ${y} q3 -4 6 0 q3 -4 6 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`).join("")}</g>`;
  const cloud=(x,y,k,dur)=>`<g><animateTransform attributeName="transform" type="translate" values="0 0;18 0;0 0" dur="${dur}s" repeatCount="indefinite"/>${[[x-14*k,y,11*k],[x+2*k,y-7*k,15*k],[x+18*k,y,10*k]].map(([cx,cy,r])=>`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#fff"/>`).join("")}</g>`;
  an+=cloud(250,60,1,22)+cloud(380,42,.7,27);
  return {defs,st,an};
}

/* ---------- la carte du quartier : 20 journées, de l'arche d'entrée au Caffè Kitsune, la tour au milieu ---------- */
const ITW=400;
let ITL=null;
function itLayout(){
  const P=[];for(let d=1;d<=IT_LAST;d++)P[d]={d,x:Math.round(200+112*Math.sin((d-1)*.82)),u:230+(d-1)*96};
  const top=P[IT_LAST].u,H=top+380,way=[{x:200,u:60},...P.slice(1),{x:200,u:top+160}];
  const tu=(P[11].u+P[12].u)/2,tower={x:pathX(way,tu)<200?306:94,u:tu-40};
  return {P,way,H,tower,guest:{x:P[IT_LAST].x>200?P[IT_LAST].x-122:P[IT_LAST].x+122,u:P[IT_LAST].u+14},lor:{x:pathX(way,150)<200?300:100,u:120},cafe:{x:200,u:top+190}};
}
/* les dessins de la carte : chacun posé une seule fois, à la main (Joffray, 03/11/2026 : « les mêmes éléments à chaque fois »,
   et pas de coupes entre les parties : le sol passe de la rue pavée au pré puis aux collines en dégradé) */
const IT_COL=["#f7c99a","#f6b7a8","#fbe0a0","#f3d2b0","#eab3a0","#fde8c0","#f9d3b8"],IT_SH=["#7fb48a","#6fa8c8","#7fb48a","#c98a5a","#6fa8c8"];
// une maison de la rue (vue de face) : volets, jardinières, parfois un balcon, une enseigne ou un store
function itH(x,y,w,h,col,o={}){const sh=o.sh||"#7fb48a",roof=o.roof||"#d9774e";
  let g=shadow(x+w/2,y+h,w*.55)+`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${col}" ${BO}/><path d="M${x-5} ${y+3} H${x+w+5} L${x+w-4} ${y-12} H${x+4}Z" fill="${roof}" ${BO}/><path d="M${x+8} ${y-6} H${x+w-8}" stroke="#b85a3a" stroke-width="1.6" stroke-dasharray="5 4"/>`;
  const n=Math.max(1,Math.floor((w-8)/26)),gap=(w-n*12)/(n+1),rows=Math.max(1,Math.floor((h-(o.shop?34:14))/30));
  for(let j=0;j<rows;j++)for(let i=0;i<n;i++){const wx=x+gap+i*(12+gap),wy=y+10+j*30;
    g+=`<rect x="${wx}" y="${wy}" width="12" height="16" rx="5" fill="#bfe1f0" ${K}/><rect x="${wx-5}" y="${wy}" width="5" height="16" rx="1.5" fill="${sh}" ${K}/><rect x="${wx+12}" y="${wy}" width="5" height="16" rx="1.5" fill="${sh}" ${K}/>`;
    if((i+j+(o.v||0))%2===0)g+=`<rect x="${wx-3}" y="${wy+16}" width="18" height="5" rx="2" fill="#c98a5a" ${K}/><circle cx="${wx+1}" cy="${wy+16}" r="2.4" fill="#f47f9a"/><circle cx="${wx+7}" cy="${wy+15}" r="2.4" fill="#ffd36a"/><circle cx="${wx+12}" cy="${wy+16}" r="2.4" fill="#f47f9a"/>`}
  if(o.balcony){const by=y+28;g+=`<rect x="${x+w/2-16}" y="${by}" width="32" height="10" fill="none" stroke="${INK}" stroke-width="1.6"/>${[0,1,2,3,4].map(i=>`<path d="M${x+w/2-12+i*6} ${by} v10" stroke="${INK}" stroke-width="1.2"/>`).join("")}`}
  if(o.shop){const sy=y+h-30,c2=o.shop[1];
    g+=`<rect x="${x+4}" y="${sy+8}" width="${w-8}" height="22" fill="#fff8ec" ${K}/><rect x="${x+w/2-7}" y="${sy+12}" width="14" height="18" rx="4" fill="#a8664a" ${K}/>`;
    g+=`<path d="M${x+2} ${sy} H${x+w-2} L${x+w+3} ${sy+9} H${x-3}Z" fill="#fff" ${K}/>`+Array.from({length:Math.floor(w/10)},(_,i)=>`<path d="M${x+3+i*10} ${sy} h5 l1.5 9 h-5Z" fill="${c2}"/>`).join("");
    g+=`<rect x="${x+w/2-22}" y="${sy-14}" width="44" height="12" rx="5" fill="#fffaf2" ${K}/><text x="${x+w/2}" y="${sy-5}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="7.5" fill="${INK}">${o.shop[0]}</text>`}
  else if(h>50)g+=`<path d="M${x+w/2-8} ${y+h} V${y+h-18} Q${x+w/2} ${y+h-27} ${x+w/2+8} ${y+h-18} V${y+h}Z" fill="#a8664a" ${K}/>`;
  return g}
const itTerrace=(x,y)=>shadow(x,y,34)+[[-22,0],[22,0]].map(([a])=>`<path d="M${x+a-6} ${y} v-12 h12 v12 M${x+a-6} ${y-12} v-10" fill="none" stroke="${INK}" stroke-width="2"/>`).join("")+
  `<path d="M${x} ${y} V${y-48}" stroke="${INK}" stroke-width="2.4"/><ellipse cx="${x}" cy="${y-16}" rx="16" ry="5" fill="#fff" ${K}/><path d="M${x-4} ${y-11} V${y}" stroke="${INK}" stroke-width="2"/><path d="M${x-6} ${y-21} h5 v4 h-5Z M${x+3} ${y-21} h5 v4 h-5Z" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`+
  `<path d="M${x-34} ${y-42} Q${x} ${y-66} ${x+34} ${y-42}Z" fill="#fff" ${BO}/>`+[-34,-17,0,17].map((a,i)=>i%2?"":`<path d="M${x+a} ${y-42} Q${x+a+6} ${y-56+Math.abs(a)/6} ${x} ${y-62} Q${x+a+12} ${y-55+Math.abs(a+17)/6} ${x+a+17} ${y-42}Z" fill="#f47f7f"/>`).join("")+`<path d="M${x-34} ${y-42} Q${x} ${y-66} ${x+34} ${y-42}Z" fill="none" ${BO}/><path d="M${x-34} ${y-42} q4.25 5 8.5 0 q4.25 5 8.5 0 q4.25 5 8.5 0 q4.25 5 8.5 0 q4.25 5 8.5 0 q4.25 5 8.5 0 q4.25 5 8.5 0 q4.25 5 8.5 0" fill="#fff" ${K}/>`;
const itStall=(x,y)=>shadow(x,y,40)+`<path d="M${x-34} ${y} V${y-50} M${x+34} ${y} V${y-50}" stroke="#a8664a" stroke-width="4" stroke-linecap="round"/><path d="M${x-34} ${y} V${y-50} M${x+34} ${y} V${y-50}" stroke="${INK}" stroke-width="1" opacity=".5"/>`+
  `<rect x="${x-36}" y="${y-24}" width="72" height="18" rx="3" fill="#e2b07a" ${BO}/>`+[[-22,"#ffe36a"],[0,"#f47f6a"],[22,"#9fd17a"]].map(([a,c])=>`<rect x="${x+a-10}" y="${y-30}" width="20" height="9" rx="2" fill="#c98a5a" ${K}/>`+[-6,0,6,-3,3].map((b,i)=>`<circle cx="${x+a+b}" cy="${y-31-(i>2?5:0)}" r="3.6" fill="${c}" stroke="${INK}" stroke-width="1.2"/>`).join("")).join("")+
  `<path d="M${x-42} ${y-48} H${x+42} L${x+38} ${y-64} H${x-38}Z" fill="#fff" ${BO}/>`+Array.from({length:8},(_,i)=>`<path d="M${x-41+i*10.5} ${y-48} l1.5 -16 h5 l-1.5 16Z" fill="#7fb48a"/>`).join("")+`<path d="M${x-42} ${y-48} H${x+42} L${x+38} ${y-64} H${x-38}Z" fill="none" ${BO}/><path d="M${x-42} ${y-48} q5.25 6 10.5 0 q5.25 6 10.5 0 q5.25 6 10.5 0 q5.25 6 10.5 0 q5.25 6 10.5 0 q5.25 6 10.5 0 q5.25 6 10.5 0 q5.25 6 10.5 0" fill="#fff" ${K}/>`+
  `<rect x="${x-16}" y="${y-14}" width="32" height="10" rx="3" fill="#fffaf2" ${K}/><text x="${x}" y="${y-6.5}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="6.5" fill="${INK}">Frutta</text>`;
const itScooter=(x,y,c="#9fd8c4")=>shadow(x,y,20)+`<g transform="translate(${x} ${y})"><circle cx="-14" cy="-6" r="6" fill="#6a5560" ${K}/><circle cx="14" cy="-6" r="6" fill="#6a5560" ${K}/><circle cx="-14" cy="-6" r="2" fill="#ddd"/><circle cx="14" cy="-6" r="2" fill="#ddd"/><path d="M-20 -9 Q-20 -22 -4 -22 H6 L12 -34 M6 -22 Q20 -20 20 -9Z" fill="${c}" ${K}/><path d="M8 -34 H18" ${K}/><rect x="-14" y="-28" width="14" height="5" rx="2.5" fill="#a8664a" ${K}/><circle cx="19" cy="-22" r="2.4" fill="#fff6c8" stroke="${INK}" stroke-width="1"/></g>`;
const itLemonPot=(x,y)=>shadow(x,y,14)+`<path d="M${x-9} ${y-14} L${x-7} ${y} H${x+7} L${x+9} ${y-14}Z" fill="#d9774e" ${BO}/><path d="M${x} ${y-14} V${y-22}" stroke="#8a6a44" stroke-width="3"/><circle cx="${x}" cy="${y-30}" r="13" fill="#8cc47a" ${BO}/>${[[-6,-33],[5,-35],[1,-25],[-7,-24],[7,-27]].map(([a,b])=>`<ellipse cx="${x+a}" cy="${y+b}" rx="2.8" ry="2.2" fill="#ffe36a" stroke="${INK}" stroke-width="1"/>`).join("")}`;
const itLamp=(x,y)=>shadow(x,y,8)+`<path d="M${x} ${y} V${y-44} q0 -8 8 -8" fill="none" ${BO}/><path d="M${x+2} ${y-52} h12 l-2 10 h-8Z" fill="#ffe9a8" ${BO}/>`;
const itBench=(x,y)=>shadow(x,y,24)+`<path d="M${x-20} ${y} v-10 M${x+20} ${y} v-10" stroke="${INK}" stroke-width="2.4"/><rect x="${x-24}" y="${y-13}" width="48" height="5" rx="2" fill="#c98a5a" ${K}/><rect x="${x-24}" y="${y-24}" width="48" height="6" rx="2" fill="#c98a5a" ${K}/>`;
const itFountain=(x,y)=>`<ellipse cx="${x}" cy="${y-6}" rx="62" ry="20" fill="#efe0c8" stroke="#dcc6a6" stroke-width="2"/>`+[0,1,2,3,4,5,6,7].map(i=>`<path d="M${x+Math.cos(i*Math.PI/4)*46} ${y-6+Math.sin(i*Math.PI/4)*15} l${Math.cos(i*Math.PI/4)*14} ${Math.sin(i*Math.PI/4)*4.6}" stroke="#dcc6a6" stroke-width="1.6"/>`).join("")+
  `<ellipse cx="${x}" cy="${y-8}" rx="36" ry="12" fill="#e8e1d8" ${BO}/><ellipse cx="${x}" cy="${y-10}" rx="29" ry="8" fill="#9fd3e8" ${BO}/><rect x="${x-4}" y="${y-36}" width="8" height="26" fill="#e8e1d8" ${BO}/><ellipse cx="${x}" cy="${y-36}" rx="13" ry="4" fill="#e8e1d8" ${BO}/>`+
  `<g><animate attributeName="opacity" values="1;.6;1" dur="1.6s" repeatCount="indefinite"/><path d="M${x} ${y-40} q-12 -10 -20 22 M${x} ${y-40} q12 -10 20 22 M${x} ${y-40} v-10" fill="none" stroke="#7fc4e0" stroke-width="2.6" stroke-linecap="round"/></g>`+
  [[-48,4],[44,0],[52,10]].map(([a,b],i)=>`<g transform="translate(${x+a} ${y+b})${i===1?" scale(-1 1)":""}"><ellipse cx="0" cy="-5" rx="6" ry="4.6" fill="#cfc6d6" stroke="${INK}" stroke-width="1.4"/><circle cx="5" cy="-9" r="3" fill="#cfc6d6" stroke="${INK}" stroke-width="1.4"/><path d="M8 -9 l2.4 .8 l-2.4 .8" fill="#f2a14a"/></g>`).join("");
const itGelato=(x,y)=>shadow(x,y,26)+`<circle cx="${x-14}" cy="${y-6}" r="6" fill="#6a5560" ${K}/><circle cx="${x+14}" cy="${y-6}" r="6" fill="#6a5560" ${K}/><rect x="${x-24}" y="${y-34}" width="48" height="26" rx="5" fill="#bfe8dc" ${BO}/><rect x="${x-20}" y="${y-28}" width="40" height="8" rx="3" fill="#fff" ${K}/><text x="${x}" y="${y-22}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="6.2" fill="${INK}">Gelato</text>`+
  `<path d="M${x+20} ${y-34} V${y-70}" stroke="${INK}" stroke-width="2"/><path d="M${x-6} ${y-62} Q${x+20} ${y-84} ${x+46} ${y-62}Z" fill="#ffd0dc" ${BO}/><path d="M${x+20} ${y-80} L${x+10} ${y-62} M${x+20} ${y-80} L${x+30} ${y-62}" stroke="#fff" stroke-width="3"/>`+[[-12,"#f9b8c6"],[-1,"#c9e8a8"],[10,"#fff3c4"]].map(([a,c])=>`<path d="M${x+a-4} ${y-36} l4 9 l4 -9Z" fill="#e2b07a" stroke="${INK}" stroke-width="1.2"/><circle cx="${x+a}" cy="${y-38}" r="4.6" fill="${c}" stroke="${INK}" stroke-width="1.3"/>`).join("");
const itGondola=(x,y)=>`<path d="M${x-40} ${y-4} Q${x} ${y+8} ${x+40} ${y-4} q6 -6 2 -14 q-4 6 -8 8 Q${x} ${y} ${x-34} ${y-10} q-4 -2 -6 6Z" fill="#5b4250" ${BO}/><path d="M${x-30} ${y-5} Q${x} ${y+2} ${x+30} ${y-5}" stroke="#f2c94c" stroke-width="1.6" fill="none"/><path d="M${x+18} ${y-6} L${x+30} ${y-40}" stroke="#a8664a" stroke-width="2.6" stroke-linecap="round"/><rect x="${x-12}" y="${y-12}" width="18" height="6" rx="3" fill="#d9774e" ${K}/>`;
const itDuomo=(x,y)=>shadow(x,y,64)+`<rect x="${x-56}" y="${y-40}" width="112" height="40" rx="3" fill="#fbf4e6" ${BO}/>`+[0,1,2].map(i=>`<path d="M${x-56} ${y-30+i*10} H${x+56}" stroke="#d7cbb8" stroke-width="2"/>`).join("")+[-44,-30,-16,16,30,44].map(a=>`<path d="M${x+a-4} ${y-4} v-14 a4 4 0 0 1 8 0 v14" fill="#e3d6c2" stroke="${INK}" stroke-width="1.4"/>`).join("")+
  `<path d="M${x+8} ${y-40} Q${x+30} ${y-84} ${x+52} ${y-40}Z" fill="#e8b48a" ${BO}/><path d="M${x+30} ${y-76} V${y-90}" stroke="${INK}" stroke-width="2"/><circle cx="${x+30}" cy="${y-92}" r="3" fill="#f2c94c" stroke="${INK}" stroke-width="1.2"/>`+
  `<path d="M${x-58} ${y-40} L${x-28} ${y-66} L${x+2} ${y-40}Z" fill="#fbf4e6" ${BO}/><circle cx="${x-28}" cy="${y-50}" r="6" fill="#bfe1f0" ${K}/><rect x="${x-36}" y="${y-22}" width="16" height="22" rx="7" fill="#a8664a" ${BO}/>`;
const itBaptistery=(x,y)=>shadow(x,y,40)+`<rect x="${x-34}" y="${y-36}" width="68" height="36" rx="4" fill="#fbf4e6" ${BO}/>`+[-24,-12,0,12,24].map(a=>`<path d="M${x+a-3.5} ${y-6} v-12 a3.5 3.5 0 0 1 7 0 v12" fill="#e3d6c2" stroke="${INK}" stroke-width="1.3"/>`).join("")+`<path d="M${x-38} ${y-36} Q${x} ${y-80} ${x+38} ${y-36}Z" fill="#efe3cf" ${BO}/><path d="M${x-20} ${y-52} Q${x} ${y-74} ${x+10} ${y-66}" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/><rect x="${x-5}" y="${y-66}" width="10" height="9" rx="2" fill="#fbf4e6" ${K}/>`;
const itPine=(x,y,k=1)=>shadow(x,y,30*k)+`<path d="M${x-3*k} ${y} Q${x-6*k} ${y-30*k} ${x+4*k} ${y-50*k} M${x+1*k} ${y-34*k} q${10*k} -6 ${18*k} -16" fill="none" stroke="#9a6a4a" stroke-width="${5*k}" stroke-linecap="round"/>`+blob([[x-22*k,y-56*k,14*k],[x,y-62*k,18*k],[x+22*k,y-58*k,15*k],[x+36*k,y-54*k,10*k]],"#6fa86e")+`<path d="M${x-28*k} ${y-64*k} q${12*k} -10 ${26*k} -6" stroke="#9fd08a" stroke-width="${3*k}" fill="none" stroke-linecap="round"/>`;
const itCypress=(x,y,k=1)=>shadow(x,y,10*k)+`<path d="M${x} ${y-62*k} Q${x+12*k} ${y-30*k} ${x+8*k} ${y} H${x-8*k} Q${x-12*k} ${y-30*k} ${x} ${y-62*k}Z" fill="#5f9a6a" ${BO}/><path d="M${x-2*k} ${y-50*k} q${-4*k} ${16*k} ${-2*k} ${34*k}" stroke="#8fc48a" stroke-width="${2.4*k}" fill="none" stroke-linecap="round"/>`;
const itOlive=(x,y,k=1)=>shadow(x,y,26*k)+`<path d="M${x-4*k} ${y} Q${x+6*k} ${y-14*k} ${x-2*k} ${y-26*k} M${x} ${y-18*k} q${8*k} -4 ${12*k} -14" fill="none" stroke="#8a6a54" stroke-width="${6*k}" stroke-linecap="round"/>`+blob([[x-18*k,y-32*k,13*k],[x+2*k,y-40*k,16*k],[x+20*k,y-32*k,12*k]],"#a9bb8a")+[[-16,-34],[-4,-44],[8,-36],[20,-30],[0,-30]].map(([a,b])=>`<ellipse cx="${x+a*k}" cy="${y+b*k}" rx="${2.2*k}" ry="${2.8*k}" fill="#5b6a3a"/>`).join("")+`<circle cx="${x-8*k}" cy="${y-48*k}" r="${4*k}" fill="#fff" opacity=".35"/>`;
const itCasale=(x,y)=>shadow(x,y,58)+`<rect x="${x-50}" y="${y-44}" width="70" height="44" rx="3" fill="#ead6b4" ${BO}/><rect x="${x+20}" y="${y-76}" width="30" height="76" rx="3" fill="#e2c9a2" ${BO}/><path d="M${x+16} ${y-74} L${x+35} ${y-90} L${x+54} ${y-74}Z" fill="#d9774e" ${BO}/><path d="M${x-56} ${y-42} L${x-15} ${y-64} L${x+24} ${y-42}Z" fill="#d9774e" ${BO}/>`+
  [[-38,-34],[-6,-34],[29,-64]].map(([a,b])=>`<rect x="${x+a}" y="${y+b}" width="11" height="13" rx="4" fill="#bfe1f0" ${K}/><rect x="${x+a-4}" y="${y+b}" width="4" height="13" fill="#7fb48a" ${K}/><rect x="${x+a+11}" y="${y+b}" width="4" height="13" fill="#7fb48a" ${K}/>`).join("")+
  `<path d="M${x-24} ${y} V${y-18} Q${x-16} ${y-28} ${x-8} ${y-18} V${y}Z" fill="#a8664a" ${K}/><rect x="${x+29}" y="${y-30}" width="12" height="30" rx="5" fill="#a8664a" ${K}/>`+[[-46,-10],[-30,-2],[4,-16],[12,-6]].map(([a,b])=>`<rect x="${x+a}" y="${y+b}" width="8" height="4" rx="1.5" fill="none" stroke="#c9a880" stroke-width="1.2"/>`).join("")+
  `<path d="M${x-58} ${y} q4 -10 10 -4 q4 -8 10 0" fill="#9fd17a" ${K}/><circle cx="${x-52}" cy="${y-6}" r="2.4" fill="#f47f9a"/>`;
const itVines=(x,y)=>[0,1,2,3].map(i=>{const yy=y-i*18,xx=x-i*6;return `<path d="M${xx-46} ${yy} H${xx+46}" stroke="#8a6a44" stroke-width="2"/>`+[-40,-20,0,20,40].map(a=>`<path d="M${xx+a} ${yy} v-14" stroke="#8a6a44" stroke-width="2"/><circle cx="${xx+a-5}" cy="${yy-12}" r="6" fill="#8fca7a" stroke="${INK}" stroke-width="1.4"/><circle cx="${xx+a+5}" cy="${yy-10}" r="5.4" fill="#9fd17a" stroke="${INK}" stroke-width="1.4"/><path d="M${xx+a+1} ${yy-7} l2 5 l2 -5" fill="#9a6ac0" stroke="#7a4aa0" stroke-width="2.6" stroke-linejoin="round"/>`).join("")}).reverse().join("");
const itSunflowers=(x,y)=>shadow(x,y,40)+[[-30,30],[-18,40],[-6,34],[6,44],[18,36],[30,42],[-24,22],[12,26]].map(([a,h])=>`<path d="M${x+a} ${y} V${y-h}" stroke="#6aa676" stroke-width="2.6"/><path d="M${x+a} ${y-h*.5} q6 -5 10 -2 q-5 4 -10 2" fill="#8fca7a" stroke="${INK}" stroke-width="1.2"/>`+Array.from({length:10},(_,i)=>`<ellipse cx="${x+a+Math.cos(i*.628)*7}" cy="${y-h+Math.sin(i*.628)*7}" rx="4" ry="2.4" transform="rotate(${i*36} ${x+a+Math.cos(i*.628)*7} ${y-h+Math.sin(i*.628)*7})" fill="#ffd34a" stroke="${INK}" stroke-width="1"/>`).join("")+`<circle cx="${x+a}" cy="${y-h}" r="5" fill="#8a5a34" stroke="${INK}" stroke-width="1.2"/>`).join("");
const itBales=(x,y)=>[[-26,-6],[18,0],[-2,10]].map(([a,b])=>shadow(x+a,y+b,18)+`<rect x="${x+a-18}" y="${y+b-26}" width="36" height="26" rx="5" fill="#f2d48a" ${BO}/><ellipse cx="${x+a+12}" cy="${y+b-13}" rx="6" ry="12" fill="#e9c470" ${K}/><path d="M${x+a+12} ${y+b-21} a5 8 0 1 0 1 0" fill="none" stroke="#c9a458" stroke-width="1.2"/><path d="M${x+a-14} ${y+b-18} h16 M${x+a-14} ${y+b-9} h18" stroke="#c9a458" stroke-width="1.4"/>`).join("");
const itWell=(x,y)=>shadow(x,y,24)+`<path d="M${x-16} ${y-8} V${y-50} M${x+16} ${y-8} V${y-50}" stroke="#a8664a" stroke-width="4" stroke-linecap="round"/><path d="M${x-26} ${y-48} L${x} ${y-66} L${x+26} ${y-48}Z" fill="#d9774e" ${BO}/><path d="M${x-16} ${y-42} H${x+16}" stroke="${INK}" stroke-width="2"/><path d="M${x} ${y-42} V${y-30}" stroke="${INK}" stroke-width="1.4"/><rect x="${x-5}" y="${y-30}" width="10" height="8" rx="2" fill="#c98a5a" ${K}/>`+
  `<ellipse cx="${x}" cy="${y-20}" rx="22" ry="6" fill="#d7cbb8" ${BO}/><path d="M${x-22} ${y-20} V${y-4} Q${x} ${y+4} ${x+22} ${y-4} V${y-20}" fill="#e8dcc8" ${BO}/><ellipse cx="${x}" cy="${y-20}" rx="15" ry="3.6" fill="#6a8fa8"/>`+[[-14,-12],[0,-8],[12,-13],[-6,-2]].map(([a,b])=>`<rect x="${x+a}" y="${y+b}" width="9" height="5" rx="2" fill="none" stroke="#bfae94" stroke-width="1.2"/>`).join("");
const itLavRow=(x,y)=>[-36,-12,12,36].map((a,i)=>lavender(x+a,y-i%2*6,.9)).join("");
const itFlowerBed=(x,y,c)=>shadow(x,y,30)+`<ellipse cx="${x}" cy="${y-4}" rx="30" ry="9" fill="#a8d88a" ${K}/>`+[[-18,-6],[-8,-9],[2,-5],[12,-9],[20,-5],[-12,-2],[8,-1]].map(([a,b],i)=>`<circle cx="${x+a}" cy="${y+b}" r="3.6" fill="${i%2?"#fff":c}" stroke="${INK}" stroke-width="1.1"/><circle cx="${x+a}" cy="${y+b}" r="1.2" fill="#f7c84a"/>`).join("");
// au fond, les collines de Toscane et un petit village perché, sous un ciel du soir
function itSkySVG(H,top){
  return `<rect x="0" y="0" width="400" height="${top+60}" fill="url(#it-sky)"/><circle cx="318" cy="${top-120}" r="70" fill="url(#it-sun)"/><circle cx="318" cy="${top-120}" r="20" fill="#fff4c8" ${BO}/>`+
    `<path d="M0 ${top-30} Q60 ${top-78} 140 ${top-54} Q210 ${top-92} 290 ${top-60} Q350 ${top-82} 400 ${top-58} V${top+40} H0Z" fill="#cfd8b8"/>`+
    // le village sur la colline de gauche : maisons, clocher
    [[40,24,"#f3d2b0"],[62,30,"#f7c99a"],[86,22,"#fbe0a0"],[108,28,"#f6b7a8"]].map(([cx,h,c])=>`<rect x="${cx-10}" y="${top-60-h+(cx>90?8:0)}" width="20" height="${h}" fill="${c}" stroke="${INK}" stroke-width="1.8"/><path d="M${cx-12} ${top-60-h+(cx>90?8:0)} L${cx} ${top-70-h+(cx>90?8:0)} L${cx+12} ${top-60-h+(cx>90?8:0)}Z" fill="#d9774e" stroke="${INK}" stroke-width="1.8"/>`).join("")+
    `<rect x="70" y="${top-128}" width="12" height="46" fill="#ead6b4" stroke="${INK}" stroke-width="1.8"/><path d="M68 ${top-128} L76 ${top-140} L84 ${top-128}Z" fill="#d9774e" stroke="${INK}" stroke-width="1.8"/><rect x="73" y="${top-122}" width="6" height="8" rx="3" fill="#6a5560"/>`+
    [[180,-70],[196,-74],[250,-66],[262,-70],[350,-70]].map(([cx,dy])=>`<path d="M${cx} ${top+dy-26} Q${cx+5} ${top+dy-12} ${cx+4} ${top+dy} H${cx-4} Q${cx-5} ${top+dy-12} ${cx} ${top+dy-26}Z" fill="#7aa87e" stroke="${INK}" stroke-width="1.6"/>`).join("")+
    `<path d="M0 ${top+4} Q90 ${top-36} 200 ${top-14} Q300 ${top-40} 400 ${top-8} V${top+60} H0Z" fill="#e6dca0"/>`+
    [0,1,2,3,4,5,6].map(i=>`<path d="M${-20+i*64} ${top+30} Q${10+i*64} ${top-6-(i%2)*8} ${44+i*64} ${top+30}" fill="none" stroke="#d2c37e" stroke-width="2.2"/>`).join("")+
    `<g><animateTransform attributeName="transform" type="translate" values="-60 0;460 -10" dur="26s" repeatCount="indefinite"/>${[[0,top-170],[14,top-178],[26,top-168]].map(([x,y])=>`<path d="M${x-6} ${y} q3 -4 6 0 q3 -4 6 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`).join("")}</g>`;
}
// la tour qui penche (Joffray : « J'aimerais bien voir la tour de Pise ! ») : six étages d'arcades et le clocher, penchée de 5°
function pisaSVG(x,y,k=1){
  let s=shadow(x+8*k,y,46*k)+`<g transform="rotate(5 ${x} ${y})">`;
  const lw=46*k,lh=24*k;
  s+=`<rect x="${x-lw/2-3*k}" y="${y-lh}" width="${lw+6*k}" height="${lh}" rx="${3*k}" fill="#fbf4e6" ${BO}/>`+[0,1,2,3].map(j=>`<path d="M${x-lw/2+4*k+j*11*k} ${y-3*k} v${-12*k} a${4*k} ${4*k} 0 0 1 ${8*k} 0 v${12*k}" fill="#e3d6c2" stroke="${INK}" stroke-width="1.6"/>`).join("");
  for(let i=1;i<=6;i++){const yy=y-lh-i*22*k;s+=`<rect x="${x-lw/2}" y="${yy}" width="${lw}" height="${22*k}" fill="#fbf4e6" ${BO}/><rect x="${x-lw/2-3*k}" y="${yy+19*k}" width="${lw+6*k}" height="${4*k}" rx="${2*k}" fill="#efe3cf" stroke="${INK}" stroke-width="2"/>`+[0,1,2,3,4].map(j=>`<path d="M${x-lw/2+3*k+j*8.6*k} ${yy+18*k} v${-10*k} a${3*k} ${3*k} 0 0 1 ${6*k} 0 v${10*k}" fill="#e3d6c2" stroke="${INK}" stroke-width="1.4"/>`).join("")}
  const by=y-lh-6*22*k;s+=`<rect x="${x-15*k}" y="${by-22*k}" width="${30*k}" height="${22*k}" fill="#fbf4e6" ${BO}/>`+[0,1,2].map(j=>`<path d="M${x-12*k+j*8.5*k} ${by-3*k} v${-11*k} a${3*k} ${3*k} 0 0 1 ${6*k} 0 v${11*k}" fill="#e3d6c2" stroke="${INK}" stroke-width="1.4"/>`).join("")+`<path d="M${x-17*k} ${by-22*k} H${x+17*k} L${x+12*k} ${by-28*k} H${x-12*k}Z" fill="#efe3cf" ${BO}/><path d="M${x-12*k} ${by-30*k} l${4*k} ${-3*k}" stroke="#fff" stroke-width="2" opacity=".7"/>`;
  return s+`<path d="M${x-lw/2+5*k} ${y-lh-20*k} V${y-lh-6*22*k+6*k}" stroke="#fff" stroke-width="${3*k}" stroke-linecap="round" opacity=".55"/></g>`;
}
function itCafeSVG(x,y){
  let s=shadow(x,y+4,100)+`<rect x="${x-90}" y="${y-92}" width="180" height="92" rx="6" fill="#fbe0a0" ${BO}/><path d="M${x-100} ${y-90} L${x} ${y-130} L${x+100} ${y-90}Z" fill="#d9774e" ${BO}/><rect x="${x-18}" y="${y-48}" width="36" height="48" rx="6" fill="#a8664a" ${BO}/><circle cx="${x+11}" cy="${y-22}" r="2.4" fill="#ffd36a"/>`;
  s+=`<path d="M${x-88} ${y-62} H${x+88} L${x+96} ${y-42} H${x-96}Z" fill="#fff" ${BO}/>`+Array.from({length:8},(_,i)=>`<path d="M${x-87+i*22} ${y-62} h11 l3 20 h-11Z" fill="#7fb48a"/>`).join("")+`<path d="M${x-96} ${y-42} ${Array.from({length:8},()=>"q12 9 24 0").join(" ")}" fill="#fff" ${K}/><path d="M${x-88} ${y-62} H${x+88} L${x+96} ${y-42} H${x-96}Z" fill="none" ${BO}/>`;
  s+=`<rect x="${x-62}" y="${y-86}" width="124" height="20" rx="8" fill="#fff" ${BO}/><text x="${x}" y="${y-71}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="12" fill="${INK}">Caffè Kitsune</text>`;
  s+=[x-70,x+70].map(t=>`<path d="M${t} ${y+18} V${y-4}" ${K}/><path d="M${t-16} ${y} Q${t} ${y-14} ${t+16} ${y}Z" fill="#f47f9a" ${K}/><ellipse cx="${t}" cy="${y+18}" rx="13" ry="4" fill="#fff" ${K}/>`).join("");
  return s;
}
function itArchSVG(x,y){return `<path d="M${x-62} ${y+24} V${y-6} Q${x} ${y-56} ${x+62} ${y-6} V${y+24}" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M${x-62} ${y+24} V${y-6} Q${x} ${y-56} ${x+62} ${y-6} V${y+24}" fill="none" stroke="#f7c99a" stroke-width="11" stroke-linecap="round"/><rect x="${x-56}" y="${y-48}" width="112" height="24" rx="9" fill="#fffaf2" ${BO}/><text x="${x}" y="${y-31}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="12" fill="${INK}">Petite Italie</text>`}
function itMapSVG(L){
  const {P,way,H,tower,cafe}=L,Y=u=>H-u,o=u=>((H-u)/H).toFixed(4),hz=Y(cafe.u)+34;
  // le sol, d'un seul tenant : pavés de la rue, la place, le pré de la tour, puis les champs dorés des collines
  let defs=`<linearGradient id="it-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9c9a8"/><stop offset=".55" stop-color="#fbe3c0"/><stop offset="1" stop-color="#fdf0d6"/></linearGradient>
    <radialGradient id="it-sun"><stop offset="0" stop-color="#fff2b8" stop-opacity=".9"/><stop offset="1" stop-color="#fff2b8" stop-opacity="0"/></radialGradient>
    <linearGradient id="it-gnd" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}"><stop offset="${o(2200)}" stop-color="#efe1a2"/><stop offset="${o(1820)}" stop-color="#e8e3a6"/><stop offset="${o(1520)}" stop-color="#d6e9b4"/><stop offset="${o(1060)}" stop-color="#cde6b2"/><stop offset="${o(940)}" stop-color="#e9e2c4"/><stop offset="${o(860)}" stop-color="#f5e4c9"/></linearGradient>
    <pattern id="it-pave" width="44" height="30" patternUnits="userSpaceOnUse"><g fill="none" stroke="#e6cca6" stroke-width="2"><rect x="2" y="2" width="18" height="11" rx="5"/><rect x="24" y="2" width="18" height="11" rx="5"/><rect x="-9" y="17" width="18" height="11" rx="5"/><rect x="13" y="17" width="18" height="11" rx="5"/><rect x="35" y="17" width="18" height="11" rx="5"/></g></pattern>
    <pattern id="it-herbe" width="90" height="80" patternUnits="userSpaceOnUse"><path d="M10 16 l3 -6 l3 6 M58 58 l3 -6 l3 6 l3 -6 l3 6" fill="none" stroke="#b6d898" stroke-width="2.2" stroke-linecap="round"/><circle cx="76" cy="20" r="2.2" fill="#fff"/><circle cx="30" cy="66" r="2" fill="#f7c84a"/></pattern>
    <pattern id="it-champ" width="120" height="36" patternUnits="userSpaceOnUse"><path d="M0 30 Q30 22 60 30 T120 30" fill="none" stroke="#d9cd8a" stroke-width="2"/><circle cx="90" cy="12" r="1.8" fill="#e4a6b8"/></pattern>
    <linearGradient id="it-mpave" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}"><stop offset="${o(990)}" stop-color="#000"/><stop offset="${o(900)}" stop-color="#fff"/></linearGradient>
    <linearGradient id="it-mherbe" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}"><stop offset="${o(1640)}" stop-color="#000"/><stop offset="${o(1520)}" stop-color="#fff"/><stop offset="${o(1000)}" stop-color="#fff"/><stop offset="${o(920)}" stop-color="#000"/></linearGradient>
    <linearGradient id="it-mchamp" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}"><stop offset="${o(1600)}" stop-color="#fff"/><stop offset="${o(1500)}" stop-color="#000"/></linearGradient>
    ${["pave","herbe","champ"].map(k=>`<mask id="it-m${k}x"><rect width="400" height="${H}" fill="url(#it-m${k})"/></mask>`).join("")}`;
  let s=`<rect width="400" height="${H}" fill="url(#it-gnd)"/>`+["pave","herbe","champ"].map(k=>`<rect width="400" height="${H}" fill="url(#it-${k})" mask="url(#it-m${k}x)"/>`).join("");
  s+=itSkySVG(H,hz);
  // le canal en travers de la rue, entre les jours 4 et 5, sa gondole
  const cu=(P[4].u+P[5].u)/2,cy=Y(cu),bx=pathX(way,cu);
  s+=`<path d="M0 ${cy-14} Q100 ${cy-22} 200 ${cy-12} T400 ${cy-16} V${cy+16} Q300 ${cy+24} 200 ${cy+12} T0 ${cy+16}Z" fill="#9fd3e8" ${BO}/><path d="M30 ${cy} q10 -4 20 0 M150 ${cy+4} q10 -4 20 0 M330 ${cy-2} q10 -4 20 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  s+=`<g><animateTransform attributeName="transform" type="translate" values="0 0;${bx<200?30:-30} 0;0 0" dur="14s" repeatCount="indefinite"/>${itGondola(bx<200?280:124,cy+6)}</g>`;
  // le chemin pavé et la part déjà faite
  const pts=way.map(p=>[p.x,Y(p.u)]),d=smooth(pts);
  s+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fdf1df" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ead2bb" stroke-width="4" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  const k=way.findIndex(p=>p.d===itCur());if(k>0)s+=`<path d="${smooth(pts.slice(0,k+1))}" fill="none" stroke="#f59a8b" stroke-width="7" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  s+=`<path d="M${bx-30} ${cy-2} Q${bx} ${cy-26} ${bx+30} ${cy-2} V${cy+14} H${bx-30}Z" fill="#f2d9b8" ${BO}/><path d="M${bx-34} ${cy-6} Q${bx} ${cy-32} ${bx+34} ${cy-6}" fill="none" ${BO}/>`;
  // ce qui est posé, chaque chose une fois, de bas en haut : la rue, la place, le pré de la tour, la campagne, les collines
  const it=[];const at=(x,u,f)=>it.push({x,u,f});
  // les maisons de la rue, au bord de la carte des deux côtés (enseignes : boulangerie, fleuriste, pizzeria, épicerie)
  const shops={1:["Forno","#f2c94c"],4:["Pizza","#f47f6a"],12:["Fiori","#f47f9a"],15:["Pasta","#7fb48a"]};
  let n=0;for(let u=150;u<=900;u+=72)for(const side of [0,1]){if(Math.abs(u-cu)<52)continue;
    const i=n++,w=56+(i*7)%12,h=66+(i*13)%28,x=side?352-(i%3)*3:-10+(i%3)*3;
    at(x+w/2,u,(cx,y)=>itH(x,y-h,w,h,IT_COL[i%IT_COL.length],{sh:IT_SH[i%IT_SH.length],shop:shops[i],balcony:i%4===2,v:i}))}
  at(264,150,itLemonPot);at(306,262,(x,y)=>itScooter(x,y,"#f9b8c6"));at(112,300,itTerrace);at(150,432,itStall);at(116,514,(x,y)=>itScooter(x,y,"#9fd8c4"));
  at(282,672,itFountain);at(292,792,itGelato);at(262,880,itBench);at(306,890,itLamp);
  // le pré des miracles : la cathédrale, la tour qui penche, le baptistère, des pins parasols
  at(112,944,(x,y)=>itFlowerBed(x,y,"#f47f9a"));at(338,1000,itPine);at(100,1030,itDuomo);at(150,1112,(x,y)=>itFlowerBed(x,y,"#ffd36a"));
  at(tower.x,tower.u,(x,y)=>pisaSVG(x,y,1.05));at(352,1262,(x,y)=>itPine(x,y,.85));at(330,1400,itBaptistery);
  // la campagne : la ferme, les oliviers, la vigne, les tournesols, la paille
  at(290,1522,itCasale);at(310,1662,itOlive);at(364,1722,(x,y)=>itOlive(x,y,.85));at(104,1722,itVines);
  at(110,1852,itSunflowers);at(100,1952,itBales);
  // les collines : cyprès, le puits, la lavande, et le Caffè Kitsune tout en haut
  at(30,2006,itCypress);at(164,2012,(x,y)=>itCypress(x,y,.9));at(300,2062,itWell);at(300,2142,itLavRow);
  at(52,2170,(x,y)=>itCypress(x,y,.85));at(76,2160,(x,y)=>itCypress(x,y,.75));at(356,2180,(x,y)=>itCypress(x,y,.8));
  it.sort((a,b)=>b.u-a.u).forEach(e=>s+=e.f(+e.x.toFixed(1),+Y(e.u).toFixed(1)));
  s+=itArchSVG(200,Y(60))+itCafeSVG(cafe.x,Y(cafe.u));
  // le panneau vers Paris, à droite du Caffè, une fois le quartier fini (paris.js)
  if(typeof paOpen==="function"&&paOpen()){const px=cafe.x+128,py=Y(cafe.u+20);s+=`<rect x="${px-4}" y="${py-6}" width="8" height="40" fill="#c8946a" ${BO}/><path d="M${px-44} ${py-30} H${px+34} L${px+46} ${py-18} L${px+34} ${py-6} H${px-44}Z" fill="#fffaf2" ${BO}/><text x="${px}" y="${py-13}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="13" fill="${INK}">Paris</text>`}
  return `<svg viewBox="0 0 ${ITW} ${H}" aria-hidden="true"><defs>${defs}</defs>${s}</svg>`;
}
const WLAY={};
function renderMapIt(){
  const Q=WD(),V=Q.sv(),L=WLAY[WORLD]||(WLAY[WORLD]=Q.layout()),{P,H}=L,pc=(x,u)=>`left:${x/ITW*100}%;top:${(H-u)/H*100}%`,cur=itCur(),N=itLast();
  let h=Q.mapSVG(L);
  for(let d=1;d<=N;d++){
    const p=P[d],st=V.stars[d]||0,op=d<=V.day,rk=Object.keys(IT_DAY).find(k=>IT_DAY[k]===d);
    const cls=!op?"lock":d===cur&&!st?"cur":st===3?"gold":"done";
    const badge=rk&&!V.own[rk]?`<span class="nb">${icon(rk,WORLD)}</span>`:Q.duel&&Q.duel[d]&&op&&!(V.duel||{})[d]?`<span class="nb">${icon("croissant",WORLD)}</span>`:op&&st<3&&st?`<span class="nb">${icon("chest")}</span>`:"";
    h+=`<button class="node ${cls}" style="${pc(p.x,p.u)}" data-itday="${d}" type="button" aria-label="Jour ${d}, ${st} étoile${st>1?"s":""}${op?"":", verrouillé"}"><b>${d}</b>${badge}<span class="nst">${[0,1,2].map(i=>`<i${i<st?' class="on"':""}>★</i>`).join("")}</span></button>`;
  }
  const ok=V.guest,dl=FOX[Q.guest];
  h+=`<button class="mguest${ok?" ok":""}" style="${pc(L.guest.x,L.guest.u)}" data-itguest type="button" aria-label="Invitée d'honneur">${foxSVG(dl,{pose:ok?"happy":"sit",sil:!ok})}<em>${ok?dl.name:`${itStarSum()}/${N*3} ★`}</em></button>`;
  h+=Q.mapExtra(L,pc);
  h+=`<div class="mfox" style="${pc(P[cur].x,P[cur].u)}">${foxSVG({...FOX.roussette,acc:styleOf("acc").id||undefined},{pose:"happy"})}</div>`;
  const w=$("mwrap");w.style.aspectRatio=`${ITW}/${H}`;w.innerHTML=h;
  $("mchap").textContent=`${Q.name} · ${itStarSum()} / ${N*3} ★`;$("mstars").textContent=`★ ${itStarSum()}`;
}
function openMapIt(){
  const Q=WD();MUSIC.want(Q.mapMusic);
  closeSheet();$("map").hidden=false;document.body.style.overflow="hidden";document.querySelector(".mtt b").textContent=Q.cafe;
  if(!G||!G.run){if(SEA!==WORLD){SEA=WORLD;renderDecor();dirty=true}}
  renderMapIt();renderHud();
  const n=document.querySelector(".node.cur")||document.querySelector(`.node[data-itday="${itCur()}"]`),sc=$("mscroll");
  sc.scrollTop=n.offsetTop-sc.clientHeight*.55;
  Q.arrive();
}
// changer de monde : depuis le panneau en haut d'une carte, ou l'arche en bas d'un quartier
function goWorld(w){
  if(w&&!WORLDS[w].isOpen()){toast(WORLDS[w].lockMsg);return}
  WORLD=w;S.world=w;fillQuests();save();SEA=seaNow();renderDecor();dirty=true;openMap();
}

/* ---------- Lorenzo accueille Roussette ---------- */
// un dialogue : lignes [qui, expression, texte] ; qui = id d'un renard, ou "page" (une page du carnet de Nonno, lue par Lorenzo)
const pageSVG=`<svg viewBox="0 0 120 120"><g transform="rotate(-6 60 60)"><path d="M22 14 H92 L98 20 V106 H22Z" fill="#fbf3dc" ${K}/><path d="M92 14 V20 H98" fill="#efe1bc" ${K}/>${[34,46,58,70,82].map((y,i)=>`<path d="M32 ${y} q${10+i} -3 ${22+i*3} 0 t${22-i*2} 0" fill="none" stroke="#8a6a54" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>`).join("")}<circle cx="80" cy="94" r="7" fill="#f2c94c" opacity=".55"/><path d="M28 98 q6 -8 14 0" fill="none" stroke="#c9a14a" stroke-width="2" stroke-linecap="round"/></g></svg>`;
// une scène de dialogue (04/11/2026, Joffray : « un écran blanc sur la moitié de l'écran ») : le café ou la carte restent visibles derrière
// un voile, le renard qui parle apparaît en grand (son portrait, avec son expression), son texte dans une bulle avec son nom.
// Le premier à parler est à gauche, les autres à droite ; on touche n'importe où pour continuer.
function itTalk(lines,done){
  closeSheet();let i=0;const vn=document.createElement("div");vn.className="vn";document.body.appendChild(vn);
  const first=lines[0][0];
  const show=()=>{const [who,expr,txt]=lines[i],end=i===lines.length-1,pg=who==="page",f=FOX[pg?"lorenzo":who],right=!pg&&who!==first;
    vn.innerHTML=`<div class="vn-who${right?" r":""}" aria-hidden="true">${pg?pageSVG:foxArt(f,{expr,portrait:1})}</div>
    <div class="vn-box"><b class="vn-name${right?" r":""}">${pg?"Le carnet de Nonno":f.name}</b><p>${pg?`<i>« ${txt} »</i>`:txt}</p><small>${end?"Touche pour fermer":"Touche pour continuer"} <span>▼</span></small></div>`;
    vn.querySelector(".vn-who").classList.add("in")};
  vn.onclick=()=>{if(++i<lines.length)show();else{vn.remove();if(done)done()}};
  show();
}
function lorenzoIntro(){
  itTalk([["lorenzo","joy",`Ciao ! Moi, c'est Lorenzo. Bienvenue en Petite Italie, ${ME()} !`],
    ["lorenzo","open","Ce café, c'était celui de mon Nonno, mon grand-père. Il l'a fermé il y a longtemps, et il est parti vivre dans les collines."],
    ["lorenzo","sad","Il a laissé son carnet de recettes… mais un coup de vent a fait s'envoler les pages dans tout le quartier."],
    ["lorenzo","joy","Je les cherche ! Chaque page retrouvée, c'est une recette de plus pour le Caffè."],
    ["lorenzo","open","Pour commencer : l'espresso, tout petit, très fort. Avec de la mousse de lait, ça devient un cappuccino : touche « Mousse », au bout du plateau."],
    ["lorenzo","surprise","Et pour manger, le cornetto, notre croissant. Les gens du quartier sont pressés, hein. Mais ils laissent de beaux pourboires."],
    ["lorenzo","joy","Ah, et au milieu du quartier, il y a une tour qui penche. Elle ne tombe jamais, promis ! Allez, le Caffè Kitsune t'attend."]],
    ()=>{if(!S.it.intro){S.it.intro=1;save();dailyBonus()}});
}

/* ---------- l'histoire : le carnet de Nonno (choix de Joffray parmi deux histoires, 03/11/2026) ----------
   Une page se retrouve à la première réussite de certaines journées (celles des nouvelles recettes, et quelques autres) ;
   elle se lit en revenant sur la carte (S.it.read). Au jour 20, Nonno descend des collines goûter le tiramisù (S.it.nonno),
   puis vient au Caffè comme client. Toucher Lorenzo sur la carte ouvre le carnet. */
const IT_PAGES={
  1:{q:"L'espresso, c'est vingt-cinq secondes. Pas vingt-quatre, pas vingt-six. Et on sourit en le servant.",lines:[
    ["lorenzo","surprise","Regarde ce que j'ai trouvé sous le comptoir ! La première page du carnet de Nonno !"],["page","",""],
    ["lorenzo","shy","Il a toujours été un peu maniaque, Nonno. Mais ses clients revenaient tous les jours."]]},
  2:{q:"Granita : les citrons de la petite D., du sucre et de la patience. On gratte toutes les demi-heures.",lines:[
    ["lorenzo","joy","Une page coincée dans le citronnier de la place ! La granita citron arrive au Caffè !"],["page","",""],
    ["lorenzo","surprise","La petite D.… Qui ça peut bien être ?"]]},
  4:{q:"Cannoli : la ricotta la plus fraîche du quartier. La demander à la boulangère, avant l'aube.",lines:[
    ["pistache","joy","Lorenzo ! Elle était coincée sous la selle de mon scooter. Je l'ai pas lue, promis !"],["page","",""],
    ["lorenzo","surprise","La boulangère d'avant l'aube… c'est Ricotta ! Elle connaissait Nonno ?"],
    ["ricotta","shy","Bien sûr. Il venait chercher sa ricotta tous les matins. Il me manque, à moi aussi."]]},
  6:{q:"Cioccolata : si épaisse que la cuillère tient debout. Pour les jours de pluie et les cœurs gros.",lines:[
    ["tito","joy","Je l'ai pêchée dans la fontaine ! Elle est un peu mouillée…"],["page","",""],
    ["lorenzo","shy","Nonno m'en faisait toujours quand j'étais triste. Merci, Tito."]]},
  9:{q:"Gelato : trois boules, pistacchio, fragola, limone. Mais c'est le client qui choisit l'ordre : l'ordre, c'est la moitié du goût.",lines:[
    ["lorenzo","joy","Celle-là était collée sous le pont du canal ! Le gelato arrive au Caffè !"],["page","",""],
    ["lorenzo","open","Nonno se souvenait de l'ordre de chaque habitué. Moi, je vais devoir bien écouter."]]},
  11:{q:"La panna se fouette à la main, et jamais trop. Comme les compliments.",lines:[
    ["lorenzo","surprise","Le vent l'avait poussée jusqu'en haut de la tour qui penche ! J'ai monté les 294 marches !"],["page","",""],
    ["lorenzo","open","Il n'en reste plus qu'une. La plus importante, je crois…"]]},
  13:{q:"Tiramisù : ça veut dire « remonte-moi le moral ». Celui-là, je le garde pour Lorenzo, le jour où il en aura besoin.",lines:[
    ["lorenzo","surprise","La dernière page ! Elle était dans le grenier du Caffè, depuis le début…"],["page","",""],
    ["lorenzo","sad","Pour… moi ? Il a écrit mon nom."],
    ["lorenzo","joy",`Le carnet est complet, ${ME()} ! Je vais écrire à Nonno. Il faut qu'il goûte le tiramisù du Caffè.`]]},
  17:{q:"Lorenzo, je descendrai des collines quand le Caffè sera aussi bon que de mon temps. Pas avant. Je t'embrasse. Nonno.",lines:[
    ["lorenzo","joy","Une lettre ! Nonno m'a répondu !"],["page","",""],
    ["lorenzo","open",`Aussi bon que de son temps… Alors on donne tout jusqu'au bout du quartier, ${ME()} !`]]}
};
const IT_NONNO=[
  ["lorenzo","surprise","Nonno ?! Tu es descendu des collines !"],
  ["nonno","joy","Ciao, piccolo. On m'a dit que le Caffè Kitsune avait rouvert. Je voulais voir ça de mes yeux."],
  ["nonno","open","Ce tiramisù… c'est le mien. Non. Il est meilleur."],
  ["lorenzo","joy",`C'est grâce à ${ME()} ! On a retrouvé toutes les pages de ton carnet !`],
  ["nonno","shy","Tu veux savoir un secret ? La petite D., c'est une renarde aux citrons à qui j'ai appris la granita. Aujourd'hui, on l'appelle Donna Limone."],
  ["nonno","open","Elle ne va que dans les cafés parfaits. Si le Caffè devient parfait, elle viendra. Moi, en attendant, je reviendrai prendre mon espresso tous les jours."]
];
const itPageLines=d=>IT_PAGES[d].lines.map(l=>l[0]==="page"?["page","",IT_PAGES[d].q]:l);
const itPending=()=>Object.keys(IT_PAGES).map(Number).find(d=>S.it.stars[d]&&!(S.it.read||{})[d]);
const itNonnoDue=()=>!S.it.nonno&&!!S.it.stars[IT_LAST];
// en revenant sur la carte : la page retrouvée, puis Nonno au jour 20 ; sinon le bonus du jour
function itScenes(done){
  const d=itPending();
  if(d){itTalk(itPageLines(d),()=>{S.it.read=S.it.read||{};S.it.read[d]=1;save();itScenes(done)});return}
  if(itNonnoDue()){itTalk(IT_NONNO,()=>{S.it.nonno=1;save();toast("Nonno viendra maintenant au Caffè.");done()});return}
  done();
}
// sur la carte : une scène restée en attente (partie d'avant ce changement), puis le bonus du jour
function itStory(){itScenes(()=>{renderMapIt();dailyBonus()})}
function itCarnet(){
  const rd=S.it.read||{},rows=Object.keys(IT_PAGES).map(Number).map(d=>rd[d]
    ?`<div data-itpage="${d}" style="cursor:pointer">${itRow(pageSVG,`Page du jour ${d}`,`<i>« ${IT_PAGES[d].q} »</i>`,"background:#fbf3dc")}</div>`
    :`<div style="opacity:.55">${itRow(pageSVG,"Page à retrouver",`Réussis le jour ${d} du quartier.`)}</div>`).join("");
  openSheet(`<h2>Le carnet de Nonno</h2><div style="width:120px;margin:0 auto">${foxSVG(FOX.lorenzo,{pose:"happy"})}</div>
  <p class="sub" style="text-align:center">Les pages du carnet de recettes du grand-père de Lorenzo, envolées dans tout le quartier. Touche une page pour la relire.</p>${rows}
  <div class="col" style="margin-top:10px">${S.it.nonno?`<button class="btn wide" data-act="nonno" type="button">Revoir la visite de Nonno</button>`:""}<button class="btn ghost wide" data-act="lorenzointro" type="button">Revoir l'accueil de Lorenzo</button></div>`);
  $("sheet-in").querySelectorAll("[data-itpage]").forEach(b=>b.onclick=()=>itTalk(itPageLines(+b.dataset.itpage),itCarnet));
}
function nonnoSheet(){itTalk(IT_NONNO,itCarnet)}

/* ---------- les feuilles ---------- */
function itDaySheet(d){
  const Q=WD(),V=Q.sv(),N=itLast();
  if(d>V.day){toast("Réussis la journée précédente pour ouvrir celle-ci.");return}
  const c=itCfg(d),g=c.goal,st=V.stars[d]||0,rk=Object.keys(IT_DAY).find(k=>IT_DAY[k]===d&&k!=="lait"),rw=[];
  if(rk&&!V.own[rk])rw.push(itRow(icon(rk,WORLD),`${OPTS[rk]?"Option":"Recette"} à gagner : ${OPTS[rk]?Q.optWord:VAR[WORLD][rk][0]}`,`Réussis cette journée pour l'ajouter à la carte du ${Q.short}.`,"background:#e3f2d6"));
  if(Q.duel&&Q.duel[d])rw.push(Q.duelRow(d,g));
  if(st)rw.push(itRow(icon("coeur"),"Journée déjà réussie","La rejouer ne rapporte que la moitié des pièces. Les nouvelles étoiles restent payées par le coffre."));
  rw.push(st<3?itRow(icon("chest"),"Coffre ★★★","Chaque nouvelle étoile rapporte des pièces, et 3 étoiles ouvrent le gros coffre."):itRow(icon("chest"),"Coffre ouvert","Tu peux rejouer pour battre ton record, mais sans coffre."));
  if(d===N){const f=FOX[Q.guest],ok=V.guest;rw.push(itRow(foxSVG(f,{sil:!ok}),ok?`Invitée d'honneur : ${f.name}`:"Invitée d'honneur mystère",ok?Q.guestBio:`Obtiens ★★★ sur les ${N} journées du quartier pour l'inviter (${itStarSum()} / ${N*3} ★).`,"background:#fbf0cc"))}
  const menu=Object.keys(REC).filter(k=>onMenu(k,d)).map(k=>VAR[WORLD][k][0]);
  openSheet(`<h2>Jour ${d} · ${Q.name}</h2><div class="stars" style="font-size:30px">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div>
  <p class="sub">${c.c} clients attendus, jusqu'à ${c.max} articles par commande. Patience : ${Math.round(c.pat*patMult())} s.${V.best[d]?` Record : <b>${V.best[d]} pièces</b>.`:""}</p>
  <p class="sub" style="margin-bottom:6px">À la carte : ${menu.join(", ")}.</p>
  <p class="sub" style="margin-bottom:6px">Objectif de recette (en pièces)</p><div class="goals"><span><em>★</em>${g}</span><span><em>★★</em>${Math.ceil(g*cuts(d)[1])}</span><span><em>★★★</em>${Math.ceil(g*cuts(d)[2])}</span></div>
  ${equipBonus(d)?`<p class="sub" style="margin:6px 0 0;font-size:12.5px">Objectif relevé de <b>${Math.round(equipBonus(d)*100)} %</b> : ton équipement dépasse celui prévu pour ce jour.</p>`:""}
  ${rw.join("")}
  ${boostHTML(()=>itDaySheet(d))}
  <div class="col" style="margin-top:10px"><button class="btn big wide" data-itplay="${d}" type="button">Ouvrir le ${Q.short}</button></div>`);
}
function itGuestSheet(){const Q=WD(),f=FOX[Q.guest],ok=Q.sv().guest,N=itLast();
  openSheet(`<h2>${ok?f.name:"Invitée mystère"}</h2><div style="width:140px;margin:0 auto">${foxSVG(f,{pose:ok?"happy":"sit",sil:!ok})}</div><p class="sub" style="text-align:center">${ok?`${f.bio} Invitée d'honneur : elle vient dans tous les cafés, paie le triple, mais elle est pressée.`:`La légende du quartier. Obtiens ★★★ sur les ${N} journées du quartier (${Q.name}) pour l'inviter. Pour l'instant : <b>${itStarSum()} / ${N*3} ★</b>.`}</p>`)}

/* ---------- fin d'une journée du quartier ---------- */
function endIt(){
  const Q=WD(),V=Q.sv(),N=itLast(),d=G.day,[,c2,c3]=cuts(d),g=G.cfg.goal,e=G.earned,st=e>=Math.ceil(g*c3)?3:e>=Math.ceil(g*c2)?2:e>=g?1:0,prev=V.stars[d]||0,base=Q.days[d-1].base;
  G.run=0;
  if(!G.lost&&st)qEvent("perfect");if(st===3)qEvent("stars3");
  if(st){const m=noelEvent("star");if(m)setTimeout(()=>toast(m),1200)}
  V.stars[d]=Math.max(prev,st);V.best[d]=Math.max(V.best[d]||0,e);
  const news=[];
  let chest=0;if(st>prev){chest=rnd(5,12)*(st-prev)+(st===3?15+2*base:0);S.coins+=chest}
  const bl=st>prev?st-prev+(st===3?2:0):0;if(bl)addBells(bl);
  if(st&&d===V.day)V.day++; // V.day passe à 21 quand le quartier est fini (itCur le borne à 20)
  const rk=Object.keys(IT_DAY).find(k=>IT_DAY[k]===d&&k!=="lait");
  if(st&&rk&&!V.own[rk]){V.own[rk]=1;news.push(itRow(icon(rk,WORLD),`Nouvelle ${OPTS[rk]?"option":"recette"} : ${OPTS[rk]?Q.optWord:VAR[WORLD][rk][0]}`,OPTS[rk]?Q.optNew:rk==="smoothie"?Q.gelNew:`Elle arrive sur la carte du ${Q.short} dès la prochaine journée.`,"background:#e3f2d6"))}
  Q.news(d,st,prev,news,e);
  if(itStarSum()>=N*3&&!V.guest){V.guest=1;const f=FOX[Q.guest];news.push(itRow(foxSVG(f,{pose:"happy"}),`${f.name} rejoint tes cafés !`,`Tout le quartier (${Q.name}) en ★★★ : sa légende vient désormais en invitée d'honneur, dans tous tes cafés.`,"background:#fbf0cc"))}
  const bRow=buddyRow(),qShow=S.quests.map(q=>({...q,gain:q.p-(G.q0[q.t]||0)}));
  S.quests=S.quests.filter(q=>!q.done);fillQuests();save();
  const nxt=st<3?(e<g?`Il manquait ${g-e} pièces pour réussir.`:`Plus que ${Math.ceil(g*(st===1?c2:c3))-e} pièces pour ${st===1?"★★":"★★★"} !`):"Journée parfaite !";
  const canNext=st&&d<N&&d+1<=V.day;
  // la scène gagnée se joue tout de suite, avant l'écran de résultats (Joffray, 04/11/2026 : plusieurs journées d'affilée
  // laissaient une pile de scènes sur la carte, sans qu'on comprenne d'où elles venaient)
  const sheet=`<h2>${st?"Journée réussie !":"Objectif manqué"}</h2><div class="stars">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div><p class="sub" style="text-align:center"><b>${Q.name} · jour ${d}</b><br>${nxt}${st<=prev&&prev?` Ton record sur ce jour : ${"★".repeat(prev)}.`:""}</p>
  <div class="stats"><div>Recette<b>${e} / ${g}</b></div><div>Clients servis<b>${G.served} / ${G.cfg.c}</b></div><div>Partis fâchés<b>${G.lost}</b></div><div>Meilleur combo<b>×${G.bestCombo}</b></div><div>Ingrédients<b>−${Math.round(G.cost)}</b></div><div>Pièces gagnées<b>+${G.gain}</b>${G.replay?`<small style="display:block;font-size:11px;font-weight:700;color:var(--ink-soft)">rejouée : 50 %</small>`:""}</div></div>
  ${chest?itRow(icon("chest"),`Coffre : +${chest} pièces`,st===3?"Trois étoiles : le coffre de la journée est ouvert !":"Chaque nouvelle étoile rapporte des pièces."):""}
  ${bl?itRow(bellSVG,`+${bl} clochette${bl>1?"s":""}`,"Les clochettes achètent les beaux objets de la boutique du jour, à la Clairière."):""}
  ${news.join("")}${bRow}
  ${G.newFox.length?`<p class="sub">Nouveaux clients : <b>${G.newFox.join(", ")}</b></p>`:""}
  ${questHTML(qShow)}
  <div class="col">${canNext?`<button class="btn big wide" data-itday="${d+1}" type="button">Jour ${d+1}</button>`:""}<button class="btn ${canNext?"ghost":"big"} wide" data-itplay="${d}" type="button">${st?"Rejouer":"Réessayer"} le jour ${d}</button><button class="btn ghost wide" data-act="map" type="button">Voir la carte</button></div>`;
  G=null;$("closed").hidden=false;$("hint").textContent="";renderDecor();dirty=true;
  Q.scenes(()=>openSheet(sheet,true));
}
