/* La Clairière : les histoires des inconnus de la forêt (03/11/2026, Joffray : « on finit les histoires »). Une fois son
   prénom deviné (sauvages.js), un inconnu a sa petite histoire : il arrive en courant près de Petit Pois, raconte pourquoi il
   rôdait, puis il s'installe au refuge. Elles passent avant la suite d'ORDER, sans attente (INCO_ORDER, incoNext dans story.js).
   Balafre a déjà la sienne (la bataille de neige, noel.js). Une sur deux a un petit jeu. */
// il arrive en courant, à côté de Petit Pois
function incoCome(id){const p=sF("petitpois"),x=p?Math.max(40,Math.min(360,p.x+(p.x<200?64:-64))):200,y=p?Math.max(268,Math.min(H-40,p.y+8)):340;
  actArrive(id,x,y);setTimeout(()=>actEmote(id,"!"),1600)}
Object.assign(PROP,{
  confiture:`<rect x="-12" y="-10" width="24" height="26" rx="5" fill="#7a3a6a" stroke="${INK}" stroke-width="2.2"/><path d="M-14 -16 H14 L12 -8 H-12Z" fill="#f4f0e8" stroke="${INK}" stroke-width="2"/><path d="M-14 -16 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4" fill="none" stroke="#e2546e" stroke-width="1.6"/><rect x="-7" y="0" width="14" height="9" rx="2" fill="#fff6ea" stroke="${INK}" stroke-width="1.4"/>`,
  miel:`<path d="M-13 -6 Q-15 16 0 17 Q15 16 13 -6Z" fill="#f2b440" stroke="${INK}" stroke-width="2.2"/><rect x="-14" y="-12" width="28" height="7" rx="3" fill="#c98a5a" stroke="${INK}" stroke-width="2"/><path d="M-6 -5 q0 8 -3 10 q-3 -2 0 -10" fill="#ffd36a" stroke="${INK}" stroke-width="1.2"/>`,
  mousse:`<path d="M0 16 C-18 4 -16 -12 -7 -12 Q-2 -12 0 -6 Q2 -12 7 -12 C16 -12 18 4 0 16Z" fill="#8cc06a" stroke="${INK}" stroke-width="2.4"/>${[[-6,-4],[5,-5],[0,4],[-8,4],[7,3]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="#b8e09a"/>`).join("")}`,
  balle:`<circle r="14" fill="#e2546e" stroke="${INK}" stroke-width="2.4"/><path d="M-13 -4 Q0 4 13 -4 M-11 7 Q0 13 11 7" fill="none" stroke="#fff" stroke-width="2.4"/>`,
  carton:`<path d="M-16 -6 L0 -14 L16 -6 L0 2Z" fill="#e8c890" stroke="${INK}" stroke-width="2"/><path d="M-16 -6 V12 L0 20 V2Z" fill="#d9a86a" stroke="${INK}" stroke-width="2"/><path d="M16 -6 V12 L0 20 V2Z" fill="#c9985a" stroke="${INK}" stroke-width="2"/><path d="M-10 4 l6 3" stroke="${INK}" stroke-width="1.4"/>`,
  coquillage:`<path d="M0 16 L-16 -2 Q-14 -16 0 -16 Q14 -16 16 -2Z" fill="#f6c9d4" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M0 16 L-8 -14 M0 16 L0 -16 M0 16 L8 -14" stroke="${INK}" stroke-width="1.4"/>`,
  brosse:`<rect x="-16" y="-8" width="24" height="10" rx="3" fill="#c98a5a" stroke="${INK}" stroke-width="2"/><path d="M8 -4 L18 -6 L18 0 L8 0Z" fill="#a9785a" stroke="${INK}" stroke-width="2"/><path d="M-13 2 v6 M-9 2 v6 M-5 2 v6 M-1 2 v6 M3 2 v6" stroke="${INK}" stroke-width="1.8"/>`});
Object.assign(STORIES,{
  miette:{title:"La part de Miette",souv:"la plus petite pomme du panier",beats:[
    {at:"petitpois",show:()=>incoCome("miette"),showMs:2200,goal:"Petit Pois a vu quelqu'un fouiller la gamelle.",lines:[
      ["petitpois","surprise","Quelqu'un a fini la gamelle… et mes glands… et les miettes de la tarte de Biscuit !",()=>actEmote("petitpois","!")],
      ["miette","shy","Pardon… C'est moi. J'ai toujours faim.",()=>actPose("miette","sit","shy")],
      ["miette","sad","Chez moi, je suis la plus petite. Quand j'arrive, il ne reste jamais rien. Alors je finis les restes de tout le monde.",()=>actEmote("miette","goutte")],
      ["me","joy","Et si, pour une fois, il y avait une part rien que pour toi ?",()=>{actEmote("me","!");setTimeout(()=>actGo("me",330,300),900)}]]},
    {at:"@tree",game:{k:"basket",n:8,win:"Un panier plein, rien que pour Miette !"},goal:"Remplis un panier de pommes rien que pour Miette.",lines:[
      ["me","joy","Huit pommes. Pas une de moins.",()=>actTrick("me","boing")]]},
    {at:"miette",goal:"Apporte le panier à Miette.",lines:[
      ["miette","surprise","Un panier entier ? Rien que pour moi ? Personne ne passera avant ?",()=>{actGive("me","miette","pomme",{happy:false});actEmote("miette","!")}],
      ["miette","joy","Je vais en garder pour demain. C'est la première fois que je peux garder quelque chose pour demain.",()=>{actTrick("miette","salto");actEmote("miette","coeur")}],
      ["miette","shy","Tiens, la plus petite. Comme moi. Je crois que je reste.",()=>actGive("miette","me","pomme")]]}
  ]},
  panache:{title:"Un panache décoiffé",souv:"un poil de panache tout brillant",beats:[
    {at:"petitpois",show:()=>incoCome("panache"),showMs:2200,goal:"Quelqu'un se cache derrière Petit Pois.",lines:[
      ["panache","sad","Ne me regarde pas ! Ma queue… est pleine de brindilles et de feuilles. Le vent m'a décoiffé.",()=>actEmote("panache","goutte")],
      ["panache","shy","Un panache comme le mien, ça ne se montre pas en désordre. Tu as une brosse ?",()=>actPose("panache","lie","shy")],
      ["petitpois","open","J'ai une brosse ! Pour mes oreilles, le dimanche. Viens la chercher.",()=>actEmote("petitpois","!")]]},
    {at:"petitpois",goal:"Prends la brosse de Petit Pois.",lines:[
      ["petitpois","joy","Ma brosse du dimanche. Elle est toute douce. Il en aura besoin : sa queue est immense.",()=>actEmote("petitpois","note")],
      ["petitpois","open","Brosse dans le sens du poil, et doucement sur le bout. C'est là qu'on est chatouilleux.",()=>actGive("petitpois","me","brosse",{happy:false})]]},
    {at:"panache",goal:"Brosse la queue de Panache.",lines:[
      ["me","joy","Dans le sens du poil… doucement sur le bout…",()=>{actGive("me","panache","brosse",{happy:false});setTimeout(()=>actTrick("panache","toupie"),900)}],
      ["panache","surprise","Elle brille ! Elle n'a jamais autant brillé !",()=>{actEmote("panache","!");actPose("panache","happy","joy")}],
      ["panache","joy","Ici, quelqu'un me brosse quand le vent me décoiffe. Je ne repars plus.",()=>actEmote("panache","coeur")],
      ["panache","shy","Tiens, un poil de mon panache. Le plus brillant. C'est un honneur, tu sais.",()=>actGive("panache","me","poil")]]}
  ]},
  mure:{title:"Le buisson secret",souv:"le pot de confiture de mûres",beats:[
    {at:"petitpois",show:()=>incoCome("mure"),showMs:2200,goal:"Mûre est revenue. Elle a quelque chose à te montrer.",lines:[
      ["mure","joy",`${ME()} ! Je t'avais promis le meilleur buisson de la forêt. Promis, c'est promis.`,()=>actTrick("mure","boing")],
      ["mure","shy","Il est tout près. Derrière ton tas de feuilles. Personne ne le voit jamais.",()=>{actEmote("mure","note");setTimeout(()=>actGo("me",296,372),900)}]]},
    {at:"@leaves",goal:"Suis Mûre jusqu'au buisson secret, derrière le tas de feuilles.",lines:[
      ["mure","joy","Là ! Des mûres grosses comme des glands. Goûte !",()=>{actNear("mure","me","happy");actEmote("mure","coeur")}],
      ["me","surprise","Mmh… J'ai le museau tout violet, maintenant.",()=>{actEmote("me","!");actTrick("me","boing")}],
      ["mure","joy","Bienvenue au club. On ne s'en débarrasse jamais.",()=>actTrick("mure","roll")]]},
    {at:"mure",goal:"Va voir Mûre.",lines:[
      ["mure","open","J'ai fait de la confiture avec les plus foncées. Un pot pour le refuge.",()=>actGive("mure","me","confiture")],
      ["mure","shy","Un buisson pareil, il faut quelqu'un pour le surveiller. Je vais rester. Pour le buisson. Et pour toi.",()=>actEmote("mure","coeur")]]}
  ]},
  pataud:{title:"Les abeilles s'en souviennent",souv:"le dernier pot de miel",beats:[
    {at:"petitpois",show:()=>incoCome("pataud"),showMs:2200,goal:"Pataud arrive en courant. Très vite. Trop vite.",lines:[
      ["pataud","surprise","Cache-moi ! Les abeilles ! Elles me cherchent depuis l'an dernier !",()=>{actEmote("pataud","goutte");actTrick("pataud","zoom")}],
      ["petitpois","shy","Il a mangé tout leur miel. Elles s'en souviennent.",()=>actEmote("petitpois","goutte")],
      ["pataud","sad","Je voulais juste goûter… Bon, j'ai goûté tout le pot. Et le suivant. Je vais m'excuser, mais il faut qu'elles me laissent parler.",()=>actPose("pataud","sit","sad")]]},
    {at:"pataud",game:{k:"still",label:"Pataud s'excuse auprès des abeilles…",say:"Chasse les abeilles avant qu'elles piquent Pataud, le temps qu'il s'excuse !",win:"Elles l'ont écouté !"},goal:"Protège Pataud pendant qu'il s'excuse auprès des abeilles.",lines:[
      ["pataud","joy","Elles ont accepté ! Je les aide à récolter cet été, et on est quittes.",()=>actTrick("pataud","boing")],
      ["pataud","shy","Elles m'ont même donné un pot. Le dernier. Je te le donne : sinon je le mange avant ce soir.",()=>actGive("pataud","me","miel")],
      ["pataud","open","Je reste au refuge. Ici, personne ne me court après. Enfin, presque.",()=>actEmote("pataud","coeur")]]}
  ]},
  caline:{title:"Un câlin pour chacun",souv:"le cœur de mousse",beats:[
    {at:"petitpois",show:()=>incoCome("caline"),showMs:2200,goal:"Câline vient d'arriver. Elle a les bras grands ouverts.",lines:[
      ["caline","joy",`${ME()} ! Je fais un câlin à chaque arbre de la forêt. Il ne me manquait que ceux de ta clairière.`,()=>actTrick("caline","toupie")],
      ["caline","shy","Mais les arbres ne rendent jamais les câlins. Tu crois qu'un renard d'ici voudrait bien ?",()=>actEmote("caline","coeur")]]},
    {at:"*",goal:"Demande à un renard s'il veut bien faire un câlin à Câline.",lines:id=>[
      ["me","open",`${nameOf(id)}, Câline voudrait un câlin. Un vrai, rendu.`,()=>actEmote(id,"?")],
      [id,"joy","Un câlin ? Bien sûr ! Viens là !",()=>{actNear("caline",id,"happy");setTimeout(()=>{actTrick(id,"boing");actTrick("caline","boing")},1500)}],
      ["caline","surprise","Il… il me l'a rendu. Un câlin rendu, ça chauffe deux fois plus.",()=>{actEmote("caline","coeur");actEmote(id,"coeur")}]]},
    {at:"caline",goal:"Va voir Câline.",lines:[
      ["caline","joy","Je reste. Les arbres, je les verrai en passant. Mais les câlins, c'est ici.",()=>actTrick("caline","salto")],
      ["caline","shy","Tiens, un cœur de mousse. Je l'ai pris sur mon arbre préféré. Il me le pardonnera.",()=>actGive("caline","me","mousse")]]}
  ]},
  tilleul:{title:"Quand l'arbre était une brindille",souv:"la pomme de pin de Tilleul",beats:[
    {at:"petitpois",show:()=>incoCome("tilleul"),showMs:2600,goal:"Le vieux Tilleul est venu, à petits pas.",lines:[
      ["tilleul","open",`Bonjour, ${ME()}. Ce grand arbre, là… je l'ai connu quand c'était une brindille.`,()=>actEmote("tilleul","note")],
      ["tilleul","shy","J'étais tout jeune. J'avais caché ma première pomme de pin dans son petit tronc. Pour plus tard.",()=>actPose("tilleul","sit","shy")],
      ["tilleul","sad","Plus tard, c'est maintenant. Mais il a tellement grandi… Elle doit être tout en haut.",()=>{actEmote("tilleul","goutte");setTimeout(()=>actGo("me",330,300),900)}]]},
    {at:"@tree",game:{k:"shake",item:"cone",catch:1,say:"Secoue le grand arbre ! Rattrape la vieille pomme de pin de Tilleul !",win:"Rattrapée !"},goal:"Fais tomber la pomme de pin de Tilleul du grand arbre.",lines:[
      ["tilleul","surprise","C'est elle ! Toute grise, toute sèche… et toujours là.",()=>{actGive("me","tilleul","cone",{happy:false});actEmote("tilleul","!")}],
      ["tilleul","joy","L'arbre l'a gardée pour moi pendant tout ce temps. Il mérite que je reste à côté de lui, maintenant.",()=>actEmote("tilleul","coeur")],
      ["tilleul","shy","Garde-la, toi. Tu es jeune : tu sauras quoi en faire, plus tard.",()=>actGive("tilleul","me","cone")]]}
  ]},
  pinceau:{title:"Peindre le vent",souv:"le dessin du vent",beats:[
    {at:"petitpois",show:()=>incoCome("pinceau"),showMs:2200,goal:"Pinceau est arrivé avec le vent.",lines:[
      ["pinceau","open",`${ME()}. Le vent m'a dit que quelqu'un, ici, rêvait de mes oreilles.`,()=>actEmote("pinceau","note")],
      ["petitpois","joy","C'est vrai que tes plumets ressemblent à des pinceaux. Tu peins avec ?",()=>actTrick("petitpois","boing")],
      ["pinceau","shy","Jamais essayé. Seul, je n'ose pas. Tu veux bien peindre avec moi ?",()=>actEmote("pinceau","?")]]},
    {at:"pinceau",goal:"Peins avec Pinceau.",lines:[
      ["pinceau","joy","Penche-toi. On peint à deux : moi les oreilles, toi la queue. Et on laisse le vent choisir.",()=>{actNear("me","pinceau","happy");setTimeout(()=>{actTrick("pinceau","toupie");actTrick("me","toupie")},1200)}],
      ["me","surprise","On a peint… le vent ! On le voit, regarde !",()=>actEmote("me","!")],
      ["pinceau","shy","Garde le dessin. Moi, je reste : ici, j'ose.",()=>actGive("pinceau","me","page")]]}
  ]},
  patou:{title:"Lance-la encore !",souv:"la balle de Patou",beats:[
    {at:"petitpois",show:()=>incoCome("patou"),showMs:2200,goal:"Patou est arrivé en courant, une balle dans la gueule.",lines:[
      ["patou","joy","Patou ! Tu lances ? Tu lances ? Tu lances ?",()=>{actTrick("patou","zoom");actGive("patou","me","balle",{happy:false})}],
      ["petitpois","surprise","Il se prend pour un chien des promeneurs. Il ne sait pas qu'il est un renard.",()=>actEmote("petitpois","goutte")],
      ["patou","open","Je cours plus vite que tout le monde. Fais la course avec moi jusqu'à la mare !",()=>{actEmote("patou","!");setTimeout(()=>actGo("me",140,430),900)}]]},
    {at:"@pond",game:{k:"order",who:"patou",n:10,time:10,win:"Gagné ! Patou arrive, la langue pendante."},goal:"Fais la course avec Patou jusqu'à la mare.",lines:[
      ["patou","surprise","Battu ? Moi ? Par un renard ?",()=>actEmote("patou","!")],
      ["me","joy","Toi aussi, tu es un renard, Patou.",()=>actEmote("me","coeur")],
      ["patou","joy","… Ah. Ça explique beaucoup de choses. Alors je reste avec les renards !",()=>actTrick("patou","salto")],
      ["patou","shy","Tiens, ma balle. Tu la lances mieux que les promeneurs.",()=>actGive("patou","me","balle")]]}
  ]},
  frisette:{title:"La mèche rebelle",souv:"le ruban de Frisette",beats:[
    {at:"petitpois",show:()=>incoCome("frisette"),showMs:2200,goal:"Frisette est là. Elle se tient la tête.",lines:[
      ["frisette","sad","Ne regarde pas ma mèche. J'ai tout essayé : la rosée, la boue, dormir dessus. Elle frise toujours.",()=>{actEmote("frisette","colere");actPose("frisette","sit","sad")}],
      ["frisette","shy","Il paraît que la mare d'ici aplatit tout. Petit Pois sait peut-être ?",()=>actEmote("frisette","?")]]},
    {at:"petitpois",goal:"Demande à Petit Pois si la mare aplatit les mèches.",lines:[
      ["petitpois","joy","La mare ? Elle ne fait que mouiller. Et une mèche mouillée frise encore plus !",()=>{actTrick("petitpois","boing");actEmote("frisette","goutte")}],
      ["petitpois","open","Et puis sa mèche, elle rebondit quand elle rit. Moi, c'est ce que je préfère chez elle.",()=>actEmote("petitpois","coeur")]]},
    {at:"frisette",goal:"Va voir Frisette.",lines:[
      ["me","open","Petit Pois dit que ta mèche rebondit quand tu ris. Moi aussi, je l'aime bien.",()=>actEmote("me","coeur")],
      ["frisette","surprise","Elle… rebondit ? Comme ça ?",()=>actTrick("frisette","boing")],
      ["frisette","joy","Bon. Je la garde. Mais je reste ici : il n'y a qu'ici qu'on l'aime.",()=>actEmote("frisette","coeur")],
      ["frisette","shy","Tiens, le ruban avec lequel je l'attachais. Je n'en ai plus besoin.",()=>actGive("frisette","me","ruban")]]}
  ]},
  cachou:{title:"Le meilleur carton",souv:"un bout de carton signé",beats:[
    {at:"petitpois",show:()=>incoCome("cachou"),showMs:2200,goal:"Cachou veut te parler de ton carton.",lines:[
      ["cachou","open",`${ME()}. J'ai testé tous les cartons de la forêt. Le tien est le meilleur.`,()=>actEmote("cachou","note")],
      ["cachou","joy","Pour fêter ça : cache-cache ! Si tu me trouves trois fois, je te dis mon secret.",()=>actTrick("cachou","zoom")]]},
    {at:"cachou",game:{k:"cushion",who:"cachou",say:"Cachou se glisse sous un coussin. Suis-la des yeux !"},goal:"Joue à cache-cache avec Cachou.",lines:[
      ["cachou","surprise","Trois fois ! Personne ne m'avait jamais trouvée trois fois.",()=>actEmote("cachou","!")],
      ["cachou","shy","Mon secret : je n'aime pas les cartons parce qu'ils cachent. Je les aime parce qu'on finit toujours par venir me chercher.",()=>actEmote("cachou","coeur")],
      ["cachou","joy","Ici, quelqu'un vient. Je reste. Tiens, un bout de mon carton préféré : j'ai mis ma patte dessus.",()=>actGive("cachou","me","carton")]]}
  ]},
  boussole:{title:"Le Grand Nord",souv:"la carte de la forêt",beats:[
    {at:"petitpois",show:()=>incoCome("boussole"),showMs:2200,goal:"Boussole, l'explorateur, a l'air perdu.",lines:[
      ["boussole","surprise","Incroyable. Je pars vers le Grand Nord, et ma boussole me ramène toujours ici. Toujours !",()=>{actEmote("boussole","?");actTrick("boussole","toupie")}],
      ["boussole","sad","Elle doit être cassée. Trois fois le tour de la forêt, et je finis devant ta tente.",()=>actPose("boussole","sit","sad")]]},
    {at:"petitpois",goal:"Demande à Petit Pois si la boussole est cassée.",lines:[
      ["petitpois","open","Cassée ? Ma grand-mère racontait qu'il existe des boussoles qui n'indiquent pas le nord.",()=>actEmote("petitpois","!")],
      ["petitpois","joy","Elles indiquent l'endroit où on est heureux. Elle disait que c'était très rare.",()=>actEmote("petitpois","note")]]},
    {at:"boussole",goal:"Explique à Boussole ce qu'indique sa boussole.",lines:[
      ["boussole","surprise","L'endroit où je suis heureux ? Ici ?",()=>actEmote("boussole","!")],
      ["boussole","joy","Alors j'ai trouvé mon Grand Nord. Fin de l'expédition. Je pose mon sac.",()=>actTrick("boussole","salto")],
      ["boussole","shy","Tiens, la carte de tous mes voyages. Tu verras : tous les chemins finissent ici.",()=>actGive("boussole","me","page")]]}
  ]},
  roupillon:{title:"Trop fatigué pour dormir",souv:"le petit coussin du hamac",beats:[
    {at:"petitpois",show:()=>incoCome("roupillon"),showMs:2600,goal:"Roupillon est venu… en bâillant.",lines:[
      ["roupillon","sad","Roupillon… zzz… Pardon. Je n'arrive plus à dormir. Je suis trop fatigué pour dormir.",()=>{actPose("roupillon","lie","sad");actEmote("roupillon","goutte")}],
      ["roupillon","shy","Dans la forêt, il y a toujours un bruit. Une mouche, une feuille, un ronflement de Somnus…",()=>actEmote("roupillon","colere")]]},
    {at:"roupillon",game:{k:"still",label:"Roupillon s'endort…",say:"Chasse les mouches avant qu'elles réveillent Roupillon !",win:"Il dort…"},goal:"Veille sur la sieste de Roupillon.",lines:[
      ["roupillon","shy","Mmh… J'ai dormi. Vraiment. Pour la première fois depuis… je ne sais plus.",()=>actPose("roupillon","happy","joy")],
      ["roupillon","joy","Ici, quelqu'un chasse les mouches pour moi. Je reste. Je reste… zzz…",()=>{actEmote("roupillon","coeur");setTimeout(()=>actPose("roupillon","sleep"),1400)}],
      ["petitpois","joy",`Il t'a laissé son petit coussin. Il en a un autre… sous la tête.`,()=>actGive("roupillon","me","coussin")]]}
  ]},
  filou:{title:"L'emprunteur",souv:"une chaussette rendue",beats:[
    {at:"petitpois",show:()=>incoCome("filou"),showMs:2200,goal:"Filou est là, une chaussette dépasse de sous lui.",lines:[
      ["petitpois","surprise","Mes chaussettes ! Toutes mes chaussettes d'hiver ont disparu !",()=>{actEmote("petitpois","!");actEmote("filou","goutte")}],
      ["filou","shy","Disparu, disparu… Je les ai empruntées. Pour l'hiver. Toutes. Et je les ai mélangées.",()=>actPose("filou","sit","shy")],
      ["me","open","Filou… on les remet en paires, et on les rend ?",()=>actEmote("me","?")]]},
    {at:"@bench",game:{k:"memory",win:"Toutes les paires !"},goal:"Remets les chaussettes de Petit Pois en paires, près du banc.",lines:[
      ["filou","sad","Bon. D'accord. Je les rends. Mais j'avais froid aux pattes, tu sais.",()=>{actGive("filou","petitpois","chaussette");actEmote("filou","froid")}],
      ["petitpois","joy","Froid aux pattes ? Il fallait demander ! Tiens, garde cette paire. À toi. Pas empruntée.",()=>{actGive("petitpois","filou","chaussette");setTimeout(()=>actTrick("filou","boing"),900)}],
      ["filou","joy","Une paire à moi… Je reste, alors. Et je n'emprunte plus rien. Presque plus rien.",()=>actGive("filou","me","chaussette")]]}
  ]},
  radar:{title:"Le bruit sous la maison",souv:"le coquillage où on entend la forêt",beats:[
    {at:"petitpois",show:()=>incoCome("radar"),showMs:2200,goal:"Radar a entendu quelque chose d'inquiétant.",lines:[
      ["radar","surprise",`${ME()} ! Il y a un bruit. Sous ta maison. Toutes les nuits. Un grondement !`,()=>{actEmote("radar","!");actTrick("radar","boing")}],
      ["petitpois","shy","Un monstre ? Sous la maison ? Hou-hou…",()=>{actEmote("petitpois","goutte");actPose("petitpois","lie","shy")}]]},
    {at:"@porch",goal:"Écoute avec Radar devant la porte de la maison.",lines:[
      ["radar","open","Chut… Là ! Tu entends ? Rrrr… pfff… Rrrr… pfff…",()=>actPose("radar","up","open")],
      ["me","surprise","C'est… toi, Petit Pois. Tu ronfles quand tu fais la sieste sous le porche.",()=>{actEmote("me","!");actEmote("petitpois","goutte");setTimeout(()=>actTrick("me","roll"),800)}],
      ["radar","joy","Un ronflement ! Le plus beau grondement de la forêt. Je pourrais l'écouter toute la nuit.",()=>{actTrick("radar","toupie");actEmote("radar","note")}]]},
    {at:"radar",goal:"Va voir Radar.",lines:[
      ["radar","shy","Ici, même la nuit fait des bruits doux. Je reste. Je veux tous les connaître.",()=>actEmote("radar","coeur")],
      ["radar","joy","Tiens, mon coquillage. Colle-le à ton oreille : on entend la forêt. Comme moi, mais en petit.",()=>actGive("radar","me","coquillage")]]}
  ]}
});
