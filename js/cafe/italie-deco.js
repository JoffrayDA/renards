/* Café Frimousse : dessins de la carte de la Petite Italie, refaits le 20/11/2026 (Joffray : « la carte est un poil vide »,
   « des maisons sans cachet, on se croirait pas en Italie », « les deux vélos bizarres, change-les en scooters », « améliore
   un peu la fontaine », « fais-moi un temple qu'on retrouve en Sicile », « fais-moi des vignes » ; « tout en haut c'est top »).
   Chargé juste après italie.js : itMapSVG (italie.js) appelle ces dessins au moment de dessiner la carte. */

// une maison de la rue, à l'italienne : enduit chaud et un peu usé (briques qui se montrent), soubassement de pierre,
// corniche, toit de tuiles canal (coppi) avec cheminée, fenêtres hautes à encadrement de pierre et persiennes vertes ou
// brunes (parfois fermées), géraniums rouges, balcon en fer forgé, linge qui sèche, porte cintrée ; une enseigne et un store
function itH(x,y,w,h,col,o={}){
  const sh=o.sh||"#7fb48a",roof=o.roof||"#d9774e",v=o.v||0,f=n=>+n.toFixed(1);
  let g=shadow(x+w/2,y+h,w*.55);
  // la façade, le soubassement de pierre, et un coin où l'enduit est tombé
  g+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${col}" ${BO}/>`;
  g+=`<rect x="${x+1.5}" y="${y+h-9}" width="${w-3}" height="7.5" fill="#e6d8c0" stroke="#c9b394" stroke-width="1.2"/>`;
  if(v%3===0){const bx=x+(v%2?w-20:6),by=y+(h>70?h-34:16);
    g+=`<path d="M${bx} ${by} q6 -4 12 -1 q4 5 1 10 q-7 3 -13 -1Z" fill="#e8a888" opacity=".75"/>`+[[2,1],[7,3],[3,6]].map(([a,b])=>`<rect x="${bx+a}" y="${by+b}" width="5" height="2.6" rx=".6" fill="none" stroke="#b86a4a" stroke-width=".9"/>`).join("")}
  // la corniche, puis le toit de tuiles canal et sa cheminée
  g+=`<rect x="${x-3}" y="${y-2}" width="${w+6}" height="4" rx="1.5" fill="#fbf1e0" ${K}/>`;
  if(v%2===0){const cx=x+w*.72;g+=`<rect x="${f(cx)}" y="${y-22}" width="7" height="12" fill="${col}" ${K}/><path d="M${f(cx-2)} ${y-22} H${f(cx+9)} L${f(cx+7)} ${y-26} H${f(cx)}Z" fill="${roof}" ${K}/>`}
  g+=`<path d="M${x-6} ${y-1} H${x+w+6} L${x+w-3} ${y-13} H${x+3}Z" fill="${roof}" ${BO}/>`;
  for(let tx=x-2;tx<x+w+3;tx+=5.5)g+=`<path d="M${f(tx)} ${y-2} L${f(tx+(tx-x-w/2)*.06)} ${y-12}" stroke="#b85a3a" stroke-width="1.6" stroke-linecap="round"/>`;
  g+=`<path d="M${x-6} ${y-1} ${Array.from({length:Math.ceil((w+12)/5.5)},()=>"q2.75 3 5.5 0").join(" ")}" fill="${roof}" stroke="${INK}" stroke-width="1.4"/>`;
  // les fenêtres : encadrement de pierre, vitre, persiennes à lames
  const n=Math.max(1,Math.floor((w-8)/24)),gap=(w-n*11)/(n+1),rows=Math.max(1,Math.floor((h-(o.shop?36:24))/28));
  const lam=(sx,sy,sw)=>`<rect x="${f(sx)}" y="${sy}" width="${sw}" height="17" rx="1" fill="${sh}" ${K}/>`+[4,8,12].map(d=>`<path d="M${f(sx+1)} ${sy+d} h${sw-2}" stroke="rgba(0,0,0,.22)" stroke-width="1"/>`).join("");
  for(let j=0;j<rows;j++)for(let i=0;i<n;i++){const wx=x+gap+i*(11+gap),wy=y+9+j*28,shut=(i*3+j+v)%5===1;
    g+=`<rect x="${f(wx-1.5)}" y="${wy-3}" width="14" height="3" rx="1" fill="#fbf1e0" stroke="#c9b394" stroke-width="1"/>`;
    if(shut)g+=lam(wx,wy,5.5)+lam(wx+5.5,wy,5.5);
    else g+=`<rect x="${f(wx)}" y="${wy}" width="11" height="17" rx="1" fill="#8fb6cc" ${K}/><path d="M${f(wx+5.5)} ${wy} v17 M${f(wx)} ${wy+7} h11" stroke="#fbf1e0" stroke-width="1.4"/>`+lam(wx-5,wy,5)+lam(wx+11,wy,5);
    if((i+j+v)%2===0)g+=`<rect x="${f(wx-2)}" y="${wy+17}" width="15" height="4" rx="1.5" fill="#a8664a" ${K}/>`+[0,4,8,12].map((a,k)=>`<circle cx="${f(wx-.5+a)}" cy="${wy+16}" r="2.3" fill="${k%2?"#7fb06a":"#e8434f"}" stroke="${INK}" stroke-width=".9"/>`).join("")}
  // un balcon en fer forgé, avec ses pots
  if(o.balcony&&rows>1){const by=y+9+28+17,bw=Math.min(w-10,34),bx=x+w/2-bw/2;
    g+=`<rect x="${f(bx-2)}" y="${by}" width="${bw+4}" height="3" fill="#e6d8c0" ${K}/><path d="M${f(bx)} ${by} v-9 h${bw} v9" fill="none" stroke="${INK}" stroke-width="1.6"/>`+Array.from({length:Math.floor(bw/6)},(_,k)=>`<path d="M${f(bx+3+k*6)} ${by} v-9" stroke="${INK}" stroke-width="1"/><circle cx="${f(bx+3+k*6)}" cy="${by-4.5}" r="1.4" fill="none" stroke="${INK}" stroke-width=".9"/>`).join("")
      +`<circle cx="${f(bx+4)}" cy="${by-11}" r="3" fill="#e8434f" stroke="${INK}" stroke-width="1"/><circle cx="${f(bx+bw-4)}" cy="${by-11}" r="3" fill="#f47f9a" stroke="${INK}" stroke-width="1"/>`}
  // le linge qui sèche entre deux fenêtres
  if(v%3===1&&n>=2&&rows>=2&&!o.balcony){const ly=y+9+17+4,lx=x+gap+5,lw=(11+gap);
    g+=`<path d="M${f(lx)} ${ly} Q${f(lx+lw/2)} ${ly+6} ${f(lx+lw)} ${ly}" fill="none" stroke="${INK}" stroke-width=".9"/>`
      +[[.25,"#f6b7a8",0],[.5,"#fff",1],[.75,"#8fc0e8",0]].map(([t,c,k])=>{const cx=lx+lw*t,cy=ly+4*Math.sin(Math.PI*t)+1;return k
        ?`<path d="M${f(cx-3.5)} ${f(cy)} h7 v6 l-1.5 -1 l-2 1 l-2 -1 l-1.5 1Z" fill="${c}" stroke="${INK}" stroke-width=".9"/>`
        :`<path d="M${f(cx-3)} ${f(cy)} h6 l1.5 3 h-2 v5 h-5 v-5 h-2Z" fill="${c}" stroke="${INK}" stroke-width=".9"/>`}).join("")}
  // la boutique (store rayé et enseigne), ou une porte cintrée encadrée de pierre avec deux pots
  if(o.shop){const sy=y+h-30,c2=o.shop[1];
    g+=`<rect x="${x+4}" y="${sy+8}" width="${w-8}" height="${22-9}" fill="#fff8ec" ${K}/><rect x="${x+w/2-7}" y="${sy+10}" width="14" height="${20-9+7}" rx="4" fill="#7a4a36" ${K}/>`;
    g+=`<path d="M${x+2} ${sy} H${x+w-2} L${x+w+3} ${sy+9} H${x-3}Z" fill="#fff" ${K}/>`+Array.from({length:Math.floor(w/10)},(_,i)=>`<path d="M${x+3+i*10} ${sy} h5 l1.5 9 h-5Z" fill="${c2}"/>`).join("");
    g+=`<rect x="${x+w/2-22}" y="${sy-14}" width="44" height="12" rx="5" fill="#fffaf2" ${K}/><text x="${x+w/2}" y="${sy-5}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="7.5" fill="${INK}">${o.shop[0]}</text>`}
  else if(h>50){const dx=x+w/2,dy=y+h-2;
    g+=`<path d="M${dx-10} ${dy} V${dy-17} Q${dx-10} ${dy-27} ${dx} ${dy-27} Q${dx+10} ${dy-27} ${dx+10} ${dy-17} V${dy}" fill="#e6d8c0" stroke="#c9b394" stroke-width="1.2"/>`
      +`<path d="M${dx-7} ${dy} V${dy-16} Q${dx-7} ${dy-23} ${dx} ${dy-23} Q${dx+7} ${dy-23} ${dx+7} ${dy-16} V${dy}Z" fill="${v%2?"#6f8a5a":"#8a4a36"}" ${K}/><path d="M${dx} ${dy} V${dy-22}" stroke="rgba(0,0,0,.25)" stroke-width="1"/><circle cx="${dx+3}" cy="${dy-9}" r="1" fill="#f2c75c"/>`
      +[-13,13].map(a=>`<path d="M${dx+a-3.5} ${dy-6} L${dx+a-2.5} ${dy} H${dx+a+2.5} L${dx+a+3.5} ${dy-6}Z" fill="#d9774e" stroke="${INK}" stroke-width="1"/><circle cx="${dx+a}" cy="${dy-9}" r="4.4" fill="#7fb06a" stroke="${INK}" stroke-width="1"/>`).join("")}
  return g}

// une Vespa (de profil, tournée vers la droite) : coque arrondie sur la roue arrière, plancher, tablier, phare rond
const itScooter=(x,y,c="#9fd8c4")=>shadow(x,y,22)+`<g transform="translate(${x} ${y})">`
  +`<circle cx="-14" cy="-6" r="6.4" fill="#4e3f48" ${K}/><circle cx="-14" cy="-6" r="2.4" fill="#d8d2dc"/><circle cx="15" cy="-6" r="6.4" fill="#4e3f48" ${K}/><circle cx="15" cy="-6" r="2.4" fill="#d8d2dc"/>`
  +`<path d="M-25 -8 Q-27 -20 -15 -23 Q-5 -25 -2 -16 L-1 -10 H9 L12 -27 L17 -27 Q14 -18 16 -12 Q21 -12 22 -7 L8 -7 H-2 Z" fill="${c}" ${K}/>`
  +`<path d="M9 -10 L12 -27" stroke="${INK}" stroke-width="1.2" opacity=".5"/><path d="M-21 -14 Q-18 -20 -10 -20" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>`
  +`<path d="M-21 -24 Q-14 -28 -5 -24" stroke="#7a4a36" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M-21 -24 Q-14 -28 -5 -24" stroke="${INK}" stroke-width="1" fill="none" opacity=".5"/>`
  +`<path d="M14 -27 L13 -33 M9 -34 H19" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><circle cx="18.5" cy="-29" r="3" fill="#fff6c8" stroke="${INK}" stroke-width="1.4"/><path d="M17 -34 l2 -4" stroke="${INK}" stroke-width="1.2"/><circle cx="19.6" cy="-38.6" r="1.6" fill="#d8d2dc" stroke="${INK}" stroke-width=".8"/>`
  +`<circle cx="-25" cy="-15" r="1.6" fill="#e8434f" stroke="${INK}" stroke-width=".8"/></g>`;

// la fontaine de la place : vasque basse à rebord épais, colonne, coquille, et en haut un petit renard de pierre
// qui crache de l'eau ; ronds dans l'eau, rideaux d'eau, pigeons et pièces porte-bonheur
const itFountain=(x,y)=>{const S="#efe6da",S2="#ddd0bc";
  let g=`<ellipse cx="${x}" cy="${y-4}" rx="64" ry="21" fill="#efe0c8" stroke="#dcc6a6" stroke-width="2"/>`+Array.from({length:10},(_,i)=>{const a=i*Math.PI/5;return `<path d="M${(x+Math.cos(a)*46).toFixed(1)} ${(y-4+Math.sin(a)*15).toFixed(1)} l${(Math.cos(a)*16).toFixed(1)} ${(Math.sin(a)*5.2).toFixed(1)}" stroke="#dcc6a6" stroke-width="1.6"/>`}).join("");
  // la vasque : le flanc de pierre, le rebord, l'eau
  g+=`<path d="M${x-42} ${y-10} V${y-1} Q${x} ${y+15} ${x+42} ${y-1} V${y-10}" fill="${S2}" ${BO}/>`+[-30,-14,0,14,30].map(a=>`<path d="M${x+a} ${y-1+Math.round(10*(1-Math.abs(a)/42))} v-8" stroke="#c9b394" stroke-width="1.4"/>`).join("");
  g+=`<ellipse cx="${x}" cy="${y-10}" rx="42" ry="13" fill="${S}" ${BO}/><ellipse cx="${x}" cy="${y-10}" rx="35" ry="9.4" fill="#8fcbe4" stroke="${INK}" stroke-width="1.6"/>`;
  g+=`<g fill="none" stroke="#fff" stroke-width="1.4"><ellipse cx="${x-14}" cy="${y-9}" rx="5" ry="1.6"><animate attributeName="rx" values="2;9;2" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="2.4s" repeatCount="indefinite"/></ellipse><ellipse cx="${x+15}" cy="${y-8}" rx="5" ry="1.6"><animate attributeName="rx" values="2;9;2" dur="2.4s" begin="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="2.4s" begin="1.2s" repeatCount="indefinite"/></ellipse></g>`;
  g+=[[-20,-7],[6,-6],[22,-11]].map(([a,b])=>`<circle cx="${x+a}" cy="${y+b}" r="1.5" fill="#f2c75c" stroke="#b8902e" stroke-width=".6"/>`).join("");
  // la colonne et la coquille
  g+=`<path d="M${x-5} ${y-12} V${y-34} H${x+5} V${y-12}Z" fill="${S}" ${BO}/><rect x="${x-8}" y="${y-22}" width="16" height="4" rx="2" fill="${S2}" ${K}/>`;
  g+=`<path d="M${x-19} ${y-36} Q${x} ${y-20} ${x+19} ${y-36} Z" fill="${S}" ${BO}/>`+[-12,-6,0,6,12].map(a=>`<path d="M${x+a*.5} ${y-27} L${x+a} ${y-35}" stroke="#c9b394" stroke-width="1.1"/>`).join("")+`<ellipse cx="${x}" cy="${y-36}" rx="19" ry="3.6" fill="#8fcbe4" ${K}/>`;
  // l'eau qui déborde de la coquille
  g+=`<g fill="none" stroke="#9fd8f0" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="4 5"><animate attributeName="stroke-dashoffset" values="18;0" dur=".8s" repeatCount="indefinite"/><path d="M${x-18} ${y-35} Q${x-26} ${y-30} ${x-27} ${y-12}"/><path d="M${x+18} ${y-35} Q${x+26} ${y-30} ${x+27} ${y-12}"/></g>`;
  // le petit renard de pierre, assis sur la coquille, qui crache un jet d'eau
  const fx=x,fy=y-38;
  g+=`<path d="M${fx+7} ${fy-3} q10 -2 8 -12 q-2 6 -8 6Z" fill="${S2}" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${fx}" cy="${fy-6}" rx="8" ry="7" fill="${S}" stroke="${INK}" stroke-width="1.8"/>`
    +`<circle cx="${fx}" cy="${fy-16}" r="6.4" fill="${S}" stroke="${INK}" stroke-width="1.8"/><path d="M${fx-6} ${fy-19} l1 -7 l4 4.5 M${fx+6} ${fy-19} l-1 -7 l-4 4.5" fill="${S}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`
    +`<circle cx="${fx-2.4}" cy="${fy-17}" r=".9" fill="${INK}"/><circle cx="${fx+2.4}" cy="${fy-17}" r=".9" fill="${INK}"/><ellipse cx="${fx}" cy="${fy-13.4}" rx="1.4" ry="1.1" fill="${INK}"/>`;
  g+=`<g fill="none" stroke="#9fd8f0" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="3 4"><animate attributeName="stroke-dashoffset" values="14;0" dur=".7s" repeatCount="indefinite"/><path d="M${fx+1} ${fy-12} Q${fx+12} ${fy-28} ${fx+16} ${fy+2}"/></g>`;
  // les pigeons
  g+=[[-50,6],[46,2],[54,12],[-36,14]].map(([a,b],i)=>`<g transform="translate(${x+a} ${y+b})${i%2?" scale(-1 1)":""}"><ellipse cx="0" cy="-5" rx="6" ry="4.6" fill="#cfc6d6" stroke="${INK}" stroke-width="1.4"/><circle cx="5" cy="-9" r="3" fill="#cfc6d6" stroke="${INK}" stroke-width="1.4"/><path d="M8 -9 l2.4 .8 l-2.4 .8" fill="#f2a14a"/><path d="M3 -8 q1 2 0 4" stroke="#8fd0b0" stroke-width="1.2" fill="none"/></g>`).join("");
  return g};

// les vignes : des rangs de ceps sur leurs fils, feuilles et grappes violettes, piquets de bois ; dessinées de loin en près
const itVines=(x,y,rows=4,wd=96)=>Array.from({length:rows},(_,i)=>{const yy=y-i*17,xx=x-i*5,L=xx-wd/2,R=xx+wd/2,k=1-i*.06;
  let r=`<path d="M${L} ${yy} H${R}" stroke="#c9b394" stroke-width="5" stroke-linecap="round" opacity=".5"/>`;
  r+=`<path d="M${L} ${yy-11} H${R}" stroke="#8a6a44" stroke-width="1.2"/>`+[L,R].map(px=>`<path d="M${px} ${yy} V${yy-15}" stroke="#7a5638" stroke-width="2.6" stroke-linecap="round"/>`).join("");
  for(let a=L+8;a<R-4;a+=12){r+=`<path d="M${a} ${yy} q-2 -5 0 -10" stroke="#7a5638" stroke-width="2" fill="none" stroke-linecap="round"/>`
    +`<circle cx="${a-4}" cy="${yy-13}" r="${(5.4*k).toFixed(1)}" fill="#7fb86a" stroke="${INK}" stroke-width="1.2"/><circle cx="${a+4}" cy="${yy-12}" r="${(5*k).toFixed(1)}" fill="#8fca7a" stroke="${INK}" stroke-width="1.2"/>`
    +((a/12|0)%2?`<g fill="#8a5ab8" stroke="#5b3a7a" stroke-width=".8">${[[0,0],[2.6,0],[-2.6,0],[1.3,2.4],[-1.3,2.4],[0,4.6]].map(([p,q])=>`<circle cx="${(a+1+p).toFixed(1)}" cy="${(yy-7+q).toFixed(1)}" r="1.7"/>`).join("")}</g>`:"")}
  return r}).reverse().join("");
// une vigne sur sa colline : un coteau doux derrière les rangs, et une petite cabane de vigneron
const itVineyard=(x,y,side=1)=>`<path d="M${x-70} ${y+6} Q${x-40} ${y-84} ${x+10} ${y-80} Q${x+60} ${y-74} ${x+76} ${y+6}Z" fill="#cfe2a8" opacity=".75"/>`+itVines(x,y,6,110)
  +`<g transform="translate(${x+side*52} ${y-70})">${shadow(0,0,14)}<rect x="-11" y="-16" width="22" height="16" rx="1.5" fill="#ead6b4" ${K}/><path d="M-14 -15 L0 -26 L14 -15Z" fill="#d9774e" ${K}/><rect x="-4" y="-10" width="8" height="10" rx="3" fill="#8a4a36" stroke="${INK}" stroke-width="1"/></g>`;

// le temple grec de Sicile (comme celui de la Concorde, à Agrigente) : soubassement à trois marches, six colonnes doriques
// cannelées, architrave et frise à triglyphes, fronton ; pierre dorée, une colonne tombée devant, des amandiers en fleurs
// et des figuiers de Barbarie autour, comme dans la Vallée des Temples
const itTemple=(x,y)=>{const P="#ecc98e",P2="#d9b075",P3="#f6dcaa";
  let g=shadow(x,y,78);
  g+=[0,1,2].map(i=>`<rect x="${x-66+i*5}" y="${y-6-i*6}" width="${132-i*10}" height="6" fill="${i%2?P:P2}" ${K}/>`).join("");
  const top=y-18,H=52;
  g+=`<rect x="${x-54}" y="${top-H}" width="108" height="${H}" fill="#c9a26a" opacity=".55"/>`;
  for(let i=0;i<6;i++){const cx=x-48+i*19.2;
    g+=`<path d="M${(cx-5).toFixed(1)} ${top} L${(cx-4).toFixed(1)} ${top-H+4} H${(cx+4).toFixed(1)} L${(cx+5).toFixed(1)} ${top}Z" fill="${P}" ${K}/>`
      +[-2,0,2].map(d=>`<path d="M${(cx+d).toFixed(1)} ${top-2} V${top-H+6}" stroke="${P2}" stroke-width="1"/>`).join("")
      +`<rect x="${(cx-7).toFixed(1)}" y="${top-H+1}" width="14" height="3.4" rx="1" fill="${P3}" stroke="${INK}" stroke-width="1.4"/>`}
  g+=`<rect x="${x-58}" y="${top-H-8}" width="116" height="8" fill="${P}" ${K}/><rect x="${x-58}" y="${top-H-17}" width="116" height="9" fill="${P3}" ${K}/>`
    +Array.from({length:14},(_,i)=>`<rect x="${(x-55+i*8.2).toFixed(1)}" y="${top-H-16}" width="3.6" height="7" fill="${P2}"/>`).join("")
    +`<rect x="${x-61}" y="${top-H-20}" width="122" height="4" rx="1" fill="${P}" ${K}/><path d="M${x-61} ${top-H-20} L${x} ${top-H-44} L${x+61} ${top-H-20}Z" fill="${P3}" ${BO}/><path d="M${x-48} ${top-H-23} L${x} ${top-H-40} L${x+48} ${top-H-23}Z" fill="${P2}" opacity=".6"/>`;
  g+=`<path d="M${x+22} ${top-H-30} l6 4 l-3 5" fill="none" stroke="#b8925a" stroke-width="1.2"/><path d="M${x-40} ${top-20} l4 6 l-2 5" fill="none" stroke="#b8925a" stroke-width="1.2"/>`;
  // une colonne tombée, en tronçons, devant les marches
  g+=[[-44,8,0],[-30,10,1],[-17,9,0]].map(([a,b,k])=>`<ellipse cx="${x+a+6}" cy="${y+b}" rx="3" ry="5.5" fill="${P2}" ${K}/><rect x="${x+a-6}" y="${y+b-5.5}" width="12" height="11" fill="${P}" ${K}/><ellipse cx="${x+a-6}" cy="${y+b}" rx="3" ry="5.5" fill="${P3}" ${K}/>`).join("");
  return g};
// un figuier de Barbarie : raquettes vertes et fruits rouges et orangés
const itPrickly=(x,y,k=1)=>{const pad=(a,b,r,rot)=>`<ellipse cx="${x+a*k}" cy="${y+b*k}" rx="${7*r*k}" ry="${10*r*k}" transform="rotate(${rot} ${x+a*k} ${y+b*k})" fill="#7fb86a" stroke="${INK}" stroke-width="1.6"/>`;
  return shadow(x,y,16*k)+pad(0,-10,1,0)+pad(-9,-22,.8,-30)+pad(9,-24,.85,25)+pad(1,-34,.7,5)
    +[[-12,-30],[-6,-30],[12,-33],[6,-40],[-1,-42],[15,-27]].map(([a,b],i)=>`<ellipse cx="${x+a*k}" cy="${y+b*k}" rx="${2.4*k}" ry="${3*k}" fill="${i%2?"#f2a14a":"#e8434f"}" stroke="${INK}" stroke-width="1"/>`).join("")
    +[[-3,-14],[4,-8],[-11,-20],[10,-22]].map(([a,b])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r=".8" fill="#fff"/>`).join("")};
// un amandier en fleurs
const itAlmond=(x,y,k=1)=>shadow(x,y,24*k)+`<path d="M${x} ${y} Q${x-2*k} ${y-16*k} ${x+3*k} ${y-28*k} M${x+1*k} ${y-18*k} q${-10*k} -6 ${-14*k} -16 M${x+2*k} ${y-22*k} q${10*k} -4 ${14*k} -14" fill="none" stroke="#7a5638" stroke-width="${4*k}" stroke-linecap="round"/>`
  +blob([[x-14*k,y-36*k,11*k],[x+2*k,y-42*k,14*k],[x+16*k,y-36*k,11*k],[x-2*k,y-30*k,10*k]],"#fbd6e2")
  +[[-16,-40],[-6,-48],[8,-46],[18,-38],[0,-34],[-10,-30],[12,-30]].map(([a,b])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r="${2*k}" fill="#fff" stroke="#f49ab0" stroke-width=".8"/>`).join("");
// l'agave, grande rosette de feuilles pointues
const itAgave=(x,y,k=1)=>shadow(x,y,14*k)+[-70,-40,-15,10,35,60,-90+180].map((r,i)=>`<path d="M${x} ${y} Q${x-3*k} ${y-12*k} ${x} ${y-(22-i%2*5)*k} Q${x+3*k} ${y-12*k} ${x} ${y}Z" transform="rotate(${r} ${x} ${y})" fill="${i%2?"#8fb8a8":"#7fa898"}" stroke="${INK}" stroke-width="1.4"/>`).join("");
// une petite Fiat 500, ronde, garée au bord du chemin
const itFiat=(x,y,c="#9fc8e8")=>shadow(x,y,26)+`<g transform="translate(${x} ${y})"><circle cx="-14" cy="-6" r="6" fill="#4e3f48" ${K}/><circle cx="14" cy="-6" r="6" fill="#4e3f48" ${K}/><circle cx="-14" cy="-6" r="2.2" fill="#d8d2dc"/><circle cx="14" cy="-6" r="2.2" fill="#d8d2dc"/>`
  +`<path d="M-24 -8 Q-26 -18 -16 -20 Q-12 -32 0 -32 Q12 -32 16 -20 Q26 -18 24 -8 Q24 -6 21 -6 H-21 Q-24 -6 -24 -8Z" fill="${c}" ${BO}/>`
  +`<path d="M-11 -20 Q-9 -28 -1 -28 V-20Z M2 -20 V-28 Q10 -28 12 -20Z" fill="#e8f4fa" stroke="${INK}" stroke-width="1.4"/><path d="M-24 -12 H24" stroke="#fff" stroke-width="1.6" opacity=".7"/><circle cx="21" cy="-14" r="2" fill="#fff6c8" stroke="${INK}" stroke-width="1"/><path d="M-2 -16 h3" stroke="${INK}" stroke-width="1.4"/>`
  +`<rect x="-9" y="-36" width="16" height="3" rx="1.5" fill="#a8664a" stroke="${INK}" stroke-width="1"/></g>`;
// une couverture de pique-nique, son panier et une bouteille
const itPicnic=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-30 0 L-22 -18 H24 L32 0Z" fill="#fff" ${K}/>`
  +[-22,-8,6,20].map(a=>`<path d="M${a} -18 l2.6 18 h6 l-2.6 -18Z" fill="#f47f7f" opacity=".85"/>`).join("")+`<path d="M-26 -9 H28" stroke="#f47f7f" stroke-width="4" opacity=".6"/><path d="M-30 0 L-22 -18 H24 L32 0Z" fill="none" ${K}/>`
  +`<rect x="-8" y="-24" width="18" height="12" rx="3" fill="#d9a46a" ${K}/><path d="M-6 -24 Q1 -34 8 -24" fill="none" stroke="${INK}" stroke-width="1.8"/><path d="M-8 -19 h18" stroke="#b8824a" stroke-width="1"/>`
  +`<path d="M16 -14 v-10 q0 -3 2 -4 v-3 h3 v3 q2 1 2 4 v10Z" fill="#7fb06a" ${K}/><circle cx="-18" cy="-8" r="3" fill="#e8434f" stroke="${INK}" stroke-width="1"/></g>`;
// un petit tas de cageots de citrons et de tomates
const itCrates=(x,y)=>shadow(x,y,18)+[[-10,0,"#ffe36a"],[10,0,"#e8434f"],[0,-11,"#ffe36a"]].map(([a,b,c])=>`<rect x="${x+a-9}" y="${y+b-11}" width="18" height="11" rx="1.5" fill="#d9a46a" ${K}/><path d="M${x+a-9} ${y+b-5.5} h18" stroke="#b8824a" stroke-width="1"/>`+[-5,0,5].map(d=>`<circle cx="${x+a+d}" cy="${y+b-12}" r="3" fill="${c}" stroke="${INK}" stroke-width="1"/>`).join("")).join("");
// des coquelicots dans l'herbe
const itPoppies=(x,y,n=9)=>Array.from({length:n},(_,i)=>{const a=((i*37)%60)-30,b=((i*23)%24)-12;return `<path d="M${x+a} ${y+b} v-7" stroke="#6aa676" stroke-width="1.4"/><circle cx="${x+a}" cy="${y+b-8}" r="3" fill="#e8434f" stroke="${INK}" stroke-width=".9"/><circle cx="${x+a}" cy="${y+b-8}" r=".9" fill="${INK}"/>`}).join("");
