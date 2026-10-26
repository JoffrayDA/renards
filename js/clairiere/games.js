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
  if(g.k==="fish")sayEl.classList.add("low"); // à la pêche, la berge et la canne sont en haut
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
  /* Pêche : Roussette pêche depuis la berge. Une ombre approche ; elle grignote (ploc, petit rond : pas encore !),
     puis mord : le bouchon coule, gros remous, « ! » et vibration. Il faut toucher tout de suite. */
  fish(g,A){
    const sv=A.sv,BX=210,BY=270;
    sv.innerHTML=`<rect width="400" height="480" fill="#a9d3e6"/>
      <path d="M120 210 q30 -10 60 0 M250 350 q24 -8 48 0 M130 420 q20 -6 40 0" fill="none" stroke="#e4f3f9" stroke-width="3" stroke-linecap="round"/>
      <g filter="url(#wobble)">${[[60,200,28],[340,320,34],[90,410,24]].map(([x,y,r])=>`<path d="M${x} ${y} m-${r} 0 a${r} ${r*.62} 0 1 0 ${2*r} 0 a${r} ${r*.62} 0 1 0 -${2*r} 0 M${x} ${y} l${r*.9} -${r*.35}" fill="#8fca7a" ${O}/>`).join("")}</g>
      <ellipse id="shadow" cx="${BX}" cy="${BY+30}" rx="24" ry="10" fill="#4f7f96" opacity=".4" style="transition:transform 1.6s ease-in-out"/>
      <g id="rips"></g>
      <g filter="url(#wobble)"><path d="M0 0 H400 V96 Q300 124 200 108 Q100 124 0 96Z" fill="#bcd99a" ${O}/>
      <path d="M330 104 l-6 -40 M346 100 l2 -46 M372 104 l6 -38" fill="none" stroke="#6f9a60" stroke-width="4" stroke-linecap="round"/></g>
      ${foxAt("roussette",86,122,96,{pose:"sit"})}
      <path d="M112 84 Q150 30 196 26" fill="none" stroke="#a9785a" stroke-width="5" stroke-linecap="round"/>
      <path id="line" d="M196 26 Q${BX+4} 140 ${BX} ${BY-12}" fill="none" stroke="#fff" stroke-width="1.8"/>
      <g id="bob" class="bob"><g filter="url(#wobble)"><circle cx="${BX}" cy="${BY}" r="13" fill="#fff" ${O}/><path d="M${BX-13} ${BY} a13 13 0 0 1 26 0Z" fill="#e0564f" ${O}/><path d="M${BX} ${BY-13} v-6" ${O}/></g></g>
      <g id="excl" opacity="0"><circle cx="${BX+40}" cy="${BY-44}" r="17" fill="#ffd36a" stroke="${INK}" stroke-width="3"/><text x="${BX+40}" y="${BY-36}" text-anchor="middle" font-size="22" font-weight="900" fill="${INK}">!</text></g>
      <g id="card" opacity="0"></g>`;
    const bob=sv.querySelector("#bob"),rips=sv.querySelector("#rips"),ex=sv.querySelector("#excl"),sh=sv.querySelector("#shadow"),card=sv.querySelector("#card");
    let st="wait";
    const ring=(r,w)=>{const e=grp(rips,`<ellipse cx="${BX}" cy="${BY+4}" rx="${r}" ry="${r*.36}" fill="none" stroke="#fff" stroke-width="${w}" class="ring"/>`);setTimeout(()=>e.remove(),800)};
    const start=()=>{A.clear();st="wait";card.setAttribute("opacity",0);sh.style.opacity="";bob.style.opacity=1;bob.style.transform="";ex.setAttribute("opacity",0);
      A.say(g.say||"Attends que le bouchon coule, puis touche vite !");
      // l'ombre arrive de loin et tourne autour du bouchon
      const a=Math.random()*6.3;sh.style.transition="none";sh.style.transform=`translate(${Math.cos(a)*170}px,${Math.sin(a)*120+60}px)`;
      A.later(()=>{sh.style.transition="";sh.style.transform="translate(0,0)"},60);
      let nib=1+Math.floor(Math.random()*3);
      const step=()=>{if(nib-->0)A.later(()=>{ring(14,2);bob.style.transform="translateY(3px)";A.later(()=>bob.style.transform="",140);A.say("Ploc… elle grignote. Pas encore !");A.later(step,0)},900+Math.random()*900);
        else A.later(()=>{st="bite";bob.style.transform="translateY(22px)";bob.style.opacity=.35;ring(20,3.4);ring(40,2.4);ex.setAttribute("opacity",1);A.say("Ça mord ! Touche vite !");
          try{navigator.vibrate&&navigator.vibrate(90)}catch(e){}
          A.later(()=>{if(st==="bite"){st="miss";ex.setAttribute("opacity",0);bob.style.opacity=1;bob.style.transform="";A.say("Trop tard… elle a filé. On relance !");A.later(start,1400)}},1150)},800+Math.random()*1000)};
      A.later(step,1200)};
    // la prise s'affiche sur une petite carte
    const show=(it,txt)=>{card.innerHTML=`<g transform="translate(${BX} 250)"><rect x="-90" y="-62" width="180" height="124" rx="22" fill="#fffaf2" stroke="${INK}" stroke-width="3"/>
      <g transform="translate(0 -12) scale(2.2)">${ITEM[it]}</g><text y="46" text-anchor="middle" font-size="15" font-weight="900" fill="${INK}">${txt}</text></g>`;card.setAttribute("opacity",1);replay(card,"popin")};
    A.tap=()=>{
      if(st==="wait"){st="miss";A.clear();bob.style.transform="";sh.style.transform=`translate(${(Math.random()<.5?-1:1)*200}px,40px)`;A.say("Trop tôt ! Le poisson a eu peur. On relance !");A.later(start,1400)}
      else if(st==="bite"){st="won";ex.setAttribute("opacity",0);bob.style.opacity=0;sh.style.opacity=0;
        // pêche libre : un poisson une fois sur dix, sinon ce qui traîne au fond de la mare
        const j=g.free&&Math.random()>=.1?JUNK[Math.floor(Math.random()*JUNK.length)]:null,it=j?j[0]:"fish";
        show(it,j?j[2]:"Un poisson !");
        if(!g.free)A.win(g.win||"Attrapé !");
        else{A.say(j?j[1]:g.onFish());A.later(start,1900)}}};
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

  /* Ricochets : un curseur va et vient ; plus on lance près du milieu, plus le caillou rebondit. */
  ricochet(g,A){
    const sv=A.sv,need=g.need||5,X0=40,WG=320;let t=0,st="aim";
    sv.innerHTML=`<rect width="400" height="480" fill="#bfe0f2"/><g filter="url(#wobble)"><path d="M0 170 Q100 150 200 164 Q300 150 400 170 V200 H0Z" fill="#8dbd86" ${O}/></g>
      <rect y="196" width="400" height="200" fill="#a9d3e6"/><path d="M60 240 q30 -8 60 0 M220 300 q26 -8 52 0 M120 350 q24 -6 48 0" fill="none" stroke="#e4f3f9" stroke-width="3" stroke-linecap="round"/>
      <rect y="392" width="400" height="88" fill="#d9c6a4"/><g id="rings"></g>
      <circle id="stone" cx="40" cy="300" r="9" fill="#cfc6c0" stroke="${INK}" stroke-width="2.6" style="transition:transform .14s linear"/>
      <rect x="${X0}" y="420" width="${WG}" height="24" rx="12" fill="#f6b3a8" stroke="${INK}" stroke-width="3"/>
      <rect x="${200-44}" y="423" width="88" height="18" fill="#f6d77a"/><rect x="${200-26}" y="423" width="52" height="18" fill="#a9d68f"/>
      <rect id="cur" x="${X0}" y="412" width="8" height="40" rx="4" fill="${INK}"/>`;
    const cur=sv.querySelector("#cur"),stone=sv.querySelector("#stone"),rings=sv.querySelector("#rings");
    A.say(g.say||`Lance quand le curseur est dans le vert : ${need} rebonds !`);
    const pos=()=>(1-Math.cos(t*Math.PI/.9))/2;
    A.loop(dt=>{if(st!=="aim")return;t+=dt;cur.setAttribute("x",(X0+pos()*WG-4).toFixed(1))});
    A.tap=()=>{if(st!=="aim")return;st="throw";const d=Math.abs(pos()-.5)/.5,n=Math.max(1,Math.min(6,Math.round(6-d*9)));
      rings.innerHTML="";let i=0;
      const hop=()=>{if(i>=n){stone.style.opacity=0;
          if(n>=need)A.win(g.win||`${n} rebonds !`);else{A.say(`${n} rebond${n>1?"s":""}… Il en faut ${need}. Encore !`);A.later(()=>{st="aim";stone.style.transform="";stone.style.opacity=1;rings.innerHTML=""},1300)}return}
        const x=60+(i+1)*48,y=300-i*12;stone.style.transform=`translate(${x-40}px,${y-300-26}px)`;
        A.later(()=>{stone.style.transform=`translate(${x-40}px,${y-300}px)`;grp(rings,`<ellipse cx="${x}" cy="${y+6}" rx="14" ry="5" fill="none" stroke="#fff" stroke-width="3" class="ring"/>`);i++;A.later(hop,140)},140)};
      hop()};
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
