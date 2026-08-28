import assert from 'node:assert/strict';

import {
  CONSTITUENT_PORTFOLIOS
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  SECURITY_REFERENCE
} from '../src/domain/portfolio-system/security-reference.js';

import {
  EXAMPLE_SECURITY_ASSOCIATIONS,
  EXAMPLE_SECURITY_CATEGORY_IDS,
  TACTICAL_FUND_DEFERRED_REASON
} from '../src/domain/portfolio-system/example-securities.js';

import {
  EXAMPLE_SECURITY_CONTEXTS
} from '../src/domain/portfolio-system/example-security-context.js';

import {
  getExampleSecurityCoverage,
  validateExampleSecurityCatalogue
} from '../src/domain/portfolio-system/example-security-resolver.js';


const portfolios = Object.values(CONSTITUENT_PORTFOLIOS).flatMap(
  (variantMap) => Object.values(variantMap)
);

const expectedSleeves = portfolios.flatMap(
  (portfolio) =>
    portfolio.sleeves.map((sleeve) => ({
      portfolio,
      sleeve,
      key: [portfolio.archetypeId, portfolio.variantId, sleeve.id].join('|')
    }))
);

const expectedCategories = new Set(
  expectedSleeves.flatMap(({ sleeve }) => sleeve.assetCategories)
);

assert.equal(Object.keys(CONSTITUENT_PORTFOLIOS).length, 7);
assert.equal(portfolios.length, 21);
assert.equal(expectedSleeves.length, 107);
assert.equal(expectedCategories.size, 28);

for (const variantMap of Object.values(CONSTITUENT_PORTFOLIOS)) {
  assert.deepEqual(
    Object.keys(variantMap),
    ['essential', 'intentional', 'engaged']
  );
}

assert.deepEqual(
  new Set(EXAMPLE_SECURITY_CATEGORY_IDS),
  expectedCategories,
  'Security categories must exactly match the constituent catalogue'
);

const associationSleeveKeys = new Set(
  EXAMPLE_SECURITY_ASSOCIATIONS.map(
    (association) => [
      association.archetypeId,
      association.variantId,
      association.sleeveId
    ].join('|')
  )
);

assert.deepEqual(
  associationSleeveKeys,
  new Set(expectedSleeves.map(({ key }) => key)),
  'Association coverage must exactly match all real sleeve instances'
);

for (const { portfolio, sleeve, key } of expectedSleeves) {
  const associations = EXAMPLE_SECURITY_ASSOCIATIONS.filter(
    (association) =>
      association.archetypeId === portfolio.archetypeId &&
      association.variantId === portfolio.variantId &&
      association.sleeveId === sleeve.id
  );

  assert.ok(associations.length > 0, key + ': missing associations');

  const mappedSecurityCount = associations.reduce(
    (count, association) => count + association.securityIds.length,
    0
  );

  assert.ok(mappedSecurityCount > 0, key + ': sleeve has no mapped security');

  for (const association of associations) {
    assert.ok(
      sleeve.assetCategories.includes(association.assetCategoryId),
      key + ': mapped category is not assigned to the sleeve'
    );

    if (association.securityIds.length === 0) {
      assert.equal(association.assetCategoryId, 'tactical-fund');
      assert.equal(association.deferredReason, TACTICAL_FUND_DEFERRED_REASON);
      assert.ok(
        mappedSecurityCount > 0,
        key + ': deferred category requires another mapped category in the sleeve'
      );
    }

    for (const securityId of association.securityIds) {
      assert.ok(SECURITY_REFERENCE[securityId], key + ': unknown ' + securityId);

      const exactContexts = EXAMPLE_SECURITY_CONTEXTS.filter(
        (context) =>
          context.archetypeId === association.archetypeId &&
          context.variantId === association.variantId &&
          context.sleeveId === association.sleeveId &&
          context.assetCategoryId === association.assetCategoryId &&
          context.securityId === securityId
      );

      assert.equal(
        exactContexts.length,
        1,
        key + ': expected one exact context for ' + securityId
      );
    }
  }
}

for (const context of EXAMPLE_SECURITY_CONTEXTS) {
  const realSleeve = expectedSleeves.find(
    ({ portfolio, sleeve }) =>
      portfolio.archetypeId === context.archetypeId &&
      portfolio.variantId === context.variantId &&
      sleeve.id === context.sleeveId &&
      sleeve.assetCategories.includes(context.assetCategoryId)
  );

  assert.ok(realSleeve, 'Context references a nonexistent exact sleeve: ' + JSON.stringify(context));
}

const coverage = getExampleSecurityCoverage();

assert.deepEqual(coverage, {
  archetypes: 7,
  variants: 3,
  portfolioSystems: 21,
  sleeveInstances: 107,
  securities: 37,
  contextualMappings: 197,
  pendingVerificationRecords: 1
});

assert.deepEqual(
  validateExampleSecurityCatalogue(),
  { valid: true, errors: [] }
);

console.log('Example security coverage test passed.');
console.log('Validated 7 archetypes, 21 systems, 107 sleeves and 28 asset categories.');
