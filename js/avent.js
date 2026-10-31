/* Le calendrier de l'Avent, sur l'accueil (docs/economie.md, validé par Joffray le 31/10/2026).
   Une case par jour du 1er au 24 décembre : de la monnaie chaque jour, un objet tous les 3 ou 4 jours, un gros cadeau le 24.
   2 gels pour tout le mois (comme Duolingo) : une case oubliée se rattrape plus tard avec un gel ; sans gel, elle est perdue.
   Les 24 cases ouvertes donnent l'Étoile dorée du sapin. On rattrape jusqu'au 6 janvier.
   État dans la bourse (bourse.js) : b.av = {y : année, o : {jour : instant d'ouverture}, g : gels utilisés, star}.
   Les cadeaux vont dans b.gift, rangés tout de suite dans les parties qui existent (deliverGifts), sinon au prochain lancement du jeu.
   ?avent=12 fait comme si on était le 12 décembre (25 = après Noël, 0 = pas de calendrier). */
const AV_GELS=2;
const AV=[null,
  [{coins:100}],[{sucres:20}],[{bells:3}],[{deco:"bonhomme"}],[{coins:150}],[{sucres:25}],[{boost:"patience"}],[{deco:"guirlpin"}],
  [{bells:4}],[{coins:200}],[{sucres:30}],[{noel:"bonnet"}],[{boost:"tips",n:2}],[{coins:250}],[{bells:5}],[{deco:"luge"}],
  [{sucres:35}],[{coins:300}],[{boost:"vip"}],[{noel:"houx"}],[{bells:6}],[{sucres:40}],[{coins:400}],[{deco:"traineau"},{noel:"echarpe"}]];
// les cases dans le désordre, comme un vrai calendrier ; la 24, double, en bas à droite
const AV_ORDER=[7,15,2,20,11,18,4,13,9,22,1,23,16,6,10,12,19,3,21,14,8,5,17,24];
function avToday(){const d=new Date(),q=new URLSearchParams(location.search).get("avent");
  if(q!==null)return +q>0?{y:d.getFullYear(),t:Math.min(+q,25)}:null;
  if(d.getMonth()===11)return {y:d.getFullYear(),t:Math.min(d.getDate(),25)};
  if(d.getMonth()===0&&d.getDate()<=6)return {y:d.getFullYear()-1,t:25};
  return null}
const avOf=(b,y)=>b.av&&b.av.y===y?b.av:(b.av={y,o:{},g:0});
// open : ouverte ; today : à ouvrir ; gel : oubliée, se rattrape avec un gel ; lost : oubliée sans gel ; lock : pas encore
function avState(av,d,t){if(av.o[d])return "open";if(d>t)return "lock";if(d===t)return "today";return av.g<AV_GELS?"gel":"lost"}

/* ---------- les dessins des cadeaux (viewBox 0 0 48 48) ---------- */
const avI=(s)=>`<svg viewBox="0 0 48 48" aria-hidden="true"><g stroke="#5b4250" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">${s}</g></svg>`;
const AV_ART={
  coins:avI(`<circle cx="24" cy="25" r="16" fill="#f2c75c"/><circle cx="24" cy="25" r="10.4" fill="#e9b949" stroke-width="1.6"/><g fill="#5b4250" stroke="none"><ellipse cx="24" cy="28.4" rx="4.2" ry="3.4"/><circle cx="19" cy="23.4" r="1.8"/><circle cx="22.4" cy="20.6" r="1.8"/><circle cx="25.6" cy="20.6" r="1.8"/><circle cx="29" cy="23.4" r="1.8"/></g>`),
  sucres:avI(`<path d="M19 42V17A7 7 0 0 1 33 17V20" fill="none" stroke-width="11"/><path d="M19 42V17A7 7 0 0 1 33 17V20" fill="none" stroke="#fffaf2" stroke-width="6.4"/><path d="M16.6 39L21.4 35.4M16.6 31L21.4 27.4M16.8 23L21.4 19.6M22 12.4L25.4 10.6M29.4 10.8L31.6 14M29.6 17.6L35 18.6" stroke="#e8505e" stroke-width="4"/>`),
  bells:avI(`<path d="M24 11C15.6 11 13.2 18 13.2 24.8V31.2L10 36.8H38L34.8 31.2V24.8C34.8 18 32.4 11 24 11Z" fill="#f6cc4e"/><path d="M17.2 20.8Q18.4 16 22.4 15.2" fill="none" stroke="#fff6cf" stroke-width="3"/><circle cx="24" cy="40" r="3.6" fill="#e0a52e"/><path d="M24 11L16.8 5.2Q14.8 9.6 18.8 11.2M24 11L31.2 5.2Q33.2 9.6 29.2 11.2" fill="#f48aa6"/>`),
  patience:avI(`<path d="M10 20H34V28Q34 39 22 39Q10 39 10 28Z" fill="#fffaf2"/><path d="M34 23Q41 23 40 29Q39 34 33 33" fill="none"/><path d="M13 24H31" stroke="#a6d39a" stroke-width="3"/><path d="M18 15Q15 11 18 7M24 15Q21 11 24 7" fill="none" stroke-width="2"/><path d="M8 41H36" />`),
  tips:avI(`<path d="M13 16H35V36Q35 41 30 41H18Q13 41 13 36Z" fill="#dff0f7"/><path d="M11 12H37V17H11Z" fill="#c9a06a"/><circle cx="20" cy="31" r="5" fill="#f2c75c"/><circle cx="28" cy="34" r="5" fill="#f2c75c"/><circle cx="25" cy="25" r="4.4" fill="#f2c75c"/>`),
  vip:avI(`<path d="M7 15H41V37H7Z" fill="#fbe7a6"/><path d="M7 15L24 28L41 15" fill="none"/><circle cx="24" cy="28" r="4.6" fill="#e8505e"/><path d="M33 8L34.4 11.6L38 13L34.4 14.4L33 18L31.6 14.4L28 13L31.6 11.6Z" fill="#fff" stroke-width="1.6"/>`),
  bonhomme:avI(`<circle cx="24" cy="34" r="10" fill="#f8fbff"/><circle cx="24" cy="19" r="7.4" fill="#f8fbff"/><path d="M17.6 15Q18 7 24 7Q30 7 30.4 15Q24 13 17.6 15Z" fill="#6fae7a"/><circle cx="24" cy="6" r="2.4" fill="#fffaf2" stroke-width="1.6"/><path d="M17 24Q24 28 31 24L31 26.6Q24 30.4 17 26.6Z" fill="#e8505e" stroke-width="1.8"/><path d="M24 19.4L31 20.6L24 21.6Z" fill="#f59a4b" stroke-width="1.4"/><g fill="#5b4250" stroke="none"><circle cx="21.4" cy="17.4" r="1.2"/><circle cx="26.6" cy="17.4" r="1.2"/><circle cx="24" cy="32" r="1.4"/><circle cx="24" cy="37" r="1.4"/></g>`),
  guirlpin:avI(`<path d="M5 13Q24 38 43 13" fill="none" stroke-width="9"/><path d="M5 13Q24 38 43 13" fill="none" stroke="#5f9a5a" stroke-width="5.4"/><g fill="#a9785a" stroke-width="1.8"><ellipse cx="15" cy="27" rx="3.4" ry="5"/><ellipse cx="24" cy="31" rx="3.4" ry="5"/><ellipse cx="33" cy="27" rx="3.4" ry="5"/></g><g fill="#e8505e" stroke-width="1.8"><path d="M5 13L0.6 9.6V16.4ZM5 13L9.4 9.6V16.4Z"/><path d="M43 13L38.6 9.6V16.4ZM43 13L47.4 9.6V16.4Z"/></g>`),
  bonnet:avI(`<path d="M10 33Q9 13 24 12Q37 12 38 33Z" fill="#e8505e"/><path d="M24 12Q33 6 37 12" fill="none" stroke-width="2"/><circle cx="38" cy="13" r="5" fill="#fffaf2"/><rect x="7" y="31" width="34" height="8" rx="4" fill="#fffaf2"/><path d="M15 22L18 26L21 22M27 22L30 26L33 22" fill="none" stroke="#fffaf2" stroke-width="2"/>`),
  luge:avI(`<path d="M5 37H36Q44 37 43 30Q42 26 38 28" fill="none" stroke-width="5"/><path d="M5 37H36Q44 37 43 30Q42 26 38 28" fill="none" stroke="#cfd8e2" stroke-width="2"/><path d="M11 37V30M22 37V30M33 37V30"/><rect x="5" y="23" width="34" height="7" rx="3" fill="#d9584e"/>`),
  houx:avI(`<circle cx="24" cy="25" r="14" fill="none" stroke-width="9"/><circle cx="24" cy="25" r="14" fill="none" stroke="#4f8a5a" stroke-width="5.4"/><g fill="#e8505e" stroke-width="1.6"><circle cx="20" cy="11" r="3"/><circle cx="26" cy="10" r="3"/><circle cx="23" cy="15" r="3"/></g><path d="M24 39L19 45M24 39L29 45" stroke="#e8505e" stroke-width="3"/>`),
  traineau:avI(`<path d="M3 40H36Q45 40 44 33Q43 29 38 31" fill="none" stroke-width="4.4"/><path d="M3 40H36Q45 40 44 33Q43 29 38 31" fill="none" stroke="#f2c75c" stroke-width="1.6"/><rect x="6" y="9" width="10" height="10" rx="1.6" fill="#7fb86a" stroke-width="1.8"/><rect x="15" y="12" width="8" height="8" rx="1.4" fill="#f6a5b4" stroke-width="1.8"/><path d="M4 34V14Q4 11 8 12L11 24H30Q34 24 36 18Q38 13 42 15Q44 24 39 30Q36 34 31 34Z" fill="#d9584e"/><path d="M5 30H33" stroke="#f2c75c" stroke-width="2.4"/>`),
  echarpe:avI(`<path d="M8 15Q24 22 40 15L40 23Q24 30 8 23Z" fill="#6fae7a"/><path d="M28 24L31 44L38 42L35 22Z" fill="#6fae7a"/><path d="M14 18V25M20 20V27M30 39L37 37M29.4 34L36.4 32" stroke="#fffaf2" stroke-width="2"/><path d="M31 44L30 47M34.4 43.4L34 46.6M37.6 42.4L38 45.6" stroke-width="1.8"/>`),
  etoile:avI(`<path d="M24 4L29.4 17.4L43.6 18.4L32.6 27.6L36.2 41.6L24 34L11.8 41.6L15.4 27.6L4.4 18.4L18.6 17.4Z" fill="#f6cc4e"/><path d="M18 20L22 13" fill="none" stroke="#fff6cf" stroke-width="3"/><path d="M40 4L41 7L44 8L41 9L40 12L39 9L36 8L39 7Z" fill="#fff" stroke-width="1.4"/>`)
};
const BOOST_N={patience:"Tisane calmante",tips:"Pot à pourboires",vip:"Invitations dorées"};
const DECO_N={bonhomme:["Bonhomme de neige","À poser dans la Clairière : Boutique, puis Mes objets."],guirlpin:["Guirlande de pommes de pin","Pour un mur de la maison : Boutique, puis Mes objets."],
  luge:["Luge en bois","À poser dans la Clairière. Un renard viendra s'y asseoir."],traineau:["Traîneau de Barbe-Neige","Le gros cadeau : à poser dans la Clairière, cadeaux compris."]};
const NOEL_N={bonnet:["Bonnet à pompon","Ta première tenue : tu pourras la mettre à un renard du refuge."],houx:["Couronne de houx","Pour la porte du Café."],
  echarpe:["Écharpe tricotée","Une tenue toute douce pour un renard du refuge."],etoile:["Étoile dorée du sapin","Tu as ouvert les 24 cases ! Elle ira tout en haut du grand sapin."]};
function avLabel(g){
  if(g.coins)return [AV_ART.coins,`${g.coins} pièces`,"Dans ta bourse du Café."];
  if(g.sucres)return [AV_ART.sucres,`${g.sucres} sucres d'orge`,"La monnaie de Noël, pour la boutique de Noël."];
  if(g.bells)return [AV_ART.bells,`${g.bells} clochettes`,"Pour les beaux objets de la boutique du jour."];
  if(g.boost)return [AV_ART[g.boost],`${g.n>1?g.n+" × ":""}${BOOST_N[g.boost]}`,"Un bonus du Café, rangé dans ta réserve."];
  if(g.deco)return [AV_ART[g.deco],...DECO_N[g.deco]];
  return [AV_ART[g.noel],...NOEL_N[g.noel]]}
// petite étiquette sous une case ouverte
const avShort=g=>g.coins?g.coins:g.sucres?g.sucres:g.bells?g.bells:"";

/* ---------- donner ---------- */
function avGive(b,g){
  if(g.sucres)b.sucres=(b.sucres||0)+g.sucres;
  if(g.bells)b.bells=(b.bells||0)+g.bells;
  if(g.coins||g.boost||g.deco){const G=b.gift=b.gift||{};
    if(g.coins)G.coins=(G.coins||0)+g.coins;
    if(g.boost){G.boost=G.boost||{};G.boost[g.boost]=(G.boost[g.boost]||0)+(g.n||1)}
    if(g.deco){G.deco=G.deco||{};G.deco[g.deco]=(G.deco[g.deco]||0)+1}}
  if(g.noel){b.noel=b.noel||{};b.noel[g.noel]=1}}
function avOpen(d,gel){const T=avToday();if(!T)return;const b=bourse(),av=avOf(b,T.y),st=avState(av,d,T.t);
  if(!(st==="today"||(st==="gel"&&gel)))return;
  av.o[d]=Date.now();if(st==="gel")av.g++;
  const gifts=AV[d].slice();for(const g of gifts)avGive(b,g);
  if(!av.star&&Object.keys(av.o).length>=24){av.star=1;const g={noel:"etoile"};avGive(b,g);gifts.push(g)}
  putBourse(b);deliverGifts();return gifts}

/* ---------- l'écran ---------- */
const snowSVG=`<svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M12 2V22M3.4 7L20.6 17M3.4 17L20.6 7"/><path d="M9 3.6L12 6L15 3.6M9 20.4L12 18L15 20.4M3 10.6L6.4 9L5.6 5.4M21 13.4L17.6 15L18.4 18.6M3 13.4L6.4 15L5.6 18.6M21 10.6L17.6 9L18.4 5.4"/></g></svg>`;
function avHead(av,T){const left=AV_GELS-av.g,miss=AV_ORDER.filter(d=>avState(av,d,T.t)==="gel").length,n=Object.keys(av.o).length;
  const line=T.t>24?(n>=24?"Les 24 cases sont ouvertes. Joyeux Noël !":miss?`Noël est passé, mais tu peux encore rattraper ${miss>1?"tes cases oubliées":"ta case oubliée"} jusqu'au 6 janvier.`:"Noël est passé : à l'année prochaine !")
    :av.o[T.t]?`Reviens demain pour la case ${T.t+1>24?"… ah non, c'était la dernière !":T.t+1} !`:`Case du jour : la ${T.t} t'attend !`;
  return `<p class="avline">${line}</p><div class="avgels"><span class="gl">${[0,1].map(i=>`<i class="${i<left?"on":""}">${snowSVG}</i>`).join("")}</span><span>${left?`<b>${left} gel${left>1?"s":""}</b> pour rattraper une case oubliée.`:"<b>Plus de gel</b> : les cases oubliées ont fondu."}</span></div>`}
function avCell(av,d,T){const st=avState(av,d,T.t),g=AV[d];
  const inside=st==="open"?`<span class="gift">${g.map(x=>avLabel(x)[0]).join("")}</span>${avShort(g[0])?`<small>${avShort(g[0])}</small>`:""}`:st==="lost"?`<span class="melt">${snowSVG}</span>`:"";
  return `<button class="avc s-${st}${d===24?" big":""}" data-avd="${d}" type="button" aria-label="Case ${d}"><span class="in">${inside}</span>${st==="open"||st==="lost"?"":`<span class="door"><b>${d}</b>${st==="gel"?`<em>${snowSVG}</em>`:""}</span>`}</button>`}
function avSheet(){const T=avToday();if(!T)return;const b=bourse(),av=avOf(b,T.y),el=document.getElementById("aventin");
  el.innerHTML=`${avHead(av,T)}<div class="avgrid">${AV_ORDER.map(d=>avCell(av,d,T)).join("")}</div>
    <div class="avbag"><span>${AV_ART.coins} ${((JSON.parse(localStorage.getItem("cafe-renards-v1")||"{}")||{}).coins||0)+((b.gift||{}).coins||0)}</span><span>${AV_ART.bells} ${b.bells||0}</span><span>${AV_ART.sucres} ${b.sucres||0}</span></div>`;
  const dlg=document.getElementById("avent");if(!dlg.open)dlg.showModal()}
function avReveal(gifts,d){const el=document.getElementById("avreveal");
  el.innerHTML=`<div class="avr-in${gifts.length>1?" multi":""}"><p class="avr-d">Case ${d}</p>${gifts.map(g=>{const [art,name,sub]=avLabel(g);return `<div class="avr-g${g.noel==="etoile"?" star":""}"><span class="avr-art">${art}</span><strong>${name}</strong><span>${sub}</span></div>`}).join("")}
    <button class="enter" type="button" id="avok">Merci !</button></div>${Array.from({length:14},(_,i)=>`<i class="sparkle" style="--a:${i*360/14}deg;--r:${90+(i%3)*30}px;--c:${["#f6cc4e","#e8505e","#6fae7a","#fff"][i%4]}"></i>`).join("")}`;
  el.hidden=false;document.getElementById("avok").onclick=()=>{el.hidden=true;avSheet();avCard()}}
function avAsk(d){const el=document.getElementById("avreveal");
  el.innerHTML=`<div class="avr-in"><p class="avr-d">Case ${d}</p><div class="avr-g"><span class="avr-art gel">${snowSVG}</span><strong>Tu l'as oubliée</strong><span>Un gel la rouvre. Il t'en reste ${AV_GELS-avOf(bourse(),avToday().y).g}.</span></div>
    <button class="enter" type="button" id="avyes">Utiliser un gel</button><button class="avno" type="button" id="avno">Plus tard</button></div>`;
  el.hidden=false;document.getElementById("avno").onclick=()=>{el.hidden=true};document.getElementById("avyes").onclick=()=>{el.hidden=true;avTap(d,1)}}
function avTap(d,gel){const T=avToday();if(!T)return;const av=avOf(bourse(),T.y),st=avState(av,d,T.t),c=document.querySelector(`[data-avd="${d}"]`);
  if(st==="lock"){avToast(d-T.t>1?`Encore ${d-T.t} jours avant la case ${d}.`:`La case ${d}, c'est demain !`,c);return}
  if(st==="lost"){avToast("Celle-là a fondu : plus de gel pour la rattraper.",c);return}
  if(st==="open")return;
  if(st==="gel"&&!gel){avAsk(d);return}
  const gifts=avOpen(d,gel);if(!gifts)return;
  if(c)c.classList.add("opening");setTimeout(()=>avReveal(gifts,d),c?650:0)}
function avToast(t,c){const el=document.getElementById("avtip");el.textContent=t;el.hidden=false;clearTimeout(avToast.h);avToast.h=setTimeout(()=>{el.hidden=true},2200);
  if(c){c.classList.remove("nope");void c.offsetWidth;c.classList.add("nope")}}
// la carte de l'accueil : visible du 1er décembre au 6 janvier, avec un point quand une case attend
function avCard(){const T=avToday(),card=document.getElementById("avcard");if(!card)return;card.hidden=!T;if(!T)return;
  const av=avOf(bourse(),T.y),todo=T.t<=24&&!av.o[T.t],miss=AV_ORDER.some(d=>avState(av,d,T.t)==="gel");
  card.classList.toggle("todo",todo||miss);
  document.getElementById("avsub").textContent=todo?`La case ${T.t} t'attend !`:miss?"Une case oubliée à rattraper":T.t>24?`${Object.keys(av.o).length} cases sur 24 ouvertes`:"Reviens demain pour la suivante"}
function avInit(){const card=document.getElementById("avcard");if(!card)return;card.onclick=avSheet;
  document.getElementById("aventin").onclick=e=>{const b=e.target.closest("[data-avd]");if(b)avTap(+b.dataset.avd)};avCard()}
