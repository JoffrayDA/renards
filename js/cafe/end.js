/* Café Frimousse : fin de journée et de nuit, quêtes affichées. */
/* ---------- fin de journée ---------- */
// le compagnon dans l'écran de fin : une journée ensemble par jour réel fait grandir l'amitié au refuge
function buddyRow(){const id=buddy(),f=FOX[id],td=todayStr(),t=S.together[id]||(S.together[id]={n:0,last:""}),first=t.last!==td;
  if(first){t.n++;t.last=td}
  return`<div class="ebud">${foxSVG(f,{pose:"happy"})}<span>${f.name} était là pour t'aider${first?" : amitié +1 au refuge":""}</span></div>`}
// résultats de la journée, en trois lignes (16/11/2026, Joffray : six cases, « Recette 1303 / 676 », « Ingrédients − » : trop d'infos,
// et mal dites) : une barre de score avec les trois étoiles, ce qu'on gagne, puis les clients
function endStats(o){const t=[o.g,Math.ceil(o.g*o.c2),Math.ceil(o.g*o.c3)],mx=Math.max(t[2]*1.08,o.e),pc=x=>Math.min(100,x/mx*100).toFixed(1);
  const gain=(ic,n)=>n?`<span>${ic}<b>+${n}</b></span>`:"";
  return`<div class="escore"><div class="erow"><span class="enum">Score<b>${o.e}</b></span><div class="ebar"><i style="width:${pc(o.e)}%"></i>${t.map((x,i)=>`<span class="etk${o.e>=x?" on":""}" style="left:${pc(x)}%"><b>${"★".repeat(i+1)}</b></span>`).join("")}</div></div>
  <div class="egain">${gain(coinSVG,o.coins)||`<span>${coinSVG}<b>+0</b></span>`}${gain(bellSVG,o.bells)}${gain(candySVG,o.candy)}${gain(sucreSVG,o.sucres)}</div>
  ${o.replay?`<div class="emini">Journée rejouée : 25 % des pièces</div>`:""}
  <div class="emini">${G.served} / ${G.cfg.c} clients servis · ${G.lost?`${G.lost} parti${G.lost>1?"s":""} fâché${G.lost>1?"s":""}`:"aucun fâché"}</div></div>`}
const itRow=(ic,t,s,st="")=>`<div class="it" style="margin-bottom:8px;${st}"><span class="ic">${ic}</span><span class="tx"><strong>${t}</strong><span>${s}</span></span></div>`;
const albumRow=()=>G.albumNew?itRow(foxSVG({...FOX.roussette,acc:"couronne"},{pose:"happy"}),"Album d'Halloween complet !",`Tu as servi les ${HWF.length} invités : ${ME()} gagne la Couronne de citrouilles (dans la boutique, onglet Style).`,"background:#efe4fb"):"";
function endDay(){
  if(G.it)return endIt();
  if(G.noel)return endNoel();
  if(G.night)return endNight();
  const g=G.cfg.goal,e=G.earned,d=G.day,[,c2,c3]=cuts(d),st=e>=Math.ceil(g*c3)?3:e>=Math.ceil(g*c2)?2:e>=g?1:0,prev=S.stars[d]||0,before=starSum();
  G.run=0;
  if(!G.lost&&st)qEvent("perfect");if(st===3)qEvent("stars3");
  if(st){const m=noelEvent("star");if(m)setTimeout(()=>toast(m),1200)}
  S.stars[d]=Math.max(prev,st);S.best[d]=Math.max(S.best[d]||0,e);
  const news=[];
  // le coffre ne paie que les étoiles nouvellement gagnées : rejouer reste utile sans devenir une ferme à pièces
  let chest=0;if(st>prev){chest=rnd(5,12)*(st-prev)+(st===3?15+2*d:0);S.coins+=chest}
  // les nouvelles étoiles donnent aussi des clochettes, la monnaie rare des deux jeux (bourse.js) : une par étoile, deux de plus à ★★★
  const bl=st>prev?st-prev+(st===3?2:0):0;if(bl)addBells(bl);
  if(st&&d===S.day)S.day++;
  const rk=Object.keys(REC).find(k=>REC[k].day===d);
  if(st&&rk&&!S.own[rk]){S.own[rk]=1;news.push(itRow(icon(rk),`Nouvelle recette : ${REC[rk].name}`,`Elle arrive sur ta carte dès la prochaine journée. ${REC[rk].desc}`,"background:#e3f2d6"))}
  const ok=Object.keys(OPTS).find(o=>OPTS[o].day===d);
  if(st&&ok&&!S.own[ok]){S.own[ok]=1;news.push(itRow(icon(ok),`Nouvelle option : ${OPTS[ok].name}`,`Elle arrive dès la prochaine journée. ${OPTS[ok].desc}`,"background:#e3f2d6"))}
  for(const c of checkGuests())news.push(itRow(foxSVG(FOX[c.guest],{pose:"happy"}),`${FOX[c.guest].name} rejoint ton café !`,`Saison ${c.name} en ★★★ : ${FOX[c.guest].name} vient désormais en invité d'honneur dans toutes les journées, toutes saisons confondues : il paie le triple, mais il est pressé.`,"background:#fbf0cc"));
  for(const c of CHAP)if(c.gate&&!S.pass[c.id]&&before<c.gate&&starSum()>=c.gate&&gateOpen(c))news.push(itRow(icon("chest"),`La porte de la saison ${c.name} s'ouvre !`,`Tu as réuni ${c.gate} étoiles.`,"background:#e3f2d6"));
  const dRow=seaDuelNews(d,e,st);if(dRow)news.push(dRow);
  const nc=chapOf(S.day);
  if(st&&S.day===nc.from&&nc.gate&&!gateOpen(nc))news.push(itRow(icon("chest"),`Porte de la saison ${nc.name} : ${starSum()} / ${nc.gate} ★`,`Rejoue des journées pour gagner les étoiles qui manquent.`));
  const bRow=buddyRow();
  const qShow=S.quests.map(q=>({...q,gain:q.p-(G.q0[q.t]||0)}));
  fillQuests();save();
  const nxt=st<3?(e<g?`Il manquait ${g-e} points pour réussir.`:`Plus que ${Math.ceil(g*(st===1?c2:c3))-e} points pour ${st===1?"★★":"★★★"} !`):"Journée parfaite !";
  const canNext=st&&d<LASTDAY&&dayOpen(d+1);
  const sheet=`<h2>${st?"Journée réussie !":"Objectif manqué"}</h2><div class="stars">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div><p class="sub" style="text-align:center">${nxt}${st<=prev&&prev?` Ton record sur ce jour : ${"★".repeat(prev)}.`:""}</p>
  ${endStats({e,g,c2,c3,coins:G.gain+chest,bells:bl,candy:HW?G.candy:0,replay:G.replay})}
  ${news.join("")}${albumRow()}${bRow}
  ${G.newFox.length?`<p class="sub">Nouveaux clients : <b>${G.newFox.join(", ")}</b></p>`:""}
  ${questHTML(qShow)}
  <div class="col">${canNext?`<button class="btn big wide" data-day="${d+1}" type="button">Jour ${d+1}</button>`:""}<button class="btn ${canNext?"ghost":"big"} wide" data-play="${d}" type="button">${st?"Rejouer":"Réessayer"} le jour ${d}</button><button class="btn ghost wide" data-act="map" type="button">Voir la carte</button></div>`;
  // la scène du Concours de la vallée (saisons.js), jouée avant les résultats
  const dd=d;setTimeout(()=>seaScenes(dd,()=>{endFx(st);openSheet(sheet,true)}),0);
  G=null;$("closed").hidden=false;$("hint").textContent="";renderDecor();dirty=true;
}
function endNight(){
  const n=G.night,g=G.cfg.goal,e=G.earned,st=e>=g*1.7?3:e>=g*1.35?2:e>=g?1:0,prev=S.hwStars[n]||0;
  G.run=0;
  if(!G.lost&&st)qEvent("perfect");if(st===3)qEvent("stars3");if(st)qEvent("night");
  S.hwStars[n]=Math.max(prev,st);
  // les nouvelles étoiles d'une Nuit paient en bonbons
  let cb=0;if(st>prev){cb=8*(st-prev)+(st===3?15:0);S.candy+=cb}
  const news=[];
  if(n===5&&st&&!S.hwKeep){S.hwKeep=1;news.push(itRow(foxSVG(FOX.feufollet,{pose:"happy"}),"Feu Follet reste au café !","Il a tant aimé la Grande nuit qu'il viendra toute l'année, en invité d'honneur : il paie le triple, mais il est pressé.","background:#efe4fb"))}
  if(st&&n<5&&!prev)news.push(itRow(candySVG,`${NIGHT_NAMES[n]} ouverte !`,n===4?"La dernière nuit : réussis-la pour garder Feu Follet au café.":"La nuit suivante t'attend.","background:#efe4fb"));
  const bRow=buddyRow();
  const qShow=S.quests.map(q=>({...q,gain:q.p-(G.q0[q.t]||0)}));
  fillQuests();save();
  const nxt=st<3?(e<g?`Il manquait ${g-e} points pour réussir.`:`Plus que ${Math.ceil(g*(st===1?1.35:1.7))-e} points pour ${st===1?"★★":"★★★"} !`):"Nuit parfaite !";
  const canNext=st&&n<5&&nightOpen(n+1);
  endFx(st);openSheet(`<h2>${st?"Nuit réussie !":"Objectif manqué"}</h2><div class="stars">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div><p class="sub" style="text-align:center"><b>${NIGHT_NAMES[n-1]}</b><br>${nxt}</p>
  ${endStats({e,g,c2:1.35,c3:1.7,coins:G.gain,candy:G.candy+cb,replay:G.replay})}
  ${news.join("")}${albumRow()}${bRow}
  ${questHTML(qShow)}
  <div class="col">${canNext?`<button class="btn big wide" data-nplay="${n+1}" type="button">Nuit ${n+1}</button>`:""}<button class="btn ${canNext?"ghost":"big"} wide" data-nplay="${n}" type="button">${st?"Rejouer":"Réessayer"} la nuit ${n}</button><button class="btn ghost wide" data-act="hw" type="button">Les nuits d'Halloween</button><button class="btn ghost wide" data-act="map" type="button">Voir la carte</button></div>`,true);
  G=null;$("closed").hidden=false;$("hint").textContent="";renderDecor();dirty=true;
}
function questHTML(list=S.quests){
  const row=(q,gain,cls="")=>`<div class="it qrow ${cls}" style="padding:8px 12px;${q.done?"background:#e3f2d6":""}"><span class="tx"><strong style="font-size:14px">${qText(q)}</strong><div class="obar" style="margin-top:4px"><i style="width:${q.p/q.n*100}%;background:${q.done?"var(--good)":"var(--gold)"}"></i></div></span><span class="side"><span class="price">${q.cdy?candySVG:coinSVG}${q.g}${q.b?` ${bellSVG}${q.b}`:""}</span><span style="font-size:12px;color:var(--ink-soft)">${q.done?"<b style=\"color:#4f9a3e\">Réussie !</b>":`${q.p} / ${q.n}${gain>0?` <b style="color:#4f9a3e">+${gain}</b>`:""}`}</span></span></div>`;
  const w=S.wq,wl=w?7-Math.floor((Date.now()-monday().getTime()+432e5)/864e5):0,wg=w&&G&&G.wq0!=null?w.p-G.wq0:0;
  return `${w?`<p class="sub" style="margin:0 0 6px"><b>Quête de la semaine</b> · ${w.done?"à la semaine prochaine":wl>1?`encore ${wl} jours`:"dernier jour"}</p><div class="col" style="margin-bottom:12px">${row(w,wg,"wk")}</div>`:""}<p class="sub" style="margin:0 0 6px"><b>Quêtes du jour</b> · nouvelles demain</p><div class="col" style="margin-bottom:14px">${list.map(q=>row(q,q.gain)).join("")}</div>`;
}
