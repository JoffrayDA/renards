/* La Clairière : les renards jouent les histoires (02/11/2026, Joffray : « qu'ils interagissent en vrai sur l'écran, en plus
   du dialogue »). Une réplique peut porter une action (4e élément d'une ligne de talk, une fonction), un moment d'histoire une
   petite scène avant le dialogue (show, puis showMs avant les répliques). Les actions : marcher (actGo), prendre une pose
   (actPose), faire une figure (actTrick), réagir (actEmote), lancer une boule de neige (actThrow). */
const sF=id=>id==="me"?meF:foxes.find(f=>f.id===id&&!f.wild); // "me" : Roussette (roussette.js)
function actPose(id,pose,expr,ms=14000){const f=sF(id);if(!f||f.walk||f.inside)return;f.pose=pose;f.expr=expr;f.until=Date.now()+ms;draw(f)}
function actGo(id,x,y,pose="sit"){const f=sF(id);if(!f)return;if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y}
  goTo(f,{id:"act-"+id,x,y,poses:[pose]});f.until=Date.now()+20000}
function actTrick(id,k){const f=sF(id);if(f)hugFx(f,{trick:k,hearts:false})}
// une réaction au-dessus de la tête, sans bulle (Joffray, 03/11/2026 : les bulles rondes n'étaient pas belles, les gouttes
// incompréhensibles) : des signes façon manga, cernés de blanc pour se lire sur la neige et la nuit
const EMO={
  "!":`<g transform="rotate(10)"><path d="M0 -15 V3" stroke="#e0505a" stroke-width="6.5" stroke-linecap="round"/><circle cy="11.5" r="3.6" fill="#e0505a"/></g><path d="M-10 -12 l-5 -5 M11 -11 l6 -4 M-13 1 h-6" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`,
  "?":`<path d="M-6 -7 q0 -8 7 -8 q7 0 7 7 q0 5 -7 7 v4" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/><circle cx="1" cy="12" r="2.8" fill="${INK}"/>`,
  colere:`<path d="M-11 -11 q6 5 0 10 M11 -11 q-6 5 0 10 M-11 -11 q5 -6 10 0 M11 11 q-5 -6 -10 0 M-11 11 q6 -5 0 -10" fill="none" stroke="#e0505a" stroke-width="4" stroke-linecap="round" transform="scale(.9)"/>`,
  note:`<path d="M-3 6 V-10 L7 -12 V3" fill="none" stroke="${INK}" stroke-width="2.8"/><ellipse cx="-6" cy="6" rx="4.4" ry="3.2" fill="${INK}"/><ellipse cx="4" cy="3" rx="4.4" ry="3.2" fill="${INK}"/>`,
  coeur:`<path d="M0 9 C-11 0 -9 -9 -4.5 -9 Q-1 -9 0 -4.5 Q1 -9 4.5 -9 C9 -9 11 0 0 9Z" fill="#f48aa6" stroke="${INK}" stroke-width="2"/>`,
  froid:`<path d="M0 -12 V12 M-10.4 -6 L10.4 6 M-10.4 6 L10.4 -6" stroke="#6fa3e0" stroke-width="3.6" stroke-linecap="round"/>`};
function actEmote(id,k,ms=2200){if(k==="goutte")return;const f=sF(id);if(!f)return;const e=document.createElement("div");e.className="emote";
  e.innerHTML=`<svg viewBox="-16 -16 32 32" aria-hidden="true">${EMO[k]||EMO["!"]}</svg>`;
  e.style.cssText=pc(f.x+12,f.y-60);$("scene").appendChild(e);setTimeout(()=>e.remove(),ms)}
// une boule de neige lancée d'un renard (ou d'un point) vers un autre, en cloche ; à l'arrivée, elle éclate (et la cible sursaute)
function actThrow(from,to,o={}){const P=v=>typeof v==="string"?(f=>f?{x:f.x,y:f.y-30,id:v}:null)(sF(v)):v,a=P(from),b=P(to);if(!a||!b)return;
  const s=document.createElement("div");s.className="sball";s.innerHTML=`<svg viewBox="-12 -12 24 24" aria-hidden="true"><circle r="10" fill="#fff" stroke="${INK}" stroke-width="2.4"/><path d="M-5 -4 q3 -3 7 -2" fill="none" stroke="#cfdbea" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  $("scene").appendChild(s);const k=n=>({left:`${(a.x+(b.x-a.x)*n)/W*100}%`,top:`${(a.y+(b.y-a.y)*n-(o.arc??70)*4*n*(1-n))/H*100}%`});
  try{MUSIC.sfx("swap")}catch(e){}
  s.animate([k(0),k(.25),k(.5),k(.75),k(1)],{duration:o.ms||620,easing:"linear"}).onfinish=()=>{s.remove();
    const p=document.createElement("div");p.className="ssplat";p.style.cssText=pc(b.x,b.y);p.innerHTML=`<svg viewBox="-20 -20 40 40" aria-hidden="true">${[0,50,100,160,210,270,320].map(t=>`<circle cx="${(Math.cos(t*Math.PI/180)*13).toFixed(1)}" cy="${(Math.sin(t*Math.PI/180)*11).toFixed(1)}" r="${3+t%3}" fill="#fff" stroke="#cfdbea" stroke-width="1.2"/>`).join("")}<circle r="8" fill="#fff"/></svg>`;
    $("scene").appendChild(p);setTimeout(()=>p.remove(),600);try{MUSIC.sfx("snowhit")}catch(e){}
    if(b.id&&o.hurt!==false){actPose(b.id,"sit","surprise",4000);actEmote(b.id,"goutte",1400);const f=sF(b.id);if(f){f.el.classList.remove("ouch");void f.el.offsetWidth;f.el.classList.add("ouch")}}
    if(o.then)o.then()}}
// la réplique reste un instant, puis la bulle s'efface le temps d'une scène, et la suite vient toute seule
function talkHold(before,fn,after){const el=$("talk");el.style.pointerEvents="none";
  setTimeout(()=>{el.style.visibility="hidden";try{fn()}catch(e){}setTimeout(()=>{el.style.visibility="";el.style.pointerEvents="";nextLine()},after)},before)}
// les petits objets qu'on se donne dans les histoires (les autres viennent de ITEM, games.js)
const PROP={
  gland:`<g transform="scale(1.4)"><path d="M-10 -2 Q-10 16 0 18 Q10 16 10 -2Z" fill="#c98a5a" stroke="${INK}" stroke-width="2.2"/><path d="M-12 -1.5 Q0 -15 12 -1.5 Q0 3 -12 -1.5Z" fill="#8a5a3a" stroke="${INK}" stroke-width="2.2"/><path d="M0 -8 q2 -5 6 -6" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/></g>`,
  moufle:`<path d="M-11 18 V-4 Q-11 -18 2 -18 Q14 -18 14 -4 V18Z" fill="#e0505a" stroke="${INK}" stroke-width="2.4"/><path d="M-11 0 Q-20 -4 -18 -12 Q-15 -16 -10 -10" fill="#e0505a" stroke="${INK}" stroke-width="2.4"/><rect x="-13" y="12" width="29" height="8" rx="3" fill="#fff3e6" stroke="${INK}" stroke-width="2"/><path d="M2 -10 V2 M-4 -4 L8 -4 M-2 -8 L6 0 M6 -8 L-2 0" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`,
  canne:`<path d="M-18 18 L14 -16" stroke="#a9785a" stroke-width="4" stroke-linecap="round"/><path d="M14 -16 Q20 -8 18 6" fill="none" stroke="${INK}" stroke-width="1.2"/><circle cx="18" cy="8" r="3" fill="#e0505a" stroke="${INK}" stroke-width="1.4"/><circle cx="-8" cy="7" r="4" fill="none" stroke="${INK}" stroke-width="2"/>`,
  pantoufle:`<path d="M-18 8 Q-18 -6 -4 -8 Q10 -10 16 0 Q20 8 14 12 L-14 12 Q-18 12 -18 8Z" fill="#f6c9d4" stroke="${INK}" stroke-width="2.4"/><path d="M-4 -8 Q2 2 16 0" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="6" cy="-6" r="4" fill="#fff" stroke="${INK}" stroke-width="1.8"/>`,
  page:`<path d="M-14 -18 L10 -18 L16 -12 L16 18 L-14 18Z" fill="#fffaf2" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M-8 -8 H10 M-8 -1 H10 M-8 6 H6" stroke="#b9a7b0" stroke-width="2" stroke-linecap="round"/>`,
  chaussette:`<path d="M-6 -18 H8 V4 Q8 10 14 12 Q20 16 14 20 L-2 20 Q-10 20 -8 10Z" fill="#9ec3ef" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M-6 -12 H8 M-6 -6 H8" stroke="#fff" stroke-width="2.4"/><circle cx="1" cy="4" r="3" fill="#c98a5a" stroke="${INK}" stroke-width="1.4"/>`,
  pomme:`<circle cy="3" r="15" fill="#e0505a" stroke="${INK}" stroke-width="2.4"/><path d="M0 -12 q1 -6 4 -8" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M3 -14 q8 -6 12 0 q-6 4 -12 0Z" fill="#8cc06a" stroke="${INK}" stroke-width="1.6"/><path d="M-8 -4 q2 -4 6 -5" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"/>`,
  tarte:`<path d="M-18 10 L16 -14 Q22 -2 18 12Z" fill="#f2c45a" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M-18 10 L18 12 L18 17 L-18 15Z" fill="#d9a06a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M0 0 l6 4 M8 -6 l5 4" stroke="#c97a3a" stroke-width="2" stroke-linecap="round"/>`};
// un renard donne un objet à un autre (ou à un point : la mare, avec un plouf) ; l'objet reste un instant au-dessus de celui
// qui le reçoit, qui est content
function actGive(from,to,k,o={}){const P=v=>typeof v==="string"?(f=>f?{x:f.x,y:f.y-40,id:v}:null)(sF(v)):v,a=P(from),b=P(to);if(!a||!b)return;
  const s=document.createElement("div");s.className="sgive";s.innerHTML=`<svg viewBox="-26 -26 52 52" aria-hidden="true">${PROP[k]||ITEM[k]||""}</svg>`;$("scene").appendChild(s);
  const kf=n=>({left:`${(a.x+(b.x-a.x)*n)/W*100}%`,top:`${(a.y+(b.y-a.y)*n-(o.arc??40)*4*n*(1-n))/H*100}%`});
  try{MUSIC.sfx("whoosh")}catch(e){}
  s.animate([kf(0),kf(.25),kf(.5),kf(.75),kf(1)],{duration:o.ms||750,easing:"ease-in-out",fill:"forwards"}).onfinish=()=>{
    if(!b.id){s.remove();const r=document.createElement("div");r.className="sring";r.style.cssText=pc(b.x,b.y);$("scene").appendChild(r);setTimeout(()=>r.remove(),900);try{MUSIC.sfx("splash")}catch(e){}return}
    try{MUSIC.sfx("pop")}catch(e){}s.style.cssText+=";"+pc(b.x,b.y-16);s.classList.add("held");setTimeout(()=>s.remove(),1700);
    if(o.happy!==false){actPose(b.id,"happy",b.id==="me"?"joy":undefined,5000);actEmote(b.id,"coeur",1600)}}}
// se tourner vers un autre renard, sans bouger
function actFace(id,to){const f=sF(id),t=sF(to);if(!f||!t||f.walk)return;f.el.classList.toggle("left",t.x<f.x)}
// rentrer dans la maison (et y rester jusqu'à ce qu'une scène le fasse ressortir : actGo)
function actIn(id){const f=sF(id);if(!f||f.inside)return;f.fast=1;goTo(f,"door");f.until=Date.now()+9e8}
// aller se mettre à côté d'un autre renard, tourné vers lui
function actNear(id,to,pose="sit"){const f=sF(id),t=sF(to);if(!f||!t||f===t)return;const s=f.x<t.x?-1:1,x=Math.max(26,Math.min(374,t.x+s*40)),y=Math.max(252,Math.min(H-24,t.y+6));
  if(f===meF){meGo({x,y,face:t.x},[pose],20000);return}
  if(Math.hypot(f.x-x,f.y-y)<20)return;actGo(id,x,y,pose)}
Object.assign(PROP,{
  feuilledor:`<path d="M0 20 L0 4 M0 4 L-16 -4 L-10 -6 L-14 -16 L-6 -12 L0 -22 L6 -12 L14 -16 L10 -6 L16 -4Z" fill="#f2c45a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M0 4 V-16 M0 -2 L-9 -7 M0 -2 L9 -7" fill="none" stroke="#c98a2a" stroke-width="1.6"/>`,
  charbon:`<path d="M-14 6 L-10 -10 L4 -14 L14 -4 L12 10 L-4 14Z" fill="#4a4048" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M-6 -6 L2 -9" stroke="#8a8090" stroke-width="2" stroke-linecap="round"/>`,
  goutte:`<path d="M0 -18 Q12 0 11 6 a11 11 0 0 1 -22 0 Q-12 0 0 -18Z" fill="#bfe3f6" stroke="${INK}" stroke-width="2.2"/><path d="M-5 2 q0 -5 3 -8" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none"/>`,
  montre:`<path d="M0 -14 V-20" stroke="#c8a020" stroke-width="3"/><circle cy="-21" r="3" fill="none" stroke="#c8a020" stroke-width="2"/><circle cy="2" r="16" fill="#f2c45a" stroke="${INK}" stroke-width="2.4"/><circle cy="2" r="12" fill="#fffaf2" stroke="${INK}" stroke-width="1.4"/><path d="M0 2 V-6 M0 2 L6 5" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
  coeur:`<path d="M0 16 C-18 4 -16 -12 -7 -12 Q-2 -12 0 -6 Q2 -12 7 -12 C16 -12 18 4 0 16Z" fill="#d9a06a" stroke="${INK}" stroke-width="2.4"/><path d="M0 11 C-11 3 -10 -7 -5 -7 Q-1 -7 0 -3 Q1 -7 5 -7 C10 -7 11 3 0 11Z" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 2"/>`,
  clou:`<path d="M-12 -14 H12 L10 -10 H-10Z" fill="#b9c6d8" stroke="${INK}" stroke-width="2"/><path d="M-3 -10 H3 L1 18 H-1Z" fill="#b9c6d8" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`,
  noeud:`<path d="M0 0 L-18 -10 L-18 10Z M0 0 L18 -10 L18 10Z" fill="#c9a8ec" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle r="5" fill="#a888d8" stroke="${INK}" stroke-width="2"/>`,
  carnet:`<rect x="-14" y="-18" width="28" height="36" rx="3" fill="#8a5a3a" stroke="${INK}" stroke-width="2.2"/><rect x="-9" y="-12" width="18" height="10" rx="2" fill="#fff3e6" stroke="${INK}" stroke-width="1.4"/><path d="M-14 -18 V18" stroke="#5e3c28" stroke-width="4"/><circle cx="0" cy="8" r="4" fill="#f2c45a" stroke="${INK}" stroke-width="1.4"/>`,
  neige:`<circle r="15" fill="#fff" stroke="${INK}" stroke-width="2.4"/><path d="M-7 -6 q4 -4 9 -3 M2 6 q4 1 6 -2" stroke="#cfdbea" stroke-width="2.4" stroke-linecap="round" fill="none"/>`,
  eclat:`<path d="M0 -20 L5 -6 L20 -5 L8 4 L12 19 L0 10 L-12 19 L-8 4 L-20 -5 L-5 -6Z" fill="#ffe27a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle r="4" fill="#fff"/>`,
  bonnet:`<path d="M-16 10 Q-14 -14 4 -16 Q14 -14 18 -4 L12 4 Q14 8 16 10Z" fill="#9ec3ef" stroke="${INK}" stroke-width="2.2"/><rect x="-18" y="8" width="36" height="8" rx="4" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="18" cy="-6" r="4.5" fill="#fff" stroke="${INK}" stroke-width="1.8"/>`,
  ruban:`<path d="M-18 -4 Q-6 -16 0 0 Q6 16 18 4" fill="none" stroke="#f48aa6" stroke-width="7" stroke-linecap="round"/><path d="M-18 -4 Q-6 -16 0 0 Q6 16 18 4" fill="none" stroke="#9ec3ef" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 4"/>`,
  poil:`<path d="M-14 16 Q-12 -4 4 -16 Q12 -20 14 -14 Q2 -6 -6 16Z" fill="#f4f6fa" stroke="${INK}" stroke-width="2.2"/>`,
  tableau:`<rect x="-20" y="-16" width="40" height="32" rx="2" fill="#c98a5a" stroke="${INK}" stroke-width="2.4"/><rect x="-15" y="-11" width="30" height="22" fill="#d7ead0" stroke="${INK}" stroke-width="1.4"/>${[[-8,4,"#f39a5c"],[0,2,"#f0c46a"],[8,4,"#a9b0ba"],[-3,-4,"#f4a8b8"],[5,-4,"#8a5a42"]].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.6" fill="${c}" stroke="${INK}" stroke-width="1"/>`).join("")}`,
  coussin:`<path d="M-18 -8 Q0 -14 18 -8 Q22 0 18 10 Q0 16 -18 10 Q-22 0 -18 -8Z" fill="#c9a8ec" stroke="${INK}" stroke-width="2.4"/><circle r="3" fill="#a888d8" stroke="${INK}" stroke-width="1.4"/><path d="M-10 -2 l3 3 M8 -3 l3 3 M-8 6 l3 -3" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`});
