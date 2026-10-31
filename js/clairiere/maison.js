/* La Clairière : la maison de Roussette (demande de Joffray, 26/10/2026).
   Copeau répare la porte, Sésame l'ouvre (story.js) ; ensuite on touche la porte pour entrer. Dedans : la cheminée, le tapis,
   et les renards présents ; la nuit, tout le monde dort près du feu. Copeau agrandit la maison contre des glands (R.hup).
   Place : 6 renards au départ, 10 avec les coussins (le tapis est le coin dodo, demande de Joffray), 16 avec la mezzanine.
   Dessin refait le 29/10/2026 : cheminée en pierres, flamme image par image, souvenirs rangés dans la pièce (souvIcon). */
R.hup=R.hup||{};
const houseOpen=()=>!!STORIES.sesame&&storyDone("sesame");
const HOUSE={
  coussins:{name:"Coussins près du feu",price:30,desc:"Dix gros coussins sur le tapis : de quoi dormir à dix, tout près du feu."},
  etagere:{name:"Étagère à souvenirs",price:50,desc:"Copeau pose une étagère au mur : tous les souvenirs des histoires y sont rangés."},
  mezzanine:{name:"Mezzanine",price:120,desc:"Un étage en bois sous le toit, avec une échelle : six places de plus pour dormir."},
  // les objets de la maison (planche tools/objets-maison.html, 28/10/2026) : chacun attire un renard et donne une photo
  guirlandes:{name:"Guirlandes",price:40,desc:"Des fanions et des petites lumières au plafond. Juste pour faire joli."},
  couverture:{name:"Couverture tricotée",price:45,desc:"Tricotée par Mamie Brindille. Quelqu'un dort toujours dessous : on ne voit que ses oreilles."},
  fauteuil:{name:"Fauteuil près du feu",price:60,desc:"Un gros fauteuil moelleux. Le premier arrivé s'y roule en boule."},
  theiere:{name:"Théière et tasses",price:70,desc:"Une petite table, une théière, des tasses. L'après-midi, on y souffle sur son thé."},
  disque:{name:"Tourne-disque",price:90,desc:"Un vieux tourne-disque. Dès qu'il tourne, quelqu'un se met à danser."}
};
// l'objet et son renard, dessinés dans un cadre 200 × 160 (le même pour la maison et pour la photo) ; id vide = l'objet seul
const HOBJ={
  fauteuil:{in:"Dans le fauteuil",night:1,at:[4,226,.7],pose:"sleep"},
  couverture:{in:"Sous la couverture",night:1,at:[-10,380,.62],pose:"sleep"},
  theiere:{in:"À l'heure du thé",at:[262,238,.68],pose:"sit"},
  disque:{in:"En train de danser",at:[314,352,.5],pose:"happy"}
};
const hobjs=()=>Object.keys(HOBJ).filter(k=>R.hup[k]);
const hPlace=k=>{const [x,y,s]=HOBJ[k].at;return `translate(${x} ${y}) scale(${s})`};
// le fond d'une photo prise dans la maison
const houseBack=()=>`<defs><linearGradient id="hbW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ecc08e"/><stop offset="1" stop-color="#d9a46e"/></linearGradient></defs><rect width="200" height="160" fill="url(#hbW)"/>${[18,54,90,126,162,198].map(x=>`<path d="M${x} 0 V90" stroke="#c08a5c" stroke-width="2"/><path d="M${x+10} 14 q2 22 0 40" stroke="#f6d3a4" stroke-width="1.2" fill="none" opacity=".7"/>`).join("")}<rect y="84" width="200" height="22" fill="#c98f5c"/><path d="M0 84 H200" stroke="#a8724c" stroke-width="3"/><rect y="104" width="200" height="56" fill="#b9814a"/><path d="M0 104 H200" stroke="#7a4f34" stroke-width="3"/><path d="M0 124 H200 M0 146 H200" stroke="#8a5a32" stroke-width="2"/>`;
// les places, dans le repère 400 × 480 : autour du feu, puis sur la mezzanine
// sur le tapis : deux rangées et un au milieu devant ; les 6 premières sans les coussins
const SEATS=[[96,384],[148,384],[200,384],[252,384],[294,384],[200,452],[122,426],[174,426],[226,426],[278,426]],UPSTAIRS=[[50,112],[100,112],[150,112],[230,112],[280,112],[330,112]];
const seats=()=>{const busy=hobjs().map(k=>{const [x,y,s]=HOBJ[k].at;return [x+100*s,y+120*s]});
  const rug=R.hup.coussins?SEATS:SEATS.slice(0,6);
  return (R.hup.mezzanine?rug.concat(UPSTAIRS):rug).filter(([x,y])=>!busy.some(([bx,by])=>Math.hypot(bx-x,by-y)<70))};

// la porte, touchable une fois la maison ouverte
const doorEl=document.createElement("button");doorEl.className="doorbtn";doorEl.type="button";doorEl.setAttribute("aria-label","Entrer dans la maison");
doorEl.style.cssText=pc(200,170)+";z-index:240";
doorEl.onpointerdown=e=>{e.stopPropagation();if(storyTap("@porch"))return;if(gameOn||!$("talk").hidden||!$("sheet").hidden)return;
  if(!houseOpen()){log("La porte est fermée. Elle ne s'est jamais ouverte, d'aussi loin qu'on se souvienne.");return}
  enterHouse()};
$("actors").appendChild(doorEl);

let houseEl=null;
const hL=(w=2.6)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const hG=(id,a,b,x2=0,y2=1)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
// un souvenir, posé sur (0,0) : environ 14 de large, 16 de haut
function souvIcon(id){const l=hL(1.6);return ({
  petitpois:`<ellipse cx="0" cy="-6" rx="5" ry="6" fill="#c98a4a" ${l}/><path d="M-6.4 -9 Q0 -17 6.4 -9 Q0 -6.6 -6.4 -9Z" fill="#8a5a3a" ${l}/><path d="M0 -14 q1 -3 3 -3.4" fill="none" ${l}/><path d="M-2 -5 v3" stroke="#e8b47c" stroke-width="1.4" stroke-linecap="round"/>`,
  mitaine:`<path d="M-5 0 V-9 Q-5 -15 0 -15 Q5 -15 5 -9 V0Z" fill="#7cb8e0" ${l}/><path d="M-5 -7 Q-9 -8 -8 -4 Q-7 -2 -5 -3" fill="#7cb8e0" ${l}/><rect x="-5.6" y="-2.6" width="11.2" height="3" rx="1" fill="#fff" ${l}/><path d="M0 -12 v5 M-2.2 -10.8 l4.4 2.6 M-2.2 -8.2 l4.4 -2.6" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>`,
  galette:`<ellipse cx="0" cy="-3" rx="7" ry="3.2" fill="#b9b0a8" ${l}/><ellipse cx="-1.6" cy="-4" rx="3.4" ry="1.2" fill="#ddd6ce"/>`,
  pantoufle:`<path d="M-7 0 Q-8 -6 -2 -7 Q4 -8 7 -4 Q8 0 4 0Z" fill="#f2b8c4" ${l}/><path d="M-3 -6.6 Q2 -9 6 -4.6" fill="none" stroke="#fffaf3" stroke-width="2.6" stroke-linecap="round"/><circle cx="-1" cy="-8" r="2.6" fill="#fffaf3" ${l}/>`,
  grignote:`<g transform="rotate(-8)"><path d="M-5 0 V-15 H3 L5 -13 V0Z" fill="#fffaf2" ${l}/><path d="M-3 -11 h5 M-3 -8 h6 M-3 -5 h4" stroke="#b9a89a" stroke-width="1"/></g>`,
  biscuit:`<path d="M-7 0 L7 0 L0 -12Z" fill="#f6d39a" ${l}/><path d="M-7 0 L7 0 L6 -3 L-6 -3Z" fill="#d9a05a" ${l}/><circle cx="-1" cy="-6" r="1.2" fill="#e2546e"/><circle cx="2" cy="-4.6" r="1" fill="#e2546e"/>`,
  cannelle:`<path d="M0 0 V-4 M0 -4 L-7 -7 L-4 -8 L-6 -12 L-2 -10.6 L0 -15 L2 -10.6 L6 -12 L4 -8 L7 -7Z" fill="#f2c45a" ${l}/><path d="M0 -4 V-12" stroke="#c99a3a" stroke-width="1"/>`,
  charbon:`<rect x="-2" y="-14" width="4.6" height="14" rx="1.4" fill="#3d2a35" transform="rotate(18)" ${l}/><path d="M-1 -12 v4" stroke="#6a5a66" stroke-width="1" transform="rotate(18)"/>`,
  brume:`<path d="M0 -15 Q6 -6 5 -4 Q4 1 0 1 Q-4 1 -5 -4 Q-6 -6 0 -15Z" fill="#9fd4f2" ${l}/><path d="M-2 -8 q-1 3 0 5" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
  painepice:`<path d="M0 -1 C-10 -7 -7 -15 0 -10.6 C7 -15 10 -7 0 -1Z" fill="#c98a54" ${l}/><path d="M0 -3.4 C-6.6 -7.6 -4.8 -12.6 0 -9.2 C4.8 -12.6 6.6 -7.6 0 -3.4Z" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="1.6 1.2"/>`,
  libellule:`<ellipse cx="0" cy="-3.4" rx="6.6" ry="3.6" fill="#8fa8c4" ${l}/><ellipse cx="-2" cy="-4.6" rx="2.6" ry="1" fill="#e4eef8"/>`,
  brioche:`<g transform="rotate(6)"><rect x="-6" y="-13" width="12" height="13" rx="1.4" fill="#fff4e0" ${l}/><path d="M0 -9 C-3 -11 -3.6 -8 0 -6.4 C3.6 -8 3 -11 0 -9Z" fill="#e2546e"/><path d="M-4 -4 h8 M-4 -2 h6" stroke="#c9a88a" stroke-width="1"/></g>`,
  copeau:`<path d="M0 0 V-12" stroke="#9aa0aa" stroke-width="2.6" stroke-linecap="round"/><path d="M0 0 V-12" stroke="${INK}" stroke-width="4.4" stroke-linecap="round" opacity=".0"/><rect x="-4" y="-14" width="8" height="2.6" rx="1" fill="#b9bec6" ${l}/><path d="M-.6 -10 v8" stroke="#dfe3e8" stroke-width="1"/>`,
  marquis:`<path d="M0 -7 L-7 -12 L-7 -2Z M0 -7 L7 -12 L7 -2Z" fill="#b48ae0" ${l}/><circle cx="0" cy="-7" r="2.2" fill="#8a62c4" ${l}/><path d="M-1 -5 l-2 5 M1 -5 l2 5" stroke="#b48ae0" stroke-width="2" stroke-linecap="round"/>`,
  zaza:`<path d="M-6 -2 Q-6 -13 0 -13 Q6 -13 6 -2Z" fill="#f2c45a" ${l}/><path d="M-7 -2 h14" ${l}/><circle cx="0" cy="-15" r="1.6" fill="none" ${l}/><circle cx="0" cy="0" r="1.6" fill="#c99a3a" ${l}/><path d="M-3 -10 q1 -2 3 -2" stroke="#fff" stroke-width="1.2" fill="none"/>`,
  noisette:`<rect x="-6" y="-14" width="11" height="14" rx="1.6" fill="#7aa86a" ${l}/><path d="M-6 -14 h2 v14 h-2" fill="#5f8a52"/><rect x="2" y="-14" width="2" height="14" fill="#e2546e" opacity=".8"/><rect x="-2" y="-11" width="5" height="3" rx=".6" fill="#fffaf2"/>`,
  givre:`<path d="M-6 0 h12 l-1 -2.6 h-10Z" fill="#9ec3ef" ${l}/><circle cx="0" cy="-8" r="6" fill="#fbfdff" ${l}/><circle cx="-2" cy="-10" r="1.6" fill="#fff"/><path d="M2 -6 l1.4 1" stroke="#cfe0f2" stroke-width="1"/>`,
  comete:`<circle cx="0" cy="-8" r="9" fill="#fff3a0" opacity=".35"/><path d="M0 -16 L3 -9 L1 -1 L-3 -6Z" fill="#ffe680" ${l}/><path d="M0 -14 L1.4 -9" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>`,
  somnus:`<path d="M-7 0 Q-6 -10 2 -11 Q8 -11 10 -5 Q6 -7 5 0Z" fill="#7a86c4" ${l}/><rect x="-8" y="-2.6" width="14" height="3.4" rx="1.6" fill="#fffaf3" ${l}/><circle cx="10" cy="-4" r="2.4" fill="#fffaf3" ${l}/>`,
  reglisse:`<rect x="-7" y="-6" width="14" height="6" rx="3" fill="#f0dfb8" ${l}/><path d="M-4 -3 q3 -2 5 0 t4 -1" fill="none" stroke="#e2546e" stroke-width="1.2" stroke-dasharray="1.4 1"/><ellipse cx="-7" cy="-3" rx="1.6" ry="3" fill="#d9c49a" ${l}/>`,
  aurore:`<path d="M-7 0 Q-8 -8 -2 -9 Q4 -10 3 -5 Q2 -1 -2 -3 Q-4 -7 2 -13 Q6 -16 8 -12" fill="none" stroke="#3d2a35" stroke-width="4.4" stroke-linecap="round"/><path d="M-7 0 Q-8 -8 -2 -9 Q4 -10 3 -5 Q2 -1 -2 -3 Q-4 -7 2 -13 Q6 -16 8 -12" fill="none" stroke="url(#hRib)" stroke-width="2.6" stroke-linecap="round"/>`,
  maree:`<ellipse cx="0" cy="-3.4" rx="6.6" ry="3.4" fill="#a9a0b6" ${l}/>${[-4,-1.4,1.2,3.8].map(x=>`<circle cx="${x}" cy="-3.6" r=".9" fill="#fff" opacity=".85"/>`).join("")}`,
  perle:`<path d="M-7 -2 Q-7 -10 0 -10 Q7 -10 7 -2Z" fill="#f6d6e4" ${l}/><path d="M-7 -2 Q0 2 7 -2" fill="#f2c0d4" ${l}/><circle cx="0" cy="-3.6" r="2.8" fill="#fffaf2" ${l}/><circle cx="-.8" cy="-4.4" r=".8" fill="#fff"/>`,
  yeti:`<path d="M-6 0 Q-9 -4 -5 -7 Q-6 -12 -1 -11 Q1 -15 4 -11 Q8 -11 7 -6 Q9 -2 5 0Z" fill="#fbfdff" ${l}/><path d="M-2 -6 q2 -2 4 0" stroke="#d9e4f0" stroke-width="1" fill="none"/>`
})[id]||`<rect x="-6" y="-11" width="12" height="11" rx="1.6" fill="#f6a5b4" ${l}/><path d="M0 -11 v11 M-6 -6 h12" stroke="#fff" stroke-width="1.6"/>`}
// où va chaque souvenir : quelques-uns ont leur place à eux, les autres vont sur l'étagère, puis sur le linteau et le rebord de la fenêtre
const SOUV_SPOT={gribouille:1,gaston:1,luciole:1,flocon:1,moka:1,sesame:1,plouf:1,brindille:1};
const SOUV_SLOTS=[...[208,232,256,280].flatMap(y=>[295,311,327,343].map(x=>[x,y])),[152,184],[166,184],[180,184],[222,184],[236,184],[250,184],[36,226],[52,226]];
function souvSpecial(id,night){const l=hL(1.8);return ({
  // le grand portrait du refuge, encadré au-dessus de l'étagère
  gribouille:`<rect x="298" y="148" width="42" height="32" rx="2" fill="#c99a3a" ${hL(2.4)}/><rect x="302" y="152" width="34" height="24" fill="#bfe3f2"/><path d="M302 168 Q319 162 336 168 V176 H302Z" fill="#a9d68f"/>${[[308,170,"#e8915c"],[315,168,"#f6f1ea"],[322,169,"#d9764c"],[329,170,"#8a7f8a"]].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.4" fill="${c}" stroke="${INK}" stroke-width="1"/>`).join("")}<rect x="302" y="152" width="34" height="24" fill="none" stroke="${INK}" stroke-width="1.4"/><path d="M319 148 L314 140 L324 140Z" fill="none" stroke="${INK}" stroke-width="1.4"/>`,
  // la vieille canne de Gaston, appuyée au mur à côté de la cheminée
  gaston:`<path d="M274 300 L279 204" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M274 300 L279 204" stroke="#a9785a" stroke-width="2.6" stroke-linecap="round"/><circle cx="275" cy="280" r="4" fill="#9aa0aa" ${hL(1.4)}/><path d="M279 204 Q282 222 280 238" fill="none" stroke="#fff" stroke-width="1"/><path d="M280 238 v4" stroke="#e0564f" stroke-width="3" stroke-linecap="round"/>`,
  // les deux bocaux de lumière, aux bouts du linteau
  luciole:`<circle cx="132" cy="172" r="${night?18:12}" fill="#ffe680" opacity="${night?.4:.25}"/><rect x="125" y="164" width="14" height="20" rx="4" fill="#fff6c0" ${l}/><circle cx="132" cy="174" r="4" fill="#ffe680"/><rect x="126" y="160" width="12" height="5" rx="1.6" fill="#a8785a" ${l}/>`,
  flocon:`<circle cx="268" cy="172" r="${night?18:12}" fill="#cfe8ff" opacity="${night?.4:.25}"/><rect x="261" y="164" width="14" height="20" rx="4" fill="#e8f4ff" ${l}/><circle cx="268" cy="173" r="2.6" fill="#ffe680"/><path d="M266 171 l-3 -2 M270 171 l3 -2" stroke="#fff" stroke-width="1.2"/><rect x="262" y="160" width="12" height="5" rx="1.6" fill="#7cb8e0" ${l}/>`,
  // la montre qui retarde, au milieu du linteau, à la place de la pendule
  moka:`<path d="M200 166 q-6 -8 0 -12 q6 4 0 12" fill="none" stroke="#c99a3a" stroke-width="1.6"/><circle cx="200" cy="174" r="10" fill="#f2c45a" ${hL(2.2)}/><circle cx="200" cy="174" r="7" fill="#fffaf2" ${hL(1.4)}/><path d="M200 174 v-4.6 M200 174 l-3 2.4" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/><rect x="198" y="161" width="4" height="4" rx="1" fill="#c99a3a" ${hL(1.2)}/>`,
  // la clé de la maison, pendue à un clou entre la fenêtre et la cheminée
  sesame:`<circle cx="114" cy="150" r="1.8" fill="#9aa0aa" ${hL(1.2)}/><path d="M114 151 L114 156" stroke="#c43a5a" stroke-width="1.4"/><circle cx="114" cy="160" r="4" fill="#f2c45a" ${l}/><circle cx="114" cy="160" r="1.4" fill="#fff8dc"/><path d="M114 164 v10 h3 m-3 -3 h2.4" fill="none" stroke="#f2c45a" stroke-width="2.6" stroke-linecap="round"/>`,
  // les petites bottes de Plouf, qui sèchent au bord du foyer
  plouf:`<path d="M140 316 V302 h6 v9 h4 v5Z M151 316 V303 h6 v8 h4 v5Z" fill="#f2c45a" ${l}/><path d="M140 304 h6 M151 305 h6" stroke="#fff" stroke-width="1.4" opacity=".7"/>`,
  // les chaussettes de Mamie Brindille, accrochées au linteau
  brindille:`<path d="M150 198 v12 q0 4 4 4 h5 v-4 h-4 v-12Z" fill="#f2a6a0" ${l}/><path d="M164 198 v13 q0 4 4 4 h5 v-4 h-4 v-13Z" fill="#9ec3ef" ${l}/><path d="M150 201 h5 M164 201 h5" stroke="#fff" stroke-width="1.6"/><circle cx="153" cy="207" r="1.2" fill="#8a5a3a"/><circle cx="167" cy="208" r="1.2" fill="#8a5a3a"/>`
})[id]||""}
function souvSVG(night){if(!R.hup.etagere)return "";const ids=Object.keys(R.souv);let s="",k=0;
  // la bibliothèque : fond, montants, quatre planches
  s+=`<rect x="282" y="186" width="72" height="100" rx="3" fill="#8a5a3a" ${hL(2.6)}/><rect x="286" y="190" width="64" height="94" fill="#6e4530"/>`+[208,232,256,280].map(y=>`<rect x="284" y="${y}" width="68" height="5" rx="1.4" fill="url(#hShelf)" ${hL(1.8)}/><rect x="286" y="${y+5}" width="64" height="3" fill="#2a1a20" opacity=".25"/>`).join("");
  for(const id of ids){if(SOUV_SPOT[id]){s+=souvSpecial(id,night);continue}const p=SOUV_SLOTS[k++];if(!p)continue;s+=`<g transform="translate(${p[0]} ${p[1]})">${souvIcon(id)}</g>`}
  return s}
// une image de la flamme : des langues de feu dont la hauteur et le balancement suivent l'image i (sur 10, en boucle)
function flameD(w,h,n,seed,i){const t=i/10*Math.PI*2,cx=200,base=292,f=v=>v.toFixed(1),tips=[];
  for(let j=0;j<n;j++){const u=(j+.5)/n,env=n>1?.55+.45*Math.sin(u*Math.PI):1;
    tips.push([cx-w/2+w*u+3.4*Math.sin(t+j*1.7+seed),base-h*env*(.8+.2*Math.sin(t*2+j*2.3+seed))])}
  let d=`M${f(cx-w/2)} ${base} Q${f(tips[0][0]-w/n*.6)} ${f(base-(base-tips[0][1])*.45)} ${f(tips[0][0])} ${f(tips[0][1])}`;
  for(let j=1;j<n;j++){const [x0,y0]=tips[j-1],[x1,y1]=tips[j];d+=` Q${f((x0+x1)/2)} ${f(Math.max(y0,y1)+h*.32)} ${f(x1)} ${f(y1)}`}
  const [xl,yl]=tips[n-1];return d+` Q${f(xl+w/n*.6)} ${f(base-(base-yl)*.45)} ${f(cx+w/2)} ${base} Q${cx} ${base+6} ${f(cx-w/2)} ${base}Z`}
function houseSVG(){
  const night=dark(),wet=scn.rain,sky=night?["#1f2540","#3a4062"]:wet?["#a3b1bf","#d2dae0"]:["#9fcbe8","#e8f5fb"],has=id=>R.hup.etagere&&R.souv[id];
  let s=`<defs>${hG("hsky",sky[0],sky[1])}${hG("hWall","#ecc08e","#d9a46e")}${hG("hFloor","#c48a54","#a8703f")}${hG("hBeam","#9a6a48","#7a4f34")}${hG("hPanel","#c98f5c","#b27a4a")}
    ${hG("hStone","#dcd3cc","#b2a69e")}${hG("hBrick","#7a3a30","#4a2420")}${hG("hMantel","#b58058","#7f5236")}${hG("hShelf","#c08a5c","#9a6a44")}${hG("hFrame","#a8724c","#7a4a31",1,1)}${hG("hHill",night?"#3c4a7a":"#a9d08e",night?"#2e3a66":"#88bb74")}
    ${hG("hLog","#8a5a3a","#5e3a26")}<linearGradient id="hRib" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff9ab0"/><stop offset=".5" stop-color="#ffe07a"/><stop offset="1" stop-color="#8fd0ff"/></linearGradient>
    <radialGradient id="hfire" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#ffcf6a" stop-opacity="${night?.6:.42}"/><stop offset=".55" stop-color="#ffb24a" stop-opacity="${night?.22:.14}"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient>
    <radialGradient id="hVig" cx=".5" cy=".55" r=".75"><stop offset=".55" stop-color="#2a1a20" stop-opacity="0"/><stop offset="1" stop-color="#2a1a20" stop-opacity="${night?.5:.28}"/></radialGradient>
    <radialGradient id="hEmber"><stop offset="0" stop-color="#fff0a0"/><stop offset=".45" stop-color="#ff9a3a"/><stop offset="1" stop-color="#b8402a" stop-opacity="0"/></radialGradient>
    <radialGradient id="hInner" cx=".5" cy=".85" r=".8"><stop offset="0" stop-color="#ffb24a" stop-opacity=".7"/><stop offset="1" stop-color="#ff7a3a" stop-opacity="0"/></radialGradient>
    <pattern id="hGrain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".5" fill="#5b4250" opacity=".08"/><circle cx="5" cy="5.5" r=".45" fill="#5b4250" opacity=".06"/></pattern></defs>
    <style>.hsp{animation:hsp 1.8s ease-out infinite;opacity:0}@keyframes hsp{0%{transform:translate(0,0);opacity:0}15%{opacity:1}100%{transform:translate(6px,-56px);opacity:0}}
    .hglo{animation:hglo 1.6s ease-in-out infinite alternate}@keyframes hglo{from{opacity:.75}to{opacity:1}}
    @media (prefers-reduced-motion:reduce){.hsp,.hglo{animation:none}.hsp{opacity:0}}</style>`;
  // murs en planches veinées, clous, soubassement en panneaux
  s+=`<rect width="400" height="300" fill="url(#hWall)"/>`;
  for(let i=0;i<12;i++){const x=i*36+10;s+=`<path d="M${x} 0 V300" stroke="#c08a5c" stroke-width="2.4"/><path d="M${x+8} ${30+i*17%60} q3 40 0 80 M${x+20} ${120+i*23%70} q-3 30 0 60" fill="none" stroke="#f6d3a4" stroke-width="1.4" stroke-linecap="round" opacity=".7"/><circle cx="${x+5}" cy="40" r="1.4" fill="#9a6a48"/><circle cx="${x+5}" cy="232" r="1.4" fill="#9a6a48"/>`}
  s+=`<rect y="246" width="400" height="54" fill="url(#hPanel)" ${hL(2.4)}/>`+[0,1,2,3,4,5].map(i=>`<rect x="${i*68+8}" y="254" width="56" height="38" rx="4" fill="none" stroke="#9a6a44" stroke-width="2"/><path d="M${i*68+12} 258 h48" stroke="#e3ac78" stroke-width="1.4" opacity=".7"/>`).join("")+`<rect x="-4" y="242" width="408" height="8" rx="3" fill="#a8724c" ${hL(2.4)}/>`;
  // poutres du plafond, bouquet d'herbes qui sèche
  s+=`<rect x="-4" y="-4" width="408" height="22" fill="url(#hBeam)" ${hL(2.6)}/><path d="M20 8 h70 M290 9 h70" stroke="#b58058" stroke-width="1.6" stroke-linecap="round"/>`;
  s+=`<path d="M100 18 v14" stroke="#8a6a3e" stroke-width="1.6"/><g transform="translate(100 34)"><path d="M0 0 l-8 22 M0 0 l-2 26 M0 0 l5 24 M0 0 l10 18" stroke="#6f9a60" stroke-width="2.4" stroke-linecap="round"/>${[[-7,18],[-2,22],[4,20],[9,14],[-4,10],[3,8]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.6" fill="#8fc07e"/>`).join("")}<rect x="-4" y="-2" width="8" height="5" rx="1.4" fill="#e2546e" ${hL(1.4)}/></g>`;
  // plancher en lattes
  s+=`<path d="M0 300 H400 V480 H0Z" fill="url(#hFloor)"/>`+[322,350,382,418,458].map(y=>`<path d="M0 ${y} H400" stroke="#8a5a32" stroke-width="2.4"/><path d="M0 ${y+3} H400" stroke="#d9a06a" stroke-width="1" opacity=".5"/>`).join("")
    +[[60,300,322],[180,322,350],[320,300,322],[90,350,382],[250,350,382],[30,382,418],[200,382,418],[350,418,458],[120,418,458],[280,458,480]].map(([x,a,b])=>`<path d="M${x} ${a} V${b}" stroke="#8a5a32" stroke-width="2"/>`).join("")
    +`<rect y="296" width="400" height="8" fill="#7a4f34" ${hL(2)}/>`;
  // fenêtre ronde : épais cadre en bois, rideaux noués, le dehors à l'heure réelle
  s+=`<g filter="url(#wobble)"><path d="M18 150 Q28 196 20 236 L30 236 Q40 196 30 150Z M106 150 Q96 196 104 236 L94 236 Q84 196 94 150Z" fill="#f6b8c4" stroke="#d98a9a" stroke-width="1.6"/>
    <circle cx="62" cy="186" r="40" fill="url(#hFrame)" ${hL(3)}/><circle cx="62" cy="186" r="32" fill="url(#hsky)" ${hL(2.4)}/>
    <path d="M30 196 Q46 178 62 190 Q78 176 94 192 L94 214 L30 214Z" fill="url(#hHill)"/><circle cx="44" cy="190" r="7" fill="${night?"#2e4a5a":"#6fa070"}"/><circle cx="82" cy="188" r="6" fill="${night?"#2e4a5a":"#6fa070"}"/>
    ${night?`<circle cx="74" cy="170" r="5.5" fill="#fff6c8"/>`+[[46,166],[56,160],[84,180],[40,178]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".9" fill="#fff8dc"/>`).join(""):`<path d="M44 168 q4 -5 9 -2 q4 -4 8 1 q-8 4 -17 1Z" fill="#fff" opacity=".85"/>`}
    <circle cx="62" cy="186" r="32" fill="none" ${hL(2.4)}/><path d="M62 154 V218 M30 186 H94" stroke="#7a4a31" stroke-width="4"/>${[0,90,180,270].map(a=>`<circle cx="${(62+36*Math.cos((a+45)*Math.PI/180)).toFixed(1)}" cy="${(186+36*Math.sin((a+45)*Math.PI/180)).toFixed(1)}" r="1.8" fill="#f2c45a" ${hL(1)}/>`).join("")}
    <path d="M38 168 L52 152" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="${night?.15:.5}"/>
    <path d="M18 226 q8 -6 14 2 M106 226 q-8 -6 -14 2" fill="none" stroke="#c4566e" stroke-width="3" stroke-linecap="round"/>
    <rect x="20" y="226" width="84" height="8" rx="3" fill="url(#hMantel)" ${hL(2.2)}/><path d="M84 226 h12 l-2 -10 h-8Z" fill="#e0855c" ${hL(1.8)}/><circle cx="86" cy="211" r="4.4" fill="#8fc07e" ${hL(1.4)}/><circle cx="93" cy="209" r="4" fill="#9cd488" ${hL(1.4)}/></g>`;
  if(wet)s+=`<g stroke="#fff" stroke-width="1.6" opacity=".8" stroke-linecap="round">${[40,52,66,80,88].map((x,i)=>`<path d="M${x} ${162+i*7} l-3 9"/>`).join("")}</g>`;
  if(night)s+=`<rect width="400" height="480" fill="#241a3a" opacity=".3"/>`;
  s+=`<ellipse cx="200" cy="300" rx="${night?250:200}" ry="${night?220:170}" fill="url(#hfire)" class="hglo"/>`;
  // la cheminée : un conduit de pierres jusqu'au plafond, un linteau sur consoles, un foyer en briques
  const stoneRow=(x0,x1,y,h,off)=>{let r="",x=x0-(off?12:0);while(x<x1){const w=20+((x*7+y*3)%9);const a=Math.max(x,x0),b=Math.min(x+w,x1);if(b-a>5)r+=`<rect x="${a+1}" y="${y+1}" width="${b-a-2}" height="${h-2}" rx="4" fill="url(#hStone)" stroke="${INK}" stroke-width="1.8"/><path d="M${a+4} ${y+3.6} h${Math.max(2,(b-a)*.45)}" stroke="#f0ebe6" stroke-width="1.4" stroke-linecap="round"/>`;x+=w}return r};
  s+=`<g filter="url(#wobble)"><path d="M150 0 H250 V186 H150Z" fill="#9a8f88" ${hL(2.8)}/>`;
  for(let y=18,i=0;y<186;y+=16,i++)s+=stoneRow(152,248,y,16,i%2);
  s+=`<path d="M128 304 V200 H272 V304Z" fill="#9a8f88" ${hL(3)}/>`;
  for(let y=200,i=0;y<304;y+=17,i++)s+=stoneRow(130,270,y,17,i%2);
  // le foyer : voûte en briques, fond sombre, suie
  s+=`<path d="M154 304 V250 Q200 212 246 250 V304Z" fill="url(#hBrick)" ${hL(3)}/>`+[262,276,290].map((y,i)=>`<path d="M${158} ${y} H242" stroke="#2a1416" stroke-width="1.4" opacity=".6"/>`+[0,1,2,3,4].map(j=>`<path d="M${168+j*18+(i%2)*9} ${y} v-14" stroke="#2a1416" stroke-width="1.2" opacity=".5"/>`).join("")).join("")
    +`<path d="M158 250 Q200 218 242 250 L242 262 Q200 236 158 262Z" fill="#1a1012" opacity=".55"/><path d="M154 304 V250 Q200 212 246 250 V304Z" fill="url(#hInner)"/>`;
  s+=`<path d="M150 250 Q200 206 250 250" fill="none" stroke="${INK}" stroke-width="3"/>${[156,166,178,190,200,210,222,234,244].map(x=>{const t=(x-150)/100,y=250-Math.sin(t*Math.PI)*36;return `<path d="M${x} ${y.toFixed(1)} l${((x-200)*.12).toFixed(1)} 9" stroke="${INK}" stroke-width="2"/>`}).join("")}`;
  // linteau épais sur deux consoles
  s+=`<path d="M132 198 h12 l-4 12 h-6Z M256 198 h12 l-2 12 h-6Z" fill="#7f5236" ${hL(2)}/><rect x="114" y="184" width="172" height="15" rx="3" fill="url(#hMantel)" ${hL(3)}/><path d="M122 189 q30 -2 60 0 M200 190 q36 2 72 0" fill="none" stroke="#d9a06a" stroke-width="1.4" stroke-linecap="round"/><rect x="114" y="198" width="172" height="4" fill="#2a1a20" opacity=".2"/>`;
  // l'âtre en pierre
  s+=`<path d="M118 304 H282 L290 318 H110Z" fill="#a89c94" ${hL(2.6)}/><path d="M120 307 h160" stroke="#d6ccc4" stroke-width="1.6"/></g>`;
  // chenets, bûches, braises, flammes, étincelles
  s+=`<path d="M170 300 v-10 q0 -4 4 -4 M230 300 v-10 q0 -4 -4 -4" fill="none" stroke="#3d2a35" stroke-width="3" stroke-linecap="round"/><circle cx="174" cy="284" r="2.6" fill="#f2c45a" stroke="${INK}" stroke-width="1.2"/><circle cx="226" cy="284" r="2.6" fill="#f2c45a" stroke="${INK}" stroke-width="1.2"/>`;
  s+=`<ellipse cx="200" cy="296" rx="44" ry="9" fill="url(#hEmber)" class="hglo"/>`;
  s+=`<g ${hL(2.4)}><path d="M166 296 L232 286 L234 294 L168 304Z" fill="url(#hLog)"/><ellipse cx="233" cy="290" rx="3.4" ry="4.4" fill="#e3b583"/><path d="M168 286 L234 298 L232 306 L166 294Z" fill="url(#hLog)"/><ellipse cx="167" cy="290" rx="3.4" ry="4.4" fill="#e3b583"/></g><path d="M180 290 l12 -2 M206 296 l14 2" stroke="#3d2618" stroke-width="1.4" stroke-linecap="round"/>`;
  // la flamme, dessinée image par image : dix images qui défilent en boucle (demande de Joffray), quatre couches
  s+=[[64,80,4,"#f2763a",1,.3],[46,62,3,"#ffb347",0,1.9],[28,42,2,"#ffe680",0,3.1],[12,18,1,"#fff8d8",0,4.4]].map(([w,h,n,c,ink,seed])=>
    `<path fill="${c}"${ink?` ${hL(2.4)}`:""} d="${flameD(w,h,n,seed,0)}"><animate attributeName="d" dur="1s" repeatCount="indefinite" calcMode="discrete" values="${Array.from({length:10},(_,i)=>flameD(w,h,n,seed,i)).join(";")}"/></path>`).join("");
  s+=[[186,258,0],[208,250,.6],[198,262,1.1],[214,262,1.5]].map(([x,y,d])=>`<circle class="hsp" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="1.6" fill="#ffd36a"/>`).join("");
  // outils du feu à gauche, panier de bûches à droite
  s+=`<g filter="url(#wobble)"><path d="M124 300 L120 236 M128 300 L130 238" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><circle cx="120" cy="234" r="3" fill="#f2c45a" ${hL(1.4)}/><circle cx="130" cy="236" r="3" fill="#f2c45a" ${hL(1.4)}/><path d="M126 300 h-8 l-2 6 h12Z" fill="#3d2a35"/></g>`;
  s+=`<g filter="url(#wobble)"><path d="M256 296 q-2 -10 6 -12 l14 -2 q8 2 6 12" fill="url(#hLog)" ${hL(2)}/><ellipse cx="262" cy="286" rx="3" ry="3.6" fill="#e3b583" ${hL(1.4)}/><ellipse cx="276" cy="284" rx="3" ry="3.6" fill="#e3b583" ${hL(1.4)}/><path d="M252 296 h36 l-4 12 h-28Z" fill="#c98a54" ${hL(2.2)}/><path d="M256 300 h28 M258 304 h24" stroke="#9a6a3c" stroke-width="1.2"/></g>`;
  // sur le linteau : bougies et pendule (si les souvenirs ne prennent pas leur place)
  if(!has("luciole"))s+=`<rect x="128" y="168" width="8" height="16" rx="2" fill="#fff5e8" ${hL(1.8)}/><path d="M132 168 q-3 -5 0 -8 q3 3 0 8Z" fill="#ffd36a"/><circle cx="132" cy="162" r="7" fill="#ffe08a" opacity=".35"/>`;
  if(!has("flocon"))s+=`<rect x="264" y="172" width="8" height="12" rx="2" fill="#fff5e8" ${hL(1.8)}/><path d="M268 172 q-3 -5 0 -8 q3 3 0 8Z" fill="#ffd36a"/><circle cx="268" cy="166" r="7" fill="#ffe08a" opacity=".35"/>`;
  if(!has("moka"))s+=`<circle cx="200" cy="172" r="11" fill="#f2c45a" ${hL(2.2)}/><circle cx="200" cy="172" r="7.6" fill="#fffaf2" ${hL(1.4)}/><path d="M200 172 v-5 M200 172 l3.4 2" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>`;
  // tapis à motifs, avec ses franges
  s+=`<ellipse cx="204" cy="418" rx="174" ry="52" fill="#3d2a35" opacity=".16"/>`;
  s+=`<g stroke="#f3dcc0" stroke-width="2.4" stroke-linecap="round">${Array.from({length:9},(_,i)=>{const a=(-.5+i/8)*1.1;return `<path d="M${(200-168*Math.cos(a)).toFixed(1)} ${(408+50*Math.sin(a)).toFixed(1)} l${(-10*Math.cos(a)).toFixed(1)} ${(4*Math.sin(a)).toFixed(1)} M${(200+168*Math.cos(a)).toFixed(1)} ${(408+50*Math.sin(a)).toFixed(1)} l${(10*Math.cos(a)).toFixed(1)} ${(4*Math.sin(a)).toFixed(1)}"/>`}).join("")}</g>`;
  s+=`<g filter="url(#wobble)"><ellipse cx="200" cy="408" rx="168" ry="50" fill="#b84a5e" ${hL(3)}/><ellipse cx="200" cy="408" rx="156" ry="45" fill="#f3dcc0" ${hL(1.6)}/>`
    +Array.from({length:28},(_,i)=>{const a=i/28*Math.PI*2,x=200+144*Math.cos(a),y=408+40.6*Math.sin(a);return `<path d="M${(x-4).toFixed(1)} ${y.toFixed(1)} L${x.toFixed(1)} ${(y-3.2).toFixed(1)} L${(x+4).toFixed(1)} ${y.toFixed(1)} L${x.toFixed(1)} ${(y+3.2).toFixed(1)}Z" fill="${i%2?"#4f9a9a":"#e2546e"}" stroke="${INK}" stroke-width="1"/>`}).join("")
    +`<ellipse cx="200" cy="408" rx="130" ry="34" fill="#d9667a" ${hL(1.6)}/><ellipse cx="200" cy="408" rx="112" ry="28" fill="none" stroke="#f3dcc0" stroke-width="2" stroke-dasharray="7 5"/>`
    +`<path d="M200 386 L250 408 L200 430 L150 408Z" fill="#f3dcc0" ${hL(1.8)}/><path d="M200 394 L232 408 L200 422 L168 408Z" fill="#4f9a9a" ${hL(1.4)}/><ellipse cx="200" cy="408" rx="10" ry="5" fill="#f2c45a" ${hL(1.4)}/>`
    +[[120,408],[280,408]].map(([x,y])=>`<path d="M${x} ${y-8} l8 8 l-8 8 l-8 -8Z" fill="#f3dcc0" ${hL(1.4)}/><circle cx="${x}" cy="${y}" r="2.4" fill="#e2546e"/>`).join("")
    +[150,140,124].map(rx=>`<ellipse cx="200" cy="408" rx="${rx}" ry="${(rx*.29).toFixed(1)}" fill="none" stroke="#3d2a35" stroke-width=".8" opacity=".12"/>`).join("")+`</g>`;
  // le coin dodo : dix coussins sur le tapis, un sous chaque place (ronds, carrés capitonnés, en cœur)
  if(R.hup.coussins){const C=[["#9ec3ef","#7aa6d8"],["#f2c45a","#d9a63a"],["#a9d68f","#82b86a"],["#f6b8c4","#e08a9c"],["#c9a8ec","#a07ad0"]];
    s+=`<g filter="url(#wobble)">`+SEATS.map(([x,y],i)=>{const [c,d]=C[i%C.length],cy=y-6,k=i%3;
      return `<ellipse cx="${x+3}" cy="${cy+9}" rx="32" ry="8" fill="#3d2a35" opacity=".18"/>`+(k===0?`<path d="M${x-30} ${cy} Q${x-32} ${cy-13} ${x} ${cy-13} Q${x+32} ${cy-13} ${x+30} ${cy} Q${x+32} ${cy+13} ${x} ${cy+13} Q${x-32} ${cy+13} ${x-30} ${cy}Z" fill="${c}" ${hL(2.6)}/><path d="M${x} ${cy} L${x-10} ${cy-5} M${x} ${cy} L${x+10} ${cy-5} M${x} ${cy} L${x-10} ${cy+5} M${x} ${cy} L${x+10} ${cy+5}" stroke="${d}" stroke-width="1.4"/><circle cx="${x}" cy="${cy}" r="2.4" fill="${d}" ${hL(1.2)}/>`
        :k===1?`<path d="M${x-28} ${cy-9} Q${x} ${cy-14} ${x+28} ${cy-9} Q${x+32} ${cy} ${x+28} ${cy+9} Q${x} ${cy+14} ${x-28} ${cy+9} Q${x-32} ${cy} ${x-28} ${cy-9}Z" fill="${c}" ${hL(2.6)}/>${[-14,0,14].map(dx=>`<circle cx="${x+dx}" cy="${cy}" r="1.8" fill="${d}"/>`).join("")}<path d="M${x-28} ${cy-9} l-4 -3 M${x+28} ${cy-9} l4 -3 M${x-28} ${cy+9} l-4 3 M${x+28} ${cy+9} l4 3" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`
        :`<path d="M${x} ${cy+12} C${x-36} ${cy+2} ${x-26} ${cy-18} ${x} ${cy-8} C${x+26} ${cy-18} ${x+36} ${cy+2} ${x} ${cy+12}Z" fill="${c}" ${hL(2.6)}/>`)
        +`<path d="M${x-18} ${cy-6} q18 -5 36 0" fill="none" stroke="#fff" stroke-width="2.2" opacity=".55" stroke-linecap="round"/>`}).join("")+`</g>`}
  // les souvenirs
  s+=`<g filter="url(#wobble)">${souvSVG(night)}</g>`;
  if(R.hup.guirlandes)s+=`<path d="M0 30 Q100 70 200 34 Q300 70 400 30" fill="none" stroke="${INK}" stroke-width="2.4"/>${[[22,40],[60,54],[100,56],[140,48],[178,38],[222,40],[262,52],[300,56],[340,50],[378,38]].map(([x,y],i)=>`<path d="M${x-10} ${y} h20 l-10 20Z" fill="${["#e48a8a","#f2d27a","#9ec3ef","#a9d68f"][i%4]}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`).join("")}
    <path d="M0 84 Q200 122 400 84" fill="none" stroke="${INK}" stroke-width="2"/>${[30,90,150,210,270,330,380].map((x,i)=>{const y=86+Math.sin(x/400*Math.PI)*24+4;return `<circle cx="${x}" cy="${y.toFixed(0)}" r="14" fill="#fff3a8" opacity="${night?.45:.3}"/><circle cx="${x}" cy="${y.toFixed(0)}" r="6" fill="#fff3a8" stroke="${INK}" stroke-width="2"/>`}).join("")}`;
  if(R.hup.mezzanine)s+=`<g filter="url(#wobble)"><rect x="0" y="136" width="370" height="8" fill="#3d2a35" opacity=".18"/><path d="M0 118 H370 V136 H0Z" fill="url(#hShelf)" ${hL(3)}/>${[20,90,160,230,300].map(x=>`<path d="M${x} 122 V132" stroke="#7a4f34" stroke-width="2"/>`).join("")}<path d="M6 122 h340" stroke="#e3ac78" stroke-width="1.4" opacity=".7"/>
    ${[40,120,200,280].map(x=>`<path d="M${x} 118 V100 M${x+40} 118 V100" stroke="#a8724c" stroke-width="4"/>`).join("")}<path d="M0 100 H370" stroke="#a8724c" stroke-width="5" stroke-linecap="round"/>
    <path d="M352 136 L372 300 M386 136 L400 300" stroke="${INK}" stroke-width="6"/><path d="M352 136 L372 300 M386 136 L400 300" stroke="#a8724c" stroke-width="3"/>${[160,190,220,250,280].map(y=>`<path d="M${352+(y-136)*.12} ${y} H${386+(y-136)*.086}" stroke="${INK}" stroke-width="5"/><path d="M${352+(y-136)*.12} ${y} H${386+(y-136)*.086}" stroke="#c08a5c" stroke-width="2.4"/>`).join("")}</g>`;
  return s+`<rect width="400" height="480" fill="url(#hVig)" pointer-events="none"/><rect width="400" height="480" fill="url(#hGrain)" pointer-events="none"/>`;
}
// les objets de la maison, redessinés : fauteuil capitonné, table à thé nappée, gramophone, couverture torsadée
HOBJ.fauteuil.art=id=>`<ellipse cx="100" cy="150" rx="72" ry="7" fill="#3d2a35" opacity=".18"/><g filter="url(#wobble)">
  <path d="M42 140 l-2 10 M158 140 l2 10" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M42 140 l-2 10 M158 140 l2 10" stroke="#a8724c" stroke-width="3" stroke-linecap="round"/>
  <path d="M46 116 V72 Q46 44 76 42 Q100 36 124 42 Q154 44 154 72 V116Z" fill="url(#hfA)" ${hL(3)}/>
  ${[[74,62],[100,58],[126,62],[86,84],[114,84]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2" fill="#b85a66" stroke="${INK}" stroke-width="1"/>`).join("")}<path d="M74 62 L86 84 L100 58 L114 84 L126 62 M60 76 L74 62 M140 76 L126 62" fill="none" stroke="#c96a76" stroke-width="1.4"/>
  <path d="M60 50 Q80 44 100 44" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".5"/>
  <path d="M132 112 Q128 92 144 90 Q156 94 152 112Z" fill="#fff4e4" ${hL(2)}/><path d="M142 98 C138 96 138 102 142 104 C146 102 146 96 142 98Z" fill="#e2546e"/>
  <path d="M52 112 H148 Q154 112 154 120 V128 H46 V120 Q46 112 52 112Z" fill="#ffc9cf" ${hL(2.6)}/><path d="M54 117 H146" stroke="#e8a0a8" stroke-width="1.6" stroke-dasharray="3 2"/>
  <path d="M32 144 V100 Q32 84 46 84 Q60 84 60 100 V144Z" fill="url(#hfB)" ${hL(3)}/><path d="M140 144 V100 Q140 84 154 84 Q168 84 168 100 V144Z" fill="url(#hfB)" ${hL(3)}/>
  <circle cx="46" cy="96" r="8" fill="#f2a6ac" ${hL(2)}/><path d="M46 96 m-4 0 a4 4 0 1 0 4 -4" fill="none" stroke="#c96a76" stroke-width="1.4"/><circle cx="154" cy="96" r="8" fill="#f2a6ac" ${hL(2)}/><path d="M154 96 m4 0 a4 4 0 1 1 -4 -4" fill="none" stroke="#c96a76" stroke-width="1.4"/>
  <path d="M60 128 H140 V142 Q120 148 100 142 Q80 148 60 142Z" fill="#d9737c" ${hL(2.6)}/>
  <path d="M26 104 Q40 96 56 104 L60 132 Q44 140 28 132Z" fill="#9ec3ef" ${hL(2.2)}/><path d="M28 112 Q42 106 58 112 M29 122 Q43 116 59 122" stroke="#fff" stroke-width="2.4" fill="none"/><path d="M30 132 l-2 6 M36 134 l-1 6 M42 135 v6 M48 134 l1 6 M54 132 l2 6" stroke="#9ec3ef" stroke-width="2" stroke-linecap="round"/></g>
  <defs>${hG("hfA","#f6b0b4","#d9737c")}${hG("hfB","#eea0a8","#cf6670")}</defs>`+(id?foxAt(id,100,126,74,{pose:"sleep"}):"");
HOBJ.theiere.art=id=>`<ellipse cx="136" cy="150" rx="50" ry="5" fill="#3d2a35" opacity=".16"/><g filter="url(#wobble)"><path d="M104 132 V148 M168 132 V148" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M104 132 V148 M168 132 V148" stroke="#a8724c" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M90 108 Q136 98 182 108 L186 132 Q176 138 166 132 Q156 140 146 132 Q136 140 126 132 Q116 140 106 132 Q96 138 86 132Z" fill="#fff4f0" ${hL(2.6)}/>${[100,114,128,142,156,170].map(x=>`<path d="M${x} 104 L${x-2} 134" stroke="#f2a6b4" stroke-width="2.2" opacity=".7"/>`).join("")}<path d="M90 114 Q136 104 182 114 M88 124 Q136 114 184 124" stroke="#f2a6b4" stroke-width="2.2" fill="none" opacity=".7"/>
  <path d="M118 104 Q112 78 132 74 Q152 78 146 104Z" fill="url(#htP)" ${hL(2.6)}/><path d="M146 86 q12 -2 11 9 q-2 7 -9 7" fill="none" ${hL(3)}/><path d="M118 92 l-12 -8 l2 -2 l12 4" fill="#9ec3ef" ${hL(2)}/><path d="M120 76 Q132 66 144 76Z" fill="#7aa6d8" ${hL(2)}/><circle cx="132" cy="68" r="3.6" fill="#e48a8a" ${hL(1.6)}/>
  ${[[126,90],[136,96],[130,98]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="#fff"/><circle cx="${x}" cy="${y}" r=".8" fill="#f2c45a"/>`).join("")}<path d="M124 82 q4 -4 8 -4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M152 104 v-9 h14 v9 Q159 107 152 104Z" fill="#fff" ${hL(2)}/><path d="M166 97 q5 0 4 4 q-1 3 -4 2" fill="none" ${hL(1.6)}/><ellipse cx="159" cy="105" rx="10" ry="2.4" fill="#f2a6b4" ${hL(1.6)}/>
  <path d="M96 106 h12 v-6 h-12Z" fill="#fff" ${hL(1.6)}/><circle cx="100" cy="99" r="2.4" fill="#f6d39a" ${hL(1.2)}/><circle cx="105" cy="99" r="2.4" fill="#c98a54" ${hL(1.2)}/></g>
  <defs>${hG("htP","#bfe0f6","#7aa6d8")}</defs>`+(id?`<path d="M158 90 q-4 -6 0 -12 M164 88 q-4 -6 0 -12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>`+foxAt(id,56,146,74,{pose:"sit",expr:"joy"}):"");
HOBJ.disque.art=id=>`<ellipse cx="148" cy="148" rx="40" ry="5" fill="#3d2a35" opacity=".16"/><g filter="url(#wobble)"><rect x="114" y="100" width="66" height="44" rx="6" fill="url(#hgB)" ${hL(2.6)}/><rect x="120" y="108" width="54" height="30" rx="4" fill="none" stroke="#7a4a31" stroke-width="2"/><circle cx="147" cy="123" r="5" fill="#f2c45a" ${hL(1.4)}/>
  <path d="M118 144 v4 M176 144 v4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><ellipse cx="140" cy="98" rx="22" ry="5.6" fill="#3d2a35" ${hL(2)}/><ellipse cx="140" cy="97.4" rx="14" ry="3.4" fill="none" stroke="#6a5a66" stroke-width="1"/><ellipse cx="140" cy="98" rx="5" ry="1.6" fill="#e48a8a"/>
  <path d="M164 96 L170 74" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M164 96 L170 74" stroke="#d9a03a" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M168 76 Q170 56 158 40 Q176 30 196 40 Q196 58 176 78Z" fill="url(#hgH)" ${hL(2.6)}/><path d="M162 42 Q178 50 194 42 M168 50 Q178 58 190 48" fill="none" stroke="#b8802a" stroke-width="1.4"/><path d="M164 44 Q170 38 182 36" stroke="#fff6d0" stroke-width="2" fill="none" stroke-linecap="round"/></g>
  <defs>${hG("hgB","#c98a5a","#9a6a44")}${hG("hgH","#ffe08a","#d9a03a",1,1)}</defs>`+(id?`<g fill="${INK}" font-family="Mochiy Pop One,sans-serif"><text x="118" y="62" font-size="16">♪</text><text x="150" y="30" font-size="13">♫</text><text x="86" y="40" font-size="12">♪</text></g>`+foxAt(id,62,146,78,{pose:"happy"}):"");
HOBJ.couverture.art=id=>(id?foxAt(id,100,140,92,{pose:"sleep"}):"")+`<g filter="url(#wobble)"><path d="M30 146 Q32 ${id?104:124} 64 ${id?100:120} Q100 ${id?94:116} 136 ${id?100:120} Q170 ${id?104:124} 172 146Z" fill="#9ec3ef" ${hL(3)}/>
  <path d="M34 ${id?126:136} Q100 ${id?110:126} 168 ${id?126:136} L170 ${id?134:141} Q100 ${id?118:132} 32 ${id?134:141}Z" fill="#fff4e4" stroke="${INK}" stroke-width="1.6"/></g>
  <g stroke="#7aa6d8" stroke-width="2" fill="none" opacity=".9">${[52,76,100,124,148].map(x=>`<path d="M${x-6} ${id?112:128} l6 6 l6 -6 M${x-6} ${id?118:134} l6 6 l6 -6"/>`).join("")}</g>
  <g stroke="#9ec3ef" stroke-width="2.4" stroke-linecap="round">${[40,56,72,88,104,120,136,152,164].map(x=>`<path d="M${x} 146 l-1 6"/>`).join("")}</g>`;
// qui est à l'intérieur : les renards de la clairière ; la nuit, ils dorment tous
function enterHouse(){
  const all=foxes.filter(f=>!f.wild).map(f=>f.id).sort((a,b)=>i0(a+today())%97-i0(b+today())%97),night=phaseNow()==="nuit"; // d'autres têtes chaque jour
  const objs=hobjs().filter(k=>k!=="guirlandes"&&(!night||HOBJ[k].night)),inObj=objs.map((k,i)=>[k,all[i]]).filter(([,id])=>id);
  const hd=houseDecoSeats(all.slice(inObj.length),night),ids=hd.rest,pl=seats(),here=ids.slice(0,pl.length),out=ids.length-here.length; // les objets de la déco d'abord (deco.js)
  houseEl=document.createElement("div");houseEl.className="play house";
  houseEl.innerHTML=`<svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${houseSVG()}<g id="hfox"></g></svg><div class="psay">${night?"Tout le monde dort près du feu.":"La maison de Roussette."}${out?` ${out} renard${out>1?"s":""} reste${out>1?"nt":""} dehors : il manque de la place.`:""}</div>
    <div class="hbtns"><button class="btn ghost hgrow" type="button"${storyDone("copeau")?"":" hidden"}>Aménager</button><button class="btn ghost hdeco" type="button"${Object.keys(DECO).some(k=>DECO[k].home&&(R.deco.inv[k]||R.deco.home.some(d=>d.k===k)))?"":" hidden"}>Décorer</button></div><button class="btn pclose" type="button">Sortir</button>`;
  const box=houseEl.querySelector("#hfox"),POSES=["sit","lie","groom","happy","sleep"];
  // les objets sans personne (la nuit, le thé et la musique s'arrêtent), puis ceux où un renard s'est installé : le toucher prend la photo
  for(const k of hobjs())if(k!=="guirlandes"&&!inObj.some(([o])=>o===k))grp(box,HOBJ[k].art(null),{transform:hPlace(k)});
  for(const [k,id] of inObj){const g=grp(box,HOBJ[k].art(id),{transform:hPlace(k)});g.style.cursor="pointer";
    g.onpointerdown=e=>{e.stopPropagation();if(R.photos.some(p=>p.obj===k&&p.id===id)){const r=pet(id);toast(r?`${FOX[id].name} est ravi (+1 cœur, +1 gland).`:`${FOX[id].name} : ${HOBJ[k].in.toLowerCase()}.`);if(r)renderHud();return}
      R.photos.push({id,obj:k,t:Date.now()});save();const fl=document.createElement("div");fl.className="snapflash";houseEl.appendChild(fl);setTimeout(()=>fl.remove(),700);
      toast(`Clic ! ${FOX[id].name}, ${HOBJ[k].in.toLowerCase()}. La photo est dans l'album.`)}}
  // les plus hauts d'abord, pour que ceux de devant passent par-dessus
  here.map((id,i)=>[id,pl[i]]).sort((a,b)=>a[1][1]-b[1][1]).forEach(([id,[x,y]])=>{const up=y<200,w=up?52:60;
    const g=grp(box,foxAt(id,x,y,w,{pose:night?"sleep":POSES[(id.length+i0(id))%POSES.length]})+`<circle cx="${x}" cy="${y-w/2}" r="${w/2}" fill="transparent"/>`);
    g.style.cursor="pointer";g.onpointerdown=e=>{e.stopPropagation();const r=pet(id);
      toast(r?`${FOX[id].name} ronronne près du feu (+1 cœur, +1 gland).`:`${FOX[id].name} ${night?"dort, roulé en boule":"se chauffe les pattes"}.`);if(r)renderHud()}});
  houseEl.querySelector(".pclose").onpointerdown=e=>{e.stopPropagation();leaveHouse()};
  houseEl.querySelector(".hgrow").onpointerdown=e=>{e.stopPropagation();houseSheet()};
  houseEl.querySelector(".hdeco").onpointerdown=e=>{e.stopPropagation();decoStart(null,"home")};
  $("scene").appendChild(houseEl);drawHouseDeco(hd.seated);
}
const i0=id=>[...id].reduce((a,c)=>a+c.charCodeAt(0),0);
function leaveHouse(){if(houseEl){if(decoMode)decoEnd();houseEl.remove();houseEl=null}}
function houseSheet(){
  openSheet(`<h2>Aménager la maison</h2><p class="sub">Copeau a des idées plein la tête. Les objets attirent un renard : touche-le pour la photo. Tu as ${R.glands} glands.</p>${Object.entries(HOUSE).map(([k,o])=>`<div class="opt"><div class="txt"><strong>${o.name}</strong><span>${o.desc}</span></div><button class="btn" data-house="${k}" type="button" ${R.hup[k]||R.glands<o.price?"disabled":""}>${R.hup[k]?"Fait":`${acornSVG()} ${o.price}`}</button></div>`).join("")}`)}
function buildHouse(k){const o=HOUSE[k];if(R.hup[k]||R.glands<o.price)return;
  R.glands-=o.price;R.hup[k]=1;save();renderHud();closeSheet();
  if(houseEl){leaveHouse();enterHouse()}
  toast(HOBJ[k]?`${o.name} : installé ! Quelqu'un va vite venir l'essayer.`:`Copeau a fini : ${o.name.toLowerCase()} !`)}
