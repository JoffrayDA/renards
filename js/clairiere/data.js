/* La Clairière (refuge de Roussette) : données. Voir docs/clairiere-v2.md.
   Les renards (FOXES, FOX) et leur dessin (foxArt) viennent de js/cafe/foxes.js et js/foxart.js. */
const KEY="clairiere-renards-v2",OLDKEY="clairiere-renards-v1",CAFEKEY="cafe-renards-v1";
const STEP=30*60e3,MAXSIM=48*36e5; // simulation page fermée : pas de 30 min, 48 h au plus
const W=400,H=480,O=`stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const pc=(x,y)=>`left:${x/W*100}%;top:${y/H*100}%`;
const today=(t=Date.now())=>{const d=new Date(t);return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};

/* ---------- endroits de la scène ---------- */
// cov : à l'abri de la pluie ; poses : ce qu'on peut y faire
const SPOTS=[
  {id:"p1",x:136,y:238,cov:1,poses:["sleep","lie","sit","groom","up"]},
  {id:"p2",x:164,y:236,cov:1,poses:["sleep","lie","sit","groom","up"]},
  {id:"p3",x:238,y:236,cov:1,poses:["sleep","lie","sit","groom","up"]},
  {id:"p4",x:266,y:238,cov:1,poses:["sleep","lie","sit","groom","up"]},
  {id:"bowl",x:240,y:262,poses:["eat"],bowl:1},
  {id:"stump",x:85,y:304,poses:["sit","up","groom","sleep"]},
  {id:"leaves",x:322,y:336,poses:["sleep","lie","sleep"]},
  {id:"bench1",x:284,y:404,poses:["sit","sleep","groom"]},
  {id:"bench2",x:316,y:404,poses:["sit","lie","up"]},
  {id:"pond",x:174,y:420,poses:["sit","up","lie"]},
  {id:"lampL",x:62,y:264,poses:["up","sit"],lamp:"L"},
  {id:"lampR",x:338,y:264,poses:["up","sit"],lamp:"R"},
  {id:"g1",x:150,y:328,poses:["sit","happy","groom","lie"]},
  {id:"g2",x:252,y:318,poses:["sit","happy","groom","lie"]},
  {id:"g3",x:204,y:372,poses:["sit","happy","up","lie"]},
  {id:"g4",x:66,y:372,poses:["sit","groom","sleep"]},
  {id:"g5",x:350,y:388,poses:["sit","happy","lie"]},
  {id:"g6",x:236,y:452,poses:["sit","happy","groom"]},
  {id:"g7",x:120,y:462,poses:["sit","lie","up"]}
];
const SPOT=Object.fromEntries(SPOTS.map(s=>[s.id,s]));
const DOOR={x:200,y:240},EDGE={x:-40,y:330}; // EDGE : là où les sauvages entrent et repartent, côté forêt
const ACT={sit:"se repose",happy:"joue",sleep:"dort",lie:"paresse",groom:"fait sa toilette",up:"regarde le ciel",eat:"mange"};
const PLACE={p1:"sous le porche",p2:"sous le porche",p3:"sous le porche",p4:"sous le porche",bowl:"à la gamelle",stump:"sur la souche",leaves:"dans les feuilles",bench1:"sur le banc",bench2:"sur le banc",pond:"au bord de la mare",lampL:"près des lanternes",lampR:"près des lanternes"};
const MAXHERE=10; // renards visibles en même temps dans la scène

/* ---------- gamelles ---------- */
// p : chance de visite d'un sauvage par pas de 30 min tant que la gamelle est pleine ; fish : poissons à pêcher à la place des glands
const NEED_FISH=5;
const BOWLS={
  croquettes:{name:"Croquettes",price:0,hours:8,p:0,col:"#c98a5a",desc:"Gratuites. Tes renards restent dans la clairière au lieu de partir en balade."},
  baies:{name:"Baies des bois",price:30,hours:12,p:.06,col:"#8a6ac0",desc:"Peut attirer un sauvage du sous-bois."},
  poisson:{name:"Poisson",price:0,fish:5,hours:12,p:.06,col:"#9ec3ef",desc:"Peut attirer un sauvage de la rivière. Se remplit avec 5 poissons pêchés dans la mare."},
  miel:{name:"Rayon de miel",price:120,hours:24,p:.04,col:"#f2c45a",desc:"Le seul mets qui tente un très gros renard des neiges."}
};
// les six sauvages ne viennent jamais au Café avant d'être passés par la gamelle
const WILD={somnus:"baies",reglisse:"baies",aurore:"baies",maree:"poisson",perle:"poisson",yeti:"miel"};
const WILD_HINT={baies:"le sous-bois",poisson:"la rivière",miel:"les neiges"};

/* ---------- amitié ---------- */
// une caresse par renard et par jour donne un cœur ; niveaux 1 à 5
const LV_T=[0,3,8,15,25],LV_N=["","Timide","Curieux","Copain","Ami","Inséparable"];
const lvOf=h=>{let l=1;for(let i=1;i<5;i++)if(h>=LV_T[i])l=i+1;return l};
// glands laissés par chaque renard installé, par jour (selon l'amitié)
const GLANDS_DAY=[0,2,3,3,4,5];

/* ---------- le grand portrait ---------- */
// tout le monde, sauf Roussette (c'est toi) et les invités d'Halloween (en bonus s'ils ont été croisés)
const ROSTER=FOXES.filter(f=>!f.event&&f.id!=="roussette").map(f=>f.id);
