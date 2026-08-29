import assert from 'node:assert/strict';

import {
  CONSTITUENT_PORTFOLIOS
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from '../src/domain/portfolio-system/security-reference.js';

import {
  SECURITY_CATEGORY_IDS
} from '../src/domain/portfolio-system/security-category-universe.js';

import {
  SLEEVE_SECURITY_ELIGIBILITY,
  getExactSleeveSecurityEligibility
} from '../src/domain/portfolio-system/sleeve-security-eligibility.js';


const portfolios = Object.values(CONSTITUENT_PORTFOLIOS)
  .flatMap((variants) => Object.values(variants));

assert.equal(portfolios.length, 21);
assert.equal(
  portfolios.reduce(
    (total, portfolio) =>
      total + portfolio.sleeves.length,
    0
  ),
  107
);

assert.ok(SLEEVE_SECURITY_ELIGIBILITY.length > 0);

for (const record of SLEEVE_SECURITY_ELIGIBILITY) {
  const portfolio = portfolios.find(
    ({ id }) => id === record.portfolioSystemId
  );
  const sleeve = portfolio?.sleeves.find(
    ({ id }) => id === record.sleeveId
  );

  assert.ok(portfolio);
  assert.equal(portfolio.variantId, record.variantId);
  assert.ok(sleeve);
  assert.ok(sleeve.assetCategories.includes(record.categoryId));
  assert.ok(SECURITY_CATEGORY_IDS.includes(record.categoryId));
  assert.ok(PHASE_1_SECURITY_REFERENCE[record.securityId]);
  assert.equal(record.automaticallyHeld, false);
}

const exact = getExactSleeveSecurityEligibility({
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  sleeveId: 'smallValueImprovement',
  categoryId: 'small-value-equity',
  securityId: 'vbr'
});

assert.equal(exact.eligibilityStatus, 'eligible');

assert.equal(
  getExactSleeveSecurityEligibility({
    portfolioSystemId: 'FT-intentional',
    variantId: 'engaged',
    sleeveId: 'smallValueImprovement',
    categoryId: 'small-value-equity',
    securityId: 'vbr'
  }),
  null
);

console.log(
  'Sleeve security eligibility test passed: exact keys have no cross-variant fallback.'
);

