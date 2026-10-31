/* La Clairière : sauvegarde (R), lien avec le Café, simulation page fermée, arrivées. */
const load=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
deliverGifts(); // les cadeaux du calendrier de l'Avent (bourse.js), avant de lire la sauvegarde
let R=load(KEY);
if(!R||R.ver!==2){
  // nouvelle partie ; de l'ancienne Clairière (v1, restée intacte) on ne garde que les renards déjà croisés
  const old=load(OLDKEY);
  R={ver:2,res:{petitpois:{at:Date.now(),h:0,pet:""}},met:{},photos:[],glands:40,gf:0,bowl:null,
    last:Date.now(),lastArr:"",wildDay:"",snap:{},legacy:{},old:old&&old.seen?Object.fromEntries(Object.keys(old.seen).map(id=>[id,1])):{},news:[],intro:0};
  // les clients déjà servis au Café avant le refuge peuvent suivre Roussette
  const C=load(CAFEKEY);if(C&&C.seen)for(const id in C.seen)if(canFollow(id))R.legacy[id]=1;
}
R.fish=R.fish||0; // poissons pêchés dans la mare, pour la gamelle de poisson
R.story=R.story||{};R.souv=R.souv||{}; // histoires : étapes finies par renard ; souvenirs reçus
function save(){try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}}
function canFollow(id){const f=FOX[id];return f&&!f.event&&!WILD[id]&&id!=="roussette"}
const isRes=id=>!!R.res[id];
// compagnon au Café (Petit Pois par défaut) ; R.tog[id] = journées ensemble au Café déjà comptées en cœurs
R.buddy=R.buddy||"petitpois";R.tog=R.tog||{};
function syncTogether(){const T=(load(CAFEKEY)||{}).together||{},got=[];
  for(const id in T){const n=T[id].n-(R.tog[id]||0);if(n>0&&R.res[id]){R.res[id].h+=n;got.push([id,n])}if(T[id].n>(R.tog[id]||0))R.tog[id]=T[id].n}
  if(got.length)save();return got}
// le nom choisi au Café (Roussette par défaut)
const ME=()=>(load(CAFEKEY)||{}).name||"Roussette";

/* ---------- arrivées depuis le Café ---------- */
// une fois toutes les histoires finies (story.js) : au plus un nouveau renard par jour réel,
// tiré parmi les clients bien servis depuis la dernière arrivée
function candidates(){
  const C=load(CAFEKEY)||{},happy=C.happy||{},w={};
  for(const id of new Set([...Object.keys(happy),...Object.keys(R.legacy)])){
    if(!canFollow(id)||isRes(id))continue;
    const n=Math.max(0,(happy[id]||0)-(R.snap[id]||0))+(R.legacy[id]?1:0);if(n>0)w[id]=n;
  }
  return w;
}
function checkArrival(){
  if(R.lastArr===today()||!chainDone())return null;
  const w=candidates(),ids=Object.keys(w);if(!ids.length)return null;
  let r=Math.random()*ids.reduce((a,id)=>a+w[id],0),id=ids[0];
  for(const k of ids){r-=w[k];if(r<=0){id=k;break}}
  const C=load(CAFEKEY)||{};
  R.res[id]={at:Date.now(),h:0,pet:""};R.lastArr=today();R.snap={...(C.happy||{})};delete R.legacy[id];
  R.news.push({k:"arr",id,t:Date.now()});save();return id;
}

/* ---------- simulation ---------- */
// le tirage d'une visite ne dépend que de la gamelle et de l'instant : on sait d'avance quand quelqu'un viendra (notifications, push.js)
function visitRoll(t){let h=2166136261;for(const ch of R.bowl.type+R.bowl.until+":"+t){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  h^=h>>>15;h=Math.imul(h,2246822507);h^=h>>>13;h=Math.imul(h,3266489909);h^=h>>>16;return (h>>>0)/4294967296}
// la prochaine visite à la gamelle (0 = personne avant qu'elle soit vide), en refaisant les pas de simulate sans rien changer
function nextVisit(){const B=R.bowl&&BOWLS[R.bowl.type];if(!B||!B.p)return 0;let t=R.last,day=R.wildDay,n=R.wildN;
  for(;;){t+=STEP;if(t>R.bowl.until)return 0;if(day!==today(t)){day=today(t);n=0}
    if(n<2&&visitRoll(t)<(metAny()?B.p:.3)&&visitPool(R.bowl.type,t).length)return t}}
// les renards vivent même page fermée : glands laissés, gamelle mangée, visites des sauvages
function simulate(live){
  const now=Date.now();let t=Math.max(R.last,now-MAXSIM);const seen=[];
  while(t+STEP<=now){
    t+=STEP;
    for(const id in R.res)R.gf+=GLANDS_DAY[lvOf(R.res[id].h)]/48;
    if(R.gf>=1){const n=Math.floor(R.gf);R.pend=(R.pend||0)+n;R.gf-=n} // laissés dans l'herbe, à ramasser
    if(R.bowl&&t>R.bowl.until)R.bowl=null;
    const B=R.bowl&&BOWLS[R.bowl.type];
    if(R.wildDay!==today(t)){R.wildDay=today(t);R.wildN=0} // deux visites par jour au plus
    // la toute première visite arrive vite : le joueur revient pour la voir
    if(B&&B.p&&R.wildN<2&&visitRoll(t)<(metAny()?B.p:.3)){
      // sauvages de cette gamelle et inconnus dont le prochain indice va avec le moment (sauvages.js)
      const pool=visitPool(R.bowl.type,t);
      if(pool.length){const id=pool[Math.floor(Math.random()*pool.length)],ph={id,bowl:R.bowl.type,t};
        const first=!INC[id]&&!R.met[id];if(INC[id])incoPhoto(id,ph);else R.met[id]=1;R.wildN++;
        R.photos.push(ph);R.bowl=null;
        R.news.push({k:"wild",id,t,first,clue:ph.clue,live:!!live});seen.push(id)}
    }
  }
  R.last=t;save();return seen;
}

/* ---------- amitié ---------- */
// une caresse par jour et par renard installé : un cœur et un gland
function pet(id){const r=R.res[id];if(!r||r.pet===today())return 0;
  const a=lvOf(r.h);r.h++;r.pet=today();R.glands++;save();return lvOf(r.h)>a?2:1}
const wantsHug=id=>!!R.res[id]&&R.res[id].pet!==today();

/* ---------- rencontres (pour le carnet et le grand portrait) ---------- */
function metIds(){
  const C=load(CAFEKEY)||{},s=new Set([...Object.keys(R.res),...Object.keys(R.met)]);
  return {refuge:s,cafe:new Set(Object.keys(C.seen||{})),old:new Set(Object.keys(R.old))};
}
