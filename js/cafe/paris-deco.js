/* Café Frimousse : dessins ajoutés à la carte de Paris le 20/11/2026 (Joffray : « Paris c'est la mode, c'est le vélo,
   les lampadaires, l'art (la Joconde ?), le Louvre, je veux que ça respire Paris ; là c'est pareil, il y a trop de trous »).
   Chargé juste après paris.js ; posés par paMapSVG (paris.js). Les dégradés « pa-… » sont dans PA_DEFS. */

// la Joconde, en petit : fond de paysage brumeux, cheveux sombres, robe sombre, mains croisées, le sourire, cadre doré
const paMona=(x,y,w=22,h=30)=>{const f=n=>+n.toFixed(1),X=t=>f(x+w*t),Yy=t=>f(y+h*t);
  // le paysage en sfumato : ciel pâle, montagnes bleutées, chemin, terre sombre en bas
  let g=`<rect x="${x-2.6}" y="${y-2.6}" width="${w+5.2}" height="${h+5.2}" rx="1.6" fill="#d9a83a" stroke="${INK}" stroke-width="1.4"/><rect x="${x-1}" y="${y-1}" width="${w+2}" height="${h+2}" fill="none" stroke="#f6d27a" stroke-width=".8"/>`
    +`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c9cc9a"/>`
    +`<path d="M${x} ${Yy(.36)} Q${X(.12)} ${Yy(.26)} ${X(.24)} ${Yy(.33)} L${X(.3)} ${Yy(.5)} H${x}Z" fill="#8fa48c"/><path d="M${x+w} ${Yy(.3)} Q${X(.88)} ${Yy(.22)} ${X(.76)} ${Yy(.32)} L${X(.7)} ${Yy(.5)} H${x+w}Z" fill="#8fa48c"/>`
    +`<path d="M${x} ${Yy(.5)} H${x+w} V${y+h} H${x}Z" fill="#6f6a44"/><path d="M${X(.08)} ${Yy(.46)} q${f(w*.06)} ${f(h*.03)} ${f(w*.12)} 0" stroke="#d8c890" stroke-width=".6" fill="none"/>`;
  // les cheveux longs et le voile, les épaules, la robe sombre, les manches couleur miel
  g+=`<path d="M${X(.3)} ${Yy(.5)} Q${X(.28)} ${Yy(.12)} ${X(.5)} ${Yy(.1)} Q${X(.72)} ${Yy(.12)} ${X(.7)} ${Yy(.5)} Z" fill="#3a2a1e"/>`;
  g+=`<path d="M${X(.12)} ${y+h} Q${X(.14)} ${Yy(.56)} ${X(.36)} ${Yy(.5)} H${X(.64)} Q${X(.86)} ${Yy(.56)} ${X(.88)} ${y+h}Z" fill="#2f2a22"/>`
    +`<path d="M${X(.38)} ${Yy(.5)} Q${X(.5)} ${Yy(.6)} ${X(.62)} ${Yy(.5)}" fill="#e2bf86"/>`
    +`<path d="M${X(.14)} ${y+h} Q${X(.2)} ${Yy(.72)} ${X(.42)} ${Yy(.8)} L${X(.4)} ${y+h}Z M${X(.86)} ${y+h} Q${X(.8)} ${Yy(.72)} ${X(.58)} ${Yy(.8)} L${X(.6)} ${y+h}Z" fill="#a87a3a"/>`
    +`<ellipse cx="${X(.52)}" cy="${Yy(.86)}" rx="${f(w*.17)}" ry="${f(h*.055)}" fill="#e8c890"/><path d="M${X(.4)} ${Yy(.86)} q${f(w*.12)} ${f(-h*.03)} ${f(w*.24)} 0" stroke="#c9a070" stroke-width=".5" fill="none"/>`;
  // le visage, le regard, le sourire
  g+=`<ellipse cx="${X(.5)}" cy="${Yy(.31)}" rx="${f(w*.13)}" ry="${f(h*.14)}" fill="#e8c890"/><path d="M${X(.37)} ${Yy(.22)} Q${X(.5)} ${Yy(.14)} ${X(.63)} ${Yy(.22)}" stroke="#3a2a1e" stroke-width="${f(w*.05)}" fill="none"/>`
    +`<circle cx="${X(.45)}" cy="${Yy(.3)}" r="${f(w*.018+.2)}" fill="#3a2a1e"/><circle cx="${X(.56)}" cy="${Yy(.3)}" r="${f(w*.018+.2)}" fill="#3a2a1e"/>`
    +`<path d="M${X(.45)} ${Yy(.38)} Q${X(.5)} ${Yy(.4)} ${X(.56)} ${Yy(.375)}" stroke="#8a4a36" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
  return g};

// le Louvre : le palais (aile à toits d'ardoise, pavillon central à dôme carré), la pyramide de verre et ses deux petites,
// les bassins, et la bannière de la Joconde sur la façade
const paLouvre=(x,y)=>{let g=shadow(x,y-6,96);const f=n=>+n.toFixed(1);
  // le palais, derrière
  const wy=y-34;
  g+=`<rect x="${x-92}" y="${wy-44}" width="184" height="44" fill="url(#pa-stoneV)" ${BO}/>`;
  g+=`<path d="M${x-96} ${wy-44} L${x-88} ${wy-58} H${x+88} L${x+96} ${wy-44}Z" fill="#7d8aa0" ${BO}/>`+Array.from({length:12},(_,i)=>`<rect x="${x-82+i*14}" y="${wy-55}" width="5" height="7" rx="1.5" fill="#eef2f8" stroke="${INK}" stroke-width="1"/>`).join("");
  g+=Array.from({length:2},(_,r)=>Array.from({length:14},(_,i)=>`<rect x="${x-86+i*12.6}" y="${wy-38+r*18}" width="6" height="11" rx="2.6" fill="#bcd2e4" stroke="${INK}" stroke-width="1"/>`).join("")).join("");
  g+=`<rect x="${x-20}" y="${wy-58}" width="40" height="58" fill="url(#pa-stone)" ${BO}/><path d="M${x-24} ${wy-58} L${x-16} ${wy-80} H${x+16} L${x+24} ${wy-58}Z" fill="#6f7d94" ${BO}/><path d="M${x-8} ${wy-80} L${x} ${wy-88} L${x+8} ${wy-80}" fill="#6f7d94" ${BO2}/>`;
  g+=`<path d="M${x-9} ${wy} V${wy-8} Q${x-9} ${wy-15} ${x} ${wy-15} Q${x+9} ${wy-15} ${x+9} ${wy-8} V${wy}Z" fill="#8a6a54" ${BO2}/>`;
  // la bannière de la Joconde, sur le pavillon
  g+=`<path d="M${x-18} ${wy-60} H${x+18} V${wy-17} L${x} ${wy-21} L${x-18} ${wy-17}Z" fill="#c0485a" ${BO2}/>`+paMona(x-12,wy-56,24,28)+`<text x="${x}" y="${wy-23}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="4.4" fill="#fff">La Joconde</text>`;
  // le pavé de la cour et les bassins
  g+=`<path d="M${x-96} ${y+4} L${x-86} ${wy+2} H${x+86} L${x+96} ${y+4}Z" fill="#efe6d6" stroke="#d8c8ac" stroke-width="1.6"/>`;
  g+=[-58,58].map(a=>`<path d="M${x+a-22} ${y-6} L${x+a-18} ${y-16} H${x+a+18} L${x+a+22} ${y-6}Z" fill="#9fd3e8" ${K2}/><path d="M${x+a-12} ${y-11} q4 -2 8 0" stroke="#fff" stroke-width="1.2" fill="none"/>`).join("");
  // la grande pyramide de verre, et ses deux petites
  const pyr=(px,py,s)=>{const L=px-30*s,R=px+30*s,T=py-38*s;let p=`<path d="M${f(L)} ${py} L${px} ${f(T)} L${f(R)} ${py}Z" fill="#cfe6f2" fill-opacity=".9" ${BO}/>`;
    for(let i=1;i<5;i++){const t=i/5;p+=`<path d="M${f(L+(px-L)*t)} ${f(py-(py-T)*t)} L${f(R-(R-px)*t)} ${f(py-(py-T)*t)}" stroke="#8fb0c4" stroke-width="1"/><path d="M${f(L+(R-L)*t)} ${py} L${px} ${f(T)}" stroke="#8fb0c4" stroke-width="1"/>`}
    return p+`<path d="M${f(px-6*s)} ${f(py-30*s)} L${f(px-16*s)} ${f(py-12*s)}" stroke="#fff" stroke-width="${f(2.4*s)}" stroke-linecap="round" opacity=".8"/>`};
  g+=pyr(x,y-2,1.15)+pyr(x-34,y+6,.38)+pyr(x+34,y+6,.38);
  return g};

// une boutique de haute couture : devanture noire et lettres d'or, store rose rayé, deux vitrines avec des robes sur
// leurs mannequins, et des sacs de courses devant la porte
const paBoutique=(x,y)=>{let g=shadow(x,y,46);const L=x-40,R=x+40;
  g+=`<rect x="${L}" y="${y-92}" width="80" height="92" fill="url(#pa-stone)" ${BO}/><path d="M${L-3} ${y-92} L${L+6} ${y-110} H${R-6} L${R+3} ${y-92}Z" fill="url(#pa-zinc)" ${BO}/>`
    +[-22,0,22].map(o=>`<rect x="${x+o-6}" y="${y-86}" width="12" height="16" rx="2" fill="#bcd8ea" ${K2}/><path d="M${x+o-8} ${y-70} h16" stroke="${INK}" stroke-width="1.4"/>`).join("");
  g+=`<rect x="${L-2}" y="${y-56}" width="84" height="56" fill="#2f2a33" ${BO}/><rect x="${L+2}" y="${y-54}" width="76" height="10" fill="#2f2a33"/><text x="${x}" y="${y-46.4}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="7" fill="#f2c75c">Haute Couture</text>`;
  g+=`<path d="M${L-4} ${y-42} H${R+4} L${R} ${y-32} H${L}Z" fill="#fff" ${K2}/>`+Array.from({length:8},(_,i)=>`<path d="M${L+i*10} ${y-42} h5 l-.6 10 h-5Z" fill="#f49ab0"/>`).join("")+`<path d="M${L} ${y-32} ${Array.from({length:8},()=>"q5 4 10 0").join(" ")}" fill="#fff" ${K2}/>`;
  const win=(wx,c)=>`<rect x="${wx}" y="${y-30}" width="26" height="28" rx="2" fill="#fff4f2" stroke="#f2c75c" stroke-width="1.6"/>`
    +`<path d="M${wx+13} ${y-8} v6 M${wx+9} ${y-2} h8" stroke="${INK}" stroke-width="1.2"/><circle cx="${wx+13}" cy="${y-26}" r="2.4" fill="#e6d8c0" stroke="${INK}" stroke-width="1"/>`
    +`<path d="M${wx+9} ${y-23} Q${wx+13} ${y-25} ${wx+17} ${y-23} L${wx+19} ${y-8} H${wx+7}Z" fill="${c}" stroke="${INK}" stroke-width="1.2"/><path d="M${wx+9} ${y-17} h8" stroke="#fff" stroke-width="1" opacity=".7"/>`;
  g+=win(L+3,"#f47f9a")+win(R-29,"#5f7fb0");
  g+=`<rect x="${x-7}" y="${y-30}" width="14" height="30" rx="2" fill="#1f1a22" ${K2}/><circle cx="${x+4}" cy="${y-15}" r="1" fill="#f2c75c"/>`;
  g+=[[-14,"#f49ab0"],[10,"#fffaf2"]].map(([a,c])=>`<path d="M${x+a-5} ${y+6} V${y-4} H${x+a+5} V${y+6}Z" fill="${c}" ${K2}/><path d="M${x+a-2.6} ${y-4} q2.6 -5 5.2 0" fill="none" stroke="${INK}" stroke-width="1.1"/>`).join("");
  return g};

// un vélo de ville, avec son panier (baguette et fleurs) ; et une station de vélos en libre-service
const paBike=(x,y,c="#4f8a6a",basket=1,flip=0)=>`<g transform="translate(${x} ${y})${flip?" scale(-1 1)":""}">`
  +`<circle cx="-11" cy="-8" r="7.5" fill="none" stroke="${INK}" stroke-width="2.2"/><circle cx="11" cy="-8" r="7.5" fill="none" stroke="${INK}" stroke-width="2.2"/><circle cx="-11" cy="-8" r="1.4" fill="${INK}"/><circle cx="11" cy="-8" r="1.4" fill="${INK}"/>`
  +`<path d="M-11 -8 L-3 -8 L-6 -19 M-3 -8 L7 -19 H-6 M7 -19 L11 -8 M7 -19 L6 -24 H10" fill="none" stroke="${c}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/><path d="M-9 -20 h6" stroke="#7a4a36" stroke-width="3" stroke-linecap="round"/>`
  +(basket?`<rect x="9" y="-31" width="10" height="7" rx="1.5" fill="#d9a46a" stroke="${INK}" stroke-width="1.1"/><path d="M11 -31 l6 -9" stroke="#e2a45e" stroke-width="3.4" stroke-linecap="round"/><path d="M11 -31 l6 -9" stroke="${INK}" stroke-width=".8" opacity=".4"/><circle cx="17" cy="-33" r="2" fill="#f47f9a" stroke="${INK}" stroke-width=".8"/>`:"")+`</g>`;
const paBikes=(x,y)=>shadow(x,y,40)+`<rect x="${x-40}" y="${y-2}" width="80" height="4" rx="2" fill="#8a8f99" ${K2}/>`+[-27,-9,9,27].map((a,i)=>paBike(x+a,y,i%2?"#7fa898":"#6f9a8a",0)).join("")
  +`<rect x="${x+38}" y="${y-36}" width="8" height="36" rx="2" fill="#6f9a8a" ${K2}/><rect x="${x+39.5}" y="${y-32}" width="5" height="7" rx="1" fill="#e8f4fa"/>`;

// l'Arc de Triomphe : un gros bloc de pierre, la grande arche, l'attique, les bas-reliefs, le drapeau
const paArc=(x,y)=>{let g=shadow(x,y,46);
  g+=`<path d="M${x-38} ${y-74} H${x+38} V${y} H${x+14} V${y-36} Q${x+14} ${y-52} ${x} ${y-52} Q${x-14} ${y-52} ${x-14} ${y-36} V${y}H${x-38}Z" fill="url(#pa-stone)" ${BO}/><rect x="${x-41}" y="${y-86}" width="82" height="12" fill="url(#pa-stoneV)" ${BO}/><rect x="${x-39}" y="${y-92}" width="78" height="6" fill="url(#pa-stoneV)" ${BO2}/>`;
  g+=`<path d="M${x-14} ${y-38} Q${x} ${y-48} ${x+14} ${y-38}" stroke="#c9b394" stroke-width="1.4" fill="none"/>`;
  g+=[-27,27].map(a=>`<rect x="${x+a-8}" y="${y-44}" width="16" height="22" rx="1" fill="#e2d3b6" stroke="#c9b394" stroke-width="1.2"/><path d="M${x+a-4} ${y-26} q4 -12 8 0 M${x+a} ${y-38} v8" stroke="#b8a282" stroke-width="1.2" fill="none"/>`).join("");
  g+=`<path d="M${x-38} ${y-62} H${x+38}" stroke="#d6c4a2" stroke-width="2"/><path d="M${x} ${y-92} V${y-112}" stroke="${INK}" stroke-width="1.6"/><path d="M${x} ${y-112} h5 v8 h-5Z" fill="#5f7fb0" stroke="${INK}" stroke-width=".8"/><path d="M${x+5} ${y-112} h5 v8 h-5Z" fill="#fff" stroke="${INK}" stroke-width=".8"/><path d="M${x+10} ${y-112} h5 v8 h-5Z" fill="#c0485a" stroke="${INK}" stroke-width=".8"/>`;
  return g};

// le marchand de crêpes : carriole, enseigne, une crêpe qui cuit
const paCrepes=(x,y)=>shadow(x,y,26)+`<circle cx="${x-14}" cy="${y-5}" r="5" fill="#5b4250" ${K2}/><circle cx="${x+14}" cy="${y-5}" r="5" fill="#5b4250" ${K2}/><rect x="${x-24}" y="${y-30}" width="48" height="24" rx="3" fill="#5f7fb0" ${BO}/>`
  +`<rect x="${x-20}" y="${y-26}" width="40" height="8" rx="2" fill="#fffaf2" ${K2}/><text x="${x}" y="${y-20}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="5.6" fill="${INK}">Crêpes</text>`
  +`<path d="M${x-26} ${y-30} V${y-56} M${x+26} ${y-30} V${y-56}" stroke="${INK}" stroke-width="1.6"/><path d="M${x-30} ${y-56} H${x+30} L${x+26} ${y-48} H${x-26}Z" fill="#fff" ${K2}/>`+[0,1,2,3,4].map(i=>`<path d="M${x-28+i*12} ${y-56} h6 l-.8 8 h-6Z" fill="#c0485a"/>`).join("")
  +`<ellipse cx="${x+6}" cy="${y-31}" rx="9" ry="2.4" fill="#f2c27a" ${K2}/><path d="M${x+4} ${y-36} q1 -3 0 -6 M${x+9} ${y-36} q1 -3 0 -6" stroke="#c9b3a8" stroke-width="1.2" fill="none"/>`;

// l'École militaire, au bout du Champ-de-Mars : longue façade de pierre, pavillon central à colonnes et dôme carré, drapeau
const paEcole=(x,y)=>{let g=shadow(x,y,66);
  g+=`<rect x="${x-62}" y="${y-30}" width="124" height="30" fill="url(#pa-stoneV)" ${BO2}/><path d="M${x-65} ${y-30} L${x-58} ${y-40} H${x+58} L${x+65} ${y-30}Z" fill="#7d8aa0" ${BO2}/>`
    +Array.from({length:12},(_,i)=>i===5||i===6?"":`<rect x="${x-57+i*9.8}" y="${y-24}" width="5" height="9" rx="2" fill="#bcd2e4" stroke="${INK}" stroke-width=".9"/>`).join("");
  g+=`<rect x="${x-17}" y="${y-44}" width="34" height="44" fill="url(#pa-stone)" ${BO2}/>`+[-12,-4,4,12].map(a=>`<rect x="${x+a-1.6}" y="${y-36}" width="3.2" height="28" fill="#fffaf2" stroke="#c9b394" stroke-width=".8"/>`).join("")
    +`<path d="M${x-19} ${y-44} L${x} ${y-54} L${x+19} ${y-44}Z" fill="#f6eedf" ${BO2}/><path d="M${x-10} ${y-54} Q${x-10} ${y-66} ${x} ${y-68} Q${x+10} ${y-66} ${x+10} ${y-54}Z" fill="#6f7d94" ${BO2}/>`
    +`<path d="M${x} ${y-68} V${y-80}" stroke="${INK}" stroke-width="1.4"/><path d="M${x} ${y-80} h4 v6 h-4Z" fill="#5f7fb0" stroke="${INK}" stroke-width=".7"/><path d="M${x+4} ${y-80} h4 v6 h-4Z" fill="#fff" stroke="${INK}" stroke-width=".7"/><path d="M${x+8} ${y-80} h4 v6 h-4Z" fill="#c0485a" stroke="${INK}" stroke-width=".7"/>`
    +`<path d="M${x-6} ${y} V${y-10} Q${x} ${y-15} ${x+6} ${y-10} V${y}Z" fill="#8a6a54" stroke="${INK}" stroke-width="1.2"/>`;
  return g};

// une table de pique-nique en bois, nappe à carreaux, deux bancs, et ce qu'il faut dessus (20/11/2026, autour de la tour Eiffel)
const paPicnicTable=(x,y,v=0)=>{let g=shadow(x,y,22);
  g+=[-1,1].map(sd=>`<rect x="${x-20}" y="${y-(sd<0?3:15)}" width="40" height="4" rx="1.5" fill="#b8824a" ${K2}/>`).join("");
  g+=`<path d="M${x-14} ${y} L${x-10} ${y-9} M${x+14} ${y} L${x+10} ${y-9}" stroke="#8a5a34" stroke-width="2.4" stroke-linecap="round"/>`;
  g+=`<path d="M${x-18} ${y-9} H${x+18} L${x+15} ${y-17} H${x-15}Z" fill="#fff" ${K2}/>`+[0,1,2,3,4,5].map(i=>`<path d="M${x-16+i*6} ${y-9} l1.5 -8 h3 l-1.5 8Z" fill="${v?"#5f7fb0":"#f47f7f"}" opacity=".8"/>`).join("")+`<path d="M${x-18} ${y-13} H${x+18}" stroke="${v?"#5f7fb0":"#f47f7f"}" stroke-width="2.4" opacity=".5"/><path d="M${x-18} ${y-9} H${x+18} L${x+15} ${y-17} H${x-15}Z" fill="none" ${K2}/>`;
  g+=v?`<path d="M${x-8} ${y-15} l14 -4" stroke="#e2a45e" stroke-width="3.4" stroke-linecap="round"/><circle cx="${x+9}" cy="${y-17}" r="2.4" fill="#e8434f" stroke="${INK}" stroke-width=".8"/>`
    :`<rect x="${x-6}" y="${y-22}" width="10" height="7" rx="2" fill="#d9a46a" stroke="${INK}" stroke-width="1"/><path d="M${x-5} ${y-22} q4 -6 8 0" fill="none" stroke="${INK}" stroke-width="1"/><path d="M${x+8} ${y-15} v-7 h3 v7Z" fill="#7fb06a" stroke="${INK}" stroke-width=".8"/>`;
  return g};
