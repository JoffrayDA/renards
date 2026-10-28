/* La Clairière : la maison de Roussette (demande de Joffray, 26/10/2026).
   Copeau répare la porte, Sésame l'ouvre (story.js) ; ensuite on touche la porte pour entrer. Dedans : la cheminée, le tapis,
   et les renards présents ; la nuit, tout le monde dort près du feu. Copeau agrandit la maison contre des glands (R.hup).
   Place : 6 renards au départ, 12 avec la mezzanine (on en voit 10 au plus dans la clairière). */
R.hup=R.hup||{};
const houseOpen=()=>!!STORIES.sesame&&storyDone("sesame");
const HOUSE={
  coussins:{name:"Coussins près du feu",price:30,desc:"Trois gros coussins sur le tapis. Les frileux se battent pour celui du milieu."},
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
  fauteuil:{in:"Dans le fauteuil",night:1,at:[4,226,.7],pose:"sleep",
    art:id=>`<g filter="url(#wobble)"><path d="M44 140 V82 Q44 62 64 62 H136 Q156 62 156 82 V140Z" fill="#e48a8a" ${O}/><path d="M32 140 V96 Q32 86 44 86 Q56 86 56 96 V140Z M144 140 V96 Q144 86 156 86 Q168 86 168 96 V140Z" fill="#d66f74" ${O}/><path d="M56 140 V112 H144 V140Z" fill="#f2a6a0" ${O}/><path d="M40 140 v10 M160 140 v10" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>`+(id?foxAt(id,100,128,74,{pose:"sleep"}):"")},
  couverture:{in:"Sous la couverture",night:1,at:[246,306,.66],pose:"sleep",
    art:id=>(id?foxAt(id,100,140,92,{pose:"sleep"}):"")+`<g filter="url(#wobble)"><path d="M30 146 Q32 ${id?104:124} 64 ${id?100:120} Q100 ${id?94:116} 136 ${id?100:120} Q170 ${id?104:124} 172 146Z" fill="#9ec3ef" ${O}/></g><g stroke="#fff" stroke-width="2.4" fill="none" opacity=".85">${(id?[112,124,136]:[130,140]).map(y=>`<path d="M40 ${y} q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0"/>`).join("")}</g>`},
  theiere:{in:"À l'heure du thé",at:[262,238,.68],pose:"sit",
    art:id=>`<g filter="url(#wobble)"><rect x="96" y="104" width="80" height="10" rx="4" fill="#a9785a" ${O}/><path d="M104 114 V146 M168 114 V146" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M118 104 Q112 80 132 76 Q152 80 146 104Z" fill="#f6e0b8" ${O}/><path d="M146 88 q10 -2 10 8 q-2 6 -8 6" fill="none" stroke="${INK}" stroke-width="3"/><path d="M118 90 l-12 -6" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="132" cy="72" r="4" fill="#e48a8a" ${O}/><path d="M154 104 v-9 h14 v9Z" fill="#fff" ${O}/></g>`+(id?`<path d="M158 88 q-4 -6 0 -12 M164 86 q-4 -6 0 -12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>`+foxAt(id,56,146,74,{pose:"sit",expr:"joy"}):"")},
  disque:{in:"En train de danser",at:[10,300,.64],pose:"happy",
    art:id=>`<g filter="url(#wobble)"><rect x="112" y="98" width="70" height="48" rx="6" fill="#c98a5a" ${O}/><rect x="116" y="88" width="62" height="12" rx="3" fill="#8a5a3a" ${O}/><ellipse cx="146" cy="88" rx="24" ry="6" fill="#3d2a35" ${O}/><ellipse cx="146" cy="88" rx="6" ry="2" fill="#e48a8a"/><path d="M172 82 l-14 8" stroke="#cfc6c0" stroke-width="3" stroke-linecap="round"/></g>`+(id?`<g fill="${INK}" font-family="Mochiy Pop One,sans-serif"><text x="124" y="62" font-size="16">♪</text><text x="154" y="48" font-size="13">♫</text><text x="86" y="40" font-size="12">♪</text></g>`+foxAt(id,62,146,78,{pose:"happy"}):"")}
};
const hobjs=()=>Object.keys(HOBJ).filter(k=>R.hup[k]);
const hPlace=k=>{const [x,y,s]=HOBJ[k].at;return `translate(${x} ${y}) scale(${s})`};
// le fond d'une photo prise dans la maison
const houseBack=()=>`<rect width="200" height="160" fill="#d9a777"/>${[18,54,90,126,162,198].map(x=>`<path d="M${x} 0 V104" stroke="#c08a5c" stroke-width="2"/>`).join("")}<rect y="104" width="200" height="56" fill="#b9814a"/><path d="M0 124 H200 M0 146 H200" stroke="#9a6a3c" stroke-width="2"/>`;
// les places, dans le repère 400 × 480 : autour du feu, puis sur la mezzanine
const SEATS=[[112,372],[200,410],[288,372],[150,430],[250,430],[330,420]],UPSTAIRS=[[50,112],[100,112],[150,112],[230,112],[280,112],[330,112]];
const seats=()=>{const busy=hobjs().map(k=>{const [x,y,s]=HOBJ[k].at;return [x+100*s,y+120*s]});
  return (R.hup.mezzanine?SEATS.concat(UPSTAIRS):SEATS).filter(([x,y])=>!busy.some(([bx,by])=>Math.hypot(bx-x,by-y)<70))};

// la porte, touchable une fois la maison ouverte
const doorEl=document.createElement("button");doorEl.className="doorbtn";doorEl.type="button";doorEl.setAttribute("aria-label","Entrer dans la maison");
doorEl.style.cssText=pc(200,170)+";z-index:240";
doorEl.onpointerdown=e=>{e.stopPropagation();if(storyTap("@porch"))return;if(gameOn||!$("talk").hidden||!$("sheet").hidden)return;
  if(!houseOpen()){log("La porte est fermée. Elle ne s'est jamais ouverte, d'aussi loin qu'on se souvienne.");return}
  enterHouse()};
$("actors").appendChild(doorEl);

let houseEl=null;
function houseSVG(){
  const night=dark(),wet=scn.rain,sky=night?["#1f2540","#3a4062"]:wet?["#a3b1bf","#d2dae0"]:["#bfe3f2","#e8f5fb"];
  let s=`<defs><linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
    <radialGradient id="hfire"><stop offset="0" stop-color="#ffd36a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd36a" stop-opacity="0"/></radialGradient></defs>`;
  // murs en planches, plancher
  s+=`<rect width="400" height="480" fill="#d9a777"/>${Array.from({length:12},(_,i)=>`<path d="M${i*36+10} 0 V300" stroke="#c08a5c" stroke-width="2.4"/>`).join("")}`;
  s+=`<path d="M0 300 H400 V480 H0Z" fill="#b9814a"/>${[322,350,382,418,458].map(y=>`<path d="M0 ${y} H400" stroke="#9a6a3c" stroke-width="2.4"/>`).join("")}`;
  // fenêtre ronde : le dehors à l'heure réelle
  s+=`<g filter="url(#wobble)"><circle cx="62" cy="186" r="34" fill="url(#hsky)" ${O}/><path d="M62 152 V220 M28 186 H96" stroke="${INK}" stroke-width="3"/></g>`;
  if(night)s+=`<circle cx="74" cy="172" r="6" fill="#fff6c8"/>`;
  if(wet)s+=`<g stroke="#fff" stroke-width="1.6" opacity=".8">${[40,54,70,84].map((x,i)=>`<path d="M${x} ${164+i*6} l-3 9"/>`).join("")}</g>`;
  // la cheminée et son feu
  s+=`<circle cx="200" cy="292" r="${night?150:110}" fill="url(#hfire)"/>`;
  s+=`<g filter="url(#wobble)"><path d="M136 300 V190 Q200 160 264 190 V300Z" fill="#b8aca6" ${O}/>${[[150,206],[188,194],[228,200],[146,240],[248,236],[150,276],[250,272]].map(([x,y])=>`<rect x="${x-12}" y="${y-8}" width="24" height="16" rx="5" fill="#cfc6c0" stroke="${INK}" stroke-width="2"/>`).join("")}
    <path d="M160 300 V246 Q200 226 240 246 V300Z" fill="#3d2a35" ${O}/><path d="M124 190 H276" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M124 190 H276" stroke="#a9785a" stroke-width="5" stroke-linecap="round"/>
    <path d="M172 298 l56 -10 M172 288 l56 10" stroke="#8a5a3a" stroke-width="7" stroke-linecap="round"/></g>
    <g class="flame"><path d="M200 292 Q176 270 190 250 Q194 266 202 260 Q198 240 214 228 Q212 252 224 262 Q230 282 200 292Z" fill="#f59a5b" stroke="${INK}" stroke-width="2.4"/><path d="M200 290 Q188 276 196 264 Q200 274 206 270 Q206 256 214 250 Q212 268 218 274 Q216 288 200 290Z" fill="#ffd36a"/></g>`;
  // tapis
  s+=`<g filter="url(#wobble)"><ellipse cx="200" cy="408" rx="168" ry="50" fill="#e98a8a" ${O}/><ellipse cx="200" cy="408" rx="130" ry="36" fill="none" stroke="#fff3e6" stroke-width="4" stroke-dasharray="10 8"/></g>`;
  if(R.hup.coussins)s+=`<g filter="url(#wobble)">${[[112,386,"#9ec3ef"],[200,424,"#f2c45a"],[288,386,"#a9d68f"]].map(([x,y,c])=>`<ellipse cx="${x}" cy="${y}" rx="40" ry="16" fill="${c}" ${O}/><path d="M${x-24} ${y-4} q24 8 48 0" fill="none" stroke="#fff" stroke-width="2.4" opacity=".6"/>`).join("")}</g>`;
  // étagère : un objet par souvenir reçu
  if(R.hup.etagere){const n=Object.keys(R.souv).length,COL=["#f2c45a","#e98a8a","#9ec3ef","#a9d68f","#c9a8ec","#f59a5b"];
    s+=`<g filter="url(#wobble)"><path d="M294 236 H392 M294 276 H392" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M294 236 H392 M294 276 H392" stroke="#a9785a" stroke-width="4" stroke-linecap="round"/>
      ${Array.from({length:Math.min(n,12)},(_,i)=>{const x=302+(i%6)*15,y=i<6?222:262,c=COL[i%COL.length];return i%3===0?`<rect x="${x-5}" y="${y-8}" width="10" height="14" rx="3" fill="${c}" ${O}/>`:i%3===1?`<circle cx="${x}" cy="${y-1}" r="6" fill="${c}" ${O}/>`:`<path d="M${x-6} ${y+6} L${x} ${y-9} L${x+6} ${y+6}Z" fill="${c}" ${O}/>`}).join("")}</g>`}
  if(R.hup.guirlandes)s+=`<path d="M0 30 Q100 70 200 34 Q300 70 400 30" fill="none" stroke="${INK}" stroke-width="2.4"/>${[[22,40],[60,54],[100,56],[140,48],[178,38],[222,40],[262,52],[300,56],[340,50],[378,38]].map(([x,y],i)=>`<path d="M${x-10} ${y} h20 l-10 20Z" fill="${["#e48a8a","#f2d27a","#9ec3ef","#a9d68f"][i%4]}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`).join("")}
    <path d="M0 84 Q200 122 400 84" fill="none" stroke="${INK}" stroke-width="2"/>${[30,90,150,210,270,330,380].map((x,i)=>{const y=86+Math.sin(x/400*Math.PI)*24+4;return `<circle cx="${x}" cy="${y.toFixed(0)}" r="14" fill="#fff3a8" opacity=".3"/><circle cx="${x}" cy="${y.toFixed(0)}" r="6" fill="#fff3a8" stroke="${INK}" stroke-width="2"/>`}).join("")}`;
  // mezzanine sous le toit, avec son échelle
  if(R.hup.mezzanine)s+=`<g filter="url(#wobble)"><path d="M0 120 H370 V136 H0Z" fill="#a9785a" ${O}/>${[20,90,160,230,300].map(x=>`<path d="M${x} 124 V132" stroke="#8a5a3a" stroke-width="2"/>`).join("")}
    <path d="M352 136 L372 300 M386 136 L400 300" stroke="${INK}" stroke-width="5"/>${[160,190,220,250,280].map(y=>`<path d="M${352+(y-136)*.12} ${y} H${386+(y-136)*.086}" stroke="${INK}" stroke-width="4"/>`).join("")}</g>`;
  return s;
}
// qui est à l'intérieur : les renards de la clairière ; la nuit, ils dorment tous
function enterHouse(){
  const all=foxes.filter(f=>!f.wild).map(f=>f.id).sort((a,b)=>i0(a+today())%97-i0(b+today())%97),night=phaseNow()==="nuit"; // d'autres têtes chaque jour
  const objs=hobjs().filter(k=>k!=="guirlandes"&&(!night||HOBJ[k].night)),inObj=objs.map((k,i)=>[k,all[i]]).filter(([,id])=>id);
  const ids=all.slice(inObj.length),pl=seats(),here=ids.slice(0,pl.length),out=ids.length-here.length;
  houseEl=document.createElement("div");houseEl.className="play house";
  houseEl.innerHTML=`<svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${houseSVG()}<g id="hfox"></g></svg><div class="psay">${night?"Tout le monde dort près du feu.":"La maison de Roussette."}${out?` ${out} renard${out>1?"s":""} reste${out>1?"nt":""} dehors : il manque de la place.`:""}</div>
    <button class="btn ghost hgrow" type="button"${storyDone("copeau")?"":" hidden"}>Aménager</button><button class="btn pclose" type="button">Sortir</button>`;
  const box=houseEl.querySelector("#hfox"),POSES=["sit","lie","groom","happy","sleep"];
  // les objets sans personne (la nuit, le thé et la musique s'arrêtent), puis ceux où un renard s'est installé : le toucher prend la photo
  for(const k of hobjs())if(k!=="guirlandes"&&!inObj.some(([o])=>o===k))grp(box,HOBJ[k].art(null),{transform:hPlace(k)});
  for(const [k,id] of inObj){const g=grp(box,HOBJ[k].art(id),{transform:hPlace(k)});g.style.cursor="pointer";
    g.onpointerdown=e=>{e.stopPropagation();if(R.photos.some(p=>p.obj===k&&p.id===id)){const r=pet(id);toast(r?`${FOX[id].name} est ravi (+1 cœur, +1 gland).`:`${FOX[id].name} : ${HOBJ[k].in.toLowerCase()}.`);if(r)renderHud();return}
      R.photos.push({id,obj:k,t:Date.now()});save();const fl=document.createElement("div");fl.className="snapflash";houseEl.appendChild(fl);setTimeout(()=>fl.remove(),700);
      toast(`Clic ! ${FOX[id].name}, ${HOBJ[k].in.toLowerCase()}. La photo est dans l'album.`)}}
  // les plus hauts d'abord, pour que ceux de devant passent par-dessus
  here.map((id,i)=>[id,pl[i]]).sort((a,b)=>a[1][1]-b[1][1]).forEach(([id,[x,y]])=>{const up=y<200,w=up?52:66;
    const g=grp(box,foxAt(id,x,y,w,{pose:night?"sleep":POSES[(id.length+i0(id))%POSES.length]})+`<circle cx="${x}" cy="${y-w/2}" r="${w/2}" fill="transparent"/>`);
    g.style.cursor="pointer";g.onpointerdown=e=>{e.stopPropagation();const r=pet(id);
      toast(r?`${FOX[id].name} ronronne près du feu (+1 cœur, +1 gland).`:`${FOX[id].name} ${night?"dort, roulé en boule":"se chauffe les pattes"}.`);if(r)renderHud()}});
  houseEl.querySelector(".pclose").onpointerdown=e=>{e.stopPropagation();leaveHouse()};
  houseEl.querySelector(".hgrow").onpointerdown=e=>{e.stopPropagation();houseSheet()};
  $("scene").appendChild(houseEl);
}
const i0=id=>[...id].reduce((a,c)=>a+c.charCodeAt(0),0);
function leaveHouse(){if(houseEl){houseEl.remove();houseEl=null}}
function houseSheet(){
  openSheet(`<h2>Aménager la maison</h2><p class="sub">Copeau a des idées plein la tête. Les objets attirent un renard : touche-le pour la photo. Tu as ${R.glands} glands.</p>${Object.entries(HOUSE).map(([k,o])=>`<div class="opt"><div class="txt"><strong>${o.name}</strong><span>${o.desc}</span></div><button class="btn" data-house="${k}" type="button" ${R.hup[k]||R.glands<o.price?"disabled":""}>${R.hup[k]?"Fait":`${acornSVG()} ${o.price}`}</button></div>`).join("")}`)}
function buildHouse(k){const o=HOUSE[k];if(R.hup[k]||R.glands<o.price)return;
  R.glands-=o.price;R.hup[k]=1;save();renderHud();closeSheet();
  if(houseEl){leaveHouse();enterHouse()}
  toast(HOBJ[k]?`${o.name} : installé ! Quelqu'un va vite venir l'essayer.`:`Copeau a fini : ${o.name.toLowerCase()} !`)}
