import assert from 'node:assert/strict';

import {
  addCurationHolding,
  clearCurationCandidate,
  createPortfolioCurationSession,
  removeCurationHolding,
  replaceCurationHolding,
  saveCurationAlternative,
  selectCurationCandidate,
  selectCurationCategory,
  setCurationAssessment
} from '../src/features/recommendation/portfolio-curation-session.js';

import {
  resolveEqualWeightAllocation
} from '../src/domain/portfolio-system/hypothetical-allocation-resolver.js';

const allocationFor = (securityIds) =>
  resolveEqualWeightAllocation({
    sleeveWeight: 0.4,
    securityIds
  });

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

selectCurationCandidate(state, 'stability', 'bnd');
assert.equal(state.activeCandidateIdBySleeve.core, 'vt');
assert.equal(state.activeCandidateIdBySleeve.stability, 'bnd');
assert.deepEqual(state.holdingsBySleeve.stability, []);

setCurationAssessment(state, 'core', { assessmentStatus: 'complete' });
setCurationAssessment(state, 'stability', { assessmentStatus: 'complete' });
addCurationHolding(state, 'core', 'vt');
assert.deepEqual(state.holdingsBySleeve.core, ['vt']);
assert.equal(state.assessmentBySleeve.core, null);
assert.equal('outcome' in state, false);
assert.equal(state.assessmentBySleeve.core, null);
assert.equal(state.assessmentBySleeve.stability, null);

addCurationHolding(state, 'core', 'acwi');
assert.deepEqual(state.holdingsBySleeve.core, ['vt', 'acwi']);
assert.deepEqual(
  allocationFor(state.holdingsBySleeve.core).holdings.map(
    ({ weight }) => weight
  ),
  [0.2, 0.2]
);
replaceCurationHolding(state, 'core', 'vt', 'spgm');
assert.deepEqual(state.holdingsBySleeve.core, ['spgm', 'acwi']);
assert.deepEqual(
  allocationFor(state.holdingsBySleeve.core).holdings.map(
    ({ weight }) => weight
  ),
  [0.2, 0.2]
);

setCurationAssessment(state, 'core', { assessmentStatus: 'complete' });
setCurationAssessment(state, 'stability', { assessmentStatus: 'complete' });
removeCurationHolding(state, 'core', 'acwi');
assert.deepEqual(state.holdingsBySleeve.core, ['spgm']);
assert.deepEqual(
  allocationFor(state.holdingsBySleeve.core).holdings.map(
    ({ weight }) => weight
  ),
  [0.4]
);
assert.equal(state.assessmentBySleeve.core, null);
assert.equal(state.assessmentBySleeve.stability, null);

saveCurationAlternative(state, 'core', 'vt');
saveCurationAlternative(state, 'core', 'vt');
assert.deepEqual(state.savedAlternativesBySleeve.core, ['vt']);
assert.equal('allocation' in state.savedAlternativesBySleeve, false);

saveCurationAlternative(state, 'core', 'spgm');
assert.deepEqual(
  state.savedAlternativesBySleeve.core,
  ['vt'],
  'A holding cannot simultaneously be saved as an alternative'
);

addCurationHolding(state, 'core', 'vt');
assert.deepEqual(state.savedAlternativesBySleeve.core, []);

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
