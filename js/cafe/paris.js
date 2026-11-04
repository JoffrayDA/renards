/* Kitsune Café : Paris, deuxième quartier de la Ville (04/11/2026, maquette validée par Joffray : tools/paris.html,
   renards sur tools/parisiens.html). 20 journées, comme la Petite Italie, avec son café, le Café Kitsune, et son équipement
   (S.pa.own, même prix que l'Italie) ; les pièces, les quêtes, les bonus et le style restent communs.
   Mêmes clés de recettes, prix et cuissons : seuls le nom et le dessin changent (VAR.paris, ICON["clé@paris"]) :
   petit noir (+ Crème = café crème), pain au chocolat (le croissant reste celui du premier café, Joffray), diabolo grenadine,
   madeleine, café liégeois (à la place du chocolat chaud, Joffray), boîte de macarons à composer (comme le gelato : trois
   macarons dans l'ordre du client, de gauche à droite), éclair, chantilly.
   Histoire (choix de Joffray) : le grand concours du pain au chocolat. Anatole, le garçon de café, accompagne tout du long,
   comme Lorenzo ; Firmin, le boulanger d'en face, est le rival : aux jours de défi (PA_DUEL), il annonce son score, et le battre
   donne une scène et un cadeau ; à la finale (jour 20), Céleste, la Diva de l'Opéra, goûte les deux pains au chocolat.
   On y entre par le panneau à droite du Caffè, en haut de la carte de la Petite Italie, une fois ses 20 journées réussies
   (?paris=1 pour tester). Sauvegarde : S.pa = {day, stars, best, own, intro, guest, read, duel, peace, gtip}. */

/* ---------- les renards du quartier (dans FOX, pas dans FOXES : ni la Clairière, ni le grand portrait) ---------- */
const PAF=[
  {id:"anatole",name:"Anatole",rar:"commun",acc:"garconb",scale:.84,c:{b:"#e8955a",ch:"#fff4e6",e:"#8a4a2a",s:"#7a4028",t:"#fff4e6"},bio:"Le garçon de café. Gilet noir, nœud bordeaux, et toujours un petit noir sur son plateau."},
  {id:"musette",name:"Musette",rar:"commun",acc:"accordeon",c:{b:"#9ec3e0",ch:"#f6fbff",e:"#5a7a9a",s:"#4c6a8a",t:"#f6fbff"},bio:"L'accordéoniste en marinière. Elle joue sur les marches de Montmartre."},
  {id:"bobine",name:"Bobine",rar:"commun",acc:"photographe",c:{b:"#e6c08a",ch:"#fffaf0",e:"#a07a4a",s:"#8a6a3e",t:"#fffaf0"},bio:"Le photographe à casquette de gavroche. Il prend tout le quartier en photo, clients compris."},
  {id:"leon",name:"Léon",rar:"commun",acc:"bouquiniste",c:{b:"#8a8f9e",ch:"#f2f2f6",e:"#5a5e6a",s:"#4c505a",t:"#f2f2f6"},bio:"Bouquiniste sur les quais. Il lit en attendant sa commande, et oublie de la boire."},
  // le rival : ne vient au café qu'après la finale (S.pa.peace)
  {id:"firmin",name:"Firmin",rar:"rare",acc:"boulanger",c:{b:"#c7a07a",ch:"#fff8ee",e:"#7a5a3c",s:"#6a4c32",t:"#fff8ee"},bio:"Le boulanger d'en face. « Le meilleur pain au chocolat de Paris, c'est le mien. » Enfin, c'était."},
  {id:"celeste",name:"Céleste",rar:"legend",acc:"diva",c:{b:"#f4ead8",ch:"#ffffff",e:"#c9a86a",s:"#b8965a",t:"#ffffff"},bio:"La Diva de l'Opéra. Elle ne chante que pour les cafés parfaits."}
];
PAF.forEach(f=>{f.world="paris";FOX[f.id]=f});
const PAF_REG=PAF.filter(f=>f.rar==="commun");

/* ---------- les journées ---------- */
// rythme d'un jour de référence du premier monde (plus dur que l'Italie : le jour 1 se joue comme le jour 18), graine et objectif par
// `python tools/balance-bot.py --paris`
const PA_DAYS=[{base:18,seed:4,goal:147},{base:19,seed:1,goal:159},{base:20,seed:12,goal:176},{base:21,seed:12,goal:177},{base:22,seed:1,goal:211},{base:23,seed:3,goal:209},{base:24,seed:5,goal:268},{base:25,seed:12,goal:278},{base:26,seed:5,goal:308},{base:27,seed:6,goal:323},{base:28,seed:14,goal:339},{base:29,seed:15,goal:358},{base:30,seed:13,goal:381},{base:31,seed:13,goal:402},{base:32,seed:7,goal:433},{base:33,seed:15,goal:462},{base:34,seed:9,goal:450},{base:36,seed:13,goal:463},{base:38,seed:5,goal:442},{base:40,seed:14,goal:456}];
const PA_S3=Array(20).fill(1.7);
const PA_KIT=IT_KIT;
// jours de défi de Firmin (le 20 est la finale du concours)
const PA_DUEL={5:1,10:1,15:1,20:1};
S.pa=S.pa||{day:1,stars:{},best:{},own:{},intro:0,guest:0,read:{},duel:{}};
S.pa.read=S.pa.read||{};S.pa.duel=S.pa.duel||{};
if(new URLSearchParams(location.search).get("paris")==="1"){S.paOpen=1;save()} // pour tester sans avoir fini la Petite Italie
const paOpen=()=>S.it.day>IT_LAST||!!S.paOpen;
// le score de Firmin : celui de ★★ (objectif de base, sans l'ajustement d'équipement) ; plus haut, la finale demandait un jeu presque parfait
const duelScore=d=>Math.ceil(PA_DAYS[d-1].goal*(1+(PA_S3[d-1]-1)/2));

/* ---------- la carte du café : noms et dessins (mêmes clés, prix et cuissons) ---------- */
VAR.paris={cafe:["Petit noir","petits noirs"],croissant:["Pain au chocolat","pains au chocolat"],the:["Diabolo grenadine","diabolos grenadine"],cookie:["Madeleine","madeleines"],
  choco:["Café liégeois","cafés liégeois"],smoothie:["Boîte de macarons","boîtes de macarons"],gateau:["Éclair","éclairs"]};
const PA_MAC={f:{n:"Framboise",c:"#f49ab0"},v:{n:"Violette",c:"#b99ad8"},c:{n:"Caramel",c:"#eab765"}};
const K2=`stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"`,KB=`stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
const macSVG=(x,y,c,k=1)=>`<ellipse cx="${x}" cy="${y-4*k}" rx="${9*k}" ry="${4.6*k}" fill="${c}" ${K2}/><rect x="${x-8*k}" y="${y-2*k}" width="${16*k}" height="${3.6*k}" rx="${1.6*k}" fill="#fff8ec" ${K2}/><ellipse cx="${x}" cy="${y+4.4*k}" rx="${9*k}" ry="${4.6*k}" fill="${c}" ${K2}/><ellipse cx="${x-3*k}" cy="${y-6*k}" rx="${2.4*k}" ry="${1*k}" fill="#fff" opacity=".7"/>`;
// la boîte de macarons, remplie de gauche à droite (g peut être incomplet : la boîte en cours au comptoir)
const paBoxSVG=g=>`<path d="M2 16 H38 V33 Q38 36 35 36 H5 Q2 36 2 33Z" fill="#fff" ${K}/><path d="M2 16 L6 10 H34 L38 16" fill="#cfe3f1" ${K}/>`+[0,1,2].map(i=>g[i]?macSVG(10+i*10,26,PA_MAC[g[i]].c,.82):`<circle cx="${10+i*10}" cy="26" r="4.2" fill="none" stroke="#e6c3cf" stroke-width="1.4" stroke-dasharray="2 2"/>`).join("");
const paGlass=(liq,top)=>`<path d="M11 9 H29 L27 36 H13Z" fill="#eef7fb" ${K}/><path d="M12.2 16 H27.8 L26.6 34.5 H13.4Z" fill="${liq}"/>${top||""}<rect x="15" y="18" width="6" height="6" rx="1.5" fill="#fff" opacity=".75" transform="rotate(-12 18 21)"/><rect x="21" y="24" width="5.5" height="5.5" rx="1.5" fill="#fff" opacity=".7" transform="rotate(10 23 26)"/><path d="M11 9 H29 L27 36 H13Z" fill="none" ${K}/>`;
Object.assign(ICON,{
  "cafe@paris":`<ellipse cx="20" cy="33" rx="14" ry="3.4" fill="#fff" ${K}/><path d="M29 20 Q35 20 34 24 Q33 28 28 27" fill="none" ${K}/><path d="M10 17 H30 Q30 31 20 31 Q10 31 10 17Z" fill="#fff" ${K}/><ellipse cx="20" cy="17" rx="10" ry="2.6" fill="#4a2a1c" ${K}/><path d="M17 11 q-2 -3 0 -6 M23 11 q-2 -3 0 -6" fill="none" stroke="#c9b3a8" stroke-width="1.8" stroke-linecap="round"/>`,
  // pain au chocolat (refait le 04/11/2026, Joffray : « on reconnait pas du tout » ; version A de tools/painchoc.html)
  "croissant@paris":`<path d="M4 28 V20 Q4 13 11 12 Q20 10.4 28 12 Q32 12.8 32.4 17 L32.4 29 Q32 32 28.5 32 H8 Q4 32 4 28Z" fill="#d98a3a" ${KB}/>
     <path d="M6.6 17.6 Q7.4 14.4 11.4 14 Q20 12.6 27.6 14 Q30.4 14.6 30.6 17.4 Q19 15.8 6.6 17.6Z" fill="#f2b862"/>
     <path d="M10 14.6 Q14 13.6 17 13.6" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>
     <path d="M5 21.6 Q18 20 31.6 21.6 M5 25.2 Q18 23.6 31.6 25.2 M5 28.8 Q18 27.2 31.6 28.8" stroke="#a65a1e" stroke-width="1.4" fill="none"/>
     <path d="M5 23.4 Q18 21.8 31.6 23.4 M5 27 Q18 25.4 31.6 27" stroke="#eba85a" stroke-width="1.2" fill="none"/>
     <ellipse cx="33.2" cy="22" rx="4.6" ry="9.6" fill="#f3cf8e" ${KB}/>
     <path d="M33.2 13.6 Q36.6 14.4 36.6 22 Q36.6 29 33.4 30 Q30.4 29 30.4 22 Q30.4 17 33.2 16.8 Q35 17.2 35 22 Q35 26.6 33.2 27.2" stroke="#c98a45" stroke-width="1.1" fill="none" stroke-linecap="round"/>
     <ellipse cx="33.2" cy="19.6" rx="2.2" ry="1.7" fill="#4a2a1c"/><ellipse cx="33.2" cy="24.6" rx="2.2" ry="1.7" fill="#4a2a1c"/>`,
  "the@paris":paGlass("#f2707e",`<path d="M24 3 L21 27" ${K} stroke="#7fc4e0"/><circle cx="28" cy="10" r="4" fill="#ffe36a" ${K2}/><path d="M28 6.5 V13.5" stroke="#f2c94a" stroke-width="1.1"/>`),
  "cookie@paris":`<path d="M5 26 Q6 10 20 9 Q34 10 35 26 Q31 32 20 32 Q9 32 5 26Z" fill="#f2c27a" ${K}/><path d="M20 31 V12 M13 30 Q12 19 16 12 M27 30 Q28 19 24 12 M8 27 Q8 20 12 15 M32 27 Q32 20 28 15" fill="none" stroke="#d99a4a" stroke-width="1.6" stroke-linecap="round"/><path d="M12 10.5 Q16 9 18 9.4" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>`,
  "choco@paris":`<path d="M12 13 H28 L26.5 36 H13.5Z" fill="#eef7fb" ${K}/><path d="M12.6 22 H27.4 L26.5 35 H13.5Z" fill="#8a5a3a"/><path d="M12.8 19 H27.2 L27 22 H13Z" fill="#c99a70"/><path d="M12 13 H28 L26.5 36 H13.5Z" fill="none" ${K}/><path d="M26 15 L31 4" ${K}/><ellipse cx="31.4" cy="3.6" rx="2" ry="1.2" fill="#fff" ${K2}/>`,
  "smoothie@paris":paBoxSVG("fvc"),
  // éclair (refait le 04/11/2026 dans le style du pain au chocolat, Joffray ; version A de tools/eclair.html)
  "gateau@paris":`<path d="M4 25 Q2.6 25 2.6 21.6 Q2.6 16.6 8 16 H31 Q34.6 16.4 34.6 20 V27.4 Q34.6 29.6 31.6 29.6 Q19 31 7.4 29.4 Q4 28.8 4 25Z" fill="#d98a3a" ${KB}/>
     <path d="M5 26.4 Q19 28.4 33.4 26.6" stroke="#a65a1e" stroke-width="1.3" fill="none"/>
     <path d="M8 27.8 l1 -1.6 M14 28.6 l1 -1.6 M20 28.8 l1 -1.6 M26 28.6 l1 -1.6" stroke="#eba85a" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M4.4 20.6 Q4.4 16.6 9 16.2 H30.6 Q33.6 16.6 33.8 20 Q32 22.2 30.2 21 Q28.8 24 26.4 21.8 Q24 23.4 21.6 21.8 Q19.4 24.4 17 22 Q14.4 23.6 12.2 21.8 Q10 23.2 8.4 21.4 Q6.2 22.6 4.4 20.6Z" fill="#5a3324" ${KB}/>
     <path d="M8.6 18.4 Q14 17 20 17.4" stroke="#a9765c" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="23.4" cy="17.8" r="1" fill="#fff" opacity=".8"/>
     <ellipse cx="34.6" cy="23" rx="3.8" ry="6.8" fill="#e9a453" ${KB}/>
     <ellipse cx="34.6" cy="23.6" rx="2.2" ry="4.6" fill="#fff1c8"/><path d="M33.4 21 q1.2 -.6 2.2 .2" stroke="#f2d98a" stroke-width="1.1" fill="none" stroke-linecap="round"/>`,
  "lait@paris":`<path d="M12 11 H26 L28 17 V33 Q28 35 26 35 H12 Q10 35 10 33 V17Z" fill="#fff" ${K}/><path d="M12 11 L10 7 H24 L26 11" fill="#fff" ${K}/><path d="M28 19 Q34 19 33 25 Q32 29 28 29" fill="none" ${K}/><path d="M11 23 H27" stroke="#5b8ac0" stroke-width="2"/>`,
  "chantilly@paris":`<path d="M10 31 Q6 25 12 23 Q8 17 15 15 Q14 8 21 8 Q28 8 26 15 Q33 16 29 23 Q35 25 30 31Z" fill="#fffaf0" ${K}/><path d="M15 21 q5 -3 10 0 M14 27 q6 -3 12 0" stroke="#e6d3c4" stroke-width="1.6" fill="none"/>`
});

/* ---------- dehors, derrière la vitre : les immeubles d'en face, la tour Eiffel au loin ---------- */
// pas de collines à Paris : la palette sert seulement au dégradé des collines de bgSVG (draw.js)
OUT.paris={sky:["#9fcfee","#f6e4ee"],hill:["#c9d89a","#b5c983"],cloud:"#fff"};
function outsidePa(){
  const f=n=>n.toFixed(1),l=(w=2.4)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const defs=`<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fcfee"/><stop offset=".7" stop-color="#d9e9f4"/><stop offset="1" stop-color="#f6e4ee"/></linearGradient>`;
  let st=`<rect x="0" y="0" width="600" height="200" fill="url(#sky)"/><circle cx="120" cy="50" r="16" fill="#fff6c8" ${l(2)}/>`,an="";
  // la tour Eiffel, au loin entre deux toits
  st+=`<path d="M420 150 Q432 112 436 70 L440 36 L442 24 L444 36 L448 70 Q452 112 464 150Z" fill="#c9a888" ${l(1.8)}/><path d="M425 128 H459 M434 84 H450 M437 54 H447" stroke="${INK}" stroke-width="1.6"/><path d="M432 150 Q442 132 452 150" fill="#d9e9f4" stroke="${INK}" stroke-width="1.4"/>`;
  // les immeubles d'en face : pierre crème, toits de zinc et leurs lucarnes, balcons en fer forgé, boutiques en bas
  const fac=(x,w,top,shop)=>{let g=`<path d="M${x-3} ${top} L${x+7} ${top-18} H${x+w-7} L${x+w+3} ${top}Z" fill="#a9b6c6" ${l(2)}/>`;
    for(let i=0;i<Math.floor((w-12)/30);i++)g+=`<rect x="${x+12+i*30}" y="${top-14}" width="9" height="10" rx="3.5" fill="#e6eef6" ${l(1.4)}/>`;
    g+=`<rect x="${x+w-20}" y="${top-28}" width="9" height="12" fill="#d98a6a" ${l(1.4)}/><rect x="${x}" y="${top}" width="${w}" height="${200-top}" fill="#f6e8d0" ${l(2)}/>`;
    for(let i=0;i<Math.floor((w-6)/30);i++)for(let j=0;j<2;j++){const wx=x+10+i*30,wy=top+10+j*30;g+=`<rect x="${wx}" y="${wy}" width="13" height="20" rx="2" fill="#9fc0d8" ${l(1.6)}/>`;if(j===0)g+=`<path d="M${wx-3} ${wy+14} H${wx+16} M${wx} ${wy+14} V${wy+20} M${wx+6.5} ${wy+14} V${wy+20} M${wx+13} ${wy+14} V${wy+20}" stroke="${INK}" stroke-width="1.3"/>`}
    g+=`<rect x="${x+4}" y="174" width="${w-8}" height="12" fill="${shop}" ${l(1.6)}/>`+Array.from({length:Math.floor((w-8)/12)},(_,i)=>`<path d="M${x+4+i*12} 174 h6 v5 h-6Z" fill="#fff"/>`).join("");return g};
  st+=fac(40,140,96,"#c0485a")+fac(180,110,112,"#3f7a5a")+fac(290,120,100,"#5f7fb0")+fac(470,120,108,"#d98a6a");
  // un platane, une colonne Morris, le trottoir
  st+=`<rect x="0" y="184" width="600" height="16" fill="#e3d6c2" ${l(2)}/>`;
  st+=`<rect x="257" y="150" width="6" height="34" fill="#a8825a" ${l(1.6)}/><circle cx="260" cy="140" r="20" fill="#8cc47a" ${l(1.8)}/><circle cx="252" cy="133" r="6" fill="#a6d690"/>`;
  st+=`<rect x="402" y="146" width="20" height="38" fill="#4f8a6a" ${l(1.8)}/><rect x="405" y="152" width="6" height="10" fill="#f49ab0" ${l(1.2)}/><rect x="413" y="154" width="6" height="8" fill="#ffe08a" ${l(1.2)}/><path d="M399 146 H425 Q421 134 412 132 Q403 134 399 146Z" fill="#4f8a6a" ${l(1.8)}/>`;
  // des pigeons qui passent, des nuages
  an+=`<g><animateTransform attributeName="transform" type="translate" values="-80 0;560 -12" dur="22s" repeatCount="indefinite"/>${[[150,64],[166,58],[180,66]].map(([x,y])=>`<path d="M${x-6} ${y} q3 -4 6 0 q3 -4 6 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`).join("")}</g>`;
  const cloud=(x,y,k,dur)=>`<g><animateTransform attributeName="transform" type="translate" values="0 0;18 0;0 0" dur="${dur}s" repeatCount="indefinite"/>${[[x-14*k,y,11*k],[x+2*k,y-7*k,15*k],[x+18*k,y,10*k]].map(([cx,cy,r])=>`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#fff"/>`).join("")}</g>`;
  an+=cloud(300,50,1,24)+cloud(540,40,.7,29);
  return {defs,st,an};
}

/* ---------- la carte du quartier : de l'entrée en bas au Café Kitsune en haut, chaque lieu une fois ---------- */
// la rue (jours 1-5), la Seine et Notre-Dame (entre 5 et 6), le Champ-de-Mars et la tour Eiffel (7-12), Montmartre (13-18), le café (19-20)
const PA_X=[200,120,110,200,290,300,210,110,100,150,110,190,280,300,230,290,300,220,130,200];
function paLayout(){
  const P=[];for(let d=1;d<=PA_DAYS.length;d++)P[d]={d,x:PA_X[d-1],u:230+(d-1)*96};
  const top=P[PA_DAYS.length].u,H=top+380,way=[{x:200,u:60},...P.slice(1),{x:200,u:top+160}];
  return {P,way,H,guest:{x:322,u:P[PA_DAYS.length].u+14},ana:{x:pathX(way,150)<200?300:100,u:120},cafe:{x:200,u:top+190},seine:(P[5].u+P[6].u)/2};
}
const paHaus=(x,y,w,h,shop="#c0485a")=>{let g=shadow(x+w/2,y+h,w*.55)+`<path d="M${x-3} ${y} L${x+7} ${y-22} H${x+w-7} L${x+w+3} ${y}Z" fill="#a9b6c6" ${BO}/>`;
  for(let i=0;i<Math.floor((w-10)/22);i++)g+=`<rect x="${x+12+i*22}" y="${y-17}" width="9" height="11" rx="4" fill="#e6eef6" ${K2}/>`;
  g+=`<rect x="${x+w-18}" y="${y-30}" width="8" height="10" fill="#d98a6a" ${K2}/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f6e8d0" ${BO}/>`;
  for(let i=0;i<Math.floor((w-6)/22);i++){const wx=x+8+i*22;for(let j=0;j<Math.floor((h-26)/26);j++){const wy=y+8+j*26;g+=`<rect x="${wx}" y="${wy}" width="11" height="17" rx="2" fill="#bcd8ea" ${K2}/>`;if(j===0)g+=`<path d="M${wx-2} ${wy+12} H${wx+13} M${wx+1} ${wy+12} V${wy+17} M${wx+5.5} ${wy+12} V${wy+17} M${wx+10} ${wy+12} V${wy+17}" stroke="${INK}" stroke-width="1.3"/>`}}
  g+=`<path d="M${x} ${y+h-22} H${x+w}" stroke="${INK}" stroke-width="2"/><rect x="${x+4}" y="${y+h-18}" width="${w-8}" height="18" fill="${shop}" opacity=".85" ${K2}/>`;
  for(let i=0;i<Math.floor((w-8)/10);i++)g+=`<path d="M${x+4+i*10} ${y+h-22} h5 v6 h-5Z" fill="#fff"/>`;return g};
const paTree=(x,y,k=1)=>shadow(x,y,14*k)+`<rect x="${x-3*k}" y="${y-10*k}" width="${6*k}" height="${12*k}" fill="#a8825a" ${K2}/><circle cx="${x}" cy="${y-22*k}" r="${15*k}" fill="#8cc47a" ${K}/><circle cx="${x-6*k}" cy="${y-27*k}" r="${4*k}" fill="#a6d690"/>`;
const paLamp=(x,y)=>shadow(x,y,8)+`<path d="M${x} ${y} V${y-36}" stroke="${INK}" stroke-width="3"/><path d="M${x-6} ${y} h12" ${K}/><path d="M${x-6} ${y-36} H${x+6} L${x+4} ${y-48} H${x-4}Z" fill="#ffe9a8" ${K2}/><path d="M${x-3} ${y-48} L${x} ${y-53} L${x+3} ${y-48}" fill="${INK}"/>`;
const paMetro=(x,y)=>`<rect x="${x-18}" y="${y-8}" width="36" height="10" rx="2" fill="#5b4250"/><path d="M${x-15} ${y} V${y-30} Q${x-15} ${y-42} ${x} ${y-44} Q${x+15} ${y-42} ${x+15} ${y-30} V${y}" fill="none" stroke="#3f7a5a" stroke-width="4" stroke-linecap="round"/><ellipse cx="${x-15}" cy="${y-33}" rx="3.4" ry="5" fill="#f2944a" ${K2}/><ellipse cx="${x+15}" cy="${y-33}" rx="3.4" ry="5" fill="#f2944a" ${K2}/><rect x="${x-14}" y="${y-41}" width="28" height="8" rx="2" fill="#f4ecd0" ${K2}/><text x="${x}" y="${y-35}" text-anchor="middle" font-size="5.6" font-weight="900" fill="#3f7a5a">MÉTRO</text>`;
const paMorris=(x,y)=>shadow(x,y,14)+`<rect x="${x-11}" y="${y-44}" width="22" height="44" fill="#4f8a6a" ${K}/><rect x="${x-8}" y="${y-38}" width="7" height="12" fill="#f49ab0" ${K2}/><rect x="${x+1}" y="${y-36}" width="7" height="10" fill="#ffe08a" ${K2}/><rect x="${x-6}" y="${y-22}" width="12" height="12" fill="#bfe1f0" ${K2}/><path d="M${x-14} ${y-44} H${x+14} Q${x+10} ${y-58} ${x} ${y-60} Q${x-10} ${y-58} ${x-14} ${y-44}Z" fill="#4f8a6a" ${K}/><circle cx="${x}" cy="${y-62}" r="3" fill="#4f8a6a" ${K2}/>`;
const paTable=(x,y)=>shadow(x,y,26)+`<path d="M${x} ${y} V${y-14}" ${K}/><ellipse cx="${x}" cy="${y-15}" rx="11" ry="3.6" fill="#fff" ${K}/>`+[-17,17].map(o=>`<path d="M${x+o-6} ${y} V${y-10} M${x+o+6} ${y} V${y-10}" stroke="#b07a46" stroke-width="2.4"/><rect x="${x+o-7}" y="${y-12}" width="14" height="5" rx="2" fill="#d9a46a" ${K2}/><path d="M${x+o+(o<0?-7:7)} ${y-10} V${y-24} Q${x+o} ${y-28} ${x+o-(o<0?-7:7)} ${y-24}" fill="none" stroke="#b07a46" stroke-width="2.6"/>`).join("");
const paBouq=(x,y)=>`<rect x="${x}" y="${y-12}" width="34" height="12" fill="#3f7a5a" ${K2}/><path d="M${x} ${y-12} L${x+4} ${y-24} H${x+30} L${x+34} ${y-12}" fill="#4f8a6a" ${K2}/>`+[0,1,2,3,4].map(i=>`<rect x="${x+3+i*6}" y="${y-11}" width="5" height="7" fill="${["#f49ab0","#ffe08a","#bfe1f0","#fff","#b99ad8"][i]}" stroke="${INK}" stroke-width="1"/>`).join("");
const paEasel=(x,y,c)=>shadow(x,y,10)+`<path d="M${x-8} ${y} L${x} ${y-30} L${x+8} ${y} M${x} ${y-30} V${y}" stroke="#a8825a" stroke-width="2.4" stroke-linecap="round"/><rect x="${x-10}" y="${y-30}" width="20" height="16" fill="#fff" ${K2}/><path d="M${x-8} ${y-18} Q${x-2} ${y-26} ${x+2} ${y-22} T${x+8} ${y-20}" stroke="${c}" stroke-width="2.4" fill="none"/><circle cx="${x+4}" cy="${y-26}" r="2.4" fill="#ffd36a"/>`;
const paBench=(x,y)=>shadow(x,y,24)+`<path d="M${x-20} ${y} v-10 M${x+20} ${y} v-10" stroke="${INK}" stroke-width="2.4"/><rect x="${x-24}" y="${y-13}" width="48" height="5" rx="2" fill="#4f8a6a" ${K}/><rect x="${x-24}" y="${y-24}" width="48" height="6" rx="2" fill="#4f8a6a" ${K}/>`;
const paNotreDame=(x,y)=>`<ellipse cx="${x}" cy="${y+16}" rx="86" ry="18" fill="#e9dcc6" ${BO}/>`+paTree(x-64,y+20,.55)+paTree(x+68,y+20,.55)
  +`<path d="M${x+40} ${y-30} L${x+44} ${y-74} L${x+48} ${y-30}Z" fill="#a9b6c6" ${K2}/><rect x="${x+18}" y="${y-30}" width="56" height="34" fill="#e8dcc8" ${K}/><path d="M${x+16} ${y-30} L${x+46} ${y-44} L${x+76} ${y-30}Z" fill="#a9b6c6" ${K2}/>`
  +`<rect x="${x-34}" y="${y-70}" width="22" height="74" fill="#efe4d0" ${K}/><rect x="${x+12}" y="${y-70}" width="22" height="74" fill="#efe4d0" ${K}/><rect x="${x-12}" y="${y-52}" width="24" height="56" fill="#efe4d0" ${K}/>`
  +`<path d="M${x-36} ${y-70} H${x+36}" stroke="${INK}" stroke-width="2.4"/>`+[[-29,-62],[-19,-62],[17,-62],[27,-62]].map(([a,b])=>`<path d="M${x+a-2} ${y+b+14} V${y+b} Q${x+a} ${y+b-4} ${x+a+2} ${y+b} V${y+b+14}" fill="#8a7a8a" stroke="${INK}" stroke-width="1.2"/>`).join("")
  +`<circle cx="${x}" cy="${y-36}" r="9" fill="#9fc0e8" ${K2}/>${[0,45,90,135].map(a=>`<path d="M${x} ${y-45} V${y-27}" stroke="#f49ab0" stroke-width="1.6" transform="rotate(${a} ${x} ${y-36})"/>`).join("")}<circle cx="${x}" cy="${y-36}" r="2.6" fill="#ffe08a" stroke="${INK}" stroke-width="1"/>`
  +[-23,0,23].map(o=>`<path d="M${x+o-6} ${y+4} V${y-8} Q${x+o} ${y-16} ${x+o+6} ${y-8} V${y+4}Z" fill="#a8664a" ${K2}/>`).join("")+`<path d="M${x-34} ${y-22} H${x+34}" stroke="#d8c8b0" stroke-width="2"/>`;
const paEiffel=(x,y,h)=>{const k=h/220;return shadow(x,y,46*k)+`<path d="M${x-42*k} ${y} Q${x-18*k} ${y-70*k} ${x-10*k} ${y-150*k} L${x-4*k} ${y-200*k} L${x} ${y-220*k} L${x+4*k} ${y-200*k} L${x+10*k} ${y-150*k} Q${x+18*k} ${y-70*k} ${x+42*k} ${y} H${x+26*k} Q${x} ${y-56*k} ${x-26*k} ${y}Z" fill="#b48a66" ${BO}/>`
  +`<path d="M${x-30*k} ${y-60*k} L${x+12*k} ${y-130*k} M${x+30*k} ${y-60*k} L${x-12*k} ${y-130*k} M${x-9*k} ${y-150*k} L${x+5*k} ${y-195*k} M${x+9*k} ${y-150*k} L${x-5*k} ${y-195*k}" stroke="#8a6448" stroke-width="1.6"/>`
  +`<rect x="${x-30*k}" y="${y-66*k}" width="${60*k}" height="${8*k}" rx="2" fill="#c99a76" ${K2}/><rect x="${x-13*k}" y="${y-152*k}" width="${26*k}" height="${7*k}" rx="2" fill="#c99a76" ${K2}/><path d="M${x} ${y-220*k} V${y-234*k}" ${K2}/><path d="M${x} ${y-234*k} l8 3 -8 3Z" fill="#c0485a"/>`};
const paSacre=(x,y,k=1)=>{const X=a=>x+a*k,Yy=b=>y+b*k;return shadow(x,y,52*k)+`<rect x="${X(-44)}" y="${Yy(-28)}" width="${88*k}" height="${28*k}" fill="#fbf7ee" ${K}/>`+[-30,-10,10,30].map(o=>`<path d="M${X(o-5)} ${y} V${Yy(-12)} Q${X(o)} ${Yy(-18)} ${X(o+5)} ${Yy(-12)} V${y}" fill="#d8d0c4" ${K2}/>`).join("")
  +[-34,34].map(o=>`<rect x="${X(o-7)}" y="${Yy(-44)}" width="${14*k}" height="${16*k}" fill="#fbf7ee" ${K2}/><path d="M${X(o-8)} ${Yy(-44)} Q${X(o)} ${Yy(-60)} ${X(o+8)} ${Yy(-44)}Z" fill="#fbf7ee" ${K2}/>`).join("")
  +`<rect x="${X(-16)}" y="${Yy(-58)}" width="${32*k}" height="${30*k}" fill="#fbf7ee" ${K}/><path d="M${X(-18)} ${Yy(-58)} Q${X(-18)} ${Yy(-92)} ${x} ${Yy(-96)} Q${X(18)} ${Yy(-92)} ${X(18)} ${Yy(-58)}Z" fill="#fbf7ee" ${K}/><rect x="${X(-3)}" y="${Yy(-106)}" width="${6*k}" height="${10*k}" fill="#fbf7ee" ${K2}/><path d="M${x} ${Yy(-106)} V${Yy(-114)} M${X(-3)} ${Yy(-111)} H${X(3)}" stroke="${INK}" stroke-width="1.8"/>`+[-10,0,10].map(o=>`<rect x="${X(o-2)}" y="${Yy(-52)}" width="${4*k}" height="${12*k}" rx="2" fill="#bcd8ea" stroke="${INK}" stroke-width="1"/>`).join("")};
const paStairs=(x,y)=>Array.from({length:7},(_,i)=>`<rect x="${x+i*4}" y="${y-i*12}" width="26" height="12" fill="#e9dfd2" ${K2}/>`).join("")+`<path d="M${x-4} ${y+6} L${x+24} ${y-80}" stroke="${INK}" stroke-width="2"/>`;
const paPeniche=(x,y)=>`<path d="M${x-36} ${y} H${x+40} L${x+32} ${y+12} H${x-30}Z" fill="#c0485a" ${K}/><rect x="${x-24}" y="${y-12}" width="40" height="12" rx="3" fill="#fff4dc" ${K}/><rect x="${x-18}" y="${y-9}" width="7" height="6" rx="1.5" fill="#bcd8ea" stroke="${INK}" stroke-width="1"/><rect x="${x-6}" y="${y-9}" width="7" height="6" rx="1.5" fill="#bcd8ea" stroke="${INK}" stroke-width="1"/><circle cx="${x+24}" cy="${y-4}" r="3.2" fill="#f47f9a" ${K2}/><circle cx="${x+30}" cy="${y-5}" r="3" fill="#ffd36a" ${K2}/>`;
function paCafeSVG(x,y){
  let s=shadow(x,y+4,104)+`<path d="M${x-114} ${y-110} L${x-102} ${y-134} H${x+102} L${x+114} ${y-110}Z" fill="#a9b6c6" ${BO}/>`+[0,1,2,3,4,5,6].map(i=>`<rect x="${x-86+i*26}" y="${y-129}" width="10" height="13" rx="4" fill="#e6eef6" ${K2}/>`).join("");
  s+=`<rect x="${x-110}" y="${y-110}" width="220" height="110" fill="#f6e8d0" ${BO}/>`+[0,1,2,3,4,5,6,7].map(i=>`<rect x="${x-98+i*26}" y="${y-102}" width="12" height="20" rx="2" fill="#bcd8ea" ${K2}/><path d="M${x-100+i*26} ${y-88} H${x-84+i*26}" stroke="${INK}" stroke-width="1.3"/>`).join("");
  s+=`<rect x="${x-110}" y="${y-68}" width="220" height="68" fill="#2f5a48" ${BO}/><rect x="${x-94}" y="${y-52}" width="70" height="48" rx="4" fill="#bcd8ea" ${K2}/><rect x="${x+24}" y="${y-52}" width="70" height="48" rx="4" fill="#bcd8ea" ${K2}/><rect x="${x-16}" y="${y-52}" width="32" height="52" rx="4" fill="#a8664a" ${BO}/><circle cx="${x+10}" cy="${y-24}" r="2" fill="#ffd36a"/>`;
  s+=`<rect x="${x-80}" y="${y-78}" width="160" height="20" rx="4" fill="#2f5a48" ${BO}/><text x="${x}" y="${y-63}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="12" fill="#f2cf6a">Café Kitsune</text>`;
  let aw=`<path d="M${x-102} ${y-54} H${x+102} L${x+110} ${y-36} H${x-110}Z" fill="#fff" ${BO}/>`;for(let i=0;i<10;i++)aw+=`<path d="M${x-101+i*20.6} ${y-54} h10 l2 18 h-10Z" fill="#c0485a"/>`;
  aw+=`<path d="M${x-110} ${y-36} ${Array.from({length:10},()=>"q11 8 22 0").join(" ")}" fill="#c0485a" ${K}/><path d="M${x-102} ${y-54} H${x+102} L${x+110} ${y-36} H${x-110}Z" fill="none" ${BO}/>`;
  return s+aw+paTable(x-80,y+32)+paTable(x+80,y+32);
}
const paBakery=(x,y)=>shadow(x,y,46)+`<rect x="${x-39}" y="${y-80}" width="78" height="80" fill="#5f7fb0" ${BO}/><path d="M${x-43} ${y-80} H${x+43}" stroke="${INK}" stroke-width="3"/><rect x="${x-33}" y="${y-72}" width="66" height="14" rx="3" fill="#fff4dc" ${K2}/><text x="${x}" y="${y-61.5}" text-anchor="middle" font-size="8.4" font-weight="900" fill="#5f7fb0">BOULANGERIE</text><rect x="${x-31}" y="${y-50}" width="40" height="34" rx="3" fill="#fff4dc" ${K2}/>`
  +[[x-21,y-28],[x-7,y-26],[x-15,y-38]].map(([a,b])=>`<g transform="translate(${a-10} ${b-9}) scale(.5)">${ICON["croissant@paris"]}</g>`).join("")+`<rect x="${x+15}" y="${y-50}" width="18" height="50" rx="3" fill="#a8664a" ${K2}/>`;
function paArchSVG(x,y){return `<path d="M${x-62} ${y+24} V${y-6} Q${x} ${y-56} ${x+62} ${y-6} V${y+24}" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M${x-62} ${y+24} V${y-6} Q${x} ${y-56} ${x+62} ${y-6} V${y+24}" fill="none" stroke="#a9b6c6" stroke-width="11" stroke-linecap="round"/><rect x="${x-56}" y="${y-48}" width="112" height="24" rx="9" fill="#fffaf2" ${BO}/><text x="${x}" y="${y-31}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="12" fill="${INK}">Paris</text>`}
function paMapSVG(L){
  const {P,way,H,cafe}=L,Y=u=>H-u,hz=Y(cafe.u)+40;
  const defs=`<pattern id="pa-pave" width="44" height="30" patternUnits="userSpaceOnUse"><rect width="44" height="30" fill="#eee5da"/><g fill="none" stroke="#ddd0c0" stroke-width="2"><rect x="2" y="2" width="18" height="11" rx="5"/><rect x="24" y="2" width="18" height="11" rx="5"/><rect x="-9" y="17" width="18" height="11" rx="5"/><rect x="13" y="17" width="18" height="11" rx="5"/><rect x="35" y="17" width="18" height="11" rx="5"/></g></pattern>
    <linearGradient id="pa-seine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d6e6"/><stop offset="1" stop-color="#7fb8d2"/></linearGradient>
    <linearGradient id="pa-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7c3c8"/><stop offset=".6" stop-color="#fbe0d0"/><stop offset="1" stop-color="#fdf0e2"/></linearGradient>`;
  let s=`<rect width="400" height="${H}" fill="url(#pa-pave)"/>`;
  // le ciel du soir et les toits de Paris, derrière le café
  s+=`<rect x="0" y="0" width="400" height="${hz}" fill="url(#pa-sky)"/><circle cx="320" cy="${hz-150}" r="18" fill="#fff4c8" ${BO}/>`;
  s+=[[0,60],[52,74],[96,56],[150,80],[206,62],[262,76],[316,58],[360,72]].map(([x,h],i)=>`<path d="M${x} ${hz} V${hz-h} L${x+8} ${hz-h-14} H${x+40} L${x+48} ${hz-h} V${hz}Z" fill="#c9cfd9" stroke="${INK}" stroke-width="2"/>`+(i%2?`<rect x="${x+30}" y="${hz-h-26}" width="6" height="12" fill="#d98a6a" stroke="${INK}" stroke-width="1.6"/>`:"")).join("");
  s+=`<path d="M0 ${hz} H400" stroke="${INK}" stroke-width="2"/>`;
  // les pelouses : le Champ-de-Mars, la butte Montmartre
  const u7=P[7].u,u12=P[12].u,u13=P[13].u,u18=P[18].u;
  s+=`<path d="M236 ${Y(u7+30)} Q320 ${Y(u7+10)} 410 ${Y(u7+24)} V${Y(u12-10)} Q330 ${Y(u12)} 250 ${Y(u12-30)}Z" fill="#c4e0a4" ${BO}/>`;
  s+=`<path d="M-10 ${Y(u13+10)} Q10 ${Y(u18-60)} 110 ${Y(u18-40)} Q190 ${Y(u18-60)} 200 ${Y(u18-220)} Q200 ${Y(u13+80)} 170 ${Y(u13+20)} Q90 ${Y(u13-20)} -10 ${Y(u13+10)}Z" fill="#b9d99a" ${BO}/>`;
  // la Seine en travers, ses quais
  const sy=Y(L.seine),bx=pathX(way,L.seine);
  s+=`<path d="M-10 ${sy-44} Q100 ${sy-52} 200 ${sy-44} T410 ${sy-48} V${sy-32} H-10Z" fill="#e3d6c2" ${BO}/><path d="M-10 ${sy-32} Q100 ${sy-38} 200 ${sy-30} T410 ${sy-34} V${sy+30} Q300 ${sy+40} 200 ${sy+32} T-10 ${sy+36}Z" fill="url(#pa-seine)" ${BO}/><path d="M-10 ${sy+36} Q100 ${sy+30} 200 ${sy+34} T410 ${sy+30} V${sy+48} H-10Z" fill="#e3d6c2" ${BO}/>`;
  s+=[[230,-14],[360,22],[40,20]].map(([x,o])=>`<path d="M${x} ${sy+o} q8 -4 16 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("");
  s+=paNotreDame(112,sy+6);
  s+=`<g><animateTransform attributeName="transform" type="translate" values="0 0;-26 0;0 0" dur="16s" repeatCount="indefinite"/>${paPeniche(bx<200?280:366,sy+14)}</g>`;
  // le chemin et la part déjà faite
  const pts=way.map(p=>[p.x,Y(p.u)]),d=smooth(pts);
  s+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fdf1df" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ead2bb" stroke-width="4" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  const k=way.findIndex(p=>p.d===itCur());if(k>0)s+=`<path d="${smooth(pts.slice(0,k+1))}" fill="none" stroke="#f59a8b" stroke-width="7" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  // le pont sur la Seine, là où passe le chemin
  s+=`<path d="M${bx-36} ${sy-34} H${bx+36} V${sy+34} H${bx-36}Z" fill="#efe4d0" ${BO}/>`+`<path d="M${bx-34} ${sy+34} Q${bx} ${sy+4} ${bx+34} ${sy+34}Z" fill="#a9d6e6" ${K2}/>`+`<path d="M${bx-36} ${sy-34} V${sy+34} M${bx+36} ${sy-34} V${sy+34}" stroke="${INK}" stroke-width="3"/>`+[-26,-8,10,28].map(o=>`<circle cx="${bx-36}" cy="${sy+o}" r="3" fill="#f6e8d0" ${K2}/><circle cx="${bx+36}" cy="${sy+o}" r="3" fill="#f6e8d0" ${K2}/>`).join("");
  // ce qui est posé, chaque chose une fois
  const it=[];const at=(x,u,f)=>it.push({x,u,f});
  // la rue : immeubles des deux côtés, métro, colonne Morris, terrasse, lampadaires, platanes
  [[0,150,62,96,"#c0485a"],[338,180,66,90,"#5f7fb0"],[0,370,58,80,"#d98a6a"],[340,420,64,84,"#3f7a5a"],[0,520,56,60,"#5f7fb0"]].forEach(([x,u,w,h,c])=>at(x+w/2,u,(cx,y)=>paHaus(x,y-h,w,h,c)));
  at(300,280,paMetro);at(280,430,paMorris);at(250,190,paLamp);at(170,560,paLamp);at(296,520,paTable);at(40,250,(x,y)=>paTree(x,y,.9));at(370,330,(x,y)=>paTree(x,y,.8));
  // les quais : bouquinistes
  at(36,L.seine-56,(x,y)=>paBouq(x-17,y));at(84,L.seine-56,(x,y)=>paBouq(x-17,y));at(132,L.seine-56,(x,y)=>paBouq(x-17,y));at(380,L.seine-60,(x,y)=>paTree(x,y,.7));
  // le Champ-de-Mars : la tour, des platanes, un banc
  at(322,u7+80,(x,y)=>paEiffel(x,y,330));at(30,u7+60,(x,y)=>paTree(x,y,.7));at(380,u7+40,(x,y)=>paTree(x,y,.6));at(36,u12-140,(x,y)=>paTree(x,y,.75));at(230,u12-170,paBench);at(54,u12+10,paLamp);
  // Montmartre : le Sacré-Cœur, les escaliers, les chevalets
  at(100,u13+250,(x,y)=>paSacre(x,y,1.3));at(150,u13+90,(x,y)=>paStairs(x,y));at(48,u13+120,(x,y)=>paEasel(x,y,"#8fbf5a"));at(178,u13+330,(x,y)=>paEasel(x,y,"#9fc0e8"));at(60,u18-30,(x,y)=>paEasel(x,y,"#f49ab0"));
  at(370,u13+160,(x,y)=>paTree(x,y,.7));at(372,u18-40,(x,y)=>paTree(x,y,.65));
  // devant le café : la boulangerie de Firmin, en face
  at(340,cafe.u+20,paBakery);at(40,cafe.u-40,(x,y)=>paTree(x,y,.8));
  it.sort((a,b)=>b.u-a.u).forEach(e=>s+=e.f(+e.x.toFixed(1),+Y(e.u).toFixed(1)));
  s+=paArchSVG(200,Y(60))+paCafeSVG(cafe.x,Y(cafe.u));
  return `<svg viewBox="0 0 ${ITW} ${H}" aria-hidden="true"><defs>${defs}</defs>${s}</svg>`;
}

/* ---------- l'histoire : le grand concours du pain au chocolat ---------- */
// une scène se lit en revenant sur la carte, à la première réussite de sa journée ; aux jours de défi, une fois Firmin battu
const PA_SCENES={
  1:[["firmin","open","Pas mal… pour un début. Mais un café qui sert des pains au chocolat en face de MA boulangerie ? On verra bien."],
     ["anatole","joy",`Ne l'écoute pas, ${ME()}. Les clients sont ravis !`]],
  2:[["musette","joy","Un diabolo grenadine, s'il vous plaît ! Avec une paille : je joue mieux après."],
     ["anatole","open","Musette joue de l'accordéon sur les marches de Montmartre. Si tu l'entends, c'est que le quartier est de bonne humeur."]],
  3:[["leon","open","Une chocolatine, s'il vous plaît."],["firmin","surprise","(de l'autre côté de la rue) PAIN AU CHOCOLAT !"],
     ["anatole","shy","Ici, on comprend les deux. Et on sert les deux."]],
  4:[["leon","shy","Une madeleine… Elle me rappelle un livre très, très long. Je ne l'ai jamais fini."],
     ["anatole","joy","Léon tient une boîte de bouquiniste sur les quais. Il lit même en marchant."]],
  5:[["firmin","surprise","Quoi ?! Plus de pièces que moi ?"],["firmin","open","C'était un échauffement. Au prochain défi, je sors le grand jeu."],
     ["anatole","joy","Premier défi gagné ! Regarde sa tête…"]],
  6:[["bobine","joy","Clic ! Ton café liégeois est trop photogénique."],["anatole","open","Bobine prend tout le quartier en photo. Son album est plus gros que lui."]],
  7:[["anatole","surprise","Tu as vu le monsieur en lunettes noires, derrière son journal ?"],["firmin","shy","Je… lis le journal. À l'envers. C'est la mode."],
     ["anatole","joy","Il espionne ! C'est bon signe : il a peur."]],
  9:[["anatole","joy","Les macarons ! Chaque client veut sa boîte dans son ordre à lui : framboise, violette, caramel…"],
     ["anatole","open","On les pose de gauche à droite. Raté ? Touche la boîte pour la vider, et recommence."]],
  10:[["firmin","sad","Deux fois. Deux fois de suite."],["musette","joy","Alors Firmin, on joue un petit air pour te consoler ?"],
      ["firmin","open","… Un petit, alors."]],
  11:[["anatole","joy","La chantilly ! Sur un café liégeois, ou sur un éclair."],["bobine","joy","Clic ! Celle-là, je l'encadre."]],
  12:[["bobine","open","J'ai pris ta vitrine en photo. Elle fait la une de mon album !"],["firmin","sad","Et la mienne ? Elle n'a pas de photo, la mienne ?"]],
  13:[["firmin","shy","Un éclair… pas mal. Le mien a plus de chocolat."],["anatole","joy","Il vient d'en acheter trois. Pour « étudier la concurrence »."]],
  15:[["firmin","open","Bon. D'accord. Tu as du talent. Beaucoup."],["firmin","surprise","Mais la finale, c'est autre chose. Céleste en personne goûtera nos deux pains au chocolat !"],
      ["anatole","surprise","La Diva de l'Opéra… Elle ne vient que dans les cafés parfaits."]],
  17:[["leon","open","J'ai trouvé un vieux programme de l'Opéra sur les quais. Céleste y chante depuis des années."],
      ["leon","shy","On dit qu'elle reconnaît un bon pain au chocolat à son bruit, quand on le croque."]],
  20:[["anatole","surprise","C'est le jour de la finale ! Céleste est là !"],
      ["celeste","open","Deux pains au chocolat. Un seul gagnant."],
      ["celeste","joy","Celui du Café Kitsune. Croustillant, fondant, et servi avec le sourire."],
      ["firmin","sad","…"],["firmin","shy","Il est meilleur que le mien. Bravo. Vraiment."],
      ["firmin","open","Et si je venais prendre mon petit noir chez toi, le matin ? Entre voisins."],
      ["anatole","joy",`On a gagné, ${ME()} ! Le meilleur pain au chocolat de Paris, c'est le tien !`]]
};
const paSceneDue=d=>PA_SCENES[d]&&!S.pa.read[d]&&(PA_DUEL[d]?!!S.pa.duel[d]:!!S.pa.stars[d]);
function anatoleIntro(){
  itTalk([["anatole","joy",`Bonjour, bonjour ! Anatole, garçon de café. Bienvenue à Paris, ${ME()} !`],
    ["anatole","open","Le Café Kitsune vient d'ouvrir au coin de la rue. Et juste en face… la boulangerie de Firmin."],
    ["firmin","open","Hmpf. Encore un café. Le meilleur pain au chocolat de Paris, c'est le mien. Tout le monde le sait."],
    ["anatole","surprise","Il organise un grand concours : à la finale, la Diva de l'Opéra goûtera vos deux pains au chocolat !"],
    ["anatole","joy","Pour commencer : le petit noir, et le pain au chocolat. Avec l'option Crème, le petit noir devient un café crème."],
    ["anatole","open","Les jours de défi, Firmin annonce son score. Fais mieux que lui, et il en fera une tête !"]],
    ()=>{if(!S.pa.intro){S.pa.intro=1;save();dailyBonus()}});
}
function paStory(){
  const d=Object.keys(PA_SCENES).map(Number).find(paSceneDue);
  if(d){itTalk(PA_SCENES[d],()=>{S.pa.read[d]=1;if(d===20&&!S.pa.peace){S.pa.peace=1;toast("Firmin viendra maintenant au café.")}save();renderMapIt();paStory()});return}
  dailyBonus();
}
function paCarnet(){
  const rows=Object.keys(PA_SCENES).map(Number).map(d=>S.pa.read[d]
    ?`<div data-pascene="${d}" style="cursor:pointer">${itRow(foxSVG(FOX[PA_SCENES[d][0][0]],{pose:"happy"}),PA_DUEL[d]?(d===20?"La finale":`Défi du jour ${d}`):`Jour ${d}`,PA_SCENES[d][0][2],"background:#fbf3dc")}</div>`
    :`<div style="opacity:.55">${itRow(foxSVG(FOX.anatole,{sil:1}),PA_DUEL[d]?(d===20?"La finale":`Défi du jour ${d}`):"Scène à découvrir",PA_DUEL[d]?`Bats Firmin au jour ${d}.`:`Réussis le jour ${d} du quartier.`)}</div>`).join("");
  openSheet(`<h2>Le journal du concours</h2><div style="width:120px;margin:0 auto">${foxSVG(FOX.anatole,{pose:"happy"})}</div>
  <p class="sub" style="text-align:center">Tout ce qui s'est passé depuis l'ouverture du Café Kitsune. Touche une scène pour la revoir.</p>${rows}
  <div class="col" style="margin-top:10px"><button class="btn ghost wide" data-act="anatoleintro" type="button">Revoir l'accueil d'Anatole</button></div>`);
  $("sheet-in").querySelectorAll("[data-pascene]").forEach(b=>b.onclick=()=>itTalk(PA_SCENES[+b.dataset.pascene],paCarnet));
}
// la fiche de Firmin (on le touche devant sa boulangerie) : où en est le concours
function paFinaleSheet(){
  const n=Object.keys(PA_DUEL).filter(d=>S.pa.duel[d]).length,f=FOX.firmin;
  openSheet(`<h2>${f.name}, le rival</h2><div style="width:140px;margin:0 auto">${foxSVG(f,{pose:S.pa.peace?"happy":"sit"})}</div>
  <p class="sub" style="text-align:center">${S.pa.peace?"Depuis la finale, il vient prendre son petit noir au Café Kitsune tous les matins.":`« Le meilleur pain au chocolat de Paris, c'est le mien. » Les jours de défi (${Object.keys(PA_DUEL).join(", ")}), il annonce son score : fais mieux que lui.`}</p>
  ${Object.keys(PA_DUEL).map(Number).map(d=>itRow(icon("croissant","paris"),d===20?"La finale (jour 20)":`Défi du jour ${d}`,S.pa.duel[d]?`Gagné ! Ton record : ${S.pa.best[d]} pièces, Firmin : ${duelScore(d)}.`:`Firmin a fait ${duelScore(d)} pièces.${S.pa.best[d]?` Ton record : ${S.pa.best[d]}.`:""}`,S.pa.duel[d]?"background:#e3f2d6":"")).join("")}`);
}

/* ---------- le quartier dans le registre des mondes (data.js) ---------- */
WORLDS.paris={id:"paris",name:"Paris",cafe:"Café Kitsune",short:"Café",sv:()=>S.pa,days:PA_DAYS,s3:PA_S3,kit:PA_KIT,
  opt:{lait:"Crème",chantilly:"Chantilly"},optItem:(r,o)=>o==="lait"&&r==="cafe"?"Café crème":`${REC[r].name} chantilly`,optWord:"la chantilly",
  gel:PA_MAC,gelSVG:paBoxSVG,tubSVG:x=>macSVG(20,21,PA_MAC[x].c,1.6),tubLabel:"Un macaron",cone:"la boîte",
  coneHint:"Touche les macarons <b>dans l'ordre de la commande</b>, de gauche à droite.",
  gelHint:g=>`Macarons : touche-les <b>dans l'ordre, de gauche à droite</b> (${gelName(g)}). Raté ? Touche la boîte.`,
  gelNew:"Dès la prochaine journée, les macarons : chaque client veut sa boîte de trois dans son ordre à lui. Touche les macarons de gauche à droite.",
  optNew:"Touche « Chantilly », au bout du plateau, pour en mettre sur un café liégeois ou un éclair.",
  guest:"celeste",guestBio:"Elle vient dans tous les cafés : elle paie le triple, mais elle est pressée.",
  reg:()=>[...PAF_REG,...PAF_REG,...PAF_REG,...(S.pa.peace?[FOX.firmin]:[])],
  music:()=>"galop",mapMusic:"quais", // la promenade sur les quais (choix de Joffray parmi six ; la musette en mineur « faisait Halloween »)
  isOpen:()=>paOpen(),lockMsg:"Réussis les 20 journées de la Petite Italie pour ouvrir Paris.",
  layout:()=>paLayout(),mapSVG:L=>paMapSVG(L),outside:()=>outsidePa(),
  duel:PA_DUEL,duelScore:d=>duelScore(d),duelRow:d=>itRow(icon("croissant","paris"),d===20?"La finale du concours !":"Jour de défi !",`Firmin a fait <b>${duelScore(d)} pièces</b>. Fais mieux que lui${S.pa.duel[d]?" (déjà battu)":""}.`,"background:#fde8ec"),
  mapExtra:(L,pc)=>`<button class="mguest ok" style="${pc(L.ana.x,L.ana.u)}" data-act="anatole" type="button" aria-label="Anatole">${foxSVG(FOX.anatole,{pose:"happy"})}<em>Anatole</em></button>`
    +`<button class="mguest${S.pa.peace?" ok":""}" style="${pc(L.cafe.x+142,L.cafe.u-36)}" data-act="finale" type="button" aria-label="Firmin">${foxSVG(FOX.firmin,{pose:S.pa.peace?"happy":"sit"})}<em>Firmin</em></button>`
    +`<button class="mnext" style="${pc(200,52)}" data-act="italie" type="button" aria-label="Retour en Petite Italie"></button>`,
  arrive:()=>{if(!S.pa.intro)anatoleIntro();else paStory()},
  news:(d,st,prev,news,e)=>{
    if(PA_DUEL[d]&&st){const f=duelScore(d);
      if(e>=f&&!S.pa.duel[d]){S.pa.duel[d]=1;S.coins+=40;news.push(itRow(foxSVG(FOX.firmin,{pose:"sit"}),d===20?"Tu as gagné la finale !":"Tu as battu Firmin !",`${e} pièces contre ${f}. +40 pièces, et une scène t'attend sur la carte du quartier.`,"background:#fde8ec"))}
      else if(!S.pa.duel[d])news.push(itRow(foxSVG(FOX.firmin,{pose:"happy"}),"Firmin a gagné ce défi…",`Il a fait ${f} pièces, toi ${e}. Rejoue cette journée pour le battre.`,"background:#fde8ec"))}
    else if(st&&!prev&&PA_SCENES[d])news.push(itRow(foxSVG(FOX.anatole,{pose:"happy"}),"Anatole a quelque chose à te raconter","Une scène t'attend sur la carte du quartier.","background:#fbf3dc"))}
};
// le monde affiché au chargement (le dernier visité, s'il est ouvert)
WORLD=WORLDS[S.world]&&WORLDS[S.world].isOpen()?S.world:"";
