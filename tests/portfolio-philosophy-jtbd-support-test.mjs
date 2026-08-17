import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ARCHETYPE_EVOLUTION_SUPPORT,
  ARCHETYPE_INTERACTION_SUPPORT,
  VARIANT_EVOLUTION_SUPPORT,
  VARIANT_INTERACTION_SUPPORT,
  getPortfolioEvolutionDelivery,
  getPortfolioInteractionDelivery
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

const EXACT_INTERACTION_COPY = {
  'ES|essential|tell_me':
    'This system uses a small number of broad, low-effort portfolio roles, so most of the portfolio can remain in place without regular research or intervention.',
  'FT|intentional|explore':
    'This system keeps the durable core and stability roles relatively low-maintenance while concentrating additional research on the portfolio’s defined improvement sleeves. That gives exploration a specific place without increasing effort across the whole portfolio.',
  'BFO|intentional|periodic':
    'This system separates growth, income, stability, diversification, and liquidity into distinct roles with different review needs, so attention can be directed through a planned review rhythm instead of treating the entire portfolio the same way.',
  'TO|engaged|active':
    'This system protects the permanent core while separating tactical, thematic, and opportunity roles that are meant to receive more active attention. That keeps higher-effort research concentrated in the parts designed for it.',
  'GA|engaged|explore':
    'This system keeps the main growth foundation relatively stable while giving alternatives, differentiated return sources, and bounded opportunity capacity their own higher-attention roles. That allows deeper research without turning the entire portfolio into a research project.',
  'IP|essential|occasional':
    'This system concentrates attention on liquidity, dependable income, and resilience while keeping the portfolio structure broad and relatively low-maintenance, allowing occasional review without constant monitoring.'
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


let interactionCombinationCount = 0;

for (const archetypeId of ARCHETYPE_IDS) {
  for (const variantId of VARIANT_IDS) {
    const portfolioSystem =
      getConstituentPortfolio(
        archetypeId,
        variantId
      );

    for (const tradeoffOptionId of [
      'tell_me',
      'occasional',
      'periodic',
      'explore',
      'active'
    ]) {
      const result =
        getPortfolioInteractionDelivery({
          archetypeId,
          variantId,
          tradeoffOptionId,
          marketPsychologyOptionId:
            'rarely',
          portfolioSystem
        });

      interactionCombinationCount += 1;

      assert.ok(
        result,
        `Expected interaction delivery for ${archetypeId} ${variantId} ${tradeoffOptionId}`
      );
      assert.equal(result.archetypeId, archetypeId);
      assert.equal(result.variantId, variantId);
      assert.equal(result.tradeoffOptionId, tradeoffOptionId);
      assert.equal(result.marketPsychologyOptionId, 'rarely');
      assert.equal(
        result.portfolioFamily,
        ARCHETYPE_INTERACTION_SUPPORT[archetypeId].portfolioFamily
      );
      assert.equal(
        result.philosophySupport,
        ARCHETYPE_INTERACTION_SUPPORT[archetypeId].interactionSupport
      );
      assert.equal(
        result.variantSupport,
        VARIANT_INTERACTION_SUPPORT[variantId].interactionSupport
      );
      assert.ok(
        typeof result.systemDelivery === 'string' &&
          result.systemDelivery.trim().length > 0,
        `Expected non-empty interaction delivery for ${archetypeId} ${variantId} ${tradeoffOptionId}`
      );
    }
  }
}

assert.equal(
  interactionCombinationCount,
  105,
  'Expected the complete 7 x 3 x 5 interaction delivery matrix'
);


for (const [key, expectedCopy] of Object.entries(EXACT_INTERACTION_COPY)) {
  const [
    archetypeId,
    variantId,
    tradeoffOptionId
  ] = key.split('|');

  const result =
    getPortfolioInteractionDelivery({
      archetypeId,
      variantId,
      tradeoffOptionId,
      marketPsychologyOptionId:
        'market',
      portfolioSystem:
        getConstituentPortfolio(
          archetypeId,
          variantId
        )
    });

  assert.equal(
    result.systemDelivery,
    expectedCopy,
    `Exact interaction copy mismatch for ${key}`
  );
}


const psychologyResults = [
  'balance',
  'market',
  'holding',
  'idea',
  'rarely'
].map(
  (marketPsychologyOptionId) =>
    getPortfolioInteractionDelivery({
      archetypeId: 'GD',
      variantId: 'intentional',
      tradeoffOptionId: 'active',
      marketPsychologyOptionId,
      portfolioSystem:
        getConstituentPortfolio(
          'GD',
          'intentional'
        )
    })
);

assert.ok(
  psychologyResults.every(Boolean),
  'All five market-psychology refinements should be accepted'
);


const structureWithoutSpecialSleeves = {
  name: 'Synthetic Stable Portfolio',
  sleeves: [
    {
      id: 'core',
      label: 'Core',
      effort: 'low',
      reviewCadence: 'annual'
    },
    {
      id: 'reserve',
      label: 'Reserve',
      effort: 'very-low',
      reviewCadence: 'as-needs-change'
    }
  ]
};

for (const tradeoffOptionId of [
  'tell_me',
  'occasional',
  'periodic',
  'explore',
  'active'
]) {
  const result =
    getPortfolioInteractionDelivery({
      archetypeId: 'FT',
      variantId: 'intentional',
      tradeoffOptionId,
      marketPsychologyOptionId:
        'rarely',
      portfolioSystem:
        structureWithoutSpecialSleeves
    });

  assert.doesNotMatch(
    result.systemDelivery,
    /research sleeve|opportunity sleeve|tactical sleeve|improvement sleeve/i,
    'Interaction delivery must not invent a specialized sleeve'
  );
}


for (const invalidInput of [
  {},
  {
    archetypeId: 'UNKNOWN',
    variantId: 'essential',
    tradeoffOptionId: 'tell_me',
    marketPsychologyOptionId: 'rarely',
    portfolioSystem: structureWithoutSpecialSleeves
  },
  {
    archetypeId: 'ES',
    variantId: 'UNKNOWN',
    tradeoffOptionId: 'tell_me',
    marketPsychologyOptionId: 'rarely',
    portfolioSystem: structureWithoutSpecialSleeves
  },
  {
    archetypeId: 'ES',
    variantId: 'essential',
    tradeoffOptionId: 'UNKNOWN',
    marketPsychologyOptionId: 'rarely',
    portfolioSystem: structureWithoutSpecialSleeves
  },
  {
    archetypeId: 'ES',
    variantId: 'essential',
    tradeoffOptionId: 'tell_me',
    marketPsychologyOptionId: 'UNKNOWN',
    portfolioSystem: structureWithoutSpecialSleeves
  },
  {
    archetypeId: 'ES',
    variantId: 'essential',
    tradeoffOptionId: 'tell_me',
    marketPsychologyOptionId: 'rarely'
  }
]) {
  assert.equal(
    getPortfolioInteractionDelivery(invalidInput),
    null,
    'Incomplete interaction inputs should remain null-safe'
  );
}


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
