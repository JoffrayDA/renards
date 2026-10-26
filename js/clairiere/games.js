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
const foxAt=(id,x,y,w,o={pose:"sit"})=>foxArt(FOX[id],o).replace(/^<svg/,`<svg x="${x-w/2}" y="${y-w*.97}" width="${w}" height="${w*.97}"`);

/* ---------- objets trouvés ---------- */
const ITEM={
  jar:`<path d="M-11 -17 h22 v6 h-22Z" fill="#c9a08a" ${O}/><rect x="-14" y="-12" width="28" height="30" rx="9" fill="#e4f3f9" fill-opacity=".85" ${O}/><path d="M-7 -5 q-2 8 0 14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  wool:`<path d="M10 4 q16 6 26 -4 q8 -8 18 0" fill="none" stroke="#e0564f" stroke-width="3" stroke-linecap="round"/><circle r="13" fill="#e0564f" ${O}/><path d="M-9 -6 q9 4 16 -2 M-11 2 q10 5 20 -1 M-6 9 q6 2 12 -2" fill="none" stroke="#b83c38" stroke-width="2.2" stroke-linecap="round"/>`,
  snail:`<path d="M-16 10 q2 -6 10 -6 h18 q6 0 6 6Z" fill="#cfe0a6" ${O}/><circle cx="2" cy="-2" r="11" fill="#f2c45a" ${O}/><path d="M2 -2 m-5 0 a5 5 0 1 1 5 5" fill="none" stroke="${INK}" stroke-width="2"/><path d="M-12 4 l-4 -10 M-9 4 l-1 -10" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
  cone:`<ellipse rx="10" ry="15" fill="#a9785a" ${O}/><path d="M-8 -6 l8 5 l8 -5 M-9 3 l9 5 l9 -5 M-6 11 l6 3 l6 -3" fill="none" stroke="#7a5440" stroke-width="2"/>`,
  pebble:`<ellipse rx="15" ry="10" fill="#cfc6c0" ${O}/><path d="M-7 -3 q4 -3 9 -1" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  fish:`<path d="M-16 0 q14 -14 28 0 q-14 14 -28 0Z M12 0 l10 -8 v16Z" fill="#f59a5b" ${O}/><circle cx="-8" cy="-2" r="2.2" fill="${INK}"/>`,
  boot:`<path d="M-12 -16 h14 v18 h14 q6 0 6 8 v4 h-34Z" fill="#8a6a5a" ${O}/><path d="M-12 -10 h14" stroke="${INK}" stroke-width="2"/>`,
  algae:`<path d="M-10 14 q-6 -12 2 -20 q6 -8 0 -14 M0 14 q6 -10 -2 -18 q-4 -8 4 -14 M10 14 q-4 -10 4 -16" fill="none" stroke="#6f9a60" stroke-width="4" stroke-linecap="round"/>`,
  twig:`<path d="M-18 6 L18 -6 M2 0 l6 -10 M-6 3 l-4 8" fill="none" stroke="#a9785a" stroke-width="4" stroke-linecap="round"/>`,
  leaf:`<path d="M-16 4 Q0 -18 16 -4 Q0 12 -16 4Z" fill="#b5d68f" ${O}/><path d="M-12 3 Q0 -2 12 -3" fill="none" stroke="#6f9a60" stroke-width="2"/>`
};

const JUNK=[["boot","Une vieille botte… Raté !","Vieille botte"],["algae","Des algues. Beurk.","Algues"],["twig","Une brindille. Bon.","Brindille"],["leaf","Une feuille toute mouillée.","Feuille mouillée"],["pebble","Un caillou. Pas de chance !","Caillou"]];

/* ---------- le moteur ---------- */
let gameOn=false;
function playGame(g,done){
  const el=$("play");let timers=[],raf=0,over=false;gameOn=true;
  el.innerHTML=`<svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true"></svg><div class="psay" aria-live="polite"></div>`;
  const sv=el.firstChild,sayEl=el.lastChild;
  const api={sv,won:false,tap:null,
    say:t=>{sayEl.textContent=t;replay(sayEl,"pop")},
    later:(f,ms)=>{timers.push(setTimeout(()=>{if(!over)f()},ms))},
    clear:()=>{timers.forEach(clearTimeout);timers=[]},
    loop:f=>{let last=performance.now();const fr=now=>{if(over)return;f(Math.max(0,Math.min(.05,(now-last)/1000)));last=now;raf=requestAnimationFrame(fr)};raf=requestAnimationFrame(fr)},
    // pêche libre : on enchaîne les lancers et on rentre quand on veut
    close:()=>{over=true;api.clear();cancelAnimationFrame(raf);el.hidden=true;el.innerHTML="";gameOn=false;done()},
    win:t=>{if(api.won)return;api.won=true;api.clear();api.say(t);
      setTimeout(()=>{over=true;cancelAnimationFrame(raf);el.hidden=true;el.innerHTML="";gameOn=false;done()},1400)}};
  el.onpointerdown=e=>{if(!api.won&&api.tap)api.tap(e)};
  if(g.free){const x=document.createElement("button");x.className="btn pclose";x.type="button";x.textContent="Rentrer";
    x.onpointerdown=e=>{e.stopPropagation();api.close()};el.appendChild(x)}
  el.hidden=false;GAMES[g.k](g,api);
}

const GAMES={
  /* Pêche : vue depuis le ponton, Roussette au premier plan, la rive d'en face et ses reflets, l'heure réelle.
     Une ombre de poisson approche ; elle grignote (ploc, petit rond : pas encore !), puis mord : le bouchon coule,
     gros remous, « ! » et vibration ; il faut toucher tout de suite. La prise saute hors de l'eau et s'affiche sur une carte. */
  fish(g,A){
    const sv=A.sv,BX=262,BY=318,night=dark(),ph=PH[phaseNow()];
    const W0=night?"#4a5f96":"#c4e6f2",W1=night?"#26355f":"#7fbad6",TR=night?["#4f6f78","#3e5d66"]:["#9cc796","#7fb27f"],R0=new Array(14).fill(0).map((_,i)=>[i*34-10+(i%2)*12,104+(i%3)*8,22+(i*7)%12]);
    sv.innerHTML=`<defs>
        <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ph.sky[0]}"/><stop offset="1" stop-color="${ph.sky[1]}"/></linearGradient>
        <linearGradient id="fwat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${W0}"/><stop offset="1" stop-color="${W1}"/></linearGradient>
        <radialGradient id="fglow"><stop offset="0" stop-color="#fff6c8" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient>
        <radialGradient id="fray"><stop offset="0" stop-color="#ffe9a6"/><stop offset="1" stop-color="#ffe9a6" stop-opacity="0"/></radialGradient></defs>
      <rect width="400" height="160" fill="url(#fsky)"/>
      ${night?`<circle cx="320" cy="52" r="20" fill="#fff4cf"/><circle cx="312" cy="46" r="5" fill="#f1e2b0"/>${[[40,30],[120,58],[200,24],[260,70],[370,22],[90,90]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#fff8d0"/>`).join("")}`
        :`<circle cx="320" cy="52" r="22" fill="#fff3b8" opacity=".9"/>${[[70,46],[200,30]].map(([x,y])=>`<path d="M${x} ${y} q14 -14 30 0 q14 -8 24 4 q-28 8 -54 -4Z" fill="#fff" opacity=".85"/>`).join("")}`}
      <rect y="150" width="400" height="330" fill="url(#fwat)"/>
      <g opacity="${night?.25:.22}">${R0.map(([x,y,r])=>`<ellipse cx="${x}" cy="${300-y+20}" rx="${r}" ry="${r*.55}" fill="${TR[1]}"/>`).join("")}</g>
      <g filter="url(#wobble)">${R0.map(([x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${TR[i%2]}" ${O}/>`).join("")}
        <path d="M-10 132 Q100 118 200 128 Q300 116 410 130 L410 158 Q300 150 200 158 Q100 150 -10 158Z" fill="${night?"#5d7d64":"#a9cf8a"}" ${O}/>
        ${[[36,150],[150,154],[300,150]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="11" ry="5" fill="#d9d2c6" ${O}/>`).join("")}</g>
      ${night?`<ellipse cx="320" cy="228" rx="14" ry="4" fill="#fff4cf" opacity=".5" class="shim"/><ellipse cx="320" cy="246" rx="9" ry="3" fill="#fff4cf" opacity=".35" class="shim" style="animation-delay:.7s"/>`:""}
      ${[[80,196,40],[180,230,56],[320,206,36],[120,286,48],[340,280,40],[60,360,30]].map(([x,y,w],i)=>`<path class="shim" style="animation-delay:${(i*.45).toFixed(2)}s" d="M${x-w/2} ${y} q${w/4} -5 ${w/2} 0 t${w/2} 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`).join("")}
      ${[[150,208],[300,250],[210,380],[360,340]].map(([x,y],i)=>`<path class="twk" style="animation-delay:${i*.6}s" d="M${x} ${y-6} q1 5 6 6 q-5 1 -6 6 q-1 -5 -6 -6 q5 -1 6 -6Z" fill="#fff"/>`).join("")}
      <g filter="url(#wobble)">
        ${[[70,214,22,.5],[350,232,26,.5],[44,300,34,.55],[352,388,38,.55],[150,262,16,.45]].map(([x,y,r,k])=>`<path d="M${x} ${y} m-${r} 0 a${r} ${r*k} 0 1 0 ${2*r} 0 a${r} ${r*k} 0 1 0 -${2*r} 0 M${x} ${y} l${r*.92} -${r*k*.5}" fill="${night?"#5f8f6a":"#8fca7a"}" ${O}/>`).join("")}
        <g transform="translate(350 380)"><path d="M0 -4 q-10 -16 0 -24 q10 8 0 24Z M0 -4 q-18 -6 -16 -18 q12 0 16 18Z M0 -4 q18 -6 16 -18 q-12 0 -16 18Z" fill="#f6b3c4" ${O}/><circle cy="-8" r="3.4" fill="#f2c45a" stroke="${INK}" stroke-width="2"/></g></g>
      <g id="shadow" style="transition:transform 1.8s ease-in-out,opacity .4s"><g class="swim" opacity="${night?.5:.38}"><ellipse cx="${BX}" cy="${BY+28}" rx="22" ry="8" fill="${night?"#14203f":"#3f6f86"}"/><path d="M${BX+18} ${BY+28} l14 -8 v16Z" fill="${night?"#14203f":"#3f6f86"}" class="tail"/></g></g>
      <g id="rips"></g>
      <path id="line" d="M238 196 Q${BX+6} 250 ${BX} ${BY-16}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".9"/>
      <g id="bob" style="transition:transform .14s ease-out,opacity .2s"><g class="bobidle"><ellipse cx="${BX}" cy="${BY+12}" rx="18" ry="4" fill="#fff" opacity=".35"/>
        <g filter="url(#wobble)"><path d="M${BX-15} ${BY} a15 15 0 0 0 30 0Z" fill="#fff" ${O}/><path d="M${BX-15} ${BY} a15 15 0 0 1 30 0Z" fill="#e0564f" ${O}/><path d="M${BX-15} ${BY} h30" stroke="${INK}" stroke-width="2.4"/><path d="M${BX} ${BY-15} v-7" ${O}/><circle cx="${BX-5}" cy="${BY-7}" r="2.6" fill="#fff" stroke="none"/></g></g></g>
      <g class="sway" style="transform-origin:372px 480px">${[[362,300],[378,280],[392,310]].map(([x,y])=>`<path d="M${x} 480 Q${x-4} ${(y+480)/2} ${x} ${y}" fill="none" stroke="#6f9a60" stroke-width="4" stroke-linecap="round"/><rect x="${x-4.5}" y="${y-4}" width="9" height="26" rx="4.5" fill="#a9785a" stroke="${INK}" stroke-width="2.4"/>`).join("")}</g>
      <g class="dfly"><g transform="translate(0 0)"><path d="M0 0 h18" stroke="#6aa6c9" stroke-width="3.4" stroke-linecap="round"/><ellipse class="wing" cx="7" cy="-5" rx="7" ry="3" fill="#e4f3f9" stroke="${INK}" stroke-width="1.4"/><ellipse class="wing" cx="11" cy="-5" rx="7" ry="3" fill="#e4f3f9" stroke="${INK}" stroke-width="1.4"/><circle cx="19" cy="0" r="3" fill="#6aa6c9" stroke="${INK}" stroke-width="1.4"/></g></g>
      ${night?[[60,240],[180,190],[300,300],[120,340]].map(([x,y],i)=>`<circle class="ff" style="animation-delay:${-i*1.3}s" cx="${x}" cy="${y}" r="9" fill="url(#fglow)"/>`).join(""):""}
      <g filter="url(#wobble)"><path d="M-10 404 L196 392 L222 480 L-10 480Z" fill="#d9a777" ${O}/>
        ${[418,438,458].map((y,i)=>`<path d="M-10 ${y} L${200+i*7} ${y-4+i}" stroke="#c08a5c" stroke-width="2.2"/>`).join("")}
        <rect x="184" y="388" width="14" height="92" rx="4" fill="#b58460" ${O}/><path d="M8 410 l8 6 M120 400 l6 6" stroke="#a9704e" stroke-width="2.4" stroke-linecap="round"/></g>
      ${foxAt("roussette",98,462,138,{pose:"sit"})}
      <g filter="url(#wobble)"><path d="M118 444 L238 196" stroke="#a9785a" stroke-width="5.5" stroke-linecap="round"/><path d="M118 444 L134 411" stroke="#d9a06a" stroke-width="9" stroke-linecap="round"/>
        <circle cx="140" cy="402" r="8" fill="#e3dccf" ${O}/><circle cx="140" cy="402" r="2.4" fill="${INK}"/></g>
      <g id="excl" opacity="0"><circle cx="${BX+42}" cy="${BY-48}" r="18" fill="#ffd36a" stroke="${INK}" stroke-width="3"/><text x="${BX+42}" y="${BY-39}" text-anchor="middle" font-size="23" font-weight="900" fill="${INK}">!</text></g>
      <g id="hud"></g><g id="leap"></g><g id="card"></g>`;
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
        else A.later(()=>{st="bite";bob.style.transform="translateY(24px)";bob.style.opacity=.3;ring(22,3.6);ring(44,2.6,120);ring(66,1.8,240);drops(7,40);ex.setAttribute("opacity",1);replay(ex,"popin");A.say("Ça mord ! Touche vite !");
          try{navigator.vibrate&&navigator.vibrate(90)}catch(e){}
          A.later(()=>{if(st==="bite"){st="miss";ex.setAttribute("opacity",0);bob.style.opacity=1;bob.style.transform="";sh.style.opacity=0;A.say("Trop tard… il a filé. On relance !");A.later(start,1400)}},1150)},800+Math.random()*1000)};
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
      if(st==="wait"){st="miss";A.clear();bob.style.transform="";sh.style.transform=`translate(${(Math.random()<.5?-1:1)*220}px,60px)`;ring(16,2);A.say("Trop tôt ! Le poisson a eu peur. On relance !");A.later(start,1500)}
      else if(st==="bite"){st="won";ex.setAttribute("opacity",0);bob.style.opacity=0;sh.style.opacity=0;
        // pêche libre : un poisson une fois sur dix, sinon ce qui traîne au fond de la mare
        const j=g.free&&Math.random()>=.1?JUNK[Math.floor(Math.random()*JUNK.length)]:null;
        if(j){show(j[0],j[2],j[1],false);A.say("Ce n'est pas un poisson… On relance ?");A.later(start,2300)}
        else if(!g.free){show("fish","Un poisson !","Tout orange, avec de grands yeux.",true);A.win(g.win||"Attrapé !")}
        else{const t=g.onFish();show("fish","Un poisson !",g.have()>=g.need?"De quoi remplir la gamelle !":`${g.have()} sur ${g.need} pour la gamelle`,true);A.say(t);A.later(start,2600)}}};
    start();
  },

  /* Secouer l'arbre : chaque toucher fait tomber des feuilles ; au bout de quelques coups, l'objet tombe. */
  shake(g,A){
    const sv=A.sv,n=g.n||7;let k=0;
    sv.innerHTML=`<rect width="400" height="480" fill="#bfe0f2"/><rect y="380" width="400" height="100" fill="#bcd99a"/>
      <g filter="url(#wobble)"><path d="M178 470 Q186 380 180 260 L222 260 Q216 380 226 470Z" fill="#a9785a" ${O}/></g>
      <g id="crown" class="crown"><g filter="url(#wobble)">${[[200,170,92],[120,200,60],[284,200,62],[160,110,58],[246,112,60]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#8dbd86" ${O}/>`).join("")}
        ${[[150,180],[250,150],[205,230],[290,215],[120,140]].map(([x,y])=>`<path d="M${x} ${y} q8 -6 16 0" fill="none" stroke="#6f9a60" stroke-width="3" stroke-linecap="round"/>`).join("")}</g>
        <g transform="translate(232 196) scale(.8)" opacity=".9">${ITEM[g.item||"jar"]}</g></g>
      <g id="fx"></g><g id="drop" opacity="0"><g transform="translate(232 196) scale(.8)">${ITEM[g.item||"jar"]}</g></g>`;
    A.say(g.say||"Secoue l'arbre : touche-le plusieurs fois !");
    const crown=sv.querySelector("#crown"),fx=sv.querySelector("#fx");
    A.tap=()=>{replay(crown,"shk");k++;
      for(let i=0;i<2;i++){const x=110+Math.random()*180,c=["#8dbd86","#b5d68f","#f2a35c"][Math.floor(Math.random()*3)];
        const l=grp(fx,`<path d="M-8 0 Q0 -8 8 0 Q0 6 -8 0Z" fill="${c}" stroke="${INK}" stroke-width="2"/>`,{transform:`translate(${x} ${120+Math.random()*100})`});
        const f=mk(l,"animateTransform",{attributeName:"transform",type:"translate",additive:"sum",from:"0 0",to:`${(Math.random()-.5)*60} 300`,dur:"1.2s",fill:"freeze"});f.beginElement();setTimeout(()=>l.remove(),1300)}
      if(k===n){crown.lastElementChild.remove();const d=sv.querySelector("#drop");d.setAttribute("opacity",1);d.classList.add("fall");A.win(g.win||"Quelque chose est tombé !")}
      else if(k===Math.ceil(n/2))A.say("Encore ! Quelque chose bouge là-haut…")};
  },

  /* Fouiller : des tas de feuilles ; les premiers cachent des surprises, l'objet est toujours sous le troisième. */
  search(g,A){
    const sv=A.sv,P=[[100,180],[300,170],[200,290],[96,400],[304,392]],gags=[["snail","Un escargot. Il n'a rien vu."],["cone","Une pomme de pin. Pas ça…"],["pebble","Un caillou tout lisse."]];
    let k=0;
    sv.innerHTML=`<rect width="400" height="480" fill="#c9e2a4"/>${Array.from({length:30},(_,i)=>{const x=(i*137)%400,y=(i*89)%480;return `<path d="M${x} ${y} l-3 -6 M${x} ${y} l0 -7 M${x} ${y} l3 -6" stroke="#86b06e" stroke-width="2" stroke-linecap="round"/>`}).join("")}`;
    A.say(g.say||"Fouille les tas de feuilles !");
    P.forEach(([x,y],i)=>{
      const it=grp(sv,"",{transform:`translate(${x} ${y})`,opacity:0});
      const pile=grp(sv,`<g filter="url(#wobble)">${[[-26,4,"#f2a35c",-12],[0,-8,"#e8794e",8],[24,2,"#f6c065",-4],[-10,10,"#e98a5a",14],[14,12,"#f2a35c",-8],[0,0,"#f6c065",4]].map(([dx,dy,c,r])=>`<path d="M${dx-20} ${dy} Q${dx} ${dy-20} ${dx+20} ${dy} Q${dx} ${dy+8} ${dx-20} ${dy}Z" fill="${c}" transform="rotate(${r} ${dx} ${dy})" ${O}/>`).join("")}</g>`,{transform:`translate(${x} ${y})`,class:"pile"});
      pile.onpointerdown=e=>{e.stopPropagation();if(A.won||pile.classList.contains("gone"))return;pile.classList.add("gone");k++;
        if(k===3){it.innerHTML=ITEM[g.item||"wool"];it.setAttribute("opacity",1);it.classList.add("popin");A.win(g.win||"Trouvé !")}
        else{const [gi,t]=gags[(k-1+i)%gags.length];it.innerHTML=ITEM[gi];it.setAttribute("opacity",1);it.classList.add("popin");A.say(t)}};
    });
  },

  /* Attraper : des lucioles volent dans tous les sens ; on les touche une à une. */
  catch(g,A){
    const sv=A.sv,n=g.n||5,page=g.thing==="page";let got=0;
    sv.innerHTML=page?`<rect width="400" height="480" fill="#bfe0f2"/><path d="M0 300 Q100 280 200 296 Q300 280 400 300 V480 H0Z" fill="#bcd99a"/>
      ${[[60,90],[300,60],[200,140]].map(([x,y])=>`<path d="M${x} ${y} q20 -18 40 0 q16 -10 30 4 q-35 10 -70 -4Z" fill="#fff" opacity=".9"/>`).join("")}`:`<defs><radialGradient id="lg"><stop offset="0" stop-color="#fff6a0"/><stop offset=".35" stop-color="#ffe46a" stop-opacity=".8"/><stop offset="1" stop-color="#ffe46a" stop-opacity="0"/></radialGradient></defs>
      <rect width="400" height="480" fill="#3a3f78"/><path d="M0 330 Q100 300 200 320 Q300 300 400 330 V480 H0Z" fill="#4b6a5a"/>
      ${Array.from({length:18},(_,i)=>`<circle cx="${(i*97)%400}" cy="${(i*53)%260}" r="1.4" fill="#fff8d0" opacity=".8"/>`).join("")}`;
    const bugs=Array.from({length:n},()=>{const b={x:60+Math.random()*280,y:80+Math.random()*300,a:Math.random()*6.3,s:70+Math.random()*50};
      b.el=grp(sv,page?`<g filter="url(#wobble)"><rect x="-13" y="-16" width="26" height="32" rx="3" fill="#fffaf0" stroke="${INK}" stroke-width="2.4"/><path d="M-8 -9 h16 M-8 -3 h16 M-8 3 h11 M-8 9 h14" stroke="#cdb9ad" stroke-width="2"/></g><circle r="26" fill="transparent"/>`
        :`<circle r="30" fill="url(#lg)"/><circle r="5" fill="#fffbe0"/><circle r="26" fill="transparent"/>`);
      b.el.style.cursor="pointer";
      b.el.onpointerdown=e=>{e.stopPropagation();if(b.got||A.won)return;b.got=1;got++;b.el.classList.add("caught");setTimeout(()=>b.el.remove(),400);
        if(got===n)A.win(g.win||(page?"Toutes les pages !":"Toutes attrapées !"));else A.say(`${got} sur ${n}… encore !`)};
      return b});
    A.say(g.say||`Attrape les ${n} lucioles !`);
    A.loop(dt=>{for(const b of bugs){if(b.got)continue;b.a+=(Math.random()-.5)*4*dt;b.x+=Math.cos(b.a)*b.s*dt;b.y+=Math.sin(b.a)*b.s*dt;
      if(b.x<30||b.x>370)b.a=Math.PI-b.a;if(b.y<60||b.y>420)b.a=-b.a;b.x=Math.max(30,Math.min(370,b.x));b.y=Math.max(60,Math.min(420,b.y));
      b.el.setAttribute("transform",`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`+(page?` rotate(${(Math.sin(b.a*3)*25).toFixed(0)})`:""))}});
  },

  /* Ricochets : un toucher par rebond, quand le curseur passe dans la petite zone verte ; il accélère à chaque rebond.
     Un raté et le caillou coule : on recommence. Il faut need rebonds d'affilée. */
  ricochet(g,A){
    const sv=A.sv,need=g.need||4,X0=40,WG=320,HALF=16;let t=0,k=0,per=.9,st="aim";
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

  /* Cache-cache : le renard pointe le museau aux fenêtres, à la porte, derrière le pot… il faut le toucher. */
  whack(g,A){
    const sv=A.sv,need=g.need||5,id=g.who||g.target,H=[[136,170],[264,170],[200,300],[70,360],[330,360]];let k=0,last=-1;
    sv.innerHTML=`<rect width="400" height="480" fill="#bcd99a"/><g filter="url(#wobble)">
      <path d="M40 90 L360 90 L360 330 L40 330Z" fill="#f0c99a" ${O}/>${[120,150,180,210,240,270,300].map(y=>`<path d="M42 ${y} H358" stroke="#d9ac7c" stroke-width="2"/>`).join("")}
      <path d="M20 96 L200 20 L380 96Z" fill="#d98b7a" ${O}/>
      <rect x="96" y="130" width="80" height="78" rx="8" fill="#6a4434" ${O}/><rect x="224" y="130" width="80" height="78" rx="8" fill="#6a4434" ${O}/>
      <path d="M160 330 V250 Q200 220 240 250 V330Z" fill="#6a4434" ${O}/>
      <path d="M40 330 L60 400 L82 400 L100 330Z" fill="#e8794e" ${O}/><circle cx="330" cy="352" r="40" fill="#8dbd86" ${O}/></g><g id="pk"></g>
      <g filter="url(#wobble)"><path d="M92 206 H180 M220 206 H308" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M38 360 Q70 344 104 360 L98 372 H44Z" fill="#e8794e" ${O}/><path d="M290 380 Q330 350 372 380 Q330 396 290 380Z" fill="#7fb27f" ${O}/></g>`;
    const pk=sv.querySelector("#pk");
    A.say(g.say||`${FOX[id].name} joue à cache-cache : touche-le quand il se montre !`);
    const peek=()=>{let h;do h=Math.floor(Math.random()*H.length);while(h===last);last=h;const [x,y]=H[h];
      const p=grp(pk,faceAt(id,x,y,80,"joy")+`<circle cx="${x}" cy="${y}" r="42" fill="transparent"/>`,{class:"peek"});
      p.onpointerdown=e=>{e.stopPropagation();if(A.won||p.dataset.hit)return;p.dataset.hit=1;k++;p.classList.add("hit");
        if(k>=need)A.win(g.win||"Trouvé !");else A.say(`Trouvé ! ${k} sur ${need}… il se recache !`)};
      A.later(()=>{p.classList.add("hide");A.later(()=>p.remove(),250)},950-Math.min(250,k*50));
      A.later(peek,1150-Math.min(250,k*50))};
    A.later(peek,700);
  },

  /* La danse des flaques : le renard saute dans des flaques, il faut refaire la même suite. */
  simon(g,A){
    const sv=A.sv,id=g.who||g.target,P=[[110,230],[290,230],[110,390],[290,390]],COL=["#9ec3ef","#b7a6e6","#9fd8c4","#f3b9c8"],L=g.rounds||[3,4,5];
    let r=0,seq=[],idx=0,st="show";
    sv.innerHTML=`<rect width="400" height="480" fill="#c9e2a4"/>${P.map(([x,y],i)=>`<g class="pud" data-i="${i}"><ellipse cx="${x}" cy="${y}" rx="70" ry="34" fill="${COL[i]}" stroke="${INK}" stroke-width="3"/><path d="M${x-40} ${y-6} q20 -8 40 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`).join("")}<g id="hopper" style="transition:transform .28s cubic-bezier(.3,1.5,.5,1)">${foxAt(id,0,0,90)}</g>`;
    const hopper=sv.querySelector("#hopper"),puds=[...sv.querySelectorAll(".pud")];
    const splash=i=>{replay(puds[i],"flash");const [x,y]=P[i];const s=grp(sv,`<g class="splash">${[-30,-12,12,30].map(dx=>`<circle cx="${x+dx}" cy="${y-10}" r="5" fill="#fff"/>`).join("")}</g>`);setTimeout(()=>s.remove(),500)};
    const jump=i=>{const [x,y]=P[i];hopper.style.transform=`translate(${x}px,${y+8}px)`;A.later(()=>splash(i),200)};
    hopper.style.transform="translate(200px,316px)";
    const show=()=>{st="show";idx=0;A.say(`Regarde bien ${FOX[id].name}…`);seq.forEach((p,i)=>A.later(()=>jump(p),600+i*650));
      A.later(()=>{hopper.style.transform="translate(200px,316px)";st="input";A.say("À toi ! Saute dans les mêmes flaques.")},600+seq.length*650+300)};
    const round=()=>{seq=[];for(let i=0;i<L[r];i++){let p;do p=Math.floor(Math.random()*4);while(p===seq[i-1]);seq.push(p)}show()};
    puds.forEach((pd,i)=>pd.onpointerdown=e=>{e.stopPropagation();if(st!=="input"||A.won)return;splash(i);
      if(i!==seq[idx]){st="show";A.say(`Raté ! ${FOX[id].name} recommence.`);A.later(show,900);return}
      if(++idx===seq.length){r++;if(r>=L.length)A.win(g.win||"Parfait !");else{st="show";A.say("Bravo ! Une flaque de plus…");A.later(round,900)}}});
    round();
  },

  /* Ne bouge plus : Gribouille peint ; des mouches viennent chatouiller le museau du modèle, il faut les chasser. */
  still(g,A){
    const sv=A.sv,ids=g.all?foxes.filter(f=>!f.wild&&f.id!=="gribouille").map(f=>f.id).slice(0,6):[g.target],N=ids.length;
    const dur=g.all?11:8,w=N>1?Math.min(120,340/Math.ceil(N/2)):190;
    const pos=ids.map((id,i)=>N===1?[200,380]:[(i%Math.ceil(N/2)+.5)*(360/Math.ceil(N/2))+20,i<Math.ceil(N/2)?300:430]);
    sv.innerHTML=`<rect width="400" height="480" fill="#f0c99a"/>${Array.from({length:8},(_,i)=>`<path d="M0 ${60+i*56} H400" stroke="#d9ac7c" stroke-width="2"/>`).join("")}
      <rect x="40" y="112" width="320" height="20" rx="10" fill="#fff" stroke="${INK}" stroke-width="3"/><rect id="bar" x="43" y="115" width="0" height="14" rx="7" fill="#9ec3ef"/>
      <text x="200" y="152" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">Gribouille peint…</text>`;
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
