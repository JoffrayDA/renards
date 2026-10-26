/* La Clairière : les histoires. Voir docs/clairiere-v2.md, « Les histoires ».
   Une seule histoire à la fois, dans l'ordre d'ORDER. Le renard arrive pour son histoire (ou elle démarre s'il est déjà là),
   le matin qui suit la fin de la précédente (nextMorning). Une histoire est une suite de moments : un renard ou un endroit
   porte un signe, on le touche, le dialogue se joue, et le moment suivant s'ouvre aussitôt. Ni amitié, ni météo, ni attente.
   R.beat[id] = moments finis ; R.souv[id] = souvenir reçu ; R.nextAt = quand la prochaine histoire peut commencer ;
   R.who[id][i] = le renard touché pour un moment « * » (pour relire l'histoire).
   at : un renard, "@endroit" (TG) ou "*" (n'importe quel autre renard du refuge). goal : ce qu'il faut faire pour ce moment.
   "me" parle : c'est Roussette, avec le nom choisi au Café. */
// un renard par jour (décidé avec Joffray le 26/10/2026) : le suivant arrive au matin (6 h), au moins 6 h après la fin ;
// les deux premières histoires s'enchaînent pour accrocher ; ?vite=1 pour tester sans attendre
const VITE=/[?&]vite=1/.test(location.search);
function nextMorning(){const d=new Date(Date.now()+6*36e5);if(d.getHours()>=6)d.setDate(d.getDate()+1);d.setHours(6,0,0,0);return d.getTime()}
if(VITE)R.nextAt=0;
const TG={pond:{x:96,y:418,name:"la mare"},porch:{x:200,y:226,name:"le porche"},lampL:{x:60,y:214,name:"les lanternes"},stump:{x:85,y:288,name:"la souche"},
  leaves:{x:322,y:334,name:"le tas de feuilles"},tree:{x:366,y:150,name:"le grand arbre"},bench:{x:300,y:398,name:"le banc"}};
// Gribouille vient en dernier : son histoire réunit tout le monde pour le grand portrait. Les nouvelles histoires se glissent avant lui.
const ORDER=["petitpois","mitaine","luciole","gaston","galette","pantoufle","grignote","brindille","plouf","biscuit","cannelle","charbon","brume","moka","painepice","libellule","brioche","gribouille"];
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
    {at:"libellule",game:{k:"still",say:"Chasse les mouches avant qu'elles touchent l'eau !",win:"Plus un rond… Regarde !"},goal:"Aide Libellule à garder la mare bien calme.",lines:[
      ["libellule","surprise","La lune… dans la mare. Toute ronde."],
      ["libellule","joy","Je te donne mon galet le plus lisse. Il est calme comme l'eau ce soir."]]}
  ]},
  brioche:{title:"Moitié-moitié",souv:"la recette du goûter à deux",beats:[
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
    {at:"brioche",after:[["brioche","bench2"]],goal:"Dis à Brioche que quelqu'un l'attend sur le banc.",lines:[
      ["me","joy","Quelqu'un t'attend sur le banc. Avec un gâteau."],
      ["brioche","surprise","Un gâteau ? Pour moi ?"]]},
    {at:"@bench",goal:"Va voir Pain d'épice et Brioche sur le banc.",lines:[
      ["painepice","shy","J'ai… gardé un biscuit au chaud. Depuis longtemps. Pour quelqu'un."],
      ["brioche","surprise","Cannelle, miel… C'est toi, l'odeur que j'ai suivie !"],
      ["painepice","joy","Et c'est moi qui ai allumé les lanternes. Enfin, avec un peu d'aide."],
      ["brioche","shy","On partage ? Moitié-moitié."],
      ["painepice","joy","Moitié-moitié. Et le goûter de demain aussi."],
      ["brioche","joy",`Tiens, ${ME()}, la recette. Pour deux. C'est grâce à toi.`]]}
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
const nextId=()=>ORDER.find(k=>!storyDone(k)&&(k!==LAST||lastReady()));
// arrivé trop tôt (avant le 26/10/2026) : il repart, il reviendra en dernier
if(isRes(LAST)&&!storyDone(LAST)&&!lastReady()){delete R.res[LAST];delete R.beat[LAST];delete R.who[LAST];save()}
// l'histoire en cours et le moment attendu (null si on attend le prochain renard)
function cur(){if(!R.intro)return null;const id=nextId();if(!id||!isRes(id))return null;
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
    R.beat[c.id]=c.n+1;
    for(const [fid,sp] of b.after||[]){const f=foxes.find(x=>x.id===fid&&!x.wild);if(!f||f.walk)continue;
      if(f.inside){f.inside=false;f.el.classList.remove("inside");f.x=DOOR.x;f.y=DOOR.y;drawGlow()}goTo(f,SPOT[sp])}R.glands+=3; // chaque moment rapporte des glands, la fin d'une histoire bien plus
    if(b.leave){const f=foxes.find(x=>x.id===at);if(f)f.until=0}
    if(c.id==="gaston"&&storyDone("gaston")){drawBg();log("La pêche est ouverte : touche la mare quand tu veux.")}
    if(storyDone(c.id)){R.souv[c.id]=STORIES[c.id].souv;R.nextAt=VITE||ORDER.indexOf(c.id)<1?0:nextMorning();R.glands+=15;toast(`Souvenir reçu : ${STORIES[c.id].souv}. +18 glands`)}
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
  const e=envGoal();if(e)return e; // pas d'histoire en cours : la petite envie du moment
  const id=nextId();
  if(!id)return {t:"Histoires",g:storyDone(LAST)?"Toutes les histoires sont finies.":"La suite des histoires arrive bientôt."};
  const w=R.nextAt>Date.now()?(new Date(R.nextAt).getDate()===new Date().getDate()?"ce matin":"demain matin"):"bientôt";
  return {t:"Prochaine histoire",g:isRes(id)?`${FOX[id].name} aura quelque chose à te raconter ${w}.`:`Quelqu'un approche par la forêt… Il arrivera ${w}.`};
}
function renderStory(){
  const c=cur();
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
