import './assessment-config.js';

const SCORE_KEYS = ['BFO','GD','FT','GA','TO','IP','ES'];
const STAGE_KEYS = Object.keys(globalThis.STAGES);
const STYLE_KEYS = Object.keys(globalThis.STYLES);
const MODIFIER_KEYS = Object.keys(globalThis.MODIFIERS);

function zeroMap(keys) { return Object.fromEntries(keys.map(k => [k, 0])); }
export function emptyState() {
  return {
    version: globalThis.ASSESSMENT_VERSION,
    archetypeScores: zeroMap(SCORE_KEYS),
    stageScores: zeroMap(STAGE_KEYS),
    styleScores: zeroMap(STYLE_KEYS),
    modifierScores: zeroMap(MODIFIER_KEYS),
    answers: {}, metadata: {}, signals: [], result: null
  };
}
export function addScores(target, mapping, weight=1) { for (const [key,value] of Object.entries(mapping || {})) target[key] = (target[key] || 0) + Number(value) * weight; }
function rankScores(scores) { return Object.entries(scores).map(([id,score]) => ({id,score:Number(score)||0})).sort((a,b)=>b.score-a.score); }
function applyAgeModifier(scores, age) {
  const m=(key,factor)=>{scores[key]=(scores[key]||0)*factor;};
  if(age==='under25'){m('GA',1.2);m('TO',1.2);m('FT',1.1);} if(age==='25-34'){m('FT',1.1);m('GA',1.1);}
  if(age==='45-54'){m('BFO',1.1);m('IP',1.1);} if(age==='55plus'){m('IP',1.3);m('GD',1.1);m('TO',0.7);}
}
export function resolveAssessment(state) {
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
export function applyAnswer(state, config, selectedIds) {
  const chosen=selectedIds.map(id=>config.options.find(o=>o.id===id)).filter(Boolean);
  state.answers[config.screenKey]=chosen.map((opt,index)=>({id:opt.id,label:opt.label,screen:config.title,selectionOrder:index+1}));
  chosen.forEach((opt,index)=>{
    const logic=globalThis.OPTION_LOGIC[config.screenKey]?.[opt.id] || {}; const weight=index===0?1:0.75;
    addScores(state.archetypeScores,logic.archetype,weight); addScores(state.stageScores,logic.stage,weight); addScores(state.styleScores,logic.style,weight); addScores(state.modifierScores,logic.modifier,weight);
    state.signals.push(...(logic.signals||[])); if(logic.metadata) Object.assign(state.metadata,logic.metadata);
  });
  if(config.type==='age') applyAgeModifier(state.archetypeScores, chosen[0]?.id);
  state.metadata.lastStep=config.screenKey;
  if(config.step===8) state.result=resolveAssessment(state);
  return state;
}
