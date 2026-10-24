/* La Clairière : décor en plongée (maison de Roussette, porche, mare…), moments de la journée, pluie. */
const scn={lamps:{L:false,R:false},rain:false,phase:""};

/* ---------- moments de la journée (heure réelle) et météo ---------- */
const PH={aube:{sky:["#ffd2bd","#fde9d8"],tint:"#ffb7a0",a:.12,name:"Aube"},jour:{sky:["#bfe0f2","#e9f5ee"],tint:"#fff",a:0,name:"Journée"},crepu:{sky:["#b99ad6","#f7c1a0"],tint:"#8a6ab0",a:.22,name:"Crépuscule"},nuit:{sky:["#252b62","#47467f"],tint:"#262c6a",a:.45,name:"Nuit"}};
const phaseNow=()=>{const h=new Date().getHours();return h>=6&&h<8?"aube":h>=8&&h<18?"jour":h>=18&&h<21?"crepu":"nuit"};
const dark=()=>["crepu","nuit"].includes(phaseNow());
// il pleut par tranches de 3 heures, environ une fois sur trois ; la même pluie pour tout le monde au même moment
function rainNow(){const d=new Date(),k=d.getFullYear()*1e6+(d.getMonth()+1)*1e4+d.getDate()*10+Math.floor(d.getHours()/3);
  let x=k%2147483647;for(let i=0;i<3;i++)x=(x*16807)%2147483647;return x/2147483647<.32}

/* ---------- décor ---------- */
function rng(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
function bgSVG(){
  const ph=PH[phaseNow()],r=rng(11);let s=`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ph.sky[0]}"/><stop offset="1" stop-color="${ph.sky[1]}"/></linearGradient>
  <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd99a"/><stop offset="1" stop-color="#d6e9b4"/></linearGradient></defs>`;
  s+=`<rect width="400" height="480" fill="url(#grass)"/><rect width="400" height="150" fill="url(#sky)"/>`;
  s+=`<g filter="url(#wobble)">`;
  // forêt du fond : deux rangées de houppiers ronds
  for(const [row,col,y0] of [[0,"#9cc796",34],[1,"#7fb27f",70]])for(let i=-1;i<11;i++){const x=i*40+(row?20:0)+r()*10,y=y0+r()*18,R=34+r()*12;s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${R.toFixed(1)}" fill="${col}" ${O}/>`}
  s+=`<path d="M0 150 Q100 132 200 146 Q300 132 400 150 L400 200 L0 200Z" fill="#6fa070" ${O}/>`;
  s+=`<rect x="0" y="168" width="400" height="320" fill="url(#grass)"/>`;
  // herbe : petites touffes et fleurs
  for(let i=0;i<46;i++){const x=r()*400,y=180+r()*295;s+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)} l-3 -6 M${x.toFixed(1)} ${y.toFixed(1)} l0 -7 M${x.toFixed(1)} ${y.toFixed(1)} l3 -6" fill="none" stroke="#86b06e" stroke-width="2" stroke-linecap="round"/>`}
  for(let i=0;i<14;i++){const x=20+r()*360,y=280+r()*190,c=["#ffd1dc","#fff3a8","#d9c7f2"][i%3];s+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${[0,72,144,216,288].map(a=>`<circle cx="${(3*Math.cos(a*Math.PI/180)).toFixed(1)}" cy="${(3*Math.sin(a*Math.PI/180)).toFixed(1)}" r="2.4" fill="${c}"/>`).join("")}<circle r="1.6" fill="#f2b84a"/></g>`}
  // chemin de pierres plates
  [[200,272],[193,296],[206,322],[196,350],[205,392],[196,430],[204,466]].forEach(([x,y],i)=>s+=`<ellipse cx="${x}" cy="${y}" rx="${13-i*.3}" ry="6" fill="#e3dccf" stroke="${INK}" stroke-width="2.4"/>`);
  // arbres sur les côtés (troncs qui encadrent la clairière)
  s+=`<path d="M14 250 Q20 200 16 150 L36 150 Q32 200 40 250Z" fill="#a9785a" ${O}/><path d="M362 250 Q368 200 364 150 L384 150 Q380 200 388 250Z" fill="#a9785a" ${O}/>`;
  s+=`<circle cx="22" cy="128" r="40" fill="#8dbd86" ${O}/><circle cx="380" cy="128" r="40" fill="#8dbd86" ${O}/>`;
  // la maison de Roussette
  s+=`<rect x="232" y="44" width="20" height="40" rx="3" fill="#c9a08a" ${O}/>`;
  s+=`<path d="M128 106 L272 106 L272 202 L128 202Z" fill="#f0c99a" ${O}/>`;
  for(let y=124;y<200;y+=16)s+=`<path d="M130 ${y} H270" stroke="#d9ac7c" stroke-width="2"/>`;
  s+=`<path d="M110 112 L200 42 L290 112 Q200 122 110 112Z" fill="#d98b7a" ${O}/><path d="M140 96 Q200 102 260 96 M162 79 Q200 84 238 79 M183 62 Q200 65 217 62" fill="none" stroke="#b8665a" stroke-width="2.4" stroke-linecap="round"/>`;
  const win=x=>`<rect x="${x}" y="124" width="36" height="34" rx="5" fill="${dark()?"#ffe7a3":"#d9ecf4"}" ${O}/><path d="M${x+18} 125 V157 M${x+1} 141 H${x+35}" stroke="${INK}" stroke-width="2.4"/><path d="M${x-3} 160 H${x+39}" stroke="${INK}" stroke-width="3"/><path d="M${x+2} 162 h32 l-2 6 h-28Z" fill="#a9d68f" stroke="${INK}" stroke-width="2"/>`;
  s+=win(146)+win(218);
  // porte entrouverte : un filet de lumière chaude
  s+=`<path d="M186 140 Q200 130 214 140 V202 H186Z" fill="#6a4434" ${O}/><path d="M188 142 Q195 136 202 137 V202 H188Z" fill="#ffd98a" stroke="none"/><path d="M199 136 Q207 134 213 141 V202 H199Z" fill="#a8704e" ${O}/><circle cx="203" cy="172" r="1.8" fill="#f2c45a" stroke="none"/>`;
  // le porche : auvent, poteaux, terrasse en planches, marches
  s+=`<path d="M106 202 L294 202 L302 246 L98 246Z" fill="#d9a777" ${O}/>`;
  for(const y of [213,224,235])s+=`<path d="M${104-(y-202)*.1} ${y} H${296+(y-202)*.1}" stroke="#c08a5c" stroke-width="2"/>`;
  s+=`<path d="M182 246 h36 l2 8 h-40Z M178 254 h44 l2 7 h-48Z" fill="#c99a6a" ${O}/>`;
  s+=`<path d="M108 168 L292 168 L302 192 L98 192Z" fill="#c97b6a" ${O}/>${[128,156,184,212,240,268].map(x=>`<path d="M${x} 170 L${x-4+((x-200)*.06)} 191" stroke="#a9604f" stroke-width="2"/>`).join("")}`;
  s+=`<rect x="102" y="190" width="7" height="54" rx="2" fill="#b58460" ${O}/><rect x="291" y="190" width="7" height="54" rx="2" fill="#b58460" ${O}/>`;
  // guirlandes de lanternes, du porche aux arbres
  s+=`<path d="M106 194 Q60 226 26 200 M294 194 Q340 226 374 200" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
  // la souche
  s+=`<path d="M63 290 L63 304 Q85 316 107 304 L107 290Z" fill="#b5835a" ${O}/><ellipse cx="85" cy="290" rx="22" ry="8" fill="#e6c49a" ${O}/><ellipse cx="85" cy="290" rx="12" ry="4" fill="none" stroke="#c99a6a" stroke-width="1.8"/><path d="M60 304 q-6 4 -10 2 M110 304 q6 4 10 2" fill="none" ${O}/>`;
  // le tas de feuilles
  s+=`<g ${O}>${[[300,336,"#f2a35c"],[318,330,"#e8794e"],[338,334,"#f6c065"],[310,340,"#e98a5a"],[330,342,"#f2a35c"]].map(([x,y,c],i)=>`<path d="M${x-14} ${y} Q${x} ${y-14} ${x+14} ${y} Q${x} ${y+6} ${x-14} ${y}Z" fill="${c}" transform="rotate(${[-12,8,-4,14,-8][i]} ${x} ${y})"/>`).join("")}</g>`;
  // la mare
  s+=`<ellipse cx="96" cy="424" rx="62" ry="24" fill="#a9d3e6" ${O}/><path d="M60 420 q14 -6 28 0 M98 432 q12 -5 24 0" fill="none" stroke="#e4f3f9" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="72" cy="430" rx="10" ry="4.5" fill="#8fca7a" ${O}/><path d="M38 418 l-4 -18 M44 414 l0 -20 M150 416 l3 -16" fill="none" stroke="#6f9a60" stroke-width="3" stroke-linecap="round"/>`;
  // le banc
  s+=`<rect x="266" y="406" width="6" height="12" fill="#a9785a" ${O}/><rect x="328" y="406" width="6" height="12" fill="#a9785a" ${O}/><rect x="260" y="396" width="80" height="12" rx="3" fill="#d9a777" ${O}/><path d="M262 402 H338" stroke="#c08a5c" stroke-width="1.8"/>`;
  s+=`</g>`;
  return s;
}
// les lumières passent au-dessus du voile de la nuit pour vraiment briller
function glowSVG(){
  let s="";const lamps=(side,pts)=>pts.map(([x,y])=>{const on=scn.lamps[side];return (on?`<circle class="lit" cx="${x}" cy="${y+8}" r="14" fill="#ffe08a" opacity=".45"/>`:"")+`<path d="M${x} ${y} v4" stroke="${INK}" stroke-width="1.6"/><rect x="${x-5}" y="${y+3}" width="10" height="12" rx="4" fill="${on?"#ffd36a":"#f4e6d4"}" stroke="${INK}" stroke-width="2"/>`}).join("");
  s+=lamps("L",[[86,206],[60,214],[38,208]])+lamps("R",[[314,206],[340,214],[362,208]]);
  if(dark()){
    s+=[166,236].map(x=>`<circle cx="${x}" cy="141" r="26" fill="#ffe08a" opacity=".22"/>`).join("");
    s+=`<path d="M188 142 Q195 136 202 137 V202 H188Z" fill="#ffe08a" opacity=".35"/>`;
  }
  if(phaseNow()==="nuit"){const r=rng(5);for(let i=0;i<16;i++)s+=`<circle cx="${(r()*400).toFixed(1)}" cy="${(r()*60).toFixed(1)}" r="${(.8+r()*1.2).toFixed(1)}" fill="#fff8d0" opacity=".8"/>`;
    if(!scn.rain)for(let i=0;i<7;i++)s+=`<circle class="fly" style="animation-delay:${(-r()*5).toFixed(1)}s" cx="${(30+r()*340).toFixed(1)}" cy="${(260+r()*190).toFixed(1)}" r="2" fill="#fff6a0"/>`}
  // renards à l'intérieur : des silhouettes derrière les vitres
  foxes.filter(f=>f.inside).slice(0,4).forEach((f,i)=>{const x=[156,170,228,242][i];s+=`<g opacity=".55"><path d="M${x-7} 158 Q${x-8} 148 ${x-5} 144 L${x-6} 136 L${x-1} 142 Q${x} 141 ${x+1} 142 L${x+6} 136 L${x+5} 144 Q${x+8} 148 ${x+7} 158Z" fill="${INK}"/></g>`});
  // fumée de la cheminée
  s+=[0,1.3,2.6].map(d=>`<circle class="smoke" style="animation-delay:${d}s;transform-origin:242px 40px" cx="242" cy="38" r="6" fill="#f4f0ee"/>`).join("");
  return s;
}
function drawBg(){scn.phase=phaseNow();if(!dark())scn.lamps={L:false,R:false};$("bg").innerHTML=bgSVG();drawGlow();const ph=PH[scn.phase];$("tint").style.backgroundColor=ph.tint;$("tint").style.opacity=ph.a;drawPills()}
function drawGlow(){$("glow").innerHTML=glowSVG()}
function drawPills(){$("phase").textContent=PH[phaseNow()].name+(scn.rain?" · il pleut":"")}

/* ---------- gamelle (dans la scène) ---------- */
function bowlSVG(type,n=3){const B=type&&BOWLS[type];
  const food=!B?"":type==="poisson"?`<path d="M10 8 q6 -5 14 0 q-8 5 -14 0Z M24 8 l5 -3 v6Z" fill="#9ec3ef" stroke="${INK}" stroke-width="1.4"/>`
    :type==="miel"?`<path d="M12 9 l3 -5 h6 l3 5 l-3 5 h-6Z M22 9 l3 -5 h6 l3 5" fill="#f2c45a" stroke="${INK}" stroke-width="1.4"/>`
    :Array.from({length:n*3},(_,i)=>`<circle cx="${9+(i%6)*4.4}" cy="${8.5-Math.floor(i/6)*2.4}" r="2.4" fill="${B.col}" stroke="${INK}" stroke-width="1.4"/>`).join("");
  return `<svg viewBox="0 0 40 24" aria-hidden="true"><g filter="url(#wobble)">${food}<path d="M3 9 Q4 22 20 22 Q36 22 37 9Z" fill="#f59a8b" ${O}/><ellipse cx="20" cy="9" rx="17" ry="4" fill="none" ${O}/></g></svg>`}

/* ---------- pluie ---------- */
const cv=$("rain"),cx=cv.getContext("2d");let drops=[],lastT=performance.now(),raining=false;
function sizeRain(){const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=r.width*d;cv.height=r.height*d;cx.setTransform(d,0,0,d,0,0);drops=Array.from({length:90},()=>({x:Math.random()*r.width,y:Math.random()*r.height,v:260+Math.random()*160}))}
function startRain(){if(raining||matchMedia("(prefers-reduced-motion: reduce)").matches)return;raining=true;lastT=performance.now();requestAnimationFrame(rainLoop)}
function rainLoop(now){const dt=Math.min(.05,(now-lastT)/1000);lastT=now;const w=cv.width/(devicePixelRatio||1),h=cv.height/(devicePixelRatio||1);cx.clearRect(0,0,w,h);
  if(scn.rain){cx.strokeStyle="rgba(214,232,255,.75)";cx.lineWidth=1.6;cx.lineCap="round";cx.beginPath();for(const d of drops){d.y+=d.v*dt;d.x-=d.v*dt*.12;if(d.y>h){d.y=-10;d.x=Math.random()*w*1.1}cx.moveTo(d.x,d.y);cx.lineTo(d.x+1.4,d.y-11)}cx.stroke()}
  if(scn.rain)requestAnimationFrame(rainLoop);else raining=false}
