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
