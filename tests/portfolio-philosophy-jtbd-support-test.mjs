import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ARCHETYPE_DECISION_SUPPORT,
  ARCHETYPE_EVOLUTION_SUPPORT,
  ARCHETYPE_INTERACTION_SUPPORT,
  VARIANT_DECISION_SUPPORT,
  VARIANT_EVOLUTION_SUPPORT,
  VARIANT_INTERACTION_SUPPORT,
  getPortfolioDecisionMakingDelivery,
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

const EXACT_DECISION_COPY = {
  'ES|essential|start':
    'This system starts with a small number of broad portfolio roles, giving the investor a clear foundation to establish before considering additional investment choices or complexity.',
  'GD|intentional|fit':
    'This system separates major sources of diversification so a new idea can be evaluated by whether it reduces an existing concentration, adds a genuinely distinct exposure, or simply duplicates something the portfolio already has.',
  'FT|intentional|fit':
    'This system keeps the durable core separate from its defined improvement sleeves, so a new idea must solve a specific portfolio limitation or add an explicit improvement before it earns a place in the system.',
  'BFO|intentional|pick':
    'This system separates growth, income, stability, diversification, and liquidity into distinct jobs, so investment choices can be compared according to the role they need to perform rather than treated as interchangeable opportunities.',
  'TO|engaged|sell':
    'This system separates the permanent core from tactical and opportunity roles, so a decision to reduce, replace, or exit an active position can be made without automatically changing the long-term portfolio foundation.',
  'GA|engaged|enough':
    'This system separates the main growth foundation from higher-attention alternative and opportunity roles, making it clearer what evidence matters to a non-core decision and when additional research is unlikely to justify changing the portfolio.',
  'IP|intentional|sell':
    'This system separates liquidity, income, resilience, and measured-growth roles, so reducing or replacing an investment depends on whether it still performs the real-world portfolio job it was intended to support.'
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


let decisionCombinationCount = 0;

for (const archetypeId of ARCHETYPE_IDS) {
  for (const variantId of VARIANT_IDS) {
    const portfolioSystem =
      getConstituentPortfolio(
        archetypeId,
        variantId
      );

    for (const decisionStyleOptionId of [
      'start',
      'pick',
      'fit',
      'sell',
      'enough'
    ]) {
      const result =
        getPortfolioDecisionMakingDelivery({
          archetypeId,
          variantId,
          transitionOptionId:
            'doing_right',
          decisionStyleOptionId,
          portfolioSystem
        });

      decisionCombinationCount += 1;

      assert.ok(
        result,
        `Expected decision delivery for ${archetypeId} ${variantId} ${decisionStyleOptionId}`
      );
      assert.equal(result.archetypeId, archetypeId);
      assert.equal(result.variantId, variantId);
      assert.equal(result.transitionOptionId, 'doing_right');
      assert.equal(result.decisionStyleOptionId, decisionStyleOptionId);
      assert.equal(
        result.portfolioFamily,
        ARCHETYPE_DECISION_SUPPORT[archetypeId].portfolioFamily
      );
      assert.equal(
        result.philosophySupport,
        ARCHETYPE_DECISION_SUPPORT[archetypeId].decisionSupport
      );
      assert.equal(
        result.variantSupport,
        VARIANT_DECISION_SUPPORT[variantId].decisionSupport
      );
      assert.ok(
        typeof result.systemDelivery === 'string' &&
          result.systemDelivery.trim().length > 0,
        `Expected non-empty decision delivery for ${archetypeId} ${variantId} ${decisionStyleOptionId}`
      );
    }
  }
}

assert.equal(
  decisionCombinationCount,
  105,
  'Expected the complete 7 x 3 x 5 decision delivery matrix'
);


for (const [key, expectedCopy] of Object.entries(EXACT_DECISION_COPY)) {
  const [
    archetypeId,
    variantId,
    decisionStyleOptionId
  ] = key.split('|');

  const result =
    getPortfolioDecisionMakingDelivery({
      archetypeId,
      variantId,
      transitionOptionId:
        'compare',
      decisionStyleOptionId,
      portfolioSystem:
        getConstituentPortfolio(
          archetypeId,
          variantId
        )
    });

  assert.equal(
    result.systemDelivery,
    expectedCopy,
    `Exact decision copy mismatch for ${key}`
  );
}


const transitionResults = [
  'what_to_do',
  'doing_right',
  'missing',
  'change',
  'compare'
].map(
  (transitionOptionId) =>
    getPortfolioDecisionMakingDelivery({
      archetypeId: 'GD',
      variantId: 'essential',
      transitionOptionId,
      decisionStyleOptionId: 'sell',
      portfolioSystem:
        getConstituentPortfolio(
          'GD',
          'essential'
        )
    })
);

assert.ok(
  transitionResults.every(Boolean),
  'All five transition refinements should be accepted'
);

assert.ok(
  transitionResults.every(
    (result) =>
      /unchanged|no change/i.test(
        result.systemDelivery
      )
  ),
  'Decision delivery should preserve no action as a valid outcome'
);


for (const decisionStyleOptionId of [
  'start',
  'pick',
  'fit',
  'sell',
  'enough'
]) {
  const result =
    getPortfolioDecisionMakingDelivery({
      archetypeId: 'TO',
      variantId: 'engaged',
      transitionOptionId:
        'doing_right',
      decisionStyleOptionId,
      portfolioSystem:
        structureWithoutSpecialSleeves
    });

  assert.doesNotMatch(
    result.systemDelivery,
    /tactical sleeve|opportunity capacity|research capacity|improvement sleeve|income role|liquidity role/i,
    'Decision delivery must not invent a structural mechanism'
  );
}


for (const invalidInput of [
  {},
  {
    archetypeId: 'UNKNOWN',
    variantId: 'essential',
    transitionOptionId: 'doing_right',
    decisionStyleOptionId: 'sell',
    portfolioSystem: structureWithoutSpecialSleeves
  },
  {
    archetypeId: 'ES',
    variantId: 'UNKNOWN',
    transitionOptionId: 'doing_right',
    decisionStyleOptionId: 'sell',
    portfolioSystem: structureWithoutSpecialSleeves
  },
  {
    archetypeId: 'ES',
    variantId: 'essential',
    transitionOptionId: 'UNKNOWN',
    decisionStyleOptionId: 'sell',
    portfolioSystem: structureWithoutSpecialSleeves
  },
  {
    archetypeId: 'ES',
    variantId: 'essential',
    transitionOptionId: 'doing_right',
    decisionStyleOptionId: 'UNKNOWN',
    portfolioSystem: structureWithoutSpecialSleeves
  },
  {
    archetypeId: 'ES',
    variantId: 'essential',
    transitionOptionId: 'doing_right',
    decisionStyleOptionId: 'sell'
  }
]) {
  assert.equal(
    getPortfolioDecisionMakingDelivery(invalidInput),
    null,
    'Incomplete decision inputs should remain null-safe'
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

const accountabilitySource =
  screenSource.slice(
    screenSource.indexOf(
      'function renderProfileAccountability'
    ),
    screenSource.indexOf(
      'function renderComplexityReason'
    )
  );

assert.equal(
  (
    accountabilitySource.match(
      /<th\b/g
    ) ?? []
  ).length,
  3,
  'Accountability table should render exactly three headers'
);

assert.equal(
  (
    accountabilitySource.match(
      /<td\b/g
    ) ?? []
  ).length,
  3,
  'Each accountability row should render exactly three cells'
);

assert.match(
  accountabilitySource,
  /Your quiz response/,
  'Quiz-response header should remain visible'
);

assert.match(
  accountabilitySource,
  /Investing system JTBD/,
  'Investing-system JTBD header should remain visible'
);

assert.match(
  accountabilitySource,
  /How your recommended system delivers it/,
  'Delivery header should use the exact requested capitalization'
);

assert.doesNotMatch(
  accountabilitySource,
  /How your recommended system helps|HOW YOUR RECOMMENDED SYSTEM DELIVERS IT/,
  'Removed or uppercase header copy should not remain in the table'
);

assert.doesNotMatch(
  accountabilitySource,
  /text-transform\s*:\s*uppercase/i,
  'Delivery header should not be forced to uppercase'
);

assert.doesNotMatch(
  accountabilitySource,
  /item\.userJTBD|item\.guidanceIndication/,
  'User-JTBD and guidance-label cells should not remain visible'
);

assert.match(
  screenSource,
  /recommendedSystemDelivery[\s\S]*?\.systemDelivery[\s\S]*?'—'/,
  'Accountability rows should render delivery with a visible null-safe placeholder'
);


console.log(
  'Portfolio philosophy JTBD support tests passed.'
);
