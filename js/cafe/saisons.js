/* Café Frimousse : l'histoire des quatre saisons, « le Concours de la vallée » (11/11/2026, Joffray : « on a plein de dialogues
   pour le Japon, la France et l'Italie, mais rien pour les 4 saisons » ; il a choisi le concours avec des défis).
   Chaque saison, son invité d'honneur est juré : Professeur Noisette (Automne), Flocon (Hiver), Pâquerette (Printemps,
   nouvelle renarde verte à couronne de pâquerettes, qui remplace Zaza : Joffray trouvait ses grandes oreilles trop proches
   d'un sauvage), Comète (Été). Défis aux jours 5 et 10 de chaque saison (SEA_DUEL) : battre la note du juge (1,35 × l'objectif,
   comme les défis de Firmin à Paris) donne +40 pièces la première fois (S.sduel). Scènes (SEA_SCENES) jouées à la fin de la
   journée, avant l'écran de résultats, la première fois que la journée est réussie (ou le défi gagné) ; S.sread. */
const PAQUERETTE={id:"paquerette",name:"Pâquerette",rar:"rare",food:3,likes:["fleurs"],gift:[14,24],goldP:.35,acc:"paquerettes",
  c:{b:"#cfe6b4",ch:"#fbfff2",e:"#8fbf74",s:"#8fbf74",t:"#fbfff2"},bio:"Elle réveille les fleurs de la vallée, une à une, au printemps."};
FOX.paquerette=PAQUERETTE;
// jour du défi : le juge
const SEA_DUEL={5:"noisette",10:"noisette",15:"flocon",20:"flocon",25:"paquerette",30:"paquerette",35:"comete",40:"comete"};
const seaDuelScore=d=>Math.ceil(GOALS[d-1]*1.35);
const SEA_SCENES={
  1:[["petitpois","joy","Une lettre pour le café ! « Grand Concours de la vallée : le meilleur café sera choisi par quatre jurés, un par saison. »"],
     ["petitpois","open","Le juré de l'Automne, c'est le Professeur Noisette. Il viendra goûter au jour 5. On va lui montrer !"]],
  5:[["noisette","open","Hmm. Hmm hmm. Service rapide, croissants dorés, tasse chaude…"],
     ["noisette","joy","Je note : « remarquable ». C'est rare, venant de moi. Je reviendrai au jour 10 pour la note finale."]],
  10:[["noisette","joy","Mon rapport est prêt. Le café de la vallée mérite une page entière dans mon grand livre."],
      ["petitpois","joy","On a gagné l'Automne ! Plus que trois saisons !"],
      ["noisette","open","Méfiez-vous de l'Hiver. La jurée suivante ne sort que dans la tempête."]],
  11:[["flocon","shy","Pardon… Il fait si noir dehors. J'ai suivi la lumière de votre guirlande."],
      ["petitpois","surprise","Mais… c'est Flocon, la jurée de l'Hiver ! Entre, il fait bon ici."],
      ["flocon","open","Je goûterai votre chocolat chaud au jour 15. S'il me réchauffe, vous aurez ma note."]],
  15:[["flocon","joy","Je n'ai plus froid du tout. Et vos lumières… on dirait des étoiles posées sur le comptoir."],
      ["flocon","open","Le jour 20, la nuit sera la plus longue de l'année. Si le café reste allumé jusqu'au bout, je dirai oui."]],
  20:[["flocon","joy","Toute la nuit, la guirlande a brillé. Je n'ai jamais eu peur. Ma note : la plus haute."],
      ["petitpois","joy","L'Hiver aussi ! On est à mi-chemin du concours !"],
      ["flocon","shy","Je peux revenir allumer la guirlande, parfois ?"]],
  21:[["paquerette","open","Bonjour ! Je réveille les fleurs de la vallée, une à une. Toutes ont fleuri… sauf une."],
      ["paquerette","sad","La pâquerette derrière votre café. Elle ne veut pas s'ouvrir. Il lui manque quelque chose de doux."],
      ["petitpois","open","C'est Pâquerette, la jurée du Printemps ! On va trouver ce qu'il lui manque."]],
  25:[["paquerette","joy","Une tartelette myrtille au soleil, et des clients qui rient… La pâquerette a ouvert un pétale !"],
      ["paquerette","open","Encore un peu de douceur, et elle fleurira pour le jour 30. Alors, vous aurez ma note."]],
  30:[["paquerette","joy","Regardez ! Elle est grande ouverte ! C'était les rires, il lui fallait des rires."],
      ["paquerette","open","Ma note est la plus fleurie du concours. Et je garde une pâquerette pour ma couronne."],
      ["petitpois","joy","Trois saisons sur quatre ! Il ne reste que l'Été… et la jurée la plus difficile à trouver."]],
  31:[["petitpois","open","La jurée de l'Été, c'est Comète. On ne la voit qu'une nuit par lune, en passant dans le ciel."],
      ["petitpois","joy","Alors on va faire un café si joyeux qu'elle aura envie de descendre !"]],
  35:[["comete","surprise","Je passais très haut, et j'ai senti une odeur de gâteau. Je ne m'arrête jamais, d'habitude."],
      ["comete","open","Au jour 40, c'est la grande fête de l'été. Si tout le monde est là, je descendrai pour la finale."]],
  40:[["comete","joy","Je suis descendue ! Il y a des lanternes, de la musique, et tous les jurés réunis."],
      ["noisette","joy","Automne : remarquable."],["flocon","joy","Hiver : lumineux."],["paquerette","joy","Printemps : fleuri."],
      ["comete","joy","Et Été : étincelant. Le Grand Concours de la vallée est gagné par… votre café !"],
      ["petitpois","joy","On l'a fait !!! Le meilleur café de toute la vallée !"]]};
// une scène est due une fois la journée réussie, ou le défi gagné les jours de défi
const seaSceneDue=d=>SEA_SCENES[d]&&!S.sread[d]&&(SEA_DUEL[d]?!!S.sduel[d]:!!S.stars[d]);
// seulement la scène de la journée jouée : une partie déjà avancée ne reçoit pas toutes les scènes d'un coup
function seaScenes(d,done){
  if(seaSceneDue(d)){itTalk(SEA_SCENES[d],()=>{S.sread[d]=1;save();done()});return}
  done();
}
// à la fin d'une journée du premier café : le défi du juge (après le calcul des étoiles)
function seaDuelNews(d,e,st){
  const j=SEA_DUEL[d];if(!j||!st)return "";
  const f=seaDuelScore(d),F=FOX[j];
  if(e>=f&&!S.sduel[d]){S.sduel[d]=1;S.coins+=40;return itRow(foxSVG(F,{pose:"happy"}),d===40?"Tu as gagné la finale !":`${F.name} est conquis${j==="noisette"?"":"e"} !`,`${e} pièces, la note du juge était ${f}. +40 pièces !`,"background:#e8f4dc")}
  if(!S.sduel[d])return itRow(foxSVG(F,{pose:"sit"}),`${F.name} attend mieux…`,`Sa note : ${f} pièces, toi ${e}. Rejoue cette journée pour la battre.`,"background:#e8f4dc");
  return "";
}
