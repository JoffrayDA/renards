/* La Clairière : les histoires. Voir docs/clairiere-v2.md, « Les histoires ».
   Une seule histoire à la fois, dans l'ordre d'ORDER. Le renard arrive pour son histoire (ou elle démarre s'il est déjà là),
   quelques heures après la fin de la précédente (GAP). Une histoire est une suite de moments : un renard ou un endroit
   porte un signe, on le touche, le dialogue se joue, et le moment suivant s'ouvre aussitôt. Ni amitié, ni météo, ni attente.
   R.beat[id] = moments finis ; R.souv[id] = souvenir reçu ; R.nextAt = quand la prochaine histoire peut commencer ;
   R.who[id][i] = le renard touché pour un moment « * » (pour relire l'histoire).
   at : un renard, "@endroit" (TG) ou "*" (n'importe quel autre renard du refuge). goal : ce qu'il faut faire pour ce moment.
   "me" parle : c'est Roussette, avec le nom choisi au Café. */
// ?vite=1 : le renard suivant arrive tout de suite (pour tester) ; retenu sur l'appareil, ?vite=0 l'enlève
const VITE=(()=>{const q=new URLSearchParams(location.search).get("vite");try{if(q==="0")localStorage.removeItem("clairiere-vite");else if(q!=null)localStorage.setItem("clairiere-vite","1");return !!localStorage.getItem("clairiere-vite")}catch(e){return q!=null&&q!=="0"}})();
const GAP=VITE?0:3*36e5;
if(!GAP)R.nextAt=0;
const TG={pond:{x:96,y:418,name:"la mare"},porch:{x:200,y:226,name:"le porche"},lampL:{x:60,y:214,name:"les lanternes"},stump:{x:85,y:288,name:"la souche"},
  leaves:{x:322,y:334,name:"le tas de feuilles"},tree:{x:366,y:150,name:"le grand arbre"},bench:{x:300,y:398,name:"le banc"}};
// Gribouille vient en dernier : son histoire réunit tout le monde pour le grand portrait. Les nouvelles histoires se glissent avant lui.
const ORDER=["petitpois","mitaine","luciole","gaston","galette","pantoufle","grignote","brindille","plouf","gribouille"];
// game : petit jeu avant le dialogue (games.js) ; after : renards qui se déplacent une fois le moment fini ;
// hide : le renard de l'histoire reste caché dans la maison pendant ce moment ; peu de texte, ça doit bouger
const STORIES={
  petitpois:{title:"Peur du noir",souv:"le gland porte-bonheur",beats:[
    {at:"petitpois",goal:"Petit Pois a quelque chose à te dire.",lines:[
      ["petitpois","shy",`${ME()}… le noir, je déteste. Ça fait crac. Hou-hou.`],
      ["petitpois","open","Tu crois qu'il existe quelqu'un qui n'a jamais peur ?"],
      ["me","open","Quelqu'un qui brille, peut-être… Je vais voir aux lanternes."]]},
    {at:"@lampL",arrive:"luciole",game:{k:"catch",say:"Des lucioles ! Attrape-les toutes !",win:"Toutes attrapées ! Mais… qui arrive là ?"},goal:"Cherche quelqu'un qui brille, près des lanternes.",lines:[
      ["luciole","surprise","Hé ! Doucement avec mes amies !"],
      ["luciole","joy","Moi, c'est Luciole. Ma queue brille toute seule. Pratique, non ?"],
      ["me","joy","Viens vite, quelqu'un doit absolument te rencontrer."]]},
    {at:"petitpois",after:[["petitpois","lampR"]],goal:"Présente Luciole à Petit Pois.",lines:[
      ["petitpois","surprise","Ta queue… elle fait de la lumière ?!"],
      ["luciole","joy","Viens, petit. Je vais t'apprendre à allumer les lanternes."]]},
    {at:"luciole",lamps:1,goal:"Va voir Luciole et Petit Pois aux lanternes.",lines:[
      ["petitpois","joy","J'ai allumé la grande lanterne ! Du premier coup !"],
      ["petitpois","open","En fait, le noir, c'est juste le moment où les lanternes sont jolies."],
      ["petitpois","shy","Tiens, mon gland porte-bonheur. Et maintenant, je peux t'aider au Café !"]]}
  ]},
  mitaine:{title:"La moufle perdue",souv:"la moufle au flocon",beats:[
    {at:"mitaine",goal:"Mitaine vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["mitaine","sad",`${ME()} ! Tu n'as pas vu ma moufle ? Rouge, avec un flocon brodé.`],
      ["mitaine","shy","C'est ma grand-mère qui l'a tricotée. Elle a peut-être roulé dans les feuilles…"]]},
    {at:"@leaves",game:{k:"search",item:"wool",say:"Fouille le tas de feuilles !",win:"Un fil de laine rouge !"},goal:"Cherche la moufle dans le tas de feuilles.",lines:[
      ["me","surprise","Le fil file tout droit vers le porche… et passe sous Petit Pois."]]},
    {at:"petitpois",sleep:1,goal:"Réveille Petit Pois, tout doucement.",lines:[
      ["petitpois","shy","Euh… Mitaine ? Je crois que je dors dedans depuis une semaine."],
      ["mitaine","joy","Garde-la, va. Elle te va mieux qu'à ma patte."],
      ["mitaine","open",`Et toi, ${ME()}, prends l'autre. Comme ça, on en a chacun une.`]]}
  ]},
  luciole:{title:"Une lumière de plus",souv:"le bocal de lumière",beats:[
    {at:"luciole",goal:"Luciole a une idée.",lines:[
      ["luciole","open","Six lanternes, et on est de plus en plus nombreux. Il en faut une de plus !"],
      ["luciole","shy","Un vieux bocal est coincé dans le grand arbre. Tu peux le décrocher ?"]]},
    {at:"@tree",game:{k:"shake",item:"jar",say:"Secoue le grand arbre !",win:"Le bocal est tombé !"},goal:"Fais tomber le bocal du grand arbre.",lines:[
      ["me","joy","Pas une fissure. Il n'attend plus que sa lumière."]]},
    {at:"luciole",lamps:1,goal:"Apporte le bocal à Luciole.",lines:[
      ["luciole","surprise","Attends, je souffle dedans…"],
      ["luciole","joy","Voilà : une lumière qui ne s'éteint jamais, même quand je dors. Elle est pour toi."]]}
  ]},
  gaston:{title:"Le poisson de la mare",souv:"la vieille canne de Gaston",beats:[
    {at:"gaston",after:[["gaston","pond"]],goal:"Gaston veut te demander quelque chose.",lines:[
      ["gaston","sad",`${ME()}, je pêche depuis toujours. Jamais rien attrapé. Rien de rien.`],
      ["gaston","open","Il paraît qu'un poisson vit dans ta mare. Tu essaies ? Moi, je porte malheur."]]},
    {at:"@pond",game:{k:"fish",say:"Touche l'eau dès que le bouchon plonge !",win:"Un poisson !"},goal:"Pêche dans la mare avec Gaston.",lines:[
      ["gaston","surprise","Tu l'as eu ! Un vrai poisson, tout orange !"],
      ["gaston","sad","Il nous regarde avec de si grands yeux… On le remet à l'eau ?"],
      ["gaston","joy","Au fond, ce que j'aime, c'est attendre au bord de l'eau avec quelqu'un."],
      ["gaston","open","Tiens, ma vieille canne. Pêche quand tu veux : un poisson de temps en temps, et beaucoup de vieilles bottes !"]]}
  ]},
  galette:{title:"Le record de ricochets",souv:"le caillou plat porte-bonheur",beats:[
    {at:"galette",after:[["galette","pond"]],goal:"Galette vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["galette","joy",`Salut ${ME()} ! Quatre rebonds : c'est mon record de ricochets. Personne ne l'a jamais battu.`],
      ["galette","open","Ta mare a l'air parfaite. Tu relèves le défi ?"]]},
    {at:"@pond",game:{k:"ricochet",need:5},goal:"Bats le record de Galette à la mare.",lines:[
      ["galette","surprise","Cinq rebonds ?! Tu as battu mon record !"],
      ["galette","joy","Tiens, mon caillou plat porte-bonheur. Il te revient. Mais je veux ma revanche !"]]}
  ]},
  pantoufle:{title:"Le renard du dedans",souv:"la pantoufle en laine",beats:[
    {at:"@porch",hide:1,goal:"Quelqu'un s'est glissé dans ta maison. Va voir à la porte.",lines:[
      ["pantoufle","shy","Chut ! Je ne suis pas là."],
      ["me","open","Pantoufle ? Tu ne veux pas sortir un peu ?"],
      ["pantoufle","sad","Dehors, il y a du vent, des feuilles, des gens. Ici, il y a un coussin."]]},
    {at:"@porch",hide:1,game:{k:"whack",who:"pantoufle",need:5,win:"Trouvé ! Et… il est dehors !"},after:[["pantoufle","p2"]],goal:"Joue à cache-cache avec Pantoufle.",lines:[
      ["pantoufle","joy","Hi hi ! Encore une !"],
      ["pantoufle","surprise","Oh… Je suis dehors. Je ne m'en suis même pas rendu compte."]]},
    {at:"pantoufle",goal:"Va voir Pantoufle sous le porche.",lines:[
      ["pantoufle","open","Dehors, ce n'est pas si mal. Surtout sous le porche."],
      ["pantoufle","shy","Tiens, ma pantoufle en laine. J'en ai une autre… quelque part dedans."]]}
  ]},
  grignote:{title:"Les pages envolées",souv:"la dernière page",beats:[
    {at:"grignote",goal:"Grignote vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["grignote","sad","J'avais un livre magnifique. J'ai lu une page… puis je l'ai mangée. Puis une autre."],
      ["grignote","shy","Il me restait la fin, mais le vent l'a emportée vers le banc ! Tu m'aides ?"]]},
    {at:"@bench",game:{k:"catch",thing:"page",n:6,say:"Attrape les pages avant que le vent les emporte !"},goal:"Rattrape les pages de Grignote, près du banc.",lines:[
      ["me","joy","Six pages, un peu froissées… et la fin de l'histoire !"]]},
    {at:"grignote",goal:"Rapporte les pages à Grignote.",lines:[
      ["grignote","surprise","La fin ! … Le petit renard rentre chez lui, et tout le monde l'attend. Comme ici."],
      ["grignote","shy","Celle-là, je ne la mangerai pas. Garde-la pour moi ?"]]}
  ]},
  brindille:{title:"Une écharpe pour chacun",souv:"l'écharpe tricotée",beats:[
    {at:"brindille",goal:"Mamie Brindille vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["brindille","joy",`Bonjour, ma petite pelote. Je tricote une écharpe pour chaque renard du refuge.`],
      ["brindille","sad","Mais un écureuil m'a chipé ma laine. Il l'a cachée dans le grand arbre, ce chenapan."]]},
    {at:"@tree",game:{k:"shake",item:"wool",say:"Secoue le grand arbre !",win:"La pelote est tombée !"},goal:"Récupère la pelote dans le grand arbre.",lines:[
      ["me","joy","La pelote, toute entière. Enfin… presque. L'écureuil s'en est fait un nid."]]},
    {at:"brindille",goal:"Rapporte la pelote à Mamie Brindille.",lines:[
      ["brindille","joy","Merci, ma petite pelote. Clic, clac, clic… Voilà !"],
      ["brindille","open","La première écharpe est pour toi. Les autres, j'ai le temps : je suis la doyenne, pas la plus pressée."]]}
  ]},
  plouf:{title:"La danse des flaques",souv:"les petites bottes de pluie",beats:[
    {at:"plouf",goal:"Plouf vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["plouf","joy",`${ME()} ! Tu connais la danse des flaques ? Je saute, tu répètes !`],
      ["plouf","open","Pas de pluie ? Pas grave, je viens d'en faire avec l'arrosoir."]]},
    {at:"plouf",game:{k:"simon",who:"plouf",rounds:[3,4,5]},goal:"Danse dans les flaques avec Plouf.",lines:[
      ["plouf","joy","Regarde-nous : deux éponges ! C'est le plus beau des compliments."],
      ["plouf","shy","Tiens, mes petites bottes de pluie. Moi, je préfère les pattes mouillées."]]}
  ]},
  gribouille:{title:"Le grand portrait",souv:"le grand portrait du refuge",beats:[
    {at:"gribouille",goal:"Gribouille vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["gribouille","joy",`Bonjour ${ME()} ! Je peins avec ma queue : tu vois le bout bleu ?`],
      ["gribouille","shy","Je voudrais peindre tout le monde, mais ils me fuient dès que je sors mes couleurs. Tu m'aides ?"]]},
    {at:"*",leave:1,goal:"Demande à un renard de poser pour Gribouille.",lines:id=>[
      [id,"joy","Poser ? Avec plaisir !"],
      [id,"surprise","…Oh, un papillon ! Je reviens !"],
      ["me","sad",`Et hop, plus de ${FOX[id].name}. Essayons avec quelqu'un d'autre.`]]},
    {at:"*",game:{k:"still",say:"Chasse les mouches, sinon il éternue !",win:"Ne bouge plus… Voilà !"},goal:"Essaie avec un autre renard.",lines:id=>[
      ["gribouille","joy",`Un portrait de ${FOX[id].name} ! Mon premier !`],
      ["gribouille","sad","Mais un renard tout seul sur un tableau, ça fait un peu triste…"],
      ["me","open","Et si on vous peignait tous ensemble ?"],
      ["gribouille","surprise","Le grand portrait ! Appelle tout le monde devant la maison !"]]},
    {at:"@porch",gather:1,game:{k:"still",all:1,say:"Tout le monde pose ! Chasse les mouches !",win:"Ne bougez plus… Voilà !"},goal:"Appelle tout le monde devant la maison.",lines:[
      ["petitpois","surprise","Mais… Gribouille, tu n'es pas dessus, toi !"],
      ["gribouille","shy","Le peintre, on ne le voit jamais. C'est normal."]]},
    {at:"gribouille",goal:"Va voir le tableau de Gribouille.",lines:[
      ["petitpois","open","Prête-moi ta queue. Là, dans le coin. Voilà : toi."],
      ["gribouille","joy","Tout de travers… C'est le plus beau morceau du tableau. Tiens, il est pour toi."]]}
  ]}
};

/* ---------- reprise des anciennes histoires (une étape par jour) ---------- */
// étapes finies de l'ancienne version -> moments finis de la nouvelle
if(!R.beat){const MIG={petitpois:[0,1,3,4],mitaine:[0,1,2,3]};R.beat={};
  for(const id in MIG)if(R.story[id])R.beat[id]=MIG[id][Math.min(3,R.story[id])];
  R.nextAt=0;save()}
R.who=R.who||{};

const beats=id=>STORIES[id].beats;
const storyDone=id=>(R.beat[id]||0)>=beats(id).length;
const chainDone=()=>ORDER.every(storyDone);
// l'histoire en cours et le moment attendu (null si on attend le prochain renard)
function cur(){if(!R.intro)return null;const id=ORDER.find(k=>!storyDone(k));if(!id||!isRes(id))return null;
  const n=R.beat[id]||0;if(!n&&Date.now()<(R.nextAt||0))return null;return {id,n,b:beats(id)[n]}}
// renards qui peuvent répondre à un moment « * » : les autres renards du refuge, pas celui d'avant
function anyOk(c,fid){if(!isRes(fid)||WILD[fid]||fid===c.id)return false;const prev=(R.who[c.id]||{})[c.n-1];
  return fid!==prev||!foxes.some(f=>!f.wild&&f.id!==c.id&&f.id!==prev)}
// le renard de l'histoire caché dans la maison (Pantoufle)
function isHidden(fid){const c=cur();return !!c&&c.id===fid&&!!c.b.hide}
function isTarget(fid){const c=cur();return !!c&&(c.b.at===fid||(c.b.at==="*"&&anyOk(c,fid)))}
// renards qui doivent être dans la scène pour l'histoire
function storyFoxes(){const c=cur();return c?[c.id,"petitpois",c.b.at].filter(isRes):[]}

/* ---------- le prochain renard ---------- */
// il arrive par la forêt dès que l'attente est finie ; page fermée, il est déjà là au retour
let storyKey="";
function chainTick(live){const id=ORDER.find(k=>!storyDone(k)),c=cur();
  if(R.intro&&(c?c.id+c.n:"")!==storyKey)renderStory(); // l'attente d'un renard déjà là vient de finir
  if(!R.intro||!id||isRes(id)||Date.now()<(R.nextAt||0))return;
  R.res[id]={at:Date.now(),h:0,pet:""};save();
  // celui qui se cache (Pantoufle) file droit dans la maison
  if(live){const f=makeFox(id,null),fs=SPOTS.filter(s=>!taken(s)&&!s.bowl&&!s.lamp);setTimeout(()=>goTo(f,beats(id)[0].hide?"door":fs[Math.floor(Math.random()*fs.length)]||SPOT.g3),60);toast(`${FOX[id].name} arrive au refuge !`)}
  renderStory();
}
// un renard qui vient pendant l'histoire (Luciole) entre par la forêt et va à l'endroit voulu
function bringIn(id,to){if(!isRes(id)){R.res[id]={at:Date.now(),h:0,pet:""};save()}
  let f=foxes.find(x=>x.id===id&&!x.wild);if(!f)f=makeFox(id,null);
  if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y}
  if(!f.walk)setTimeout(()=>goTo(f,to),60)}

// tout le monde vient se ranger devant la maison, pour le portrait
function gather(){syncFoxes();const near=SPOTS.filter(s=>!s.bowl).sort((a,b)=>Math.hypot(a.x-DOOR.x,a.y-DOOR.y)-Math.hypot(b.x-DOOR.x,b.y-DOOR.y));
  foxes.filter(f=>!f.wild).forEach((f,i)=>{const to=near[i];if(!to)return;if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y}
    if(f.spot!==to)goTo(f,to)})}

/* ---------- jouer un moment ---------- */
// appelé quand on touche un renard ou un endroit ; vrai si c'était le moment attendu
function storyTap(at){const c=cur();if(!c||gameOn||!$("talk").hidden||!$("sheet").hidden)return false;
  if(at.startsWith("@")?c.b.at!==at:!isTarget(at))return false;
  const b=c.b;
  if(b.arrive)bringIn(b.arrive,SPOT[b.at.slice(1)]||SPOT.g3);
  if(b.lamps){scn.lamps={L:true,R:true};drawGlow()}
  if(b.gather)gather();
  if(b.at==="*")(R.who[c.id]=R.who[c.id]||{})[c.n]=at;
  hotEl.hidden=true;
  syncFoxes();
  const go=()=>talk(typeof b.lines==="function"?b.lines(at):b.lines,()=>{
    R.beat[c.id]=c.n+1;
    for(const [fid,sp] of b.after||[]){const f=foxes.find(x=>x.id===fid&&!x.wild);if(!f||f.walk)continue;
      if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y;drawGlow()}goTo(f,SPOT[sp])}R.glands+=3; // chaque moment rapporte des glands, la fin d'une histoire bien plus
    if(b.leave){const f=foxes.find(x=>x.id===at);if(f)f.until=0}
    if(c.id==="gaston"&&storyDone("gaston")){drawBg();log("La pêche est ouverte : touche la mare quand tu veux.")}
    if(storyDone(c.id)){R.souv[c.id]=STORIES[c.id].souv;R.nextAt=Date.now()+GAP;R.glands+=15;toast(`Souvenir reçu : ${STORIES[c.id].souv}. +18 glands`)}
    else toast("+3 glands");
    save();renderStory();renderHud();
  });
  if(b.game)playGame({...b.game,target:at},go);else go();
  return true;
}

/* ---------- repères : signes, endroit qui brille, objectif ---------- */
const hotEl=document.createElement("button");hotEl.className="hot";hotEl.type="button";hotEl.hidden=true;
hotEl.innerHTML=`<i class="mark">!</i>`;
hotEl.onpointerdown=e=>{e.stopPropagation();const c=cur();if(c)storyTap(c.b.at)};
$("actors").appendChild(hotEl);
function goalText(){const c=cur();
  if(c)return {t:`${STORIES[c.id].title} · ${c.n+1} sur ${beats(c.id).length}`,g:c.b.goal};
  const id=ORDER.find(k=>!storyDone(k));
  if(!id)return {t:"Histoires",g:"Toutes les histoires sont finies. D'autres arrivent bientôt."};
  return {t:"Prochaine histoire",g:isRes(id)?`${FOX[id].name} aura quelque chose à te raconter dans quelques heures.`:"Un nouveau renard arrivera dans quelques heures."};
}
function renderStory(){
  const c=cur();
  storyKey=c?c.id+c.n:"";
  for(const f of foxes)if(!f.wild){const t=isTarget(f.id),m=f.el.querySelector(".mark");
    if(t&&f.inside)f.until=0;
    if(isHidden(f.id)&&!f.inside&&!f.walk){f.inside=true;f.walk=null;f.el.classList.add("inside");drawGlow()}
    if(t&&c.b.sleep&&!f.walk&&f.pose!=="sleep"){f.pose="sleep";f.until=Date.now()+6e5;draw(f)}
    else if(t&&!m)f.el.insertAdjacentHTML("beforeend",`<i class="mark">!</i>`);else if(!t&&m)m.remove();
  }
  const s=c&&c.b.at.startsWith("@")&&TG[c.b.at.slice(1)];
  hotEl.hidden=!s;if(s){hotEl.style.cssText=pc(s.x,s.y);hotEl.setAttribute("aria-label",s.name)}
  if(!R.intro){$("goal").hidden=true;return}
  const g=goalText();$("goal").hidden=false;$("goal").innerHTML=`<span><b>${g.t}</b>${g.g}</span><i aria-hidden="true">›</i>`;
}

/* ---------- le journal des histoires ---------- */
function journal(){
  const c=cur(),nextId=ORDER.find(k=>!storyDone(k));
  const row=id=>{const S=STORIES[id],n=R.beat[id]||0,N=beats(id).length,f=FOX[id];
    if(storyDone(id))return `<div class="opt"><span class="thumb">${foxArt(f,{expr:"joy",portrait:1})}</span><div class="txt"><strong>${S.title}</strong><span>${f.name} · terminée. Souvenir : ${R.souv[id]||S.souv}.</span></div><button class="btn ghost" data-reread="${id}" type="button">Relire</button></div>`;
    const dots=`<span class="dots">${Array.from({length:N},(_,i)=>`<i class="${i<n?"on":""}"></i>`).join("")}</span>`;
    if(c&&c.id===id)return `<div class="opt now"><span class="thumb">${foxArt(f,{expr:"open",portrait:1})}</span><div class="txt"><strong>${S.title}</strong>${dots}<span>${c.b.goal}</span></div></div>`;
    if(id===nextId)return `<div class="opt"><span class="thumb">${foxArt(f,{portrait:1,sil:!isRes(id)})}</span><div class="txt"><strong>${isRes(id)?S.title:"???"}</strong><span>${goalText().g}</span></div></div>`;
    return `<div class="opt unseen"><span class="thumb">${foxArt(f,{portrait:1,sil:!isRes(id)})}</span><div class="txt"><strong>???</strong><span>${isRes(id)?`${f.name} te racontera son histoire plus tard.`:"Une histoire à venir."}</span></div></div>`};
  openSheet(`<h2>Les histoires</h2><p class="sub">Une histoire à la fois. Touche le renard ou l'endroit qui porte un <b class="markin">!</b> pour avancer.</p>${ORDER.map(row).join("")}`);
}

// dans la fiche du renard : où en est son histoire
function storyHTML(id){const S=STORIES[id];if(!S)return "";const n=R.beat[id]||0,c=cur();
  const next=storyDone(id)?`Histoire terminée. Souvenir : ${R.souv[id]||S.souv}.`:c&&c.id===id?c.b.goal:"Son histoire viendra plus tard.";
  return `<p class="story"><b>Histoire : ${S.title}</b>${n&&!storyDone(id)?` · ${n+1} sur ${beats(id).length}`:""}<br>${next}</p>${n?`<button class="btn ghost" data-reread="${id}" type="button">Relire l'histoire</button>`:""}`}
// relit les moments déjà passés, à la suite
function reread(id){const n=R.beat[id]||0;closeSheet();
  talk(beats(id).slice(0,n).flatMap((b,i)=>typeof b.lines==="function"?b.lines((R.who[id]||{})[i]||"petitpois"):b.lines),()=>{})}

// compagnon au Café : Petit Pois, ou tout renard dont l'histoire est terminée
const canBuddy=id=>isRes(id)&&(id==="petitpois"||(STORIES[id]&&storyDone(id)));
function buddyHTML(id){if(!canBuddy(id))return "";
  const own=((load(CAFEKEY)||{}).own||{}).serveur,n=(R.tog[id]||0);
  const why=own?"":" Sa place à côté de toi s'ouvre avec l'Apprenti serveur, dans la boutique du Café.";
  const days=n?` ${n} journée${n>1?"s":""} ensemble au Café.`:"";
  return R.buddy===id?`<p class="story"><b>Ton compagnon au Café.</b> Chaque journée ensemble ajoute un cœur.${days}${why}</p>`
    :`<p class="story">Il peut t'accompagner au Café : même aide que Petit Pois, et chaque journée ensemble ajoute un cœur.${why}</p><button class="btn" data-buddy="${id}" type="button">L'emmener au Café</button>`}
