/* Kitsune Café : fin de journée et de nuit, quêtes affichées. */
/* ---------- fin de journée ---------- */
// le compagnon dans l'écran de fin : une journée ensemble par jour réel fait grandir l'amitié au refuge
function buddyRow(){if(!S.own.serveur)return "";const id=buddy(),f=FOX[id],td=todayStr(),t=S.together[id]||(S.together[id]={n:0,last:""}),first=t.last!==td;
  if(first){t.n++;t.last=td}
  return itRow(foxSVG(f,{pose:"happy"}),`${f.name} était là pour t'aider !`,first?"Une journée de plus ensemble : votre amitié grandit au refuge.":"Votre journée ensemble compte déjà pour aujourd'hui.","background:#fff3e2")}
const itRow=(ic,t,s,st="")=>`<div class="it" style="margin-bottom:8px;${st}"><span class="ic">${ic}</span><span class="tx"><strong>${t}</strong><span>${s}</span></span></div>`;
const albumRow=()=>G.albumNew?itRow(foxSVG({...FOX.roussette,acc:"couronne"},{pose:"happy"}),"Album d'Halloween complet !",`Tu as servi les ${HWF.length} invités : ${ME()} gagne la Couronne de citrouilles (dans la boutique, onglet Style).`,"background:#efe4fb"):"";
function endDay(){
  if(G.night)return endNight();
  const g=G.cfg.goal,e=G.earned,st=e>=g*1.7?3:e>=g*1.35?2:e>=g?1:0,d=G.day,prev=S.stars[d]||0,before=starSum();
  G.run=0;
  if(!G.lost&&st)qEvent("perfect");if(st===3)qEvent("stars3");
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
  const nc=chapOf(S.day);
  if(st&&S.day===nc.from&&nc.gate&&!gateOpen(nc))news.push(itRow(icon("chest"),`Porte de la saison ${nc.name} : ${starSum()} / ${nc.gate} ★`,`Rejoue des journées pour gagner les étoiles qui manquent.`));
  const bRow=buddyRow();
  const qShow=S.quests.map(q=>({...q,gain:q.p-(G.q0[q.t]||0)}));
  S.quests=S.quests.filter(q=>!q.done);fillQuests();save();
  const nxt=st<3?(e<g?`Il manquait ${g-e} pièces pour réussir.`:`Plus que ${Math.ceil(g*(st===1?1.35:1.7))-e} pièces pour ${st===1?"★★":"★★★"} !`):"Journée parfaite !";
  const canNext=st&&d<LASTDAY&&dayOpen(d+1);
  openSheet(`<h2>${st?"Journée réussie !":"Objectif manqué"}</h2><div class="stars">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div><p class="sub" style="text-align:center">${nxt}${st<=prev&&prev?` Ton record sur ce jour : ${"★".repeat(prev)}.`:""}</p>
  <div class="stats"><div>Recette<b>${e} / ${g}</b></div><div>Clients servis<b>${G.served} / ${G.cfg.c}</b></div><div>Partis fâchés<b>${G.lost}</b></div><div>Meilleur combo<b>×${G.bestCombo}</b></div><div>Ingrédients<b>−${Math.round(G.cost)}</b></div><div>Pièces gagnées<b>+${G.gain}</b>${G.replay?`<small style="display:block;font-size:11px;font-weight:700;color:var(--ink-soft)">rejouée : 50 %</small>`:""}</div>${HW?`<div style="background:#efe4fb">Bonbons<b>+${G.candy}</b></div>`:""}</div>
  ${chest?itRow(icon("chest"),`Coffre : +${chest} pièces`,st===3?"Trois étoiles : le coffre de la journée est ouvert !":"Chaque nouvelle étoile rapporte des pièces."):""}
  ${bl?itRow(bellSVG,`+${bl} clochette${bl>1?"s":""}`,"Les clochettes achètent les beaux objets de la boutique du jour, à la Clairière."):""}
  ${news.join("")}${albumRow()}${bRow}
  ${G.newFox.length?`<p class="sub">Nouveaux clients : <b>${G.newFox.join(", ")}</b></p>`:""}
  ${questHTML(qShow)}
  <div class="col">${canNext?`<button class="btn big wide" data-day="${d+1}" type="button">Jour ${d+1}</button>`:""}<button class="btn ${canNext?"ghost":"big"} wide" data-play="${d}" type="button">${st?"Rejouer":"Réessayer"} le jour ${d}</button><button class="btn ghost wide" data-act="map" type="button">Voir la carte</button></div>`,true);
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
  S.quests=S.quests.filter(q=>!q.done);fillQuests();save();
  const nxt=st<3?(e<g?`Il manquait ${g-e} pièces pour réussir.`:`Plus que ${Math.ceil(g*(st===1?1.35:1.7))-e} pièces pour ${st===1?"★★":"★★★"} !`):"Nuit parfaite !";
  const canNext=st&&n<5&&nightOpen(n+1);
  openSheet(`<h2>${st?"Nuit réussie !":"Objectif manqué"}</h2><div class="stars">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div><p class="sub" style="text-align:center"><b>${NIGHT_NAMES[n-1]}</b><br>${nxt}</p>
  <div class="stats"><div>Recette<b>${e} / ${g}</b></div><div>Clients servis<b>${G.served} / ${G.cfg.c}</b></div><div>Partis fâchés<b>${G.lost}</b></div><div>Meilleur combo<b>×${G.bestCombo}</b></div><div>Pièces gagnées<b>+${G.gain}</b>${G.replay?`<small style="display:block;font-size:11px;font-weight:700;color:var(--ink-soft)">rejouée : 50 %</small>`:""}</div><div style="background:#efe4fb">Bonbons<b>+${G.candy+cb}</b></div></div>
  ${cb?itRow(candySVG,`Coffre de la nuit : +${cb} bonbons`,st===3?"Trois étoiles : le grand coffre !":"Chaque nouvelle étoile d'une nuit rapporte des bonbons."):""}
  ${news.join("")}${albumRow()}${bRow}
  ${questHTML(qShow)}
  <div class="col">${canNext?`<button class="btn big wide" data-nplay="${n+1}" type="button">Nuit ${n+1}</button>`:""}<button class="btn ${canNext?"ghost":"big"} wide" data-nplay="${n}" type="button">${st?"Rejouer":"Réessayer"} la nuit ${n}</button><button class="btn ghost wide" data-act="hw" type="button">Les nuits d'Halloween</button><button class="btn ghost wide" data-act="map" type="button">Voir la carte</button></div>`,true);
  G=null;$("closed").hidden=false;$("hint").textContent="";renderDecor();dirty=true;
}
function questHTML(list=S.quests){
  return `<p class="sub" style="margin:0 0 6px"><b>Quêtes</b></p><div class="col" style="margin-bottom:14px">${list.map(q=>`<div class="it" style="padding:8px 12px;${q.done?"background:#e3f2d6":""}"><span class="tx"><strong style="font-size:14px">${qText(q)}</strong><div class="obar" style="margin-top:4px"><i style="width:${q.p/q.n*100}%;background:${q.done?"var(--good)":"var(--gold)"}"></i></div></span><span class="side"><span class="price">${q.cdy?candySVG:coinSVG}${q.g}</span><span style="font-size:12px;color:var(--ink-soft)">${q.done?"<b style=\"color:#4f9a3e\">Réussie !</b>":`${q.p} / ${q.n}${q.gain>0?` <b style="color:#4f9a3e">+${q.gain}</b>`:""}`}</span></span></div>`).join("")}</div>${list.some(q=>q.done)?`<p class="sub" style="margin:-6px 0 12px;font-size:12px">Les quêtes réussies sont payées et remplacées par de nouvelles.</p>`:""}`;
}
