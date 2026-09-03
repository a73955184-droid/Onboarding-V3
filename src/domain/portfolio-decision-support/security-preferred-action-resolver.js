import {
  DECISION_SUPPORT_ACTIONS
} from './security-decision-support-contract.js';
import {
  SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS
} from './security-overlap-interpretation.js';
import {
  SLEEVE_DECISION_PROFILE_VOCABULARY
} from '../portfolio-system/sleeve-decision-profiles.js';


/**
 * Selects the best default for the selected portfolio system from actions
 * that another resolver has already established are valid.
 *
 * This module does not determine eligibility, readiness, structural fit, or
 * action availability. In particular, it can never introduce an action that
 * is absent from availableActions.
 */

export const SECURITY_PREFERRED_ACTION_CONFIDENCES = Object.freeze({
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
});


const TRADEOFF_GROUPS = Object.freeze([
  'benefits',
  'costs',
  'whatChanges',
  'whatStaysSimilar',
  'concentrationChanges',
  'complexityChanges'
]);


const COMPLEXITY_DIRECTIONS = Object.freeze([
  'introduced',
  'unchanged',
  'higher',
  'lower',
  'mixed',
  'unresolved'
]);


const TARGETED_CONTRIBUTION_JOBS = new Set([
  'factor-improvement',
  'supplemental-growth',
  'conditional-tactical-allocation',
  'bounded-opportunity-research'
]);


const TARGETED_EMPHASIS_CODES = new Set([
  'increases-market-cap-emphasis',
  'adds-factor-exposure',
  'adds-sector-exposure',
  'adds-thematic-exposure'
]);


const ACTION_VALUES = Object.freeze(
  Object.values(DECISION_SUPPORT_ACTIONS)
);
const CONTRIBUTION_VALUES = Object.freeze(
  Object.values(SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS)
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


function validateTradeoffs(tradeoffs) {
  assertPlainObject(tradeoffs, 'tradeoffs');

  for (const group of TRADEOFF_GROUPS) {
    if (!Array.isArray(tradeoffs[group])) {
      throw new TypeError(`tradeoffs.${group} must be an array`);
    }

    for (const entry of tradeoffs[group]) {
      assertPlainObject(entry, `tradeoffs.${group} entry`);

      if (typeof entry.code !== 'string') {
        throw new TypeError(
          `tradeoffs.${group} entry code must be a string`
        );
      }
    }
  }
}


function validateComplexityEffect(complexityEffect) {
  assertPlainObject(complexityEffect, 'complexityEffect');

  if (!COMPLEXITY_DIRECTIONS.includes(complexityEffect.direction)) {
    throw new TypeError('complexityEffect.direction is not approved');
  }
}


function validateSleeveMandate(sleeveMandate) {
  assertPlainObject(sleeveMandate, 'sleeveMandate');

  if (
    typeof sleeveMandate.job !== 'string' ||
    sleeveMandate.job.length === 0
  ) {
    throw new TypeError('sleeveMandate.job must be a non-empty string');
  }

  if (!SLEEVE_DECISION_PROFILE_VOCABULARY.jobs.includes(
    sleeveMandate.job
  )) {
    throw new TypeError('sleeveMandate.job is not approved');
  }

  if (
    Object.hasOwn(sleeveMandate, 'returnRole') &&
    typeof sleeveMandate.returnRole !== 'string'
  ) {
    throw new TypeError('sleeveMandate.returnRole must be a string');
  }

  if (
    Object.hasOwn(sleeveMandate, 'returnRole') &&
    !SLEEVE_DECISION_PROFILE_VOCABULARY.returnRoles.includes(
      sleeveMandate.returnRole
    )
  ) {
    throw new TypeError('sleeveMandate.returnRole is not approved');
  }
}


function validateAvailableActions(availableActions) {
  if (!Array.isArray(availableActions) || availableActions.length === 0) {
    throw new TypeError('availableActions must be a non-empty array');
  }

  if (new Set(availableActions).size !== availableActions.length) {
    throw new TypeError('availableActions must not contain duplicates');
  }

  for (const action of availableActions) {
    if (!ACTION_VALUES.includes(action)) {
      throw new TypeError(`Unknown decision-support action: ${action}`);
    }
  }
}


function hasCode(entries, code) {
  return entries.some((entry) => entry.code === code);
}


function hasAnyCode(entries, codes) {
  return entries.some((entry) => codes.has(entry.code));
}


function result(preferredAction, confidence, reasonCodes) {
  return Object.freeze({
    preferredAction,
    confidence,
    reasonCodes: Object.freeze([...new Set(reasonCodes)])
  });
}


function keepCurrentReasons({
  tradeoffs,
  incrementalContribution,
  complexityEffect
}) {
  const reasons = [];

  if (
    incrementalContribution ===
    SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.NONE
  ) {
    reasons.push('no-meaningful-incremental-contribution');
  }

  if (hasCode(tradeoffs.costs, 'adds-overlapping-holding')) {
    reasons.push('existing-exposure-overlap');
  }

  if (
    hasCode(
      tradeoffs.whatStaysSimilar,
      'retains-shared-structural-exposure'
    )
  ) {
    reasons.push('existing-structural-exposure-remains-shared');
  }

  if (hasAnyCode(tradeoffs.benefits, TARGETED_EMPHASIS_CODES)) {
    reasons.push('incremental-change-is-targeted-emphasis');
  }

  if (hasCode(tradeoffs.costs, 'adds-overlapping-holding')) {
    reasons.push('avoids-additional-overlapping-holding');
  }

  if (complexityEffect.direction === 'higher') {
    reasons.push('avoids-higher-complexity');
  }

  return reasons.length > 0
    ? reasons
    : ['preserves-current-implementation'];
}


/**
 * Returns the best default for this portfolio system. Other entries in
 * availableActions remain valid choices and are not removed or reordered.
 */
export function resolveSecurityPreferredAction({
  tradeoffs,
  incrementalContribution,
  complexityEffect,
  sleeveMandate,
  availableActions
} = {}) {
  validateTradeoffs(tradeoffs);

  if (!CONTRIBUTION_VALUES.includes(incrementalContribution)) {
    throw new TypeError('incrementalContribution is not approved');
  }

  validateComplexityEffect(complexityEffect);
  validateSleeveMandate(sleeveMandate);
  validateAvailableActions(availableActions);

  const hasAction = (action) => availableActions.includes(action);

  if (availableActions.length === 1) {
    return result(
      availableActions[0],
      SECURITY_PREFERRED_ACTION_CONFIDENCES.HIGH,
      ['only-available-action']
    );
  }

  if (
    hasAction(DECISION_SUPPORT_ACTIONS.RETURN) &&
    !hasAction(DECISION_SUPPORT_ACTIONS.KEEP_CURRENT)
  ) {
    return result(
      DECISION_SUPPORT_ACTIONS.RETURN,
      SECURITY_PREFERRED_ACTION_CONFIDENCES.HIGH,
      ['portfolio-system-constraint']
    );
  }

  if (
    hasAction(DECISION_SUPPORT_ACTIONS.REPLACE) &&
    (
      complexityEffect.direction === 'lower' ||
      hasCode(tradeoffs.benefits, 'lower-complexity')
    )
  ) {
    return result(
      DECISION_SUPPORT_ACTIONS.REPLACE,
      SECURITY_PREFERRED_ACTION_CONFIDENCES.HIGH,
      [
        'explicit-replacement-option-available',
        'lower-complexity-implementation'
      ]
    );
  }

  const addsDistinctRole = hasCode(
    tradeoffs.benefits,
    'adds-distinct-permitted-role'
  );

  if (
    hasAction(DECISION_SUPPORT_ACTIONS.ADD) &&
    incrementalContribution ===
      SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.SUBSTANTIAL &&
    addsDistinctRole
  ) {
    return result(
      DECISION_SUPPORT_ACTIONS.ADD,
      SECURITY_PREFERRED_ACTION_CONFIDENCES.HIGH,
      [
        'fills-distinct-permitted-role',
        'substantial-incremental-contribution'
      ]
    );
  }

  if (
    hasAction(DECISION_SUPPORT_ACTIONS.ADD) &&
    TARGETED_CONTRIBUTION_JOBS.has(sleeveMandate.job) &&
    [
      SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.MODERATE,
      SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.SUBSTANTIAL
    ].includes(incrementalContribution)
  ) {
    return result(
      DECISION_SUPPORT_ACTIONS.ADD,
      SECURITY_PREFERRED_ACTION_CONFIDENCES.MEDIUM,
      [
        'meaningful-incremental-contribution',
        'sleeve-mandate-supports-targeted-contribution'
      ]
    );
  }

  if (hasAction(DECISION_SUPPORT_ACTIONS.KEEP_CURRENT)) {
    const clearKeepCurrentCase =
      incrementalContribution ===
        SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.NONE ||
      (
        hasCode(tradeoffs.costs, 'adds-overlapping-holding') &&
        (
          incrementalContribution ===
            SECURITY_INCREMENTAL_CONTRIBUTION_STRENGTHS.LIMITED ||
          hasAnyCode(tradeoffs.benefits, TARGETED_EMPHASIS_CODES)
        )
      );

    return result(
      DECISION_SUPPORT_ACTIONS.KEEP_CURRENT,
      clearKeepCurrentCase
        ? SECURITY_PREFERRED_ACTION_CONFIDENCES.HIGH
        : SECURITY_PREFERRED_ACTION_CONFIDENCES.MEDIUM,
      keepCurrentReasons({
        tradeoffs,
        incrementalContribution,
        complexityEffect
      })
    );
  }

  if (hasAction(DECISION_SUPPORT_ACTIONS.ADD)) {
    return result(
      DECISION_SUPPORT_ACTIONS.ADD,
      SECURITY_PREFERRED_ACTION_CONFIDENCES.MEDIUM,
      ['best-available-inclusion-action']
    );
  }

  if (hasAction(DECISION_SUPPORT_ACTIONS.REPLACE)) {
    return result(
      DECISION_SUPPORT_ACTIONS.REPLACE,
      SECURITY_PREFERRED_ACTION_CONFIDENCES.MEDIUM,
      ['explicit-replacement-option-available']
    );
  }

  return result(
    availableActions[0],
    SECURITY_PREFERRED_ACTION_CONFIDENCES.LOW,
    ['no-strong-default-among-available-actions']
  );
}
