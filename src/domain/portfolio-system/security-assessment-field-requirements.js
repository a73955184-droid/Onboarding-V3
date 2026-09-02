import {
  resolveSleeveDecisionProfile
} from './sleeve-decision-profile-resolver.js';


const ALWAYS_REQUIRED_PROFILE_FIELDS = Object.freeze([
  'assetClasses',
  'strategyType',
  'complexity',
  'evidenceSourceUrls'
]);


function unique(values) {
  return [...new Set(values)];
}


/**
 * Returns the exposure fields needed to evaluate the exact sleeve.
 * Overlap dimensions come from the reusable decision profile; bond-only
 * dimensions are therefore absent from equity-only profiles.
 */
export function resolveSecurityAssessmentFieldRequirements({
  portfolioSystemId,
  variantId,
  sleeveId,
  targetSleeveId
} = {}) {
  const resolvedSleeveId = sleeveId ?? targetSleeveId;
  const sleeveDecisionProfile = resolveSleeveDecisionProfile({
    portfolioSystemId,
    variantId,
    sleeveId: resolvedSleeveId
  });

  if (!sleeveDecisionProfile) {
    return null;
  }

  return Object.freeze({
    portfolioSystemId,
    variantId,
    sleeveId: resolvedSleeveId,
    sleeveProfileId: sleeveDecisionProfile.profileId,
    requiredProfileFields: Object.freeze(
      unique([
        ...sleeveDecisionProfile.overlapDimensions,
        ...ALWAYS_REQUIRED_PROFILE_FIELDS
      ])
    )
  });
}


function isUnknown(value) {
  return value === undefined ||
    value === '' ||
    value === 'unknown' ||
    (
      Array.isArray(value) &&
      value.includes('unknown')
    );
}


/**
 * Pure field-level validator used by readiness and its fixtures.
 * `null` remains a valid not-applicable duration or profile value.
 * Applicable but unresolved values must use `unknown` (or be absent) so
 * readiness can block them. Fixed-income credit validation retains its
 * existing completeness rule.
 */
export function getMissingRequiredProfileFields({
  exposureProfile,
  requiredProfileFields = []
} = {}) {
  if (!exposureProfile) {
    return Object.freeze([...requiredProfileFields]);
  }

  const isFixedIncome = Array.isArray(
    exposureProfile.assetClasses
  ) && exposureProfile.assetClasses.includes('fixed-income');

  return Object.freeze(
    requiredProfileFields.filter((field) => {
      const value = exposureProfile[field];

      if (isUnknown(value)) {
        return true;
      }

      if (
        field === 'evidenceSourceUrls' &&
        (!Array.isArray(value) || value.length === 0)
      ) {
        return true;
      }

      if (
        isFixedIncome &&
        field === 'creditQualities' &&
        (
          value === null ||
          !Array.isArray(value) ||
          value.length === 0
        )
      ) {
        return true;
      }

      return false;
    })
  );
}
