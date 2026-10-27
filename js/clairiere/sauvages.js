/* La Clairière : les inconnus de la forêt. Des sauvages dont on ne connaît pas le nom : chaque visite à la gamelle
   laisse une photo et un indice (5 en tout). Dès 3 photos, on devine son prénom parmi trois (inspiration : Return of
   the Obra Dinn) ; à 5, Petit Pois peut le reconnaître. Chacun a un signe qui se voit
   (cicatrice, queue, masque, patchwork, oreilles) : Joffray les a tous voulus après la planche tools/inconnus.html. Certaines photos n'arrivent qu'à un moment : la nuit, à l'aube,
   sous la pluie (inspiration : Pokémon Snap). Ils ne vont jamais au Café : ils sont dans FOX, pas dans FOXES. */
const INCO=[
  {id:"balafre",name:"Balafre",bowl:"poisson",mark:"balafre",c:{b:"#a8957f",ch:"#f3ece2",e:"#5e4c3e",s:"#5e4c3e",t:"#efe6da"},
    opts:["Balafre","Velours","Bouton"],bio:"Un œil fermé depuis une bagarre avec un sanglier. Il ne dit jamais qui a gagné.",
    hello:"Balafre. Oui, c'est moi. Le poisson était bon. Ne le dis à personne.",pp:"Il fait peur à tout le monde, mais il ramène les petits égarés à leur terrier.",
    clues:[{pose:"eat",txt:"Il mange vite, en surveillant les arbres."},
      {pose:"sit",txt:"Un de ses yeux reste fermé. Une vieille cicatrice le traverse."},
      {when:"nuit",pose:"up",txt:"La nuit, il monte la garde. Il n'a peur de rien."},
      {rain:1,pose:"sit",txt:"Sous la pluie, il ne bouge pas d'un poil."},
      {pose:"happy",txt:"Pourtant, il sourit quand il croit que personne ne regarde."}]},
  {id:"miette",name:"Miette",bowl:"croquettes",scale:.86,tail:"pompon",c:{b:"#e8a874",ch:"#fff7ea",e:"#9a5a3a",s:"#9a5a3a",t:"#fff7ea"},
    opts:["Miette","Tempête","Gaufre"],bio:"Toute petite, toujours affamée. Elle passe derrière tout le monde pour finir les restes.",
    hello:"Miette ! C'est moi ! Il reste des croquettes ? Même une ? Même une moitié ?",pp:"La petite Miette ! Elle finit les gamelles de toute la forêt.",
    clues:[{pose:"eat",txt:"Elle mange tout, même les miettes au fond de la gamelle."},
      {pose:"sit",txt:"Elle est minuscule. La gamelle lui arrive presque au menton."},
      {when:"aube",pose:"lie",txt:"Elle arrive à l'aube, avant tout le monde, pour être sûre d'avoir quelque chose."},
      {pose:"groom",txt:"Derrière elle, pas de grande queue : une petite boule toute ronde, comme un pompon."},
      {pose:"happy",txt:"Le ventre plein, elle tient à peine debout. Elle est ravie."}]},
  {id:"panache",name:"Panache",bowl:"baies",tail:"long",c:{b:"#c96a3e",ch:"#fff1e4",e:"#4a2a20",s:"#4a2a20",t:"#fff8ee"},
    opts:["Panache","Pépin","Moustache"],bio:"Sa queue est deux fois plus longue que lui. Il dort enroulé dedans comme dans une couette.",
    hello:"Panache, pour te servir. Tu as vu ma queue ? Bien sûr que tu l'as vue.",pp:"Tout le monde le connaît, enfin, tout le monde connaît sa queue. Lui, on le voit après.",
    clues:[{pose:"eat",txt:"Une queue immense dépasse derrière la gamelle."},
      {when:"nuit",pose:"sleep",txt:"La nuit, il s'endort enroulé dans sa propre queue."},
      {rain:1,pose:"up",txt:"Sous la pluie, il s'en sert de parapluie."},
      {pose:"groom",txt:"Il passe des heures à la brosser. Elle brille."},
      {pose:"happy",txt:"Il la fait onduler comme un drapeau. Fier, très fier."}]},
  {id:"mure",name:"Mûre",bowl:"baies",mark:"patch",muzzle:"#8a4a9a",c:{b:"#e0b48a",ch:"#fff6ea",e:"#8a5a3a",s:"#8a5a3a",t:"#fff6ea"},
    opts:["Mûre","Neige","Paprika"],bio:"Un pelage de toutes les couleurs, recousu par la forêt après un orage. Elle connaît chaque buisson, et a toujours le bout du museau violet.",
    hello:"Mûre. Tes baies sont bonnes, mais je connais un buisson encore meilleur. Je te montrerai.",pp:"C'est Mûre ! Elle a le museau violet tout l'été, à force de manger des baies.",
    clues:[{pose:"eat",txt:"Elle trie les baies une par une. Elle garde les plus foncées pour la fin."},
      {when:"jour",pose:"sit",txt:"Elle a le bout du museau tout violet. Ça ne part pas."},
      {pose:"groom",txt:"Un bout bleu, un rose, un vert… Son pelage est fait de morceaux cousus ensemble."},
      {rain:1,pose:"up",txt:"Sous la pluie, elle tire la langue pour goûter : elle dit que l'eau a le goût des buissons."},
      {pose:"happy",txt:"Elle chantonne en mangeant. Une chanson sur les buissons d'automne."}]},
  {id:"filou",name:"Filou",bowl:"tout",mark:"masque",c:{b:"#9a9aa6",ch:"#f1f1f4",e:"#3f3f4c",s:"#3f3f4c",t:"#f1f1f4"},
    opts:["Filou","Sage","Nuage"],bio:"Il ne vole jamais rien : il « emprunte ». Les chaussettes, surtout.",
    hello:"Filou. Enchanté. Cette chaussette ? Je l'ai trouvée. Par terre. Dans un tiroir.",pp:"C'est lui qui prend les chaussettes de Mamie Brindille ! Je le savais.",
    clues:[{when:"nuit",pose:"eat",txt:"Il vient la nuit, et mange en jetant des coups d'œil partout."},
      {pose:"sit",txt:"Un masque sombre autour des yeux. Il a l'air de préparer un mauvais coup."},
      {pose:"groom",txt:"Il ne finit jamais la gamelle : il en garde dans ses joues pour plus tard."},
      {rain:1,pose:"lie",prop:"chaussette",txt:"Une chaussette de Mamie Brindille dépasse de sous lui… tiens donc."},
      {pose:"happy",txt:"Pris la patte dans le sac. Il n'a même pas l'air désolé."}]},
  {id:"radar",name:"Radar",bowl:"poisson",ears:1.75,c:{b:"#f0d6a4",ch:"#fffaf0",e:"#c79a5a",s:"#c79a5a",t:"#fffaf0"},
    opts:["Radar","Dodo","Fifi"],bio:"Ses oreilles entendent un poisson nager à l'autre bout de la mare.",
    hello:"Radar ! Je t'ai entendu remplir la gamelle depuis la rivière. Je t'entends aussi penser, un peu.",pp:"Ah, Radar ! Il entend tout. Ne dis jamais de secret près de la mare.",
    clues:[{pose:"eat",txt:"Des oreilles immenses, plus grandes que sa tête !"},
      {pose:"up",txt:"Ses oreilles tournent vers chaque son, comme des antennes."},
      {when:"nuit",pose:"sit",txt:"La nuit, il entend même les lucioles voler."},
      {rain:1,pose:"lie",txt:"Sous la pluie, il les rabat sur sa tête : trop de bruit."},
      {pose:"happy",txt:"Il a entendu la gamelle se remplir… depuis l'autre bout de la forêt."}]}
];
for(const f of INCO)FOX[f.id]={...f,rar:"rare",refuge:1};
const INC=Object.fromEntries(INCO.map(f=>[f.id,f]));
R.inco=R.inco||{};
// deux visites par jour au plus (avant : une) ; une visite déjà faite aujourd'hui compte
if(R.wildN==null)R.wildN=R.wildDay===today()?1:0;
const incOf=id=>R.inco[id]||(R.inco[id]={n:0,found:0,lock:-1});
const known=id=>!INC[id]||!!(R.inco[id]&&R.inco[id].found);
const nameOf=id=>known(id)?FOX[id].name:"???";
const metAny=()=>Object.keys(R.met).length>0||Object.values(R.inco).some(s=>s.n>0);
const phaseAt=t=>{const h=new Date(t).getHours();return h>=6&&h<8?"aube":h>=8&&h<18?"jour":h>=18&&h<21?"crepu":"nuit"};
// la prochaine photo colle-t-elle au moment ? (le soir compte comme la nuit)
function clueFits(c,t){const ph=phaseAt(t);return (!c.when||c.when===ph||(c.when==="nuit"&&ph==="crepu"))&&(!c.rain||rainAt(t))}
// qui peut venir manger à cette gamelle, à cet instant ; un renard jamais vu, ou qui a un indice à donner, compte double
function visitPool(type,t){const pool=[];
  for(const id in WILD)if(WILD[id]===type&&!isRes(id))pool.push(...(R.met[id]?[id]:[id,id]));
  for(const f of INCO){if(f.bowl!==type&&f.bowl!=="tout")continue;const s=R.inco[f.id]||{n:0};
    const w=f.bowl==="tout"?1:2; // celui qui mange de tout ne doit pas prendre toutes les visites
    if(s.n<5){if(clueFits(f.clues[s.n],t))pool.push(...Array(w).fill(f.id))}else if(w>1)pool.push(f.id)}
  // ses 5 photos prises, celui qui mange de tout ne passe plus que si personne d'autre ne vient
  if(!pool.length)pool.push(...INCO.filter(f=>f.bowl==="tout"&&(R.inco[f.id]||{n:0}).n>=5).map(f=>f.id));
  return pool}
// la photo d'un inconnu garde l'indice du moment
function incoPhoto(id,ph){const s=incOf(id);if(s.n<5)ph.clue=s.n;s.n++}
const whenTxt=c=>[c.when==="nuit"?"la nuit":c.when==="aube"?"à l'aube":c.when==="jour"?"en plein jour":"",c.rain?"sous la pluie":""].filter(Boolean).join(", ");
const canGuess=id=>{const s=R.inco[id];return !!s&&!s.found&&s.n>=3&&(s.lock!==s.n||s.n>=5)};

/* ---------- l'enquête ---------- */
function incoCards(){const inc=INCO.filter(f=>(R.inco[f.id]||{}).n);if(!inc.length)return "";
  return `<h3 class="sec">Les inconnus de la forêt</h3><p class="sub">Chaque photo donne un indice. Dès trois, devine son prénom.</p><div class="grid">${inc.map(f=>{const s=R.inco[f.id];
    return `<button class="card${s.found?"":" unseen"}" data-inco="${f.id}" type="button"><div class="pic shot">${s.found?foxArt(FOX[f.id]):photoSVG(R.photos.filter(p=>p.id===f.id).pop())}</div><h3>${s.found?f.name:"???"}</h3><p>${s.found?"Retrouvé !":`${Math.min(5,s.n)} indice${s.n>1?"s":""} sur 5${canGuess(f.id)?"<br><b>Tu peux deviner !</b>":""}`}</p></button>`}).join("")}</div>`}
function incoSheet(id){const f=INC[id],s=incOf(id),ps=R.photos.filter(p=>p.id===id&&p.clue!=null).sort((a,b)=>a.clue-b.clue);
  let act;
  if(s.found)act=`<p>${f.bio}</p>`;
  else if(s.n<3)act=`<p class="sub">Encore ${3-s.n} photo${3-s.n>1?"s":""} avant de pouvoir deviner son prénom.</p>`;
  else if(!canGuess(id))act=`<p class="sub">Ce n'était pas ça… Attends une nouvelle photo pour réessayer.</p>`;
  else act=`<p><b>À ton avis, il s'appelle…</b></p><div class="guess">${f.opts.slice().sort().map(n=>`<button class="btn" data-guess="${id}|${n}" type="button">${n}</button>`).join("")}</div>`
    +(s.n>=5?`<button class="btn ghost" data-ask="${id}" type="button">Demander à Petit Pois</button>`:"");
  const nx=s.n<5&&f.clues[s.n],w=nx&&whenTxt(nx);
  const tip=s.n<5?`<p class="sub">Prochaine photo : ${f.bowl==="tout"?"n'importe quelle gamelle":`une gamelle de ${BOWLS[f.bowl].name.toLowerCase()}`}${w?`, et seulement ${w}`:""}.</p>`:"";
  openSheet(`<div class="foxhead"><div class="pic rare">${foxArt(FOX[id],{expr:"joy",portrait:1,sil:!s.found})}</div><div><h2>${s.found?f.name:"Un inconnu"}</h2><span class="chip rare">Sauvage</span></div></div>${act}${tip}<div class="pgrid">${ps.map(p=>`<figure class="photo">${photoSVG(p)}<figcaption><b>Indice ${p.clue+1}</b>${f.clues[p.clue].txt}</figcaption></figure>`).join("")}</div>`,"photos")}
function guessInco(id,name){const f=INC[id],s=incOf(id);if(!canGuess(id))return;
  if(name!==f.name){s.lock=s.n;save();toast(`Il ne réagit pas à « ${name} ». Ce n'est pas ça.`);incoSheet(id);return}
  s.found=1;R.glands+=20;save();renderHud();closeSheet();
  talk([[id,"joy",f.hello],["petitpois","joy",`${f.name} ! Bien vu, ${ME()}.`]],()=>toast(`${f.name} retrouvé ! +20 glands`))}
function askInco(id){const f=INC[id],s=incOf(id);if(s.found||s.n<5)return;
  s.found=1;R.glands+=5;save();renderHud();closeSheet();
  talk([["petitpois","surprise",`Montre… Mais c'est ${f.name} ! ${f.pp}`],[id,"joy",f.hello]],()=>toast(`${f.name} retrouvé ! +5 glands`))}
