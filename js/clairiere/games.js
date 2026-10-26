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

const JUNK=[["boot","Une vieille botte… Raté !"],["algae","Des algues. Beurk."],["twig","Une brindille."],["leaf","Une feuille toute mouillée."],["pebble","Un caillou. Pas de chance !"]];

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
  /* Pêche : le bouchon frétille (pas encore !), puis plonge : il faut toucher tout de suite. */
  fish(g,A){
    const sv=A.sv;
    sv.innerHTML=`<rect width="400" height="480" fill="#a9d3e6"/><g filter="url(#wobble)">
      <path d="M0 0 H400 V70 Q300 96 200 80 Q100 96 0 70Z" fill="#bcd99a" ${O}/>
      ${[[70,170,30],[330,330,36],[90,400,26]].map(([x,y,r])=>`<path d="M${x} ${y} m-${r} 0 a${r} ${r*.62} 0 1 0 ${2*r} 0 a${r} ${r*.62} 0 1 0 -${2*r} 0 M${x} ${y} l${r*.9} -${r*.35}" fill="#8fca7a" ${O}/>`).join("")}
      <path d="M20 88 l-6 -40 M34 84 l2 -46 M372 88 l6 -38" fill="none" stroke="#6f9a60" stroke-width="4" stroke-linecap="round"/></g>
      <path d="M120 200 q30 -10 60 0 M230 330 q24 -8 48 0 M150 420 q20 -6 40 0" fill="none" stroke="#e4f3f9" stroke-width="3" stroke-linecap="round"/>
      <ellipse id="shadow" cx="200" cy="300" rx="22" ry="9" fill="#5f8fa6" opacity=".35"/>
      <g id="rip" opacity="0"><ellipse cx="200" cy="258" rx="26" ry="9" fill="none" stroke="#fff" stroke-width="3"/><ellipse cx="200" cy="258" rx="44" ry="15" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/></g>
      <path d="M200 0 L200 236" stroke="#fff" stroke-width="1.6" opacity=".8"/>
      <g id="bob" class="bob"><g filter="url(#wobble)"><circle cx="200" cy="250" r="13" fill="#fff" ${O}/><path d="M187 250 a13 13 0 0 1 26 0Z" fill="#e0564f" ${O}/><path d="M200 237 v-8" ${O}/></g></g>
      <g id="excl" opacity="0"><circle cx="236" cy="214" r="15" fill="#ffd36a" stroke="${INK}" stroke-width="3"/><text x="236" y="221" text-anchor="middle" font-size="20" font-weight="900" fill="${INK}">!</text></g>
      <g id="catch" opacity="0"><g transform="translate(200 250)">${ITEM.fish}</g></g>`;
    const bob=sv.querySelector("#bob"),rip=sv.querySelector("#rip"),ex=sv.querySelector("#excl"),sh=sv.querySelector("#shadow");
    let st="wait";
    const dip=(y,back)=>{bob.style.transform=`translateY(${y}px)`;if(back)A.later(()=>bob.style.transform="",170)};
    const start=()=>{A.clear();st="wait";bob.style.opacity=1;bob.style.transform="";rip.setAttribute("opacity",0);ex.setAttribute("opacity",0);
      A.say(g.say||"Touche l'eau dès que le bouchon plonge !");
      sh.style.transform=`translate(${(Math.random()-.5)*120}px,40px)`;A.later(()=>sh.style.transform="translate(0,12px)",400);
      let nib=1+Math.floor(Math.random()*3);
      const step=()=>{if(nib-->0)A.later(()=>{dip(5,1);A.later(step,0)},800+Math.random()*900);
        else A.later(()=>{st="bite";dip(20);rip.setAttribute("opacity",1);ex.setAttribute("opacity",1);
          A.later(()=>{if(st==="bite"){st="miss";A.say("Trop tard… il a filé. Encore une fois !");A.later(start,1300)}},950)},700+Math.random()*900)};
      step()};
    A.tap=()=>{
      if(st==="wait"){st="miss";A.clear();bob.style.transform="";A.say("Trop tôt ! Le poisson a eu peur. Encore une fois !");A.later(start,1300)}
      else if(st==="bite"){st="won";ex.setAttribute("opacity",0);bob.style.opacity=0;const c=sv.querySelector("#catch");
        // pêche libre : un poisson une fois sur dix, sinon ce qui traîne au fond de la mare
        const it=g.free&&Math.random()>=.1?JUNK[Math.floor(Math.random()*JUNK.length)][0]:"fish";
        c.innerHTML=`<g transform="translate(200 250)">${ITEM[it]}</g>`;c.setAttribute("opacity",1);replay(c,"leap");
        if(!g.free)A.win(g.win||"Attrapé !");
        else{A.say(it==="fish"?g.onFish():JUNK.find(j=>j[0]===it)[1]);A.later(()=>{c.setAttribute("opacity",0);c.classList.remove("leap");bob.style.opacity=1;start()},1700)}}};
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
    const sv=A.sv,n=g.n||5;let got=0;
    sv.innerHTML=`<defs><radialGradient id="lg"><stop offset="0" stop-color="#fff6a0"/><stop offset=".35" stop-color="#ffe46a" stop-opacity=".8"/><stop offset="1" stop-color="#ffe46a" stop-opacity="0"/></radialGradient></defs>
      <rect width="400" height="480" fill="#3a3f78"/><path d="M0 330 Q100 300 200 320 Q300 300 400 330 V480 H0Z" fill="#4b6a5a"/>
      ${Array.from({length:18},(_,i)=>`<circle cx="${(i*97)%400}" cy="${(i*53)%260}" r="1.4" fill="#fff8d0" opacity=".8"/>`).join("")}`;
    const bugs=Array.from({length:n},()=>{const b={x:60+Math.random()*280,y:80+Math.random()*300,a:Math.random()*6.3,s:70+Math.random()*50};
      b.el=grp(sv,`<circle r="30" fill="url(#lg)"/><circle r="5" fill="#fffbe0"/><circle r="26" fill="transparent"/>`);
      b.el.style.cursor="pointer";
      b.el.onpointerdown=e=>{e.stopPropagation();if(b.got||A.won)return;b.got=1;got++;b.el.classList.add("caught");setTimeout(()=>b.el.remove(),400);
        if(got===n)A.win(g.win||"Toutes attrapées !");else A.say(`${got} sur ${n}… encore !`)};
      return b});
    A.say(g.say||`Attrape les ${n} lucioles !`);
    A.loop(dt=>{for(const b of bugs){if(b.got)continue;b.a+=(Math.random()-.5)*4*dt;b.x+=Math.cos(b.a)*b.s*dt;b.y+=Math.sin(b.a)*b.s*dt;
      if(b.x<30||b.x>370)b.a=Math.PI-b.a;if(b.y<60||b.y>420)b.a=-b.a;b.x=Math.max(30,Math.min(370,b.x));b.y=Math.max(60,Math.min(420,b.y));
      b.el.setAttribute("transform",`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`)}});
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
