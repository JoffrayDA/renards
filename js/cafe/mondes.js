/* Kitsune Café : le choix du monde (08/11/2026, Joffray : « des carrés avec les différents mondes, genre saisons, Petite Italie, Paris »).
   En entrant dans le Café, une carte illustrée par monde ; un monde fermé se montre en gris avec ce qu'il faut faire pour l'ouvrir.
   La flèche de retour d'une carte ramène ici ; celle de cet écran ramène à l'accueil. */
const MONDES=[
  {id:"",name:"Les quatre saisons",sub:"Le premier café",host:"petitpois",max:()=>LASTDAY*3,
    stars:()=>starSum(),day:()=>Math.min(S.day,LASTDAY),last:()=>LASTDAY,open:()=>true,art:()=>mondeArt1()},
  {id:"italie",name:"Petite Italie",sub:"Le Caffè de Lorenzo",host:"lorenzo",max:()=>IT_LAST*3,
    stars:()=>Object.values(S.it.stars).reduce((a,b)=>a+b,0),day:()=>Math.min(S.it.day,IT_LAST),last:()=>IT_LAST,open:()=>itOpen(),art:()=>mondeArtIt()},
  {id:"paris",name:"Paris",sub:"Le Café d'Anatole",host:"anatole",max:()=>PA_DAYS.length*3,
    stars:()=>Object.values(S.pa.stars).reduce((a,b)=>a+b,0),day:()=>Math.min(S.pa.day,PA_DAYS.length),last:()=>PA_DAYS.length,open:()=>paOpen(),art:()=>mondeArtPa()}
];
const mSky=(id,a,b)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
// les quatre saisons côte à côte, chacune avec son arbre, et le petit café au milieu
function mondeArt1(){
  const S4=["automne","hiver","printemps","ete"];let s=`<rect width="320" height="150" fill="url(#mw1)"/>`;
  S4.forEach((k,i)=>{const x=i*80;s+=`<path d="M${x} 150 V96 Q${x+40} ${84+i%2*8} ${x+80} 96 V150Z" fill="${LAND[k].bg}" ${BO}/>`});
  s+=DECO.automne[0](40,124,.8)+DECO.hiver[0](104,128,.7)+DECO.printemps[0](232,128,.75)+DECO.ete[0](288,124,.8);
  const cx=168,cy=128;
  s+=shadow(cx,cy,48)+`<rect x="${cx-36}" y="${cy-40}" width="72" height="40" rx="6" fill="#fff5e8" ${BO}/><path d="M${cx-46} ${cy-38} L${cx} ${cy-72} L${cx+46} ${cy-38}Z" fill="#f59a8b" ${BO}/><rect x="${cx-9}" y="${cy-22}" width="18" height="22" rx="4" fill="#c8946a" ${BO}/><rect x="${cx-30}" y="${cy-30}" width="15" height="13" rx="3" fill="#bfe0f2" ${BO}/><rect x="${cx+15}" y="${cy-30}" width="15" height="13" rx="3" fill="#bfe0f2" ${BO}/>`;
  return `<defs>${mSky("mw1","#cfe8f6","#fdf3e6")}</defs>`+s;
}
// la tour penchée, les cyprès et le Caffè au coucher du soleil
function mondeArtIt(){
  let s=`<rect width="320" height="150" fill="url(#mw2)"/><circle cx="250" cy="58" r="22" fill="#ffe3a0" opacity=".9"/>`;
  s+=`<path d="M0 112 Q80 86 170 104 T320 96 V150 H0Z" fill="#e9c98f" ${BO}/><path d="M0 132 Q100 116 200 128 T320 124 V150 H0Z" fill="#d7b67a" ${BO}/>`;
  s+=pisaSVG(64,128,.58)+itCypress(112,130,.8)+itCypress(296,128,.9)+itCypress(276,132,.7);
  s+=`<g transform="translate(196 134) scale(.52)">${itCafeSVG(0,0)}</g>`;
  return `<defs>${mSky("mw2","#f6b48a","#fde7c4")}</defs>`+s;
}
// la tour Eiffel, les arbres des quais et le Café
function mondeArtPa(){
  let s=`<rect width="320" height="150" fill="url(#mw3)"/>`;
  s+=`<path d="M0 118 Q160 104 320 118 V150 H0Z" fill="#cfdcc4" ${BO}/><path d="M0 136 H320 V150 H0Z" fill="#e6dccb" ${BO}/>`;
  s+=paEiffel(70,132,124)+paTree(26,134,.9)+paTree(122,136,.8)+paTree(300,134,.9);
  s+=`<g transform="translate(212 136) scale(.48)">${paCafeSVG(0,0)}</g>`;
  return `<defs>${PA_DEFS}${mSky("mw3","#bcd6ee","#f3eee6")}</defs>`+s;
}
function openWorlds(){
  closeSheet();closeMap();$("worlds").hidden=false;document.body.style.overflow="hidden";
  MUSIC.want(HW?"fantomes":xmasDay()?"noel":"ukulele");
  $("wlist").innerHTML=MONDES.map(m=>{const ok=m.open(),f=FOX[m.host],st=m.stars(),mx=m.max();
    const fox=foxSVG({...f,scale:1},ok?{pose:"sit"}:{pose:"sit",sil:true});
    const info=ok?`<span class="wst">★ ${st} / ${mx}</span><span class="wbar"><i style="width:${Math.round(st/mx*100)}%"></i></span><span class="wday">${m.day()>=m.last()&&st>=mx?"Tout en ★★★ !":`Jour ${m.day()} / ${m.last()}`}</span>`
      :`<span class="wlock">${WORLDS[m.id].lockMsg}</span>`;
    return `<button class="wcard${ok?"":" locked"}${WORLD===m.id?" cur":""}" data-world="${m.id}" type="button"><span class="wart"><svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${m.art()}</svg><span class="wfox">${fox}</span></span>
      <span class="wtxt"><b>${m.name}</b><small>${m.sub}</small>${info}</span></button>`}).join("")
    +`<div class="wcard soon"><b>Bientôt</b><small>D'autres quartiers arrivent…</small></div>`;
}
function closeWorlds(){$("worlds").hidden=true}
$("wlist").addEventListener("click",e=>{const b=e.target.closest("[data-world]");if(!b)return;const id=b.dataset.world,m=MONDES.find(x=>x.id===id);
  if(!m.open()){toast(WORLDS[id].lockMsg);return}
  bip("tap");closeWorlds();goWorld(id)});
