/* Kitsune Café : la carte des journées et sa déco. */
/* ---------- carte ---------- */
// Coordonnées en unités de carte : 400 de large, u compté depuis le bas (le jour 1 est en bas, on monte comme sur un chemin).
const MW=400;
function rng(a){return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const blob=(cs,fill)=>cs.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}" stroke="${INK}" stroke-width="6"/>`).join("")+cs.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join("");
const shadow=(x,y,rx)=>`<ellipse cx="${x}" cy="${y+2}" rx="${rx}" ry="${rx*.28}" fill="rgba(91,66,80,.13)"/>`;
const tree=(x,y,k,cols,dots)=>shadow(x,y,22*k)+`<rect x="${x-5*k}" y="${y-26*k}" width="${10*k}" height="${28*k}" rx="${3*k}" fill="#b07a5a" ${BO}/>`+blob([[x-14*k,y-30*k,14*k],[x+14*k,y-30*k,14*k],[x,y-44*k,18*k]],cols[0])+`<circle cx="${x-7*k}" cy="${y-49*k}" r="${5*k}" fill="#fff" opacity=".45"/>`+(dots?[[-12,-28],[8,-40],[14,-24],[-4,-38]].map(([a,b])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r="${2.6*k}" fill="${dots}"/>`).join(""):"");
// petits dessins réutilisés par la déco : chaque saison a plusieurs arbres et plusieurs fleurs pour varier la carte
const stem=(x,y,h,k)=>`<path d="M${x} ${y} V${y-h*k}" stroke="#6fae5e" stroke-width="${2.6*k}" stroke-linecap="round"/>`;
const daisy=(x,y,k,pet,mid)=>Array.from({length:6},(_,i)=>{const a=i/6*Math.PI*2;return `<circle cx="${x+Math.cos(a)*4.4*k}" cy="${y+Math.sin(a)*4.4*k}" r="${3.4*k}" fill="${pet}" stroke="${INK}" stroke-width="1.5"/>`}).join("")+`<circle cx="${x}" cy="${y}" r="${3*k}" fill="${mid}" stroke="${INK}" stroke-width="1.5"/>`;
const daisies=(x,y,k,pet,mid)=>shadow(x,y,16*k)+[[-9,16],[2,24],[11,13]].map(([a,h])=>stem(x+a*k,y,h,k)).join("")+`<path d="M${x-2*k} ${y-6*k} q${-8*k} ${-4*k} ${-10*k} ${-10*k} q${7*k} 0 ${10*k} ${6*k}Z" fill="#8fca7a" stroke="${INK}" stroke-width="1.6"/>`+[[-9,16],[2,24],[11,13]].map(([a,h],i)=>daisy(x+a*k,y-h*k,k*(i==1?1.1:.9),pet,mid)).join("");
const birch=(x,y,k,crown,dots)=>shadow(x,y,18*k)+`<rect x="${x-4*k}" y="${y-34*k}" width="${8*k}" height="${36*k}" rx="${3*k}" fill="#fffaf2" ${BO}/><path d="M${x-4*k} ${y-12*k} h${4*k} M${x} ${y-22*k} h${4*k} M${x-4*k} ${y-28*k} h${3*k}" stroke="${INK}" stroke-width="2.2"/>`+blob([[x-9*k,y-40*k,11*k],[x+9*k,y-42*k,10*k],[x,y-52*k,12*k]],crown)+`<circle cx="${x-5*k}" cy="${y-56*k}" r="${3.6*k}" fill="#fff" opacity=".45"/>`+(dots?[[-10,-40],[6,-50],[11,-38]].map(([a,b])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r="${2.4*k}" fill="${dots}"/>`).join(""):"");
const poplar=(x,y,k,col,dots)=>shadow(x,y,14*k)+`<rect x="${x-3.5*k}" y="${y-14*k}" width="${7*k}" height="${16*k}" rx="${2*k}" fill="#b07a5a" ${BO}/><ellipse cx="${x}" cy="${y-38*k}" rx="${13*k}" ry="${27*k}" fill="${col}" ${BO}/><path d="M${x-5*k} ${y-54*k} q${-4*k} ${10*k} ${-3*k} ${22*k}" fill="none" stroke="#fff" stroke-width="${3*k}" stroke-linecap="round" opacity=".45"/>`+(dots?[[4,-48],[-6,-34],[6,-24]].map(([a,b])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r="${2.3*k}" fill="${dots}"/>`).join(""):"");
const pine=(x,y,k,col,snow)=>shadow(x,y,18*k)+`<rect x="${x-4*k}" y="${y-10*k}" width="${8*k}" height="${12*k}" fill="#a8785a" ${BO}/>`+[[20,-8],[16,-22],[11,-35]].map(([w,b])=>`<path d="M${x-w*k} ${y+b*k} L${x} ${y+(b-20)*k} L${x+w*k} ${y+b*k}Z" fill="${col}" ${BO}/>`+(snow?`<path d="M${x-w*.5*k} ${y+(b-10)*k} L${x} ${y+(b-20)*k} L${x+w*.5*k} ${y+(b-10)*k} Q${x} ${y+(b-6)*k} ${x-w*.5*k} ${y+(b-10)*k}Z" fill="#fff" stroke="${INK}" stroke-width="2"/>`:"")).join("");
const bush=(x,y,k,col,berry,snow)=>shadow(x,y,20*k)+blob([[x-11*k,y-9*k,10*k],[x+11*k,y-9*k,10*k],[x,y-15*k,12*k]],col)+(snow?`<path d="M${x-16*k} ${y-18*k} Q${x-8*k} ${y-30*k} ${x} ${y-27*k} Q${x+10*k} ${y-30*k} ${x+17*k} ${y-17*k} Q${x} ${y-21*k} ${x-16*k} ${y-18*k}Z" fill="#fff" stroke="${INK}" stroke-width="2"/>`:"")+[[-11,-8],[-3,-14],[5,-7],[12,-12],[0,-4]].map(([a,b])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r="${2.8*k}" fill="${berry}" stroke="${INK}" stroke-width="1.4"/>`).join("");
const bells=(x,y,k,col)=>shadow(x,y,12*k)+[[-6,1],[6,-1]].map(([a,d])=>`<path d="M${x+a*k} ${y} Q${x+a*k} ${y-26*k} ${x+(a+d*12)*k} ${y-26*k}" fill="none" stroke="#6fae5e" stroke-width="${2.4*k}" stroke-linecap="round"/>`+[.25,.6,.95].map(t=>{const bx=x+(a+d*12*t)*k,by=y-(20+6*t)*k+5*k;return `<path d="M${bx-3.4*k} ${by} Q${bx-3.4*k} ${by-7*k} ${bx} ${by-7*k} Q${bx+3.4*k} ${by-7*k} ${bx+3.4*k} ${by} L${bx+1.7*k} ${by-1.4*k} L${bx} ${by+.6*k} L${bx-1.7*k} ${by-1.4*k}Z" fill="${col}" stroke="${INK}" stroke-width="1.4"/>`}).join("")).join("")+`<path d="M${x} ${y} q${-12*k} ${-6*k} ${-12*k} ${-18*k} q${8*k} ${6*k} ${12*k} ${18*k}Z" fill="#8fca7a" stroke="${INK}" stroke-width="1.6"/>`;
const lavender=(x,y,k)=>shadow(x,y,14*k)+[-10,-4,2,8,13].map((a,i)=>{const h=[22,30,26,32,20][i];return stem(x+a*k,y,h,k)+[0,1,2,3].map(j=>`<ellipse cx="${x+a*k}" cy="${y-(h-j*4.4)*k}" rx="${2.8*k}" ry="${2.6*k}" fill="${j%2?"#b9a1e8":"#c9b8f2"}" stroke="${INK}" stroke-width="1.2"/>`).join("")}).join("");
const rock=(x,y,k,top,dots)=>shadow(x,y,20*k)+`<path d="M${x-20*k} ${y} Q${x-22*k} ${y-16*k} ${x-6*k} ${y-20*k} Q${x+12*k} ${y-24*k} ${x+19*k} ${y-8*k} Q${x+21*k} ${y} ${x+14*k} ${y}Z" fill="#d6d0dc" ${BO}/><path d="M${x-17*k} ${y-12*k} Q${x-12*k} ${y-22*k} ${x-2*k} ${y-21*k} Q${x+12*k} ${y-24*k} ${x+17*k} ${y-12*k} Q${x+4*k} ${y-16*k} ${x-17*k} ${y-12*k}Z" fill="${top}" stroke="${INK}" stroke-width="2"/>`+(dots?[[-8,-20],[3,-22],[11,-17]].map(([a,b])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r="${2.6*k}" fill="${dots}" stroke="${INK}" stroke-width="1.3"/>`).join(""):"");
const stump=(x,y,k)=>shadow(x,y,17*k)+`<path d="M${x-13*k} ${y-16*k} V${y-2*k} Q${x} ${y+4*k} ${x+13*k} ${y-2*k} V${y-16*k}Z" fill="#b07a5a" ${BO}/><ellipse cx="${x}" cy="${y-16*k}" rx="${13*k}" ry="${5*k}" fill="#f2d2a6" ${BO}/><ellipse cx="${x}" cy="${y-16*k}" rx="${6*k}" ry="${2.2*k}" fill="none" stroke="#c8946a" stroke-width="1.6"/><path d="M${x+15*k} ${y} V${y-8*k}" stroke="#fff5e8" stroke-width="${4*k}" stroke-linecap="round"/><path d="M${x+8*k} ${y-7*k} Q${x+15*k} ${y-19*k} ${x+22*k} ${y-7*k}Z" fill="#e8655a" stroke="${INK}" stroke-width="1.8"/><circle cx="${x+13*k}" cy="${y-11*k}" r="${1.6*k}" fill="#fff"/>`;
const pumpkins=(x,y,k)=>shadow(x,y,20*k)+[[-8,1,"#f2a35c"],[9,.75,"#f7c85c"]].map(([a,s,c])=>{const cx=x+a*k,r=12*s*k;return `<ellipse cx="${cx}" cy="${y-r*.8}" rx="${r*1.15}" ry="${r*.85}" fill="${c}" ${BO}/><path d="M${cx-r*.4} ${y-r*1.5} Q${cx-r*.55} ${y-r*.8} ${cx-r*.4} ${y-r*.1} M${cx+r*.4} ${y-r*1.5} Q${cx+r*.55} ${y-r*.8} ${cx+r*.4} ${y-r*.1}" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".5"/><path d="M${cx} ${y-r*1.6} q${1*k} ${-5*k} ${4*k} ${-6*k}" fill="none" stroke="#6fae5e" stroke-width="${3*k}" stroke-linecap="round"/>`}).join("");
const bareTree=(x,y,k)=>{const br=`M${x-5*k} ${y} L${x-3*k} ${y-30*k} L${x-14*k} ${y-46*k} M${x-3*k} ${y-30*k} L${x+2*k} ${y-50*k} M${x+3*k} ${y-24*k} L${x+15*k} ${y-40*k} M${x+5*k} ${y} L${x+3*k} ${y-24*k}`;return shadow(x,y,18*k)+`<path d="${br}" fill="none" stroke="${INK}" stroke-width="${9*k}" stroke-linecap="round" stroke-linejoin="round"/><path d="${br} M${x} ${y-2*k} V${y-26*k}" fill="none" stroke="#a8785a" stroke-width="${5*k}" stroke-linecap="round" stroke-linejoin="round"/>`+[[-14,-47,6],[2,-51,6],[15,-41,5.4],[-4,-32,4.6]].map(([a,b,r])=>`<ellipse cx="${x+a*k}" cy="${y+b*k}" rx="${r*k}" ry="${r*.6*k}" fill="#fff" stroke="${INK}" stroke-width="1.8"/>`).join("")};
const pond=(x,y,k,water,ice)=>`<ellipse cx="${x}" cy="${y-6*k}" rx="${30*k}" ry="${13*k}" fill="${water}" ${BO}/><ellipse cx="${x-6*k}" cy="${y-9*k}" rx="${12*k}" ry="${4*k}" fill="#fff" opacity=".6"/>`+(ice?`<path d="M${x+6*k} ${y-12*k} l${5*k} ${4*k} l${6*k} ${-2*k} M${x-14*k} ${y-3*k} l${6*k} ${-3*k}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`:"");
const jack=(x,y,k)=>shadow(x,y,18*k)+`<circle cx="${x}" cy="${y-14*k}" r="${22*k}" fill="#ffb84a" opacity=".35" filter="url(#soft)"/><ellipse cx="${x}" cy="${y-13*k}" rx="${18*k}" ry="${14*k}" fill="#f2a35c" ${BO}/><path d="M${x-7*k} ${y-26*k} Q${x-11*k} ${y-13*k} ${x-7*k} ${y} M${x+7*k} ${y-26*k} Q${x+11*k} ${y-13*k} ${x+7*k} ${y}" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".45"/><path d="M${x} ${y-27*k} q${1*k} ${-6*k} ${6*k} ${-7*k}" fill="none" stroke="#6fae5e" stroke-width="${3.6*k}" stroke-linecap="round"/><path d="M${x-10*k} ${y-14*k} l${3.5*k} ${-6*k} l${3.5*k} ${6*k}Z M${x+3*k} ${y-14*k} l${3.5*k} ${-6*k} l${3.5*k} ${6*k}Z M${x-9*k} ${y-8*k} Q${x} ${y-1*k} ${x+9*k} ${y-8*k} l${-3*k} ${2.4*k} l${-3*k} ${-2*k} l${-3*k} ${2.4*k} l${-3*k} ${-2.4*k}Z" fill="#ffe27a" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;
const ghostie=(x,y,k)=>`<ellipse cx="${x}" cy="${y+2}" rx="${12*k}" ry="${3*k}" fill="rgba(91,66,80,.1)"/><g><animateTransform attributeName="transform" type="translate" values="0 0;0 ${-5*k};0 0" dur="2.6s" repeatCount="indefinite"/><path d="M${x-12*k} ${y-6*k} V${y-22*k} Q${x-12*k} ${y-38*k} ${x} ${y-38*k} Q${x+12*k} ${y-38*k} ${x+12*k} ${y-22*k} V${y-6*k} l${-4*k} ${-3*k} l${-4*k} ${3*k} l${-4*k} ${-3*k} l${-4*k} ${3*k} l${-4*k} ${-3*k}Z" fill="#fff" ${BO}/><ellipse cx="${x-4*k}" cy="${y-24*k}" rx="${1.8*k}" ry="${2.4*k}" fill="${INK}"/><ellipse cx="${x+4*k}" cy="${y-24*k}" rx="${1.8*k}" ry="${2.4*k}" fill="${INK}"/><ellipse cx="${x-8*k}" cy="${y-19*k}" rx="${2.2*k}" ry="${1.4*k}" fill="#f6a5b4"/><ellipse cx="${x+8*k}" cy="${y-19*k}" rx="${2.2*k}" ry="${1.4*k}" fill="#f6a5b4"/></g>`;
const DECO={
  printemps:[
    (x,y,k)=>tree(x,y,k,["#f9c4d2"],"#fff"),
    (x,y,k)=>shadow(x,y,18*k)+[[-10,"#f6a5b4"],[0,"#f7d77a"],[10,"#c9b8f2"]].map(([a,c])=>`<path d="M${x+a*k} ${y} V${y-18*k}" stroke="#6fae5e" stroke-width="${3*k}"/><path d="M${x+a*k-6*k} ${y-26*k} L${x+a*k-6*k} ${y-16*k} Q${x+a*k} ${y-11*k} ${x+a*k+6*k} ${y-16*k} L${x+a*k+6*k} ${y-26*k} L${x+a*k+3*k} ${y-22*k} L${x+a*k} ${y-27*k} L${x+a*k-3*k} ${y-22*k}Z" fill="${c}" ${BO}/>`).join(""),
    (x,y,k)=>shadow(x,y,20*k)+blob([[x-11*k,y-10*k,11*k],[x+11*k,y-10*k,11*k],[x,y-18*k,13*k]],"#a8d39a")+[[-10,-12],[6,-20],[12,-8]].map(([a,b])=>`<circle cx="${x+a*k}" cy="${y+b*k}" r="${3*k}" fill="#f6a5b4" stroke="${INK}" stroke-width="1.5"/>`).join(""),
    (x,y,k)=>birch(x,y,k,"#f9c4d2","#fff"),
    (x,y,k)=>daisies(x,y,k,"#fff","#f7d77a"),
    (x,y,k)=>bells(x,y,k,"#9ec3ef"),
    (x,y,k)=>poplar(x,y,k,"#a9d68f","#f6a5b4"),
    (x,y,k)=>rock(x,y,k,"#a9d68f","#f7d77a"),
    (x,y,k)=>tree(x,y,k,["#fff0f4"],"#f6a5b4")
  ],
  ete:[
    (x,y,k)=>tree(x,y,k,["#8fca7a"],"#e2708e"),
    (x,y,k)=>shadow(x,y,10*k)+`<path d="M${x} ${y} V${y-30*k}" stroke="#6fae5e" stroke-width="${3.4*k}"/><path d="M${x} ${y-12*k} q${9*k} ${-8*k} ${12*k} ${-2*k} q${-6*k} ${6*k} ${-12*k} ${2*k}Z" fill="#8fca7a" stroke="${INK}" stroke-width="2"/>`+Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2;return `<ellipse cx="${x+Math.cos(a)*10*k}" cy="${y-38*k+Math.sin(a)*10*k}" rx="${6*k}" ry="${3.6*k}" transform="rotate(${a*57.3} ${x+Math.cos(a)*10*k} ${y-38*k+Math.sin(a)*10*k})" fill="#f7d04e" stroke="${INK}" stroke-width="1.8"/>`}).join("")+`<circle cx="${x}" cy="${y-38*k}" r="${7*k}" fill="#a8785a" ${BO}/>`,
    (x,y,k)=>`<ellipse cx="${x}" cy="${y-6*k}" rx="${30*k}" ry="${13*k}" fill="#a9d8ef" ${BO}/><ellipse cx="${x-6*k}" cy="${y-9*k}" rx="${12*k}" ry="${4*k}" fill="#fff" opacity=".5"/><path d="M${x+8*k} ${y-4*k} a${7*k} ${4*k} 0 1 1 ${8*k} ${-4*k} l${-6*k} ${2*k}Z" fill="#8fca7a" stroke="${INK}" stroke-width="2"/><circle cx="${x+15*k}" cy="${y-9*k}" r="${2.6*k}" fill="#f6a5b4"/>`,
    (x,y,k)=>tree(x,y,k,["#8fca7a"],"#e8655a"),
    (x,y,k)=>pine(x,y,k,"#6fae5e"),
    (x,y,k)=>lavender(x,y,k),
    (x,y,k)=>daisies(x,y,k,"#f6a5b4","#fff3a8"),
    (x,y,k)=>bush(x,y,k,"#8fca7a","#e8655a"),
    (x,y,k)=>poplar(x,y,k,"#6fae5e")
  ],
  automne:[
    (x,y,k)=>tree(x,y,k,["#f2a35c"],"#e8835a"),
    (x,y,k)=>shadow(x,y,13*k)+`<path d="M${x-6*k} ${y} L${x-5*k} ${y-14*k} H${x+5*k} L${x+6*k} ${y}Z" fill="#fff5e8" ${BO}/><path d="M${x-17*k} ${y-13*k} Q${x} ${y-36*k} ${x+17*k} ${y-13*k}Z" fill="#e8655a" ${BO}/><circle cx="${x-6*k}" cy="${y-20*k}" r="${3*k}" fill="#fff"/><circle cx="${x+6*k}" cy="${y-24*k}" r="${2.4*k}" fill="#fff"/><circle cx="${x+9*k}" cy="${y-16*k}" r="${2*k}" fill="#fff"/>`,
    (x,y,k)=>shadow(x,y,18*k)+`<path d="M${x} ${y-22*k} q${-2*k} ${-6*k} ${3*k} ${-9*k}" fill="none" stroke="#6fae5e" stroke-width="${3*k}" stroke-linecap="round"/>`+blob([[x-9*k,y-10*k,10*k],[x+9*k,y-10*k,10*k],[x,y-11*k,11*k]],"#f2a35c")+`<path d="M${x} ${y-21*k} V${y-1*k} M${x-9*k} ${y-19*k} Q${x-13*k} ${y-10*k} ${x-8*k} ${y-1*k} M${x+9*k} ${y-19*k} Q${x+13*k} ${y-10*k} ${x+8*k} ${y-1*k}" fill="none" stroke="#d6803e" stroke-width="2"/>`,
    (x,y,k)=>poplar(x,y,k,"#f7c85c"),
    (x,y,k)=>birch(x,y,k,"#e8835a","#f7c85c"),
    (x,y,k)=>pine(x,y,k,"#6fa58a"),
    (x,y,k)=>pumpkins(x,y,k),
    (x,y,k)=>stump(x,y,k),
    (x,y,k)=>tree(x,y,k,["#d9603f"],"#f7c85c")
  ],
  hiver:[
    (x,y,k)=>shadow(x,y,18*k)+`<rect x="${x-4*k}" y="${y-10*k}" width="${8*k}" height="${12*k}" fill="#a8785a" ${BO}/>`+[[0,22,-8],[0,18,-24],[0,13,-38]].map(([a,w,b])=>`<path d="M${x-w*k} ${y+b*k} L${x} ${y+(b-22)*k} L${x+w*k} ${y+b*k}Z" fill="#6fa58a" ${BO}/><path d="M${x-w*.55*k} ${y+(b-10)*k} L${x} ${y+(b-22)*k} L${x+w*.55*k} ${y+(b-10)*k} Q${x} ${y+(b-6)*k} ${x-w*.55*k} ${y+(b-10)*k}Z" fill="#fff" stroke="${INK}" stroke-width="2"/>`).join(""),
    (x,y,k)=>shadow(x,y,16*k)+blob([[x,y-13*k,14*k]],"#fff")+blob([[x,y-34*k,10*k]],"#fff")+`<circle cx="${x-3.5*k}" cy="${y-36*k}" r="${1.8*k}" fill="${INK}"/><circle cx="${x+3.5*k}" cy="${y-36*k}" r="${1.8*k}" fill="${INK}"/><path d="M${x-1*k} ${y-32*k} l${4*k} ${1.5*k} l${-4*k} ${1.5*k}Z" fill="#f2a35c"/><path d="M${x-10*k} ${y-26*k} Q${x} ${y-21*k} ${x+10*k} ${y-26*k} L${x+12*k} ${y-14*k} L${x+6*k} ${y-14*k} L${x+5*k} ${y-23*k} Q${x} ${y-21*k} ${x-10*k} ${y-23*k}Z" fill="#f59a8b" stroke="${INK}" stroke-width="2"/><circle cx="${x+9*k}" cy="${y-36*k}" r="${2.4*k}" fill="#f6a5b4" opacity=".7"/>`,
    (x,y,k)=>blob([[x-12*k,y-6*k,10*k],[x+10*k,y-6*k,12*k],[x,y-10*k,11*k]],"#fff")+`<rect x="${x-7*k}" y="${y-28*k}" width="${14*k}" height="${13*k}" rx="${2*k}" fill="#f6a5b4" ${BO}/><path d="M${x} ${y-28*k} V${y-15*k} M${x-7*k} ${y-22*k} H${x+7*k}" stroke="#f2c75c" stroke-width="${2.6*k}"/><path d="M${x} ${y-28*k} q${-6*k} ${-7*k} ${-7*k} 0 q${4*k} ${2*k} ${7*k} 0 q${6*k} ${-7*k} ${7*k} 0 q${-4*k} ${2*k} ${-7*k} 0Z" fill="#f2c75c" stroke="${INK}" stroke-width="1.8"/>`,
    (x,y,k)=>bareTree(x,y,k),
    (x,y,k)=>bush(x,y,k,"#6fa58a","#e8655a",1),
    (x,y,k)=>rock(x,y,k,"#fff"),
    (x,y,k)=>pond(x,y,k,"#cfe8f6",1),
    (x,y,k)=>birch(x,y,k,"#fff"),
    (x,y,k)=>pine(x,y,k*.8,"#8fbfa4",1)
  ]
};
const LAND={printemps:{bg:"#e2f1d4",mk:"#c7e2b4"},ete:{bg:"#f3efc2",mk:"#dfe0a0"},automne:{bg:"#f8dfc4",mk:"#efc59c"},hiver:{bg:"#e6eff8",mk:"#ffffff"}};
function mapLayout(){
  const P=[],gates=[];let u=205;
  CHAP.forEach((c,i)=>{
    if(i){gates.push({i,u:u+84});u+=265}
    for(let d=c.from;d<=c.to;d++){P[d]={d,x:Math.round(200+112*Math.sin((d-1)*.82)),u};if(d<c.to)u+=96}
  });
  const H=u+200;
  gates.forEach(g=>{const c=CHAP[g.i];g.x=(P[c.from-1].x+P[c.from].x)/2});
  const way=[{x:200,u:70}];
  CHAP.forEach((c,i)=>{if(i)way.push(gates[i-1]);for(let d=c.from;d<=c.to;d++)way.push(P[d])});
  way.push({x:P[LASTDAY].x,u:P[LASTDAY].u+120});
  const bands=CHAP.map((c,i)=>({c,lo:i?gates[i-1].u:0,hi:i<CHAP.length-1?gates[i].u:H}));
  const guests=CHAP.map((c,i)=>{const p=P[c.to];return{i,x:Math.max(58,Math.min(342,p.x>200?p.x-122:p.x+122)),u:p.u+14}});
  return {P,gates,way,bands,guests,H};
}
function pathX(way,u){for(let i=0;i<way.length-1;i++){const a=way[i],b=way[i+1];if(u>=a.u&&u<=b.u)return a.x+(b.x-a.x)*(u-a.u)/(b.u-a.u)}return 200}
function smooth(pts){let s=`M${pts[0][0]} ${pts[0][1]}`;for(let i=0;i<pts.length-1;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;s+=` C${(p1[0]+(p2[0]-p0[0])/6).toFixed(1)} ${(p1[1]+(p2[1]-p0[1])/6).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])/6).toFixed(1)} ${(p2[1]-(p3[1]-p1[1])/6).toFixed(1)} ${p2[0]} ${p2[1]}`}return s}
function gateSVG(x,y,open,c){
  const wood="#c8946a";
  let s=shadow(x,y+4,52);
  if(!open)s+=[-1,1].map(sd=>`<rect x="${sd<0?x-32:x}" y="${y-36}" width="32" height="40" rx="3" fill="#e8b07a" ${BO}/>`+[8,16,24].map(o=>`<path d="M${sd<0?x-32+o:x+o} ${y-34} V${y+2}" stroke="#c8946a" stroke-width="2"/>`).join("")).join("")+`<circle cx="${x}" cy="${y-16}" r="9" fill="#f2c75c" ${BO}/><path d="M${x-4} ${y-22} v-4 a4 4 0 0 1 8 0 v4" fill="none" stroke="${INK}" stroke-width="2.4"/>`;
  s+=[-1,1].map(sd=>`<rect x="${x+sd*38-6}" y="${y-58}" width="12" height="64" rx="4" fill="${wood}" ${BO}/><circle cx="${x+sd*38}" cy="${y-60}" r="7" fill="${wood}" ${BO}/>`).join("");
  s+=`<path d="M${x-38} ${y-56} Q${x} ${y-86} ${x+38} ${y-56}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M${x-38} ${y-56} Q${x} ${y-86} ${x+38} ${y-56}" fill="none" stroke="${wood}" stroke-width="7" stroke-linecap="round"/>`;
  if(open)s+=[-30,-18,-6,6,18,30].map((a,i)=>`<circle cx="${x+a}" cy="${y-62-(1-(a/38)**2)*12}" r="4.6" fill="${["#f6a5b4","#f7d77a","#c9b8f2"][i%3]}" stroke="${INK}" stroke-width="1.8"/>`).join("");
  s+=`<rect x="${x-44}" y="${y-104}" width="88" height="26" rx="10" fill="#fffaf2" ${BO}/><text x="${x}" y="${y-86}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="13" fill="${INK}">${open?c.name:`★ ${c.gate}`}</text>`;
  return s;
}
function mapSVG(L){
  const {P,gates,way,bands,guests,H}=L,Y=u=>H-u,R=rng(42);
  let defs="",s="";
  // saisons : on dessine du haut vers le bas pour que chaque bord ondulé recouvre la saison du dessus
  for(const b of [...bands].reverse()){
    const id=b.c.id,ld=LAND[id],top=Y(b.hi),bot=Y(b.lo);
    defs+=`<pattern id="pt-${id}" width="120" height="104" patternUnits="userSpaceOnUse"><path d="M10 16 l3 -6 l3 6 M78 70 l3 -6 l3 6 l3 -6 l3 6" fill="none" stroke="${ld.mk}" stroke-width="2.4" stroke-linecap="round"/>${[[54,22],[24,82]].map(([x,y])=>[0,1,2,3].map(i=>`<circle cx="${x+[-3,3,0,0][i]}" cy="${y+[0,0,-3,3][i]}" r="2.2" fill="${ld.mk}"/>`).join("")).join("")}<circle cx="100" cy="30" r="2.4" fill="${ld.mk}"/><circle cx="58" cy="94" r="1.8" fill="${ld.mk}"/><path d="M36 52 q6 -8 12 0 q-6 4 -12 0Z M104 92 q5 -7 10 0 q-5 3 -10 0Z" fill="${ld.mk}"/></pattern>`;
    let edge=`M0 ${bot} L0 ${top}`;
    if(b.hi<H){for(let x=0;x<MW;x+=50)edge+=` Q${x+25} ${top-14} ${x+50} ${top}`}else edge+=` L${MW} ${top}`;
    edge+=` L${MW} ${bot}Z`;
    s+=`<path d="${edge}" fill="${ld.bg}"/><path d="${edge}" fill="url(#pt-${id})"/>`;
    if(b.hi<H){let w=`M0 ${top}`;for(let x=0;x<MW;x+=50)w+=` Q${x+25} ${top-14} ${x+50} ${top}`;s+=`<path d="${w}" fill="none" stroke="${INK}" stroke-width="3" opacity=".35"/>`}
  }
  // le chemin, puis la partie déjà parcourue en pointillés roses
  const pts=way.map(p=>[p.x,Y(p.u)]),d=smooth(pts);
  s+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fdf1df" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/>`;
  const cur=curDay(),k=way.findIndex(p=>p.d===cur),done=smooth(pts.slice(0,k+1));
  s+=`<path d="${d}" fill="none" stroke="#ead2bb" stroke-width="4" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  if(k>0)s+=`<path d="${done}" fill="none" stroke="#f59a8b" stroke-width="7" stroke-dasharray="1 15" stroke-linecap="round"/>`;
  // déco : posée au hasard (graine fixe) loin du chemin, des portes et des invités
  const taken=[...gates.map(g=>[g.x,g.u+50,82]),...guests.map(g=>[g.x,g.u,60]),[200,70,80],...(HW?[[322,104,62]]:[])],deco=[];
  for(const b of bands){
    const n=Math.floor((b.hi-b.lo)/44),fs=HW?[...DECO[b.c.id],jack,ghostie,jack]:DECO[b.c.id],last=[];
    for(let j=0;j<n;j++)for(let t=0;t<14;t++){
      const u=b.lo+34+R()*(b.hi-b.lo-60),x=24+R()*(MW-48);
      if(Math.abs(x-pathX(way,u))<76||taken.some(([a,c,r])=>Math.hypot(a-x,c-u)<r)||deco.some(o=>Math.hypot(o.x-x,o.u-u)<54))continue;
      let f;do f=Math.floor(R()*fs.length);while(last.includes(f));last.push(f);if(last.length>3)last.shift();
      deco.push({x,u,f:fs[f],k:.75+R()*.4});break;
    }
  }
  deco.sort((a,b)=>b.u-a.u).forEach(o=>s+=o.f(o.x.toFixed(1)*1,Y(o.u).toFixed(1)*1,o.k));
  // le café de départ, les portes, le panneau de fin
  const cy=Y(70);
  s+=shadow(200,cy+16,56)+`<rect x="160" y="${cy-28}" width="80" height="44" rx="6" fill="#fff5e8" ${BO}/><path d="M150 ${cy-26} L200 ${cy-62} L250 ${cy-26}Z" fill="#f59a8b" ${BO}/><rect x="190" y="${cy-8}" width="20" height="24" rx="4" fill="#c8946a" ${BO}/><rect x="166" y="${cy-18}" width="18" height="14" rx="3" fill="#cfe3f0" ${BO}/><rect x="216" y="${cy-18}" width="18" height="14" rx="3" fill="#cfe3f0" ${BO}/><path d="M160 ${cy-30} h80" stroke="${HW?"#f2a35c":"#f6a5b4"}" stroke-width="8" stroke-dasharray="10 10"/>`;
  if(HW)s+=jack(146,cy+16,.7)+jack(256,cy+18,.55);
  gates.forEach(g=>s+=gateSVG(g.x,Y(g.u),gateOpen(CHAP[g.i]),CHAP[g.i]));
  const e=way[way.length-1],ey=Y(e.u);
  s+=`<rect x="${e.x-4}" y="${ey-30}" width="8" height="40" fill="#c8946a" ${BO}/><path d="M${e.x-48} ${ey-56} H${e.x+40} L${e.x+52} ${ey-44} L${e.x+40} ${ey-32} H${e.x-48}Z" fill="#fffaf2" ${BO}/><text x="${e.x}" y="${ey-39}" text-anchor="middle" font-family="Mochiy Pop One,sans-serif" font-size="13" fill="${INK}">À suivre…</text>`;
  return `<svg viewBox="0 0 ${MW} ${H}" aria-hidden="true"><defs>${defs}</defs>${s}</svg>`;
}
let MAPL=null;
function renderMap(){
  const L=MAPL||(MAPL=mapLayout()),{P,gates,guests,H}=L,pc=(x,u)=>`left:${x/MW*100}%;top:${(H-u)/H*100}%`,cur=curDay();
  let h=mapSVG(L);
  for(let d=1;d<=LASTDAY;d++){
    const p=P[d],st=S.stars[d]||0,op=dayOpen(d),rk=Object.keys(REC).find(k=>REC[k].day===d);
    const cls=!op?"lock":d===cur&&!st?"cur":st===3?"gold":"done";
    const badge=rk&&!S.own[rk]?`<span class="nb">${icon(rk,chapOf(d).id)}</span>`:op&&st<3&&st?`<span class="nb">${icon("chest")}</span>`:"";
    h+=`<button class="node ${cls}" style="${pc(p.x,p.u)}" data-day="${d}" type="button" aria-label="Jour ${d}, ${st} étoile${st>1?"s":""}${op?"":", verrouillé"}"><b>${d}</b>${badge}<span class="nst">${[0,1,2].map(i=>`<i${i<st?' class="on"':""}>★</i>`).join("")}</span></button>`;
  }
  gates.forEach(g=>{const c=CHAP[g.i],op=gateOpen(c);h+=`<button class="gbtn${!op&&S.day>=c.from?" want":""}" style="${pc(g.x,g.u+44)}" data-gate="${g.i}" type="button" aria-label="Porte ${c.name} : ${c.gate} étoiles"></button>`});
  guests.forEach(g=>{const c=CHAP[g.i],ok=S.guest[c.guest];h+=`<button class="mguest${ok?" ok":""}" style="${pc(g.x,g.u)}" data-guest="${g.i}" type="button" aria-label="Invité d'honneur ${c.name}">${foxSVG(FOX[c.guest],{pose:ok?"happy":"sit",sil:!ok})}<em>${ok?FOX[c.guest].name:`${chapStars(c)}/30 ★`}</em></button>`});
  if(HW)h+=`<button class="mhw" style="${pc(322,104)}" data-act="hw" type="button" aria-label="Les nuits d'Halloween"><svg viewBox="0 0 90 70" aria-hidden="true"><g stroke="${INK}">${ghostie(66,40,.8)}${jack(36,66,1.25)}${jack(66,68,.7)}</g></svg><em>Nuits ${Object.values(S.hwStars).filter(x=>x).length} / 5</em></button>`;
  h+=`<div class="mfox" style="${pc(P[cur].x,P[cur].u)}">${foxSVG({...FOX.roussette,acc:styleOf("acc").id||undefined},{pose:"happy"})}</div>`;
  const w=$("mwrap");w.style.aspectRatio=`${MW}/${H}`;w.innerHTML=h;
  mapLabel();
}
function mapLabel(){
  if(!MAPL)return;const sc=$("mscroll"),w=$("mwrap"),H=MAPL.H;
  const u=H-(sc.scrollTop+sc.clientHeight/2)/w.offsetHeight*H,b=MAPL.bands.find(b=>u>=b.lo&&u<b.hi)||MAPL.bands[0];
  $("mchap").textContent=`${b.c.name} · ${chapStars(b.c)} / 30 ★`;$("mstars").textContent=`★ ${starSum()}`;
}
function openMap(){
  MUSIC.want(HW?"fantomes":"ukulele");
  closeSheet();$("map").hidden=false;document.body.style.overflow="hidden";
  if(!G||!G.run){const se=chapOf(curDay()).id;if(se!==SEA){SEA=se;renderDecor();dirty=true}}
  renderMap();renderHud();
  const n=document.querySelector(".node.cur")||document.querySelector(`.node[data-day="${curDay()}"]`),sc=$("mscroll");
  sc.scrollTop=n.offsetTop-sc.clientHeight*.55;mapLabel();
  // présentation d'Halloween, une fois par an ; le bonus du jour attend la prochaine ouverture de la carte
  const yr=new Date().getFullYear();if(!S.named)welcome();else if(HW&&S.hwIntro!==yr){S.hwIntro=yr;save();hwSheet()}else dailyBonus();
}
function closeMap(){$("map").hidden=true;document.body.style.overflow=""}
