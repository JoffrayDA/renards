/* Café Frimousse : Kyoto, troisième quartier de la Ville (08/11/2026, choix de Joffray parmi Japon, Montagne, Plage, Londres),
   refait le 09/11/2026 en vrai défi de fin (Joffray : « faut que ça se complique ! ») : 25 journées plus dures, la petite cantine
   de Yuzu, le Kitsune Shokudō, et le menu le plus riche du jeu, choisi avec Joffray :
   - boissons : matcha (+ Lait = matcha latte), ramune, hōjicha (+ Crème) ;
   - au four, en vitrine : onigiri, tempura de crevettes, taiyaki, mochi fraise, dorayaki (+ Crème), avec DEUX fours dès le jour 14
     (WD().ovens), chacun en tête d'une rangée de vitrine ;
   - à composer, sur DEUX comptoirs : la brochette de dango (sakura, blanc, matcha, de bas en haut, recette « dango », WD().gel2)
     et le plateau de sushis (saumon, maki au concombre, tamago, de gauche à droite, la clé « smoothie » comme le gelato).
     Le premier four cuit onigiri, tempura et taiyaki, le deuxième (dès le jour 14, avec le mochi) mochi et dorayaki (WD().ovenOf).
   On commence avec deux boissons et deux plats (Joffray : « les gens comprennent maintenant »), le reste se gagne (KY_REC).
   Taiyaki, mochi et dango sont des recettes propres au quartier (REC avec w:"kyoto", data.js).
   Histoire (choix de Joffray) : le Matsuri. Yuzu monte une équipe pour le stand du festival d'été ; à chaque étape, un renard
   du quartier la rejoint ; le soir du Matsuri (jour 25), Kyūbi, la Dame aux neuf queues, descend du chemin des torii.
   On y entre depuis l'écran des mondes, ou par le panneau au-dessus du Café de Paris, une fois ses 20 journées réussies
   (?kyoto=1 pour tester). Sauvegarde : S.ky = {day, stars, best, own, intro, guest, read, gtip}. */

/* ---------- les renards du quartier (dans FOX, pas dans FOXES : ni la Clairière, ni le grand portrait) ---------- */
const KYF=[
  {id:"yuzu",name:"Yuzu",rar:"commun",acc:"kimono",c:{b:"#f4c060",ch:"#fffaf0",e:"#a87a2a",s:"#946a24",t:"#fffaf0"},bio:"La patronne du Kitsune Shokudō. Kimono rose, fleur dans les cheveux, et un matcha toujours prêt."},
  // Daifuku est une fille (09/11/2026, Joffray : « on dirait une meuf »)
  {id:"daifuku",name:"Daifuku",rar:"commun",acc:"mochi",scale:1.06,c:{b:"#f6e4e6",ch:"#ffffff",e:"#c99aa4",s:"#b8848e",t:"#ffffff"},bio:"Ronde comme un mochi, et elle les aime tous. Elle goûte tout. Pour vérifier."},
  {id:"origami",name:"Origami",rar:"commun",acc:"grue",c:{b:"#a9c2e0",ch:"#f6fbff",e:"#5f7fa6",s:"#4f6f96",t:"#f6fbff"},bio:"Il plie des oiseaux en papier (des grues, l'origami porte-bonheur du Japon) en attendant sa commande. Il en a mille. Presque."},
  {id:"kage",name:"Kage",rar:"commun",acc:"ninja",c:{b:"#4c5270",ch:"#a6acc4",e:"#2a2d40",s:"#22243a",t:"#a6acc4"},bio:"Le renard ninja. On ne le voit jamais arriver. Il répare les lanternes la nuit, sans rien dire."},
  // quatre clients de plus (09/11/2026, Joffray : « j'adore les 4 ») : deux sumos, tout larges (wide), et deux samouraïs
  {id:"chanko",name:"Chanko",rar:"commun",big:1,acc:"sumo",scale:1.14,wide:1.22,c:{b:"#d99a6a",ch:"#fff2e4",e:"#8a5a3a",s:"#7a4a2e",t:"#fff2e4"},bio:"Lutteur de sumo. Il mange trois plateaux de sushis d'affilée, puis demande le dessert."},
  {id:"oyama",name:"Ōyama",rar:"commun",big:1,acc:"sumob",scale:1.18,wide:1.26,c:{b:"#e8d2b8",ch:"#fffaf2",e:"#a88a6a",s:"#8a6e52",t:"#fffaf2"},bio:"Le grand champion de sumo, corde blanche à la taille. Quand il s'assoit, tout le Shokudō tremble un peu."},
  {id:"tsuba",name:"Tsuba",rar:"commun",acc:"samourai",c:{b:"#c45a3a",ch:"#fff2e8",e:"#7a2e1e",s:"#6a2618",t:"#fff2e8"},bio:"Samouraï au casque à cornes dorées. Il ne l'enlève jamais, même pour boire son matcha."},
  {id:"hayate",name:"Hayate",rar:"commun",acc:"samouraib",c:{b:"#8a7a9a",ch:"#f6f2fa",e:"#4a3e5a",s:"#3e3450",t:"#f6f2fa"},bio:"Un rōnin, samouraï sans maître. Il ne parle pas : il s'incline, il paie, il repart."},
  // le maître de thé : ne vient au Shokudō qu'une fois son matcha jugé parfait (scène du jour 19, S.ky.read[19])
  {id:"hoji",name:"Sensei Hōji",rar:"rare",acc:"sensei",c:{b:"#b8957a",ch:"#f6efe6",e:"#7a5a44",s:"#6a4c38",t:"#f6efe6"},bio:"Maître de la cérémonie du thé depuis soixante ans. Il ne sourit qu'aux matchas parfaits."},
  {id:"kyubi",name:"Kyūbi",rar:"legend",acc:"inari",tail:"neuf",c:{b:"#fbf4ea",ch:"#ffffff",e:"#e0b860",s:"#d4a84a",t:"#f7d77a"},bio:"La Dame aux neuf queues, gardienne du chemin des torii. Elle ne descend que pour les fêtes les plus lumineuses."}
];
KYF.forEach(f=>{f.world="kyoto";FOX[f.id]=f});
// les sumos (big) ne viennent pas comme les autres : seulement après leur premier défi, et rarement (Joffray, 09/11/2026)
const KYF_REG=KYF.filter(f=>f.rar==="commun"&&!f.big);

/* ---------- les journées ---------- */
// rythme d'un jour de référence du premier monde, de 24 à 40, puis au-delà (hard : plus de clients, plus serrés, moins patients) ;
// graine et objectif par `python tools/balance-bot.py --kyoto`
// plus dur partout (09/11/2026, Joffray : « assez facile, surtout avec les améliorations ») : hard de 1,1 au jour 1 à 1,6 au jour 25
const KY_DAYS=[{base:24,hard:1.1,seed:4,goal:209},{base:25,hard:1.12,seed:0,goal:217},{base:26,hard:1.14,seed:3,goal:234},{base:27,hard:1.16,seed:8,goal:241},{base:28,hard:1.18,seed:8,goal:209},{base:29,hard:1.21,seed:2,goal:275},{base:30,hard:1.23,seed:1,goal:300},{base:31,hard:1.25,seed:13,goal:328},{base:32,hard:1.27,seed:3,goal:269},{base:33,hard:1.29,seed:9,goal:400},{base:34,hard:1.31,seed:12,goal:364},{base:35,hard:1.33,seed:11,goal:459},{base:36,hard:1.35,seed:13,goal:482},{base:37,hard:1.37,seed:6,goal:505},{base:38,hard:1.39,seed:14,goal:523},{base:39,hard:1.42,seed:9,goal:556},{base:40,hard:1.44,seed:2,goal:526},{base:40,hard:1.46,seed:2,goal:603},{base:40,hard:1.48,seed:7,goal:606},{base:40,hard:1.5,seed:14,goal:647},{base:40,hard:1.52,seed:2,goal:649},{base:40,hard:1.54,seed:12,goal:683},{base:40,hard:1.56,seed:12,goal:683},{base:40,hard:1.58,seed:12,goal:676},{base:40,hard:1.6,seed:12,goal:681}];
const KY_S3=Array(KY_DAYS.length).fill(1.7);
// l'équipement prévu pour chaque journée : celui de l'Italie, étalé sur 25 journées
const KY_KIT=IT_KIT.map(([k,n,d])=>[k,n,Math.max(1,Math.round(d*1.25))]);
// la journée qui fait gagner chaque recette ou option (elle arrive à la suivante) ; 0 = dès le jour 1
const KY_REC={cafe:0,the:0,croissant:0,cookie:0,taiyaki:2,lait:3,choco:5,dango:7,smoothie:10,mochi:13,chantilly:16,gateau:19};
S.ky=S.ky||{day:1,stars:{},best:{},own:{},intro:0,guest:0,read:{}};
S.ky.read=S.ky.read||{};S.ky.sumo=S.ky.sumo||{};
// les parties commencées avant la refonte (09/11/2026) : une journée déjà réussie donne sa recette (taiyaki, lait, dango, mochi…)
for(const k in KY_REC)if(KY_REC[k]&&S.ky.stars[KY_REC[k]]&&!S.ky.own[k])S.ky.own[k]=1;
// recommencer le quartier depuis le jour 1 (bouton du carnet de Yuzu) : journées, étoiles, recettes, équipement et scènes ;
// les pièces, les clochettes et le reste du jeu ne bougent pas
function kyReset(){S.ky={day:1,stars:{},best:{},own:{},intro:0,guest:0,read:{},sumo:{}};save();closeSheet();WLAY.kyoto=null;toast("Kyoto recommence au jour 1 !");openMapIt()}
// les défis des sumos (09/11/2026, idée de Joffray) : ces jours-là, Chanko et Ōyama passent toute la journée au comptoir ;
// la scène de fin dit qui a gagné le concours : Chanko, puis Ōyama, puis égalité
const KY_SUMO={5:["chanko","oyama"],11:["oyama","chanko"],17:["chanko","oyama"]};
if(new URLSearchParams(location.search).get("kyoto")==="1"){S.kyOpen=1;save()} // pour tester sans avoir fini Paris
const kyOpen=()=>S.pa.day>PA_DAYS.length||!!S.kyOpen;

/* ---------- la carte de la cantine : noms et dessins (mêmes clés, prix et cuissons que le premier café, plus taiyaki, mochi et dango) ---------- */
VAR.kyoto={cafe:["Matcha","matchas"],croissant:["Onigiri","onigiris"],the:["Ramune","ramunes"],cookie:["Tempura de crevettes","tempuras de crevettes"],
  choco:["Hōjicha","hōjichas"],smoothie:["Plateau de sushis","plateaux de sushis"],gateau:["Dorayaki","dorayakis"],
  taiyaki:["Taiyaki","taiyakis"],mochi:["Mochi fraise","mochis fraise"],dango:["Brochette de dango","brochettes de dango"]};
const KY_DANGO={r:{n:"Sakura",c:"#f6a8be"},b:{n:"Blanc",c:"#fffaf2"},v:{n:"Matcha",c:"#a9cf7a"}};
const ballSVG=(x,y,c,r=6)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${K2}/><ellipse cx="${x-r*.35}" cy="${y-r*.4}" rx="${r*.32}" ry="${r*.2}" fill="#fff" opacity=".75"/>`;
// la brochette, remplie de bas en haut (g peut être incomplet : la brochette en cours au comptoir)
const kyDangoSVG=g=>`<path d="M20 38 V3" stroke="#c99a5a" stroke-width="2.6" stroke-linecap="round"/><path d="M20 38 V3" stroke="${INK}" stroke-width=".8" opacity=".4"/>`
  +[0,1,2].map(i=>g[i]?ballSVG(20,31-i*11,KY_DANGO[g[i]].c,6.2):`<circle cx="20" cy="${31-i*11}" r="5" fill="none" stroke="#e6c3cf" stroke-width="1.4" stroke-dasharray="2 2"/>`).join("");
Object.assign(ICON,{
  // matcha : un bol de céramique, mousse verte et fouet en bambou
  "cafe@kyoto":`<ellipse cx="20" cy="33" rx="13" ry="3" fill="#3d2a35" opacity=".12"/><path d="M6 18 H34 Q33 32 20 33 Q7 32 6 18Z" fill="#7a6a96" ${K}/><path d="M8.4 24 Q20 28 31.6 24" fill="none" stroke="#9d8fbc" stroke-width="1.6"/><ellipse cx="20" cy="18" rx="14" ry="3.6" fill="#9cc46a" ${K}/><ellipse cx="16" cy="17.4" rx="5" ry="1.2" fill="#c9e6a4"/><circle cx="24" cy="18.4" r="1" fill="#c9e6a4"/>
    <path d="M30 4 L27 15" stroke="#c99a5a" stroke-width="2.6" stroke-linecap="round"/><path d="M25.4 14 Q27 19 29 15 M27.4 15 Q28.4 19.6 30.4 15.6" fill="none" stroke="#d9b07a" stroke-width="1.3"/>`,
  // taiyaki : le gâteau en forme de poisson, doré, écailles et petit œil
  "taiyaki@kyoto":`<path d="M8 22 Q10 12 22 12 Q30 12 32 18 L38 13 Q37 20 38 27 L32 23 Q29 31 20 31 Q10 31 8 22Z" fill="#e0a050" ${K}/><path d="M11 20 Q13 15 21 14.4" fill="none" stroke="#f6cf88" stroke-width="2" stroke-linecap="round"/>
    ${[[17,21],[22,19],[22,25],[27,22],[17,26]].map(([x,y])=>`<path d="M${x-2.4} ${y-1.6} q2.4 3 4.8 0" fill="none" stroke="#b8742e" stroke-width="1.3"/>`).join("")}<circle cx="12.6" cy="19.6" r="1.6" fill="${INK}"/><path d="M8.6 23.6 q2 1 3.4 .2" fill="none" stroke="#b8742e" stroke-width="1.3"/><path d="M33 16 L36 18.6 M33 24 L36 22" stroke="#b8742e" stroke-width="1.1"/>`,
  // ramune : la bouteille de soda bleue et sa bille de verre dans le goulot
  "the@kyoto":`<path d="M15 36 Q12 36 12 32 V21 Q12 17 15.5 15 Q17 14 17 12 V6 H23 V12 Q23 14 24.5 15 Q28 17 28 21 V32 Q28 36 25 36Z" fill="#bfe6f2" ${K}/><path d="M13.4 24 H26.6 V32 Q26.6 34.6 24.6 34.6 H15.4 Q13.4 34.6 13.4 32Z" fill="#8fd0e8"/>
    <circle cx="20" cy="13.6" r="2.8" fill="#e8f7fb" stroke="${INK}" stroke-width="1.4"/><rect x="16.4" y="3.4" width="7.2" height="3.4" rx="1.2" fill="#e2546e" stroke="${INK}" stroke-width="1.4"/><path d="M15.4 19 V30" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>
    <path d="M15 36 Q12 36 12 32 V21 Q12 17 15.5 15 Q17 14 17 12 V6 H23 V12 Q23 14 24.5 15 Q28 17 28 21 V32 Q28 36 25 36Z" fill="none" ${K}/>`,
  // mochi à la fraise : une boule blanche, la fraise qui dépasse
  "mochi@kyoto":`<ellipse cx="20" cy="33" rx="15" ry="3.4" fill="#3d2a35" opacity=".12"/><path d="M5.4 27 Q5 16 20 15 Q35 16 34.6 27 Q34 33 20 33 Q6 33 5.4 27Z" fill="#fffaf6" ${K}/><ellipse cx="13" cy="21" rx="3.6" ry="1.8" fill="#fff"/><ellipse cx="9" cy="27" rx="2.2" ry="1.2" fill="#f6c3cf"/><ellipse cx="31" cy="27" rx="2.2" ry="1.2" fill="#f6c3cf"/>
    <path d="M14 17 Q20 3 26 17 Q20 19.4 14 17Z" fill="#e2546e" ${K}/>${[[18,12],[22,12.4],[20,15],[17,15.4],[23,15.6]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx=".6" ry=".9" fill="#ffe08a"/>`).join("")}<path d="M16.4 8 L20 5.4 L23.6 8 L20 7.2Z" fill="#8fca7a" ${K2}/>`,
  // hōjicha : le thé grillé au lait, dans un verre, couleur caramel
  "choco@kyoto":`<path d="M11 13 H29 L27 36 H13Z" fill="#eef7fb" ${K}/><path d="M11.8 19 H28.2 L27 35 H13Z" fill="#b97a4e"/><path d="M12 17 H28 L27.8 20 H12.2Z" fill="#e8c9a6"/><path d="M14.4 22 V32" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".55"/><path d="M11 13 H29 L27 36 H13Z" fill="none" ${K}/>
    <path d="M17 9 q-2 -3 0 -6 M23 9 q-2 -3 0 -6" fill="none" stroke="#c9b3a8" stroke-width="1.8" stroke-linecap="round"/>`,
  "dango@kyoto":kyDangoSVG("rbv"),
  "lait@kyoto":ICON["lait@paris"],
  "chantilly@kyoto":ICON["chantilly@paris"]
});

/* ---------- les idées de Joffray (08/11/2026), au menu depuis le 09/11/2026 : onigiri, tempura de crevettes, plateau de sushis, dorayaki ---------- */
// saumon (orange, rayé de blanc), maki au concombre (rond, algue noire, cœur vert), tamago (jaune, bande d'algue) :
// le thon rouge ressemblait trop au saumon en petit (Joffray, 09/11/2026), le maki change de couleur ET de forme
const KY_SUSHI={s:{n:"Saumon",c:"#f8935e"},t:{n:"Maki",c:"#7cc45a"},o:{n:"Tamago",c:"#ffd84a"}};
// un sushi (nigiri) : le riz, et le poisson ou l'omelette dessus ; le tamago a sa bande d'algue
const nigiriSVG=(x,y,k,top)=>top==="t"?`<ellipse cx="${x}" cy="${y+1.4*k}" rx="${6.8*k}" ry="${6.4*k}" fill="#2f3a32" ${K2}/><ellipse cx="${x}" cy="${y+.6*k}" rx="${5*k}" ry="${4.4*k}" fill="#fffaf6"/><circle cx="${x}" cy="${y+.6*k}" r="${2.4*k}" fill="#7cc45a" ${K2}/>`
  :`<ellipse cx="${x}" cy="${y+3.4*k}" rx="${7*k}" ry="${3.6*k}" fill="#fffaf6" ${K2}/>`+(top==="o"
  ?`<rect x="${x-7.4*k}" y="${y-4*k}" width="${14.8*k}" height="${5.4*k}" rx="${2*k}" fill="#f7d77a" ${K2}/><rect x="${x-2*k}" y="${y-4.4*k}" width="${4*k}" height="${9.4*k}" fill="#2f3a32" ${K2}/>`
  :`<path d="M${x-7.6*k} ${y+1*k} Q${x-8*k} ${y-4.6*k} ${x} ${y-4.4*k} Q${x+8.4*k} ${y-4.4*k} ${x+7.6*k} ${y+1.4*k} Q${x} ${y+3*k} ${x-7.6*k} ${y+1*k}Z" fill="${KY_SUSHI[top].c}" ${K2}/>`
    +(top==="s"?[-3.6,0,3.6].map(a=>`<path d="M${x+a*k-1*k} ${y-3.6*k} q${1.6*k} ${2.4*k} ${1*k} ${4.6*k}" fill="none" stroke="#fff" stroke-width="${1.1*k}" opacity=".85"/>`).join(""):`<ellipse cx="${x-2.4*k}" cy="${y-2.6*k}" rx="${2.2*k}" ry="${.8*k}" fill="#fff" opacity=".55"/>`));
// le plateau de sushis, rempli de gauche à droite (g peut être incomplet : le plateau en cours au comptoir)
const kySushiSVG=g=>`<path d="M2 25 H38 V30 Q38 32 36 32 H4 Q2 32 2 30Z" fill="#d9a46a" ${K}/><path d="M6 32 V36 M34 32 V36" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M4 27.4 H36" stroke="#eec08a" stroke-width="1.2"/>`
  +[0,1,2].map(i=>g[i]?nigiriSVG(9+i*11,19,.72,g[i]):`<ellipse cx="${9+i*11}" cy="21" rx="4.4" ry="2.6" fill="none" stroke="#e6c3cf" stroke-width="1.4" stroke-dasharray="2 2"/>`).join("");
const KY_ALT={ // gardé pour tools/kyoto-propositions.html
  onigiri:`<ellipse cx="20" cy="34" rx="14" ry="2.8" fill="#3d2a35" opacity=".12"/><path d="M20 5 Q24.4 5 31 18 Q36 28 33 32 Q31 34 27 34 H13 Q9 34 7 32 Q4 28 9 18 Q15.6 5 20 5Z" fill="#fffaf6" ${K}/>
    <path d="M13 22.4 H27 V34 H13Z" fill="#2f3a32" ${K}/><path d="M15 24.6 V31.6" stroke="#5a6a5c" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="15.6" cy="12.6" rx="2.6" ry="1.4" fill="#fff" transform="rotate(-40 15.6 12.6)"/>${[[19,15],[23,17.4],[17.4,19]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx=".9" ry=".5" fill="#e6d3b4"/>`).join("")}`,
  tempura:`<ellipse cx="20" cy="33" rx="16" ry="3.4" fill="#fff" stroke="#e6d3c4" stroke-width="1.4" stroke-dasharray="2.4 1.6"/>`
    +[[0,0],[3,-8]].map(([dx,dy])=>`<g transform="translate(${dx} ${dy})"><path d="M5 29 C3 22 8 17 17 17 L28 16 Q31 16 31 18.8 Q31 21.6 28 21.6 L18 22.4 C13 22.6 10 25 11 29.6 Q8 31.6 5 29Z" fill="#eab45a" ${K2}/>
    <path d="M28 16 L35 12 L34 18.8 L35.4 25 L28 21.6Z" fill="#e2546e" ${K2}/><path d="M30 17.4 L33.6 15 M30 20.6 L33.8 22.4" stroke="#b83a52" stroke-width="1"/>
    ${[[7,26],[9,22.4],[13,19.6],[18,18.6],[23,18]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.5" fill="#f6d08a" stroke="#c98a32" stroke-width=".8"/>`).join("")}<path d="M7.4 22.6 Q10 18.8 15.6 18.2" fill="none" stroke="#fbe6b4" stroke-width="1.3" stroke-linecap="round"/></g>`).join(""),
  sushi:kySushiSVG("sto"),
  dorayaki:`<ellipse cx="20" cy="33.4" rx="16" ry="3.4" fill="#fff" stroke="#e6d3c4" stroke-width="1.4" stroke-dasharray="2.4 1.6"/>
    <path d="M5 27 Q5 32 20 32 Q35 32 35 27 Q35 24 20 24 Q5 24 5 27Z" fill="#c9783a" ${K}/><path d="M6 24.6 Q20 27.6 34 24.6 L34 22 Q20 25 6 22Z" fill="#7a3a3a" ${K2}/>
    <path d="M5 19.6 Q5 12 20 12 Q35 12 35 19.6 Q35 23.4 20 23.4 Q5 23.4 5 19.6Z" fill="#d98a42" ${K}/><path d="M8 18 Q12 14 20 14" fill="none" stroke="#f2b46a" stroke-width="2" stroke-linecap="round"/><path d="M8 20.4 Q20 22.4 32 20.4" fill="none" stroke="#a65a24" stroke-width="1.2"/>`
};

Object.assign(ICON,{"croissant@kyoto":KY_ALT.onigiri,"cookie@kyoto":KY_ALT.tempura,"smoothie@kyoto":KY_ALT.sushi,"gateau@kyoto":KY_ALT.dorayaki});
// les recettes propres au quartier ont aussi un dessin hors de Kyoto (planches, carnet)
Object.assign(ICON,{taiyaki:ICON["taiyaki@kyoto"],mochi:ICON["mochi@kyoto"],dango:ICON["dango@kyoto"]});

/* ---------- dehors, derrière la vitre : la rue de maisons en bois, la pagode au loin, un cerisier ---------- */
OUT.kyoto={sky:["#f6c6b4","#fde9d6"],hill:["#a9c79a","#93b585"],cloud:"#fff"};
function outsideKy(){
  const f=n=>n.toFixed(1),l=(w=2.4)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const defs=`<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2b4a6"/><stop offset=".6" stop-color="#fbd9c6"/><stop offset="1" stop-color="#fdeedd"/></linearGradient>`;
  let st=`<rect x="0" y="0" width="600" height="200" fill="url(#sky)"/><circle cx="470" cy="56" r="18" fill="#fff2c8" ${l(2)}/>`,an="";
  // les collines de Higashiyama, la pagode au loin
  st+=`<path d="M0 132 Q90 92 190 118 Q280 84 380 112 Q470 88 600 110 V200 H0Z" fill="#a9c79a" ${l(2)}/>`;
  const px=330,py=120;st+=`<rect x="${px-3}" y="${py-96}" width="6" height="14" fill="#e0b860" ${l(1.4)}/>`;
  for(let i=0;i<5;i++){const y=py-i*16,w=26-i*3;st+=`<rect x="${px-w*.55}" y="${y-10}" width="${w*1.1}" height="10" fill="#c96a4a" ${l(1.4)}/><path d="M${px-w-6} ${y-10} Q${px} ${y-17} ${px+w+6} ${y-10} L${px+w} ${y-14} H${px-w}Z" fill="#4c5a70" ${l(1.4)}/>`}
  // les maisons d'en face : bois sombre, treillis, toits de tuiles, lanternes rouges
  const mach=(x,w,top)=>{let g=`<path d="M${x-8} ${top} Q${x+w/2} ${top-6} ${x+w+8} ${top} L${x+w} ${top-16} H${x}Z" fill="#5f6f86" ${l(2)}/><rect x="${x}" y="${top}" width="${w}" height="${200-top}" fill="#8a5a3a" ${l(2)}/>`;
    for(let i=0;i<Math.floor(w/7);i++)g+=`<path d="M${x+4+i*7} ${top+16} V176" stroke="#5e3a26" stroke-width="2"/>`;
    g+=`<rect x="${x+w/2-12}" y="${top+26}" width="24" height="${168-top-26}" fill="#3d4e7a" ${l(1.6)}/><path d="M${x+w/2} ${top+26} V${168}" stroke="#2a3558" stroke-width="1.4"/><circle cx="${x+w/2}" cy="${top+40}" r="5" fill="#fff" ${l(1.2)}/>`;
    return g+`<ellipse cx="${x+8}" cy="${top+12}" rx="6" ry="8" fill="#e0503c" ${l(1.4)}/><path d="M${x+3} ${top+6} H${x+13} M${x+3} ${top+18} H${x+13}" stroke="${INK}" stroke-width="2"/>`};
  st+=mach(30,130,112)+mach(176,120,120)+mach(410,150,108);
  st+=`<rect x="0" y="184" width="600" height="16" fill="#d9cdb6" ${l(2)}/>`;
  // le cerisier, et ses pétales qui tombent
  st+=`<path d="M318 184 Q322 160 314 142 M316 158 Q330 150 340 142" fill="none" stroke="#8a5a4a" stroke-width="6" stroke-linecap="round"/>${[[300,132,20],[326,124,24],[350,136,18],[318,146,16]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#f9c4d2" ${l(1.8)}/>`).join("")}${[[306,124],[332,116],[346,132],[320,138]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join("")}`;
  an+=[[280,20,7],[360,60,9],[230,90,8],[420,30,10],[160,50,11]].map(([x,y,d],i)=>`<g><animateTransform attributeName="transform" type="translate" values="0 0;-60 150" dur="${d}s" begin="${-i*1.7}s" repeatCount="indefinite"/><path d="M${x} ${y} q3 -3 6 0 q-3 3 -6 0Z" fill="#f6a8be"/></g>`).join("");
  const cloud=(x,y,k,dur)=>`<g><animateTransform attributeName="transform" type="translate" values="0 0;18 0;0 0" dur="${dur}s" repeatCount="indefinite"/>${[[x-14*k,y,11*k],[x+2*k,y-7*k,15*k],[x+18*k,y,10*k]].map(([cx,cy,r])=>`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#fff"/>`).join("")}</g>`;
  an+=cloud(140,46,1,26)+cloud(560,34,.7,30);
  return {defs,st,an};
}

/* ---------- la carte du quartier : de la grande porte en bas au Kitsune Shokudō en haut ---------- */
// la rue de Gion (jours 1-6), la rivière Kamo et ses pierres de gué (entre 6 et 7), les bambous et le pavillon d'or (8-14),
// le chemin des torii de Fushimi Inari (15-22), la pagode, les stands du Matsuri et la cantine (23-25)
const KY_X=[200,290,300,210,110,100,190,290,300,220,120,100,150,250,300,290,200,110,100,170,260,300,230,140,200];
function kyLayout(){
  const P=[];for(let d=1;d<=KY_DAYS.length;d++)P[d]={d,x:KY_X[d-1],u:230+(d-1)*96};
  const top=P[KY_DAYS.length].u,H=top+380,way=[{x:200,u:60},...P.slice(1),{x:200,u:top+160}];
  return {P,way,H,guest:{x:340,u:P[22].u+60},yuz:{x:pathX(way,150)<200?300:100,u:120},cafe:{x:200,u:top+190},river:(P[6].u+P[7].u)/2};
}
const KY_DEFS=`<linearGradient id="ky-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a6a46"/><stop offset="1" stop-color="#6e4630"/></linearGradient>
  <linearGradient id="ky-roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7486a0"/><stop offset="1" stop-color="#4c5a72"/></linearGradient>
  <linearGradient id="ky-red" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f06a4c"/><stop offset="1" stop-color="#cc4430"/></linearGradient>
  <linearGradient id="ky-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe08a"/><stop offset=".6" stop-color="#f2c45a"/><stop offset="1" stop-color="#d6a03a"/></linearGradient>
  <linearGradient id="ky-bamboo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b6dc8a"/><stop offset="1" stop-color="#7aae5a"/></linearGradient>
  <radialGradient id="ky-sakura" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe0ea"/><stop offset=".7" stop-color="#f9c4d2"/><stop offset="1" stop-color="#f2a8bc"/></radialGradient>
  <radialGradient id="ky-leaf" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#b6dc8e"/><stop offset=".7" stop-color="#86c070"/><stop offset="1" stop-color="#6aa65c"/></radialGradient>
  <linearGradient id="ky-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6e0ee"/><stop offset=".5" stop-color="#8cc8de"/><stop offset="1" stop-color="#6fb2cc"/></linearGradient>
  <linearGradient id="ky-moss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe2a8"/><stop offset="1" stop-color="#aacd88"/></linearGradient>
  <radialGradient id="ky-glow"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".95"/><stop offset=".45" stop-color="#ffb27a" stop-opacity=".45"/><stop offset="1" stop-color="#ffb27a" stop-opacity="0"/></radialGradient>`;
const kyLantern=(x,y,k=1)=>`<circle cx="${x}" cy="${y}" r="${16*k}" fill="url(#ky-glow)"/><ellipse cx="${x}" cy="${y}" rx="${7*k}" ry="${9*k}" fill="#e0503c" ${BO2}/><path d="M${x-5*k} ${y-8*k} H${x+5*k} M${x-5*k} ${y+8*k} H${x+5*k}" stroke="${INK}" stroke-width="2.4"/><path d="M${x-4*k} ${y-3*k} Q${x} ${y-5*k} ${x+4*k} ${y-3*k}" stroke="#ffb09a" stroke-width="1.4" fill="none"/>`;
const kyTorii=(x,y,k=1)=>{const w=30*k,h=44*k;return `<path d="M${x-w*.7} ${y} V${y-h}" stroke="${INK}" stroke-width="${8*k+2}" stroke-linecap="round"/><path d="M${x+w*.7} ${y} V${y-h}" stroke="${INK}" stroke-width="${8*k+2}" stroke-linecap="round"/><path d="M${x-w*.7} ${y} V${y-h}" stroke="#e0503c" stroke-width="${8*k-1}"/><path d="M${x+w*.7} ${y} V${y-h}" stroke="#e0503c" stroke-width="${8*k-1}"/>`
  +`<rect x="${x-w}" y="${y-h*.78}" width="${w*2}" height="${5*k}" fill="#e0503c" ${BO2}/><path d="M${x-w-8*k} ${y-h-2*k} Q${x} ${y-h+4*k} ${x+w+8*k} ${y-h-2*k} L${x+w+6*k} ${y-h-9*k} Q${x} ${y-h-3*k} ${x-w-6*k} ${y-h-9*k}Z" fill="#3d2a35" ${BO2}/><path d="M${x-w-2*k} ${y-h+1} H${x+w+2*k}" stroke="#e0503c" stroke-width="${4*k}"/>`};
const kyMachiya=(x,y,w,h)=>{let g=shadow(x+w/2,y,w*.55)+`<rect x="${x}" y="${y-h}" width="${w}" height="${h}" fill="url(#ky-wood)" ${BO}/>`;
  for(let i=0;i<Math.floor((w-10)/6);i++)g+=`<path d="M${x+6+i*6} ${y-h*.62} V${y-4}" stroke="#5a3624" stroke-width="1.8"/>`;
  g+=`<path d="M${x-8} ${y-h+2} Q${x+w/2} ${y-h-6} ${x+w+8} ${y-h+2} L${x+w} ${y-h-16} H${x}Z" fill="url(#ky-roof)" ${BO}/>`+Array.from({length:Math.floor(w/9)},(_,i)=>`<path d="M${x+4+i*9} ${y-h-13} V${y-h-1}" stroke="#3e4a5e" stroke-width="1.2"/>`).join("");
  return g+`<rect x="${x+w*.18}" y="${y-h*.86}" width="${w*.64}" height="${h*.2}" rx="2" fill="#f4e8cf" ${K2}/>`+[1,2,3].map(i=>`<path d="M${x+w*.18+i*w*.16} ${y-h*.86} V${y-h*.66}" stroke="#a8825a" stroke-width="1.2"/>`).join("")+kyLantern(x+w-6,y-h*.5,.8)};
const kyBamboo=(x,y,k=1)=>shadow(x,y,22*k)+[[-12,96,0],[-4,118,1],[5,104,2],[13,88,3]].map(([a,h,i])=>{const X=x+a*k,H=h*k;let g=`<rect x="${X-3*k}" y="${y-H}" width="${6*k}" height="${H}" rx="${2*k}" fill="url(#ky-bamboo)" ${K2}/>`;
  for(let j=1;j<5;j++)g+=`<path d="M${X-3*k} ${y-H*j/5} h${6*k}" stroke="#5f8a46" stroke-width="1.4"/>`;
  return g+`<path d="M${X} ${y-H*.7} q${(i%2?10:-10)*k} ${-6*k} ${(i%2?18:-18)*k} ${-2*k} q${(i%2?-8:8)*k} ${4*k} ${(i%2?-18:18)*k} ${2*k}Z M${X} ${y-H*.9} q${(i%2?-9:9)*k} ${-8*k} ${(i%2?-16:16)*k} ${-5*k} q${(i%2?7:-7)*k} ${5*k} ${(i%2?16:-16)*k} ${5*k}Z" fill="#9ccf72" ${K2}/>`}).join("");
const kySakura=(x,y,k=1)=>shadow(x,y,26*k)+`<path d="M${x-4*k} ${y} Q${x-2*k} ${y-18*k} ${x} ${y-26*k} M${x} ${y-20*k} Q${x+8*k} ${y-26*k} ${x+14*k} ${y-30*k}" fill="none" stroke="#8a5a4a" stroke-width="${5*k}" stroke-linecap="round"/>`
  +[[-14,-34,15],[8,-40,18],[22,-30,12],[-4,-50,14]].map(([a,b,r])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r="${r*k}" fill="url(#ky-sakura)" ${K2}/>`).join("")+[[-16,-38],[6,-46],[20,-34],[-6,-54]].map(([a,b])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r="${2.6*k}" fill="#fff"/>`).join("");
const kyPine=(x,y,k=1)=>shadow(x,y,24*k)+`<path d="M${x} ${y} Q${x-4*k} ${y-20*k} ${x+6*k} ${y-34*k}" fill="none" stroke="#8a6a4a" stroke-width="${5*k}" stroke-linecap="round"/>`+[[-14,-30,20],[10,-40,22],[-2,-52,16]].map(([a,b,r])=>`<ellipse cx="${x+a*k}" cy="${y+b*k}" rx="${r*k}" ry="${r*.45*k}" fill="url(#ky-leaf)" ${K2}/>`).join("");
const kyToro=(x,y)=>shadow(x,y,12)+`<rect x="${x-3}" y="${y-22}" width="6" height="22" fill="#cfc6b6" ${K2}/><rect x="${x-9}" y="${y-34}" width="18" height="12" rx="2" fill="#e6dfd0" ${K2}/><rect x="${x-4}" y="${y-31}" width="8" height="6" fill="#ffd27a"/><path d="M${x-13} ${y-34} L${x} ${y-44} L${x+13} ${y-34}Z" fill="#b9b0a0" ${K2}/>`;
const kyFoxStatue=(x,y,f=1)=>shadow(x,y,13)+`<g transform="translate(${x} ${y}) scale(${f} 1)"><rect x="-11" y="-8" width="22" height="8" rx="2" fill="#bdb4a4" ${K2}/><path d="M-7 -8 Q-9 -26 -2 -30 L-5 -40 L1 -33 L5 -40 L5 -29 Q9 -24 7 -8Z" fill="#e6dfd0" ${K2}/><path d="M7 -12 Q16 -18 12 -30 Q8 -22 5 -18Z" fill="#e6dfd0" ${K2}/><path d="M-6 -22 Q0 -16 6 -22 L4 -16 Q0 -13 -4 -16Z" fill="#e0503c" ${K2}/></g>`;
const kyKinkaku=(x,y)=>{let g=`<ellipse cx="${x}" cy="${y+10}" rx="86" ry="22" fill="url(#ky-water)" ${BO}/><path d="M${x-40} ${y+14} q8 -4 16 0 M${x+20} ${y+20} q8 -4 16 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  g+=`<rect x="${x-34}" y="${y-30}" width="68" height="30" fill="#f6efe2" ${BO}/><path d="M${x-44} ${y-30} Q${x} ${y-38} ${x+44} ${y-30} L${x+36} ${y-40} H${x-36}Z" fill="#5a4a3a" ${BO}/>`;
  g+=`<rect x="${x-28}" y="${y-62}" width="56" height="22" fill="url(#ky-gold)" ${BO}/><path d="M${x-38} ${y-62} Q${x} ${y-70} ${x+38} ${y-62} L${x+30} ${y-72} H${x-30}Z" fill="#5a4a3a" ${BO}/>`;
  g+=`<rect x="${x-18}" y="${y-88}" width="36" height="16" fill="url(#ky-gold)" ${BO}/><path d="M${x-28} ${y-88} Q${x} ${y-96} ${x+28} ${y-88} L${x} ${y-104}Z" fill="#5a4a3a" ${BO}/><path d="M${x} ${y-104} V${y-112}" stroke="#e0b860" stroke-width="3"/><circle cx="${x}" cy="${y-114}" r="3" fill="#ffe08a" ${K2}/>`;
  return g+[-20,-6,8,22].map(a=>`<path d="M${x+a} ${y-26} V${y-4}" stroke="#d8ccb6" stroke-width="1.6"/>`).join("")+`<path d="M${x-22} ${y-58} V${y-44} M${x} ${y-58} V${y-44} M${x+22} ${y-58} V${y-44}" stroke="#c99a3a" stroke-width="1.6"/>`};
const kyPagoda=(x,y,k=1)=>{let g=shadow(x,y,34*k);for(let i=0;i<5;i++){const yy=y-i*24*k,w=(30-i*4)*k;
  g+=`<rect x="${x-w*.62}" y="${yy-16*k}" width="${w*1.24}" height="${16*k}" fill="#d9774e" ${K2}/><path d="M${x-w-10*k} ${yy-16*k} Q${x} ${yy-24*k} ${x+w+10*k} ${yy-16*k} L${x+w} ${yy-24*k} H${x-w}Z" fill="url(#ky-roof)" ${K2}/>`}
  return g+`<path d="M${x} ${y-120*k} V${y-146*k}" stroke="#e0b860" stroke-width="${3*k}"/>`+[0,1,2,3].map(i=>`<circle cx="${x}" cy="${y-(126+i*5)*k}" r="${2.2*k}" fill="#ffe08a" stroke="${INK}" stroke-width="1"/>`).join("")};
const kyShrine=(x,y)=>shadow(x,y,46)+`<rect x="${x-40}" y="${y-8}" width="80" height="8" fill="#cfc6b6" ${BO}/><rect x="${x-32}" y="${y-40}" width="64" height="32" fill="#f6efe2" ${BO}/><rect x="${x-26}" y="${y-36}" width="10" height="28" fill="#e0503c" ${K2}/><rect x="${x+16}" y="${y-36}" width="10" height="28" fill="#e0503c" ${K2}/><path d="M${x-48} ${y-40} Q${x} ${y-50} ${x+48} ${y-40} L${x+30} ${y-64} H${x-30}Z" fill="#7a5a44" ${BO}/><path d="M${x-12} ${y-36} H${x+12}" stroke="#e0503c" stroke-width="3"/><circle cx="${x}" cy="${y-28}" r="5" fill="#f7d77a" ${K2}/>`;
const kyYatai=(x,y,c)=>shadow(x,y,30)+`<rect x="${x-26}" y="${y-22}" width="52" height="22" fill="#c99a6a" ${BO}/><path d="M${x-26} ${y-22} V${y-48} M${x+26} ${y-22} V${y-48}" stroke="${INK}" stroke-width="3"/><path d="M${x-32} ${y-46} H${x+32} L${x+28} ${y-36} H${x-28}Z" fill="${c}" ${BO}/>`+[0,1,2,3,4].map(i=>`<path d="M${x-28+i*14} ${y-36} q7 6 14 0" fill="${c}" ${K2}/>`).join("")+`<rect x="${x-18}" y="${y-18}" width="36" height="8" rx="2" fill="#fff6e4" ${K2}/>`;
const kyStones=(x,y)=>[[-46,-4],[-22,6],[0,-4],[22,6],[46,-4]].map(([a,b],i)=>`<ellipse cx="${x+a}" cy="${y+b}" rx="${i%2?12:10}" ry="7" fill="#d8d0c0" ${BO2}/><ellipse cx="${x+a-3}" cy="${y+b-2}" rx="4" ry="1.6" fill="#fff" opacity=".7"/>`).join("");
function kyCafeSVG(x,y){
  let s=shadow(x,y+4,110);
  // l'étage : treillis clair, petit toit
  s+=`<rect x="${x-84}" y="${y-160}" width="168" height="36" fill="url(#ky-wood)" ${BO}/><rect x="${x-70}" y="${y-154}" width="140" height="24" rx="2" fill="#f4e8cf" ${K2}/>`+Array.from({length:13},(_,i)=>`<path d="M${x-70+i*11.6} ${y-154} V${y-130}" stroke="#8a6a4a" stroke-width="1.4"/>`).join("");
  s+=`<path d="M${x-100} ${y-158} Q${x} ${y-172} ${x+100} ${y-158} L${x+86} ${y-180} H${x-86}Z" fill="url(#ky-roof)" ${BO}/>`;
  // le rez-de-chaussée : bois sombre, treillis, grand toit aux bouts relevés
  s+=`<rect x="${x-104}" y="${y-100}" width="208" height="100" fill="url(#ky-wood)" ${BO}/>`;
  for(let i=0;i<10;i++){s+=`<path d="M${x-96+i*6} ${y-74} V${y-6}" stroke="#5a3624" stroke-width="2"/><path d="M${x+42+i*6} ${y-74} V${y-6}" stroke="#5a3624" stroke-width="2"/>`}
  s+=`<path d="M${x-126} ${y-96} Q${x-112} ${y-102} ${x-102} ${y-108} H${x+102} Q${x+112} ${y-102} ${x+126} ${y-96} L${x+112} ${y-128} H${x-112}Z" fill="url(#ky-roof)" ${BO}/>`+Array.from({length:22},(_,i)=>`<path d="M${x-104+i*10} ${y-125} V${y-108}" stroke="#3e4a5e" stroke-width="1.3"/>`).join("");
  // l'enseigne, la porte et son noren indigo au renard blanc
  s+=`<rect x="${x-72}" y="${y-92}" width="144" height="20" rx="3" fill="#f4e8cf" ${BO}/><text x="${x}" y="${y-77}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="12" fill="${INK}">Kitsune Shokudō</text>`;
  s+=`<rect x="${x-24}" y="${y-64}" width="48" height="64" fill="#3a2a24" ${BO}/>`+[0,1,2].map(i=>`<rect x="${x-28+i*19}" y="${y-66}" width="18" height="28" fill="#3d4e7a" ${K2}/>`).join("")+`<circle cx="${x}" cy="${y-52}" r="7" fill="#fffaf2" ${K2}/><path d="M${x-5} ${y-56} l1 -5 l3 3 M${x+5} ${y-56} l-1 -5 l-3 3" fill="#fffaf2" ${K2}/>`;
  s+=kyLantern(x-74,y-64,1.1)+kyLantern(x+74,y-64,1.1);
  // dehors, un banc sous une ombrelle rouge
  s+=[x-150,x+150].map(t=>`<path d="M${t} ${y+30} V${y-30}" stroke="${INK}" stroke-width="3"/><path d="M${t-34} ${y-26} Q${t} ${y-56} ${t+34} ${y-26} Q${t} ${y-34} ${t-34} ${y-26}Z" fill="#e0503c" ${BO}/><rect x="${t-26}" y="${y+12}" width="52" height="8" rx="2" fill="#e0503c" ${BO}/><path d="M${t-20} ${y+20} V${y+30} M${t+20} ${y+20} V${y+30}" stroke="${INK}" stroke-width="3"/>`).join("");
  return s;
}
// la grande porte d'entrée : un torii, comme ceux du chemin
function kyArchSVG(x,y){return kyTorii(x,y+24,2.4)}
function kyMapSVG(L){
  const {P,way,H,cafe}=L,Y=u=>H-u,hz=Y(cafe.u)+40;
  const u7=P[8].u,u12=P[14].u,u13=P[15].u,u18=P[22].u;
  const defs=KY_DEFS+`<pattern id="ky-grav" width="40" height="34" patternUnits="userSpaceOnUse"><g fill="#d9ceb6"><circle cx="6" cy="8" r="1.6"/><circle cx="24" cy="4" r="1.2"/><circle cx="32" cy="20" r="1.6"/><circle cx="14" cy="26" r="1.2"/></g></pattern>
    <linearGradient id="ky-gnd" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}"><stop offset="0" stop-color="#ece4d0"/><stop offset=".5" stop-color="#efe8d8"/><stop offset="1" stop-color="#ebe3d2"/></linearGradient>
    <linearGradient id="ky-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9a4b4"/><stop offset=".55" stop-color="#f8cfc2"/><stop offset="1" stop-color="#fdeedd"/></linearGradient>
    <radialGradient id="ky-sun"><stop offset="0" stop-color="#fff2b8" stop-opacity=".9"/><stop offset="1" stop-color="#fff2b8" stop-opacity="0"/></radialGradient>
    <radialGradient id="ky-vig" cx=".5" cy=".5" r=".75"><stop offset=".7" stop-color="#5b4250" stop-opacity="0"/><stop offset="1" stop-color="#5b4250" stop-opacity=".12"/></radialGradient>`;
  let s=`<rect width="400" height="${H}" fill="url(#ky-gnd)"/><rect width="400" height="${H}" fill="url(#ky-grav)"/>`;
  // le ciel du soir, les collines et la pagode derrière le salon de thé
  s+=`<rect x="0" y="0" width="400" height="${hz}" fill="url(#ky-sky)"/><circle cx="90" cy="${hz-160}" r="70" fill="url(#ky-sun)"/><circle cx="90" cy="${hz-160}" r="17" fill="#fff4c8" ${BO}/>`;
  s+=`<path d="M0 ${hz-60} Q80 ${hz-120} 170 ${hz-80} Q260 ${hz-130} 330 ${hz-84} Q370 ${hz-100} 400 ${hz-90} V${hz} H0Z" fill="#a9c79a" ${BO}/><path d="M0 ${hz-30} Q120 ${hz-70} 230 ${hz-40} Q320 ${hz-60} 400 ${hz-36} V${hz} H0Z" fill="#93b585" ${BO}/>`;
  s+=kyPagoda(330,hz-22,.9);
  s+=`<g><animateTransform attributeName="transform" type="translate" values="-60 0;460 -10" dur="28s" repeatCount="indefinite"/>${[[0,hz-200],[14,hz-208],[26,hz-198]].map(([x,y])=>`<path d="M${x-6} ${y} q3 -4 6 0 q3 -4 6 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`).join("")}</g>`;
  s+=`<path d="M0 ${hz} H400" stroke="${INK}" stroke-width="2"/>`;
  // la forêt de bambous et le jardin du pavillon d'or : de la mousse
  s+=`<path d="M-10 ${Y(u7+30)} Q120 ${Y(u7+10)} 230 ${Y(u7+40)} Q260 ${Y(u12-60)} 190 ${Y(u12-20)} Q90 ${Y(u12+20)} -10 ${Y(u12-10)}Z" fill="url(#ky-moss)" ${BO}/>`;
  // la montagne d'Inari : une colline boisée, plus claire au sommet
  s+=`<path d="M410 ${Y(u13+6)} Q404 ${Y(u18-20)} 304 ${Y(u18-24)} Q210 ${Y(u18-40)} 194 ${Y(u18-200)} Q186 ${Y(u13+90)} 224 ${Y(u13+24)} Q304 ${Y(u13-24)} 410 ${Y(u13+6)}Z" fill="url(#ky-moss)" ${BO}/>`;
  // la rivière Kamo, ses berges, des reflets
  const ry=Y(L.river),bx=pathX(way,L.river);
  s+=`<path d="M-10 ${ry-34} Q100 ${ry-42} 200 ${ry-32} T410 ${ry-38} V${ry+32} Q300 ${ry+42} 200 ${ry+34} T-10 ${ry+38}Z" fill="url(#ky-water)" ${BO}/>`;
  s+=`<g><animate attributeName="opacity" values=".9;.4;.9" dur="4s" repeatCount="indefinite"/>${[[260,-12],[360,20],[40,18],[320,4],[110,-14]].map(([x,o])=>`<path d="M${x} ${ry+o} q8 -4 16 0 q8 4 16 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
  // le chemin et la part déjà faite ; les pierres de gué à la place d'un pont
  const pts=way.map(p=>[p.x,Y(p.u)]),d=smooth(pts);
  s+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fdf1df" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ead2bb" stroke-width="4" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  const k=way.findIndex(p=>p.d===itCur());if(k>0)s+=`<path d="${smooth(pts.slice(0,k+1))}" fill="none" stroke="#f59a8b" stroke-width="7" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  s+=`<path d="M${bx-34} ${ry-36} V${ry+36} H${bx+34} V${ry-36}Z" fill="url(#ky-water)"/>`+kyStones(bx,ry);
  // ce qui est posé, chaque chose une fois
  const it=[];const at=(x,u,f)=>it.push({x,u,f});
  // la rue de Gion : maisons en bois des deux côtés, lanternes de pierre, un cerisier
  [[0,150,66,92],[334,190,66,88],[0,370,60,84],[340,430,60,80],[0,536,58,70],[338,640,60,78],[0,700,58,70]].forEach(([x,u,w,h])=>at(x+w/2,u,(cx,y)=>kyMachiya(x,y,w,h)));
  at(300,282,kyToro);at(110,250,kyToro);at(250,610,kyToro);at(300,520,(x,y)=>kySakura(x,y,.9));at(40,250,(x,y)=>kySakura(x,y,.8));
  // les bambous et le pavillon d'or
  at(60,u7+90,(x,y)=>kyBamboo(x,y,1));at(26,u7+40,(x,y)=>kyBamboo(x,y,.8));at(160,u7+160,(x,y)=>kyBamboo(x,y,.9));at(36,u12-60,(x,y)=>kyBamboo(x,y,1.1));at(380,u7+60,(x,y)=>kyPine(x,y,.8));
  at(110,u12-180,(x,y)=>kyKinkaku(x,y));at(370,u12-40,(x,y)=>kyPine(x,y,.9));at(380,u12+30,kyToro);
  // la montagne d'Inari : renards de pierre, le sanctuaire en haut ; les torii sont posés sur le chemin plus bas
  at(250,u13+60,(x,y)=>kyFoxStatue(x,y,1));at(340,u13+40,(x,y)=>kyFoxStatue(x,y,-1));at(100,u18+20,kyShrine);at(372,u13+200,(x,y)=>kyPine(x,y,.8));at(40,u13+120,(x,y)=>kySakura(x,y,.9));at(30,u18-60,(x,y)=>kyPine(x,y,.8));at(160,u13+230,kyToro);
  // devant le salon de thé : les stands du Matsuri, une guirlande de lanternes
  at(70,cafe.u-90,(x,y)=>kyYatai(x,y,"#e0503c"));at(330,cafe.u-96,(x,y)=>kyYatai(x,y,"#7a9ad8"));at(60,cafe.u-200,(x,y)=>kySakura(x,y,1));at(350,u18+150,(x,y)=>kySakura(x,y,.8));
  it.sort((a,b)=>b.u-a.u).forEach(e=>s+=e.f(+e.x.toFixed(1),+Y(e.u).toFixed(1)));
  // le chemin des torii : une porte rouge tous les 34 pas, sauf sur les journées
  for(let u=u13-60;u<u18+40;u+=34){if(P.some(p=>Math.abs(p.u-u)<24))continue;s+=kyTorii(pathX(way,u),Y(u)+14,.82)}
  s+=`<path d="M40 ${Y(cafe.u-40)} Q200 ${Y(cafe.u-70)} 360 ${Y(cafe.u-40)}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+[70,110,150,190,230,270,310].map(x=>{const t=(x-40)/320,y=Y(cafe.u-40)-(-60*t*(1-t))*1;return kyLantern(x,y+10,.7)}).join("");
  s+=kyArchSVG(200,Y(60))+kyCafeSVG(cafe.x,Y(cafe.u));
  s+=`<rect width="400" height="${H}" fill="url(#ky-vig)" pointer-events="none"/>`;
  return `<svg viewBox="0 0 ${ITW} ${H}" aria-hidden="true"><defs>${defs}</defs>${s}</svg>`;
}

/* ---------- l'histoire : le Matsuri ---------- */
// une scène se joue à la fin de la journée, à sa première réussite (Q.scenes, comme Paris)
const KY_SCENES={
  1:[["yuzu","joy","Ton premier service au Kitsune Shokudō ! Les clients ont adoré."],
     ["yuzu","open","Dans vingt-cinq jours, c'est le Matsuri, le grand festival d'été. Chaque année, on y tient un stand…"],
     ["yuzu","shy","Mais cette année, je suis toute seule. Tu m'aides à monter une équipe ?"]],
  2:[["daifuku","joy","Une ramune ! J'adore le petit bruit de la bille."],["daifuku","surprise","Un stand au Matsuri ? Je veux en être ! Je goûterai tout. Pour vérifier."],
     ["yuzu","joy","Daifuku rejoint l'équipe ! Surtout côté dégustation…"]],
  3:[["origami","open","Tu vois l'oiseau en papier, sur ma tête ? C'est une grue, l'origami le plus célèbre du Japon. Je l'ai plié en attendant mon onigiri."],
     ["origami","joy","Ici, on dit que plier mille grues porte bonheur. Pour le stand du Matsuri, je vais en plier mille, et des lanternes : je m'en occupe !"],["yuzu","joy","Origami fait partie de l'équipe !"]],
  4:[["daifuku","joy","Des beignets de crevettes ! Croustillants dehors, tout doux dedans. Comme moi."],["yuzu","open","Elle en a mangé six. Pour vérifier."]],
  5:[["chanko","joy","Encore un plateau ! … Et un autre !"],["oyama","surprise","Il a mangé plus que moi ?! Impossible !"],
     ["chanko","joy","Victoire ! Le ventre de Chanko est le plus grand du quartier !"],["oyama","open","Je veux ma revanche. Même comptoir, dans six jours."],
     ["yuzu","shy","Ils ont vidé toute la vitrine… mais quelle journée !"]],
  6:[["yuzu","surprise","Ce matin, toutes les lanternes de la rue étaient réparées. Personne n'a rien vu…"],
     ["origami","shy","Ce n'est pas moi. Moi, je plie. Je ne répare pas."],["yuzu","open","Un mystère…"]],
  7:[["yuzu","joy","Les dango ! Au Matsuri, c'est LA douceur : trois boules sur une brochette."],
     ["yuzu","open","Chaque client veut son ordre à lui : sakura, blanc, matcha… On les enfile de bas en haut. Raté ? Touche la brochette pour la vider."],
     ["daifuku","joy","Trois petites boules sur un bâton… C'est moi en brochette !"]],
  8:[["hayate","open","…"],["tsuba","open","Tiens, Hayate. Toujours sans maître ? Un samouraï sans maître, ce n'est qu'un vagabond."],
     ["hayate","shy","… Je cherche."],["yuzu","open","Il vient tous les jours. Il s'incline, il paie, il repart. Je l'aime bien, moi."]],
  9:[["kage","open","…"],["yuzu","surprise","Kyaa ! D'où tu sors, toi ?"],
     ["kage","shy","Je suis là depuis une heure. Les lanternes, c'est moi. Je peux aider… en silence."],["yuzu","joy","Kage, le renard ninja, rejoint l'équipe !"]],
  10:[["yuzu","joy","Les sushis ! Pour le Matsuri, ce sera notre grande spécialité : un plateau de trois."],
      ["yuzu","open","Saumon, maki, tamago, chacun dans son ordre. On les pose de gauche à droite. Raté ? Touche le plateau pour le vider."],
      ["daifuku","surprise","Deux comptoirs à composer… On est une vraie cantine, maintenant !"]],
  11:[["oyama","joy","Hmm hmm. Un dernier plateau de sushis ? Non… deux."],["chanko","sad","Je… n'en peux plus…"],
      ["oyama","joy","Le grand champion reprend son titre !"],["chanko","open","Une belle, alors. Dans six jours."]],
  13:[["yuzu","joy","Le mochi fraise arrive au menu… avec un deuxième four, rien que pour lui et les douceurs !"],
      ["yuzu","surprise","Le premier four cuit les onigiris, la tempura et les taiyakis ; le deuxième, les mochis et les dorayakis. Deux fournées à la fois… mais deux fours à surveiller !"]],
  14:[["hoji","open","Hmm. Alors c'est vous, la cantine qui veut servir du matcha au Matsuri."],["hoji","open","Je suis Hōji. Je sers le thé dans ce quartier depuis soixante ans."],
      ["yuzu","shy","Sensei… vous goûteriez le nôtre ?"],["hoji","surprise","… Pas mal. Revenez me voir quand il sera parfait."]],
  15:[["hayate","open","Yuzu-san. Votre stand, au Matsuri. Il lui faut quelqu'un pour veiller."],["yuzu","surprise","Tu veux… nous protéger ?"],
      ["hayate","joy","Un rōnin peut choisir ce qu'il sert. Je choisis ce Shokudō."],["tsuba","sad","Servir une cantine ? Quelle honte pour un samouraï…"]],
  16:[["yuzu","joy","La crème ! Sur un hōjicha… et bientôt dans nos dorayakis."],["daifuku","joy","Je vérifie que c'est bon. … C'est bon."]],
  17:[["yuzu","surprise","Ils ont fini… en même temps ?!"],["chanko","shy","Pile le même nombre de plats…"],["oyama","shy","… Égalité."],
      ["chanko","joy","Et si on faisait équipe au concours de mangeurs du Matsuri ?"],["oyama","joy","Ensemble, personne ne nous battra !"]],
  19:[["hoji","joy","Celui-ci est parfait. Le secret, c'est la patience. Et un fouet en bambou bien souple."],
      ["hoji","open","Je viendrai au Matsuri. Et je prendrai mon thé chez vous, de temps en temps."],["yuzu","joy","Le sensei rejoint l'équipe !"]],
  20:[["tsuba","surprise","Hier soir, le vent a renversé les lanternes du stand… et c'est Hayate qui les a toutes rattrapées ?"],
      ["hayate","shy","Une a failli tomber sur le plateau de sushis. Inacceptable."],["tsuba","open","Hmm. Je m'étais peut-être trompé sur toi."]],
  22:[["origami","joy","Les mille oiseaux en papier sont prêts ! Enfin, neuf cent quatre-vingt-dix-neuf. Daifuku s'est assise sur le dernier."],
      ["hoji","open","On raconte que si les lanternes du chemin des torii brillent assez fort, la Dame aux neuf queues descend de la montagne."],
      ["kage","shy","J'ai… peut-être ajouté quelques lanternes."]],
  25:[["yuzu","surprise","C'est le soir du Matsuri ! Regarde notre stand !"],["daifuku","joy","Les sushis partent comme des petits pains !"],
      ["kage","surprise","… Là-haut. Sur le chemin des torii."],
      ["kyubi","open","Que de lumière, cette année… Je n'avais pas vu un stand aussi joyeux depuis cent ans."],
      ["kyubi","joy","Un plateau de sushis, et des dango, s'il te plaît. … Délicieux. On sent l'omotenashi."],
      ["hoji","shy","La Dame aux neuf queues… en personne."],
      ["tsuba","open","Hayate. Tu as trouvé un maître digne de toi : tout ce quartier."],["tsuba","joy","Je m'incline."],["hayate","joy","… Merci, Tsuba."],
      ["chanko","joy","Et le concours de mangeurs ? Gagné, à deux !"],
      ["yuzu","joy",`On a réussi, ${ME()} ! Le plus beau stand du Matsuri, c'est le nôtre !`]]
};
const kySceneDue=d=>KY_SCENES[d]&&!S.ky.read[d]&&!!S.ky.stars[d];
// l'accueil de Yuzu (09/11/2026, Joffray : expliquer qu'au Japon on respecte les clients, et pourquoi on sert du salé et du chaud)
function yuzuIntro(){
  itTalk([["yuzu","joy",`Irasshaimase ! Bienvenue à Kyoto, ${ME()} ! Moi, c'est Yuzu.`],
    ["yuzu","open","Ici, on dit omotenashi : chaque client est reçu comme un invité d'honneur. On le sert vite, avec le sourire, et on ne le fait jamais attendre."],
    ["yuzu","shy","Et les gens du quartier adorent manger chaud et salé : onigiri, tempura, sushis… Alors mon salon de thé est devenu un shokudō, une petite cantine."],
    ["yuzu","joy","On commence avec deux boissons, le matcha et la ramune, et deux plats : l'onigiri et la tempura de crevettes. Le reste viendra vite !"],
    ["yuzu","open","Et dans vingt-cinq jours, c'est le Matsuri, le grand festival d'été…"]],
    ()=>{if(!S.ky.intro){S.ky.intro=1;save();dailyBonus()}});
}
function kyScenes(done){
  const d=Object.keys(KY_SCENES).map(Number).find(kySceneDue);
  if(d){itTalk(KY_SCENES[d],()=>{S.ky.read[d]=1;if(d===19)toast("Sensei Hōji viendra maintenant au Shokudō.");save();
    // après la scène du jour 25, le défilé du Matsuri (matsuri.js), une seule fois
    if(d===25&&!S.ky.parade){S.ky.parade=1;save();kyParade(()=>kyScenes(done));return}
    kyScenes(done)});return}
  done();
}
function kyStory(){kyScenes(()=>{renderMapIt();dailyBonus()})}
function kyCarnet(){
  const rows=Object.keys(KY_SCENES).map(Number).map(d=>S.ky.read[d]
    ?`<div data-kyscene="${d}" style="cursor:pointer">${itRow(foxSVG(FOX[KY_SCENES[d][0][0]],{pose:"happy"}),d===25?"Le soir du Matsuri":`Jour ${d}`,KY_SCENES[d][0][2],"background:#fde8ec")}</div>`
    :`<div style="opacity:.55">${itRow(foxSVG(FOX.yuzu,{sil:1}),d===25?"Le soir du Matsuri":"Scène à découvrir",`Réussis le jour ${d} du quartier.`)}</div>`).join("");
  openSheet(`<h2>Le carnet du Matsuri</h2><div style="width:120px;margin:0 auto">${foxSVG(FOX.yuzu,{pose:"happy"})}</div>
  <p class="sub" style="text-align:center">Tout ce qui s'est passé depuis ton arrivée au Kitsune Shokudō. Touche une scène pour la revoir.</p>${rows}
  <div class="col" style="margin-top:10px"><button class="btn ghost wide" data-act="kyreset" type="button">Recommencer Kyoto depuis le jour 1</button></div>
  ${S.ky.read[25]?`<div class="col" style="margin-top:10px"><button class="btn wide" data-act="kyparade" type="button">Revoir le défilé du Matsuri</button></div>`:""}
  <div class="col" style="margin-top:10px"><button class="btn ghost wide" data-act="yuzuintro" type="button">Revoir l'accueil de Yuzu</button></div>`);
  $("sheet-in").querySelectorAll("[data-kyscene]").forEach(b=>b.onclick=()=>itTalk(KY_SCENES[+b.dataset.kyscene],kyCarnet));
}

/* ---------- le quartier dans le registre des mondes (data.js) ---------- */
WORLDS.kyoto={id:"kyoto",name:"Kyoto",cafe:"Kitsune Shokudō",short:"Shokudō",sv:()=>S.ky,days:KY_DAYS,s3:KY_S3,kit:KY_KIT,
  recDays:KY_REC,sumo:KY_SUMO,
  mark:d=>KY_SUMO[d]&&!S.ky.sumo[d]?foxArt(FOX.chanko,{portrait:1,expr:"joy"}):"",
  dayRow:d=>KY_SUMO[d]?itRow(foxSVG(FOX.chanko,{pose:"happy"}),"Défi des sumos !",`Chanko et Ōyama s'installent pour toute la journée et recommandent dès qu'ils sont servis. Sers-les vite !${S.ky.sumo[d]?" (déjà réussi)":" +40 pièces la première fois."}`,"background:#e8eefa"):"",
ovens:d=>d>=14?2:1,ovenOf:{croissant:0,cookie:0,taiyaki:0,mochi:1,gateau:1},
  opt:{lait:"Lait",chantilly:"Crème"},optItem:(r,o)=>o==="lait"&&r==="cafe"?"Matcha latte":`${REC[r].name} à la crème`,optWord:"la crème",optWords:{lait:"le lait",chantilly:"la crème"},
  optNews:{lait:"Touche « Lait », au bout du plateau, pour transformer un matcha en matcha latte."},
  // le plateau de sushis (clé « smoothie », comme le gelato)…
  gel:KY_SUSHI,gelSVG:kySushiSVG,tubSVG:x=>nigiriSVG(20,22,1.9,x),tubLabel:"Un sushi",cone:"le plateau",
  coneHint:"Touche les sushis <b>dans l'ordre de la commande</b>, de gauche à droite.",
  gelHint:g=>`Sushis : touche-les <b>dans l'ordre, de gauche à droite</b> (${gelName(g)}). Raté ? Touche le plateau.`,
  gelNew:"Dès la prochaine journée, les sushis : chaque client veut son plateau de trois dans son ordre à lui. Touche les sushis de gauche à droite.",
  // … et la brochette de dango, sur un deuxième comptoir (recette « dango »)
  gel2:{t:KY_DANGO,svg:kyDangoSVG,tub:x=>ballSVG(20,21,KY_DANGO[x].c,12),label:"Une boule",cone:"la brochette",
    coneHint:"Touche les boules <b>dans l'ordre de la commande</b>, de bas en haut.",
    hint:g=>`Dango : touche les boules <b>dans l'ordre, de bas en haut</b> (${g.split("").map(x=>KY_DANGO[x].n.toLowerCase()).join(" › ")}). Raté ? Touche la brochette.`,
    new:"Dès la prochaine journée, les dango ! Chaque client veut sa brochette dans son ordre : touche les boules de bas en haut."},
  optNew:"Touche « Crème », au bout du plateau, pour en mettre sur un hōjicha ou un dorayaki.",
  guest:"kyubi",guestBio:"Elle vient dans tous les cafés : elle paie le triple, mais elle est pressée.",
  reg:()=>[...KYF_REG,...KYF_REG,...KYF_REG,...(S.ky.read[19]?[FOX.hoji]:[]),...(S.ky.sumo[5]||S.ky.read[5]?[FOX.chanko,FOX.oyama]:[])],
  // musique du service, choix de Joffray le 09/11/2026 : le Matsuri « plus rapide » et le grand odaiko (accéléré à 158 bpm)
  // les jours des sumos, toujours les gros tambours (Joffray)
  music:d=>KY_SUMO[d]||d%2===0?"taiko5":"matsuri2",mapMusic:"torii",
  isOpen:()=>kyOpen(),lockMsg:"Réussis les 20 journées de Paris pour ouvrir Kyoto.",
  layout:()=>kyLayout(),mapSVG:L=>kyMapSVG(L),outside:()=>outsideKy(),
  mapExtra:(L,pc)=>`<button class="mguest ok" style="${pc(L.yuz.x,L.yuz.u)}" data-act="yuzu" type="button" aria-label="Yuzu">${foxSVG(FOX.yuzu,{pose:"happy"})}<em>Yuzu</em></button>`
    +(S.ky.read[19]?`<button class="mguest ok" style="${pc(L.cafe.x-142,L.cafe.u-36)}" data-act="yuzu" type="button" aria-label="Sensei Hōji">${foxSVG(FOX.hoji,{pose:"sit"})}<em>Hōji</em></button>`:"")
    +`<button class="mnext" style="${pc(200,52)}" data-act="paris" type="button" aria-label="Retour à Paris"></button>`,
  arrive:()=>{if(!S.ky.intro)yuzuIntro();else kyStory()},
  scenes:done=>kyScenes(done),
  news:(d,st,prev,news)=>{if(KY_SUMO[d]&&st&&!S.ky.sumo[d]){S.ky.sumo[d]=1;S.coins+=40;news.push(itRow(foxSVG(FOX.oyama,{pose:"happy"}),"Défi des sumos réussi !","Ils n'ont pas bougé de la journée, et tu les as nourris jusqu'au bout. +40 pièces !","background:#e8eefa"))}}
};
// le monde affiché au chargement (le dernier visité, s'il est ouvert)
WORLD=WORLDS[S.world]&&WORLDS[S.world].isOpen()?S.world:"";
