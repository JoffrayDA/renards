/* Café Frimousse : les portes des saisons sur la carte (11/11/2026, Joffray : « une belle porte en fonction de la saison
   dans laquelle on rentre »). Une arche par saison, au pied du jour 1 pour l'Automne, entre deux saisons pour les autres.
   Fermée : deux battants de bois avec le cadenas et le nombre d'étoiles ; ouverte : battants rangés, le nom de la saison.
   Planche : tools/portes.html. Dessin en (x, y) = milieu du pied de l'arche. */
const PG_K=`stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const PG_k=`stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
const PG_STY={
  automne:{post:"#b77a4e",cap:"#8a5a3a",door:"#e2a46c",plank:"#c0804f",trim:"#d9622e"},
  hiver:{post:"#e9f2fb",cap:"#ffffff",door:"#cfe2f3",plank:"#a9c6e2",trim:"#7fb0dc"},
  printemps:{post:"#f3d7c4",cap:"#fff4ea",door:"#f6c6d2",plank:"#e9a5b8",trim:"#9fd18a"},
  ete:{post:"#f2c766",cap:"#ffe39a",door:"#f7d98c",plank:"#e6b452",trim:"#f08a5d"}};
// petites pièces de décor
const pgLeaf=(x,y,r,col)=>`<path d="M0 -7 Q6 -3 5 3 Q0 7 -5 3 Q-6 -3 0 -7Z" transform="translate(${x} ${y}) rotate(${r})" fill="${col}" ${PG_k}/>`;
const pgPumpkin=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-8" rx="13" ry="9.5" fill="#f08a3c" ${PG_K}/><path d="M-5 -16 Q-7 -8 -5 -0.5 M5 -16 Q7 -8 5 -0.5" fill="none" stroke="#c9642a" stroke-width="2"/><path d="M0 -17 q1 -6 5 -7" fill="none" stroke="#6f9a50" stroke-width="3" stroke-linecap="round"/></g>`;
const pgAcorn=(x,y)=>`<g transform="translate(${x} ${y})"><ellipse cx="0" cy="-5" rx="4.6" ry="5.6" fill="#d39a5e" ${PG_k}/><path d="M-5.4 -7 Q0 -13 5.4 -7Z" fill="#8a5a3a" ${PG_k}/></g>`;
const pgFlower=(x,y,col,r=4)=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<circle cx="${(r*.9*Math.cos(a*Math.PI/180)).toFixed(1)}" cy="${(r*.9*Math.sin(a*Math.PI/180)).toFixed(1)}" r="${r*.7}" fill="${col}" stroke="${INK}" stroke-width="1.3"/>`).join("")}<circle r="${r*.45}" fill="#ffd34d" stroke="${INK}" stroke-width="1.1"/></g>`;
const pgDaisy=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">${Array.from({length:10},(_,i)=>`<ellipse cx="0" cy="-3.6" rx="1.6" ry="3.4" fill="#fffdf6" stroke="${INK}" stroke-width="1" transform="rotate(${i*36})"/>`).join("")}<circle r="2.2" fill="#ffd34d" stroke="${INK}" stroke-width="1"/></g>`;
const pgSun=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">${Array.from({length:12},(_,i)=>`<ellipse cx="0" cy="-9" rx="3" ry="6" fill="#ffd34d" stroke="${INK}" stroke-width="1.4" transform="rotate(${i*30})"/>`).join("")}<circle r="6.5" fill="#8a5a3a" stroke="${INK}" stroke-width="1.6"/><circle cx="-2" cy="-2" r="1.4" fill="#b98258"/></g>`;
const pgSnowCap=(x,y,w)=>`<path d="M${x-w/2-2} ${y+2} Q${x-w/2} ${y-7} ${x} ${y-8} Q${x+w/2} ${y-7} ${x+w/2+2} ${y+2} Q${x+w/4} ${y+6} ${x} ${y+3} Q${x-w/4} ${y+6} ${x-w/2-2} ${y+2}Z" fill="#fff" ${PG_k}/>`;
function seasonGateSVG(x,y,open,sea,label){
  const P=PG_STY[sea]||PG_STY.automne,sh=`<ellipse cx="${x}" cy="${y+6}" rx="56" ry="15" fill="rgba(91,66,80,.13)"/>`;
  let back="",front="";
  // les battants : fermés au milieu, ouverts rabattus contre les poteaux
  const doors=open?[-1,1].map(sd=>`<path d="M${x+sd*32} ${y-46} L${x+sd*46} ${y-40} L${x+sd*46} ${y+4} L${x+sd*32} ${y+4}Z" fill="${P.door}" ${PG_K}/><path d="M${x+sd*39} ${y-42} V${y+2}" stroke="${P.plank}" stroke-width="2"/>`).join("")
    :[-1,1].map(sd=>`<rect x="${sd<0?x-32:x}" y="${y-44}" width="32" height="48" rx="3" fill="${P.door}" ${PG_K}/>`+[8,16,24].map(o=>`<path d="M${sd<0?x-32+o:x+o} ${y-42} V${y+2}" stroke="${P.plank}" stroke-width="2"/>`).join("")+`<path d="M${sd<0?x-30:x+2} ${y-20} h28" stroke="${P.plank}" stroke-width="3"/>`).join("")
      +`<circle cx="${x}" cy="${y-18}" r="9" fill="#f2c75c" ${PG_K}/><path d="M${x-4} ${y-24} v-4 a4 4 0 0 1 8 0 v4" fill="none" stroke="${INK}" stroke-width="2.4"/><circle cx="${x}" cy="${y-17}" r="1.8" fill="${INK}"/>`;
  // poteaux et arche
  const posts=[-1,1].map(sd=>`<rect x="${x+sd*38-7}" y="${y-60}" width="14" height="66" rx="4" fill="${P.post}" ${PG_K}/><circle cx="${x+sd*38}" cy="${y-62}" r="8" fill="${P.cap}" ${PG_K}/>`).join("");
  const arc=`<path d="M${x-38} ${y-56} Q${x} ${y-86} ${x+38} ${y-56}" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M${x-38} ${y-56} Q${x} ${y-86} ${x+38} ${y-56}" fill="none" stroke="${P.post}" stroke-width="9" stroke-linecap="round"/>`;
  // n points le long du haut de l'arche (courbe de (x-38, y-56) à (x+38, y-56) qui monte à y-71 au milieu)
  const along=(n,f,dy=0)=>Array.from({length:n},(_,i)=>{const t=(i+.5)/n,[ax,ay]=[x-38+76*t,y-56-60*t*(1-t)+dy];return f(ax,ay,i)}).join("");
  if(sea==="automne"){
    // guirlande de feuilles rousses, glands, citrouilles au pied, feuilles tombées
    front=along(11,(ax,ay,i)=>pgLeaf(ax+(i%2?2:-2),ay+(i%2?4:-3),i*47,["#e8743b","#f2b33d","#c9452f","#e89a3c"][i%4]))
      +pgAcorn(x-14,y-72)+pgAcorn(x+16,y-71)
      +pgPumpkin(x-52,y+8,1)+pgPumpkin(x+54,y+9,.82)+pgPumpkin(x+40,y+12,.6)
      +[[-62,-4,20,"#e8743b"],[64,-6,-30,"#c9452f"],[-30,12,60,"#f2b33d"],[24,14,-10,"#e89a3c"]].map(([dx,dy,r,c])=>pgLeaf(x+dx,y+dy,r,c)).join("");
  }else if(sea==="hiver"){
    // arche enneigée, glaçons, branche de sapin et baies de houx, petit bonhomme de neige
    front=`<path d="M${x-44} ${y-58} Q${x} ${y-96} ${x+44} ${y-58} Q${x+30} ${y-66} ${x} ${y-74} Q${x-30} ${y-66} ${x-44} ${y-58}Z" fill="#fff" ${PG_k}/>`
      +along(7,(ax,ay,i)=>`<path d="M${ax-2.4} ${ay+5} L${ax} ${ay+12+(i%3)*3} L${ax+2.4} ${ay+5}Z" fill="#dff0ff" ${PG_k}/>`,1)
      +[-1,1].map(sd=>pgSnowCap(x+sd*38,y-68,18)).join("")
      +along(9,(ax,ay,i)=>`<path d="M${ax} ${ay-2} l-6 -3 M${ax} ${ay-2} l6 -3" stroke="#5f9a6a" stroke-width="3" stroke-linecap="round"/>`,-6)
      +`<circle cx="${x-4}" cy="${y-80}" r="3.2" fill="#d9363e" ${PG_k}/><circle cx="${x+3}" cy="${y-81}" r="3.2" fill="#d9363e" ${PG_k}/>`
      +`<g transform="translate(${x+56} ${y+8})"><circle cy="-10" r="11" fill="#fff" ${PG_K}/><circle cy="-27" r="8" fill="#fff" ${PG_K}/><path d="M-1 -27 l7 2 l-7 2Z" fill="#f08a3c" stroke="none"/><circle cx="-3" cy="-29" r="1.3" fill="${INK}"/><circle cx="2" cy="-30" r="1.3" fill="${INK}"/><path d="M-8 -21 q8 4 16 0" fill="none" stroke="#d9363e" stroke-width="4" stroke-linecap="round"/></g>`
      +`<ellipse cx="${x-52}" cy="${y+8}" rx="14" ry="5" fill="#fff" ${PG_k}/>`;
  }else if(sea==="printemps"){
    // branches de cerisier en fleurs, pâquerettes au pied, papillon
    front=along(13,(ax,ay,i)=>pgFlower(ax+(i%2?3:-3),ay+(i%2?3:-3),["#f9c4d4","#fbd9e3","#f6a8c0"][i%3],i%3?4:5))
      +[[-60,4],[-48,10],[-66,12],[52,6],[62,12],[46,13],[-24,12],[28,14]].map(([dx,dy],i)=>pgDaisy(x+dx,y+dy,i%2?.8:1)).join("")
      +`<g transform="translate(${x+50} ${y-90})"><path d="M0 0 Q-9 -9 -10 0 Q-8 6 0 1Z M0 0 Q9 -9 10 0 Q8 6 0 1Z" fill="#c9b6ef" ${PG_k}/><path d="M0 -4 V4" stroke="${INK}" stroke-width="2"/></g>`
      +[-1,1].map(sd=>`<path d="M${x+sd*38} ${y+4} q${sd*-6} -14 ${sd*-2} -28" fill="none" stroke="#7dbb68" stroke-width="2.6"/>`+pgLeaf(x+sd*36,y-14,sd*40,"#9fd18a")).join("");
  }else{
    // été : grand soleil au sommet, tournesols au pied, fanions colorés
    front=`<path d="M${x-38} ${y-52} Q${x} ${y-74} ${x+38} ${y-52}" fill="none" stroke="${INK}" stroke-width="1.6"/>`
      +along(8,(ax,ay,i)=>`<path d="M${ax-4.5} ${ay+3} L${ax+4.5} ${ay+3} L${ax} ${ay+12}Z" fill="${["#f08a5d","#7cc6e8","#f7d77a","#9fd18a"][i%4]}" ${PG_k}/>`,4)
      +`<g transform="translate(${x} ${y-88})">${Array.from({length:10},(_,i)=>`<path d="M0 -15 L3 -9 L-3 -9Z" fill="#ffd34d" ${PG_k} transform="rotate(${i*36})"/>`).join("")}<circle r="10" fill="#ffd34d" ${PG_K}/><path d="M-4 -1 q1 -2 2 0 M2 -1 q1 -2 2 0" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M-3 3 q3 3 6 0" fill="none" stroke="${INK}" stroke-width="1.6"/></g>`
      +[[-56,0,1],[-46,8,.8],[54,2,.95],[64,10,.75]].map(([dx,dy,s])=>`<path d="M${x+dx} ${y+dy+14} V${y+dy-4}" stroke="#6fae5e" stroke-width="3"/>`+pgLeaf(x+dx+5,y+dy+6,60,"#9fd18a")+pgSun(x+dx,y+dy-8,s*.85)).join("");
  }
  const by=sea==="ete"?138:sea==="hiver"?120:112;
  const board=`<rect x="${x-46}" y="${y-by}" width="92" height="26" rx="10" fill="#fffaf2" ${PG_K}/><text x="${x}" y="${y-by+18}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="13" fill="${INK}">${label}</text>`;
  return sh+back+doors+posts+arc+front+board;
}
