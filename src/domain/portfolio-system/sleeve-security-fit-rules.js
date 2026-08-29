import {
  getSecurityCategories
} from './security-category-universe.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';


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
        const normalizedId = securityId.toLowerCase();
        const categoryIds =
          getSecurityCategories(normalizedId);

        return overlaps(
          candidateCategoryIds,
          categoryIds
        )
          ? [{
              sleeveId,
              securityId: normalizedId,
              categoryIds,
              verificationStatus:
                PHASE_1_SECURITY_REFERENCE[
                  normalizedId
                ]?.verificationStatus ?? 'unknown'
            }]
          : [];
      })
  );
}


export function resolveSleeveSecurityFit({
  candidateSecurityId,
  candidateVerificationStatus,
  candidateCategoryIds,
  exactEligibility,
  targetSleeveId,
  holdingsBySleeve
}) {
  if (
    candidateVerificationStatus !== 'verified'
  ) {
    return Object.freeze({
      outcome: 'do-not-add',
      affectedSecurityId: null,
      reasonCode: 'candidate-unverified',
      roleOverlaps: Object.freeze([])
    });
  }

  if (
    !exactEligibility ||
    exactEligibility.eligibilityStatus !== 'eligible'
  ) {
    return Object.freeze({
      outcome: 'do-not-add',
      affectedSecurityId: null,
      reasonCode:
        'candidate-not-exactly-eligible',
      roleOverlaps: Object.freeze([])
    });
  }

  const normalizedHoldings = Object.fromEntries(
    Object.entries(holdingsBySleeve).map(
      ([sleeveId, securityIds]) => [
        sleeveId,
        securityIds.map(
          (securityId) => securityId.toLowerCase()
        )
      ]
    )
  );

  const duplicateEntry = Object.entries(
    normalizedHoldings
  ).find(
    ([, securityIds]) =>
      securityIds.includes(candidateSecurityId)
  );

  if (duplicateEntry) {
    return Object.freeze({
      outcome: 'redundant',
      affectedSecurityId:
        candidateSecurityId,
      reasonCode: 'duplicate-security',
      roleOverlaps: Object.freeze([{
        sleeveId: duplicateEntry[0],
        securityId: candidateSecurityId
      }])
    });
  }

  const overlapsByRole = roleOverlaps(
    candidateCategoryIds,
    normalizedHoldings
  );

  const replaceable = overlapsByRole.find(
    (overlap) =>
      overlap.sleeveId === targetSleeveId &&
      overlap.verificationStatus !== 'verified'
  );

  if (replaceable) {
    return Object.freeze({
      outcome: 'replace',
      affectedSecurityId:
        replaceable.securityId,
      reasonCode: 'replace-unverified-role',
      roleOverlaps:
        Object.freeze(overlapsByRole)
    });
  }

  if (overlapsByRole.length > 0) {
    return Object.freeze({
      outcome: 'redundant',
      affectedSecurityId: null,
      reasonCode: 'existing-role-sufficient',
      roleOverlaps:
        Object.freeze(overlapsByRole)
    });
  }

  return Object.freeze({
    outcome: 'add',
    affectedSecurityId: null,
    reasonCode: 'fills-missing-role',
    roleOverlaps: Object.freeze([])
  });
}

