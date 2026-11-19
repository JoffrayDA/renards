/* Café Frimousse : dessins de la carte de Kyoto (20/11/2026, Joffray : « je veux qu'on se croie au Japon de l'ancien temps,
   des temples japonais, des statues, un terrain de sumo, fais-moi rêver », puis : le Fuji, les torii sur l'eau, le Bouddha
   en or, la pagode rouge de Miyajima, une vraie forêt de bambous, et des cerisiers, des maisons, des lanternes, un pont et
   un poissonnier « 1000 fois mieux »). Chargé juste après kyoto.js ; posés par kyMapSVG. Les dégradés « ky-… » sont dans
   KY_DEFS (kyoto.js), partagés avec le défilé du Matsuri et l'écran des mondes. */
const kyF=n=>+n.toFixed(1);

// un renard du jeu dessiné dans la carte (les sumos sur leur terrain)
const kyFoxIn=(f,x,y,w,o={})=>foxArt(f,o).replace("<svg ",`<svg x="${(x-w/2).toFixed(1)}" y="${(y-w*.97).toFixed(1)}" width="${w}" height="${(w*.97).toFixed(1)}" `);

// des ronds dans l'eau qui s'élargissent
const kyRipple=(x,y,w=10,d=0)=>`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${kyF(w*.26)}" fill="none" stroke="#fff" stroke-width="1.4" opacity="0"><animate attributeName="rx" values="${kyF(w*.5)};${kyF(w*1.4)}" dur="3s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="3s" begin="${d}s" repeatCount="indefinite"/></ellipse>`;

// la lanterne de papier rouge (chōchin) : côtes, chapeaux noirs, le caractère « fête », un gland, une lueur qui respire
const kyLantern=(x,y,k=1)=>{const rx=7*k,ry=9*k;
  let g=`<circle cx="${x}" cy="${y}" r="${kyF(17*k)}" fill="url(#ky-glow)"><animate attributeName="opacity" values=".7;1;.8;1;.7" dur="3.4s" repeatCount="indefinite"/></circle>`
    +`<path d="M${x} ${kyF(y-ry-5*k)} V${kyF(y-ry)}" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${x}" cy="${y}" rx="${kyF(rx)}" ry="${kyF(ry)}" fill="url(#ky-chochin)" ${BO2}/>`;
  g+=[-.62,-.3,.3,.62].map(t=>{const c=Math.sqrt(1-t*t)*rx,yy=y+t*ry;return `<path d="M${kyF(x-c)} ${kyF(yy)} Q${x} ${kyF(yy+1.4*k)} ${kyF(x+c)} ${kyF(yy)}" stroke="#a8302a" stroke-width=".7" fill="none" opacity=".75"/>`}).join("");
  if(k>.5)g+=`<text x="${x}" y="${kyF(y+2.8*k)}" text-anchor="middle" font-family="Zen Maru Gothic,sans-serif" font-weight="900" font-size="${kyF(7.4*k)}" fill="#fff4dc">祭</text>`;
  g+=`<path d="M${kyF(x-rx*.58)} ${kyF(y-ry*.42)} Q${kyF(x-rx*.74)} ${y} ${kyF(x-rx*.58)} ${kyF(y+ry*.42)}" stroke="#ffd6bc" stroke-width="${kyF(1.4*k)}" fill="none" opacity=".75" stroke-linecap="round"/>`;
  g+=[-1,1].map(s=>`<rect x="${kyF(x-4.4*k)}" y="${kyF(y+s*ry-1.6*k)}" width="${kyF(8.8*k)}" height="${kyF(3.2*k)}" rx="1" fill="#2f2a32" stroke="${INK}" stroke-width="1"/>`).join("");
  return g+`<path d="M${x} ${kyF(y+ry+1.6*k)} v${kyF(4.6*k)}" stroke="#f2c45a" stroke-width="${kyF(1.8*k)}" stroke-linecap="round"/>`};

// la lanterne de pierre (tōrō) : socle, fût, plateau, la chambre à feu et sa flamme qui danse, le toit retroussé, le joyau
const kyToro=(x,y)=>{let g=shadow(x,y,14);
  g+=`<path d="M${x-11} ${y} L${x-9} ${y-5} H${x+9} L${x+11} ${y}Z" fill="url(#ky-stone)" ${K2}/><rect x="${x-3.6}" y="${y-24}" width="7.2" height="19" fill="url(#ky-stone)" ${K2}/><path d="M${x-3.6} ${y-12} h7.2 M${x-3.6} ${y-17} h7.2" stroke="#a49a8a" stroke-width=".9"/>`
    +`<path d="M${x-10} ${y-24} L${x-7} ${y-29} H${x+7} L${x+10} ${y-24}Z" fill="url(#ky-stone)" ${K2}/>`;
  g+=`<circle cx="${x}" cy="${y-35}" r="15" fill="url(#ky-glow)"><animate attributeName="opacity" values=".55;1;.7;.95;.55" dur="2.2s" repeatCount="indefinite"/></circle>`
    +`<rect x="${x-7.5}" y="${y-41}" width="15" height="12" rx="1" fill="url(#ky-stone)" ${K2}/><rect x="${x-4.2}" y="${y-39}" width="8.4" height="8.4" fill="#ffcf6a" stroke="${INK}" stroke-width=".9"/>`
    +`<path d="M${x} ${y-31.4} q-2.6 -2.6 0 -6.4 q2.6 3.8 0 6.4Z" fill="#ff8a3a"><animate attributeName="opacity" values="1;.6;1;.8;1" dur="1.1s" repeatCount="indefinite"/></path>`;
  g+=`<path d="M${x-16} ${y-40} Q${x-13} ${y-42} ${x-11} ${y-46} L${x} ${y-52} L${x+11} ${y-46} Q${x+13} ${y-42} ${x+16} ${y-40} Q${x} ${y-43.6} ${x-16} ${y-40}Z" fill="url(#ky-stone)" ${K2}/>`
    +`<circle cx="${x}" cy="${y-54.6}" r="3" fill="url(#ky-stone)" ${K2}/><path d="M${x} ${y-57.6} v-2.4" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>`
    +`<ellipse cx="${x-8}" cy="${y-1.6}" rx="3" ry="1.4" fill="#9fbf7a"/><ellipse cx="${x+9}" cy="${y-42}" rx="3.4" ry="1.4" fill="#9fbf7a"/>`;
  return g};

// la maison de bois de Kyoto (machiya) : toit de tuiles et son faîtage, étage enduit à fenêtre à barreaux (mushiko-mado),
// auvent de tuiles, treillis de bois, porte au noren indigo, barrière de bambou courbée (inuyarai), une lanterne
const kyMachiya=(x,y,w,h)=>{const m=kyF(y-h*.48);let g=shadow(x+w/2,y,w*.58);
  g+=`<rect x="${x+3}" y="${kyF(y-h)}" width="${w-6}" height="${kyF(h*.54)}" fill="url(#ky-plaster)" ${BO}/><rect x="${x+3}" y="${kyF(y-h)}" width="3.4" height="${kyF(h*.54)}" fill="#6e4630"/><rect x="${x+w-6.4}" y="${kyF(y-h)}" width="3.4" height="${kyF(h*.54)}" fill="#6e4630"/>`;
  const mw=w*.6,mx=x+(w-mw)/2,my=y-h*.88,mh=h*.2,n=Math.floor((mw-2)/5);
  g+=`<rect x="${kyF(mx)}" y="${kyF(my)}" width="${kyF(mw)}" height="${kyF(mh)}" rx="1.6" fill="#3a2a24" stroke="${INK}" stroke-width="1.3"/>`+Array.from({length:n},(_,i)=>`<rect x="${kyF(mx+2+i*5)}" y="${kyF(my+1.6)}" width="2.6" height="${kyF(mh-3.2)}" rx="1" fill="#efe3c8"/>`).join("");
  const nt=Math.floor(w/6);
  g+=`<path d="M${x-7} ${kyF(y-h+3)} Q${x+w/2} ${kyF(y-h-2)} ${x+w+7} ${kyF(y-h+3)} L${x+w-1} ${kyF(y-h-14)} H${x+1}Z" fill="url(#ky-roof)" ${BO}/>`
    +Array.from({length:nt},(_,i)=>`<path d="M${kyF(x+3+i*6)} ${kyF(y-h-12)} L${kyF(x-4+i*(w+8)/nt)} ${kyF(y-h+1)}" stroke="#3e4a5e" stroke-width="1.1"/>`).join("")
    +`<rect x="${x-1}" y="${kyF(y-h-18)}" width="${w+2}" height="5" rx="2.4" fill="#3e4a5e" ${K2}/>`+Array.from({length:Math.floor((w+14)/7)},(_,i)=>`<circle cx="${kyF(x-5+i*7)}" cy="${kyF(y-h+2.6)}" r="1.5" fill="#3e4a5e" stroke="${INK}" stroke-width=".6"/>`).join("");
  g+=`<path d="M${x-5} ${kyF(m+5)} L${x+1} ${kyF(m-5)} H${x+w-1} L${x+w+5} ${kyF(m+5)}Z" fill="url(#ky-roof)" ${BO2}/>`+Array.from({length:Math.floor(w/5)},(_,i)=>`<path d="M${kyF(x+2+i*5)} ${kyF(m-4)} v8" stroke="#3e4a5e" stroke-width="1"/>`).join("");
  g+=`<rect x="${x+2}" y="${kyF(m+5)}" width="${w-4}" height="${kyF(y-m-5)}" fill="url(#ky-wood)" ${BO}/>`;
  const lx=x+5,lw=w*.5,ly=m+8,lh=y-m-12;
  g+=`<rect x="${lx}" y="${kyF(ly)}" width="${kyF(lw)}" height="${kyF(lh)}" fill="#f1dfb8" stroke="${INK}" stroke-width="1.1"/>`+Array.from({length:Math.floor(lw/3.2)},(_,i)=>`<path d="M${kyF(lx+2+i*3.2)} ${kyF(ly)} V${kyF(ly+lh)}" stroke="#5a3624" stroke-width="1.7"/>`).join("");
  const dx=x+w*.6,dw=w*.4-5;
  g+=`<rect x="${kyF(dx)}" y="${kyF(m+7)}" width="${kyF(dw)}" height="${kyF(y-m-7)}" fill="#2a1e1a" stroke="${INK}" stroke-width="1.1"/>`
    +[0,1,2].map(i=>`<path d="M${kyF(dx+i*dw/3+.5)} ${kyF(m+7)} h${kyF(dw/3-1)} v${kyF((y-m)*.42)} h${kyF(1-dw/3)}Z" fill="#3d4e7a" stroke="${INK}" stroke-width=".8"/>`).join("")
    +`<circle cx="${kyF(dx+dw/2)}" cy="${kyF(m+7+(y-m)*.2)}" r="2.6" fill="#fffaf2"/>`;
  g+=`<path d="M${x+2} ${y} Q${x+2} ${y-11} ${x+10} ${y-11} H${kyF(x+w*.56)} V${y}Z" fill="#c9a874" stroke="${INK}" stroke-width="1.1"/>`+Array.from({length:Math.floor(w*.5/3)},(_,i)=>`<path d="M${kyF(x+6+i*3)} ${y} V${y-(i?10:7)}" stroke="#9a7a4a" stroke-width=".9"/>`).join("");
  return g+kyLantern(kyF(dx-2.6),kyF(m+15),.6)};

// le cerisier de la carte (20/11/2026, choix de Joffray sur tools/cerisiers.html : « du B et du D, un peu plus de D ») :
// le tronc noueux qui penche, des étages plats et pâles dessous (B), de gros nuages de fleurs touffus dessus (D) ;
// un sur deux est retourné pour que la carte ne répète pas le même arbre
const kySakura=(x,y,k=1)=>{const g=kySakuraG(x,y,k);return Math.round(x)%2?`<g transform="translate(${2*x} 0) scale(-1 1)">${g}</g>`:g};
// le stand de pêche aux poissons rouges (kingyo-sukui) : comptoir, grand bac où nagent les poissons, épuisettes de papier,
// sachets d'eau suspendus avec leur poisson, auvent rayé rouge et blanc, enseigne et deux lanternes
const kyKingyo=(x,y)=>{let g=shadow(x,y,42);
  g+=`<path d="M${x-31} ${y} V${y-56} M${x+31} ${y} V${y-56}" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/><path d="M${x-31} ${y} V${y-56} M${x+31} ${y} V${y-56}" stroke="#9a6a46" stroke-width="2.4"/>`;
  g+=`<path d="M${x-31} ${y-44} H${x+31}" stroke="#6e4630" stroke-width="1.8"/>`+[-19,-7,7,19].map((a,i)=>`<path d="M${x+a} ${y-44} v3" stroke="${INK}" stroke-width=".8"/><path d="M${x+a-1.8} ${y-41} q-3.6 3 -2.2 7.4 q1.4 2.6 4 2.6 q2.6 0 4 -2.6 q1.4 -4.4 -2.2 -7.4Z" fill="#e2f4fb" fill-opacity=".9" stroke="${INK}" stroke-width=".8"/><path d="M${x+a-1.8} ${y-35} q1.8 -1.3 3.6 0 q-1.8 1.3 -3.6 0Z M${x+a+1.8} ${y-35} l1.6 -1.2 v2.4Z" fill="${["#f06a2c","#e8433a","#f6a23a","#f06a2c"][i]}"/>`).join("");
  g+=`<rect x="${x-35}" y="${y-16}" width="70" height="16" rx="2" fill="url(#ky-wood)" ${BO}/>`+[1,2,3].map(i=>`<path d="M${x-35+i*17.5} ${y-15} V${y-1}" stroke="#5a3624" stroke-width="1"/>`).join("")
    +`<rect x="${x-24}" y="${y-11}" width="48" height="7" rx="1.4" fill="#fff6e4" stroke="${INK}" stroke-width="1"/><text x="${x}" y="${y-5.6}" text-anchor="middle" font-family="Zen Maru Gothic,sans-serif" font-weight="900" font-size="5.4" fill="#e0503c">きんぎょすくい</text>`;
  g+=`<ellipse cx="${x}" cy="${y-17}" rx="31" ry="8" fill="#4f8ccc" ${BO2}/><ellipse cx="${x}" cy="${y-17.8}" rx="27.4" ry="5.8" fill="url(#ky-water)"/><path d="M${x-18} ${y-20} q4 -1.4 8 0 M${x+8} ${y-15.6} q4 -1.4 8 0" stroke="#fff" stroke-width=".9" fill="none" opacity=".8"/>`;
  g+=[[-15,-18,"#f06a2c",0],[-3,-16,"#e8433a",1],[9,-19.4,"#f6a23a",2],[17,-16.4,"#3a3040",3],[-21,-16,"#fff2e0",4],[3,-20,"#f06a2c",5]].map(([a,b,c,i])=>`<g><animateTransform attributeName="transform" type="translate" values="0 0;${i%2?3:-3} -.6;0 0;${i%2?-3:3} .6;0 0" dur="${kyF(2.4+i*.37)}s" repeatCount="indefinite"/><path d="M${x+a} ${y+b} q2.4 -1.7 5 0 q-2.6 1.7 -5 0Z" fill="${c}" stroke="${INK}" stroke-width=".6"/><path d="M${x+a+4.8} ${y+b} l2.6 -1.8 v3.6Z" fill="${c}" stroke="${INK}" stroke-width=".5"/></g>`).join("");
  g+=`<path d="M${x+20} ${y-21} l8 -10" stroke="#e0503c" stroke-width="1.7" stroke-linecap="round"/><circle cx="${x+29.6}" cy="${y-33}" r="3.6" fill="#fff" fill-opacity=".75" stroke="${INK}" stroke-width=".9"/><path d="M${x-26} ${y-21} l-4 -8" stroke="#3d6ab0" stroke-width="1.7" stroke-linecap="round"/><circle cx="${x-30.6}" cy="${y-31.6}" r="3.4" fill="#fff" fill-opacity=".75" stroke="${INK}" stroke-width=".9"/>`;
  g+=`<path d="M${x-41} ${y-52} L${x-34} ${y-67} H${x+34} L${x+41} ${y-52}Z" fill="#fff6ea"/>`+Array.from({length:8},(_,i)=>i%2?"":`<path d="M${kyF(x-34+i*8.5)} ${y-67} H${kyF(x-34+(i+1)*8.5)} L${kyF(x-41+(i+1)*10.25)} ${y-52} H${kyF(x-41+i*10.25)}Z" fill="#e0503c"/>`).join("")
    +`<path d="M${x-41} ${y-52} L${x-34} ${y-67} H${x+34} L${x+41} ${y-52}Z" fill="none" ${BO}/>`
    +Array.from({length:8},(_,i)=>`<path d="M${kyF(x-41+i*10.25)} ${y-52} q5.1 6 10.25 0" fill="${i%2?"#fff6ea":"#e0503c"}" stroke="${INK}" stroke-width="1.3"/>`).join("");
  g+=`<path d="M${x-8} ${y-67} V${y-71} M${x+8} ${y-67} V${y-71}" stroke="${INK}" stroke-width="1.4"/><rect x="${x-15}" y="${y-82}" width="30" height="12" rx="2" fill="#fff6ea" ${BO2}/><text x="${x}" y="${y-73}" text-anchor="middle" font-family="Zen Maru Gothic,sans-serif" font-weight="900" font-size="8.4" fill="#e0503c">金魚</text>`;
  return g+kyLantern(x-41,y-44,.5)+kyLantern(x+41,y-44,.5)};

// le pont rouge en dos d'âne (taikobashi) : tablier épais, piles dans l'eau, garde-corps à poteaux, pommeaux dorés,
// et son reflet
const kyBridge=(x,y)=>{const q=(t,x0,y0,cx,cy,x1,y1)=>[(1-t)*(1-t)*x0+2*t*(1-t)*cx+t*t*x1,(1-t)*(1-t)*y0+2*t*(1-t)*cy+t*t*y1];
  let g=`<path d="M${x-54} ${y+14} Q${x} ${y+50} ${x+54} ${y+14}" fill="none" stroke="#e0503c" stroke-width="7" opacity=".22"/>`;
  g+=[-30,30].map(a=>`<rect x="${x+a-3.4}" y="${y-6}" width="6.8" height="20" fill="#6e4630" stroke="${INK}" stroke-width="1.3"/>`).join("")+kyRipple(x-30,y+14,8)+kyRipple(x+30,y+14,8,1.5);
  g+=`<path d="M${x-56} ${y+10} Q${x} ${y-40} ${x+56} ${y+10} L${x+52} ${y+17} Q${x} ${y-27} ${x-52} ${y+17}Z" fill="url(#ky-red)" ${BO}/><path d="M${x-53} ${y+13.6} Q${x} ${y-33.6} ${x+53} ${y+13.6}" fill="none" stroke="#a8322a" stroke-width="1" stroke-dasharray="3 3"/>`;
  g+=[.05,.19,.34,.5,.66,.81,.95].map(t=>{const [a,b]=q(t,x-56,y+10,x,y-40,x+56,y+10),[c,d]=q(t,x-54,y-4,x,y-54,x+54,y-4);return `<path d="M${kyF(a)} ${kyF(b)} L${kyF(c)} ${kyF(d)}" stroke="${INK}" stroke-width="4"/><path d="M${kyF(a)} ${kyF(b)} L${kyF(c)} ${kyF(d)}" stroke="#e0503c" stroke-width="2.2"/>`}).join("");
  g+=`<path d="M${x-55} ${y+3} Q${x} ${y-47} ${x+55} ${y+3}" fill="none" stroke="${INK}" stroke-width="2.6"/><path d="M${x-55} ${y+3} Q${x} ${y-47} ${x+55} ${y+3}" fill="none" stroke="#e0503c" stroke-width="1.2"/>`
    +`<path d="M${x-54} ${y-4} Q${x} ${y-54} ${x+54} ${y-4}" fill="none" stroke="${INK}" stroke-width="5"/><path d="M${x-54} ${y-4} Q${x} ${y-54} ${x+54} ${y-4}" fill="none" stroke="#e0503c" stroke-width="3"/>`;
  return g+[.05,.95].map(t=>{const [c,d]=q(t,x-54,y-4,x,y-54,x+54,y-4);return `<circle cx="${kyF(c)}" cy="${kyF(d-3)}" r="3.2" fill="#f2c45a" stroke="${INK}" stroke-width="1.1"/><path d="M${kyF(c)} ${kyF(d-6.2)} v-2.6" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"/>`}).join("")};

// la pagode rouge à cinq étages (comme celle de Miyajima) : socle de pierre, étages vermillon aux fenêtres blanches,
// consoles claires, toits sombres aux pointes relevées et clochettes d'or, la flèche à neuf anneaux
const kyPagoda=(x,y,k=1)=>{const X=a=>kyF(x+a*k),Yy=b=>kyF(y-b*k);let g=shadow(x,y,40*k);
  g+=`<path d="M${X(-31)} ${Yy(0)} L${X(-27)} ${Yy(8)} H${X(27)} L${X(31)} ${Yy(0)}Z" fill="url(#ky-stone)" ${K2}/><path d="M${X(-6)} ${Yy(0)} v${kyF(-8*k)} M${X(6)} ${Yy(0)} v${kyF(-8*k)}" stroke="#a49a8a" stroke-width=".9"/>`;
  let b=8;
  for(let i=0;i<5;i++){const bw=25-i*2.6,hh=i?13:17,rw=37-i*3.6;
    g+=`<rect x="${X(-bw/2)}" y="${Yy(b+hh)}" width="${kyF(bw*k)}" height="${kyF(hh*k)}" fill="url(#ky-verm)" ${K2}/>`;
    g+=(i?[-bw/4,bw/4]:[-bw/3,bw/3]).map(a=>`<rect x="${X(a-2.3)}" y="${Yy(b+hh*.82)}" width="${kyF(4.6*k)}" height="${kyF(hh*.56*k)}" fill="#f8efe0" stroke="${INK}" stroke-width=".8"/><path d="M${X(a)} ${Yy(b+hh*.82)} v${kyF(hh*.56*k)}" stroke="#c8402a" stroke-width=".7"/>`).join("");
    if(!i)g+=`<rect x="${X(-3.4)}" y="${Yy(b+hh*.86)}" width="${kyF(6.8*k)}" height="${kyF(hh*.86*k)}" fill="#7a2a22" stroke="${INK}" stroke-width=".9"/>`;
    if(i)g+=`<path d="M${X(-bw/2-3)} ${Yy(b+2.6)} H${X(bw/2+3)}" stroke="${INK}" stroke-width="${kyF(2.8*k)}"/><path d="M${X(-bw/2-3)} ${Yy(b+2.6)} H${X(bw/2+3)}" stroke="#d8452f" stroke-width="${kyF(1.4*k)}"/>`;
    const t=b+hh;
    g+=`<rect x="${X(-bw/2-2)}" y="${Yy(t+3)}" width="${kyF((bw+4)*k)}" height="${kyF(3*k)}" fill="#f6ead2" stroke="${INK}" stroke-width=".9"/>`+[0,1,2,3,4].map(j=>`<rect x="${X(-bw/2+j*bw/4-1)}" y="${Yy(t+2.6)}" width="${kyF(2*k)}" height="${kyF(2.2*k)}" fill="#d8452f"/>`).join("");
    const r=t+3;
    g+=`<path d="M${X(-rw+2)} ${Yy(r+2.6)} Q${X(-rw*.55)} ${Yy(r-2.2)} ${X(0)} ${Yy(r-2.2)} Q${X(rw*.55)} ${Yy(r-2.2)} ${X(rw-2)} ${Yy(r+2.6)}" stroke="#f6ead2" stroke-width="${kyF(1.6*k)}" fill="none"/>`
      +`<path d="M${X(-rw)} ${Yy(r+4.4)} Q${X(-rw*.55)} ${Yy(r-1)} ${X(0)} ${Yy(r-1)} Q${X(rw*.55)} ${Yy(r-1)} ${X(rw)} ${Yy(r+4.4)} L${X(rw*.62)} ${Yy(r+8.4)} Q${X(0)} ${Yy(r+5.4)} ${X(-rw*.62)} ${Yy(r+8.4)}Z" fill="url(#ky-dark)" ${K2}/>`
      +`<path d="M${X(-rw*.62)} ${Yy(r+8.4)} Q${X(0)} ${Yy(r+5.4)} ${X(rw*.62)} ${Yy(r+8.4)}" stroke="#7a6a66" stroke-width="${kyF(.9*k)}" fill="none"/>`
      +[-1,1].map(s=>`<path d="M${X(s*rw)} ${Yy(r+4.4)} v${kyF(2.8*k)}" stroke="${INK}" stroke-width=".8"/><circle cx="${X(s*rw)}" cy="${Yy(r+.8)}" r="${kyF(1.4*k)}" fill="#f2c45a" stroke="${INK}" stroke-width=".6"/>`).join("");
    b=r+6}
  g+=`<rect x="${X(-5)}" y="${Yy(b+3)}" width="${kyF(10*k)}" height="${kyF(4*k)}" fill="#3a3030" stroke="${INK}" stroke-width=".9"/><path d="M${X(0)} ${Yy(b+2)} V${Yy(b+40)}" stroke="${INK}" stroke-width="${kyF(3.6*k)}"/><path d="M${X(0)} ${Yy(b+2)} V${Yy(b+40)}" stroke="#4a3c3a" stroke-width="${kyF(2*k)}"/>`
    +Array.from({length:9},(_,i)=>`<ellipse cx="${X(0)}" cy="${Yy(b+7+i*3.3)}" rx="${kyF((4.2-i*.18)*k)}" ry="${kyF(1.1*k)}" fill="#5a4a48" stroke="${INK}" stroke-width=".6"/>`).join("")
    +`<path d="M${X(0)} ${Yy(b+49)} q${kyF(3*k)} ${kyF(4*k)} 0 ${kyF(8*k)} q${kyF(-3*k)} ${kyF(-4*k)} 0 ${kyF(-8*k)}Z" fill="#f2c45a" stroke="${INK}" stroke-width=".8"/>`;
  return g};

// une tige de bambou de la forêt : nœuds, reflet, feuilles en éventail près du haut
const kyStalk=(x,y,h,s)=>{const w=4.4+(s*7%3)*.8,lean=((s*13)%7-3)*.9,tx=kyF(x+lean),c=["#9ccf72","#86c066","#b2d88a","#7ab65a"][s%4];
  let g=`<ellipse cx="${x}" cy="${y}" rx="${kyF(w+3)}" ry="2" fill="#5b4250" opacity=".14"/><path d="M${x} ${y} L${tx} ${kyF(y-h)}" stroke="${INK}" stroke-width="${kyF(w+2.4)}" stroke-linecap="round"/><path d="M${x} ${y} L${tx} ${kyF(y-h)}" stroke="${c}" stroke-width="${kyF(w)}" stroke-linecap="round"/>`;
  for(let j=1;j<6;j++){const t=j/6;g+=`<path d="M${kyF(x+lean*t-w/2-.6)} ${kyF(y-h*t)} h${kyF(w+1.2)}" stroke="#4f7a3a" stroke-width="1.3"/>`}
  g+=`<path d="M${kyF(x-w*.22)} ${y-3} L${kyF(tx-w*.22)} ${kyF(y-h+3)}" stroke="#e6f4cc" stroke-width="1" opacity=".75"/>`;
  return g+[[.58,1],[.74,-1],[.88,1],[.97,-1]].map(([t,d])=>{const lx=kyF(x+lean*t),ly=kyF(y-h*t);return `<path d="M${lx} ${ly} q${d*9} -6 ${d*18} -2 q${-d*7} 3.6 ${-d*18} 2Z M${lx} ${ly} q${d*7} -10 ${d*14} -12 q${-d*4} 6 ${-d*14} 12Z" fill="${s%2?"#86c066":"#9ccf72"}" stroke="${INK}" stroke-width="1"/>`}).join("")};

// le terrain de sumo (dohyō) : la butte d'argile et ses marches de paille, le cercle de bottes de paille, les lignes blanches,
// quatre piliers aux couleurs des saisons, le toit de sanctuaire, le rideau violet, deux bannières ; Chanko et Ōyama face
// à face, à la même taille, et le sel qui vole
const kyDohyo=(x,y)=>{let g=shadow(x,y,72);const T=y-18,R=T-86;
  g+=[[-70,"#e0503c","#fff2c8"],[70,"#3d6ab0","#fff"]].map(([a,c,c2])=>{const fx=a<0?x+a-13:x+a;return `<path d="M${x+a} ${y+2} V${R-8}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M${x+a} ${R-6} H${a<0?x+a-14:x+a+14}" stroke="${INK}" stroke-width="2"/><rect x="${fx}" y="${R-6}" width="13" height="56" fill="${c}" ${BO2}/><path d="M${fx+3} ${R+4} v38 M${fx+10} ${R+4} v38" stroke="${c2}" stroke-width="1.6" stroke-dasharray="5 3"/><circle cx="${fx+6.5}" cy="${R+42}" r="3" fill="${c2}"/>`}).join("");
  g+=`<path d="M${x-60} ${y} L${x-50} ${T} H${x+50} L${x+60} ${y}Z" fill="#c99a6a" ${BO}/><path d="M${x-57} ${y-6} H${x+57} M${x-54} ${y-12} H${x+54}" stroke="#b0845a" stroke-width="1.2" stroke-dasharray="9 4"/>`
    +`<rect x="${x-10}" y="${y-8}" width="20" height="8" rx="3" fill="#e6cf8a" ${K2}/><rect x="${x-8}" y="${y-14}" width="16" height="6.4" rx="3" fill="#e6cf8a" ${K2}/>`;
  g+=`<path d="M${x-50} ${T} H${x+50} L${x+41} ${T-24} H${x-41}Z" fill="#ecd6a6" ${BO}/>`;
  const pil=(px,pb,c)=>`<path d="M${px} ${pb} V${R+8}" stroke="${INK}" stroke-width="6.4"/><path d="M${px} ${pb} V${R+8}" stroke="${c}" stroke-width="4"/><path d="M${px-2.6} ${R+18} h5.2 M${px-2.6} ${pb-6} h5.2" stroke="#f2c45a" stroke-width="2"/>`;
  g+=pil(x-37,T-22,"#3a3a44")+pil(x+37,T-22,"#fffaf2");
  g+=`<ellipse cx="${x}" cy="${T-12}" rx="33" ry="8.4" fill="#f4e4bc"/><ellipse cx="${x}" cy="${T-12}" rx="33" ry="8.4" fill="none" stroke="${INK}" stroke-width="6"/><ellipse cx="${x}" cy="${T-12}" rx="33" ry="8.4" fill="none" stroke="#e8d08a" stroke-width="3.8" stroke-dasharray="7 1.4"/>`
    +`<path d="M${x-7} ${T-14} v4 M${x+7} ${T-14} v4" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
  if(typeof FOX!=="undefined"&&FOX.chanko){const eq=o=>Object.assign({},o,{scale:1.16,wide:1.24});
    g+=kyFoxIn(eq(FOX.chanko),x-16,T-7,36,{pose:"happy"})+`<g transform="translate(${2*(x+16)} 0) scale(-1 1)">${kyFoxIn(eq(FOX.oyama),x+16,T-7,36,{pose:"happy"})}</g>`}
  g+=`<g fill="#fff">${[[-4,-44],[2,-50],[6,-42],[-1,-38],[4,-54]].map(([a,b],i)=>`<circle cx="${x+a}" cy="${T+b}" r="1.6"><animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="${kyF(i*.3)}s" repeatCount="indefinite"/></circle>`).join("")}</g>`;
  g+=pil(x-49,T+1,"#4f9a6a")+pil(x+49,T+1,"#e0503c");
  g+=`<path d="M${x-60} ${R+8} Q${x} ${R+1} ${x+60} ${R+8} L${x+47} ${R-10} H${x-47}Z" fill="url(#ky-bark)" ${BO}/><path d="M${x-54} ${R+4} Q${x} ${R-2} ${x+54} ${R+4}" stroke="#b8987e" stroke-width="1" fill="none"/>`
    +`<rect x="${x-42}" y="${R-15}" width="84" height="6" rx="3" fill="#5e4638" ${BO2}/>`+[-24,-8,8,24].map(a=>`<rect x="${x+a-4.4}" y="${R-21}" width="8.8" height="5" rx="2.5" fill="#d9b07a" ${K2}/>`).join("")
    +[-1,1].map(s=>`<path d="M${x+s*40} ${R-10} L${x+s*49} ${R-28} M${x+s*46} ${R-10} L${x+s*37} ${R-28}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M${x+s*40} ${R-10} L${x+s*49} ${R-28} M${x+s*46} ${R-10} L${x+s*37} ${R-28}" stroke="#d9b07a" stroke-width="1.6" stroke-linecap="round"/>`).join("");
  g+=`<path d="M${x-56} ${R+7} Q${x} ${R+1} ${x+56} ${R+7} L${x+56} ${R+14} Q${x} ${R+8} ${x-56} ${R+14}Z" fill="#7a4aa0" ${BO2}/><path d="M${x-56} ${R+14} q14 7 28 0 q14 7 28 0 q14 7 28 0 q14 7 28 0" fill="#9a6ac0" stroke="${INK}" stroke-width="1.2"/><circle cx="${x}" cy="${R+8.6}" r="3" fill="#fff" stroke="${INK}" stroke-width=".8"/>`;
  return g};

// le château (comme celui de Himeji) : remparts de pierre en pente et leur porte, murs blancs à meurtrières et tourelle
// d'angle, donjon blanc à trois étages et rangées de fenêtres, pignons triangulaires et pignon courbe, toits sombres
// aux pointes dorées, les deux poissons d'or (shachihoko) sur le faîte, deux pins (20/11/2026, Joffray : « il manque quelque chose »)
const kyCastle=(x,y,k=1)=>{const f=kyF,X=a=>f(x+a*k),Y=b=>f(y-b*k);let g=shadow(x,y,96*k);
  g+=kyPine(X(80),Y(10),.72*k)+kyPine(X(-72),Y(12),.62*k);
  g+=[-1,1].map(s=>{const a=s*46,b=s*94,lo=Math.min(a,b),hi=Math.max(a,b);
    return `<path d="M${X(lo)} ${Y(0)} V${Y(15)} H${X(hi)} V${Y(0)}Z" fill="url(#ky-plaster)" ${BO2}/><path d="M${X(lo)} ${Y(0)} H${X(hi)} V${Y(3.4)} H${X(lo)}Z" fill="#b8b2a8" stroke="${INK}" stroke-width="1"/>`
      +`<path d="M${X(lo-3)} ${Y(15)} L${X(lo)} ${Y(21)} H${X(hi)} L${X(hi+3)} ${Y(15)}Z" fill="url(#ky-roof)" ${K2}/>`
      +[0,1,2,3].map(j=>{const c=a+s*(9+j*11);return j%2?`<path d="M${X(c-2.4)} ${Y(6)} h${f(4.8*k)} l${f(-2.4*k)} ${f(-4.4*k)}Z" fill="#3a3a44"/>`:`<rect x="${X(c-2)}" y="${Y(10)}" width="${f(4*k)}" height="${f(4*k)}" fill="#3a3a44"/>`}).join("")}).join("");
  const T=(cx,b,w,h,rw)=>`<rect x="${X(cx-w/2)}" y="${Y(b+h)}" width="${f(w*k)}" height="${f(h*k)}" fill="#fbf8f0" ${BO2}/><rect x="${X(cx-2.6)}" y="${Y(b+h*.72)}" width="${f(5.2*k)}" height="${f(h*.36*k)}" fill="#3a3a44"/>`
    +`<path d="M${X(cx-rw/2)} ${Y(b+h-1)} L${X(cx-rw/2+5)} ${Y(b+h+7)} H${X(cx+rw/2-5)} L${X(cx+rw/2)} ${Y(b+h-1)} Q${X(cx)} ${Y(b+h+2)} ${X(cx-rw/2)} ${Y(b+h-1)}Z" fill="url(#ky-roof)" ${BO2}/>`;
  g+=T(-96,15,18,16,28)+T(-96,38,11,9,19);
  g+=`<path d="M${X(-60)} ${Y(0)} Q${X(-52)} ${Y(14)} ${X(-44)} ${Y(30)} H${X(44)} Q${X(52)} ${Y(14)} ${X(60)} ${Y(0)}Z" fill="#b8b2a8" ${BO}/>`
    +[[-40,8],[-26,5],[18,6],[34,10],[-34,20],[-14,24],[20,20],[44,14],[-48,13],[2,16]].map(([a,b])=>`<path d="M${X(a)} ${Y(b)} h${f(10*k)}" stroke="#8f887e" stroke-width="1.2"/>`).join("")
    +`<path d="M${X(-9)} ${Y(0)} V${Y(13)} Q${X(0)} ${Y(19)} ${X(9)} ${Y(13)} V${Y(0)}Z" fill="#3a2a24" ${K2}/><path d="M${X(0)} ${Y(0)} V${Y(16)}" stroke="#5a3a28" stroke-width="1"/><path d="M${X(-14)} ${Y(17)} L${X(-11)} ${Y(23)} H${X(11)} L${X(14)} ${Y(17)}Z" fill="url(#ky-roof)" ${K2}/>`;
  const tier=(w,b,h,roofW,n)=>`<rect x="${X(-w/2)}" y="${Y(b+h)}" width="${f(w*k)}" height="${f(h*k)}" fill="#fbf8f0" ${BO2}/>`
    +Array.from({length:n},(_,i)=>{const a=-w/2+(i+.5)*w/n;return `<rect x="${X(a-3)}" y="${Y(b+h*.78)}" width="${f(6*k)}" height="${f(h*.44*k)}" fill="#3a3a44" stroke="#d8d2c4" stroke-width=".8"/><path d="M${X(a)} ${Y(b+h*.78)} v${f(h*.44*k)}" stroke="#8a8a92" stroke-width=".7"/>`}).join("")
    +`<path d="M${X(-w/2)} ${Y(b+3)} H${X(w/2)}" stroke="#d8d2c4" stroke-width="1.2"/>`
    +`<path d="M${X(-roofW/2)} ${Y(b+h-2)} Q${X(-roofW/2+6)} ${Y(b+h+2)} ${X(-roofW/2+10)} ${Y(b+h+6)} H${X(roofW/2-10)} Q${X(roofW/2-6)} ${Y(b+h+2)} ${X(roofW/2)} ${Y(b+h-2)} L${X(roofW/2-14)} ${Y(b+h+12)} H${X(-roofW/2+14)}Z" fill="url(#ky-roof)" ${BO2}/>`
    +[-1,1].map(s=>`<path d="M${X(s*roofW/2)} ${Y(b+h-2)} q${f(s*3*k)} ${f(-2*k)} ${f(s*2*k)} ${f(-6*k)}" stroke="#f2c45a" stroke-width="${f(2.2*k)}" fill="none" stroke-linecap="round"/>`).join("");
  const chidori=(a,b,w)=>`<path d="M${X(a-w)} ${Y(b)} L${X(a)} ${Y(b+w*.9)} L${X(a+w)} ${Y(b)}Z" fill="#fbf8f0" stroke="${INK}" stroke-width="1.4"/><path d="M${X(a-w-2)} ${Y(b-1)} L${X(a)} ${Y(b+w*.9+2)} L${X(a+w+2)} ${Y(b-1)}" fill="none" stroke="#4c5a72" stroke-width="${f(2.6*k)}" stroke-linecap="round"/><circle cx="${X(a)}" cy="${Y(b+w*.4)}" r="${f(1.6*k)}" fill="#f2c45a"/>`;
  g+=tier(78,30,22,98,5)+chidori(-36,60,8)+chidori(36,60,8);
  g+=tier(58,62,20,76,4)+`<path d="M${X(-13)} ${Y(86)} Q${X(-6)} ${Y(87)} ${X(0)} ${Y(94)} Q${X(6)} ${Y(87)} ${X(13)} ${Y(86)} L${X(13)} ${Y(84)} Q${X(0)} ${Y(86)} ${X(-13)} ${Y(84)}Z" fill="url(#ky-roof)" stroke="${INK}" stroke-width="1.4"/><path d="M${X(-9)} ${Y(86)} Q${X(0)} ${Y(87)} ${X(0)} ${Y(91)} Q${X(0)} ${Y(87)} ${X(9)} ${Y(86)}" fill="none" stroke="#f2c45a" stroke-width="1.2"/>`;
  g+=tier(40,94,18,56,3);
  g+=`<path d="M${X(-14)} ${Y(124)} Q${X(0)} ${Y(136)} ${X(14)} ${Y(124)}" fill="url(#ky-roof)" ${BO2}/>`+[-12,12].map(a=>`<path d="M${X(a)} ${Y(126)} q${f(-a/6*k)} ${f(-9*k)} ${f(a/3.6*k)} ${f(-12*k)}" stroke="${INK}" stroke-width="${f(4.6*k)}" fill="none" stroke-linecap="round"/><path d="M${X(a)} ${Y(126)} q${f(-a/6*k)} ${f(-9*k)} ${f(a/3.6*k)} ${f(-12*k)}" stroke="#f2c45a" stroke-width="${f(3*k)}" fill="none" stroke-linecap="round"/>`).join("");
  return g};

// le grand Bouddha, tout en or : la mandorle flamboyante, l'auréole, le lotus rose, des éclats qui scintillent,
// le brûle-parfum et sa fumée
const kyDaibutsu=(x,y)=>{let g=shadow(x,y,52);const B="url(#ky-gold2)",B2="#c98e2a";
  g+=`<circle cx="${x}" cy="${y-80}" r="62" fill="url(#ky-glow)" opacity=".7"/>`
    +`<path d="M${x} ${y-156} Q${x+12} ${y-150} ${x+20} ${y-140} Q${x+40} ${y-122} ${x+44} ${y-92} Q${x+48} ${y-60} ${x+34} ${y-40} H${x-34} Q${x-48} ${y-60} ${x-44} ${y-92} Q${x-40} ${y-122} ${x-20} ${y-140} Q${x-12} ${y-150} ${x} ${y-156}Z" fill="url(#ky-gold)" ${BO}/>`
    +`<path d="M${x} ${y-146} Q${x+34} ${y-122} ${x+36} ${y-86} Q${x+38} ${y-58} ${x+26} ${y-44} H${x-26} Q${x-38} ${y-58} ${x-36} ${y-86} Q${x-34} ${y-122} ${x} ${y-146}Z" fill="#fff0b8" opacity=".55"/>`
    +Array.from({length:11},(_,i)=>{const a=Math.PI*(.1+i*.08);return `<path d="M${kyF(x-Math.cos(a)*30)} ${kyF(y-90-Math.sin(a)*34)} L${kyF(x-Math.cos(a)*40)} ${kyF(y-90-Math.sin(a)*46)}" stroke="#d6a03a" stroke-width="1.4"/>`}).join("")
    +`<circle cx="${x}" cy="${y-92}" r="24" fill="#fff6d0" stroke="#d6a03a" stroke-width="2"/><circle cx="${x}" cy="${y-92}" r="19" fill="none" stroke="#f2c45a" stroke-width="1.2" stroke-dasharray="2 2.4"/>`;
  g+=`<rect x="${x-44}" y="${y-12}" width="88" height="12" rx="2" fill="url(#ky-stone)" ${BO2}/>`;
  g+=[-34,-17,0,17,34].map(a=>`<path d="M${x+a-11} ${y-12} Q${x+a} ${y-32} ${x+a+11} ${y-12}Z" fill="#f6b8c8" ${K2}/><path d="M${x+a} ${y-14} V${y-24}" stroke="#e8879f" stroke-width="1"/>`).join("");
  g+=`<path d="M${x-40} ${y-14} Q${x-44} ${y-34} ${x-24} ${y-40} Q${x} ${y-46} ${x+24} ${y-40} Q${x+44} ${y-34} ${x+40} ${y-14}Z" fill="${B}" ${BO}/><path d="M${x-30} ${y-22} Q${x} ${y-30} ${x+30} ${y-22}" stroke="${B2}" stroke-width="1.4" fill="none"/>`;
  g+=`<path d="M${x-28} ${y-38} Q${x-30} ${y-70} ${x-14} ${y-78} H${x+14} Q${x+30} ${y-70} ${x+28} ${y-38}Z" fill="${B}" ${BO}/><path d="M${x-12} ${y-74} Q${x} ${y-56} ${x+12} ${y-74}" stroke="${B2}" stroke-width="1.6" fill="none"/><path d="M${x-22} ${y-62} Q${x-18} ${y-48} ${x-8} ${y-42} M${x+22} ${y-62} Q${x+18} ${y-48} ${x+8} ${y-42}" stroke="${B2}" stroke-width="1.2" fill="none"/>`;
  g+=`<ellipse cx="${x}" cy="${y-40}" rx="16" ry="6" fill="#f2c45a" ${BO2}/><path d="M${x-8} ${y-42} q8 -5 16 0" stroke="${INK}" stroke-width="1.2" fill="none"/>`;
  g+=`<ellipse cx="${x}" cy="${y-92}" rx="16" ry="18" fill="${B}" ${BO}/><path d="M${x-16} ${y-90} q-4 10 0 14 M${x+16} ${y-90} q4 10 0 14" stroke="${INK}" stroke-width="2" fill="#f2c45a"/>`
    +Array.from({length:9},(_,i)=>`<circle cx="${x-12+i*3}" cy="${y-104+Math.abs(i-4)*.8}" r="2.2" fill="#e8b440" stroke="${INK}" stroke-width=".8"/>`).join("")
    +`<ellipse cx="${x}" cy="${y-112}" rx="7" ry="4.4" fill="#e8b440" ${K2}/>`
    +`<path d="M${x-9} ${y-92} q3 2 6 0 M${x+3} ${y-92} q3 2 6 0" stroke="${INK}" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M${x-3} ${y-82} q3 1.6 6 0" stroke="${INK}" stroke-width="1.2" fill="none"/><circle cx="${x}" cy="${y-98}" r="1.3" fill="#e2587a"/>`
    +`<path d="M${x-10} ${y-100} q-3 4 -1 10" stroke="#fff8d8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`;
  g+=[[-38,-128,0],[40,-110,.8],[-46,-70,1.6],[30,-148,2.3]].map(([a,b,d])=>`<path d="M${x+a} ${y+b-5} q1 4 5 5 q-4 1 -5 5 q-1 -4 -5 -5 q4 -1 5 -5Z" fill="#fffbe0" stroke="#d6a03a" stroke-width=".7" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="${d}s" repeatCount="indefinite"/></path>`).join("");
  g+=`<rect x="${x+48}" y="${y-14}" width="18" height="14" rx="3" fill="#7a6a5a" ${BO2}/><path d="M${x+46} ${y-14} h22" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
    +`<path d="M${x+57} ${y-16} q-6 -8 0 -16 q6 -8 0 -16" stroke="#d9d3dc" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"><animate attributeName="opacity" values=".2;.8;.2" dur="3s" repeatCount="indefinite"/></path>`;
  return g};

// une rangée de petits Jizō de pierre, bonnets et bavoirs rouges, et des moulins à vent de papier
const kyJizo=(x,y,n=5)=>{let g=shadow(x,y,n*8);
  for(let i=0;i<n;i++){const a=x+(i-(n-1)/2)*14,s=i%2?.9:1;
    g+=`<path d="M${a-6*s} ${y} Q${a-7*s} ${y-14*s} ${a} ${y-15*s} Q${a+7*s} ${y-14*s} ${a+6*s} ${y}Z" fill="#c9c3b8" ${K2}/><circle cx="${a}" cy="${y-19*s}" r="${6*s}" fill="#d6d0c4" ${K2}/>`
      +`<path d="M${a-5.4*s} ${y-12*s} Q${a} ${y-6*s} ${a+5.4*s} ${y-12*s} L${a} ${y-14*s}Z" fill="#e0503c" stroke="${INK}" stroke-width="1"/><path d="M${a-5*s} ${y-21*s} Q${a} ${y-30*s} ${a+5*s} ${y-21*s}Z" fill="#e0503c" stroke="${INK}" stroke-width="1"/>`
      +`<path d="M${a-2.4*s} ${y-19*s} q1.2 1 2.4 0 M${a+.4*s} ${y-19*s} q1.2 1 2.4 0" stroke="${INK}" stroke-width=".9" fill="none"/>`}
  g+=[-1,1].map(s=>{const px=x+s*((n-1)/2*14+12);return `<path d="M${px} ${y} V${y-24}" stroke="#7a5638" stroke-width="1.6"/><g transform="translate(${px} ${y-26})"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" additive="sum"/>${[0,90,180,270].map((r,i)=>`<path d="M0 0 L7 -3 L4 0Z" transform="rotate(${r})" fill="${["#f6a8be","#ffe08a","#9fd8f0","#a9cf7a"][i]}" stroke="${INK}" stroke-width=".6"/>`).join("")}</g>`}).join("");
  return g};

// le grand torii posé dans l'eau (comme celui d'Itsukushima) : deux piliers vermillon et leurs quatre jambes d'appui,
// la poutre, la plaque, le grand linteau noir aux bouts relevés, des ronds dans l'eau et le reflet
const kyOTorii=(x,y,k=1)=>{const X=a=>kyF(x+a*k),Yy=b=>kyF(y-b*k);
  let g=`<g opacity=".24"><path d="M${X(-22)} ${Yy(0)} V${Yy(-44)} M${X(22)} ${Yy(0)} V${Yy(-44)}" stroke="#e0503c" stroke-width="${kyF(7*k)}"/></g>`;
  g+=[-1,1].map(s=>[-9,9].map(d=>`<path d="M${X(s*22+d)} ${Yy(0)} L${X(s*22+d*.4)} ${Yy(30)}" stroke="${INK}" stroke-width="${kyF(4.4*k)}"/><path d="M${X(s*22+d)} ${Yy(0)} L${X(s*22+d*.4)} ${Yy(30)}" stroke="#e0503c" stroke-width="${kyF(2.6*k)}"/>`).join("")
    +`<path d="M${X(s*22-9)} ${Yy(14)} H${X(s*22+9)}" stroke="${INK}" stroke-width="${kyF(3.4*k)}"/><path d="M${X(s*22-9)} ${Yy(14)} H${X(s*22+9)}" stroke="#e0503c" stroke-width="${kyF(1.8*k)}"/><rect x="${X(s*22-7)}" y="${Yy(33)}" width="${kyF(14*k)}" height="${kyF(3.4*k)}" rx="1" fill="url(#ky-dark)" stroke="${INK}" stroke-width="1"/>`).join("");
  g+=[-1,1].map(s=>`<path d="M${X(s*22)} ${Yy(0)} L${X(s*20.4)} ${Yy(64)}" stroke="${INK}" stroke-width="${kyF(9.4*k)}"/><path d="M${X(s*22)} ${Yy(0)} L${X(s*20.4)} ${Yy(64)}" stroke="url(#ky-red)" stroke-width="${kyF(6.8*k)}"/><path d="M${X(s*22-2)} ${Yy(2)} L${X(s*20.4-2)} ${Yy(60)}" stroke="#ff9a7a" stroke-width="${kyF(1.2*k)}" opacity=".6"/><path d="M${X(s*22-4)} ${Yy(1)} h${kyF(8*k)}" stroke="#2c2426" stroke-width="${kyF(2.4*k)}"/>`).join("");
  g+=`<rect x="${X(-35)}" y="${Yy(50)}" width="${kyF(70*k)}" height="${kyF(4.6*k)}" fill="url(#ky-red)" stroke="${INK}" stroke-width="1.4"/>`
    +`<rect x="${X(-6)}" y="${Yy(63)}" width="${kyF(12*k)}" height="${kyF(12*k)}" fill="#2c2426" stroke="${INK}" stroke-width="1"/><rect x="${X(-3.8)}" y="${Yy(61)}" width="${kyF(7.6*k)}" height="${kyF(8*k)}" fill="#f2c45a"/>`
    +`<path d="M${X(-39)} ${Yy(63)} Q${X(0)} ${Yy(61)} ${X(39)} ${Yy(63)} L${X(39)} ${Yy(68)} Q${X(0)} ${Yy(66)} ${X(-39)} ${Yy(68)}Z" fill="url(#ky-red)" ${BO2}/>`
    +`<path d="M${X(-49)} ${Yy(73)} Q${X(-36)} ${Yy(67)} ${X(0)} ${Yy(68)} Q${X(36)} ${Yy(67)} ${X(49)} ${Yy(73)} L${X(47)} ${Yy(78.6)} Q${X(36)} ${Yy(73)} ${X(0)} ${Yy(74)} Q${X(-36)} ${Yy(73)} ${X(-47)} ${Yy(78.6)}Z" fill="url(#ky-dark)" ${BO2}/>`;
  return g+kyRipple(X(-22),Yy(-1),kyF(9*k))+kyRipple(X(22),Yy(-1),kyF(9*k),1.5)};

// le sanctuaire sur l'eau, sur pilotis (comme celui d'Itsukushima) : galeries rouges, murs blancs, toits d'écorce
// de cyprès, pignon central, lanternes ; reflet et ronds dans l'eau
const kyMiyajima=(x,y)=>{let g=`<g opacity=".22"><rect x="${x-70}" y="${y+4}" width="140" height="16" fill="#e0503c"/><rect x="${x-34}" y="${y+20}" width="68" height="14" fill="#8a6a5a"/></g>`;
  g+=Array.from({length:14},(_,i)=>`<path d="M${x-71+i*11} ${y+4} V${y-6}" stroke="${INK}" stroke-width="3.6"/><path d="M${x-71+i*11} ${y+4} V${y-6}" stroke="#8a5a3a" stroke-width="1.9"/>`).join("");
  g+=`<rect x="${x-76}" y="${y-10}" width="152" height="5.4" fill="#c99a6a" ${BO2}/>`;
  const hall=(cx,w,h,b,rh)=>`<rect x="${cx-w/2}" y="${b-h}" width="${w}" height="${h}" fill="url(#ky-plaster)" ${BO2}/>`
    +Array.from({length:5},(_,i)=>`<rect x="${kyF(cx-w/2+i*w/4-1.8)}" y="${b-h}" width="3.6" height="${h}" fill="url(#ky-red)" stroke="${INK}" stroke-width=".8"/>`).join("")
    +`<path d="M${cx-w/2} ${b-h+3} H${cx+w/2}" stroke="#d8452f" stroke-width="2.2"/>`
    +`<path d="M${cx-w/2-11} ${b-h+2} Q${cx} ${b-h-3} ${cx+w/2+11} ${b-h+2} L${cx+w/2-3} ${b-h-rh} H${cx-w/2+3}Z" fill="url(#ky-bark)" ${BO2}/><path d="M${cx-w/2+3} ${b-h-rh} H${cx+w/2-3}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
    +`<path d="M${cx-w/2-6} ${b-h} Q${cx} ${b-h-5} ${cx+w/2+6} ${b-h}" stroke="#c8a892" stroke-width="1" fill="none"/>`;
  g+=hall(x-50,42,15,y-10,12)+hall(x+50,42,15,y-10,12)+hall(x,58,25,y-10,20);
  g+=`<path d="M${x-13} ${y-36} L${x} ${y-54} L${x+13} ${y-36}Z" fill="url(#ky-plaster)" stroke="${INK}" stroke-width="1.3"/><path d="M${x-15} ${y-35} L${x} ${y-56} L${x+15} ${y-35}" fill="none" stroke="#8a6a5a" stroke-width="3" stroke-linecap="round"/><circle cx="${x}" cy="${y-44}" r="2.4" fill="#f2c45a" stroke="${INK}" stroke-width=".8"/>`
    +[-1,1].map(s=>`<path d="M${x+s*26} ${y-55} q${s*3} -5 ${s*1} -9" stroke="#f2c45a" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join("");
  g+=`<path d="M${x-76} ${y-16} H${x+76}" stroke="${INK}" stroke-width="3.6"/><path d="M${x-76} ${y-16} H${x+76}" stroke="#e0503c" stroke-width="2"/>`+Array.from({length:18},(_,i)=>`<path d="M${kyF(x-76+i*8.94)} ${y-10} V${y-16}" stroke="#e0503c" stroke-width="1.6"/>`).join("");
  g+=kyLantern(x-20,y-26,.42)+kyLantern(x+20,y-26,.42)+kyLantern(x-62,y-22,.36)+kyLantern(x+62,y-22,.36);
  return g+kyRipple(x-50,y+8,12)+kyRipple(x+8,y+12,14,1)+kyRipple(x+56,y+8,11,2)};

// une barque sur le lac, sa lanterne et sa perche
const kyBoat=(x,y)=>`<path d="M${x-22} ${y+6} Q${x} ${y+16} ${x+22} ${y+6}" stroke="#5b4250" stroke-width="5" opacity=".16" fill="none"/><path d="M${x-26} ${y-6} Q${x-20} ${y+6} ${x} ${y+6} Q${x+20} ${y+6} ${x+26} ${y-6} Q${x} ${y-1} ${x-26} ${y-6}Z" fill="url(#ky-wood)" ${BO2}/><path d="M${x-22} ${y-3} Q${x} ${y+1} ${x+22} ${y-3}" stroke="#c99a6a" stroke-width="1.2" fill="none"/>`
  +`<path d="M${x+12} ${y-2} L${x+30} ${y-36}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M${x-14} ${y-3} V${y-22}" stroke="${INK}" stroke-width="1.6"/>`+kyLantern(x-14,y-26,.45)+kyRipple(x-22,y+6,10)+kyRipple(x+24,y+6,9,1.6);

// un bouquet de feuilles de lotus, une fleur rose une fois sur deux
const kyLotus=(x,y,s=0)=>[[-8,0,9],[7,3,7],[0,-5,6]].map(([a,b,r])=>`<path d="M${x+a-r} ${y+b} a${r} ${kyF(r*.42)} 0 1 0 ${2*r} 0 a${r} ${kyF(r*.42)} 0 1 0 ${-2*r} 0Z M${x+a} ${y+b} l${kyF(r*.8)} ${kyF(-r*.2)}" fill="#8cc070" stroke="${INK}" stroke-width="1"/>`).join("")
  +(s%2?"":`<path d="M${x+2} ${y-2} q-4 -4 -2 -9 q2 3 2 3 q0 -4 3 -6 q3 2 3 6 q0 0 2 -3 q2 5 -2 9Z" fill="#f7b3c6" stroke="${INK}" stroke-width=".9"/>`);

// le banc à ombrelle (nodate) : banc de bois à feutre rouge et franges, grande ombrelle de papier (wagasa) à baleines,
// anneau blanc et bord festonné, plateau de thé et de dango
const kyNodate=(x,y)=>{let g=shadow(x,y,34);const legs=`M${x-24} ${y} V${y-12} M${x+24} ${y} V${y-12} M${x-14} ${y} V${y-10} M${x+14} ${y} V${y-10}`;
  g+=`<path d="${legs}" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="${legs}" stroke="#7a4a2e" stroke-width="1.8"/>`;
  g+=`<rect x="${x-29}" y="${y-17}" width="58" height="5" rx="1.6" fill="#8a5a34" ${BO2}/><path d="M${x-30} ${y-16} H${x+30} V${y-8} H${x-30}Z" fill="#d9443a" ${BO2}/><path d="M${x-28} ${y-14.4} H${x+28}" stroke="#f27a6a" stroke-width="1"/>`
    +Array.from({length:12},(_,i)=>`<path d="M${kyF(x-27.5+i*5)} ${y-8} v2.6" stroke="#b8342c" stroke-width="1.2" stroke-linecap="round"/>`).join("");
  const cx=x+6,L=x-32,R=x+44,by=y-60,ap=by-26;
  g+=`<path d="M${x+5} ${y-14} Q${x+8} ${y-40} ${cx} ${ap+2}" stroke="${INK}" stroke-width="3.8" fill="none"/><path d="M${x+5} ${y-14} Q${x+8} ${y-40} ${cx} ${ap+2}" stroke="#d9b07a" stroke-width="2" fill="none"/>`;
  const E=Array.from({length:9},(_,i)=>[L+i*(R-L)/8,by+Math.sin(i/8*Math.PI)*3.4]);
  g+=`<path d="M${L} ${by} Q${L+6} ${ap+4} ${cx} ${ap} Q${R-6} ${ap+4} ${R} ${by}`+E.slice(0,8).reverse().map((p,i)=>{const q=E[7-i];return ` Q${kyF((E[8-i][0]+q[0])/2)} ${kyF(q[1]+6)} ${kyF(q[0])} ${kyF(q[1])}`}).join("")+`Z" fill="#e0503c" ${BO}/>`;
  g+=E.slice(1,8).map(([ex,ey],i)=>`<path d="M${cx} ${ap+2} Q${kyF((cx+ex)/2+(ex-cx)*.12)} ${kyF(ap+8)} ${kyF(ex)} ${kyF(ey+2)}" stroke="${i%2?"#f6a08a":"#b8342c"}" stroke-width="1.1" fill="none"/>`).join("")
    +`<path d="M${cx-12} ${ap+9} Q${cx} ${ap+3} ${cx+12} ${ap+9}" stroke="#fff6ea" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="${cx}" cy="${ap-1}" r="2.6" fill="#2f2a32" stroke="${INK}" stroke-width="1"/>`;
  g+=`<rect x="${x-20}" y="${y-20}" width="22" height="3" rx="1" fill="#6e4630" stroke="${INK}" stroke-width="1"/><path d="M${x-17} ${y-20} q0 -7 4.6 -7 q4.6 0 4.6 7Z" fill="#5f7f5a" stroke="${INK}" stroke-width="1"/><path d="M${x-8} ${y-24} q3 -1 3 2" fill="none" stroke="${INK}" stroke-width="1"/><path d="M${x-4} ${y-20} h5 v-4 h-5Z" fill="#f4e8cf" stroke="${INK}" stroke-width="1"/>`
    +`<path d="M${x+12} ${y-18} l8 -8" stroke="#c99a5a" stroke-width="1.4"/><circle cx="${x+14}" cy="${y-20}" r="2" fill="#f6a8be" stroke="${INK}" stroke-width=".7"/><circle cx="${x+16.6}" cy="${y-22.6}" r="2" fill="#fffaf2" stroke="${INK}" stroke-width=".7"/><circle cx="${x+19.2}" cy="${y-25.2}" r="2" fill="#a9cf7a" stroke="${INK}" stroke-width=".7"/>`;
  return g};

// le pavillon d'or (Kinkaku-ji) au bord de son étang : rez-de-chaussée de bois et de papier, deux étages d'or, toits
// d'écorce aux bords dorés, fenêtres en cloche, le phénix d'or au sommet ; reflet doré, île au pin, rochers
const kyKinkaku=(x,y)=>{let g=`<ellipse cx="${x-6}" cy="${y+12}" rx="68" ry="23" fill="${INK}"/><ellipse cx="${x-6}" cy="${y+12}" rx="65" ry="20" fill="#cfc6b0"/><ellipse cx="${x-6}" cy="${y+13}" rx="60" ry="16.6" fill="url(#ky-water)"/>`;
  g+=`<g opacity=".4"><rect x="${x-34}" y="${y+1}" width="68" height="4" fill="#5a4a42"/><rect x="${x-27}" y="${y+5}" width="54" height="9" fill="#f2c45a"/><rect x="${x-18}" y="${y+14}" width="36" height="6" fill="#f2c45a"/></g>`+kyRipple(x-44,y+18,8)+kyRipple(x+38,y+18,7,1.6);
  g+=`<ellipse cx="${x+44}" cy="${y+20}" rx="6" ry="3.6" fill="#a8a29a" ${K2}/><ellipse cx="${x+36}" cy="${y+25}" rx="4" ry="2.6" fill="#b8b2a8" ${K2}/><ellipse cx="${x-50}" cy="${y+20}" rx="13" ry="4.6" fill="#9fbf7a" ${K2}/>`+kyPine(x-48,y+19,.5);
  g+=`<rect x="${x-40}" y="${y-3}" width="80" height="4" fill="#5a3a28" ${K2}/>`+[-36,-24,-12,0,12,24,36].map(a=>`<path d="M${x+a} ${y+1} v4" stroke="${INK}" stroke-width="2"/>`).join("");
  g+=`<rect x="${x-34}" y="${y-26}" width="68" height="23" fill="#f3e6cc" ${BO2}/>`+[-34,-22.7,-11.3,0,11.3,22.7,34].map(a=>`<rect x="${kyF(x+a-1.4)}" y="${y-26}" width="2.8" height="23" fill="#5a3a28"/>`).join("")
    +`<path d="M${x-34} ${y-17} H${x+34}" stroke="#d8c8a8" stroke-width="1"/><path d="M${x-38} ${y-8} H${x+38}" stroke="${INK}" stroke-width="3"/><path d="M${x-38} ${y-8} H${x+38}" stroke="#8a5a3a" stroke-width="1.6"/>`;
  const roof=(w,yy,t)=>`<path d="M${x-w} ${yy+2} Q${x-w*.5} ${yy-1} ${x} ${yy-1} Q${x+w*.5} ${yy-1} ${x+w} ${yy+2} L${x+w-7} ${yy-t} H${x-w+7}Z" fill="url(#ky-bark)" ${BO2}/><path d="M${x-w+2} ${yy+1} Q${x} ${yy-2.6} ${x+w-2} ${yy+1}" stroke="#f2c45a" stroke-width="1.1" fill="none"/>`
    +[-1,1].map(s=>`<path d="M${x+s*w} ${yy+2} q${s*2} -3 ${s*1} -6" stroke="#f2c45a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`).join("");
  g+=roof(48,y-26,7);
  g+=`<rect x="${x-28}" y="${y-52}" width="56" height="19" fill="url(#ky-gold2)" ${BO2}/>`+[-20,-7,7,20].map(a=>`<rect x="${x+a-4.4}" y="${y-49}" width="8.8" height="11" fill="#fff4cc" stroke="#c98e2a" stroke-width="1"/><path d="M${x+a} ${y-49} v11" stroke="#e2b04a" stroke-width=".8"/>`).join("")
    +`<path d="M${x-31} ${y-36} H${x+31}" stroke="${INK}" stroke-width="2.6"/><path d="M${x-31} ${y-36} H${x+31}" stroke="#f2c45a" stroke-width="1.2"/>`;
  g+=roof(40,y-52,6);
  g+=`<rect x="${x-19}" y="${y-74}" width="38" height="17" fill="url(#ky-gold2)" ${BO2}/>`+[-9,9].map(a=>`<path d="M${x+a-4} ${y-59} V${y-66} Q${x+a} ${y-72} ${x+a+4} ${y-66} V${y-59}Z" fill="#7a5a2a" stroke="${INK}" stroke-width="1"/>`).join("");
  g+=`<path d="M${x-32} ${y-72} Q${x-16} ${y-76} ${x-10} ${y-84} L${x} ${y-96} L${x+10} ${y-84} Q${x+16} ${y-76} ${x+32} ${y-72} Q${x} ${y-77} ${x-32} ${y-72}Z" fill="url(#ky-bark)" ${BO2}/><path d="M${x-30} ${y-72.6} Q${x} ${y-76.4} ${x+30} ${y-72.6}" stroke="#f2c45a" stroke-width="1.1" fill="none"/>`
    +`<path d="M${x} ${y-96} v-3" stroke="${INK}" stroke-width="1.6"/><path d="M${x-3} ${y-100} q2 -6 6 -7 q-1 2 1 3 q3 -2 7 0 q-4 1 -5 4 q-3 3 -9 0Z" fill="url(#ky-gold)" stroke="${INK}" stroke-width="1"/>`;
  g+=[[24,-62,0],[-25,-44,1.2],[6,-84,2.2]].map(([a,b,d])=>`<path d="M${x+a} ${y+b-4} q.8 3.2 4 4 q-3.2 .8 -4 4 q-.8 -3.2 -4 -4 q3.2 -.8 4 -4Z" fill="#fffbe0" stroke="#d6a03a" stroke-width=".6" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.6s" begin="${d}s" repeatCount="indefinite"/></path>`).join("");
  return g};

// trois cerisiers à essayer (20/11/2026, Joffray : « ceux-là sont ronds, j'aimerais une forme différente ») : voir
// tools/cerisiers.html. A : pleureur (shidare-zakura), B : en parasol (Yoshino), C : noueux, à la façon des estampes
const kyPetals=(x,y,k)=>[[-18,-30,0],[15,-28,1.4],[2,-24,2.7]].map(([a,b,d])=>`<path d="M${kyF(x+a*k)} ${kyF(y+b*k)} q2 -2.2 4.4 0 q-2.2 2.2 -4.4 0Z" fill="#f7b3c6" stroke="${INK}" stroke-width=".5" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${kyF(-7*k)} ${kyF(14*k)};${kyF(4*k)} ${kyF(30*k)}" dur="4.2s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" dur="4.2s" begin="${d}s" repeatCount="indefinite"/></path>`).join("");
const kyBlob=(C,X,Yy,k,c0,c1,c2)=>C.map(([a,b,rx,ry])=>`<ellipse cx="${X(a)}" cy="${Yy(b)}" rx="${kyF((rx+1.5)*k)}" ry="${kyF(((ry||rx)+1.5)*k)}" fill="${INK}"/>`).join("")
  +C.map(([a,b,rx,ry])=>`<ellipse cx="${X(a)}" cy="${Yy(b)}" rx="${kyF(rx*k)}" ry="${kyF((ry||rx)*k)}" fill="${c0}"/>`).join("")
  +C.map(([a,b,rx,ry])=>`<ellipse cx="${X(a-rx*.14)}" cy="${Yy(b-(ry||rx)*.22)}" rx="${kyF(rx*.74*k)}" ry="${kyF((ry||rx)*.66*k)}" fill="${c1}"/>`).join("")
  +C.map(([a,b,rx,ry])=>`<ellipse cx="${X(a-rx*.28)}" cy="${Yy(b-(ry||rx)*.4)}" rx="${kyF(rx*.36*k)}" ry="${kyF((ry||rx)*.3*k)}" fill="${c2}"/>`).join("");
const kySakuraA=(x,y,k=1)=>{const X=a=>kyF(x+a*k),Yy=b=>kyF(y+b*k);let g=shadow(x,y,34*k);
  g+=`<path d="M${X(-7)} ${Yy(0)} Q${X(-4)} ${Yy(-22)} ${X(-3)} ${Yy(-52)} L${X(4)} ${Yy(-52)} Q${X(3)} ${Yy(-22)} ${X(8)} ${Yy(0)}Z" fill="url(#ky-trunk)" ${K2}/>`;
  const S=[-36,-29,-22,-15,-8,8,15,22,29,36],st=S.map(d=>`M${X(d*.2)} ${Yy(-56)} Q${X(d*.95)} ${Yy(-66+Math.abs(d)*.1)} ${X(d)} ${Yy(-10-(36-Math.abs(d))*.4-((Math.abs(d)*7)%9))}`).join(" ");
  g+=`<path d="${st}" fill="none" stroke="${INK}" stroke-width="${kyF(7.6*k)}" stroke-linecap="round"/><path d="${st}" fill="none" stroke="#ef9fb6" stroke-width="${kyF(5*k)}" stroke-linecap="round"/><path d="${st}" fill="none" stroke="#ffd9e4" stroke-width="${kyF(2.6*k)}" stroke-linecap="round" stroke-dasharray="${kyF(.1*k)} ${kyF(4.2*k)}"/>`;
  g+=kyBlob([[-12,-60,12,9],[0,-66,14,10],[12,-60,12,9],[-24,-56,8,6],[24,-56,8,6]],X,Yy,k,"#ee9db4","#f8c2d1","#ffe4ec");
  return g+kyPetals(x,y,k)};
const kySakuraB=(x,y,k=1)=>{const X=a=>kyF(x+a*k),Yy=b=>kyF(y+b*k);let g=shadow(x,y,46*k);
  g+=`<path d="M${X(-8)} ${Yy(0)} Q${X(-5)} ${Yy(-14)} ${X(-4)} ${Yy(-24)} L${X(4)} ${Yy(-24)} Q${X(4)} ${Yy(-12)} ${X(9)} ${Yy(0)}Z" fill="url(#ky-trunk)" ${K2}/>`;
  const br=`M${X(-2)} ${Yy(-22)} Q${X(-18)} ${Yy(-30)} ${X(-38)} ${Yy(-38)} M${X(0)} ${Yy(-22)} Q${X(2)} ${Yy(-36)} ${X(-2)} ${Yy(-50)} M${X(2)} ${Yy(-22)} Q${X(20)} ${Yy(-28)} ${X(40)} ${Yy(-36)} M${X(-12)} ${Yy(-28)} Q${X(-20)} ${Yy(-40)} ${X(-22)} ${Yy(-52)} M${X(12)} ${Yy(-27)} Q${X(18)} ${Yy(-40)} ${X(22)} ${Yy(-52)}`;
  g+=`<path d="${br}" fill="none" stroke="${INK}" stroke-width="${kyF(6*k)}" stroke-linecap="round"/><path d="${br}" fill="none" stroke="url(#ky-trunk)" stroke-width="${kyF(3.6*k)}" stroke-linecap="round"/>`;
  g+=kyBlob([[-44,-38,13,6],[44,-38,13,6],[-28,-44,20,9],[28,-44,20,9],[0,-50,26,11],[-16,-58,18,8],[16,-60,18,8],[0,-66,14,6]],X,Yy,k,"#f4b9cb","#fcdbe5","#fff4f7");
  g+=[[-40,-34],[-20,-38],[2,-42],[24,-38],[42,-33]].map(([a,b])=>`<circle cx="${X(a)}" cy="${Yy(b+6)}" r="${kyF(1.5*k)}" fill="#f4b9cb" stroke="${INK}" stroke-width=".6"/>`).join("");
  return g+kyPetals(x,y,k)};
const kySakuraC=(x,y,k=1)=>{const X=a=>kyF(x+a*k),Yy=b=>kyF(y+b*k);let g=shadow(x,y,30*k);
  const tr=`M${X(-4)} ${Yy(0)} C${X(-10)} ${Yy(-14)} ${X(6)} ${Yy(-22)} ${X(-2)} ${Yy(-36)} M${X(-2)} ${Yy(-33)} Q${X(14)} ${Yy(-44)} ${X(40)} ${Yy(-42)} M${X(-2)} ${Yy(-36)} Q${X(-14)} ${Yy(-50)} ${X(-24)} ${Yy(-60)} M${X(4)} ${Yy(-38)} Q${X(10)} ${Yy(-50)} ${X(8)} ${Yy(-62)}`;
  g+=`<path d="${tr}" fill="none" stroke="${INK}" stroke-width="${kyF(8.6*k)}" stroke-linecap="round"/><path d="${tr}" fill="none" stroke="url(#ky-trunk)" stroke-width="${kyF(6*k)}" stroke-linecap="round"/><path d="M${X(-6)} ${Yy(-6)} q${kyF(2*k)} ${kyF(-6*k)} ${kyF(-1*k)} ${kyF(-10*k)}" stroke="#a87060" stroke-width="${kyF(1.2*k)}" fill="none"/>`;
  const pad=(a,b,w)=>[-.5,-.25,0,.25,.5].map((t,i)=>[a+t*w,b+(i%2?-2.4:1)-(1-Math.abs(t)*2)*3.6,w*.26,w*.21]);
  const P=[...pad(38,-45,24),...pad(22,-49,18),...pad(-24,-63,22),...pad(-12,-55,14),...pad(8,-64,18),...pad(-2,-46,12),...pad(-30,-56,12),...pad(30,-40,12)];
  g+=kyBlob(P,X,Yy,k,"#e98aa6","#f6b4c6","#ffdce6");
  g+=[[30,-50],[-30,-66],[14,-68],[44,-48]].map(([a,b])=>`<ellipse cx="${X(a)}" cy="${Yy(b)}" rx="${kyF(2.4*k)}" ry="${kyF(1.2*k)}" fill="#c75a4a" stroke="${INK}" stroke-width=".6"/>`).join("");
  return g+kyPetals(x,y,k)};

// trois autres propositions (20/11/2026, Joffray : « j'adore le C mais pas assez touffu », « un mix de B et C ») :
// D : le C bien touffu, E : tronc du C et étages plats du B, F : le C touffu avec des grappes qui retombent
const kyTrunkC=(X,Yy,k)=>{const tr=`M${X(-4)} ${Yy(0)} C${X(-10)} ${Yy(-14)} ${X(6)} ${Yy(-22)} ${X(-2)} ${Yy(-36)} M${X(-2)} ${Yy(-33)} Q${X(14)} ${Yy(-44)} ${X(40)} ${Yy(-42)} M${X(-2)} ${Yy(-36)} Q${X(-14)} ${Yy(-50)} ${X(-26)} ${Yy(-58)} M${X(4)} ${Yy(-38)} Q${X(10)} ${Yy(-50)} ${X(8)} ${Yy(-62)}`;
  return `<path d="${tr}" fill="none" stroke="${INK}" stroke-width="${kyF(8.6*k)}" stroke-linecap="round"/><path d="${tr}" fill="none" stroke="url(#ky-trunk)" stroke-width="${kyF(6*k)}" stroke-linecap="round"/><path d="M${X(-6)} ${Yy(-6)} q${kyF(2*k)} ${kyF(-6*k)} ${kyF(-1*k)} ${kyF(-10*k)}" stroke="#a87060" stroke-width="${kyF(1.2*k)}" fill="none"/>`};
// un nuage de fleurs : n petites bosses serrées autour d'un centre
const kyCloud=(cx,cy,w,h,n,r)=>Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2+i*.7,d=.55+((i*37)%10)/22;return [cx+Math.cos(a)*w*d*.5,cy+Math.sin(a)*h*d*.5,r*(.8+((i*13)%5)/12),r*(.7+((i*7)%4)/12)]}).concat([[cx,cy,w*.36,h*.4]]);
const kySakuraD=(x,y,k=1)=>{const X=a=>kyF(x+a*k),Yy=b=>kyF(y+b*k);let g=shadow(x,y,36*k)+kyTrunkC(X,Yy,k);
  const P=[...kyCloud(34,-46,30,16,8,6),...kyCloud(14,-54,26,16,7,6),...kyCloud(-24,-62,30,18,8,6.4),...kyCloud(-6,-72,24,14,7,5.6),...kyCloud(8,-64,22,14,6,5.6),...kyCloud(-34,-52,18,12,5,5),...kyCloud(46,-40,14,10,4,4.6)];
  g+=kyBlob(P,X,Yy,k,"#e98aa6","#f6b4c6","#ffdce6");
  g+=[[30,-52],[-30,-68],[14,-70],[48,-44],[-8,-58]].map(([a,b])=>`<ellipse cx="${X(a)}" cy="${Yy(b)}" rx="${kyF(2.4*k)}" ry="${kyF(1.2*k)}" fill="#c75a4a" stroke="${INK}" stroke-width=".6"/>`).join("");
  return g+kyPetals(x,y,k)};
const kySakuraE=(x,y,k=1)=>{const X=a=>kyF(x+a*k),Yy=b=>kyF(y+b*k);let g=shadow(x,y,40*k)+kyTrunkC(X,Yy,k);
  g+=kyBlob([[40,-44,16,7],[22,-48,20,9],[-26,-60,20,8],[-40,-55,12,6],[6,-58,16,7],[-10,-68,18,8],[10,-72,14,6],[52,-41,9,5],[-16,-52,12,6]],X,Yy,k,"#f2adc2","#fbd4df","#fff2f6");
  g+=[[-30,-50],[0,-50],[34,-38],[-14,-60],[18,-64]].map(([a,b])=>`<circle cx="${X(a)}" cy="${Yy(b)}" r="${kyF(1.5*k)}" fill="#f2adc2" stroke="${INK}" stroke-width=".6"/>`).join("");
  return g+kyPetals(x,y,k)};
const kySakuraF=(x,y,k=1)=>{const X=a=>kyF(x+a*k),Yy=b=>kyF(y+b*k);let g=shadow(x,y,36*k)+kyTrunkC(X,Yy,k);
  const D=[[44,-40],[36,-40],[26,-44],[16,-48],[-16,-54],[-26,-56],[-36,-50],[-6,-62],[6,-58]],dr=D.map(([a,b],i)=>`M${X(a)} ${Yy(b)} q${kyF(1*k)} ${kyF(6*k)} ${kyF((i%2?-1:1)*1.4*k)} ${kyF((10+(i*5)%7)*k)}`).join(" ");
  g+=`<path d="${dr}" fill="none" stroke="${INK}" stroke-width="${kyF(5.4*k)}" stroke-linecap="round"/><path d="${dr}" fill="none" stroke="#ef9fb6" stroke-width="${kyF(3.2*k)}" stroke-linecap="round"/><path d="${dr}" fill="none" stroke="#ffe0e8" stroke-width="${kyF(1.4*k)}" stroke-linecap="round" stroke-dasharray="${kyF(.1*k)} ${kyF(3.4*k)}"/>`;
  const P=[...kyCloud(32,-46,30,14,8,5.6),...kyCloud(12,-54,24,14,6,5.6),...kyCloud(-24,-60,28,16,8,6),...kyCloud(-4,-70,22,12,6,5.4),...kyCloud(-36,-52,16,10,5,4.6)];
  g+=kyBlob(P,X,Yy,k,"#e98aa6","#f6b4c6","#ffdce6");
  return g+kyPetals(x,y,k)};
const kySakuraG=(x,y,k=1)=>{const X=a=>kyF(x+a*k),Yy=b=>kyF(y+b*k);let g=shadow(x,y,38*k)+kyTrunkC(X,Yy,k);
  g+=kyBlob([[42,-41,17,7],[-34,-54,18,7.4],[8,-58,22,8],[24,-47,16,7]],X,Yy,k,"#f2adc2","#fbd4df","#fff2f6");
  const P=[...kyCloud(32,-48,26,14,7,5.6),...kyCloud(12,-56,24,14,6,5.6),...kyCloud(-24,-63,28,16,7,6),...kyCloud(-6,-72,22,13,6,5.4),...kyCloud(-34,-56,14,10,4,4.6)];
  g+=kyBlob(P,X,Yy,k,"#ec95ae","#f8bfcf","#ffe2ea");
  g+=[[28,-54],[-30,-69],[12,-72],[-8,-60]].map(([a,b])=>`<ellipse cx="${X(a)}" cy="${Yy(b)}" rx="${kyF(2.2*k)}" ry="${kyF(1.1*k)}" fill="#c75a4a" stroke="${INK}" stroke-width=".6"/>`).join("")
    +[[-30,-48],[2,-50],[40,-36]].map(([a,b])=>`<circle cx="${X(a)}" cy="${Yy(b)}" r="${kyF(1.5*k)}" fill="#f2adc2" stroke="${INK}" stroke-width=".6"/>`).join("");
  return g+kyPetals(x,y,k)};
