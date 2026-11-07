/* Kitsune Café : la leçon de Petit Pois (07/11/2026).
   Un pote de Joffray ne comprenait rien au jeu : une séance guidée, hors des 40 journées (pas d'étoiles, pas de quêtes),
   où Petit Pois explique dans une bulle posée sur le comptoir et montre du doigt (une pattoune) ce qu'il faut toucher.
   Elle suit le premier écran de bienvenue ; on la revoit depuis la fiche des jours 1 et 2.
   Une étape « info » met le jeu en pause et se passe en touchant l'écran ; les autres attendent que le joueur ait fait le geste
   (on regarde l'état du jeu, pas l'ordre des touchers : un geste fait en avance compte quand même). */
let TU=null;
const tuQ=s=>document.querySelector(s),tuRec=k=>REC[k].name;
// un client de la leçon : sa commande est imposée, sa patience longue tant que Petit Pois explique
function tuSpawn(order,pat){if(!spawn())return null;const c=G.cust[G.cust.length-1];
  c.order=order.map(r=>({r,done:0}));c.pat=c.patMax=pat;c.qp=999;G.next=1e9;dirty=true;return c}
const tuServed=c=>!!c&&c.order.every(o=>o.done);
const tuGone=c=>!c||!G.cust.includes(c)||c.state==="happy"||c.state==="angry"||c.state==="walkout";
const TU_STEPS=[
  {info:1,expr:"joy",say:()=>`Bienvenue au Kitsune Café, ${ME()} ! Je vais te montrer comment on sert les clients. Regarde, en voilà un !`,exit:()=>{TU.c1=tuSpawn(["cafe"],600)}},
  {expr:"open",say:"Il arrive…",done:()=>TU.c1.state==="wait"},
  {info:1,expr:"open",say:"Ce qu'il veut est dans sa bulle : un café. La petite barre verte, c'est sa patience.",focus:()=>custEl(TU.c1)},
  {expr:"joy",say:"Touche le café pour le préparer.",focus:()=>tuQ('[data-st="cafe"]'),done:()=>G.st.cafe.some(s=>s.busy||s.ready)||G.tray.includes("cafe")||tuServed(TU.c1)},
  {expr:"open",say:"Ça chauffe… Quand il est prêt, touche-le encore : il va sur ton plateau.",focus:()=>tuQ('[data-st="cafe"]'),done:()=>G.tray.includes("cafe")||tuServed(TU.c1)},
  {expr:"joy",say:"Il est sur le plateau. Maintenant, touche le client pour le servir !",focus:()=>custEl(TU.c1),done:()=>tuServed(TU.c1)},
  {info:1,expr:"joy",say:"Bravo ! Il paie, et il laisse un pourboire. Plus tu sers vite, plus le pourboire est gros.",exit:()=>{TU.c2=tuSpawn(["croissant"],600)}},
  {expr:"open",say:"Un autre client ! Celui-là a faim.",done:()=>TU.c2.state==="wait"},
  {expr:"open",say:()=>`Il veut : ${tuRec("croissant").toLowerCase()}. La vitrine est vide : touche-la pour lancer une fournée.`,focus:()=>tuQ('[data-pa="croissant"]'),done:()=>G.oven.state!=="idle"||G.vit.croissant>0||G.tray.includes("croissant")||tuServed(TU.c2)},
  {expr:"surprise",say:"Ça cuit dans le four… Quand c'est prêt, touche vite le four, sinon ça brûle !",focus:()=>tuQ("[data-oven]"),done:()=>G.vit.croissant>0||G.tray.includes("croissant")||tuServed(TU.c2),
    back:()=>G.oven.state==="idle"&&!G.vit.croissant&&!G.tray.includes("croissant"),backSay:"Oups, ça a brûlé ! Pas grave : relance une fournée."},
  {expr:"joy",say:()=>`C'est en vitrine. Touche « ${tuRec("croissant")} » pour la poser sur le plateau.`,focus:()=>tuQ('[data-pa="croissant"]'),done:()=>G.tray.includes("croissant")||tuServed(TU.c2)},
  {expr:"joy",say:"Et sers-le !",focus:()=>custEl(TU.c2),done:()=>tuServed(TU.c2)},
  {info:1,expr:"open",say:"Une fournée en donne plusieurs : il en reste en vitrine pour les prochains clients. Pas besoin de recuire à chaque fois !",focus:()=>tuQ('[data-pa="croissant"]')},
  {info:1,expr:"joy",say:"Dernier exercice : deux clients à la fois, et je ne dis plus rien ! Une erreur sur le plateau ? Touche l'article deux fois pour le jeter.",
    exit:()=>{const p=Math.round(G.cfg.pat*1.6);TU.c3=tuSpawn(["cafe","croissant"],p);TU.c4=tuSpawn(["cafe"],p)}},
  {free:1,done:()=>tuGone(TU.c3)&&tuGone(TU.c4)},
  {info:1,expr:"joy",say:()=>`Tu as tout compris, ${ME()} !`},
  {info:1,expr:"open",say:"Dans une vraie journée, il y a un objectif en pièces : la barre en haut de l'écran. Atteins-le pour gagner une étoile et ouvrir la journée suivante. Le top, c'est trois étoiles !"},
  {info:1,expr:"open",say:"Avec tes pièces, la boutique te donne des améliorations : un café plus rapide, des clients plus patients, de plus gros pourboires."},
  {info:1,expr:"joy",say:"Et plus tard, je pourrai même t'aider à servir ! Allez, le jour 1 t'attend."}
];
function startTuto(){
  closeSheet();newDay(1);G.tuto=1;G.cfg={...G.cfg,c:99};G.next=1e9;G.vit.croissant=0;S.tuto=1;save();
  TU={i:-1,el:document.createElement("div"),fg:document.createElement("div"),cat:document.createElement("div")};
  TU.el.className="coach";TU.fg.className="tfinger";TU.cat.className="tcatch";
  // la pattoune (refaite le 07/11/2026, Joffray : « un peu mieux ») : une patte de renard qui descend d'en haut, coussinets roses,
  // elle appuie (petit écrasement) et une onde part du bout au même moment ; le bout de la patte est le point (30, 76) du dessin
  TU.fg.innerHTML=`<i class="tring"></i><i class="tring t2"></i><svg viewBox="0 0 60 80" aria-hidden="true"><g transform="rotate(16 30 76)" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <path d="M18 46 V30 Q18 16 30 16 Q42 16 42 30 V46Z" fill="#f2a65e"/><path d="M23 40 V30 Q23 22 29 21" stroke="#fff" stroke-width="3" opacity=".5" fill="none"/>
    <path d="M17 44 q4 -6 8 -1 q5 -6 10 0 q4 -5 8 1" fill="#fff6ea"/>
    <ellipse cx="30" cy="59" rx="17" ry="16" fill="#fff6ea"/>
    <g stroke-width="2.2" fill="#f7a3b5"><path d="M30 73 c-7 0 -10 -4 -8 -8 c2 -4 6 -3 8 -5 c2 2 6 1 8 5 c2 4 -1 8 -8 8Z"/><ellipse cx="18.5" cy="54" rx="3.4" ry="4.2"/><ellipse cx="25" cy="48.5" rx="3.4" ry="4.2"/><ellipse cx="35" cy="48.5" rx="3.4" ry="4.2"/><ellipse cx="41.5" cy="54" rx="3.4" ry="4.2"/></g>
    <ellipse cx="25" cy="66" rx="2.4" ry="1.4" fill="#fff" stroke="none" opacity=".8"/></g></svg>`;
  $("scene").appendChild(TU.el);document.body.appendChild(TU.fg);document.body.appendChild(TU.cat);
  TU.cat.onclick=tuNext;TU.el.onclick=()=>{if(TU&&TU_STEPS[TU.i].info)tuNext()};
  tuNext();
}
function tuSay(st,txt){const t=txt||(typeof st.say==="function"?st.say():st.say);
  TU.el.innerHTML=`<div class="cpic">${foxArt(FOX.petitpois,{expr:st.expr||"open",portrait:1})}</div><div class="cbub"><b>Petit Pois</b><span>${t}</span>${st.info?"<small>Touche pour continuer ▼</small>":""}</div>`}
function tuNext(){if(!TU||!G)return;const old=TU_STEPS[TU.i];if(old&&old.exit)old.exit();
  if(++TU.i>=TU_STEPS.length){tuEnd(true);return}
  const st=TU_STEPS[TU.i];G.paused=st.info?1:0;TU.cat.hidden=!st.info;TU.el.hidden=!!st.free;TU.el.classList.toggle("info",!!st.info);
  if(!st.free)tuSay(st);bip(st.info?"plic":"pop");dirty=true}
// à chaque image (main.js) : le doigt suit sa cible, l'étape avance quand le geste est fait
function tuTick(){if(!TU)return;const st=TU_STEPS[TU.i];if(!st)return;
  if(st.info&&!G.paused)G.paused=1; // revenu de la pause : on reste sur l'explication
  if(!st.info&&st.back&&st.back()){TU.i--;const b=TU_STEPS[TU.i];tuSay(b,st.backSay)}
  else if(!st.info&&st.done&&st.done()){tuNext();return}
  const el=st.focus&&st.focus();
  document.querySelectorAll(".tfocus").forEach(x=>{if(x!==el)x.classList.remove("tfocus")});
  if(!el){TU.fg.hidden=true;return}
  if(!el.dataset.cust)el.classList.add("tfocus");const r=el.getBoundingClientRect();TU.fg.hidden=false;
  TU.fg.style.left=r.left+r.width/2+"px";TU.fg.style.top=r.top+Math.min(r.height/2,70)+"px"}
// fin de la leçon (ou abandon depuis la pause) : rien n'est compté, on revient à la carte sur la fiche du jour 1
function tuEnd(done){if(!TU)return;TU.el.remove();TU.fg.remove();TU.cat.remove();document.querySelectorAll(".tfocus").forEach(x=>x.classList.remove("tfocus"));TU=null;
  if(!done)return;G=null;$("closed").hidden=false;$("hint").textContent="";dirty=true;save();openMap();daySheet(1)}
// l'Apprenti serveur, juste acheté : le compagnon explique ce qu'il fait (Joffray, 07/11/2026)
function serveurTalk(){const b=buddy();
  itTalk([[b,"joy",`Me voilà apprenti serveur ! Pendant le service, je m'assois à côté du comptoir.`],
    [b,"open","Pose sur le plateau ce que les clients attendent : je leur apporte tout seul, le plus pressé d'abord."],
    [b,"shy","Par contre, je ne touche ni au four ni aux machines : ça, c'est ton travail !"],
    [b,"joy","Toi, tu prépares. Moi, je cours. À nous deux, on va être super rapides !"]],()=>shop())}
