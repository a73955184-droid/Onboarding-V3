import assert from 'node:assert/strict';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';

const baseInput = {
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  targetSleeveId: 'stability',
  candidateSecurityId: 'bnd'
};
const scenarios = {
  add: {},
  replace: { stability: ['lqd'] },
  redundant: { stability: ['bnd'] },
  'do-not-add': { broadGrowthCore: ['lqd'] }
};
const results = Object.fromEntries(
  Object.entries(scenarios).map(([expectedOutcome, holdingsBySleeve]) => [
    expectedOutcome,
    resolveSecurityPortfolioFit({ ...baseInput, holdingsBySleeve })
  ])
);

for (const [expectedOutcome, result] of Object.entries(results)) {
  assert.equal(result.assessmentStatus, 'complete');
  assert.equal(result.outcome, expectedOutcome);
}

assert.equal(results.replace.affectedSecurityId, 'lqd');
assert.equal(
  results.redundant.allocationAfter.totalWeight,
  results.redundant.allocationBefore.totalWeight
);
assert.equal(
  results['do-not-add'].reasonCodes[0],
  'cross-sleeve-role-conflict'
);
assert.equal(
  new Set(
    Object.values(results).map(({ candidateSecurityId }) => candidateSecurityId)
  ).size,
  1
);

console.log(
  'Sleeve security fit rules test passed: BND reaches all four outcomes from holdings context alone.'
);
