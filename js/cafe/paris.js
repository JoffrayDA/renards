/* Café Frimousse : Paris, deuxième quartier de la Ville (04/11/2026, maquette validée par Joffray : tools/paris.html,
   renards sur tools/parisiens.html). 20 journées, comme la Petite Italie, avec son café, le Café Frimousse, et son équipement
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
const PA_DAYS=[{base:18,seed:7,goal:154},{base:19,seed:9,goal:173},{base:20,seed:2,goal:172},{base:21,seed:6,goal:197},{base:22,seed:7,goal:224},{base:23,seed:2,goal:230},{base:24,seed:7,goal:259},{base:25,seed:12,goal:278},{base:26,seed:5,goal:308},{base:27,seed:6,goal:323},{base:28,seed:14,goal:339},{base:29,seed:15,goal:358},{base:30,seed:13,goal:381},{base:31,seed:13,goal:402},{base:32,seed:7,goal:433},{base:33,seed:15,goal:462},{base:34,seed:9,goal:450},{base:36,seed:13,goal:463},{base:38,seed:5,goal:442},{base:40,seed:14,goal:456}];
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
  // madeleine (refaite le 04/11/2026, Joffray : « on dirait une coquille Saint-Jacques » ; version B de tools/madeleine.html)
  "cookie@paris":`<ellipse cx="20" cy="30" rx="18" ry="5.4" fill="#fff" stroke="#e6d3c4" stroke-width="1.4" stroke-dasharray="2.4 1.6"/>
     <g transform="translate(0 -3)"><path d="M34.4 19.2 Q38 19.6 38 21 Q38 22.4 34.4 22.8Z" fill="#c97a30" ${KB}/><path d="M36.0 21.0 L36.0 21.2 L36.0 21.4 L35.9 21.6 L35.8 21.8 L35.8 22.0 L35.6 22.2 L35.5 22.4 L35.4 22.6 L35.2 22.8 L35.0 23.1 L34.8 23.3 L34.6 23.6 L34.3 23.8 L34.1 24.1 L33.8 24.4 L33.5 24.7 L33.2 25.0 L32.9 25.3 L32.5 25.6 L32.2 25.9 L31.8 26.2 L31.4 26.5 L31.0 26.9 L30.6 27.2 L30.1 27.5 L29.7 27.9 L29.2 28.2 L28.8 28.5 L28.1 28.6 L27.8 29.1 L27.4 29.6 L26.9 30.0 L26.4 30.3 L25.8 30.5 L25.2 30.6 L24.6 30.7 L24.0 30.7 L23.5 31.2 L23.0 31.5 L22.5 31.8 L21.9 32.0 L21.3 32.0 L20.8 32.0 L20.2 31.8 L19.6 31.6 L19.0 31.8 L18.4 32.0 L17.9 32.1 L17.3 32.2 L16.7 32.1 L16.2 31.9 L15.7 31.6 L15.2 31.2 L14.6 31.3 L14.0 31.4 L13.4 31.4 L12.8 31.3 L12.3 31.1 L11.8 30.8 L11.4 30.5 L11.1 30.1 L10.6 29.9 L10.0 29.9 L9.4 29.8 L8.8 29.6 L8.4 29.4 L8.1 29.0 L7.8 28.6 L7.7 28.2 L7.4 27.9 L6.7 27.7 L6.2 27.5 L5.7 27.3 L5.4 27.0 L5.2 26.6 L5.1 26.2 L5.1 25.7 L5.1 25.3 L4.5 25.1 L4.0 24.8 L3.7 24.5 L3.5 24.1 L3.4 23.7 L3.5 23.3 L3.7 22.9 L3.9 22.5 L3.5 22.1 L3.1 21.8 L2.9 21.4 L2.8 21.0 L2.9 20.6 L3.1 20.2 L3.5 19.9 L3.9 19.5 L3.7 19.1 L3.5 18.7 L3.4 18.3 L3.5 17.9 L3.7 17.5 L4.0 17.2 L4.5 16.9 L5.1 16.7 L5.1 16.3 L5.1 15.8 L5.2 15.4 L5.4 15.0 L5.7 14.7 L6.2 14.5 L6.7 14.3 L7.4 14.1 L7.7 13.8 L7.8 13.4 L8.1 13.0 L8.4 12.6 L8.8 12.4 L9.4 12.2 L10.0 12.1 L10.6 12.1 L11.1 11.9 L11.4 11.5 L11.8 11.2 L12.3 10.9 L12.8 10.7 L13.4 10.6 L14.0 10.6 L14.6 10.7 L15.2 10.8 L15.7 10.4 L16.2 10.1 L16.7 9.9 L17.3 9.8 L17.9 9.9 L18.4 10.0 L19.0 10.2 L19.6 10.4 L20.2 10.2 L20.8 10.0 L21.3 10.0 L21.9 10.0 L22.5 10.2 L23.0 10.5 L23.5 10.8 L24.0 11.3 L24.6 11.3 L25.2 11.4 L25.8 11.5 L26.4 11.7 L26.9 12.0 L27.4 12.4 L27.8 12.9 L28.1 13.4 L28.8 13.5 L29.2 13.8 L29.7 14.1 L30.1 14.5 L30.6 14.8 L31.0 15.1 L31.4 15.5 L31.8 15.8 L32.2 16.1 L32.5 16.4 L32.9 16.7 L33.2 17.0 L33.5 17.3 L33.8 17.6 L34.1 17.9 L34.3 18.2 L34.6 18.4 L34.8 18.7 L35.0 18.9 L35.2 19.2 L35.4 19.4 L35.5 19.6 L35.6 19.8 L35.8 20.0 L35.8 20.2 L35.9 20.4 L36.0 20.6 L36.0 20.8 L36.0 21.0Z" fill="#c97a30" ${KB}/><path d="M33.6 21.0 L33.6 21.1 L33.6 21.3 L33.5 21.4 L33.5 21.6 L33.4 21.7 L33.3 21.9 L33.2 22.1 L33.1 22.2 L32.9 22.4 L32.8 22.6 L32.6 22.8 L32.4 23.0 L32.2 23.2 L32.0 23.4 L31.8 23.6 L31.6 23.8 L31.3 24.0 L31.0 24.3 L30.8 24.5 L30.5 24.7 L30.2 25.0 L29.8 25.2 L29.5 25.5 L29.2 25.7 L28.8 26.0 L28.4 26.2 L28.1 26.5 L27.7 26.7 L27.2 26.9 L26.9 27.2 L26.5 27.5 L26.2 27.8 L25.7 28.0 L25.3 28.2 L24.8 28.3 L24.3 28.4 L23.8 28.5 L23.4 28.8 L23.0 29.0 L22.6 29.2 L22.1 29.3 L21.6 29.4 L21.1 29.4 L20.7 29.3 L20.2 29.2 L19.7 29.3 L19.3 29.4 L18.8 29.5 L18.3 29.5 L17.8 29.4 L17.4 29.3 L17.0 29.1 L16.6 28.9 L16.1 28.9 L15.6 28.9 L15.1 28.9 L14.7 28.8 L14.2 28.7 L13.9 28.5 L13.5 28.2 L13.2 28.0 L12.8 27.9 L12.3 27.8 L11.9 27.7 L11.5 27.5 L11.1 27.3 L10.8 27.1 L10.6 26.8 L10.4 26.5 L10.1 26.3 L9.7 26.2 L9.3 26.0 L8.9 25.8 L8.7 25.5 L8.5 25.2 L8.4 24.9 L8.3 24.6 L8.2 24.3 L7.8 24.1 L7.5 23.9 L7.3 23.6 L7.1 23.4 L7.0 23.1 L7.1 22.8 L7.1 22.4 L7.2 22.1 L7.0 21.9 L6.8 21.6 L6.6 21.3 L6.6 21.0 L6.6 20.7 L6.8 20.4 L7.0 20.1 L7.2 19.9 L7.1 19.6 L7.1 19.2 L7.0 18.9 L7.1 18.6 L7.3 18.4 L7.5 18.1 L7.8 17.9 L8.2 17.7 L8.3 17.4 L8.4 17.1 L8.5 16.8 L8.7 16.5 L8.9 16.2 L9.3 16.0 L9.7 15.8 L10.1 15.7 L10.4 15.5 L10.6 15.2 L10.8 14.9 L11.1 14.7 L11.5 14.5 L11.9 14.3 L12.3 14.2 L12.8 14.1 L13.2 14.0 L13.5 13.8 L13.9 13.5 L14.2 13.3 L14.7 13.2 L15.1 13.1 L15.6 13.1 L16.1 13.1 L16.6 13.1 L17.0 12.9 L17.4 12.7 L17.8 12.6 L18.3 12.5 L18.8 12.5 L19.3 12.6 L19.7 12.7 L20.2 12.8 L20.7 12.7 L21.1 12.6 L21.6 12.6 L22.1 12.7 L22.6 12.8 L23.0 13.0 L23.4 13.2 L23.8 13.5 L24.3 13.6 L24.8 13.7 L25.3 13.8 L25.7 14.0 L26.2 14.2 L26.5 14.5 L26.9 14.8 L27.2 15.1 L27.7 15.3 L28.1 15.5 L28.4 15.8 L28.8 16.0 L29.2 16.3 L29.5 16.5 L29.8 16.8 L30.2 17.0 L30.5 17.3 L30.8 17.5 L31.0 17.7 L31.3 18.0 L31.6 18.2 L31.8 18.4 L32.0 18.6 L32.2 18.8 L32.4 19.0 L32.6 19.2 L32.8 19.4 L32.9 19.6 L33.1 19.8 L33.2 19.9 L33.3 20.1 L33.4 20.3 L33.5 20.4 L33.5 20.6 L33.6 20.7 L33.6 20.9 L33.6 21.0Z" fill="#f2b862"/>
     <path d="M33 21 Q20 17.5 9.8 14.4 M33 21 Q20 18.6 9.3 16.5 M33 21 Q20 19.9 8.9 18.8 M33 21 Q20 21.0 8.4 21.0 M33 21 Q20 22.1 8.9 23.2 M33 21 Q20 23.4 9.3 25.5 M33 21 Q20 24.5 9.8 27.6" stroke="#d48f3e" stroke-width="1.3" fill="none" stroke-linecap="round"/>
     <path d="M9 14.2 Q13 12.6 17.4 12.8" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".85"/></g>`,
  "choco@paris":`<path d="M12 13 H28 L26.5 36 H13.5Z" fill="#eef7fb" ${K}/><path d="M12.6 22 H27.4 L26.5 35 H13.5Z" fill="#8a5a3a"/><path d="M12.8 19 H27.2 L27 22 H13Z" fill="#c99a70"/><path d="M12 13 H28 L26.5 36 H13.5Z" fill="none" ${K}/><path d="M26 15 L31 4" ${K}/><ellipse cx="31.4" cy="3.6" rx="2" ry="1.2" fill="#fff" ${K2}/>`,
  "smoothie@paris":paBoxSVG("fvc"),
  // éclair (refait le 04/11/2026 dans le style du pain au chocolat ; version B de tools/eclair.html, choix de Joffray)
  "gateau@paris":`<path d="M9 15.6 H31 Q37.4 15.6 37.4 22.4 Q37.4 29.4 31 29.4 H9 Q2.6 29.4 2.6 22.4 Q2.6 15.6 9 15.6Z" fill="#d98a3a" ${KB}/>
     <path d="M5 26.4 Q20 28.6 35 26.4" stroke="#a65a1e" stroke-width="1.3" fill="none"/>
     <path d="M9 27.8 l1 -1.6 M15 28.4 l1 -1.6 M21 28.6 l1 -1.6 M27 28.4 l1 -1.6" stroke="#eba85a" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M3.4 20.4 Q4 15.6 9 15.6 H31 Q36.2 15.6 36.6 20.4 Q35 23 33 21.4 Q31.4 24.8 29 22 Q26.6 23.8 24.2 22 Q22 25 19.6 22.2 Q17 23.8 14.8 22 Q12.4 24.6 10.4 21.8 Q8 23.4 6.2 21.4 Q4.6 22.4 3.4 20.4Z" fill="#5a3324" ${KB}/>
     <path d="M8 18 Q14 16.8 21 17.2" stroke="#a9765c" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="24.4" cy="17.6" r="1" fill="#fff" opacity=".8"/>`,
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

/* ---------- la carte du quartier : de l'entrée en bas au Café Frimousse en haut, chaque lieu une fois ---------- */
// la rue (jours 1-5), la Seine et Notre-Dame (entre 5 et 6), le Champ-de-Mars et la tour Eiffel (7-12), Montmartre (13-18), le café (19-20)
const PA_X=[200,120,110,200,290,300,210,110,100,150,110,190,280,300,230,290,300,220,130,200];
function paLayout(){
  const P=[];for(let d=1;d<=PA_DAYS.length;d++)P[d]={d,x:PA_X[d-1],u:230+(d-1)*96};
  const top=P[PA_DAYS.length].u,H=top+380,way=[{x:200,u:60},...P.slice(1),{x:200,u:top+160}];
  return {P,way,H,guest:{x:322,u:P[PA_DAYS.length].u+14},ana:{x:pathX(way,150)<200?300:100,u:120},cafe:{x:200,u:top+190},seine:(P[5].u+P[6].u)/2};
}
/* les dessins de la carte, refaits le 04/11/2026 (Joffray : « la map est ignoble » à côté de la Clairière) : dégradés, volumes,
   ombres douces, détails ; chaque monument une seule fois. Les dégradés sont dans les defs de paMapSVG (ids "pa-…"). */
const PA_DEFS=`<linearGradient id="pa-stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fbf3e2"/><stop offset=".6" stop-color="#f1e4cb"/><stop offset="1" stop-color="#dccbac"/></linearGradient>
  <linearGradient id="pa-stoneV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf3e2"/><stop offset="1" stop-color="#e2d3b6"/></linearGradient>
  <linearGradient id="pa-zinc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c6d6"/><stop offset="1" stop-color="#8c9cb0"/></linearGradient>
  <linearGradient id="pa-iron" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d0a27a"/><stop offset=".45" stop-color="#b4855c"/><stop offset="1" stop-color="#8a6242"/></linearGradient>
  <pattern id="pa-lattice" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0 L7 7 M7 0 L0 7" stroke="#6e4d33" stroke-width=".9" opacity=".55"/></pattern>
  <radialGradient id="pa-white" cx=".32" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f6f2ea"/><stop offset="1" stop-color="#ddd5c6"/></radialGradient>
  <linearGradient id="pa-whiteV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f3eee4"/><stop offset="1" stop-color="#ddd4c4"/></linearGradient>
  <radialGradient id="pa-leaf" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#b6dc8e"/><stop offset=".7" stop-color="#86c070"/><stop offset="1" stop-color="#6aa65c"/></radialGradient>
  <radialGradient id="pa-leaf2" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#a6d48c"/><stop offset="1" stop-color="#5f9a5a"/></radialGradient>
  <linearGradient id="pa-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe8ac"/><stop offset="1" stop-color="#a9d48a"/></linearGradient>
  <linearGradient id="pa-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe09a"/><stop offset=".6" stop-color="#a5d184"/><stop offset="1" stop-color="#93c47a"/></linearGradient>
  <linearGradient id="pa-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6e0ee"/><stop offset=".5" stop-color="#8cc8de"/><stop offset="1" stop-color="#6fb2cc"/></linearGradient>
  <linearGradient id="pa-quai" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe5d2"/><stop offset="1" stop-color="#d4c4a6"/></linearGradient>
  <linearGradient id="pa-pit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a44"/><stop offset="1" stop-color="#2a1f26"/></linearGradient>
  <radialGradient id="pa-glow"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".95"/><stop offset=".45" stop-color="#ffd27a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
  <radialGradient id="pa-rose" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe08a"/><stop offset=".35" stop-color="#f49ab0"/><stop offset=".75" stop-color="#7fa6dc"/><stop offset="1" stop-color="#5a6fae"/></radialGradient>`;
const BO2=`stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
// un arbre : tronc, feuillage en boules dégradées, un reflet
const paTree=(x,y,k=1,g="pa-leaf")=>shadow(x,y,16*k)+`<path d="M${x-3*k} ${y} Q${x-2*k} ${y-12*k} ${x-1*k} ${y-18*k} H${x+2*k} Q${x+3*k} ${y-10*k} ${x+4*k} ${y}Z" fill="#9a6e4a" ${BO2}/>`
  +blob([[x-9*k,y-24*k,10*k],[x+8*k,y-25*k,10*k],[x,y-33*k,12*k]],`url(#${g})`)+`<circle cx="${x-5*k}" cy="${y-38*k}" r="${3.4*k}" fill="#fff" opacity=".35"/>`;
// le lampadaire parisien : fût vert sombre, lanterne à quatre vitres, une lueur
const paLamp=(x,y)=>shadow(x,y,8)+`<circle cx="${x}" cy="${y-44}" r="16" fill="url(#pa-glow)"/><path d="M${x-5} ${y} h10 l-2 -6 h-6Z" fill="#3f5a4a" ${BO2}/><path d="M${x} ${y-6} V${y-36}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M${x} ${y-6} V${y-36}" stroke="#4f6e5a" stroke-width="2"/>`
  +`<path d="M${x-6} ${y-36} H${x+6} L${x+4.5} ${y-49} H${x-4.5}Z" fill="#ffe9a8" ${BO2}/><path d="M${x} ${y-36} V${y-49}" stroke="${INK}" stroke-width="1"/><path d="M${x-5.5} ${y-49} L${x} ${y-55} L${x+5.5} ${y-49}Z" fill="#3f5a4a" ${BO2}/>`;
// l'immeuble haussmannien : pierre de taille, toit de zinc et lucarnes, balcons filants en fer forgé, boutique et son store
const paHaus=(x,y,w,h,shop="#c0485a")=>{let g=shadow(x+w/2,y+h,w*.55)+`<path d="M${x-3} ${y} L${x+7} ${y-24} H${x+w-7} L${x+w+3} ${y}Z" fill="url(#pa-zinc)" ${BO}/>`;
  for(let i=0;i<Math.floor((w-10)/22);i++)g+=`<path d="M${x+11+i*22} ${y-6} V${y-16} Q${x+15.5+i*22} ${y-21} ${x+20+i*22} ${y-16} V${y-6}Z" fill="#e6eef6" ${BO2}/>`;
  g+=`<rect x="${x+w-18}" y="${y-34}" width="9" height="12" fill="#d98a6a" ${BO2}/><rect x="${x+w-19}" y="${y-36}" width="11" height="3" fill="#b86a4e" ${BO2}/>`;
  g+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#pa-stone)" ${BO}/>`;
  const rows=Math.floor((h-26)/24);
  for(let j=0;j<rows;j++){const wy=y+7+j*24;g+=`<path d="M${x} ${wy-2} H${x+w}" stroke="#e2d2b2" stroke-width="1.2"/>`;
    for(let i=0;i<Math.floor((w-6)/20);i++){const wx=x+6+i*20;g+=`<rect x="${wx}" y="${wy}" width="11" height="16" rx="1.5" fill="#a8cce4" ${BO2}/><path d="M${wx+5.5} ${wy} V${wy+16} M${wx} ${wy+7} H${wx+11}" stroke="#e8f2f8" stroke-width="1"/>`}
    if(j===0||j===2)g+=`<path d="M${x+2} ${wy+12} H${x+w-2}" stroke="${INK}" stroke-width="2"/>`+Array.from({length:Math.floor((w-4)/4)},(_,i)=>`<path d="M${x+3+i*4} ${wy+12} V${wy+16}" stroke="${INK}" stroke-width="1"/>`).join("")}
  g+=`<rect x="${x}" y="${y+h-22}" width="${w}" height="22" fill="${shop}" ${BO}/><rect x="${x+5}" y="${y+h-14}" width="${w-10}" height="14" fill="#fdf3dc" ${BO2}/>`;
  g+=`<path d="M${x-2} ${y+h-22} H${x+w+2} L${x+w-1} ${y+h-15} H${x+1}Z" fill="#fff" ${BO2}/>`+Array.from({length:Math.floor(w/8)},(_,i)=>`<path d="M${x+1+i*8} ${y+h-22} h4 l-.6 7 h-4Z" fill="${shop}"/>`).join("");
  return g};
// la bouche de métro façon Guimard : rambarde verte en fer forgé, deux tiges recourbées qui portent des lampes orange, le panneau en arc
const paMetro=(x,y)=>{const st=(d)=>`<path d="${d}" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#4f8a6a" stroke-width="3" stroke-linecap="round"/>`;
  return shadow(x,y+2,34)+`<path d="M${x-22} ${y} L${x-18} ${y-10} H${x+18} L${x+22} ${y}Z" fill="url(#pa-pit)" ${BO2}/>`+[0,1,2].map(i=>`<path d="M${x-19+i*1.4} ${y-7+i*3} H${x+19-i*1.4}" stroke="#6a5a64" stroke-width="1"/>`).join("")
    +st(`M${x-24} ${y} V${y-9} Q${x-24} ${y-13} ${x-19} ${y-13} H${x+19} Q${x+24} ${y-13} ${x+24} ${y-9} V${y}`)
    +[-16,-8,0,8,16].map(o=>`<path d="M${x+o} ${y-13} q-2.4 4 0 7 q2.4 3 0 6" fill="none" stroke="#4f8a6a" stroke-width="1.6"/>`).join("")
    +st(`M${x-22} ${y-10} Q${x-26} ${y-40} ${x-18} ${y-56} Q${x-12} ${y-64} ${x-6} ${y-60}`)+st(`M${x+22} ${y-10} Q${x+26} ${y-40} ${x+18} ${y-56} Q${x+12} ${y-64} ${x+6} ${y-60}`)
    +[[-6,-60],[6,-60]].map(([a,b])=>`<circle cx="${x+a}" cy="${y+b+3}" r="13" fill="url(#pa-glow)"/><ellipse cx="${x+a}" cy="${y+b+3}" rx="4" ry="5.6" fill="#f5953e" ${BO2}/><ellipse cx="${x+a-1.2}" cy="${y+b+1}" rx="1.2" ry="2" fill="#ffd9a0"/>`).join("")
    +`<path d="M${x-24} ${y-33} Q${x} ${y-45} ${x+24} ${y-33} L${x+23} ${y-25} Q${x} ${y-36} ${x-23} ${y-25}Z" fill="#f4ecd0" ${BO2}/><path id="pa-mt" d="M${x-21} ${y-28.4} Q${x} ${y-39.6} ${x+21} ${y-28.4}" fill="none"/><text font-size="4.3" font-weight="900" fill="#3f7a5a"><textPath href="#pa-mt" startOffset="50%" text-anchor="middle">MÉTROPOLITAIN</textPath></text>`};
// la colonne Morris : cylindre vert ombré, affiches, coupole et son petit dôme
const paMorris=(x,y)=>shadow(x,y,16)+`<rect x="${x-12}" y="${y-48}" width="24" height="48" fill="#4f8a6a" ${BO}/><rect x="${x+4}" y="${y-48}" width="8" height="48" fill="#3c6e54"/>`
  +`<rect x="${x-9}" y="${y-42}" width="8" height="13" fill="#f49ab0" ${BO2}/><rect x="${x}" y="${y-40}" width="8" height="11" fill="#ffe08a" ${BO2}/><rect x="${x-7}" y="${y-25}" width="13" height="13" fill="#bfe1f0" ${BO2}/><path d="M${x-5} ${y-20} h8 M${x-5} ${y-17} h6" stroke="#5f7fb0" stroke-width="1"/>`
  +`<path d="M${x-15} ${y-48} H${x+15} Q${x+11} ${y-62} ${x} ${y-64} Q${x-11} ${y-62} ${x-15} ${y-48}Z" fill="#4f8a6a" ${BO}/><path d="M${x-9} ${y-52} Q${x-5} ${y-60} ${x} ${y-61}" stroke="#7fb89a" stroke-width="1.6" fill="none"/><circle cx="${x}" cy="${y-66}" r="3" fill="#4f8a6a" ${BO2}/>`;
// la terrasse : guéridon rond et chaises bistrot en rotin
const paTable=(x,y)=>shadow(x,y,28)+`<path d="M${x} ${y} V${y-15}" ${BO2}/><ellipse cx="${x}" cy="${y-16}" rx="12" ry="4" fill="#fff" ${BO2}/><ellipse cx="${x}" cy="${y}" rx="6" ry="1.8" fill="${INK}"/>`
  +[-18,18].map(o=>`<path d="M${x+o-6} ${y} V${y-11} M${x+o+6} ${y} V${y-11}" stroke="#a8703e" stroke-width="2.6"/><rect x="${x+o-8}" y="${y-13}" width="16" height="5" rx="2" fill="#d9a46a" ${BO2}/><path d="M${x+o-5} ${y-11} h10" stroke="#f2c894" stroke-width="1"/><path d="M${x+o+(o<0?-8:8)} ${y-11} V${y-25} Q${x+o} ${y-30} ${x+o-(o<0?-8:8)} ${y-25}" fill="none" stroke="${INK}" stroke-width="4.2"/><path d="M${x+o+(o<0?-8:8)} ${y-11} V${y-25} Q${x+o} ${y-30} ${x+o-(o<0?-8:8)} ${y-25}" fill="none" stroke="#c48a52" stroke-width="2.4"/>`).join("")
  +`<rect x="${x-4}" y="${y-22}" width="5" height="6" rx="1.4" fill="#fff" ${BO2}/><circle cx="${x+4}" cy="${y-19}" r="2.6" fill="#f2707e" stroke="${INK}" stroke-width="1"/>`;
const paBouq=(x,y)=>shadow(x+17,y,22)+`<rect x="${x}" y="${y-13}" width="34" height="13" fill="#3f7a5a" ${BO2}/><path d="M${x-2} ${y-13} L${x+3} ${y-27} H${x+31} L${x+36} ${y-13}" fill="#4f8a6a" ${BO2}/><path d="M${x+5} ${y-24} H${x+29}" stroke="#7fb89a" stroke-width="1.2"/>`
  +[0,1,2,3,4].map(i=>`<rect x="${x+3+i*6}" y="${y-12}" width="5" height="8" rx=".8" fill="${["#f49ab0","#ffe08a","#bfe1f0","#fff","#b99ad8"][i]}" stroke="${INK}" stroke-width="1"/>`).join("");
const paEasel=(x,y,c)=>shadow(x,y,11)+`<path d="M${x-9} ${y} L${x} ${y-32} L${x+9} ${y} M${x} ${y-32} V${y}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M${x-9} ${y} L${x} ${y-32} L${x+9} ${y} M${x} ${y-32} V${y}" stroke="#c49a6a" stroke-width="2" stroke-linecap="round"/>`
  +`<rect x="${x-11}" y="${y-33}" width="22" height="17" fill="#fffaf0" ${BO2}/><rect x="${x-9}" y="${y-31}" width="18" height="13" fill="#bfe1f0"/><path d="M${x-9} ${y-22} Q${x-3} ${y-29} ${x+2} ${y-24} T${x+9} ${y-23} V${y-18} H${x-9}Z" fill="${c}"/><circle cx="${x+5}" cy="${y-27}" r="2.2" fill="#ffd36a"/>`;
const paBench=(x,y)=>shadow(x,y,26)+`<path d="M${x-21} ${y} v-11 M${x+21} ${y} v-11" stroke="${INK}" stroke-width="2.6"/><rect x="${x-25}" y="${y-14}" width="50" height="5" rx="2" fill="#4f8a6a" ${BO2}/><rect x="${x-25}" y="${y-25}" width="50" height="7" rx="2.5" fill="#4f8a6a" ${BO2}/><path d="M${x-22} ${y-23} h44" stroke="#7fb89a" stroke-width="1.2"/>`;
// Notre-Dame sur l'île de la Cité : quais de pierre, arbres, la façade (deux tours, galerie, rosace, portails), la nef et la flèche
const paNotreDame=(x,y)=>{let g=`<path d="M${x-96} ${y+8} Q${x-98} ${y-6} ${x-80} ${y-8} H${x+86} Q${x+104} ${y-6} ${x+100} ${y+8} Q${x+96} ${y+24} ${x+70} ${y+26} H${x-70} Q${x-94} ${y+24} ${x-96} ${y+8}Z" fill="url(#pa-quai)" ${BO}/>`
  +`<path d="M${x-90} ${y+14} Q${x} ${y+22} ${x+94} ${y+14}" stroke="#c8b694" stroke-width="1.4" fill="none"/>`+[-70,-40,-10,20,50,80].map(o=>`<path d="M${x+o} ${y+16} v8" stroke="#c8b694" stroke-width="1.2"/>`).join("");
  g+=paTree(x-74,y+2,.62,"pa-leaf2")+paTree(x+80,y+2,.62,"pa-leaf2");
  // la nef, derrière la façade, qui file vers l'est (à droite), et la flèche à la croisée
  g+=`<path d="M${x+20} ${y-52} L${x+64} ${y-48} L${x+64} ${y-2} H${x+20}Z" fill="url(#pa-stone)" ${BO}/><path d="M${x+18} ${y-52} L${x+42} ${y-70} L${x+66} ${y-48}Z" fill="url(#pa-zinc)" ${BO}/>`
    +[28,40,52].map(o=>`<path d="M${x+o} ${y-4} V${y-28} Q${x+o+4} ${y-34} ${x+o+8} ${y-28} V${y-4}" fill="#8aa0c4" ${BO2}/>`).join("")
    +[24,60].map(o=>`<path d="M${x+o} ${y-2} L${x+o+6} ${y-40}" stroke="${INK}" stroke-width="2.4"/>`).join("")
    +`<path d="M${x+42} ${y-70} L${x+39} ${y-78} L${x+42} ${y-126} L${x+45} ${y-78}Z" fill="url(#pa-zinc)" ${BO2}/><path d="M${x+42} ${y-126} V${y-134} M${x+39.5} ${y-131} H${x+44.5}" stroke="${INK}" stroke-width="1.8"/>`
    +[-90,-100,-110].map(b=>`<path d="M${x+40} ${y+b} h4" stroke="${INK}" stroke-width="1"/>`).join("");
  // la façade : tours, partie centrale, ombre à droite
  const T=(a)=>`<rect x="${x+a}" y="${y-104}" width="30" height="104" fill="url(#pa-stone)" ${BO}/>`
    +`<path d="M${x+a-2} ${y-104} H${x+a+32}" stroke="${INK}" stroke-width="3"/>`+[0,1,2,3,4,5].map(i=>`<rect x="${x+a+1+i*5}" y="${y-109}" width="3" height="5" fill="url(#pa-stoneV)" stroke="${INK}" stroke-width="1"/>`).join("")
    +[6,17].map(o=>`<path d="M${x+a+o} ${y-64} V${y-90} Q${x+a+o+3.5} ${y-97} ${x+a+o+7} ${y-90} V${y-64}Z" fill="#6f6478" ${BO2}/>`+[0,1,2,3].map(i=>`<path d="M${x+a+o+1} ${y-86+i*5.5} h5" stroke="#9a8fa6" stroke-width="1"/>`).join("")).join("");
  g+=`<rect x="${x-18}" y="${y-74}" width="36" height="74" fill="url(#pa-stoneV)" ${BO}/>`+T(-48)+T(18);
  // la galerie des chimères, la rosace, la galerie des rois, les trois portails
  g+=`<path d="M${x-48} ${y-60} H${x+48}" stroke="${INK}" stroke-width="2"/>`+Array.from({length:16},(_,i)=>`<path d="M${x-46+i*6} ${y-60} v-6 q2 -3 4 0 v6" fill="#d9ccb2" stroke="${INK}" stroke-width=".9"/>`).join("");
  g+=`<circle cx="${x}" cy="${y-42}" r="13" fill="url(#pa-rose)" ${BO}/>`+Array.from({length:12},(_,i)=>`<path d="M${x} ${y-42} L${x+Math.cos(i*Math.PI/6)*12} ${y-42+Math.sin(i*Math.PI/6)*12}" stroke="${INK}" stroke-width="1"/>`).join("")+`<circle cx="${x}" cy="${y-42}" r="5" fill="#ffe08a" stroke="${INK}" stroke-width="1.2"/><circle cx="${x}" cy="${y-42}" r="9" fill="none" stroke="${INK}" stroke-width=".9"/>`;
  g+=`<path d="M${x-48} ${y-24} H${x+48}" stroke="#cdbf9e" stroke-width="5"/><path d="M${x-48} ${y-26.5} H${x+48} M${x-48} ${y-21.5} H${x+48}" stroke="${INK}" stroke-width="1.2"/>`+Array.from({length:22},(_,i)=>`<circle cx="${x-46+i*4.4}" cy="${y-24}" r="1.2" fill="#8a7a6a"/>`).join("");
  g+=[[-33,10,17],[0,13,21],[33,10,17]].map(([o,w,h])=>`<path d="M${x+o-w} ${y} V${y-h*.55} Q${x+o-w} ${y-h} ${x+o} ${y-h-3} Q${x+o+w} ${y-h} ${x+o+w} ${y-h*.55} V${y}Z" fill="#e2d3b6" ${BO2}/><path d="M${x+o-w+3} ${y} V${y-h*.5} Q${x+o-w+3} ${y-h+4} ${x+o} ${y-h} Q${x+o+w-3} ${y-h+4} ${x+o+w-3} ${y-h*.5} V${y}Z" fill="#8a5a4a" ${BO2}/><path d="M${x+o} ${y} V${y-h*.5}" stroke="#5e3a30" stroke-width="1.2"/>`).join("");
  g+=`<rect x="${x+8}" y="${y-74}" width="10" height="74" fill="#000" opacity=".06"/><rect x="${x+38}" y="${y-104}" width="10" height="104" fill="#000" opacity=".07"/>`;
  return g};
// la tour Eiffel : quatre pieds en arc, treillis de fer, deux étages et leurs rambardes, le sommet et son phare
const paEiffel=(x,y,h)=>{const k=h/300,X=a=>(x+a*k).toFixed(1),Y=b=>(y-b*k).toFixed(1);
  const out=`M${X(-74)} ${Y(0)} C${X(-60)} ${Y(40)} ${X(-40)} ${Y(78)} ${X(-34)} ${Y(96)} L${X(-30)} ${Y(104)} C${X(-26)} ${Y(126)} ${X(-20)} ${Y(140)} ${X(-17)} ${Y(158)} L${X(-14)} ${Y(164)} L${X(-4)} ${Y(262)} L${X(0)} ${Y(282)} L${X(4)} ${Y(262)} L${X(14)} ${Y(164)} L${X(17)} ${Y(158)} C${X(20)} ${Y(140)} ${X(26)} ${Y(126)} ${X(30)} ${Y(104)} L${X(34)} ${Y(96)} C${X(40)} ${Y(78)} ${X(60)} ${Y(40)} ${X(74)} ${Y(0)} H${X(48)} C${X(40)} ${Y(30)} ${X(24)} ${Y(58)} ${X(0)} ${Y(60)} C${X(-24)} ${Y(58)} ${X(-40)} ${Y(30)} ${X(-48)} ${Y(0)}Z`;
  const id="pa-eif";
  let g=`<ellipse cx="${x}" cy="${y+2}" rx="${82*k}" ry="${12*k}" fill="rgba(91,66,80,.14)"/>`+`<clipPath id="${id}"><path d="${out}"/></clipPath><path d="${out}" fill="url(#pa-iron)"/>`
    +`<g clip-path="url(#${id})"><rect x="${X(-80)}" y="${Y(290)}" width="${160*k}" height="${290*k}" fill="url(#pa-lattice)"/><path d="M${X(-60)} ${Y(4)} C${X(-46)} ${Y(44)} ${X(-34)} ${Y(80)} ${X(-28)} ${Y(100)}" stroke="#e8c49a" stroke-width="${3*k}" fill="none" opacity=".7"/></g><path d="${out}" fill="none" ${BO}/>`;
  // l'arc entre les pieds, souligné
  g+=`<path d="M${X(-48)} ${Y(0)} C${X(-40)} ${Y(30)} ${X(-24)} ${Y(58)} ${X(0)} ${Y(60)} C${X(24)} ${Y(58)} ${X(40)} ${Y(30)} ${X(48)} ${Y(0)}" fill="none" stroke="#7a5638" stroke-width="${2.4*k}"/>`;
  // premier étage, deuxième étage, avec leurs rambardes
  const deck=(a,b,hh)=>`<rect x="${X(-a)}" y="${Y(b+hh)}" width="${2*a*k}" height="${hh*k}" rx="1.5" fill="#c99a72" ${BO2}/>`+Array.from({length:Math.floor(a/4)},(_,i)=>`<path d="M${X(-a+4+i*8)} ${Y(b+hh)} v${-5*k}" stroke="${INK}" stroke-width="1"/>`).join("")+`<path d="M${X(-a)} ${Y(b+hh+5)} H${X(a)}" stroke="${INK}" stroke-width="1.4"/>`;
  g+=deck(38,96,10)+deck(19,158,8);
  // le sommet, le phare, le drapeau
  g+=`<rect x="${X(-6)}" y="${Y(270)}" width="${12*k}" height="${9*k}" rx="1.5" fill="#c99a72" ${BO2}/><path d="M${x} ${Y(270)} V${Y(300)}" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${Y(292)}" r="${10*k}" fill="url(#pa-glow)"/><circle cx="${x}" cy="${Y(292)}" r="${2.4*k}" fill="#ffe9a8" stroke="${INK}" stroke-width="1"/><path d="M${x} ${Y(300)} l${9*k} ${3*k} l${-9*k} ${3*k}Z" fill="#e2546e" stroke="${INK}" stroke-width="1"/>`;
  return g};
// le Sacré-Cœur, tout blanc en haut de la butte : marches, porche à trois arches, dômes en ogive à côtes, campanile derrière
const paSacre=(x,y,k=1)=>{const X=a=>(x+a*k).toFixed(1),Y=b=>(y+b*k).toFixed(1);
  const dome=(cx,base,w,hh,lant)=>`<path d="M${X(cx-w)} ${Y(base)} Q${X(cx-w)} ${Y(base-hh*.75)} ${X(cx)} ${Y(base-hh)} Q${X(cx+w)} ${Y(base-hh*.75)} ${X(cx+w)} ${Y(base)}Z" fill="url(#pa-white)" ${BO}/>`
    +[-.5,0,.5].map(f=>`<path d="M${X(cx+w*f*1.15)} ${Y(base)} Q${X(cx+w*f*.8)} ${Y(base-hh*.7)} ${X(cx)} ${Y(base-hh)}" fill="none" stroke="#d8cfbf" stroke-width="1.2"/>`).join("")
    +`<rect x="${X(cx-lant*.5)}" y="${Y(base-hh-lant*1.4)}" width="${lant*k}" height="${lant*1.4*k}" fill="url(#pa-whiteV)" ${BO2}/><path d="M${X(cx-lant*.7)} ${Y(base-hh-lant*1.4)} Q${X(cx)} ${Y(base-hh-lant*2.4)} ${X(cx+lant*.7)} ${Y(base-hh-lant*1.4)}Z" fill="url(#pa-white)" ${BO2}/><path d="M${X(cx)} ${Y(base-hh-lant*2.4)} v${-4*k} M${X(cx-1.6)} ${Y(base-hh-lant*2.4-2.4)} h${3.2*k}" stroke="${INK}" stroke-width="1.6"/>`;
  let g=shadow(x,y+4,62*k);
  // le campanile, derrière à droite
  g+=`<rect x="${X(34)}" y="${Y(-118)}" width="${16*k}" height="${80*k}" fill="url(#pa-whiteV)" ${BO}/><path d="M${X(37)} ${Y(-104)} v${10*k} q${2.5*k} ${-4*k} ${5*k} 0 v${-10*k}" fill="#bcd8ea" stroke="${INK}" stroke-width="1"/>`+dome(42,-118,9,16,4);
  // marches, corps, porche
  g+=Array.from({length:4},(_,i)=>`<rect x="${X(-56+i*4)}" y="${Y(-4-i*4)}" width="${(112-i*8)*k}" height="${4.4*k}" fill="#efe8dc" stroke="${INK}" stroke-width="1.4"/>`).join("");
  g+=`<rect x="${X(-46)}" y="${Y(-52)}" width="${92*k}" height="${36*k}" fill="url(#pa-whiteV)" ${BO}/>`+[-28,0,28].map(o=>`<path d="M${X(o-8)} ${Y(-16)} V${Y(-30)} Q${X(o-8)} ${Y(-40)} ${X(o)} ${Y(-41)} Q${X(o+8)} ${Y(-40)} ${X(o+8)} ${Y(-30)} V${Y(-16)}Z" fill="#c9bfae" ${BO2}/><path d="M${X(o-5)} ${Y(-16)} V${Y(-29)} Q${X(o)} ${Y(-36)} ${X(o+5)} ${Y(-29)} V${Y(-16)}Z" fill="#7a6a72"/>`).join("")
    +`<path d="M${X(-48)} ${Y(-52)} H${X(48)}" stroke="${INK}" stroke-width="2.6"/>`+[-36,-12,12,36].map(o=>`<path d="M${X(o)} ${Y(-44)} v${6*k}" stroke="#d8cfbf" stroke-width="1.2"/>`).join("");
  // les petits dômes des coins et du porche, le tambour à fenêtres, le grand dôme
  g+=dome(-40,-52,9,18,3.6)+dome(40,-52,9,18,3.6);
  g+=`<rect x="${X(-21)}" y="${Y(-80)}" width="${42*k}" height="${28*k}" fill="url(#pa-whiteV)" ${BO}/>`+[-14,-5,4,13].map(o=>`<path d="M${X(o-2.4)} ${Y(-56)} v${-14*k} q${2.4*k} ${-4*k} ${4.8*k} 0 v${14*k}Z" fill="#a8cce4" stroke="${INK}" stroke-width="1.1"/>`).join("")+`<path d="M${X(-23)} ${Y(-80)} H${X(23)}" stroke="${INK}" stroke-width="2.2"/>`;
  g+=dome(0,-80,22,46,6);
  g+=`<rect x="${X(26)}" y="${Y(-52)}" width="${20*k}" height="${36*k}" fill="#000" opacity=".05"/>`;
  return g};
// un escalier de Montmartre, avec sa rampe et ses lampadaires
const paStairs=(x,y)=>Array.from({length:8},(_,i)=>`<rect x="${x+i*3.6}" y="${y-i*11}" width="28" height="11" fill="${i%2?"#efe6d8":"#e6dccb"}" stroke="${INK}" stroke-width="1.6"/>`).join("")+`<path d="M${x-4} ${y+8} L${x+24} ${y-84}" stroke="${INK}" stroke-width="2.4"/><path d="M${x+33} ${y+8} L${x+60} ${y-84}" stroke="${INK}" stroke-width="2.4"/>`;
// le moulin de la butte, ailes en croix
const paMill=(x,y)=>shadow(x,y,20)+`<path d="M${x-14} ${y} L${x-11} ${y-34} H${x+11} L${x+14} ${y}Z" fill="#e8d6b8" ${BO}/><path d="M${x-14} ${y-34} L${x} ${y-50} L${x+14} ${y-34}Z" fill="#c0485a" ${BO}/><rect x="${x-4}" y="${y-14}" width="8" height="14" rx="3" fill="#8a5a4a" ${BO2}/>`
  +`<g transform="translate(${x} ${y-36})"><g><animateTransform attributeName="transform" type="rotate" values="0;360" dur="18s" repeatCount="indefinite"/>${[0,90,180,270].map(a=>`<g transform="rotate(${a})"><rect x="-3" y="-30" width="6" height="26" fill="#fff8ec" stroke="${INK}" stroke-width="1.6"/><path d="M-3 -24 h6 M-3 -18 h6 M-3 -12 h6 M0 -30 V-4" stroke="#c9b8a0" stroke-width=".9"/></g>`).join("")}</g><circle r="3" fill="#8a5a4a" stroke="${INK}" stroke-width="1.6"/></g>`;
// la fontaine Wallace : fonte vert sombre, quatre colonnes, petite coupole, un filet d'eau
const paWallace=(x,y)=>shadow(x,y,14)+`<rect x="${x-11}" y="${y-8}" width="22" height="8" rx="2" fill="#3f6a52" ${BO2}/>`+[-7,-2.4,2.4,7].map(o=>`<path d="M${x+o} ${y-8} V${y-30}" stroke="${INK}" stroke-width="3.4"/><path d="M${x+o} ${y-8} V${y-30}" stroke="#4f8a6a" stroke-width="1.6"/>`).join("")
  +`<path d="M${x} ${y-30} V${y-9}" stroke="#bfe6f4" stroke-width="1.4"/><rect x="${x-11}" y="${y-34}" width="22" height="5" rx="1.5" fill="#3f6a52" ${BO2}/><path d="M${x-10} ${y-34} Q${x} ${y-48} ${x+10} ${y-34}Z" fill="#4f8a6a" ${BO2}/><circle cx="${x}" cy="${y-49}" r="2.2" fill="#4f8a6a" stroke="${INK}" stroke-width="1.2"/><path d="M${x-5} ${y-39} Q${x-2} ${y-43} ${x+1} ${y-43}" stroke="#8cc4a6" stroke-width="1.2" fill="none"/>`;
// la charrette du fleuriste, son parasol rayé
const paFlowers=(x,y)=>shadow(x,y,26)+`<circle cx="${x-14}" cy="${y-5}" r="5.4" fill="#8a5a4a" ${BO2}/><circle cx="${x+14}" cy="${y-5}" r="5.4" fill="#8a5a4a" ${BO2}/><rect x="${x-22}" y="${y-20}" width="44" height="12" rx="2" fill="#c98a5a" ${BO2}/><path d="M${x-20} ${y-14} h40" stroke="#e8b07a" stroke-width="1.2"/>`
  +[[-14,"#f47f9a"],[-3,"#ffd36a"],[8,"#b99ad8"],[17,"#f49ab0"]].map(([o,c])=>`<path d="M${x+o-4} ${y-20} L${x+o-3} ${y-27} H${x+o+3} L${x+o+4} ${y-20}" fill="#7fa6c8" stroke="${INK}" stroke-width="1.2"/>`+[[-2,-30],[2,-31],[0,-34]].map(([a,b])=>`<circle cx="${x+o+a}" cy="${y+b}" r="2.6" fill="${c}" stroke="${INK}" stroke-width="1"/>`).join("")).join("")
  +`<path d="M${x+22} ${y-20} V${y-50}" stroke="${INK}" stroke-width="2"/><path d="M${x+2} ${y-46} Q${x+22} ${y-60} ${x+42} ${y-46}Z" fill="#fff" ${BO2}/><path d="M${x+12} ${y-50} Q${x+22} ${y-58} ${x+22} ${y-57} L${x+22} ${y-46}Z M${x+32} ${y-50} Q${x+22} ${y-58} ${x+22} ${y-57}" fill="#f47f9a"/>`;
// le manège : chapiteau rayé, mât, deux chevaux de bois qui montent et descendent
const paCarousel=(x,y)=>shadow(x,y,40)+`<ellipse cx="${x}" cy="${y-6}" rx="38" ry="9" fill="#f6e8d0" ${BO}/><path d="M${x-38} ${y-6} V${y} Q${x} ${y+10} ${x+38} ${y} V${y-6}" fill="#e2c9a2" ${BO2}/>`
  +[-24,0,24].map(o=>`<path d="M${x+o} ${y-8} V${y-50}" stroke="${INK}" stroke-width="3.6"/><path d="M${x+o} ${y-8} V${y-50}" stroke="#f2c94c" stroke-width="1.8"/>`).join("")
  +[[-24,0],[24,1.2]].map(([o,d])=>`<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="1.8s" begin="${d}s" repeatCount="indefinite"/><path d="M${x+o-9} ${y-22} Q${x+o-8} ${y-30} ${x+o} ${y-29} H${x+o+5} L${x+o+9} ${y-36} L${x+o+11} ${y-32} L${x+o+8} ${y-27} Q${x+o+9} ${y-20} ${x+o+3} ${y-20} H${x+o-6}Z" fill="#fff8ec" ${BO2}/><path d="M${x+o-5} ${y-20} v6 M${x+o+3} ${y-20} v6" stroke="${INK}" stroke-width="1.6"/><path d="M${x+o+5} ${y-34} q-3 -2 -6 1" stroke="#f47f9a" stroke-width="2" fill="none"/></g>`).join("")
  +`<path d="M${x-44} ${y-50} L${x} ${y-80} L${x+44} ${y-50}Z" fill="#fff" ${BO}/>`+[-1,1].map(sd=>`<path d="M${x} ${y-80} L${x+sd*44} ${y-50} L${x+sd*30} ${y-50}Z M${x} ${y-80} L${x+sd*14} ${y-50} L${x+sd*2} ${y-50}Z" fill="#e2546e"/>`).join("")
  +`<path d="M${x-44} ${y-50} L${x} ${y-80} L${x+44} ${y-50}Z" fill="none" ${BO}/><path d="M${x-44} ${y-50} ${Array.from({length:8},()=>"q5.5 6 11 0").join(" ")}" fill="#fff" ${BO2}/><path d="M${x} ${y-80} V${y-90}" stroke="${INK}" stroke-width="2"/><path d="M${x} ${y-90} l8 3 l-8 3Z" fill="#7fb4d8" stroke="${INK}" stroke-width="1"/>`;
// une petite maison de la butte, volets colorés
const paCottage=(x,y,c="#7fb4d8")=>shadow(x,y,18)+`<rect x="${x-16}" y="${y-24}" width="32" height="24" fill="#f6e8d0" ${BO}/><path d="M${x-19} ${y-23} L${x} ${y-38} L${x+19} ${y-23}Z" fill="#d9774e" ${BO}/>`
  +`<rect x="${x-10}" y="${y-18}" width="7" height="8" fill="#bcd8ea" ${BO2}/><rect x="${x-14}" y="${y-18}" width="3.4" height="8" fill="${c}" stroke="${INK}" stroke-width="1"/><rect x="${x-3}" y="${y-18}" width="3.4" height="8" fill="${c}" stroke="${INK}" stroke-width="1"/><rect x="${x+4}" y="${y-13}" width="7" height="13" rx="2" fill="#8a5a4a" ${BO2}/><circle cx="${x+13}" cy="${y-3}" r="3" fill="#f47f9a" stroke="${INK}" stroke-width="1"/>`;
const paPeniche=(x,y)=>`<path d="M${x-36} ${y} H${x+40} L${x+32} ${y+12} H${x-30}Z" fill="#c0485a" ${K}/><rect x="${x-24}" y="${y-12}" width="40" height="12" rx="3" fill="#fff4dc" ${K}/><rect x="${x-18}" y="${y-9}" width="7" height="6" rx="1.5" fill="#bcd8ea" stroke="${INK}" stroke-width="1"/><rect x="${x-6}" y="${y-9}" width="7" height="6" rx="1.5" fill="#bcd8ea" stroke="${INK}" stroke-width="1"/><circle cx="${x+24}" cy="${y-4}" r="3.2" fill="#f47f9a" ${K2}/><circle cx="${x+30}" cy="${y-5}" r="3" fill="#ffd36a" ${K2}/>`;
function paCafeSVG(x,y){
  let s=shadow(x,y+4,104)+`<path d="M${x-114} ${y-110} L${x-102} ${y-134} H${x+102} L${x+114} ${y-110}Z" fill="#a9b6c6" ${BO}/>`+[0,1,2,3,4,5,6].map(i=>`<rect x="${x-86+i*26}" y="${y-129}" width="10" height="13" rx="4" fill="#e6eef6" ${K2}/>`).join("");
  s+=`<rect x="${x-110}" y="${y-110}" width="220" height="110" fill="#f6e8d0" ${BO}/>`+[0,1,2,3,4,5,6,7].map(i=>`<rect x="${x-98+i*26}" y="${y-102}" width="12" height="20" rx="2" fill="#bcd8ea" ${K2}/><path d="M${x-100+i*26} ${y-88} H${x-84+i*26}" stroke="${INK}" stroke-width="1.3"/>`).join("");
  s+=`<rect x="${x-110}" y="${y-68}" width="220" height="68" fill="#2f5a48" ${BO}/><rect x="${x-94}" y="${y-52}" width="70" height="48" rx="4" fill="#bcd8ea" ${K2}/><rect x="${x+24}" y="${y-52}" width="70" height="48" rx="4" fill="#bcd8ea" ${K2}/><rect x="${x-16}" y="${y-52}" width="32" height="52" rx="4" fill="#a8664a" ${BO}/><circle cx="${x+10}" cy="${y-24}" r="2" fill="#ffd36a"/>`;
  s+=`<rect x="${x-80}" y="${y-78}" width="160" height="20" rx="4" fill="#2f5a48" ${BO}/><text x="${x}" y="${y-63}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="12" fill="#f2cf6a">Café Frimousse</text>`;
  let aw=`<path d="M${x-102} ${y-54} H${x+102} L${x+110} ${y-36} H${x-110}Z" fill="#fff" ${BO}/>`;for(let i=0;i<10;i++)aw+=`<path d="M${x-101+i*20.6} ${y-54} h10 l2 18 h-10Z" fill="#c0485a"/>`;
  aw+=`<path d="M${x-110} ${y-36} ${Array.from({length:10},()=>"q11 8 22 0").join(" ")}" fill="#c0485a" ${K}/><path d="M${x-102} ${y-54} H${x+102} L${x+110} ${y-36} H${x-110}Z" fill="none" ${BO}/>`;
  return s+aw+paTable(x-80,y+32)+paTable(x+80,y+32);
}
const paBakery=(x,y)=>shadow(x,y,46)+`<rect x="${x-39}" y="${y-80}" width="78" height="80" fill="#5f7fb0" ${BO}/><path d="M${x-43} ${y-80} H${x+43}" stroke="${INK}" stroke-width="3"/><rect x="${x-33}" y="${y-72}" width="66" height="14" rx="3" fill="#fff4dc" ${K2}/><text x="${x}" y="${y-61.5}" text-anchor="middle" font-size="8.4" font-weight="900" fill="#5f7fb0">BOULANGERIE</text><rect x="${x-31}" y="${y-50}" width="40" height="34" rx="3" fill="#fff4dc" ${K2}/>`
  +[[x-21,y-28],[x-7,y-26],[x-15,y-38]].map(([a,b])=>`<g transform="translate(${a-10} ${b-9}) scale(.5)">${ICON["croissant@paris"]}</g>`).join("")+`<rect x="${x+15}" y="${y-50}" width="18" height="50" rx="3" fill="#a8664a" ${K2}/>`;
function paArchSVG(x,y){return `<path d="M${x-62} ${y+24} V${y-6} Q${x} ${y-56} ${x+62} ${y-6} V${y+24}" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M${x-62} ${y+24} V${y-6} Q${x} ${y-56} ${x+62} ${y-6} V${y+24}" fill="none" stroke="#a9b6c6" stroke-width="11" stroke-linecap="round"/><rect x="${x-56}" y="${y-48}" width="112" height="24" rx="9" fill="#fffaf2" ${BO}/><text x="${x}" y="${y-31}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="12" fill="${INK}">Paris</text>`}
function paMapSVG(L){
  const {P,way,H,cafe}=L,Y=u=>H-u,hz=Y(cafe.u)+40;
  const u7=P[7].u,u12=P[12].u,u13=P[13].u,u18=P[18].u;
  const defs=PA_DEFS+`<pattern id="pa-pave" width="44" height="30" patternUnits="userSpaceOnUse"><g fill="none" stroke="#dccfbd" stroke-width="2"><rect x="2" y="2" width="18" height="11" rx="5"/><rect x="24" y="2" width="18" height="11" rx="5"/><rect x="-9" y="17" width="18" height="11" rx="5"/><rect x="13" y="17" width="18" height="11" rx="5"/><rect x="35" y="17" width="18" height="11" rx="5"/></g></pattern>
    <linearGradient id="pa-gnd" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}"><stop offset="0" stop-color="#efe3d0"/><stop offset=".5" stop-color="#f2e8da"/><stop offset="1" stop-color="#ece2d4"/></linearGradient>
    <linearGradient id="pa-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4b9c4"/><stop offset=".55" stop-color="#fad8cc"/><stop offset="1" stop-color="#fdeee0"/></linearGradient>
    <radialGradient id="pa-sun"><stop offset="0" stop-color="#fff2b8" stop-opacity=".9"/><stop offset="1" stop-color="#fff2b8" stop-opacity="0"/></radialGradient>
    <radialGradient id="pa-vig" cx=".5" cy=".5" r=".75"><stop offset=".7" stop-color="#5b4250" stop-opacity="0"/><stop offset="1" stop-color="#5b4250" stop-opacity=".12"/></radialGradient>`;
  let s=`<rect width="400" height="${H}" fill="url(#pa-gnd)"/><rect width="400" height="${H}" fill="url(#pa-pave)" opacity=".8"/>`;
  // le ciel du soir et les toits de Paris derrière le café, la tour Eiffel au loin n'y est pas : elle est sur la carte
  s+=`<rect x="0" y="0" width="400" height="${hz}" fill="url(#pa-sky)"/><circle cx="320" cy="${hz-150}" r="70" fill="url(#pa-sun)"/><circle cx="320" cy="${hz-150}" r="18" fill="#fff4c8" ${BO}/>`;
  s+=[[0,64],[48,80],[92,58],[146,84],[204,66],[258,82],[314,60],[356,76]].map(([x,h],i)=>`<path d="M${x} ${hz} V${hz-h} L${x+8} ${hz-h-15} H${x+42} L${x+50} ${hz-h} V${hz}Z" fill="${i%2?"#d6dbe6":"#cbd2df"}" stroke="${INK}" stroke-width="1.8"/>`+[0,1].map(j=>`<rect x="${x+12+j*16}" y="${hz-h-11}" width="7" height="7" rx="2.5" fill="#f2f5fa" stroke="${INK}" stroke-width="1.2"/>`).join("")+(i%2?`<rect x="${x+36}" y="${hz-h-26}" width="6" height="12" fill="#d98a6a" stroke="${INK}" stroke-width="1.4"/>`:"")).join("");
  s+=`<g><animateTransform attributeName="transform" type="translate" values="-60 0;460 -10" dur="26s" repeatCount="indefinite"/>${[[0,hz-180],[14,hz-188],[26,hz-178]].map(([x,y])=>`<path d="M${x-6} ${y} q3 -4 6 0 q3 -4 6 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`).join("")}</g>`;
  s+=`<path d="M0 ${hz} H400" stroke="${INK}" stroke-width="2"/>`;
  // le Champ-de-Mars : une grande pelouse bordée d'allées
  s+=`<path d="M232 ${Y(u7+40)} Q318 ${Y(u7+16)} 410 ${Y(u7+30)} V${Y(u12-4)} Q326 ${Y(u12+8)} 246 ${Y(u12-26)}Z" fill="url(#pa-grass)" ${BO}/><path d="M248 ${Y(u7+56)} Q320 ${Y(u7+34)} 404 ${Y(u7+46)}" stroke="#bfdc9c" stroke-width="3" fill="none"/>`;
  // la butte Montmartre : une colline arrondie, plus claire au sommet
  s+=`<path d="M-10 ${Y(u13+6)} Q-4 ${Y(u18-20)} 96 ${Y(u18-24)} Q190 ${Y(u18-40)} 206 ${Y(u18-200)} Q214 ${Y(u13+90)} 176 ${Y(u13+24)} Q96 ${Y(u13-24)} -10 ${Y(u13+6)}Z" fill="url(#pa-hill)" ${BO}/>`;
  s+=[[30,u13+60],[150,u13+180],[60,u18-70],[170,u13+260],[22,u13+190]].map(([x,u])=>`<path d="M${x} ${Y(u)} l3 -6 l3 6 M${x+40} ${Y(u)+10} l3 -6 l3 6" fill="none" stroke="#8cc070" stroke-width="2" stroke-linecap="round"/>`).join("");
  // la Seine, ses quais de pierre, des reflets
  const sy=Y(L.seine),bx=pathX(way,L.seine);
  s+=`<path d="M-10 ${sy-48} Q100 ${sy-56} 200 ${sy-48} T410 ${sy-52} V${sy-34} H-10Z" fill="url(#pa-quai)" ${BO}/><path d="M-10 ${sy-34} Q100 ${sy-40} 200 ${sy-32} T410 ${sy-36} V${sy+32} Q300 ${sy+42} 200 ${sy+34} T-10 ${sy+38}Z" fill="url(#pa-water)" ${BO}/><path d="M-10 ${sy+38} Q100 ${sy+32} 200 ${sy+36} T410 ${sy+32} V${sy+52} H-10Z" fill="url(#pa-quai)" ${BO}/>`;
  s+=[[-10,sy-42],[-10,sy+45]].map(([x,y])=>`<path d="M${x} ${y} H410" stroke="#cdbb9a" stroke-width="1.2" stroke-dasharray="14 6"/>`).join("");
  s+=`<g><animate attributeName="opacity" values=".9;.4;.9" dur="4s" repeatCount="indefinite"/>${[[230,-12],[360,22],[30,22],[300,6],[160,-18]].map(([x,o])=>`<path d="M${x} ${sy+o} q8 -4 16 0 q8 4 16 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
  s+=paNotreDame(110,sy+4);
  s+=`<g><animateTransform attributeName="transform" type="translate" values="0 0;-26 0;0 0" dur="16s" repeatCount="indefinite"/>${paPeniche(bx<200?280:366,sy+16)}</g>`;
  // le chemin et la part déjà faite
  const pts=way.map(p=>[p.x,Y(p.u)]),d=smooth(pts);
  s+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fdf1df" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ead2bb" stroke-width="4" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  const k=way.findIndex(p=>p.d===itCur());if(k>0)s+=`<path d="${smooth(pts.slice(0,k+1))}" fill="none" stroke="#f59a8b" stroke-width="7" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  // le pont de pierre : tablier, balustrade, deux arches sur l'eau, un lampadaire à chaque bout
  s+=`<path d="M${bx-38} ${sy-40} H${bx+38} V${sy+40} H${bx-38}Z" fill="url(#pa-stoneV)" ${BO}/><path d="M${bx-30} ${sy-40} V${sy+40} M${bx+30} ${sy-40} V${sy+40}" stroke="#d8c8a8" stroke-width="2"/>`
    +[-1,1].map(sd=>`<path d="M${bx+sd*38} ${sy-40} V${sy+40}" stroke="${INK}" stroke-width="4"/>`+Array.from({length:9},(_,i)=>`<rect x="${bx+sd*38-2.4}" y="${sy-37+i*9}" width="4.8" height="5" rx="1.6" fill="#f6eedf" stroke="${INK}" stroke-width="1.1"/>`).join("")).join("")
    +[-1,1].map(sd=>`<path d="M${bx+sd*44} ${sy+2} Q${bx+sd*62} ${sy-16} ${bx+sd*80} ${sy+2}" fill="none" stroke="#e9dcc4" stroke-width="5"/>`).join("");
  // ce qui est posé, chaque chose une fois
  const it=[];const at=(x,u,f)=>it.push({x,u,f});
  // la rue : immeubles des deux côtés, métro, colonne Morris, terrasse, lampadaires, platanes
  [[0,150,62,100,"#c0485a"],[338,180,66,92,"#5f7fb0"],[0,370,58,84,"#d98a6a"],[340,420,64,88,"#3f7a5a"],[0,520,56,64,"#5f7fb0"]].forEach(([x,u,w,h,c])=>at(x+w/2,u,(cx,y)=>paHaus(x,y-h,w,h,c)));
  at(300,282,paMetro);at(286,440,paMorris);at(252,190,paLamp);at(168,566,paLamp);at(300,522,paTable);at(40,248,(x,y)=>paTree(x,y,.95));at(372,330,(x,y)=>paTree(x,y,.85));
  // les quais : bouquinistes, un platane
  at(36,L.seine-60,(x,y)=>paBouq(x-17,y));at(84,L.seine-60,(x,y)=>paBouq(x-17,y));at(132,L.seine-60,(x,y)=>paBouq(x-17,y));at(380,L.seine-64,(x,y)=>paTree(x,y,.75));
  // le Champ-de-Mars : la tour, des platanes, un banc, un lampadaire
  at(320,u7+70,(x,y)=>paEiffel(x,y,360));at(30,u7+60,(x,y)=>paTree(x,y,.8));at(384,u7+24,(x,y)=>paTree(x,y,.6));at(36,u12-140,(x,y)=>paTree(x,y,.8));at(232,u12-176,paBench);at(54,u12+6,paLamp);
  // Montmartre : le Sacré-Cœur, les escaliers, le moulin, deux maisons, les chevalets
  at(96,u13+246,(x,y)=>paSacre(x,y,1.1));at(112,u13+92,(x,y)=>paStairs(x,y));at(48,u13+116,(x,y)=>paEasel(x,y,"#8fbf5a"));at(180,u13+330,(x,y)=>paEasel(x,y,"#9fc0e8"));at(64,u18-34,(x,y)=>paEasel(x,y,"#f49ab0"));
  at(150,u18-96,paMill);at(36,u13+20,(x,y)=>paCottage(x,y,"#7fb4d8"));at(150,u13+184,(x,y)=>paCottage(x,y,"#f2a2b0"));
  at(370,u13+150,(x,y)=>paTree(x,y,.75));at(372,u18-44,(x,y)=>paTree(x,y,.7));at(30,u18-120,(x,y)=>paTree(x,y,.7,"pa-leaf2"));
  // devant le café : la boulangerie de Firmin, en face ; un platane
  at(340,cafe.u+20,paBakery);at(40,cafe.u-40,(x,y)=>paTree(x,y,.85));
  // entre la butte et le café : la fontaine Wallace, le fleuriste ; entre la tour et la butte : le manège
  at(290,u18+60,paWallace);at(66,u18+238,paFlowers);at(358,u12+6,paCarousel);at(250,u18+150,(x,y)=>paTree(x,y,.8,"pa-leaf2"));
  it.sort((a,b)=>b.u-a.u).forEach(e=>s+=e.f(+e.x.toFixed(1),+Y(e.u).toFixed(1)));
  s+=paArchSVG(200,Y(60))+paCafeSVG(cafe.x,Y(cafe.u));
  // le panneau vers Kyoto (kyoto.js), au-dessus du café à droite, une fois les 20 journées réussies
  if(typeof kyOpen==="function"&&kyOpen()){const px=cafe.x+128,py=Y(cafe.u+136);s+=`<rect x="${px-4}" y="${py-6}" width="8" height="40" fill="#c8946a" ${BO}/><path d="M${px-44} ${py-30} H${px+34} L${px+46} ${py-18} L${px+34} ${py-6} H${px-44}Z" fill="#fffaf2" ${BO}/><text x="${px}" y="${py-13}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="13" fill="${INK}">Kyoto</text>`}
  s+=`<rect width="400" height="${H}" fill="url(#pa-vig)" pointer-events="none"/>`;
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
      ["celeste","joy","Celui du Café Frimousse. Croustillant, fondant, et servi avec le sourire."],
      ["firmin","sad","…"],["firmin","shy","Il est meilleur que le mien. Bravo. Vraiment."],
      ["firmin","open","Et si je venais prendre mon petit noir chez toi, le matin ? Entre voisins."],
      ["anatole","joy",`On a gagné, ${ME()} ! Le meilleur pain au chocolat de Paris, c'est le tien !`]]
};
const paSceneDue=d=>PA_SCENES[d]&&!S.pa.read[d]&&(PA_DUEL[d]?!!S.pa.duel[d]:!!S.pa.stars[d]);
function anatoleIntro(){
  itTalk([["anatole","joy",`Bonjour, bonjour ! Anatole, garçon de café. Bienvenue à Paris, ${ME()} !`],
    ["anatole","open","Le Café Frimousse vient d'ouvrir au coin de la rue. Et juste en face… la boulangerie de Firmin."],
    ["firmin","open","Hmpf. Encore un café. Le meilleur pain au chocolat de Paris, c'est le mien. Tout le monde le sait."],
    ["anatole","surprise","Il organise un grand concours : à la finale, la Diva de l'Opéra goûtera vos deux pains au chocolat !"],
    ["anatole","joy","Pour commencer : le petit noir, et le pain au chocolat. Avec l'option Crème, le petit noir devient un café crème."],
    ["anatole","open","Les jours de défi, Firmin annonce son score. Fais mieux que lui, et il en fera une tête !"]],
    ()=>{if(!S.pa.intro){S.pa.intro=1;save();dailyBonus()}});
}
// à la fin d'une journée, la scène gagnée se joue tout de suite (avant l'écran de résultats) ; sur la carte, celles restées en attente
function paScenes(done){
  const d=Object.keys(PA_SCENES).map(Number).find(paSceneDue);
  if(d){itTalk(PA_SCENES[d],()=>{S.pa.read[d]=1;if(d===20&&!S.pa.peace){S.pa.peace=1;toast("Firmin viendra maintenant au café.")}save();paScenes(done)});return}
  done();
}
function paStory(){paScenes(()=>{renderMapIt();dailyBonus()})}
function paCarnet(){
  const rows=Object.keys(PA_SCENES).map(Number).map(d=>S.pa.read[d]
    ?`<div data-pascene="${d}" style="cursor:pointer">${itRow(foxSVG(FOX[PA_SCENES[d][0][0]],{pose:"happy"}),PA_DUEL[d]?(d===20?"La finale":`Défi du jour ${d}`):`Jour ${d}`,PA_SCENES[d][0][2],"background:#fbf3dc")}</div>`
    :`<div style="opacity:.55">${itRow(foxSVG(FOX.anatole,{sil:1}),PA_DUEL[d]?(d===20?"La finale":`Défi du jour ${d}`):"Scène à découvrir",PA_DUEL[d]?`Bats Firmin au jour ${d}.`:`Réussis le jour ${d} du quartier.`)}</div>`).join("");
  openSheet(`<h2>Le journal du concours</h2><div style="width:120px;margin:0 auto">${foxSVG(FOX.anatole,{pose:"happy"})}</div>
  <p class="sub" style="text-align:center">Tout ce qui s'est passé depuis l'ouverture du Café Frimousse. Touche une scène pour la revoir.</p>${rows}
  <div class="col" style="margin-top:10px"><button class="btn ghost wide" data-act="anatoleintro" type="button">Revoir l'accueil d'Anatole</button></div>`);
  $("sheet-in").querySelectorAll("[data-pascene]").forEach(b=>b.onclick=()=>itTalk(PA_SCENES[+b.dataset.pascene],paCarnet));
}
// la fiche de Firmin (on le touche devant sa boulangerie) : où en est le concours
function paFinaleSheet(){
  const n=Object.keys(PA_DUEL).filter(d=>S.pa.duel[d]).length,f=FOX.firmin;
  openSheet(`<h2>${f.name}, le rival</h2><div style="width:140px;margin:0 auto">${foxSVG(f,{pose:S.pa.peace?"happy":"sit"})}</div>
  <p class="sub" style="text-align:center">${S.pa.peace?"Depuis la finale, il vient prendre son petit noir au Café Frimousse tous les matins.":`« Le meilleur pain au chocolat de Paris, c'est le mien. » Les jours de défi (${Object.keys(PA_DUEL).join(", ")}), il annonce son score : fais mieux que lui.`}</p>
  ${Object.keys(PA_DUEL).map(Number).map(d=>itRow(icon("croissant","paris"),d===20?"La finale (jour 20)":`Défi du jour ${d}`,S.pa.duel[d]?`Gagné ! Ton record : ${S.pa.best[d]} pièces, Firmin : ${duelScore(d)}.`:`Firmin a fait ${duelScore(d)} pièces.${S.pa.best[d]?` Ton record : ${S.pa.best[d]}.`:""}`,S.pa.duel[d]?"background:#e3f2d6":"")).join("")}`);
}

/* ---------- le quartier dans le registre des mondes (data.js) ---------- */
WORLDS.paris={id:"paris",name:"Paris",cafe:"Café Frimousse",short:"Café",sv:()=>S.pa,days:PA_DAYS,s3:PA_S3,kit:PA_KIT,
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
    +`<button class="mnext" style="${pc(200,52)}" data-act="italie" type="button" aria-label="Retour en Petite Italie"></button>`
    +(typeof kyOpen==="function"&&kyOpen()?`<button class="mnext" style="${pc(L.cafe.x+128,L.cafe.u+150)}" data-act="kyoto" type="button" aria-label="Kyoto"></button>`:""),
  arrive:()=>{if(!S.pa.intro)anatoleIntro();else paStory()},
  scenes:done=>paScenes(done),
  news:(d,st,prev,news,e)=>{
    if(PA_DUEL[d]&&st){const f=duelScore(d);
      if(e>=f&&!S.pa.duel[d]){S.pa.duel[d]=1;S.coins+=40;news.push(itRow(foxSVG(FOX.firmin,{pose:"sit"}),d===20?"Tu as gagné la finale !":"Tu as battu Firmin !",`${e} pièces contre ${f}. +40 pièces !`,"background:#fde8ec"))}
      else if(!S.pa.duel[d])news.push(itRow(foxSVG(FOX.firmin,{pose:"happy"}),"Firmin a gagné ce défi…",`Il a fait ${f} pièces, toi ${e}. Rejoue cette journée pour le battre.`,"background:#fde8ec"))}
}
};
// le monde affiché au chargement (le dernier visité, s'il est ouvert)
WORLD=WORLDS[S.world]&&WORLDS[S.world].isOpen()?S.world:"";
