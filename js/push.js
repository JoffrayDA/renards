/* Notifications (28/10/2026). Le téléphone s'abonne (Web Push) et tient à jour sa fiche dans Firestore (push/{uid}) :
   les heures où quelque chose l'attend (fox : un renard pour son histoire, inco : une visite à la gamelle, arr : un client
   du Café qui s'installe). GitHub lance tools/push-send.mjs toutes les 30 min, qui envoie : une par jour au plus, jamais la nuit.
   Pas de SDK Firebase : l'API REST suffit (connexion anonyme, une fiche par téléphone). */
const PUSH={key:"AIzaSyAxbw-c_VFhOx856MBlOKEw1JWpGKElLi0",project:"kitsune-cafe",vapid:"BAsAHBBOqsx2X4nrMCzkZcItxnTZ50AJZr2HuVy5U6HM-Y8HhnsBF0b9GPfEJ9DYCDNEEEl6G8Nq4VplgD90YFI"};
const PK="renards-push";
const pget=()=>{try{return JSON.parse(localStorage.getItem(PK))||{}}catch(e){return {}}};
const pset=o=>{try{localStorage.setItem(PK,JSON.stringify(o))}catch(e){}};
// iPhone : seulement l'app installée sur l'écran d'accueil (iOS 16.4+), sinon PushManager n'existe pas
const pushOk=()=>!!PUSH.key&&"serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window;
const pushOn=()=>pushOk()&&Notification.permission==="granted"&&!!pget().on;
const b64u=s=>Uint8Array.from(atob((s+"=".repeat((4-s.length%4)%4)).replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0));
const post=(u,body,type="application/json")=>fetch(u,{method:"POST",headers:{"Content-Type":type},body}).then(r=>r.json());
// connexion anonyme, renouvelée avec le jeton gardé dans le téléphone
async function pushToken(){const P=pget();
  if(P.it&&P.exp>Date.now()+6e4)return P;
  if(P.rt){const r=await post(`https://securetoken.googleapis.com/v1/token?key=${PUSH.key}`,"grant_type=refresh_token&refresh_token="+encodeURIComponent(P.rt),"application/x-www-form-urlencoded");
    if(r.id_token)Object.assign(P,{it:r.id_token,rt:r.refresh_token,uid:r.user_id,exp:Date.now()+r.expires_in*1000});else P.rt=null}
  if(!P.rt){const r=await post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${PUSH.key}`,'{"returnSecureToken":true}');
    if(!r.idToken)throw new Error("connexion");Object.assign(P,{it:r.idToken,rt:r.refreshToken,uid:r.localId,exp:Date.now()+r.expiresIn*1000})}
  pset(P);return P}
const docUrl=uid=>`https://firestore.googleapis.com/v1/projects/${PUSH.project}/databases/(default)/documents/push/${uid}`;
// écrit la fiche (seulement si quelque chose a changé) : l'abonnement, les heures prévues (0 = rien), le décalage horaire
async function pushWrite(when){
  const reg=await navigator.serviceWorker.ready;
  let sub=await reg.pushManager.getSubscription();
  // abonné avec une ancienne clé (changée le 29/10/2026) : on se réabonne avec la nouvelle
  const key=b64u(PUSH.vapid),old=sub&&sub.options.applicationServerKey&&new Uint8Array(sub.options.applicationServerKey);
  if(sub&&old&&old.join()!==key.join()){await sub.unsubscribe();sub=null}
  if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
  const f={sub:JSON.stringify(sub),fox:when.fox||0,inco:when.inco||0,arr:when.arr||0,tz:new Date().getTimezoneOffset()},sig=JSON.stringify(f);
  if(pget().sig===sig)return;
  const P=await pushToken(),fields=Object.fromEntries(Object.entries(f).map(([k,v])=>[k,typeof v==="number"?{integerValue:String(Math.round(v))}:{stringValue:v}]));
  const r=await fetch(docUrl(P.uid)+"?"+Object.keys(f).map(k=>"updateMask.fieldPaths="+k).join("&"),{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:"Bearer "+P.it},body:JSON.stringify({fields})});
  if(r.ok){const Q=pget();Q.sig=sig;pset(Q)}}
// à appeler sur un toucher (le navigateur demande la permission)
async function pushEnable(when){if(!pushOk())return false;
  if(await Notification.requestPermission()!=="granted")return false;
  const P=pget();P.on=1;P.sig=null;pset(P);await pushWrite(when);return true}
async function pushOff(){const P=pget();P.on=0;P.sig=null;pset(P);
  try{const reg=await navigator.serviceWorker.ready,sub=await reg.pushManager.getSubscription();if(sub)await sub.unsubscribe()}catch(e){}
  try{const T=await pushToken();await fetch(docUrl(T.uid),{method:"DELETE",headers:{Authorization:"Bearer "+T.it}})}catch(e){}}
const pushSync=when=>{if(pushOn())pushWrite(when).catch(()=>{})};
