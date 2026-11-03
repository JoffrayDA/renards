/* La veille de Noël (histoire de Barbe-Neige, 03/11/2026, Joffray : « faut que ça claque ») : le traîneau sans renne s'écrase devant
   la maison, on retrouve le marteau, Copeau répare le patin, on fait la tournée des maisons (jeu tournee), et Barbe-Neige et Ramure
   livrent en dernier un énorme cadeau chez nous : la boule à neige de la clairière (objet de la maison, jamais en boutique). */
const noWob=s=>s.replace(/ ?filter="url\(#wobble\)"/g,"");
// le traîneau, patins à plat en (0,0), tourné vers la droite ; riders : qui est dedans, ram : Ramure devant, broken : le patin cassé
function sleighArt(o={}){const fox=(id,x,y,w,op)=>`<g transform="translate(${x} 0) scale(-1 1)">${noWob(foxAt(id,0,y,w,op||{pose:"happy"}))}</g>`;
  const run=o.broken?"M-58 -4 H-6 L8 2 M16 -10 L34 -2 Q52 -6 50 -20":"M-58 -4 H42 Q60 -4 58 -20 Q56 -30 46 -25";
  return `<svg viewBox="-80 -112 ${o.ram?260:170} 124" aria-hidden="true" style="display:block;width:100%;overflow:visible">
    ${o.ram?`<path d="M36 -44 Q70 -34 104 -28" fill="none" stroke="#8a5a3a" stroke-width="3"/>${fox("ramure",128,-2,84,{pose:"walk",frame:1})}`:""}
    <path d="${run}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${run}" fill="none" stroke="#f2c75c" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M-42 -4 V-18 M-8 -4 V-18 M26 -4 V-18" stroke="${INK}" stroke-width="3"/>
    <g stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"><rect x="-58" y="-100" width="24" height="24" rx="3" fill="#7fb86a"/><rect x="-38" y="-92" width="20" height="18" rx="3" fill="#f6a5b4"/></g>
    ${o.empty?"":fox("barbeneige",4,-30,58)}${o.me?fox("roussette",-26,-30,50):""}
    <path d="M-60 -18 V-66 Q-60 -76 -50 -72 L-40 -42 H22 Q32 -42 38 -56 Q44 -70 56 -64 Q60 -42 48 -26 Q42 -18 30 -18Z" fill="#d9584e" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-56 -28 H40" stroke="#f2c75c" stroke-width="4"/>${[-44,-16,12].map(x=>`<circle cx="${x}" cy="-35" r="3" fill="#f2c75c"/>`).join("")}<circle cx="54" cy="-58" r="3.6" fill="#f2c75c" stroke="${INK}" stroke-width="1.6"/></svg>`}
const giftSVG=(c="#e2445e",r="#f7d77a")=>`<rect x="-9" y="-8" width="18" height="16" rx="2" fill="${c}" stroke="${INK}" stroke-width="2"/><path d="M0 -8 V8" stroke="${r}" stroke-width="4"/><path d="M0 -8 q-8 -8 -9 -1 q4 3 9 1 q8 -8 9 -1 q-4 3 -9 1" fill="${r}" stroke="${INK}" stroke-width="1.4"/>`;

/* ---------- le jeu : la tournée ---------- */
// du doigt, on monte et on descend le traîneau ; passer juste au-dessus d'une cheminée y lâche le cadeau. Nuages et grands sapins secouent
// (3 chocs : on recommence). Une cheminée ratée revient plus loin. Tout au bout, le grand sapin de la clairière : y poser l'étoile.
GAMES.tournee=function(g,A){const sv=A.sv,N=g.n||7,SXL=118,TOP=Math.max(-EXT+70,30),ids=Object.keys(R.res).filter(i=>FOX[i]&&!["barbeneige","ramure"].includes(i));
  const COL=["#d98a5c","#a9785a","#c97f6a","#8d7ba8","#7a9a8a"];let st,scroll,sy,ty,vy,left,hits,inv,items,lastX,bob=0,done=0,spd,sn=0;
  sv.innerHTML=`<defs><linearGradient id="tkS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121a44"/><stop offset=".65" stop-color="#3b3a78"/><stop offset="1" stop-color="#7a6aa0"/></linearGradient>
    <radialGradient id="tkG"><stop offset="0" stop-color="#fff6c0"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient></defs>
    <rect y="${-EXT}" width="400" height="${H}" fill="url(#tkS)"/>
    ${Array.from({length:50},(_,i)=>`<circle cx="${(i*83)%400}" cy="${-EXT+((i*57)%(EXT+330))}" r="${1+i%2*.8}" fill="#fff" opacity="${.4+(i%3)*.25}"/>`).join("")}
    <circle cx="320" cy="${Math.max(-EXT+70,50)}" r="30" fill="#fff4cc"/><circle cx="320" cy="${Math.max(-EXT+70,50)}" r="70" fill="url(#tkG)" opacity=".5"/>
    <path d="M-20 ${Math.max(-EXT+120,70)} Q110 ${Math.max(-EXT+70,30)} 220 ${Math.max(-EXT+120,70)} T420 ${Math.max(-EXT+90,50)}" fill="none" stroke="#7fe0c0" stroke-width="26" opacity=".13" stroke-linecap="round"/>
    <g id="tkH"></g><g id="tkW"></g><g id="tkF"></g><g id="tkSl"></g><g id="tkN"></g>`;
  const hills=sv.querySelector("#tkH"),w=sv.querySelector("#tkW"),fx=sv.querySelector("#tkF"),sl=sv.querySelector("#tkSl"),flakes=sv.querySelector("#tkN");
  hills.innerHTML=[0,1].map(k=>`<path transform="translate(${k*800} 0)" d="M0 480 V400 Q100 340 220 395 T430 370 T640 395 T800 400 V480Z" fill="#2b2f60"/>`).join("");
  sl.innerHTML=`<g id="tkSi" transform="translate(-70 -95) scale(.74)"><foreignObject x="-20" y="-10" width="0" height="0"></foreignObject></g>`;
  const si=sl.firstChild;si.innerHTML=sleighArt({ram:1,me:1}).replace(/^<svg/,`<svg x="-30" y="-10" width="240" height="114"`);
  const fl=Array.from({length:26},(_,i)=>({x:(i*61)%400,y:-EXT+((i*97)%H),r:1.4+i%3,el:mk(flakes,"circle",{fill:"#fff",opacity:.8})}));fl.forEach(f=>f.el.setAttribute("r",f.r));
  const house=(x,cy,c)=>{const y=cy+34,id=ids.length?ids[Math.floor(Math.random()*ids.length)]:"petitpois";
    return grp(w,`<rect x="${x-54}" y="${y+40}" width="108" height="${480-y-40}" fill="${c}" stroke="${INK}" stroke-width="3"/><rect class="dk" x="${x-18}" y="${y+56}" width="36" height="32" rx="5" fill="#2a2850" stroke="${INK}" stroke-width="2.6"/>
      <g class="lit" opacity="0"><rect x="${x-18}" y="${y+56}" width="36" height="32" rx="5" fill="#ffe08a" stroke="${INK}" stroke-width="2.6"/>${noWob(faceAt(id,x,y+72,30))}</g>
      <rect x="${x+14}" y="${cy}" width="20" height="44" fill="#9a6a58" stroke="${INK}" stroke-width="3"/><rect x="${x+10}" y="${cy-5}" width="28" height="9" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.4"/>
      <path d="M${x-72} ${y+44} L${x} ${y-14} L${x+72} ${y+44}Z" fill="#a0463e" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M${x-72} ${y+44} L${x} ${y-14} L${x+72} ${y+44} Q${x+46} ${y+34} ${x+30} ${y+24} Q${x+6} ${y+34} ${x-14} ${y+18} Q${x-34} ${y+42} ${x-72} ${y+44}Z" fill="#fff" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <circle class="tkm" cx="${x+24}" cy="${cy-58}" r="20" fill="#fff" opacity=".0"/><path d="M${x+24} ${cy-26} l-9 -10 h18Z" fill="#ffe27a" stroke="${INK}" stroke-width="2"/>`)};
  const cloud=(x,y)=>grp(w,`<g transform="translate(${x} ${y})"><path d="M-44 14 Q-58 -2 -34 -10 Q-30 -32 -6 -24 Q14 -38 28 -14 Q54 -12 46 12 Q0 26 -44 14Z" fill="#5a5888" stroke="${INK}" stroke-width="3"/><path d="M-22 -8 q4 3 8 0 M12 -8 q4 3 8 0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M-8 6 q6 -5 12 0" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`);
  const pine=(x,y)=>grp(w,`<rect x="${x-7}" y="${y+150}" width="14" height="${Math.max(0,330-y)}" fill="#6a4a3a" stroke="${INK}" stroke-width="2.6"/>${[0,1,2].map(i=>`<path d="M${x} ${y+i*46} L${x-(28+i*12)} ${y+60+i*46} H${x+28+i*12}Z" fill="#2f6a4c" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M${x} ${y+i*46} L${x-14-i*4} ${y+30+i*46} H${x+14+i*4}Z" fill="#fff"/>`).join("")}`);
  const bigtree=(x,y)=>grp(w,`${[0,1,2,3,4,5].map(i=>`<path d="M${x} ${y+i*58} L${x-(40+i*22)} ${y+78+i*58} H${x+40+i*22}Z" fill="#2c5f46" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>${[-1,1].map(s=>`<circle cx="${x+s*(18+i*11)}" cy="${y+66+i*58}" r="6" fill="${["#e2445e","#7cb8e0","#f2c45a"][(i+s+3)%3]}" stroke="${INK}" stroke-width="1.8"/>`).join("")}`).join("")}
    <g class="tst" opacity="0" transform="translate(${x} ${y-8})"><circle r="70" fill="url(#tkG)"/><path d="M0 -24 L6 -7 L24 -6 L10 5 L14 23 L0 12 L-14 23 L-10 5 L-24 -6 L-6 -7Z" fill="#ffe27a" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/></g>
    <path class="tar" d="M${x} ${y-30} l-10 -12 h20Z" fill="#ffe27a" stroke="${INK}" stroke-width="2"/>`);
  // une maison de plus sur le parcours, avec de quoi monter et descendre entre deux cheminées
  const addHouse=()=>{const cy=270+Math.random()*90,x=lastX+(items.length?330:420);items.push({k:"h",x,cy,el:house(x,cy,COL[Math.floor(Math.random()*COL.length)])});lastX=x;
    const r=Math.random();if(done+items.filter(i=>i.k==="h").length>1||r<.5){const ox=x+165;if(r<.5){const oy=cy-90-Math.random()*70;items.push({k:"c",x:ox,y:oy,el:cloud(ox,oy)})}else{const py=230+Math.random()*40;items.push({k:"p",x:ox,y:py,el:pine(ox,py)})}}};
  const say=()=>A.say(`Plus que ${left} maison${left>1?"s":""} ! Passe juste au-dessus des cheminées.`);
  const reset=()=>{w.innerHTML="";fx.innerHTML="";items=[];lastX=400;scroll=0;sy=ty=220;vy=0;left=N;hits=0;inv=0;done=0;spd=165;st="play";for(let i=0;i<N;i++)addHouse();say()};
  drag(A,p=>{ty=Math.max(TOP,Math.min(450,p.y))});
  const drop=(x,y,cy,then)=>{const e=grp(fx,giftSVG(["#e2445e","#7cb8e0","#8fca7a","#c9a0ec"][done%4]));let t=0,vy0=y;const f={x,y:vy0,cy,e,then,t};fall.push(f)};let fall=[];
  const finale=()=>{const x=lastX+420,y=150+Math.random()*30;items.push({k:"t",x,y,el:bigtree(x,y)});lastX=x;A.say("La dernière maison : la tienne ! Pose l'étoile tout en haut du sapin !")};
  A.dbg=()=>({st,sy,scroll,left,hits,items:items.map(i=>({k:i.k,x:i.x-scroll,cy:i.cy,y:i.y}))});A.set=y=>{ty=y};
  A.loop(dt=>{if(st==="won")dt*=.2;bob+=dt*5;scroll+=spd*dt;spd=Math.min(215,spd+dt*2);
    sn+=dt;w.setAttribute("transform",`translate(${(-scroll).toFixed(1)} 0)`);hills.setAttribute("transform",`translate(${(-(scroll*.25)%800).toFixed(1)} 0)`);
    const ny=sy+(ty-sy)*Math.min(1,dt*6);vy=(ny-sy)/Math.max(dt,.001);sy=ny;
    sl.setAttribute("transform",`translate(${SXL} ${(sy+Math.sin(bob)*3).toFixed(1)}) rotate(${Math.max(-16,Math.min(16,vy*.05)).toFixed(1)})${inv>0&&Math.floor(inv*10)%2?" scale(1 .92)":""}`);
    fl.forEach(f=>{f.x-=(spd*.45+f.r*20)*dt;f.y+=(24+f.r*10)*dt;if(f.x<0)f.x+=400;if(f.y>480)f.y=-EXT;f.el.setAttribute("cx",f.x.toFixed(0));f.el.setAttribute("cy",f.y.toFixed(0))});
    for(const f of fall){f.t+=dt;f.y+=(90+f.t*420)*dt;f.x+=(-spd*.0)*dt;f.e.setAttribute("transform",`translate(${(f.x-scroll).toFixed(1)} ${f.y.toFixed(1)})`);if(f.y>=f.cy){f.e.remove();f.dead=1;f.then()}}fall=fall.filter(f=>!f.dead);
    if(st!=="play")return;inv=Math.max(0,inv-dt);
    for(const it of items){const dx=it.x-scroll-SXL;
      if(it.k==="c"&&!it.off&&inv<=0&&Math.hypot(dx,sy-30-it.y)<54)hit("Un nuage de neige !");
      if(it.k==="p"&&!it.off&&inv<=0&&Math.abs(dx)<34&&sy>it.y+18)hit("Un sapin ! Monte !");
      if(it.k==="h"&&!it.pass&&dx<-22){it.pass=1;
        const ok=sy>it.cy-96&&sy<it.cy-14;
        if(ok){done++;left--;A.sfx("good",done);const e=it.el,xs=it.x+24;drop(xs,sy,it.cy,()=>{A.sfx("pop");const l=e.querySelector(".lit");l.setAttribute("opacity",1);l.animate([{transform:"scale(1)"},{transform:"scale(1)"}],{duration:200});e.querySelector(".tkm").setAttribute("opacity",0)});
          it.el.querySelector("path[d*='l-9 -10']")?.remove();
          if(left===Math.floor(N/2)&&left)A.cheer("CONTINUE !");if(left>0)say();else finale()}
        else{A.sfx("bad");A.say("Cheminée ratée ! La maison revient plus loin.");it.el.querySelector("path[d*='l-9 -10']")?.remove();const tree=items.find(i=>i.k==="t");if(tree){}addHouse()}}
      if(it.k==="t"&&!it.pass&&dx<4){it.pass=1;const ok=sy>it.y-104&&sy<it.y+6;
        if(ok){st="won";spd=70;const s=it.el.querySelector(".tst");it.el.querySelector(".tar").remove();s.setAttribute("opacity",1);A.sfx("win");A.win(g.win||"L'étoile brille en haut du sapin !")}
        else{A.sfx("bad");A.say("Trop loin ! Ramure refait un tour…");it.el.remove();it.off=1;lastX=it.x;finale()}}
      if(dx<-300&&it.el){it.el.remove();it.off=1}}
    items=items.filter(i=>!i.off||i.x-scroll>-300)});
  function hit(t){inv=1.1;hits++;A.sfx("bad");try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}
    if(hits>=3){st="lost";A.sfx("lose");A.say("Trop de chocs : les cadeaux sont tombés ! On recommence la tournée.");A.later(reset,1600);return}A.say(`${t} Encore ${3-hits} choc${3-hits>1?"s":""} et les cadeaux tombent.`)}
  reset()};

/* ---------- la boule à neige : l'énorme cadeau ---------- */
// la clairière en tout petit, sous verre (big : avec les renards et la neige qui tombe)
function globeArt(big){const fl=big?Array.from({length:22},(_,i)=>{const x=-58+(i*37)%116,d=3+i%4;return `<circle cx="${x}" r="${1.4+i%3*.6}" fill="#fff"><animate attributeName="cy" from="-112" to="-30" dur="${d}s" begin="-${(i*.7).toFixed(1)}s" repeatCount="indefinite"/></circle>`}).join(""):[[-30,-90],[8,-104],[32,-78],[-14,-64],[22,-54]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join("");
  return `<defs><clipPath id="glc${big?1:0}"><circle cy="-66" r="58"/></clipPath><radialGradient id="glg${big?1:0}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#3b4a8a"/><stop offset="1" stop-color="#1a2358"/></radialGradient></defs>
    <path d="M-44 0 L-36 -20 H36 L44 0Z" fill="#b9814a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M-38 -9 H38" stroke="#f2c45a" stroke-width="3.4"/>
    <circle cy="-66" r="58" fill="url(#glg${big?1:0})"/>
    <g clip-path="url(#glc${big?1:0})"><path d="M-62 -34 Q0 -50 62 -34 V0 H-62Z" fill="#f6f9fc"/>
      <path d="M-4 -50 L12 -66 L28 -50 V-34 H-4Z" fill="#a9785a" stroke="${INK}" stroke-width="2"/><path d="M-9 -49 L12 -70 L33 -49Z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><rect x="8" y="-46" width="8" height="12" fill="#ffe08a" stroke="${INK}" stroke-width="1.4"/>
      ${[0,1,2].map(i=>`<path d="M-28 ${-92+i*14} L${-38-i*5} ${-74+i*14} H${-18+i*5}Z" fill="#2f6a4c" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`).join("")}
      <path d="M-28 -102 l2.4 5.6 l6 .4 l-4.6 3.8 l1.6 6 l-5.4 -3.2 l-5.4 3.2 l1.6 -6 l-4.6 -3.8 l6 -.4Z" fill="#ffe27a" stroke="${INK}" stroke-width="1.4"/>
      ${big?["petitpois","roussette","ramure"].map((id,i)=>noWob(foxAt(id,-22+i*22,-24+(i%2)*2,26))).join(""):`<circle cx="-14" cy="-32" r="5" fill="#8fca7a" stroke="${INK}" stroke-width="1.4"/><circle cx="4" cy="-30" r="5" fill="#f39a5c" stroke="${INK}" stroke-width="1.4"/>`}
      ${fl}</g>
    <circle cy="-66" r="58" fill="none" stroke="${INK}" stroke-width="3.4"/><path d="M-40 -88 Q-30 -112 -6 -116" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>`}
DECO.globe={name:"La boule à neige de la clairière",noel:1,home:1,w:58,h:128,desc:"Le cadeau de Barbe-Neige et Ramure : ton refuge en tout petit, ton sapin, ton étoile. Il y neige toute l'année.",
  art:L=>`${dSh(40)}${globeArt(0)}`};

// on secoue l'énorme cadeau trois fois, il s'ouvre, la boule à neige sort
function openBigGift(done){const o=document.createElement("div");o.className="bgift";try{MUSIC.want("noel")}catch(e){}
  o.innerHTML=`<div class="bgrays"></div><button class="bgbox" type="button" aria-label="Ouvrir le cadeau"><svg viewBox="-70 -90 140 170" aria-hidden="true"><g class="bglid"><rect x="-58" y="-36" width="116" height="22" rx="4" fill="#ef5c70" stroke="${INK}" stroke-width="3.4"/><path d="M0 -36 V-14" stroke="#f7d77a" stroke-width="16"/><path d="M0 -38 q-34 -32 -38 -4 q16 12 38 4 q34 -32 38 -4 q-16 12 -38 4" fill="#f7d77a" stroke="${INK}" stroke-width="3"/></g><rect x="-50" y="-14" width="100" height="84" rx="5" fill="#e2445e" stroke="${INK}" stroke-width="3.4"/><path d="M0 -14 V70" stroke="#f7d77a" stroke-width="16"/></svg></button>
    <div class="bgtxt"><b>Vas-y, ouvre !</b><span>Touche le cadeau.</span></div>`;
  $("scene").parentNode.appendChild(o);let n=0;const box=o.querySelector(".bgbox"),txt=o.querySelector(".bgtxt");
  box.onpointerdown=()=>{if(n>=3)return;n++;try{MUSIC.sfx("knock",n)}catch(e){}box.animate([{transform:"rotate(0) scale(1)"},{transform:`rotate(-${4+n*3}deg) scale(1.05)`},{transform:`rotate(${4+n*3}deg) scale(1.05)`},{transform:"rotate(0) scale(1)"}],{duration:360});
    if(n<3){txt.innerHTML=`<b>${n===1?"Ça bouge là-dedans…":"Encore !"}</b><span>Touche le cadeau.</span>`;return}
    try{MUSIC.sfx("win")}catch(e){}o.classList.add("open");
    box.querySelector(".bglid").animate([{transform:"translate(0,0) rotate(0)"},{transform:"translate(90px,-260px) rotate(50deg)",opacity:0}],{duration:700,easing:"ease-out",fill:"forwards"});box.animate([{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(160px)"}],{duration:800,fill:"forwards"});
    for(let i=0;i<40;i++){const c=document.createElement("i");c.className="bgconf";const a=Math.random()*6.28,r=120+Math.random()*260;c.style.background=["#ffe27a","#ef5c70","#9ec3ef","#8fca7a","#fff"][i%5];o.appendChild(c);c.animate([{transform:"translate(-50%,-50%)",opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*r}px),calc(-50% + ${Math.sin(a)*r+120}px)) rotate(${i*40}deg)`,opacity:0}],{duration:1500+i*20,easing:"cubic-bezier(.1,.7,.3,1)",fill:"forwards"})}
    setTimeout(()=>{const g=document.createElement("div");g.className="bgglobe";g.innerHTML=`<svg viewBox="-70 -128 140 132" aria-hidden="true">${globeArt(1)}</svg>`;o.insertBefore(g,txt);g.animate([{transform:"scale(.1) translateY(160px)",opacity:0},{transform:"scale(1.1)",opacity:1,offset:.75},{transform:"scale(1)",opacity:1}],{duration:900,easing:"ease-out"});
      txt.innerHTML=`<b>La boule à neige de la clairière</b><span>Ton refuge en tout petit, ton sapin, ton étoile. Il y neige toute l'année : pose-la dans ta maison.</span><div class="bgrew"><em>+10 clochettes</em><em>+500 pièces</em><em>+10 sucres d'orge</em></div><button class="btn" type="button">Joyeux Noël !</button>`;
      txt.querySelector("button").onclick=()=>{o.remove();try{MUSIC.want("foret")}catch(e){}done()}},750)};
  o.animate([{opacity:0},{opacity:1}],{duration:350})}
function bigGiftReward(){if(R.bigGift)return;R.bigGift=1;R.deco.inv.globe=(R.deco.inv.globe||0)+1;addBells(10);const b=bourse();b.sucres=(b.sucres||0)+10;(b.gift=b.gift||{}).coins=(b.gift.coins||0)+500;putBourse(b);deliverGifts();save();renderHud()}

/* ---------- le traîneau dans la scène ---------- */
const SLP={x:230,y:392},SLF={x:306,y:424}; // là où il s'écrase ; là où il se pose au retour de la tournée
let slEl=null,slMode=null,slOv=null,bgEl=null;
// le moment joué impose son état tant que R.beat n'a pas avancé (la scène du crash, le retour de la tournée)
const slBeat=()=>R.beat.barbeneige||0;
function slWant(){if(!noelOn()||storyDone("barbeneige"))return null;const b=slBeat();if(slOv&&slOv.b===b)return slOv.mode;return b===2||b===3?"broken":b===4?"fixed":null}
const slPos=m=>m==="back"?SLF:SLP;
function sleighSync(){const m=slWant();if(m!==slMode){slMode=m;if(slEl){slEl.remove();slEl=null}
    if(m){const p=slPos(m);slEl=document.createElement("div");slEl.className="sleighfx parked";slEl.style.cssText=pc(p.x,p.y)+`;width:${140/W*100}%;z-index:${p.y};transform:translate(-50%,-92%)${m==="broken"?" rotate(7deg)":""}`;slEl.innerHTML=sleighArt({broken:m==="broken",empty:1});$("actors").appendChild(slEl)}}
  const away=noelOn()&&!storyDone("barbeneige")&&slBeat()===5&&!(slOv&&slOv.b===5);
  for(const id of ["barbeneige","ramure"]){const f=sF(id);if(f){f.el.style.display=away?"none":"";f.badge.style.display=away?"none":""}}}
setInterval(sleighSync,1000);setTimeout(sleighSync,0);
// un obstacle tant qu'il est garé (noel.js, noelObst)
const sleighObst=()=>{const L=[];if(slMode){const p=slPos(slMode);L.push({x:p.x,y:p.y-6,rx:82,ry:24})}if(bgEl)L.push({x:BG.x,y:BG.y-6,rx:84,ry:24});return L};
// il traverse la scène : pts = [[x, y, angle], ...]
function sleighFly(pts,ms,o={}){const e=document.createElement("div");e.className="sleighfx";e.style.cssText=`width:${(o.ram?190:130)/W*100}%;z-index:906;left:0;top:0`;e.innerHTML=sleighArt(o);$("actors").appendChild(e);
  const a=e.animate(pts.map(([x,y,r=0])=>({left:`${x/W*100}%`,top:`${y/H*100}%`,transform:`translate(-50%,-90%) rotate(${r}deg)`})),{duration:ms,easing:o.ease||"linear",fill:"forwards"});try{MUSIC.sfx("whoosh")}catch(err){}
  a.onfinish=()=>{e.remove();o.then&&o.then()};return e}
function snowPoof(x,y,r=60){const p=document.createElement("div");p.className="ssplat";p.style.cssText=pc(x,y)+`;width:${r*3/W*100}%;z-index:907`;p.innerHTML=`<svg viewBox="-40 -30 80 60" aria-hidden="true" style="display:block;width:100%">${[[-24,4,14],[-8,-10,17],[12,-8,16],[26,6,13],[0,8,18]].map(([a,b,c])=>`<circle cx="${a}" cy="${b}" r="${c}" fill="#fff" stroke="#cfdbea" stroke-width="1.2"/>`).join("")}</svg>`;$("scene").appendChild(p);setTimeout(()=>p.remove(),600);
  const s=$("scene");s.animate([{transform:"translateY(0)"},{transform:"translateY(5px)"},{transform:"translateY(-4px)"},{transform:"translateY(2px)"},{transform:"translateY(0)"}],{duration:380});try{MUSIC.sfx("splash");navigator.vibrate&&navigator.vibrate(90)}catch(e){}}
function foxDrop(id,x,y,pose,expr){if(!R.res[id]){R.res[id]={at:Date.now(),h:0,pet:""};save()}const f=sF(id)||makeFox(id,null);if(f.inside){f.inside=false;f.el.classList.remove("inside")}f.walk=null;f.el.style.display="";f.badge.style.display="";place(f,{id:"act-"+id,x,y,z:y,poses:[pose]});f.pose=pose;f.expr=expr;f.until=Date.now()+60000;draw(f)}
// le traîneau passe, de travers : personne pour le tirer
function sceneSkyPass(){sleighFly([[-90,150,-6],[60,110,8],[180,150,-10],[300,95,10],[490,140,-4]],2900)}
// il s'écrase devant la maison
function sceneCrash(){sleighFly([[470,20,18],[350,190,24],[SLP.x+20,SLP.y-4,30]],1250,{ease:"ease-in",then:()=>{
    slOv={b:1,mode:"broken"};sleighSync();snowPoof(SLP.x,SLP.y-20,70);
    foxDrop("barbeneige",SLP.x-92,SLP.y+10,"lie","surprise");actEmote("barbeneige","goutte",2400);
    setTimeout(()=>actNear("ramure","barbeneige","up"),250)}})}
// le retour : le traîneau revient avec Ramure, lâche l'énorme cadeau devant la maison et se pose
const BG={x:190,y:352};
function drawBigGift(){if(bgEl)return;bgEl=document.createElement("div");bgEl.className="sleighfx parked";bgEl.style.cssText=pc(BG.x,BG.y)+`;width:${176/W*100}%;z-index:${BG.y};transform:translate(-50%,-96%)`;
  bgEl.innerHTML=`<svg viewBox="-70 -90 140 170" aria-hidden="true" style="display:block;width:100%"><rect x="-58" y="-36" width="116" height="22" rx="4" fill="#ef5c70" stroke="${INK}" stroke-width="3.4"/><path d="M0 -36 V-14" stroke="#f7d77a" stroke-width="16"/><path d="M0 -38 q-34 -32 -38 -4 q16 12 38 4 q34 -32 38 -4 q-16 12 -38 4" fill="#f7d77a" stroke="${INK}" stroke-width="3"/><rect x="-50" y="-14" width="100" height="84" rx="5" fill="#e2445e" stroke="${INK}" stroke-width="3.4"/><path d="M0 -14 V70" stroke="#f7d77a" stroke-width="16"/></svg>`;$("actors").appendChild(bgEl)}
function sceneBigGift(){sleighFly([[-110,110,-8],[190,120,4],[SLF.x-30,SLF.y-90,8],[SLF.x,SLF.y,0]],3100,{ram:1,then:()=>{
    slOv={b:5,mode:"back"};sleighSync();snowPoof(SLF.x,SLF.y,36);foxDrop("barbeneige",SLF.x-74,SLF.y-2,"happy","joy");foxDrop("ramure",SLF.x+64,Math.min(SLF.y-2,H-20),"happy","joy")}});
  setTimeout(()=>{const e=document.createElement("div");e.className="sleighfx";e.style.cssText=`width:${176/W*100}%;z-index:906;left:0;top:0`;e.innerHTML=`<svg viewBox="-70 -90 140 170" aria-hidden="true" style="display:block;width:100%"><rect x="-50" y="-30" width="100" height="100" rx="5" fill="#e2445e" stroke="${INK}" stroke-width="3.4"/><path d="M0 -30 V70" stroke="#f7d77a" stroke-width="16"/></svg>`;$("actors").appendChild(e);
    e.animate([{left:`${BG.x/W*100}%`,top:`${80/H*100}%`,transform:"translate(-50%,-96%) rotate(-10deg)"},{left:`${BG.x/W*100}%`,top:`${BG.y/H*100}%`,transform:"translate(-50%,-96%) rotate(0)"}],{duration:560,easing:"cubic-bezier(.5,0,1,.6)"}).onfinish=()=>{e.remove();drawBigGift();snowPoof(BG.x,BG.y,70);foxes.filter(f=>!f.wild).slice(0,8).forEach((f,i)=>setTimeout(()=>actEmote(f.id,"!",1500),i*60))}},1050)}
// la fin : la boule à neige sortie, le traîneau se range derrière la maison, tout le monde fait la fête
function bigGiftEnd(){bigGiftReward();if(bgEl){bgEl.remove();bgEl=null}
  setTimeout(()=>openBigGift(()=>{slOv=null;sleighSync();["petitpois","grelot","paillette","ramure","barbeneige","copeau","balafre","filou","radar"].forEach((id,i)=>setTimeout(()=>{actTrick(id,["salto","toupie","boing"][i%3]);actEmote(id,"coeur",1800)},i*140));drawBg();drawGlow()}),900)}
