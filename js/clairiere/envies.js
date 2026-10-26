/* La Clairière : les petites envies (docs/clairiere-v2.md, décisions du 26/10/2026).
   Au retour du joueur, un renard dont l'histoire est finie a une petite envie : une bulle « … » au-dessus de lui.
   On le touche, il demande, on le fait (souvent un petit jeu), il remercie : +5 glands et un cœur.
   Deux par jour au plus, jamais cumulées : une envie pas faite disparaît le lendemain (on ne punit pas l'absence).
   R.env = {day, n (envies du jour), last (fin de la dernière), cur:{id, k, m (son envie à lui : index dans MINE[id]), step:"ask"|"go", friend}} */
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
  ricochet:{ok:()=>!scn.rain,ask:"Tu fais des ricochets avec moi ? Trois rebonds, pour commencer.",goal:"des ricochets",
    game:{k:"ricochet",need:3},thx:"Trois rebonds ! Tu deviens fort."},
  conte:{ok:()=>phaseNow()==="nuit",goal:"une histoire avant de dormir",
    ask:"Tu me racontes une histoire avant de dormir ? Une toute petite.",
    tale:["Il était une fois un renard qui avait peur de la lune…","…jusqu'au soir où il a compris qu'elle le suivait pour lui faire de la lumière."],
    thx:"…elle me suit aussi, la lune ? … Bonne nuit…"}
};
// les envies propres à chaque renard (Joffray : pas d'envie générique, l'attachement vient du détail) ;
// k : le genre d'envie (ENVIES) ; ami : le renard à aller chercher ; {ami} : son nom dans le texte ; tale : son histoire du soir.
// Quand aucune ne va (pluie, jour, ami absent), le renard prend une envie commune.
const MINE={
  petitpois:[{k:"lucioles",ask:"Il fait noir… Tu m'attrapes la luciole dorée ? Je la garde juste une minute, promis.",thx:"Elle brille comme toi quand tu rentres du Café."},
    {k:"copain",ami:"luciole",ask:"Tu peux appeler Luciole ? Je veux lui montrer que je n'ai plus peur. Enfin… presque plus.",thx:"Regarde, Luciole ! Je suis assis dans le noir. Tout seul. … Avec vous deux."}],
  mitaine:[{k:"feuilles",ask:"Ma moufle ! … Ah non, c'est une feuille rouge. Tu m'en fais un tas ? Je chercherai dedans, au cas où.",thx:"Pas de moufle. Mais un tas tout chaud pour les pattes."},
    {k:"conte",ask:"Mamie me racontait l'histoire du flocon qui ne voulait pas fondre. Tu la connais ?",tale:["Il était une fois un flocon qui ne voulait pas fondre…","…alors il s'est posé sur une moufle rouge, et il y est resté tout l'hiver."],thx:"C'est exactement celle-là… Merci."}],
  luciole:[{k:"lucioles",ask:"Une luciole dorée s'est perdue loin des autres. Tu m'aides à la retrouver ? Elle a peur sans sa famille.",thx:"La voilà ! Ma queue brille plus fort quand elles sont toutes là."},
    {k:"copain",ami:"petitpois",ask:"Va chercher Petit Pois. Ce soir, c'est lui qui allume les lanternes, et je veux être au premier rang.",thx:"Il allume comme un grand, maintenant. Je suis fière de lui."}],
  gaston:[{k:"poisson",ask:"Je pêche depuis toujours. Tu crois que c'est la canne ? Essaie, toi, pour voir.",thx:"Du premier coup ?! … C'était forcément la canne."},
    {k:"copain",ami:"galette",ask:"Tu peux appeler Galette ? Ses ricochets font fuir les poissons. Comme ça, si je n'attrape rien, j'ai une excuse.",thx:"On n'a rien attrapé. Mais on a bien ri."}],
  galette:[{k:"ricochet",ask:"Mon record tient toujours. Tu veux t'entraîner ? Trois rebonds, pour commencer.",thx:"Pas mal ! Mais le record reste à moi."},
    {k:"pommes",ask:"J'ai lancé tous mes cailloux plats dans la mare. Pour me consoler… des pommes ?",thx:"Une pomme, ça ne ricoche pas. J'ai essayé. Ça se mange, par contre."}],
  pantoufle:[{k:"coussin",ask:"On refait le jeu des coussins ? Moi dessous, toi qui cherches. C'est mieux, dedans.",thx:"Tu m'as trouvé. Je peux rester sous ce coussin pour toujours ?"},
    {k:"conte",ask:"Raconte-moi une histoire de dehors. De loin, c'est moins effrayant.",tale:["Il était une fois un renard qui n'aimait pas dehors…","…un jour, il a ouvert la porte, un tout petit peu. Dehors sentait la pluie et les pommes. Il a refermé. Mais il a souri."],thx:"Une porte entrouverte… J'y réfléchirai. Demain. Peut-être."}],
  grignote:[{k:"conte",ask:"Tu me racontes une histoire ? Je promets de ne pas la manger. Juste les bords.",tale:["Il était une fois un livre très bon…","…si bon que personne n'osait le finir, de peur qu'il n'y en ait plus."],thx:"Mmm. Celle-là, je la garde entière."},
    {k:"feuilles",ask:"Les feuilles d'automne craquent comme des pages. Tu m'en fais un tas ?",thx:"Crounch ! Pas mauvais. Un peu sec, comme un dictionnaire."}],
  brindille:[{k:"conte",ask:"D'habitude, c'est moi qui raconte. Ce soir, j'aimerais écouter.",tale:["Il était une fois une pelote de laine qui voulait voir le monde…","…elle a roulé si loin qu'elle est devenue une écharpe, et le monde est venu jusqu'à elle."],thx:"Tu racontes bien. Je te tricoterai des chaussettes. Assorties, cette fois."},
    {k:"copain",ami:"mitaine",ask:"Va chercher Mitaine, mon petit. J'ai un nouveau modèle de moufle à lui montrer.",thx:"Deux moufles attachées par un fil. Comme ça, plus jamais perdues."}],
  plouf:[{k:"flaques",ask:"Il pleut ! IL PLEUT ! Viiite, les flaques !",thx:"On rentre ? Non. Encore une !"},
    {k:"pommes",ask:"Pas de pluie… Tu me rattrapes des pommes ? Je les lancerai dans la mare, ça fait plouf.",thx:"Plouf ! Plouf ! C'est presque aussi bien que les flaques."}],
  biscuit:[{k:"pommes",ask:"La tarte de l'autre jour… J'en rêve encore. Tu me rattrapes des pommes ?",thx:"Il faudra une deuxième tarte. Pour la science."},
    {k:"panier",ask:"J'ai trop goûté. Je peux digérer un peu dans ton panier ?",thx:"Zzz… une miette… de tarte…"}],
  cannelle:[{k:"feuilles",ask:"Mon lit de feuilles s'est envolé. Tu m'en refais un ? Bien épais.",thx:"Ça sent l'automne… Bonne n… Zzz."},
    {k:"panier",ask:"Le panier a l'air presque aussi moelleux que les feuilles. Je peux essayer ?",thx:"Presque aussi bien… Zzz…"}],
  charbon:[{k:"lucioles",ask:"Le noir, c'est ma couleur. Mais j'aime quand quelque chose brille dedans. Tu m'en attrapes une ?",thx:"Une lumière, et moi tout gris à côté. C'est joli, non ?"},
    {k:"coussin",ask:"On joue aux coussins ? Je suis très fort pour me cacher. Tout gris, on ne me voit pas.",thx:"Tu m'as trouvé quand même. D'habitude, personne ne me cherche."}],
  brume:[{k:"flaques",ask:"Avec mon parapluie-feuille, je ne crains rien. On saute dans les flaques ? Toi, tu seras mouillé, par contre.",thx:"Tu ressembles à une éponge. Une éponge contente."},
    {k:"copain",ami:"charbon",ask:"Charbon est tout seul, il n'aime pas la pluie. Tu l'appelles ? Il y a de la place sous mon parapluie.",thx:"Deux sous un parapluie-feuille. Un peu serrés. Très bien."}],
  moka:[{k:"pommes",ask:"J'ai raté le goûter, c'est ça ? Il reste des pommes dans l'arbre ?",thx:"Pour une fois, je suis arrivé à temps !"},
    {k:"conte",ask:"Une histoire ? D'accord, mais vite. Je dois être quelque part. Je ne sais plus où.",tale:["Il était une fois un renard toujours en retard…","…un jour, il est arrivé trop tard pour la pluie, et juste à temps pour l'arc-en-ciel."],thx:"Juste à temps pour l'arc-en-ciel… J'aime bien."}],
  libellule:[{k:"poisson",ask:"Tu pêches un poisson ? Je voudrais juste le regarder de près, puis on le rend à l'eau.",thx:"Il a des écailles comme des petits miroirs. Au revoir, poisson."},
    {k:"copain",ami:"plouf",ask:"Tu peux appeler Plouf ? J'aimerais lui demander, gentiment, de ne pas sauter dans la mare ce soir.",thx:"Il a promis. Il saute déjà dans une flaque à côté. C'est un début."}],
  gribouille:[{k:"lucioles",ask:"Il me faut une lumière dorée pour mon prochain tableau. Tu me trouves la luciole ?",thx:"Cette couleur-là ! Vite, mes pinceaux… enfin, ma queue."},
    {k:"copain",ask:"Va me chercher un modèle. N'importe qui. Il faut juste qu'il ne bouge pas.",thx:"Ne bougez plus… Voilà. {ami} a un nez de patate. C'est de l'art."}],
  copeau:[{k:"copain",ask:"Tu peux m'appeler {ami} ? Je dois prendre ses mesures. Pour un lit. Surprise !",thx:"Parfait. Un lit sur mesure pour {ami}, à la fin de la semaine. Peut-être."},
    {k:"feuilles",ask:"J'ai besoin de feuilles sèches pour caler une étagère. Tu m'en fais un tas ?",thx:"Calée ! Elle ne penche plus. Enfin, presque plus."}],
  sesame:[{k:"feuilles",ask:"J'ai encore perdu une clé. Je ne sais plus laquelle. Tu me fais un tas de feuilles ? Je vais chercher dedans.",thx:"Pas de clé. Mais j'ai retrouvé une chaussette de Mamie Brindille."},
    {k:"lucioles",ask:"Une luciole dorée, ça éclaire bien le sol. Tu m'en attrapes une ? J'ai perdu… quelque chose.",thx:"Ma clé de boîte aux lettres ! Elle était dans ma poche. Depuis le début."}],
  marquis:[{k:"panier",ask:"Ce panier a-t-il une couverture ? Je ne m'assois que sur du moelleux, vois-tu.",thx:"Acceptable. Tout à fait acceptable. Zzz."}],
  zaza:[{k:"flaques",ask:"J'entends chaque goutte. Tu sautes dans les flaques ? Je veux entendre la musique.",thx:"Do, mi, sol… Tu sautes juste !"}],
  flocon:[{k:"lucioles",ask:"Une lumière dorée, quelque part dans le noir… Tu me la montres ?",thx:"Je pourrais la regarder jusqu'au matin."}],
  noisette:[{k:"pommes",ask:"Pour mes recherches, il me faudrait six pommes. Les glands, je les connais déjà par cœur.",thx:"Fascinant. Une pomme n'est pas un gland. Je le note."}],
  comete:[{k:"conte",ask:"Raconte-moi la nuit d'où je viens. Tu l'inventes, je fais semblant d'y croire.",tale:["Il était une fois une étoile qui s'ennuyait tout là-haut…","…elle a sauté, elle est tombée dans une clairière, et elle a trouvé quelqu'un pour qui briller."],thx:"C'est presque vrai, tu sais."}],
  givre:[{k:"feuilles",ask:"Pas de neige ici… Un tas de feuilles, ça marche pareil ? Je veux m'y rouler jusqu'à disparaître.",thx:"Tu me vois ? Non ? Parfait."}],
  painepice:[{k:"pommes",ask:"Des pommes, de la cannelle, un four chaud… On commence par les pommes ?",thx:"Ça sent déjà le gâteau. Enfin, ça sent moi."},
    {k:"copain",ami:"brioche",ask:"Tu peux appeler Brioche ? Le goûter est prêt, et il refroidit.",thx:"Moitié-moitié. Comme toujours."}],
  brioche:[{k:"pommes",ask:"C'est l'heure du goûter. Il est toujours l'heure du goûter.",thx:"Miam. Et le goûter d'après, c'est quand ?"},
    {k:"copain",ami:"painepice",ask:"Tu sais où est Pain d'épice ? Je lui ai gardé la moitié de ma pomme.",thx:"Il rougit quand je partage. Je vais partager souvent."}]
};
// le texte d'une envie : celle du renard s'il en a une, sinon la commune
const envDef=c=>c.m!=null&&MINE[c.id]?.[c.m]?{...ENVIES[c.k],...MINE[c.id][c.m]}:ENVIES[c.k];
// les renards arrivés du Café après les histoires (sans histoire à eux) ont aussi des envies
const envOk=id=>isRes(id)&&!WILD[id]&&(!STORIES[id]||storyDone(id))&&!isTarget(id);
const envFox=id=>foxes.find(f=>f.id===id&&!f.wild);
const envCur=()=>R.env.day===today()?R.env.cur:null;
const txt=(v,a)=>typeof v==="function"?v(a):a?v.replaceAll("{ami}",FOX[a].name):v;

// au retour : une envie s'il n'y en a pas déjà une, deux par jour au plus
function envieTick(){
  if(R.env.day!==today())R.env={day:today(),n:0,last:0,cur:null}; // celles d'hier sont oubliées
  const c=R.env.cur;
  if(c&&!envFox(c.id)){R.env.cur=null;save()} // il est parti en balade : tant pis
  if(R.env.cur||R.env.n>=ENV_MAX||Date.now()-R.env.last<ENV_GAP||!R.intro||gameOn)return;
  const pool=foxes.filter(f=>!f.wild&&!f.walk&&!f.inside&&envOk(f.id));if(!pool.length)return;
  const f=pool[Math.floor(Math.random()*pool.length)];
  const mates=foxes.filter(x=>!x.wild&&!x.inside&&x.id!==f.id&&isRes(x.id)&&!isTarget(x.id)).map(x=>x.id);
  // pas deux fois la même envie dans la journée ; d'abord une envie à lui (trois fois sur quatre), qui va avec l'heure, la météo, et dont l'ami est là
  const fits=k=>ENVIES[k].ok()&&k!==R.env.lastK&&(k!=="copain"||mates.length);
  const mine=(MINE[f.id]||[]).map((e,i)=>[e,i]).filter(([e])=>fits(e.k)&&(!e.ami||mates.includes(e.ami)));
  let k,m=null,friend=null;
  if(mine.length&&Math.random()<.75){const [e,i]=mine[Math.floor(Math.random()*mine.length)];k=e.k;m=i;friend=e.ami||null}
  else{const ks=Object.keys(ENVIES).filter(fits);if(!ks.length)return;k=ks[Math.floor(Math.random()*ks.length)]}
  if(k==="copain"&&!friend)friend=mates[Math.floor(Math.random()*mates.length)];
  R.env.cur={id:f.id,k,m,step:"ask",friend};R.env.n++;R.env.lastK=k;save();
  setBadge(f);renderStory();log(`${FOX[f.id].name} a une petite envie. Touche-le pour savoir laquelle.`);
}

// le signe au-dessus d'un renard : « ! » (histoire), « … » (petite envie), cœur (câlin du jour)
const DOTS=`<svg viewBox="0 0 24 14" aria-hidden="true"><circle cx="5" cy="7" r="2.4"/><circle cx="12" cy="7" r="2.4"/><circle cx="19" cy="7" r="2.4"/></svg>`;
function envBadge(id){const c=envCur();return !!c&&((c.step==="ask"&&c.id===id)||(c.step==="go"&&c.friend===id))}
function setBadge(f){f.el.querySelectorAll(".mark,.want,.envie").forEach(e=>e.remove());if(f.wild)return;
  if(isTarget(f.id))f.el.insertAdjacentHTML("beforeend",`<i class="mark">!</i>`);
  else if(envBadge(f.id))f.el.insertAdjacentHTML("beforeend",`<i class="envie">${DOTS}</i>`);
  else if(wantsHug(f.id))f.el.insertAdjacentHTML("beforeend",`<i class="want">${HEART}</i>`)}
function envGoal(){const c=envCur();if(!c)return null;const E=envDef(c),n=FOX[c.id].name;
  if(c.step==="ask")return {t:"Petite envie",g:`${n} a une petite envie : touche-le.`};
  if(E.friend)return {t:"Petite envie",g:`Va chercher ${FOX[c.friend].name} pour ${n}.`};
  if(E.basket)return {t:"Petite envie",g:`${n} fait la sieste dans le panier : va le voir.`};
  return {t:"Petite envie",g:`${n} : ${E.goal}. Touche-le pour commencer.`}}

// le renard de l'envie reste là où il doit être (dans le panier) tant qu'on n'est pas venu le voir
function envHold(f){const c=envCur();return !!c&&c.step==="go"&&c.id===f.id&&ENVIES[c.k].basket&&f.spot===SPOT.basket&&!scn.rain}
// toucher un renard : vrai si ça concernait l'envie
function envieTap(f){const c=envCur();if(!c||gameOn)return false;const E=envDef(c);
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
  // jeu ou histoire du soir interrompus (Joffray était bloqué sur « sauter dans les flaques ») : on relance en touchant le renard
  if(c.step==="go"&&f.id===c.id&&(E.game||E.tale)){
    if(E.game)playGame({...E.game,target:c.id},()=>envieDone(c));else talk(E.tale.map(t=>["me","open",t]),()=>envieDone(c));
    return true}
  return false}

// l'envie est faite : merci, +5 glands et un cœur
function envieDone(c){const E=envDef(c),f=envFox(c.id);
  R.env.cur=null;R.env.last=Date.now();R.glands+=5;const r=R.res[c.id];if(r)r.h++;save();
  talk([[c.id,"joy",txt(E.thx,c.friend)]],()=>{
    if(f){if(E.to&&!f.walk&&SPOT[E.to]&&!taken(SPOT[E.to]))goTo(f,SPOT[E.to]);else if(!f.walk&&!E.basket&&!E.friend){f.pose="happy";f.until=Date.now()+3000;draw(f)}hugFx(f)}
    for(const x of foxes)if(!x.wild)setBadge(x);
    renderHud();renderStory();toast(`Petite envie faite ! +5 glands, +1 cœur pour ${FOX[c.id].name}.`)})}
