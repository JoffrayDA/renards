/* La Clairière : l'appareil photo et l'album (01/11/2026, retours de Joffray : toucher le renard dans un objet pour la photo
   n'était pas clair, les photos de nuit montraient le plein soleil, celle de la cabane cachait les yeux derrière la barrière,
   la balançoire ne ressemblait pas à celle du jeu, et 30 photos en vrac, « c'est une galère »).
   On touche l'appareil (en haut à droite de la scène, dehors comme dans la maison), puis un renard. La photo est un cadrage de la
   vraie scène, redessinée à l'heure de la prise (nuit, pluie, neige de Noël). Une photo par renard et par pose (objet, déco ou
   simple pose) : la nouvelle remplace l'ancienne. L'album range les photos par renard ; les visites de la gamelle y restent toutes.
   Une photo : {id, t, h (l'heure affichée), at:"out"|"home", x, y, pose, f (en miroir), w (taille du renard dans la maison), wet, obj?, deco?:{k,x,y,f}}. */
let shooting=false;
const camEl=document.createElement("button");camEl.className="cam";camEl.type="button";camEl.setAttribute("aria-label","Appareil photo");
camEl.innerHTML=`<svg viewBox="0 0 32 28" aria-hidden="true"><g stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"><path d="M10 6 L12 2.5 H20 L22 6 H27 Q30 6 30 9 V23 Q30 26 27 26 H5 Q2 26 2 23 V9 Q2 6 5 6Z" fill="#f6a5b4"/><circle cx="16" cy="15.5" r="6.4" fill="#fffaf2"/><circle cx="16" cy="15.5" r="3.2" fill="#9ec3ef"/></g><circle cx="14.6" cy="14" r="1.1" fill="#fff"/><circle cx="25.5" cy="10" r="1.5" fill="#fff6c8" stroke="${INK}" stroke-width="1.2"/></svg>`;
camEl.onpointerdown=e=>{e.stopPropagation();camMode(!shooting)};
$("scene").appendChild(camEl);
function camMode(on){shooting=on;$("scene").classList.toggle("shooting",on);camEl.classList.toggle("on",on);if(on)toast("Touche un renard pour le prendre en photo.")}

// la pose photographiée : une par renard et par clé (les visites de la gamelle gardent chacune leur photo)
const dkey=p=>p.deco&&(p.deco.k||p.deco),pkey=p=>p.bowl?null:p.obj||(p.deco&&p.at+":"+dkey(p))||p.at+":"+p.pose;
function keepShot(p,host){const k=pkey(p),old=R.photos.findIndex(q=>q.id===p.id&&!q.bowl&&pkey({at:"out",...q})===k);
  if(old>=0)R.photos.splice(old,1);R.photos.push(p);save();camMode(false);
  const fl=document.createElement("div");fl.className="snapflash";host.appendChild(fl);setTimeout(()=>fl.remove(),700);
  toast(`Clic ! ${old>=0?"Nouvelle photo de":"Une photo de"} ${FOX[p.id].name}, rangée dans son dossier.`)}
// dehors : le renard tel qu'on le voit, dans son objet ou sur sa déco
function shootFox(f){
  if(f.wild){bubble(f,"trop farouche pour une photo… Regarde l'album : la gamelle le photographie.");return}
  if(f.walk){bubble(f,"bouge trop ! Attends qu'il s'arrête.");return}
  const sp=f.spot||{},p={id:f.id,t:Date.now(),h:hourNow(),at:"out",x:Math.round(f.x),y:Math.round(f.y),pose:f.pose,f:f.el.classList.contains("left")?1:0,wet:scn.rain?1:0};
  if(sp.obj)p.obj=sp.obj;
  if(sp.deco){const d=R.deco.out.find(d=>"dc"+d.u===sp.id);if(d)p.deco={k:d.k,x:d.x,y:d.y,f:d.f?1:0}}
  keepShot(p,$("scene"))}
// dans la maison : un renard sur un objet de Copeau, sur une déco, ou près du feu
function shootHome(p){keepShot({t:Date.now(),h:hourNow(),at:"home",wet:scn.rain?1:0,...p},houseEl)}

/* ---------- le dessin d'une photo ---------- */
// cadrage (largeur, décalage vertical du centre) autour du renard ; 6 × 5
const SHOT={cabane:[150,-36],balancoire:[170,-62],panier:[120,-18],feuilles:[120,-16]};
let shotN=0;const bgCache=new Map();
// le décor à l'heure de la photo : on le redessine comme s'il était cette heure-là (shotAt, lu par hourNow et noelDay)
const atTime=(p,f)=>{shotAt=p;try{return f()}finally{shotAt=null}};
function shotBack(p){const key=[p.at,p.h,atTime(p,phaseNow),p.wet,atTime(p,noelOn)].join();
  if(!bgCache.has(key)){const rain=scn.rain;scn.rain=!!p.wet;
    try{bgCache.set(key,atTime(p,p.at==="home"?houseSVG:bgSVG))}finally{scn.rain=rain}}
  return bgCache.get(key)}
// un renard (ou un objet avec son renard) à sa taille dans la scène : même boîte que .fox (13,5 % de large, ancré à 93 %)
const atFox=(svg,x,y,flip,w=54)=>{const h=w*116/120,inner=svg.replace(/^<svg[^>]*>|<\/svg>$/g,"").replace(/<animate[^>]*\/>/g,"");
  const box=`<svg x="${f1(x-w/2)}" y="${f1(y-h*.93)}" width="${w}" height="${f1(h)}" viewBox="0 -16 120 116" overflow="visible">${inner}</svg>`;
  return flip?`<g transform="translate(${2*x} 0) scale(-1 1)">${box}</g>`:box};
const atDeco=(d,part)=>{const o=DECO[d.k],k=o.w/100,h=o.h*k,L=`stroke="${INK}" stroke-width="${dLw(o.w)}" stroke-linejoin="round" stroke-linecap="round"`;
  const box=`<svg x="${f1(d.x-o.w/2)}" y="${f1(d.y-h)}" width="${o.w}" height="${f1(h)}" viewBox="-50 -${o.h} 100 ${o.h}" overflow="visible">${o[part](L)}</svg>`;
  return d.f?`<g transform="translate(${2*d.x} 0) scale(-1 1)">${box}</g>`:box};
// les anciennes photos ({id, obj, t} ou {id, deco, t}) retrouvent leur place
function shotOf(p){if(p.at)return p;
  if(OBJS[p.obj]){const sp=OBJS[p.obj].spot;return {...p,at:"out",x:sp.x,y:sp.y,pose:OBJS[p.obj].pose}}
  if(HOBJ[p.obj])return {...p,at:"home"};
  if(p.deco&&DECO[p.deco]){const o=DECO[p.deco],home=!!o.home,d=(home?R.deco.home:R.deco.out).find(d=>d.k===p.deco);if(!d||!o.seat)return null;
    return {...p,at:home?"home":"out",x:d.x+(d.f?-o.seat.dx:o.seat.dx),y:d.y+o.seat.dy,pose:o.seat.poses[0],deco:{k:d.k,x:d.x,y:d.y,f:d.f?1:0}}}
  return null}
function shotSVG(p){const s=shotOf(p);if(!s)return p.deco&&DECO[p.deco]?decoPhoto(p):wildPhoto(p,FOX[p.id]);
  const home=s.at==="home",H0=H;let vw,cx,cy,fox;
  if(home&&HOBJ[s.obj]){const [x,y,k]=HOBJ[s.obj].at;vw=200*k;cx=x+100*k;cy=y+80*k;fox=`<g transform="${hPlace(s.obj)}">${HOBJ[s.obj].art(s.id)}</g>`}
  else{const [w,dy]=SHOT[s.obj]||[120,-24];vw=w;cx=s.x;cy=s.y+dy;
    const art=s.obj&&OBJS[s.obj]?OBJS[s.obj].svg(s.id):foxArt(FOX[s.id],{pose:s.pose});
    fox=(s.deco?atDeco(s.deco,"art"):"")+atFox(art,s.x,s.y,s.f,s.w||54)+(s.deco&&DECO[s.deco.k].front?atDeco(s.deco,"front"):"")}
  const vh=vw*5/6,vx=Math.max(0,Math.min(400-vw,cx-vw/2)),vy=Math.max(0,Math.min(H0-vh,cy-vh/2)),pre=`s${++shotN}`;
  const ph=PH[atTime(s,phaseNow)];
  let fx="";
  if(!home){fx+=`<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="${ph.tint}" opacity="${ph.a}"/>`;
    const r=rng(s.t%2147483646+1),snow=atTime(s,noelOn);
    if(snow)fx+=Array.from({length:s.wet?40:14},()=>`<circle cx="${f1(vx+r()*vw)}" cy="${f1(vy+r()*vh)}" r="${f1(.8+r()*1.4)}" fill="#fff" opacity=".9"/>`).join("");
    else if(s.wet)fx+=`<g stroke="#dfeaf6" stroke-width="1.2" stroke-linecap="round" opacity=".8">${Array.from({length:22},()=>{const x=vx+r()*vw,y=vy+r()*vh;return `<path d="M${f1(x)} ${f1(y)} l-2 7"/>`}).join("")}</g>`}
  // chaque photo a ses propres dégradés (sinon une photo de nuit reprendrait le ciel de jour d'une autre)
  const svg=(shotBack(s)+fox).replace(/id="/g,`id="${pre}`).replace(/url\(#(?!wobble)/g,`url(#${pre}`).replace(/href="#/g,`href="#${pre}`);
  return `<svg viewBox="${f1(vx)} ${f1(vy)} ${f1(vw)} ${f1(vh)}" aria-hidden="true">${svg}${fx}</svg>`}

/* ---------- l'album, rangé par renard ---------- */
const pcap=p=>`${p.clue!=null&&INC[p.id]?`${INC[p.id].clues[p.clue].txt}<br>`:""}${p.bowl!==undefined&&!p.obj&&!p.deco?"À la gamelle, le ":p.obj?`${(HOBJ[p.obj]||OBJS[p.obj]||OBJS.panier).in}, le `:DECO[dkey(p)]?`${DECO[dkey(p)].name}, le `:p.pose?`${ACT[p.pose]?ACT[p.pose][0].toUpperCase()+ACT[p.pose].slice(1):"Pose"}, le `:""}${fmtDate(p.t)}`;
function photos(){bgCache.clear();
  const by={};for(const p of R.photos){if(INC[p.id]&&!incOf(p.id).found)continue;(by[p.id]=by[p.id]||[]).push(p)}
  const ids=Object.keys(by).sort((a,b)=>Math.max(...by[b].map(p=>p.t))-Math.max(...by[a].map(p=>p.t)));
  const n=R.photos.length;
  openSheet(`<h2>Album photos</h2><p class="sub">${n?`${n} photo${n>1?"s":""}. Touche l'appareil photo dans la scène, puis un renard.`:"Aucune photo pour l'instant. Touche l'appareil photo dans la scène, puis un renard. La gamelle prend aussi des photos de ses visiteurs."}</p>${incoCards()}${ids.length?`<h3 class="sec">Par renard</h3><div class="grid">${ids.map(id=>`<button class="card" data-pfold="${id}" type="button"><div class="pic ${RAR[FOX[id].rar].cls}">${foxArt(FOX[id],{expr:"joy",portrait:1})}</div><h3>${FOX[id].name}</h3><p>${by[id].length} photo${by[id].length>1?"s":""}</p></button>`).join("")}</div>`:""}`);
}
function photoFolder(id){bgCache.clear();
  const ps=R.photos.filter(p=>p.id===id).sort((a,b)=>b.t-a.t);
  openSheet(`<h2>${FOX[id].name}</h2><p class="sub">${ps.length} photo${ps.length>1?"s":""}. Une par pose : en reprendre une remplace l'ancienne.</p><div class="pgrid">${ps.map(p=>`<figure class="photo">${photoSVG(p)}<figcaption>${pcap(p)}</figcaption></figure>`).join("")}</div>`,"photos");
}
