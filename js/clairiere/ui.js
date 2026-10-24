/* La Clairière : interface (compteurs, bulles, dialogues, gamelle, carnet, photos). */
function acornSVG(){return `<svg viewBox="0 0 24 24" aria-hidden="true"><g filter="url(#wobble)" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"><path d="M5 10 Q5 21 12 22 Q19 21 19 10Z" fill="#d9a06a"/><path d="M3.5 10.5 Q12 2 20.5 10.5 Q12 13 3.5 10.5Z" fill="#a9785a"/><path d="M12 6 q1 -3 3 -4" fill="none"/></g></svg>`}
const heartsHTML=h=>{const l=lvOf(h);return `<span class="hs5" aria-label="Amitié ${l} sur 5">${"♥".repeat(l)}<i>${"♥".repeat(5-l)}</i></span>`};
function renderHud(){$("glands").textContent=R.glands;drawBowl()}
function log(t){$("log").textContent=t}
let toastT;function toast(t){const el=$("toast");el.textContent=t;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>el.hidden=true,2600)}

/* ---------- gamelle dans la scène ---------- */
const bowlEl=document.createElement("button");bowlEl.className="bowl";bowlEl.type="button";bowlEl.setAttribute("aria-label","La gamelle");
bowlEl.onpointerdown=e=>{e.stopPropagation();bowlSheet()};
// tant qu'un sauvage est venu manger, la gamelle montre encore ce qu'il est venu chercher
function drawBowl(){const v=foxes.find(f=>f.wild&&f.food);
  bowlEl.style.cssText=pc(240,268)+";z-index:269";bowlEl.innerHTML=bowlSVG(v?v.food:R.bowl&&R.bowl.type)}

/* ---------- bulles ---------- */
let bubT;
function bubble(f,txt){const b=document.querySelector(".bubble")||document.createElement("div");b.className="bubble";
  b.innerHTML=`${FOX[f.id].name}<small>${txt}</small>`;b.style.cssText=pc(Math.max(50,Math.min(350,f.x)),f.y-58);$("scene").appendChild(b);clearTimeout(bubT);bubT=setTimeout(()=>b.remove(),2600)}
function tapFox(f){
  if(f.wild){bubble(f,"un renard sauvage, il mange !");return}
  const what=f.walk?"trottine":f.inside?"est à l'intérieur":`${ACT[f.pose]} ${PLACE[f.spot.id]||"dans l'herbe"}`;
  const r=pet(f.id);
  if(r){f.pose="happy";f.until=Date.now()+3000;if(!f.walk)draw(f);bubble(f,r===2?`ronronne : niveau ${lvOf(R.res[f.id].h)}, ${LV_N[lvOf(R.res[f.id].h)]} !`:"adore les câlins (+1 cœur)");if(r===2)setTimeout(storyCheck,2000)}
  else bubble(f,what);
}

/* ---------- boîte de dialogue ---------- */
// portrait à gauche, texte à droite ; on touche pour passer à la réplique suivante
let talkQ=[],talkDone=null;
function talk(lines,done){talkQ=lines.slice();talkDone=done||null;nextLine()}
function nextLine(){const el=$("talk");
  if(!talkQ.length){el.hidden=true;const d=talkDone;talkDone=null;if(d)d();return}
  const [id,expr,txt]=talkQ.shift(),f=FOX[id];
  el.innerHTML=`<div class="pic">${foxArt(f,{expr,portrait:1})}</div><div class="txt"><b>${f.name}</b><span>${txt}</span><small>Touche pour continuer</small></div>`;el.hidden=false}
$("talk").onclick=nextLine;
const INTRO=[
  ["petitpois","joy","Roussette ! Tu es rentrée ! J'ai gardé la maison toute la journée."],
  ["petitpois","shy","Enfin… j'ai surtout dormi sous le porche."],
  ["petitpois","open","Tu sais, des clients du Café aimeraient bien venir ici, le soir. Si tu les sers bien, ils te suivront peut-être."],
  ["petitpois","surprise","Et dans la forêt, il y a des renards sauvages ! Ils sentent la nourriture de très loin. Essaie de remplir la gamelle."]
];
const arrLines=id=>[[id,"joy",`Bonsoir Roussette ! Ton café m'a tellement plu que je t'ai suivie jusqu'ici. Je peux rester ?`],
  ["petitpois","joy",`Bienvenue au refuge, ${FOX[id].name} ! Il y a de la place pour tout le monde.`]];

/* ---------- feuilles ---------- */
let afterSheet=null; // ce qui se passe quand on ferme la feuille (par exemple le dialogue d'arrivée)
function openSheet(h){$("sheet-in").innerHTML=h+`<button class="btn ghost close" data-close type="button">Fermer</button>`;$("sheet").hidden=false;$("sheet-in").scrollTop=0}
function closeSheet(){$("sheet").hidden=true;const d=afterSheet;afterSheet=null;if(d)d()}
$("sheet").onclick=e=>{if(e.target.id==="sheet"||e.target.closest("[data-close]"))return closeSheet();
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.buy)buyBowl(b.dataset.buy);
  else if(b.dataset.fox)foxSheet(b.dataset.fox);
  else if(b.dataset.go==="carnet")carnet();else if(b.dataset.go==="photos")photos()};

function hoursLeft(){if(!R.bowl)return "";const h=(R.bowl.until-Date.now())/36e5;return h>=1?`encore ${Math.round(h)} h`:"presque vide"}
function bowlSheet(){
  const cur=R.bowl?`<p class="sub">Dans la gamelle : <b>${BOWLS[R.bowl.type].name}</b>, ${hoursLeft()}. En remplir une autre remplace ce qu'il y a dedans.</p>`:`<p class="sub">La gamelle est vide.</p>`;
  openSheet(`<h2>La gamelle</h2>${cur}${Object.entries(BOWLS).map(([k,B])=>`<div class="opt"><span class="thumb">${bowlSVG(k)}</span><div class="txt"><strong>${B.name}</strong><span>${B.desc} Dure ${B.hours} h.</span></div><button class="btn" data-buy="${k}" type="button" ${R.glands<B.price?"disabled":""}>${B.price?`${acornSVG()} ${B.price}`:"Gratuit"}</button></div>`).join("")}<p class="sub">Un sauvage passe souvent quand tu n'es pas là. Il laisse une photo de lui en train de manger : c'est la seule trace de son passage.</p>`);
}
function buyBowl(k){const B=BOWLS[k];if(R.glands<B.price)return;
  R.glands-=B.price;R.bowl={type:k,until:Date.now()+B.hours*36e5};save();renderHud();closeSheet();
  log(k==="croquettes"?"La gamelle est pleine de croquettes.":`${B.name} dans la gamelle. Qui va venir ?`)}

function photoSVG(p){const f=FOX[p.id];
  return `<svg viewBox="0 0 120 100" aria-hidden="true"><rect width="120" height="100" fill="#cfe3a8"/><path d="M0 34 Q30 26 60 32 Q90 26 120 34 V0 H0Z" fill="#8dbd86"/><g transform="translate(18 10) scale(.7)">${foxArt(f,{pose:"eat"}).replace(/^<svg[^>]*>|<\/svg>$/g,"")}</g><g transform="translate(36 63) scale(1.2)">${bowlSVG(p.bowl).replace(/^<svg[^>]*>|<\/svg>$/g,"")}</g></svg>`}
const fmtDate=t=>new Date(t).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})+" à "+new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
function photos(){
  const ps=R.photos.slice().reverse();
  openSheet(`<h2>Photos de la gamelle</h2><p class="sub">${ps.length?`${ps.length} visite${ps.length>1?"s":""} de renards sauvages.`:"Aucune visite pour l'instant. Remplis la gamelle de baies, de poisson ou de miel."}</p><div class="pgrid">${ps.map(p=>`<figure class="photo">${photoSVG(p)}<figcaption><b>${FOX[p.id].name}</b>${fmtDate(p.t)}</figcaption></figure>`).join("")}</div>`);
}

function status(id,M){
  const f=FOX[id];
  if(R.res[id])return {ok:1,txt:`Au refuge · ${LV_N[lvOf(R.res[id].h)]}`};
  if(WILD[id])return R.met[id]?{ok:1,txt:"Sauvage · vient à la gamelle"}:{ok:0,txt:`Vit dans ${WILD_HINT[WILD[id]]}. Une gamelle de ${BOWLS[WILD[id]].name.toLowerCase()} l'attirera peut-être.`};
  if(M.cafe.has(id))return {ok:0,seen:1,txt:"Croisé au Café. Sers-le bien, il te suivra peut-être."};
  const guest={zaza:"Printemps",flocon:"Été",noisette:"Automne",comete:"Hiver"}[id];
  if(guest)return {ok:0,txt:`Invité d'honneur du Café : ★★★ sur tout le ${guest}.`};
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
  openSheet(`<div class="foxhead"><div class="pic ${RAR[f.rar].cls}">${foxArt(f,{expr:r?"joy":"open",portrait:1,sil:!show})}</div><div><h2>${show?f.name:"???"}</h2><span class="chip ${RAR[f.rar].cls}">${RAR[f.rar].label}</span>${r?`<div class="lvl">${heartsHTML(r.h)} Niv. ${lvOf(r.h)} · ${LV_N[lvOf(r.h)]}</div>`:""}</div></div><p>${show?f.bio:""}</p><p class="sub">${s.txt}${r?" Un câlin par jour fait grandir votre amitié : touche-le dans la clairière.":""}</p>${r?storyHTML(id):""}<button class="btn ghost close" data-go="carnet" type="button">Retour au carnet</button>`);
}

/* ---------- nouvelles au retour ---------- */
// les visites des sauvages pendant ton absence, puis l'arrivée du jour en dialogue
function showNews(){
  const wild=R.news.filter(n=>n.k==="wild"&&!n.live),arr=R.news.filter(n=>n.k==="arr");
  R.news=[];save();
  const next=()=>{if(arr.length){const n=arr.shift();syncFoxes();talk(n.say&&GUEST_LINES[n.say]||arrLines(n.id),next)}else storyCheck()};
  if(wild.length){
    openSheet(`<h2>Qui est venu ?</h2><p class="sub">Pendant ton absence, ${wild.length>1?"des renards sauvages sont passés":"un renard sauvage est passé"} à la gamelle.</p><div class="pgrid">${wild.map(n=>`<figure class="photo">${photoSVG({id:n.id,bowl:R.photos.find(p=>p.t===n.t)?.bowl||WILD[n.id]})}<figcaption><b>${FOX[n.id].name}</b>${n.first?"Première visite ! Il pourra passer au Café.":fmtDate(n.t)}</figcaption></figure>`).join("")}</div>`);
    afterSheet=next;
  }else next();
}
