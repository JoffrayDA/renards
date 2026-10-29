/* Sauvegarde en ligne (29/10/2026) : une copie des parties dans Firestore (saves/{code}), sans écran de connexion
   (connexion anonyme de js/push.js, à charger avant). Le code de sauvegarde (12 lettres et chiffres) permet de retrouver
   sa partie sur un autre téléphone : le connaître suffit, comme une clé (les règles interdisent de lister les sauvegardes).
   La copie part quand quelque chose a changé : à l'accueil, en quittant un jeu, quand l'app passe en arrière-plan. */
const CK="renards-cloud",SAVED=["cafe-renards-v1","clairiere-renards-v2","clairiere-renards-v1","renards-stats","renards-son"];
const cget=()=>{try{return JSON.parse(localStorage.getItem(CK))||{}}catch(e){return {}}};
const cset=o=>{try{localStorage.setItem(CK,JSON.stringify(o))}catch(e){}};
const ABC="23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // sans 0/O, 1/I/L : le code se recopie à la main
const newCode=()=>[...crypto.getRandomValues(new Uint8Array(12))].map(x=>ABC[x%ABC.length]).join("").replace(/(.{4})(?=.)/g,"$1-");
const cleanCode=s=>s.toUpperCase().replace(/[^0-9A-Z]/g,"").replace(/(.{4})(?=.)/g,"$1-");
const saveUrl=code=>`https://firestore.googleapis.com/v1/projects/${PUSH.project}/databases/(default)/documents/saves/${code}`;
const fnv=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)};
function snapshot(){const o={};for(const k of SAVED){const v=localStorage.getItem(k);if(v!=null)o[k]=v}return o}
let cloudBusy=0;
async function cloudSave(){
  if(!PUSH.key||cloudBusy||navigator.onLine===false)return false;
  const snap=snapshot();if(!snap["cafe-renards-v1"]&&!snap["clairiere-renards-v2"])return false; // rien à garder
  const data=JSON.stringify(snap),sig=fnv(data),C=cget();if(C.sig===sig)return true;
  cloudBusy=1;
  try{if(!C.code){C.code=newCode();cset(C)}
    const T=await pushToken(),t=Date.now();
    const r=await fetch(saveUrl(C.code)+"?updateMask.fieldPaths=data&updateMask.fieldPaths=t",{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:"Bearer "+T.it},
      body:JSON.stringify({fields:{data:{stringValue:data},t:{integerValue:String(t)}}})});
    if(r.ok){const Q=cget();Q.sig=sig;Q.t=t;cset(Q)}return r.ok}
  catch(e){return false}finally{cloudBusy=0}}
// une partie gardée en ligne, ou null si le code ne mène à rien
async function cloudLoad(code){const T=await pushToken(),r=await fetch(saveUrl(code),{headers:{Authorization:"Bearer "+T.it}});
  if(!r.ok)return null;const d=await r.json();if(!d.fields||!d.fields.data)return null;
  return {code,t:+d.fields.t.integerValue,data:JSON.parse(d.fields.data.stringValue)}}
// remplace la partie du téléphone ; l'ancienne reste de côté dans renards-avant-recuperation
function cloudApply(s){try{localStorage.setItem("renards-avant-recuperation",JSON.stringify(snapshot()))}catch(e){}
  for(const k of SAVED)localStorage.removeItem(k);for(const k in s.data)if(SAVED.includes(k))localStorage.setItem(k,s.data[k]);
  cset({code:s.code,sig:fnv(JSON.stringify(s.data)),t:s.t});location.reload()}
// une page ouverte seule (pas dans l'accueil) se sauvegarde aussi quand on la quitte
if(window.top===window)document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")cloudSave()});
