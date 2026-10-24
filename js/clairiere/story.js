/* La Clairière : les histoires des renards, en boîte de dialogue. Voir docs/clairiere-v2.md, « Les histoires ».
   Chaque renard a un arc en 3 étapes ; une étape s'ouvre selon l'amitié, le moment ou un autre renard.
   Au plus une étape par jour réel (R.storyDay). R.story[id] = nombre d'étapes finies, R.souv[id] = souvenir reçu. */
const STORIES={
  petitpois:{title:"Peur du noir",souv:"le gland porte-bonheur",steps:[
    {lv:1,dark:1,hint:"Petit Pois a quelque chose à te dire, le soir venu.",lines:[
      ["petitpois","shy",`${ME()}… il commence à faire noir. Tu restes un peu dehors avec moi ?`],
      ["petitpois","sad","Quand les lanternes s'éteignent, la forêt fait des bruits. Crac. Hou-hou."],
      ["petitpois","shy","Je fais semblant de dormir sous le porche, mais je garde un œil ouvert. Les deux, en fait."],
      ["petitpois","open","Tu crois qu'il existe quelqu'un qui n'a jamais peur du noir ?"]]},
    {lv:2,with:"luciole",hint:"Petit Pois aimerait rencontrer quelqu'un qui brille. Quelqu'un passera peut-être bientôt.",lines:[
      ["petitpois","surprise",`${ME()} ! Tu as vu Luciole ? Sa queue fait de la lumière. Toute seule !`],
      ["luciole","joy","Ce n'est rien, je suis née comme ça. C'est même moi qui allume les lanternes, le soir."],
      ["petitpois","shy","Dis… tu pourrais rester près de moi, cette nuit ? Juste un peu ?"],
      ["luciole","open","D'accord, petit. Mais il faudra que tu m'aides à les allumer."]]},
    {lv:3,dark:1,with:"luciole",hint:"Petit Pois s'entraîne avec Luciole. Reviens le soir pour voir.",lines:[
      ["petitpois","joy",`${ME()}, regarde ! C'est moi qui ai allumé la grande lanterne !`],
      ["luciole","joy","Du premier coup. Je n'avais jamais vu ça."],
      ["petitpois","open","En fait, le noir, c'est juste le moment où les lanternes sont jolies."],
      ["petitpois","shy","Tiens. C'est mon gland porte-bonheur. Je n'en ai plus besoin… enfin, garde-le quand même bien."],
      ["petitpois","joy","Et maintenant que je n'ai plus peur de rentrer tard, je peux t'aider au Café !"]]}
  ]},
  mitaine:{title:"La moufle perdue",souv:"la moufle au flocon",steps:[
    {lv:1,hint:"Mitaine cherche quelque chose partout.",lines:[
      ["mitaine","sad",`Bonsoir ${ME()}… Tu n'aurais pas vu une moufle ? Rouge, avec un petit flocon brodé.`],
      ["mitaine","shy","Ma grand-mère me l'a tricotée. J'ai encore l'autre, mais une moufle toute seule, ça ne sert à rien."],
      ["mitaine","open","Si tu la vois, tu me diras ? Je vais chercher du côté de la mare."]]},
    {lv:2,rain:1,hint:"Mitaine guette la mare. Un jour de pluie, peut-être…",lines:[
      ["mitaine","surprise",`${ME()} ! Avec la pluie, il y a un fil de laine rouge qui flotte sur la mare !`],
      ["mitaine","open","Il part vers le porche… Quelqu'un a dû traîner ma moufle par ici."],
      ["mitaine","shy","Je n'ose pas fouiller sous le porche. C'est là que les autres dorment."]]},
    {lv:3,dark:1,hint:"Le fil de laine mène sous le porche. Reviens le soir, quand tout le monde dort.",lines:[
      ["petitpois","shy","Euh… Mitaine ? Je crois que je dors dedans depuis une semaine."],
      ["mitaine","surprise","Ma moufle ! Tu en as fait un sac de couchage ?"],
      ["petitpois","sad","Elle est toute chaude… Pardon."],
      ["mitaine","joy","Garde-la, va. Elle te va mieux qu'à ma patte."],
      ["mitaine","open",`Et toi, ${ME()}, prends l'autre. Comme ça, on en a chacun une.`]]}
  ]},
  gribouille:{title:"Le modèle",souv:"le portrait de Petit Pois endormi",steps:[
    {lv:1,hint:"Gribouille a envie de te parler peinture.",lines:[
      ["gribouille","joy",`Bonjour ${ME()} ! Je suis peintre. Enfin, je peins avec ma queue : tu vois le bout bleu ?`],
      ["gribouille","sad","Je voudrais faire le portrait de tout le monde, mais personne ne tient en place."],
      ["gribouille","shy","Même toi, tu bouges tout le temps. Ce n'est pas un reproche… Si, un peu."]]},
    {lv:2,rain:1,hint:"Gribouille attend que les vitres soient embuées. Un jour de pluie…",lines:[
      ["gribouille","surprise","Il pleut ! Les vitres de la maison sont toutes embuées : c'est mon papier préféré !"],
      ["gribouille","joy","Regarde, j'ai dessiné la mare, la souche et une lanterne. Les choses, ça ne bouge pas."],
      ["gribouille","open","Mais il me manque un vrai modèle. Quelqu'un qui reste immobile très, très longtemps…"]]},
    {lv:3,dark:1,hint:"Gribouille cherche un modèle qui ne bouge pas. Reviens le soir pour voir.",lines:[
      ["gribouille","surprise",`${ME()}, j'ai trouvé ! La nuit, tout le monde dort. Ils tiennent en place !`],
      ["gribouille","open","J'ai peint Petit Pois roulé en boule. Il n'a pas bougé une moustache."],
      ["gribouille","joy","Tiens, c'est pour toi. Et bientôt, je peindrai un grand tableau sur le mur de la maison, avec tout le monde dedans."]]}
  ]}
};
// renards qui arrivent pour une histoire, avec leur propre dialogue d'arrivée
const GUEST_LINES={
  luciole:[["luciole","open","Bonsoir ! J'ai vu de la lumière chez toi, alors je suis venue voir. Je m'appelle Luciole."]]
};

const storyStep=id=>{const S=STORIES[id],n=R.story[id]||0;return S&&n<S.steps.length?S.steps[n]:null};
const stepReady=(id,st)=>isRes(id)&&lvOf(R.res[id].h)>=st.lv&&(!st.dark||dark())&&(!st.rain||scn.rain)&&(!st.with||isRes(st.with));
// le renard qu'une histoire attend : il arrive en priorité, dès l'étape précédente finie
function storyGuest(){for(const id in STORIES){const st=storyStep(id);if(st&&st.with&&isRes(id)&&(R.story[id]||0)>0&&!isRes(st.with))return st.with}return null}

// lance l'étape prête, s'il n'y a ni dialogue ni feuille ouverte
function storyCheck(){
  if(!R.intro||R.storyDay===today()||!$("talk").hidden||!$("sheet").hidden)return;
  for(const id in STORIES){const st=storyStep(id);if(!st||!stepReady(id,st))continue;
    R.storyDay=today();save();syncFoxes();
    talk(st.lines,()=>{const S=STORIES[id];R.story[id]=(R.story[id]||0)+1;
      if(R.story[id]===S.steps.length){R.souv[id]=S.souv;toast(`Souvenir reçu : ${S.souv}.`)}
      save()});
    return;
  }
}

// dans la fiche du renard : où en est son histoire
function storyHTML(id){const S=STORIES[id];if(!S)return "";const n=R.story[id]||0,st=storyStep(id);
  const next=!st?`Histoire terminée. Souvenir : ${R.souv[id]||S.souv}.`
    :lvOf(R.res[id].h)<st.lv?`La suite quand vous serez plus proches (amitié ${st.lv}).`
    :R.storyDay===today()&&stepReady(id,st)?"La suite demain.":st.hint;
  return `<p class="story"><b>Histoire : ${S.title}</b> · étape ${Math.min(n+1,S.steps.length)} sur ${S.steps.length}<br>${next}</p>`}

// compagnon au Café : Petit Pois, ou tout renard dont l'histoire est terminée
const canBuddy=id=>isRes(id)&&(id==="petitpois"||(STORIES[id]&&(R.story[id]||0)>=STORIES[id].steps.length));
function buddyHTML(id){if(!canBuddy(id))return "";
  const own=((load(CAFEKEY)||{}).own||{}).serveur,n=(R.tog[id]||0);
  const why=own?"":" Sa place à côté de toi s'ouvre avec l'Apprenti serveur, dans la boutique du Café.";
  const days=n?` ${n} journée${n>1?"s":""} ensemble au Café.`:"";
  return R.buddy===id?`<p class="story"><b>Ton compagnon au Café.</b> Chaque journée ensemble ajoute un cœur.${days}${why}</p>`
    :`<p class="story">Il peut t'accompagner au Café : même aide que Petit Pois, et chaque journée ensemble ajoute un cœur.${why}</p><button class="btn" data-buddy="${id}" type="button">L'emmener au Café</button>`}
