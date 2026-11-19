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
  ${o.replay?`<div class="emini">Journée rejouée : 40 % des pièces</div>`:""}
  <div class="emini">${G.served} / ${G.cfg.c} clients servis · ${G.lost?`${G.lost} parti${G.lost>1?"s":""} fâché${G.lost>1?"s":""}`:"aucun fâché"}</div></div>`}
const itRow=(ic,t,s,st="")=>`<div class="it" style="margin-bottom:8px;${st}"><span class="ic">${ic}</span><span class="tx"><strong>${t}</strong><span>${s}</span></span></div>`;
const albumRow=()=>G.albumNew?itRow(foxSVG({...FOX.roussette,acc:"couronne"},{pose:"happy"}),"Album d'Halloween complet !",`Tu as servi les ${HWF.length} invités : ${ME()} gagne la Couronne de citrouilles (dans la boutique, onglet Style).`,"background:#efe4fb"):"";
// le compagnon conseille d'améliorer le café (17/11/2026, Joffray : les testeurs font ★★ et ne savent pas qu'il faut acheter) :
// sans ★★★, s'il manque un achat prévu à ce jour (KIT), ou après le jour 10 une amélioration encore possible.
// Rythme (18/11/2026, Joffray : « là c'est à chaque fois, c'est super chiant ») : un conseil complet une seule fois
// au premier café, une fois en Petite Italie (l'équipement y est à racheter), avec l'explication des deux coins ;
// puis un rappel après 3 journées d'affilée sans ★★★, un dernier après 5 d'affilée, et c'est fini. Si on achète
// après un conseil (on l'a écouté), plus de dialogue. Ensuite, juste une ligne « des améliorations sont disponibles ».
// État par monde dans S.upT[monde] = {n: conseils donnés, miss: journées d'affilée sans ★★★, lv: niveaux achetés au conseil, ok}
function upTip(d,st){
  const w=WORLD||"cafe",A=S.upT||(S.upT={cafe:{n:S.upTip&&Object.keys(S.upTip).length?1:0,miss:0,lv:0}}),T=A[w]||(A[w]={n:0,miss:0,lv:0});
  const tot=ALLUP.reduce((s,u)=>s+lv(u.id),0),kit=WORLD?WD().kit:KIT;
  T.miss=st>=3?0:T.miss+1;
  if(T.n&&tot>T.lv)T.ok=1;
  if(st>=3){save();return null}
  const nx=u=>u&&u.lv[lv(u.id)],ok=u=>nx(u)&&!upLocked(nx(u));
  let u=kit.filter(([k,n,kd])=>kd<=d&&lv(k)<n).map(([k])=>ALLUP.find(x=>x.id===k)).find(ok);
  if(!u&&d>10)u=ALLUP.filter(ok).sort((a,b)=>upPrice(nx(a))-upPrice(nx(b)))[0];
  const talk=u&&!T.ok&&(w==="cafe"||w==="italie")&&(T.n===0||T.n===1&&T.miss>=3||T.n===2&&T.miss>=5);
  if(!talk){save();const c=ALLUP.filter(upCan).sort((a,b)=>upPrice(nx(a))-upPrice(nx(b)))[0];return c?{note:1,id:c.id}:null}
  T.n++;T.miss=0;T.lv=tot;save();
  const p=upPrice(nx(u)),b=buddy(),can=S.coins>=p,coin=upSideOf(u.id)==="deco"?"Salle":"Comptoir",eff=nx(u).d.charAt(0).toLowerCase()+nx(u).d.slice(1);
  const buyL=[b,can?"joy":"shy",can?`Tu as de quoi l'acheter (${p} pièces) : touche « Améliorer le café ».`:`Il coûte ${p} pièces : rejoue des journées pour les gagner.`];
  const lines=T.n===1?[[b,"open",WORLD?`Ici, ${ME()}, l'équipement du ${WD().short} est à racheter : pour les trois étoiles, passe à la boutique !`:`${st?"Bien joué":"Pas grave"}, ${ME()} ! Mais pour les trois étoiles, il faut un café mieux équipé.`],
    [b,"open","Dans la boutique, il y a deux coins : le Comptoir, pour préparer plus vite, et la Salle, pour la patience, les pourboires et les VIP."],
    [b,"joy",`Essaie « ${u.name} », dans le coin ${coin} : ${eff}`],buyL]
   :[[b,"shy",`Ça fait ${T.n===2?3:5} journées d'affilée sans les trois étoiles… Tu te souviens de la boutique ?`],[b,"open",`« ${u.name} » est disponible dans le coin ${coin} : ${eff}`],buyL];
  return {lines,id:u.id}}
// proposer les notifications une fois, à la fin d'une journée réussie à partir du jour 3 (18/11/2026) :
// sans ça, un joueur du Café seul n'est jamais abonné (la cloche n'est qu'à la Clairière)
const pushAsk=st=>st&&!S.pushAsk&&!WORLD&&S.day>3&&pushOk()&&!pushOn()?`<div class="unote pask"><b>Je te préviens quand des clients t'attendent ?</b><span class="row"><button class="btn" data-push="on" type="button">Oui !</button><button class="btn ghost" data-push="no" type="button">Non merci</button></span></div>`:"";
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
  // plus de coffre (20/11/2026, Joffray : « c'est quoi un coffre… c'est même pas expliqué », « on supprime ») : les pièces viennent
  // seulement des clients ; une journée déjà réussie, rejouée, rapporte 40 % du bénéfice (G.replay)
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
  fillQuests();save();pushSync(cafePlan());
  const nxt=st<3?(e<g?`Il manquait ${g-e} points pour réussir.`:`Plus que ${Math.ceil(g*(st===1?c2:c3))-e} points pour ${st===1?"★★":"★★★"} !`):"Journée parfaite !";
  const canNext=st&&d<LASTDAY&&dayOpen(d+1),tip=upTip(d,st);
  const sheet=`<h2>${st?"Journée réussie !":"Objectif manqué"}</h2><div class="stars">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div><p class="sub" style="text-align:center">${nxt}${st<=prev&&prev?` Ton record sur ce jour : ${"★".repeat(prev)}.`:""}</p>
  ${endStats({e,g,c2,c3,coins:G.gain,bells:bl,candy:HW?G.candy:0,replay:G.replay})}
  ${pushAsk(st)}${tip&&tip.note?`<button class="unote" data-upgo="${tip.id}" type="button"><i class="udot"></i>Des améliorations sont disponibles : fais un tour dans la boutique.</button>`:""}${news.join("")}${albumRow()}${bRow}
  ${G.newFox.length?`<p class="sub">Nouveaux clients : <b>${G.newFox.join(", ")}</b></p>`:""}
  ${questHTML(qShow)}
  <div class="col">${canNext?`<button class="btn big wide" data-day="${d+1}" type="button">Jour ${d+1}</button>`:""}<button class="btn ${canNext?"ghost":"big"} wide" data-play="${d}" type="button">${st?"Rejouer":"Réessayer"} le jour ${d}</button>${tip?`<button class="btn ghost wide" data-upgo="${tip.id}" type="button">Améliorer le café</button>`:""}<button class="btn ghost wide" data-act="map" type="button">Voir la carte</button></div>`;
  // la scène du Concours de la vallée (saisons.js), jouée avant les résultats, puis le conseil du compagnon
  const dd=d;setTimeout(()=>seaScenes(dd,()=>{endFx(st);if(tip&&tip.lines)itTalk(tip.lines,()=>openSheet(sheet,true));else openSheet(sheet,true)}),0);
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
