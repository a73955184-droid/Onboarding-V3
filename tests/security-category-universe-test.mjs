import assert from 'node:assert/strict';

import {
  CONSTITUENT_PORTFOLIOS
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  PHASE_1_APPROVED_SECURITY_IDS,
  SECURITY_CATEGORY_IDS,
  SECURITY_CATEGORY_UNIVERSE,
  getSecurityCategory
} from '../src/domain/portfolio-system/security-category-universe.js';


const productionCategoryIds = new Set(
  Object.values(CONSTITUENT_PORTFOLIOS)
    .flatMap((variants) => Object.values(variants))
    .flatMap((portfolio) => portfolio.sleeves)
    .flatMap((sleeve) => sleeve.assetCategories)
);

assert.equal(SECURITY_CATEGORY_UNIVERSE.length, 28);
assert.equal(new Set(SECURITY_CATEGORY_IDS).size, 28);
assert.deepEqual(
  new Set(SECURITY_CATEGORY_IDS),
  productionCategoryIds
);

assert.equal(PHASE_1_APPROVED_SECURITY_IDS.length, 261);
assert.equal(
  SECURITY_CATEGORY_UNIVERSE.reduce(
    (total, category) =>
      total + category.securityIds.length,
    0
  ),
  307
);

assert.ok(PHASE_1_APPROVED_SECURITY_IDS.includes('spym'));
assert.ok(PHASE_1_APPROVED_SECURITY_IDS.includes('arty'));
assert.ok(!PHASE_1_APPROVED_SECURITY_IDS.includes('splg'));
assert.ok(!PHASE_1_APPROVED_SECURITY_IDS.includes('irbo'));

assert.deepEqual(
  getSecurityCategory('small-value-equity').securityIds,
  [
    'avuv', 'vbr', 'ijs', 'slyv',
    'viov', 'dfsv', 'iscv', 'rwj'
  ]
);

for (const categoryId of [
  'tactical-fund',
  'broad-preference-fund',
  'selected-equity'
]) {
  assert.deepEqual(
    getSecurityCategory(categoryId).securityIds,
    []
  );
}

console.log(
  'Security category universe test passed: 28 categories, 261 unique securities and 307 associations.'
);
