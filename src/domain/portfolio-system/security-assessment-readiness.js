import {
  getMissingExposureProfileFields,
  getSecurityExposureProfile
} from './security-exposure-profiles.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';


const REQUIRED_CANONICAL_FIELDS = Object.freeze([
  'ticker',
  'name',
  'issuer',
  'securityType',
  'sourceUrl',
  'verifiedAt',
  'activeStatus'
]);

const BASE_PROFILE_FIELDS = Object.freeze([
  'assetClasses',
  'geographies',
  'incomeRole',
  'inflationSensitivity',
  'strategyType',
  'complexity',
  'evidenceSourceUrls'
]);

const COMPARISON_PROFILE_FIELDS = Object.freeze([
  'marketCaps',
  'styles',
  'factors',
  'sectors',
  'durationBand',
  'creditQualities'
]);


function canonicalMissingFields(securityId) {
  const security = PHASE_1_SECURITY_REFERENCE[securityId];

  if (!security) {
    return [...REQUIRED_CANONICAL_FIELDS];
  }

  const missing = REQUIRED_CANONICAL_FIELDS.filter(
    (field) =>
      security[field] === null ||
      security[field] === undefined ||
      security[field] === '' ||
      security[field] === 'unknown'
  );

  if (security.verificationStatus !== 'verified') {
    missing.push('verificationStatus');
  }

  return missing;
}


function decisionRelevantProfileFields(securityIds) {
  const profiles = securityIds.map(
    getSecurityExposureProfile
  ).filter(Boolean);

  const comparisonFields = COMPARISON_PROFILE_FIELDS.filter(
    (field) => profiles.some(
      (profile) => profile[field] !== null
    )
  );

  return [...BASE_PROFILE_FIELDS, ...comparisonFields];
}


function missingFieldsForSecurity(
  securityId,
  requiredProfileFields
) {
  return Object.freeze([
    ...new Set([
      ...canonicalMissingFields(securityId),
      ...getMissingExposureProfileFields(
        securityId,
        requiredProfileFields
      )
    ])
  ]);
}


export function resolveSecurityAssessmentReadiness({
  candidateSecurityId,
  holdingSecurityIds = []
}) {
  const securityIds = [
    candidateSecurityId,
    ...holdingSecurityIds
  ];
  const requiredProfileFields =
    decisionRelevantProfileFields(securityIds);
  const candidateFields = missingFieldsForSecurity(
    candidateSecurityId,
    requiredProfileFields
  );

  if (candidateFields.length > 0) {
    return Object.freeze({
      ready: false,
      subject: 'candidate',
      missingFields: Object.freeze([Object.freeze({
        securityId: candidateSecurityId,
        fields: candidateFields
      })])
    });
  }

  const missingHoldings = holdingSecurityIds.map(
    (securityId) => Object.freeze({
      securityId,
      fields: missingFieldsForSecurity(
        securityId,
        requiredProfileFields
      )
    })
  ).filter(({ fields }) => fields.length > 0);

  if (missingHoldings.length > 0) {
    return Object.freeze({
      ready: false,
      subject: 'holdings',
      missingFields: Object.freeze(missingHoldings)
    });
  }

  return Object.freeze({
    ready: true,
    subject: null,
    missingFields: Object.freeze([])
  });
}
