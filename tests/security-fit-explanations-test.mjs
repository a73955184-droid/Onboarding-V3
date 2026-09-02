import assert from 'node:assert/strict';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';


const cases = Object.freeze({
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


for (const [outcome, result] of Object.entries(cases)) {
  const explanation = result.explanation;

  assert.equal(result.outcome, outcome);
  assert.equal(explanation.systemFitOutcome, outcome);
  assert.equal(result.primaryExplanation, explanation.primaryReason);
  assert.equal(Object.isFrozen(explanation), true);

  for (const key of [
    'roleAlignment',
    'boundaryAlignment',
    'overlap',
    'distinctContribution'
  ]) {
    assert.equal(typeof explanation[key].label, 'string');
    assert.equal(typeof explanation[key].status, 'string');
    assert.equal(typeof explanation[key].explanation, 'string');
    assert.equal(Object.isFrozen(explanation[key]), true);
  }

  const userFacingText = Object.values(explanation)
    .filter((value) => typeof value === 'string')
    .concat(
      [
        explanation.roleAlignment,
        explanation.boundaryAlignment,
        explanation.overlap,
        explanation.distinctContribution
      ].map(({ explanation: text }) => text)
    )
    .join(' ');

  assert.match(
    userFacingText,
    /stability and resilience|primary strategic foundation/
  );
  assert.match(
    userFacingText,
    /category classification|strategy type|asset class|geography/
  );
  assert.doesNotMatch(
    userFacingText,
    /\b(buy|sell|guarantee(?:d)?|forecast|outperform)\b/i
  );
  assert.doesNotMatch(
    userFacingText,
    /stability-and-resilience|primary-strategic-foundation|assetClasses|geographies|strategyType|\[[^\]]*\]/
  );
}


assert.equal(cases.add.explanation.overlap.status, 'none');
assert.equal(
  cases.add.explanation.distinctContribution.status,
  'contributing'
);
assert.match(
  cases.add.explanation.primaryReason,
  /missing permitted role/
);

assert.equal(cases.replace.explanation.overlap.status, 'overlapping');
assert.match(cases.replace.explanation.overlap.explanation, /LQD/);
assert.match(
  cases.replace.explanation.distinctContribution.explanation,
  /lower complexity structural advantage/
);
assert.equal(cases.replace.affectedSecurityId, 'lqd');

assert.equal(cases.redundant.explanation.overlap.status, 'overlapping');
assert.match(cases.redundant.explanation.overlap.explanation, /ITOT/);
assert.match(
  cases.redundant.explanation.overlap.explanation,
  /asset class.*geography.*market capitalization.*strategy type/
);
assert.equal(
  cases.redundant.explanation.distinctContribution.status,
  'none'
);

assert.equal(
  cases['do-not-add'].explanation.overlap.status,
  'overlapping'
);
assert.match(
  cases['do-not-add'].explanation.overlap.explanation,
  /BIL.*Liquidity sleeve/
);
assert.match(
  cases['do-not-add'].explanation.primaryReason,
  /^Within this selected sleeve,/
);

console.log(
  'Security fit explanation test passed: all four outcomes translate resolver evidence into contextual, presentation-safe copy.'
);
