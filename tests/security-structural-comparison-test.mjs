import assert from 'node:assert/strict';

import {
  classifySecurityBreadth,
  resolveSecuritySleeveAlignment,
  resolveSecuritySleeveBoundaryAlignment
} from '../src/domain/portfolio-system/security-sleeve-alignment.js';

import {
  resolveCrossSleeveStructuralOverlaps,
  resolveSecurityStructuralOverlap
} from '../src/domain/portfolio-system/security-structural-overlap.js';

import {
  resolveSecurityReplacementComparison
} from '../src/domain/portfolio-system/security-replacement-comparison.js';


const usCore = {
  portfolioSystemId: 'ES-intentional',
  variantId: 'intentional',
  sleeveId: 'usCore'
};

const stability = {
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  sleeveId: 'stability'
};

const factorImprovement = {
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  sleeveId: 'qualityImprovement'
};

const income = {
  portfolioSystemId: 'BFO-intentional',
  variantId: 'intentional',
  sleeveId: 'income'
};

const inflationProtection = {
  portfolioSystemId: 'IP-essential',
  variantId: 'essential',
  sleeveId: 'inflationProtection'
};


const aligned = resolveSecuritySleeveAlignment({
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  sleeveId: 'globalDiversification',
  candidateSecurityId: 'vxus'
});

assert.equal(aligned.aligned, true);
assert.deepEqual(
  aligned.matchedCategoryIds,
  ['broad-international-equity']
);
assert.equal(
  aligned.matchedJob,
  'geographic-diversification'
);
assert.equal(
  aligned.matchedReturnRole,
  'geographic-diversification'
);
assert.deepEqual(aligned.conflicts, []);


const sameSecurity = resolveSecurityStructuralOverlap({
  ...usCore,
  candidateSecurityId: 'vti',
  holdingSecurityId: 'vti'
});

assert.equal(sameSecurity.sameSecurity, true);
assert.equal(sameSecurity.overlapLevel, 'high');
assert.equal(sameSecurity.sameCategoryRole, true);


const nearIdentical = resolveSecurityStructuralOverlap({
  ...usCore,
  candidateSecurityId: 'vti',
  holdingSecurityId: 'itot'
});

assert.equal(nearIdentical.sameSecurity, false);
assert.equal(nearIdentical.overlapLevel, 'high');
assert.equal(nearIdentical.sameCategoryRole, true);
assert.deepEqual(nearIdentical.distinctDimensions, {});


const differentFactorRole = resolveSecurityStructuralOverlap({
  ...factorImprovement,
  candidateSecurityId: 'qual',
  holdingSecurityId: 'vti'
});

assert.equal(differentFactorRole.overlapLevel, 'low');
assert.equal(differentFactorRole.sameCategoryRole, false);
assert.deepEqual(
  differentFactorRole.sharedDimensions.assetClasses,
  ['equity']
);
assert.deepEqual(
  differentFactorRole.distinctDimensions.factors,
  {
    candidateOnly: ['quality'],
    holdingOnly: []
  }
);


const differentComplexity =
  resolveSecurityReplacementComparison({
    ...stability,
    candidateSecurityId: 'bnd',
    holdingSecurityId: 'lqd'
  });

assert.equal(differentComplexity.replacementJustified, true);
assert.deepEqual(
  differentComplexity.advantages,
  ['lower-complexity']
);
assert.deepEqual(differentComplexity.disadvantages, []);


const crossSleeve = resolveCrossSleeveStructuralOverlaps({
  candidateSecurityId: 'bnd',
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  targetSleeveId: 'stability',
  holdingsBySleeve: {
    broadGrowthCore: ['lqd'],
    stability: ['agg']
  }
});

assert.equal(crossSleeve.comparisonAvailable, true);
assert.equal(crossSleeve.comparisons.length, 1);
assert.equal(
  crossSleeve.comparisons[0].holdingSleeveId,
  'broadGrowthCore'
);
assert.equal(
  crossSleeve.comparisons[0].overlap.sameCategoryRole,
  true
);
assert.deepEqual(
  crossSleeve.comparisons[0].overlap.matchedCategoryIds,
  ['high-quality-bonds']
);


const prohibitedStrategy =
  resolveSecuritySleeveBoundaryAlignment({
    ...income,
    candidateSecurityId: 'dgrw'
  });

assert.equal(
  prohibitedStrategy.sleeveAlignment.aligned,
  true,
  'The category is permitted independently of boundary alignment'
);
assert.equal(prohibitedStrategy.aligned, false);
assert.ok(
  prohibitedStrategy.conflicts.some(
    ({ code }) => code === 'strategy-type-not-permitted'
  )
);


const bondComparison = resolveSecurityStructuralOverlap({
  ...stability,
  candidateSecurityId: 'bnd',
  holdingSecurityId: 'lqd'
});

assert.deepEqual(
  bondComparison.sharedDimensions.creditQualities,
  ['investment-grade']
);
assert.deepEqual(
  bondComparison.distinctDimensions.durationBand,
  {
    candidateOnly: ['broad'],
    holdingOnly: ['intermediate']
  }
);

const bondBoundary = resolveSecuritySleeveBoundaryAlignment({
  ...stability,
  candidateSecurityId: 'bnd'
});

assert.equal(bondBoundary.checks.durationBand.aligned, true);
assert.equal(bondBoundary.checks.durationBand.actual, 'broad');
assert.equal(bondBoundary.checks.creditQualities.aligned, true);
assert.deepEqual(
  bondBoundary.checks.creditQualities.actual,
  ['investment-grade']
);


const incomeComparison = resolveSecurityStructuralOverlap({
  ...income,
  candidateSecurityId: 'schd',
  holdingSecurityId: 'dgrw'
});

assert.equal(incomeComparison.sameCategoryRole, true);
assert.deepEqual(
  incomeComparison.sharedDimensions.incomeRole,
  ['primary']
);

const incomeBoundary = resolveSecuritySleeveBoundaryAlignment({
  ...income,
  candidateSecurityId: 'schd'
});

assert.equal(incomeBoundary.aligned, true);
assert.equal(incomeBoundary.checks.incomeRole.aligned, true);
assert.equal(incomeBoundary.checks.incomeRole.actual, 'primary');

const betterIncomeAlignment =
  resolveSecurityReplacementComparison({
    ...income,
    candidateSecurityId: 'schd',
    holdingSecurityId: 'dgrw'
  });

assert.equal(
  betterIncomeAlignment.replacementJustified,
  true
);
assert.ok(
  betterIncomeAlignment.advantages.includes(
    'better-strategy-type-alignment'
  )
);


const inflationComparison = resolveSecurityStructuralOverlap({
  ...inflationProtection,
  candidateSecurityId: 'tip',
  holdingSecurityId: 'schp'
});

assert.equal(inflationComparison.overlapLevel, 'high');
assert.deepEqual(
  inflationComparison.sharedDimensions.inflationSensitivity,
  ['explicit']
);

const inflationBoundary =
  resolveSecuritySleeveBoundaryAlignment({
    ...inflationProtection,
    candidateSecurityId: 'tip'
  });

assert.equal(inflationBoundary.aligned, true);
assert.equal(
  inflationBoundary.checks.inflationSensitivity.aligned,
  true
);


const duplicateReplacement =
  resolveSecurityReplacementComparison({
    ...usCore,
    candidateSecurityId: 'vti',
    holdingSecurityId: 'vti'
  });

assert.equal(duplicateReplacement.replacementJustified, false);
assert.ok(
  duplicateReplacement.disadvantages.includes('same-security')
);


assert.equal(
  classifySecurityBreadth({
    categoryIds: ['broad-us-equity'],
    strategyType: 'thematic-equity'
  }),
  'narrow',
  'Approved category/strategy classifications, not array size, determine breadth'
);

console.log(
  'Security structural comparison test passed: alignment, boundaries, sleeve-scoped overlap and replacement evidence are deterministic.'
);
