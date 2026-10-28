/* La Clairière : les histoires. Voir docs/clairiere-v2.md, « Les histoires ».
   Une seule histoire à la fois, dans l'ordre d'ORDER. Le renard arrive pour son histoire (ou elle démarre s'il est déjà là),
   6 h après la fin de la précédente (nextMorning). Une histoire est une suite de moments : un renard ou un endroit
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
const STORY_GAP=6*36e5;
function nextMorning(){return Date.now()+STORY_GAP}
if(R.nextAt>Date.now()+STORY_GAP)R.nextAt=Date.now()+STORY_GAP;
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
const ORDER=["petitpois","mitaine","luciole","gaston","galette","pantoufle","grignote","brindille","plouf","biscuit","cannelle","charbon","brume","moka","painepice","libellule","brioche","copeau","sesame","marquis","zaza","flocon","noisette","givre","comete","somnus","reglisse","aurore","maree","perle","yeti","gribouille"];
// game : petit jeu avant le dialogue (games.js) ; after : renards qui se déplacent une fois le moment fini ;
// hide : le renard de l'histoire reste caché dans la maison pendant ce moment ; peu de texte, ça doit bouger
const STORIES={
  petitpois:{title:"Peur du noir",souv:"le gland porte-bonheur",beats:[
    {at:"petitpois",goal:"Petit Pois a quelque chose à te dire.",lines:[
      ["petitpois","shy",`${ME()}… le noir, je déteste. Ça fait crac. Hou-hou.`],
      ["petitpois","open","Tu crois qu'il existe quelqu'un qui n'a jamais peur ?"],
      ["me","open","Quelqu'un qui brille, peut-être… Je vais voir aux lanternes."]]},
    {at:"@lampL",arrive:"luciole",game:{k:"firefly",say:"Plein de lucioles ! Mais une seule brille en or… Attrape-la !",win:"Attrapée ! … Hein ? Elle est toute chaude."},goal:"Cherche quelqu'un qui brille, près des lanternes.",lines:[
      ["luciole","surprise","Aïe ! Doucement, c'est ma queue que tu tiens !"],
      ["luciole","joy","Moi, c'est Luciole. Ma queue brille en or, et les lucioles de toutes les couleurs me suivent partout."],
      ["me","joy","Viens vite, quelqu'un doit absolument te rencontrer."]]},
    {at:"petitpois",after:[["petitpois","lampR"]],goal:"Présente Luciole à Petit Pois.",lines:[
      ["petitpois","surprise","Ta queue… elle fait de la lumière ?!"],
      ["luciole","joy","Viens, Petit Pois. Je vais t'apprendre à allumer les lanternes."]]},
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
    {at:"@tree",game:{k:"shake",item:"jar",catch:1,say:"Secoue le grand arbre !",win:"Rattrapé au vol ! Pas une fissure."},goal:"Fais tomber le bocal du grand arbre.",lines:[
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
      ["galette","joy",`Salut ${ME()} ! Trois rebonds : c'est mon record de ricochets. Personne ne l'a jamais battu.`],
      ["galette","open","Ta mare a l'air parfaite. Tu relèves le défi ?"]]},
    {at:"@pond",game:{k:"ricochet",need:4},goal:"Bats le record de Galette à la mare.",lines:[
      ["galette","surprise","Quatre rebonds d'affilée ?! Tu as battu mon record !"],
      ["galette","joy","Tiens, mon caillou plat porte-bonheur. Il te revient. Mais je veux ma revanche !"]]}
  ]},
  pantoufle:{title:"Le renard du dedans",souv:"la pantoufle en laine",beats:[
    {at:"@porch",hide:1,goal:"Quelqu'un s'est glissé dans ta maison. Va voir à la porte.",lines:[
      ["pantoufle","shy","Chut ! Je ne suis pas là."],
      ["me","open","Pantoufle ? Tu ne veux pas sortir un peu ?"],
      ["pantoufle","sad","Dehors, il y a du vent, des feuilles, des gens. Ici, il y a un coussin."],
      ["me","joy","Des coussins ? J'ai un jeu pour toi. Je les pose sur le porche…"]]},
    {at:"@porch",hide:1,game:{k:"cushion",who:"pantoufle",win:"Trouvé trois fois ! Et… vous êtes dehors !"},after:[["pantoufle","p2"]],goal:"Propose un jeu des coussins à Pantoufle, devant la porte.",lines:[
      ["pantoufle","joy","Hi hi ! Le jeu des coussins, c'est mon préféré !"],
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
  brindille:{title:"Les chaussettes dépareillées",souv:"les chaussettes au gland brodé",beats:[
    {at:"brindille",goal:"Mamie Brindille vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["brindille","joy",`Bonjour, ma petite pelote. J'ai tricoté des chaussettes pour tout le refuge.`],
      ["brindille","sad","Je les avais mises à sécher près du banc, et le vent les a toutes mélangées. À mon âge, je n'y vois plus très clair."]]},
    {at:"@bench",game:{k:"memory",win:"Toutes les paires !"},goal:"Refais les paires de chaussettes près du banc.",lines:[
      ["me","joy","Six paires, bien rangées ! Le vent n'a qu'à bien se tenir."]]},
    {at:"brindille",goal:"Rapporte les chaussettes à Mamie Brindille.",lines:[
      ["brindille","joy","Toutes en paires ! Merci, ma petite pelote."],
      ["brindille","open","Tiens, celles avec un gland brodé sont pour toi. Les autres, je les donnerai cet hiver : je suis la doyenne, pas la plus pressée."]]}
  ]},
  plouf:{title:"La danse des flaques",souv:"les petites bottes de pluie",beats:[
    {at:"plouf",goal:"Plouf vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["plouf","joy",`${ME()} ! Tu connais la danse des flaques ? Je saute, tu répètes !`],
      ["plouf","open","Pas de pluie ? Pas grave, je viens d'en faire avec l'arrosoir."]]},
    {at:"plouf",game:{k:"simon",who:"plouf",rounds:[3,4,5,6,7]},goal:"Danse dans les flaques avec Plouf.",lines:[
      ["plouf","joy","Regarde-nous : deux éponges ! C'est le plus beau des compliments."],
      ["plouf","shy","Tiens, mes petites bottes de pluie. Moi, je préfère les pattes mouillées."]]}
  ]},
  biscuit:{title:"La tarte aux pommes",souv:"la première part de tarte",beats:[
    {at:"biscuit",goal:"Biscuit vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["biscuit","joy",`${ME()} ! Je veux faire une tarte aux pommes pour tout le refuge.`],
      ["biscuit","open","Le grand arbre en est plein. Je secoue, tu rattrapes ?"]]},
    {at:"@tree",game:{k:"basket",n:8,win:"Huit belles pommes !"},goal:"Rattrape les pommes sous le grand arbre.",lines:[
      ["me","joy","Huit pommes, pas une seule véreuse !"]]},
    {at:"biscuit",goal:"Apporte les pommes à Biscuit.",lines:[
      ["biscuit","joy","Un peu de beurre, un peu de sucre… et hop, au four !"],
      ["biscuit","shy","Tiens, la première part. C'est toujours la meilleure."]]}
  ]},
  cannelle:{title:"Le lit de feuilles",souv:"la feuille d'érable dorée",beats:[
    {at:"cannelle",sleep:1,goal:"Cannelle s'est endormie dans l'herbe. Réveille-la doucement.",lines:[
      ["cannelle","shy","Mmh… Je dormais. Je dors souvent."],
      ["cannelle","sad","Mais ici, l'herbe pique. Il me faudrait un vrai lit de feuilles…"]]},
    {at:"@leaves",game:{k:"rake",win:"Un tas tout moelleux !"},goal:"Fais un grand tas de feuilles pour Cannelle.",lines:[
      ["me","joy","Le plus beau tas de feuilles de la forêt."]]},
    {at:"cannelle",after:[["cannelle","leaves"]],goal:"Montre le tas de feuilles à Cannelle.",lines:[
      ["cannelle","joy","Oh… Il sent l'automne. Je pourrais y dormir pour toujours."],
      ["cannelle","shy","Tiens, la feuille dorée du dessus. Bonne nuit !"]]}
  ]},
  charbon:{title:"Gris dans le gris",souv:"le morceau de charbon à dessiner",beats:[
    {at:"@lampL",hide:1,goal:"Le brouillard est tombé. Prends une lanterne.",game:{k:"lantern",who:"charbon",win:"Trouvé ! Un petit renard tout gris…"},after:[["charbon","lampL"]],lines:[
      ["charbon","shy","Je… je me suis perdu. Gris dans le gris, personne ne me voit jamais."],
      ["me","joy","Moi, je t'ai vu. Viens près des lanternes."]]},
    {at:"charbon",goal:"Va voir Charbon près des lanternes.",lines:[
      ["charbon","joy","Près de la lumière, je suis presque argenté."],
      ["charbon","open","Tiens, un morceau de charbon. Ça dessine très bien… Garde-le pour un peintre, un jour."]]}
  ]},
  brume:{title:"Le parapluie-feuille",souv:"la goutte de rosée qui ne sèche jamais",beats:[
    {at:"brume",goal:"Brume vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["brume","open",`Bonjour ${ME()}. Je ne sors jamais sans mon parapluie-feuille.`],
      ["brume","sad","Mais Petit Pois est parti chercher des champignons… et un nuage le suit ! Prends mon parapluie, vite."]]},
    {at:"petitpois",game:{k:"umbrella",who:"petitpois",win:"Pas une goutte !"},goal:"Abrite Petit Pois avec le parapluie-feuille.",lines:[
      ["petitpois","joy","Je suis tout sec ! Et j'ai trouvé trois champignons."]]},
    {at:"brume",goal:"Rends son parapluie à Brume.",lines:[
      ["brume","joy","Tu tiens un parapluie mieux que moi."],
      ["brume","shy","Tiens, une goutte de rosée que je garde depuis longtemps. Elle ne sèche jamais."]]}
  ]},
  moka:{title:"Toujours en retard",souv:"la montre qui retarde",beats:[
    {at:"moka",goal:"Moka vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["moka","surprise",`Oh ! ${ME()} ! Je suis en retard… Pour quoi, déjà ?`],
      ["moka","joy","Je sais ! Une course jusqu'à la mare. Cette fois, c'est moi qui gagne."]]},
    {at:"@pond",game:{k:"order",who:"moka",n:10,time:10,win:"Gagné ! Moka arrive… en retard."},goal:"Fais la course avec Moka jusqu'à la mare.",lines:[
      ["moka","joy","Battu ! Comme d'habitude. Au moins, je suis à l'heure pour perdre."],
      ["moka","shy","Tiens, ma montre. Elle retarde de dix minutes… C'est peut-être pour ça."]]}
  ]},
  // un feuilleton d'amour sur trois histoires (demande de Joffray) : Pain d'épice cherche quelqu'un et n'y arrive pas,
  // Libellule passe entre les deux (pour oublier un peu), puis Brioche arrive, qui cherche aussi : tu les réunis
  painepice:{title:"Quelqu'un pour moi",souv:"le biscuit en forme de cœur",beats:[
    {at:"painepice",goal:"Pain d'épice vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["painepice","open",`${ME()}, tu sens ? Cannelle, miel, four chaud. C'est moi : je sens le goûter.`],
      ["painepice","sad","Tout le monde ici a quelqu'un. Moi, je fais des gâteaux… et je les mange tout seul."],
      ["painepice","shy","J'aimerais trouver quelqu'un. Quelqu'un rien que pour moi. Tu m'aides ?"]]},
    {at:"*",goal:"Demande à un renard s'il connaît quelqu'un pour Pain d'épice.",lines:id=>[
      ["me","open",`${FOX[id].name}, tu connais quelqu'un pour Pain d'épice ?`],
      [id,"surprise","Quelqu'un ? Ici, on se connaît tous depuis toujours…"],
      [id,"open","Essaie la forêt. Un signal, le soir, ça se voit de très loin."]]},
    {at:"@lampL",lamps:1,game:{k:"firefly",say:"Attrape la luciole dorée : elle portera le signal jusqu'au fond de la forêt !",win:"Le signal est parti !"},goal:"Envoie un signal à la forêt depuis les lanternes.",lines:[
      ["painepice","joy","Toutes les lanternes allumées… Si quelqu'un est là-bas, il les verra."],
      ["me","joy","Et maintenant, on attend."]]},
    {at:"painepice",goal:"Va voir si quelqu'un a répondu au signal.",lines:[
      ["painepice","sad","Personne. Pas un bruit dans la forêt."],
      ["painepice","open","Tant pis. Je garde un biscuit au chaud, en forme de cœur. On ne sait jamais."],
      ["painepice","shy","Tiens, prends le premier. Tu as essayé, c'est déjà beaucoup."]]}
  ]},
  libellule:{title:"Le ciel dans la mare",souv:"le galet lisse comme l'eau calme",beats:[
    {at:"libellule",after:[["libellule","pond"]],goal:"Libellule vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["libellule","open","Bonjour… Chut. Regarde la mare : quand l'eau est calme, on voit le ciel dedans."],
      ["libellule","sad","Mais il y a toujours une mouche, ou Plouf, pour faire des ronds. Je n'ai jamais vu la lune dedans."]]},
    {at:"libellule",game:{k:"still",label:"L'eau se calme…",say:"Chasse les mouches avant qu'elles touchent l'eau !",win:"Plus un rond… Regarde !"},goal:"Aide Libellule à garder la mare bien calme.",lines:[
      ["libellule","surprise","La lune… dans la mare. Toute ronde."],
      ["libellule","joy","Je te donne mon galet le plus lisse. Il est calme comme l'eau ce soir."]]}
  ]},
  brioche:{title:"Moitié-moitié",souv:"la recette du goûter à deux",cast:["painepice"],beats:[
    {at:"brioche",goal:"Brioche vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["brioche","joy",`Bonjour ${ME()} ! Un soir, j'ai vu des lanternes au loin. J'ai marché, marché…`],
      ["brioche","shy","Et puis il y avait cette odeur. Cannelle, miel, four chaud. Je l'ai suivie jusqu'ici."],
      ["brioche","sad","Tu sais, j'aimerais trouver quelqu'un. Quelqu'un avec qui partager le goûter."],
      ["me","surprise","Cannelle, miel, four chaud… Attends-moi là !"]]},
    {at:"painepice",goal:"Cannelle, miel, four chaud : tu connais quelqu'un qui sent comme ça.",lines:[
      ["painepice","surprise","Une renarde ? Qui a vu les lanternes ? Qui a suivi… mon odeur ?"],
      ["painepice","sad","Je ne peux pas y aller comme ça. Je sens le four !"],
      ["me","joy","C'est justement ça qu'elle a suivi."],
      ["painepice","shy","Alors il me faut un gâteau. Un vrai. Tu m'aides à ramasser des pommes ?"]]},
    {at:"@tree",game:{k:"basket",n:8,win:"Assez pour un gâteau à deux étages !"},after:[["painepice","bench1"]],goal:"Ramasse des pommes pour le gâteau de Pain d'épice.",lines:[
      ["painepice","joy","Un étage pour elle, un étage pour moi. Et le biscuit en cœur, dessus."],
      ["painepice","shy","Tu peux lui dire de venir sur le banc ? Moi, mes pattes tremblent."]]},
    {at:"brioche",stay:["painepice"],after:[["brioche","bench2"]],goal:"Dis à Brioche que quelqu'un l'attend sur le banc.",lines:[
      ["me","joy","Quelqu'un t'attend sur le banc. Avec un gâteau."],
      ["brioche","surprise","Un gâteau ? Pour moi ?"]]},
    {at:"@bench",rain:1,stay:["painepice","brioche"],goal:"Va voir Pain d'épice et Brioche sur le banc.",lines:[
      ["painepice","sad","Il pleut… Le gâteau va être tout mouillé."],
      ["brioche","joy","Tant pis. On reste là."],
      ["painepice","shy","J'ai… gardé un biscuit au chaud. Depuis longtemps. Pour quelqu'un."],
      ["brioche","surprise","Cannelle, miel… C'est toi, l'odeur que j'ai suivie !"],
      ["painepice","joy","Et c'est moi qui ai allumé les lanternes. Enfin, avec un peu d'aide."],
      ["brioche","shy","On partage ? Moitié-moitié."],
      ["painepice","joy","Moitié-moitié. Et le goûter de demain aussi."],
      ["brioche","joy",`Tiens, ${ME()}, la recette. Pour deux. C'est grâce à toi.`]]}
  ]},
  // la maison (demande de Joffray) : Copeau répare la porte coincée, Sésame l'ouvre ; ensuite on y entre (maison.js) et Copeau l'agrandit
  copeau:{title:"La porte coincée",souv:"le clou porte-bonheur",beats:[
    {at:"copeau",goal:"Copeau vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["copeau","joy",`Bonjour ${ME()} ! Copeau, bricoleur. Je répare tout ce qui grince, tout ce qui coince, tout ce qui penche.`],
      ["copeau","surprise","Et cette porte… Elle est coincée depuis combien de temps ?"],
      ["me","shy","Depuis toujours. On vit dehors, sous le porche."],
      ["copeau","open","Dehors ? Avec une maison juste là ? Viens, on s'en occupe."]]},
    {at:"@porch",game:{k:"nails",n:5,time:12,say:"Les gonds sont tout rouillés. Plante les clous neufs : trois coups chacun !",win:"Tac, tac, tac ! Des gonds tout neufs."},goal:"Aide Copeau à réparer la porte de la maison.",lines:[
      ["copeau","joy","Elle ne grince plus du tout. Écoute ce silence !"],
      ["copeau","surprise","…Mais elle ne s'ouvre toujours pas. Il y a une serrure. Et pas de clé."],
      ["petitpois","sad","Personne n'a jamais eu la clé…"]]},
    {at:"copeau",goal:"Copeau réfléchit devant la porte.",lines:[
      ["copeau","open","Une serrure comme ça, je n'en ai vu qu'une fois. Chez un renard bleu comme la nuit, qui habitait ici il y a longtemps."],
      ["copeau","shy","Il perdait toutes ses clés. Toutes. Il passe encore dans la forêt, le soir, à chercher par terre."],
      ["copeau","joy","En attendant, garde ce clou. Le premier que j'ai planté ici. Ça porte bonheur."]]}
  ]},
  // Sésame perd tout le temps ses clés (idée de Joffray) : celle de la maison aussi, il y a longtemps
  sesame:{title:"La clé perdue",souv:"la clé de la maison",cast:["copeau"],beats:[
    {at:"sesame",goal:"Un renard bleu nuit fouille l'herbe. Va lui dire bonjour.",lines:[
      ["sesame","surprise",`Oh ! Bonsoir, ${ME()}. Tu n'aurais pas vu une clé ? Dorée, avec un ruban rouge ?`],
      ["me","open","…Celle que tu as autour du cou ?"],
      ["sesame","shy","Ah. Oui. Non ! Celle-là, c'est la clé de ma boîte aux lettres. Que j'ai perdue."],
      ["sesame","sad","Je perds toutes mes clés. Celle de cette maison, je l'ai perdue il y a très longtemps, quand j'habitais ici. Depuis, la porte est fermée."]]},
    {at:"@leaves",game:{k:"search",item:"key",say:"Sésame perd souvent ses clés dans les feuilles. Fouille !",win:"Une clé !"},goal:"Cherche la clé de Sésame dans le tas de feuilles.",lines:[
      ["sesame","joy","Une clé ! … Ah non. C'est celle de mon ancien cabanon. Je la cherchais depuis trois hivers."],
      ["sesame","open","La clé de la maison brillait plus. Beaucoup plus."],
      ["copeau","surprise","Ce qui brille… La pie du grand arbre ramasse tout ce qui brille !"]]},
    {at:"@tree",game:{k:"shake",item:"key",catch:1,say:"Secoue le grand arbre ! Rattrape la clé avant qu'elle tombe !",win:"Rattrapée au vol !"},goal:"Fais tomber le trésor de la pie, dans le grand arbre.",lines:[
      ["sesame","surprise","C'est elle ! La clé de la maison ! Avec mes initiales gravées dessus !"],
      ["copeau","joy","Les gonds sont neufs, la serrure est huilée. À toi l'honneur."]]},
    {at:"@porch",goal:"Ouvre la porte avec Sésame.",lines:[
      ["sesame","shy","Elle tourne… Clic."],
      ["sesame","joy","Une cheminée, un tapis, et de la place pour tout le monde. Bienvenue chez toi."],
      ["copeau","open","Un peu petit, quand même. Je vais pouvoir agrandir tout ça…"],
      ["sesame","open",`Tiens, ${ME()}, garde la clé. Moi, je la perdrais avant ce soir. Touche la porte pour entrer.`]]}
  ]},
  // lot du 27/10/2026 : les six derniers clients du Café sans histoire
  marquis:{title:"Rien que du moelleux",souv:"le nœud de soie",beats:[
    {at:"marquis",goal:"Marquis vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["marquis","open",`Bonsoir, ${ME()}. Marquis, enchanté. Je resterai debout, merci.`],
      ["marquis","sad","La souche ? Trop dure. Le banc ? Trop froid. L'herbe ? Elle pique."],
      ["marquis","shy","Je ne m'assois que sur du moelleux. C'est une question de dignité."]]},
    {at:"brindille",goal:"Demande à Mamie Brindille si elle peut coudre un coussin.",lines:[
      ["brindille","joy","Un coussin pour ce petit monsieur ? Bien sûr, mon chou."],
      ["brindille","sad","Mais ma pelote de laine a encore roulé sous les feuilles…"]]},
    {at:"@leaves",game:{k:"search",item:"wool",say:"La pelote de Mamie Brindille est sous un des tas : il frémit quand elle bouge. 3 essais !",win:"La pelote !"},after:[["marquis","bench1"]],goal:"Retrouve la pelote de Mamie Brindille dans les feuilles.",lines:[
      ["brindille","joy","Trois points, deux nœuds… Voilà un coussin bien dodu. Va, porte-le-lui."]]},
    {at:"marquis",goal:"Apporte le coussin à Marquis, sur le banc.",lines:[
      ["marquis","surprise","Pour moi ? Brodé ?"],
      ["marquis","joy","…Oh. Que c'est moelleux. Je ne me relèverai plus jamais."],
      ["marquis","shy","Tiens, mon nœud de soie. Un marquis paie toujours ses dettes."]]}
  ]},
  zaza:{title:"Chut",souv:"le grelot qui ne sonne pas",beats:[
    {at:"zaza",goal:"Zaza vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["zaza","surprise",`${ME()} ! Tu entends ? Non ? Moi, j'entends tout.`],
      ["zaza","sad","Une mouche qui bâille. Une feuille qui tombe. Somnus qui ronfle au fond de la forêt. Je ne dors jamais."],
      ["zaza","shy","Juste une fois, je voudrais un vrai silence."]]},
    {at:"zaza",game:{k:"still",label:"Zaza s'endort…",say:"Zaza ferme les yeux. Chasse les mouches avant qu'elles bourdonnent à ses oreilles !",win:"Plus un bruit…"},goal:"Fais le silence autour de Zaza.",lines:[
      ["zaza","shy","Mmh… J'ai dormi. Vraiment dormi. J'ai rêvé de mon désert."],
      ["zaza","joy","Tiens, mon grelot. Je l'ai bouché exprès : il ne sonne pas. Comme ça, tu penseras au silence."]]}
  ]},
  flocon:{title:"Une lumière à soi",souv:"le bocal-veilleuse",beats:[
    {at:"flocon",goal:"Flocon vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["flocon","shy",`Bonsoir ${ME()}… Pardon, je suis un peu perdu. J'ai suivi une lumière toute la nuit.`],
      ["flocon","sad","Chez moi, dans la neige, il fait noir six mois. Alors dès que quelque chose brille, je le suis. Les lanternes, la lune, la queue de Luciole…"],
      ["luciole","surprise","C'est toi qui me suis partout depuis ce matin ?"]]},
    {at:"luciole",goal:"Demande conseil à Luciole.",lines:[
      ["luciole","joy","Il lui faut une lumière rien qu'à lui. Une qu'il garde près de son lit."],
      ["luciole","open","Les lucioles dorées sont les plus douces. Il y en a toujours une près des lanternes."]]},
    {at:"@lampL",game:{k:"firefly",say:"Une seule luciole brille en or. Attrape-la pour Flocon !",win:"Dans le bocal !"},goal:"Attrape une luciole dorée pour Flocon, près des lanternes.",lines:[
      ["flocon","surprise","Pour moi ? Une lumière qui reste ?"],
      ["flocon","joy","Je n'aurai plus besoin de suivre personne. Je pourrai enfin m'endormir."],
      ["flocon","shy","Garde ce bocal vide, celui d'avant. Il a tenu toutes mes nuits d'hiver."]]}
  ]},
  noisette:{title:"Le gland d'or",souv:"le carnet du professeur",beats:[
    {at:"noisette",goal:"Le Professeur Noisette vient d'arriver. Va lui dire bonjour.",lines:[
      ["noisette","open",`Ah, ${ME()} ! Professeur Noisette. J'étudie les glands depuis quarante saisons.`],
      ["noisette","surprise","Et mes calculs sont formels : au sommet de ce grand arbre pousse le seul gland d'or de la forêt."],
      ["noisette","shy","Seulement… je n'ai jamais grimpé. Le vertige. Et mes lunettes glissent."]]},
    {at:"@tree",game:{k:"shake",item:"acorn",catch:1,say:"Secoue le grand arbre ! Le gland d'or va tomber : attrape-le au vol !",win:"Le gland d'or !"},goal:"Fais tomber le gland d'or du grand arbre.",lines:[
      ["noisette","surprise","Il existe ! Quarante saisons… J'avais raison !"]]},
    {at:"noisette",goal:"Rends le gland d'or au Professeur Noisette.",lines:[
      ["noisette","joy","Je vais l'étudier… Non. Je vais le planter. Dans quarante saisons, il y aura un arbre d'or ici."],
      ["noisette","shy","Prends mon carnet. Tout ce que je sais des glands est dedans. Il te servira plus qu'à moi."]]}
  ]},
  givre:{title:"Disparu",souv:"la boule de neige qui ne fond pas",beats:[
    {at:"givre",goal:"Givre vient d'arriver au refuge. Va lui dire bonjour.",lines:[
      ["givre","joy",`Coucou ${ME()} ! Chez moi, je me roule dans la neige jusqu'à disparaître. Personne ne me trouve jamais !`],
      ["givre","sad","Mais ici, pas de neige. Tout le monde me voit. C'est nul."],
      ["givre","open","Oh ! Les coussins de Pantoufle sont tout blancs… Tu me cherches ?"]]},
    {at:"givre",game:{k:"cushion",who:"givre",say:"Givre se cache sous un coussin. Suis-le des yeux !"},goal:"Joue à cache-cache avec Givre.",lines:[
      ["givre","surprise","Tu m'as trouvé ? Même sous les coussins ?"],
      ["givre","joy","Personne ne m'avait jamais trouvé ! C'est encore mieux que disparaître."],
      ["givre","shy","Tiens, une boule de neige de chez moi. Elle ne fond jamais, je ne sais pas pourquoi."]]}
  ]},
  // Comète ne vient pas de ce monde (idée de Joffray) : une étoile filante tombée dans la mare, qui a perdu sa traînée
  comete:{title:"Pas d'ici",souv:"l'éclat d'étoile toujours tiède",cast:["noisette"],beats:[
    {at:"comete",goal:"Une lumière est tombée près de la mare cette nuit. Va voir.",lines:[
      ["comete","surprise","Où… où suis-je ? Ce n'est pas mon ciel. Il n'y a qu'une lune, ici ?"],
      ["me","open",`Tu es au refuge. Moi, c'est ${ME()}. Tu viens d'où ?`],
      ["comete","sad","De là-haut. Très loin derrière la lune. Je passais trop près, et j'ai glissé de ma route."],
      ["comete","shy","Je brillais tellement, avant. Il me reste à peine une étincelle."]]},
    {at:"noisette",goal:"Le Professeur Noisette a peut-être une explication.",lines:[
      ["noisette","surprise","Fascinant… Une étoile filante. Vivante ! Toutes mes lectures disaient que c'était impossible."],
      ["noisette","open","Pour remonter, il lui faut sa traînée. En tombant, elle s'est éparpillée en éclats dans toute la clairière."]]},
    {at:"@pond",game:{k:"catch",n:6,say:"Les éclats de la traînée flottent au-dessus de la mare. Attrape-les tous !",win:"Tous les éclats !"},goal:"Ramasse les éclats de la traînée de Comète, près de la mare.",lines:[
      ["comete","joy","Ma traînée… Je la sens. Je pourrais rentrer cette nuit."]]},
    {at:"comete",goal:"Rends ses éclats à Comète.",lines:[
      ["comete","sad","Là-haut, il fait froid et tout est silencieux. Ici, il y a des lanternes, une mare qui garde la lune… et toi."],
      ["comete","open","Alors je reste. Une nuit par lune, je remonterai dire bonjour à mon ciel. C'est la seule nuit où on me voit là-haut."],
      ["comete","joy",`Tiens, ${ME()}. Un éclat que je n'ai pas rendu. Il restera tiède, comme une étoile dans ta poche.`]]}
  ]},
  // les six sauvages de la gamelle (27/10/2026) : leur histoire vient après leur première visite, puis ils s'installent.
  // Une sur deux avec un jeu (Joffray : « pas obligé de faire des jeux pour tous »)
  somnus:{title:"La vingt-quatrième heure",souv:"le bonnet de nuit de rechange",beats:[
    {at:"somnus",sleep:1,goal:"Somnus est revenu de la forêt. Il dort, évidemment. Réveille-le doucement.",lines:[
      ["somnus","shy",`Mmh… ${ME()} ? C'est l'heure ? Ma seule heure réveillée de la journée ?`],
      ["somnus","open","D'habitude, je la passe à bâiller. Mais aujourd'hui, je voudrais voir quelque chose de beau."]]},
    {at:"@pond",goal:"Montre la mare à Somnus.",lines:[
      ["somnus","surprise","De l'eau qui brille… Je l'avais toujours vue en rêve. En vrai, c'est mieux."],
      ["somnus","open","Encore un endroit. Vite, mon heure file."]]},
    {at:"@bench",goal:"Emmène Somnus jusqu'au banc.",lines:[
      ["somnus","joy","Le banc. La mare. Les lanternes. Et quelqu'un à côté."],
      ["somnus","shy","C'était… la plus belle heure de toutes. Je crois que je vais rester ici pour les prochaines."],
      ["somnus","shy","Tiens, mon bonnet de rechange. Pour les jours où toi aussi tu… zzz…"]]}
  ]},
  reglisse:{title:"Le secret sous la souche",souv:"le plan des tunnels",beats:[
    {at:"reglisse",goal:"Réglisse est revenu de la forêt. Va lui dire bonjour.",lines:[
      ["reglisse","open",`Bonsoir, ${ME()}. Je connais tous les tunnels de la forêt. Et tous les secrets de tes renards.`],
      ["reglisse","shy","Ils me les racontent. Je ne répète jamais. Enfin… presque jamais."]]},
    {at:"*",goal:"Demande à un renard s'il a déjà confié un secret à Réglisse.",lines:id=>[
      ["me","open",`${FOX[id].name}, tu as déjà raconté un secret à Réglisse ?`],
      [id,"shy","…Peut-être. Mais il ne l'a jamais répété. C'est pour ça qu'on lui dit tout."],
      [id,"surprise","Par contre, lui, il en a un. Il gratte toujours sous la souche."]]},
    {at:"@stump",goal:"Va voir ce que Réglisse cache sous la souche.",lines:[
      ["reglisse","surprise","Tu m'as trouvé. Bon. Mon secret, c'est un tunnel."],
      ["reglisse","joy","Il va de la souche jusque sous la maison. Quand il pleut, je passe par là pour être au chaud sans me mouiller."],
      ["reglisse","shy","Je te donne le plan. Personne d'autre ne l'a jamais vu. Garde le secret."]]}
  ]},
  aurore:{title:"Chaque nuit une autre",souv:"le ruban qui change de couleur",beats:[
    {at:"aurore",goal:"Aurore est revenue de la forêt. Va lui dire bonjour.",lines:[
      ["aurore","sad",`${ME()}… Personne ne me reconnaît jamais. La nuit, mon pelage change : rose, puis vert, puis violet.`],
      ["aurore","shy","Le lendemain, tout le monde croit que je suis une autre. Alors je reste seule."]]},
    {at:"*",goal:"Demande à un renard s'il reconnaîtrait Aurore.",lines:id=>[
      ["me","open",`${FOX[id].name}, si Aurore change de couleur, tu la reconnais ?`],
      [id,"open","À sa voix, bien sûr. Et à sa façon de pencher la tête quand elle écoute."],
      [id,"joy","La couleur, c'est juste une surprise en plus."]]},
    {at:"aurore",goal:"Dis à Aurore ce que les autres ont répondu.",lines:[
      ["aurore","surprise","À ma voix ? À ma façon de pencher la tête ?"],
      ["aurore","joy","Alors je peux changer de couleur autant que je veux. Je resterai moi."],
      ["aurore","shy","Prends ce ruban. Il change de couleur avec moi, chaque nuit. Comme ça, on sera deux."]]}
  ]},
  maree:{title:"Contre le courant",souv:"le galet aux quatre ricochets",beats:[
    {at:"maree",goal:"Marée est revenue de la rivière. Va lui dire bonjour.",lines:[
      ["maree","open",`Bonjour ${ME()}. J'arrive avec le courant, je repars avec lui. Toujours.`],
      ["maree","sad","Mais ici, je voudrais rester. Seulement, la rivière m'appelle chaque soir."],
      ["maree","shy","On dit qu'un galet qui rebondit quatre fois sur l'eau répond à la rivière à ta place."]]},
    {at:"@pond",game:{k:"ricochet",need:4},goal:"Fais faire quatre ricochets pour Marée, sur la mare.",lines:[
      ["maree","surprise","Quatre ! La rivière a entendu."],
      ["maree","joy","Ce soir, elle partira sans moi. Je reste au refuge."],
      ["maree","shy","Garde le galet. Il a dit oui pour moi."]]}
  ]},
  perle:{title:"La perle perdue",souv:"une perle de son collier",beats:[
    {at:"perle",goal:"Perle est revenue de la rivière. Va lui dire bonjour.",lines:[
      ["perle","joy",`${ME()} ! Je venais te remercier pour la gamelle. Tu as vu mon collier ? Chaque perle vient d'un coquillage.`],
      ["perle","sad","Oh non… Il en manque une. Elle a dû rouler sous les feuilles."]]},
    {at:"@leaves",game:{k:"search",item:"pearl",say:"La perle a roulé sous un des tas. Il frémit quand elle bouge. 3 essais !",win:"La perle !"},goal:"Retrouve la perle de Perle dans les feuilles.",lines:[
      ["perle","joy","Elle brille encore plus après un tour dans les feuilles."],
      ["perle","shy","Garde-la. Mon collier sera plus court, mais j'aurai une raison de revenir. Et puis… je crois que je vais rester."]]}
  ]},
  yeti:{title:"Personne n'y croit",souv:"un poil tout doux du Yéti",beats:[
    {at:"petitpois",hide:1,goal:"Petit Pois a vu quelque chose dans le brouillard.",lines:[
      ["petitpois","surprise",`${ME()} ! Il y avait une ombre énorme près de la gamelle. Énorme ! Avec un bonnet !`],
      ["petitpois","shy","Personne ne me croit. Tu viens voir avec moi ?"]]},
    {at:"@lampL",hide:1,game:{k:"lantern",who:"yeti",win:"Trouvé ! Il est… énorme. Et tout doux."},after:[["yeti","lampL"]],goal:"Prends une lanterne et cherche l'ombre dans le brouillard.",lines:[
      ["yeti","shy","Bonsoir. Pardon. Je suis très discret, d'habitude."],
      ["yeti","sad","Quand on est aussi gros, tout le monde a peur. Alors je me cache, et plus personne ne croit que j'existe."],
      ["petitpois","joy","Moi, j'y crois ! Je l'ai dit le premier !"]]},
    {at:"yeti",goal:"Va voir le Yéti près des lanternes.",lines:[
      ["yeti","joy","Si je reste, vous me ferez une place près du feu ? Je prends beaucoup de place, mais je tiens chaud."],
      ["yeti","shy",`Tiens, ${ME()}. Un poil de ma fourrure. La preuve que j'existe.`]]}
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
      ["gribouille","shy","Le peintre, on ne le voit jamais. C'est normal."],
      ["petitpois","open","Prête-moi ta queue, Gribouille. J'ai une idée."]]},
    {at:"gribouille",game:{k:"portrait"},goal:"Va voir le tableau de Gribouille.",lines:[
      ["petitpois","joy","Là, dans le coin. Un peu de travers… Voilà : toi."],
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
// Gribouille vient en tout dernier, le 30e renard (demande de Joffray) : son histoire attend que tous les autres
// renards aient fini la leur, même celles qui ne sont pas encore écrites
const LAST="gribouille",OTHERS=FOXES.filter(f=>!f.event&&f.id!=="roussette"&&f.id!==LAST).map(f=>f.id);
const lastReady=()=>OTHERS.every(id=>STORIES[id]&&storyDone(id));
// un sauvage n'a son histoire qu'une fois croisé à la gamelle ; ensuite il s'installe au refuge (Joffray, 27/10/2026)
const nextId=()=>ORDER.find(k=>!storyDone(k)&&(k!==LAST||lastReady())&&(!WILD[k]||R.met[k]||isRes(k)));
const wildLeft=()=>ORDER.filter(k=>WILD[k]&&!storyDone(k)&&!R.met[k]&&!isRes(k));
// arrivé trop tôt (avant le 26/10/2026) : il repart, il reviendra en dernier
if(isRes(LAST)&&!storyDone(LAST)&&!lastReady()){delete R.res[LAST];delete R.beat[LAST];delete R.who[LAST];save()}
// l'histoire en cours et le moment attendu (null si on attend le prochain renard)
function cur(){if(!R.intro)return null;const id=nextId();if(!id||!isRes(id))return null;
  const n=R.beat[id]||0;if(!n&&Date.now()<(R.nextAt||0))return null;return {id,n,b:beats(id)[n]}}
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
    R.beat[c.id]=c.n+1;if(b.rain)rainTill=Date.now()+18e4;if(b.stay){stayIds=b.stay;stayTill=Date.now()+18e4}
    for(const [fid,sp] of b.after||[]){const f=foxes.find(x=>x.id===fid&&!x.wild);if(!f||f.walk)continue;
      if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y;drawGlow()}goTo(f,SPOT[sp])}R.glands+=3; // chaque moment rapporte des glands, la fin d'une histoire bien plus
    if(b.leave){const f=foxes.find(x=>x.id===at);if(f)f.until=0}
    if(c.id==="gaston"&&storyDone("gaston")){drawBg();log("La pêche est ouverte : touche la mare quand tu veux.")}
    if(storyDone(c.id)){R.souv[c.id]=STORIES[c.id].souv;R.nextAt=VITE||ORDER.indexOf(c.id)<1?0:nextMorning();R.glands+=15;toast(`Souvenir reçu : ${STORIES[c.id].souv}. +18 glands`)}
    else toast("+3 glands");
    if(storyDone(c.id)&&c.id!=="petitpois"&&!R.lure&&!metAny())setTimeout(firstLure,500);
    else if(storyDone(c.id))setTimeout(wildNudge,600);
    if(storyDone(c.id)&&c.id!=="petitpois")setTimeout(pushInvite,2500); // proposer les notifications, une fois
    save();renderStory();renderHud();syncRain();
  });
  if(b.game)playGame({...b.game,target:at},go);else go();
  return true;
}

/* ---------- avant de partir : la gamelle ---------- */
// à la fin des premières histoires, Petit Pois remplit la gamelle de baies : un sauvage viendra pendant ton absence
// (la copine de Joffray a fermé le jeu une fois les histoires finies, sans raison de revenir)
function firstLure(){if(R.lure)return;R.lure=1;save();
  talk([["petitpois","open","Avant d'aller dormir… J'ai cueilli des baies des bois. On les met dans la gamelle ?"],
    ["petitpois","joy","Des fois, quand tout le monde dort, un renard sauvage vient manger. Il laisse toujours une trace…"],
    ["petitpois","joy","Reviens demain : on regardera ensemble qui est venu !"]],
    ()=>{R.bowl={type:"baies",until:Date.now()+BOWLS.baies.hours*36e5};save();renderHud();drawBowl();log("Des baies des bois dans la gamelle. Qui va venir ?")})}

// il ne reste que les sauvages jamais croisés : Petit Pois le dit une fois et remplit la gamelle de baies
// (sinon un joueur qui ne touche pas à la gamelle restait bloqué avant Gribouille)
function wildNudge(){if(R.wildNudge||!R.intro||cur()||nextId()||!wildLeft().length||gameOn||!$("talk").hidden||!$("sheet").hidden)return;
  R.wildNudge=1;save();
  talk([["petitpois","surprise",`${ME()}, tu as entendu ? Ça gratte dans les buissons, tous les soirs.`],
    ["petitpois","open","Ce sont les renards sauvages. Ils ont chacun une histoire, mais ils ne sortent que pour manger."],
    ["petitpois","joy","Je mets des baies dans la gamelle. Après, il faudra du poisson, ou même du miel : chacun a ses goûts. Regarde la fiche des sauvages dans le carnet !"]],
    ()=>{if(!R.bowl){R.bowl={type:"baies",until:Date.now()+BOWLS.baies.hours*36e5};save()}renderHud();log("La gamelle attend les sauvages.")})}

/* ---------- repères : signes, endroit qui brille, objectif ---------- */
const hotEl=document.createElement("button");hotEl.className="hot";hotEl.type="button";hotEl.hidden=true;
hotEl.innerHTML=`<i class="mark">!</i>`;
hotEl.onpointerdown=e=>{e.stopPropagation();const c=cur();if(c)storyTap(c.b.at)};
$("lights").appendChild(hotEl); // au-dessus du voile de la nuit, comme les signes des renards
function goalText(){const c=cur();
  if(c)return {t:`${STORIES[c.id].title} · ${c.n+1} sur ${beats(c.id).length}`,g:c.b.goal};
  const e=envGoal();if(e)return e; // pas d'histoire en cours : la petite envie du moment
  const id=nextId();
  if(!id)return {t:"Histoires",g:storyDone(LAST)?"Toutes les histoires sont finies.":wildLeft().length?"Des renards sauvages rôdent encore autour de la gamelle. Remplis-la : chacun a une histoire à raconter.":"La suite des histoires arrive bientôt."};
  const w=R.nextAt-Date.now()>36e5?"un peu plus tard":"bientôt"; // pas d'heure précise (Joffray)
  return {t:"Prochaine histoire",g:isRes(id)?`${FOX[id].name} aura quelque chose à te raconter ${w}.`:`Quelqu'un approche par la forêt… Il arrivera ${w}.`};
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
  const g=goalText();$("goal").hidden=false;$("goal").innerHTML=`<span><b>${g.t}</b>${g.g}</span><i aria-hidden="true">›</i>`;
}

/* ---------- le journal des histoires ---------- */
function journal(){
  const c=cur(),nx=nextId();
  const row=id=>{const S=STORIES[id],n=R.beat[id]||0,N=beats(id).length,f=FOX[id];
    if(storyDone(id))return `<div class="opt"><span class="thumb">${foxArt(f,{expr:"joy",portrait:1})}</span><div class="txt"><strong>${S.title}</strong><span>${f.name} · terminée. Souvenir : ${R.souv[id]||S.souv}.</span></div><button class="btn ghost" data-reread="${id}" type="button">Relire</button></div>`;
    const dots=`<span class="dots">${Array.from({length:N},(_,i)=>`<i class="${i<n?"on":""}"></i>`).join("")}</span>`;
    if(c&&c.id===id)return `<div class="opt now"><span class="thumb">${foxArt(f,{expr:"open",portrait:1})}</span><div class="txt"><strong>${S.title}</strong>${dots}<span>${c.b.goal}</span></div></div>`;
    if(id===nx)return `<div class="opt"><span class="thumb">${foxArt(f,{portrait:1,sil:!isRes(id)})}</span><div class="txt"><strong>${isRes(id)?S.title:"???"}</strong><span>${goalText().g}</span></div></div>`;
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
