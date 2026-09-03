/**
 * Phase 3 Portfolio Decision Support output contract.
 *
 * This module validates and freezes already-resolved decision-support data.
 * It does not assess eligibility, structural fit, contribution, tradeoffs,
 * or preferred actions.
 */

export const DECISION_SUPPORT_ASSESSMENT_STATUSES = Object.freeze({
  COMPLETE: 'complete',
  UNAVAILABLE: 'unavailable'
});


export const DECISION_SUPPORT_ACTIONS = Object.freeze({
  KEEP_CURRENT: 'keep-current',
  ADD: 'add',
  REPLACE: 'replace',
  SAVE_ALTERNATIVE: 'save-alternative',
  RETURN: 'return'
});


export const DECISION_SUPPORT_CONTRIBUTION_LEVELS = Object.freeze({
  DISTINCT: 'distinct',
  INCREMENTAL: 'incremental',
  MOSTLY_OVERLAPPING: 'mostly-overlapping',
  NO_MEANINGFUL_ADDITION: 'no-meaningful-addition',
  CONFLICTING: 'conflicting'
});


export const SECURITY_DECISION_SUPPORT_RESULT_KEYS = Object.freeze([
  'assessmentStatus',
  'candidate',
  'sleeveContext',
  'tradeoffs',
  'contribution',
  'availableActions',
  'preferredAction',
  'rationale',
  'structuralEvidence'
]);


export const SECURITY_DECISION_SUPPORT_TRADEOFF_KEYS = Object.freeze([
  'sharedExposure',
  'distinctExposure',
  'increasedEmphasis',
  'reducedRelativeEmphasis',
  'implementationChanges'
]);


export const SECURITY_DECISION_SUPPORT_RATIONALE_KEYS = Object.freeze([
  'summary',
  'reasonCodes'
]);


export const SECURITY_DECISION_SUPPORT_EVIDENCE_KEYS = Object.freeze([
  'eligibility',
  'readiness',
  'sleeveAlignment',
  'sleeveBoundary',
  'overlap',
  'replacement'
]);


const ASSESSMENT_STATUS_VALUES = Object.freeze(
  Object.values(DECISION_SUPPORT_ASSESSMENT_STATUSES)
);
const ACTION_VALUES = Object.freeze(
  Object.values(DECISION_SUPPORT_ACTIONS)
);
const CONTRIBUTION_LEVEL_VALUES = Object.freeze(
  Object.values(DECISION_SUPPORT_CONTRIBUTION_LEVELS)
);


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


function assertKnownKeys(value, allowedKeys, label) {
  const unknownKeys = Object.keys(value).filter(
    (key) => !allowedKeys.includes(key)
  );

  if (unknownKeys.length > 0) {
    throw new TypeError(
      `${label} contains unknown fields: ${unknownKeys.join(', ')}`
    );
  }
}


function assertRequiredKeys(value, requiredKeys, label) {
  const missingKeys = requiredKeys.filter(
    (key) => !Object.hasOwn(value, key)
  );

  if (missingKeys.length > 0) {
    throw new TypeError(
      `${label} is missing required fields: ${missingKeys.join(', ')}`
    );
  }
}


function assertString(value, label) {
  if (typeof value !== 'string') {
    throw new TypeError(`${label} must be a string`);
  }
}


function assertArray(value, label) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be an array`);
  }
}


function clone(value) {
  if (Array.isArray(value)) {
    return value.map(clone);
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(
        ([key, nested]) => [key, clone(nested)]
      )
    );
  }

  return value;
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


function validateTradeoffs(tradeoffs) {
  assertPlainObject(tradeoffs, 'tradeoffs');
  assertKnownKeys(
    tradeoffs,
    SECURITY_DECISION_SUPPORT_TRADEOFF_KEYS,
    'tradeoffs'
  );
  assertRequiredKeys(
    tradeoffs,
    SECURITY_DECISION_SUPPORT_TRADEOFF_KEYS,
    'tradeoffs'
  );

  for (const key of SECURITY_DECISION_SUPPORT_TRADEOFF_KEYS) {
    assertArray(tradeoffs[key], `tradeoffs.${key}`);
  }
}


function validateContribution(contribution, assessmentStatus) {
  assertPlainObject(contribution, 'contribution');
  assertKnownKeys(
    contribution,
    ['level', 'explanation'],
    'contribution'
  );
  assertString(contribution.explanation, 'contribution.explanation');

  if (assessmentStatus === DECISION_SUPPORT_ASSESSMENT_STATUSES.COMPLETE) {
    if (!CONTRIBUTION_LEVEL_VALUES.includes(contribution.level)) {
      throw new TypeError('contribution.level is not approved');
    }
    return;
  }

  if (contribution.level !== null) {
    throw new TypeError(
      'Unavailable assessments must use a null contribution level'
    );
  }
}


function validateActions({
  assessmentStatus,
  availableActions,
  preferredAction
}) {
  assertArray(availableActions, 'availableActions');

  if (new Set(availableActions).size !== availableActions.length) {
    throw new TypeError('availableActions must not contain duplicates');
  }

  for (const action of availableActions) {
    if (!ACTION_VALUES.includes(action)) {
      throw new TypeError(`Unknown decision-support action: ${action}`);
    }
  }

  if (assessmentStatus === DECISION_SUPPORT_ASSESSMENT_STATUSES.COMPLETE) {
    if (!ACTION_VALUES.includes(preferredAction)) {
      throw new TypeError('preferredAction is not approved');
    }

    if (!availableActions.includes(preferredAction)) {
      throw new TypeError(
        'preferredAction must also appear in availableActions'
      );
    }
    return;
  }

  if (preferredAction !== null) {
    throw new TypeError(
      'Unavailable assessments must not declare a preferredAction'
    );
  }
}


function validateRationale(rationale) {
  assertPlainObject(rationale, 'rationale');
  assertKnownKeys(
    rationale,
    SECURITY_DECISION_SUPPORT_RATIONALE_KEYS,
    'rationale'
  );
  assertRequiredKeys(
    rationale,
    SECURITY_DECISION_SUPPORT_RATIONALE_KEYS,
    'rationale'
  );
  assertString(rationale.summary, 'rationale.summary');
  assertArray(rationale.reasonCodes, 'rationale.reasonCodes');

  for (const reasonCode of rationale.reasonCodes) {
    assertString(reasonCode, 'rationale.reasonCodes entry');
  }
}


function validateStructuralEvidence(structuralEvidence) {
  assertPlainObject(structuralEvidence, 'structuralEvidence');
  assertKnownKeys(
    structuralEvidence,
    SECURITY_DECISION_SUPPORT_EVIDENCE_KEYS,
    'structuralEvidence'
  );
  assertRequiredKeys(
    structuralEvidence,
    SECURITY_DECISION_SUPPORT_EVIDENCE_KEYS,
    'structuralEvidence'
  );
}


/**
 * Creates an immutable snapshot that conforms to the Phase 3 contract.
 * All interpretation must be completed by a future resolver before calling
 * this function.
 */
export function createSecurityDecisionSupportResult(input = {}) {
  assertPlainObject(input, 'decision-support result');
  assertKnownKeys(
    input,
    SECURITY_DECISION_SUPPORT_RESULT_KEYS,
    'decision-support result'
  );
  assertRequiredKeys(
    input,
    SECURITY_DECISION_SUPPORT_RESULT_KEYS,
    'decision-support result'
  );

  if (!ASSESSMENT_STATUS_VALUES.includes(input.assessmentStatus)) {
    throw new TypeError('assessmentStatus is not approved');
  }

  if (input.candidate !== null) {
    assertPlainObject(input.candidate, 'candidate');
  }

  if (input.sleeveContext !== null) {
    assertPlainObject(input.sleeveContext, 'sleeveContext');
  }

  validateTradeoffs(input.tradeoffs);
  validateContribution(input.contribution, input.assessmentStatus);
  validateActions(input);
  validateRationale(input.rationale);
  validateStructuralEvidence(input.structuralEvidence);

  return deepFreeze(clone({
    assessmentStatus: input.assessmentStatus,
    candidate: input.candidate,
    sleeveContext: input.sleeveContext,
    tradeoffs: input.tradeoffs,
    contribution: input.contribution,
    availableActions: input.availableActions,
    preferredAction: input.preferredAction,
    rationale: input.rationale,
    structuralEvidence: input.structuralEvidence
  }));
}
