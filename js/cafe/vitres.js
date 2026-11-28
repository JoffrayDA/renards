/* ---------- Derrière la vitre des quartiers : la Petite Italie, Paris, Kyoto (28/11/2026) ----------
   Joffray : « Italie c'est moyen, France c'est très très moche avec l'ancienne tour Eiffel, le Japon très moche aussi ».
   Refaits comme le paysage du premier café (draw.js, outsideSVG) : des plans qui s'éloignent dans la brume, de la lumière,
   un premier plan qui encadre. On reprend les dessins des cartes (paEiffel, paSacre, kyPagoda, kySakura…), mis à l'échelle.
   Repère : 600 × 200, la vitre va de GX0 à GX1 (84-516) et de GY0 à GY1 ; montants aux x de PANES (192, 300, 408) :
   les sujets principaux sont posés entre deux montants. Ce qui bouge va dans `an` (hors du filtre #wobble).
   Chargé après kyoto-deco.js (il se sert des dessins des trois quartiers). */

const vwL=(w=2)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const vwF=n=>n.toFixed(1);
// un nuage en volume qui dérive lentement
const vwCloud=(x,y,k,dur,c="#fff",sh="#e6e2f0")=>`<g><animateTransform attributeName="transform" type="translate" values="0 0;16 0;0 0" dur="${dur}s" repeatCount="indefinite"/>`
  +[[x-15*k,y,11*k],[x+2*k,y-7*k,15*k],[x+19*k,y,10*k],[x+6*k,y+3*k,11*k]].map(([cx,cy,r])=>`<circle cx="${vwF(cx)}" cy="${vwF(cy)}" r="${vwF(r)}" fill="${c}"/>`).join("")
  +`<path d="M${vwF(x-26*k)} ${vwF(y+5*k)} Q${vwF(x)} ${vwF(y+14*k)} ${vwF(x+29*k)} ${vwF(y+5*k)} Q${vwF(x)} ${vwF(y+9*k)} ${vwF(x-26*k)} ${vwF(y+5*k)}Z" fill="${sh}"/></g>`;
// des oiseaux qui traversent
const vwBirds=(y,dur,dl=0)=>`<g><animateTransform attributeName="transform" type="translate" values="-60 0;640 -14" dur="${dur}s" begin="${-dl}s" repeatCount="indefinite"/>`
  +[[0,0],[13,-6],[24,2]].map(([a,b])=>`<path d="M${a-5} ${y+b} q2.5 -3.4 5 0 q2.5 -3.4 5 0" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/>`).join("")+`</g>`;
// un voile de brume horizontal
const vwMist=(y,h,op,id)=>`<rect x="0" y="${y}" width="600" height="${h}" fill="url(#${id})" opacity="${op}"/>`;
const vwMistDef=id=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
const vwGrad=(id,stops,x2=0,y2=1)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
const vwGlow=(id,c)=>`<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".95"/><stop offset=".4" stop-color="${c}" stop-opacity=".35"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
// un dessin de carte, posé à l'échelle k au point (x, y)
const vwPut=(x,y,k,svg)=>`<g transform="translate(${x} ${y}) scale(${k})">${svg}</g>`;
// un feuillage en grappes (coin d'arbre qui dépasse en haut de la vitre)
const vwLeaves=(pts,grad,hl="#fff")=>pts.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r+1.8}" fill="${INK}"/>`).join("")
  +pts.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${grad})"/>`).join("")
  +pts.map(([x,y,r])=>`<circle cx="${vwF(x-r*.32)}" cy="${vwF(y-r*.36)}" r="${vwF(r*.36)}" fill="${hl}" opacity=".35"/>`).join("");

/* ---------- la Petite Italie : la Toscane au soleil de fin d'après-midi ---------- */
OUT.italie={sky:["#8fcdef","#fde7cf"],hill:["#c9d89a","#b5c983"],cloud:"#fff"};
function outsideIt(){
  const R=rng(23),l=vwL;
  const defs=vwGrad("vi-sky",[[0,"#73bde9"],[.5,"#bfe1f0"],[.8,"#fbe6cf"],[1,"#fdd9b0"]])+vwGlow("vi-sun","#fff2c4")+vwMistDef("vi-mist")
    +vwGrad("vi-mt",[[0,"#aab5dc"],[1,"#cfd3ea"]])+vwGrad("vi-h0",[[0,"#c9d7a8"],[1,"#b2c48e"]])+vwGrad("vi-h1",[[0,"#d9d48a"],[1,"#c2b56a"]])
    +vwGrad("vi-h2",[[0,"#b9d27e"],[1,"#93b45e"]])+vwGrad("vi-stone",[[0,"#fbf2e0"],[1,"#e4d2b2"]])
    +`<radialGradient id="vi-leaf" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#a8d48a"/><stop offset="1" stop-color="#5f9a5a"/></radialGradient>
    <radialGradient id="vi-bou" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffb6d6"/><stop offset="1" stop-color="#e05a9a"/></radialGradient>
    <radialGradient id="vi-lem" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#b6dc8e"/><stop offset="1" stop-color="#6aa65c"/></radialGradient>`;
  let st=`<rect width="600" height="200" fill="url(#vi-sky)"/><circle cx="452" cy="92" r="110" fill="url(#vi-sun)"/><circle cx="452" cy="92" r="17" fill="#fff6d0" ${l(1.8)}/>`,an="";
  // les Apennins au loin, bleutés
  st+=`<path d="M40 112 L96 86 L130 98 L176 74 L226 100 L262 90 L318 104 L372 80 L420 98 L470 84 L530 104 L600 92 V140 H40Z" fill="url(#vi-mt)"/>`
    +`<path d="M176 74 L166 84 L176 83 L182 89 L188 82 L196 85Z M372 80 L362 90 L372 89 L378 95 L384 88 L392 91Z" fill="#fff" opacity=".8"/>`;
  st+=vwMist(94,40,.7,"vi-mist");
  // la colline lointaine et son village perché (à gauche) : rempart, maisons serrées, dôme et campanile, cyprès
  st+=`<path d="M60 128 Q110 92 170 96 Q220 98 262 126 V150 H60Z" fill="url(#vi-h0)"/>`;
  st+=`<g transform="translate(0 10)">`;
  {const hs=[[112,98,12,10,"#f1d9b4"],[124,94,10,13,"#f4c9a0"],[136,92,12,11,"#fbe3bc"],[150,93,10,12,"#f0caa6"],[162,95,12,10,"#f6dcb6"],[174,98,10,9,"#efc7a0"],[118,103,12,8,"#f4d2ac"],[168,103,12,8,"#fbe0b8"]];
    st+=`<path d="M100 110 Q140 100 186 110 V116 H100Z" fill="#e2c9a0" ${l(1.2)}/>`;
    st+=hs.map(([x,y,w,h,c])=>`<rect x="${x-w/2}" y="${y-h}" width="${w}" height="${h+8}" fill="${c}" ${l(1.1)}/><path d="M${x-w/2-1.5} ${y-h} L${x} ${y-h-4} L${x+w/2+1.5} ${y-h}Z" fill="#d9774e" ${l(1.1)}/><rect x="${x-1.6}" y="${y-h+3}" width="3.2" height="3.6" rx="1" fill="#8a6a54" opacity=".6"/>`).join("");
    st+=`<rect x="141" y="66" width="8" height="26" fill="#f4dcb6" ${l(1.1)}/><path d="M140 66 L145 59 L150 66Z" fill="#d9774e" ${l(1.1)}/><rect x="143" y="70" width="4" height="4" rx="1.6" fill="#8a6a54" opacity=".6"/>`
      +`<path d="M152 86 Q152 74 162 74 Q172 74 172 86Z" fill="#d97a52" ${l(1.1)}/><path d="M162 74 V70" ${l(1.1)}/><path d="M156 84 Q157 77 162 76 M168 84 Q167 77 162 76" stroke="#b85e3e" stroke-width=".8" fill="none"/><rect x="151" y="85" width="22" height="9" fill="#fbe3bc" ${l(1.1)}/>`;
    st+=[[96,112,.34],[104,110,.3],[192,112,.32],[200,116,.3]].map(([x,y,k])=>vwPut(x,y,k,itCypress(0,0))).join("")}
  st+=`</g>`;
  // la tour qui penche, au milieu des champs (entre deux montants) : six étages d'arcades, le clocher
  {const tx=246,ty=156;let t=`<g transform="rotate(5 ${tx} ${ty})"><ellipse cx="${tx}" cy="${ty+1}" rx="16" ry="3" fill="#000" opacity=".1"/>`;
    for(let i=0;i<6;i++){const y=ty-(i+1)*12,w=i===0?24:22;t+=`<rect x="${tx-w/2}" y="${y}" width="${w}" height="12" fill="url(#vi-stone)" ${l(1.3)}/>`+Array.from({length:5},(_,j)=>`<path d="M${vwF(tx-w/2+2.6+j*(w-5)/4)} ${y+11} v-6 a1.3 1.3 0 0 1 2.6 0 v6" fill="#d8c7a6" stroke="#b9a483" stroke-width=".7"/>`).join("")+`<path d="M${tx-w/2-1.5} ${y} H${tx+w/2+1.5}" ${l(1.6)}/>`}
    t+=`<rect x="${tx-8}" y="${ty-84}" width="16" height="12" fill="url(#vi-stone)" ${l(1.3)}/><path d="M${tx-5} ${ty-73} v-6 a2 2 0 0 1 4 0 v6 M${tx+1} ${ty-73} v-6 a2 2 0 0 1 4 0 v6" fill="#d8c7a6" stroke="#b9a483" stroke-width=".7"/><path d="M${tx-9.5} ${ty-84} H${tx+9.5}" ${l(1.6)}/></g>`;
    st+=t}
  // les collines du milieu : champs dorés en patchwork, vignes, route blanche bordée de cyprès, la ferme
  st+=`<path d="M0 140 Q90 120 200 136 Q300 150 380 128 Q470 112 600 130 V200 H0Z" fill="url(#vi-h1)" ${l(1.8)}/>`;
  st+=`<path d="M300 142 Q340 130 392 132 L404 146 Q350 146 312 154Z" fill="#e8c860" opacity=".8"/><path d="M420 126 Q460 118 510 124 L516 140 Q470 136 428 142Z" fill="#c9d878" opacity=".85"/><path d="M96 138 Q140 130 186 138 L190 150 Q144 146 100 152Z" fill="#a9c470" opacity=".7"/>`;
  st+=Array.from({length:6},(_,i)=>`<path d="M${424+i*2} ${129+i*2.4} Q468 ${122+i*2.4} ${512-i} ${128+i*2.4}" fill="none" stroke="#7f9a4e" stroke-width="1.6" stroke-dasharray="1.5 3.5" opacity=".9"/>`).join("");
  st+=Array.from({length:5},(_,i)=>`<path d="M${302+i*3} ${144+i*2.2} Q350 ${136+i*2.2} ${398-i} ${138+i*2.2}" fill="none" stroke="#c9a040" stroke-width="1.2" opacity=".55"/>`).join("");
  // la ferme toscane sur sa colline, une meule de foin
  st+=vwPut(468,124,.42,itCasale(0,0));
  st+=`<ellipse cx="370" cy="150" rx="7" ry="5" fill="#f2cf6a" ${l(1.2)}/><path d="M364 149 q6 -3 12 0" stroke="#c99a3a" stroke-width=".9" fill="none"/>`;
  // la route blanche qui monte, et ses cyprès
  st+=`<path d="M340 200 Q330 182 352 170 Q378 158 392 146 Q404 136 430 132 L434 134 Q410 140 398 150 Q384 164 360 174 Q344 184 352 200Z" fill="#f6ead2" ${l(1.4)}/>`;
  st+=[[384,150,.5],[400,141,.44],[414,135,.4],[440,129,.36],[452,127,.34],[366,166,.6]].map(([x,y,k])=>vwPut(x,y,k,itCypress(0,0))).join("");
  // le pré devant : oliviers, coquelicots
  st+=`<path d="M0 166 Q140 150 290 162 Q440 150 600 162 V200 H0Z" fill="url(#vi-h2)" ${l(2)}/>`;
  st+=vwPut(150,172,.55,itOlive(0,0))+vwPut(520,172,.5,itOlive(0,0));
  for(let i=0;i<26;i++){const x=90+R()*420,y=168+R()*8;if(x>330&&x<366)continue;st+=`<circle cx="${vwF(x)}" cy="${vwF(y)}" r="${vwF(1.2+R()*.8)}" fill="${i%3?"#e8483e":"#fff4e0"}"/>`}
  // la terrasse du Caffè : balustrade de pierre, citronniers en pot
  st+=`<rect x="0" y="176" width="600" height="6" rx="2" fill="url(#vi-stone)" ${l(2)}/><rect x="0" y="193" width="600" height="7" fill="url(#vi-stone)" ${l(2)}/>`;
  for(let x=90;x<516;x+=15){if(x>118&&x<142||x>458&&x<482)continue;st+=`<path d="M${x-3.4} 182 Q${x-5.6} 186 ${x-2.6} 188 Q${x-4.6} 191 ${x-3} 193 H${x+3} Q${x+4.6} 191 ${x+2.6} 188 Q${x+5.6} 186 ${x+3.4} 182Z" fill="url(#vi-stone)" ${l(1.2)}/>`}
  const lemon=(x,y)=>`<path d="M${x-10} ${y-15} L${x-8} ${y} H${x+8} L${x+10} ${y-15}Z" fill="#d9774e" ${l(1.6)}/><path d="M${x-11} ${y-15} H${x+11}" ${l(2.4)}/><path d="M${x} ${y-15} V${y-24}" stroke="#8a6a44" stroke-width="2.6"/>`
    +vwLeaves([[x-8,y-30,8],[x+7,y-31,8],[x,y-38,9],[x,y-27,7]],"vi-lem")+[[-7,-33],[6,-36],[2,-27],[-2,-40],[9,-28]].map(([a,b])=>`<ellipse cx="${x+a}" cy="${y+b}" rx="2.6" ry="2" fill="#ffe14a" stroke="${INK}" stroke-width=".9"/>`).join("");
  st+=lemon(130,193)+lemon(470,193);
  // la bougainvillée qui retombe en haut à droite
  st+=`<path d="M420 22 Q440 34 470 30 Q492 28 516 40" fill="none" stroke="#8a6a44" stroke-width="2.6" stroke-linecap="round"/>`
    +vwLeaves([[430,26,7],[446,32,8],[462,28,7],[478,34,8],[494,30,7],[508,40,8],[500,52,6],[486,46,6],[456,42,5],[514,58,5]],"vi-bou","#fff")
    +[[440,38],[468,40],[490,40],[506,50],[452,30]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.2" fill="#7fb06a" ${l(.9)}/>`).join("");
  // hirondelles, nuages, une feuille de bougainvillée qui tombe
  an+=vwBirds(66,20)+vwBirds(48,27,9);
  an+=vwCloud(250,52,1,22)+vwCloud(380,38,.7,27)+vwCloud(150,40,.55,19);
  an+=[0,3,6].map(d=>`<ellipse cx="0" cy="0" rx="2.6" ry="1.6" fill="#f07ab0"><animateMotion path="M480 46 C470 80 500 110 470 150 C460 168 476 176 468 186" dur="9s" begin="${-d}s" repeatCount="indefinite" rotate="auto"/></ellipse>`).join("");
  return {defs,st,an};
}

/* ---------- Paris : la Seine au coucher du soleil, la tour Eiffel entre deux montants ---------- */
OUT.paris={sky:["#9fcfee","#f6e4ee"],hill:["#c9d89a","#b5c983"],cloud:"#fff"};
function outsidePa(){
  const R=rng(31),l=vwL;
  const defs=PA_DEFS+vwGrad("vp-sky",[[0,"#7fb9e6"],[.45,"#c6d9f0"],[.78,"#f8d4d4"],[1,"#fde2c4"]])+vwGlow("vp-sun","#fff0c8")+vwMistDef("vp-mist")
    +vwGrad("vp-far",[[0,"#b9b6d8"],[1,"#d4cde4"]])+vwGrad("vp-mid",[[0,"#e8dccb"],[1,"#d2c2aa"]])+vwGrad("vp-street",[[0,"#e6d9c4"],[1,"#d6c6ac"]])
    +`<radialGradient id="vp-leaf" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#b2da8c"/><stop offset=".7" stop-color="#7fba68"/><stop offset="1" stop-color="#5f9a5a"/></radialGradient>
    <radialGradient id="vp-ger" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ff8a8a"/><stop offset="1" stop-color="#d8384a"/></radialGradient>
    <pattern id="vp-pave" width="12" height="7" patternUnits="userSpaceOnUse"><path d="M0 7 H12 M6 0 V3.5 M0 3.5 H12 M12 3.5 V7" stroke="#c2b092" stroke-width=".8" fill="none"/></pattern>`;
  let st=`<rect width="600" height="200" fill="url(#vp-sky)"/><circle cx="214" cy="112" r="120" fill="url(#vp-sun)"/><circle cx="214" cy="112" r="15" fill="#fff4d4" ${l(1.6)}/>`,an="";
  // Paris au loin dans la brume : toits de zinc, cheminées, le dôme doré des Invalides, Montmartre et le Sacré-Cœur sur sa butte
  st+=`<path d="M40 150 Q96 100 150 98 Q206 100 252 150Z" fill="#bcc8c8"/><path d="M110 112 q10 -4 18 0 M170 112 q8 -3 14 1" stroke="#b2b2d0" stroke-width="1.4" fill="none"/>`;
  st+=vwPut(150,104,.34,paSacre(0,0));
  {let d="M40 150 V136";let x=40;while(x<580){const w=12+R()*20,h=126+R()*10;d+=` L${vwF(x)} ${vwF(h+4)} L${vwF(x+3)} ${vwF(h)} H${vwF(x+w-3)} L${vwF(x+w)} ${vwF(h+4)}`;if(R()<.5)d+=` M${vwF(x+w*.6)} ${vwF(h)} v-4 h3 v4 M${vwF(x+w)} ${vwF(h+4)}`;x+=w}
    st+=`<path d="${d} V150Z" fill="url(#vp-far)"/>`}
  st+=`<path d="M262 132 Q262 116 272 112 Q282 116 282 132Z" fill="#e4c88a" ${l(1)}/><path d="M272 112 V104" stroke="#c9a85a" stroke-width="1.6"/><circle cx="272" cy="103" r="1.6" fill="#e4c88a"/><rect x="258" y="131" width="28" height="6" fill="#d6cfe4"/>`;
  st+=vwMist(118,34,.8,"vp-mist");
  // la tour Eiffel, entre les montants de 300 et 408 (son clip est renommé : la carte de Paris a le même)
  st+=vwPut(354,152,.42,paEiffel(0,0,300).replace(/pa-eif\b/g,"pa-eifw"));
  // le quai d'en face et ses platanes
  st+=`<path d="M0 150 H600 V160 H0Z" fill="url(#vp-mid)" ${l(1.6)}/>`;
  for(let x=96;x<516;x+=26+R()*10){if(x>186&&x<212)continue;const r=7+R()*3;st+=vwLeaves([[x-5,148-r*.6,r*.8],[x+5,148-r*.7,r*.85],[x,148-r*1.2,r*.75]],"vp-leaf")}
  // la Seine
  st+=`<rect x="0" y="160" width="600" height="16" fill="url(#pa-water)"/>`;
  // le pont de pierre à trois arches (à gauche), ses réverbères, son reflet
  {const arch=(a,b)=>`M${a} 176 V168 Q${(a+b)/2} 152 ${b} 168 V176`;
    st+=`<path d="M84 146 H300 V176 H84Z" fill="url(#pa-stoneV)" ${l(1.6)}/>`+[[100,150],[162,214],[228,280]].map(([a,b])=>`<path d="${arch(a,b)}Z" fill="#9fc6d8" ${l(1.4)}/><path d="${arch(a,b)}" fill="none" stroke="#fff" stroke-width="1" opacity=".5" transform="translate(0 -1.5)"/>`).join("")
      +`<path d="M82 146 H302" ${l(2.6)}/><path d="M84 141 H300" stroke="${INK}" stroke-width="1.2"/>`+Array.from({length:27},(_,i)=>`<path d="M${88+i*8} 141 V146" stroke="${INK}" stroke-width="1"/>`).join("")
      +[[155,0],[221,0]].map(([x])=>`<path d="M${x} 176 V158" stroke="#e2d3b6" stroke-width="7"/><path d="M${x-4} 158 h8" ${l(1)}/>`).join("")
      +[120,190,260].map(x=>`<circle cx="${x}" cy="128" r="7" fill="url(#pa-glow)"/><path d="M${x} 141 V129" stroke="${INK}" stroke-width="1.6"/><rect x="${x-2.6}" y="124" width="5.2" height="6" rx="1.4" fill="#ffe9a8" ${l(1)}/>`).join("");
    st+=[[125,"#c9e0ea"],[188,"#c9e0ea"],[254,"#c9e0ea"]].map(([x,c])=>`<ellipse cx="${x}" cy="174" rx="14" ry="1.6" fill="${c}" opacity=".7"/>`).join("")}
  // la péniche amarrée à droite
  st+=vwPut(468,171,.62,paPeniche(0,0));
  // le quai de ce côté : pavés, boîtes vertes des bouquinistes, réverbère, jardinière de géraniums, vélo
  st+=`<rect x="0" y="176" width="600" height="24" fill="url(#vp-street)" ${l(2)}/><rect x="0" y="176" width="600" height="24" fill="url(#vp-pave)" opacity=".7"/><path d="M0 179 H600" stroke="#c2b092" stroke-width="1.2"/>`;
  const box=(x,open)=>`<rect x="${x}" y="178" width="34" height="12" rx="1.5" fill="#3f7a5a" ${l(1.4)}/>`+(open?`<path d="M${x} 178 L${x+4} 166 H${x+38} L${x+34} 178Z" fill="#4f8a6a" ${l(1.4)}/>`+[["#e86a6a",4],["#f2c45a",10],["#7fa6dc",16],["#fff4dc",22],["#c98ad0",28]].map(([c,a])=>`<rect x="${x+a}" y="172" width="5" height="7" rx="1" fill="${c}" ${l(.8)}/>`).join(""):`<path d="M${x-1} 178 H${x+35}" ${l(1.4)}/>`)+`<rect x="${x+14}" y="181" width="6" height="2" rx="1" fill="#2a5a40"/>`;
  st+=box(96,1)+box(136,0);
  st+=`<circle cx="250" cy="142" r="16" fill="url(#pa-glow)"/><path d="M246 196 h8 l-1.6 -5 h-4.8Z" fill="#3f5a4a" ${l(1.4)}/><path d="M250 191 V148" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M250 191 V148" stroke="#3f5a4a" stroke-width="1.6"/><path d="M244 148 h12 l-2 -10 h-8Z" fill="#ffe9a8" ${l(1.4)}/><path d="M243 138 h14 l-7 -6Z" fill="#3f5a4a" ${l(1.4)}/>`;
  st+=`<path d="M420 196 L423 184 H469 L472 196Z" fill="#c9a888" ${l(1.6)}/>`+vwLeaves([[428,182,5],[438,180,5.4],[448,182,5],[458,180,5.4],[466,183,4.6]],"vp-leaf")+[[426,178],[436,176],[446,179],[455,175],[464,178],[441,182],[460,183]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="url(#vp-ger)" ${l(.8)}/>`).join("");
  st+=vwPut(500,194,.72,paBike(0,0,"#c0485a",1));
  // le platane qui dépasse en haut à gauche
  st+=`<path d="M84 22 Q100 30 120 28 Q150 26 176 40" fill="none" stroke="#9a6e4a" stroke-width="3" stroke-linecap="round"/>`
    +vwLeaves([[90,26,10],[106,32,11],[124,28,9],[140,34,10],[158,32,9],[172,42,8],[98,44,7],[118,44,7],[150,46,6],[182,52,5]],"vp-leaf");
  // nuages roses, pigeons, reflets qui scintillent sur l'eau
  an+=vwCloud(320,46,1,24,"#fff4f2","#f2d4dc")+vwCloud(470,36,.7,29,"#fff4f2","#f2d4dc")+vwCloud(200,60,.5,21,"#fff4f2","#f2d4dc");
  an+=vwBirds(70,22)+vwBirds(52,30,12);
  an+=[[110,164],[176,170],[242,166],[330,165],[380,170],[420,163],[500,166],[300,172]].map(([x,y],i)=>`<path d="M${x-6} ${y} h12" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;.9;0" dur="${2.4+i%3*.7}s" begin="${-i*.6}s" repeatCount="indefinite"/></path>`).join("");
  return {defs,st,an};
}

/* ---------- Kyoto : le mont Fuji au-dessus du lac, la pagode sur sa colline, un cerisier en fleurs ---------- */
OUT.kyoto={sky:["#f6c6b4","#fde9d6"],hill:["#a9c79a","#93b585"],cloud:"#fff"};
function outsideKy(){
  const R=rng(47),l=vwL;
  const defs=KY_DEFS+vwGrad("vk-sky",[[0,"#94aee0"],[.45,"#d6c4e0"],[.75,"#f8c8c0"],[1,"#fde0c6"]])+vwGlow("vk-sun","#ffe2b8")+vwMistDef("vk-mist")
    +vwGrad("vk-fuji",[[0,"#7d8cc4"],[.6,"#a6aedb"],[1,"#cdc6e4"]])+vwGrad("vk-far",[[0,"#9fb3c8"],[1,"#b9c6d6"]])+vwGrad("vk-h1",[[0,"#7fa48a"],[1,"#6a8e78"]])
    +vwGrad("vk-lake",[[0,"#c9d6ee"],[.5,"#a9bfe2"],[1,"#8eaad6"]])+vwGrad("vk-wood",[[0,"#9a6a46"],[1,"#6e4a32"]])
    +`<radialGradient id="vk-pine" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7fae86"/><stop offset="1" stop-color="#3f6f5a"/></radialGradient>
    <radialGradient id="vk-blos" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff0f4"/><stop offset=".6" stop-color="#fbc6d6"/><stop offset="1" stop-color="#f29ab6"/></radialGradient>
    <radialGradient id="vk-lamp"><stop offset="0" stop-color="#ffb070" stop-opacity=".9"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></radialGradient>`;
  let st=`<rect width="600" height="200" fill="url(#vk-sky)"/><circle cx="470" cy="108" r="100" fill="url(#vk-sun)"/><circle cx="470" cy="108" r="16" fill="#ffe7c2" ${l(1.6)}/>`,an="";
  // le mont Fuji, sommet entre les montants de 300 et 408 : large, sommet plat et son cratère, neige en coulées
  {const P=354,T=80,B=150;
    st+=`<path d="M150 ${B} C240 ${B-6} 304 ${T+30} ${P-16} ${T} L${P-10} ${T-2} L${P-4} ${T+1} L${P+2} ${T-2} L${P+8} ${T+1} L${P+16} ${T} C${P+36} ${T+30} 470 ${B-6} 560 ${B}Z" fill="url(#vk-fuji)" ${l(1.8)}/>`;
    st+=`<path d="M${P-16} ${T} C${P-22} ${T+8} ${P-27} ${T+14} ${P-32} ${T+20} Q${P-28} ${T+25} ${P-24} ${T+21} Q${P-21} ${T+30} ${P-16} ${T+22} Q${P-11} ${T+27} ${P-7} ${T+19} Q${P-2} ${T+29} ${P+3} ${T+19} Q${P+8} ${T+26} ${P+12} ${T+21} Q${P+18} ${T+30} ${P+21} ${T+21} Q${P+27} ${T+25} ${P+32} ${T+20} C${P+27} ${T+14} ${P+22} ${T+8} ${P+16} ${T} L${P+8} ${T+1} L${P+2} ${T-2} L${P-4} ${T+1} L${P-10} ${T-2}Z" fill="#fffaf6" ${l(1.4)}/>`
      +`<path d="M${P-6} ${T+5} Q${P-8} ${T+11} ${P-11} ${T+18} M${P+8} ${T+5} Q${P+10} ${T+11} ${P+14} ${T+17}" stroke="#dfe2f2" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    st+=`<path d="M250 ${T+40} Q290 ${T+32} 330 ${T+38} Q370 ${T+30} 420 ${T+38} Q380 ${T+46} 320 ${T+44} Q280 ${T+48} 250 ${T+40}Z" fill="#fff" opacity=".7"/>`}
  st+=vwMist(118,36,.75,"vk-mist");
  // les collines bleutées de Higashiyama
  st+=`<path d="M0 140 Q60 112 130 120 Q190 108 250 130 Q320 120 400 134 Q470 118 600 130 V160 H0Z" fill="url(#vk-far)"/>`;
  for(let i=0;i<30;i++){const x=60+R()*480,y=128+R()*16;st+=`<path d="M${vwF(x)} ${vwF(y-6)} L${vwF(x-3)} ${vwF(y+1)} H${vwF(x+3)}Z" fill="#8aa2b8" opacity=".8"/>`}
  // la colline boisée et la pagode rouge (entre 84 et 192)
  st+=`<path d="M70 156 Q100 126 150 124 Q196 126 222 156Z" fill="url(#vk-h1)" ${l(1.6)}/>`;
  st+=vwLeaves([[92,148,8],[106,140,9],[196,142,8],[208,150,7],[122,134,7],[180,135,7]],"vk-pine","#d8f0d0");
  st+=vwPut(150,138,.38,kyPagoda(0,0));
  // le lac, ses reflets, le grand torii dans l'eau (entre 408 et 516)
  st+=`<rect x="0" y="156" width="600" height="22" fill="url(#vk-lake)"/><path d="M0 156 H600" stroke="${INK}" stroke-width="1.4"/>`;
  st+=`<path d="M300 158 L326 176 H382 L408 158Z" fill="#fff" opacity=".25"/><path d="M148 158 l-10 10 h20Z" fill="#c0503c" opacity=".25"/>`;
  {const x=462,y=174,w=26,h=40;st+=`<path d="M${x-w*.7} ${y} V${y-h}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${x+w*.7} ${y} V${y-h}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${x-w*.7} ${y} V${y-h}" stroke="#d8452f" stroke-width="4.4"/><path d="M${x+w*.7} ${y} V${y-h}" stroke="#d8452f" stroke-width="4.4"/>`
      +`<rect x="${x-w*.95}" y="${y-h+6}" width="${w*1.9}" height="4.6" rx="1" fill="#d8452f" ${l(1.4)}/><path d="M${x-w*1.15} ${y-h-2} Q${x} ${y-h+3} ${x+w*1.15} ${y-h-2} L${x+w*1.05} ${y-h-7} Q${x} ${y-h-2} ${x-w*1.05} ${y-h-7}Z" fill="#3a3030" ${l(1.4)}/><path d="M${x-w*1.02} ${y-h-1.6} Q${x} ${y-h+2.6} ${x+w*1.02} ${y-h-1.6}" stroke="#d8452f" stroke-width="2.2" fill="none"/>`
      +`<path d="M${x-w*.7} ${y+1} V${y+10} M${x+w*.7} ${y+1} V${y+10}" stroke="#d8452f" stroke-width="4" opacity=".3"/>`}
  st+=vwPut(398,170,.5,kyBoat?kyBoat(0,0):"");
  // la rive de ce côté : la véranda de bois, une lanterne de pierre, des bambous
  st+=`<rect x="0" y="178" width="600" height="22" fill="url(#vk-wood)" ${l(2)}/>`+Array.from({length:30},(_,i)=>`<path d="M${i*20} 178 V200" stroke="#5e3a26" stroke-width="1.2" opacity=".6"/>`).join("")+`<path d="M0 182 H600" stroke="#c99a72" stroke-width="1.4" opacity=".7"/>`;
  st+=`<path d="M0 176 H600" ${l(3)}/><path d="M0 176 H600" stroke="#c0503c" stroke-width="1.4"/>`;
  st+=vwPut(258,192,.8,kyToro(0,0));
  st+=[96,104,112,500,508].map((x,i)=>`<path d="M${x} 196 V${110+i*6}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${x} 196 V${110+i*6}" stroke="#8cc48a" stroke-width="3"/>`+[0,1,2,3,4].map(j=>`<path d="M${x-2.4} ${186-j*16} h4.8" stroke="${INK}" stroke-width="1"/>`).join("")
    +`<path d="M${x} ${124+i*6} q${i%2?8:-8} -2 ${i%2?14:-14} 4 q${i%2?-8:8} 0 ${i%2?-14:14} -4Z" fill="#8cc48a" ${l(.9)}/>`).join("");
  // la branche de cerisier qui entre par le haut à gauche, les lanternes de papier en haut à droite
  st+=`<path d="M84 26 Q110 34 140 32 Q170 30 196 46 M128 33 Q140 46 150 56" fill="none" stroke="#6a4a3a" stroke-width="3.4" stroke-linecap="round"/>`
    +vwLeaves([[92,30,9],[108,36,10],[124,30,8],[140,38,9],[158,34,8],[176,42,8],[192,50,6],[146,52,7],[154,60,5],[100,46,6],[118,46,6]],"vk-blos","#fff")
    +[[96,28],[112,40],[134,34],[150,44],[170,38],[186,48],[148,58]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.3" fill="#e2547a"/>`).join("");
  st+=`<path d="M408 30 Q462 44 516 30" fill="none" stroke="${INK}" stroke-width="1.4"/>`+[[424,36],[446,40],[468,40],[490,37],[510,33]].map(([x,y],i)=>`<circle cx="${x}" cy="${y+8}" r="12" fill="url(#vk-lamp)"/><path d="M${x} ${y} V${y+2}" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${x}" cy="${y+8}" rx="5" ry="6.4" fill="${i%2?"#f2e6c8":"#e85a44"}" ${l(1.2)}/><path d="M${x-3.4} ${y+4} H${x+3.4} M${x-4.4} ${y+8} H${x+4.4} M${x-3.4} ${y+12} H${x+3.4}" stroke="${INK}" stroke-width=".6" opacity=".5"/><rect x="${x-2.4}" y="${y+1.6}" width="4.8" height="1.6" fill="#3a3030"/><rect x="${x-2.4}" y="${y+13.4}" width="4.8" height="1.6" fill="#3a3030"/>`).join("");
  // pétales qui tombent, nuages, oiseaux, reflets sur le lac
  an+=[[120,40,8],[170,50,10],[140,60,9],[230,30,11],[200,70,12],[110,80,10]].map(([x,y,d],i)=>`<g><animateTransform attributeName="transform" type="translate" values="0 0;90 140" dur="${d}s" begin="${-i*1.6}s" repeatCount="indefinite"/><path d="M${x} ${y} q3 -3 6 0 q-3 3 -6 0Z" fill="#f6a8be"/></g>`).join("");
  an+=vwCloud(220,46,.9,26,"#fff6f4","#f0d4dc")+vwCloud(500,64,.6,30,"#fff6f4","#f0d4dc");
  an+=vwBirds(80,26,6);
  an+=[[120,162],[200,168],[280,164],[350,170],[420,163],[520,167]].map(([x,y],i)=>`<path d="M${x-7} ${y} h14" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;.85;0" dur="${2.6+i%3*.6}s" begin="${-i*.7}s" repeatCount="indefinite"/></path>`).join("");
  return {defs,st,an};
}
