/**
 * Phase 3 incremental-contribution analysis.
 *
 * Inputs are resolved structural facts and Phase 2 overlap evidence. This
 * module does not look up or reinterpret security metadata, determine fit,
 * choose an action, or produce presentation copy.
 */

const COMPLEXITY_RANK = Object.freeze({
  low: 0,
  moderate: 1,
  high: 2
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


function asValues(value) {
  if (Array.isArray(value)) {
    return unique(value.filter(
      (entry) => entry !== null && entry !== undefined
    ));
  }

  return value === null || value === undefined
    ? []
    : [value];
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


function normalizeSecurityFacts(value, label) {
  assertPlainObject(value, label);

  if (typeof value.securityId !== 'string') {
    throw new TypeError(`${label}.securityId must be a string`);
  }

  assertArray(value.categoryIds, `${label}.categoryIds`);
  assertPlainObject(value.exposure, `${label}.exposure`);

  return value;
}


function normalizeCrossSleeveHoldings(crossSleeveHoldings) {
  assertArray(crossSleeveHoldings, 'crossSleeveHoldings');

  return crossSleeveHoldings.map((entry, index) => {
    assertPlainObject(entry, `crossSleeveHoldings[${index}]`);

    if (typeof entry.sleeveId !== 'string') {
      throw new TypeError(
        `crossSleeveHoldings[${index}].sleeveId must be a string`
      );
    }

    return {
      sleeveId: entry.sleeveId,
      security: normalizeSecurityFacts(
        entry.security,
        `crossSleeveHoldings[${index}].security`
      )
    };
  });
}


function normalizeOverlapEvidence(structuralOverlapEvidence) {
  assertArray(structuralOverlapEvidence, 'structuralOverlapEvidence');

  return structuralOverlapEvidence.map((entry, index) => {
    assertPlainObject(entry, `structuralOverlapEvidence[${index}]`);
    const overlap = entry.overlap ?? entry;
    assertPlainObject(
      overlap,
      `structuralOverlapEvidence[${index}].overlap`
    );

    if (overlap.comparisonAvailable !== true) {
      throw new TypeError(
        'Incremental contribution requires available overlap evidence'
      );
    }

    assertPlainObject(
      overlap.sharedDimensions,
      `structuralOverlapEvidence[${index}].overlap.sharedDimensions`
    );
    assertPlainObject(
      overlap.distinctDimensions,
      `structuralOverlapEvidence[${index}].overlap.distinctDimensions`
    );

    return {
      holdingSecurityId:
        entry.holdingSecurityId ?? overlap.holdingSecurityId,
      holdingSleeveId: entry.holdingSleeveId ?? null,
      overlap
    };
  });
}


function partitionOverlapEvidence({
  overlaps,
  targetSleeveId,
  targetHoldings,
  crossHoldings
}) {
  const targetHoldingIds = new Set(
    targetHoldings.map(({ security }) => security.securityId)
  );
  const crossCoordinates = crossHoldings.map(({ sleeveId, security }) => ({
    sleeveId,
    securityId: security.securityId
  }));
  const target = [];
  const cross = [];

  for (const evidence of overlaps) {
    const targetMatch = targetHoldingIds.has(
      evidence.holdingSecurityId
    );
    const crossMatches = crossCoordinates.filter(
      ({ sleeveId, securityId }) =>
        securityId === evidence.holdingSecurityId &&
        (
          evidence.holdingSleeveId === null ||
          sleeveId === evidence.holdingSleeveId
        )
    );

    if (evidence.holdingSleeveId === targetSleeveId && targetMatch) {
      target.push({
        ...evidence,
        holdingSleeveId: targetSleeveId
      });
      continue;
    }

    if (evidence.holdingSleeveId !== null) {
      if (crossMatches.length !== 1) {
        throw new TypeError(
          'structuralOverlapEvidence references a holding outside the supplied portfolio context'
        );
      }

      cross.push({
        ...evidence,
        holdingSleeveId: crossMatches[0].sleeveId
      });
      continue;
    }

    if (targetMatch && crossMatches.length > 0) {
      throw new TypeError(
        'structuralOverlapEvidence must identify the sleeve for a holding present in multiple scopes'
      );
    }

    if (targetMatch) {
      target.push({
        ...evidence,
        holdingSleeveId: targetSleeveId
      });
      continue;
    }

    if (crossMatches.length === 1) {
      cross.push({
        ...evidence,
        holdingSleeveId: crossMatches[0].sleeveId
      });
      continue;
    }

    throw new TypeError(
      'structuralOverlapEvidence references a holding outside the supplied portfolio context'
    );
  }

  return { target, cross };
}


function valuesByDimension(security, dimensions) {
  return Object.fromEntries(
    dimensions.map((dimension) => [
      dimension,
      asValues(security.exposure[dimension])
    ])
  );
}


function evidenceDimensions(overlapEvidence) {
  return overlapEvidence.flatMap(({ overlap }) => [
    ...Object.keys(overlap.sharedDimensions),
    ...Object.keys(overlap.distinctDimensions)
  ]);
}


function aggregateDimensions({
  candidate,
  holdings,
  dimensions,
  overlapEvidence
}) {
  const candidateValues = valuesByDimension(candidate, dimensions);
  const holdingValues = Object.fromEntries(
    dimensions.map((dimension) => [
      dimension,
      unique(holdings.flatMap(({ security }) =>
        asValues(security.exposure[dimension])
      ))
    ])
  );
  const evidenceShared = Object.fromEntries(
    dimensions.map((dimension) => [dimension, []])
  );
  const evidenceCandidateOnly = Object.fromEntries(
    dimensions.map((dimension) => [dimension, []])
  );
  const evidenceHoldingOnly = Object.fromEntries(
    dimensions.map((dimension) => [dimension, []])
  );

  for (const { overlap } of overlapEvidence) {
    for (const dimension of dimensions) {
      evidenceShared[dimension].push(
        ...asValues(overlap.sharedDimensions[dimension])
      );

      const distinct = overlap.distinctDimensions[dimension];
      if (isPlainObject(distinct)) {
        evidenceCandidateOnly[dimension].push(
          ...asValues(distinct.candidateOnly)
        );
        evidenceHoldingOnly[dimension].push(
          ...asValues(distinct.holdingOnly)
        );
      }
    }
  }

  const sharedDimensions = {};
  const distinctDimensions = {};

  for (const dimension of dimensions) {
    const candidateSet = unique([
      ...candidateValues[dimension],
      ...evidenceCandidateOnly[dimension],
      ...evidenceShared[dimension]
    ]);
    const holdingSet = unique([
      ...holdingValues[dimension],
      ...evidenceHoldingOnly[dimension],
      ...evidenceShared[dimension]
    ]);
    const shared = candidateSet.filter(
      (value) => holdingSet.includes(value)
    );
    const candidateOnly = candidateSet.filter(
      (value) => !holdingSet.includes(value)
    );
    const holdingOnly = holdingSet.filter(
      (value) => !candidateSet.includes(value)
    );

    if (shared.length > 0) {
      sharedDimensions[dimension] = shared;
    }

    if (candidateOnly.length > 0 || holdingOnly.length > 0) {
      distinctDimensions[dimension] = {
        candidateOnly,
        holdingOnly
      };
    }
  }

  return { sharedDimensions, distinctDimensions };
}


function roleEvidence({ candidate, targetSleeve, holdings, overlaps }) {
  const permittedCandidateCategories = candidate.categoryIds.filter(
    (categoryId) =>
      targetSleeve.permittedCategoryIds.includes(categoryId)
  );
  const sharedCategoryIds = unique(overlaps.flatMap(({ overlap }) =>
    overlap.sameCategoryRole
      ? overlap.matchedCategoryIds ?? []
      : []
  ));
  const holdingSecurityIds = unique(overlaps.filter(
    ({ overlap }) => overlap.sameCategoryRole
  ).map(({ holdingSecurityId }) => holdingSecurityId).filter(Boolean));

  // If supplied overlap evidence is incomplete, resolved category facts keep
  // role evidence conservative rather than manufacturing a distinct role.
  for (const { security } of holdings) {
    const shared = permittedCandidateCategories.filter(
      (categoryId) => security.categoryIds.includes(categoryId)
    );

    if (shared.length > 0) {
      sharedCategoryIds.push(...shared);
      holdingSecurityIds.push(security.securityId);
    }
  }

  const frozenSharedCategoryIds = unique(sharedCategoryIds);
  const frozenHoldingIds = unique(holdingSecurityIds);
  const distinctCategoryIds = permittedCandidateCategories.filter(
    (categoryId) => !frozenSharedCategoryIds.includes(categoryId)
  );

  return {
    sharedRole: {
      present: frozenSharedCategoryIds.length > 0,
      categoryIds: frozenSharedCategoryIds,
      holdingSecurityIds: frozenHoldingIds
    },
    distinctRole: {
      present: distinctCategoryIds.length > 0,
      categoryIds: distinctCategoryIds
    }
  };
}


function incrementalBreadth(candidate, holdings) {
  const candidateClassification =
    candidate.breadthClassification ?? null;
  const existingClassifications = unique(holdings.map(
    ({ security }) => security.breadthClassification
  ).filter(Boolean));

  let status = 'unresolved';
  if (candidateClassification) {
    status = existingClassifications.length === 0
      ? 'introduced'
      : existingClassifications.includes(candidateClassification)
        ? 'shared'
        : 'different';
  }

  return {
    status,
    candidateClassification,
    existingClassifications
  };
}


function incrementalValues(distinctDimensions, dimension) {
  return distinctDimensions[dimension]?.candidateOnly ?? [];
}


function capExposure(sharedDimensions, distinctDimensions) {
  const shared = sharedDimensions.marketCaps ?? [];
  const candidateOnly = incrementalValues(
    distinctDimensions,
    'marketCaps'
  );
  const holdingOnly =
    distinctDimensions.marketCaps?.holdingOnly ?? [];

  return {
    added: candidateOnly,
    increasedEmphasis:
      candidateOnly.length === 0 && holdingOnly.length > 0
        ? shared
        : [],
    reducedRelativeEmphasis: holdingOnly
  };
}


function incrementalScalarRole({ candidate, holdings, field, absentValue }) {
  const candidateValue = candidate.exposure[field];

  if (
    candidateValue === null ||
    candidateValue === undefined ||
    candidateValue === absentValue
  ) {
    return null;
  }

  const existingValues = holdings.flatMap(({ security }) =>
    asValues(security.exposure[field])
  );

  return existingValues.includes(candidateValue)
    ? null
    : candidateValue;
}


function complexityChange(candidate, holdings) {
  const candidateLevel = candidate.exposure.complexity ?? null;
  const existingLevels = unique(holdings.map(
    ({ security }) => security.exposure.complexity
  ).filter(Boolean));
  const candidateRank = COMPLEXITY_RANK[candidateLevel];
  const existingRanks = existingLevels.map(
    (level) => COMPLEXITY_RANK[level]
  ).filter(Number.isInteger);
  let direction = 'unresolved';

  if (Number.isInteger(candidateRank)) {
    if (existingRanks.length === 0) {
      direction = 'introduced';
    } else if (existingRanks.every((rank) => rank === candidateRank)) {
      direction = 'unchanged';
    } else if (existingRanks.every((rank) => candidateRank > rank)) {
      direction = 'higher';
    } else if (existingRanks.every((rank) => candidateRank < rank)) {
      direction = 'lower';
    } else {
      direction = 'mixed';
    }
  }

  return {
    direction,
    candidateLevel,
    existingLevels
  };
}


/**
 * Describes structural changes from including a candidate. The result is
 * evidence only. Top-level contribution fields are relative to holdings in
 * the target sleeve; portfolio holdings elsewhere are retained under
 * crossSleeveEvidence. The result intentionally contains no outcome, action,
 * score, or UI language.
 */
export function resolveSecurityIncrementalContribution({
  candidate,
  targetSleeve,
  targetSleeveHoldings = [],
  crossSleeveHoldings = [],
  structuralOverlapEvidence = []
} = {}) {
  normalizeSecurityFacts(candidate, 'candidate');
  assertPlainObject(targetSleeve, 'targetSleeve');
  if (typeof targetSleeve.sleeveId !== 'string') {
    throw new TypeError('targetSleeve.sleeveId must be a string');
  }
  assertArray(
    targetSleeve.permittedCategoryIds,
    'targetSleeve.permittedCategoryIds'
  );
  assertArray(
    targetSleeve.overlapDimensions,
    'targetSleeve.overlapDimensions'
  );
  assertArray(targetSleeveHoldings, 'targetSleeveHoldings');

  const normalizedTargetHoldings = targetSleeveHoldings.map(
    (holding, index) => ({
      sleeveId: targetSleeve.sleeveId ?? null,
      security: normalizeSecurityFacts(
        holding,
        `targetSleeveHoldings[${index}]`
      )
    })
  );
  const normalizedCrossHoldings = normalizeCrossSleeveHoldings(
    crossSleeveHoldings
  );

  if (normalizedCrossHoldings.some(
    ({ sleeveId }) => sleeveId === targetSleeve.sleeveId
  )) {
    throw new TypeError(
      'crossSleeveHoldings must not contain the target sleeve'
    );
  }

  const overlaps = normalizeOverlapEvidence(
    structuralOverlapEvidence
  );
  const partitionedOverlaps = partitionOverlapEvidence({
    overlaps,
    targetSleeveId: targetSleeve.sleeveId,
    targetHoldings: normalizedTargetHoldings,
    crossHoldings: normalizedCrossHoldings
  });

  for (const { holdingSecurityId, overlap } of overlaps) {
    if (
      overlap.candidateSecurityId &&
      overlap.candidateSecurityId !== candidate.securityId
    ) {
      throw new TypeError(
        'structuralOverlapEvidence references a different candidate'
      );
    }

    if (
      overlap.holdingSecurityId &&
      overlap.holdingSecurityId !== holdingSecurityId
    ) {
      throw new TypeError(
        'structuralOverlapEvidence contains inconsistent holding identities'
      );
    }
  }

  const unsupportedEvidenceDimensions = evidenceDimensions(
    overlaps
  ).filter(
    (dimension) => !targetSleeve.overlapDimensions.includes(dimension)
  );

  if (unsupportedEvidenceDimensions.length > 0) {
    throw new TypeError(
      'structuralOverlapEvidence contains dimensions outside the target sleeve profile'
    );
  }

  const dimensions = unique(targetSleeve.overlapDimensions);
  const {
    sharedDimensions,
    distinctDimensions
  } = aggregateDimensions({
    candidate,
    holdings: normalizedTargetHoldings,
    dimensions,
    overlapEvidence: partitionedOverlaps.target
  });
  const roles = roleEvidence({
    candidate,
    targetSleeve,
    holdings: normalizedTargetHoldings,
    overlaps: partitionedOverlaps.target
  });
  const crossDimensions = aggregateDimensions({
    candidate,
    holdings: normalizedCrossHoldings,
    dimensions,
    overlapEvidence: partitionedOverlaps.cross
  });
  const crossRoles = roleEvidence({
    candidate,
    targetSleeve,
    holdings: normalizedCrossHoldings,
    overlaps: partitionedOverlaps.cross
  });

  return deepFreeze({
    comparisonAvailable: true,
    candidateSecurityId: candidate.securityId,
    targetSleeveId: targetSleeve.sleeveId ?? null,
    targetSleeveProfileId: targetSleeve.profileId ?? null,
    comparedHoldingIds: unique([
      ...normalizedTargetHoldings,
      ...normalizedCrossHoldings
    ].map(({ security }) => security.securityId)),
    holdingContext: {
      targetSleeveHoldingIds: normalizedTargetHoldings.map(
        ({ security }) => security.securityId
      ),
      crossSleeveHoldings: normalizedCrossHoldings.map(
        ({ sleeveId, security }) => ({
          sleeveId,
          securityId: security.securityId
        })
      )
    },
    sharedDimensions,
    distinctDimensions,
    sharedRole: roles.sharedRole,
    distinctRole: roles.distinctRole,
    incrementalBreadth: incrementalBreadth(
      candidate,
      normalizedTargetHoldings
    ),
    incrementalCapExposure: capExposure(
      sharedDimensions,
      distinctDimensions
    ),
    incrementalFactorExposure: incrementalValues(
      distinctDimensions,
      'factors'
    ),
    incrementalGeography: incrementalValues(
      distinctDimensions,
      'geographies'
    ),
    incrementalSectorExposure: incrementalValues(
      distinctDimensions,
      'sectors'
    ),
    incrementalIncomeRole: incrementalScalarRole({
      candidate,
      holdings: normalizedTargetHoldings,
      field: 'incomeRole',
      absentValue: 'none'
    }),
    incrementalInflationRole: incrementalScalarRole({
      candidate,
      holdings: normalizedTargetHoldings,
      field: 'inflationSensitivity',
      absentValue: 'none'
    }),
    complexityChange: complexityChange(
      candidate,
      normalizedTargetHoldings
    ),
    crossSleeveEvidence: {
      portfolioAlreadyHasExposure:
        crossRoles.sharedRole.present ||
        Object.keys(crossDimensions.sharedDimensions).length > 0,
      sharedDimensions: crossDimensions.sharedDimensions,
      distinctDimensions: crossDimensions.distinctDimensions,
      sharedRole: crossRoles.sharedRole,
      distinctRole: crossRoles.distinctRole,
      comparisons: partitionedOverlaps.cross.map(({
        holdingSleeveId,
        holdingSecurityId,
        overlap
      }) => ({
        sleeveId: holdingSleeveId,
        securityId: holdingSecurityId,
        sharedDimensions: overlap.sharedDimensions,
        distinctDimensions: overlap.distinctDimensions,
        sameCategoryRole: overlap.sameCategoryRole
      }))
    }
  });
}
