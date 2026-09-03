import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  resolveSecurityTradeoffs
} from '../src/domain/portfolio-decision-support/security-tradeoff-resolver.js';


function incrementalFixture(overrides = {}) {
  return {
    comparisonAvailable: true,
    candidateSecurityId: 'voo',
    targetSleeveId: 'usCore',
    targetSleeveProfileId: 'strategic-foundation',
    comparedHoldingIds: ['vti'],
    holdingContext: {
      targetSleeveHoldingIds: ['vti'],
      crossSleeveHoldings: []
    },
    sharedDimensions: {
      assetClasses: ['equity'],
      geographies: ['united-states'],
      marketCaps: ['large-cap'],
      strategyType: ['broad-equity']
    },
    distinctDimensions: {
      marketCaps: {
        candidateOnly: [],
        holdingOnly: ['mid-cap', 'small-cap']
      }
    },
    sharedRole: {
      present: true,
      categoryIds: ['broad-us-equity'],
      holdingSecurityIds: ['vti']
    },
    distinctRole: {
      present: false,
      categoryIds: []
    },
    incrementalBreadth: {
      status: 'shared',
      candidateClassification: 'broad',
      existingClassifications: ['broad']
    },
    incrementalCapExposure: {
      added: [],
      increasedEmphasis: ['large-cap'],
      reducedRelativeEmphasis: ['mid-cap', 'small-cap']
    },
    incrementalFactorExposure: [],
    incrementalGeography: [],
    incrementalSectorExposure: [],
    incrementalIncomeRole: null,
    incrementalInflationRole: null,
    complexityChange: {
      direction: 'unchanged',
      candidateLevel: 'low',
      existingLevels: ['low']
    },
    crossSleeveEvidence: {
      portfolioAlreadyHasExposure: false,
      sharedDimensions: {},
      distinctDimensions: {},
      sharedRole: { present: false, categoryIds: [], holdingSecurityIds: [] },
      distinctRole: { present: true, categoryIds: ['broad-us-equity'] },
      comparisons: []
    },
    ...overrides
  };
}


function interpretationFixture(overrides = {}) {
  return {
    interpretation: 'overlapping-but-additive',
    overlapLevel: 'high',
    overlapMeaning: 'existing-coverage-with-incremental-change',
    incrementalContribution: 'moderate',
    concentrationEffect: {
      dimensions: ['large-cap'],
      direction: 'increase'
    },
    implementationEffect: 'adds-another-overlapping-holding',
    structuralEvidence: {
      targetSleeveOverlapLevel: 'high',
      crossSleeveOverlapLevel: 'none',
      contributionSignals: ['increased-cap-emphasis'],
      targetSharedDimensions: {},
      targetDistinctDimensions: {},
      crossSleeveConflict: {
        status: 'none',
        overlappingSecurityIds: [],
        overlappingSleeveIds: []
      }
    },
    ...overrides
  };
}


const vooWithVti = resolveSecurityTradeoffs({
  incrementalContributionEvidence: incrementalFixture(),
  overlapInterpretation: interpretationFixture()
});

assert.deepEqual(Object.keys(vooWithVti), [
  'benefits',
  'costs',
  'whatChanges',
  'whatStaysSimilar',
  'concentrationChanges',
  'complexityChanges'
]);
assert.deepEqual(
  vooWithVti.benefits.map(({ code }) => code),
  ['increases-market-cap-emphasis']
);
assert.equal(
  vooWithVti.benefits[0].explanation,
  'Increases emphasis on large U.S. companies within the sleeve.'
);
assert.deepEqual(
  vooWithVti.costs.map(({ code }) => code),
  [
    'adds-overlapping-holding',
    'reduces-relative-market-cap-emphasis'
  ]
);
assert.equal(
  vooWithVti.costs[0].explanation,
  'Adds another highly overlapping holding to this sleeve.'
);
assert.equal(
  vooWithVti.costs[1].explanation,
  'Reduces the relative contribution of mid-sized and small companies within the sleeve.'
);
assert.equal(
  vooWithVti.whatStaysSimilar[0].explanation,
  'Core U.S. equity exposure remains heavily shared.'
);
assert.deepEqual(
  vooWithVti.concentrationChanges.map(({ code }) => code),
  [
    'increases-market-cap-emphasis',
    'reduces-relative-market-cap-emphasis'
  ]
);
assert.deepEqual(vooWithVti.complexityChanges, []);


const vtiWithItotEvidence = incrementalFixture({
  candidateSecurityId: 'vti',
  comparedHoldingIds: ['itot'],
  holdingContext: {
    targetSleeveHoldingIds: ['itot'],
    crossSleeveHoldings: []
  },
  distinctDimensions: {},
  sharedRole: {
    present: true,
    categoryIds: ['broad-us-equity'],
    holdingSecurityIds: ['itot']
  },
  incrementalCapExposure: {
    added: [],
    increasedEmphasis: [],
    reducedRelativeEmphasis: []
  }
});
const vtiWithItot = resolveSecurityTradeoffs({
  incrementalContributionEvidence: vtiWithItotEvidence,
  overlapInterpretation: interpretationFixture({
    interpretation: 'near-interchangeable',
    overlapMeaning: 'substantial-existing-coverage',
    incrementalContribution: 'none',
    concentrationEffect: null
  })
});

assert.deepEqual(vtiWithItot.benefits, []);
assert.deepEqual(
  vtiWithItot.costs.map(({ code }) => code),
  ['adds-overlapping-holding']
);
assert.equal(vtiWithItot.whatStaysSimilar.length, 2);


const distinctEvidence = incrementalFixture({
  candidateSecurityId: 'qual',
  comparedHoldingIds: [],
  holdingContext: {
    targetSleeveHoldingIds: [],
    crossSleeveHoldings: []
  },
  sharedDimensions: {},
  distinctDimensions: {
    factors: {
      candidateOnly: ['quality'],
      holdingOnly: []
    }
  },
  sharedRole: {
    present: false,
    categoryIds: [],
    holdingSecurityIds: []
  },
  distinctRole: {
    present: true,
    categoryIds: ['quality-factor-equity']
  },
  incrementalBreadth: {
    status: 'introduced',
    candidateClassification: 'targeted',
    existingClassifications: []
  },
  incrementalCapExposure: {
    added: [],
    increasedEmphasis: [],
    reducedRelativeEmphasis: []
  },
  incrementalFactorExposure: ['quality'],
  complexityChange: {
    direction: 'introduced',
    candidateLevel: 'moderate',
    existingLevels: []
  }
});
const distinctTradeoffs = resolveSecurityTradeoffs({
  incrementalContributionEvidence: distinctEvidence,
  overlapInterpretation: interpretationFixture({
    interpretation: 'distinct',
    overlapLevel: 'none',
    overlapMeaning: 'limited-existing-coverage',
    incrementalContribution: 'substantial',
    concentrationEffect: null,
    implementationEffect: 'introduces-first-target-sleeve-holding'
  })
});

assert.deepEqual(
  distinctTradeoffs.benefits.map(({ code }) => code),
  ['adds-distinct-permitted-role', 'adds-factor-exposure']
);
assert.deepEqual(distinctTradeoffs.costs, []);
assert.deepEqual(
  distinctTradeoffs.complexityChanges.map(({ code }) => code),
  ['introduced-complexity']
);


const higherComplexity = resolveSecurityTradeoffs({
  incrementalContributionEvidence: incrementalFixture({
    complexityChange: {
      direction: 'higher',
      candidateLevel: 'high',
      existingLevels: ['low']
    }
  }),
  overlapInterpretation: interpretationFixture({
    implementationEffect: 'adds-higher-complexity-holding'
  })
});

assert.equal(
  higherComplexity.costs.some(
    ({ code }) => code === 'higher-complexity'
  ),
  true
);
assert.deepEqual(
  higherComplexity.complexityChanges.map(({ code }) => code),
  ['higher-complexity']
);


const crossSleeveConflict = resolveSecurityTradeoffs({
  incrementalContributionEvidence: incrementalFixture({
    holdingContext: {
      targetSleeveHoldingIds: [],
      crossSleeveHoldings: [{
        sleeveId: 'inflationProtection',
        securityId: 'gld'
      }]
    }
  }),
  overlapInterpretation: interpretationFixture({
    interpretation: 'cross-sleeve-conflicting',
    overlapLevel: 'medium',
    overlapMeaning: 'role-already-assigned-to-another-sleeve',
    implementationEffect: 'duplicates-role-across-sleeves',
    structuralEvidence: {
      targetSleeveOverlapLevel: 'none',
      crossSleeveOverlapLevel: 'medium',
      contributionSignals: ['distinct-role'],
      targetSharedDimensions: {},
      targetDistinctDimensions: {},
      crossSleeveConflict: {
        status: 'conflict',
        overlappingSecurityIds: ['gld'],
        overlappingSleeveIds: ['inflationProtection']
      }
    }
  })
});

assert.equal(
  crossSleeveConflict.costs.some(
    ({ code }) => code === 'duplicates-role-across-sleeves'
  ),
  true
);


assert.equal(Object.isFrozen(vooWithVti), true);
assert.equal(Object.isFrozen(vooWithVti.benefits), true);
assert.equal(Object.isFrozen(vooWithVti.benefits[0]), true);
assert.equal('outcome' in vooWithVti, false);
assert.equal('preferredAction' in vooWithVti, false);
assert.equal('availableActions' in vooWithVti, false);

for (const group of Object.values(vooWithVti)) {
  for (const tradeoff of group) {
    assert.doesNotMatch(
      tradeoff.explanation,
      /\b(?:buy|sell|recommend|should)\b/i
    );
  }
}

const source = readFileSync(
  new URL(
    '../src/domain/portfolio-decision-support/security-tradeoff-resolver.js',
    import.meta.url
  ),
  'utf8'
);
assert.doesNotMatch(
  source,
  /security-metadata|security-reference|preferredAction|availableActions/
);

console.log(
  'Security tradeoff resolver test passed: structural benefits, costs, changes and similarities remain evidence-based and action-free.'
);
