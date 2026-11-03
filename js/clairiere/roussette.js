/* La Clairière : Roussette (le joueur) vit dans la scène (02/11/2026, Joffray : « avoir notre perso dans la clairière pour
   échanger et pour les interactions »). Elle n'est pas contrôlée, elle suit toute seule (choix de Joffray) : elle se promène,
   rejoint le renard qu'on touche, va au renard ou à l'endroit d'un moment d'histoire, se tourne vers celui qui parle et réagit
   à ses propres répliques. Hors de la liste foxes (les jeux, la maison, les envies ne la comptent pas) ; les actions des
   scènes (scenes.js) la trouvent sous "me". Elle occupe son endroit (taken), les renards ne lui marchent pas dessus. */
const meF={id:"roussette",me:1,spot:null,pose:"sit",x:200,y:330,until:0,walk:null,inside:false};
meF.el=document.createElement("div");meF.el.className="fox mefox";
meF.badge=document.createElement("div");meF.badge.className="fbadge";
meF.el.onpointerdown=e=>{e.stopPropagation();if(shooting){toast("Pas de selfie : touche un renard.");return}
  if(decoMode||gameOn)return;if(!meF.walk)hugFx(meF,{trick:"boing",hearts:false});setTimeout(()=>moiSheet(null,null),450)}; // la toucher ouvre son look
$("actors").appendChild(meF.el);$("lights").appendChild(meF.badge);
// à côté d'un renard (ou d'un endroit), du côté du milieu de la clairière, sans entrer dans la maison
function meBeside(x,y){const s=x>200?-1:1,X=Math.max(26,Math.min(374,x+s*40)),Y=Math.max(252,Math.min(H-24,y+6));return {x:X,y:Y,face:x}}
function foxBase(f){if(f.inside)return {x:DOOR.x,y:DOOR.y+24};if(f.spot&&f.spot.via)return f.spot.via[0];return {x:f.x,y:f.y}}
// y aller (ou rester là si elle y est presque), puis se tourner vers lui
function meGo(p,poses=["sit","happy"],ms=14000){if(gameOn)return;meF.face=p.face;
  if(Math.hypot(meF.x-p.x,meF.y-p.y)<34&&!meF.walk){meFace();meF.until=Date.now()+ms;return}
  goTo(meF,{id:"me",x:p.x,y:p.y,poses});meF.until=Date.now()+ms+4000}
function meFace(){if(meF.face==null||meF.walk)return;meF.el.classList.toggle("left",meF.face<meF.x)}
// on touche un renard : elle vient le voir (pas un sauvage, qui reculerait), et il l'attend un peu
function meJoin(f){if(!f||f.wild||f===meF)return;const b=foxBase(f);if(!f.walk)f.until=Math.max(f.until,Date.now()+9000);meGo(meBeside(b.x,b.y),["happy","sit"])}
// un moment d'histoire : chez le renard, ou à l'endroit qui porte le « ! »
function meStory(at){if(at.startsWith("@")){const t=TG[at.slice(1)];if(t)meGo(meBeside(t.x,Math.max(t.y,300)),["sit"],30000);return}
  const f=foxes.find(x=>x.id===at&&!x.wild);if(f)meJoin(f)}
// pendant le dialogue : elle se tourne vers celui qui parle ; ses propres répliques la font réagir
function meLine(id,expr){if(meF.walk||gameOn)return;
  if(id==="me"){meF.pose=expr==="joy"?"happy":expr==="sad"?"lie":"sit";meF.expr=expr;meF.until=Math.max(meF.until,Date.now()+8000);draw(meF);
    meF.el.classList.remove("mesay");void meF.el.offsetWidth;meF.el.classList.add("mesay");return}
  const f=foxes.find(x=>x.id===id&&!x.wild);if(f){meF.face=f.x;meFace()}}
// où aller quand il ne se passe rien : souvent près d'un renard, sinon un endroit libre (à l'abri sous la pluie)
function meChoose(){if(!$("talk").hidden)return null; // pendant un dialogue, elle reste où elle est
  // le record de Boule-de-Neige (noel.js) : elle s'assoit avec les spectateurs, de dos sous le rond, et ne bouge plus
  if(typeof gardenCleared==="function"&&gardenCleared()){meF.face=null;if(meF.spot&&WATCH.includes(meF.spot)){meF.until=Date.now()+6e4;return null}const bs=typeof bandExtra==="function"&&bandExtra().length?bandSeats():[]; // en bas, à côté de Petit Pois, jamais à la place de la bande
    return [WATCH[10],WATCH[8],...WATCH].find(s=>s.back&&!bs.includes(s)&&s!==WATCH[9]&&!taken(s))||null}
  const free=SPOTS.filter(s=>!taken(s)&&!s.bowl&&!s.lamp&&!s.obj&&!s.deco&&!s.via);
  if(scn.rain){const c=free.filter(s=>s.cov);if(meF.spot&&meF.spot.cov)return null;if(c.length)return c[Math.floor(Math.random()*c.length)];
    return Math.hypot(meF.x-DOOR.x,meF.y-252)<10?null:{id:"me",x:DOOR.x,y:252,poses:["sit","up"]}} // porche plein : devant la porte
  const near=foxes.filter(f=>!f.wild&&!f.walk&&!f.inside&&f.spot&&!f.spot.via&&f.spot.id!=="record"); // pas sur la piste de la boule (noel.js)
  if(!scn.rain&&near.length&&Math.random()<.4){const f=near[Math.floor(Math.random()*near.length)],p=meBeside(f.x,f.y);meF.face=p.face;return {id:"me",...p,poses:["sit","groom","happy","lie"]}}
  meF.face=null;return free[Math.floor(Math.random()*free.length)]||null}
function meTick(){const now=Date.now();
  if(meF.walk){const t=Math.min(1,(now-meF.walk.t0)/meF.walk.dur);meF.el.style.zIndex=Math.round(meF.walk.from.y+(meF.walk.goal.y-meF.walk.from.y)*t);
    if(t>=1){arrive(meF);meFace()}else meF.el.classList.toggle("f1",Math.floor(now/200)%2===1);return}
  if(gameOn||!$("talk").hidden||decoMode||now<meF.until)return;
  const sp=meChoose();if(sp)goTo(meF,sp);else meF.until=now+6000}
{const fs=SPOTS.filter(s=>!taken(s)&&!s.bowl&&!s.lamp&&!s.obj&&!s.deco&&!s.via);place(meF,(scn.rain&&fs.find(s=>s.cov))||SPOT.g3);meF.until=Date.now()+5000}
setInterval(meTick,100);
