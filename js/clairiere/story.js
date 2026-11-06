/* La Clairière : les histoires. Voir docs/clairiere-v2.md, « Les histoires ».
   Une seule histoire à la fois, dans l'ordre d'ORDER. Le renard arrive pour son histoire (ou elle démarre s'il est déjà là),
   de plus en plus tard après la fin de la précédente (storyGap : 30 min, 1 h, 2 h, 3 h… jusqu'à 15 h). Une histoire est une suite de moments : un renard ou un endroit
   porte un signe, on le touche, le dialogue se joue, et le moment suivant s'ouvre aussitôt. Ni amitié, ni météo, ni attente.
   R.beat[id] = moments finis ; R.souv[id] = souvenir reçu ; R.nextAt = quand la prochaine histoire peut commencer ;
   R.who[id][i] = le renard touché pour un moment « * » (pour relire l'histoire).
   at : un renard, "@endroit" (TG) ou "*" (n'importe quel autre renard du refuge). goal : ce qu'il faut faire pour ce moment.
   "me" parle : c'est Roussette, avec le nom choisi au Café. */
// un renard par jour (décidé avec Joffray le 26/10/2026) : le suivant arrive au matin (6 h), au moins 6 h après la fin ;
// les deux premières histoires s'enchaînent pour accrocher ; ?vite=1 pour tester sans attendre
const VITE=/[?&]vite=1/.test(location.search);
// une histoire toutes les 6 h (Joffray, 27/10/2026 : un renard par jour, « on va jamais s'en sortir ») ;
// les parties qui attendaient le lendemain matin n'attendent pas plus de 6 h
// l'attente avant le renard suivant monte petit à petit (29/10/2026, Joffray : « en crescendo », sinon ça va trop vite) :
// 30 min après Mitaine, puis 1 h, 2 h, 3 h… jusqu'à 10 h ; enfin 12 h, et 15 h avant Gribouille, le dernier (environ 8 jours en tout)
function storyGap(){const n=ORDER.filter(storyDone).length,G=[0,0,.5,1,2,3],last=ORDER.length-1;
  const h=n<G.length?G[n]:n>=last?15:n===last-1?12:Math.min(10,3+(n-5)*7/(last-7));return Math.round(h*2)/2*36e5}
function nextMorning(){return Date.now()+storyGap()}
if(VITE)R.nextAt=0;
// une scène sous la pluie (rain:1 dans un moment ; la fin de Pain d'épice et Brioche, Joffray : « il faut absolument qu'il pleuve ») :
// il pleut pendant le moment et encore 3 min après ; les renards de stay restent où ils sont, même sous la pluie
let rainTill=0,stayIds=[],stayTill=0;
function storyRain(){const c=cur();return !!(c&&c.b.rain)||Date.now()<rainTill}
function storyStay(id){const c=cur();return !!(c&&c.b.stay&&c.b.stay.includes(id))||(Date.now()<stayTill&&stayIds.includes(id))}
function syncRain(){const r=rainNow();if(r!==scn.rain){scn.rain=r;rainChanged()}else drawGlow()}
const storyPeek=()=>storyRain()&&scn.rain;
const TG={pond:{x:96,y:418,name:"la mare"},porch:{x:200,y:226,name:"le porche"},lampL:{x:60,y:214,name:"les lanternes"},stump:{x:85,y:288,name:"la souche"},
  leaves:{x:322,y:334,name:"le tas de feuilles"},tree:{x:366,y:150,name:"le grand arbre"},bench:{x:300,y:398,name:"le banc"}};
// Gribouille vient en dernier : son histoire réunit tout le monde pour le grand portrait. Les nouvelles histoires se glissent avant lui.
// Copeau et Sésame (la maison) avancés juste après Biscuit le 29/10/2026 : Joffray trouvait l'intérieur trop long à débloquer
// Copeau a déjà réparé le patin du traîneau à Noël (3e moment de l'histoire de Barbe-Neige, noel.js)
const copeauNoel=()=>(R.beat.barbeneige||0)>=3;
const ORDER=["petitpois","mitaine","luciole","gaston","galette","pantoufle","grignote","brindille","plouf","biscuit","copeau","sesame","cannelle","charbon","brume","moka","painepice","libellule","brioche","marquis","zaza","flocon","noisette","givre","comete","somnus","reglisse","aurore","maree","perle","yeti","gribouille"];
// game : petit jeu avant le dialogue (games.js) ; after : renards qui se déplacent une fois le moment fini ;
// hide : le renard de l'histoire reste caché dans la maison pendant ce moment ; peu de texte, ça doit bouger
const STORIES={
  petitpois:{title:"Peur du noir",souv:"le gland porte-bonheur",beats:[
    {at:"petitpois",goal:"Petit Pois a quelque chose à te dire.",lines:[
      ["petitpois","shy",`${ME()}… le noir, je déteste. Ça fait crac. Hou-hou.`,()=>{actPose("petitpois","lie","shy");actEmote("petitpois","goutte")}],
      ["petitpois","open","Tu crois qu'il existe quelqu'un qui n'a jamais peur ?",()=>{actPose("petitpois","sit","open");actEmote("petitpois","?")}],
      ["me","open","Quelqu'un qui brille, peut-être… Je vais voir aux lanternes.",()=>{actEmote("me","!");setTimeout(()=>actGo("me",96,290),900)}]]},
    {at:"@lampL",arrive:"luciole",game:{k:"firefly",say:"Plein de lucioles ! Mais une seule brille en or… Attrape-la !",win:"Attrapée ! … Hein ? Elle est toute chaude."},goal:"Cherche quelqu'un qui brille, près des lanternes.",lines:[
      ["luciole","surprise","Aïe ! Doucement, c'est ma queue que tu tiens !",()=>{actTrick("luciole","boing");actEmote("me","goutte")}],
      ["luciole","joy","Moi, c'est Luciole. Ma queue brille en or, et les lucioles de toutes les couleurs me suivent partout.",()=>{actPose("luciole","happy","joy");actEmote("luciole","note")}],
      ["me","joy","Viens vite, quelqu'un doit absolument te rencontrer.",()=>{actNear("me","petitpois");setTimeout(()=>actNear("luciole","petitpois","happy"),400)}]]},
    {at:"petitpois",after:[["petitpois","lampR"]],goal:"Présente Luciole à Petit Pois.",lines:[
      ["petitpois","surprise","Ta queue… elle fait de la lumière ?!",()=>{actTrick("petitpois","boing");actEmote("petitpois","!")}],
      ["luciole","joy","Viens, Petit Pois. Je vais t'apprendre à allumer les lanternes.",()=>{actGo("luciole",310,290,"up");actEmote("luciole","note")}]]},
    {at:"luciole",lamps:1,goal:"Va voir Luciole et Petit Pois aux lanternes.",lines:[
      ["petitpois","joy","J'ai allumé la grande lanterne ! Du premier coup !",()=>actTrick("petitpois","salto")],
      ["petitpois","open","En fait, le noir, c'est juste le moment où les lanternes sont jolies.",()=>{actPose("petitpois","sit","joy");actEmote("petitpois","coeur")}],
      ["petitpois","shy","Tiens, mon gland porte-bonheur. Et maintenant, je peux t'aider au Café !",()=>actGive("petitpois","me","gland")]]}
  ]},
  mitaine:{title:"La moufle perdue",souv:"la moufle au flocon",beats:[
    {at:"mitaine",goal:"Mitaine vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["mitaine","sad",`${ME()} ! Tu n'as pas vu ma moufle ? Rouge, avec un flocon brodé.`,()=>{actPose("mitaine","sit","sad");actEmote("mitaine","?")}],
      ["mitaine","shy","C'est ma grand-mère qui l'a tricotée. Elle a peut-être roulé dans les feuilles…",()=>{actEmote("mitaine","goutte");actEmote("me","!")}]]},
    {at:"@leaves",game:{k:"search",item:"wool",say:"Fouille le tas de feuilles !",win:"Un fil de laine rouge !"},goal:"Cherche la moufle dans le tas de feuilles.",lines:[
      ["me","surprise","Le fil file tout droit vers le porche… et passe sous Petit Pois.",()=>{actEmote("me","?");setTimeout(()=>{actNear("me","petitpois");actNear("mitaine","petitpois")},700)}]]},
    {at:"petitpois",sleep:1,goal:"Réveille Petit Pois, tout doucement.",lines:[
      ["petitpois","shy","Euh… Mitaine ? Je crois que je dors dedans depuis une semaine.",()=>{actPose("petitpois","sit","shy");actEmote("petitpois","goutte")}],
      ["mitaine","joy","Garde-la, va. Elle te va mieux qu'à ma patte.",()=>{actTrick("mitaine","roll");actEmote("petitpois","coeur")}],
      ["mitaine","open",`Et toi, ${ME()}, prends l'autre. Comme ça, on en a chacun une.`,()=>actGive("mitaine","me","moufle")]]}
  ]},
  luciole:{title:"Une lumière de plus",souv:"le bocal de lumière",beats:[
    {at:"luciole",goal:"Luciole a une idée.",lines:[
      ["luciole","open","Six lanternes, et on est de plus en plus nombreux. Il en faut une de plus !",()=>{actTrick("luciole","toupie");actEmote("luciole","!")}],
      ["luciole","shy","Un vieux bocal est coincé dans le grand arbre. Tu peux le décrocher ?",()=>{actEmote("me","?");setTimeout(()=>actGo("me",330,300),800)}]]},
    {at:"@tree",game:{k:"shake",item:"jar",catch:1,say:"Secoue le grand arbre !",win:"Rattrapé au vol ! Pas une fissure."},goal:"Fais tomber le bocal du grand arbre.",lines:[
      ["me","joy","Pas une fissure. Il n'attend plus que sa lumière.",()=>actTrick("me","boing")]]},
    {at:"luciole",lamps:1,goal:"Apporte le bocal à Luciole.",lines:[
      ["luciole","surprise","Attends, je souffle dedans…",()=>{actGive("me","luciole","jar",{happy:false});actPose("luciole","up","surprise")}],
      ["luciole","joy","Voilà : une lumière qui ne s'éteint jamais, même quand je dors. Elle est pour toi.",()=>{actTrick("luciole","salto");setTimeout(()=>actGive("luciole","me","jar"),1100)}]]}
  ]},
  gaston:{title:"Le poisson de la mare",souv:"la vieille canne de Gaston",beats:[
    {at:"gaston",after:[["gaston","pond"]],goal:"Gaston veut te demander quelque chose.",lines:[
      ["gaston","sad",`${ME()}, je pêche depuis toujours. Jamais rien attrapé. Rien de rien.`,()=>{actPose("gaston","lie","sad");actEmote("gaston","goutte")}],
      ["gaston","open","Il paraît qu'un poisson vit dans ta mare. Tu essaies ? Moi, je porte malheur.",()=>{actPose("gaston","sit","open");actEmote("me","!")}]]},
    {at:"@pond",game:{k:"fish",say:"Touche l'eau dès que le bouchon plonge !",win:"Un poisson !"},goal:"Pêche dans la mare avec Gaston.",lines:[
      ["gaston","surprise","Tu l'as eu ! Un vrai poisson, tout orange !",()=>{actTrick("gaston","salto");actEmote("me","!")}],
      ["gaston","sad","Il nous regarde avec de si grands yeux… On le remet à l'eau ?",()=>{actPose("gaston","sit","sad");setTimeout(()=>actGive("me",{x:104,y:418},"fish",{arc:50}),600)}],
      ["gaston","joy","Au fond, ce que j'aime, c'est attendre au bord de l'eau avec quelqu'un.",()=>{actNear("me","gaston");actEmote("gaston","coeur")}],
      ["gaston","open","Tiens, ma vieille canne. Pêche quand tu veux : un poisson de temps en temps, et beaucoup de vieilles bottes !",()=>actGive("gaston","me","canne")]]}
  ]},
  galette:{title:"Le record de ricochets",souv:"le caillou plat porte-bonheur",beats:[
    {at:"galette",after:[["galette","pond"]],goal:"Galette vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["galette","joy",`Salut ${ME()} ! Trois rebonds : c'est mon record de ricochets. Personne ne l'a jamais battu.`,()=>actTrick("galette","boing")],
      ["galette","open","Ta mare a l'air parfaite. Tu relèves le défi ?",()=>{actEmote("galette","?");setTimeout(()=>actEmote("me","!"),700)}]]},
    {at:"@pond",game:{k:"ricochet",need:4},goal:"Bats le record de Galette à la mare.",lines:[
      ["galette","surprise","Quatre rebonds d'affilée ?! Tu as battu mon record !",()=>{actPose("galette","sit","surprise");actEmote("galette","!");actTrick("me","salto")}],
      ["galette","joy","Tiens, mon caillou plat porte-bonheur. Il te revient. Mais je veux ma revanche !",()=>{actGive("galette","me","pebble");setTimeout(()=>actTrick("galette","zoom"),1200)}]]}
  ]},
  pantoufle:{title:"Le renard du dedans",souv:"la pantoufle en laine",beats:[
    {at:"@porch",hide:1,goal:"Quelqu'un s'est glissé dans ta maison. Va voir à la porte.",lines:[
      ["pantoufle","shy","Chut ! Je ne suis pas là."],
      ["me","open","Pantoufle ? Tu ne veux pas sortir un peu ?",()=>actEmote("me","?")],
      ["pantoufle","sad","Dehors, il y a du vent, des feuilles, des gens. Ici, il y a un coussin."],
      ["me","joy","Des coussins ? J'ai un jeu pour toi. Je les pose sur le porche…",()=>actEmote("me","note")]]},
    {at:"@porch",hide:1,game:{k:"cushion",who:"pantoufle",win:"Trouvé trois fois ! Et… vous êtes dehors !"},after:[["pantoufle","p2"]],goal:"Propose un jeu des coussins à Pantoufle, devant la porte.",lines:[
      ["pantoufle","joy","Hi hi ! Le jeu des coussins, c'est mon préféré !"],
      ["pantoufle","surprise","Oh… Je suis dehors. Je ne m'en suis même pas rendu compte.",()=>{actEmote("pantoufle","!");actTrick("me","boing")}]]},
    {at:"pantoufle",goal:"Va voir Pantoufle sous le porche.",lines:[
      ["pantoufle","open","Dehors, ce n'est pas si mal. Surtout sous le porche.",()=>{actPose("pantoufle","lie","joy");actEmote("pantoufle","coeur")}],
      ["pantoufle","shy","Tiens, ma pantoufle en laine. J'en ai une autre… quelque part dedans.",()=>actGive("pantoufle","me","pantoufle")]]}
  ]},
  grignote:{title:"Les pages envolées",souv:"la dernière page",beats:[
    {at:"grignote",goal:"Grignote vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["grignote","sad","J'avais un livre magnifique. J'ai lu une page… puis je l'ai mangée. Puis une autre.",()=>{actPose("grignote","sit","sad");actEmote("grignote","goutte")}],
      ["grignote","shy","Il me restait la fin, mais le vent l'a emportée vers le banc ! Tu m'aides ?",()=>{actEmote("me","!");setTimeout(()=>actGo("me",260,420),800)}]]},
    {at:"@bench",game:{k:"catch",thing:"page",n:6,say:"Attrape les pages avant que le vent les emporte !"},goal:"Rattrape les pages de Grignote, près du banc.",lines:[
      ["me","joy","Six pages, un peu froissées… et la fin de l'histoire !",()=>actTrick("me","boing")]]},
    {at:"grignote",goal:"Rapporte les pages à Grignote.",lines:[
      ["grignote","surprise","La fin ! … Le petit renard rentre chez lui, et tout le monde l'attend. Comme ici.",()=>{actGive("me","grignote","page",{happy:false});actPose("grignote","sit","surprise");setTimeout(()=>actEmote("grignote","coeur"),900)}],
      ["grignote","shy","Celle-là, je ne la mangerai pas. Garde-la pour moi ?",()=>actGive("grignote","me","page")]]}
  ]},
  brindille:{title:"Les chaussettes dépareillées",souv:"les chaussettes au gland brodé",beats:[
    {at:"brindille",goal:"Mamie Brindille vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["brindille","joy",`Bonjour, ma petite pelote. J'ai tricoté des chaussettes pour tout le refuge.`,()=>{actPose("brindille","happy","joy");actEmote("brindille","coeur")}],
      ["brindille","sad","Je les avais mises à sécher près du banc, et le vent les a toutes mélangées. À mon âge, je n'y vois plus très clair.",()=>{actPose("brindille","sit","sad");actEmote("brindille","?")}]]},
    {at:"@bench",game:{k:"memory",win:"Toutes les paires !"},goal:"Refais les paires de chaussettes près du banc.",lines:[
      ["me","joy","Six paires, bien rangées ! Le vent n'a qu'à bien se tenir.",()=>actTrick("me","toupie")]]},
    {at:"brindille",goal:"Rapporte les chaussettes à Mamie Brindille.",lines:[
      ["brindille","joy","Toutes en paires ! Merci, ma petite pelote.",()=>actGive("me","brindille","chaussette")],
      ["brindille","open","Tiens, celles avec un gland brodé sont pour toi. Les autres, je les donnerai cet hiver : je suis la doyenne, pas la plus pressée.",()=>actGive("brindille","me","chaussette")]]}
  ]},
  plouf:{title:"La danse des flaques",souv:"les petites bottes de pluie",beats:[
    {at:"plouf",goal:"Plouf vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["plouf","joy",`${ME()} ! Tu connais la danse des flaques ? Je saute, tu répètes !`,()=>{actTrick("plouf","boing");setTimeout(()=>actTrick("me","boing"),1200)}],
      ["plouf","open","Pas de pluie ? Pas grave, je viens d'en faire avec l'arrosoir.",()=>actEmote("plouf","note")]]},
    {at:"plouf",game:{k:"simon",who:"plouf",rounds:[3,4,5,6,7]},goal:"Danse dans les flaques avec Plouf.",lines:[
      ["plouf","joy","Regarde-nous : deux éponges ! C'est le plus beau des compliments.",()=>{actTrick("plouf","toupie");actTrick("me","toupie");actEmote("me","goutte")}],
      ["plouf","shy","Tiens, mes petites bottes de pluie. Moi, je préfère les pattes mouillées.",()=>actGive("plouf","me","boot")]]}
  ]},
  biscuit:{title:"La tarte aux pommes",souv:"la première part de tarte",beats:[
    {at:"biscuit",goal:"Biscuit vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["biscuit","joy",`${ME()} ! Je veux faire une tarte aux pommes pour tout le refuge.`,()=>{actTrick("biscuit","boing");actEmote("biscuit","coeur")}],
      ["biscuit","open","Le grand arbre en est plein. Je secoue, tu rattrapes ?",()=>{actEmote("me","!");setTimeout(()=>actGo("me",330,300),800)}]]},
    {at:"@tree",game:{k:"basket",n:8,win:"Huit belles pommes !"},goal:"Rattrape les pommes sous le grand arbre.",lines:[
      ["me","joy","Huit pommes, pas une seule véreuse !",()=>actTrick("me","salto")]]},
    {at:"biscuit",goal:"Apporte les pommes à Biscuit.",lines:[
      ["biscuit","joy","Un peu de beurre, un peu de sucre… et hop, au four !",()=>{actGive("me","biscuit","pomme",{happy:false});setTimeout(()=>{actTrick("biscuit","toupie");actEmote("biscuit","note")},800)}],
      ["biscuit","shy","Tiens, la première part. C'est toujours la meilleure.",()=>actGive("biscuit","me","tarte")]]}
  ]},
  cannelle:{title:"Le lit de feuilles",souv:"la feuille d'érable dorée",beats:[
    {at:"cannelle",sleep:1,goal:"Cannelle s'est endormie dans l'herbe. Réveille-la doucement.",lines:[
      ["cannelle","shy","Mmh… Je dormais. Je dors souvent.",()=>actPose("cannelle","sit","shy")],
      ["cannelle","sad","Mais ici, l'herbe pique. Il me faudrait un vrai lit de feuilles…",()=>{actEmote("cannelle","goutte");setTimeout(()=>actGo("me",296,372),900)}]]},
    {at:"@leaves",game:{k:"rake",win:"Un tas tout moelleux !"},goal:"Fais un grand tas de feuilles pour Cannelle.",lines:[
      ["me","joy","Le plus beau tas de feuilles de la forêt.",()=>actTrick("me","roll")]]},
    {at:"cannelle",after:[["cannelle","leaves"]],goal:"Montre le tas de feuilles à Cannelle.",lines:[
      ["cannelle","joy","Oh… Il sent l'automne. Je pourrais y dormir pour toujours.",()=>{actPose("cannelle","happy","joy");actEmote("cannelle","coeur")}],
      ["cannelle","shy","Tiens, la feuille dorée du dessus. Bonne nuit !",()=>{actGive("cannelle","me","feuilledor");setTimeout(()=>actPose("cannelle","sleep"),1500)}]]}
  ]},
  charbon:{title:"Gris dans le gris",souv:"le morceau de charbon à dessiner",beats:[
    {at:"@lampL",hide:1,goal:"Le brouillard est tombé. Prends une lanterne.",game:{k:"lantern",who:"charbon",win:"Trouvé ! Un petit renard tout gris…"},after:[["charbon","lampL"]],lines:[
      ["charbon","shy","Je… je me suis perdu. Gris dans le gris, personne ne me voit jamais.",()=>actEmote("charbon","goutte")],
      ["me","joy","Moi, je t'ai vu. Viens près des lanternes.",()=>actEmote("me","coeur")]]},
    {at:"charbon",goal:"Va voir Charbon près des lanternes.",lines:[
      ["charbon","joy","Près de la lumière, je suis presque argenté.",()=>actTrick("charbon","toupie")],
      ["charbon","open","Tiens, un morceau de charbon. Ça dessine très bien… Garde-le pour un peintre, un jour.",()=>actGive("charbon","me","charbon")]]}
  ]},
  brume:{title:"Le parapluie-feuille",souv:"la goutte de rosée qui ne sèche jamais",beats:[
    {at:"brume",goal:"Brume vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["brume","open",`Bonjour ${ME()}. Je ne sors jamais sans mon parapluie-feuille.`,()=>actTrick("brume","boing")],
      ["brume","sad","Mais Petit Pois est parti chercher des champignons… et un nuage le suit ! Prends mon parapluie, vite.",()=>{actEmote("brume","!");actGive("brume","me","leaf",{happy:false})}]]},
    {at:"petitpois",game:{k:"umbrella",who:"petitpois",win:"Pas une goutte !"},goal:"Abrite Petit Pois avec le parapluie-feuille.",lines:[
      ["petitpois","joy","Je suis tout sec ! Et j'ai trouvé trois champignons.",()=>actTrick("petitpois","salto")]]},
    {at:"brume",goal:"Rends son parapluie à Brume.",lines:[
      ["brume","joy","Tu tiens un parapluie mieux que moi.",()=>actGive("me","brume","leaf")],
      ["brume","shy","Tiens, une goutte de rosée que je garde depuis longtemps. Elle ne sèche jamais.",()=>actGive("brume","me","goutte")]]}
  ]},
  moka:{title:"Toujours en retard",souv:"la montre qui retarde",beats:[
    {at:"moka",goal:"Moka vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["moka","surprise",`Oh ! ${ME()} ! Je suis en retard… Pour quoi, déjà ?`,()=>{actTrick("moka","zoom");setTimeout(()=>actEmote("moka","?"),1200)}],
      ["moka","joy","Je sais ! Une course jusqu'à la mare. Cette fois, c'est moi qui gagne.",()=>{actEmote("moka","!");setTimeout(()=>actGo("me",140,430),800)}]]},
    {at:"@pond",game:{k:"order",who:"moka",n:10,time:10,win:"Gagné ! Moka arrive… en retard."},goal:"Fais la course avec Moka jusqu'à la mare.",lines:[
      ["moka","joy","Battu ! Comme d'habitude. Au moins, je suis à l'heure pour perdre.",()=>{actPose("moka","lie","joy");actTrick("me","salto")}],
      ["moka","shy","Tiens, ma montre. Elle retarde de dix minutes… C'est peut-être pour ça.",()=>actGive("moka","me","montre")]]}
  ]},
  // un feuilleton d'amour sur trois histoires (demande de Joffray) : Pain d'épice cherche quelqu'un et n'y arrive pas,
  // Libellule passe entre les deux (pour oublier un peu), puis Brioche arrive, qui cherche aussi : tu les réunis
  painepice:{title:"Quelqu'un pour moi",souv:"le biscuit en forme de cœur",beats:[
    {at:"painepice",goal:"Pain d'épice vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["painepice","open",`${ME()}, tu sens ? Cannelle, miel, four chaud. C'est moi : je sens le goûter.`,()=>actEmote("painepice","note")],
      ["painepice","sad","Tout le monde ici a quelqu'un. Moi, je fais des gâteaux… et je les mange tout seul.",()=>{actPose("painepice","sit","sad");actEmote("painepice","goutte")}],
      ["painepice","shy","J'aimerais trouver quelqu'un. Quelqu'un rien que pour moi. Tu m'aides ?",()=>actEmote("painepice","coeur")]]},
    {at:"*",goal:"Demande à un renard s'il connaît quelqu'un pour Pain d'épice.",lines:id=>[
      ["me","open",`${nameOf(id)}, tu connais quelqu'un pour Pain d'épice ?`,()=>actEmote(id,"?")],
      [id,"surprise","Quelqu'un ? Ici, on se connaît tous depuis toujours…",()=>actEmote("me","goutte")],
      [id,"open","Essaie la forêt. Un signal, le soir, ça se voit de très loin.",()=>actEmote("me","!")]]},
    {at:"@lampL",lamps:1,game:{k:"firefly",say:"Attrape la luciole dorée : elle portera le signal jusqu'au fond de la forêt !",win:"Le signal est parti !"},goal:"Envoie un signal à la forêt depuis les lanternes.",lines:[
      ["painepice","joy","Toutes les lanternes allumées… Si quelqu'un est là-bas, il les verra.",()=>actTrick("painepice","boing")],
      ["me","joy","Et maintenant, on attend.",()=>actEmote("me","?")]]},
    {at:"painepice",goal:"Va voir si quelqu'un a répondu au signal.",lines:[
      ["painepice","sad","Personne. Pas un bruit dans la forêt.",()=>{actPose("painepice","lie","sad");actEmote("painepice","goutte")}],
      ["painepice","open","Tant pis. Je garde un biscuit au chaud, en forme de cœur. On ne sait jamais.",()=>{actPose("painepice","sit","open");actEmote("painepice","coeur")}],
      ["painepice","shy","Tiens, prends le premier. Tu as essayé, c'est déjà beaucoup.",()=>actGive("painepice","me","coeur")]]}
  ]},
  libellule:{title:"Le ciel dans la mare",souv:"le galet lisse comme l'eau calme",beats:[
    {at:"libellule",after:[["libellule","pond"]],goal:"Libellule vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["libellule","open","Bonjour… Chut. Regarde la mare : quand l'eau est calme, on voit le ciel dedans.",()=>actEmote("libellule","note")],
      ["libellule","sad","Mais il y a toujours une mouche, ou Plouf, pour faire des ronds. Je n'ai jamais vu la lune dedans.",()=>actEmote("libellule","goutte")]]},
    {at:"libellule",game:{k:"still",label:"L'eau se calme…",say:"Chasse les mouches avant qu'elles touchent l'eau !",win:"Plus un rond… Regarde !"},goal:"Aide Libellule à garder la mare bien calme.",lines:[
      ["libellule","surprise","La lune… dans la mare. Toute ronde.",()=>{actPose("libellule","up","surprise");actEmote("libellule","!")}],
      ["libellule","joy","Je te donne mon galet le plus lisse. Il est calme comme l'eau ce soir.",()=>actGive("libellule","me","pebble")]]}
  ]},
  brioche:{title:"Moitié-moitié",souv:"la recette du goûter à deux",cast:["painepice"],beats:[
    {at:"brioche",goal:"Brioche vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["brioche","joy",`Bonjour ${ME()} ! Un soir, j'ai vu des lanternes au loin. J'ai marché, marché…`,()=>actTrick("brioche","boing")],
      ["brioche","shy","Et puis il y avait cette odeur. Cannelle, miel, four chaud. Je l'ai suivie jusqu'ici.",()=>actEmote("brioche","note")],
      ["brioche","sad","Tu sais, j'aimerais trouver quelqu'un. Quelqu'un avec qui partager le goûter.",()=>actEmote("brioche","coeur")],
      ["me","surprise","Cannelle, miel, four chaud… Attends-moi là !",()=>{actEmote("me","!");setTimeout(()=>actNear("me","painepice"),700)}]]},
    {at:"painepice",goal:"Cannelle, miel, four chaud : tu connais quelqu'un qui sent comme ça.",lines:[
      ["painepice","surprise","Une renarde ? Qui a vu les lanternes ? Qui a suivi… mon odeur ?",()=>{actTrick("painepice","salto");actEmote("painepice","!")}],
      ["painepice","sad","Je ne peux pas y aller comme ça. Je sens le four !",()=>actEmote("painepice","goutte")],
      ["me","joy","C'est justement ça qu'elle a suivi.",()=>actEmote("me","coeur")],
      ["painepice","shy","Alors il me faut un gâteau. Un vrai. Tu m'aides à ramasser des pommes ?",()=>setTimeout(()=>actGo("me",330,300),700)]]},
    {at:"@tree",game:{k:"basket",n:8,win:"Assez pour un gâteau à deux étages !"},after:[["painepice","bench1"]],goal:"Ramasse des pommes pour le gâteau de Pain d'épice.",lines:[
      ["painepice","joy","Un étage pour elle, un étage pour moi. Et le biscuit en cœur, dessus.",()=>actGive("me","painepice","pomme")],
      ["painepice","shy","Tu peux lui dire de venir sur le banc ? Moi, mes pattes tremblent.",()=>actEmote("painepice","goutte")]]},
    {at:"brioche",stay:["painepice"],after:[["brioche","bench2"]],goal:"Dis à Brioche que quelqu'un l'attend sur le banc.",lines:[
      ["me","joy","Quelqu'un t'attend sur le banc. Avec un gâteau.",()=>actEmote("me","coeur")],
      ["brioche","surprise","Un gâteau ? Pour moi ?",()=>actTrick("brioche","boing")]]},
    {at:"@bench",rain:1,stay:["painepice","brioche"],goal:"Va voir Pain d'épice et Brioche sur le banc.",lines:[
      ["painepice","sad","Il pleut… Le gâteau va être tout mouillé.",()=>actEmote("painepice","goutte")],
      ["brioche","joy","Tant pis. On reste là.",()=>actEmote("brioche","coeur")],
      ["painepice","shy","J'ai… gardé un biscuit au chaud. Depuis longtemps. Pour quelqu'un.",()=>actGive("painepice","brioche","coeur")],
      ["brioche","surprise","Cannelle, miel… C'est toi, l'odeur que j'ai suivie !",()=>actEmote("brioche","!")],
      ["painepice","joy","Et c'est moi qui ai allumé les lanternes. Enfin, avec un peu d'aide.",()=>actEmote("painepice","note")],
      ["brioche","shy","On partage ? Moitié-moitié.",()=>{actEmote("brioche","coeur");actEmote("painepice","coeur")}],
      ["painepice","joy","Moitié-moitié. Et le goûter de demain aussi.",()=>actTrick("painepice","toupie")],
      ["brioche","joy",`Tiens, ${ME()}, la recette. Pour deux. C'est grâce à toi.`,()=>actGive("brioche","me","page")]]}
  ]},
  // la maison (demande de Joffray) : Copeau répare la porte coincée, Sésame l'ouvre ; ensuite on y entre (maison.js) et Copeau l'agrandit
  copeau:{title:"La porte coincée",souv:"le clou porte-bonheur",beats:[
    // déjà venu réparer le traîneau de Barbe-Neige (Noël, avant son histoire) : il ne vient pas d'arriver, il est resté
    {at:"copeau",get goal(){return copeauNoel()?"Copeau est resté au refuge depuis la réparation du traîneau. Va le voir.":"Copeau vient d'arriver au refuge. Va lui dire bonjour."},lines:()=>[
      copeauNoel()?["copeau","joy",`Re-bonjour ${ME()} ! Depuis le traîneau, je ne suis jamais vraiment reparti. Ici, tout grince, tout coince, tout penche : le paradis du bricoleur.`,()=>actTrick("copeau","boing")]
        :["copeau","joy",`Bonjour ${ME()} ! Copeau, bricoleur. Je répare tout ce qui grince, tout ce qui coince, tout ce qui penche.`,()=>actTrick("copeau","boing")],
      ["copeau","surprise","Et cette porte… Elle est coincée depuis combien de temps ?",()=>actEmote("copeau","?")],
      ["me","shy","Depuis toujours. On vit dehors, sous le porche.",()=>actEmote("me","goutte")],
      ["copeau","open","Dehors ? Avec une maison juste là ? Viens, on s'en occupe.",()=>{actGo("copeau",186,258);setTimeout(()=>actGo("me",226,262),400)}]]},
    {at:"@porch",game:{k:"nails",n:5,time:7,say:"Les gonds sont tout rouillés. Plante les clous neufs : trois coups chacun !",win:"Tac, tac, tac ! Des gonds tout neufs."},goal:"Aide Copeau à réparer la porte de la maison.",lines:[
      ["copeau","joy","Elle ne grince plus du tout. Écoute ce silence !",()=>actTrick("copeau","salto")],
      ["copeau","surprise","…Mais elle ne s'ouvre toujours pas. Il y a une serrure. Et pas de clé.",()=>actEmote("copeau","?")],
      ["petitpois","sad","Personne n'a jamais eu la clé…",()=>actEmote("petitpois","goutte")]]},
    {at:"copeau",goal:"Copeau réfléchit devant la porte.",lines:[
      ["copeau","open","Une serrure comme ça, je n'en ai vu qu'une fois. Chez un renard bleu comme la nuit, qui habitait ici il y a longtemps.",()=>actEmote("copeau","!")],
      ["copeau","shy","Il perdait toutes ses clés. Toutes. Il passe encore dans la forêt, le soir, à chercher par terre.",()=>actPose("copeau","sit","shy")],
      ["copeau","joy","En attendant, garde ce clou. Le premier que j'ai planté ici. Ça porte bonheur.",()=>actGive("copeau","me","clou")]]}
  ]},
  // Sésame perd tout le temps ses clés (idée de Joffray) : celle de la maison aussi, il y a longtemps
  sesame:{title:"La clé perdue",souv:"la clé de la maison",cast:["copeau"],beats:[
    {at:"sesame",goal:"Un renard bleu nuit fouille l'herbe. Va lui dire bonjour.",lines:[
      ["sesame","surprise",`Oh ! Bonsoir, ${ME()}. Tu n'aurais pas vu une clé ? Dorée, avec un ruban rouge ?`,()=>actEmote("sesame","?")],
      ["me","open","…Celle que tu as autour du cou ?",()=>actEmote("me","!")],
      ["sesame","shy","Ah. Oui. Non ! Celle-là, c'est la clé de ma boîte aux lettres. Que j'ai perdue.",()=>actEmote("sesame","goutte")],
      ["sesame","sad","Je perds toutes mes clés. Celle de cette maison, je l'ai perdue il y a très longtemps, quand j'habitais ici. Depuis, la porte est fermée.",()=>actPose("sesame","sit","sad")]]},
    {at:"@leaves",game:{k:"search",item:"key",say:"Sésame perd souvent ses clés dans les feuilles. Fouille !",win:"Une clé !"},goal:"Cherche la clé de Sésame dans le tas de feuilles.",lines:[
      ["sesame","joy","Une clé ! … Ah non. C'est celle de mon ancien cabanon. Je la cherchais depuis trois hivers.",()=>{actTrick("sesame","boing");setTimeout(()=>actEmote("sesame","goutte"),1100)}],
      ["sesame","open","La clé de la maison brillait plus. Beaucoup plus.",()=>actEmote("sesame","?")],
      ["copeau","surprise","Ce qui brille… La pie du grand arbre ramasse tout ce qui brille !",()=>{actEmote("copeau","!");setTimeout(()=>actGo("me",330,300),800)}]]},
    {at:"@tree",game:{k:"shake",item:"key",catch:1,say:"Secoue le grand arbre ! Rattrape la clé avant qu'elle tombe !",win:"Rattrapée au vol !"},goal:"Fais tomber le trésor de la pie, dans le grand arbre.",lines:[
      ["sesame","surprise","C'est elle ! La clé de la maison ! Avec mes initiales gravées dessus !",()=>actTrick("sesame","salto")],
      ["copeau","joy","Les gonds sont neufs, la serrure est huilée. À toi l'honneur.",()=>actGive("me","sesame","key",{happy:false})]]},
    {at:"@porch",goal:"Ouvre la porte avec Sésame.",lines:[
      ["sesame","shy","Elle tourne… Clic.",()=>actEmote("sesame","!")],
      ["sesame","joy","Une cheminée, un tapis, et de la place pour tout le monde. Bienvenue chez toi.",()=>actTrick("sesame","toupie")],
      ["copeau","open","Un peu petit, quand même. Je vais pouvoir agrandir tout ça…",()=>actEmote("copeau","note")],
      ["sesame","open",`Tiens, ${ME()}, garde la clé. Moi, je la perdrais avant ce soir. Touche la porte pour entrer.`,()=>actGive("sesame","me","key")]]}
  ]},
  // lot du 27/10/2026 : les six derniers clients du Café sans histoire
  marquis:{title:"Rien que du moelleux",souv:"le nœud de soie",beats:[
    {at:"marquis",goal:"Marquis vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["marquis","open",`Bonsoir, ${ME()}. Marquis, enchanté. Je resterai debout, merci.`,()=>actPose("marquis","up","open")],
      ["marquis","sad","La souche ? Trop dure. Le banc ? Trop froid. L'herbe ? Elle pique.",()=>actEmote("marquis","colere")],
      ["marquis","shy","Je ne m'assois que sur du moelleux. C'est une question de dignité.",()=>actEmote("me","goutte")]]},
    {at:"brindille",goal:"Demande à Mamie Brindille si elle peut coudre un coussin.",lines:[
      ["brindille","joy","Un coussin pour ce petit monsieur ? Bien sûr, mon chou.",()=>actEmote("brindille","coeur")],
      ["brindille","sad","Mais ma pelote de laine a encore roulé sous les feuilles…",()=>{actEmote("brindille","goutte");setTimeout(()=>actGo("me",296,372),800)}]]},
    {at:"@leaves",game:{k:"search",item:"wool",say:"La pelote de Mamie Brindille est sous un des tas : il frémit quand elle bouge. 3 essais !",win:"La pelote !"},after:[["marquis","bench1"]],goal:"Retrouve la pelote de Mamie Brindille dans les feuilles.",lines:[
      ["brindille","joy","Trois points, deux nœuds… Voilà un coussin bien dodu. Va, porte-le-lui.",()=>actGive("brindille","me","coussin",{happy:false})]]},
    {at:"marquis",goal:"Apporte le coussin à Marquis, sur le banc.",lines:[
      ["marquis","surprise","Pour moi ? Brodé ?",()=>{actGive("me","marquis","coussin",{happy:false});actEmote("marquis","!")}],
      ["marquis","joy","…Oh. Que c'est moelleux. Je ne me relèverai plus jamais.",()=>{actPose("marquis","lie","joy");actEmote("marquis","coeur")}],
      ["marquis","shy","Tiens, mon nœud de soie. Un marquis paie toujours ses dettes.",()=>actGive("marquis","me","noeud")]]}
  ]},
  zaza:{title:"Chut",souv:"le grelot qui ne sonne pas",beats:[
    {at:"zaza",goal:"Zaza vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["zaza","surprise",`${ME()} ! Tu entends ? Non ? Moi, j'entends tout.`,()=>actEmote("zaza","!")],
      ["zaza","sad","Une mouche qui bâille. Une feuille qui tombe. Somnus qui ronfle au fond de la forêt. Je ne dors jamais.",()=>actEmote("zaza","goutte")],
      ["zaza","shy","Juste une fois, je voudrais un vrai silence.",()=>actPose("zaza","lie","shy")]]},
    {at:"zaza",game:{k:"still",label:"Zaza s'endort…",say:"Zaza ferme les yeux. Chasse les mouches avant qu'elles bourdonnent à ses oreilles !",win:"Plus un bruit…"},goal:"Fais le silence autour de Zaza.",lines:[
      ["zaza","shy","Mmh… J'ai dormi. Vraiment dormi. J'ai rêvé de mon désert.",()=>{actPose("zaza","happy","joy");actEmote("zaza","note")}],
      ["zaza","joy","Tiens, mon grelot. Je l'ai bouché exprès : il ne sonne pas. Comme ça, tu penseras au silence.",()=>actGive("zaza","me","bell")]]}
  ]},
  flocon:{title:"Une lumière à soi",souv:"le bocal-veilleuse",beats:[
    {at:"flocon",goal:"Flocon vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["flocon","shy",`Bonsoir ${ME()}… Pardon, je suis un peu perdu. J'ai suivi une lumière toute la nuit.`,()=>actEmote("flocon","?")],
      ["flocon","sad","Chez moi, dans la neige, il fait noir six mois. Alors dès que quelque chose brille, je le suis. Les lanternes, la lune, la queue de Luciole…",()=>actEmote("flocon","froid")],
      ["luciole","surprise","C'est toi qui me suis partout depuis ce matin ?",()=>{actEmote("luciole","!");actNear("flocon","luciole")}]]},
    {at:"luciole",goal:"Demande conseil à Luciole.",lines:[
      ["luciole","joy","Il lui faut une lumière rien qu'à lui. Une qu'il garde près de son lit.",()=>actEmote("luciole","coeur")],
      ["luciole","open","Les lucioles dorées sont les plus douces. Il y en a toujours une près des lanternes.",()=>setTimeout(()=>actGo("me",96,290),700)]]},
    {at:"@lampL",game:{k:"firefly",say:"Une seule luciole brille en or. Attrape-la pour Flocon !",win:"Dans le bocal !"},goal:"Attrape une luciole dorée pour Flocon, près des lanternes.",lines:[
      ["flocon","surprise","Pour moi ? Une lumière qui reste ?",()=>{actGive("me","flocon","jar",{happy:false});actEmote("flocon","!")}],
      ["flocon","joy","Je n'aurai plus besoin de suivre personne. Je pourrai enfin m'endormir.",()=>actTrick("flocon","salto")],
      ["flocon","shy","Garde ce bocal vide, celui d'avant. Il a tenu toutes mes nuits d'hiver.",()=>actGive("flocon","me","jar")]]}
  ]},
  noisette:{title:"Le gland d'or",souv:"le carnet du professeur",beats:[
    {at:"noisette",goal:"Le Professeur Noisette vient d'arriver. Va lui dire bonjour.",lines:[
      ["noisette","open",`Ah, ${ME()} ! Professeur Noisette. J'étudie les glands depuis quarante saisons.`,()=>actEmote("noisette","note")],
      ["noisette","surprise","Et mes calculs sont formels : au sommet de ce grand arbre pousse le seul gland d'or de la forêt.",()=>{actEmote("noisette","!");setTimeout(()=>actEmote("me","?"),900)}],
      ["noisette","shy","Seulement… je n'ai jamais grimpé. Le vertige. Et mes lunettes glissent.",()=>actEmote("noisette","goutte")]]},
    {at:"@tree",game:{k:"shake",item:"acorn",catch:1,say:"Secoue le grand arbre ! Le gland d'or va tomber : attrape-le au vol !",win:"Le gland d'or !"},goal:"Fais tomber le gland d'or du grand arbre.",lines:[
      ["noisette","surprise","Il existe ! Quarante saisons… J'avais raison !",()=>actTrick("noisette","salto")]]},
    {at:"noisette",goal:"Rends le gland d'or au Professeur Noisette.",lines:[
      ["noisette","joy","Je vais l'étudier… Non. Je vais le planter. Dans quarante saisons, il y aura un arbre d'or ici.",()=>actGive("me","noisette","acorn")],
      ["noisette","shy","Prends mon carnet. Tout ce que je sais des glands est dedans. Il te servira plus qu'à moi.",()=>actGive("noisette","me","carnet")]]}
  ]},
  givre:{title:"Disparu",souv:"la boule de neige qui ne fond pas",beats:[
    {at:"givre",goal:"Givre vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["givre","joy",`Coucou ${ME()} ! Chez moi, je me roule dans la neige jusqu'à disparaître. Personne ne me trouve jamais !`,()=>actTrick("givre","roll")],
      ["givre","sad","Mais ici, pas de neige. Tout le monde me voit. C'est nul.",()=>{actPose("givre","sit","sad");actEmote("givre","goutte")}],
      ["givre","open","Oh ! Les coussins de Pantoufle sont tout blancs… Tu me cherches ?",()=>actTrick("givre","zoom")]]},
    {at:"givre",game:{k:"cushion",who:"givre",say:"Givre se cache sous un coussin. Suis-le des yeux !"},goal:"Joue à cache-cache avec Givre.",lines:[
      ["givre","surprise","Tu m'as trouvé ? Même sous les coussins ?",()=>actEmote("givre","!")],
      ["givre","joy","Personne ne m'avait jamais trouvé ! C'est encore mieux que disparaître.",()=>actTrick("givre","salto")],
      ["givre","shy","Tiens, une boule de neige de chez moi. Elle ne fond jamais, je ne sais pas pourquoi.",()=>actGive("givre","me","neige")]]}
  ]},
  // Comète ne vient pas de ce monde (idée de Joffray) : une étoile filante tombée dans la mare, qui a perdu sa traînée
  comete:{title:"Pas d'ici",souv:"l'éclat d'étoile toujours tiède",cast:["noisette"],beats:[
    {at:"comete",goal:"Une lumière est tombée près de la mare cette nuit. Va voir.",lines:[
      ["comete","surprise","Où… où suis-je ? Ce n'est pas mon ciel. Il n'y a qu'une lune, ici ?",()=>actEmote("comete","?")],
      ["me","open",`Tu es au refuge. Moi, c'est ${ME()}. Tu viens d'où ?`,()=>actEmote("me","coeur")],
      ["comete","sad","De là-haut. Très loin derrière la lune. Je passais trop près, et j'ai glissé de ma route.",()=>actPose("comete","sit","sad")],
      ["comete","shy","Je brillais tellement, avant. Il me reste à peine une étincelle.",()=>actEmote("comete","goutte")]]},
    {at:"noisette",goal:"Le Professeur Noisette a peut-être une explication.",lines:[
      ["noisette","surprise","Fascinant… Une étoile filante. Vivante ! Toutes mes lectures disaient que c'était impossible.",()=>{actTrick("noisette","boing");actEmote("noisette","!")}],
      ["noisette","open","Pour remonter, il lui faut sa traînée. En tombant, elle s'est éparpillée en éclats dans toute la clairière.",()=>setTimeout(()=>actGo("me",140,430),700)]]},
    {at:"@pond",game:{k:"catch",n:6,say:"Les éclats de la traînée flottent au-dessus de la mare. Attrape-les tous !",win:"Tous les éclats !"},goal:"Ramasse les éclats de la traînée de Comète, près de la mare.",lines:[
      ["comete","joy","Ma traînée… Je la sens. Je pourrais rentrer cette nuit.",()=>actTrick("comete","salto")]]},
    {at:"comete",goal:"Rends ses éclats à Comète.",lines:[
      ["comete","sad","Là-haut, il fait froid et tout est silencieux. Ici, il y a des lanternes, une mare qui garde la lune… et toi.",()=>actEmote("comete","coeur")],
      ["comete","open","Alors je reste. Une nuit par lune, je remonterai dire bonjour à mon ciel. C'est la seule nuit où on me voit là-haut.",()=>actTrick("comete","toupie")],
      ["comete","joy",`Tiens, ${ME()}. Un éclat que je n'ai pas rendu. Il restera tiède, comme une étoile dans ta poche.`,()=>actGive("comete","me","eclat")]]}
  ]},
  // les six sauvages de la gamelle (27/10/2026) : leur histoire vient après leur première visite, puis ils s'installent.
  // Une sur deux avec un jeu (Joffray : « pas obligé de faire des jeux pour tous »)
  somnus:{title:"La vingt-quatrième heure",souv:"le bonnet de nuit de rechange",beats:[
    {at:"somnus",sleep:1,goal:"Somnus est revenu de la forêt. Il dort, évidemment. Réveille-le doucement.",lines:[
      ["somnus","shy",`Mmh… ${ME()} ? C'est l'heure ? Ma seule heure réveillée de la journée ?`,()=>actPose("somnus","sit","shy")],
      ["somnus","open","D'habitude, je la passe à bâiller. Mais aujourd'hui, je voudrais voir quelque chose de beau.",()=>setTimeout(()=>actGo("me",140,430),700)]]},
    {at:"@pond",goal:"Montre la mare à Somnus.",lines:[
      ["somnus","surprise","De l'eau qui brille… Je l'avais toujours vue en rêve. En vrai, c'est mieux.",()=>{actEmote("somnus","!");actNear("somnus","me","up")}],
      ["somnus","open","Encore un endroit. Vite, mon heure file.",()=>{actGo("me",262,424);setTimeout(()=>actGo("somnus",226,430),300)}]]},
    {at:"@bench",goal:"Emmène Somnus jusqu'au banc.",lines:[
      ["somnus","joy","Le banc. La mare. Les lanternes. Et quelqu'un à côté.",()=>actEmote("somnus","coeur")],
      ["somnus","shy","C'était… la plus belle heure de toutes. Je crois que je vais rester ici pour les prochaines.",()=>actPose("somnus","lie","shy")],
      ["somnus","shy","Tiens, mon bonnet de rechange. Pour les jours où toi aussi tu… zzz…",()=>{actGive("somnus","me","bonnet");setTimeout(()=>actPose("somnus","sleep"),1500)}]]}
  ]},
  reglisse:{title:"Le secret sous la souche",souv:"le plan des tunnels",beats:[
    {at:"reglisse",goal:"Réglisse est revenu de la forêt. Va lui dire bonjour.",lines:[
      ["reglisse","open",`Bonsoir, ${ME()}. Je connais tous les tunnels de la forêt. Et tous les secrets de tes renards.`,()=>actEmote("reglisse","note")],
      ["reglisse","shy","Ils me les racontent. Je ne répète jamais. Enfin… presque jamais.",()=>actEmote("me","?")]]},
    {at:"*",goal:"Demande à un renard s'il a déjà confié un secret à Réglisse.",lines:id=>[
      ["me","open",`${nameOf(id)}, tu as déjà raconté un secret à Réglisse ?`,()=>actEmote(id,"?")],
      [id,"shy","…Peut-être. Mais il ne l'a jamais répété. C'est pour ça qu'on lui dit tout.",()=>actEmote(id,"goutte")],
      [id,"surprise","Par contre, lui, il en a un. Il gratte toujours sous la souche.",()=>{actEmote(id,"!");setTimeout(()=>actGo("me",112,322),700)}]]},
    {at:"@stump",goal:"Va voir ce que Réglisse cache sous la souche.",lines:[
      ["reglisse","surprise","Tu m'as trouvé. Bon. Mon secret, c'est un tunnel.",()=>actEmote("reglisse","goutte")],
      ["reglisse","joy","Il va de la souche jusque sous la maison. Quand il pleut, je passe par là pour être au chaud sans me mouiller.",()=>actTrick("reglisse","roll")],
      ["reglisse","shy","Je te donne le plan. Personne d'autre ne l'a jamais vu. Garde le secret.",()=>actGive("reglisse","me","page")]]}
  ]},
  aurore:{title:"Chaque nuit une autre",souv:"le ruban qui change de couleur",beats:[
    {at:"aurore",goal:"Aurore est revenue de la forêt. Va lui dire bonjour.",lines:[
      ["aurore","sad",`${ME()}… Personne ne me reconnaît jamais. La nuit, mon pelage change : rose, puis vert, puis violet.`,()=>actPose("aurore","sit","sad")],
      ["aurore","shy","Le lendemain, tout le monde croit que je suis une autre. Alors je reste seule.",()=>actEmote("aurore","goutte")]]},
    {at:"*",goal:"Demande à un renard s'il reconnaîtrait Aurore.",lines:id=>[
      ["me","open",`${nameOf(id)}, si Aurore change de couleur, tu la reconnais ?`,()=>actEmote(id,"?")],
      [id,"open","À sa voix, bien sûr. Et à sa façon de pencher la tête quand elle écoute.",()=>actEmote(id,"note")],
      [id,"joy","La couleur, c'est juste une surprise en plus.",()=>actTrick(id,"boing")]]},
    {at:"aurore",goal:"Dis à Aurore ce que les autres ont répondu.",lines:[
      ["aurore","surprise","À ma voix ? À ma façon de pencher la tête ?",()=>actEmote("aurore","!")],
      ["aurore","joy","Alors je peux changer de couleur autant que je veux. Je resterai moi.",()=>actTrick("aurore","toupie")],
      ["aurore","shy","Prends ce ruban. Il change de couleur avec moi, chaque nuit. Comme ça, on sera deux.",()=>actGive("aurore","me","ruban")]]}
  ]},
  maree:{title:"Contre le courant",souv:"le galet aux quatre ricochets",beats:[
    {at:"maree",goal:"Marée est revenue de la rivière. Va lui dire bonjour.",lines:[
      ["maree","open",`Bonjour ${ME()}. J'arrive avec le courant, je repars avec lui. Toujours.`,()=>actEmote("maree","note")],
      ["maree","sad","Mais ici, je voudrais rester. Seulement, la rivière m'appelle chaque soir.",()=>actPose("maree","sit","sad")],
      ["maree","shy","On dit qu'un galet qui rebondit quatre fois sur l'eau répond à la rivière à ta place.",()=>setTimeout(()=>actGo("me",140,430),700)]]},
    {at:"@pond",game:{k:"ricochet",need:4},goal:"Fais faire quatre ricochets pour Marée, sur la mare.",lines:[
      ["maree","surprise","Quatre ! La rivière a entendu.",()=>actTrick("maree","salto")],
      ["maree","joy","Ce soir, elle partira sans moi. Je reste au refuge.",()=>actEmote("maree","coeur")],
      ["maree","shy","Garde le galet. Il a dit oui pour moi.",()=>actGive("maree","me","pebble")]]}
  ]},
  perle:{title:"La perle perdue",souv:"une perle de son collier",beats:[
    {at:"perle",goal:"Perle est revenue de la rivière. Va lui dire bonjour.",lines:[
      ["perle","joy",`${ME()} ! Je venais te remercier pour la gamelle. Tu as vu mon collier ? Chaque perle vient d'un coquillage.`,()=>actTrick("perle","boing")],
      ["perle","sad","Oh non… Il en manque une. Elle a dû rouler sous les feuilles.",()=>{actEmote("perle","goutte");setTimeout(()=>actGo("me",296,372),800)}]]},
    {at:"@leaves",game:{k:"search",item:"pearl",say:"La perle a roulé sous un des tas. Il frémit quand elle bouge. 3 essais !",win:"La perle !"},goal:"Retrouve la perle de Perle dans les feuilles.",lines:[
      ["perle","joy","Elle brille encore plus après un tour dans les feuilles.",()=>actGive("me","perle","pearl")],
      ["perle","shy","Garde-la. Mon collier sera plus court, mais j'aurai une raison de revenir. Et puis… je crois que je vais rester.",()=>actGive("perle","me","pearl")]]}
  ]},
  yeti:{title:"Personne n'y croit",souv:"un poil tout doux du Yéti",beats:[
    {at:"petitpois",hide:1,goal:"Petit Pois a vu quelque chose dans le brouillard.",lines:[
      ["petitpois","surprise",`${ME()} ! Il y avait une ombre énorme près de la gamelle. Énorme ! Avec un bonnet !`,()=>{actTrick("petitpois","boing");actEmote("petitpois","!")}],
      ["petitpois","shy","Personne ne me croit. Tu viens voir avec moi ?",()=>actEmote("petitpois","goutte")]]},
    {at:"@lampL",hide:1,game:{k:"lantern",who:"yeti",win:"Trouvé ! Il est… énorme. Et tout doux."},after:[["yeti","lampL"]],goal:"Prends une lanterne et cherche l'ombre dans le brouillard.",lines:[
      ["yeti","shy","Bonsoir. Pardon. Je suis très discret, d'habitude.",()=>actEmote("yeti","goutte")],
      ["yeti","sad","Quand on est aussi gros, tout le monde a peur. Alors je me cache, et plus personne ne croit que j'existe.",()=>actPose("yeti","sit","sad")],
      ["petitpois","joy","Moi, j'y crois ! Je l'ai dit le premier !",()=>actTrick("petitpois","salto")]]},
    {at:"yeti",goal:"Va voir le Yéti près des lanternes.",lines:[
      ["yeti","joy","Si je reste, vous me ferez une place près du feu ? Je prends beaucoup de place, mais je tiens chaud.",()=>actEmote("yeti","coeur")],
      ["yeti","shy",`Tiens, ${ME()}. Un poil de ma fourrure. La preuve que j'existe.`,()=>actGive("yeti","me","poil")]]}
  ]},
  gribouille:{title:"Le grand portrait",souv:"le grand portrait du refuge",beats:[
    {at:"gribouille",goal:"Gribouille vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["gribouille","joy",`Bonjour ${ME()} ! Je peins avec ma queue : tu vois le bout bleu ?`,()=>actTrick("gribouille","toupie")],
      ["gribouille","shy","Je voudrais peindre tout le monde, mais ils me fuient dès que je sors mes couleurs. Tu m'aides ?",()=>actEmote("gribouille","goutte")]]},
    {at:"*",leave:1,goal:"Demande à un renard de poser pour Gribouille.",lines:id=>[
      [id,"joy","Poser ? Avec plaisir !",()=>actPose(id,"happy","joy")],
      [id,"surprise","…Oh, un papillon ! Je reviens !",()=>actTrick(id,"zoom")],
      ["me","sad",`Et hop, plus de ${nameOf(id)}. Essayons avec quelqu'un d'autre.`,()=>actEmote("me","goutte")]]},
    {at:"*",game:{k:"still",say:"Chasse les mouches, sinon il éternue !",win:"Ne bouge plus… Voilà !"},goal:"Essaie avec un autre renard.",lines:id=>[
      ["gribouille","joy",`Un portrait de ${nameOf(id)} ! Mon premier !`,()=>actTrick("gribouille","salto")],
      ["gribouille","sad","Mais un renard tout seul sur un tableau, ça fait un peu triste…",()=>actEmote("gribouille","goutte")],
      ["me","open","Et si on vous peignait tous ensemble ?",()=>actEmote("me","!")],
      ["gribouille","surprise","Le grand portrait ! Appelle tout le monde devant la maison !",()=>actTrick("gribouille","boing")]]},
    {at:"@porch",gather:1,game:{k:"still",all:1,say:"Tout le monde pose ! Chasse les mouches !",win:"Ne bougez plus… Voilà !"},goal:"Appelle tout le monde devant la maison.",lines:[
      ["petitpois","surprise","Mais… Gribouille, tu n'es pas dessus, toi !",()=>actEmote("petitpois","!")],
      ["gribouille","shy","Le peintre, on ne le voit jamais. C'est normal.",()=>actEmote("gribouille","goutte")],
      ["petitpois","open","Prête-moi ta queue, Gribouille. J'ai une idée.",()=>actEmote("petitpois","note")]]},
    {at:"gribouille",game:{k:"portrait"},goal:"Va voir le tableau de Gribouille.",lines:[
      ["petitpois","joy","Là, dans le coin. Un peu de travers… Voilà : toi.",()=>actEmote("gribouille","!")],
      ["gribouille","joy","Tout de travers… C'est le plus beau morceau du tableau. Tiens, il est pour toi.",()=>actGive("gribouille","me","tableau")]]}
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
if(R.nextAt>Date.now()+storyGap())R.nextAt=Date.now()+storyGap(); // une attente déjà lancée ne dépasse jamais la nouvelle
const chainDone=()=>ORDER.every(storyDone);
// Gribouille vient en tout dernier, le 30e renard (demande de Joffray) : son histoire attend que tous les autres
// renards aient fini la leur, même celles qui ne sont pas encore écrites
const LAST="gribouille",OTHERS=FOXES.filter(f=>!f.event&&f.id!=="roussette"&&f.id!==LAST).map(f=>f.id);
const lastReady=()=>OTHERS.every(id=>STORIES[id]&&storyDone(id));
// un sauvage n'a son histoire qu'une fois croisé à la gamelle ; ensuite il s'installe au refuge (Joffray, 27/10/2026)
// une histoire déjà commencée passe avant tout (l'ordre a changé le 29/10/2026 : on ne coupe personne au milieu)
// à Noël, le chapitre du sapin qui attend passe juste après (noel.js)
// les inconnus de la forêt (incos.js) : leur histoire vient dès qu'on a deviné leur prénom, sans attente, avant la suite d'ORDER
const INCO_ORDER=INCO.map(f=>f.id).filter(id=>id!=="balafre"),incoStory=k=>!!STORIES[k]&&!!(R.inco[k]||{}).found&&!storyDone(k)&&!(typeof noelAway==="function"&&noelAway(k)); // pas Filou ni Radar une fois la bande repartie
const incoNext=()=>INCO_ORDER.find(k=>R.beat[k]>0&&incoStory(k))||INCO_ORDER.find(incoStory)||null;
// une histoire qui n'attend ni l'arrivée de son renard, ni l'heure (Noël, inconnus) : il arrive pendant l'histoire
const freeStory=id=>isNoelStory(id)||!!INC[id];
// Noël d'abord, même si une autre histoire est commencée : ses chapitres ont une date (Joffray, 03/11/2026 : le 19, pas de Balafre)
const nextId=()=>noelNext()||ORDER.find(k=>R.beat[k]>0&&!storyDone(k))||incoNext()||ORDER.find(k=>!storyDone(k)&&(k!==LAST||lastReady())&&(!WILD[k]||R.met[k]||isRes(k)));
const wildLeft=()=>ORDER.filter(k=>WILD[k]&&!storyDone(k)&&!R.met[k]&&!isRes(k));
// arrivé trop tôt (avant le 26/10/2026) : il repart, il reviendra en dernier
if(isRes(LAST)&&!storyDone(LAST)&&!lastReady()){delete R.res[LAST];delete R.beat[LAST];delete R.who[LAST];save()}
// l'histoire en cours et le moment attendu (null si on attend le prochain renard)
// les chapitres de Noël n'attendent pas : leur renard arrive pendant l'histoire
function cur(){if(!R.intro)return null;const id=nextId();if(!id||(!isRes(id)&&!freeStory(id)))return null;
  const n=R.beat[id]||0;if(!n&&!freeStory(id)&&Date.now()<(R.nextAt||0))return null;return {id,n,b:beats(id)[n]}}
// renards qui peuvent répondre à un moment « * » : les autres renards du refuge, pas celui d'avant
function anyOk(c,fid){if(!isRes(fid)||(WILD[fid]&&!storyDone(fid))||fid===c.id)return false;const prev=(R.who[c.id]||{})[c.n-1];
  return fid!==prev||!foxes.some(f=>!f.wild&&f.id!==c.id&&f.id!==prev)}
// le renard de l'histoire caché dans la maison (Pantoufle)
function isHidden(fid){const c=cur();return !!c&&c.id===fid&&!!c.b.hide}
function isTarget(fid){const c=cur();return !!c&&(c.b.at===fid||(c.b.at==="*"&&anyOk(c,fid)))}
// renards qui doivent être dans la scène pour l'histoire
function storyFoxes(){const c=cur();return c?[c.id,"petitpois",c.b.at,...(STORIES[c.id].cast||[])].filter(isRes):[]}

/* ---------- le prochain renard ---------- */
// il arrive par la forêt dès que l'attente est finie ; page fermée, il est déjà là au retour
let storyKey="";
function chainTick(live){const id=nextId(),c=cur();
  if(R.intro&&(c?c.id+c.n:"")!==storyKey)renderStory(); // l'attente d'un renard déjà là vient de finir
  if(!R.intro||!id||isRes(id)||freeStory(id)||Date.now()<(R.nextAt||0))return;
  R.res[id]={at:Date.now(),h:0,pet:""};save();
  // celui qui se cache (Pantoufle) file droit dans la maison
  if(live){const f=makeFox(id,null),fs=SPOTS.filter(s=>!taken(s)&&!s.bowl&&!s.lamp);setTimeout(()=>goTo(f,beats(id)[0].hide?"door":fs[Math.floor(Math.random()*fs.length)]||SPOT.g3),60);toast(`${nameOf(id)} arrive au refuge !`)}
  renderStory();
}
// un renard qui vient pendant l'histoire (Luciole) entre par la forêt et va à l'endroit voulu
function bringIn(id,to){if(!isRes(id)){R.res[id]={at:Date.now(),h:0,pet:""};save()}
  let f=foxes.find(x=>x.id===id&&!x.wild);if(!f)f=makeFox(id,null);
  if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y}
  if(!f.walk)setTimeout(()=>goTo(f,to),60)}
// celui qu'on attend à un endroit (arrive) accourt depuis le bord le plus proche ; renvoie le temps qu'il met, pour que le
// dialogue ne commence qu'une fois qu'il est là (Joffray : on parlait avec Ramure à la mare, et il n'était pas encore arrivé)
function comeIn(id,to){if(!isRes(id)){R.res[id]={at:Date.now(),h:0,pet:""};save()}
  let f=foxes.find(x=>x.id===id&&!x.wild);if(f&&!f.inside&&Math.hypot(f.x-to.x,f.y-to.y)<40)return 0;
  if(!f)f=makeFox(id,null);if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y}
  else if(!f.spot&&!f.walk){f.x=to.x<200?-20:420;f.y=to.y;f.el.style.transitionDuration="0s";f.el.style.cssText+=";"+pc(f.x,f.y)}
  f.fast=1;const d=Math.hypot(f.x-to.x,f.y-to.y);setTimeout(()=>{goTo(f,to);f.until=Date.now()+20000},60);return Math.min(4000,d/95*1000+500)}

// tout le monde vient se ranger devant la maison, pour le portrait
function gather(){syncFoxes();const near=SPOTS.filter(s=>!s.bowl).sort((a,b)=>Math.hypot(a.x-DOOR.x,a.y-DOOR.y)-Math.hypot(b.x-DOOR.x,b.y-DOOR.y));
  foxes.filter(f=>!f.wild).forEach((f,i)=>{const to=near[i];if(!to)return;if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y}
    if(f.spot!==to)goTo(f,to)})}

/* ---------- jouer un moment ---------- */
// appelé quand on touche un renard ou un endroit ; vrai si c'était le moment attendu
function storyTap(at){const c=cur();if(!c||gameOn||!$("talk").hidden||!$("sheet").hidden)return false;
  if(at.startsWith("@")?c.b.at!==at:!isTarget(at))return false;
  const b=c.b;
  const wait=b.arrive?comeIn(b.arrive,b.arriveAt||SPOT[b.at.slice(1)]||SPOT.g3):0;
  (b.with||[]).forEach((id,i)=>bringIn(id,[SPOT.g1,SPOT.g2,SPOT.g3][i])); // d'autres arrivent avec lui (les frileux)
  if(b.lamps){scn.lamps={L:true,R:true};drawGlow()}
  if(b.gather)gather();
  if(b.at==="*")(R.who[c.id]=R.who[c.id]||{})[c.n]=at;
  // un renard tout en bas serait caché sous la bulle de dialogue (Grelot, chapitre de Ramure) : il remonte un peu avant de parler
  {const tf=at.startsWith("@")?null:sF(at);if(tf&&!tf.walk&&!tf.inside&&tf.y>H-130){tf.fast=1;actGo(at,Math.max(60,Math.min(340,tf.x)),H-160,"sit")}}
  hotEl.hidden=true;meStory(at); // Roussette y va (roussette.js)
  syncFoxes();
  const go=()=>talk(typeof b.lines==="function"?b.lines(at):b.lines,()=>{
    R.beat[c.id]=c.n+1;if(isNoelStory(c.id)||gardenCleared())drawBg(); // le sapin change en cours d'histoire (décoré après les boules de Paillette)
    if(b.rain)rainTill=Date.now()+18e4;if(b.stay){stayIds=b.stay;stayTill=Date.now()+18e4}
    for(const [fid,sp] of b.after||[]){const f=foxes.find(x=>x.id===fid&&!x.wild);if(!f||f.walk)continue;
      if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y;drawGlow()}goTo(f,SPOT[sp])}R.glands+=3; // chaque moment rapporte des glands, la fin d'une histoire bien plus
    if(b.leave){const f=foxes.find(x=>x.id===at);if(f)f.until=0}
    if(c.id==="gaston"&&storyDone("gaston")){drawBg();toast("La pêche est ouverte : touche la mare quand tu veux.")}
    if(storyDone(c.id)){bip("cheer");R.souv[c.id]=STORIES[c.id].souv;if(!freeStory(c.id))R.nextAt=VITE||ORDER.indexOf(c.id)<1?0:nextMorning();if(isNoelStory(c.id))drawBg();R.glands+=15;addBells(2);if(STORIES[c.id].end)STORIES[c.id].end();toast(`Souvenir reçu : ${STORIES[c.id].souv}. +18 glands, +2 clochettes`)}
    else toast("+3 glands");
    if(storyDone(c.id)&&c.id!=="petitpois"&&!R.lure&&!metAny())setTimeout(firstLure,500);
    else if(storyDone(c.id))setTimeout(wildNudge,600);
    if(storyDone(c.id)&&c.id!=="petitpois")setTimeout(pushInvite,2500); // proposer les notifications, une fois
    save();renderStory();renderHud();syncRain();
  });
  // une petite scène jouée avant les répliques (scenes.js) : les renards bougent, lancent, réagissent
  const run=()=>{if(b.game)playGame({...b.game,target:at},go);else go()};
  if(b.show){try{b.show()}catch(e){}setTimeout(run,Math.max(wait,b.showMs||1500))}else if(wait)setTimeout(run,wait);else run();
  return true;
}

/* ---------- avant de partir : la gamelle ---------- */
// à la fin des premières histoires, Petit Pois remplit la gamelle de baies : un sauvage viendra pendant ton absence
// (la copine de Joffray a fermé le jeu une fois les histoires finies, sans raison de revenir)
function firstLure(){if(R.lure)return;R.lure=1;save();
  talk([["petitpois","open","Avant d'aller dormir… J'ai cueilli des baies des bois. On les met dans la gamelle ?"],
    ["petitpois","joy","Des fois, quand tout le monde dort, un renard sauvage vient manger. Il laisse toujours une trace…"],
    ["petitpois","joy","Reviens demain : on regardera ensemble qui est venu !"]],
    ()=>{R.bowl={type:"baies",until:Date.now()+BOWLS.baies.hours*36e5};save();renderHud();drawBowl();toast("Des baies des bois dans la gamelle. Qui va venir ?")})}

// il ne reste que les sauvages jamais croisés : Petit Pois le dit une fois et remplit la gamelle de baies
// (sinon un joueur qui ne touche pas à la gamelle restait bloqué avant Gribouille)
function wildNudge(){if(R.wildNudge||!R.intro||cur()||nextId()||!wildLeft().length||gameOn||!$("talk").hidden||!$("sheet").hidden)return;
  R.wildNudge=1;save();
  talk([["petitpois","surprise",`${ME()}, tu as entendu ? Ça gratte dans les buissons, tous les soirs.`],
    ["petitpois","open","Ce sont les renards sauvages. Ils ont chacun une histoire, mais ils ne sortent que pour manger."],
    ["petitpois","joy","Je mets des baies dans la gamelle. Après, il faudra du poisson, ou même du miel : chacun a ses goûts. Regarde la fiche des sauvages dans le carnet !"]],
    ()=>{if(!R.bowl){R.bowl={type:"baies",until:Date.now()+BOWLS.baies.hours*36e5};save()}renderHud();toast("La gamelle attend les sauvages.")})}

/* ---------- repères : signes, endroit qui brille, objectif ---------- */
const hotEl=document.createElement("button");hotEl.className="hot";hotEl.type="button";hotEl.hidden=true;
hotEl.innerHTML=`<i class="mark">!</i>`;
hotEl.onpointerdown=e=>{e.stopPropagation();const c=cur();if(c)storyTap(c.b.at)};
$("lights").appendChild(hotEl); // au-dessus du voile de la nuit, comme les signes des renards
function goalText(){const c=cur();
  if(c)return {t:`${STORIES[c.id].title} · ${c.n+1} sur ${beats(c.id).length}`,g:c.b.goal};
  const e=envGoal();if(e)return e; // pas d'histoire en cours : la petite envie du moment
  const id=nextId();
  if(!id)return {t:"Histoires",wait:storyDone(LAST)||!wildLeft().length,g:storyDone(LAST)?"Toutes les histoires sont finies.":wildLeft().length?"Des renards sauvages rôdent encore autour de la gamelle. Remplis-la : chacun a une histoire à raconter.":"La suite des histoires arrive bientôt."};
  const w=R.nextAt-Date.now()>36e5?"un peu plus tard":"bientôt"; // pas d'heure précise (Joffray)
  return {t:"Prochaine histoire",wait:1,g:isRes(id)?`${nameOf(id)} aura quelque chose à te raconter ${w}.`:`Quelqu'un approche par la forêt… Il arrivera ${w}.`};
}
function renderStory(){
  const c=cur(),nf=nextId()||"";if(R.nextFox!==nf){R.nextFox=nf;save()} // lu par l'accueil

  storyKey=c?c.id+c.n:"";
  for(const f of foxes)if(!f.wild){const t=isTarget(f.id);
    if(t&&f.inside)f.until=0;
    if(isHidden(f.id)&&!f.inside&&!f.walk){f.inside=true;f.walk=null;f.el.classList.add("inside");drawGlow()}
    if(t&&c.b.sleep&&!f.walk&&f.pose!=="sleep"){f.pose="sleep";f.until=Date.now()+6e5;draw(f)}
    else setBadge(f);
  }
  const s=c&&c.b.at.startsWith("@")&&TG[c.b.at.slice(1)];
  hotEl.hidden=!s;if(s){hotEl.style.cssText=pc(s.x,s.y);hotEl.setAttribute("aria-label",s.name)}
  if(!R.intro){$("goal").hidden=true;return}
  const g=goalText();$("goal").hidden=!!g.wait;$("goal").innerHTML=`<span><b>${g.t}</b>${g.g}</span><i aria-hidden="true">›</i>`;
}

/* ---------- le journal des histoires ---------- */
function journal(){
  const c=cur(),nx=nextId();
  const row=id=>{const S=STORIES[id],fid=S.fox||id,n=R.beat[id]||0,N=beats(id).length,f=FOX[fid]; // fox : une histoire qui ne porte pas le nom de son renard (les adieux de la bande, noel.js)
    if(storyDone(id))return `<div class="opt"><span class="thumb">${foxArt(f,{expr:"joy",portrait:1})}</span><div class="txt"><strong>${S.title}</strong><span>${nameOf(fid)} · terminée. Souvenir : ${R.souv[id]||S.souv}.</span></div><button class="btn ghost" data-reread="${id}" type="button">Relire</button></div>`;
    const dots=`<span class="dots">${Array.from({length:N},(_,i)=>`<i class="${i<n?"on":""}"></i>`).join("")}</span>`;
    if(c&&c.id===id)return `<div class="opt now"><span class="thumb">${foxArt(f,{expr:"open",portrait:1})}</span><div class="txt"><strong>${S.title}</strong>${dots}<span>${c.b.goal}</span></div></div>`;
    if(id===nx)return `<div class="opt"><span class="thumb">${foxArt(f,{portrait:1,sil:!isRes(fid)})}</span><div class="txt"><strong>${isRes(fid)?S.title:"???"}</strong><span>${goalText().g}</span></div></div>`;
    return `<div class="opt unseen"><span class="thumb">${foxArt(f,{portrait:1,sil:!isRes(fid)})}</span><div class="txt"><strong>???</strong><span>${isRes(fid)?`${nameOf(fid)} te racontera son histoire plus tard.`:"Une histoire à venir."}</span></div></div>`};
  openSheet(`<h2>Les histoires</h2><p class="sub">Une histoire à la fois. Touche le renard ou l'endroit qui porte un <b class="markin">!</b> pour avancer.</p>${[...noelRows(),...INCO_ORDER.filter(k=>STORIES[k]&&(R.inco[k]||{}).found),...ORDER].map(row).join("")}`);
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
