import {
  SECURITY_FIT_OUTCOMES
} from './security-fit-constants.js';

import {
  resolveSecurityReplacementComparison
} from './security-replacement-comparison.js';

import {
  resolveSecuritySleeveAlignment,
  resolveSecuritySleeveBoundaryAlignment
} from './security-sleeve-alignment.js';

import {
  resolveCrossSleeveStructuralOverlaps,
  resolveSecurityStructuralOverlap
} from './security-structural-overlap.js';


function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }

  return Object.freeze(value);
}


function unevaluatedDecisionFactors() {
  return {
    sleeveRole: { status: 'not-evaluated' },
    sleeveBoundary: { status: 'not-evaluated' },
    overlap: {
      status: 'not-evaluated',
      overlappingSecurityIds: [],
      sharedDimensions: []
    },
    replacement: {
      status: 'not-evaluated',
      affectedSecurityId: null,
      advantages: [],
      disadvantages: []
    },
    crossSleeveRole: {
      status: 'not-evaluated',
      overlappingSecurityIds: [],
      overlappingSleeveIds: []
    },
    distinctContribution: {
      status: 'not-evaluated',
      matchedRole: null,
      matchedCategoryIds: []
    }
  };
}


function roleFactor(alignment) {
  return {
    status: alignment.aligned ? 'aligned' : 'conflict',
    matchedRole: alignment.matchedJob,
    matchedReturnRole: alignment.matchedReturnRole,
    matchedCategoryIds: [...alignment.matchedCategoryIds],
    conflicts: [...alignment.conflicts]
  };
}


function boundaryFactor(boundary) {
  const fit = (dimension) =>
    boundary.checks[dimension]?.aligned
      ? 'aligned'
      : 'conflict';

  return {
    status: boundary.aligned ? 'aligned' : 'conflict',
    assetClassFit: fit('assetClasses'),
    geographyFit: fit('geographies'),
    complexityFit: fit('complexity'),
    strategyFit: fit('strategyType'),
    breadthFit: fit('breadth'),
    thesisMonitoringFit: fit('thesisMonitoring'),
    incomeRoleFit: fit('incomeRole'),
    inflationRoleFit: fit('inflationSensitivity'),
    durationFit: boundary.checks.durationBand?.applicable
      ? fit('durationBand')
      : 'not-applicable',
    creditQualityFit: boundary.checks.creditQualities?.applicable
      ? fit('creditQualities')
      : 'not-applicable',
    conflicts: boundary.conflicts.map(({ code }) => code)
  };
}


function overlapFactor(overlaps, status = null) {
  const availableOverlaps = overlaps.filter(
    ({ overlap }) => overlap.comparisonAvailable
  );
  const levels = availableOverlaps.map(
    ({ overlap }) => overlap.overlapLevel
  );
  const resolvedStatus = status ??
    (
      levels.includes('high')
        ? 'high'
        : levels.includes('medium')
          ? 'medium'
          : levels.includes('low')
            ? 'low'
            : 'none'
    );

  return {
    status: resolvedStatus,
    overlappingSecurityIds: [
      ...new Set(
        availableOverlaps.map(
          ({ securityId }) => securityId
        )
      )
    ],
    sharedDimensions: [
      ...new Set(
        availableOverlaps.flatMap(
          ({ overlap }) =>
            Object.keys(overlap.sharedDimensions)
        )
      )
    ]
  };
}


function fitResult({
  outcome,
  affectedSecurityId = null,
  reasonCode,
  reasonCodes = [reasonCode],
  roleOverlaps = [],
  decisionFactors
}) {
  return deepFreeze({
    assessmentAvailable: true,
    outcome,
    affectedSecurityId,
    reasonCode,
    reasonCodes,
    roleOverlaps,
    decisionFactors
  });
}


/**
 * Applies the frozen sleeve-philosophy precedence after the caller has
 * completed metadata readiness. Focused helpers own all comparisons.
 */
export function resolveSleeveSecurityFit({
  candidateSecurityId,
  portfolioSystemId,
  variantId,
  targetSleeveId,
  holdingsBySleeve,
  exactEligibilityStatus = null
}) {
  const context = {
    candidateSecurityId,
    portfolioSystemId,
    variantId,
    sleeveId: targetSleeveId
  };
  const decisionFactors = unevaluatedDecisionFactors();

  // Step 2: exact sleeve-role alignment.
  const alignment = resolveSecuritySleeveAlignment(context);
  decisionFactors.sleeveRole = roleFactor(alignment);

  if (!alignment.aligned) {
    return fitResult({
      outcome: SECURITY_FIT_OUTCOMES.DO_NOT_ADD,
      reasonCode: 'sleeve-role-conflict',
      reasonCodes: [
        'sleeve-role-conflict',
        ...alignment.conflicts
      ],
      decisionFactors
    });
  }

  // Step 3: machine-readable sleeve-boundary criteria.
  const boundary = resolveSecuritySleeveBoundaryAlignment(context);
  decisionFactors.sleeveBoundary = boundaryFactor(boundary);

  if (!boundary.aligned) {
    return fitResult({
      outcome: SECURITY_FIT_OUTCOMES.DO_NOT_ADD,
      reasonCode: 'sleeve-boundary-conflict',
      reasonCodes: [
        'sleeve-boundary-conflict',
        ...boundary.conflicts.map(({ code }) => code)
      ],
      decisionFactors
    });
  }

  // An aligned candidate still needs a completed exact permission.
  // Pending or absent permission is unavailable, not a rejection.
  if (exactEligibilityStatus !== 'eligible') {
    return deepFreeze({
      assessmentAvailable: false,
      outcome: null,
      affectedSecurityId: null,
      reasonCode: 'exact-eligibility-unavailable',
      reasonCodes: ['exact-eligibility-unavailable'],
      roleOverlaps: [],
      decisionFactors
    });
  }

  // Step 4: exact duplicate anywhere in the hypothetical portfolio.
  const duplicateEntries = Object.entries(
    holdingsBySleeve
  ).flatMap(([sleeveId, securityIds]) =>
    securityIds.includes(candidateSecurityId)
      ? [{ sleeveId, securityId: candidateSecurityId }]
      : []
  );

  if (duplicateEntries.length > 0) {
    const duplicateOverlaps = duplicateEntries.map(
      ({ sleeveId, securityId }) => ({
        sleeveId,
        securityId,
        overlap: resolveSecurityStructuralOverlap({
          ...context,
          holdingSecurityId: securityId
        })
      })
    );
    decisionFactors.overlap = overlapFactor(
      duplicateOverlaps,
      'high'
    );
    decisionFactors.distinctContribution = {
      status: 'none',
      matchedRole: alignment.matchedJob,
      matchedCategoryIds: []
    };

    return fitResult({
      outcome: SECURITY_FIT_OUTCOMES.REDUNDANT,
      reasonCode: 'duplicate-security',
      roleOverlaps: duplicateEntries,
      decisionFactors
    });
  }

  // Step 5: structural overlap inside the selected sleeve.
  const targetSecurityIds = holdingsBySleeve[
    targetSleeveId
  ] ?? [];
  const targetComparisons = targetSecurityIds.map(
    (holdingSecurityId) => ({
      sleeveId: targetSleeveId,
      securityId: holdingSecurityId,
      overlap: resolveSecurityStructuralOverlap({
        ...context,
        holdingSecurityId
      })
    })
  );
  const sameRoleOverlaps = targetComparisons.filter(
    ({ overlap }) =>
      overlap.comparisonAvailable &&
      overlap.sameCategoryRole &&
      ['high', 'medium'].includes(overlap.overlapLevel)
  );

  if (sameRoleOverlaps.length > 0) {
    decisionFactors.overlap = overlapFactor(sameRoleOverlaps);
    const replacementComparisons = sameRoleOverlaps.map(
      ({ securityId }) =>
        resolveSecurityReplacementComparison({
          ...context,
          holdingSecurityId: securityId
        })
    );
    const replacement = replacementComparisons.find(
      ({ replacementJustified }) => replacementJustified
    );

    if (replacement) {
      decisionFactors.replacement = {
        status: 'justified',
        affectedSecurityId: replacement.holdingSecurityId,
        advantages: [...replacement.advantages],
        disadvantages: [...replacement.disadvantages]
      };
      decisionFactors.distinctContribution = {
        status: 'preserves-existing-role',
        matchedRole: alignment.matchedJob,
        matchedCategoryIds: [...alignment.matchedCategoryIds]
      };

      return fitResult({
        outcome: SECURITY_FIT_OUTCOMES.REPLACE,
        affectedSecurityId: replacement.holdingSecurityId,
        reasonCode: 'structural-replacement-advantage',
        reasonCodes: [
          'structural-replacement-advantage',
          ...replacement.advantages
        ],
        roleOverlaps: sameRoleOverlaps.map(
          ({ sleeveId, securityId }) => ({
            sleeveId,
            securityId
          })
        ),
        decisionFactors
      });
    }

    decisionFactors.replacement = {
      status: 'not-justified',
      affectedSecurityId: null,
      advantages: [
        ...new Set(
          replacementComparisons.flatMap(
            ({ advantages }) => advantages
          )
        )
      ],
      disadvantages: [
        ...new Set(
          replacementComparisons.flatMap(
            ({ disadvantages }) => disadvantages
          )
        )
      ]
    };
    decisionFactors.distinctContribution = {
      status: 'none',
      matchedRole: alignment.matchedJob,
      matchedCategoryIds: []
    };

    return fitResult({
      outcome: SECURITY_FIT_OUTCOMES.REDUNDANT,
      reasonCode: 'existing-structural-role-sufficient',
      roleOverlaps: sameRoleOverlaps.map(
        ({ sleeveId, securityId }) => ({
          sleeveId,
          securityId
        })
      ),
      decisionFactors
    });
  }

  decisionFactors.overlap = overlapFactor(targetComparisons);

  // Step 6: responsibility already assigned to another sleeve.
  const crossSleeve = resolveCrossSleeveStructuralOverlaps({
    candidateSecurityId,
    portfolioSystemId,
    variantId,
    targetSleeveId,
    holdingsBySleeve
  });
  const crossRoleConflicts = crossSleeve.comparisons.filter(
    ({ holdingSleeveId, holdingSecurityId, overlap }) => {
      if (!overlap.comparisonAvailable || !overlap.sameCategoryRole) {
        return false;
      }

      const holdingAlignment = resolveSecuritySleeveAlignment({
        candidateSecurityId: holdingSecurityId,
        portfolioSystemId,
        variantId,
        sleeveId: holdingSleeveId
      });
      const holdingBoundary =
        resolveSecuritySleeveBoundaryAlignment({
          candidateSecurityId: holdingSecurityId,
          portfolioSystemId,
          variantId,
          sleeveId: holdingSleeveId
        });

      return holdingAlignment.aligned &&
        holdingBoundary.aligned &&
        overlap.matchedCategoryIds.some(
          (categoryId) =>
            holdingAlignment.matchedCategoryIds.includes(categoryId)
        );
    }
  );

  if (crossRoleConflicts.length > 0) {
    const overlappingSecurityIds = [
      ...new Set(
        crossRoleConflicts.map(
          ({ holdingSecurityId }) => holdingSecurityId
        )
      )
    ];
    const overlappingSleeveIds = [
      ...new Set(
        crossRoleConflicts.map(
          ({ holdingSleeveId }) => holdingSleeveId
        )
      )
    ];
    decisionFactors.crossSleeveRole = {
      status: 'conflict',
      overlappingSecurityIds,
      overlappingSleeveIds
    };
    decisionFactors.distinctContribution = {
      status: 'none',
      matchedRole: alignment.matchedJob,
      matchedCategoryIds: []
    };

    return fitResult({
      outcome: SECURITY_FIT_OUTCOMES.DO_NOT_ADD,
      reasonCode: 'cross-sleeve-role-conflict',
      roleOverlaps: crossRoleConflicts.map(
        ({ holdingSleeveId, holdingSecurityId }) => ({
          sleeveId: holdingSleeveId,
          securityId: holdingSecurityId
        })
      ),
      decisionFactors
    });
  }

  decisionFactors.crossSleeveRole = {
    status: 'none',
    overlappingSecurityIds: [],
    overlappingSleeveIds: []
  };

  // Step 7: the aligned, exactly permitted role is missing.
  decisionFactors.distinctContribution = {
    status: 'missing-role-filled',
    matchedRole: alignment.matchedJob,
    matchedReturnRole: alignment.matchedReturnRole,
    matchedCategoryIds: [...alignment.matchedCategoryIds]
  };

  return fitResult({
    outcome: SECURITY_FIT_OUTCOMES.ADD,
    reasonCode: 'fills-missing-permitted-role',
    decisionFactors
  });
}
