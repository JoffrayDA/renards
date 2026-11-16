/* La Clairière : trois écrans qu'on fait glisser (16/11/2026, Joffray : « la première page de dehors, il y en a trop…
   à droite, c'est terrain de jeu, et encore à droite, c'est potager »).
   - le jardin : l'écran de toujours (le tunnel et le potager le quittent) ;
   - le terrain de jeu : de gros jeux où plusieurs renards jouent ensemble, payés en clochettes (R.jeux) ;
     toucher un jeu le relance (plus vite, plus haut) et fait un câlin à ceux qui jouent ;
   - le potager : six parcelles (R.pot) ; on plante (glands), on arrose, on récolte. Les baies et le miel remplissent
     la gamelle (ui.js), la camomille part au Café en Tisane calmante (b.gift, bourse.js).
   Les deux écrans sont des calques par-dessus la scène, comme la maison (maison.js) ; flèches sur les bords ou glisser du doigt. */
const zAu={tourniquet:"au tourniquet",toboggan:"au toboggan",bascule:"à la bascule",trampoline:"au trampoline"};
const ZONES=["jardin","jeux","potager"],ZNAME={jardin:"Jardin",jeux:"Terrain de jeu",potager:"Potager"};
let zoneEl=null,zone="jardin",zoneRaf=0;
R.jeux=R.jeux||{};
R.pot=R.pot||{p:[null,null,null,null,null,null],baies:0,miel:0};
const zFox=(id,pose,w,o={})=>foxAt(id,0,0,w,{pose,...o}).replace(/ filter="url\(#wobble\)"/g,"");
const zL=(w=2.6)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const zRows=()=>({a:300+Math.round((H-480)*.15),b:Math.max(410,H-120)});
// les renards du jour sur le terrain (d'autres têtes chaque jour), seulement ceux du refuge
function zoneIds(salt){const t=today()+salt;return Object.keys(R.res).filter(id=>FOX[id]&&id!=="roussette"&&!(typeof noelAway==="function"&&noelAway(id)))
  .sort((a,b)=>i0(a+t)%101-i0(b+t)%101)}

/* ---------- le décor commun : ciel à l'heure réelle, collines, rangée d'arbres, pré, barrière ---------- */
function zTree(x,y,r,c){return `<path d="M${x-4} ${y} V${y-r*.9} H${x+4} V${y}Z" fill="#9a6a48" ${zL(2)}/><circle cx="${x-r*.5}" cy="${y-r}" r="${r*.7}" fill="${c}" ${zL(2.2)}/><circle cx="${x+r*.5}" cy="${y-r*1.05}" r="${r*.72}" fill="${c}" ${zL(2.2)}/><circle cx="${x}" cy="${y-r*1.55}" r="${r*.8}" fill="${c}" ${zL(2.2)}/><circle cx="${x-r*.2}" cy="${y-r*1.75}" r="${r*.25}" fill="#fff" opacity=".25"/>`}
function zoneBg(id,ground){const ph=phaseNow(),P=PH[ph],night=ph==="nuit",r=rng(i0(id)+7),G=ground||["#b4d48f","#d2e7ad"];
  let s=`<defs><linearGradient id="${id}S" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset="1" stop-color="${P.sky[1]}"/></linearGradient>
  <linearGradient id="${id}G" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${G[0]}"/><stop offset="1" stop-color="${G[1]}"/></linearGradient>
  <radialGradient id="${id}V" cx=".5" cy=".5" r=".75"><stop offset=".62" stop-color="#3d2a35" stop-opacity="0"/><stop offset="1" stop-color="#3d2a35" stop-opacity=".2"/></radialGradient></defs>
  <rect width="400" height="${H}" fill="url(#${id}S)"/>`;
  if(night)for(let i=0;i<24;i++)s+=`<circle cx="${(r()*400).toFixed(0)}" cy="${(r()*90).toFixed(0)}" r="${(.6+r()*1.2).toFixed(1)}" fill="#fff" opacity="${(.4+r()*.5).toFixed(2)}"/>`;
  else s+=`<g fill="#fff" opacity=".85">${[[70,46,1],[300,30,.8]].map(([x,y,k])=>`<ellipse cx="${x}" cy="${y}" rx="${30*k}" ry="${11*k}"/><ellipse cx="${x+18*k}" cy="${y-6*k}" rx="${18*k}" ry="${10*k}"/>`).join("")}</g>`;
  s+=`<path d="M0 118 Q60 82 130 102 Q200 68 270 98 Q340 78 400 100 V170 H0Z" fill="${night?"#5d6f9a":"#b7cfc4"}"/>
  <g filter="url(#wobble)">${[[14,150,20,"#8cc18a"],[50,146,24,"#9fcd95"],[92,150,18,"#82b07f"],[300,148,22,"#9fcd95"],[340,150,26,"#8cc18a"],[384,146,20,"#82b07f"],[150,150,14,"#a6cc9c"],[250,150,15,"#a6cc9c"]].map(a=>zTree(...a)).join("")}</g>
  <path d="M0 152 Q200 138 400 152 V${H} H0Z" fill="url(#${id}G)"/>`;
  // la barrière du fond
  s+=`<g filter="url(#wobble)"><path d="M-4 160 Q200 146 404 160" fill="none" stroke="#c99a6a" stroke-width="5"/><path d="M-4 172 Q200 158 404 172" fill="none" stroke="#c99a6a" stroke-width="5"/>
    ${Array.from({length:17},(_,i)=>{const x=i*25,y=150-Math.sin(i/16*Math.PI)*12;return `<path d="M${x-4} ${y+30} V${y+4} L${x} ${y-2} L${x+4} ${y+4} V${y+30}Z" fill="#e3b583" ${zL(2)}/>`}).join("")}</g>`;
  for(let i=0;i<34;i++){const x=r()*400,y=190+r()*(H-200);s+=`<path d="M${(x-4).toFixed(0)} ${y.toFixed(0)} q2 -7 4 0 q2 -8 4 0" fill="none" stroke="#8fbf74" stroke-width="2" stroke-linecap="round"/>`}
  for(let i=0;i<10;i++){const x=r()*400,y=190+r()*(H-200),c=["#f6b8c4","#fffaf2","#f2d27a","#c9a8ec"][i%4];s+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="3" fill="${c}" stroke="${INK}" stroke-width="1.2"/>`}
  return s}
// la nuit, la pluie et le voile de l'heure, par-dessus tout ; quelques lampions la nuit
function zoneOver(id){const ph=phaseNow(),P=PH[ph],wet=scn.rain;
  let s=`<rect width="400" height="${H}" fill="${P.tint}" opacity="${P.a}" pointer-events="none"/><rect width="400" height="${H}" fill="url(#${id}V)" pointer-events="none"/>`;
  if(dark())s+=`<g pointer-events="none"><path d="M-4 178 Q100 206 200 184 Q300 206 404 178" fill="none" stroke="${INK}" stroke-width="1.6"/>${[40,96,150,250,304,360].map((x,i)=>{const y=186+Math.sin(i*1.7)*6+6;return `<circle cx="${x}" cy="${y}" r="16" fill="#ffd77a" opacity=".22"/><circle cx="${x}" cy="${y}" r="5" fill="${["#ffd77a","#f6a5b4","#9fd0f0"][i%3]}" stroke="${INK}" stroke-width="1.4"/>`}).join("")}</g>`;
  if(wet)s+=`<g class="zrain" pointer-events="none" stroke="#dbe9f6" stroke-width="1.6" stroke-linecap="round" opacity=".75">${Array.from({length:60},(_,i)=>{const x=(i*53)%420-10,y=(i*97)%H;return `<path d="M${x} ${y} l-5 14" style="animation-delay:-${(i%9)/9}s"/>`}).join("")}</g>`;
  return s}

/* ---------- aller d'un écran à l'autre ---------- */
function zoneNav(){const i=ZONES.indexOf(zone),l=ZONES[i-1],r=ZONES[i+1];
  return (l?`<button class="znav zl" data-zgo="${l}" type="button" aria-label="${ZNAME[l]}"><span>‹</span><small>${ZNAME[l]}</small></button>`:"")
    +(r?`<button class="znav zr" data-zgo="${r}" type="button" aria-label="${ZNAME[r]}"><small>${ZNAME[r]}</small><span>›</span></button>`:"")}
function stopZone(){cancelAnimationFrame(zoneRaf);zoneRaf=0}
function goZone(z){if(z===zone||!ZONES.includes(z))return;const from=ZONES.indexOf(zone),to=ZONES.indexOf(z),fwd=to>from;
  stopZone();const old=zoneEl;zoneEl=null;zone=z;
  if(old){old.classList.add(fwd?"outL":"outR");old.style.pointerEvents="none";setTimeout(()=>old.remove(),320)}
  bip("whoosh");drawZoneTab();
  if(z==="jardin")return;
  zoneEl=document.createElement("div");zoneEl.className=`play zone z-${z} ${fwd?"fromR":"fromL"}`;
  $("scene").appendChild(zoneEl);
  if(z==="jeux")renderJeux();else renderPotager();
  ppTip(z==="jeux"?"terrain":"potager")}
const leaveZone=()=>goZone("jardin");
// la languette du jardin vers le terrain de jeu, sur le bord droit de la scène
function drawZoneTab(){let t=$("ztab");if(!t){t=document.createElement("button");t.id="ztab";t.type="button";t.className="znav zr";t.setAttribute("aria-label",ZNAME.jeux);
    t.innerHTML=`<small>${ZNAME.jeux}</small><span>›</span>`;t.onclick=e=>{e.stopPropagation();goZone("jeux")};$("scene").appendChild(t)}
  t.hidden=zone!=="jardin"}
function zoneClick(e){const n=e.target.closest("[data-zgo]");if(n){e.stopPropagation();goZone(n.dataset.zgo);return true}return false}
// glisser du doigt : vers la gauche = l'écran de droite
{let sw=null;const sc=$("scene");
  sc.addEventListener("pointerdown",e=>{sw=[e.clientX,e.clientY,Date.now()]},true);
  sc.addEventListener("pointerup",e=>{if(!sw)return;const [x,y,t]=sw;sw=null;const dx=e.clientX-x,dy=e.clientY-y;
    if(Date.now()-t>800||Math.abs(dx)<60||Math.abs(dy)>Math.abs(dx)*.7)return;
    if(gameOn||decoMode||shooting||houseEl||!$("talk").hidden||!$("sheet").hidden)return;
    goZone(ZONES[Math.max(0,Math.min(ZONES.length-1,ZONES.indexOf(zone)+(dx<0?1:-1)))])},true);
  sc.addEventListener("pointercancel",()=>{sw=null},true)}

/* ---------- le terrain de jeu ---------- */
const JEUX={
  tourniquet:{name:"Tourniquet",b:200,n:4,desc:"Un grand rond qui tourne, avec des barres pour se tenir. Trois renards dessus, un qui pousse. Touche-le : plus vite !"},
  toboggan:{name:"Toboggan",b:150,n:3,desc:"Une échelle, une plateforme et une grande glissade. Ils font la queue, glissent, et recommencent."},
  bascule:{name:"Bascule",b:80,n:2,desc:"Une planche sur un rondin, un renard à chaque bout. Touche-la pour qu'ils montent plus haut."},
  trampoline:{name:"Trampoline",b:120,n:1,desc:"Il rebondit, il rebondit… Touche-le : salto !"}
};
const jeuAt=()=>{const {a,b}=zRows();return{toboggan:[52,a],tourniquet:[292,a],bascule:[112,b],trampoline:[296,b]}};
// dessins sans renard, pour la boutique et les jeux construits
const JART={
  tourniquet:(cx,cy,th=.5)=>{const RX=66,RY=21,C=["#f6a5b4","#9fd0f0","#f2d27a","#a9d68f"];
    return `<ellipse cx="${cx}" cy="${cy+16}" rx="80" ry="15" fill="#3d2a35" opacity=".15"/><path d="M${cx-RX} ${cy} V${cy+9} A${RX} ${RY} 0 0 0 ${cx+RX} ${cy+9} V${cy}Z" fill="#c98a5a" ${zL()}/>
    <g class="zj-twedge">${C.map((c,i)=>tWedge(cx,cy,RX,RY,th+i*Math.PI/2,c)).join("")}</g><ellipse cx="${cx}" cy="${cy}" rx="${RX}" ry="${RY}" fill="none" ${zL()}/>`},
  tourniquetTop:(cx,cy)=>`<path d="M${cx-5} ${cy} V${cy-50} H${cx+5} V${cy}Z" fill="#e0855c" ${zL(2.2)}/><circle cx="${cx}" cy="${cy-53}" r="8" fill="#f2d27a" ${zL(2.2)}/>`,
  toboggan:(x0,y)=>{const yT=y-112,P=`M${x0+28} ${yT+4} C${x0+80} ${yT+8} ${x0+92} ${y-14} ${x0+150} ${y-4}`;
    return `<ellipse cx="${x0+70}" cy="${y+4}" rx="96" ry="12" fill="#3d2a35" opacity=".14"/>
    <path d="M${x0-12} ${y} V${yT-18} M${x0+12} ${y} V${yT-18}" ${zL(7)}/><path d="M${x0-12} ${y} V${yT-18} M${x0+12} ${y} V${yT-18}" stroke="#e8b884" stroke-width="3.6" stroke-linecap="round"/>
    ${Array.from({length:6},(_,i)=>{const yy=y-12-i*19;return `<path d="M${x0-12} ${yy} H${x0+12}" ${zL(5)}/><path d="M${x0-11} ${yy} H${x0+11}" stroke="#e8b884" stroke-width="2.2"/>`}).join("")}
    <path d="M${x0+28} ${yT+4} V${y}" ${zL(6)}/><path d="M${x0+28} ${yT+4} V${y}" stroke="#9fd0f0" stroke-width="2.6"/>
    <rect x="${x0-16}" y="${yT-4}" width="${48}" height="10" rx="3" fill="#e0855c" ${zL(2.4)}/>
    <path d="${P}" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="${P}" fill="none" stroke="#f6a5b4" stroke-width="16" stroke-linecap="round"/><path d="${P}" fill="none" stroke="#fbd3db" stroke-width="5" stroke-linecap="round" transform="translate(0 -4)"/>`},
  bascule:(cx,cy,ang=0)=>`<ellipse cx="${cx}" cy="${cy+4}" rx="100" ry="11" fill="#3d2a35" opacity=".14"/>
    <g class="zj-splank" transform="rotate(${ang} ${cx} ${cy-24})"><rect x="${cx-98}" y="${cy-31}" width="196" height="10" rx="4" fill="#e8b884" ${zL(2.4)}/>${[-82,82].map(d=>`<path d="M${cx+d-6} ${cy-31} V${cy-40} H${cx+d+6} V${cy-31}" fill="none" ${zL(2.6)}/>`).join("")}</g>
    <path d="M${cx-20} ${cy+2} L${cx} ${cy-26} L${cx+20} ${cy+2}Z" fill="#c98a5a" ${zL(2.4)}/><circle cx="${cx}" cy="${cy-24}" r="4" fill="#f2d27a" ${zL(1.8)}/>`,
  trampoline:(cx,cy,dip=0)=>`<ellipse cx="${cx}" cy="${cy+4}" rx="62" ry="10" fill="#3d2a35" opacity=".14"/>
    ${[-40,-14,14,40].map(d=>`<path d="M${cx+d} ${cy-22} L${cx+d*1.08} ${cy+2}" ${zL(4)}/>`).join("")}
    <ellipse cx="${cx}" cy="${cy-24}" rx="56" ry="16" fill="#9fd0f0" ${zL(2.6)}/><ellipse class="zj-tmat" cx="${cx}" cy="${cy-24+dip}" rx="44" ry="${10+dip/2}" fill="#4a3a5a"/>
    <ellipse cx="${cx}" cy="${cy-24}" rx="56" ry="16" fill="none" stroke="#c9e6f6" stroke-width="2" stroke-dasharray="4 5" opacity=".9"/>`
};
function tWedge(cx,cy,RX,RY,a0,c){const a1=a0+Math.PI/2,p=a=>`${(cx+RX*Math.cos(a)).toFixed(1)} ${(cy+RY*Math.sin(a)).toFixed(1)}`;
  return `<path d="M${cx} ${cy} L${p(a0)} A${RX} ${RY} 0 0 1 ${p(a1)}Z" fill="${c}" stroke="${INK}" stroke-width="1.6"/>`}
function jeuPic(k){const v={tourniquet:"214 236 172 104",toboggan:"30 172 200 140",bascule:"8 336 208 90",trampoline:"230 350 132 70"}[k];
  const at={toboggan:[58,300],tourniquet:[300,300],bascule:[112,410],trampoline:[296,410]}[k];
  return `<svg viewBox="${v}" aria-hidden="true"><g filter="url(#wobble)">${JART[k](...at)}${k==="tourniquet"?JART.tourniquetTop(...at):""}</g></svg>`}
function jeuxSheet(){
  openSheet(`<h2>Terrain de jeu</h2><div class="wallet"><span>${bellSVG} ${bellsN()}</span></div><div class="dgrid">${Object.entries(JEUX).map(([k,o])=>dTile(" rare",jeuPic(k),o.name,o.desc,`${o.n} renard${o.n>1?"s":""}`,
    `<button class="btn" data-jeu="${k}" type="button" ${R.jeux[k]||bellsN()<o.b?"disabled":""}>${R.jeux[k]?"Construit":`${bellSVG} ${o.b}`}</button>`)).join("")}
    ${dTile("",OBJS.tunnel.svg().replace('viewBox="0 -16 120 116"',`viewBox="${OBJS.tunnel.thumb}"`),OBJS.tunnel.name,OBJS.tunnel.desc,"1 renard",`<button class="btn" data-obj="tunnel" type="button" ${R.obj.tunnel||R.glands<OBJS.tunnel.price?"disabled":""}>${R.obj.tunnel?"Posé":`${acornSVG()} ${OBJS.tunnel.price}`}</button>`)}</div>`)}
function buyJeu(k){const o=JEUX[k];if(R.jeux[k]||bellsN()<o.b)return;addBells(-o.b);R.jeux[k]=1;save();bip("buy");closeSheet();
  if(zone==="jeux")renderJeux();toast(`${o.name} : Copeau l'a monté ! Les renards accourent.`)}

function renderJeux(){if(!zoneEl)return;stopZone();
  const {a,b}=zRows(),AT=jeuAt(),ph=phaseNow(),play=!scn.rain&&ph!=="nuit",ids=zoneIds("jeux");let j=0;
  const take=n=>{const r=ids.slice(j,j+n);j+=r.length;return r};
  zoneEl.innerHTML=`<svg viewBox="0 0 400 ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${zoneBg("zj",["#c2dc96","#d9eab4"])}
    <ellipse cx="200" cy="${(a+b)/2}" rx="210" ry="${(b-a)/2+70}" fill="#efdcb4" opacity=".55"/><g id="zbox"></g>${zoneOver("zj")}</svg>
    ${zoneNav()}<button class="btn ghost zbuild" type="button">Construire</button>${!play?`<div class="psay low">${scn.rain?"Il pleut : tout le monde est à l'abri.":"La nuit, le terrain de jeu dort."}</div>`:""}`;
  const box=zoneEl.querySelector("#zbox"),ups=[];
  zoneEl.onpointerdown=e=>{if(zoneClick(e))return;
    if(e.target.closest(".zbuild")){e.stopPropagation();jeuxSheet();return}
    const s=e.target.closest("[data-z]");if(!s)return;e.stopPropagation();const k=s.dataset.z;
    if(!R.jeux[k]&&JEUX[k]){jeuxSheet();return}
    if(k==="tunnel"){toast(play?"Frrt ! Quelqu'un traverse le tunnel.":"Le tunnel est vide… enfin, on croit.");return}
    const u=ups.find(x=>x.k===k);if(!u||!play){bip("tap");toast(scn.rain?"Il pleut : on jouera tout à l'heure.":"Chut, on joue demain matin.");return}
    u.tap();const r=u.ids.map(pet).some(Boolean);bip(r?"purr":"pop");if(r){renderHud();toast(`Rires ${zAu[k]} : +1 cœur chacun !`)}};
  // le tunnel en glands : au fond, contre la barrière
  if(R.obj.tunnel){const id=play?take(1)[0]:null,w=74;grp(box,`<g data-z="tunnel">`+OBJS.tunnel.svg(id).replace(/^<svg/,`<svg x="${200-w/2}" y="${222-w*.97}" width="${w}" height="${(w*.97).toFixed(1)}"`)+"</g>")}
  for(const k of ["toboggan","tourniquet","bascule","trampoline"]){const [x,y]=AT[k];
    if(!R.jeux[k]){const w={toboggan:170,tourniquet:150,bascule:190,trampoline:120}[k],h={toboggan:130,tourniquet:80,bascule:56,trampoline:56}[k],cx=k==="toboggan"?x+70:x,cy=y+8;
      grp(box,`<g class="zslot" data-z="${k}"><rect x="${cx-w/2}" y="${cy-h}" width="${w}" height="${h}" rx="18" fill="#fffaf2" fill-opacity=".45" stroke="${INK}" stroke-width="2.2" stroke-dasharray="7 6"/>
        <circle cx="${cx}" cy="${cy-h/2-6}" r="13" fill="#fffaf2" ${zL(2.2)}/><path d="M${cx-6} ${cy-h/2-6} h12 M${cx} ${cy-h/2-12} v12" ${zL(3)}/>
        <text x="${cx}" y="${cy-h/2+22}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="11" fill="${INK}">${JEUX[k].name}</text></g>`);continue}
    const g=mk(box,"g",{"data-z":k,class:"zjeu"});
    ups.push({k,...JMOVE[k](g,x,y,play?take(JEUX[k].n):[],ph)})}
  let last=performance.now();
  const loop=t=>{const dt=Math.min(.05,(t-last)/1e3);last=t;for(const u of ups)u.step(dt,t/1e3);zoneRaf=requestAnimationFrame(loop)};
  zoneRaf=requestAnimationFrame(loop)}
const setPose=(g,id,pose,w,o)=>{if(g._p!==pose){g._p=pose;g.innerHTML=zFox(id,pose,w,o)}};
const jFox=(p,id,pose,w)=>{const g=mk(p,"g");setPose(g,id,pose,w);return g};
const hop=(p,x,y,t)=>{const s=mk(p,"text",{x,y,"text-anchor":"middle","font-family":"Mochiy Pop One,sans-serif","font-size":"13",fill:"#fffaf2",stroke:INK,"stroke-width":"3","paint-order":"stroke",class:"zwii"});s.textContent=t;setTimeout(()=>s.remove(),900)};
const JMOVE={
  tourniquet(g,cx,cy,ids){const RX=66,RY=21;let th=0,om=.8;
    g.innerHTML=`<g filter="url(#wobble)">${JART.tourniquet(cx,cy,0)}</g><g class="zj-tback"></g><g class="zj-tbars0"></g><g filter="url(#wobble)">${JART.tourniquetTop(cx,cy)}</g><g class="zj-tbars1"></g><g class="zj-tfront"></g>`;
    const W=g.querySelector(".zj-twedge"),back=g.querySelector(".zj-tback"),front=g.querySelector(".zj-tfront"),b0=g.querySelector(".zj-tbars0"),b1=g.querySelector(".zj-tbars1"),C=["#f6a5b4","#9fd0f0","#f2d27a","#a9d68f"];
    const riders=ids.slice(0,3).map((id,i)=>({id,a:i*2.1,el:jFox(front,id,"happy",48)})),push=ids[3]?{id:ids[3],el:jFox(front,ids[3],"walk",48)}:null;
    return{ids,tap(){om=Math.min(5.2,om+1.6);hop(g,cx,cy-74,"Wiii !")},
      step(dt){om+=(.8-om)*dt*.45;th+=om*dt;
        W.innerHTML=C.map((c,i)=>tWedge(cx,cy,RX,RY,th+i*Math.PI/2,c)).join("");
        let h0="",h1="";for(let i=0;i<4;i++){const a=th+i*Math.PI/2+Math.PI/4,px=cx+RX*.86*Math.cos(a),py=cy+RY*.86*Math.sin(a);
          const d=`<path d="M${cx} ${cy-34} L${px.toFixed(1)} ${(py-30).toFixed(1)} V${py.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M${cx} ${cy-34} L${px.toFixed(1)} ${(py-30).toFixed(1)} V${py.toFixed(1)}" fill="none" stroke="#e0855c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
          if(Math.sin(a)<0)h0+=d;else h1+=d}
        b0.innerHTML=h0;b1.innerHTML=h1;
        for(const r of riders){const a=th+r.a,s=Math.sin(a),x=cx+RX*.58*Math.cos(a),y=cy+RY*.58*s+3,par=s<0?back:front;if(r.el.parentNode!==par)par.appendChild(r.el);
          r.el.setAttribute("transform",`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(.86+.14*(s+1)/2).toFixed(3)})`)}
        if(push){const a=th+2.8,s=Math.sin(a),x=cx+RX*1.18*Math.cos(a),y=cy+RY*1.18*s+10,par=s<0?back:front,dir=-Math.sin(a)<0?-1:1;if(push.el.parentNode!==par)par.insertBefore(push.el,par.firstChild);
          setPose(push.el,push.id,om>3?"happy":"walk",48);push.el.setAttribute("transform",`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${dir*(.9+.1*(s+1)/2)} ${.9+.1*(s+1)/2})`)}}}},
  toboggan(g,x0,y,ids){const yT=y-112,fast={t:0};
    g.innerHTML=`<g filter="url(#wobble)">${JART.toboggan(x0,y)}</g><g class="zj-tfox"></g>`;
    const box=g.querySelector(".zj-tfox"),B=t=>{const u=1-t,P=[[x0+28,yT+4],[x0+80,yT+8],[x0+92,y-14],[x0+150,y-4]],c=[u*u*u,3*u*u*t,3*u*t*t,t*t*t];return [P.reduce((s,p,i)=>s+p[0]*c[i],0),P.reduce((s,p,i)=>s+p[1]*c[i],0)]};
    const F=ids.map((id,i)=>({id,u:i/Math.max(1,ids.length),el:jFox(box,id,"up",46)}));
    return{ids,tap(){fast.t=3;hop(g,x0+60,yT-20,"Youpiii !")},
      step(dt){fast.t=Math.max(0,fast.t-dt);const sp=dt/8*(fast.t?2:1);
        for(const f of F){f.u=(f.u+sp)%1;const u=f.u;let x,yy,pose,rot=0,dir=1;
          if(u<.28){const k=u/.28;x=x0;yy=y-k*(y-yT)+2;pose="up"}
          else if(u<.38){x=x0+(u-.28)/.1*26;yy=yT+2;pose="sit"}
          else if(u<.56){const k=Math.pow((u-.38)/.18,1.4),[bx,by]=B(k),[nx,ny]=B(Math.min(1,k+.04));x=bx;yy=by-4;pose="happy";rot=Math.atan2(ny-by,nx-bx)*180/Math.PI*.55}
          else if(u<.62){x=x0+150;yy=y-4-Math.sin((u-.56)/.06*Math.PI)*10;pose="happy"}
          else{const k=(u-.62)/.38;x=x0+150-k*142;yy=y+12;pose="walk";dir=-1}
          setPose(f.el,f.id,pose,46);f.el.setAttribute("transform",`translate(${x.toFixed(1)} ${yy.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${dir} 1)`)}
        // ceux du fond d'abord : celui qui revient à pied passe devant l'échelle
        F.slice().sort((p,q)=>(p.u>.62)-(q.u>.62)).forEach(f=>box.appendChild(f.el))}}},
  bascule(g,cx,cy,ids){let A=9,t0=0;
    g.innerHTML=`<g class="zj-bwrap"></g>`;const w=g.querySelector(".zj-bwrap");
    w.innerHTML=`<g filter="url(#wobble)">${JART.bascule(cx,cy,0)}</g>`;const pl=w.querySelector(".zj-splank");
    const F=ids.slice(0,2).map((id,i)=>{const e=jFox(pl,id,"happy",48);e.setAttribute("transform",`translate(${cx+(i?72:-72)} ${cy-31})${i?" scale(-1 1)":""}`);return e});
    return{ids,tap(){A=Math.min(22,A+9);hop(g,cx,cy-90,"Hop !")},
      step(dt,t){t0+=dt;A+=(9-A)*dt*.35;pl.setAttribute("transform",`rotate(${(A*Math.sin(t0*2.3)).toFixed(2)} ${cx} ${cy-24})`)}}},
  trampoline(g,cx,cy,ids,ph){let p=0,big=0,flip=0;const id=ids[0];
    g.innerHTML=`<g filter="url(#wobble)">${JART.trampoline(cx,cy,0)}</g><g class="zj-tfx"></g>`;
    const mat=g.querySelector(".zj-tmat"),fx=g.querySelector(".zj-tfx"),el=id?jFox(fx,id,"happy",50):null;
    return{ids,tap(){big=1;hop(g,cx,cy-150,"Salto !")},
      step(dt){if(!el)return;const T=big===2?1.3:.75;p+=dt/T;
        if(p>=1){p-=1;big=big===1?2:0;flip=big===2?1:0}
        const hgt=(big===2?110:46)*Math.sin(p*Math.PI),dip=Math.max(0,6-hgt/3);
        mat.setAttribute("cy",(cy-24+dip).toFixed(1));mat.setAttribute("ry",(10+dip/2).toFixed(1));
        const rot=flip?p*360:0;el.setAttribute("transform",`translate(${cx} ${(cy-26+dip-hgt).toFixed(1)}) rotate(${rot.toFixed(0)} 0 -24)`)}}}
};

/* ---------- le potager ---------- */
const CROPS={
  myrtille:{name:"Myrtilles",gl:5,h:3,give:"baies",n:3,desc:"3 poignées de baies. Il en faut 6 pour une gamelle de baies des bois."},
  trefle:{name:"Trèfle",gl:8,h:6,give:"miel",n:1,desc:"Les abeilles en tirent un pot de miel. Il en faut 3 pour une gamelle de miel."},
  camomille:{name:"Camomille",gl:20,h:8,give:"tisane",n:1,one:1,desc:"Une Tisane calmante pour le Café : patience +30 % sur une journée. Une seule parcelle à la fois."}
};
const POT_NEED={baies:6,miel:3};
// grand écran : 2 colonnes de 3 parcelles plus grandes ; petit écran : 3 colonnes de 2
const potBig=()=>H>=600,potK=()=>potBig()?1.3:1;
const potSpots=()=>{if(potBig()){const st=Math.min(140,(H-150-262)/2);return [0,1,2].flatMap(r=>[[112,262+r*st],[288,262+r*st]])}
  const y1=262,y2=Math.max(366,H-110);return [[86,y1],[200,y1],[314,y1],[86,y2],[200,y2],[314,y2]]};
// une parcelle : {c, s (0 : pousse, 1 : à mi-chemin, 2 : prête), t (arrosée depuis, 0 = elle a soif)} ; la pluie arrose toute seule
function potTick(){const now=Date.now();let ch=0;
  for(const p of R.pot.p){if(!p||p.s>=2)continue;const half=CROPS[p.c].h*18e5;
    if(!p.t&&scn.rain){p.t=now;ch=1}
    if(p.t&&now-p.t>=half){p.s++;p.t=p.s<2&&scn.rain?p.t+half:0;ch=1}}
  if(ch)save();return ch}
function cropArt(c,s,x,y){const P=[[-26,-12],[0,-14],[26,-12],[-28,10],[0,8],[28,10]],out=[];
  for(const [dx,dy] of P){const X=x+dx,Y=y+dy;
    if(s===0){out.push(`<path d="M${X} ${Y} v-6" stroke="#6f9a60" stroke-width="2"/><ellipse cx="${X-3}" cy="${Y-7}" rx="3.4" ry="2" fill="#a9d68f" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${X+3}" cy="${Y-7}" rx="3.4" ry="2" fill="#a9d68f" stroke="${INK}" stroke-width="1.2"/>`);continue}
    const big=s===2;
    if(c==="myrtille")out.push(`<circle cx="${X-4}" cy="${Y-8}" r="${big?7:5}" fill="#6fa86a" ${zL(1.6)}/><circle cx="${X+4}" cy="${Y-9}" r="${big?7:5}" fill="#82b87a" ${zL(1.6)}/><circle cx="${X}" cy="${Y-14}" r="${big?6:4}" fill="#8fc488" ${zL(1.6)}/>${big?[[-5,-8],[3,-12],[6,-6],[-1,-16]].map(([a,b])=>`<circle cx="${X+a}" cy="${Y+b}" r="2.6" fill="#5a6fd0" stroke="${INK}" stroke-width="1"/>`).join(""):""}`);
    else if(c==="trefle")out.push(`${[[-4,-6],[4,-6],[0,-11]].map(([a,b])=>`<circle cx="${X+a}" cy="${Y+b}" r="${big?4.4:3.4}" fill="#7cc06a" stroke="${INK}" stroke-width="1.2"/>`).join("")}${big?`<path d="M${X+6} ${Y-8} q4 -8 2 -14" fill="none" stroke="#6f9a60" stroke-width="1.6"/><circle cx="${X+8}" cy="${Y-23}" r="4.4" fill="#f6b8c4" stroke="${INK}" stroke-width="1.2"/>`:""}`);
    else out.push(`<path d="M${X} ${Y} v-${big?16:10} M${X} ${Y-6} l-5 -6 M${X} ${Y-8} l5 -5" stroke="#6f9a60" stroke-width="1.8" fill="none"/>${big?[[0,-17],[-5,-12],[5,-13]].map(([a,b])=>`<g transform="translate(${X+a} ${Y+b})">${[0,60,120,180,240,300].map(r=>`<ellipse cy="-2.6" rx="1.5" ry="2.6" fill="#fffaf2" stroke="${INK}" stroke-width=".8" transform="rotate(${r})"/>`).join("")}<circle r="1.6" fill="#f2c45a"/></g>`).join(""):`<circle cx="${X}" cy="${Y-11}" r="2.2" fill="#d9e8b8" stroke="${INK}" stroke-width="1"/>`}`)}
  return out.join("")}
function plotSVG(i,p,x,y,k=1){const wet=p&&(p.t||p.s>=2),soil=!p?"#a8774f":wet?"#7a4a31":"#c49a6c";
  let s=`<g class="zplot" data-plot="${i}"><g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})"><path d="M${x-54} ${y+30} L${x+54} ${y+30} L${x+46} ${y-30} L${x-46} ${y-30}Z" fill="#c08a5c" ${zL(2.4)}/>
    <path d="M${x-48} ${y+25} L${x+48} ${y+25} L${x+41} ${y-25} L${x-41} ${y-25}Z" fill="${soil}"/>
    ${[-12,0,12].map(d=>`<path d="M${x-42+Math.abs(d)*.1} ${y+d} H${x+42-Math.abs(d)*.1}" stroke="#3d2a35" stroke-width="1.4" opacity=".22"/>`).join("")}`;
  if(!p)s+=`<circle cx="${x}" cy="${y}" r="12" fill="#fffaf2" fill-opacity=".8" ${zL(2)}/><path d="M${x-5} ${y} h10 M${x} ${y-5} v10" ${zL(2.6)}/>`;
  else{s+=cropArt(p.c,p.s,x,y);
    if(p.s>=2)s+=`<g class="zready"><path transform="translate(${x+40} ${y-34})" d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z" fill="#fff3a8" stroke="${INK}" stroke-width="1.4"/></g>`;
    else if(!p.t)s+=`<g class="zthirst"><circle cx="${x+40}" cy="${y-36}" r="12" fill="#fffaf2" ${zL(2)}/><path transform="translate(${x+40} ${y-36})" d="M0 -7 Q6 1 0 6 Q-6 1 0 -7Z" fill="#7fbcd6" stroke="${INK}" stroke-width="1.4"/></g>`}
  return s+`<rect x="${x-56}" y="${y-44}" width="112" height="76" fill="transparent"/></g></g>`}
const potIcon={baies:()=>`<svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="${INK}" stroke-width="1.6"><circle cx="8" cy="14" r="5" fill="#5a6fd0"/><circle cx="16" cy="15" r="5" fill="#6a7fe0"/><circle cx="12" cy="8" r="4.4" fill="#4f62c0"/></g></svg>`,
  miel:()=>`<svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"><path d="M6 9 H18 V19 Q18 21 16 21 H8 Q6 21 6 19Z" fill="#f2c45a"/><path d="M5 6 H19 V9 H5Z" fill="#e0855c"/></g></svg>`,
  tisane:()=>`<svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"><path d="M5 9 H17 V15 Q17 20 11 20 Q5 20 5 15Z" fill="#fffaf2"/><path d="M17 11 Q21 11 20 14 Q19 16 17 15" fill="none"/><circle cx="11" cy="13" r="2.4" fill="#f2c45a"/></g></svg>`};
function renderPotager(){if(!zoneEl)return;stopZone();potTick();
  const have=!!R.obj.potager,S=potSpots(),ph=phaseNow(),id=zoneIds("potager")[0],ready=R.pot.p.findIndex(p=>p&&p.s>=2);
  let crops="";S.forEach(([x,y],i)=>{crops+=have?plotSVG(i,R.pot.p[i],x,y,potK()):`<g data-z="friche"><ellipse cx="${x}" cy="${y}" rx="52" ry="26" fill="#9fc27e" opacity=".7"/>${[-30,-12,6,24,40].map(d=>`<path d="M${x+d} ${y+8} q2 -16 6 -22 M${x+d+6} ${y+8} q-1 -12 -6 -18" fill="none" stroke="#6f9a60" stroke-width="2" stroke-linecap="round"/>`).join("")}</g>`});
  // la remise à outils et le tonneau d'eau, au fond
  const deco=`<g filter="url(#wobble)"><path d="M18 214 V170 L52 146 L86 170 V214Z" fill="#c99a6a" ${zL()}/><path d="M12 172 L52 140 L92 172" fill="none" stroke="#b8604f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 172 L52 140 L92 172" fill="none" ${zL(2)}/><rect x="40" y="182" width="22" height="32" rx="2" fill="#7a4a31" ${zL(2)}/><path d="M66 180 l10 22 M74 178 l-2 26" stroke="${INK}" stroke-width="2.4"/>
    <rect x="336" y="182" width="40" height="38" rx="8" fill="#a8724c" ${zL()}/><path d="M336 194 H376 M336 208 H376" stroke="#7a4a31" stroke-width="2.4"/><ellipse cx="356" cy="182" rx="20" ry="6" fill="#7fbcd6" ${zL(2)}/>
    <path d="M312 214 h18 v-12 q0 -6 -6 -6 h-6 q-6 0 -6 6Z M330 204 l12 -8" fill="#9fd0f0" ${zL(2.2)}/></g>`
    +(potBig()?`<g filter="url(#wobble)"><path d="M352 ${H-40} V${H-70}" ${zL(5)}/><path d="M326 ${H-72} Q326 ${H-112} 352 ${H-114} Q378 ${H-112} 378 ${H-72}Z" fill="#f2c45a" ${zL(2.4)}/>${[0,1,2].map(i=>`<path d="M${330-i} ${H-80-i*12} H${374+i}" stroke="#d9a63a" stroke-width="2.4"/>`).join("")}<ellipse cx="352" cy="${H-80}" rx="5" ry="4" fill="#5b4250"/>
      ${[[40,H-60,"#f6b8c4"],[62,H-48,"#fffaf2"],[84,H-64,"#c9a8ec"],[30,H-40,"#f2d27a"],[70,H-30,"#f6b8c4"]].map(([x,y,c])=>`<path d="M${x} ${y+12} v-12" stroke="#6f9a60" stroke-width="2"/><circle cx="${x}" cy="${y}" r="6" fill="${c}" ${zL(1.6)}/><circle cx="${x}" cy="${y}" r="2" fill="#f2c45a"/>`).join("")}</g>
      <g class="zbees">${[0,1,2].map(i=>`<g class="zbee" style="animation-delay:-${i*1.3}s"><g transform="translate(${352+i*8} ${H-122})"><ellipse rx="4.4" ry="3.4" fill="#f2c45a" stroke="${INK}" stroke-width="1.2"/><path d="M-1 -3 v6 M1.6 -3 v6" stroke="${INK}" stroke-width="1"/><ellipse cx="-1" cy="-4.4" rx="2.6" ry="1.8" fill="#fff" stroke="${INK}" stroke-width=".8"/></g></g>`).join("")}</g>`:"");
  const fx=id&&!scn.rain&&ph!=="nuit"?(ready>=0?`<g transform="translate(${S[ready][0]-(potBig()?82:58)} ${S[ready][1]+(potBig()?28:16)})">${zFox(id,"eat",52)}</g>`:`<g transform="translate(300 222)">${zFox(id,"groom",50)}</g>`):"";
  zoneEl.innerHTML=`<svg viewBox="0 0 400 ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${zoneBg("zp")}${deco}<g id="zbox">${crops}</g>${fx}${zoneOver("zp")}</svg>
    ${zoneNav()}<div class="zstock">${potIcon.baies()}<b>${R.pot.baies}</b>${potIcon.miel()}<b>${R.pot.miel}</b></div>
    ${have?"":`<div class="psay low">Une friche. Copeau peut en faire un potager.<br><button class="btn" data-obj="potager" type="button" ${R.glands<OBJS.potager.price?"disabled":""}>${acornSVG()} ${OBJS.potager.price}</button></div>`}`;
  zoneEl.onpointerdown=e=>{if(zoneClick(e))return;
    const ob=e.target.closest("[data-obj]");if(ob){e.stopPropagation();if(!ob.disabled)buyObj("potager");return}
    if(e.target.closest("[data-z=friche]")){e.stopPropagation();toast("Des herbes folles. Il faut d'abord un potager.");return}
    const pl=e.target.closest("[data-plot]");if(!pl)return;e.stopPropagation();plotTap(+pl.dataset.plot)};
  clearInterval(renderPotager.iv);renderPotager.iv=setInterval(()=>{if(zone!=="potager"||!zoneEl){clearInterval(renderPotager.iv);return}if(potTick())renderPotager()},20000)}
function plotTap(i){const p=R.pot.p[i];
  if(!p){cropSheet(i);return}
  if(p.s>=2){const C=CROPS[p.c];R.pot.p[i]=null;
    if(C.give==="tisane"){const b=bourse();b.gift=b.gift||{};b.gift.boost=b.gift.boost||{};b.gift.boost.patience=(b.gift.boost.patience||0)+C.n;putBourse(b);deliverGifts();toast("Une Tisane calmante part au Café (onglet Bonus, avant une journée).")}
    else{R.pot[C.give]+=C.n;const need=POT_NEED[C.give];toast(`${C.name} : +${C.n} ${C.give==="baies"?"poignées de baies":"pot de miel"} (${R.pot[C.give]} / ${need} pour la gamelle).`)}
    save();bip("acorn");renderPotager();return}
  if(!p.t){p.t=Date.now();save();bip("splash");renderPotager();toast(`Arrosé ! ${CROPS[p.c].name} : ça pousse.`);return}
  const left=CROPS[p.c].h*18e5-(Date.now()-p.t),m=Math.max(1,Math.round(left/6e4));
  toast(`${CROPS[p.c].name} : ${p.s?"presque prêt":"ça pousse"}. Encore ${m>=60?`${Math.round(m/60)} h`:`${m} min`}${p.s?"":", puis un dernier arrosage"}.`)}
function cropSheet(i){const busy=k=>CROPS[k].one&&R.pot.p.some(p=>p&&p.c===k);
  const pic=k=>`<svg viewBox="40 222 120 56" aria-hidden="true">${plotSVG(-1,{c:k,s:2,t:1},100,256)}</svg>`;
  openSheet(`<h2>Planter</h2><div class="wallet"><span>${acornSVG()} ${R.glands}</span></div><div class="dgrid">${Object.entries(CROPS).map(([k,C])=>dTile("",pic(k),C.name,C.desc,`${C.h} h · deux arrosages`,
    `<button class="btn" data-crop="${i}|${k}" type="button" ${R.glands<C.gl||busy(k)?"disabled":""}>${busy(k)?"Déjà planté":`${acornSVG()} ${C.gl}`}</button>`)).join("")}</div><p class="sub">La pluie arrose toute seule.</p>`)}
function plantCrop(i,k){const C=CROPS[k];if(R.pot.p[i]||R.glands<C.gl)return;R.glands-=C.gl;R.pot.p[i]={c:k,s:0,t:scn.rain?Date.now():0};
  save();renderHud();closeSheet();bip("rustle");if(zone==="potager")renderPotager();toast(scn.rain?`${C.name} : planté, et la pluie arrose.`:`${C.name} : planté ! Touche la parcelle pour l'arroser.`)}
// la gamelle se remplit aussi avec la récolte (ui.js)
function buyBowlPot(k){const need=POT_NEED[k];if(!need||R.pot[k]<need)return;R.pot[k]-=need;const B=BOWLS[k];
  bip("kibble");R.bowl={type:k,until:Date.now()+B.hours*36e5};save();renderHud();closeSheet();drawBowl();toast(`${B.name} du potager dans la gamelle. Qui va venir ?`)}
drawZoneTab();
