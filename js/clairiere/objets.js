/* La Clairière : les objets du refuge (docs/clairiere-v2.md, décisions du 26/10/2026).
   On achète un objet avec des glands, on le pose dans la clairière ; il attire un renard dans une pose
   qu'on ne voit pas ailleurs, et on le touche pour le prendre en photo (album). Panier (sieste), pot de fleurs.
   R.obj[k] = objet posé ; une photo d'objet : {id, obj, t} dans R.photos (à côté des visites de la gamelle).
   Chaque objet a son endroit (spot.obj = k) ; svg(id) le dessine avec le renard dedans (ou vide), dans le repère du renard. */
R.obj=R.obj||{};
// le renard sans son ombre, à poser dans un objet (viewBox 0 -16 120 116)
const foxIn=(id,pose)=>foxArt(FOX[id],{pose}).replace(/^<svg[^>]*>|<\/svg>$/g,"").replace(/<ellipse cx="60" cy="9\d"[^>]*opacity="[\d.]+"\/>/,"");
const OBJS={
  panier:{name:"Panier douillet",price:25,pose:"sleep",nap:1,in:"Dans le panier",spot:{id:"basket",x:300,y:292,poses:["sleep"],obj:"panier"},thumb:"6 52 108 58",
    desc:"Un panier en osier et sa couverture rose. Un renard viendra peut-être y faire la sieste : touche-le pour le prendre en photo.",
    svg:id=>`<svg viewBox="0 -16 120 116" aria-hidden="true"><ellipse cx="60" cy="103" rx="50" ry="5" fill="#3d2a35" opacity=".14"/>
  <g ${O} filter="url(#wobble)"><ellipse cx="60" cy="72" rx="49" ry="12" fill="#b9814a"/>${id?"":`<path d="M20 76 Q40 62 60 70 Q80 62 100 76 Q60 86 20 76Z" fill="#f2c0c8"/>`}</g>
  ${id?`<g transform="translate(0 -2)">${foxIn(id,"sleep")}</g>`:""}
  <g ${O} filter="url(#wobble)"><path d="M11 72 Q12 104 60 104 Q108 104 109 72 Q60 90 11 72Z" fill="#dca86c"/>
    ${[22,36,50,64,78,92].map(x=>`<path d="M${x} ${84-(x-60)**2/400} Q${x+3} 92 ${x+1} ${100-Math.abs(x-60)/8}" fill="none" stroke="#b9814a" stroke-width="2"/>`).join("")}
    <path d="M13 76 Q60 94 107 76" fill="none" stroke-width="2.2"/>${id?`<path d="M84 88 q10 2 14 -8" fill="#f2c0c8" stroke-width="2"/>`:""}</g></svg>`},
  // trop grand pour le pot, mais il y tient ; la fleur pousse dans la terre, à côté de lui (Joffray : plus de tige qui flotte)
  pot:{name:"Pot de fleurs",price:40,pose:"happy",in:"Dans le pot de fleurs",spot:{id:"flowerpot",x:118,y:372,poses:["happy"],obj:"pot"},thumb:"8 30 104 74",
    desc:"Un grand pot en terre cuite, une marguerite et de la terre bien tassée. Quelqu'un va forcément vouloir s'asseoir dedans.",
    svg:id=>{const fl=(x,y,h,r)=>`<path d="M${x} ${y} q${-3*r} ${-h/2} 0 ${-h}" fill="none" stroke="#6f9a60" stroke-width="2.4"/><path d="M${x} ${y-h*.45} q${-9*r} -6 ${-12*r} 0 q${6*r} 5 ${12*r} 0Z" fill="#a9d68f" stroke-width="2"/>
      <g transform="translate(${x} ${y-h})">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-5.5" rx="3.6" ry="5.6" fill="#fffaf2" stroke-width="1.8" transform="rotate(${a})"/>`).join("")}<circle r="3.6" fill="#f2c45a" stroke-width="1.8"/></g>`;
      return `<svg viewBox="0 -16 120 116" aria-hidden="true"><ellipse cx="60" cy="100" rx="36" ry="5" fill="#3d2a35" opacity=".14"/>
  <g ${O} filter="url(#wobble)"><ellipse cx="60" cy="70" rx="36" ry="7" fill="#7a4a35"/>${id?fl(88,70,30,-1):fl(60,70,40,1)}</g>
  ${id?foxIn(id,"happy"):""}
  <g ${O} filter="url(#wobble)"><path d="M22 68 H98 V80 H22Z" fill="#e0855c"/><path d="M27 80 L35 100 H85 L93 80Z" fill="#d07450"/><path d="M40 88 q8 3 14 0" fill="none" stroke="#b55d3c" stroke-width="2"/></g></svg>`}},
  // caché dedans : seuls les oreilles et les yeux dépassent (pas de feuille qui flotte au-dessus)
  feuilles:{name:"Grand tas de feuilles",price:30,pose:"sit",in:"Dans les feuilles",spot:{id:"leafpile",x:350,y:452,poses:["sit"],obj:"feuilles"},thumb:"0 54 120 50",
    desc:"Des feuilles d'automne, rouges et dorées, bien gonflées. Parfait pour se cacher… presque.",
    svg:id=>{const leaf=(x,y,r,col)=>`<path transform="translate(${x} ${y}) rotate(${r})" d="M0 -7 Q6 -2 0 7 Q-6 -2 0 -7Z" fill="${col}" stroke-width="1.8"/>`;
      return `<svg viewBox="0 -16 120 116" aria-hidden="true"><ellipse cx="60" cy="98" rx="52" ry="5" fill="#3d2a35" opacity=".14"/>
  ${id?foxIn(id,"sit"):""}
  <g ${O} filter="url(#wobble)"><path d="M2 100 Q6 ${id?78:72} 30 ${id?75:70} Q42 ${id?68:62} 60 ${id?72:64} Q78 ${id?68:62} 92 ${id?75:70} Q114 ${id?78:72} 118 100Z" fill="#e7a356"/>
    ${[[18,78,20,"#d9693f"],[34,68,-30,"#f2c45a"],[50,82,60,"#c9583a"],[68,70,10,"#f2c45a"],[86,80,-50,"#d9693f"],[100,74,40,"#e98a4a"],[28,90,80,"#f2c45a"],[76,90,-20,"#c9583a"],[56,94,30,"#e98a4a"]].map(([x,y,r,c])=>leaf(x,id?y+(100-y)*.35:y,r,c)).join("")}</g></svg>`}}
};
for(const k in OBJS)PLACE[OBJS[k].spot.id]=OBJS[k].in.toLowerCase();
const objOf=sp=>sp&&sp.obj&&OBJS[sp.obj];
const basketSVG=id=>OBJS.panier.svg(id); // gardé pour les anciens appels

// les endroits des objets posés rejoignent ceux de la clairière
function addObjSpots(){for(const k in R.obj){const sp=OBJS[k].spot;if(!SPOT[sp.id]){SPOTS.push(sp);SPOT[sp.id]=sp}}}
addObjSpots();
const objEls={};
// l'objet vide reste visible ; quand un renard est dedans, c'est lui qui le dessine (draw dans life.js)
function drawObjs(){
  for(const k in R.obj){const o=OBJS[k],sp=o.spot;let el=objEls[k];
    if(!el){el=objEls[k]=document.createElement("button");el.className="obj";el.type="button";el.setAttribute("aria-label",o.name);
      el.style.cssText=pc(sp.x,sp.y)+`;z-index:${sp.y}`;el.innerHTML=o.svg();
      el.onpointerdown=e=>{e.stopPropagation();log(o.nap?"Le panier attend son dormeur. Les renards y viennent faire la sieste quand il fait beau.":k==="feuilles"?"Rien ne bouge dans les feuilles… pour l'instant. Les renards adorent s'y cacher quand il fait beau.":"Le pot attend quelqu'un. Les renards aiment s'y asseoir quand il fait beau.")};
      $("actors").appendChild(el)}
    el.hidden=foxes.some(f=>f.spot===sp&&!f.walk)}
}
// au retour, il y a souvent déjà quelqu'un dans un objet
function fillObjs(){if(scn.rain)return;
  for(const k in R.obj){const sp=OBJS[k].spot;if(taken(sp)||Math.random()>.6)continue;
    const pool=foxes.filter(f=>!f.wild&&!f.walk&&!f.inside&&!isTarget(f.id)&&!objOf(f.spot));if(!pool.length)return;
    place(pool[Math.floor(Math.random()*pool.length)],sp)}
  drawObjs()}

// toucher un renard dans un objet : clic, une photo pour l'album (une par renard et par objet)
function snapObj(f){const o=objOf(f.spot);if(!o||f.walk)return false;const k=f.spot.obj;
  if(R.photos.some(p=>p.obj===k&&p.id===f.id))return false;
  R.photos.push({id:f.id,obj:k,t:Date.now()});save();
  const fl=document.createElement("div");fl.className="flash";$("scene").appendChild(fl);setTimeout(()=>fl.remove(),700);
  toast(`Clic ! ${FOX[f.id].name} ${o.in.toLowerCase()}. La photo est dans l'album.`);return true}

function objSheet(){
  openSheet(`<h2>Objets du refuge</h2><p class="sub">Pose un objet dans la clairière : il attire les renards dans des positions qu'on ne voit nulle part ailleurs. Touche-les pour les prendre en photo.</p>${Object.entries(OBJS).map(([k,o])=>`<div class="opt"><span class="thumb">${o.svg().replace('viewBox="0 -16 120 116"',`viewBox="${o.thumb}"`)}</span><div class="txt"><strong>${o.name}</strong><span>${o.desc}</span></div><button class="btn" data-obj="${k}" type="button" ${R.obj[k]||R.glands<o.price?"disabled":""}>${R.obj[k]?"Posé":`${acornSVG()} ${o.price}`}</button></div>`).join("")}<p class="sub">D'autres objets arriveront bientôt.</p>`)}
function buyObj(k){const o=OBJS[k];if(R.obj[k]||R.glands<o.price)return;
  R.glands-=o.price;R.obj[k]=1;save();addObjSpots();drawObjs();renderHud();closeSheet();
  log(`${o.name} : posé dans l'herbe. Qui va s'y installer ?`)}
