/* Musique du Kitsune Café, partagée par les trois pages. Tout est synthétisé (Web Audio) : aucun fichier, aucune licence.
   Chaque page dit quel morceau elle veut (MUSIC.want) ; il démarre au premier toucher (règle des navigateurs).
   Un bouton [data-sound] coupe ou remet le son, choix mémorisé dans localStorage « renards-son ».
   Morceaux : boite (accueil), ukulele (carte du café), service (en jeu), foret (Clairière), fantomes (Halloween), piazza, tarantella et polka (Petite Italie), musette et galop (Paris), lofi (en réserve). */
const MUSIC=(()=>{
  // Un jeu ouvert dans l'accueil (iframe) n'a pas son propre son : il pilote la musique de l'accueil, qui a déjà eu
  // son toucher de départ et continue de jouer d'une page à l'autre. Le bouton maison referme le jeu.
  let host=null;try{if(window.parent!==window&&window.parent.MUSIC&&window.parent.openGame)host=window.parent}catch(e){}
  if(host){
    const H=host.MUSIC;
    const paint=()=>document.querySelectorAll("[data-sound]").forEach(b=>{b.innerHTML=H.icon();b.setAttribute("aria-label",H.on?"Couper la musique":"Remettre la musique")});
    document.addEventListener("click",e=>{if(e.target.closest("[data-sound]")){H.setOn(!H.on);paint()}
      const a=e.target.closest("a.home");if(a){e.preventDefault();host.closeGame()}});
    const st=document.createElement("style");st.textContent=H.css;document.head.appendChild(st);
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",paint);else paint();
    return{want:id=>H.want(id),setOn:v=>{H.setOn(v);paint()},paint,play:id=>H.want(id),stop(){},volume(){},jingle:id=>H.jingle&&H.jingle(id),note:m=>H.note&&H.note(m),sfx:(k,n)=>H.sfx&&H.sfx(k,n),jingleEnd:()=>H.jingleEnd&&H.jingleEnd(),get on(){return H.on},get current(){return H.current}};
  }
  let C=null,master,rev,bus=null,timer=null,cur=null,noise,vol=.7;
  const MUSIC_GREL="B"; // le grelot choisi par Joffray (sfx, plus bas)
  const hz=m=>440*Math.pow(2,(m-69)/12);
  function init(){
    if(C)return;
    C=new (window.AudioContext||window.webkitAudioContext)();
    const comp=C.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=3;
    master=C.createGain();master.gain.value=vol;master.connect(comp);comp.connect(C.destination);
    rev=C.createConvolver();const n=C.sampleRate*2.6,b=C.createBuffer(2,n,C.sampleRate);
    for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.6)}
    rev.buffer=b;const rg=C.createGain();rg.gain.value=.32;rev.connect(rg);rg.connect(master);
    noise=C.createBuffer(1,C.sampleRate,C.sampleRate);const nd=noise.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  }
  // chaque morceau a son bus : on peut le faire taire en fondu sans couper la réverbération des autres
  function newBus(){const dry=C.createGain(),send=C.createGain();dry.connect(master);send.connect(rev);return{dry,send}}
  function out(node,wet=.3){node.connect(bus.dry);const s=C.createGain();s.gain.value=wet;node.connect(s);s.connect(bus.send)}
  function osc(type,f,t,end,detune=0){const o=C.createOscillator();o.type=type;o.frequency.value=f;o.detune.value=detune;o.start(t);o.stop(end);return o}
  function gain(t,a,peak,d,floor=.0001){const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(floor,t+a+d);return g}
  function noiseSrc(t,end){const s=C.createBufferSource();s.buffer=noise;s.loop=true;s.start(t);s.stop(end);return s}
  function filt(type,f,q=.7){const x=C.createBiquadFilter();x.type=type;x.frequency.value=f;x.Q.value=q;return x}

  /* ---------- instruments ---------- */
  const I={
    // boîte à musique : une lame métallique (fondamentale + partiels aigus qui s'éteignent vite)
    box(m,t,v=.22,d=1.8){const f=hz(m),g=gain(t,.004,v,d);[[1,1],[4,.16],[5.4,.06]].forEach(([k,a])=>{const gg=gain(t,.003,a,d/(k>1?3:1));osc("sine",f*k,t,t+d+.1).connect(gg);gg.connect(g)});out(g,.45)},
    // piano électrique doux
    keys(m,t,v=.12,d=1.6){const f=hz(m),g=gain(t,.01,v,d);osc("sine",f,t,t+d+.1).connect(g);const g2=gain(t,.01,v*.35,d*.5);osc("triangle",f*2,t,t+d+.1,4).connect(g2);g2.connect(g);out(g,.3)},
    // corde pincée (ukulélé, harpe) : dent de scie filtrée qui se referme vite
    pluck(m,t,v=.12,d=.7,bright=3200){const f=hz(m),lp=filt("lowpass",bright,1.2);lp.frequency.setValueAtTime(bright,t);lp.frequency.exponentialRampToValueAtTime(500,t+d*.6);const g=gain(t,.003,v,d);osc("sawtooth",f,t,t+d+.1).connect(lp);lp.connect(g);out(g,.35)},
    harp(m,t,v=.13){const f=hz(m),g=gain(t,.003,v,1.6);osc("triangle",f,t,t+1.7).connect(g);const g2=gain(t,.003,v*.4,.5);osc("sine",f*2,t,t+.6).connect(g2);g2.connect(g);out(g,.5)},
    pizz(m,t,v=.2){const f=hz(m),lp=filt("lowpass",1400),g=gain(t,.003,v,.22);osc("triangle",f,t,t+.3).connect(lp);lp.connect(g);out(g,.25)},
    // sifflement / flûte : vibrato qui arrive après l'attaque, un souffle léger
    flute(m,t,dur,v=.1,breath=.02){const f=hz(m),o=osc("sine",f,t,t+dur+.2),lfo=osc("sine",5.4,t,t+dur+.2),lg=C.createGain();lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.006,t+.25);lfo.connect(lg);lg.connect(o.frequency);
      const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.06);g.gain.setValueAtTime(v,t+Math.max(.07,dur-.08));g.gain.linearRampToValueAtTime(0,t+dur+.12);o.connect(g);
      if(breath){const bp=filt("bandpass",f*2,4),bg=C.createGain();bg.gain.setValueAtTime(0,t);bg.gain.linearRampToValueAtTime(breath,t+.05);bg.gain.linearRampToValueAtTime(0,t+dur);noiseSrc(t,t+dur+.1).connect(bp);bp.connect(bg);bg.connect(g)}
      out(g,.4)},
    bass(m,t,dur,v=.22){const f=hz(m),lp=filt("lowpass",520),g=gain(t,.01,v,Math.max(.2,dur));osc("triangle",f,t,t+dur+.3).connect(lp);lp.connect(g);out(g,.05)},
    pad(ns,t,dur,v=.035){const lp=filt("lowpass",900),g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.9);g.gain.setValueAtTime(v,t+dur-.6);g.gain.linearRampToValueAtTime(0,t+dur+.6);
      ns.forEach(m=>[-7,7].forEach(dt=>osc("sawtooth",hz(m),t,t+dur+.7,dt).connect(lp)));lp.connect(g);out(g,.6)},
    kick(t,v=.5){const o=osc("sine",120,t,t+.3);o.frequency.exponentialRampToValueAtTime(42,t+.14);const g=gain(t,.002,v,.26);o.connect(g);out(g,0)},
    snare(t,v=.18){const bp=filt("bandpass",1900,.8),g=gain(t,.002,v,.16);noiseSrc(t,t+.2).connect(bp);bp.connect(g);out(g,.2)},
    hat(t,v=.05){const hp=filt("highpass",7000),g=gain(t,.001,v,.045);noiseSrc(t,t+.08).connect(hp);hp.connect(g);out(g,.05)},
    shaker(t,v=.04){const hp=filt("highpass",5000),g=gain(t,.01,v,.07);noiseSrc(t,t+.1).connect(hp);hp.connect(g);out(g,.1)},
    clap(t,v=.1){[0,.012,.025].forEach(o=>{const bp=filt("bandpass",1300,1),g=gain(t+o,.001,v,.08);noiseSrc(t+o,t+o+.12).connect(bp);bp.connect(g);out(g,.3)})},
    wood(t,v=.12){const g=gain(t,.001,v,.07);osc("sine",880,t,t+.1).connect(g);const g2=gain(t,.001,v*.5,.04);osc("sine",1420,t,t+.08).connect(g2);g2.connect(g);out(g,.2)},
    // cuivres (le thème de la bande) : deux dents de scie, le filtre s'ouvre à l'attaque
    brass(m,t,dur,v=.07){const f=hz(m),lp=filt("lowpass",700,2);lp.frequency.setValueAtTime(700,t);lp.frequency.linearRampToValueAtTime(2800,t+.04);lp.frequency.exponentialRampToValueAtTime(1300,t+.25);
      const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.025);g.gain.setValueAtTime(v*.8,t+Math.max(.05,dur-.05));g.gain.linearRampToValueAtTime(0,t+dur+.06);
      [-8,8].forEach(dt=>osc("sawtooth",f,t,t+dur+.1,dt).connect(lp));lp.connect(g);out(g,.15)},
    // marimba : bois chaud, très court
    marimba(m,t,v=.2){const f=hz(m),g=gain(t,.002,v,.35);osc("sine",f,t,t+.4).connect(g);const g2=gain(t,.002,v*.35,.08);osc("sine",f*4,t,t+.12).connect(g2);g2.connect(g);out(g,.25)},
    // accord plaqué, cuivré et bref
    stab(ns,t,v=.05){const lp=filt("lowpass",2400,1),g=gain(t,.004,v,.16);ns.forEach(m=>[-6,6].forEach(dt=>osc("sawtooth",hz(m),t,t+.25,dt).connect(lp)));lp.connect(g);out(g,.2)},
    openhat(t,v=.04){const hp=filt("highpass",6000),g=gain(t,.002,v,.16);noiseSrc(t,t+.2).connect(hp);hp.connect(g);out(g,.1)},
    // mandoline : corde pincée claire, trémolo (on gratte vite et en continu) sur les notes longues
    mando(m,t,dur,v=.06){const step=.068,n=dur<.3?1:Math.max(2,Math.round(dur/step));
      for(let i=0;i<n;i++){const tt=t+i*step,a=i===0?1:(i%2?.55:.7);I.pluck(m,tt,v*a,i===n-1?.4:.16,3800);I.pluck(m+12,tt+.004,v*a*.25,.12,4200)}},
    // accordéon : deux anches légèrement désaccordées, un battement doux
    accord(ns,t,dur,v=.03){const lp=filt("lowpass",1800,.8),g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.setValueAtTime(v*.85,t+Math.max(.03,dur-.04));g.gain.linearRampToValueAtTime(0,t+dur+.05);
      ns.forEach(m=>[-9,9].forEach(dt=>osc("square",hz(m),t,t+dur+.1,dt).connect(lp)));lp.connect(g);out(g,.2)},
    bird(t,v=.05){[0,.13].forEach(o=>{const s=osc("sine",2600,t+o,t+o+.1);s.frequency.exponentialRampToValueAtTime(4300,t+o+.08);const g=gain(t+o,.005,v,.08);s.connect(g);out(g,.5)})},
    // craquement de vinyle (ambiance lo-fi) : petits clics au hasard
    crackle(t,dur){for(let i=0;i<dur*7;i++){const tt=t+Math.random()*dur,g=gain(tt,.001,.02+Math.random()*.03,.01),hp=filt("highpass",2500);noiseSrc(tt,tt+.02).connect(hp);hp.connect(g);out(g,0)}}
  };
  const chord=(root,iv)=>iv.map(x=>root+x);

  /* ---------- morceaux ---------- */
  // mel : [note MIDI ou null, durée en temps] mesure par mesure
  function melody(inst,bars,bar,t0,beat,extra){let t=t0;for(const [m,d] of bars[bar])  {if(m!=null)inst(m,t,d*beat,extra);t+=d*beat}}
  const TRACKS={
    boite:{name:"Boîte à musique",bpm:96,beats:3,bars:8,
      ch:[[53,57,60],[50,53,57],[46,50,53],[48,52,55],[53,57,60],[50,53,57],[43,46,50],[48,52,55]],
      mel:[[[77,1],[76,.5],[74,.5],[72,1]],[[74,1.5],[72,.5],[69,1]],[[70,1],[74,1],[77,1]],[[76,2],[72,1]],[[77,1],[79,.5],[77,.5],[76,1]],[[74,1],[77,1],[74,1]],[[70,1],[72,.5],[74,.5],[76,1]],[[76,3]]],
      bar(b,t,B){const c=this.ch[b];[c[0]+12,c[1]+12,c[2]+12,c[0]+24,c[2]+12,c[1]+12].forEach((m,i)=>I.box(m,t+i*B/2,.07,1.2));
        melody((m,tt)=>I.box(m+12,tt,.2,1.8),this.mel,b,t,B);I.bass(c[0]-12,t,B*2.5,.14);I.pad(c.map(x=>x+12),t,B*3,.02)}},
    lofi:{name:"Café lo-fi",bpm:76,beats:4,bars:8,crackle:true,
      ch:[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59],[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]],
      mel:[[[null,1],[76,.5],[79,.5],[81,1],[79,1]],[[76,1.5],[74,.5],[72,2]],[[null,1],[74,.5],[76,.5],[77,1],[76,1]],[[72,2],[null,2]],
           [[null,.5],[81,.5],[84,1],[81,.5],[79,.5],[76,1]],[[79,2],[76,2]],[[74,1],[77,1],[76,1],[74,1]],[[72,3],[null,1]]],
      bar(b,t,B){const c=this.ch[b],sw=x=>x%1?x+.16:x; // léger swing sur les croches
        [0,1.5].forEach(x=>c.forEach(m=>I.keys(m+12,t+sw(x)*B,.06,x?1.4:1.9)));
        I.bass(c[0]-12,t,B*1.4,.24);I.bass(c[0]-12,t+sw(2.5)*B,B*.9,.18);
        [0,2.5].forEach(x=>I.kick(t+sw(x)*B,.42));[1,3].forEach(x=>I.snare(t+x*B,.12));
        for(let i=0;i<8;i++)I.hat(t+sw(i/2)*B,i%2?.025:.04);
        melody((m,tt,d)=>I.keys(m+12,tt,.09,Math.max(.6,d*1.2)),this.mel,b,t,B)}},
    ukulele:{name:"Pique-nique ukulélé",bpm:116,beats:4,bars:8,
      ch:[[60,64,67,72],[55,59,62,67],[57,60,64,69],[53,57,60,65],[60,64,67,72],[55,59,62,67],[57,60,64,69],[53,57,60,65]],
      mel:[[[76,1],[79,1],[79,.5],[81,.5],[79,1]],[[74,1],[79,1],[77,.5],[76,.5],[74,1]],[[72,1],[76,1],[81,1],[79,1]],[[77,1],[76,.5],[74,.5],[72,2]],
           [[84,1],[83,.5],[81,.5],[79,1],[76,1]],[[74,1],[76,.5],[77,.5],[79,2]],[[81,1],[79,1],[76,1],[72,1]],[[74,1.5],[76,.5],[72,2]]],
      bar(b,t,B){const c=this.ch[b];
        [[0,1],[1,.7],[1.5,.6],[2.5,.6],[3,.8]].forEach(([x,v])=>c.forEach((m,i)=>I.pluck(m,t+x*B+i*.012,.05*v,.45,2600)));
        I.bass(c[0]-12,t,B*.9,.2);I.bass(c[0]-5,t+2*B,B*.9,.16);
        for(let i=0;i<8;i++)I.shaker(t+i*B/2,i%2?.025:.04);[1,3].forEach(x=>I.clap(t+x*B,.05));
        melody((m,tt,d)=>I.flute(m,tt,d,.07,0),this.mel,b,t,B)}},
    foret:{name:"Forêt enchantée",bpm:68,beats:4,bars:8,birds:true,
      ch:[[62,66,69,73],[55,59,62,66],[59,62,66,69],[57,61,64,69],[62,66,69,73],[55,59,62,66],[59,62,66,69],[57,61,64,69]],
      mel:[[[78,2],[81,2]],[[79,3],[78,1]],[[74,2],[76,1],[78,1]],[[76,4]],[[81,2],[83,1],[81,1]],[[79,2],[78,2]],[[76,1],[78,1],[74,2]],[[76,4]]],
      bar(b,t,B){const c=this.ch[b];
        for(let i=0;i<8;i++)I.harp(c[i%4]+(i>=4?12:0),t+i*B/2,.08);
        I.pad(c,t,B*4,.03);I.bass(c[0]-12,t,B*3.5,.14);
        melody((m,tt,d)=>I.flute(m,tt,d,.075,.025),this.mel,b,t,B);
        if(Math.random()<.5)I.bird(t+(1+Math.random()*2)*B,.035)}},
    // la Petite Italie (js/cafe/italie.js), mélodies originales : une valse de terrasse sur la carte (mandoline, accordéon)…
    piazza:{name:"Valse de la piazza",bpm:150,beats:3,bars:16,
      ch:[[55,59,62],[55,59,62],[50,54,57,60],[50,54,57,60],[50,54,57,60],[50,54,57,60],[55,59,62],[55,59,62],
          [55,59,62,65],[55,59,62,65],[48,52,55],[48,52,55],[57,60,64],[50,54,57,60],[55,59,62],[55,59,62]],
      mel:[[[74,1],[79,1],[83,1]],[[83,1.5],[81,.5],[79,1]],[[78,1],[81,1],[84,1]],[[84,2],[83,1]],
           [[81,1],[78,1],[74,1]],[[76,1.5],[78,.5],[81,1]],[[79,1],[78,1],[79,1]],[[83,2],[null,1]],
           [[83,1],[84,1],[86,1]],[[86,1.5],[84,.5],[83,1]],[[84,1],[88,1],[84,1]],[[83,1],[81,1],[79,1]],
           [[81,1.5],[83,.5],[84,1]],[[86,1],[84,1],[78,1]],[[79,1],[83,1],[86,1]],[[79,2],[null,1]]],
      bar(b,t,B){const c=this.ch[b];
        I.bass((b%2?c[2]-12:c[0]-12),t,B*.8,.26);[1,2].forEach(x=>I.accord(c.map(m=>m+12),t+x*B,B*.45,.04));
        I.shaker(t,.035);[1,2].forEach(x=>I.shaker(t+x*B,.02));
        melody((m,tt,d)=>I.mando(m,tt,d*.95,.1),this.mel,b,t,B);
        if(b===7||b===15)I.accord([c[0]+24],t+2*B,B*.9,.02)}},
    // … et une tarentelle pour le service (6/8, la mineur), au même entrain que « Coup de feu »
    tarantella:{name:"Tarentelle du Caffè",bpm:380,beats:6,bars:8,
      ch:[[45,48,52],[50,53,57],[52,56,59],[45,48,52],[45,48,52],[50,53,57],[52,56,59,62],[45,48,52]],
      mel:[[[76,1],[72,1],[76,1],[81,2],[76,1]],[[77,1],[74,1],[77,1],[81,2],[77,1]],[[76,1],[75,1],[76,1],[80,1],[83,1],[80,1]],[[81,3],[76,3]],
           [[84,1],[83,1],[81,1],[83,1],[81,1],[79,1]],[[77,1],[81,1],[77,1],[74,3]],[[76,1],[80,1],[83,1],[86,1],[83,1],[80,1]],[[81,2],[76,1],[69,3]]],
      bar(b,t,B){const c=this.ch[b],r=c[0]-12;
        I.bass(r,t,B*1.6,.22);I.bass(r+7,t+3*B,B*1.6,.18);[0,3].forEach(x=>I.kick(t+x*B,.34));
        [1,2,4,5].forEach(x=>I.accord(c.map(m=>m+12),t+x*B,B*.55,.02));
        for(let i=0;i<6;i++){I.shaker(t+i*B,i%3?.022:.045);if(i%3===0)I.hat(t+i*B,.03)}
        if(b===7)[3,4,5].forEach((x,i)=>I.snare(t+x*B,.05+i*.025));
        melody((m,tt,d)=>{I.mando(m,tt,d*.9,.06);if(d>.3)I.accord([m],tt,d*.8,.012)},this.mel,b,t,B)}},
    // autres propositions pour la Petite Italie (tools/italie-musique.html), originales : barcarolle de gondole (6/8, ré mineur)…
    barcarola:{name:"Barcarolle du canal",bpm:200,beats:6,bars:8,
      ch:[[50,53,57],[50,53,57],[45,49,52,55],[50,53,57],[43,46,50],[50,53,57],[45,49,52,55],[50,53,57]],
      mel:[[[69,3],[74,2],[72,1]],[[69,2],[65,1],[67,2],[69,1]],[[73,3],[76,2],[73,1]],[[74,6]],
           [[70,3],[74,2],[79,1]],[[77,2],[74,1],[69,3]],[[76,2],[73,1],[71,2],[73,1]],[[74,4],[null,2]]],
      bar(b,t,B){const c=this.ch[b],r=c[0];
        [r,r+7,r+12,c[1]+12,r+12,r+7].forEach((m,i)=>I.harp(m,t+i*B,.07));I.bass(r-12,t,B*5,.18);I.pad(c.map(m=>m+12),t,B*6,.018);
        melody((m,tt,d)=>{I.accord([m],tt,d*.92,.04);I.mando(m+12,tt,.1,.02)},this.mel,b,t,B)}},
    // … un petit swing de scooter (do majeur), contrebasse qui marche, balais…
    vespa:{name:"Swing en Vespa",bpm:120,beats:4,bars:8,
      ch:[[48,52,55],[45,49,52,55],[50,53,57],[43,47,50,53],[48,52,55],[45,49,52,55],[50,53,57],[43,47,50,53]],
      mel:[[[76,1],[79,.5],[76,.5],[72,1],[76,1]],[[73,1.5],[76,.5],[81,2]],[[77,1],[81,.5],[77,.5],[74,1],[77,1]],[[79,3],[null,1]],
           [[84,1],[83,.5],[81,.5],[79,1],[76,1]],[[81,1],[79,.5],[76,.5],[73,2]],[[74,1],[77,1],[81,1],[79,1]],[[77,1],[74,1],[71,1],[67,1]]],
      bar(b,t,B){const c=this.ch[b],sw=x=>x%1?x+.16:x;
        [c[0],c[1],c[2],c[1]].forEach((m,i)=>I.bass(m-12,t+i*B,B*.85,.22));
        for(let i=0;i<8;i++)I.shaker(t+sw(i/2)*B,i%2?.02:.035);[1,3].forEach(x=>{I.snare(t+x*B,.05);I.accord(c.map(m=>m+12),t+x*B,B*.3,.03)});
        melody((m,tt,d)=>{I.mando(m,tt,d*.9,.07);I.accord([m],tt,d*.85,.015)},this.mel,b,t,B)}},
    // … et une polka qui file pour le service (sol majeur, oum-pa)
    polka:{name:"Polka du cornetto",bpm:280,beats:4,bars:8,
      ch:[[55,59,62],[55,59,62],[50,54,57,60],[55,59,62],[48,52,55],[55,59,62],[50,54,57,60],[55,59,62]],
      mel:[[[71,1],[74,1],[79,1],[74,1]],[[83,1],[81,1],[79,2]],[[78,1],[81,1],[84,1],[81,1]],[[79,2],[74,2]],
           [[76,1],[79,1],[84,1],[79,1]],[[83,1],[79,1],[74,2]],[[81,1],[78,1],[74,1],[78,1]],[[79,3],[null,1]]],
      bar(b,t,B){const c=this.ch[b];
        I.bass(c[0]-12,t,B*.8,.24);I.bass(c[2]-12,t+2*B,B*.8,.2);[0,2].forEach(x=>I.kick(t+x*B,.34));
        [1,3].forEach(x=>{I.accord(c.map(m=>m+12),t+x*B,B*.5,.03);I.clap(t+x*B,.04)});for(let i=0;i<4;i++)I.shaker(t+i*B,.03);
        if(b===7)[2,2.5,3,3.5].forEach((x,i)=>I.snare(t+x*B,.05+i*.02));
        melody((m,tt,d)=>{I.mando(m,tt,d*.9,.07);I.box(m+12,tt,.05,.5)},this.mel,b,t,B)}},
    // Paris (js/cafe/paris.js), mélodies originales : une valse musette à l'accordéon sur la carte (la mineur)…
    musette:{name:"Valse musette",bpm:168,beats:3,bars:16,
      ch:[[57,60,64],[57,60,64],[50,53,57],[50,53,57],[52,56,59,62],[52,56,59,62],[57,60,64],[57,61,64,67],
          [50,53,57],[50,53,57],[57,60,64],[57,60,64],[47,51,54,57],[52,56,59,62],[57,60,64],[57,60,64]],
      mel:[[[76,1],[75,.5],[76,.5],[81,1]],[[79,1.5],[77,.5],[76,1]],[[77,1],[76,.5],[77,.5],[81,1]],[[74,2],[null,1]],
           [[71,1],[74,1],[77,1]],[[80,1.5],[79,.5],[77,1]],[[76,1],[72,1],[69,1]],[[76,2],[null,1]],
           [[77,1],[79,.5],[81,.5],[82,1]],[[81,1.5],[79,.5],[77,1]],[[76,1],[77,.5],[79,.5],[81,1]],[[84,2],[81,1]],
           [[78,1],[81,1],[83,1]],[[80,1],[83,.5],[81,.5],[80,1]],[[81,1],[76,1],[72,1]],[[69,2],[null,1]]],
      bar(b,t,B){const c=this.ch[b];
        I.bass((b%2?c[2]-12:c[0]-12),t,B*.8,.26);[1,2].forEach(x=>I.accord(c.map(m=>m+12),t+x*B,B*.4,.035));
        I.shaker(t,.03);[1,2].forEach(x=>I.shaker(t+x*B,.018));
        melody((m,tt,d)=>{I.accord([m],tt,d*.92,.05);I.accord([m+12],tt,d*.85,.012)},this.mel,b,t,B)}},
    // autres propositions pour la carte de Paris (tools/paris-musique.html ; la musette en la mineur « fait Halloween », Joffray), toutes en majeur :
    // une valse de Montmartre, claire et dansante (fa majeur)…
    montmartre:{name:"Valse de Montmartre",bpm:176,beats:3,bars:16,
      ch:[[53,57,60],[53,57,60],[48,52,55,58],[48,52,55,58],[48,52,55,58],[48,52,55,58],[53,57,60],[53,57,60],
          [58,62,65],[58,62,65],[53,57,60],[50,53,57],[55,58,62],[48,52,55,58],[53,57,60],[53,57,60]],
      mel:[[[72,1],[77,1],[81,1]],[[81,1.5],[79,.5],[77,1]],[[76,1],[79,1],[84,1]],[[82,2],[79,1]],
           [[79,1],[81,.5],[79,.5],[76,1]],[[72,1],[76,1],[79,1]],[[77,1],[76,1],[77,1]],[[81,2],[null,1]],
           [[82,1],[81,1],[82,1]],[[86,1.5],[84,.5],[82,1]],[[81,1],[79,1],[81,1]],[[84,2],[81,1]],
           [[79,1],[81,.5],[82,.5],[84,1]],[[86,1],[84,1],[79,1]],[[77,1],[81,1],[84,1]],[[89,2],[null,1]]],
      bar(b,t,B){const c=this.ch[b];
        I.bass((b%2?c[2]-12:c[0]-12),t,B*.8,.24);[1,2].forEach(x=>I.accord(c.map(m=>m+12),t+x*B,B*.38,.03));
        [1,2].forEach(x=>I.pluck(c[0]+24,t+x*B,.03,.3,3000));I.shaker(t,.028);
        melody((m,tt,d)=>{I.accord([m],tt,d*.9,.045);I.box(m+12,tt,.03,.6)},this.mel,b,t,B)}},
    // … une promenade sur les quais, petit swing de guitare manouche et sifflet (sol majeur)…
    quais:{name:"Promenade sur les quais",bpm:112,beats:4,bars:8,
      ch:[[55,59,62,66],[52,55,59,62],[57,60,64,67],[50,54,57,60],[55,59,62,66],[52,55,59,62],[57,60,64,67],[50,54,57,60]],
      mel:[[[74,1],[79,.5],[78,.5],[79,1],[83,1]],[[81,1.5],[79,.5],[76,2]],[[72,1],[76,.5],[79,.5],[81,1],[79,1]],[[78,3],[null,1]],
           [[74,1],[79,.5],[81,.5],[83,1],[86,1]],[[84,1],[83,.5],[81,.5],[79,2]],[[76,1],[79,1],[81,1],[78,1]],[[79,3],[null,1]]],
      bar(b,t,B){const c=this.ch[b],sw=x=>x%1?x+.16:x;
        [0,1,2,3].forEach(x=>{I.bass(c[x%2?2:0]-12,t+x*B,B*.7,.2);c.forEach((m,i)=>I.pluck(m+12,t+x*B+i*.008,x%2?.04:.03,.18,2400))});
        for(let i=0;i<8;i++)I.shaker(t+sw(i/2)*B,i%2?.015:.025);
        melody((m,tt,d)=>I.flute(m,tt,d*.95,.07,.015),this.mel,b,t,B)}},
    // … et « Bonjour Paris », une chanson qui sautille : piano, accordéon en réponse (ré majeur)
    bonjour:{name:"Bonjour Paris",bpm:132,beats:4,bars:8,
      ch:[[50,54,57],[55,59,62],[57,61,64],[50,54,57],[55,59,62],[50,54,57],[52,55,59],[57,61,64,67]],
      mel:[[[78,1],[81,1],[78,1],[74,1]],[[76,1],[79,1],[83,2]],[[81,1],[79,1],[76,1],[73,1]],[[74,3],[null,1]],
           [[79,1],[83,1],[86,1],[83,1]],[[81,1],[78,1],[74,2]],[[76,1],[79,1],[78,1],[76,1]],[[73,1],[76,1],[81,2]]],
      bar(b,t,B){const c=this.ch[b];
        I.bass(c[0]-12,t,B*.8,.22);I.bass(c[2]-12,t+2*B,B*.8,.18);[1,3].forEach(x=>c.forEach(m=>I.keys(m+12,t+x*B,.05,.5)));
        [1,3].forEach(x=>I.clap(t+x*B,.03));for(let i=0;i<4;i++)I.shaker(t+i*B,.022);
        melody((m,tt,d)=>I.keys(m+12,tt,.1,Math.max(.4,d*1.1)),this.mel,b,t,B);
        if(b%2)I.accord([c[2]+12,c[0]+24],t+3.5*B,B*.45,.03)}},
    // deuxième série (Joffray : « 3 autres ») : une boîte à musique qui tourne en haut de la tour (do majeur)…
    tourbox:{name:"La boîte à musique de la tour",bpm:104,beats:3,bars:8,
      ch:[[48,52,55],[53,57,60],[55,59,62],[48,52,55],[57,60,64],[53,57,60],[55,59,62,65],[48,52,55]],
      mel:[[[76,1],[79,1],[84,1]],[[81,1.5],[79,.5],[77,1]],[[74,1],[79,1],[83,1]],[[84,2],[79,1]],
           [[81,1],[84,1],[88,1]],[[86,1],[84,1],[81,1]],[[79,1],[83,1],[86,1]],[[84,3]]],
      bar(b,t,B){const c=this.ch[b];[c[0]+12,c[1]+12,c[2]+12,c[1]+12,c[2]+12,c[0]+24].forEach((m,i)=>I.harp(m,t+i*B/2,.05));
        I.bass(c[0]-12,t,B*2.5,.14);I.pad(c.map(x=>x+12),t,B*3,.018);
        melody((m,tt)=>{I.box(m+12,tt,.18,1.6);I.accord([m],tt,B*.8,.012)},this.mel,b,t,B)}},
    // … un pique-nique au Champ-de-Mars, cordes pincées et flûte qui gambade (la majeur)…
    picnic:{name:"Pique-nique au Champ-de-Mars",bpm:124,beats:4,bars:8,
      ch:[[57,61,64],[62,66,69],[64,68,71],[57,61,64],[62,66,69],[57,61,64],[64,68,71,74],[57,61,64]],
      mel:[[[76,.5],[78,.5],[81,1],[78,.5],[76,.5],[73,1]],[[74,1],[78,1],[81,2]],[[80,.5],[81,.5],[83,1],[80,1],[76,1]],[[81,3],[null,1]],
           [[78,1],[81,.5],[83,.5],[86,1],[83,1]],[[81,1],[78,.5],[76,.5],[73,2]],[[76,1],[80,1],[83,1],[86,1]],[[85,2],[81,2]]],
      bar(b,t,B){const c=this.ch[b];
        [[0,1],[1,.7],[1.5,.6],[2.5,.6],[3,.8]].forEach(([x,v])=>c.forEach((m,i)=>I.pluck(m,t+x*B+i*.012,.045*v,.4,2800)));
        I.bass(c[0]-12,t,B*.9,.2);I.bass(c[2]-12,t+2*B,B*.9,.16);for(let i=0;i<8;i++)I.shaker(t+i*B/2,i%2?.02:.032);
        melody((m,tt,d)=>I.flute(m,tt,d*.95,.075,.01),this.mel,b,t,B)}},
    // … et la valse des lampadaires, le soir sur les quais : lente, harpe et accordéon tout doux (si bémol majeur)
    lampadaires:{name:"Valse des lampadaires",bpm:126,beats:3,bars:16,
      ch:[[46,50,53],[46,50,53],[51,55,58],[51,55,58],[53,57,60,63],[53,57,60,63],[46,50,53],[46,50,53],
          [43,46,50],[43,46,50],[51,55,58],[51,55,58],[48,52,55,58],[53,57,60,63],[46,50,53],[46,50,53]],
      mel:[[[74,2],[77,1]],[[82,2],[81,1]],[[79,2],[75,1]],[[79,3]],[[77,1],[81,1],[84,1]],[[82,2],[81,1]],[[77,2],[74,1]],[[77,3]],
           [[74,1],[77,1],[79,1]],[[82,2],[79,1]],[[79,1],[82,1],[87,1]],[[86,3]],[[84,1],[82,1],[79,1]],[[81,1],[84,1],[87,1]],[[86,2],[82,1]],[[82,3]]],
      bar(b,t,B){const c=this.ch[b];[c[0],c[1]+12,c[2]+12].forEach((m,i)=>I.harp(m+(i?0:12),t+i*B,.06));
        I.bass(c[0]-12,t,B*2.6,.14);I.pad(c.map(x=>x+12),t,B*3,.02);
        melody((m,tt,d)=>{I.accord([m],tt,d*.95,.035);I.keys(m+12,tt,.04,d*1.2)},this.mel,b,t,B)}},
    // … et un galop endiablé pour le service (fa majeur), au même entrain que la tarentelle
    galop:{name:"Galop du Café Kitsune",bpm:300,beats:4,bars:8,
      ch:[[53,57,60],[48,52,55,58],[53,57,60],[53,57,60],[46,50,53],[53,57,60],[48,52,55,58],[53,57,60]],
      mel:[[[72,1],[77,1],[81,1],[77,1]],[[79,1],[76,1],[72,2]],[[72,1],[77,1],[81,1],[84,1]],[[86,1],[84,1],[81,2]],
           [[82,1],[81,1],[79,1],[77,1]],[[81,1],[79,1],[77,1],[76,1]],[[74,1],[76,1],[79,1],[82,1]],[[77,3],[null,1]]],
      bar(b,t,B){const c=this.ch[b];
        I.bass(c[0]-12,t,B*.8,.24);I.bass(c[2]-12,t+2*B,B*.8,.2);[0,2].forEach(x=>I.kick(t+x*B,.34));
        [1,3].forEach(x=>{I.accord(c.map(m=>m+12),t+x*B,B*.45,.03);I.snare(t+x*B,.05)});for(let i=0;i<4;i++)I.hat(t+i*B,.025);
        if(b===7)[2,2.5,3,3.5].forEach((x,i)=>I.snare(t+x*B,.05+i*.02));
        melody((m,tt,d)=>{I.accord([m],tt,d*.85,.045);I.box(m+12,tt,.04,.4)},this.mel,b,t,B)}},
    // le service : punchy et funky, pour garder le rythme
    service:{name:"Coup de feu",bpm:132,beats:4,bars:8,
      ch:[[53,57,60],[57,60,64],[58,62,65],[60,64,67],[53,57,60],[57,60,64],[58,62,65],[60,64,67]],
      mel:[[[77,.5],[77,.5],[79,.5],[81,.5],[84,1],[81,.5],[79,.5]],[[81,.5],[79,.5],[77,.5],[76,.5],[77,1],[null,1]],[[74,.5],[77,.5],[82,.5],[81,.5],[79,.5],[77,.5],[79,1]],[[76,.5],[79,.5],[84,1],[82,.5],[81,.5],[79,1]],
           [[84,.5],[84,.5],[81,.5],[84,.5],[86,1],[84,1]],[[81,.5],[84,.5],[81,.5],[79,.5],[76,1],[79,1]],[[77,.5],[79,.5],[81,.5],[82,.5],[84,1],[86,1]],[[88,1],[84,.5],[79,.5],[76,1],[null,1]]],
      bar(b,t,B){const c=this.ch[b],r=c[0]-12;
        [[0,0],[.75,12],[1.5,0],[2,12],[2.75,0],[3.5,12]].forEach(([x,o])=>I.bass(r+o,t+x*B,B*.4,.2));
        for(let i=0;i<4;i++)I.kick(t+i*B,.36);[1,3].forEach(x=>{I.snare(t+x*B,.1);I.clap(t+x*B,.045)});
        for(let i=0;i<16;i++)I.hat(t+i*B/4,i%2?.018:.03);[.5,1.5,2.5,3.5].forEach(x=>I.openhat(t+x*B,.02));
        [1.5,3.5].forEach(x=>I.stab(c.map(m=>m+12),t+x*B,.04));
        melody((m,tt)=>I.marimba(m+12,tt,.17),this.mel,b,t,B)}},
    // les petits jeux de la Clairière (js/clairiere/games.js) : guilleret, pizzicati et marimba
    jeu:{name:"Petit jeu",bpm:128,beats:4,bars:8,
      ch:[[48,52,55],[45,48,52],[41,45,48],[43,47,50],[48,52,55],[45,48,52],[41,45,48],[43,47,50]],
      mel:[[[72,.5],[76,.5],[79,.5],[76,.5],[77,1],[74,1]],[[72,.5],[74,.5],[76,1],[69,2]],[[69,.5],[72,.5],[77,.5],[76,.5],[74,1],[72,1]],[[71,1],[74,1],[79,2]],
           [[79,.5],[77,.5],[76,.5],[74,.5],[76,1],[72,1]],[[72,.5],[76,.5],[81,1],[79,1],[76,1]],[[77,.5],[76,.5],[74,.5],[72,.5],[74,1],[77,1]],[[79,1],[74,1],[72,2]]],
      bar(b,t,B){const c=this.ch[b];
        [0,1,2,3].forEach(x=>I.pizz((x%2?c[2]:c[0])-12,t+x*B,.16));for(let i=0;i<8;i++)I.shaker(t+i*B/2,i%2?.02:.035);
        [.5,1.5,2.5,3.5].forEach(x=>c.forEach(m=>I.pluck(m+12,t+x*B,.025,.25,2200)));
        melody((m,tt)=>I.marimba(m+12,tt,.15),this.mel,b,t,B)}},
    // les Nuits de Noël (js/cafe/noelnuits.js) : le refrain de Jingle Bells (domaine public), grelots de traîneau
    noel:{name:"Nuits de Noël",bpm:142,beats:4,bars:8,
      ch:[[48,52,55],[48,52,55],[48,52,55],[48,52,55],[53,57,60],[48,52,55],[50,55,59],[55,59,62]],
      mel:[[[64,1],[64,1],[64,2]],[[64,1],[64,1],[64,2]],[[64,1],[67,1],[60,1.5],[62,.5]],[[64,4]],
           [[65,1],[65,1],[65,1.5],[65,.5]],[[65,1],[64,1],[64,1],[64,.5],[64,.5]],[[64,1],[62,1],[62,1],[64,1]],[[62,2],[67,2]]],
      bar(b,t,B){const c=this.ch[b];
        // plus de punch pour le Café (Joffray, 03/11/2026) : grosse caisse à chaque temps, claps, basse qui rebondit, accords cuivrés
        for(let i=0;i<8;i++)I.shaker(t+i*B/2,i%2?.035:.055);for(let i=0;i<4;i++)I.kick(t+i*B,.4);[1,3].forEach(x=>{I.snare(t+x*B,.1);I.clap(t+x*B,.05)});
        for(let i=0;i<8;i++)I.openhat(t+i*B/2+B/4,.012);
        [[0,0],[.5,12],[1,7],[1.5,12],[2,0],[2.5,12],[3,7],[3.5,12]].forEach(([x,o])=>I.bass(c[0]-12+o,t+x*B,B*.4,.2));
        [.5,1.5,2.5,3.5].forEach(x=>I.stab(c.map(m=>m+12),t+x*B,.035));
        if(b===7)[3,3.25,3.5,3.75].forEach((x,i)=>I.snare(t+x*B,.05+i*.02));
        melody((m,tt,d)=>{I.box(m+12,tt,.15,1);I.brass(m+12,tt,Math.min(d*.9,.8),.045)},this.mel,b,t,B)}},
    // la bande de Balafre débarque (Noël, Clairière) : les méchants sont là, cuivres et basse qui sautille, mi mineur
    bande:{name:"La bande",bpm:150,beats:4,bars:8,
      ch:[[52,55,59],[52,55,59],[48,52,55],[47,51,54],[52,55,59],[52,55,59],[45,48,52],[47,51,54]],
      mel:[[[64,.5],[null,.5],[64,.5],[67,.5],[66,1],[63,1]],[[64,.5],[71,.5],[70,.5],[69,.5],[67,2]],[[72,.5],[null,.5],[72,.5],[71,.5],[69,1],[67,1]],[[71,1.5],[70,.5],[71,2]],
           [[64,.5],[null,.5],[64,.5],[67,.5],[66,1],[63,1]],[[64,.5],[67,.5],[71,.5],[76,.5],[75,1],[74,1]],[[72,.5],[71,.5],[69,.5],[67,.5],[66,1],[63,1]],[[64,2],[null,1],[59,.5],[63,.5]]],
      bar(b,t,B){const c=this.ch[b],r=c[0]-12;
        for(let i=0;i<8;i++)I.pizz(r+(i%2?12:0),t+i*B/2,.2);I.bass(r,t,B*.45,.2);I.bass(r,t+2*B,B*.45,.18);
        [0,2].forEach(x=>I.kick(t+x*B,.38));[1,3].forEach(x=>I.snare(t+x*B,.11));for(let i=0;i<8;i++)I.hat(t+i*B/2,i%2?.02:.035);
        if(b===7)[3,3.25,3.5,3.75].forEach((x,i)=>I.snare(t+x*B,.05+i*.025));
        [1.5,3.5].forEach(x=>I.stab(c.map(m=>m+12),t+x*B,.035));
        melody((m,tt,d)=>{I.brass(m+12,tt,Math.min(d,.9),.06);I.pizz(m+24,tt,.05)},this.mel,b,t,B)}},
    // Noël à la Clairière : propositions pour Joffray (03/11/2026), à écouter sur tools/noel-musique.html. Mélodies du domaine public
    // (Douce nuit, Gruber 1818 ; Deck the Halls et We Wish You a Merry Christmas, traditionnels) ou originale (la forêt sous la neige)
    foretneige:{name:"La forêt sous la neige",bpm:66,beats:4,bars:8,
      ch:[[62,66,69,73],[55,59,62,66],[59,62,66,69],[57,61,64,69],[62,66,69,73],[55,59,62,66],[59,62,66,69],[57,61,64,69]],
      mel:[[[78,2],[81,2]],[[79,3],[78,1]],[[74,2],[76,1],[78,1]],[[76,4]],[[81,2],[83,1],[81,1]],[[79,2],[78,2]],[[76,1],[78,1],[74,2]],[[76,4]]],
      bar(b,t,B){const c=this.ch[b];
        for(let i=0;i<8;i++)I.box(c[i%4]+(i>=4?24:12),t+i*B/2,.05,1.1);
        I.pad(c,t,B*4,.028);I.bass(c[0]-12,t,B*3.5,.12);
        for(let i=0;i<4;i++)I.shaker(t+i*B+B/2,.025);
        melody((m,tt,d)=>{I.box(m,tt,.16,Math.max(1.2,d*1.4));I.flute(m-12,tt,d,.03,.012)},this.mel,b,t,B)}},
    doucenuit:{name:"Douce nuit",bpm:84,beats:3,bars:24,
      ch:[[48,52,55],[48,52,55],[48,52,55],[48,52,55],[43,47,50],[43,47,50],[48,52,55],[48,52,55],[53,57,60],[53,57,60],[48,52,55],[48,52,55],[53,57,60],[53,57,60],[48,52,55],[48,52,55],[43,47,50],[43,47,53],[48,52,55],[48,52,55],[48,52,55],[43,47,53],[48,52,55],[48,52,55]],
      mel:[[[67,1.5],[69,0.5],[67,1]],[[64,3]],[[67,1.5],[69,0.5],[67,1]],[[64,3]],[[74,2],[74,1]],[[71,3]],[[72,2],[72,1]],[[67,3]],[[69,2],[69,1]],[[72,1.5],[71,0.5],[69,1]],[[67,1.5],[69,0.5],[67,1]],[[64,3]],[[69,2],[69,1]],[[72,1.5],[71,0.5],[69,1]],[[67,1.5],[69,0.5],[67,1]],[[64,3]],[[74,2],[74,1]],[[77,1.5],[74,0.5],[71,1]],[[72,3]],[[76,3]],[[72,1.5],[67,0.5],[64,1]],[[67,1.5],[65,0.5],[62,1]],[[60,3]],[[null,3]]],
      bar(b,t,B){const c=this.ch[b];
        [0,1,2].forEach(x=>I.harp(c[x%3]+12+(x===2?12:0),t+x*B,.06));I.pad(c.map(x=>x+12),t,B*3,.024);I.bass(c[0]-12,t,B*2.6,.12);
        melody((m,tt,d)=>I.box(m+12,tt,.17,Math.max(1.4,d*1.2)),this.mel,b,t,B)}},
    deck:{name:"Deck the Halls",bpm:116,beats:4,bars:16,
      ch:[[48,52,55],[48,52,55],[43,47,50],[48,52,55],[48,52,55],[48,52,55],[43,47,50],[48,52,55],[43,47,50],[48,52,55],[50,54,60],[43,47,50],[48,52,55],[48,52,55],[53,57,60],[48,52,55]],
      mel:[[[67,1.5],[65,0.5],[64,1],[62,1]],[[60,1],[62,1],[64,1],[60,1]],[[62,0.5],[64,0.5],[65,0.5],[62,0.5],[64,1.5],[62,0.5]],[[60,1],[59,1],[60,2]],[[67,1.5],[65,0.5],[64,1],[62,1]],[[60,1],[62,1],[64,1],[60,1]],[[62,0.5],[64,0.5],[65,0.5],[62,0.5],[64,1.5],[62,0.5]],[[60,1],[59,1],[60,2]],[[62,1.5],[64,0.5],[65,1],[62,1]],[[64,1.5],[65,0.5],[67,1],[62,1]],[[64,0.5],[66,0.5],[67,1],[69,0.5],[71,0.5],[72,1]],[[71,1],[69,1],[67,2]],[[67,1.5],[65,0.5],[64,1],[62,1]],[[60,1],[62,1],[64,1],[60,1]],[[69,0.5],[69,0.5],[69,0.5],[69,0.5],[67,1.5],[65,0.5]],[[64,1],[62,1],[60,2]]],
      bar(b,t,B){const c=this.ch[b];
        for(let i=0;i<8;i++)I.shaker(t+i*B/2,i%2?.025:.045);[0,2].forEach(x=>I.kick(t+x*B,.26));
        [1,3].forEach(x=>c.forEach(m=>I.pluck(m+12,t+x*B,.035,.35,2400)));I.bass(c[0]-12,t,B*1.8,.17);I.bass(c[0]-5,t+2*B,B*1.8,.14);
        melody((m,tt)=>I.box(m+12,tt,.15,1.1),this.mel,b,t,B)}},
    wewish:{name:"We Wish You a Merry Christmas",bpm:138,beats:3,bars:8,
      ch:[[48,52,55],[53,57,60],[50,54,60],[43,47,50],[52,56,62],[45,48,52],[43,47,50],[48,52,55]],
      mel:[[[72,1],[72,0.5],[74,0.5],[72,0.5],[71,0.5]],[[69,1],[69,1],[69,1]],[[74,1],[74,0.5],[76,0.5],[74,0.5],[72,0.5]],[[71,1],[67,1],[67,1]],[[76,1],[76,0.5],[77,0.5],[76,0.5],[74,0.5]],[[72,1],[69,1],[67,0.5],[67,0.5]],[[69,1],[74,1],[71,1]],[[72,2],[67,1]]],
      bar(b,t,B){const c=this.ch[b];
        I.pizz(c[0]-12,t,.2);[1,2].forEach(x=>c.forEach(m=>I.pluck(m+12,t+x*B,.03,.3,2400)));for(let i=0;i<6;i++)I.shaker(t+i*B/2,i%2?.022:.04);
        melody((m,tt)=>{I.marimba(m+12,tt,.15);I.box(m+24,tt,.04,.6)},this.mel,b,t,B)}},
    fantomes:{name:"Petits fantômes",bpm:104,beats:4,bars:8,
      ch:[[57,60,64],[53,57,60],[50,53,57],[52,56,59],[57,60,64],[53,57,60],[50,53,57],[52,56,59]],
      mel:[[[76,.5],[77,.5],[76,.5],[75,.5],[76,1],[72,1]],[[77,1],[76,.5],[74,.5],[72,1],[69,1]],[[74,.5],[77,.5],[81,1],[80,.5],[81,.5],[77,1]],[[76,2],[68,1],[71,1]],
           [[81,.5],[83,.5],[84,.5],[83,.5],[81,1],[76,1]],[[77,1],[81,.5],[77,.5],[74,1],[77,1]],[[76,.5],[74,.5],[72,.5],[71,.5],[69,1],[72,1]],[[71,2],[64,2]]],
      bar(b,t,B){const c=this.ch[b];
        for(let i=0;i<4;i++)I.pizz((i%2?c[2]:c[0])-12,t+i*B,.2);
        [.5,1.5,2.5,3.5].forEach(x=>I.wood(t+x*B,.06));
        I.pad(c.map(x=>x+12),t,B*4,.018);
        melody((m,tt)=>I.box(m+12,tt,.15,1),this.mel,b,t,B)}}
  };

  /* ---------- jingles : courtes musiques calées sur une animation, puis le morceau voulu reprend ---------- */
  // voix de fantôme (thérémine) : glisse d'une note à l'autre avec un vibrato
  function glide(m1,m2,t,dur,v=.08){const o=osc("sine",hz(m1),t,t+dur+.3);o.frequency.setValueAtTime(hz(m1),t);o.frequency.exponentialRampToValueAtTime(hz(m2),t+dur*.45);
    const lfo=osc("sine",6,t,t+dur+.3),lg=C.createGain();lg.gain.value=hz(m2)*.012;lfo.connect(lg);lg.connect(o.frequency);
    const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.25);g.gain.setValueAtTime(v,t+dur-.3);g.gain.linearRampToValueAtTime(0,t+dur+.2);o.connect(g);out(g,.6)}
  // vent : bruit filtré dont la bande monte puis redescend
  function wind(t,dur,v=.05){const bp=filt("bandpass",400,5);bp.frequency.setValueAtTime(380,t);bp.frequency.linearRampToValueAtTime(950,t+dur*.5);bp.frequency.linearRampToValueAtTime(450,t+dur);
    const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+dur*.3);g.gain.linearRampToValueAtTime(0,t+dur);noiseSrc(t,t+dur+.1).connect(bp);bp.connect(g);out(g,.5)}
  const JINGLES={
    // Nuit des citrouilles (js/cafe/hwintro.js) : les temps suivent ceux de l'animation
    hwintro:{len:10,play(t){
      const B=60/104;
      I.pad([45,52,57,60],t,4.6,.03);wind(t,2.6);wind(t+1.9,2.2,.035);                       // nuit, vent
      [69,72,76,81].forEach((m,i)=>I.box(m,t+.3+i*.3,.13,1.6));                               // la lune se lève
      [76,79,83,88].forEach((m,i)=>{I.marimba(m,t+1.6+i*.3,.2);I.wood(t+1.6+i*.3,.05)});      // les citrouilles s'allument
      for(let i=0;i<14;i++)I.pizz(84-(i%7)*2+(i>6?1:0),t+2+i*.11,.09);                        // l'essaim de chauves-souris
      wind(t+2,1.6,.04);
      glide(69,76,t+3.3,1.5);glide(76,72,t+4.8,.6,.05);                                        // Feu Follet : « ouuuh »
      [4.2,4.35,4.5].forEach((x,i)=>{I.marimba([64,67,71][i],t+x,.18);I.wood(t+x,.08)});        // les invités sautent
      const T=t+5.3;                                                                            // le titre
      I.kick(T,.45);I.openhat(T,.06);I.stab([57,60,64,69],T,.06);I.bass(45,T,1.4,.24);
      melody((m,tt)=>I.box(m+12,tt,.15,1.1),[[[76,.5],[77,.5],[76,.5],[75,.5],[76,1],[72,1]]],0,T+.3,B);
      melody((m,tt)=>I.box(m+12,tt,.15,1.1),[[[71,1],[72,.5],[74,.5],[76,2]]],0,T+.3+4*B,B);
      for(let i=0;i<8;i++)I.box(93-i*2+(i%2?3:0),T+.35+i*.11,.05,.6);                           // pluie de bonbons
      for(let i=0;i<4;i++)I.pizz([45,52,48,52][i],T+.3+i*B,.18);
      [[53,57,60],[52,56,59]].forEach((c,i)=>I.pad(c,T+.3+i*2*B,2*B,.022));
      const E=T+.3+6*B;I.pad([45,52,57,59,64],E,2.2,.03);I.box(81,E,.12,2.4);I.box(88,E+.15,.08,2.4);I.bass(33,E,2.2,.2)  // accord final
    }}
    ,
    // la bande de Balafre apparaît : « dan, dan, daaaan », puis le thème de la bande
    bande:{len:2.6,play(t){
      [0,.32].forEach(x=>{I.kick(t+x,.5);I.stab([52,55,59,64],t+x,.07);I.brass(64,t+x,.2,.09);I.bass(40,t+x,.25,.25)});
      I.kick(t+.7,.55);I.brass(70,t+.7,1.3,.09);I.brass(58,t+.7,1.3,.07);I.stab([46,52,58],t+.7,.06);I.bass(34,t+.7,1.4,.26);I.openhat(t+.7,.08);
      for(let i=0;i<12;i++)I.snare(t+.9+i*.07,.03+i*.006);
      [59,60,61,62,63].forEach((m,i)=>I.pizz(m,t+1.9+i*.08,.18))}}
    ,
    // Nuits de Noël (js/cafe/noelintro.js) : grelots, la lune, le traîneau qui passe, les lumières du sapin, le refrain au titre
    noelintro:{len:10,play(t){
      const B=60/118;
      I.pad([48,52,55,60],t,4.6,.028);wind(t,2.4,.03);
      [72,76,79,84].forEach((m,i)=>I.box(m,t+.3+i*.3,.12,1.6));                                // la lune se lève
      for(let i=0;i<20;i++)I.shaker(t+2.2+i*.09,.05);for(let i=0;i<6;i++)I.box(96-i*2,t+2.3+i*.16,.06,.5);  // le traîneau passe
      [79,83,86,91,95].forEach((m,i)=>I.box(m,t+3.4+i*.18,.1,1));                              // les lumières du sapin
      [4.2,4.35,4.5].forEach((x,i)=>{I.marimba([67,71,74][i],t+x,.18);I.wood(t+x,.07)});        // les invités sautent
      const T=t+5.3;I.kick(T,.4);I.openhat(T,.05);I.stab([60,64,67,72],T,.05);I.bass(36,T,1.4,.22);
      melody((m,tt)=>I.box(m+12,tt,.16,1.1),[[[64,1],[64,1],[64,2],[64,1],[64,1],[64,2],[64,1],[67,1],[60,1.5],[62,.5],[64,4]]],0,T+.3,B);
      for(let i=0;i<24;i++)I.shaker(T+.3+i*B/2,i%2?.03:.05);
      const E=T+.3+12*B;I.pad([48,55,60,64],E,2,.03);I.box(84,E,.12,2.4);I.bass(36,E,2,.2)}}
  };
  let jtimer=null;
  function jingle(id){const J=JINGLES[id];if(!J||!on||!unlocked)return;init();if(C.state==="suspended")C.resume();
    stop();cur="jingle:"+id;bus=newBus();J.play(C.currentTime+.08);
    clearTimeout(jtimer);jtimer=setTimeout(()=>{jtimer=null;if(cur==="jingle:"+id){cur=null;if(on&&wanted)play(wanted)}},J.len*1000)}
  // l'animation est passée avant la fin : fondu, puis le morceau voulu
  // une note de piano toute douce (les flaques de Plouf), par-dessus la musique
  function note(m){if(!on||!unlocked)return;init();if(C.state==="suspended")C.resume();const t=C.currentTime+.01;
    const g=gain(t,.006,.16,1.1);g.connect(master);const s=C.createGain();s.gain.value=.25;g.connect(s);s.connect(rev);
    osc("triangle",hz(m),t,t+1.3).connect(g);const g2=gain(t,.004,.07,.4);g2.connect(g);osc("sine",hz(m)*2,t,t+.6).connect(g2)}
  // les bruitages des petits jeux (games.js), par-dessus la musique ; n : un rang, pour monter la note (ricochets, pierres…)
  function sfx(k,n=0){if(!on||!unlocked)return;init();if(C.state==="suspended")C.resume();const t=C.currentTime+.01;
    const o=(g,w=.12)=>{g.connect(master);const s=C.createGain();s.gain.value=w;g.connect(s);s.connect(rev)};
    const tone=(type,f1,f2,d,v,at=0)=>{const g=gain(t+at,.004,v,d),x=osc(type,f1,t+at,t+at+d+.05);x.frequency.setValueAtTime(f1,t+at);x.frequency.exponentialRampToValueAtTime(f2,t+at+d);x.connect(g);o(g)};
    const nz=(f,q,d,v,at=0,f2)=>{const bp=filt("bandpass",f,q);if(f2){bp.frequency.setValueAtTime(f,t+at);bp.frequency.exponentialRampToValueAtTime(f2,t+at+d)}const g=gain(t+at,.005,v,d);noiseSrc(t+at,t+at+d+.05).connect(bp);bp.connect(g);o(g,.05)};
    const bell=(m,v,at=0,d=.6)=>{const f=hz(m),g=gain(t+at,.003,v,d);osc("sine",f,t+at,t+at+d+.1).connect(g);const g2=gain(t+at,.003,v*.3,d/3);osc("sine",f*4,t+at,t+at+d/3).connect(g2);g2.connect(g);o(g,.3)};
    if(k==="good"){bell(76+n,.16);bell(83+n,.12,.07)}
    else if(k==="bad"){tone("triangle",330,170,.28,.14)}
    else if(k==="tap"){tone("sine",900,600,.05,.08);nz(2400,2,.03,.05)}
    else if(k==="pop"){tone("sine",500,1300,.08,.12)}
    else if(k==="plic"){tone("sine",2200,1100,.06,.05)}
    else if(k==="splash"){nz(1400,1.2,.18,.12);tone("sine",700,220,.12,.06)}
    else if(k==="bite"){tone("sine",420,120,.16,.16);nz(900,1,.12,.06)}
    else if(k==="rustle"){nz(3000,.8,.14,.06);nz(1800,.8,.12,.04,.05)}
    else if(k==="swap"){nz(700,1.3,.2,.07,0,2600);tone("sine",520,780,.06,.04,.14)}
    else if(k==="whoosh"){nz(300,1.4,.9,.12,0,1400)}
    else if(k==="snowhit"){tone("sine",200,60,.14,.24);nz(600,.6,.16,.22);nz(2600,1.2,.07,.1,.01)} // une boule de neige qui touche : « pouf »
    // « Oh oh oh ! » : une grosse voix ronde (deux dents de scie un peu désaccordées, filtrées sur les formants du « o », un fond grave),
    // un souffle « h » avant chaque syllabe, la hauteur qui monte un peu puis redescend doucement, la dernière plus longue ;
    // la première version descendait trop et trop vite : on aurait dit qu'il était malade (Joffray)
    else if(k==="hohoho"){[[0,.24,112],[.34,.24,108],[.68,.5,100]].forEach(([a,d,f0])=>{const t0=t+.08+a; // .08 : le souffle « h » part avant la syllabe
        const hb=filt("bandpass",1300,1.2),hg=C.createGain();hg.gain.setValueAtTime(0,t0-.05);hg.gain.linearRampToValueAtTime(.16,t0-.02);hg.gain.linearRampToValueAtTime(0,t0+.05);noiseSrc(t0-.06,t0+.08).connect(hb);hb.connect(hg);o(hg,.2);
        const g=C.createGain();g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.5,t0+.05);g.gain.setValueAtTime(.46,t0+d-.06);g.gain.linearRampToValueAtTime(0,t0+d+.06);
        const vib=osc("sine",5.5,t0,t0+d+.1),vg=C.createGain();vg.gain.value=f0*.012;vib.connect(vg);
        [-7,7].forEach(dt=>{const v=osc("sawtooth",f0,t0,t0+d+.1,dt);v.frequency.setValueAtTime(f0,t0);v.frequency.linearRampToValueAtTime(f0*1.06,t0+d*.3);v.frequency.linearRampToValueAtTime(f0*.94,t0+d);vg.connect(v.frequency);
          [[480,7,1],[820,9,.55],[2700,10,.1]].forEach(([fr,q,amp])=>{const bp=filt("bandpass",fr,q),ga=C.createGain();ga.gain.value=amp;v.connect(bp);bp.connect(ga);ga.connect(g)})});
        const ch=osc("sine",f0,t0,t0+d+.1),cg=C.createGain();cg.gain.value=.35;ch.frequency.setValueAtTime(f0,t0);ch.frequency.linearRampToValueAtTime(f0*.94,t0+d);ch.connect(cg);cg.connect(g);o(g,.3)})}
    // l'ancienne voix (la première, « malade »), gardée pour comparer sur tools/noel-musique.html
    else if(k==="hohoho1"){[0,.34,.68].forEach((a,i)=>{const t0=t+a,f0=i===2?118:128,src=osc("sawtooth",f0,t0,t0+.34);src.frequency.setValueAtTime(f0,t0);src.frequency.exponentialRampToValueAtTime(f0*.82,t0+.3);
        const g=C.createGain();g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.55,t0+.03);g.gain.setValueAtTime(.5,t0+(i===2?.24:.16));g.gain.linearRampToValueAtTime(0,t0+(i===2?.34:.24));
        [[430,6,1],[780,7,.5],[2400,8,.12]].forEach(([fr,q,v])=>{const bp=filt("bandpass",fr,q),gv=C.createGain();gv.gain.value=v;src.connect(bp);bp.connect(gv);gv.connect(g)});o(g,.25)})}
    // le grelot (Joffray trouvait les premiers « bizarres ») : trois façons, à comparer sur tools/noel-musique.html ; GREL dit laquelle sert
    // A : un petit bruit qui fait sonner des résonateurs étroits (le métal qui vibre)
    // B : modulation de fréquence (le timbre « cloche » des synthés)
    // C : un bruit très aigu et très court, comme le grelot du Jingle Bells du Café
    const grelA=(at,f,v)=>{const src=noiseSrc(t+at,t+at+.03),eg=gain(t+at,.001,1,.02);src.connect(eg);
        [[1,1],[1.42,.8],[1.83,.6],[2.37,.45],[2.9,.3]].forEach(([r,a])=>{const bp=filt("bandpass",f*r,38),g=gain(t+at,.001,v*a*9,.18+Math.random()*.08);eg.connect(bp);bp.connect(g);o(g,.3)})};
    const grelB=(at,f,v)=>{const car=osc("sine",f,t+at,t+at+.3),mod=osc("sine",f*1.41,t+at,t+at+.3),mg=C.createGain();mg.gain.setValueAtTime(f*2.2,t+at);mg.gain.exponentialRampToValueAtTime(f*.1,t+at+.2);
        mod.connect(mg);mg.connect(car.frequency);const g=gain(t+at,.002,v*.8,.16);car.connect(g);o(g,.3)};
    const grelC=(at,f,v)=>{nz(7600,1.1,.06,v*1.4,at);nz(10500,1.4,.035,v,at+.006)};
    const GREL={A:grelA,B:grelB,C:grelC};let grelK=MUSIC_GREL;
    const shake=(at,f,v,n,spread=.05,g=GREL[grelK])=>{for(let i=0;i<n;i++)g(at+i*spread/n+Math.random()*.01,f*(1+(Math.random()-.5)*.06),v*(.6+Math.random()*.4))};
    const sleighBad=g=>{let a=0;for(let i=0;i<16;i++){shake(a,2600+Math.random()*1400,.05,3+Math.floor(Math.random()*4),.04+Math.random()*.08,g);a+=.08+Math.random()*.22}
      [.7,1.6].forEach((a,i)=>{tone("square",900+i*300,650,.05,.04,a);tone("sine",2400+i*300,1600,.09,.05,a)});
      {const a=1.15,x=osc("sine",180,t+a,t+a+.5);x.frequency.setValueAtTime(180,t+a);[.08,.16,.24,.32,.4].forEach((d,j)=>x.frequency.linearRampToValueAtTime(j%2?160:420-j*40,t+a+d));const gg=gain(t+a,.01,.07,.45);x.connect(gg);o(gg,.2)}
      nz(300,1.2,2.6,.05,0,1100)};
    // le traîneau qui va mal : grelots secoués n'importe comment, deux boulons qui sautent (clonk), un ressort, le vent ; réparé : en rythme
    if(k==="sleighbad")sleighBad(GREL[grelK]);
    else if(k==="sleighok"){for(let i=0;i<12;i++)shake(i*.2,3000,i%2?.04:.06,4,.05)}
    // le petit grelot de Grelot (Noël) : quelques secousses légères, les grelots B
    else if(k==="gling"){[0,.32,.5,.9].forEach((a,i)=>shake(a,3400+i*120,.045,3,.04))}
    else if(/^grel[ABC]$/.test(k)){for(let i=0;i<8;i++)shake(i*.22,3000,i%2?.04:.06,4,.05,GREL[k[4]])}
    else if(/^bad[ABC]$/.test(k))sleighBad(GREL[k[3]]);
    // sonné, façon dessin animé : des petits oiseaux qui gazouillent en tournant, et un tintement de clochettes
    else if(k==="dizzy"){[0,.18,.36,.54].forEach((a,i)=>{const f1=i%2?2900:2300,x=osc("sine",f1,t+a,t+a+.16);x.frequency.setValueAtTime(f1,t+a);x.frequency.linearRampToValueAtTime(f1*1.35,t+a+.06);x.frequency.linearRampToValueAtTime(f1*.95,t+a+.13);
        const g=gain(t+a,.005,.07,.13);x.connect(g);o(g,.35)});[88,91,95].forEach((m,i)=>bell(m,.045,.1+i*.22,.35))}
    // un gros boum (le traîneau qui s'écrase)
    else if(k==="boom"){tone("sine",110,28,.7,.6);nz(380,.7,.6,.45);nz(1600,1,.12,.22);tone("triangle",60,30,.5,.3,.05)}
    else if(k==="knock"){tone("sine",180,70,.12,.25);nz(1200,1.5,.05,.08)}
    else if(k==="flip"){nz(3200,1,.04,.06);tone("sine",1200,1500,.05,.05)}
    else if(k==="cheer"){[0,4,7,12].forEach((d,i)=>bell(84+d,.1,i*.06,.5))}
    else if(k==="win"){[72,76,79,84,88].forEach((m,i)=>bell(m,.14,i*.09,.9));[0,.1,.2].forEach(a=>nz(6000,.7,.4,.03,.45+a))}
    else if(k==="lose"){[67,64,60].forEach((m,i)=>tone("triangle",hz(m),hz(m)*.98,.3,.11,i*.18))}}
  function jingleEnd(){if(!jtimer)return;clearTimeout(jtimer);jtimer=null;if(cur&&cur.startsWith("jingle:")){stop();if(on&&wanted)play(wanted)}}

  function play(id){
    clearTimeout(jtimer);jtimer=null;
    init();if(C.state==="suspended")C.resume();
    stop();const tr=TRACKS[id];if(!tr)return;cur=id;bus=newBus();
    const B=60/tr.bpm,len=tr.beats*B;let next=C.currentTime+.1,bar=0;
    const tick=()=>{while(next<C.currentTime+.35){tr.bar(bar%tr.bars,next,B);if(tr.crackle)I.crackle(next,len);next+=len;bar++}};
    tick();timer=setInterval(tick,60);
  }
  function stop(){
    if(timer)clearInterval(timer);timer=null;cur=null;
    if(bus){const b=bus,t=C.currentTime;[b.dry,b.send].forEach(g=>{g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(0,t+.4)});setTimeout(()=>{b.dry.disconnect();b.send.disconnect()},600);bus=null}
  }
  function volume(v){vol=v;if(master)master.gain.value=v}

  /* ---------- contrôle commun aux pages ---------- */
  const SKEY="renards-son";
  let on=true,wanted=null,unlocked=false;
  try{on=localStorage.getItem(SKEY)!=="0"}catch(e){}
  function want(id){wanted=id;if(unlocked&&on&&cur!==id)play(id)}
  // le son n'est permis qu'après un vrai toucher (doigt relevé, clic ou touche) : pas sur « pointerdown » au doigt
  const unlock=()=>{if(C&&C.state==="suspended")C.resume();if(unlocked)return;unlocked=true;if(on&&wanted)play(wanted)};
  ["pointerup","touchend","click","keydown"].forEach(ev=>addEventListener(ev,unlock,{capture:true}));
  document.addEventListener("visibilitychange",()=>{if(!C)return;document.hidden?C.suspend():C.resume()});
  const ICON_ON='<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 8 H6 L10 4.5 V15.5 L6 12 H3Z" fill="#5b4250"/><path d="M13 7 Q15 10 13 13 M15.5 5 Q19 10 15.5 15" fill="none" stroke="#5b4250" stroke-width="2" stroke-linecap="round"/></svg>';
  const ICON_OFF='<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 8 H6 L10 4.5 V15.5 L6 12 H3Z" fill="#5b4250"/><path d="M13 7.5 L18 12.5 M18 7.5 L13 12.5" fill="none" stroke="#5b4250" stroke-width="2" stroke-linecap="round"/></svg>';
  const icon=()=>on?ICON_ON:ICON_OFF;
  function paint(){document.querySelectorAll("[data-sound]").forEach(b=>{b.innerHTML=icon();b.setAttribute("aria-label",on?"Couper la musique":"Remettre la musique");b.setAttribute("aria-pressed",on?"false":"true")})}
  function setOn(v){on=v;try{localStorage.setItem(SKEY,v?"1":"0")}catch(e){}unlocked=true;if(!v)stop();else if(wanted)play(wanted);paint()}
  document.addEventListener("click",e=>{if(e.target.closest("[data-sound]"))setOn(!on)});
  const st=document.createElement("style");
  const css=".snd{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#fffaf2;border:2px solid #ead9cc;box-shadow:0 3px 0 #ead9cc;flex:none;cursor:pointer;padding:0;touch-action:manipulation}.snd svg{display:block}";
  st.textContent=css;document.head.appendChild(st);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",paint);else paint();
  return{play,stop,volume,want,setOn,paint,icon,css,unlock,jingle,jingleEnd,note,sfx,tracks:TRACKS,get current(){return cur},get on(){return on}};
})();
// visible par les jeux ouverts dans le cadre de l'accueil (une const n'est pas une propriété de window)
window.MUSIC=MUSIC;
