/* Kitsune Café : icônes, pièce, bonbon, la salle (véranda) et le comptoir. */
/* ---------- dessins ---------- */
const K=`stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;
const ICON={
  bin:`<path d="M9 12 H31 L28 35 H12Z" fill="#f59a8b" ${K}/><path d="M6 11 H34 M16 7 H24" fill="none" ${K}/><path d="M16 17 L17 30 M24 17 L23 30" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  cafe:`<ellipse cx="18" cy="34" rx="14" ry="3" fill="#f7b7c3" ${K}/><path d="M28 16 Q36 16 35 22 Q34 28 27 27" fill="none" ${K}/><path d="M7 14 H29 V25 Q29 33 18 33 Q7 33 7 25Z" fill="#fff" ${K}/><ellipse cx="18" cy="14" rx="11" ry="2.8" fill="#8a5a3a" ${K}/><path d="M14 9 q-2 -3 0 -6 M21 9 q-2 -3 0 -6" fill="none" stroke="#cdbfc7" stroke-width="2" stroke-linecap="round"/><path d="M16 26 c-1.5-1.3-3-2.3-3-3.5 a1.5 1.5 0 0 1 3-.5 a1.5 1.5 0 0 1 3 .5 c0 1.2-1.5 2.2-3 3.5z" fill="#f6a5b4"/>`,
  croissant:`<ellipse cx="20" cy="33" rx="15" ry="2.6" fill="#f7b7c3" opacity=".7"/>${[[6.5,26,4.6,3.4,-48,"#e39a4c"],[33.5,26,4.6,3.4,48,"#e39a4c"],[11.5,20,6.6,5.4,-38,"#f0ad5a"],[28.5,20,6.6,5.4,38,"#f0ad5a"],[20,17,7.6,8.6,0,"#f7bd66"]].map(([x,y,rx,ry,a,c])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" transform="rotate(${a} ${x} ${y})" ${K}/><path d="M${x-rx*.45} ${y-ry*.35} q${rx*.45} ${-ry*.45} ${rx*.9} 0" fill="none" stroke="#ffe0a3" stroke-width="1.8" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/>`).join("")}<circle cx="17" cy="12.5" r="1.6" fill="#fff" opacity=".8"/>`,
  the:`<path d="M30 17 Q37 17 36 22 Q35 27 29 26" fill="none" ${K}/><path d="M5 15 H31 Q31 32 18 32 Q5 32 5 15Z" fill="#a9d68f" ${K}/><ellipse cx="18" cy="15" rx="13" ry="3" fill="#e8b06a" ${K}/><path d="M24 15 L27 5" fill="none" stroke="${INK}" stroke-width="1.6"/><rect x="24" y="2" width="7" height="6" rx="1.5" fill="#f2c75c" ${K}/>`,
  cookie:`<circle cx="20" cy="21" r="14" fill="#e0a868" ${K}/><circle cx="14" cy="17" r="2.3" fill="#6a4026"/><circle cx="24" cy="15" r="2" fill="#6a4026"/><circle cx="22" cy="25" r="2.4" fill="#6a4026"/><circle cx="14" cy="27" r="1.8" fill="#6a4026"/><circle cx="28" cy="22" r="1.6" fill="#6a4026"/>`,
  choco:`<path d="M30 15 Q38 16 36 23 Q34 29 28 27" fill="none" ${K}/><path d="M6 12 L9 33 Q18 36 27 33 L30 12Z" fill="#f59a8b" ${K}/><ellipse cx="18" cy="12" rx="12" ry="3" fill="#8a5a3a" ${K}/><rect x="12" y="7" width="7" height="6" rx="2" fill="#fff" ${K}/><rect x="19" y="8" width="6" height="5" rx="2" fill="#ffd6e0" ${K}/>`,
  smoothie:`<path d="M24 3 L20 18" fill="none" stroke="#7fc6e8" stroke-width="3.4" stroke-linecap="round"/><path d="M9 12 H31 L27 35 H13Z" fill="#f6a5c8" ${K}/><path d="M10.5 19 H29.5" fill="none" stroke="#fff" stroke-width="2.4" opacity=".7"/><circle cx="29" cy="12" r="4" fill="#9a6ac0" ${K}/>`,
  gateau:`<path d="M4 30 L36 30 L36 20 L4 14Z" fill="#fff5e8" ${K}/><path d="M4 22 L36 25" fill="none" stroke="#f6a5b4" stroke-width="3"/><path d="M4 14 L36 20 L36 17 L4 10Z" fill="#f6a5c8" ${K}/><circle cx="26" cy="13" r="3.6" fill="#e2708e" ${K}/><circle cx="19" cy="11" r="3" fill="#9a6ac0" ${K}/>`,
  burnt:`<path d="M3 27 Q6 11 20 9 Q34 11 37 27 Q31 23 27 27 Q23 17 20 17 Q17 17 13 27 Q9 23 3 27Z" fill="#5a4048" ${K}/><path d="M12 6 q-3 -3 0 -5 M22 6 q-3 -3 0 -5" fill="none" stroke="#8a7a80" stroke-width="2" stroke-linecap="round"/>`,
  ennui:`<g fill="${INK}"><circle cx="11" cy="22" r="2.8"/><circle cx="20" cy="22" r="2.8"/><circle cx="29" cy="22" r="2.8"/></g>`,
  coeur:`<path d="M20 34 C8 26 4 20 4 14 a7.5 7.5 0 0 1 16 -2 a7.5 7.5 0 0 1 16 2 c0 6 -4 12 -16 20z" fill="#f47f9a" ${K}/>`,
  plantes:`<path d="M20 22 Q8 18 6 6 Q18 8 20 22 Q22 8 34 6 Q32 18 20 22Z" fill="#8fca7a" ${K}/><path d="M10 22 H30 L27 36 H13Z" fill="#f59a8b" ${K}/>`,
  guirlande:`<path d="M2 8 Q20 24 38 8" fill="none" ${K}/>${[[8,14,"#f2c75c"],[15,18,"#f47f9a"],[22,18,"#9ec3ef"],[29,15,"#8fca7a"]].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.6" fill="${c}" ${K}/>`).join("")}`,
  coussins:`<rect x="6" y="20" width="28" height="12" rx="6" fill="#c9b8f2" ${K}/><path d="M12 32 V38 M28 32 V38" fill="none" ${K}/><ellipse cx="20" cy="20" rx="14" ry="5" fill="#ffc7d8" ${K}/>`,
  disque:`<rect x="4" y="18" width="32" height="16" rx="3" fill="#c8946a" ${K}/><ellipse cx="18" cy="18" rx="12" ry="4" fill="#3d2a35" ${K}/><circle cx="18" cy="18" r="2" fill="#f47f9a"/><path d="M30 18 L26 10" fill="none" ${K}/><path d="M30 6 v8 l5 -2" fill="none" ${K}/>`,
  plateau:`<ellipse cx="20" cy="26" rx="17" ry="7" fill="#d8ccd4" ${K}/><ellipse cx="20" cy="24" rx="14" ry="5" fill="#fff" ${K}/>`,
  double:`<path d="M5 15 H17 V27 Q17 31 11 31 Q5 31 5 27Z" fill="#fff" ${K}/><path d="M22 15 H34 V27 Q34 31 28 31 Q22 31 22 27Z" fill="#fff" ${K}/><path d="M4 8 H35 V12 H4Z" fill="#9ec3ef" ${K}/>`,
  comptoir1:`<rect x="3" y="16" width="34" height="8" rx="3" fill="#c8946a" ${K}/><rect x="5" y="24" width="30" height="12" fill="#e8b07a" ${K}/>`,
  comptoir2:`<rect x="1" y="14" width="38" height="8" rx="3" fill="#c8946a" ${K}/><rect x="3" y="22" width="34" height="14" fill="#e8b07a" ${K}/><path d="M14 22 V36 M26 22 V36" fill="none" ${K}/>`,
  fourpro:`<rect x="5" y="8" width="30" height="26" rx="4" fill="#d8ccd4" ${K}/><rect x="9" y="15" width="22" height="14" rx="2" fill="#f7b48b" ${K}/><path d="M12 4 l2 3 M20 3 l0 4 M28 4 l-2 3" fill="none" stroke="#f47f7f" stroke-width="2.4" stroke-linecap="round"/>`,
  barista:`<path d="M10 34 L14 10 H26 L30 34Z" fill="#fff" ${K}/><path d="M14 10 Q20 2 26 10" fill="none" ${K}/><path d="M16 20 h8 M15 26 h10" fill="none" ${K}/>`,
  serveur:`<circle cx="20" cy="20" r="14" fill="#f6ad74" ${K}/><path d="M12 28 Q20 34 28 28 L28 36 H12Z" fill="#fff" ${K}/><circle cx="15" cy="18" r="1.8" fill="${INK}"/><circle cx="25" cy="18" r="1.8" fill="${INK}"/>`,
  machines:`<rect x="3" y="12" width="15" height="20" rx="3" fill="#a9d68f" ${K}/><rect x="22" y="12" width="15" height="20" rx="3" fill="#f6a5c8" ${K}/><path d="M7 32 v4 M14 32 v4 M26 32 v4 M33 32 v4" fill="none" ${K}/><circle cx="10.5" cy="20" r="3" fill="#fff" ${K}/><circle cx="29.5" cy="20" r="3" fill="#fff" ${K}/><path d="M2 8 H38" fill="none" ${K}/>`,
  plateau5:`<ellipse cx="20" cy="27" rx="19" ry="8" fill="#d8ccd4" ${K}/><ellipse cx="20" cy="25" rx="16" ry="6" fill="#fff" ${K}/>${[6,13,20,27,34].map((x,i)=>`<circle cx="${x}" cy="${i%2?21:24}" r="3" fill="${["#f2b45a","#f59a8b","#a9d68f","#f6a5c8","#e0a868"][i]}" stroke="${INK}" stroke-width="1.6"/>`).join("")}`,
  four2:`<rect x="3" y="8" width="34" height="28" rx="5" fill="#c8946a" ${K}/><path d="M6 20 Q20 4 34 20Z" fill="#e8b07a" ${K}/><rect x="10" y="22" width="20" height="10" rx="3" fill="#f7b48b" ${K}/><path d="M15 6 q-2 -3 0 -5 M25 6 q-2 -3 0 -5" fill="none" stroke="#cdbfc7" stroke-width="2" stroke-linecap="round"/>`,
  fauteuils:`<rect x="5" y="10" width="30" height="18" rx="8" fill="#f6a5b4" ${K}/><rect x="2" y="18" width="9" height="14" rx="4" fill="#f59a8b" ${K}/><rect x="29" y="18" width="9" height="14" rx="4" fill="#f59a8b" ${K}/><rect x="10" y="22" width="20" height="9" rx="3" fill="#ffd6e0" ${K}/><path d="M9 32 v5 M31 32 v5" fill="none" ${K}/>`,
  lanternes:`<path d="M20 2 V8" fill="none" ${K}/><ellipse cx="20" cy="21" rx="12" ry="13" fill="#f59a8b" ${K}/><path d="M14 9 Q10 21 14 33 M26 9 Q30 21 26 33 M20 8 V34" fill="none" stroke="${INK}" stroke-width="1.6"/><rect x="15" y="6" width="10" height="4" rx="1" fill="#f2c75c" ${K}/><rect x="15" y="32" width="10" height="4" rx="1" fill="#f2c75c" ${K}/>`,
  lait:`<path d="M12 10 L10 6 H26 L24 10 L27 32 Q27 35 24 35 H12 Q9 35 9 32Z" fill="#fff" ${K}/><path d="M10 18 H26" stroke="#9ec3ef" stroke-width="3"/><path d="M26 14 Q33 14 32 21 Q31 27 26 26" fill="none" ${K}/>`,
  chantilly:`<path d="M10 34 L14 18 H26 L30 34Z" fill="#9ec3ef" ${K}/><path d="M13 19 Q10 12 16 11 Q16 4 20 4 Q24 4 24 11 Q30 12 27 19Z" fill="#fffaf2" ${K}/><path d="M17 12 q3 -2 6 0" fill="none" stroke="#e8dcd6" stroke-width="1.6" stroke-linecap="round"/>`,
  chest:`<rect x="4" y="16" width="32" height="20" rx="3" fill="#c8946a" ${K}/><path d="M4 18 Q4 6 20 6 Q36 6 36 18Z" fill="#e0a868" ${K}/><rect x="16" y="15" width="8" height="9" rx="2" fill="#f2c75c" ${K}/><path d="M4 18 H36" fill="none" ${K}/>`
};
/* Recettes de saison : même clé, même prix, même cuisson, seuls le nom et le dessin changent. */
const tart=(fill,top)=>`<path d="M3 21 Q4 33 20 33 Q36 33 37 21Z" fill="#e8b46a" ${K}/><path d="M7 25 q2 3 4 0 q2 3 4 0 q2 3 4 0 q2 3 4 0 q2 3 4 0 q2 3 4 0" fill="none" stroke="#c98a45" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="20" cy="20" rx="17" ry="6.5" fill="#f2c27a" ${K}/><ellipse cx="20" cy="19.5" rx="13" ry="4.2" fill="${fill}" ${K}/>${top}`;
const cup=(body,liq,deco="")=>`<path d="M30 17 Q37 17 36 22 Q35 27 29 26" fill="none" ${K}/><path d="M5 15 H31 Q31 32 18 32 Q5 32 5 15Z" fill="${body}" ${K}/><ellipse cx="18" cy="15" rx="13" ry="3" fill="${liq}" ${K}/>${deco}`;
const glass=(liq,top="")=>`<path d="M9 9 H31 L28 35 H12Z" fill="#fff" ${K}/><path d="M10.4 17 H29.6 L28 35 H12Z" fill="${liq}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M14 20 v10" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>${top}`;
const slice=(sponge,cream,top,deco="")=>`<path d="M4 30 L36 30 L36 20 L4 14Z" fill="${sponge}" ${K}/><path d="M4 22 L36 25" fill="none" stroke="${cream}" stroke-width="3"/><path d="M4 14 L36 20 L36 17 L4 10Z" fill="${top}" ${K}/>${deco}`;
Object.assign(ICON,{
  "cookie@printemps":tart("#7d6fc4",[[13,18],[20,16.5],[27,18.5],[17,21.5],[24,21.5]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.7" fill="#5a5aa8" stroke="${INK}" stroke-width="1.4"/><circle cx="${x-.8}" cy="${y-.9}" r=".8" fill="#fff"/>`).join("")+`<path d="M24 12 q5 -5 9 -1 q-4 4 -9 1Z" fill="#8fca7a" stroke="${INK}" stroke-width="1.4"/>`),
  "croissant@ete":tart("#ffd6e0",[[12,19],[20,16],[28,19],[20,22]].map(([x,y])=>`<path d="M${x-4} ${y-1} Q${x} ${y-5} ${x+4} ${y-1} Q${x+3} ${y+4} ${x} ${y+4} Q${x-3} ${y+4} ${x-4} ${y-1}Z" fill="#f2546a" stroke="${INK}" stroke-width="1.4"/><circle cx="${x-1}" cy="${y+.5}" r=".6" fill="#ffe9a8"/><circle cx="${x+1.4}" cy="${y+1.6}" r=".6" fill="#ffe9a8"/>`).join("")),
  "croissant@automne":tart("#f2c060",`<path d="M9 16 L27 23 M15 15 L33 22 M11 22 L25 15 M19 23 L31 17" stroke="#e8a94e" stroke-width="3.4" stroke-linecap="round"/><path d="M9 16 L27 23 M15 15 L33 22 M11 22 L25 15 M19 23 L31 17" stroke="${INK}" stroke-width="1" stroke-linecap="round" opacity=".5"/>`),
  "croissant@hiver":tart("#f0954a",`<path d="M14 18 Q14 10 20 9 Q26 10 26 18 Q20 16 14 18Z" fill="#fff" stroke="${INK}" stroke-width="1.6"/><path d="M16 15 q4 -3 8 0" fill="none" stroke="#e8d8cc" stroke-width="1.4"/><circle cx="11" cy="20" r=".9" fill="#a8603a"/><circle cx="29" cy="20" r=".9" fill="#a8603a"/><circle cx="26" cy="22" r=".9" fill="#a8603a"/>`),
  "the@printemps":cup("#ffd6e0","#f4b6c2",`<g transform="translate(18 24)">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-3.4" rx="2.4" ry="3.4" fill="#fff" stroke="${INK}" stroke-width="1.2" transform="rotate(${a})"/>`).join("")}<circle r="1.6" fill="#f2c75c"/></g>`),
  "the@ete":glass("#f2b45a",`<rect x="14" y="11" width="7" height="7" rx="1.6" fill="#e6f6ff" stroke="${INK}" stroke-width="1.6" transform="rotate(-12 17 14)"/><rect x="20" y="13" width="6" height="6" rx="1.6" fill="#e6f6ff" stroke="${INK}" stroke-width="1.6" transform="rotate(10 23 16)"/><circle cx="30" cy="9" r="5" fill="#f7e36a" stroke="${INK}" stroke-width="1.8"/><path d="M30 5 V13 M26 9 H34" stroke="#e6c43a" stroke-width="1.2"/><path d="M24 2 L21 20" stroke="#7fc6e8" stroke-width="3" stroke-linecap="round"/>`),
  "the@automne":cup("#e8c9a8","#c8946a",`<path d="M22 6 L28 15" stroke="#a8603a" stroke-width="3.2" stroke-linecap="round"/><path d="M12 24 l2 -2.4 l2 2.4 l-2 2.4Z M14 21.6 v4.8 M11.6 24 h4.8" fill="#8a5a3a" stroke="#8a5a3a" stroke-width="1.2"/>`),
  "the@hiver":cup("#f7d77a","#f2b45a",`<path d="M26 4 L21 15" stroke="#c8946a" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="27" cy="5" rx="4" ry="3" fill="#f2b84a" stroke="${INK}" stroke-width="1.6" transform="rotate(25 27 5)"/><path d="M13 22 q2 3 4 0 q2 3 4 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`),
  "cookie@ete":`<circle cx="20" cy="21" r="14" fill="#f7e08a" ${K}/>${[[13,16],[25,15],[15,27],[28,25]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.4" fill="#a9c94a"/>`).join("")}<circle cx="21" cy="21" r="5.4" fill="#fff7a8" stroke="${INK}" stroke-width="1.6"/><path d="M21 15.6 V26.4 M15.6 21 H26.4 M17.2 17.2 L24.8 24.8 M24.8 17.2 L17.2 24.8" stroke="#e6c43a" stroke-width="1"/>`,
  "cookie@automne":`<circle cx="20" cy="21" r="14" fill="#d9a066" ${K}/>${[[14,16],[24,14],[22,25],[13,26],[29,21]].map(([x,y],i)=>`<ellipse cx="${x}" cy="${y}" rx="3" ry="2.4" fill="#f2d29a" stroke="${INK}" stroke-width="1.3" transform="rotate(${i*40} ${x} ${y})"/>`).join("")}`,
  "cookie@hiver":`<path d="M20 4 L24.5 14 L35 15 L27 22 L29.5 33 L20 27.5 L10.5 33 L13 22 L5 15 L15.5 14Z" fill="#f2d29a" ${K}/><path d="M20 9 L23 15.5 L29.5 16.4 L24.6 20.8 L26 27.4 L20 24 L14 27.4 L15.4 20.8 L10.5 16.4 L17 15.5Z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><circle cx="20" cy="19" r="1.5" fill="#f47f9a"/><circle cx="17" cy="23" r="1.2" fill="#8fca7a"/><circle cx="23" cy="23" r="1.2" fill="#9ec3ef"/>`,
  "choco@ete":glass("#a8785a",`<path d="M9 9 Q8 2 14 3 Q16 -1 21 2 Q26 -1 28 3 Q33 3 31 9Z" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="21" cy="1.4" r="2.8" fill="#e2546e" stroke="${INK}" stroke-width="1.4"/><path d="M27 6 L32 -2" stroke="#f6a5b4" stroke-width="3" stroke-linecap="round"/>`),
  "smoothie@automne":`<path d="M24 3 L20 18" fill="none" stroke="#7fc6e8" stroke-width="3.4" stroke-linecap="round"/><path d="M9 12 H31 L27 35 H13Z" fill="#f2c060" ${K}/><path d="M10.5 19 H29.5" fill="none" stroke="#fff" stroke-width="2.4" opacity=".7"/><path d="M26 12 a5 5 0 0 1 9 -3 a5 5 0 0 1 -3 6Z" fill="#f59a8b" stroke="${INK}" stroke-width="1.8"/>`,
  "smoothie@hiver":`<path d="M24 3 L20 18" fill="none" stroke="#f6a5b4" stroke-width="3.4" stroke-linecap="round"/><path d="M9 12 H31 L27 35 H13Z" fill="#9a8ad6" ${K}/><path d="M10.5 19 H29.5" fill="none" stroke="#fff" stroke-width="2.4" opacity=".7"/><circle cx="28" cy="11" r="3" fill="#5a5aa8" ${K}/><circle cx="32" cy="13" r="2.6" fill="#5a5aa8" ${K}/>`,
  "gateau@ete":slice("#fff5e8","#fff",`#f6a5b4`,[[10,13],[18,14.5],[26,16],[33,17.5]].map(([x,y])=>`<path d="M${x-3} ${y} Q${x} ${y-4} ${x+3} ${y} Q${x+2} ${y+3} ${x} ${y+3} Q${x-2} ${y+3} ${x-3} ${y}Z" fill="#f2546a" stroke="${INK}" stroke-width="1.3"/>`).join("")+`<path d="M8 27 Q10 23 12 27 M18 28 Q20 24 22 28 M28 29 Q30 25 32 29" fill="#f2546a" stroke="${INK}" stroke-width="1.2"/>`),
  "gateau@automne":slice("#d9a878","#fff5e8","#a8785a",`<path d="M21 11 Q20 3 26 4 Q31 6 29 13Z" fill="#8a5a3a" stroke="${INK}" stroke-width="1.6"/><path d="M22 7 q3 -1 5 1" fill="none" stroke="#c8946a" stroke-width="1.4"/><path d="M10 14 q2 -3 4 0 q2 -3 4 0" fill="none" stroke="#fff5e8" stroke-width="2"/>`),
  "gateau@hiver":`<rect x="3" y="14" width="30" height="17" rx="8.5" fill="#8a5a3a" ${K}/><ellipse cx="32" cy="22.5" rx="5" ry="8.5" fill="#c8946a" ${K}/><path d="M32 18 a3 4 0 1 1 -1 7 a1.6 2 0 1 1 1 -3.6" fill="none" stroke="#8a5a3a" stroke-width="1.6" stroke-linecap="round"/><path d="M7 19 q6 3 12 0 M10 26 q6 2 12 0" fill="none" stroke="#6a4026" stroke-width="1.6" stroke-linecap="round"/><path d="M12 14 q-6 -6 0 -8 q2 4 0 8Z M14 14 q6 -6 9 -2 q-4 3 -9 2Z" fill="#6fae5e" stroke="${INK}" stroke-width="1.4"/><circle cx="13" cy="12" r="2.2" fill="#e2546e" stroke="${INK}" stroke-width="1.2"/>${[[8,16],[20,15],[26,17],[16,29]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".9" fill="#fff"/>`).join("")}`,
  four:`<rect x="4" y="8" width="32" height="27" rx="6" fill="#f6c1cf" ${K}/><rect x="9" y="16" width="22" height="14" rx="4" fill="#ffe3c2" ${K}/><path d="M10 12 h4 M17 12 h4" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><circle cx="30" cy="12" r="1.8" fill="${INK}"/><circle cx="16" cy="22" r="1.6" fill="${INK}"/><circle cx="24" cy="22" r="1.6" fill="${INK}"/><path d="M18.5 25 q1.5 1.5 3 0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><circle cx="13" cy="25" r="1.8" fill="#f6a5b4"/><circle cx="27" cy="25" r="1.8" fill="#f6a5b4"/>`
});
Object.assign(ICON,{
  "cookie@halloween":`<path d="M9 35 V19 Q9 6 21 6 Q33 6 33 19 V35 l-4 -3.4 -4 3.4 -4 -3.4 -4 3.4 -4 -3.4Z" fill="#e0a868" ${K}/><path d="M7 33 V17 Q7 4 19 4 Q31 4 31 17 V33 l-4 -3.4 -4 3.4 -4 -3.4 -4 3.4 -4 -3.4Z" fill="#fff" ${K}/><ellipse cx="15" cy="16" rx="2.2" ry="3" fill="${INK}"/><ellipse cx="23" cy="16" rx="2.2" ry="3" fill="${INK}"/><ellipse cx="19" cy="23" rx="2.2" ry="2.8" fill="${INK}"/><circle cx="11.5" cy="20" r="2" fill="#f6a5b4"/><circle cx="26.5" cy="20" r="2" fill="#f6a5b4"/>`,
  "smoothie@halloween":glass("#9fdc7a",`<circle cx="16" cy="22" r="2.4" fill="#d6f5c0" stroke="${INK}" stroke-width="1.3"/><circle cx="22" cy="27" r="1.8" fill="#d6f5c0" stroke="${INK}" stroke-width="1.3"/><circle cx="16" cy="11" r="3.2" fill="#c8f0a8" stroke="${INK}" stroke-width="1.5"/><circle cx="22" cy="7" r="2.3" fill="#c8f0a8" stroke="${INK}" stroke-width="1.4"/><path d="M26 2 L23 20" stroke="#9a6ac0" stroke-width="3" stroke-linecap="round"/>`),
  "gateau@halloween":slice("#f2a35c","#fff5e8","#6a4a7a",`<ellipse cx="22" cy="10" rx="6" ry="4.6" fill="#f2a35c" stroke="${INK}" stroke-width="1.8"/><path d="M22 5.6 q0 -3 3 -4" fill="none" stroke="#6fae5e" stroke-width="2.4" stroke-linecap="round"/><path d="M8 13 l2 -2 2 2 M30 18 l2 -2 2 2" fill="none" stroke="#f7d77a" stroke-width="1.6" stroke-linecap="round"/>`)
});
const iconIn=(k,sea)=>(HW&&ICON[k+"@halloween"])||ICON[k+"@"+sea]||ICON[k]||"";
// options dessinées par-dessus l'article : mousse de lait (café crème), chantilly et cerise
const OPTV={
  lait:`<path d="M8 13 Q7 6 13 7 Q15 2 20 4.5 Q25 2 27 7 Q32 7 30 13Z" fill="#fffaf2" ${K}/><path d="M15.5 9.6 c1-1.4 3-1 3 .5 c0-1.5 2-1.9 3-.5 c-.5 1-2 1.8-3 2.3 c-1-.5-2.5-1.3-3-2.3z" fill="#e8c9a8"/>`,
  chantilly:`<path d="M12 13 Q10 7 15 6.5 Q15 1.5 20 2.5 Q25 1.5 25 6.5 Q30 7 28 13Z" fill="#fffaf2" ${K}/><path d="M15 9 q5 -3 10 0" fill="none" stroke="#e8dcd6" stroke-width="1.6" stroke-linecap="round"/><circle cx="20" cy="1.6" r="2.6" fill="#e2546e" stroke="${INK}" stroke-width="1.6"/>`
};
const OPTPOS={gateau:"translate(1 7)",choco:"translate(0 0)",cafe:"translate(0 0)"};
const icon=(k,sea=SEA)=>{const [b,o]=k.split("+");return `<svg viewBox="0 0 40 40" aria-hidden="true">${iconIn(b,sea)}${o?`<g transform="${OPTPOS[b]||""}">${OPTV[o]}</g>`:""}</svg>`};
const candySVG=`<svg viewBox="0 0 26 26" aria-hidden="true"><path d="M7 13 L1.5 7.5 L2.5 18.5Z M19 13 L24.5 7.5 L23.5 18.5Z" fill="#b48ae0" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="13" cy="13" r="7.2" fill="#f2a35c" stroke="${INK}" stroke-width="1.8"/><path d="M8.6 10.4 q3.4 6.4 8.8 6.2" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".75"/></svg>`;
const coinSVG=`<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="11" fill="#f7d77a" stroke="${INK}" stroke-width="1.8"/><circle cx="13" cy="13" r="8.4" fill="none" stroke="#e8b84a" stroke-width="1.3"/><path d="M6.6 9.6 a7.4 7.4 0 0 1 4 -3.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/><path d="M13 12.6 c-2.6 0 -4.4 2.2 -4.4 3.9 c0 1.5 1.3 2.1 2.4 1.8 c.8 -.2 1.3 -.5 2 -.5 s1.2 .3 2 .5 c1.1 .3 2.4 -.3 2.4 -1.8 c0 -1.7 -1.8 -3.9 -4.4 -3.9Z" fill="#c98a1e"/><ellipse cx="8.4" cy="11.4" rx="1.5" ry="1.8" fill="#c98a1e" transform="rotate(-20 8.4 11.4)"/><ellipse cx="11.3" cy="8.7" rx="1.5" ry="1.9" fill="#c98a1e" transform="rotate(-6 11.3 8.7)"/><ellipse cx="14.7" cy="8.7" rx="1.5" ry="1.9" fill="#c98a1e" transform="rotate(6 14.7 8.7)"/><ellipse cx="17.6" cy="11.4" rx="1.5" ry="1.8" fill="#c98a1e" transform="rotate(20 17.6 11.4)"/></svg>`;
const BO=`stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
/* La salle : une véranda ouverte sur le dehors. On voit la saison derrière les vitres (et la nuit en hiver). */
const OUT={
  printemps:{sky:["#bfe3f5","#fde7ef"],hill:["#c9e6b0","#a8d39a"],cloud:"#fff"},
  ete:{sky:["#62bdf0","#c4edff"],hill:["#a8d892","#86c472"],cloud:"#fff"},
  automne:{sky:["#f4a26a","#fde0b8"],hill:["#ecc27e","#dca35c"],cloud:"#fff1e0"},
  hiver:{sky:["#1f2b52","#4f5f9c"],hill:["#d9e4f2","#f4f8fd"],cloud:"#6b79ad"}
};
const GX0=84,GX1=516,GY0=22,GY1=192; // la vitre de la véranda
const PANES=[GX0,192,300,408,GX1];
// motif animé qui défile dans la vitre (neige, feuilles, pétales)
const fxPat=(id,w,h,c,to,dur)=>[`<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${c}<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="${to}" dur="${dur}s" repeatCount="indefinite"/></pattern>`,`<rect x="${GX0}" y="${GY0}" width="${GX1-GX0}" height="${GY1-GY0}" fill="url(#${id})"/>`];
// Le paysage derrière la vitre, refait le 29/10/2026 (Joffray : « J'adore ») : montagnes dans la brume, champs en patchwork,
// chaumière qui fume au bout d'un chemin, prés et arbres de la saison. Halloween garde l'ancien dessin (outsideOld).
const SCAPE={
  printemps:{sky:["#9fd2f0","#e6f2f6","#fde7ef"],mt:["#c8c6e8","#e4e2f4"],cap:1,h:[["#cfe6b8","#b9d9a0"],["#b8dc96","#94c47a"],["#a4d486","#7fb46a"]],dot:"#8fbf7a",
    fields:["#f2df8a","#cfe6a0","#e6c4e8"],hedge:"#6fa060",path:"#f0e2c8",fence:"#fff6ea",fx:"petales"},
  ete:{sky:["#4fb4ec","#bfe6fb","#eaf7fb"],mt:["#a9c4e0","#cfe0f0"],cap:0,h:[["#bfe2a0","#a6d488"],["#a8d880","#86c262"],["#96cc6e","#6faa52"]],dot:"#6fae5e",
    fields:["#f2cf5a","#b9a0e0","#d6ec9a"],hedge:"#5f9a4e",path:"#f2e2b8",fence:"#fff6ea",fx:""},
  automne:{sky:["#f4a26a","#fbcf9c","#fde8c8"],mt:["#c99aa8","#e2c0bc"],cap:1,h:[["#e8c88e","#dcb072"],["#e2b46a","#cf9a4e"],["#d4a256","#b8823c"]],dot:"#d9823c",
    fields:["#c9783c","#f2c45a","#a8b46a"],hedge:"#8a6a3e",path:"#e8d2a8",fence:"#f6e6d0",fx:"feuilles"},
  hiver:{sky:["#1b2450","#3a467e","#6a6aa0"],mt:["#6a78a8","#8a96c4"],cap:2,h:[["#c4d2e8","#dfe7f3"],["#d6e0ef","#eef3fa"],["#e6edf7","#fbfdff"]],dot:"#5a7a7a",
    fields:["#eef3fa","#dfe8f4","#f6f9fd"],hedge:"#9fb2c8",path:"#c9d6e6",fence:"#fbfdff",fx:"neige",night:1}
};
function outsideSVG(sea){
  if(HW)return outsideOld(sea);
  const P=SCAPE[sea],R=rng(11),f=n=>n.toFixed(1),l=(w=2.4)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`,fx=[];
  const g=(id,a,b,x2=0,y2=1)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  let defs=`<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset=".7" stop-color="${P.sky[1]}"/><stop offset="1" stop-color="${P.sky[2]}"/></linearGradient>`
    +g("pM",P.mt[0],P.mt[1])+P.h.map((h,i)=>g("pH"+i,h[0],h[1])).join("")
    +`<radialGradient id="pSun"><stop offset="0" stop-color="#fffbe8" stop-opacity=".95"/><stop offset=".45" stop-color="#fff3cf" stop-opacity=".35"/><stop offset="1" stop-color="#fff3cf" stop-opacity="0"/></radialGradient>
    <radialGradient id="pBl" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffe4ee"/><stop offset="1" stop-color="#f4a6c0"/></radialGradient>
    <radialGradient id="pGr" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#b9e49a"/><stop offset="1" stop-color="#5f9a4e"/></radialGradient>
    <radialGradient id="pAu" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffd27a"/><stop offset="1" stop-color="#d9603f"/></radialGradient>
    <radialGradient id="pGlow"><stop offset="0" stop-color="#ffd66b" stop-opacity=".7"/><stop offset="1" stop-color="#ffd66b" stop-opacity="0"/></radialGradient>`;
  let st=`<rect x="0" y="0" width="600" height="200" fill="url(#sky)"/>`,an="";
  // ciel : soleil, arc-en-ciel, soleil couchant, ou nuit étoilée et lune
  if(sea==="printemps")st+=`<circle cx="170" cy="56" r="90" fill="url(#pSun)"/><circle cx="170" cy="56" r="15" fill="#fffdf2"/>`+[["#f6a5b4",0],["#f7d77a",7],["#a9d68f",14],["#9ec3ef",21]].map(([c,o])=>`<path d="M${230+o} 150 A${130-o} ${108-o} 0 0 1 ${490-o} 150" fill="none" stroke="${c}" stroke-width="7" opacity=".45"/>`).join("");
  if(sea==="ete"){an+=`<circle cx="430" cy="60" r="70" fill="url(#pSun)"/><g><animateTransform attributeName="transform" type="rotate" from="0 430 60" to="360 430 60" dur="30s" repeatCount="indefinite"/>${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M${f(430+Math.cos(a)*29)} ${f(60+Math.sin(a)*29)} L${f(430+Math.cos(a)*38)} ${f(60+Math.sin(a)*38)}" stroke="#f2b84a" stroke-width="4" stroke-linecap="round"/>`}).join("")}</g>`;
    st+=`<circle cx="430" cy="60" r="22" fill="#ffe07a" ${l()}/><circle cx="424" cy="58" r="2" fill="${INK}"/><circle cx="436" cy="58" r="2" fill="${INK}"/><path d="M427 64 q3 3 6 0" fill="none" ${l(2)}/><circle cx="419" cy="64" r="3.2" fill="#f6a5b4" opacity=".7"/><circle cx="441" cy="64" r="3.2" fill="#f6a5b4" opacity=".7"/>`}
  if(sea==="automne")st+=`<circle cx="440" cy="112" r="96" fill="url(#pSun)"/><circle cx="440" cy="112" r="24" fill="#ffb46a" ${l()}/><path d="M60 70 Q200 56 330 74" fill="none" stroke="#ffe0c0" stroke-width="5" stroke-linecap="round" opacity=".55"/>`;
  if(P.night){for(let i=0;i<34;i++){const x=GX0+6+R()*(GX1-GX0-12),y=GY0+4+R()*84,r=.7+R()*1.3;an+=`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#fff8dc"><animate attributeName="opacity" values="1;.2;1" dur="${f(2+R()*3)}s" repeatCount="indefinite"/></circle>`}
    st+=`<circle cx="430" cy="58" r="40" fill="#fff6c8" opacity=".14"/><circle cx="430" cy="58" r="16" fill="#fff6c8" ${l(2.2)}/><circle cx="438" cy="52" r="13" fill="${P.sky[0]}"/>`}
  // montagnes lointaines, neige au sommet, brume
  st+=`<path d="M60 118 L130 70 L170 96 L230 58 L290 100 L340 80 L400 108 L460 66 L540 112 L600 96 V150 H60Z" fill="url(#pM)"/>`;
  if(P.cap)st+=P.cap===2?`<path d="M60 118 L130 70 L170 96 L230 58 L290 100 L340 80 L400 108 L460 66 L540 112 L600 96 L600 104 L540 118 L460 82 L400 114 L340 92 L290 108 L230 76 L170 104 L130 86 L60 124Z" fill="#e8eef8" opacity=".9"/>`
    :`<path d="M230 58 L218 70 L228 69 L236 76 L242 68 L250 72Z M460 66 L448 78 L458 77 L466 84 L472 76 L480 80Z M130 70 L121 79 L130 78 L136 83 L140 77Z" fill="#fff" opacity=".95"/>`;
  st+=`<rect x="0" y="96" width="600" height="40" fill="${P.night?"#9aa6d0":"#fff"}" opacity="${P.night?.16:.28}"/>`;
  // collines lointaines et leurs petits arbres (des sapins en hiver)
  st+=`<path d="M0 132 Q80 112 170 124 Q260 108 350 122 Q440 110 600 124 V200 H0Z" fill="url(#pH0)"/>`;
  for(let i=0;i<26;i++){const x=90+R()*420,y=118+R()*10,r=3+R()*2.4;st+=P.night?`<path d="M${f(x)} ${f(y-r*2)} L${f(x-r)} ${f(y+r*.6)} H${f(x+r)}Z" fill="${P.dot}"/>`:`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${P.dot}" opacity=".9"/>`}
  // champs en patchwork, haies, chaumière qui fume
  st+=`<path d="M0 150 Q120 128 250 142 Q380 126 600 142 V200 H0Z" fill="url(#pH1)" ${l(2)}/>`;
  st+=`<path d="M300 140 Q340 134 380 140 L392 156 Q350 150 306 156Z" fill="${P.fields[0]}" opacity=".85"/><path d="M180 146 Q220 138 262 144 L270 160 Q226 154 186 160Z" fill="${P.fields[1]}" opacity=".9"/><path d="M400 142 Q440 136 486 142 L494 158 Q450 152 404 158Z" fill="${P.fields[2]}" opacity=".75"/>`;
  if(sea==="ete")st+=[0,1,2,3].map(i=>`<path d="M${404+i*3} ${146+i*3} Q448 ${140+i*3} ${488-i} ${146+i*3}" fill="none" stroke="#8a6ac4" stroke-width="1.6" opacity=".6"/>`).join("");
  if(sea==="automne")st+=[[318,148],[346,146],[372,150]].map(([x,y])=>`<path d="M${x-7} ${y+4} Q${x} ${y-10} ${x+7} ${y+4}Z" fill="#f2c45a" ${l(1.4)}/><path d="M${x-4} ${y} h8" stroke="#c99a3a" stroke-width="1"/>`).join("");
  st+=`<path d="M180 146 Q222 140 262 144 M300 140 Q340 134 380 140 M400 142 Q442 136 486 142" fill="none" stroke="${P.hedge}" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 5"/>`;
  st+=`<g><rect x="338" y="122" width="24" height="16" rx="2" fill="#fbecd8" ${l(1.8)}/><path d="M334 124 L350 110 L366 124Z" fill="${P.night?"#f4f8fd":"#e48a7a"}" ${l(1.8)}/><rect x="356" y="110" width="4" height="8" fill="#b9a49a" ${l(1.2)}/><rect x="343" y="126" width="6" height="6" rx="1" fill="#ffe7a3" ${l(1)}/><rect x="352" y="128" width="5" height="10" rx="1" fill="#a8724c" ${l(1)}/></g>`;
  if(P.night)st+=`<circle cx="346" cy="129" r="14" fill="url(#pGlow)"/>`;
  an+=[0,1.4,2.8].map(d=>`<circle cx="358" cy="106" r="3" fill="${P.night?"#c9d0e8":"#fff"}" opacity="0"><animate attributeName="cy" values="106;88" dur="4.2s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.85;0" dur="4.2s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="r" values="2.4;5" dur="4.2s" begin="${d}s" repeatCount="indefinite"/></circle>`).join("");
  // le pré devant : chemin, fleurs de la saison, barrière
  st+=`<path d="M0 172 Q140 150 290 166 Q440 150 600 164 V200 H0Z" fill="url(#pH2)" ${l()}/>`;
  st+=`<path d="M300 200 Q290 182 320 170 Q342 160 352 140 L358 140 Q352 164 330 176 Q310 186 318 200Z" fill="${P.path}" ${l(1.8)}/>`;
  for(let i=0;i<34;i++){const x=90+R()*420,y=172+R()*20;if(x>296&&x<334)continue;
    if(sea==="printemps"){const c=["#f47f9a","#ffd36a","#f6f1ea","#c9a8ec"][i%4];st+=`<path d="M${f(x)} ${f(y+6)} v-6" stroke="#5f9a5a" stroke-width="1.4"/><path d="M${f(x-2.4)} ${f(y)} q0 -4 2.4 -5 q2.4 1 2.4 5Z" fill="${c}" stroke="${INK}" stroke-width=".8"/>`}
    else if(sea==="ete"){if(i%3)st+=`<path d="M${f(x)} ${f(y+6)} v-3 M${f(x)} ${f(y+6)} l-2 -3 M${f(x)} ${f(y+6)} l2 -3" stroke="#5f9a4e" stroke-width="1.2"/>`;else st+=`<path d="M${f(x)} ${f(y+8)} v-9" stroke="#5f9a4e" stroke-width="1.6"/>${[0,45,90,135,180,225,270,315].map(a=>`<ellipse cx="${f(x+3*Math.cos(a*Math.PI/180))}" cy="${f(y-2+3*Math.sin(a*Math.PI/180))}" rx="2" ry="1.1" fill="#ffd23a" transform="rotate(${a} ${f(x+3*Math.cos(a*Math.PI/180))} ${f(y-2+3*Math.sin(a*Math.PI/180))})"/>`).join("")}<circle cx="${f(x)}" cy="${f(y-2)}" r="1.8" fill="#8a5a3a"/>`}
    else if(sea==="automne"){if(i%5===0)st+=`<ellipse cx="${f(x)}" cy="${f(y+2)}" rx="5" ry="3.6" fill="#f2a35c" stroke="${INK}" stroke-width="1"/><path d="M${f(x)} ${f(y-1.6)} q1 -2 2 -2" stroke="#6f9a60" stroke-width="1.4" fill="none"/>`;else st+=`<ellipse cx="${f(x)}" cy="${f(y+3)}" rx="2.4" ry="1.2" fill="${["#d9603f","#f2c45a","#c9783c"][i%3]}" transform="rotate(${i*37%180} ${f(x)} ${f(y+3)})"/>`}
    else st+=i%4?`<ellipse cx="${f(x)}" cy="${f(y+3)}" rx="${f(3+R()*3)}" ry="1.6" fill="#fff"/>`:`<path d="M${f(x)} ${f(y-6)} L${f(x-3.4)} ${f(y+2)} H${f(x+3.4)}Z" fill="#4f7a6a"/><path d="M${f(x)} ${f(y-6)} L${f(x-2)} ${f(y-1)} H${f(x+2)}Z" fill="#fff"/>`}
  st+=`<path d="M96 184 H262" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M96 184 H262" stroke="${P.fence}" stroke-width="2.6" stroke-linecap="round"/>`+[104,128,152,176,200,224,248].map(x=>`<path d="M${x} 194 V176 l3 -4 l3 4 V194Z" fill="${P.fence}" ${l(1.6)}/>`+(P.night?`<path d="M${x-.6} 173 q3 -3 7.2 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`:"")).join("");
  // les arbres de la saison
  const trunk=(x,y,k)=>`<path d="M${x-3*k} ${y} Q${x-2*k} ${y-18*k} ${x} ${y-30*k} M${x} ${y-22*k} Q${x+8*k} ${y-28*k} ${x+14*k} ${y-34*k} M${x-1*k} ${y-18*k} Q${x-9*k} ${y-24*k} ${x-14*k} ${y-30*k}" fill="none" stroke="${INK}" stroke-width="${f(6*k)}" stroke-linecap="round"/><path d="M${x-3*k} ${y} Q${x-2*k} ${y-18*k} ${x} ${y-30*k} M${x} ${y-22*k} Q${x+8*k} ${y-28*k} ${x+14*k} ${y-34*k} M${x-1*k} ${y-18*k} Q${x-9*k} ${y-24*k} ${x-14*k} ${y-30*k}" fill="none" stroke="#9a6a48" stroke-width="${f(3.4*k)}" stroke-linecap="round"/>`;
  const leafy=(x,y,k,grad,deco)=>{let s=trunk(x,y,k);const cl=[[-16,-34,13],[0,-44,15],[16,-36,12],[-6,-30,11],[10,-28,10],[-22,-26,8],[22,-28,8]];
    cl.forEach(([dx,dy,r])=>s+=`<circle cx="${f(x+dx*k)}" cy="${f(y+dy*k)}" r="${f(r*k)}" fill="url(#${grad})" ${l(2)}/>`);
    cl.forEach(([dx,dy,r])=>{s+=`<circle cx="${f(x+(dx-r*.3)*k)}" cy="${f(y+(dy-r*.35)*k)}" r="${f(r*.4*k)}" fill="#fff" opacity=".45"/>`;for(let j=0;j<2;j++){const a=R()*6.28,d=r*.5*k;s+=deco(x+dx*k+Math.cos(a)*d,y+dy*k+Math.sin(a)*d)}});
    return s};
  const pine=(x,y,k)=>{let s=`<rect x="${f(x-2.4*k)}" y="${f(y-8*k)}" width="${f(4.8*k)}" height="${f(8*k)}" fill="#8a5a3a" ${l(1.6)}/>`;
    for(let t=0;t<3;t++){const yb=y-6*k-t*13*k,w=(18-t*5)*k,h=20*k;s+=`<path d="M${f(x)} ${f(yb-h)} L${f(x-w)} ${f(yb)} Q${f(x)} ${f(yb+3*k)} ${f(x+w)} ${f(yb)}Z" fill="#3f6f5a" ${l(2)}/><path d="M${f(x-w*.85)} ${f(yb-1)} Q${f(x-w*.4)} ${f(yb-h*.3)} ${f(x)} ${f(yb-h*.24)} Q${f(x+w*.4)} ${f(yb-h*.3)} ${f(x+w*.85)} ${f(yb-1)} Q${f(x)} ${f(yb+2*k)} ${f(x-w*.85)} ${f(yb-1)}Z" fill="#fff"/>`}
    return s+`<path d="M${f(x-3*k)} ${f(y-6*k-26*k-20*k+6*k)} L${f(x)} ${f(y-6*k-26*k-20*k)} L${f(x+3*k)} ${f(y-6*k-26*k-20*k+6*k)}Z" fill="#fff"/>`};
  const flower=(x,y)=>`<g transform="translate(${f(x)} ${f(y)})">${[0,72,144,216,288].map(b=>`<circle cx="${f(1.6*Math.cos(b*Math.PI/180))}" cy="${f(1.6*Math.sin(b*Math.PI/180))}" r="1.2" fill="#fff4f8"/>`).join("")}<circle r=".8" fill="#e2546e"/></g>`;
  const apple=(x,y)=>`<circle cx="${f(x)}" cy="${f(y)}" r="1.9" fill="#e2445e" stroke="${INK}" stroke-width=".8"/>`;
  const fall=(x,y)=>`<ellipse cx="${f(x)}" cy="${f(y)}" rx="2.2" ry="1.2" fill="#c9442e" opacity=".8"/>`;
  const tree={printemps:(x,y,k)=>leafy(x,y,k,"pBl",flower)+`<ellipse cx="${f(x+6*k)}" cy="${f(y+2)}" rx="${f(20*k)}" ry="${f(3*k)}" fill="#f4a6c0" opacity=".5"/>`,
    ete:(x,y,k)=>leafy(x,y,k,"pGr",apple),automne:(x,y,k)=>leafy(x,y,k,"pAu",fall)+`<ellipse cx="${f(x+6*k)}" cy="${f(y+2)}" rx="${f(20*k)}" ry="${f(3*k)}" fill="#e8834e" opacity=".55"/>`,hiver:(x,y,k)=>pine(x,y,k*1.2)}[sea];
  st+=tree(128,188,.95)+tree(486,190,1.05)+tree(410,178,.6);
  // réverbère allumé en hiver
  if(P.night)st+=`<circle cx="230" cy="150" r="22" fill="url(#pGlow)"/><rect x="228" y="152" width="4" height="36" fill="#5b4a5e" ${l(1.6)}/><rect x="222" y="140" width="16" height="13" rx="3" fill="#ffe7a0" ${l(1.8)}/><path d="M220 140 h20 l-4 -5 h-12Z" fill="#5b4a5e" ${l(1.4)}/><path d="M220 135 q10 -3 20 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
  // nuages en volume qui dérivent (pas la nuit)
  const cloud=(x,y,k,dur)=>`<g opacity="${sea==="automne"?.9:1}"><animateTransform attributeName="transform" type="translate" values="0 0;18 0;0 0" dur="${dur}s" repeatCount="indefinite"/>${[[x-14*k,y,11*k],[x+2*k,y-7*k,15*k],[x+18*k,y,10*k]].map(([cx,cy,r])=>`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${sea==="automne"?"#fff1e0":"#fff"}"/>`).join("")}<path d="M${f(x-25*k)} ${f(y+4*k)} Q${f(x)} ${f(y+12*k)} ${f(x+28*k)} ${f(y+4*k)}" fill="${sea==="automne"?"#f6d6c0":"#e2ecf6"}"/>${[[x-16*k,y-3*k,4*k],[x,y-11*k,5*k]].map(([cx,cy,r])=>`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#fff" opacity=".9"/>`).join("")}</g>`;
  if(!P.night)an+=cloud(260,64,1,22)+cloud(sea==="ete"?330:430,sea==="ete"?96:40,.8,28)+cloud(sea==="ete"?180:330,sea==="ete"?50:96,.55,19);
  // papillons, oiseaux
  const fly=(x,y,c,dl)=>`<g transform="translate(${x} ${y})"><g><animateMotion path="M0 0 C24 -18 50 14 76 -4 S120 -20 96 16 S30 20 0 0Z" dur="11s" begin="-${dl}s" repeatCount="indefinite"/><path d="M0 0 Q-9 -10 -10 -2 Q-8 4 0 0 Q9 -10 10 -2 Q8 4 0 0Z" fill="${c}" stroke="${INK}" stroke-width="1.4"><animateTransform attributeName="transform" type="scale" values="1 1;.3 1;1 1" dur=".35s" repeatCount="indefinite"/></path></g></g>`;
  if(sea==="printemps")an+=fly(220,150,"#ffd36a",0);
  if(sea==="ete")an+=fly(150,120,"#f6a5b4",0)+fly(330,104,"#c9b8f2",4);
  if(sea==="automne")an+=`<g><animateTransform attributeName="transform" type="translate" values="-60 0;460 -20" dur="24s" repeatCount="indefinite"/>${[[150,70],[140,64],[160,64],[130,58],[170,58]].map(([x,y])=>`<path d="M${x-5} ${y} q2.5 -3 5 0 q2.5 -3 5 0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`).join("")}</g>`;
  // ce qui tombe : pétales, feuilles, neige
  if(P.fx==="neige")fx.push(fxPat("fx1",40,40,`<circle cx="8" cy="10" r="2.3" fill="#fff"/><circle cx="28" cy="30" r="1.7" fill="#fff"/>`,"6 40",4.6),fxPat("fx2",26,26,`<circle cx="6" cy="6" r="1.3" fill="#fff" opacity=".85"/>`,"-4 26",3));
  if(P.fx==="feuilles")fx.push(fxPat("fx1",64,64,`<ellipse cx="12" cy="14" rx="5" ry="2.6" fill="#e8835a" transform="rotate(30 12 14)"/><ellipse cx="44" cy="46" rx="4.4" ry="2.4" fill="#f2c060" transform="rotate(-40 44 46)"/><ellipse cx="50" cy="12" rx="4" ry="2.2" fill="#d9603f" transform="rotate(70 50 12)"/>`,"40 64",7));
  if(P.fx==="petales")fx.push(fxPat("fx1",56,56,`<ellipse cx="10" cy="12" rx="3.6" ry="2.2" fill="#f9c4d2" transform="rotate(25 10 12)"/><ellipse cx="38" cy="40" rx="3.2" ry="2" fill="#fff0f4" transform="rotate(-35 38 40)"/>`,"30 56",8));
  return {defs:defs+fx.map(x=>x[0]).join(""),st,an:an+fx.map(x=>x[1]).join("")};
}
// l'ancien paysage, gardé pour Halloween (ciel violet, citrouilles, chauves-souris)
function outsideOld(sea){
  const O=HW?{...OUT[sea],sky:sea==="hiver"?OUT.hiver.sky:["#3c2e60","#c98a9a"],cloud:"#7d6aa6"}:OUT[sea],R=rng(11),fx=[];
  let defs=`<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${O.sky[0]}"/><stop offset="1" stop-color="${O.sky[1]}"/></linearGradient>`;
  let st=`<rect x="0" y="0" width="600" height="200" fill="url(#sky)"/>`,an="";
  if(HW&&sea!=="hiver"){
    for(let i=0;i<22;i++){const x=GX0+8+R()*(GX1-GX0-16),y=GY0+6+R()*70,r=.8+R()*1.3;an+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff8dc"><animate attributeName="opacity" values="1;.2;1" dur="${(2+R()*3).toFixed(1)}s" repeatCount="indefinite"/></circle>`}
    st+=`<circle cx="430" cy="66" r="44" fill="#fff3c4" opacity=".35" filter="url(#soft)"/><circle cx="430" cy="66" r="24" fill="#fff3c4" stroke="${INK}" stroke-width="2.4"/><circle cx="422" cy="60" r="4" fill="#efdca0"/><circle cx="437" cy="73" r="5" fill="#efdca0"/><circle cx="440" cy="58" r="2.4" fill="#efdca0"/>`;
  }else if(sea==="hiver"){
    for(let i=0;i<28;i++){const x=GX0+8+R()*(GX1-GX0-16),y=GY0+6+R()*86,r=.8+R()*1.4;an+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff8dc"><animate attributeName="opacity" values="1;.2;1" dur="${(2+R()*3).toFixed(1)}s" repeatCount="indefinite"/></circle>`}
    st+=`<circle cx="430" cy="62" r="34" fill="#fff6c8" opacity=".3" filter="url(#soft)"/><circle cx="430" cy="62" r="17" fill="#fff6c8" stroke="${INK}" stroke-width="2.4"/><circle cx="438" cy="56" r="14" fill="${O.sky[0]}"/>`;
  }else if(sea==="ete"){
    an+=`<circle cx="430" cy="66" r="46" fill="#fff3a0" opacity=".6" filter="url(#soft)"/><g><animateTransform attributeName="transform" type="rotate" from="0 430 66" to="360 430 66" dur="26s" repeatCount="indefinite"/>${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M${(430+Math.cos(a)*30).toFixed(1)} ${(66+Math.sin(a)*30).toFixed(1)} L${(430+Math.cos(a)*40).toFixed(1)} ${(66+Math.sin(a)*40).toFixed(1)}" stroke="#f2b84a" stroke-width="4" stroke-linecap="round"/>`}).join("")}</g>`;
    st+=`<circle cx="430" cy="66" r="24" fill="#ffe07a" stroke="${INK}" stroke-width="2.4"/><circle cx="423" cy="64" r="2" fill="${INK}"/><circle cx="437" cy="64" r="2" fill="${INK}"/><path d="M426 70 q4 4 8 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><circle cx="418" cy="70" r="3.4" fill="#f6a5b4" opacity=".7"/><circle cx="442" cy="70" r="3.4" fill="#f6a5b4" opacity=".7"/>`;
  }else if(sea==="automne"){
    st+=`<circle cx="440" cy="126" r="54" fill="#ffd08a" opacity=".65" filter="url(#soft)"/><circle cx="440" cy="126" r="26" fill="#ffb46a" stroke="${INK}" stroke-width="2.4"/>`;
  }else{
    st+=[["#f6a5b4",0],["#f7d77a",8],["#a9d68f",16],["#9ec3ef",24]].map(([c,o])=>`<path d="M${176+o} 190 A${124-o} ${112-o} 0 0 1 ${424-o} 190" fill="none" stroke="${c}" stroke-width="8" opacity=".7"/>`).join("");
    st+=`<circle cx="150" cy="58" r="16" fill="#fff0a8" stroke="${INK}" stroke-width="2.2"/>`;
  }
  const cloud=(x,y,k,dur)=>`<g opacity="${sea==="hiver"?.55:1}"><animateTransform attributeName="transform" type="translate" values="0 0;16 0;0 0" dur="${dur}s" repeatCount="indefinite"/>${blob([[x-14*k,y,11*k],[x+2*k,y-6*k,14*k],[x+18*k,y,10*k]],O.cloud)}</g>`;
  an+=cloud(160,92,1,22)+cloud(330,52,.8,28)+cloud(262,118,.6,19);
  // collines et paysage : les mêmes dessins que sur la carte
  st+=`<path d="M0 150 Q90 112 190 138 T380 128 T600 136 V200 H0Z" fill="${O.hill[0]}" ${BO}/>`;
  if(sea==="hiver"||HW)st+=`<rect x="290" y="114" width="26" height="18" rx="2" fill="#f7d9c4" ${BO}/><path d="M285 116 L303 100 L321 116Z" fill="#fff" ${BO}/><rect x="297" y="119" width="9" height="8" rx="1.5" fill="#ffd66b"/><circle cx="301" cy="123" r="12" fill="#ffd66b" opacity=".45" filter="url(#soft)"/>`;
  const F=DECO[sea];
  [[150,146,.5,0],[372,140,.45,0],[248,142,.4,sea==="ete"?1:0]].forEach(([x,y,k,i])=>st+=F[i](x,y,k));
  st+=`<path d="M0 172 Q130 148 270 166 T600 158 V200 H0Z" fill="${O.hill[1]}" ${BO}/>`;
  const near={printemps:[[112,182,.8,0],[214,180,.65,1],[396,182,.6,2],[492,186,.85,0]],ete:[[110,184,.8,0],[200,182,.75,1],[226,184,.6,1],[392,184,.62,1],[490,188,.85,0]],automne:[[110,184,.8,0],[210,180,.7,2],[392,182,.65,1],[490,188,.85,0]],hiver:[[112,184,.85,0],[212,182,.75,1],[392,184,.7,0],[488,188,.9,1]]}[sea];
  near.forEach(([x,y,k,i])=>st+=F[i](x,y,k));
  if(HW)[[160,190,.7],[300,192,.85],[446,190,.6]].forEach(([x,y,k])=>st+=jack(x,y,k));
  if(sea==="hiver")st+=`<circle cx="345" cy="122" r="24" fill="#ffd66b" opacity=".45" filter="url(#soft)"/><rect x="342" y="128" width="6" height="56" fill="#5b4a5e" ${BO}/><rect x="334" y="114" width="22" height="16" rx="4" fill="#ffe7a0" ${BO}/>`;
  if(sea==="ete")[[150,120,"#f6a5b4",0],[330,104,"#c9b8f2",4]].forEach(([x,y,c,dl])=>an+=`<g transform="translate(${x} ${y})"><g><animateMotion path="M0 0 C24 -18 50 14 76 -4 S120 -20 96 16 S30 20 0 0Z" dur="11s" begin="-${dl}s" repeatCount="indefinite"/><path d="M0 0 Q-9 -10 -10 -2 Q-8 4 0 0 Q9 -10 10 -2 Q8 4 0 0Z" fill="${c}" stroke="${INK}" stroke-width="1.6"><animateTransform attributeName="transform" type="scale" values="1 1;.3 1;1 1" dur=".35s" repeatCount="indefinite"/></path></g></g>`);
  // chauves-souris qui passent devant la lune
  if(HW)[[300,70,0,1],[400,96,3,.8],[200,60,6,.7]].forEach(([x,y,dl,k])=>an+=`<g transform="translate(${x} ${y}) scale(${k})"><g><animateMotion path="M0 0 C40 -30 90 20 130 -10 S170 -40 120 10 S20 30 0 0Z" dur="9s" begin="-${dl}s" repeatCount="indefinite"/><path d="M0 0 Q-6 -8 -16 -6 Q-12 -2 -13 3 Q-8 0 -6 4 Q-3 0 0 0 Q3 0 6 4 Q8 0 13 3 Q12 -2 16 -6 Q6 -8 0 0Z" fill="#3d2a35"><animateTransform attributeName="transform" type="scale" values="1 1;1 .3;1 1" dur=".4s" repeatCount="indefinite"/></path><circle r="3.4" fill="#3d2a35"/></g></g>`);
  if(sea==="hiver")fx.push(fxPat("fx1",40,40,`<circle cx="8" cy="10" r="2.3" fill="#fff"/><circle cx="28" cy="30" r="1.7" fill="#fff"/>`,"6 40",4.6),fxPat("fx2",26,26,`<circle cx="6" cy="6" r="1.3" fill="#fff" opacity=".85"/>`,"-4 26",3));
  if(sea==="automne")fx.push(fxPat("fx1",64,64,`<ellipse cx="12" cy="14" rx="5" ry="2.6" fill="#e8835a" transform="rotate(30 12 14)"/><ellipse cx="44" cy="46" rx="4.4" ry="2.4" fill="#f2c060" transform="rotate(-40 44 46)"/><ellipse cx="50" cy="12" rx="4" ry="2.2" fill="#d9603f" transform="rotate(70 50 12)"/>`,"40 64",7));
  if(sea==="printemps")fx.push(fxPat("fx1",56,56,`<ellipse cx="10" cy="12" rx="3.6" ry="2.2" fill="#f9c4d2" transform="rotate(25 10 12)"/><ellipse cx="38" cy="40" rx="3.2" ry="2" fill="#fff0f4" transform="rotate(-35 38 40)"/>`,"30 56",8));
  defs+=fx.map(f=>f[0]).join("");
  return {defs,st,an:an+fx.map(f=>f[1]).join("")};
}
const potSVG=(x,y,k)=>`<path d="M${x} ${y-10*k} Q${x-16*k} ${y-16*k} ${x-18*k} ${y-34*k} Q${x-4*k} ${y-28*k} ${x} ${y-10*k} Q${x+2*k} ${y-30*k} ${x+16*k} ${y-36*k} Q${x+18*k} ${y-16*k} ${x} ${y-10*k}Z" fill="#8fca7a" ${BO}/><path d="M${x-12*k} ${y-12*k} H${x+12*k} L${x+9*k} ${y} H${x-9*k}Z" fill="#f59a8b" ${BO}/>`;
// Salle du Café refaite le 29/10/2026 (validée par Joffray) : même véranda, mêmes achats (plantes, guirlande, lanternes, disque, coussins, fauteuils), dessin soigné.
// Les couleurs du style choisi (papier peint, comptoir) restent celles de styleOf : la lumière et les ombres passent par des voiles.
const hdDefs=night=>{const g=(id,a,b,x2=0,y2=1,o1=1,o2=1)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}" stop-opacity="${o1}"/><stop offset="1" stop-color="${b}" stop-opacity="${o2}"/></linearGradient>`;
  return g("kBeam","#d9a678","#a8724c")+g("kWood","#d9a678","#b07a52")+g("kFrame","#fffdf8","#efe2d2",1,0)+g("kGlass","#ffffff","#ffffff",1,1,.32,0)
  +g("kShadeL","#3d2a35","#3d2a35",1,0,.22,0)+g("kShadeR","#3d2a35","#3d2a35",1,0,0,.22)+g("kTop","#ffffff","#3d2a35",0,1,.35,.12)+g("kPanel","#3d2a35","#ffffff",0,1,.14,.1)
  +g("kJar","#e8f4fb","#b9d8ea",1,0)+g("kBrass","#ffe08a","#d9a03a")+g("kHaze","#ffffff","#ffffff",0,1,0,night?.06:.3)
  +`<radialGradient id="kCone" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff3c0" stop-opacity="${night?.55:.4}"/><stop offset="1" stop-color="#fff3c0" stop-opacity="0"/></radialGradient>
  <radialGradient id="kVig" cx=".5" cy=".45" r=".8"><stop offset=".6" stop-color="#3d2a35" stop-opacity="0"/><stop offset="1" stop-color="#3d2a35" stop-opacity="${night?.32:.2}"/></radialGradient>
  <pattern id="kGrain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".5" fill="#5b4250" opacity=".07"/><circle cx="5" cy="5.5" r=".45" fill="#5b4250" opacity=".05"/></pattern>`};
const kBooks=(x,y,cs)=>cs.map((c,i)=>{const h=[22,18,24,20,16][i%5],w=[8,9,7,8,9][i%5],X=x+cs.slice(0,i).reduce((a,_,j)=>a+[8,9,7,8,9][j%5]+1,0);
  return `<rect x="${X}" y="${y-h}" width="${w}" height="${h}" rx="1.5" fill="${c}" stroke="${INK}" stroke-width="2"/><path d="M${X+1.6} ${y-h+4} h${w-3.2} M${X+1.6} ${y-5} h${w-3.2}" stroke="#fff" stroke-width="1.2" opacity=".55"/><rect x="${X+w-2.6}" y="${y-h+1}" width="1.6" height="${h-2}" fill="#3d2a35" opacity=".15"/>`}).join("");
const kJarF=(x,y,w,h,c,lid)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="url(#kJar)" ${BO}/><rect x="${x+3}" y="${y+h*.45}" width="${w-6}" height="${h*.5}" rx="3" fill="${c}" opacity=".85"/><rect x="${x+2}" y="${y-5}" width="${w-4}" height="6" rx="2" fill="${lid}" stroke="${INK}" stroke-width="2"/><path d="M${x+3.6} ${y+4} v${h*.4}" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/><rect x="${x+w/2-4}" y="${y+h*.3}" width="8" height="5" rx="1" fill="#fffaf2" stroke="${INK}" stroke-width="1"/>`;
const kShelf=(x,y,w)=>`<rect x="${x}" y="${y}" width="${w}" height="8" rx="2" fill="url(#kWood)" ${BO}/><path d="M${x+3} ${y+2.4} h${w-6}" stroke="#f0c896" stroke-width="1.2" opacity=".8"/><path d="M${x+6} ${y+8} l4 7 M${x+w-6} ${y+8} l-4 7" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><rect x="${x}" y="${y+8}" width="${w}" height="5" fill="#3d2a35" opacity=".1"/>`;
function roomSVG(night){
  let s="";const W=styleOf("wall");
  // la vitre : léger voile de brume sur le paysage, reflet en biais
  s+=`<rect x="${GX0}" y="${GY0}" width="${GX1-GX0}" height="${GY1-GY0}" fill="url(#kHaze)"/>`;
  for(let i=0;i<PANES.length-1;i++){const x=PANES[i],w=PANES[i+1]-x;s+=`<path d="M${x+8} ${GY0} L${x+w*.55} ${GY0} L${x+8} ${GY0+w*.7}Z" fill="url(#kGlass)" opacity="${night?.25:.75}"/><path d="M${x+28} ${GY0+12} l-16 34 M${x+44} ${GY0+12} l-8 17" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="${night?.12:.45}"/>`}
  s+=`<rect x="${GX0}" y="60" width="${GX1-GX0}" height="7" fill="url(#kFrame)" ${BO}/>`;
  PANES.slice(1,-1).forEach(x=>s+=`<rect x="${x-5}" y="${GY0}" width="10" height="${GY1-GY0}" fill="url(#kFrame)" ${BO}/><path d="M${x+3} ${GY0+3} V${GY1-3}" stroke="#d9c8b4" stroke-width="1.6"/>`);
  // murs de côté : papier peint du style, ombré vers les coins, avec une frise
  [[-6,GX0+6,"L"],[GX1-6,612,"R"]].forEach(([a,b,k])=>{s+=`<rect x="${a}" y="-4" width="${b-a}" height="${GY1+8}" fill="${W.w}" ${BO}/>`;
    for(let y=34;y<GY1;y+=24)for(let x=a+12+(y/24%2)*10;x<b-6;x+=20)s+=`<path d="M${x} ${y-3} l1 2 2 1 -2 1 -1 2 -1 -2 -2 -1 2 -1z" fill="${W.d}"/>`;
    s+=`<rect x="${a}" y="-4" width="${b-a}" height="${GY1+8}" fill="url(#kShade${k==="L"?"L":"R"})"/><path d="M${a} 40 H${b}" stroke="${W.d}" stroke-width="3" opacity=".6"/>`});
  [GX0,GX1].forEach(x=>s+=`<rect x="${x-6}" y="${GY0}" width="12" height="${GY1-GY0}" fill="url(#kFrame)" ${BO}/>`);
  // poutre veinée, rebord épais, soubassement en panneaux
  s+=`<rect x="-6" y="-4" width="612" height="${GY0+4}" fill="url(#kBeam)" ${BO}/><path d="M40 8 q30 -3 60 0 M180 7 q45 3 90 0 M360 10 q35 -3 70 0 M500 8 q30 3 60 0" fill="none" stroke="#f0c896" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>${[30,150,270,390,510].map(x=>`<circle cx="${x}" cy="13" r="2" fill="#7a4a31"/>`).join("")}`;
  s+=`<rect x="-6" y="${GY1}" width="612" height="12" rx="4" fill="url(#kBeam)" ${BO}/><path d="M0 ${GY1+3} H600" stroke="#f0c896" stroke-width="1.6" opacity=".8"/><rect x="-6" y="${GY1+12}" width="612" height="64" fill="${W.b}" ${BO}/><rect x="-6" y="${GY1+12}" width="612" height="10" fill="#3d2a35" opacity=".12"/>`;
  for(let x=8;x<600;x+=60)s+=`<rect x="${x}" y="${GY1+20}" width="50" height="44" rx="5" fill="url(#kPanel)" stroke="${W.l}" stroke-width="2.4"/>`;
  // étagère de gauche : bocaux et livres
  s+=kShelf(32,84,50)+kShelf(32,146,50);
  s+=kJarF(40,60,16,24,"#f2b8c4","#a8785a")+kJarF(60,66,15,18,"#f7d77a","#a8785a")+kBooks(37,146,["#9ec3ef","#f59a8b","#a9d68f","#f6a5c8"]);
  // étagère de droite : tourne-disque (ou livres), et une plante
  s+=kShelf(518,84,50)+kShelf(518,146,50);
  if(S.own.disque)s+=`<rect x="522" y="66" width="42" height="18" rx="3" fill="url(#kWood)" ${BO}/><ellipse cx="538" cy="66" rx="13" ry="4.2" fill="#3d2a35" ${BO}/><ellipse cx="538" cy="65.4" rx="8" ry="2.4" fill="none" stroke="#6a5a66" stroke-width="1"/><circle cx="538" cy="66" r="2.2" fill="#f47f9a"/><path d="M558 66 L551 55" stroke="${INK}" stroke-width="2.6"/><circle cx="558" cy="66" r="2" fill="#d9c8b4" stroke="${INK}" stroke-width="1.4"/>`;
  else s+=`<path d="M526 84 h26 v-6 h-26z M528 78 h22 v-6 h-22z M530 72 h18 v-6 h-18z" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  s+=S.own.plantes?potSVG(543,146,.85):kBooks(524,146,["#c9b8f2","#f2c75c","#9ec3ef","#f59a8b"]);
  // lampe suspendue en laiton, et son cône de lumière
  s+=`<path d="M300 ${GY0} V36" stroke="${INK}" stroke-width="2.4"/><path d="M300 52 L${night?200:236} ${GY1} H${night?400:364}Z" fill="url(#kCone)"/><path d="M280 52 Q300 26 320 52Z" fill="url(#kBrass)" ${BO}/><path d="M287 47 Q296 36 304 36" fill="none" stroke="#fff6d0" stroke-width="2" stroke-linecap="round"/><ellipse cx="300" cy="53" rx="9" ry="3" fill="#fff6c8"/>`;
  if(S.own.plantes){
    s+=potSVG(GX0+26,GY1,1)+potSVG(GX1-26,GY1,1);
    s+=`<path d="M140 ${GY0} L150 40 L160 ${GY0}" fill="none" stroke="${INK}" stroke-width="2"/><path d="M140 40 H160 L156 52 H144Z" fill="#fff5e8" ${BO}/><path d="M142 50 q-6 14 -2 28 M150 52 q0 16 4 30 M158 50 q6 12 2 24" fill="none" stroke="#6fae5e" stroke-width="4" stroke-linecap="round"/>${[[140,64],[152,70],[160,62],[139,76],[154,80]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2" fill="#8fca7a" stroke="${INK}" stroke-width="1"/>`).join("")}`;
  }
  if(S.own.guirlande){s+=`<path d="M-10 ${GY0} Q150 62 300 30 T610 ${GY0}" fill="none" stroke="${INK}" stroke-width="2"/>`;
    for(let i=0;i<14;i++){const x=10+i*44,t=x<300?x/300:(x-300)/300,y=x<300?GY0+(30-GY0)*t+24*Math.sin(Math.PI*t):30+(GY0-30)*t-14*Math.sin(Math.PI*t);
      const c=(HW?["#f2a35c","#b48ae0","#f7d77a","#8fca7a"]:["#f2c75c","#f47f9a","#9ec3ef","#8fca7a"])[i%4];s+=`<circle cx="${x}" cy="${y+6}" r="${night?14:10}" fill="${c}" opacity="${night?.6:.35}" filter="url(#soft)"/><rect x="${x-2.6}" y="${y-1}" width="5.2" height="3.6" rx="1" fill="#9a8f88" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${x}" cy="${y+6}" rx="4.5" ry="6" fill="${c}" stroke="${INK}" stroke-width="2"/><ellipse cx="${x-1.4}" cy="${y+4}" rx="1.4" ry="2" fill="#fff" opacity=".7"/>`}}
  if(HW){
    [[GX0+6,GY0,1],[GX1-6,GY0,-1]].forEach(([x,y,d])=>{s+=`<g fill="none" stroke="#fff" stroke-width="1.6" opacity=".8">${[0,30,60,90].map(a=>{const r=a*Math.PI/180;return `<path d="M${x} ${y} L${x+d*Math.cos(r)*46} ${y+Math.sin(r)*46}"/>`}).join("")}${[16,30,44].map(r=>`<path d="M${x+d*r} ${y} Q${x+d*r*.8} ${y+r*.4} ${x+d*r*.87} ${y+r*.5} Q${x+d*r*.55} ${y+r*.65} ${x+d*r*.5} ${y+r*.87} Q${x+d*r*.3} ${y+r*.75} ${x} ${y+r}"/>`).join("")}</g>`});
    s+=jack(150,GY1+2,.62)+jack(452,GY1+2,.52)+jack(66,84,.42);
    s+=`<path d="M${GX0} ${GY0+4} Q300 ${GY0+44} ${GX1} ${GY0+4}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
    for(let i=1;i<9;i++){const t=i/9,x=GX0+(GX1-GX0)*t,y=GY0+11+80*t*(1-t);s+=`<path d="M${x} ${y} q-5 -6 -12 -4 q3 3 2 6 q4 -2 5 2 q2 -2 5 -4 q3 2 5 4 q1 -4 5 -2 q-1 -3 2 -6 q-7 -2 -12 4Z" fill="${i%2?"#5f4f72":"#f2a35c"}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`}
  }
  if(S.own.lanternes)[[232,"#f59a8b"],[368,"#f2c75c"],[440,"#c9b8f2"]].forEach(([x,c],i)=>{const y=i===1?58:48;s+=`<path d="M${x} ${GY0} V${y-14}" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="22" fill="${c}" opacity="${night?.6:.35}" filter="url(#soft)"/><ellipse cx="${x}" cy="${y}" rx="12" ry="14" fill="${c}" ${BO}/><path d="M${x} ${y-14} V${y+14} M${x-6} ${y-12} Q${x-10} ${y} ${x-6} ${y+12} M${x+6} ${y-12} Q${x+10} ${y} ${x+6} ${y+12}" fill="none" stroke="${INK}" stroke-width="1.5"/><ellipse cx="${x-4}" cy="${y-5}" rx="2.4" ry="4" fill="#fff" opacity=".55"/><rect x="${x-5}" y="${y-17}" width="10" height="4" rx="1.4" fill="#5b4250"/><rect x="${x-5}" y="${y+13}" width="10" height="4" rx="1.4" fill="#5b4250"/>`});
  return s;
}
// mélange une couleur avec du blanc (k = part de blanc), pour éclairer le haut des collines
const kMix=(c,k,to=255)=>"#"+[1,3,5].map(i=>Math.round(parseInt(c.slice(i,i+2),16)*(1-k)+to*k).toString(16).padStart(2,"0")).join("");
function bgSVG(){
  const o=outsideSVG(SEA),night=SEA==="hiver"||HW,H=OUT[SEA].hill;
  // collines en volume : éclairées en haut, plus sombres en bas ; brume au pied des collines lointaines ; lumière du ciel
  const hg=(id,c)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${kMix(c,.35)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${kMix(c,.18,40)}"/></linearGradient>`;
  o.defs+=hg("kH0",H[0])+hg("kH1",H[1])+`<linearGradient id="kMist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity="${night?.12:.45}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  o.st=o.st.replace(`fill="${H[0]}"`,`fill="url(#kH0)"`).replace(`fill="${H[1]}"`,`fill="url(#kH1)"`);
  o.st=o.st.replace(/(<path d="M0 172 Q130 148)/,`<rect x="0" y="128" width="600" height="44" fill="url(#kMist)"/>$1`);
  return `<svg class="full" viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${o.defs}${hdDefs(night)}</defs><g filter="url(#wobble)">${o.st}</g>${o.an}<g filter="url(#wobble)">${roomSVG(night)}</g><rect width="600" height="375" fill="url(#kVig)"/><rect width="600" height="375" fill="url(#kGrain)"/></svg>${S.own.disque?`<span class="notes">♪</span><span class="notes" style="left:90%;animation-delay:1.2s">♫</span>`:""}`;
}
function counterSVG(){
  const C=styleOf("counter");
  let s=`<rect x="-10" y="250" width="620" height="16" fill="#3d2a35" opacity=".12"/><rect x="-10" y="246" width="620" height="20" rx="8" fill="${C.t}" ${BO}/><rect x="-10" y="246" width="620" height="20" rx="8" fill="url(#kTop2)"/><path d="M0 251 H600" stroke="#fff" stroke-width="2" opacity=".55"/>`;
  s+=`<rect x="0" y="264" width="600" height="120" fill="${C.f}" ${BO}/><rect x="0" y="266" width="600" height="12" fill="#3d2a35" opacity=".14"/>`;
  for(let x=8;x<600;x+=24)s+=`<path d="M${x} 270 V384" stroke="${C.p}" stroke-width="1.4" opacity=".45"/>`;
  for(let x=20;x<600;x+=96)s+=`<rect x="${x}" y="280" width="72" height="80" rx="8" fill="${C.f}" stroke="${C.p}" stroke-width="3"/><rect x="${x}" y="280" width="72" height="80" rx="8" fill="url(#kPanel2)"/><path d="M${x+5} 354 V289 Q${x+5} 285 ${x+9} 285 H${x+66}" fill="none" stroke="#fff" stroke-width="2" opacity=".45"/><path d="M${x+67} 287 V351 Q${x+67} 355 ${x+63} 355 H${x+8}" fill="none" stroke="#3d2a35" stroke-width="2" opacity=".18"/><path d="M${x+6} 284 h60" stroke="#fff" stroke-width="1.6" opacity=".4" stroke-linecap="round"/><circle cx="${x+36}" cy="320" r="3" fill="${C.p}" stroke="${INK}" stroke-width="1.4"/>`;
  // caisse et cloche à gâteau, un peu plus détaillées ; pot à pourboires
  s+=`<ellipse cx="570" cy="248" rx="26" ry="4" fill="#3d2a35" opacity=".15"/><rect x="548" y="214" width="44" height="34" rx="5" fill="#f59a8b" ${BO}/><rect x="548" y="214" width="44" height="10" rx="5" fill="#fff" opacity=".25"/><rect x="554" y="220" width="32" height="10" rx="2" fill="#fff5e8" stroke="${INK}" stroke-width="2"/>${[0,1,2].map(i=>`<rect x="${556+i*10}" y="234" width="7" height="5" rx="1.4" fill="#fff5e8" stroke="${INK}" stroke-width="1.2"/>`).join("")}<rect x="560" y="204" width="22" height="12" rx="3" fill="#d8ccd4" stroke="${INK}" stroke-width="2"/>`;
  s+=`<ellipse cx="30" cy="248" rx="24" ry="4" fill="#3d2a35" opacity=".15"/><rect x="6" y="243" width="48" height="5" rx="2" fill="#fffaf2" ${BO}/><circle cx="30" cy="236" r="9" fill="#f6a5c8" stroke="${INK}" stroke-width="2"/><path d="M24 233 q6 -5 12 0" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="30" cy="226" r="2" fill="#e2445e" stroke="${INK}" stroke-width="1"/><path d="M10 246 Q10 214 30 214 Q50 214 50 246Z" fill="rgba(220,240,255,.55)" ${BO}/><path d="M16 238 Q16 222 28 218" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".85"/><circle cx="30" cy="212" r="3" fill="#d8ccd4" stroke="${INK}" stroke-width="1.6"/>`;
  s+=`<rect x="508" y="226" width="18" height="22" rx="4" fill="url(#kJar2)" ${BO}/><path d="M512 230 v12" stroke="#fff" stroke-width="2" opacity=".8" stroke-linecap="round"/><circle cx="517" cy="242" r="3.4" fill="#f2c45a" stroke="${INK}" stroke-width="1.2"/><circle cx="520" cy="238" r="3" fill="#f2c45a" stroke="${INK}" stroke-width="1.2"/>`;
  if(S.own.coussins)[100,300,500].forEach(x=>s+=`<ellipse cx="${x}" cy="378" rx="24" ry="4" fill="#3d2a35" opacity=".15"/><rect x="${x-4}" y="338" width="8" height="40" fill="#a8785a" ${BO}/><rect x="${x-30}" y="322" width="60" height="18" rx="9" fill="#c9b8f2" ${BO}/><path d="M${x-24} 334 h48" stroke="#3d2a35" stroke-width="2" opacity=".15"/><ellipse cx="${x}" cy="322" rx="30" ry="7" fill="#ffc7d8" ${BO}/><ellipse cx="${x-8}" cy="320" rx="12" ry="2.4" fill="#fff" opacity=".6"/>`);
  if(S.own.fauteuils)[[44,1],[556,-1]].forEach(([x,f])=>s+=`<rect x="${x-30}" y="318" width="60" height="40" rx="14" fill="#f6a5b4" ${BO}/><path d="M${x-22} 324 q22 -4 44 0" fill="none" stroke="#fff" stroke-width="2" opacity=".55"/><rect x="${x-38}" y="332" width="16" height="34" rx="7" fill="#f59a8b" ${BO}/><rect x="${x+22}" y="332" width="16" height="34" rx="7" fill="#f59a8b" ${BO}/><rect x="${x-22}" y="340" width="44" height="20" rx="6" fill="#ffd6e0" ${BO}/><circle cx="${x}" cy="350" r="2" fill="#f59a8b" stroke="${INK}" stroke-width="1"/>`);
  const g=(id,a,b,o1,o2)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}" stop-opacity="${o1}"/><stop offset="1" stop-color="${b}" stop-opacity="${o2}"/></linearGradient>`;
  return `<svg class="full" viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${g("kTop2","#ffffff","#3d2a35",.3,.15)}${g("kPanel2","#3d2a35","#ffffff",.12,.12)}<linearGradient id="kJar2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8f4fb"/><stop offset="1" stop-color="#b9d8ea"/></linearGradient></defs><g filter="url(#wobble)">${s}</g></svg>`;
}
function renderDecor(){
  $("bgl").innerHTML=bgSVG();$("counter").innerHTML=counterSVG();
  // le compagnon : assis pendant le service, endormi quand le café est fermé
  $("helper").innerHTML=S.own.serveur?`<div class="buddy" style="position:absolute;left:3%;bottom:30%;width:11%"><div>${foxSVG({...FOX[buddy()],scale:1},{pose:G&&G.run?"sit":"sleep"})}</div></div>`:"";
}
// petit saut de joie du compagnon (combo, service)
function buddyHop(){const b=document.querySelector("#helper .buddy>div");if(!b)return;b.classList.remove("hop");void b.offsetWidth;b.classList.add("hop")
}
