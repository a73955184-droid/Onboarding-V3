import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  CONSTITUENT_PORTFOLIOS
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  EXACT_SLEEVE_SECURITY_EXCLUSIONS,
  EXACT_SLEEVE_SECURITY_PERMISSIONS
} from '../src/domain/portfolio-system/exact-sleeve-security-permissions.js';

import {
  PHASE_1_SECURITY_METADATA_RECORDS
} from '../src/domain/portfolio-system/security-metadata.js';

import {
  PHASE_1_APPROVED_SECURITY_IDS,
  SECURITY_CATEGORY_UNIVERSE,
  getSecurityCategory
} from '../src/domain/portfolio-system/security-category-universe.js';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';

import {
  getExactSleeveSecurityEligibility
} from '../src/domain/portfolio-system/sleeve-security-eligibility.js';

import {
  resolveEligibleSecurities
} from '../src/domain/portfolio-system/sleeve-security-eligibility-resolver.js';


const portfolios = Object.values(CONSTITUENT_PORTFOLIOS)
  .flatMap((variants) => Object.values(variants));
const sleeves = portfolios.flatMap((portfolio) =>
  portfolio.sleeves.map((sleeve) => ({ portfolio, sleeve }))
);
const exactKey = (record) => [
  record.portfolioSystemId,
  record.variantId,
  record.sleeveId,
  record.categoryId,
  record.securityId
].join('|');


assert.equal(PHASE_1_APPROVED_SECURITY_IDS.length, 261);
assert.equal(PHASE_1_SECURITY_METADATA_RECORDS.length, 261);
assert.equal(
  SECURITY_CATEGORY_UNIVERSE.reduce(
    (total, category) => total + category.securityIds.length,
    0
  ),
  307
);
assert.equal(portfolios.length, 21);
assert.equal(sleeves.length, 107);
assert.equal(EXACT_SLEEVE_SECURITY_PERMISSIONS.length, 1597);
assert.equal(EXACT_SLEEVE_SECURITY_EXCLUSIONS.length, 0);
assert.equal(
  new Set(EXACT_SLEEVE_SECURITY_PERMISSIONS.map(exactKey)).size,
  EXACT_SLEEVE_SECURITY_PERMISSIONS.length
);


for (const permission of EXACT_SLEEVE_SECURITY_PERMISSIONS) {
  const portfolio = portfolios.find(
    ({ id, variantId }) =>
      id === permission.portfolioSystemId &&
      variantId === permission.variantId
  );
  const sleeve = portfolio?.sleeves.find(
    ({ id }) => id === permission.sleeveId
  );
  const category = getSecurityCategory(permission.categoryId);

  assert.ok(portfolio);
  assert.ok(sleeve);
  assert.ok(category);
  assert.ok(sleeve.assetCategories.includes(permission.categoryId));
  assert.ok(category.securityIds.includes(permission.securityId));
  assert.ok(PHASE_1_APPROVED_SECURITY_IDS.includes(permission.securityId));
  assert.equal(permission.eligibilityStatus, 'eligible');
  assert.equal('ticker' in permission, false);
  assert.equal('outcome' in permission, false);
  assert.equal('automaticallyHeld' in permission, false);
}


for (const { portfolio, sleeve } of sleeves) {
  const browse = resolveEligibleSecurities({
    portfolioSystemId: portfolio.id,
    variantId: portfolio.variantId,
    sleeveId: sleeve.id
  });

  for (const category of browse.categories) {
    for (const security of category.securities) {
      const exact = getExactSleeveSecurityEligibility({
        portfolioSystemId: portfolio.id,
        variantId: portfolio.variantId,
        sleeveId: sleeve.id,
        categoryId: category.categoryId,
        securityId: security.securityId
      });

      assert.equal(security.eligibilityStatus, 'eligible');
      assert.equal(exact?.eligibilityStatus, 'eligible');
      assert.equal(security.automaticallyHeld, false);
      assert.equal('outcome' in security, false);
    }
  }
}


const exactInput = {
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  sleeveId: 'smallValueImprovement',
  categoryId: 'small-value-equity',
  securityId: 'avuv'
};

assert.equal(
  getExactSleeveSecurityEligibility(exactInput)?.eligibilityStatus,
  'eligible'
);

for (const changedIdentity of [
  { ...exactInput, portfolioSystemId: 'FT-engaged' },
  { ...exactInput, variantId: 'engaged' },
  { ...exactInput, sleeveId: 'factorImprovements' },
  { ...exactInput, categoryId: 'quality-factor-equity' }
]) {
  assert.equal(
    getExactSleeveSecurityEligibility(changedIdentity),
    null,
    'Exact eligibility must not fall back across identity dimensions'
  );
}


const permissionSource = readFileSync(
  new URL(
    '../src/domain/portfolio-system/exact-sleeve-security-permissions.js',
    import.meta.url
  ),
  'utf8'
);
const compatibilitySource = readFileSync(
  new URL(
    '../src/domain/portfolio-system/sleeve-security-eligibility.js',
    import.meta.url
  ),
  'utf8'
);

assert.doesNotMatch(permissionSource, /EXAMPLE_SECURITY_ASSOCIATIONS/);
assert.doesNotMatch(permissionSource, /example-securities/);
assert.doesNotMatch(compatibilitySource, /EXAMPLE_SECURITY_ASSOCIATIONS/);
assert.doesNotMatch(compatibilitySource, /example-securities/);


const add = resolveSecurityPortfolioFit({
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  targetSleeveId: 'smallValueImprovement',
  candidateSecurityId: 'avuv',
  holdingsBySleeve: {}
});
const replace = resolveSecurityPortfolioFit({
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  targetSleeveId: 'stability',
  candidateSecurityId: 'bnd',
  holdingsBySleeve: { stability: ['lqd'] }
});
const redundant = resolveSecurityPortfolioFit({
  portfolioSystemId: 'ES-intentional',
  variantId: 'intentional',
  targetSleeveId: 'usCore',
  candidateSecurityId: 'vti',
  holdingsBySleeve: { usCore: ['vti'] }
});
const doNotAdd = resolveSecurityPortfolioFit({
  portfolioSystemId: 'GD-intentional',
  variantId: 'intentional',
  targetSleeveId: 'inflationResilience',
  candidateSecurityId: 'pave',
  holdingsBySleeve: {}
});

assert.equal(add.outcome, 'add');
assert.equal(replace.outcome, 'replace');
assert.equal(replace.affectedSecurityId, 'lqd');
assert.equal(redundant.outcome, 'redundant');
assert.equal(doNotAdd.outcome, 'do-not-add');
assert.equal(doNotAdd.assessmentStatus, 'complete');
assert.equal(
  getExactSleeveSecurityEligibility({
    portfolioSystemId: 'GD-intentional',
    variantId: 'intentional',
    sleeveId: 'inflationResilience',
    categoryId: 'real-assets',
    securityId: 'pave'
  })?.eligibilityStatus,
  'eligible'
);

const unavailable = resolveSecurityPortfolioFit({
  portfolioSystemId: 'FT-intentional',
  variantId: 'intentional',
  targetSleeveId: 'smallValueImprovement',
  candidateSecurityId: 'vfmf',
  holdingsBySleeve: {}
});

assert.equal(unavailable.assessmentStatus, 'unavailable');
assert.equal('allocationBefore' in unavailable, false);
assert.equal('allocationAfter' in unavailable, false);

console.log(
  'Exact sleeve security permissions test passed: Phase 1 catalogue permissions are exact, explicit and outcome-neutral.'
);
