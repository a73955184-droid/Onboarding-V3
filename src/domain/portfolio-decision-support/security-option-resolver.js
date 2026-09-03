import {
  DECISION_SUPPORT_ACTIONS
} from './security-decision-support-contract.js';


const TRADEOFF_GROUPS = Object.freeze([
  'benefits',
  'costs',
  'whatChanges',
  'whatStaysSimilar',
  'concentrationChanges',
  'complexityChanges'
]);


const NON_ADDITIVE_BENEFIT_CODES = new Set([
  'lower-complexity'
]);


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


function validateReadiness(readiness) {
  assertPlainObject(readiness, 'readiness');

  if (typeof readiness.ready !== 'boolean') {
    throw new TypeError('readiness.ready must be a boolean');
  }
}


function boundaryIsAligned(sleeveBoundary) {
  assertPlainObject(sleeveBoundary, 'sleeveBoundary');

  if (typeof sleeveBoundary.aligned === 'boolean') {
    if (
      ['aligned', 'conflict'].includes(sleeveBoundary.status) &&
      sleeveBoundary.aligned !== (sleeveBoundary.status === 'aligned')
    ) {
      throw new TypeError(
        'sleeveBoundary aligned and status values must agree'
      );
    }

    return sleeveBoundary.aligned;
  }

  if (['aligned', 'conflict'].includes(sleeveBoundary.status)) {
    return sleeveBoundary.status === 'aligned';
  }

  throw new TypeError(
    'sleeveBoundary must expose aligned or an aligned/conflict status'
  );
}


function validateTradeoffs(tradeoffs) {
  assertPlainObject(tradeoffs, 'tradeoffs');

  for (const group of TRADEOFF_GROUPS) {
    if (!Array.isArray(tradeoffs[group])) {
      throw new TypeError(`tradeoffs.${group} must be an array`);
    }

    for (const tradeoff of tradeoffs[group]) {
      assertPlainObject(tradeoff, `tradeoffs.${group} entry`);

      if (typeof tradeoff.code !== 'string') {
        throw new TypeError(
          `tradeoffs.${group} entry code must be a string`
        );
      }

      if (!Array.isArray(tradeoff.values)) {
        throw new TypeError(
          `tradeoffs.${group} entry values must be an array`
        );
      }
    }
  }
}


function hasCrossSleeveConflict(tradeoffs) {
  return tradeoffs.costs.some(
    ({ code }) => code === 'duplicates-role-across-sleeves'
  );
}


function hasAdditiveBenefit(tradeoffs) {
  return tradeoffs.benefits.some(
    ({ code }) => !NON_ADDITIVE_BENEFIT_CODES.has(code)
  );
}


function resolveSupportedReplacementTargets({
  replacementEvidence,
  candidateSecurityId,
  targetSleeveHoldingIds
}) {
  const normalizedTargetHoldingIds = targetSleeveHoldingIds.map(
    (securityId) => {
      if (typeof securityId !== 'string') {
        throw new TypeError(
          'targetSleeveHoldingIds entries must be strings'
        );
      }

      return securityId.toLowerCase();
    }
  );
  const supportedTargets = [];

  for (const [index, evidence] of replacementEvidence.entries()) {
    assertPlainObject(evidence, `replacementEvidence[${index}]`);

    if (
      typeof evidence.comparisonAvailable !== 'boolean' ||
      typeof evidence.replacementJustified !== 'boolean' ||
      typeof evidence.candidateSecurityId !== 'string' ||
      typeof evidence.holdingSecurityId !== 'string'
    ) {
      throw new TypeError(
        'replacementEvidence entries must expose comparison availability, justification, candidate, and holding IDs'
      );
    }

    const evidenceCandidateId =
      evidence.candidateSecurityId.toLowerCase();
    const holdingSecurityId =
      evidence.holdingSecurityId.toLowerCase();

    if (evidenceCandidateId !== candidateSecurityId) {
      throw new TypeError(
        'replacementEvidence must describe the assessed candidate'
      );
    }

    if (evidence.replacementJustified && !evidence.comparisonAvailable) {
      throw new TypeError(
        'Unavailable replacement comparisons cannot justify replacement'
      );
    }

    if (!evidence.replacementJustified) {
      continue;
    }

    if (holdingSecurityId === candidateSecurityId) {
      throw new TypeError(
        'Replacement evidence cannot name the candidate as its target'
      );
    }

    if (!normalizedTargetHoldingIds.includes(holdingSecurityId)) {
      throw new TypeError(
        'Replacement target must be present in the target sleeve'
      );
    }

    supportedTargets.push(holdingSecurityId);
  }

  return [...new Set(supportedTargets)];
}


/**
 * Resolves only which user actions remain valid. Preference and ranking are
 * deliberately outside this module.
 */
export function resolveSecurityOptions({
  candidateSecurityId = null,
  readiness,
  sleeveBoundary,
  tradeoffs,
  targetSleeveHoldingIds = [],
  replacementEvidence = []
} = {}) {
  if (
    candidateSecurityId !== null &&
    typeof candidateSecurityId !== 'string'
  ) {
    throw new TypeError('candidateSecurityId must be a string or null');
  }

  validateReadiness(readiness);
  const boundaryAligned = boundaryIsAligned(sleeveBoundary);
  validateTradeoffs(tradeoffs);

  if (!Array.isArray(replacementEvidence)) {
    throw new TypeError('replacementEvidence must be an array');
  }

  if (!Array.isArray(targetSleeveHoldingIds)) {
    throw new TypeError('targetSleeveHoldingIds must be an array');
  }

  const normalizedCandidateSecurityId =
    typeof candidateSecurityId === 'string'
      ? candidateSecurityId.toLowerCase()
      : null;

  if (
    replacementEvidence.length > 0 &&
    normalizedCandidateSecurityId === null
  ) {
    throw new TypeError(
      'candidateSecurityId is required with replacementEvidence'
    );
  }

  if (!readiness.ready) {
    return Object.freeze({
      availableActions: Object.freeze([
        DECISION_SUPPORT_ACTIONS.RETURN
      ])
    });
  }

  if (!boundaryAligned || hasCrossSleeveConflict(tradeoffs)) {
    return Object.freeze({
      availableActions: Object.freeze([
        DECISION_SUPPORT_ACTIONS.RETURN,
        DECISION_SUPPORT_ACTIONS.SAVE_ALTERNATIVE
      ])
    });
  }

  const availableActions = [
    DECISION_SUPPORT_ACTIONS.KEEP_CURRENT
  ];

  if (hasAdditiveBenefit(tradeoffs)) {
    availableActions.push(DECISION_SUPPORT_ACTIONS.ADD);
  }

  if (
    resolveSupportedReplacementTargets({
      replacementEvidence,
      candidateSecurityId: normalizedCandidateSecurityId,
      targetSleeveHoldingIds
    }).length > 0
  ) {
    availableActions.push(DECISION_SUPPORT_ACTIONS.REPLACE);
  }

  availableActions.push(DECISION_SUPPORT_ACTIONS.SAVE_ALTERNATIVE);

  return Object.freeze({
    availableActions: Object.freeze(availableActions)
  });
}
