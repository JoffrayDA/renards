/* Café Frimousse : dessins ajoutés à la carte de Kyoto le 20/11/2026 (Joffray : « je veux qu'on se croie au Japon de l'ancien
   temps, des temples japonais, des statues, un terrain de sumo, fais-moi rêver »). Chargé juste après kyoto.js ; posés par
   kyMapSVG. Les dégradés « ky-… » (bois, toit, rouge, or) sont dans KY_DEFS. */

// un renard du jeu dessiné dans la carte (les sumos sur leur terrain)
const kyFoxIn=(f,x,y,w,o={})=>foxArt(f,o).replace("<svg ",`<svg x="${(x-w/2).toFixed(1)}" y="${(y-w*.97).toFixed(1)}" width="${w}" height="${(w*.97).toFixed(1)}" `);

// le terrain de sumo (dohyō) : la butte d'argile, le cercle de bottes de paille, les deux lignes blanches, le toit suspendu
// à la façon d'un sanctuaire avec ses quatre glands de couleur ; Chanko et Ōyama face à face, et le sel qui vole
const kyDohyo=(x,y)=>{let g=shadow(x,y,62);const T=y-16;
  g+=`<path d="M${x-56} ${y} L${x-46} ${T} H${x+46} L${x+56} ${y}Z" fill="#c9a074" ${BO}/>`+[-36,-12,12,36].map(a=>`<path d="M${x+a} ${y-1} l${a/12} ${-14}" stroke="#b08a60" stroke-width="1.2"/>`).join("");
  g+=`<path d="M${x-46} ${T} H${x+46} L${x+36} ${T-20} H${x-36}Z" fill="#e8cfa2" ${BO}/>`;
  g+=`<ellipse cx="${x}" cy="${T-10}" rx="34" ry="8.4" fill="none" stroke="#e6d58a" stroke-width="4"/><ellipse cx="${x}" cy="${T-10}" rx="34" ry="8.4" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="5 2"/>`;
  g+=`<path d="M${x-8} ${T-12} v4 M${x+8} ${T-12} v4" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`;
  // les deux lutteurs
  if(typeof FOX!=="undefined"&&FOX.chanko)g+=kyFoxIn(FOX.chanko,x-17,T-6,34,{pose:"happy"})+`<g transform="translate(${2*(x+17)} 0) scale(-1 1)">${kyFoxIn(FOX.oyama,x+17,T-6,36,{pose:"happy"})}</g>`;
  // le sel qu'on lance avant le combat
  g+=`<g fill="#fff">${[[-4,-46],[2,-52],[6,-44],[-1,-40]].map(([a,b],i)=>`<circle cx="${x+a}" cy="${T+b}" r="1.6"><animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="${i*.3}s" repeatCount="indefinite"/></circle>`).join("")}</g>`;
  // le toit suspendu (tsuriyane) et ses glands : vert, rouge, blanc, noir
  const R=T-74;
  g+=[-1,1].map(s=>`<path d="M${x+s*30} ${R+6} L${x+s*34} ${T-30}" stroke="#7a5638" stroke-width="1" stroke-dasharray="2 3"/>`).join("");
  g+=`<path d="M${x-48} ${R+6} Q${x} ${R-2} ${x+48} ${R+6} L${x+40} ${R-8} H${x-40}Z" fill="url(#ky-roof)" ${BO}/><path d="M${x-30} ${R-8} L${x} ${R-24} L${x+30} ${R-8}Z" fill="url(#ky-wood)" ${BO2}/>`
    +`<path d="M${x-6} ${R-22} L${x-10} ${R-32} M${x+6} ${R-22} L${x+10} ${R-32}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M${x-44} ${R+4} H${x+44}" stroke="#a87ac0" stroke-width="3"/>`;
  g+=[[-44,"#4f9a6a"],[-24,"#e0503c"],[24,"#fffaf2"],[44,"#3a3a44"]].map(([a,c])=>`<path d="M${x+a} ${R+5} v8" stroke="${INK}" stroke-width="1"/><path d="M${x+a-3} ${R+13} h6 l-1 9 h-4Z" fill="${c}" stroke="${INK}" stroke-width="1.1"/>`).join("");
  return g};

// le château (comme celui de Himeji) : remparts de pierre en pente, donjon blanc à trois étages, toits sombres
// retroussés avec leurs pignons, et les deux poissons d'or (shachihoko) sur le faîte
const kyCastle=(x,y,k=1)=>{let g=shadow(x,y,62*k);const f=n=>+n.toFixed(1),X=a=>f(x+a*k),Y=b=>f(y-b*k);
  g+=`<path d="M${X(-60)} ${Y(0)} Q${X(-52)} ${Y(14)} ${X(-44)} ${Y(30)} H${X(44)} Q${X(52)} ${Y(14)} ${X(60)} ${Y(0)}Z" fill="#b8b2a8" ${BO}/>`
    +[[-40,8],[-18,6],[6,10],[30,5],[-30,20],[-4,22],[20,18],[44,12]].map(([a,b])=>`<path d="M${X(a)} ${Y(b)} h${f(10*k)}" stroke="#8f887e" stroke-width="1.2"/>`).join("");
  const tier=(w,b,h,roofW)=>`<rect x="${X(-w/2)}" y="${Y(b+h)}" width="${f(w*k)}" height="${f(h*k)}" fill="#fbf8f0" ${BO2}/>`
    +[-w/4,w/4].map(a=>`<rect x="${X(a-3)}" y="${Y(b+h*.75)}" width="${f(6*k)}" height="${f(h*.4*k)}" fill="#3a3a44"/>`).join("")
    +`<path d="M${X(-roofW/2)} ${Y(b+h-2)} Q${X(-roofW/2+6)} ${Y(b+h+2)} ${X(-roofW/2+10)} ${Y(b+h+6)} H${X(roofW/2-10)} Q${X(roofW/2-6)} ${Y(b+h+2)} ${X(roofW/2)} ${Y(b+h-2)} L${X(roofW/2-14)} ${Y(b+h+12)} H${X(-roofW/2+14)}Z" fill="url(#ky-roof)" ${BO2}/>`
    +`<path d="M${X(-8)} ${Y(b+h+6)} L${X(0)} ${Y(b+h+14)} L${X(8)} ${Y(b+h+6)}Z" fill="#fbf8f0" stroke="${INK}" stroke-width="1.4"/>`;
  g+=tier(78,30,22,98)+tier(58,62,20,76)+tier(40,94,18,56);
  g+=`<path d="M${X(-14)} ${Y(124)} Q${X(0)} ${Y(136)} ${X(14)} ${Y(124)}" fill="url(#ky-roof)" ${BO2}/>`+[-12,12].map(a=>`<path d="M${X(a)} ${Y(126)} q${f(-a/6*k)} ${f(-8*k)} ${f(a/4*k)} ${f(-10*k)}" stroke="#f2c45a" stroke-width="${f(3*k)}" fill="none" stroke-linecap="round"/>`).join("");
  return g};

// le grand Bouddha de bronze (comme celui de Kamakura) : assis sur un lotus, les yeux mi-clos, la tête bouclée ;
// un brûle-parfum devant, dont la fumée monte
const kyDaibutsu=(x,y)=>{let g=shadow(x,y,48);const B="#7fa898",B2="#5f8a7a";
  g+=`<rect x="${x-44}" y="${y-12}" width="88" height="12" rx="2" fill="#b8b2a8" ${BO2}/>`;
  g+=[-34,-17,0,17,34].map(a=>`<path d="M${x+a-11} ${y-12} Q${x+a} ${y-30} ${x+a+11} ${y-12}Z" fill="#f2b8c6" ${K2}/>`).join("");
  g+=`<path d="M${x-40} ${y-14} Q${x-44} ${y-34} ${x-24} ${y-40} Q${x} ${y-46} ${x+24} ${y-40} Q${x+44} ${y-34} ${x+40} ${y-14}Z" fill="${B}" ${BO}/>`;
  g+=`<path d="M${x-28} ${y-38} Q${x-30} ${y-70} ${x-14} ${y-78} H${x+14} Q${x+30} ${y-70} ${x+28} ${y-38}Z" fill="${B}" ${BO}/><path d="M${x-12} ${y-74} Q${x} ${y-56} ${x+12} ${y-74}" stroke="${B2}" stroke-width="1.6" fill="none"/>`;
  g+=`<ellipse cx="${x}" cy="${y-40}" rx="16" ry="6" fill="${B2}" ${BO2}/><path d="M${x-8} ${y-42} q8 -5 16 0" stroke="${INK}" stroke-width="1.2" fill="none"/>`;
  g+=`<ellipse cx="${x}" cy="${y-92}" rx="16" ry="18" fill="${B}" ${BO}/><path d="M${x-16} ${y-90} q-4 10 0 14 M${x+16} ${y-90} q4 10 0 14" stroke="${INK}" stroke-width="2" fill="${B}"/>`
    +Array.from({length:9},(_,i)=>`<circle cx="${x-12+i*3}" cy="${y-104+Math.abs(i-4)*.8}" r="2.2" fill="${B2}" stroke="${INK}" stroke-width=".8"/>`).join("")
    +`<ellipse cx="${x}" cy="${y-112}" rx="7" ry="4.4" fill="${B2}" ${K2}/>`
    +`<path d="M${x-9} ${y-92} q3 2 6 0 M${x+3} ${y-92} q3 2 6 0" stroke="${INK}" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M${x-3} ${y-82} q3 1.6 6 0" stroke="${INK}" stroke-width="1.2" fill="none"/><circle cx="${x}" cy="${y-98}" r="1.2" fill="${B2}"/>`;
  // le brûle-parfum et sa fumée
  g+=`<rect x="${x+46}" y="${y-14}" width="18" height="14" rx="3" fill="#6a6a6a" ${BO2}/><path d="M${x+44} ${y-14} h22" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
    +`<path d="M${x+55} ${y-16} q-6 -8 0 -16 q6 -8 0 -16" stroke="#c9c3cc" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"><animate attributeName="opacity" values=".2;.8;.2" dur="3s" repeatCount="indefinite"/></path>`;
  return g};

// une rangée de petits Jizō de pierre, bonnets et bavoirs rouges, et des moulins à vent de papier
const kyJizo=(x,y,n=5)=>{let g=shadow(x,y,n*8);
  for(let i=0;i<n;i++){const a=x+(i-(n-1)/2)*14,s=i%2?.9:1;
    g+=`<path d="M${a-6*s} ${y} Q${a-7*s} ${y-14*s} ${a} ${y-15*s} Q${a+7*s} ${y-14*s} ${a+6*s} ${y}Z" fill="#c9c3b8" ${K2}/><circle cx="${a}" cy="${y-19*s}" r="${6*s}" fill="#d6d0c4" ${K2}/>`
      +`<path d="M${a-5.4*s} ${y-12*s} Q${a} ${y-6*s} ${a+5.4*s} ${y-12*s} L${a} ${y-14*s}Z" fill="#e0503c" stroke="${INK}" stroke-width="1"/><path d="M${a-5*s} ${y-21*s} Q${a} ${y-30*s} ${a+5*s} ${y-21*s}Z" fill="#e0503c" stroke="${INK}" stroke-width="1"/>`
      +`<path d="M${a-2.4*s} ${y-19*s} q1.2 1 2.4 0 M${a+.4*s} ${y-19*s} q1.2 1 2.4 0" stroke="${INK}" stroke-width=".9" fill="none"/>`}
  g+=[-1,1].map(s=>{const px=x+s*((n-1)/2*14+12);return `<path d="M${px} ${y} V${y-24}" stroke="#7a5638" stroke-width="1.6"/><g transform="translate(${px} ${y-26})"><animateTransform attributeName="transform" type="rotate" from="0 ${px} ${y-26}" to="360 ${px} ${y-26}" dur="2.4s" repeatCount="indefinite" additive="sum"/>${[0,90,180,270].map((r,i)=>`<path d="M0 0 L7 -3 L4 0Z" transform="rotate(${r})" fill="${["#f6a8be","#ffe08a","#9fd8f0","#a9cf7a"][i]}" stroke="${INK}" stroke-width=".6"/>`).join("")}</g>`}).join("");
  return g};

// le temple sur pilotis (comme le Kiyomizu-dera) : la grande salle au toit de bois sombre, colonnes vermillon,
// la terrasse de bois en avancée sur une forêt de poteaux, un cerisier en fleurs à côté
const kyKiyomizu=(x,y)=>{let g=shadow(x,y,66);const T=y-46;
  g+=Array.from({length:7},(_,i)=>`<path d="M${x-54+i*18} ${y} V${T}" stroke="#7a5638" stroke-width="4" stroke-linecap="round"/>`).join("")
    +[y-14,y-30].map(b=>`<path d="M${x-58} ${b} H${x+58}" stroke="#7a5638" stroke-width="3"/>`).join("")
    +Array.from({length:7},(_,i)=>`<path d="M${x-54+i*18} ${y} V${T}" stroke="${INK}" stroke-width=".8" opacity=".4"/>`).join("");
  g+=`<rect x="${x-62}" y="${T-6}" width="124" height="6" fill="url(#ky-wood)" ${BO2}/><path d="M${x-62} ${T-12} H${x+62}" stroke="#7a5638" stroke-width="2"/>`+Array.from({length:13},(_,i)=>`<path d="M${x-60+i*10} ${T-12} v6" stroke="#7a5638" stroke-width="1.6"/>`).join("");
  g+=`<rect x="${x-40}" y="${T-46}" width="80" height="34" fill="#f3e6cc" ${BO2}/>`+[-36,-18,0,18,36].map(a=>`<rect x="${x+a-2.4}" y="${T-46}" width="4.8" height="34" fill="url(#ky-red)" stroke="${INK}" stroke-width="1"/>`).join("")
    +[-27,-9,9,27].map(a=>`<rect x="${x+a-6}" y="${T-40}" width="12" height="16" fill="#e8d2a8" stroke="${INK}" stroke-width=".8"/><path d="M${x+a} ${T-40} v16 M${x+a-6} ${T-32} h12" stroke="#c9a874" stroke-width=".8"/>`).join("");
  g+=`<path d="M${x-66} ${T-42} Q${x-58} ${T-40} ${x-50} ${T-48} L${x-32} ${T-74} H${x+32} L${x+50} ${T-48} Q${x+58} ${T-40} ${x+66} ${T-42} Q${x} ${T-52} ${x-66} ${T-42}Z" fill="url(#ky-roof)" ${BO}/>`
    +`<path d="M${x-36} ${T-74} H${x+36}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${x-16} ${T-56} L${x} ${T-70} L${x+16} ${T-56}Z" fill="url(#ky-wood)" stroke="${INK}" stroke-width="1.4"/>`
    +[-1,1].map(s=>`<path d="M${x+s*36} ${T-74} q${s*4} -6 ${s*2} -10" stroke="#f2c45a" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join("");
  return g};
