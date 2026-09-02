import {
  getSecurityStructuralFacts
} from './security-sleeve-alignment.js';

import {
  resolveSleeveDecisionProfile
} from './sleeve-decision-profile-resolver.js';


const ROLE_BEARING_DIMENSIONS = new Set([
  'styles',
  'factors',
  'sectors',
  'durationBand',
  'creditQualities',
  'incomeRole',
  'inflationSensitivity',
  'strategyType'
]);


function asValues(value) {
  if (Array.isArray(value)) {
    return value.filter(
      (entry) => entry !== null && entry !== undefined
    );
  }

  return value === null || value === undefined
    ? []
    : [value];
}


function freezeDimensionMap(dimensionMap) {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(dimensionMap).map(
        ([dimension, value]) => [
          dimension,
          Array.isArray(value)
            ? Object.freeze([...value])
            : Object.freeze({
                candidateOnly: Object.freeze([
                  ...value.candidateOnly
                ]),
                holdingOnly: Object.freeze([
                  ...value.holdingOnly
                ])
              })
        ]
      )
    )
  );
}


function unavailableOverlap({
  candidateSecurityId,
  holdingSecurityId,
  profile,
  reasonCode
}) {
  return Object.freeze({
    comparisonAvailable: false,
    candidateSecurityId: candidateSecurityId ?? null,
    holdingSecurityId: holdingSecurityId ?? null,
    sleeveProfileId: profile?.profileId ?? null,
    sameSecurity: false,
    overlapLevel: null,
    sharedDimensions: Object.freeze({}),
    distinctDimensions: Object.freeze({}),
    sameCategoryRole: false,
    matchedCategoryIds: Object.freeze([]),
    reasonCode
  });
}


function determineOverlapLevel({
  sameSecurity,
  sameCategoryRole,
  sharedDimensions,
  distinctDimensions
}) {
  if (sameSecurity) {
    return 'high';
  }

  const sharedKeys = Object.keys(sharedDimensions);
  const distinctKeys = Object.keys(distinctDimensions);

  if (sharedKeys.length === 0) {
    return 'none';
  }

  if (sameCategoryRole) {
    return sharedKeys.length >= distinctKeys.length
      ? 'high'
      : 'medium';
  }

  const sharesRoleBearingDimension = sharedKeys.some(
    (dimension) => ROLE_BEARING_DIMENSIONS.has(dimension)
  );

  return sharesRoleBearingDimension ? 'medium' : 'low';
}


/**
 * Compares only the dimensions declared by the exact target sleeve
 * profile. Array cardinality is not used to infer breadth or quality.
 */
export function resolveSecurityStructuralOverlap({
  candidateSecurityId,
  holdingSecurityId,
  portfolioSystemId,
  variantId,
  sleeveId,
  sleeveDecisionProfile = null
} = {}) {
  const profile = sleeveDecisionProfile ??
    resolveSleeveDecisionProfile({
      portfolioSystemId,
      variantId,
      sleeveId
    });
  const candidate = getSecurityStructuralFacts(
    candidateSecurityId
  );
  const holding = getSecurityStructuralFacts(
    holdingSecurityId
  );

  if (!profile) {
    return unavailableOverlap({
      candidateSecurityId,
      holdingSecurityId,
      profile,
      reasonCode: 'unresolved-sleeve-profile'
    });
  }

  if (!candidate || !holding) {
    return unavailableOverlap({
      candidateSecurityId: candidate?.securityId ?? null,
      holdingSecurityId: holding?.securityId ?? null,
      profile,
      reasonCode: !candidate
        ? 'unknown-candidate-security'
        : 'unknown-holding-security'
    });
  }

  const sharedDimensions = {};
  const distinctDimensions = {};

  for (const dimension of profile.overlapDimensions) {
    const candidateValues = asValues(
      candidate.exposure[dimension]
    );
    const holdingValues = asValues(
      holding.exposure[dimension]
    );
    const shared = candidateValues.filter(
      (value) => holdingValues.includes(value)
    );
    const candidateOnly = candidateValues.filter(
      (value) => !holdingValues.includes(value)
    );
    const holdingOnly = holdingValues.filter(
      (value) => !candidateValues.includes(value)
    );

    if (shared.length > 0) {
      sharedDimensions[dimension] = [...new Set(shared)];
    }

    if (candidateOnly.length > 0 || holdingOnly.length > 0) {
      distinctDimensions[dimension] = {
        candidateOnly: [...new Set(candidateOnly)],
        holdingOnly: [...new Set(holdingOnly)]
      };
    }
  }

  const matchedCategoryIds = candidate.categoryIds.filter(
    (categoryId) =>
      holding.categoryIds.includes(categoryId) &&
      profile.permittedCategoryIds.includes(categoryId)
  );
  const sameSecurity =
    candidate.securityId === holding.securityId;
  const sameCategoryRole = matchedCategoryIds.length > 0;
  const overlapLevel = determineOverlapLevel({
    sameSecurity,
    sameCategoryRole,
    sharedDimensions,
    distinctDimensions
  });

  return Object.freeze({
    comparisonAvailable: true,
    candidateSecurityId: candidate.securityId,
    holdingSecurityId: holding.securityId,
    sleeveProfileId: profile.profileId,
    sameSecurity,
    overlapLevel,
    sharedDimensions: freezeDimensionMap(sharedDimensions),
    distinctDimensions: freezeDimensionMap(distinctDimensions),
    sameCategoryRole,
    matchedCategoryIds: Object.freeze([
      ...matchedCategoryIds
    ]),
    reasonCode: null
  });
}


/**
 * Evaluates candidate overlap against holdings outside the target
 * sleeve while preserving each holding's sleeve identity.
 */
export function resolveCrossSleeveStructuralOverlaps({
  candidateSecurityId,
  portfolioSystemId,
  variantId,
  targetSleeveId,
  holdingsBySleeve
} = {}) {
  if (
    !holdingsBySleeve ||
    typeof holdingsBySleeve !== 'object' ||
    Array.isArray(holdingsBySleeve)
  ) {
    throw new TypeError('holdingsBySleeve must be an object');
  }

  const profile = resolveSleeveDecisionProfile({
    portfolioSystemId,
    variantId,
    sleeveId: targetSleeveId
  });

  if (!profile) {
    return Object.freeze({
      comparisonAvailable: false,
      candidateSecurityId:
        typeof candidateSecurityId === 'string'
          ? candidateSecurityId.toLowerCase()
          : null,
      targetSleeveId: targetSleeveId ?? null,
      comparisons: Object.freeze([]),
      overlaps: Object.freeze([]),
      reasonCode: 'unresolved-sleeve-profile'
    });
  }

  const comparisons = [];

  for (const [holdingSleeveId, securityIds] of Object.entries(
    holdingsBySleeve
  )) {
    if (holdingSleeveId === targetSleeveId) {
      continue;
    }

    if (!Array.isArray(securityIds)) {
      throw new TypeError(
        'Each holdingsBySleeve value must be an array'
      );
    }

    for (const holdingSecurityId of securityIds) {
      const overlap = resolveSecurityStructuralOverlap({
        candidateSecurityId,
        holdingSecurityId,
        sleeveDecisionProfile: profile
      });

      comparisons.push(Object.freeze({
        holdingSleeveId,
        holdingSecurityId:
          typeof holdingSecurityId === 'string'
            ? holdingSecurityId.toLowerCase()
            : null,
        overlap
      }));
    }
  }

  return Object.freeze({
    comparisonAvailable: true,
    candidateSecurityId:
      typeof candidateSecurityId === 'string'
        ? candidateSecurityId.toLowerCase()
        : null,
    targetSleeveId,
    comparisons: Object.freeze(comparisons),
    overlaps: Object.freeze(
      comparisons.filter(
        ({ overlap }) =>
          overlap.comparisonAvailable &&
          overlap.overlapLevel !== 'none'
      )
    ),
    reasonCode: null
  });
}

