import assert from 'node:assert/strict';

import {
  presentSecurityDecisionSupport
} from '../src/domain/portfolio-decision-support/security-decision-support-presenter.js';
import {
  createUnavailableSecurityDecisionSupport,
  resolveSecurityDecisionSupport
} from '../src/domain/portfolio-decision-support/security-decision-support-resolver.js';


function assess(overrides = {}) {
  return resolveSecurityDecisionSupport({
    portfolioSystemId: 'ES-intentional',
    variantId: 'intentional',
    targetSleeveId: 'usCore',
    candidateSecurityId: 'voo',
    holdingsBySleeve: { usCore: ['vti'] },
    ...overrides
  });
}


function section(presentation, id) {
  return presentation.sections.find((candidate) => candidate.id === id);
}


const vooAssessment = assess();
const evidenceBeforePresentation = JSON.stringify(
  vooAssessment.structuralEvidence
);
const voo = presentSecurityDecisionSupport({
  decisionSupport: vooAssessment
});

assert.equal(voo.status, 'complete');
assert.equal(voo.heading, 'How this changes your sleeve');
assert.equal(voo.context, 'VOO for US Core');
assert.deepEqual(
  voo.sections.map(({ label }) => label),
  [
    'What you already have',
    'What this adds',
    'Where they overlap',
    'How your mix would change',
    'Tradeoffs',
    'Best default',
    'Other valid options',
    'See assessment details'
  ]
);
assert.equal(
  section(voo, 'what-you-already-have').items.some(
    (item) => item.includes('VTI')
  ),
  true
);
assert.equal(
  section(voo, 'what-this-adds').items.some(
    (item) => item.includes('large U.S. companies')
  ),
  true
);
assert.equal(
  section(voo, 'how-your-mix-would-change').items.some(
    (item) => item.includes('mid-sized and small companies')
  ),
  true
);
assert.deepEqual(section(voo, 'tradeoffs').items, [
  'Adds another holding with much of the same exposure.'
]);
assert.equal(
  section(voo, 'best-default').action.action,
  'keep-current'
);
assert.equal(section(voo, 'best-default').action.label, 'Keep VTI');
assert.equal(section(voo, 'best-default').emphasis, 'preferred');
assert.equal(section(voo, 'best-default').reasonLabel, 'Why');
assert.equal(section(voo, 'best-default').action.style, 'primary');
assert.deepEqual(
  section(voo, 'other-valid-choices').actions.map(({ action }) => action),
  ['add', 'save-alternative']
);
assert.equal(
  section(voo, 'other-valid-choices').actions[0].label,
  'Add VOO'
);
assert.equal(
  section(voo, 'other-valid-choices').actions[1].label,
  'Keep VOO as an alternative'
);
assert.equal(
  section(voo, 'other-valid-choices').actions[0].style,
  'secondary'
);
assert.equal(
  section(voo, 'assessment-details').optional,
  true
);
assert.equal(
  section(voo, 'assessment-details').fields.some(
    ({ label, value }) =>
      label === 'Evidence considered' &&
      value.includes('investment approach')
  ),
  true
);


const primaryPresentation = JSON.stringify(voo.sections.slice(0, -1));
for (const internalLabel of [
  'strategyType',
  'breadth classification',
  'thesis monitoring',
  'sameCategoryRole',
  'overlapDimensions'
]) {
  assert.equal(primaryPresentation.includes(internalLabel), false);
}

for (const prohibitedClaim of [
  /\bbuy\b/i,
  /\bsell\b/i,
  /guarantee/i,
  /forecast/i,
  /will outperform/i
]) {
  assert.doesNotMatch(JSON.stringify(voo), prohibitedClaim);
}

assert.equal(
  JSON.stringify(vooAssessment.structuralEvidence),
  evidenceBeforePresentation
);
assert.equal(Object.isFrozen(voo), true);
assert.equal(Object.isFrozen(voo.sections), true);
assert.equal(Object.isFrozen(voo.sections[0].items), true);


const itot = presentSecurityDecisionSupport({
  decisionSupport: assess({ candidateSecurityId: 'itot' })
});

assert.equal(
  section(itot, 'what-this-adds').items[0],
  'This does not add a meaningful difference to the sleeve.'
);
assert.deepEqual(
  section(itot, 'other-valid-choices').actions.map(({ action }) => action),
  ['save-alternative']
);
assert.deepEqual(
  section(itot, 'how-your-mix-would-change').items,
  ['The sleeve’s overall mix would remain substantially the same.']
);


const replacementAssessment = assess({
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  targetSleeveId: 'stability',
  candidateSecurityId: 'bnd',
  holdingsBySleeve: { stability: ['lqd'] }
});
const replacement = presentSecurityDecisionSupport({
  decisionSupport: replacementAssessment
});

assert.equal(
  section(replacement, 'best-default').action.action,
  'replace'
);
assert.equal(
  section(replacement, 'best-default').action.label,
  'Use BND instead of LQD'
);
assert.equal(
  section(replacement, 'best-default').action.targetSecurityId,
  'lqd'
);
assert.equal(
  section(replacement, 'best-default').action.requiresTargetSelection,
  false
);


const multipleReplacementTargets = structuredClone(
  replacementAssessment
);
multipleReplacementTargets.structuralEvidence.replacement.push({
  ...structuredClone(
    replacementAssessment.structuralEvidence.replacement[0]
  ),
  holdingSecurityId: 'agg',
  replacementJustified: true
});
const ambiguousReplacement = presentSecurityDecisionSupport({
  decisionSupport: multipleReplacementTargets
});

assert.equal(
  section(ambiguousReplacement, 'best-default').action.label,
  'Replace an existing holding with BND'
);
assert.doesNotMatch(
  section(ambiguousReplacement, 'best-default').action.label,
  /LQD|AGG/
);
assert.equal(
  section(ambiguousReplacement, 'best-default').action.targetSecurityId,
  null
);
assert.equal(
  section(ambiguousReplacement, 'best-default').action
    .requiresTargetSelection,
  true
);


const missingReplacementTarget = structuredClone(
  replacementAssessment
);
missingReplacementTarget.structuralEvidence.replacement = [];

assert.throws(
  () => presentSecurityDecisionSupport({
    decisionSupport: missingReplacementTarget
  }),
  /requires justified replacement evidence/
);


const crossSleeveConflict = presentSecurityDecisionSupport({
  decisionSupport: assess({
    portfolioSystemId: 'TO-intentional',
    variantId: 'intentional',
    targetSleeveId: 'stabilityReserve',
    candidateSecurityId: 'sgov',
    holdingsBySleeve: { liquidity: ['bil'] }
  })
});

assert.equal(
  section(crossSleeveConflict, 'what-you-already-have').items.some(
    (item) => item.includes('BIL') && item.includes('elsewhere')
  ),
  true
);
assert.equal(
  section(crossSleeveConflict, 'tradeoffs').items.some(
    (item) => item.includes('another sleeve')
  ),
  true
);
assert.equal(
  section(crossSleeveConflict, 'best-default').action.action,
  'return'
);
assert.equal(
  section(crossSleeveConflict, 'best-default').action.label,
  'Do not add SGOV to this sleeve'
);
assert.deepEqual(
  section(crossSleeveConflict, 'other-valid-choices').actions.map(
    ({ action, label }) => ({ action, label })
  ),
  [{
    action: 'save-alternative',
    label: 'Keep SGOV as an alternative'
  }]
);


const unavailable = presentSecurityDecisionSupport({
  decisionSupport: assess({
    candidateSecurityId: 'not-a-security',
    holdingsBySleeve: {}
  })
});

assert.deepEqual(unavailable, {
  status: 'unavailable',
  heading: 'Assessment unavailable',
  context: null,
  message: 'This investment does not have a verified catalogue record.',
  sections: [],
  actions: [{
    action: 'return',
    label: 'Return to available choices',
    description: 'Review another investment or sleeve.'
  }]
});

const runtimeFailure = createUnavailableSecurityDecisionSupport();
const runtimeFailurePresentation = presentSecurityDecisionSupport({
  decisionSupport: runtimeFailure
});

assert.equal(runtimeFailure.assessmentStatus, 'unavailable');
assert.equal(runtimeFailurePresentation.status, 'unavailable');
assert.equal(
  runtimeFailurePresentation.message,
  'Something interrupted this comparison. Return to the available choices and try again.'
);


assert.throws(
  () => presentSecurityDecisionSupport(),
  /decisionSupport must be an object/
);


console.log(
  'Security decision-support presenter test passed: ordered novice-facing sections preserve evidence, choices and the portfolio-system default without primary ontology jargon.'
);
