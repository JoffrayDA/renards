/* La Clairière à Noël (docs/economie.md) : du 1er décembre au 6 janvier, la clairière est sous la neige (maquette validée :
   tools/sapin-hd.html), la pluie devient de la neige, et l'histoire du sapin se joue en 4 chapitres, un par semaine :
   Grelot plante la graine (1er), Ramure le renne perdu (8), Paillette et les boules de Noël (15), Barbe-Neige et l'étoile (24).
   Le sapin pousse tout seul entre deux chapitres. Ces histoires passent avant la suite d'ORDER (sauf une histoire commencée),
   sans attente entre elles ; les invités de Noël (event:"noel") restent au refuge jusqu'au 6 janvier.
   ?noel=12 fait comme si on était le 12 décembre (32 = 1er janvier), ?noel=0 coupe Noël. */
const QN=new URLSearchParams(location.search).get("noel");
// jour de l'événement : 1 à 31 en décembre, 32 à 37 du 1er au 6 janvier, 0 hors saison
function noelDay(){if(QN!=null){const n=+QN||0;return n>0&&n<=37?n:0}const d=new Date();
  return d.getMonth()===11?d.getDate():d.getMonth()===0&&d.getDate()<=6?31+d.getDate():0}
const noelOn=()=>noelDay()>0;
const NOEL_ORDER=["grelot","ramure","paillette","barbeneige"],NOEL_FROM={grelot:1,ramure:8,paillette:15,barbeneige:24};
const isNoelStory=id=>NOEL_ORDER.includes(id);
// le chapitre qui attend : sa date est passée et le précédent est fini
function noelNext(){if(!noelOn())return null;return NOEL_ORDER.find((k,i)=>!storyDone(k)&&noelDay()>=NOEL_FROM[k]&&(!i||storyDone(NOEL_ORDER[i-1])))||null}
// dans le journal, pendant l'événement (ou une fois commencé)
const noelRows=()=>noelOn()||NOEL_ORDER.some(k=>R.beat[k]>0)?NOEL_ORDER:[];
// le sapin : null (pas planté), "0" pousse, "1" grand, "2" immense, "3" décoré ; star : l'étoile posée et les cadeaux au pied
function sapinStage(){if(!noelOn()||!storyDone("grelot"))return null;const d=noelDay();
  if(storyDone("paillette"))return "3";if(d>=15&&storyDone("ramure"))return "2";if(d>=8)return "1";return "0"}
const sapinStar=()=>storyDone("barbeneige");
// les lanternes de gauche laissent la place au sapin dès qu'il a grandi (scene.js)
function noelLampsL(){const s=sapinStage();return s&&s!=="0"?[[90,206]]:null}
// pas d'objet de déco sur le sapin (deco.js)
function noelNo(){const s=sapinStage();return s?[[60,272,s==="0"?24:44]]:[]}

/* ---------- les histoires ---------- */
Object.assign(STORIES,{
  grelot:{title:"La graine du Nord",souv:"le grelot d'argent",beats:[
    {at:"petitpois",goal:"Petit Pois a entendu un drôle de bruit dans la neige.",lines:[
      ["petitpois","surprise","Tu entends ? Gling… gling… Ça vient de la forêt !"],
      ["me","open","On dirait un grelot. Allons voir près des lanternes."]]},
    {at:"@lampL",arrive:"grelot",goal:"Va voir qui fait gling-gling, près des lanternes.",lines:[
      ["grelot","joy","Bonjour ! Moi, c'est Grelot. Je viens du Grand Nord, là où il neige toute l'année."],
      ["grelot","sad","Chez moi, chaque clairière plante son sapin de Noël le 1er décembre. Mais moi, je n'ai pas de clairière…"],
      ["grelot","shy","J'ai apporté une graine. Je peux la planter ici ?"],
      ["me","joy","Bien sûr ! Juste là, au pied des lanternes."]]},
    {at:"grelot",game:{k:"catch",thing:"bell",n:6,say:"Les grelots de Grelot se sont décrochés ! Attrape-les avant qu'ils tombent dans la neige.",win:"Tous les grelots !"},goal:"Aide Grelot à planter la graine.",lines:[
      ["grelot","joy","Merci ! Un sapin, ça ne pousse qu'avec de la musique. Gling, gling !"],
      ["grelot","open","Chaque soir, je lui jouerai des grelots. Dans une semaine, tu verras !"]]},
    {at:"petitpois",goal:"Montre la pousse à Petit Pois.",lines:[
      ["petitpois","surprise","Une pousse de sapin ? Toute petite, toute verte !"],
      ["petitpois","joy","Je vais lui tricoter une écharpe, pour qu'elle n'ait pas froid."],
      ["grelot","joy","Reviens dans une semaine : elle aura grandi. Tiens, un de mes grelots, pour t'en souvenir."]]}
  ]},
  ramure:{title:"Le renne perdu",souv:"la clochette de traîneau",beats:[
    {at:"grelot",goal:"Grelot a l'air inquiet.",lines:[
      ["grelot","surprise","Regarde le sapin, il a grandi ! … Mais il y a des traces dans la neige. De très grandes traces."],
      ["me","open","Des sabots ? Elles vont vers la mare."]]},
    {at:"@pond",arrive:"ramure",goal:"Suis les grandes traces jusqu'à la mare.",lines:[
      ["ramure","surprise","Oh ! Pardon, je glissais sur la glace. Je m'appelle Ramure."],
      ["ramure","sad","Je tire le traîneau de Barbe-Neige. Je me suis perdu dans la tempête… et ma clochette est tombée."],
      ["me","joy","On va la retrouver !"]]},
    {at:"@leaves",game:{k:"search",item:"bell",say:"La clochette a roulé sous la neige. Elle tinte quand le vent souffle ! 3 essais.",win:"Gling ! La voilà !"},goal:"Cherche la clochette de Ramure sous la neige, près des feuilles.",lines:[
      ["ramure","joy","Ma clochette ! Avec elle, Barbe-Neige m'entendra de très loin."],
      ["ramure","open","Je reste ici en attendant qu'il me retrouve. Ton sapin, on le voit de partout : c'est un bon repère."]]},
    {at:"petitpois",goal:"Présente Ramure à Petit Pois.",lines:[
      ["petitpois","surprise","Un renne au refuge ! Tu crois qu'il voudra goûter mes croquettes ?"],
      ["ramure","shy","… Juste une. Ou deux."],
      ["grelot","joy","Dans une semaine, le sapin touchera les nuages. Il faudra le décorer !"]]}
  ]},
  paillette:{title:"Les boules de Noël",souv:"une boule de verre argentée",cast:["grelot"],beats:[
    {at:"grelot",goal:"Le sapin est immense ! Grelot veut te parler.",lines:[
      ["grelot","joy","Il est immense ! Maintenant, il lui faut des guirlandes, des boules, des rubans…"],
      ["grelot","sad","Mais je n'ai rien apporté. Dans le Nord, c'est Paillette qui fait toutes les décorations."],
      ["me","open","Si on allume les lanternes, elle verra peut-être la lumière ?"]]},
    {at:"@lampL",lamps:1,arrive:"paillette",goal:"Allume les lanternes pour guider Paillette.",lines:[
      ["paillette","joy","Des lanternes dans la neige ! Je les ai vues de très loin."],
      ["paillette","open","Je suis Paillette. Je fais mes guirlandes avec les étoiles qui tombent."],
      ["paillette","sad","Mais en venant, mon sac s'est ouvert. Mes boules de Noël roulent partout !"]]},
    {at:"@bench",game:{k:"catch",thing:"ball",n:7,say:"Les boules de Noël glissent sur la neige. Attrape-les toutes !",win:"Toutes les boules !"},goal:"Rattrape les boules de Paillette, près du banc.",lines:[
      ["paillette","joy","Toutes là ! Et pas une seule fêlée."]]},
    {at:"paillette",goal:"Décore le sapin avec Paillette.",lines:[
      ["paillette","joy","Une boule rouge ici… une bleue là… et la guirlande, tout autour !"],
      ["grelot","surprise","Il est magnifique !"],
      ["me","open","Il manque quelque chose, tout en haut…"],
      ["paillette","open","L'étoile. Seul Barbe-Neige en a une assez brillante. Il passe toujours la veille de Noël."]]}
  ]},
  barbeneige:{title:"La veille de Noël",souv:"l'étoile du sapin",cast:["grelot","ramure","paillette"],beats:[
    {at:"ramure",goal:"Ramure entend quelque chose dans le ciel.",lines:[
      ["ramure","surprise","Tu entends ? Des clochettes, là-haut… C'est le traîneau !"],
      ["ramure","joy","Il a entendu la mienne. Il arrive !"]]},
    {at:"@porch",arrive:"barbeneige",goal:"Accueille le traîneau devant la maison.",lines:[
      ["barbeneige","joy","Bonsoir, bonsoir ! Je suis Barbe-Neige."],
      ["barbeneige","open","Ramure, te voilà ! Et quel sapin… Je n'en ai jamais vu d'aussi beau dans tout le Nord."],
      ["barbeneige","sad","Mais quelle tempête ! En atterrissant, toutes mes lettres se sont envolées."]]},
    {at:"barbeneige",game:{k:"catch",thing:"page",n:8,say:"Les lettres des renards s'envolent ! Attrape-les toutes.",win:"Toutes les lettres !"},goal:"Rattrape les lettres de Barbe-Neige.",lines:[
      ["barbeneige","joy","Merci ! Chaque lettre, c'est le vœu d'un renard. Je ne pouvais pas en perdre une seule."],
      ["barbeneige","open","Pour te remercier, voici l'étoile du sapin. Elle ne s'éteint jamais."]]},
    {at:"grelot",gather:1,goal:"Pose l'étoile en haut du sapin, avec tout le monde.",lines:[
      ["grelot","joy","Tout le monde est là ? Un… deux… trois !"],
      ["petitpois","surprise","Elle brille ! Elle brille jusqu'au ciel !"],
      ["barbeneige","joy","Joyeux Noël, la clairière."],
      ["me","joy","Joyeux Noël à tous !"]]}
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
function nGround(){const r=rng(23);let s=`<path d="M0 160 Q60 150 120 158 Q200 148 280 158 Q340 150 400 158 L400 480 L0 480Z" fill="url(#nSnow)"/>`;
  [[40,300,70,14],[350,290,64,12],[230,470,90,16],[30,470,60,12],[380,440,40,10]].forEach(([x,y,w,h])=>s+=`<path d="M${x-w} ${y} Q${x-w*.4} ${y-h} ${x} ${y-h*.8} Q${x+w*.5} ${y-h*1.1} ${x+w} ${y} Z" fill="#fff"/><path d="M${x-w} ${y} Q${x} ${y+5} ${x+w} ${y}" fill="none" stroke="#cbd8ea" stroke-width="2.4" stroke-linecap="round"/>`);
  for(let i=0;i<9;i++){const y=470-i*24,x=226+Math.sin(i*.9)*8;[[0,0],[7,-9]].forEach(([dx,dy])=>s+=`<g fill="#c9d6e8" transform="translate(${f1(x+dx)} ${f1(y+dy)})"><ellipse rx="2.6" ry="2"/><circle cx="-2.4" cy="-3" r=".9"/><circle cx="0" cy="-3.8" r=".9"/><circle cx="2.4" cy="-3" r=".9"/></g>`)}
  [[200,272],[193,296],[206,322],[196,350],[205,392],[196,430],[204,466]].forEach(([x,y],i)=>{const w=13-i*.3;
    s+=nSh(x+3,y+3,w+4,7,.7)+`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="6" fill="#d9d2c8" ${L(2.2)}/><ellipse cx="${x-2}" cy="${y-1.6}" rx="${f1(w*.62)}" ry="2.6" fill="#ece6dd"/><path d="M${f1(x-w*.8)} ${y-2} Q${x-2} ${y-7} ${f1(x+w*.5)} ${y-3.4} Q${x} ${y-1.6} ${f1(x-w*.8)} ${y-2}Z" fill="#fff"/>`});
  for(let i=0;i<26;i++){const x=r()*400,y=175+r()*300,k=.6+r()*.8;s+=`<path class="${i%2?"tw":""}" style="animation-delay:${f1(-r()*2)}s" d="M${f1(x)} ${f1(y-3*k)} L${f1(x+.8*k)} ${f1(y-.8*k)} L${f1(x+3*k)} ${f1(y)} L${f1(x+.8*k)} ${f1(y+.8*k)} L${f1(x)} ${f1(y+3*k)} L${f1(x-.8*k)} ${f1(y+.8*k)} L${f1(x-3*k)} ${f1(y)} L${f1(x-.8*k)} ${f1(y-.8*k)}Z" fill="#fff"/>`}
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
const sapinT=st=>st==="0"?{n:3,h0:24,dy:11,w0:17,dw:4.5,bough:3}:st==="1"?{n:4,h0:52,dy:28,w0:38,dw:8,bough:6}:{n:6,h0:92,dy:52,w0:68,dw:10.4,bough:8};
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
function noelBg(){const ph=phaseNow(),N=ph==="nuit",r=rng(11),st=sapinStage();let s=bgDefs(ph)+nDefs(N);
  s+=`<rect width="400" height="480" fill="url(#nSnow)"/>`+nSky(N)+nForest(N)+nGround();
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
  s+=nStump()+nMound()+nPond();
  if(storyDone("gaston"))s+=`<path d="M150 440 L132 384" stroke="#a9785a" stroke-width="3.4" stroke-linecap="round"/><path d="M132 384 Q118 398 116 418" fill="none" stroke="#fff" stroke-width="1.4"/><circle cx="116" cy="420" r="3.4" fill="#e0564f" stroke="${INK}" stroke-width="1.6"/>`;
  s+=nBench()+`</g>`;
  if(ph==="jour")s+=`<circle cx="330" cy="20" r="220" fill="url(#cSun)" opacity=".14"/>`;
  return s+`<rect width="400" height="480" fill="url(#cVig)"/><rect width="400" height="480" fill="url(#cGrain)"/>`}
// la nuit, les lumières du sapin décoré et l'étoile brillent au-dessus du voile (drawGlow)
function noelGlow(){const st=sapinStage();if(st!=="3")return "";let s=`<defs><radialGradient id="gStar"><stop offset="0" stop-color="#fffbe0"/><stop offset=".3" stop-color="#fff2a8" stop-opacity=".7"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient></defs>`;
  if(sapinStar())s+=nStarGlow();
  if(dark()){const r=rng(9);for(let i=0;i<40;i++){const k=Math.floor(r()*6),yb=SB-k*52,h=92-k*3.7,w=68-k*10.4,t=.18+r()*.75,y=yb-h*t,x=SX+(r()*2-1)*w*t*.85;if(y<6)continue;
      s+=`<circle class="tw" style="animation-delay:${f1(-r()*2)}s" cx="${f1(x)}" cy="${f1(y)}" r="5.5" fill="${["#ffe08a","#ffb0c0","#bfe6ff"][i%3]}" opacity=".55"/><circle cx="${f1(x)}" cy="${f1(y)}" r="1.6" fill="#fffbe8"/>`}}
  return s}

/* ---------- la neige qui tombe : un peu tout le temps, beaucoup quand il « pleut » ---------- */
const snowEl=document.createElementNS("http://www.w3.org/2000/svg","svg");snowEl.setAttribute("class","layer");snowEl.id="snow";snowEl.setAttribute("viewBox","0 0 400 480");snowEl.setAttribute("preserveAspectRatio","xMidYMid slice");snowEl.setAttribute("aria-hidden","true");
let snowN=-1;
function drawSnow(){const n=noelOn()?(scn.rain?90:28):0;if(n===snowN)return;snowN=n;const r=rng(3);let s="";
  for(let i=0;i<n;i++){const big=i%7===0;s+=`<circle class="flake" style="animation-duration:${f1(big?4+r()*2:6+r()*6)}s;animation-delay:${f1(-r()*12)}s" cx="${f1(r()*420-10)}" cy="${f1(-r()*30)}" r="${f1(big?2.8+r()*1.4:1+r()*1.4)}" fill="#fff" opacity="${big?.75:.95}"/>`}
  snowEl.innerHTML=s}
if(noelOn())$("scene").insertBefore(snowEl,$("phase"));

// les invités de Noël repartent dans le Nord après le 6 janvier (ils reviendront l'hiver suivant)
const noelAway=id=>FOX[id]&&FOX[id].event==="noel"&&!noelOn();
