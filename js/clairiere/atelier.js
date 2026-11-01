/* La Clairière : l'atelier de Noël de Mamie Brindille et la boutique de Noël (onglet Noël de la boutique, 01/11/2026).
   Les tenues elles-mêmes (couleurs, dessin, ce que chacun porte) sont dans js/tenues.js, partagé avec le Café.
   La quête du jour rapporte des pelotes et des sucres d'orge ; les pelotes paient le tricot (PEL_COST), les sucres
   d'orge la boutique de Noël (pelotes en plus, objets de Noël pour la clairière). On ne tricote que pendant Noël ;
   ce qui est tricoté se porte toute l'année. */
const pelSVG=`<svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M16 17 q4 2 6 -1" fill="none"/><circle cx="11" cy="12" r="8" fill="#f6a5b4"/><path d="M5 9 q6 3 12 -2 M4 13 q7 4 14 -2 M7 18 q5 0 10 -5" fill="none" stroke="#d9788c" stroke-width="1.4"/></g></svg>`;
// la boutique de Noël, en sucres d'orge : des pelotes, et les objets de Noël du calendrier pour ceux qui les ont ratés
const NSHOP=[{k:"pel",name:"Pelote de laine",price:3,desc:"Une pelote toute douce. Il en faut 2 pour un bonnet ou une écharpe."},
  {k:"guirlpin",price:18},{k:"bonhomme",price:25},{k:"luge",price:28},{k:"traineau",price:60}];
const ownTen=id=>tenOwn(id,"h")||tenOwn(id,"s");
const atelierOn=()=>xmasDay()>0||pelN()>0||Object.keys(TEN).some(ownTen);
// qui peut avoir une tenue : Roussette et les renards du refuge (pas les invités de Noël, qui ont déjà la leur)
const tenIds=()=>["roussette",...Object.keys(R.res).filter(id=>TEN[id]&&id!=="roussette")];
// les deux pièces d'un renard : tricoter (pendant Noël) ou porter / enlever
function tenRow(id){const piece=(k,n)=>{const own=tenOwn(id,k),on=tenOn(id,k);
    return own?`<button class="btn${on?"":" ghost"}" data-wear="${id}|${k}" type="button">${n} ${on?"porté":"rangé"}</button>`
      :xmasDay()?`<button class="btn" data-knit="${id}|${k}" type="button" ${pelN()<PEL_COST?"disabled":""}>${n} · ${pelSVG}${PEL_COST}</button>`:`<button class="btn ghost" type="button" disabled>${n}</button>`};
  return `<div class="tenrow">${piece("h","Bonnet")}${piece("s","Écharpe")}</div>`}
// dans la fiche d'un renard
function tenueHTML(id){if(!TEN[id]||(!xmasDay()&&!ownTen(id)))return "";const [,,mo]=TEN[id];
  return `<i data-fox-sheet="${id}" hidden></i><h3 class="sec">Tenue d'hiver</h3><p class="sub">${id==="roussette"?"Les tiens":"Ses couleurs à lui"} : bonnet et écharpe ${TEN_MOTIF[mo]}.${xmasDay()&&!(tenOwn(id,"h")&&tenOwn(id,"s"))?` Mamie Brindille les tricote contre ${PEL_COST} pelotes chacun. Tu en as ${pelN()}.`:""}</p>${tenRow(id)}`}
function noelTab(){const q=nqDef(),s=nqState(),d=xmasDay();
  const quest=q?`<div class="opt nq${s.paid?" done":""}"><span class="thumb">${pelSVG}</span><div class="txt"><strong>Quête de Noël du jour</strong><span>${q.t}.</span><span class="dcount">${s.paid?"Réussie ! Reviens demain pour la suivante.":`${s.p} / ${q.n} · récompense : ${NQ_GIFT.pel} pelotes et ${NQ_GIFT.sucres} sucres d'orge`}</span></div></div>`:"";
  const ids=tenIds();
  const atelier=`<h3 class="sec">L'atelier de Mamie Brindille</h3><p class="sub">${d?`Chaque renard a son bonnet et son écharpe, à ses couleurs. Mamie les tricote contre ${PEL_COST} pelotes chacun ; ensuite, touche une pièce pour la mettre ou l'enlever.`:"L'atelier est fermé jusqu'à Noël prochain. Les tenues tricotées se portent toute l'année."}</p>
    <div class="tengrid">${ids.map(id=>`<div class="tencard"><div class="pic">${foxArt(FOX[id],{portrait:1,expr:"joy"})}</div><b>${id==="roussette"?ME():nameOf(id)}</b>${tenRow(id)}</div>`).join("")}</div>`;
  const shop=d?`<h3 class="sec">La boutique de Noël</h3><p class="sub">En sucres d'orge : ils se gagnent avec le calendrier de l'Avent, la quête du jour et les Nuits de Noël du Café.</p>${NSHOP.map(o=>{const D=DECO[o.k],nm=o.name||D.name,can=sucresN()>=o.price;
      return `<div class="opt"><span class="thumb${D?" dthumb":""}">${D?dSvg(o.k,"all"):pelSVG}</span><div class="txt"><strong>${nm}</strong><span>${o.desc||D.desc}</span></div><button class="btn" data-nbuy="${o.k}" type="button" ${can?"":"disabled"}>${sucreSVG} ${o.price}</button></div>`}).join("")}`:"";
  return quest+atelier+shop}
function nBuy(k){const o=NSHOP.find(x=>x.k===k);if(!o||!xmasDay()||sucresN()<o.price)return;const b=bourse();b.sucres-=o.price;putBourse(b);
  if(k==="pel"){addPel(1);toast("Une pelote de plus pour Mamie Brindille.");shopSheet("noel");return}
  R.deco.inv[k]=(R.deco.inv[k]||0)+1;save();decoStart(k);toast(`${DECO[k].name} : fais-le glisser où tu veux, puis touche Terminé.`)}
$("sheet").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  const back=()=>{const h=$("sheet-in").querySelector("[data-fox-sheet]");if(h)foxSheet(h.dataset.foxSheet);else shopSheet("noel")};
  if(b.dataset.knit){const [id,k]=b.dataset.knit.split("|");if(!xmasDay())return;
    if(tenKnit(id,k)){toast(`Mamie Brindille a tricoté ${k==="h"?"le bonnet":"l'écharpe"} de ${id==="roussette"?ME():nameOf(id)} !`);syncWear();back()}}
  else if(b.dataset.wear){const [id,k]=b.dataset.wear.split("|");tenSet(id,k,!tenOn(id,k));syncWear();back()}
  else if(b.dataset.nbuy)nBuy(b.dataset.nbuy)});
// redessine les renards de la scène avec leur nouvelle tenue
function syncWear(){for(const f of foxes)if(!f.wild)draw(f)}
