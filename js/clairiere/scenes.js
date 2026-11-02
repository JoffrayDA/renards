/* La Clairière : les renards jouent les histoires (02/11/2026, Joffray : « qu'ils interagissent en vrai sur l'écran, en plus
   du dialogue »). Une réplique peut porter une action (4e élément d'une ligne de talk, une fonction), un moment d'histoire une
   petite scène avant le dialogue (show, puis showMs avant les répliques). Les actions : marcher (actGo), prendre une pose
   (actPose), faire une figure (actTrick), réagir (actEmote), lancer une boule de neige (actThrow). */
const sF=id=>id==="me"?meF:foxes.find(f=>f.id===id&&!f.wild); // "me" : Roussette (roussette.js)
function actPose(id,pose,expr,ms=14000){const f=sF(id);if(!f||f.walk||f.inside)return;f.pose=pose;f.expr=expr;f.until=Date.now()+ms;draw(f)}
function actGo(id,x,y,pose="sit"){const f=sF(id);if(!f)return;if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y}
  goTo(f,{id:"act-"+id,x,y,poses:[pose]});f.until=Date.now()+20000}
function actTrick(id,k){const f=sF(id);if(f)hugFx(f,{trick:k,hearts:false})}
// une réaction au-dessus de la tête (pas d'emoji : de petits dessins)
const EMO={
  "!":`<path d="M0 -12 V2" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cy="9" r="2.4" fill="${INK}"/>`,
  "?":`<path d="M-5 -6 q0 -7 6 -7 q6 0 6 6 q0 4 -6 6 v3" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><circle cy="10" r="2.2" fill="${INK}"/>`,
  colere:`<path d="M-8 -8 q4 4 0 8 M8 -8 q-4 4 0 8 M-8 -8 q4 -4 8 0 M8 8 q-4 -4 -8 0" fill="none" stroke="#e0505a" stroke-width="3" stroke-linecap="round"/>`,
  goutte:`<path d="M0 -10 Q6 0 5 4 a5 5 0 0 1 -10 0 Q-6 0 0 -10Z" fill="#bfe3f6" stroke="${INK}" stroke-width="1.8"/>`,
  note:`<path d="M-3 6 V-10 L7 -12 V3" fill="none" stroke="${INK}" stroke-width="2.6"/><ellipse cx="-6" cy="6" rx="4" ry="3" fill="${INK}"/><ellipse cx="4" cy="3" rx="4" ry="3" fill="${INK}"/>`,
  coeur:`<path d="M0 8 C-10 0 -8 -8 -4 -8 Q-1 -8 0 -4 Q1 -8 4 -8 C8 -8 10 0 0 8Z" fill="#f48aa6" stroke="${INK}" stroke-width="1.8"/>`,
  froid:`<path d="M0 -10 V10 M-9 -5 L9 5 M-9 5 L9 -5" stroke="#9ec3ef" stroke-width="3" stroke-linecap="round"/>`};
function actEmote(id,k,ms=2200){const f=sF(id);if(!f)return;const e=document.createElement("div");e.className="emote";
  e.innerHTML=`<svg viewBox="-16 -16 32 32" aria-hidden="true"><circle r="15" fill="#fffaf2" stroke="${INK}" stroke-width="2"/>${EMO[k]||EMO["!"]}</svg>`;
  e.style.cssText=pc(f.x,f.y-62);$("scene").appendChild(e);setTimeout(()=>e.remove(),ms)}
// une boule de neige lancée d'un renard (ou d'un point) vers un autre, en cloche ; à l'arrivée, elle éclate (et la cible sursaute)
function actThrow(from,to,o={}){const P=v=>typeof v==="string"?(f=>f?{x:f.x,y:f.y-30,id:v}:null)(sF(v)):v,a=P(from),b=P(to);if(!a||!b)return;
  const s=document.createElement("div");s.className="sball";s.innerHTML=`<svg viewBox="-12 -12 24 24" aria-hidden="true"><circle r="10" fill="#fff" stroke="${INK}" stroke-width="2.4"/><path d="M-5 -4 q3 -3 7 -2" fill="none" stroke="#cfdbea" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  $("scene").appendChild(s);const k=n=>({left:`${(a.x+(b.x-a.x)*n)/W*100}%`,top:`${(a.y+(b.y-a.y)*n-(o.arc??70)*4*n*(1-n))/H*100}%`});
  try{MUSIC.sfx("swap")}catch(e){}
  s.animate([k(0),k(.25),k(.5),k(.75),k(1)],{duration:o.ms||620,easing:"linear"}).onfinish=()=>{s.remove();
    const p=document.createElement("div");p.className="ssplat";p.style.cssText=pc(b.x,b.y);p.innerHTML=`<svg viewBox="-20 -20 40 40" aria-hidden="true">${[0,50,100,160,210,270,320].map(t=>`<circle cx="${(Math.cos(t*Math.PI/180)*13).toFixed(1)}" cy="${(Math.sin(t*Math.PI/180)*11).toFixed(1)}" r="${3+t%3}" fill="#fff" stroke="#cfdbea" stroke-width="1.2"/>`).join("")}<circle r="8" fill="#fff"/></svg>`;
    $("scene").appendChild(p);setTimeout(()=>p.remove(),600);try{MUSIC.sfx("splash")}catch(e){}
    if(b.id&&o.hurt!==false){actPose(b.id,"sit","surprise",4000);actEmote(b.id,"goutte",1400);const f=sF(b.id);if(f){f.el.classList.remove("ouch");void f.el.offsetWidth;f.el.classList.add("ouch")}}
    if(o.then)o.then()}}
