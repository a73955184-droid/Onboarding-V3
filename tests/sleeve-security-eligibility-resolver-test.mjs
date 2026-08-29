import assert from 'node:assert/strict';

import {
  CONSTITUENT_PORTFOLIOS
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  getSecurityCategory
} from '../src/domain/portfolio-system/security-category-universe.js';

import {
  resolveEligibleSecurities
} from '../src/domain/portfolio-system/sleeve-security-eligibility-resolver.js';


const portfolios = Object.values(CONSTITUENT_PORTFOLIOS)
  .flatMap((variants) => Object.values(variants));

let sleeveCount = 0;

for (const portfolio of portfolios) {
  for (const sleeve of portfolio.sleeves) {
    sleeveCount += 1;

    const result = resolveEligibleSecurities({
      portfolioSystemId: portfolio.id,
      variantId: portfolio.variantId,
      sleeveId: sleeve.id
    });

    assert.deepEqual(
      result.categories.map(({ categoryId }) => categoryId),
      sleeve.assetCategories
    );

    for (const category of result.categories) {
      assert.deepEqual(
        category.securityIds,
        getSecurityCategory(category.categoryId).securityIds
      );
      assert.ok(
        category.securities.every(
          ({ automaticallyHeld }) =>
            automaticallyHeld === false
        )
      );
    }
  }
}

assert.equal(portfolios.length, 21);
assert.equal(sleeveCount, 107);

assert.deepEqual(
  resolveEligibleSecurities({
    portfolioSystemId: 'FT-intentional',
    variantId: 'engaged',
    sleeveId: 'smallValueImprovement'
  }).categories,
  []
);

console.log(
  'Sleeve security eligibility resolver test passed: all 21 systems and 107 sleeves resolve exact browse lists.'
);

