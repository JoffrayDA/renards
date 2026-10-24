/* Kitsune Café : animation d'ouverture de la Nuit des citrouilles (9 s environ), montrée une fois par an
   avant la feuille Halloween, et à revoir depuis cette feuille. On touche pour passer.
   Les mouvements sont en CSS (les « begin » SMIL partent du chargement de la page, pas de l'insertion) ;
   seuls les battements d'ailes et le flottement des fantômes, qui tournent en boucle, sont en SMIL. */
function hwIntro(done){
  const old=$("hwintro");if(old)old.remove();
  const el=document.createElement("div");el.id="hwintro";el.setAttribute("role","button");el.setAttribute("aria-label","Nuit des citrouilles : touche pour continuer");
  const r=rng(31),f2=n=>n.toFixed(1);let css="",stars="";
  for(let i=0;i<40;i++)stars+=`<circle cx="${f2(r()*400)}" cy="${f2(r()*480)}" r="${f2(.8+r()*1.6)}" fill="#fff6d0" style="animation-delay:${f2(r()*2.4)}s"/>`;

  // chauves-souris : un essaim jaillit de la lune, puis trois tournent autour d'elle sans s'arrêter
  const batSVG=`<svg viewBox="-18 -10 36 18" aria-hidden="true"><g><animateTransform attributeName="transform" type="scale" values="1 1;1 .25;1 1" dur=".3s" repeatCount="indefinite"/><path d="M0 0 Q-6 -8 -16 -6 Q-12 -2 -13 3 Q-8 0 -6 4 Q-3 0 0 0 Q3 0 6 4 Q8 0 13 3 Q12 -2 16 -6 Q6 -8 0 0Z" fill="#1a1224" stroke="#7a5a9a" stroke-width=".8"/></g><circle r="3.6" fill="#1a1224"/><circle cx="-1.3" cy="-.6" r=".8" fill="#ffd36a"/><circle cx="1.3" cy="-.6" r=".8" fill="#ffd36a"/></svg>`;
  let bats="";
  for(let i=0;i<14;i++){
    const ex=r()<.5?-25:125,ey=5+r()*60,mx=40+r()*40,my=5+r()*45,w=10+r()*8,d=2+i*.13,t=2.4+r()*1.4;
    css+=`@keyframes hi-b${i}{0%{transform:translate(78vw,14vh) scale(.2);opacity:0}12%{opacity:1}50%{transform:translate(${f2(mx)}vw,${f2(my)}vh) scale(.8)}100%{transform:translate(${f2(ex)}vw,${f2(ey)}vh) scale(1.2)}}`;
    bats+=`<div class="hi-bat" style="width:${f2(w)}vmin;animation:hi-b${i} ${f2(t)}s ease-in ${f2(d)}s forwards">${batSVG}</div>`;
  }
  for(let i=0;i<3;i++)bats+=`<div class="hi-orbit" style="animation-delay:${f2(3+i*.2)}s"><div style="animation-delay:-${f2(i*1.6)}s">${batSVG}</div></div>`;

  // petits fantômes qui montent du sol et dérivent
  const ghosts=[[12,0,1],[84,.6,.8],[30,1.3,.7],[66,1.9,.9]].map(([x,d,k])=>`<div class="hi-gh" style="left:${x}%;width:${f2(14*k)}vmin;animation-delay:${f2(2.4+d)}s"><svg viewBox="-16 -42 32 46" aria-hidden="true">${ghostie(0,0,1)}</svg></div>`).join("");

  // lucioles
  let flies="";for(let i=0;i<12;i++)flies+=`<i class="hi-fly" style="left:${f2(r()*100)}%;top:${f2(45+r()*40)}%;animation-delay:${f2(r()*3)}s;animation-duration:${f2(3+r()*3)}s"></i>`;

  // pluie de bonbons quand le titre arrive
  let candies="";for(let i=0;i<16;i++)candies+=`<div class="hi-candy" style="left:${f2(4+r()*88)}%;width:${f2(6+r()*4)}vmin;animation-delay:${f2(5.6+r()*.9)}s;--rot:${Math.round(r()*720-360)}deg">${candySVG}</div>`;

  // le café hanté sur la colline, arbres nus en silhouette, citrouilles qui s'allument puis vacillent
  const tree=(x,s,flip)=>`<g transform="translate(${x} 60) scale(${flip?-s:s} ${s})"><path d="M-4 0 L-3 -40 L-18 -62 M-3 -40 L2 -70 L-6 -86 M2 -70 L14 -84 M0 -30 L18 -50 L28 -52 M4 0 L3 -30" fill="none" stroke="#231a31" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  const house=`<g class="hi-house" transform="translate(84 6) scale(.85)"><path d="M164 34 V-6 L200 -34 L236 -6 V34Z" fill="#231a31"/><path d="M222 -16 V-36 H230 V-10Z" fill="#231a31"/><path d="M150 -4 L200 -44 L250 -4" fill="none" stroke="#231a31" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>${[[176,0],[214,0],[195,-22]].map(([x,y],i)=>`<rect class="hi-win" x="${x-7}" y="${y}" width="${i==2?10:14}" height="${i==2?10:13}" rx="2" fill="#ffc35a" style="animation-delay:${1.3+i*.25}s"/>`).join("")}<path d="M193 34 V18 Q200 11 207 18 V34Z" fill="#3a2a2a"/></g>`;
  const jacks=[[42,170,.95],[358,170,.95],[124,184,.8],[276,184,.8]].map(([x,y,k],i)=>`<g class="hi-jack" style="animation-delay:${f2(1.6+i*.3)}s,${f2(2.4+i*.3)}s">${jack(x,y,k)}</g>`).join("");

  // les six invités d'Halloween : Feu Follet flotte au-dessus des cinq autres
  const crew=["mirabelle","croquignol","osselet","zombidou","paille"].map((id,i)=>`<div class="hi-fox" style="animation-delay:${f2(4.2+[.3,.15,0,.15,.3][i])}s"><div style="animation-delay:-${f2(i*.37)}s">${foxSVG(FOX[id],{pose:"happy"})}</div></div>`).join("");

  el.innerHTML=`<style>${css}</style>
    <svg class="hi-bg" viewBox="0 0 400 700" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs><linearGradient id="hi-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1438"/><stop offset=".55" stop-color="#47296a"/><stop offset="1" stop-color="#d27a7e"/></linearGradient></defs>
      <rect width="400" height="700" fill="url(#hi-sky)"/><g class="hi-stars">${stars}</g></svg>
    <svg class="hi-moon" viewBox="-80 -80 160 160" aria-hidden="true"><circle r="72" fill="#fff1b8" opacity=".28" filter="url(#soft)"/><circle r="46" fill="#fff1c4"/><circle cx="-16" cy="-12" r="8" fill="#f2dea0" opacity=".7"/><circle cx="14" cy="16" r="5" fill="#f2dea0" opacity=".7"/><circle cx="18" cy="-18" r="4" fill="#f2dea0" opacity=".6"/></svg>
    ${bats}
    <div class="hi-title"><b>Nuit des<br>citrouilles</b><span>Au Kitsune Café, jusqu'au 3 novembre</span><small class="hi-tap">Touche pour continuer</small></div>
    ${candies}
    <div class="hi-ground">
      <svg viewBox="0 0 400 200" aria-hidden="true">${tree(30,.9)}${tree(384,.8,1)}${tree(100,.55,1)}${house}
        <path d="M-20 40 Q90 0 200 28 Q310 0 420 36 V200 H-20Z" fill="#2f2440"/><path d="M-20 110 Q100 84 210 104 Q320 86 420 110 V200 H-20Z" fill="#3b2d4c"/>${jacks}</svg>
      <div class="hi-ff"><div>${foxSVG(FOX.feufollet,{pose:"happy"})}</div></div>
      <div class="hi-crew">${crew}</div>
      <div class="hi-fog"></div><div class="hi-fog b"></div>
    </div>
    ${ghosts}${flies}`;
  document.body.appendChild(el);
  let gone=false;const end=()=>{if(gone)return;gone=true;el.classList.add("hi-out");setTimeout(()=>{el.remove();if(done)done()},350)};
  el.addEventListener("click",end);
}
