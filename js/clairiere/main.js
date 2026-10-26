/* La Clairière : démarrage et boucles. */
$("ic-g").innerHTML=acornSVG();$("ic-f").innerHTML=fishSVG();$("actors").appendChild(pondEl);
$("logo").innerHTML=foxArt(FOX.roussette,{pose:"happy"});
$("actors").appendChild(bowlEl);
scn.rain=rainNow();
simulate(false);
const togGot=syncTogether();
drawBg();sizeRain();addEventListener("resize",sizeRain);if(scn.rain)startRain();
syncFoxes();
chainTick(false);checkArrival();
renderHud();
$("b-bowl").innerHTML=acornSVG()+"Gamelle";
$("b-bowl").onclick=bowlSheet;$("goal").onclick=journal;$("b-carnet").onclick=carnet;$("b-photos").onclick=photos;
// au tout premier passage, Petit Pois accueille Roussette ; ensuite, les nouvelles depuis la dernière visite
if(!R.intro)talk(INTRO,()=>{R.intro=1;save();showNews()});else showNews();
renderStory();
log(togGot.length?togGot.map(([id,n])=>`${FOX[id].name} a passé ${n} journée${n>1?"s":""} avec toi au Café : +${n} cœur${n>1?"s":""}.`).join(" "):Object.keys(R.res).length>1?"Bienvenue au refuge.":"Petit Pois t'attendait.");

setInterval(tick,100);
// toutes les 30 s : simulation (glands, gamelle, sauvages), arrivées, moment de la journée, pluie
setInterval(()=>{
  const seen=simulate(true);
  for(const id of seen){const n=R.news.find(x=>x.k==="wild"&&x.id===id&&x.live);wildVisit(id,R.photos[R.photos.length-1].bowl);toast(n&&n.first?`Un renard sauvage ! ${FOX[id].name} s'approche de la gamelle.`:`${FOX[id].name} revient manger à la gamelle.`)}
  R.news=R.news.filter(x=>!(x.k==="wild"&&x.live));
  chainTick(true);checkArrival();if(R.news.some(x=>x.k==="arr")&&$("talk").hidden&&$("sheet").hidden)showNews();else renderStory();
  if(phaseNow()!==scn.phase)drawBg();
  const r=rainNow();if(r!==scn.rain){scn.rain=r;rainChanged()}
  if(!foxes.some(f=>f.walk))syncFoxes();
  renderHud();
},30000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"){simulate(false);renderHud();if($("talk").hidden&&$("sheet").hidden)showNews()}});
