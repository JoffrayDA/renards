/* La Clairière : démarrage et boucles. */
// les heures que la fiche des notifications annonce (push.js) : le prochain renard de l'histoire, la prochaine visite
// à la gamelle, et demain matin s'il reste un client du Café à accueillir
function pushPlan(){const now=Date.now(),d=new Date();d.setDate(d.getDate()+1);d.setHours(10,0,0,0);
  return {fox:R.intro&&R.nextFox&&!(R.beat[R.nextFox]>0)&&R.nextAt>now?R.nextAt:0,inco:nextVisit(),
    arr:chainDone()&&R.lastArr===today()&&Object.keys(candidates()).length?+d:0}}
const BELL=on=>`<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M10 3C6.6 3 5.2 5.6 5.2 8.6V11.4L3.6 14H16.4L14.8 11.4V8.6C14.8 5.6 13.4 3 10 3Z" fill="${on?"#f08a7a":"none"}" stroke="#5b4250" stroke-width="2" stroke-linejoin="round"/><path d="M8 16.2Q10 18.6 12 16.2" fill="none" stroke="#5b4250" stroke-width="2" stroke-linecap="round"/></svg>`;
function drawBell(){const b=$("bell");b.hidden=!pushOk();b.innerHTML=BELL(pushOn());b.onclick=pushSheet}
const PUSH_TXT="Petit Pois peut t'envoyer un petit mot quand un renard arrive pour son histoire, quand quelqu'un passe à la gamelle ou quand un client du Café vient s'installer. Une fois par jour au plus, jamais la nuit.";
function pushSheet(){openSheet(pushOn()?`<h2>Notifications</h2><p class="sub">${PUSH_TXT}</p><button class="btn ghost" data-push="off" type="button">Ne plus me prévenir</button>`
  :`<h2>Te prévenir ?</h2><p class="sub">${PUSH_TXT}</p><button class="btn" data-push="on" type="button">Oui, préviens-moi</button>`)}
// proposé une fois, à la fin d'une histoire (quand il faut attendre le prochain renard)
function pushInvite(){if(!pushOk()||pushOn()||R.pushAsk)return;if(!$("talk").hidden||!$("sheet").hidden){setTimeout(pushInvite,3000);return}
  R.pushAsk=1;save();pushSheet()}
$("ic-g").innerHTML=acornSVG();$("ic-f").innerHTML=fishSVG();$("actors").appendChild(pondEl);
$("logo").innerHTML=foxArt(FOX.roussette,{pose:"happy"});
$("actors").appendChild(bowlEl);
scn.rain=rainNow();
simulate(false);
const togGot=syncTogether();
// un objet offert par lien (?cadeau=cabane), une seule fois : pour que Joffray voie la cabane sans attendre ses glands
const GIFT=new URLSearchParams(location.search).get("cadeau");
if(GIFT&&OBJS[GIFT]&&!R.obj[GIFT]){R.obj[GIFT]=1;save();addObjSpots();setTimeout(()=>toast(`Copeau t'offre : ${OBJS[GIFT].name.toLowerCase()} !`),800)}
if(GIFT)history.replaceState(null,"",location.pathname);
drawBg();sizeRain();addEventListener("resize",sizeRain);if(scn.rain)startRain();
syncFoxes();drawObjs();fillObjs();
chainTick(false);if(checkArrival())syncFoxes(); // arrivé à l'ouverture : il est là tout de suite
renderHud();
$("b-bowl").innerHTML=acornSVG()+"Gamelle";
$("b-bowl").onclick=bowlSheet;$("goal").onclick=()=>{if(!cur()&&envieGoal())return;journal()};$("b-carnet").onclick=carnet;$("b-photos").onclick=photos;$("b-obj").onclick=()=>shopSheet("jour");
// au tout premier passage, Petit Pois accueille Roussette ; ensuite, les nouvelles depuis la dernière visite
if(!R.intro)talk(INTRO,()=>{R.intro=1;save();showNews()});else showNews();
renderStory();envieTick();drawBell();pushSync(pushPlan());
log(togGot.length?togGot.map(([id,n])=>`${FOX[id].name} a passé ${n} journée${n>1?"s":""} avec toi au Café : +${n} cœur${n>1?"s":""}.`).join(" "):Object.keys(R.res).length>1?"Bienvenue au refuge.":"Petit Pois t'attendait.");

setInterval(tick,100);
// toutes les 30 s : simulation (glands, gamelle, sauvages), arrivées, moment de la journée, pluie
setInterval(()=>{
  const seen=simulate(true);
  for(const id of seen){const n=R.news.find(x=>x.k==="wild"&&x.id===id&&x.live);wildVisit(id,R.photos[R.photos.length-1].bowl);toast(!known(id)?"Un inconnu s'approche de la gamelle… Une photo de plus pour l'album !":n&&n.first?`Un renard sauvage ! ${FOX[id].name} s'approche de la gamelle.`:`${FOX[id].name} revient manger à la gamelle.`)}
  R.news=R.news.filter(x=>!(x.k==="wild"&&x.live));
  chainTick(true);checkArrival();if(R.news.some(x=>x.k==="arr")&&$("talk").hidden&&$("sheet").hidden)showNews();else renderStory();
  if(phaseNow()!==scn.phase)drawBg();
  const r=rainNow();if(r!==scn.rain){scn.rain=r;rainChanged()}else if(rainTill&&!storyRain()){rainTill=0;drawGlow()} // fin de la scène sous la pluie : plus personne aux fenêtres
  syncFoxes();
  envieTick();wildNudge();
  renderHud();pushSync(pushPlan());
},30000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")pushSync(pushPlan());if(document.visibilityState==="visible"){simulate(false);renderHud();if($("talk").hidden&&$("sheet").hidden)showNews();envieTick()}});
