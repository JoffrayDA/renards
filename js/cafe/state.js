/* Café Frimousse : sauvegarde (S), migrations, portes, quêtes. */
/* ---------- état ---------- */
let S;
deliverGifts(); // les cadeaux du calendrier de l'Avent (bourse.js), avant de lire la sauvegarde
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
// le Concours de la vallée (saisons.js) : scènes lues, défis gagnés ; Pâquerette (ex-Zaza, id "zaza") invitée du Printemps (11/11/2026)
S.sread=S.sread||{};S.sduel=S.sduel||{};S.guest=S.guest||{};if(S.guest.paquerette){S.guest.zaza=1;delete S.guest.paquerette}
// le compagnon, toujours à côté de Roussette (offert depuis le 11/11/2026) : choisi au refuge (R.buddy dans la sauvegarde
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
const curDay=()=>{if(WORLD)return itCur();let d=Math.min(S.day,LASTDAY);while(d>1&&!dayOpen(d))d--;return d};
function checkGuests(){const n=[];for(const c of CHAP)if(!S.guest[c.guest]&&chapStars(c)>=30){S.guest[c.guest]=1;n.push(c)}return n}
checkGuests();
function questAvail(q,P){if(q.hw)return HW&&(q.k!=="night"||nightOpen(1))&&(q.k!=="hwguest"||S.day>=3);return q.k==="vip"?P.vip>0:q.k==="big"?P.big>0:true}
// ce que rapporte une partie au point le plus avancé du joueur (le dernier quartier ouvert, sa journée en cours)
function qProfile(){
  const fw=typeof WORLDS==="undefined"?"":["kyoto","paris","italie"].find(w=>WORLDS[w]&&WORLDS[w].isOpen())||"";
  let d,k,own;
  if(fw){const Q=WORLDS[fw],V=Q.sv();d=Math.min(V.day,Q.days.length);const N=Q.days[d-1];k={...cfgOf(N.base)};if(N.hard)k.c*=N.hard;own=V.own||{}}
  else{d=Math.min(S.day,LASTDAY);k=cfgOf(d);own=S.own}
  const rd=x=>fw?((WORLDS[fw].recDays||IT_DAY)[x]||0):(REC[x].day||0);
  const menu=Object.keys(REC).filter(x=>(!REC[x].w||REC[x].w===fw)&&rd(x)<Math.max(d,2)),
    served=k.c*.85,items=[1,1,1.4,1.8][k.max];
  return{fw,sea:fw||chapOf(d).sea,menu,served,orders:served,rec:served*items/Math.max(1,menu.length),
    vip:(fw||d>=3)?k.c*.07*[1,2,2.5][+own.coussins||0]*.8:0,combo3:served*.12,big:k.max>=3?served*.22:0,green:served*.5,perfect:1,
    gain:served}
}
// un joli nombre : de 5 en 5 au-delà de 20, de 10 en 10 au-delà de 100
const qNice=x=>x<20?Math.max(3,Math.round(x)):x<100?Math.round(x/5)*5:Math.round(x/10)*10;
function qMake(tp,P,games,r){const rate=tp.k==="serve"?P.rec:P[tp.k],n=tp.n||qNice(rate*games);
  const q={k:tp.k,n,p:0,v:QV};
  if(tp.k==="serve"){q.r=r;q.sea=P.sea;q.t="serve-"+r}else q.t=tp.t.replace("{n}",n);
  q.g=games>10?Math.round((300+P.gain*25)/50)*50:Math.round((25+P.gain*3.5)/5)*5;
  return q}
// quêtes du jour et de la semaine (16/11/2026) : la liste se renouvelle au changement de jour réel, pas quand une quête est finie
const monday=()=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-(d.getDay()+6)%7);return d};
function fillQuests(){
  const td=todayStr();S.quests=S.quests||[];
  if(S.qd!==td||S.quests.some(q=>!q.hw&&q.v!==QV)){S.qd=td;S.quests=[];const P=qProfile();
    // pendant Halloween, une 4e quête, toujours d'Halloween
    if(HW){const o=QUESTS.filter(q=>q.hw&&questAvail(q,P));if(o.length)S.quests.push({...pick(o),p:0})}
    // une seule quête de recette par jour, parmi la carte du moment
    const pool=[...QUESTS.filter(q=>!q.hw&&q.k!=="serve"&&questAvail(q,P)).map(q=>[q]),...P.menu.map(r=>[QUESTS[0],r])];
    let rec=0;
    while(S.quests.filter(q=>!q.hw).length<3&&pool.length){
      const i=Math.floor(Math.random()*pool.length),[tp,r]=pool.splice(i,1)[0];
      if(tp.k==="serve"){if(rec)continue;rec=1}
      S.quests.push(qMake(tp,P,4.5,r));
    }
  }
  else S.quests=S.quests.filter(q=>!q.hw||HW);
  const m=monday(),wk=`${m.getFullYear()}-${m.getMonth()+1}-${m.getDate()}`;
  if(!S.wq||S.wq.w!==wk||S.wq.v!==QV){const i=Math.round(m.getTime()/6048e5)%WQUESTS.length,old=S.wq,q=qMake(WQUESTS[i],qProfile(),40);
    q.w=wk;q.b=5;if(old&&old.w===wk&&old.k===q.k){q.p=Math.min(old.p,q.n);q.done=old.done}S.wq=q}
}
let G=null,last=0,dirty=true,qDone=[];
function qEvent(k,v=1,r){if(G&&G.tuto)return; // la leçon ne compte pas
  const w=S.wq;if(w&&!w.done&&w.k===k){if(k==="combo")w.p=Math.max(w.p,v);else w.p+=v;
    if(w.p>=w.n){w.done=1;w.p=w.n;S.coins+=w.g;addBells(w.b);toast(`Quête de la semaine réussie ! +${w.g} pièces et ${w.b} clochettes`);if(G&&G.run)floatAt($("chips"),`Quête de la semaine ! +${w.g}`,true)}}
  S.quests.forEach(q=>{if(q.done||q.k!==k||(q.r&&q.r!==r))return;
    if(k==="combo"){q.p=Math.max(q.p,v)}else q.p+=v;
    if(q.p>=q.n){q.done=1;q.p=q.n;if(q.cdy)S.candy+=q.g;else{S.coins+=q.g;addBells(1)}qDone.push(q);toast(`Quête réussie : ${qText(q)} · +${q.g} ${q.cdy?"bonbons":"pièces et 1 clochette"}`);if(G&&G.run){const el=$("chips");floatAt(el,`Quête réussie ! +${q.g}`,true)}}});
}
