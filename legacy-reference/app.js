const SCORE_KEYS = ['BFO','GD','FT','GA','TO','IP','ES'];
const STAGE_KEYS = Object.keys(STAGES);
const STYLE_KEYS = Object.keys(STYLES);
const MODIFIER_KEYS = Object.keys(MODIFIERS);

function zeroMap(keys) { return Object.fromEntries(keys.map(k => [k, 0])); }
function emptyState() {
  return {
    version: ASSESSMENT_VERSION,
    archetypeScores: zeroMap(SCORE_KEYS),
    stageScores: zeroMap(STAGE_KEYS),
    styleScores: zeroMap(STYLE_KEYS),
    modifierScores: zeroMap(MODIFIER_KEYS),
    answers: {}, metadata: {}, signals: [], result: null
  };
}
function getState() {
  const raw = new URLSearchParams(window.location.search).get('state');
  if (!raw) return emptyState();
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    const base = emptyState();
    return {
      ...base, ...parsed,
      archetypeScores: { ...base.archetypeScores, ...(parsed.archetypeScores || parsed.scores || {}) },
      stageScores: { ...base.stageScores, ...(parsed.stageScores || {}) },
      styleScores: { ...base.styleScores, ...(parsed.styleScores || {}) },
      modifierScores: { ...base.modifierScores, ...(parsed.modifierScores || {}) },
      answers: { ...(parsed.answers || {}) }, metadata: { ...(parsed.metadata || {}) }, signals: [...(parsed.signals || [])]
    };
  } catch (error) { console.error('State parse error', error); return emptyState(); }
}
function goTo(page, state) { window.location.href = `${page}?state=${encodeURIComponent(JSON.stringify(state))}`; }
function addScores(target, mapping, weight=1) { for (const [key,value] of Object.entries(mapping || {})) target[key] = (target[key] || 0) + Number(value) * weight; }
function rankScores(scores) { return Object.entries(scores).map(([id,score]) => ({id,score:Number(score)||0})).sort((a,b)=>b.score-a.score); }
function applyAgeModifier(scores, age) {
  const m=(key,factor)=>{scores[key]=(scores[key]||0)*factor;};
  if(age==='under25'){m('GA',1.2);m('TO',1.2);m('FT',1.1);} if(age==='25-34'){m('FT',1.1);m('GA',1.1);}
  if(age==='45-54'){m('BFO',1.1);m('IP',1.1);} if(age==='55plus'){m('IP',1.3);m('GD',1.1);m('TO',0.7);}
}
function resolveAssessment(state) {
  const archetypes = rankScores(state.archetypeScores);
  const stages = rankScores(state.stageScores);
  const styles = rankScores(state.styleScores);
  const modifiers = rankScores(state.modifierScores);
  let primaryStyle = styles[0]?.id || 'steady_steward';
  if (primaryStyle === 'active_navigator') {
    const activeSignals = state.signals.filter(s => ['opportunity seeking','active exploration','control preference','opportunity pressure'].includes(s)).length;
    if (activeSignals < 2) primaryStyle = 'bounded_explorer';
  }
  const total = Math.max(1, archetypes.reduce((sum,x)=>sum+Math.max(0,x.score),0));
  const confidence = Math.round(Math.max(35, Math.min(95, ((archetypes[0]?.score || 0) / total) * 100 + 35)));
  return {
    archetypeId: archetypes[0]?.id || 'GD', secondaryArchetypeId: archetypes[1]?.id || 'BFO',
    stageId: stages[0]?.id || 'portfolio_organizer', styleId: primaryStyle,
    modifierId: modifiers[0]?.id || 'confidence_builder', secondaryModifierId: modifiers[1]?.score > 0 ? modifiers[1].id : null,
    confidence
  };
}
function setupOptionScreen(config) {
  const state=getState(), grid=document.getElementById('options'), continueBtn=document.getElementById('continueBtn');
  const selected=[]; const max=config.max||1, min=config.min||1;
  grid.innerHTML=config.options.map(opt=>`<button class="option-card" data-id="${opt.id}" type="button"><span class="option-card-title">${opt.label}</span><span class="option-card-meta">${opt.helper||''}</span><span class="check">✓</span></button>`).join('');
  grid.querySelectorAll('.option-card').forEach(card=>card.addEventListener('click',()=>{
    const id=card.dataset.id, index=selected.indexOf(id);
    if(index>=0){selected.splice(index,1);card.classList.remove('selected');}
    else { if(max===1){selected.splice(0);grid.querySelectorAll('.option-card').forEach(c=>c.classList.remove('selected'));} if(selected.length<max){selected.push(id);card.classList.add('selected');} }
    continueBtn.disabled=selected.length<min;
  }));
  continueBtn.disabled=true;
  continueBtn.addEventListener('click',()=>{
    const chosen=selected.map(id=>config.options.find(o=>o.id===id)).filter(Boolean);
    state.answers[config.screenKey]=chosen.map((opt,index)=>({id:opt.id,label:opt.label,screen:config.title,selectionOrder:index+1}));
    chosen.forEach((opt,index)=>{
      const logic=OPTION_LOGIC[config.screenKey]?.[opt.id] || {}; const weight=index===0?1:0.75;
      addScores(state.archetypeScores,logic.archetype,weight); addScores(state.stageScores,logic.stage,weight); addScores(state.styleScores,logic.style,weight); addScores(state.modifierScores,logic.modifier,weight);
      state.signals.push(...(logic.signals||[])); if(logic.metadata) Object.assign(state.metadata,logic.metadata);
    });
    if(config.type==='age') applyAgeModifier(state.archetypeScores, chosen[0]?.id);
    state.metadata.lastStep=config.screenKey; state.result=config.next==='recommendation.html'?resolveAssessment(state):null; goTo(config.next,state);
  });
  const backBtn=document.getElementById('backBtn'); if(backBtn) backBtn.addEventListener('click',()=>history.back());
}
