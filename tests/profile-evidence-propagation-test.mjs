import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  QUESTIONS
} from '../src/content/questions.js';

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
  getGroupedEvidenceFromAnswers
} from '../src/domain/investor-system-guidance/profile-evidence-presentation.js';


const normalizedAnswers = {
  setup: [
    'etfs_stocks',
    'collected'
  ],
  transition: [
    'what_to_do',
    'change'
  ],
  decisionStyle: [
    'start',
    'fit'
  ],
  marketPsychology:
    'holding',
  evolution:
    'experiment',
  tradeoff:
    'periodic',
  age:
    '10plus',
  goals: [
    'choose'
  ]
};

const assessmentResult = {
  archetypeId: 'FT',
  stageId:
    'adaptive_investor',
  styleId:
    'systematic_improver',
  modifierId:
    'validation_seeker',
  normalizedAnswers
};

const fitResult =
  resolvePortfolioJobFit(
    assessmentResult
  );

const fitPresentation =
  presentPortfolioJobFit(
    fitResult
  );

const guidance =
  presentInvestorSystemGuidance(
    fitPresentation
  );

const accountabilityById =
  Object.fromEntries(
    guidance
      .recommendationReveal
      .profileAccountability
      .items
      .map(
        (item) => [
          item.id,
          item
        ]
      )
  );

const dimensions = [
  {
    profileDimension: 'stage',
    accountabilityId: 'stage'
  },
  {
    profileDimension: 'style',
    accountabilityId: 'style'
  },
  {
    profileDimension: 'behavior',
    accountabilityId: 'behavior'
  }
];

for (const {
  profileDimension,
  accountabilityId
} of dimensions) {
  const investorProfileEvidence =
    getGroupedEvidenceFromAnswers(
      normalizedAnswers,
      profileDimension
    );

  const portfolioFitEvidence =
    accountabilityById[
      accountabilityId
    ].whatYouToldUsGrouped;

  assert.deepEqual(
    portfolioFitEvidence,
    investorProfileEvidence,
    `${profileDimension} evidence should match exactly across screens`
  );

  assert.equal(
    new Set(
      portfolioFitEvidence.map(
        (group) =>
          group.questionId
      )
    ).size,
    portfolioFitEvidence.length,
    `${profileDimension} should render one group per question`
  );

  for (const group of portfolioFitEvidence) {
    assert.equal(
      new Set(
        group.responses.map(
          (response) =>
            `${group.questionId}|${response.optionId}`
        )
      ).size,
      group.responses.length,
      `${group.questionId} should not duplicate selected options`
    );
  }
}


assert.deepEqual(
  accountabilityById
    .stage
    .whatYouToldUsGrouped
    .map(
      (group) => ({
        questionId:
          group.questionId,
        optionIds:
          group.responses.map(
            (response) =>
              response.optionId
          )
      })
    ),
  [
    {
      questionId: 'setup',
      optionIds: [
        'etfs_stocks',
        'collected'
      ]
    },
    {
      questionId: 'evolution',
      optionIds: [
        'experiment'
      ]
    }
  ],
  'Stage should preserve both setup answers, their order, and one setup group'
);

assert.deepEqual(
  accountabilityById
    .style
    .whatYouToldUsGrouped
    .map(
      (group) =>
        group.questionId
    ),
  [
    'tradeoff',
    'marketPsychology'
  ],
  'Style question order should match InvestorProfileScreen'
);

assert.deepEqual(
  accountabilityById
    .behavior
    .whatYouToldUsGrouped
    .map(
      (group) => ({
        questionId:
          group.questionId,
        optionIds:
          group.responses.map(
            (response) =>
              response.optionId
          )
      })
    ),
  [
    {
      questionId: 'transition',
      optionIds: [
        'what_to_do',
        'change'
      ]
    },
    {
      questionId: 'decisionStyle',
      optionIds: [
        'start',
        'fit'
      ]
    }
  ],
  'Behavior should preserve all multi-select answers and their order'
);


for (const questionId of [
  'tradeoff',
  'marketPsychology'
]) {
  const question =
    QUESTIONS.find(
      (item) =>
        item.screenKey ===
        questionId
    );

  assert.equal(
    question.max,
    1,
    `${questionId} is single-select and should not receive an invalid multi-select fixture`
  );
}


assert.deepEqual(
  accountabilityById
    .stage
    .whatYouToldUs
    .filter(
      (answer) =>
        answer.questionId ===
        'setup'
    )
    .map(
      (answer) =>
        answer.optionId
    ),
  [
    'etfs_stocks',
    'collected'
  ],
  'The additive grouped view must not replace or reduce raw flat evidence'
);


const investorProfileSource =
  readFileSync(
    new URL(
      '../src/features/recommendation/InvestorProfileScreen.js',
      import.meta.url
    ),
    'utf8'
  );

const portfolioFitSource =
  readFileSync(
    new URL(
      '../src/features/recommendation/PortfolioSystemFitScreen.js',
      import.meta.url
    ),
    'utf8'
  );

assert.match(
  investorProfileSource,
  /getGroupedEvidenceFromAnswers/,
  'InvestorProfileScreen should use the shared grouping path'
);

assert.match(
  portfolioFitSource,
  /whatYouToldUsGrouped/,
  'PortfolioSystemFitScreen should render the additive grouped evidence'
);


console.log(
  'Cross-screen profile evidence propagation tests passed.'
);
