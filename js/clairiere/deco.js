/* La Clairière : la déco (docs/economie.md, validée par Joffray le 31/10/2026).
   On achète des objets dans la boutique du jour (pièces du Café ou clochettes, bourse.js), puis on les pose où on veut
   en mode Décorer : on les fait glisser du doigt, on les retourne, on les range. Un objet peut accueillir un renard (seat),
   et certains ont un renard préféré (fav) : il y vient plus souvent, et le toucher là prend une photo spéciale.
   R.deco = {inv:{clé:nombre en réserve}, out:[{u,k,x,y,f}] posés dehors, home:[…] dans la maison, n : compteur des u, sold:{d:jour, ks:[…]}}.
   Dessins : viewBox "-50 -h 100 h", le pied de l'objet au point (0,0) ; w = largeur dans la scène (400 × 480). */
R.deco=R.deco||{inv:{},out:[],home:[],n:0,sold:{}};
const dLw=w=>(1.35*100/w).toFixed(2); // même épaisseur de trait que les renards, quelle que soit la taille de l'objet
const dWob=LITE?"":` filter="url(#wobble)"`;
const dSh=(rx,cy=-4)=>`<ellipse cx="0" cy="${cy}" rx="${rx}" ry="5" fill="#3d2a35" opacity=".16"/>`;
const tulip=(x,y,c)=>`<path d="M${x} ${y+16} Q${x-1} ${y+8} ${x} ${y}" fill="none" stroke="#5f9a5a" stroke-width="2.6"/><path d="M${x-6} ${y} Q${x-7} ${y-12} ${x-3} ${y-13} L${x} ${y-8} L${x+3} ${y-13} Q${x+7} ${y-12} ${x+6} ${y} Q${x} ${y+5} ${x-6} ${y}Z" fill="${c}"/>`;
const daisy=(x,y,r=5)=>`<g transform="translate(${x} ${y})">${[0,60,120,180,240,300].map(a=>`<ellipse cy="${-r*.9}" rx="${r*.45}" ry="${r*.8}" fill="#fffaf2" transform="rotate(${a})"/>`).join("")}<circle r="${r*.5}" fill="#f2c45a"/></g>`;
const rose=(x,y,c="#f48aa6")=>`<circle cx="${x}" cy="${y}" r="5.5" fill="${c}"/><path d="M${x-2.5} ${y} q2.5 -3 5 0 q-2.5 2.6 -5 0" fill="none" stroke="#c9587a" stroke-width="1.2"/>`;
const leaf=(x,y,r)=>`<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 q5 -6 10 0 q-5 6 -10 0Z" fill="#8fca7a"/>`;
// les lumières qui s'allument le soir (gl : [x, y] dans le dessin)
const DECO={
  lanterne:{name:"Lampadaire de jardin",p:260,w:30,h:156,gl:[[0,-118]],fav:"luciole",seat:{dx:12,dy:2,poses:["sit","up"]},
    desc:"Un petit lampadaire en fer, vert sapin. Il s'allume tout seul quand le soir tombe.",
    art:L=>`${dSh(28)}<g ${L}${dWob}><path d="M-15 -3 H15 L11 -12 H-11Z" fill="#5f7e6a"/><path d="M-5 -12 V-98 H5 V-12Z" fill="#4f6b5a"/><path d="M-22 -97 H22 L17 -105 H-17Z" fill="#5f7e6a"/>
      <rect x="-17" y="-137" width="34" height="33" rx="4" fill="#ffe7a3"/><path d="M0 -137 V-104 M-17 -120 H17" fill="none"/><path d="M-28 -134 L0 -152 L28 -134Z" fill="#5f7e6a"/></g>
      <circle cx="-8" cy="-128" r="3" fill="#fff" opacity=".7"/><circle cx="0" cy="-152" r="4" fill="#5f7e6a" ${L}/>`},
  tulipes:{name:"Massif de tulipes",p:180,w:58,h:66,desc:"Sept tulipes de toutes les couleurs dans un lit de terre fraîche.",
    art:L=>`${dSh(46)}<g ${L}${dWob}><path d="M-46 -5 Q-40 -24 0 -26 Q40 -24 46 -5 Q0 5 -46 -5Z" fill="#8a5a3a"/>
      ${[[-34,-22,-30],[-14,-26,20],[8,-26,-15],[28,-22,25],[38,-12,40],[-40,-12,-45]].map(([x,y,r])=>`<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 q-7 -14 0 -28 q7 14 0 28Z" fill="#7fb86a"/>`).join("")}
      ${[[-30,-40,"#f47f9a"],[-15,-50,"#f2c45a"],[0,-44,"#c9a8ec"],[16,-52,"#f6a5b4"],[30,-40,"#f59a6b"],[-6,-30,"#fff4f0"],[22,-30,"#f47f9a"]].map(([x,y,c])=>tulip(x,y,c)).join("")}</g>`},
  nichoir:{name:"Nichoir",p:220,w:32,h:158,fav:"mitaine",seat:{dx:13,dy:2,poses:["up","sit"]},
    desc:"Une maisonnette pour les oiseaux, perchée sur un piquet. Le locataire chante le matin.",
    art:L=>`${dSh(24)}<g ${L}${dWob}><path d="M-5 -2 V-92 H5 V-2Z" fill="#a9785a"/><path d="M-24 -90 V-128 L0 -146 L24 -128 V-90Z" fill="#9ec3ef"/>
      <path d="M-32 -122 L0 -151 L32 -122 L26 -117 L0 -140 L-26 -117Z" fill="#d9776a"/><circle cx="0" cy="-112" r="8" fill="#5b4250"/><path d="M0 -100 V-92" fill="none"/>
      <g transform="translate(17 -137)"><ellipse rx="10" ry="8" fill="#f2c45a"/><path d="M8 -2 l7 2 l-7 2Z" fill="#f59a6b"/><path d="M-10 0 l-6 -4 v8Z" fill="#f2c45a"/></g></g><circle cx="20" cy="-139" r="1.6" fill="#5b4250"/>`},
  champis:{name:"Champignons géants",p:420,w:62,h:86,fav:"pantoufle",seat:{dx:-5,dy:-42,poses:["sit","sleep","groom"]},
    desc:"Un gros champignon tout doux, assez solide pour qu'un renard s'assoie dessus. Et son petit frère.",
    art:L=>`${dSh(46)}<g ${L}${dWob}><path d="M-24 -2 Q-27 -38 -18 -52 H2 Q10 -38 4 -2Z" fill="#fbecd8"/><path d="M-48 -48 Q-46 -82 -8 -82 Q30 -82 32 -48 Q-8 -38 -48 -48Z" fill="#f2a68a"/>
      <path d="M22 -2 Q20 -16 24 -24 H34 Q38 -16 36 -2Z" fill="#fbecd8"/><path d="M14 -22 Q16 -40 29 -40 Q42 -40 44 -22 Q29 -17 14 -22Z" fill="#c9a8ec"/></g>
      ${[[-30,-62,5],[-10,-72,4],[10,-62,6],[-22,-52,3],[24,-32,3],[34,-28,2.4]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fffaf2"/>`).join("")}<path d="M-40 -60 Q-36 -74 -20 -78" fill="none" stroke="#fff" stroke-width="2.4" opacity=".6" stroke-linecap="round"/>`},
  coussin:{name:"Gros coussin de jardin",p:300,w:50,h:46,fav:"marquis",seat:{dx:0,dy:-12,poses:["sit","sleep","lie"]},
    desc:"Un pouf rayé, rembourré à craquer. Le plus moelleux de toute la forêt.",
    art:L=>`${dSh(44)}<g ${L}${dWob}><path d="M-44 -12 Q-46 -38 0 -40 Q46 -38 44 -12 Q44 1 0 1 Q-44 1 -44 -12Z" fill="#f6b8c4"/></g>
      ${[-26,-8,10,28].map(x=>`<path d="M${x} -38 Q${x+2} -18 ${x} 0" fill="none" stroke="#fffaf2" stroke-width="5" opacity=".75"/>`).join("")}<ellipse cx="0" cy="-30" rx="30" ry="6" fill="#fff" opacity=".3"/><circle cx="0" cy="-26" r="3.6" fill="#e08a9c" ${L}/>`},
  hamac:{name:"Hamac",p:1200,w:96,h:74,fav:"somnus",seat:{dx:0,dy:-21,poses:["sleep","lie"]},
    desc:"Une toile tendue entre deux piquets. On s'y balance doucement jusqu'à s'endormir.",
    art:L=>`${dSh(40,-3)}<g ${L}${dWob}><path d="M-46 -2 L-42 -70 M46 -2 L42 -70" fill="none" stroke-width="${(1.35*100/96*2.6).toFixed(2)}"/><path d="M-46 -2 L-42 -70 M46 -2 L42 -70" fill="none" stroke="#a9785a" stroke-width="2.4"/>
      <path d="M-42 -64 L-34 -46 M-42 -64 L-30 -46 M42 -64 L34 -46 M42 -64 L30 -46" fill="none" stroke-width="1"/><path d="M-36 -46 Q0 -34 36 -46 Q0 -12 -36 -46Z" fill="#7fa8d8"/></g>`,
    front:L=>`<g ${L}${dWob}><path d="M-38 -45 Q0 -2 38 -45 Q0 -22 -38 -45Z" fill="#9ec3ef"/></g>${[-22,-8,8,22].map(x=>`<path d="M${x} ${-34+Math.abs(x)/3} q1 8 0 ${14-Math.abs(x)/2.4}" stroke="#fffaf2" stroke-width="3" opacity=".8" fill="none"/>`).join("")}`},
  moulin:{name:"Petit moulin à vent",p:900,w:56,h:136,fav:"moka",seat:{dx:16,dy:2,poses:["up","sit"]},
    desc:"Un moulin miniature dont les ailes tournent au moindre souffle de vent.",
    art:L=>`${dSh(26)}<g ${L}${dWob}><path d="M-18 -2 L-12 -80 H12 L18 -2Z" fill="#fbecd8"/><path d="M-6 -2 V-18 Q0 -24 6 -18 V-2Z" fill="#a9785a"/><rect x="-5" y="-56" width="10" height="10" rx="2" fill="#ffe7a3"/><path d="M-17 -78 L0 -100 L17 -78Z" fill="#d9776a"/></g>
      <g transform="translate(0 -88)"><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="7s" repeatCount="indefinite"/>${[0,90,180,270].map(a=>`<g transform="rotate(${a})"><path d="M3 -4 H44 V4 H3Z" fill="#fffaf2" ${L}/><path d="M14 -4 V4 M25 -4 V4 M36 -4 V4" stroke="#c9b8a8" stroke-width="1.6"/></g>`).join("")}<circle r="5" fill="#a9785a" ${L}/></g></g>`},
  puits:{name:"Puits en pierre",p:1800,w:70,h:122,fav:"plouf",seat:{dx:15,dy:-29,poses:["sit","up"]},
    desc:"Un vieux puits avec son toit et son seau. On dit qu'il exauce les vœux des renards patients.",
    art:L=>`${dSh(42)}<g ${L}${dWob}><path d="M-30 -40 V-94 M30 -40 V-94" fill="none" stroke-width="${(1.35*100/70*2.4).toFixed(2)}"/><path d="M-30 -40 V-94 M30 -40 V-94" stroke="#a9785a" stroke-width="3"/>
      <path d="M-30 -84 H30" fill="none"/><path d="M0 -84 V-64" fill="none" stroke-width="1.2"/><path d="M-6 -64 H6 L4 -54 H-4Z" fill="#a9785a"/>
      <path d="M-46 -90 L0 -118 L46 -90 L40 -84 L0 -108 L-40 -84Z" fill="#a9785a"/>
      <path d="M-36 -4 V-40 Q0 -50 36 -40 V-4 Q0 6 -36 -4Z" fill="#cfc6bd"/><ellipse cx="0" cy="-40" rx="36" ry="9" fill="#b9b0a7"/><ellipse cx="0" cy="-40" rx="28" ry="5.5" fill="#4f7aa0"/></g>
      <path d="M-36 -26 Q0 -16 36 -26 M-36 -14 Q0 -4 36 -14 M-20 -36 V-24 M14 -35 V-22 M-4 -22 V-10 M24 -22 V-10 M-26 -12 V-2" fill="none" stroke="#a89e94" stroke-width="1.6"/>`},
  tonneau:{name:"Tonneau fleuri",p:350,w:40,h:84,desc:"Un vieux tonneau de chêne, débordant de marguerites.",
    art:L=>`${dSh(30)}<g ${L}${dWob}><path d="M-30 -4 Q-36 -30 -30 -54 H30 Q36 -30 30 -4 Q0 4 -30 -4Z" fill="#b9814a"/><ellipse cx="0" cy="-54" rx="30" ry="7" fill="#7a4a35"/>
      ${[[-34,-62,-30],[-20,-70,10],[18,-70,-10],[32,-62,30],[0,-66,0]].map(([x,y,r])=>`<path transform="translate(${x} ${y}) rotate(${r})" d="M0 8 q-7 -12 0 -22 q7 10 0 22Z" fill="#7fb86a"/>`).join("")}</g>
      <path d="M-33 -44 Q0 -36 33 -44 M-34 -16 Q0 -8 34 -16" fill="none" stroke="#7a5a4a" stroke-width="4"/>${[[-20,-66],[-4,-74],[14,-68],[26,-58],[-30,-58],[4,-60]].map(([x,y])=>daisy(x,y,6)).join("")}`},
  brouette:{name:"Brouette de foin",p:700,w:66,h:66,fav:"copeau",seat:{dx:3,dy:-19,poses:["sit","sleep"]},
    desc:"La vieille brouette de Copeau, remplie de foin frais. Parfaite pour une sieste au soleil.",
    art:L=>`${dSh(44)}<g ${L}${dWob}><path d="M-26 -22 L-30 -2 M18 -22 L14 -2" fill="none" stroke-width="${(1.35*100/66*2.6).toFixed(2)}"/><path d="M-26 -22 L-30 -2 M18 -22 L14 -2" stroke="#7a8a94" stroke-width="2.4"/>
      <path d="M-40 -44 L-50 -36" fill="none" stroke-width="${(1.35*100/66*2.6).toFixed(2)}"/><path d="M-40 -44 L-50 -36" stroke="#a9785a" stroke-width="2.6"/>
      <path d="M-40 -44 Q0 -58 40 -44 Q0 -36 -40 -44Z" fill="#f2d27a"/></g>${[-28,-14,2,18,30].map(x=>`<path d="M${x} -47 l3 -6 M${x+4} -46 l-2 -7" stroke="#d9b45a" stroke-width="1.6"/>`).join("")}`,
    front:L=>`<g ${L}${dWob}><path d="M-41 -44 L-30 -20 H30 L41 -44 Q0 -36 -41 -44Z" fill="#7fb0c8"/><circle cx="34" cy="-14" r="12" fill="#5b4250"/><circle cx="34" cy="-14" r="5" fill="#c9c2bc"/></g><path d="M-32 -36 H32" stroke="#a8cfe0" stroke-width="2.4"/>`},
  tente:{name:"Petite tente",p:1500,w:84,h:80,fav:"charbon",seat:{dx:0,dy:4,poses:["sleep","lie","sit"]},
    desc:"Une tente à rayures jaunes, l'entrée grande ouverte. On y dort comme en camping.",
    art:L=>`${dSh(46,-2)}<g ${L}${dWob}><path d="M-46 -2 L0 -74 L46 -2Z" fill="#f6d27a"/><path d="M-16 -2 L0 -42 L16 -2Z" fill="#6a5060"/><path d="M-16 -2 L0 -42 L-26 -6Z M16 -2 L0 -42 L26 -6Z" fill="#fbe7b0"/></g>
      <path d="M-30 -26 L-12 -52 M30 -26 L12 -52 M-40 -12 L-6 -64 M40 -12 L6 -64" stroke="#f2b25a" stroke-width="3.4" opacity=".8"/><path d="M0 -74 V-82" stroke="${INK}" stroke-width="2.4"/><path d="M0 -82 l10 3 l-10 3Z" fill="#f48aa6" ${L}/>`},
  longuevue:{name:"Longue-vue",p:1600,w:50,h:96,fav:"comete",seat:{dx:-16,dy:2,poses:["up","sit"]},
    desc:"Une longue-vue en laiton sur son trépied, pointée vers le ciel. La nuit, on y voit les étoiles filantes.",
    art:L=>`${dSh(26)}<g ${L}${dWob}><path d="M0 -48 L-24 -2 M0 -48 L24 -2 M0 -48 L4 -2" fill="none" stroke-width="${(1.35*100/40*2.4).toFixed(2)}"/><path d="M0 -48 L-24 -2 M0 -48 L24 -2 M0 -48 L4 -2" stroke="#a9785a" stroke-width="4"/>
      <g transform="rotate(-34 0 -54)"><rect x="-34" y="-62" width="44" height="16" rx="5" fill="#e0b34a"/><rect x="8" y="-65" width="28" height="22" rx="5" fill="#f2c75c"/><ellipse cx="36" cy="-54" rx="4" ry="11" fill="#bfe3f2"/><path d="M-26 -62 V-46" fill="none"/></g></g>`},
  arche:{name:"Arche de roses",p:2400,w:96,h:152,fav:"brioche",seat:{dx:0,dy:2,poses:["sit","happy"]},
    desc:"Une arche en bois blanc où grimpent des roses. Un rendez-vous parfait pour les amoureux.",
    art:L=>`${dSh(46,-3)}<g ${L}${dWob}><path d="M-44 -2 V-100 Q-44 -148 0 -148 Q44 -148 44 -100 V-2 H34 V-100 Q34 -138 0 -138 Q-34 -138 -34 -100 V-2Z" fill="#f4ead8"/></g>
      <path d="M-39 -10 Q-46 -50 -38 -90 Q-30 -130 0 -142 Q30 -130 38 -90 Q46 -50 39 -10" fill="none" stroke="#6fa060" stroke-width="2.6"/>
      ${[[-40,-24,40],[-36,-56,-20],[-40,-88,60],[-26,-124,10],[0,-142,-30],[26,-124,70],[40,-88,0],[36,-56,40],[40,-24,-40]].map(([x,y,r])=>leaf(x,y,r)).join("")}
      ${[[-38,-40],[-42,-74],[-34,-110],[-12,-140],[14,-140],[34,-110],[42,-74],[38,-40],[-40,-14,"#f6b8c4"],[40,-14,"#f6b8c4"]].map(([x,y,c])=>rose(x,y,c)).join("")}`},
  banc:{name:"Banc en rondin",p:500,w:62,h:46,fav:"brindille",seat:{dx:0,dy:-16,poses:["sit","sleep","groom"]},
    desc:"Une bûche coupée en deux, posée sur deux souches. Mamie Brindille dit que c'est le meilleur siège du monde.",
    art:L=>`${dSh(44)}<g ${L}${dWob}><path d="M-34 -2 V-20 H-20 V-2Z M20 -2 V-20 H34 V-2Z" fill="#a9785a"/><path d="M-46 -20 H46 Q50 -26 46 -32 H-46 Q-50 -26 -46 -20Z" fill="#c98f5c"/><ellipse cx="-46" cy="-26" rx="4" ry="6" fill="#e8c08e"/><ellipse cx="46" cy="-26" rx="4" ry="6" fill="#e8c08e"/></g>
      <path d="M-30 -30 H26" stroke="#e0aa74" stroke-width="2.4" stroke-linecap="round"/>`},
  // les beaux objets, en clochettes
  carillon:{name:"Carillon à vent",b:15,w:40,h:152,fav:"zaza",seat:{dx:-14,dy:2,poses:["sit","up"]},
    desc:"Des tubes de bambou et une petite clochette dorée. Il chante doucement quand le vent passe.",
    art:L=>`${dSh(20)}<g ${L}${dWob}><path d="M-2 -2 V-130 Q-2 -148 16 -148 Q32 -148 32 -132" fill="none" stroke-width="${(1.35*100/30*2.4).toFixed(2)}"/><path d="M-2 -2 V-130 Q-2 -148 16 -148 Q32 -148 32 -132" fill="none" stroke="#4f6b5a" stroke-width="5"/></g>
      <g transform="translate(32 -130)"><g><animateTransform attributeName="transform" type="rotate" values="-6;6;-6" dur="2.6s" repeatCount="indefinite"/><ellipse cx="0" cy="6" rx="16" ry="4" fill="#a9785a" ${L}/>
      ${[[-12,30],[-6,40],[0,46],[6,38],[12,28]].map(([x,l])=>`<path d="M${x} 8 V${12}" stroke="${INK}" stroke-width="1"/><rect x="${x-2.4}" y="12" width="4.8" height="${l}" rx="2" fill="#d9c27a" ${L}/>`).join("")}
      <path d="M0 52 V58" stroke="${INK}" stroke-width="1"/><path d="M-6 70 Q-6 58 0 58 Q6 58 6 70Z" fill="#f6cc4e" ${L}/></g></g>`},
  fontaine:{name:"Fontaine aux oiseaux",b:25,w:56,h:84,fav:"libellule",seat:{dx:18,dy:2,poses:["sit","up"]},
    desc:"Une vasque de pierre où les oiseaux viennent boire et s'éclabousser.",
    art:L=>`${dSh(30)}<g ${L}${dWob}><path d="M-20 -2 Q-22 -10 -10 -12 L-7 -46 H7 L10 -12 Q22 -10 20 -2Z" fill="#cfc6bd"/><path d="M-42 -52 Q0 -26 42 -52 Q0 -60 -42 -52Z" fill="#b9b0a7"/><ellipse cx="0" cy="-53" rx="34" ry="5" fill="#9ec3ef"/>
      <g transform="translate(-26 -60)"><ellipse rx="9" ry="7" fill="#9ec3ef"/><path d="M-8 -3 l-7 1 l6 3Z" fill="#f59a6b"/><path d="M8 0 l7 -4 v8Z" fill="#9ec3ef"/></g></g>
      <circle cx="-30" cy="-62" r="1.5" fill="#5b4250"/><ellipse cx="8" cy="-53" rx="10" ry="2" fill="none" stroke="#fff" stroke-width="1.6"><animate attributeName="rx" values="4;16" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2.4s" repeatCount="indefinite"/></ellipse>`},
  lampions:{name:"Guirlande de lampions",b:20,w:110,h:104,gl:[[-30,-72],[-14,-66],[2,-64],[18,-66],[34,-72]],fav:"painepice",seat:{dx:0,dy:2,poses:["sit","up"]},
    desc:"Cinq lampions de papier entre deux perches. Le soir, ils éclairent tout le coin de la clairière.",
    art:L=>`${dSh(48,-3)}<g ${L}${dWob}><path d="M-46 -2 V-100 M46 -2 V-100" fill="none" stroke-width="${(1.35*100/110*2.4).toFixed(2)}"/><path d="M-46 -2 V-100 M46 -2 V-100" stroke="#a9785a" stroke-width="2.4"/></g>
      <path d="M-46 -96 Q0 -54 46 -96" fill="none" stroke="${INK}" stroke-width="1.2"/>${[[-30,-80,"#f6a5b4"],[-14,-74,"#f2c45a"],[2,-72,"#a9d68f"],[18,-74,"#9ec3ef"],[34,-80,"#c9a8ec"]].map(([x,y,c])=>`<ellipse cx="${x}" cy="${y+8}" rx="6" ry="8" fill="${c}" ${L}/><path d="M${x-3} ${y+1} H${x+3} M${x-3} ${y+15} H${x+3}" stroke="${INK}" stroke-width="1.4"/>`).join("")}`},
  topiaire:{name:"Renard en buis",b:30,w:58,h:86,fav:"gribouille",seat:{dx:20,dy:2,poses:["sit","happy"]},
    desc:"Un buisson taillé en forme de renard assis, dans une jardinière en terre cuite. Il ne bouge jamais, lui.",
    art:L=>`${dSh(34)}<g ${L}${dWob}><path d="M-30 -2 L-34 -24 H34 L30 -2Z" fill="#d07450"/><path d="M24 -26 Q46 -34 40 -56 Q34 -44 22 -40Z" fill="#7fb86a"/><ellipse cx="0" cy="-44" rx="26" ry="22" fill="#8fca7a"/>
      <path d="M-18 -66 L-20 -84 L-6 -72Z M18 -66 L20 -84 L6 -72Z" fill="#7fb86a"/><circle cx="0" cy="-66" r="16" fill="#8fca7a"/></g>
      ${[[-12,-50],[8,-40],[-6,-32],[14,-54],[-4,-72],[6,-62],[30,-44]].map(([x,y])=>`<path d="M${x} ${y} q2 -3 4 0" fill="none" stroke="#5f9a5a" stroke-width="1.6"/>`).join("")}<circle cx="-5" cy="-67" r="1.8" fill="#5f9a5a"/><circle cx="5" cy="-67" r="1.8" fill="#5f9a5a"/>`},
  // ---------- dans la maison (home) : au mur (wall) ou par terre, jamais sur le tapis où l'on dort ----------
  tableau:{name:"Tableau de la forêt",home:1,wall:1,p:400,w:52,h:96,desc:"Une petite toile : les pins, la colline et la lune. Gribouille jure que ce n'est pas lui.",
    art:L=>`<path d="M-20 -78 L0 -94 L20 -78" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="0" cy="-94" r="2.4" fill="#a8724c"/><g ${L}${dWob}><rect x="-46" y="-80" width="92" height="76" rx="4" fill="#d9a63a"/></g>
      <rect x="-37" y="-71" width="74" height="58" fill="#c8dff0"/><circle cx="22" cy="-58" r="7" fill="#fff6d0"/><path d="M-37 -32 Q-8 -46 37 -34 V-13 H-37Z" fill="#8dbd86"/><path d="M-37 -22 Q0 -30 37 -20 V-13 H-37Z" fill="#6fa060"/>
      ${[[-26,-30,1],[-14,-36,1.2],[8,-34,.9],[26,-30,1.1]].map(([x,y,k])=>`<path d="M${x-7*k} ${y} L${x} ${y-20*k} L${x+7*k} ${y}Z" fill="#4f7a55"/>`).join("")}<rect x="-37" y="-71" width="74" height="58" fill="none" ${L}/><path d="M-40 -76 H40" stroke="#f2c75c" stroke-width="2" opacity=".7"/>`},
  etagplantes:{name:"Étagère à plantes",home:1,wall:1,p:350,w:62,h:74,desc:"Une planche au mur, trois petits pots, et un lierre qui descend jusqu'au plancher.",
    art:L=>`<g ${L}${dWob}><path d="M-34 -34 V-24 L-26 -34Z M34 -34 V-24 L26 -34Z" fill="#a8724c"/><rect x="-46" y="-40" width="92" height="7" rx="2" fill="#c98f5c"/>
      <path d="M-38 -40 L-36 -54 H-22 L-20 -40Z M-8 -40 L-6 -56 H8 L10 -40Z M22 -40 L24 -52 H36 L38 -40Z" fill="#e0855c"/>
      <path d="M-29 -54 Q-34 -66 -29 -72 Q-24 -66 -29 -54Z" fill="#7fb86a"/><circle cx="1" cy="-62" r="8" fill="#8fca7a"/><circle cx="-5" cy="-58" r="5" fill="#8fca7a"/><circle cx="7" cy="-58" r="5" fill="#8fca7a"/></g>
      <path d="M30 -52 Q28 -40 32 -28 Q36 -16 30 -4" fill="none" stroke="#5f9a5a" stroke-width="2.2"/>${[[30,-46,30],[31,-34,-40],[34,-22,40],[31,-10,-30]].map(([x,y,r])=>leaf(x,y,r)).join("")}<path d="M-29 -54 V-66" stroke="#5f9a5a" stroke-width="1.4"/>`},
  couronne:{name:"Couronne de fleurs séchées",home:1,wall:1,p:300,w:46,h:96,desc:"Des fleurs des champs séchées en cercle, avec un ruban rose. Ça sent l'été toute l'année.",
    art:L=>`<path d="M0 -94 V-84" stroke="${INK}" stroke-width="1.8"/><circle cx="0" cy="-94" r="2.6" fill="#a8724c"/><circle cx="0" cy="-48" r="34" fill="none" stroke="${INK}" stroke-width="${(1.35*100/46*2+12).toFixed(1)}"/><circle cx="0" cy="-48" r="34" fill="none" stroke="#c9a46a" stroke-width="12"/>
      ${Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2,x=+(34*Math.cos(a)).toFixed(1),y=+(-48+34*Math.sin(a)).toFixed(1);return i%3===0?daisy(x,y,5):i%3===1?rose(x,y,"#f6b8c4"):leaf(x,y,Math.round(a*57))}).join("")}
      <path d="M0 -14 L-12 -2 L-6 -14 M0 -14 L12 -2 L6 -14" fill="#f48aa6" ${L}/><circle cx="0" cy="-14" r="4" fill="#f48aa6" ${L}/>`},
  photos:{name:"Fil à photos",home:1,wall:1,b:15,w:100,h:62,desc:"Une ficelle, des pinces à linge, et les photos de tes renards préférés.",
    art:L=>`<path d="M-48 -56 Q0 -36 48 -56" fill="none" stroke="${INK}" stroke-width="1.2"/><circle cx="-48" cy="-56" r="2" fill="#a8724c"/><circle cx="48" cy="-56" r="2" fill="#a8724c"/>
      ${[[-32,-48,-8,"#f2a65a"],[-11,-43,4,"#c9c2bc"],[11,-43,-4,"#f6e2b8"],[32,-48,8,"#c9a8ec"]].map(([x,y,r,c])=>`<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-9" y="0" width="18" height="21" rx="1" fill="#fffaf2" ${L}/><rect x="-6.5" y="2.5" width="13" height="12" fill="#bfe3f2"/>
        <path d="M-5 14.5 Q0 4 5 14.5Z" fill="${c}"/><path d="M-4 8 L-3 4.5 L-1.4 7.6 M4 8 L3 4.5 L1.4 7.6" fill="${c}"/><circle cx="0" cy="9" r="2.4" fill="${c}"/><rect x="-1.6" y="-3" width="3.2" height="6" rx="1" fill="#e8c08e" ${L}/></g>`).join("")}`},
  plante:{name:"Grande plante verte",home:1,p:450,w:50,h:122,desc:"Une plante aux feuilles géantes dans un panier tressé. Elle pousse vers la fenêtre.",
    art:L=>`${dSh(26)}<g ${L}${dWob}>${[[-6,-60,-38],[8,-70,24],[-2,-92,-6],[16,-50,48],[-20,-46,-58]].map(([x,y,r])=>`<path d="M0 -36 Q${x/2} ${y/2-20} ${x} ${y}" fill="none" stroke="#5f9a5a" stroke-width="2"/><g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 Q-20 -10 -16 -30 Q0 -40 16 -30 Q20 -10 0 0Z" fill="#7fb86a"/><path d="M0 0 V-32 M-10 -22 L-4 -18 M10 -22 L4 -18" fill="none" stroke="#5f9a5a" stroke-width="1.4"/></g>`).join("")}
      <path d="M-26 -2 L-30 -40 H30 L26 -2Z" fill="#dca86c"/></g>${[-20,-6,8,22].map(x=>`<path d="M${x} -38 Q${x+3} -20 ${x} -4" fill="none" stroke="#b9814a" stroke-width="2"/>`).join("")}`},
  lampe:{name:"Lampe sur pied",home:1,p:600,w:36,h:150,desc:"Un grand abat-jour à franges sur trois pieds de bois. La lumière la plus douce de la maison.",
    art:L=>`<ellipse cx="0" cy="-104" rx="60" ry="40" fill="#fff3c4" opacity=".28"/>${dSh(22)}<g ${L}${dWob}><path d="M0 -96 L-20 -2 M0 -96 L20 -2 M0 -96 L2 -2" fill="none" stroke-width="${(1.35*100/36*2.4).toFixed(2)}"/><path d="M0 -96 L-20 -2 M0 -96 L20 -2 M0 -96 L2 -2" stroke="#a8724c" stroke-width="4"/>
      <path d="M-26 -100 L-16 -142 H16 L26 -100Z" fill="#fbe7c8"/></g>${[-22,-14,-6,2,10,18].map(x=>`<path d="M${x} -100 v6" stroke="#e0a868" stroke-width="2"/>`).join("")}<path d="M-12 -136 L-18 -106" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>`},
  // le canapé pour trois (envie de Joffray) : trois places, le préféré prend la première
  canape:{name:"Canapé pour trois",home:1,p:2200,w:130,h:72,fav:"biscuit",seat:{dx:-34,dy:-22,poses:["sit","sleep","lie"]},more:[[0,-22],[34,-22]],
    desc:"Un grand canapé vert sauge, trois places et des coussins partout. On s'y serre à trois pour la sieste.",
    art:L=>`${dSh(54)}<g ${L}${dWob}><path d="M-44 -26 V-58 Q-44 -66 -36 -66 H36 Q44 -66 44 -58 V-26Z" fill="#9cc796"/><path d="M-48 -8 V-30 H48 V-8Z" fill="#a7cfa0"/>
      <path d="M-38 -8 L-36 -2 M38 -8 L36 -2" fill="none"/><path d="M-30 -34 Q-30 -46 -18 -48 Q-10 -44 -12 -34Z" fill="#fbe7c8"/><path d="M30 -34 Q30 -46 18 -48 Q10 -44 12 -34Z" fill="#f6b8c4"/></g>`,
    front:L=>`<g ${L}${dWob}><path d="M-50 -10 V-36 Q-50 -44 -42 -44 Q-36 -44 -36 -36 V-10Z M50 -10 V-36 Q50 -44 42 -44 Q36 -44 36 -36 V-10Z" fill="#8fbf88"/><path d="M-36 -10 V-20 H36 V-10Z" fill="#a7cfa0"/></g><path d="M-12 -18 V-12 M12 -18 V-12" stroke="#7fae78" stroke-width="2"/>`},
  pouf:{name:"Pouf tricoté",home:1,p:380,w:46,h:42,fav:"givre",seat:{dx:0,dy:-14,poses:["sit","sleep","lie"]},desc:"Un gros pouf en laine, tricoté en torsades. Il garde la chaleur comme personne.",
    art:L=>`${dSh(42)}<g ${L}${dWob}><path d="M-42 -8 Q-44 -34 0 -36 Q44 -34 42 -8 Q40 0 0 0 Q-40 0 -42 -8Z" fill="#e8d2f0"/></g>${[-28,-14,0,14,28].map(x=>`<path d="M${x} -34 q-4 6 0 11 q4 6 0 11 q-4 6 0 11" fill="none" stroke="#c9a8ec" stroke-width="3"/>`).join("")}<ellipse cx="0" cy="-30" rx="28" ry="5" fill="#fff" opacity=".3"/>`},
  pelotes:{name:"Panier à pelotes",home:1,p:320,w:42,h:70,fav:"grignote",seat:{dx:20,dy:2,poses:["sit","groom"]},desc:"Des pelotes de toutes les couleurs et deux aiguilles. Attention, ça roule.",
    art:L=>`${dSh(36)}<g ${L}${dWob}><circle cx="-14" cy="-34" r="12" fill="#f6a5b4"/><circle cx="10" cy="-36" r="13" fill="#9ec3ef"/><circle cx="-2" cy="-42" r="10" fill="#f2c45a"/><path d="M14 -48 L30 -66 M20 -46 L34 -62" fill="none"/>
      <path d="M-34 -30 Q-36 -2 0 -2 Q36 -2 34 -30Z" fill="#dca86c"/></g>${[-22,-8,6,20].map(x=>`<path d="M${x} -28 Q${x+2} -16 ${x} -5" fill="none" stroke="#b9814a" stroke-width="2"/>`).join("")}<path d="M-20 -38 q6 -4 12 2 M4 -42 q6 -4 12 2" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/><path d="M34 -30 Q44 -20 40 -6" fill="none" stroke="#f6a5b4" stroke-width="2"/>`},
  tapisrond:{name:"Petit tapis rond",home:1,p:250,w:76,h:24,desc:"Un tapis rond tressé, pour avoir chaud aux pattes en entrant.",
    art:L=>`<g ${L}${dWob}><ellipse cx="0" cy="-11" rx="46" ry="10" fill="#f2c0a0"/></g><ellipse cx="0" cy="-11" rx="34" ry="7" fill="none" stroke="#e0855c" stroke-width="2.4"/><ellipse cx="0" cy="-11" rx="20" ry="4" fill="none" stroke="#f6e2b8" stroke-width="2.4"/>`},
  coffre:{name:"Coffre à jouets",home:1,b:20,w:58,h:66,fav:"galette",seat:{dx:-22,dy:2,poses:["sit","happy"]},desc:"Un coffre en bois peint, couvercle ouvert : une balle, une toupie, un renard en peluche.",
    art:L=>`${dSh(40)}<g ${L}${dWob}><path d="M-38 -40 L-34 -62 H34 L38 -40Z" fill="#c98f5c"/><circle cx="-14" cy="-44" r="9" fill="#f48aa6"/><path d="M6 -40 L14 -54 L22 -40Z" fill="#9ec3ef"/><path d="M-6 -44 Q-2 -54 6 -50" fill="none"/>
      <path d="M-40 -2 V-40 H40 V-2Z" fill="#e0b080"/></g><path d="M-40 -22 H40" stroke="#c98f5c" stroke-width="3"/><rect x="-6" y="-28" width="12" height="10" rx="2" fill="#f2c75c" ${L}/>${[[-28,-32],[26,-12]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#f6a5b4"/>`).join("")}`},
};
const dSvg=(k,part="art",cls="")=>{const o=DECO[k],L=`stroke="${INK}" stroke-width="${dLw(o.w)}" stroke-linejoin="round" stroke-linecap="round"`;
  return `<svg viewBox="-50 -${o.h} 100 ${o.h}" overflow="visible" aria-hidden="true"${cls}>${o[part](L)}</svg>`};
const dPrice=o=>o.b?`${bellSVG} ${o.b}`:`${coinIcon()} ${o.p}`;
const coinIcon=()=>`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#f2c75c" stroke="${INK}" stroke-width="2"/><circle cx="12" cy="12" r="6.4" fill="#e9b949"/><g fill="${INK}"><ellipse cx="12" cy="14.2" rx="2.6" ry="2.1"/><circle cx="8.9" cy="11" r="1.1"/><circle cx="11" cy="9.3" r="1.1"/><circle cx="13" cy="9.3" r="1.1"/><circle cx="15.1" cy="11" r="1.1"/></g></svg>`;

/* ---------- les pièces du Café (bourse.js) ---------- */
const cafeCoins=()=>(load(CAFEKEY)||{}).coins||0;
// la Clairière dépense directement dans la sauvegarde du Café : un seul jeu est ouvert à la fois dans l'app
function spendCoins(n){const C=load(CAFEKEY);if(!C||(C.coins||0)<n)return false;C.coins-=n;try{localStorage.setItem(CAFEKEY,JSON.stringify(C))}catch(e){return false}return true}

/* ---------- la boutique du jour ---------- */
// 3 objets en pièces et 1 en clochettes, les mêmes pour tout le monde, qui changent à minuit. Les pièces tournent par 3
// dans une liste fixe (chaque objet revient régulièrement), les clochettes un par jour. Ceux de la maison attendent qu'elle soit ouverte.
const SHOP_P=["tulipes","banc","tableau","lanterne","hamac","plante","coussin","puits","pouf","nichoir","moulin","couronne","tonneau","tente","lampe","champis","brouette","etagplantes","longuevue","arche","canape","pelotes","tapisrond"],
  SHOP_B=["lampions","carillon","photos","topiaire","fontaine","coffre"];
const dayN=()=>{const d=new Date();return Math.round((new Date(d.getFullYear(),d.getMonth(),d.getDate())-new Date(2026,0,1))/864e5)};
const shopPool=a=>a.filter(k=>!DECO[k].home||houseOpen());
const shopToday=()=>{const n=dayN(),P=shopPool(SHOP_P),B=shopPool(SHOP_B);return [0,1,2].map(i=>P[(3*n+i)%P.length]).concat(B[n%B.length])};
const soldToday=k=>R.deco.sold.d===dayN()&&R.deco.sold.ks.includes(k);
function buyDeco(k){const o=DECO[k];if(soldToday(k)||!shopToday().includes(k))return;
  if(o.b){if(bellsN()<o.b)return;addBells(-o.b)}else if(!spendCoins(o.p))return;
  if(R.deco.sold.d!==dayN())R.deco.sold={d:dayN(),ks:[]};R.deco.sold.ks.push(k);
  R.deco.inv[k]=(R.deco.inv[k]||0)+1;save();toast(`${o.name} : acheté ! Pose-le ${o.home?"dans la maison":"dans la clairière"}.`);shopSheet("jour")}
const untilMidnight=()=>{const d=new Date(),m=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1),h=Math.ceil((m-d)/36e5);return h>1?`dans ${h} h`:"dans moins d'une heure"};

R.deco.home=R.deco.home||[];
const allDeco=()=>R.deco.out.concat(R.deco.home);
let shopTab="jour";
function shopSheet(tab){if(tab)shopTab=tab;
  const own=Object.keys(DECO).filter(k=>R.deco.inv[k]||allDeco().some(d=>d.k===k)),has=h=>own.some(k=>!!DECO[k].home===h);
  const card=(k,buy)=>{const o=DECO[k],sold=soldToday(k),can=o.b?bellsN()>=o.b:cafeCoins()>=o.p,n=R.deco.inv[k]||0,on=allDeco().filter(d=>d.k===k).length;
    return `<div class="opt${o.b?" rare":""}"><span class="thumb dthumb">${dSvg(k)}</span><div class="txt"><strong>${o.name}</strong><span>${o.desc}${o.fav&&!buy?" Quelqu'un l'adore, on dirait…":""}</span>${buy?(o.home?`<span class="dcount">Pour la maison</span>`:""):`<span class="dcount">${on?`${on} posé${on>1?"s":""}`:""}${on&&n?" · ":""}${n?`${n} en réserve`:""}</span>`}</div>
      ${buy?`<button class="btn" data-dbuy="${k}" type="button" ${sold||!can?"disabled":""}>${sold?"Acheté":dPrice(o)}</button>`:n?`<button class="btn" data-dput="${k}" type="button">Poser</button>`:""}</div>`};
  const body=shopTab==="jour"?`<p class="sub">Nouveaux objets ${untilMidnight()}. Chaque objet revient régulièrement : rien n'est perdu pour toujours.</p>${shopToday().map(k=>card(k,1)).join("")}`
    :shopTab==="mes"?(own.length?`${has(false)?`<button class="btn big wide" data-deco="out" type="button">Décorer la clairière</button>`:""}${has(true)&&houseOpen()?`<button class="btn big wide" data-deco="home" type="button">Décorer la maison</button>`:""}<p class="sub">Fais glisser les objets du doigt pour les placer où tu veux.</p>${own.map(k=>card(k,0)).join("")}`:`<p class="sub">Tu n'as encore aucun objet. Va voir la boutique du jour !</p>`)
    :objList();
  openSheet(`<h2>Boutique</h2><div class="wallet"><span>${coinIcon()} ${cafeCoins()}</span><span>${bellSVG} ${bellsN()}</span><span>${acornSVG()} ${R.glands}</span></div>
    <div class="tabs">${[["jour","Du jour"],["mes","Mes objets"],["refuge","Refuge"]].map(([k,n])=>`<button class="tab${shopTab===k?" on":""}" data-dtab="${k}" type="button">${n}</button>`).join("")}</div>${body}
    <p class="sub">Les pièces se gagnent au Café, les clochettes avec les étoiles du Café, ses quêtes et les histoires du refuge.</p>`)}

/* ---------- dans la scène et dans la maison ---------- */
// les objets du dehors vivent dans #actors ; ceux de la maison dans son calque (houseEl, maison.js), refaits à chaque visite
const decoEls={};let hdHost=null,hdEls={};
const dk=d=>DECO[d.k].w/100;
function decoSpots(){for(let i=SPOTS.length-1;i>=0;i--)if(SPOTS[i].deco){delete SPOT[SPOTS[i].id];SPOTS.splice(i,1)}
  if(!(decoMode&&dWhere==="out"))for(const d of R.deco.out){const o=DECO[d.k];if(!o.seat)continue;const s=o.seat,sp={id:"dc"+d.u,x:d.x+(d.f?-s.dx:s.dx),y:d.y+s.dy,z:d.y+1,poses:s.poses,deco:d.k,fav:o.fav};
    SPOTS.push(sp);SPOT[sp.id]=sp;PLACE[sp.id]=s.dy<-4?`sur ${dThe(d.k)}`:`près ${dOf(d.k)}`} // pendant qu'on décore dehors, personne ne s'installe sur les objets
  // un renard dont l'endroit a disparu (objet rangé ou déplacé) va ailleurs
  for(const f of foxes)if(f.spot&&f.spot.deco!==undefined&&!SPOT[f.spot.id]){const fs=SPOTS.filter(s=>!taken(s)&&!s.bowl&&!s.lamp&&!s.obj&&!s.deco);place(f,fs[Math.floor(Math.random()*fs.length)]||SPOT.g3)}}
const dThe=k=>({coussin:"le coussin",champis:"le champignon",banc:"le banc",puits:"le puits",hamac:"le hamac",brouette:"la brouette"})[k]||"l'objet";
const dOf=k=>({lanterne:"du lampadaire",nichoir:"du nichoir",moulin:"du moulin",tente:"de la tente",longuevue:"de la longue-vue",arche:"de l'arche",carillon:"du carillon",fontaine:"de la fontaine",lampions:"des lampions",topiaire:"du renard en buis"})[k]||"de l'objet";
function drawList(list,els,host){
  for(const u in els)if(!list.some(d=>d.u==u)){els[u].el.remove();els[u].fr&&els[u].fr.remove();delete els[u]}
  for(const d of list){const o=DECO[d.k];let e=els[d.u];
    if(!e){e=els[d.u]={el:document.createElement("div")};e.el.className="deco";e.el.innerHTML=dSvg(d.k);e.el.onpointerdown=ev=>decoDown(ev,d.u);host.appendChild(e.el);
      if(o.front){e.fr=document.createElement("div");e.fr.className="deco front";e.fr.innerHTML=dSvg(d.k,"front");host.appendChild(e.fr)}}
    // un tapis passe sous tout le monde ; le devant d'un objet (canapé, hamac) passe devant son renard
    for(const el of [e.el,e.fr].filter(Boolean)){el.style.cssText=pc(d.x,d.y)+`;width:${o.w/W*100}%;z-index:${d.k==="tapisrond"?1:Math.round(d.y)+(el===e.fr?2:0)}`;el.classList.toggle("flipped",!!d.f)}
    e.el.classList.toggle("sel",decoMode&&decoSel===d.u);e.el.classList.toggle("bad",decoMode&&decoSel===d.u&&!decoOk(d))}}
function drawDeco(){drawList(R.deco.out,decoEls,$("actors"));
  if(hdHost!==houseEl){hdHost=houseEl;hdEls={}}
  if(houseEl)drawList(R.deco.home,hdEls,houseEl);
  drawDTool()}
// les lumières du soir (lampadaire, lampions), dans la couche des lueurs, au-dessus de la nuit
function decoGlow(){if(!dark())return "";let s="";
  for(const d of R.deco.out){const o=DECO[d.k];for(const [gx,gy] of o.gl||[]){const x=d.x+(d.f?-gx:gx)*dk(d),y=d.y+gy*dk(d);
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(o.gl.length>1?14:22)}" fill="url(#dGl)"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${o.gl.length>1?2.4:3.2}" fill="#fff6d0"/>`}}
  return s&&`<defs><radialGradient id="dGl"><stop offset="0" stop-color="#ffe7a3" stop-opacity=".85"/><stop offset=".4" stop-color="#ffd27a" stop-opacity=".35"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>${s}`}

/* ---------- les renards sur les objets, et les photos ---------- */
function snapFav(id,k,host){if(R.photos.some(p=>p.deco===k&&p.id===id))return false;
  R.photos.push({id,deco:k,t:Date.now()});save();
  const fl=document.createElement("div");fl.className="snapflash";host.appendChild(fl);setTimeout(()=>fl.remove(),700);
  toast(`Clic ! ${FOX[id].name} adore son ${DECO[k].name.toLowerCase()}. La photo est dans l'album.`);return true}
// dehors : un renard sur son objet préféré, le toucher prend une photo (une par objet)
function snapDeco(f){const sp=f.spot;if(!sp||!sp.deco||sp.fav!==f.id||f.walk)return false;return snapFav(f.id,sp.deco,$("scene"))}
// dans la maison : qui s'installe sur les objets (le préféré d'abord s'il est là, sinon quelqu'un une fois sur deux ; le canapé a trois places)
function houseDecoSeats(ids,night){const rest=ids.slice(),seated=[];
  for(const d of R.deco.home){const o=DECO[d.k];if(!o.seat)continue;
    [o.seat,...(o.more||[]).map(([dx,dy])=>({dx,dy,poses:o.seat.poses}))].forEach((s,i)=>{
      let id=i===0&&rest.includes(o.fav)?o.fav:(i>0||Math.random()<.5)?rest.find(x=>x!==o.fav):null;if(!id)return;
      rest.splice(rest.indexOf(id),1);seated.push({id,k:d.k,x:d.x+(d.f?-s.dx:s.dx),y:d.y+s.dy,z:d.y+1,pose:night&&s.poses.includes("sleep")?"sleep":s.poses[(i+id.length)%s.poses.length]})})}
  return {seated,rest}}
function drawHouseDeco(seated){
  for(const s of seated){const el=document.createElement("div");el.className="fox hdfox";el.innerHTML=`<div class="flip">${foxArt(FOX[s.id],{pose:s.pose})}</div>`;
    el.style.cssText=pc(s.x,s.y)+`;z-index:${Math.round(s.z)}`;
    el.onpointerdown=e=>{e.stopPropagation();if(decoMode)return;if(s.id===DECO[s.k].fav&&snapFav(s.id,s.k,houseEl))return;
      const r=pet(s.id);toast(r?`${FOX[s.id].name} est ravi (+1 cœur, +1 gland).`:`${FOX[s.id].name} se prélasse.`);if(r)renderHud()};
    houseEl.appendChild(el)}
  drawDeco()}
// la photo : l'objet et son renard préféré, cadrés pour tenir dans l'image (le renard à sa place : dessus, dedans ou à côté)
function decoPhoto(p){const o=DECO[p.deco],s=o.seat,k=o.w/100,sc=Math.min(1.4,82/Math.max(o.h*k,52-s.dy),104/Math.max(o.w,54+Math.abs(s.dx)*2)),
    ix=60-s.dx*sc/2,base=95,L=`stroke="${INK}" stroke-width="${dLw(o.w)}" stroke-linejoin="round" stroke-linecap="round"`,
    box=part=>`<svg x="${(ix-o.w*sc/2).toFixed(1)}" y="${(base-o.h*k*sc).toFixed(1)}" width="${(o.w*sc).toFixed(1)}" height="${(o.h*k*sc).toFixed(1)}" viewBox="-50 -${o.h} 100 ${o.h}" overflow="visible">${o[part](L)}</svg>`;
  const back=o.home?`<rect width="120" height="100" fill="#e6b886"/>${[14,40,66,92,118].map(x=>`<path d="M${x} 0 V70" stroke="#c99a6a" stroke-width="1.6"/>`).join("")}<rect y="70" width="120" height="30" fill="#b9814a"/><path d="M0 70 H120" stroke="#7a4f34" stroke-width="2"/>`
    :`<rect width="120" height="100" fill="#cfe3a8"/><path d="M0 30 Q30 22 60 28 Q90 22 120 30 V0 H0Z" fill="#8dbd86"/>`;
  return `<svg viewBox="0 0 120 100" aria-hidden="true">${back}${box("art")}${foxAt(p.id,ix+s.dx*sc,base+s.dy*sc,54*sc,{pose:s.poses[0],expr:"joy"})}${o.front?box("front"):""}</svg>`}

/* ---------- le mode Décorer ---------- */
let decoMode=false,decoSel=null,dDrag=null,dWhere="out";
const hbusy=()=>hobjs().map(k=>{const [x,y,s]=HOBJ[k].at;return [x+100*s,y+120*s]});
// où on peut poser. Dehors : dans l'herbe, pas dans la mare, ni sur le chemin, la gamelle, la souche, le tas de feuilles,
// le banc ou un objet du refuge. Dans la maison : au mur (pas sur la cheminée ni la fenêtre), ou par terre hors du tapis
// (c'est le coin dodo), des meubles de Copeau et de l'âtre (le feu doit rester visible).
function decoOk(d){const {x,y}=d,o=DECO[d.k];if(x<14||x>386||x-o.w/2<2||x+o.w/2>398)return false; // l'objet tient en entier dans l'image
  if(o.home){
    if(o.wall){if(y<120||y>252||(x+o.w/2>116&&x-o.w/2<284)||Math.hypot(x-65,y-190)<50)return false}
    else{if(y<318||y>474||(y<358&&x>128&&x<272)||((x-200)/178)**2+((y-412)/62)**2<1||hbusy().some(([a,b])=>Math.hypot(x-a,y-b)<34))return false}
    return !R.deco.home.some(q=>q.u!==d.u&&!!DECO[q.k].wall===!!o.wall&&Math.hypot(q.x-x,q.y-y)<12)}
  if(y<266||y>474)return false;
  if(((x-95)/88)**2+((y-420)/44)**2<1)return false; // la mare
  if(Math.abs(x-200)<15)return false; // le chemin de pierres
  const no=[[240,268,24],[85,304,32],[322,336,30],[284,404,22],[316,404,22],...Object.keys(R.obj).filter(k=>OBJS[k].spot.y>200).map(k=>[OBJS[k].spot.x,OBJS[k].spot.y,26])];
  if(no.some(([a,b,r])=>Math.hypot(x-a,y-b)<r))return false;
  return !R.deco.out.some(o=>o.u!==d.u&&Math.hypot(o.x-x,o.y-y)<12)}
const scenePt=e=>{const r=$("scene").getBoundingClientRect();return {x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}};
const findDeco=u=>allDeco().find(o=>o.u===u);
function decoDown(e,u){e.stopPropagation();const d=findDeco(u);if(!d)return;
  if(!decoMode){const o=DECO[d.k],msg=`${o.name}. ${o.fav?(R.photos.some(p=>p.deco===d.k)?`${FOX[o.fav].name} l'adore.`:"Quelqu'un l'adore, on dirait… Reviens voir qui s'y installe."):o.desc}`;if(houseEl)toast(msg);else log(msg);return}
  decoSel=u;const p=scenePt(e);dDrag={u,dx:d.x-p.x,dy:d.y-p.y,x0:d.x,y0:d.y,moved:0};e.currentTarget.setPointerCapture(e.pointerId);drawDeco()}
function decoMove(e){if(!dDrag)return;const d=findDeco(dDrag.u),p=scenePt(e);
  d.x=Math.round(p.x+dDrag.dx);d.y=Math.round(p.y+dDrag.dy);dDrag.moved=1;drawDeco()}
function decoUp(){if(!dDrag)return;const d=findDeco(dDrag.u);
  if(!decoOk(d)){d.x=dDrag.x0;d.y=dDrag.y0;if(dDrag.moved)toast(DECO[d.k].home?(DECO[d.k].wall?"Pas ici : accroche-le au mur, loin de la cheminée.":"Pas ici : le tapis, c'est pour dormir."):"Pas ici : trouve un coin d'herbe libre.")}
  dDrag=null;save();drawDeco()}
addEventListener("pointermove",decoMove);addEventListener("pointerup",decoUp);addEventListener("pointercancel",decoUp);
// la petite barre au-dessus de l'objet choisi : retourner, ranger
function drawDTool(){let t=$("dtool");const d=decoMode&&findDeco(decoSel);
  if(!d){if(t)t.hidden=true;return}
  if(!t){t=document.createElement("div");t.id="dtool";t.innerHTML=`<button data-dt="flip" type="button" aria-label="Retourner"><svg viewBox="0 0 24 24"><path d="M9 6 L3 12 L9 18 M15 6 L21 12 L15 18 M3 12 H21" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button data-dt="away" type="button" aria-label="Ranger"><svg viewBox="0 0 24 24"><path d="M4 9 H20 L18.5 20 H5.5Z M3 6 H21 V9 H3Z M10 13 H14" fill="#f6d9b8" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></svg></button>`;
    t.onpointerdown=e=>e.stopPropagation();t.onclick=e=>{const b=e.target.closest("button");if(b)decoTool(b.dataset.dt)};$("scene").appendChild(t)}
  t.hidden=!!dDrag;t.style.cssText=pc(Math.max(36,Math.min(364,d.x)),Math.max(48,d.y-DECO[d.k].h*dk(d)-4))}
function decoTool(a){const d=findDeco(decoSel);if(!d)return;
  if(a==="flip")d.f=d.f?0:1;else{const L=DECO[d.k].home?R.deco.home:R.deco.out;L.splice(L.indexOf(d),1);R.deco.inv[d.k]=(R.deco.inv[d.k]||0)+1;decoSel=null}
  save();drawDeco();drawDBar()}
// poser un objet de la réserve : au coin libre le plus proche du centre, loin des autres objets, puis on le déplace du doigt
function decoAdd(k){if(!R.deco.inv[k])return;const o=DECO[k],L=o.home?R.deco.home:R.deco.out,d={u:++R.deco.n,k,x:200,y:340,f:0};let best=null,bd=1e9;
  const [y0,y1,cx,cy]=!o.home?[280,470,200,350]:o.wall?[130,250,330,180]:[320,472,200,336];
  for(let y=y0;y<=y1;y+=8)for(let x=24;x<=376;x+=8){d.x=x;d.y=y;if(!decoOk(d))continue;
    const near=Math.min(99,...L.filter(q=>!!DECO[q.k].wall===!!o.wall).map(q=>Math.hypot(q.x-x,(q.y-y)*1.6))),c=Math.hypot(x-cx,y-cy)+(near<64?(64-near)*20:0);if(c<bd){bd=c;best=[x,y]}}
  if(best)[d.x,d.y]=best;
  R.deco.inv[k]--;if(!R.deco.inv[k])delete R.deco.inv[k];L.push(d);decoSel=d.u;save();drawDeco();drawDBar()}
function drawDBar(){const ks=Object.keys(R.deco.inv).filter(k=>!!DECO[k].home===(dWhere==="home"));
  $("decobar").innerHTML=`<div class="dinv">${ks.length?ks.map(k=>`<button class="dchip" data-dadd="${k}" type="button">${dSvg(k)}<b>${R.deco.inv[k]}</b></button>`).join(""):`<span class="sub">Touche un objet pour le déplacer.</span>`}</div><button class="btn" data-dend="1" type="button">Terminé</button>`}
// k : un objet à poser tout de suite ; w : "out" (la clairière) ou "home" (la maison), sinon celui de l'objet
function decoStart(k,w){w=k?(DECO[k].home?"home":"out"):w||"out";
  if(w==="home"&&!houseOpen()){toast("La maison n'est pas encore ouverte.");return}
  closeSheet();dWhere=w;
  if(w==="home"){if(!houseEl)enterHouse();houseEl.classList.add("decoing");houseEl.querySelectorAll(".hdfox").forEach(x=>x.remove())}
  else{if(houseEl)leaveHouse();
    for(const f of foxes)if(f.spot&&f.spot.deco){const fs=SPOTS.filter(s=>!taken(s)&&!s.bowl&&!s.lamp&&!s.obj&&!s.deco);place(f,fs[Math.floor(Math.random()*fs.length)]||SPOT.g3)}}
  decoMode=true;decoSel=null;$("scene").classList.add("decoing");
  decoSpots();$("decobar").hidden=false;document.querySelector(".actions").hidden=true;$("goal").classList.add("off");
  log(w==="home"?"Fais glisser les objets du doigt : au mur, ou par terre autour du tapis.":"Fais glisser les objets du doigt. Touche-en un pour le retourner ou le ranger.");drawDBar();if(k)decoAdd(k);drawDeco()}
function decoEnd(){decoMode=false;decoSel=null;$("scene").classList.remove("decoing");$("decobar").hidden=true;document.querySelector(".actions").hidden=false;$("goal").classList.remove("off");
  if(dWhere==="home"&&houseEl){leaveHouse();enterHouse()}
  decoSpots();drawDeco();drawGlow();log(dWhere==="home"?"La maison est toute belle.":"Ta clairière est toute belle.")}
$("decobar").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.dadd)decoAdd(b.dataset.dadd);else if(b.dataset.dend)decoEnd()};
$("scene").addEventListener("pointerdown",()=>{if(decoMode&&decoSel!=null&&!dDrag){decoSel=null;drawDeco()}});
decoSpots();drawDeco();
