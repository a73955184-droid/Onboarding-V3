import assert from 'node:assert/strict';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';


const baseInput = {
  portfolioSystemId: 'GA-intentional',
  variantId: 'intentional',
  targetSleeveId: 'alternativeStrategy'
};

const added = resolveSecurityPortfolioFit({
  ...baseInput,
  candidateSecurityId: 'dbmf',
  holdingsBySleeve: {}
});

const replaced = resolveSecurityPortfolioFit({
  ...baseInput,
  candidateSecurityId: 'dbmf',
  holdingsBySleeve: {
    alternativeStrategy: ['qai']
  }
});

const redundant = resolveSecurityPortfolioFit({
  ...baseInput,
  candidateSecurityId: 'dbmf',
  holdingsBySleeve: {
    alternativeStrategy: ['dbmf']
  }
});

const rejected = resolveSecurityPortfolioFit({
  ...baseInput,
  candidateSecurityId: 'qai',
  holdingsBySleeve: {}
});

assert.equal(added.outcome, 'add');
assert.equal(replaced.outcome, 'replace');
assert.equal(replaced.affectedSecurityId, 'qai');
assert.equal(redundant.outcome, 'redundant');
assert.equal(rejected.outcome, 'do-not-add');

console.log(
  'Sleeve security fit rules test passed: all four contextual outcomes are distinct.'
);

