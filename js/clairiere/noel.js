/* La Clairière à Noël (docs/economie.md) : du 1er décembre au 6 janvier, la clairière est sous la neige (maquette validée :
   tools/sapin-hd.html), la pluie devient de la neige, et l'histoire du sapin se joue en 4 chapitres, un par semaine :
   Grelot plante la graine (1er), Ramure le renne perdu (8), Paillette et les boules de Noël (15), Barbe-Neige et l'étoile (24).
   Le sapin pousse tout seul entre deux chapitres. Ces histoires passent avant la suite d'ORDER (sauf une histoire commencée),
   sans attente entre elles ; les invités de Noël (event:"noel") restent au refuge jusqu'au 6 janvier.
   ?noel=12 fait comme si on était le 12 décembre (32 = 1er janvier), ?noel=0 coupe Noël. */
const QN=new URLSearchParams(location.search).get("noel");
// jour de l'événement : 1 à 31 en décembre, 32 à 37 du 1er au 6 janvier, 0 hors saison
function noelDay(){if(QN!=null){const n=+QN||0;return n>0&&n<=37?n:0}const d=new Date(shotAt?shotAt.t:Date.now());
  return d.getMonth()===11?d.getDate():d.getMonth()===0&&d.getDate()<=6?31+d.getDate():0}
const noelOn=()=>noelDay()>0;
// balafre : « La bataille de neige » (Joffray, 02/11/2026, à la place des frileux) : Balafre, le chef, Filou et Radar veulent la
// clairière pour l'hiver ; bataille de neige en 3 contre 3 (jeu battle, on choisit son équipe), puis course de luge (luge) et curling (curling) :
// à chaque défaite, Balafre parle de chance et réclame un autre défi. Balafre ne dit son nom que si on
// gagne ; les deux autres laissent une photo-indice. Ils restent jusqu'au 6 janvier, puis repartent dans la forêt.
const NOEL_ORDER=["grelot","ramure","paillette","balafre","barbeneige"],NOEL_FROM={grelot:1,ramure:8,paillette:15,balafre:19,barbeneige:24},NOEL_WILD=["balafre","filou","radar"];
const isNoelStory=id=>NOEL_ORDER.includes(id);
// le chapitre qui attend : sa date est passée et le précédent est fini
function noelNext(){if(!noelOn())return null;return NOEL_ORDER.find((k,i)=>!storyDone(k)&&noelDay()>=NOEL_FROM[k]&&(!i||storyDone(NOEL_ORDER[i-1]))&&(k!=="balafre"||R.beat.balafre>0||recordDone()))||null} // la bande attend que la boule de Boule-de-Neige ait roulé 24 h
// dans le journal, pendant l'événement (ou une fois commencé)
const noelRows=()=>noelOn()||NOEL_ORDER.some(k=>R.beat[k]>0)?NOEL_ORDER:[];
// le sapin : null (pas planté), "0" pousse, "1" grand, "2" immense, "3" décoré ; star : l'étoile posée et les cadeaux au pied
function sapinStage(){if(!noelOn()||!storyDone("grelot"))return null;const d=noelDay();
  // décoré dès les boules rattrapées (Joffray : Paillette parle du sapin décoré juste après le jeu)
  if(storyDone("paillette")||(R.beat.paillette||0)>=3)return "3";if(d>=15&&storyDone("ramure"))return "2";if(d>=8)return "1";return "0"}
// l'étoile se pose à la fin de l'histoire de Barbe-Neige, ou plus tôt si on a ouvert les 24 cases du calendrier (Étoile dorée)
const goldStar=()=>!!(bourse().noel||{}).etoile;
const sapinStar=()=>storyDone("barbeneige")||!!R.noelStar||(goldStar()&&sapinStage()==="3");
// les lanternes de gauche laissent la place au sapin dès qu'il a grandi (scene.js)
function noelLampsL(){const s=sapinStage();return s&&s!=="0"?[[90,206]]:null}
// pas d'objet de déco sur le sapin (deco.js)
function noelNo(){const s=sapinStage();return s?[[60,272,s==="0"?24:44]]:[]}

/* ---------- les histoires ---------- */
Object.assign(STORIES,{
  grelot:{title:"La graine du Nord",souv:"le grelot d'argent",beats:[
    {at:"petitpois",goal:"Petit Pois a entendu un drôle de bruit dans la neige.",lines:[
      ["petitpois","surprise","Tu entends ? Gling… gling… Ça vient de la forêt !",()=>{actEmote("petitpois","!");actPose("petitpois","up","surprise")}],
      ["me","open","On dirait un grelot. Allons voir près des lanternes.",()=>{actEmote("me","note");setTimeout(()=>actGo("me",100,300),800)}]]},
    {at:"@lampL",arrive:"grelot",goal:"Va voir qui fait gling-gling, près des lanternes.",lines:[
      ["grelot","joy","Bonjour ! Moi, c'est Grelot. Je viens du Grand Nord, là où il neige toute l'année.",()=>{actTrick("grelot","boing");actEmote("grelot","note")}],
      ["grelot","sad","Chez moi, chaque clairière plante son sapin de Noël le 1er décembre. Mais moi, je n'ai pas de clairière…",()=>{actPose("grelot","sit","sad");actEmote("grelot","goutte")}],
      ["grelot","shy","J'ai apporté une graine. Je peux la planter ici ?",()=>actEmote("grelot","?")],
      ["me","joy","Bien sûr ! Juste là, au pied des lanternes.",()=>{actEmote("me","coeur");actTrick("grelot","salto")}]]},
    {at:"grelot",game:{k:"catch",thing:"bell",n:6,say:"Les grelots de Grelot se sont décrochés ! Attrape-les avant qu'ils tombent dans la neige.",win:"Tous les grelots !"},goal:"Aide Grelot à planter la graine.",lines:[
      ["grelot","joy","Merci ! Un sapin, ça ne pousse qu'avec de la musique. Gling, gling !",()=>{actTrick("grelot","toupie");actEmote("grelot","note")}],
      ["grelot","open","Chaque soir, je lui jouerai des grelots. Dans une semaine, tu verras !",()=>actEmote("grelot","coeur")]]},
    {at:"petitpois",goal:"Montre la pousse à Petit Pois.",lines:[
      ["petitpois","surprise","Une pousse de sapin ? Toute petite, toute verte !",()=>{actEmote("petitpois","!");actTrick("petitpois","boing")}],
      ["petitpois","joy","Je vais lui tricoter une écharpe, pour qu'elle n'ait pas froid.",()=>actEmote("petitpois","coeur")],
      ["grelot","joy","Reviens dans une semaine : elle aura grandi. Tiens, un de mes grelots, pour t'en souvenir.",()=>actGive("grelot","me","bell")]]}
  ]},
  ramure:{title:"Le renne perdu",souv:"la clochette de traîneau",beats:[
    {at:"grelot",goal:"Grelot a l'air inquiet.",lines:[
      ["grelot","surprise","Regarde le sapin, il a grandi ! … Mais il y a des traces dans la neige. De très grandes traces.",()=>{actTrick("grelot","boing");setTimeout(()=>{actEmote("grelot","!");actPose("grelot","up","surprise")},1100)}],
      ["me","open","Des sabots ? Elles vont vers la mare.",()=>{actEmote("me","?");setTimeout(()=>{actGo("me",230,450);actGo("grelot",262,436)},800)}]]},
    {at:"@pond",arrive:"ramure",arriveAt:{id:"ram",x:196,y:446,poses:["sit"]},goal:"Suis les grandes traces jusqu'à la mare.",lines:[
      ["ramure","surprise","Oh ! Pardon, je glissais sur la glace. Je m'appelle Ramure.",()=>{actTrick("ramure","roll");actEmote("ramure","goutte");actEmote("me","!")}],
      ["ramure","sad","Je tire le traîneau de Barbe-Neige. Je me suis perdu dans la tempête… et ma clochette est tombée.",()=>{actPose("ramure","sit","sad");actEmote("ramure","froid")}],
      ["me","joy","On va la retrouver !",()=>{actTrick("me","boing");actEmote("ramure","coeur");setTimeout(()=>{actGo("me",296,372);actGo("ramure",262,382)},900)}]]},
    {at:"@leaves",game:{k:"search",snow:1,item:"bell",say:"La clochette a roulé sous la neige. Elle tinte quand le vent souffle ! 3 essais.",win:"Gling ! La voilà !"},goal:"Cherche la clochette de Ramure sous la neige, près des feuilles.",lines:[
      ["ramure","joy","Ma clochette ! Avec elle, Barbe-Neige m'entendra de très loin.",()=>{actGive("me","ramure","bell");setTimeout(()=>actTrick("ramure","salto"),1200)}],
      ["ramure","open","Je reste ici en attendant qu'il me retrouve. Ton sapin, on le voit de partout : c'est un bon repère.",()=>{actEmote("ramure","coeur");actPose("ramure","lie","joy")}]]},
    {at:"petitpois",goal:"Présente Ramure à Petit Pois.",lines:[
      ["petitpois","surprise","Un renne au refuge ! Tu crois qu'il voudra goûter mes croquettes ?",()=>{actEmote("petitpois","!");actTrick("petitpois","boing");actNear("ramure","petitpois")}],
      ["ramure","shy","… Juste une. Ou deux.",()=>{actGive("petitpois","ramure","gland");setTimeout(()=>actEmote("ramure","note"),1300)}],
      ["grelot","joy","Dans une semaine, le sapin touchera les nuages. Il faudra le décorer !",()=>{actTrick("grelot","toupie");actTrick("ramure","boing")}]]}
  ]},
  paillette:{title:"Les boules de Noël",souv:"une boule de verre argentée",cast:["grelot"],beats:[
    {at:"grelot",goal:"Le sapin est immense ! Grelot veut te parler.",lines:[
      ["grelot","joy","Il est immense ! Maintenant, il lui faut des guirlandes, des boules, des rubans…",()=>{actTrick("grelot","boing");actEmote("grelot","!")}],
      ["grelot","sad","Mais je n'ai rien apporté. Dans le Nord, c'est Paillette qui fait toutes les décorations.",()=>{actPose("grelot","sit","sad");actEmote("grelot","goutte")}],
      ["me","open","Si on allume les lanternes, elle verra peut-être la lumière ?",()=>{actEmote("me","!");setTimeout(()=>actGo("me",100,300),800)}]]},
    {at:"@lampL",lamps:1,arrive:"paillette",goal:"Allume les lanternes pour guider Paillette.",lines:[
      ["paillette","joy","Des lanternes dans la neige ! Je les ai vues de très loin.",()=>{actTrick("paillette","toupie");actEmote("paillette","!")}],
      ["paillette","open","Je suis Paillette. Je fais mes guirlandes avec les étoiles qui tombent.",()=>actEmote("paillette","note")],
      ["paillette","sad","Mais en venant, mon sac s'est ouvert. Mes boules de Noël roulent partout !",()=>{actEmote("paillette","goutte");setTimeout(()=>actGo("me",262,424),900)}]]},
    {at:"@bench",game:{k:"catch",thing:"ball",n:7,say:"Les boules de Noël glissent sur la neige. Attrape-les toutes !",win:"Toutes les boules !"},goal:"Rattrape les boules de Paillette, près du banc.",lines:[
      ["paillette","joy","Toutes là ! Et pas une seule fêlée.",()=>{actGive("me","paillette","ball");setTimeout(()=>actTrick("paillette","salto"),1200)}]]},
    {at:"paillette",goal:"Décore le sapin avec Paillette.",lines:[
      ["paillette","joy","Une boule rouge ici… une bleue là… et la guirlande, tout autour !",()=>{actGo("paillette",96,300,"up");setTimeout(()=>actTrick("paillette","toupie"),2200)}],
      ["grelot","surprise","Il est magnifique !",()=>{actEmote("grelot","coeur");actTrick("grelot","boing")}],
      ["me","open","Il manque quelque chose, tout en haut…",()=>actEmote("me","?")],
      ["paillette","open","L'étoile. Seul Barbe-Neige en a une assez brillante. Il passe toujours la veille de Noël.",()=>actEmote("paillette","note")]]}
  ]},
  balafre:{title:"La bataille de neige",souv:"une boule de neige qui ne fond pas",cast:["filou","radar","bouleneige"],
    end:()=>{let n=0;for(const id of ["filou","radar"]){const s=incOf(id);if(s.found||s.n>=5)continue;const ph={id,bowl:null,t:Date.now(),tr:2};incoPhoto(id,ph);R.photos.push(ph);n++}
      R.recordBig=1;R.recordBigAt=R.recordBigAt||Date.now();save();drawBigBall();if(n)setTimeout(()=>toast("Filou et Radar t'ont laissé une photo chacun : de nouveaux indices dans l'album !"),2600)},beats:[
    // la bande débarque et casse la boule du record
    // 03/11/2026 (copine de Joffray : « pas hyper clair ») : le thème des méchants, on se demande qui ils sont, puis l'attaque
    {at:"bouleneige",goal:"Boule-de-Neige crie au secours près de sa boule !",showMs:2600,
      show:()=>{const bx=BALL.x,by=BALL.y;bandeOn=1;foxes.forEach(f=>{try{setBadge(f)}catch(e){}});try{MUSIC.want("bande");MUSIC.jingle("bande")}catch(e){}
        actArrive("filou",Math.max(40,bx-140),by-60);setTimeout(()=>actArrive("radar",Math.min(360,bx+120),by-70),250);setTimeout(()=>actArrive("balafre",bx-30,by-150),500);
        setTimeout(()=>{actEmote("bouleneige","!");actPose("bouleneige","sit","surprise");defendAll(bx,by)},900);
        setTimeout(()=>{actEmote("balafre","colere");actEmote("filou","note");actEmote("radar","note")},1800)},
      lines:()=>[
      ["petitpois","surprise",known("balafre")?"Balafre ?! Et c'est qui, les deux autres avec lui ?":"Mais attends… c'est qui, ces trois-là ?",()=>actEmote("petitpois","?")],
      ["me","surprise","Je sais pas, je ne les ai jamais vus ! Ils n'ont pas l'air commodes…",()=>actEmote("me","goutte")],
      ["balafre","open","Belle boule.",()=>{actPose("balafre","happy");actEmote("balafre","colere")}],
      ["me","surprise","Oh ! Attention, Boule-de-Neige !!!",()=>{actEmote("me","!");talkHold(1100,bandeAttack,4300)}],
      ["bouleneige","sad","Ma boule ! Mon record du monde… Il ne manquait presque rien !",()=>actEmote("bouleneige","goutte")],
      ["balafre","open","Dommage pour elle.",()=>actPose("balafre","happy")],
      ["filou","joy","Ouais ouais, bien vu chef !",()=>actTrick("filou","boing")],
      ["radar","joy","Aha ! Trop fort, le chef ! Trop, trop fort !",()=>actEmote("radar","note")],
      ["balafre","open","Cette clairière est à nous jusqu'au printemps. Et chaque jour, vous paierez un tribut : vos couvertures, vos glands, et tout le chocolat chaud.",()=>actEmote("balafre","colere")],
      ["petitpois","surprise",known("balafre")?"Balafre ! Pourquoi tu fais ça ?":"Mais… qui es-tu, d'abord ?",()=>actEmote("petitpois","?")],
      ["balafre","joy",known("balafre")?"Peut-être. Gagne, et on en reparlera.":"Mon nom ? Je te le dirai seulement si vous gagnez."],
      ["filou","joy","Une bataille de boules de neige. Trois contre trois.",()=>actThrow("filou",{x:200,y:300},{hurt:false})],
      ["radar","open","Le chef est imbattable. C'est lui qui l'a dit.",()=>actEmote("radar","!")],
      ["me","joy","Pari tenu ! Je choisis mon équipe.",()=>actTrick("petitpois","salto")]]},
    // trois défis : après chaque défaite, Balafre parle de chance et en réclame un autre (Joffray, 03/11/2026 : pas de « tournoi »)
    {at:"balafre",game:{k:"battle",foes:["balafre","filou","radar"],boss:"balafre",win:"Victoire ! Les sauvages se rendent !"},goal:"Relève le défi : une bataille de neige, trois contre trois.",lines:[
      ["radar","surprise","On a… perdu ? Je n'ai même pas entendu venir la dernière boule !",()=>actEmote("radar","goutte")],
      ["balafre","open","Ouais. Vous avez eu de la chance. Le vent soufflait de votre côté.",()=>actEmote("balafre","colere")],
      ["filou","joy","Ouais ouais, le vent ! Bien vu chef !",()=>actTrick("filou","boing")],
      ["balafre","open","Une course de luge, du haut de la colline jusqu'au grand arbre. Radar contre votre plus rapide.",()=>actPose("balafre","happy")],
      ["radar","joy","Je suis le plus rapide de la forêt. J'entends les virages avant de les voir.",()=>actTrick("radar","toupie")],
      ["petitpois","joy","Le plus rapide d'ici… c'est moi ! J'ai même un bonnet aérodynamique.",()=>{actTrick("petitpois","salto");actEmote("petitpois","note")}]]},
    {at:"@tree",with:["petitpois"],game:{k:"luge",who:"petitpois",rival:"radar",win:"Petit Pois passe la ligne le premier !"},goal:"La course de luge : guide Petit Pois jusqu'en bas de la piste, avant Radar.",lines:[
      ["radar","sad","Mes oreilles… elles faisaient voile. J'ai freiné à chaque virage.",()=>actEmote("radar","goutte")],
      ["petitpois","joy","Wouhou ! Je vole ! Je suis un flocon !",()=>actTrick("petitpois","salto")],
      ["balafre","open","Encore de la chance. La piste était plus glissante de votre côté. Tout le monde l'a vu.",()=>actEmote("balafre","colere")],
      ["filou","joy","Ouais ouais, glissante ! Chef, laisse-moi faire. Personne ne me bat sur la glace.",()=>actGo("filou",TG.pond.x+50,TG.pond.y-30,"happy")],
      ["filou","open","Du curling sur la mare gelée. Trois pierres chacun. La plus proche du centre gagne.",()=>actEmote("filou","!")],
      ["me","joy","Allez, une dernière !",()=>actEmote("petitpois","coeur")]]},
    {at:"@pond",game:{k:"curling",rival:"filou",who:"petitpois",watch:["balafre","radar"],win:"Ta pierre est au cœur de la cible !"},goal:"Le curling sur la mare gelée : bats Filou, trois pierres chacun.",lines:()=>{const was=known("balafre");
      if(!was){const s=incOf("balafre");s.found=1;save()}
      return [["filou","surprise","Pile au centre ?! Même moi, je n'aurais pas pu l'emprunter de là.",()=>actEmote("filou","goutte")],
        ["radar","shy","Chef… trois fois de la chance, ça commence à ressembler à autre chose.",()=>actEmote("radar","?")],
        ["balafre","shy","… Ouais. Bon. Vous êtes forts. Voilà, c'est dit.",()=>actPose("balafre","sit","shy")],
        ["balafre",was?"joy":"open",was?"Tu m'as reconnu, et tu m'as battu trois fois. Ça fait beaucoup pour un seul hiver.":"Une promesse est une promesse. Je m'appelle Balafre.",()=>actEmote("balafre","!")],
        ["balafre","sad","Et puis… on ne la voulait pas vraiment, la clairière. On avait juste froid. Très froid.",()=>["balafre","filou","radar"].forEach(id=>actEmote(id,"froid"))],
        ["radar","sad","Mes oreilles sont deux glaçons. Je n'entends plus que mes dents claquer."],
        ["balafre","shy","Le perdant paie le tribut. Voilà le nôtre : tout ce qu'on avait gardé pour l'hiver.",()=>{R.glands+=30;const b=bourse();b.sucres=(b.sucres||0)+5;putBourse(b);save();renderHud();toast("Le tribut des vaincus : +30 glands, +5 sucres d'orge")}]]}},
    {at:"@porch",goal:"Offre un chocolat chaud à la bande, sous le porche.",lines:[
      ["petitpois","joy","Un chocolat chaud pour les vaincus… et pour les vainqueurs aussi !",()=>actGo("petitpois",200,236,"happy")],
      ["radar","joy","J'entends les guimauves fondre. C'est le plus beau bruit du monde.",()=>actEmote("radar","coeur")],
      ["filou","shy","Je peux emprunter une chaussette de Noël ? Pour la rendre. Un jour.",()=>actEmote("filou","note")],
      ["balafre","open","Dans la forêt, l'hiver, chacun reste dans son terrier. Ici, tout le monde est ensemble.",()=>actEmote("balafre","coeur")]]},
    // tout le monde aide Boule-de-Neige à refaire sa boule, plus grosse qu'avant
    {at:"bouleneige",goal:"Aide Boule-de-Neige à refaire sa boule, avec toute la bande.",showMs:2600,
      show:()=>{["balafre","filou","radar","petitpois"].forEach((id,i)=>actGo(id,BALL.x+[-90,-50,60,100][i],BALL.y+[-10,30,30,-10][i],"happy"));
        setTimeout(()=>{R.recordBig=1;R.recordBigAt=Date.now();R.recordGone=0;save();drawHeap();drawBigBall();if(ballEl)ballEl.animate([{transform:"translate(-50%,-100%) scale(.1)"},{transform:"translate(-50%,-100%) scale(1.08)",offset:.8},{transform:"translate(-50%,-100%) scale(1)"}],{duration:1400,easing:"ease-out"});try{MUSIC.sfx("win")}catch(e){}},900)},
      lines:[
      ["bouleneige","joy","Record du monde ! Trois mètres et quart ! Personne n'avait jamais fait mieux.",()=>actTrick("bouleneige","salto")],
      ["filou","joy","Ouais ouais, bien vu… Boule-de-Neige !",()=>actTrick("filou","boing")],
      ["radar","joy","Aha ! Trop fort, la boule !",()=>actTrick("radar","toupie")],
      ["balafre","shy","On reste jusqu'à ce que la neige fonde. Pour garder la clairière… avec vous, cette fois.",()=>actEmote("balafre","coeur")],
      ["me","joy","Bienvenue au refuge. C'est ça, la magie de Noël."]]}
  ]},
  // refaite le 03/11/2026 (tournee.js) : le traîneau s'écrase, le marteau, Copeau répare, la tournée des maisons, l'énorme cadeau
  barbeneige:{title:"La veille de Noël",souv:"l'étoile du sapin",cast:["grelot","ramure","paillette","copeau","balafre","filou","radar"],end:()=>bigGiftEnd(),beats:[
    {at:"ramure",goal:"Ramure a entendu des clochettes dans le ciel.",showMs:2900,show:()=>{actPose("ramure","up","surprise");sceneSkyPass()},lines:[
      ["ramure","surprise","Le traîneau ! Sans moi pour le tirer, il vole de travers !",()=>actEmote("ramure","!")],
      ["radar","surprise","J'entends un boulon qui saute. Puis un autre. Puis plus rien… Ça vient par ici !",()=>actEmote("radar","goutte")],
      ["me","surprise","Tout le monde, devant la maison, vite !",()=>actGo("me",150,300)]]},
    {at:"@porch",goal:"Le traîneau tombe ! Cours devant la maison.",showMs:2300,show:()=>sceneCrash(),lines:[
      ["barbeneige","surprise","Bonsoir, bonsoir… Barbe-Neige. Personne n'a rien vu.",()=>actEmote("barbeneige","goutte")],
      ["ramure","sad","Patron ! C'est ma faute, je n'aurais jamais dû me perdre.",()=>actEmote("ramure","goutte")],
      ["barbeneige","sad","Le patin est cassé net. Et il me reste toutes les maisons de la forêt à livrer avant minuit.",()=>actPose("barbeneige","sit","sad")],
      ["petitpois","sad","Alors… il n'y aura pas de Noël ?",()=>actEmote("petitpois","goutte")],
      ["me","joy","Si. On connaît quelqu'un qui répare tout. COPEAU !",()=>{actEmote("me","!");actArrive("copeau",SLP.x+96,SLP.y+18)}],
      ["copeau","open","Un patin ? Deux minutes. Mais donne-moi un marteau : le mien a volé quand ça a fait boum.",()=>actEmote("copeau","?")]]},
    {at:"copeau",game:{k:"search",snow:1,item:"marteau",say:"Le marteau de Copeau a volé dans la neige. Le bon tas frémit… 3 essais !",win:"Le marteau !"},goal:"Retrouve le marteau de Copeau dans la neige.",lines:[
      ["copeau","joy","Le voilà. Maintenant, on tient le patin, et on ne bouge plus.",()=>actGive("me","copeau","marteau")]]},
    {at:"copeau",game:{k:"nails",sled:1,n:6,time:14,say:"Six clous pour remettre le patin. Trois coups chacun, avant minuit !",win:"Tac, tac, tac ! Le patin tient !"},goal:"Répare le patin avec Copeau, avant minuit.",lines:[
      ["copeau","joy","Plus solide que neuf. Il tiendrait une tonne de cadeaux.",()=>actTrick("copeau","boing")],
      ["barbeneige","joy","Ramure, à ton poste ! Et toi, grimpe : il me faut quelqu'un pour tenir les rênes. Moi, j'ai les lunettes coincées dans la barbe.",()=>{actTrick("barbeneige","boing");actEmote("ramure","note")}]]},
    {at:"barbeneige",game:{k:"tournee",n:7,win:"L'étoile brille en haut du sapin !"},goal:"Monte dans le traîneau : la tournée des maisons !",lines:()=>{R.noelStar=1;save();drawBg();drawGlow();return [
      ["barbeneige","joy","Toutes livrées, et ton sapin a enfin son étoile. On la voit depuis le Nord !",()=>actEmote("barbeneige","coeur")],
      ["ramure","open","Il reste une maison. Une seule…",()=>actEmote("ramure","note")],
      ["barbeneige","joy","La tienne. Saute, file devant ta porte et ferme les yeux. Ramure ! On a une dernière chose à aller chercher.",()=>actGo("me",150,300)]]}},
    {at:"@porch",gather:1,goal:"Barbe-Neige a dit : file devant ta porte et ferme les yeux !",showMs:4000,show:()=>sceneBigGift(),lines:[
      ["petitpois","surprise","C'est… C'est PLUS GROS QUE LA MAISON !",()=>{actTrick("petitpois","salto");actEmote("petitpois","!")}],
      ["ramure","joy","Je l'ai tiré tout seul depuis le Nord. Je tiens à ce que ce soit dit.",()=>actTrick("ramure","boing")],
      ["barbeneige","open","Attends, une dernière lettre. Sans nom, juste une griffe : « Une couverture. Pas pour moi. Pour deux idiots qui ont froid. »",()=>actGive("barbeneige","balafre","coussin")],
      ["balafre","shy","… Je ne sais pas qui a écrit ça.",()=>actPose("balafre","sit","shy")],
      ["filou","joy","Ouais ouais, pas lui, chef !",()=>actTrick("filou","boing")],
      ["radar","joy","J'ai entendu la griffe écrire. Trois nuits de suite.",()=>actEmote("balafre","colere")],
      ["barbeneige","joy",`Et celui-là, ${ME()}, il est pour toi. Tu as livré tout le monde, et tu n'avais rien demandé.`,()=>actEmote("barbeneige","coeur")],
      ["me","joy","Un… deux… trois !",()=>actTrick("me","salto")]]}
  ]}
});

/* ---------- le décor sous la neige (repris de tools/sapin-hd.html) ---------- */
const nSh=(x,y,rx,ry,o=1)=>`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#nSh)" opacity="${o}"/>`;
function nDefs(N){const g=(id,a,b,x2=0,y2=1)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const ball=(id,c,d)=>`<radialGradient id="${id}" cx=".38" cy=".34" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".18" stop-color="${c}"/><stop offset="1" stop-color="${d}"/></radialGradient>`;
  return `<defs>${N?g("nSky","#18204a","#5a4f86"):`<linearGradient id="nSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc8e6"/><stop offset=".65" stop-color="#d9ebf3"/><stop offset="1" stop-color="#fbeedd"/></linearGradient>`}
  <linearGradient id="nSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3ecf6"/><stop offset=".25" stop-color="#f6f9fc"/><stop offset="1" stop-color="#eaf1f8"/></linearGradient>
  <radialGradient id="nSh"><stop offset="0" stop-color="#7a8fbf" stop-opacity=".42"/><stop offset=".6" stop-color="#8fa2cc" stop-opacity=".2"/><stop offset="1" stop-color="#9fb0d6" stop-opacity="0"/></radialGradient>
  <radialGradient id="nWarm"><stop offset="0" stop-color="#ffd98a" stop-opacity=".75"/><stop offset=".5" stop-color="#ffc56a" stop-opacity=".3"/><stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient>
  <radialGradient id="nStar"><stop offset="0" stop-color="#fffbe0"/><stop offset=".3" stop-color="#fff2a8" stop-opacity=".7"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient>
  ${g("nTier","#2e5e45","#5f9e72")}${g("nSnowRoof","#ffffff","#dfe9f4")}${g("nIce","#e4f2f9","#a9cfe4")}${g("nSnowSoft","#ffffff","#e2ebf5")}
  ${g("nHill","#c9d6e8","#e4ecf5")}${g("nHillN","#3f4a80","#56609a")}${g("nCrown","#8fbf98","#5f8f72")}
  ${ball("nbR","#ff7a8f","#c0304e")}${ball("nbB","#8fd0ff","#3f86c4")}${ball("nbY","#ffe48a","#d99a2a")}${ball("nbP","#d6b0ff","#7a52c4")}</defs>`}
function nSky(N){const r=rng(5);let s=`<rect width="400" height="200" fill="url(#nSky)"/>`;
  const ph=phaseNow();
  if(N){for(let i=0;i<40;i++)s+=`<circle class="${i%3?"":"tw"}" style="animation-delay:${f1(-r()*2)}s" cx="${f1(r()*400)}" cy="${f1(r()*110)}" r="${f1(.5+r()*1.1)}" fill="#fff8dc"/>`;
    s+=`<circle cx="332" cy="40" r="34" fill="#fff6d0" opacity=".12"/><circle cx="332" cy="40" r="14" fill="#fff6dc"/><circle cx="327" cy="37" r="3" fill="#ece0b8"/><circle cx="337" cy="45" r="2" fill="#ece0b8"/>`}
  else s+=ph==="aube"?`<circle cx="70" cy="108" r="60" fill="url(#cSun)"/><circle cx="70" cy="108" r="14" fill="#fff0d8"/>`:ph==="crepu"?`<circle cx="310" cy="104" r="64" fill="url(#cSun)"/><circle cx="310" cy="104" r="15" fill="#ffd9a8"/>`
    :`<circle cx="320" cy="34" r="70" fill="url(#cSun)"/><circle cx="320" cy="34" r="13" fill="#fffdf2" opacity=".9"/>`;
  s+=`<path d="M0 112 L40 84 L66 98 L104 66 L140 96 L176 78 L214 100 L252 70 L292 98 L330 76 L370 94 L400 82 L400 150 L0 150Z" fill="url(#${N?"nHillN":"nHill"})"/>`;
  s+=`<path d="M104 66 L94 74 L100 74 L108 80 L114 72 L120 76Z M252 70 L242 79 L250 78 L258 84 L262 77 L268 80Z M330 76 L322 83 L330 82 L336 87 L342 84Z M40 84 L34 90 L42 89 L48 92Z" fill="${N?"#7c86b8":"#fff"}" opacity=".9"/>`;
  return s}
function nPine(x,yb,h,w,fill,snowC,line){let s="";
  for(let k=0;k<3;k++){const y=yb-k*h*.27,hh=h*.46,ww=w*(1-k*.26),t=y-hh;
    s+=`<path d="M${f1(x)} ${f1(t)} L${f1(x-ww)} ${f1(y)} Q${f1(x)} ${f1(y+4)} ${f1(x+ww)} ${f1(y)}Z" fill="${fill}" ${line}/>`;
    s+=`<path d="M${f1(x-ww*.9)} ${f1(y-1)} Q${f1(x-ww*.5)} ${f1(y-hh*.22)} ${f1(x)} ${f1(y-hh*.18)} Q${f1(x+ww*.5)} ${f1(y-hh*.22)} ${f1(x+ww*.9)} ${f1(y-1)} Q${f1(x)} ${f1(y+3)} ${f1(x-ww*.9)} ${f1(y-1)}Z" fill="${snowC}"/>`}
  return s+`<path d="M${f1(x-w*.2)} ${f1(yb-h*.62)} L${f1(x)} ${f1(yb-h)} L${f1(x+w*.2)} ${f1(yb-h*.62)}Z" fill="${snowC}"/>`}
function nForest(N){const r=rng(17);let s="";
  const rows=N?[[118,46,"#4d5a8a","#8a94c4",""],[136,58,"#3f5578","#a6b2d8",""],[156,72,"#34506a","#c4cde8",`stroke="${INK}" stroke-width="1.6" stroke-opacity=".5"`]]
    :[[118,46,"#a9c4c8","#f2f7fa",""],[136,58,"#86ab9f","#f6fafc",""],[156,72,"#5f8f7c","#ffffff",`stroke="${INK}" stroke-width="1.8" stroke-opacity=".55"`]];
  rows.forEach(([y,h,c,sc,ln],ri)=>{for(let i=-1;i<15;i++){const x=i*30+ri*11+r()*10,hh=h*(.8+r()*.4);s+=nPine(x,y+r()*8,hh,hh*.36,c,sc,ln)}});
  return s+`<rect y="100" width="400" height="70" fill="${N?"#5a5f98":"#eef4f8"}" opacity="${N?.18:.28}"/>`}
function nGround(){const r=rng(23);let s=`<path d="M0 160 Q60 150 120 158 Q200 148 280 158 Q340 150 400 158 L400 ${H} L0 ${H}Z" fill="url(#nSnow)"/>`;
  [[40,300,70,14],[350,290,64,12],[230,470,90,16],[30,470,60,12],[380,440,40,10]].forEach(([x,y,w,h])=>s+=`<path d="M${x-w} ${y} Q${x-w*.4} ${y-h} ${x} ${y-h*.8} Q${x+w*.5} ${y-h*1.1} ${x+w} ${y} Z" fill="#fff"/><path d="M${x-w} ${y} Q${x} ${y+5} ${x+w} ${y}" fill="none" stroke="#cbd8ea" stroke-width="2.4" stroke-linecap="round"/>`);
  for(let i=0;i<9;i++){const y=470-i*24,x=226+Math.sin(i*.9)*8;[[0,0],[7,-9]].forEach(([dx,dy])=>s+=`<g fill="#c9d6e8" transform="translate(${f1(x+dx)} ${f1(y+dy)})"><ellipse rx="2.6" ry="2"/><circle cx="-2.4" cy="-3" r=".9"/><circle cx="0" cy="-3.8" r=".9"/><circle cx="2.4" cy="-3" r=".9"/></g>`)}
  s+=nExt()+nRamTracks();
  [[200,272],[193,296],[206,322],[196,350],[205,392],[196,430],[204,466],[195,504],[205,544],[196,586],[204,626]].filter(([,y])=>y<H-6).forEach(([x,y],i)=>{const w=13-i*.3;
    s+=nSh(x+3,y+3,w+4,7,.7)+`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="6" fill="#d9d2c8" ${L(2.2)}/><ellipse cx="${x-2}" cy="${y-1.6}" rx="${f1(w*.62)}" ry="2.6" fill="#ece6dd"/><path d="M${f1(x-w*.8)} ${y-2} Q${x-2} ${y-7} ${f1(x+w*.5)} ${y-3.4} Q${x} ${y-1.6} ${f1(x-w*.8)} ${y-2}Z" fill="#fff"/>`});
  for(let i=0;i<26+Math.round(EXT/12);i++){const x=r()*400,y=175+r()*(H-185),k=.6+r()*.8;s+=`<path class="${i%2?"tw":""}" style="animation-delay:${f1(-r()*2)}s" d="M${f1(x)} ${f1(y-3*k)} L${f1(x+.8*k)} ${f1(y-.8*k)} L${f1(x+3*k)} ${f1(y)} L${f1(x+.8*k)} ${f1(y+.8*k)} L${f1(x)} ${f1(y+3*k)} L${f1(x-.8*k)} ${f1(y+.8*k)} L${f1(x-3*k)} ${f1(y)} L${f1(x-.8*k)} ${f1(y-.8*k)}Z" fill="#fff"/>`}
  return s}
// la neige en plus sous la scène (EXT, la même que l'herbe en plus) : traces de pattes jusqu'en bas, congères, petits sapins et houx sur les bords
function nExt(){if(EXT<8)return "";const band=Math.max(EXT-80,40),Y=k=>Math.round(480+band*k);let s="";
  for(let y=494;y<H-14;y+=24){const x=226+Math.sin(y*.04)*8;[[0,0],[7,-9]].forEach(([dx,dy])=>s+=`<g fill="#c9d6e8" transform="translate(${f1(x+dx)} ${f1(y+dy)})"><ellipse rx="2.6" ry="2"/><circle cx="-2.4" cy="-3" r=".9"/><circle cx="0" cy="-3.8" r=".9"/><circle cx="2.4" cy="-3" r=".9"/></g>`)}
  [[70,Y(.45),70,13],[330,Y(.85),76,14],[150,Y(1)+30,60,10]].filter(([,y])=>y<H-4).forEach(([x,y,w,h])=>s+=`<path d="M${x-w} ${y} Q${x-w*.4} ${y-h} ${x} ${y-h*.8} Q${x+w*.5} ${y-h*1.1} ${x+w} ${y} Z" fill="#fff"/><path d="M${x-w} ${y} Q${x} ${y+5} ${x+w} ${y}" fill="none" stroke="#c9d6e8" stroke-width="2" stroke-linecap="round"/>`);
  if(EXT<60||gardenCleared())return s; // le jardin vidé pour le record de Boule-de-Neige
  // petits sapins enneigés
  const fir=(x,y,k)=>`<g transform="translate(${x} ${y}) scale(${k})">${nSh(0,2,20,5,.6)}<rect x="-3" y="-10" width="6" height="12" fill="#8a5a3a" ${L(2)}/>${[[-26,-8,22],[-20,-30,16],[-13,-50,10]].map(([y0,y1,w])=>`<path d="M${-w} ${y0} L0 ${y1-8} L${w} ${y0}Z" fill="#5f9468" ${L(2.2)}/><path d="M${-w*.7} ${y0-3} Q0 ${y1+4} ${w*.7} ${y0-3} L0 ${y1-8}Z" fill="#fff" opacity=".95"/>`).join("")}</g>`;
  s+=fir(30,Y(.62),1.6)+fir(56,Y(.68),1.1)+fir(374,Y(.3),1.4)+fir(150,Y(1)+44,1.2);
  // un buisson de houx sous la neige
  const hx=340,hy=Y(.62);s+=nSh(hx,hy+2,18,4,.6)+[[-10,0],[0,-6],[10,0]].map(([dx,dy])=>`<path transform="translate(${hx+dx} ${hy+dy})" d="M-9 0 q2 -6 0 -9 q5 2 9 0 q4 2 9 0 q-2 3 0 9 q-9 3 -18 0Z" fill="#4f8a5a" ${L(1.6)}/>`).join("")+`<path d="M${hx-18} ${hy-4} Q${hx} ${hy-16} ${hx+18} ${hy-4}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`+[[-3,-8],[2,-10],[6,-7]].map(([dx,dy])=>`<circle cx="${hx+dx}" cy="${hy+dy}" r="2.4" fill="#e0505a" stroke="${INK}" stroke-width="1.2"/>`).join("");
  return s}
function nRamTracks(){if(noelDay()<NOEL_FROM.ramure||!storyDone("grelot")||(R.beat.ramure||0)>=2)return "";let s="";
  // de grandes empreintes de sabot fendu, deux par deux, qui descendent de la forêt vers la mare gelée
  for(let i=0;i<13;i++){const t=i/12,x=352-212*t+Math.sin(t*5)*16,y=196+(404-196)*t,a=Math.atan2(404-196,-212)*180/Math.PI-90,side=i%2?-1:1;
    s+=`<g transform="translate(${f1(x+side*7)} ${f1(y)}) rotate(${f1(a)}) scale(${f1(1.15+t*.55)})" fill="#7d93b4" opacity=".9"><path d="M-1 -6 Q-6 -5 -5 2 Q-4 6 -1 5Z"/><path d="M1 -6 Q6 -5 5 2 Q4 6 1 5Z"/></g>`}
  return s}
function nSideTree(x,flip){const X=v=>flip?2*x-v:v;let s=nSh(x+10,252,40,8);
  s+=`<path d="M${X(x-12)} 254 Q${X(x-20)} 258 ${X(x-26)} 256 Q${X(x-14)} 248 ${X(x-9)} 230 Q${X(x-6)} 190 ${X(x-10)} 150 L${X(x+10)} 150 Q${X(x+6)} 190 ${X(x+10)} 232 Q${X(x+16)} 248 ${X(x+26)} 256 Q${X(x+18)} 258 ${X(x+12)} 254Z" fill="url(#cTrunk)" ${L(2.8)}/>`;
  s+=`<path d="M${X(x-4)} 236 Q${X(x-2)} 210 ${X(x-5)} 186 M${X(x+4)} 220 Q${X(x+5)} 200 ${X(x+3)} 176 M${X(x-1)} 166 q3 4 0 8" fill="none" stroke="#6a4430" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><ellipse cx="${X(x+2)}" cy="200" rx="2.6" ry="3.6" fill="#6a4430"/>`;
  s+=`<path d="M${X(x-12)} 254 Q${X(x)} 248 ${X(x+12)} 254 Q${X(x)} 258 ${X(x-12)} 254Z M${X(x-26)} 256 q4 -5 10 -4 M${X(x+26)} 256 q-4 -5 -10 -4" fill="#fff" stroke="none"/>`;
  const cl=[[-22,132,26],[18,136,26],[-4,112,30],[-30,104,20],[26,106,22],[0,86,22]];
  cl.forEach(([dx,y,r])=>s+=`<circle cx="${X(x+dx)}" cy="${y}" r="${r}" fill="url(#nCrown)" ${L(2.6)}/>`);
  cl.forEach(([dx,y,r])=>{const cx=X(x+dx);s+=`<path d="M${f1(cx-r*.85)} ${f1(y-r*.35)} Q${f1(cx-r*.6)} ${f1(y-r*1.02)} ${f1(cx)} ${f1(y-r)} Q${f1(cx+r*.6)} ${f1(y-r*1.02)} ${f1(cx+r*.85)} ${f1(y-r*.35)} Q${f1(cx+r*.4)} ${f1(y-r*.5)} ${f1(cx+r*.1)} ${f1(y-r*.36)} Q${f1(cx-r*.3)} ${f1(y-r*.56)} ${f1(cx-r*.85)} ${f1(y-r*.35)}Z" fill="url(#nSnowSoft)" ${L(2)}/>`});
  return s}
function nHouse(N){let s=nSh(200,250,120,16);
  s+=`<rect x="232" y="46" width="22" height="42" rx="3" fill="#b9a49a" ${L()}/>`+[[234,52,9],[244,52,8],[236,61,10],[247,61,6],[234,70,7],[242,70,10],[236,79,9],[246,79,7]].map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="7" rx="2.4" fill="#cfbcb2" stroke="#9a857b" stroke-width="1.2"/>`).join("");
  s+=`<path d="M228 48 Q230 38 243 40 Q256 37 258 48 Q243 52 228 48Z" fill="url(#nSnowRoof)" ${L(2.2)}/>`;
  s+=`<rect x="128" y="104" width="144" height="98" fill="url(#cLog)" ${L(3)}/>`;
  for(let y=104,i=0;y<200;y+=12,i++){s+=`<path d="M129 ${y+12} H271" stroke="#c48a58" stroke-width="2"/><path d="M134 ${y+4} q20 -1.6 40 0 M${180+i*7%30} ${y+7} q22 1.4 44 0" fill="none" stroke="#fbe0b6" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`;
    for(const x of [126,274])s+=`<circle cx="${x}" cy="${y+6}" r="6" fill="#e8b47c" ${L(2)}/><circle cx="${x}" cy="${y+6}" r="2.6" fill="none" stroke="#b8804e" stroke-width="1.2"/>`}
  s+=`<path d="M104 116 L200 40 L296 116 Q200 126 104 116Z" fill="url(#cRoof)" ${L(3)}/>`;
  for(const [y,a,b] of [[108,116,284],[96,131,269]])for(let x=a;x<b;x+=12)s+=`<path d="M${x} ${y} q6 6 12 0" fill="none" stroke="#a65445" stroke-width="1.6"/>`;
  s+=`<path d="M108 112 L200 38 L292 112 Q286 118 278 112 Q270 120 260 113 Q250 121 240 112 Q228 119 216 112 Q204 120 192 112 Q180 120 168 112 Q156 119 146 112 Q134 120 124 112 Q116 118 108 112Z" fill="url(#nSnowRoof)" ${L(2.6)}/>`;
  s+=`<path d="M150 90 Q176 70 200 56 M212 66 Q240 82 262 96" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/><path d="M120 110 Q200 116 282 110" fill="none" stroke="#cddbeb" stroke-width="2" stroke-linecap="round"/>`;
  s+=[124,138,159,176,198,214,236,252,270,284].map((x,i)=>`<path d="M${x-2.4} ${114+(i%3)} L${x} ${121+(i*7)%9} L${x+2.4} ${114+(i%3)}Z" fill="#e8f4fb" stroke="#9fc1da" stroke-width="1.2" stroke-linejoin="round"/>`).join("");
  const night=dark(),win=x=>`<rect x="${x-3}" y="121" width="42" height="40" rx="6" fill="#8a5a3a" ${L(2.4)}/><rect x="${x}" y="124" width="36" height="34" rx="4" fill="url(#${night?"cGlassN":"cGlass"})" stroke="#6a4430" stroke-width="1.6"/>`
    +(night?"":`<path d="M${x+4} 154 L${x+16} 128 M${x+12} 156 L${x+24} 130" stroke="#fff" stroke-width="2.6" opacity=".55" stroke-linecap="round"/>`)
    +`<path d="M${x+1} 125 Q${x+9} 132 ${x+5} 157 L${x+1} 157Z M${x+35} 125 Q${x+27} 132 ${x+31} 157 L${x+35} 157Z" fill="#f6b8c4" stroke="#d98a9a" stroke-width="1.2"/>`
    +`<path d="M${x+18} 124 V158 M${x} 141 H${x+36}" stroke="#8a5a3a" stroke-width="3"/>`
    +`<path d="M${x-6} 161 H${x+42} l-2 6 H${x-4}Z" fill="#a9785a" ${L(2.2)}/><path d="M${x-6} 161 Q${x+4} 154 ${x+14} 159 Q${x+24} 153 ${x+34} 158 Q${x+40} 156 ${x+42} 161Z" fill="#fff" ${L(1.8)}/>`
    +`<path d="M${x+28} 158 q-6 -6 -10 0 q5 3 10 0Z M${x+28} 158 q4 -7 9 -2 q-4 4 -9 2Z" fill="#5fa86c" stroke="${INK}" stroke-width="1.2"/><circle cx="${x+27}" cy="157" r="1.8" fill="#e2445e"/><circle cx="${x+30}" cy="158" r="1.6" fill="#e2445e"/>`;
  s+=win(146)+win(218);
  // la porte reste entrouverte, comme le reste de l'année (on la touche pour entrer), avec une couronne de Noël
  s+=`<path d="M184 202 V146 Q200 128 216 146 V202Z" fill="#5e3a2a" ${L(2.8)}/><path d="M188 202 V147 Q193 139 202 137 V202Z" fill="#ffd98a" stroke="none"/>`;
  s+=`<path d="M199 136 Q209 134 215 143 V202 H199Z" fill="url(#cDoor)" ${L(2.4)}/><path d="M204 140 V202 M209 141 V202" stroke="#5e3a26" stroke-width="1.2" opacity=".7"/><circle cx="203" cy="172" r="2" fill="#f2c45a" ${L(1.2)}/>`;
  s+=`<circle cx="207" cy="156" r="6.4" fill="none" stroke="${INK}" stroke-width="5.6"/><circle cx="207" cy="156" r="6.4" fill="none" stroke="#4f9a5e" stroke-width="3.4"/>`+[0,72,144,216,288].map(a=>`<circle cx="${f1(207+6.4*Math.cos(a*Math.PI/180))}" cy="${f1(156+6.4*Math.sin(a*Math.PI/180))}" r="1.3" fill="#e2445e"/>`).join("")
    +`<path d="M207 162 l-4 -3 v6Z M207 162 l4 -3 v6Z" fill="#e2445e" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>`;
  s+=`<path d="M106 202 L294 202 L302 246 L98 246Z" fill="url(#cDeck)" ${L(3)}/>`;
  for(const y of [213,224,235])s+=`<path d="M${104-(y-202)*.1} ${y} H${296+(y-202)*.1}" stroke="#b8845a" stroke-width="1.8"/>`;
  s+=`<path d="M98 246 L302 246 L300 240 Q262 236 230 241 Q200 236 170 241 Q136 236 100 240Z" fill="#fff" ${L(2)}/>`;
  s+=`<path d="M180 246 h40 l3 8 h-46Z M175 254 h50 l3 8 h-56Z" fill="#c99a6a" ${L(2.4)}/><path d="M180 246 q20 -3 40 0 M176 254 q24 -3 48 0 M172 262 q28 -3 56 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
  s+=`<rect x="102" y="190" width="7" height="54" rx="2" fill="#a87650" ${L(2.4)}/><rect x="291" y="190" width="7" height="54" rx="2" fill="#a87650" ${L(2.4)}/>`;
  s+=[105.5,294.5].map(x=>`<path d="M${x-4} 200 l8 6 M${x-4} 212 l8 6 M${x-4} 224 l8 6" stroke="#4f9a5e" stroke-width="3" stroke-linecap="round"/>`).join("");
  s+=`<path d="M108 168 L292 168 L302 192 L98 192Z" fill="url(#cRoof)" ${L(3)}/>`+[128,156,184,212,240,268].map(x=>`<path d="M${x} 170 L${f1(x-4+(x-200)*.06)} 191" stroke="#9a4f42" stroke-width="1.8"/>`).join("");
  s+=`<path d="M106 172 Q150 160 200 164 Q250 160 294 172 L298 182 Q280 188 262 182 Q244 190 226 183 Q206 190 186 183 Q164 190 146 183 Q124 189 102 182Z" fill="url(#nSnowRoof)" ${L(2.4)}/>`;
  s+=`<path d="M98 192 Q200 202 302 192" fill="none" stroke="#3d2a35" stroke-width="1.2"/>`+Array.from({length:15},(_,i)=>{const x=104+i*13.7,y=193+Math.sin(i/14*Math.PI)*8.6,c=["#ff7a8f","#ffe07a","#8fd0ff","#a8e6a0"][i%4];return `<ellipse cx="${f1(x)}" cy="${f1(y+2.4)}" rx="2" ry="2.8" fill="${c}" stroke="${INK}" stroke-width="1"/>`}).join("");
  return s}
/* le grand sapin, à gauche de la maison */
const SX=60,SB=262;
function nTierPath(cx,top,yb,w,n){let d=`M${f1(cx)} ${f1(top)} Q${f1(cx-w*.28)} ${f1(yb-(yb-top)*.42)} ${f1(cx-w)} ${f1(yb)}`;
  for(let i=1;i<=n;i++){const x=cx-w+2*w*i/n,xm=x-w/n;d+=` Q${f1(xm)} ${f1(yb-8)} ${f1(x)} ${f1(yb+(i%2?2:0))}`}
  return d+` Q${f1(cx+w*.28)} ${f1(yb-(yb-top)*.42)} ${f1(cx)} ${f1(top)}Z`}
function nSnowBand(cx,yb,w,n,r){let d=`M${f1(cx-w+2)} ${f1(yb-2)}`;
  for(let i=1;i<=n;i++){const x=cx-w+2+(2*w-4)*i/n,xm=x-(w-2)/n;d+=` Q${f1(xm)} ${f1(yb-9)} ${f1(x)} ${f1(yb-2+(i%2?1.5:0))}`}
  for(let i=n;i>0;i--){const x=cx-w+2+(2*w-4)*(i-1)/n,xm=x+(w-2)/n;d+=` Q${f1(xm)} ${f1(yb-15-r()*5)} ${f1(x)} ${f1(yb-10-r()*3)}`}
  return d+"Z"}
// le sapin pousse un peu chaque jour (Joffray : « il passe de rien à 3 m d'un coup ») : g va de 0 (la pousse du 1er) à 1 (le 15,
// une fois Ramure retrouvé) ; les étapes de l'histoire (sapinStage) ne changent pas
function sapinGrow(st){if(st==="2"||st==="3")return 1;const d=noelDay();return st==="0"?Math.min(.32,(d-1)/7*.32):Math.min(.86,.38+(d-8)/7*.48)}
const sapinT=st=>{const g=sapinGrow(st);return {n:Math.round(3+3*g),h0:24+68*g,dy:11+41*g,w0:17+51*g,dw:4.5+5.9*g,bough:3+5*g}};
function nSapin(st,star){const r=rng(31),T=sapinT(st);let s="";
  const tiers=[];for(let k=0;k<T.n;k++){const yb=SB-k*T.dy,h=T.h0-k*(T.h0*.04),w=T.w0-k*T.dw;tiers.push([yb,yb-h,w])}
  s+=nSh(SX+14,SB+6,T.w0+18,T.w0*.22+4);
  if(st==="0")s+=`<ellipse cx="${SX}" cy="${SB+3}" rx="20" ry="7" fill="#a98068" ${L(2.4)}/><path d="M${SX-20} ${SB+2} Q${SX} ${SB-6} ${SX+20} ${SB+2} Q${SX} ${SB+4} ${SX-20} ${SB+2}Z" fill="#fff"/>`;
  s+=`<rect x="${f1(SX-T.w0*.11)}" y="${SB-6}" width="${f1(T.w0*.22)}" height="${f1(T.w0*.22+4)}" rx="3" fill="url(#cTrunk)" ${L(2.6)}/>`;
  tiers.forEach(([yb,top,w],k)=>{
    s+=`<path d="${nTierPath(SX,top,yb,w,T.bough-(k>3?2:0))}" fill="url(#nTier)" ${L(st==="0"?2:2.8)}/>`;
    s+=`<path d="M${SX} ${f1(top+6)} Q${f1(SX+w*.24)} ${f1(yb-(yb-top)*.42)} ${f1(SX+w*.92)} ${f1(yb-1)} Q${f1(SX+w*.4)} ${f1(yb-4)} ${SX} ${f1(yb-2)}Z" fill="#163a28" opacity=".22"/>`;
    for(let i=0;i<(st==="0"?0:Math.round(w/5));i++){const x=SX+(r()*2-1)*w*.7,y=yb-(yb-top)*(.15+r()*.5);if(Math.abs(x-SX)>(yb-y)*w/(yb-top)*.8)continue;
      s+=`<path d="M${f1(x-3)} ${f1(y-2)} L${f1(x)} ${f1(y+1.6)} L${f1(x+3)} ${f1(y-2)}" fill="none" stroke="${x<SX?"#7ab88a":"#2c5a40"}" stroke-width="1.3" stroke-linecap="round"/>`}
    if(st!=="0")s+=`<path d="${nSnowBand(SX,yb,w*.96,T.bough-(k>3?2:0),r)}" fill="url(#nSnowSoft)" ${L(2)}/>`;
    if(st==="0"&&k===T.n-1)s+=`<path d="M${SX} ${f1(top)} q-5 7 -8 8 q4 2 8 -1 q4 3 8 1 q-3 -1 -8 -8Z" fill="#fff" ${L(1.6)}/>`});
  // la petite écharpe de Petit Pois, nouée à la pousse
  if(st==="0")s+=`<path d="M${SX-9} ${SB-10} Q${SX} ${SB-6} ${SX+9} ${SB-10} L${SX+9} ${SB-7} Q${SX} ${SB-3} ${SX-9} ${SB-7}Z" fill="#e8505e" ${L(1.4)}/><path d="M${SX+5} ${SB-7} l2 8 l4 -1 l-2 -8Z" fill="#e8505e" ${L(1.2)}/>`;
  if(st==="3"){
    tiers.forEach(([yb,top,w],k)=>{const y=yb-(yb-top)*.4,x0=SX-w*.66,x1=SX+w*.66;
      s+=`<path d="M${f1(x0)} ${f1(y-5)} Q${SX} ${f1(y+9)} ${f1(x1)} ${f1(y+1)}" fill="none" stroke="#3d2a35" stroke-width="1.2"/>`;
      for(let i=0;i<=6;i++){const t=i/6,x=(1-t)*(1-t)*x0+2*(1-t)*t*SX+t*t*x1,yy=(1-t)*(1-t)*(y-5)+2*(1-t)*t*(y+9)+t*t*(y+1),c=["#ffe07a","#ff9aa8","#9fdcff","#b8f0a8"][(i+k)%4];
        s+=`<ellipse cx="${f1(x)}" cy="${f1(yy+2.2)}" rx="1.8" ry="2.5" fill="${c}" stroke="${INK}" stroke-width=".9"/>`}
      [[-.72,"nbR"],[-.12,"nbB"],[.5,"nbY"],[.82,"nbP"]].slice(0,k>3?2:4).forEach(([u,g],j)=>{const x=SX+w*u*.9,yy=yb-4-(j%2)*4;
        s+=`<path d="M${f1(x)} ${f1(yy-10)} v4" stroke="${INK}" stroke-width="1.2"/><circle cx="${f1(x)}" cy="${f1(yy-1)}" r="5.4" fill="url(#${g})" ${L(1.8)}/><rect x="${f1(x-1.8)}" y="${f1(yy-7.6)}" width="3.6" height="2.4" rx=".6" fill="#f2c45a" stroke="${INK}" stroke-width="1"/>`});
      if(k<4)s+=`<g transform="translate(${f1(SX+w*.18*(k%2?-1:1))} ${f1(yb-(yb-top)*.72)})"><path d="M0 0 l-6 -4 v8Z M0 0 l6 -4 v8Z" fill="#e2445e" ${L(1.4)}/><circle r="1.8" fill="#c2304a" stroke="${INK}" stroke-width="1"/></g>`});
    if(star){
      [[SX-44,SB+12,22,15,"#e2546e","#f7d77a"],[SX+22,SB+14,18,13,"#7cb8e0","#fff"],[SX-12,SB+22,26,13,"#8fca7a","#e2445e"],[SX+40,SB+6,14,11,"#c9a0ec","#fff3a8"]].forEach(([x,y,w,h,c,rb])=>{
        s+=nSh(x+w*.6,y+2,w*.8,4)+`<path d="M${x} ${y-h} l5 -5 h${w} l-5 5Z" fill="${c}" ${L(2)}/><path d="M${x} ${y-h} l5 -5 h${w} l-5 5Z" fill="#fff" opacity=".35"/><rect x="${x}" y="${y-h}" width="${w}" height="${h}" rx="1.6" fill="${c}" ${L(2.2)}/><path d="M${x+w} ${y-h} l5 -5 v${h} l-5 5Z" fill="${c}" ${L(2)}/><path d="M${x+w} ${y-h} l5 -5 v${h} l-5 5Z" fill="#3d2a35" opacity=".2"/>`
          +`<path d="M${x+w/2} ${y-h} v${h} M${x} ${y-h/2} h${w} M${x+w/2} ${y-h} l5 -5" stroke="${rb}" stroke-width="3"/><path d="M${x+w/2+2.5} ${y-h-2.5} q-8 -8 -10 -1 q4 3 10 1 q7 -8 10 -1 q-4 3 -10 1" fill="${rb}" stroke="${INK}" stroke-width="1.4"/>`})}}
  return s}
// l'étoile, hors de l'écran : sa lumière déborde en haut (dans #glow, au-dessus du voile de la nuit)
const nStarGlow=()=>`<ellipse cx="${SX}" cy="-4" rx="80" ry="56" fill="url(#gStar)"/>`+[[-40,40],[-14,52],[14,52],[40,40]].map(([dx,dy])=>`<path d="M${SX} 0 L${SX+dx} ${dy}" stroke="#fff6c0" stroke-width="2" opacity=".5" stroke-linecap="round"/>`).join("");
function nStump(){return nSh(94,306,32,7)+`<path d="M63 290 L62 304 Q85 316 108 304 L107 290Z" fill="url(#cStump)" ${L(2.8)}/><path d="M70 296 v10 M80 297 v12 M92 297 v12 M101 295 v9" stroke="#7a5238" stroke-width="1.4" opacity=".6"/><path d="M60 304 q-7 5 -12 2 q4 -3 4 -6 M110 304 q7 5 12 2 q-4 -3 -4 -6" fill="#9a6a48" ${L(2.2)}/>`
  +`<ellipse cx="85" cy="290" rx="22" ry="8" fill="#e6c49a" ${L(2.4)}/><path d="M62 291 Q66 280 78 282 Q86 276 96 281 Q106 280 108 290 Q102 296 92 293 Q84 298 74 294 Q66 297 62 291Z" fill="url(#nSnowSoft)" ${L(2)}/>`}
function nMound(){let s=nSh(330,344,46,9)+`<path d="M286 342 Q292 322 312 320 Q324 308 340 316 Q360 318 366 342 Q326 350 286 342Z" fill="url(#nSnowSoft)" ${L(2.6)}/>`;
  s+=[[298,336,"#f2a35c",-20],[352,338,"#e8794e",24],[326,344,"#f6c065",-6]].map(([x,y,c,a])=>`<path d="M${x-8} ${y} Q${x} ${y-8} ${x+8} ${y} Q${x} ${y+4} ${x-8} ${y}Z" fill="${c}" stroke="${INK}" stroke-width="1.6" transform="rotate(${a} ${x} ${y})"/>`).join("");
  return s+`<g transform="translate(330 312)"><ellipse cx="0" cy="0" rx="7" ry="6" fill="#8a6a5a" ${L(1.8)}/><path d="M-5 1 Q-4 6 1 6 Q5 5 5 1 Q0 -1 -5 1Z" fill="#e8794e" stroke="none"/><circle cx="-5" cy="-5" r="4.4" fill="#8a6a5a" ${L(1.8)}/><path d="M-6.6 -7 Q-5 -2.2 -1.8 -3.6 Q-2.8 -6.4 -6.6 -7Z" fill="#e8794e" stroke="none"/><circle cx="-6" cy="-6" r=".9" fill="${INK}"/><path d="M-9.4 -5 l-3 1 l3 1Z" fill="#f2c45a" stroke="${INK}" stroke-width="1"/><path d="M6 -1 l6 -3 l-1 5Z" fill="#6a4a3a" ${L(1.4)}/><path d="M-2 6 v3 M2 6 v3" stroke="${INK}" stroke-width="1.2"/></g>`}
function nPond(){let s=`<ellipse cx="96" cy="426" rx="70" ry="30" fill="#fff" ${L(2.4)}/><ellipse cx="98" cy="429" rx="70" ry="29" fill="#d4e1ee" opacity=".5"/>`;
  s+=`<ellipse cx="96" cy="424" rx="60" ry="22" fill="url(#nIce)" ${L(2.6)}/><ellipse cx="80" cy="428" rx="9" ry="4" fill="#9cc79a" opacity=".45"/>`;
  s+=`<path d="M52 418 q20 -9 44 -5 M110 432 q14 -4 26 -1" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/><path d="M70 420 l12 5 l9 -6 l6 8 M112 428 l9 -4 l8 5 M96 424 l-6 8" fill="none" stroke="#8fb9d4" stroke-width="1.4" stroke-linecap="round"/>`;
  s+=`<path d="M60 432 Q96 444 130 428 M66 436 Q100 446 136 432" fill="none" stroke="#fff" stroke-width="1.4" opacity=".7"/>`;
  s+=`<path d="M38 418 l-4 -20 M44 414 l0 -22 M150 416 l3 -18 M156 420 l6 -14" fill="none" stroke="#9a7a4a" stroke-width="3" stroke-linecap="round"/><ellipse cx="34" cy="396" rx="2.6" ry="6" fill="#7a5a3a" ${L(1.4)}/><ellipse cx="44" cy="391" rx="2.6" ry="6" fill="#7a5a3a" ${L(1.4)}/><ellipse cx="153" cy="397" rx="2.4" ry="5.4" fill="#7a5a3a" ${L(1.4)}/>`
    +`<circle cx="34" cy="390" r="2.6" fill="#fff"/><circle cx="44" cy="385" r="2.6" fill="#fff"/><circle cx="153" cy="392" r="2.4" fill="#fff"/>`;
  return s+`<path d="M30 424 Q40 408 64 404 Q96 398 128 404 Q156 410 164 426" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`}
function nBench(){return nSh(306,420,50,7)+`<rect x="266" y="404" width="6" height="14" fill="#9a6a48" ${L(2.2)}/><rect x="328" y="404" width="6" height="14" fill="#9a6a48" ${L(2.2)}/><rect x="258" y="394" width="84" height="13" rx="3" fill="url(#cBench)" ${L(2.6)}/><path d="M262 400 H338" stroke="#b07a52" stroke-width="1.6"/><path d="M270 398 q8 -1 14 0 M300 403 q10 -1 18 0" stroke="#f0c896" stroke-width="1.2" stroke-linecap="round"/>`
  +`<path d="M258 396 Q262 386 280 388 Q296 382 312 387 Q332 384 342 396 Q300 400 258 396Z" fill="url(#nSnowSoft)" ${L(2)}/><path d="M318 394 q6 4 4 14 l5 0 q1 -9 -3 -15Z" fill="#e2546e" ${L(1.6)}/><path d="M320 400 h6 M321 404 h6" stroke="#fff" stroke-width="1.4"/>`}
// le décor complet : mêmes endroits que le reste de l'année (SPOTS, zones à toucher), cabane et balançoire comprises
function noelBg(){const ph=phaseNow(),N=ph==="nuit",r=rng(11),st=sapinStage(),clr=gardenCleared();let s=bgDefs(ph)+nDefs(N);
  s+=`<rect width="400" height="${H}" fill="url(#nSnow)"/>`+nSky(N)+nForest(N)+nGround();
  s+=`<g filter="url(#wobble)">`;
  if(R.obj&&R.obj.balancoire)s+=`<path d="M374 182 Q340 168 298 176 Q290 180 297 186 Q338 182 374 206Z" fill="url(#cTrunk)" ${O}/><path d="M300 176 Q336 166 372 180 L372 186 Q338 172 300 180Z" fill="#fff"/>`;
  s+=nSideTree(22,false)+nSideTree(380,true);
  if(R.obj&&R.obj.cabane)s+=`<rect x="330" y="88" width="56" height="44" rx="3" fill="url(#cLog)" ${O}/>${[99,110,121].map(y=>`<path d="M332 ${y} H384" stroke="#c48a58" stroke-width="2"/>`).join("")}
    <path d="M322 92 L358 64 L394 92Z" fill="url(#cRoof)" ${O}/><path d="M322 92 L358 62 L394 92 Q384 96 376 91 Q366 97 356 91 Q346 97 336 91 Q328 96 322 92Z" fill="url(#nSnowRoof)" ${L(2.2)}/>
    <rect x="360" y="102" width="16" height="15" rx="3" fill="url(#${dark()?"cGlassN":"cGlass"})" ${O}/><path d="M368 102 V117 M360 109.5 H376" stroke="#8a5a3a" stroke-width="2"/>
    <path d="M330 138 L366 166 L366 156 L344 138Z" fill="#8a5a3a" ${O}/><rect x="298" y="130" width="94" height="8" rx="3" fill="#c99a6a" ${O}/><path d="M298 131 Q345 124 392 131" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <path d="M366 138 L368 248 M378 138 L380 248" stroke="#c99a6a" stroke-width="2"/>${[152,168,184,200,216,232].map(y=>`<path d="M${366+(y-138)*.02} ${y} H${378+(y-138)*.02}" stroke="#c99a6a" stroke-width="2.4"/>`).join("")}`;
  s+=nHouse(N);
  const big=st&&st!=="0";
  s+=`<path d="${big?"M106 194 Q92 210 82 204":"M106 194 Q60 226 26 200"} ${R.obj&&R.obj.balancoire?"M294 194 Q300 210 306 206":"M294 194 Q340 226 374 200"}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
  if(st)s+=nSapin(st,sapinStar());
  const tg=clr&&typeof cur==="function"&&cur()?cur().b.at:""; // une histoire en cours qui a besoin du banc, de la souche ou des feuilles les garde
  s+=(clr&&tg!=="@stump"?"":nStump())+(clr&&tg!=="@leaves"?"":nMound())+nPond();
  if(storyDone("gaston"))s+=`<path d="M150 440 L132 384" stroke="#a9785a" stroke-width="3.4" stroke-linecap="round"/><path d="M132 384 Q118 398 116 418" fill="none" stroke="#fff" stroke-width="1.4"/><circle cx="116" cy="420" r="3.4" fill="#e0564f" stroke="${INK}" stroke-width="1.6"/>`;
  s+=(clr?rollTrack():"")+(clr&&tg!=="@bench"?"":nBench())+`</g>`;
  if(ph==="jour")s+=`<circle cx="330" cy="20" r="220" fill="url(#cSun)" opacity=".14"/>`;
  return s+`<rect width="400" height="${H}" fill="url(#cVig)"/><rect width="400" height="${H}" fill="url(#cGrain)"/>`}
// la nuit, les lumières du sapin décoré et l'étoile brillent au-dessus du voile (drawGlow)
function noelGlow(){const st=sapinStage();if(st!=="3")return "";let s=`<defs><radialGradient id="gStar"><stop offset="0" stop-color="#fffbe0"/><stop offset=".3" stop-color="#fff2a8" stop-opacity=".7"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient></defs>`;
  if(sapinStar())s+=nStarGlow();
  if(dark()){const r=rng(9);for(let i=0;i<40;i++){const k=Math.floor(r()*6),yb=SB-k*52,h=92-k*3.7,w=68-k*10.4,t=.18+r()*.75,y=yb-h*t,x=SX+(r()*2-1)*w*t*.85;if(y<6)continue;
      s+=`<circle class="tw" style="animation-delay:${f1(-r()*2)}s" cx="${f1(x)}" cy="${f1(y)}" r="5.5" fill="${["#ffe08a","#ffb0c0","#bfe6ff"][i%3]}" opacity=".55"/><circle cx="${f1(x)}" cy="${f1(y)}" r="1.6" fill="#fffbe8"/>`}}
  return s}

/* ---------- le record du monde de Boule-de-Neige (Joffray, 02/11/2026) ----------
   La veille de l'arrivée de la bande de Balafre, Boule-de-Neige vide le jardin et roule la plus grosse boule de neige du monde :
   on le voit de dos, qui pousse ; la boule grossit d'heure en heure pendant 24 h (R.recordAt). Ensuite, à la prochaine visite, la
   bande arrive et la casse : l'histoire « La bataille de neige » commence. ?record=12 fait comme si la boule roulait depuis 12 h. */
const QREC=new URLSearchParams(location.search).get("record");
const recordWait=()=>noelOn()&&storyDone("paillette")&&!!R.res.bouleneige&&!(R.beat.balafre>0)&&(noelDay()>=NOEL_FROM.balafre-1||QREC!=null);
// ?record=vite : la boule grossit en 4 minutes au lieu de 24 h (pour tester)
// à partir du 19 (l'arrivée de la bande), le record est fini même si les 24 h ne sont pas passées (Joffray, le 19 : boule petite, pas de Balafre)
const REC0=Date.now(),recordH=()=>QREC==="vite"?(Date.now()-REC0)/1e4:QREC!=null?+QREC:noelDay()>=NOEL_FROM.balafre?24:R.recordAt?(Date.now()-R.recordAt)/36e5:0;
const recordDone=()=>recordH()>=24;
const BALL={x:250,y:Math.min(H-60,560)},bigOn=()=>!!R.recordBig&&Date.now()-(R.recordBigAt||0)<72e5,ballR=()=>bigOn()?74:R.recordGone?0:Math.round(12+40*Math.min(1,recordH()/24));
let ballEl=null;
function drawBigBall(){const r=ballR(),show=r>0&&(recordWait()||bigOn()&&noelOn());
  if(bigOn()&&!recordWait()&&R.heapAt){BALL.x=R.heapAt.x;BALL.y=R.heapAt.y} // la boule refaite reste là où était le tas
  if(!show){if(ballEl){ballEl.remove();ballEl=null}return}
  if(!ballEl){ballEl=document.createElement("button");ballEl.className="bigball";ballEl.type="button";ballEl.setAttribute("aria-label","La boule de Boule-de-Neige");
    ballEl.onpointerdown=e=>{e.stopPropagation();const f=sF("bouleneige");if(f)bubble(f,R.recordBig?"« Record du monde ! Trois mètres et quart ! »":`« Je bats le record du monde ! Elle fait déjà ${Math.round(r*4)} cm. »`)};$("actors").appendChild(ballEl)}
  ballEl.style.cssText=pc(BALL.x,BALL.y-4)+`;width:${(2*r+8)/W*100}%;z-index:${Math.round(BALL.y-8)}`; // un z-index à virgule est ignoré : Boule-de-Neige passait toujours devant
  ballEl.innerHTML=`<svg viewBox="-${r+4} -${2*r+6} ${2*r+8} ${2*r+12}" aria-hidden="true"><ellipse cy="2" rx="${r*.95}" ry="${Math.max(4,r*.16)}" fill="#9fb3cc" opacity=".45"/><circle cy="${-r}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="3"/>`
    +`<path d="M${-r*.55} ${-r*1.45} Q${-r*.2} ${-r*1.75} ${r*.2} ${-r*1.68}" fill="none" stroke="#e6eef8" stroke-width="${Math.max(3,r*.12)}" stroke-linecap="round"/>`
    +`<g class="roll" transform="rotate(${(ballSpin%360).toFixed(1)} 0 ${-r})">${[[-.45,-.6],[.3,-.4],[.5,-1.2],[-.2,-1.1],[.05,-.75],[-.6,-1.3],[.65,-.8]].map(([a,b])=>`<path d="M${a*r-4} ${b*r} q4 3 8 0" fill="none" stroke="#cfdbea" stroke-width="2" stroke-linecap="round"/>`).join("")}</g>`
    +[`M${-r*.1} ${-r*1.9} l${r*.08} ${r*.3} l${-r*.12} ${r*.22} l${r*.1} ${r*.28}`,`M${r*.5} ${-r*1.5} l${-r*.2} ${r*.16} l${r*.06} ${r*.24} l${-r*.22} ${r*.1}`].slice(0,ballCrack).map(d=>`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`).join("")+`</svg>`}
let ballSpin=0,ballCrack=0;
// Boule-de-Neige fait rouler sa boule en grand rond aplati juste devant le perron, au-dessus de la mare (03/11/2026, Joffray l'a
// dessiné sur une capture : « tout le monde regarde et personne ne sort, c'est un record du monde »). Boule-de-Neige est toujours
// derrière la boule, dans le sens où elle avance : de dos quand elle s'éloigne, de profil sur les côtés, décalée vers l'intérieur
// quand la boule revient vers nous. Le chemin : une suite de points parcourue à vitesse constante.
const ROLL={v:20};
let rollPath=null,rollKey="";
function rollLane(r){const k=String(Math.round(r/3));if(k===rollKey)return rollPath;rollKey=k;
  const cx=205,cy=328,rx=Math.min(150,192-r),ry=40,P=[];for(let i=0;i<96;i++){const a=i/96*Math.PI*2;P.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry])}
  const len=[0];for(let i=1;i<=P.length;i++){const a=P[i-1],b=P[i%P.length];len.push(len[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1]))}
  return rollPath={P,len,L:len[len.length-1],cx}}
function rollAt(d,r){const R0=rollLane(r);d=((d%R0.L)+R0.L)%R0.L;let i=1;while(R0.len[i]<d)i++;
  const a=R0.P[i-1],b=R0.P[i%R0.P.length],t=(d-R0.len[i-1])/((R0.len[i]-R0.len[i-1])||1);return {x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t}}
function rollTrack(){const r=ballR()||40,R0=rollLane(r);
  return `<path d="${R0.P.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+(p[1]-4).toFixed(1)).join("")}Z" fill="none" stroke="#e2eaf5" stroke-width="${Math.max(10,r*.5)}" stroke-linejoin="round" opacity=".9"/>`}
let rollF1=0,watchT=0;
// le record fini (le 19), la boule reste garée sur sa piste, Boule-de-Neige assise à côté, toute fière, en attendant qu'on vienne voir
function rollPark(){const r=ballR(),R0=rollLane(r),P=rollAt(R0.L/8,r);if(Math.abs(BALL.x-P.x)+Math.abs(BALL.y-P.y)>1){BALL.x=P.x;BALL.y=P.y;drawBigBall()}
  const f=sF("bouleneige");if(!f||f.walk||f.inside||f.parked===Math.round(P.x))return;f.parked=Math.round(P.x);
  f.el.classList.remove("rolling","walking","f1");f.rollPose=null;f.badge.classList.remove("off");
  place(f,{id:"record",x:Math.max(24,P.x-r-22),y:P.y+4,poses:["happy"]});f.until=Date.now()+9e8;f.el.classList.remove("left")}
function rollTick(){if(ballEl&&gardenCleared()&&recordDone()){rollPark();return}
  if(!ballEl||!gardenCleared()||recordDone())return;const f=sF("bouleneige"),r=ballR(),L=rollLane(r),d=Date.now()/1000*ROLL.v;
  const P=rollAt(d,r),Q=rollAt(d+3,r),bx=P.x,by=P.y;ballSpin+=Math.hypot(bx-BALL.x,by-BALL.y)/Math.max(8,r)*57;BALL.x=bx;BALL.y=by;drawBigBall();
  // les spectateurs suivent la boule des yeux
  if(Date.now()>watchT){watchT=Date.now()+900;watchAll();for(const w of foxes)if(w.watch&&!w.walk&&w.spot&&WATCH.includes(w.spot)){if(w.spot.back&&w.pose!=="back"){w.pose="back";draw(w)}w.el.classList.toggle("left",BALL.x<w.x)}} // un nouveau venu s'installe aussi
  if(!f||f.walk||f.inside)return;
  // sens de la marche, et l'extérieur du rond
  let dx=Q.x-P.x,dy=(Q.y-P.y)*1.6;const n=Math.hypot(dx,dy)||1;dx/=n;dy/=n;const ox=Math.sign(bx-L.cx);
  const toward=dy>.55,away=dy<-.45; // vers nous : elle passe derrière la boule, décalée vers l'intérieur
  const fx=Math.max(24,Math.min(376,bx-dx*(r+13)-(toward?ox*(r*.95+16)*(1-Math.abs(dx)):0))),fy=by-dy*(r*.32+8)+(away?4:0);
  f.x=fx;f.y=fy;moveBadge(f,0);f.badge.classList.toggle("off",toward&&Math.abs(fx-bx)<r*.8); // son signe ne flotte pas sur la boule
  f.el.style.transitionDuration="0s";f.el.style.left=fx/W*100+"%";f.el.style.top=fy/H*100+"%";
  f.el.style.zIndex=Math.round(toward?by-20:by+4);
  const pose=away?"back":"walk",left=dx<0;
  if(f.rollPose!==pose||f.el.classList.contains("left")!==left){f.rollPose=pose;const art=FOX.bouleneige;f.el.classList.add("rolling","walking");f.el.classList.toggle("left",left);
    f.el.innerHTML=pose==="back"?`<div class="flip"><div class="bob">${foxArt(art,{pose:"back"})}</div></div>`
      :`<div class="flip"><div class="bob"><div class="w0">${foxArt(art,{pose:"walk",frame:0})}</div><div class="w1">${foxArt(art,{pose:"walk",frame:1})}</div></div></div>`}
  const k=Math.floor(Date.now()/340)%2;if(k!==rollF1){rollF1=k;f.el.classList.toggle("f1",!!k)}}
setInterval(rollTick,80);
// les places des spectateurs : le porche, les lanternes, et une rangée devant la maison, hors du rond
const WATCH=[...[[136,238],[164,236],[238,236],[266,238]].map(([x,y])=>({x,y,poses:["sit","up","happy"]})),
  ...[[230,418],[282,424],[334,416],[372,446],[206,466],[258,470],[312,468],[360,492]].map(([x,y])=>({x,y,poses:["back"],back:1}))].map((s,i)=>({id:"w"+i,...s}));
// le record : tout le monde s'installe pour regarder et ne bouge plus (on ne dérange pas un record du monde)
function watchAll(now){const sp=WATCH; // now : on arrive dans la clairière, chacun est déjà à sa place (personne ne traverse le chemin)
  for(const f of foxes){if(f.wild||f.id==="bouleneige"||isHidden(f.id)||f.watch)continue;const to=sp.find(s=>!foxes.some(o=>o!==f&&o.watch&&(o.spot===s||(o.walk&&o.walk.to===s))));if(!to)continue;
    f.watch=1;if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y}if(now){f.walk=null;place(f,to)}else goTo(f,to);f.until=Date.now()+9e8}}
// la bande arrive : tout le monde sort pour défendre Boule-de-Neige
function defendAll(bx,by){const ids=foxes.filter(f=>!f.wild&&!["bouleneige","balafre","filou","radar"].includes(f.id)&&!f.inside).map(f=>f.id);
  ids.forEach((id,i)=>{const f=sF(id);f.watch=0;f.shock=1;const k=ids.length>1?i/(ids.length-1):.5,x=Math.max(30,Math.min(370,bx-150+k*300)),y=Math.min(H-60,by+40+(i%2)*26);
    setTimeout(()=>{actGo(id,x,y,"up");setTimeout(()=>actEmote(id,i%3?"colere":"!",1800),900+i*60)},i*90);
    // puis, la boule cassée, ils restent figés sur place, sous le choc, jusqu'à la fin de la bataille (shock, life.js)
    setTimeout(()=>{const g=sF(id);if(g&&!g.walk){g.pose="sit";g.expr=i%2?"surprise":"sad";draw(g);actEmote(id,i%2?"!":"goutte",2000)}},5200+i*120)});
  meGo(meBeside(bx,by+20),["up"],20000)}
// la bande attaque la boule : deux boules la fissurent, celle de Balafre la fend, puis une volée sur Boule-de-Neige
function bandeAttack(){const bx=BALL.x,by=BALL.y,X=()=>({x:bx,y:by-ballR()});
  actThrow("filou",X(),{hurt:false,then:crackBall});setTimeout(()=>actThrow("radar",X(),{hurt:false,then:crackBall}),600);
  setTimeout(()=>{actEmote("balafre","colere");actThrow("balafre",X(),{hurt:false,arc:110,ms:760,then:breakBall})},1200);
  [2200,2550,2900,3250].forEach((t,i)=>setTimeout(()=>actThrow(["filou","radar","balafre","filou"][i],"bouleneige",{ms:520}),t));
  setTimeout(()=>{gardenSync();actPose("bouleneige","lie","sad",30000);actEmote("bouleneige","goutte");["filou","radar"].forEach(id=>actTrick(id,"boing"))},3900)}
// la musique de la clairière : le thème de la bande, de son arrivée jusqu'à la fin des trois défis (music.js)
let bandeOn=0;
const clMusic=()=>noelOn()&&!storyDone("balafre")&&(bandeOn&&!(R.beat.balafre>0)||R.beat.balafre>=1&&R.beat.balafre<=3)?"bande":"foret";
setInterval(()=>{try{if(!gameOn&&!document.querySelector(".bgift")&&["foret","bande",null].includes(MUSIC.current))MUSIC.want(clMusic())}catch(e){}},1500);
// le jardin vidé pour le record : objets et déco rangés le temps de rouler la boule
const gardenCleared=()=>recordWait()&&!R.recordGone,gardenHid=[];let gardenWas=null,storedWas=false;
// les objets et la déco restent rangés du record jusqu'au départ de la boule géante refaite (Joffray : « une fois que la boule est
// partie, remets les objets comme ils étaient ») ; ils n'ont pas bougé de R.obj / R.deco, ils reviennent à leur place
const gardenStored=()=>noelOn()&&(gardenCleared()||((R.recordGone||R.beat.balafre>0)&&!storyDone("balafre"))||bigOn());
function gardenSync(){const on=gardenCleared(),st=gardenStored();$("scene").classList.toggle("cleared",on);$("scene").classList.toggle("stored",st);
  if(st&&!storedWas){for(let i=SPOTS.length-1;i>=0;i--)if(SPOTS[i].obj||SPOTS[i].deco){delete SPOT[SPOTS[i].id];SPOTS.splice(i,1)}
    for(const f of foxes)if(f.spot&&(f.spot.obj||f.spot.deco)&&!SPOTS.includes(f.spot)){const fs=SPOTS.filter(x=>!taken(x)&&!x.lamp&&!x.bowl);f.walk=null;place(f,fs[Math.floor(Math.random()*fs.length)]||SPOT.g3)}}
  if(!st&&storedWas){addObjSpots();decoSpots();drawDeco();drawObjs()}
  storedWas=st;
  if(on&&!gardenWas){for(let i=SPOTS.length-1;i>=0;i--){gardenHid.push(SPOTS[i]);SPOTS.splice(i,1)}
    SPOTS.push(...WATCH);watchAll(1)}
  else if(!on&&gardenWas){for(let i=SPOTS.length-1;i>=0;i--)if(WATCH.includes(SPOTS[i]))SPOTS.splice(i,1);
    for(const sp of gardenHid.splice(0))SPOTS.push(sp);
    for(const f of foxes)if(f.watch){f.watch=0;f.until=0}}
  if(gardenWas!==null&&gardenWas!==on)drawBg();gardenWas=on;
  // Boule-de-Neige pousse sa boule, de dos
  const f=sF("bouleneige");if(on&&f){if(f.inside){f.inside=false;f.el.classList.remove("inside")}f.walk=null;place(f,{id:"record",x:BALL.x,y:BALL.y+10,z:BALL.y+20,poses:["back"]});f.until=Date.now()+9e8;f.el.classList.add("pushing");f.badge.classList.add("off")}
  else if(f&&f.el.classList.contains("pushing")){f.el.classList.remove("pushing","rolling","walking","f1");f.rollPose=null;f.badge.classList.remove("off");f.until=0;draw(f)} // il peut repartir
  drawBigBall()}
setInterval(()=>{if(gardenStored()!==storedWas||gardenCleared()!==!!gardenWas)gardenSync()},20000); // la boule géante partie : les objets reviennent
// la boule cassée par la bande, mais le dialogue pas fini (le jeu fermé entre-temps) : elle revient, et la scène se rejoue
if(R.recordGone&&!(R.beat.balafre>0)){R.recordGone=0;save()}
setTimeout(()=>drawHeap(),0); // le tas de neige, s'il reste
if(recordWait()&&!R.recordAt){R.recordAt=Date.now();save()}
// les trois sauvages arrivent en courant d'un côté de la clairière, jusqu'à un point
function actArrive(id,x,y){if(!R.res[id]){R.res[id]={at:Date.now(),h:0,pet:""};save()}let f=sF(id);
  if(!f){f=makeFox(id,null);f.x=x<200?-30:430;f.y=y;f.el.style.cssText+=";"+pc(f.x,f.y)}
  if(f.inside){f.inside=false;f.el.classList.remove("inside")}
  setTimeout(()=>{goTo(f,{id:"act-"+id,x,y,poses:["sit"]});f.until=Date.now()+30000},40)}
// la boule éclate en morceaux
function crackBall(){if(!ballEl)return;ballCrack++;drawBigBall();ballEl.animate([{transform:"translate(-50%,-100%) rotate(0)"},{transform:"translate(-52%,-100%) rotate(-3deg)"},{transform:"translate(-48%,-100%) rotate(3deg)"},{transform:"translate(-50%,-100%) rotate(0)"}],{duration:300});try{MUSIC.sfx("knock")}catch(e){}}
// la casse (03/11/2026, Joffray n'aimait pas les morceaux qui volaient) : la boule se fend en deux, les moitiés basculent de chaque
// côté dans un nuage de poudreuse, puis s'affaissent en un gros tas de neige qui reste là jusqu'à ce qu'on la refasse (drawHeap)
function breakBall(){if(!ballEl)return;const r=ballR(),x=BALL.x,y=BALL.y,u=$("scene").clientWidth/W;R.recordGone=1;R.heapAt={x:Math.round(x),y:Math.round(y),r};save();
  try{MUSIC.sfx("splash");setTimeout(()=>MUSIC.sfx("lose"),350)}catch(e){}
  const half=side=>{const h=document.createElement("div");h.className="bhalf";h.style.cssText=pc(x,y)+`;width:${(2*r+8)/W*100}%;z-index:${Math.round(y)}`;
    h.innerHTML=`<svg viewBox="-${r+4} -${2*r+6} ${2*r+8} ${2*r+12}" aria-hidden="true"><path d="M0 ${-2*r} A${r} ${r} 0 0 ${side<0?0:1} 0 0 L${side*r*.08} ${-r*1.4} L${-side*r*.1} ${-r*.9} L${side*r*.06} ${-r*.45}Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></svg>`;
    $("scene").appendChild(h);
    h.animate([{transform:"translate(-50%,-100%) rotate(0)"},{transform:`translate(calc(-50% + ${side*r*.25*u}px),-100%) rotate(${side*14}deg)`,offset:.35},
      {transform:`translate(calc(-50% + ${side*r*.55*u}px),calc(-100% + ${r*.5*u}px)) rotate(${side*58}deg) scaleY(.7)`,opacity:1,offset:.75},
      {transform:`translate(calc(-50% + ${side*r*.6*u}px),calc(-100% + ${r*.9*u}px)) rotate(${side*70}deg) scaleY(.35)`,opacity:0}],{duration:1300,easing:"cubic-bezier(.5,0,.8,.6)",fill:"forwards"}).onfinish=()=>h.remove()};
  half(-1);half(1);ballEl.remove();ballEl=null;
  // le nuage de poudreuse
  const cl=document.createElement("div");cl.className="bpoof";cl.style.cssText=pc(x,y-r*.6)+`;width:${(r*3.4)/W*100}%`;$("scene").appendChild(cl);setTimeout(()=>cl.remove(),1700);
  for(let i=0;i<16;i++){const a=-Math.PI*Math.random(),d=r*(.5+Math.random()*1.1),f=document.createElement("i");f.className="bflake";
    f.style.cssText=pc(x+(Math.random()-.5)*r,y-r*(.4+Math.random()*.9))+`;--dx:${(Math.cos(a)*d*u).toFixed(0)}px;--dy:${(Math.sin(a)*d*.6*u).toFixed(0)}px;--fy:${(r*.5*u).toFixed(0)}px;animation-delay:${(Math.random()*.25).toFixed(2)}s`;
    $("scene").appendChild(f);setTimeout(()=>f.remove(),1900)}
  setTimeout(()=>drawHeap(true),650)}
// le tas de neige qui reste après la casse
let heapEl=null;
// la boule géante refaite et le tas de neige sont des obstacles : les renards en font le tour (life.js)
function noelObst(){const L=[];if(bigOn()&&noelOn()&&!recordWait())L.push({x:BALL.x,y:BALL.y-8,rx:74+16,ry:30});
  if(heapEl&&R.heapAt)L.push({x:R.heapAt.x,y:R.heapAt.y-6,rx:R.heapAt.r*1.25+14,ry:24});return L.concat(sleighObst())}
function drawHeap(grow){const h=R.heapAt,show=noelOn()&&R.recordGone&&!R.recordBig&&!!h;
  if(!show){if(heapEl){heapEl.remove();heapEl=null}return}
  if(!heapEl){heapEl=document.createElement("div");heapEl.className="sheap";$("actors").appendChild(heapEl)}
  const r=h.r;heapEl.style.cssText=pc(h.x,h.y+2)+`;width:${(r*2.6)/W*100}%;z-index:${h.y-6}`;
  heapEl.innerHTML=`<svg viewBox="${-r*1.3} ${-r*.95} ${r*2.6} ${r*1.05}" aria-hidden="true"><ellipse cy="0" rx="${r*1.25}" ry="${r*.16}" fill="#9fb3cc" opacity=".4"/>
    <path d="M${-r*1.22} 0 Q${-r*1.1} ${-r*.42} ${-r*.7} ${-r*.5} Q${-r*.55} ${-r*.9} ${-r*.1} ${-r*.78} Q${r*.25} ${-r*.95} ${r*.5} ${-r*.62} Q${r*1.05} ${-r*.6} ${r*1.2} 0Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M${-r*.6} ${-r*.42} q${r*.15} ${-r*.12} ${r*.3} 0 M${r*.15} ${-r*.55} q${r*.15} ${-r*.1} ${r*.28} 0 M${-r*.2} ${-r*.2} q${r*.12} ${-r*.08} ${r*.24} 0" fill="none" stroke="#cfdbea" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="${-r*.95}" cy="${-r*.1}" r="${r*.13}" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="${r*.98}" cy="${-r*.08}" r="${r*.1}" fill="#fff" stroke="${INK}" stroke-width="2"/></svg>`;
  if(grow)heapEl.animate([{transform:"translate(-50%,-100%) scale(.4,.1)",opacity:.3},{transform:"translate(-50%,-100%) scale(1.06,1.1)",opacity:1,offset:.7},{transform:"translate(-50%,-100%) scale(1)"}],{duration:700,easing:"ease-out"})}

/* ---------- la neige qui tombe : un peu tout le temps, beaucoup quand il « pleut » ---------- */
const snowEl=document.createElementNS("http://www.w3.org/2000/svg","svg");snowEl.setAttribute("class","layer");snowEl.id="snow";snowEl.setAttribute("viewBox",`0 0 400 ${H}`);snowEl.setAttribute("preserveAspectRatio","xMidYMid slice");snowEl.setAttribute("aria-hidden","true");
let snowN=-1;
function drawSnow(){const n=noelOn()?(scn.rain?90:28):0;if(n===snowN)return;snowN=n;const r=rng(3);let s="";
  for(let i=0;i<n;i++){const big=i%7===0;s+=`<circle class="flake" style="animation-duration:${f1(big?4+r()*2:6+r()*6)}s;animation-delay:${f1(-r()*12)}s" cx="${f1(r()*420-10)}" cy="${f1(-r()*30)}" r="${f1(big?2.8+r()*1.4:1+r()*1.4)}" fill="#fff" opacity="${big?.75:.95}"/>`}
  snowEl.innerHTML=s}
if(noelOn())$("scene").insertBefore(snowEl,$("phase"));

// les invités de Noël repartent dans le Nord après le 6 janvier (ils reviendront l'hiver suivant)
// Boule-de-Neige (son rôle, 02/11/2026) : il vient au refuge dès que Noël commence (après la graine de Grelot) et propose
// chaque jour une bataille de boules de neige ; +3 sucres d'orge la première victoire du jour
if(noelOn()&&storyDone("grelot")&&!R.res.bouleneige){R.res.bouleneige={at:Date.now(),h:0,pet:""};save()}
function snowballTap(f){if(f.id!=="bouleneige"||!noelOn()||gameOn)return false;
  if(gardenCleared()){bubble(f,`pousse sa boule : « Record du monde ! Encore ${Math.max(1,Math.ceil(24-recordH()))} h et elle sera géante ! »`);return true}const done=R.snowDay===today();
  talk(done?[["bouleneige","joy","Encore une bataille ? Pour le plaisir, alors ! (Les sucres d'orge, c'est une fois par jour.)"]]
    :[["bouleneige","joy",`${ME()} ! Une bataille de boules de neige ? Touche ceux qui sortent la tête… mais pas moi, je suis fait de neige !`],["me","joy","C'est parti !"]],
    ()=>playGame({k:"snowball",n:10},()=>{if(R.snowDay!==today()){R.snowDay=today();const b=bourse();b.sucres=(b.sucres||0)+3;putBourse(b);save();toast("Bataille gagnée ! +3 sucres d'orge")}else toast("Bien joué !")}));
  return true}
const noelAway=id=>FOX[id]&&(FOX[id].event==="noel"||NOEL_WILD.includes(id)&&!!INC[id]&&!(STORIES[id]&&storyDone(id)))&&!noelOn(); // Filou et Radar restent une fois leur histoire finie (incos.js)
// les frileux retournent dans la forêt après Noël : ils redeviennent des inconnus de la gamelle
if(!noelOn()&&[...NOEL_WILD,"miette","pataud","frisette"].some(id=>R.res[id])){for(const id of [...NOEL_WILD,"miette","pataud","frisette"])delete R.res[id];save()}
