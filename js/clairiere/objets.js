/* La Clairière : les objets du refuge (docs/clairiere-v2.md, décisions du 26/10/2026).
   On achète un objet avec des glands, on le pose dans la clairière ; il attire un renard dans une pose
   qu'on ne voit pas ailleurs, à prendre en photo avec l'appareil (photo.js). Panier (sieste), pot de fleurs.
   R.obj[k] = objet posé ; une photo d'objet : {id, obj, t} dans R.photos (à côté des visites de la gamelle).
   Chaque objet a son endroit (spot.obj = k) ; svg(id) le dessine avec le renard dedans (ou vide), dans le repère du renard.
   k : l'objet est k fois plus large qu'un renard (le renard dedans est alors dessiné k fois plus petit). */
R.obj=R.obj||{};
// le renard sans son ombre, à poser dans un objet (viewBox 0 -16 120 116)
const foxIn=(id,pose)=>foxArt(FOX[id],{pose}).replace(/^<svg[^>]*>|<\/svg>$/g,"").replace(/<ellipse cx="60" cy="9\d"[^>]*opacity="[\d.]+"\/>/,"");
// une place dans l'herbe en plus (EXT), au-dessus de la ligne d'objectif
const extY=k=>Math.round(480+Math.max(EXT-80,40)*k);
const OBJS={
  panier:{name:"Panier douillet",price:25,pose:"sleep",nap:1,in:"Dans le panier",spot:{id:"basket",x:300,y:292,poses:["sleep"],obj:"panier"},thumb:"6 52 108 58",
    desc:"Un panier en osier et sa couverture rose. Un renard viendra peut-être y faire la sieste : sors l'appareil pour le prendre en photo.",
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
    ${[[18,78,20,"#d9693f"],[34,68,-30,"#f2c45a"],[50,82,60,"#c9583a"],[68,70,10,"#f2c45a"],[86,80,-50,"#d9693f"],[100,74,40,"#e98a4a"],[28,90,80,"#f2c45a"],[76,90,-20,"#c9583a"],[56,94,30,"#e98a4a"]].map(([x,y,r,c])=>leaf(x,id?y+(100-y)*.35:y,r,c)).join("")}</g></svg>`}},
  // les constructions de l'arbre de droite (28/10/2026) : la cabane et la branche sont dans le décor (bgSVG) ;
  // ici, ce qui va avec le renard : la barrière de la terrasse devant lui, les cordes et la planche de la balançoire
  cabane:{name:"Cabane dans l'arbre",price:150,pose:"sit",in:"Dans la cabane",spot:{id:"treehouse",x:320,y:141,poses:["sit"],obj:"cabane",via:[{x:373,y:252},{x:373,y:141}]},thumb:"-10 -40 140 150",
    desc:"Copeau construit une cabane dans l'arbre de droite, avec une terrasse. On y voit toute la clairière.",
    svg:id=>`<svg viewBox="0 -16 120 116" aria-hidden="true">${id?foxIn(id,"sit"):""}<g ${O} filter="url(#wobble)"><path d="M-6 96 H126" stroke-width="3"/><path d="M-4 96 V70 H124 V96" fill="none" stroke-width="2.6"/>${[14,34,54,74,94,114].map(x=>`<path d="M${x} 70 V96" stroke-width="2.2"/>`).join("")}</g></svg>`,
    photo:id=>`<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#bfe3f2"/><path d="M0 120 Q100 110 200 120 V160 H0Z" fill="#cfe3a8"/><g filter="url(#wobble)"><path d="M130 160 Q136 110 128 70 L156 70 Q150 110 158 160Z" fill="#a9785a" ${O}/>${[[150,40,44],[92,52,30],[186,64,28]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#8dbd86" ${O}/>`).join("")}<rect x="90" y="44" width="80" height="56" rx="4" fill="#e8b884" ${O}/>${[56,68,80,92].map(y=>`<path d="M92 ${y} H168" stroke="#c99a6a" stroke-width="2"/>`).join("")}<path d="M82 48 L130 14 L178 48Z" fill="#d9776a" ${O}/><rect x="138" y="60" width="22" height="20" rx="3" fill="#ffe9a6" ${O}/><path d="M40 104 H176" stroke="#8a5a3a" stroke-width="10" stroke-linecap="round"/><path d="M40 104 H176" stroke="${INK}" stroke-width="2"/></g>${foxAt(id,72,104,60,{pose:"sit",expr:"joy"})}<g filter="url(#wobble)"><path d="M40 100 V84 H104 V100" fill="none" stroke="${INK}" stroke-width="2.6"/>${[52,64,76,88].map(x=>`<path d="M${x} 84 V100" stroke="${INK}" stroke-width="2.2"/>`).join("")}</g></svg>`},
  balancoire:{name:"Balançoire",price:80,pose:"happy",in:"Sur la balançoire",spot:{id:"swing",x:330,y:262,poses:["happy"],obj:"balancoire"},thumb:"-10 -80 140 190",
    desc:"Une planche et deux cordes, nouées à une grosse branche de l'arbre de droite. Ça grince un peu, c'est ça qui est bien.",
    svg:id=>{const a=id?8:3,d=(id?2.6:3.4)+"s",x=(188*Math.tan(a*Math.PI/180)).toFixed(1),kt=`keyTimes="0;.25;.5;.75;1" calcMode="spline" keySplines=".4 0 1 1;0 0 .6 1;.4 0 1 1;0 0 .6 1"`,an=(t,v,o="")=>`<animateTransform attributeName="transform" type="${t}" values="${v}" dur="${d}" repeatCount="indefinite" ${kt} ${o}/>`;
      return `<svg viewBox="0 -16 120 116" overflow="visible" aria-hidden="true"><ellipse cx="60" cy="104" rx="40" ry="5" fill="#3d2a35" opacity=".14">${an("translate",`-${x} 0;0 0;${x} 0;0 0;-${x} 0`)}</ellipse>
      <g transform="translate(0 -100)"><g>${an("skewX",`-${a};0;${a};0;-${a}`)}<path d="M14 0 V188 M106 0 V188" stroke="${INK}" stroke-width="3"/></g></g>
      <g>${an("translate",`-${x} -4;0 0;${x} -4;0 0;-${x} -4`)}${an("rotate",`${a/2} 60 88;0 60 88;-${a/2} 60 88;0 60 88;${a/2} 60 88`,`additive="sum"`)}${id?`<g transform="translate(0 -6)">${foxIn(id,"happy")}</g>`:""}<rect x="4" y="84" width="112" height="12" rx="4" fill="#e8b884" ${O}/></g>
      <path d="M10 -102 h8 v8 h-8Z M102 -102 h8 v8 h-8Z" fill="#e8d2a8" stroke="${INK}" stroke-width="2"/></svg>`},
    photo:id=>`<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#bfe3f2"/><path d="M0 62 Q50 50 100 58 Q150 50 200 62 V160 H0Z" fill="#cfe3a8"/><g filter="url(#wobble)"><path d="M-10 14 Q100 2 210 20 L210 40 Q100 22 -10 30Z" fill="#a9785a" ${O}/><path d="M60 22 q-12 -2 -20 2 M150 26 q-10 -3 -18 0" fill="none" stroke="#8a5a3a" stroke-width="2" stroke-linecap="round"/><circle cx="30" cy="10" r="14" fill="#8dbd86" ${O}/><circle cx="182" cy="14" r="12" fill="#9cc796" ${O}/></g><g transform="rotate(8 100 22)"><path d="M72 22 V118 M128 22 V118" stroke="${INK}" stroke-width="2.4"/><g filter="url(#wobble)"><rect x="64" y="116" width="72" height="10" rx="4" fill="#e8b884" ${O}/></g>${foxAt(id,100,122,62,{pose:"happy"})}</g></svg>`},
  // dans l'herbe en plus sous la scène (EXT, 01/11/2026 : « il va falloir remplir la clairière ») ; le potager, écarté le 28/10/2026 faute de place, revient
  potager:{name:"Potager",price:60,pose:"happy",r:44,k:1.5,in:"Au potager",spot:{id:"garden",x:305,y:extY(.2),poses:["happy"],obj:"potager"},thumb:"-26 0 172 104",
    desc:"Un carré de terre bordé de planches : carottes, salades et un petit arrosoir. Quelqu'un viendra forcément jardiner.",
    svg:id=>{const carrot=x=>`<path d="M${x} 70 l-3 6 h6Z" fill="#f08a3c" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="M${x} 70 q-6 -8 -4 -14 M${x} 70 q0 -10 2 -15 M${x} 70 q6 -7 7 -12" fill="none" stroke="#5f9a5a" stroke-width="2.6" stroke-linecap="round"/>`,
      salad=x=>`<g transform="translate(${x} 68)"><circle r="8" fill="#a9d68f" stroke="${INK}" stroke-width="1.8"/><path d="M-5 -1 q5 -6 10 0 M-3 3 q3 -3 6 0" fill="none" stroke="#6f9a60" stroke-width="1.6"/></g>`;
      return `<svg viewBox="0 -16 120 116" overflow="visible" aria-hidden="true"><ellipse cx="60" cy="101" rx="76" ry="6" fill="#3d2a35" opacity=".14"/>
  ${id?`<g transform="translate(4.4 4) scale(.66)">${foxIn(id,"happy")}</g><g transform="translate(74 50) rotate(-24) scale(.7)" ${O}><path d="M-12 -8 h18 v16 h-18Z" fill="#9ec3ef"/><path d="M6 -4 l14 -8 l2 4 l-12 8Z" fill="#9ec3ef"/><path d="M-12 -6 q-8 4 0 12" fill="none" stroke-width="2.4"/></g>
    <g fill="#bfe3f2">${[[88,48,0],[91,55,.3],[86,60,.6]].map(([x,y,d])=>`<circle class="drip" cx="${x}" cy="${y}" r="2.2" style="animation-delay:${d}s"/>`).join("")}</g>`:""}
  <g ${O} filter="url(#wobble)"><path d="M-18 70 H138 L132 76 H-12Z" fill="#7a4a35"/></g>
  ${[-6,10,26].map(carrot).join("")}${[46,64].map(salad).join("")}${[84,100,116].map(carrot).join("")}
  <g ${O} filter="url(#wobble)"><path d="M-14 74 H134 L130 100 H-10Z" fill="#c48a54"/><path d="M-12 87 H132" stroke="#9a6a44" stroke-width="2"/><path d="M16 74 V100 M60 74 V100 M104 74 V100" stroke="#9a6a44" stroke-width="2"/></g>
  ${id?"":`<g transform="translate(118 74)" ${O}><path d="M-10 -10 h16 v14 h-16Z" fill="#9ec3ef"/><path d="M6 -6 l10 -6 l2 3 l-10 6Z" fill="#9ec3ef"/></g>`}
  <g transform="translate(-20 62)"><path d="M0 0 V22" stroke="#a9785a" stroke-width="3"/><rect x="-9" y="-10" width="18" height="12" rx="2" fill="#fffaf2" stroke="${INK}" stroke-width="2"/><path d="M-5 -4 h4 M1 -4 h4" stroke="#f08a3c" stroke-width="2.4" stroke-linecap="round"/></g></svg>`}},
  // le carton : évidemment, l'objet préféré de tout le monde ; on voit la tête et les pattes posées sur le bord
  carton:{name:"Carton",price:20,pose:"sit",in:"Dans le carton",spot:{id:"box",x:120,y:extY(.75),poses:["sit"],obj:"carton"},thumb:"-4 24 128 80",
    desc:"Un simple carton. Rien de spécial. Les renards ne sont pas d'accord.",
    svg:id=>`<svg viewBox="0 -16 120 116" aria-hidden="true"><ellipse cx="60" cy="101" rx="50" ry="5" fill="#3d2a35" opacity=".14"/>
  <g ${O} filter="url(#wobble)"><path d="M14 58 L24 44 H96 L106 58Z" fill="#8a5f3a"/><path d="M24 44 L12 30 L22 26 L34 44Z M96 44 L108 30 L98 26 L86 44Z" fill="#e3b77e"/></g>
  ${id?`<g transform="translate(0 -6)">${foxIn(id,"sit")}</g>`:""}
  <g ${O} filter="url(#wobble)"><path d="M14 58 H106 V99 H14Z" fill="#d9a96e"/><path d="M54 58 H66 V99 H54Z" fill="#ead19c" stroke-width="2"/><path d="M14 58 H106 L100 68 H20Z" fill="#c4935a"/>
    <path d="M24 80 l6 6 M30 80 l-6 6" stroke="#a8774a" stroke-width="2"/></g>
  ${id?[46,74].map(x=>`<ellipse cx="${x}" cy="59" rx="6" ry="4" fill="${FOX[id].c.b}" stroke="${INK}" stroke-width="2"/>`).join(""):""}</svg>`},
  // le tunnel de jeu, vu de face : le renard regarde depuis l'entrée
  tunnel:{name:"Tunnel de jeu",price:45,pose:"sit",k:1.25,in:"Dans le tunnel",spot:{id:"tunnel",x:270,y:extY(.6),poses:["sit"],obj:"tunnel"},thumb:"0 0 120 104",
    desc:"Un tunnel en tissu rayé, qui fait « frrt » quand on passe dedans. On y entre d'un côté, on ressort de l'autre… ou pas.",
    svg:id=>`<svg viewBox="0 -16 120 116" aria-hidden="true"><ellipse cx="60" cy="100" rx="48" ry="6" fill="#3d2a35" opacity=".14"/>
  <g ${O} filter="url(#wobble)"><path d="M24 70 Q22 26 64 12 Q100 4 104 34 Q108 66 98 74Z" fill="#9ec3ef"/>${[[44,24,30,68],[62,14,58,72],[82,10,84,74]].map(([a,b,c,d])=>`<path d="M${a} ${b} Q${(a+c)/2+12} ${(b+d)/2} ${c} ${d}" fill="none" stroke="#fffaf2" stroke-width="7"/>`).join("")}</g>
  <ellipse cx="58" cy="70" rx="38" ry="28" fill="#4a3a5a"/>
  ${id?`<clipPath id="tunc"><ellipse cx="58" cy="70" rx="35" ry="26"/></clipPath><g clip-path="url(#tunc)"><g transform="translate(22 36) scale(.6)">${foxIn(id,"sit")}</g></g>`:""}
  <ellipse cx="58" cy="70" rx="38" ry="28" fill="none" stroke="#f6a5b4" stroke-width="7"/><ellipse cx="58" cy="70" rx="41.5" ry="31.5" fill="none" stroke="${INK}" stroke-width="2.6"/><ellipse cx="58" cy="70" rx="34.5" ry="24.5" fill="none" stroke="${INK}" stroke-width="2"/></svg>`}
};
for(const k in OBJS)PLACE[OBJS[k].spot.id]=OBJS[k].in.toLowerCase();
const objOf=sp=>sp&&sp.obj&&OBJS[sp.obj];
const basketSVG=id=>OBJS.panier.svg(id); // gardé pour les anciens appels

// les endroits des objets posés rejoignent ceux de la clairière
// les objets posés par terre se déplacent et se rangent comme la déco (01/11/2026, Joffray : posés au hasard, impossible de les bouger) ;
// la cabane et la balançoire restent dans l'arbre. Leur place : R.objAt[k] = {x, y, f (retourné), away (rangé)}
R.objAt=R.objAt||{};
const objMoves=k=>!OBJS[k].photo,objOn=k=>!!R.obj[k]&&!(R.objAt[k]||{}).away;
function addObjSpots(){
  if(R.obj.balancoire){SPOT.lampR.x=284;Object.assign(OBJS.panier.spot,{x:376,y:306})} // la balançoire prend la place sous la lanterne de droite, le panier va au pied de l'arbre
  for(const k in R.obj){const sp=OBJS[k].spot,a=R.objAt[k];if(a&&a.x!=null&&objMoves(k)){sp.x=a.x;sp.y=a.y}
    if(objOn(k)&&!SPOT[sp.id]){SPOTS.push(sp);SPOT[sp.id]=sp}
    if(!objOn(k)&&SPOT[sp.id]){SPOTS.splice(SPOTS.indexOf(sp),1);delete SPOT[sp.id]}}}
addObjSpots();
const objEls={};
// l'objet vide reste visible ; quand un renard est dedans, c'est lui qui le dessine (draw dans life.js)
function drawObjs(){
  for(const k in R.obj){const o=OBJS[k],sp=o.spot,a=R.objAt[k]||{};let el=objEls[k];
    if(!el){el=objEls[k]=document.createElement("button");el.className="obj"+(objMoves(k)?" movable":"");el.type="button";el.setAttribute("aria-label",o.name);el.innerHTML=o.svg();
      el.onpointerdown=e=>{if(decoMode){if(objMoves(k))decoDown(e,"o:"+k);return}e.stopPropagation();toast(k==="cabane"?"La cabane est vide. Les renards y montent pour regarder la clairière quand il fait beau.":k==="balancoire"?"La balançoire attend quelqu'un. Ça grince un peu.":o.nap?"Le panier attend son dormeur. Les renards y viennent faire la sieste quand il fait beau.":k==="feuilles"?"Rien ne bouge dans les feuilles… pour l'instant. Les renards adorent s'y cacher quand il fait beau.":k==="potager"?"Les carottes poussent tranquillement. Un jardinier passera bien.":k==="carton"?"Un carton vide. Pas pour longtemps.":k==="tunnel"?"Le tunnel est vide… enfin, on croit.":"Le pot attend quelqu'un. Les renards aiment s'y asseoir quand il fait beau.")};
      $("actors").appendChild(el)}
    el.style.cssText=pc(sp.x,sp.y)+`;z-index:${sp.y}`+(o.k?`;width:${13.5*o.k}%`:"");el.classList.toggle("flipped",!!a.f);
    el.classList.toggle("sel",decoMode&&decoSel==="o:"+k);el.classList.toggle("bad",decoMode&&decoSel==="o:"+k&&!decoOk(sp));
    el.hidden=!objOn(k)||foxes.some(f=>f.spot===sp&&!f.walk)}
}
// au retour, il y a souvent déjà quelqu'un dans un objet
function fillObjs(){if(scn.rain)return;
  for(const k in R.obj){const sp=OBJS[k].spot;if(!objOn(k)||taken(sp)||Math.random()>.6)continue;
    const pool=foxes.filter(f=>!f.wild&&!f.walk&&!f.inside&&!isTarget(f.id)&&!objOf(f.spot));if(!pool.length)return;
    place(pool[Math.floor(Math.random()*pool.length)],sp)}
  drawObjs()}

// l'onglet Refuge de la boutique (deco.js) : les objets en glands, à leur place fixe
function objList(){
  return `<p class="sub">Pose un objet dans la clairière : il attire les renards dans des positions qu'on ne voit nulle part ailleurs. Sors l'appareil photo pour les prendre.</p>${Object.entries(OBJS).map(([k,o])=>`<div class="opt"><span class="thumb">${o.photo?o.photo("petitpois"):o.svg().replace('viewBox="0 -16 120 116"',`viewBox="${o.thumb}"`)}</span><div class="txt"><strong>${o.name}</strong><span>${o.desc}</span></div><button class="btn" data-obj="${k}" type="button" ${R.obj[k]||R.glands<o.price?"disabled":""}>${R.obj[k]?"Posé":`${acornSVG()} ${o.price}`}</button></div>`).join("")}`}
function buyObj(k){const o=OBJS[k];if(R.obj[k]||R.glands<o.price)return;
  R.glands-=o.price;R.obj[k]=1;renderHud();
  // un objet par terre : on le pose tout de suite où on veut, en mode Décorer
  if(objMoves(k)){R.objAt[k]={away:1};save();addObjSpots();decoStart(null,"out");decoAdd("o:"+k);toast(`${o.name} : fais-le glisser où tu veux, puis touche Terminé.`);return}
  save();addObjSpots();drawObjs();drawBg();closeSheet();toast(`${o.name} : Copeau l'installe dans l'arbre. Qui va y grimper ?`)}
