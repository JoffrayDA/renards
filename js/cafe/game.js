/* Kitsune Café : la journée en cours (G) : arrivées, service, cuisine. */
/* ---------- jeu ---------- */
const spotsN=()=>2+lv("comptoir1");
const trayCap=()=>3+lv("plateau");
const patMult=()=>1+[0,.15,.25][lv("plantes")]+(S.own.disque?.1:0)+(S.own.fauteuils?.2:0);
const tipMult=()=>1+[0,.25,.4][lv("guirlande")]+(S.own.disque?.1:0)+(S.own.lanternes?.25:0);
const batchOf=k=>REC[k].batch*(S.own.four2?2:1);
let uid=0;
function newDay(d){
  const cfg=cfgOf(d),st={};SEA=chapOf(d).id;
  const bo={};for(const id of boostSel)if(S.boost[id]>0){S.boost[id]--;bo[id]=1}boostSel.clear();
  for(const k in REC)if(REC[k].kind==="drink"&&onMenu(k,d))st[k]=Array.from({length:k==="cafe"?1+lv("double"):S.own.machines?2:1},()=>({t:0,busy:0,ready:0}));
  const vit={};for(const k in REC)if(REC[k].kind==="bake"&&onMenu(k,d))vit[k]=k==="croissant"?2:0;
  // commandes, VIP et arrivées tirées avec une graine propre au jour : une journée est la même à chaque essai
  G={rng:rng(d*7919+SEED[d-1]+1),run:1,paused:0,day:d,t:0,cfg,spawned:0,next:1,cust:[],tray:[],st,oven:{state:"idle"},vit,earned:0,served:0,lost:0,combo:0,bestCombo:0,newFox:[],helperT:2,vipServed:0,boost:bo,candy:0,cost:0,gain:0,replay:(S.stars[d]||0)>0,q0:Object.fromEntries(S.quests.map(q=>[q.t,q.p]))};
  $("closed").hidden=true;closeMap();renderDecor();dirty=true;MUSIC.want("service");
  const bn=BOOSTS.filter(b=>bo[b.id]).map(b=>b.name);if(bn.length){save();toast(`Bonus actif${bn.length>1?"s":""} : ${bn.join(", ")}`)}
}
function newNight(n){const N=NIGHTS[n-1];newDay(N.base);G.rng=rng(N.base*7919+N.seed+1);G.night=n;G.cfg={...G.cfg,goal:Math.round(N.goal*(1+equipBonus(N.base)))};G.replay=(S.hwStars[n]||0)>0;dirty=true;MUSIC.want("fantomes")}
// Un client vit ainsi : file d'attente à la porte (queue), il entre en trottinant (walkin), attend sa commande (wait),
// reste un instant content ou fâché (happy, angry), puis repart en marchant (walkout). Sa patience ne baisse qu'en « wait ».
const WALK=1.6,QMAX=3;
function freeSpot(){const n=spotsN(),used=new Set(G.cust.filter(c=>c.spot>=0&&c.state!=="walkout").map(c=>c.spot));for(let i=0;i<n;i++)if(!used.has(i))return i;return -1}
function genOrder(){
  const un=Object.keys(REC).filter(k=>onMenu(k)),m=G.cfg.max,r=G.rng();
  const n=m===1?1:m===2?(r<.6?1:2):(r<.42?1:r<.78?2:3);
  // une fois sur trois environ, l'article demande une option gagnée (café crème, chantilly)
  return Array.from({length:n},()=>{const r=un[Math.floor(G.rng()*un.length)],op=Object.keys(OPTS).find(o=>OPTS[o].for.includes(r)&&optOn(o)),roll=G.rng();
    return{r,o:op&&roll<.35?op:undefined,done:0}});
}
function spawn(){
  if(G.cust.filter(c=>c.state==="queue").length>=QMAX)return false;
  const here=new Set(G.cust.map(c=>c.fox));
  const vipCh=G.day>=3?(.07*[1,2,2.5][lv("coussins")]*(G.boost.vip?2:1)):0,guests=[...CHAP.filter(c=>S.guest[c.guest]).map(c=>FOX[c.guest]),...(S.hwKeep?[FOX.feufollet]:[])];
  let f,vip=false;
  // Math.random (et pas G.rng) pour le choix du client : la journée reste la même, l'équilibrage aussi
  if(G.rng()<vipCh){vip=true;const pool=(HW&&(G.night||Math.random()<.7)?HWF:guests.length&&Math.random()<.6?guests:VIPS).filter(x=>!here.has(x.id));f=pool.length?pick(pool):null}
  if(!f){vip=false;const pool=REG.slice(0,Math.min(REG.length,4+2*(G.day-1))).filter(x=>!here.has(x.id));f=pick(pool)}
  // les VIP paient ×3 mais n'attendent que moitié moins longtemps
  const pat=G.cfg.pat*patMult()*(vip?.5:1)*(G.boost.patience?1.3:1);
  const costume=HW&&!vip&&(G.night||Math.random()<.5)?pick(COSTUMES):""; // la nuit, tout le monde est déguisé
  // dans la file, il patiente aussi, mais plus longtemps (il voit qu'on s'active)
  G.cust.push({id:++uid,fox:f.id,spot:-1,order:genOrder(),pat,patMax:pat,state:"queue",qp:pat*1.2,vip,born:G.t,costume});
  if(costume){const ck=f.id+":"+costume;if(!S.costSeen[ck]&&S.seen[f.id])toast(`Nouveau déguisement : ${f.name} ${COSTNAME[costume]} !`);S.costSeen[ck]=(S.costSeen[ck]||0)+1}
  if(vip)toast(f.event?`${f.name} est là ! Sers-le vite : il paie ×3 et donne 5 bonbons.`:`VIP pressé : ${f.name} ! Sers-le vite, il paie ×3.`);else if(!S.seen[f.id])toast(`Nouveau client : ${f.name} !`);
  if(!S.seen[f.id])G.newFox.push(f.name);
  S.seen[f.id]=(S.seen[f.id]||0)+1;
  G.spawned++;dirty=true;return true;
}
function update(dt){
  G.t+=dt;
  if(G.spawned<G.cfg.c&&G.t>=G.next){if(spawn())G.next=G.t+G.cfg.gap*(.7+G.rng()*.6);else G.next=G.t+.5}
  for(const c of G.cust){
    if(c.state==="wait"){c.pat-=dt;if(c.pat<=0){c.state="angry";c.leave=.9;G.lost++;G.combo=0;dirty=true}
      else if(c.pat/c.patMax<.3&&!c.low){c.low=1;dirty=true}}
    else if(c.state==="queue"){c.qp-=dt;if(c.qp<=0){c.state="angry";c.leave=.9;c.gave=1;G.lost++;G.combo=0;dirty=true}}
    else if(c.state==="walkin"){c.walk-=dt;if(c.walk<=0){c.state="wait";c.born=G.t;dirty=true}}
    else if(c.state==="walkout"){c.walk-=dt;if(c.walk<=0){c.gone=1;dirty=true}}
    else{c.leave-=dt;if(c.leave<=0){if(c.gave)c.gone=1;else{c.state="walkout";c.walk=WALK};dirty=true}}
  }
  G.cust=G.cust.filter(c=>!c.gone);
  // une place se libère : le premier de la file entre
  for(const c of G.cust)if(c.state==="queue"){const sp=freeSpot();if(sp<0)break;c.spot=sp;c.state="walkin";c.walk=WALK;dirty=true}
  const sp=[1,1.15,1.22,1.3][lv("barista")];
  for(const k in G.st)for(const s of G.st[k])if(s.busy){s.t+=dt*sp;if(s.t>=REC[k].time){s.busy=0;s.ready=1;dirty=true}}
  const o=G.oven;
  if(o.state==="bake"){o.t+=dt;if(o.t>=o.dur){o.state="ready";o.burn=o.burnMax=[4.5,5.2,6][lv("fourpro")];dirty=true}}
  else if(o.state==="ready"){o.burn-=dt;if(o.burn<=0){const lost=Math.round(REC[o.r].cost*batchOf(o.r));o.state="burnt";o.t=1.4;dirty=true;S.coins=Math.max(0,S.coins-lost);G.gain-=lost;G.cost+=lost;toast(`Oh non, les ${REC[o.r].pl} ont brûlé ! −${lost} pièces d'ingrédients`)}}
  else if(o.state==="burnt"){o.t-=dt;if(o.t<=0){o.state="idle";dirty=true}}
  // Petit Pois : toutes les 0,5 s, il apporte d'un coup les pâtisseries en vitrine au client le plus pressé
  if(S.own.serveur){G.helperT-=dt;if(G.helperT<=0){G.helperT=.5;
    const w=G.cust.filter(c=>c.state==="wait").sort((a,b)=>a.pat-b.pat);
    for(const c of w){let got=0;for(const it of c.order)if(!it.done&&!it.o&&REC[it.r].kind==="bake"&&G.vit[it.r]>0){G.vit[it.r]--;it.done=1;got++}
      if(got){floatAt(custEl(c),"Petit Pois !");if(c.order.every(x=>x.done))complete(c);dirty=true;break}}
}}
  if(G.spawned>=G.cfg.c&&!G.cust.length)endDay();
}
const custEl=c=>document.querySelector(`[data-cust="${c.id}"]`);
// une option s'ajoute au premier article du plateau qui peut la recevoir et n'en a pas encore
function applyOpt(o,el){
  const i=G.tray.findIndex(k=>!k.includes("+")&&OPTS[o].for.includes(k));
  if(i<0){shake(el);hint(`Pose d'abord ${OPTS[o].for.map(r=>REC[r].name.toLowerCase()).join(" ou ")} sur le plateau, puis touche « ${OPTS[o].name} ».`);return}
  G.tray[i]+="+"+o;G.popI=i;G.arm=null;dirty=true;
}
function deliver(c,el){
  if(c.state!=="wait")return;let got=0;
  c.order.forEach(o=>{if(o.done)return;const k=G.tray.indexOf(itemKey(o));if(k>=0){G.tray.splice(k,1);o.done=1;got++;G.arm=null}});
  if(!got){shake(el);hint(`${FOX[c.fox].name} veut : <b>${c.order.filter(o=>!o.done).map(o=>itemName(itemKey(o)).toLowerCase()).join(", ")}</b>. Prépare-le et pose-le sur le plateau.`);return}
  if(c.order.every(o=>o.done))complete(c);dirty=true;
}
function complete(c){
  const frac=Math.max(0,c.pat/c.patMax),base=c.order.reduce((a,o)=>a+itemPrice(itemKey(o)),0);
  let tip=Math.round(base*.45*frac*tipMult()*(G.boost.tips?2:1));
  if(frac>=.5){G.combo++;G.bestCombo=Math.max(G.bestCombo,G.combo);qEvent("combo",G.combo);if(G.combo===3)qEvent("combo3")}else G.combo=0;
  const cb=G.combo>=3?Math.min(G.combo,6)-1:0;
  let tot=base+tip+cb;if(c.vip){tot*=3;G.vipServed++;qEvent("vip")}
  // la recette (objectif, étoiles) compte le prix payé ; on ne garde en pièces que le bénéfice, et 30 % quand on rejoue
  const cost=c.order.reduce((a,o)=>a+itemCost(itemKey(o)),0),gain=Math.max(0,Math.round((tot-cost)*(G.replay?.3:1)));
  G.earned+=tot;G.cost+=cost;G.gain+=gain;S.coins+=gain;S.total+=gain;G.served++;S.served++;
  c.order.forEach(o=>qEvent("serve",1,o.r));qEvent("orders");if(c.order.length>=3)qEvent("big");
  if(frac>=.6)qEvent("green");
  c.state="happy";c.leave=1;
  // Halloween : les clients déguisés donnent des bonbons (2 s'ils sont servis vite), les invités d'Halloween 5
  const cdy=HW?(FOX[c.fox].event?5:c.costume?(frac>=.5?2:1):0):0;
  if(cdy){S.candy+=cdy;G.candy+=cdy;qEvent("candy",cdy)}
  if(c.costume)qEvent("costume");
  // album d'Halloween : servir chacun des invités une fois donne la Couronne de citrouilles à Roussette
  if(FOX[c.fox].event){qEvent("hwguest");if(!S.hwServed[c.fox]){S.hwServed[c.fox]=1;const k=HWF.filter(f=>S.hwServed[f.id]).length;toast(`Album d'Halloween : ${FOX[c.fox].name} ! (${k} / ${HWF.length})`);if(k===HWF.length&&!S.own["st-acc-couronne"]){S.own["st-acc-couronne"]=1;G.albumNew=1}}}
  const el=custEl(c);if(el){burst(el);floatAt(el,`+${tot}`,true);if(cb){const n=G.combo;setTimeout(()=>floatAt(el,`Combo ×${n}`),250)}if(cdy)setTimeout(()=>floatAt(el,`+${cdy} bonbon${cdy>1?"s":""}`),cb?500:250)}
  dirty=true;
}
function tapStation(k,el){
  if(!G||!G.run)return;
  const sl=G.st[k],r=sl.find(s=>s.ready);
  if(r){if(G.tray.length>=trayCap()){shake($("tray"));toast("Plateau plein ! Sers un client ou jette un article.");return}r.ready=0;r.t=0;G.tray.push(k);G.popI=G.tray.length-1;G.arm=null;dirty=true;return}
  const f=sl.find(s=>!s.busy&&!s.ready);
  if(f){f.busy=1;f.t=0;dirty=true}else shake(el);
}
function bake(k){const o=G.oven;if(o.state!=="idle")return;Object.assign(o,{state:"bake",r:k,t:0,dur:REC[k].time*[1,.88,.8][lv("fourpro")]*(G.boost.four?.5:1)});dirty=true}
function unload(){const o=G.oven;if(o.state!=="ready")return;G.vit[o.r]=Math.min(S.own.four2?14:9,(G.vit[o.r]||0)+batchOf(o.r));o.state="idle";dirty=true}
function fromVit(k,el){if(!G.vit[k])return;if(G.tray.length>=trayCap()){shake($("tray"));toast("Plateau plein !");return}G.vit[k]--;G.tray.push(k);G.popI=G.tray.length-1;G.arm=null;dirty=true}
