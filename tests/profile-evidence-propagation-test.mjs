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
  buildGroupedTraceability,
  getGroupedEvidenceFromAnswers
} from '../src/domain/investor-system-guidance/profile-evidence-presentation.js';

import {
  getInvestorNeedTraceability
} from '../src/content/investor-need-traceability-copy.js';

import {
  renderInvestingSystemJobs
} from '../src/features/recommendation/PortfolioSystemFitScreen.js';


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


const traceabilityInput = [
  {
    questionId: 'setup',
    questionLabel:
      'Setup question <unsafe>',
    responses: [
      {
        optionId: 'etfs_stocks',
        answerText:
          'ETFs & stocks <selected>'
      },
      {
        optionId: 'collected',
        answerText:
          'Collected investments'
      }
    ]
  },
  {
    questionId: 'transition',
    questionLabel:
      'Transition question',
    responses: [
      {
        optionId: 'unknown-option',
        answerText:
          'Must not be substituted'
      },
      {
        optionId: 'change',
        answerText:
          'Change response'
      }
    ]
  },
  {
    questionId: 'evolution',
    questionLabel:
      'Empty question',
    responses: []
  }
];

const traceabilityInputBefore =
  JSON.stringify(
    traceabilityInput
  );

const groupedTraceability =
  buildGroupedTraceability(
    traceabilityInput
  );

for (const invalidInput of [
  undefined,
  null,
  {},
  'setup'
]) {
  assert.deepEqual(
    buildGroupedTraceability(
      invalidInput
    ),
    [],
    'Invalid grouped traceability input should return an empty array'
  );
}

assert.deepEqual(
  buildGroupedTraceability([]),
  [],
  'Empty grouped traceability input should return an empty array'
);

assert.equal(
  JSON.stringify(traceabilityInput),
  traceabilityInputBefore,
  'Grouped traceability should not mutate its input'
);

assert.deepEqual(
  groupedTraceability.map(
    (group) =>
      group.questionId
  ),
  [
    'setup',
    'transition'
  ],
  'Grouped traceability should preserve question order and omit empty groups'
);

assert.equal(
  groupedTraceability[0]
    .questionLabel,
  'Setup question <unsafe>',
  'Grouped traceability should preserve the exact question label'
);

assert.deepEqual(
  groupedTraceability[0]
    .responses
    .map((response) => ({
      optionId:
        response.optionId,
      answerText:
        response.answerText
    })),
  [
    {
      optionId: 'etfs_stocks',
      answerText:
        'ETFs & stocks <selected>'
    },
    {
      optionId: 'collected',
      answerText:
        'Collected investments'
    }
  ],
  'Grouped traceability should preserve independent multi-select responses and their order'
);

for (const group of groupedTraceability) {
  for (const response of group.responses) {
    const expected =
      getInvestorNeedTraceability(
        group.questionId,
        response.optionId
      );

    assert.equal(
      response.investorNeed,
      expected.investorNeed,
      'Grouped traceability should return the exact investor need'
    );
    assert.strictEqual(
      response.portfolioConsequence,
      expected.portfolioConsequence,
      'Grouped traceability should return the exact consequence record'
    );
    assert.strictEqual(
      response.systemCapability,
      expected.systemCapability,
      'Grouped traceability should return the exact capability record'
    );
  }
}

assert.deepEqual(
  buildGroupedTraceability([
    {
      questionId: 'setup',
      questionLabel: 'Setup',
      responses: [
        {
          optionId: 'unknown-option',
          answerText: 'Unknown'
        }
      ]
    }
  ]),
  [],
  'Unknown mappings should be omitted without inference or substitution'
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

const profileContainerIndex =
  portfolioFitSource.indexOf(
    'id="profileAccountability"'
  );
const jobsContainerIndex =
  portfolioFitSource.indexOf(
    'id="investingSystemJobs"'
  );
const visualizationIndex =
  portfolioFitSource.indexOf(
    'id="portfolioVisualizationSection"'
  );
const mainScreenSource =
  portfolioFitSource.slice(
    portfolioFitSource.indexOf(
      'export function renderPortfolioSystemFit'
    )
  );

assert.ok(
  profileContainerIndex >= 0 &&
  jobsContainerIndex >
    profileContainerIndex &&
  visualizationIndex >
    jobsContainerIndex,
  'Investing system jobs should appear after accountability and before visualization'
);

assert.doesNotMatch(
  mainScreenSource,
  /id="recommendationExplainability"|recommendationExplainabilityContainer|renderRecommendationExplainability\(/,
  'PortfolioSystemFitScreen should not insert the recommendation explainability block'
);

for (const removedHeading of [
  'WHY THIS SYSTEM FITS YOUR ANSWERS',
  'Why this system rose to the top',
  'What your answers say your system needs',
  'How your recommended system provides that',
  'Why the Essential version',
  'Why the Intentional version',
  'Why the Engaged version'
]) {
  assert.ok(
    !mainScreenSource.includes(
      removedHeading
    ),
    `PortfolioSystemFitScreen should omit ${removedHeading}`
  );
}

for (const preservedHeading of [
  'ACCOUNTABLE TO YOUR INVESTOR PROFILE',
  'INVESTING SYSTEM JOBS TO BE DONE',
  'How your answers translate into system capabilities',
  'YOUR PORTFOLIO SYSTEM'
]) {
  assert.ok(
    portfolioFitSource.includes(
      preservedHeading
    ),
    `PortfolioSystemFitScreen should retain ${preservedHeading}`
  );
}

const investingSystemJobs =
  guidance
    .recommendationReveal
    .investingSystemJobs;
const investingSystemJobsHtml =
  renderInvestingSystemJobs(
    investingSystemJobs
  );

assert.match(
  investingSystemJobsHtml,
  /INVESTING SYSTEM JOBS TO BE DONE/,
  'Screen should render the exact investing-system-jobs pill'
);
assert.match(
  investingSystemJobsHtml,
  /How your answers translate into system capabilities/,
  'Screen should render the exact investing-system-jobs heading'
);
assert.equal(
  (investingSystemJobsHtml.match(/<th\b/g) ?? []).length,
  3,
  'Screen should render exactly three columns'
);
assert.equal(
  (investingSystemJobsHtml.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) ?? []).length,
  3,
  'Screen should render exactly three guidance rows'
);

let selectedResponseCount = 0;

for (const item of investingSystemJobs.items) {
  assert.ok(
    investingSystemJobsHtml.includes(
      item.guidanceIndication
    ),
    'Screen should render the accountability guidance indication'
  );

  for (const group of item.whatYouToldUsGrouped) {
    for (const response of group.responses) {
      selectedResponseCount += 1;
      assert.ok(
        investingSystemJobsHtml.includes(
          response.answerText
        ),
        'Screen should render each accountability response'
      );
    }
  }

  for (const group of item.traceabilityGrouped) {
    for (const response of group.responses) {
      assert.ok(!investingSystemJobsHtml.includes(response.investorNeed));
      assert.ok(!investingSystemJobsHtml.includes(response.portfolioConsequence.label));
      assert.ok(!investingSystemJobsHtml.includes(response.portfolioConsequence.copy));
      assert.ok(investingSystemJobsHtml.includes(response.systemCapability.label));
      assert.ok(investingSystemJobsHtml.includes(response.systemCapability.copy));
    }
  }
}

assert.equal(
  (investingSystemJobsHtml.match(/class="traceability-response-block"/g) ?? []).length,
  selectedResponseCount,
  'Every selected response should render one independent capability block'
);

assert.ok(
  !investingSystemJobsHtml.includes(
    'Investor need and portfolio consequence'
  ),
  'Removed need/consequence header should not render'
);
assert.ok(
  !investingSystemJobsHtml.includes(
    'traceability-consequence'
  ),
  'Removed need/consequence structure should not render'
);

const escapedHtml =
  renderInvestingSystemJobs({
    title: '<script>title</script>',
    columns: [
      '<b>one</b>',
      'two & three',
      'four'
    ],
    items: [
      {
        guidanceIndication:
          '<img src=x>',
        whatYouToldUsGrouped: [
          {
            questionLabel:
              '<unsafe question>',
            responses: [
              {
                answerText:
                  '<unsafe answer>'
              }
            ]
          }
        ],
        traceabilityGrouped: [
          {
            questionLabel:
              '<unsafe question>',
            responses: [
              {
                investorNeed:
                  '<unsafe need>',
                portfolioConsequence: {
                  label: '<unsafe consequence>',
                  copy: 'copy & more'
                },
                systemCapability: {
                  label: '<unsafe capability>',
                  copy: 'capability & more'
                }
              }
            ]
          }
        ]
      }
    ]
  });

assert.ok(!escapedHtml.includes('<script>'));
assert.ok(!escapedHtml.includes('<img src=x>'));
assert.ok(!escapedHtml.includes('<unsafe'));
assert.match(escapedHtml, /&lt;b&gt;one&lt;\/b&gt;/);
assert.match(escapedHtml, /&lt;img src=x&gt;/);
assert.match(escapedHtml, /two &amp; three/);
assert.match(escapedHtml, /capability &amp; more/);

for (const invalidModel of [
  undefined,
  null,
  {},
  { items: [] }
]) {
  assert.equal(
    renderInvestingSystemJobs(
      invalidModel
    ),
    '',
    'Missing investing-system-jobs data should render safely as empty output'
  );
}

for (const invalidOutput of [
  'undefined',
  'null',
  '[object Object]'
]) {
  assert.ok(
    !investingSystemJobsHtml.includes(
      invalidOutput
    ),
    `Screen output should not contain ${invalidOutput}`
  );
}

assert.match(portfolioFitSource, /renderProfileAccountability/);
assert.match(portfolioFitSource, /renderInvestingSystemJobs/);
assert.match(portfolioFitSource, /portfolioVisualizationSection/);
assert.match(portfolioFitSource, /id="backBtn"/);
assert.match(portfolioFitSource, /id="restartBtn"/);


console.log(
  'Cross-screen profile evidence propagation tests passed.'
);
