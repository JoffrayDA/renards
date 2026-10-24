/* Kitsune Café : données du jeu (recettes, saisons, boutique, quêtes, difficulté). */
/* ---------- données ---------- */
const KEY="cafe-renards-v1";
// Halloween, la Nuit des citrouilles : du 17 octobre au 3 novembre (?halloween=1 ou =0 pour forcer, pour tester)
const HW=(()=>{const q=new URLSearchParams(location.search).get("halloween");if(q)return q==="1";const d=new Date(),m=d.getMonth(),j=d.getDate();return(m===9&&j>=17)||(m===10&&j<=3)})();
const REC={
  cafe:{name:"Café",pl:"cafés",price:5,cost:4.3,kind:"drink",time:2.4,stn:"Machine à café"},
  croissant:{name:"Croissant",pl:"croissants",price:4,cost:3.4,kind:"bake",time:5,batch:3},
  the:{name:"Thé",pl:"thés",price:5,cost:4.3,kind:"drink",time:2,day:2,stn:"Bouilloire",desc:"Une bouilloire rapide. Infusion express."},
  cookie:{name:"Cookie",pl:"cookies",price:6,cost:5.1,kind:"bake",time:5,batch:4,day:5,desc:"Au four, par fournées de 4."},
  choco:{name:"Chocolat chaud",pl:"chocolats chauds",price:8,cost:6.8,kind:"drink",time:3,day:7,stn:"Chocolatière",desc:"Avec une guimauve qui flotte."},
  smoothie:{name:"Smoothie",pl:"smoothies",price:10,cost:8.5,kind:"drink",time:3.4,day:11,stn:"Blender",desc:"Aux baies des bois, bien mixé."},
  gateau:{name:"Gâteau aux baies",pl:"parts de gâteau",price:14,cost:11.9,kind:"bake",time:7,batch:2,day:16,desc:"Le plus cher de la carte. Par fournées de 2 parts."}
};
// Options : un supplément qu'on ajoute à un article déjà sur le plateau (tuiles rondes au bout du plateau).
// Elles se gagnent comme les recettes, en réussissant leur journée. Un article du plateau s'écrit "cafe" ou "cafe+lait".
const OPTS={
  lait:{name:"Lait",for:["cafe"],price:2,cost:1.2,day:4,desc:"Touche « Lait » pour transformer un café du plateau en café crème."},
  chantilly:{name:"Chantilly",for:["choco","gateau"],price:3,cost:1.8,day:13,desc:"Touche « Chantilly » pour en mettre sur un chocolat chaud ou une part de gâteau du plateau."}
};
const itemKey=o=>o.r+(o.o?"+"+o.o:"");
const baseOf=k=>k.split("+")[0];
const itemName=k=>{const [r,o]=k.split("+");return REC[r].name+(o?` ${o==="lait"?"crème":"chantilly"}`:"")};
const itemPrice=k=>{const [r,o]=k.split("+");return REC[r].price+(o?OPTS[o].price:0)};
const itemCost=k=>{const [r,o]=k.split("+");return REC[r].cost+(o?OPTS[o].cost:0)};
// La carte du café change avec la saison : REC[k].name et REC[k].pl suivent SEA (la saison affichée).
let SEA="printemps";
const VAR={
  printemps:{cookie:["Tartelette myrtille","tartelettes myrtille"],the:["Thé sakura","thés sakura"]},
  ete:{croissant:["Tartelette fraise","tartelettes fraise"],the:["Thé glacé","thés glacés"],cookie:["Cookie citron","cookies citron"],choco:["Milkshake choco","milkshakes choco"],gateau:["Fraisier","parts de fraisier"]},
  automne:{croissant:["Tarte aux pommes","tartes aux pommes"],the:["Thé chai","thés chai"],cookie:["Cookie noisette","cookies noisette"],smoothie:["Smoothie pomme","smoothies pomme"],gateau:["Gâteau aux marrons","parts de gâteau aux marrons"]},
  hiver:{croissant:["Pumpkin pie","pumpkin pies"],the:["Thé au miel","thés au miel"],cookie:["Sablé étoile","sablés étoile"],smoothie:["Smoothie myrtille","smoothies myrtille"],gateau:["Bûche de Noël","parts de bûche"]},
  // pendant Halloween, quelle que soit la saison
  halloween:{cookie:["Cookie fantôme","cookies fantômes"],smoothie:["Potion de sorcière","potions de sorcière"],gateau:["Gâteau citrouille","parts de gâteau citrouille"]}
};
const vName=(k,sea=SEA)=>(HW&&VAR.halloween[k])||VAR[sea][k]||[REC[k].nm,REC[k].npl];
for(const k in REC){const r=REC[k];r.nm=r.name;r.npl=r.pl;Object.defineProperty(r,"name",{get:()=>vName(k)[0]});Object.defineProperty(r,"pl",{get:()=>vName(k)[1]})}
/* La carte : 4 saisons de 10 journées. Une porte demande un total d'étoiles, et un invité d'honneur rejoint le café quand toute la saison est en ★★★. */
const CHAP=[
  {id:"printemps",name:"Printemps",from:1,to:10,gate:0,guest:"zaza"},
  {id:"ete",name:"Été",from:11,to:20,gate:24,guest:"flocon"},
  {id:"automne",name:"Automne",from:21,to:30,gate:50,guest:"noisette"},
  {id:"hiver",name:"Hiver",from:31,to:40,gate:78,guest:"comete"}
];
const LASTDAY=40;
// Boutique : chaque achat a un ou plusieurs niveaux (S.own[id] = niveau atteint, 0 ou absent = pas acheté).
const UPG={
  equip:[
    {id:"plateau",name:"Plateau",lv:[{d:"4 places sur le plateau au lieu de 3.",c:60},{d:"5 places sur le plateau.",c:1000,from:21,ic:"plateau5"}]},
    {id:"double",name:"Machine à café",lv:[{d:"Prépare 2 cafés en même temps.",c:80},{d:"Prépare 3 cafés en même temps.",c:1100}]},
    {id:"comptoir1",name:"Comptoir",lv:[{d:"Un 3e client peut commander en même temps.",c:100},{d:"Un 4e client peut commander en même temps.",c:400,ic:"comptoir2"}]},
    {id:"fourpro",name:"Four rapide",lv:[{d:"Cuisson 12 % plus rapide, et les fournées brûlent un peu moins vite.",c:110},{d:"Cuisson 20 % plus rapide, et les fournées brûlent encore un peu moins vite.",c:1200}]},
    {id:"barista",name:"Gestes de barista",lv:[{d:"Toutes les boissons se préparent 15 % plus vite.",c:150},{d:"Toutes les boissons se préparent 22 % plus vite.",c:950},{d:"Toutes les boissons se préparent 30 % plus vite.",c:2800,from:31}]},
    {id:"serveur",name:"Apprenti serveur",lv:[{d:"Ton compagnon (Petit Pois, ou un autre ami du refuge) apporte tout seul, et tout de suite, les pâtisseries de la vitrine aux clients.",c:320}]},
    {id:"machines",name:"Machines doubles",lv:[{d:"Thé, chocolat et smoothie se préparent aussi 2 par 2.",c:1100,from:21}]},
    {id:"four2",name:"Four de boulanger",lv:[{d:"Chaque fournée donne deux fois plus de pâtisseries.",c:1800,from:31}]}
  ],
  deco:[
    {id:"plantes",name:"Plantes vertes",lv:[{d:"Les clients patientent 15 % plus longtemps.",c:50},{d:"Les clients patientent 25 % plus longtemps.",c:800}]},
    {id:"guirlande",name:"Guirlande lumineuse",lv:[{d:"+25 % de pourboires.",c:90},{d:"+40 % de pourboires.",c:1300}]},
    {id:"coussins",name:"Tabourets moelleux",lv:[{d:"Les clients VIP viennent deux fois plus souvent.",c:130},{d:"Les clients VIP viennent 2,5 fois plus souvent.",c:1100}]},
    {id:"disque",name:"Tourne-disque",lv:[{d:"Musique douce : +10 % de patience et +10 % de pourboires.",c:170}]},
    {id:"fauteuils",name:"Fauteuils douillets",lv:[{d:"Les clients patientent 20 % plus longtemps.",c:1000,from:21}]},
    {id:"lanternes",name:"Lanternes de saison",lv:[{d:"+25 % de pourboires.",c:1400,from:31}]}
  ]
};
const lv=id=>+S.own[id]||0;
// Bonus à usage unique (S.boost[id] = nombre en réserve) : on les choisit avant une journée, ils ne servent qu'une fois.
const BOOSTS=[
  {id:"patience",name:"Tisane calmante",d:"Les clients patientent 30 % plus longtemps.",c:90,ic:"the"},
  {id:"tips",name:"Pot à pourboires",d:"Pourboires doublés.",c:120,ic:"coin"},
  {id:"four",name:"Bûches de hêtre",d:"Le four cuit deux fois plus vite.",c:80,ic:"fourpro"},
  {id:"vip",name:"Invitations dorées",d:"Deux fois plus de clients VIP.",c:140,ic:"coussins"}
];
let boostSel=new Set(),boostCtx=null;
// Style : purement décoratif (papier peint, comptoir, tenue de Roussette sur la carte). S.style garde le choix.
const STYLE={
  wall:{name:"Papier peint",items:[
    {id:"rose",name:"Rose poudré",c:0,w:"#fbe6d6",d:"#f4d3c2",b:"#f2c6b2",l:"#e8b4a0"},
    {id:"menthe",name:"Menthe à l'eau",c:500,w:"#dff3e6",d:"#c4e6cf",b:"#bfe0c9",l:"#a5d1b3"},
    {id:"lavande",name:"Lavande",c:850,w:"#ece4fa",d:"#d9cdf2",b:"#d3c5ee",l:"#bfaee4"},
    {id:"citron",name:"Citron doux",c:1250,w:"#fbf3cf",d:"#f2e3a6",b:"#f2dc9a",l:"#e6c97a"},
    {id:"ciel",name:"Bleu nuage",c:1800,w:"#e0eefb",d:"#c7ddf3",b:"#c3d9f0",l:"#a9c6e6"},
    {id:"nuit",name:"Nuit des citrouilles",cb:40,w:"#5d4a7e",d:"#f2c75c",b:"#463863",l:"#f2a35c"}]},
  counter:{name:"Comptoir",items:[
    {id:"bois",name:"Bois de noisetier",c:0,t:"#c8946a",f:"#e8b07a",p:"#d09a64"},
    {id:"fraise",name:"Fraise",c:650,t:"#e8848f",f:"#f7b7c3",p:"#ec9aa8"},
    {id:"pistache",name:"Pistache",c:1000,t:"#7fbf98",f:"#b6e2c4",p:"#94cfa8"},
    {id:"nuage",name:"Nuage lilas",c:1450,t:"#a99fd8",f:"#e4e0f7",p:"#cbc4ec"},
    {id:"miel",name:"Miel doré",c:2100,t:"#d9a33a",f:"#f6d27a",p:"#e8b94e"},
    {id:"citrouille",name:"Citrouille",cb:40,t:"#5f4f72",f:"#f2a35c",p:"#d9803a"}]},
  acc:{name:"Ta tenue",items:[
    {id:"",name:"Au naturel",c:0},
    {id:"noeud",name:"Petit nœud",c:400},
    {id:"echarpe",name:"Écharpe",c:700},
    {id:"bonnet",name:"Bonnet",c:1000},
    {id:"lunettes",name:"Lunettes rondes",c:1300},
    {id:"etoile",name:"Étoile filante",c:2000},
    {id:"sorciere",name:"Chapeau de sorcière",cb:25},
    {id:"chauvesouris",name:"Serre-tête chauve-souris",cb:25},
    {id:"citrouille",name:"Bonnet citrouille",cb:30},
    {id:"vampire",name:"Cape de vampire",cb:45},
    {id:"couronne",name:"Couronne de citrouilles",album:1}]}
};
const styleOf=k=>{const it=STYLE[k].items;return it.find(x=>x.id===(S.style||{})[k])||it[0]};
const ALLUP=[...UPG.equip,...UPG.deco];
const lvDesc=(u,n)=>u.lv[Math.max(0,n-1)].d;
const SPOTX={2:[31,69],3:[20,50,80],4:[14,38,62,86]};
// clients ordinaires ; Roussette n'en fait plus partie : c'est le joueur
const REG=[...FOXES.filter(f=>f.rar==="commun"&&f.id!=="roussette"),...FOXES.filter(f=>f.rar==="discret")];
const VIPS=FOXES.filter(f=>f.rar==="discret");
const QUESTS=[
  {k:"serve",r:"cafe",n:18,t:"Sers 18 cafés",g:40},{k:"serve",r:"croissant",n:18,t:"Sers 18 croissants",g:40},
  {k:"serve",r:"the",n:18,t:"Sers 18 thés",g:45},{k:"serve",r:"cookie",n:20,t:"Sers 20 cookies",g:55},
  {k:"serve",r:"choco",n:15,t:"Sers 15 chocolats chauds",g:65},{k:"serve",r:"smoothie",n:15,t:"Sers 15 smoothies",g:75},{k:"serve",r:"gateau",n:12,t:"Sers 12 parts de gâteau",g:85},
  {k:"combo3",n:5,t:"Fais 5 combos ×3",g:40},{k:"combo",n:6,t:"Fais un combo ×6",g:60},
  {k:"vip",n:3,t:"Sers 3 clients VIP",g:60},{k:"perfect",n:2,t:"Réussis 2 journées sans client fâché",g:70},
  {k:"stars3",n:2,t:"Obtiens 3 étoiles sur 2 journées",g:90},{k:"orders",n:40,t:"Complète 40 commandes",g:50},
  {k:"big",n:6,t:"Complète 6 commandes de 3 articles",g:60},{k:"green",n:15,t:"Sers 15 clients quand leur jauge est encore verte",g:50},
  {k:"costume",n:25,t:"Sers 25 clients déguisés",g:30,cdy:1,hw:1},{k:"hwguest",n:6,t:"Sers 6 invités d'Halloween",g:40,cdy:1,hw:1},
  {k:"candy",n:80,t:"Récolte 80 bonbons",g:30,cdy:1,hw:1},{k:"night",n:2,t:"Réussis 2 Nuits d'Halloween",g:40,cdy:1,hw:1}
];
const qText=q=>q.k==="serve"?`Sers ${q.n} ${REC[q.r].pl}`:q.t;
const has=k=>(REC[k]&&!REC[k].day)||!!S.own[k];
// au menu d'une journée : les recettes gagnées avant elle seulement, même quand on rejoue une ancienne journée
const onMenu=(k,d=G&&G.run?G.day:curDay())=>has(k)&&!(REC[k].day>=d);
const optOn=(o,d=G&&G.run?G.day:curDay())=>!!S.own[o]&&OPTS[o].day<d;
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
// les six renards sauvages viennent d'abord à la gamelle du refuge ; une fois rencontrés, ils passent au Café en VIP
const WILD={somnus:"baies",reglisse:"baies",aurore:"baies",maree:"poisson",perle:"poisson",yeti:"miel"};
const WILD_FOOD={baies:"de baies",poisson:"de poisson",miel:"de miel"};
function wildMet(){try{const R=JSON.parse(localStorage.getItem("clairiere-renards-v2"));return Object.keys(WILD).filter(id=>R&&R.met&&R.met[id]).map(id=>FOX[id])}catch(e){return[]}}
// Difficulté : chaque journée a sa graine (commandes, VIP, arrivées) et son objectif, calculés par
// « python tools/balance-bot.py --calibrer » : ★★★ (1,7 × objectif) demande environ 94 % du score d'un joueur parfait.
// L'écart entre clients ne descend pas sous 4 s (3,2 s à partir de l'Automne) et la patience pas sous 14 s, sinon un bon joueur ne suit plus.
const SEED=[4,12,15,10,14,4,0,11,10,10,13,4,9,6,8,8,4,13,11,7,13,0,2,3,4,7,15,6,4,14,11,10,6,5,13,12,13,14,3,11];
const GOALS=[37,59,73,92,109,123,139,152,160,181,185,208,212,217,217,263,266,277,309,317,323,317,328,342,347,372,363,379,378,382,381,403,407,422,439,452,449,460,489,469];
// Équipement prévu pour chaque jour : [achat, niveau, à partir du jour]. Les objectifs sont calibrés avec lui
// (tools/balance-bot.py le lit ici). Chaque niveau d'amélioration en plus relève l'objectif de 2 % (12 % au plus) :
// tout équipé, ★★★ devenait gratuit (Joffray à 815 / 407 au jour 31). Pas plus de 12 % : tout équipé, le jeu parfait
// ne fait que 10 à 25 % de mieux selon le jour, et ★★★ doit rester possible. EQUIP=0 retire cet ajustement.
const KIT=[["plantes",1,4],["comptoir1",1,6],["double",1,6],["guirlande",1,8],["fourpro",1,8],["barista",1,11],["plateau",1,11],["comptoir1",2,13],["disque",1,13],["coussins",1,16],["serveur",1,19],["machines",1,23],["plateau",2,24],["fauteuils",1,27],["four2",1,33],["lanternes",1,37]];
const EQUIP=.02;
function equipBonus(d){
  let n=0;for(const u of ALLUP){const k=Math.max(0,...KIT.filter(x=>x[0]===u.id&&x[2]<=d).map(x=>x[1]));n+=Math.max(0,lv(u.id)-k)}
  return Math.min(.12,EQUIP*n);
}
function cfgOf(d){
  const c=d<=10?6+d:Math.min(24,16+Math.floor((d-10)/3)),goal=Math.round(GOALS[d-1]*(1+equipBonus(d)));
  // arrivées serrées (22/10/2026, Joffray passait 70 % du temps à attendre) : une file se forme à la porte
  return{c,gap:Math.max(d<=20?2.8:2.3,4.2-d*.19),pat:Math.max(14,21-d*.6),max:d<2?1:d<4?2:3,goal};
}
const todayStr=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
