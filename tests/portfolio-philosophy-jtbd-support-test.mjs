import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ARCHETYPE_EVOLUTION_SUPPORT,
  VARIANT_EVOLUTION_SUPPORT,
  getPortfolioEvolutionDelivery
} from '../src/domain/investor-system-guidance/portfolio-philosophy-jtbd-support.js';

import {
  getConstituentPortfolio
} from '../src/domain/portfolio-system/constituent-portfolios.js';


const ARCHETYPE_IDS = [
  'ES',
  'GD',
  'FT',
  'BFO',
  'GA',
  'TO',
  'IP'
];

const VARIANT_IDS = [
  'essential',
  'intentional',
  'engaged'
];

const EVOLUTION_OPTION_IDS = [
  'understand',
  'monitor',
  'frequency',
  'effort',
  'experiment'
];

const EXACT_EXPERIMENT_COPY = {
  ES: 'This system keeps most of the portfolio in a broad growth foundation and separates stability and liquidity into their own roles. That gives the portfolio a clear base to preserve before any additional idea is considered.',
  FT: 'This system keeps the durable core dominant and isolates improvement in one bounded sleeve. New ideas therefore have to serve a defined improvement purpose instead of changing the portfolio foundation directly.',
  BFO: 'This system separates growth, stability, and liquidity into distinct jobs. A future change can therefore be evaluated against the specific portfolio role it would affect instead of being treated as a change to the whole portfolio.',
  TO: 'This system protects a large permanent core and gives selected opportunities their own bounded capacity. New ideas can be explored without allowing short-term views to redefine the long-term portfolio.'
};


let combinationCount = 0;

for (const archetypeId of ARCHETYPE_IDS) {
  for (const variantId of VARIANT_IDS) {
    const portfolioSystem =
      getConstituentPortfolio(
        archetypeId,
        variantId
      );

    for (const evolutionOptionId of EVOLUTION_OPTION_IDS) {
      const result =
        getPortfolioEvolutionDelivery({
          archetypeId,
          variantId,
          evolutionOptionId,
          portfolioSystem
        });

      combinationCount += 1;

      assert.ok(
        result,
        `Expected delivery for ${archetypeId} ${variantId} ${evolutionOptionId}`
      );

      assert.equal(result.archetypeId, archetypeId);
      assert.equal(result.variantId, variantId);
      assert.equal(result.evolutionOptionId, evolutionOptionId);
      assert.equal(
        result.portfolioFamily,
        ARCHETYPE_EVOLUTION_SUPPORT[archetypeId].portfolioFamily
      );
      assert.equal(
        result.philosophySupport,
        ARCHETYPE_EVOLUTION_SUPPORT[archetypeId].evolutionSupport
      );
      assert.equal(
        result.variantSupport,
        VARIANT_EVOLUTION_SUPPORT[variantId].evolutionSupport
      );
      assert.ok(
        typeof result.systemDelivery === 'string' &&
          result.systemDelivery.trim().length > 0,
        `Expected non-empty delivery for ${archetypeId} ${variantId} ${evolutionOptionId}`
      );
    }
  }
}

assert.equal(
  combinationCount,
  105,
  'Expected the complete 7 x 3 x 5 delivery matrix'
);


for (const [archetypeId, expectedCopy] of Object.entries(EXACT_EXPERIMENT_COPY)) {
  const result =
    getPortfolioEvolutionDelivery({
      archetypeId,
      variantId: 'essential',
      evolutionOptionId: 'experiment',
      portfolioSystem:
        getConstituentPortfolio(
          archetypeId,
          'essential'
        )
    });

  assert.equal(
    result.systemDelivery,
    expectedCopy,
    `Exact experiment copy mismatch for ${archetypeId} essential`
  );
}


const toVariantResults = VARIANT_IDS.map(
  (variantId) =>
    getPortfolioEvolutionDelivery({
      archetypeId: 'TO',
      variantId,
      evolutionOptionId: 'experiment',
      portfolioSystem:
        getConstituentPortfolio(
          'TO',
          variantId
        )
    })
);

assert.equal(
  new Set(
    toVariantResults.map(
      (result) => result.philosophySupport
    )
  ).size,
  1,
  'Variants should retain the same archetype philosophy support'
);

assert.equal(
  new Set(
    toVariantResults.map(
      (result) => result.variantSupport
    )
  ).size,
  3,
  'Each variant should retain its distinct support meaning'
);

assert.equal(
  new Set(
    toVariantResults.map(
      (result) => result.systemDelivery
    )
  ).size,
  3,
  'Delivery should reflect each resolved variant structure'
);

assert.deepEqual(
  toVariantResults.map(
    (result) => result.variantId
  ),
  VARIANT_IDS,
  'The support layer must preserve, not resolve, variant IDs'
);


const globalEssentialExperiment =
  getPortfolioEvolutionDelivery({
    archetypeId: 'GD',
    variantId: 'essential',
    evolutionOptionId: 'experiment',
    portfolioSystem:
      getConstituentPortfolio(
        'GD',
        'essential'
      )
  });

assert.doesNotMatch(
  globalEssentialExperiment.systemDelivery,
  /opportunity|research|improvement sleeve/i,
  'Delivery must not claim a bounded sleeve that is absent'
);

const engagedImprovementExperiment =
  getPortfolioEvolutionDelivery({
    archetypeId: 'FT',
    variantId: 'engaged',
    evolutionOptionId: 'experiment',
    portfolioSystem:
      getConstituentPortfolio(
        'FT',
        'engaged'
      )
  });

assert.match(
  engagedImprovementExperiment.systemDelivery,
  /Research Capacity/,
  'Delivery may identify a research capacity that actually exists'
);


for (const invalidInput of [
  {},
  {
    archetypeId: 'UNKNOWN',
    variantId: 'essential',
    evolutionOptionId: 'experiment',
    portfolioSystem: { sleeves: [{ id: 'core', label: 'Core' }] }
  },
  {
    archetypeId: 'ES',
    variantId: 'UNKNOWN',
    evolutionOptionId: 'experiment',
    portfolioSystem: { sleeves: [{ id: 'core', label: 'Core' }] }
  },
  {
    archetypeId: 'ES',
    variantId: 'essential',
    evolutionOptionId: 'UNKNOWN',
    portfolioSystem: { sleeves: [{ id: 'core', label: 'Core' }] }
  },
  {
    archetypeId: 'ES',
    variantId: 'essential',
    evolutionOptionId: 'experiment'
  },
  {
    archetypeId: 'ES',
    variantId: 'essential',
    evolutionOptionId: 'experiment',
    portfolioSystem: { sleeves: [{ id: 'core' }] }
  }
]) {
  assert.equal(
    getPortfolioEvolutionDelivery(invalidInput),
    null,
    'Incomplete or unknown inputs should remain null-safe'
  );
}


const screenSource = readFileSync(
  new URL(
    '../src/features/recommendation/PortfolioSystemFitScreen.js',
    import.meta.url
  ),
  'utf8'
);

assert.match(
  screenSource,
  /HOW YOUR RECOMMENDED SYSTEM DELIVERS IT/,
  'Accountability table should include the exact additive header'
);

assert.match(
  screenSource,
  /recommendedSystemDelivery[\s\S]*?\.systemDelivery[\s\S]*?'—'/,
  'Accountability rows should render delivery with a visible null-safe placeholder'
);


console.log(
  'Portfolio philosophy JTBD support tests passed.'
);
