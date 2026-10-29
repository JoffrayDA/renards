/* La Clairière : décor en plongée (maison de Roussette, porche, mare…), moments de la journée, pluie. */
const scn={lamps:{L:false,R:false},rain:false,phase:""};

/* ---------- moments de la journée (heure réelle) et météo ---------- */
const PH={aube:{sky:["#ffd2bd","#fde9d8"],tint:"#ffb7a0",a:.12,name:"Aube"},jour:{sky:["#bfe0f2","#e9f5ee"],tint:"#fff",a:0,name:"Journée"},crepu:{sky:["#b99ad6","#f7c1a0"],tint:"#8a6ab0",a:.22,name:"Crépuscule"},nuit:{sky:["#252b62","#47467f"],tint:"#262c6a",a:.45,name:"Nuit"}};
// ?heure=22 force l'heure, pour tester
const QH=new URLSearchParams(location.search).get("heure"),hourNow=()=>QH!=null?+QH:new Date().getHours();
const phaseNow=()=>{const h=hourNow();return h>=6&&h<8?"aube":h>=8&&h<18?"jour":h>=18&&h<21?"crepu":"nuit"};
const dark=()=>["crepu","nuit"].includes(phaseNow());
// il pleut par tranches de 3 heures, une fois sur deux (demande de Joffray) ; la même pluie pour tout le monde au même moment
function rainNow(){return storyRain()||rainAt(Date.now())}
function rainAt(t){const d=new Date(t),k=d.getFullYear()*1e6+(d.getMonth()+1)*1e4+d.getDate()*10+Math.floor(d.getHours()/3);
  let x=k%2147483647;for(let i=0;i<3;i++)x=(x*16807)%2147483647;return x/2147483647<.5}

/* ---------- décor ---------- */
function rng(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
// Décor refait le 29/10/2026 (Joffray trouvait l'ancien « mid ») : lumière, ombres douces, matières, profondeur.
// Même disposition qu'avant (maison, porche, souche, mare, banc, arbres) : les endroits (SPOTS) et les zones à toucher ne bougent pas.
const f1=n=>n.toFixed(1),L=(w=2.6)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
// ombre douce au pied des choses (lumière en haut à gauche)
const shade=(x,y,rx,ry,o=1)=>`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#cSh)" opacity="${o}"/>`;
function bgDefs(ph){const g=(id,a,b,x2=0,y2=1)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`,P=PH[ph];
  const hz={aube:"#ffe0c8",jour:"#f4f1dc",crepu:"#ffcf9e",nuit:"#5a4f86"}[ph];
  return `<defs><linearGradient id="cSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset=".7" stop-color="${P.sky[1]}"/><stop offset="1" stop-color="${hz}"/></linearGradient>
  ${g("cGrass","#b4d48f","#d2e7ad")}${g("cHill",ph==="nuit"?"#5d6f9a":"#b7cfc4",ph==="nuit"?"#6f7fa6":"#cfe0cf")}
  ${g("cF0","#c3dbbb","#a9c9a6")}${g("cF1","#a6cc9c","#82b07f")}${g("cF2","#8cc18a","#5f9467")}${g("cCrown","#9fcd95","#5f9268")}
  ${g("cTrunk","#7a5238","#b98a62",1,0)}${g("cLog","#f2c78f","#d9a26a")}${g("cRoof","#d98670","#b8604f")}${g("cGlass","#d6ecf6","#a6cde2",1,1)}${g("cGlassN","#fff1b8","#ffbe62")}
  ${g("cDoor","#a46c4a","#7a4a31",1,0)}${g("cDeck","#e3b583","#c99566")}${g("cWater","#bfe3ef","#7fbcd6")}${g("cStump","#9a6a48","#c28e62",1,0)}${g("cBench","#deac7a","#b8835a")}
  <radialGradient id="cSh"><stop offset="0" stop-color="#3f6a3a" stop-opacity=".34"/><stop offset=".6" stop-color="#4f7a45" stop-opacity=".16"/><stop offset="1" stop-color="#5f8a50" stop-opacity="0"/></radialGradient>
  <radialGradient id="cSun"><stop offset="0" stop-color="#fffbe8" stop-opacity=".95"/><stop offset=".4" stop-color="#fff3cf" stop-opacity=".38"/><stop offset="1" stop-color="#fff3cf" stop-opacity="0"/></radialGradient>
  <radialGradient id="cVig" cx=".5" cy=".45" r=".75"><stop offset=".65" stop-color="#3d2a35" stop-opacity="0"/><stop offset="1" stop-color="#3d2a35" stop-opacity=".16"/></radialGradient>
  <pattern id="cGrain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".5" fill="#5b4250" opacity=".07"/><circle cx="5" cy="5.5" r=".45" fill="#5b4250" opacity=".05"/></pattern></defs>`}
// un houppier en touffes : dégradé, reflet en haut à gauche, petites feuilles dessinées
function crown(cl,X,r){let s="";cl.forEach(([x,y,R])=>s+=`<circle cx="${X(x)}" cy="${y}" r="${R}" fill="url(#cCrown)" ${L(2.6)}/>`);
  cl.forEach(([x,y,R])=>{const cx=X(x);s+=`<ellipse cx="${f1(cx-R*.3)}" cy="${f1(y-R*.42)}" rx="${f1(R*.5)}" ry="${f1(R*.3)}" fill="#c4e6b4" opacity=".55"/>`;
    for(let i=0;i<3;i++){const a=r()*6.28,d=R*(.35+r()*.4),lx=cx+Math.cos(a)*d,ly=y+Math.sin(a)*d*.8;s+=`<path d="M${f1(lx-3)} ${f1(ly-1)} q3 3 6 0" fill="none" stroke="#4f7f58" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`}});
  return s}
function sideTree(x,flip,r){const X=v=>flip?2*x-v:v;let s=shade(x+10,252,40,8);
  s+=`<path d="M${X(x-12)} 254 Q${X(x-20)} 258 ${X(x-26)} 256 Q${X(x-14)} 248 ${X(x-9)} 230 Q${X(x-6)} 190 ${X(x-10)} 150 L${X(x+10)} 150 Q${X(x+6)} 190 ${X(x+10)} 232 Q${X(x+16)} 248 ${X(x+26)} 256 Q${X(x+18)} 258 ${X(x+12)} 254Z" fill="url(#cTrunk)" ${L(2.8)}/>`;
  s+=`<path d="M${X(x-4)} 236 Q${X(x-2)} 210 ${X(x-5)} 186 M${X(x+4)} 220 Q${X(x+5)} 200 ${X(x+3)} 176 M${X(x-1)} 166 q3 4 0 8" fill="none" stroke="#6a4430" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><ellipse cx="${X(x+2)}" cy="200" rx="2.6" ry="3.6" fill="#6a4430"/>`;
  s+=`<path d="M${X(x-14)} 254 q-4 -6 -1 -10 q4 3 3 9 M${X(x+16)} 255 q2 -7 6 -8 q1 5 -4 9" fill="#8fc07e" ${L(1.6)}/>`;
  return s+crown([[-22,132,26],[18,136,26],[-4,112,30],[-30,104,20],[26,106,22],[0,86,22]].map(([dx,y,R])=>[x+dx,y,R]),X,r)}
function bgSVG(){
  const ph=phaseNow(),r=rng(11);let s=bgDefs(ph);
  s+=`<rect width="400" height="480" fill="url(#cGrass)"/><rect width="400" height="160" fill="url(#cSky)"/>`;
  // soleil (ou lune) et collines lointaines dans la brume
  s+=ph==="jour"?`<circle cx="320" cy="34" r="70" fill="url(#cSun)"/><circle cx="320" cy="34" r="13" fill="#fffdf2" opacity=".9"/>`
    :ph==="aube"?`<circle cx="70" cy="108" r="60" fill="url(#cSun)"/><circle cx="70" cy="108" r="14" fill="#fff0d8"/>`
    :ph==="crepu"?`<circle cx="310" cy="104" r="64" fill="url(#cSun)"/><circle cx="310" cy="104" r="15" fill="#ffd9a8"/>`
    :`<circle cx="332" cy="40" r="34" fill="#fff6d0" opacity=".12"/><circle cx="332" cy="40" r="14" fill="#fff6dc"/><circle cx="327" cy="37" r="3" fill="#ece0b8"/><circle cx="337" cy="45" r="2" fill="#ece0b8"/>`;
  s+=`<path d="M0 104 Q40 78 84 92 Q130 64 178 88 Q224 70 262 86 Q312 62 352 84 Q380 76 400 82 L400 150 L0 150Z" fill="url(#cHill)"/>`;
  // forêt du fond : trois rangées, de plus en plus pâles au loin
  [[0,"cF0",48,""],[1,"cF1",72,`stroke="${INK}" stroke-width="1.6" stroke-opacity=".35"`],[2,"cF2",96,`stroke="${INK}" stroke-width="2.4" stroke-opacity=".7"`]].forEach(([row,fill,y0,ln])=>{
    for(let i=-1;i<11;i++){const x=i*40+row*13+r()*10,y=y0+r()*16,R=(row?32:26)+r()*12;
      if(row===1&&i%4===2){s+=`<path d="M${f1(x)} ${f1(y-R*1.3)} L${f1(x-R*.6)} ${f1(y+R*.6)} Q${f1(x)} ${f1(y+R*.75)} ${f1(x+R*.6)} ${f1(y+R*.6)}Z" fill="#7aa883" ${ln}/>`;continue}
      s+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R)}" fill="url(#${fill})" ${ln}/><ellipse cx="${f1(x-R*.3)}" cy="${f1(y-R*.45)}" rx="${f1(R*.45)}" ry="${f1(R*.26)}" fill="#e2f2d6" opacity="${[.35,.3,.28][row]}"/>`}});
  s+=`<rect y="40" width="400" height="80" fill="${ph==="nuit"?"#5a5f98":"#eef6ee"}" opacity=".14"/>`;
  s+=`<path d="M0 150 Q100 132 200 146 Q300 132 400 150 L400 200 L0 200Z" fill="#6fa070" ${L(2.6)}/><path d="M0 156 Q100 140 200 152 Q300 140 400 156" fill="none" stroke="#8fc07e" stroke-width="3" opacity=".7"/>`;
  s+=`<rect x="0" y="168" width="400" height="320" fill="url(#cGrass)"/>`;
  // taches de lumière, petites touffes, trèfles, cailloux, fleurs sur tige
  for(let i=0;i<9;i++){const x=r()*400,y=190+r()*280;s+=`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(26+r()*30)}" ry="${f1(7+r()*6)}" fill="#e6f3c6" opacity=".45"/>`}
  for(let i=0;i<52;i++){const x=r()*400,y=180+r()*295,k=.8+r()*.5;s+=`<path d="M${f1(x)} ${f1(y)} q-2 -4 -5 -6 q4 1 5 4 q0 -5 1 -8 q1 4 0 8 q2 -3 5 -4 q-3 2 -5 6Z" fill="${i%3?"#86b06e":"#9cc47f"}" stroke="#6f9a5a" stroke-width="1" transform="translate(${f1(x*(1-k))} ${f1(y*(1-k))}) scale(${f1(k)})"/>`}
  for(let i=0;i<6;i++){const x=20+r()*360,y=200+r()*260;s+=[0,120,240].map(a=>`<circle cx="${f1(x+3*Math.cos(a*Math.PI/180))}" cy="${f1(y+2.4*Math.sin(a*Math.PI/180))}" r="2.6" fill="#7fb06a" stroke="#5f8f52" stroke-width=".8"/>`).join("")}
  for(let i=0;i<8;i++){const x=20+r()*360,y=200+r()*270;s+=`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="3.4" ry="2.2" fill="#d8d0c4" stroke="#9a8f86" stroke-width="1"/><ellipse cx="${f1(x-.8)}" cy="${f1(y-.7)}" rx="1.6" ry=".8" fill="#f0ebe2"/>`}
  for(let i=0;i<16;i++){const x=20+r()*360,y=280+r()*190,c=["#ffd1dc","#fff3a8","#d9c7f2","#ffffff"][i%4];
    s+=`<path d="M${f1(x)} ${f1(y+9)} q-1 -5 0 -9" fill="none" stroke="#6f9a60" stroke-width="1.4"/><path d="M${f1(x)} ${f1(y+6)} q-5 -2 -6 1 q3 2 6 -1Z" fill="#8fc07e"/><g transform="translate(${f1(x)} ${f1(y)})">${[0,72,144,216,288].map(a=>`<circle cx="${f1(3*Math.cos(a*Math.PI/180))}" cy="${f1(3*Math.sin(a*Math.PI/180))}" r="2.5" fill="${c}" stroke="#c9a0b0" stroke-width=".6"/>`).join("")}<circle r="1.7" fill="#f2b84a"/></g>`}
  // chemin de pierres plates, un peu de mousse
  [[200,272],[193,296],[206,322],[196,350],[205,392],[196,430],[204,466]].forEach(([x,y],i)=>{const w=13-i*.3;
    s+=shade(x+3,y+3,w+4,7,.8)+`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="6" fill="#ddd5ca" ${L(2.2)}/><ellipse cx="${x-2}" cy="${y-1.6}" rx="${f1(w*.6)}" ry="2.4" fill="#efe9e0"/><path d="M${f1(x+w*.3)} ${y+4.6} q4 -1 ${f1(w*.5)} -3" fill="none" stroke="#8fbf6e" stroke-width="2.2" stroke-linecap="round"/>`});
  s+=`<g filter="url(#wobble)">`;
  // arbres sur les côtés ; la branche de la balançoire sort de l'arbre de droite (les cordes et la planche sont dans objets.js)
  if(R.obj&&R.obj.balancoire)s+=`<path d="M374 182 Q340 168 298 176 Q290 180 297 186 Q338 182 374 206Z" fill="url(#cTrunk)" ${O}/><path d="M352 186 q-8 -2 -14 1" fill="none" stroke="#6a4430" stroke-width="2" stroke-linecap="round"/>
    <path d="M296 178 q-8 -6 -6 -14 q8 2 6 14Z" fill="#8dbd86" stroke="${INK}" stroke-width="2"/>`;
  s+=sideTree(22,false,r)+sideTree(380,true,r);
  // la cabane, nichée dans l'arbre de droite : des touffes de feuilles passent devant, une échelle de corde descend le long du tronc
  if(R.obj&&R.obj.cabane){s+=crown([[350,92,30],[396,84,26]],v=>v,r)+`
    <rect x="330" y="88" width="56" height="44" rx="3" fill="url(#cLog)" ${O}/>${[99,110,121].map(y=>`<path d="M332 ${y} H384" stroke="#c48a58" stroke-width="2"/>`).join("")}
    <path d="M322 92 L358 64 L394 92Z" fill="url(#cRoof)" ${O}/><path d="M336 84 L358 68 L380 84" fill="none" stroke="#a65445" stroke-width="2"/>
    <rect x="360" y="102" width="16" height="15" rx="3" fill="url(#${dark()?"cGlassN":"cGlass"})" ${O}/><path d="M368 102 V117 M360 109.5 H376" stroke="#8a5a3a" stroke-width="2"/>
    <path d="M330 138 L366 166 L366 156 L344 138Z" fill="#8a5a3a" ${O}/><rect x="298" y="130" width="94" height="8" rx="3" fill="#c99a6a" ${O}/>
    <path d="M366 138 L368 248 M378 138 L380 248" stroke="#c99a6a" stroke-width="2"/>${[152,168,184,200,216,232].map(y=>`<path d="M${366+(y-138)*.02} ${y} H${378+(y-138)*.02}" stroke="#c99a6a" stroke-width="2.4"/>`).join("")}`
    +crown([[398,140,16],[318,70,12]],v=>v,r)}
  s+=house();
  // guirlandes de lanternes, du porche aux arbres (les lanternes sont dans glowSVG)
  s+=`<path d="M106 194 Q60 226 26 200 ${R.obj&&R.obj.balancoire?"M294 194 Q300 210 306 206":"M294 194 Q340 226 374 200"}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
  // la souche : mousse, cernes, petit champignon
  s+=shade(94,306,32,7)+`<path d="M63 290 L62 304 Q85 316 108 304 L107 290Z" fill="url(#cStump)" ${L(2.8)}/><path d="M70 296 v10 M80 297 v12 M92 297 v12 M101 295 v9" stroke="#7a5238" stroke-width="1.4" opacity=".6"/><path d="M60 304 q-7 5 -12 2 q4 -3 4 -6 M110 304 q7 5 12 2 q-4 -3 -4 -6" fill="#9a6a48" ${L(2.2)}/>`
    +`<ellipse cx="85" cy="290" rx="22" ry="8" fill="#ecc99c" ${L(2.4)}/><ellipse cx="85" cy="290" rx="14" ry="5" fill="none" stroke="#c99a6a" stroke-width="1.4"/><ellipse cx="85" cy="290" rx="6" ry="2.2" fill="none" stroke="#c99a6a" stroke-width="1.2"/>`
    +`<path d="M63 293 q6 4 12 2 q-2 6 -12 4Z" fill="#8fbf6e" stroke="#5f8f52" stroke-width="1.2"/><g transform="translate(112 300)"><path d="M-1 0 v6 h3 v-6" fill="#fff4e4" ${L(1.4)}/><path d="M-6 1 Q0 -9 7 1Z" fill="#e2546e" ${L(1.6)}/><circle cx="-1" cy="-2" r="1.1" fill="#fff"/><circle cx="3" cy="-1" r=".9" fill="#fff"/></g>`;
  // le tas de feuilles
  s+=shade(320,344,34,7)+`<g ${L(2.2)}>${[[300,336,"#f2a35c"],[318,330,"#e8794e"],[338,334,"#f6c065"],[310,340,"#e98a5a"],[330,342,"#f2a35c"],[322,338,"#d9693f"]].map(([x,y,c],i)=>`<path d="M${x-14} ${y} Q${x} ${y-14} ${x+14} ${y} Q${x} ${y+6} ${x-14} ${y}Z" fill="${c}" transform="rotate(${[-12,8,-4,14,-8,3][i]} ${x} ${y})"/>`).join("")}</g>`
    +[[304,334,-12],[326,330,8],[318,340,14]].map(([x,y,a])=>`<path d="M${x-9} ${y} Q${x} ${y-3} ${x+9} ${y}" fill="none" stroke="#b9583a" stroke-width="1.2" transform="rotate(${a} ${x} ${y})"/>`).join("");
  // la mare : pierres et mousse autour, reflets du ciel, nénuphars, quenouilles
  s+=`<ellipse cx="96" cy="426" rx="68" ry="29" fill="#9fbf8a" ${L(2.4)}/>`+[[36,420],[48,438],[70,450],[100,454],[132,448],[154,434],[158,416],[44,406],[140,404]].map(([x,y],i)=>`<ellipse cx="${x}" cy="${y}" rx="${7+i%3*2}" ry="${4+i%2}" fill="#d6cfc4" ${L(1.8)}/><ellipse cx="${x-1.4}" cy="${y-1.4}" rx="3" ry="1.4" fill="#ece6dc"/>`).join("");
  s+=`<ellipse cx="96" cy="424" rx="60" ry="22" fill="url(#cWater)" ${L(2.6)}/><path d="M42 420 Q96 404 150 420" fill="none" stroke="#5f9fbf" stroke-width="2" opacity=".35"/>`;
  s+=`<path d="M56 418 q20 -8 42 -4 M108 432 q14 -4 26 -1" fill="none" stroke="#f2fbff" stroke-width="2.6" stroke-linecap="round" opacity=".9"/><ellipse cx="118" cy="420" rx="9" ry="3" fill="none" stroke="#e8f6fb" stroke-width="1.2" opacity=".8"/><ellipse cx="118" cy="420" rx="15" ry="5" fill="none" stroke="#e8f6fb" stroke-width="1" opacity=".5"/>`;
  s+=`<path d="M72 430 a10 4.5 0 1 1 6 3.6 l-6 -3.6Z" fill="#8fca7a" ${L(1.8)}/><path d="M128 426 a7 3.2 0 1 1 4 2.6 l-4 -2.6Z" fill="#9cd488" ${L(1.6)}/><g transform="translate(76 426)">${[0,60,120,180,240,300].map(a=>`<ellipse rx="1.8" ry="3.6" fill="#ffd1dc" stroke="#d98aa0" stroke-width=".8" transform="rotate(${a}) translate(0 -2.6)"/>`).join("")}<circle r="1.4" fill="#f2c45a"/></g>`;
  s+=`<path d="M38 418 l-4 -20 M44 414 l0 -22 M150 416 l3 -18 M156 420 l6 -14" fill="none" stroke="#6f9a60" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="34" cy="396" rx="2.6" ry="6" fill="#8a5a3a" ${L(1.4)}/><ellipse cx="44" cy="391" rx="2.6" ry="6" fill="#8a5a3a" ${L(1.4)}/><ellipse cx="153" cy="397" rx="2.4" ry="5.4" fill="#8a5a3a" ${L(1.4)}/><path d="M30 412 q-6 -6 -4 -14 q4 6 4 14 M160 418 q6 -4 10 -12 q-1 8 -10 12" fill="#8fc07e" stroke="#5f8f52" stroke-width="1.2"/>`;
  // la canne à pêche plantée au bord (après l'histoire de Gaston) : on peut pêcher
  if(storyDone("gaston"))s+=`<path d="M150 440 L132 384" stroke="#a9785a" stroke-width="3.4" stroke-linecap="round"/><path d="M132 384 Q118 398 116 418" fill="none" stroke="#fff" stroke-width="1.4"/><circle cx="116" cy="420" r="3.4" fill="#e0564f" stroke="${INK}" stroke-width="1.6"/>`;
  // le banc
  s+=shade(306,420,50,7)+`<rect x="266" y="404" width="6" height="14" fill="#9a6a48" ${L(2.2)}/><rect x="328" y="404" width="6" height="14" fill="#9a6a48" ${L(2.2)}/><rect x="258" y="394" width="84" height="13" rx="3" fill="url(#cBench)" ${L(2.6)}/><path d="M262 400 H338" stroke="#b07a52" stroke-width="1.6"/><path d="M270 398 q8 -1 14 0 M300 403 q10 -1 18 0" stroke="#f0c896" stroke-width="1.2" stroke-linecap="round"/>`;
  s+=`</g>`;
  // lumière : un voile chaud le jour, un léger vignettage, le grain du papier
  if(ph==="jour")s+=`<circle cx="330" cy="20" r="220" fill="url(#cSun)" opacity=".18"/>`;
  return s+`<rect width="400" height="480" fill="url(#cVig)"/><rect width="400" height="480" fill="url(#cGrain)"/>`;
}
/* la maison de Roussette, en rondins */
function house(){const night=dark();let s=shade(200,250,120,16);
  s+=`<rect x="232" y="44" width="22" height="42" rx="3" fill="#b9a49a" ${L()}/>`+[[234,50,9],[244,50,8],[236,59,10],[247,59,6],[234,68,7],[242,68,10],[236,77,9],[246,77,7]].map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="7" rx="2.4" fill="#cfbcb2" stroke="#9a857b" stroke-width="1.2"/>`).join("")+`<rect x="229" y="40" width="28" height="7" rx="2" fill="#a8938a" ${L(2.2)}/>`;
  // murs en rondins, bouts ronds sur les côtés
  s+=`<rect x="128" y="104" width="144" height="98" fill="url(#cLog)" ${L(3)}/>`;
  for(let y=104,i=0;y<200;y+=12,i++){s+=`<path d="M129 ${y+12} H271" stroke="#c48a58" stroke-width="2"/><path d="M134 ${y+4} q20 -1.6 40 0 M${180+i*7%30} ${y+7} q22 1.4 44 0" fill="none" stroke="#fbe0b6" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`;
    for(const x of [126,274])s+=`<circle cx="${x}" cy="${y+6}" r="6" fill="#e8b47c" ${L(2)}/><circle cx="${x}" cy="${y+6}" r="2.6" fill="none" stroke="#b8804e" stroke-width="1.2"/>`}
  // toit en bardeaux, un peu de mousse
  s+=`<path d="M104 116 L200 40 L296 116 Q200 126 104 116Z" fill="url(#cRoof)" ${L(3)}/>`;
  for(const [y,a,b] of [[110,114,286],[98,128,272],[86,144,256],[74,160,240],[62,176,224],[50,190,210]])for(let x=a;x<b;x+=12)s+=`<path d="M${x} ${y} q6 6 12 0" fill="none" stroke="#a65445" stroke-width="1.6"/>`;
  s+=`<path d="M150 90 Q176 70 198 54 M206 56 Q240 80 266 98" fill="none" stroke="#f2a890" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>`;
  s+=`<path d="M118 108 q8 -6 16 -2 q6 -4 12 1 q-14 5 -28 1Z M244 96 q6 -4 12 0 q4 -2 8 2 q-10 3 -20 -2Z" fill="#8fbf6e" stroke="#5f8f52" stroke-width="1.2"/>`;
  // fenêtres : cadre, rideaux, jardinière fleurie
  const win=x=>`<rect x="${x-3}" y="121" width="42" height="40" rx="6" fill="#8a5a3a" ${L(2.4)}/><rect x="${x}" y="124" width="36" height="34" rx="4" fill="url(#${night?"cGlassN":"cGlass"})" stroke="#6a4430" stroke-width="1.6"/>`
    +(night?"":`<path d="M${x+4} 154 L${x+16} 128 M${x+12} 156 L${x+24} 130" stroke="#fff" stroke-width="2.6" opacity=".55" stroke-linecap="round"/>`)
    +`<path d="M${x+1} 125 Q${x+9} 132 ${x+5} 157 L${x+1} 157Z M${x+35} 125 Q${x+27} 132 ${x+31} 157 L${x+35} 157Z" fill="#f6b8c4" stroke="#d98a9a" stroke-width="1.2"/>`
    +`<path d="M${x+18} 124 V158 M${x} 141 H${x+36}" stroke="#8a5a3a" stroke-width="3"/>`
    +`<path d="M${x-3} 158 q4 -8 8 -2 q3 -7 8 -1 q4 -7 8 -1 q4 -7 8 -1 q3 -6 8 0 q3 -5 6 2Z" fill="#8fc07e" stroke="#5f8f52" stroke-width="1.2"/>`+[4,12,20,28,35].map((d,i)=>`<circle cx="${x+d}" cy="${155-(i%2)*2}" r="2.2" fill="${["#ff9ab0","#fff3a8","#ffffff"][i%3]}" stroke="#c98a9a" stroke-width=".8"/>`).join("")
    +`<path d="M${x-5} 160 H${x+41} l-2 7 H${x-3}Z" fill="#c97b5a" ${L(2.2)}/><path d="M${x-3} 163 h42" stroke="#a65e40" stroke-width="1.2"/>`;
  s+=win(146)+win(218);
  // porte entrouverte : un filet de lumière chaude
  s+=`<path d="M184 202 V146 Q200 128 216 146 V202Z" fill="#5e3a2a" ${L(2.8)}/><path d="M188 202 V147 Q193 139 202 137 V202Z" fill="#ffd98a" stroke="none"/>`;
  s+=`<path d="M199 136 Q209 134 215 143 V202 H199Z" fill="url(#cDoor)" ${L(2.4)}/><path d="M204 140 V202 M209 141 V202" stroke="#5e3a26" stroke-width="1.2" opacity=".7"/><circle cx="203" cy="172" r="2" fill="#f2c45a" ${L(1.2)}/>`;
  // porche : terrasse, marches, poteaux avec du lierre, auvent, fanions
  s+=`<path d="M106 202 L294 202 L302 246 L98 246Z" fill="url(#cDeck)" ${L(3)}/>`;
  for(const y of [213,224,235])s+=`<path d="M${104-(y-202)*.1} ${y} H${296+(y-202)*.1}" stroke="#b8845a" stroke-width="1.8"/><path d="M${130+y%3*20} ${y-5} q14 -1 26 0 M${230-y%4*10} ${y-6} q14 1 24 0" stroke="#f0c896" stroke-width="1.1" stroke-linecap="round"/>`;
  s+=`<path d="M180 246 h40 l3 8 h-46Z M175 254 h50 l3 8 h-56Z" fill="#c99a6a" ${L(2.4)}/><path d="M182 249 h36 M177 257 h46" stroke="#e3b583" stroke-width="1.4"/>`;
  s+=`<rect x="102" y="190" width="7" height="54" rx="2" fill="#a87650" ${L(2.4)}/><rect x="291" y="190" width="7" height="54" rx="2" fill="#a87650" ${L(2.4)}/>`;
  s+=[105.5,294.5].map(x=>`<path d="M${x-4} 242 q6 -6 0 -12 q-6 -6 1 -12 q6 -6 0 -12" fill="none" stroke="#5f9a5a" stroke-width="2"/>`+[236,224,212,200].map((y,i)=>`<path d="M${x+(i%2?-1:1)*2} ${y} q${(i%2?-1:1)*6} -4 ${(i%2?-1:1)*8} 1 q${(i%2?1:-1)*4} 3 ${(i%2?1:-1)*8} -1Z" fill="#8fc07e" stroke="#5f8f52" stroke-width="1"/>`).join("")).join("");
  s+=`<path d="M108 168 L292 168 L302 192 L98 192Z" fill="url(#cRoof)" ${L(3)}/>`+[128,156,184,212,240,268].map(x=>`<path d="M${x} 170 L${f1(x-4+(x-200)*.06)} 191" stroke="#9a4f42" stroke-width="1.8"/>`).join("")+`<path d="M110 172 H290" stroke="#f2a890" stroke-width="2" opacity=".6"/>`;
  s+=`<path d="M98 192 Q200 204 302 192" fill="none" stroke="${INK}" stroke-width="1.2"/>`+Array.from({length:12},(_,i)=>{const x=104+i*16.4,y=193+Math.sin((i+.5)/12*Math.PI)*9.4,c=["#f6b8c4","#fff1a8","#bfe0f2","#cfeabf"][i%4];return `<path d="M${f1(x)} ${f1(y)} l7 0 l-3.5 8Z" fill="${c}" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/>`}).join("");
  // pots de fleurs aux coins de la terrasse
  s+=[[116,240],[284,240]].map(([x,y])=>`<path d="M${x-7} ${y-10} h14 l-2 10 h-10Z" fill="#e0855c" ${L(2)}/><path d="M${x-8} ${y-10} h16" ${L(2)}/><circle cx="${x-4}" cy="${y-15}" r="5" fill="#8fc07e" ${L(1.6)}/><circle cx="${x+4}" cy="${y-16}" r="5" fill="#9cd488" ${L(1.6)}/><circle cx="${x}" cy="${y-20}" r="5" fill="#8fc07e" ${L(1.6)}/><circle cx="${x-2}" cy="${y-19}" r="2" fill="#ff9ab0"/><circle cx="${x+4}" cy="${y-15}" r="1.8" fill="#fff3a8"/>`).join("");
  return s}
// les lumières passent au-dessus du voile de la nuit pour vraiment briller
function glowSVG(){
  let s="";const lamps=(side,pts)=>pts.map(([x,y])=>{const on=scn.lamps[side];return (on?`<circle class="lit" cx="${x}" cy="${y+8}" r="14" fill="#ffe08a" opacity=".45"/>`:"")+`<path d="M${x} ${y} v3" stroke="${INK}" stroke-width="1.4"/><path d="M${x-4} ${y+3} h8 l-1 -2 h-6Z" fill="${INK}"/><rect x="${x-5}" y="${y+4}" width="10" height="12" rx="3.4" fill="${on?"#ffd36a":"#fbefd8"}" stroke="${INK}" stroke-width="1.8"/><path d="M${x-3} ${y+16} h6 l-1 2 h-4Z" fill="${INK}"/>`+(on?`<ellipse cx="${x}" cy="${y+50}" rx="20" ry="7" fill="#ffd98a" opacity=".22"/>`:"")}).join("");
  s+=lamps("L",[[86,206],[60,214],[38,208]])+lamps("R",R.obj&&R.obj.balancoire?[[301,202]]:[[314,206],[340,214],[362,208]]);
  if(dark()){
    s+=[166,236].map(x=>`<circle cx="${x}" cy="141" r="26" fill="#ffe08a" opacity=".22"/>`).join("");
    s+=`<path d="M188 202 V147 Q193 139 202 137 V202Z" fill="#ffe08a" opacity=".35"/>`+[164,236].map(x=>`<ellipse cx="${x}" cy="236" rx="34" ry="12" fill="#ffd98a" opacity=".16"/>`).join("")+`<ellipse cx="198" cy="262" rx="26" ry="14" fill="#ffd98a" opacity=".2"/>`;
  }
  if(storyPeek())s+=peekSVG();
  if(phaseNow()==="nuit"){const r=rng(5);for(let i=0;i<16;i++)s+=`<circle cx="${(r()*400).toFixed(1)}" cy="${(r()*60).toFixed(1)}" r="${(.8+r()*1.2).toFixed(1)}" fill="#fff8d0" opacity=".8"/>`;
    if(!scn.rain)for(let i=0;i<7;i++)s+=`<circle class="fly" style="animation-delay:${(-r()*5).toFixed(1)}s" cx="${(30+r()*340).toFixed(1)}" cy="${(260+r()*190).toFixed(1)}" r="2" fill="#fff6a0"/>`}
  // renards à l'intérieur : des silhouettes derrière les vitres
  foxes.filter(f=>f.inside).slice(0,4).forEach((f,i)=>{const x=[156,170,228,242][i];s+=`<g opacity=".55"><path d="M${x-7} 158 Q${x-8} 148 ${x-5} 144 L${x-6} 136 L${x-1} 142 Q${x} 141 ${x+1} 142 L${x+6} 136 L${x+5} 144 Q${x+8} 148 ${x+7} 158Z" fill="${INK}"/></g>`});
  // fumée de la cheminée
  s+=[0,1.3,2.6].map(d=>`<circle class="smoke" style="animation-delay:${d}s;transform-origin:242px 40px" cx="242" cy="38" r="6" fill="#f4f0ee"/>`).join("");
  return s;
}
function drawBg(){scn.phase=phaseNow();if(!dark())scn.lamps={L:false,R:false};$("bg").innerHTML=bgSVG();drawGlow();foxes.forEach(f=>moveLight(f));const ph=PH[scn.phase];$("tint").style.backgroundColor=ph.tint;$("tint").style.opacity=ph.a;drawPills()}
// pendant une scène sous la pluie (Pain d'épice et Brioche), les autres regardent par les fenêtres : ombres de têtes et yeux qui clignent
// (idée de Joffray) ; une tête par carreau du bas, qui monte et descend doucement
function peekSVG(){const lit=dark(),head=lit?"#5b4250":"#7d6670",eye=lit?"#fff6c8":"#fffaf2";
  return [[146,0],[164,1.3],[218,.6],[236,2]].map(([x,d],i)=>`<g clip-path="url(#pk${i})"><clipPath id="pk${i}"><rect x="${x+1}" y="141" width="17" height="17"/></clipPath>
    <g class="peek" style="animation-delay:${-d}s"><path d="M${x+3} 152 l2 -7 l3 4 h3 l3 -4 l2 7 Z" fill="${head}"/><ellipse cx="${x+9.5}" cy="155" rx="7" ry="5.5" fill="${head}"/>
    <g class="blink" style="animation-delay:${-d*1.7}s"><circle cx="${x+7}" cy="153.5" r="1.3" fill="${eye}"/><circle cx="${x+12}" cy="153.5" r="1.3" fill="${eye}"/></g></g></g>`).join("")}
function drawGlow(){$("glow").innerHTML=glowSVG()}
function drawPills(){$("phase").textContent=PH[phaseNow()].name+(scn.rain?" · il pleut":"")}

/* ---------- gamelle (dans la scène) ---------- */
function bowlSVG(type,n=3){const B=type&&BOWLS[type];
  const food=!B?"":type==="poisson"?`<path d="M10 8 q6 -5 14 0 q-8 5 -14 0Z M24 8 l5 -3 v6Z" fill="#9ec3ef" stroke="${INK}" stroke-width="1.4"/>`
    :type==="miel"?`<path d="M12 9 l3 -5 h6 l3 5 l-3 5 h-6Z M22 9 l3 -5 h6 l3 5" fill="#f2c45a" stroke="${INK}" stroke-width="1.4"/>`
    :Array.from({length:n*3},(_,i)=>`<circle cx="${9+(i%6)*4.4}" cy="${8.5-Math.floor(i/6)*2.4}" r="2.4" fill="${B.col}" stroke="${INK}" stroke-width="1.4"/>`).join("");
  return `<svg viewBox="0 0 40 24" aria-hidden="true"><g filter="url(#wobble)">${food}<path d="M3 9 Q4 22 20 22 Q36 22 37 9Z" fill="#f59a8b" ${O}/><ellipse cx="20" cy="9" rx="17" ry="4" fill="none" ${O}/></g></svg>`}

/* ---------- pluie ---------- */
const cv=$("rain"),cx=cv.getContext("2d");let drops=[],splashes=[],lastT=performance.now(),raining=false;
// chaque goutte tombe jusqu'à un point du sol (vue de dessus) et y fait une petite éclaboussure (Joffray : la pluie ne touchait pas le sol)
const newDrop=(w,h,y)=>({x:Math.random()*w*1.1,y:y??-10-Math.random()*h*.3,v:260+Math.random()*160,g:h*(.4+Math.random()*.6)});
function sizeRain(){const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=r.width*d;cv.height=r.height*d;cx.setTransform(d,0,0,d,0,0);drops=Array.from({length:90},()=>newDrop(r.width,r.height,Math.random()*r.height*.4));splashes=[]}
function startRain(){if(raining||matchMedia("(prefers-reduced-motion: reduce)").matches)return;raining=true;lastT=performance.now();requestAnimationFrame(rainLoop)}
function rainLoop(now){const dt=Math.min(.05,(now-lastT)/1000);lastT=now;const w=cv.width/(devicePixelRatio||1),h=cv.height/(devicePixelRatio||1);cx.clearRect(0,0,w,h);
  if(scn.rain){cx.strokeStyle="rgba(214,232,255,.75)";cx.lineWidth=1.6;cx.lineCap="round";cx.beginPath();
    for(const d of drops){d.y+=d.v*dt;d.x-=d.v*dt*.12;if(d.y>=d.g){splashes.push({x:d.x,y:d.g,t:0});Object.assign(d,newDrop(w,h))}cx.moveTo(d.x,d.y);cx.lineTo(d.x+1.4,d.y-11)}cx.stroke();
    // éclaboussures : un petit rond qui s'élargit et deux gouttelettes qui rebondissent
    cx.lineWidth=1.3;splashes=splashes.filter(s=>(s.t+=dt)<.4);
    for(const s of splashes){const k=s.t/.4,a=(1-k)*.8,r=1.5+k*7;
      cx.strokeStyle=`rgba(225,238,255,${a.toFixed(2)})`;cx.beginPath();cx.ellipse(s.x,s.y,r,r*.4,0,0,Math.PI*2);cx.stroke();
      if(k<.6){cx.fillStyle=`rgba(235,244,255,${a.toFixed(2)})`;const hop=Math.sin(k/.6*Math.PI)*5;cx.beginPath();cx.arc(s.x-3-k*5,s.y-hop,1.1,0,Math.PI*2);cx.arc(s.x+3+k*5,s.y-hop,1.1,0,Math.PI*2);cx.fill()}}}
  if(scn.rain)requestAnimationFrame(rainLoop);else raining=false}
