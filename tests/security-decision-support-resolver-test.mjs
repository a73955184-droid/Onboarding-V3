import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  SECURITY_DECISION_SUPPORT_RESULT_KEYS
} from '../src/domain/portfolio-decision-support/security-decision-support-contract.js';
import {
  createUnavailableSecurityDecisionSupport,
  resolveSecurityDecisionSupport
} from '../src/domain/portfolio-decision-support/security-decision-support-resolver.js';
import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';


const broadUsContext = {
  portfolioSystemId: 'ES-intentional',
  variantId: 'intentional',
  targetSleeveId: 'usCore',
  holdingsBySleeve: { usCore: ['vti'] }
};


const vtiItot = resolveSecurityDecisionSupport({
  ...broadUsContext,
  candidateSecurityId: 'itot'
});
const vtiVoo = resolveSecurityDecisionSupport({
  ...broadUsContext,
  candidateSecurityId: 'voo'
});

assert.equal(vtiItot.assessmentStatus, 'complete');
assert.equal(vtiVoo.assessmentStatus, 'complete');
assert.equal(vtiItot.contribution.level, 'no-meaningful-addition');
assert.equal(vtiVoo.contribution.level, 'incremental');
assert.deepEqual(vtiItot.availableActions, [
  'keep-current',
  'save-alternative'
]);
assert.deepEqual(vtiVoo.availableActions, [
  'keep-current',
  'add',
  'save-alternative'
]);
assert.equal(vtiItot.preferredAction, 'keep-current');
assert.equal(vtiVoo.preferredAction, 'keep-current');
assert.deepEqual(vtiItot.tradeoffs.increasedEmphasis, []);
assert.deepEqual(
  vtiVoo.tradeoffs.increasedEmphasis[0].values,
  ['large-cap']
);
assert.deepEqual(
  vtiVoo.tradeoffs.reducedRelativeEmphasis[0].values,
  ['mid-cap', 'small-cap']
);
assert.notDeepEqual(vtiItot, vtiVoo);


const missingRole = resolveSecurityDecisionSupport({
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  targetSleeveId: 'smallValueImprovement',
  candidateSecurityId: 'avuv',
  holdingsBySleeve: {}
});

assert.equal(missingRole.contribution.level, 'distinct');
assert.equal(missingRole.preferredAction, 'add');
assert.equal(missingRole.availableActions.includes('add'), true);


const replacement = resolveSecurityDecisionSupport({
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  targetSleeveId: 'stability',
  candidateSecurityId: 'bnd',
  holdingsBySleeve: { stability: ['lqd'] }
});

assert.equal(replacement.preferredAction, 'replace');
assert.equal(replacement.availableActions.includes('replace'), true);
assert.equal(
  replacement.structuralEvidence.replacement.some(
    ({ holdingSecurityId, replacementJustified, advantages }) =>
      holdingSecurityId === 'lqd' &&
      replacementJustified &&
      advantages.includes('lower-complexity')
  ),
  true
);


const boundaryConflict = resolveSecurityDecisionSupport({
  portfolioSystemId: 'GD-intentional',
  variantId: 'intentional',
  targetSleeveId: 'inflationResilience',
  candidateSecurityId: 'pave',
  holdingsBySleeve: {}
});

assert.equal(boundaryConflict.assessmentStatus, 'complete');
assert.equal(boundaryConflict.contribution.level, 'conflicting');
assert.deepEqual(boundaryConflict.availableActions, [
  'return',
  'save-alternative'
]);
assert.equal(boundaryConflict.preferredAction, 'return');


const crossSleeveConflict = resolveSecurityDecisionSupport({
  portfolioSystemId: 'TO-intentional',
  variantId: 'intentional',
  targetSleeveId: 'stabilityReserve',
  candidateSecurityId: 'sgov',
  holdingsBySleeve: { liquidity: ['bil'] }
});

assert.equal(crossSleeveConflict.contribution.level, 'conflicting');
assert.deepEqual(crossSleeveConflict.availableActions, [
  'return',
  'save-alternative'
]);
assert.equal(
  crossSleeveConflict.structuralEvidence.overlap.interpretation
    .interpretation,
  'cross-sleeve-conflicting'
);


const unknown = resolveSecurityDecisionSupport({
  portfolioSystemId: 'ES-intentional',
  variantId: 'intentional',
  targetSleeveId: 'usCore',
  candidateSecurityId: 'not-a-security',
  holdingsBySleeve: {}
});
const unresolvedEligibility = resolveSecurityDecisionSupport({
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  targetSleeveId: 'smallValueImprovement',
  candidateSecurityId: 'vti',
  holdingsBySleeve: {}
});

assert.equal(unknown.assessmentStatus, 'unavailable');
assert.equal(unknown.preferredAction, null);
assert.deepEqual(unknown.availableActions, ['return']);
assert.deepEqual(unknown.rationale.reasonCodes, ['unknown-security']);
assert.equal(unresolvedEligibility.assessmentStatus, 'unavailable');
assert.deepEqual(
  unresolvedEligibility.rationale.reasonCodes,
  ['exact-eligibility-unavailable']
);
assert.equal(
  unresolvedEligibility.structuralEvidence.sleeveAlignment,
  null
);

const runtimeFailure = createUnavailableSecurityDecisionSupport();

assert.equal(runtimeFailure.assessmentStatus, 'unavailable');
assert.deepEqual(
  runtimeFailure.rationale.reasonCodes,
  ['assessment-runtime-error']
);
assert.deepEqual(
  Object.keys(runtimeFailure),
  SECURITY_DECISION_SUPPORT_RESULT_KEYS
);


for (const result of [
  vtiItot,
  vtiVoo,
  missingRole,
  replacement,
  boundaryConflict,
  crossSleeveConflict,
  unknown,
  unresolvedEligibility,
  runtimeFailure
]) {
  assert.deepEqual(Object.keys(result), SECURITY_DECISION_SUPPORT_RESULT_KEYS);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.structuralEvidence), true);
  assert.equal('outcome' in result, false);
  assert.equal('allocationBefore' in result, false);
  assert.equal('allocationAfter' in result, false);

  if (result.preferredAction !== null) {
    assert.equal(
      result.availableActions.includes(result.preferredAction),
      true
    );
  }
}


// The compatibility resolver remains callable and retains its Phase 2 shape.
const phase2Compatibility = resolveSecurityPortfolioFit({
  ...broadUsContext,
  candidateSecurityId: 'itot'
});

assert.equal(phase2Compatibility.assessmentStatus, 'complete');
assert.equal(phase2Compatibility.outcome, 'redundant');
assert.equal('preferredAction' in phase2Compatibility, false);


const source = readFileSync(
  new URL(
    '../src/domain/portfolio-decision-support/security-decision-support-resolver.js',
    import.meta.url
  ),
  'utf8'
);

assert.doesNotMatch(
  source,
  /resolveSecurityPortfolioFit|resolveSleeveSecurityFit/
);


console.log(
  'Security decision-support resolver test passed: Phase 2 evidence composes into actions and a preferred default, with distinct VTI/ITOT and VTI/VOO results.'
);
