import {
  resolveSecuritySleeveBoundaryAlignment
} from './security-sleeve-alignment.js';

import {
  resolveSecurityStructuralOverlap
} from './security-structural-overlap.js';


const COMPLEXITY_RANK = Object.freeze({
  low: 0,
  moderate: 1,
  high: 2
});

const ALIGNMENT_ADVANTAGES = Object.freeze({
  assetClasses: 'better-asset-class-alignment',
  geographies: 'better-geography-alignment',
  strategyType: 'better-strategy-type-alignment',
  breadth: 'better-breadth-alignment',
  thesisMonitoring: 'better-thesis-monitoring-alignment',
  incomeRole: 'better-income-role-alignment',
  inflationSensitivity: 'better-inflation-role-alignment',
  durationBand: 'better-duration-alignment',
  creditQualities: 'better-credit-quality-alignment'
});

const ALIGNMENT_DISADVANTAGES = Object.freeze({
  assetClasses: 'worse-asset-class-alignment',
  geographies: 'worse-geography-alignment',
  strategyType: 'worse-strategy-type-alignment',
  breadth: 'worse-breadth-alignment',
  thesisMonitoring: 'worse-thesis-monitoring-alignment',
  incomeRole: 'worse-income-role-alignment',
  inflationSensitivity: 'worse-inflation-role-alignment',
  durationBand: 'worse-duration-alignment',
  creditQualities: 'worse-credit-quality-alignment'
});


function uniqueFrozen(values) {
  return Object.freeze([...new Set(values)]);
}


/**
 * A replacement is justified only by explicit structural evidence for
 * two different securities serving the same permitted category role.
 * No performance, array-cardinality, or prose-derived inference is used.
 */
export function resolveSecurityReplacementComparison({
  candidateSecurityId,
  holdingSecurityId,
  portfolioSystemId,
  variantId,
  sleeveId
} = {}) {
  const context = {
    portfolioSystemId,
    variantId,
    sleeveId
  };
  const candidateBoundary =
    resolveSecuritySleeveBoundaryAlignment({
      ...context,
      candidateSecurityId
    });
  const holdingBoundary =
    resolveSecuritySleeveBoundaryAlignment({
      ...context,
      candidateSecurityId: holdingSecurityId
    });
  const overlap = resolveSecurityStructuralOverlap({
    ...context,
    candidateSecurityId,
    holdingSecurityId
  });
  const advantages = [];
  const disadvantages = [];

  if (!overlap.comparisonAvailable) {
    disadvantages.push(
      overlap.reasonCode ?? 'comparison-unavailable'
    );
  } else if (overlap.sameSecurity) {
    disadvantages.push('same-security');
  } else if (!overlap.sameCategoryRole) {
    disadvantages.push('different-category-role');
  }

  const candidateComplexity =
    candidateBoundary.checks.complexity?.actual;
  const holdingComplexity =
    holdingBoundary.checks.complexity?.actual;
  const candidateRank = COMPLEXITY_RANK[candidateComplexity];
  const holdingRank = COMPLEXITY_RANK[holdingComplexity];

  if (
    Number.isInteger(candidateRank) &&
    Number.isInteger(holdingRank)
  ) {
    if (candidateRank < holdingRank) {
      advantages.push('lower-complexity');
    } else if (candidateRank > holdingRank) {
      disadvantages.push('higher-complexity');
    }
  }

  for (const [dimension, advantage] of Object.entries(
    ALIGNMENT_ADVANTAGES
  )) {
    const candidateCheck = candidateBoundary.checks[dimension];
    const holdingCheck = holdingBoundary.checks[dimension];

    if (!candidateCheck || !holdingCheck) {
      continue;
    }

    if (candidateCheck.aligned && !holdingCheck.aligned) {
      advantages.push(advantage);
    } else if (!candidateCheck.aligned && holdingCheck.aligned) {
      disadvantages.push(
        ALIGNMENT_DISADVANTAGES[dimension]
      );
    }
  }

  if (!candidateBoundary.aligned) {
    disadvantages.push('candidate-boundary-conflict');
  }

  const frozenAdvantages = uniqueFrozen(advantages);
  const frozenDisadvantages = uniqueFrozen(disadvantages);
  const replacementJustified =
    overlap.comparisonAvailable &&
    !overlap.sameSecurity &&
    overlap.sameCategoryRole &&
    candidateBoundary.aligned &&
    frozenAdvantages.length > 0 &&
    frozenDisadvantages.length === 0;

  return Object.freeze({
    comparisonAvailable:
      overlap.comparisonAvailable &&
      Object.keys(candidateBoundary.checks).length > 0 &&
      Object.keys(holdingBoundary.checks).length > 0,
    candidateSecurityId:
      candidateBoundary.candidateSecurityId,
    holdingSecurityId:
      holdingBoundary.candidateSecurityId,
    sleeveProfileId:
      candidateBoundary.sleeveProfileId,
    replacementJustified,
    advantages: frozenAdvantages,
    disadvantages: frozenDisadvantages,
    overlap,
    candidateBoundary,
    holdingBoundary
  });
}

