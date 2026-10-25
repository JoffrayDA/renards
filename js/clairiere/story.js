/* La Clairière : les histoires. Voir docs/clairiere-v2.md, « Les histoires ».
   Une seule histoire à la fois, dans l'ordre d'ORDER. Le renard arrive pour son histoire (ou elle démarre s'il est déjà là),
   quelques heures après la fin de la précédente (GAP). Une histoire est une suite de moments : un renard ou un endroit
   porte un signe, on le touche, le dialogue se joue, et le moment suivant s'ouvre aussitôt. Ni amitié, ni météo, ni attente.
   R.beat[id] = moments finis ; R.souv[id] = souvenir reçu ; R.nextAt = quand la prochaine histoire peut commencer ;
   R.who[id][i] = le renard touché pour un moment « * » (pour relire l'histoire).
   at : un renard, "@endroit" (TG) ou "*" (n'importe quel autre renard du refuge). goal : ce qu'il faut faire pour ce moment.
   "me" parle : c'est Roussette, avec le nom choisi au Café. */
const GAP=3*36e5;
const TG={pond:{x:96,y:418,name:"la mare"},porch:{x:200,y:226,name:"le porche"},lampL:{x:60,y:214,name:"les lanternes"},stump:{x:85,y:288,name:"la souche"}};
// Gribouille vient en dernier : son histoire réunit tout le monde pour le grand portrait. Les nouvelles histoires se glissent avant lui.
const ORDER=["petitpois","mitaine","luciole","gaston","gribouille"];
const STORIES={
  petitpois:{title:"Peur du noir",souv:"le gland porte-bonheur",beats:[
    {at:"petitpois",goal:"Petit Pois a quelque chose à te dire.",lines:[
      ["petitpois","shy",`Dis, ${ME()}… quand il commence à faire noir, je n'aime pas trop ça.`],
      ["petitpois","sad","Quand les lanternes s'éteignent, la forêt fait des bruits. Crac. Hou-hou."],
      ["petitpois","shy","Je fais semblant de dormir sous le porche, mais je garde un œil ouvert. Les deux, en fait."],
      ["petitpois","open","Tu crois qu'il existe quelqu'un qui n'a jamais peur du noir ?"],
      ["me","open","Quelqu'un qui brille, peut-être… Je vais regarder du côté des lanternes."]]},
    {at:"@lampL",arrive:"luciole",goal:"Cherche quelqu'un qui brille, près des lanternes.",lines:[
      ["luciole","open","Oh ! Bonjour. J'ai vu de la lumière chez toi, alors je suis venue voir. Je m'appelle Luciole."],
      ["luciole","joy","Ma queue brille toute seule, je suis née comme ça. C'est pratique pour allumer les lanternes."],
      ["me","joy","Viens, quelqu'un aimerait beaucoup te rencontrer."]]},
    {at:"petitpois",goal:"Présente Luciole à Petit Pois.",lines:[
      ["petitpois","surprise",`${ME()} ! Tu as vu Luciole ? Sa queue fait de la lumière. Toute seule !`],
      ["luciole","joy","Ce n'est rien. C'est même moi qui allume les lanternes, le soir."],
      ["petitpois","shy","Dis… tu pourrais rester près de moi, cette nuit ? Juste un peu ?"],
      ["luciole","open","D'accord, petit. Mais il faudra que tu m'aides à les allumer. Viens, je vais te montrer."]]},
    {at:"luciole",lamps:1,goal:"Va voir Luciole et Petit Pois aux lanternes.",lines:[
      ["petitpois","joy",`${ME()}, regarde ! C'est moi qui ai allumé la grande lanterne !`],
      ["luciole","joy","Du premier coup. Je n'avais jamais vu ça."],
      ["petitpois","open","En fait, le noir, c'est juste le moment où les lanternes sont jolies."],
      ["petitpois","shy","Tiens. C'est mon gland porte-bonheur. Je n'en ai plus besoin… enfin, garde-le quand même bien."],
      ["petitpois","joy","Et maintenant que je n'ai plus peur de rentrer tard, je peux t'aider au Café !"]]}
  ]},
  mitaine:{title:"La moufle perdue",souv:"la moufle au flocon",beats:[
    {at:"mitaine",goal:"Mitaine vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["mitaine","sad",`Bonjour ${ME()}… Tu n'aurais pas vu une moufle ? Rouge, avec un petit flocon brodé.`],
      ["mitaine","shy","Ma grand-mère me l'a tricotée. J'ai encore l'autre, mais une moufle toute seule, ça ne sert à rien."],
      ["mitaine","open","Tu pourrais regarder du côté de la mare ? Moi, je cherche par ici."]]},
    {at:"@pond",goal:"Cherche la moufle au bord de la mare.",lines:[
      ["me","surprise","Un fil de laine rouge flotte sur la mare… Il file tout droit vers le porche."]]},
    {at:"@porch",goal:"Suis le fil de laine jusqu'au porche.",lines:[
      ["me","surprise","Le fil passe sous Petit Pois… qui dort roulé dans quelque chose de rouge."]]},
    {at:"petitpois",sleep:1,goal:"Réveille Petit Pois, tout doucement.",lines:[
      ["petitpois","shy","Euh… Mitaine ? Je crois que je dors dedans depuis une semaine."],
      ["mitaine","surprise","Ma moufle ! Tu en as fait un sac de couchage ?"],
      ["petitpois","sad","Elle est toute chaude… Pardon."],
      ["mitaine","joy","Garde-la, va. Elle te va mieux qu'à ma patte."],
      ["mitaine","open",`Et toi, ${ME()}, prends l'autre. Comme ça, on en a chacun une.`]]}
  ]},
  gribouille:{title:"Le grand portrait",souv:"le grand portrait du refuge",beats:[
    {at:"gribouille",goal:"Gribouille vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["gribouille","joy",`Bonjour ${ME()} ! Je suis peintre. Enfin, je peins avec ma queue : tu vois le bout bleu ?`],
      ["gribouille","open","On m'a dit qu'ici, il y avait plein de renards. Je voudrais tous les peindre !"],
      ["gribouille","shy","Tu pourrais demander à quelqu'un de poser pour moi ? Moi, ils me fuient dès que je sors mes couleurs."]]},
    {at:"*",leave:1,goal:"Demande à un renard de poser pour Gribouille.",lines:id=>[
      [id,"surprise","Poser ? Pour un tableau ? Oh, quelle bonne idée !"],
      [id,"joy","…Mais j'ai un petit creux. Je reviens tout de suite, promis !"],
      ["me","sad",`Et hop, plus de ${FOX[id].name}. Essayons avec quelqu'un d'autre.`]]},
    {at:"*",goal:"Essaie avec un autre renard.",lines:id=>[
      [id,"joy","D'accord, je ne bouge plus. Promis."],
      [id,"shy","…"],
      [id,"surprise","Atchoum ! Pardon. Ça me chatouillait le museau."],
      ["me","sad","Raté. Gribouille va être déçu…"]]},
    {at:"gribouille",goal:"Retourne voir Gribouille.",lines:[
      ["gribouille","sad","Personne ne tient en place, hein ? Je m'en doutais."],
      ["me","open","Tout seul, on s'ennuie vite. Mais tous ensemble, on se tiendrait sage, non ?"],
      ["gribouille","surprise","Tous ensemble… Un grand portrait de tout le refuge ! Appelle tout le monde devant la maison !"]]},
    {at:"@porch",gather:1,goal:"Appelle tout le monde devant la maison.",lines:[
      ["me","joy","Tout le monde devant la maison ! Gribouille fait notre portrait !"],
      ["petitpois","joy","Je me mets devant ! Non, derrière. Non, devant !"],
      ["gribouille","joy","Parfait. Ne bougez plus… Encore un peu… Voilà !"]]},
    {at:"gribouille",goal:"Va voir le tableau de Gribouille.",lines:[
      ["gribouille","joy",`Regarde, ${ME()} : tout le refuge, au complet.`],
      ["petitpois","surprise","Mais… tu n'es pas dessus, toi !"],
      ["gribouille","shy","Le peintre, on ne le voit jamais. C'est normal."],
      ["petitpois","open","Prête-moi ta queue. Là, dans le coin. Voilà : toi."],
      ["gribouille","joy","Il est tout de travers… C'est le plus beau morceau du tableau. Tiens, il est pour toi."]]}
  ]},
  luciole:{title:"Une lumière de plus",souv:"le bocal de lumière",beats:[
    {at:"luciole",goal:"Luciole a une idée.",lines:[
      ["luciole","open",`${ME()}, j'ai compté les lanternes du refuge : six. Et nous, on est de plus en plus nombreux.`],
      ["luciole","shy","J'aimerais que chacun ait sa petite lumière. Mais il faudrait un endroit où la poser."],
      ["me","open","Sur la souche, peut-être ?"]]},
    {at:"@stump",goal:"Trouve un endroit pour une nouvelle lumière : la souche ?",lines:[
      ["me","joy","Tu poses un vieux bocal sur la souche. Il n'attend plus que sa lumière."]]},
    {at:"luciole",goal:"Dis à Luciole que le bocal est prêt.",lines:[
      ["luciole","surprise","Un bocal ! Attends, je souffle dedans…"],
      ["luciole","joy","Voilà. Une lumière qui ne s'éteint pas, même quand je dors."],
      ["luciole","shy","Garde-le près de toi. Comme ça, il y aura toujours un peu de moi au refuge."]]}
  ]},
  gaston:{title:"Le poisson de la mare",souv:"le bouchon de pêche",beats:[
    {at:"gaston",goal:"Gaston veut te demander quelque chose.",lines:[
      ["gaston","open",`${ME()}, je pêche depuis toujours. Et je n'ai jamais rien attrapé. Rien de rien.`],
      ["gaston","shy","Il paraît qu'un poisson vit dans ta mare. Tu pourrais aller voir ?"]]},
    {at:"@pond",goal:"Va voir s'il y a un poisson dans la mare.",lines:[
      ["me","surprise","Sous les nénuphars, un tout petit poisson orange te regarde avec de grands yeux."]]},
    {at:"gaston",goal:"Raconte à Gaston ce que tu as vu.",lines:[
      ["gaston","surprise","Un vrai poisson ? Dans ta mare ? J'y vais !"],
      ["gaston","joy","…Je l'ai eu ! Mon tout premier !"],
      ["gaston","sad","Mais il me regardait avec de si grands yeux… Je l'ai remis à l'eau."],
      ["gaston","open","Au fond, ce que j'aime, c'est attendre au bord de l'eau. Tiens, mon bouchon de pêche : je n'en aurai plus besoin."]]}
  ]}
};

/* ---------- reprise des anciennes histoires (une étape par jour) ---------- */
// étapes finies de l'ancienne version -> moments finis de la nouvelle
if(!R.beat){const MIG={petitpois:[0,1,3,4],mitaine:[0,1,2,4]};R.beat={};
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
  if(live){const f=makeFox(id,null),fs=SPOTS.filter(s=>!taken(s)&&!s.bowl&&!s.lamp);setTimeout(()=>goTo(f,fs[Math.floor(Math.random()*fs.length)]||SPOT.g3),60);toast(`${FOX[id].name} arrive au refuge !`)}
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
function storyTap(at){const c=cur();if(!c||!$("talk").hidden||!$("sheet").hidden)return false;
  if(at.startsWith("@")?c.b.at!==at:!isTarget(at))return false;
  const b=c.b;
  if(b.arrive)bringIn(b.arrive,SPOT[b.at.slice(1)]||SPOT.g3);
  if(b.lamps){scn.lamps={L:true,R:true};drawGlow()}
  if(b.gather)gather();
  if(b.at==="*")(R.who[c.id]=R.who[c.id]||{})[c.n]=at;
  hotEl.hidden=true;
  syncFoxes();
  talk(typeof b.lines==="function"?b.lines(at):b.lines,()=>{
    R.beat[c.id]=c.n+1;
    if(b.leave){const f=foxes.find(x=>x.id===at);if(f)f.until=0}
    if(storyDone(c.id)){R.souv[c.id]=STORIES[c.id].souv;R.nextAt=Date.now()+GAP;toast(`Souvenir reçu : ${STORIES[c.id].souv}.`)}
    save();renderStory();
  });
  return true;
}

/* ---------- repères : signes, endroit qui brille, objectif ---------- */
const hotEl=document.createElement("button");hotEl.className="hot";hotEl.type="button";hotEl.hidden=true;
hotEl.innerHTML=`<i class="mark">!</i>`;
hotEl.onpointerdown=e=>{e.stopPropagation();const c=cur();if(c)storyTap(c.b.at)};
$("actors").appendChild(hotEl);
const nextTime=t=>{const d=new Date(t),h=d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}).replace(":"," h ");
  return today(t)===today()?`vers ${h}`:`demain vers ${h}`};
function goalText(){const c=cur();
  if(c)return {t:`${STORIES[c.id].title} · ${c.n+1} sur ${beats(c.id).length}`,g:c.b.goal};
  const id=ORDER.find(k=>!storyDone(k));
  if(!id)return {t:"Histoires",g:"Toutes les histoires sont finies. D'autres arrivent bientôt."};
  return {t:"Prochaine histoire",g:isRes(id)?`${FOX[id].name} aura quelque chose à te raconter ${nextTime(R.nextAt)}.`:`Un nouveau renard arrivera ${nextTime(R.nextAt)}.`};
}
function renderStory(){
  const c=cur();
  storyKey=c?c.id+c.n:"";
  for(const f of foxes)if(!f.wild){const t=isTarget(f.id),m=f.el.querySelector(".mark");
    if(t&&f.inside)f.until=0;
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
