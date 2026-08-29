export const INCOME_ROLES = Object.freeze([
  'none',
  'supporting',
  'primary'
]);

export const INFLATION_SENSITIVITIES = Object.freeze([
  'none',
  'indirect',
  'explicit'
]);

export const COMPLEXITY_LEVELS = Object.freeze([
  'low',
  'moderate',
  'high'
]);

export const ASSESSMENT_STATUSES = Object.freeze({
  COMPLETE: 'complete',
  UNAVAILABLE: 'unavailable'
});

export const ASSESSMENT_UNAVAILABLE_REASONS = Object.freeze({
  UNKNOWN_SECURITY: 'unknown-security',
  INCOMPLETE_SECURITY_PROFILE:
    'incomplete-security-profile',
  UNRESOLVED_SLEEVE: 'unresolved-sleeve',
  MISSING_HOLDINGS_PROFILE:
    'missing-holdings-profile'
});

export const SECURITY_FIT_OUTCOMES = Object.freeze({
  ADD: 'add',
  REPLACE: 'replace',
  REDUNDANT: 'redundant',
  DO_NOT_ADD: 'do-not-add'
});
