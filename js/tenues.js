/* Les tenues d'hiver (01/11/2026, idée de Joffray) : chaque renard a SON bonnet et SON écharpe, à ses couleurs, avec son motif.
   Mamie Brindille les tricote contre des pelotes de laine (atelier de Noël, js/clairiere/atelier.js) ; on choisit ensuite dans la
   fiche du renard s'il porte le bonnet, l'écharpe, les deux ou rien. On les voit partout où il est dessiné : Clairière et Café.
   Le bonnet et l'écharpe du calendrier de l'Avent (cases 12 et 24, b.noel) sont ceux de Roussette.
   Dans la bourse (bourse.js) : b.ten = {own:{id:"hs"}, on:{id:"hs"}} (h = bonnet, s = écharpe), b.pel = pelotes. */
// [laine, deuxième couleur, motif, pompon] ; glow : le pompon de Luciole brille
const TEN={
  roussette:["#e0505a","#fffaf2","flocons","#fffaf2"],petitpois:["#8fc07e","#fff6dc","pois","#fff6dc"],mitaine:["#7cb8e0","#fffaf2","flocons","#fffaf2"],
  luciole:["#2e3a66","#ffe680","etoiles","#ffe680",1],gaston:["#e0855c","#3d6a8a","rayures","#3d6a8a"],galette:["#f0a868","#fff3e2","zigzag","#fff3e2"],
  pantoufle:["#f6b8c4","#fffaf2","coeurs","#fffaf2"],grignote:["#a9785a","#f2c45a","zigzag","#f2c45a"],brindille:["#b9a4d6","#fffaf2","torsade","#f6a5b4"],
  plouf:["#5fb0c8","#fffaf2","rayures","#f2c45a"],biscuit:["#f2c45a","#8a5a3a","pois","#8a5a3a"],copeau:["#c4935a","#3f6a4f","carreaux","#3f6a4f"],
  sesame:["#f2c45a","#5f6a9a","rayures","#5f6a9a"],cannelle:["#c96a3e","#ffd1a8","torsade","#ffd1a8"],charbon:["#5f5864","#f2a35c","rayures","#f2a35c"],
  brume:["#9ec3ef","#fffaf2","rayures","#fffaf2"],moka:["#7a5240","#f3e2c8","torsade","#f3e2c8"],painepice:["#b8603e","#fffaf3","zigzag","#fffaf3"],
  libellule:["#c9a8ec","#a9e0d6","pois","#a9e0d6"],brioche:["#f2c47a","#e0855c","coeurs","#e0855c"],marquis:["#8a6ac0","#f2c45a","carreaux","#f2c45a"],
  zaza:["#f6a5b4","#fffaf2","coeurs","#fffaf2"],flocon:["#fbfcff","#9fc3e8","flocons","#9fc3e8"],noisette:["#3f6a4f","#f2c45a","carreaux","#d9a066"],
  givre:["#dfeaf6","#7aa7d6","flocons","#fffaf2"],comete:["#3a3f78","#ffe680","etoiles","#ffe680"],somnus:["#7a6ab8","#fff6c8","etoiles","#fff6c8"],
  reglisse:["#2e2a30","#e0505a","rayures","#e0505a"],aurore:["#f2c6e0","#c9a8ec","rayures","#fffaf2"],maree:["#3d6a8a","#fffaf2","rayures","#fffaf2"],
  perle:["#fff4f6","#f6b3c4","pois","#f6b3c4"],yeti:["#9ec3ef","#fffaf2","flocons","#fffaf2"],gribouille:["#ffd84a","#7cb8e0","pois","#e0505a"]};
const TEN_MOTIF={rayures:"rayé",pois:"à pois",flocons:"à flocons",etoiles:"étoilé",coeurs:"à cœurs",zigzag:"à zigzags",torsade:"torsadé",carreaux:"à losanges"};
const PEL_COST=2; // pelotes pour un bonnet ou une écharpe
let tenC=null;
const tenB=()=>tenC||(tenC=Object.assign({own:{},on:{}},bourse().ten||{}));
function tenPut(t){const b=bourse();b.ten=t;putBourse(b);tenC=null}
const pelN=()=>bourse().pel||0;
function addPel(n){const b=bourse();b.pel=Math.max(0,(b.pel||0)+n);putBourse(b);return b.pel}
// k : "h" (bonnet) ou "s" (écharpe)
const tenOwn=(id,k)=>!!TEN[id]&&((tenB().own[id]||"").includes(k)||id==="roussette"&&!!(bourse().noel||{})[k==="h"?"bonnet":"echarpe"]);
const tenOn=(id,k)=>tenOwn(id,k)&&(tenB().on[id]||"").includes(k);
function tenSet(id,k,v){const t=tenB(),s=(t.on[id]||"").replace(k,"");t.on[id]=v?s+k:s;tenPut(t)}
// Mamie Brindille tricote : la pièce est tout de suite portée
function tenKnit(id,k){if(tenOwn(id,k)||pelN()<PEL_COST)return false;addPel(-PEL_COST);const t=tenB();t.own[id]=(t.own[id]||"")+k;t.on[id]=(t.on[id]||"")+k;tenPut(t);return true}
const wearOf=id=>TEN[id]?{h:tenOn(id,"h"),s:tenOn(id,"s")}:null;

/* ---------- le dessin (appelé par foxArt, dans le repère du renard) ---------- */
// T : haut de la tête, N : le cou, W : demi-largeur du cou, hw : demi-largeur de la brioche
function tenHat(id,T,hw){const [c1,c2,mo,pp,gl]=TEN[id],L=60-hw*.8,R=60+hw*.8,top=T-9,band=T+7,S=`stroke-width="1.6"`;
  // demi-largeur du bonnet à la hauteur y (pour poser le motif à l'intérieur)
  const half=y=>(R-L)/2*Math.sqrt(Math.max(0,Math.min(1,(y-top)/(band+2-top))));
  const star=(x,y,r)=>`<path d="M${x} ${y-r} L${x+r*.3} ${y-r*.3} L${x+r} ${y} L${x+r*.3} ${y+r*.3} L${x} ${y+r} L${x-r*.3} ${y+r*.3} L${x-r} ${y} L${x-r*.3} ${y-r*.3}Z" fill="${c2}" stroke="none"/>`;
  const motif={
    rayures:[band-4,band-10].map(y=>`<path d="M${(60-half(y)+1).toFixed(1)} ${y} Q60 ${y-2.4} ${(60+half(y)-1).toFixed(1)} ${y}" fill="none" stroke="${c2}" stroke-width="3.2"/>`).join(""),
    pois:[[-11,band-5],[0,band-11],[11,band-5],[-5,band-15],[6,band-15]].map(([dx,y])=>`<circle cx="${60+dx}" cy="${y}" r="2" fill="${c2}" stroke="none"/>`).join(""),
    flocons:[[-9,band-7,3.4],[8,band-10,3]].map(([dx,y,r])=>`<path d="M${60+dx} ${y-r} V${y+r} M${60+dx-r*.87} ${y-r/2} L${60+dx+r*.87} ${y+r/2} M${60+dx-r*.87} ${y+r/2} L${60+dx+r*.87} ${y-r/2}" stroke="${c2}" stroke-width="1.5" fill="none"/>`).join(""),
    etoiles:[[-9,band-7,3.6],[8,band-11,3]].map(([dx,y,r])=>star(60+dx,y,r)).join(""),
    coeurs:[[-8,band-7],[8,band-9]].map(([dx,y])=>`<path d="M${60+dx} ${y+2.6} C${56+dx} ${y} ${57+dx} ${y-3.4} ${60+dx} ${y-1.2} C${63+dx} ${y-3.4} ${64+dx} ${y} ${60+dx} ${y+2.6}Z" fill="${c2}" stroke="none"/>`).join(""),
    zigzag:(()=>{const y=band-6,w=half(y)-2,n=6;let d=`M${(60-w).toFixed(1)} ${y}`;for(let i=1;i<=n;i++)d+=` L${(60-w+2*w*i/n).toFixed(1)} ${y+(i%2?-4:0)}`;return `<path d="${d}" fill="none" stroke="${c2}" stroke-width="2.2"/>`})(),
    torsade:[-7,7].map(dx=>`<path d="M${60+dx} ${band} q-3 -3 0 -6 q3 -3 0 -6 q-3 -3 0 -5" fill="none" stroke="${c2}" stroke-width="2"/>`).join(""),
    carreaux:[[-9,band-6],[0,band-10],[9,band-6]].map(([dx,y])=>`<path d="M${60+dx} ${y-3.4} L${63+dx} ${y} L${60+dx} ${y+3.4} L${57+dx} ${y}Z" fill="${c2}" stroke="none"/>`).join("")}[mo]||"";
  return `<path d="M${L} ${band+2} Q${L-1} ${top+5} 60 ${top} Q${R+1} ${top+5} ${R} ${band+2}Z" fill="${c1}"/>${motif}`
    +`<rect x="${(L-3).toFixed(1)}" y="${band}" width="${(R-L+6).toFixed(1)}" height="8.5" rx="4.2" fill="${c2===c1?"#fffaf2":c2}"/>`
    +Array.from({length:Math.round((R-L)/5)},(_,i)=>`<path d="M${(L+1+i*5).toFixed(1)} ${band+2} v4.5" stroke="${c1}" stroke-width="1.2" opacity=".5"/>`).join("")
    +(gl?`<circle cx="60" cy="${top-3}" r="11" fill="#fff3a0" opacity=".35" stroke="none"/>`:"")
    +`<circle cx="60" cy="${top-3}" r="6.4" fill="${pp}"/><path d="M57 ${top-6} q3 -2 6 0 M56 ${top-2} q4 2 8 0" fill="none" ${S} opacity=".35"/>`}
function tenScarf(id,N,W){const [c1,c2,mo]=TEN[id],L=60-W,R=60+W,tx=60+W*.42;
  return `<path d="M${L} ${N-4} Q60 ${N+6} ${R} ${N-4} L${R} ${N+3} Q60 ${N+13} ${L} ${N+3}Z" fill="${c1}"/>`
    +`<path d="M${L+3} ${N+.6} Q60 ${N+10} ${R-3} ${N+.6}" fill="none" stroke="${c2}" stroke-width="2.4"/>`
    +`<path d="M${tx} ${N+5} L${tx+2} ${N+21} L${tx+10} ${N+19} L${tx+8} ${N+4}Z" fill="${c1}"/>`
    +(mo==="rayures"||mo==="zigzag"||mo==="torsade"?`<path d="M${tx+.8} ${N+11} L${tx+8.8} ${N+10} M${tx+1.4} ${N+16} L${tx+9.4} ${N+15}" stroke="${c2}" stroke-width="2.2"/>`
      :`<circle cx="${tx+5}" cy="${N+12}" r="2" fill="${c2}" stroke="none"/>`)
    +`<path d="M${tx+2.6} ${N+21} v3 M${tx+5.4} ${N+20.6} v3 M${tx+8.2} ${N+20.2} v3" stroke="${c2===c1?INK:c2}" stroke-width="1.6"/>`}

/* ---------- la quête de Noël du jour (du 1er décembre au 6 janvier), commune aux deux jeux ---------- */
// une par jour, la même pour tout le monde ; elle rapporte des pelotes (pour l'atelier) et des sucres d'orge (boutique de Noël)
// ?noel=12 fait comme si on était le 12 décembre (32 à 37 : du 1er au 6 janvier), ?noel=0 coupe Noël, comme à la Clairière
const XMAS_Q=new URLSearchParams(location.search).get("noel");
function xmasDay(){if(XMAS_Q!=null){const n=+XMAS_Q||0;return n>0&&n<=37?n:0}const d=new Date();
  return d.getMonth()===11?d.getDate():d.getMonth()===0&&d.getDate()<=6?31+d.getDate():0}
const NQ=[{k:"hug",n:5,t:"Fais 5 câlins aux renards du refuge"},{k:"serve",n:20,t:"Sers 20 clients au Café"},{k:"photo",n:2,t:"Prends 2 photos à la Clairière"},
  {k:"star",n:1,t:"Gagne une étoile au Café ou pendant une Nuit de Noël"},{k:"envie",n:1,t:"Exauce une petite envie à la Clairière"},{k:"serve",n:30,t:"Sers 30 clients au Café"},{k:"hug",n:8,t:"Fais 8 câlins aux renards du refuge"}];
const NQ_GIFT={pel:2,sucres:3};
const nqDef=()=>{const d=xmasDay();return d?NQ[(d*5)%NQ.length]:null};
function nqState(){const d=xmasDay(),b=bourse();if(!d)return null;if(!b.nq||b.nq.d!==d){b.nq={d,p:0,paid:0};putBourse(b)}return b.nq}
// un geste qui compte pour la quête du jour ; renvoie le message à afficher quand elle est réussie
function noelEvent(k,n=1){const q=nqDef(),s=nqState();if(!q||!s||q.k!==k||s.paid)return "";
  const b=bourse();b.nq.p=Math.min(q.n,b.nq.p+n);let msg="";
  if(b.nq.p>=q.n){b.nq.paid=1;b.pel=(b.pel||0)+NQ_GIFT.pel;b.sucres=(b.sucres||0)+NQ_GIFT.sucres;msg=`Quête de Noël réussie ! +${NQ_GIFT.pel} pelotes, +${NQ_GIFT.sucres} sucres d'orge`}
  putBourse(b);return msg}
