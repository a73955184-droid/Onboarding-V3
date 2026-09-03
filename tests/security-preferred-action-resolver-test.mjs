import assert from 'node:assert/strict';

import {
  resolveSecurityPreferredAction
} from '../src/domain/portfolio-decision-support/security-preferred-action-resolver.js';


function item(code, values = []) {
  return {
    code,
    dimension: null,
    values,
    direction: null,
    explanation: code
  };
}


function tradeoffs({
  benefits = [],
  costs = [],
  whatStaysSimilar = [],
  concentrationChanges = [],
  complexityChanges = []
} = {}) {
  return {
    benefits,
    costs,
    whatChanges: [
      ...benefits,
      ...costs,
      ...concentrationChanges,
      ...complexityChanges
    ],
    whatStaysSimilar,
    concentrationChanges,
    complexityChanges
  };
}


function resolve(overrides = {}) {
  return resolveSecurityPreferredAction({
    tradeoffs: tradeoffs(),
    incrementalContribution: 'none',
    complexityEffect: {
      direction: 'unchanged',
      candidateLevel: 'low',
      existingLevels: ['low']
    },
    sleeveMandate: {
      job: 'primary-strategic-foundation',
      returnRole: 'primary-growth'
    },
    availableActions: ['keep-current', 'save-alternative'],
    ...overrides
  });
}


const vtiHeldVooAssessed = resolve({
  tradeoffs: tradeoffs({
    benefits: [
      item('increases-market-cap-emphasis', ['large-cap'])
    ],
    costs: [
      item('adds-overlapping-holding', ['vti']),
      item('reduces-relative-market-cap-emphasis', [
        'mid-cap',
        'small-cap'
      ])
    ],
    whatStaysSimilar: [
      item('retains-shared-structural-exposure', [
        'assetClasses',
        'geographies',
        'strategyType'
      ])
    ]
  }),
  incrementalContribution: 'moderate',
  availableActions: [
    'keep-current',
    'add',
    'replace',
    'save-alternative'
  ]
});

assert.deepEqual(vtiHeldVooAssessed, {
  preferredAction: 'keep-current',
  confidence: 'high',
  reasonCodes: [
    'existing-exposure-overlap',
    'existing-structural-exposure-remains-shared',
    'incremental-change-is-targeted-emphasis',
    'avoids-additional-overlapping-holding'
  ]
});
assert.equal(
  ['keep-current', 'add', 'replace', 'save-alternative']
    .includes(vtiHeldVooAssessed.preferredAction),
  true
);


const nearInterchangeable = resolve({
  tradeoffs: tradeoffs({
    costs: [item('adds-overlapping-holding', ['vti'])],
    whatStaysSimilar: [
      item('retains-shared-structural-exposure', [
        'assetClasses',
        'geographies',
        'marketCaps',
        'strategyType'
      ])
    ]
  }),
  availableActions: [
    'keep-current',
    'replace',
    'save-alternative'
  ]
});

assert.equal(nearInterchangeable.preferredAction, 'keep-current');
assert.equal(nearInterchangeable.confidence, 'high');
assert.equal(
  nearInterchangeable.reasonCodes.includes(
    'no-meaningful-incremental-contribution'
  ),
  true
);


const missingFactorRole = resolve({
  tradeoffs: tradeoffs({
    benefits: [
      item('adds-distinct-permitted-role', ['quality-factor-equity']),
      item('adds-factor-exposure', ['quality'])
    ]
  }),
  incrementalContribution: 'substantial',
  sleeveMandate: {
    job: 'factor-improvement',
    returnRole: 'supporting-growth'
  },
  availableActions: ['keep-current', 'add', 'save-alternative']
});

assert.deepEqual(missingFactorRole, {
  preferredAction: 'add',
  confidence: 'high',
  reasonCodes: [
    'fills-distinct-permitted-role',
    'substantial-incremental-contribution'
  ]
});


const supportedLowerComplexityReplacement = resolve({
  tradeoffs: tradeoffs({
    benefits: [item('lower-complexity', ['low', 'moderate'])],
    costs: [item('adds-overlapping-holding', ['existing'])],
    complexityChanges: [
      item('lower-complexity', ['low', 'moderate'])
    ]
  }),
  incrementalContribution: 'limited',
  complexityEffect: {
    direction: 'lower',
    candidateLevel: 'low',
    existingLevels: ['moderate']
  },
  availableActions: [
    'keep-current',
    'replace',
    'save-alternative'
  ]
});

assert.deepEqual(supportedLowerComplexityReplacement, {
  preferredAction: 'replace',
  confidence: 'high',
  reasonCodes: [
    'explicit-replacement-option-available',
    'lower-complexity-implementation'
  ]
});


const tacticalTilt = resolve({
  tradeoffs: tradeoffs({
    benefits: [item('adds-sector-exposure', ['technology'])],
    costs: [item('adds-overlapping-holding', ['vti'])]
  }),
  incrementalContribution: 'moderate',
  sleeveMandate: {
    job: 'conditional-tactical-allocation',
    returnRole: 'conditional-return'
  },
  availableActions: ['keep-current', 'add', 'save-alternative']
});

assert.deepEqual(tacticalTilt, {
  preferredAction: 'add',
  confidence: 'medium',
  reasonCodes: [
    'meaningful-incremental-contribution',
    'sleeve-mandate-supports-targeted-contribution'
  ]
});


const constrained = resolve({
  incrementalContribution: 'moderate',
  availableActions: ['return', 'save-alternative']
});

assert.deepEqual(constrained, {
  preferredAction: 'return',
  confidence: 'high',
  reasonCodes: ['portfolio-system-constraint']
});


const unavailable = resolve({
  availableActions: ['return']
});

assert.deepEqual(unavailable, {
  preferredAction: 'return',
  confidence: 'high',
  reasonCodes: ['only-available-action']
});


for (const resolved of [
  vtiHeldVooAssessed,
  nearInterchangeable,
  missingFactorRole,
  supportedLowerComplexityReplacement,
  tacticalTilt,
  constrained,
  unavailable
]) {
  assert.equal(Object.isFrozen(resolved), true);
  assert.equal(Object.isFrozen(resolved.reasonCodes), true);
  assert.deepEqual(Object.keys(resolved), [
    'preferredAction',
    'confidence',
    'reasonCodes'
  ]);
  assert.equal('outcome' in resolved, false);
  assert.equal('availableActions' in resolved, false);
}


assert.throws(
  () => resolve({ availableActions: [] }),
  /non-empty array/
);

assert.throws(
  () => resolve({ availableActions: ['keep-current', 'buy'] }),
  /Unknown decision-support action/
);

assert.throws(
  () => resolve({ incrementalContribution: 'some' }),
  /incrementalContribution is not approved/
);

assert.throws(
  () => resolve({
    complexityEffect: {
      direction: 'cheaper',
      candidateLevel: 'low',
      existingLevels: ['moderate']
    }
  }),
  /complexityEffect.direction is not approved/
);

assert.throws(
  () => resolve({
    sleeveMandate: { job: '' }
  }),
  /sleeveMandate.job must be a non-empty string/
);

assert.throws(
  () => resolve({
    sleeveMandate: { job: 'whatever-fits' }
  }),
  /sleeveMandate.job is not approved/
);


console.log(
  'Security preferred-action resolver test passed: the best default is selected only from valid actions without removing user choice.'
);
