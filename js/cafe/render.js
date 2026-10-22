/* Kitsune Café : affichage de la salle, du plateau et de la cuisine. */
/* ---------- rendu ---------- */
function renderHud(){
  $("coins").textContent=S.coins;$("coins2").textContent=S.coins;
  if(HW)$("hwbtn").innerHTML=`Halloween <span class="hwn">${candySVG}${S.candy}</span>`;
  if(!G||!G.run){$("hud").innerHTML=`<span class="pill day">Jour ${curDay()}</span><span class="pill">★ ${starSum()}</span>`;$("chips").innerHTML="";return}
  const g=G.cfg.goal,mx=g*1.7,e=G.earned;
  $("hud").innerHTML=`<span class="pill day">${G.night?`Nuit ${G.night}`:`Jour ${G.day}`}</span><div class="goal"><div class="gbar"><i id="gfill" style="width:${Math.min(100,e/mx*100)}%"></i>${[1,1.35,1.7].map(m=>`<span class="tick${e>=g*m?" on":""}" style="left:${m/1.7*100}%">★</span>`).join("")}</div><b>${e}/${g}</b></div>`;
  $("chips").innerHTML=`<span class="pill">Clients ${G.cfg.c-G.spawned+G.cust.filter(c=>c.state==="wait").length}</span>${G.combo>=2?`<span class="pill combo">Combo ×${G.combo}</span>`:""}${HW?`<span class="pill cnd">${candySVG}${S.candy}</span>`:""}`;
}
function render(){
  dirty=false;renderHud();
  if(!G||!G.run){$("custs").innerHTML="";renderKitchen();renderTray();return}
  const X=SPOTX[spotsN()];
  const box=$("custs"),keep=new Set();
  for(const c of G.cust){const f=FOX[c.fox];
    const fx=c.costume?{...f,acc:c.costume}:f;
    const ic=c.state==="angry"?icon("ennui"):c.state==="happy"?icon("coeur"):c.order.map(o=>`<span class="oi${o.done?" done":""}">${icon(o.r)}</span>`).join("");
    const cls=`cust ${c.state}${c.low&&c.state==="wait"?" low":""}`,inner=`<span class="bub${c.vip?" vipb":""}">${c.vip?`<em class="vip">${f.event?"Halloween ×3":"VIP ×3"}</em>`:""}<span class="oi-row">${c.state==="wait"?ic:`<span class="oi">${ic}</span>`}</span>${c.state==="wait"?`<span class="pb"><i id="pb-${c.id}"></i></span>`:""}</span>${foxSVG(fx,{pose:c.state==="happy"?"happy":"sit"})}`;
    let el=custEl(c);
    if(!el){el=document.createElement("button");el.type="button";el.dataset.cust=c.id;el.setAttribute("aria-label",f.name);box.appendChild(el)}
    if(el.dataset.c!==cls){el.className=cls;el.dataset.c=cls}
    el.style.left=X[c.spot]+"%";
    if(el._h!==inner){el.innerHTML=inner;el._h=inner}
    keep.add(el);
  }
  [...box.children].forEach(e=>{if(!keep.has(e))e.remove()});
  renderKitchen();renderTray();updateBars();
}
function renderTray(){
  const cap=trayCap(),t=G&&G.run?G.tray:[],arm=G&&G.run&&G.arm&&G.arm.until>performance.now()?G.arm.i:-1;
  let h=`<span class="tl">Plateau</span>`;
  for(let i=0;i<cap;i++)h+=t[i]?`<button class="ts${i===arm?" arm":""}${G.popI===i?" new":""}" data-tray="${i}" type="button" aria-label="${i===arm?`Toucher encore pour jeter ${REC[t[i]].name}`:REC[t[i]].name}">${icon(t[i])}${i===arm?`<span class="bin">${icon("bin")}</span>`:""}</button>`:`<span class="ts"></span>`;
  h+=`<small>Touche un client pour le servir.<br>Touche 2 fois un article pour le jeter.</small>`;
  if($("tray")._h!==h){$("tray").innerHTML=h;$("tray")._h=h}
  if(G)G.popI=-1;
}
// Cuisine : une rangée de boissons, puis le four et une tuile par pâtisserie (la tuile sert aussi de vitrine).
function renderKitchen(){
  const on=G&&G.run;
  const tile=(inner,attrs,cls,extra="")=>`<div class="kw"><button class="kb ${cls}" type="button" ${attrs} ${on?"":"disabled"}>${inner}</button>${extra}</div>`;
  let dr="";
  for(const k of Object.keys(REC)){if(REC[k].kind!=="drink"||!onMenu(k))continue;
    const sl=on?G.st[k]:[{}],rd=sl.some(s=>s.ready);
    dr+=tile(`<span class="ki">${icon(k)}</span><span class="kn">${REC[k].name}</span><span class="slots">${sl.map((s,i)=>`<span class="sl${s.ready?" ready":""}"><i id="sp-${k}-${i}"></i></span>`).join("")}</span>`,`data-st="${k}" aria-label="${REC[k].name}${rd?", prêt":""}"`,rd?"rdy":"");
  }
  const bakes=Object.keys(REC).filter(k=>REC[k].kind==="bake"&&onMenu(k)),o=on?G.oven:{state:"idle"};
  const ot=o.state==="bake"?"Cuisson…":o.state==="ready"?`Sortir ×${batchOf(o.r)}`:o.state==="burnt"?"Brûlé…":"Four";
  let pa=tile(`<span class="ki">${icon("four")}${o.state!=="idle"?`<span class="mini">${icon(o.state==="burnt"?"burnt":o.r)}</span>`:""}</span><span class="kn">${ot}</span>${o.state==="bake"?`<span class="obar"><i id="ov-p"></i></span>`:o.state==="ready"?`<span class="obar"><i id="ov-b" style="background:#fff"></i></span>`:""}`,`data-oven id="unl" aria-label="Four"`,`oven ${o.state}`);
  for(const k of bakes){const n=on?G.vit[k]:0;
    pa+=tile(`<span class="ki">${icon(k)}</span><span class="kn">${REC[k].name}</span>`,`data-pa="${k}" aria-label="${REC[k].name} : ${n} en vitrine"`,n?"":"empty",
      `<span class="badge${n?"":" zero"}">${n}</span>${on&&n&&o.state==="idle"?`<button class="kbake" data-bake="${k}" type="button" aria-label="En cuire ${batchOf(k)} de plus">${icon("four")}</button>`:""}`);
  }
  const h=`<div class="krow">${dr}</div><div class="krow">${pa}</div>`;
  if($("kitchen")._h!==h){$("kitchen").innerHTML=h;$("kitchen")._h=h;updateBars()}
}
function updateBars(){
  if(!G||!G.run)return;
  for(const c of G.cust){const e=$("pb-"+c.id);if(e){const r=c.pat/c.patMax;e.style.width=(r*100).toFixed(1)+"%";e.style.background=r<.3?"var(--bad)":r<.6?"var(--warn)":"var(--good)"}}
  for(const k in G.st)G.st[k].forEach((s,i)=>{const e=$(`sp-${k}-${i}`);if(e)e.style.width=s.busy?(s.t/REC[k].time*100)+"%":"0"});
  const o=G.oven;if(o.state==="bake"){const e=$("ov-p");if(e)e.style.width=(o.t/o.dur*100)+"%"}
  if(o.state==="ready"){const e=$("ov-b");if(e)e.style.width=(o.burn/o.burnMax*100)+"%";const u=$("unl");if(u)u.classList.toggle("danger",o.burn<2)}
  const gf=$("gfill");if(gf)gf.style.width=Math.min(100,G.earned/(G.cfg.goal*1.7)*100)+"%";
  if(G.day<=2&&!hintLock)autoHint();
}
let hintLock=0;
function hint(h){$("hint").innerHTML=h;hintLock=1;clearTimeout(hint.t);hint.t=setTimeout(()=>hintLock=0,3500)}
function autoHint(){
  const w=G.cust.filter(c=>c.state==="wait");let h="";
  if(!w.length)h=`Les clients arrivent. <b>Touche « ${REC.croissant.name} »</b> pour en cuire d'avance.`;
  else{
    const need=[];w.forEach(c=>c.order.forEach(o=>{if(!o.done)need.push(o.r)}));
    if(need.some(r=>G.tray.includes(r)))h="Ton plateau a ce qu'il faut : <b>touche le client</b> pour le servir.";
    else if(G.oven.state==="ready")h="<b>Touche le four</b> pour sortir la fournée avant qu'elle brûle !";
    else{const d=need.find(r=>REC[r].kind==="drink");const b=need.find(r=>REC[r].kind==="bake");
      if(d&&G.st[d].some(s=>s.ready))h=`« ${REC[d].name} » est prêt : <b>touche-le</b> pour le poser sur le plateau.`;
      else if(b&&G.vit[b])h=`Il y en a en vitrine : <b>touche « ${REC[b].name} »</b> pour le mettre sur le plateau.`;
      else if(d&&!G.st[d].some(s=>s.busy))h=`<b>Touche « ${REC[d].name} »</b> pour lancer la préparation.`;
      else if(b&&G.oven.state==="idle")h=`Vitrine vide : <b>touche « ${REC[b].name} »</b> pour lancer une fournée.`;
      else h="Ça chauffe… Garde un œil sur la patience des clients.";}
  }
  if($("hint").innerHTML!==h)$("hint").innerHTML=h;
}
