/* Café Frimousse : le Grand rush, le niveau infini de chaque quartier (19/11/2026, Joffray : « un dernier niveau bonus où le but
   c'est de continuer le plus longtemps possible, le niveau est infini (quasi impossible à 10 min) et comme ça on voit qui a le
   meilleur score »). Il s'ouvre quand le dernier jour du quartier est réussi ; c'est le rond doré « ∞ » entre le jour 30 et le café.
   Les clients arrivent sans fin, de plus en plus serrés et de moins en moins patients (rushTick) ; trois clients fâchés et c'est
   fini. Le score, c'est la recette (G.earned). La graine est la même pour tout le monde : le classement mesure le jeu, pas la chance.
   Pas de bonus à usage unique (même chance pour tous). Pièces : 10 par minute tenue, versées à la fin (RUSH_PAY ; 20/11/2026, Joffray avait gagné 2 100 pièces en 9 min, « on devrait gagner
   genre 10 par minute max ») ; rien n'est gagné ni perdu pendant le rush.
   Record dans S.rush[monde] = {best, sec} ; classement en ligne dans Firestore, une fiche par joueur (rush_<monde>/<uid>,
   connexion anonyme de push.js), les règles sont dans docs/classement.md. */
const RUSH_LIVES=3,RUSH_PAY=10;
const rushOpen=w=>{const Q=WORLDS[w||WORLD];return !!Q&&!!Q.sv().stars[Q.days.length]};
const rushRec=w=>{S.rush=S.rush||{};const k=w||WORLD;return S.rush[k]||(S.rush[k]={best:0,sec:0})};
const rushTime=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
const HEART=on=>`<svg viewBox="0 0 20 18" aria-hidden="true"><path d="M10 16.5 C4 12 1.5 9 1.5 5.8 C1.5 3.3 3.4 1.5 5.8 1.5 C7.6 1.5 9 2.6 10 4 C11 2.6 12.4 1.5 14.2 1.5 C16.6 1.5 18.5 3.3 18.5 5.8 C18.5 9 16 12 10 16.5Z" fill="${on?"#f0707a":"#e8dcd6"}" stroke="#5b4250" stroke-width="1.8" stroke-linejoin="round"/></svg>`;

function newRush(){
  const Q=WD(),N=Q.days.length;boostSel.clear();
  newDay(N);
  G.rush=1;G.duel=0;G.replay=true;G.rng=rng(424242+N*31+WORLD.length*977);
  // départ : le rythme du jour 40 du premier café, sans le « hard » des derniers jours, un peu plus doux (échauffement)
  if(Q.rushMusic)(MUSIC.again||MUSIC.want)(Q.rushMusic);
  const c0=cfgOf(Q.days[N-1].base);G.r0={gap:c0.gap*RUSH_W[0],pat:c0.pat*RUSH_W[1]};G.cfg={...G.cfg,c:1e9,goal:1,max:3,gap:G.r0.gap,pat:G.r0.pat};
  dirty=true;
}
// la difficulté monte avec le temps : après m minutes, les clients arrivent k fois plus vite et patientent moins
// (réglé avec python tools/balance-bot.py --rush : le bot parfait tient environ 9 minutes, un bon joueur 3 à 4)
const RUSH_W=[1.25,1.15],rushK=m=>1+.12*m+.05*m*m;
function rushTick(){
  const m=G.t/60;G.cfg.gap=G.r0.gap/rushK(m);G.cfg.pat=G.r0.pat/(1+.1*m);
  const sc=$("rsc");if(sc&&sc._v!==G.earned){sc.textContent=G.earned;sc._v=G.earned}
  const tm=$("rtm"),ts=rushTime(G.t);if(tm&&tm._v!==ts){tm.textContent=ts;tm._v=ts}
  if(G.lost>=RUSH_LIVES&&!G.rushEnd){G.rushEnd=1;setTimeout(endRush,700)}
}
function rushHud(){
  const left=Math.max(0,RUSH_LIVES-G.lost);
  return `<span class="pill day rinf">∞</span><span class="pill rsc"><b id="rsc">${G.earned}</b> pts</span><span class="pill" id="rtm">${rushTime(G.t)}</span><span class="pill rlife">${[0,1,2].map(i=>HEART(i<left)).join("")}</span>`;
}

/* ---------- la fiche du Grand rush (sur la carte) ---------- */
function rushSheet(){
  const Q=WD(),N=Q.days.length,R=rushRec();
  if(!rushOpen()){openSheet(`<h2>Le Grand rush</h2><p class="sub">Réussis le jour ${N} de ${Q.name} pour ouvrir le niveau infini : des clients sans fin, de plus en plus pressés. Tiens le plus longtemps possible !</p><div class="col"><button class="btn big wide" data-close type="button">D'accord</button></div>`);return}
  openSheet(`<h2>Le Grand rush</h2><p class="sub" style="text-align:center"><b>${Q.name}</b> · niveau infini</p>
  <p class="sub">Les clients n'arrêtent jamais d'arriver, de plus en plus vite. Au <b>3e client fâché</b>, c'est fini. Ton score : tout ce que tu encaisses.</p>
  <div class="rrec"><div><small>Ton record</small><b>${R.best||"–"}</b>${R.best?`<small>${rushTime(R.sec)}</small>`:""}</div></div>
  <div id="rtop" class="rtop"><p class="sub" style="text-align:center">Chargement du classement…</p></div>
  <div class="col"><button class="btn big wide" data-rushplay type="button">C'est parti !</button></div>`);
  rushBoard($("rtop"),R.best,5);
}
function endRush(){
  if(!G||!G.rush)return;
  const R=rushRec(),e=G.earned,sec=Math.floor(G.t),rec=e>R.best;
  G.run=0;if(rec){R.best=e;R.sec=sec}
  const coins=Math.floor(sec/60*RUSH_PAY),bRow=buddyRow();S.coins+=coins;S.total+=coins;
  fillQuests();save();
  G=null;$("closed").hidden=false;$("hint").textContent="";renderDecor();dirty=true;
  endFx(rec?3:1);
  openSheet(`<h2>${rec?"Nouveau record !":"Fin du rush"}</h2><div class="rbig"><b>${e}</b><small>points en ${rushTime(sec)}</small></div>
  ${rec?"":`<p class="sub" style="text-align:center">Ton record : <b>${R.best}</b> (${rushTime(R.sec)})</p>`}
  <p class="sub" style="text-align:center">+${coins} pièces</p>${bRow}
  <div id="rtop" class="rtop"><p class="sub" style="text-align:center">${rec?"Envoi de ton score…":"Chargement du classement…"}</p></div>
  <div class="col"><button class="btn big wide" data-rushplay type="button">Rejouer</button><button class="btn ghost wide" data-rushall type="button">Tout le classement</button><button class="btn ghost wide" data-act="map" type="button">Carte</button></div>`,true);
  const w=WORLD,go=()=>rushBoard($("rtop"),R.best,5);
  if(rec)rushSubmit(w,R.best,R.sec).then(go,go);else go();
}
function rushAll(){
  openSheet(`<h2>Classement</h2><p class="sub" style="text-align:center"><b>${WD().name}</b> · Grand rush</p><div id="rtop" class="rtop"><p class="sub" style="text-align:center">Chargement…</p></div>
  <div class="col"><button class="btn ghost wide" data-rushback type="button">Retour au Grand rush</button></div>`);
  rushBoard($("rtop"),rushRec().best,50);
}

/* ---------- le classement en ligne (Firestore, API REST, comme cloud.js) ---------- */
const RUSH_BAD=["merde","putain","pute","connard","connasse","salope","encule","batard","nique","couille","enfoire","bordel","nazi","hitler","fuck","shit","bitch","cunt","dick","porn","whore","nigg","negre","pedo"];
const RUSH_SHORT=["fdp","ntm","pd","bite","cul","sex","con","tg"];
// le nom affiché : celui du joueur, sans lien ni gros mot, 14 lettres au plus (le jeu est joué par des enfants aussi)
function rushName(){
  let n=String(ME()||"Roussette").replace(/https?:\/\/\S*|www\.\S*|\S+\.(com|fr|net|org|io|gg)\b/gi,"").replace(/[<>"'`\\]/g,"").replace(/\s+/g," ").trim().slice(0,14);
  const low=n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[0@]/g,"o").replace(/[1!]/g,"i").replace(/3/g,"e").replace(/\$/g,"s");
  if(!n||RUSH_BAD.some(b=>low.replace(/[^a-z]/g,"").includes(b))||low.split(/[^a-z]+/).some(w=>RUSH_SHORT.includes(w)))n="Renard mystère";
  return n}
const rushEsc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const rushDocs=()=>`https://firestore.googleapis.com/v1/projects/${PUSH.project}/databases/(default)/documents`;
async function rushSubmit(w,score,sec){
  if(!PUSH.key||navigator.onLine===false)throw new Error("hors ligne");
  const T=await pushToken(),f={name:{stringValue:rushName()},score:{integerValue:String(score)},sec:{integerValue:String(sec)},t:{integerValue:String(Date.now())}};
  const r=await fetch(`${rushDocs()}/rush_${w}/${T.uid}?`+Object.keys(f).map(k=>"updateMask.fieldPaths="+k).join("&"),{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:"Bearer "+T.it},body:JSON.stringify({fields:f})});
  if(!r.ok)throw new Error("refusé");return true}
async function rushTop(w,n){
  const T=await pushToken();
  const r=await fetch(`${rushDocs()}:runQuery`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+T.it},
    body:JSON.stringify({structuredQuery:{from:[{collectionId:"rush_"+w}],orderBy:[{field:{fieldPath:"score"},direction:"DESCENDING"}],limit:n}})});
  if(!r.ok)throw new Error("classement");
  return {uid:T.uid,rows:(await r.json()).filter(x=>x.document).map(x=>({uid:x.document.name.split("/").pop(),name:x.document.fields.name.stringValue,score:+x.document.fields.score.integerValue,sec:+x.document.fields.sec.integerValue}))}}
// sa place : le nombre de joueurs qui ont fait mieux, plus un
async function rushRank(w,score){
  const T=await pushToken();
  const r=await fetch(`${rushDocs()}:runAggregationQuery`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+T.it},
    body:JSON.stringify({structuredAggregationQuery:{structuredQuery:{from:[{collectionId:"rush_"+w}],where:{fieldFilter:{field:{fieldPath:"score"},op:"GREATER_THAN",value:{integerValue:String(score)}}}},aggregations:[{alias:"n",count:{}}]}})});
  if(!r.ok)throw new Error("place");const d=await r.json();return 1+ +((d[0]&&d[0].result&&d[0].result.aggregateFields.n.integerValue)||0)}
async function rushBoard(box,best,n){
  if(!box)return;const w=WORLD;
  try{
    if(!PUSH.key||navigator.onLine===false)throw new Error("hors ligne");
    const {uid,rows}=await rushTop(w,n),mine=rows.findIndex(r=>r.uid===uid);
    let me="";if(best&&mine<0){const k=await rushRank(w,best);me=`<div class="rk me sep"><i>${k}</i><span>${rushEsc(rushName())}</span><b>${best}</b></div>`}
    if(!box.isConnected)return;
    box.innerHTML=rows.length?rows.map((r,i)=>`<div class="rk${r.uid===uid?" me":""}${i<3?" p"+(i+1):""}"><i>${i+1}</i><span>${rushEsc(r.name)}</span><b>${r.score}</b><small>${rushTime(r.sec)}</small></div>`).join("")+me
      :`<p class="sub" style="text-align:center">Personne n'a encore de score ici. Sois le premier renard du classement !</p>`;
  }catch(e){if(box.isConnected)box.innerHTML=`<p class="sub" style="text-align:center">Classement indisponible pour l'instant (connexion ?). Ton record reste gardé sur ce téléphone.</p>`}
}
