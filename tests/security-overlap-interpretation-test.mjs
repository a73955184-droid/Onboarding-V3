import assert from 'node:assert/strict';

import {
  SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS,
  SECURITY_OVERLAP_INTERPRETATIONS,
  SECURITY_OVERLAP_MEANINGS,
  resolveSecurityOverlapInterpretation
} from '../src/domain/portfolio-decision-support/security-overlap-interpretation.js';

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


function facts(securityId, exposureOverrides = {}) {
  const resolved = getSecurityStructuralFacts(securityId);
  assert.ok(resolved);

  return {
    ...resolved,
    exposure: {
      ...resolved.exposure,
      ...exposureOverrides
    }
  };
}


function overlap(candidate, holding, sleeve) {
  return resolveSecurityStructuralOverlap({
    candidateSecurityId: candidate.securityId,
    holdingSecurityId: holding.securityId,
    sleeveDecisionProfile: sleeve
  });
}


function contribution({
  candidate,
  holding = null,
  sleeve,
  resolvedOverlap = null,
  scope = 'target',
  holdingSleeveId = 'otherSleeve'
}) {
  const evidence = holding
    ? [{
        holdingSecurityId: holding.securityId,
        holdingSleeveId:
          scope === 'cross' ? holdingSleeveId : sleeve.sleeveId,
        overlap: resolvedOverlap ?? overlap(candidate, holding, sleeve)
      }]
    : [];

  return {
    evidence: resolveSecurityIncrementalContribution({
      candidate,
      targetSleeve: sleeve,
      targetSleeveHoldings:
        holding && scope === 'target' ? [holding] : [],
      crossSleeveHoldings:
        holding && scope === 'cross'
          ? [{ sleeveId: holdingSleeveId, security: holding }]
          : [],
      structuralOverlapEvidence: evidence
    }),
    overlapEvidence: evidence
  };
}


assert.deepEqual(
  Object.values(SECURITY_OVERLAP_INTERPRETATIONS),
  [
    'near-interchangeable',
    'overlapping-but-additive',
    'distinct',
    'cross-sleeve-conflicting'
  ]
);
assert.deepEqual(
  Object.values(SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS),
  ['none', 'limited', 'moderate', 'substantial']
);
assert.deepEqual(
  Object.values(SECURITY_OVERLAP_MEANINGS),
  [
    'substantial-existing-coverage',
    'existing-coverage-with-incremental-change',
    'limited-existing-coverage',
    'role-already-assigned-to-another-sleeve'
  ]
);


const broadUsSleeve = {
  sleeveId: 'usCore',
  profileId: 'strategic-foundation',
  permittedCategoryIds: ['broad-us-equity'],
  overlapDimensions: EQUITY_DIMENSIONS
};

const vti = facts('vti');
const itot = facts('itot');
const vtiItot = contribution({
  candidate: vti,
  holding: itot,
  sleeve: broadUsSleeve
});
const nearInterchangeable = resolveSecurityOverlapInterpretation({
  incrementalContributionEvidence: vtiItot.evidence,
  targetSleeveOverlapEvidence: vtiItot.overlapEvidence
});

assert.equal(
  nearInterchangeable.interpretation,
  'near-interchangeable'
);
assert.equal(nearInterchangeable.overlapLevel, 'high');
assert.equal(
  nearInterchangeable.overlapMeaning,
  'substantial-existing-coverage'
);
assert.equal(nearInterchangeable.incrementalContribution, 'none');
assert.equal(nearInterchangeable.concentrationEffect, null);
assert.equal(
  nearInterchangeable.implementationEffect,
  'adds-another-overlapping-holding'
);


// The Phase 1 VOO profile does not yet carry this cap-scope distinction.
// This is resolved evidence injected at the Phase 3 analyzer boundary.
const voo = facts('voo', { marketCaps: ['large-cap'] });
const vooVtiOverlap = {
  comparisonAvailable: true,
  candidateSecurityId: 'voo',
  holdingSecurityId: 'vti',
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
const vooVti = contribution({
  candidate: voo,
  holding: vti,
  sleeve: broadUsSleeve,
  resolvedOverlap: vooVtiOverlap
});
const overlappingButAdditive = resolveSecurityOverlapInterpretation({
  incrementalContributionEvidence: vooVti.evidence,
  targetSleeveOverlapEvidence: vooVti.overlapEvidence
});

assert.equal(
  overlappingButAdditive.interpretation,
  'overlapping-but-additive'
);
assert.equal(overlappingButAdditive.overlapLevel, 'high');
assert.equal(
  overlappingButAdditive.overlapMeaning,
  'existing-coverage-with-incremental-change'
);
assert.equal(
  overlappingButAdditive.incrementalContribution,
  'moderate'
);
assert.deepEqual(overlappingButAdditive.concentrationEffect, {
  dimensions: ['large-cap'],
  direction: 'increase'
});
assert.deepEqual(
  overlappingButAdditive.structuralEvidence.contributionSignals,
  ['increased-cap-emphasis']
);


const emptyTarget = contribution({
  candidate: vti,
  sleeve: broadUsSleeve
});
const distinct = resolveSecurityOverlapInterpretation({
  incrementalContributionEvidence: emptyTarget.evidence
});

assert.equal(distinct.interpretation, 'distinct');
assert.equal(distinct.overlapLevel, 'none');
assert.equal(distinct.overlapMeaning, 'limited-existing-coverage');
assert.equal(distinct.incrementalContribution, 'substantial');
assert.equal(
  distinct.implementationEffect,
  'introduces-first-target-sleeve-holding'
);


const realAssetSleeve = {
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
};
const vnq = facts('vnq');
const gld = facts('gld');
const vnqGld = contribution({
  candidate: vnq,
  holding: gld,
  sleeve: realAssetSleeve,
  scope: 'cross',
  holdingSleeveId: 'inflationProtection'
});

const crossSleeveContextOnly = resolveSecurityOverlapInterpretation({
  incrementalContributionEvidence: vnqGld.evidence,
  crossSleeveOverlapEvidence: vnqGld.overlapEvidence,
  crossSleeveConflictEvidence: {
    status: 'none',
    overlappingSecurityIds: [],
    overlappingSleeveIds: []
  }
});

assert.equal(crossSleeveContextOnly.interpretation, 'distinct');
assert.equal(
  vnqGld.evidence.crossSleeveEvidence.portfolioAlreadyHasExposure,
  true
);

const crossSleeveConflicting = resolveSecurityOverlapInterpretation({
  incrementalContributionEvidence: vnqGld.evidence,
  crossSleeveOverlapEvidence: vnqGld.overlapEvidence,
  crossSleeveConflictEvidence: {
    status: 'conflict',
    overlappingSecurityIds: ['gld'],
    overlappingSleeveIds: ['inflationProtection']
  }
});

assert.equal(
  crossSleeveConflicting.interpretation,
  'cross-sleeve-conflicting'
);
assert.equal(crossSleeveConflicting.overlapLevel, 'medium');
assert.equal(
  crossSleeveConflicting.overlapMeaning,
  'role-already-assigned-to-another-sleeve'
);
assert.equal(
  crossSleeveConflicting.implementationEffect,
  'duplicates-role-across-sleeves'
);
assert.deepEqual(
  crossSleeveConflicting.structuralEvidence.crossSleeveConflict,
  {
    status: 'conflict',
    overlappingSecurityIds: ['gld'],
    overlappingSleeveIds: ['inflationProtection']
  }
);


assert.equal(Object.isFrozen(overlappingButAdditive), true);
assert.equal(
  Object.isFrozen(overlappingButAdditive.structuralEvidence),
  true
);
assert.equal('outcome' in overlappingButAdditive, false);
assert.equal('preferredAction' in overlappingButAdditive, false);

assert.throws(
  () => resolveSecurityOverlapInterpretation({
    incrementalContributionEvidence: vnqGld.evidence,
    crossSleeveConflictEvidence: {
      status: 'conflict',
      overlappingSecurityIds: ['not-held'],
      overlappingSleeveIds: ['inflationProtection']
    }
  }),
  /must match supplied holding context/
);
assert.throws(
  () => resolveSecurityOverlapInterpretation({
    incrementalContributionEvidence: vnqGld.evidence,
    targetSleeveOverlapEvidence: vnqGld.overlapEvidence
  }),
  /must reference target-sleeve holdings/
);

console.log(
  'Security overlap interpretation test passed: overlap is interpreted as near-interchangeable, additive, distinct or explicitly cross-sleeve-conflicting without choosing an action.'
);
