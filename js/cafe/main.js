/* Kitsune Café : effets, événements (touchers) et boucle de jeu. Chargé en dernier. */
/* ---------- effets ---------- */
let toastT;
function toast(m){const t=$("toast");t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2600)}
function shake(el){if(!el)return;el.classList.remove("shake");void el.offsetWidth;el.classList.add("shake")}
function rel(el){const r=$("scene").getBoundingClientRect(),b=el.getBoundingClientRect();return[b.left+b.width/2-r.left,b.top+b.height*.25-r.top]}
function floatAt(el,t,gold){if(!el)return;const [x,y]=rel(el),s=document.createElement("span");s.className="float"+(gold?" gold":"");s.textContent=t;s.style.left=x+"px";s.style.top=y+"px";$("scene").appendChild(s);setTimeout(()=>s.remove(),1200)}
function burst(el){const [x,y]=rel(el);for(let i=0;i<3;i++){const s=document.createElement("span");s.className="heart";s.textContent="♥";s.style.left=(x+(i-1)*14)+"px";s.style.top=y+"px";s.style.setProperty("--dx",((i-1)*16)+"px");s.style.animationDelay=(i*.1)+"s";$("scene").appendChild(s);setTimeout(()=>s.remove(),1500)}}

/* ---------- événements ---------- */
// Sur iPhone, le clic n'arrive qu'au relâcher et se perd si la tuile a été redessinée pendant l'appui :
// en jeu, on agit dès que le doigt touche l'écran (le clic clavier, detail 0, marche toujours).
function onTap(el,fn){el.addEventListener("pointerdown",e=>{if(e.button)return;fn(e)});el.addEventListener("click",e=>{if(e.detail===0)fn(e)})}
onTap($("custs"),e=>{const b=e.target.closest("[data-cust]");if(!b||!G||!G.run)return;const c=G.cust.find(x=>x.id==b.dataset.cust);if(c)deliver(c,b)});
onTap($("kitchen"),e=>{const b=e.target.closest("button");if(!b||!G||!G.run)return;
  if(b.dataset.st)tapStation(b.dataset.st,b);else if(b.dataset.bake)bake(b.dataset.bake);
  else if(b.dataset.oven!==undefined){if(G.oven.state==="ready")unload();else if(G.oven.state==="idle")hint("Touche une <b>pâtisserie</b> pour lancer une fournée.")}
  else if(b.dataset.pa){const k=b.dataset.pa;if(G.vit[k])fromVit(k,b);else if(G.oven.state==="idle")bake(k);else{shake(b);hint(G.oven.state==="ready"?"<b>Touche le four</b> pour sortir la fournée d'abord.":"Le four est occupé : attends la fin de la cuisson.")}}});
onTap($("tray"),e=>{const p=e.target.closest("[data-opt]");if(p&&G&&G.run){applyOpt(p.dataset.opt,p);return}
  const b=e.target.closest("[data-tray]");if(!b||!G||!G.run)return;const i=+b.dataset.tray,now=performance.now();
  if(G.arm&&G.arm.i===i&&G.arm.until>now){G.tray.splice(i,1);G.arm=null}
  else{G.arm={i,until:now+1800};setTimeout(()=>{dirty=true},1850);hint("Touche encore l'article pour le <b>jeter</b>.")}
  dirty=true});
$("back").onclick=()=>{if(G&&G.run)pauseMenu();else openMap()};
$("open-menu").onclick=openMap;
function onAct(a){
  if(a==="shop")shop();else if(a==="carnet")carnet();else if(a==="hw")hwSheet();else if(a==="costumes")costumesSheet();else if(a==="hwintro"){closeSheet();hwIntro(hwSheet)}else if(a==="quests")questsSheet();
  else if(a==="map")openMap();
  else if(a==="resume"){closeSheet();G.paused=0}
  else if(a==="quit"){closeSheet();G=null;$("closed").hidden=false;$("hint").textContent="";dirty=true;save();openMap()}
}
$("map").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.day)daySheet(+b.dataset.day);else if(b.dataset.gate)gateSheet(+b.dataset.gate);else if(b.dataset.guest)guestSheet(+b.dataset.guest);else if(b.dataset.act)onAct(b.dataset.act);
});
$("mscroll").addEventListener("scroll",mapLabel,{passive:true});
$("sheet").addEventListener("click",e=>{
  if(e.target.id==="sheet"&&!$("sheet").dataset.lock){closeSheet();return}
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.close!==undefined){closeSheet();return}
  if(b.dataset.tab){shopTab=b.dataset.tab;shop();return}
  if(b.dataset.boost){const id=b.dataset.boost;boostSel.has(id)?boostSel.delete(id):boostSel.add(id);const y=$("sheet-in").scrollTop;boostCtx();$("sheet-in").scrollTop=y;return}
  if(b.dataset.bbuy){const bo=BOOSTS.find(x=>x.id===b.dataset.bbuy);if(S.coins<bo.c)return;S.coins-=bo.c;S.boost[bo.id]=(S.boost[bo.id]||0)+1;save();renderHud();toast(`${bo.name} : +1 en réserve`);
    const y=$("sheet-in").scrollTop;if(boostCtx){boostSel.add(bo.id);boostCtx()}else shop();$("sheet-in").scrollTop=y;return}
  if(b.dataset.hwshop!==undefined){shopTab="hw";shop();return}
  if(b.dataset.night){nightSheet(+b.dataset.night);return}
  if(b.dataset.nplay){closeSheet();newNight(+b.dataset.nplay);return}
  if(b.dataset.buy){const id=b.dataset.buy,u=ALLUP.find(x=>x.id===id),n=lv(id),nx=u.lv[n];if(!nx||S.coins<nx.c||(nx.from&&S.day<nx.from))return;S.coins-=nx.c;S.own[id]=n+1;fillQuests();save();renderDecor();renderHud();renderKitchen();toast(n?`${u.name} : niveau ${n+1} !`:`${u.name} : acheté !`);shop.y=$("sheet-in").scrollTop;shop();return}
  if(b.dataset.sbuy||b.dataset.style){const [k,id]=(b.dataset.sbuy||b.dataset.style).split(":"),it=STYLE[k].items.find(x=>x.id===id),key=`st-${k}-${id}`;
    if(b.dataset.sbuy){if(it.cb){if(S.candy<it.cb)return;S.candy-=it.cb}else{if(S.coins<it.c)return;S.coins-=it.c}S.own[key]=1;toast(`${it.name} : acheté !`)}
    S.style=S.style||{};S.style[k]=id;save();renderDecor();renderHud();if(MAPL&&!$("map").hidden)renderMap();shop.y=$("sheet-in").scrollTop;shop();return}
  if(b.dataset.play){closeSheet();newDay(+b.dataset.play);return}
  if(b.dataset.day){daySheet(+b.dataset.day);return}
  if(b.dataset.act)onAct(b.dataset.act);
});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&G&&G.run&&!G.paused)pauseMenu()});

/* ---------- boucle ---------- */
function loop(ts){
  const dt=Math.min(.1,(ts-(last||ts))/1000);last=ts;
  if(G&&G.run&&!G.paused)update(dt);
  if(dirty)render();else if(G&&G.run)updateBars();
  requestAnimationFrame(loop);
}
$("ic-c").innerHTML=coinSVG;$("ic-c2").innerHTML=coinSVG;
if(HW)$("hwbtn").hidden=false;
SEA=chapOf(curDay()).id;renderDecor();render();requestAnimationFrame(loop);
openMap();
