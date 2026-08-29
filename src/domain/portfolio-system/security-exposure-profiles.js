import {
  PHASE_1_SECURITY_METADATA_RECORDS
} from './security-metadata.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';


export const SECURITY_EXPOSURE_PROFILE_FIELDS = Object.freeze([
  'assetClasses',
  'geographies',
  'marketCaps',
  'styles',
  'factors',
  'sectors',
  'durationBand',
  'creditQualities',
  'incomeRole',
  'inflationSensitivity',
  'strategyType',
  'complexity',
  'evidenceSourceUrls'
]);


const UNKNOWN_VALUES = Object.freeze(['unknown']);


function createPendingExposureProfile(securityId) {
  return Object.freeze({
    securityId,
    assetClasses: UNKNOWN_VALUES,
    geographies: UNKNOWN_VALUES,
    marketCaps: UNKNOWN_VALUES,
    styles: UNKNOWN_VALUES,
    factors: UNKNOWN_VALUES,
    sectors: UNKNOWN_VALUES,
    durationBand: 'unknown',
    creditQualities: UNKNOWN_VALUES,
    incomeRole: 'unknown',
    inflationSensitivity: 'unknown',
    strategyType: 'unknown',
    complexity: 'unknown',
    evidenceSourceUrls: Object.freeze([]),
    verificationStatus: 'pending'
  });
}


function createVerifiedExposureProfile(security) {
  return Object.freeze({
    securityId: security.securityId,
    ...security.exposureProfile,
    evidenceSourceUrls:
      security.evidenceSourceUrls,
    verificationStatus: 'verified'
  });
}


const VERIFIED_PROFILES =
  PHASE_1_SECURITY_METADATA_RECORDS.map(
    createVerifiedExposureProfile
  );


const VERIFIED_PROFILE_IDS = new Set(
  VERIFIED_PROFILES.map(({ securityId }) => securityId)
);


const PENDING_PROFILES = Object.keys(
  PHASE_1_SECURITY_REFERENCE
).filter(
  (securityId) => !VERIFIED_PROFILE_IDS.has(securityId)
).map(createPendingExposureProfile);


export const SECURITY_EXPOSURE_PROFILES = Object.freeze(
  Object.fromEntries(
    [...VERIFIED_PROFILES, ...PENDING_PROFILES].map(
      (profile) => [profile.securityId, profile]
    )
  )
);


export function getSecurityExposureProfile(securityId) {
  if (typeof securityId !== 'string') {
    return null;
  }

  return SECURITY_EXPOSURE_PROFILES[
    securityId.toLowerCase()
  ] ?? null;
}


function isUnresolvedValue(value) {
  return value === undefined ||
    value === 'unknown' ||
    (Array.isArray(value) && value.includes('unknown'));
}


export function getMissingExposureProfileFields(
  securityId,
  requiredFields = SECURITY_EXPOSURE_PROFILE_FIELDS
) {
  const profile = getSecurityExposureProfile(securityId);

  if (!profile) {
    return Object.freeze([...requiredFields]);
  }

  return Object.freeze(
    requiredFields.filter((field) => {
      const value = profile[field];

      if (isUnresolvedValue(value)) {
        return true;
      }

      return field === 'evidenceSourceUrls' &&
        (!Array.isArray(value) || value.length === 0);
    })
  );
}
