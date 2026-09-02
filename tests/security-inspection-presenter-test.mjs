import assert from 'node:assert/strict';

import {
  CONSTITUENT_PORTFOLIOS
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  presentSecurityInspection
} from '../src/domain/portfolio-system/security-inspection-presenter.js';

import {
  resolveEligibleSecurities
} from '../src/domain/portfolio-system/sleeve-security-eligibility-resolver.js';


function labels(section) {
  return section.fields.map(({ label }) => label);
}


const equity = presentSecurityInspection({
  portfolioSystemId: 'ES-intentional',
  variantId: 'intentional',
  sleeveId: 'internationalCore',
  categoryId: 'broad-international-equity',
  securityId: 'vxus'
});

assert.equal(equity.security.ticker, 'VXUS');
assert.equal(
  equity.security.name,
  'Vanguard Total International Stock ETF'
);
assert.deepEqual(
  equity.sections.role.items,
  ['Broad International Equity']
);
assert.equal(
  equity.sections.sleeveAlignment.fields.find(
    ({ label }) => label === 'Supports'
  ).value,
  'Geographic Diversification'
);
assert.equal(
  equity.sections.sleeveAlignment.fields.find(
    ({ label }) => label === 'Permitted category'
  ).value,
  'Yes'
);
assert.equal(
  equity.sections.structuralExposure.fields.find(
    ({ label }) => label === 'Strategy'
  ).value,
  'Broad-market strategy'
);
assert.equal(
  labels(equity.sections.structuralExposure).includes('Duration'),
  false,
  'Equity inspection must omit duration'
);
assert.equal(
  labels(equity.sections.structuralExposure).includes('Credit quality'),
  false,
  'Equity inspection must omit credit quality'
);


const cash = presentSecurityInspection({
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  sleeveId: 'liquidity',
  categoryId: 'cash-equivalent',
  securityId: 'sgov'
});

assert.equal(
  labels(cash.sections.structuralExposure).includes(
    'Market capitalization'
  ),
  false,
  'Cash inspection must omit market capitalization'
);
assert.equal(
  labels(cash.sections.structuralExposure).includes('Duration'),
  true
);
assert.equal(
  labels(cash.sections.structuralExposure).includes('Credit quality'),
  true
);


const realAsset = presentSecurityInspection({
  portfolioSystemId: 'GD-intentional',
  variantId: 'intentional',
  sleeveId: 'inflationResilience',
  categoryId: 'real-assets',
  securityId: 'vnq'
});

assert.equal(
  labels(realAsset.sections.structuralExposure).includes('Credit quality'),
  false,
  'Real-asset inspection must omit credit quality'
);


for (const presentation of [equity, cash, realAsset]) {
  assert.equal(Object.isFrozen(presentation), true);
  assert.equal('outcome' in presentation, false);
  assert.equal('assessmentStatus' in presentation, false);
  assert.equal('decisionFactors' in presentation, false);
  assert.equal(
    presentation.sections.assessmentChecks.items.length,
    4
  );

  const fieldValues = Object.values(presentation.sections)
    .flatMap((section) => section.fields ?? [])
    .map(({ value }) => value);

  for (const value of fieldValues) {
    assert.equal(typeof value, 'string');
    assert.ok(value.length > 0);
    assert.doesNotMatch(value, /^(none|unknown|null|\[\])$/i);
  }
}

assert.equal(
  presentSecurityInspection({
    portfolioSystemId: 'ES-intentional',
    variantId: 'intentional',
    sleeveId: 'internationalCore',
    categoryId: 'broad-international-equity',
    securityId: 'not-known'
  }),
  null
);


let presentationCount = 0;

for (const variants of Object.values(CONSTITUENT_PORTFOLIOS)) {
  for (const portfolio of Object.values(variants)) {
    for (const sleeve of portfolio.sleeves) {
      const eligibility = resolveEligibleSecurities({
        portfolioSystemId: portfolio.id,
        variantId: portfolio.variantId,
        sleeveId: sleeve.id
      });

      for (const category of eligibility.categories) {
        for (const security of category.securities) {
          const presentation = presentSecurityInspection({
            portfolioSystemId: portfolio.id,
            variantId: portfolio.variantId,
            sleeveId: sleeve.id,
            categoryId: category.categoryId,
            securityId: security.securityId
          });

          assert.ok(presentation);
          assert.equal('outcome' in presentation, false);

          const structuralLabels = labels(
            presentation.sections.structuralExposure
          );
          const assetClass = presentation.sections.structuralExposure.fields
            .find(({ label }) => label === 'Asset class')?.value;

          if (assetClass?.includes('Equity')) {
            assert.equal(
              structuralLabels.includes('Duration'),
              false
            );
          }

          if (category.categoryId === 'cash-equivalent') {
            assert.equal(
              structuralLabels.includes('Market capitalization'),
              false
            );
          }
          if (category.categoryId === 'real-assets') {
            assert.equal(
              structuralLabels.includes('Credit quality'),
              false
            );
          }

          for (const section of Object.values(presentation.sections)) {
            for (const { value } of section.fields ?? []) {
              assert.doesNotMatch(value, /^(none|unknown|null|\[\])$/i);
            }
          }

          presentationCount += 1;
        }
      }
    }
  }
}

assert.ok(presentationCount > 0);

console.log(
  `Security inspection presenter test passed: ${presentationCount} contextual presentations are filtered, mapped and outcome-free.`
);
