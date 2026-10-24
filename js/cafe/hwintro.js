/* Kitsune Café : petite animation d'ouverture de la Nuit des citrouilles (8 s environ), montrée une fois par an
   avant la feuille Halloween, et à revoir depuis cette feuille. On touche pour passer. */
function hwIntro(done){
  const old=$("hwintro");if(old)old.remove();
  const el=document.createElement("div");el.id="hwintro";el.setAttribute("role","button");el.setAttribute("aria-label","Nuit des citrouilles : touche pour continuer");
  const r=rng(31);let stars="";
  for(let i=0;i<34;i++)stars+=`<circle cx="${(r()*400).toFixed(0)}" cy="${(r()*480).toFixed(0)}" r="${(.8+r()*1.6).toFixed(1)}" fill="#fff6d0" style="animation-delay:${(r()*2.4).toFixed(2)}s"/>`;
  // les citrouilles s'allument l'une après l'autre
  const jacks=[[42,170,.95],[358,170,.95],[124,184,.8],[276,184,.8]].map(([x,y,k],i)=>`<g class="hi-jack" style="animation-delay:${1.6+i*.35}s">${jack(x,y,k)}</g>`).join("");
  const bat=`<path d="M0 0 Q-6 -8 -16 -6 Q-12 -2 -13 3 Q-8 0 -6 4 Q-3 0 0 0 Q3 0 6 4 Q8 0 13 3 Q12 -2 16 -6 Q6 -8 0 0Z" fill="#2a1f33"><animateTransform attributeName="transform" type="scale" values="1 1;1 .3;1 1" dur=".35s" repeatCount="indefinite"/></path><circle r="3.4" fill="#2a1f33"/>`;
  const bats=[[90,0,1.3],[170,.5,1],[230,.9,.8]].map(([y,d,k])=>`<g class="hi-bat" style="animation-delay:${2.6+d}s;--y:${y}px"><g transform="scale(${k})">${bat}</g></g>`).join("");
  // quatre clients déguisés autour de Feu Follet
  const crew=[["galette","sorciere"],["petitpois","citrouille"],["feufollet",""],["luciole","chauvesouris"],["pantoufle","vampire"]];
  const foxes=crew.map(([id,c],i)=>{const f=c?{...FOX[id],acc:c}:FOX[id];
    return `<div class="hi-fox${c?"":" hi-ghost"}" style="animation-delay:${c?4.3+[0,.15,0,.3,.45][i]:3.4}s"><div>${foxSVG(f,{pose:c?"happy":"sit"})}</div></div>`}).join("");
  // ciel en fond ; la lune est à part pour ne jamais passer sous le titre ; le sol garde ses proportions, en bas
  el.innerHTML=`<svg class="hi-bg" viewBox="0 0 400 700" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
    <defs><linearGradient id="hi-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f1840"/><stop offset=".6" stop-color="#4a2f6a"/><stop offset="1" stop-color="#c9708a"/></linearGradient></defs>
    <rect width="400" height="700" fill="url(#hi-sky)"/><g class="hi-stars">${stars}</g></svg>
    <svg class="hi-moon" viewBox="-80 -80 160 160" aria-hidden="true"><circle r="70" fill="#fff1b8" opacity=".25" filter="url(#soft)"/><circle r="46" fill="#fff1c4"/><circle cx="-16" cy="-12" r="8" fill="#f2dea0" opacity=".7"/><circle cx="14" cy="16" r="5" fill="#f2dea0" opacity=".7"/></svg>
    <svg class="hi-bats" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bats}</svg>
    <div class="hi-title"><b>Nuit des citrouilles</b><span>Au Kitsune Café, jusqu'au 3 novembre</span><small class="hi-tap">Touche pour continuer</small></div>
    <div class="hi-ground"><svg viewBox="0 0 400 200" aria-hidden="true"><path d="M-20 40 Q90 0 200 28 Q310 0 420 36 V200 H-20Z" fill="#2f2440"/><path d="M-20 110 Q100 84 210 104 Q320 86 420 110 V200 H-20Z" fill="#3b2d4c"/>${jacks}</svg>
      <div class="hi-crew">${foxes}</div></div>`;
  document.body.appendChild(el);
  let gone=false;const end=()=>{if(gone)return;gone=true;el.classList.add("hi-out");setTimeout(()=>{el.remove();if(done)done()},350)};
  el.addEventListener("click",end);
}
