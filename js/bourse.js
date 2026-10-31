/* La bourse commune aux deux jeux (docs/economie.md, 30/10/2026).
   Les pièces restent dans la sauvegarde du Café (S.coins) : la Clairière les lit et les dépense directement là
   (un seul jeu est ouvert à la fois dans l'app). Les clochettes, la monnaie rare, ont leur propre clé :
   nouvelles étoiles et quêtes du Café, histoires finies de la Clairière ; elles achètent les beaux objets de la boutique du jour. */
const BOURSE_KEY="kitsune-bourse";
const bourse=()=>{try{return JSON.parse(localStorage.getItem(BOURSE_KEY))||{}}catch(e){return {}}};
const bellsN=()=>bourse().bells||0;
function addBells(n){const b=bourse();b.bells=Math.max(0,(b.bells||0)+n);try{localStorage.setItem(BOURSE_KEY,JSON.stringify(b))}catch(e){}return b.bells}
// une clochette dorée nouée d'un ruban rose
const bellSVG=`<svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="#5b4250" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M12 5.5C7.8 5.5 6.6 9 6.6 12.4V15.6L5 18.4H19L17.4 15.6V12.4C17.4 9 16.2 5.5 12 5.5Z" fill="#f6cc4e"/><path d="M8.6 10.4Q9.2 8 11.2 7.6" fill="none" stroke="#fff6cf" stroke-width="1.6"/><circle cx="12" cy="20" r="1.9" fill="#e0a52e"/><path d="M12 5.5L8.4 2.6Q7.4 4.8 9.4 5.6M12 5.5L15.6 2.6Q16.6 4.8 14.6 5.6" fill="#f48aa6"/></g></svg>`;
// des sucres d'orge, la monnaie de Noël (docs/economie.md) : rayés rouge et blanc
const sucreSVG=`<svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="#5b4250" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21V8.5A3.5 3.5 0 0 1 16 8.5V10" fill="none" stroke-width="6"/><path d="M9 21V8.5A3.5 3.5 0 0 1 16 8.5V10" fill="none" stroke="#fffaf2" stroke-width="3.2"/></g><path d="M7.6 19.6L10.4 17.6M7.6 15.6L10.4 13.6M7.8 11.4L10.4 9.6M10.8 6.2L12.6 5.2M14.4 5.4L15.6 7M14.6 8.8L17.4 9.4" stroke="#e8505e" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const sucresN=()=>bourse().sucres||0;
const putBourse=b=>{try{localStorage.setItem(BOURSE_KEY,JSON.stringify(b))}catch(e){}};
/* Les cadeaux venus d'ailleurs (calendrier de l'Avent, sur l'accueil) attendent dans b.gift = {coins, boost:{id:n}, deco:{clé:n}}.
   deliverGifts les range dans les sauvegardes qui existent déjà : chaque jeu l'appelle avant de lire la sienne
   (sinon il réécrirait par-dessus), l'accueil juste après avoir ouvert une case (aucun jeu n'est alors ouvert). */
function deliverGifts(){const b=bourse(),g=b.gift;if(!g)return;
  const rw=(k,ok,f)=>{let s=null;try{s=JSON.parse(localStorage.getItem(k))}catch(e){}if(!s||!ok(s))return false;f(s);try{localStorage.setItem(k,JSON.stringify(s));return true}catch(e){return false}};
  if((g.coins||g.boost)&&rw("cafe-renards-v1",C=>C.own,C=>{C.coins=(C.coins||0)+(g.coins||0);C.boost=C.boost||{};for(const k in g.boost||{})C.boost[k]=(C.boost[k]||0)+g.boost[k]})){delete g.coins;delete g.boost}
  if(g.deco&&rw("clairiere-renards-v2",R=>R.ver===2,R=>{R.deco=R.deco||{inv:{},out:[],home:[],n:0,sold:{}};for(const k in g.deco)R.deco.inv[k]=(R.deco.inv[k]||0)+g.deco[k]}))delete g.deco;
  if(!g.coins&&!g.boost&&!g.deco)delete b.gift;putBourse(b)}
