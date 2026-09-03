/**
 * Interprets Phase 2 overlap and Phase 3 incremental-contribution evidence.
 *
 * This module describes structural tradeoffs. It does not choose or expose a
 * preferred action and does not reconstruct security metadata.
 */

export const SECURITY_OVERLAP_INTERPRETATIONS = Object.freeze({
  NEAR_INTERCHANGEABLE: 'near-interchangeable',
  OVERLAPPING_BUT_ADDITIVE: 'overlapping-but-additive',
  DISTINCT: 'distinct',
  CROSS_SLEEVE_CONFLICTING: 'cross-sleeve-conflicting'
});


export const SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS = Object.freeze({
  NONE: 'none',
  LIMITED: 'limited',
  MODERATE: 'moderate',
  SUBSTANTIAL: 'substantial'
});


export const SECURITY_OVERLAP_MEANINGS = Object.freeze({
  SUBSTANTIAL_EXISTING_COVERAGE: 'substantial-existing-coverage',
  EXISTING_COVERAGE_WITH_CHANGE: 'existing-coverage-with-incremental-change',
  LIMITED_EXISTING_COVERAGE: 'limited-existing-coverage',
  ROLE_ASSIGNED_ELSEWHERE: 'role-already-assigned-to-another-sleeve'
});


const OVERLAP_LEVEL_RANK = Object.freeze({
  none: 0,
  low: 1,
  medium: 2,
  high: 3
});


function isPlainObject(value) {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value);
}


function assertPlainObject(value, label) {
  if (!isPlainObject(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}


function assertArray(value, label) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be an array`);
  }
}


function unique(values) {
  return [...new Set(values)];
}


function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }

  return Object.freeze(value);
}


function normalizeOverlaps(overlapEvidence, label) {
  assertArray(overlapEvidence, label);

  return overlapEvidence.map((entry, index) => {
    assertPlainObject(entry, `${label}[${index}]`);
    const overlap = entry.overlap ?? entry;
    assertPlainObject(overlap, `${label}[${index}].overlap`);

    if (overlap.comparisonAvailable !== true) {
      throw new TypeError(`${label} requires available comparisons`);
    }

    if (!Object.hasOwn(OVERLAP_LEVEL_RANK, overlap.overlapLevel)) {
      throw new TypeError(`${label} contains an unknown overlap level`);
    }

    return {
      holdingSecurityId:
        entry.holdingSecurityId ?? overlap.holdingSecurityId,
      holdingSleeveId: entry.holdingSleeveId ?? null,
      overlap
    };
  });
}


function highestOverlapLevel(overlaps) {
  return overlaps.reduce(
    (highest, { overlap }) =>
      OVERLAP_LEVEL_RANK[overlap.overlapLevel] >
      OVERLAP_LEVEL_RANK[highest]
        ? overlap.overlapLevel
        : highest,
    'none'
  );
}


function validateOverlapScopes({
  incrementalContributionEvidence,
  targetOverlaps,
  crossOverlaps
}) {
  const targetHoldingIds = incrementalContributionEvidence
    .holdingContext.targetSleeveHoldingIds;
  const targetSleeveId =
    incrementalContributionEvidence.targetSleeveId;
  const crossHoldings = incrementalContributionEvidence
    .holdingContext.crossSleeveHoldings;

  for (const { holdingSecurityId, holdingSleeveId } of targetOverlaps) {
    if (
      !targetHoldingIds.includes(holdingSecurityId) ||
      (
        holdingSleeveId !== null &&
        holdingSleeveId !== targetSleeveId
      )
    ) {
      throw new TypeError(
        'targetSleeveOverlapEvidence must reference target-sleeve holdings'
      );
    }
  }

  for (const { holdingSecurityId, holdingSleeveId } of crossOverlaps) {
    const matches = crossHoldings.filter(({ sleeveId, securityId }) =>
      securityId === holdingSecurityId &&
      (holdingSleeveId === null || sleeveId === holdingSleeveId)
    );

    if (matches.length !== 1) {
      throw new TypeError(
        'crossSleeveOverlapEvidence must reference exact cross-sleeve holdings'
      );
    }
  }
}


function candidateOnlyValues(distinctDimensions) {
  return unique(Object.values(distinctDimensions).flatMap(
    (dimension) =>
      isPlainObject(dimension) && Array.isArray(dimension.candidateOnly)
        ? dimension.candidateOnly
        : []
  ));
}


function contributionSignals(evidence) {
  const signals = [];

  if (evidence.distinctRole.present) {
    signals.push('distinct-role');
  }

  if (candidateOnlyValues(evidence.distinctDimensions).length > 0) {
    signals.push('distinct-exposure');
  }

  if (evidence.incrementalCapExposure.increasedEmphasis.length > 0) {
    signals.push('increased-cap-emphasis');
  }

  if (evidence.incrementalBreadth.status === 'different') {
    signals.push('different-breadth-classification');
  }

  if (evidence.incrementalIncomeRole !== null) {
    signals.push('incremental-income-role');
  }

  if (evidence.incrementalInflationRole !== null) {
    signals.push('incremental-inflation-role');
  }

  return unique(signals);
}


function contributionStrength(evidence, signals) {
  const hasNoTargetHoldings =
    evidence.holdingContext.targetSleeveHoldingIds.length === 0;

  if (hasNoTargetHoldings && evidence.distinctRole.present) {
    return SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.SUBSTANTIAL;
  }

  if (signals.length >= 2 || signals.includes('distinct-role')) {
    return SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.SUBSTANTIAL;
  }

  if (signals.length === 1) {
    return SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.MODERATE;
  }

  if (
    evidence.complexityChange.direction !== 'unchanged' ||
    evidence.incrementalBreadth.status === 'different'
  ) {
    return SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.LIMITED;
  }

  return SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.NONE;
}


function normalizeCrossSleeveConflict(
  crossSleeveConflictEvidence,
  incrementalContributionEvidence
) {
  if (crossSleeveConflictEvidence === null) {
    return {
      status: 'none',
      overlappingSecurityIds: [],
      overlappingSleeveIds: []
    };
  }

  assertPlainObject(
    crossSleeveConflictEvidence,
    'crossSleeveConflictEvidence'
  );

  if (!['none', 'conflict'].includes(
    crossSleeveConflictEvidence.status
  )) {
    throw new TypeError(
      'crossSleeveConflictEvidence.status must be none or conflict'
    );
  }

  const overlappingSecurityIds =
    crossSleeveConflictEvidence.overlappingSecurityIds ?? [];
  const overlappingSleeveIds =
    crossSleeveConflictEvidence.overlappingSleeveIds ?? [];
  assertArray(
    overlappingSecurityIds,
    'crossSleeveConflictEvidence.overlappingSecurityIds'
  );
  assertArray(
    overlappingSleeveIds,
    'crossSleeveConflictEvidence.overlappingSleeveIds'
  );

  if (crossSleeveConflictEvidence.status === 'conflict') {
    const context = incrementalContributionEvidence
      .holdingContext.crossSleeveHoldings;
    const contextSecurityIds = context.map(({ securityId }) => securityId);
    const contextSleeveIds = context.map(({ sleeveId }) => sleeveId);

    const everySecurityHasMatchingSleeve =
      overlappingSecurityIds.every((securityId) =>
        context.some(({ sleeveId, securityId: heldSecurityId }) =>
          heldSecurityId === securityId &&
          overlappingSleeveIds.includes(sleeveId)
        )
      );
    const everySleeveHasMatchingSecurity =
      overlappingSleeveIds.every((sleeveId) =>
        context.some(({ sleeveId: heldSleeveId, securityId }) =>
          heldSleeveId === sleeveId &&
          overlappingSecurityIds.includes(securityId)
        )
      );

    if (
      overlappingSecurityIds.length === 0 ||
      overlappingSleeveIds.length === 0 ||
      !overlappingSecurityIds.every(
        (securityId) => contextSecurityIds.includes(securityId)
      ) ||
      !overlappingSleeveIds.every(
        (sleeveId) => contextSleeveIds.includes(sleeveId)
      ) ||
      !everySecurityHasMatchingSleeve ||
      !everySleeveHasMatchingSecurity
    ) {
      throw new TypeError(
        'Cross-sleeve conflict evidence must match supplied holding context'
      );
    }
  }

  return {
    status: crossSleeveConflictEvidence.status,
    overlappingSecurityIds: unique(overlappingSecurityIds),
    overlappingSleeveIds: unique(overlappingSleeveIds)
  };
}


function concentrationEffect(evidence) {
  const dimensions = evidence.incrementalCapExposure.increasedEmphasis;

  return dimensions.length === 0
    ? null
    : {
        dimensions: [...dimensions],
        direction: 'increase'
      };
}


function implementationEffect({
  interpretation,
  incrementalContributionEvidence
}) {
  if (
    interpretation ===
    SECURITY_OVERLAP_INTERPRETATIONS.CROSS_SLEEVE_CONFLICTING
  ) {
    return 'duplicates-role-across-sleeves';
  }

  if (
    incrementalContributionEvidence.holdingContext
      .targetSleeveHoldingIds.length === 0
  ) {
    return 'introduces-first-target-sleeve-holding';
  }

  if (
    incrementalContributionEvidence.complexityChange.direction === 'higher'
  ) {
    return 'adds-higher-complexity-holding';
  }

  if (
    interpretation ===
      SECURITY_OVERLAP_INTERPRETATIONS.NEAR_INTERCHANGEABLE ||
    interpretation ===
      SECURITY_OVERLAP_INTERPRETATIONS.OVERLAPPING_BUT_ADDITIVE
  ) {
    return 'adds-another-overlapping-holding';
  }

  return 'adds-distinct-implementation';
}


function interpretationFor({
  targetOverlapLevel,
  incrementalContribution,
  evidence,
  crossSleeveConflict
}) {
  if (crossSleeveConflict.status === 'conflict') {
    return SECURITY_OVERLAP_INTERPRETATIONS.CROSS_SLEEVE_CONFLICTING;
  }

  const targetHasCoverage =
    targetOverlapLevel !== 'none' ||
    evidence.sharedRole.present ||
    Object.keys(evidence.sharedDimensions).length > 0;

  if (
    targetOverlapLevel === 'high' &&
    incrementalContribution ===
      SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.NONE
  ) {
    return SECURITY_OVERLAP_INTERPRETATIONS.NEAR_INTERCHANGEABLE;
  }

  if (targetHasCoverage) {
    return SECURITY_OVERLAP_INTERPRETATIONS.OVERLAPPING_BUT_ADDITIVE;
  }

  return SECURITY_OVERLAP_INTERPRETATIONS.DISTINCT;
}


function overlapMeaning(interpretation) {
  return {
    [SECURITY_OVERLAP_INTERPRETATIONS.NEAR_INTERCHANGEABLE]:
      SECURITY_OVERLAP_MEANINGS.SUBSTANTIAL_EXISTING_COVERAGE,
    [SECURITY_OVERLAP_INTERPRETATIONS.OVERLAPPING_BUT_ADDITIVE]:
      SECURITY_OVERLAP_MEANINGS.EXISTING_COVERAGE_WITH_CHANGE,
    [SECURITY_OVERLAP_INTERPRETATIONS.DISTINCT]:
      SECURITY_OVERLAP_MEANINGS.LIMITED_EXISTING_COVERAGE,
    [SECURITY_OVERLAP_INTERPRETATIONS.CROSS_SLEEVE_CONFLICTING]:
      SECURITY_OVERLAP_MEANINGS.ROLE_ASSIGNED_ELSEWHERE
  }[interpretation];
}


/**
 * Converts overlap into an auditable structural interpretation. A
 * cross-sleeve conflict requires explicit upstream conflict evidence; mere
 * exposure in another sleeve is not treated as a conflict.
 */
export function resolveSecurityOverlapInterpretation({
  incrementalContributionEvidence,
  targetSleeveOverlapEvidence = [],
  crossSleeveOverlapEvidence = [],
  crossSleeveConflictEvidence = null
} = {}) {
  assertPlainObject(
    incrementalContributionEvidence,
    'incrementalContributionEvidence'
  );
  assertPlainObject(
    incrementalContributionEvidence.holdingContext,
    'incrementalContributionEvidence.holdingContext'
  );
  assertPlainObject(
    incrementalContributionEvidence.sharedDimensions,
    'incrementalContributionEvidence.sharedDimensions'
  );
  assertPlainObject(
    incrementalContributionEvidence.distinctDimensions,
    'incrementalContributionEvidence.distinctDimensions'
  );
  assertPlainObject(
    incrementalContributionEvidence.sharedRole,
    'incrementalContributionEvidence.sharedRole'
  );
  assertPlainObject(
    incrementalContributionEvidence.distinctRole,
    'incrementalContributionEvidence.distinctRole'
  );
  assertPlainObject(
    incrementalContributionEvidence.incrementalCapExposure,
    'incrementalContributionEvidence.incrementalCapExposure'
  );
  assertPlainObject(
    incrementalContributionEvidence.incrementalBreadth,
    'incrementalContributionEvidence.incrementalBreadth'
  );
  assertPlainObject(
    incrementalContributionEvidence.complexityChange,
    'incrementalContributionEvidence.complexityChange'
  );
  assertArray(
    incrementalContributionEvidence.holdingContext
      .targetSleeveHoldingIds,
    'incrementalContributionEvidence.holdingContext.targetSleeveHoldingIds'
  );
  assertArray(
    incrementalContributionEvidence.holdingContext.crossSleeveHoldings,
    'incrementalContributionEvidence.holdingContext.crossSleeveHoldings'
  );
  assertArray(
    incrementalContributionEvidence.incrementalCapExposure
      .increasedEmphasis,
    'incrementalContributionEvidence.incrementalCapExposure.increasedEmphasis'
  );

  const targetOverlaps = normalizeOverlaps(
    targetSleeveOverlapEvidence,
    'targetSleeveOverlapEvidence'
  );
  const crossOverlaps = normalizeOverlaps(
    crossSleeveOverlapEvidence,
    'crossSleeveOverlapEvidence'
  );
  validateOverlapScopes({
    incrementalContributionEvidence,
    targetOverlaps,
    crossOverlaps
  });
  const crossSleeveConflict = normalizeCrossSleeveConflict(
    crossSleeveConflictEvidence,
    incrementalContributionEvidence
  );
  const targetOverlapLevel = highestOverlapLevel(targetOverlaps);
  const crossSleeveOverlapLevel = highestOverlapLevel(crossOverlaps);
  const signals = contributionSignals(
    incrementalContributionEvidence
  );
  const incrementalContribution = contributionStrength(
    incrementalContributionEvidence,
    signals
  );
  const interpretation = interpretationFor({
    targetOverlapLevel,
    incrementalContribution,
    evidence: incrementalContributionEvidence,
    crossSleeveConflict
  });
  const relevantOverlapLevel =
    interpretation ===
      SECURITY_OVERLAP_INTERPRETATIONS.CROSS_SLEEVE_CONFLICTING
      ? crossSleeveOverlapLevel
      : targetOverlapLevel;

  return deepFreeze({
    interpretation,
    overlapLevel: relevantOverlapLevel,
    overlapMeaning: overlapMeaning(interpretation),
    incrementalContribution,
    concentrationEffect: concentrationEffect(
      incrementalContributionEvidence
    ),
    implementationEffect: implementationEffect({
      interpretation,
      incrementalContributionEvidence
    }),
    structuralEvidence: {
      targetSleeveOverlapLevel: targetOverlapLevel,
      crossSleeveOverlapLevel,
      contributionSignals: signals,
      targetSharedDimensions:
        incrementalContributionEvidence.sharedDimensions,
      targetDistinctDimensions:
        incrementalContributionEvidence.distinctDimensions,
      crossSleeveConflict
    }
  });
}
