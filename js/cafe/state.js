/* Kitsune Café : sauvegarde (S), migrations, portes, quêtes. */
/* ---------- état ---------- */
let S;
try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null}
if(!S||!S.own)S={day:1,coins:0,own:{},seen:{},stars:{},quests:[],qp:{},streak:0,lastDay:"",total:0,served:0,ver:3,best:{},guest:{},pass:{},style:{wall:"rose",counter:"bois",acc:""}};
if(!S.ver){
  // v1 -> v2 : les recettes viennent de la carte, et les saisons déjà atteintes restent ouvertes
  for(const k in REC)if(REC[k].day&&REC[k].day<S.day)S.own[k]=1;
  S.best={};S.guest={};S.pass={};
  for(const c of CHAP)if(c.gate&&c.from<=S.day)S.pass[c.id]=1;
  S.ver=2;
}
// 22/10/2026 : le niveau 2 de Petit Pois (relance du four) est retiré, il est remboursé
if(S.own.serveur>1){S.own.serveur=1;S.coins+=1600;save()}
// options (22/10/2026) : déjà gagnées si on a dépassé leur journée
for(const o in OPTS)if(S.day>OPTS[o].day)S.own[o]=1;
if(S.ver<3){
  // v2 -> v3 : boutique à niveaux (Plateau géant = Plateau niv. 2, Grand comptoir = Comptoir niv. 2), style du café
  if(S.own.plateau5){S.own.plateau=2;delete S.own.plateau5}
  if(S.own.comptoir2){S.own.comptoir1=2;delete S.own.comptoir2}
  S.style={wall:"rose",counter:"bois",acc:""};S.ver=3;
}
// le nom du joueur (Roussette par défaut) ; S.named : l'écran d'accueil où on le choisit a été vu (une fois, parties en cours comprises)
const ME=()=>S.name||"Roussette";
// le compagnon, à côté de Roussette quand l'Apprenti serveur est acheté : choisi au refuge (R.buddy dans la sauvegarde
// de la Clairière, lue sans y écrire), Petit Pois par défaut. S.together[id] = {n : journées ensemble (une par jour réel), last}
function buddy(){try{const R=JSON.parse(localStorage.getItem("clairiere-renards-v2"));const id=R&&R.buddy;if(id&&R.res&&R.res[id]&&FOX[id])return id}catch(e){}return "petitpois"}
S.together=S.together||{};
S.candy=S.candy||0;S.boost=S.boost||{};S.happy=S.happy||{}; // happy : clients servis contents, par renard (ils peuvent suivre Roussette au refuge)
 // bonbons d'Halloween (gardés d'une année sur l'autre)
S.hwStars=S.hwStars||{};S.hwServed=S.hwServed||{};S.costSeen=S.costSeen||{}; // costSeen["renard:déguisement"] = nombre de visites // étoiles des Nuits, album des invités d'Halloween servis (S.hwKeep : Feu Follet reste)
function nightOpen(n){const N=NIGHTS[n-1];return HW&&S.day>N.base&&(n===1||(S.hwStars[n-1]||0)>0)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const chapOf=d=>CHAP.find(c=>d<=c.to)||CHAP[CHAP.length-1];
const starSum=()=>Object.values(S.stars).reduce((a,b)=>a+b,0);
const chapStars=c=>{let n=0;for(let d=c.from;d<=c.to;d++)n+=S.stars[d]||0;return n};
// portes relevées le 22/10/2026 (20/45/72 -> 24/50/78) : une porte déjà franchie avec l'ancien seuil reste ouverte
if(!S.gate2){const old={ete:20,automne:45,hiver:72},n=Object.values(S.stars).reduce((a,b)=>a+b,0);for(const c of CHAP)if(c.gate&&S.day>=c.from&&n>=old[c.id])S.pass[c.id]=1;S.gate2=1}
function gateOpen(c){if(!c.gate||S.pass[c.id])return true;if(starSum()>=c.gate){S.pass[c.id]=1;save();return true}return false}
const dayOpen=d=>d>=1&&d<=Math.min(S.day,LASTDAY)&&gateOpen(chapOf(d));
const curDay=()=>{let d=Math.min(S.day,LASTDAY);while(d>1&&!dayOpen(d))d--;return d};
function checkGuests(){const n=[];for(const c of CHAP)if(!S.guest[c.guest]&&chapStars(c)>=30){S.guest[c.guest]=1;n.push(c)}return n}
checkGuests();
function questAvail(q){if(q.hw)return HW&&(q.k!=="night"||nightOpen(1))&&(q.k!=="hwguest"||S.day>=3);return q.k==="serve"?has(q.r):q.k==="vip"?S.day>=3:q.k==="big"?S.day>=4:true}
// quêtes d'avant le 21/10/2026 : celles qui n'existent plus sont remplacées, les autres gardent leur avancée
// (22/10/2026 : quêtes plus longues, l'avancée est gardée en passant au nouvel objectif du même type)
{const seenT=new Set();S.quests=S.quests.filter(q=>!q.done).map(q=>{const x=QUESTS.find(x=>x.t===q.t)||QUESTS.find(x=>x.k===q.k&&x.r===q.r);return x&&(!x.hw||HW)&&!seenT.has(x.t)&&seenT.add(x.t)?{...x,p:Math.min(q.p,x.n)}:null}).filter(Boolean)}
function fillQuests(){
  // pendant Halloween, une 4e quête, toujours d'Halloween
  if(HW&&!S.quests.some(q=>q.hw)){const o=QUESTS.filter(q=>q.hw&&questAvail(q));if(o.length)S.quests.push({...pick(o),p:0})}
  while(S.quests.filter(q=>!q.hw).length<3){
    const used=new Set(S.quests.map(q=>q.t)),opts=QUESTS.filter(q=>!q.hw&&questAvail(q)&&!used.has(q.t));
    if(!opts.length)break;const q=pick(opts);S.quests.push({...q,p:0});
  }
}
fillQuests();
let G=null,last=0,dirty=true,qDone=[];
function qEvent(k,v=1,r){
  S.quests.forEach(q=>{if(q.done||q.k!==k||(q.r&&q.r!==r))return;
    if(k==="combo"){q.p=Math.max(q.p,v)}else q.p+=v;
    if(q.p>=q.n){q.done=1;q.p=q.n;if(q.cdy)S.candy+=q.g;else S.coins+=q.g;qDone.push(q);toast(`Quête réussie : ${qText(q)} · +${q.g} ${q.cdy?"bonbons":"pièces"}`);if(G&&G.run){const el=$("chips");floatAt(el,`Quête réussie ! +${q.g}`,true)}}});
}
