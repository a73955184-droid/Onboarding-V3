import assert from 'node:assert/strict';

import {
  ARCHETYPE_PHILOSOPHIES
} from '../src/domain/portfolio-philosophy/archetype-philosophies.js';

import {
  PORTFOLIO_ARCHETYPES
} from '../src/domain/portfolio-system/portfolio-archetypes.js';

import {
  getPortfolioSystemDisplayName,
  getPortfolioSystemTitle
} from '../src/domain/investor-system-guidance/investor-system-guidance-presenter.js';

import {
  presentPortfolioJobFit
} from '../src/domain/portfolio-philosophy/portfolio-job-fit-presenter.js';

import {
  renderVariantExplanation
} from '../src/features/recommendation/PortfolioSystemFitScreen.js';


const EXPECTED_EXPLANATIONS = Object.freeze({
  ES: Object.freeze({
    essential:
      'The Essential version organizes your investments around a simple foundation for long-term growth, stability, and accessible money. Each category represents a fundamental purpose for your money rather than a particular investment idea or strategy. The system keeps those purposes easy to understand and deliberately limits additional investment ideas, because your answers suggest that getting the foundation organized matters more right now than having more things to research or manage.',
    intentional:
      'The Intentional version keeps the same simple foundation for long-term growth, stability, and accessible money, while giving you room to make selected improvements as your investing needs develop. Your answers suggest that you want to understand what you own and make thoughtful changes without creating unnecessary complexity, so additional investments should have a clear reason for improving diversification, stability, or another existing purpose rather than simply adding more things to the portfolio.',
    engaged:
      'The Engaged version keeps a simple diversified foundation while giving you more room to research and compare different ways of fulfilling its purposes. Your answers suggest that you are comfortable spending more time learning and making investment choices, so the system can accommodate more differentiated investments when they make a meaningful contribution while still protecting the simplicity of the overall portfolio.'
  }),
  GD: Object.freeze({
    essential:
      'The Essential version organizes your investments so that long-term growth does not depend too heavily on a single market or part of the world. The categories represent major sources of global participation rather than individual countries, themes, or investment ideas. The system keeps diversification straightforward because your answers suggest that gaining meaningful exposure beyond your dominant market matters more than researching and managing individual geographic opportunities.',
    intentional:
      'The Intentional version keeps global diversification as the foundation while giving selected regions or sources of economic growth a more explicit purpose when they add something meaningfully different. Your answers suggest that you want to understand where your diversification comes from and make thoughtful improvements, so the system lets you examine whether an additional investment reduces an existing concentration or adds a genuinely different source of growth rather than simply increasing the number of markets you own.',
    engaged:
      'The Engaged version organizes global diversification in greater detail because your answers suggest that you are willing to research how different markets, regions, and economic sources contribute to the portfolio. The system gives you more places to express those interests when they serve a distinct diversification purpose, while requiring each addition to improve the portfolio’s global balance rather than becoming an isolated geographic bet.'
  }),
  FT: Object.freeze({
    essential:
      'The Essential version keeps diversified long-term investments as the foundation and allows only a limited, clearly defined improvement beyond them. That improvement exists to change a specific characteristic of the portfolio—such as quality, value, company size, or another systematic investment characteristic—rather than to create a collection of individual investment ideas. Your answers suggest that you want some opportunity to improve the foundation without taking on substantial additional research and decision-making.',
    intentional:
      'The Intentional version keeps diversified investments as the foundation while giving selected systematic improvements their own clearly defined purposes. Your answers suggest that you are willing to investigate whether characteristics such as quality, value, or company size can improve what you already own, so the system gives those ideas a place when you can explain what they are intended to improve and whether that contribution justifies the additional investment.',
    engaged:
      'The Engaged version keeps the diversified foundation intact while allowing you to research and compare multiple systematic ways of improving it. Your answers suggest that you are comfortable spending more time evaluating different investment characteristics, so the system can distinguish among those purposes and let you make more deliberate choices about which improvements deserve a place, without turning that research into individual stock picking.'
  }),
  BFO: Object.freeze({
    essential:
      'The Essential version organizes your investments around three fundamental purposes: Growth, Stability, and Liquidity. Growth is intended to build wealth over time, Stability helps reduce dependence on growth investments when markets are difficult, and Liquidity keeps money available for near-term needs or flexibility. These are broad categories because each describes a major purpose for your money rather than a particular investment idea or strategy, and the Essential version stops there because your portfolio can gain the organizing benefits of the Balanced Multi-Purpose approach without giving you additional areas to research, compare, or manage.',
    intentional:
      'The Intentional version starts with the same fundamental purposes—Growth, Stability, and Liquidity—but gives selected investment ideas an additional, clearly defined purpose in your portfolio. Your answers suggest that you want room to explore ideas without disrupting what already works, so an additional investment should improve an existing part of the portfolio, add a genuinely different source of diversification or return, or otherwise have a clear reason for being there instead of simply becoming another investment you own.',
    engaged:
      'The Engaged version keeps Growth, Stability, and Liquidity as the foundation while giving more of your investment interests their own defined purposes. Your answers suggest that you are willing to spend more time researching different ways your money can contribute, so the system can distinguish additional purposes such as generating income, adding another source of growth, improving diversification, or pursuing selected opportunities when there is a clear reason to do so, while the fundamental purposes continue to anchor the portfolio.'
  }),
  GA: Object.freeze({
    essential:
      'The Essential version keeps long-term growth as the main purpose of the portfolio while adding a limited source of diversification whose behavior or economic drivers differ from conventional growth investments. The additional category has a specific job rather than existing simply because an alternative investment is interesting, and the system keeps that role limited because your answers suggest that you want diversification beyond conventional investments without taking on substantial additional research or complexity.',
    intentional:
      'The Intentional version keeps long-term growth at the center while giving selected alternative sources of return or diversification a clearly defined purpose. Your answers suggest that you are interested in exploring investments beyond conventional markets, so the system gives those ideas a place when they add an economic driver that is meaningfully different from what you already own and when you can identify what contribution the additional investment is expected to make.',
    engaged:
      'The Engaged version keeps growth as the foundation while allowing you to investigate multiple differentiated sources of return and diversification. Your answers suggest that you are willing to spend more time understanding why alternatives, real assets, or other differentiated investments behave differently, so the system can give more of those interests a defined purpose when each adds something distinct rather than simply increasing portfolio complexity.'
  }),
  TO: Object.freeze({
    essential:
      'The Essential version separates the investments intended to remain in place for the long term from a limited area for selected opportunities. This allows you to act on an investment idea without allowing that idea to redefine the rest of the portfolio, and the opportunity area remains deliberately limited because your answers suggest that you value some flexibility while still wanting most of your money to follow a stable long-term plan.',
    intentional:
      'The Intentional version keeps the long-term portfolio protected while giving selected opportunities a clearly defined place and purpose. Your answers suggest that you want to act on some market conditions, themes, valuations, or investment ideas, so the system lets you evaluate those opportunities separately—why you are considering them, what you expect them to contribute, and when that reasoning would no longer hold—without continually changing the investments intended to remain long term.',
    engaged:
      'The Engaged version preserves a stable long-term portfolio while giving you more room to research and make decisions about changing opportunities. Your answers suggest that active judgment is an important part of how you want to invest, so the system can accommodate more differentiated themes, market views, or selected investments, but each decision must have a defined purpose and remain separate from the money that is not meant to respond to short-term opportunities.'
  }),
  IP: Object.freeze({
    essential:
      'The Essential version organizes your investments around the money you need to keep accessible, the money expected to provide dependable income and stability, and the money that can continue growing for the future. These categories represent fundamental real-world purposes rather than individual investment strategies, and the system keeps them straightforward because meeting those needs reliably matters more than creating additional areas that require research and ongoing decisions.',
    intentional:
      'The Intentional version starts with accessible money, dependable income, stability, and measured long-term growth, while giving important needs a more clearly defined purpose when treating them separately improves the plan. Your answers suggest that you want to make deliberate choices about how the portfolio supports real-world needs, so the system can distinguish concerns such as maintaining purchasing power, improving income, or protecting money needed at different times when doing so helps you make better decisions about that capital.',
    engaged:
      'The Engaged version keeps liquidity, income, preservation, and measured growth as the foundation while allowing you to research different ways of meeting those needs. Your answers suggest that you are willing to spend more time comparing income sources, protection against inflation, stability investments, and growth opportunities, so the system can give those needs more distinct purposes when the differences are useful, while keeping the portfolio focused on supporting real-world spending and capital needs rather than maximizing investment activity.'
  })
});

const FAMILY_NAMES = Object.freeze(
  Object.fromEntries(
    Object.keys(
      PORTFOLIO_ARCHETYPES
    ).map(
      archetypeId => [
        archetypeId,
        getPortfolioSystemDisplayName(
          archetypeId
        )
      ]
    )
  )
);

const VARIANT_NAMES = Object.freeze({
  essential: 'Essential',
  intentional: 'Intentional',
  engaged: 'Engaged'
});

const EXPECTED_HERO_NAMES = Object.freeze({
  ES: 'Effortless',
  GD: 'Global Diversified',
  FT: 'Systematic Improvement',
  BFO: 'Balanced Multi-Purpose',
  GA: 'Growth & Alternatives',
  TO: 'Opportunity Portfolio',
  IP: 'Income Preservation'
});

for (const [
  archetypeId,
  expectedDisplayName
] of Object.entries(
  EXPECTED_HERO_NAMES
)) {
  const canonicalName =
    PORTFOLIO_ARCHETYPES[
      archetypeId
    ].name;

  assert.ok(
    canonicalName === expectedDisplayName ||
      canonicalName === `${expectedDisplayName} Portfolio`,
    `${archetypeId} hero name should remain derived from its canonical archetype name`
  );

  assert.equal(
    getPortfolioSystemDisplayName(
      archetypeId
    ),
    expectedDisplayName,
    `${archetypeId} should present its canonical concise hero name`
  );

  assert.equal(
    getPortfolioSystemTitle(
      archetypeId,
      'essential'
    ),
    `${expectedDisplayName} · Essential`,
    `${archetypeId} should preserve variant composition`
  );
}

assert.equal(
  getPortfolioSystemTitle(
    'GA',
    'intentional'
  ),
  'Growth & Alternatives · Intentional'
);

assert.equal(
  getPortfolioSystemTitle(
    'TO',
    'engaged'
  ),
  'Opportunity Portfolio · Engaged'
);

assert.doesNotMatch(
  Object.values(
    FAMILY_NAMES
  ).join('|'),
  /Emerging Strategist|Factor Tilt|Balanced Family Office|Growth \+ Alternatives|Tactical \/ Opportunistic|Income \/ Preservation/,
  'Official portfolio-system names must not regress to the obsolete taxonomy'
);

function presentResolvedExplanation(
  archetypeId,
  variantId
) {
  return presentPortfolioJobFit({
    recommendation: {
      archetypeId,
      variantId
    },
    philosophy: {
      archetype:
        ARCHETYPE_PHILOSOPHIES[
          archetypeId
        ],
      variant: {
        variantId
      },
      archetypeSources: []
    },
    sleeves: [],
    evidence: {
      selectedAnswers: []
    }
  }).philosophy.variantExplanation;
}

let mappingCount = 0;

for (const [
  archetypeId,
  variants
] of Object.entries(
  EXPECTED_EXPLANATIONS
)) {
  const resolvedCopies = [];

  for (const [
    variantId,
    expectedCopy
  ] of Object.entries(variants)) {
    mappingCount += 1;

    assert.equal(
      ARCHETYPE_PHILOSOPHIES[
        archetypeId
      ].variantExplanations[
        variantId
      ].copy,
      expectedCopy,
      `${archetypeId} + ${variantId} must match the approved copy exactly`
    );

    assert.deepEqual(
      presentResolvedExplanation(
        archetypeId,
        variantId
      ),
      {
        archetypeId,
        variantId,
        copy:
          expectedCopy
      },
      `${archetypeId} + ${variantId} should resolve without rescoring`
    );

    resolvedCopies.push(
      expectedCopy
    );
  }

  assert.equal(
    new Set(resolvedCopies).size,
    3,
    `${archetypeId} variants must have three distinct explanations`
  );
}

assert.equal(
  mappingCount,
  21,
  'Exactly 21 approved mappings should be tested'
);

assert.match(
  EXPECTED_EXPLANATIONS.BFO.essential,
  /three fundamental purposes: Growth, Stability, and Liquidity/
);
assert.match(
  EXPECTED_EXPLANATIONS.BFO.essential,
  /Balanced Multi-Purpose approach/
);
assert.doesNotMatch(
  EXPECTED_EXPLANATIONS.BFO.essential,
  /Balanced Family Office/
);
assert.match(
  EXPECTED_EXPLANATIONS.BFO.intentional,
  /starts with the same fundamental purposes—Growth, Stability, and Liquidity—but gives selected investment ideas an additional, clearly defined purpose/
);
assert.match(
  EXPECTED_EXPLANATIONS.BFO.engaged,
  /keeps Growth, Stability, and Liquidity as the foundation while giving more of your investment interests their own defined purposes/
);

for (const [
  archetypeId,
  variantId
] of [
  ['BFO', 'intentional'],
  ['FT', 'intentional'],
  ['TO', 'engaged'],
  ['IP', 'essential']
]) {
  const resolved =
    presentResolvedExplanation(
      archetypeId,
      variantId
    );

  const html =
    renderVariantExplanation({
      ...resolved,
      portfolioFamily:
        FAMILY_NAMES[archetypeId],
      variantDisplayName:
        VARIANT_NAMES[variantId]
    });

  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  assert.ok(
    text.includes(
      `We recommend an ${VARIANT_NAMES[variantId]} version of the ${FAMILY_NAMES[archetypeId]} system — and this is why`
    ),
    `${archetypeId} + ${variantId} should render its resolved heading`
  );
  assert.ok(
    text.includes(
      EXPECTED_EXPLANATIONS[
        archetypeId
      ][variantId]
    ),
    `${archetypeId} + ${variantId} should render its exact paragraph`
  );
  assert.equal(
    (html.match(/<p\b/g) ?? []).length,
    1,
    'Variant explanation should contain one paragraph'
  );
  assert.doesNotMatch(
    text,
    /Portfolio evolution|Portfolio interaction|Portfolio decision making|(?:^|\s)(?:Low|Medium|High|Very High)(?:\s|$)|Why Intentional/,
    'Variant explanation should not expose prior impact UI'
  );
}

assert.equal(
  renderVariantExplanation({
    archetypeId: 'BFO',
    variantId: 'intentional',
    portfolioFamily:
      'Balanced Multi-Purpose',
    variantDisplayName:
      'Intentional'
  }),
  '',
  'Missing approved copy should omit the optional block'
);

console.log(
  'Variant explanation tests passed.'
);
