/* La Clairière : les petites envies (docs/clairiere-v2.md, décisions du 26/10/2026).
   Au retour du joueur, un renard dont l'histoire est finie a une petite envie : une bulle « … » au-dessus de lui.
   On le touche, il demande, on le fait (souvent un petit jeu), il remercie : +5 glands et un cœur.
   Deux par jour au plus, jamais cumulées : une envie pas faite disparaît le lendemain (on ne punit pas l'absence).
   R.env = {day, n (envies du jour), last (fin de la dernière), cur:{id, k, step:"ask"|"go", friend}} */
R.env=R.env||{day:"",n:0,last:0,cur:null};
const ENV_MAX=2,ENV_GAP=2*36e5; // deux par jour, au moins 2 h entre deux
// ok : quand l'envie peut venir ; game : le petit jeu (games.js) ; friend : aller chercher un autre renard ;
// basket : sieste dans le panier ; tale : une histoire avant de dormir
const ENVIES={
  pommes:{ok:()=>!scn.rain,ask:"J'ai un petit creux… Tu me rattrapes des pommes sous le grand arbre ?",goal:"rattraper des pommes",
    game:{k:"basket",n:6,win:"Six belles pommes !"},thx:"Miam ! Elles sont encore toutes fraîches. Je t'en garde une."},
  feuilles:{ok:()=>!scn.rain,ask:"Tu me fais un gros tas de feuilles ? J'ai très envie de sauter dedans.",goal:"un tas de feuilles",
    game:{k:"rake",n:12,time:16,win:"Un tas tout moelleux !"},thx:"Crounch ! C'est le meilleur tas du monde.",to:"leaves"},
  lucioles:{ok:()=>dark()&&!scn.rain,ask:"On dit qu'une luciole dorée passe le soir. Tu me la montres ?",goal:"la luciole dorée",
    game:{k:"firefly",win:"La voilà !"},thx:"Elle brille comme la queue de Luciole… Je vais bien dormir."},
  poisson:{ok:()=>canFish(),ask:"Tu m'apprends à pêcher ? Juste un poisson, pour voir.",goal:"pêcher un poisson",
    game:{k:"fish",say:"Montre-lui : touche l'eau dès que le bouchon plonge !",win:"Un poisson !"},thx:"Il frétille ! On le remet à l'eau, d'accord ?"},
  flaques:{ok:()=>scn.rain,ask:"Il pleut ! On saute dans les flaques ? Tu refais mes sauts ?",goal:"sauter dans les flaques",
    game:{k:"simon",rounds:[3,4,5]},thx:"Je suis trempé jusqu'aux oreilles. C'était génial !"},
  coussin:{ok:()=>true,ask:"On joue aux coussins ? Je me cache dessous, tu me retrouves.",goal:"le jeu des coussins",
    game:{k:"cushion",rounds:[[3,4,.5],[3,6,.4]],win:"Trouvé deux fois !"},thx:"Tu as l'œil ! La prochaine fois, je me cache mieux."},
  copain:{ok:()=>!scn.rain,friend:1,goal:"chercher un ami",
    ask:fr=>`Tu peux aller chercher ${FOX[fr].name} ? J'aimerais m'asseoir sur le banc avec ${FOX[fr].name}.`,
    thx:fr=>`Merci ! Avec ${FOX[fr].name}, on va regarder passer les nuages.`},
  panier:{ok:()=>R.obj.panier&&!scn.rain&&!taken(SPOT.basket),basket:1,goal:"la sieste dans le panier",
    ask:"Je tombe de sommeil… Je peux faire la sieste dans ton panier ?",thx:"Zzz… merci… il sent bon l'osier…"},
  conte:{ok:()=>phaseNow()==="nuit",goal:"une histoire avant de dormir",
    ask:"Tu me racontes une histoire avant de dormir ? Une toute petite.",
    tale:["Il était une fois un renard qui avait peur de la lune…","…jusqu'au soir où il a compris qu'elle le suivait pour lui faire de la lumière."],
    thx:"…elle me suit aussi, la lune ? … Bonne nuit…"}
};
const envOk=id=>isRes(id)&&!WILD[id]&&STORIES[id]&&storyDone(id)&&!isTarget(id);
const envFox=id=>foxes.find(f=>f.id===id&&!f.wild);
const envCur=()=>R.env.day===today()?R.env.cur:null;
const txt=(v,a)=>typeof v==="function"?v(a):v;

// au retour : une envie s'il n'y en a pas déjà une, deux par jour au plus
function envieTick(){
  if(R.env.day!==today())R.env={day:today(),n:0,last:0,cur:null}; // celles d'hier sont oubliées
  const c=R.env.cur;
  if(c&&!envFox(c.id)){R.env.cur=null;save()} // il est parti en balade : tant pis
  if(R.env.cur||R.env.n>=ENV_MAX||Date.now()-R.env.last<ENV_GAP||!R.intro||gameOn)return;
  const pool=foxes.filter(f=>!f.wild&&!f.walk&&!f.inside&&envOk(f.id));if(!pool.length)return;
  const f=pool[Math.floor(Math.random()*pool.length)],ks=Object.keys(ENVIES).filter(k=>ENVIES[k].ok());
  // pas deux fois la même envie dans la journée
  const fresh=ks.filter(k=>k!==R.env.lastK),k=(fresh.length?fresh:ks)[Math.floor(Math.random()*(fresh.length||ks.length))];if(!k)return;
  let friend=null;
  if(ENVIES[k].friend){const o=foxes.filter(x=>!x.wild&&x.id!==f.id&&!x.inside&&isRes(x.id)&&!isTarget(x.id));if(!o.length)return;friend=o[Math.floor(Math.random()*o.length)].id}
  R.env.cur={id:f.id,k,step:"ask",friend};R.env.n++;R.env.lastK=k;save();
  setBadge(f);renderStory();log(`${FOX[f.id].name} a une petite envie. Touche-le pour savoir laquelle.`);
}

// le signe au-dessus d'un renard : « ! » (histoire), « … » (petite envie), cœur (câlin du jour)
const DOTS=`<svg viewBox="0 0 24 14" aria-hidden="true"><circle cx="5" cy="7" r="2.4"/><circle cx="12" cy="7" r="2.4"/><circle cx="19" cy="7" r="2.4"/></svg>`;
function envBadge(id){const c=envCur();return !!c&&((c.step==="ask"&&c.id===id)||(c.step==="go"&&c.friend===id))}
function setBadge(f){f.el.querySelectorAll(".mark,.want,.envie").forEach(e=>e.remove());if(f.wild)return;
  if(isTarget(f.id))f.el.insertAdjacentHTML("beforeend",`<i class="mark">!</i>`);
  else if(envBadge(f.id))f.el.insertAdjacentHTML("beforeend",`<i class="envie">${DOTS}</i>`);
  else if(wantsHug(f.id))f.el.insertAdjacentHTML("beforeend",`<i class="want">${HEART}</i>`)}
function envGoal(){const c=envCur();if(!c)return null;const E=ENVIES[c.k],n=FOX[c.id].name;
  if(c.step==="ask")return {t:"Petite envie",g:`${n} a une petite envie : touche-le.`};
  if(E.friend)return {t:"Petite envie",g:`Va chercher ${FOX[c.friend].name} pour ${n}.`};
  if(E.basket)return {t:"Petite envie",g:`${n} fait la sieste dans le panier : va le voir.`};
  return {t:"Petite envie",g:`${n} : ${E.goal}.`}}

// le renard de l'envie reste là où il doit être (dans le panier) tant qu'on n'est pas venu le voir
function envHold(f){const c=envCur();return !!c&&c.step==="go"&&c.id===f.id&&ENVIES[c.k].basket&&f.spot===SPOT.basket&&!scn.rain}
// toucher un renard : vrai si ça concernait l'envie
function envieTap(f){const c=envCur();if(!c||gameOn)return false;const E=ENVIES[c.k];
  if(c.step==="ask"&&f.id===c.id){
    const lines=[[c.id,"open",txt(E.ask,c.friend)],["me","joy",E.tale?"Installe-toi. Il était une fois…":"D'accord !"]];
    talk(lines,()=>{c.step="go";save();
      if(E.game)playGame({...E.game,target:c.id},()=>envieDone(c));
      else if(E.tale)talk(E.tale.map(t=>["me","open",t]),()=>envieDone(c));
      else if(E.basket){f.until=0;goTo(f,SPOT.basket);renderStory()}
      else{setBadge(envFox(c.friend)||f);setBadge(f);renderStory()}});
    return true}
  if(c.step==="go"&&E.friend&&f.id===c.friend){
    talk([[c.friend,"joy",`${FOX[c.id].name} m'attend sur le banc ? J'arrive !`]],()=>{
      const a=envFox(c.id);for(const [x,sp] of [[a,SPOT.bench1],[f,SPOT.bench2]])if(x&&!x.walk){if(x.inside){x.inside=false;x.el.classList.remove("inside");x.x=DOOR.x;x.y=DOOR.y}if(x.spot!==sp)goTo(x,sp)}
      envieDone(c)});return true}
  if(c.step==="go"&&E.basket&&f.id===c.id&&f.spot===SPOT.basket){snapObj(f);envieDone(c);return true}
  return false}

// l'envie est faite : merci, +5 glands et un cœur
function envieDone(c){const E=ENVIES[c.k],f=envFox(c.id);
  R.env.cur=null;R.env.last=Date.now();R.glands+=5;const r=R.res[c.id];if(r)r.h++;save();
  talk([[c.id,"joy",txt(E.thx,c.friend)]],()=>{
    if(f){if(E.to&&!f.walk&&SPOT[E.to]&&!taken(SPOT[E.to]))goTo(f,SPOT[E.to]);else if(!f.walk&&!E.basket&&!E.friend){f.pose="happy";f.until=Date.now()+3000;draw(f)}hugFx(f)}
    for(const x of foxes)if(!x.wild)setBadge(x);
    renderHud();renderStory();toast(`Petite envie faite ! +5 glands, +1 cœur pour ${FOX[c.id].name}.`)})}
