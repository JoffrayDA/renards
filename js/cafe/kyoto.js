/* Café Frimousse : Kyoto, troisième quartier de la Ville (08/11/2026, choix de Joffray parmi Japon, Montagne, Plage, Londres),
   refait le 09/11/2026 en vrai défi de fin (Joffray : « faut que ça se complique ! ») : 30 journées plus dures (25 avant le 19/11/2026), la petite cantine
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
   du quartier la rejoint ; le soir du Matsuri (jour 30, 25 avant le 19/11/2026), Kyūbi, la Dame aux neuf queues, descend du chemin des torii.
   On y entre depuis l'écran des mondes, ou par le panneau au-dessus du Café de Paris, une fois ses 30 journées réussies
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
  {id:"kyubi",name:"Kyūbi",rar:"legend",acc:"inari",tail:"neuf",eye:"#d8283a",flick:1,c:{b:"#fbf4ea",ch:"#ffffff",e:"#e0b860",s:"#d4a84a",t:"#f7d77a"},bio:"La Dame aux neuf queues, gardienne du chemin des torii. Elle ne descend que pour les fêtes les plus lumineuses."}
];
KYF.forEach(f=>{f.world="kyoto";FOX[f.id]=f});
// les sumos (big) ne viennent pas comme les autres : seulement après leur premier défi, et rarement (Joffray, 09/11/2026)
const KYF_REG=KYF.filter(f=>f.rar==="commun"&&!f.big);

/* ---------- les journées ---------- */
// rythme d'un jour de référence du premier monde, de 24 à 40, puis au-delà (hard : plus de clients, plus serrés, moins patients) ;
// graine et objectif par `python tools/balance-bot.py --kyoto`
// plus dur partout (09/11/2026, Joffray : « assez facile, surtout avec les améliorations ») : hard de 1,1 au jour 1 à 1,6 au jour 25
const KY_DAYS=[{base:24,hard:1.1,seed:4,goal:210},{base:25,hard:1.12,seed:3,goal:219},{base:26,hard:1.14,seed:4,goal:236},{base:27,hard:1.16,seed:11,goal:257},{base:28,hard:1.18,seed:5,goal:278},{base:29,hard:1.21,seed:8,goal:304},{base:30,hard:1.23,seed:13,goal:323},{base:31,hard:1.25,seed:10,goal:351},{base:32,hard:1.27,seed:13,goal:380},{base:33,hard:1.29,seed:8,goal:418},{base:34,hard:1.31,seed:13,goal:379},{base:35,hard:1.33,seed:11,goal:467},{base:36,hard:1.35,seed:13,goal:484},{base:37,hard:1.37,seed:12,goal:520},{base:38,hard:1.39,seed:15,goal:507},{base:39,hard:1.42,seed:5,goal:550},{base:40,hard:1.44,seed:7,goal:404},{base:40,hard:1.46,seed:9,goal:597},{base:40,hard:1.48,seed:2,goal:613},{base:40,hard:1.5,seed:2,goal:621},{base:40,hard:1.52,seed:2,goal:649},{base:40,hard:1.54,seed:12,goal:683},{base:40,hard:1.56,seed:6,goal:521},{base:40,hard:1.58,seed:6,goal:713},{base:40,hard:1.6,seed:4,goal:699},{base:40,hard:1.63,seed:4,goal:715},{base:40,hard:1.66,seed:12,goal:719},{base:40,hard:1.69,seed:12,goal:730},{base:40,hard:1.72,seed:4,goal:730},{base:40,hard:1.75,seed:4,goal:723}];
const KY_S3=[2.02,2.04,2.6,2.35,2.6,2.38,2.5,1.95,2.12,2.29,2.6,2.15,2.23,2.0,2.25,1.97,2.6,1.83,1.89,1.93,1.84,2.0,2.6,1.91,1.88,1.76,2.09,2.1,1.91,2.01];
// l'équipement prévu pour chaque journée : celui de l'Italie (30 journées toutes les deux depuis le 19/11/2026)
const KY_KIT=IT_KIT;
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
const KY_SUMO={5:["chanko","oyama"],11:["oyama","chanko"],17:["chanko","oyama"],23:["oyama","chanko"]};
// le soir du Matsuri (jour 25 avant le 19/11/2026)
const KY_FIN=30;
// la petite scène au début d'un jour de défi des sumos (game.js, sumoIntro), avant qu'ils entrent
const KY_SUMO_TALK={
  5:[["yuzu","surprise","Tu entends ce grondement ? Boum… boum…"],
     ["chanko","open","Pousse-toi, Ōyama. Cette cantine, c'est MON territoire."],
     ["oyama","open","Ton territoire ? Dohohoho ! Regarde-toi : on dirait un mochi dégonflé."],
     ["chanko","surprise","Un mochi… DÉGONFLÉ ?!"],
     ["yuzu","shy","Défi des sumos ! Aujourd'hui, la cantine est rien qu'à eux : chacun commande deux plateaux à la fois, et en redemande dès qu'il est servi."]],
  11:[["oyama","open","Tiens, le mochi dégonflé est revenu."],["chanko","open","Et toi, la boulette ! Tu as mis ta ceinture à l'envers, ce matin ?"],
      ["oyama","surprise","… C'est vrai ?"],["chanko","joy","Gwahahaha ! Il a vérifié !"],
      ["yuzu","shy","Deuxième défi des sumos… Courage, on va en cuire, des onigiris !"]],
  17:[["chanko","open","La belle. Celui qui perd porte le plateau de l'autre pendant un an."],["oyama","open","Un an ? Prépare tes petits bras, Chanko."],
      ["chanko","surprise","Gwahaha…"],
      ["yuzu","surprise","Vite, refais du stock ! Ils ne repartiront qu'à la fermeture."]],
  23:[["chanko","joy","Entraînement pour le Matsuri ! Ōyama, mon frère de ventre, viens t'asseoir à côté de moi !"],
      ["oyama","joy","Je t'ai gardé la meilleure place, Chanko ! Dohohoho !"],["chanko","joy","Gwahahaha !"],
      ["yuzu","open","Dernier défi des sumos : nourris-les jusqu'au bout, ils ont un concours à gagner !"]]};
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
// couleurs franches et une case de couleur derrière chaque sushi (testeurs, 23/11/2026 : illisibles dans les bulles ;
// choix de Joffray, proposition C de tools/sushis.html, 24/11/2026) : on lit l'ordre à la couleur, à la taille d'avant
const KY_SUSHI={s:{n:"Saumon",c:"#ff5b1f",bg:"#ffb08a"},t:{n:"Maki",c:"#36d04a",bg:"#9be88f"},o:{n:"Tamago",c:"#ffd000",bg:"#ffe766"}};
// un sushi (nigiri) : le riz, et le poisson ou l'omelette dessus ; le tamago a sa bande d'algue ; le maki, un rond dans son nori
const nigiriSVG=(x,y,k,top)=>top==="t"?`<ellipse cx="${x}" cy="${y+1.4*k}" rx="${6.8*k}" ry="${6.4*k}" fill="#15201a" ${K2}/><ellipse cx="${x}" cy="${y+.8*k}" rx="${4.6*k}" ry="${4.2*k}" fill="#fff"/><circle cx="${x}" cy="${y+.8*k}" r="${3*k}" fill="${KY_SUSHI.t.c}" ${K2}/>`
  :`<ellipse cx="${x}" cy="${y+3.4*k}" rx="${7*k}" ry="${3.6*k}" fill="#fff" ${K2}/>`+(top==="o"
  ?`<rect x="${x-7.6*k}" y="${y-4.6*k}" width="${15.2*k}" height="${6.4*k}" rx="${2*k}" fill="${KY_SUSHI.o.c}" ${K2}/><rect x="${x-2*k}" y="${y-5*k}" width="${4*k}" height="${10.4*k}" fill="#15201a" ${K2}/>`
  :`<path d="M${x-7.8*k} ${y+1*k} Q${x-8.2*k} ${y-5.2*k} ${x} ${y-5*k} Q${x+8.6*k} ${y-5*k} ${x+7.8*k} ${y+1.4*k} Q${x} ${y+3*k} ${x-7.8*k} ${y+1*k}Z" fill="${KY_SUSHI.s.c}" ${K2}/>`
    +[-3.4,0,3.4].map(a=>`<path d="M${x+a*k-1*k} ${y-4*k} q${1.6*k} ${2.4*k} ${1*k} ${4.8*k}" fill="none" stroke="#fff" stroke-width="${1.5*k}"/>`).join(""));
// le plateau de sushis, rempli de gauche à droite (g peut être incomplet : le plateau en cours au comptoir)
const kySushiSVG=g=>[0,1,2].map(i=>g[i]?`<rect x="${1.6+i*12.5}" y="6" width="11.8" height="22" rx="3.5" fill="${KY_SUSHI[g[i]].bg}" ${K2}/>`:"").join("")
  +`<path d="M1 27 H39 V31 Q39 33 37 33 H3 Q1 33 1 31Z" fill="#d9a46a" ${K2}/><path d="M6 33 V36 M34 33 V36" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`
  +[0,1,2].map(i=>g[i]?nigiriSVG(7.5+i*12.5,20,.82,g[i]):`<ellipse cx="${7.5+i*12.5}" cy="22" rx="4.4" ry="2.6" fill="none" stroke="#e6c3cf" stroke-width="1.4" stroke-dasharray="2 2"/>`).join("");
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
  // 30 journées (19/11/2026) : la carte garde sa hauteur (dessinée pour 25 journées à 96), les étapes se resserrent ;
  // V(j) = où était le jour j, le tracé suit l'ancien (KY_X)
  const N=KY_DAYS.length,sp=24*96/(N-1),V=j=>230+(j-1)*96;
  const ox=f=>{const i=Math.max(0,Math.min(23,Math.floor(f))),t=Math.max(0,Math.min(1,f-i));return Math.round(KY_X[i]+(KY_X[i+1]-KY_X[i])*t)};
  const P=[];for(let d=1;d<=N;d++)P[d]={d,x:ox((d-1)*sp/96),u:Math.round(230+(d-1)*sp)};
  const top=P[N].u,H=top+510,way=[{x:200,u:60},...P.slice(1),{x:200,u:top+160}];
  return {P,way,H,V,guest:{x:340,u:V(22)+60},yuz:{x:pathX(way,150)<200?300:100,u:120},cafe:{x:200,u:top+190},river:V(6.5)};
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
  <radialGradient id="ky-glow"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".95"/><stop offset=".45" stop-color="#ffb27a" stop-opacity=".45"/><stop offset="1" stop-color="#ffb27a" stop-opacity="0"/></radialGradient>
  <radialGradient id="ky-chochin" cx=".38" cy=".38" r=".75"><stop offset="0" stop-color="#ffc49a"/><stop offset=".45" stop-color="#f2603e"/><stop offset="1" stop-color="#c23a2c"/></radialGradient>
  <linearGradient id="ky-gold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".45" stop-color="#f4c94e"/><stop offset="1" stop-color="#c98e2a"/></linearGradient>
  <linearGradient id="ky-verm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4704e"/><stop offset=".7" stop-color="#e2502f"/><stop offset="1" stop-color="#c8402a"/></linearGradient>
  <linearGradient id="ky-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4a48"/><stop offset="1" stop-color="#2c2426"/></linearGradient>
  <linearGradient id="ky-bark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a7a68"/><stop offset="1" stop-color="#644a3c"/></linearGradient>
  <linearGradient id="ky-plaster" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdf8ec"/><stop offset="1" stop-color="#eee0c2"/></linearGradient>
  <linearGradient id="ky-stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ebe5d8"/><stop offset="1" stop-color="#b8afa0"/></linearGradient>
  <linearGradient id="ky-trunk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a48"/><stop offset="1" stop-color="#5a382e"/></linearGradient>
  <linearGradient id="ky-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ad4e8"/><stop offset=".5" stop-color="#7cc0dc"/><stop offset="1" stop-color="#62aed0"/></linearGradient>
  <linearGradient id="ky-fuji" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d8cc4"/><stop offset=".6" stop-color="#a6aedb"/><stop offset="1" stop-color="#c8c4e2"/></linearGradient>`;
const kyTorii=(x,y,k=1)=>{const w=30*k,h=44*k;return `<path d="M${x-w*.7} ${y} V${y-h}" stroke="${INK}" stroke-width="${8*k+2}" stroke-linecap="round"/><path d="M${x+w*.7} ${y} V${y-h}" stroke="${INK}" stroke-width="${8*k+2}" stroke-linecap="round"/><path d="M${x-w*.7} ${y} V${y-h}" stroke="#e0503c" stroke-width="${8*k-1}"/><path d="M${x+w*.7} ${y} V${y-h}" stroke="#e0503c" stroke-width="${8*k-1}"/>`
  +`<rect x="${x-w}" y="${y-h*.78}" width="${w*2}" height="${5*k}" fill="#e0503c" ${BO2}/><path d="M${x-w-8*k} ${y-h-2*k} Q${x} ${y-h+4*k} ${x+w+8*k} ${y-h-2*k} L${x+w+6*k} ${y-h-9*k} Q${x} ${y-h-3*k} ${x-w-6*k} ${y-h-9*k}Z" fill="#3d2a35" ${BO2}/><path d="M${x-w-2*k} ${y-h+1} H${x+w+2*k}" stroke="#e0503c" stroke-width="${4*k}"/>`};
const kyBamboo=(x,y,k=1)=>shadow(x,y,22*k)+[[-12,96,0],[-4,118,1],[5,104,2],[13,88,3]].map(([a,h,i])=>{const X=x+a*k,H=h*k;let g=`<rect x="${X-3*k}" y="${y-H}" width="${6*k}" height="${H}" rx="${2*k}" fill="url(#ky-bamboo)" ${K2}/>`;
  for(let j=1;j<5;j++)g+=`<path d="M${X-3*k} ${y-H*j/5} h${6*k}" stroke="#5f8a46" stroke-width="1.4"/>`;
  return g+`<path d="M${X} ${y-H*.7} q${(i%2?10:-10)*k} ${-6*k} ${(i%2?18:-18)*k} ${-2*k} q${(i%2?-8:8)*k} ${4*k} ${(i%2?-18:18)*k} ${2*k}Z M${X} ${y-H*.9} q${(i%2?-9:9)*k} ${-8*k} ${(i%2?-16:16)*k} ${-5*k} q${(i%2?7:-7)*k} ${5*k} ${(i%2?16:-16)*k} ${5*k}Z" fill="#9ccf72" ${K2}/>`}).join("");
const kyPine=(x,y,k=1)=>shadow(x,y,24*k)+`<path d="M${x} ${y} Q${x-4*k} ${y-20*k} ${x+6*k} ${y-34*k}" fill="none" stroke="#8a6a4a" stroke-width="${5*k}" stroke-linecap="round"/>`+[[-14,-30,20],[10,-40,22],[-2,-52,16]].map(([a,b,r])=>`<ellipse cx="${x+a*k}" cy="${y+b*k}" rx="${r*k}" ry="${r*.45*k}" fill="url(#ky-leaf)" ${K2}/>`).join("");
const kyFoxStatue=(x,y,f=1)=>shadow(x,y,13)+`<g transform="translate(${x} ${y}) scale(${f} 1)"><rect x="-11" y="-8" width="22" height="8" rx="2" fill="#bdb4a4" ${K2}/><path d="M-7 -8 Q-9 -26 -2 -30 L-5 -40 L1 -33 L5 -40 L5 -29 Q9 -24 7 -8Z" fill="#e6dfd0" ${K2}/><path d="M7 -12 Q16 -18 12 -30 Q8 -22 5 -18Z" fill="#e6dfd0" ${K2}/><path d="M-6 -22 Q0 -16 6 -22 L4 -16 Q0 -13 -4 -16Z" fill="#e0503c" ${K2}/></g>`;
const kyShrine=(x,y)=>shadow(x,y,46)+`<rect x="${x-40}" y="${y-8}" width="80" height="8" fill="#cfc6b6" ${BO}/><rect x="${x-32}" y="${y-40}" width="64" height="32" fill="#f6efe2" ${BO}/><rect x="${x-26}" y="${y-36}" width="10" height="28" fill="#e0503c" ${K2}/><rect x="${x+16}" y="${y-36}" width="10" height="28" fill="#e0503c" ${K2}/><path d="M${x-48} ${y-40} Q${x} ${y-50} ${x+48} ${y-40} L${x+30} ${y-64} H${x-30}Z" fill="#7a5a44" ${BO}/><path d="M${x-12} ${y-36} H${x+12}" stroke="#e0503c" stroke-width="3"/><circle cx="${x}" cy="${y-28}" r="5" fill="#f7d77a" ${K2}/>`;
const kyYatai=(x,y,c)=>shadow(x,y,30)+`<rect x="${x-26}" y="${y-22}" width="52" height="22" fill="#c99a6a" ${BO}/><path d="M${x-26} ${y-22} V${y-48} M${x+26} ${y-22} V${y-48}" stroke="${INK}" stroke-width="3"/><path d="M${x-32} ${y-46} H${x+32} L${x+28} ${y-36} H${x-28}Z" fill="${c}" ${BO}/>`+[0,1,2,3,4].map(i=>`<path d="M${x-28+i*14} ${y-36} q7 6 14 0" fill="${c}" ${K2}/>`).join("")+`<rect x="${x-18}" y="${y-18}" width="36" height="8" rx="2" fill="#fff6e4" ${K2}/>`;
const kyStones=(x,y)=>[[-46,-4],[-22,6],[0,-4],[22,6],[46,-4]].map(([a,b],i)=>`<ellipse cx="${x+a}" cy="${y+b}" rx="${i%2?12:10}" ry="7" fill="#d8d0c0" ${BO2}/><ellipse cx="${x+a-3}" cy="${y+b-2}" rx="4" ry="1.6" fill="#fff" opacity=".7"/>`).join("");
/* de quoi remplir la carte (11/11/2026, Joffray : « le Japon c'est trop trop vide ») : érable rouge, banc à ombrelle rouge
   (nodate), pousse-pousse, jardin zen ratissé, pont rouge en arc, petit sanctuaire et ses renards à bavoir, tableau d'ema,
   stand de pêche aux poissons rouges, tambour du Matsuri */
const kyMomiji=(x,y,k=1)=>shadow(x,y,24*k)+`<path d="M${x-3*k} ${y} Q${x-1*k} ${y-16*k} ${x} ${y-24*k} M${x} ${y-16*k} Q${x+8*k} ${y-22*k} ${x+12*k} ${y-30*k}" fill="none" stroke="#6e4630" stroke-width="${4*k}" stroke-linecap="round"/>`
  +[[-12,-30,13,"#e0503c"],[8,-36,14,"#f06a4c"],[-2,-46,14,"#f2894a"],[14,-24,10,"#d9443a"],[-16,-42,9,"#f2a04a"]].map(([a,b,r,c])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r="${r*k}" fill="${c}" ${BO2}/>`).join("")
  +[[-6,-40],[6,-30],[2,-50],[-12,-26]].map(([a,b])=>`<path d="M${x+a*k} ${y+b*k} l1.6 -3 l1.6 3 l-1.6 1Z" fill="#ffd1a0"/>`).join("");
const kyRickshaw=(x,y)=>shadow(x,y,30)+`<circle cx="${x-6}" cy="${y-14}" r="14" fill="none" stroke="${INK}" stroke-width="3"/>`+[0,45,90,135].map(a=>`<path d="M${x-6} ${y-14} l${(13*Math.cos(a*Math.PI/180)).toFixed(1)} ${(13*Math.sin(a*Math.PI/180)).toFixed(1)} M${x-6} ${y-14} l${(-13*Math.cos(a*Math.PI/180)).toFixed(1)} ${(-13*Math.sin(a*Math.PI/180)).toFixed(1)}" stroke="#6e4630" stroke-width="1.2"/>`).join("")
  +`<path d="M${x-22} ${y-26} H${x+8} V${y-40} Q${x-6} ${y-60} ${x-24} ${y-46}Z" fill="#2f2a3a" ${BO2}/><path d="M${x-20} ${y-26} h26 v6 h-26Z" fill="#d9443a" ${BO2}/><path d="M${x+6} ${y-24} L${x+38} ${y-16}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M${x+6} ${y-24} L${x+38} ${y-16}" stroke="#c99a5a" stroke-width="1.8" stroke-linecap="round"/>`;
const kyZen=(x,y)=>shadow(x,y,52)+`<rect x="${x-50}" y="${y-34}" width="100" height="34" rx="4" fill="#efe8d6" ${BO}/>`+[0,1,2,3,4].map(i=>`<path d="M${x-46} ${y-29+i*6} Q${x-20} ${y-31+i*6} ${x} ${y-29+i*6} T${x+46} ${y-29+i*6}" fill="none" stroke="#d6cab0" stroke-width="1.4"/>`).join("")
  +[[-24,-14,9,6],[14,-20,7,5],[30,-10,5,4]].map(([a,b,rx,ry])=>`<ellipse cx="${x+a}" cy="${y+b+3}" rx="${rx+5}" ry="${ry+3}" fill="none" stroke="#d6cab0" stroke-width="1.2"/><ellipse cx="${x+a}" cy="${y+b}" rx="${rx}" ry="${ry}" fill="#9a9a9e" ${BO2}/><ellipse cx="${x+a-2}" cy="${y+b-2}" rx="${rx*.4}" ry="${ry*.3}" fill="#c4c4c8"/><path d="M${x+a-rx} ${y+b+1} q${rx} ${ry*.8} ${2*rx} 0" fill="#9fc38a" opacity=".8"/>`).join("");
const kyHokora=(x,y)=>shadow(x,y,34)+`<rect x="${x-20}" y="${y-6}" width="40" height="6" fill="#cfc6b6" ${K2}/><rect x="${x-13}" y="${y-28}" width="26" height="22" fill="url(#ky-wood)" ${BO2}/><path d="M${x-20} ${y-28} Q${x} ${y-44} ${x+20} ${y-28}Z" fill="url(#ky-roof)" ${BO2}/><rect x="${x-6}" y="${y-22}" width="12" height="16" fill="#f2e6cc" stroke="${INK}" stroke-width="1.2"/><path d="M${x-3} ${y-22} v-4 M${x+3} ${y-22} v-4" stroke="#fff" stroke-width="2"/>`
  +[-1,1].map(sd=>`<g transform="translate(${x+sd*30} ${y}) scale(${sd} 1)"><rect x="-7" y="-6" width="14" height="6" fill="#cfc6b6" ${K2}/><path d="M-5 -6 Q-6 -20 0 -22 L-2 -30 L3 -24 Q7 -18 5 -6Z" fill="#e8e2d6" ${K2}/><path d="M-4 -14 h9 l-4.5 6Z" fill="#d9443a" stroke="${INK}" stroke-width="1"/></g>`).join("");
const kyEma=(x,y)=>shadow(x,y,26)+`<path d="M${x-24} ${y} V${y-34} M${x+24} ${y} V${y-34}" stroke="#6e4630" stroke-width="3"/><path d="M${x-28} ${y-34} H${x+28}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M${x-28} ${y-34} H${x+28}" stroke="#9a6a46" stroke-width="2" stroke-linecap="round"/>`
  +[-18,-9,0,9,18,-13,-4,5,14].map((o,i)=>{const yy=y-(i<5?28:16);return `<path d="M${x+o-4} ${yy} h8 v7 h-8Z" fill="#e8c88a" stroke="${INK}" stroke-width="1"/><path d="M${x+o-3} ${yy-.4} l3 -2.4 l3 2.4" fill="#e8c88a" stroke="${INK}" stroke-width="1"/>`}).join("");
const kyTaiko=(x,y)=>shadow(x,y,24)+`<path d="M${x-18} ${y} L${x-10} ${y-20} M${x+18} ${y} L${x+10} ${y-20}" stroke="#6e4630" stroke-width="3" stroke-linecap="round"/><ellipse cx="${x}" cy="${y-30}" rx="20" ry="17" fill="#b8342c" ${BO}/><ellipse cx="${x-2}" cy="${y-30}" rx="13" ry="15" fill="#f6ead2" ${BO2}/>`
  +Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<circle cx="${(x-2+14.6*Math.cos(a)).toFixed(1)}" cy="${(y-30+16.4*Math.sin(a)).toFixed(1)}" r="1.2" fill="#f2c45a"/>`}).join("")+`<path d="M${x-8} ${y-36} q6 6 0 12 q-6 -6 0 -12Z M${x+2} ${y-34} q-6 4 -2 10" fill="#d9443a" opacity=".85"/>`;
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
  // la terrasse (refaite le 20/11/2026, Joffray : « une belle terrasse, applique-toi ») : stores de bambou aux fenêtres,
  // véranda de planches en perspective et sa marche de pierre, deux renards de pierre à l'entrée, lanternes de pierre,
  // bancs à ombrelle et leur plateau de thé, vasque et son bambou qui goutte, bonsaï, pétales
  s+=[x-98,x+40].map(a=>`<rect x="${a}" y="${y-70}" width="58" height="22" fill="#d9b878" ${K2}/>`+Array.from({length:6},(_,i)=>`<path d="M${a+1} ${(y-66+i*3.3).toFixed(1)} H${a+57}" stroke="#b8945a" stroke-width=".9"/>`).join("")+`<rect x="${a-2}" y="${y-72}" width="62" height="4" rx="2" fill="#8a5a34" ${K2}/>`).join("")+kyLantern(x-74,y-64,1.1)+kyLantern(x+74,y-64,1.1);
  s+=`<path d="M${x-126} ${y-2} H${x+126} L${x+142} ${y+22} H${x-142}Z" fill="#cf9c62" ${BO}/>`+Array.from({length:15},(_,i)=>`<path d="M${(x-126+(i+1)*252/16).toFixed(1)} ${y-2} L${(x-142+(i+1)*284/16).toFixed(1)} ${y+22}" stroke="#a87442" stroke-width="1"/>`).join("")
    +`<path d="M${x-134} ${y+10} H${x+134}" stroke="#e8b880" stroke-width="1" opacity=".7"/><rect x="${x-144}" y="${y+22}" width="288" height="7" rx="2" fill="#8a5a34" ${BO2}/>`+[-130,-60,60,130].map(a=>`<rect x="${x+a-3}" y="${y+29}" width="6" height="7" fill="#6e4630" stroke="${INK}" stroke-width="1.2"/>`).join("")
    +`<rect x="${x-26}" y="${y+27}" width="52" height="9" rx="3" fill="url(#ky-stone)" ${BO2}/>`;
  s+=kyFoxStatue(x-38,y+18,1)+kyFoxStatue(x+38,y+18,-1)+kyToro(x-116,y+42)+kyToro(x+116,y+42)+kyNodate(x-164,y+48)+kyNodate(x+150,y+48);
  // la vasque de pierre et son bambou (tsukubai), deux bonsaïs
  s+=shadow(x-66,y+46,16)+`<ellipse cx="${x-66}" cy="${y+36}" rx="14" ry="9" fill="#a8a29a" ${BO2}/><ellipse cx="${x-66}" cy="${y+33}" rx="9" ry="4.4" fill="url(#ky-water)" stroke="${INK}" stroke-width="1.2"/><path d="M${x-50} ${y+38} V${y+18} M${x-50} ${y+20} L${x-62} ${y+26}" stroke="#7aae5a" stroke-width="3.4" stroke-linecap="round"/><path d="M${x-50} ${y+38} V${y+18} M${x-50} ${y+20} L${x-62} ${y+26}" stroke="${INK}" stroke-width="1" fill="none" opacity=".4"/>`
    +`<circle cx="${x-63}" cy="${y+30}" r="1.2" fill="#b6e0ee"><animate attributeName="cy" values="${y+28};${y+33};${y+28}" dur="1.4s" repeatCount="indefinite"/></circle>`;
  const bonsai=(t,yy)=>shadow(t,yy,13)+`<path d="M${t-11} ${yy-7} h22 l-3 7 h-16Z" fill="#3d4e7a" ${BO2}/><path d="M${t-2} ${yy-7} Q${t-6} ${yy-16} ${t+2} ${yy-22} Q${t+6} ${yy-26} ${t+4} ${yy-30}" fill="none" stroke="#6e4630" stroke-width="3" stroke-linecap="round"/>`+[[-8,-24,7],[6,-30,8],[8,-20,6]].map(([a,b,r])=>`<ellipse cx="${t+a}" cy="${yy+b}" rx="${r}" ry="${r*.6}" fill="url(#ky-leaf)" stroke="${INK}" stroke-width="1.3"/>`).join("");
  s+=bonsai(x+66,y+46)+kyPetals(x,y-30,1.6);
  return s;
}
// la grande porte d'entrée : un torii, comme ceux du chemin
function kyArchSVG(x,y){return kyRipple(x-50,y+25,14)+kyRipple(x+50,y+25,14,1.5)+kyTorii(x,y+24,2.4)}
function kyMapSVG(L){
  const {P,way,H,cafe,V}=L,Y=u=>H-u,hz=Y(cafe.u)+40;
  const u7=V(8),u12=V(14),u13=V(15),u18=V(22);
  const defs=KY_DEFS+`<pattern id="ky-grav" width="40" height="34" patternUnits="userSpaceOnUse"><g fill="#d9ceb6"><circle cx="6" cy="8" r="1.6"/><circle cx="24" cy="4" r="1.2"/><circle cx="32" cy="20" r="1.6"/><circle cx="14" cy="26" r="1.2"/></g></pattern>
    <linearGradient id="ky-gnd" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}"><stop offset="0" stop-color="#ece4d0"/><stop offset=".5" stop-color="#efe8d8"/><stop offset="1" stop-color="#ebe3d2"/></linearGradient>
    <linearGradient id="ky-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9a4b4"/><stop offset=".55" stop-color="#f8cfc2"/><stop offset="1" stop-color="#fdeedd"/></linearGradient>
    <radialGradient id="ky-sun"><stop offset="0" stop-color="#fff2b8" stop-opacity=".9"/><stop offset="1" stop-color="#fff2b8" stop-opacity="0"/></radialGradient>
    <radialGradient id="ky-vig" cx=".5" cy=".5" r=".75"><stop offset=".7" stop-color="#5b4250" stop-opacity="0"/><stop offset="1" stop-color="#5b4250" stop-opacity=".12"/></radialGradient>`;
  let s=`<rect width="400" height="${H}" fill="url(#ky-gnd)"/><rect width="400" height="${H}" fill="url(#ky-grav)"/>`;
  // le ciel du soir, les collines et la pagode derrière le salon de thé
  s+=`<rect x="0" y="0" width="400" height="${hz}" fill="url(#ky-sky)"/><circle cx="62" cy="${hz-250}" r="70" fill="url(#ky-sun)"/><circle cx="62" cy="${hz-250}" r="17" fill="#fff4c8" ${BO}/>`;
  // le mont Fuji, tout en haut derrière le Kitsune Shokudō (20/11/2026, Joffray : le premier était « trop pointu ») : large,
  // sommet plat et son cratère, pentes creusées qui s'étalent, neige en coulées dans les ravines, un voile de nuage
  {const B=hz-40,S=hz-286,bz=(t,a,b,c,d)=>(1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d,lx=t=>bz(t,-70,60,150,166),ly=t=>bz(t,B,B-26,S+64,S);
  const crat=`L174 ${S-3} L184 ${S+1} L193 ${S-2} L200 ${S+1} L207 ${S-2} L216 ${S+1} L226 ${S-3} L234 ${S}`;
  s+=`<path d="M-70 ${B} C60 ${B-26} 150 ${S+64} 166 ${S} ${crat} C250 ${S+64} 340 ${B-26} 470 ${B}Z" fill="url(#ky-fuji)" ${BO}/>`;
  const t0=.8,pts=[];for(let t=t0;t<.999;t+=.04)pts.push([lx(t),ly(t)]);
  const xa=lx(t0),xb=400-xa,yb=ly(t0);
  let sn=`M${xa.toFixed(1)} ${yb.toFixed(1)} `+pts.map(([a,b])=>`L${a.toFixed(1)} ${b.toFixed(1)}`).join(" ")+` L166 ${S} ${crat} `+pts.slice().reverse().map(([a,b])=>`L${(400-a).toFixed(1)} ${b.toFixed(1)}`).join(" ")+` L${xb.toFixed(1)} ${yb.toFixed(1)}`;
  [22,8,30,12,18,6,26,10,20,8,16].forEach((dp,i)=>{sn+=` L${(xb-(xb-xa)*(i+1)/12).toFixed(1)} ${(yb+(i%2?-4:dp)).toFixed(1)}`});
  s+=`<path d="${sn}Z" fill="#fffaf6" ${BO2}/><path d="M186 ${S+8} Q182 ${S+30} 176 ${S+54} M214 ${S+8} Q220 ${S+34} 228 ${S+50}" stroke="#dfe2f2" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  s+=``+`<path d="M-10 ${hz-130} Q40 ${hz-150} 90 ${hz-136} Q130 ${hz-156} 170 ${hz-138} Q150 ${hz-122} 100 ${hz-124} Q50 ${hz-116} -10 ${hz-130}Z M260 ${hz-170} Q300 ${hz-188} 340 ${hz-172} Q380 ${hz-184} 410 ${hz-168} Q380 ${hz-156} 330 ${hz-160} Q290 ${hz-154} 260 ${hz-170}Z" fill="#fff" opacity=".75"/>`;}
  s+=`<g><animateTransform attributeName="transform" type="translate" values="-60 0;460 -10" dur="28s" repeatCount="indefinite"/>${[[0,hz-200],[14,hz-208],[26,hz-198]].map(([x,y])=>`<path d="M${x-6} ${y} q3 -4 6 0 q3 -4 6 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`).join("")}</g>`;
  s+=`<path d="M0 ${hz} H400" stroke="${INK}" stroke-width="2"/>`;
  // la forêt de bambous et le jardin du pavillon d'or : de la mousse
  s+=`<path d="M-10 ${Y(u7+30)} Q120 ${Y(u7+10)} 230 ${Y(u7+40)} Q260 ${Y(u12-60)} 190 ${Y(u12-20)} Q90 ${Y(u12+20)} -10 ${Y(u12-10)}Z" fill="url(#ky-moss)" ${BO}/>`;
  // le lac sacré (20/11/2026, Joffray : « les portes rouges sont censées être sur l'eau ») à la place de la colline d'Inari :
  // le chemin y passe sur une galerie de bois à garde-corps rouge, les torii et le sanctuaire sont posés sur l'eau
  const LK=[[420,1540],[330,1548],[270,1566],[232,1606],[212,1660],[200,1730],[192,1800],[190,1880],[196,1960],[204,2040],[216,2110],[236,2190],[262,2258],[320,2270],[420,2262]];
  const inLk=(x,u)=>{let c=false;for(let i=0,j=LK.length-1;i<LK.length;j=i++){const [xi,yi]=LK[i],[xj,yj]=LK[j];if((yi>u)!==(yj>u)&&x<(xj-xi)*(u-yi)/(yj-yi)+xi)c=!c}return c};
  const lkD=smooth([...LK,LK[0]].map(([x,u])=>[x,Y(u)]))+"Z";
  s+=`<clipPath id="ky-lk"><path d="${lkD}"/><ellipse cx="200" cy="${Y(30)}" rx="150" ry="30"/></clipPath>`;
  s+=`<path d="${lkD}" fill="none" stroke="${INK}" stroke-width="22" stroke-linejoin="round"/><path d="${lkD}" fill="none" stroke="#e6d6b0" stroke-width="18" stroke-linejoin="round"/><path d="${lkD}" fill="url(#ky-lake)" stroke="${INK}" stroke-width="2"/>`
    +`<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><animate attributeName="opacity" values=".9;.35;.9" dur="4.4s" repeatCount="indefinite"/>${[[372,1590],[240,1700],[350,1980],[230,1880],[372,2100],[300,2240],[220,2040]].map(([x,u])=>`<path d="M${x-12} ${Y(u)} q6 -3 12 0 q6 3 12 0"/>`).join("")}</g>`
    +[[384,1640,0],[224,1790,1],[380,2030,2],[214,1990,3],[300,2120,4]].map(([x,u,i])=>kyLotus(x,Y(u),i)).join("");
  // l'étang au pied du grand torii de l'entrée
  s+=`<ellipse cx="200" cy="${Y(30)}" rx="158" ry="36" fill="${INK}"/><ellipse cx="200" cy="${Y(30)}" rx="156" ry="34" fill="#e6d6b0"/><ellipse cx="200" cy="${Y(30)}" rx="148" ry="28" fill="url(#ky-lake)" stroke="${INK}" stroke-width="2"/>`;
  // la rivière Kamo, ses berges, des reflets
  const ry=Y(L.river),bx=pathX(way,L.river);
  s+=`<path d="M-10 ${ry-34} Q100 ${ry-42} 200 ${ry-32} T410 ${ry-38} V${ry+32} Q300 ${ry+42} 200 ${ry+34} T-10 ${ry+38}Z" fill="url(#ky-water)" ${BO}/>`;
  s+=`<g><animate attributeName="opacity" values=".9;.4;.9" dur="4s" repeatCount="indefinite"/>${[[260,-12],[360,20],[40,18],[320,4],[110,-14]].map(([x,o])=>`<path d="M${x} ${ry+o} q8 -4 16 0 q8 4 16 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
  // le chemin et la part déjà faite ; les pierres de gué à la place d'un pont
  const pts=way.map(p=>[p.x,Y(p.u)]),d=smooth(pts);
  s+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fdf1df" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ead2bb" stroke-width="4" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  s+=`<g clip-path="url(#ky-lk)"><path d="${d}" fill="none" stroke="${INK}" stroke-width="40"/><path d="${d}" fill="none" stroke="#e0503c" stroke-width="36"/><path d="${d}" fill="none" stroke="${INK}" stroke-width="36" stroke-dasharray="1.6 10"/><path d="${d}" fill="none" stroke="${INK}" stroke-width="31"/><path d="${d}" fill="none" stroke="#d6aa78" stroke-width="27"/><path d="${d}" fill="none" stroke="#b08458" stroke-width="27" stroke-dasharray="1.4 5.6"/></g>`;
  const k=way.findIndex(p=>p.d===itCur());if(k>0)s+=`<path d="${smooth(pts.slice(0,k+1))}" fill="none" stroke="#f59a8b" stroke-width="7" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  s+=`<path d="M${bx-34} ${ry-36} V${ry+36} H${bx+34} V${ry-36}Z" fill="url(#ky-water)"/>`+kyStones(bx,ry);
  // ce qui est posé, chaque chose une fois
  const it=[];const at=(x,u,f)=>it.push({x,u,f});
  // la rue de Gion : maisons en bois des deux côtés, lanternes de pierre, un cerisier
  [[0,150,66,92],[334,190,66,88],[0,370,60,84],[340,430,60,80],[0,536,58,70],[338,640,60,78],[0,700,58,70]].forEach(([x,u,w,h])=>at(x+w/2,u,(cx,y)=>kyMachiya(x,y,w,h)));
  at(300,282,kyToro);at(110,250,kyToro);at(250,610,kyToro);at(300,520,(x,y)=>kySakura(x,y,.9));at(40,250,(x,y)=>kySakura(x,y,.8));
  // ajouts du 11/11/2026 (Joffray : « le Japon c'est trop trop vide »), placés entre les détours du chemin
  at(118,330,kyNodate);at(150,462,(x,y)=>kySakura(x,y,.85));at(272,598,kyRickshaw);at(352,560,(x,y)=>kyMomiji(x,y,.9));at(56,470,kyToro);
  at(330,1150,kyZen);at(386,1262,(x,y)=>kyMomiji(x,y,.8));at(306,1006,(x,y)=>kyMomiji(x,y,.75));
  
  at(60,856,(x,y)=>kySakura(x,y,.8));at(132,884,kyToro);at(360,1062,(x,y)=>kySakura(x,y,.75));at(350,1400,kyToro);at(176,1690,kyToro);at(170,2196,(x,y)=>kySakura(x,y,.7));
  at(340,2500,kyKingyo);at(345,2420,kyTaiko);at(355,2300,(x,y)=>kyMomiji(x,y,.8));
  // les bambous et le pavillon d'or
  at(380,u7+60,(x,y)=>kyPine(x,y,.8));
  at(54,1372,(x,y)=>kyKinkaku(x,y));at(370,u12-40,(x,y)=>kyPine(x,y,.9));at(380,u12+30,kyToro);
  // la montagne d'Inari : renards de pierre, le sanctuaire en haut ; les torii sont posés sur le chemin plus bas
  at(236,1530,(x,y)=>kyFoxStatue(x,y,1));at(318,1520,(x,y)=>kyFoxStatue(x,y,-1));at(70,2250,(x,y)=>kyPagoda(x,y,1.05));at(30,u13+180,(x,y)=>kySakura(x,y,.75));at(30,u18-60,(x,y)=>kyPine(x,y,.8));at(160,u13+230,kyToro);
  // devant le salon de thé : les stands du Matsuri, une guirlande de lanternes
  at(70,cafe.u-90,(x,y)=>kyYatai(x,y,"#e0503c"));at(330,cafe.u-96,(x,y)=>kyYatai(x,y,"#7a9ad8"));at(60,cafe.u-200,(x,y)=>kySakura(x,y,1));at(350,u18+150,(x,y)=>kySakura(x,y,.8));
  // le Japon d'autrefois (20/11/2026, kyoto-deco.js) : terrain de sumo, château, grand Bouddha, temple sur pilotis, Jizō
  at(290,1210,kyDohyo);at(84,1612,(x,y)=>kyCastle(x,y,.95));at(58,2036,kyDaibutsu);at(40,1956,(x,y)=>kyJizo(x,y,4));
  // sur le lac : le grand torii, le sanctuaire sur pilotis, une barque
  at(346,1690,(x,y)=>kyOTorii(x,y,1.1));at(304,1880,kyMiyajima);at(358,2180,kyBoat);
  // la forêt de bambous (20/11/2026, Joffray : « une forêt plutôt qu'un de temps en temps ») : des tiges serrées sur la mousse,
  // jamais sur le chemin ni sur le pavillon d'or
  const dPath=(x,u)=>{let m=1e9;for(let i=0;i<way.length-1;i++){const a=way[i],b=way[i+1],vx=b.x-a.x,vu=b.u-a.u,t=Math.max(0,Math.min(1,((x-a.x)*vx+(u-a.u)*vu)/(vx*vx+vu*vu)));m=Math.min(m,Math.hypot(x-a.x-vx*t,u-a.u-vu*t))}return m};
  for(let r=0,n=0;r<17;r++)for(let c=0;c<11;c++){n++;const x=4+c*19+((n*37)%11)-5+(r%2)*9,u=930+r*31+((n*53)%13),h=78+((n*29)%46),sd=n;
    if(x>200||(x>8&&x<214&&u+h>1236&&u<1432)||(x<130&&u+h>1330)||u>1452)continue;let ok=true;for(let t=0;t<=h;t+=12)if(dPath(x,u+t)<26){ok=false;break}
    if(ok)at(x,u,(X,Y0)=>kyStalk(X,Y0,h,sd))}
  it.sort((a,b)=>b.u-a.u).forEach(e=>s+=e.f(+e.x.toFixed(1),+Y(e.u).toFixed(1)));
  // le chemin des torii : une porte rouge tous les 34 pas, sauf sur les journées
  for(let u=u13-60;u<u18+60;u+=34){const x=pathX(way,u);if(P.some(p=>Math.abs(p.u-u)<24)||!inLk(x,u+6))continue;s+=kyRipple(+(x-17).toFixed(1),Y(u)+15,6)+kyRipple(+(x+17).toFixed(1),Y(u)+15,6,1.4)+kyTorii(x,Y(u)+14,.82)}
  s+=`<path d="M40 ${Y(cafe.u-40)} Q200 ${Y(cafe.u-70)} 360 ${Y(cafe.u-40)}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+[70,110,150,190,230,270,310].map(x=>{const t=(x-40)/320,y=Y(cafe.u-40)-(-60*t*(1-t))*1;return kyLantern(x,y+10,.7)}).join("");
  s+=kyArchSVG(200,Y(60))+kyCafeSVG(cafe.x,Y(cafe.u));
  s+=`<rect width="400" height="${H}" fill="url(#ky-vig)" pointer-events="none"/>`;
  return `<svg viewBox="0 0 ${ITW} ${H}" aria-hidden="true"><defs>${defs}</defs>${s}</svg>`;
}

/* ---------- l'histoire : le Matsuri ---------- */
// une scène se joue à la fin de la journée, à sa première réussite (Q.scenes, comme Paris)
const KY_SCENES={
  1:[["yuzu","joy","Ton premier service au Kitsune Shokudō ! Les clients ont adoré."],
     ["yuzu","open","Dans trente jours, c'est le Matsuri, le grand festival d'été. Chaque année, on y tient un stand…"],
     ["yuzu","shy","Mais cette année, je suis toute seule. Tu m'aides à monter une équipe ?"]],
  2:[["daifuku","joy","Une ramune ! J'adore le petit bruit de la bille."],["daifuku","surprise","Un stand au Matsuri ? Je veux en être ! Je goûterai tout. Pour vérifier."],
     ["yuzu","joy","Daifuku rejoint l'équipe ! Surtout côté dégustation…"]],
  3:[["origami","open","Tu vois l'oiseau en papier, sur ma tête ? C'est une grue, l'origami le plus célèbre du Japon. Je l'ai plié en attendant mon onigiri."],
     ["origami","joy","Ici, on dit que plier mille grues porte bonheur. Pour le stand du Matsuri, je vais en plier mille, et des lanternes : je m'en occupe !"],["yuzu","joy","Origami fait partie de l'équipe !"]],
  4:[["daifuku","joy","Des beignets de crevettes ! Croustillants dehors, tout doux dedans. Comme moi."],["yuzu","open","Elle en a mangé six. Pour vérifier."]],
  5:[["chanko","joy","Gwahahaha ! Un plateau de plus que toi, grosse boulette de riz !"],["oyama","surprise","Impossible ! Ce comptoir penche de ton côté, c'est truqué !"],
     ["chanko","joy","Gwahahaha ! Le ventre de Chanko est le plus grand du quartier !"],["oyama","sad","Hmpf. Revanche dans six jours. Et cette fois, je mange avec les deux mains."],
     ["yuzu","shy","Ils ont vidé toute la vitrine…"]],
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
  11:[["oyama","joy","Dohohoho ! Deux plateaux de sushis de plus que toi !"],["chanko","sad","Je… n'en peux plus… Mon ventre a déclaré forfait…"],
      ["oyama","joy","Le grand champion reprend son titre ! Dohohohoho !"],["chanko","open","La belle, dans six jours. Je vais m'entraîner à manger des cailloux."],
      ["yuzu","surprise","S'il te plaît, pas de cailloux dans ma cantine."]],
  13:[["yuzu","joy","Le mochi fraise arrive au menu… avec un deuxième four, rien que pour lui et les douceurs !"],
      ["yuzu","surprise","Le premier four cuit les onigiris, la tempura et les taiyakis ; le deuxième, les mochis et les dorayakis. Deux fournées à la fois… mais deux fours à surveiller !"]],
  14:[["hoji","open","Hmm. Alors c'est vous, la cantine qui veut servir du matcha au Matsuri."],["hoji","open","Je suis Hōji. Je sers le thé dans ce quartier depuis soixante ans."],
      ["yuzu","shy","Sensei… vous goûteriez le nôtre ?"],["hoji","surprise","… Pas mal. Revenez me voir quand il sera parfait."]],
  15:[["hayate","open","Yuzu-san. Votre stand, au Matsuri. Il lui faut quelqu'un pour veiller."],["yuzu","surprise","Tu veux… nous protéger ?"],
      ["hayate","joy","Un rōnin peut choisir ce qu'il sert. Je choisis ce Shokudō."],["tsuba","sad","Servir une cantine ? Quelle honte pour un samouraï…"]],
  16:[["yuzu","joy","La crème ! Sur un hōjicha… et bientôt dans nos dorayakis."],["daifuku","joy","Je vérifie que c'est bon. … C'est bon."]],
  17:[["yuzu","surprise","Ils ont fini… en même temps ?!"],["chanko","shy","Pile le même nombre de plats…"],
      ["oyama","shy","… Égalité. Tu manges bien, pour un mochi."],["chanko","shy","Et toi… tu n'es pas si boulette que ça."],
      ["chanko","joy","Dis… au concours de mangeurs du Matsuri, et si on faisait équipe ?"],["oyama","joy","Ensemble, personne ne nous battra ! Dohohoho !"],
      ["chanko","joy","Gwahahaha !"],["yuzu","joy","Ils rient… ensemble ?! Je n'y crois pas."]],
  19:[["hoji","joy","Celui-ci est parfait. Le secret, c'est la patience. Et un fouet en bambou bien souple."],
      ["hoji","open","Je viendrai au Matsuri. Et je prendrai mon thé chez vous, de temps en temps."],["yuzu","joy","Le sensei rejoint l'équipe !"]],
  20:[["tsuba","surprise","Hier soir, le vent a renversé les lanternes du stand… et c'est Hayate qui les a toutes rattrapées ?"],
      ["hayate","shy","Une a failli tomber sur le plateau de sushis. Inacceptable."],["tsuba","open","Hmm. Je m'étais peut-être trompé sur toi."]],
  22:[["origami","joy","Les mille oiseaux en papier sont prêts ! Enfin, neuf cent quatre-vingt-dix-neuf. Daifuku s'est assise sur le dernier."],
      ["hoji","open","On raconte que si les lanternes du chemin des torii brillent assez fort, la Dame aux neuf queues descend de la montagne."],
      ["kage","shy","J'ai… peut-être ajouté quelques lanternes."]],
  23:[["oyama","joy","Quatre plateaux chacun ! On est prêts, Chanko !"],["chanko","shy","Ōyama… merci d'avoir été mon rival. Tu es mon meilleur ami."],
      ["oyama","shy","Arrête, tu vas me faire pleurer dans mes sushis…"],["chanko","joy","Gwahahaha !"],["oyama","joy","Dohohoho !"],
      ["yuzu","shy","Ooh… c'est trop mignon."]],
  30:[["yuzu","surprise","C'est le soir du Matsuri ! Regarde notre stand !"],["daifuku","joy","Les sushis partent comme des petits pains !"],
      ["kage","surprise","… Là-haut. Sur le chemin des torii."],
      ["kyubi","open","Que de lumière, cette année… Je n'avais pas vu un stand aussi joyeux depuis cent ans."],
      ["kyubi","joy","Un plateau de sushis, et des dango, s'il te plaît. … Délicieux. On sent l'omotenashi."],
      ["hoji","shy","La Dame aux neuf queues… en personne."],
      ["tsuba","open","Hayate. Tu as trouvé un maître digne de toi : tout ce quartier."],["tsuba","joy","Je m'incline."],["hayate","joy","… Merci, Tsuba."],
      ["chanko","joy","Le concours de mangeurs ? Gagné, avec mon meilleur ami ! Gwahahaha !"],["oyama","joy","Dohohoho ! On partage la coupe : une moitié chacun !"],
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
    // après la scène du soir du Matsuri (KY_FIN), le défilé (matsuri.js), une seule fois
    if(d===KY_FIN&&!S.ky.parade){S.ky.parade=1;save();kyParade(()=>kyScenes(done));return}
    kyScenes(done)});return}
  done();
}
function kyStory(){kyScenes(()=>{renderMapIt();dailyBonus()})}
function kyCarnet(){
  const rows=Object.keys(KY_SCENES).map(Number).map(d=>S.ky.read[d]
    ?`<div data-kyscene="${d}" style="cursor:pointer">${itRow(foxSVG(FOX[KY_SCENES[d][0][0]],{pose:"happy"}),d===KY_FIN?"Le soir du Matsuri":`Jour ${d}`,KY_SCENES[d][0][2],"background:#fde8ec")}</div>`
    :`<div style="opacity:.55">${itRow(foxSVG(FOX.yuzu,{sil:1}),d===KY_FIN?"Le soir du Matsuri":"Scène à découvrir",`Réussis le jour ${d} du quartier.`)}</div>`).join("");
  openSheet(`<h2>Le carnet du Matsuri</h2><div style="width:120px;margin:0 auto">${foxSVG(FOX.yuzu,{pose:"happy"})}</div>
  <p class="sub" style="text-align:center">Tout ce qui s'est passé depuis ton arrivée au Kitsune Shokudō. Touche une scène pour la revoir.</p>${rows}
  <div class="col" style="margin-top:10px"><button class="btn ghost wide" data-act="kyreset" type="button">Recommencer Kyoto depuis le jour 1</button></div>
  ${S.ky.read[KY_FIN]?`<div class="col" style="margin-top:10px"><button class="btn wide" data-act="kyparade" type="button">Revoir le défilé du Matsuri</button></div>`:""}
  <div class="col" style="margin-top:10px"><button class="btn ghost wide" data-act="yuzuintro" type="button">Revoir l'accueil de Yuzu</button></div>`);
  $("sheet-in").querySelectorAll("[data-kyscene]").forEach(b=>b.onclick=()=>itTalk(KY_SCENES[+b.dataset.kyscene],kyCarnet));
}

/* ---------- le quartier dans le registre des mondes (data.js) ---------- */
WORLDS.kyoto={id:"kyoto",name:"Kyoto",cafe:"Kitsune Shokudō",short:"Shokudō",sv:()=>S.ky,days:KY_DAYS,s3:KY_S3,kit:KY_KIT,
  recDays:KY_REC,sumo:KY_SUMO,sumoTalk:KY_SUMO_TALK,
  mark:d=>KY_SUMO[d]&&!S.ky.sumo[d]?foxArt(FOX.chanko,{portrait:1,expr:"joy"}):"",
  dayRow:d=>KY_SUMO[d]?itRow(foxSVG(FOX.chanko,{pose:"happy"}),"Défi des sumos !",`Rien qu'eux deux, deux commandes chacun, jusqu'à la fermeture. Sers-les vite !${S.ky.sumo[d]?" (déjà réussi)":" +40 pièces la première fois."}`,"background:#e8eefa"):"",
ovens:d=>d>=14?2:1,ovenOf:{croissant:0,cookie:0,taiyaki:0,mochi:1,gateau:1},
  opt:{lait:"Lait",chantilly:"Crème"},optItem:(r,o)=>o==="lait"&&r==="cafe"?"Matcha latte":`${REC[r].name} à la crème`,optWord:"la crème",optWords:{lait:"le lait",chantilly:"la crème"},
  optNews:{lait:"Touche « Lait », au bout du plateau, pour transformer un matcha en matcha latte."},
  // le plateau de sushis (clé « smoothie », comme le gelato)…
  gel:KY_SUSHI,gelSVG:kySushiSVG,
  tubSVG:x=>`<rect x="5" y="4" width="30" height="32" rx="8" fill="${KY_SUSHI[x].bg}" ${K2}/>`+nigiriSVG(20,22,1.7,x),tubLabel:"Un sushi",cone:"le plateau",
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
  isOpen:()=>kyOpen(),lockMsg:`Réussis les ${PA_DAYS.length} journées de Paris pour ouvrir Kyoto.`,
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
