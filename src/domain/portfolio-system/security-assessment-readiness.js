import {
  getSecurityExposureProfile
} from './security-exposure-profiles.js';

import {
  getMissingRequiredProfileFields,
  resolveSecurityAssessmentFieldRequirements
} from './security-assessment-field-requirements.js';

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


function missingFieldsForSecurity(
  securityId,
  requiredProfileFields
) {
  return Object.freeze([
    ...new Set([
      ...canonicalMissingFields(securityId),
      ...getMissingRequiredProfileFields({
        exposureProfile: getSecurityExposureProfile(securityId),
        requiredProfileFields
      })
    ])
  ]);
}


export function resolveSecurityAssessmentReadiness({
  candidateSecurityId,
  holdingSecurityIds = [],
  portfolioSystemId,
  variantId,
  sleeveId,
  targetSleeveId
} = {}) {
  const normalizedCandidateId =
    typeof candidateSecurityId === 'string'
      ? candidateSecurityId.toLowerCase()
      : candidateSecurityId;
  const normalizedHoldingIds = holdingSecurityIds.map(
    (securityId) =>
      typeof securityId === 'string'
        ? securityId.toLowerCase()
        : securityId
  );
  const requirements =
    resolveSecurityAssessmentFieldRequirements({
      portfolioSystemId,
      variantId,
      sleeveId,
      targetSleeveId
    });

  if (!requirements) {
    return Object.freeze({
      ready: false,
      subject: 'sleeve',
      missingFields: Object.freeze([Object.freeze({
        securityId: null,
        fields: Object.freeze(['sleeveDecisionProfile'])
      })])
    });
  }

  const requiredProfileFields =
    requirements.requiredProfileFields;
  const candidateFields = missingFieldsForSecurity(
    normalizedCandidateId,
    requiredProfileFields
  );

  if (candidateFields.length > 0) {
    return Object.freeze({
      ready: false,
      subject: 'candidate',
      missingFields: Object.freeze([Object.freeze({
        securityId: normalizedCandidateId,
        fields: candidateFields
      })])
    });
  }

  const missingHoldings = normalizedHoldingIds.map(
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
