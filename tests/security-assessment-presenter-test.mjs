import assert from 'node:assert/strict';

import {
  presentSecurityAssessment
} from '../src/domain/portfolio-system/security-assessment-presenter.js';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';


const assessments = Object.freeze({
  add: resolveSecurityPortfolioFit({
    portfolioSystemId: 'ES-essential',
    variantId: 'essential',
    targetSleeveId: 'stability',
    candidateSecurityId: 'bnd',
    holdingsBySleeve: {}
  }),
  replace: resolveSecurityPortfolioFit({
    portfolioSystemId: 'ES-essential',
    variantId: 'essential',
    targetSleeveId: 'stability',
    candidateSecurityId: 'bnd',
    holdingsBySleeve: { stability: ['lqd'] }
  }),
  redundant: resolveSecurityPortfolioFit({
    portfolioSystemId: 'ES-intentional',
    variantId: 'intentional',
    targetSleeveId: 'usCore',
    candidateSecurityId: 'vti',
    holdingsBySleeve: { usCore: ['itot'] }
  }),
  'do-not-add': resolveSecurityPortfolioFit({
    portfolioSystemId: 'TO-intentional',
    variantId: 'intentional',
    targetSleeveId: 'stabilityReserve',
    candidateSecurityId: 'sgov',
    holdingsBySleeve: { liquidity: ['bil'] }
  })
});

const presentations = Object.fromEntries(
  Object.entries(assessments).map(([outcome, assessment]) => [
    outcome,
    presentSecurityAssessment({
      assessment,
      sleeveLabel: 'Selected'
    })
  ])
);


assert.deepEqual(
  presentations.add.factors.map(({ label }) => label),
  [
    'Role alignment',
    'Sleeve-rule alignment',
    'Missing role filled',
    'No conflicting overlap'
  ]
);
assert.equal(presentations.add.result.label, 'ADD');
assert.deepEqual(
  presentations.add.actions.map(({ action }) => action),
  ['add-result']
);
assert.equal(
  presentations.add.actions[0].label,
  'Add to hypothetical sleeve'
);

assert.deepEqual(
  presentations.replace.factors.map(({ label }) => label),
  [
    'Shared role',
    'Existing holding identified',
    "Candidate's structural advantage",
    'Replacement effect'
  ]
);
assert.equal(presentations.replace.result.label, 'REPLACE LQD');
assert.match(presentations.replace.factors[1].explanation, /LQD/);
assert.match(
  presentations.replace.factors[2].explanation,
  /lower complexity structural advantage/
);

const replacementPreview = presentSecurityAssessment({
  assessment: assessments.replace,
  sleeveLabel: 'Stability',
  replacementPreviewActive: true
});
assert.deepEqual(replacementPreview.replacementPreview, {
  heading: 'Replacement preview',
  remove: 'LQD',
  include: 'BND',
  sleeveLabel: 'Stability'
});
assert.deepEqual(
  replacementPreview.actions.map(({ action }) => action),
  ['confirm-replacement', 'cancel-replacement']
);

assert.deepEqual(
  presentations.redundant.factors.map(({ label }) => label),
  [
    'Shared role',
    'Overlap dimensions',
    'Existing holding identified',
    'No distinct contribution'
  ]
);
assert.equal(
  presentations.redundant.result.label,
  'REDUNDANT WITH ITOT'
);
assert.deepEqual(
  presentations.redundant.actions.map(({ action }) => action),
  ['save-alternative', 'return-browser']
);
assert.match(
  presentations.redundant.factors[1].explanation,
  /asset class.*geography.*market capitalization.*strategy type/
);

assert.deepEqual(
  presentations['do-not-add'].factors.map(({ label }) => label),
  [
    'Sleeve-rule assessment',
    'Conflicting candidate characteristic',
    'Cross-sleeve conflict',
    'Context for this result'
  ]
);
assert.equal(
  presentations['do-not-add'].result.label,
  'DO NOT ADD TO THIS SLEEVE'
);
assert.deepEqual(
  presentations['do-not-add'].actions.map(({ action }) => action),
  ['return-browser']
);
assert.match(
  presentations['do-not-add'].factors[2].explanation,
  /BIL.*Liquidity sleeve/
);
assert.match(
  presentations['do-not-add'].result.primaryReason,
  /^Within this selected sleeve,/
);

for (const presentation of Object.values(presentations)) {
  assert.equal(presentation.status, 'complete');
  assert.equal(Object.isFrozen(presentation), true);
  assert.ok(presentation.factors.length >= 4);

  for (const presentedFactor of presentation.factors) {
    assert.ok([
      'positive',
      'caution',
      'negative',
      'neutral'
    ].includes(presentedFactor.tone));
    assert.equal(typeof presentedFactor.explanation, 'string');
    assert.ok(presentedFactor.explanation.length > 0);
  }
}

const unavailable = presentSecurityAssessment({
  assessment: {
    assessmentStatus: 'unavailable',
    outcome: null
  },
  sleeveLabel: 'Selected'
});
assert.equal(unavailable.status, 'unavailable');
assert.equal('result' in unavailable, false);
assert.equal('factors' in unavailable, false);
assert.match(unavailable.allocationMessage, /No allocation change/);
assert.deepEqual(
  unavailable.actions.map(({ action }) => action),
  ['return-browser']
);

const unavailableWithStaleOutcome = presentSecurityAssessment({
  assessment: {
    assessmentStatus: 'unavailable',
    outcome: 'add'
  },
  sleeveLabel: 'Selected'
});
assert.equal(
  unavailableWithStaleOutcome.actions.some(
    ({ action }) => action === 'add-result'
  ),
  false
);

console.log(
  'Security assessment presenter test passed: all outcomes expose ordered evidence, results and controlled actions.'
);
