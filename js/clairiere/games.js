/* La Clairière : les petits jeux d'action des histoires (pêche, arbre, feuilles, lucioles, pose).
   Quelques secondes chacun, sans échec qui punit : raté, on recommence aussitôt.
   playGame(g, done) : g = {k, ...réglages du moment d'histoire, target : le renard touché}, done() une fois gagné.
   Le jeu s'ouvre par-dessus la scène (#play), dans le même repère 400 × 480. */
const SVGNS="http://www.w3.org/2000/svg";
const mk=(p,tag,a={})=>{const e=document.createElementNS(SVGNS,tag);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e};
const grp=(p,html,a={})=>{const g=mk(p,"g",a);g.innerHTML=html;return g};
// relance une animation CSS déjà jouée
const replay=(e,c)=>{e.classList.remove(c);void e.getBoundingClientRect();e.classList.add(c)};
// un renard dessiné dans le SVG du jeu, centré en (x, y) sur une largeur w
const faceAt=(id,x,y,w,expr="joy")=>foxArt(FOX[id],{portrait:1,expr}).replace(/^<svg/,`<svg x="${x-w/2}" y="${y-w/2}" width="${w}" height="${w}"`);
const foxAt=(id,x,y,w,o={pose:"sit"})=>foxArt(typeof id==="string"?FOX[id]:id,o).replace(/^<svg/,`<svg x="${x-w/2}" y="${y-w*.97}" width="${w}" height="${w*.97}"`);
// suivre le doigt dans le jeu : f(point dans le repère 400 × 480, doigt posé ?, "down" | "move")
const svPt=(sv,e)=>{const p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(sv.getScreenCTM().inverse())};
function drag(A,f){const sv=A.sv;let down=false;sv.style.touchAction="none";
  sv.addEventListener("pointerdown",e=>{down=true;f(svPt(sv,e),true,"down")});
  sv.addEventListener("pointermove",e=>{if(down||e.pointerType==="mouse")f(svPt(sv,e),down,"move")});
  for(const k of ["pointerup","pointercancel","pointerleave"])sv.addEventListener(k,()=>{down=false})}

/* ---------- objets trouvés ---------- */
const ITEM={
  // le gland d'or du Professeur Noisette
  acorn:`<g transform="scale(1.5)"><path d="M-11 -2 Q-11 17 0 19 Q11 17 11 -2Z" fill="#f2c45a" ${O}/><path d="M-13 -1.5 Q0 -16 13 -1.5 Q0 3 -13 -1.5Z" fill="#a9785a" ${O}/><path d="M0 -9 q2 -5 6 -7" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M-5 4 q2 6 6 8" fill="none" stroke="#fff8dc" stroke-width="2.2" stroke-linecap="round"/></g>`,
  // la perle du collier de Perle
  pearl:`<circle r="11" fill="#fff4f6" ${O}/><circle cx="-3.5" cy="-3.5" r="3.4" fill="#fff"/><path d="M4 6 q4 -3 4 -8" fill="none" stroke="#f6b3c4" stroke-width="2.4" stroke-linecap="round"/>`,
  key:`<path d="M-4 -12 q-8 -6 -12 0 q4 4 12 0Z M4 -12 q8 -6 12 0 q-4 4 -12 0Z" fill="#e2546e" ${O}/><circle cy="-6" r="8" fill="#f2c45a" ${O}/><circle cy="-6" r="3" fill="#fff8dc" stroke="${INK}" stroke-width="1.8"/><path d="M0 2 V18 M0 12 h6 M0 17 h5" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M0 2 V18 M0 12 h6 M0 17 h5" fill="none" stroke="#f2c45a" stroke-width="3" stroke-linecap="round"/>`,
  jar:`<path d="M-11 -17 h22 v6 h-22Z" fill="#c9a08a" ${O}/><rect x="-14" y="-12" width="28" height="30" rx="9" fill="#e4f3f9" fill-opacity=".85" ${O}/><path d="M-7 -5 q-2 8 0 14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  wool:`<path d="M10 4 q16 6 26 -4 q8 -8 18 0" fill="none" stroke="#e0564f" stroke-width="3" stroke-linecap="round"/><circle r="13" fill="#e0564f" ${O}/><path d="M-9 -6 q9 4 16 -2 M-11 2 q10 5 20 -1 M-6 9 q6 2 12 -2" fill="none" stroke="#b83c38" stroke-width="2.2" stroke-linecap="round"/>`,
  snail:`<path d="M-16 10 q2 -6 10 -6 h18 q6 0 6 6Z" fill="#cfe0a6" ${O}/><circle cx="2" cy="-2" r="11" fill="#f2c45a" ${O}/><path d="M2 -2 m-5 0 a5 5 0 1 1 5 5" fill="none" stroke="${INK}" stroke-width="2"/><path d="M-12 4 l-4 -10 M-9 4 l-1 -10" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
  cone:`<ellipse rx="10" ry="15" fill="#a9785a" ${O}/><path d="M-8 -6 l8 5 l8 -5 M-9 3 l9 5 l9 -5 M-6 11 l6 3 l6 -3" fill="none" stroke="#7a5440" stroke-width="2"/>`,
  pebble:`<ellipse rx="15" ry="10" fill="#cfc6c0" ${O}/><path d="M-7 -3 q4 -3 9 -1" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  fish:`<path d="M-16 0 q14 -14 28 0 q-14 14 -28 0Z M12 0 l10 -8 v16Z" fill="#f59a5b" ${O}/><circle cx="-8" cy="-2" r="2.2" fill="${INK}"/>`,
  boot:`<path d="M-12 -16 h14 v18 h14 q6 0 6 8 v4 h-34Z" fill="#8a6a5a" ${O}/><path d="M-12 -10 h14" stroke="${INK}" stroke-width="2"/>`,
  algae:`<path d="M-10 14 q-6 -12 2 -20 q6 -8 0 -14 M0 14 q6 -10 -2 -18 q-4 -8 4 -14 M10 14 q-4 -10 4 -16" fill="none" stroke="#6f9a60" stroke-width="4" stroke-linecap="round"/>`,
  twig:`<path d="M-18 6 L18 -6 M2 0 l6 -10 M-6 3 l-4 8" fill="none" stroke="#a9785a" stroke-width="4" stroke-linecap="round"/>`,
  // la clochette de Ramure (Noël)
  bell:`<path d="M0 -16 C-9 -16 -11 -8 -11 -1 V5 L-14 10 H14 L11 5 V-1 C11 -8 9 -16 0 -16Z" fill="#f6cc4e" ${O}/><circle cy="13" r="3.6" fill="#e0a52e" ${O}/><path d="M-6 -8 q1 -4 5 -5" fill="none" stroke="#fff6cf" stroke-width="3" stroke-linecap="round"/><path d="M0 -16 l-7 -6 q-2 5 3 6 M0 -16 l7 -6 q2 5 -3 6" fill="#e2445e" ${O}/>`,
  leaf:`<path d="M-16 4 Q0 -18 16 -4 Q0 12 -16 4Z" fill="#b5d68f" ${O}/><path d="M-12 3 Q0 -2 12 -3" fill="none" stroke="#6f9a60" stroke-width="2"/>`
};

const JUNK=[["boot","Une vieille botte… Raté !","Vieille botte"],["algae","Des algues. Beurk.","Algues"],["twig","Une brindille. Bon.","Brindille"],["leaf","Une feuille toute mouillée.","Feuille mouillée"],["pebble","Un caillou. Pas de chance !","Caillou"]];

/* ---------- le moteur ---------- */
let gameOn=false;
function playGame(g,done){
  const el=$("play");let timers=[],raf=0,over=false,cheerN=0;gameOn=true;
  el.innerHTML=`<svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true"></svg><div class="psay" aria-live="polite"></div>`;
  const sv=el.firstChild,sayEl=el.lastChild;
  const api={sv,won:false,tap:null,
    say:t=>{sayEl.textContent=t;replay(sayEl,"pop")},
    // un grand « Bravo ! » au milieu : une étape réussie se voit (Joffray ne voyait pas qu'une suite était validée)
    cheer:t=>{t=t||["BRAVO !","CONTINUE !","SUPER !"][cheerN++%3];const c=document.createElement("div");c.className="cheer";c.textContent=t;el.appendChild(c);setTimeout(()=>c.remove(),1100)},
    later:(f,ms)=>{timers.push(setTimeout(()=>{if(!over)f()},ms))},
    clear:()=>{timers.forEach(clearTimeout);timers=[]},
    loop:f=>{let last=performance.now();const fr=now=>{if(over)return;f(Math.max(0,Math.min(.05,(now-last)/1000)));last=now;raf=requestAnimationFrame(fr)};raf=requestAnimationFrame(fr)},
    // pêche libre : on enchaîne les lancers et on rentre quand on veut
    close:()=>{over=true;api.clear();cancelAnimationFrame(raf);el.hidden=true;el.innerHTML="";gameOn=false;done()},
    win:t=>{if(api.won)return;api.won=true;api.clear();api.say(t);api.cheer("PARFAIT !");
      setTimeout(()=>{over=true;cancelAnimationFrame(raf);el.hidden=true;el.innerHTML="";gameOn=false;done()},1400)}};
  el.onpointerdown=e=>{if(!api.won&&api.tap)api.tap(e)};
  if(g.free){const x=document.createElement("button");x.className="btn pclose";x.type="button";x.textContent="Rentrer";
    x.onpointerdown=e=>{e.stopPropagation();api.close()};el.appendChild(x)}
  el.__api=api; // pour les tests
  el.hidden=false;GAMES[g.k](g,api);
}

const GAMES={
  /* Pêche : vue depuis le ponton, Roussette au premier plan, la rive d'en face et ses reflets, l'heure réelle.
     Une ombre de poisson approche ; elle grignote (ploc, petit rond : pas encore !), puis mord : le bouchon coule,
     gros remous, « ! » et vibration ; il faut toucher tout de suite. La prise saute hors de l'eau et s'affiche sur une carte. */
  fish(g,A){
    const sv=A.sv,BX=262,BY=318,night=dark(),ph=PH[phaseNow()],wet=scn.rain;
    // sous la pluie (jour ou nuit) : ciel couvert, gouttes et ronds dans l'eau, sans soleil, lune ni lucioles
    const SKY=wet?(night?["#1f2540","#3a4062"]:["#a3b1bf","#d2dae0"]):ph.sky,r7=rng(7);
    const CLOUDS=`${[[20,38,42],[96,26,50],[176,40,44],[256,24,52],[336,38,48],[410,26,42]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${night?"#2b3152":"#bcc6cf"}"/>`).join("")}${[[60,70,30],[150,76,34],[240,68,30],[330,74,34]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${night?"#343b60":"#c9d2da"}"/>`).join("")}`;
    const RAINFX=`<g pointer-events="none">${Array.from({length:12},()=>`<ellipse class="rrip" style="animation-delay:${(-r7()*1.4).toFixed(2)}s" cx="${(20+r7()*360).toFixed(0)}" cy="${(175+r7()*290).toFixed(0)}" rx="11" ry="3.6" fill="none" stroke="#fff" stroke-width="1.6" opacity=".8"/>`).join("")}<g stroke="${night?"rgba(200,215,255,.55)":"rgba(255,255,255,.75)"}" stroke-width="1.7" stroke-linecap="round">${Array.from({length:48},()=>`<path class="rd" style="animation-duration:${(.55+r7()*.3).toFixed(2)}s;animation-delay:${(-r7()).toFixed(2)}s" d="M${(r7()*440).toFixed(0)} -20 l-2 14"/>`).join("")}</g></g>`;
    const W0=night?"#4a5f96":wet?"#aac6d2":"#c4e6f2",W1=night?"#26355f":wet?"#6f9cb2":"#7fbad6",TR=night?["#4f6f78","#3e5d66"]:["#9cc796","#7fb27f"],R0=new Array(14).fill(0).map((_,i)=>[i*34-10+(i%2)*12,104+(i%3)*8,22+(i*7)%12]);
    sv.innerHTML=`<defs>
        <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKY[0]}"/><stop offset="1" stop-color="${SKY[1]}"/></linearGradient>
        <linearGradient id="fwat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${W0}"/><stop offset="1" stop-color="${W1}"/></linearGradient>
        <radialGradient id="fglow"><stop offset="0" stop-color="#fff6c8" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient>
        <radialGradient id="fray"><stop offset="0" stop-color="#ffe9a6"/><stop offset="1" stop-color="#ffe9a6" stop-opacity="0"/></radialGradient></defs>
      <rect width="400" height="160" fill="url(#fsky)"/>
      ${wet?CLOUDS:night?`<circle cx="320" cy="52" r="20" fill="#fff4cf"/><circle cx="312" cy="46" r="5" fill="#f1e2b0"/>${[[40,30],[120,58],[200,24],[260,70],[370,22],[90,90]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#fff8d0"/>`).join("")}`
        :`<circle cx="320" cy="52" r="22" fill="#fff3b8" opacity=".9"/>${[[70,46],[200,30]].map(([x,y])=>`<path d="M${x} ${y} q14 -14 30 0 q14 -8 24 4 q-28 8 -54 -4Z" fill="#fff" opacity=".85"/>`).join("")}`}
      <rect y="150" width="400" height="330" fill="url(#fwat)"/>
      <g opacity="${night?.25:.22}">${R0.map(([x,y,r])=>`<ellipse cx="${x}" cy="${300-y+20}" rx="${r}" ry="${r*.55}" fill="${TR[1]}"/>`).join("")}</g>
      <g filter="url(#wobble)">${R0.map(([x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${TR[i%2]}" ${O}/>`).join("")}
        <path d="M-10 132 Q100 118 200 128 Q300 116 410 130 L410 158 Q300 150 200 158 Q100 150 -10 158Z" fill="${night?"#5d7d64":"#a9cf8a"}" ${O}/>
        ${[[36,150],[150,154],[300,150]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="11" ry="5" fill="#d9d2c6" ${O}/>`).join("")}</g>
      ${night&&!wet?`<ellipse cx="320" cy="228" rx="14" ry="4" fill="#fff4cf" opacity=".5" class="shim"/><ellipse cx="320" cy="246" rx="9" ry="3" fill="#fff4cf" opacity=".35" class="shim" style="animation-delay:.7s"/>`:""}
      ${[[80,196,40],[180,230,56],[320,206,36],[120,286,48],[340,280,40],[60,360,30]].map(([x,y,w],i)=>`<path class="shim" style="animation-delay:${(i*.45).toFixed(2)}s" d="M${x-w/2} ${y} q${w/4} -5 ${w/2} 0 t${w/2} 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`).join("")}
      ${[[150,208],[300,250],[210,380],[360,340]].map(([x,y],i)=>`<path class="twk" style="animation-delay:${i*.6}s" d="M${x} ${y-6} q1 5 6 6 q-5 1 -6 6 q-1 -5 -6 -6 q5 -1 6 -6Z" fill="#fff"/>`).join("")}
      <g filter="url(#wobble)">
        ${[[70,214,22,.5],[350,232,26,.5],[44,300,34,.55],[352,388,38,.55],[150,262,16,.45]].map(([x,y,r,k])=>`<path d="M${x} ${y} m-${r} 0 a${r} ${r*k} 0 1 0 ${2*r} 0 a${r} ${r*k} 0 1 0 -${2*r} 0 M${x} ${y} l${r*.92} -${r*k*.5}" fill="${night?"#5f8f6a":"#8fca7a"}" ${O}/>`).join("")}
        <g transform="translate(350 380)"><path d="M0 -4 q-10 -16 0 -24 q10 8 0 24Z M0 -4 q-18 -6 -16 -18 q12 0 16 18Z M0 -4 q18 -6 16 -18 q-12 0 -16 18Z" fill="#f6b3c4" ${O}/><circle cy="-8" r="3.4" fill="#f2c45a" stroke="${INK}" stroke-width="2"/></g></g>
      <g id="shadow" style="transition:transform 1.8s ease-in-out,opacity .4s"><g class="swim" opacity="${night?.5:.38}"><ellipse cx="${BX}" cy="${BY+28}" rx="22" ry="8" fill="${night?"#14203f":"#3f6f86"}"/><path d="M${BX+18} ${BY+28} l14 -8 v16Z" fill="${night?"#14203f":"#3f6f86"}" class="tail"/></g></g>
      <g id="rips"></g>
      <g id="bob" style="transition:transform .14s ease-out,opacity .2s"><g class="bobidle"><ellipse cx="${BX}" cy="${BY+12}" rx="18" ry="4" fill="#fff" opacity=".35"/>
        <g filter="url(#wobble)"><path d="M${BX-9} ${BY} Q${BX} ${BY+10} ${BX+9} ${BY}Z" fill="#fff" ${O}/><path d="M${BX-9} ${BY} Q${BX-9} ${BY-12} ${BX} ${BY-24} Q${BX+9} ${BY-12} ${BX+9} ${BY}Z" fill="#e0564f" ${O}/>
          <path d="M${BX} ${BY-24} v-9" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${BX}" cy="${BY-35}" r="3.4" fill="#ffd36a" stroke="${INK}" stroke-width="2"/>
          <path d="M${BX-4.5} ${BY-5} q0 -6 3 -11" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g></g></g>
      <g class="sway" style="transform-origin:372px 480px">${[[362,300],[378,280],[392,310]].map(([x,y])=>`<path d="M${x} 480 Q${x-4} ${(y+480)/2} ${x} ${y}" fill="none" stroke="#6f9a60" stroke-width="4" stroke-linecap="round"/><rect x="${x-4.5}" y="${y-4}" width="9" height="26" rx="4.5" fill="#a9785a" stroke="${INK}" stroke-width="2.4"/>`).join("")}</g>
      <g class="dfly"${wet?' display="none"':""}><g transform="translate(0 0)"><path d="M0 0 h18" stroke="#6aa6c9" stroke-width="3.4" stroke-linecap="round"/><ellipse class="wing" cx="7" cy="-5" rx="7" ry="3" fill="#e4f3f9" stroke="${INK}" stroke-width="1.4"/><ellipse class="wing" cx="11" cy="-5" rx="7" ry="3" fill="#e4f3f9" stroke="${INK}" stroke-width="1.4"/><circle cx="19" cy="0" r="3" fill="#6aa6c9" stroke="${INK}" stroke-width="1.4"/></g></g>
      ${night&&!wet?[[60,240],[180,190],[300,300],[120,340]].map(([x,y],i)=>`<circle class="ff" style="animation-delay:${-i*1.3}s" cx="${x}" cy="${y}" r="9" fill="url(#fglow)"/>`).join(""):""}
      <g filter="url(#wobble)"><path d="M-10 404 L196 392 L222 480 L-10 480Z" fill="#d9a777" ${O}/>
        ${[418,438,458].map((y,i)=>`<path d="M-10 ${y} L${200+i*7} ${y-4+i}" stroke="#c08a5c" stroke-width="2.2"/>`).join("")}
        <rect x="184" y="388" width="14" height="92" rx="4" fill="#b58460" ${O}/><path d="M8 410 l8 6 M120 400 l6 6" stroke="#a9704e" stroke-width="2.4" stroke-linecap="round"/></g>
      <g id="angler" style="transform-origin:98px 470px">${foxAt("roussette",98,462,138,{pose:"sit"})}
      <g id="rod" style="transform-origin:118px 444px"><path id="line" d="M238 196 Q${BX+6} 250 ${BX} ${BY-37}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".9"/>
        <g filter="url(#wobble)"><path d="M118 444 L238 196" stroke="#a9785a" stroke-width="5.5" stroke-linecap="round"/><path d="M118 444 L134 411" stroke="#d9a06a" stroke-width="9" stroke-linecap="round"/>
        <circle cx="140" cy="402" r="8" fill="#e3dccf" ${O}/><circle cx="140" cy="402" r="2.4" fill="${INK}"/></g></g></g>
      <g id="excl" opacity="0"><circle cx="${BX+42}" cy="${BY-48}" r="18" fill="#ffd36a" stroke="${INK}" stroke-width="3"/><text x="${BX+42}" y="${BY-39}" text-anchor="middle" font-size="23" font-weight="900" fill="${INK}">!</text></g>
      ${wet?RAINFX:""}<g id="hud"></g><g id="leap"></g><g id="card"></g>`;
    const angler=sv.querySelector("#angler"),rod=sv.querySelector("#rod");
    // la canne plie quand ça mord ; on ferre : Roussette se penche en arrière et tire (fort si ça mord, un petit coup sinon)
    const pull=hard=>{rod.classList.remove("tug");replay(rod,hard?"pull":"nudge");replay(angler,hard?"lean":"flinch")};
    const bob=sv.querySelector("#bob"),rips=sv.querySelector("#rips"),ex=sv.querySelector("#excl"),sh=sv.querySelector("#shadow"),card=sv.querySelector("#card"),leap=sv.querySelector("#leap"),hud=sv.querySelector("#hud");
    // pêche libre : cinq petits poissons en haut, qui se remplissent
    const drawHud=()=>{if(!g.free)return;const n=Math.min(g.need,g.have());
      hud.innerHTML=`<g transform="translate(200 82)"><rect x="-96" y="-17" width="192" height="34" rx="17" fill="#fffaf2" opacity=".92" stroke="${INK}" stroke-width="2.4"/>
        ${Array.from({length:g.need},(_,i)=>`<g transform="translate(${(i-(g.need-1)/2)*34} 0) scale(.62)" opacity="${i<n?1:.28}">${ITEM.fish}</g>`).join("")}</g>`};
    let st="wait";
    const ring=(r,w,d=0)=>A.later(()=>{const e=grp(rips,`<ellipse cx="${BX}" cy="${BY+6}" rx="${r}" ry="${r*.34}" fill="none" stroke="#fff" stroke-width="${w}" class="ring"/>`);setTimeout(()=>e.remove(),800)},d);
    const drops=(n,sp)=>{const e=grp(rips,Array.from({length:n},(_,i)=>{const a=-Math.PI*(.15+.7*i/(n-1));return `<circle class="drop" style="--dx:${(Math.cos(a)*sp).toFixed(0)}px;--dy:${(Math.sin(a)*sp).toFixed(0)}px" cx="${BX}" cy="${BY}" r="${3+(i%2)*1.5}" fill="#fff"/>`}).join(""));setTimeout(()=>e.remove(),700)};
    const start=()=>{A.clear();st="wait";card.innerHTML="";leap.innerHTML="";bob.style.opacity=1;bob.style.transform="";ex.setAttribute("opacity",0);sh.style.opacity="";drawHud();
      A.say(g.say||"Attends que le bouchon coule, puis touche vite !");
      // l'ombre arrive de loin et vient tourner sous le bouchon
      const a=Math.random()*6.3;sh.style.transition="none";sh.style.transform=`translate(${(Math.cos(a)*170).toFixed(0)}px,${(Math.abs(Math.sin(a))*90+30).toFixed(0)}px)`;
      A.later(()=>{sh.style.transition="";sh.style.transform="translate(0,0)"},60);
      let nib=1+Math.floor(Math.random()*3);
      const step=()=>{if(nib-->0)A.later(()=>{ring(16,2.2);bob.style.transform="translateY(4px)";A.later(()=>bob.style.transform="",150);A.say("Ploc… ça grignote. Pas encore !");A.later(step,0)},900+Math.random()*900);
        else A.later(()=>{st="bite";bob.style.transform="translateY(24px)";bob.style.opacity=.3;ring(22,3.6);ring(44,2.6,120);ring(66,1.8,240);drops(7,40);ex.setAttribute("opacity",1);replay(ex,"popin");rod.classList.add("tug");A.say("Ça mord ! Touche vite !");
          try{navigator.vibrate&&navigator.vibrate(90)}catch(e){}
          A.later(()=>{if(st==="bite"){st="miss";rod.classList.remove("tug");ex.setAttribute("opacity",0);bob.style.opacity=1;bob.style.transform="";sh.style.opacity=0;A.say("Trop tard… il a filé. On relance !");A.later(start,1400)}},500)},800+Math.random()*1000)};
      A.later(step,1400)};
    // la prise saute hors de l'eau, puis s'affiche sur une carte
    const show=(it,name,sub,fish)=>{
      leap.innerHTML=`<g transform="translate(${BX} ${BY})"><g class="jumpout"><g transform="scale(1.4)">${ITEM[it]}</g></g></g>`;drops(9,56);ring(30,3);ring(54,2,140);
      drawHud();A.later(()=>{leap.innerHTML="";const slots=fish&&g.free?`<g transform="translate(0 92)">${Array.from({length:g.need},(_,i)=>`<g transform="translate(${(i-(g.need-1)/2)*28} 0) scale(.5)" opacity="${i<Math.min(g.need,g.have())?1:.25}">${ITEM.fish}</g>`).join("")}</g>`:"";
        card.innerHTML=`<g transform="translate(200 236)"><g class="spin">${Array.from({length:12},(_,i)=>`<path d="M0 0 L${(Math.cos(i*Math.PI/6-.12)*170).toFixed(0)} ${(Math.sin(i*Math.PI/6-.12)*170).toFixed(0)} L${(Math.cos(i*Math.PI/6+.12)*170).toFixed(0)} ${(Math.sin(i*Math.PI/6+.12)*170).toFixed(0)}Z" fill="#fff3c4" opacity="${fish?.75:.4}"/>`).join("")}</g>
          <g class="cardin"><rect x="-104" y="-76" width="208" height="${fish&&g.free?190:160}" rx="26" fill="#fffaf2" stroke="${INK}" stroke-width="3.4"/>
          <circle cy="-18" r="44" fill="url(#fray)"/><g transform="translate(0 -18) scale(2.4)">${ITEM[it]}</g>
          <text y="46" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="18" fill="${INK}">${name}</text>
          <text y="68" text-anchor="middle" font-size="13" font-weight="700" fill="#8f7a86">${sub}</text>${slots}</g></g>`},520)};
    A.tap=()=>{
      if(st==="wait"){st="miss";A.clear();pull(0);bob.style.transform="";sh.style.transform=`translate(${(Math.random()<.5?-1:1)*220}px,60px)`;ring(16,2);A.say("Trop tôt ! Le poisson a eu peur. On relance !");A.later(start,1500)}
      else if(st==="bite"){st="won";pull(1);ex.setAttribute("opacity",0);bob.style.opacity=0;sh.style.opacity=0;
        // pêche libre : un poisson une fois sur trois (Joffray : une sur dix, « trop long »), sinon ce qui traîne au fond de la mare ;
        // jamais plus de deux prises d'affilée sans poisson (R.fishDry) : Joffray en avait raté dix de suite (29/10/2026)
        const j=g.free&&(R.fishDry||0)<2&&Math.random()>=1/3?JUNK[Math.floor(Math.random()*JUNK.length)]:null;
        if(g.free){R.fishDry=j?(R.fishDry||0)+1:0;save()}
        if(j){show(j[0],j[2],j[1],false);A.say("Ce n'est pas un poisson… On relance ?");A.later(start,2300)}
        else if(!g.free){show("fish","Un poisson !","Tout orange, avec de grands yeux.",true);A.win(g.win||"Attrapé !")}
        else{const t=g.onFish();show("fish","Un poisson !",g.have()>=g.need?"De quoi remplir la gamelle !":`${g.have()} sur ${g.need} pour la gamelle`,true);A.say(t);A.later(start,2600)}}};
    start();
  },

  /* Secouer l'arbre : chaque toucher fait tomber des feuilles ; au bout de quelques coups, l'objet tombe.
     Avec catch : il tombe au milieu de pommes de pin, il faut le toucher en l'air avant qu'il se casse par terre. */
  shake(g,A){
    const sv=A.sv,n=g.n||7,it=g.item||"jar";let k=0,st="shake",dn=0;
    sv.innerHTML=`<rect width="400" height="480" fill="#bfe0f2"/><rect y="380" width="400" height="100" fill="#bcd99a"/>
      <g filter="url(#wobble)"><path d="M178 470 Q186 380 180 260 L222 260 Q216 380 226 470Z" fill="#a9785a" ${O}/></g>
      <g id="crown" class="crown"><g filter="url(#wobble)">${[[200,170,92],[120,200,60],[284,200,62],[160,110,58],[246,112,60]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#8dbd86" ${O}/>`).join("")}
        ${[[150,180],[250,150],[205,230],[290,215],[120,140]].map(([x,y])=>`<path d="M${x} ${y} q8 -6 16 0" fill="none" stroke="#6f9a60" stroke-width="3" stroke-linecap="round"/>`).join("")}</g>
        <g id="hang" transform="translate(232 196) scale(.8)" opacity=".9">${ITEM[it]}</g></g>
      <g id="fx"></g><g id="air"></g><g id="drop" opacity="0"><g transform="translate(232 196) scale(.8)">${ITEM[it]}</g></g>`;
    A.say(g.say||"Secoue l'arbre : touche-le plusieurs fois !");
    const crown=sv.querySelector("#crown"),fx=sv.querySelector("#fx"),air=sv.querySelector("#air"),hang=sv.querySelector("#hang");
    // la chute : l'objet (et des pommes de pin pour brouiller) tombent ; on touche l'objet en l'air
    const drop=()=>{st="fall";const D=++dn;hang.setAttribute("opacity",0);air.innerHTML="";
      const fs=[{it,x:150+Math.random()*100,good:1},{it:"cone",x:110+Math.random()*60},{it:"cone",x:240+Math.random()*60}].map((o,i)=>({...o,y:150+i*14,vy:-60-i*30,vx:(Math.random()-.5)*50,r:0,
        el:grp(air,`<g transform="scale(${o.good?1.25:1})">${ITEM[o.it]}</g><circle r="${o.good?40:26}" fill="transparent"/>`,o.good?{"data-g":1}:{})}));
      fs.forEach(f=>{f.el.style.cursor="pointer";f.el.onpointerdown=e=>{e.stopPropagation();if(st!=="fall")return;
        if(f.good){st="won";f.el.classList.add("popin");A.win(g.win||"Rattrapé !")}else{f.el.remove();f.gone=1;A.say(it==="jar"?"Une pomme de pin ! Le bocal, vite !":"Une pomme de pin ! Pas celle-là, vite !")}}});
      A.say("Il tombe ! Attrape-le avant qu'il touche le sol !");
      A.loop(dt=>{if(st!=="fall"||D!==dn)return;for(const f of fs){if(f.gone)continue;f.vy+=560*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.r+=f.vx*dt*1.5;
        if(f.y>=404){if(f.good){st="broke";f.el.innerHTML=it==="jar"?`<path d="M-16 4 l8 -10 l4 8 l6 -12 l4 14 l8 -6 l2 10Z" fill="#e4f3f9" ${O}/>`:`<g opacity=".45">${ITEM[it]}</g>`;f.el.setAttribute("transform",`translate(${f.x.toFixed(0)} 404)`);
            try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}
            A.say(it==="jar"?"Crac ! Il s'est cassé… Il y en a un autre là-haut. Secoue encore !":"Raté, il s'est perdu dans l'herbe… Il en reste un là-haut. Secoue encore !");A.later(()=>{air.innerHTML="";hang.setAttribute("opacity",.9);k=n-3;st="shake"},1400);return}
          f.gone=1;f.el.remove();continue}
        f.el.setAttribute("transform",`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.r.toFixed(0)})`)}})};
    A.tap=()=>{if(st!=="shake")return;replay(crown,"shk");k++;
      for(let i=0;i<2;i++){const x=110+Math.random()*180,c=["#8dbd86","#b5d68f","#f2a35c"][Math.floor(Math.random()*3)];
        const l=grp(fx,`<path d="M-8 0 Q0 -8 8 0 Q0 6 -8 0Z" fill="${c}" stroke="${INK}" stroke-width="2"/>`,{transform:`translate(${x} ${120+Math.random()*100})`});
        const f=mk(l,"animateTransform",{attributeName:"transform",type:"translate",additive:"sum",from:"0 0",to:`${(Math.random()-.5)*60} 300`,dur:"1.2s",fill:"freeze"});f.beginElement();setTimeout(()=>l.remove(),1300)}
      if(k===n){if(g.catch)return drop();st="won";hang.remove();const d=sv.querySelector("#drop");d.setAttribute("opacity",1);d.classList.add("fall");A.win(g.win||"Quelque chose est tombé !")}
      else if(k===Math.ceil(n/2))A.say("Encore ! Quelque chose bouge là-haut…")};
  },

  /* Fouiller : des tas de feuilles ; l'objet est sous celui qui frémit de temps en temps (le vent fait bouger tous les tas,
     ça ne compte pas). Trois essais ; raté trois fois, l'objet file sous un autre tas. */
  search(g,A){
    const sv=A.sv,P=[[88,150],[206,128],[322,166],[136,262],[272,284],[80,388],[214,402],[330,380]],tries=g.tries||3,
      gags=[["snail","Un escargot. Il n'a rien vu."],["cone","Une pomme de pin. Pas ça…"],["pebble","Un caillou tout lisse."],["leaf","Rien que des feuilles."]];
    let good=0,left=tries,st="look",gen=0;
    sv.innerHTML=`<rect width="400" height="480" fill="#c9e2a4"/>${Array.from({length:30},(_,i)=>{const x=(i*137)%400,y=(i*89)%480;return `<path d="M${x} ${y} l-3 -6 M${x} ${y} l0 -7 M${x} ${y} l3 -6" stroke="#86b06e" stroke-width="2" stroke-linecap="round"/>`}).join("")}<g id="its"></g><g id="piles"></g>`;
    const its=sv.querySelector("#its"),box=sv.querySelector("#piles");
    const piles=P.map(([x,y],i)=>{const it=grp(its,"",{transform:`translate(${x} ${y})`,opacity:0});
      const pile=grp(box,`<g class="pin"><g filter="url(#wobble)">${[[-26,4,"#f2a35c",-12],[0,-8,"#e8794e",8],[24,2,"#f6c065",-4],[-10,10,"#e98a5a",14],[14,12,"#f2a35c",-8],[0,0,"#f6c065",4]].map(([dx,dy,c,r])=>`<path d="M${dx-20} ${dy} Q${dx} ${dy-20} ${dx+20} ${dy} Q${dx} ${dy+8} ${dx-20} ${dy}Z" fill="${c}" transform="rotate(${r} ${dx} ${dy})" ${O}/>`).join("")}</g></g>`,{transform:`translate(${x} ${y})`,class:"pile"});
      pile.onpointerdown=e=>{e.stopPropagation();pick(i)};return {pile,it,pin:pile.firstChild}});
    const shown=(i,k)=>{const p=piles[i];p.it.innerHTML=ITEM[k];p.it.setAttribute("opacity",1);replay(p.it,"popin")};
    // le bon tas frémit ; de temps en temps, une rafale fait bouger tous les tas
    const rustle=G=>{if(G!==gen||st!=="look")return;
      if(Math.random()<.35)replay(box,"gust");else replay(piles[good].pin,"shiv");
      A.later(()=>rustle(G),1200+Math.random()*1300)};
    const round=()=>{gen++;st="look";left=tries;good=Math.floor(Math.random()*P.length);
      piles.forEach((p,i)=>{p.pile.classList.remove("gone");p.pile.toggleAttribute("data-g",i===good);p.it.setAttribute("opacity",0);p.it.innerHTML=""});
      A.say(g.say||`La laine est sous un des tas : il frémit quand elle bouge. Regarde bien… ${tries} essais !`);
      const G=gen;A.later(()=>rustle(G),900)};
    const pick=i=>{const p=piles[i];if(A.won||st!=="look"||p.pile.classList.contains("gone"))return;p.pile.classList.add("gone");
      if(i===good){st="won";shown(i,g.item||"wool");A.win(g.win||"Trouvé !");return}
      const [gi,t]=gags[Math.floor(Math.random()*gags.length)];shown(i,gi);left--;
      if(left>0)A.say(`${t} Encore ${left} essai${left>1?"s":""} !`);
      else{st="lost";piles[good].pile.classList.add("gone");shown(good,g.item||"wool");A.say("Raté ! C'était là… et ça file sous un autre tas. On recommence !");A.later(round,2200)}};
    round();
  },

  /* Attraper : des lucioles volent dans tous les sens ; on les touche une à une. */
  catch(g,A){
    const sv=A.sv,n=g.n||5,page=g.thing==="page",xmas=g.thing==="bell"||g.thing==="ball";let got=0;
    // Noël : ciel d'hiver et neige ; grelots de Grelot ou boules de Paillette
    sv.innerHTML=xmas?`<rect width="400" height="480" fill="#cfe3f2"/><path d="M0 320 Q100 296 200 314 Q300 296 400 320 V480 H0Z" fill="#f4f8fc" stroke="${INK}" stroke-width="2.4"/>${Array.from({length:30},(_,i)=>`<circle cx="${(i*137)%400}" cy="${(i*71)%300}" r="${1.4+i%3}" fill="#fff" opacity=".9"/>`).join("")}`:page?`<rect width="400" height="480" fill="#bfe0f2"/><path d="M0 300 Q100 280 200 296 Q300 280 400 300 V480 H0Z" fill="#bcd99a"/>
      ${[[60,90],[300,60],[200,140]].map(([x,y])=>`<path d="M${x} ${y} q20 -18 40 0 q16 -10 30 4 q-35 10 -70 -4Z" fill="#fff" opacity=".9"/>`).join("")}`:`<defs><radialGradient id="lg"><stop offset="0" stop-color="#fff6a0"/><stop offset=".35" stop-color="#ffe46a" stop-opacity=".8"/><stop offset="1" stop-color="#ffe46a" stop-opacity="0"/></radialGradient></defs>
      <rect width="400" height="480" fill="#3a3f78"/><path d="M0 330 Q100 300 200 320 Q300 300 400 330 V480 H0Z" fill="#4b6a5a"/>
      ${Array.from({length:18},(_,i)=>`<circle cx="${(i*97)%400}" cy="${(i*53)%260}" r="1.4" fill="#fff8d0" opacity=".8"/>`).join("")}`;
    let bugs0=0;const bugs=Array.from({length:n},()=>{const b={x:60+Math.random()*280,y:80+Math.random()*300,a:Math.random()*6.3,s:70+Math.random()*50};
      b.el=grp(sv,xmas?(g.thing==="bell"?`<g filter="url(#wobble)">${ITEM.bell}</g><circle r="26" fill="transparent"/>`
          :`<g filter="url(#wobble)"><circle r="13" fill="${["#e2445e","#5aa0dc","#f2c45a","#9a6ad6","#5fae6c"][bugs0++%5]}" stroke="${INK}" stroke-width="2.4"/><rect x="-4" y="-18" width="8" height="6" rx="1.4" fill="#f2c45a" stroke="${INK}" stroke-width="2"/></g><circle cx="-4" cy="-4" r="3.4" fill="#fff" opacity=".8"/><circle r="26" fill="transparent"/>`):page?`<g filter="url(#wobble)"><rect x="-13" y="-16" width="26" height="32" rx="3" fill="#fffaf0" stroke="${INK}" stroke-width="2.4"/><path d="M-8 -9 h16 M-8 -3 h16 M-8 3 h11 M-8 9 h14" stroke="#cdb9ad" stroke-width="2"/></g><circle r="26" fill="transparent"/>`
        :`<circle r="30" fill="url(#lg)"/><circle r="5" fill="#fffbe0"/><circle r="26" fill="transparent"/>`);
      b.el.style.cursor="pointer";
      b.el.onpointerdown=e=>{e.stopPropagation();if(b.got||A.won)return;b.got=1;got++;b.el.classList.add("caught");setTimeout(()=>b.el.remove(),400);
        if(got===n)A.win(g.win||(xmas?"Tous attrapés !":page?"Toutes les pages !":"Toutes attrapées !"));else A.say(`${got} sur ${n}… encore !`)};
      return b});
    A.say(g.say||`Attrape les ${n} lucioles !`);
    A.loop(dt=>{for(const b of bugs){if(b.got)continue;b.a+=(Math.random()-.5)*4*dt;b.x+=Math.cos(b.a)*b.s*dt;b.y+=Math.sin(b.a)*b.s*dt;
      if(b.x<30||b.x>370)b.a=Math.PI-b.a;if(b.y<60||b.y>420)b.a=-b.a;b.x=Math.max(30,Math.min(370,b.x));b.y=Math.max(60,Math.min(420,b.y));
      b.el.setAttribute("transform",`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`+(page?` rotate(${(Math.sin(b.a*3)*25).toFixed(0)})`:""))}});
  },

  /* Lucioles : un nuage de lucioles de toutes les couleurs, et une seule dorée, très vive, qui zigzague.
     Toucher une autre la fait s'écarter ; il faut attraper la dorée. */
  firefly(g,A){
    const sv=A.sv,COL=["#ff9ec4","#8fd3ff","#a6f08a","#c9a6ff","#ff7a8a","#7ff0d8"];let done=0;
    sv.innerHTML=`<defs>${COL.map((c,i)=>`<radialGradient id="ffc${i}"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="${c}" stop-opacity=".85"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join("")}
        <radialGradient id="ffsky" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#7a6bb8" stop-opacity=".7"/><stop offset="1" stop-color="#3a3f78" stop-opacity="0"/></radialGradient><radialGradient id="ffg"><stop offset="0" stop-color="#fffbe0"/><stop offset=".3" stop-color="#ffd23a"/><stop offset="1" stop-color="#ffb800" stop-opacity="0"/></radialGradient></defs>
      <rect width="400" height="480" fill="#3a3f78"/><rect width="400" height="480" fill="url(#ffsky)"/><circle cx="61" cy="239" r="90" fill="url(#ffg)" opacity=".35"/>${Array.from({length:22},(_,i)=>`<circle class="twk" style="animation-delay:${(i*.37%3).toFixed(2)}s" cx="${(i*97)%400}" cy="${(i*53)%240}" r="1.4" fill="#fff8d0"/>`).join("")}
      <g filter="url(#wobble)"><path d="M0 340 Q100 310 200 330 Q300 310 400 340 V480 H0Z" fill="#4b6a5a" ${O}/>
        <rect x="56" y="250" width="10" height="110" rx="4" fill="#7a5a4a" ${O}/><rect x="44" y="222" width="34" height="34" rx="9" fill="#ffe9a6" ${O}/></g>
      <g id="flies"></g>`;
    const box=sv.querySelector("#flies");
    const mkFly=(gold,i)=>{const b={gold,x:40+Math.random()*320,y:70+Math.random()*290,a:Math.random()*6.3,s:gold?330:45+Math.random()*45,t:Math.random()*9,flee:0};
      b.el=grp(box,gold?`<circle r="50" fill="url(#ffg)" class="glim"/><circle r="6" fill="#fffbe0" stroke="#ffb800" stroke-width="2"/><circle r="34" fill="transparent"/>`
        :`<circle r="${26+Math.random()*14}" fill="url(#ffc${i%COL.length})" class="glim" style="animation-delay:${(-Math.random()*2).toFixed(2)}s"/><circle r="3.6" fill="#fff"/><circle r="22" fill="transparent"/>`);
      b.el.style.cursor="pointer";
      b.el.onpointerdown=e=>{e.stopPropagation();if(done||A.won)return;
        if(b.gold){done=1;b.el.classList.add("caught");A.win(g.win||"Attrapée !")}
        else{b.flee=.6;b.s=180;b.a+=Math.PI;A.say(g.miss||"Pas celle-là ! Cherche la dorée !")}};
      return b};
    const flies=[...Array.from({length:28},(_,i)=>mkFly(0,i)),mkFly(1)];box.appendChild(flies[28].el); // la dorée passe devant
    A.say(g.say||"Attrape la luciole dorée !");
    A.loop(dt=>{for(const b of flies){if(done&&b.gold)continue;b.t+=dt;
      if(b.flee>0&&(b.flee-=dt)<=0)b.s=45+Math.random()*45;
      // la dorée change souvent de direction, d'un coup
      if(b.gold&&Math.random()<dt*3)b.a+=(Math.random()-.5)*3.6;else b.a+=(Math.random()-.5)*(b.gold?6:2.5)*dt;
      b.x+=Math.cos(b.a)*b.s*dt;b.y+=Math.sin(b.a)*b.s*dt+Math.sin(b.t*3)*.4;
      if(b.x<30||b.x>370)b.a=Math.PI-b.a;if(b.y<60||b.y>400)b.a=-b.a;b.x=Math.max(30,Math.min(370,b.x));b.y=Math.max(60,Math.min(400,b.y));
      b.el.setAttribute("transform",`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`)}});
  },

  /* Ricochets : un toucher par rebond, quand le curseur passe dans la petite zone verte ; il accélère à chaque rebond.
     Un raté et le caillou coule : on recommence. Il faut need rebonds d'affilée. */
  ricochet(g,A){
    const sv=A.sv,need=g.need||4,X0=40,WG=320,HALF=26;let t=0,k=0,per=.9,st="aim";
    sv.innerHTML=`<rect width="400" height="480" fill="#bfe0f2"/><g filter="url(#wobble)"><path d="M0 170 Q100 150 200 164 Q300 150 400 170 V200 H0Z" fill="#8dbd86" ${O}/></g>
      <rect y="196" width="400" height="200" fill="#a9d3e6"/><path d="M60 240 q30 -8 60 0 M220 300 q26 -8 52 0 M120 350 q24 -6 48 0" fill="none" stroke="#e4f3f9" stroke-width="3" stroke-linecap="round"/>
      <rect y="392" width="400" height="88" fill="#d9c6a4"/><g id="rings"></g><g id="pips"></g>
      <circle id="stone" cx="40" cy="300" r="9" fill="#cfc6c0" stroke="${INK}" stroke-width="2.6" style="transition:transform .16s ease-out,opacity .3s"/>
      <rect x="${X0}" y="420" width="${WG}" height="24" rx="12" fill="#f6b3a8" stroke="${INK}" stroke-width="3"/>
      <rect x="${200-HALF}" y="423" width="${2*HALF}" height="18" fill="#a9d68f"/>
      <rect id="cur" x="${X0}" y="412" width="8" height="40" rx="4" fill="${INK}"/>`;
    const cur=sv.querySelector("#cur"),stone=sv.querySelector("#stone"),rings=sv.querySelector("#rings"),pips=sv.querySelector("#pips");
    const drawPips=()=>pips.innerHTML=Array.from({length:need},(_,i)=>`<circle cx="${200+(i-(need-1)/2)*30}" cy="118" r="10" fill="${i<k?"#a9d68f":"#fff"}" stroke="${INK}" stroke-width="2.6"/>`).join("");
    const reset=()=>{k=0;per=.9;t=0;st="aim";stone.style.transform="";stone.style.opacity=1;rings.innerHTML="";drawPips();A.say(g.say||`Touche dans le vert à chaque rebond : ${need} d'affilée !`)};
    const pos=()=>(1-Math.cos(t*Math.PI/per))/2;
    A.loop(dt=>{if(st!=="aim")return;t+=dt;cur.setAttribute("x",(X0+pos()*WG-4).toFixed(1))});
    A.tap=()=>{if(st!=="aim")return;
      const x=X0+pos()*WG,y=300-k*10;
      if(Math.abs(x-200)<=HALF+2){k++;drawPips();const sx=40+k*62;
        stone.style.transform=`translate(${sx-40}px,${y-300-24}px)`;
        A.later(()=>{stone.style.transform=`translate(${sx-40}px,${y-300}px)`;grp(rings,`<ellipse cx="${sx}" cy="${y+6}" rx="14" ry="5" fill="none" stroke="#fff" stroke-width="3" class="ring"/>`)},160);
        if(k>=need){st="done";A.win(g.win||`${k} rebonds !`)}
        else{per=Math.max(.5,per-.12);t=per;A.say(`${k} rebond${k>1?"s":""}… encore !`)}}
      else{st="sink";stone.style.opacity=0;grp(rings,`<ellipse cx="${40+k*62+30}" cy="${y+8}" rx="18" ry="6" fill="none" stroke="#fff" stroke-width="3" class="ring"/>`);
        A.say(k?`Plouf ! ${k} rebond${k>1?"s":""} seulement. On recommence !`:"Plouf ! Raté. On recommence !");A.later(reset,1300)}};
    reset();
  },

  /* Le jeu des coussins (Pantoufle) : le renard se cache sous un des coussins du porche, les coussins se mélangent,
     il faut toucher le bon. 3 manches, de plus en plus rapides. Raté : on voit où il était, et on refait la manche. */
  cushion(g,A){
    const sv=A.sv,id=g.who||g.target,name=FOX[id].name,RD=g.rounds||[[3,4,.5],[3,7,.36],[4,9,.3]],Y=338,
      COL=["#f6b3c4","#9ec3ef","#f2d27a"],LOOT=[["wool","une pelote de laine"],["cone","une pomme de pin"],["leaf","une feuille"],["pebble","un caillou"]];
    let r=0,st="show",cs=[],under=null,sw=null,q=[];
    sv.innerHTML=`<rect width="400" height="480" fill="#bcd99a"/><g filter="url(#wobble)">
      <rect x="-10" y="40" width="420" height="230" fill="#f0c99a" ${O}/>${[80,120,160,200,240].map(y=>`<path d="M0 ${y} H400" stroke="#d9ac7c" stroke-width="2"/>`).join("")}
      ${[40,280].map(x=>`<rect x="${x}" y="100" width="80" height="72" rx="8" fill="#ffe9a6" ${O}/><path d="M${x+40} 100 V172 M${x} 136 H${x+80}" stroke="${INK}" stroke-width="3"/>`).join("")}
      <path d="M156 270 V140 Q200 104 244 140 V270Z" fill="#6a4434" ${O}/><circle cx="232" cy="210" r="4" fill="#f2c45a"/>
      <path d="M-10 18 H410 V58 H-10Z" fill="#d98b7a" ${O}/>
      <rect x="-10" y="262" width="420" height="230" fill="#d9a777" ${O}/>${[300,340,380,420,460].map(y=>`<path d="M0 ${y} H400" stroke="#c08a5c" stroke-width="2"/>`).join("")}</g>
      <g id="pips"></g><g id="loot"></g><g id="fx" style="opacity:0">${foxAt(id,0,0,100,{pose:"sit"})}</g><g id="cush"></g>`;
    const fx=sv.querySelector("#fx"),loot=sv.querySelector("#loot"),box=sv.querySelector("#cush"),pips=sv.querySelector("#pips");
    const X=(i,n)=>200+(i-(n-1)/2)*(n>3?94:124);
    const put=(e,x,y,t)=>{e.style.transition=t||"none";e.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`};
    const fox=(x,y,pose,t)=>{fx.innerHTML=foxAt(id,0,0,100,{pose});put(fx,x,y,t||"transform .35s cubic-bezier(.3,1.5,.5,1),opacity .25s")};
    const pillow=c=>`<ellipse cy="40" rx="54" ry="9" fill="#5b4250" opacity=".14"/><g filter="url(#wobble)"><path d="M-54 -30 Q0 -44 54 -30 Q66 0 54 30 Q0 44 -54 30 Q-66 0 -54 -30Z" fill="${c}" ${O}/>
      <path d="M-40 -21 Q0 -31 40 -21 M-40 21 Q0 31 40 21" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 6" opacity=".85"/></g>
      <circle r="5.5" fill="#fff" stroke="${INK}" stroke-width="2.2"/>${[[-56,-30],[56,-30],[-56,30],[56,30]].map(([x,y])=>`<path d="M${x} ${y} l${x<0?-8:8} ${y<0?-6:6}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`).join("")}
      <rect x="-64" y="-50" width="128" height="96" fill="transparent"/>`;
    const drawPips=()=>pips.innerHTML=RD.map((_,i)=>`<circle cx="${200+(i-(RD.length-1)/2)*30}" cy="452" r="9" fill="${i<r?"#a9d68f":"#fff"}" stroke="${INK}" stroke-width="2.6"/>`).join("");
    const start=()=>{const [n,k,d]=RD[r];st="show";sw=null;q=[];loot.innerHTML="";box.innerHTML="";drawPips();
      // tous pareils, sinon on suivrait la couleur
      cs=Array.from({length:n},(_,i)=>{const c={slot:i,el:grp(box,pillow(COL[r%COL.length]),{class:"cush"})};c.el.style.cursor="pointer";put(c.el,X(i,n),Y);
        c.el.onpointerdown=e=>{e.stopPropagation();pick(c)};return c});
      under=cs[Math.floor(Math.random()*n)];under.el.dataset.g=1; // data-g : la bonne réponse, pour les tests
      fox(X(under.slot,n),Y-26,"happy","none");fx.style.opacity=1;
      A.say(r?`Encore ! Plus vite, cette fois. Regarde où se cache ${name}…`:`${name} se cache sous un coussin. Regarde bien lequel !`);
      A.later(()=>{fox(X(under.slot,n),Y+40,"sit");fx.style.opacity=0;replay(under.el,"squish")},1300);
      A.later(()=>{A.say("Les coussins se mélangent ! Suis le bon des yeux…");
        let last="";for(let i=0;i<k;i++){let a,b,key;do{a=Math.floor(Math.random()*n);b=Math.floor(Math.random()*n);key=Math.min(a,b)+"-"+Math.max(a,b)}while(a===b||key===last);last=key;q.push([a,b])}
        next()},2000)};
    // un échange : les deux coussins passent l'un devant, l'autre derrière, en arc
    const next=()=>{if(!q.length){st="pick";A.say(`Où est ${name} ? Touche son coussin !`);return}
      const [a,b]=q.shift();sw={a:cs.find(c=>c.slot===a),b:cs.find(c=>c.slot===b),t:0,d:RD[r][2]};
      box.appendChild(sw.a.el)};
    A.loop(dt=>{if(!sw)return;const n=RD[r][0];sw.t=Math.min(1,sw.t+dt/sw.d);const t=sw.t,e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,h=Math.sin(Math.PI*e)*30;
      const xa=X(sw.a.slot,n),xb=X(sw.b.slot,n);put(sw.a.el,xa+(xb-xa)*e,Y+h);put(sw.b.el,xb+(xa-xb)*e,Y-h);
      if(t>=1){const s=sw.a.slot;sw.a.slot=sw.b.slot;sw.b.slot=s;sw=null;next()}});
    const lift=c=>{const x=X(c.slot,RD[r][0]);put(c.el,x,Y-136,"transform .3s cubic-bezier(.3,1.4,.5,1)");return x};
    const pick=c=>{if(st!=="pick"||A.won)return;st="reveal";const x=lift(c);
      if(c===under){fox(x,Y+40,"happy","none");fx.style.opacity=1;A.later(()=>fox(x,Y+26,"happy"),20);r++;drawPips();
        if(r>=RD.length)A.win(g.win||"Trouvé !");
        else{A.cheer("TROUVÉ !");A.say(["Trouvé ! Il rigole sous son coussin.","Bien vu ! Il n'en revient pas."][r-1]||"Trouvé !");A.later(start,1500)}}
      else{const [it,nm]=LOOT[Math.floor(Math.random()*LOOT.length)];grp(loot,`<g transform="translate(${x} ${Y+10}) scale(1.6)">${ITEM[it]}</g>`);
        A.say(`Raté, juste ${nm} !`);
        A.later(()=>{const xu=lift(under);fox(xu,Y+40,"happy","none");fx.style.opacity=1;A.later(()=>fox(xu,Y+26,"happy"),20);A.say(`Hi hi ! ${name} était là. On refait cette manche !`)},700);
        A.later(start,2600)}};
    start();
  },

  /* Les chaussettes dépareillées (Mamie Brindille) : un memory. On voit toutes les chaussettes un instant,
     puis on les retourne deux par deux pour refaire les paires. À mi-chemin, un coup de vent mélange celles qui restent. */
  memory(g,A){
    const sv=A.sv,SK=[["#e0564f","stripe"],["#9ec3ef","dot"],["#a9d68f","heart"],["#f2d27a","star"],["#c9a6ff","stripe"],["#ffb36a","dot"]],K=SK.length,
      XY=i=>[72+(i%3)*128,120+Math.floor(i/3)*96];
    let open=[],found=0,lock=true,blown=false;
    const MOT={stripe:`<path d="M-10 -14 H10 M-10 -5 H10" stroke="#fff" stroke-width="3.4"/>`,dot:`<circle cx="-4" cy="-15" r="2.6" fill="#fff"/><circle cx="4" cy="-6" r="2.6" fill="#fff"/><circle cx="-3" cy="3" r="2.6" fill="#fff"/>`,
      heart:`<path d="M0 -2 C-8 -7 -9 -12 -6 -15 Q-3 -17 0 -13 Q3 -17 6 -15 C9 -12 8 -7 0 -2Z" fill="#fff"/>`,star:`<path d="M0 -17 l2.6 5.4 5.8 .8 -4.2 4 1 5.8 -5.2 -2.8 -5.2 2.8 1 -5.8 -4.2 -4 5.8 -.8Z" fill="#fff"/>`};
    const sock=([c,m])=>`<g filter="url(#wobble)"><path d="M-10 -26 H10 V6 H20 Q28 6 28 14 Q28 22 20 22 H-2 Q-10 22 -10 14Z" fill="${c}" ${O}/><rect x="-12" y="-31" width="24" height="9" rx="3" fill="#fffaf2" ${O}/></g>${MOT[m]}`;
    sv.innerHTML=`<rect width="400" height="480" fill="#c9e2a4"/>${Array.from({length:24},(_,i)=>{const x=(i*137)%400,y=(i*89)%480;return `<path d="M${x} ${y} l-3 -6 M${x} ${y} l0 -7 M${x} ${y} l3 -6" stroke="#86b06e" stroke-width="2" stroke-linecap="round"/>`}).join("")}<g id="cards"></g>`;
    const box=sv.querySelector("#cards"),deck=[...Array(K).keys(),...Array(K).keys()].sort(()=>Math.random()-.5);
    const cards=deck.map((k,i)=>{const c={k,slot:i,up:false,done:false};
      c.el=grp(box,`<g class="mflip"><g class="back"><rect x="-56" y="-43" width="112" height="86" rx="16" fill="#f6b3c4" stroke="${INK}" stroke-width="3"/>
        <path d="M-36 -18 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 M-36 6 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/></g>
        <g class="face" style="display:none"><rect x="-56" y="-43" width="112" height="86" rx="16" fill="#fffaf2" stroke="${INK}" stroke-width="3"/><g transform="translate(-6 4) scale(1.15)">${sock(SK[k])}</g></g></g>`,{class:"mcard","data-k":k});
      c.el.style.cursor="pointer";const [x,y]=XY(i);c.el.style.transform=`translate(${x}px,${y}px)`;
      c.el.onpointerdown=e=>{e.stopPropagation();pick(c)};return c});
    const turn=(c,up)=>{c.up=up;const f=c.el.firstChild;replay(f,"flipc");
      setTimeout(()=>{f.querySelector(".face").style.display=up?"":"none";f.querySelector(".back").style.display=up?"none":""},140)};
    // un coup de vent : les chaussettes pas encore rangées changent de place
    const blow=()=>{blown=true;lock=true;A.say("Un coup de vent ! Les chaussettes ont bougé…");
      const left=cards.filter(c=>!c.done),slots=left.map(c=>c.slot).sort(()=>Math.random()-.5);
      left.forEach((c,i)=>{c.slot=slots[i];const [x,y]=XY(c.slot);c.el.style.transition="transform .7s cubic-bezier(.5,0,.3,1.3)";c.el.style.transform=`translate(${x}px,${y}px)`});
      A.later(()=>{left.forEach(c=>c.el.style.transition="");lock=false;A.say("Retrouve les paires qui restent !")},800)};
    const pick=c=>{if(lock||c.up||c.done||A.won)return;turn(c,true);open.push(c);if(open.length<2)return;
      const [a,b]=open;open=[];lock=true;
      if(a.k===b.k){a.done=b.done=true;found++;A.later(()=>{a.el.classList.add("done");b.el.classList.add("done");
          if(found===K)return A.win(g.win||"Toutes les paires !");
          if(found===3&&!blown)return blow();
          lock=false;A.cheer("UNE PAIRE !");A.say(`Une paire ! ${found} sur ${K}.`)},350)}
      else A.later(()=>{turn(a,false);turn(b,false);lock=false;A.say("Pas pareilles… Retourne-les deux par deux.")},850)};
    // on voit toutes les chaussettes un instant
    A.say(g.say||"Regarde bien les chaussettes…");
    A.later(()=>cards.forEach(c=>turn(c,true)),300);
    A.later(()=>{cards.forEach(c=>turn(c,false));lock=false;A.say("Retrouve les paires : touche deux chaussettes pareilles !")},2600);
  },

  /* Le panier (Biscuit) : des pommes tombent du grand arbre, on glisse le panier du doigt pour les rattraper.
     Une véreuse fait perdre une pomme ; trois belles pommes par terre et on recommence. */
  basket(g,A){
    const sv=A.sv,n=g.n||8,miss=g.miss||3;let got=0,lost=0,bx=200,tx=200,next=.6,st="play",fr=[];
    const APPLE=`<circle r="13" fill="#e0564f" ${O}/><path d="M0 -12 q2 -6 6 -8" stroke="${INK}" stroke-width="2.4" fill="none"/><path d="M3 -16 q8 -4 10 2 q-6 3 -10 -2Z" fill="#8fca7a" stroke="${INK}" stroke-width="1.8"/><path d="M-7 -4 q2 -4 6 -4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
      ROT=`<circle r="13" fill="#a68a52" ${O}/><circle cx="-4" cy="2" r="3" fill="#6f5a34"/><circle cx="5" cy="-4" r="2.2" fill="#6f5a34"/><path d="M5 3 q7 -3 9 4 q-5 3 -9 -4Z" fill="#f3b9c8" stroke="${INK}" stroke-width="1.6"/><circle cx="11" cy="4" r="1" fill="${INK}"/>`;
    sv.innerHTML=`<rect width="400" height="480" fill="#bfe0f2"/><rect y="400" width="400" height="80" fill="#bcd99a"/>
      <g filter="url(#wobble)">${[[60,40,70],[170,20,80],[290,30,76],[380,60,60],[110,90,56],[240,96,60]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#8dbd86" ${O}/>`).join("")}</g>
      ${[[50,80],[140,60],[210,110],[300,70],[360,100],[100,120]].map(([x,y])=>`<g transform="translate(${x} ${y}) scale(.7)">${APPLE}</g>`).join("")}
      <g id="fr"></g><g id="bk"><g filter="url(#wobble)"><path d="M-48 -24 H48 L38 20 H-38Z" fill="#d9a777" ${O}/><path d="M-44 -8 H44 M-41 6 H41" stroke="#b07a50" stroke-width="2.4"/><rect x="-52" y="-30" width="104" height="10" rx="5" fill="#c08a5c" ${O}/></g></g>`;
    const box=sv.querySelector("#fr"),bk=sv.querySelector("#bk");
    drag(A,p=>{tx=Math.max(50,Math.min(350,p.x))});
    const reset=()=>{got=0;lost=0;fr.forEach(f=>f.el.remove());fr=[];next=.8;st="play";A.say(g.say||`Rattrape ${n} pommes avec le panier ! Pas les véreuses.`)};
    A.loop(dt=>{bx+=(tx-bx)*Math.min(1,dt*14);bk.setAttribute("transform",`translate(${bx.toFixed(1)} 430)`);if(st!=="play")return;
      if((next-=dt)<=0){next=Math.max(.45,.9-got*.05);const bad=Math.random()<.22;fr.push({x:40+Math.random()*320,y:100,vy:80+got*10+Math.random()*40,bad,el:grp(box,bad?ROT:APPLE)})}
      for(const f of fr){f.vy+=170*dt;f.y+=f.vy*dt;
        if(f.y>=398&&f.y<=432&&Math.abs(f.x-bx)<48){f.done=1;f.el.remove();
          if(f.bad){got=Math.max(0,got-1);A.say(`Beurk, une véreuse ! ${got} sur ${n}.`)}
          else{got++;if(got>=n){st="won";A.win(g.win||"Le panier est plein !");return}A.say(`${got} sur ${n} !`)}continue}
        if(f.y>480){f.done=1;f.el.remove();if(f.bad)continue;lost++;
          if(lost>=miss){st="lost";A.say(`${miss} pommes par terre… On recommence !`);A.later(reset,1400);return}
          A.say(`Raté ! Encore ${miss-lost} chance${miss-lost>1?"s":""}.`);continue}
        f.el.setAttribute("transform",`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)})`)}
      fr=fr.filter(f=>!f.done)});
    reset();
  },

  /* Le tas de feuilles (Cannelle) : on pousse les feuilles du doigt jusqu'au tas, avant que le vent se lève. */
  rake(g,A){
    const sv=A.sv,N=g.n||16,T=g.time||20,PX=200,PY=260;let st="play",left=T,lv=[],last=null;
    sv.innerHTML=`<rect width="400" height="480" fill="#c9e2a4"/>${Array.from({length:26},(_,i)=>{const x=(i*137)%400,y=(i*89)%480;return `<path d="M${x} ${y} l-3 -6 M${x} ${y} l0 -7 M${x} ${y} l3 -6" stroke="#86b06e" stroke-width="2" stroke-linecap="round"/>`}).join("")}
      <ellipse cx="${PX}" cy="${PY}" rx="70" ry="46" fill="#e8d3a8" stroke="#b9925e" stroke-width="3" stroke-dasharray="8 7"/><g id="lv"></g>
      <rect x="40" y="456" width="320" height="12" rx="6" fill="#fff" stroke="${INK}" stroke-width="2.4"/><rect id="bar" x="42" y="458" width="316" height="8" rx="4" fill="#f2a35c"/>`;
    const box=sv.querySelector("#lv"),bar=sv.querySelector("#bar"),COL=["#f2a35c","#e8794e","#f6c065","#e0564f"];
    const LEAF=c=>`<path d="M-15 0 Q-4 -13 15 0 Q-4 11 -15 0Z" fill="${c}" stroke="${INK}" stroke-width="2.2"/><path d="M-11 0 H11" stroke="${INK}" stroke-width="1.4" opacity=".5"/>`;
    const reset=()=>{box.innerHTML="";st="play";left=T;
      lv=Array.from({length:N},(_,i)=>{let x,y;do{x=30+Math.random()*340;y=90+Math.random()*340}while(Math.hypot(x-PX,(y-PY)*1.4)<120);
        return {x,y,r:Math.random()*360,in:false,el:grp(box,LEAF(COL[i%COL.length]))}});
      A.say(g.say||"Pousse les feuilles jusqu'au tas avec ton doigt !")};
    drag(A,(p,down,type)=>{if(type==="down"||!down||st!=="play"){last=down?p:null;return}
      if(last){const dx=p.x-last.x,dy=p.y-last.y;for(const l of lv)if(!l.in&&Math.hypot(l.x-p.x,l.y-p.y)<46){l.x+=dx;l.y+=dy;l.r+=dx}}last=p});
    A.loop(dt=>{if(st!=="play")return;left-=dt;bar.setAttribute("width",(316*Math.max(0,left)/T).toFixed(1));
      let k=0;for(const l of lv){
        if(!l.in&&Math.hypot(l.x-PX,(l.y-PY)*1.3)<56){l.in=true;l.x=PX+(Math.random()-.5)*70;l.y=PY+(Math.random()-.5)*30;box.appendChild(l.el)}
        if(l.in)k++;l.el.setAttribute("transform",`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.r.toFixed(0)})`)}
      if(k>=N){st="won";A.win(g.win||"Un tas tout moelleux !");return}
      if(left<=0){st="lost";A.say("Le vent se lève et éparpille tout… On recommence !");A.later(reset,1500)}});
    reset();
  },

  /* La lanterne dans le brouillard (Charbon) : on promène la lumière du doigt ; il faut rester un instant sur le renard
     caché parmi les cailloux, sans aller trop vite, sinon il prend peur et file ailleurs. */
  lantern(g,A){
    const sv=A.sv,id=g.who||g.target,S=[[70,170],[200,150],[330,180],[110,280],[250,270],[360,300],[60,400],[180,410],[300,420]];
    let lx=200,ly=240,v=0,pt=0,hold=0,cool=0,st="look",slot=Math.floor(Math.random()*S.length);
    const ROCK=k=>`<g filter="url(#wobble)"><path d="M-30 18 Q-34 -10 -12 -18 ${k%2?"l4 -12 l6 10 l8 -10 l4 12":""} Q30 -16 32 18Z" fill="#8f8790" ${O}/></g><path d="M-16 -6 q6 -4 12 -2" stroke="#b5aeb6" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    sv.innerHTML=`<defs><radialGradient id="lgh"><stop offset="0" stop-color="#000"/><stop offset=".6" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient>
        <radialGradient id="lwarm"><stop offset="0" stop-color="#ffe9a6" stop-opacity=".45"/><stop offset="1" stop-color="#ffe9a6" stop-opacity="0"/></radialGradient>
        <mask id="lm"><rect width="400" height="480" fill="#fff"/><circle id="hole" r="86" fill="url(#lgh)"/></mask></defs>
      <rect width="400" height="480" fill="#56627a"/><rect y="100" width="400" height="380" fill="#5f7d68"/>
      <g id="things">${S.map((_,i)=>`<g class="rk" data-i="${i}">${ROCK(i)}</g>`).join("")}<g id="cfox">${foxAt(id,0,22,70,{pose:"sit"})}</g></g>
      <circle id="warm" r="90" fill="url(#lwarm)"/><rect width="400" height="480" fill="#1c2236" opacity=".99" mask="url(#lm)"/>
      <g id="lamp"><path d="M0 -50 v10" stroke="${INK}" stroke-width="3"/><rect x="-9" y="-40" width="18" height="22" rx="5" fill="#ffe9a6" stroke="${INK}" stroke-width="2.6"/></g>`;
    const hole=sv.querySelector("#hole"),warm=sv.querySelector("#warm"),lamp=sv.querySelector("#lamp"),cf=sv.querySelector("#cfox"),rks=[...sv.querySelectorAll(".rk")];
    const place=()=>{let r=0;S.forEach(([x,y],i)=>{if(i===slot)cf.setAttribute("transform",`translate(${x} ${y})`);else rks[r++].setAttribute("transform",`translate(${x} ${y})`)});
      rks[S.length-1].setAttribute("opacity",0)};
    const light=()=>{for(const e of [hole,warm]){e.setAttribute("cx",lx.toFixed(0));e.setAttribute("cy",ly.toFixed(0))}lamp.setAttribute("transform",`translate(${lx.toFixed(0)} ${ly.toFixed(0)})`)};
    drag(A,(p,down)=>{const now=performance.now(),d=Math.hypot(p.x-lx,p.y-ly);if(pt&&now>pt)v=v*.6+.4*d/((now-pt)/1000);pt=now;lx=p.x;ly=p.y;light()});
    A.say(g.say||`Quelqu'un se cache dans le brouillard… Promène doucement la lanterne !`);
    A.loop(dt=>{if(st!=="look")return;v*=Math.pow(.02,dt);cool-=dt;const [fx,fy]=S[slot],d=Math.hypot(lx-fx,ly-fy);
      if(d<90&&v>420&&cool<=0){let j;do j=Math.floor(Math.random()*S.length);while(j===slot||Math.hypot(S[j][0]-lx,S[j][1]-ly)<160);
        slot=j;place();cool=1;hold=0;A.say("Trop vite ! Il a eu peur et s'est caché ailleurs. Doucement…");return}
      if(d<56){hold+=dt;if(hold>.7){st="won";cf.classList.add("popin");A.win(g.win||"Trouvé !")}}else hold=Math.max(0,hold-dt)});
    place();light();
  },

  /* Le parapluie-feuille (Brume) : un renard se promène sous la pluie ; on garde la feuille au-dessus de lui du doigt. */
  umbrella(g,A){
    const sv=A.sv,id=g.who||g.target,D=g.time||12,wet=g.wet||3;let st,t,w,ux=200,tx=200,fxx=200,drops=[],acc=0;
    sv.innerHTML=`<rect width="400" height="480" fill="#a9bccd"/><g filter="url(#wobble)">${[[60,30,60],[170,14,70],[290,26,66],[390,40,50]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#7d8ea3" ${O}/>`).join("")}</g>
      <rect y="440" width="400" height="40" fill="#8fb07f"/><g id="dr"></g><g id="wf"><g id="wfi">${foxAt(id,0,0,84,{pose:"walk"})}</g></g>
      <g id="umb"><path d="M0 -4 V22 q0 8 -8 8" fill="none" stroke="#7a5a4a" stroke-width="4" stroke-linecap="round"/><g filter="url(#wobble)"><path d="M-64 4 Q-46 -36 0 -40 Q46 -36 64 4 Q32 -6 0 4 Q-32 -6 -64 4Z" fill="#7fb27f" ${O}/></g><path d="M0 -36 V2 M0 -18 l-22 8 M0 -18 l22 8" stroke="#5f8f5c" stroke-width="2.2" fill="none"/></g>
      <rect x="40" y="456" width="320" height="12" rx="6" fill="#fff" stroke="${INK}" stroke-width="2.4"/><rect id="bar" x="42" y="458" width="0" height="8" rx="4" fill="#9ec3ef"/>`;
    const dr=sv.querySelector("#dr"),wf=sv.querySelector("#wf"),wfi=sv.querySelector("#wfi"),umb=sv.querySelector("#umb"),bar=sv.querySelector("#bar");
    drag(A,p=>{tx=Math.max(40,Math.min(360,p.x))});
    const reset=()=>{st="play";t=0;w=0;drops.forEach(d=>d.el.remove());drops=[];A.say(g.say||`Garde la feuille au-dessus de ${FOX[id].name} !`)};
    A.loop(dt=>{ux+=(tx-ux)*Math.min(1,dt*16);umb.setAttribute("transform",`translate(${ux.toFixed(1)} 336)`);if(st!=="play")return;
      t+=dt;bar.setAttribute("width",(316*Math.min(1,t/D)).toFixed(1));
      const nx=200+Math.sin(t*.75)*110+Math.sin(t*1.7)*30,dir=nx>=fxx?1:-1;fxx=nx;
      wf.setAttribute("transform",`translate(${fxx.toFixed(1)} 444)`);wfi.setAttribute("transform",`scale(${dir} 1)`);
      acc+=dt*(16+t*1.5);while(acc>=1){acc--;drops.push({x:Math.random()*400,y:-10,el:grp(dr,`<path d="M0 0 v14" stroke="#e4f3f9" stroke-width="3" stroke-linecap="round"/>`)})}
      // on teste le passage entre deux images : à faible cadence, une goutte sauterait par-dessus la feuille
      for(const d of drops){const y0=d.y;d.y+=440*dt;
        if(y0<340&&d.y>=318&&Math.abs(d.x-ux)<62){d.done=1;d.el.remove();continue}
        if(y0<420&&d.y>=376&&Math.abs(d.x-fxx)<24){d.done=1;d.el.remove();w++;
          if(w>=wet){st="lost";A.say(`${FOX[id].name} est trempé ! On recommence.`);A.later(reset,1400);return}
          A.say(`Une goutte sur ${FOX[id].name} ! Encore ${wet-w} et il est trempé.`);continue}
        if(d.y>470){d.done=1;d.el.remove();continue}
        d.el.setAttribute("transform",`translate(${d.x.toFixed(1)} ${d.y.toFixed(1)})`)}
      drops=drops.filter(d=>!d.done);
      if(t>=D){st="won";A.win(g.win||"Pas une goutte !")}});
    reset();
  },

  /* Les clous (Copeau) : la porte de la maison et ses gonds rouillés ; chaque clou neuf s'enfonce en trois coups de marteau,
     avant la fin du temps. Le marteau tape là où on touche. */
  nails(g,A){
    const sv=A.sv,N=g.n||5,T=g.time||12;let st="play",left=T,ns=[];
    sv.innerHTML=`<rect width="400" height="480" fill="#d9b98c"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M0 ${30+i*60} H400" stroke="#c49a68" stroke-width="3"/>`).join("")}
      <g filter="url(#wobble)"><rect x="100" y="70" width="200" height="360" rx="14" fill="#b9814a" ${O}/>${[140,180,220,260].map(x=>`<path d="M${x} 74 V426" stroke="#9a6a3c" stroke-width="2.4"/>`).join("")}
      ${[120,330].map(y=>`<rect x="92" y="${y}" width="96" height="34" rx="6" fill="#a9a2a0" ${O}/><path d="M100 ${y+8} l14 4 M130 ${y+22} l18 -6 M160 ${y+10} l12 6" stroke="#c9763c" stroke-width="2.4" opacity=".7"/>`).join("")}
      <circle cx="270" cy="250" r="9" fill="#f2c45a" ${O}/><path d="M270 256 v14" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>
      <g id="nl"></g><g id="ham" opacity="0"><g transform="rotate(-30)"><rect x="-4" y="-2" width="8" height="46" rx="3" fill="#c99a6a" stroke="${INK}" stroke-width="2.4"/><rect x="-18" y="-14" width="36" height="16" rx="4" fill="#9aa0aa" stroke="${INK}" stroke-width="2.6"/></g></g>
      <rect x="40" y="456" width="320" height="12" rx="6" fill="#fff" stroke="${INK}" stroke-width="2.4"/><rect id="bar" x="42" y="458" width="316" height="8" rx="4" fill="#f2a35c"/>`;
    const box=sv.querySelector("#nl"),bar=sv.querySelector("#bar"),ham=sv.querySelector("#ham");
    // les clous plantés sur les deux gonds
    const SP=[[110,126],[150,128],[176,148],[112,340],[146,352],[178,336],[128,142],[160,344]];
    const nailSVG=k=>k>=3?`<circle r="6" fill="#c9ccd2" stroke="${INK}" stroke-width="2"/><path d="M-3 -3 l6 6" stroke="#fff" stroke-width="1.6"/>`
      :`<ellipse cx="0" cy="${4+k*3}" rx="5" ry="2.4" fill="#3d2a35" opacity=".2"/><rect x="-2.4" y="${-26+k*8}" width="4.8" height="${28-k*8}" fill="#c9ccd2" stroke="${INK}" stroke-width="1.8"/><ellipse cx="0" cy="${-27+k*8}" rx="8" ry="3.4" fill="#dfe2e8" stroke="${INK}" stroke-width="2"/>`;
    const reset=()=>{box.innerHTML="";st="play";left=T;
      ns=SP.slice().sort(()=>Math.random()-.5).slice(0,N).map(([x,y])=>{const n={x,y,k:0,el:grp(box,"",{transform:`translate(${x} ${y})`})};n.el.innerHTML=nailSVG(0);return n});
      A.say(g.say||`Plante les ${N} clous : trois coups chacun !`)};
    A.tap=e=>{if(st!=="play")return;const p=svPt(sv,e);
      ham.setAttribute("transform",`translate(${p.x.toFixed(0)} ${(p.y-6).toFixed(0)})`);ham.setAttribute("opacity",1);replay(ham.firstChild,"shk");
      const n=ns.filter(n=>n.k<3).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
      if(!n||Math.hypot(n.x-p.x,n.y-p.y)>40){A.say("Aïe, à côté ! Vise la tête du clou.");return}
      n.k++;n.el.innerHTML=nailSVG(n.k);if(navigator.vibrate)navigator.vibrate(15);
      const left3=ns.filter(n=>n.k<3).length;
      if(!left3){st="won";A.win(g.win||"Tous les clous sont plantés !")}else if(n.k>=3)A.say(`Plus que ${left3} !`)};
    A.loop(dt=>{if(st!=="play")return;left-=dt;bar.setAttribute("width",(316*Math.max(0,left)/T).toFixed(1));
      if(left<=0){st="lost";A.say("Trop tard, la porte a encore glissé de ses gonds… On recommence !");A.later(reset,1500)}});
    reset();
  },

  /* La course (Moka) : des pierres numérotées ; on saute dessus dans l'ordre avant que Moka arrive au drapeau. */
  order(g,A){
    const sv=A.sv,id=g.who||g.target,N=g.n||10,T=g.time||10;let k=0,t=0,st="play",ps=[];
    sv.innerHTML=`<rect width="400" height="480" fill="#c9e2a4"/>
      <path d="M40 132 H360" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M40 132 H360" stroke="#d9c6a4" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 10"/>
      <path d="M360 132 V100" stroke="${INK}" stroke-width="3"/><path d="M360 100 l22 7 l-22 7Z" fill="#e0564f" stroke="${INK}" stroke-width="2.4"/>
      <g id="rme">${faceAt("roussette",0,0,40)}</g><g id="rmo">${faceAt(id,0,0,40)}</g><g id="st"></g>`;
    const box=sv.querySelector("#st"),me=sv.querySelector("#rme"),mo=sv.querySelector("#rmo");
    const reset=()=>{box.innerHTML="";k=0;t=0;st="play";const P=[];
      while(P.length<N){const x=44+Math.random()*312,y=190+Math.random()*256;if(P.every(([a,b])=>Math.hypot(a-x,b-y)>66))P.push([x,y])}
      ps=P.map(([x,y],i)=>{const e=grp(box,`<g><g filter="url(#wobble)"><ellipse rx="28" ry="22" fill="#d9d2c6" ${O}/></g><text y="8" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="22" fill="${INK}">${i+1}</text><circle r="32" fill="transparent"/></g>`,{transform:`translate(${x.toFixed(0)} ${y.toFixed(0)})`,class:"stone"});
        e.style.cursor="pointer";e.onpointerdown=ev=>{ev.stopPropagation();hit(i,e)};return e});
      A.say(g.say||`Saute sur les pierres de 1 à ${N}, avant que ${FOX[id].name} arrive au drapeau !`)};
    const hit=(i,e)=>{if(st!=="play")return;
      if(i!==k){replay(e.firstChild,"nope");A.say(`Pas celle-là ! Cherche le ${k+1}.`);return}
      k++;e.classList.add("done");if(k>=N){st="won";A.win(g.win||"Gagné !")}else A.say(`${k} ! Maintenant le ${k+1}.`)};
    A.loop(dt=>{if(st==="play")t+=dt;me.setAttribute("transform",`translate(${(40+320*k/N).toFixed(1)} 132)`);mo.setAttribute("transform",`translate(${(40+320*Math.min(1,t/T)).toFixed(1)} 132)`);
      if(st==="play"&&t>=T){st="lost";A.say(`${FOX[id].name} est arrivé le premier ! On recommence.`);A.later(reset,1500)}});
    reset();
  },

  /* Le grand portrait (fin de l'histoire de Gribouille) : le tableau de tout le refuge ; Petit Pois y ajoute Gribouille
     dans le coin, de travers. On touche pour continuer. */
  portrait(g,A){
    const sv=A.sv,ids=Object.keys(R.res).filter(i=>i!=="gribouille"),n=Math.max(1,ids.length);
    const cols=Math.ceil(Math.sqrt(n*1.8)),rows=Math.ceil(n/cols),cw=292/cols,ch=170/rows,sz=Math.min(cw*1.15,ch*1.25,96);
    let st="look";
    sv.innerHTML=`<rect width="400" height="480" fill="#f0c99a"/>${Array.from({length:8},(_,i)=>`<path d="M0 ${60+i*56} H400" stroke="#d9ac7c" stroke-width="2"/>`).join("")}
      <path d="M110 340 L70 470 M290 340 L330 470 M200 340 V470" stroke="#a9785a" stroke-width="10" stroke-linecap="round"/>
      <defs><clipPath id="pc"><rect x="46" y="66" width="308" height="268" rx="4"/></clipPath><clipPath id="gr"><rect id="grr" x="250" y="250" width="0" height="110"/></clipPath></defs>
      <rect x="34" y="54" width="332" height="292" rx="10" fill="#c08a5c" stroke="${INK}" stroke-width="3.4"/>
      <g clip-path="url(#pc)"><rect x="46" y="66" width="308" height="268" fill="#cfe6f5"/><circle cx="310" cy="106" r="22" fill="#fff3b8"/>
        ${[[60,120],[150,96],[230,128]].map(([x,y])=>`<path d="M${x} ${y} q14 -14 30 0 q14 -8 24 4 q-28 8 -54 -4Z" fill="#fff"/>`).join("")}
        <path d="M46 200 Q150 180 250 196 Q320 186 354 196 V334 H46Z" fill="#b5d68f"/>
        ${Array.from({length:14},(_,i)=>`<path d="M${50+i*22} ${206+(i%3)*4} q8 -6 16 0" stroke="#8dbd86" stroke-width="3" fill="none" stroke-linecap="round"/>`).join("")}
        ${ids.map((fid,i)=>{const r=Math.floor(i/cols),c=i%cols,inRow=Math.min(cols,n-r*cols);return foxAt(fid,200+(c-(inRow-1)/2)*cw,170+ch*(r+1)+6,sz,{pose:"sit"})}).join("")}
        <g clip-path="url(#gr)"><g transform="translate(312 330) rotate(-14)">${foxAt("gribouille",0,0,70,{pose:"happy"})}</g></g></g>
      <g id="brush" opacity="0"><path d="M0 0 q-10 -30 -40 -44" stroke="#f2a35c" stroke-width="10" stroke-linecap="round" fill="none"/><circle r="8" fill="#6aa6c9" stroke="${INK}" stroke-width="2.4"/></g>
      ${foxAt("petitpois",64,470,96,{pose:"happy"})}`;
    const grr=sv.querySelector("#grr"),br=sv.querySelector("#brush");
    A.say(g.say||"Le grand portrait du refuge…");
    let t=0;A.later(()=>{st="paint";A.say("Petit Pois ajoute Gribouille dans le coin…");br.setAttribute("opacity",1)},1600);
    A.loop(dt=>{if(st!=="paint")return;t+=dt;const k=Math.min(1,t/2.2);grr.setAttribute("width",(110*k).toFixed(1));
      br.setAttribute("transform",`translate(${(262+96*k).toFixed(1)} ${(300+Math.sin(t*14)*16).toFixed(1)})`);
      if(k>=1){st="done";br.setAttribute("opacity",0);A.say("Voilà : tout le refuge. Touche pour continuer.")}});
    A.tap=()=>{if(st==="done")A.win(g.win||"Le grand portrait est fini !")};
  },

  /* La danse des flaques : le renard saute dans des flaques, il faut refaire la même suite. Chaque flaque a sa note (do, mi, sol, do). */
  simon(g,A){
    const sv=A.sv,id=g.who||g.target,P=[[110,230],[290,230],[110,390],[290,390]],COL=["#9ec3ef","#b7a6e6","#9fd8c4","#f3b9c8"],L=g.rounds||[3,4,5],NOTE=[72,76,79,84],STEP=g.step||520;
    let r=0,seq=[],idx=0,st="show";
    sv.innerHTML=`<rect width="400" height="480" fill="#c9e2a4"/>${P.map(([x,y],i)=>`<g class="pud" data-i="${i}"><ellipse cx="${x}" cy="${y}" rx="70" ry="34" fill="${COL[i]}" stroke="${INK}" stroke-width="3"/><path d="M${x-40} ${y-6} q20 -8 40 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`).join("")}<g id="hopper" style="transition:transform .22s cubic-bezier(.3,1.5,.5,1)">${foxAt(id,0,0,90)}</g>`;
    const hopper=sv.querySelector("#hopper"),puds=[...sv.querySelectorAll(".pud")];
    const splash=i=>{replay(puds[i],"flash");try{MUSIC.note(NOTE[i])}catch(e){}const [x,y]=P[i];const s=grp(sv,`<g class="splash">${[-30,-12,12,30].map(dx=>`<circle cx="${x+dx}" cy="${y-10}" r="5" fill="#fff"/>`).join("")}</g>`);setTimeout(()=>s.remove(),500)};
    const jump=i=>{const [x,y]=P[i];hopper.style.transform=`translate(${x}px,${y+8}px)`;A.later(()=>splash(i),170)};
    hopper.style.transform="translate(200px,316px)";
    const show=()=>{st="show";idx=0;A.say(`Regarde bien ${FOX[id].name}…`);seq.forEach((p,i)=>A.later(()=>jump(p),500+i*STEP));
      A.later(()=>{hopper.style.transform="translate(200px,316px)";st="input";A.say("À toi ! Saute dans les mêmes flaques.")},500+seq.length*STEP+250)};
    const round=()=>{seq=[];for(let i=0;i<L[r];i++){let p;do p=Math.floor(Math.random()*4);while(p===seq[i-1]);seq.push(p)}show()};
    puds.forEach((pd,i)=>pd.onpointerdown=e=>{e.stopPropagation();if(st!=="input"||A.won)return;splash(i);
      if(i!==seq[idx]){st="show";A.say(`Raté ! ${FOX[id].name} recommence.`);A.later(show,900);return}
      if(++idx===seq.length){r++;if(r>=L.length)A.win(g.win||"Parfait !");else{st="show";A.cheer();A.say("Bravo ! Une flaque de plus…");A.later(round,1100)}}});
    round();
  },

  /* Ne bouge plus : Gribouille peint ; des mouches viennent chatouiller le museau du modèle, il faut les chasser. */
  still(g,A){
    const sv=A.sv,ids=g.all?foxes.filter(f=>!f.wild&&f.id!=="gribouille").map(f=>f.id).slice(0,6):[g.target],N=ids.length;
    const dur=g.all?11:8,w=N>1?Math.min(120,340/Math.ceil(N/2)):190;
    const pos=ids.map((id,i)=>N===1?[200,380]:[(i%Math.ceil(N/2)+.5)*(360/Math.ceil(N/2))+20,i<Math.ceil(N/2)?300:430]);
    sv.innerHTML=`<rect width="400" height="480" fill="#f0c99a"/>${Array.from({length:8},(_,i)=>`<path d="M0 ${60+i*56} H400" stroke="#d9ac7c" stroke-width="2"/>`).join("")}
      <rect x="40" y="112" width="320" height="20" rx="10" fill="#fff" stroke="${INK}" stroke-width="3"/><rect id="bar" x="43" y="115" width="0" height="14" rx="7" fill="#9ec3ef"/>
      <text x="200" y="152" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${g.label||"Gribouille peint…"}</text>`;
    const models=ids.map((id,i)=>grp(sv,foxAt(id,pos[i][0],pos[i][1],w),{class:"model"}));
    const bar=sv.querySelector("#bar");let p=0,next=.8;const flies=[];
    A.say(g.say||"Chasse les mouches avant qu'elles chatouillent le museau !");
    A.loop(dt=>{p=Math.min(100,p+dt/dur*100);bar.setAttribute("width",(p/100*314).toFixed(1));
      if(p>=100){flies.forEach(f=>f.el.remove());A.win(g.win||"Ne bougez plus… Voilà !");return}
      next-=dt;if(next<=0&&flies.length<(N>1?3:2)){next=N>1?1:1.3;const m=Math.floor(Math.random()*N),[mx,my]=pos[m];
        const f={m,t:0,x:mx+(Math.random()<.5?-1:1)*(w*.6+30),y:my-w*.7,tx:mx,ty:my-w*.42};
        f.el=grp(sv,`<circle r="24" fill="transparent"/><ellipse cx="-5" cy="-6" rx="6" ry="4" fill="#e4f3f9" stroke="${INK}" stroke-width="1.6" class="wing"/><ellipse cx="5" cy="-6" rx="6" ry="4" fill="#e4f3f9" stroke="${INK}" stroke-width="1.6" class="wing"/><circle r="5.5" fill="${INK}"/>`);
        f.el.style.cursor="pointer";f.el.onpointerdown=e=>{e.stopPropagation();if(A.won)return;f.el.classList.add("shoo");flies.splice(flies.indexOf(f),1);setTimeout(()=>f.el.remove(),350)};
        flies.push(f)}
      for(const f of flies.slice()){f.t+=dt;const k=Math.min(1,f.t/2.2);
        const x=f.x+(f.tx-f.x)*k+Math.sin(f.t*18)*4,y=f.y+(f.ty-f.y)*k+Math.cos(f.t*15)*4;f.el.setAttribute("transform",`translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        if(k>=1){flies.splice(flies.indexOf(f),1);f.el.remove();p=Math.max(0,p-25);replay(models[f.m],"sneeze");A.say(`Atchoum ! ${FOX[ids[f.m]].name} a bougé. On reprend…`)}}
    });
  }
};
