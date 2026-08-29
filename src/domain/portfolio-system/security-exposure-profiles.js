import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';


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
    strategyType: 'unknown',
    complexity: 'unknown',
    evidenceSourceUrls: Object.freeze([]),
    verificationStatus: 'pending'
  });
}


export const SECURITY_EXPOSURE_PROFILES = Object.freeze(
  Object.fromEntries(
    Object.keys(PHASE_1_SECURITY_REFERENCE).map(
      (securityId) => [
        securityId,
        createPendingExposureProfile(securityId)
      ]
    )
  )
);


export function getSecurityExposureProfile(
  securityId
) {
  if (typeof securityId !== 'string') {
    return null;
  }

  return SECURITY_EXPOSURE_PROFILES[
    securityId.toLowerCase()
  ] ?? null;
}
