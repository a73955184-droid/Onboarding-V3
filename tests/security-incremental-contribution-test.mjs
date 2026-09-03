import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  resolveSecurityIncrementalContribution
} from '../src/domain/portfolio-decision-support/security-incremental-contribution.js';

import {
  getSecurityStructuralFacts
} from '../src/domain/portfolio-system/security-sleeve-alignment.js';

import {
  resolveSecurityStructuralOverlap
} from '../src/domain/portfolio-system/security-structural-overlap.js';


const EQUITY_DIMENSIONS = [
  'assetClasses',
  'geographies',
  'marketCaps',
  'styles',
  'factors',
  'sectors',
  'strategyType'
];

const FIXED_INCOME_DIMENSIONS = [
  'assetClasses',
  'geographies',
  'durationBand',
  'creditQualities',
  'incomeRole',
  'inflationSensitivity',
  'strategyType'
];


function targetSleeve({
  sleeveId,
  profileId,
  permittedCategoryIds,
  overlapDimensions
}) {
  return {
    sleeveId,
    profileId,
    permittedCategoryIds,
    overlapDimensions
  };
}


function facts(securityId, exposureOverrides = {}) {
  const resolved = getSecurityStructuralFacts(securityId);
  assert.ok(resolved, `Expected structural facts for ${securityId}`);

  return {
    ...resolved,
    exposure: {
      ...resolved.exposure,
      ...exposureOverrides
    }
  };
}


function phase2Overlap(candidate, holding, sleeve) {
  return resolveSecurityStructuralOverlap({
    candidateSecurityId: candidate.securityId,
    holdingSecurityId: holding.securityId,
    sleeveDecisionProfile: sleeve
  });
}


function analyzePair({
  candidate,
  holding,
  sleeve,
  overlap = phase2Overlap(candidate, holding, sleeve),
  holdingScope = 'target'
}) {
  return resolveSecurityIncrementalContribution({
    candidate,
    targetSleeve: sleeve,
    targetSleeveHoldings:
      holdingScope === 'target' ? [holding] : [],
    crossSleeveHoldings:
      holdingScope === 'cross'
        ? [{ sleeveId: 'otherSleeve', security: holding }]
        : [],
    structuralOverlapEvidence: [{
      holdingSecurityId: holding.securityId,
      overlap
    }]
  });
}


const broadUsSleeve = targetSleeve({
  sleeveId: 'usCore',
  profileId: 'strategic-foundation',
  permittedCategoryIds: ['broad-us-equity'],
  overlapDimensions: EQUITY_DIMENSIONS
});

// VTI and ITOT resolve as near-interchangeable structural implementations.
const vtiItot = analyzePair({
  candidate: facts('vti'),
  holding: facts('itot'),
  sleeve: broadUsSleeve
});

assert.equal(vtiItot.sharedRole.present, true);
assert.equal(vtiItot.distinctRole.present, false);
assert.deepEqual(vtiItot.distinctDimensions, {});
assert.deepEqual(vtiItot.incrementalCapExposure, {
  added: [],
  increasedEmphasis: [],
  reducedRelativeEmphasis: []
});
assert.equal(vtiItot.complexityChange.direction, 'unchanged');

const emptySleeveContribution =
  resolveSecurityIncrementalContribution({
    candidate: facts('vti'),
    targetSleeve: broadUsSleeve,
    targetSleeveHoldings: [],
    crossSleeveHoldings: [],
    structuralOverlapEvidence: []
  });

assert.equal(emptySleeveContribution.sharedRole.present, false);
assert.equal(emptySleeveContribution.distinctRole.present, true);
assert.deepEqual(
  emptySleeveContribution.incrementalGeography,
  ['united-states']
);
assert.equal(
  emptySleeveContribution.incrementalBreadth.status,
  'introduced'
);
assert.equal(
  emptySleeveContribution.complexityChange.direction,
  'introduced'
);


// This fixture represents resolved cap-scope evidence at the analyzer input
// boundary. The current Phase 1 VOO record remains untouched by this task.
const vooFacts = facts('voo', { marketCaps: ['large-cap'] });
const vtiFacts = facts('vti');
const vooVtiOverlap = {
  comparisonAvailable: true,
  candidateSecurityId: 'voo',
  holdingSecurityId: 'vti',
  sameSecurity: false,
  overlapLevel: 'high',
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
  sameCategoryRole: true,
  matchedCategoryIds: ['broad-us-equity']
};
const vooVti = analyzePair({
  candidate: vooFacts,
  holding: vtiFacts,
  sleeve: broadUsSleeve,
  overlap: vooVtiOverlap
});

assert.equal(vooVti.sharedRole.present, true);
assert.equal(vooVti.distinctRole.present, false);
assert.deepEqual(
  vooVti.incrementalCapExposure.increasedEmphasis,
  ['large-cap']
);
assert.deepEqual(
  vooVti.incrementalCapExposure.reducedRelativeEmphasis,
  ['mid-cap', 'small-cap']
);
assert.notDeepEqual(vooVti, vtiItot);


const qualitySleeve = targetSleeve({
  sleeveId: 'qualityImprovement',
  profileId: 'factor-improvement',
  permittedCategoryIds: ['quality-factor-equity'],
  overlapDimensions: EQUITY_DIMENSIONS
});
const qualityAlternatives = analyzePair({
  candidate: facts('qual'),
  holding: facts('sphq'),
  sleeve: qualitySleeve
});

assert.equal(qualityAlternatives.sharedRole.present, true);
assert.deepEqual(qualityAlternatives.incrementalFactorExposure, []);
assert.deepEqual(
  qualityAlternatives.sharedDimensions.factors,
  ['quality']
);


const smallValueSleeve = targetSleeve({
  sleeveId: 'smallValueImprovement',
  profileId: 'factor-improvement',
  permittedCategoryIds: ['small-value-equity'],
  overlapDimensions: EQUITY_DIMENSIONS
});
const smallValueAlternatives = analyzePair({
  candidate: facts('avuv'),
  holding: facts('vbr'),
  sleeve: smallValueSleeve
});

assert.equal(smallValueAlternatives.sharedRole.present, true);
assert.deepEqual(smallValueAlternatives.incrementalFactorExposure, []);
assert.deepEqual(
  smallValueAlternatives.sharedDimensions.factors,
  ['size', 'value']
);


const bondSleeve = targetSleeve({
  sleeveId: 'stability',
  profileId: 'stability',
  permittedCategoryIds: [
    'high-quality-bonds',
    'government-bonds',
    'investment-grade-credit'
  ],
  overlapDimensions: FIXED_INCOME_DIMENSIONS
});
const governmentVsCredit = analyzePair({
  candidate: facts('govt'),
  holding: facts('lqd'),
  sleeve: bondSleeve
});

assert.equal(governmentVsCredit.sharedRole.present, true);
assert.deepEqual(
  governmentVsCredit.distinctDimensions.creditQualities,
  {
    candidateOnly: ['government'],
    holdingOnly: ['investment-grade']
  }
);
assert.deepEqual(
  governmentVsCredit.distinctDimensions.durationBand,
  {
    candidateOnly: ['broad'],
    holdingOnly: ['intermediate']
  }
);


const realAssetSleeve = targetSleeve({
  sleeveId: 'realAssets',
  profileId: 'real-assets',
  permittedCategoryIds: ['real-assets'],
  overlapDimensions: [
    'assetClasses',
    'geographies',
    'sectors',
    'inflationSensitivity',
    'strategyType'
  ]
});
const differentRealAssets = analyzePair({
  candidate: facts('vnq'),
  holding: facts('gld'),
  sleeve: realAssetSleeve,
  holdingScope: 'cross'
});

assert.deepEqual(
  differentRealAssets.distinctDimensions.assetClasses,
  {
    candidateOnly: ['equity', 'real-asset'],
    holdingOnly: []
  }
);
assert.equal(differentRealAssets.sharedRole.present, false);
assert.equal(differentRealAssets.distinctRole.present, true);
assert.deepEqual(
  differentRealAssets.incrementalSectorExposure,
  ['real-estate']
);
assert.equal(differentRealAssets.incrementalInflationRole, 'indirect');
assert.equal(differentRealAssets.complexityChange.direction, 'introduced');
assert.equal(
  differentRealAssets.incrementalBreadth.status,
  'introduced'
);
assert.deepEqual(differentRealAssets.holdingContext, {
  targetSleeveHoldingIds: [],
  crossSleeveHoldings: [{
    sleeveId: 'otherSleeve',
    securityId: 'gld'
  }]
});
assert.deepEqual(differentRealAssets.comparedHoldingIds, ['gld']);
assert.equal(
  differentRealAssets.crossSleeveEvidence.portfolioAlreadyHasExposure,
  true
);
assert.equal(
  differentRealAssets.crossSleeveEvidence.sharedRole.present,
  true
);
assert.deepEqual(
  differentRealAssets.crossSleeveEvidence.distinctDimensions.assetClasses,
  {
    candidateOnly: ['equity', 'real-asset'],
    holdingOnly: ['commodity']
  }
);
assert.deepEqual(
  differentRealAssets.crossSleeveEvidence.comparisons,
  [{
    sleeveId: 'otherSleeve',
    securityId: 'gld',
    sharedDimensions: {
      inflationSensitivity: ['indirect']
    },
    distinctDimensions: {
      assetClasses: {
        candidateOnly: ['equity', 'real-asset'],
        holdingOnly: ['commodity']
      },
      geographies: {
        candidateOnly: ['united-states'],
        holdingOnly: ['global']
      },
      sectors: {
        candidateOnly: ['real-estate'],
        holdingOnly: []
      },
      strategyType: {
        candidateOnly: ['sector-equity'],
        holdingOnly: ['real-asset']
      }
    },
    sameCategoryRole: true
  }]
);


const sectorSleeve = targetSleeve({
  sleeveId: 'tacticalAllocation',
  profileId: 'tactical-allocation',
  permittedCategoryIds: ['sector-equity'],
  overlapDimensions: EQUITY_DIMENSIONS
});
const differentSectors = analyzePair({
  candidate: facts('xlk'),
  holding: facts('xle'),
  sleeve: sectorSleeve
});

assert.equal(differentSectors.sharedRole.present, true);
assert.deepEqual(
  differentSectors.incrementalSectorExposure,
  ['technology']
);
assert.deepEqual(
  differentSectors.distinctDimensions.sectors.holdingOnly,
  ['energy']
);


const thematicSleeve = targetSleeve({
  sleeveId: 'thematicOpportunities',
  profileId: 'opportunity-capacity',
  permittedCategoryIds: ['thematic-equity'],
  overlapDimensions: [...EQUITY_DIMENSIONS, 'themes']
});
const innovationFacts = facts('arkk', { themes: ['disruptive-innovation'] });
const roboticsFacts = facts('botz', { themes: ['robotics-automation'] });
const thematicOverlap = {
  comparisonAvailable: true,
  candidateSecurityId: 'arkk',
  holdingSecurityId: 'botz',
  sameSecurity: false,
  overlapLevel: 'high',
  sharedDimensions: {
    assetClasses: ['equity'],
    geographies: ['global'],
    marketCaps: ['large-cap', 'mid-cap', 'small-cap'],
    strategyType: ['thematic-equity']
  },
  distinctDimensions: {
    themes: {
      candidateOnly: ['disruptive-innovation'],
      holdingOnly: ['robotics-automation']
    }
  },
  sameCategoryRole: true,
  matchedCategoryIds: ['thematic-equity']
};
const differentThemes = analyzePair({
  candidate: innovationFacts,
  holding: roboticsFacts,
  sleeve: thematicSleeve,
  overlap: thematicOverlap
});

assert.equal(differentThemes.sharedRole.present, true);
assert.deepEqual(differentThemes.distinctDimensions.themes, {
  candidateOnly: ['disruptive-innovation'],
  holdingOnly: ['robotics-automation']
});


const opportunitySleeve = targetSleeve({
  sleeveId: 'opportunityCapacity',
  profileId: 'opportunity-capacity',
  permittedCategoryIds: ['broad-us-equity', 'thematic-equity'],
  overlapDimensions: EQUITY_DIMENSIONS
});
const higherComplexityTheme = analyzePair({
  candidate: facts('arkk'),
  holding: facts('vti'),
  sleeve: opportunitySleeve
});

assert.equal(higherComplexityTheme.complexityChange.direction, 'higher');


const incomeSleeve = targetSleeve({
  sleeveId: 'income',
  profileId: 'income',
  permittedCategoryIds: ['income-equity', 'broad-us-equity'],
  overlapDimensions: [
    ...EQUITY_DIMENSIONS,
    'incomeRole'
  ]
});
const incrementalIncome = analyzePair({
  candidate: facts('schd'),
  holding: facts('vti'),
  sleeve: incomeSleeve
});

assert.equal(incrementalIncome.incrementalIncomeRole, 'primary');


const inflationSleeve = targetSleeve({
  sleeveId: 'inflationProtection',
  profileId: 'inflation-protection',
  permittedCategoryIds: [
    'inflation-protected-bonds',
    'high-quality-bonds'
  ],
  overlapDimensions: FIXED_INCOME_DIMENSIONS
});
const incrementalInflation = analyzePair({
  candidate: facts('tip'),
  holding: facts('bnd'),
  sleeve: inflationSleeve
});

assert.equal(
  incrementalInflation.incrementalInflationRole,
  'explicit'
);


assert.equal(Object.isFrozen(differentThemes), true);
assert.equal(Object.isFrozen(differentThemes.distinctDimensions), true);
assert.equal(
  Object.isFrozen(differentThemes.distinctDimensions.themes.candidateOnly),
  true
);
assert.equal('outcome' in differentThemes, false);
assert.equal('preferredAction' in differentThemes, false);
assert.equal('recommendation' in differentThemes, false);

assert.throws(
  () => resolveSecurityIncrementalContribution({
    candidate: facts('vti'),
    targetSleeve: broadUsSleeve,
    targetSleeveHoldings: [facts('itot')],
    structuralOverlapEvidence: [{
      holdingSecurityId: 'voo',
      overlap: phase2Overlap(
        facts('vti'),
        facts('itot'),
        broadUsSleeve
      )
    }]
  }),
  /holding outside the supplied portfolio context/
);
assert.throws(
  () => resolveSecurityIncrementalContribution({
    candidate: facts('vti'),
    targetSleeve: broadUsSleeve,
    targetSleeveHoldings: [facts('itot')],
    structuralOverlapEvidence: [{
      holdingSecurityId: 'itot',
      overlap: {
        ...phase2Overlap(
          facts('vti'),
          facts('itot'),
          broadUsSleeve
        ),
        candidateSecurityId: 'voo'
      }
    }]
  }),
  /references a different candidate/
);
assert.throws(
  () => resolveSecurityIncrementalContribution({
    candidate: facts('vti'),
    targetSleeve: broadUsSleeve,
    crossSleeveHoldings: [{
      sleeveId: broadUsSleeve.sleeveId,
      security: facts('itot')
    }]
  }),
  /crossSleeveHoldings must not contain the target sleeve/
);


const source = readFileSync(
  new URL(
    '../src/domain/portfolio-decision-support/security-incremental-contribution.js',
    import.meta.url
  ),
  'utf8'
);

assert.doesNotMatch(
  source,
  /security-metadata|security-reference|security-category-universe|preferredAction|availableActions/
);

console.log(
  'Security incremental-contribution test passed: overlap, role, cap, factor, bond, real-asset, sector and thematic changes remain evidence-only.'
);
