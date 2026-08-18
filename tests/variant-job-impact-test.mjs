import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ARCHETYPE_PHILOSOPHIES
} from '../src/domain/portfolio-philosophy/archetype-philosophies.js';

import {
  resolvePortfolioJobFit
} from '../src/domain/portfolio-philosophy/portfolio-job-fit-resolver.js';

import {
  presentPortfolioJobFit
} from '../src/domain/portfolio-philosophy/portfolio-job-fit-presenter.js';

import {
  presentInvestorSystemGuidance
} from '../src/domain/investor-system-guidance/investor-system-guidance-presenter.js';

import {
  renderVariantExplanation
} from '../src/features/recommendation/PortfolioSystemFitScreen.js';


const EXPECTED_VARIANT_JOB_IMPACT = Object.freeze({
  ES: Object.freeze({
    evolution: Object.freeze({ level: 'Low' }),
    interaction: Object.freeze({ level: 'High' }),
    decisionMaking: Object.freeze({ level: 'Medium' }),
    mainReason:
      'Accommodate involvement without losing simplicity'
  }),
  GD: Object.freeze({
    evolution: Object.freeze({ level: 'Medium' }),
    interaction: Object.freeze({ level: 'High' }),
    decisionMaking: Object.freeze({ level: 'Medium–High' }),
    mainReason:
      'More deliberate diversification'
  }),
  FT: Object.freeze({
    evolution: Object.freeze({ level: 'Medium' }),
    interaction: Object.freeze({ level: 'High' }),
    decisionMaking: Object.freeze({ level: 'High' }),
    mainReason:
      'Research/evaluate systematic improvements'
  }),
  BFO: Object.freeze({
    evolution: Object.freeze({ level: 'High' }),
    interaction: Object.freeze({ level: 'High' }),
    decisionMaking: Object.freeze({ level: 'Medium' }),
    mainReason:
      'More differentiated capital jobs'
  }),
  GA: Object.freeze({
    evolution: Object.freeze({ level: 'Medium' }),
    interaction: Object.freeze({ level: 'High' }),
    decisionMaking: Object.freeze({ level: 'High' }),
    mainReason:
      'Research differentiated return sources'
  }),
  TO: Object.freeze({
    evolution: Object.freeze({ level: 'Medium' }),
    interaction: Object.freeze({ level: 'High' }),
    decisionMaking: Object.freeze({ level: 'Very High' }),
    mainReason:
      'Accommodate bounded active judgment'
  }),
  IP: Object.freeze({
    evolution: Object.freeze({ level: 'High' }),
    interaction: Object.freeze({ level: 'Medium' }),
    decisionMaking: Object.freeze({ level: 'High' }),
    mainReason:
      'Coordinate real-world capital needs'
  })
});


const normalizedAnswers = {
  setup: [
    'etfs_stocks',
    'collected'
  ],
  transition: [
    'doing_right',
    'compare'
  ],
  decisionStyle: [
    'fit',
    'enough'
  ],
  marketPsychology:
    'holding',
  evolution:
    'effort',
  tradeoff:
    'periodic',
  age:
    '10plus',
  goals: [
    'choose'
  ]
};


for (const [
  archetypeId,
  expectedImpact
] of Object.entries(
  EXPECTED_VARIANT_JOB_IMPACT
)) {
  const philosophy =
    ARCHETYPE_PHILOSOPHIES[
      archetypeId
    ];

  assert.deepEqual(
    philosophy.variantJobImpact,
    expectedImpact,
    `Exact domain matrix mismatch for ${archetypeId}`
  );

  const fitResult =
    resolvePortfolioJobFit({
      archetypeId,
      stageId:
        'system_builder',
      styleId:
        'systematic_improver',
      modifierId:
        'validation_seeker',
      normalizedAnswers
    });

  const fitResultBefore =
    structuredClone(
      fitResult
    );

  const recommendationBefore =
    structuredClone(
      fitResult.recommendation
    );

  const sleevesBefore =
    structuredClone(
      fitResult.sleeves
    );

  const fitPresentation =
    presentPortfolioJobFit(
      fitResult
    );

  assert.deepEqual(
    fitPresentation
      .philosophy
      .archetype
      .variantJobImpact,
    {
      archetypeId,
      ...expectedImpact
    },
    `Portfolio presenter should expose ${archetypeId} impact unchanged`
  );

  assert.equal(
    fitPresentation
      .philosophy
      .archetype
      .id,
    archetypeId,
    'Presenter must preserve the resolved archetype'
  );

  assert.equal(
    fitPresentation
      .philosophy
      .archetype
      .title,
    philosophy.philosophyName,
    'Presenter must preserve philosophy name'
  );

  assert.equal(
    fitPresentation
      .philosophy
      .variant
      .id,
    fitResult
      .recommendation
      .variantId,
    'Presenter must preserve the resolved variant'
  );

  const guidance =
    presentInvestorSystemGuidance(
      fitPresentation
    );

  assert.deepEqual(
    guidance
      .recommendationReveal
      .variantJobImpact,
    {
      archetypeId,
      ...expectedImpact
    },
    `Guidance presenter should pass through ${archetypeId} impact unchanged`
  );

  assert.deepEqual(
    fitResult.recommendation,
    recommendationBefore,
    'Variant-impact presentation must not change the recommendation'
  );

  assert.deepEqual(
    fitResult.sleeves,
    sleevesBefore,
    'Variant-impact presentation must not change sleeves'
  );

  const resolvedVariantId =
    guidance.resolved.variantId;

  const expectedExplanation =
    philosophy
      .variantExplanations
      [resolvedVariantId]
      .copy;

  assert.deepEqual(
    guidance
      .recommendationReveal
      .variantExplanation,
    {
      archetypeId,
      variantId:
        resolvedVariantId,
      portfolioFamily:
        guidance
          .recommendationReveal
          .archetypeDisplayName,
      copy:
        expectedExplanation
    },
    'Guidance should expose only the already-resolved explanation'
  );

  const renderedHtml =
    renderVariantExplanation(
      {
        ...guidance
          .recommendationReveal
          .variantExplanation,
        variantDisplayName:
          guidance
            .recommendationReveal
            .variantDisplayName
      }
    );

  const renderedText =
    renderedHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  assert.ok(
    renderedText.includes(
      `We recommend an ${guidance.recommendationReveal.variantDisplayName} version of the ${guidance.recommendationReveal.archetypeDisplayName} system — and this is why`
    ),
    `${archetypeId} should render the personalized heading`
  );

  assert.equal(
    (
      renderedHtml.match(
        /class="summary-item"/g
      ) ?? []
    ).length,
    1,
    'Variant explanation should use one shared container'
  );

  assert.equal(
    (
      renderedHtml.match(
        /<strong>/g
      ) ?? []
    ).length,
    1,
    'Only the heading should be bold'
  );

  assert.ok(
    renderedText.includes(
      expectedExplanation
    ),
    `${archetypeId} should render its resolved approved paragraph`
  );

  assert.doesNotMatch(
    renderedText,
    /Portfolio evolution|Portfolio interaction|Portfolio decision making|Main reason for the higher variant|Why Essential|Why Intentional|Why Engaged/,
    'Separate dimension labels should not remain visible'
  );

  assert.doesNotMatch(
    renderedText,
    /(?:^|\s)(?:Low|Medium|High|Medium–High|Very High)(?:\s|$)/,
    'Raw matrix levels should not remain visible'
  );

  assert.doesNotMatch(
    renderedText,
    /higher return|better return|more return|outperformance|higher expected return/i,
    'Variant-impact copy must not imply a return promise'
  );

  assert.deepEqual(
    fitResult,
    fitResultBefore,
    'Explanation presentation must not mutate any resolved assessment, portfolio, effort, cadence, or JTBD output'
  );
}


assert.equal(
  renderVariantExplanation(),
  '',
  'Missing explanation data should not render a block'
);

assert.equal(
  renderVariantExplanation({
    archetypeId: 'FT',
    variantId: 'intentional'
  }),
  '',
  'Incomplete impact data should not render undefined values'
);


const screenSource = readFileSync(
  new URL(
    '../src/features/recommendation/PortfolioSystemFitScreen.js',
    import.meta.url
  ),
  'utf8'
);

const heroSource =
  screenSource.slice(
    screenSource.indexOf(
      'id="recommendationEyebrow"'
    ),
    screenSource.indexOf(
      'id="profileAccountability"'
    )
  );

const investorProblemIndex =
  heroSource.indexOf(
    'WHAT THIS PORTFOLIO SYSTEM IS DESIGNED TO SOLVE'
  );

const variantImpactIndex =
  heroSource.indexOf(
    'id="heroVariantJobImpact"'
  );

const philosophyIndex =
  heroSource.indexOf(
    'Portfolio philosophy'
  );

assert.ok(
  investorProblemIndex >= 0 &&
    variantImpactIndex > investorProblemIndex &&
    philosophyIndex > variantImpactIndex,
  'Variant-impact block should appear between investor problem and philosophy content'
);


console.log(
  'Variant job impact tests passed.'
);
