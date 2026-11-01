/* Kitsune Café : animation d'ouverture des Nuits de Noël (9 s environ, demande de Joffray : « comme pour Halloween »), montrée une
   fois par an avant la feuille des nuits de Noël, et à revoir depuis cette feuille. On touche pour passer.
   Nuit bleue et aurore, la lune se lève, le traîneau de Barbe-Neige et Ramure passe devant elle, le café enneigé s'allume, le sapin
   s'illumine guirlande après guirlande, les invités de Noël sautent dans la neige, puis le titre et une pluie de sucres d'orge et
   de cadeaux. Mouvements en CSS (comme hwintro.js : les « begin » SMIL partent du chargement de la page). */
function noelIntro(done){
  const old=$("noelintro");if(old)old.remove();
  const el=document.createElement("div");el.id="noelintro";el.setAttribute("role","button");el.setAttribute("aria-label","Les nuits de Noël : touche pour continuer");
  const r=rng(47),f2=n=>n.toFixed(1);let stars="",flakes="",gifts="";
  for(let i=0;i<46;i++)stars+=`<circle cx="${f2(r()*400)}" cy="${f2(r()*420)}" r="${f2(.7+r()*1.5)}" fill="#fff8e0" style="animation-delay:${f2(r()*2.4)}s"/>`;
  // la neige tombe pendant toute l'animation
  for(let i=0;i<46;i++){const big=i%6===0;flakes+=`<i class="ni-flake" style="left:${f2(r()*100)}%;width:${big?7:3+r()*3}px;height:${big?7:3+r()*3}px;animation-duration:${f2(big?5+r()*2:7+r()*6)}s;animation-delay:-${f2(r()*12)}s;--dx:${f2(r()*40-20)}px"></i>`}
  // la pluie de cadeaux et de sucres d'orge quand le titre arrive
  const gift=(c,b)=>`<svg viewBox="0 0 30 30" aria-hidden="true"><g stroke="${INK}" stroke-width="2" stroke-linejoin="round"><rect x="4" y="11" width="22" height="16" rx="2" fill="${c}"/><rect x="2" y="7" width="26" height="6" rx="2" fill="${c}"/><path d="M15 7 V27" stroke="${b}" stroke-width="4"/><path d="M15 7 V27 M2 10 H28" fill="none"/></g><path d="M15 7 q-8 -7 -9 -1 q2 2 9 1 q8 -7 9 -1 q-2 2 -9 1Z" fill="${b}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  for(let i=0;i<16;i++)gifts+=`<div class="hi-candy ni-gift" style="left:${f2(4+r()*88)}%;width:${f2(6+r()*4)}vmin;animation-delay:${f2(5.6+r()*.9)}s;--rot:${Math.round(r()*540-270)}deg">${i%3?gift(["#e0505a","#7fb06a","#9ec3ef","#c9a8ec"][i%4],["#f2c45a","#fffaf2"][i%2]):sucreSVG}</div>`;
  // le traîneau de Barbe-Neige, tiré par Ramure
  const sleigh=`<div class="ni-sleigh"><div class="ni-sl-in"><div class="ni-sl-fox ni-ram">${foxSVG(FOX.ramure,{pose:"walk",frame:1})}</div>
    <svg class="ni-sl-body" viewBox="0 0 120 60" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M10 50 Q4 50 6 44 M10 50 H104 Q116 50 114 40" fill="none" stroke="#c99a3a" stroke-width="4"/><path d="M18 44 L14 18 Q40 26 70 22 L96 14 Q104 30 92 44Z" fill="#e0505a"/><path d="M16 22 Q42 30 72 26 L96 18" fill="none" stroke="#f2c45a" stroke-width="3"/><rect x="30" y="2" width="22" height="18" rx="3" fill="#7fb06a"/><path d="M41 2 V20" stroke="#f2c45a" stroke-width="3"/></g></svg>
    <div class="ni-sl-fox ni-bn">${foxSVG(FOX.barbeneige,{pose:"happy"})}</div></div><div class="ni-trail"></div></div>`;
  // le café sous la neige et le grand sapin qui s'illumine
  const lights=[[200,58],[188,82],[212,80],[180,106],[200,104],[220,108],[172,130],[192,128],[212,132],[230,128]].map(([x,y],i)=>`<circle class="ni-lt" cx="${x}" cy="${y}" r="4.4" fill="${["#ffe08a","#ffb0c0","#bfe6ff","#c9f2b0"][i%4]}" stroke="${INK}" stroke-width="1.4" style="animation-delay:${f2(3.4+i*.1)}s,${f2(4.4+i*.1)}s"/>`).join("");
  const ground=`<svg viewBox="0 0 400 200" aria-hidden="true">
    <g class="ni-cafe" transform="translate(244 -70) scale(1.25)"><path d="M18 74 V30 L60 4 L102 30 V74Z" fill="#c98f5c" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M6 32 L60 -6 L114 32 Q100 38 90 30 Q78 40 64 30 Q52 40 40 31 Q26 40 6 32Z" fill="#fffaf2" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      ${[[38,40],[82,40]].map(([x,y])=>`<rect class="hi-win ni-win" x="${x-9}" y="${y}" width="18" height="16" rx="3" fill="#ffd27a" stroke="${INK}" stroke-width="2.4"/>`).join("")}<rect x="51" y="48" width="18" height="26" rx="8" fill="#8a5a3a" stroke="${INK}" stroke-width="2.4"/><circle cx="60" cy="40" r="5" fill="none" stroke="#5f9468" stroke-width="3"/></g>
    <g class="ni-tree"><g transform="translate(96 150) scale(1.55) translate(-200 -150)"><rect x="193" y="150" width="14" height="22" fill="#8a5a3a" stroke="${INK}" stroke-width="3"/><path d="M200 36 L236 92 H220 L246 152 H154 L180 92 H164Z" fill="#4f8a5a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M176 92 Q200 100 224 92 M164 130 Q200 140 236 130" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>${lights}
      <path class="ni-star" d="M200 22 l4.6 9.4 10.4 1.4 -7.6 7.2 1.8 10.2 -9.2 -4.8 -9.2 4.8 1.8 -10.2 -7.6 -7.2 10.4 -1.4z" fill="#ffe680" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/></g></g>
    ${[[20,100,.9],[384,104,.8],[200,104,.6]].map(([x,y,k])=>`<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 -60 L22 -14 H12 L28 18 H-28 L-12 -14 H-22Z" fill="#3f6a4f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M-14 -16 Q0 -10 14 -16 M-22 14 Q0 22 22 14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>`).join("")}
    <path d="M-20 70 Q100 40 200 64 Q300 40 420 66 V200 H-20Z" fill="#e8f0fa"/><path d="M-20 130 Q100 106 210 124 Q320 108 420 130 V200 H-20Z" fill="#fffaf2"/></svg>`;
  // les invités de Noël (Barbe-Neige et Ramure sont dans le traîneau)
  const crew=["grelot","paillette","guimauve","bouleneige"].map((id,i)=>`<div class="hi-fox" style="animation-delay:${f2(4.2+[.2,0,0,.2][i])}s"><div style="animation-delay:-${f2(i*.37)}s">${foxSVG(FOX[id],{pose:"happy"})}</div></div>`).join("");
  el.innerHTML=`<svg class="hi-bg" viewBox="0 0 400 700" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs><linearGradient id="ni-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121a44"/><stop offset=".6" stop-color="#2c3f7a"/><stop offset="1" stop-color="#6f8fc4"/></linearGradient>
        <linearGradient id="ni-aur" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7cf2c0" stop-opacity="0"/><stop offset=".5" stop-color="#7cf2c0" stop-opacity=".5"/><stop offset="1" stop-color="#d79cf2" stop-opacity="0"/></linearGradient></defs>
      <rect width="400" height="700" fill="url(#ni-sky)"/><g class="ni-aurora"><path d="M-40 150 Q80 60 200 120 Q320 180 440 90 L440 150 Q320 240 200 180 Q80 120 -40 210Z" fill="url(#ni-aur)"/><path d="M-40 220 Q100 150 220 200 Q330 240 440 170 L440 200 Q330 270 220 230 Q100 190 -40 250Z" fill="url(#ni-aur)" opacity=".6"/></g>
      <g class="hi-stars">${stars}</g></svg>
    <svg class="hi-moon" viewBox="-80 -80 160 160" aria-hidden="true"><circle r="72" fill="#fff6d0" opacity=".25"/><circle r="46" fill="#fff8dc"/><circle cx="-16" cy="-12" r="8" fill="#efe2b8" opacity=".7"/><circle cx="14" cy="16" r="5" fill="#efe2b8" opacity=".7"/></svg>
    ${sleigh}
    <div class="hi-title ni-title"><b>Les nuits<br>de Noël</b><span>Au Kitsune Café, jusqu'au 6 janvier</span><small class="hi-tap">Touche pour continuer</small></div>
    ${gifts}
    <div class="hi-ground ni-ground">${ground}<div class="hi-crew ni-crew">${crew}</div></div>
    <div class="ni-snow">${flakes}</div>`;
  document.body.appendChild(el);
  if(MUSIC.jingle)MUSIC.jingle("noelintro");
  let gone=false;const end=()=>{if(gone)return;gone=true;if(MUSIC.jingleEnd)MUSIC.jingleEnd();el.classList.add("hi-out");setTimeout(()=>{el.remove();if(done)done()},350)};
  el.addEventListener("click",end);
}
