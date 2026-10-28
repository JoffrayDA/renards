/* La Clairière : la vie des renards par petits sauts. Chaque renard a une activité à un endroit,
   puis trottine jusqu'au suivant. Les sauvages entrent par la forêt, mangent à la gamelle et repartent. */
const foxes=[];

// qui est dans la clairière : tout le monde s'il y a de la place, sinon un groupe qui change toutes les 4 heures
// (avec des croquettes dans la gamelle, ceux qui étaient là restent)
function presentIds(){
  const ids=Object.keys(R.res);if(ids.length<=MAXHERE)return ids;
  const block=R.bowl&&R.bowl.type==="croquettes"&&R.here?R.here.block:Math.floor(Date.now()/(4*36e5));
  if(R.here&&R.here.block===block)return [...new Set([...storyFoxes(),...R.here.ids.filter(isRes),...ids])].slice(0,MAXHERE);
  const r=rng(block%2147483646+1),pool=ids.slice();for(let i=pool.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  // ceux de l'histoire en cours et les nouveaux venus du jour sont toujours là
  const fresh=ids.filter(id=>Date.now()-R.res[id].at<864e5),pick=[...new Set([...storyFoxes(),...fresh,...pool])].slice(0,MAXHERE);
  R.here={block,ids:pick};save();return pick;
}

function makeFox(id,spot,o={}){
  const el=document.createElement("div");el.className="fox";
  const f={id,el,spot:null,pose:"sit",x:0,y:0,until:0,walk:null,inside:false,wild:!!o.wild};
  el.onpointerdown=e=>{e.stopPropagation();tapFox(f)};
  foxes.push(f);$("actors").appendChild(el);
  f.badge=document.createElement("div");f.badge.className="fbadge";$("lights").appendChild(f.badge); // ses signes, au-dessus de la nuit
  if((LOOK[id]||{}).mark==="lueur"){f.light=document.createElement("div");f.light.className="flight";f.light.innerHTML=`<i><svg viewBox="-50 -50 100 100" aria-hidden="true">${[[9,-12,1.3,0],[-12,-5,1,.5],[7,11,.9,1],[-6,10,.8,1.4],[14,2,.7,.8],[-2,-16,.7,1.1]].map(([x,y,k,d])=>`<path class="spark" style="animation-delay:${d}s" d="M${x} ${y-4*k} q${.8*k} ${3.2*k} ${4*k} ${4*k} q${-3.2*k} ${.8*k} ${-4*k} ${4*k} q${-.8*k} ${-3.2*k} ${-4*k} ${-4*k} q${3.2*k} ${-.8*k} ${4*k} ${-4*k}Z" fill="#fffbe0"/>`).join("")}</svg></i>`;$("lights").appendChild(f.light)}
  if(spot)place(f,spot);else{f.x=EDGE.x;f.y=EDGE.y;el.style.cssText+=";"+pc(EDGE.x,EDGE.y)}
  return f;
}
function removeFox(f){f.el.remove();f.badge.remove();if(f.light)f.light.remove();foxes.splice(foxes.indexOf(f),1);if(f.wild)drawBowl()}
function draw(f){
  const art=FOX[f.id],o={pose:f.walk?"walk":f.pose,frame:0};
  if(f.walk&&f.walk.climb)f.el.innerHTML=`<div class="flip"><div class="bob">${foxArt(art,{pose:"up"})}</div></div>`; // il grimpe à l'échelle
  else if(f.walk)f.el.innerHTML=`<div class="flip"><div class="bob"><div class="w0">${foxArt(art,o)}</div><div class="w1">${foxArt(art,{pose:"walk",frame:1})}</div></div></div>`;
  else if(objOf(f.spot))f.el.innerHTML=`<div class="flip">${objOf(f.spot).svg(f.id)}</div>`; // dans un objet du refuge (objets.js)
  else f.el.innerHTML=`<div class="flip">${foxArt(art,o)}</div>`;
  setBadge(f); // « ! » de l'histoire, « … » d'une petite envie ou cœur du câlin (envies.js)
  f.el.classList.toggle("walking",!!f.walk);f.glowAt=o.glowAt;moveLight(f);drawObjs();
}
// la lumière de Luciole passe au-dessus du voile de la nuit : elle suit le bout de sa queue
// ses signes suivent le renard (même boîte, même trajet), et disparaissent quand il est dans la maison
function moveBadge(f,dur){const B=f.badge;if(!B)return;if(dur!=null)B.style.transitionDuration=dur+"s";B.style.left=f.x/W*100+"%";B.style.top=f.y/H*100+"%";B.classList.toggle("off",f.inside)}
function moveLight(f,dur){moveBadge(f,dur);if(!f.light)return;const L=f.light,g=f.glowAt||[107,64],left=f.el.classList.contains("left");
  L.classList.toggle("off",!dark()||f.inside);
  if(dur!=null)L.style.transitionDuration=dur+"s";
  L.style.left=f.x/W*100+"%";L.style.top=f.y/H*100+"%";
  const i=L.firstChild;i.style.left=(left?120-g[0]:g[0])/120*100+"%";i.style.top=(g[1]+16)/116*100+"%"}
function place(f,sp){f.spot=sp;f.x=sp.x;f.y=sp.y;f.el.style.transitionDuration="0s";f.badge.style.transitionDuration="0s";if(f.light)f.light.style.transitionDuration="0s";f.el.style.cssText+=";"+pc(sp.x,sp.y);f.el.style.zIndex=Math.round(sp.y);settle(f)}
// choisit une pose qui va avec l'endroit, l'heure et la pluie
function settle(f){
  const sp=f.spot;let poses=sp.poses.slice();
  if(phaseNow()==="nuit")poses=poses.concat(poses.filter(p=>p==="sleep"||p==="lie"),["sleep","sleep"].filter(()=>sp.poses.includes("sleep")));
  if(scn.rain&&sp.cov)poses=poses.concat(["up","up","sleep"]);
  if(FOX[f.id].sleepy&&sp.poses.includes("sleep"))poses=poses.concat(["sleep","sleep","sleep"]);
  f.pose=sp.lamp&&f.id==="luciole"?"up":poses[Math.floor(Math.random()*poses.length)];
  if(sp.bowl)f.pose="eat";
  if(sp.lamp&&f.id==="luciole"&&dark()&&!scn.lamps[sp.lamp]){scn.lamps[sp.lamp]=true;drawGlow();log("Luciole allume les lanternes.")}
  f.walk=null;f.until=Date.now()+(f.pose==="sleep"?16000:7000)+Math.random()*12000;
  if(f.wild)f.until=Date.now()+14000;
  if(objOf(sp)){f.pose=objOf(sp).pose;f.until=Date.now()+30000+Math.random()*30000} // un long moment dans un objet du refuge
  draw(f);
}
const taken=sp=>foxes.some(o=>(o.spot===sp&&!o.walk)||(o.walk&&o.walk.to===sp));
// un trajet se fait par étapes : pour la cabane (via), on passe par le pied de l'échelle et on grimpe (climb)
function goTo(f,sp){
  const legs=[];
  if(f.spot&&f.spot.via&&f.spot!==sp)legs.push(f.spot.via[1],{...f.spot.via[0],climb:1});
  if(sp&&sp.via)legs.push(sp.via[0],{...sp.via[1],climb:1});
  legs.push(sp==="door"?DOOR:sp==="edge"?EDGE:sp);
  f.walk={to:sp,legs};f.spot=null;leg(f);
}
function leg(f){
  const w=f.walk,to=w.legs.shift(),from={x:f.x,y:f.y},d=Math.hypot(to.x-from.x,to.y-from.y),dur=to.climb?Math.max(1.5,d/24):Math.max(.8,d/38);
  Object.assign(w,{t0:Date.now(),dur:dur*1000,from,goal:to,climb:!!to.climb});
  if(!to.climb&&Math.abs(to.x-from.x)>2)f.el.classList.toggle("left",to.x<from.x);draw(f);
  requestAnimationFrame(()=>{f.el.style.transitionDuration=dur+"s";f.el.style.left=to.x/W*100+"%";f.el.style.top=to.y/H*100+"%";f.x=to.x;f.y=to.y;moveLight(f,dur)});
}
function arrive(f){
  const w=f.walk;f.x=w.goal.x;f.y=w.goal.y;
  if(w.legs.length){leg(f);return} // étape suivante (l'échelle de la cabane)
  if(w.to==="edge"){removeFox(f);return}
  if(w.to==="door"){f.inside=true;f.walk=null;f.el.classList.add("inside");moveLight(f);f.until=Date.now()+9000+Math.random()*9000;drawGlow();log(`${FOX[f.id].name} rentre se mettre au chaud.`);return}
  f.spot=w.to;f.el.style.zIndex=Math.round(f.y);settle(f);
  if(f.wild&&w.to.bowl)log(`${nameOf(f.id)==='???'?'Un inconnu':FOX[f.id].name} mange à la gamelle !`);
}
// où aller ensuite
function choose(f){
  if(f.wild){f.food=null;drawBowl();return "edge"} // un sauvage repart dans la forêt après son repas, la gamelle est vide
  const free=SPOTS.filter(s=>!taken(s)&&s!==f.spot&&!s.bowl);
  if(scn.rain){
    const cov=free.filter(s=>s.cov);
    if(f.spot&&f.spot.cov)return Math.random()<.85?null:cov[0]||null;
    if(cov.length)return cov[Math.floor(Math.random()*cov.length)];
    // le renard d'une petite envie reste dehors, même mouillé : sinon on ne peut plus le toucher
    if(envWants(f.id)){const o=free.filter(s=>!s.lamp&&!s.obj);return o[Math.floor(Math.random()*o.length)]||null}
    return "door";
  }
  if(phaseNow()==="nuit"&&houseOpen()&&!isTarget(f.id)&&Math.random()<.35)return "door"; // la nuit, on rentre dormir près du feu (maison.js)
  if(f.id==="luciole"&&dark()){const l=free.find(s=>s.lamp&&!scn.lamps[s.lamp]);if(l)return l}
  // de temps en temps, un renard va grignoter à la gamelle quand il y a des croquettes
  if(R.bowl&&R.bowl.type==="croquettes"&&!taken(SPOT.bowl)&&Math.random()<.25)return SPOT.bowl;
  // les objets du refuge attirent les renards
  const ob=free.filter(s=>s.obj);if(ob.length&&!objOf(f.spot)&&!isTarget(f.id)&&Math.random()<.25)return ob[Math.floor(Math.random()*ob.length)];
  const pool=free.filter(s=>(!s.lamp||f.id==="luciole")&&!s.obj);
  return pool[Math.floor(Math.random()*pool.length)]||null;
}
function tick(){
  const now=Date.now();
  for(const f of foxes.slice()){
    if(f.walk){const t=Math.min(1,(now-f.walk.t0)/f.walk.dur);f.el.style.zIndex=Math.round(f.walk.from.y+(f.walk.goal.y-f.walk.from.y)*t);if(t>=1)arrive(f);continue}
    // un renard attendu par l'histoire ressort même sous la pluie, puis ne bouge plus
    if(f.inside){if(isHidden(f.id))continue;if((!scn.rain||isTarget(f.id)||envWants(f.id))&&now>f.until){const sp=choose({...f,spot:null});if(sp&&sp!=="door"){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y;goTo(f,sp);drawGlow();log(`${FOX[f.id].name} ressort de la maison.`)}}continue}
    if(now>f.until&&(isTarget(f.id)||envHold(f)||storyStay(f.id))){f.until=now+5000;continue}
    if(now>f.until){const sp=choose(f);if(sp)goTo(f,sp);else f.until=now+5000}
  }
  const f1=Math.floor(now/200)%2===1;for(const f of foxes)if(f.walk)f.el.classList.toggle("f1",f1);
}
// remet la scène d'accord avec la sauvegarde (nouvel arrivant, groupe qui change)
function syncFoxes(){
  const want=presentIds();
  for(const f of foxes.slice())if(!f.wild&&!want.includes(f.id))removeFox(f);
  const free=()=>SPOTS.filter(s=>!taken(s)&&!s.bowl&&!s.lamp&&!s.obj);
  for(const id of want)if(!foxes.some(f=>f.id===id)){const fs=free();makeFox(id,fs[Math.floor(Math.random()*fs.length)]||SPOT.g3)}
}
// un sauvage vient manger pendant qu'on regarde
function wildVisit(id,food){
  const f=makeFox(id,null,{wild:true});f.food=food;drawBowl();
  if(taken(SPOT.bowl)){const o=foxes.find(x=>x.spot===SPOT.bowl&&!x.wild);if(o)o.until=0}
  setTimeout(()=>goTo(f,SPOT.bowl),60);
}
function rainChanged(){
  for(const f of foxes)if(!f.walk&&!f.inside&&!f.wild&&(scn.rain?!(f.spot&&f.spot.cov):Math.random()<.5))f.until=Date.now()+Math.random()*1500;
  if(scn.rain){startRain();log("Il pleut. Tout le monde file sous le porche.")}else log("La pluie s'arrête.");
  drawGlow();drawPills();
}
