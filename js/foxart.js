/* Dessin partagé des renards (planche de modèle). Toutes les poses partent de la brioche assise :
   même silhouette, même visage, même taille. Prototype : pas encore branché sur les jeux. */
// Différences de look testées sur la planche avant de toucher aux données des jeux.
// Roussette (l'héroïne) garde le roux classique ; les autres se distinguent par un motif, pas seulement une couleur.
const LOOK={
  galette:{c:{b:"#d9764c",ch:"#fff3e2",e:"#5e2c1c",s:"#5e2c1c",t:"#fff3e2"},mark:"liste"},
  pantoufle:{c:{b:"#f0b7a2",ch:"#fff6ec",e:"#9a6a48",s:"#fffaf3",t:"#fffaf3"},acc:"bonnetnuit",mark:"chaussettes"},
  biscuit:{mark:"pepites"},
  painepice:{mark:"glacage"},
  mitaine:{mark:"moufle"},
  givre:{c:{b:"#dfeaf6",ch:"#ffffff",e:"#9fb6cf",s:"#9fb6cf",t:"#ffffff"},mark:"neige"},
  luciole:{mark:"lueur"}
};
// Nouveaux renards, en essai sur la planche avant d'entrer dans FOXES.
// Gribouille : dessine sur les vitres embuées ; béret, taches de peinture, et le bout de la queue trempé dans le bleu comme un pinceau.
const NEW_FOXES=[
  {id:"gribouille",name:"Gribouille",rar:"commun",acc:"beret",mark:"peinture",c:{b:"#d6a6b8",ch:"#fff6f8",e:"#8a5a6e",s:"#8a5a6e",t:"#7cb8e0"},bio:"Dessine du bout de la patte sur les vitres embuées, les jours de pluie."}
];
function foxArt(f,o={}){
  if(LOOK[f.id])f={...f,...LOOK[f.id]};
  const sil=o.sil,pose=sil?"sit":(o.pose||"sit");
  const c=sil?{b:"#e3d9df",ch:"#e3d9df",e:"#e3d9df",s:"#e3d9df",t:"#e3d9df"}:f.c;
  const st=sil?"#cbbec6":INK,e=f.ears||1,sc=f.scale||1,dark="#2e2028";
  const pink=sil?"none":"#f9c0cb",gh=f.ghost&&!sil;
  const earPair=(L,R,base)=>[L,R].map((d,i)=>{const [bx,by]=base[i];
    return `<g class="${i?"earR":""}" style="transform-origin:${bx}px ${by}px"><g transform="translate(${bx} ${by}) scale(${e}) translate(${-bx} ${-by})">${d}</g></g>`}).join("");
  const ear=(dy,left)=>{const X=x=>left?x:120-x;
    return `<path d="M${X(33)} ${44+dy} Q${X(30)} ${24+dy} ${X(38)} ${16+dy} Q${X(50)} ${23+dy} ${X(55)} ${36+dy}Z" fill="${c.b}"/>`+(sil?"":`<path d="M${X(37)} ${38+dy} Q${X(36)} ${27+dy} ${X(39.5)} ${22+dy} Q${X(46)} ${27+dy} ${X(49)} ${35+dy}Z" fill="${pink}" stroke="none"/><path d="M${X(38)} ${16.6+dy} Q${X(34.5)} ${19+dy} ${X(33.6)} ${23+dy} Q${X(38)} ${21+dy} ${X(42)} ${19.5+dy}Z" fill="${c.e}" stroke="none"/>`)};
  const face=(Y,happy)=>`<ellipse cx="60" cy="${Y+6.5}" rx="12.5" ry="7.5" fill="${c.ch}" stroke="none"/>`+(sil?"":
    (happy?`<path d="M44 ${Y+1} Q48 ${Y-4} 52 ${Y+1} M68 ${Y+1} Q72 ${Y-4} 76 ${Y+1}" fill="none" stroke-width="2.6"/>`
      :gh?`<g class="eyes" style="transform-origin:60px ${Y}px">${[47,73].map(x=>`<ellipse cx="${x}" cy="${Y-.5}" rx="4.6" ry="6.2" fill="${dark}" stroke="none"/><circle cx="${x+1.4}" cy="${Y-2.8}" r="1.7" fill="#fff" stroke="none"/><circle cx="${x-1.5}" cy="${Y+2.2}" r=".8" fill="#fff" stroke="none"/>`).join("")}</g>`
      :`<g class="eyes" style="transform-origin:60px ${Y}px"><ellipse cx="48" cy="${Y}" rx="2.9" ry="3.5" fill="${dark}" stroke="none"/><ellipse cx="72" cy="${Y}" rx="2.9" ry="3.5" fill="${dark}" stroke="none"/><circle cx="48.9" cy="${Y-1.3}" r=".95" fill="#fff" stroke="none"/><circle cx="72.9" cy="${Y-1.3}" r=".95" fill="#fff" stroke="none"/></g>`)
    +`<ellipse cx="40" cy="${Y+5}" rx="4.6" ry="2.6" fill="#f6a5b4" opacity=".6" stroke="none"/><ellipse cx="80" cy="${Y+5}" rx="4.6" ry="2.6" fill="#f6a5b4" opacity=".6" stroke="none"/><ellipse cx="60" cy="${Y+3.6}" rx="2.1" ry="1.5" fill="${dark}" stroke="none"/>${f.stitch?`<path d="M47 ${Y+7} Q60 ${Y+15} 73 ${Y+7}" fill="none" stroke-width="1.8"/>`+[.12,.28,.44,.6,.76,.92].map(t=>{const x=47+26*t,y=Y+7+16*t*(1-t);return `<path d="M${x.toFixed(1)} ${(y-2.4).toFixed(1)} v4.8" stroke-width="1.3"/>`}).join(""):`<path d="M56 ${Y+5.6} Q58 ${Y+8.6} 60 ${Y+5.6} Q62 ${Y+8.6} 64 ${Y+5.6}" fill="none" stroke-width="1.8"/>`}`);
  const acc=(top,Y,neck,w)=>{if(sil)return "";return({
    feuille:`<path d="M64 ${top+2} Q74 ${top-16} 88 ${top-10} Q82 ${top+5} 64 ${top+2}Z" fill="#a9d68f"/><path d="M67 ${top} Q76 ${top-6} 85 ${top-9}" fill="none" stroke="#6f9a60" stroke-width="1.6"/>`,
    gland:`<path d="M41 ${top+9} Q60 ${top-14} 79 ${top+9} Q60 ${top+3} 41 ${top+9}Z" fill="#c08a5a"/><path d="M60 ${top-5} Q61 ${top-11} 65 ${top-13}" fill="none" stroke-width="2.4"/>`,
    fleur:`<g transform="translate(84 ${top+5})">${[0,72,144,216,288].map(a=>`<circle cx="${(5.5*Math.cos(a*Math.PI/180)).toFixed(1)}" cy="${(5.5*Math.sin(a*Math.PI/180)).toFixed(1)}" r="4.2" fill="#ffc7d8" stroke-width="1.8"/>`).join("")}<circle r="3" fill="#ffe27a" stroke-width="1.6"/></g>`,
    flocon:`<g transform="translate(84 ${top+5})" stroke="#9fc3e8" stroke-width="2.4"><path d="M0 -7 V7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5"/></g>`,
    etoile:`<g transform="translate(60 ${Y-12}) scale(.75)"><path d="M0 -8 l2.6 5.4 5.9.7-4.4 4 1.2 5.9L0 5.1-5.3 8l1.2-5.9-4.4-4 5.9-.7z" fill="#ffe680" stroke-width="2.2"/></g><path d="M100 ${top-2} l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#fff3a8" stroke-width="1.2"/>`,
    noeud:`<path d="M60 ${neck} L48 ${neck-7} L48 ${neck+7}Z M60 ${neck} L72 ${neck-7} L72 ${neck+7}Z" fill="#f6a8c8"/><circle cx="60" cy="${neck}" r="3.6" fill="#ec86b0"/>`,
    echarpe:`<path d="M${60-w} ${neck-4} Q60 ${neck+6} ${60+w} ${neck-4} L${60+w} ${neck+3} Q60 ${neck+13} ${60-w} ${neck+3}Z" fill="#f59a8b"/><path d="M${60+w*.4} ${neck+6} L${62+w*.4} ${neck+18} L${69+w*.4} ${neck+16} L${67+w*.4} ${neck+4}Z" fill="#e88576"/>`,
    lunettes:`<g fill="rgba(255,255,255,.35)" stroke-width="2.2"><circle cx="48" cy="${Y}" r="7.5"/><circle cx="72" cy="${Y}" r="7.5"/></g><path d="M55.5 ${Y-1} Q60 ${Y-4} 64.5 ${Y-1}" fill="none" stroke-width="2"/>`,
    parapluie:`<path d="M94 90 Q96 ${top+20} 98 ${top-4}" fill="none" stroke="#8a6a4a" stroke-width="2.6"/><path d="M74 ${top-2} Q98 ${top-32} 122 ${top-2} Q110 ${top-8} 98 ${top-2} Q86 ${top-8} 74 ${top-2}Z" fill="#a9d68f"/><path d="M98 ${top-2} V${top-22}" fill="none" stroke="#6f9a60" stroke-width="1.6"/>`
,
    bob:`<path d="M38 ${top+9} Q60 ${top-18} 82 ${top+9}Z" fill="#f7d77a"/><path d="M28 ${top+9} Q60 ${top+18} 92 ${top+9} Q60 ${top+3} 28 ${top+9}Z" fill="#f2c45a"/>`,
    bonnet:`<path d="M38 ${top+11} Q60 ${top-20} 82 ${top+11}Z" fill="#9ec3ef"/><rect x="36" y="${top+6}" width="48" height="9" rx="4.5" fill="#f4f8fb"/><circle cx="60" cy="${top-11}" r="5.5" fill="#fff"/>`,
    sorciere:`<ellipse cx="60" cy="${top+8}" rx="31" ry="6.5" fill="#7458a8"/><path d="M45 ${top+7} L56 ${top-22} Q60 ${top-33} 73 ${top-30} Q64 ${top-25} 66 ${top-16} L75 ${top+7}Z" fill="#8a6ac0"/><path d="M46.9 ${top+1} L73.1 ${top+1} L74.4 ${top+5} L45.6 ${top+5}Z" fill="#f2a35c" stroke-width="1.8"/><path d="M71 ${top-30} l1.4 2.6 2.8.4 -2 2 .5 2.8 -2.7 -1.3 -2.6 1.3 .5 -2.8 -2 -2 2.8 -.4z" fill="#f7d77a" stroke-width="1.2"/>`,
    citrouille:`<ellipse cx="60" cy="${top+3}" rx="18" ry="11" fill="#f2a35c"/><path d="M53 ${top-6} Q50 ${top+3} 53 ${top+13} M67 ${top-6} Q70 ${top+3} 67 ${top+13} M60 ${top-8} V${top+14}" fill="none" stroke-width="1.6" opacity=".55"/><path d="M60 ${top-7} q0 -6 5 -8" fill="none" stroke="#6fae5e" stroke-width="3.6"/><path d="M62 ${top-11} q7 -5 10 1 q-6 3 -10 -1Z" fill="#8fca7a" stroke-width="1.6"/>`,
    chauvesouris:`<path d="M60 ${top+3} Q52 ${top-9} 38 ${top-7} Q43 ${top-2} 41 ${top+4} Q47 ${top} 50 ${top+6} Q55 ${top+1} 60 ${top+3} Q65 ${top+1} 70 ${top+6} Q73 ${top} 79 ${top+4} Q77 ${top-2} 82 ${top-7} Q68 ${top-9} 60 ${top+3}Z" fill="#5f4f72"/><circle cx="60" cy="${top+1}" r="5.4" fill="#5f4f72"/><path d="M56 ${top-3} l1 -4 2 3 M64 ${top-3} l-1 -4 -2 3" fill="#5f4f72" stroke-width="1.6"/><circle cx="58" cy="${top+1}" r="1" fill="#ffe27a" stroke="none"/><circle cx="62" cy="${top+1}" r="1" fill="#ffe27a" stroke="none"/>`,
    vampire:`<path d="M${60-w*.92} ${neck-1} L${60-w-7} ${neck-19} L${60-w*.35} ${neck+3}Z M${60+w*.92} ${neck-1} L${60+w+7} ${neck-19} L${60+w*.35} ${neck+3}Z" fill="#c43a5a"/><path d="M60 ${neck+2} L51 ${neck-3} L51 ${neck+7}Z M60 ${neck+2} L69 ${neck-3} L69 ${neck+7}Z" fill="#3d2a35"/><circle cx="60" cy="${neck+2}" r="2.8" fill="#e2546e" stroke-width="1.6"/><path d="M56.2 ${Y+6.4} l1.3 3.4 1.3 -3.2Z M61.2 ${Y+6.2} l1.3 3.2 1.3 -3.4Z" fill="#fff" stroke-width="1"/>`,
    os:`<g fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round">${[0,1,2].map(i=>`<path d="M${(60-w*(.42-i*.08)).toFixed(1)} ${neck+4+i*5} Q60 ${neck+1+i*5} ${(60+w*(.42-i*.08)).toFixed(1)} ${neck+4+i*5}"/>`).join("")}<path d="M60 ${neck+1} V${neck+15}"/></g><g fill="none" stroke="#fff" stroke-width="1.8"><circle cx="48" cy="${Y}" r="5.8"/><circle cx="72" cy="${Y}" r="5.8"/></g><g transform="translate(89 ${top+5}) rotate(-32) scale(1.15)"><rect x="-8" y="-2.4" width="16" height="4.8" fill="#fff" stroke-width="1.8"/>${[[-8,-2.5],[-8,2.5],[8,-2.5],[8,2.5]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.2" fill="#fff" stroke-width="1.8"/>`).join("")}<rect x="-8.6" y="-1.5" width="17.2" height="3" fill="#fff" stroke="none"/></g>`,
    zombie:`<path d="M44 ${top+2} L80 ${top+15} L78 ${top+21} L42 ${top+8}Z" fill="#fff5e8"/><path d="M51 ${top+5} l-1.4 5 M59 ${top+8} l-1.4 5 M67 ${top+11} l-1.4 5 M75 ${top+14} l-1.4 5" stroke="#d8ccd4" stroke-width="1.4"/><path d="M75 ${Y+11} l10 -7" fill="none" stroke-width="1.6"/><path d="M76.5 ${Y+7} l2.4 3 M79.5 ${Y+5} l2.4 3 M82.5 ${Y+3} l2.4 3" fill="none" stroke-width="1.4"/><circle cx="40" cy="${Y-9}" r="2.6" fill="#7aa874" stroke-width="1.2"/>`,
    epouvantail:(()=>{const st="#c99a3a",hap=!!o.closed;
      // brins de paille sur le corps, et qui dépassent du cou et des joues
      let h=[[-.8,-8,-.5],[-.55,6,.4],[.6,-4,-.3],[.82,8,.5],[-.2,12,.2],[.3,14,-.4]].map(([k,dy,a])=>{const x=60+w*k,y=neck+dy;return `<path d="M${x.toFixed(1)} ${y} l${(6*Math.cos(a)).toFixed(1)} ${(6*Math.sin(a)).toFixed(1)}" stroke="${st}" stroke-width="1.6"/>`}).join("");
      h+=`<path d="M${60-w*.7} ${neck} l-7 7 M${60-w*.62} ${neck+2} l-4 9 M${60-w*.5} ${neck+3} l-1 9 M${60+w*.5} ${neck+3} l1 9 M${60+w*.62} ${neck+2} l4 9 M${60+w*.7} ${neck} l7 7" fill="none" stroke="#e8c048" stroke-width="2.4"/><path d="M${60-w*.6} ${neck-1} Q60 ${neck+5} ${60+w*.6} ${neck-1}" fill="none" stroke="#8a6a3e" stroke-width="2.6"/><path d="M60 ${neck+2} l-4 4 M60 ${neck+2} l4 4" stroke="#8a6a3e" stroke-width="2"/>`;
      h+=`<rect x="${60+w*.25}" y="${neck+6}" width="10" height="9" rx="1.4" fill="#9ec3ef" stroke-width="1.6"/><path d="M${60+w*.25+2} ${neck+8.5} h6 M${60+w*.25+2} ${neck+12.5} h6" stroke="${INK}" stroke-width=".9" stroke-dasharray="1.4 1.2"/>`;
      // yeux boutons (pas sur la pose contente, qui a les yeux fermés)
      if(!hap)h+=[48,72].map(x=>`<circle cx="${x}" cy="${Y}" r="4" fill="#3d2a35" stroke-width="1.4"/><circle cx="${x-1.2}" cy="${Y-1}" r=".8" fill="#fbeab4" stroke="none"/><circle cx="${x+1.2}" cy="${Y+1}" r=".8" fill="#fbeab4" stroke="none"/>`).join("");
      // chapeau de paille effiloché, ficelle et petit corbeau
      h+=`<path d="M25 ${top+11} l-5 3 M30 ${top+13} l-3 6 M95 ${top+11} l5 3 M90 ${top+13} l3 6" fill="none" stroke="#e8c048" stroke-width="2.4"/>`;
      h+=`<ellipse cx="60" cy="${top+8}" rx="36" ry="7.5" fill="#e8c060"/>`+Array.from({length:14},(_,i)=>{const a=Math.PI*(.04+.92*i/13),x=60-36*Math.cos(a),y=top+8+7.5*Math.sin(a);return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(-3*Math.cos(a)).toFixed(1)} ${(3.4*Math.sin(a)+.6).toFixed(1)}" stroke="${st}" stroke-width="1.4"/>`}).join("");
      h+=`<path d="M30 ${top+7} Q60 ${top+13} 90 ${top+7}" fill="none" stroke="${st}" stroke-width="1.2" opacity=".7"/><path d="M44 ${top+6} Q44 ${top-13} 60 ${top-16} Q76 ${top-13} 76 ${top+6}Z" fill="#f0cd6c"/><path d="M46 ${top-4} Q60 ${top-1} 74 ${top-4} M48 ${top-10} Q60 ${top-7} 72 ${top-10}" fill="none" stroke="${st}" stroke-width="1.2"/><path d="M57 ${top-15} l-2 -5 M60 ${top-16} v-5 M63 ${top-15} l2 -5" stroke="#e8c048" stroke-width="2"/><path d="M44.2 ${top+1} Q60 ${top+5} 75.8 ${top+1}" fill="none" stroke="#8a6a3e" stroke-width="2.6"/><path d="M68 ${top+3} l3 6 M70 ${top+2.5} l5 5" stroke="#8a6a3e" stroke-width="1.8"/>`;
      h+=`<path d="M86 ${top+2} l6 -3 l-1 5Z" fill="#3d2a35" stroke-width="1.4"/><ellipse cx="80" cy="${top+2}" rx="6.5" ry="4.8" fill="#3d2a35" stroke-width="1.6"/><circle cx="75.5" cy="${top-3}" r="3.8" fill="#3d2a35" stroke-width="1.6"/><path d="M72 ${top-3.4} l-4 1.2 l3.8 1.6Z" fill="#f2a35c" stroke-width="1"/><circle cx="74.8" cy="${top-4}" r="1" fill="#fff" stroke="none"/>`;
      return h})(),
    couronne:`<path d="M42 ${top+9} Q60 ${top+3} 78 ${top+9}" fill="none" stroke="#6fae5e" stroke-width="3"/>${[[45,top+5,5],[60,top,6.5],[75,top+5,5]].map(([x,y,r])=>`<path d="M${x} ${y-r+.5} q.5 -3 3.4 -3.8" fill="none" stroke="#6fae5e" stroke-width="2.2"/><ellipse cx="${x}" cy="${y}" rx="${r*1.25}" ry="${r}" fill="#f2a35c" stroke-width="2"/><path d="M${x-r*.7} ${y} l${r*.3} ${-r*.45} l${r*.3} ${r*.45}Z M${x+r*.1} ${y} l${r*.3} ${-r*.45} l${r*.3} ${r*.45}Z" fill="#ffe27a" stroke-width="1"/>`).join("")}`,
    magicienne:`<path d="M${60-w} ${neck-3} Q60 ${neck+9} ${60+w} ${neck-3} L${60+w+4} ${neck+8} Q60 ${neck+18} ${60-w-4} ${neck+8}Z" fill="#4a3a78"/>${[[-.55,7],[0,11],[.55,7]].map(([k,dy])=>`<path d="M${(60+w*k).toFixed(1)} ${neck+dy-3} l1 2 2 .3 -1.5 1.4 .4 2.1 -1.9 -1 -1.9 1 .4 -2.1 -1.5 -1.4 2 -.3z" fill="#f7d77a" stroke="none"/>`).join("")}<circle cx="60" cy="${neck+2}" r="3" fill="#f7d77a" stroke-width="1.6"/><path d="M${60+w*.7} ${neck+14} L${108} ${top+18}" stroke="#8a5a3a" stroke-width="3.4" stroke-linecap="round"/><path d="M108 ${top+9} l2.6 5.4 5.9.7 -4.4 4 1.2 5.9 -5.3 -2.9 -5.3 2.9 1.2 -5.9 -4.4 -4 5.9 -.7z" fill="#ffe680" stroke-width="2"/><path d="M100 ${top+4} l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1z M117 ${top+28} l.8 2 2 .8 -2 .8 -.8 2 -.8 -2 -2 -.8 2 -.8z" fill="#fff3a8" stroke-width="1"/><ellipse cx="60" cy="${top+8}" rx="33" ry="6.8" fill="#4a3a78"/><path d="M44 ${top+7} L54 ${top-24} Q58 ${top-36} 72 ${top-36} Q80 ${top-34} 84 ${top-28} Q76 ${top-31} 70 ${top-26} L76 ${top+7}Z" fill="#5d4a94"/><path d="M45.4 ${top+1} L74.6 ${top+1} L75.6 ${top+5.5} L44.4 ${top+5.5}Z" fill="#b48ae0" stroke-width="1.6"/><path d="M63 ${top-14} a6 6 0 1 0 2 9 a4.6 4.6 0 1 1 -2 -9z" fill="#f7d77a" stroke-width="1.4"/><circle cx="56" cy="${top-6}" r="1.1" fill="#fff3a8" stroke="none"/><circle cx="68" cy="${top-20}" r=".9" fill="#fff3a8" stroke="none"/>`,
    spectre:[[14,top+16,1],[104,top+8,-1],[100,top+40,1]].map(([x,y,d])=>`<path d="M${x} ${y} q${-5*d} -7 0 -15 q${2*d} 6 ${6*d} 8 q-1 6 ${-6*d} 7Z" fill="#cfe2ff" stroke="#9fb4e0" stroke-width="1.6"/>`).join(""),
    bonnetnuit:`<path d="M36 ${top+11} Q40 ${top-16} 64 ${top-15} Q86 ${top-13} 97 ${top+8} Q82 ${top-2} 82 ${top+11}Z" fill="#b9d4f2"/><path d="M50 ${top-11} Q53 ${top} 52 ${top+10} M66 ${top-14} Q70 ${top-2} 68 ${top+10} M80 ${top-9} Q84 ${top} 82 ${top+9}" fill="none" stroke="#fff" stroke-width="3"/><rect x="34" y="${top+6}" width="50" height="9" rx="4.5" fill="#fffaf3"/><circle cx="98" cy="${top+11}" r="5.6" fill="#fffaf3"/>`,
    beret:`<ellipse cx="53" cy="${top+4}" rx="21" ry="7.5" fill="#4a5a8a" transform="rotate(-14 53 ${top+4})"/><path d="M50 ${top-3} q0 -5 4 -6" fill="none" stroke-width="2.6"/>`,
    collier:[-3,-2,-1,0,1,2,3].map(k=>`<circle cx="${(60+k*w/3.6).toFixed(1)}" cy="${(neck+3-k*k*.45).toFixed(1)}" r="2.6" fill="#fff" stroke-width="1.4"/>`).join("")
  })[f.acc]||""};
  // motifs dessinés par-dessus le visage
  const markOf=(Y,dx=0)=>{if(sil)return "";
    if(f.mark==="liste")return `<g transform="translate(${dx} 0)"><path d="M56.5 ${Y+1} Q55 ${Y-10} 57 ${Y-17} Q60 ${Y-20} 63 ${Y-17} Q65 ${Y-10} 63.5 ${Y+1}Z" fill="${c.ch}" stroke="none"/><g fill="${c.e}" stroke="none" opacity=".7">${[[36,-1],[40.5,-2.6],[38,2.2],[84,-1],[79.5,-2.6],[82,2.2]].map(([x,y])=>`<circle cx="${x}" cy="${Y+y}" r="1.25"/>`).join("")}</g></g>`;
    const {top,bot,hw}=geo,at=(u,v)=>[60+hw*u,top+(bot-top)*v];
    if(f.mark==="pepites")return `<g fill="#6a4026" stroke="none">${[[-.74,.62,2.6],[.72,.6,2.3],[-.5,.84,2],[.56,.86,2.6],[-.86,.84,1.6],[.86,.8,1.8]].map(([u,v,r])=>{const [x,y]=at(u,v);return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r}" ry="${(r*.8).toFixed(1)}"/>`}).join("")}</g>`;
    if(f.mark==="glacage"){const pts=[];for(let i=0;i<=10;i++){const [x,y]=at(-.78+1.56*i/10,.8);pts.push(`${x.toFixed(1)} ${(y+(i%2?2.2:-2.2)).toFixed(1)}`)}
      return `<path d="M${pts.join(" L")}" fill="none" stroke="#fffaf3" stroke-width="2.6"/>`}
    if(f.mark==="neige")return `<path d="M43 ${top+7} Q45 ${top-4} 53 ${top-3} Q57 ${top-10} 65 ${top-5} Q74 ${top-7} 77 ${top+7} Q60 ${top+12} 43 ${top+7}Z" fill="#fff" stroke-width="2.4"/><path d="M50 ${top+2} q3 -2 6 0" fill="none" stroke="#cfe0f2" stroke-width="1.6"/>`;
    if(f.mark==="peinture")return [[-.7,.66,"#ffd84a",3.4],[.74,.78,"#8fca7a",2.8],[-.42,.9,"#7cb8e0",2.4]].map(([u,v,col,r])=>{const [x,y]=at(u,v);return `<path d="M${(x-r).toFixed(1)} ${y.toFixed(1)} q${r*.2} ${-r*1.1} ${r} ${-r} q${r*1.1} ${-r*.1} ${r} ${r} q${-r*.1} ${r*1.1} ${-r} ${r} q${-r*1.1} 0 ${-r} ${-r}Z" fill="${col}" stroke-width="1.4"/>`}).join("")+`<circle cx="${84}" cy="${Y+1}" r="1.8" fill="#7cb8e0" stroke="none"/>`;
    if(f.mark==="taches")return `<g fill="${c.e}" stroke="none" opacity=".75" transform="translate(${dx} 0)">${[[36,-1],[40.5,-2.6],[38,2.2],[84,-1],[79.5,-2.6],[82,2.2]].map(([x,y])=>`<circle cx="${x}" cy="${Y+y}" r="1.25"/>`).join("")}</g>`;
    return ""};
  // la brioche : une seule forme pour la tête et le corps, déformée selon la pose
  let geo={top:35,bot:88,hw:36};
  const bun=(top,bot,hw,dx=0)=>{geo={top,bot,hw};const L=60-hw+dx,R=60+hw+dx,m=60+dx;
    if(gh)return `<path d="M${L} ${bot-4} C${L-6} ${top+25} ${m-30} ${top} ${m} ${top} C${m+30} ${top} ${R+6} ${top+25} ${R} ${bot-4} L${R+2} ${bot+8}`+[5,4,3,2,1,0].map(i=>{const x=L-2+(R-L+4)*i/6,x2=L-2+(R-L+4)*(i+.5)/6;return ` Q${x2.toFixed(1)} ${bot+1} ${x.toFixed(1)} ${bot+(i?7:8)}`}).join("")+`Z" fill="${c.b}"/>`;
    return `<path d="M${L} ${bot} C${L-6} ${top+25} ${m-30} ${top} ${m} ${top} C${m+30} ${top} ${R+6} ${top+25} ${R} ${bot} Q${m} ${bot+7} ${L} ${bot}Z" fill="${c.b}"/>`};
  // oreilles inclinées (a en degrés : négatif = vers l'extérieur, comme des oreilles basses)
  const ears=(dy,a=0,dx=0)=>earPair(`<g transform="translate(${dx} 0) rotate(${-a} 44 ${38+dy})">${ear(dy,true)}</g>`,`<g transform="translate(${dx} 0) rotate(${a} 76 ${38+dy})">${ear(dy,false)}</g>`,[[44+dx,38+dy],[76+dx,38+dy]]);
  // visage : même taille dans toutes les poses ; seuls les yeux et la bouche changent
  const mouthO=Y=>`<ellipse cx="60" cy="${Y+7.4}" rx="1.9" ry="2.3" fill="#e2546e" stroke-width="1.4"/>`;
  const faceOf=(Y,mode,dx=0)=>{
    if(sil)return `<g transform="translate(${dx} 0)"><ellipse cx="60" cy="${Y+6.5}" rx="12.5" ry="7.5" fill="${c.ch}" stroke="none"/></g>`;
    let h;
    if(mode==="open")h=face(Y,false);
    else if(mode==="joy")h=face(Y,true);
    else{
      // yeux fermés (dodo, toilette) ou levés vers le ciel : on garde museau, joues et bouche du visage normal
      const base=face(Y,true).replace(/<path d="M44 [^"]*" fill="none" stroke-width="2.6"\/>/,"");
      const eyes=mode==="shut"?`<path d="M43.5 ${Y} Q48 ${Y+3.6} 52.5 ${Y} M67.5 ${Y} Q72 ${Y+3.6} 76.5 ${Y}" fill="none" stroke-width="2.4"/>`
        :`<g class="eyes" style="transform-origin:60px ${Y}px"><ellipse cx="48" cy="${Y-1.4}" rx="2.9" ry="3.5" fill="${dark}" stroke="none"/><ellipse cx="72" cy="${Y-1.4}" rx="2.9" ry="3.5" fill="${dark}" stroke="none"/><circle cx="48.6" cy="${Y-3}" r="1.05" fill="#fff" stroke="none"/><circle cx="72.6" cy="${Y-3}" r="1.05" fill="#fff" stroke="none"/></g>`;
      h=base+eyes;
      if(mode==="up")h=h.replace(/<path d="M56 [^"]*"[^>]*\/>/,"")+mouthO(Y);
    }
    if(["sad","surprise","shy"].includes(mode)){
      const noMouth=face(Y,true).replace(/<path d="M44 [^"]*" fill="none" stroke-width="2.6"\/>/,"").replace(/<path d="M56 [^"]*"[^>]*\/>/,"");
      const dot=(x,y,rx,ry,hl)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${dark}" stroke="none"/><circle cx="${x+.9}" cy="${y-ry*.4}" r="${hl}" fill="#fff" stroke="none"/>`;
      if(mode==="sad")h=noMouth+dot(48,Y+.6,2.8,3.2,.9)+dot(72,Y+.6,2.8,3.2,.9)
        +`<path d="M42.5 ${Y-6} L51 ${Y-8.6} M77.5 ${Y-6} L69 ${Y-8.6}" fill="none" stroke-width="2"/><path d="M56 ${Y+9} Q60 ${Y+6} 64 ${Y+9}" fill="none" stroke-width="1.8"/><path d="M44 ${Y+5} q-2.6 4 0 5.4 q2.6 -1.4 0 -5.4Z" fill="#9ec3ef" stroke-width="1.2"/>`;
      else if(mode==="surprise")h=noMouth+dot(48,Y-.4,3.6,4.4,1.3)+dot(72,Y-.4,3.6,4.4,1.3)
        +`<path d="M43 ${Y-9} Q48 ${Y-12} 53 ${Y-9} M67 ${Y-9} Q72 ${Y-12} 77 ${Y-9}" fill="none" stroke-width="2"/>`+`<ellipse cx="60" cy="${Y+8}" rx="2.6" ry="3.2" fill="#e2546e" stroke-width="1.6"/>`;
      else h=noMouth+dot(49.3,Y+1.2,2.6,3,.8)+dot(73.3,Y+1.2,2.6,3,.8)
        +`<g stroke="#e2546e" stroke-width="1.4"><path d="M36 ${Y+3} l-2 4 M40 ${Y+3} l-2 4 M44 ${Y+3} l-2 4 M80 ${Y+3} l-2 4 M84 ${Y+3} l-2 4 M88 ${Y+3} l-2 4"/></g><path d="M56 ${Y+7.6} q2 -1.6 4 0 q2 1.6 4 0" fill="none" stroke-width="1.6"/><path d="M90 ${Y-14} q-3 4.6 0 6.4 q3 -1.8 0 -6.4Z" fill="#cfe4f7" stroke-width="1.3"/>`;
    }
    return dx?`<g transform="translate(${dx} 0)">${h}</g>`:h};
  const paws=(y,l=50,r=70,lift=[0,0])=>gh?"":(f.mark==="moufle"&&!sil?`<path d="M${l-8} ${y-lift[0]+3} Q${l-9} ${y-lift[0]-7} ${l-1} ${y-lift[0]-7} Q${l+8} ${y-lift[0]-7} ${l+8} ${y-lift[0]+3}Z" fill="#7cb8e0"/><path d="M${l-8} ${y-lift[0]+3} L${l+8} ${y-lift[0]+3}" stroke="#fff" stroke-width="2.4"/><path d="M${l-4} ${y-lift[0]-3} l2 2 2 -2 2 2 2 -2" fill="none" stroke="#fff" stroke-width="1.2"/>`:`<ellipse cx="${l}" cy="${y-lift[0]}" rx="7" ry="4.4" fill="${c.s}"/>`)+`<ellipse cx="${r}" cy="${y-lift[1]}" rx="7" ry="4.4" fill="${c.s}"/>`;
  // Luciole : le bout de la queue brille un peu
  const glow=(x,y)=>f.mark==="lueur"&&!sil?`<circle cx="${x}" cy="${y}" r="15" fill="#fff6b0" opacity=".7" stroke="none"/><circle cx="${x}" cy="${y}" r="9" fill="#fffbe0" opacity=".9" stroke="none"/>${[[9,-14,1],[-12,-6,.8],[6,12,.7]].map(([dx,dy,k])=>`<path d="M${x+dx} ${y+dy-3*k} l${k} ${2*k} ${2*k} ${k} ${-2*k} ${k} ${-k} ${2*k} ${-k} ${-2*k} ${-2*k} ${-k} ${2*k} ${-k}z" fill="#ffd84a" stroke-width="1"/>`).join("")}`:"";
  const tailG=s=>gh?"":s;
  const tailBack=(rot=0,ox=90,oy=82)=>tailG(`<g class="tail" style="transform-origin:${ox}px ${oy}px"><g transform="rotate(${rot} ${ox} ${oy})"><path d="M86 87 C108 90 118 72 108 57 C102 66 98 72 89 74Z" fill="${c.b}"/><path d="M108 57 C114 64 114 72 110 77 C106 72 102 67 99 63 C101 61 104 59 108 57Z" fill="${c.t}"/>${glow(107,64)}</g></g>`);
  // pour l'épouvantail : pas d'yeux boutons quand les yeux sont fermés
  const closedPose=["happy","sleep","groom","eat"].includes(pose);if(closedPose)o.closed=1;
  // fx : parties animées, dessinées hors du filtre #wobble (sinon il est recalculé à chaque image)
  let body,fx="",T=35,Y=55,N=74,W=30;
  if(pose==="happy"){
    // étirée vers le haut, pattes levées, queue haute
    T=27;Y=49;N=68;W=29;
    body=tailBack(-24)+ears(-8,-4)+bun(T,88,33)+faceOf(Y,"joy")+paws(89);
  }else if(pose==="sleep"||pose==="lie"){
    // la même brioche, aplatie ; oreilles basses ; pour dormir, la queue fait le tour par devant
    T=50;Y=69;N=86;W=34;
    const front=pose==="sleep";
    body=(front?"":tailBack(18,92,86))+ears(14,front?-28:-12)+bun(T,90,41)+faceOf(Y,front?"shut":"open")
      +(front?tailG(glow(31,92)+`<path d="M99 86 C106 98 70 100 30 96 C21 95 20 89 29 88 C60 91 88 90 94 82Z" fill="${c.b}"/><path d="M30 96 C21 95 20 89 29 88 C34 88.5 39 89 43 89.4 C42 93 37 96 30 96Z" fill="${c.t}"/>`):paws(91,44,76));
  }else if(pose==="eat"){
    // penchée vers la gamelle : la tête descend, les oreilles avancent
    T=42;Y=64;N=82;W=31;
    body=tailBack(-10)+ears(7,8)+bun(T,88,37)+faceOf(Y,"joy")+paws(89,47,73);
  }else if(pose==="groom"){
    // toilette : une patte frotte la joue en va-et-vient (pivot au coude), la petite langue sort au même rythme
    body=tailBack(-6)+ears(0,-6)+bun(T,88,36)+faceOf(Y,"shut")+paws(89,62,72);
    if(!gh)fx=`<g class="tongue" style="transform-origin:60px ${Y+7}px"><path d="M56.6 ${Y+7} Q56.4 ${Y+13.4} 60 ${Y+13.4} Q63.6 ${Y+13.4} 63.4 ${Y+7}Z" fill="#f6a5b4" stroke-width="1.6"/><path d="M60 ${Y+8.4} V${Y+11}" stroke="#e2849a" stroke-width="1.1"/></g>`
      +`<g class="lick" style="transform-origin:46px ${Y+22}px"><ellipse cx="39" cy="${Y+12}" rx="6" ry="7.6" fill="${c.s}" transform="rotate(20 39 ${Y+12})"/></g>`;
  }else if(pose==="up"){
    // regarde en l'air (la pluie, une luciole) : visage remonté, oreilles en arrière
    Y=50;N=70;
    body=tailBack(-4)+ears(-2,-10)+bun(T,88,36)+faceOf(Y,"up")+paws(89);
  }else if(pose==="walk"){
    // trottine en rebondissant : deux images, une patte levée à tour de rôle, la brioche penche un peu
    const k=o.frame?1:-1;T=36;
    body=`<g transform="rotate(${2.5*k} 60 88)">`+tailBack(8*k)+ears(0,-3)+bun(T,88,35)+faceOf(Y,"open")+paws(89,50,70,o.frame?[0,4]:[4,0])+`</g>`;
  }else{
    const ex=o.expr||"open";
    body=tailBack(ex==="surprise"?-14:0)+ears(ex==="surprise"?-3:0,ex==="sad"?-26:ex==="shy"?-12:0)+bun(T,88,36)+faceOf(Y,ex==="joy"||ex==="open"?ex:ex)+paws(89);
  }
  body+=markOf(Y)+acc(T,Y,N,W);
  const fxG=fx?`<g stroke="${st}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${fx}</g>`:"";
  const zz=pose==="sleep"?`<text class="zz" x="70" y="42" font-family="Mochiy Pop One,sans-serif" font-size="12" fill="${INK}">z</text><text class="zz" style="animation-delay:1.2s" x="80" y="32" font-family="Mochiy Pop One,sans-serif" font-size="9" fill="${INK}">z</text>`:"";
  if(o.portrait)return `<svg viewBox="8 -8 104 104" class="${o.cls||""}" aria-hidden="true"><g transform="translate(${60-60*sc} ${92-92*sc}) scale(${sc})"><g stroke="${st}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#wobble)">${body}</g>${fxG}</g></svg>`;
  return `<svg viewBox="0 -16 120 116" class="${o.cls||""}${gh?" ghosty":""}" aria-hidden="true"><g transform="translate(${60-60*sc} ${92-92*sc}) scale(${sc})"${gh?' opacity=".82"':""}>
  <ellipse cx="60" cy="${gh?99:92}" rx="${gh?26:40}" ry="${gh?3.5:5}" fill="#3d2a35" opacity="${gh?.09:.14}"/>
  <g stroke="${st}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#wobble)">${body}</g>${fxG}${zz}</g></svg>`;
}
