/* Kitsune Café : la Petite Italie, Monde 2 (03/11/2026, maquette validée par Joffray : tools/italie.html).
   20 journées (Joffray : « avec autant de produits, on peut faire 20 niveaux »), un nouveau café, le Caffè Kitsune, avec son propre
   équipement (S.it.own, prix ×1,3) ; les pièces, les quêtes, les bonus et le style restent communs. Les gestes ne changent pas :
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
  {id:"donnalimone",name:"Donna Limone",rar:"legend",acc:"citrons",c:{b:"#f7d46a",ch:"#fffbe8",e:"#c99a3a",s:"#b88a2a",t:"#fffbe8"},bio:"L'invitée d'honneur du quartier. Ses citronniers donnent la meilleure granita du monde."}
];
ITF.forEach(f=>{f.world="italie";FOX[f.id]=f});
const ITF_REG=ITF.filter(f=>f.rar!=="legend");

/* ---------- les journées ---------- */
// rythme d'un jour de référence du premier monde (le jour 1 du quartier se joue déjà comme le jour 15), graine et objectif par --italie
const IT_DAYS=[{base:15,seed:6,goal:143},{base:16,seed:13,goal:151},{base:17,seed:12,goal:168},{base:18,seed:8,goal:185},{base:19,seed:3,goal:209},{base:20,seed:3,goal:218},{base:21,seed:0,goal:219},{base:22,seed:11,goal:267},{base:23,seed:13,goal:277},{base:24,seed:15,goal:307},{base:25,seed:14,goal:311},{base:26,seed:12,goal:327},{base:27,seed:7,goal:353},{base:28,seed:3,goal:380},{base:30,seed:6,goal:395},{base:32,seed:4,goal:441},{base:34,seed:12,goal:435},{base:36,seed:14,goal:448},{base:38,seed:14,goal:455},{base:40,seed:1,goal:461}];
const IT_LAST=IT_DAYS.length;
// équipement prévu pour chaque journée du quartier (calibrage, et objectif relevé au-delà, comme KIT)
const IT_KIT=[["plantes",1,1],["comptoir1",1,2],["double",1,2],["guirlande",1,3],["fourpro",1,3],["barista",1,4],["plateau",1,4],["comptoir1",2,6],["disque",1,6],["coussins",1,7],["serveur",1,8],["machines",1,9],["plateau",2,10],["fauteuils",1,11],["four2",1,13],["lanternes",1,15]];
S.it=S.it||{day:1,stars:{},best:{},own:{},intro:0,guest:0};
if(new URLSearchParams(location.search).get("italie")==="1"){S.itOpen=1;save()} // pour tester sans avoir fini le jour 40
const itOpen=()=>S.day>LASTDAY||!!S.itOpen;
const itStarSum=()=>Object.values(S.it.stars).reduce((a,b)=>a+b,0);
const itCur=()=>Math.min(S.it.day,IT_LAST);
function itCfg(d){const N=IT_DAYS[d-1];return{...cfgOf(N.base),goal:Math.round(N.goal*(1+equipBonus(d)))}}
const seaNow=()=>WORLD==="italie"?"italie":chapOf(curDay()).sea;
WORLD=S.world==="italie"&&itOpen()?"italie":"";

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
  const top=P[IT_LAST].u,H=top+300,way=[{x:200,u:60},...P.slice(1),{x:200,u:top+160}];
  const bands=[{k:"rue",lo:0,hi:P[7].u+48},{k:"prato",lo:P[7].u+48,hi:P[14].u+48},{k:"colline",lo:P[14].u+48,hi:H}];
  const tu=(P[11].u+P[12].u)/2,tower={x:pathX(way,tu)<200?306:94,u:tu-40};
  return {P,way,bands,H,tower,guest:{x:P[IT_LAST].x>200?P[IT_LAST].x-122:P[IT_LAST].x+122,u:P[IT_LAST].u+14},lor:{x:pathX(way,150)<200?300:100,u:120},cafe:{x:200,u:top+190}};
}
const IT_LAND={rue:{bg:"#f7e6cd",mk:"#ebd2ae"},prato:{bg:"#dcedc4",mk:"#c4e0a8"},colline:{bg:"#f1e8bf",mk:"#e2d59a"}};
const itH=(x,y,w,h,col,roof="#d9774e",sh="#7fb48a")=>{let g=shadow(x+w/2,y+h,w*.55)+`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${col}" ${BO}/><path d="M${x-6} ${y+2} L${x+w/2} ${y-20} L${x+w+6} ${y+2}Z" fill="${roof}" ${BO}/>`;
  for(let i=0;i<Math.floor(w/30-.5);i++){const wx=x+10+i*30;g+=`<rect x="${wx}" y="${y+12}" width="12" height="16" rx="5" fill="#bfe1f0" ${K}/><rect x="${wx-6}" y="${y+12}" width="6" height="16" rx="1.5" fill="${sh}" ${K}/><rect x="${wx+12}" y="${y+12}" width="6" height="16" rx="1.5" fill="${sh}" ${K}/><rect x="${wx-3}" y="${y+28}" width="18" height="5" rx="2" fill="#c98a5a" ${K}/><circle cx="${wx+1}" cy="${y+28}" r="2.4" fill="#f47f9a"/><circle cx="${wx+7}" cy="${y+27}" r="2.4" fill="#ffd36a"/><circle cx="${wx+12}" cy="${y+28}" r="2.4" fill="#f47f9a"/>`}
  if(h>50)g+=`<path d="M${x+w/2-9} ${y+h} V${y+h-20} Q${x+w/2} ${y+h-30} ${x+w/2+9} ${y+h-20} V${y+h}Z" fill="#a8664a" ${K}/>`;return g};
const IT_DECO={
  rue:[(x,y,k)=>itH(x-34*k,y-62*k,68*k,62*k,"#f7c99a"),(x,y,k)=>itH(x-30*k,y-56*k,60*k,56*k,"#f6b7a8"),(x,y,k)=>itH(x-36*k,y-60*k,72*k,60*k,"#fbe0a0","#d9774e","#6fa8c8"),
    (x,y,k)=>shadow(x,y,14*k)+`<path d="M${x-9*k} ${y-14*k} L${x-7*k} ${y} H${x+7*k} L${x+9*k} ${y-14*k}Z" fill="#d9774e" ${BO}/><circle cx="${x}" cy="${y-26*k}" r="${13*k}" fill="#8cc47a" ${BO}/>${[[-6,-29],[5,-31],[1,-21],[-7,-20],[7,-23]].map(([a,b])=>`<ellipse cx="${x+a*k}" cy="${y+b*k}" rx="${2.8*k}" ry="${2.2*k}" fill="#ffe36a" stroke="${INK}" stroke-width="1"/>`).join("")}`,
    (x,y,k)=>shadow(x,y,18*k)+`<g transform="translate(${x} ${y}) scale(${k})"><circle cx="-14" cy="-6" r="6" fill="#6a5560" ${K}/><circle cx="14" cy="-6" r="6" fill="#6a5560" ${K}/><path d="M-20 -9 Q-20 -22 -4 -22 H6 L12 -34 M6 -22 Q20 -20 20 -9Z" fill="#9fd8c4" ${K}/><path d="M8 -34 H18" ${K}/><rect x="-14" y="-28" width="14" height="5" rx="2.5" fill="#a8664a" ${K}/></g>`,
    (x,y,k)=>shadow(x,y,8*k)+`<path d="M${x} ${y} V${y-40*k}" ${BO}/><path d="M${x-8*k} ${y-40*k} H${x+8*k} L${x+5*k} ${y-52*k} H${x-5*k}Z" fill="#ffe9a8" ${BO}/>`],
  prato:[(x,y,k)=>shadow(x,y,14*k)+`<path d="M${x} ${y-62*k} Q${x+12*k} ${y-30*k} ${x+8*k} ${y} H${x-8*k} Q${x-12*k} ${y-30*k} ${x} ${y-62*k}Z" fill="#5f9a6a" ${BO}/>`,
    (x,y,k)=>daisies(x,y,k,"#fff","#f7d77a"),(x,y,k)=>bush(x,y,k,"#8fca7a","#ffe36a"),(x,y,k)=>daisies(x,y,k,"#f6a5b4","#fff3a8"),
    (x,y,k)=>`<ellipse cx="${x}" cy="${y-8*k}" rx="${38*k}" ry="${13*k}" fill="#e8e1d8" ${BO}/><ellipse cx="${x}" cy="${y-10*k}" rx="${31*k}" ry="${8*k}" fill="#9fd3e8" ${BO}/><rect x="${x-4*k}" y="${y-38*k}" width="${8*k}" height="${26*k}" fill="#e8e1d8" ${BO}/><path d="M${x} ${y-42*k} q${-12*k} ${-8*k} ${-18*k} ${22*k} M${x} ${y-42*k} q${12*k} ${-8*k} ${18*k} ${22*k}" fill="none" stroke="#7fc4e0" stroke-width="2.6" stroke-linecap="round"/>`],
  colline:[(x,y,k)=>shadow(x,y,14*k)+`<path d="M${x} ${y-62*k} Q${x+12*k} ${y-30*k} ${x+8*k} ${y} H${x-8*k} Q${x-12*k} ${y-30*k} ${x} ${y-62*k}Z" fill="#5f9a6a" ${BO}/>`,
    (x,y,k)=>shadow(x,y,22*k)+[-14,0,14].map(a=>`<path d="M${x+a*k} ${y} V${y-24*k}" stroke="#8a6a44" stroke-width="${3*k}"/><circle cx="${x+a*k}" cy="${y-26*k}" r="${8*k}" fill="#8fca7a" ${K}/><circle cx="${x+a*k-2*k}" cy="${y-22*k}" r="${2.6*k}" fill="#9a6ac0"/><circle cx="${x+a*k+3*k}" cy="${y-24*k}" r="${2.6*k}" fill="#9a6ac0"/>`).join(""),
    (x,y,k)=>tree(x,y,k,["#a8c46a"],"#e0b84a"),(x,y,k)=>lavender(x,y,k),(x,y,k)=>shadow(x,y,18*k)+`<rect x="${x-18*k}" y="${y-20*k}" width="${36*k}" height="20" rx="4" fill="#f2d48a" ${BO}/><path d="M${x-18*k} ${y-10*k} H${x+18*k} M${x-6*k} ${y-20*k} V${y} M${x+6*k} ${y-20*k} V${y}" stroke="#c9a458" stroke-width="1.6"/>`]
};
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
  const {P,way,bands,H,tower,lor,cafe,guest}=L,Y=u=>H-u,R=rng(77);
  let defs="",s="";
  for(const b of [...bands].reverse()){const ld=IT_LAND[b.k],top=Y(b.hi),bot=Y(b.lo);
    defs+=b.k==="rue"?`<pattern id="it-${b.k}" width="44" height="30" patternUnits="userSpaceOnUse"><g fill="none" stroke="${ld.mk}" stroke-width="2"><rect x="2" y="2" width="18" height="11" rx="5"/><rect x="24" y="2" width="18" height="11" rx="5"/><rect x="-9" y="17" width="18" height="11" rx="5"/><rect x="13" y="17" width="18" height="11" rx="5"/><rect x="35" y="17" width="18" height="11" rx="5"/></g></pattern>`
      :`<pattern id="it-${b.k}" width="120" height="104" patternUnits="userSpaceOnUse"><path d="M10 16 l3 -6 l3 6 M78 70 l3 -6 l3 6 l3 -6 l3 6" fill="none" stroke="${ld.mk}" stroke-width="2.4" stroke-linecap="round"/><circle cx="100" cy="30" r="2.4" fill="${ld.mk}"/><circle cx="58" cy="94" r="1.8" fill="${ld.mk}"/></pattern>`;
    let edge=`M0 ${bot} L0 ${top}`;if(b.hi<H){for(let x=0;x<ITW;x+=50)edge+=` Q${x+25} ${top-14} ${x+50} ${top}`}else edge+=` L${ITW} ${top}`;edge+=` L${ITW} ${bot}Z`;
    s+=`<path d="${edge}" fill="${ld.bg}"/><path d="${edge}" fill="url(#it-${b.k})"/>`;
    if(b.hi<H){let w=`M0 ${top}`;for(let x=0;x<ITW;x+=50)w+=` Q${x+25} ${top-14} ${x+50} ${top}`;s+=`<path d="${w}" fill="none" stroke="${INK}" stroke-width="3" opacity=".35"/>`}}
  // le canal en travers de la rue, entre les jours 4 et 5
  const cu=(P[4].u+P[5].u)/2,cy=Y(cu);
  s+=`<path d="M0 ${cy-14} Q100 ${cy-22} 200 ${cy-12} T400 ${cy-16} V${cy+16} Q300 ${cy+24} 200 ${cy+12} T0 ${cy+16}Z" fill="#9fd3e8" ${BO}/><path d="M30 ${cy} q10 -4 20 0 M150 ${cy+4} q10 -4 20 0 M330 ${cy-2} q10 -4 20 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  // le chemin pavé et la part déjà faite
  const pts=way.map(p=>[p.x,Y(p.u)]),d=smooth(pts);
  s+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fdf1df" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ead2bb" stroke-width="4" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  const k=way.findIndex(p=>p.d===itCur());if(k>0)s+=`<path d="${smooth(pts.slice(0,k+1))}" fill="none" stroke="#f59a8b" stroke-width="7" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  // le pont sur le canal
  const bx=pathX(way,cu);s+=`<path d="M${bx-30} ${cy-2} Q${bx} ${cy-26} ${bx+30} ${cy-2} V${cy+14} H${bx-30}Z" fill="#f2d9b8" ${BO}/><path d="M${bx-34} ${cy-6} Q${bx} ${cy-32} ${bx+34} ${cy-6}" fill="none" ${BO}/>`;
  // déco posée au hasard (graine fixe), loin du chemin, de la tour, du café, de Lorenzo et de l'invitée
  const taken=[[tower.x,tower.u+80,96],[cafe.x,cafe.u-40,130],[lor.x,lor.u,56],[guest.x,guest.u,60],[200,60,90],[bx,cu,60]],deco=[];
  for(const b of bands){const fs=IT_DECO[b.k],n=Math.floor((b.hi-b.lo)/40),last=[];
    for(let j=0;j<n;j++)for(let t=0;t<14;t++){const u=b.lo+34+R()*(b.hi-b.lo-60),x=24+R()*(ITW-48);
      if(Math.abs(x-pathX(way,u))<76||taken.some(([a,c,r])=>Math.hypot(a-x,c-u)<r)||deco.some(o=>Math.hypot(o.x-x,o.u-u)<56)||Math.abs(u-cu)<34)continue;
      let fi;do fi=Math.floor(R()*fs.length);while(last.includes(fi));last.push(fi);if(last.length>2)last.shift();
      deco.push({x,u,f:fs[fi],k:.8+R()*.35});break}}
  deco.push({x:tower.x,u:tower.u,f:(x,y)=>pisaSVG(x,y,1.05)});
  deco.sort((a,b)=>b.u-a.u).forEach(o=>s+=o.f(+o.x.toFixed(1),+Y(o.u).toFixed(1),o.k));
  s+=itArchSVG(200,Y(60))+itCafeSVG(cafe.x,Y(cafe.u));
  return `<svg viewBox="0 0 ${ITW} ${H}" aria-hidden="true"><defs>${defs}</defs>${s}</svg>`;
}
function renderMapIt(){
  const L=ITL||(ITL=itLayout()),{P,H}=L,pc=(x,u)=>`left:${x/ITW*100}%;top:${(H-u)/H*100}%`,cur=itCur();
  let h=itMapSVG(L);
  for(let d=1;d<=IT_LAST;d++){
    const p=P[d],st=S.it.stars[d]||0,op=d<=S.it.day,rk=Object.keys(IT_DAY).find(k=>IT_DAY[k]===d);
    const cls=!op?"lock":d===cur&&!st?"cur":st===3?"gold":"done";
    const badge=rk&&!S.it.own[rk]?`<span class="nb">${icon(rk,"italie")}</span>`:op&&st<3&&st?`<span class="nb">${icon("chest")}</span>`:"";
    h+=`<button class="node ${cls}" style="${pc(p.x,p.u)}" data-itday="${d}" type="button" aria-label="Jour ${d}, ${st} étoile${st>1?"s":""}${op?"":", verrouillé"}"><b>${d}</b>${badge}<span class="nst">${[0,1,2].map(i=>`<i${i<st?' class="on"':""}>★</i>`).join("")}</span></button>`;
  }
  const ok=S.it.guest,dl=FOX.donnalimone;
  h+=`<button class="mguest${ok?" ok":""}" style="${pc(L.guest.x,L.guest.u)}" data-itguest type="button" aria-label="Invitée d'honneur">${foxSVG(dl,{pose:ok?"happy":"sit",sil:!ok})}<em>${ok?dl.name:`${itStarSum()}/60 ★`}</em></button>`;
  h+=`<button class="mguest ok" style="${pc(L.lor.x,L.lor.u)}" data-act="lorenzo" type="button" aria-label="Lorenzo">${foxSVG(FOX.lorenzo,{pose:"happy"})}<em>Lorenzo</em></button>`;
  h+=`<button class="mnext" style="${pc(200,52)}" data-act="monde1" type="button" aria-label="Retour au premier café"></button>`;
  h+=`<div class="mfox" style="${pc(P[cur].x,P[cur].u)}">${foxSVG({...FOX.roussette,acc:styleOf("acc").id||undefined},{pose:"happy"})}</div>`;
  const w=$("mwrap");w.style.aspectRatio=`${ITW}/${H}`;w.innerHTML=h;
  $("mchap").textContent=`Petite Italie · ${itStarSum()} / 60 ★`;$("mstars").textContent=`★ ${itStarSum()}`;
}
function openMapIt(){
  MUSIC.want("ukulele");
  closeSheet();$("map").hidden=false;document.body.style.overflow="hidden";document.querySelector(".mtt b").textContent="Caffè Kitsune";
  if(!G||!G.run){if(SEA!=="italie"){SEA="italie";renderDecor();dirty=true}}
  renderMapIt();renderHud();
  const n=document.querySelector(".node.cur")||document.querySelector(`.node[data-itday="${itCur()}"]`),sc=$("mscroll");
  sc.scrollTop=n.offsetTop-sc.clientHeight*.55;
  if(!S.it.intro)lorenzoIntro();else dailyBonus();
}
// changer de monde : depuis le panneau en haut de la carte du premier café, ou l'arche en bas de la Petite Italie
function goWorld(w){
  if(w==="italie"&&!itOpen()){toast("Réussis le jour 40 pour ouvrir la Petite Italie.");return}
  WORLD=w;S.world=w;fillQuests();save();SEA=seaNow();renderDecor();dirty=true;openMap();
}

/* ---------- Lorenzo accueille Roussette ---------- */
function lorenzoIntro(){
  const say=(expr,txt,end)=>`<div style="width:150px;margin:0 auto">${foxSVG(FOX.lorenzo,{pose:"happy"})}</div><div class="talk"><div class="pic">${foxArt(FOX.lorenzo,{expr,portrait:1})}</div><div class="txt"><b>Lorenzo</b><span>${txt}</span><small>${end?"Touche pour commencer":"Touche pour continuer"}</small></div></div>`;
  const steps=[["joy",`Ciao ! Moi, c'est Lorenzo. Bienvenue en Petite Italie, ${ME()} !`],
    ["open","Ici, le café, c'est l'espresso : tout petit, très fort. On le boit d'un trait, au comptoir."],
    ["joy","Avec de la mousse de lait par-dessus, ça devient un cappuccino. Touche « Mousse », au bout du plateau."],
    ["surprise","Et pour manger : le cornetto, notre croissant. Plus tard, la granita au citron, les cannoli, le gelato… et le tiramisù, le roi des desserts !"],
    ["shy","Les gens du quartier sont pressés, hein. Mais ils laissent de beaux pourboires."],
    ["joy","Ah, et au milieu du quartier, il y a une tour qui penche. Elle ne tombe jamais, promis ! Allez, le Caffè Kitsune t'attend."]];
  let i=0;const show=()=>{openSheet(say(steps[i][0],steps[i][1],i===steps.length-1),1);
    $("sheet-in").querySelector(".talk").onclick=()=>{if(++i<steps.length)show();else{closeSheet();if(!S.it.intro){S.it.intro=1;save();dailyBonus()}}}};
  show();
}

/* ---------- les feuilles ---------- */
function itDaySheet(d){
  if(d>S.it.day){toast("Réussis la journée précédente pour ouvrir celle-ci.");return}
  const c=itCfg(d),g=c.goal,st=S.it.stars[d]||0,rk=Object.keys(IT_DAY).find(k=>IT_DAY[k]===d&&k!=="lait"),rw=[];
  if(rk&&!S.it.own[rk])rw.push(itRow(icon(rk,"italie"),`${OPTS[rk]?"Option":"Recette"} à gagner : ${OPTS[rk]?{chantilly:"la panna"}[rk]:VAR.italie[rk][0]}`,"Réussis cette journée pour l'ajouter à la carte du Caffè.","background:#e3f2d6"));
  if(st)rw.push(itRow(icon("coeur"),"Journée déjà réussie","La rejouer ne rapporte que la moitié des pièces. Les nouvelles étoiles restent payées par le coffre."));
  rw.push(st<3?itRow(icon("chest"),"Coffre ★★★","Chaque nouvelle étoile rapporte des pièces, et 3 étoiles ouvrent le gros coffre."):itRow(icon("chest"),"Coffre ouvert","Tu peux rejouer pour battre ton record, mais sans coffre."));
  if(d===IT_LAST){const f=FOX.donnalimone,ok=S.it.guest;rw.push(itRow(foxSVG(f,{sil:!ok}),ok?`Invitée d'honneur : ${f.name}`:"Invitée d'honneur mystère",ok?"Elle vient dans tous les cafés : elle paie le triple, mais elle est pressée.":`Obtiens ★★★ sur les 20 journées du quartier pour l'inviter (${itStarSum()} / 60 ★).`,"background:#fbf0cc"))}
  const menu=Object.keys(REC).filter(k=>onMenu(k,d)).map(k=>VAR.italie[k][0]);
  openSheet(`<h2>Jour ${d} · Petite Italie</h2><div class="stars" style="font-size:30px">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div>
  <p class="sub">${c.c} clients attendus, jusqu'à ${c.max} articles par commande. Patience : ${Math.round(c.pat*patMult())} s.${S.it.best[d]?` Record : <b>${S.it.best[d]} pièces</b>.`:""}</p>
  <p class="sub" style="margin-bottom:6px">À la carte : ${menu.join(", ")}.</p>
  <p class="sub" style="margin-bottom:6px">Objectif de recette (en pièces)</p><div class="goals"><span><em>★</em>${g}</span><span><em>★★</em>${Math.ceil(g*1.35)}</span><span><em>★★★</em>${Math.ceil(g*1.7)}</span></div>
  ${equipBonus(d)?`<p class="sub" style="margin:6px 0 0;font-size:12.5px">Objectif relevé de <b>${Math.round(equipBonus(d)*100)} %</b> : ton équipement dépasse celui prévu pour ce jour.</p>`:""}
  ${rw.join("")}
  ${boostHTML(()=>itDaySheet(d))}
  <div class="col" style="margin-top:10px"><button class="btn big wide" data-itplay="${d}" type="button">Ouvrir le Caffè</button></div>`);
}
function itGuestSheet(){const f=FOX.donnalimone,ok=S.it.guest;
  openSheet(`<h2>${ok?f.name:"Invitée mystère"}</h2><div style="width:140px;margin:0 auto">${foxSVG(f,{pose:ok?"happy":"sit",sil:!ok})}</div><p class="sub" style="text-align:center">${ok?`${f.bio} Invitée d'honneur : elle vient dans tous les cafés, paie le triple, mais elle est pressée.`:`La légende du quartier. Obtiens ★★★ sur les 20 journées de la Petite Italie pour l'inviter. Pour l'instant : <b>${itStarSum()} / 60 ★</b>.`}</p>`)}

/* ---------- fin d'une journée du quartier ---------- */
function endIt(){
  const g=G.cfg.goal,e=G.earned,st=e>=g*1.7?3:e>=g*1.35?2:e>=g?1:0,d=G.day,prev=S.it.stars[d]||0,base=IT_DAYS[d-1].base;
  G.run=0;
  if(!G.lost&&st)qEvent("perfect");if(st===3)qEvent("stars3");
  if(st){const m=noelEvent("star");if(m)setTimeout(()=>toast(m),1200)}
  S.it.stars[d]=Math.max(prev,st);S.it.best[d]=Math.max(S.it.best[d]||0,e);
  const news=[];
  let chest=0;if(st>prev){chest=rnd(5,12)*(st-prev)+(st===3?15+2*base:0);S.coins+=chest}
  const bl=st>prev?st-prev+(st===3?2:0):0;if(bl)addBells(bl);
  if(st&&d===S.it.day)S.it.day++; // S.it.day passe à 21 quand le quartier est fini (itCur le borne à 20)
  const rk=Object.keys(IT_DAY).find(k=>IT_DAY[k]===d&&k!=="lait");
  if(st&&rk&&!S.it.own[rk]){S.it.own[rk]=1;news.push(itRow(icon(rk,"italie"),`Nouvelle ${OPTS[rk]?"option":"recette"} : ${OPTS[rk]?"la panna":VAR.italie[rk][0]}`,OPTS[rk]?"Touche « Panna », au bout du plateau, pour en mettre sur une cioccolata ou un tiramisù.":"Elle arrive sur la carte du Caffè dès la prochaine journée.","background:#e3f2d6"))}
  if(itStarSum()>=IT_LAST*3&&!S.it.guest){S.it.guest=1;news.push(itRow(foxSVG(FOX.donnalimone,{pose:"happy"}),"Donna Limone rejoint tes cafés !","Toute la Petite Italie en ★★★ : la légende du quartier vient désormais en invitée d'honneur, dans tous tes cafés.","background:#fbf0cc"))}
  const bRow=buddyRow(),qShow=S.quests.map(q=>({...q,gain:q.p-(G.q0[q.t]||0)}));
  S.quests=S.quests.filter(q=>!q.done);fillQuests();save();
  const nxt=st<3?(e<g?`Il manquait ${g-e} pièces pour réussir.`:`Plus que ${Math.ceil(g*(st===1?1.35:1.7))-e} pièces pour ${st===1?"★★":"★★★"} !`):"Journée parfaite !";
  const canNext=st&&d<IT_LAST&&d+1<=S.it.day;
  openSheet(`<h2>${st?"Journée réussie !":"Objectif manqué"}</h2><div class="stars">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div><p class="sub" style="text-align:center"><b>Petite Italie · jour ${d}</b><br>${nxt}${st<=prev&&prev?` Ton record sur ce jour : ${"★".repeat(prev)}.`:""}</p>
  <div class="stats"><div>Recette<b>${e} / ${g}</b></div><div>Clients servis<b>${G.served} / ${G.cfg.c}</b></div><div>Partis fâchés<b>${G.lost}</b></div><div>Meilleur combo<b>×${G.bestCombo}</b></div><div>Ingrédients<b>−${Math.round(G.cost)}</b></div><div>Pièces gagnées<b>+${G.gain}</b>${G.replay?`<small style="display:block;font-size:11px;font-weight:700;color:var(--ink-soft)">rejouée : 50 %</small>`:""}</div></div>
  ${chest?itRow(icon("chest"),`Coffre : +${chest} pièces`,st===3?"Trois étoiles : le coffre de la journée est ouvert !":"Chaque nouvelle étoile rapporte des pièces."):""}
  ${bl?itRow(bellSVG,`+${bl} clochette${bl>1?"s":""}`,"Les clochettes achètent les beaux objets de la boutique du jour, à la Clairière."):""}
  ${news.join("")}${bRow}
  ${G.newFox.length?`<p class="sub">Nouveaux clients : <b>${G.newFox.join(", ")}</b></p>`:""}
  ${questHTML(qShow)}
  <div class="col">${canNext?`<button class="btn big wide" data-itday="${d+1}" type="button">Jour ${d+1}</button>`:""}<button class="btn ${canNext?"ghost":"big"} wide" data-itplay="${d}" type="button">${st?"Rejouer":"Réessayer"} le jour ${d}</button><button class="btn ghost wide" data-act="map" type="button">Voir la carte</button></div>`,true);
  G=null;$("closed").hidden=false;$("hint").textContent="";renderDecor();dirty=true;
}
