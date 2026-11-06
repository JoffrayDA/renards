/* Kitsune Café : les Nuits de Noël (01/11/2026, demande de Joffray : « beaucoup plus de niveaux que 5 », une carte toute de Noël).
   24 nuits, du 1er décembre au 6 janvier (xmasDay, js/tenues.js) : chacune reprend le rythme d'un jour de référence (base) avec
   d'autres commandes (graine), objectifs calculés par `python tools/balance-bot.py --noel`. Une nuit s'ouvre quand son jour de
   référence est réussi et la nuit précédente a ★. Les recettes y changent de nom et de dessin (VAR.noel, ICON["clé@noel"]) : vin chaud,
   thé de Noël, pain d'épice, sucre d'orge, chocolat cannelle, lait de poule, bûche ; la clé, le prix et la cuisson ne changent pas.
   Les VIP sont les invités de Noël (NOELF), qui donnent un sucre d'orge ; les nouvelles étoiles paient en sucres d'orge.
   Réussir la dernière garde Guimauve au café toute l'année (S.noelKeep). Étoiles dans S.noelStars. */
const NOEL_NIGHTS=[{base:2,seed:79,goal:59},{base:3,seed:66,goal:73},{base:4,seed:76,goal:91},{base:5,seed:77,goal:113},{base:6,seed:62,goal:123},{base:7,seed:76,goal:138},{base:8,seed:72,goal:152},{base:9,seed:71,goal:160},{base:10,seed:70,goal:176},{base:11,seed:62,goal:187},{base:12,seed:70,goal:212},{base:13,seed:72,goal:223},{base:14,seed:79,goal:241},{base:16,seed:71,goal:256},{base:18,seed:70,goal:288},{base:20,seed:75,goal:333},{base:22,seed:77,goal:362},{base:24,seed:78,goal:338},{base:26,seed:76,goal:362},{base:28,seed:73,goal:388},{base:30,seed:71,goal:382},{base:33,seed:64,goal:401},{base:36,seed:66,goal:462},{base:39,seed:71,goal:488}];
const NOEL_NAMES=["Nuit des premiers flocons","Nuit des guirlandes","Nuit des bougies","Nuit du pain d'épice","Nuit des lutins","Nuit des clochettes","Nuit des marrons chauds","Nuit des étoiles filantes",
  "Nuit du chocolat chaud","Nuit des bonhommes de neige","Nuit des aurores","Nuit des cadeaux","Nuit du gui","Nuit des lanternes de glace","Nuit des chants","Nuit du traîneau",
  "Nuit des rennes","Nuit du grand froid","Nuit des biscuits","Nuit des souhaits","Nuit des sucres d'orge","Nuit de la bûche","Nuit des lumières","Grande nuit de Noël"];
const NOELF=FOXES.filter(f=>f.event==="noel");
S.noelStars=S.noelStars||{};
const noelNightOpen=n=>{const N=NOEL_NIGHTS[n-1];return xmasDay()>0&&S.day>N.base&&(n===1||(S.noelStars[n-1]||0)>0)};
const noelGoal=n=>{const N=NOEL_NIGHTS[n-1];return Math.round(N.goal*(1+equipBonus(N.base,!(S.noelStars[n]>0))))};
function addSucres(n){const b=bourse();b.sucres=(b.sucres||0)+n;putBourse(b)}

/* ---------- la carte de Noël ---------- */
VAR.noel={cafe:["Vin chaud","vins chauds"],the:["Thé de Noël","thés de Noël"],croissant:["Pain d'épice","pains d'épice"],cookie:["Sucre d'orge","sucres d'orge"],
  choco:["Chocolat cannelle","chocolats cannelle"],smoothie:["Lait de poule","laits de poule"],gateau:["Bûche de Noël","parts de bûche"]};
Object.assign(ICON,{
  "cafe@noel":cup("#e8a0a0","#9a3a4a",`<circle cx="25" cy="15.5" r="4.6" fill="#f7a64a" stroke="${INK}" stroke-width="1.6"/><path d="M25 11 V20 M20.4 15.5 H29.6" stroke="#fbd28a" stroke-width="1.2"/><path d="M9 6 L15 14" stroke="#a8603a" stroke-width="3" stroke-linecap="round"/>`),
  "the@noel":cup("#cfe8d6","#d9a85a",`<g transform="translate(17 8)" stroke="${INK}" stroke-width="1.2">${[0,60,120,180,240,300].map(a=>`<ellipse cx="0" cy="-3.6" rx="1.8" ry="3.6" fill="#a8603a" transform="rotate(${a})"/>`).join("")}<circle r="1.6" fill="#7a4028"/></g>`),
  "croissant@noel":`<ellipse cx="20" cy="35" rx="13" ry="2.4" fill="#f7b7c3" opacity=".7"/><path d="M20 4 a6 6 0 0 1 6 6 a6 6 0 0 1 -1.2 3.6 L33 16 Q37 18 34 22 L27 21 L30 32 Q31 36 27 35 L20 28 L13 35 Q9 36 10 32 L13 21 L6 22 Q3 18 7 16 L15.2 13.6 A6 6 0 0 1 14 10 a6 6 0 0 1 6 -6Z" fill="#c8844a" ${K}/><path d="M9 18.6 q2 -1.4 4 0 M27 18.6 q2 -1.4 4 0 M14 30 q1.6 -1.6 3.2 0 M22.8 30 q1.6 -1.6 3.2 0" fill="none" stroke="#fffaf2" stroke-width="1.6" stroke-linecap="round"/><circle cx="17.6" cy="9" r="1.1" fill="${INK}"/><circle cx="22.4" cy="9" r="1.1" fill="${INK}"/><path d="M18 12 q2 1.6 4 0" fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/><circle cx="20" cy="18" r="1.6" fill="#e0505a"/><circle cx="20" cy="23" r="1.6" fill="#7fb06a"/>`,
  "cookie@noel":`<path d="M24 35 V14 a6 6 0 0 0 -12 0" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M24 35 V14 a6 6 0 0 0 -12 0" fill="none" stroke="#fffaf2" stroke-width="5.4" stroke-linecap="round"/><path d="M24 35 V14 a6 6 0 0 0 -12 0" fill="none" stroke="#e0505a" stroke-width="5.4" stroke-dasharray="3.4 3.4" stroke-linecap="butt"/>`,
  "choco@noel":`<path d="M30 15 Q38 16 36 23 Q34 29 28 27" fill="none" ${K}/><path d="M6 12 L9 33 Q18 36 27 33 L30 12Z" fill="#fffaf2" ${K}/><path d="M7.6 18 L28.4 18 L27 32 Q18 35 9 32Z" fill="#8a5a3a"/><path d="M7 12 Q18 16 29 12" fill="none" ${K}/><rect x="22" y="2" width="4" height="16" rx="2" fill="#b8703e" stroke="${INK}" stroke-width="1.6" transform="rotate(14 24 10)"/><rect x="11" y="9" width="7" height="6" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`,
  "smoothie@noel":glass("#fbe6a8",`<path d="M9 11 Q12 6 16 9 Q20 4 24 8 Q29 5 31 11Z" fill="#fffaf2" stroke="${INK}" stroke-width="1.6"/><circle cx="17" cy="9" r=".9" fill="#a8603a"/><circle cx="23" cy="8" r=".9" fill="#a8603a"/><circle cx="20" cy="10.4" r=".9" fill="#a8603a"/>`),
  "gateau@noel":ICON["gateau@hiver"]});

/* ---------- jouer une nuit ---------- */
function newNoel(n){const N=NOEL_NIGHTS[n-1];newDay(N.base);G.rng=rng(N.base*7919+N.seed+1);G.noel=n;G.cfg={...G.cfg,goal:noelGoal(n)};G.replay=(S.noelStars[n]||0)>0;
  SEA="hiver";renderDecor();dirty=true;MUSIC.want("noel")} // le dehors est sous la neige, quelle que soit la saison du jour de référence
function endNoel(){
  const n=G.noel,g=G.cfg.goal,e=G.earned,st=e>=g*1.7?3:e>=g*1.35?2:e>=g?1:0,prev=S.noelStars[n]||0;
  G.run=0;
  if(!G.lost&&st)qEvent("perfect");if(st===3)qEvent("stars3");if(st)qEvent("night");
  const nq=st?noelEvent("star"):"";if(nq)setTimeout(()=>toast(nq),1600);
  S.noelStars[n]=Math.max(prev,st);
  // les nouvelles étoiles paient en sucres d'orge (boutique de Noël de la Clairière)
  let su=0;if(st>prev){su=2*(st-prev)+(st===3?5:0);addSucres(su)}
  const news=[],last=n===NOEL_NIGHTS.length;
  if(last&&st&&!S.noelKeep){S.noelKeep=1;news.push(itRow(foxSVG(FOX.guimauve,{pose:"happy"}),"Guimauve reste au café !","Elle a tant aimé la Grande nuit de Noël qu'elle viendra toute l'année, en invitée d'honneur.","background:#fde8ea"))}
  if(st&&!last&&!prev)news.push(itRow(sucreSVG,`${NOEL_NAMES[n]} ouverte !`,"La nuit suivante t'attend.","background:#fde8ea"));
  const bRow=buddyRow(),qShow=S.quests.map(q=>({...q,gain:q.p-(G.q0[q.t]||0)}));
  S.quests=S.quests.filter(q=>!q.done);fillQuests();save();
  const nxt=st<3?(e<g?`Il manquait ${g-e} pièces pour réussir.`:`Plus que ${Math.ceil(g*(st===1?1.35:1.7))-e} pièces pour ${st===1?"★★":"★★★"} !`):"Nuit parfaite !";
  const canNext=st&&!last&&noelNightOpen(n+1);
  endFx(st);openSheet(`<h2>${st?"Nuit réussie !":"Objectif manqué"}</h2><div class="stars">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div><p class="sub" style="text-align:center"><b>${NOEL_NAMES[n-1]}</b><br>${nxt}</p>
  <div class="stats"><div>Recette<b>${e} / ${g}</b></div><div>Clients servis<b>${G.served} / ${G.cfg.c}</b></div><div>Partis fâchés<b>${G.lost}</b></div><div>Meilleur combo<b>×${G.bestCombo}</b></div><div>Pièces gagnées<b>+${G.gain}</b></div><div>Sucres d'orge<b>+${su+(G.sucres||0)}</b></div></div>
  ${su?itRow(sucreSVG,`Hotte de la nuit : +${su} sucres d'orge`,st===3?"Trois étoiles : la grande hotte !":"Chaque nouvelle étoile d'une nuit rapporte des sucres d'orge, à dépenser dans la boutique de Noël de la Clairière."):""}
  ${news.join("")}${bRow}
  ${questHTML(qShow)}
  <div class="col">${canNext?`<button class="btn big wide" data-nnplay="${n+1}" type="button">Nuit ${n+1}</button>`:""}<button class="btn ${canNext?"ghost":"big"} wide" data-nnplay="${n}" type="button">${st?"Rejouer":"Réessayer"} la nuit ${n}</button><button class="btn ghost wide" data-act="noel" type="button">Les nuits de Noël</button></div>`);
  G=null;$("closed").hidden=false;$("hint").textContent="";renderDecor();dirty=true;
}

/* ---------- les feuilles ---------- */
const sapinMini=(k=1)=>`<svg viewBox="0 0 40 44" aria-hidden="true"><g stroke="${INK}" stroke-width="${2/k}" stroke-linejoin="round"><rect x="17" y="34" width="6" height="7" fill="#a9785a"/><path d="M20 4 L32 20 H26 L35 34 H5 L14 20 H8Z" fill="#5f9468"/></g><circle cx="15" cy="27" r="2" fill="#e0505a"/><circle cx="25" cy="23" r="2" fill="#f2c45a"/><circle cx="22" cy="30" r="2" fill="#9ec3ef"/><path d="M20 0 l1.4 3 3.2.4 -2.4 2.2 .6 3.2 -2.8 -1.6 -2.8 1.6 .6 -3.2 -2.4 -2.2 3.2 -.4z" fill="#ffe680" stroke="${INK}" stroke-width="1.2"/></svg>`;
function noelSheet(){const tot=Object.values(S.noelStars).reduce((a,b)=>a+b,0),done=Object.values(S.noelStars).filter(x=>x).length;
  const cell=(N,i)=>{const n=i+1,op=noelNightOpen(n),st=S.noelStars[n]||0;
    return `<button class="nn${op?"":" nlock"}${st?" ok":""}" data-noelnight="${n}" type="button" aria-label="${NOEL_NAMES[i]}"><b>${n}</b><span>${st?`${"★".repeat(st)}<em>${"★".repeat(3-st)}</em>`:op?"Jouer":`<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><rect x="5" y="9" width="10" height="8" rx="2" fill="currentColor"/><path d="M7 9 V6 a3 3 0 0 1 6 0 V9" fill="none" stroke="currentColor" stroke-width="2"/></svg>`}</span></button>`};
  openSheet(`<h2>Les nuits de Noël</h2><p class="sub">Jusqu'au 6 janvier, le café sert sa carte de Noël : vin chaud, pain d'épice, sucres d'orge, bûche… Les invités de Noël passent en VIP et donnent un sucre d'orge. Chaque nouvelle étoile rapporte des sucres d'orge, à dépenser dans la boutique de Noël de la Clairière. Tu en as <b>${sucresN()}</b>.</p>
  <p class="sub" style="margin:0 0 6px"><b>${done} / ${NOEL_NIGHTS.length} nuits</b> · ${tot} étoiles${S.noelKeep?" · Guimauve vient toute l'année":" · réussis la Grande nuit de Noël pour garder Guimauve au café"}</p>
  <div class="nngrid">${NOEL_NIGHTS.map(cell).join("")}</div>
  <p class="sub" style="margin:0 0 6px"><b>Les invités de Noël</b> · ils passent en VIP pendant les nuits</p><div class="fgrid" style="grid-template-columns:repeat(3,1fr);max-width:380px;margin:0 auto 12px">${NOELF.map(f=>`<div class="fc hwc">${foxSVG(f,{pose:"happy"})}${f.name}</div>`).join("")}</div>
  <div class="col"><button class="btn ghost wide" data-act="noelintro" type="button">Revoir l'animation</button></div>`);
}
function noelNightSheet(n){
  if(!noelNightOpen(n)){const N=NOEL_NIGHTS[n-1];toast(!xmasDay()?"Les nuits de Noël sont finies pour cette année.":S.day<=N.base?`Réussis d'abord le jour ${N.base}.`:"Réussis d'abord la nuit précédente.");return}
  const N=NOEL_NIGHTS[n-1],c=cfgOf(N.base),g=noelGoal(n),st=S.noelStars[n]||0,menu=Object.keys(REC).filter(k=>has(k)&&!(REC[k].day>=N.base));
  openSheet(`<h2>${NOEL_NAMES[n-1]}</h2><div class="stars" style="font-size:30px">${"★".repeat(st)}<em>${"★".repeat(3-st)}</em></div>
  <p class="sub">Nuit ${n} sur ${NOEL_NIGHTS.length}. ${c.c} clients${c.max>1?`, jusqu'à ${c.max} articles par commande`:""}. Les VIP sont les invités de Noël.</p>
  <p class="sub" style="margin-bottom:6px">À la carte : ${menu.map(k=>VAR.noel[k][0]).join(", ")}.</p>
  <p class="sub" style="margin-bottom:6px">Objectif de recette (en pièces)</p><div class="goals"><span><em>★</em>${g}</span><span><em>★★</em>${Math.ceil(g*1.35)}</span><span><em>★★★</em>${Math.ceil(g*1.7)}</span></div>
  ${st<3?itRow(sucreSVG,"Hotte de sucres d'orge","Chaque nouvelle étoile rapporte 2 sucres d'orge, et ★★★ ouvre la grande hotte (+5)."):""}
  ${n===NOEL_NIGHTS.length&&!S.noelKeep?itRow(foxSVG(FOX.guimauve,{pose:"happy"}),"Récompense : Guimauve","Réussis cette nuit et elle restera au café toute l'année.","background:#fde8ea"):""}
  ${st?itRow(icon("coeur"),"Nuit déjà réussie","La rejouer ne rapporte que la moitié des pièces."):""}
  ${boostHTML(()=>noelNightSheet(n))}
  <div class="col" style="margin-top:6px"><button class="btn big wide" data-nnplay="${n}" type="button">Commencer la nuit</button><button class="btn ghost wide" data-act="noel" type="button">Retour</button></div>`);
}
