import assert from 'node:assert/strict';

import {
  addCurationHolding,
  clearCurationCandidate,
  createPortfolioCurationSession,
  replaceCurationHolding,
  saveCurationAlternative,
  selectCurationCandidate,
  selectCurationCategory,
  setCurationAssessment
} from '../src/features/recommendation/portfolio-curation-session.js';

const sleeves = [
  {
    id: 'core',
    assetCategories: [{ id: 'global-equity' }]
  },
  {
    id: 'stability',
    assetCategories: [{ id: 'high-quality-bonds' }]
  }
];
const state = createPortfolioCurationSession(sleeves);

assert.deepEqual(state, {
  holdingsBySleeve: { core: [], stability: [] },
  savedAlternativesBySleeve: { core: [], stability: [] },
  activeCategoryIdBySleeve: {
    core: 'global-equity',
    stability: 'high-quality-bonds'
  },
  activeCandidateIdBySleeve: { core: null, stability: null },
  assessmentBySleeve: { core: null, stability: null }
});

selectCurationCandidate(state, 'core', 'vt');
assert.equal(state.activeCandidateIdBySleeve.core, 'vt');
assert.deepEqual(state.holdingsBySleeve.core, []);
assert.equal(state.assessmentBySleeve.core, null);

setCurationAssessment(state, 'core', { assessmentStatus: 'complete' });
setCurationAssessment(state, 'stability', { assessmentStatus: 'complete' });
addCurationHolding(state, 'core', 'vt');
assert.deepEqual(state.holdingsBySleeve.core, ['vt']);
assert.equal(state.assessmentBySleeve.core, null);
assert.equal(state.assessmentBySleeve.stability, null);

addCurationHolding(state, 'core', 'acwi');
assert.deepEqual(state.holdingsBySleeve.core, ['vt', 'acwi']);
replaceCurationHolding(state, 'core', 'vt', 'spgm');
assert.deepEqual(state.holdingsBySleeve.core, ['spgm', 'acwi']);

saveCurationAlternative(state, 'core', 'vt');
saveCurationAlternative(state, 'core', 'vt');
assert.deepEqual(state.savedAlternativesBySleeve.core, ['vt']);
assert.equal('allocation' in state.savedAlternativesBySleeve, false);

selectCurationCategory(state, 'core', 'broad-us-equity');
assert.equal(state.activeCategoryIdBySleeve.core, 'broad-us-equity');
assert.equal(state.activeCandidateIdBySleeve.core, null);
assert.equal(state.assessmentBySleeve.core, null);

selectCurationCandidate(state, 'core', 'vti');
clearCurationCandidate(state, 'core');
assert.equal(state.activeCandidateIdBySleeve.core, null);

console.log(
  'Portfolio curation session test passed: holdings remain temporary, portfolio-wide and assessment-invalidating.'
);
