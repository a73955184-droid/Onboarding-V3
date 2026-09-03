import assert from 'node:assert/strict';

import {
  DECISION_SUPPORT_ACTIONS
} from '../src/domain/portfolio-decision-support/security-decision-support-contract.js';

import {
  resolveSecurityOptions
} from '../src/domain/portfolio-decision-support/security-option-resolver.js';


function item(code, values = []) {
  return {
    code,
    dimension: null,
    values,
    direction: null,
    explanation: code
  };
}


function tradeoffs({ benefits = [], costs = [] } = {}) {
  return {
    benefits,
    costs,
    whatChanges: [...benefits, ...costs],
    whatStaysSimilar: [],
    concentrationChanges: [],
    complexityChanges: []
  };
}


function replacementEvidence(candidateSecurityId, holdingSecurityId, {
  comparisonAvailable = true,
  replacementJustified = true
} = {}) {
  return {
    comparisonAvailable,
    replacementJustified,
    candidateSecurityId,
    holdingSecurityId,
    advantages: replacementJustified
      ? ['explicit-structural-advantage']
      : [],
    disadvantages: []
  };
}


const READY = { ready: true, subject: null, missingFields: [] };
const NOT_READY = {
  ready: false,
  subject: 'candidate',
  missingFields: [{ securityId: 'candidate', fields: ['factors'] }]
};
const ALIGNED = { aligned: true, conflicts: [] };
const CONFLICT = {
  aligned: false,
  conflicts: [{ code: 'complexity-not-permitted' }]
};


const overlapWithoutReplacementEvidence = resolveSecurityOptions({
  candidateSecurityId: 'itot',
  readiness: READY,
  sleeveBoundary: ALIGNED,
  tradeoffs: tradeoffs({
    costs: [item('adds-overlapping-holding', ['vti'])]
  })
});

assert.deepEqual(overlapWithoutReplacementEvidence.availableActions, [
  'keep-current',
  'save-alternative'
]);

const vtiHeldItotAssessed = resolveSecurityOptions({
  candidateSecurityId: 'itot',
  readiness: READY,
  sleeveBoundary: ALIGNED,
  tradeoffs: tradeoffs({
    costs: [item('adds-overlapping-holding', ['vti'])]
  }),
  targetSleeveHoldingIds: ['vti'],
  replacementEvidence: [replacementEvidence('itot', 'vti')]
});

assert.deepEqual(vtiHeldItotAssessed.availableActions, [
  'keep-current',
  'replace',
  'save-alternative'
]);


const vtiHeldVooAssessed = resolveSecurityOptions({
  candidateSecurityId: 'voo',
  readiness: READY,
  sleeveBoundary: { status: 'aligned' },
  tradeoffs: tradeoffs({
    benefits: [item('increases-market-cap-emphasis', ['large-cap'])],
    costs: [item('adds-overlapping-holding', ['vti'])]
  }),
  targetSleeveHoldingIds: ['vti'],
  replacementEvidence: [replacementEvidence('voo', 'vti')]
});

assert.deepEqual(vtiHeldVooAssessed.availableActions, [
  'keep-current',
  'add',
  'replace',
  'save-alternative'
]);


const boundaryConflict = resolveSecurityOptions({
  candidateSecurityId: 'arkk',
  readiness: READY,
  sleeveBoundary: CONFLICT,
  tradeoffs: tradeoffs({
    benefits: [item('adds-thematic-exposure', ['innovation'])]
  })
});

assert.deepEqual(boundaryConflict.availableActions, [
  'return',
  'save-alternative'
]);


const unavailable = resolveSecurityOptions({
  candidateSecurityId: 'candidate',
  readiness: NOT_READY,
  sleeveBoundary: CONFLICT,
  tradeoffs: tradeoffs()
});

assert.deepEqual(unavailable.availableActions, ['return']);


const distinctCandidate = resolveSecurityOptions({
  candidateSecurityId: 'qual',
  readiness: READY,
  sleeveBoundary: ALIGNED,
  tradeoffs: tradeoffs({
    benefits: [
      item('adds-distinct-permitted-role', ['quality-factor-equity'])
    ]
  })
});

assert.deepEqual(distinctCandidate.availableActions, [
  'keep-current',
  'add',
  'save-alternative'
]);


const sameSecurityAlreadyHeld = resolveSecurityOptions({
  candidateSecurityId: 'VTI',
  readiness: READY,
  sleeveBoundary: ALIGNED,
  tradeoffs: tradeoffs({
    costs: [item('adds-overlapping-holding', ['vti'])]
  })
});

assert.deepEqual(sameSecurityAlreadyHeld.availableActions, [
  'keep-current',
  'save-alternative'
]);


const lowerComplexityAlternative = resolveSecurityOptions({
  candidateSecurityId: 'candidate',
  readiness: READY,
  sleeveBoundary: ALIGNED,
  tradeoffs: tradeoffs({
    benefits: [item('lower-complexity', ['low', 'moderate'])],
    costs: [item('adds-overlapping-holding', ['existing'])]
  }),
  targetSleeveHoldingIds: ['existing'],
  replacementEvidence: [
    replacementEvidence('candidate', 'existing')
  ]
});

assert.deepEqual(lowerComplexityAlternative.availableActions, [
  'keep-current',
  'replace',
  'save-alternative'
]);


const crossSleeveConflict = resolveSecurityOptions({
  candidateSecurityId: 'vnq',
  readiness: READY,
  sleeveBoundary: ALIGNED,
  tradeoffs: tradeoffs({
    benefits: [item('adds-sector-exposure', ['real-estate'])],
    costs: [item('duplicates-role-across-sleeves', ['gld'])]
  })
});

assert.deepEqual(crossSleeveConflict.availableActions, [
  'return',
  'save-alternative'
]);


for (const result of [
  vtiHeldItotAssessed,
  overlapWithoutReplacementEvidence,
  vtiHeldVooAssessed,
  boundaryConflict,
  unavailable,
  distinctCandidate,
  sameSecurityAlreadyHeld,
  lowerComplexityAlternative,
  crossSleeveConflict
]) {
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.availableActions), true);
  assert.equal('preferredAction' in result, false);
  assert.equal('outcome' in result, false);

  for (const action of result.availableActions) {
    assert.equal(
      Object.values(DECISION_SUPPORT_ACTIONS).includes(action),
      true
    );
  }
}

assert.throws(
  () => resolveSecurityOptions({
    candidateSecurityId: 'vti',
    readiness: READY,
    sleeveBoundary: { aligned: true, status: 'conflict' },
    tradeoffs: tradeoffs()
  }),
  /aligned and status values must agree/
);

assert.throws(
  () => resolveSecurityOptions({
    candidateSecurityId: 'vti',
    readiness: READY,
    sleeveBoundary: ALIGNED,
    tradeoffs: tradeoffs({
      costs: [item('adds-overlapping-holding', ['vti'])]
    }),
    targetSleeveHoldingIds: ['vti'],
    replacementEvidence: [replacementEvidence('vti', 'vti')]
  }),
  /cannot name the candidate as its target/
);

assert.throws(
  () => resolveSecurityOptions({
    candidateSecurityId: 'itot',
    readiness: READY,
    sleeveBoundary: ALIGNED,
    tradeoffs: tradeoffs({
      costs: [item('adds-overlapping-holding', ['vti'])]
    }),
    targetSleeveHoldingIds: ['voo'],
    replacementEvidence: [replacementEvidence('itot', 'vti')]
  }),
  /must be present in the target sleeve/
);

const unsupportedReplacement = resolveSecurityOptions({
  candidateSecurityId: 'itot',
  readiness: READY,
  sleeveBoundary: ALIGNED,
  tradeoffs: tradeoffs({
    costs: [item('adds-overlapping-holding', ['vti'])]
  }),
  targetSleeveHoldingIds: ['vti'],
  replacementEvidence: [replacementEvidence('itot', 'vti', {
    replacementJustified: false
  })]
});

assert.deepEqual(unsupportedReplacement.availableActions, [
  'keep-current',
  'save-alternative'
]);

console.log(
  'Security option resolver test passed: readiness, boundaries and structural tradeoffs constrain valid actions without selecting a preference.'
);
