import assert from 'node:assert/strict';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';

import {
  resolveSecuritySleeveBoundaryAlignment
} from '../src/domain/portfolio-system/security-sleeve-alignment.js';

import {
  resolveSecurityStructuralOverlap
} from '../src/domain/portfolio-system/security-structural-overlap.js';

import {
  resolveSleeveSecurityFit
} from '../src/domain/portfolio-system/sleeve-security-fit-rules.js';


function boundary(context, candidateSecurityId) {
  return resolveSecuritySleeveBoundaryAlignment({
    ...context,
    candidateSecurityId
  });
}


// Strategic foundation: broad exposure fits; thematic exposure conflicts.
const foundation = {
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  sleeveId: 'broadGrowthCore'
};
const broadFoundation = boundary(foundation, 'vt');
const thematicFoundation = boundary(foundation, 'arkk');

assert.equal(broadFoundation.aligned, true);
assert.equal(broadFoundation.checks.strategyType.actual, 'broad-equity');
assert.equal(broadFoundation.checks.complexity.actual, 'low');
assert.equal(thematicFoundation.aligned, false);
assert.equal(thematicFoundation.checks.strategyType.actual, 'thematic-equity');
assert.equal(thematicFoundation.checks.complexity.actual, 'high');
assert.ok(thematicFoundation.conflicts.some(
  ({ code }) => code === 'breadth-not-compatible'
));


// Geographic diversification: a missing role adds; an existing role repeats.
const internationalInput = {
  portfolioSystemId: 'ES-intentional',
  variantId: 'intentional',
  targetSleeveId: 'internationalCore',
  candidateSecurityId: 'vxus'
};
const missingInternational = resolveSecurityPortfolioFit({
  ...internationalInput,
  holdingsBySleeve: {}
});
const existingInternational = resolveSecurityPortfolioFit({
  ...internationalInput,
  holdingsBySleeve: { internationalCore: ['ixus'] }
});

assert.equal(missingInternational.outcome, 'add');
assert.equal(existingInternational.outcome, 'redundant');
assert.deepEqual(
  existingInternational.decisionFactors.overlap.overlappingSecurityIds,
  ['ixus']
);


// Factor improvement: quality and small value remain distinct roles.
const factorDistinction = resolveSecurityStructuralOverlap({
  portfolioSystemId: 'FT-engaged',
  variantId: 'engaged',
  sleeveId: 'factorImprovements',
  candidateSecurityId: 'qual',
  holdingSecurityId: 'avuv'
});

assert.equal(factorDistinction.sameCategoryRole, false);
assert.deepEqual(
  factorDistinction.distinctDimensions.factors,
  {
    candidateOnly: ['quality'],
    holdingOnly: ['size', 'value']
  }
);


// Stability: government and investment-grade credit facts remain explicit.
const stability = {
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  sleeveId: 'stability'
};
const governmentStability = boundary(stability, 'govt');
const creditStability = boundary(stability, 'lqd');

assert.equal(governmentStability.aligned, true);
assert.deepEqual(
  governmentStability.checks.creditQualities.actual,
  ['government']
);
assert.equal(creditStability.aligned, true);
assert.deepEqual(
  creditStability.checks.creditQualities.actual,
  ['investment-grade']
);


// Income: equity income role and bond credit quality are context-specific.
const equityIncome = boundary({
  portfolioSystemId: 'BFO-intentional',
  variantId: 'intentional',
  sleeveId: 'income'
}, 'schd');
const creditIncome = boundary({
  portfolioSystemId: 'BFO-engaged',
  variantId: 'engaged',
  sleeveId: 'income'
}, 'lqd');

assert.equal(equityIncome.aligned, true);
assert.equal(equityIncome.checks.incomeRole.actual, 'primary');
assert.equal(equityIncome.checks.creditQualities.applicable, false);
assert.equal(creditIncome.aligned, true);
assert.equal(creditIncome.checks.incomeRole.actual, 'supporting');
assert.deepEqual(
  creditIncome.checks.creditQualities.actual,
  ['investment-grade']
);


// Inflation protection: explicit and indirect sensitivity both remain visible.
const inflation = {
  portfolioSystemId: 'GD-intentional',
  variantId: 'intentional',
  sleeveId: 'inflationResilience'
};
const explicitInflation = boundary(inflation, 'tip');
const indirectInflation = boundary(inflation, 'vnq');

assert.equal(explicitInflation.aligned, true);
assert.equal(
  explicitInflation.checks.inflationSensitivity.actual,
  'explicit'
);
assert.equal(indirectInflation.aligned, true);
assert.equal(
  indirectInflation.checks.inflationSensitivity.actual,
  'indirect'
);


// Alternatives: both moderate and high complexity are intentionally allowed.
const moderateAlternative = boundary({
  portfolioSystemId: 'GA-essential',
  variantId: 'essential',
  sleeveId: 'alternativeStrategy'
}, 'schh');
const highAlternative = boundary({
  portfolioSystemId: 'GA-intentional',
  variantId: 'intentional',
  sleeveId: 'alternativeStrategy'
}, 'dbmf');

assert.equal(moderateAlternative.aligned, true);
assert.equal(moderateAlternative.checks.complexity.actual, 'moderate');
assert.equal(highAlternative.aligned, true);
assert.equal(highAlternative.checks.complexity.actual, 'high');


// Tactical allocation: narrow sector exposure is permitted in this context.
const tactical = boundary({
  portfolioSystemId: 'TO-intentional',
  variantId: 'intentional',
  sleeveId: 'tacticalAllocation'
}, 'xlk');

assert.equal(tactical.aligned, true);
assert.equal(tactical.checks.breadth.actual, 'narrow');
assert.equal(tactical.checks.strategyType.actual, 'sector-equity');


// Low-effort foundation: the same high-complexity theme remains rejected.
assert.equal(thematicFoundation.checks.complexity.aligned, false);
assert.ok(thematicFoundation.conflicts.some(
  ({ code }) => code === 'complexity-not-permitted'
));


// Cross-sleeve portfolio: a valid role already assigned elsewhere conflicts.
const wrongSleeve = resolveSecurityPortfolioFit({
  portfolioSystemId: 'TO-intentional',
  variantId: 'intentional',
  targetSleeveId: 'stabilityReserve',
  candidateSecurityId: 'sgov',
  holdingsBySleeve: { liquidity: ['bil'] }
});

assert.equal(wrongSleeve.outcome, 'do-not-add');
assert.equal(
  wrongSleeve.decisionFactors.crossSleeveRole.status,
  'conflict'
);
assert.deepEqual(
  wrongSleeve.decisionFactors.crossSleeveRole.overlappingSleeveIds,
  ['liquidity']
);


// Explicit five-state fixtures.
const add = resolveSecurityPortfolioFit({
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  targetSleeveId: 'stability',
  candidateSecurityId: 'bnd',
  holdingsBySleeve: {}
});
const replace = resolveSecurityPortfolioFit({
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  targetSleeveId: 'stability',
  candidateSecurityId: 'bnd',
  holdingsBySleeve: { stability: ['lqd'] }
});
const redundant = resolveSecurityPortfolioFit({
  portfolioSystemId: 'ES-intentional',
  variantId: 'intentional',
  targetSleeveId: 'usCore',
  candidateSecurityId: 'vti',
  holdingsBySleeve: { usCore: ['itot'] }
});
const completedRuleConflict = resolveSleeveSecurityFit({
  portfolioSystemId: 'BFO-intentional',
  variantId: 'intentional',
  targetSleeveId: 'income',
  candidateSecurityId: 'dgrw',
  holdingsBySleeve: {},
  exactEligibilityStatus: 'eligible'
});
const unavailable = resolveSecurityPortfolioFit({
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  targetSleeveId: 'smallValueImprovement',
  candidateSecurityId: 'vfmf',
  holdingsBySleeve: {}
});

assert.equal(add.outcome, 'add');
assert.equal(add.reasonCodes[0], 'fills-missing-permitted-role');
assert.equal(replace.outcome, 'replace');
assert.equal(replace.affectedSecurityId, 'lqd');
assert.ok(
  replace.decisionFactors.replacement.advantages.includes(
    'lower-complexity'
  )
);
assert.equal(redundant.outcome, 'redundant');
assert.equal(redundant.decisionFactors.overlap.status, 'high');
assert.equal(completedRuleConflict.assessmentAvailable, true);
assert.equal(completedRuleConflict.outcome, 'do-not-add');
assert.equal(
  completedRuleConflict.reasonCodes[0],
  'sleeve-boundary-conflict'
);
assert.equal(unavailable.assessmentStatus, 'unavailable');
assert.equal(unavailable.outcome, null);
assert.equal('allocationBefore' in unavailable, false);
assert.equal('allocationAfter' in unavailable, false);

console.log(
  'Security fit scenario matrix test passed: ten philosophy contexts and all five assessment states are verified.'
);
