/* Café Frimousse : le défilé du Matsuri, petite cinématique de fin de Kyoto (09/11/2026, idée de Joffray : « tout le monde qui
   défile devant l'écran de gauche à droite, un peu stylé »). Jouée une fois après la scène du jour 25 (S.ky.parade), à revoir
   depuis le carnet de Yuzu. On touche pour passer.
   La nuit tombe sur la rue de Gion, les lanternes s'allument une à une sur l'intro des gros tambours (taiko5 : « boum… boum…
   boum boum »), puis le cortège passe : Hayate et Tsuba, les sumos qui portent le mikoshi (la rue tremble à chaque pas),
   Daifuku et sa brochette, Origami et ses grues, Kage qui bondit, Yuzu, le joueur, Sensei Hōji, et enfin Kyūbi sous les
   pétales de sakura ; feu d'artifice et titre. Mouvements en CSS, comme noelintro.js. */
const KP_BEAT=60/158; // un temps du grand odaiko
// [renard, taille (en --u : 1 vmin, 1,5 en portrait), façon de marcher] ; tout le cortège avance à la même vitesse,
// chacun part quand celui de devant a fait sa largeur plus un petit écart (sinon ils se marchaient dessus en portrait)
const KP_CREW=[["hayate",24,"step"],["tsuba",24,"step"],["sumo",66,"sumo"],["daifuku",23,"hop"],["origami",23,"step"],
  ["kage",22,"ninja"],["yuzu",24,"step"],["roussette",22,"hop"],["hoji",23,"step"],["kyubi",34,"kyubi"]];
function kyParade(done){
  const old=$("kyparade");if(old)old.remove();
  const el=document.createElement("div");el.id="kyparade";el.setAttribute("role","button");el.setAttribute("aria-label","Le défilé du Matsuri : touche pour continuer");
  const r=rng(25),f2=n=>n.toFixed(1);
  // le ciel, la pagode au loin, les maisons de bois et la rue ; la guirlande de lanternes au-dessus
  let stars="";for(let i=0;i<40;i++)stars+=`<circle class="kp-star" cx="${f2(r()*400)}" cy="${f2(r()*150)}" r="${f2(.6+r()*1.3)}" fill="#fff6dc" style="animation-delay:${f2(.6+r()*2)}s"/>`;
  let houses="";for(let x=-10;x<410;x+=58)houses+=kyMachiya(x,236,50,46+((x/58)|0)%3*8);
  const rope=t=>{const x=-10+t*420,y=34+Math.sin(t*Math.PI)*42;return [x,y]};
  let lan="";for(let i=1;i<12;i++){const [x,y]=rope(i/12);lan+=`<g class="kp-lan" style="animation-delay:${f2(.5+i*.22)}s"><path d="M${f2(x)} ${f2(y)} v5" stroke="${INK}" stroke-width="1.4"/>${kyLantern(x,y+14,.9)}</g>`}
  const bg=`<svg class="kp-bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>${KY_DEFS}
    <linearGradient id="kp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140f33"/><stop offset=".55" stop-color="#3a2456"/><stop offset="1" stop-color="#b8566a"/></linearGradient>
    <linearGradient id="kp-street" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a5060"/><stop offset="1" stop-color="#3e2e3c"/></linearGradient></defs>
    <rect width="400" height="300" fill="url(#kp-sky)"/>${stars}<circle cx="318" cy="62" r="20" fill="#fff3c8"/><circle cx="318" cy="62" r="34" fill="#fff3c8" opacity=".12"/>
    <path d="M0 200 Q60 170 120 188 T240 180 T400 186 V240 H0Z" fill="#2c2142"/>
    <g opacity=".85">${kyPagoda(70,214,.9)}</g><g class="kp-houses">${houses}</g>
    <rect y="236" width="400" height="64" fill="url(#kp-street)"/><path d="M0 252 H400 M0 276 H400" stroke="#836878" stroke-width="1.2" opacity=".6"/>
    <path d="M-10 34 Q200 118 410 34" fill="none" stroke="${INK}" stroke-width="1.6"/>${lan}</svg>`;
  // le cortège : chaque renard debout (la pose de marche, de profil et toute basse, cachait les costumes), qui sautille au rythme des tambours
  const walker=id=>`<div class="kp-f">${foxSVG(FOX[id],{pose:"happy"})}</div>`;
  const U=n=>`calc(${n} * var(--u))`;
  const mikoshi=`<svg class="kp-mik" viewBox="0 0 200 110" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <path d="M4 96 H196" stroke="#8a5a3a" stroke-width="7"/><path d="M4 96 H196" fill="none"/>
    <rect x="62" y="56" width="76" height="34" fill="#e0503c"/><path d="M74 60 V86 M100 60 V86 M126 60 V86" stroke="#f2c45a" stroke-width="2.4"/>
    <rect x="54" y="86" width="92" height="8" fill="url(#kp-gold)"/>
    <path d="M40 58 Q100 40 160 58 L146 34 Q100 22 54 34Z" fill="#3d2a35"/><path d="M52 36 Q100 26 148 36" fill="none" stroke="#f2c45a" stroke-width="2.4"/>
    <path d="M100 26 V10" stroke="#f2c45a" stroke-width="4"/><circle cx="100" cy="8" r="6" fill="#ffe08a"/>
    <path d="M40 58 q-6 8 -2 16 M160 58 q6 8 2 16" fill="none" stroke="#f2c45a" stroke-width="2.4"/></g>
    <defs><linearGradient id="kp-gold" x1="0" x2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#e0b860"/></linearGradient></defs></svg>`;
  const crane=`<svg viewBox="0 0 30 24" aria-hidden="true"><path d="M2 14 L14 10 L18 2 L20 11 L28 9 L21 15 L15 22 L13 15Z" fill="#f6a8be" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 10 L15 22" stroke="${INK}" stroke-width="1"/></svg>`;
  const W=innerWidth,u=(innerHeight>W?1.5:1)*Math.min(W,innerHeight)/100,v=Math.max(16*u,W/6.5);
  let crew="",t=2.4,ts=0,td=0,tk=0,dk=0;
  for(const [id,sz,kind] of KP_CREW){
    const dur=(sz*u+1.08*W)/v;if(id==="sumo"){ts=t;td=dur}if(id==="kyubi"){tk=t;dk=dur}
    const st=`animation-delay:${t}s;animation-duration:${dur}s`;
    if(kind==="sumo"){crew+=`<div class="kp-m kp-sumo" style="${st};--w:${U(66)}"><div class="kp-load">${mikoshi}</div>
      <div class="kp-pair"><div class="kp-w kp-heavy" style="width:${U(31)}">${walker("chanko")}</div><div class="kp-w kp-heavy" style="width:${U(33)}">${walker("oyama")}</div></div></div>`;t+=(sz+5)*u/v;continue}
    let extra="";
    if(id==="origami")for(let i=0;i<5;i++)extra+=`<i class="kp-crane" style="animation-delay:${f2(t+1.2+i*.9)}s;--dx:${Math.round(r()*30-10)}vmin">${crane}</i>`;
    crew+=`<div class="kp-m" style="${st};--w:${U(sz)}"><div class="kp-w kp-${kind}" style="width:${U(sz)}">${walker(id)}</div>${extra}</div>`;
    t+=(sz+5)*u/v;
  }
  // les pétales de Kyūbi, le feu d'artifice et le titre
  let petals="";for(let i=0;i<34;i++)petals+=`<i class="kp-petal" style="left:${f2(r()*100)}%;animation-delay:${f2(tk+.4+r()*6)}s;animation-duration:${f2(4+r()*3)}s;--dx:${f2(r()*60-30)}px"></i>`;
  const FW=[[22,30,"#ffd27a",1.4],[74,22,"#f6a8be",2],[50,14,"#9fd8ff",2.6],[30,18,"#c9f2b0",3.4],[68,34,"#ffe08a",4],[46,26,"#f39a5c",4.7]].map(([x,y,c,d])=>[x,y,c,tk+d]);
  let fw="";FW.forEach(([x,y,c,t])=>{
    let rays="";for(let k=0;k<14;k++){const a=k/14*Math.PI*2;rays+=`<path d="M${f2(50+Math.cos(a)*14)} ${f2(50+Math.sin(a)*14)} L${f2(50+Math.cos(a)*44)} ${f2(50+Math.sin(a)*44)}" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="${f2(50+Math.cos(a)*47)}" cy="${f2(50+Math.sin(a)*47)}" r="3" fill="#fff"/>`}
    fw+=`<svg class="kp-fw" viewBox="0 0 100 100" style="left:${x}%;top:${y}%;animation-delay:${t}s" aria-hidden="true">${rays}</svg>`});
  el.innerHTML=`<div class="kp-world">${bg}<div class="kp-road">${crew}</div></div>${petals}${fw}
    <div class="kp-title" style="animation-delay:${f2(tk+2.2)}s"><b>Matsuri</b><span>Le festival du ${WORLDS.kyoto.cafe}</span></div><div class="kp-tap" style="animation-delay:${f2(tk+4)}s">Touche pour continuer</div>`;
  document.body.appendChild(el);
  // les gros tambours ; la rue tremble et gronde à chaque pas des sumos
  const prev=MUSIC.current;MUSIC.want("taiko5");
  const T0=performance.now();let step=0;
  const thump=setInterval(()=>{const s=(performance.now()-T0)/1000;if(s>ts+1.2&&s<ts+td-1.4){if(step++%2===0){if(MUSIC.sfx)MUSIC.sfx("stomp");el.classList.remove("kp-quake");void el.offsetWidth;el.classList.add("kp-quake")}}},KP_BEAT*1000);
  const pops=FW.map(f=>f[3]).map(t=>setTimeout(()=>MUSIC.sfx&&MUSIC.sfx("pop",4),t*1000));
  let gone=false;const end=()=>{if(gone)return;gone=true;clearInterval(thump);pops.forEach(clearTimeout);clearTimeout(auto);
    if(prev&&!prev.startsWith("jingle:"))MUSIC.want(prev);el.classList.add("kp-out");setTimeout(()=>{el.remove();if(done)done()},400)};
  const auto=setTimeout(end,(Math.max(tk+dk,tk+7)+.6)*1000);
  // un toucher trop tôt ne coupe pas tout de suite (on vient de toucher pour fermer la scène d'avant)
  el.addEventListener("click",()=>{if(performance.now()-T0>900)end()});
}
// cafe.html?defile=1 : voir le défilé tout de suite, sans finir Kyoto
if(new URLSearchParams(location.search).get("defile")==="1")addEventListener("load",()=>setTimeout(()=>kyParade(),600));
