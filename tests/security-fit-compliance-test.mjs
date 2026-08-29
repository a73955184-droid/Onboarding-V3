import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';


const results = [
  resolveSecurityPortfolioFit({
    portfolioSystemId: 'FT-intentional',
    variantId: 'intentional',
    targetSleeveId: 'smallValueImprovement',
    candidateSecurityId: 'vbr',
    holdingsBySleeve: {}
  }),
  resolveSecurityPortfolioFit({
    portfolioSystemId: 'FT-intentional',
    variantId: 'intentional',
    targetSleeveId: 'smallValueImprovement',
    candidateSecurityId: 'avuv',
    holdingsBySleeve: {}
  })
];

const prohibited = [
  /expected return/i,
  /outperform/i,
  /guaranteed/i,
  /current (volatility|correlation|yield|drawdown|valuation)/i,
  /personalized suitability/i,
  /\b(buy|sell)\b/i
];

for (const result of results) {
  const output = JSON.stringify(result);

  for (const pattern of prohibited) {
    assert.doesNotMatch(output, pattern);
  }

  if (result.assessmentStatus === 'complete') {
    assert.match(
      result.disclosure,
      /educational system-fit assessment/
    );
  } else {
    assert.equal(result.outcome, null);
    assert.equal('disclosure' in result, false);
  }
}

const portfolioMapSource = fs.readFileSync(
  new URL(
    '../src/features/recommendation/PortfolioMapScreen.js',
    import.meta.url
  ),
  'utf8'
);

assert.doesNotMatch(
  portfolioMapSource,
  /security-category-universe|security-portfolio-fit-resolver|sleeve-security-eligibility-resolver/
);

console.log(
  'Security fit compliance test passed: language is bounded and no UI integration exists.'
);
