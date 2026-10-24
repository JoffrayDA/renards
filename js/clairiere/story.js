/* La Clairière : les histoires des renards, en boîte de dialogue. Voir docs/clairiere-v2.md, « Les histoires ».
   Chaque renard a un arc en 3 étapes ; une étape s'ouvre selon l'amitié, le moment ou un autre renard.
   Au plus une étape par jour réel (R.storyDay). R.story[id] = nombre d'étapes finies, R.souv[id] = souvenir reçu. */
const STORIES={
  petitpois:{title:"Peur du noir",souv:"le gland porte-bonheur",steps:[
    {lv:1,dark:1,hint:"Petit Pois a quelque chose à te dire, le soir venu.",lines:[
      ["petitpois","shy","Roussette… il commence à faire noir. Tu restes un peu dehors avec moi ?"],
      ["petitpois","sad","Quand les lanternes s'éteignent, la forêt fait des bruits. Crac. Hou-hou."],
      ["petitpois","shy","Je fais semblant de dormir sous le porche, mais je garde un œil ouvert. Les deux, en fait."],
      ["petitpois","open","Tu crois qu'il existe quelqu'un qui n'a jamais peur du noir ?"]]},
    {lv:2,with:"luciole",hint:"Petit Pois aimerait rencontrer quelqu'un qui brille. Quelqu'un passera peut-être bientôt.",lines:[
      ["petitpois","surprise","Roussette ! Tu as vu Luciole ? Sa queue fait de la lumière. Toute seule !"],
      ["luciole","joy","Ce n'est rien, je suis née comme ça. C'est même moi qui allume les lanternes, le soir."],
      ["petitpois","shy","Dis… tu pourrais rester près de moi, cette nuit ? Juste un peu ?"],
      ["luciole","open","D'accord, petit. Mais il faudra que tu m'aides à les allumer."]]},
    {lv:3,dark:1,with:"luciole",hint:"Petit Pois s'entraîne avec Luciole. Reviens le soir pour voir.",lines:[
      ["petitpois","joy","Roussette, regarde ! C'est moi qui ai allumé la grande lanterne !"],
      ["luciole","joy","Du premier coup. Je n'avais jamais vu ça."],
      ["petitpois","open","En fait, le noir, c'est juste le moment où les lanternes sont jolies."],
      ["petitpois","shy","Tiens. C'est mon gland porte-bonheur. Je n'en ai plus besoin… enfin, garde-le quand même bien."],
      ["petitpois","joy","Et maintenant que je n'ai plus peur de rentrer tard, je peux t'aider au Café !"]]}
  ]}
};
// renards qui arrivent pour une histoire, avec leur propre dialogue d'arrivée
const GUEST_LINES={
  luciole:[["luciole","open","Bonsoir ! J'ai vu de la lumière chez toi, alors je suis venue voir. Je m'appelle Luciole."]]
};

const storyStep=id=>{const S=STORIES[id],n=R.story[id]||0;return S&&n<S.steps.length?S.steps[n]:null};
const stepReady=(id,st)=>isRes(id)&&lvOf(R.res[id].h)>=st.lv&&(!st.dark||dark())&&(!st.with||isRes(st.with));
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
