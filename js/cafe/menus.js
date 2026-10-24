/* Kitsune Café : feuilles (fiche du jour, Halloween, boutique, carnet). */
/* ---------- menus ---------- */
function openSheet(h,lock){$("sheet-in").innerHTML=h+(lock?"":`<button class="btn ghost wide" data-close type="button" style="margin-top:10px">Fermer</button>`);$("sheet").hidden=false;$("sheet").dataset.lock=lock?1:"";$("sheet-in").scrollTop=0}
function closeSheet(){$("sheet").hidden=true}
/* ---------- accueil : la première fois, Petit Pois présente Roussette et demande son nom ---------- */
function welcome(){
  const say=(expr,txt,extra="")=>`<div style="width:150px;margin:0 auto">${foxSVG(FOX.roussette,{pose:"happy"})}</div><div class="talk"><div class="pic">${foxArt(FOX.petitpois,{expr,portrait:1})}</div><div class="txt"><b>Petit Pois</b><span>${txt}</span>${extra||"<small>Touche pour continuer</small>"}</div></div>`;
  const steps=[()=>say("joy","Coucou ! Ce petit renard, c'est toi ! C'est toi qui tiens le Kitsune Café."),
    ()=>say("shy","Euh… tu t'appelles comment, déjà ?",`<form class="name" id="wname"><input id="wname-in" maxlength="14" value="${ME()}" autocomplete="off" aria-label="Ton nom"><button class="btn" type="submit">C'est moi !</button></form>`),
    ()=>say("joy",`${ME()} ! Je ne l'oublierai plus. Allez, les clients t'attendent !`)];
  let i=0;const show=()=>{openSheet(steps[i](),1);
    const f=$("wname");if(f)f.onsubmit=e=>{e.preventDefault();S.name=$("wname-in").value.replace(/[<>"&]/g,"").trim().replace(/\s+/g," ")||"Roussette";S.named=1;save();i++;show()};
    else $("sheet-in").querySelector(".talk").onclick=()=>{if(++i<steps.length)show();else{closeSheet();dailyBonus()}}};
  show();
}
function dailyBonus(){
  const td=todayStr();if(S.lastDay===td)return;
  const y=new Date(Date.now()-864e5),ys=`${y.getFullYear()}-${y.getMonth()+1}-${y.getDate()}`;
  S.streak=S.lastDay===ys?S.streak+1:1;S.lastDay=td;const b=10+Math.min(S.streak,7)*5;S.coins+=b;save();renderHud();
  openSheet(`<h2>Bonus du jour</h2>${itRow(icon("chest"),`+${b} pièces`,S.streak>1?`${S.streak} jours d'affilée ! Reviens demain pour un bonus plus gros.`:"Reviens demain pour un bonus plus gros.")}`);
}
const boostIc=b=>b.ic==="coin"?coinSVG:icon(b.ic,"base");
// les bonus avant une journée (ctx : la feuille à réafficher après un choix)
function boostHTML(ctx){
  boostCtx=ctx;
  return `<p class="sub" style="margin:10px 0 6px"><b>Bonus pour cette journée</b> · ils ne servent qu'une fois</p><div class="col">${BOOSTS.map(b=>{const n=S.boost[b.id]||0,on=boostSel.has(b.id);
    return `<div class="it${on?" bon":""}" style="padding:8px 12px"><span class="ic">${boostIc(b)}</span><span class="tx"><strong style="font-size:14px">${b.name}</strong><span>${b.d}${n?` En réserve : ${n}.`:""}</span></span><span class="side">${n?`<button class="btn${on?"":" ghost"}" data-boost="${b.id}" type="button">${on?"Pris":"Prendre"}</button>`:`<span class="price">${coinSVG}${b.c}</span><button class="btn ghost" data-bbuy="${b.id}" type="button" ${S.coins>=b.c?"":"disabled"}>Acheter</button>`}</span></div>`}).join("")}</div>`;
}
function daySheet(d){
  if(!dayOpen(d)){toast(d>S.day?"Réussis la journée précédente pour ouvrir celle-ci.":"La porte de la saison est encore fermée.");return}
  const c=cfgOf(d),g=c.goal,st=S.stars[d]||0,ch=chapOf(d),rk=Object.keys(REC).find(k=>REC[k].day===d);
  const rw=[];
  if(rk&&!S.own[rk])rw.push(itRow(icon(rk,ch.id),`Recette à gagner : ${vName(rk,ch.id)[0]}`,`Réussis cette journée pour l'ajouter à ta carte.`,"background:#e3f2d6"));
  const ok=Object.keys(OPTS).find(o=>OPTS[o].day===d);
  if(ok&&!S.own[ok])rw.push(itRow(icon(ok),`Option à gagner : ${OPTS[ok].name}`,OPTS[ok].desc,"background:#e3f2d6"));
  if(st)rw.push(itRow(icon("coeur"),"Journée déjà réussie","La rejouer ne rapporte que 30 % des pièces. Les nouvelles étoiles restent payées par le coffre."));
  rw.push(st<3?itRow(icon("chest"),"Coffre ★★★",st?"Chaque nouvelle étoile rapporte des pièces, et 3 étoiles ouvrent le gros coffre.":"Chaque étoile rapporte des pièces, et 3 étoiles ouvrent le gros coffre."):itRow(icon("chest"),"Coffre ouvert","Tu peux rejouer pour battre ton record, mais sans coffre."));
  if(d===ch.to){const f=FOX[ch.guest];rw.push(itRow(foxSVG(f,{sil:!S.guest[ch.guest]}),S.guest[ch.guest]?`Invité d'honneur : ${f.name}`:"Invité d'honneur mystère",S.guest[ch.guest]?"Il vient dans toutes les journées, toutes saisons confondues : il paie le triple, mais il est pressé.":`Obtiens ★★★ sur les 10 journées du ${ch.name} pour l'inviter (${chapStars(ch)} / 30 ★).`,"background:#fbf0cc"))}
  openSheet(`<h2>Jour ${d} · ${ch.name}</h2><div class="stars" style="font-size:30px">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div>
  <p class="sub">${c.c} clients attendus${c.max>1?`, jusqu'à ${c.max} articles par commande`:""}. Patience : ${Math.round(c.pat*patMult())} s.${S.best[d]?` Record : <b>${S.best[d]} pièces</b>.`:""}</p>
  ${d===1&&!S.total?`<div class="tuto"><b>Comment jouer</b><ol><li>Touche <b>Café</b> pour le préparer, puis touche-le à nouveau quand il est prêt : il va sur ton plateau.</li><li>Touche <b>${vName("croissant","printemps")[0]}</b> pour lancer une fournée, puis le <b>four</b> quand elle est cuite, avant qu'elle brûle. Touche-la ensuite pour la poser sur le plateau.</li><li>Touche un <b>client</b> pour lui servir ce qui est sur ton plateau. Plus tu es rapide, plus le pourboire est gros.</li></ol></div>`:""}
  <p class="sub" style="margin-bottom:6px">Objectif de recette (en pièces)</p><div class="goals"><span><em>★</em>${g}</span><span><em>★★</em>${Math.ceil(g*1.35)}</span><span><em>★★★</em>${Math.ceil(g*1.7)}</span></div>
  ${equipBonus(d)?`<p class="sub" style="margin:6px 0 0;font-size:12.5px">Objectif relevé de <b>${Math.round(equipBonus(d)*100)} %</b> : ton équipement dépasse celui prévu pour ce jour.</p>`:""}
  ${rw.join("")}
  ${d>=3?boostHTML(()=>daySheet(d)):""}
  <div class="col" style="margin-top:10px"><button class="btn big wide" data-play="${d}" type="button">Ouvrir le café</button></div>`);
}
function gateSheet(i){
  const c=CHAP[i],n=starSum();
  openSheet(`<h2>Porte de la saison ${c.name}</h2><div class="stars" style="font-size:30px">★ ${Math.min(n,c.gate)} / ${c.gate}</div><p class="sub" style="text-align:center">${gateOpen(c)?"La porte est ouverte !":`Il te manque <b>${c.gate-n} étoiles</b>. Rejoue les journées où tu n'as pas ★★★ : avec tes nouvelles recettes et ton équipement, c'est plus facile.`}</p>`);
}
function guestSheet(i){
  const c=CHAP[i],f=FOX[c.guest],ok=S.guest[c.guest];
  openSheet(`<h2>${ok?f.name:"Invité mystère"}</h2><div style="width:140px;margin:0 auto">${foxSVG(f,{pose:ok?"happy":"sit",sil:!ok})}</div><p class="sub" style="text-align:center">${ok?`${f.bio} Invité d'honneur : il vient dans toutes les journées, toutes saisons confondues, paie le triple, mais il est pressé.`:`Obtiens ★★★ sur les 10 journées du ${c.name} pour l'inviter au café. Pour l'instant : <b>${chapStars(c)} / 30 ★</b>.`}</p>`);
}
function hwSheet(){
  const nights=NIGHTS.map((N,i)=>{const n=i+1,op=nightOpen(n),st=S.hwStars[n]||0;
    const why=!HW?"L'événement est fini.":S.day<=N.base?`Réussis d'abord le jour ${N.base}.`:"Réussis la nuit précédente.";
    return `<div class="it${op?"":" nlock"}"><span class="ic">${n===5?foxSVG(FOX.feufollet,{pose:"happy",sil:!S.hwKeep}):`<svg viewBox="0 0 40 40" aria-hidden="true">${jack(20,36,.9)}</svg>`}</span><span class="tx"><strong>${n}. ${NIGHT_NAMES[i]}</strong><span>${op?`<span class="nst2">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></span> Objectif ${N.goal}${n===5&&!S.hwKeep?" · garde Feu Follet pour toujours":""}`:why}</span></span><span class="side">${op?`<button class="btn" data-night="${n}" type="button">${st?"Rejouer":"Jouer"}</button>`:""}</span></div>`}).join("");
  const k=HWF.filter(f=>S.hwServed[f.id]).length,crown=S.own["st-acc-couronne"];
  const album=HWF.map(f=>`<div class="fc hwc">${foxSVG(f,{pose:"happy"})}${f.name}<em>${S.hwServed[f.id]?"<b style=\"color:#4f9a3e\">Servi !</b>":"À servir"}</em></div>`).join("");
  openSheet(`<h2>Nuit des citrouilles</h2><p class="sub">Jusqu'au 3 novembre, le café fête Halloween ! Les clients viennent <b>déguisés</b> : sers-les pour gagner des <b>bonbons</b> (2 si tu es rapide). Six invités très spéciaux passent en VIP : un fantôme, un vampire, un squelette, un mort-vivant, un épouvantail et une sorcière. Ils paient ×3 et donnent 5 bonbons. Tu as <b>${S.candy} bonbons</b>.</p>
  <p class="sub" style="margin:0 0 6px"><b>Les 5 nuits</b> · tous les clients sont déguisés, les étoiles rapportent des bonbons</p><div class="col" style="margin-bottom:14px">${nights}</div>
  <p class="sub" style="margin:0 0 6px"><b>Album des invités : ${k} / ${HWF.length}</b> · ${crown?`complet ! ${ME()} a sa Couronne de citrouilles.`:"sers-les tous pour gagner la Couronne de citrouilles de Roussette."}</p><div class="fgrid" style="grid-template-columns:repeat(3,1fr);max-width:380px;margin:0 auto 12px">${album}</div>
  <div class="col"><button class="btn big wide" data-hwshop type="button">Boutique d'Halloween</button><button class="btn ghost wide" data-act="hwintro" type="button">Revoir l'animation</button><button class="btn ghost wide" data-act="costumes" type="button">Clients déguisés (${Object.keys(S.costSeen).length} / ${REG.length*COSTUMES.length})</button></div>`);
}
// galerie des clients déguisés déjà croisés (visible toute l'année)
function costumesSheet(){
  const tot=REG.length*COSTUMES.length,seen=REG.flatMap(f=>COSTUMES.filter(c=>S.costSeen[f.id+":"+c]).map(c=>[f,c]));
  const cards=seen.map(([f,c])=>{const n=S.costSeen[f.id+":"+c];return `<div class="fc hwc">${foxSVG({...f,acc:c},{pose:"happy"})}${f.name}<em>${COSTNAME[c]} · ${n} visite${n>1?"s":""}</em></div>`}).join("");
  openSheet(`<h2>Clients déguisés</h2><p class="sub"><b>${seen.length} / ${tot}</b> déguisements rencontrés. Chaque client peut venir en sorcière, en citrouille, en chauve-souris ou en vampire, pendant Halloween.</p>${seen.length?`<div class="fgrid">${cards}</div>`:`<p class="sub">Aucun pour l'instant : les clients déguisés viennent pendant Halloween.</p>`}<div class="col" style="margin-top:10px">${HW?`<button class="btn ghost wide" data-act="hw" type="button">Halloween</button>`:""}<button class="btn ghost wide" data-act="carnet" type="button">Carnet des clients</button></div>`);
}
function nightSheet(n){
  if(!nightOpen(n)){toast("Cette nuit n'est pas encore ouverte.");return}
  const N=NIGHTS[n-1],c=cfgOf(N.base),g=Math.round(N.goal*(1+equipBonus(N.base))),st=S.hwStars[n]||0;
  openSheet(`<h2>${NIGHT_NAMES[n-1]}</h2><div class="stars" style="font-size:30px">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div>
  <p class="sub">Nuit ${n} sur 5. ${c.c} clients, <b>tous déguisés</b>${c.max>1?`, jusqu'à ${c.max} articles par commande`:""}. Les VIP sont les invités d'Halloween.</p>
  <p class="sub" style="margin-bottom:6px">Objectif de recette (en pièces)</p><div class="goals"><span><em>★</em>${g}</span><span><em>★★</em>${Math.ceil(g*1.35)}</span><span><em>★★★</em>${Math.ceil(g*1.7)}</span></div>
  ${st<3?itRow(candySVG,"Coffre de bonbons","Chaque nouvelle étoile rapporte 8 bonbons, et ★★★ ouvre le grand coffre (+15)."):""}
  ${n===5&&!S.hwKeep?itRow(foxSVG(FOX.feufollet,{pose:"happy"}),"Récompense : Feu Follet","Réussis cette nuit et il restera au café toute l'année.","background:#efe4fb"):""}
  ${st?itRow(icon("coeur"),"Nuit déjà réussie","La rejouer ne rapporte que 30 % des pièces."):""}
  ${boostHTML(()=>nightSheet(n))}
  <div class="col" style="margin-top:6px"><button class="btn big wide" data-nplay="${n}" type="button">Commencer la nuit</button><button class="btn ghost wide" data-act="hw" type="button">Retour</button></div>`);
}
function questsSheet(){openSheet(`<h2>Quêtes</h2><p class="sub">Elles avancent pendant les journées. Une quête réussie rapporte des pièces, et une nouvelle la remplace.</p>${questHTML()}`)}
let shopTab="equip";
function shop(){
  let list;
  if(shopTab==="hw"&&!HW)shopTab="style";
  boostCtx=null;
  if(shopTab==="boost")list=`<p class="sub" style="margin:0 0 8px">Achète-les d'avance, puis choisis-les avant une journée (à partir du jour 3). Chacun ne sert qu'une fois.</p>`+BOOSTS.map(b=>`<div class="it"><span class="ic">${boostIc(b)}</span><span class="tx"><strong>${b.name}</strong><span>${b.d} En réserve : <b>${S.boost[b.id]||0}</b>.</span></span><span class="side"><span class="price">${coinSVG}${b.c}</span><button class="btn" data-bbuy="${b.id}" type="button" ${S.coins>=b.c?"":"disabled"}>Acheter</button></span></div>`).join("");else
  if(shopTab==="style"||shopTab==="hw"){
    S.style=S.style||{wall:"rose",counter:"bois",acc:""};
    const hw=shopTab==="hw";
    const ak=HWF.filter(f=>S.hwServed[f.id]).length;
    list=(hw?`<div class="hwbox">${foxSVG(FOX.croquignol,{pose:"happy"})}<p><b>Nuit des citrouilles</b><br>Les clients déguisés donnent des bonbons : 1, ou 2 si tu les sers vite. Les invités d'Halloween en donnent 5. Tu as <b>${S.candy} bonbons</b>.</p></div>`:"")+Object.keys(STYLE).map(k=>`<p class="sub" style="margin:8px 0 4px"><b>${STYLE[k].name}</b></p>`+STYLE[k].items.filter(it=>hw?it.cb||it.album:(!it.cb&&!it.album)||S.own[`st-${k}-${it.id}`]).map(it=>{
      const key=`st-${k}-${it.id}`,own=(!it.c&&!it.cb&&!it.album)||S.own[key],on=styleOf(k).id===it.id;
      const sw=k==="acc"?foxSVG({...FOX.roussette,acc:it.id||undefined},{pose:"happy"}):k==="wall"?`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="4" width="32" height="22" rx="4" fill="${it.w}" ${K}/>${[[11,11],[23,11],[17,18],[29,18]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="${it.d}"/>`).join("")}<rect x="4" y="26" width="32" height="10" rx="3" fill="${it.b}" ${K}/></svg>`:`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="3" y="10" width="34" height="7" rx="3" fill="${it.t}" ${K}/><rect x="5" y="17" width="30" height="18" fill="${it.f}" ${K}/><rect x="9" y="21" width="9" height="10" rx="2" fill="none" stroke="${it.p}" stroke-width="2"/><rect x="22" y="21" width="9" height="10" rx="2" fill="none" stroke="${it.p}" stroke-width="2"/></svg>`;
      return `<div class="it"><span class="ic">${sw}</span><span class="tx"><strong>${it.name}</strong><span>${it.album?`Sers les ${HWF.length} invités d'Halloween pour l'obtenir.`:k==="acc"?`${ME()} la porte sur la carte.`:"Change la couleur de ton café."}</span></span><span class="side">${on?`<span class="owned">Choisi</span>`:own?`<button class="btn ghost" data-style="${k}:${it.id}" type="button">Choisir</button>`:it.album?`<span class="owned">Album ${ak} / ${HWF.length}</span>`:it.cb?`<span class="price cnd">${candySVG}${it.cb}</span><button class="btn" data-sbuy="${k}:${it.id}" type="button" ${S.candy>=it.cb?"":"disabled"}>Acheter</button>`:`<span class="price">${coinSVG}${it.c}</span><button class="btn" data-sbuy="${k}:${it.id}" type="button" ${S.coins>=it.c?"":"disabled"}>Acheter</button>`}</span></div>`}).join("")).join("");
  }else list=UPG[shopTab].map(u=>{
    const n=lv(u.id),max=u.lv.length,nx=u.lv[n],early=nx&&nx.from&&S.day<nx.from;
    const dots=max>1?`<span class="lvd">${u.lv.map((_,i)=>`<i${i<n?' class="on"':""}></i>`).join("")}</span>`:"";
    const desc=nx?(n?`Maintenant : ${lvDesc(u,n)} <b>Niveau ${n+1} :</b> ${nx.d}`:nx.d)+(early?` (Arrive avec la saison ${chapOf(nx.from).name}.)`:""):lvDesc(u,n);
    return `<div class="it"><span class="ic">${icon((nx||u.lv[n-1]).ic||u.id)}</span><span class="tx"><strong>${u.name}${dots}</strong><span>${desc}</span></span><span class="side">${nx?`<span class="price">${coinSVG}${nx.c}</span><button class="btn" data-buy="${u.id}" type="button" ${!early&&S.coins>=nx.c?"":"disabled"}>${n?"Améliorer":"Acheter"}</button>`:`<span class="owned">${max>1?"Niveau max":"Acheté"}</span>`}</span></div>`}).join("");
  openSheet(`<h2>Boutique</h2><p class="sub">Tu as <b>${S.coins} pièces</b>. Les recettes se gagnent sur la carte ; ici, chaque achat change ta façon de jouer, et le style rend ton café unique.</p><div class="tabs">${[["equip","Équipement"],["deco","Déco"],["boost","Bonus"],["style","Style"],...(HW?[["hw","Halloween"]]:[])].map(([k,n])=>`<button class="tab${shopTab===k?" on":""}" data-tab="${k}" type="button">${n}</button>`).join("")}</div><div class="shop">${list}</div>`);
  const sc=$("sheet-in");if(shop.y!=null){sc.scrollTop=shop.y;shop.y=null}
}
function carnet(){
  const list=FOXES.filter(f=>f.id!=="roussette");
  const rows=list.map(f=>{const n=S.seen[f.id]||0,c=CHAP.find(c=>c.guest===f.id),ok=!c||S.guest[f.id]||n;
    const show=n||(f.event&&HW); // pendant Halloween, ses invités sont montrés même pas encore venus
    return `<div class="fc${c?" vipc":f.event?" hwc":""}">${foxSVG(f,{sil:!show})}${show||(c&&S.guest[f.id])?f.name:"???"}<em>${n?`${n} visite${n>1?"s":""}`:c?(ok?"Invité d'honneur":`★★★ au ${c.name}`):f.event&&!HW?"Vient à Halloween":WILD[f.id]?`Sauvage : une gamelle ${WILD_FOOD[WILD[f.id]]} au refuge l'attirera`:"Pas encore venu"}</em></div>`}).join("");
  openSheet(`<h2>Carnet des clients</h2><p class="sub">${list.filter(f=>S.seen[f.id]).length} / ${list.length} clients rencontrés. Les invités d'honneur viennent quand une saison entière est en ★★★.</p><div class="fgrid">${rows}</div>${Object.keys(S.costSeen).length||HW?`<div class="col" style="margin-top:10px"><button class="btn ghost wide" data-act="costumes" type="button">Clients déguisés (${Object.keys(S.costSeen).length} / ${REG.length*COSTUMES.length})</button></div>`:""}`);
}
function pauseMenu(){if(!G||!G.run)return;G.paused=1;openSheet(`<h2>Pause</h2><p class="sub">Les clients t'attendent sagement.</p><div class="col"><button class="btn big wide" data-act="resume" type="button">Reprendre</button><button class="btn ghost wide" data-act="quit" type="button">Abandonner la journée</button></div>`,true)}
