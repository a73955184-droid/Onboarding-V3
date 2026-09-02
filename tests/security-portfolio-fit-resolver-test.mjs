import assert from 'node:assert/strict';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';

const input = {
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  targetSleeveId: 'smallValueImprovement'
};
const added = resolveSecurityPortfolioFit({
  ...input,
  candidateSecurityId: 'vbr',
  holdingsBySleeve: {}
});
const duplicate = resolveSecurityPortfolioFit({
  ...input,
  candidateSecurityId: 'vbr',
  holdingsBySleeve: { smallValueImprovement: ['vbr'] }
});

assert.equal(added.assessmentStatus, 'complete');
assert.equal(added.outcome, 'add');
assert.equal(duplicate.assessmentStatus, 'complete');
assert.equal(duplicate.outcome, 'redundant');
assert.equal(added.allocationBefore.holdings.length, 0);
assert.equal(added.allocationAfter.holdings.length, 1);
assert.equal(added.allocationAfter.totalWeight, 0.1);
assert.equal(
  duplicate.allocationAfter.holdings.length,
  duplicate.allocationBefore.holdings.length
);

const incompleteCandidate = resolveSecurityPortfolioFit({
  ...input,
  candidateSecurityId: 'vfmf',
  holdingsBySleeve: {}
});
assert.equal(incompleteCandidate.assessmentStatus, 'unavailable');
assert.equal(incompleteCandidate.outcome, null);
assert.equal(incompleteCandidate.reasonCode, 'incomplete-security-profile');
assert.equal(incompleteCandidate.missingFields[0].securityId, 'vfmf');

const incompleteHolding = resolveSecurityPortfolioFit({
  ...input,
  candidateSecurityId: 'vbr',
  holdingsBySleeve: { durableCore: ['vfmf'] }
});
assert.equal(incompleteHolding.assessmentStatus, 'unavailable');
assert.equal(incompleteHolding.outcome, null);
assert.equal(incompleteHolding.reasonCode, 'missing-holdings-profile');

const expandedExactMapping = resolveSecurityPortfolioFit({
  ...input,
  candidateSecurityId: 'avuv',
  holdingsBySleeve: {}
});
assert.equal(expandedExactMapping.assessmentStatus, 'complete');
assert.equal(expandedExactMapping.outcome, 'add');

for (const unavailable of [
  incompleteCandidate,
  incompleteHolding
]) {
  assert.equal('allocationBefore' in unavailable, false);
  assert.equal('allocationAfter' in unavailable, false);
}

console.log(
  'Security portfolio fit resolver test passed: readiness, expanded exact eligibility and equal-weight outputs are separated.'
);
