import {
  getSecurityCategories
} from './security-category-universe.js';

import {
  getSecurityExposureProfile
} from './security-exposure-profiles.js';

import {
  SECURITY_FIT_OUTCOMES
} from './security-fit-constants.js';


const COMPLEXITY_RANK = Object.freeze({
  low: 0,
  moderate: 1,
  high: 2
});


function overlaps(first, second) {
  return first.some((value) => second.includes(value));
}


function roleOverlaps(
  candidateCategoryIds,
  holdingsBySleeve
) {
  return Object.entries(holdingsBySleeve).flatMap(
    ([sleeveId, securityIds]) =>
      securityIds.flatMap((securityId) => {
        const categoryIds =
          getSecurityCategories(securityId);

        return overlaps(candidateCategoryIds, categoryIds)
          ? [{
              sleeveId,
              securityId,
              categoryIds
            }]
          : [];
      })
  );
}


export function resolveSleeveSecurityFit({
  candidateSecurityId,
  candidateCategoryIds,
  targetSleeveId,
  holdingsBySleeve
}) {
  const duplicateEntry = Object.entries(
    holdingsBySleeve
  ).find(
    ([, securityIds]) =>
      securityIds.includes(candidateSecurityId)
  );

  if (duplicateEntry) {
    return Object.freeze({
      outcome: SECURITY_FIT_OUTCOMES.REDUNDANT,
      affectedSecurityId: null,
      reasonCode: 'duplicate-security',
      roleOverlaps: Object.freeze([{
        sleeveId: duplicateEntry[0],
        securityId: candidateSecurityId
      }])
    });
  }

  const overlapsByRole = roleOverlaps(
    candidateCategoryIds,
    holdingsBySleeve
  );
  const targetSleeveOverlaps = overlapsByRole.filter(
    ({ sleeveId }) => sleeveId === targetSleeveId
  );

  if (targetSleeveOverlaps.length > 0) {
    const candidateComplexity = COMPLEXITY_RANK[
      getSecurityExposureProfile(
        candidateSecurityId
      ).complexity
    ];
    const replaceable = targetSleeveOverlaps.find(
      ({ securityId }) =>
        COMPLEXITY_RANK[
          getSecurityExposureProfile(
            securityId
          ).complexity
        ] > candidateComplexity
    );

    if (replaceable) {
      return Object.freeze({
        outcome: SECURITY_FIT_OUTCOMES.REPLACE,
        affectedSecurityId: replaceable.securityId,
        reasonCode: 'lower-effort-role-replacement',
        roleOverlaps: Object.freeze(overlapsByRole)
      });
    }

    return Object.freeze({
      outcome: SECURITY_FIT_OUTCOMES.REDUNDANT,
      affectedSecurityId: null,
      reasonCode: 'existing-role-sufficient',
      roleOverlaps: Object.freeze(overlapsByRole)
    });
  }

  if (overlapsByRole.length > 0) {
    return Object.freeze({
      outcome: SECURITY_FIT_OUTCOMES.DO_NOT_ADD,
      affectedSecurityId: null,
      reasonCode: 'cross-sleeve-role-conflict',
      roleOverlaps: Object.freeze(overlapsByRole)
    });
  }

  return Object.freeze({
    outcome: SECURITY_FIT_OUTCOMES.ADD,
    affectedSecurityId: null,
    reasonCode: 'fills-missing-role',
    roleOverlaps: Object.freeze([])
  });
}
