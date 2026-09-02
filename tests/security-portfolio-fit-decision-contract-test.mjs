import assert from 'node:assert/strict';

import {
  CONSTITUENT_PORTFOLIOS
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';

import {
  resolveSleeveSecurityFit
} from '../src/domain/portfolio-system/sleeve-security-fit-rules.js';


const constituentSnapshot = JSON.stringify(
  CONSTITUENT_PORTFOLIOS
);

const stability = {
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  targetSleeveId: 'stability'
};

const add = resolveSecurityPortfolioFit({
  ...stability,
  candidateSecurityId: 'bnd',
  holdingsBySleeve: {}
});

assert.equal(add.assessmentStatus, 'complete');
assert.equal(add.outcome, 'add');
assert.equal(add.affectedSecurityId, null);
assert.equal(
  add.decisionFactors.distinctContribution.status,
  'missing-role-filled'
);
assert.equal(
  add.decisionFactors.distinctContribution.matchedRole,
  'stability-and-resilience'
);
assert.deepEqual(
  add.reasonCodes,
  ['fills-missing-permitted-role']
);
assert.equal(add.allocationAfter.holdings.length, 1);
assert.equal(add.allocationAfter.totalWeight, 0.2);


const replace = resolveSecurityPortfolioFit({
  ...stability,
  candidateSecurityId: 'bnd',
  holdingsBySleeve: { stability: ['lqd'] }
});

assert.equal(replace.outcome, 'replace');
assert.equal(replace.affectedSecurityId, 'lqd');
assert.equal(
  replace.decisionFactors.replacement.status,
  'justified'
);
assert.deepEqual(
  replace.decisionFactors.replacement.advantages,
  ['lower-complexity']
);
assert.equal(
  replace.allocationAfter.holdings[0].securityId,
  'bnd'
);
assert.equal(
  replace.allocationAfter.totalWeight,
  replace.allocationBefore.totalWeight
);


const structuralRedundancy = resolveSecurityPortfolioFit({
  portfolioSystemId: 'ES-intentional',
  variantId: 'intentional',
  targetSleeveId: 'usCore',
  candidateSecurityId: 'vti',
  holdingsBySleeve: { usCore: ['itot'] }
});

assert.equal(structuralRedundancy.outcome, 'redundant');
assert.equal(structuralRedundancy.affectedSecurityId, null);
assert.deepEqual(
  structuralRedundancy.reasonCodes,
  ['existing-structural-role-sufficient']
);
assert.equal(
  structuralRedundancy.decisionFactors.overlap.status,
  'high'
);
assert.deepEqual(
  structuralRedundancy.decisionFactors.overlap
    .overlappingSecurityIds,
  ['itot']
);
for (const dimension of [
  'assetClasses',
  'geographies',
  'strategyType'
]) {
  assert.ok(
    structuralRedundancy.decisionFactors.overlap
      .sharedDimensions.includes(dimension)
  );
}
assert.equal(
  structuralRedundancy.decisionFactors.distinctContribution.status,
  'none'
);
assert.deepEqual(
  structuralRedundancy.allocationAfter,
  structuralRedundancy.allocationBefore
);


const intentionalCrossSleeveConflict =
  resolveSecurityPortfolioFit({
    portfolioSystemId: 'TO-intentional',
    variantId: 'intentional',
    targetSleeveId: 'stabilityReserve',
    candidateSecurityId: 'sgov',
    holdingsBySleeve: { liquidity: ['bil'] }
  });

assert.equal(
  intentionalCrossSleeveConflict.outcome,
  'do-not-add'
);
assert.equal(
  intentionalCrossSleeveConflict.decisionFactors
    .crossSleeveRole.status,
  'conflict'
);
assert.deepEqual(
  intentionalCrossSleeveConflict.decisionFactors
    .crossSleeveRole.overlappingSleeveIds,
  ['liquidity']
);
assert.deepEqual(
  intentionalCrossSleeveConflict.allocationAfter,
  intentionalCrossSleeveConflict.allocationBefore
);


// Readiness precedes every completed outcome, including duplication.
const incompleteDuplicate = resolveSecurityPortfolioFit({
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  targetSleeveId: 'smallValueImprovement',
  candidateSecurityId: 'vfmf',
  holdingsBySleeve: { smallValueImprovement: ['vfmf'] }
});

assert.equal(incompleteDuplicate.assessmentStatus, 'unavailable');
assert.equal(incompleteDuplicate.outcome, null);
assert.equal('allocationBefore' in incompleteDuplicate, false);
assert.equal('allocationAfter' in incompleteDuplicate, false);


// Unresolved exact permission precedes sleeve-role alignment.
const unavailableBeforeRoleConflict = resolveSecurityPortfolioFit({
  ...stability,
  candidateSecurityId: 'xlk',
  holdingsBySleeve: { broadGrowthCore: ['xlk'] }
});

assert.equal(unavailableBeforeRoleConflict.assessmentStatus, 'unavailable');
assert.equal(unavailableBeforeRoleConflict.outcome, null);
assert.deepEqual(
  unavailableBeforeRoleConflict.missingFields[0].fields,
  ['exactEligibility']
);
assert.equal(
  'allocationBefore' in unavailableBeforeRoleConflict,
  false
);
assert.equal(
  'allocationAfter' in unavailableBeforeRoleConflict,
  false
);


// Unresolved exact permission also precedes sleeve-boundary alignment.
const unavailableBeforeBoundaryConflict =
  resolveSecurityPortfolioFit({
    portfolioSystemId: 'BFO-intentional',
    variantId: 'intentional',
    targetSleeveId: 'income',
    candidateSecurityId: 'dgrw',
    holdingsBySleeve: { income: ['dgrw'] }
  });

assert.equal(
  unavailableBeforeBoundaryConflict.assessmentStatus,
  'unavailable'
);
assert.equal(unavailableBeforeBoundaryConflict.outcome, null);
assert.deepEqual(
  unavailableBeforeBoundaryConflict.missingFields[0].fields,
  ['exactEligibility']
);


// With exact permission complete, role and boundary conflicts remain
// completed Do not add decisions.
const completedRoleConflict = resolveSleeveSecurityFit({
  ...stability,
  candidateSecurityId: 'xlk',
  holdingsBySleeve: { broadGrowthCore: ['xlk'] },
  exactEligibilityStatus: 'eligible'
});

assert.equal(completedRoleConflict.assessmentAvailable, true);
assert.equal(completedRoleConflict.outcome, 'do-not-add');
assert.equal(completedRoleConflict.reasonCodes[0], 'sleeve-role-conflict');
assert.equal(
  completedRoleConflict.decisionFactors.sleeveBoundary.status,
  'not-evaluated'
);

const completedBoundaryConflict = resolveSleeveSecurityFit({
  portfolioSystemId: 'BFO-intentional',
  variantId: 'intentional',
  targetSleeveId: 'income',
  candidateSecurityId: 'dgrw',
  holdingsBySleeve: { income: ['dgrw'] },
  exactEligibilityStatus: 'eligible'
});

assert.equal(completedBoundaryConflict.assessmentAvailable, true);
assert.equal(completedBoundaryConflict.outcome, 'do-not-add');
assert.equal(
  completedBoundaryConflict.reasonCodes[0],
  'sleeve-boundary-conflict'
);
assert.equal(
  completedBoundaryConflict.decisionFactors.sleeveBoundary.strategyFit,
  'conflict'
);


// Exact duplication precedes cross-sleeve responsibility.
const duplicateBeforeCrossSleeve = resolveSecurityPortfolioFit({
  portfolioSystemId: 'TO-intentional',
  variantId: 'intentional',
  targetSleeveId: 'stabilityReserve',
  candidateSecurityId: 'sgov',
  holdingsBySleeve: { liquidity: ['sgov'] }
});

assert.equal(duplicateBeforeCrossSleeve.outcome, 'redundant');
assert.equal(
  duplicateBeforeCrossSleeve.reasonCodes[0],
  'duplicate-security'
);
assert.equal(
  duplicateBeforeCrossSleeve.decisionFactors
    .crossSleeveRole.status,
  'not-evaluated'
);


// Same-sleeve sufficiency precedes a matching role in another sleeve.
const sameSleeveBeforeCrossSleeve = resolveSecurityPortfolioFit({
  portfolioSystemId: 'TO-intentional',
  variantId: 'intentional',
  targetSleeveId: 'stabilityReserve',
  candidateSecurityId: 'sgov',
  holdingsBySleeve: {
    stabilityReserve: ['bil'],
    liquidity: ['tflo']
  }
});

assert.equal(sameSleeveBeforeCrossSleeve.outcome, 'redundant');
assert.equal(
  sameSleeveBeforeCrossSleeve.reasonCodes[0],
  'existing-structural-role-sufficient'
);
assert.equal(
  sameSleeveBeforeCrossSleeve.decisionFactors
    .crossSleeveRole.status,
  'not-evaluated'
);


// Category membership cannot bypass unresolved exact eligibility.
const categoryOnly = resolveSecurityPortfolioFit({
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  targetSleeveId: 'smallValueImprovement',
  candidateSecurityId: 'avuv',
  holdingsBySleeve: {}
});

assert.equal(categoryOnly.assessmentStatus, 'unavailable');
assert.equal(categoryOnly.outcome, null);
assert.deepEqual(
  categoryOnly.missingFields[0].fields,
  ['exactEligibility']
);


for (const result of [
  add,
  replace,
  structuralRedundancy,
  intentionalCrossSleeveConflict,
  duplicateBeforeCrossSleeve,
  sameSleeveBeforeCrossSleeve
]) {
  assert.ok([
    'add',
    'replace',
    'redundant',
    'do-not-add'
  ].includes(result.outcome));
  assert.equal('outcome' in result.candidate, false);
  assert.equal('outcome' in result.targetSleeve, false);
  assert.doesNotMatch(
    JSON.stringify(result),
    /returns|volatility|drawdown|correlation/i
  );
}

for (const result of [
  incompleteDuplicate,
  unavailableBeforeRoleConflict,
  unavailableBeforeBoundaryConflict,
  categoryOnly
]) {
  assert.equal(result.assessmentStatus, 'unavailable');
  assert.equal(result.outcome, null);
  assert.equal('allocationBefore' in result, false);
  assert.equal('allocationAfter' in result, false);
}

assert.equal(
  JSON.stringify(CONSTITUENT_PORTFOLIOS),
  constituentSnapshot,
  'Fit resolution must not modify constituent portfolio definitions'
);

console.log(
  'Security portfolio-fit decision contract test passed: seven-step precedence, evidence, outcomes and allocations are preserved.'
);
