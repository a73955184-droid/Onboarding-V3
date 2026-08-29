import assert from 'node:assert/strict';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';


const input = {
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  targetSleeveId: 'smallValueImprovement',
  candidateSecurityId: 'vbr'
};

const missingRole = resolveSecurityPortfolioFit({
  ...input,
  holdingsBySleeve: {}
});

const duplicate = resolveSecurityPortfolioFit({
  ...input,
  holdingsBySleeve: {
    smallValueImprovement: ['vbr']
  }
});

assert.equal(missingRole.outcome, 'add');
assert.equal(duplicate.outcome, 'redundant');
assert.equal(missingRole.allocationBefore.holdings.length, 0);
assert.equal(missingRole.allocationAfter.holdings.length, 1);
assert.equal(
  missingRole.allocationAfter.totalWeight,
  0.1
);
assert.equal(
  duplicate.allocationAfter.holdings.length,
  duplicate.allocationBefore.holdings.length
);

const pending = resolveSecurityPortfolioFit({
  ...input,
  candidateSecurityId: 'avuv',
  holdingsBySleeve: {}
});

assert.equal(pending.outcome, 'do-not-add');
assert.notEqual(pending.outcome, 'add');
assert.notEqual(pending.outcome, 'replace');

console.log(
  'Security portfolio fit resolver test passed: outcomes depend on exact hypothetical holdings.'
);

