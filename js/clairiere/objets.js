/* La Clairière : les objets du refuge (docs/clairiere-v2.md, décisions du 26/10/2026).
   On achète un objet avec des glands, on le pose dans la clairière ; il attire un renard dans une pose
   qu'on ne voit pas ailleurs, et on le touche pour le prendre en photo (album). Premier objet : le panier.
   R.obj[k] = objet posé ; une photo d'objet : {id, obj, t} dans R.photos (à côté des visites de la gamelle). */
R.obj=R.obj||{};
const OBJS={
  panier:{name:"Panier douillet",price:25,spot:{id:"basket",x:300,y:292,poses:["sleep"],basket:1},
    desc:"Un panier en osier et sa couverture rose. Un renard viendra peut-être y faire la sieste : touche-le pour le prendre en photo."}
};
PLACE.basket="dans le panier";

// le panier, dans le repère du renard (viewBox 0 -16 120 116) : le fond, le dormeur (ou la couverture), puis le bord devant
function basketSVG(id){
  const fox=id?foxArt(FOX[id],{pose:"sleep"}).replace(/^<svg[^>]*>|<\/svg>$/g,"").replace(/<ellipse cx="60" cy="9\d"[^>]*opacity="[\d.]+"\/>/,""):"";
  return `<svg class="basket" viewBox="0 -16 120 116" aria-hidden="true"><ellipse cx="60" cy="103" rx="50" ry="5" fill="#3d2a35" opacity=".14"/>
  <g ${O} filter="url(#wobble)"><ellipse cx="60" cy="72" rx="49" ry="12" fill="#b9814a"/>${id?"":`<path d="M20 76 Q40 62 60 70 Q80 62 100 76 Q60 86 20 76Z" fill="#f2c0c8"/>`}</g>
  ${id?`<g transform="translate(0 -2)">${fox}</g>`:""}
  <g ${O} filter="url(#wobble)"><path d="M11 72 Q12 104 60 104 Q108 104 109 72 Q60 90 11 72Z" fill="#dca86c"/>
    ${[22,36,50,64,78,92].map(x=>`<path d="M${x} ${84-(x-60)**2/400} Q${x+3} 92 ${x+1} ${100-Math.abs(x-60)/8}" fill="none" stroke="#b9814a" stroke-width="2"/>`).join("")}
    <path d="M13 76 Q60 94 107 76" fill="none" stroke-width="2.2"/>${id?`<path d="M84 88 q10 2 14 -8" fill="#f2c0c8" stroke-width="2"/>`:""}</g></svg>`}

// les endroits des objets posés rejoignent ceux de la clairière
function addObjSpots(){for(const k in R.obj){const sp=OBJS[k].spot;if(!SPOT[sp.id]){SPOTS.push(sp);SPOT[sp.id]=sp}}}
addObjSpots();
const objEls={};
// le panier vide reste visible ; quand un renard dort dedans, c'est lui qui le dessine (draw dans life.js)
function drawObjs(){
  for(const k in R.obj){const sp=OBJS[k].spot;let el=objEls[k];
    if(!el){el=objEls[k]=document.createElement("button");el.className="obj";el.type="button";el.setAttribute("aria-label",OBJS[k].name);
      el.style.cssText=pc(sp.x,sp.y)+`;z-index:${sp.y}`;el.innerHTML=basketSVG();
      el.onpointerdown=e=>{e.stopPropagation();log("Le panier attend son dormeur. Les renards y viennent faire la sieste quand il fait beau.")};
      $("actors").appendChild(el)}
    el.hidden=foxes.some(f=>f.spot===sp&&!f.walk)}
}
// au retour, il y a souvent déjà quelqu'un qui dort dans le panier
function fillBasket(){const sp=SPOT.basket;if(!sp||scn.rain||taken(sp)||Math.random()>.7)return;
  const pool=foxes.filter(f=>!f.wild&&!f.walk&&!f.inside&&!isTarget(f.id));if(!pool.length)return;
  place(pool[Math.floor(Math.random()*pool.length)],sp);drawObjs()}

// toucher un renard qui dort dans le panier : clic, une photo pour l'album (une par renard et par objet)
function snapObj(f){const sp=f.spot;if(!sp||!sp.basket||f.walk)return false;
  if(R.photos.some(p=>p.obj==="panier"&&p.id===f.id))return false;
  R.photos.push({id:f.id,obj:"panier",t:Date.now()});save();
  const fl=document.createElement("div");fl.className="flash";$("scene").appendChild(fl);setTimeout(()=>fl.remove(),700);
  toast(`Clic ! ${FOX[f.id].name} dans le panier. La photo est dans l'album.`);return true}

function objSheet(){
  openSheet(`<h2>Objets du refuge</h2><p class="sub">Pose un objet dans la clairière : il attire les renards dans des positions qu'on ne voit nulle part ailleurs. Touche-les pour les prendre en photo.</p>${Object.entries(OBJS).map(([k,o])=>`<div class="opt"><span class="thumb">${basketSVG().replace('viewBox="0 -16 120 116"','viewBox="6 52 108 58"')}</span><div class="txt"><strong>${o.name}</strong><span>${o.desc}</span></div><button class="btn" data-obj="${k}" type="button" ${R.obj[k]||R.glands<o.price?"disabled":""}>${R.obj[k]?"Posé":`${acornSVG()} ${o.price}`}</button></div>`).join("")}<p class="sub">D'autres objets arriveront bientôt.</p>`)}
function buyObj(k){const o=OBJS[k];if(R.obj[k]||R.glands<o.price)return;
  R.glands-=o.price;R.obj[k]=1;save();addObjSpots();drawObjs();renderHud();closeSheet();
  log("Le panier est posé dans l'herbe. Qui va s'y installer ?")}
