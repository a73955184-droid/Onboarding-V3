import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  DECISION_SUPPORT_ACTIONS,
  DECISION_SUPPORT_ASSESSMENT_STATUSES,
  DECISION_SUPPORT_CONTRIBUTION_LEVELS,
  SECURITY_DECISION_SUPPORT_EVIDENCE_KEYS,
  SECURITY_DECISION_SUPPORT_RATIONALE_KEYS,
  SECURITY_DECISION_SUPPORT_RESULT_KEYS,
  SECURITY_DECISION_SUPPORT_TRADEOFF_KEYS,
  createSecurityDecisionSupportResult
} from '../src/domain/portfolio-decision-support/security-decision-support-contract.js';


assert.deepEqual(
  Object.values(DECISION_SUPPORT_ACTIONS),
  [
    'keep-current',
    'add',
    'replace',
    'save-alternative',
    'return'
  ]
);
assert.deepEqual(
  Object.values(DECISION_SUPPORT_CONTRIBUTION_LEVELS),
  [
    'distinct',
    'incremental',
    'mostly-overlapping',
    'no-meaningful-addition',
    'conflicting'
  ]
);
assert.deepEqual(
  Object.values(DECISION_SUPPORT_ASSESSMENT_STATUSES),
  ['complete', 'unavailable']
);


const input = {
  assessmentStatus: 'complete',
  candidate: {
    securityId: 'voo',
    ticker: 'VOO'
  },
  sleeveContext: {
    portfolioSystemId: 'ES-intentional',
    variantId: 'intentional',
    sleeveId: 'usCore'
  },
  tradeoffs: {
    sharedExposure: [{ dimension: 'geographies', values: ['united-states'] }],
    distinctExposure: [],
    increasedEmphasis: [{ dimension: 'marketCaps', value: 'large-cap' }],
    reducedRelativeEmphasis: [
      { dimension: 'marketCaps', values: ['mid-cap', 'small-cap'] }
    ],
    implementationChanges: [{ type: 'additional-holding' }]
  },
  contribution: {
    level: 'incremental',
    explanation: 'The candidate increases large-company emphasis.'
  },
  availableActions: ['keep-current', 'add', 'replace', 'save-alternative'],
  preferredAction: 'keep-current',
  rationale: {
    summary: 'Keep the current broad implementation by default.',
    reasonCodes: ['current-role-already-broad']
  },
  structuralEvidence: {
    eligibility: { status: 'eligible' },
    readiness: { ready: true },
    sleeveAlignment: { aligned: true },
    sleeveBoundary: { aligned: true },
    overlap: [{ securityId: 'vti', level: 'high' }],
    replacement: [{ securityId: 'vti', justified: false }]
  }
};

const result = createSecurityDecisionSupportResult(input);

assert.deepEqual(Object.keys(result), SECURITY_DECISION_SUPPORT_RESULT_KEYS);
assert.deepEqual(
  Object.keys(result.tradeoffs),
  SECURITY_DECISION_SUPPORT_TRADEOFF_KEYS
);
assert.deepEqual(
  Object.keys(result.rationale),
  SECURITY_DECISION_SUPPORT_RATIONALE_KEYS
);
assert.deepEqual(
  Object.keys(result.structuralEvidence),
  SECURITY_DECISION_SUPPORT_EVIDENCE_KEYS
);
assert.equal('outcome' in result, false);
assert.notEqual(result, input);
assert.notEqual(result.candidate, input.candidate);
assert.equal(Object.isFrozen(result), true);
assert.equal(Object.isFrozen(result.tradeoffs), true);
assert.equal(Object.isFrozen(result.tradeoffs.sharedExposure), true);
assert.equal(Object.isFrozen(result.tradeoffs.sharedExposure[0]), true);
assert.equal(Object.isFrozen(result.structuralEvidence.overlap), true);
assert.equal(Object.isFrozen(result.structuralEvidence.overlap[0]), true);

assert.throws(
  () => {
    result.availableActions.push('return');
  },
  TypeError
);
assert.throws(
  () => {
    result.candidate.ticker = 'CHANGED';
  },
  TypeError
);
assert.equal(input.candidate.ticker, 'VOO');


const unavailable = createSecurityDecisionSupportResult({
  assessmentStatus: 'unavailable',
  candidate: null,
  sleeveContext: null,
  tradeoffs: {
    sharedExposure: [],
    distinctExposure: [],
    increasedEmphasis: [],
    reducedRelativeEmphasis: [],
    implementationChanges: []
  },
  contribution: {
    level: null,
    explanation: 'Decision-relevant evidence is unresolved.'
  },
  availableActions: ['return'],
  preferredAction: null,
  rationale: {
    summary: 'No preferred action was determined.',
    reasonCodes: ['assessment-unavailable']
  },
  structuralEvidence: {
    eligibility: null,
    readiness: { ready: false },
    sleeveAlignment: null,
    sleeveBoundary: null,
    overlap: null,
    replacement: null
  }
});

assert.equal(unavailable.assessmentStatus, 'unavailable');
assert.equal(unavailable.preferredAction, null);
assert.equal(unavailable.contribution.level, null);


for (const contributionLevel of Object.values(
  DECISION_SUPPORT_CONTRIBUTION_LEVELS
)) {
  assert.doesNotThrow(() => createSecurityDecisionSupportResult({
    ...input,
    contribution: {
      level: contributionLevel,
      explanation: 'Contract vocabulary fixture.'
    }
  }));
}

assert.throws(
  () => createSecurityDecisionSupportResult({
    ...input,
    contribution: {
      level: 'somewhat-new',
      explanation: 'Invalid vocabulary fixture.'
    }
  }),
  /contribution\.level is not approved/
);
assert.throws(
  () => createSecurityDecisionSupportResult({
    ...input,
    availableActions: ['buy']
  }),
  /Unknown decision-support action/
);
assert.throws(
  () => createSecurityDecisionSupportResult({
    ...input,
    availableActions: ['add'],
    preferredAction: 'keep-current'
  }),
  /preferredAction must also appear/
);
assert.throws(
  () => createSecurityDecisionSupportResult({
    ...input,
    outcome: 'redundant'
  }),
  /unknown fields: outcome/
);
assert.throws(
  () => {
    const { replacement, ...incompleteEvidence } = input.structuralEvidence;
    return createSecurityDecisionSupportResult({
      ...input,
      structuralEvidence: incompleteEvidence
    });
  },
  /structuralEvidence is missing required fields: replacement/
);


const contractSource = readFileSync(
  new URL(
    '../src/domain/portfolio-decision-support/security-decision-support-contract.js',
    import.meta.url
  ),
  'utf8'
);

assert.doesNotMatch(
  contractSource,
  /security-portfolio-fit-resolver|sleeve-security-fit-rules|security-structural-overlap|security-replacement-comparison/
);

console.log(
  'Security decision-support contract test passed: shape, immutability and vocabularies are stable without fit logic.'
);
