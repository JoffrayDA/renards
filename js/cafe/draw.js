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
const icon=(k,sea=SEA)=>`<svg viewBox="0 0 40 40" aria-hidden="true">${(HW&&ICON[k+"@halloween"])||ICON[k+"@"+sea]||ICON[k]||""}</svg>`;
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
function outsideSVG(sea){
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
const books=(x,y,cs)=>cs.map((c,i)=>{const h=[22,18,24,20,16][i%5];return `<rect x="${x+i*9}" y="${y-h}" width="8" height="${h}" rx="1.5" fill="${c}" stroke="${INK}" stroke-width="2"/>`}).join("");
function roomSVG(night){
  let s="";const W=styleOf("wall");
  // reflets sur les vitres, montants et traverse de la véranda
  for(let i=0;i<PANES.length-1;i++){const x=PANES[i];s+=`<path d="M${x+28} ${GY0+12} l-16 34 M${x+44} ${GY0+12} l-8 17" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="${night?.12:.4}"/>`}
  s+=`<rect x="${GX0}" y="60" width="${GX1-GX0}" height="7" fill="#fffaf2" ${BO}/>`;
  PANES.slice(1,-1).forEach(x=>s+=`<rect x="${x-5}" y="${GY0}" width="10" height="${GY1-GY0}" fill="#fffaf2" ${BO}/>`);
  // murs de côté, poutre, rebord et soubassement
  [[-6,GX0+6],[GX1-6,612]].forEach(([a,b])=>{s+=`<rect x="${a}" y="-4" width="${b-a}" height="${GY1+8}" fill="${W.w}" ${BO}/>`;for(let y=34;y<GY1;y+=24)for(let x=a+12+(y/24%2)*10;x<b-6;x+=20)s+=`<circle cx="${x}" cy="${y}" r="2" fill="${W.d}"/>`});
  [GX0,GX1].forEach(x=>s+=`<rect x="${x-6}" y="${GY0}" width="12" height="${GY1-GY0}" fill="#fffaf2" ${BO}/>`);
  s+=`<rect x="-6" y="-4" width="612" height="${GY0+4}" fill="#c8946a" ${BO}/><path d="M40 10 h60 M180 8 h90 M360 12 h70 M500 9 h60" stroke="#a8785a" stroke-width="2" stroke-linecap="round"/>`;
  s+=`<rect x="-6" y="${GY1}" width="612" height="12" rx="4" fill="#c8946a" ${BO}/><rect x="-6" y="${GY1+12}" width="612" height="64" fill="${W.b}" ${BO}/>`;
  for(let x=12;x<600;x+=30)s+=`<path d="M${x} ${GY1+18} V${GY1+60}" stroke="${W.l}" stroke-width="3" stroke-linecap="round"/>`;
  // étagère de gauche : bocaux et livres
  s+=`<rect x="34" y="84" width="46" height="7" rx="2" fill="#c8946a" ${BO}/><rect x="34" y="146" width="46" height="7" rx="2" fill="#c8946a" ${BO}/>`;
  s+=`<rect x="40" y="60" width="16" height="24" rx="5" fill="#cfe4f2" ${BO}/><rect x="42" y="55" width="12" height="6" rx="2" fill="#a8785a" stroke="${INK}" stroke-width="2"/><rect x="60" y="66" width="15" height="18" rx="5" fill="#f7d77a" ${BO}/><rect x="62" y="61" width="11" height="6" rx="2" fill="#a8785a" stroke="${INK}" stroke-width="2"/>`;
  s+=books(39,146,["#9ec3ef","#f59a8b","#a9d68f","#f6a5c8"]);
  // étagère de droite : tourne-disque (ou livres), et une plante bien posée dessus
  s+=`<rect x="520" y="84" width="46" height="7" rx="2" fill="#c8946a" ${BO}/><rect x="520" y="146" width="46" height="7" rx="2" fill="#c8946a" ${BO}/>`;
  if(S.own.disque)s+=`<rect x="522" y="66" width="42" height="18" rx="3" fill="#c8946a" ${BO}/><ellipse cx="538" cy="66" rx="13" ry="4.2" fill="#3d2a35" ${BO}/><circle cx="538" cy="66" r="2.2" fill="#f47f9a"/><path d="M558 66 L551 55" stroke="${INK}" stroke-width="2.6"/>`;
  else s+=`<path d="M526 84 h26 v-6 h-26z M528 78 h22 v-6 h-22z M530 72 h18 v-6 h-18z" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  s+=S.own.plantes?potSVG(543,146,.85):books(526,146,["#c9b8f2","#f2c75c","#9ec3ef","#f59a8b"]);
  // lampe suspendue
  s+=`<path d="M300 ${GY0} V36" stroke="${INK}" stroke-width="2.4"/><ellipse cx="300" cy="62" rx="${night?62:42}" ry="${night?26:14}" fill="#fff3a8" opacity="${night?.6:.5}" filter="url(#soft)"/><path d="M280 52 Q300 28 320 52Z" fill="#f2c75c" ${BO}/>`;
  if(S.own.plantes){
    s+=potSVG(GX0+26,GY1,1)+potSVG(GX1-26,GY1,1);
    s+=`<path d="M140 ${GY0} L150 40 L160 ${GY0}" fill="none" stroke="${INK}" stroke-width="2"/><path d="M140 40 H160 L156 52 H144Z" fill="#fff5e8" ${BO}/><path d="M142 50 q-6 14 -2 28 M150 52 q0 16 4 30 M158 50 q6 12 2 24" fill="none" stroke="#6fae5e" stroke-width="4" stroke-linecap="round"/>`;
  }
  if(S.own.guirlande){s+=`<path d="M-10 ${GY0} Q150 62 300 30 T610 ${GY0}" fill="none" stroke="${INK}" stroke-width="2"/>`;
    for(let i=0;i<14;i++){const x=10+i*44,t=x<300?x/300:(x-300)/300,y=x<300?GY0+(30-GY0)*t+24*Math.sin(Math.PI*t):30+(GY0-30)*t-14*Math.sin(Math.PI*t);
      const c=(HW?["#f2a35c","#b48ae0","#f7d77a","#8fca7a"]:["#f2c75c","#f47f9a","#9ec3ef","#8fca7a"])[i%4];s+=`<circle cx="${x}" cy="${y+6}" r="${night?14:10}" fill="${c}" opacity="${night?.6:.35}" filter="url(#soft)"/><ellipse cx="${x}" cy="${y+6}" rx="4.5" ry="6" fill="${c}" stroke="${INK}" stroke-width="2"/>`}}
  if(HW){
    // toiles d'araignée dans les coins de la vitre, citrouilles sur le rebord, guirlande de petites chauves-souris
    [[GX0+6,GY0,1],[GX1-6,GY0,-1]].forEach(([x,y,d])=>{s+=`<g fill="none" stroke="#fff" stroke-width="1.6" opacity=".8">${[0,30,60,90].map(a=>{const r=a*Math.PI/180;return `<path d="M${x} ${y} L${x+d*Math.cos(r)*46} ${y+Math.sin(r)*46}"/>`}).join("")}${[16,30,44].map(r=>`<path d="M${x+d*r} ${y} Q${x+d*r*.8} ${y+r*.4} ${x+d*r*.87} ${y+r*.5} Q${x+d*r*.55} ${y+r*.65} ${x+d*r*.5} ${y+r*.87} Q${x+d*r*.3} ${y+r*.75} ${x} ${y+r}"/>`).join("")}</g>`});
    s+=jack(150,GY1+2,.62)+jack(452,GY1+2,.52)+jack(66,84,.42);
    s+=`<path d="M${GX0} ${GY0+4} Q300 ${GY0+44} ${GX1} ${GY0+4}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
    for(let i=1;i<9;i++){const t=i/9,x=GX0+(GX1-GX0)*t,y=GY0+11+80*t*(1-t);s+=`<path d="M${x} ${y} q-5 -6 -12 -4 q3 3 2 6 q4 -2 5 2 q2 -2 5 -4 q3 2 5 4 q1 -4 5 -2 q-1 -3 2 -6 q-7 -2 -12 4Z" fill="${i%2?"#5f4f72":"#f2a35c"}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`}
  }
  if(S.own.lanternes)[[232,"#f59a8b"],[368,"#f2c75c"],[440,"#c9b8f2"]].forEach(([x,c],i)=>{const y=i===1?58:48;s+=`<path d="M${x} ${GY0} V${y-14}" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="22" fill="${c}" opacity="${night?.6:.35}" filter="url(#soft)"/><ellipse cx="${x}" cy="${y}" rx="12" ry="14" fill="${c}" ${BO}/><path d="M${x} ${y-14} V${y+14} M${x-6} ${y-12} Q${x-10} ${y} ${x-6} ${y+12} M${x+6} ${y-12} Q${x+10} ${y} ${x+6} ${y+12}" fill="none" stroke="${INK}" stroke-width="1.5"/>`});
  return s;
}
function bgSVG(){
  const o=outsideSVG(SEA),night=SEA==="hiver"||HW;
  return `<svg class="full" viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${o.defs}</defs><g filter="url(#wobble)">${o.st}</g>${o.an}<g filter="url(#wobble)">${roomSVG(night)}</g></svg>${S.own.disque?`<span class="notes">♪</span><span class="notes" style="left:90%;animation-delay:1.2s">♫</span>`:""}`;
}
function counterSVG(){
  const C=styleOf("counter");
  let s=`<rect x="-10" y="246" width="620" height="20" rx="8" fill="${C.t}" ${BO}/><rect x="0" y="264" width="600" height="120" fill="${C.f}" ${BO}/>`;
  for(let x=20;x<600;x+=96)s+=`<rect x="${x}" y="280" width="72" height="80" rx="8" fill="none" stroke="${C.p}" stroke-width="3"/>`;
  s+=`<rect x="548" y="214" width="44" height="34" rx="5" fill="#f59a8b" ${BO}/><rect x="554" y="220" width="32" height="10" rx="2" fill="#fff5e8" stroke="${INK}" stroke-width="2"/><rect x="560" y="204" width="22" height="12" rx="3" fill="#d8ccd4" stroke="${INK}" stroke-width="2"/>`;
  s+=`<path d="M10 246 Q10 214 30 214 Q50 214 50 246Z" fill="rgba(220,240,255,.75)" ${BO}/><circle cx="30" cy="236" r="9" fill="#f6a5c8" stroke="${INK}" stroke-width="2"/>`;
  if(S.own.coussins)[100,300,500].forEach(x=>s+=`<rect x="${x-4}" y="338" width="8" height="40" fill="#a8785a" ${BO}/><rect x="${x-30}" y="322" width="60" height="18" rx="9" fill="#c9b8f2" ${BO}/><ellipse cx="${x}" cy="322" rx="30" ry="7" fill="#ffc7d8" ${BO}/>`);
  if(S.own.fauteuils)[[44,1],[556,-1]].forEach(([x,f])=>s+=`<rect x="${x-30}" y="318" width="60" height="40" rx="14" fill="#f6a5b4" ${BO}/><rect x="${x-38}" y="332" width="16" height="34" rx="7" fill="#f59a8b" ${BO}/><rect x="${x+22}" y="332" width="16" height="34" rx="7" fill="#f59a8b" ${BO}/><rect x="${x-22}" y="340" width="44" height="20" rx="6" fill="#ffd6e0" ${BO}/>`);
  return `<svg class="full" viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g filter="url(#wobble)">${s}</g></svg>`;
}
function renderDecor(){
  $("bgl").innerHTML=bgSVG();$("counter").innerHTML=counterSVG();
  $("helper").innerHTML=S.own.serveur?`<div style="position:absolute;left:3%;bottom:30%;width:11%">${foxSVG({...FOX.petitpois,scale:1},{pose:"happy"})}</div>`:"";
}
