/* La Clairière : interface (compteurs, bulles, dialogues, gamelle, carnet, photos). */
function acornSVG(){return `<svg viewBox="0 0 24 24" aria-hidden="true"><g filter="url(#wobble)" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"><path d="M5 10 Q5 21 12 22 Q19 21 19 10Z" fill="#d9a06a"/><path d="M3.5 10.5 Q12 2 20.5 10.5 Q12 13 3.5 10.5Z" fill="#a9785a"/><path d="M12 6 q1 -3 3 -4" fill="none"/></g></svg>`}
const HEART=`<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 20 C4 14 1.5 10 1.5 6.5 A5 5 0 0 1 12 4.5 A5 5 0 0 1 22.5 6.5 C22.5 10 20 14 12 20Z" fill="#f48aa6" stroke="#5b4250" stroke-width="2.2" stroke-linejoin="round"/><path d="M5.5 7 q.5 -2 2.5 -2.4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`;
// câlin : le renard frotte sa tête comme un chat, des petits cœurs s'envolent
function hugFx(f){f.badge.querySelector(".want")?.remove();f.el.classList.remove("hug");void f.el.offsetWidth;f.el.classList.add("hug");
  clearTimeout(f.hugT);f.hugT=setTimeout(()=>f.el.classList.remove("hug"),1700);
  for(let i=0;i<5;i++){const h=document.createElement("i");h.className="lovep";h.innerHTML=HEART;
    h.style.cssText=pc(f.x+(i-2)*8,f.y-38)+`;animation-delay:${(i*.16).toFixed(2)}s;--dx:${(i-2)*14}px`;$("scene").appendChild(h);setTimeout(()=>h.remove(),2400)}}
const heartsHTML=h=>{const l=lvOf(h);return `<span class="hs5" aria-label="Amitié ${l} sur 5">${"♥".repeat(l)}<i>${"♥".repeat(5-l)}</i></span>`};
function renderHud(){$("glands").textContent=R.glands;$("fishc").hidden=!R.fish;$("fishn").textContent=R.fish;drawBowl();drawDrops()}
const fishSVG=()=>`<svg viewBox="-24 -16 48 32" aria-hidden="true"><g filter="url(#wobble)">${ITEM.fish}</g></svg>`;

/* ---------- la mare : pêche quand on veut ---------- */
const pondEl=document.createElement("button");pondEl.className="pondbtn";pondEl.type="button";pondEl.setAttribute("aria-label","Pêcher dans la mare");
pondEl.style.cssText=pc(96,424)+";z-index:300";
const canFish=()=>STORIES.gaston&&storyDone("gaston");
pondEl.onpointerdown=e=>{e.stopPropagation();if(storyTap("@pond"))return;if(gameOn||!$("talk").hidden||!$("sheet").hidden)return;
  if(!canFish()){log("La mare est calme. Il faudrait une canne à pêche…");return}
  playGame({k:"fish",free:1,need:NEED_FISH,have:()=>R.fish,onFish:()=>{R.fish++;save();renderHud();
    return R.fish>=NEED_FISH?`Un poisson ! Tu en as ${R.fish} : de quoi remplir la gamelle.`:`Un poisson ! ${R.fish} sur ${NEED_FISH} pour la gamelle.`}},()=>{})};
function log(t){$("log").textContent=t}
let toastT;function toast(t){const el=$("toast");el.textContent=t;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>el.hidden=true,2600)}

/* ---------- gamelle dans la scène ---------- */
const bowlEl=document.createElement("button");bowlEl.className="bowl";bowlEl.type="button";bowlEl.setAttribute("aria-label","La gamelle");
bowlEl.onpointerdown=e=>{e.stopPropagation();bowlSheet()};
// tant qu'un sauvage est venu manger, la gamelle montre encore ce qu'il est venu chercher
function drawBowl(){const v=foxes.find(f=>f.wild&&f.food);
  bowlEl.style.cssText=pc(240,268)+";z-index:269";bowlEl.innerHTML=bowlSVG(v?v.food:R.bowl&&R.bowl.type);
  bowlEl.classList.toggle("want",!R.bowl&&!v&&typeof wildLeft==="function"&&wildLeft().length>0&&!nextId())}

/* ---------- glands dans l'herbe ---------- */
// les glands rapportés par les renards (R.pend) traînent dans l'herbe : 6 tas au plus, on les touche pour les ramasser
const DROPS=[[122,352],[284,296],[48,336],[236,424],[340,452],[148,470]],dropEls=[];
function drawDrops(){const n=Math.min(DROPS.length,R.pend||0);
  DROPS.forEach(([x,y],i)=>{let el=dropEls[i];
    if(!el){el=dropEls[i]=document.createElement("button");el.className="drop";el.type="button";el.setAttribute("aria-label","Des glands");el.innerHTML=acornSVG();
      el.style.cssText=pc(x,y)+`;z-index:${y}`;el.onpointerdown=e=>{e.stopPropagation();pickDrop(i)};$("actors").appendChild(el)}
    el.hidden=i>=n})}
function pickDrop(i){const n=Math.min(DROPS.length,R.pend||0);if(!n)return;const v=Math.ceil(R.pend/n);
  R.pend-=v;R.glands+=v;save();$("glands").textContent=R.glands;drawDrops();
  const [x,y]=DROPS[i],p=document.createElement("div");p.className="plus";p.textContent=`+${v}`;p.style.cssText=pc(x,y-14);$("scene").appendChild(p);setTimeout(()=>p.remove(),900)}

/* ---------- bulles ---------- */
let bubT;
function bubble(f,txt){const b=document.querySelector(".bubble")||document.createElement("div");b.className="bubble";
  b.innerHTML=`${nameOf(f.id)}<small>${txt}</small>`;b.style.cssText=pc(Math.max(50,Math.min(350,f.x)),f.y-58);$("scene").appendChild(b);clearTimeout(bubT);bubT=setTimeout(()=>b.remove(),2600)}
function tapFox(f){
  if(!f.wild&&storyTap(f.id))return;
  if(f.wild){bubble(f,known(f.id)?"un renard sauvage, il mange !":"un inconnu… Qui est-ce ?");return}
  if(envieTap(f))return; // une petite envie (envies.js)
  if(snapObj(f))return; // un renard dans un objet : la photo d'abord
  const what=f.walk?"trottine":f.inside?"est à l'intérieur":`${ACT[f.pose]} ${PLACE[f.spot.id]||"dans l'herbe"}`;
  const r=pet(f.id);
  if(r){f.pose="happy";f.until=Date.now()+3000;if(!f.walk)draw(f);hugFx(f);renderHud();bubble(f,r===2?`ronronne : niveau ${lvOf(R.res[f.id].h)}, ${LV_N[lvOf(R.res[f.id].h)]} !`:"adore les câlins (+1 cœur, +1 gland)")}
  else bubble(f,what);
}

/* ---------- boîte de dialogue ---------- */
// portrait à gauche, texte à droite ; on touche pour passer à la réplique suivante ; "me", c'est Roussette (le joueur)
let talkQ=[],talkDone=null;
function talk(lines,done){talkQ=lines.slice();talkDone=done||null;nextLine()}
function nextLine(){const el=$("talk");
  if(!talkQ.length){el.hidden=true;const d=talkDone;talkDone=null;if(d)d();return}
  const [id,expr,txt]=talkQ.shift(),f=id==="me"?{...FOX.roussette,name:ME()}:FOX[id];
  el.innerHTML=`<div class="pic">${foxArt(f,{expr,portrait:1})}</div><div class="txt"><b>${f.name}</b><span>${txt}</span><small>Touche pour continuer</small></div>`;el.hidden=false}
$("talk").onclick=nextLine;
const INTRO=[
  ["petitpois","joy",`${ME()} ! Te voilà ! J'ai gardé la maison toute la journée.`],
  ["petitpois","shy","Enfin… j'ai surtout dormi sous le porche."],
  ["petitpois","open","Tu sais, d'autres renards vont venir vivre ici. Chacun a son histoire, tu verras."],
  ["petitpois","surprise","Et dans la forêt, il y a des renards sauvages ! Ils sentent la nourriture de très loin. Essaie de remplir la gamelle."]
];
const arrLines=id=>[[id,"joy",`Bonsoir ${ME()} ! Ton café m'a tellement plu que j'ai suivi ta trace jusqu'ici. Je peux rester ?`],
  ["petitpois","joy",`Bienvenue au refuge, ${FOX[id].name} ! Il y a de la place pour tout le monde.`]];

/* ---------- feuilles ---------- */
let afterSheet=null; // ce qui se passe quand on ferme la feuille (par exemple le dialogue d'arrivée)
function openSheet(h,back){$("sheet-in").innerHTML=`<button class="btn ghost sheetback" ${back?`data-go="${back}"`:"data-close"} type="button">‹ Retour</button>`+h+`<button class="btn ghost close" data-close type="button">Fermer</button>`;$("sheet").hidden=false;$("sheet-in").scrollTop=0}
function closeSheet(){$("sheet").hidden=true;const d=afterSheet;afterSheet=null;if(d)d()}
$("sheet").onclick=e=>{if(e.target.id==="sheet"||e.target.closest("[data-close]"))return closeSheet();
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.buy)buyBowl(b.dataset.buy);
  else if(b.dataset.obj)buyObj(b.dataset.obj);
  else if(b.dataset.house)buildHouse(b.dataset.house);
  else if(b.dataset.fox)foxSheet(b.dataset.fox);
  else if(b.dataset.reread)reread(b.dataset.reread);
  else if(b.dataset.buddy){R.buddy=b.dataset.buddy;save();toast(`${FOX[R.buddy].name} t'accompagnera au Café.`);foxSheet(R.buddy)}
  else if(b.dataset.inco)incoSheet(b.dataset.inco);
  else if(b.dataset.guess){const [id,n]=b.dataset.guess.split("|");guessInco(id,n)}
  else if(b.dataset.ask)askInco(b.dataset.ask);
  else if(b.dataset.go==="carnet")carnet();else if(b.dataset.go==="photos")photos()};

function hoursLeft(){if(!R.bowl)return "";const h=(R.bowl.until-Date.now())/36e5;return h>=1?`encore ${Math.round(h)} h`:"presque vide"}
function bowlSheet(){
  const cur=R.bowl?`<p class="sub">Dans la gamelle : <b>${BOWLS[R.bowl.type].name}</b>, ${hoursLeft()}. En remplir une autre remplace ce qu'il y a dedans.</p>`:`<p class="sub">La gamelle est vide.</p>`;
  openSheet(`<h2>La gamelle</h2>${cur}${Object.entries(BOWLS).map(([k,B])=>`<div class="opt"><span class="thumb">${bowlSVG(k)}</span><div class="txt"><strong>${B.name}</strong><span>${B.desc} Dure ${B.hours} h.</span></div><button class="btn" data-buy="${k}" type="button" ${R.glands<B.price||R.fish<(B.fish||0)||(B.fish&&!canFish())?"disabled":""}>${B.fish?`${fishSVG()} ${R.fish}/${B.fish}`:B.price?`${acornSVG()} ${B.price}`:"Gratuit"}</button></div>`).join("")}<p class="sub">Un sauvage passe souvent quand tu n'es pas là. Il laisse une photo de sa visite : c'est la seule trace de son passage.</p><p class="sub"><b>Pêcher :</b> ${canFish()?"touche la mare quand tu veux. Un poisson de temps en temps, et beaucoup de vieilles bottes.":"il te faudra une canne à pêche. Un certain pêcheur en a peut-être une…"}</p><p class="sub"><b>Gagner des glands :</b> chaque renard du refuge en rapporte quelques-uns par jour (plus il t'aime, plus il en rapporte) ; ils t'attendent dans l'herbe, touche-les pour les ramasser. Un câlin par jour et par renard en donne un, et les histoires en donnent aussi.</p>`);
}
function buyBowl(k){const B=BOWLS[k];if(R.glands<B.price||R.fish<(B.fish||0))return;
  R.glands-=B.price;R.fish-=B.fish||0;R.bowl={type:k,until:Date.now()+B.hours*36e5};save();renderHud();closeSheet();
  log(k==="croquettes"?"La gamelle est pleine de croquettes.":`${B.name} dans la gamelle. Qui va venir ?`)}

function photoSVG(p){const f=FOX[p.id];
  if(p.obj)return `<svg viewBox="0 0 120 100" aria-hidden="true"><rect width="120" height="100" fill="#cfe3a8"/><path d="M0 34 Q30 26 60 32 Q90 26 120 34 V0 H0Z" fill="#8dbd86"/><g transform="translate(0 -6)">${(OBJS[p.obj]||OBJS.panier).svg(p.id).replace(/^<svg[^>]*>|<\/svg>$/g,"")}</g></svg>`;
  return wildPhoto(p,f)}
// photo de la gamelle : jamais deux pareilles (Joffray recevait trois fois la même). L'instant de la visite fixe l'heure
// (aube, jour, soir, nuit), la pluie de ce moment-là, la pose, le côté et quelques détails ; les anciennes photos changent aussi
const PH_TINT={aube:["#f7b8a8",.28],jour:["#fff",0],crepu:["#e98a6a",.3],nuit:["#2b3466",.36]};
function wildPhoto(p,f){let x=Math.floor((p.t||0)/1e3)|0;x=Math.imul(x^x>>>16,0x45d9f3b);x=Math.imul(x^x>>>16,0x45d9f3b);x^=x>>>16; // instants proches, photos différentes
  const r=rng((x>>>0)%2147483646+1);
  const h=new Date(p.t).getHours(),ph=h>=6&&h<8?"aube":h>=8&&h<18?"jour":h>=18&&h<21?"crepu":"nuit",wet=rainAt(p.t),night=ph==="nuit";
  // une photo sur deux le prend en train de manger (Joffray : « un peu des deux »), sinon repu à côté de la gamelle vide
  const poses=night?["sleep","sleep","lie","sit"]:["sit","groom","happy","lie","up"],cl=p.clue!=null&&INC[p.id]&&INC[p.id].clues[p.clue];
  const pose=r()<.5?"eat":poses[Math.floor(r()*poses.length)],pz=cl?cl.pose:pose; // la photo d'un inconnu montre son indice
  const flip=r()<.5,eat=pz==="eat",sc=.62+r()*.14,inner=s=>s.replace(/^<svg[^>]*>|<\/svg>$/g,"");
  // le renard mange au-dessus de la gamelle, ou se tient à côté de la gamelle vide
  const fx=eat?60-42*sc/.7:flip?120-120*sc-r()*10:r()*10, // jamais en miroir : la cicatrice de Balafre reste du même côté
   fy=eat?10+(.7-sc)*60:14+(.7-sc)*80;
  let fox=`<g transform="translate(${fx.toFixed(1)} ${fy.toFixed(1)}) scale(${sc.toFixed(3)})">${inner(foxArt(f,{pose:pz}))}</g>`;
  // ce que l'indice montre (la chaussette que Filou a « empruntée »)
  if(cl&&cl.prop==="chaussette")fox+=`<g transform="translate(${(fx+78*sc).toFixed(1)} ${(fy+86*sc).toFixed(1)}) rotate(-18)" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"><path d="M0 -10 h7 v9 q0 3 3 3 h6 v6 h-11 q-5 0 -5 -5Z" fill="#f48aa6"/><path d="M0 -6 h7 M0 -2 h7" stroke="#fff" stroke-width="1.6"/><path d="M-.6 -10 h8.2" stroke-width="2"/></g>`;
  const bowl=eat?`<g transform="translate(36 63) scale(1.2)">${inner(bowlSVG(p.bowl))}</g>`:`<g transform="translate(${flip?2:84} 72) scale(.85)">${inner(bowlSVG(null))}</g>`;
  const [tc,ta]=PH_TINT[ph],ex=[];
  if(ph==="jour"&&!wet&&r()<.6)ex.push(`<path transform="translate(${80+r()*24} ${10+r()*14})" d="M0 0 q-6 -7 -8 0 q2 5 8 0 q6 -7 8 0 q-2 5 -8 0Z" fill="#f6a5b4" stroke="${INK}" stroke-width="1.2"/>`);
  if(night)for(let i=0;i<6;i++)ex.push(`<circle cx="${(r()*120).toFixed(0)}" cy="${(r()*24).toFixed(0)}" r="${(.8+r()).toFixed(1)}" fill="#fff6c8"/>`);
  if(ph==="crepu"||night)for(let i=0;i<3;i++)ex.push(`<circle cx="${(10+r()*100).toFixed(0)}" cy="${(36+r()*50).toFixed(0)}" r="1.8" fill="#f8ec7a"/>`);
  if(wet)ex.push(Array.from({length:16},()=>{const x=r()*130,y=r()*90;return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-3 8" stroke="#dfeaf6" stroke-width="1.4" stroke-linecap="round" opacity=".85"/>`}).join("")+`<ellipse cx="${flip?30:90}" cy="90" rx="16" ry="3.5" fill="#a9c6dd" opacity=".55"/>`);
  if(!night&&!wet&&r()<.5)ex.push(`<g fill="#fff" stroke="${INK}" stroke-width="1"><circle cx="${8+r()*10}" cy="${84+r()*8}" r="2.4"/><circle cx="${100+r()*12}" cy="${80+r()*10}" r="2.4"/></g>`);
  const ground=wet?"#b9d29a":"#cfe3a8",bush=wet?"#79a978":"#8dbd86";
  return `<svg viewBox="0 0 120 100" aria-hidden="true"><rect width="120" height="100" fill="${ground}"/><path d="M0 34 Q30 ${24+r()*6} 60 32 Q90 ${24+r()*6} 120 34 V0 H0Z" fill="${bush}"/>`+
    `<g>${eat?fox+bowl:bowl+fox}</g>`+
    `<rect width="120" height="100" fill="${tc}" opacity="${ta}"/>${ex.join("")}</svg>`}
const fmtDate=t=>new Date(t).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})+" à "+new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
function photos(){
  const ps=R.photos.slice().reverse();
  openSheet(`<h2>Album photos</h2><p class="sub">${ps.length?`${ps.length} photo${ps.length>1?"s":""}.`:"Aucune photo pour l'instant. Remplis la gamelle de baies, de poisson ou de miel, ou pose un objet du refuge."}</p>${incoCards()}${ps.length&&incoCards()?`<h3 class="sec">Toutes les photos</h3>`:""}<div class="pgrid">${ps.map(p=>`<figure class="photo">${photoSVG(p)}<figcaption><b>${nameOf(p.id)}</b>${p.clue!=null?`${INC[p.id].clues[p.clue].txt}<br>`:""}${p.obj?`${(OBJS[p.obj]||OBJS.panier).in}, le `:""}${fmtDate(p.t)}</figcaption></figure>`).join("")}</div>`);
}

function status(id,M){
  const f=FOX[id];
  if(R.res[id])return {ok:1,txt:`Au refuge · ${LV_N[lvOf(R.res[id].h)]}`};
  if(WILD[id])return R.met[id]?{ok:1,txt:"Sauvage · vient à la gamelle"}:{ok:0,txt:`Vit dans ${WILD_HINT[WILD[id]]}. Une gamelle de ${BOWLS[WILD[id]].name.toLowerCase()} l'attirera peut-être.`};
  if(STORIES[id])return {ok:0,seen:M.cafe.has(id),txt:"Viendra au refuge pour son histoire."};
  if(M.cafe.has(id))return {ok:0,seen:1,txt:chainDone()?"Croisé au Café. Sers-le bien, il te suivra peut-être.":"Croisé au Café. Il viendra au refuge après les histoires."};
  const guest={zaza:"Printemps",flocon:"Été",noisette:"Automne",comete:"Hiver"}[id];
  if(guest)return (load(CAFEKEY)||{guest:{}}).guest?.[id]?{ok:0,seen:1,txt:"Invité d'honneur du Café. Il viendra au refuge après les histoires."}:{ok:0,txt:`Invité d'honneur du Café : ★★★ sur tout le ${guest}.`};
  return {ok:0,txt:M.old.has(id)?"Déjà croisé dans l'ancienne clairière. Retrouve-le au Café.":"Pas encore venu au Café."};
}
function carnet(){
  const M=metIds(),n=ROSTER.filter(id=>R.res[id]||R.met[id]).length;
  const extra=HWF.filter(f=>R.res[f.id]);
  const card=id=>{const f=FOX[id],s=status(id,M),r=RAR[f.rar];
    return `<button class="card${s.ok?"":" unseen"}" data-fox="${id}" type="button"><div class="pic ${r.cls}">${foxArt(f,{sil:!s.ok&&!s.seen})}</div><h3>${s.ok||s.seen?f.name:"???"}</h3>${R.res[id]?heartsHTML(R.res[id].h):""}<p>${s.txt}</p></button>`};
  openSheet(`<h2>Le carnet du refuge</h2><p class="sub">Le grand portrait : <b>${n} / ${ROSTER.length}</b> renards réunis. Quand tout le monde sera là, on fera une photo de famille.</p><div class="progress"><i style="width:${(n/ROSTER.length*100).toFixed(1)}%"></i></div><div class="grid">${ROSTER.map(card).join("")}${extra.map(f=>card(f.id)).join("")}</div>`);
}
function foxSheet(id){
  const f=FOX[id],r=R.res[id],M=metIds(),s=status(id,M),show=s.ok||s.seen;
  openSheet(`<div class="foxhead"><div class="pic ${RAR[f.rar].cls}">${foxArt(f,{expr:r?"joy":"open",portrait:1,sil:!show})}</div><div><h2>${show?f.name:"???"}</h2><span class="chip ${RAR[f.rar].cls}">${RAR[f.rar].label}</span>${r?`<div class="lvl">${heartsHTML(r.h)} Niv. ${lvOf(r.h)} · ${LV_N[lvOf(r.h)]}</div>`:""}</div></div><p>${show?f.bio:""}</p><p class="sub">${s.txt}${r?" Un câlin par jour fait grandir votre amitié : touche-le dans la clairière.":""}</p>${r?storyHTML(id)+buddyHTML(id):""}<button class="btn ghost close" data-go="carnet" type="button">Retour au carnet</button>`,"carnet");
}

/* ---------- nouvelles au retour ---------- */
// les visites des sauvages pendant ton absence, puis l'arrivée du jour en dialogue
function showNews(){
  const wild=R.news.filter(n=>n.k==="wild"&&!n.live),arr=R.news.filter(n=>n.k==="arr");
  R.news=[];save();
  const next=()=>{if(arr.length){const n=arr.shift();syncFoxes();talk(arrLines(n.id),next)}else renderStory()};
  if(wild.length){
    openSheet(`<h2>Qui est venu ?</h2><p class="sub">Pendant ton absence, ${wild.length>1?"des renards sauvages sont passés":"un renard sauvage est passé"} à la gamelle.</p><div class="pgrid">${wild.map(n=>`<figure class="photo">${photoSVG({id:n.id,t:n.t,clue:n.clue,bowl:R.photos.find(p=>p.t===n.t)?.bowl||WILD[n.id]})}<figcaption><b>${nameOf(n.id)}</b>${n.clue!=null?`Indice ${n.clue+1} sur 5 : ${INC[n.id].clues[n.clue].txt}`:n.first?"Première visite ! Il pourra passer au Café.":fmtDate(n.t)}</figcaption></figure>`).join("")}</div>`);
    afterSheet=next;
  }else next();
}
