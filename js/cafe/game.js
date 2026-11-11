/* Café Frimousse : la journée en cours (G) : arrivées, service, cuisine. */
/* ---------- jeu ---------- */
const spotsN=()=>2+lv("comptoir1");
const trayCap=()=>3+lv("plateau");
const patMult=()=>1+[0,.15,.25][lv("plantes")]+(OWN().disque?.1:0)+(OWN().fauteuils?.2:0);
const tipMult=()=>1+[0,.25,.4][lv("guirlande")]+(OWN().disque?.1:0)+(OWN().lanternes?.25:0);
const batchOf=k=>REC[k].batch*(OWN().four2?2:1);
let uid=0;
function newDay(d){
  // dans un quartier (italie.js, paris.js), d est la journée du quartier : rythme d'un jour de référence du premier monde, graine et objectif à elle
  const it=WORLD&&WD().days[d-1];
  const cfg=it?itCfg(d):cfgOf(d),st={};SEA=it?WORLD:chapOf(d).sea;
  const bo={};for(const id of boostSel)if(S.boost[id]>0){S.boost[id]--;bo[id]=1}boostSel.clear();
  for(const k in REC)if(REC[k].kind==="drink"&&onMenu(k,d)&&!(it&&k==="smoothie"))st[k]=Array.from({length:k==="cafe"?1+lv("double"):OWN().machines?2:1},()=>({t:0,busy:0,ready:0}));
  const vit={};for(const k in REC)if(REC[k].kind==="bake"&&onMenu(k,d))vit[k]=k==="croissant"?2:0;
  // commandes, VIP et arrivées tirées avec une graine propre au jour : une journée est la même à chaque essai
  G={rng:it?rng(it.base*7919+it.seed+1):rng(d*7919+SEED[d-1]+1),it:it?1:0,run:1,paused:0,day:d,t:0,cfg,spawned:0,next:1,cust:[],tray:[],st,oven:{state:"idle"},vit,earned:0,served:0,lost:0,combo:0,bestCombo:0,newFox:[],helperT:2,vipServed:0,boost:bo,candy:0,cost:0,gain:0,replay:((it?WD().sv().stars:S.stars)[d]||0)>0,q0:Object.fromEntries(S.quests.map(q=>[q.t,q.p])),cone:"",cone2:""};
  // les fours : un seul d'habitude, deux à Kyoto à partir du jour 8 (WD().ovens) ; G.oven reste le premier (leçon, conseils)
  G.ovens=Array.from({length:it&&WD().ovens?WD().ovens(d):1},()=>({state:"idle"}));G.oven=G.ovens[0];
  // pas de deuxième four sans un plat de sa rangée à la carte
  if(G.ovens.length>1&&!Object.keys(vit).some(k=>(WD().ovenOf||{})[k]===1))G.ovens.length=1;
  // Kyoto, les défis des sumos (WD().sumo) : deux gros clients entrent lentement, s'installent pour toute la journée
  // et recommandent dès qu'ils sont servis (Joffray, 09/11/2026) ; il vient moins d'autres clients ces jours-là
  if(it&&WD().sumo&&WD().sumo[d]){G.cfg={...G.cfg,c:Math.round(G.cfg.c*.6)};G.sumo=1;
    for(const id of WD().sumo[d]){const sp=freeSpot(),pat=G.cfg.pat*patMult()*1.3;G.cust.push({id:++uid,fox:id,spot:sp,order:sumoOrder(),pat,patMax:pat,state:"walkin",walk:WALK*2.4,qp:pat,born:0,stay:1,slow:1,vip:false,costume:""});S.seen[id]=(S.seen[id]||0)+1}}
  // à Paris, les jours de défi : le score de Firmin, à battre (paris.js)
  if(it&&WD().duel&&WD().duel[d])G.duel=WD().duelScore(d);
  $("closed").hidden=true;closeMap();renderDecor();dirty=true;(MUSIC.again||MUSIC.want)(it?WD().music(d):"service"); // en Petite Italie, tarentelle et polka une journée sur deux (Joffray, 04/11/2026)
  const bn=BOOSTS.filter(b=>bo[b.id]).map(b=>b.name);if(bn.length){save();toast(`Bonus actif${bn.length>1?"s":""} : ${bn.join(", ")}`)}
}
function newNight(n){const N=NIGHTS[n-1];newDay(N.base);G.rng=rng(N.base*7919+N.seed+1);G.night=n;G.cfg={...G.cfg,goal:Math.round(N.goal*(1+equipBonus(N.base,!(S.hwStars[n]>0),.12)))};G.replay=(S.hwStars[n]||0)>0;dirty=true;MUSIC.want("fantomes")}
// Un client vit ainsi : file d'attente à la porte (queue), il entre en trottinant (walkin), attend sa commande (wait),
// reste un instant content ou fâché (happy, angry), puis repart en marchant (walkout). Sa patience ne baisse qu'en « wait ».
const WALK=1.6,QMAX=3;
function freeSpot(){const n=spotsN(),used=new Set(G.cust.filter(c=>c.spot>=0&&c.state!=="walkout").map(c=>c.spot));for(let i=0;i<n;i++)if(!used.has(i))return i;return -1}
function genOrder(){
  const un=Object.keys(REC).filter(k=>onMenu(k)),m=G.cfg.max,r=G.rng();
  const n=m===1?1:m===2?(r<.6?1:2):(r<.42?1:r<.78?2:3);
  // une fois sur trois environ, l'article demande une option gagnée (café crème, chantilly)
  return Array.from({length:n},()=>{const r=un[Math.floor(G.rng()*un.length)],op=Object.keys(OPTS).find(o=>OPTS[o].for.includes(r)&&optOn(o)),roll=G.rng();
    // un gelato de la Petite Italie (ou une boîte de macarons à Paris) : les trois parfums dans un ordre tiré au sort
    const T=r==="smoothie"&&gelOn()?gelT():r==="dango"?gel2T():null,g=T?Object.keys(T).map(x=>[G.rng(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).join(""):undefined;
    return{r,g,o:op&&roll<.35?op:undefined,done:0}});
}
const quake=()=>{const e=$("scene");if(!e)return;e.classList.remove("quake");void e.offsetWidth;e.classList.add("quake")};
// une commande de sumo : toujours quatre plats (Joffray, 09/11/2026 : « 4 choses minimum s'ils sont là »)
function sumoOrder(){let o=[];while(o.length<4)o=o.concat(genOrder());return o.slice(0,4)}
function spawn(){
  if(G.cust.filter(c=>c.state==="queue").length>=QMAX)return false;
  const here=new Set(G.cust.map(c=>c.fox));
  const vipCh=G.day>=3?(.07*[1,2,2.5][lv("coussins")]*(G.boost.vip?2:1)):0,guests=[...CHAP.filter(c=>S.guest[c.guest]).map(c=>FOX[c.guest]),...(S.hwKeep?[FOX.feufollet]:[]),...(S.noelKeep?[FOX.guimauve]:[]),...(S.it&&S.it.guest?[FOX.donnalimone]:[]),...(S.pa&&S.pa.guest?[FOX.celeste]:[]),...(S.ky&&S.ky.guest?[FOX.kyubi]:[])];
  let f,vip=false;
  // Math.random (et pas G.rng) pour le choix du client : la journée reste la même, l'équilibrage aussi
  if(G.rng()<vipCh){vip=true;const pool=(G.noel?NOELF:HW&&(G.night||Math.random()<.7)?HWF:guests.length&&Math.random()<.6?guests:[...VIPS,...wildMet()]).filter(x=>!here.has(x.id));f=pool.length?pick(pool):null}
  // dans un quartier, les gens du quartier viennent souvent, mêlés aux habitués du premier café
  if(!f){vip=false;const pool=(G.it?[...WD().reg(),...REG]:REG.slice(0,Math.min(REG.length,4+2*(G.day-1)))).filter(x=>!here.has(x.id));f=pick(pool)}
  // les VIP paient ×3 mais n'attendent que moitié moins longtemps
  const pat=G.cfg.pat*patMult()*(vip?.5:1)*(G.boost.patience?1.3:1);
  const costume=HW&&!G.noel&&!vip&&(G.night||Math.random()<.5)?pick(COSTUMES):""; // la nuit, tout le monde est déguisé
  // dans la file, il patiente aussi, mais plus longtemps (il voit qu'on s'active)
  // un sumo venu en client ordinaire commande aussi quatre plats, et patiente un peu plus
  const big=!!f.big,pt=big?pat*1.3:pat;
  G.cust.push({id:++uid,fox:f.id,spot:-1,order:big?sumoOrder():genOrder(),pat:pt,patMax:pt,state:"queue",qp:pat*1.2,vip,born:G.t,costume});
  if(costume){const ck=f.id+":"+costume;if(!S.costSeen[ck]&&S.seen[f.id])toast(`Nouveau déguisement : ${f.name} ${COSTNAME[costume]} !`);S.costSeen[ck]=(S.costSeen[ck]||0)+1}
  if(vip)toast(f.event==="noel"?`${f.name} est là ! Sers-le vite : il paie ×3 et donne un sucre d'orge.`:f.event?`${f.name} est là ! Sers-le vite : il paie ×3 et donne 5 bonbons.`:`VIP pressé : ${f.name} ! Sers-le vite, il paie ×3.`);else if(!S.seen[f.id])toast(`Nouveau client : ${f.name} !`);
  if(!S.seen[f.id])G.newFox.push(f.name);
  S.seen[f.id]=(S.seen[f.id]||0)+1;
  G.spawned++;dirty=true;return true;
}
function update(dt){
  G.t+=dt;
  if(G.spawned<G.cfg.c&&G.t>=G.next){if(spawn())G.next=G.t+G.cfg.gap*(.7+G.rng()*.6);else G.next=G.t+.5}
  for(const c of G.cust){
    // un sumo qui marche : boum à chaque pas, et la salle tremble
    if(c.slow&&(c.state==="walkin"||c.state==="walkout")){c.stepT=(c.stepT||0)-dt;if(c.stepT<=0){c.stepT=.62;bip("stomp");quake()}}
    if(c.state==="wait"){c.pat-=dt;if(c.pat<=0&&c.stay){G.lost++;G.combo=0;bip("angry");floatAt(custEl(c),"Grrr !");c.order=sumoOrder();c.pat=c.patMax;c.low=0;dirty=true}
      else if(c.pat<=0){c.state="angry";c.leave=.9;G.lost++;G.combo=0;dirty=true;bip("angry")}
      else if(c.pat/c.patMax<.3&&!c.low){c.low=1;dirty=true}}
    else if(c.state==="queue"){c.qp-=dt;if(c.qp<=0){c.state="angry";c.leave=.9;c.gave=1;G.lost++;G.combo=0;dirty=true;bip("angry")}}
    else if(c.state==="walkin"){c.walk-=dt;if(c.walk<=0){c.state="wait";c.born=G.t;dirty=true}}
    else if(c.state==="walkout"){c.walk-=dt;if(c.walk<=0){c.gone=1;dirty=true}}
    else if(c.stay&&c.state==="happy"){c.leave-=dt;if(c.leave<=0){c.state="wait";c.order=sumoOrder();c.pat=c.patMax;c.low=0;c.born=G.t;dirty=true}}
    else{c.leave-=dt;if(c.leave<=0){if(c.gave)c.gone=1;else{c.state="walkout";c.walk=WALK};dirty=true}}
  }
  G.cust=G.cust.filter(c=>!c.gone);
  // une place se libère : le premier de la file entre
  for(const c of G.cust)if(c.state==="queue"){const sp=freeSpot();if(sp<0)break;c.spot=sp;c.state="walkin";c.walk=WALK;dirty=true}
  const sp=[1,1.15,1.22,1.3][lv("barista")];
  for(const k in G.st)for(const s of G.st[k])if(s.busy){s.t+=dt*sp;if(s.t>=REC[k].time){s.busy=0;s.ready=1;dirty=true}}
  for(const o of G.ovens){
  if(o.state==="bake"){o.t+=dt;if(o.t>=o.dur){o.state="ready";o.burn=o.burnMax=[4.5,5.2,6][lv("fourpro")];dirty=true;bip("ding")}}
  else if(o.state==="ready"){o.burn-=dt;if(o.burn<=0){const lost=Math.round(REC[o.r].cost*batchOf(o.r));o.state="burnt";o.t=1.4;dirty=true;bip("burn");S.coins=Math.max(0,S.coins-lost);G.gain-=lost;G.cost+=lost;toast(`Oh non, les ${REC[o.r].pl} ont brûlé ! −${lost} pièces d'ingrédients`)}}
  else if(o.state==="burnt"){o.t-=dt;if(o.t<=0){o.state="idle";dirty=true}}
  }
  // le compagnon (Petit Pois par défaut) : toutes les 0,5 s, il apporte au client le plus pressé ce qui l'attend sur le plateau
  // (la « vitrine » de Joffray) ; il ne touche jamais au plan de travail : sinon c'est de la triche, et on ne comprend plus
  if(!G.tuto){G.helperT-=dt;if(G.helperT<=0){G.helperT=.5;
    const w=G.cust.filter(c=>c.state==="wait").sort((a,b)=>a.pat-b.pat);
    for(const c of w){let got=0;for(const it of c.order){if(it.done)continue;const k=G.tray.indexOf(itemKey(it));if(k<0)continue;
        flyPastry(itemKey(it),custEl(c),got+1,k);G.tray.splice(k,1);it.done=1;got++;G.arm=null;G.pick=null}
      if(got){floatAt(custEl(c),`${FOX[buddy()].name} !`);bip("pop");buddyHop();buddyTip();if(c.order.every(x=>x.done))complete(c);dirty=true;break}}
}}
  // les sumos ne repartent qu'une fois tous les autres clients partis
  if(G.sumo&&G.spawned>=G.cfg.c&&G.cust.length&&!G.cust.some(c=>!c.stay))for(const c of G.cust){c.stay=0;c.state="walkout";c.walk=WALK*2.4;dirty=true}
  if(G.spawned>=G.cfg.c&&!G.cust.length)endDay();
}
const custEl=c=>document.querySelector(`[data-cust="${c.id}"]`);
// une option s'ajoute au premier article du plateau qui peut la recevoir et n'en a pas encore
// les articles du plateau qui peuvent recevoir l'option
const optFits=o=>G.tray.map((k,i)=>!k.includes("+")&&OPTS[o].for.includes(k)?i:-1).filter(i=>i>=0);
function applyOpt(o,el,at){
  const fit=optFits(o);
  if(!fit.length){shake(el);hint(`Pose d'abord ${OPTS[o].for.map(r=>REC[r].name.toLowerCase()).join(" ou ")} sur le plateau, puis touche « ${OPTS[o].name} ».`);return}
  // plusieurs possibles (un chocolat et un gâteau pour la chantilly) : on touche celui qui la reçoit
  if(at==null&&el&&fit.length>1&&new Set(fit.map(i=>G.tray[i])).size>1){G.pick={o,until:performance.now()+5000};setTimeout(()=>{dirty=true},5050);hint(`Touche l'article qui reçoit ${OPTS[o].name.toLowerCase()}.`);dirty=true;return}
  const i=at!=null?at:fit[0];bip("pop",4);G.tray[i]+="+"+o;G.popI=i;G.arm=null;G.pick=null;dirty=true;
}
function deliver(c,el){
  if(c.state!=="wait")return;let got=0;
  c.order.forEach(o=>{if(o.done)return;const k=G.tray.indexOf(itemKey(o));if(k>=0){G.tray.splice(k,1);o.done=1;got++;G.arm=null}});
  if(!got){shake(el);hint(`${FOX[c.fox].name} veut : <b>${c.order.filter(o=>!o.done).map(o=>itemName(itemKey(o)).toLowerCase()).join(", ")}</b>. Prépare-le et pose-le sur le plateau.`);return}
  if(c.order.every(o=>o.done))complete(c);dirty=true;
}
function complete(c){
  {const m=noelEvent("serve");if(m)toast(m)} // la quête de Noël du jour (tenues.js)
  const frac=Math.max(0,c.pat/c.patMax),base=c.order.reduce((a,o)=>a+itemPrice(itemKey(o)),0);
  let tip=Math.round(base*.45*frac*tipMult()*(G.boost.tips?2:1));
  if(frac>=.5){S.happy[c.fox]=(S.happy[c.fox]||0)+1;G.combo++;G.bestCombo=Math.max(G.bestCombo,G.combo);qEvent("combo",G.combo);if(G.combo===3)qEvent("combo3");if(G.combo>=3)buddyHop()}else G.combo=0;
  const cb=G.combo>=3?Math.min(G.combo,6)-1:0;
  let tot=base+tip+cb;if(c.vip){tot*=3;G.vipServed++;qEvent("vip")}
  // la recette (objectif, étoiles) compte le prix payé ; on ne garde en pièces que le bénéfice, et la moitié quand on rejoue (30 % avant le 30/10/2026)
  const cost=c.order.reduce((a,o)=>a+itemCost(itemKey(o)),0),gain=Math.max(0,Math.round((tot-cost)*(G.replay?.25:1)));
  G.earned+=tot;G.cost+=cost;G.gain+=gain;S.coins+=gain;S.total+=gain;G.served++;S.served++;
  c.order.forEach(o=>qEvent("serve",1,o.r));qEvent("orders");if(c.order.length>=3)qEvent("big");
  if(frac>=.6)qEvent("green");
  c.state="happy";c.leave=1;bip("coin",Math.min(G.combo,6));
  // Halloween : les clients déguisés donnent des bonbons (2 s'ils sont servis vite), les invités d'Halloween 5
  const cdy=HW&&!G.noel?(FOX[c.fox].event==="halloween"?5:c.costume?(frac>=.5?2:1):0):0;
  if(cdy){S.candy+=cdy;G.candy+=cdy;qEvent("candy",cdy)}
  if(c.costume)qEvent("costume");
  // album d'Halloween : servir chacun des invités une fois donne la Couronne de citrouilles à Roussette
  if(G.noel&&FOX[c.fox].event==="noel"){addSucres(1);G.sucres=(G.sucres||0)+1} // un invité de Noël donne un sucre d'orge
  if(FOX[c.fox].event==="halloween"){qEvent("hwguest");if(!S.hwServed[c.fox]){S.hwServed[c.fox]=1;const k=HWF.filter(f=>S.hwServed[f.id]).length;toast(`Album d'Halloween : ${FOX[c.fox].name} ! (${k} / ${HWF.length})`);if(k===HWF.length&&!S.own["st-acc-couronne"]){S.own["st-acc-couronne"]=1;G.albumNew=1}}}
  const el=custEl(c);if(el){burst(el);floatAt(el,`+${tot}`,true);if(cb){const n=G.combo;setTimeout(()=>floatAt(el,`Combo ×${n}`),250)}if(cdy)setTimeout(()=>floatAt(el,`+${cdy} bonbon${cdy>1?"s":""}`),cb?500:250)}
  dirty=true;
}
function tapStation(k,el){
  if(!G||!G.run)return;
  const sl=G.st[k],r=sl.find(s=>s.ready);
  if(r){if(G.tray.length>=trayCap()){shake($("tray"));toast("Plateau plein ! Sers un client ou jette un article.");return}r.ready=0;r.t=0;bip("pop");G.tray.push(k);G.popI=G.tray.length-1;G.arm=null;dirty=true;return}
  const f=sl.find(s=>!s.busy&&!s.ready);
  if(f){f.busy=1;f.t=0;dirty=true;bip("tap")}else shake(el);
}
// le comptoir à glaces : chaque toucher pose une boule sur le cornet ; à la troisième, le gelato part sur le plateau
function scoop(f,el){
  if(!G||!G.run||typeof G.cone!=="string")return;
  if(G.cone.length===2&&G.tray.length>=trayCap()){shake($("tray"));toast("Plateau plein ! Sers un client ou jette un article.");return}
  G.cone+=f;bip("plic",G.cone.length*3);if(G.cone.length===3){G.tray.push("smoothie~"+G.cone);G.popI=G.tray.length-1;G.cone="";G.arm=null}dirty=true;
}
function scoop2(f){
  if(!G||!G.run||typeof G.cone2!=="string")return;
  if(G.cone2.length===2&&G.tray.length>=trayCap()){shake($("tray"));toast("Plateau plein ! Sers un client ou jette un article.");return}
  G.cone2+=f;bip("plic",G.cone2.length*3);if(G.cone2.length===3){G.tray.push("dango~"+G.cone2);G.popI=G.tray.length-1;G.cone2="";G.arm=null}dirty=true;
}
// chaque four a sa rangée de vitrine (Kyoto, 09/11/2026, Joffray : « le four 1 pour les plats 1, 2, 3, le four 2 pour les autres ») :
// WD().ovenOf[k] dit quel four cuit k ; avec un seul four, il cuit tout. On sort la fournée d'un four (i), ou du premier qui est prêt.
const ovenOf=k=>G.ovens.length>1&&WORLD&&WD().ovenOf?WD().ovenOf[k]||0:0,ovenFor=k=>G.ovens[ovenOf(k)];
const ovenIdle=()=>G.ovens.find(o=>o.state==="idle"),ovenReady=()=>G.ovens.find(o=>o.state==="ready");
function bake(k){const o=ovenFor(k);if(o.state!=="idle")return;bip("tap");Object.assign(o,{state:"bake",r:k,t:0,dur:REC[k].time*[1,.88,.8][lv("fourpro")]*(G.boost.four?.5:1)});dirty=true}
function unload(i){const o=i!=null?G.ovens[i]:ovenReady();if(!o||o.state!=="ready")return;G.vit[o.r]=Math.min(OWN().four2?14:9,(G.vit[o.r]||0)+batchOf(o.r));o.state="idle";bip("pop",-3);dirty=true}
function fromVit(k,el){if(!G.vit[k])return;if(G.tray.length>=trayCap()){shake($("tray"));toast("Plateau plein !");return}G.vit[k]--;bip("pop");G.tray.push(k);G.popI=G.tray.length-1;G.arm=null;dirty=true}
