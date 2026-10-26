/* Musique du Kitsune Café, partagée par les trois pages. Tout est synthétisé (Web Audio) : aucun fichier, aucune licence.
   Chaque page dit quel morceau elle veut (MUSIC.want) ; il démarre au premier toucher (règle des navigateurs).
   Un bouton [data-sound] coupe ou remet le son, choix mémorisé dans localStorage « renards-son ».
   Morceaux : boite (accueil), ukulele (carte du café), service (en jeu), foret (Clairière), fantomes (Halloween), lofi (en réserve). */
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
    return{want:id=>H.want(id),setOn:v=>{H.setOn(v);paint()},paint,play:id=>H.want(id),stop(){},volume(){},jingle:id=>H.jingle&&H.jingle(id),note:m=>H.note&&H.note(m),jingleEnd:()=>H.jingleEnd&&H.jingleEnd(),get on(){return H.on},get current(){return H.current}};
  }
  let C=null,master,rev,bus=null,timer=null,cur=null,noise,vol=.7;
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
    // marimba : bois chaud, très court
    marimba(m,t,v=.2){const f=hz(m),g=gain(t,.002,v,.35);osc("sine",f,t,t+.4).connect(g);const g2=gain(t,.002,v*.35,.08);osc("sine",f*4,t,t+.12).connect(g2);g2.connect(g);out(g,.25)},
    // accord plaqué, cuivré et bref
    stab(ns,t,v=.05){const lp=filt("lowpass",2400,1),g=gain(t,.004,v,.16);ns.forEach(m=>[-6,6].forEach(dt=>osc("sawtooth",hz(m),t,t+.25,dt).connect(lp)));lp.connect(g);out(g,.2)},
    openhat(t,v=.04){const hp=filt("highpass",6000),g=gain(t,.002,v,.16);noiseSrc(t,t+.2).connect(hp);hp.connect(g);out(g,.1)},
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
  return{play,stop,volume,want,setOn,paint,icon,css,unlock,jingle,jingleEnd,note,tracks:TRACKS,get current(){return cur},get on(){return on}};
})();
// visible par les jeux ouverts dans le cadre de l'accueil (une const n'est pas une propriété de window)
window.MUSIC=MUSIC;
